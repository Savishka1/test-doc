import type { ClaimStatus } from '../types';
import '../styles/StatusBadge.css';

interface StatusBadgeProps {
  status: ClaimStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusClass = () => {
    switch (status) {
      case 'Submitted':
        return 'status-submitted';
      case 'Approved':
        return 'status-approved';
      case 'Rejected':
      case 'Auto-Rejected':
        return 'status-rejected';
      case 'Paid':
        return 'status-paid';
      default:
        return '';
    }
  };

  return (
    <span
      className={`status-badge ${getStatusClass()}`}
      data-testid={`status-badge-${status.toLowerCase().replace(' ', '-')}`}
    >
      {status}
    </span>
  );
};
