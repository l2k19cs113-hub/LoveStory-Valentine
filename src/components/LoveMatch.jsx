import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Cloud, Moon, Sun, Flower2 } from 'lucide-react';

const icons = [Heart, Star, Cloud, Moon, Sun, Flower2];

const LoveMatch = ({ onComplete }) => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        const deck = [...icons, ...icons]
            .sort(() => Math.random() - 0.5)
            .map((Icon, index) => ({ id: index, Icon }));
        setCards(deck);
    }, []);

    useEffect(() => {
        if (flipped.length === 2) {
            setDisabled(true);
            const [first, second] = flipped;
            if (cards[first].Icon === cards[second].Icon) {
                setSolved([...solved, first, second]);
                setFlipped([]);
                setDisabled(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    }, [flipped, cards, solved]);

    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            setTimeout(onComplete, 1000);
        }
    }, [solved, cards, onComplete]);

    const handleClick = (index) => {
        if (disabled || flipped.includes(index) || solved.includes(index)) return;
        setFlipped([...flipped, index]);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 w-full">
            <div className="text-center">
                <h2 className="text-3xl font-heading text-primary-red mb-2">Love Match</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Match the pairs!</p>
            </div>

            <div className="bg-white/30 backdrop-blur-md p-4 rounded-3xl border-2 border-primary-pink/30 shadow-xl w-full max-w-[320px]">
                <div className="grid grid-cols-4 gap-3 w-full">
                    {cards.map((card, index) => {
                        const isFlipped = flipped.includes(index) || solved.includes(index);
                        const Icon = card.Icon;

                        return (
                            <motion.div
                                key={card.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative aspect-square cursor-pointer"
                                onClick={() => handleClick(index)}
                            >
                                <div
                                    className={`w-full h-full glass-card flex items-center justify-center border transition-all duration-300 rounded-lg ${isFlipped ? 'rotate-y-180 border-primary-pink bg-white/60' : 'border-white/40 bg-white/20'
                                        } ${solved.includes(index) ? 'opacity-50 ring-2 ring-primary-red' : ''}`}
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {isFlipped ? (
                                        <Icon size={20} className="text-primary-red drop-shadow-sm" />
                                    ) : (
                                        <div className="text-lg font-bold text-primary-pink">?</div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LoveMatch;
