
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
// // Import your custom hook
// import useSpeechToText from '../../../../_components/hook/useSpeech';

// // Toast function (works with both react-hot-toast and sonner)
// const showToast = {
//     success: (message) => {
//         if (typeof window !== 'undefined') {
//             // Try react-hot-toast first
//             try {
//                 const toast = require('react-hot-toast');
//                 toast.default.success(message);
//             } catch {
//                 // Fallback to sonner
//                 try {
//                     const { toast } = require('sonner');
//                     toast.success(message);
//                 } catch {
//                     // Fallback to console and alert
//                     console.log('✅ ' + message);
//                     alert(message);
//                 }
//             }
//         }
//     },
//     error: (message) => {
//         if (typeof window !== 'undefined') {
//             try {
//                 const toast = require('react-hot-toast');
//                 toast.default.error(message);
//             } catch {
//                 try {
//                     const { toast } = require('sonner');
//                     toast.error(message);
//                 } catch {
//                     console.error('❌ ' + message);
//                     alert(message);
//                 }
//             }
//         }
//     },
//     info: (message) => {
//         if (typeof window !== 'undefined') {
//             try {
//                 const toast = require('react-hot-toast');
//                 toast.default(message);
//             } catch {
//                 try {
//                     const { toast } = require('sonner');
//                     toast.info(message);
//                 } catch {
//                     console.info('ℹ️ ' + message);
//                 }
//             }
//         }
//     },
//     loading: (message) => {
//         if (typeof window !== 'undefined') {
//             try {
//                 const toast = require('react-hot-toast');
//                 return toast.default.loading(message);
//             } catch {
//                 try {
//                     const { toast } = require('sonner');
//                     return toast.loading(message);
//                 } catch {
//                     console.log('⏳ ' + message);
//                     return null;
//                 }
//             }
//         }
//     },
//     dismiss: (toastId) => {
//         if (typeof window !== 'undefined' && toastId) {
//             try {
//                 const toast = require('react-hot-toast');
//                 toast.default.dismiss(toastId);
//             } catch {
//                 try {
//                     const { toast } = require('sonner');
//                     toast.dismiss(toastId);
//                 } catch {
//                     // Do nothing
//                 }
//             }
//         }
//     }
// };

// const RecordAnswer = ({ questions, activeIndex, interviewData }) => {
//     const { user } = useUser()
//     const [userAnswer, setUserAnswer] = useState('')
//     const [isTyping, setIsTyping] = useState(false)
//     const [inputMode, setInputMode] = useState('voice')
//     const [isClient, setIsClient] = useState(false)
//     const [speechHookReady, setSpeechHookReady] = useState(false)

//     // Check if we're on client side
//     useEffect(() => {
//         setIsClient(true);
//         // Small delay to ensure the dynamic import is ready
//         setTimeout(() => setSpeechHookReady(true), 1000);
//     }, []);

//     // Check browser compatibility
//     const isSpeechSupported = isClient && typeof window !== 'undefined' &&
//         ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

//     // Use speech hook only on client side and when supported
//     const speechHookData = speechHookReady && isSpeechSupported ? useSpeechToText({
//         continuous: true,
//         useLegacyResults: false
//     }) : null;

//     const {
//         error,
//         interimResult,
//         isRecording,
//         results,
//         startSpeechToText,
//         stopSpeechToText,
//         setResults
//     } = speechHookData || {};

//     const saveUserAnswer = async () => {
//         if (isRecording && stopSpeechToText) {
//             stopSpeechToText();
//         }
//         await submitAnswer();
//     };

//     const submitAnswer = async () => {
//         const trimmedAnswer = userAnswer?.trim();
//         if (!trimmedAnswer || trimmedAnswer.split(' ').length < 3) {
//             showToast.error('Your answer is too short, please try again.');
//             return;
//         }

//         if (!interviewData || !interviewData.mockId) {
//             console.error("Missing interviewData or mockId");
//             showToast.error("Interview session not initialized properly.");
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
//             // Show loading toast
//             const loadingToast = showToast.loading('Submitting your answer...');

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
//                 showToast.dismiss(loadingToast);
//                 showToast.error("AI response was not valid JSON. Please try recording again.");
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

//             // Dismiss loading and show success
//             showToast.dismiss(loadingToast);
//             showToast.success('Answer submitted successfully ✅');

//             // Reset form
//             setUserAnswer('');
//             if (setResults) setResults([]);
//             setInputMode('voice');
//             setIsTyping(false);

