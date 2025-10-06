import axios from 'axios';

// Determine if we're running in local development environment
const isLocalDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';

// For local development, we'll use the proxy defined in vite.config.js
// For production, we'll use the environment variable or fall back to EC2 IP
const apiBaseUrl = isLocalDevelopment 
  ? '' // Use relative URL to leverage Vite proxy  
  : (import.meta.env.VITE_API_URL || 'http://18.117.218.119:5000');

console.log('API using baseURL:', apiBaseUrl);

const api = axios.create({
  baseURL: apiBaseUrl,
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