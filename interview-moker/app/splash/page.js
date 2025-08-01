
"use client"
import { useState } from "react";
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import Link from "next/link";
import Image from "next/image";
import backimg from '../../public/images (1).jpg'

const SplashPage = () => {
    const { user } = useUser();
    const [expanded, setExpanded] = useState(false);
    return (
        <div className=" relative overflow-hidden min-h-screen bg-black">


            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop={true}
                    playsInline
                    className="w-full h-full object-cover scale-110 opacity-50"
                >
                    <source src="https://videos.pexels.com/video-files/5442623/5442623-sd_640_360_25fps.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
            </div>


            <div className="relative z-10">



                <header className="py-4 bg-transparent sm:py-6">
                    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">

                            <div className="shrink-0">
                                <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent tracking-wide">
                                    Skill<span className="text-white">Verge</span>
                                </h2>
                            </div>


                            <div className="md:hidden">
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    type="button"
                                    className="text-white"
                                >
                                    {!expanded ? (
                                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    ) : (
                                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </button>
                            </div>


                            <div className="hidden md:flex md:items-center md:space-x-4">
                                {user ? (
                                    <UserButton afterSignOutUrl="/" />
                                ) : (
                                    <>
                                        <SignInButton>
                                            <button className="px-4 py-2 text-sm font-medium text-white border border-gray-600 rounded-full hover:bg-white hover:text-black transition">
                                                Sign In
                                            </button>
                                        </SignInButton>
                                        <SignUpButton>
                                            <button className="px-4 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-gray-200 transition">
                                                Sign Up
                                            </button>
                                        </SignUpButton>
                                    </>
                                )}
                            </div>
                        </div>

                        {expanded && (
                            <div className="flex flex-col pt-6 space-y-4 md:hidden">
                                {user ? (
                                    <UserButton afterSignOutUrl="/" />
                                ) : (
                                    <>
                                        <SignInButton>
                                            <button className="px-4 py-2 text-sm font-medium text-white border border-gray-600 rounded-full hover:bg-white hover:text-black transition">
                                                Sign In
                                            </button>
                                        </SignInButton>
                                        <SignUpButton>
                                            <button className="px-4 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-gray-200 transition">
                                                Sign Up
                                            </button>
                                        </SignUpButton>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </header>


                <section className="min-h-[80vh] flex items-center justify-center py-12 sm:pb-16 lg:pb-20 xl:pb-24 text-center">
                    <div className="px-4 max-w-4xl">
                        <p className="text-sm font-normal tracking-widest text-gray-300 uppercase">
                            Your Personal AI Interview Coach
                        </p>
                        <h1 className="mt-6 text-4xl font-normal text-white sm:mt-10 sm:text-5xl lg:text-6xl xl:text-8xl">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
                                Ace Every Interview
                            </span>{" "}
                            with Confidence
                        </h1>
                        <p className="max-w-xl mx-auto mt-4 text-xl font-normal text-gray-400 sm:mt-8">
                            Get real-time interview practice powered by AI. From behavioral questions to technical challenges — sharpen your skills, get instant feedback, and walk into interviews fully prepared.
                        </p>

                        <div className="relative inline-flex items-center justify-center mt-8 sm:mt-12 group">
                            <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
                            <Link
                                href="/dashboard"
                                className="relative inline-flex items-center justify-center px-8 py-3 text-base font-normal text-white bg-black border border-transparent rounded-full"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </section>

            </div>

            <section className="relative bg-black min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">

                <div className="absolute inset-0 z-0">
                    <Image
                        src={backimg}

                        alt="About background"
                        className="w-full h-full object-cover opacity-70"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
                </div>


                <div className="relative z-10 text-center max-w-4xl text-white">
                    <p className="text-sm tracking-widest uppercase text-gray-300">
                        Learn About Our Mission
                    </p>
                    <h1 className="mt-6 text-4xl font-normal sm:text-5xl lg:text-6xl xl:text-7xl">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
                            Empowering Interviewees
                        </span>{" "}
                        Through AI
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl font-light text-gray-300">
                        SkillVerge is built for job seekers, students, and professionals who want to excel in interviews. Our platform uses state-of-the-art AI to simulate real-world interview environments, offer personalized feedback, and help you grow with confidence.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
                        <div className="bg-black/60 backdrop-blur rounded-2xl p-6 sm:w-80 border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/40">
                            <h3 className="text-xl font-semibold text-cyan-400">Real-Time Practice</h3>
                            <p className="mt-2 text-gray-400 text-sm">
                                Get unlimited mock interviews tailored to your domain with dynamic AI responses.
                            </p>
                        </div>

                        <div className="bg-black/60 backdrop-blur rounded-2xl p-6 sm:w-80 border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/40">
                            <h3 className="text-xl font-semibold text-purple-400">AI-Powered Feedback</h3>
                            <p className="mt-2 text-gray-400 text-sm">
                                Receive instant and intelligent feedback on your communication, answers, and posture.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <Link
                            href="/dashboard"
                            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-cyan-500/60 transition"
                        >
                            Start Your Journey
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    )
}
export default SplashPage