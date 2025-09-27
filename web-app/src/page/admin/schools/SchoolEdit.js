import * as React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import useNotifications from '../../../hooks/useNotifications/useNotifications';
import { SchoolService } from '../../../service/SchoolService';
import SchoolForm from './SchoolForm';
import PageContainer from '../../../components/PageContainer';

function SchoolEditForm({ initialValues, onSubmit }) {
  const { schoolId } = useParams();
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
        if (!values.name) issues.push({ path: ['name'], message: 'Name is required' });
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
    if (!formValues.name) issues.push({ path: ['name'], message: 'Name is required' });
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      await onSubmit(formValues);
      notifications.show('School edited successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/schools');
    } catch (editError) {
      notifications.show(`Failed to edit school. Reason: ${editError.message}`, {
        severity: 'error',
        autoHideDuration: 3000,
      });
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <SchoolForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Save"
      backButtonPath={`/schools/${schoolId}`}
    />
  );
}

SchoolEditForm.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    birthDate: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default function SchoolEdit() {
  const { schoolId } = useParams();

  const [school, setSchool] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const service = new SchoolService();
      const showData = await service.findById(Number(schoolId));
      setSchool(showData);
    } catch (showDataError) {
      setError(showDataError);
    }
    setIsLoading(false);
  }, [schoolId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = React.useCallback(async (formValues) => {
      const service = new SchoolService();
      const dataToUpdate = {
        ...formValues,
        id: Number(schoolId),
      };
      const updatedData = await service.update(dataToUpdate);
      setSchool(updatedData);
    },
    [schoolId],
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

    return school ? (
      <SchoolEditForm initialValues={school} onSubmit={handleSubmit} />
    ) : null;
  }, [isLoading, error, school, handleSubmit]);

  return (
    <PageContainer
      title={`Edit School ${schoolId}`}
      breadcrumbs={[
        { title: 'Schools', path: '/schools' },
        { title: `School ${schoolId}`, path: `/schools/${schoolId}` },
        { title: 'Edit' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}
