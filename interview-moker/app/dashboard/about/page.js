import React from 'react';
import { FaBullseye, FaBrain, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import LocalButton from '../_components/Button/page';
import Link from 'next/link';
import Image from 'next/image';
import img1 from '../../../public/images (1).jpg'
import img2 from '../../../public/images (2).jpg'

const AboutUs = () => {
    const features = [

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
            name: 'Mshood Ali',

            image: img1,
            description: 'As the lead developer, Mashood is responsible for the complete development of the project — from designing robust backend systems to creating responsive and dynamic frontend interfaces. With a strong command of modern technologies, he ensures the project runs smoothly, efficiently, and meets all technical standards.'
        },
        {
            name: 'Saif Ali',

            image: img2,
            description: 'Focused on crafting clean and user-friendly designs, Saif Ali is the creative mind behind the project’s interface and user experience. Additionally, they manage the documentation, ensuring the concept, features, and workflow are clearly presented and well-documented.'
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-600/50 transition-colors duration-300">

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
                        <Link href="/dashboard" >

                            <LocalButton title="Start you'r Journy" />
                        </Link>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-8">


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

                    <div className="grid md:grid-cols-2 items-center gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative mb-6">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                                    />
                                    <div className="absolute inset-0 w-32 h-32 rounded-full mx-auto bg-gradient-to-r from-blue-600/20 to-purple-600/20 group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-all duration-300"></div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {member.name}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {member.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Ready to Ace Your Next Interview?
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Join thousands of successful candidates who have improved their interview skills with our AI-powered platform.
                    </p>
                    <Link href="/dashboard" >

                        <LocalButton title="Get Started Today" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;