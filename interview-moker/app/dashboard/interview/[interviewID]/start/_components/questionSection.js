"use client"
import { FaVolumeHigh } from "react-icons/fa6";

const QuestionSection = ({ questions, isLoading, error, activeIndex, onQuestion }) => {
    // return <div className="p-4 text-gray-500">Loading interview questions...</div>;
    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading results...</span>
        </div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error loading questions: {error.message}</div>;
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return <div className="p-4 text-gray-500">No questions available.</div>;
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
        <div className="flex flex-col h-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Buttons Section */}
            <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                {questions.map((question, index) => (
                    <button
                        key={index}
                        onClick={() => onQuestion(index)}
                        className={`px-4 py-2 rounded-full font-medium text-xs transition-all duration-200 ${activeIndex === index
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                            }`}
                    >

                        Question #{index + 1}
                    </button>
                ))}
            </div>

            {/* Main content (Question + Note) */}
            <div className="flex flex-col justify-between flex-grow p-4 bg-gray-50">
                {/* Question Text */}
                <div className="flex-grow">
                    <p className="text-gray-800 text-md leading-relaxed">
                        {questions[activeIndex]?.question || "No question text available"}
                    </p>
                    <FaVolumeHigh className="cursor-pointer" onClick={() => textToSpeach(questions[activeIndex]?.question)} />
                </div>

                {/* Note Section */}
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                    <h3 className="font-bold text-gray-800">Note:</h3>
                    <p className="text-gray-700 text-sm mt-1">
                        This is a mock interview simulation. Make sure you're in a quiet environment with good lighting.
                    </p>
                </div>
            </div>
        </div>


    );
};

export default QuestionSection;