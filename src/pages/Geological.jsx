import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Satellite, BrainCircuit, CloudRain, Thermometer, Droplets, Mountain, Radio, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const INDICES = ['NDVI', 'NDMI', 'SWIR', 'Bare Soil Index', 'Land Surface Temperature'];

const SATELLITE_CARDS = [
    { id: 'sentinel', name: 'Sentinel-2 / HLS', status: 'Active', date: 'Sep 01, 2026', resolution: '10m', icon: Satellite, color: '#3b82f6', detail: 'Multispectral optical imaging for vegetation, mineral, and bare-soil analysis.' },
    { id: 'gpm', name: 'GPM Rainfall', status: 'Active', date: 'Sep 03, 2026', resolution: '0.1°', icon: CloudRain, color: '#2563eb', detail: 'Global Precipitation Measurement — Daily accumulated rainfall in mm.' },
    { id: 'smap', name: 'SMAP Soil Moisture', status: 'Active', date: 'Sep 03, 2026', resolution: '9km', icon: Droplets, color: '#10b981', detail: 'Surface and rootzone soil moisture estimates (m³/m³).' },
    { id: 'modis', name: 'MODIS LST', status: 'Needs Update', date: 'Aug 30, 2026', resolution: '1km', icon: Thermometer, color: '#f59e0b', detail: 'Land Surface Temperature (daytime) in Kelvin/Celsius from MODIS Terra.' },
    { id: 'srtm', name: 'SRTM DEM', status: 'Static', date: 'Baseline', resolution: '30m', icon: Mountain, color: '#8b5cf6', detail: 'Shuttle Radar Topography Mission — Elevation model for terrain analysis.' },
];

