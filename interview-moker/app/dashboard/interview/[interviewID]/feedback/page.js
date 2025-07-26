// "use client"
// import React, { useEffect, useState } from 'react'
// import { db } from '../../../../../utils/db'
// import { userAnswer as userAnswerSchema } from '../../../../../utils/schema'
// import { eq } from 'drizzle-orm'
// import { useUser } from '@clerk/nextjs'
// import { FaStar, FaRegStar, FaEye, FaEyeSlash, FaCalendarAlt, FaUser } from 'react-icons/fa'

// const InterviewResults = ({ mockId, interviewData }) => {
//     const { user } = useUser()
//     const [results, setResults] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [expandedAnswers, setExpandedAnswers] = useState({})


//     useEffect(() => {
//         console.log("mockId:", mockId)
//         if (mockId) {
//             fetchResults()
//         }
//     }, [mockId])

//     // useEffect(() => {
//     //     if (mockId) {
//     //         fetchResults()
//     //     }
//     // }, [mockId])

//     const fetchResults = async () => {
//         try {
//             console.log("Fetching results for mockId:", mockId)
//             setLoading(true)
//             const response = await db
//                 .select()
//                 .from(userAnswerSchema)
//                 .where(eq(userAnswerSchema.mockIdRef, mockId))

//             setResults(response)
//             setError(null)
//         } catch (err) {
//             console.error("Error fetching results:", err)
//             setError("Failed to fetch interview results")
//         } finally {
//             setLoading(false)
//         }
//     }

//     const toggleAnswer = (index, type) => {
//         setExpandedAnswers(prev => ({
//             ...prev,
//             [`${index}-${type}`]: !prev[`${index}-${type}`]
//         }))
//     }

//     const renderStars = (rating) => {
//         const numRating = parseInt(rating) || 0
//         return (
//             <div className="flex items-center gap-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                     <span key={star} className="text-yellow-400">
//                         {star <= numRating ? <FaStar /> : <FaRegStar />}
//                     </span>
//                 ))}
//                 <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
//                     {rating}/5
//                 </span>
//             </div>
//         )
//     }

//     const getRatingColor = (rating) => {
//         const numRating = parseInt(rating) || 0
//         if (numRating >= 4) return 'text-green-600 bg-green-50 border-green-200'
//         if (numRating >= 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
//         return 'text-red-600 bg-red-50 border-red-200'
//     }

//     const truncateText = (text, maxLength = 150) => {
//         if (!text || text.length <= maxLength) return text
//         return text.substring(0, maxLength) + '...'
//     }

//     const calculateOverallRating = () => {
//         if (results.length === 0) return 0
//         const total = results.reduce((sum, result) => sum + (parseInt(result.rating) || 0), 0)
//         return (total / results.length).toFixed(1)
//     }
//     if (!mockId) {
//         return (
//             <div className="text-red-600 font-medium p-6 text-center">
//                 Error: No mockId provided. Please return to the previous page and try again.
//             </div>
//         )
//     }

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-[400px]">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                 <span className="ml-3 text-gray-600 dark:text-gray-400">Loading results...</span>
//             </div>
//         )
//     }




//     if (error) {
//         return (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
//                 <p className="text-red-600 font-medium">{error}</p>
//                 <button
//                     onClick={fetchResults}
//                     className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                 >
//                     Try Again
//                 </button>
//             </div>
//         )
//     }

//     if (results.length === 0) {
//         return (
//             <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
//                 <p className="text-gray-600 dark:text-gray-400 text-lg">No interview results found.</p>
//                 <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Complete your interview to see results here.</p>
//             </div>
//         )
//     }

//     return (
//         <div className="max-w-4xl mx-auto p-6 space-y-6">
//             {/* Header Section */}
//             <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center justify-between mb-4">
//                     <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//                         Interview Results
//                     </h1>
//                     <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
//                         <div className="flex items-center gap-1">
//                             <FaUser />
//                             <span>{user?.firstName || 'Anonymous'}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                             <FaCalendarAlt />
//                             <span>{results[0]?.createdAt || 'N/A'}</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Overall Stats */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                     <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
//                         <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.length}</p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">Questions Answered</p>
//                     </div>
//                     <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
//                         <p className="text-2xl font-bold text-green-600 dark:text-green-400">{calculateOverallRating()}</p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
//                     </div>
//                     <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
//                         <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
//                             {interviewData?.jobPosition || 'Interview'}
//                         </p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">Position</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Questions and Answers */}
//             <div className="space-y-4">
//                 {results.map((result, index) => (
//                     <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
//                         {/* Question Header */}
//                         <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//                             <div className="flex items-center justify-between">
//                                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                                     Question {index + 1}
//                                 </h3>
//                                 <div className={`px-3 py-1 rounded-full border ${getRatingColor(result.rating)}`}>
//                                     {renderStars(result.rating)}
//                                 </div>
//                             </div>
//                             <p className="text-gray-700 dark:text-gray-300 mt-2 font-medium">
//                                 {result.question}
//                             </p>
//                         </div>

