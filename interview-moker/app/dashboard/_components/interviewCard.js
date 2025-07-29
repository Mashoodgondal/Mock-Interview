

// "use client"
// import { useRouter } from 'next/navigation'
// import React from 'react'

// const InterviewCard = ({ interview }) => {
//     const router = useRouter()
//     const onStart = () => {
//         router.push('/dashboard/interview/' + interview?.mockId)
//     }
//     const onFeedback = () => {
//         router.push('/dashboard/interview/' + interview?.mockId + '/feedback')
//     }
//     return (
//         <div className='border border-gray-400 rounded-md p-3'>
//             <h2>{interview?.jobPosition}</h2>
//             <h2>{interview?.jobExperience} Years of Experience</h2>
//             <h2>Created At {interview.createdAt}</h2>
//             <div className='flex items-center justify-between gap-2'>
//                 <button onClick={onFeedback} className='border border-gray-200 w-full'>Feedback</button>
//                 <button onClick={onStart} className='border border-gray-200 w-full'>Start</button>
//             </div>
//         </div>
//     )
// }

// export default InterviewCard





"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const InterviewCard = ({ interview }) => {
    const router = useRouter();
    const [startLoading, setStartLoading] = useState(false);
    const [feedbackLoading, setFeedbackLoading] = useState(false);

    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'Date not available';

            // Handle different date formats
            let date;
            if (typeof dateString === 'string') {
                // Try parsing ISO string or other formats
                date = new Date(dateString);
            } else if (dateString instanceof Date) {
                date = dateString;
            } else {
                return 'Invalid date format';
            }

            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Date unavailable';
        }
    };

    const onStart = async () => {
        try {
            setStartLoading(true);
            toast.loading('Starting interview...', { id: 'start-interview' });

            // Simulate some loading time (remove in production)
            await new Promise(resolve => setTimeout(resolve, 800));

            router.push('/dashboard/interview/' + interview?.mockId);
            toast.success('Interview started successfully!', { id: 'start-interview' });
        } catch (error) {
            console.error('Error starting interview:', error);
            toast.error('Failed to start interview. Please try again.', { id: 'start-interview' });
        } finally {
            setStartLoading(false);
        }
    };

    const onFeedback = async () => {
        try {
            setFeedbackLoading(true);
            toast.loading('Loading feedback...', { id: 'feedback' });

            // Simulate some loading time (remove in production)
            await new Promise(resolve => setTimeout(resolve, 800));

            router.push('/dashboard/interview/' + interview?.mockId + '/feedback');
            toast.success('Feedback loaded successfully!', { id: 'feedback' });
        } catch (error) {
            console.error('Error loading feedback:', error);
            toast.error('Failed to load feedback. Please try again.', { id: 'feedback' });
        } finally {
            setFeedbackLoading(false);
        }
    };

    return (
        // <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
        //     <div className="space-y-3 mb-6">
        //         <div>
        //             <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" title={interview?.jobPosition}>
        //                 {interview?.jobPosition || 'No Position Specified'}
        //             </h3>
        //         </div>

        //         <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        //             <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        //             </svg>
        //             <span>
        //                 {interview?.jobExperience ? `${interview.jobExperience} Years Experience` : 'Experience not specified'}
        //             </span>
        //         </div>

        //         <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        //             <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        //             </svg>
        //             <span>Created {interview?.createdAt}</span>
        //         </div>

        //         {interview?.jobDescription && (
        //             <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
        //                 <p className="line-clamp-2"> here is desc{interview.jobDescription}</p>
        //             </div>
        //         )}
        //     </div>

        //     <div className="flex items-center gap-3">
        //         <button
        //             onClick={onFeedback}
        //             disabled={feedbackLoading || startLoading}
        //             className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
        //         >
        //             {feedbackLoading ? (
        //                 <>
        //                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 dark:border-gray-300 mr-2"></div>
        //                     Loading...
        //                 </>
        //             ) : (
        //                 <>
        //                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        //                     </svg>
        //                     Feedback
        //                 </>
        //             )}
        //         </button>

        //         <button
        //             onClick={onStart}
        //             disabled={startLoading || feedbackLoading}
        //             className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        //         >
        //             {startLoading ? (
        //                 <>
        //                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        //                     Starting...
        //                 </>
        //             ) : (
        //                 <>
        //                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        //                     </svg>
        //                     Start
        //                 </>
        //             )}
        //         </button>
        //     </div>

        //     {/* Status indicator with dark mode support */}
        //     <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        //         <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        //             <span>ID: {interview?.mockId?.slice(-8) || 'N/A'}</span>
        //             <div className="flex items-center">
        //                 <div className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full mr-1 animate-pulse"></div>
        //                 <span>Ready</span>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-xl dark:hover:shadow-gray-900/30 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer group relative overflow-hidden">
            {/* Subtle 3D effect with pseudo-element */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10 dark:to-gray-900/10 rounded-lg"></div>
            </div>

            {/* Card content with enhanced 3D perspective */}
            <div className="relative space-y-3 mb-6 transform transition-transform duration-300 group-hover:scale-[0.99]">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" title={interview?.jobPosition}>
                        {interview?.jobPosition || 'No Position Specified'}
                    </h3>
                </div>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    <span>
                        {interview?.jobExperience ? `${interview.jobExperience} Years Experience` : 'Experience not specified'}
                    </span>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Created {interview?.createdAt}</span>
                </div>

                {interview?.jobDescription && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md transition-all duration-300 group-hover:bg-gray-100 dark:group-hover:bg-gray-600/50">
                        <p className="line-clamp-2">{interview.jobDescription}</p>
                    </div>
                )}
            </div>

            <div className="relative flex items-center gap-3">
                <button
                    onClick={onFeedback}
                    disabled={feedbackLoading || startLoading}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                >
                    {feedbackLoading ? (
                        <span className="inline-flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing
                        </span>
                    ) : (
                        <span className="inline-flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Feedback
                        </span>
                    )}
                </button>

                <button
                    onClick={onStart}
                    disabled={startLoading || feedbackLoading}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                    {startLoading ? (
                        <span className="inline-flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Starting
                        </span>
                    ) : (
                        <span className="inline-flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Start
                        </span>
                    )}
                </button>
            </div>

            {/* Status indicator with enhanced 3D effect */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 relative">
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>ID: {interview?.mockId?.slice(-8) || 'N/A'}</span>
                    <div className="flex items-center">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 dark:bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 dark:bg-green-400"></span>
                        </span>
                        <span>Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewCard;