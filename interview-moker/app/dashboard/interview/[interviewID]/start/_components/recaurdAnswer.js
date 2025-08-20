
"use client"
import React, { useEffect, useState, useRef } from 'react'
import { FaMicrophone, FaStop } from 'react-icons/fa';
import Webcam from 'react-webcam'
import Image from 'next/image'
import toast from 'react-hot-toast'; // Add this import
import { userAnswer as userAnswerSchema } from '../../../../../../utils/schema';
import camimg from '../../../../../../public/images.jpg'
import chatSession from '../../../../../../utils/gemini';
import { db } from '../../../../../../utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';

const RecordAnswer = ({ questions, activeIndex, interviewData, onNextQuestion }) => {
    const { user } = useUser()
    const [userAnswer, setUserAnswer] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [inputMode, setInputMode] = useState('voice')
    const [isClient, setIsClient] = useState(false)
    const params = useParams()
    const router = useRouter()
    const mockId = params?.interviewID
    // Speech Recognition States
    const [isRecording, setIsRecording] = useState(false)
    const [speechSupported, setSpeechSupported] = useState(false)
    const [interimResult, setInterimResult] = useState('')
    const recognitionRef = useRef(null)
    const finalTranscriptRef = useRef('')

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
                    toast.error(`Speech recognition error: ${event.error}`)
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
    const GotoResult = () => {
        router.push('/dashboard/interview/' + mockId + '/feedback')
    }
    const startRecording = () => {
        if (!recognitionRef.current || !speechSupported) {
            toast.error('Speech recognition not supported in this browser')
            return
        }

        try {
            finalTranscriptRef.current = ''
            setUserAnswer('')
            setInterimResult('')
            recognitionRef.current.start()
            toast.success('Recording started! Speak now...')
        } catch (error) {
            console.error('Error starting recognition:', error)
            toast.error('Error starting recording')
        }
    }

    const stopRecording = () => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop()
            toast('Recording stopped', { icon: 'ℹ️' })
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
            toast.error('Your answer is too short, please try again.')
            return
        }

        if (!interviewData || !interviewData.mockId) {
            console.error("Missing interviewData or mockId")
            toast.error("Interview session not initialized properly.")
            return
        }

        const feedbackPrompt =
            `You are a supportive interview coach. Evaluate the user's answer based on communication skills, not correctness.\n` +
            `Focus on: clarity, structure, confidence, and relevance to the question asked.\n\n` +
            `Question: ${questions[activeIndex]?.question}\n` +
            `User Answer: ${userAnswer}\n\n` +
            `Guidelines:\n` +
            `- Rate from 1 to 10 (1 = poor, 10 = excellent)\n` +
            `- Be encouraging but honest\n` +
            `- Keep feedback under 25 words\n` +
            `- Start with something positive\n` +
            `- Include one specific improvement suggestion if needed\n` +
            `- Do not focus on factual correctness; judge delivery and communication\n\n` +
            `Return JSON: {"rating": "1-10", "feedback": "brief positive feedback with one improvement tip"}\n` +
            `Example: {"rating": "7", "feedback": "Good structure and tone. Work on being more concise in your responses."}`;

        try {
            // Show loading toast
            const loadingToastId = toast.loading('Submitting your answer...')

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
                toast.dismiss(loadingToastId)
                toast.error("AI response was not valid JSON. Please try recording again.")
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

            // Dismiss loading toast and show success
            toast.dismiss(loadingToastId)
            toast.success('Answer saved successfully! ✅')

            // Reset form
            setUserAnswer('')
            finalTranscriptRef.current = ''
            setInterimResult('')
            setInputMode('voice')
            setIsTyping(false)

            // Move to next question after a short delay
            setTimeout(() => {
                if (activeIndex < questions.length - 1) {
                    toast(`Moving to question ${activeIndex + 2}...`, { icon: 'ℹ️' })
                    if (onNextQuestion) {
                        onNextQuestion()
                    }
                } else {
                    toast.success('Interview completed! 🎉')
                }
            }, 1500)

        } catch (err) {
            console.error("Error while saving answer:", err)
            toast.error("Something went wrong while saving the answer. Check console for details.")
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
        toast(`Switched to ${mode} mode`, { icon: 'ℹ️' })
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
                    Voice {!speechSupported ? '(Not Supported)' : ''}
                </button>
                <button
                    onClick={() => handleModeSwitch('text')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${inputMode === 'text'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                >
                    Type
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
                                className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
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

            <div className="flex justify-center">
                <button
                    onClick={GotoResult}
                    className="px-30 py-2  rounded-lg font-semibold 
             text-white bg-gradient-to-r from-indigo-500 to-purple-500 
             hover:from-purple-500 hover:to-indigo-500 
             hover:shadow-lg hover:scale-105 
             transition-all duration-300 ease-in-out 
             dark:from-indigo-400 dark:to-purple-600 
             dark:hover:from-purple-600 dark:hover:to-indigo-400"
                >
                    Check Results
                </button>
            </div>

        </div>
    )
}

export default RecordAnswer