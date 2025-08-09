"use client"
import { db } from '../../../../../utils/db'
import { userAnswer } from '../../../../../utils/schema'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { eq } from 'drizzle-orm'

const Feedback = () => {
    const [feedbackData, setFeedbackData] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedItems, setExpandedItems] = useState({})
    const params = useParams()

    useEffect(() => {
        getFeedback()
    }, [])

    const getFeedback = async () => {
        try {
            const mockId = params.interviewID
            const result = await db.select()
                .from(userAnswer)
                .where(eq(userAnswer.mockIdRef, mockId))
                .orderBy(userAnswer.id)

            setFeedbackData(result)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching feedback:", error)
            setLoading(false)
        }
    }

    const toggleExpanded = (index) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    const calculateOverallRating = () => {
        if (feedbackData.length === 0) return 0
        const totalRating = feedbackData.reduce((sum, item) => {
            const rating = parseFloat(item.rating) || 0
            return sum + rating
        }, 0)
        return (totalRating / feedbackData.length).toFixed(1)
    }

    const getRatingLabel = (rating) => {
        const numRating = parseFloat(rating)
        if (numRating >= 9) return 'Excellent'
        if (numRating >= 8) return 'Very Good'
        if (numRating >= 7) return 'Good'
        if (numRating >= 6) return 'Above Average'
        if (numRating >= 5) return 'Average'
        if (numRating >= 4) return 'Below Average'
        if (numRating >= 3) return 'Poor'
        return 'Very Poor'
    }

    const getRatingColorClass = (rating) => {
        const numRating = parseFloat(rating)
        if (numRating >= 8) return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800'
        if (numRating >= 6) return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800'
        if (numRating >= 4) return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800'
        return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800'
    }

    const getOverallRatingColorClass = (rating) => {
        const numRating = parseFloat(rating)
        if (numRating >= 8) return 'text-green-700 bg-green-100 border-green-300 dark:text-green-300 dark:bg-green-900/30 dark:border-green-700'
        if (numRating >= 6) return 'text-blue-700 bg-blue-100 border-blue-300 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-700'
        if (numRating >= 4) return 'text-orange-700 bg-orange-100 border-orange-300 dark:text-orange-300 dark:bg-orange-900/30 dark:border-orange-700'
        return 'text-red-700 bg-red-100 border-red-300 dark:text-red-300 dark:bg-red-900/30 dark:border-red-700'
    }

    const overallRating = calculateOverallRating()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading feedback...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Interview Assessment Complete
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Here's your comprehensive performance analysis and feedback
                        </p>
                    </div>


                    <div className={`max-w-md mx-auto rounded-lg border-2 p-6 ${getOverallRatingColorClass(overallRating)}`}>
                        <div className="text-center">
                            <h2 className="text-xl font-semibold mb-2">Overall Performance</h2>
                            <div className="text-5xl font-bold mb-2">{overallRating}/10</div>
                            <div className="text-lg font-medium mb-1">{getRatingLabel(overallRating)}</div>
                            <p className="text-sm opacity-75">
                                Based on {feedbackData.length} question{feedbackData.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="max-w-5xl mx-auto px-6 py-8">
                {feedbackData.length > 0 ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Detailed Question Analysis
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Click on any question to view detailed feedback
                            </p>
                        </div>

                        {feedbackData.map((item, index) => {
                            const isExpanded = expandedItems[index]
                            const rating = parseFloat(item.rating) || 0

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >

                                    <div
                                        className="p-6 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-150"
                                        onClick={() => toggleExpanded(index)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-4 mb-3">
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                                        Question {index + 1}
                                                    </span>
                                                    <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getRatingColorClass(rating)}`}>
                                                        {rating}/10 - {getRatingLabel(rating)}
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
                                                    {item.question}
                                                </h3>
                                                {!isExpanded && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                        Expand to view your answer, recommended approach, and detailed feedback
                                                    </p>
                                                )}
                                            </div>
                                            <button className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                                <span className="text-lg">{isExpanded ? '−' : '+'}</span>
                                            </button>
                                        </div>
                                    </div>


                                    {isExpanded && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-6">

                                            <div>
                                                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                                                    Your Answer
                                                </h4>
                                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                                        {item.userAns || 'No answer was provided for this question.'}
                                                    </p>
                                                </div>
                                            </div>


                                            <div>
                                                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                                                    Recommended Answer
                                                </h4>
                                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                                        {item.correctAnswer}
                                                    </p>
                                                </div>
                                            </div>


                                            <div>
                                                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                                                    Detailed Feedback & Improvement Suggestions
                                                </h4>
                                                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                                        {item.feedback}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                            No Feedback Available
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            No feedback data was found for this interview session.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Feedback
