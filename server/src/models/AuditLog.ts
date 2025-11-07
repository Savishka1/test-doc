export interface AuditLog {
  id: string;
  claim_id: string;
  action: string;
  user_id: string;
  user_name: string;
  timestamp: Date;
  details?: string;
}
