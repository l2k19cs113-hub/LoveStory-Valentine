import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import CreatePage from './components/CreatePage.jsx';
import LovePage from './components/LovePage.jsx';
import HeartCatcher from './components/HeartCatcher.jsx';

function App() {
    const [view, setView] = useState('landing'); // landing, create, game, love
    const [data, setData] = useState(null);

    useEffect(() => {
        // Check for data in URL
        const params = new URLSearchParams(window.location.search);
        const encodedData = params.get('data');

        if (encodedData) {
            try {
                const decoded = JSON.parse(atob(encodedData));
                setData(decoded);
                setView('game');
            } catch (error) {
                console.error('Error decoding data:', error);
            }
        }
    }, []);

    const handleCreate = (formData) => {
        const encoded = btoa(JSON.stringify(formData));
        const newUrl = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
        window.history.pushState({}, '', newUrl);
        setData(formData);
        setView('game');
    };

    const handleGameComplete = () => {
        setView('love');
    };

    const handleBack = () => {
        window.history.pushState({}, '', window.location.pathname);
        setData(null);
        setView('landing');
    };

    // Render based on view state
    if (view === 'landing') {
        return <LandingPage onStart={() => setView('create')} />;
    }

    if (view === 'create') {
        return <CreatePage onCreate={handleCreate} onBack={() => setView('landing')} />;
    }

    if (view === 'game') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-pink-50">
                <div className="mb-8 text-center max-w-md">
                    <h1 className="text-3xl font-bold text-primary-red mb-2">A Special Surprise Awaits!</h1>
                    <p className="text-gray-600">Catch some love to reveal your message...</p>
                </div>
                <HeartCatcher onComplete={handleGameComplete} />
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
