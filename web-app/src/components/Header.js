import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const orange = '#FF6F00';

export default function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: orange }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Basketball Camps
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/sign-in">
            Sign In
          </Button>
          <Button color="inherit" component={RouterLink} to="/sign-up">
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
