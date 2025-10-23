import { useState } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardActions, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCamps } from '../../hooks/useCamps';
import { styles, sectionStyles, titleStyles, cardStyles, cardContentStyles, cardTitleStyles, cardActionsStyles, buttonStyles } from './Home.styles';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export default function Home() {
  const { camps, loading, error } = useCamps();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

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
                    filter: 'none',
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
                      {formatDate(camp.startDate)} - {formatDate(camp.endDate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      For more information register and see the agenda.
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      Location: {camp.location}
                    </Typography>
                    <Typography variant="subtitle2">Price: {camp.price}</Typography>
                  </CardContent>

                  <CardActions sx={cardActionsStyles}>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      onClick={() => handleViewDetails(camp.id)}
                      sx={{ ...buttonStyles, mr: 1 }}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleRegisterClick(camp.id)}
                      disabled={camp.registeredParticipants >= camp.maxParticipants}
                      sx={buttonStyles}
                    >
                      {camp.registeredParticipants >= camp.maxParticipants ? 'FULL' : 'REGISTER'}
                    </Button>
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
