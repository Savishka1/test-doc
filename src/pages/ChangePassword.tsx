import { useState } from 'react';
import type { FormEvent } from 'react';
import { userService } from '../services/userService';
import { useNotification } from '../context/NotificationContext';
import '../styles/ChangePassword.css';

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      addNotification('New passwords do not match', 'error');
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      addNotification('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);

    try {
      await userService.changePassword(currentPassword, newPassword);
      addNotification('Password changed successfully', 'success');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      addNotification(
        error instanceof Error ? error.message : 'Failed to change password',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <h1>Change Password</h1>
        <p className="subtitle">Update your account password</p>

        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password *</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="form-input"
              data-testid="current-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password *</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="form-input"
              data-testid="new-password"
            />
            <small className="form-hint">Minimum 6 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password *</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="form-input"
              data-testid="confirm-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            data-testid="change-password-button"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>

        <div className="password-tips">
          <h3>Password Tips:</h3>
          <ul>
            <li>Use at least 6 characters</li>
            <li>Include a mix of letters and numbers</li>
            <li>Avoid common words or patterns</li>
            <li>Don't reuse old passwords</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
