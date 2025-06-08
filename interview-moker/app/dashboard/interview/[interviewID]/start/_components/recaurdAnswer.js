
// "use client"
// import React, { useEffect, useState } from 'react'
// import { FaMicrophone, FaStop } from 'react-icons/fa';
// import Webcam from 'react-webcam'
// import Image from 'next/image'
// import { userAnswer as userAnswerSchema } from '../../../../../../utils/schema'; // Import the schema
// import camimg from '../../../../../../public/images.jpg'
// import chatSession from '../../../../../../utils/gemini';
// import { db } from '../../../../../../utils/db';
// import { useUser } from '@clerk/nextjs';
// import moment from 'moment';
// import useSpeechToText from 'react-hook-speech-to-text';
// // import InterviewResults from '../../feedback/page';
// // import Link from 'next/link';
// const RecordAnswer = ({ questions, activeIndex, interviewData }) => {
//     const { user } = useUser()
//     const [userAnswer, setUserAnswer] = useState('')
//     const [isTyping, setIsTyping] = useState(false)
//     const [inputMode, setInputMode] = useState('voice') // 'voice' or 'text'

//     const {
//         error,
//         interimResult,
//         isRecording,
//         results,
//         startSpeechToText,
//         stopSpeechToText,
//         setResults,
//     } = useSpeechToText({
//         continuous: true,
//         useLegacyResults: false
//     })

//     const saveUserAnswer = async () => {
//         if (isRecording) {
//             stopSpeechToText();
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
//                 .replace(/,\s*}/g, '}') // Remove trailing commas
//                 .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
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

//             console.log("Interview Mock ID:", interviewData.mockId); // Fixed: use interviewData.mockId

//             const resp = await db.insert(userAnswerSchema).values({
//                 mockIdRef: interviewData.mockId,
//                 question: questions[activeIndex]?.question || '',
//                 correctAnswer: questions[activeIndex]?.answer || '',
//                 userAns: userAnswer,
//                 feedback: feedbackJSON.feedback || '',
//                 rating: feedbackJSON.rating || '',
//                 userEmail: user?.primaryEmailAddress?.emailAddress || '',
//                 createdAt: moment().format('DD-MM-yyyy'), // Fixed typo: was 'cratedAt'
//             });

//             console.log("Database insert response:", resp);
//             alert('Answer submitted successfully ✅');
//             setUserAnswer(''); // Clear the answer after successful submission
//             setResults([]); // Clear speech results
//             setInputMode('voice'); // Reset to voice mode
//             setIsTyping(false);

//         } catch (err) {
//             console.error("Error while saving answer:", err);
//             alert("Something went wrong while saving the answer. Check console for details.");
//         }
//     };

//     const handleStartRecording = () => {
//         if (!isTyping) {
//             startSpeechToText();
//         }
//     };

//     const handleTextInputChange = (e) => {
//         const value = e.target.value;
//         setUserAnswer(value);
//         setIsTyping(value.length > 0);
//     };

//     const handleModeSwitch = (mode) => {
//         if (isRecording) {
//             stopSpeechToText();
//         }
//         setInputMode(mode);
//         if (mode === 'voice') {
//             setIsTyping(false);
//         }
//     };

//     if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

//     useEffect(() => {
//         if (results.length > 0 && inputMode === 'voice' && !isTyping) {
//             const latestResult = results[results.length - 1];
//             setUserAnswer(prevAns => prevAns + ' ' + latestResult.transcript);
//         }
//     }, [results, inputMode, isTyping]);

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
//                     className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${inputMode === 'voice'
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
//                         }`}
//                 >
//                     🎤 Voice
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

//             {/* Text Input Section - Only show when in text mode */}
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

//             {/* Voice Recording Section - Only show when in voice mode */}
//             {inputMode === 'voice' && (
//                 <>
//                     {/* Current answer display */}
//                     {userAnswer && (
//                         <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
//                             <p className="text-sm text-gray-700 dark:text-gray-300">
//                                 <strong>Your Answer:</strong> {userAnswer}
//                             </p>
//                         </div>
//                     )}

//                     {/* Recording status */}
//                     {isRecording && (
//                         <div className="flex items-center justify-center gap-2 mb-4 text-red-600">
//                             <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
//                             <span className="text-sm font-medium">Recording...</span>
//                         </div>
//                     )}

//                     {/* Voice control buttons */}
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

















// "use client"
// import React, { useEffect, useState, useCallback } from 'react'
// import { FaMicrophone, FaStop } from 'react-icons/fa';
// import Webcam from 'react-webcam'
// import Image from 'next/image'
// import { userAnswer as userAnswerSchema } from '../../../../../../utils/schema';
// import camimg from '../../../../../../public/images.jpg'
// import chatSession from '../../../../../../utils/gemini';
// import { db } from '../../../../../../utils/db';
// import { useUser } from '@clerk/nextjs';
// import moment from 'moment';
// import dynamic from 'next/dynamic';

