import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredProgress }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if user tries to access a page beyond their progress
  if (requiredProgress && user.progress < requiredProgress) {
    // Redirect to appropriate step based on progress
    return <Navigate to={`/onboarding/step${user.progress}`} replace />;
  }

  // If user has completed onboarding (progress = 4) and tries to access onboarding pages
  if (user.progress === 4 && window.location.pathname.includes('/onboarding')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;