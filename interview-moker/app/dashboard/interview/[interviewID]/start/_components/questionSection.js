// "use client"
// import { FaVolumeHigh } from "react-icons/fa6";

// const QuestionSection = ({ questions, isLoading, error, activeIndex, onQuestion }) => {
//     // return <div className="p-4 text-gray-500">Loading interview questions...</div>;
//     if (isLoading) {
//         return <div className="flex items-center justify-center min-h-[400px]">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             <span className="ml-3 text-gray-600 dark:text-gray-400">Loading results...</span>
//         </div>;
//     }

//     if (error) {
//         return <div className="p-4 text-red-500">Error loading questions: {error.message}</div>;
//     }

//     if (!questions || !Array.isArray(questions) || questions.length === 0) {
//         return <div className="p-4 text-gray-500">No questions available.</div>;
//     }
// const textToSpeach = (text) => {
//     if ('speechSynthesis' in window) {
//         const speech = new SpeechSynthesisUtterance(text)
//         window.speechSynthesis.speak(speech)
//     }
//     else {
//         alert('Sorry, Your brouser does not support the speech')
//     }
// }
//     return (
//         <div className="flex flex-col h-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg overflow-hidden border border-gray-100">
//             {/* Buttons Section */}
//             <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
//                 {questions.map((question, index) => (
//                     <button
//                         key={index}
//                         onClick={() => onQuestion(index)}
//                         className={`px-4 py-2 rounded-full font-medium text-xs transition-all duration-200 ${activeIndex === index
//                             ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
//                             : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
//                             }`}
//                     >

//                         Question #{index + 1}
//                     </button>
//                 ))}
//             </div>

//             {/* Main content (Question + Note) */}
//             <div className="flex flex-col justify-between flex-grow p-4 bg-gray-50">
//                 {/* Question Text */}
//                 <div className="flex-grow">
//                     <p className="text-gray-800 text-md leading-relaxed">
//                         {questions[activeIndex]?.question || "No question text available"}
//                     </p>
//                     <FaVolumeHigh className="cursor-pointer" onClick={() => textToSpeach(questions[activeIndex]?.question)} />
//                 </div>

//                 {/* Note Section */}
//                 <div className="mt-4 p-3 bg-blue-100 rounded-lg">
//                     <h3 className="font-bold text-gray-800">Note:</h3>
//                     <p className="text-gray-700 text-sm mt-1">
//                         This is a mock interview simulation. Make sure you're in a quiet environment with good lighting.
//                     </p>
//                 </div>
//             </div>
//         </div>


//     );
// };

// export default QuestionSection;




// import { Volume2 } from 'lucide-react';
// const textToSpeech = (text) => {
//     if ('speechSynthesis' in window) {
//         const utterance = new SpeechSynthesisUtterance(text);
//         window.speechSynthesis.speak(utterance);
//     } else {
//         alert('Sorry, your browser does not support text-to-speech.');
//     }
// };
"use client"
import React from 'react';
import { FaVolumeHigh } from "react-icons/fa6";

function QuestionsSection({ questions, activeIndex, onQuestion, isLoading, error }) {
    console.log("QuestionsSection props:", { questions, activeIndex, isLoading, error });

    if (isLoading) {
        return (
            <div className="p-5 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <div className="animate-pulse">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        ))}
                    </div>
                    <div className="mt-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <div className="text-red-500 text-center">
                    <p>Error loading questions: {error}</p>
                </div>
            </div>
        );
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return (
            <div className="p-5 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <div className="text-gray-500 text-center">
                    <p>No questions available</p>
                    <p className="text-sm mt-2">Questions data: {JSON.stringify(questions)}</p>
                </div>
            </div>
        );
    }
    const textToSpeach = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(speech)
        }
        else {
            alert('Sorry, Your brouser does not support the speech')
        }
    }

    return (
        <div className="p-5 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {questions.map((question, index) => (
                    <button
                        key={index}
                        onClick={() => onQuestion(index)}
                        className={`py-2 px-3 rounded-full text-xs md:text-sm font-medium transition-all
                            ${activeIndex === index
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-500 dark:hover:text-white'
                            }`}
                    >
                        Question #{index + 1}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                {questions[activeIndex] ? (
                    <div>
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
                            {questions[activeIndex]?.question || 'Question not available'}
                        </h2>
                        <FaVolumeHigh className="cursor-pointer" onClick={() => textToSpeach(questions[activeIndex]?.question)} />
                    </div>

                ) : (
                    <p className="text-gray-500">Select a question to view</p>
                )}
            </div>
        </div>
    );
}

export default QuestionsSection;








{/* <Volume2
                    className="mt-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => textToSpeech(questions[activeIndex]?.question)}
                /> */}