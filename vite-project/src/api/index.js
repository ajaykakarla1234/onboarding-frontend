import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for CORS requests if needed
});

// Add request interceptor to handle authorization
api.interceptors.request.use((config) => {
  // Get auth token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Add Authorization header for all secure endpoints
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Special case for admin config endpoint
  if (config.url === '/api/config' && config.method === 'put') {
    // Always include admin auth for config updates
    config.headers['Authorization'] = 'Bearer admin@onboarding.io';
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Import response interceptors
import './interceptors';

export default api;