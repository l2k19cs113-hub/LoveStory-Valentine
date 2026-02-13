import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trophy } from 'lucide-react';

const HeartCatcher = ({ onComplete }) => {
    const [score, setScore] = useState(0);
    const [basketPos, setBasketPos] = useState(50);
    const [items, setItems] = useState([]);
    const [gameActive, setGameActive] = useState(false);
    const targetScore = 10;

    const spawnItem = useCallback(() => {
        const newItem = {
            id: Date.now(),
            left: Math.random() * 90 + 5,
            top: -50,
            speed: Math.random() * 2 + 2,
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
        const gameLoop = setInterval(() => {
            setItems((prev) => {
                const nextItems = prev.map((item) => ({ ...item, top: item.top + item.speed }));

                nextItems.forEach((item) => {
                    if (item.top > 330 && item.top < 370) {
                        const itemLeft = item.left;
                        if (Math.abs(itemLeft - basketPos) < 10) {
                            if (!item.caught) {
                                item.caught = true;
                                setScore((s) => s + 1);
                            }
                        }
                    }
                });

                return nextItems.filter((item) => item.top < 450 && !item.caught);
            });
        }, 16);

        return () => clearInterval(gameLoop);
    }, [gameActive, basketPos]);

    useEffect(() => {
        if (score >= targetScore) {
            setGameActive(false);
            setTimeout(onComplete, 1000);
        }
    }, [score, onComplete]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        setBasketPos(Math.min(Math.max(x, 5), 95));
    };

    const handleTouchMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (!e.touches[0]) return;
        const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
        setBasketPos(Math.min(Math.max(x, 5), 95));
    };

    return (
        <div className="flex flex-col items-center gap-6 p-4">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-primary-red mb-2">Heart Catcher</h2>
                <p className="text-gray-600 dark:text-gray-400">Catch {targetScore} hearts to unlock the surprise!</p>
                <div className="text-5xl font-bold mt-4 text-primary-pink">{score} / {targetScore}</div>
            </div>

            <div
                className="relative w-full max-w-[500px] h-[400px] bg-white/10 backdrop-blur-md border-2 border-primary-pink/30 rounded-3xl overflow-hidden touch-none"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
            >
                {!gameActive && score === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                        <button
                            onClick={() => setGameActive(true)}
                            className="romantic-gradient px-8 py-3 rounded-full text-white font-bold shadow-lg"
                        >
                            Start Game
                        </button>
                    </div>
                )}

                {score >= targetScore && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 z-20">
                        <Trophy size={60} className="text-yellow-500 mb-4" />
                        <h3 className="text-2xl font-bold text-primary-red">CHALLENGE COMPLETE!</h3>
                    </div>
                )}

                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        className="absolute pointer-events-none"
                        style={{ left: `${item.left}%`, top: `${item.top}px` }}
                    >
                        <Heart fill="#E63946" stroke="none" size={30} />
                    </motion.div>
                ))}

                <div
                    className="absolute bottom-5 w-16 h-12 flex items-center justify-center pointer-events-none"
                    style={{ left: `${basketPos}%`, transform: 'translateX(-50%)' }}
                >
                    <div className="w-16 h-10 bg-primary-red/80 rounded-b-2xl border-2 border-white/40 flex items-center justify-center shadow-lg">
                        <Heart size={20} fill="white" className="animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeartCatcher;