const aiInsights = [
    { type: 'warning', icon: AlertTriangle, text: 'High SWIR anomaly detected near Block C-12. Indicates sub-surface mineral alteration.', time: '10 min ago' },
    { type: 'info', icon: Radio, text: 'Vegetation reduction (NDVI drop -0.18) detected near active mining zone. Monitoring deforestation boundary.', time: '1 hour ago' },
    { type: 'danger', icon: CloudRain, text: 'Heavy rainfall (>45mm/day) may affect mining operations during the next 48 hours.', time: '2 hours ago' },
    { type: 'success', icon: CheckCircle, text: 'Surface characteristics in Block D-07 indicate potential geological anomaly. Matches olivine-bearing lithology patterns.', time: '5 hours ago' },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const rainfallData = months.map((m, i) => ({ month: m, rainfall: [18, 24, 42, 65, 88, 112, 135, 97, 40][i] }));
const soilData = months.map((m, i) => ({ month: m, moisture: [0.28, 0.31, 0.38, 0.45, 0.52, 0.58, 0.62, 0.55, 0.43][i] }));
const lstData = months.map((m, i) => ({ month: m, temp: [24, 27, 32, 36, 38, 34, 30, 28, 29][i] }));
const ndviData = months.map((m, i) => ({ month: m, ndvi: [0.62, 0.58, 0.52, 0.48, 0.55, 0.64, 0.71, 0.68, 0.61][i] }));

const MAP_COLORS = {
    NDVI: ['#052e16', '#166534', '#16a34a', '#4ade80', '#bbf7d0'],
    NDMI: ['#1e3a5f', '#1e40af', '#3b82f6', '#93c5fd', '#dbeafe'],
    SWIR: ['#431407', '#7c2d12', '#c2410c', '#fb923c', '#fed7aa'],
    'Bare Soil Index': ['#332006', '#713f12', '#a16207', '#ca8a04', '#fef08a'],
    'Land Surface Temperature': ['#2d0000', '#7f1d1d', '#b91c1c', '#ef4444', '#fca5a5'],
};

const Geological = () => {
    const [activeIndex, setActiveIndex] = useState('NDVI');
    const [dateA, setDateA] = useState('2026-06-01');
    const [dateB, setDateB] = useState('2026-09-01');

    const palette = MAP_COLORS[activeIndex] || MAP_COLORS.NDVI;

    return (
        <div className="dashboard-container" style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Satellite Intelligence</h2>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>Environmental &amp; spectral data analysis for Mn exploration and operations.</p>
                </div>
            </div>

            {/* Satellite Data Cards */}
            <div className="grid-container" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: '2rem' }}>
                {SATELLITE_CARDS.map(card => {
                    const Icon = card.icon;
                    return (
                        <div key={card.id} className="card" style={{ borderTop: `4px solid ${card.color}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <Icon size={20} style={{ color: card.color }} />
                                <span className="badge" style={{ backgroundColor: card.status === 'Active' ? 'rgba(16,185,129,0.1)' : card.status === 'Static' ? 'rgba(148,163,184,0.15)' : 'rgba(245,158,11,0.1)', color: card.status === 'Active' ? 'var(--success)' : card.status === 'Static' ? 'var(--text-muted)' : 'var(--warning)', fontSize: '0.7rem' }}>
                                    {card.status}
                                </span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '6px' }}>{card.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{card.detail}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Res: {card.resolution}</span>
                                <span style={{ color: 'var(--text-muted)' }}>{card.date}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid-container" style={{ gridTemplateColumns: '1fr 320px', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* MAP + INDEX SELECTOR + TEMPORAL COMPARISON */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Index selector */}
                    <div className="card" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Spectral Index Selector</div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {INDICES.map(idx => (
                                        <button key={idx} onClick={() => setActiveIndex(idx)}
                                            className="btn"
                                            style={{ padding: '6px 14px', fontSize: '0.8rem', backgroundColor: activeIndex === idx ? 'var(--primary)' : '#f1f5f9', color: activeIndex === idx ? '#fff' : 'var(--text-main)', border: `1px solid ${activeIndex === idx ? 'var(--primary)' : 'var(--border)'}`, fontWeight: 600 }}>
                                            {idx}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Temporal Comparison */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar size={18} className="text-muted" />
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Date A</label>
                                    <input type="date" value={dateA} onChange={e => setDateA(e.target.value)} style={{ padding: '5px 8px', border: '1px solid var(--border)', borderRadius: '5px', fontSize: '0.8125rem' }} />
                                </div>
                                <div style={{ fontWeight: 700, color: 'var(--text-muted)', marginTop: '14px' }}>vs</div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Date B</label>
                                    <input type="date" value={dateB} onChange={e => setDateB(e.target.value)} style={{ padding: '5px 8px', border: '1px solid var(--border)', borderRadius: '5px', fontSize: '0.8125rem' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Triple Map View */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        {[
                            { label: `Image A · ${dateA}`, opacity: 0.6 },
                            { label: `Image B · ${dateB}`, opacity: 0.85 },
                            { label: 'Detected Changes', isChange: true }
                        ].map((panel, pi) => (
                            <div key={pi} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', backgroundColor: '#f8fafc', fontWeight: 700, fontSize: '0.8rem' }}>
                                    {panel.label}
                                </div>
                                <div style={{ height: '200px', position: 'relative', overflow: 'hidden', background: panel.isChange ? '#0f172a' : '#e2e8f0' }}>
                                    {panel.isChange ? (
                                        // Change Detection panel
                                        <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', gap: '2px', padding: '8px' }}>
                                            {Array.from({ length: 48 }, (_, i) => {
                                                const v = Math.sin(i * 2.3 + 1) * 0.5 + 0.5;
                                                const changed = v > 0.65;
                                                const gained = v > 0.82;
                                                return <div key={i} style={{ borderRadius: '2px', backgroundColor: gained ? '#10b981' : changed ? '#ef4444' : 'rgba(255,255,255,0.05)' }} />;
                                            })}
                                        </div>
                                    ) : (
                                        // Heatmap grid
                                        <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', gap: '2px', padding: '8px' }}>
                                            {Array.from({ length: 48 }, (_, i) => {
                                                const v = Math.abs(Math.sin(i * 1.7 + pi * 0.5));
                                                const idx = Math.floor(v * (palette.length - 1));
                                                return <div key={i} style={{ borderRadius: '2px', backgroundColor: palette[idx], opacity: panel.opacity }} />;
                                            })}
                                        </div>
                                    )}
                                    <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '0.7rem', fontWeight: 600, color: '#fff', backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>
                                        {panel.isChange ? '🔴 Loss  🟢 Gain' : `${activeIndex}`}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Satellite Insights */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                        <BrainCircuit size={20} className="text-primary" /> AI Satellite Insights
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                        {aiInsights.map((ins, i) => {
                            const Icon = ins.icon;
                            const vars = { warning: { bg: 'rgba(245,158,11,0.08)', border: 'var(--warning)', icon: 'var(--warning)' }, info: { bg: 'rgba(59,130,246,0.08)', border: 'var(--info)', icon: 'var(--info)' }, danger: { bg: 'rgba(239,68,68,0.08)', border: 'var(--danger)', icon: 'var(--danger)' }, success: { bg: 'rgba(16,185,129,0.08)', border: 'var(--success)', icon: 'var(--success)' } };
                            const v = vars[ins.type];
                            return (
                                <div key={i} style={{ padding: '1rem', backgroundColor: v.bg, borderRadius: '8px', borderLeft: `3px solid ${v.border}` }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <Icon size={18} style={{ color: v.icon, marginTop: '1px', flexShrink: 0 }} />
                                        <div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)', lineHeight: '1.5' }}>{ins.text}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>{ins.time}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Trend Charts – 2×2 */}
            <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {[
                    { title: 'Rainfall Trend (mm/month)', data: rainfallData, key: 'rainfall', color: '#3b82f6', unit: 'mm', icon: CloudRain },
                    { title: 'Soil Moisture Trend (m³/m³)', data: soilData, key: 'moisture', color: '#10b981', unit: 'm³/m³', icon: Droplets },
                    { title: 'Land Surface Temperature (°C)', data: lstData, key: 'temp', color: '#ef4444', unit: '°C', icon: Thermometer },
                    { title: 'Vegetation Change (NDVI)', data: ndviData, key: 'ndvi', color: '#22c55e', unit: '', icon: Satellite },
                ].map(chart => {
                    const Icon = chart.icon;
                    return (
                        <div key={chart.key} className="card">
                            <div className="card-header">
                                <h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                                    <Icon size={18} style={{ color: chart.color }} /> {chart.title}
                                </h3>
                            </div>
                            <div style={{ height: '200px', marginTop: '1rem' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chart.data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: '0.75rem' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: '0.75rem' }} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} formatter={v => [`${v} ${chart.unit}`, chart.title]} />
                                        <Line type="monotone" dataKey={chart.key} stroke={chart.color} strokeWidth={2.5} dot={{ r: 4, fill: chart.color }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Geological;
