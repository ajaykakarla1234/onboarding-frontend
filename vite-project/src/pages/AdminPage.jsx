import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Button,
  Alert
} from '@mui/material';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { fetchLatestConfig } from '../utils/configUtils';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [components, setComponents] = useState({
    aboutMe: { page: 2 },
    address: { page: 3 },
    birthdate: { page: 2 }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        console.log('Admin Page - Fetching config...');
        const config = await fetchLatestConfig();
        console.log('Admin Page - Config data loaded:', config);
        
        if (!Array.isArray(config)) {
          throw new Error('Invalid configuration format');
        }
        
        // Map config to component state
        const newComponents = {
          aboutMe: { page: config.find(c => c.has_about_me)?.page_number || 2 },
          address: { page: config.find(c => c.has_address)?.page_number || 3 },
          birthdate: { page: config.find(c => c.has_birthdate)?.page_number || 2 }
        };
        
        console.log('Admin Page - Mapped components:', newComponents);
        setComponents(newComponents);
      } catch (error) {
        console.error('Failed to fetch component configuration:', error);
        if (error.response?.status === 401) {
          setError('Authentication required. Please log in as admin.');
        } else {
          setError('Failed to fetch component configuration: ' + error.message);
        }
      }
    };

    fetchComponents();
  }, []);

  const handleComponentChange = (componentName, page) => {
    setComponents(prev => ({
      ...prev,
      [componentName]: { ...prev[componentName], page }
    }));
  };

  const validateConfiguration = () => {
    const page2Components = Object.entries(components).filter(([_, config]) => config.page === 2);
    const page3Components = Object.entries(components).filter(([_, config]) => config.page === 3);
    
    return page2Components.length > 0 && page3Components.length > 0;
  };

  const handleSave = async () => {
    if (!validateConfiguration()) {
      setError('Each page must have at least one component');
      return;
    }

    setError('');
    setSuccess('');

    try {
      // Create config as an array of page configs
      const configArray = [2, 3].map(pageNumber => ({
        page_number: pageNumber,
        has_about_me: components.aboutMe.page === pageNumber,
        has_address: components.address.page === pageNumber,
        has_birthdate: components.birthdate.page === pageNumber
      }));
      
      console.log('Saving config:', configArray);
      
      // Use admin-specific endpoint with fixed auth
      console.log('Sending config data:', configArray);
      
      // Send the raw array directly as the backend expects
      // NOTE: The API interceptor in api/index.js already adds the admin authorization header
      // so we don't need to add it here to avoid duplication
      const response = await api.put('/api/config', configArray);
      
      console.log('Config save response:', response);
      console.log('Config save status:', response.status, response.statusText);
      console.log('Config save response data:', response.data);
      
      setSuccess('Configuration saved successfully');
      
      // Refresh component state from server to confirm changes
      try {
        const refreshResponse = await api.get('/api/config');
        const updatedConfig = refreshResponse.data;
        const newComponents = {
          aboutMe: { page: updatedConfig.find(c => c.has_about_me)?.page_number || 2 },
          address: { page: updatedConfig.find(c => c.has_address)?.page_number || 3 },
          birthdate: { page: updatedConfig.find(c => c.has_birthdate)?.page_number || 2 }
        };
        setComponents(newComponents);
      } catch (refreshError) {
        console.error('Failed to refresh config after save:', refreshError);
      }
    } catch (error) {
      console.error('Config save error:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          setError('Authentication failed. Please log in again as admin.');
        } else if (error.response.status === 403) {
          setError('You do not have permission to update the configuration.');
        } else {
          setError(`Server error: ${error.response.data.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message}`);
      }
    }
  };

  return (
    <Paper sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Admin Configuration
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ display: 'flex', gap: 4 }}>
        <FormControl component="fieldset" sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Page 2 Components
          </Typography>
          <FormGroup>
            {Object.entries(components).map(([name, config]) => (
              <FormControlLabel
                key={name}
                control={
                  <Checkbox
                    checked={config.page === 2}
                    onChange={() => handleComponentChange(name, config.page === 2 ? 3 : 2)}
                  />
                }
                label={name.charAt(0).toUpperCase() + name.slice(1)}
              />
            ))}
          </FormGroup>
        </FormControl>

        <FormControl component="fieldset" sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Page 3 Components
          </Typography>
          <FormGroup>
            {Object.entries(components).map(([name, config]) => (
              <FormControlLabel
                key={name}
                control={
                  <Checkbox
                    checked={config.page === 3}
                    onChange={() => handleComponentChange(name, config.page === 3 ? 2 : 3)}
                  />
                }
                label={name.charAt(0).toUpperCase() + name.slice(1)}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleSave}
        >
          Save Configuration
        </Button>
      </Box>
    </Paper>
  );
};

export default AdminPage;