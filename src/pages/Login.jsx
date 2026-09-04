import React, { useState } from 'react';
import { Lock, User, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DEMO_ACCOUNTS = {
    geologist: { id: 'GEO-101', role: 'Geologist', name: 'Dr. Sarah Connor' },
    planner: { id: 'PLN-202', role: 'Mine Planner', name: 'James Holden' },
    manager: { id: 'MGR-303', role: 'Production Manager', name: 'Robert Ford' },
    executive: { id: 'EXE-404', role: 'Executive', name: 'Elias Tyrell' },
};

const Login = () => {
    const [empId, setEmpId] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('executive');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (DEMO_ACCOUNTS[role]) {
            // In a real app we'd verify pw and id against backend. For demo, we log in with the selected role.
            login({
                ...DEMO_ACCOUNTS[role],
                providedId: empId
            });
            // Navigation is deferred so AuthContext propagates. Re-rendering will push to correct route via ProtectedRoute
            setTimeout(() => {
                navigate('/');
            }, 100);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-main)', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', margin: '0 1rem', border: '1px solid var(--border)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="logo-text" style={{ color: 'var(--text-main)', fontSize: '2.5rem' }}>MOIL <span style={{ color: 'var(--primary)' }}>AI</span></h1>
                    <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Intelligent Manganese Management.</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Employee ID / Email</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="text" value={empId} onChange={e => setEmpId(e.target.value)} required placeholder="EMP-10294" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '6px', border: '1px solid var(--border)', outline: 'none' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '6px', border: '1px solid var(--border)', outline: 'none' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Simulate Role (Demo)</label>
                        <div style={{ position: 'relative' }}>
                            <Briefcase size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '6px', border: '1px solid var(--border)', outline: 'none', appearance: 'none', backgroundColor: 'var(--bg-main)', cursor: 'pointer' }}>
                                <option value="geologist">Geologist (Geo Auth)</option>
                                <option value="planner">Mine Planner (Sim Auth)</option>
                                <option value="manager">Production Manager (Risk/Ops Auth)</option>
                                <option value="executive">Executive / Decision Maker (Full Auth)</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" defaultChecked /> Remember me
                        </label>
                        <a href="#" style={{ color: 'var(--primary)', fontWeight: 500 }} onClick={e => e.preventDefault()}>Forgot password?</a>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}>
                        Secure Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
