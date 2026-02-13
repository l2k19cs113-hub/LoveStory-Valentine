import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Share2, Volume2, VolumeX, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const LovePage = ({ data, onBack }) => {
    const [showProposal, setShowProposal] = useState(false);
    const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
    const [accepted, setAccepted] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [displayText, setDisplayText] = useState('');
    const [copied, setCopied] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // Global click listener to unlock audio (browser requirement)
        const unlockAudio = () => {
            if (audioRef.current && isMuted) {
                // We keep it muted by default but prepare the element
                // Or better: if user clicks anything, we try to play
                setIsMuted(false);
                document.removeEventListener('click', unlockAudio);
            }
        };
        document.addEventListener('click', unlockAudio);
        return () => document.removeEventListener('click', unlockAudio);
    }, [isMuted]);

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

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.4;
            if (!isMuted) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Playback failed:", error);
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isMuted]);

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
        const shareData = {
            title: 'LoveStory - Digital Valentine Surprise',
            text: `Hey! Check out this special surprise from ${data.yourName} to ${data.partnerName}! 💖`,
            url: window.location.href
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                throw new Error('Web Share API not fully supported');
            }
        } catch (err) {
            console.log('Share failed, using clipboard fallback');
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className={`min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 ${data.theme === 'midnight' ? 'dark-theme' : ''}`}>

            {/* Audio Element */}
            <audio
                ref={audioRef}
                src="https://archive.org/download/96moviebgm/Kadhale%20Kadhale.mp3"
                loop
            />

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

                            <div className="mt-10 space-y-4">
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <button
                                        onClick={handleShare}
                                        className="flex items-center gap-2 px-6 py-4 romantic-gradient text-white rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95"
                                    >
                                        <Share2 size={20} />
                                        Share Surprise
                                    </button>

                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center gap-2 px-6 py-4 glass-card text-primary-red rounded-xl font-bold hover:bg-white/60 active:scale-95"
                                    >
                                        {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                        {copied ? 'Link Copied!' : 'Copy Link'}
                                    </button>
                                </div>

                                <button
                                    onClick={() => window.location.href = window.location.origin + window.location.pathname}
                                    className="text-gray-500 hover:text-primary-red transition-colors font-medium underline underline-offset-4"
                                >
                                    Create Another One
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
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-4 glass-card bg-white/50 text-gray-600 shadow-lg"
                >
                    <Music size={24} />
                </button>
            </div>

        </div>
    );
};

export default LovePage;
