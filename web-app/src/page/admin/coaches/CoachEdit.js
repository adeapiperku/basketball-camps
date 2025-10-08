import * as React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import useNotifications from '../../../hooks/useNotifications/useNotifications';
import { CoachService } from '../../../service/CoachService';
import CoachForm from './CoachForm';
import PageContainer from '../../../components/PageContainer';

function CoachEditForm({ initialValues, onSubmit }) {
  const { coachId } = useParams();
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
      if (issues && issues.length > 0) {
        setFormErrors(
          Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
        );
        return;
      }
    setFormErrors({});

    try {
      await onSubmit(formValues);
      notifications.show('Coach edited successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/admin/coaches');
    } catch (editError) {
      notifications.show(`Failed to edit coach. Reason: ${editError.message}`, {
        severity: 'error',
        autoHideDuration: 3000,
      });
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <CoachForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Save"
      backButtonPath={`/admin/coaches/${coachId}`}
    />
  );
}

CoachEditForm.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    phoneNumber: PropTypes.string,
    birthDate: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default function CoachEdit() {
  const { coachId } = useParams();

  const [coach, setCoach] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const service = new CoachService();
      const showData = await service.findById(Number(coachId));
      if (showData.birthDate) {
        showData.birthDate = new Date(showData.birthDate).toISOString().split('T')[0];
      }

      setCoach(showData);
    } catch (showDataError) {
      setError(showDataError);
    }
    setIsLoading(false);
  }, [coachId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = React.useCallback(
    async (formValues) => {
      const service = new CoachService();
      const dataToUpdate = {
        ...formValues,
        id: Number(coachId),
        birthDate: formValues.birthDate ? new Date(formValues.birthDate).toISOString() : null
      };
      const updatedData = await service.update(dataToUpdate);
      setCoach(updatedData);
    },
    [coachId],
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

    return coach ? (
      <CoachEditForm initialValues={coach} onSubmit={handleSubmit} />
    ) : null;
  }, [isLoading, error, coach, handleSubmit]);

  return (
    <PageContainer
      title={`Edit Coach ${coachId}`}
      breadcrumbs={[
        { title: 'Coaches', path: '/admin/coaches' },
        { title: `Coach ${coachId}`, path: `/admin/coaches/${coachId}` },
        { title: 'Edit' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}
