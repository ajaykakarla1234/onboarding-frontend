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
    console.log('DynamicStepContent - Current step:', step);
    console.log('DynamicStepContent - Available config:', config);

    // Safeguard against empty or invalid config
    if (!Array.isArray(config) || config.length === 0) {
      console.warn('No valid configuration found, using all components as fallback');
      setComponents(['about_me', 'address', 'birthdate']);
      return;
    }

    const pageConfig = config.find(c => c.page_number === step);
    console.log('Found page config for step', step, ':', pageConfig);

    if (pageConfig) {
      const activeComponents = [];
      if (pageConfig.has_about_me) activeComponents.push('about_me');
      if (pageConfig.has_address) activeComponents.push('address');
      if (pageConfig.has_birthdate) activeComponents.push('birthdate');
      
      console.log('Setting active components:', activeComponents);
      setComponents(activeComponents);
      
      // Fallback if no components are configured for this page
      if (activeComponents.length === 0) {
        console.warn('No components configured for step', step, 'using fallback');
        setComponents(['about_me', 'address', 'birthdate']);
      }
    } else {
      console.warn('No configuration found for step', step);
      // Fallback if no config found for this step
      setComponents(['about_me', 'address', 'birthdate']);
    }
  }, [step, config]);

  // Function to validate age (18+)
  const validateAge = (birthdate) => {
    if (!birthdate) return true;
    
    const today = new Date();
    const birthDate = new Date(birthdate);
    
    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  };

  const handleSave = async () => {
    try {
      console.log('Saving user data for step', step, ':', userData);
      
      // Validate birthdate if it's included in this step
      if (components.includes('birthdate') && userData.birthdate) {
        if (!validateAge(userData.birthdate)) {
          setError('You must be at least 18 years old to continue');
          return;
        }
      }
      
      // Update user data using PUT request
      await api.put(`/api/users/${user.id}`, {
        about_me: userData.about_me,
        street_address: userData.street_address,
        city: userData.city,
        state: userData.state,
        zip_code: userData.zip_code,
        birthdate: userData.birthdate,
        currentPage: step // Send current page info for progress tracking
      });

      console.log('User data saved successfully');
      
      // Call the parent's onNext handler
      onNext();
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to save progress');
    }
  };

  const renderComponent = (componentName) => {
    console.log('Rendering component:', componentName);
    
    switch (componentName) {
      case 'about_me':
        return <AboutMeComponent key="about_me" />;
      case 'address':
        return <AddressComponent key="address" />;
      case 'birthdate':
        return <BirthdateComponent key="birthdate" />;
      default:
        console.warn('Unknown component name:', componentName);
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