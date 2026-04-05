import axios from 'axios';
import keycloak from '../../providers/keycloak';

/**
 * Configure the base axios instance for the Atelier project.
 * It automatically ensures the Keycloak token is fresh before sending requests.
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    // Attempt to refresh the token if it's within 30 seconds of expiring
    if (keycloak.token) {
      try {
        await keycloak.updateToken(30);
        if (config.headers) {
          config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
      } catch (error) {
        console.error('Failed to refresh token', error);
        // Optional: keycloak.login() or handle session expiry
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized handling
    if (error.response?.status === 401) {
      console.warn('Authentication expired or missing. Triggering re-auth flow.');
      // Optionally trigger global logout or redirect
    }
    return Promise.reject(error);
  }
);

export default apiClient;
