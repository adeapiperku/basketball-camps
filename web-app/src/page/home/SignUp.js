import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '520px' },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
}));

export default function SignUp() {
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState({});
  const [backendError, setBackendError] = React.useState('');

  const validate = (data) => {
    const e = {};
    if (!data.firstName) e.firstName = 'First name is required.';
    if (!data.lastName) e.lastName = 'Last name is required.';
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) e.email = 'Please enter a valid email.';
    if (!data.password || data.password.length < 5) e.password = 'Password must be at least 5 characters.';
    return e;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBackendError('');
    const data = new FormData(event.currentTarget);
    const payload = {
      firstName: data.get('firstName')?.trim(),
      lastName: data.get('lastName')?.trim(),
      email: data.get('email')?.trim(),
      password: data.get('password'),
      birthDate: data.get('birthDate'),
      phoneNumber: data.get('phoneNumber')?.trim(),
      type: 'Participant', // always create new users as Participant
    };

    const e = validate(payload);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    try {
      const response = await fetch('http://localhost:8080/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      navigate('/sign-in', { replace: true });
    } catch (error) {
      console.error(error);
      setBackendError(error.message);
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', textAlign: 'center', fontSize: 'clamp(2rem, 6vw, 2.15rem)' }}
            >
              Sign up
            </Typography>

            {backendError && (
              <Typography color="error" sx={{ textAlign: 'center' }}>
                {backendError}
              </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="firstName">First name</FormLabel>
                  <TextField id="firstName" name="firstName" autoComplete="given-name" error={!!errors.firstName} helperText={errors.firstName || ' '} required fullWidth />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="lastName">Last name</FormLabel>
                  <TextField id="lastName" name="lastName" autoComplete="family-name" error={!!errors.lastName} helperText={errors.lastName || ' '} required fullWidth />
                </FormControl>
              </Stack>

              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField id="email" type="email" name="email" placeholder="your@email.com" autoComplete="email" error={!!errors.email} helperText={errors.email || ' '} required fullWidth variant="outlined" />
              </FormControl>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <TextField name="password" type="password" id="password" autoComplete="new-password" error={!!errors.password} helperText={errors.password || ' '} required fullWidth />
                </FormControl>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="birthDate">Birth date</FormLabel>
                  <TextField id="birthDate" name="birthDate" type="date" InputLabelProps={{ shrink: true }} />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="phoneNumber">Phone number</FormLabel>
                  <TextField id="phoneNumber" name="phoneNumber" />
                </FormControl>
              </Stack>

              <Button type="submit" fullWidth variant="contained">
                Create account
              </Button>
            </Box>

            <Divider>or</Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <Link component={RouterLink} to="/sign-in" variant="body2" sx={{ alignSelf: 'center' }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Card>
        </Container>
      </SignUpContainer>
    </>
  );
}
