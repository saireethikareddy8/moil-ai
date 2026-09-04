import React, { useState } from 'react';
import { BrainCircuit, CheckCircle, XCircle, PlayCircle, AlertTriangle, TrendingUp, Wrench, Package, Zap, Truck, BarChart2, Target } from 'lucide-react';

const INITIAL_RECS = [
    {
        id: 'REC-001', priority: 'HIGH', confidence: 94,
        problem: 'Expected production shortfall of 6,800 tonnes this month.',
        cause: 'Excavator EX-04 operational downtime (78h MTD). Primary loading unit unavailable.',
        action: 'Re-deploy Excavator EX-07 from Block A to Block B immediately.',
        improvement: '+2,500 tonnes expected recovery this month.',
        block: 'Block B – Balaghat Mine',
        icon: Wrench, status: 'Pending',
    },
    {
        id: 'REC-002', priority: 'HIGH', confidence: 89,
        problem: 'Blasting schedule delayed by weather risk — up to 72-hour window lost.',
        cause: 'Heavy rainfall forecast Day+2 (>45mm/day). Current schedule does not account for weather window.',
        action: 'Advance blasting operation by 1 day in Block C to capitalise on the available dry window.',
        improvement: 'Avoid 1,800 tonne delay. Maintain on-schedule extraction.',
        block: 'Block C – Balaghat Mine',
        icon: Zap, status: 'Pending',
    },
    {
        id: 'REC-003', priority: 'HIGH', confidence: 86,
        problem: 'Current extraction focused on low-grade ore zones. Monthly blend below target.',
        cause: 'Geological model indicates Block D-07 has 49.2% Mn grade. Not currently prioritised.',
        action: 'Prioritise extraction in high-prospectivity Block D-07 over Block B-East (lower grade).',
        improvement: 'Mn blend improves by +3.1%. Reduces ore processing costs.',
        block: 'Block D – Tirodi Mine',
        icon: Target, status: 'Pending',
    },
    {
        id: 'REC-004', priority: 'MEDIUM', confidence: 79,
        problem: 'Stockpile buffer at 8,400 MT — below recommended 12,000 MT safety threshold.',
        cause: 'Transport disruptions probabillity is 54% based on weather and route condition models.',
        action: 'Increase ore stockpile by 3,600 MT ahead of expected transport disruptions.',
        improvement: 'De-risks supply chain. Ensures dispatch continuity for 4–5 additional days.',
        block: 'Crusher Plant – Balaghat',
        icon: Package, status: 'Pending',
    },
    {
        id: 'REC-005', priority: 'MEDIUM', confidence: 88,
        problem: 'Dump trucks DT-12 and DT-11 underutilised in Block C during shift 2.',
        cause: 'Route optimisation model detects 18% idle time on Block C–Crusher haul road.',
        action: 'Reallocate DT-12 and DT-11 to Block B ore haulage during shift 2.',
        improvement: 'Fleet productivity +14%. Estimated extra 300 MT / shift.',
        block: 'Block C / Block B – Balaghat',
        icon: Truck, status: 'Pending',
    },
    {
        id: 'REC-006', priority: 'MEDIUM', confidence: 76,
        problem: 'Drilling machine DR-06 bit wear approaching critical threshold.',
        cause: 'Operating hours model indicates 91% probability of failure within 5 days.',
        action: 'Schedule preventive maintenance for DR-06. Pre-order replacement drill bit.',
        improvement: 'Prevents 40h unplanned downtime. Saves approx. ₹4.2L in emergency repair costs.',
        block: 'Block A – Chikla Mine',
        icon: Wrench, status: 'Pending',
    },
    {
        id: 'REC-007', priority: 'LOW', confidence: 71,
        problem: 'Extraction sequence in Block E does not follow highest-grade-first protocol.',
        cause: 'Grade interpolation model updated — south zone E-07 has higher Mn density than currently being mined.',
        action: 'Adjust extraction sequence in Block E. Start south zone (E-07) before north zone (E-02).',
        improvement: 'Grade uplift of ~1.5%. Reduces processing time per tonne.',
        block: 'Block E – Dongri Buzurg Mine',
        icon: BarChart2, status: 'Pending',
    },
];

const PRIORITY_COLOR = { HIGH: 'var(--danger)', MEDIUM: 'var(--warning)', LOW: 'var(--success)' };
const PRIORITY_BG = { HIGH: 'rgba(239,68,68,0.08)', MEDIUM: 'rgba(245,158,11,0.08)', LOW: 'rgba(16,185,129,0.08)' };
const STATUS_COLOR = { Pending: 'var(--text-muted)', Accepted: 'var(--success)', Rejected: 'var(--danger)', Simulating: '#3b82f6' };

