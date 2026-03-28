import { Commission } from '../types';
import apiClient from '../api/apiClient';

export const commissionService = {
  // A real API call would look like:
  // getCommissions: async (): Promise<Commission[]> => {
  //   const response = await apiClient.get('/commissions');
  //   return response.data;
  // },

  // Using a mock for now so the UI can be built
  getCommissions: async (): Promise<Commission[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            artistId: 'art-123',
            clientId: 'cli-456',
            title: 'Character Reference Sheet',
            description: 'Full body, 3 expressions, color palette.',
            price: 150,
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            artistId: 'art-123',
            clientId: 'cli-789',
            title: 'Twitch Emotes',
            description: 'Set of 5 custom emotes.',
            price: 75,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }, 500);
    });
  },

  getLiveQueue: async (): Promise<Commission[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            artistId: 'art-123',
            clientId: 'cli-456',
            title: 'Character Reference Sheet',
            description: 'Full body, 3 expressions, color palette.',
            price: 150,
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ]);
      }, 300);
    });
  }
};
