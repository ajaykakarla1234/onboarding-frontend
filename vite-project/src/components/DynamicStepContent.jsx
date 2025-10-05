import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AboutMeComponent, AddressComponent, BirthdateComponent } from '../components/FormComponents';
import { useOnboarding } from '../context/OnboardingContext';

const DynamicStepContent = ({ step }) => {
  const navigate = useNavigate();
  const { userData, setCurrentStep } = useOnboarding();
  const [components, setComponents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await api.get('/api/config');
        const config = response.data.find(c => c.page_number === step);
        if (config) {
          const activeComponents = [];
          if (config.has_about_me) activeComponents.push('about_me');
          if (config.has_address) activeComponents.push('address');
          if (config.has_birthdate) activeComponents.push('birthdate');
          setComponents(activeComponents);
          console.log('Active components:', activeComponents);
        }
      } catch (error) {
        console.error('Error fetching components:', error);
        setError('Failed to fetch components');
      }
    };

    fetchComponents();
  }, [step]);

  const handleNext = async () => {
    try {
      const { user } = useAuth();
      // Update user data using PUT request
      await api.put(`/api/users/${user.id}`, {
        about_me: userData.about_me,
        street_address: userData.street_address,
        city: userData.city,
        state: userData.state,
        zip_code: userData.zip_code,
        birthdate: userData.birthdate
      });

      if (step < 3) {
        setCurrentStep(step + 1);
        navigate(`/onboarding/step${step + 1}`);
      } else {
        navigate('/data'); // Redirect to data table on completion
      }
    } catch (error) {
      setError('Failed to save progress');
    }
  };

  const handleBack = () => {
    setCurrentStep(step - 1);
    navigate(`/onboarding/step${step - 1}`);
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
    <Box>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {components.map(renderComponent)}
    </Box>
  );
};

export default DynamicStepContent;