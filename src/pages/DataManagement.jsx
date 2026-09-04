import React, { useState } from 'react';
import { Database, UploadCloud, RefreshCw, FileText, CheckCircle, AlertCircle, PlayCircle, ArrowRight, XCircle } from 'lucide-react';

const INITIAL_DATASETS = [
    { id: 'DS-001', name: 'Balaghat_Drill_Holes_2026.csv', type: 'Drill Hole Data', date: 'Sept 03, 2026', records: '1,240', valStatus: 'Passed', procStatus: 'Processed', errors: [] },
    { id: 'DS-002', name: 'Equipment_Telemetry_W34.xlsx', type: 'Equipment Data', date: 'Sept 03, 2026', records: '45,210', valStatus: 'Failed', procStatus: 'Pending', errors: ['Invalid dates on 145 rows', 'Outliers in Vibration column'] },
    { id: 'DS-003', name: 'Tirodi_Block_B_Boundaries.geojson', type: 'Mine Boundaries', date: 'Sept 02, 2026', records: '1', valStatus: 'Validating', procStatus: 'Pending', errors: [] },
    { id: 'DS-004', name: 'Production_Log_Aug2026.csv', type: 'Production Records', date: 'Sept 01, 2026', records: '930', valStatus: 'Warning', procStatus: 'Processed', errors: ['Missing production values (replaced with 0)'] },
    { id: 'DS-005', name: 'Assay_Results_DB_Mine.csv', type: 'Assay Data', date: 'Aug 30, 2026', records: '412', valStatus: 'Failed', procStatus: 'Pending', errors: ['Missing coordinates (X, Y required)', 'Duplicate records found'] },
];

const DATASET_TYPES = [
    'Geological Data', 'Drill Hole Data', 'Assay Data', 'Production Records',
    'Equipment Data', 'Blasting Records', 'Maintenance Logs', 'Mine Boundaries'
];

const VAL_COLORS = {
    'Passed': 'var(--success)',
    'Failed': 'var(--danger)',
    'Warning': 'var(--warning)',
    'Validating': 'var(--info)'
};

