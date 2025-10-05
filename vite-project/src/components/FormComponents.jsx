import { TextField, Box, Typography } from '@mui/material';
import { useOnboarding } from '../context/OnboardingContext';

export const AboutMeComponent = () => {
  const { userData, updateUserData } = useOnboarding();

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">About Me</Typography>
      <TextField
        multiline
        rows={4}
        fullWidth
        label="Tell us about yourself"
        value={userData.about_me || ''}
        onChange={(e) => updateUserData({ about_me: e.target.value })}
        sx={{ mt: 1 }}
      />
    </Box>
  );
};

export const AddressComponent = () => {
  const { userData, updateUserData } = useOnboarding();

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Address</Typography>
      <TextField
        fullWidth
        label="Street Address"
        value={userData.street_address || ''}
        onChange={(e) => updateUserData({ street_address: e.target.value })}
        sx={{ mt: 1 }}
      />
      <TextField
        fullWidth
        label="City"
        value={userData.city || ''}
        onChange={(e) => updateUserData({ city: e.target.value })}
        sx={{ mt: 1 }}
      />
      <TextField
        fullWidth
        label="State"
        value={userData.state || ''}
        onChange={(e) => updateUserData({ state: e.target.value })}
        sx={{ mt: 1 }}
      />
      <TextField
        fullWidth
        label="ZIP Code"
        value={userData.zip_code || ''}
        onChange={(e) => updateUserData({ zip_code: e.target.value })}
        sx={{ mt: 1 }}
      />
    </Box>
  );
};

export const BirthdateComponent = () => {
  const { userData, updateUserData } = useOnboarding();

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Birthdate</Typography>
      <TextField
        fullWidth
        type="date"
        value={userData.birthdate}
        onChange={(e) => updateUserData({ birthdate: e.target.value })}
        sx={{ mt: 1 }}
      />
    </Box>
  );
};