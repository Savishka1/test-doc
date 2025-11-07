import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockData';
import '../styles/Login.css';

export const Login = () => {
  const { login } = useAuth();
  const [selectedUser, setSelectedUser] = useState(mockUsers[0].email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const user = mockUsers.find((u) => u.email === selectedUser);
      if (user) {
        await login(user.email, 'password123'); // Mock password
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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

        <div className="login-form">
          <h2>Mock Login (Development Mode)</h2>
          <p className="login-info">Select a user role to test the application:</p>

          <div className="user-selection">
            {mockUsers.map((user) => (
              <label key={user.id} className="user-option">
                <input
                  type="radio"
                  name="user"
                  value={user.email}
                  checked={selectedUser === user.email}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  data-testid={`user-${user.role.toLowerCase()}`}
                />
                <div className="user-info">
                  <strong>{user.name}</strong>
                  <span className="user-role">{user.role}</span>
                  <span className="user-email">{user.email}</span>
                </div>
              </label>
            ))}
          </div>

          {error && (
            <div className="login-error" data-testid="login-error">
              {error}
            </div>
          )}

          <button
            className="btn btn-primary login-button"
            onClick={handleLogin}
            disabled={loading}
            data-testid="login-button"
          >
            {loading ? 'Logging in...' : `Login as ${mockUsers.find((u) => u.email === selectedUser)?.role}`}
          </button>

          <div className="login-note">
            <p><strong>Note:</strong> This is a development login. In production, use real credentials.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