const DataManagement = () => {
    const [datasets, setDatasets] = useState(INITIAL_DATASETS);
    const [uploadType, setUploadType] = useState('Drill Hole Data');

    const handleProcess = (id) => {
        setDatasets(datasets.map(d =>
            d.id === id ? { ...d, valStatus: 'Passed', procStatus: 'Processed', errors: [] } : d
        ));
    };

    const PipelineStep = ({ label, active, complete }) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
            <div style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: complete ? 'var(--success)' : active ? 'var(--primary)' : 'var(--bg-main)',
                border: `2px solid ${complete ? 'var(--success)' : active ? 'var(--primary)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                boxShadow: active ? '0 0 0 4px rgba(59,130,246,0.1)' : 'none'
            }}>
                {complete ? <CheckCircle size={18} /> : (active ? <RefreshCw size={16} className="spinner" /> : <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--border)' }} />)}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: (active || complete) ? 'var(--text-main)' : 'var(--text-muted)' }}>{label}</div>
        </div>
    );

    return (
        <div className="dashboard-container" style={{ paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Database size={28} style={{ color: 'var(--primary)' }} /> Data Management Hub
                </h2>
                <p className="text-muted" style={{ marginTop: '0.25rem' }}>Upload, validate, and process datasets for the AI engine.</p>
            </div>

            <div className="grid-container" style={{ gridTemplateColumns: '1fr 2.5fr', alignItems: 'start', marginBottom: '2rem' }}>

                {/* UPLOAD SECTION (LEFT) */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700 }}>Upload Dataset</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Dataset Type</label>
                        <select value={uploadType} onChange={e => setUploadType(e.target.value)}
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.875rem' }}>
                            {DATASET_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>

                    <div style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '2rem 1rem', textAlign: 'center', backgroundColor: '#f8fafc', marginBottom: '1rem', cursor: 'pointer' }}>
                        <UploadCloud size={32} style={{ color: 'var(--primary)', margin: '0 auto 0.5rem auto' }} />
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>Drag & Drop file here</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supported: CSV, Excel (.xlsx), GeoJSON</div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Upload & Validate
                    </button>
                </div>

                {/* PIPELINE VISUALIZATION (RIGHT) */}
                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', fontWeight: 700 }}>AI Data Ingestion Pipeline</h3>

                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 1rem 3rem 1rem' }}>
                        {/* Connecting line */}
                        <div style={{ position: 'absolute', top: '18px', left: '0', right: '0', height: '2px', backgroundColor: 'var(--border)', zIndex: 1 }}></div>

                        <PipelineStep label="Upload" complete={true} />
                        <PipelineStep label="Validation" complete={true} />
                        <PipelineStep label="Cleaning" active={true} />
                        <PipelineStep label="Feature Eng." />
                        <PipelineStep label="AI Model" />
                        <PipelineStep label="Dashboard" />
                    </div>

                    <div style={{ padding: '1rem', backgroundColor: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>Pipeline Status</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600 }}>Currently processing Equipment_Telemetry_W34.xlsx — Removing outliers and imputing missing dates.</div>
                    </div>
                </div>
            </div>

            {/* UPLOADED DATASETS TABLE */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>Uploaded Datasets</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '12px', fontWeight: 700 }}>File Name</th>
                                <th style={{ padding: '12px', fontWeight: 700 }}>Type</th>
                                <th style={{ padding: '12px', fontWeight: 700 }}>Upload Date</th>
                                <th style={{ padding: '12px', fontWeight: 700 }}>Records</th>
                                <th style={{ padding: '12px', fontWeight: 700 }}>Validation</th>
                                <th style={{ padding: '12px', fontWeight: 700 }}>Processing Status</th>
                                <th style={{ padding: '12px', fontWeight: 700 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datasets.map(ds => (
                                <React.Fragment key={ds.id}>
                                    <tr style={{ borderBottom: ds.errors.length > 0 ? 'none' : '1px solid var(--border)' }}>
                                        <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FileText size={16} className="text-muted" /> {ds.name}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{ds.type}</td>
                                        <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{ds.date}</td>
                                        <td style={{ padding: '12px', fontWeight: 600 }}>{ds.records}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span className="badge" style={{ backgroundColor: `${VAL_COLORS[ds.valStatus]}20`, color: VAL_COLORS[ds.valStatus], fontWeight: 800 }}>
                                                {ds.valStatus === 'Validating' && <RefreshCw size={12} className="spinner" style={{ marginRight: 4 }} />}
                                                {ds.valStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            {ds.procStatus === 'Processed' ?
                                                <span style={{ color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> {ds.procStatus}</span> :
                                                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{ds.procStatus}</span>
                                            }
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <button
                                                className="btn"
                                                onClick={() => handleProcess(ds.id)}
                                                disabled={ds.valStatus === 'Passed'}
                                                style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: ds.valStatus === 'Passed' ? 'transparent' : 'rgba(59,130,246,0.1)', color: ds.valStatus === 'Passed' ? 'var(--text-muted)' : 'var(--primary)', border: ds.valStatus === 'Passed' ? 'none' : '1px solid rgba(59,130,246,0.3)' }}>
                                                <PlayCircle size={14} /> Process Dataset
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Error Expansion Row */}
                                    {ds.errors.length > 0 && (
                                        <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: '#fff5f5' }}>
                                            <td colSpan={7} style={{ padding: '0.5rem 12px 1rem 12px' }}>
                                                <div style={{ padding: '10px 14px', backgroundColor: 'rgba(239,68,68,0.05)', borderLeft: '3px solid var(--danger)', borderRadius: '0 6px 6px 0', border: '1px solid rgba(239,68,68,0.2)' }}>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--danger)', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <AlertCircle size={14} /> Validation Issues Found
                                                    </div>
                                                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--danger)' }}>
                                                        {ds.errors.map((err, i) => <li key={i} style={{ marginBottom: '2px' }}>{err}</li>)}
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataManagement;
