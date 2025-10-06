import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { OnboardingProvider } from './context/OnboardingContext';
import OnboardingWizard from './pages/OnboardingWizard';
import AdminPage from './pages/AdminPage';
import DataTablePage from './pages/DataTablePage';
import CompletionPage from './pages/CompletionPage';
import Login from './pages/Login';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <OnboardingProvider>
          <Router>
            <Header />
            <Box sx={{ pt: 2 }}>
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
            </Box>
          </Router>
        </OnboardingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
