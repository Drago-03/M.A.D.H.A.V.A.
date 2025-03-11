import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ mode, onClose, onSuccess, onSwitchMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup' && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful authentication
      const userData = {
        id: '123',
        name: formData.name || 'User',
        email: formData.email,
        createdAt: new Date().toISOString(),
        stats: {
          totalQueries: 0,
          savedItems: 0,
          domainsUsed: 0
        },
        preferences: {
          defaultDomain: 'finance',
          emailNotifications: true
        }
      };

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      onSuccess(userData);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="auth-modal-content">
          <h2>{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="subtitle">
            {mode === 'signin' 
              ? 'Sign in to access your account' 
              : 'Sign up to get started with M.A.D.H.A.V.A.'}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            {mode === 'signup' && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button onClick={() => onSwitchMode('signup')} disabled={loading}>Sign Up</button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button onClick={() => onSwitchMode('signin')} disabled={loading}>Sign In</button>
              </p>
            )}
          </div>

          <div className="social-auth">
            <div className="divider">
              <span>OR</span>
            </div>
            <button className="social-button google" disabled={loading}>
              <img src="/google-icon.svg" alt="Google" />
              Continue with Google
            </button>
            <button className="social-button github" disabled={loading}>
              <img src="/github-icon.svg" alt="GitHub" />
              Continue with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 