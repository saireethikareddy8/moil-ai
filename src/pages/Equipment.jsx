import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, RadialBarChart, RadialBar, PieChart, Pie, Legend
} from 'recharts';
import { Wrench, AlertTriangle, CheckCircle, Clock, Cpu, Filter, Search } from 'lucide-react';

const EQUIPMENT = [
    { id: 'EX-01', type: 'Excavator', status: 'Operational', availability: 94, hours: 1820, downtime: 6, maintenance: 'Scheduled', block: 'Block A' },
    { id: 'EX-02', type: 'Excavator', status: 'Maintenance', availability: 71, hours: 2340, downtime: 42, maintenance: 'In Progress', block: 'Block B' },
    { id: 'EX-03', type: 'Excavator', status: 'Operational', availability: 88, hours: 1650, downtime: 14, maintenance: 'OK', block: 'Block C' },
    { id: 'EX-04', type: 'Excavator', status: 'Breakdown', availability: 55, hours: 3100, downtime: 78, maintenance: 'Overdue', block: 'Block B' },
    { id: 'DT-10', type: 'Dump Truck', status: 'Operational', availability: 92, hours: 2200, downtime: 10, maintenance: 'Scheduled', block: 'Block A' },
    { id: 'DT-11', type: 'Dump Truck', status: 'Operational', availability: 96, hours: 1900, downtime: 5, maintenance: 'OK', block: 'Block D' },
    { id: 'DT-12', type: 'Dump Truck', status: 'Idle', availability: 80, hours: 2800, downtime: 22, maintenance: 'Recommended', block: 'Block C' },
    { id: 'DR-05', type: 'Drilling Machine', status: 'Operational', availability: 90, hours: 1400, downtime: 8, maintenance: 'OK', block: 'Block E' },
    { id: 'DR-06', type: 'Drilling Machine', status: 'Maintenance', availability: 65, hours: 2600, downtime: 55, maintenance: 'In Progress', block: 'Block A' },
    { id: 'LD-03', type: 'Loader', status: 'Operational', availability: 97, hours: 1100, downtime: 3, maintenance: 'OK', block: 'Block D' },
    { id: 'LD-04', type: 'Loader', status: 'Idle', availability: 78, hours: 1750, downtime: 18, maintenance: 'Scheduled', block: 'Block B' },
    { id: 'CR-02', type: 'Crusher', status: 'Operational', availability: 91, hours: 3200, downtime: 12, maintenance: 'Scheduled', block: 'Crusher Plant' },
];

const AVAIL_BY_TYPE = [
    { type: 'Excavator', availability: 77 },
    { type: 'Dump Truck', availability: 89 },
    { type: 'Drilling', availability: 78 },
    { type: 'Loader', availability: 88 },
    { type: 'Crusher', availability: 91 },
];

const AI_ALERTS = [
    { id: 'EX-04', type: 'Excavator', severity: 'critical', msg: 'Increased downtime probability detected. Vibration pattern anomaly exceeds threshold.', eta: '< 24 hrs', action: 'Dispatch maintenance team immediately.' },
    { id: 'DT-12', type: 'Dump Truck', severity: 'warning', msg: 'Maintenance recommended within 3 operating days. Engine temperature trending upward.', eta: '~3 days', action: 'Schedule preventive service.' },
    { id: 'DR-06', type: 'Drilling', severity: 'warning', msg: 'Drill bit wear indicator approaching critical threshold based on operating hours model.', eta: '~5 days', action: 'Pre-order replacement bit.' },
    { id: 'EX-02', type: 'Excavator', severity: 'info', msg: 'Current maintenance on track. Estimated return-to-service in 8 hours.', eta: '8 hrs', action: 'No action required.' },
];

const STATUS_COLOR = {
    Operational: 'var(--success)',
    Maintenance: 'var(--warning)',
    Breakdown: 'var(--danger)',
    Idle: '#94a3b8',
};

