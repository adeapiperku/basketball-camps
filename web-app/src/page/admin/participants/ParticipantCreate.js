import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../../../hooks/useNotifications/useNotifications';
import { ParticipantService } from '../../../service/ParticipantService';
import ParticipantForm from './ParticipantForm';
import PageContainer from '../../../components/PageContainer';

const INITIAL_FORM_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  birthDate: '',
  phoneNumber: '',
  emergencyContactPhone: '',
  schoolId: '',
  type: 'Participant', // default type
};

export default function ParticipantCreate() {
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [formState, setFormState] = React.useState({
    values: INITIAL_FORM_VALUES,
    errors: {},
  });

  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback((newValues) => {
    setFormState((prev) => ({ ...prev, values: newValues }));
  }, []);

  const setFormErrors = React.useCallback((newErrors) => {
    setFormState((prev) => ({ ...prev, errors: newErrors }));
  }, []);

  const handleFormFieldChange = React.useCallback(
    (name, value) => {
      const newFormValues = { ...formValues, [name]: value };
      setFormValues(newFormValues);

      // simple validation
      const issues = [];
      if (!newFormValues.firstName) issues.push({ path: ['firstName'], message: 'First name is required' });
      if (!newFormValues.lastName) issues.push({ path: ['lastName'], message: 'Last name is required' });
      if (!newFormValues.email) issues.push({ path: ['email'], message: 'Email is required' });
      if (!newFormValues.password) issues.push({ path: ['password'], message: 'Password is required' });
      if (!newFormValues.birthDate) issues.push({ path: ['birthDate'], message: 'Birth date is required' });
      if (!newFormValues.phoneNumber) issues.push({ path: ['phoneNumber'], message: 'Phone number is required' });
      if (!newFormValues.type) issues.push({ path: ['type'], message: 'Type is required' });

      setFormErrors({
        ...formErrors,
        [name]: issues.find((issue) => issue.path?.[0] === name)?.message,
      });
    },
    [formValues, formErrors, setFormValues, setFormErrors]
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

    if (issues.length > 0) {
      setFormErrors(Object.fromEntries(issues.map((i) => [i.path?.[0], i.message])));
      return;
    }
    setFormErrors({});

    try {
      const service = new ParticipantService();
      const payload = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        password: formValues.password,
        birthDate: formValues.birthDate || null,
        phoneNumber: formValues.phoneNumber || null,
        emergencyContactPhone: formValues.emergencyContactPhone || null,
        school: formValues.schoolId ? { id: Number(formValues.schoolId) } : null,
        type: formValues.type,
      };
      await service.create(payload);

      notifications.show('Participant created successfully.', { severity: 'success', autoHideDuration: 3000 });
      navigate('/admin/participants');
    } catch (error) {
      notifications.show(`Failed to create participant. Reason: ${error.message}`, { severity: 'error', autoHideDuration: 3000 });
      throw error;
    }
  }, [formValues, navigate, notifications, setFormErrors]);

  return (
    <PageContainer
      title="New Participant"
      breadcrumbs={[{ title: 'Participants', path: '/admin/participants' }, { title: 'New' }]}
    >
      <ParticipantForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
