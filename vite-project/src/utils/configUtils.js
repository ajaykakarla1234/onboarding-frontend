import api from '../api';

// Global function to fetch the latest config
export const fetchLatestConfig = async () => {
  try {
    console.log('Fetching latest config...');
    const response = await api.get('/api/config');
    console.log('Latest config received:', response.data);
    
    // Handle different response formats - always get the raw array
    const configData = response.data;
    
    if (Array.isArray(configData) && configData.length > 0) {
      console.log('Returning parsed config data:', configData);
      return configData;
    } else {
      console.error('Invalid config format received:', configData);
      return getDefaultConfig();
    }
  } catch (error) {
    console.error('Error fetching config:', error);
    return getDefaultConfig();
  }
};

// Default config in case API fails
export const getDefaultConfig = () => {
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
};