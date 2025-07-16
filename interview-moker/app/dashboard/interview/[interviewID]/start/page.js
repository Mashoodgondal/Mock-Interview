












"use client"
import { db } from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react"
// import { useParams } from "next/navigation";


import RecaurdAnswer from "./_components/recaurdAnswer";
import QuestionSection from "./_components/questionSection";


function StartInterview({ params }) {
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);


    useEffect(() => {
        console.log("params:", params);
        console.log("interviewId:", params?.interviewId);
        fetchData();
    }, []);



    const fetchData = async () => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));

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
        }
    };





    const handleQuestionClick = (index) => {
        setActiveIndex(index);
    };
    console.log("Above of  loading is working");

    // useEffect(() => {
    //     if (interviewId) {

    //         fetchData(interviewId);
    //     }
    // }, [interviewId]);

    if (loading) return <div className="p-4 text-blue-500"> Loading interview data...</div>
    console.log("Below of loading is working");




    // if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    // if (!mockInterviewQuestions) return <div className="p-4">No questions available</div>;
    // if (!mockInterviewQuestions || mockInterviewQuestions.length === 0) {
    //     return <div className="p-4 text-red-500">
    //         No questions available. Make sure your interview data has valid `jsonMockResp` with at least one question.
    //     </div>;
    // }




    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                <QuestionSection
                    questions={mockInterviewQuestions}
                    activeIndex={activeIndex}
                    isLoading={loading}
                    error={error}
                    onQuestion={handleQuestionClick}
                />



                <RecaurdAnswer
                    questions={mockInterviewQuestions}
                    activeIndex={activeIndex}
                    interviewData={interviewData}
                />

            </div>
        </div>
    );
}

export default StartInterview;
























