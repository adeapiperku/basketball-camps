import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';

function CoachForm(props) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
    backButtonPath,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isEdit = Boolean(formValues?.id);

  const handleSubmit = React.useCallback(
    async (event) => {
      event.preventDefault();

      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit],
  );

  const handleTextFieldChange = React.useCallback(
    (event) => {
      onFieldChange(event.target.name, event.target.value);
    },
    [onFieldChange],
  );

  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? '/coaches');
  }, [navigate, backButtonPath]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{ width: '100%' }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.firstName ?? ''}
              onChange={handleTextFieldChange}
              name="firstName"
              label="First name"
              error={!!formErrors.firstName}
              helperText={formErrors.firstName ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.lastName ?? ''}
              onChange={handleTextFieldChange}
              name="lastName"
              label="Last name"
              error={!!formErrors.lastName}
              helperText={formErrors.lastName ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              type="date"
              value={formValues.birthDate ?? ''}
              onChange={handleTextFieldChange}
              name="birthDate"
              label="Birth date"
              error={!!formErrors.birthDate}
              helperText={formErrors.birthDate ?? ' '}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.email ?? ''}
              onChange={handleTextFieldChange}
              name="email"
              label="Email"
              error={!!formErrors.email}
              helperText={formErrors.email ?? ' '}
              fullWidth
            />
          </Grid>
          {!isEdit && (
            <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
              <TextField
                type="password"
                value={formValues.password ?? ''}
                onChange={handleTextFieldChange}
                name="password"
                label="Password"
                error={!!formErrors.password}
                helperText={formErrors.password ?? ' '}
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.phoneNumber ?? ''}
              onChange={handleTextFieldChange}
              name="phoneNumber"
              label="Phone number"
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.type ?? ''}
              onChange={handleTextFieldChange}
              name="type"
              label="Type"
              placeholder="e.g., Coach"
              error={!!formErrors.type}
              helperText={formErrors.type ?? ' '}
              fullWidth
            />
          </Grid>
        </Grid>
      </FormGroup>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}

CoachForm.propTypes = {
  backButtonPath: PropTypes.string,
  formState: PropTypes.shape({
    errors: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      password: PropTypes.string,
      birthDate: PropTypes.string,
      phoneNumber: PropTypes.string,
      type: PropTypes.string,
    }).isRequired,
    values: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      password: PropTypes.string,
      birthDate: PropTypes.string,
      phoneNumber: PropTypes.string,
      type: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};

export default CoachForm;
