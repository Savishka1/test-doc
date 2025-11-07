import { Link } from 'react-router-dom';
import type { Claim } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '../lib/formatters';
import '../styles/ClaimCard.css';

interface ClaimCardProps {
  claim: Claim;
  hideViewButton?: boolean;
}

export const ClaimCard = ({ claim, hideViewButton = false }: ClaimCardProps) => {
  return (
    <div className="claim-card" data-testid="claim-card">
      <div className="claim-card-header">
        <div>
          <h3 className="claim-type">{claim.claimType}</h3>
          <p className="claim-date">{formatDate(claim.date)}</p>
        </div>
        <StatusBadge status={claim.status} />
      </div>

      <div className="claim-card-body">
        <p className="claim-description">{claim.description}</p>
        <div className="claim-amount">{formatCurrency(claim.amount)}</div>
      </div>

      {claim.hrComment && (
        <div className="claim-comment">
          <strong>HR Comment:</strong> {claim.hrComment}
        </div>
      )}

      <div className="claim-card-footer">
        <span className="claim-id">ID: {claim.id}</span>
        {!hideViewButton && (
          <Link
            to={`/claim/${claim.id}`}
            className="btn btn-secondary"
            data-testid="view-claim-button"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};
