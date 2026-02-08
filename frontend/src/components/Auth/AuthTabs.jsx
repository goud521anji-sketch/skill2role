import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from './GlassCard';
import authService from '../../services/authService';

const AuthTabs = () => {
    const [activeTab, setActiveTab] = useState('login'); // login, register
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Form Stats
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let data;
            if (activeTab === 'login') {
                data = await authService.login(formData.email, formData.password);
            } else {
                data = await authService.register(formData.fullName, formData.email, formData.password);
            }

            if (!data || !data.token) throw new Error('Authentication failed');

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Success Animation Delay
            setTimeout(() => {
                navigate(activeTab === 'register' ? '/onboarding' : '/dashboard');
            }, 500);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Authentication failed');
            setLoading(false);
        }
    };

    const handleGuest = async () => {
        setLoading(true);
        try {
            const data = await authService.guest();

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard'); // Direct to dashboard for guest
        } catch (err) {
            console.error(err);
            setError('Guest login failed');
            setLoading(false);
        }
    };

    return (
        <GlassCard className="w-full max-w-md p-1 rounded-3xl">
            {/* Tabs Header */}
            <div className="flex p-1 bg-slate-900/50 rounded-2xl mb-6 relative">
                {/* Animated Background Pill */}
                <motion.div
                    className="absolute top-1 bottom-1 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 z-0"
                    initial={false}
                    animate={{
                        left: activeTab === 'login' ? '4px' : '50%',
                        width: 'calc(50% - 6px)'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />

                <button
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 py-3 text-sm font-semibold rounded-xl relative z-10 transition-colors ${activeTab === 'login' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    Sign In
                </button>
                <button
                    onClick={() => setActiveTab('register')}
                    className={`flex-1 py-3 text-sm font-semibold rounded-xl relative z-10 transition-colors ${activeTab === 'register' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    Create Account
                </button>
            </div>

            <div className="px-6 pb-8">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        {error}
                    </motion.div>
                )}

                <AnimatePresence mode='wait'>
                    <motion.form
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {activeTab === 'register' && (
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 ml-1">FULL NAME</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-white placeholder-slate-500 transition-all"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                    <span className="absolute left-3 top-3.5 text-slate-500">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 ml-1">EMAIL</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-white placeholder-slate-500 transition-all"
                                    placeholder="you@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <span className="absolute left-3 top-3.5 text-slate-500">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 ml-1">PASSWORD</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-white placeholder-slate-500 transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <span className="absolute left-3 top-3.5 text-slate-500">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 flex justify-center items-center gap-2 group"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{activeTab === 'login' ? 'Sign In' : 'Get Started'}</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </>
                            )}
                        </button>
                    </motion.form>
                </AnimatePresence>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-px bg-slate-700 flex-1" />
                    <span className="text-xs text-slate-500 font-medium">OR</span>
                    <div className="h-px bg-slate-700 flex-1" />
                </div>

                <button
                    onClick={handleGuest}
                    className="w-full py-3 bg-transparent border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 text-slate-300 font-semibold rounded-xl transition-all flex justify-center items-center gap-2"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    Continue as Guest
                </button>
            </div>
        </GlassCard>
    );
};

export default AuthTabs;
