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

    const spawnItem = useCallback(() => {
        const newItem = {
            id: Math.random(),
            left: Math.random() * 85 + 7.5,
            top: -50,
            speed: Math.random() * 2 + 3, // Slightly slower for better gameplay
            caught: false
        };
        setItems((prev) => [...prev, newItem]);
    }, []);

    useEffect(() => {
        if (!gameActive) return;
        const interval = setInterval(spawnItem, 800);
        return () => clearInterval(interval);
    }, [gameActive, spawnItem]);

    useEffect(() => {
        if (!gameActive) return;
        let animationFrameId;
        const update = () => {
            setItems((prev) => {
                const nextItems = prev.map((item) => ({ ...item, top: item.top + item.speed }));
                nextItems.forEach((item) => {
                    if (!item.caught && item.top >= 310 && item.top <= 370) {
                        const distance = Math.abs(item.left - basketPosRef.current);
                        if (distance < 12) {
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
        const clampedX = Math.min(Math.max(x, 10), 90);
        basketPosRef.current = clampedX;
        setDisplayBasketPos(clampedX);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-heading text-primary-red">Heart Catcher</h2>
                <p className="text-gray-600 dark:text-gray-300">Catch the hearts to reveal the secret! ❤️</p>
                <div className="inline-block bg-primary-red/10 px-6 py-2 rounded-full border border-primary-red/30 mt-2">
                    <span className="text-2xl font-bold text-primary-red">{score} / {targetScore}</span>
                </div>
            </div>

            <div
                ref={gameAreaRef}
                className="game-container bg-white/40 backdrop-blur-md cursor-crosshair touch-none"
                onMouseMove={(e) => updatePosition(e.clientX)}
                onTouchMove={(e) => e.touches[0] && updatePosition(e.touches[0].clientX)}
            >
                <AnimatePresence>
                    {!gameActive && !gameOver && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 z-30"
                        >
                            <button
                                onClick={() => setGameActive(true)}
                                className="romantic-gradient px-12 py-4 rounded-full text-white text-xl font-bold shadow-xl flex items-center gap-2 hover:scale-110 active:scale-95 transition-all"
                            >
                                <Play size={24} fill="currentColor" />
                                START GAME
                            </button>
                        </motion.div>
                    )}

                    {gameOver && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-30"
                        >
                            <Trophy size={80} className="text-yellow-500 mb-4" />
                            <h3 className="text-3xl font-bold text-primary-red">CHALLENGE COMPLETE!</h3>
                        </motion.div>
                    )}
                </AnimatePresence>

                {items.map((item) => (
                    <div
                        key={item.id}
                        className="falling-heart"
                        style={{
                            left: `${item.left}%`,
                            top: `${item.top}px`,
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <Heart fill="#E63946" stroke="none" size={32} />
                    </div>
                ))}

                <div
                    className="basket"
                    style={{
                        left: `${displayBasketPos}%`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <Heart size={24} fill="white" stroke="none" className="animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default HeartCatcher;
