import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/auth.css';

const getPasswordStrength = (pw) => {
  if (!pw) return { level: 0, label: '', cls: '' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: 'Weak', cls: 'weak' };
  if (score <= 2) return { level: 2, label: 'Fair', cls: 'fair' };
  if (score <= 3) return { level: 3, label: 'Good', cls: 'good' };
  return { level: 4, label: 'Strong', cls: 'strong' };
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setFormError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!formData.password) {
      setFormError('Please enter a password.');
      return;
    }
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register(formData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const strength = getPasswordStrength(formData.password);

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

      <div className="auth-glass-card auth-card-wide">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-logo-ring">
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
              <path d="M30 25h12v20h16V25h12v50H58V55H42v20H30V25z" fill="white" />
            </svg>
          </div>
          <div className="auth-brand-tag">HUB LEARNING</div>
          <h1 className="auth-heading">
            <span className="auth-heading-glow">Create Account</span>
          </h1>
          <p className="auth-subtitle">Join HUB Learning and start your journey</p>
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
          {/* Full Name */}
          <div className="auth-form-group">
            <label className="auth-label">
              Full Name <span className="auth-label-star">*</span>
            </label>
            <div className="auth-input-wrap">
              <input
                type="text"
                className="auth-input"
                name="name"
                placeholder="e.g. Alex Johnson"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                autoFocus
                required
              />
              <span className="auth-input-glyph">👤</span>
            </div>
          </div>

          {/* Email */}
          <div className="auth-form-group">
            <label className="auth-label">
              Email Address <span className="auth-label-star">*</span>
            </label>
            <div className="auth-input-wrap">
              <input
                type="email"
                className="auth-input"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
              <span className="auth-input-glyph">✉</span>
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="auth-form-row">
            <div className="auth-form-group">
              <label className="auth-label">
                Password <span className="auth-label-star">*</span>
              </label>
              <div className="auth-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  name="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
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
              {formData.password && (
                <>
                  <div className="auth-pw-strength">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`auth-strength-seg ${i <= strength.level ? `on ${strength.cls}` : ''}`}
                      />
                    ))}
                  </div>
                  <div className={`auth-strength-label ${strength.cls}`}>
                    {strength.label}
                  </div>
                </>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-label">
                Confirm Password <span className="auth-label-star">*</span>
              </label>
              <div className="auth-input-wrap">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="auth-input"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <span className="auth-input-glyph">🔒</span>
                <button
                  type="button"
                  className="auth-pw-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                >
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting ? (
              <>
                <span className="auth-btn-spinner" />
                Creating Account...
              </>
            ) : (
              <>Create Account →</>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-footer-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
