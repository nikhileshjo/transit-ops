import React, { useState } from 'react';
import { User, Lock, Briefcase, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    { value: 'Fleet Manager', label: 'Fleet Manager' },
    { value: 'Dispatcher', label: 'Dispatcher' },
    { value: 'Safety Officer', label: 'Safety Officer' },
    { value: 'Financial Analyst', label: 'Financial Analyst' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setErrors({});
    
    // Simple validation
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    if (!role) newErrors.role = 'Please select your role';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    /* 
      TODO: BACKEND API INTEGRATION
      Replace this setTimeout mock with your actual authentication fetch call.
      
      Example implementation:
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, role })
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Authentication failed');
        }
        
        const data = await response.json();
        // Save token or cookies, then succeed
        onLoginSuccess({ username, role, token: data.token });
      } catch (err) {
        setErrors({ submit: err.message });
      } finally {
        setIsSubmitting(false);
      }
    */
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess({ username, role });
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', padding: '20px' }}>
      
      {/* Dynamic Animated Mesh Background Blobs inside Login view */}
      <div className="bg-mesh-container">
        <div className="bg-mesh-blob blob-1"></div>
        <div className="bg-mesh-blob blob-2"></div>
        <div className="bg-mesh-blob blob-3"></div>
      </div>

      <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '440px', padding: '40px', textAlign: 'center' }}>
        
        {/* Header/Branding */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '8px' }}>
            <span className="text-gradient">Transit Ops</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Enterprise Fleet & Logistics Portal
          </p>
        </div>

        <form onSubmit={handleLogin} noValidate>
          {/* Username Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div className="input-container">
              <User size={18} className="input-icon" />
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  borderColor: errors.username ? 'var(--color-error)' : 'var(--border-light)'
                }}
              />
            </div>
            {errors.username && (
              <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} /> {errors.username}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-container">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  borderColor: errors.password ? 'var(--color-error)' : 'var(--border-light)'
                }}
              />
            </div>
            {errors.password && (
              <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} /> {errors.password}
              </p>
            )}
          </div>

          {/* Role Dropdown */}
          <div className="form-group">
            <label className="form-label" htmlFor="role">Role</label>
            <div className="select-wrapper">
              <Briefcase size={18} className="input-icon" />
              <select
                id="role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  borderColor: errors.role ? 'var(--color-error)' : 'var(--border-light)'
                }}
              >
                <option value="" disabled hidden>Select operations role</option>
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <div className="select-arrow">▼</div>
            </div>
            {errors.role && (
              <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} /> {errors.role}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: '12px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            ) : (
              <>
                Access Dashboard <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Spin Keyframe for Button Spinner */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    </div>
  );
}
