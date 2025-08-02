import React from 'react';
import { FaBullseye, FaBrain, FaChartLine, FaShieldAlt } from 'react-icons/fa';

const AboutUs = () => {
    const features = [
        {
            icon: FaBrain,
            title: 'AI-Powered Intelligence',
            description: 'Our advanced AI technology simulates real interview scenarios with industry-specific questions and adaptive difficulty levels.'
        },
        {
            icon: FaBullseye,
            title: 'Personalized Feedback',
            description: 'Receive detailed analysis of your performance, including strengths, areas for improvement, and actionable recommendations.'
        },
        {
            icon: FaShieldAlt,
            title: 'Secure & Private',
            description: 'Your interview sessions and personal data are protected with enterprise-grade security and complete privacy.'
        },
        {
            icon: FaChartLine,
            title: 'Career Growth',
            description: 'Track your progress over time and see measurable improvements in your interview skills and confidence.'
        }
    ];

    const teamMembers = [
        {
            name: 'Sarah Chen',
            role: 'CEO & Co-Founder',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c4?w=400&h=400&fit=crop&crop=face',
            description: 'Former Google recruiter with 10+ years in talent acquisition and AI development.'
        },
        {
            name: 'Michael Rodriguez',
            role: 'CTO & Co-Founder',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            description: 'AI researcher and engineer specializing in natural language processing and machine learning.'
        },
        {
            name: 'Emily Johnson',
            role: 'Head of Product',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
            description: 'Product strategist focused on creating intuitive user experiences for career development.'
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-600/50 transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-600/50 dark:to-gray-600/60">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
                <div className="relative max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                            Revolutionizing
                        </span>
                        <br />
                        <span className="text-gray-900 dark:text-white">Interview Preparation</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                        Empowering job seekers worldwide with AI-driven mock interviews that simulate real-world scenarios
                        and provide actionable feedback to boost your confidence and career prospects.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                            Start Your Journey
                        </button>
                        <button className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                            Watch Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Our Mission
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            We believe everyone deserves the opportunity to succeed in their career journey.
                            Our AI-powered platform democratizes access to high-quality interview preparation.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Meet Our Team
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Our diverse team of experts combines decades of experience in AI, recruitment,
                            and career development to create the best interview preparation experience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative mb-6">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                                    />
                                    <div className="absolute inset-0 w-32 h-32 rounded-full mx-auto bg-gradient-to-r from-blue-600/20 to-purple-600/20 group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-all duration-300"></div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {member.name}
                                </h3>
                                <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                                    {member.role}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {member.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Ready to Ace Your Next Interview?
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Join thousands of successful candidates who have improved their interview skills with our AI-powered platform.
                    </p>
                    <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                        Get Started Today
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;