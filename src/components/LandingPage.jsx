import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

const LandingPage = ({ onStart }) => {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-20">
            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:w-1/2 text-center lg:text-left z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-6 romantic-gradient bg-opacity-10 text-primary-red font-medium rounded-full">
                        <Sparkles size={18} className="text-primary-red" />
                        <span>Premium Digital Experience</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Create Your <span className="text-primary-red">Digital Valentine</span> Surprise
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0">
                        Design a luxury, romantic experience for your special person. Elegant animations, personal messages, and a beautiful proposal journey.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <button
                            onClick={onStart}
                            className="romantic-gradient px-8 py-4 rounded-full text-white text-lg font-semibold flex items-center gap-2 shadow-lg shadow-red-200"
                        >
                            Exotic Surprise Now
                            <ArrowRight size={20} />
                        </button>

                        <button className="glass-card px-8 py-4 rounded-full text-lg font-medium hover:bg-white hover:bg-opacity-50 transition-all">
                            See Example
                        </button>
                    </div>
                </motion.div>

                {/* Visual Element */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="lg:w-1/2 relative"
                >
                    <div className="relative z-10 w-full max-w-md mx-auto aspect-[3/4] glass-card p-6 rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-red-50 opacity-50 dark:from-red-900/20 dark:to-pink-900/20"></div>
                        <div className="relative h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-primary-pink/30 rounded-xl">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <Heart size={80} fill="#E63946" stroke="none" className="drop-shadow-xl" />
                            </motion.div>
                            <h3 className="text-2xl font-heading mt-6 mb-2">Our Love Story</h3>
                            <p className="text-gray-500 text-sm">Preview of your surprise</p>

                            <div className="mt-8 space-y-2 w-full">
                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-pink w-3/4"></div>
                                </div>
                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-pink w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative floating shapes */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 bg-radial-gradient from-pink-200/40 to-transparent blur-3xl rounded-full"></div>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
