import pool from '../config/database';

export const logAudit = async (
  claimId: string,
  action: string,
  userId: string,
  userName: string,
  details?: string
) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs (claim_id, action, user_id, user_name, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [claimId, action, userId, userName, details]
    );
  } catch (error) {
    console.error('Error logging audit:', error);
  }
};
