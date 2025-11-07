import api from './api';
import type { Claim } from '../types';
import { getPendingClaims as getMockPendingClaims, mockClaims } from '../data/mockData';
import { config } from '../config/config';

export const hrService = {
  // Get all claims for HR (not just pending)
  getPendingClaims: async (): Promise<Claim[]> => {
    if (config.USE_MOCK_DATA) {
      // Return all claims so HR can filter by status
      return Promise.resolve(mockClaims);
    }
    const response = await api.get('/hr/claims/pending');
    return response.data;
  },

  // Approve a claim
  approveClaim: async (id: string): Promise<Claim> => {
    if (config.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const claim = mockClaims.find((c) => c.id === id);
      if (claim) {
        claim.status = 'Approved';
        claim.updatedAt = new Date().toISOString();
      }
      return Promise.resolve(claim!);
    }
    const response = await api.patch(`/hr/claims/${id}/approve`);
    return response.data;
  },

  // Reject a claim with comment
  rejectClaim: async (id: string, comment: string): Promise<Claim> => {
    if (config.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const claim = mockClaims.find((c) => c.id === id);
      if (claim) {
        claim.status = 'Rejected';
        claim.hrComment = comment;
        claim.updatedAt = new Date().toISOString();
      }
      return Promise.resolve(claim!);
    }
    const response = await api.patch(`/hr/claims/${id}/reject`, { comment });
    return response.data;
  },

  // Request update on a claim
  requestUpdate: async (id: string, comment: string): Promise<Claim> => {
    if (config.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const claim = mockClaims.find((c) => c.id === id);
      if (claim) {
        claim.hrComment = comment;
        claim.updatedAt = new Date().toISOString();
      }
      return Promise.resolve(claim!);
    }
    const response = await api.patch(`/hr/claims/${id}/request-update`, { comment });
    return response.data;
  },

  // Get HR analytics
  getAnalytics: async () => {
    if (config.USE_MOCK_DATA) {
      return Promise.resolve({
        totalClaims: mockClaims.length,
        pending: getMockPendingClaims().length,
        approved: mockClaims.filter((c) => c.status === 'Approved').length,
        rejected: mockClaims.filter((c) => c.status === 'Rejected').length,
      });
    }
    const response = await api.get('/hr/analytics');
    return response.data;
  },

  // Update quarterly cap
  updateQuarterlyCap: async (amount: number): Promise<void> => {
    if (config.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Mock: Quarterly cap updated to', amount);
      return Promise.resolve();
    }
    await api.patch('/hr/settings/quarterly-cap', { amount });
  },
};
