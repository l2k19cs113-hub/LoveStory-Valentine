import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import LandingPage from './components/LandingPage.jsx';
import CreatePage from './components/CreatePage.jsx';
import LovePage from './components/LovePage.jsx';
import HeartCatcher from './components/HeartCatcher.jsx';
import SharePage from './components/SharePage.jsx';

// Helper for safe Base64 encoding (supports emojis/Unicode)
const safeBtoa = (str) => {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
};

// Helper for safe Base64 decoding
const safeAtob = (str) => {
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
};

function App() {
    const [view, setView] = useState('landing'); // landing, create, share, game, love
    const [data, setData] = useState(null);
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        // Check for data in URL
        const params = new URLSearchParams(window.location.search);
        const encodedData = params.get('data');

        if (encodedData) {
            try {
                // Try safe decoding first
                let decodedStr;
                try {
                    decodedStr = safeAtob(encodedData);
                } catch (e) {
                    // Fallback for old links (standard atob)
                    console.log("Legacy link detected, trying standard decoding");
                    decodedStr = atob(encodedData);
                }

                const decoded = JSON.parse(decodedStr);
                setData(decoded);
                // If visiting with data, go straight to game
                setView('game');
            } catch (error) {
                console.error('Error decoding data:', error);
            }
        }
    }, []);

    const handleCreate = (formData) => {
        try {
            const encoded = safeBtoa(JSON.stringify(formData));
            const newUrl = `${window.location.origin}${window.location.pathname}?data=${encoded}`;

            setShareUrl(newUrl);
            setData(formData);
            setView('share');
        } catch (error) {
            console.error("Encoding error:", error);
            alert("Something went wrong creating your surprise. Please try simpler text/emojis.");
        }
    };

    const handlePreview = () => {
        // Update URL and go to game
        window.history.pushState({}, '', shareUrl);
        setView('game');
    };

    const handleGameComplete = () => {
        setView('love');
    };

    const handleBack = () => {
        window.history.pushState({}, '', window.location.pathname);
        setData(null);
        setShareUrl('');
        setView('landing');
    };

    const isMidnight = data?.theme === 'midnight';

    const renderContent = () => {
        if (view === 'landing') {
            return <LandingPage onStart={() => setView('create')} />;
        }

        if (view === 'create') {
            return <CreatePage onCreate={handleCreate} onBack={() => setView('landing')} />;
        }

        if (view === 'share') {
            return <SharePage url={shareUrl} data={data} onPreview={handlePreview} />;
        }

        if (view === 'game') {
            return (
                <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 ${isMidnight ? 'dark-theme' : ''}`} style={{ backgroundColor: isMidnight ? 'var(--dark-love)' : 'var(--cream-white)' }}>
                    <div className="mb-8 text-center max-w-md z-10">
                        <h1 className="text-4xl font-bold text-primary-red mb-3">A Special Surprise Awaits!</h1>
                        <p className="text-lg opacity-80">Catch some love to reveal your message...</p>
                    </div>
                    <div className="relative z-10 w-full flex justify-center">
                        <HeartCatcher onComplete={handleGameComplete} />
                    </div>

                    {/* Background Decor */}
                    <div className="fixed inset-0 pointer-events-none opacity-50">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-pink/10 blur-3xl rounded-full animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-red/5 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>
                </div>
            );
        }

        if (view === 'love') {
            return <LovePage data={data} onBack={handleBack} />;
        }

        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red"></div>
            </div>
        );
    };

    return (
        <div className={`relative min-h-screen flex flex-col ${isMidnight ? 'dark-theme' : ''}`}>
            <div className="flex-grow">
                {renderContent()}
            </div>

            {/* Direct Footer for All Pages */}
            <footer className="w-full py-6 text-center z-[1000] relative">
                <a
                    href="https://bktechnologies.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center justify-center space-y-1 transition-all hover:scale-105"
                >
                    <span className="text-xs uppercase tracking-widest opacity-40 font-bold group-hover:opacity-60 transition-opacity">Created by</span>
                    <span className="text-lg font-heading text-primary-red flex items-center gap-2 drop-shadow-sm">
                        BK Technologies <Heart size={14} fill="#E63946" stroke="none" className="animate-pulse" />
                    </span>
                </a>
            </footer>

            <style>{`
                .font-heading { font-family: 'Playfair Display', serif; }
                footer span { font-family: 'Inter', sans-serif; }
            `}</style>
        </div>
    );
}

export default App;
