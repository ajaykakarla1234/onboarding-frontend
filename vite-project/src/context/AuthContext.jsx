import { createContext, useContext, useState } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      // Initialize user with response data and set initial progress
      const userData = {
        ...response.data,
        progress: response.data.progress || 1 // Default to step 1 if progress not provided
      };
      
      // Store auth info in localStorage for persistent sessions
      localStorage.setItem('authToken', userData.email);
      localStorage.setItem('userRole', userData.role);
      
      setUser(userData);
      return userData;
    } catch (error) {
      // Provide clearer error messages based on the response
      if (error.response?.status === 401) {
        throw new Error('Invalid password. Please try again.');
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Login failed. Please check your credentials and try again.');
      }
    }
  };

  const logout = () => {
    setUser(null);
    // Clear auth data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};