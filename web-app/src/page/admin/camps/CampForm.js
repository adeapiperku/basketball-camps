import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

function CampForm(props) {
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

  const handleNumberFieldChange = React.useCallback(
    (event) => {
      const { name, value } = event.target;
      onFieldChange(name, value);
    },
    [onFieldChange],
  );

  const handleCheckboxChange = React.useCallback(
    (event, checked) => {
      onFieldChange(event.target.name, checked);
    },
    [onFieldChange],
  );

  const handleDateFieldChange = React.useCallback(
    (event) => {
      const { name, value } = event.target;
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
    navigate(backButtonPath ?? '/camps');
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
              value={formValues.name ?? ''}
              onChange={handleTextFieldChange}
              name="name"
              label="Name"
              error={!!formErrors.name}
              helperText={formErrors.name ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.description ?? ''}
              onChange={handleTextFieldChange}
              name="description"
              label="Description"
              error={!!formErrors.description}
              helperText={formErrors.description ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.location ?? ''}
              onChange={handleTextFieldChange}
              name="location"
              label="Location"
              error={!!formErrors.location}
              helperText={formErrors.location ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="date"
              name="startDate"
              label="Start date"
              value={formValues.startDate ? new Date(formValues.startDate).toISOString().slice(0, 10) : ''}
              onChange={handleDateFieldChange}
              error={!!formErrors.startDate}
              helperText={formErrors.startDate ?? ' '}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="date"
              name="endDate"
              label="End date"
              value={formValues.endDate ? new Date(formValues.endDate).toISOString().slice(0, 10) : ''}
              onChange={handleDateFieldChange}
              error={!!formErrors.endDate}
              helperText={formErrors.endDate ?? ' '}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="date"
              name="registrationDeadline"
              label="Registration deadline date"
              value={formValues.registrationDeadline ? new Date(formValues.registrationDeadline).toISOString().slice(0, 10) : ''}
              onChange={handleDateFieldChange}
              error={!!formErrors.registrationDeadline}
              helperText={formErrors.registrationDeadline ?? ' '}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.price ?? ''}
              onChange={handleTextFieldChange}
              name="price"
              label="Price"
              error={!!formErrors.price}
              helperText={formErrors.price ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.maxParticipants ?? ''}
              onChange={handleNumberFieldChange}
              name="maxParticipants"
              label="Max Participants"
              error={!!formErrors.maxParticipants}
              helperText={formErrors.maxParticipants ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.currentParticipants ?? ''}
              onChange={handleNumberFieldChange}
              name="currentParticipants"
              label="Current Participants"
              error={!!formErrors.currentParticipants}
              helperText={formErrors.currentParticipants ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(formValues.isActive)}
                  onChange={handleCheckboxChange}
                  name="isActive"
                />
              }
              label="Active"
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

CampForm.propTypes = {
  backButtonPath: PropTypes.string,
  formState: PropTypes.shape({
    errors: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      location: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      registrationDeadline: PropTypes.string,
      price: PropTypes.string,
      maxParticipants: PropTypes.string,
      currentParticipants: PropTypes.string,
      isActive: PropTypes.string,
        }).isRequired,
    values: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      description: PropTypes.string,
      location: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      registrationDeadline: PropTypes.string,
      price: PropTypes.string,
      maxParticipants: PropTypes.number,
      currentParticipants: PropTypes.number,
      isActive: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};

export default CampForm;
