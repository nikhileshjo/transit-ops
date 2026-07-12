import React from 'react';
import { Truck, Navigation, Settings, Fuel, AlertTriangle, LogOut } from 'lucide-react';

/**
 * Fleet Manager Dashboard Component
 * 
 * TODO / BACKEND REQUIREMENTS FOR INTEGRATION:
 * 1. Endpoint: GET /api/vehicles
 *    - Purpose: Fetch active, inactive, and in-maintenance fleet vehicles.
 *    - Service: `vehicle-service`
 * 
 * 2. Endpoint: GET /api/maintenance/schedules
 *    - Purpose: Fetch upcoming maintenance alerts, history, and service schedules.
 *    - Service: `maintenance-service`
 * 
 * 3. Endpoint: GET /api/fuel/logs
 *    - Purpose: Fetch fuel consumption analytics and efficiency statistics.
 *    - Service: `fuel-service`
 * 
 * 4. WebSocket: /ws/telemetry
 *    - Purpose: Real-time tracking and GPS coordinates of vehicles on the map.
 */
export default function FleetManagerDashboard({ user, onLogout }) {
  /* 
    TODO: STATE FOR BACKEND INTEGRATION
    Uncomment and use these states to store dynamic data fetched from the microservices.
    
    const [vehicles, setVehicles] = React.useState([]);
    const [maintenanceAlerts, setMaintenanceAlerts] = React.useState([]);
    const [fuelStats, setFuelStats] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
  */

  /* 
    TODO: API REQUEST INTEGRATION
    Uncomment this hook to fetch metrics on component load.
    
    React.useEffect(() => {
      const loadFleetData = async () => {
        try {
          setLoading(true);
          
          // 1. Fetch Fleet Vehicles from /services/vehicle-service
          // const resVehicles = await fetch('http://localhost:5000/api/vehicles', {
          //   headers: { 'Authorization': `Bearer ${user.token}` }
          // });
          // const vehiclesData = await resVehicles.json();
          // setVehicles(vehiclesData);

          // 2. Fetch Maintenance Schedule from /services/maintenance-service
          // const resMaintenance = await fetch('http://localhost:5000/api/maintenance/schedules', {
          //   headers: { 'Authorization': `Bearer ${user.token}` }
          // });
          // const maintenanceData = await resMaintenance.json();
          // setMaintenanceAlerts(maintenanceData);

          // 3. Fetch Fuel Stats from /services/fuel-service
          // const resFuel = await fetch('http://localhost:5000/api/fuel/logs/summary', {
          //   headers: { 'Authorization': `Bearer ${user.token}` }
          // });
          // const fuelData = await resFuel.json();
          // setFuelStats(fuelData);

        } catch (err) {
          setError(err.message || 'Failed to fetch fleet dashboard data');
        } finally {
          setLoading(false);
        }
      };
      
      loadFleetData();
    }, [user.token]);
  */

  return (
    <div className="dashboard-shell fade-in">
      {/* Dashboard Top Header */}
      <header className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>
            <span className="text-gradient">Fleet Manager Portal</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Welcome back, {user.username} | System Status: Optimal
          </p>
        </div>
        <button onClick={onLogout} className="btn-secondary" style={{ color: 'var(--color-error)' }}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      {/* Quick Summary Cards */}
      <section className="dashboard-grid">
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Active Fleet</span>
            <Truck size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '4px 0' }}>42 / 45</h2>
          <p style={{ color: 'var(--color-success)', fontSize: '0.8rem' }}>● 3 Vehicles in Maintenance</p>
        </div>

        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Avg Fuel Economy</span>
            <Fuel size={20} style={{ color: 'var(--color-secondary)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '4px 0' }}>7.8 MPG</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Target: 8.2 MPG</p>
        </div>

        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Pending Maintenance</span>
            <Settings size={20} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '4px 0' }}>4 Alerts</h2>
          <p style={{ color: 'var(--color-error)', fontSize: '0.8rem' }}>▲ 1 Critical Engine Fault</p>
        </div>
      </section>

      {/* Main Focus Area & Integration Notice */}
      <main className="dashboard-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', borderStyle: 'dashed' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>Fleet Operations Console</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          This interface is currently loaded in design preview mode. When linked with the backend systems, this workspace will render interactive tables, live GPS vehicle tracking maps (OpenStreetMap/Google Maps API), fuel logs, and scheduling actions.
        </p>

        <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glow)' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation size={16} /> Backend Integration Points:
          </h4>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li><code>/services/vehicle-service</code>: To update vehicle details, specs, status, and assignment.</li>
            <li><code>/services/maintenance-service</code>: To trigger maintenance work orders and track maintenance costs.</li>
            <li><code>/services/fuel-service</code>: To match fuel purchases against vehicle telematics.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
