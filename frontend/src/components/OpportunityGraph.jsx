import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import * as d3 from 'd3';

const OpportunityGraph = ({ user, jobs, onNodeClick }) => {
    const fgRef = useRef();
    const [tooltipContent, setTooltipContent] = useState(null);

    // Prepare graph data
    const nodes = [
        { id: 'user', val: 40, color: '#818cf8', name: 'You', type: 'user', fx: 0, fy: 0 },
        ...jobs.map(job => ({
            id: job.job.id,
            // Size logic: Base size 15 + growth/salary factor
            val: 15 + (job.job.growth_score || 5) * 3,
            color: job.match_score > 80 ? '#22c55e' : job.match_score > 50 ? '#eab308' : '#ef4444',
            name: job.title,
            ...job
        }))
    ];

    const links = jobs.map(job => ({
        source: 'user',
        target: job.job.id,
        color: 'rgba(71, 85, 105, 0.2)', // Faint lines
        width: 1
    }));

    const graphData = { nodes, links };

    useEffect(() => {
        if (fgRef.current) {
            const fg = fgRef.current;

            // Custom Forces for Orbit Layout
            fg.d3Force('charge', d3.forceManyBody().strength(-100)); // Repel slightly
            fg.d3Force('link', d3.forceLink().id(d => d.id).distance(200).strength(0)); // Disable standard link force distance
            fg.d3Force('center', null); // Disable centering force on all nodes (we fix user at 0,0)

            // Radial Force: Position nodes based on match score
            fg.d3Force('radial', d3.forceRadial(node => {
                if (node.id === 'user') return 0;
                if (node.match_score > 80) return 150; // Orbit 1
                if (node.match_score > 50) return 250; // Orbit 2
                return 350; // Orbit 3
            }, 0, 0).strength(0.8));

            // Collision Force to prevent overlap (Rectangular approximation)
            // Card width ~120, height ~60 -> radius approx 70
            fg.d3Force('collide', d3.forceCollide().radius(node => {
                if (node.id === 'user') return 50;
                return 80; // Ensure enough space for 120px wide cards
            }).strength(1).iterations(2));

            // Re-heat simulation
            fg.d3ReheatSimulation();
        }
    }, [jobs]); // Re-run when jobs change

    const drawNode = (node, ctx, globalScale) => {
        const label = node.name || node.job.title;
        const fontSize = 12 / globalScale;

        if (node.id === 'user') {
            const radius = Math.max(12, 20 / globalScale); // Constant size relative to view

            // Outer Glow
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius + 5, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
            ctx.fill();

            // Inner Circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();

            // Label
            ctx.font = `600 ${fontSize * 1.5}px Inter, sans - serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            ctx.fillText("You", node.x, node.y);
        } else {
            // Job Node: Detailed Card
            const width = 120; // Increased width
            const height = 60; // Increased height

            // Dynamic Background based on Match Score (Subtle Tint)
            const bgColor = node.match_score > 80 ? '#0f172a' : '#1e293b';
            const borderColor = node.color; // Match Score Color

            // Card Shape
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(node.x - width / 2, node.y - height / 2, width, height, 8);
            } else {
                ctx.rect(node.x - width / 2, node.y - height / 2, width, height);
            }
            ctx.fillStyle = bgColor;
            ctx.fill();

            // Border
            ctx.lineWidth = node.match_score > 80 ? 2 : 1; // Thicker border for top matches
            ctx.strokeStyle = borderColor;
            ctx.stroke();

            // Title (Centered, larger)
            ctx.font = `600 ${fontSize * 1.2}px Inter, sans - serif`;
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Word Wrap logic
            const maxTextWidth = width - 10;
            // Simple truncation
            let text = label;
            if (label.length > 15) {
                text = label.substring(0, 15) + '...';
            }
            ctx.fillText(text, node.x, node.y - height / 6);

            // Subtitle: Salary & Risk (Small)
            ctx.font = `400 ${fontSize * 0.9}px Inter, sans - serif`;
            ctx.fillStyle = '#94a3b8'; // text-muted
            ctx.fillText(`${node.job.salary} `, node.x, node.y + height / 6 + 2); // Moved down slightly

            // Match Score Pill (Top Right)
            const pillWidth = 30;
            const pillHeight = 12;
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(node.x + width / 2 - pillWidth - 4, node.y - height / 2 + 4, pillWidth, pillHeight, 4);
            } else {
                ctx.rect(node.x + width / 2 - pillWidth - 4, node.y - height / 2 + 4, pillWidth, pillHeight);
            }
            ctx.fillStyle = borderColor;
            ctx.fill();

            ctx.fillStyle = 'black'; // text-on-color
            ctx.font = `bold ${fontSize * 0.7}px Inter`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${Math.round(node.match_score)}% `, node.x + width / 2 - pillWidth / 2 - 4, node.y - height / 2 + 4 + pillHeight / 2);
        }
    };

    return (
        <div style={{ borderRadius: '1rem', overflow: 'hidden', height: '100%', border: '1px solid var(--border)', position: 'relative' }}>
            <ForceGraph2D
                ref={fgRef}
                graphData={graphData}
                nodeLabel={node => {
                    if (node.id === 'user') return 'Your Profile';
                    return `${node.job.title} \nMatch: ${node.match_score}%\nSalary: ${node.job.salary} \nRisk: ${node.job.risk_level} `;
                }}
                nodeCanvasObject={drawNode}
                nodePointerAreaPaint={(node, color, ctx) => {
                    ctx.fillStyle = color;
                    if (node.id === 'user') {
                        const radius = Math.sqrt(node.val) * 2;
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
                        ctx.fill();
                    } else {
                        const width = 60;
                        const height = 30;
                        ctx.beginPath();
                        ctx.rect(node.x - width / 2, node.y - height / 2, width, height);
                        ctx.fill();
                    }
                }}
                linkColor="color"
                linkWidth={link => link.width}
                onNodeClick={onNodeClick}
                width={800}
                height={500}
                backgroundColor="#0f172a"
                d3VelocityDecay={0.3}
                cooldownTicks={100}
                onEngineStop={() => fgRef.current.zoomToFit(400)}
            />
            {/* Legend Overlay */}
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(15, 23, 42, 0.8)', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }}></span> Strong Match (80%+)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }}></span> Moderate (50-79%)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}></span> Weak Match (&lt;50%)</div>
            </div>
        </div>
    );
};

export default OpportunityGraph;