const AIRecommendations = () => {
    const [recs, setRecs] = useState(INITIAL_RECS);
    const [filterPriority, setFilterPriority] = useState('All');

    const updateStatus = (id, status) => {
        setRecs(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    };

    const accepted = recs.filter(r => r.status === 'Accepted');
    const pending = recs.filter(r => r.status === 'Pending' || r.status === 'Simulating');
    const showRecs = filterPriority === 'All' ? pending : pending.filter(r => r.priority === filterPriority);

    return (
        <div className="dashboard-container" style={{ paddingBottom: '2rem' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <BrainCircuit size={28} style={{ color: 'var(--primary)' }} /> AI Recommendation Engine
                    </h2>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>Predicted risks transformed into ranked operational directives.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', backgroundColor: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '8px' }}>
                    <AlertTriangle size={18} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)' }}>
                        AI-generated decision support — human approval required before implementation.
                    </span>
                </div>
            </div>

            {/* Summary Strip */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {[
                    { label: 'Total Recommendations', value: recs.length, color: 'var(--primary)' },
                    { label: 'Pending Review', value: recs.filter(r => r.status === 'Pending').length, color: 'var(--text-muted)' },
                    { label: 'Accepted', value: accepted.length, color: 'var(--success)' },
                    { label: 'Rejected', value: recs.filter(r => r.status === 'Rejected').length, color: 'var(--danger)' },
                ].map(s => (
                    <div key={s.label} style={{ flex: 1, minWidth: '150px', padding: '1rem', backgroundColor: '#fff', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                    </div>
                ))}
                {/* Filter tabs */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginLeft: 'auto' }}>
                    {['All', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                        <button key={p} onClick={() => setFilterPriority(p)} className="btn"
                            style={{
                                padding: '7px 14px', fontSize: '0.8rem', fontWeight: 700,
                                backgroundColor: filterPriority === p ? 'var(--primary)' : '#f1f5f9',
                                color: filterPriority === p ? '#fff' : 'var(--text-main)',
                                border: `1px solid ${filterPriority === p ? 'var(--primary)' : 'var(--border)'}`
                            }}>
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recommendation Cards */}
            {showRecs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <BrainCircuit size={48} style={{ opacity: 0.15, marginBottom: '1rem' }} />
                    <p>No pending recommendations in this category.</p>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {showRecs.map(rec => {
                    const Icon = rec.icon;
                    const isSim = rec.status === 'Simulating';
                    return (
                        <div key={rec.id} className="card" style={{ borderLeft: `5px solid ${PRIORITY_COLOR[rec.priority]}`, padding: '1.5rem', position: 'relative' }}>
                            {isSim && (
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', padding: '3px 10px', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.25)' }}>
                                    ⏳ Simulating…
                                </div>
                            )}

                            {/* Card Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: 40, height: 40, backgroundColor: PRIORITY_BG[rec.priority], borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon size={20} style={{ color: PRIORITY_COLOR[rec.priority] }} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{rec.id}</span>
                                            <span className="badge" style={{ backgroundColor: PRIORITY_BG[rec.priority], color: PRIORITY_COLOR[rec.priority], fontWeight: 800 }}>{rec.priority} Priority</span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '10px' }}>
                                                {rec.confidence}% Confidence
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>📍 {rec.block}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Body Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                <div style={{ padding: '1rem', backgroundColor: 'rgba(239,68,68,0.04)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.12)' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--danger)', textTransform: 'uppercase', marginBottom: '6px' }}>⚠ Problem</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.5' }}>{rec.problem}</div>
                                </div>
                                <div style={{ padding: '1rem', backgroundColor: 'rgba(245,158,11,0.04)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.12)' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--warning)', textTransform: 'uppercase', marginBottom: '6px' }}>🔍 Root Cause</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.5' }}>{rec.cause}</div>
                                </div>
                                <div style={{ padding: '1rem', backgroundColor: 'rgba(59,130,246,0.05)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.15)' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '6px' }}>✅ AI Suggested Action</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.5' }}>{rec.action}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', backgroundColor: 'rgba(16,185,129,0.07)', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.2)' }}>
                                    <TrendingUp size={16} style={{ color: 'var(--success)' }} />
                                    <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.875rem' }}>Expected Improvement: {rec.improvement}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => updateStatus(rec.id, 'Simulating')} className="btn"
                                        style={{ padding: '8px 14px', fontSize: '0.8rem', fontWeight: 700, backgroundColor: 'rgba(59,130,246,0.08)', color: 'var(--primary)', border: '1px solid rgba(59,130,246,0.3)' }}>
                                        <PlayCircle size={15} /> Simulate First
                                    </button>
                                    <button onClick={() => updateStatus(rec.id, 'Rejected')} className="btn"
                                        style={{ padding: '8px 14px', fontSize: '0.8rem', fontWeight: 700, backgroundColor: 'rgba(239,68,68,0.08)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.25)' }}>
                                        <XCircle size={15} /> Reject
                                    </button>
                                    <button onClick={() => updateStatus(rec.id, 'Accepted')} className="btn btn-primary"
                                        style={{ padding: '8px 14px', fontSize: '0.8rem', fontWeight: 700 }}>
                                        <CheckCircle size={15} /> Accept
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action Plan */}
            {accepted.length > 0 && (
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={22} style={{ color: 'var(--success)' }} /> Approved Action Plan ({accepted.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {accepted.map((rec, i) => {
                            const Icon = rec.icon;
                            return (
                                <div key={rec.id} className="card" style={{ borderLeft: '4px solid var(--success)', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                                    <div style={{ width: 36, height: 36, backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={18} style={{ color: 'var(--success)' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                                            <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{rec.id}</span>
                                            <span className="badge" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--success)', fontWeight: 800 }}>Accepted</span>
                                        </div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>{rec.action}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>📈 {rec.improvement}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>📍 {rec.block}</div>
                                        <button onClick={() => updateStatus(rec.id, 'Pending')} className="btn"
                                            style={{ marginTop: '10px', padding: '4px 10px', fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                                            Undo
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIRecommendations;
