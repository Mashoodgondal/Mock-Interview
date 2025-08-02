// "use client";
// import { db } from '../../../utils/db';
// import { MockInterview } from '../../../utils/schema';
// import { useUser } from '@clerk/nextjs';
// import { desc, eq } from 'drizzle-orm';
// import React, { useEffect, useState } from 'react';
// import InterviewCard from './interviewCard';
// import { toast } from 'react-hot-toast';

// const InterviewList = () => {
//     const { user } = useUser();
//     const [interviewList, setInterviewList] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (user) {
//             GetInterviewList();
//         }
//     }, [user]);

//     const GetInterviewList = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             const result = await db
//                 .select()
//                 .from(MockInterview)
//                 .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
//                 .orderBy(desc(MockInterview.id));

//             console.log(result);
//             setInterviewList(result);

//             if (result.length === 0) {
//                 toast.success('No interviews found. Create your first interview!');
//             } else {
//                 toast.success(`Loaded ${result.length} interview${result.length > 1 ? 's' : ''}`);
//             }
//         } catch (error) {
//             console.error('Error fetching interviews:', error);
//             setError('Failed to load interviews');
//             toast.error('Failed to load interviews. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const LoadingSkeleton = () => (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-3">
//             {[1, 2, 3, 4, 5, 6].map((item) => (
//                 <div key={item} className="animate-pulse">
//                     <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
//                         <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
//                         <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
//                         <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
//                         <div className="flex gap-3">
//                             <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
//                             <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );

//     const EmptyState = () => (
//         <div className="text-center py-12">
//             <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
//                 <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No interviews yet</h3>
//             <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first mock interview</p>
//             <button
//                 onClick={() => toast.success('Create your first interview!')}
//                 className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
//             >
//                 Create Interview
//             </button>
//         </div>
//     );

//     if (!user) {
//         return (
//             <div className="flex items-center justify-center py-12">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 <span className="ml-2 text-gray-600 dark:text-gray-400">Loading user data...</span>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Previous Interviews</h2>
//                     <p className="text-gray-600 dark:text-gray-400 mt-1">
//                         {loading ? 'Loading...' : `${interviewList.length} interview${interviewList.length !== 1 ? 's' : ''} found`}
//                     </p>
//                 </div>
//                 <button
//                     onClick={GetInterviewList}
//                     disabled={loading}
//                     className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
//                 >
//                     {loading ? (
//                         <>
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 dark:border-gray-300 mr-2"></div>
//                             Refreshing...
//                         </>
//                     ) : (
//                         <>
//                             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                             </svg>
//                             Refresh
//                         </>
//                     )}
//                 </button>
//             </div>

//             {error && (
//                 <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
//                     <div className="flex">
//                         <svg className="h-5 w-5 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         <div className="ml-3">
//                             <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
//                             <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {loading ? (
//                 <LoadingSkeleton />
//             ) : interviewList.length === 0 ? (
//                 <EmptyState />
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {interviewList.map((interview, index) => (
//                         <InterviewCard
//                             interview={interview}
//                             key={interview.id || index}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default InterviewList;



"use client";
import { db } from '../../../utils/db';
import { MockInterview } from '../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewCard from './interviewCard';
import { toast } from 'react-hot-toast';

const InterviewList = () => {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            GetInterviewList();
        }
    }, [user]);

    const GetInterviewList = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(MockInterview.id));

            console.log(result);
            setInterviewList(result);

            if (result.length === 0) {
                toast.success('No interviews found. Create your first interview!');
            } else {
                toast.success(`Loaded ${result.length} interview${result.length > 1 ? 's' : ''}`);
            }
        } catch (error) {
            console.error('Error fetching interviews:', error);
            setError('Failed to load interviews');
            toast.error('Failed to load interviews. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInterview = async (interviewId) => {
        try {
            // Delete from database
            await db
                .delete(MockInterview)
                .where(eq(MockInterview.id, interviewId));

            // Remove from local state
            setInterviewList(prevList =>
                prevList.filter(interview => interview.id !== interviewId)
            );

            // Don't show toast here - let the InterviewCard component handle it
        } catch (error) {
            console.error('Error deleting interview:', error);
            throw error; // Re-throw to handle in card component
        }
    };

    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="animate-pulse">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="flex gap-3">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const EmptyState = () => (
        <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No interviews yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first mock interview</p>
            <button
                onClick={() => toast.success('Create your first interview!')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
                Create Interview
            </button>
        </div>
    );

    if (!user) {
        return (
            <div className="flex items-center justify-center space-y-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading user data...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Previous Interviews</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {loading ? 'Loading...' : `${interviewList.length} interview${interviewList.length !== 1 ? 's' : ''} found`}
                    </p>
                </div>
                <button
                    onClick={GetInterviewList}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 dark:border-gray-300 mr-2"></div>
                            Refreshing...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                    <div className="flex">
                        <svg className="h-5 w-5 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <LoadingSkeleton />
            ) : interviewList.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interviewList.map((interview, index) => (
                        <InterviewCard
                            interview={interview}
                            key={interview.id || index}
                            onDelete={handleDeleteInterview}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default InterviewList;