const Equipment = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const total = EQUIPMENT.length;
    const operational = EQUIPMENT.filter(e => e.status === 'Operational').length;
    const maintenance = EQUIPMENT.filter(e => e.status === 'Maintenance').length;
    const highRisk = EQUIPMENT.filter(e => e.availability < 70).length;

    const pieData = [
        { name: 'Operational', value: operational, fill: 'var(--success)' },
        { name: 'Maintenance', value: maintenance, fill: 'var(--warning)' },
        { name: 'Breakdown', value: EQUIPMENT.filter(e => e.status === 'Breakdown').length, fill: 'var(--danger)' },
        { name: 'Idle', value: EQUIPMENT.filter(e => e.status === 'Idle').length, fill: '#94a3b8' },
    ];

    const filtered = EQUIPMENT.filter(e => {
        const matchSearch = e.id.toLowerCase().includes(search.toLowerCase()) ||
            e.type.toLowerCase().includes(search.toLowerCase()) ||
            e.block.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || e.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="dashboard-container" style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Equipment Monitoring</h2>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>Real-time fleet status and AI-simulated predictive maintenance alerts.</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', background: '#f1f5f9', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    🧪 Demo Predictions – ML API not yet connected
                </span>
            </div>

            {/* KPI Cards */}
            <div className="grid-container" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
                {[
                    { label: 'Total Equipment', value: total, color: 'var(--primary)', icon: Cpu },
                    { label: 'Operational', value: operational, color: 'var(--success)', icon: CheckCircle },
                    { label: 'Under Maintenance', value: maintenance, color: 'var(--warning)', icon: Wrench },
                    { label: 'High Breakdown Risk', value: highRisk, color: 'var(--danger)', icon: AlertTriangle, highlight: true },
                ].map((kpi, i) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={i} className="card" style={{ borderLeft: kpi.highlight ? `4px solid ${kpi.color}` : undefined }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{kpi.label}</div>
                                <Icon size={18} style={{ color: kpi.color }} />
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: kpi.color, margin: '8px 0' }}>{kpi.value}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Availability by Type */}
                <div className="card">
                    <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700 }}>Availability by Equipment Type (%)</h3>
                    <div style={{ height: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={AVAIL_BY_TYPE} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: '0.75rem' }} />
                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: '0.75rem' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} formatter={v => [`${v}%`, 'Availability']} />
                                <Bar dataKey="availability" name="Availability %" radius={[4, 4, 0, 0]} barSize={36}>
                                    {AVAIL_BY_TYPE.map((entry, index) => (
                                        <Cell key={index} fill={entry.availability >= 90 ? 'var(--success)' : entry.availability >= 75 ? 'var(--warning)' : 'var(--danger)'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Breakdown Pie */}
                <div className="card">
                    <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700 }}>Fleet Status Breakdown</h3>
                    <div style={{ height: '220px', display: 'flex', alignItems: 'center' }}>
                        <ResponsiveContainer width="50%" height="100%">
                            <PieChart>
                                <Pie data={pieData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                                    {pieData.map((entry, index) => (
                                        <Cell key={index} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ width: '50%', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {pieData.map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.fill }} />
                                        <span style={{ color: 'var(--text-muted)' }}>{item.name}</span>
                                    </div>
                                    <span>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Predictive Maintenance Alerts */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={18} style={{ color: 'var(--primary)' }} /> AI Predictive Maintenance Alerts
                    <span style={{ marginLeft: '8px', fontSize: '0.7rem', fontStyle: 'italic', color: 'var(--text-muted)', fontWeight: 400, backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        Simulated — for demonstration only
                    </span>
                </h3>
                <div className="grid-container" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    {AI_ALERTS.map(alert => {
                        const borderColor = alert.severity === 'critical' ? 'var(--danger)' : alert.severity === 'warning' ? 'var(--warning)' : 'var(--info)';
                        const bgColor = alert.severity === 'critical' ? 'rgba(239,68,68,0.05)' : alert.severity === 'warning' ? 'rgba(245,158,11,0.05)' : 'rgba(59,130,246,0.05)';
                        return (
                            <div key={alert.id} style={{ padding: '1.25rem', backgroundColor: bgColor, borderRadius: '8px', borderLeft: `4px solid ${borderColor}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div>
                                        <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{alert.id}</span>
                                        <span style={{ marginLeft: '10px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{alert.type}</span>
                                    </div>
                                    <span className="badge" style={{ backgroundColor: alert.severity === 'critical' ? 'rgba(239,68,68,0.12)' : alert.severity === 'warning' ? 'rgba(245,158,11,0.12)' : 'rgba(59,130,246,0.12)', color: borderColor, textTransform: 'uppercase' }}>
                                        {alert.severity}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 10px', lineHeight: '1.5' }}>{alert.msg}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                                        <Clock size={14} /> Risk ETA: {alert.eta}
                                    </div>
                                    <div style={{ color: 'var(--primary)' }}>→ {alert.action}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Equipment Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Equipment Fleet</h3>
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 12px' }}>
                        <Search size={16} className="text-muted" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID, type or block…"
                            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.875rem', width: '200px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {['All', 'Operational', 'Maintenance', 'Breakdown', 'Idle'].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)} className="btn"
                                style={{
                                    padding: '5px 12px', fontSize: '0.75rem', fontWeight: 600,
                                    backgroundColor: statusFilter === s ? 'var(--primary)' : '#f1f5f9',
                                    color: statusFilter === s ? '#fff' : 'var(--text-main)',
                                    border: `1px solid ${statusFilter === s ? 'var(--primary)' : 'var(--border)'}`
                                }}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc' }}>
                                {['Equipment ID', 'Type', 'Status', 'Availability', 'Op. Hours', 'Downtime (h)', 'Maintenance', 'Block'].map(col => (
                                    <th key={col} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(eq => (
                                <tr key={eq.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--primary)' }}>{eq.id}</td>
                                    <td style={{ padding: '10px 14px' }}>{eq.type}</td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <span className="badge" style={{ backgroundColor: `${STATUS_COLOR[eq.status]}20`, color: STATUS_COLOR[eq.status] }}>
                                            {eq.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', width: '60px' }}>
                                                <div style={{ height: '100%', width: `${eq.availability}%`, backgroundColor: eq.availability >= 90 ? 'var(--success)' : eq.availability >= 75 ? 'var(--warning)' : 'var(--danger)', borderRadius: '3px' }} />
                                            </div>
                                            <span style={{ fontWeight: 700, color: eq.availability >= 90 ? 'var(--success)' : eq.availability >= 75 ? 'var(--warning)' : 'var(--danger)' }}>{eq.availability}%</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{eq.hours.toLocaleString()} h</td>
                                    <td style={{ padding: '10px 14px', color: eq.downtime > 40 ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 600 }}>{eq.downtime} h</td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <span style={{ color: eq.maintenance === 'Overdue' ? 'var(--danger)' : eq.maintenance === 'Recommended' ? 'var(--warning)' : 'var(--text-muted)', fontWeight: 600 }}>
                                            {eq.maintenance}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{eq.block}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Equipment;
