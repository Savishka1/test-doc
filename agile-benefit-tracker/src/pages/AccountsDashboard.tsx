import { useState, useEffect } from 'react';
import type { Claim } from '../types';
import { ClaimCard } from '../components/ClaimCard';
import { accountsService } from '../services/accountsService';
import { useNotification } from '../context/NotificationContext';
import '../styles/Dashboard.css';

export const AccountsDashboard = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClaims = async () => {
    try {
      const data = await accountsService.getApprovedClaims();
      setClaims(data);
    } catch {
      addNotification('Failed to load approved claims', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (claimId: string) => {
    try {
      await accountsService.markAsPaid(claimId);
      addNotification('Claim marked as paid successfully', 'success');
      fetchClaims();
    } catch {
      addNotification('Failed to mark claim as paid', 'error');
    }
  };

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      const blob = await accountsService.exportPayments(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      addNotification(`Exported as ${format.toUpperCase()}`, 'success');
    } catch {
      addNotification('Export failed', 'error');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container" data-testid="accounts-dashboard">
      <div className="dashboard-header">
        <h1>Accounts Dashboard - Approved Claims</h1>
        <div className="export-buttons">
          <button
            className="btn btn-secondary"
            onClick={() => handleExport('csv')}
            data-testid="export-csv"
          >
            Export CSV
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleExport('excel')}
            data-testid="export-excel"
          >
            Export Excel
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleExport('pdf')}
            data-testid="export-pdf"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card stats-card">
          <h3>Approved Claims</h3>
          <p className="stats-amount">{claims.length}</p>
          <p className="stats-label">pending payment</p>
        </div>
      </div>

      <div className="card">
        {claims.length === 0 ? (
          <p className="no-claims">No approved claims pending payment</p>
        ) : (
          <div className="claims-list">
            {claims.map((claim) => (
              <div key={claim.id} className="accounts-claim-item">
                <ClaimCard claim={claim} />
                <div className="accounts-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => handleMarkAsPaid(claim.id)}
                    data-testid="mark-paid-button"
                  >
                    Mark as Paid
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
