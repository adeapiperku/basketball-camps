import { useForm } from 'react-hook-form';
import { registerUser } from '../../service/requests/auth';
import { Box, Button, CssBaseline, Divider, FormControl, Link, TextField, Typography, Stack, Container, Card as MuiCard } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

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

export default function SignUp({ onRegisterComplete }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      birthDate: '',
      emergencyContactPhone: '',
      role: 'PARTICIPANT',
    },
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      reset();
      navigate('/login');
      if (onRegisterComplete) onRegisterComplete();
    } catch (error) {
      console.error('Error during registration:', error);
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
              sx={{
                width: '100%',
                textAlign: 'center',
                fontSize: 'clamp(2rem, 6vw, 2.15rem)',
                color: 'primary.main',
                fontWeight: 'bold',
              }}
            >
              Register
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 1.5,
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <TextField
                    placeholder="First name"
                    sx={compactTextField}
                    {...register('firstName', { required: 'First name is required' })}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message || ' '}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    placeholder="Last name"
                    sx={compactTextField}
                    {...register('lastName', { required: 'Last name is required' })}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message || ' '}
                  />
                </FormControl>
              </Stack>

              <FormControl fullWidth>
                <TextField
                  placeholder="your@email.com"
                  sx={compactTextField}
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/, message: 'Invalid email address' },
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
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 5, message: 'At least 5 characters' },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message || ' '}
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  label="Birth date"
                  sx={compactTextField}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('birthDate', {
                    required: 'Birth date is required',
                    validate: (value) => {
                      const today = new Date().toISOString().split('T')[0];
                      return value <= today || 'Birth date cannot be in the future';
                    },
                  })}
                  error={!!errors.birthDate}
                  helperText={errors.birthDate?.message || ' '}
                />
              </FormControl>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <TextField
                    placeholder="Phone number"
                    sx={compactTextField}
                    {...register('phoneNumber', { required: 'Phone number is required' })}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message || ' '}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    placeholder="Emergency Contact Phone"
                    sx={compactTextField}
                    {...register('emergencyContactPhone', {
                      required: 'Emergency phone is required',
                    })}
                    error={!!errors.emergencyContactPhone}
                    helperText={errors.emergencyContactPhone?.message || ' '}
                  />
                </FormControl>
              </Stack>

              <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>
                Register
              </Button>
            </Box>

            <Divider>or</Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" variant="body2" sx={{ alignSelf: 'center' }}>
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
