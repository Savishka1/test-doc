import api from './api';
import type { Claim, ClaimBalance } from '../types';
import { mockClaims, mockBalance } from '../data/mockData';
import { config } from '../config/config';

export const claimService = {
  // Get all claims for the current user
  getClaims: async (): Promise<Claim[]> => {
    if (config.USE_MOCK_DATA) {
      return Promise.resolve(mockClaims);
    }
    const response = await api.get('/claims');
    return response.data;
  },

  // Get a specific claim by ID
  getClaim: async (id: string): Promise<Claim> => {
    if (config.USE_MOCK_DATA) {
      const claim = mockClaims.find((c) => c.id === id);
      if (!claim) throw new Error('Claim not found');
      return Promise.resolve(claim);
    }
    const response = await api.get(`/claims/${id}`);
    return response.data;
  },

  // Submit a new claim
  submitClaim: async (formData: FormData): Promise<Claim> => {
    if (config.USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newClaim: Claim = {
        id: `CLM${Date.now()}`,
        employeeId: '1',
        employeeName: 'John Doe',
        claimType: formData.get('claimType') as 'OPD' | 'Wellness',
        amount: parseFloat(formData.get('amount') as string),
        date: formData.get('date') as string,
        description: formData.get('description') as string,
        billUrl: '/uploads/mock-bill.pdf',
        status: 'Submitted',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockClaims.unshift(newClaim);
      return Promise.resolve(newClaim);
    }
    const response = await api.post('/claims', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update an existing claim
  updateClaim: async (id: string, formData: FormData): Promise<Claim> => {
    if (config.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const claimIndex = mockClaims.findIndex((c) => c.id === id);
      if (claimIndex === -1) throw new Error('Claim not found');
      
      mockClaims[claimIndex] = {
        ...mockClaims[claimIndex],
        claimType: formData.get('claimType') as 'OPD' | 'Wellness',
        amount: parseFloat(formData.get('amount') as string),
        date: formData.get('date') as string,
        description: formData.get('description') as string,
        status: 'Submitted',
        updatedAt: new Date().toISOString(),
      };
      return Promise.resolve(mockClaims[claimIndex]);
    }
    const response = await api.put(`/claims/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get claim balance
  getBalance: async (): Promise<ClaimBalance> => {
    if (config.USE_MOCK_DATA) {
      return Promise.resolve(mockBalance);
    }
    const response = await api.get('/claims/balance');
    return response.data;
  },
};
