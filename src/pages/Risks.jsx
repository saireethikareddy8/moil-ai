import React, { useState } from 'react';
import {
    AlertTriangle, CheckCircle, Clock, TrendingDown,
    CloudRain, Wrench, Package, ShieldAlert, Filter, Search
} from 'lucide-react';

const RISK_CATEGORIES = [
    { label: 'Production Shortfall Risk', icon: TrendingDown, level: 'HIGH', prob: '72%', color: 'var(--danger)', desc: '3 contributing factors active' },
    { label: 'Equipment Risk', icon: Wrench, level: 'CRITICAL', prob: '88%', color: '#7c3aed', desc: 'EX-04 breakdown imminent' },
    { label: 'Weather Risk', icon: CloudRain, level: 'MEDIUM', prob: '54%', color: 'var(--warning)', desc: 'Heavy rain forecasted D+2' },
    { label: 'Ore Availability Risk', icon: Package, level: 'LOW', prob: '28%', color: 'var(--success)', desc: 'Stockpile at adequate levels' },
];

const LEVEL_COLOR = { LOW: 'var(--success)', MEDIUM: 'var(--warning)', HIGH: 'var(--danger)', CRITICAL: '#7c3aed' };
const LEVEL_BG = { LOW: 'rgba(16,185,129,0.1)', MEDIUM: 'rgba(245,158,11,0.1)', HIGH: 'rgba(239,68,68,0.1)', CRITICAL: 'rgba(124,58,237,0.1)' };

const INITIAL_ALERTS = [
    { id: 'ALT-001', ts: '2026-09-03 10:42', mine: 'Balaghat Mine', block: 'Block B', riskType: 'Equipment', level: 'CRITICAL', prob: '88%', cause: 'Excavator EX-04 vibration anomaly — overdue maintenance', action: 'Dispatch maintenance team immediately. Re-deploy EX-01 to Block B.', status: 'Open' },
    { id: 'ALT-002', ts: '2026-09-03 09:15', mine: 'Dongri Buzurg Mine', block: 'Block C', riskType: 'Weather', level: 'MEDIUM', prob: '54%', cause: 'Heavy rainfall forecast (>45mm/day) over next 48 hours', action: 'Halt open-pit blasting. Pre-position drainage pumps.', status: 'Acknowledged' },
    { id: 'ALT-003', ts: '2026-09-03 08:00', mine: 'Balaghat Mine', block: 'Block B', riskType: 'Production Shortfall', level: 'HIGH', prob: '72%', cause: 'Excavator downtime + rainfall risk + blasting delay', action: 'Re-deploy available excavator and advance blasting schedule by 1 day.', status: 'Open' },
    { id: 'ALT-004', ts: '2026-09-02 15:30', mine: 'Tirodi Mine', block: 'Block D', riskType: 'Ore Availability', level: 'LOW', prob: '28%', cause: 'Stockpile consumption rate slightly above average', action: 'Monitor daily. No immediate action required.', status: 'Resolved' },
    { id: 'ALT-005', ts: '2026-09-02 11:20', mine: 'Chikla Mine', block: 'Block A', riskType: 'Equipment', level: 'HIGH', prob: '79%', cause: 'Dump truck DT-12 engine temperature trending upward', action: 'Schedule preventive service within 3 operating days.', status: 'Acknowledged' },
    { id: 'ALT-006', ts: '2026-09-01 14:00', mine: 'Balaghat Mine', block: 'Block C', riskType: 'Production Shortfall', level: 'MEDIUM', prob: '48%', cause: 'Ore grade variance detected — Mn% below blend target', action: 'Adjust crusher blend ratio. Prioritize Block C-07 extraction.', status: 'Resolved' },
    { id: 'ALT-007', ts: '2026-09-01 09:05', mine: 'Dongri Buzurg Mine', block: 'Block E', riskType: 'Weather', level: 'LOW', prob: '22%', cause: 'Light rainfall forecast. Low operational impact expected.', action: 'Continue operations with standard precautions.', status: 'Resolved' },
    { id: 'ALT-008', ts: '2026-08-31 16:45', mine: 'Tirodi Mine', block: 'Block B', riskType: 'Ore Availability', level: 'HIGH', prob: '68%', cause: 'Zone depletion model indicates Block B ore body thinning', action: 'Initiate exploratory drilling in adjacent Block B-East.', status: 'Open' },
];

