import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" data-testid="login-page">
      <div className="login-card">
        <h1 className="login-title">Agile Benefit Tracker</h1>
        <p className="login-subtitle">Zone24x7 Reimbursement System</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <p className="login-info">Enter your credentials to access the system</p>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoComplete="username"
              data-testid="username-input"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              data-testid="password-input"
              className="form-input"
            />
          </div>

          {error && (
            <div className="login-error" data-testid="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary login-button"
            disabled={loading}
            data-testid="login-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="login-note">
            <p><strong>Test Credentials:</strong></p>
            <p>SuperAdmin: admin / admin</p>
            <p>Employee: john.doe / password123</p>
            <p>HR: sarah.hr / password123</p>
            <p>Accounts: mike.accounts / password123</p>
          </div>
        </form>
      </div>
    </div>
  );
};
