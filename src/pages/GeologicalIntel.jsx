import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Cell
} from 'recharts';
import { Search, Layers, BrainCircuit, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';

const DRILL_HOLES = [
    { id: 'DH-001', lat: '21.8451', lng: '79.9123', depth: 120, mn: 42.3, fe: 8.1, lithology: 'Quartzite', date: '2026-01-15', status: 'Completed' },
    { id: 'DH-002', lat: '21.8512', lng: '79.9245', depth: 95, mn: 38.7, fe: 10.2, lithology: 'Schist', date: '2026-02-03', status: 'Completed' },
    { id: 'DH-003', lat: '21.8390', lng: '79.9087', depth: 145, mn: 47.1, fe: 6.5, lithology: 'Mn-Shale', date: '2026-03-12', status: 'Completed' },
    { id: 'DH-004', lat: '21.8602', lng: '79.9310', depth: 80, mn: 31.2, fe: 12.4, lithology: 'Granite', date: '2026-04-22', status: 'In Progress' },
    { id: 'DH-005', lat: '21.8471', lng: '79.9198', depth: 200, mn: 51.8, fe: 5.2, lithology: 'Mn-Shale', date: '2026-05-08', status: 'Completed' },
    { id: 'DH-006', lat: '21.8531', lng: '79.9410', depth: 60, mn: 22.5, fe: 14.1, lithology: 'Gneiss', date: '2026-06-14', status: 'Planned' },
    { id: 'DH-007', lat: '21.8289', lng: '79.9155', depth: 175, mn: 49.2, fe: 6.8, lithology: 'Mn-Shale', date: '2026-07-19', status: 'Completed' },
    { id: 'DH-008', lat: '21.8700', lng: '79.8990', depth: 110, mn: 36.4, fe: 9.7, lithology: 'Quartzite', date: '2026-08-02', status: 'Completed' },
];

const SECTIONS = ['Drill Hole Data', 'Assay Results', 'Lithology', 'Structural Data', 'Known Workings', 'Mine Boundaries'];

const AI_INSIGHTS = [
    { type: 'success', icon: CheckCircle, text: 'Geological similarity with known manganese zones: 86%', sub: 'Based on lithology, Mn grade, and depth profile matching.' },
    { type: 'info', icon: MapPin, text: 'Potential continuation of ore body detected toward Block D.', sub: 'Structural lineament trending NE–SW supports the ore extension hypothesis.' },
    { type: 'warning', icon: AlertTriangle, text: 'Recommended location for additional geological investigation: Block C-12.', sub: 'Low drill-hole density combined with high satellite SWIR anomaly.' },
];

const getMnDepthProfile = (hole) => {
    const levels = Math.floor(hole.depth / 20);
    return Array.from({ length: levels }, (_, i) => ({
        depth: `${i * 20}–${i * 20 + 20}m`,
        mn: Math.max(10, hole.mn + (Math.sin(i * 1.3) * 12)).toFixed(1),
    }));
};

const getLithLayers = (hole) => {
    const types = ['Overburden', 'Quartzite', 'Schist', 'Mn-Shale', 'Granite', 'Ore Zone'];
    const colors = ['#94a3b8', '#c0a57e', '#9ca3af', '#1d4ed8', '#6b7280', '#ef4444'];
    const levels = Math.floor(hole.depth / 25);
    return Array.from({ length: levels }, (_, i) => ({
        label: types[i % types.length],
        color: colors[i % colors.length],
        thickness: 20 + Math.floor(Math.sin(i) * 8),
        depth: i * 25,
    }));
};

const CROSS_SECTION_BLOCKS = Array.from({ length: 40 }, (_, i) => {
    const v = Math.abs(Math.sin(i * 0.7));
    const mn = 10 + v * 50;
    const color = mn > 45 ? '#ef4444' : mn > 35 ? '#f59e0b' : mn > 25 ? '#3b82f6' : '#94a3b8';
    return { mn: mn.toFixed(1), color };
});

const GeologicalIntel = () => {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [activeSection, setActiveSection] = useState('Drill Hole Data');

    const filtered = DRILL_HOLES.filter(h =>
        h.id.toLowerCase().includes(search.toLowerCase()) ||
        h.lithology.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="dashboard-container" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Geological Intelligence</h2>
                <p className="text-muted" style={{ marginTop: '0.25rem' }}>Drill hole data, lithology, structural analysis, and AI geological synthesis.</p>
            </div>

            {/* Section tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {SECTIONS.map(s => (
                    <button key={s} onClick={() => setActiveSection(s)}
                        className="btn"
                        style={{
                            padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600,
                            backgroundColor: activeSection === s ? 'var(--primary)' : '#f1f5f9',
                            color: activeSection === s ? '#fff' : 'var(--text-main)',
                            border: `1px solid ${activeSection === s ? 'var(--primary)' : 'var(--border)'}`
                        }}>
                        <Layers size={14} /> {s}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* LEFT: Drill hole table */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Drill Hole Database</h3>
                        <div style={{ flex: 1 }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 12px' }}>
                            <Search size={16} className="text-muted" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or Lithology…"
                                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.875rem', width: '200px' }} />
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc' }}>
                                    {['Drill ID', 'Lat', 'Lng', 'Depth (m)', 'Mn %', 'Fe %', 'Lithology', 'Date', 'Status'].map(col => (
                                        <th key={col} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(hole => (
                                    <tr key={hole.id} onClick={() => setSelected(hole)}
                                        style={{ cursor: 'pointer', backgroundColor: selected?.id === hole.id ? 'rgba(59,130,246,0.06)' : 'transparent', borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}>
                                        <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--primary)' }}>{hole.id}</td>
                                        <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{hole.lat}</td>
                                        <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{hole.lng}</td>
                                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{hole.depth}</td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <span style={{ fontWeight: 700, color: hole.mn > 45 ? 'var(--success)' : hole.mn > 35 ? 'var(--warning)' : 'var(--text-muted)' }}>{hole.mn}%</span>
                                        </td>
                                        <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{hole.fe}%</td>
                                        <td style={{ padding: '10px 12px' }}>{hole.lithology}</td>
                                        <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{hole.date}</td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <span className="badge" style={{ backgroundColor: hole.status === 'Completed' ? 'rgba(16,185,129,0.1)' : hole.status === 'Planned' ? 'rgba(148,163,184,0.1)' : 'rgba(245,158,11,0.1)', color: hole.status === 'Completed' ? 'var(--success)' : hole.status === 'Planned' ? 'var(--text-muted)' : 'var(--warning)' }}>
                                                {hole.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT: Selected Hole Detail */}
                {selected ? (
                    <div className="card" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }}>{selected.id}</h3>
                            <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{selected.lithology} · Depth {selected.depth}m · {selected.date}</p>
                        </div>

                        {/* Mn grade vs Depth */}
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>Mn % vs Depth</div>
                            <div style={{ height: '200px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={getMnDepthProfile(selected)} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                                        <XAxis type="number" domain={[0, 60]} axisLine={false} tickLine={false} tick={{ fontSize: '0.7rem', fill: 'var(--text-muted)' }} />
                                        <YAxis dataKey="depth" type="category" axisLine={false} tickLine={false} tick={{ fontSize: '0.7rem', fill: 'var(--text-muted)' }} width={70} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} formatter={v => [`${v}%`, 'Mn Grade']} />
                                        <Bar dataKey="mn" name="Mn %" radius={[0, 4, 4, 0]} barSize={14}>
                                            {getMnDepthProfile(selected).map((entry, i) => (
                                                <Cell key={i} fill={entry.mn > 45 ? 'var(--success)' : entry.mn > 35 ? 'var(--warning)' : 'var(--primary)'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Lithology Layers */}
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>Lithology Profile</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {getLithLayers(selected).map((layer, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '14px', height: '14px', backgroundColor: layer.color, borderRadius: '3px', flexShrink: 0 }} />
                                        <div style={{ flex: 1, height: `${layer.thickness}px`, backgroundColor: layer.color, opacity: 0.25, borderRadius: '3px' }} />
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, width: '80px', color: 'var(--text-muted)' }}>{layer.label}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', width: '40px' }}>{layer.depth}m</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Assay */}
                        <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Assay Results</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.875rem' }}>
                                <div><span style={{ color: 'var(--text-muted)' }}>Avg Mn%:</span> <strong style={{ color: 'var(--success)' }}>{selected.mn}%</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Avg Fe%:</span> <strong>{selected.fe}%</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>SiO₂:</span> <strong>4.3%</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Al₂O₃:</span> <strong>2.1%</strong></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        <Layers size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>Select a Drill Hole</h3>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Click any row in the table to view depth profile, lithology layers, and assay results.</p>
                    </div>
                )}
            </div>

            {/* Geological Cross-Section */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Geological Cross-Section (E–W Traverse, Block B–D)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {/* Surface line */}
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        <div style={{ width: '60px', textAlign: 'right', paddingRight: '8px' }}>0m</div>
                        <div style={{ flex: 1, height: '3px', background: 'linear-gradient(90deg, #6b7280, #9ca3af)', borderRadius: '2px' }} />
                        <span style={{ paddingLeft: '6px' }}>Surface</span>
                    </div>
                    {/* Ore body blocks */}
                    {[{ label: '25m', opacity: 0.5 }, { label: '50m', opacity: 0.75 }, { label: '75m', opacity: 0.9 }, { label: '100m', opacity: 1 }].map((row, ri) => (
                        <div key={ri} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <div style={{ width: '60px', textAlign: 'right', paddingRight: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{row.label}</div>
                            <div style={{ flex: 1, display: 'flex', gap: '3px' }}>
                                {CROSS_SECTION_BLOCKS.map((blk, bi) => (
                                    <div key={bi} title={`Mn: ${blk.mn}%`} style={{ flex: 1, height: '20px', backgroundColor: blk.color, opacity: row.opacity * (0.4 + bi * 0.01), borderRadius: '2px', cursor: 'pointer', transition: 'opacity 0.15s' }} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Legend */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {[['#ef4444', 'High Mn (>45%)'], ['#f59e0b', 'Medium Mn (35–45%)'], ['#3b82f6', 'Low Mn (<35%)'], ['#94a3b8', 'Barren/Cover']].map(([c, l]) => (
                        <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                            <div style={{ width: 12, height: 12, backgroundColor: c, borderRadius: '2px' }} /> {l}
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Analysis */}
            <div className="card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BrainCircuit size={20} className="text-primary" /> AI Geological Analysis
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {AI_INSIGHTS.map((ins, i) => {
                        const Icon = ins.icon;
                        const vars = { success: { bg: 'rgba(16,185,129,0.08)', border: 'var(--success)', icon: 'var(--success)' }, info: { bg: 'rgba(59,130,246,0.08)', border: 'var(--info)', icon: 'var(--info)' }, warning: { bg: 'rgba(245,158,11,0.08)', border: 'var(--warning)', icon: 'var(--warning)' } };
                        const v = vars[ins.type];
                        return (
                            <div key={i} style={{ padding: '1.25rem', backgroundColor: v.bg, borderRadius: '8px', borderLeft: `3px solid ${v.border}` }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <Icon size={20} style={{ color: v.icon, marginTop: '1px', flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', lineHeight: '1.4' }}>{ins.text}</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{ins.sub}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GeologicalIntel;
