import { BrowserRouter as Router } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { OnboardingProvider } from './context/OnboardingContext';
import AppRoutes from './routes';
import Header from './components/layout/Header';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <OnboardingProvider>
          <Router basename="/onboarding-frontend">
            <Header />
            <Box sx={{ pt: 2 }}>
              <AppRoutes />
            </Box>
          </Router>
        </OnboardingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
