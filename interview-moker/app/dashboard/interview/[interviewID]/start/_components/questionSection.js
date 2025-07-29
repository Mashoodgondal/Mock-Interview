
// "use client"
// import React from 'react';
// import { FaVolumeHigh } from "react-icons/fa6";

// function QuestionsSection({ questions, activeIndex, onQuestion, isLoading, error }) {

//     // if (isLoading) {
//     //     return (
//     //         <div className="p-20 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
//     //             <div className="animate-pulse">
//     //                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//     //                     {[...Array(6)].map((_, i) => (
//     //                         <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
//     //                     ))}
//     //                 </div>
//     //                 <div className="mt-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
//     //             </div>
//     //         </div>
//     //     );
//     // }

//     if (isLoading) {
//         return (
//             <div className="p-5 border rounded-lg bg-white dark:bg-gray-400 shadow-sm min-h-[600px]">
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                     {[...Array(6)].map((_, i) => (
//                         <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
//                     ))}
//                 </div>
//                 <div className="mt-6 h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
//             </div>
//         );
//     }


//     if (error) {
//         return (
//             <div className="p-5 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
//                 <div className="text-red-500 text-center">
//                     <p>Error loading questions: {error}</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!questions || !Array.isArray(questions) || questions.length === 0) {
//         return (
//             <div className="flex justify-center items-center h-full min-h-[300px]">
//                 <div className="p-5 border rounded-lg bg-white dark:bg-gray-800 shadow-sm flex flex-col items-center gap-3">
//                     <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
//                     <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
//                         Loading Questions
//                     </h2>
//                 </div>
//             </div>
//         );
//     }

//     const textToSpeach = (text) => {
//         if ('speechSynthesis' in window) {
//             const speech = new SpeechSynthesisUtterance(text)
//             window.speechSynthesis.speak(speech)
//         }
//         else {
//             alert('Sorry, Your brouser does not support the speech')
//         }
//     }
//     return (
//         <div className="p-5 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {questions.map((question, index) => (
//                     <button
//                         key={index}
//                         onClick={() => onQuestion(index)}
//                         className={`py-2 px-3 rounded-full text-xs md:text-sm font-medium transition-all
//                             ${activeIndex === index
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-500 dark:hover:text-white'
//                             }`}
//                     >
//                         Question #{index + 1}
//                     </button>
//                 ))}
//             </div>

//             <div className="mt-6">
//                 {questions[activeIndex] ? (
//                     <div>
//                         <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
//                             {questions[activeIndex]?.question || 'Question not available'}
//                         </h2>
//                         <FaVolumeHigh size={25} className="cursor-pointer mt-6" onClick={() => textToSpeach(questions[activeIndex]?.question)} />
//                     </div>

//                 ) : (
//                     <p className="text-gray-500">Select a question to view</p>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default QuestionsSection;





"use client"
import React from 'react';
import { FaVolumeHigh } from "react-icons/fa6";

function QuestionsSection({ questions, activeIndex, onQuestion, isLoading, error }) {

    if (isLoading) {
        return (
            <div className="p-5 border rounded-lg bg-white dark:bg-gray-800 shadow-sm h-full min-h-[500px] flex flex-col">
                {/* Question buttons skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    ))}
                </div>

                {/* Question content skeleton */}
                <div className="flex-1 space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/5"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-6"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5 border rounded-lg bg-white dark:bg-gray-800 shadow-sm min-h-[500px] flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 text-red-400">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium">Error loading questions</p>
                    <p className="text-sm text-gray-500 mt-1">{error}</p>
                </div>
            </div>
        );
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return (
            <div className="p-5 border rounded-lg bg-white dark:bg-gray-800 shadow-sm min-h-[500px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
                    <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">
                        Loading Questions...
                    </h2>
                </div>
            </div>
        );
    }

    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            speech.rate = 0.8; // Slightly slower speech
            speech.pitch = 1;
            speech.volume = 1;
            window.speechSynthesis.speak(speech);
        } else {
            alert('Sorry, your browser does not support text-to-speech');
        }
    }

    return (
        <div className="p-5 border rounded-lg bg-white dark:bg-gray-800 shadow-sm h-full min-h-[500px] flex flex-col">
            {/* Question Navigation Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                {questions.map((question, index) => (
                    <button
                        key={index}
                        onClick={() => onQuestion(index)}
                        className={`py-2.5 px-3 rounded-full text-xs md:text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300
                            ${activeIndex === index
                                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-500 dark:hover:text-white hover:shadow-md'
                            }`}
                    >
                        Question #{index + 1}
                    </button>
                ))}
            </div>

            {/* Question Content */}
            <div className="flex-1 flex flex-col">
                {questions[activeIndex] ? (
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 leading-relaxed flex-1">
                                {questions[activeIndex]?.question || 'Question not available'}
                            </h2>
                        </div>

                        {/* Audio Button */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                onClick={() => textToSpeech(questions[activeIndex]?.question)}
                                className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                title="Listen to question"
                            >
                                <FaVolumeHigh size={20} className="text-blue-600 dark:text-blue-400" />
                            </button>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Click to listen
                            </span>
                        </div>

                        {/* Question Counter */}
                        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Question {activeIndex + 1} of {questions.length}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Select a question to view
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuestionsSection;
