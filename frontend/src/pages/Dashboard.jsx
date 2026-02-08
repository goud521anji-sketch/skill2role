import React, { useEffect, useState, useRef } from 'react';
import OpportunityGraph from '../components/OpportunityGraph';
import ComparisonView from '../components/ComparisonView';
import SimulationWizard from '../components/Simulation/SimulationWizard';
// import axios from 'axios';

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('graph'); // 'graph' or 'list'
    const [comparisonList, setComparisonList] = useState([]);
    const comparisonRef = useRef(null);

    useEffect(() => {
        // Mock fetching data
        const fetchMatches = async () => {
            const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
            // Simulate API
            setTimeout(() => {
                const mockJobs = [
                    {
                        job: { id: 1, title: 'Data Scientist', skills: ['Python', 'Stats', 'ML'], salary: '$120k', risk_level: 'Moderate', growth_score: 9 },
                        match_score: 95,
                        missing_skills: ['Deep Learning']
                    },
                    {
                        job: { id: 2, title: 'Frontend Dev', skills: ['React', 'CSS', 'Figma'], salary: '$90k', risk_level: 'Low', growth_score: 8 },
                        match_score: 85,
                        missing_skills: ['TypeScript']
                    },
                    {
                        job: { id: 3, title: 'Product Manager', skills: ['Agile', 'Roadmap', 'Jira'], salary: '$110k', risk_level: 'Moderate', growth_score: 8 },
                        match_score: 60,
                        missing_skills: ['SQL', 'Data Analysis']
                    },
                    {
                        job: { id: 4, title: 'UX Designer', skills: ['Figma', 'User Research', 'Prototyping'], salary: '$95k', risk_level: 'Low', growth_score: 7 },
                        match_score: 45,
                        missing_skills: ['Motion Design']
                    },
                    {
                        job: { id: 5, title: 'Investment Banker', skills: ['Finance', 'Excel', 'Modeling'], salary: '$150k', risk_level: 'High Risk', growth_score: 10 },
                        match_score: 40,
                        missing_skills: ['CFA', 'Regulations']
                    }
                ];
                setJobs(mockJobs);
                setLoading(false);
            }, 1000);
        };

        fetchMatches();
    }, []);

    const toggleComparison = (jobId) => {
        setComparisonList(prev => {
            if (prev.includes(jobId)) {
                return prev.filter(id => id !== jobId);
            } else {
                if (prev.length >= 4) {
                    alert("You can compare up to 4 careers at a time.");
                    return prev;
                }
                setTimeout(() => {
                    comparisonRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
                return [...prev, jobId];
            }
        });
    };

    const scrollToComparison = () => {
        comparisonRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', background: '#0f172a' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.8rem', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SKILL2ROLE</h1>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>Turn skills into careers that fit you</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* View Toggle */}
                    <div style={{ background: '#1e293b', padding: '0.3rem', borderRadius: '0.5rem', border: '1px solid #334155', display: 'flex' }}>
                        <button
                            onClick={() => setViewMode('graph')}
                            style={{
                                padding: '0.5rem 1rem', borderRadius: '0.3rem', border: 'none', cursor: 'pointer',
                                background: viewMode === 'graph' ? '#6366f1' : 'transparent',
                                color: viewMode === 'graph' ? 'white' : '#94a3b8',
                                fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            <span>🌐</span> Graph
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{
                                padding: '0.5rem 1rem', borderRadius: '0.3rem', border: 'none', cursor: 'pointer',
                                background: viewMode === 'list' ? '#6366f1' : 'transparent',
                                color: viewMode === 'list' ? 'white' : '#94a3b8',
                                fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            <span>📋</span> List
                        </button>
                    </div>

                    {/* Compare Button */}
                    <button
                        onClick={scrollToComparison}
                        style={{
                            padding: '0.8rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                            background: comparisonList.length < 2 ? '#334155' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: comparisonList.length < 2 ? '#94a3b8' : 'white',
                            fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
                        }}
                    >
                        <span>⚖️</span> Compare ({comparisonList.length})
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ color: 'var(--text)', textAlign: 'center', marginTop: '3rem', flex: 1 }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔮</div>
                    <p>Analyzing your profile and finding matches...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                    {/* Main Content Area (Graph or List) */}
                    <div style={{ background: 'var(--card-bg)', borderRadius: '1rem', padding: '1rem', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', overflow: 'hidden' }}>
                        {viewMode === 'graph' ? (
                            <>
                                <OpportunityGraph
                                    user={{ name: 'You' }}
                                    jobs={jobs}
                                    onNodeClick={(node) => {
                                        if (node.id !== 'user') setSelectedJob(jobs.find(j => j.job.id === node.id));
                                    }}
                                />
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                    Hover to see details. Click to view full roadmap.
                                </p>
                            </>
                        ) : (
                            <div style={{ overflowY: 'auto', padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                                {jobs.map(job => (
                                    <div
                                        key={job.job.id}
                                        onClick={() => setSelectedJob(job)}
                                        style={{
                                            background: '#1e293b', padding: '1.5rem', borderRadius: '0.8rem',
                                            border: '1px solid',
                                            borderColor: selectedJob?.job.id === job.job.id ? 'var(--primary)' : 'var(--border)',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            boxShadow: selectedJob?.job.id === job.job.id ? '0 0 0 2px var(--primary)' : 'none'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                            <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>{job.job.title}</h3>
                                            <span style={{
                                                background: job.match_score > 80 ? 'rgba(34, 197, 94, 0.2)' : job.match_score > 50 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                color: job.match_score > 80 ? '#4ade80' : job.match_score > 50 ? '#facc15' : '#f87171',
                                                padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold'
                                            }}>
                                                {job.match_score}%
                                            </span>
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                            {job.job.salary} • {job.job.risk_level} Risk
                                        </div>

                                        {/* Compare Checkbox */}
                                        <div
                                            onClick={(e) => { e.stopPropagation(); toggleComparison(job.job.id); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem',
                                                color: comparisonList.includes(job.job.id) ? '#f59e0b' : '#94a3b8', fontSize: '0.9rem', fontWeight: '500'
                                            }}
                                        >
                                            <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: `2px solid ${comparisonList.includes(job.job.id) ? '#f59e0b' : '#64748b'}`, background: comparisonList.includes(job.job.id) ? '#f59e0b' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {comparisonList.includes(job.job.id) && <span style={{ color: 'black', fontSize: '10px' }}>✓</span>}
                                            </div>
                                            {comparisonList.includes(job.job.id) ? 'Selected for Compare' : 'Add to Compare'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section (Right Panel) */}
                    <div style={{ overflowY: 'auto', padding: '0.2rem' }}>
                        {selectedJob ? (
                            <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)' }}>
                                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best Match For You</span>
                                    <h2 style={{ margin: '0.5rem 0', color: 'var(--primary)', fontSize: '1.8rem' }}>{selectedJob.job.title}</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: selectedJob.match_score > 80 ? '#4ade80' : selectedJob.match_score > 50 ? '#facc15' : '#f87171' }}>
                                            {selectedJob.match_score.toFixed(0)}% Match
                                        </div>
                                        <div style={{ background: '#334155', padding: '0.3rem 0.8rem', borderRadius: '0.5rem', color: 'white', fontSize: '0.9rem' }}>
                                            {selectedJob.job.salary}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ marginBottom: '0.8rem', color: 'var(--text)' }}>Why this fits:</h4>
                                    <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                        <li>Strong skill overlap ({selectedJob.job.skills.slice(0, 2).join(', ')})</li>
                                        <li>Matches your growth ambition</li>
                                        <li>Fits your {selectedJob.job.risk_level?.toLowerCase()} risk profile</li>
                                    </ul>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ marginBottom: '0.8rem', color: '#f8fafc' }}>Compare this Role:</h4>
                                    <button
                                        onClick={() => toggleComparison(selectedJob.job.id)}
                                        style={{
                                            width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid #f59e0b',
                                            background: comparisonList.includes(selectedJob.job.id) ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                                            color: '#f59e0b', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                        }}
                                    >
                                        <span>{comparisonList.includes(selectedJob.job.id) ? '✓ Added' : '+ Add to Comparison'}</span>
                                    </button>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ marginBottom: '0.8rem', color: 'var(--text)' }}>Skill Gap (Action Plan):</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {selectedJob.missing_skills.length > 0 ? selectedJob.missing_skills.map(skill => (
                                            <span key={skill} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                                {skill}
                                            </span>
                                        )) : <span style={{ color: '#4ade80' }}>No missing skills! You are ready.</span>}
                                    </div>
                                </div>

                                <button style={{ width: '100%', background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)', color: 'white', padding: '1rem', borderRadius: '0.8rem', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                                    Start Career Roadmap →
                                </button>
                            </div>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border)', borderStyle: 'dashed' }}>
                                <div>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>👈</div>
                                    <h3 style={{ margin: 0 }}>Select a Job</h3>
                                    <p>Click on a job card or node to view detailed insights.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Comparison Section */}
            <div ref={comparisonRef} style={{ marginTop: '2rem', padding: '1rem 0' }}>
                <ComparisonView jobIds={comparisonList} />
            </div>

            {/* Simulation Section */}
            <div style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--border)' }}>
                <SimulationWizard jobs={jobs} />
            </div>
        </div>
    );
};

export default Dashboard;
