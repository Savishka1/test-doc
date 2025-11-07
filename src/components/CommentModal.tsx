import { useState } from 'react';
import '../styles/CommentModal.css';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  title: string;
}

export const CommentModal = ({ isOpen, onClose, onSubmit, title }: CommentModalProps) => {
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
      onClose();
    }
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  return (
    <div className="modal-overlay" data-testid="comment-modal" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            data-testid="modal-close-button"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <textarea
            className="comment-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment here..."
            rows={5}
            data-testid="comment-textarea"
          />
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={handleClose}
            data-testid="modal-cancel-button"
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!comment.trim()}
            data-testid="modal-submit-button"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
