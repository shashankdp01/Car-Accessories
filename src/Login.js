import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import api from './api';

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  phone: '',
};

function Login({ onLogin, onGuest }) {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validateForm = () => {
    if (!form.email || !form.password) {
      return 'Please enter both email and password.';
    }

    if (form.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    if (isSignup && !form.name.trim()) {
      return 'Please enter your name.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = isSignup
        ? {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            phone: form.phone.trim(),
          }
        : {
            email: form.email.trim().toLowerCase(),
            password: form.password,
          };

      const endpoint = isSignup ? '/auth/register' : '/auth/login';
      const { data } = await api.post(endpoint, payload);

      setSuccess(data.message || 'Authentication successful.');
      onLogin(data.user);
      navigate('/products');
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || 'Unable to connect to the server. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    onGuest();
    navigate('/products');
  };

  return (
    <div className="login-page">
      <Navbar />

      <div className="login-body">
        <div>
          <button className="login-back" onClick={() => navigate('/')}>
            {'<-'} Back to Home
          </button>

          <div className="login-card">
            <div className="login-icon">AG</div>

            <h1 className="login-title">{isSignup ? 'Create Your Account' : 'Welcome Back'}</h1>
            <p className="login-sub">
              {isSignup
                ? 'Register to save your profile, orders, and future purchases.'
                : 'Log in to access your account and orders.'}
            </p>

            <div className="login-mode-switch">
              <button
                type="button"
                className={`login-mode-btn ${!isSignup ? 'active' : ''}`}
                onClick={() => {
                  setIsSignup(false);
                  setError('');
                  setSuccess('');
                }}
              >
                Log In
              </button>
              <button
                type="button"
                className={`login-mode-btn ${isSignup ? 'active' : ''}`}
                onClick={() => {
                  setIsSignup(true);
                  setError('');
                  setSuccess('');
                }}
              >
                Sign Up
              </button>
            </div>

            {error ? <div className="form-error">{error}</div> : null}
            {success ? <div className="form-success">{success}</div> : null}

            <form onSubmit={handleSubmit}>
              {isSignup ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={updateField('name')}
                      autoComplete="name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-input"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={updateField('phone')}
                      autoComplete="tel"
                    />
                  </div>
                </>
              ) : null}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateField('email')}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">Password</label>
                  {!isSignup ? (
                    <span className="form-hint">Use the password you registered with</span>
                  ) : null}
                </div>
                <input
                  className="form-input"
                  type="password"
                  placeholder={isSignup ? 'Create a secure password' : 'Enter your password'}
                  value={form.password}
                  onChange={updateField('password')}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                />
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Log In'}
              </button>
            </form>

            <div className="login-divider">or</div>

            <button className="btn-guest" onClick={handleGuest}>
              Continue as Guest
            </button>

            <p className="login-footer-text">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                className="login-link-btn"
                onClick={() => {
                  setIsSignup((prev) => !prev);
                  setError('');
                  setSuccess('');
                }}
              >
                {isSignup ? 'Log in here' : 'Create one free'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
