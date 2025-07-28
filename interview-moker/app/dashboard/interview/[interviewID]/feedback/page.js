// "use client"
// import { db } from '../../../../../utils/db'
// import { userAnswer } from '../../../../../utils/schema'
// import React, { useEffect } from 'react'
// import { useParams } from 'next/navigation'
// import { eq } from 'drizzle-orm'
// const Feedback = () => {
//     useEffect(() => {
//         getFeedback()
//     }, [])
//     const params = useParams()
//     console.log("Route Params:", params);
//     const getFeedback = async () => {

//         const result = await db.select().from(userAnswer).where(eq(userAnswer.mockIdRef, params.mockinterviewId)).orderBy(userAnswer.id)
//         console.log("mock ID:", params.mockinterviewId)

//         console.log("Above from result")
//         console.log(result);
//     }

//     return (
//         <div className='p-10'>
//             <h1 className="p-3 text-green-400 text-2xl font-bold">Congratulations!</h1>
//             <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
//             <h2 className='text-purple-400 font-semibold py-3'>Your overall interview rating:<strong>7/10</strong></h2>
//             <h2 className='text-sm'>Find below interview questions with correct answers, Your answer and feedback for Improvement</h2>
//         </div>
//     )
// }

// export default Feedback




// "use client"
// import { db } from '../../../../../utils/db'
// import { userAnswer } from '../../../../../utils/schema'
// import React, { useEffect, useState } from 'react'
// import { useParams } from 'next/navigation'
// import { eq } from 'drizzle-orm'

// const Feedback = () => {
//     const [feedbackData, setFeedbackData] = useState([])
//     const [loading, setLoading] = useState(true)
//     const params = useParams()

//     useEffect(() => {
//         getFeedback()
//     }, [])

//     const getFeedback = async () => {
//         try {
//             console.log("Route Params:", params);
//             console.log("Mock ID from params:", params.interviewID);
//             console.log("Type of mockinterviewId:", typeof params.interviewID);

//             // First, let's check if there are any records at all
//             const allRecords = await db.select().from(userAnswer);
//             console.log("All records in userAnswer table:", allRecords);

//             // Check if mockinterviewId exists and what type it should be
//             const mockId = params.interviewID;
//             console.log("Searching for mockId:", mockId);

//             const result = await db.select()
//                 .from(userAnswer)
//                 .where(eq(userAnswer.mockIdRef, mockId))
//                 .orderBy(userAnswer.id);

//             console.log("Filtered result:", result);
//             console.log("Result length:", result.length);

//             setFeedbackData(result);
//             setLoading(false);

//         } catch (error) {
//             console.error("Error fetching feedback:", error);
//             setLoading(false);
//         }
//     }

//     if (loading) {
//         return <div>Loading...</div>
//     }

//     return (
//         <div className='p-10'>
//             <h1 className="p-3 text-green-400 text-2xl font-bold">Congratulations!</h1>
//             <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
//             <h2 className='text-purple-400 font-semibold py-3'>Your overall interview rating:<strong>7/10</strong></h2>
//             <h2 className='text-sm'>Find below interview questions with correct answers, Your answer and feedback for Improvement</h2>

//             {/* Debug information */}
//             <div className="mt-5 p-4 bg-gray-100 rounded">
//                 <h3 className="font-bold">Debug Info:</h3>
//                 <p>Mock ID: {params.interviewID}</p>
//                 <p>Records found: {feedbackData.length}</p>
//             </div>

//             {/* Display feedback data */}
//             <div className="mt-5">
//                 {feedbackData.length > 0 ? (
//                     feedbackData.map((item, index) => (
//                         <div key={item.id} className="mb-4 p-4 border rounded">
//                             <h3 className="font-bold">Question {index + 1}:</h3>
//                             <p className="text-gray-700">{item.question}</p>

//                             <h4 className="font-semibold mt-2">Your Answer:</h4>
//                             <p className="text-blue-600">{item.userAns}</p>

//                             <h4 className="font-semibold mt-2">Correct Answer:</h4>
//                             <p className="text-green-600">{item.correctAnswer}</p>

//                             <h4 className="font-semibold mt-2">Feedback:</h4>
//                             <p className="text-purple-600">{item.feedback}</p>

//                             <h4 className="font-semibold mt-2">Rating:</h4>
//                             <p className="text-orange-600">{item.rating}</p>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No feedback data found for this interview.</p>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default Feedback


"use client"
import { db } from '../../../../../utils/db'
import { userAnswer } from '../../../../../utils/schema'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { eq } from 'drizzle-orm'
import {
    IoChevronDown,
    IoChevronUp,
    IoTrophy,
    IoTarget,
    IoChatbubble,
    IoStar,
    IoTrendingUp,
    IoSunny,
    IoMoon
} from 'react-icons'

