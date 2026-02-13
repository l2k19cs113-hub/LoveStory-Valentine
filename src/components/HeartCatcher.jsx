import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const HeartCatcher = ({ onComplete }) => {
    const [score, setScore] = useState(0);
    const [hearts, setHearts] = useState([]);
    const [basketPos, setBasketPos] = useState(250); // Center of 500px width
    const [gameOver, setGameOver] = useState(false);
    const containerRef = useRef(null);

    const targetScore = 10;

    useEffect(() => {
        if (score >= targetScore) {
            setTimeout(onComplete, 1000);
        }
    }, [score, onComplete]);

    useEffect(() => {
        if (gameOver || score >= targetScore) return;

        const interval = setInterval(() => {
            const newHeart = {
                id: Date.now(),
                x: Math.random() * (500 - 40), // 500 is container width, 40 is heart width
                y: -50,
            };
            setHearts(prev => [...prev, newHeart]);
        }, 1200);

        return () => clearInterval(interval);
    }, [gameOver, score]);

    useEffect(() => {
        const moveInterval = setInterval(() => {
            setHearts(prev =>
                prev.map(h => ({ ...h, y: h.y + 5 }))
                    .filter(h => {
                        // Check collision
                        if (h.y > 330 && h.y < 380 && h.x > basketPos - 40 && h.x < basketPos + 40) {
                            setScore(s => s + 1);
                            return false;
                        }
                        // Remove if out of bounds
                        return h.y < 450;
                    })
            );
        }, 30);

        return () => clearInterval(moveInterval);
    }, [basketPos]);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        setBasketPos(Math.max(40, Math.min(460, x)));
    };

    const handleTouchMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        setBasketPos(Math.max(40, Math.min(460, x)));
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-lg z-20">
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden backdrop-blur-sm border border-white/20 shadow-inner">
                <motion.div
                    className="h-full romantic-gradient shadow-[0_0_15px_rgba(230,57,70,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(score / targetScore) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 50 }}
                />
            </div>

            <div
                ref={containerRef}
                className="game-container glass-card cursor-none touch-none shadow-2xl relative border-white/30"
                style={{ height: '450px' }}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
            >
                <div className="absolute top-4 right-4 z-20 bg-white/40 py-2 px-4 rounded-full text-xs font-bold backdrop-blur-md border border-white/20 shadow-sm text-primary-red">
                    LOVE COLLECTED: {score}/{targetScore}
                </div>
                <AnimatePresence>
                    {hearts.map(heart => (
                        <div
                            key={heart.id}
                            className="falling-heart"
                            style={{ left: heart.x, top: heart.y }}
                        >
                            <Heart size={32} fill="#E63946" stroke="none" />
                        </div>
                    ))}
                </AnimatePresence>

                <div
                    className="basket"
                    style={{ left: basketPos - 40 }}
                >
                    <div className="text-white text-xs font-bold">LOVE</div>
                </div>
            </div>

            <p className="text-sm text-gray-400">Move mouse or touch to catch hearts</p>
        </div>
    );
};

export default HeartCatcher;
