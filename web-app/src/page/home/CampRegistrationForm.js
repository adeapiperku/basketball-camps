import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, MenuItem, CircularProgress, Paper } from '@mui/material';
import { useSchools } from '../../hooks/useSchools';
import { jwtDecode } from 'jwt-decode';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const JERSEY_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function CampRegistrationForm() {
  const { campId } = useParams();
  const navigate = useNavigate();
  const { schools, loading: loadingSchools, error: schoolsError } = useSchools();

  const [selectedSchool, setSelectedSchool] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [jerseySize, setJerseySize] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser({
        id: decoded.userId,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
      });
    } catch (err) {
      console.error('Failed to decode token:', err);
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    const token = localStorage.getItem('authToken');
    if (!token || !user?.id) {
      setMessage('You must be logged in to register.');
      setSubmitting(false);
      navigate('/login');
      return;
    }

    const registrationData = {
      participantId: user.id,
      campId,
      schoolId: selectedSchool,
      specialRequests,
      jerseySize,
    };

    try {
      const response = await fetch('http://localhost:8080/registrations/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      setMessage('Registration successful.');
      setSelectedSchool('');
      setSpecialRequests('');
      setJerseySize('');
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography color="primary" variant="h4" textAlign="center" gutterBottom fontWeight="bold">
            Camp Registration
          </Typography>

          {user && (
            <Typography variant="subtitle1" gutterBottom>
              Participant: <strong>{user.firstName} {user.lastName}</strong>
            </Typography>
          )}

          {schoolsError && (
            <Typography color="error" sx={{ mb: 2 }}>
              Error loading schools: {schoolsError.message}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              select
              fullWidth
              required
              margin="normal"
              label="Select School"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
            >
              {loadingSchools ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : (
                schools.map((school) => (
                  <MenuItem key={school.id} value={school.id}>
                    {school.name}
                  </MenuItem>
                ))
              )}
            </TextField>

            <TextField
              select
              fullWidth
              required
              margin="normal"
              label="Jersey Size"
              value={jerseySize}
              onChange={(e) => setJerseySize(e.target.value)}
            >
              {JERSEY_SIZES.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Special Requests"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />

            <Box textAlign="center" mt={3}>
              <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                {submitting ? <CircularProgress size={24} /> : 'Register'}
              </Button>
            </Box>

            {message && (
              <Typography
                mt={2}
                textAlign="center"
                color={message.includes('successful') ? 'green' : 'red'}
              >
                {message}
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
}
