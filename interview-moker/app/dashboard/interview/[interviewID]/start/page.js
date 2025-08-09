


"use client"
import { db } from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react"
import { useParams } from "next/navigation";

import RecaurdAnswer from "./_components/recaurdAnswer";
import QuestionSection from "./_components/questionSection";

function StartInterview() {
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
    const [loading, setLoading] = useState(true); // Set to true initially
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const params = useParams();

    useEffect(() => {
        console.log("params:", params);
        console.log("interviewID:", params?.interviewID);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewID));

            if (result.length === 0) {
                console.error("No interview found with this Id");
                setError("No interview found");
                return;
            }

            const jsonMockResp = JSON.parse(result[0].jsonMockResp);
            setMockInterviewQuestions(jsonMockResp);
            setInterviewData(result[0]);
        } catch (error) {
            console.log("Error in fetchData:", error);
            setError("Failed to load interview");
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionClick = (index) => {
        setActiveIndex(index);
    };

    const handleNextQuestion = () => {
        if (activeIndex < mockInterviewQuestions.length - 1) {
            setActiveIndex(prev => prev + 1);
        }
    };

    return (
        <div className="px-4 py-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Mock Interview
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {interviewData?.jobPosition && !loading ?
                            `Position: ${interviewData.jobPosition}` :
                            'Practice your interview skills'
                        }
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                    {/* Questions Section - Fixed Height */}
                    <div className="order-1 lg:order-1">
                        <QuestionSection
                            questions={mockInterviewQuestions}
                            activeIndex={activeIndex}
                            isLoading={loading}
                            error={error}
                            onQuestion={handleQuestionClick}
                        />
                    </div>

                    {/* Answer Recording Section - Fixed Height */}
                    <div className="order-2 lg:order-2">
                        <RecaurdAnswer
                            questions={mockInterviewQuestions}
                            activeIndex={activeIndex}
                            interviewData={interviewData}
                            onNextQuestion={handleNextQuestion}
                            isLoading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StartInterview;




