import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import CreatePage from './components/CreatePage.jsx';
import LovePage from './components/LovePage.jsx';
import HeartCatcher from './components/HeartCatcher.jsx';
import SharePage from './components/SharePage.jsx';

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
                const decoded = JSON.parse(atob(encodedData));
                setData(decoded);
                // If visiting with data, go straight to game
                setView('game');
            } catch (error) {
                console.error('Error decoding data:', error);
            }
        }
    }, []);

    const handleCreate = (formData) => {
        const encoded = btoa(JSON.stringify(formData));
        const newUrl = `${window.location.origin}${window.location.pathname}?data=${encoded}`;

        setShareUrl(newUrl);
        setData(formData);
        setView('share');
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

    // Render based on view state
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
        const isMidnight = data?.theme === 'midnight';
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
}

export default App;
