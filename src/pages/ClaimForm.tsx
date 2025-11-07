import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ClaimType } from '../types';
import { FileUploader } from '../components/FileUploader';
import { claimService } from '../services/claimService';
import { useNotification } from '../context/NotificationContext';
import { validateClaimForm } from '../lib/validators';
import '../styles/ClaimForm.css';

export const ClaimForm = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [claimType, setClaimType] = useState<ClaimType>('OPD');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [billFile, setBillFile] = useState<File | null>(null);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validate form
    const validation = validateClaimForm(claimType, parseFloat(amount), description, billFile);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('claimType', claimType);
      formData.append('amount', amount);
      formData.append('date', date);
      formData.append('description', description);
      if (billFile) formData.append('bill', billFile);
      if (prescriptionFile) formData.append('prescription', prescriptionFile);

      await claimService.submitClaim(formData);
      addNotification('Claim submitted successfully!', 'success');
      navigate('/employee');
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to submit claim';
      addNotification(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" data-testid="claim-form">
      <div className="form-header">
        <h1>Submit New Claim</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="form-errors" data-testid="form-errors">
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="claimType">
              Claim Type <span className="required">*</span>
            </label>
            <select
              id="claimType"
              value={claimType}
              onChange={(e) => setClaimType(e.target.value as ClaimType)}
              className="input-field"
              data-testid="claim-type-select"
            >
              <option value="OPD">OPD</option>
              <option value="Wellness">Wellness</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">
              Date <span className="required">*</span>
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              required
              data-testid="claim-date-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">
              Amount (LKR) <span className="required">*</span>
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              data-testid="claim-amount-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              rows={4}
              placeholder="Describe your claim..."
              required
              data-testid="claim-description-input"
            />
          </div>

          <FileUploader
            label="Bill"
            required
            onFileSelect={setBillFile}
            testId="bill-uploader"
          />

          <FileUploader
            label="Prescription (Optional)"
            onFileSelect={setPrescriptionFile}
            testId="prescription-uploader"
          />

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/employee')}
              data-testid="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              data-testid="submit-button"
            >
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
