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
        if (!values.description) issues.push({ path: ['description'], message: 'Description is required' });
        if (!values.location) issues.push({ path: ['location'], message: 'Location is required' });
        if (!values.startDate) issues.push({ path: ['startDate'], message: 'Start date is required' });
        if (!values.endDate) issues.push({ path: ['endDate'], message: 'End date is required' });
        if (!values.registrationDeadline) issues.push({ path: ['registrationDeadline'], message: 'Registration deadline is required' });
        if (!values.price || Number(values.price) <= 0) issues.push({ path: ['price'], message: 'Price must be greater than 0' });
        if (!values.maxParticipants || Number(values.maxParticipants) <= 0) issues.push({ path: ['maxParticipants'], message: 'Max participants must be greater than 0' });
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
    if (!formValues.description) issues.push({ path: ['description'], message: 'Description is required' });
    if (!formValues.location) issues.push({ path: ['location'], message: 'Location is required' });
    if (!formValues.startDate) issues.push({ path: ['startDate'], message: 'Start date is required' });
    if (!formValues.endDate) issues.push({ path: ['endDate'], message: 'End date is required' });
    if (!formValues.registrationDeadline) issues.push({ path: ['registrationDeadline'], message: 'Registration deadline is required' });
    if (!formValues.price || Number(formValues.price) <= 0) issues.push({ path: ['price'], message: 'Price must be greater than 0' });
    if (!formValues.maxParticipants || Number(formValues.maxParticipants) <= 0) issues.push({ path: ['maxParticipants'], message: 'Max participants must be greater than 0' });
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message]))
      );
      return;
    }
    setFormErrors({});

    try {
      await onSubmit(formValues);
      notifications.show('Camp edited successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/camps');
    } catch (editError) {
      notifications.show(`Failed to edit camp. Reason: ${editError.message}`, {
        severity: 'error',
        autoHideDuration: 3000,
      });
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <CampForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Save"
      backButtonPath={`/camps/${campId}`}
    />
  );
}

CampEditForm.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxParticipants: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    currentParticipants: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    location: PropTypes.string,
    // coachId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isActive: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    registrationDeadline: PropTypes.string,
  }).isRequired,
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
      const showData = await service.findById(Number(campId));

      const toDateString = (value) => {
        if (!value) return '';
        if (Array.isArray(value) && value.length >= 3) {
          const [y, m, d] = value;
          const mm = String(m).padStart(2, '0');
          const dd = String(d).padStart(2, '0');
          return `${y}-${mm}-${dd}`;
        }
        if (typeof value === 'string') return value.substring(0, 10);
        return String(value).substring(0, 10);
      };
      const toDateTimeLocal = (value) => {
        if (!value) return '';
        if (typeof value === 'string') return value.substring(0, 16);
        if (Array.isArray(value) && value.length >= 5) {
          const [y, m, d, hh, mm] = value;
          const M = String(m).padStart(2, '0');
          const D = String(d).padStart(2, '0');
          const H = String(hh ?? 0).padStart(2, '0');
          const Min = String(mm ?? 0).padStart(2, '0');
          return `${y}-${M}-${D}T${H}:${Min}`;
        }
        return '';
      };

      const mapped = {
        id: showData.id,
        name: showData.name ?? '',
        description: showData.description ?? '',
        startDate: toDateString(showData.startDate),
        endDate: toDateString(showData.endDate),
        price: showData.price ?? '',
        maxParticipants: showData.maxParticipants ?? '',
        currentParticipants: showData.currentParticipants ?? 0,
        location: showData.location ?? '',
        // coachId: showData.coach?.id ?? '',
        isActive: Boolean(showData.isActive),
        registrationDeadline: toDateTimeLocal(showData.registrationDeadline),
      };
      setCamp(mapped);
    } catch (showDataError) {
      setError(showDataError);
    }
    setIsLoading(false);
  }, [campId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = React.useCallback(async (formValues) => {
      const service = new CampService();
      const payload = {
        id: Number(campId),
        name: formValues.name,
        description: formValues.description,
        startDate: formValues.startDate,
        endDate: formValues.endDate,
        price: Number(formValues.price),
        maxParticipants: Number(formValues.maxParticipants),
        currentParticipants: Number(formValues.currentParticipants ?? 0),
        location: formValues.location,
        // coach: formValues.coachId ? { id: Number(formValues.coachId) } : null,
        isActive: Boolean(formValues.isActive),
        registrationDeadline: formValues.registrationDeadline,
      };
      await service.update(payload);
      setCamp({ ...formValues, id: Number(campId) });
    },
    [campId],
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

    return camp ? (
      <CampEditForm initialValues={camp} onSubmit={handleSubmit} />
    ) : null;
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
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}
