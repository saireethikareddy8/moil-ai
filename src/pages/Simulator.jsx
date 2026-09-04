import React, { useState, useEffect } from 'react';
import { Settings2, TrendingUp, TrendingDown, AlignVerticalJustifyStart, ShieldAlert, Sparkles, CheckCircle, BarChart as BarChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

const TARGET_PRODUCTION = 150000;
const BASE_PREDICTED = 143200;
const BASE_SHORTFALL = TARGET_PRODUCTION - BASE_PREDICTED; // 6800

const BASE_PARAMS = {
    excavatorAvail: 60, // %
    truckAvail: 70,     // %
    blastingDelay: 2,   // days
    rainfall: 45,       // mm
    stockpile: 8400,    // MT
    workHours: 16,      // hrs/day
    activeMachines: 12, // count
    extractionRate: 1200, // MT/hr
};

const calcImpact = (p) => {
    // Mock transparent formulas
    const excImpact = (p.excavatorAvail - BASE_PARAMS.excavatorAvail) * 120; // 1% = 120 MT
    const trkImpact = (p.truckAvail - BASE_PARAMS.truckAvail) * 80;          // 1% = 80 MT
    const blastImpact = (BASE_PARAMS.blastingDelay - p.blastingDelay) * 900;   // 1 day saved = +900 MT
    const rainImpact = (BASE_PARAMS.rainfall - p.rainfall) * 20;              // 1mm less rain = +20 MT
    const stockImpact = (p.stockpile - BASE_PARAMS.stockpile) * 0.1;           // 10 MT stockpile = +1 MT prod buffer
    const hrsImpact = (p.workHours - BASE_PARAMS.workHours) * 400;           // 1 hr = +400 MT
    const machImpact = (p.activeMachines - BASE_PARAMS.activeMachines) * 500; // 1 machine = +500 MT
    const extImpact = (p.extractionRate - BASE_PARAMS.extractionRate) * 2;   // 1 MT/hr = +2 MT total

    return excImpact + trkImpact + blastImpact + rainImpact + stockImpact + hrsImpact + machImpact + extImpact;
};

const getRiskLevel = (shortfall) => {
    if (shortfall <= 1000) return { label: 'LOW', color: 'var(--success)' };
    if (shortfall <= 4000) return { label: 'MEDIUM', color: 'var(--warning)' };
    return { label: 'HIGH', color: 'var(--danger)' };
};

const Simulator = () => {
    const [params, setParams] = useState(BASE_PARAMS);
    const [impact, setImpact] = useState(0);

    useEffect(() => {
        setImpact(Math.round(calcImpact(params)));
    }, [params]);

    const newProduction = BASE_PREDICTED + impact;
    const newShortfall = Math.max(0, TARGET_PRODUCTION - newProduction);
    const shortfallDiff = BASE_SHORTFALL - newShortfall;

    const origRisk = getRiskLevel(BASE_SHORTFALL);
    const newRisk = getRiskLevel(newShortfall);

    const chartData = [
        {
            name: 'Baseline',
            Target: TARGET_PRODUCTION,
            Predicted: BASE_PREDICTED,
        },
        {
            name: 'Simulated',
            Target: TARGET_PRODUCTION,
            Predicted: newProduction,
        }
    ];

    const applyAIScenario = () => {
        setParams({
            ...params,
            excavatorAvail: 85,
            blastingDelay: 0, // Advanced by 2 days practically if delay was 2
            stockpile: 9660,  // +15%
        });
    };

    const handleSlider = (key, val) => setParams(prev => ({ ...prev, [key]: Number(val) }));

    return (
        <div className="dashboard-container" style={{ paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Settings2 size={28} style={{ color: 'var(--primary)' }} /> What-If Scenario Simulator
                    </h2>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>Test operational changes and view real-time AI impact analysis.</p>
                </div>
                <button className="btn" onClick={() => setParams(BASE_PARAMS)} style={{ backgroundColor: '#f1f5f9', border: '1px solid var(--border)', fontWeight: 700 }}>
                    Reset Controls
                </button>
            </div>

            <div className="grid-container" style={{ gridTemplateColumns: 'minmax(350px, 1fr) 2fr', alignItems: 'start' }}>

                {/* LEFT SIDE - CONTROLS */}
                <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlignVerticalJustifyStart size={20} className="text-muted" /> Simulation Controls
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {[
                            { id: 'excavatorAvail', label: 'Excavator Availability (%)', min: 40, max: 100, step: 1, unit: '%' },
                            { id: 'truckAvail', label: 'Truck Availability (%)', min: 40, max: 100, step: 1, unit: '%' },
                            { id: 'blastingDelay', label: 'Blasting Delay (days)', min: 0, max: 5, step: 1, unit: ' days' },
                            { id: 'rainfall', label: 'Expected Rainfall (mm)', min: 0, max: 200, step: 5, unit: ' mm' },
                            { id: 'stockpile', label: 'Ore Stockpile (MT)', min: 5000, max: 20000, step: 100, unit: ' MT' },
                            { id: 'workHours', label: 'Working Hours (hrs/day)', min: 12, max: 24, step: 1, unit: ' hrs' },
                            { id: 'activeMachines', label: 'Active Machines (count)', min: 5, max: 20, step: 1, unit: '' },
                            { id: 'extractionRate', label: 'Extraction Rate (MT/hr)', min: 800, max: 2000, step: 50, unit: ' MT/h' },
                        ].map(ctrl => (
                            <div key={ctrl.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>{ctrl.label}</label>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {params[ctrl.id] !== BASE_PARAMS[ctrl.id] && (
                                            <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.75rem', fontWeight: 600 }}>
                                                {BASE_PARAMS[ctrl.id]}
                                            </span>
                                        )}
                                        <span style={{ color: params[ctrl.id] !== BASE_PARAMS[ctrl.id] ? 'var(--primary)' : 'inherit' }}>
                                            {params[ctrl.id]}{ctrl.unit}
                                        </span>
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={ctrl.min} max={ctrl.max} step={ctrl.step}
                                    value={params[ctrl.id]}
                                    onChange={e => handleSlider(ctrl.id, e.target.value)}
                                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE - RESULTS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* AI BEST SCENARIO CARD */}
                    <div className="card" style={{ padding: '0', display: 'flex', overflow: 'hidden', border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 4px 12px rgba(59,130,246,0.06)' }}>
                        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(59,130,246,0.06)', flex: '0 0 250px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3b82f6', fontWeight: 800, marginBottom: '8px' }}>
                                <Sparkles size={22} /> Best AI Scenario
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                                Applying these specific adjustments yields the highest probability of eliminating the shortfall.
                            </p>
                        </div>
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fff' }}>
                            <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.8', fontWeight: 600 }}>
                                <li>Increase excavator availability to <strong>85%</strong>.</li>
                                <li>Advance blasting by <strong>one day</strong>.</li>
                                <li>Increase stockpile by <strong>15%</strong>.</li>
                            </ul>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <span className="badge" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--success)', fontWeight: 800, fontSize: '0.875rem', padding: '6px 12px' }}>
                                    Estimated improvement: +5,200 tonnes.
                                </span>
                                <button onClick={applyAIScenario} className="btn btn-primary" style={{ fontWeight: 700 }}>
                                    Apply Scenario to Planning
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* KPI COMPARISON GRID */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {/* PRODUCTION */}
                        <div className="card" style={{ padding: '1.25rem' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Production Forecast</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Original</span>
                                <span style={{ fontWeight: 700 }}>{BASE_PREDICTED.toLocaleString()} MT</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>Simulated</span>
                                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>{newProduction.toLocaleString()} MT</span>
                            </div>
                        </div>

                        {/* SHORTFALL */}
                        <div className="card" style={{ padding: '1.25rem' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Projected Shortfall</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Original</span>
                                <span style={{ fontWeight: 700, color: 'var(--danger)' }}>{BASE_SHORTFALL.toLocaleString()} MT</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: newShortfall < BASE_SHORTFALL ? 'var(--success)' : (newShortfall > BASE_SHORTFALL ? 'var(--danger)' : 'var(--text-main)') }}>Simulated</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: newShortfall === 0 ? 'var(--success)' : 'var(--text-main)' }}>{newShortfall.toLocaleString()} MT</span>
                                    {shortfallDiff !== 0 && (
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: shortfallDiff > 0 ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center' }}>
                                            {shortfallDiff > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {Math.abs(shortfallDiff).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RISK LEVEL */}
                        <div className="card" style={{ padding: '1.25rem' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Operating Risk</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Original</span>
                                <span className="badge" style={{ backgroundColor: `${origRisk.color}15`, color: origRisk.color, fontWeight: 800 }}>{origRisk.label}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>Simulated</span>
                                <span className="badge" style={{ backgroundColor: `${newRisk.color}20`, color: newRisk.color, fontWeight: 900, padding: '4px 10px', fontSize: '0.875rem' }}>
                                    {origRisk.label !== newRisk.label && `${origRisk.label} → `} {newRisk.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* VISUAL CHART */}
                    <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BarChartIcon size={20} className="text-muted" /> Production Baseline vs Simulated Result
                        </h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={6}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontWeight: 600, fontSize: 13 }} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000)}k`} domain={[120000, 160000]} />
                                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} formatter={(value) => `${value.toLocaleString()} MT`} />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <ReferenceLine y={TARGET_PRODUCTION} stroke="var(--success)" strokeDasharray="5 5" strokeWidth={2} label={{ position: 'top', value: 'Target Goal', fill: 'var(--success)', fontSize: 12, fontWeight: 700 }} />
                                    <Bar dataKey="Predicted" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={100} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Simulator;
