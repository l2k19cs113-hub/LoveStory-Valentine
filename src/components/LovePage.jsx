import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Share2, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

const LovePage = ({ data, onBack }) => {
    const [showProposal, setShowProposal] = useState(false);
    const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
    const [accepted, setAccepted] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        // Typewriter effect
        let i = 0;
        const interval = setInterval(() => {
            setDisplayText(data.message.slice(0, i));
            i++;
            if (i > data.message.length) {
                clearInterval(interval);
                setTimeout(() => setShowProposal(true), 1500);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [data.message]);

    const handleNoHover = () => {
        const newX = Math.random() * 200 - 100;
        const newY = Math.random() * 200 - 100;
        setNoButtonPos({ x: newX, y: newY });
    };

    const handleYes = () => {
        setAccepted(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#E63946', '#FF8FAB', '#FFB3C1']
        });
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'LoveStory - Digital Valentine Surprise',
                    text: `Check out this surprise from ${data.yourName}!`,
                    url: window.location.href
                });
            } else {
                throw new Error('Web Share API not supported');
            }
        } catch (err) {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className={`min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 ${data.theme === 'midnight' ? 'dark-theme' : ''}`}>

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-pink/10 blur-3xl rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-red/5 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container max-w-3xl mx-auto z-10 text-center">
                {/* Intro */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <span className="text-font-accent text-primary-red text-4xl block mb-4">Dearest {data.partnerName}</span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-8">A Special Surprise for You</h1>
                </motion.div>

                {/* Message Card */}
                <motion.div
                    className="glass-card p-10 md:p-16 mb-12 relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="absolute -top-6 -left-6 transform -rotate-12">
                        <Heart fill="#E63946" stroke="none" size={48} className="drop-shadow-lg" />
                    </div>

                    <p className="text-xl md:text-2xl leading-relaxed italic text-gray-700 dark:text-gray-200 min-h-[100px]">
                        "{displayText}"
                        <span className="animate-pulse">|</span>
                    </p>

                    <div className="mt-12 pt-8 border-t border-gray-100/20 italic text-gray-500">
                        With love, {data.yourName}
                    </div>
                </motion.div>

                {/* Proposal Section */}
                <AnimatePresence>
                    {showProposal && !accepted && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <h2 className="text-3xl md:text-5xl font-heading text-primary-red">{data.proposalText}</h2>

                            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 relative py-20">
                                <button
                                    onClick={handleYes}
                                    className="px-12 py-4 romantic-gradient text-white text-xl font-bold rounded-full shadow-xl shadow-red-200 hover:scale-110 active:scale-95 z-20"
                                >
                                    YES! ❤️
                                </button>

                                <motion.button
                                    animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                                    onMouseEnter={handleNoHover}
                                    className="px-8 py-4 bg-gray-200 text-gray-600 text-lg font-medium rounded-full z-10"
                                >
                                    No
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {accepted && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-12 bg-white/40 border-primary-pink"
                        >
                            <Heart fill="#E63946" stroke="none" size={80} className="mx-auto mb-6" />
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">Yay! Best Day Ever! 💖</h2>
                            <p className="text-xl text-gray-600">You've made {data.yourName} the happiest person!</p>

                            <div className="flex gap-4 justify-center mt-10">
                                <button
                                    onClick={handleShare}
                                    className="p-4 glass-card text-primary-red hover:bg-white transition-colors"
                                    title="Share Surprise"
                                >
                                    <Share2 size={24} />
                                </button>
                                <button
                                    onClick={onBack}
                                    className="px-8 py-3 rounded-xl border border-primary-pink text-primary-red font-semibold"
                                >
                                    Create Another
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Controls */}
            <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-4 glass-card bg-white/50 text-primary-red shadow-lg"
                >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <button className="p-4 glass-card bg-white/50 text-gray-600 shadow-lg">
                    <Music size={24} />
                </button>
            </div>
        </div>
    );
};

export default LovePage;
