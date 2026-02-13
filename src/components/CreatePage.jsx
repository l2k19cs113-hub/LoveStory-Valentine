import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, User, MessageCircle, Gift, ChevronRight, ChevronLeft } from 'lucide-react';

const CreatePage = ({ onCreate, onBack }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        partnerName: '',
        yourName: '',
        message: '',
        proposalText: 'Will you be my Valentine?',
        theme: 'rose'
    });

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="container max-w-2xl mx-auto">
                <div className="glass-card p-8 md:p-12 relative overflow-hidden">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-100/20">
                        <motion.div
                            className="h-full romantic-gradient"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 romantic-gradient rounded-xl text-white">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold">Identify Your Muse</h2>
                                        <p className="text-gray-500">Who will receive this piece of your heart?</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="label-glass">Name of Your Beloved</label>
                                        <input
                                            type="text"
                                            className="input-glass"
                                            placeholder="The name that makes you smile..."
                                            value={formData.partnerName}
                                            onChange={(e) => updateFormData('partnerName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="label-glass">Your Secret Name</label>
                                        <input
                                            type="text"
                                            className="input-glass"
                                            placeholder="How they know you..."
                                            value={formData.yourName}
                                            onChange={(e) => updateFormData('yourName', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button onClick={onBack} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 font-medium">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        disabled={!formData.partnerName || !formData.yourName}
                                        className="flex-1 px-6 py-3 rounded-xl romantic-gradient text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        Next <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 romantic-gradient rounded-xl text-white">
                                        <MessageCircle size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold">Letters of Love</h2>
                                        <p className="text-gray-500">Whisper your heart's deepest desires...</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="label-glass">Your Romantic Note</label>
                                    <textarea
                                        className="input-glass min-h-[150px]"
                                        placeholder="In your eyes, I found my home..."
                                        value={formData.message}
                                        onChange={(e) => updateFormData('message', e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button onClick={prevStep} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 font-medium flex items-center justify-center gap-2">
                                        <ChevronLeft size={20} /> Back
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        disabled={!formData.message}
                                        className="flex-1 px-6 py-3 rounded-xl romantic-gradient text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        Next <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 romantic-gradient rounded-xl text-white">
                                        <Gift size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold">The Eternal Vow</h2>
                                        <p className="text-gray-500">Seal it with the perfect question.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="label-glass">The Big Proposal</label>
                                    <input
                                        type="text"
                                        className="input-glass"
                                        placeholder="Will you walk through life with me?"
                                        value={formData.proposalText}
                                        onChange={(e) => updateFormData('proposalText', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="label-glass">Select Theme</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => updateFormData('theme', 'rose')}
                                            className={`p-4 rounded-xl border-2 transition-all ${formData.theme === 'rose' ? 'border-primary-red bg-red-50' : 'border-transparent glass-card'}`}
                                        >
                                            🌹 Deep Rose
                                        </button>
                                        <button
                                            onClick={() => updateFormData('theme', 'midnight')}
                                            className={`p-4 rounded-xl border-2 transition-all ${formData.theme === 'midnight' ? 'border-primary-pink bg-pink-50' : 'border-transparent glass-card'}`}
                                        >
                                            ✨ Midnight Glow
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button onClick={prevStep} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 font-medium flex items-center justify-center gap-2">
                                        <ChevronLeft size={20} /> Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 px-6 py-3 rounded-xl romantic-gradient text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                                    >
                                        Finish Surprise <Heart size={20} fill="white" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CreatePage;
