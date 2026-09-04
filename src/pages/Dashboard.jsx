import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';
import {
    AlertTriangle, CheckCircle, TrendingDown, TrendingUp,
    Database, Target, Activity, Map, Wrench, CloudRain, ShieldAlert, Cpu
} from 'lucide-react';

const Dashboard = () => {

    // Default fallback state (loading)
    const [mlShortfall, setMlShortfall] = useState(null);

    useEffect(() => {
        // Simulate fetching the /api/forecast ML response
        const fetchMLData = async () => {
            // Mocking the EXACT Shortfall API response requested
            const mockResponse = {
                "predicted_production": 38200,
                "target_production": 45000,
                "shortfall": 6800,
                "probability": 0.72,
                "risk": "HIGH",
                "causes": {
                    "equipment": 0.45,
                    "rainfall": 0.25,
                    "blasting": 0.15,
                    "ore_availability": 0.10,
                    "others": 0.05
                }
            };

            setTimeout(() => setMlShortfall(mockResponse), 600);
        };
        fetchMLData();
    }, []);

    // Other Mock Data that would be fetched from other API endpoints in prod
    const forecastData = [
        { month: 'Jul', target: 45000, predicted: 44500 },
        { month: 'Aug', target: 45000, predicted: 43200 },
        { month: 'Sep', target: 45000, predicted: 40100 },
        { month: 'Oct', target: 45000, predicted: mlShortfall ? mlShortfall.predicted_production : 38200 }, // Sync with ML
    ];

    const riskData = [
        { category: 'Equipment', risk: mlShortfall ? mlShortfall.causes.equipment * 100 * 2 : 85 }, // Extrapolated from ML weights
        { category: 'Weather', risk: mlShortfall ? mlShortfall.causes.rainfall * 100 * 2.5 : 60 },
        { category: 'Blasting', risk: mlShortfall ? mlShortfall.causes.blasting * 100 * 2.5 : 40 },
        { category: 'Ore Avail.', risk: mlShortfall ? mlShortfall.causes.ore_availability * 100 * 3 : 75 },
    ];

    const rootCauseData = mlShortfall ? [
        { name: 'Equipment Downtime', value: mlShortfall.causes.equipment * 100, color: '#ef4444' },
        { name: 'Heavy Rainfall', value: mlShortfall.causes.rainfall * 100, color: '#f59e0b' },
        { name: 'Blast Delay', value: mlShortfall.causes.blasting * 100, color: '#3b82f6' },
        { name: 'Ore Availability', value: mlShortfall.causes.ore_availability * 100, color: '#8b5cf6' },
        { name: 'Others', value: mlShortfall.causes.others * 100, color: '#94a3b8' },
    ] : [];

    const aiRecommendations = [
        { id: 1, action: 'Re-deploy Excavator EX-04 to Block B', priority: 'High', impact: 'Prevents 1200T shortfall', reason: mlShortfall ? `Equipment accounts for ${(mlShortfall.causes.equipment * 100).toFixed(0)}% of risk` : 'Loading...' },
        { id: 2, action: 'Advance blasting operation by 1 day', priority: 'Medium', impact: 'Maintains timeline', reason: 'High chance of rain on Day 4' },
    ];

    const recentAlerts = [
        { id: 1, time: '10:42 AM', location: 'Balaghat Mine (Block B)', type: 'Equipment Failure', severity: 'Critical', action: 'Dispatch maintenance team' },
        { id: 2, time: '09:15 AM', location: 'Dongri Buzurg', type: 'Weather Warning', severity: 'Warning', action: 'Halt open-pit blasting' },
    ];

    return (
        <div className="dashboard-container" style={{ paddingBottom: '2rem' }}>
            <div className="header-section" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Executive Dashboard</h2>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>Global overview of MOIL Manganese Reserve & Production Management</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {!mlShortfall ? (
                        <span className="badge" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ping ML Engine...</span>
                    ) : (
                        <span className={`badge ${mlShortfall.risk === 'HIGH' ? 'bg-danger' : 'bg-warning'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                            Risk Level: {mlShortfall.risk}
                        </span>
                    )}
                </div>
            </div>

            {/* KPI Section - 8 Cards */}
            <div className="grid-container" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
                <div className="card">
                    <div className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Database size={16} /> Estimated Reserve</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, margin: '8px 0' }}>2.4M <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>Tonnes</span></div>
                </div>
                <div className="card">
                    <div className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={16} /> Current Monthly Prod.</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, margin: '8px 0' }}>18,400 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>Tonnes</span></div>
                </div>

                {/* Dynamically Populated ML Metrics */}
                <div className="card">
                    <div className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={16} /> Target Monthly Prod.</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, margin: '8px 0' }}>
                        {mlShortfall ? mlShortfall.target_production.toLocaleString() : '...'} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>Tonnes</span>
                    </div>
                </div>
                <div className="card">
                    <div className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={16} className="text-warning" /> Predicted Production</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, margin: '8px 0', color: 'var(--warning)' }}>
                        {mlShortfall ? mlShortfall.predicted_production.toLocaleString() : '...'} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--warning)' }}>Tonnes</span>
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <div className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingDown size={16} className="text-danger" /> Expected Shortfall</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, margin: '8px 0', color: 'var(--danger)' }}>
                        {mlShortfall ? mlShortfall.shortfall.toLocaleString() : '...'} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--danger)' }}>Tonnes</span>
                    </div>
                </div>
                <div className="card">
                    <div className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} className="text-warning" /> Shortfall Probability</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, margin: '8px 0', color: 'var(--warning)' }}>
                        {mlShortfall ? `${(mlShortfall.probability * 100).toFixed(0)}%` : '...'}
                    </div>
                </div>

                <div className="card">
                    <div className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Wrench size={16} /> Active Equipment</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, margin: '8px 0' }}>142 / 156</div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <div className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldAlert size={16} className="text-danger" /> High-Risk Alerts</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, margin: '8px 0', color: 'var(--danger)' }}>12</div>
                </div>
            </div>

            <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '2rem' }}>
                {/* SECTION 1: Manganese Prospectivity Overview */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>SECTION 1 – Manganese Prospectivity Map Link</h3></div>
                    <div style={{ flex: 1, backgroundColor: '#e2e8f0', borderRadius: '8px', minHeight: '300px', marginTop: '1rem', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Map size={48} className="text-muted" />
                        <div style={{ position: 'absolute', top: 12, right: 12, backgroundColor: 'white', padding: '8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}><div style={{ width: 12, height: 12, background: 'var(--danger)' }}></div> Very High</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}><div style={{ width: 12, height: 12, background: 'var(--warning)' }}></div> High</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}><div style={{ width: 12, height: 12, background: '#fde047' }}></div> Medium</div>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: Production Forecast */}
                <div className="card">
                    <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>SECTION 2 – Production Forecast</h3></div>
                    <div style={{ height: '300px', marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                <Legend iconType="circle" />
                                <Area type="monotone" dataKey="predicted" name="Predicted Production" stroke="var(--primary)" fill="rgba(59, 130, 246, 0.2)" strokeWidth={3} />
                                <Area type="step" dataKey="target" name="Target Production" stroke="var(--success)" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '2rem' }}>
                {/* SECTION 3: Risk Summary */}
                <div className="card">
                    <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>SECTION 3 – Shortfall Risk Factors</h3></div>
                    <div style={{ height: '250px' }}>
                        {mlShortfall ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={riskData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                                    <XAxis type="number" domain={[0, 100]} hide />
                                    <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }} width={120} />
                                    <Tooltip cursor={{ fill: 'var(--bg-main)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="risk" name="Severity Index" radius={[0, 4, 4, 0]} barSize={24}>
                                        {
                                            riskData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.risk >= 75 ? 'var(--danger)' : entry.risk >= 50 ? 'var(--warning)' : 'var(--success)'} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div style={{ color: 'var(--text-muted)' }}>Loading AI outputs...</div>}
                    </div>
                </div>

                {/* SECTION 4: Root Cause Contribution */}
                <div className="card">
                    <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>SECTION 4 – ML Root Cause Breakdown</h3></div>
                    <div style={{ height: '250px', display: 'flex', alignItems: 'center' }}>
                        {mlShortfall ? (
                            <>
                                <ResponsiveContainer width="50%" height="100%">
                                    <PieChart>
                                        <Pie data={rootCauseData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {rootCauseData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ width: '50%', paddingLeft: '1rem' }}>
                                    {rootCauseData.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.875rem', fontWeight: 600 }}>
                                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }}></div>
                                            <div style={{ flex: 1, color: 'var(--text-muted)' }}>{item.name}</div>
                                            <div>{item.value.toFixed(0)}%</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : <div style={{ paddingLeft: '1rem', color: 'var(--text-muted)' }}>Aggregating root causes...</div>}
                    </div>
                </div>
            </div>

            <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '2rem' }}>
                {/* SECTION 5: AI Recommendations */}
                <div className="card">
                    <div className="card-header"><h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Cpu size={20} className="text-primary" /> SECTION 5 – AI Engine Actions</h3></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        {aiRecommendations.map(rec => (
                            <div key={rec.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.25rem', backgroundColor: 'var(--bg-main)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700 }}>{rec.action}</h4>
                                    <span className={`badge ${rec.priority === 'High' ? 'bg-danger' : rec.priority === 'Medium' ? 'bg-warning' : 'bg-success'}`}>{rec.priority} Priority</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '4px', fontSize: '0.875rem', marginBottom: '8px' }}>
                                    <strong style={{ color: 'var(--text-muted)' }}>Reason:</strong> <span>{rec.reason}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '4px', fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>
                                    <strong style={{ color: 'var(--text-muted)' }}>Impact:</strong> <span>{rec.impact}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECTION 6: Recent Alerts */}
                <div className="card">
                    <div className="card-header"><h3 className="card-title" style={{ margin: 0 }}>SECTION 6 – Recent Alerts</h3></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        {recentAlerts.map(alert => (
                            <div key={alert.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', borderLeft: `4px solid ${alert.severity === 'Critical' ? 'var(--danger)' : alert.severity === 'High' ? 'var(--warning)' : 'var(--info)'}` }}>
                                <div style={{ marginTop: '2px' }}>
                                    {alert.type.includes('Weather') ? <CloudRain size={20} className="text-warning" /> : <AlertTriangle size={20} className="text-danger" />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{alert.type}</h4>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{alert.time}</span>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '8px' }}><strong>Location:</strong> {alert.location}</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', display: 'inline-flex', padding: '6px 10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '6px' }}>
                                        Recommended Action: {alert.action}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
