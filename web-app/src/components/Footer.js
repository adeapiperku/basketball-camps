import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: '#212121',
        textAlign: 'center',
        color: 'white',
      }}
    >
      <Typography variant="body1">
        &copy; {new Date().getFullYear()} Basketball Camps. All rights reserved.
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Link sx={{ mx: 1, color: 'white' }}>
          About
        </Link>
        <Link sx={{ mx: 1, color: 'white' }}>
          Contact
        </Link>
        <Link sx={{ mx: 1, color: 'white' }}>
          Privacy Policy
        </Link>
      </Box>
    </Box>
  );
}
