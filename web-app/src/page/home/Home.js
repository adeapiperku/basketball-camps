import { Container, Box, Typography, Button, Grid, Card, CardContent, CardActions, CardMedia, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
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

      <Container
        maxWidth={false}
        sx={sectionStyles}
        disableGutters
      >
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
            {camps.map((camp) => (
              <Grid item key={camp.id} xs={12} sm={6} md={4}>
                <Card sx={cardStyles}>
                  {/* <CardMedia
                    component="img"
                    height="180"
                    image={camp.image || '/basketball-placeholder.jpg'}
                    alt={camp.name}
                    sx={{ objectFit: 'cover' }}
                  /> */}
                  <CardContent sx={cardContentStyles}>
                    <Typography variant="h6" sx={cardTitleStyles}>
                      {camp.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                      {formatDate(camp.startDate)} - {formatDate(camp.endDate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {camp.description}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      Location: {camp.location}
                    </Typography>
                    <Typography variant="subtitle2">Price: {camp.price}</Typography>
                  </CardContent>
                  <CardActions sx={cardActionsStyles}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      component={RouterLink}
                      to={`/camps/${camp.id}`}
                      sx={buttonStyles}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Footer />
    </>
  );
}
