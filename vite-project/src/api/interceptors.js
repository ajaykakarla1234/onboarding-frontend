// Add response interceptor to handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    // Special handling for login endpoint - don't do any global error handling
    if (error.config && error.config.url && error.config.url.includes('/api/auth/login')) {
      console.log('Login error - letting component handle it');
      return Promise.reject(error);
    }
    
    // Handle authentication errors for other endpoints
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Authentication error:', error.response);
      
      // Special handling for config endpoint errors - let the component handle them
      if (error.config && error.config.url && error.config.url.includes('/api/config')) {
        console.log('Config API error - letting component handle it');
        return Promise.reject(error);
      }
      
      // Don't redirect from admin page or login page automatically
      if (!window.location.pathname.includes('/admin') && !window.location.pathname.includes('/login')) {
        console.log('Redirecting to login due to auth error');
        localStorage.removeItem('authToken');
        // Use a flag to prevent infinite redirects
        if (!sessionStorage.getItem('redirecting')) {
          sessionStorage.setItem('redirecting', 'true');
          setTimeout(() => {
            sessionStorage.removeItem('redirecting');
          }, 2000);
          window.location = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);