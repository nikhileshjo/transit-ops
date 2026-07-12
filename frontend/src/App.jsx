import React, { useState } from 'react';
import Login from './components/Login';
import FleetManagerDashboard from './components/dashboards/FleetManagerDashboard';
import DispatcherDashboard from './components/dashboards/DispatcherDashboard';
import SafetyOfficerDashboard from './components/dashboards/SafetyOfficerDashboard';
import FinancialAnalystDashboard from './components/dashboards/FinancialAnalystDashboard';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Route to the appropriate dashboard component based on selected role
  switch (user.role) {
    case 'Fleet Manager':
      return <FleetManagerDashboard user={user} onLogout={handleLogout} />;
    case 'Dispatcher':
      return <DispatcherDashboard user={user} onLogout={handleLogout} />;
    case 'Safety Officer':
      return <SafetyOfficerDashboard user={user} onLogout={handleLogout} />;
    case 'Financial Analyst':
      return <FinancialAnalystDashboard user={user} onLogout={handleLogout} />;
    default:
      return (
        <div className="dashboard-shell fade-in" style={{ textAlign: 'center', marginTop: '100px' }}>
          <div className="dashboard-card">
            <h2 style={{ color: 'var(--color-error)' }}>Unauthorized Role</h2>
            <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>
              The role "{user.role}" does not have an assigned dashboard.
            </p>
            <button onClick={handleLogout} className="btn-primary" style={{ maxWidth: '200px', margin: '0 auto' }}>
              Return to Login
            </button>
          </div>
        </div>
      );
  }
}
