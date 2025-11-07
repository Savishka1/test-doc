export type ClaimType = 'OPD' | 'Wellness';

export type ClaimStatus = 'Submitted' | 'Approved' | 'Rejected' | 'Auto-Rejected' | 'Paid';

export type UserRole = 'Employee' | 'HR' | 'Accounts' | 'SuperAdmin';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  employeeId: string;
  createdAt?: string;
  isActive?: boolean;
}

export interface Claim {
  id: string;
  employeeId: string;
  employeeName: string;
  claimType: ClaimType;
  amount: number;
  date: string;
  description: string;
  billUrl: string;
  prescriptionUrl?: string;
  status: ClaimStatus;
  hrComment?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  claimId: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: string;
  read: boolean;
}

export interface ClaimBalance {
  annualCap: number;
  annualUsed: number;
  annualRemaining: number;
  quarterCap: number;
  quarterUsed: number;
  quarterRemaining: number;
  currentQuarter: number;
}
