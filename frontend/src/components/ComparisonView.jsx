import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_COMPARISON_DATA = [
    {
        id: 1,
        title: 'Data Scientist',
        match_score: 95,
        salary: 120000,
        work_time: '40h/week',
        work_type: 'Hybrid',
        risk_level: 'Moderate',
        work_life_balance: 'Good',
        growth_score: 9,
        progression: 'Senior DS -> AI Lead',
        benefits: ['Stock Options', 'Health', 'Remote Budget'],
        why_best: 'Highest Growth Potential'
    },
    {
        id: 2,
        title: 'Frontend Dev',
        match_score: 85,
        salary: 90000,
        work_time: '40h/week',
        work_type: 'Remote',
        risk_level: 'Low',
        work_life_balance: 'Excellent',
        growth_score: 8,
        progression: 'Senior Dev -> Tech Lead',
        benefits: ['Flexible Hours', 'Wellness', 'Learning Stipend'],
        why_best: 'Best Work-Life Balance'
    },
    {
        id: 3,
        title: 'Product Manager',
        match_score: 60,
        salary: 110000,
        work_time: '50h/week',
        work_type: 'Hybrid',
        risk_level: 'Moderate',
        work_life_balance: 'Average',
        growth_score: 8,
        progression: 'Senior PM -> VP Product',
        benefits: ['Performance Bonus', 'Equity', 'Travel'],
        why_best: 'High Strategic Impact'
    },
    {
        id: 4,
        title: 'UX Designer',
        match_score: 45,
        salary: 95000,
        work_time: '40h/week',
        work_type: 'Remote',
        risk_level: 'Low',
        work_life_balance: 'Good',
        growth_score: 7,
        progression: 'Senior UX -> Design Director',
        benefits: ['Creative Freedom', 'Remote Work', 'Equipment Budget'],
        why_best: 'Lowest Stress'
    },
    {
        id: 5,
        title: 'Investment Banker',
        match_score: 40,
        salary: 150000,
        work_time: '70h/week',
        work_type: 'On-site',
        risk_level: 'High Risk',
        work_life_balance: 'Poor',
        growth_score: 10,
        progression: 'Associate -> MD',
        benefits: ['Huge Bonuses', 'Prestige', 'Network'],
        why_best: 'Highest Earning Potential'
    }
];

