import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/NavigationBar.css';

export const NavigationBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar" data-testid="navigation-bar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 style={{ color: 'var(--primary-red)' }}>Agile Benefit Tracker</h1>
        </div>

        {user && (
          <div className="navbar-links">
            {user.role === 'Employee' && (
              <>
                <Link
                  to="/employee"
                  className={`nav-link ${isActive('/employee') ? 'active' : ''}`}
                  data-testid="nav-employee"
                >
                  Dashboard
                </Link>
                <Link
                  to="/claim/new"
                  className={`nav-link ${isActive('/claim/new') ? 'active' : ''}`}
                  data-testid="nav-new-claim"
                >
                  New Claim
                </Link>
              </>
            )}

            {user.role === 'HR' && (
              <>
                <Link
                  to="/hr"
                  className={`nav-link ${isActive('/hr') ? 'active' : ''}`}
                  data-testid="nav-hr"
                >
                  HR Dashboard
                </Link>
                <Link
                  to="/users"
                  className={`nav-link ${isActive('/users') ? 'active' : ''}`}
                  data-testid="nav-users"
                >
                  User Management
                </Link>
              </>
            )}

            {user.role === 'Accounts' && (
              <Link
                to="/accounts"
                className={`nav-link ${isActive('/accounts') ? 'active' : ''}`}
                data-testid="nav-accounts"
              >
                Accounts Dashboard
              </Link>
            )}

            {user.role === 'SuperAdmin' && (
              <Link
                to="/users"
                className={`nav-link ${isActive('/users') ? 'active' : ''}`}
                data-testid="nav-users"
              >
                User Management
              </Link>
            )}

            <Link
              to="/change-password"
              className={`nav-link ${isActive('/change-password') ? 'active' : ''}`}
              data-testid="nav-change-password"
            >
              Change Password
            </Link>

            <div className="navbar-user">
              <span className="user-name">{user.name}</span>
              <span className="user-role">({user.role})</span>
              <button
                onClick={logout}
                className="btn btn-secondary"
                data-testid="logout-button"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
