import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        education: {
            level: '',
            status: '',
            field: '',
            institution: '',
            tier: '',
            year: ''
        },
        skills: [], // [{name: 'Python', proficiency: 4, interest: 'High'}]
        interests: [], // ['Technology', 'Design']
        behavioral: {
            pace: 'Balanced',
            risk: 'Moderate',
            commitment: 20,
            preference: 'Structured',
            work_style: 'Team-based'
        }
    });

    const handleNext = async () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            console.log("Submitting Profile...", formData);
            localStorage.setItem('userProfile', JSON.stringify(formData));
            navigate('/dashboard');
        }
    };

    const updateEducation = (field, value) => {
        setFormData(prev => ({
            ...prev,
            education: { ...prev.education, [field]: value }
        }));
    };

    const availableDomains = ['Technology', 'Design', 'Business', 'Healthcare', 'Science', 'Arts', 'Law', 'Engineering'];

    const [currentDomain, setCurrentDomain] = useState('');
    const [skillName, setSkillName] = useState('');
    const [proficiency, setProficiency] = useState(3);
    const [interestLevel, setInterestLevel] = useState(50); // 0-100

    const addSkill = () => {
        if (skillName.trim() && currentDomain) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, {
                    domain: currentDomain,
                    name: skillName,
                    proficiency,
                    interest: interestLevel
                }]
            }));
            setSkillName('');
            setProficiency(3);
            setInterestLevel(50);
        }
    };

    const removeSkill = (index) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            {/* Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'var(--border)', zIndex: 0 }}></div>
                <div style={{ position: 'absolute', top: '50%', left: '0', width: `${((step - 1) / 2) * 100}%`, height: '2px', background: 'var(--primary)', zIndex: 0, transition: 'all 0.3s' }}></div>
                {[1, 2, 3].map(num => (
                    <div key={num} style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: step >= num ? 'var(--primary)' : 'var(--card-bg)',
                        color: step >= num ? 'white' : 'var(--text-muted)',
                        border: step >= num ? 'none' : '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', transition: 'all 0.3s',
                        zIndex: 1, position: 'relative'
                    }}>
                        {num}
                    </div>
                ))}
            </div>

            <div style={{ minHeight: '500px', background: 'var(--card-bg)', padding: '3rem', borderRadius: '1rem', border: '1px solid var(--border)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text)' }}>Educational Background</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Tell us about your academic journey.</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Highest Qualification</label>
                                    <select
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                                        value={formData.education.level}
                                        onChange={(e) => updateEducation('level', e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        <option value="Secondary">Secondary / Higher Secondary</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Undergraduate">Undergraduate</option>
                                        <option value="Postgraduate">Postgraduate</option>
                                        <option value="Doctorate">Doctorate</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Current Status</label>
                                    <select
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                                        value={formData.education.status}
                                        onChange={(e) => updateEducation('status', e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        <option value="Studying">Studying</option>
                                        <option value="Graduated">Graduated</option>
                                        <option value="Dropped out">Dropped out</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Graduation Year</label>
                                    <input
                                        type="number"
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                                        placeholder="YYYY"
                                        value={formData.education.year}
                                        onChange={(e) => updateEducation('year', e.target.value)}
                                    />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Field / Stream</label>
                                    <input
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                                        placeholder="e.g. Computer Science, Commerce, Biology"
                                        value={formData.education.field}
                                        onChange={(e) => updateEducation('field', e.target.value)}
                                    />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Institution Name</label>
                                    <input
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                                        placeholder="e.g. University of Technology"
                                        value={formData.education.institution}
                                        onChange={(e) => updateEducation('institution', e.target.value)}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text)' }}>Skills & Interests</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>What are you good at and what do you love?</p>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Select Domain</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    {availableDomains.map(domain => (
                                        <button
                                            key={domain}
                                            onClick={() => setCurrentDomain(domain === currentDomain ? '' : domain)}
                                            style={{
                                                padding: '0.6rem 1.2rem',
                                                borderRadius: '2rem',
                                                border: '1px solid',
                                                borderColor: currentDomain === domain ? 'var(--primary)' : 'var(--border)',
                                                background: currentDomain === domain ? 'var(--primary)' : 'transparent',
                                                color: currentDomain === domain ? 'white' : 'var(--text-muted)',
                                                cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            {domain}
                                        </button>
                                    ))}
                                </div>

                                {currentDomain && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '0.8rem', border: '1px solid var(--border)' }}>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Skill Name (e.g. Python, Figma)</label>
                                            <input
                                                value={skillName}
                                                onChange={(e) => setSkillName(e.target.value)}
                                                style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)' }}
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Proficiency (1-5)</label>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <span
                                                            key={star}
                                                            onClick={() => setProficiency(star)}
                                                            style={{ fontSize: '1.5rem', cursor: 'pointer', color: star <= proficiency ? '#fbbf24' : 'var(--border)' }}
                                                        >★</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Interest Level</label>
                                                <input
                                                    type="range" min="0" max="100"
                                                    value={interestLevel}
                                                    onChange={(e) => setInterestLevel(Number(e.target.value))}
                                                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                                                />
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>{interestLevel > 70 ? 'High' : interestLevel > 30 ? 'Medium' : 'Low'}</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={addSkill}
                                            disabled={!skillName.trim()}
                                            style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: !skillName.trim() ? 'var(--border)' : 'var(--primary)', color: 'white', border: 'none', cursor: !skillName.trim() ? 'not-allowed' : 'pointer' }}
                                        >
                                            Add Skill
                                        </button>
                                    </motion.div>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                {formData.skills.map((skill, idx) => (
                                    <div key={idx} style={{ background: 'var(--bg)', padding: '0.8rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem' }}>{skill.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{skill.domain} • {skill.proficiency}★</div>
                                        </div>
                                        <button onClick={() => removeSkill(idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                                    </div>
                                ))}
                                {formData.skills.length === 0 && (
                                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', width: '100%', textAlign: 'center', padding: '2rem' }}>No skills added yet.</div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text)' }}>Work Style & Preferences</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>How do you like to work?</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {/* Work Pace */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Work Pace</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        {['Fast-paced', 'Balanced', 'Slow & Steady'].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setFormData(p => ({ ...p, behavioral: { ...p.behavioral, pace: opt } }))}
                                                style={{
                                                    flex: 1, padding: '1rem', borderRadius: '0.5rem',
                                                    border: '1px solid',
                                                    borderColor: formData.behavioral.pace === opt ? 'var(--primary)' : 'var(--border)',
                                                    background: formData.behavioral.pace === opt ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg)',
                                                    color: formData.behavioral.pace === opt ? 'var(--primary)' : 'var(--text-muted)',
                                                    fontWeight: '500',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Risk Appetite */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Risk Appetite</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        {['Stable', 'Moderate', 'High Risk'].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setFormData(p => ({ ...p, behavioral: { ...p.behavioral, risk: opt } }))}
                                                style={{
                                                    flex: 1, padding: '1rem', borderRadius: '0.5rem',
                                                    border: '1px solid',
                                                    borderColor: formData.behavioral.risk === opt ? 'var(--primary)' : 'var(--border)',
                                                    background: formData.behavioral.risk === opt ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg)',
                                                    color: formData.behavioral.risk === opt ? 'var(--primary)' : 'var(--text-muted)',
                                                    fontWeight: '500',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Commitment */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Weekly Commitment</label>
                                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{formData.behavioral.commitment} hours</span>
                                    </div>
                                    <input
                                        type="range" min="5" max="60" step="5"
                                        value={formData.behavioral.commitment}
                                        onChange={(e) => setFormData(p => ({ ...p, behavioral: { ...p.behavioral, commitment: Number(e.target.value) } }))}
                                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <span>Casual</span>
                                        <span>Part-time</span>
                                        <span>Full-time</span>
                                    </div>
                                </div>

                                {/* Preferences */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Structure</label>
                                        <select
                                            value={formData.behavioral.preference}
                                            onChange={(e) => setFormData(p => ({ ...p, behavioral: { ...p.behavioral, preference: e.target.value } }))}
                                            style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                                        >
                                            <option value="Structured">Structured (Clear guidelines)</option>
                                            <option value="Flexible">Flexible (Open-ended)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Environment</label>
                                        <select
                                            value={formData.behavioral.work_style}
                                            onChange={(e) => setFormData(p => ({ ...p, behavioral: { ...p.behavioral, work_style: e.target.value } }))}
                                            style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                                        >
                                            <option value="Team-based">Team-based</option>
                                            <option value="Independent">Independent</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        style={{ marginRight: 'auto', background: 'transparent', color: 'var(--text-muted)', padding: '0.8rem 1.5rem', border: 'none', fontWeight: '500', cursor: 'pointer' }}
                    >
                        Back
                    </button>
                )}
                <button
                    onClick={handleNext}
                    style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)',
                        color: 'white', padding: '0.8rem 2.5rem',
                        border: 'none', borderRadius: '2rem',
                        fontWeight: 'bold', fontSize: '1.1rem',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                        cursor: 'pointer'
                    }}
                >
                    {step === 3 ? "Find My Career Matches" : "Continue"}
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
