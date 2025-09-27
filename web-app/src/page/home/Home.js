import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 6, md: 10 },
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Basketball Camps
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="primary"
          component={RouterLink}
          to="/admins"
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
}
