import { ArtPiece } from '../types';
import apiClient from '../api/apiClient';

export const artService = {
  // Mock function to establish the flow
  getArtPieces: async (): Promise<ArtPiece[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'art-1',
            artistId: 'art-123',
            title: 'Neon Cyberpunk Cityscape',
            description: 'A vibrant illustration of a futuristic city.',
            imageUrl: 'https://via.placeholder.com/400x300.png?text=Cyberpunk',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'art-2',
            artistId: 'art-123',
            title: 'Fantasy Character Portrait',
            description: 'Elf ranger portrait with full render.',
            imageUrl: 'https://via.placeholder.com/400x300.png?text=Elf+Portrait',
            createdAt: new Date().toISOString(),
          }
        ]);
      }, 400);
    });
  },

  // Real API implementation example:
  // getArtPieces: async (): Promise<ArtPiece[]> => {
  //   const response = await apiClient.get('/art-pieces');
  //   return response.data;
  // },
};
