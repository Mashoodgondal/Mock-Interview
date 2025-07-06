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









// StartInterview.js - Complete Fixed Version
"use client"
import { db } from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import QuestionSection from "./_components/questionSection";
import RecaurdAnswer from "./_components/recaurdAnswer";

function StartInterview() {
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const params = useParams();
    const interviewID = params?.interviewId;

    console.log("Interview ID from params:", interviewID);

    const fetchData = async (interviewID) => {
        console.log("🔄 Fetching interview data for ID:", interviewID);

        try {
            setLoading(true);
            setError(null);
            setMockInterviewQuestions([]); // Clear previous data

            const result = await db.select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, interviewID));

            console.log("📊 Database result:", result);

            if (result.length === 0) {
                throw new Error("No interview found with this ID");
            }

            const interviewRecord = result[0];
            console.log("📋 Interview record:", interviewRecord);

            // Check if jsonMockResp exists and is not empty
            if (!interviewRecord.jsonMockResp) {
                throw new Error("No questions data found in this interview record");
            }

            let questions;
            try {
                const rawData = interviewRecord.jsonMockResp;
                console.log("📝 Raw JSON data:", rawData);
                console.log("📝 Raw data type:", typeof rawData);

                // More robust JSON parsing
                if (typeof rawData === 'string') {
                    // Clean the string first
                    let cleanedData = rawData.trim();

                    // Remove any markdown formatting
                    cleanedData = cleanedData.replace(/```json\s*/g, '');
                    cleanedData = cleanedData.replace(/```\s*/g, '');
                    cleanedData = cleanedData.trim();

                    console.log("🧹 Cleaned JSON data:", cleanedData);

                    // Try to parse
                    questions = JSON.parse(cleanedData);
                } else {
                    // If it's already an object
                    questions = rawData;
                }

                console.log("✅ Parsed questions:", questions);
                console.log("✅ Questions type:", typeof questions);
                console.log("✅ Is array?", Array.isArray(questions));

                // Handle different response formats
                if (questions && typeof questions === 'object') {
                    // If it's an object with a questions property
                    if (questions.questions && Array.isArray(questions.questions)) {
                        questions = questions.questions;
                    }
                    // If it's an object with numbered keys (like {0: {...}, 1: {...}})
                    else if (!Array.isArray(questions)) {
                        const keys = Object.keys(questions);
                        if (keys.length > 0 && keys.every(key => !isNaN(key))) {
                            questions = Object.values(questions);
                        }
                    }
                }

                // Final validation
                if (!Array.isArray(questions)) {
                    console.error("❌ Questions data is not an array:", questions);
                    throw new Error("Questions data is not in expected array format");
                }

                if (questions.length === 0) {
                    throw new Error("No questions found in the data");
                }

                // Validate each question has required fields
                const validQuestions = [];
                for (let i = 0; i < questions.length; i++) {
                    const question = questions[i];
                    console.log(`🔍 Validating question ${i + 1}:`, question);

                    if (question && typeof question === 'object') {
                        // Check for different possible field names
                        const questionText = question.question || question.q || question.questionText || question.Question;
                        const answerText = question.answer || question.a || question.answerText || question.Answer;

                        if (questionText && answerText) {
                            validQuestions.push({
                                question: questionText,
                                answer: answerText
                            });
                        } else {
                            console.warn(`⚠️ Question ${i + 1} is missing required fields:`, question);
                        }
                    }
                }

                if (validQuestions.length === 0) {
                    throw new Error("No valid questions found with both question and answer fields");
                }

                questions = validQuestions;
                console.log("✅ Final validated questions:", questions);

            } catch (parseError) {
                console.error("❌ JSON parsing error:", parseError);
                console.error("❌ Raw data that failed to parse:", interviewRecord.jsonMockResp);
                throw new Error(`Failed to parse interview questions: ${parseError.message}`);
            }

            // Set the data
            setMockInterviewQuestions(questions);
            setInterviewData(interviewRecord);

            console.log("🎉 Successfully loaded questions:", questions);

        } catch (err) {
            console.error("❌ Fetch error:", err);
            setError(err.message);
            setMockInterviewQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionClick = (index) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        console.log("🔄 useEffect triggered, interviewID:", interviewID);
        if (interviewID) {
            fetchData(interviewID);
        }
    }, [interviewID]);

    console.log("🎯 Current state:", {
        loading,
        error,
        questionsLength: mockInterviewQuestions?.length,
        hasQuestions: mockInterviewQuestions && mockInterviewQuestions.length > 0
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading interview data...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg">
                <h3 className="font-bold">Error loading interview:</h3>
                <p>{error}</p>
                <button
                    onClick={() => fetchData(interviewID)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!mockInterviewQuestions || mockInterviewQuestions.length === 0) {
        return (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg">
                <h3 className="font-bold">No questions available</h3>
                <p>Make sure your interview data has valid questions with both question and answer fields.</p>
                <button
                    onClick={() => fetchData(interviewID)}
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












































// "use client"
// import { db } from "../../../../../utils/db";
// import { MockInterview } from "../../../../../utils/schema";
// import { eq } from "drizzle-orm";
// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation";
// import QuestionSection from "./_components/questionSection";
// import RecaurdAnswer from "./_components/recaurdAnswer";
// // import { Button } from "@/components/ui/button";
// // import Link from "next/link";

// function StartInterview() {
//     const [interviewData, setInterviewData] = useState(null);
//     const [mockInterviewQuestions, setMockInterviewQuestions] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [activeIndex, setActiveIndex] = useState(0);

//     const params = useParams();
//     const interviewID = params?.interviewId; // Fixed: Define interviewId from params

//     console.log(params);

//     // Simplified: removed isRouterReady state




//     const fetchData = async (interviewID) => {
//         console.log("Fetching interview data for ID:", interviewID);

//         try {
//             setLoading(true);
//             setError(null);

//             const result = await db.select()
//                 .from(MockInterview)
//                 .where(eq(MockInterview.mockId, interviewID));

//             console.log("Database result:", result);

//             if (result.length === 0) {
//                 throw new Error("No interview found with this ID");
//             }

//             const interviewRecord = result[0];
//             console.log("Interview record:", interviewRecord);

//             // Check if jsonMockResp exists and is not empty
//             if (!interviewRecord.jsonMockResp) {
//                 throw new Error("No questions data found in this interview record");
//             }

//             let questions;
//             try {
//                 const rawData = interviewRecord.jsonMockResp;
//                 console.log("Raw JSON data:", rawData);

//                 // Parse the JSON
//                 questions = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
//                 console.log("Parsed questions:", questions);

//                 // Validate the structure
//                 if (!Array.isArray(questions)) {
//                     console.error("Questions data is not an array:", questions);
//                     throw new Error("Questions data is not in expected array format");
//                 }

//                 if (questions.length === 0) {
//                     throw new Error("No questions found in the data");
//                 }

//                 // Validate each question has required fields
//                 for (let i = 0; i < questions.length; i++) {
//                     const question = questions[i];
//                     if (!question.question || !question.answer) {
//                         console.error(`Question ${i + 1} is invalid:`, question);
//                         throw new Error(`Question ${i + 1} is missing required fields`);
//                     }
//                 }

//             } catch (parseError) {
//                 console.error("JSON parsing error:", parseError);
//                 console.error("Raw data that failed to parse:", interviewRecord.jsonMockResp);
//                 throw new Error("Failed to parse interview questions. The data may be corrupted.");
//             }

//             // Set the data
//             setMockInterviewQuestions(questions);
//             setInterviewData(interviewRecord);

//             console.log("Successfully loaded questions:", questions);

//         } catch (err) {
//             console.error("Fetch error:", err);
//             setError(err.message);

//             // Clear the questions state on error
//             setMockInterviewQuestions([]);

//         } finally {
//             setLoading(false);
//         }
//     };




//     const handleQuestionClick = (index) => {
//         setActiveIndex(index);
//     };
//     console.log("Above of  loading is working");

//     useEffect(() => {
//         if (interviewID) {

//             fetchData(interviewID);
//         }
//     }, [interviewID]);

//     if (loading) return <div className="p-4 text-blue-500"> Loading interview data...</div>
//     console.log("Below of loading is working");


//     if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
//     // if (!mockInterviewQuestions) return <div className="p-4">No questions available</div>;
//     if (!mockInterviewQuestions || mockInterviewQuestions.length === 0) {
//         return <div className="p-4 text-red-500">
//             No questions available. Make sure your interview data has valid `jsonMockResp` with at least one question.
//         </div>;
//     }




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
