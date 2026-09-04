import React, { useState } from 'react';
import {
    ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import {
    AlertTriangle, TrendingDown, TrendingUp, Target, Activity,
    Wrench, CloudRain, Cpu, Zap, Package, CalendarDays
} from 'lucide-react';

const MINES = ['All Mines', 'Balaghat Mine', 'Dongri Buzurg Mine', 'Tirodi Mine', 'Chikla Mine'];
const AREAS = ['All Areas', 'Block A', 'Block B', 'Block C', 'Block D', 'Block E'];
const PERIODS = ['3 Months', '6 Months', '9 Months', '12 Months'];
const DATE_RANGES = ['Last 30 Days', 'Q3 2026', 'Q2 2026', 'Year to Date'];

const BASE_DATA = [
    { month: 'Apr', actual: 43200, predicted: 43500, target: 45000 },
    { month: 'May', actual: 44800, predicted: 44200, target: 45000 },
    { month: 'Jun', actual: 41500, predicted: 42000, target: 45000 },
    { month: 'Jul', actual: 39800, predicted: 40200, target: 45000 },
    { month: 'Aug', actual: 38200, predicted: 38900, target: 45000 },
    { month: 'Sep', actual: null, predicted: 38200, target: 45000 },
    { month: 'Oct', actual: null, predicted: 37500, target: 45000 },
    { month: 'Nov', actual: null, predicted: 39000, target: 45000 },
    { month: 'Dec', actual: null, predicted: 40500, target: 45000 },
];

const INPUT_FACTORS = [
    { label: 'Historical Production', value: '43,200 MT avg', trend: 'up', icon: Activity },
    { label: 'Equipment Availability', value: '91%', trend: 'up', icon: Wrench },
    { label: 'Equipment Downtime', value: '14 hrs / wk', trend: 'down', icon: Cpu },
    { label: 'Rainfall (7-day)', value: '42 mm', trend: 'down', icon: CloudRain },
    { label: 'Weather Forecast', value: 'Moderate Risk', trend: 'neutral', icon: CloudRain },
    { label: 'Blasting Delays', value: '3 events (MTD)', trend: 'down', icon: Zap },
    { label: 'Ore Availability', value: '76%', trend: 'up', icon: Package },
    { label: 'Stockpile Level', value: '8,400 MT', trend: 'up', icon: Package },
    { label: 'Maintenance Status', value: '2 Pending', trend: 'neutral', icon: Wrench },
];

const XAI_FACTORS = [
    { name: 'Equipment Downtime', value: 45, color: 'var(--danger)' },
    { name: 'Heavy Rainfall', value: 25, color: '#3b82f6' },
    { name: 'Blast Delay', value: 15, color: 'var(--warning)' },
    { name: 'Ore Availability', value: 10, color: '#8b5cf6' },
    { name: 'Other', value: 5, color: '#94a3b8' },
];

const Forecast = () => {
    const [mine, setMine] = useState('All Mines');
    const [area, setArea] = useState('All Areas');
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [period, setPeriod] = useState('6 Months');

    const chartData = period === '3 Months' ? BASE_DATA.slice(0, 7)
        : period === '9 Months' ? BASE_DATA
            : period === '12 Months' ? BASE_DATA
                : BASE_DATA.slice(0, 9);

    return (
        <div className="dashboard-container" style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>AI Production Forecast</h2>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>ML-driven prediction of manganese production outcome and shortfall probability.</p>
                </div>
                {/* Filters */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {[
                        { label: 'Mine', value: mine, setter: setMine, options: MINES },
                        { label: 'Area', value: area, setter: setArea, options: AREAS },
                        { label: 'Period', value: period, setter: setPeriod, options: PERIODS },
                        { label: 'Date', value: dateRange, setter: setDateRange, options: DATE_RANGES },
                    ].map(f => (
                        <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{f.label}</label>
                            <select value={f.value} onChange={e => f.setter(e.target.value)}
                                style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.8125rem', backgroundColor: '#fff', outline: 'none' }}>
                                {f.options.map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                    ))}
                    <button className="btn btn-primary" style={{ marginTop: '14px', padding: '6px 16px', fontSize: '0.8125rem' }}>
                        <CalendarDays size={16} /> Apply
                    </button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid-container" style={{ gridTemplateColumns: 'repeat(6, 1fr)', marginBottom: '2rem' }}>
                {[
                    { label: 'Current Production', value: '38,200 MT', sub: 'Month to Date', icon: Activity, color: 'var(--text-main)' },
                    { label: 'Monthly Target', value: '45,000 MT', sub: 'Production Goal', icon: Target, color: 'var(--primary)' },
                    { label: 'Predicted Production', value: '38,200 MT', sub: 'AI Forecast', icon: Cpu, color: 'var(--warning)' },
                    { label: 'Expected Shortfall', value: '6,800 MT', sub: 'Below Target', icon: TrendingDown, color: 'var(--danger)' },
                    { label: 'Shortfall Probability', value: '72%', sub: 'AI Confidence', icon: AlertTriangle, color: 'var(--warning)' },
                    { label: 'Risk Level', value: 'HIGH', sub: 'Action Required', icon: AlertTriangle, color: 'var(--danger)', highlight: true },
                ].map((kpi, i) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={i} className="card" style={{ borderLeft: kpi.highlight ? '4px solid var(--danger)' : undefined }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{kpi.label}</div>
                                <Icon size={16} style={{ color: kpi.color, flexShrink: 0 }} />
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: kpi.color, margin: '8px 0 4px' }}>{kpi.value}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{kpi.sub}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid-container" style={{ gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* 6-Month Forecast Chart */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title" style={{ margin: 0 }}>6-Month Production Forecast</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shaded area = AI predicted period</span>
                    </div>
                    <div style={{ height: '320px', marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -15, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: '0.75rem' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: '0.75rem' }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} formatter={(v, n) => [`${Number(v).toLocaleString()} MT`, n]} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '12px', fontSize: '0.8125rem' }} />
                                <ReferenceLine y={45000} stroke="rgba(16,185,129,0.4)" strokeDasharray="4 4" />
                                <Bar dataKey="actual" name="Actual Production" fill="rgba(59, 130, 246, 0.35)" radius={[4, 4, 0, 0]} barSize={22} />
                                <Line type="monotone" dataKey="predicted" name="AI Predicted" stroke="var(--warning)" strokeWidth={3} dot={{ r: 5, fill: 'var(--warning)', strokeWidth: 2, stroke: '#fff' }} strokeDasharray="6 3" />
                                <Line type="monotone" dataKey="target" name="Target Production" stroke="var(--success)" strokeWidth={2.5} dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Shortfall Prediction Card */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                        Shortfall Prediction
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {[
                            { label: 'Target', value: '45,000', unit: 'tonnes', color: 'var(--success)' },
                            { label: 'AI Prediction', value: '38,200', unit: 'tonnes', color: 'var(--warning)' },
                            { label: 'Expected Shortfall', value: '6,800', unit: 'tonnes', color: 'var(--danger)' },
                            { label: 'Probability', value: '72%', unit: 'confidence', color: 'var(--warning)' },
                        ].map((item, i) => (
                            <div key={i} style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>{item.label}</div>
                                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: item.color }}>{item.value}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.unit}</div>
                            </div>
                        ))}
                    </div>

                    {/* Risk badge */}
                    <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.07)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Risk Status</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--danger)', letterSpacing: '0.05em' }}>HIGH</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px' }}>Immediate corrective action required</div>
                    </div>

                    {/* XAI bars */}
                    <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Cpu size={16} className="text-primary" /> Why? – Root Cause (XAI)</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {XAI_FACTORS.map(f => (
                                <div key={f.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '5px' }}>
                                        <span>{f.name}</span><span style={{ color: f.color }}>{f.value}%</span>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${f.value}%`, height: '100%', backgroundColor: f.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Factors */}
            <div className="card">
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', fontWeight: 700 }}>AI Input Factors</h3>
                <div className="grid-container" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {INPUT_FACTORS.map((f, i) => {
                        const Icon = f.icon;
                        const trendColor = f.trend === 'up' ? 'var(--success)' : f.trend === 'down' ? 'var(--danger)' : 'var(--text-muted)';
                        const TrendIcon = f.trend === 'up' ? TrendingUp : f.trend === 'down' ? TrendingDown : Activity;
                        return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={20} style={{ color: 'var(--primary)' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>{f.label}</div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{f.value}</div>
                                </div>
                                <TrendIcon size={18} style={{ color: trendColor, flexShrink: 0 }} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Forecast;
