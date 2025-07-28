
"use client"
import React from 'react';
import { FaVolumeHigh } from "react-icons/fa6";

function QuestionsSection({ questions, activeIndex, onQuestion, isLoading, error }) {

    // if (isLoading) {
    //     return (
    //         <div className="p-20 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
    //             <div className="animate-pulse">
    //                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    //                     {[...Array(6)].map((_, i) => (
    //                         <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    //                     ))}
    //                 </div>
    //                 <div className="mt-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
    //             </div>
    //         </div>
    //     );
    // }

    if (isLoading) {
        return (
            <div className="p-5 border rounded-lg bg-white dark:bg-gray-400 shadow-sm min-h-[600px]">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    ))}
                </div>
                <div className="mt-6 h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
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
            <div className="flex justify-center items-center h-full min-h-[300px]">
                <div className="p-5 border rounded-lg bg-white dark:bg-gray-800 shadow-sm flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
                    <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
                        Loading Questions
                    </h2>
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
                        <FaVolumeHigh size={25} className="cursor-pointer mt-6" onClick={() => textToSpeach(questions[activeIndex]?.question)} />
                    </div>

                ) : (
                    <p className="text-gray-500">Select a question to view</p>
                )}
            </div>
        </div>
    );
}

export default QuestionsSection;






