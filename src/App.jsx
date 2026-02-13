import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import CreatePage from './components/CreatePage';
import LovePage from './components/LovePage';
import HeartCatcher from './components/HeartCatcher';
import LoveMatch from './components/LoveMatch';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gamepad2, Sparkles } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loveData, setLoveData] = useState(null);
  const [gameState, setGameState] = useState('none'); // none, intro, level1, level2

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleCreate = (data) => {
    setLoveData(data);
    setCurrentPage('game-intro');
  };

  const startGames = () => {
    setGameState('level1');
    setCurrentPage('games');
  };

  const onGameComplete = () => {
    if (gameState === 'level1') {
      setGameState('level2');
    } else {
      setCurrentPage('love');
    }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      <HeartParticles />

      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 p-3 glass-card bg-opacity-40"
      >
        {isDarkMode ? '🌙' : '☀️'}
      </button>

      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingPage onStart={() => setCurrentPage('create')} />
          </motion.div>
        )}

        {currentPage === 'create' && (
          <motion.div key="create" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <CreatePage onCreate={handleCreate} onBack={() => setCurrentPage('landing')} />
          </motion.div>
        )}

        {currentPage === 'game-intro' && (
          <motion.div key="game-intro" className="min-h-screen flex items-center justify-center p-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div className="glass-card max-w-xl p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Gamepad2 size={120} /></div>
              <Gamepad2 size={80} className="text-primary-red mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">Challenge Accepted?</h2>
              <p className="text-gray-600 dark:text-gray-300 text-xl mb-10 leading-relaxed">
                Before {loveData?.partnerName} can unlock your secret message, they must complete the <span className="text-primary-red font-bold">Love Challenge</span>! 🎮
              </p>
              <button onClick={startGames} className="romantic-gradient w-full py-4 rounded-full text-white text-xl font-bold shadow-lg hover:scale-105 transition-transform">
                Start Challenge 🚀
              </button>
            </div>
          </motion.div>
        )}

        {currentPage === 'games' && (
          <motion.div key="games" className="min-h-screen flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="w-full max-w-4xl">
              {gameState === 'level1' && <HeartCatcher onComplete={onGameComplete} />}
              {gameState === 'level2' && <LoveMatch onComplete={onGameComplete} />}
            </div>
          </motion.div>
        )}

        {currentPage === 'love' && (
          <motion.div key="love" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <LovePage data={loveData} onBack={() => setCurrentPage('create')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const HeartParticles = () => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const left = Math.random() * 100;
      const size = Math.random() * 20 + 10;
      const duration = Math.random() * 5 + 5;
      setParticles(prev => [...prev, { id, left, size, duration }]);
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), duration * 1000);
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {particles.map(p => (
        <div key={p.id} className="heart-particle" style={{ left: `${p.left}%`, width: `${p.size}px`, height: `${p.size}px`, bottom: '-50px', animationDuration: `${p.duration}s` }}>
          <Heart fill="#E63946" stroke="none" opacity={0.2} size={p.size} />
        </div>
      ))}
    </>
  );
};

export default App;