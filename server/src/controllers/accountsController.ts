import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/authMiddleware';
import { ClaimStatus } from '../models/enums';
import { sendClaimStatusEmail } from '../utils/emailService';
import { logAudit } from '../utils/logger';

export const getApprovedClaims = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM claims WHERE status = $1 ORDER BY updated_at ASC',
      [ClaimStatus.APPROVED]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get approved claims error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAsPaid = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE claims SET status = $1 WHERE id = $2 RETURNING *',
      [ClaimStatus.PAID, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const claim = result.rows[0];

    // Get employee email
    const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [claim.employee_id]);
    
    // Log audit
    const accountsResult = await pool.query('SELECT name FROM users WHERE id = $1', [req.user!.id]);
    await logAudit(id, 'PAYMENT_PROCESSED', req.user!.id, accountsResult.rows[0].name);

    // Send email
    await sendClaimStatusEmail(userResult.rows[0].email, id, ClaimStatus.PAID);

    res.json(claim);
  } catch (error) {
    console.error('Mark as paid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const exportPayments = async (req: AuthRequest, res: Response) => {
  try {
    const { format } = req.params;

    const result = await pool.query(
      'SELECT * FROM claims WHERE status = $1 ORDER BY updated_at DESC',
      [ClaimStatus.PAID]
    );

    // For now, return JSON. In production, generate actual CSV/Excel/PDF
    res.json({
      format,
      data: result.rows,
      message: `Export as ${format.toUpperCase()} - Implementation pending`,
    });
  } catch (error) {
    console.error('Export payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
