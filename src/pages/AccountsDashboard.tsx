import { useState, useEffect } from 'react';
import type { Claim, ClaimStatus } from '../types';
import { ClaimCard } from '../components/ClaimCard';
import { accountsService } from '../services/accountsService';
import { useNotification } from '../context/NotificationContext';
import { formatCurrency } from '../lib/formatters';
import '../styles/Dashboard.css';

export const AccountsDashboard = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [appliedStartDate, setAppliedStartDate] = useState<string>('');
  const [appliedEndDate, setAppliedEndDate] = useState<string>('');
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClaims = async () => {
    try {
      const data = await accountsService.getApprovedClaims();
      setClaims(data);
      setFilteredClaims(data);
    } catch {
      addNotification('Failed to load approved claims', 'error');
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
    setStatusFilter('All');
    setSearchTerm('');
  };

  // Filter claims based on status, search term, and date range
  useEffect(() => {
    let filtered = claims;

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter((claim) => claim.status === statusFilter);
    }

    // Filter by search term (employee name or claim ID)
    if (searchTerm) {
      filtered = filtered.filter(
        (claim) =>
          claim.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date range filter
    if (appliedStartDate || appliedEndDate) {
      const claimDate = (claim: Claim) => new Date(claim.date);
      
      if (appliedStartDate) {
        const start = new Date(appliedStartDate);
        filtered = filtered.filter((claim) => claimDate(claim) >= start);
      }
      
      if (appliedEndDate) {
        const end = new Date(appliedEndDate);
        end.setHours(23, 59, 59, 999);
        filtered = filtered.filter((claim) => claimDate(claim) <= end);
      }
    }

    setFilteredClaims(filtered);
  }, [claims, statusFilter, searchTerm, appliedStartDate, appliedEndDate]);

  // Calculate totals
  const totalApproved = claims
    .filter((c) => c.status === 'Approved')
    .reduce((sum, claim) => sum + claim.amount, 0);
  
  const totalPaid = claims
    .filter((c) => c.status === 'Paid')
    .reduce((sum, claim) => sum + claim.amount, 0);
  
  const totalPending = totalApproved;

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
        <h1>Accounts Dashboard</h1>
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
          <h3>Pending Payment</h3>
          <p className="stats-amount">{claims.filter(c => c.status === 'Approved').length}</p>
          <p className="stats-label">{formatCurrency(totalPending)}</p>
        </div>
        <div className="card stats-card">
          <h3>Approved Amount</h3>
          <p className="stats-amount">{formatCurrency(totalApproved)}</p>
          <p className="stats-label">awaiting payment</p>
        </div>
        <div className="card stats-card">
          <h3>Paid Amount</h3>
          <p className="stats-amount">{formatCurrency(totalPaid)}</p>
          <p className="stats-label">completed</p>
        </div>
      </div>

      {/* Filters */}
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
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by employee name or claim ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            data-testid="search-input"
          />
        </div>
        <div className="filter-buttons">
          {(['All', 'Approved', 'Paid'] as const).map((status) => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
              data-testid={`filter-${status.toLowerCase()}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {filteredClaims.length === 0 ? (
          <p className="no-claims">No claims found</p>
        ) : (
          <div className="claims-list">
            {filteredClaims.map((claim) => (
              <div key={claim.id} className="accounts-claim-item">
                <ClaimCard claim={claim} hideViewButton={true} />
                <div className="accounts-actions">
                  {claim.status === 'Approved' && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleMarkAsPaid(claim.id)}
                      data-testid="mark-paid-button"
                    >
                      Mark as Paid
                    </button>
                  )}
                  {claim.status === 'Paid' && (
                    <span className="paid-badge">✓ Paid</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
