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
  
  // Special case for admin config endpoint - only add default admin auth if no auth header exists
  if (config.url === '/api/config' && config.method === 'put' && !config.headers['Authorization']) {
    // Add default admin auth for config updates if none was provided
    console.log('Adding default admin auth for config endpoint');
    config.headers['Authorization'] = 'Bearer admin@onboarding.io';
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Import response interceptors
import './interceptors';

export default api;