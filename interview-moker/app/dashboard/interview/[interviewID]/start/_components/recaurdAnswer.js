"use client"
import React, { useEffect, useState } from 'react'
import { FaMicrophone, FaStop } from 'react-icons/fa';
import Webcam from 'react-webcam'
import Image from 'next/image'
import { toast } from 'react-hot-toast'; // or 'sonner' depending on what you're using
import { userAnswer as userAnswerSchema } from '../../../../../../utils/schema';
import camimg from '../../../../../../public/images.jpg'
import chatSession from '../../../../../../utils/gemini';
import { db } from '../../../../../../utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
// Import the hook properly
import useSpeechToText from 'react-hook-speech-to-text';

const RecordAnswer = ({ questions, activeIndex, interviewData }) => {
    const { user } = useUser()
    const [userAnswer, setUserAnswer] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [inputMode, setInputMode] = useState('voice')

    // Use the speech recognition hook correctly
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    const saveUserAnswer = async () => {
        if (isRecording) {
            stopSpeechToText();
        }
        await submitAnswer();
    };

    const submitAnswer = async () => {
        const trimmedAnswer = userAnswer?.trim();
        if (!trimmedAnswer || trimmedAnswer.split(' ').length < 3) {
            toast.error('Your answer is too short, please try again.');
            return;
        }

        if (!interviewData || !interviewData.mockId) {
            console.error("Missing interviewData or mockId");
            toast.error("Interview session not initialized properly.");
            return;
        }

        const feedbackPrompt =
            `You are a supportive interview coach. Evaluate the user's answer based on communication skills, not correctness.\n` +
            `Focus on: clarity, structure, confidence, and relevance to the question asked.\n\n` +
            `Question: ${questions[activeIndex]?.question}\n` +
            `User Answer: ${userAnswer}\n\n` +
            `Guidelines:\n` +
            `- Rate 3-5 (avoid low ratings unless answer is completely off-topic)\n` +
            `- Keep feedback under 25 words\n` +
            `- Start with something positive\n` +
            `- Give one specific improvement tip if needed\n` +
            `- Don't compare to a "correct" answer - evaluate communication quality\n\n` +
            `Return JSON: {"rating": "3-5", "feedback": "brief positive feedback with one improvement tip"}\n` +
            `Example: {"rating": "4", "feedback": "Clear explanation with good examples. Consider adding more specific details to strengthen your points."}`;

        try {
            // Show loading toast
            const loadingToast = toast.loading('Submitting your answer...');

            const result = await chatSession.sendMessage(feedbackPrompt);
            const rawText = await result.response.text();

            console.log("Raw AI Response:", rawText);

            const cleaned = rawText
                .replace(/```json|```/g, '')
                .replace(/,\s*}/g, '}')
                .replace(/,\s*]/g, ']')
                .trim();

            let feedbackJSON;
            try {
                feedbackJSON = JSON.parse(cleaned);
            } catch (err) {
                console.error("JSON Parse Error:", err);
                console.error("Problematic JSON:", cleaned);
                toast.dismiss(loadingToast);
                toast.error("AI response was not valid JSON. Please try recording again.");
                return;
            }

            console.log("Interview Mock ID:", interviewData.mockId);

            const resp = await db.insert(userAnswerSchema).values({
                mockIdRef: interviewData.mockId,
                question: questions[activeIndex]?.question || '',
                correctAnswer: questions[activeIndex]?.answer || '',
                userAns: userAnswer,
                feedback: feedbackJSON.feedback || '',
                rating: feedbackJSON.rating || '',
                userEmail: user?.primaryEmailAddress?.emailAddress || '',
                createdAt: moment().format('DD-MM-yyyy'),
            });

            console.log("Database insert response:", resp);

            // Dismiss loading and show success
            toast.dismiss(loadingToast);
            toast.success('Answer submitted successfully ✅');

            // Reset form
            setUserAnswer('');
            setResults([]);
            setInputMode('voice');
            setIsTyping(false);

        } catch (err) {
            console.error("Error while saving answer:", err);
            toast.error("Something went wrong while saving the answer. Check console for details.");
        }
    };

    const handleStartRecording = () => {
        if (!isTyping) {
            setResults([]);
            setUserAnswer('');
            startSpeechToText();
            toast.success('Recording started! Speak now...');
        }
    };

    const handleStopRecording = () => {
        stopSpeechToText();
        toast.info('Recording stopped');
    };

    const handleTextInputChange = (e) => {
        const value = e.target.value;
        setUserAnswer(value);
        setIsTyping(value.length > 0);
    };

    const handleModeSwitch = (mode) => {
        if (isRecording) {
            stopSpeechToText();
        }
        setInputMode(mode);
        if (mode === 'voice') {
            setIsTyping(false);
        }
        toast.info(`Switched to ${mode} mode`);
    };

    // Update user answer when speech results change
    useEffect(() => {
        if (results.length > 0 && inputMode === 'voice' && !isTyping) {
            const transcript = results.map(result => result.transcript).join(' ');
            setUserAnswer(transcript);
        }
    }, [results, inputMode, isTyping]);

    // Handle speech recognition errors
    useEffect(() => {
        if (error) {
            console.error('Speech recognition error:', error);
            toast.error(`Speech recognition error: ${error}`);
        }
    }, [error]);

    // Check if speech recognition is supported
    const isSpeechSupported = typeof window !== 'undefined' &&
        ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

    return (
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md max-w-md mx-auto space-y-4">
            {/* Webcam section */}
            <div className="relative flex flex-col items-center justify-center rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                <Image
                    src={camimg}
                    alt="camera placeholder"
                    width={200}
                    height={200}
                    className="absolute z-0 opacity-30"
                />
                <Webcam
                    mirrored={true}
                    className="relative z-10 w-full h-[300px] object-cover"
                />
            </div>

            {/* Input Mode Toggle */}
            <div className="flex justify-center gap-2 mb-4">
                <button
                    onClick={() => handleModeSwitch('voice')}
                    disabled={!isSpeechSupported}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${inputMode === 'voice'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        } ${!isSpeechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    🎤 Voice {!isSpeechSupported ? '(Not Supported)' : ''}
                </button>
                <button
                    onClick={() => handleModeSwitch('text')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${inputMode === 'text'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                >
                    ⌨️ Type
                </button>
            </div>

            {/* Show message if speech is not supported and in voice mode */}
            {!isSpeechSupported && inputMode === 'voice' && (
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg mb-4">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        <strong>Speech recognition not supported in this browser.</strong>
                        Please switch to text mode or use Chrome/Edge for voice recording.
                    </p>
                </div>
            )}

            {/* Text Input Section */}
            {inputMode === 'text' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type your answer:
                        </label>
                        <textarea
                            value={userAnswer}
                            onChange={handleTextInputChange}
                            placeholder="Type your answer here..."
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            rows={6}
                        />
                    </div>
                    <button
                        onClick={submitAnswer}
                        disabled={!userAnswer.trim() || !interviewData?.mockId}
                        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200"
                    >
                        Submit Answer
                    </button>
                </div>
            )}

            {/* Voice Recording Section */}
            {inputMode === 'voice' && isSpeechSupported && (
                <>
                    {userAnswer && (
                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Your Answer:</strong> {userAnswer}
                            </p>
                        </div>
                    )}

                    {/* Show interim results while recording */}
                    {isRecording && interimResult && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg mb-4">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                <strong>Live transcript:</strong> {interimResult}
                            </p>
                        </div>
                    )}

                    {isRecording && (
                        <div className="flex items-center justify-center gap-2 mb-4 text-red-600">
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">Recording... Speak clearly</span>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {!isRecording ? (
                            <button
                                onClick={handleStartRecording}
                                disabled={!interviewData?.mockId || isTyping}
                                className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                                title={isTyping ? "Cannot record while typing" : ""}
                            >
                                <FaMicrophone />
                                Start Recording
                            </button>
                        ) : (
                            <button
                                onClick={handleStopRecording}
                                className="w-full sm:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                            >
                                <FaStop />
                                Stop Recording
                            </button>
                        )}

                        {userAnswer && !isRecording && (
                            <button
                                onClick={submitAnswer}
                                disabled={!interviewData?.mockId}
                                className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200"
                            >
                                Submit Answer
                            </button>
                        )}
                    </div>
                </>
            )}

            {/* Debug button */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => {
                        console.log("Current Answer:", userAnswer);
                        console.log("Interview Data:", interviewData);
                        console.log("Active Question:", questions[activeIndex]);
                        console.log("Input Mode:", inputMode);
                        console.log("Is Typing:", isTyping);
                        console.log("Is Recording:", isRecording);
                        console.log("Speech Recognition Supported:", isSpeechSupported);
                        console.log("Speech Results:", results);
                        console.log("Interim Result:", interimResult);
                        console.log("Error:", error);
                        toast.info('Debug info logged to console');
                    }}
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-all duration-200 text-sm"
                >
                    🐛 Debug Info
                </button>
            </div>
        </div>
    )
}

