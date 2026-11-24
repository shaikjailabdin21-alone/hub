import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setFormError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email: email.trim() });
      setSuccessMsg(data.message || 'If an account with that email exists, a password reset link has been sent.');
      setEmail('');
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
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
            <span className="auth-heading-glow">Reset Password</span>
          </h1>
          <p className="auth-subtitle">
            Enter your email and we'll send you instructions to reset your password.
          </p>
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
            <span>{successMsg}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
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

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting ? (
              <>
                <span className="auth-btn-spinner" />
                Sending...
              </>
            ) : (
              <>Send Reset Link →</>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Remember your password?{' '}
          <Link to="/login" className="auth-footer-link">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
