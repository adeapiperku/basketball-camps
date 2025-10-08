import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const orange = '#FF6F00';

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/home");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: orange }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{fontWeight: 'bold', color: 'inherit', textDecoration: 'none'}}
        >
          Basketball Camps
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>

          {!isLoggedIn ? (
            <Button color="inherit" component={RouterLink} to="/login">
              Sign In
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Log out
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
