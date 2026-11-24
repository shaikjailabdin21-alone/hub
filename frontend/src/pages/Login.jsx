import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const rawFrom = location.state?.from?.pathname;
  const from = (rawFrom && !['/login', '/register', '/forgot-password', '/reset-password'].includes(rawFrom))
    ? rawFrom
    : '/dashboard';

  // Load remembered email
  useEffect(() => {
    const saved = localStorage.getItem('hub_remember_email');
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) {
      setFormError('Please enter your email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }

    // Remember me
    if (rememberMe) {
      localStorage.setItem('hub_remember_email', email.trim());
    } else {
      localStorage.removeItem('hub_remember_email');
    }

    setSubmitting(true);
    try {
      const data = await login(email.trim(), password);
      const isUserAdmin = data?.user?.role === 'admin';
      const dest = isUserAdmin ? '/admin' : from;
      navigate(dest, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Cyber background */}
      <div className="auth-cyber-bg" aria-hidden="true">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
        <div className="auth-scanline" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
      </div>

      <div className="auth-glass-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-logo-ring">
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
              <path d="M30 25h12v20h16V25h12v50H58V55H42v20H30V25z" fill="white" />
            </svg>
          </div>
          <div className="auth-brand-tag">HUB LEARNING</div>
          <h1 className="auth-heading">
            <span className="auth-heading-glow">Welcome Back</span>
          </h1>
          <p className="auth-subtitle">Sign in to continue your learning journey</p>
        </div>

        {/* Error */}
        {formError && (
          <div className="auth-alert auth-alert-error">
            <span className="auth-alert-icon">⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="auth-form-group">
            <label className="auth-label">
              Email Address <span className="auth-label-star">*</span>
            </label>
            <div className="auth-input-wrap">
              <input
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                required
              />
              <span className="auth-input-glyph">✉</span>
            </div>
          </div>

          {/* Password */}
          <div className="auth-form-group">
            <div className="auth-row-between">
              <label className="auth-label">
                Password <span className="auth-label-star">*</span>
              </label>
              <Link to="/forgot-password" className="auth-forgot-link">
                Forgot Password?
              </Link>
            </div>
            <div className="auth-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <span className="auth-input-glyph">🔒</span>
              <button
                type="button"
                className="auth-pw-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="auth-remember-row">
            <input
              type="checkbox"
              id="rememberMe"
              className="auth-checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe" className="auth-remember-label">
              Remember me
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting ? (
              <>
                <span className="auth-btn-spinner" />
                Authenticating...
              </>
            ) : (
              <>Sign In →</>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-footer-link">
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
