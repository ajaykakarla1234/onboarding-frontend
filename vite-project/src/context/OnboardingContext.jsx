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
  const [config, setConfig] = useState([]);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    // Fetch configuration data when the provider mounts
    const fetchConfig = async () => {
      try {
        const response = await api.get('/api/config');
        setConfig(response.data);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    fetchConfig();
  }, []);

  // Initialize progress from localStorage or set to 1
  useEffect(() => {
    const savedProgress = localStorage.getItem('onboardingProgress');
    if (savedProgress) {
      setProgress(parseInt(savedProgress));
      setCurrentStep(parseInt(savedProgress));
    }
  }, []);

  const updateUserData = (data) => {
    console.log('Updating user data:', data);
    // Ensure we're getting all fields from the response
    setUserData(prevData => ({
      ...prevData,
      about_me: data.about_me || '',
      street_address: data.street_address || '',
      city: data.city || '',
      state: data.state || '',
      zip_code: data.zip_code || '',
      birthdate: data.birthdate || null
    }));
  };

  const updateProgress = (newProgress) => {
    setProgress(newProgress);
    localStorage.setItem('onboardingProgress', newProgress.toString());
  };

  return (
    <OnboardingContext.Provider value={{
      userData,
      updateUserData,
      currentStep,
      setCurrentStep,
      config,
      progress,
      updateProgress
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