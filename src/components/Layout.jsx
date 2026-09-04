import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    BarChart3, Map, Globe, Layers, TrendingUp, AlertTriangle,
    BrainCircuit, Settings2, Database, FileText, Wrench,
    Menu, Bell, Search, User, ChevronLeft, LogOut
} from 'lucide-react';
import './Layout.css';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
    { path: '/dashboard', label: 'Executive Dashboard', icon: BarChart3, roles: ['Executive'] },
    { path: '/map', label: 'Prospectivity Map', icon: Map, roles: ['Geologist', 'Executive'] },
    { path: '/geological', label: 'Satellite Intelligence', icon: Globe, roles: ['Geologist', 'Executive'] },
    { path: '/geo-intel', label: 'Geological Intel', icon: Layers, roles: ['Geologist', 'Executive'] },
    { path: '/forecast', label: 'Production Forecast', icon: TrendingUp, roles: ['Mine Planner', 'Production Manager', 'Executive'] },
    { path: '/equipment', label: 'Equipment Monitoring', icon: Wrench, roles: ['Production Manager', 'Executive'] },
    { path: '/risks', label: 'Risk & Alerts', icon: AlertTriangle, roles: ['Production Manager', 'Executive'] },
    { path: '/ai', label: 'AI Recommendations', icon: BrainCircuit, roles: ['Mine Planner', 'Executive'] },
    { path: '/simulator', label: 'Scenario Simulator', icon: Settings2, roles: ['Mine Planner', 'Executive'] },
    { path: '/data', label: 'Data Management', icon: Database, roles: ['Production Manager', 'Executive'] },
    { path: '/reports', label: 'Reports', icon: FileText, roles: ['Executive'] },
];

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const allowedNavItems = NAV_ITEMS.filter(item => item.roles.includes(user?.role));

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    {!collapsed && <h1 className="logo-text">MOIL <span>AI</span></h1>}
                    {collapsed && <h1 className="logo-text logo-sm">M</h1>}
                    <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {allowedNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <NavLink to={item.path} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                        <Icon size={20} className="nav-icon" />
                                        {!collapsed && <span className="nav-label">{item.label}</span>}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="main-content">
                {/* Top Header */}
                <header className="top-header">
                    <div className="header-left">
                        <div className="search-bar">
                            <Search size={18} className="text-muted" />
                            <input type="text" placeholder="Search insights..." />
                        </div>

                        <div className="context-selector">
                            <select className="mine-select">
                                <option>All Mines (Corporate View)</option>
                                <option>Balaghat Mine</option>
                                <option>Dongri Buzurg Mine</option>
                                <option>Tirodi Mine</option>
                            </select>
                            <select className="date-select">
                                <option>Last 30 Days</option>
                                <option>Q3 2026</option>
                                <option>Year to Date</option>
                            </select>
                        </div>
                    </div>

                    <div className="header-right">
                        <button className="header-icon-btn">
                            <Bell size={20} />
                            <span className="badge-indicator"></span>
                        </button>
                        <div className="user-profile" style={{ position: 'relative' }}>
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                                onClick={() => setProfileOpen(!profileOpen)}
                            >
                                <div className="user-avatar">
                                    <User size={20} />
                                </div>
                                <div className="user-info">
                                    <span className="user-name">{user?.name || 'User'}</span>
                                    <span className="user-role">{user?.role || 'Role'}</span>
                                </div>
                            </div>

                            {/* Profile Dropdown */}
                            {profileOpen && (
                                <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '16px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px', width: '160px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 100 }}>
                                    <button onClick={handleLogout} className="btn" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', justifyContent: 'flex-start', color: 'var(--danger)', backgroundColor: 'transparent' }}>
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="scrollable-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
