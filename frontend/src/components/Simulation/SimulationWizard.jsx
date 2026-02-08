import React, { useState } from 'react';
import CareerSelection from './CareerSelection';
import Questionnaire from './Questionnaire';
import SimulationResults from './SimulationResults';
import { motion, AnimatePresence } from 'framer-motion';

const SimulationWizard = ({ jobs }) => {
    const [step, setStep] = useState('selection'); // selection, questions, results
    const [selectedJob, setSelectedJob] = useState(null);
    const [simulationResults, setSimulationResults] = useState(null);

    const handleSelectJob = (job) => {
        setSelectedJob(job);
        setStep('questions');
    };

    const handleCompleteQuestions = async (answers) => {
        // Submit answers to backend
        try {
            const res = await fetch('http://localhost:5000/simulation/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId: selectedJob.id, answers })
            });
            const data = await res.json();
            setSimulationResults(data);
            setStep('results');
        } catch (err) {
            console.error("Simulation submit failed", err);
            // Handle error, maybe mock fallback
        }
    };

    const handleReset = () => {
        setStep('selection');
        setSelectedJob(null);
        setSimulationResults(null);
    };

    return (
        <div className="py-10">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 mb-2">
                    Career Simulator
                </h2>
                <p className="text-slate-400">
                    Step into the shoes of different professionals. Answer situational questions and see if you fit.
                </p>
            </div>

            <div className="min-h-[500px]">
                <AnimatePresence mode='wait'>
                    {step === 'selection' && (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <CareerSelection jobs={jobs} onSelect={handleSelectJob} />
                        </motion.div>
                    )}

                    {step === 'questions' && selectedJob && (
                        <motion.div
                            key="questions"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <Questionnaire
                                job={selectedJob}
                                onBack={() => setStep('selection')}
                                onComplete={handleCompleteQuestions}
                            />
                        </motion.div>
                    )}

                    {step === 'results' && simulationResults && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <SimulationResults
                                results={simulationResults}
                                job={selectedJob}
                                onReset={handleReset}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SimulationWizard;
