import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/authMiddleware';
import { ClaimStatus } from '../models/enums';
import { sendClaimStatusEmail } from '../utils/emailService';
import { logAudit } from '../utils/logger';

export const getPendingClaims = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM claims WHERE status = $1 ORDER BY submitted_at ASC',
      [ClaimStatus.SUBMITTED]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get pending claims error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveClaim = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE claims SET status = $1 WHERE id = $2 RETURNING *',
      [ClaimStatus.APPROVED, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const claim = result.rows[0];

    // Get employee email
    const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [claim.employee_id]);
    
    // Log audit
    const hrResult = await pool.query('SELECT name FROM users WHERE id = $1', [req.user!.id]);
    await logAudit(id, 'CLAIM_APPROVED', req.user!.id, hrResult.rows[0].name);

    // Send email
    await sendClaimStatusEmail(userResult.rows[0].email, id, ClaimStatus.APPROVED);

    res.json(claim);
  } catch (error) {
    console.error('Approve claim error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectClaim = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const result = await pool.query(
      'UPDATE claims SET status = $1, hr_comment = $2 WHERE id = $3 RETURNING *',
      [ClaimStatus.REJECTED, comment, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const claim = result.rows[0];

    // Get employee email
    const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [claim.employee_id]);
    
    // Log audit
    const hrResult = await pool.query('SELECT name FROM users WHERE id = $1', [req.user!.id]);
    await logAudit(id, 'CLAIM_REJECTED', req.user!.id, hrResult.rows[0].name, comment);

    // Send email
    await sendClaimStatusEmail(userResult.rows[0].email, id, ClaimStatus.REJECTED, comment);

    res.json(claim);
  } catch (error) {
    console.error('Reject claim error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const requestUpdate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const result = await pool.query(
      'UPDATE claims SET hr_comment = $1 WHERE id = $2 RETURNING *',
      [comment, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Log audit
    const hrResult = await pool.query('SELECT name FROM users WHERE id = $1', [req.user!.id]);
    await logAudit(id, 'UPDATE_REQUESTED', req.user!.id, hrResult.rows[0].name, comment);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Request update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateQuarterlyCap = async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;

    await pool.query(
      'UPDATE settings SET value = $1 WHERE key = $2',
      [amount.toString(), 'quarter_cap']
    );

    res.json({ message: 'Quarterly cap updated successfully', amount });
  } catch (error) {
    console.error('Update quarterly cap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
