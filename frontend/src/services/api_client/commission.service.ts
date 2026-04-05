import apiClient from './apiClient';

/**
 * CommissionService
 * Handles all commissioning workflow actions for both artists and clients.
 */
export const commissionService = {
  /**
   * Get all commissions for the current user.
   */
  getCommissions: async () => {
    const { data } = await apiClient.get('/commissions');
    return data;
  },

  /**
   * Fetch the current live work-in-progress queue.
   */
  getLiveQueue: async (artistId?: string) => {
    const { data } = await apiClient.get('/commissions/queue', {
      params: { artistId }
    });
    return data;
  },

  /**
   * Post a new commission request.
   */
  requestCommission: async (artistId: string, requestData: any) => {
    const { data } = await apiClient.post(`/commissions/request/${artistId}`, requestData);
    return data;
  },

  /**
   * Artist: Accept or decline a pending commission.
   */
  updateCommissionStatus: async (commissionId: string, status: 'ACCEPTED' | 'DECLINED' | 'IN_PROGRESS' | 'COMPLETED') => {
    const { data } = await apiClient.patch(`/commissions/${commissionId}/status`, { status });
    return data;
  }
};