const MINES = ['All Mines', 'Balaghat Mine', 'Dongri Buzurg Mine', 'Tirodi Mine', 'Chikla Mine'];
const RISK_TYPES = ['All Types', 'Production Shortfall', 'Equipment', 'Weather', 'Ore Availability'];
const LEVELS = ['All Levels', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const STATUSES = ['All Status', 'Open', 'Acknowledged', 'Resolved'];

const Risks = () => {
    const [alerts, setAlerts] = useState(INITIAL_ALERTS);
    const [search, setSearch] = useState('');
    const [filterMine, setFilterMine] = useState('All Mines');
    const [filterType, setFilterType] = useState('All Types');
    const [filterLevel, setFilterLevel] = useState('All Levels');
    const [filterStatus, setFilterStatus] = useState('All Status');

    const updateStatus = (id, newStatus) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    };

    const filtered = alerts.filter(a => {
        const matchSearch = a.id.includes(search) || a.mine.toLowerCase().includes(search.toLowerCase()) ||
            a.cause.toLowerCase().includes(search.toLowerCase());
        const matchMine = filterMine === 'All Mines' || a.mine === filterMine;
        const matchType = filterType === 'All Types' || a.riskType === filterType;
        const matchLevel = filterLevel === 'All Levels' || a.level === filterLevel;
        const matchStatus = filterStatus === 'All Status' || a.status === filterStatus;
        return matchSearch && matchMine && matchType && matchLevel && matchStatus;
    });

    const openCount = alerts.filter(a => a.status === 'Open').length;
    const ackCount = alerts.filter(a => a.status === 'Acknowledged').length;
    const resCount = alerts.filter(a => a.status === 'Resolved').length;
    const critCount = alerts.filter(a => a.level === 'CRITICAL' && a.status !== 'Resolved').length;

    return (
        <div className="dashboard-container" style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Risk &amp; Alerts</h2>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>Operational risk monitoring across all mines and production areas.</p>
                </div>
                {critCount > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', backgroundColor: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px' }}>
                        <ShieldAlert size={20} style={{ color: '#7c3aed' }} />
                        <span style={{ fontWeight: 700, color: '#7c3aed' }}>{critCount} Critical Alert{critCount > 1 ? 's' : ''} — Immediate Attention Required</span>
                    </div>
                )}
            </div>

            {/* Risk Category Cards */}
            <div className="grid-container" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
                {RISK_CATEGORIES.map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                        <div key={i} className="card" style={{ borderTop: `4px solid ${cat.color}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <Icon size={22} style={{ color: cat.color }} />
                                <span className="badge" style={{ backgroundColor: LEVEL_BG[cat.level], color: LEVEL_COLOR[cat.level], fontWeight: 800, fontSize: '0.75rem', padding: '3px 10px' }}>
                                    {cat.level}
                                </span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '4px', color: 'var(--text-main)' }}>{cat.label}</div>
                            <div style={{ fontSize: '2rem', fontWeight: 900, color: cat.color, marginBottom: '4px' }}>{cat.prob}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{cat.desc}</div>
                        </div>
                    );
                })}
            </div>

            {/* Open/Ack/Resolved summary strip */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Open', value: openCount, color: 'var(--danger)', icon: AlertTriangle },
                    { label: 'Acknowledged', value: ackCount, color: 'var(--warning)', icon: Clock },
                    { label: 'Resolved', value: resCount, color: 'var(--success)', icon: CheckCircle },
                ].map(item => {
                    const Icon = item.icon;
                    return (
                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', backgroundColor: '#fff', border: '1px solid var(--border)', borderRadius: '8px', flex: 1, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                            onClick={() => setFilterStatus(item.label)}>
                            <Icon size={20} style={{ color: item.color }} />
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.label}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: item.color }}>{item.value}</div>
                            </div>
                        </div>
                    );
                })}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', backgroundColor: '#fff', border: '1px solid var(--border)', borderRadius: '8px', flex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
                    <ShieldAlert size={20} style={{ color: '#7c3aed' }} />
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Critical (Active)</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7c3aed' }}>{critCount}</div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 12px' }}>
                        <Search size={16} className="text-muted" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search alerts..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.875rem', flex: 1 }} />
                    </div>
                    {[
                        { label: 'Mine', value: filterMine, setter: setFilterMine, options: MINES },
                        { label: 'Risk Type', value: filterType, setter: setFilterType, options: RISK_TYPES },
                        { label: 'Risk Level', value: filterLevel, setter: setFilterLevel, options: LEVELS },
                        { label: 'Status', value: filterStatus, setter: setFilterStatus, options: STATUSES },
                    ].map(f => (
                        <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{f.label}</label>
                            <select value={f.value} onChange={e => f.setter(e.target.value)}
                                style={{ padding: '7px 10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.8125rem', backgroundColor: '#fff', outline: 'none', minWidth: '140px' }}>
                                {f.options.map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                    ))}
                    <button className="btn" onClick={() => { setSearch(''); setFilterMine('All Mines'); setFilterType('All Types'); setFilterLevel('All Levels'); setFilterStatus('All Status'); }}
                        style={{ backgroundColor: '#f1f5f9', border: '1px solid var(--border)', padding: '7px 14px', marginBottom: '0px' }}>
                        <Filter size={16} /> Reset
                    </button>
                </div>
            </div>

            {/* Alerts Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Alert Log</h3>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>{filtered.length} alert{filtered.length !== 1 ? 's' : ''} shown</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc' }}>
                                {['Alert ID', 'Timestamp', 'Mine', 'Block', 'Risk Type', 'Level', 'Prob.', 'Cause', 'Recommended Action', 'Status', 'Actions'].map(col => (
                                    <th key={col} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(alert => (
                                <tr key={alert.id} style={{ borderBottom: '1px solid var(--border)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '12px', fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{alert.id}</td>
                                    <td style={{ padding: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{alert.ts}</td>
                                    <td style={{ padding: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{alert.mine}</td>
                                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{alert.block}</td>
                                    <td style={{ padding: '12px', whiteSpace: 'nowrap', fontWeight: 600 }}>{alert.riskType}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span className="badge" style={{ backgroundColor: LEVEL_BG[alert.level], color: LEVEL_COLOR[alert.level], fontWeight: 800, whiteSpace: 'nowrap' }}>
                                            {alert.level}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', fontWeight: 700, color: alert.level === 'CRITICAL' ? '#7c3aed' : alert.level === 'HIGH' ? 'var(--danger)' : 'var(--text-main)' }}>{alert.prob}</td>
                                    <td style={{ padding: '12px', maxWidth: '220px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{alert.cause}</td>
                                    <td style={{ padding: '12px', maxWidth: '220px', color: 'var(--primary)', fontWeight: 600, lineHeight: '1.4' }}>{alert.action}</td>
                                    <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '12px',
                                            backgroundColor: alert.status === 'Resolved' ? 'rgba(16,185,129,0.1)' : alert.status === 'Acknowledged' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: alert.status === 'Resolved' ? 'var(--success)' : alert.status === 'Acknowledged' ? 'var(--warning)' : 'var(--danger)',
                                            fontWeight: 700, fontSize: '0.75rem'
                                        }}>
                                            {alert.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            {alert.status === 'Open' && (
                                                <button onClick={() => updateStatus(alert.id, 'Acknowledged')} className="btn"
                                                    style={{ padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700, backgroundColor: 'rgba(245,158,11,0.1)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.3)' }}>
                                                    Acknowledge
                                                </button>
                                            )}
                                            {alert.status !== 'Resolved' && (
                                                <button onClick={() => updateStatus(alert.id, 'Resolved')} className="btn"
                                                    style={{ padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700, backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.3)' }}>
                                                    Resolve
                                                </button>
                                            )}
                                            {alert.status === 'Resolved' && (
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Closed</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={11} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No alerts match the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Risks;
