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
        value={userData.aboutMe}
        onChange={(e) => updateUserData({ aboutMe: e.target.value })}
        sx={{ mt: 1 }}
      />
    </Box>
  );
};

export const AddressComponent = () => {
  const { userData, updateUserData } = useOnboarding();
  const { address } = userData;

  const handleAddressChange = (field, value) => {
    updateUserData({
      address: {
        ...address,
        [field]: value
      }
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Address</Typography>
      <TextField
        fullWidth
        label="Street Address"
        value={address.street}
        onChange={(e) => handleAddressChange('street', e.target.value)}
        sx={{ mt: 1 }}
      />
      <TextField
        fullWidth
        label="City"
        value={address.city}
        onChange={(e) => handleAddressChange('city', e.target.value)}
        sx={{ mt: 1 }}
      />
      <TextField
        fullWidth
        label="State"
        value={address.state}
        onChange={(e) => handleAddressChange('state', e.target.value)}
        sx={{ mt: 1 }}
      />
      <TextField
        fullWidth
        label="ZIP Code"
        value={address.zip}
        onChange={(e) => handleAddressChange('zip', e.target.value)}
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