// components/Footer.jsx
"use client";
import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-700 text-gray-200 py-8 shadow-inner rounded-lg">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

                <div>
                    <h2 className="text-xl font-semibold text-white">AI Interview Mocker</h2>
                    <p className="text-sm mt-2 text-gray-400">
                        Practice your skills, boost your confidence, and receive smart AI-powered feedback — all in one place.
                    </p>
                </div>


                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
                    <ul className="space-y-1 text-sm">
                        <li className="hover:underline">Home</li>

                        <li className="hover:underline">About</li>
                        <li className="hover:underline">How it work</li>
                    </ul>
                </div>


                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Connect</h3>
                    <div className="flex gap-4 text-xl">
                        <a href="https://github.com/mashoodgondal" target="_blank" className="hover:text-white"><FaGithub /></a>
                        <a href="https://linkedin.com" target="_blank" className="hover:text-white"><FaLinkedin /></a>

                    </div>
                </div>
            </div>

            <div className="text-center mt-6 text-sm text-gray-500">
                &copy; {new Date().getFullYear()} AI Interview Mocker. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
