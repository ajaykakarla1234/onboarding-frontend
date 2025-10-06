import React from 'react';
import { Box, Paper, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CompletionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{ 
          mt: 8, 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Box 
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: 'success.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3
          }}
        >
          <Typography variant="h2" role="img" aria-label="success">
            ✓
          </Typography>
        </Box>
        
        <Typography component="h1" variant="h4" gutterBottom>
          Onboarding Completed!
        </Typography>
        
        <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
          Thank you for completing the process
        </Typography>
        
        <Box
          sx={{ 
            bgcolor: 'success.light', 
            p: 3, 
            borderRadius: 2, 
            width: '100%',
            mb: 4,
            color: 'success.dark'
          }}
        >
          <Typography align="center">
            We've successfully recorded all your information, {user?.email}.
            Your account is now fully set up.
          </Typography>
        </Box>
        
        {/* Buttons removed as they were unnecessary */}
      </Paper>
    </Container>
  );
};

export default CompletionPage;