import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, Play } from 'lucide-react';

const HeartCatcher = ({ onComplete }) => {
    const [score, setScore] = useState(0);
    const [items, setItems] = useState([]);
    const [gameActive, setGameActive] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const basketPosRef = useRef(50);
    const [displayBasketPos, setDisplayBasketPos] = useState(50);
    const targetScore = 15;
    const gameAreaRef = useRef(null);

    // Helper to spawn items
    const spawnItem = useCallback(() => {
        const newItem = {
            id: Math.random(),
            left: Math.random() * 80 + 10,
            top: -50,
            speed: Math.random() * 3 + 3,
            caught: false
        };
        setItems((prev) => [...prev, newItem]);
    }, []);

    // Spawn interval
    useEffect(() => {
        if (!gameActive) return;
        const interval = setInterval(spawnItem, 700);
        return () => clearInterval(interval);
    }, [gameActive, spawnItem]);

    // Main Game Loop using requestAnimationFrame
    useEffect(() => {
        if (!gameActive) return;

        let animationFrameId;

        const update = () => {
            setItems((prev) => {
                const nextItems = prev.map((item) => ({
                    ...item,
                    top: item.top + item.speed
                }));

                // Catch logic
                nextItems.forEach((item) => {
                    if (!item.caught && item.top >= 330 && item.top <= 380) {
                        const distance = Math.abs(item.left - basketPosRef.current);
                        if (distance < 15) {
                            item.caught = true;
                            setScore((s) => s + 1);
                        }
                    }
                });

                return nextItems.filter((item) => item.top < 450 && !item.caught);
            });

            animationFrameId = requestAnimationFrame(update);
        };

        animationFrameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrameId);
    }, [gameActive]);

    // Check victory
    useEffect(() => {
        if (score >= targetScore) {
            setGameActive(false);
            setGameOver(true);
            setTimeout(onComplete, 1500);
        }
    }, [score, onComplete]);

    const updatePosition = (clientX) => {
        if (!gameAreaRef.current) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const clampedY = Math.min(Math.max(x, 10), 90);
        basketPosRef.current = clampedY;
        setDisplayBasketPos(clampedY);
    };

    const handleMouseMove = (e) => updatePosition(e.clientX);

    const handleTouchMove = (e) => {
        if (e.touches[0]) {
            updatePosition(e.touches[0].clientX);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-heading text-primary-red">Heart Catcher</h2>
                <p className="text-gray-600 dark:text-gray-300">Move your cursor to catch the hearts!</p>
                <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="bg-primary-red/10 px-6 py-2 rounded-full border border-primary-red/30">
                        <span className="text-2xl font-bold text-primary-red">{score} / {targetScore}</span>
                    </div>
                </div>
            </div>

            <div
                ref={gameAreaRef}
                className="relative w-full max-w-[500px] h-[400px] glass-card bg-white/30 dark:bg-black/20 overflow-hidden touch-none cursor-none"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
            >
                <AnimatePresence>
                    {!gameActive && !gameOver && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 z-30"
                        >
                            <button
                                onClick={() => setGameActive(true)}
                                className="romantic-gradient px-10 py-4 rounded-full text-white text-xl font-bold shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform"
                            >
                                <Play size={24} fill="currentColor" />
                                START CHALLENGE
                            </button>
                        </motion.div>
                    )}

                    {gameOver && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-black/90 z-30"
                        >
                            <Trophy size={80} className="text-yellow-500 mb-4" />
                            <h3 className="text-3xl font-bold text-primary-red neon-text">CHALLENGE COMPLETE!</h3>
                            <p className="text-gray-600 mt-2">Opening the secret message...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Falling Hearts */}
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="absolute transition-transform duration-100"
                        style={{
                            left: `${item.left}%`,
                            top: `${item.top}px`,
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <Heart fill="#E63946" stroke="none" size={32} className="drop-shadow-md" />
                    </div>
                ))}

                {/* Catcher (Basket) */}
                <div
                    className="absolute bottom-6 w-24 h-16 flex items-center justify-center pointer-events-none transition-all duration-75"
                    style={{
                        left: `${displayBasketPos}%`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div className="relative w-20 h-12 bg-primary-red/90 rounded-b-2xl border-2 border-white/50 shadow-xl flex items-center justify-center">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary-red rounded-full opacity-50 blur-[2px]"></div>
                        <Heart size={24} fill="white" stroke="none" className="animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeartCatcher;
