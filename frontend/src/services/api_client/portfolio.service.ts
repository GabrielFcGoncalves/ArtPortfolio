import apiClient from './apiClient';

/**
 * PortfolioService
 * Handles all art-piece related operations for the artist.
 */
export const portfolioService = {
  /**
   * Fetch the current user's gallery collection.
   * Includes both public pieces and drafts.
   */
  getMyPortfolio: async (page = 1, limit = 12) => {
    const { data } = await apiClient.get('/users/me/portfolio', {
      params: { page, limit }
    });
    return data;
  },

  /**
   * Create a new art piece from the Atelier creation stepper.
   */
  createPiece: async (formData: any) => {
    const { data } = await apiClient.post('/users/me/portfolio', formData);
    return data;
  },

  /**
   * Persist the reordered sequence of your assets.
   */
  reorderAssets: async (pieceId: string, assetIds: string[]) => {
    const { data } = await apiClient.post(`/users/me/portfolio/${pieceId}/reorder-assets`, assetIds);
    return data;
  },

  /**
   * Update existing art piece settings.
   */
  updatePiece: async (pieceId: string, formData: any) => {
    const { data } = await apiClient.patch(`/users/me/portfolio/${pieceId}`, formData);
    return data;
  },

  /**
   * Remove a piece from the Studio archives permanently.
   */
  deletePiece: async (pieceId: string) => {
    const { data } = await apiClient.delete(`/users/me/portfolio/${pieceId}`);
    return data;
  }
};
