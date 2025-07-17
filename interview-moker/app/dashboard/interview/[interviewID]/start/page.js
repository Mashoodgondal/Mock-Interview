// "use client"
// import { db } from "../../../../../utils/db";
// import { MockInterview } from "../../../../../utils/schema";
// import { eq } from "drizzle-orm";
// import { useEffect, useState } from "react"
// // import { useParams } from "next/navigation";


// import RecaurdAnswer from "./_components/recaurdAnswer";
// import QuestionSection from "./_components/questionSection";


// function StartInterview({ params }) {
//     const [interviewData, setInterviewData] = useState(null);
//     const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [activeIndex, setActiveIndex] = useState(0);


//     useEffect(() => {
//         console.log("params:", params);
//         console.log("interviewId:", params?.interviewId);
//         fetchData();
//     }, []);



//     const fetchData = async () => {
//         try {
//             const result = await db
//                 .select()
//                 .from(MockInterview)
//                 .where(eq(MockInterview.mockId, params.interviewId));

//             if (result.length === 0) {
//                 console.error("No interview found with this Id");
//                 setError("No interview found");
//                 return;
//             }

//             const jsonMockResp = JSON.parse(result[0].jsonMockResp);
//             setMockInterviewQuestions(jsonMockResp);
//             setInterviewData(result[0]);
//         } catch (error) {
//             console.log("Error in fetchData:", error);
//             setError("Failed to load interview");
//         }
//     };





//     const handleQuestionClick = (index) => {
//         setActiveIndex(index);
//     };
//     console.log("Above of  loading is working");

//     // useEffect(() => {
//     //     if (interviewId) {

//     //         fetchData(interviewId);
//     //     }
//     // }, [interviewId]);

//     if (loading) return <div className="p-4 text-blue-500"> Loading interview data...</div>
//     console.log("Below of loading is working");




//     // if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
//     // if (!mockInterviewQuestions) return <div className="p-4">No questions available</div>;
//     // if (!mockInterviewQuestions || mockInterviewQuestions.length === 0) {
//     //     return <div className="p-4 text-red-500">
//     //         No questions available. Make sure your interview data has valid `jsonMockResp` with at least one question.
//     //     </div>;
//     // }




//     return (
//         <div className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

//                 <QuestionSection
//                     questions={mockInterviewQuestions}
//                     activeIndex={activeIndex}
//                     isLoading={loading}
//                     error={error}
//                     onQuestion={handleQuestionClick}
//                 />



//                 <RecaurdAnswer
//                     questions={mockInterviewQuestions}
//                     activeIndex={activeIndex}
//                     interviewData={interviewData}
//                 />

//             </div>
//         </div>
//     );
// }

// export default StartInterview;










"use client"
import { db } from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react"
import RecaurdAnswer from "./_components/recaurdAnswer";
import QuestionSection from "./_components/questionSection";

function StartInterview({ params }) {
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
    const [loading, setLoading] = useState(true); // Set initial loading to true
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        console.log("params:", params);
        console.log("interviewId:", params?.interviewId);

        // Only fetch data if we have a valid interviewId
        if (params?.interviewId) {
            fetchData();
        } else {
            setError("No interview ID provided");
            setLoading(false);
        }
    }, [params?.interviewId]); // Add dependency

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log("🔍 Searching for interview with ID:", params.interviewId);
            console.log("🔍 ID type:", typeof params.interviewId);
            console.log("🔍 ID length:", params.interviewId?.length);

            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));

            console.log("📊 Database result:", result);
            console.log("📊 Result length:", result.length);

            // Let's also check what interviews exist in the database
            const allInterviews = await db.select().from(MockInterview);
            console.log("📋 All interviews in database:", allInterviews.map(interview => ({
                id: interview.id,
                mockId: interview.mockId,
                jobPosition: interview.jobPosition,
                createdAt: interview.createdAt
            })));

            if (result.length === 0) {
                console.error("❌ No interview found with this Id:", params.interviewId);
                setError(`No interview found with ID: ${params.interviewId}`);
                setLoading(false);
                return;
            }

            // Add better error handling for JSON parsing
            let jsonMockResp;
            try {
                jsonMockResp = JSON.parse(result[0].jsonMockResp);
                console.log("Parsed JSON:", jsonMockResp);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                setError("Invalid interview data format");
                setLoading(false);
                return;
            }

            // Ensure jsonMockResp is an array
            if (!Array.isArray(jsonMockResp)) {
                console.error("jsonMockResp is not an array:", jsonMockResp);
                setError("Invalid questions format");
                setLoading(false);
                return;
            }

            setMockInterviewQuestions(jsonMockResp);
            setInterviewData(result[0]);
            setLoading(false);
        } catch (error) {
            console.error("Error in fetchData:", error);
            setError("Failed to load interview");
            setLoading(false);
        }
    };

    const handleQuestionClick = (index) => {
        setActiveIndex(index);
    };

    console.log("Current state:", {
        loading,
        error,
        questionsLength: mockInterviewQuestions.length,
        questions: mockInterviewQuestions
    });

    if (loading) {
        return (
            <div className="p-4 text-blue-500 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-2"></div>
                Loading interview data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500 text-center">
                <p>Error: {error}</p>
                <button
                    onClick={fetchData}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!mockInterviewQuestions || mockInterviewQuestions.length === 0) {
        return (
            <div className="p-4 text-red-500 text-center">
                <p>No questions available. Make sure your interview data has valid questions.</p>
                <button
                    onClick={fetchData}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

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