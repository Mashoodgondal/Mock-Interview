"use client";

import { useState } from 'react';
import { chatSession } from '../../../utils/gemini';
import { db } from '../../../utils/db';
import { MockInterview } from '../../../utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import { useRouter } from 'next/navigation';

const NewInterview = () => {
    const [open, setOpen] = useState(false);
    const [jobPosition, setjobPosition] = useState();
    const [jobDescription, setjobDescription] = useState();
    const [jobExperience, setjobExperience] = useState();
    const [loading, setloading] = useState(false);
    const [jsonResp, setjsonResp] = useState([]);
    const { user } = useUser();
    const router = useRouter();




    // const SubmitHandler = async (e) => {
    //     e.preventDefault();

    //     if (!jobPosition || !jobDescription || !jobExperience) {
    //         alert("Please fill in all the fields: Job Position, Description, and Experience.");
    //         return;
    //     }

    //     setloading(true);

    //     const InputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${jobExperience}. Based on these, provide ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions and answers in JSON format. Include 'question' and 'answer' fields.`;


    //     const result = await chatSession.sendMessage(InputPrompt);


    //     const rawText = await result.response.text();
    //     // console.log("Raw Gemini response:\n", rawText);


    //     const MockjsonResp = rawText.replace('```json', '').replace('```', '');
    //     // setjsonResp(MockjsonResp);
    //     // console.log(MockjsonResp)
    //     let parsedJson;
    //     try {
    //         parsedJson = JSON.parse(MockjsonResp);
    //         console.log("Parsed questions/answers:", parsedJson); // ✅ See array in terminal
    //         setjsonResp(MockjsonResp);
    //     } catch (err) {
    //         console.error("Failed to parse JSON response:", err);
    //         alert("Invalid response format. Please try again.");
    //         setloading(false);
    //         return;
    //     }


    //     const newMockid = uuidv4();

    //     await db.insert(MockInterview).values({
    //         mockId: newMockid,
    //         jsonMockResp: MockjsonResp,
    //         jobPosition,
    //         jobDesc: jobDescription,
    //         jobExperience,
    //         createdBy: user?.primaryEmailAddress?.emailAddress,
    //         createdAt: moment().format('DD-MM-YYYY')
    //     }).returning({ mockId: MockInterview.mockId });
    //     router.push(`dashboard/interview/${newMockid}`);
    //     setOpen(false);


    //     setloading(false);
    // };



    const SubmitHandler = async (e) => {
        e.preventDefault();

        if (!jobPosition || !jobDescription || !jobExperience) {
            alert("Please fill in all the fields: Job Position, Description, and Experience.");
            return;
        }

        setloading(true);

        const InputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${jobExperience}. Based on these, provide ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions and answers in JSON format. Include 'question' and 'answer' fields.`;

        try {
            const result = await chatSession.sendMessage(InputPrompt);
            const rawText = await result.response.text();

            const MockjsonResp = rawText.replace('```json', '').replace('```', '');

            let parsedJson;
            try {
                parsedJson = JSON.parse(MockjsonResp);
                console.log("Parsed questions/answers:", parsedJson);
                setjsonResp(MockjsonResp);
                // console.log("json response", MockjsonResp)

            } catch (err) {
                console.error("Failed to parse JSON response:", err);
                alert("Invalid response format from AI. Please try again.");
                return;
            }

            const newMockid = uuidv4();

            // Insert into database
            try {
                const inserted = await db.insert(MockInterview).values({
                    mockId: newMockid,
                    jsonMockResp: MockjsonResp,
                    jobPosition,
                    jobDesc: jobDescription,
                    jobExperience,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD-MM-YYYY')
                }).returning({ mockId: MockInterview.mockId });

                if (inserted.length > 0) {
                    alert("Interview questions successfully saved!");
                    router.push(`dashboard/interview/${newMockid}`);
                    setOpen(false);
                } else {
                    alert("Something went wrong. Data was not saved.");
                }
            } catch (dbErr) {
                console.error("Database insert error:", dbErr);
                alert("Error saving data to database. Please check server logs.");
            }

        } catch (err) {
            console.error("Error during API call or processing:", err);
            alert("Something went wrong. Please try again later.");
        } finally {
            setloading(false);
        }
    };






    return (
        <div>
            <div
                onClick={() => setOpen(true)}
                className="group p-10 border-2 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900 dark:via-slate-900 dark:to-blue-950 border-blue-300 dark:border-blue-700 
             hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-center"
            >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-blue-600 dark:text-blue-300 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <span className="text-3xl font-bold">+</span>
                </div>
                <h2 className="mt-4 text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-wide">
                    Add New Interview
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Start a new AI-powered interview session
                </p>
            </div>

            {/* <div
                onClick={() => setOpen(true)}
                className='p-10 border-2 border-dashed border-blue-300 rounded-xl bg-blue-100 dark:bg-blue-900 dark:border-blue-500 hover:scale-105 hover:shadow-md cursor-pointer transition-all'
            >
                <h2 className='text-lg text-center text-gray-900 dark:text-gray-100'>Add New +</h2>
            </div> */}

            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700">
                        {/* Modal Header */}
                        <div className="p-6 pb-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Interview Details</h3>
                                    <p className="text-gray-500 dark:text-gray-300 mt-1">Tell us about the position you're hiring for</p>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Job Position*</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Frontend Developer"
                                        onChange={(e) => setjobPosition(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Tech Stack*</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="React, Next.js, Tailwind CSS"
                                        onChange={(e) => setjobDescription(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Experience (Years)*</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={20}
                                        required
                                        placeholder="5"
                                        onChange={(e) => setjobExperience(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={SubmitHandler}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : 'Start Interview'}
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


