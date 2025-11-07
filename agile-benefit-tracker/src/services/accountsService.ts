import api from './api';
import type { Claim } from '../types';
import { getApprovedClaims as getMockApprovedClaims, mockClaims } from '../data/mockData';
import { config } from '../config/config';

export const accountsService = {
  // Get all approved claims
  getApprovedClaims: async (): Promise<Claim[]> => {
    if (config.USE_MOCK_DATA) {
      return Promise.resolve(getMockApprovedClaims());
    }
    const response = await api.get('/accounts/claims/approved');
    return response.data;
  },

  // Mark claim as paid
  markAsPaid: async (id: string): Promise<Claim> => {
    if (config.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const claim = mockClaims.find((c) => c.id === id);
      if (claim) {
        claim.status = 'Paid';
        claim.updatedAt = new Date().toISOString();
      }
      return Promise.resolve(claim!);
    }
    const response = await api.patch(`/accounts/claims/${id}/pay`);
    return response.data;
  },

  // Export payment summary
  exportPayments: async (format: 'csv' | 'excel' | 'pdf'): Promise<Blob> => {
    if (config.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Create mock blob
      const mockData = `Mock ${format.toUpperCase()} export data`;
      return Promise.resolve(new Blob([mockData], { type: 'text/plain' }));
    }
    const response = await api.get(`/accounts/export/${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
