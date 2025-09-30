import * as React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import useNotifications from '../../../hooks/useNotifications/useNotifications';
import { CampService } from '../../../service/CampService';
import CampForm from './CampForm';
import PageContainer from '../../../components/PageContainer';

function CampEditForm({ initialValues, onSubmit }) {
  const { campId } = useParams();
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [formState, setFormState] = React.useState({
    values: initialValues,
    errors: {},
  });

  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback((newFormValues) => {
    setFormState((prev) => ({ ...prev, values: newFormValues }));
  }, []);

  const setFormErrors = React.useCallback((newFormErrors) => {
    setFormState((prev) => ({ ...prev, errors: newFormErrors }));
  }, []);

  const handleFieldChange = React.useCallback(
    (name, value) => {
      setFormValues({ ...formValues, [name]: value });
      setFormErrors({ ...formErrors, [name]: undefined });
    },
    [formValues, formErrors, setFormValues, setFormErrors]
  );

  const handleReset = React.useCallback(() => {
    setFormValues(initialValues);
  }, [initialValues, setFormValues]);

  const handleSubmit = React.useCallback(async () => {
    const issues = [];
    if (!formValues.name) issues.push({ path: ['name'], message: 'Name is required' });
    if (!formValues.startDate) issues.push({ path: ['startDate'], message: 'Start date is required' });
    if (!formValues.endDate) issues.push({ path: ['endDate'], message: 'End date is required' });

    if (issues.length > 0) {
      setFormErrors(Object.fromEntries(issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setFormErrors({});

    try {
      await onSubmit(formValues);
      notifications.show('Camp edited successfully.', { severity: 'success', autoHideDuration: 3000 });
      navigate('/camps');
    } catch (error) {
      notifications.show(`Failed to edit camp. Reason: ${error.message}`, { severity: 'error', autoHideDuration: 3000 });
      throw error;
    }
  }, [formValues, onSubmit, notifications, navigate, setFormErrors]);

  return (
    <CampForm
      formState={formState}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      onReset={handleReset}
      submitButtonLabel="Save"
      backButtonPath={`/camps/${campId}`}
    />
  );
}

CampEditForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default function CampEdit() {
  const { campId } = useParams();
  const [camp, setCamp] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const service = new CampService();
      const data = await service.findById(Number(campId));
      setCamp({
        ...data,
        startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
        endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline).toISOString().split('T')[0] : '',
      });
    } catch (err) {
      setError(err);
    }
    setIsLoading(false);
  }, [campId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = React.useCallback(
    async (formValues) => {
      const service = new CampService();
      const updatedData = {
        ...formValues,
        id: Number(campId),
        startDate: formValues.startDate ? new Date(formValues.startDate).toISOString() : null,
        endDate: formValues.endDate ? new Date(formValues.endDate).toISOString() : null,
        registrationDeadline: formValues.registrationDeadline ? new Date(formValues.registrationDeadline).toISOString() : null,
      };
      const updated = await service.update(updatedData);
      setCamp(updated);
    },
    [campId]
  );

  const renderContent = React.useMemo(() => {
    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error.message}</Alert>;
    return camp ? <CampEditForm initialValues={camp} onSubmit={handleSubmit} /> : null;
  }, [isLoading, error, camp, handleSubmit]);

  return (
    <PageContainer
      title={`Edit Camp ${campId}`}
      breadcrumbs={[
        { title: 'Camps', path: '/camps' },
        { title: `Camp ${campId}`, path: `/camps/${campId}` },
        { title: 'Edit' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{renderContent}</Box>
    </PageContainer>
  );
}
