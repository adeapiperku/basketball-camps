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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import useCamps from '../../../hooks/useCamps';

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
  const {camps} = useCamps();

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

  const handleDateFieldChange = React.useCallback(
    (event) => {
      const { name, value } = event.target;
      // HTML date input provides yyyy-MM-dd; convert to ISO string for consistency
      if (value) {
        try {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            onFieldChange(name, null);
          } else {
            const iso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
            onFieldChange(name, iso);
          }
        } catch (error) {
          console.error('Error parsing date:', error);
          onFieldChange(name, null);
        }
      } else {
        onFieldChange(name, null);
      }
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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="password"
              value={formValues.password ?? ''}
              onChange={handleTextFieldChange}
              name="password"
              label={formValues.id ? 'New Password (leave blank to keep current)' : 'Password'}
              error={!!formErrors.password}
              helperText={formErrors.password || (formValues.id ? ' ' : '')}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="date"
              name="birthDate"
              label="Birth date"
              value={formValues.birthDate ? new Date(formValues.birthDate).toISOString().slice(0, 10) : ''}
              onChange={handleDateFieldChange}
              error={!!formErrors.birthDate}
              helperText={formErrors.birthDate ?? ' '}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.type ?? ''}
              disabled
              name="type"
              label="Type"
              error={!!formErrors.type}
              helperText={formErrors.type ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl fullWidth>
              <InputLabel id="camp-select-label">Assigned Camps</InputLabel>
              <Select
                labelId="camp-select-label"
                multiple
                value={formValues.campIds ?? []}
                onChange={(event) => onFieldChange('campIds', event.target.value)}
                renderValue={(selected) =>
                  camps
                    .filter((camp) => selected.includes(camp.id))
                    .map((c) => c.name)
                    .join(', ')
                }
              >
                {camps.map((camp) => (
                  <MenuItem key={camp.id} value={camp.id}>
                    <Checkbox checked={formValues.campIds?.includes(camp.id)} />
                    <ListItemText primary={camp.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
