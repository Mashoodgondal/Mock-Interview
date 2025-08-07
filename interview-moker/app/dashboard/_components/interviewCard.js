


"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const InterviewCard = ({ interview, onDelete }) => {
    const router = useRouter();
    const [startLoading, setStartLoading] = useState(false);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

            // Optionally add a small delay for smoother UX
            await new Promise(resolve => setTimeout(resolve, 300));

            // Navigate to the interview page
            router.push('/dashboard/interview/' + interview?.mockId);
        } catch (error) {
            console.error('Error starting interview:', error);
            toast.error('Failed to start interview. Please try again.');
            setStartLoading(false); // Only stop loading on error
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

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setDeleteLoading(true);
            toast.loading('Deleting interview...', { id: 'delete-interview' });

            // Call the parent's delete function
            if (onDelete) {
                await onDelete(interview.id);
            }

            toast.success('Interview deleted successfully!', { id: 'delete-interview' });
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting interview:', error);
            toast.error('Failed to delete interview. Please try again.', { id: 'delete-interview' });
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    // Delete Confirmation Modal
    const DeleteModal = () => (
        showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 shadow-2xl">
                    <div className="p-6">
                        {/* Modal Header */}
                        <div className="flex items-center mb-4">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full mr-3">
                                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Delete Interview
                            </h3>
                        </div>

                        {/* Modal Content */}
                        <div className="mb-6">
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                Are you sure you want to delete this interview?
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border-l-4 border-red-400">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {interview?.jobPosition || 'No Position Specified'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Created {formatDate(interview?.createdAt)}
                                </p>
                            </div>
                            <p className="text-sm text-red-600 dark:text-red-400 mt-3 font-medium">
                                This action cannot be undone.
                            </p>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex space-x-3">
                            <button
                                onClick={handleDeleteCancel}
                                disabled={deleteLoading}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleteLoading}
                                className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-600 rounded-lg hover:bg-red-700 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {deleteLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Interview'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );

    return (
        <>
            <div className="relative group perspective-1000">

                <button
                    onClick={handleDeleteClick}
                    disabled={startLoading || feedbackLoading || deleteLoading}
                    className="absolute top-3 right-3 z-20 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Interview"
                >
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>

                {/* 3D Card Container */}
                <div className="relative h-full transition-all duration-500 transform-style-preserve-3d group-hover:rotate-x-[5deg] group-hover:rotate-y-[2deg] group-hover:translate-z-16">
                    {/* Card Front */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/70 rounded-xl p-6 shadow-2xl hover:shadow-3xl dark:hover:shadow-3xl-dark overflow-hidden transform translate-z-0 backface-hidden">

                        {/* 3D Depth Layers */}
                        <div className="absolute inset-0 rounded-xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute -bottom-1 -left-1 w-1/2 h-1/2 bg-blue-500/5 dark:bg-blue-400/5 rounded-full filter blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute -top-1 -right-1 w-1/2 h-1/2 bg-purple-500/5 dark:bg-purple-400/5 rounded-full filter blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 space-y-4">
                            {/* Header with 3D text effect */}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight transform transition-transform duration-300 group-hover:translate-z-10">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                        {interview?.jobPosition || 'No Position Specified'}
                                    </span>
                                </h3>
                                <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 transform transition-transform duration-300 group-hover:scale-x-110"></div>
                            </div>

                            {/* 3D Details */}
                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 transform transition-transform duration-300 group-hover:translate-z-5">
                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3 shadow-inner">
                                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                        </svg>
                                    </div>
                                    <span>{interview?.jobExperience ? `${interview.jobExperience} Years Experience` : 'Experience not specified'}</span>
                                </div>

                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 transform transition-transform duration-300 group-hover:translate-z-5">
                                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3 shadow-inner">
                                        <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span>Created {interview?.createdAt}</span>
                                </div>

                                {interview?.jobDescription && (
                                    <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-inner transform transition-transform duration-300 group-hover:translate-z-8">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{interview.jobDescription}</p>
                                    </div>
                                )}
                            </div>

                            {/* 3D Buttons */}
                            <div className="mt-6 flex space-x-3 transform transition-transform duration-300 group-hover:translate-z-12">
                                <button
                                    onClick={onFeedback}
                                    disabled={feedbackLoading || startLoading || deleteLoading}
                                    className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {feedbackLoading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Feedback
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={onStart}
                                    disabled={startLoading || feedbackLoading || deleteLoading}
                                    className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {startLoading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Starting
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Start
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* 3D Status Bar */}
                            <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 transform transition-transform duration-300 group-hover:translate-z-8">
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>ID: {interview?.mockId?.slice(-8) || 'N/A'}</span>
                                    <div className="flex items-center space-x-1.5">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 dark:bg-green-500 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 dark:bg-green-400"></span>
                                        </span>
                                        <span className="font-medium text-green-600 dark:text-green-400">Ready</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subtle 3D Card Back Effect (for depth illusion) */}
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-lg transform rotate-y-180 backface-hidden translate-z-[-1px] opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteModal />
        </>
    );
};

export default InterviewCard;