// Add response interceptor to handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle authentication errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Authentication error:', error.response);
      
      // Don't redirect from admin page automatically
      if (!window.location.pathname.includes('/admin')) {
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