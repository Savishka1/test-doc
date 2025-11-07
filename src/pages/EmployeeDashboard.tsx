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
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [appliedStartDate, setAppliedStartDate] = useState<string>('');
  const [appliedEndDate, setAppliedEndDate] = useState<string>('');
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

  const handleApplyFilters = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setAppliedStartDate('');
    setAppliedEndDate('');
    setFilter('all');
  };

  const filteredClaims = claims.filter((claim) => {
    // Status filter
    if (filter !== 'all' && claim.status.toLowerCase() !== filter.toLowerCase()) {
      return false;
    }

    // Date range filter
    if (appliedStartDate || appliedEndDate) {
      const claimDate = new Date(claim.date);
      
      if (appliedStartDate) {
        const start = new Date(appliedStartDate);
        if (claimDate < start) return false;
      }
      
      if (appliedEndDate) {
        const end = new Date(appliedEndDate);
        end.setHours(23, 59, 59, 999); // Include the entire end date
        if (claimDate > end) return false;
      }
    }

    return true;
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

      {/* Filters Section */}
      <div className="filters-section">
        <div className="date-filters">
          <div className="date-input-group">
            <label htmlFor="start-date">From Date:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
              data-testid="start-date"
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="end-date">To Date:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
              data-testid="end-date"
            />
          </div>
          <div className="filter-action-buttons">
            <button
              className="btn btn-primary"
              onClick={handleApplyFilters}
              data-testid="apply-filters"
            >
              Apply Filters
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleClearFilters}
              data-testid="clear-filters"
            >
              Clear Filters
            </button>
          </div>
        </div>
        <div className="filter-buttons">
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
      </div>

      <div className="card">
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
