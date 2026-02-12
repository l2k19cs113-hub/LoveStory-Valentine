import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import CreatePage from './components/CreatePage';
import LovePage from './components/LovePage';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loveData, setLoveData] = useState(null);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleCreate = (data) => {
    setLoveData(data);
    setCurrentPage('love');
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      {/* Background Particles */}
      <HeartParticles />

      {/* Dark Mode Toggle */}
      <button 
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 p-3 glass-card bg-opacity-40"
      >
        {isDarkMode ? '🌙' : '☀️'}
      </button>

      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage onStart={() => setCurrentPage('create')} />
          </motion.div>
        )}

        {currentPage === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <CreatePage onCreate={handleCreate} onBack={() => setCurrentPage('landing')} />
          </motion.div>
        )}

        {currentPage === 'love' && (
          <motion.div
            key="love"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
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
      
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, duration * 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          className="heart-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            bottom: '-50px',
            animationDuration: `${p.duration}s`,
          }}
        >
          <Heart fill="#E63946" stroke="none" opacity={0.3} size={p.size} />
        </div>
      ))}
    </>
  );
};

export default App;