const Feedback = () => {
    const [feedbackData, setFeedbackData] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedItems, setExpandedItems] = useState({})
    const [isDarkMode, setIsDarkMode] = useState(false)
    const params = useParams()

    useEffect(() => {
        getFeedback()
        // Check for system preference or stored theme
        const savedTheme = localStorage.getItem('theme')
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setIsDarkMode(savedTheme === 'dark' || (!savedTheme && systemPrefersDark))
    }, [])

    const getFeedback = async () => {
        try {
            console.log("Route Params:", params);
            console.log("Mock ID from params:", params.interviewID);

            const allRecords = await db.select().from(userAnswer);
            console.log("All records in userAnswer table:", allRecords);

            const mockId = params.interviewID;
            console.log("Searching for mockId:", mockId);

            const result = await db.select()
                .from(userAnswer)
                .where(eq(userAnswer.mockIdRef, mockId))
                .orderBy(userAnswer.id);

            console.log("Filtered result:", result);
            setFeedbackData(result);
            setLoading(false);

        } catch (error) {
            console.error("Error fetching feedback:", error);
            setLoading(false);
        }
    }

    const toggleExpanded = (index) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    const toggleTheme = () => {
        const newTheme = !isDarkMode
        setIsDarkMode(newTheme)
        localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    }

    const calculateOverallRating = () => {
        if (feedbackData.length === 0) return 0

        const totalRating = feedbackData.reduce((sum, item) => {
            const rating = parseFloat(item.rating) || 0
            return sum + rating
        }, 0)

        return (totalRating / feedbackData.length).toFixed(1)
    }

    const getRatingColor = (rating) => {
        const numRating = parseFloat(rating)
        if (numRating >= 8) return 'text-green-500'
        if (numRating >= 6) return 'text-yellow-500'
        if (numRating >= 4) return 'text-orange-500'
        return 'text-red-500'
    }

    const getOverallRatingColor = (rating) => {
        const numRating = parseFloat(rating)
        if (numRating >= 8) return 'from-green-500 to-emerald-600'
        if (numRating >= 6) return 'from-yellow-500 to-orange-500'
        if (numRating >= 4) return 'from-orange-500 to-red-500'
        return 'from-red-500 to-red-700'
    }

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Loading your feedback...</p>
                </div>
            </div>
        )
    }

    const overallRating = calculateOverallRating()

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b transition-colors duration-300`}>
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                            <IoTrophy className="h-8 w-8 text-green-500" />
                            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Interview Complete!
                            </h1>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode
                                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                }`}
                        >
                            {isDarkMode ? <IoMoon /> : <IoSunny />}
                        </button>
                    </div>

                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                        Congratulations on completing your interview! Here's your detailed feedback.
                    </p>

                    {/* Overall Rating Card */}
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl p-6 shadow-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-full bg-gradient-to-r ${getOverallRatingColor(overallRating)}`}>
                                    <IoTrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Overall Performance
                                    </h3>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Based on {feedbackData.length} questions
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-4xl font-bold bg-gradient-to-r ${getOverallRatingColor(overallRating)} bg-clip-text text-transparent`}>
                                    {overallRating}/10
                                </div>
                                <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <IoStar
                                            key={i}
                                            className={`h-4 w-4 ${i < Math.round(overallRating / 2)
                                                ? 'text-yellow-400'
                                                : isDarkMode ? 'text-gray-600' : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {feedbackData.length > 0 ? (
                    <div className="space-y-6">
                        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                            Question-wise Analysis
                        </h2>

                        {feedbackData.map((item, index) => {
                            const isExpanded = expandedItems[index]
                            const rating = parseFloat(item.rating) || 0

                            return (
                                <div
                                    key={item.id}
                                    className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md`}
                                >
                                    {/* Question Header */}
                                    <div
                                        className="p-6 cursor-pointer"
                                        onClick={() => toggleExpanded(index)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                                    <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                                                        {item.question}
                                                    </h3>
                                                    {!isExpanded && (
                                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>
                                                            Click to view detailed feedback
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4 ml-4">
                                                <div className="text-right">
                                                    <div className={`text-2xl font-bold ${getRatingColor(item.rating)}`}>
                                                        {rating}/10
                                                    </div>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3 w-3 ${i < Math.round(rating / 2)
                                                                    ? 'text-yellow-400 fill-current'
                                                                    : isDarkMode ? 'text-gray-600' : 'text-gray-300'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                {isExpanded ? (
                                                    <IoChevronUp className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                ) : (
                                                    <IoChevronDown className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className={`px-6 pb-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <div className="pt-6 space-y-6">
                                                {/* Your Answer */}
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-3">
                                                        <IoChatbubble className="h-5 w-5 text-blue-500" />
                                                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            Your Answer
                                                        </h4>
                                                    </div>
                                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border`}>
                                                        <p className={`${isDarkMode ? 'text-blue-200' : 'text-blue-800'} leading-relaxed`}>
                                                            {item.userAns || 'No answer provided'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Correct Answer */}
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-3">
                                                        <IoTarget className="h-5 w-5 text-green-500" />
                                                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            Recommended Answer
                                                        </h4>
                                                    </div>
                                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border`}>
                                                        <p className={`${isDarkMode ? 'text-green-200' : 'text-green-800'} leading-relaxed`}>
                                                            {item.correctAnswer}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Feedback */}
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-3">
                                                        <IoTrophy className="h-5 w-5 text-purple-500" />
                                                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            Feedback & Improvement Tips
                                                        </h4>
                                                    </div>
                                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'} border`}>
                                                        <p className={`${isDarkMode ? 'text-purple-200' : 'text-purple-800'} leading-relaxed`}>
                                                            {item.feedback}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className={`text-center py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl`}>
                        <IoChatbubble className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            No Feedback Available
                        </h3>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            No feedback data found for this interview.
                        </p>
                    </div>
                )}

                {/* Debug Information (only show in development) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className={`mt-8 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} border`}>
                        <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Debug Info:</h3>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mock ID: {params.interviewID}</p>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Records found: {feedbackData.length}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Feedback