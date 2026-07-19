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
   * Fetch the details for an artwork of a specific user.
   */
  getArtwork: async (userId: string, pieceId: string, width?: number, height?: number) => {
    const { data } = await apiClient.get(`/users/${userId}/portfolio/${pieceId}`, {
      params: { width, height }
    });
    return data;
  },

  /** 
   * Fetch the details for an artwork owned by the current logged-in user.
   */
  getMyArtwork: async (pieceId: string, width?: number, height?: number) => {
    const { data } = await apiClient.get(`/users/me/portfolio/${pieceId}`, {
      params: { width, height }
    });
    return data;
  },

  /**
   * Fetch the details for an artwork by its piece ID alone.
   */
  getArtworkById: async (pieceId: string, width?: number, height?: number) => {
    const { data } = await apiClient.get(`/portfolio/${pieceId}`, {
      params: { width, height }
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
   * Fetch all published artworks across the platform.
   */
  getAllArtworks: async (page = 1, limit = 12, category?: string, search?: string, sort?: string) => {
    const { data } = await apiClient.get('/portfolio', {
      params: { page, limit, category, search, sort }
    });
    return data;
  },

  /**
   * Remove a piece from the Studio archives permanently.
   */
  deletePiece: async (pieceId: string) => {
    const { data } = await apiClient.delete(`/users/me/portfolio/${pieceId}`);
    return data;
  },

  /**
   * Record a view for an artwork.
   */
  recordView: async (pieceId: string) => {
    const { data } = await apiClient.post(`/portfolio/${pieceId}/view`);
    return data;
  }
};
