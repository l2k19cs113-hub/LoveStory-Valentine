import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Play, Heart, ArrowRight } from 'lucide-react';

const SharePage = ({ url, data, onPreview }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: 'LoveStory - A Special Surprise for You!',
            text: `Hey ${data.partnerName}! I've created a special digital surprise for you. 💖`,
            url: url
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                copyToClipboard();
            }
        } catch (err) {
            console.log('Share failed', err);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-pink/10 blur-3xl rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-red/5 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full glass-card p-10 md:p-14 text-center relative"
            >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-xl border-4 border-primary-pink/20">
                    <Heart size={48} fill="#E63946" stroke="none" className="animate-bounce" />
                </div>

                <h2 className="text-4xl font-bold mt-4 mb-2">It's Ready!</h2>
                <p className="text-gray-500 mb-10">Your digital surprise for {data.partnerName} has been created with love.</p>

                <div className="space-y-6">
                    <div className="p-4 bg-white/30 rounded-2xl border-2 border-dashed border-primary-pink/30 flex items-center justify-between gap-4 overflow-hidden">
                        <span className="text-sm text-gray-400 truncate text-left">{url}</span>
                        <button
                            onClick={copyToClipboard}
                            className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors shrink-0"
                        >
                            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} className="text-primary-red" />}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center gap-2 px-8 py-4 romantic-gradient text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:scale-105 active:scale-95 transition-all text-lg"
                        >
                            <Share2 size={24} />
                            Share Now
                        </button>

                        <button
                            onClick={onPreview}
                            className="flex items-center justify-center gap-2 px-8 py-4 glass-card bg-white/60 text-primary-red rounded-2xl font-bold border-2 border-primary-pink/10 hover:bg-white hover:scale-105 active:scale-95 transition-all text-lg"
                        >
                            <Play size={24} />
                            Preview
                        </button>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center gap-2 text-gray-400 text-sm">
                    <ArrowRight size={16} />
                    <span>Partner will play the game first!</span>
                </div>
            </motion.div>
        </div>
    );
};

export default SharePage;
