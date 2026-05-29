import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MedicalDataProvider } from './context/MedicalDataContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BloodPressureForm from './pages/BloodPressureForm';
import GlucoseForm from './pages/GlucoseForm';
import History from './pages/History';
import DashboardLayout from './layouts/DashboardLayout';

// Componente para proteger rotas privadas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--text-primary)'
      }}>
        Carregando Sessão...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <MedicalDataProvider>
        <Router>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rotas Protegidas */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/blood-pressure" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <BloodPressureForm />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/glucose" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <GlucoseForm />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/history" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <History />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Redirecionamento Padrão */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </MedicalDataProvider>
    </AuthProvider>
  );
};

export default App;
