import api from './index';

// User authentication and profile API functions
export const userApi = {
  // Login user
  login: async (email, password) => {
    return api.post('/api/auth/login', { email, password });
  },

  // Get user profile
  getProfile: async (userId) => {
    return api.get(`/api/users/${userId}`);
  },

  // Update user profile
  updateProfile: async (userId, userData) => {
    return api.put(`/api/users/${userId}`, userData);
  }
};

export default userApi;