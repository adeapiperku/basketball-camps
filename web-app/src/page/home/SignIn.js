import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginUser } from '../../service/requests/auth';
import {
  Box,
  Button,
  CssBaseline,
  Divider,
  FormControl,
  TextField,
  Typography,
  Stack,
  Container,
  Link,
  Card as MuiCard,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  maxWidth: '450px',
  padding: theme.spacing(4),
  gap: theme.spacing(2.5),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '400px' },
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
    height: "40px",
    backgroundColor: "#fafafa",
    "& input": {
      padding: "10px 12px",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
      boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.15)",
    },
  },
};

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await loginUser(formData);
      const token = response.token;

      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(atob(base64));
        const role = decodedPayload.role;

        localStorage.setItem('authToken', token);

        if (role === 'ADMIN') {
          navigate('/admin');
        } else if (role === 'COACH' || role === 'PARTICIPANT') {
          navigate('/');
        } else {
          navigate('/unauthorized');
        }
      } else {
        setErrorMessage('Unexpected login error. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Invalid email or password.');
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
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
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 1.5,
              }}
            >
              <FormControl fullWidth>
                <TextField
                  placeholder="Email"
                  type="email"
                  name="email"
                  sx={compactTextField}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  placeholder="Password"
                  type="password"
                  name="password"
                  sx={compactTextField}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </FormControl>

              {errorMessage && (
                <Typography color="error" sx={{ textAlign: 'center', fontSize: '0.9rem' }}>
                  {errorMessage}
                </Typography>
              )}

              <Button type="submit" fullWidth variant="contained">
                Sign In
              </Button>
            </Box>

            <Divider>or</Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography sx={{ textAlign: 'center' }}>
                Don’t have an account?{' '}
                <Link component={RouterLink} to="/register" variant="body2" sx={{ alignSelf: 'center' }}>
                  Register
                </Link>
              </Typography>
            </Box>
          </Card>
        </Container>
      </SignInContainer>
    </>
  );
}
