import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Mock login
        navigate('/onboarding');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: 'var(--text)' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SKILL2ROLE</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.2rem' }}>Turn skills into careers that fit you</p>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(30, 41, 59, 0.7)', padding: '2.5rem', borderRadius: '1rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', width: '320px' }}>
                <input type="email" placeholder="Email" style={{ padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(15, 23, 42, 0.5)', color: 'var(--text)' }} value="demo@example.com" readOnly />
                <input type="password" placeholder="Password" style={{ padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(15, 23, 42, 0.5)', color: 'var(--text)' }} value="password" readOnly />
                <button type="submit" style={{ padding: '0.8rem', background: 'linear-gradient(to right, #6366f1, #a855f7)', color: 'white', border: 'none', fontWeight: 'bold', borderRadius: '0.5rem', marginTop: '1rem' }}>Get Started</button>
            </form>
            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>Continue as Guest</p>
        </div >
    );
};

export default Login;
