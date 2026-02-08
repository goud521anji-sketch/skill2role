import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Questionnaire = ({ job, onBack, onComplete }) => {
    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch questions for this job
        const fetchQuestions = async () => {
            try {
                const res = await fetch(`http://localhost:5000/simulation/questions/${job.id}`);
                const data = await res.json();
                setQuestions(data);
            } catch (err) {
                console.error("Failed to load questions", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [job.id]);

    const handleAnswer = (value) => {
        const question = questions[currentStep];
        setAnswers({ ...answers, [question.id]: value });
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete(answers);
        }
    };

    if (loading) return <div className="text-center text-indigo-400 animate-pulse">Loading simulation...</div>;
    if (questions.length === 0) return <div className="text-center text-slate-400">No questions available for this career.</div>;

    const currentQ = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
                    ← Back
                </button>
                <div className="text-slate-300 font-medium">
                    Scenario {currentStep + 1} of {questions.length}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full mb-10 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Question Card */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-panel p-8 rounded-2xl border border-slate-700/50"
                >
                    <h3 className="text-2xl font-semibold text-white mb-8 leading-relaxed">
                        {currentQ.text}
                    </h3>

                    <div className="mb-8">
                        {currentQ.type === 'slider' && (
                            <div className="px-4">
                                <input
                                    type="range"
                                    min={currentQ.min}
                                    max={currentQ.max}
                                    defaultValue={answers[currentQ.id] || (currentQ.max / 2)}
                                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    onChange={(e) => handleAnswer(parseInt(e.target.value))}
                                />
                                <div className="flex justify-between mt-2 text-slate-400 text-sm">
                                    <span>Low Confidence</span>
                                    <span>High Confidence</span>
                                </div>
                            </div>
                        )}

                        {currentQ.type === 'choice' && (
                            <div className="grid gap-3">
                                {currentQ.options.map(option => (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswer(option)}
                                        className={`p-4 rounded-xl text-left border transition-all ${answers[currentQ.id] === option
                                                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={!answers[currentQ.id] && currentQ.type === 'choice'} // Slider always has a value
                        className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {currentStep === questions.length - 1 ? 'Finish Simulation' : 'Next Scenario'}
                    </button>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Questionnaire;
