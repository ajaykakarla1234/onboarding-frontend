import { useState, useEffect } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AboutMeComponent, AddressComponent, BirthdateComponent } from './FormComponents';
import { useOnboarding } from '../context/OnboardingContext';
import { useAuth } from '../context/AuthContext';

const DynamicStepContent = ({ step, onNext, onBack }) => {
  const navigate = useNavigate();
  const { userData, config } = useOnboarding();
  const { user } = useAuth();
  const [components, setComponents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const pageConfig = config.find(c => c.page_number === step);
    if (pageConfig) {
      const activeComponents = [];
      if (pageConfig.has_about_me) activeComponents.push('about_me');
      if (pageConfig.has_address) activeComponents.push('address');
      if (pageConfig.has_birthdate) activeComponents.push('birthdate');
      setComponents(activeComponents);
    }
  }, [step, config]);

  const handleSave = async () => {
    try {
      // Update user data using PUT request
      await api.put(`/api/users/${user.id}`, {
        about_me: userData.about_me,
        street_address: userData.street_address,
        city: userData.city,
        state: userData.state,
        zip_code: userData.zip_code,
        birthdate: userData.birthdate
      });

      // Call the parent's onNext handler
      onNext();
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to save progress');
    }
  };

  const renderComponent = (componentName) => {
    switch (componentName) {
      case 'about_me':
        return <AboutMeComponent key="about_me" />;
      case 'address':
        return <AddressComponent key="address" />;
      case 'birthdate':
        return <BirthdateComponent key="birthdate" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {components.map(renderComponent)}

      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3 }}>
        <Button
          variant="contained"
          onClick={onBack}
          disabled={step === 1}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          {step === 3 ? 'Finish' : 'Next'}
        </Button>
      </Stack>
    </Box>
  );
};

export default DynamicStepContent;