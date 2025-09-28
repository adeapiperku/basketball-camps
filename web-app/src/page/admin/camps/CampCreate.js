import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../../../hooks/useNotifications/useNotifications';
import { CampService } from '../../../service/CampService';
import CampForm from './CampForm';
import PageContainer from '../../../components/PageContainer';

const INITIAL_FORM_VALUES = {
  name: '',
  description: '',
  location: '',
  startDate: '', // yyyy-MM-dd
  endDate: '',   // yyyy-MM-dd
  registrationDeadline: '', // yyyy-MM-ddTHH:mm
  price: '',
  maxParticipants: '',
  currentParticipants: 0,
  // coachId: '',
  isActive: true,
};

export default function CampCreate() {
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState(() => ({
    values: INITIAL_FORM_VALUES,
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
    setFormValues(INITIAL_FORM_VALUES);
  }, [setFormValues]);

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
      const service = new CampService();
      const payload = {
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
      await service.create(payload);
      notifications.show('Camp created successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/camps');
    } catch (createError) {
      notifications.show(
        `Failed to create camp. Reason: ${createError.message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw createError;
    }
  }, [formValues, navigate, notifications, setFormErrors]);

  return (
    <PageContainer
      title="New Camp"
      breadcrumbs={[{ title: 'Camps', path: '/camps' }, { title: 'New' }]}
    >
      <CampForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
