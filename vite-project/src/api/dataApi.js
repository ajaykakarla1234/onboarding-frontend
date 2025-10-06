import api from './index';

// Data-related API functions for tables, reports, etc.
export const dataApi = {
  // Get all data entries
  getAllEntries: async () => {
    return api.get('/api/data');
  },
  
  // Get a specific entry
  getEntry: async (id) => {
    return api.get(`/api/data/${id}`);
  },
  
  // Add a new entry
  addEntry: async (data) => {
    return api.post('/api/data', data);
  },
  
  // Update an existing entry
  updateEntry: async (id, data) => {
    return api.put(`/api/data/${id}`, data);
  },
  
  // Delete an entry
  deleteEntry: async (id) => {
    return api.delete(`/api/data/${id}`);
  }
};

export default dataApi;