import apiClient from './apiClient';

export interface Comment {
  id: string;
  user_id: string;
  username: string;
  user_avatar_url?: string;
  content: string;
  parent_id?: string;
  created_at: string;
  replies?: Comment[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const commentService = {
  /**
   * Fetch comments for a specific art piece
   */
  getComments: async (pieceId: string, page = 1, limit = 10): Promise<PaginatedResponse<Comment>> => {
    const { data } = await apiClient.get(`/portfolio/${pieceId}/comments`, {
      params: { page, limit }
    });
    return data;
  },

  /**
   * Add a comment to an art piece (optionally with parentId for reply)
   */
  createComment: async (pieceId: string, content: string, parentId?: string): Promise<Comment> => {
    const { data } = await apiClient.post(`/portfolio/${pieceId}/comments`, {
      content,
      parent_id: parentId
    });
    return data;
  },

  /**
   * Delete a comment by ID
   */
  deleteComment: async (commentId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.delete(`/comments/${commentId}`);
    return data;
  }
};