//         } catch (err) {
//             console.error("Error while saving answer:", err);
//             showToast.error("Something went wrong while saving the answer. Check console for details.");
//         }
//     };

//     const handleStartRecording = () => {
//         if (!isTyping && startSpeechToText) {
//             if (setResults) setResults([]);
//             setUserAnswer('');
//             startSpeechToText();
//             showToast.success('Recording started! Speak now...');
//         }
//     };

//     const handleStopRecording = () => {
//         if (stopSpeechToText) {
//             stopSpeechToText();
//             showToast.info('Recording stopped');
//         }
//     };

//     const handleTextInputChange = (e) => {
//         const value = e.target.value;
//         setUserAnswer(value);
//         setIsTyping(value.length > 0);
//     };

//     const handleModeSwitch = (mode) => {
//         if (isRecording && stopSpeechToText) {
//             stopSpeechToText();
//         }
//         setInputMode(mode);
//         if (mode === 'voice') {
//             setIsTyping(false);
//         }
//         showToast.info(`Switched to ${mode} mode`);
//     };

//     // Update user answer when speech results change
//     useEffect(() => {
//         if (results && results.length > 0 && inputMode === 'voice' && !isTyping) {
//             const transcript = results.map(result => result.transcript).join(' ');
//             setUserAnswer(transcript);
//         }
//     }, [results, inputMode, isTyping]);

//     // Handle speech recognition errors
//     useEffect(() => {
//         if (error) {
//             console.error('Speech recognition error:', error);
//             showToast.error(`Speech recognition error: ${error}`);
//         }
//     }, [error]);

//     // Show loading state while initializing
//     if (!isClient) {
//         return (
//             <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md max-w-md mx-auto space-y-4">
//                 <div className="flex items-center justify-center p-8">
//                     <div className="text-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//                         <p>Loading interview interface...</p>
//                     </div>
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
//                     disabled={!isSpeechSupported || !speechHookReady}
//                     className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${inputMode === 'voice'
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
//                         } ${(!isSpeechSupported || !speechHookReady) ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                     🎤 Voice {!isSpeechSupported ? '(Not Supported)' : !speechHookReady ? '(Loading...)' : ''}
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

//             {/* Show message if speech is not supported and in voice mode */}
//             {!isSpeechSupported && inputMode === 'voice' && (
//                 <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg mb-4">
//                     <p className="text-sm text-yellow-700 dark:text-yellow-300">
//                         <strong>Speech recognition not supported in this browser.</strong>
//                         Please switch to text mode or use Chrome/Edge for voice recording.
//                     </p>
//                 </div>
//             )}

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
//             {inputMode === 'voice' && isSpeechSupported && speechHookReady && (
//                 <>
//                     {userAnswer && (
//                         <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
//                             <p className="text-sm text-gray-700 dark:text-gray-300">
//                                 <strong>Your Answer:</strong> {userAnswer}
//                             </p>
//                         </div>
//                     )}

//                     {/* Show interim results while recording */}
//                     {isRecording && interimResult && (
//                         <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg mb-4">
//                             <p className="text-sm text-blue-700 dark:text-blue-300">
//                                 <strong>Live transcript:</strong> {interimResult}
//                             </p>
//                         </div>
//                     )}

//                     {isRecording && (
//                         <div className="flex items-center justify-center gap-2 mb-4 text-red-600">
//                             <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
//                             <span className="text-sm font-medium">Recording... Speak clearly</span>
//                         </div>
//                     )}

//                     <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//                         {!isRecording ? (
//                             <button
//                                 onClick={handleStartRecording}
//                                 disabled={!interviewData?.mockId || isTyping}
//                                 className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
//                                 title={isTyping ? "Cannot record while typing" : ""}
//                             >
//                                 <FaMicrophone />
//                                 Start Recording
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={handleStopRecording}
//                                 className="w-full sm:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
//                             >
//                                 <FaStop />
//                                 Stop Recording
//                             </button>
//                         )}

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

//             {/* Loading message for voice mode */}
//             {inputMode === 'voice' && (!speechHookReady || !isSpeechSupported) && (
//                 <div className="text-center p-4">
//                     {!speechHookReady && isSpeechSupported && (
//                         <p className="text-gray-600 dark:text-gray-400">
//                             Loading speech recognition...
//                         </p>
//                     )}
//                 </div>
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
//                         console.log("Speech Recognition Supported:", isSpeechSupported);
//                         console.log("Speech Hook Ready:", speechHookReady);
//                         console.log("Speech Results:", results);
//                         console.log("Interim Result:", interimResult);
//                         console.log("Error:", error);
//                         console.log("Is Client:", isClient);
//                         showToast.info('Debug info logged to console');
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



