import type { Claim, ClaimBalance, User } from '../types';

// Mock users for testing
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.employee@zone24x7.com',
    role: 'Employee',
    employeeId: 'EMP001',
  },
  {
    id: '2',
    name: 'Sarah HR',
    email: 'sarah.hr@zone24x7.com',
    role: 'HR',
    employeeId: 'HR001',
  },
  {
    id: '3',
    name: 'Mike Accounts',
    email: 'mike.accounts@zone24x7.com',
    role: 'Accounts',
    employeeId: 'ACC001',
  },
];

// Mock claims data
export const mockClaims: Claim[] = [
  {
    id: 'CLM001',
    employeeId: '1',
    employeeName: 'John Doe',
    claimType: 'OPD',
    amount: 5000,
    date: '2025-01-15',
    description: 'Doctor consultation and medication for flu',
    billUrl: '/uploads/bill-001.pdf',
    prescriptionUrl: '/uploads/prescription-001.pdf',
    status: 'Paid',
    submittedAt: '2025-01-16T10:30:00Z',
    updatedAt: '2025-01-20T14:45:00Z',
  },
  {
    id: 'CLM002',
    employeeId: '1',
    employeeName: 'John Doe',
    claimType: 'Wellness',
    amount: 15000,
    date: '2025-02-10',
    description: 'Gym membership and yoga classes for Q1',
    billUrl: '/uploads/bill-002.pdf',
    status: 'Approved',
    submittedAt: '2025-02-11T09:15:00Z',
    updatedAt: '2025-02-12T11:20:00Z',
  },
  {
    id: 'CLM003',
    employeeId: '1',
    employeeName: 'John Doe',
    claimType: 'OPD',
    amount: 8000,
    date: '2025-03-05',
    description: 'Dental checkup and cleaning',
    billUrl: '/uploads/bill-003.pdf',
    status: 'Submitted',
    submittedAt: '2025-03-06T08:00:00Z',
    updatedAt: '2025-03-06T08:00:00Z',
  },
  {
    id: 'CLM004',
    employeeId: '1',
    employeeName: 'John Doe',
    claimType: 'Wellness',
    amount: 12000,
    date: '2025-03-10',
    description: 'Wellness retreat and spa treatment',
    billUrl: '/uploads/bill-004.pdf',
    status: 'Rejected',
    hrComment: 'Please provide itemized bill showing individual service costs',
    submittedAt: '2025-03-11T10:00:00Z',
    updatedAt: '2025-03-12T15:30:00Z',
  },
  {
    id: 'CLM005',
    employeeId: '4',
    employeeName: 'Jane Smith',
    claimType: 'OPD',
    amount: 3500,
    date: '2025-03-08',
    description: 'Eye examination and prescription glasses',
    billUrl: '/uploads/bill-005.pdf',
    status: 'Submitted',
    submittedAt: '2025-03-09T11:30:00Z',
    updatedAt: '2025-03-09T11:30:00Z',
  },
];

// Mock balance data
export const mockBalance: ClaimBalance = {
  annualCap: 80000,
  annualUsed: 28000,
  annualRemaining: 52000,
  quarterCap: 20000,
  quarterUsed: 15000,
  quarterRemaining: 5000,
  currentQuarter: 1,
};

// Helper to get claims by status
export const getClaimsByStatus = (status: string): Claim[] => {
  if (status === 'all') return mockClaims;
  return mockClaims.filter((claim) => claim.status.toLowerCase() === status.toLowerCase());
};

// Helper to get pending claims for HR
export const getPendingClaims = (): Claim[] => {
  return mockClaims.filter((claim) => claim.status === 'Submitted');
};

// Helper to get approved claims for Accounts
export const getApprovedClaims = (): Claim[] => {
  return mockClaims.filter((claim) => claim.status === 'Approved');
};
