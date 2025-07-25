"use client";
import Webcam from 'react-webcam';
import { FaVideo, FaInfoCircle } from 'react-icons/fa';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../../../utils/db";
import { MockInterview } from "../../../../utils/schema";
import { eq } from "drizzle-orm";
import Link from 'next/link';
import LocalButton from '../../_components/Button/page';

const Interview = () => {
    const params = useParams();
    const interviewId = params.interviewID;
    const [interviewData, setInterviewData] = useState(null);
    const [error, setError] = useState("");
    const [webcamEnable, setwebcamEnable] = useState(false);
    const [micEnable, setMicEnable] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);
    const [mediaLoading, setMediaLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && interviewId) {
            GetInterviewDetails(interviewId);
            setIsClient(true);
        }
    }, [interviewId]);

    const GetInterviewDetails = async (id) => {
        try {
            setLoading(true);
            setError("");

            const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, id));

            if (result.length > 0) {
                setInterviewData(result[0]);
            } else {
                setError("No interview data found.");
            }
        } catch (error) {
            console.error("Error fetching interview data:", error);
            setError("Failed to load interview details.");
        } finally {
            setLoading(false);
        }
    };

    const handleEnableMedia = async () => {
        try {
            setMediaLoading(true);
            setError("");

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setwebcamEnable(true);
            setMicEnable(true);
            setError("");
        } catch (videoError) {
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setMicEnable(true);
                setError("Camera not available, but microphone is enabled.");
            } catch (audioError) {
                setError("Neither camera nor microphone is available. Please check your device settings.");
            }
        } finally {
            setMediaLoading(false);
        }
    };

    // Loading skeleton component
    const LoadingSkeleton = ({ width = "w-full", height = "h-4" }) => (
        <div className={`${width} ${height} bg-gray-300 dark:bg-gray-600 rounded animate-pulse`}></div>
    );

    return (
        <div className="min-h-screen bg-gray-500/70 py-12 px-4 sm:px-6 lg:px-8 mb-20 pb-10">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-amber-200 sm:text-4xl">
                        Mock Interview Preparation
                    </h1>
                    <p className="mt-3 text-xl text-amber-100">
                        Get ready for your upcoming interview
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Interview Details Section */}
                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Interview Details</h2>

                            {loading ? (
                                // Loading state for interview details
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <span className="text-gray-600 dark:text-gray-300 font-medium min-w-[180px]">Job Position:</span>
                                        <LoadingSkeleton width="w-48" />
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-600 dark:text-gray-300 font-medium min-w-[180px]">Job Description:</span>
                                        <div className="flex-1 space-y-2">
                                            <LoadingSkeleton />
                                            <LoadingSkeleton width="w-3/4" />
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-600 dark:text-gray-300 font-medium min-w-[180px]">Experience Required:</span>
                                        <LoadingSkeleton width="w-32" />
                                    </div>
                                </div>
                            ) : error ? (
                                // Error state
                                <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                                    <p className="text-red-600 dark:text-red-300">{error}</p>
                                    <button
                                        onClick={() => GetInterviewDetails(interviewId)}
                                        className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                // Loaded state
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <span className="text-gray-600 dark:text-gray-300 font-medium min-w-[180px]">Job Position:</span>
                                        <span className="text-gray-800 dark:text-gray-100">
                                            {interviewData?.jobPosition || "Not specified"}
                                        </span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-600 dark:text-gray-300 font-medium min-w-[180px]">Job Description:</span>
                                        <span className="text-gray-800 dark:text-gray-100">
                                            {interviewData?.jobDesc || "Not specified"}
                                        </span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-600 dark:text-gray-300 font-medium min-w-[180px]">Experience Required:</span>
                                        <span className="text-gray-800 dark:text-gray-100">
                                            {interviewData?.jobExperience || "Not specified"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interview Tips Box */}
                        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <FaInfoCircle className="text-blue-500 mr-2" />
                                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">Interview Tips</h3>
                            </div>
                            <p className="text-blue-700 dark:text-blue-300">
                                This is a mock interview simulation. Make sure you're in a quiet environment with good lighting.
                                Dress professionally as you would for a real interview. The system will record your responses
                                for later review and feedback.
                            </p>
                        </div>
                    </div>

                    {/* Webcam Section */}
                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Video Setup</h2>

                        {webcamEnable ? (
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <Webcam
                                    onUserMedia={() => {
                                        setwebcamEnable(true);
                                        setMicEnable(true);
                                        setError("");
                                    }}
                                    mirrored={true}
                                    className="rounded-lg border border-gray-300 dark:border-gray-600 w-full max-w-md aspect-video"
                                />
                                <p className="mt-4 text-green-600 dark:text-green-400 font-medium">
                                    Camera and microphone are ready!
                                </p>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                                <div
                                    onClick={!mediaLoading ? handleEnableMedia : undefined}
                                    className={`bg-gray-100 dark:bg-gray-700 rounded-lg w-full max-w-md aspect-video flex items-center justify-center ${!mediaLoading
                                        ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                                        : 'cursor-not-allowed opacity-50'
                                        }`}
                                >
                                    <div className="text-center">
                                        {mediaLoading ? (
                                            <>
                                                <svg className="animate-spin mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <p className="mt-2 text-gray-500 dark:text-gray-300">Enabling camera...</p>
                                            </>
                                        ) : (
                                            <>
                                                <FaVideo className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
                                                <p className="mt-2 text-gray-500 dark:text-gray-300">Click to enable camera</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-800 dark:text-gray-200">Enable Camera & Microphone</p>

                                {error && (
                                    <div className="w-full max-w-md p-3 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                {micEnable && !error && (
                                    <div className="w-full max-w-md p-2 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg">
                                        Microphone enabled successfully
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Start Interview Button */}
                <div className="mt-10 flex justify-end">
                    <Link href={'/dashboard/interview/' + interviewId + '/start'}>
                        <LocalButton
                            title="Start Interview Now"
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!webcamEnable || loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                </>
                            ) : (
                                "Start Interview Now"
                            )}
                        </LocalButton>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Interview;