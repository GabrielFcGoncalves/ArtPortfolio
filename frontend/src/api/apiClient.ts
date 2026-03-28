import axios from 'axios';

// Create a configured Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// A robust way in a real app would be getting the token via next-auth or a keycloak client context
// Since we are requested to add an interceptor that automatically attaches the Keycloak Bearer token:
apiClient.interceptors.request.use(
  (config) => {
    // Determine token retrieval strategy (e.g. localStorage or a global store)
    // For scaffolding purposes, we will attempt to pull from a local storage item or define a placeholder
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('keycloak_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Optionally handle 401 Unauthorized globally here
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - Token may be expired');
      // Redirect to login or trigger a token refresh
    }
    return Promise.reject(error);
  }
);

export default apiClient;
