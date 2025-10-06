import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredProgress, requireAdmin }) => {
  const { user } = useAuth();

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin routes check
  if (requireAdmin && user.role !== 'admin') {
    // If completed onboarding, show completion, otherwise redirect to their step
    if (user.progress === 4) {
      return <Navigate to="/completion" replace />;
    } else {
      return <Navigate to={`/onboarding/step${user.progress}`} replace />;
    }
  }

  // Redirect if user tries to access a page beyond their progress
  if (requiredProgress && user.progress < requiredProgress) {
    // Redirect to appropriate step based on progress
    return <Navigate to={`/onboarding/step${user.progress}`} replace />;
  }

  // If user has completed onboarding (progress = 4) and tries to access onboarding pages
  if (user.progress === 4 && window.location.pathname.includes('/onboarding/step')) {
    return <Navigate to="/completion" replace />;
  }

  return children;
};

export default ProtectedRoute;