// // Dynamically import the speech-to-text hook to avoid SSR issues
// const useSpeechToText = dynamic(
//     () => import('react-hook-speech-to-text').then(mod => mod.default),
//     { ssr: false }
// );

// const RecordAnswer = ({ questions, activeIndex, interviewData }) => {
//     const { user } = useUser()
//     const [userAnswer, setUserAnswer] = useState('')
//     const [isTyping, setIsTyping] = useState(false)
//     const [inputMode, setInputMode] = useState('voice') // 'voice' or 'text'
//     const [speechToTextLoaded, setSpeechToTextLoaded] = useState(false)

//     // Initialize speech-to-text hook conditionally
//     const speechToTextHook = useSpeechToText && typeof window !== 'undefined' ?
//         useSpeechToText({
//             continuous: true,
//             useLegacyResults: false
//         }) : {
//             error: null,
//             interimResult: '',
//             isRecording: false,
//             results: [],
//             startSpeechToText: () => { },
//             stopSpeechToText: () => { },
//             setResults: () => { },
//         };

//     const {
//         error,
//         interimResult,
//         isRecording,
//         results,
//         startSpeechToText,
//         stopSpeechToText,
//         setResults,
//     } = speechToTextHook;

//     // Check if speech-to-text is available
//     useEffect(() => {
//         if (typeof window !== 'undefined' && useSpeechToText) {
//             setSpeechToTextLoaded(true);
//         }
//     }, []);

//     // Validation function to check if we have required data
//     const validateInterviewData = useCallback(() => {
//         if (!interviewData) {
//             console.error("interviewData is missing");
//             return false;
//         }
//         if (!interviewData.mockId) {
//             console.error("mockId is missing from interviewData", interviewData);
//             return false;
//         }
//         return true;
//     }, [interviewData]);

//     const saveUserAnswer = async () => {
//         if (isRecording && speechToTextLoaded) {
//             stopSpeechToText();
//         }
//         await submitAnswer();
//     };

//     const submitAnswer = async () => {
//         const trimmedAnswer = userAnswer?.trim();
//         if (!trimmedAnswer || trimmedAnswer.split(' ').length < 3) {
//             alert('Your answer is too short, please try again.');
//             return;
//         }

//         // Validate interview data before proceeding
//         if (!validateInterviewData()) {
//             alert("Interview session not initialized properly. Missing mockId.");
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




//             // Add this code to your parent component (where you're calling RecordAnswer)
//             // This will help debug what data is being passed

//             const ParentComponentDebug = () => {
//                 // Your existing state and logic here...

//                 // Add this useEffect to debug your data
//                 useEffect(() => {
//                     console.log("=== PARENT COMPONENT DEBUG ===");
//                     console.log("mockInterviewQuestions:", mockInterviewQuestions);
//                     console.log("activeIndex:", activeIndex);
//                     console.log("interviewData:", interviewData);
//                     console.log("interviewData type:", typeof interviewData);

//                     if (interviewData) {
//                         console.log("interviewData keys:", Object.keys(interviewData));
//                         console.log("interviewData.mockId:", interviewData.mockId);
//                     }

//                     console.log("===============================");
//                 }, [mockInterviewQuestions, activeIndex, interviewData]);

//                 // Before rendering RecordAnswer, add this check:
//                 if (!interviewData) {
//                     return (
//                         <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//                             <h3 className="font-bold">Debug: InterviewData is undefined!</h3>
//                             <p>Check your data fetching or state management.</p>
//                             <details className="mt-2">
//                                 <summary>Debugging Info</summary>
//                                 <pre className="mt-2 bg-white p-2 rounded text-black">
//                                     {JSON.stringify({
//                                         mockInterviewQuestions: mockInterviewQuestions?.length || 'undefined',
//                                         activeIndex,
//                                         interviewData,
//                                     }, null, 2)}
//                                 </pre>
//                             </details>
//                         </div>
//                     );
//                 }

//                 return (
//                     <div>
//                         {/* Your other components */}

//                         <RecordAnswer
//                             questions={mockInterviewQuestions}
//                             activeIndex={activeIndex}
//                             interviewData={interviewData}
//                         />
//                     </div>
//                 );
//             };





//             // Double-check mockId before database insertion
//             if (!interviewData.mockId) {
//                 throw new Error("mockId is undefined at insertion time");
//             }

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
//             if (speechToTextLoaded && setResults) {
//                 setResults([]);
//             }
//             setInputMode('voice');
//             setIsTyping(false);

