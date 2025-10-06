import { TextField, Box, Typography } from '@mui/material';
import { useOnboarding } from '../context/OnboardingContext';
import { useState, useEffect } from 'react';

export const AboutMeComponent = () => {
  const { userData, updateUserData } = useOnboarding();

  return (
    <Box sx={{ mt: 2 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          color: 'primary.main',
          fontWeight: 600,
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          pb: 1,
          display: 'inline-block'
        }}
      >
        About Me
      </Typography>
      <TextField
        multiline
        rows={4}
        fullWidth
        label="Tell us about yourself"
        value={userData.about_me || ''}
        onChange={(e) => updateUserData({ about_me: e.target.value })}
        variant="outlined"
        placeholder="Share a brief description about yourself..."
        InputLabelProps={{
          shrink: true,
          style: { background: 'white', padding: '0 8px' }
        }}
        sx={{
          background: '#fff',
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
            }
          }
        }}
      />
    </Box>
  );
};

export const AddressComponent = () => {
  const { userData, updateUserData } = useOnboarding();
  const [addressData, setAddressData] = useState({
    street_address: userData.street_address || '',
    city: userData.city || '',
    state: userData.state || '',
    zip_code: userData.zip_code || ''
  });

  // Update local state first
  const handleChange = (field) => (event) => {
    const value = field === 'zip_code' 
      ? event.target.value.replace(/\D/g, '').slice(0, 5) 
      : event.target.value;
    
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Also update the parent context
    updateUserData({
      ...userData,
      [field]: value
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          color: 'primary.main',
          fontWeight: 600,
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          pb: 1,
          display: 'inline-block'
        }}
      >
        Address Information
      </Typography>
      
      {/* Simple stacked layout with clear margins */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          id="street_address"
          name="street_address"
          label="Street Address"
          value={addressData.street_address}
          onChange={handleChange('street_address')}
          variant="outlined"
          margin="normal"
          placeholder="Enter your street address"
          InputLabelProps={{
            shrink: true,
            style: { background: 'white', padding: '0 8px' }
          }}
        />
        
        <TextField
          fullWidth
          id="city"
          name="city"
          label="City"
          value={addressData.city}
          onChange={handleChange('city')}
          variant="outlined"
          margin="normal"
          placeholder="Enter your city"
          InputLabelProps={{
            shrink: true,
            style: { background: 'white', padding: '0 8px' }
          }}
        />
        
        <TextField
          fullWidth
          id="state"
          name="state"
          label="State"
          value={addressData.state}
          onChange={handleChange('state')}
          variant="outlined"
          margin="normal"
          placeholder="Enter your state"
          InputLabelProps={{
            shrink: true,
            style: { background: 'white', padding: '0 8px' }
          }}
        />
        
        <TextField
          fullWidth
          id="zip_code"
          name="zip_code"
          label="ZIP Code"
          value={addressData.zip_code}
          onChange={handleChange('zip_code')}
          variant="outlined"
          margin="normal"
          placeholder="Enter your ZIP code"
          inputProps={{ maxLength: 5 }}
          InputLabelProps={{
            shrink: true,
            style: { background: 'white', padding: '0 8px' }
          }}
        />
      </Box>
    </Box>
  );
};

export const BirthdateComponent = () => {
  const { userData, updateUserData } = useOnboarding();
  const [error, setError] = useState('');
  
  const validateAge = (birthdate) => {
    if (!birthdate) return true;
    
    const today = new Date();
    const birthDate = new Date(birthdate);
    
    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  };
  
  const handleDateChange = (e) => {
    const birthdate = e.target.value;
    
    if (!validateAge(birthdate)) {
      setError('You must be at least 18 years old');
    } else {
      setError('');
    }
    
    updateUserData({ birthdate });
  };

  // Calculate max date (18 years ago from today)
  const calculateMaxDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          color: 'primary.main',
          fontWeight: 600,
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          pb: 1,
          display: 'inline-block'
        }}
      >
        Birthdate
      </Typography>
      <TextField
        fullWidth
        type="date"
        label="Birth Date"
        value={userData.birthdate || ''}
        onChange={handleDateChange}
        variant="outlined"
        error={!!error}
        helperText={error}
        inputProps={{
          max: calculateMaxDate() // Restrict dates to 18+ years ago
        }}
        InputLabelProps={{
          shrink: true,
          style: { background: 'white', padding: '0 8px' }
        }}
        sx={{
          background: '#fff',
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
            }
          }
        }}
      />
      <Typography 
        variant="body2" 
        color={error ? "error" : "text.secondary"} 
        sx={{ mt: 1, fontSize: '0.875rem' }}
      >
        {error || 'You must be at least 18 years old to register'}
      </Typography>
    </Box>
  );
};