// Storage utility functions for localStorage and sessionStorage
const storageService = {
  // LocalStorage methods
  local: {
    get: (key) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Error getting ${key} from localStorage:`, error);
        return localStorage.getItem(key); // Fallback to raw string
      }
    },
    
    set: (key, value) => {
      try {
        localStorage.setItem(
          key, 
          typeof value === 'string' ? value : JSON.stringify(value)
        );
        return true;
      } catch (error) {
        console.error(`Error setting ${key} in localStorage:`, error);
        return false;
      }
    },
    
    remove: (key) => {
      localStorage.removeItem(key);
    },
    
    clear: () => {
      localStorage.clear();
    }
  },
  
  // SessionStorage methods
  session: {
    get: (key) => {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Error getting ${key} from sessionStorage:`, error);
        return sessionStorage.getItem(key); // Fallback to raw string
      }
    },
    
    set: (key, value) => {
      try {
        sessionStorage.setItem(
          key, 
          typeof value === 'string' ? value : JSON.stringify(value)
        );
        return true;
      } catch (error) {
        console.error(`Error setting ${key} in sessionStorage:`, error);
        return false;
      }
    },
    
    remove: (key) => {
      sessionStorage.removeItem(key);
    },
    
    clear: () => {
      sessionStorage.clear();
    }
  },
  
  // Authentication specific storage methods
  auth: {
    setToken: (token) => {
      localStorage.setItem('authToken', token);
    },
    
    getToken: () => {
      return localStorage.getItem('authToken');
    },
    
    setUser: (user) => {
      storageService.local.set('user', user);
    },
    
    getUser: () => {
      return storageService.local.get('user');
    },
    
    clearAuth: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }
};

export default storageService;