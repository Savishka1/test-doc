import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Claim, ClaimStatus } from '../types';
import { ClaimCard } from '../components/ClaimCard';
import { CommentModal } from '../components/CommentModal';
import { hrService } from '../services/hrService';
import { useNotification } from '../context/NotificationContext';
import '../styles/Dashboard.css';

export const HRDashboard = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'reject' | 'request'>('reject');
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [appliedStartDate, setAppliedStartDate] = useState<string>('');
  const [appliedEndDate, setAppliedEndDate] = useState<string>('');
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClaims = async () => {
    try {
      const data = await hrService.getPendingClaims();
      setClaims(data);
      setFilteredClaims(data);
    } catch {
      addNotification('Failed to load pending claims', 'error');
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

  const handleApprove = async (claimId: string) => {
    try {
      await hrService.approveClaim(claimId);
      addNotification('Claim approved successfully', 'success');
      fetchClaims();
    } catch {
      addNotification('Failed to approve claim', 'error');
    }
  };

  const handleReject = (claim: Claim) => {
    setSelectedClaim(claim);
    setModalType('reject');
    setModalOpen(true);
  };

  const handleRequestUpdate = (claim: Claim) => {
    setSelectedClaim(claim);
    setModalType('request');
    setModalOpen(true);
  };

  const handleCommentSubmit = async (comment: string) => {
    if (!selectedClaim) return;

    try {
      if (modalType === 'reject') {
        await hrService.rejectClaim(selectedClaim.id, comment);
        addNotification('Claim rejected', 'success');
      } else {
        await hrService.requestUpdate(selectedClaim.id, comment);
        addNotification('Update requested', 'success');
      }
      fetchClaims();
    } catch {
      addNotification('Operation failed', 'error');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container" data-testid="hr-dashboard">
      <div className="dashboard-header">
        <h1>HR Dashboard</h1>
      </div>

      <div className="grid grid-3">
        <div className="card stats-card">
          <h3>Total Claims</h3>
          <p className="stats-amount">{claims.length}</p>
          <p className="stats-label">pending review</p>
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
          {(['All', 'Submitted', 'Approved', 'Rejected'] as const).map((status) => (
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
              <div key={claim.id} className="hr-claim-item">
                <ClaimCard claim={claim} hideViewButton={true} />
                <div className="hr-actions">
                  <button
                    className="btn btn-info"
                    onClick={() => navigate(`/claim/${claim.id}`)}
                    data-testid="view-details-button"
                  >
                    View Details
                  </button>
                  {claim.status === 'Submitted' && (
                    <>
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(claim.id)}
                        data-testid="approve-button"
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleRequestUpdate(claim)}
                        data-testid="request-update-button"
                      >
                        Request Update
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleReject(claim)}
                        data-testid="reject-button"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CommentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCommentSubmit}
        title={modalType === 'reject' ? 'Reject Claim' : 'Request Update'}
      />
    </div>
  );
};
