import { useState, useEffect } from 'react';
import type { Claim } from '../types';
import { ClaimCard } from '../components/ClaimCard';
import { CommentModal } from '../components/CommentModal';
import { hrService } from '../services/hrService';
import { useNotification } from '../context/NotificationContext';
import '../styles/Dashboard.css';

export const HRDashboard = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'reject' | 'request'>('reject');
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClaims = async () => {
    try {
      const data = await hrService.getPendingClaims();
      setClaims(data);
    } catch {
      addNotification('Failed to load pending claims', 'error');
    } finally {
      setLoading(false);
    }
  };

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
        <h1>HR Dashboard - Pending Claims</h1>
      </div>

      <div className="grid grid-3">
        <div className="card stats-card">
          <h3>Pending Claims</h3>
          <p className="stats-amount">{claims.length}</p>
          <p className="stats-label">awaiting review</p>
        </div>
      </div>

      <div className="card">
        {claims.length === 0 ? (
          <p className="no-claims">No pending claims</p>
        ) : (
          <div className="claims-list">
            {claims.map((claim) => (
              <div key={claim.id} className="hr-claim-item">
                <ClaimCard claim={claim} />
                <div className="hr-actions">
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
