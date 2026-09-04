import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import Forecast from './pages/Forecast';
import Risks from './pages/Risks';
import AIRecommendations from './pages/AIRecommendations';
import Simulator from './pages/Simulator';
import Geological from './pages/Geological';
import Equipment from './pages/Equipment';
import GeologicalIntel from './pages/GeologicalIntel';
import DataManagement from './pages/DataManagement';
import Reports from './pages/Reports';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized roles to their primary module
    if (user.role === 'Geologist') return <Navigate to="/map" replace />;
    if (user.role === 'Mine Planner') return <Navigate to="/simulator" replace />;
    if (user.role === 'Production Manager') return <Navigate to="/risks" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  // Custom dashboard redirect based on role
  const getIndexRedirect = () => {
    if (!user) return '/login';
    if (user.role === 'Geologist') return '/map';
    if (user.role === 'Mine Planner') return '/simulator';
    if (user.role === 'Production Manager') return '/risks';
    return '/dashboard';
  };

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to={getIndexRedirect()} replace />} />

        <Route path="dashboard" element={<ProtectedRoute allowedRoles={['Executive']}><Dashboard /></ProtectedRoute>} />
        <Route path="map" element={<ProtectedRoute allowedRoles={['Geologist', 'Executive']}><MapView /></ProtectedRoute>} />
        <Route path="geological" element={<ProtectedRoute allowedRoles={['Geologist', 'Executive']}><Geological /></ProtectedRoute>} />
        <Route path="geo-intel" element={<ProtectedRoute allowedRoles={['Geologist', 'Executive']}><GeologicalIntel /></ProtectedRoute>} />

        <Route path="forecast" element={<ProtectedRoute allowedRoles={['Mine Planner', 'Production Manager', 'Executive']}><Forecast /></ProtectedRoute>} />
        <Route path="equipment" element={<ProtectedRoute allowedRoles={['Production Manager', 'Executive']}><Equipment /></ProtectedRoute>} />
        <Route path="risks" element={<ProtectedRoute allowedRoles={['Production Manager', 'Executive']}><Risks /></ProtectedRoute>} />

        <Route path="ai" element={<ProtectedRoute allowedRoles={['Mine Planner', 'Executive']}><AIRecommendations /></ProtectedRoute>} />
        <Route path="simulator" element={<ProtectedRoute allowedRoles={['Mine Planner', 'Executive']}><Simulator /></ProtectedRoute>} />

        <Route path="data" element={<ProtectedRoute allowedRoles={['Production Manager', 'Executive']}><DataManagement /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute allowedRoles={['Executive']}><Reports /></ProtectedRoute>} />
      </Route>

      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
