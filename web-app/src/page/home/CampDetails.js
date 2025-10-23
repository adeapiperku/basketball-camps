import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Divider, 
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress
} from '@mui/material';
import { 
  LocationOn as LocationIcon, 
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCamp } from '../../hooks/useCamps';

export default function CampDetails() {
  const { campId } = useParams();
  const navigate = useNavigate();
  const { camp, loading, error } = useCamp(campId);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">Error loading camp details: {error.message}</Typography>
      </Container>
    );
  }

  if (!camp) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography>Camp not found</Typography>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
              {camp.name}
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
              <Chip 
                icon={<LocationIcon />} 
                label={camp.location} 
                variant="outlined" 
                color="primary"
              />
              <Chip 
                icon={<CalendarIcon />} 
                label={`${formatDate(camp.startDate)} - ${formatDate(camp.endDate)}`} 
                variant="outlined"
              />
              <Chip 
                icon={<PeopleIcon />} 
                label={`${camp.registeredParticipants || 0} / ${camp.maxParticipants} participants`} 
                variant="outlined"
                color={camp.registeredParticipants >= camp.maxParticipants ? 'error' : 'default'}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Box mb={4}>
                  <Typography variant="h5" gutterBottom fontWeight="bold">About This Camp</Typography>
                  <Typography variant="body1" paragraph>
                    {camp.description || 'No description available.'}
                  </Typography>
                </Box>

                <Box mb={4}>
                  <Typography variant="h5" gutterBottom fontWeight="bold">Camp Details</Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Age Group: </strong> All ages
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Skill Level: </strong> All levels
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Price:</strong> ${camp.price || 'Free'}
                  </Typography>
                </Box>

                {camp.coaches && camp.coaches.length > 0 && (
                  <Box mb={4}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">Coaches</Typography>
                    <Grid container spacing={2}>
                      {camp.coaches.map((coach) => (
                        <Grid item xs={12} sm={6} key={coach.id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box display="flex" alignItems="center" mb={1}>
                                <Avatar src={coach.imageUrl} sx={{ mr: 2 }} />
                                <div>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {coach.firstName} {coach.lastName}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {coach.specialization || 'Basketball Coach'}
                                  </Typography>
                                </div>
                              </Box>
                              <Typography variant="body2">
                                {coach.bio || 'No bio available.'}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
}
