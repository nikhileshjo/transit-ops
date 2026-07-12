import React, { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import FleetManagerDashboard from './components/dashboards/FleetManagerDashboard';
import DispatcherDashboard from './components/dashboards/DispatcherDashboard';
import SafetyOfficerDashboard from './components/dashboards/SafetyOfficerDashboard';
import FinancialAnalystDashboard from './components/dashboards/FinancialAnalystDashboard';
import { Truck, Radio, Shield, DollarSign, LogOut } from 'lucide-react';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.roles && userData.roles.length === 1) {
      setActiveRole(userData.roles[0]);
    } else {
      setActiveRole(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveRole(null);
  };

  const handleSwitchRole = () => {
    setActiveRole(null);
  };

  // Helper to get the correct icon for each role
  const getRoleIcon = (role) => {
    switch (role) {
      case 'Fleet Manager':
        return <Truck size={24} style={{ color: 'var(--color-primary)' }} />;
      case 'Dispatcher':
        return <Radio size={24} style={{ color: 'var(--color-secondary)' }} />;
      case 'Safety Officer':
        return <Shield size={24} style={{ color: 'var(--color-success)' }} />;
      case 'Financial Analyst':
        return <DollarSign size={24} style={{ color: 'var(--color-accent)' }} />;
      default:
        return null;
    }
  };

  // 1. Not Logged In
  if (!user) {
    if (isRegistering) {
      return <Signup onBackToLogin={() => setIsRegistering(false)} />;
    }
    return <Login onLoginSuccess={handleLoginSuccess} onGoToSignup={() => setIsRegistering(true)} />;
  }

  // 2. Logged In, but multiple roles and none selected yet
  if (!activeRole) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', padding: '20px' }}>
        <div className="bg-mesh-container">
          <div className="bg-mesh-blob blob-1"></div>
          <div className="bg-mesh-blob blob-2"></div>
          <div className="bg-mesh-blob blob-3"></div>
        </div>

        <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '520px', padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
            <span className="text-gradient">Select Workspace</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
            Welcome back, {user.name || user.username}. Please select a dashboard to enter.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {user.roles && user.roles.map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className="dashboard-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '20px',
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-light)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-neon)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getRoleIcon(role)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)' }}>{role}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Enter workspace portal</span>
                </div>
              </button>
            ))}
          </div>

          <button 
            onClick={handleLogout} 
            className="btn-secondary" 
            style={{ color: 'var(--color-error)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <LogOut size={16} /> Logout Account
          </button>
        </div>
      </div>
    );
  }

  // 3. Logged In & Role Selected: Render corresponding dashboard
  switch (activeRole) {
    case 'Fleet Manager':
      return <FleetManagerDashboard user={user} onLogout={handleLogout} onSwitchRole={handleSwitchRole} />;
    case 'Dispatcher':
      return <DispatcherDashboard user={user} onLogout={handleLogout} onSwitchRole={handleSwitchRole} />;
    case 'Safety Officer':
      return <SafetyOfficerDashboard user={user} onLogout={handleLogout} onSwitchRole={handleSwitchRole} />;
    case 'Financial Analyst':
      return <FinancialAnalystDashboard user={user} onLogout={handleLogout} onSwitchRole={handleSwitchRole} />;
    default:
      return (
        <div className="dashboard-shell fade-in" style={{ textAlign: 'center', marginTop: '100px' }}>
          <div className="dashboard-card">
            <h2 style={{ color: 'var(--color-error)' }}>Unauthorized Role</h2>
            <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>
              The role "{activeRole}" does not have an assigned dashboard.
            </p>
            <button onClick={handleLogout} className="btn-primary" style={{ maxWidth: '200px', margin: '0 auto' }}>
              Return to Login
            </button>
          </div>
        </div>
      );
  }
}
