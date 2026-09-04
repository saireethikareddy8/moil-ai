import React, { useState } from 'react';
import { FileText, Download, Printer, Filter, ChevronRight, FileArchive, Map as MapIcon, BarChart2, Zap, AlertTriangle, AlertCircle, Settings } from 'lucide-react';

const REPORT_TYPES = [
    'Manganese Prospectivity Report',
    'Production Forecast Report',
    'Shortfall Risk Report',
    'Equipment Performance Report',
    'Satellite Analysis Report',
    'AI Recommendation Report'
];

const MINES = ['Balaghat Mine', 'Dongri Buzurg Mine', 'Tirodi Mine', 'Chikla Mine'];
const BLOCKS = ['Block A', 'Block B', 'Block C', 'Block D', 'Block E'];

const Reports = () => {
    const [reportType, setReportType] = useState('Production Forecast Report');
    const [mine, setMine] = useState('Balaghat Mine');
    const [block, setBlock] = useState('Block B');
    const [dateRange, setDateRange] = useState('01 Sep 2026 - 30 Sep 2026');

    const [isGenerated, setIsGenerated] = useState(false);

    const handleGenerate = () => {
        setIsGenerated(false);
        setTimeout(() => setIsGenerated(true), 600); // mock generation delay
    };

    return (
        <div className="dashboard-container" style={{ paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={28} style={{ color: 'var(--primary)' }} /> Reports &amp; Analytics
                </h2>
                <p className="text-muted" style={{ marginTop: '0.25rem' }}>Generate, preview, and export AI-driven operational reports.</p>
            </div>

            <div className="grid-container" style={{ gridTemplateColumns: '1fr 2.5fr', alignItems: 'start', marginBottom: '2rem' }}>

                {/* LEFT COMPONENT - REPORT BUILDER / FILTERS */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={20} className="text-muted" /> Report Builder
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Report Type</label>
                            <select value={reportType} onChange={e => setReportType(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.875rem' }}>
                                {REPORT_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Mine</label>
                            <select value={mine} onChange={e => setMine(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.875rem' }}>
                                <option value="All Mines">All Mines</option>
                                {MINES.map(m => <option key={m}>{m}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Block</label>
                            <select value={block} onChange={e => setBlock(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.875rem' }}>
                                <option value="All Blocks">All Blocks</option>
                                {BLOCKS.map(b => <option key={b}>{b}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Date Range</label>
                            <input type="text" value={dateRange} onChange={e => setDateRange(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.875rem' }} />
                        </div>
                    </div>

                    <button className="btn btn-primary" onClick={handleGenerate} style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}>
                        Generate Report
                    </button>
                </div>

                {/* RIGHT COMPONENT - REPORT PREVIEW (DOCUMENT UI) */}
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--border)', borderRadius: '8px', minHeight: '800px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>

                    {/* Header toolbar */}
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Report Preview</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button disabled={!isGenerated} className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: isGenerated ? 1 : 0.5, border: '1px solid var(--primary)', color: 'var(--primary)', backgroundColor: 'rgba(59,130,246,0.05)' }}>
                                <Download size={14} /> Export PDF
                            </button>
                            <button disabled={!isGenerated} className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: isGenerated ? 1 : 0.5, border: '1px solid var(--success)', color: 'var(--success)', backgroundColor: 'rgba(16,185,129,0.05)' }}>
                                <FileArchive size={14} /> Export CSV
                            </button>
                            <button disabled={!isGenerated} className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: isGenerated ? 1 : 0.5 }}>
                                <Printer size={14} /> Print
                            </button>
                        </div>
                    </div>

                    {/* Document Content Canvas */}
                    <div style={{ padding: '3rem', flex: 1, color: 'var(--text-main)', opacity: isGenerated ? 1 : 0.3, transition: 'opacity 0.3s ease' }}>
                        {!isGenerated ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--text-muted)' }}>
                                <FileText size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>Select parameters and click "Generate Report" to preview.</p>
                            </div>
                        ) : (
                            <div>
                                {/* DOCTOP */}
                                <div style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', margin: '0 0 0.5rem 0' }}>{reportType}</h1>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                        <span>Location: {mine} - {block}</span>
                                        <span>Date: {dateRange}</span>
                                    </div>
                                </div>

                                {/* EXECUTIVE SUMMARY */}
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={20} style={{ color: 'var(--primary)' }} /> Executive Summary
                                    </h2>
                                    <p style={{ lineHeight: '1.6', color: 'var(--text-main)' }}>
                                        This report details the simulated parameters and operational intelligence for {mine}, focusing specifically on extraction zones within {block}. For the measured period, AI models indicate a potential production shortfall of 6,800 tonnes driven heavily by equipment fatigue and unoptimal blasting scheduling. Strategic intervention is advised.
                                    </p>
                                </div>

                                {/* REPORT SECTIONS GRID */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2.5rem' }}>

                                    {/* AI PREDICTIONS & CHARTS */}
                                    <div>
                                        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <BarChart2 size={18} style={{ color: 'var(--primary)' }} /> AI Predictions
                                        </h2>
                                        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#f8fafc' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: 600 }}>Target Output</span>
                                                <span style={{ fontWeight: 800 }}>150,000 MT</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: 600 }}>Predicted Output</span>
                                                <span style={{ fontWeight: 800, color: 'var(--danger)' }}>143,200 MT</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                                                <span style={{ fontWeight: 700 }}>Projected Shortfall</span>
                                                <span style={{ fontWeight: 900, color: 'var(--danger)' }}>-6,800 MT</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RISK ANALYSIS & ROOT CAUSES */}
                                    <div>
                                        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <AlertTriangle size={18} style={{ color: 'var(--danger)' }} /> Risk & Root Causes
                                        </h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                                <AlertCircle size={16} className="text-danger" style={{ marginTop: '3px' }} />
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Equipment Fatigue (78%)</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Excavator EX-04 unavailablity severely limits capacity.</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                                <AlertCircle size={16} className="text-warning" style={{ marginTop: '3px' }} />
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Blasting Scheduling (22%)</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Weather model predicts rain; schedule is unoptimized.</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* RECOMMENDATIONS */}
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Zap size={20} style={{ color: 'var(--success)' }} /> AI Suggested Actions
                                    </h2>
                                    <div style={{ borderLeft: '4px solid var(--success)', paddingLeft: '1rem' }}>
                                        <ul style={{ margin: 0, paddingLeft: '1rem', lineHeight: '1.8', fontWeight: 600 }}>
                                            <li>Re-deploy Excavator EX-07 from Block A to Block B immediately. (Est. +2,500 MT)</li>
                                            <li>Advance blasting operations by 1 day to bypass weather limitations. (Est. +1,800 MT)</li>
                                            <li>Increase ore stockpile at crusher plant by 15% as a buffer.</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* MAP OR CHARTS PLACEHOLDER */}
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MapIcon size={20} style={{ color: 'var(--info)' }} /> Associated Visualization
                                    </h2>
                                    <div style={{ height: '150px', backgroundColor: '#f1f5f9', border: '1px dashed var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                        [ AI GIS Map / Trend Chart Embedded Here ]
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Reports;
