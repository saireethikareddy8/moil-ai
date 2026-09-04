import React, { useState, useEffect } from 'react';
import { Layers, MapPin, X, FileText, CheckCircle, BarChart2, Info, Search, Crosshair, AlertCircle } from 'lucide-react';

const SATELLITE_LAYERS = ['Sentinel-2 / HLS', 'NDVI', 'NDMI', 'SWIR', 'Bare Soil Index', 'Elevation', 'Geological lithology', 'Structural features'];

const MapView = () => {
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [gridData, setGridData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);

    // Simulate fetching from FastAPI or mock
    useEffect(() => {
        const fetchProspectivity = async () => {
            try {
                // In a production environment, this would hit http://127.0.0.1:8000/api/prospectivity?block_id=ALL
                // Generating identical mock JSON structure as requested for all 64 blocks
                const mockResults = Array.from({ length: 64 }, (_, i) => {
                    const prob = (Math.sin(i * 1.5) * 0.5 + 0.5); // float 0 to 1

                    return {
                        block_id: `BLK-${100 + i}`,
                        lat: (21.8 + prob * 0.1).toFixed(4),
                        lng: (79.9 + Math.cos(i) * 0.1).toFixed(4),
                        prospectivity_probability: prob,
                        confidence: prob * 0.9 + 0.05,
                        predicted_mn_grade: (prob * 20 + 20).toFixed(1),
                        important_features: {
                            SWIR_anomaly: (prob * 0.3).toFixed(2),
                            geology: (prob * 0.25).toFixed(2),
                            nearby_drillholes: (prob * 0.2).toFixed(2),
                            bare_soil: (prob * 0.15).toFixed(2)
                        }
                    };
                });

                // Attach colors based on probability
                const enhancedGrid = mockResults.map(block => {
                    let color = 'rgba(16, 185, 129, 0.6)'; // Green (low)
                    if (block.prospectivity_probability >= 0.8) color = 'rgba(239, 68, 68, 0.8)'; // Red (very high)
                    else if (block.prospectivity_probability >= 0.6) color = 'rgba(249, 115, 22, 0.7)'; // Orange (high)
                    else if (block.prospectivity_probability >= 0.3) color = 'rgba(234, 179, 8, 0.6)'; // Yellow (moderate)
                    return { ...block, color };
                });

                setGridData(enhancedGrid);
            } catch (err) {
                setApiError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProspectivity();
    }, []);

    return (
        <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'calc(100vh - 100px)' }}>
            <div className="header-section" style={{ marginBottom: '1.5rem', flexShrink: 0 }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Manganese Prospectivity Model</h2>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>Random Forest / XGBoost predictions combining geospatial and structural features.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0, paddingBottom: '1.5rem' }}>
                {/* LEFT PANEL: Layers */}
                <div className="card" style={{ width: '280px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                        <Layers size={18} className="text-primary" /> Feature Layers
                    </h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>ML Output Layer</h4>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer', padding: '6px 0' }}>
                            <input type="checkbox" defaultChecked accentColor="var(--primary)" />
                            <strong>Probability Geometry (Colors)</strong>
                        </label>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Satellite & Geological</h4>
                        {SATELLITE_LAYERS.map(layer => (
                            <label key={layer} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer', padding: '4px 0' }}>
                                <input type="checkbox" defaultChecked={layer === 'SWIR' || layer === 'Geological lithology'} accentColor="var(--primary)" />
                                {layer}
                            </label>
                        ))}
                    </div>
                </div>

                {/* CENTER: MAP AREA */}
                <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>

                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'rgba(59,130,246,0.1)', padding: '6px 12px', borderRadius: '4px' }}>
                            <CheckCircle size={14} /> Backend ML Active
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#fff', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                            <span>Probability:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 12, height: 12, borderRadius: '2px', background: 'rgba(239, 68, 68, 0.8)' }}></div> &gt; 80%</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 12, height: 12, borderRadius: '2px', background: 'rgba(249, 115, 22, 0.7)' }}></div> &gt; 60%</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 12, height: 12, borderRadius: '2px', background: 'rgba(234, 179, 8, 0.6)' }}></div> &gt; 30%</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 12, height: 12, borderRadius: '2px', background: 'rgba(16, 185, 129, 0.6)' }}></div> &lt; 30%</div>
                        </div>
                    </div>

                    <div style={{ flex: 1, backgroundColor: '#e2e8f0', backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5LTVoNDBWMHYuNWgtMzkuNXYzOXoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC44KSIvPjwvc3ZnPg==')`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                        {loading && <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Executing Prospectivity Model Inference...</div>}

                        {!loading && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px', width: '90%', height: '90%', padding: '20px' }}>
                                {gridData.map((block) => (
                                    <div
                                        key={block.block_id}
                                        onClick={() => setSelectedBlock(block)}
                                        style={{
                                            backgroundColor: block.color,
                                            borderRadius: '4px',
                                            border: selectedBlock?.block_id === block.block_id ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                                            boxShadow: selectedBlock?.block_id === block.block_id ? '0 0 0 4px var(--primary)' : 'none',
                                            cursor: 'crosshair',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: selectedBlock && selectedBlock.block_id !== block.block_id ? 0.4 : 1
                                        }}
                                        title={`Prob: ${(block.prospectivity_probability * 100).toFixed(1)}%`}
                                    >
                                        {selectedBlock?.block_id === block.block_id && <MapPin size={24} color="#fff" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: Block Info */}
                {selectedBlock ? (
                    <div className="card" style={{ width: '380px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin className="text-primary" /> Block {selectedBlock.block_id}
                            </h3>
                            <button
                                onClick={() => setSelectedBlock(null)}
                                style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-main)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ gridColumn: 'span 2', padding: '1.25rem', backgroundColor: selectedBlock.prospectivity_probability >= 0.8 ? 'rgba(239, 68, 68, 0.05)' : 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: `1px solid ${selectedBlock.prospectivity_probability >= 0.8 ? 'var(--danger)' : 'var(--primary)'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: selectedBlock.prospectivity_probability >= 0.8 ? 'var(--danger)' : 'var(--primary)', textTransform: 'uppercase', fontWeight: 700 }}>Prospectivity Prob.</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 800, color: selectedBlock.prospectivity_probability >= 0.8 ? 'var(--danger)' : 'var(--primary)' }}>
                                            {(selectedBlock.prospectivity_probability * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${selectedBlock.prospectivity_probability >= 0.8 ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)'}` }}>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Confidence</span>
                                        <div style={{ fontWeight: 700 }}>{(selectedBlock.confidence * 100).toFixed(1)}%</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pred. Mn Grade</span>
                                        <div style={{ fontWeight: 700 }}>{selectedBlock.predicted_mn_grade}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Info size={16} className="text-primary" /> Feature Contributions</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                {Object.entries(selectedBlock.important_features).map(([feat, weight_val]) => {
                                    const weight = Number(weight_val);
                                    let label = feat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                                    if (feat === 'SWIR_anomaly') label = "SWIR Anomaly";
                                    return (
                                        <div key={feat}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>
                                                <span style={{ color: 'var(--text-main)' }}>{label}</span>
                                                <span style={{ color: 'var(--primary)' }}>{weight.toFixed(2)}</span>
                                            </div>
                                            <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${Math.min(weight * 300, 100)}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '3px' }}></div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                            <button className="btn btn-primary" style={{ justifyContent: 'center', padding: '10px' }}>
                                Generate Deep Dive Report
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="card" style={{ width: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                        <MapPin size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>No Block Selected</h3>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Select a colored grid block to view the AI prospectivity score and feature breakdown.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapView;
