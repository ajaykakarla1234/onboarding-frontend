import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { OnboardingProvider } from './context/OnboardingContext';
import OnboardingWizard from './pages/OnboardingWizard';
import AdminPage from './pages/AdminPage';
import DataTablePage from './pages/DataTablePage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';

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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/onboarding/step1" element={<OnboardingWizard />} />
                <Route path="/onboarding/step2" element={<OnboardingWizard />} />
                <Route path="/onboarding/step3" element={<OnboardingWizard />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/data" element={<DataTablePage />} />
              </Routes>
            </Box>
          </Router>
        </OnboardingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
