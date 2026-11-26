import { useState } from 'react';
import API from '../api';

export default function AuthForm({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? formData
        : { email: formData.email, password: formData.password };

      const { data } = await API.post(endpoint, payload);
      localStorage.setItem('taskflowUser', JSON.stringify(data));
      onAuthSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>{isRegister ? 'Create Your TaskFlow Account' : 'Welcome Back to TaskFlow'}</h2>
      <p className="subtitle">
        {isRegister
          ? 'Sign up to manage your personal tasks and deadlines.'
          : 'Log in to view and manage your tasks.'}
      </p>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit} className="form-stack">
        {isRegister && (
          <label>
            Full Name
            <input
              type="text"
              name="name"
              placeholder="e.g. Golden-Joe Osegbe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
        )}

        <label>
          Email Address
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Please wait...' : isRegister ? 'Sign Up' : 'Log In'}
        </button>
      </form>

      <p className="switch-auth">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
        >
          {isRegister ? 'Log In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}