//                         <div className="p-6 space-y-6">
//                             {/* User Answer */}
//                             <div className="space-y-3">
//                                 <div className="flex items-center justify-between">
//                                     <h4 className="text-md font-semibold text-blue-600 dark:text-blue-400">
//                                         Your Answer
//                                     </h4>
//                                     {result.userAns && result.userAns.length > 150 && (
//                                         <button
//                                             onClick={() => toggleAnswer(index, 'user')}
//                                             className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                                         >
//                                             {expandedAnswers[`${index}-user`] ? <FaEyeSlash /> : <FaEye />}
//                                             {expandedAnswers[`${index}-user`] ? 'Show Less' : 'Show More'}
//                                         </button>
//                                     )}
//                                 </div>
//                                 <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-400">
//                                     <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
//                                         {expandedAnswers[`${index}-user`]
//                                             ? result.userAns
//                                             : truncateText(result.userAns)
//                                         }
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Correct Answer */}
//                             <div className="space-y-3">
//                                 <div className="flex items-center justify-between">
//                                     <h4 className="text-md font-semibold text-green-600 dark:text-green-400">
//                                         Sample Answer
//                                     </h4>
//                                     {result.correctAnswer && result.correctAnswer.length > 150 && (
//                                         <button
//                                             onClick={() => toggleAnswer(index, 'correct')}
//                                             className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                                         >
//                                             {expandedAnswers[`${index}-correct`] ? <FaEyeSlash /> : <FaEye />}
//                                             {expandedAnswers[`${index}-correct`] ? 'Show Less' : 'Show More'}
//                                         </button>
//                                     )}
//                                 </div>
//                                 <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-400">
//                                     <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
//                                         {expandedAnswers[`${index}-correct`]
//                                             ? result.correctAnswer
//                                             : truncateText(result.correctAnswer)
//                                         }
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Feedback */}
//                             <div className="space-y-3">
//                                 <h4 className="text-md font-semibold text-purple-600 dark:text-purple-400">
//                                     Feedback
//                                 </h4>
//                                 <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-400">
//                                     <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
//                                         {result.feedback}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
//                 <button
//                     onClick={() => window.print()}
//                     className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
//                 >
//                     Print Results
//                 </button>
//                 <button
//                     onClick={fetchResults}
//                     className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
//                 >
//                     Refresh Results
//                 </button>
//             </div>







//         </div>
//     )
// }

// export default InterviewResults






// import React from 'react'

// const Feedback = () => {
//     return (
//         <div>Feedback</div>
//     )
// }

// export default Feedback


