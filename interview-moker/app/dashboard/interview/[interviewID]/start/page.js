// "use client"
// import { db } from "../../../../../utils/db";
// import { MockInterview } from "../../../../../utils/schema";
// import { eq } from "drizzle-orm";
// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation";
// import QuestionSection from "./_components/questionSection";
// import RecaurdAnswer from "./_components/recaurdAnswer";
// import Link from "next/link";

// function StartInterview() {
//     const [interviewData, setInterviewData] = useState(null);
//     const [mockInterviewQuestions, setMockInterviewQuestions] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isRouterReady, setIsRouterReady] = useState(false);
//     const [activeIndex, setactiveIndex] = useState(0)

//     const params = useParams();

//     console.log(params);

//     // const interviewId = params?.interviewID;
//     // const safeInterviewData = {
//     //     ...interviewData,
//     //     mockId: interviewData?.mockId || `temp_${Date.now()}`
//     // }

//     useEffect(() => {
//         if (interviewId) {
//             setIsRouterReady(true);
//         }
//     }, [interviewId]);

//     useEffect(() => {
//         if (!isRouterReady) return;


//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
//                 console.log("I am here");

//                 const result = await db.select()
//                     .from(MockInterview)
//                     .where(eq(MockInterview.mockId, interviewId));


//                 if (result.length === 0) {
//                     throw new Error("No interview found with this ID");
//                 }

//                 let questions;
//                 try {
//                     const rawData = result[0].jsonMockResp;
//                     questions = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

//                     if (!Array.isArray(questions)) {
//                         throw new Error("Questions data is not in expected array format");
//                     }
//                 } catch (parseError) {
//                     console.error("Parsing error:", parseError);
//                     throw new Error("Failed to parse interview questions");
//                 }

//                 setMockInterviewQuestions(questions);
//                 console.log("results are", result)
//                 setInterviewData(result[0]);
//             } catch (err) {
//                 console.error("Fetch error:", err);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [interviewId, isRouterReady]);
//     const handleQuestionClick = (index) => {
//         setactiveIndex(index)
//     }

//     if (!isRouterReady) return <div className="p-4">Loading interview session...</div>;
//     if (loading) return <div className="p-4">Loading interview questions...</div>;
//     // if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
//     if (!mockInterviewQuestions) return <div className="p-4">No questions available</div>;

//     return (
//         <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-10">
//             <QuestionSection
//                 questions={mockInterviewQuestions}
//                 activeIndex={activeIndex}
//                 isLoading={loading}
//                 error={error}
//                 onQuestion={handleQuestionClick}
//             />

//             // Before rendering RecordAnswer


//             {/* 
//             <RecaurdAnswer
//                 questions={mockInterviewQuestions}
//                 activeIndex={activeIndex}
//                 interviewData={safeInterviewData}
//             /> */}

//             <RecaurdAnswer
//                 questions={mockInterviewQuestions}
//                 activeIndex={activeIndex}
//                 interviewData={interviewData}

//             />
//             <div><Link href={'/dashboard/interview/' + mockId + "/feedback"}>feedback</Link></div>
//         </div>
//     );
// }

