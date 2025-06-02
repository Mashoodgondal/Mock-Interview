import React from 'react';
import backimg from '../../public/images (1).jpg'
import Image from 'next/image';
import Link from 'next/link';
export default function AboutUsPage() {
    return (
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
    );
}
