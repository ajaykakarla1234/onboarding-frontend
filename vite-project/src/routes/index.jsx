import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import OnboardingWizard from '../pages/OnboardingWizard';
import CompletionPage from '../pages/CompletionPage';
import AdminPage from '../pages/AdminPage';
import DataTablePage from '../pages/DataTablePage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/onboarding/step1" 
        element={
          <ProtectedRoute requiredProgress={1}>
            <OnboardingWizard key="step1" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/onboarding/step2" 
        element={
          <ProtectedRoute requiredProgress={2}>
            <OnboardingWizard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/onboarding/step3" 
        element={
          <ProtectedRoute requiredProgress={3}>
            <OnboardingWizard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/completion" 
        element={
          <ProtectedRoute requiredProgress={4}>
            <CompletionPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requiredProgress={4} requireAdmin={true}>
            <DataTablePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;