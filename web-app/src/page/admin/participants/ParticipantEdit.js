import * as React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import useNotifications from '../../../hooks/useNotifications/useNotifications';
import { ParticipantService } from '../../../service/ParticipantService';
import ParticipantForm from './ParticipantForm';
import PageContainer from '../../../components/PageContainer';

function ParticipantEditForm({ initialValues, onSubmit }) {
  const { participantId } = useParams();
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState(() => ({
    values: initialValues,
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback((newFormValues) => {
    setFormState((previousState) => ({
      ...previousState,
      values: newFormValues,
    }));
  }, []);

  const setFormErrors = React.useCallback((newFormErrors) => {
    setFormState((previousState) => ({
      ...previousState,
      errors: newFormErrors,
    }));
  }, []);

  const handleFormFieldChange = React.useCallback(
    (name, value) => {
      const validateField = async (values) => {
        const issues = [];
        if (!values.firstName) issues.push({ path: ['firstName'], message: 'First name is required' });
        if (!values.lastName) issues.push({ path: ['lastName'], message: 'Last name is required' });
        if (!values.email) issues.push({ path: ['email'], message: 'Email is required' });
        if (!values.password) issues.push({ path: ['password'], message: 'Password is required' });
        if (!values.birthDate) issues.push({ path: ['birthDate'], message: 'Birth date is required' });
        if (!values.phoneNumber) issues.push({ path: ['phoneNumber'], message: 'Phone number is required' });
        if (!values.type) issues.push({ path: ['type'], message: 'Type is required' });
        setFormErrors({
          ...formErrors,
          [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
        });
      };

      const newFormValues = { ...formValues, [name]: value };

      setFormValues(newFormValues);
      validateField(newFormValues);
    },
    [formValues, formErrors, setFormErrors, setFormValues],
  );

  const handleFormReset = React.useCallback(() => {
    setFormValues(initialValues);
  }, [initialValues, setFormValues]);

  const handleFormSubmit = React.useCallback(async () => {
    const issues = [];
    if (!formValues.firstName) issues.push({ path: ['firstName'], message: 'First name is required' });
    if (!formValues.lastName) issues.push({ path: ['lastName'], message: 'Last name is required' });
    if (!formValues.email) issues.push({ path: ['email'], message: 'Email is required' });
    if (!formValues.password) issues.push({ path: ['password'], message: 'Password is required' });
    if (!formValues.birthDate) issues.push({ path: ['birthDate'], message: 'Birth date is required' });
    if (!formValues.phoneNumber) issues.push({ path: ['phoneNumber'], message: 'Phone number is required' });
    if (!formValues.type) issues.push({ path: ['type'], message: 'Type is required' });
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      await onSubmit(formValues);
      notifications.show('Participant edited successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/admin/participants');
    } catch (editError) {
      notifications.show(`Failed to edit participant. Reason: ${editError.message}`, {
        severity: 'error',
        autoHideDuration: 3000,
      });
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <ParticipantForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Save"
      backButtonPath={`/admin/participants/${participantId}`}
    />
  );
}

ParticipantEditForm.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    phoneNumber: PropTypes.string,
    emergencyContactPhone: PropTypes.string,
    schoolId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    birthDate: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default function ParticipantEdit() {
  const { participantId } = useParams();

  const [participant, setParticipant] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const service = new ParticipantService();
      const showData = await service.findById(Number(participantId));
      let birthDate = '';
      if (showData?.birthDate != null) {
        if (Array.isArray(showData.birthDate) && showData.birthDate.length >= 3) {
          const [y, m, d] = showData.birthDate;
          const mm = String(m).padStart(2, '0');
          const dd = String(d).padStart(2, '0');
          birthDate = `${y}-${mm}-${dd}`;
        } else if (typeof showData.birthDate === 'string') {
          birthDate = showData.birthDate.substring(0, 10);
        } else {
          birthDate = String(showData.birthDate).substring(0, 10);
        }
      }
      const mapped = {
        id: showData.id,
        firstName: showData.firstName ?? '',
        lastName: showData.lastName ?? '',
        email: showData.email ?? '',
        password: showData.password ?? '',
        phoneNumber: showData.phoneNumber ?? '',
        emergencyContactPhone: showData.emergencyContactPhone ?? '',
        schoolId: showData.school?.id ?? '',
        birthDate,
        type: showData.type ?? '',
      };
      setParticipant(mapped);
    } catch (showDataError) {
      setError(showDataError);
    }
    setIsLoading(false);
  }, [participantId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = React.useCallback(async (formValues) => {
      const service = new ParticipantService();
      const payload = {
        id: Number(participantId),
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        password: formValues.password,
        birthDate: formValues.birthDate || null,
        phoneNumber: formValues.phoneNumber || null,
        emergencyContactPhone: formValues.emergencyContactPhone || null,
        school: formValues.schoolId ? { id: Number(formValues.schoolId) } : null,
        type: formValues.type || '',
      };
      const updatedData = await service.update(payload);
      setParticipant({ ...formValues, id: Number(participantId) });
    },
    [participantId],
  );

  const renderEdit = React.useMemo(() => {
    if (isLoading) {
      return (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            m: 1,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity="error">{error.message}</Alert>
        </Box>
      );
    }

    return participant ? (
      <ParticipantEditForm initialValues={participant} onSubmit={handleSubmit} />
    ) : null;
  }, [isLoading, error, participant, handleSubmit]);

  return (
    <PageContainer
      title={`Edit Participant ${participantId}`}
      breadcrumbs={[
        { title: 'Participants', path: '/participants' },
        { title: `Participant ${participantId}`, path: `/participants/${participantId}` },
        { title: 'Edit' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}
