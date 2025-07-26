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






import React from 'react'

const Feedback = () => {
    return (
        <div>Feedback</div>
    )
}

export default Feedback



// "use client"
// import React, { useEffect, useState } from 'react'
// import { useParams, useSearchParams } from 'next/navigation' // Add this import
// import { db } from '../../../../../utils/db'
// import { userAnswer as userAnswerSchema } from '../../../../../utils/schema'
// import { eq } from 'drizzle-orm'
// import { useUser } from '@clerk/nextjs'
// import { FaStar, FaRegStar, FaEye, FaEyeSlash, FaCalendarAlt, FaUser } from 'react-icons/fa'

// const InterviewResults = ({ mockId: propMockId, interviewData }) => {
//     const { user } = useUser()
//     const params = useParams()
//     const searchParams = useSearchParams()

//     // Get mockId from multiple sources
//     const mockId = propMockId || params?.mockId || searchParams?.get('mockId')

//     const [results, setResults] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [expandedAnswers, setExpandedAnswers] = useState({})

//     useEffect(() => {
//         console.log("mockId from props:", propMockId)
//         console.log("mockId from params:", params?.mockId)
//         console.log("mockId from searchParams:", searchParams?.get('mockId'))
//         console.log("Final mockId:", mockId)

//         if (mockId) {
//             fetchResults()
//         }
//     }, [mockId])

//     const fetchResults = async () => {
//         try {
//             console.log("Fetching results for mockId:", mockId)
//             setLoading(true)
//             const response = await db
//                 .select()
//                 .from(userAnswerSchema)
//                 .where(eq(userAnswerSchema.mockIdRef, mockId))

//             console.log("Fetched results:", response)
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

//     // Debug information
//     if (!mockId) {
//         return (
//             <div className="text-red-600 font-medium p-6 text-center">
//                 <h2 className="text-xl font-bold mb-4">Debug Information</h2>
//                 <div className="text-left bg-gray-100 p-4 rounded-lg mb-4">
//                     <p><strong>PropMockId:</strong> {String(propMockId || 'undefined')}</p>
//                     <p><strong>Params MockId:</strong> {String(params?.mockId || 'undefined')}</p>
//                     <p><strong>Search Params MockId:</strong> {String(searchParams?.get('mockId') || 'undefined')}</p>
//                     <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
//                 </div>
//                 <p className="text-red-600">Error: No mockId provided. Please return to the previous page and try again.</p>
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
//                 <p className="text-gray-600 dark:text-gray-400 text-lg">No interview results found for mockId: {mockId}</p>
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