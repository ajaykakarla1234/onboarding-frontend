import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import DynamicStepContent from '../components/DynamicStepContent';

const steps = ['Registration', 'Additional Info', 'Final Details'];

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userData, updateUserData, currentStep, setCurrentStep } = useOnboarding();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCurrentStep = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get(`/api/current-step?userId=${user.id}`);
        setCurrentStep(response.data.currentStep || 1);
        if (response.data.completed) {
          navigate('/data');
        }
      } catch (error) {
        setError('Failed to fetch current step');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentStep();
  }, [user, navigate, setCurrentStep]);

  const handleNext = async () => {
    try {
      if (currentStep === 1) {
        // Skip registration for step 1 since we're using default credentials
        setCurrentStep(prev => prev + 1);
        navigate('/onboarding/step2');
        return;
      }

      // For other steps, update user data
      await api.put(`/api/users/${user.id}`, {
        about_me: userData.about_me,
        street_address: userData.street_address,
        city: userData.city,
        state: userData.state,
        zip_code: userData.zip_code,
        birthdate: userData.birthdate
      });
      
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
        navigate(`/onboarding/step${currentStep + 1}`);
      } else {
        navigate('/data'); // Redirect to data table on completion
      }
    } catch (error) {
      setError('Failed to save progress');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    navigate(`/onboarding/step${currentStep - 1}`);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Welcome!</Typography>
          <Box sx={{ mb: 3 }}>
            <Typography>
              You are logged in as: <strong>{user.email}</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Click Next to continue with your onboarding process.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleNext}
            fullWidth
          >
            Next
          </Button>
        </Box>
      );
    }
    
    return (
      <>
        <DynamicStepContent step={currentStep} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
          >
            {currentStep === 3 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </>
    );
  };

  return (
    <Paper sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 4 }}>
      <Stepper activeStep={currentStep - 1} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {renderStepContent()}
    </Paper>
  );
};

export default OnboardingWizard;