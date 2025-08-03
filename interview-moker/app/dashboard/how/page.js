import React from 'react';
import { FaUser, FaComments, FaSave, FaChartBar, FaStar, FaArrowCircleRight, FaBrain, FaTarget, FaTrophy } from 'react-icons/fa';

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            title: "Share Your Expertise",
            description: "Tell us about your skills, experience level, and the role you're targeting. Our AI will understand your background to create personalized questions.",
            icon: FaUser,
            color: "from-blue-500 to-cyan-400",
            features: ["Skill Assessment", "Experience Level", "Target Role"]
        },
        {
            id: 2,
            title: "Get AI-Generated Questions",
            description: "Receive tailored interview questions based on your expertise. Questions range from technical skills to behavioral scenarios relevant to your field.",
            icon: FaBrain,
            color: "from-purple-500 to-pink-400",
            features: ["Technical Questions", "Behavioral Scenarios", "Industry-Specific"]
        },
        {
            id: 3,
            title: "Practice & Answer",
            description: "Answer questions in a realistic interview environment. Practice your responses and build confidence with our interactive interface.",
            icon: FaComments,
            color: "from-green-500 to-emerald-400",
            features: ["Real-time Practice", "Voice/Text Input", "Timed Responses"]
        },
        {
            id: 4,
            title: "Save Your Responses",
            description: "All your answers are automatically saved. Review your responses anytime and track your improvement over multiple practice sessions.",
            icon: FaSave,
            color: "from-orange-500 to-red-400",
            features: ["Auto-save", "Response History", "Progress Tracking"]
        },
        {
            id: 5,
            title: "Get AI Feedback",
            description: "Receive detailed feedback on your answers including content quality, communication skills, and areas for improvement.",
            icon: FaChartBar,
            color: "from-indigo-500 to-purple-400",
            features: ["Content Analysis", "Communication Tips", "Improvement Areas"]
        },
        {
            id: 6,
            title: "View Your Rating",
            description: "Get an overall interview performance rating with detailed breakdown. Track your progress and see how you improve over time.",
            icon: FaTrophy,
            color: "from-yellow-500 to-orange-400",
            features: ["Performance Score", "Detailed Breakdown", "Progress Metrics"]
        }
    ];

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                        <FaTarget className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Master your interview skills with our AI-powered platform. From personalized questions to detailed feedback,
                        we guide you through every step of your interview preparation journey.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="relative">
                    {/* Connection Lines for Desktop */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 dark:from-blue-800 dark:via-purple-800 dark:to-blue-800 transform -translate-y-1/2 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon;

                            return (
                                <div key={step.id} className="relative group">
                                    {/* Mobile Connection Line */}
                                    {index < steps.length - 1 && (
                                        <div className="lg:hidden absolute left-1/2 -bottom-4 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600 transform -translate-x-1/2 z-0"></div>
                                    )}

                                    {/* Step Card */}
                                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group-hover:border-gray-200 dark:group-hover:border-gray-600">
                                        {/* Step Number */}
                                        <div className="absolute -top-4 left-8 bg-gradient-to-r from-gray-800 to-gray-700 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                            {step.id}
                                        </div>

                                        {/* Icon */}
                                        <div className={`inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r ${step.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className="h-8 w-8 text-white" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                            {step.title}
                                        </h3>

                                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                            {step.description}
                                        </p>

                                        {/* Features */}
                                        <div className="space-y-2">
                                            {step.features.map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color} mr-3`}></div>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Arrow for larger screens */}
                                        {index < steps.length - 1 && index % 3 !== 2 && (
                                            <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                                                <FaArrowCircleRight className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-20">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 md:p-12">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Ready to Ace Your Interview?
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of professionals who have improved their interview skills with our AI-powered platform.
                        </p>
                        <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                            <FaStar className="h-5 w-5 mr-2" />
                            Start Your Practice Session
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;