"use client"
import React, { useEffect, useState, useRef } from 'react'
import { FaMicrophone, FaStop } from 'react-icons/fa';
import Webcam from 'react-webcam'
import Image from 'next/image'
import { userAnswer as userAnswerSchema } from '../../../../../../utils/schema';
import camimg from '../../../../../../public/images.jpg'
import chatSession from '../../../../../../utils/gemini';
import { db } from '../../../../../../utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

const RecordAnswer = ({ questions, activeIndex, interviewData, onNextQuestion }) => {
    const { user } = useUser()
    const [userAnswer, setUserAnswer] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [inputMode, setInputMode] = useState('voice')
    const [isClient, setIsClient] = useState(false)

    // Speech Recognition States
    const [isRecording, setIsRecording] = useState(false)
    const [speechSupported, setSpeechSupported] = useState(false)
    const [interimResult, setInterimResult] = useState('')
    const recognitionRef = useRef(null)
    const finalTranscriptRef = useRef('')

    // Toast functionality
    const showToast = (message, type = 'info') => {
        // Create toast element
        const toast = document.createElement('div')
        toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 translate-x-full`

        // Set background color based on type
        switch (type) {
            case 'success':
                toast.className += ' bg-green-500'
                toast.innerHTML = `✅ ${message}`
                break
            case 'error':
                toast.className += ' bg-red-500'
                toast.innerHTML = `❌ ${message}`
                break
            case 'info':
                toast.className += ' bg-blue-500'
                toast.innerHTML = `ℹ️ ${message}`
                break
            case 'loading':
                toast.className += ' bg-yellow-500'
                toast.innerHTML = `⏳ ${message}`
                break
            default:
                toast.className += ' bg-gray-500'
                toast.innerHTML = message
        }

        document.body.appendChild(toast)

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)'
        }, 100)

        // Animate out and remove
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)'
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast)
                }
            }, 300)
        }, 3000)

        return toast
    }

    // Initialize speech recognition
    useEffect(() => {
        setIsClient(true)

        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (SpeechRecognition) {
                setSpeechSupported(true)
                const recognition = new SpeechRecognition()

                recognition.continuous = true
                recognition.interimResults = true
                recognition.lang = 'en-US'

                recognition.onstart = () => {
                    console.log('Speech recognition started')
                    setIsRecording(true)
                }

                recognition.onresult = (event) => {
                    let interimTranscript = ''
                    let finalTranscript = finalTranscriptRef.current

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript + ' '
                        } else {
                            interimTranscript += transcript
                        }
                    }

                    finalTranscriptRef.current = finalTranscript
                    setInterimResult(interimTranscript)
                    setUserAnswer(finalTranscript + interimTranscript)
                }

                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error)
                    showToast(`Speech recognition error: ${event.error}`, 'error')
                    setIsRecording(false)
                }

                recognition.onend = () => {
                    console.log('Speech recognition ended')
                    setIsRecording(false)
                    setInterimResult('')
                }

                recognitionRef.current = recognition
            } else {
                setSpeechSupported(false)
                console.log('Speech recognition not supported')
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
    }, [])

    const startRecording = () => {
        if (!recognitionRef.current || !speechSupported) {
            showToast('Speech recognition not supported in this browser', 'error')
            return
        }

        try {
            finalTranscriptRef.current = ''
            setUserAnswer('')
            setInterimResult('')
            recognitionRef.current.start()
            showToast('Recording started! Speak now...', 'success')
        } catch (error) {
            console.error('Error starting recognition:', error)
            showToast('Error starting recording', 'error')
        }
    }

    const stopRecording = () => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop()
            showToast('Recording stopped', 'info')
        }
    }

    const saveUserAnswer = async () => {
        if (isRecording) {
            stopRecording()
            // Wait a bit for the final result
            await new Promise(resolve => setTimeout(resolve, 500))
        }
        await submitAnswer()
    }

    const submitAnswer = async () => {
        const trimmedAnswer = userAnswer?.trim()
        if (!trimmedAnswer || trimmedAnswer.split(' ').length < 3) {
            showToast('Your answer is too short, please try again.', 'error')
            return
        }

        if (!interviewData || !interviewData.mockId) {
            console.error("Missing interviewData or mockId")
            showToast("Interview session not initialized properly.", 'error')
            return
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
            `Example: {"rating": "4", "feedback": "Clear explanation with good examples. Consider adding more specific details to strengthen your points."}`

        try {
            // Show loading toast
            const loadingToast = showToast('Submitting your answer...', 'loading')

            const result = await chatSession.sendMessage(feedbackPrompt)
            const rawText = await result.response.text()

            console.log("Raw AI Response:", rawText)

            const cleaned = rawText
                .replace(/```json|```/g, '')
                .replace(/,\s*}/g, '}')
                .replace(/,\s*]/g, ']')
                .trim()

            let feedbackJSON
            try {
                feedbackJSON = JSON.parse(cleaned)
            } catch (err) {
                console.error("JSON Parse Error:", err)
                console.error("Problematic JSON:", cleaned)
                showToast("AI response was not valid JSON. Please try recording again.", 'error')
                return
            }

            console.log("Interview Mock ID:", interviewData.mockId)

            const resp = await db.insert(userAnswerSchema).values({
                mockIdRef: interviewData.mockId,
                question: questions[activeIndex]?.question || '',
                correctAnswer: questions[activeIndex]?.answer || '',
                userAns: userAnswer,
                feedback: feedbackJSON.feedback || '',
                rating: feedbackJSON.rating || '',
                userEmail: user?.primaryEmailAddress?.emailAddress || '',
                createdAt: moment().format('DD-MM-yyyy'),
            })

            console.log("Database insert response:", resp)

            // Show success message
            showToast('Answer saved successfully! ✅', 'success')

            // Reset form
            setUserAnswer('')
            finalTranscriptRef.current = ''
            setInterimResult('')
            setInputMode('voice')
            setIsTyping(false)

            // Move to next question after a short delay
            setTimeout(() => {
                if (activeIndex < questions.length - 1) {
                    showToast(`Moving to question ${activeIndex + 2}...`, 'info')
                    if (onNextQuestion) {
                        onNextQuestion()
                    }
                } else {
                    showToast('Interview completed! 🎉', 'success')
                }
            }, 1500)

        } catch (err) {
            console.error("Error while saving answer:", err)
            showToast("Something went wrong while saving the answer. Check console for details.", 'error')
        }
    }

    const handleTextInputChange = (e) => {
        const value = e.target.value
        setUserAnswer(value)
        setIsTyping(value.length > 0)
    }

    const handleModeSwitch = (mode) => {
        if (isRecording) {
            stopRecording()
        }
        setInputMode(mode)
        if (mode === 'voice') {
            setIsTyping(false)
        }
        showToast(`Switched to ${mode} mode`, 'info')
    }

    // Show loading state while initializing
    if (!isClient) {
        return (
            <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md max-w-md mx-auto space-y-4">
                <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p>Loading interview interface...</p>
                    </div>
                </div>
            </div>
        )
    }

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

            {/* Question Progress */}
            <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Question {activeIndex + 1} of {questions.length}</strong>
                </p>
            </div>

            {/* Input Mode Toggle */}
            <div className="flex justify-center gap-2 mb-4">
                <button
                    onClick={() => handleModeSwitch('voice')}
                    disabled={!speechSupported}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${inputMode === 'voice'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        } ${!speechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    🎤 Voice {!speechSupported ? '(Not Supported)' : ''}
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
            {!speechSupported && inputMode === 'voice' && (
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
            {inputMode === 'voice' && speechSupported && (
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
                                onClick={startRecording}
                                disabled={!interviewData?.mockId || isTyping}
                                className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                                title={isTyping ? "Cannot record while typing" : ""}
                            >
                                <FaMicrophone />
                                Start Recording
                            </button>
                        ) : (
                            <button
                                onClick={stopRecording}
                                className="w-full sm:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                            >
                                <FaStop />
                                Stop Recording
                            </button>
                        )}

                        {userAnswer && !isRecording && (
                            <button
                                onClick={saveUserAnswer}
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
                        console.log("Current Answer:", userAnswer)
                        console.log("Interview Data:", interviewData)
                        console.log("Active Question:", questions[activeIndex])
                        console.log("Input Mode:", inputMode)
                        console.log("Is Typing:", isTyping)
                        console.log("Is Recording:", isRecording)
                        console.log("Speech Recognition Supported:", speechSupported)
                        console.log("Interim Result:", interimResult)
                        console.log("Is Client:", isClient)
                        showToast('Debug info logged to console', 'info')
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