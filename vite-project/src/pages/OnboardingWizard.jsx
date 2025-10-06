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
  const { user, setUser } = useAuth();
  const { 
    userData, 
    updateUserData, 
    currentStep, 
    setCurrentStep
  } = useOnboarding();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      // Get the current page number from the URL
      const currentPageNumber = parseInt(window.location.pathname.split('step')[1]) || 1;
      
      // If user is trying to access a step beyond their progress, redirect
      if (currentPageNumber > user.progress) {
        navigate(`/onboarding/step${user.progress}`);
        return;
      }
      
      // Set the current step based on the URL or user's progress
      setCurrentStep(currentPageNumber);

      // If onboarding is completed, show completion screen
      if (user.progress === 4) {
        setShowCompletion(true);
      }
    } catch (err) {
      console.error('Error in progress effect:', err);
    } finally {
      setLoading(false);
    }
  }, [user, navigate, setCurrentStep]);

  const handleNext = async (e) => {
    if (e) e.preventDefault();
    try {
      // Don't handle step 1 here anymore, it's handled by handleStartOnboarding
      if (currentStep === 1) {
        return;
      }

      // For other steps, update user data with form data
      const response = await api.put(`/api/users/${user.id}`, {
        about_me: userData.about_me || '',
        street_address: userData.street_address || '',
        city: userData.city || '',
        state: userData.state || '',
        zip_code: userData.zip_code || '',
        birthdate: userData.birthdate || null,
        progress: currentStep + 1, // Update progress for next step
        currentPage: currentStep // This is important for the backend to update progress properly
      });

      if (response.data.user) {
        // Update the local userData with the response
        updateUserData(response.data.user);
        // Update user progress
        setUser(prev => ({
          ...prev,
          progress: currentStep + 1
        }));
      }
      
      if (currentStep < 3) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        navigate(`/onboarding/step${nextStep}`);
      } else {
        // Update user progress
        setUser(prev => ({ 
          ...prev, 
          progress: 4 // Mark as completed
        }));

        // Final update to mark as completed
        await api.put(`/api/users/${user.id}`, {
          progress: 4,
          currentPage: 3  // This tells the backend we're on the last step
        });
        
        // Redirect to completion page
        navigate('/completion');
      }
    } catch (error) {
      console.error('Onboarding error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        step: currentStep
      });

      // Clear any previous errors
      setError('');

      if (error.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 404) {
        // Handle the case where the endpoint doesn't exist
        if (error.config?.url.includes('/progress')) {
          // Ignore this error and let the main update handle it
          return;
        }
        setError('User not found. Please login again.');
        navigate('/login');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message.includes('Network Error')) {
        setError('Cannot connect to server. Please check your connection.');
      } else {
        setError('There was a problem updating your information. Please try again.');
      }
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

  const handleStartOnboarding = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing errors

    try {
      // Make API call to update user progress
      const response = await api.put(`/api/users/${user.id}`, {
        progress: 2
      });

      if (response.data) {
        const updatedUser = response.data.user || response.data;
        
        // Update the user context with the new progress
        setUser(prev => ({
          ...prev,
          ...updatedUser,
          progress: 2
        }));

        // Update current step and navigate
        setCurrentStep(2);
        navigate('/onboarding/step2', { replace: true });
      }
    } catch (error) {
      console.error('Error in handleStartOnboarding:', error);
      setError('Could not start onboarding. Please try again.');
    }
  };

  const renderStepContent = () => {
    if (showCompletion) {
      return (
        <Box sx={{ 
          textAlign: 'center', 
          py: 6,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'success.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3
          }}>
            <Typography variant="h4" role="img" aria-label="success">
              ✓
            </Typography>
          </Box>
          
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 2,
              color: 'success.main',
              fontWeight: 600
            }}
          >
            Welcome Aboard!
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
            Your onboarding process is complete
          </Typography>
          
          <Box sx={{ 
            maxWidth: 400,
            mx: 'auto',
            mb: 4,
            p: 3,
            bgcolor: 'success.light',
            borderRadius: 2,
            color: 'success.dark'
          }}>
            <Typography>
              Thank you for joining us, {user.email}! Your account is now fully set up.
            </Typography>
          </Box>

          {/* Button removed as it was unnecessary */}
        </Box>
      );
    }

    if (currentStep === 1) {
      return (
        <Box component="form" onSubmit={handleStartOnboarding} sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Welcome!</Typography>
          <Box sx={{ mb: 3 }}>
            <Typography>
              You are logged in as: <strong>{user.email}</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Click Start to begin your onboarding process.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary"
            type="submit"
            fullWidth
          >
            Start Onboarding
          </Button>
        </Box>
      );
    }
    
    return (
      <Box>
        <DynamicStepContent 
          step={currentStep}
          onNext={handleNext}
          onBack={handleBack}
        />
      </Box>
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
        <Box sx={{ mb: 2, mt: -2 }}>
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        </Box>
      )}

      {renderStepContent()}
    </Paper>
  );
};

export default OnboardingWizard;