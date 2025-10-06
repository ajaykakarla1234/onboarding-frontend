import { useState, useEffect } from 'react';
import configService from '../services/configService';

/**
 * Custom hook for accessing and using configuration data
 */
const useConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load config when component mounts
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await configService.fetchLatestConfig();
        setConfig(configData);
        setLoading(false);
      } catch (err) {
        console.error('Error in useConfig hook:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Function to reload config
  const refreshConfig = async () => {
    setLoading(true);
    try {
      const configData = await configService.fetchLatestConfig();
      setConfig(configData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { config, loading, error, refreshConfig };
};

export default useConfig;