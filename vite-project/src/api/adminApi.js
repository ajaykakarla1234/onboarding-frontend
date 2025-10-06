import api from './index';
import { fetchLatestConfig } from '../utils/configUtils';

// Admin-related API functions
export const adminApi = {
  // Get configuration
  getConfig: async () => {
    return await fetchLatestConfig();
  },

  // Update configuration
  updateConfig: async (configData) => {
    return api.put('/api/config', configData);
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    return api.get('/api/users');
  }
};

export default adminApi;