// export default StartInterview;





















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

    // const params = useParams();
    // const interviewId = params?.interviewId; 

    // console.log(params);

    // Simplified: removed isRouterReady state
    useEffect(() => {

        console.log("interviewId from params:", params?.interviewId);
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

    // const fetchData = async (interviewId) => {
    //     console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa")
    //     console.log("Fetching interview data for ID:", interviewId);

    //     try {
    //         setLoading(true);
    //         setError(null);

    //         const result = await db.select()
    //             .from(MockInterview)
    //             .where(eq(MockInterview.mockId, params.interviewId));

    //         console.log("Database result:", result);

    //         if (result.length === 0) {
    //             throw new Error("No interview found with this ID");
    //         }

    //         const interviewRecord = result[0];
    //         console.log("Interview record:", interviewRecord);

    //         // Check if jsonMockResp exists and is not empty
    //         if (!interviewRecord.jsonMockResp) {
    //             throw new Error("No questions data found in this interview record");
    //         }

    //         let questions;
    //         try {
    //             const rawData = interviewRecord.jsonMockResp;
    //             console.log("Raw JSON data:", rawData);

    //             // Parse the JSON
    //             questions = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    //             console.log("Parsed questions:", questions);

    //             // Validate the structure
    //             if (!Array.isArray(questions)) {
    //                 console.error("Questions data is not an array:", questions);
    //                 throw new Error("Questions data is not in expected array format");
    //             }

    //             if (questions.length === 0) {
    //                 throw new Error("No questions found in the data");
    //             }


    //             // Validate each question has required fields
    //             for (let i = 0; i < questions.length; i++) {
    //                 const question = questions[i];
    //                 if (!question.question || !question.answer) {
    //                     console.error(`Question ${i + 1} is invalid:`, question);
    //                     throw new Error(`Question ${i + 1} is missing required fields`);
    //                 }
    //             }

    //         } catch (parseError) {
    //             console.error("JSON parsing error:", parseError);
    //             console.error("Raw data that failed to parse:", interviewRecord.jsonMockResp);
    //             throw new Error("Failed to parse interview questions. The data may be corrupted.");
    //         }

    //         // Set the data
    //         setMockInterviewQuestions(questions);
    //         setInterviewData(interviewRecord);

    //         console.log("Successfully loaded questions:", questions);

    //     } catch (err) {
    //         console.error("Fetch error:", err);
    //         setError(err.message);

    //         // Clear the questions state on error
    //         setMockInterviewQuestions([]);

    //     } finally {
    //         setLoading(false);
    //     }
    // };




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


























{/* Navigation buttons */ }
{/* <div className="flex justify-end gap-6 mt-6">
                {activeIndex > 0 && (
                    <Button onClick={() => setActiveIndex(activeIndex - 1)}>
                        Previous Question
                    </Button>
                )}
                {activeIndex !== mockInterviewQuestions?.length - 1 && (
                    <Button onClick={() => setActiveIndex(activeIndex + 1)}>
                        Next Question
                    </Button>
                )}
                {activeIndex === mockInterviewQuestions?.length - 1 && (
                    <Link href={'/dashboard/interview/' + interviewData?.mockId + "/feedback"}>
                        <Button>End Interview</Button>
                    </Link>
                )}
            </div> */}
{/* </div>
    );
}

export default StartInterview; */}







{/* Navigation buttons */ }
{/* <div className="flex justify-end gap-6 mt-6">
#                 {activeIndex > 0 && (
#                     <Button onClick={() => setActiveIndex(activeIndex - 1)}>
#                         Previous Question
#                     </Button>
#                 )}
#                 {activeIndex !== mockInterviewQuestions?.length - 1 && (
#                     <Button onClick={() => setActiveIndex(activeIndex + 1)}>
#                         Next Question
#                     </Button>
#                 )}
#                 {activeIndex === mockInterviewQuestions?.length - 1 && (
#                     <Link href={'/dashboard/interview/' + interviewData?.mockId + "/feedback"}>
#                         <Button>End Interview</Button>
#                     </Link>
#                 )}
#             </div> */}
{/* Navigation buttons */ }
{/* <div className="flex justify-end gap-6 mt-6">
#                 {activeIndex > 0 && (
#                     <Button onClick={() => setActiveIndex(activeIndex - 1)}>
#                         Previous Question
#                     </Button>
#                 )}
#                 {activeIndex !== mockInterviewQuestions?.length - 1 && (
#                     <Button onClick={() => setActiveIndex(activeIndex + 1)}>
#                         Next Question
#                     </Button>
#                 )}
#                 {activeIndex === mockInterviewQuestions?.length - 1 && (
#                     <Link href={'/dashboard/interview/' + interviewData?.mockId + "/feedback"}>
#                         <Button>End Interview</Button>
#                     </Link>
#                 )}
#             </div> */}























// ======================  FETCH DATA FUNCTION====================



// const fetchData = async (interviewID) => {
//     console.log("Fetching interview data for ID:", interviewID);

//     try {
//         setLoading(true);
//         setError(null);
//         console.log("Fetching interview data for ID:", interviewID);

//         // const result = await db.select()
//         //     .from(MockInterview)
//         //     .where(eq(MockInterview.mockId, interviewID));
//         const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, interviewID));

//         console.log("result => ", result)
//         if (result.length === 0) {
//             throw new Error("No interview found with this ID");
//         }

//         let questions;
//         try {
//             const rawData = result[0].jsonMockResp;
//             questions = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

//             if (!Array.isArray(questions)) {
//                 throw new Error("Questions data is not in expected array format");
//             }
//         } catch (parseError) {
//             console.error("Parsing error:", parseError);
//             throw new Error("Failed to parse interview questions");
//         }

//         setMockInterviewQuestions(questions);
//         console.log("results are", result);
//         setInterviewData(result[0]);
//     } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message);
//     } finally {
//         setLoading(false);
//     }
// };





































































