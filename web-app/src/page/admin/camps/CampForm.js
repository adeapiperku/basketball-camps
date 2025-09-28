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
import Switch from '@mui/material/Switch';
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
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
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
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
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
          <Grid item xs={12} sx={{ display: 'flex' }}>
            <TextField
              multiline
              minRows={3}
              value={formValues.description ?? ''}
              onChange={handleTextFieldChange}
              name="description"
              label="Description"
              error={!!formErrors.description}
              helperText={formErrors.description ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              type="date"
              value={formValues.startDate ?? ''}
              onChange={handleTextFieldChange}
              name="startDate"
              label="Start date"
              error={!!formErrors.startDate}
              helperText={formErrors.startDate ?? ' '}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              type="date"
              value={formValues.endDate ?? ''}
              onChange={handleTextFieldChange}
              name="endDate"
              label="End date"
              error={!!formErrors.endDate}
              helperText={formErrors.endDate ?? ' '}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              type="datetime-local"
              value={formValues.registrationDeadline ?? ''}
              onChange={handleTextFieldChange}
              name="registrationDeadline"
              label="Registration deadline"
              error={!!formErrors.registrationDeadline}
              helperText={formErrors.registrationDeadline ?? ' '}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.price ?? ''}
              onChange={handleNumberFieldChange}
              name="price"
              label="Price (€)"
              error={!!formErrors.price}
              helperText={formErrors.price ?? ' '}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.maxParticipants ?? ''}
              onChange={handleNumberFieldChange}
              name="maxParticipants"
              label="Max participants"
              error={!!formErrors.maxParticipants}
              helperText={formErrors.maxParticipants ?? ' '}
              fullWidth
              inputProps={{ min: 1, step: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.currentParticipants ?? 0}
              onChange={handleNumberFieldChange}
              name="currentParticipants"
              label="Current participants"
              error={!!formErrors.currentParticipants}
              helperText={formErrors.currentParticipants ?? ' '}
              fullWidth
              inputProps={{ min: 0, step: 1 }}
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
          {/* <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.coachId ?? ''}
              onChange={handleTextFieldChange}
              name="coachId"
              label="Coach ID"
              error={!!formErrors.coachId}
              helperText={formErrors.coachId ?? ' '}
              fullWidth
            />
          </Grid> */}
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
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      maxParticipants: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      currentParticipants: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      isActive: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
      // coachId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    values: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      description: PropTypes.string,
      location: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      registrationDeadline: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      maxParticipants: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      currentParticipants: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      isActive: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
      // coachId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};

export default CampForm;