"use client"
import React, { useEffect, useState } from 'react'
import { FaStar, FaRegStar, FaCheckCircle, FaTimesCircle, FaLightbulb, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { MdQuestionAnswer } from 'react-icons/md'
import { db } from '../../../../../utils/db'
import { userAnswer as userAnswerSchema } from '../../../../../utils/schema'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import toast from 'react-hot-toast'

const AnswerFeedback = ({ interviewData }) => {
    const { user } = useUser()
    const [feedbackData, setFeedbackData] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [overallStats, setOverallStats] = useState({
        averageRating: 0,
        totalQuestions: 0,
        strongPoints: 0,
        improvementAreas: 0
    })

    // Fetch feedback data from database
    useEffect(() => {
        const fetchFeedbackData = async () => {
            if (!interviewData?.mockId || !user?.primaryEmailAddress?.emailAddress) {
                setLoading(false)
                return
            }

            try {
                const result = await db
                    .select()
                    .from(userAnswerSchema)
                    .where(eq(userAnswerSchema.mockIdRef, interviewData.mockId))

                console.log('Fetched feedback data:', result)
                setFeedbackData(result || [])

                // Calculate overall statistics
                if (result && result.length > 0) {
                    const totalRating = result.reduce((sum, item) => sum + parseInt(item.rating || 0), 0)
                    const avgRating = totalRating / result.length
                    const strongPoints = result.filter(item => parseInt(item.rating || 0) >= 4).length
                    const improvementAreas = result.filter(item => parseInt(item.rating || 0) < 4).length

                    setOverallStats({
                        averageRating: avgRating.toFixed(1),
                        totalQuestions: result.length,
                        strongPoints,
                        improvementAreas
                    })
                }
            } catch (error) {
                console.error('Error fetching feedback data:', error)
                toast.error('Failed to load feedback data')
            } finally {
                setLoading(false)
            }
        }

        fetchFeedbackData()
    }, [interviewData?.mockId, user?.primaryEmailAddress?.emailAddress])

    // Render star rating
    const renderStarRating = (rating) => {
        const numRating = parseInt(rating || 0)
        const stars = []
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= numRating ? (
                    <FaStar key={i} className="text-yellow-400" />
                ) : (
                    <FaRegStar key={i} className="text-gray-300" />
                )
            )
        }
        return stars
    }

    // Get rating color based on score
    const getRatingColor = (rating) => {
        const numRating = parseInt(rating || 0)
        if (numRating >= 4) return 'text-green-600 bg-green-100'
        if (numRating >= 3) return 'text-yellow-600 bg-yellow-100'
        return 'text-red-600 bg-red-100'
    }

    // Get rating status
    const getRatingStatus = (rating) => {
        const numRating = parseInt(rating || 0)
        if (numRating >= 4) return { icon: FaCheckCircle, text: 'Strong Answer', color: 'text-green-600' }
        if (numRating >= 3) return { icon: FaLightbulb, text: 'Good Progress', color: 'text-yellow-600' }
        return { icon: FaTimesCircle, text: 'Needs Improvement', color: 'text-red-600' }
    }

    // Navigation handlers
    const goToPrevious = () => {
        setCurrentIndex(prev => prev > 0 ? prev - 1 : feedbackData.length - 1)
    }

    const goToNext = () => {
        setCurrentIndex(prev => prev < feedbackData.length - 1 ? prev + 1 : 0)
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-4 text-lg text-gray-600 dark:text-gray-300">Loading feedback...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (!feedbackData.length) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 text-center">
                    <BiMessageSquareDetail className="mx-auto text-6xl text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        No Feedback Available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Complete some interview questions to see your feedback here.
                    </p>
                </div>
            </div>
        )
    }

    const currentFeedback = feedbackData[currentIndex]
    const StatusIcon = getRatingStatus(currentFeedback.rating).icon

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header with Overall Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <MdQuestionAnswer className="text-3xl" />
                    Interview Feedback Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">{overallStats.totalQuestions}</div>
                        <div className="text-sm opacity-90">Total Questions</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">{overallStats.averageRating}/5</div>
                        <div className="text-sm opacity-90">Average Rating</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-300">{overallStats.strongPoints}</div>
                        <div className="text-sm opacity-90">Strong Answers</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-300">{overallStats.improvementAreas}</div>
                        <div className="text-sm opacity-90">Can Improve</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4">
                <button
                    onClick={goToPrevious}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    disabled={feedbackData.length <= 1}
                >
                    <FaChevronLeft />
                    Previous
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Question {currentIndex + 1} of {feedbackData.length}
                    </span>
                    <div className="flex gap-1">
                        {feedbackData.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex
                                    ? 'bg-blue-600'
                                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={goToNext}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    disabled={feedbackData.length <= 1}
                >
                    Next
                    <FaChevronRight />
                </button>
            </div>

            {/* Main Feedback Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                {/* Question Section */}
                <div className="bg-blue-50 dark:bg-blue-900/50 p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        Question {currentIndex + 1}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                        {currentFeedback.question}
                    </p>
                </div>

                {/* Rating and Status */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <StatusIcon className={`text-2xl ${getRatingStatus(currentFeedback.rating).color}`} />
                            <div>
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(currentFeedback.rating)}`}>
                                    {getRatingStatus(currentFeedback.rating).text}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    {renderStarRating(currentFeedback.rating)}
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                        ({currentFeedback.rating}/5)
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Submitted on</div>
                            <div className="font-medium text-gray-700 dark:text-gray-300">
                                {currentFeedback.createdAt}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Answers Section */}
                <div className="p-6 space-y-6">
                    {/* Your Answer */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            Your Answer
                        </h4>
                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {currentFeedback.userAns || 'No answer provided'}
                            </p>
                        </div>
                    </div>

                    {/* Expected Answer */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            Expected Answer
                        </h4>
                        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {currentFeedback.correctAnswer || 'No expected answer available'}
                            </p>
                        </div>
                    </div>

                    {/* AI Feedback */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <FaLightbulb className="text-yellow-500" />
                            AI Feedback & Suggestions
                        </h4>
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 border-l-4 border-yellow-400">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {currentFeedback.feedback || 'No feedback available'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
                <button
                    onClick={() => {
                        toast.success('Feedback exported to console!')
                        console.log('Current Feedback Data:', currentFeedback)
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                    Export Feedback
                </button>
                <button
                    onClick={() => {
                        const feedbackText = `Question: ${currentFeedback.question}\n\nYour Answer: ${currentFeedback.userAns}\n\nFeedback: ${currentFeedback.feedback}\n\nRating: ${currentFeedback.rating}/5`
                        navigator.clipboard.writeText(feedbackText)
                        toast.success('Feedback copied to clipboard!')
                    }}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                >
                    Copy Feedback
                </button>
                <button
                    onClick={() => window.print()}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                >
                    Print Report
                </button>
            </div>
        </div>
    )
}

export default AnswerFeedback