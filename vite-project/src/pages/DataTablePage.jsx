import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    total_items: 0,
    total_pages: 0,
    current_page: 1,
    per_page: 10,
    has_next: false,
    has_prev: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Adding +1 to page because MUI uses 0-based indexing while the API uses 1-based
        const response = await api.get('/api/users', {
          params: {
            page: page + 1,
            per_page: rowsPerPage
          }
        });
        
        setUserData(response.data.users);
        setPagination(response.data.pagination);
        console.log('Fetched users with pagination:', response.data.pagination);
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
  }, [page, rowsPerPage]);

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
      
      <TablePagination
        component="div"
        count={pagination.total_items}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0); // Reset to first page when changing rows per page
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
};

export default DataTablePage;