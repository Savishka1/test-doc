import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Claim } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { claimService } from '../services/claimService';
import { useNotification } from '../context/NotificationContext';
import { formatCurrency, formatDateTime } from '../lib/formatters';
import '../styles/ClaimDetails.css';

export const ClaimDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (id) {
      fetchClaim(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchClaim = async (claimId: string) => {
    try {
      const data = await claimService.getClaim(claimId);
      setClaim(data);
    } catch {
      addNotification('Failed to load claim details', 'error');
      navigate('/employee');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!claim) {
    return <div className="container">Claim not found</div>;
  }

  const canEdit = claim.status === 'Submitted' || claim.status === 'Rejected' || claim.status === 'Auto-Rejected';

  return (
    <div className="container" data-testid="claim-details">
      <div className="details-header">
        <h1>Claim Details</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/employee')}
          data-testid="back-button"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="card">
        <div className="details-section">
          <div className="details-row">
            <span className="details-label">Claim ID:</span>
            <span className="details-value">{claim.id}</span>
          </div>

          <div className="details-row">
            <span className="details-label">Status:</span>
            <StatusBadge status={claim.status} />
          </div>

          <div className="details-row">
            <span className="details-label">Claim Type:</span>
            <span className="details-value">{claim.claimType}</span>
          </div>

          <div className="details-row">
            <span className="details-label">Amount:</span>
            <span className="details-value amount">{formatCurrency(claim.amount)}</span>
          </div>

          <div className="details-row">
            <span className="details-label">Date:</span>
            <span className="details-value">{formatDateTime(claim.date)}</span>
          </div>

          <div className="details-row">
            <span className="details-label">Description:</span>
            <span className="details-value">{claim.description}</span>
          </div>

          <div className="details-row">
            <span className="details-label">Submitted At:</span>
            <span className="details-value">{formatDateTime(claim.submittedAt)}</span>
          </div>

          <div className="details-row">
            <span className="details-label">Last Updated:</span>
            <span className="details-value">{formatDateTime(claim.updatedAt)}</span>
          </div>

          {claim.hrComment && (
            <div className="details-row">
              <span className="details-label">HR Comment:</span>
              <div className="hr-comment-box">{claim.hrComment}</div>
            </div>
          )}
        </div>

        <div className="details-section">
          <h3>Attachments</h3>
          <div className="attachments">
            <div className="attachment-item">
              <span>Bill:</span>
              <a href={claim.billUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                View Bill
              </a>
            </div>
            {claim.prescriptionUrl && (
              <div className="attachment-item">
                <span>Prescription:</span>
                <a href={claim.prescriptionUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  View Prescription
                </a>
              </div>
            )}
          </div>
        </div>

        {canEdit && (
          <div className="details-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/claim/${claim.id}/edit`)}
              data-testid="edit-button"
            >
              Edit Claim
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
