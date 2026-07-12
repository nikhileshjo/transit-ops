import React from 'react';
import { Shield, Eye, AlertCircle, FileText, CheckCircle, LogOut } from 'lucide-react';

/**
 * Safety Officer Dashboard Component
 * 
 * TODO / BACKEND REQUIREMENTS FOR INTEGRATION:
 * 1. Endpoint: GET /api/safety/incidents
 *    - Purpose: Fetch logged safety incidents, accidents, near-misses, and open investigations.
 *    - Service: `reporting-service` or dedicated safety/incident service
 * 
 * 2. Endpoint: GET /api/drivers/scores
 *    - Purpose: Fetch driving behavior analytics (hard braking, speeding, idle time).
 *    - Service: `driver-service` + telemetry integration
 * 
 * 3. Endpoint: GET /api/compliance/status
 *    - Purpose: Fetch driver HOS (Hours of Service) violations, ELD compliance flags, and license expirations.
 *    - Service: `driver-service`
 */
export default function SafetyOfficerDashboard({ user, onLogout, onSwitchRole }) {
  /* 
    TODO: STATE FOR BACKEND INTEGRATION
    Uncomment and use these states to store dynamic data fetched from the microservices.
    
    const [incidents, setIncidents] = React.useState([]);
    const [driverSafetyScores, setDriverSafetyScores] = React.useState([]);
    const [complianceStatus, setComplianceStatus] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
  */

  /* 
    TODO: API REQUEST INTEGRATION
    Uncomment this hook to fetch safety, compliance, and score metrics on component load.
    
    React.useEffect(() => {
      const loadSafetyData = async () => {
        try {
          setLoading(true);
          
          // 1. Fetch safety incidents from /services/reporting-service (or incident database)
          // const resIncidents = await fetch('http://localhost:5000/api/safety/incidents', {
          //   headers: { 'Authorization': `Bearer ${user.token}` }
          // });
          // const incidentsData = await resIncidents.json();
          // setIncidents(incidentsData);

          // 2. Fetch driver safety scores from /services/driver-service
          // const resScores = await fetch('http://localhost:5000/api/drivers/scores', {
          //   headers: { 'Authorization': `Bearer ${user.token}` }
          // });
          // const scoresData = await resScores.json();
          // setDriverSafetyScores(scoresData);

          // 3. Fetch compliance status (ELD logs/HOS checks) from /services/driver-service
          // const resCompliance = await fetch('http://localhost:5000/api/compliance/status', {
          //   headers: { 'Authorization': `Bearer ${user.token}` }
          // });
          // const complianceData = await resCompliance.json();
          // setComplianceStatus(complianceData);

        } catch (err) {
          setError(err.message || 'Failed to fetch safety compliance metrics');
        } finally {
          setLoading(false);
        }
      };
      
      loadSafetyData();
    }, [user.token]);
  */

  return (
    <div className="dashboard-shell fade-in">
      {/* Dashboard Top Header */}
      <header className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>
            <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' }}>Safety & Compliance Center</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Welcome back, {user.name || user.username} | Compliance Shield: Active
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {user.roles && user.roles.length > 1 && (
            <button onClick={onSwitchRole} className="btn-secondary">
              Switch Role
            </button>
          )}
          <button onClick={onLogout} className="btn-secondary" style={{ color: 'var(--color-error)' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Quick Summary Cards */}
      <section className="dashboard-grid">
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Safety Rating</span>
            <Shield size={20} style={{ color: 'var(--color-success)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '4px 0' }}>94%</h2>
          <p style={{ color: 'var(--color-success)', fontSize: '0.8rem' }}>● Excellent (Target &gt;90%)</p>
        </div>

        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Active Violations</span>
            <AlertCircle size={20} style={{ color: 'var(--color-error)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '4px 0' }}>2</h2>
          <p style={{ color: 'var(--color-error)', fontSize: '0.8rem' }}>▲ HOS Over-hours alerts</p>
        </div>

        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Audits Pending</span>
            <FileText size={20} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '4px 0' }}>1</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Quarterly safety check due</p>
        </div>
      </section>

      {/* Main Focus Area & Integration Notice */}
      <main className="dashboard-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', borderStyle: 'dashed' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-success)' }}>Incidents & Telemetry Auditing</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          This console is designed for reviewing telematics alerts, inspecting safety scores, and logging incident investigations. Connected backend systems will populate logs containing vehicle coordinates, driver speed charts, and accident investigation reports.
        </p>

        <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={16} /> Backend Integration Points:
          </h4>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li><code>/services/driver-service</code>: To update driving histories, licenses, and safety metrics.</li>
            <li><code>/services/reporting-service</code>: To compile audit reports and generate safety incident summaries.</li>
            <li>Telematics Streams (e.g. IoT Edge logs): To receive real-time speed, impact, and route behavior.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
