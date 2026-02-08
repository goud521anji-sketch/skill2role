import React from 'react';
import { motion } from 'framer-motion';

const SimulationResults = ({ results, job, onReset }) => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-block p-4 rounded-full bg-green-500/10 mb-4"
                >
                    <span className="text-4xl">🎉</span>
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Simulation Complete!</h2>
                <p className="text-slate-400">Here is your compatibility report for <span className="text-indigo-400 font-semibold">{job.title}</span>.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Score Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 rounded-2xl border-t-4 border-indigo-500"
                >
                    <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">Overall Success Probability</h3>
                    <div className="flex items-center gap-4">
                        <div className="text-5xl font-bold text-white">{results.success_probability}%</div>
                        <div className="h-2 flex-1 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${results.success_probability}%` }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className={`h-full ${results.success_probability > 75 ? 'bg-green-500' : 'bg-yellow-500'}`}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Stat Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Work Stress" value={results.stress_level} color="text-red-400" delay={0.1} />
                    <StatCard label="Growth Speed" value={results.growth_speed} color="text-green-400" delay={0.2} />
                    <StatCard label="Satisfaction" value={`${results.work_satisfaction}/100`} color="text-blue-400" delay={0.3} />
                    <StatCard label="Skill Gap" value={`${results.skill_gap}%`} color="text-orange-400" delay={0.4} />
                </div>
            </div>

            {/* Radar/Bar Chart (Simple CSS implementation) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="glass-panel p-8 rounded-2xl mb-8"
            >
                <h3 className="text-xl font-bold text-white mb-6">Detailed Breakdown</h3>
                <div className="space-y-4">
                    <Bar label="Technical Skill Match" value={100 - results.skill_gap} />
                    <Bar label="Cultural Fit" value={results.work_satisfaction} />
                    <Bar label="Long-term Potential" value={results.success_probability * 0.9} />
                </div>
            </motion.div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={onReset}
                    className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors"
                >
                    Simulate Another Career
                </button>
                <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25">
                    Save Results
                </button>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className="glass-panel p-4 rounded-xl flex flex-col justify-center items-center text-center"
    >
        <span className="text-slate-500 text-xs uppercase font-bold mb-1">{label}</span>
        <span className={`text-xl font-bold ${color}`}>{value}</span>
    </motion.div>
);

const Bar = ({ label, value }) => (
    <div>
        <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">{label}</span>
            <span className="text-slate-400">{Math.round(value)}%</span>
        </div>
        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
        </div>
    </div>
);

export default SimulationResults;
