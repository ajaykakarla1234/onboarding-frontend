import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle authorization
api.interceptors.request.use((config) => {
  // Add Authorization header for admin endpoints
  if (config.url === '/api/config' && config.method === 'put') {
    config.headers['Authorization'] = 'Bearer admin@onboarding.io';
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;