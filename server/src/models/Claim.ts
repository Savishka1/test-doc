import { ClaimType, ClaimStatus } from './enums';

export interface Claim {
  id: string;
  employee_id: string;
  employee_name: string;
  claim_type: ClaimType;
  amount: number;
  date: Date;
  description: string;
  bill_url: string;
  prescription_url?: string;
  status: ClaimStatus;
  hr_comment?: string;
  submitted_at: Date;
  updated_at: Date;
}

export interface ClaimBalance {
  annual_cap: number;
  annual_used: number;
  annual_remaining: number;
  quarter_cap: number;
  quarter_used: number;
  quarter_remaining: number;
  current_quarter: number;
}
