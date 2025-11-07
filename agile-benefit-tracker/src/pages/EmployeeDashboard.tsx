import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Claim, ClaimBalance } from '../types';
import { ClaimCard } from '../components/ClaimCard';
import { claimService } from '../services/claimService';
import { useNotification } from '../context/NotificationContext';
import { formatCurrency, getQuarterLabel } from '../lib/formatters';
import '../styles/Dashboard.css';

export const EmployeeDashboard = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [balance, setBalance] = useState<ClaimBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [claimsData, balanceData] = await Promise.all([
        claimService.getClaims(),
        claimService.getBalance(),
      ]);
      setClaims(claimsData);
      setBalance(balanceData);
    } catch {
      addNotification('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredClaims = claims.filter((claim) => {
    if (filter === 'all') return true;
    return claim.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container" data-testid="employee-dashboard">
      <div className="dashboard-header">
        <h1>My Claims Dashboard</h1>
        <Link to="/claim/new" className="btn btn-primary" data-testid="new-claim-button">
          + New Claim
        </Link>
      </div>

      {balance && (
        <div className="grid grid-3">
          <div className="card stats-card">
            <h3>Annual Balance</h3>
            <p className="stats-amount">{formatCurrency(balance.annualRemaining)}</p>
            <p className="stats-label">of {formatCurrency(balance.annualCap)} remaining</p>
          </div>

          <div className="card stats-card">
            <h3>{getQuarterLabel(balance.currentQuarter)} Balance</h3>
            <p className="stats-amount">{formatCurrency(balance.quarterRemaining)}</p>
            <p className="stats-label">of {formatCurrency(balance.quarterCap)} remaining</p>
          </div>

          <div className="card stats-card">
            <h3>Total Claims</h3>
            <p className="stats-amount">{claims.length}</p>
            <p className="stats-label">submitted this year</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="filter-bar">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            data-testid="filter-all"
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'submitted' ? 'active' : ''}`}
            onClick={() => setFilter('submitted')}
            data-testid="filter-submitted"
          >
            Submitted
          </button>
          <button
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
            data-testid="filter-approved"
          >
            Approved
          </button>
          <button
            className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
            data-testid="filter-rejected"
          >
            Rejected
          </button>
          <button
            className={`filter-btn ${filter === 'paid' ? 'active' : ''}`}
            onClick={() => setFilter('paid')}
            data-testid="filter-paid"
          >
            Paid
          </button>
        </div>

        <div className="claims-list">
          {filteredClaims.length === 0 ? (
            <p className="no-claims">No claims found</p>
          ) : (
            filteredClaims.map((claim) => <ClaimCard key={claim.id} claim={claim} />)
          )}
        </div>
      </div>
    </div>
  );
};
