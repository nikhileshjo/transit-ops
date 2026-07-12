import React, { useState } from 'react';
import { User, Lock, Mail, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Signup({ onBackToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const availableRoles = [
    'Fleet Manager',
    'Dispatcher',
    'Safety Officer',
    'Financial Analyst'
  ];

  const handleRoleToggle = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validation logic
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (selectedRoles.length === 0) {
      newErrors.roles = 'Please select at least one role';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3004/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          roles: selectedRoles
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed. Please try again.');
      }

      setSignupSuccess(true);
      setTimeout(() => {
        onBackToLogin();
      }, 2500);

    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (signupSuccess) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', padding: '20px' }}>
        <div className="bg-mesh-container">
          <div className="bg-mesh-blob blob-1"></div>
          <div className="bg-mesh-blob blob-2"></div>
          <div className="bg-mesh-blob blob-3"></div>
        </div>

        <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '480px', padding: '40px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <CheckCircle2 size={64} style={{ color: 'var(--color-success)', animation: 'scaleUp 0.5s ease-out' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Registration Successful</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.5' }}>
              Your account has been created successfully. You are being redirected to the login screen.
            </p>
            <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginTop: '10px' }} />
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes scaleUp {
              from { transform: scale(0.5); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', padding: '40px 20px' }}>
      
      {/* Dynamic Animated Mesh Background Blobs */}
      <div className="bg-mesh-container">
        <div className="bg-mesh-blob blob-1"></div>
        <div className="bg-mesh-blob blob-2"></div>
        <div className="bg-mesh-blob blob-3"></div>
      </div>

      <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '540px', padding: '40px' }}>
        
        {/* Back Button */}
        <button 
          onClick={onBackToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.9rem',
            marginBottom: '24px',
            padding: '0',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--text-main)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        {/* Header/Branding */}
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '6px' }}>
            <span className="text-gradient">Create Account</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join Transit Ops Logistics Platform
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
            gap: '8px'
          }}>
            <AlertCircle size={18} />
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSignup} noValidate>
          {/* Name Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div className="input-container">
              <User size={18} className="input-icon" />
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  borderColor: errors.name ? 'var(--color-error)' : 'var(--border-light)'
                }}
              />
            </div>
            {errors.name && (
              <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} /> {errors.name}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-container">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
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

          {/* Password Fields Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '4px' }}>
            {/* Password Input */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
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
                <p style={{ color: 'var(--color-error)', fontSize: '0.78rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-container">
                <Lock size={18} className="input-icon" />
                <input
                  id="confirmPassword"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    borderColor: errors.confirmPassword ? 'var(--color-error)' : 'var(--border-light)'
                  }}
                />
              </div>
              {errors.confirmPassword && (
                <p style={{ color: 'var(--color-error)', fontSize: '0.78rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Roles Checkbox Grid */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Assign Account Roles</label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px',
              marginTop: '6px'
            }}>
              {availableRoles.map((role) => {
                const isChecked = selectedRoles.includes(role);
                return (
                  <div
                    key={role}
                    onClick={() => handleRoleToggle(role)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: isChecked ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-input)',
                      border: '1px solid',
                      borderColor: isChecked ? 'var(--color-primary)' : 'var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      userSelect: 'none',
                      boxShadow: isChecked ? 'var(--shadow-neon)' : 'none'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: '1.5px solid',
                      borderColor: isChecked ? 'var(--color-primary)' : 'var(--text-dim)',
                      background: isChecked ? 'var(--color-primary)' : 'transparent',
                      marginRight: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s'
                    }}>
                      {isChecked && (
                        <div style={{
                          width: '8px',
                          height: '5px',
                          borderLeft: '2px solid white',
                          borderBottom: '2px solid white',
                          transform: 'rotate(-45deg) translate(1px, -1px)',
                        }} />
                      )}
                    </div>
                    <span style={{ 
                      fontSize: '0.88rem', 
                      fontWeight: isChecked ? '600' : '400',
                      color: isChecked ? 'var(--text-main)' : 'var(--text-muted)'
                    }}>
                      {role}
                    </span>
                  </div>
                );
              })}
            </div>
            {errors.roles && (
              <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} /> {errors.roles}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* CSS Spin Keyframe */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    </div>
  );
}
