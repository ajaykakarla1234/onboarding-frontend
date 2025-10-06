import api from '../api/index';
import storageService from './storageService';

const CONFIG_CACHE_KEY = 'app_config_cache';
const CONFIG_TIMESTAMP_KEY = 'app_config_timestamp';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Centralized config service
const configService = {
  /**
   * Fetches the latest configuration from API with caching
   * Uses cached config if available and not expired
   */
  fetchLatestConfig: async (bypassCache = false) => {
    try {
      // Check for cached config if cache isn't being bypassed
      if (!bypassCache) {
        const cachedConfig = storageService.local.get(CONFIG_CACHE_KEY);
        const cachedTimestamp = storageService.local.get(CONFIG_TIMESTAMP_KEY);
        
        // Use cache if available and not expired
        if (cachedConfig && cachedTimestamp) {
          const now = new Date().getTime();
          if (now - cachedTimestamp < CACHE_TTL) {
            console.log('Using cached config:', cachedConfig);
            return cachedConfig;
          }
        }
      }
      
      // Fetch fresh config from API
      console.log('Fetching latest config from API...');
      const response = await api.get('/api/config');
      console.log('Latest config received:', response.data);
      
      // Handle different response formats - always get the raw array
      const configData = response.data;
      
      if (Array.isArray(configData) && configData.length > 0) {
        // Update cache
        storageService.local.set(CONFIG_CACHE_KEY, configData);
        storageService.local.set(CONFIG_TIMESTAMP_KEY, new Date().getTime());
        
        console.log('Returning and caching config data:', configData);
        return configData;
      } else {
        console.error('Invalid config format received:', configData);
        return configService.getDefaultConfig();
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      return configService.getDefaultConfig();
    }
  },
  
  /**
   * Save updated configuration to the backend
   */
  saveConfig: async (configData) => {
    try {
      const response = await api.put('/api/config', configData);
      // Update cache after successful save
      storageService.local.set(CONFIG_CACHE_KEY, response.data);
      storageService.local.set(CONFIG_TIMESTAMP_KEY, new Date().getTime());
      return response.data;
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  },
  
  /**
   * Clear config cache and force fetch from API
   */
  refreshConfig: async () => {
    storageService.local.remove(CONFIG_CACHE_KEY);
    storageService.local.remove(CONFIG_TIMESTAMP_KEY);
    return configService.fetchLatestConfig(true);
  },

  /**
   * Default config in case API fails
   */
  getDefaultConfig: () => {
    return [
      {
        page_number: 2,
        has_about_me: true,
        has_address: false,
        has_birthdate: false
      },
      {
        page_number: 3,
        has_about_me: false,
        has_address: true,
        has_birthdate: true
      }
    ];
  }
};

export default configService;

// Named exports for selective importing
export const { fetchLatestConfig, saveConfig, refreshConfig, getDefaultConfig } = configService;