import apiClient from './apiClient';

export interface FavoriteToggleResponse {
  is_favorited: boolean;
  favorite_count: number;
}

const favoriteService = {
  toggleFavorite: async (pieceId: string): Promise<FavoriteToggleResponse> => {
    const { data } = await apiClient.post<FavoriteToggleResponse>(`/portfolio/${pieceId}/favorite`);
    return data;
  },

  isFavorited: async (pieceId: string): Promise<FavoriteToggleResponse> => {
    const { data } = await apiClient.get<FavoriteToggleResponse>(`/portfolio/${pieceId}/favorite`);
    return data;
  }
};

export default favoriteService;
