import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login({ onLoginSuccess, onGoToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Simple validation
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3004/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed. Please check your credentials.');
      }

      // Map name to username for backwards compatibility with the dashboard welcome headers
      onLoginSuccess({
        id: data.user.id,
        name: data.user.name,
        username: data.user.name,
        email: data.user.email,
        roles: data.user.roles,
        token: data.token
      });

    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
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

        {errors.submit && (
          <div style={{ 
            padding: '12px 16px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid var(--color-error)', 
            borderRadius: 'var(--radius-md)', 
            color: 'var(--color-error)',
            fontSize: '0.9rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'left'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          {/* Email Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-container">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  borderColor: errors.email ? 'var(--color-error)' : 'var(--border-light)'
                }}
              />
            </div>
            {errors.email && (
              <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} /> {errors.email}
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

        {/* Link to Signup */}
        <div style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onGoToSignup}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline'
            }}
          >
            Sign Up
          </button>
        </div>

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
