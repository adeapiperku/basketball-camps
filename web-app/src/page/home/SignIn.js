import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginUser } from '../../service/requests/auth';
import {
  Box,
  Button,
  CssBaseline,
  Divider,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  Container,
  Card as MuiCard,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  maxWidth: '450px',
  padding: theme.spacing(4),
  gap: theme.spacing(2.5),
  margin: 'auto',
  borderRadius: '12px',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  justifyContent: 'center',
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
}));

const compactTextField = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: "0.9rem",
    height: "42px",
    backgroundColor: "#fafafa",
    "& input": { padding: "12px" },
    "&:hover fieldset": { borderColor: "#1976d2" },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
      boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.15)",
    },
  },
};

export default function SignIn() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setErrorMessage('');
    try {
      const response = await loginUser(data);
      const token = response.token;

      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(atob(base64));
        const role = decodedPayload.role;

        localStorage.setItem('authToken', token);
        if (role === 'COACH') navigate('/');
        else if (role === 'PARTICIPANT') navigate('/');
        else if (role === 'ADMIN') navigate('/admin/');
        else navigate('/unauthorized');
      } else {
        console.log('No token found in response');
      }
    } catch (error) {
      setErrorMessage('User not found or invalid credentials');
      console.error(error);
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="center">
        <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'center' }}>
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{
                width: '100%',
                textAlign: 'center',
                fontSize: 'clamp(2rem, 6vw, 2.15rem)',
                color: 'primary.main',
                fontWeight: 'bold',
              }}
            >
              Sign In
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
              <FormControl fullWidth>
                <TextField
                  placeholder="your@email.com"
                  sx={compactTextField}
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/, message: 'Invalid email' },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message || ' '}
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  placeholder="Password"
                  sx={compactTextField}
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  error={!!errors.password}
                  helperText={errors.password?.message || ' '}
                />
              </FormControl>

              {errorMessage && (
                <Typography
                  color="error"
                  sx={{ fontSize: '0.85rem', textAlign: 'center', minHeight: '1.2em'}}
                >
                  {errorMessage}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  height: '45px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  backgroundColor: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
              >
                Sign In
              </Button>
            </Box>

            <Divider sx={{ my: 2 }}>or</Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography sx={{ textAlign: 'center' }}>
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" variant="body2" sx={{ alignSelf: 'center' }}>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Card>
        </Container>
      </SignInContainer>
    </>
  );
}