export default RecordAnswer


// "use client"
// import React, { useEffect, useState } from 'react'
// import { FaMicrophone, FaStop } from 'react-icons/fa';
// import Webcam from 'react-webcam'
// import Image from 'next/image'
// import { userAnswer as userAnswerSchema } from '../../../../../../utils/schema';
// import camimg from '../../../../../../public/images.jpg'
// import chatSession from '../../../../../../utils/gemini';
// import { db } from '../../../../../../utils/db';
// import { useUser } from '@clerk/nextjs';
// import moment from 'moment';
// // Import your custom speech recognition hook instead
// import useSpeechToText from '../../../../_components/hook/useSpeech';

// const RecordAnswer = ({ questions, activeIndex, interviewData }) => {
//     const { user } = useUser()
//     const [userAnswer, setUserAnswer] = useState('')
//     const [isTyping, setIsTyping] = useState(false)
//     const [inputMode, setInputMode] = useState('voice')

//     // Use the custom speech recognition hook
//     const {
//         isRecording,
//         transcript,
//         error,
//         isSupported,
//         startRecording,
//         stopRecording,
//         clearTranscript
//     } = useSpeechToText();

//     const saveUserAnswer = async () => {
//         if (isRecording) {
//             stopRecording();
//         }
//         await submitAnswer();
//     };



