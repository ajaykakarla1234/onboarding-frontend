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
        const response = await api.get('/api/config');
        const config = response.data;
        const newComponents = {
          aboutMe: { page: config.find(c => c.has_about_me)?.page_number || 2 },
          address: { page: config.find(c => c.has_address)?.page_number || 3 },
          birthdate: { page: config.find(c => c.has_birthdate)?.page_number || 2 }
        };
        setComponents(newComponents);
      } catch (error) {
        setError('Failed to fetch component configuration');
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

    try {
      const config = [2, 3].map(pageNumber => ({
        page_number: pageNumber,
        has_about_me: components.aboutMe.page === pageNumber,
        has_address: components.address.page === pageNumber,
        has_birthdate: components.birthdate.page === pageNumber
      }));
      
      await api.put('/api/config', config);
      setSuccess('Configuration saved successfully');
      setError('');
    } catch (error) {
      setError('Failed to save configuration');
      setSuccess('');
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