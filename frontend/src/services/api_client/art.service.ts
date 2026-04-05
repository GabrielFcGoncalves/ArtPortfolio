import apiClient from './apiClient';

/**
 * ArtService
 * Handles public-facing gallery interactions.
 */
export const artService = {
  /**
   * Get art pieces for a specific user profile (Public).
   */
  getPublicPortfolio: async (userId: string, page = 1, limit = 12) => {
    const { data } = await apiClient.get(`/users/${userId}/portfolio`, {
      params: { page, limit }
    });
    return data;
  },

  /**
   * Get global trending or newest pieces.
   */
  getGlobalGallery: async (page = 1, limit = 12) => {
    const { data } = await apiClient.get('/gallery', {
      params: { page, limit }
    });
    return data;
  }
};
