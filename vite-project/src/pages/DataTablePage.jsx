import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import api from '../api';

const DataTablePage = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/users');
        // Sort users by email for consistency
        const sortedUsers = response.data.sort((a, b) => a.email.localeCompare(b.email));
        setUserData(sortedUsers);
        console.log('Fetched users with progress:', sortedUsers.map(u => ({email: u.email, progress: u.progress})));
        setError('');
      } catch (error) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh user data every 10 seconds to show latest progress
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  }

  return (
    <Paper sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        User Data
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>About Me</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Birthdate</TableCell>
              <TableCell>Registration Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.about_me || '-'}</TableCell>
                <TableCell>
                  {user.street_address ? (
                    <>
                      {user.street_address}<br />
                      {user.city}, {user.state} {user.zip_code}
                    </>
                  ) : '-'}
                </TableCell>
                <TableCell>{user.birthdate || '-'}</TableCell>
                <TableCell>
                  {user.progress ? (
                    <Box 
                      sx={{ 
                        color: user.progress === 4 ? 'success.main' : 'info.main',
                        fontWeight: user.progress === 4 ? 'bold' : 'normal'
                      }}
                    >
                      Step {user.progress} of 4
                      {user.progress === 4 && ' (Completed)'}
                    </Box>
                  ) : 'Not started'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DataTablePage;