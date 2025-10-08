import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../service/requests/auth';
import { Box, Button, CssBaseline, Divider, FormControl, Link, TextField, Typography, Stack, Container, Card as MuiCard } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

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

const SignUp = ({ onRegisterComplete }) => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      birthDate: '',
      emergencyContactPhone: '',
      role: 'PARTICIPANT',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First nameee is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
      phoneNumber: Yup.string().required('Phone number is required'),
      birthDate: Yup.string()
        .required('Birth date is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
        .test('valid-date', 'Birth date cannot be in the future', (value) => {
          if (!value) return false;
          const today = new Date().toISOString().split('T')[0];
          return value <= today;
        }),
      emergencyContactPhone: Yup.string().required('Emergency phone is required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await registerUser(values);
        console.log('Registration successful:', response);
        resetForm();
        onRegisterComplete();
      } catch (error) {
        console.error('Error during registration:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

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
              onSubmit={formik.handleSubmit}
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
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName ? formik.errors.firstName : ' '}
                    required
                    fullWidth
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    placeholder="Last name"
                    sx={compactTextField}
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName ? formik.errors.lastName : ' '}
                    required
                    fullWidth
                  />
                </FormControl>
              </Stack>

              <FormControl fullWidth>
                <TextField
                  sx={compactTextField}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email ? formik.errors.email : ' '}
                  required
                  fullWidth
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  placeholder="Password"
                  sx={compactTextField}
                  name="password"
                  type="password"
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password ? formik.errors.password : ' '}
                  required
                  fullWidth
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  label="Birth date"
                  sx={compactTextField}
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formik.values.birthDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
                  helperText={formik.touched.birthDate && formik.errors.birthDate ? formik.errors.birthDate : ' '}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <TextField
                    placeholder="Phone number"
                    sx={compactTextField}
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber ? formik.errors.phoneNumber : ' '}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    placeholder="Emergency Contact Phone"
                    sx={compactTextField}
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    value={formik.values.emergencyContactPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    error={formik.touched.emergencyContactPhone && Boolean(formik.errors.emergencyContactPhone)}
                    helperText={formik.touched.emergencyContactPhone && formik.errors.emergencyContactPhone ? formik.errors.emergencyContactPhone : ' '}

                  />
                </FormControl>
              </Stack>

              <Button type="submit" fullWidth variant="contained" disabled={formik.isSubmitting}>
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
};

export default SignUp;
