import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../../../hooks/useNotifications/useNotifications';
import { CoachService } from '../../../service/CoachService';
import CoachForm from './CoachForm';
import PageContainer from '../../../components/PageContainer';

const INITIAL_FORM_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  birthDate: '',
  password: '',
  type: 'Coach',
};

export default function CoachCreate() {
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
    setFormValues(INITIAL_FORM_VALUES);
  }, [setFormValues]);

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
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message]))
      );
      return;
    }
    setFormErrors({});

    try {
      const service = new CoachService();
      await service.create(formValues);
      notifications.show('Coach created successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/coaches');
    } catch (createError) {
      notifications.show(
        `Failed to create coach. Reason: ${createError.message}`,
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
      title="New Coach"
      breadcrumbs={[{ title: 'Coaches', path: '/coaches' }, { title: 'New' }]}
    >
      <CoachForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
