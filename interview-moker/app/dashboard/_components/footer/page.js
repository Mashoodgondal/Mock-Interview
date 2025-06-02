// components/Footer.jsx
"use client";
import React from "react";
import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-200 py-8 mt-12 shadow-inner rounded-lg">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Branding */}
                <div>
                    <h2 className="text-xl font-semibold text-white">AI Interview Mocker</h2>
                    <p className="text-sm mt-2 text-gray-400">
                        Practice your skills, boost your confidence, and receive smart AI-powered feedback — all in one place.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
                    <ul className="space-y-1 text-sm">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/features" className="hover:underline">Features</a></li>
                        <li><a href="/about" className="hover:underline">About</a></li>
                        <li><a href="/contact" className="hover:underline">Contact</a></li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Connect</h3>
                    <div className="flex gap-4 text-xl">
                        <a href="https://github.com" target="_blank" className="hover:text-white"><FaGithub /></a>
                        <a href="https://linkedin.com" target="_blank" className="hover:text-white"><FaLinkedin /></a>
                        <a href="https://yourportfolio.com" target="_blank" className="hover:text-white"><FaGlobe /></a>
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