//     const submitAnswer = async () => {
//         const trimmedAnswer = userAnswer?.trim();
//         if (!trimmedAnswer || trimmedAnswer.split(' ').length < 3) {
//             alert('Your answer is too short, please try again.');
//             return;
//         }

//         if (!interviewData || !interviewData.mockId) {
//             console.error("Missing interviewData or mockId");
//             alert("Interview session not initialized properly.");
//             return;
//         }

//         const feedbackPrompt =
//             `You are a supportive interview coach. Evaluate the user's answer based on communication skills, not correctness.\n` +
//             `Focus on: clarity, structure, confidence, and relevance to the question asked.\n\n` +
//             `Question: ${questions[activeIndex]?.question}\n` +
//             `User Answer: ${userAnswer}\n\n` +
//             `Guidelines:\n` +
//             `- Rate 3-5 (avoid low ratings unless answer is completely off-topic)\n` +
//             `- Keep feedback under 25 words\n` +
//             `- Start with something positive\n` +
//             `- Give one specific improvement tip if needed\n` +
//             `- Don't compare to a "correct" answer - evaluate communication quality\n\n` +
//             `Return JSON: {"rating": "3-5", "feedback": "brief positive feedback with one improvement tip"}\n` +
//             `Example: {"rating": "4", "feedback": "Clear explanation with good examples. Consider adding more specific details to strengthen your points."}`;

//         try {
//             const result = await chatSession.sendMessage(feedbackPrompt);
//             const rawText = await result.response.text();

//             console.log("Raw AI Response:", rawText);

//             const cleaned = rawText
//                 .replace(/```json|```/g, '')
//                 .replace(/,\s*}/g, '}')
//                 .replace(/,\s*]/g, ']')
//                 .trim();

//             let feedbackJSON;
//             try {
//                 feedbackJSON = JSON.parse(cleaned);
//             } catch (err) {
//                 console.error("JSON Parse Error:", err);
//                 console.error("Problematic JSON:", cleaned);
//                 alert("AI response was not valid JSON. Please try recording again.");
//                 return;
//             }

//             console.log("Interview Mock ID:", interviewData.mockId);

//             const resp = await db.insert(userAnswerSchema).values({
//                 mockIdRef: interviewData.mockId,
//                 question: questions[activeIndex]?.question || '',
//                 correctAnswer: questions[activeIndex]?.answer || '',
//                 userAns: userAnswer,
//                 feedback: feedbackJSON.feedback || '',
//                 rating: feedbackJSON.rating || '',
//                 userEmail: user?.primaryEmailAddress?.emailAddress || '',
//                 createdAt: moment().format('DD-MM-yyyy'),
//             });

//             console.log("Database insert response:", resp);
//             alert('Answer submitted successfully ✅');
//             setUserAnswer('');
//             clearTranscript();
//             setInputMode('voice');
//             setIsTyping(false);

//         } catch (err) {
//             console.error("Error while saving answer:", err);
//             alert("Something went wrong while saving the answer. Check console for details.");
//         }
//     };

//     const handleStartRecording = () => {
//         if (!isTyping && isSupported) {
//             clearTranscript();
//             startRecording();
//         }
//     };

//     const handleTextInputChange = (e) => {
//         const value = e.target.value;
//         setUserAnswer(value);
//         setIsTyping(value.length > 0);
//     };

//     const handleModeSwitch = (mode) => {
//         if (isRecording) {
//             stopRecording();
//         }
//         setInputMode(mode);
//         if (mode === 'voice') {
//             setIsTyping(false);
//         }
//     };

//     // Update user answer when new transcript is available
//     useEffect(() => {
//         if (transcript && inputMode === 'voice' && !isTyping) {
//             setUserAnswer(prevAnswer => {
//                 // Avoid duplicating content
//                 if (!prevAnswer.includes(transcript)) {
//                     return prevAnswer + ' ' + transcript;
//                 }
//                 return prevAnswer;
//             });
//         }
//     }, [transcript, inputMode, isTyping]);

