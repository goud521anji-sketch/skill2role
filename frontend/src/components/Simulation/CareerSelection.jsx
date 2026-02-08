import React from 'react';
import { motion } from 'framer-motion';

const CareerSelection = ({ jobs, onSelect }) => {
    return (
        <div className="w-full">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Select a Career to Simulate</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((jobWrapper, index) => {
                    const job = jobWrapper.job; // Access nested job object
                    return (
                        <motion.div
                            key={job.id}
                            whileHover={{ scale: 1.03, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(job)}
                            className="glass-panel p-6 rounded-2xl cursor-pointer border border-slate-700/50 hover:border-indigo-500/50 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
                                    <span className="text-2xl">🚀</span>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${job.risk_level === 'Low' ? 'bg-green-500/20 text-green-400' :
                                        job.risk_level === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                    }`}>
                                    {job.risk_level} Risk
                                </span>
                            </div>

                            <h4 className="text-xl font-bold text-white mb-2">{job.title}</h4>
                            <p className="text-slate-400 text-sm mb-4">{job.salary} • {job.field}</p>

                            <div className="flex flex-wrap gap-2">
                                {job.skills.slice(0, 3).map(skill => (
                                    <span key={skill} className="text-xs px-2 py-1 bg-slate-800 rounded-md text-slate-300 border border-slate-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default CareerSelection;
