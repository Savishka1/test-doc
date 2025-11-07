import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/authMiddleware';
import { ClaimStatus, ClaimType } from '../models/enums';
import { validateClaimEligibility, getCurrentQuarter } from '../utils/eligibilityChecker';
import { sendClaimSubmissionEmail, sendClaimStatusEmail } from '../utils/emailService';
import { logAudit } from '../utils/logger';

export const submitClaim = async (req: AuthRequest, res: Response) => {
  try {
    const { claimType, amount, date, description } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files || !files.bill) {
      return res.status(400).json({ message: 'Bill upload is required' });
    }

    // Validate eligibility
    const eligibility = validateClaimEligibility(claimType as ClaimType, description);
    if (!eligibility.eligible) {
      return res.status(400).json({ message: eligibility.reason });
    }

    // Check balance
    const balance = await getClaimBalance(req.user!.id);
    if (parseFloat(amount) > balance.annual_remaining) {
      return res.status(400).json({ message: 'Amount exceeds annual cap' });
    }

    if (claimType === ClaimType.WELLNESS && parseFloat(amount) > balance.quarter_remaining) {
      return res.status(400).json({ message: 'Amount exceeds quarterly cap for Wellness claims' });
    }

    // Get user details
    const userResult = await pool.query('SELECT name, email FROM users WHERE id = $1', [req.user!.id]);
    const user = userResult.rows[0];

    // Insert claim
    const result = await pool.query(
      `INSERT INTO claims (employee_id, employee_name, claim_type, amount, date, description, bill_url, prescription_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        req.user!.id,
        user.name,
        claimType,
        amount,
        date,
        description,
        files.bill[0].path,
        files.prescription ? files.prescription[0].path : null,
        ClaimStatus.SUBMITTED,
      ]
    );

    const claim = result.rows[0];

    // Log audit
    await logAudit(claim.id, 'CLAIM_SUBMITTED', req.user!.id, user.name);

    // Send email
    await sendClaimSubmissionEmail(user.email, claim.id, parseFloat(amount));

    res.status(201).json(claim);
  } catch (error) {
    console.error('Submit claim error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getClaims = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM claims WHERE employee_id = $1 ORDER BY submitted_at DESC',
      [req.user!.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get claims error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getClaim = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM claims WHERE id = $1 AND employee_id = $2',
      [id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get claim error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateClaim = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { claimType, amount, date, description } = req.body;

    // Check if claim exists and belongs to user
    const claimResult = await pool.query(
      'SELECT * FROM claims WHERE id = $1 AND employee_id = $2',
      [id, req.user!.id]
    );

    if (claimResult.rows.length === 0) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const claim = claimResult.rows[0];

    // Check if claim can be edited
    if (![ClaimStatus.SUBMITTED, ClaimStatus.REJECTED, ClaimStatus.AUTO_REJECTED].includes(claim.status)) {
      return res.status(400).json({ message: 'Claim cannot be edited in current status' });
    }

    // Update claim
    const result = await pool.query(
      `UPDATE claims 
       SET claim_type = $1, amount = $2, date = $3, description = $4, status = $5
       WHERE id = $6
       RETURNING *`,
      [claimType, amount, date, description, ClaimStatus.SUBMITTED, id]
    );

    // Log audit
    const userResult = await pool.query('SELECT name FROM users WHERE id = $1', [req.user!.id]);
    await logAudit(id, 'CLAIM_UPDATED', req.user!.id, userResult.rows[0].name);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update claim error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBalance = async (req: AuthRequest, res: Response) => {
  try {
    const balance = await getClaimBalance(req.user!.id);
    res.json(balance);
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function
const getClaimBalance = async (userId: string) => {
  const settingsResult = await pool.query('SELECT * FROM settings WHERE key IN ($1, $2)', [
    'annual_cap',
    'quarter_cap',
  ]);

  const settings = settingsResult.rows.reduce((acc: any, row: any) => {
    acc[row.key] = parseFloat(row.value);
    return acc;
  }, {});

  const annualCap = settings.annual_cap || 80000;
  const quarterCap = settings.quarter_cap || 20000;

  // Get current year claims
  const currentYear = new Date().getFullYear();
  const yearStart = `${currentYear}-01-01`;
  const yearEnd = `${currentYear}-12-31`;

  const annualResult = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) as total
     FROM claims
     WHERE employee_id = $1 AND date >= $2 AND date <= $3 AND status IN ($4, $5)`,
    [userId, yearStart, yearEnd, ClaimStatus.APPROVED, ClaimStatus.PAID]
  );

  const annualUsed = parseFloat(annualResult.rows[0].total);

  // Get current quarter claims
  const currentQuarter = getCurrentQuarter();
  const quarterStart = new Date(currentYear, (currentQuarter - 1) * 3, 1);
  const quarterEnd = new Date(currentYear, currentQuarter * 3, 0);

  const quarterResult = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) as total
     FROM claims
     WHERE employee_id = $1 AND claim_type = $2 AND date >= $3 AND date <= $4 AND status IN ($5, $6)`,
    [userId, ClaimType.WELLNESS, quarterStart, quarterEnd, ClaimStatus.APPROVED, ClaimStatus.PAID]
  );

  const quarterUsed = parseFloat(quarterResult.rows[0].total);

  return {
    annual_cap: annualCap,
    annual_used: annualUsed,
    annual_remaining: annualCap - annualUsed,
    quarter_cap: quarterCap,
    quarter_used: quarterUsed,
    quarter_remaining: quarterCap - quarterUsed,
    current_quarter: currentQuarter,
  };
};
