import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!token) {
      setFormError('Invalid or missing reset token. Please request a new password reset.');
      return;
    }
    if (!password) {
      setFormError('Please enter a new password.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/reset-password', { token, password });
      setSuccessMsg(data.message || 'Password reset successfully!');
      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Failed to reset password. The token may have expired.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
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
        <div className="auth-brand">
          <div className="auth-logo-ring">
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
              <path d="M30 25h12v20h16V25h12v50H58V55H42v20H30V25z" fill="white" />
            </svg>
          </div>
          <div className="auth-brand-tag">HUB LEARNING</div>
          <h1 className="auth-heading">
            <span className="auth-heading-glow">New Password</span>
          </h1>
          <p className="auth-subtitle">Create a strong new password for your account.</p>
        </div>

        {formError && (
          <div className="auth-alert auth-alert-error">
            <span className="auth-alert-icon">⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-alert auth-alert-success">
            <span className="auth-alert-icon">✅</span>
            <span>{successMsg} Redirecting to login...</span>
          </div>
        )}

        {!successMsg && (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-form-group">
              <label className="auth-label">
                New Password <span className="auth-label-star">*</span>
              </label>
              <div className="auth-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  autoFocus
                  required
                />
                <span className="auth-input-glyph">🔒</span>
                <button
                  type="button"
                  className="auth-pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">
                Confirm Password <span className="auth-label-star">*</span>
              </label>
              <div className="auth-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <span className="auth-input-glyph">🔒</span>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="auth-btn-spinner" />
                  Resetting...
                </>
              ) : (
                <>Reset Password →</>
              )}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login" className="auth-footer-link">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
