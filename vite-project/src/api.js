import axios from 'axios';

// Determine if we're running in local development environment
const isLocalDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';

// For local development, we'll use the proxy defined in vite.config.js
// For production, we'll use the environment variable or fall back to domain
const apiBaseUrl = isLocalDevelopment 
  ? '' // Use relative URL to leverage Vite proxy  
  : (import.meta.env.VITE_API_URL || 'https://getonboarded.duckdns.org'); // HTTPS domain for secure access

console.log('API using baseURL:', apiBaseUrl);

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Changed from 'token' to match AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('authToken'); // Fixed to match the token key used in request interceptor
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;