//         } catch (err) {
//             console.error("Error while saving answer:", err);
//             alert("Something went wrong while saving the answer. Check console for details.");
//         }
//     };

//     const handleStartRecording = () => {
//         if (!speechToTextLoaded) {
//             alert("Speech recognition is not available in this browser or still loading.");
//             return;
//         }
//         if (!isTyping && startSpeechToText) {
//             startSpeechToText();
//         }
//     };

//     const handleTextInputChange = (e) => {
//         const value = e.target.value;
//         setUserAnswer(value);
//         setIsTyping(value.length > 0);
//     };

//     const handleModeSwitch = (mode) => {
//         if (isRecording && speechToTextLoaded && stopSpeechToText) {
//             stopSpeechToText();
//         }
//         setInputMode(mode);
//         if (mode === 'voice') {
//             setIsTyping(false);
//         }
//     };

//     // Show loading message if speech-to-text is not yet loaded
//     if (inputMode === 'voice' && !speechToTextLoaded) {
//         return (
//             <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md max-w-md mx-auto space-y-4">
//                 <div className="text-center py-8">
//                     <p className="text-gray-600 dark:text-gray-400">Loading speech recognition...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Show error message if speech API is not available
//     if (error && inputMode === 'voice') {
//         return (
//             <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md max-w-md mx-auto space-y-4">
//                 <div className="text-center py-8">
//                     <p className="text-red-600">Web Speech API is not available in this browser 🤷‍</p>
//                     <button
//                         onClick={() => setInputMode('text')}
//                         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                     >
//                         Switch to Text Mode
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     useEffect(() => {
//         if (results && results.length > 0 && inputMode === 'voice' && !isTyping && speechToTextLoaded) {
//             const latestResult = results[results.length - 1];
//             if (latestResult && latestResult.transcript) {
//                 setUserAnswer(prevAns => prevAns + ' ' + latestResult.transcript);
//             }
//         }
//     }, [results, inputMode, isTyping, speechToTextLoaded]);

//     // Show warning if mockId is not available
//     const isMockIdAvailable = validateInterviewData();

//     return (
//         <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md max-w-md mx-auto space-y-4">
//             {/* Warning banner if mockId is missing */}
//             {!isMockIdAvailable && (
//                 <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//                     <p className="text-sm font-medium">⚠️ Interview session not properly initialized. MockId is missing.</p>
//                 </div>
//             )}

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
//                     className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${inputMode === 'voice'
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
//                         }`}
//                     disabled={!speechToTextLoaded}
//                 >
//                     🎤 Voice {!speechToTextLoaded && '(Loading...)'}
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

//             {/* Text Input Section - Only show when in text mode */}
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
//                         disabled={!userAnswer.trim() || !isMockIdAvailable}
//                         className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200"
//                     >
//                         Submit Answer
//                     </button>
//                 </div>
//             )}

//             {/* Voice Recording Section - Only show when in voice mode */}
//             {inputMode === 'voice' && speechToTextLoaded && (
//                 <>
//                     {/* Current answer display */}
//                     {userAnswer && (
//                         <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
//                             <p className="text-sm text-gray-700 dark:text-gray-300">
//                                 <strong>Your Answer:</strong> {userAnswer}
//                             </p>
//                         </div>
//                     )}

//                     {/* Recording status */}
//                     {isRecording && (
//                         <div className="flex items-center justify-center gap-2 mb-4 text-red-600">
//                             <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
//                             <span className="text-sm font-medium">Recording...</span>
//                         </div>
//                     )}

//                     {/* Voice control buttons */}
//                     <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//                         <button
//                             onClick={isRecording ? saveUserAnswer : handleStartRecording}
//                             disabled={!isMockIdAvailable || isTyping}
//                             className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
//                                 ${isRecording
//                                     ? 'bg-red-600 hover:bg-red-700 text-white'
//                                     : 'bg-blue-600 hover:bg-blue-700 text-white'}
//                                 ${isTyping ? 'bg-gray-400' : ''}
//                             `}
//                             title={isTyping ? "Cannot record while typing" : !isMockIdAvailable ? "Interview not properly initialized" : ""}
//                         >
//                             {isRecording ? <FaStop /> : <FaMicrophone />}
//                             {isRecording ? 'Stop & Submit' : 'Start Recording'}
//                         </button>

//                         {userAnswer && !isRecording && (
//                             <button
//                                 onClick={submitAnswer}
//                                 disabled={!isMockIdAvailable}
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
//                         console.log("=== DEBUG INFO ===");
//                         console.log("Current Answer:", userAnswer);
//                         console.log("Interview Data:", interviewData);
//                         console.log("MockId Available:", !!interviewData?.mockId);
//                         console.log("MockId Value:", interviewData?.mockId);
//                         console.log("Active Question:", questions[activeIndex]);
//                         console.log("Input Mode:", inputMode);
//                         console.log("Is Typing:", isTyping);
//                         console.log("Is Recording:", isRecording);
//                         console.log("Speech-to-Text Loaded:", speechToTextLoaded);
//                         console.log("User:", user);
//                         console.log("==================");
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




// Parent Component - Add this to your interview page component

"use client"
import { useState, useEffect } from 'react'
import RecordAnswer from './path/to/RecordAnswer' // Update with correct path

const InterviewPage = () => {
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const [interviewData, setInterviewData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Generate a unique mockId
    const generateMockId = () => {
        return `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    useEffect(() => {
        const initializeInterview = async () => {
            try {
                setLoading(true)

                // If you're fetching interview data from an API
                // const response = await fetch('/api/interview/data')
                // const data = await response.json()

                // For now, create mock data or ensure your data has mockId
                const data = {
                    mockId: generateMockId(), // Ensure mockId exists
                    // ... other properties from your interview data
                    // If you have existing data, merge it:
                    // ...existingInterviewData,
                    // mockId: existingInterviewData.mockId || generateMockId()
                }

                // Example questions - replace with your actual questions
                const questions = [
                    { question: "Tell me about yourself", answer: "Sample answer..." },
                    { question: "What are your strengths?", answer: "Sample answer..." },
                    // ... your actual questions
                ]

                setInterviewData(data)
                setMockInterviewQuestions(questions)

            } catch (err) {
                console.error("Error initializing interview:", err)
                setError("Failed to initialize interview")
            } finally {
                setLoading(false)
            }
        }

        initializeInterview()
    }, [])

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Initializing interview...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Interview Initialization Failed</h2>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    // Validation before rendering RecordAnswer
    if (!interviewData || !interviewData.mockId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-6 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Interview Data Missing</h2>
                    <p className="mb-4">Interview session could not be properly initialized.</p>
                    <details className="mt-4 text-left">
                        <summary className="cursor-pointer font-medium">Debug Info</summary>
                        <pre className="mt-2 p-2 bg-white rounded text-sm overflow-auto">
                            {JSON.stringify({
                                interviewData,
                                questionsLength: mockInterviewQuestions?.length,
                                activeIndex
                            }, null, 2)}
                        </pre>
                    </details>
                    <button
                        onClick={() => {
                            // Force regenerate mockId
                            setInterviewData(prev => ({
                                ...prev,
                                mockId: generateMockId()
                            }))
                        }}
                        className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                        Generate New Session
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Your existing interview UI components */}

            {/* Question display */}
            {mockInterviewQuestions.length > 0 && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">
                        Question {activeIndex + 1} of {mockInterviewQuestions.length}
                    </h2>
                    <p className="text-lg text-gray-700">
                        {mockInterviewQuestions[activeIndex]?.question}
                    </p>
                </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mb-6">
                <button
                    onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                    disabled={activeIndex === 0}
                    className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => setActiveIndex(Math.min(mockInterviewQuestions.length - 1, activeIndex + 1))}
                    disabled={activeIndex === mockInterviewQuestions.length - 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Record Answer Component - Only render when data is ready */}
            <RecordAnswer
                questions={mockInterviewQuestions}
                activeIndex={activeIndex}
                interviewData={interviewData}
            />

            {/* Debug panel */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-bold mb-2">Debug Information:</h3>
                <p><strong>MockId:</strong> {interviewData.mockId}</p>
                <p><strong>Questions:</strong> {mockInterviewQuestions.length}</p>
                <p><strong>Active Index:</strong> {activeIndex}</p>
                <p><strong>Current Question:</strong> {mockInterviewQuestions[activeIndex]?.question}</p>
            </div>
        </div>
    )
}

export default InterviewPage

// Alternative: If you're getting interviewData from props or context
const InterviewPageWithProps = ({ existingInterviewData }) => {
    const [interviewData, setInterviewData] = useState(null)

    useEffect(() => {
        // Ensure mockId exists in the data
        if (existingInterviewData) {
            setInterviewData({
                ...existingInterviewData,
                mockId: existingInterviewData.mockId || `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            })
        }
    }, [existingInterviewData])

    // ... rest of your component logic
}

// Alternative: If you're using URL parameters for mockId
const InterviewPageWithParams = () => {
    const [interviewData, setInterviewData] = useState(null)
    // If using Next.js router
    // const router = useRouter()
    // const { mockId } = router.query

    useEffect(() => {
        // Get mockId from URL params or generate new one
        const mockId = new URLSearchParams(window.location.search).get('mockId') ||
            `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        setInterviewData({
            mockId,
            // ... other interview data
        })
    }, [])

    // ... rest of your component logic
}





