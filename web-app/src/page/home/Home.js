import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardActions, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCamps } from '../../hooks/useCamps';
import { RegistrationService } from '../../service/RegistrationService';
import { styles, sectionStyles, titleStyles, cardStyles, cardContentStyles, cardTitleStyles, cardActionsStyles, buttonStyles } from './Home.styles';

const parseJwt = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
};

export default function Home() {
  const { camps, loading, error } = useCamps();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [userRegistrations, setUserRegistrations] = useState({});
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  useEffect(() => {
    const checkUserRegistrations = async () => {
      const token = localStorage.getItem('authToken');
      if (!token || !camps.length) return;

      const currentUser = parseJwt(token);
      if (!currentUser?.email) return;

      setLoadingRegistrations(true);
      const registrationService = new RegistrationService();
      const registrationsState = {};

      for (const camp of camps) {
        try {
          const registrations = await registrationService.findByCamp(camp.id);
          const isRegistered = registrations.some(
            (reg) => reg.participant?.email === currentUser.email
          );
          registrationsState[camp.id] = isRegistered;
        } catch (error) {
          console.error(`Error checking registrations for camp ${camp.id}:`, error);
          registrationsState[camp.id] = false;
        }
      }
      setUserRegistrations(registrationsState);
      setLoadingRegistrations(false);
    };

    checkUserRegistrations();
  }, [camps]);

  const handleRegisterClick = (campId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setOpenDialog(true);
    } else {
      navigate(`/camps/${campId}/register`);
    }
  };

  const handleViewDetails = (campId) => {
    navigate(`/camps/${campId}/details`);
  };

  return (
    <>
      <Header />

      <Box sx={styles}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
            Welcome to Basketball Camps
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Train with top coaches and improve your basketball skills!
          </Typography>
        </Container>
      </Box>

      <Container maxWidth={false} sx={sectionStyles} disableGutters>
        <Typography variant="h4" component="h2" gutterBottom sx={titleStyles}>
          Available Camps
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <Typography color="error">{error.message}</Typography>
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {camps
              .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
              .map((camp) => (
                <Grid item key={camp.id} xs={12} sm={6} md={4}>
                  <Card 
                    sx={{
                      ...cardStyles,
                      opacity: camp.isActive ? 1 : 0.85,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: camp.isActive ? 'translateY(-5px)' : 'none',
                        boxShadow: camp.isActive ? 6 : 'none'
                      }
                    }}
                  >
                    <CardContent sx={{ ...cardContentStyles }}>
                      <Typography variant="h6" sx={cardTitleStyles}>
                        {camp.name}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                        {new Date(camp.startDate).toLocaleDateString()} - {new Date(camp.endDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        For more information register and see the agenda.
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mt: 1 }}>
                        Location: {camp.location}
                      </Typography>
                      <Typography variant="subtitle2">Price: {camp.price}€</Typography>
                    </CardContent>

                    <CardActions sx={cardActionsStyles}>
                      {loadingRegistrations ? (
                        <CircularProgress size={24} />
                      ) : userRegistrations[camp.id] ? (
                        <>
                          <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={() => handleViewDetails(camp.id)}
                            sx={{ mr: 1 }}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="contained" 
                            color="success"
                            disabled
                          >
                            Registered
                          </Button>
                        </>
                      ) : !camp.isActive ? (
                        <Button 
                          variant="contained" 
                          color="secondary"
                          disabled
                        >
                          Not Active
                        </Button>
                      ) : (
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={() => handleRegisterClick(camp.id)}
                        >
                          Register
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography>You must log in to register for a camp.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenDialog(false);
              navigate('/login');
            }}
            variant="contained"
            color="primary"
          >
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
}
