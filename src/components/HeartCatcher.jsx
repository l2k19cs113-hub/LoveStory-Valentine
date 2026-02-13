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
            top: -40,
            speed: Math.random() * 2 + 2, // Slower for smaller area
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
                    if (!item.caught && item.top >= 260 && item.top <= 320) {
                        const distance = Math.abs(item.left - basketPosRef.current);
                        if (distance < 15) {
                            item.caught = true;
                            setScore((s) => s + 1);
                        }
                    }
                });
                return nextItems.filter((item) => item.top < 400 && !item.caught);
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
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-primary-red">Heart Catcher</h2>
                <p className="text-gray-500 text-sm">Catch {targetScore} hearts! ❤️</p>
            </div>

            <div
                ref={gameAreaRef}
                className="relative w-full h-[350px] bg-white/20 border-2 border-primary-pink/50 rounded-2xl overflow-hidden cursor-crosshair touch-none shadow-inner"
                onMouseMove={(e) => updatePosition(e.clientX)}
                onTouchMove={(e) => e.touches[0] && updatePosition(e.touches[0].clientX)}
            >
                <AnimatePresence>
                    {!gameActive && !gameOver && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/10 z-30"
                        >
                            <button
                                onClick={() => setGameActive(true)}
                                className="romantic-gradient px-8 py-2 rounded-full text-white font-bold shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-sm"
                            >
                                <Play size={18} fill="currentColor" />
                                START
                            </button>
                        </motion.div>
                    )}

                    {gameOver && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-30"
                        >
                            <Trophy size={60} className="text-yellow-500 mb-2" />
                            <h3 className="text-2xl font-bold text-primary-red">NICE!</h3>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute top-2 right-3 bg-white/50 px-3 py-1 rounded-full text-sm font-bold text-primary-red shadow-sm border border-primary-pink/30 z-10">
                    {score} / {targetScore}
                </div>

                {items.map((item) => (
                    <div
                        key={item.id}
                        className="absolute drop-shadow-sm"
                        style={{
                            left: `${item.left}%`,
                            top: `${item.top}px`,
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <Heart fill="#E63946" stroke="none" size={24} />
                    </div>
                ))}

                <div
                    className="absolute bottom-4 w-12 h-8 bg-primary-red rounded-b-xl border-2 border-white/50 shadow-md flex items-center justify-center"
                    style={{
                        left: `${displayBasketPos}%`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <Heart size={16} fill="white" stroke="none" className="animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default HeartCatcher;
