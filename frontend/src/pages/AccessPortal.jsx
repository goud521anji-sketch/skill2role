import React from 'react';
import { motion } from 'framer-motion';
import AuthTabs from '../components/Auth/AuthTabs';
import { Link } from 'react-router-dom';

const AccessPortal = () => {
    return (
        <div className="min-h-screen bg-[#020617] flex overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-900/20 rounded-full blur-[120px]" />

            {/* Left Panel - Hero Content */}
            <div className="hidden lg:flex flex-1 flex-col justify-center px-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-indigo-400 text-xs font-bold tracking-wider mb-6">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                        v2.0 BETA LIVE
                    </div>

                    <h1 className="text-7xl font-bold tracking-tight mb-6 leading-tight">
                        <span className="text-white">SKILL</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">2ROLE</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-lg leading-relaxed mb-10">
                        The AI-powered career discovery platform. Simulate your future, test your skills, and find the role you were born to play.
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3">
                        {['🤖 AI Simulations', '📊 Smart Comparisons', '🚀 Career Roadmaps'].map((feature, i) => (
                            <motion.div
                                key={feature}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                className="px-4 py-2 bg-slate-900/40 border border-slate-800 rounded-lg text-slate-300 text-sm font-medium"
                            >
                                {feature}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Animated Graphic Placeholder */}
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-30 pointer-events-none">
                    <div className="absolute inset-0 border border-dashed border-slate-700 rounded-full animate-[spin_60s_linear_infinite]" />
                    <div className="absolute inset-8 border border-dashed border-slate-700 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                </div>
            </div>

            {/* Right Panel - Auth Card */}
            <div className="flex-1 flex flex-col justify-center items-center px-4 md:px-12 relative z-10 backdrop-blur-sm lg:backdrop-blur-0">
                <div className="w-full max-w-md">
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">SKILL2ROLE</h1>
                        <p className="text-slate-400">Turn skills into careers</p>
                    </div>

                    <AuthTabs />

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-500">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessPortal;