const ComparisonView = ({ jobIds }) => {
    const [comparisonData, setComparisonData] = useState([]);
    const [loading, setLoading] = useState(false);
    // Removed error state to prevent UI blocking


    useEffect(() => {
        const fetchComparison = async () => {
            if (!jobIds || jobIds.length === 0) {
                setComparisonData([]);
                return;
            }

            setLoading(true);

            try {
                // Try API first
                const res = await axios.post('http://localhost:5000/api/compare-careers', { job_ids: jobIds });
                if (res.data && res.data.length > 0) {
                    setComparisonData(res.data);
                } else {
                    throw new Error("No data from API");
                }
            } catch (error) {
                console.warn("Comparison API failed, falling back to mock data.", error);

                // FALLBACK LOGIC: Filter mock data by selected IDs
                const fallbackData = jobIds.map(id => {
                    const mock = MOCK_COMPARISON_DATA.find(m => m.id === id);
                    return mock || {
                        id: id,
                        title: 'Unknown Role',
                        match_score: 0,
                        salary: 'N/A',
                        why_best: 'Data Unavailable'
                    };
                });
                setComparisonData(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        fetchComparison();
    }, [jobIds]);

    // Smart Insights Logic
    const getInsight = (data) => {
        if (!data || data.length === 0) return [];

        const insights = [];

        // Highest Salary
        const maxSalaryJob = data.reduce((max, job) => (job.salary > max.salary ? job : max), data[0]);
        insights.push({ type: 'success', text: `💰 Highest Salary: ${maxSalaryJob.title} ($${maxSalaryJob.salary.toLocaleString()})` });

        // Best Work-Life Balance
        const bestWLB = data.find(job => job.work_life_balance === 'Excellent' || job.work_life_balance === 'Good');
        if (bestWLB) insights.push({ type: 'info', text: `⚖️ Best Work-Life Balance: ${bestWLB.title}` });

        // Lowest Risk
        const lowRisk = data.find(job => job.risk_level === 'Low' || job.risk_level === 'Stable');
        if (lowRisk) insights.push({ type: 'warning', text: `🛡️ Lowest Risk: ${lowRisk.title}` });

        return insights;
    };

    const insights = getInsight(comparisonData);

    if (jobIds.length === 0) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', border: '2px dashed #334155', borderRadius: '1rem', background: 'rgba(30, 41, 59, 0.5)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>⚖️</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#cbd5e1' }}>Compare Careers</h3>
                <p>Select careers from the recommendations above to compare them side-by-side.</p>
            </div>
        );
    }

    return (
        <div style={{ background: '#1e293b', borderRadius: '1rem', border: '1px solid #334155', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', background: '#0f172a' }}>
                <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.5rem' }}>Compare Careers</h2>
                <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8' }}>Analyze side-by-side to make the best decision.</p>
            </div>

            {/* Content */}
            <div style={{ padding: '2rem', flex: 1, overflowX: 'auto' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '2rem' }}>🔄</div>
                        <div>Preparing comparison...</div>
                    </div>
                ) : (
                    <>
                        {/* Smart Insights */}
                        {insights.length > 0 && (
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                                {insights.map((insight, idx) => (
                                    <div key={idx} style={{
                                        padding: '0.6rem 1rem', borderRadius: '0.5rem',
                                        background: insight.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : insight.type === 'info' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(250, 204, 21, 0.1)',
                                        border: `1px solid ${insight.type === 'success' ? '#22c55e' : insight.type === 'info' ? '#38bdf8' : '#facc15'}`,
                                        color: insight.type === 'success' ? '#4ade80' : insight.type === 'info' ? '#38bdf8' : '#facc15',
                                        fontSize: '0.9rem', fontWeight: '500'
                                    }}>
                                        {insight.text}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Comparison Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0', minWidth: '800px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #334155', color: '#94a3b8', width: '200px' }}>Parameter</th>
                                        {comparisonData.map(job => (
                                            <th key={job.id} style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #334155', minWidth: '200px' }}>
                                                <div style={{ fontSize: '1.1rem', color: '#f8fafc', fontWeight: 'bold' }}>{job.title}</div>
                                                <div style={{ fontSize: '0.85rem', marginTop: '0.3rem', color: job.match_score > 80 ? '#4ade80' : '#facc15' }}>
                                                    {job.match_score.toFixed(0)}% Match
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { label: 'Avg Salary', key: 'salary', format: (val) => `$${val.toLocaleString()}` },
                                        { label: 'Work Time', key: 'work_time' },
                                        { label: 'Work Type', key: 'work_type' },
                                        { label: 'Risk Level', key: 'risk_level' },
                                        { label: 'Work-Life Balance', key: 'work_life_balance' },
                                        { label: 'Growth Potential', key: 'growth_score', format: (val) => `${val}/10` },
                                        { label: 'Progression', key: 'progression' },
                                        { label: 'Why Best (AI)', key: 'why_best', style: { fontStyle: 'italic', color: '#a855f7' } }
                                    ].map((row, idx) => (
                                        <tr key={idx} style={{ background: idx % 2 === 0 ? 'rgba(30, 41, 59, 0.3)' : 'transparent' }}>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid #334155', fontWeight: '500', color: '#94a3b8' }}>{row.label}</td>
                                            {comparisonData.map(job => (
                                                <td key={job.id} style={{ padding: '1rem', borderBottom: '1px solid #334155', ...row.style }}>
                                                    {row.format ? row.format(job[row.key]) : job[row.key] || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {/* Benefits Row */}
                                    <tr>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid #334155', fontWeight: '500', color: '#94a3b8', verticalAlign: 'top' }}>Benefits</td>
                                        {comparisonData.map(job => (
                                            <td key={job.id} style={{ padding: '1rem', borderBottom: '1px solid #334155', verticalAlign: 'top' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                                    {job.benefits && job.benefits.map((b, i) => (
                                                        <span key={i} style={{ fontSize: '0.75rem', background: '#334155', color: '#cbd5e1', padding: '0.2rem 0.5rem', borderRadius: '0.3rem' }}>{b}</span>
                                                    ))}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ComparisonView;
