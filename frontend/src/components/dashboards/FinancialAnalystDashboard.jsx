import React from 'react';
import { DollarSign, TrendingUp, BarChart2, PieChart, Briefcase, LogOut } from 'lucide-react';

/**
 * Financial Analyst Dashboard Component
 * 
 * TODO / BACKEND REQUIREMENTS FOR INTEGRATION:
 * 1. Endpoint: GET /api/expenses
 *    - Purpose: Fetch transactional expense lines (tolls, vehicle repairs, driver payroll).
 *    - Service: `expense-service`
 * 
 * 2. Endpoint: GET /api/financials/cost-per-mile
 *    - Purpose: Fetch calculated operational cost per mile.
 *    - Service: `reporting-service` + telemetry datasets
 * 
 * 3. Endpoint: GET /api/fuel/transactions
 *    - Purpose: Fetch fuel purchase values, receipts matching, and taxation compliance documents.
 *    - Service: `fuel-service`
 */
export default function FinancialAnalystDashboard({ user, onLogout }) {
  /* 
    TODO: STATE FOR BACKEND INTEGRATION
    Uncomment and use these states to store dynamic data fetched from the microservices.
    
    const [expenses, setExpenses] = React.useState([]);
    const [costPerMile, setCostPerMile] = React.useState(null);
    const [fuelTransactions, setFuelTransactions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
  */

  /* 
    TODO: API REQUEST INTEGRATION
    Uncomment this hook to fetch ledger balances, CPM calculations, and fuel logs.
    
    React.useEffect(() => {
      const loadFinancialData = async () => {
        try {
          setLoading(true);
          
          // 1. Fetch expenses data from /services/expense-service
          // const resExpenses = await fetch('http://localhost:5000/api/expenses', {
          //   headers: { 'Authorization': `Bearer ${user.token}` }
          // });
          // const expensesData = await resExpenses.json();
          // setExpenses(expensesData);

          // 2. Fetch Cost-Per-Mile metric from /services/reporting-service
          // const resCPM = await fetch('http://localhost:5000/api/financials/cost-per-mile', {
          //   headers: { 'Authorization': `Bearer ${user.token}` }
          // });
          // const cpmData = await resCPM.json();
          // setCostPerMile(cpmData);

          // 3. Fetch Fuel purchases from /services/fuel-service
          // const resFuel = await fetch('http://localhost:5000/api/fuel/transactions', {
          //   headers: { 'Authorization': `Bearer ${user.token}` }
          // });
          // const fuelData = await resFuel.json();
          // setFuelTransactions(fuelData);

        } catch (err) {
          setError(err.message || 'Failed to fetch financial audit data');
        } finally {
          setLoading(false);
        }
      };
      
      loadFinancialData();
    }, [user.token]);
  */

  return (
    <div className="dashboard-shell fade-in">
      {/* Dashboard Top Header */}
      <header className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>
            <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' }}>Financial Intelligence Hub</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Welcome back, {user.username} | Currency Node: Active
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
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Monthly Spend</span>
            <DollarSign size={20} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '4px 0' }}>$124,840</h2>
          <p style={{ color: 'var(--color-success)', fontSize: '0.8rem' }}>▼ 3.4% under budget target</p>
        </div>

        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Cost Per Mile (CPM)</span>
            <TrendingUp size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '4px 0' }}>$1.82</h2>
          <p style={{ color: 'var(--color-error)', fontSize: '0.8rem' }}>▲ Target: $1.75 max</p>
        </div>

        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Fuel Audits Checked</span>
            <BarChart2 size={20} style={{ color: 'var(--color-secondary)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '4px 0' }}>98.2%</h2>
          <p style={{ color: 'var(--color-success)', fontSize: '0.8rem' }}>● 4 transactions flag-checked</p>
        </div>
      </section>

      {/* Main Focus Area & Integration Notice */}
      <main className="dashboard-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', borderStyle: 'dashed' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-accent)' }}>Financial Audits & Profitability</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          This console provides dynamic financial forecasting, expense auditing, and P&L reports. When connected to backend services, analysts can view ledger entries, audit maintenance invoices, and monitor profitability across individual fleets or corridors.
        </p>

        <div style={{ padding: '16px', background: 'rgba(168, 85, 247, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={16} /> Backend Integration Points:
          </h4>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li><code>/services/expense-service</code>: To log transaction entries, repair billing, and driver compensation items.</li>
            <li><code>/services/fuel-service</code>: To verify fuel card spend profiles and compute MPG-derived costs.</li>
            <li><code>/services/reporting-service</code>: To compile and run ledger reports, tax records (e.g. IFTA), and budget compliance models.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
