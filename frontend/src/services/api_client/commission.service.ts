import apiClient from './apiClient';
import type { Commission, CommissionSummary, CommissionCreateRequest } from '@/types';

/**
 * CommissionService
 * Handles all commissioning workflow actions for both artists and clients.
 */
export const commissionService = {
  /**
   * Get paginated commissions for the current user.
   * @param role - 'ARTIST' | 'CLIENT' | undefined (both)
   * @param status - Filter by commission status or 'all'
   */
  getCommissions: async (role?: string, status?: string, page = 1, limit = 20) => {
    const { data } = await apiClient.get('/commissions', {
      params: { role, status, page, limit }
    });
    return data;
  },

  /**
   * Get a single commission's full detail.
   */
  getCommissionDetail: async (commissionId: string): Promise<Commission> => {
    const { data } = await apiClient.get(`/commissions/${commissionId}`);
    return data;
  },

  /**
   * Submit a new commission request to an artist.
   */
  createCommission: async (request: CommissionCreateRequest): Promise<Commission> => {
    const { data } = await apiClient.post('/commissions', request);
    return data;
  },

  /**
   * Artist: Accept a pending commission.
   */
  acceptCommission: async (commissionId: string): Promise<Commission> => {
    const { data } = await apiClient.post(`/commissions/${commissionId}/accept`);
    return data;
  },

  /**
   * Artist: Reject a pending commission.
   */
  rejectCommission: async (commissionId: string, reason?: string) => {
    const { data } = await apiClient.post(`/commissions/${commissionId}/reject`, { reason });
    return data;
  },

  /**
   * Cancel an existing commission.
   */
  cancelCommission: async (commissionId: string, reason?: string) => {
    const { data } = await apiClient.post(`/commissions/${commissionId}/cancel`, { reason });
    return data;
  },

  /**
   * Update a commission's metadata.
   */
  updateCommission: async (commissionId: string, updates: { title?: string; description?: string }) => {
    const { data } = await apiClient.patch(`/commissions/${commissionId}`, updates);
    return data;
  }
};
