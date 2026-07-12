import React from 'react';
import { Calendar, Users, MapPin, Radio, Clock, LogOut } from 'lucide-react';

/**
 * Dispatcher Dashboard Component
 * 
 * TODO / BACKEND REQUIREMENTS FOR INTEGRATION:
 * 1. Endpoint: GET /api/trips
 *    - Purpose: Fetch active, scheduled, completed, and delayed trips.
 *    - Service: `trip-service`
 * 
 * 2. Endpoint: GET /api/drivers/available
 *    - Purpose: Fetch list of active drivers currently available for assignment.
 *    - Service: `driver-service`
 * 
 * 3. Endpoint: POST /api/trips/assign
 *    - Purpose: Assign a vehicle and driver to a shipment/trip route.
 *    - Service: `trip-service`
 * 
 * 4. Endpoint: POST /api/notifications/dispatch
 *    - Purpose: Send SMS/Email notifications to drivers about newly assigned trips.
 *    - Service: `notification-service`
 */
export default function DispatcherDashboard({ user, onLogout }) {
  /* 
    TODO: STATE FOR BACKEND INTEGRATION
    Uncomment and use these states to store dynamic data fetched from the microservices.
    
    const [trips, setTrips] = React.useState([]);
    const [availableDrivers, setAvailableDrivers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
  */

  /* 
    TODO: API REQUEST INTEGRATION (FETCH DATA)
    Uncomment this hook to fetch dispatch data on component load.
    
    React.useEffect(() => {
      const loadDispatchData = async () => {
        try {
          setLoading(true);
          
          // 1. Fetch Active/Scheduled Trips from /services/trip-service
          // const resTrips = await fetch('http://localhost:5000/api/trips', {
          //   headers: { 'Authorization': `Bearer ${user.token}` }
          // });
          // const tripsData = await resTrips.json();
          // setTrips(tripsData);

          // 2. Fetch Available Drivers from /services/driver-service
          // const resDrivers = await fetch('http://localhost:5000/api/drivers/available', {
          //   headers: { 'Authorization': `Bearer ${user.token}` }
          // });
          // const driversData = await resDrivers.json();
          // setAvailableDrivers(driversData);

        } catch (err) {
          setError(err.message || 'Failed to fetch dispatch dashboard data');
        } finally {
          setLoading(false);
        }
      };
      
      loadDispatchData();
    }, [user.token]);
  */

  /*
    TODO: API REQUEST INTEGRATION (WRITE ACTION)
    Example handler for assigning a driver to a trip and triggering a dispatch notification.
    
    const handleAssignTrip = async (tripId, driverId) => {
      try {
        // 1. Save assignment in trip-service
        const resAssign = await fetch('http://localhost:5000/api/trips/assign', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ tripId, driverId })
        });
        
        if (!resAssign.ok) throw new Error('Failed to update trip assignment');
        
        // 2. Trigger SMS/push alert in notification-service
        await fetch('http://localhost:5000/api/notifications/dispatch', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ driverId, message: `New trip assigned: ${tripId}` })
        });
        
        // Refresh local trip/driver states after assignment
        // loadDispatchData();
      } catch (err) {
        console.error(err.message);
      }
    };
  */

  return (
    <div className="dashboard-shell fade-in">
      {/* Dashboard Top Header */}
      <header className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>
            <span className="text-gradient-cyan">Dispatcher Control Room</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Welcome back, {user.username} | Communications Status: Online
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
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Active Trips</span>
            <MapPin size={20} style={{ color: 'var(--color-secondary)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '4px 0' }}>18</h2>
          <p style={{ color: 'var(--color-success)', fontSize: '0.8rem' }}>● 12 On Schedule | ▲ 6 Delayed</p>
        </div>

        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Available Drivers</span>
            <Users size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '4px 0' }}>14</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Out of 32 on roster</p>
        </div>

        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Unassigned Loads</span>
            <Calendar size={20} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '4px 0' }}>5</h2>
          <p style={{ color: 'var(--color-error)', fontSize: '0.8rem' }}>▲ Require dispatch today</p>
        </div>
      </section>

      {/* Main Focus Area & Integration Notice */}
      <main className="dashboard-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', borderStyle: 'dashed' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-secondary)' }}>Trip Dispatching Board</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          This console handles load assignment, scheduling, and live status adjustments. When linked with the backend microservices, dispatchers can build routes, drag-and-drop drivers onto trips, and monitor real-time transit times against SLAs.
        </p>

        <div style={{ padding: '16px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={16} /> Backend Integration Points:
          </h4>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li><code>/services/trip-service</code>: To create, cancel, re-route, and monitor specific freight trips.</li>
            <li><code>/services/driver-service</code>: To inspect driver availability status, HOS (Hours of Service) logs, and contacts.</li>
            <li><code>/services/notification-service</code>: To trigger text/push messages to the drivers' transit app devices.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
