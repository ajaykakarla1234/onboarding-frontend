import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';
import { fetchLatestConfig } from '../utils/configUtils';

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

  // Fetch config when the provider mounts or when currentStep changes
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const configData = await fetchLatestConfig();
        setConfig(configData);
      } catch (error) {
        console.error('Error loading config:', error);
      }
    };

    loadConfig();
    
    // Set up polling to check for config updates every 30 seconds
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadConfig();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
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
    
    // Handle both function updates and direct object updates
    if (typeof data === 'function') {
      setUserData(data);
    } else {
      // Update only the fields that are provided
      setUserData(prevData => ({
        ...prevData,
        ...(data.about_me !== undefined ? { about_me: data.about_me } : {}),
        ...(data.street_address !== undefined ? { street_address: data.street_address } : {}),
        ...(data.city !== undefined ? { city: data.city } : {}),
        ...(data.state !== undefined ? { state: data.state } : {}),
        ...(data.zip_code !== undefined ? { zip_code: data.zip_code } : {}),
        ...(data.birthdate !== undefined ? { birthdate: data.birthdate } : {})
      }));
    }
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