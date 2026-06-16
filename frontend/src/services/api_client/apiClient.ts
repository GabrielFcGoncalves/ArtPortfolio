import axios from 'axios';
import keycloak from '../../providers/keycloak';


const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {

    if (keycloak.token) {
      try {
        await keycloak.updateToken(30);
        if (config.headers) {
          config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
      } catch (error) {
        console.error('Failed to refresh token', error);
        keycloak.login();
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      console.warn('Authentication expired or missing. Triggering re-auth flow.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
