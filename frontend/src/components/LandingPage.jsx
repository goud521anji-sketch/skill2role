import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-4">
            {/* Background Particles (Simplified) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-4xl mx-auto"
            >
                <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-indigo-300 bg-indigo-900/30 rounded-full border border-indigo-500/30 backdrop-blur-sm">
                    AI-Powered Career Discovery
                </span>

                <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
                    <span className="text-white">SKILL</span>
                    <span className="text-gradient">2ROLE</span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Unlock your potential. Compare careers, simulate your future, and find the path that truly fits you.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/auth/portal" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 flex items-center gap-2">
                        Get Started
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </Link>

                    <Link to="/guest" className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 font-semibold rounded-xl border border-slate-700 backdrop-blur-md transition-all hover:scale-105">
                        Try as Guest
                    </Link>
                </div>
            </motion.div>

            {/* Floating Cards Animation */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <FloatingCard label="Data Scientist" x="10%" y="20%" delay={0} />
                <FloatingCard label="UX Designer" x="80%" y="15%" delay={2} />
                <FloatingCard label="Product Manager" x="15%" y="70%" delay={4} />
                <FloatingCard label="Blockchain Dev" x="85%" y="65%" delay={1} />
            </div>

            {/* Footer Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 text-slate-500 text-sm"
            >
                <p>© 2026 Skill2Role. Designed for the Future of Work.</p>
            </motion.div>
        </div>
    );
};

const FloatingCard = ({ label, x, y, delay }) => (
    <motion.div
        initial={{ x: 0, y: 0 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: delay, ease: "easeInOut" }}
        style={{ left: x, top: y }}
        className="absolute glass-card px-6 py-3 text-indigo-200 text-sm font-medium hidden md:block"
    >
        {label}
    </motion.div>
);

export default LandingPage;
