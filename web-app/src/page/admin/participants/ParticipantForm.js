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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { SchoolService } from '../../../service/SchoolService';

function ParticipantForm(props) {
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
  const [schools, setSchools] = React.useState([]);

  const isEdit = Boolean(formValues?.id);

  React.useEffect(() => {
    const loadSchools = async () => {
      try {
        const service = new SchoolService();
        const list = await service.findAll();
        setSchools(Array.isArray(list) ? list : list?.items ?? []);
      } catch (e) {
        // silently ignore for now; school select will be empty
        setSchools([]);
      }
    };
    loadSchools();
  }, []);

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

  const handleSelectChange = React.useCallback(
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
    navigate(backButtonPath ?? '/participants');
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
              placeholder="e.g., Participant"
              error={!!formErrors.type}
              helperText={formErrors.type ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.emergencyContactPhone ?? ''}
              onChange={handleTextFieldChange}
              name="emergencyContactPhone"
              label="Emergency contact phone"
              error={!!formErrors.emergencyContactPhone}
              helperText={formErrors.emergencyContactPhone ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <FormControl fullWidth>
              <InputLabel id="jersey-size-label">Jersey size</InputLabel>
              <Select
                labelId="jersey-size-label"
                value={formValues.jerseySize ?? ''}
                onChange={handleSelectChange}
                name="jerseySize"
                label="Jersey size"
                error={!!formErrors.jerseySize}
              >
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color={formErrors.jerseySize ? 'error' : 'text.secondary'}>
                {formErrors.jerseySize ?? ' '}
              </Typography>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex' }}>
            <FormControl fullWidth>
              <InputLabel id="school-label">School</InputLabel>
              <Select
                labelId="school-label"
                value={formValues.schoolId ?? ''}
                onChange={handleSelectChange}
                name="schoolId"
                label="School"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {schools.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.medicalNotes ?? ''}
              onChange={handleTextFieldChange}
              name="medicalNotes"
              label="Medical notes"
              error={!!formErrors.medicalNotes}
              helperText={formErrors.medicalNotes ?? ' '}
              fullWidth
              multiline
              minRows={3}
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

ParticipantForm.propTypes = {
  backButtonPath: PropTypes.string,
  formState: PropTypes.shape({
    errors: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      password: PropTypes.string,
      birthDate: PropTypes.string,
      phoneNumber: PropTypes.string,
      emergencyContactPhone: PropTypes.string,
      jerseySize: PropTypes.string,
      medicalNotes: PropTypes.string,
      schoolId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
      emergencyContactPhone: PropTypes.string,
      jerseySize: PropTypes.string,
      medicalNotes: PropTypes.string,
      schoolId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
};

export default ParticipantForm;
