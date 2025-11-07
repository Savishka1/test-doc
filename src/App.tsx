import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { NavigationBar } from './components/NavigationBar';
import { NotificationBanner } from './components/NotificationBanner';
import { Login } from './pages/Login';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { HRDashboard } from './pages/HRDashboard';
import { AccountsDashboard } from './pages/AccountsDashboard';
import { ClaimForm } from './pages/ClaimForm';
import { ClaimDetails } from './pages/ClaimDetails';
import { UserManagement } from './pages/UserManagement';
import { ChangePassword } from './pages/ChangePassword';
import './styles/theme.css';

function AppRoutes() {
  const { user, isAuthenticated } = useAuth();

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <NavigationBar />
      <NotificationBanner />
      <Routes>
        {user?.role === 'Employee' && (
          <>
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/claim/new" element={<ClaimForm />} />
            <Route path="/claim/:id" element={<ClaimDetails />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="*" element={<Navigate to="/employee" replace />} />
          </>
        )}

        {user?.role === 'HR' && (
          <>
            <Route path="/hr" element={<HRDashboard />} />
            <Route path="/claim/:id" element={<ClaimDetails />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="*" element={<Navigate to="/hr" replace />} />
          </>
        )}

        {user?.role === 'Accounts' && (
          <>
            <Route path="/accounts" element={<AccountsDashboard />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="*" element={<Navigate to="/accounts" replace />} />
          </>
        )}

        {user?.role === 'SuperAdmin' && (
          <>
            <Route path="/users" element={<UserManagement />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="*" element={<Navigate to="/users" replace />} />
          </>
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
