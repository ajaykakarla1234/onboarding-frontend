import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    about_me: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    birthdate: ''
  });

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Fetch current step from backend when returning
    const fetchCurrentStep = async () => {
      if (user?.id) {
        try {
          const response = await api.get(`/api/current-step?userId=${user.id}`);
          setCurrentStep(response.data.currentStep);
        } catch (error) {
          console.error('Error fetching current step:', error);
        }
      }
    };

    fetchCurrentStep();
  }, [user]);

  const updateUserData = (data) => {
    setUserData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  return (
    <OnboardingContext.Provider value={{
      userData,
      updateUserData,
      currentStep,
      setCurrentStep
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};