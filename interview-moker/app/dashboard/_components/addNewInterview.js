





"use client";

import { useState } from 'react';
import { chatSession } from '../../../utils/gemini';
import { db } from '../../../utils/db';
import { MockInterview } from '../../../utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import { useRouter } from 'next/navigation';
import { eq } from "drizzle-orm";
import { toast } from 'react-hot-toast';

const NewInterview = () => {
    const [open, setOpen] = useState(false);
    const [jobPosition, setjobPosition] = useState('');
    const [jobDescription, setjobDescription] = useState('');
    const [jobExperience, setjobExperience] = useState('');
    const [loading, setloading] = useState(false);
    const [jsonResp, setjsonResp] = useState([]);
    const { user } = useUser();
    const router = useRouter();

    const getRandomPromptVariation = (position, description, experience) => {
        const variations = [
            `Job position: ${position}, Job Description: ${description}, Years of Experience: ${experience}. Generate exactly ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} unique and diverse interview questions with detailed answers. Return ONLY a valid JSON array where each object has exactly these fields: "question" and "answer". No additional text, explanations, or formatting. Example format: [{"question":"What is...?","answer":"The answer is..."}]`,

            `For a ${position} role with ${experience} years of experience and tech stack: ${description}. Create exactly ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} challenging interview questions. Return ONLY valid JSON array format: [{"question":"question text","answer":"answer text"}]. No markdown, no extra text, just pure JSON.`,

            `Position: ${position} | Experience: ${experience} years | Stack: ${description}. Design exactly ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions covering technical and behavioral aspects. CRITICAL: Return only valid JSON array with structure [{"question":"...","answer":"..."}]. No code blocks, no explanations.`,

            `Create exactly ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions for ${position} position requiring ${experience} years experience with ${description}. Response must be ONLY a valid JSON array: [{"question":"question here","answer":"detailed answer here"}]. No additional formatting or text.`,

            `Generate exactly ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} comprehensive interview questions for ${position} role (${experience} years exp) using ${description}. IMPORTANT: Respond with ONLY valid JSON array format [{"question":"...","answer":"..."}]. Ensure all quotes are properly escaped.`
        ];

        const timestamp = Date.now();
        const randomIndex = (timestamp % variations.length);
        const selectedPrompt = variations[randomIndex];

        return selectedPrompt + ` Make questions unique and avoid repetition. Session ID: ${timestamp}. REMINDER: Response must be valid JSON array only.`;
    };
    const SubmitHandler = async (e) => {
        if (e) e.preventDefault();

        if (!jobPosition || !jobDescription || !jobExperience) {
            toast.error("Please fill in all the fields: Job Position, Description, and Experience.");
            return;
        }

        setloading(true);
        const loadingToast = toast.loading("Generating interview questions...");

        try {
            const InputPrompt = getRandomPromptVariation(jobPosition, jobDescription, jobExperience);
            const newMockid = uuidv4();

            const [aiResult] = await Promise.all([
                chatSession.sendMessage(InputPrompt),
                db.insert(MockInterview).values({
                    mockId: newMockid,
                    jsonMockResp: JSON.stringify([]),
                    jobPosition,
                    jobDesc: jobDescription,
                    jobExperience,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD-MM-YYYY')
                })
            ]);

            const rawText = await aiResult.response.text();

            let cleanedJson = rawText
                .replace(/```json/gi, '')
                .replace(/```/g, '')
                .replace(/^\s*[\r\n]+/gm, '')
                .trim();

            const jsonStart = cleanedJson.indexOf('[') !== -1 ? cleanedJson.indexOf('[') : cleanedJson.indexOf('{');
            const jsonEnd = cleanedJson.lastIndexOf(']') !== -1 ? cleanedJson.lastIndexOf(']') + 1 : cleanedJson.lastIndexOf('}') + 1;

            if (jsonStart !== -1 && jsonEnd !== -1) {
                cleanedJson = cleanedJson.substring(jsonStart, jsonEnd);
            }

            let parsedJson;
            let MockjsonResp;

            try {
                parsedJson = JSON.parse(cleanedJson);
                MockjsonResp = cleanedJson;
            } catch (firstError) {
                try {
                    let fixedJson = cleanedJson
                        .replace(/,(\s*[}\]])/g, '$1')
                        .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
                        .replace(/:\s*'([^']*)'/g, ': "$1"')
                        .replace(/\\n/g, '\\\\n')
                        .replace(/\n/g, ' ')
                        .replace(/\r/g, '')
                        .replace(/\t/g, ' ')
                        .replace(/\\/g, '\\\\')
                        .replace(/\\\\"/g, '\\"')
                        .replace(/\\\\n/g, '\\n');

                    parsedJson = JSON.parse(fixedJson);
                    MockjsonResp = fixedJson;
                } catch (secondError) {
                    try {
                        const questionPattern = /"question"\s*:\s*"([^"]+(?:\\.[^"]*)*)"/g;
                        const answerPattern = /"answer"\s*:\s*"([^"]+(?:\\.[^"]*)*)"/g;

                        const questions = [];
                        const answers = [];

                        let questionMatch;
                        while ((questionMatch = questionPattern.exec(cleanedJson)) !== null) {
                            questions.push(questionMatch[1]);
                        }

                        let answerMatch;
                        while ((answerMatch = answerPattern.exec(cleanedJson)) !== null) {
                            answers.push(answerMatch[1]);
                        }

                        if (questions.length > 0 && answers.length > 0 && questions.length === answers.length) {
                            parsedJson = questions.map((question, index) => ({
                                question: question.replace(/\\"/g, '"').replace(/\\n/g, '\n'),
                                answer: answers[index].replace(/\\"/g, '"').replace(/\\n/g, '\n')
                            }));
                            MockjsonResp = JSON.stringify(parsedJson, null, 2);
                        } else {
                            throw new Error("Could not extract valid question-answer pairs");
                        }
                    } catch (thirdError) {
                        console.error("All JSON parsing attempts failed");
                        toast.dismiss(loadingToast);
                        toast.error("Failed to generate valid interview data.");
                        return;
                    }
                }
            }

            if (!Array.isArray(parsedJson) || parsedJson.length === 0) return;

            const isValidStructure = parsedJson.every(item =>
                item &&
                typeof item === 'object' &&
                typeof item.question === 'string' &&
                typeof item.answer === 'string' &&
                item.question.trim().length > 0 &&
                item.answer.trim().length > 0
            );

            if (!isValidStructure) return;

            setjsonResp(MockjsonResp);
            setOpen(false);

            // Redirect immediately
            router.push(`dashboard/interview/${newMockid}`);

            // Update DB in the background
            try {
                await db.update(MockInterview)
                    .set({ jsonMockResp: MockjsonResp })
                    .where(eq(MockInterview.mockId, newMockid));
            } catch (dbErr) {
                console.error("Database update error:", dbErr);
            }

            toast.dismiss(loadingToast);
            toast.success("Redirecting to interview setup...");

        } catch (err) {
            console.error("Error during API call or processing:", err);
            toast.dismiss(loadingToast);
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setloading(false);
        }
    };






    return (
        <div>
            <div
                onClick={() => !loading && setOpen(true)}
                className={`group p-10 border-2 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900 dark:via-slate-900 dark:to-blue-950 border-blue-300 dark:border-blue-700 
                ${loading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-xl hover:scale-105 cursor-pointer'
                    } transition-all duration-300 text-center flex flex-col items-center justify-center`}
            >
                <div className={`w-16 h-16 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-blue-600 dark:text-blue-300 ${!loading && 'group-hover:scale-110'} transition-transform duration-300 shadow-md`}>
                    {loading ? (
                        <svg className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <span className="text-3xl font-bold">+</span>
                    )}
                </div>
                <h2 className="mt-4 text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-wide">
                    {loading ? "Processing..." : "Add New Interview"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {loading ? "Setting up your interview" : "Start a new AI-powered interview session"}
                </p>
            </div>

            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="p-6 pb-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Interview Details</h3>
                                    <p className="text-gray-500 dark:text-gray-300 mt-1">Tell us about the position you're hiring for</p>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    disabled={loading}
                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <form
                                className="space-y-4"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !loading) {
                                        e.preventDefault();
                                        SubmitHandler();
                                    }
                                }}
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        Job Position*
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        disabled={loading}
                                        placeholder="Frontend Developer"
                                        onChange={(e) => setjobPosition(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed cursor-text"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        Tech Stack*
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        disabled={loading}
                                        placeholder="React, Next.js, Tailwind CSS"
                                        onChange={(e) => setjobDescription(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed cursor-text resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        Experience (Years)*
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={15}
                                        required
                                        disabled={loading}
                                        placeholder="5"
                                        onChange={(e) => setjobExperience(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed cursor-text"
                                    />
                                </div>
                            </form>

                            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setOpen(false)}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={SubmitHandler}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 cursor-pointer"
                                >
                                    {loading && (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {loading ? "Processing..." : "Start Interview"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewInterview;