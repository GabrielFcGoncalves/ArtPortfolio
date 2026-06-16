import apiClient from './apiClient';

export interface PublicProfile {
  id: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  role: string;
  isVerified: boolean;
  isFeatured: boolean;
  followerCount: number;
  commissionCount: number;
  averageRating: number;
  createdAt: string;
}

export const userService = {
  /**
   * Search for users matching a username query.
   */
  searchUsers: async (query: string): Promise<PublicProfile[]> => {
    const { data } = await apiClient.get('/users/search', {
      params: { query }
    });
    return data;
  },

  /**
   * Fetch public profile of a user by id.
   */
  getPublicProfile: async (userId: string): Promise<PublicProfile> => {
    const { data } = await apiClient.get(`/users/${userId}`);
    return data;
  }
};