//     // Show error message if speech recognition is not supported
//     if (error && !isSupported) {
//         return (
//             <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md max-w-md mx-auto space-y-4">
//                 <div className="text-center text-red-500">
//                     <p>{error}</p>
//                     <p className="mt-2">Please use the text input mode instead.</p>
//                 </div>

//                 {/* Show only text input mode */}
//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                             Type your answer:
//                         </label>
//                         <textarea
//                             value={userAnswer}
//                             onChange={handleTextInputChange}
//                             placeholder="Type your answer here..."
//                             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
//                             rows={6}
//                         />
//                     </div>
//                     <button
//                         onClick={submitAnswer}
//                         disabled={!userAnswer.trim() || !interviewData?.mockId}
//                         className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200"
//                     >
//                         Submit Answer
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md max-w-md mx-auto space-y-4">
//             {/* Webcam section */}
//             <div className="relative flex flex-col items-center justify-center rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
//                 <Image
//                     src={camimg}
//                     alt="camera placeholder"
//                     width={200}
//                     height={200}
//                     className="absolute z-0 opacity-30"
//                 />
//                 <Webcam
//                     mirrored={true}
//                     className="relative z-10 w-full h-[300px] object-cover"
//                 />
//             </div>

//             {/* Input Mode Toggle */}
//             <div className="flex justify-center gap-2 mb-4">
//                 <button
//                     onClick={() => handleModeSwitch('voice')}
//                     disabled={!isSupported}
//                     className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${inputMode === 'voice'
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
//                         } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                     🎤 Voice {!isSupported ? '(Not Supported)' : ''}
//                 </button>
//                 <button
//                     onClick={() => handleModeSwitch('text')}
//                     className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${inputMode === 'text'
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
//                         }`}
//                 >
//                     ⌨️ Type
//                 </button>
//             </div>

//             {/* Text Input Section */}
//             {inputMode === 'text' && (
//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                             Type your answer:
//                         </label>
//                         <textarea
//                             value={userAnswer}
//                             onChange={handleTextInputChange}
//                             placeholder="Type your answer here..."
//                             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
//                             rows={6}
//                         />
//                     </div>
//                     <button
//                         onClick={submitAnswer}
//                         disabled={!userAnswer.trim() || !interviewData?.mockId}
//                         className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200"
//                     >
//                         Submit Answer
//                     </button>
//                 </div>
//             )}

//             {/* Voice Recording Section */}
//             {inputMode === 'voice' && isSupported && (
//                 <>
//                     {userAnswer && (
//                         <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
//                             <p className="text-sm text-gray-700 dark:text-gray-300">
//                                 <strong>Your Answer:</strong> {userAnswer}
//                             </p>
//                         </div>
//                     )}

//                     {isRecording && (
//                         <div className="flex items-center justify-center gap-2 mb-4 text-red-600">
//                             <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
//                             <span className="text-sm font-medium">Recording...</span>
//                         </div>
//                     )}

//                     {error && (
//                         <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg mb-4">
//                             <p className="text-sm text-red-700 dark:text-red-300">
//                                 <strong>Error:</strong> {error}
//                             </p>
//                         </div>
//                     )}

//                     <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//                         <button
//                             onClick={isRecording ? saveUserAnswer : handleStartRecording}
//                             disabled={!interviewData?.mockId || isTyping}
//                             className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
//                                 ${isRecording
//                                     ? 'bg-red-600 hover:bg-red-700 text-white'
//                                     : 'bg-blue-600 hover:bg-blue-700 text-white'}
//                                 ${isTyping ? 'bg-gray-400' : ''}
//                             `}
//                             title={isTyping ? "Cannot record while typing" : ""}
//                         >
//                             {isRecording ? <FaStop /> : <FaMicrophone />}
//                             {isRecording ? 'Stop & Submit' : 'Start Recording'}
//                         </button>

//                         {userAnswer && !isRecording && (
//                             <button
//                                 onClick={submitAnswer}
//                                 disabled={!interviewData?.mockId}
//                                 className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200"
//                             >
//                                 Submit Answer
//                             </button>
//                         )}
//                     </div>
//                 </>
//             )}

//             {/* Debug button */}
//             <div className="flex justify-center mt-4">
//                 <button
//                     onClick={() => {
//                         console.log("Current Answer:", userAnswer);
//                         console.log("Interview Data:", interviewData);
//                         console.log("Active Question:", questions[activeIndex]);
//                         console.log("Input Mode:", inputMode);
//                         console.log("Is Typing:", isTyping);
//                         console.log("Is Recording:", isRecording);
//                         console.log("Speech Recognition Supported:", isSupported);
//                         console.log("Transcript:", transcript);
//                     }}
//                     className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-all duration-200 text-sm"
//                 >
//                     🐛 Debug Info
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default RecordAnswer







