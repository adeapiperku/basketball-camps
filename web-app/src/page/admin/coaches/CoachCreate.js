import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../../../hooks/useNotifications/useNotifications';
import { registerUser } from '../../../service/requests/auth';
import CoachForm from './CoachForm';
import PageContainer from '../../../components/PageContainer';

const INITIAL_FORM_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: '',
  birthDate: '',
  role: 'COACH',
};

export default function CoachCreate() {
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [formState, setFormState] = React.useState({
    values: INITIAL_FORM_VALUES,
    errors: {},
  });
  const { values, errors } = formState;
  const setFormValues = React.useCallback(
    (newValues) => setFormState((prev) => ({ ...prev, values: newValues })),
    []
  );

  const setFormErrors = React.useCallback(
    (newErrors) => setFormState((prev) => ({ ...prev, errors: newErrors })),
    []
  );

  const handleFieldChange = React.useCallback(
    (name, value) => {
      const newValues = { ...values, [name]: value };
      setFormValues(newValues);
      const newErrors = { ...errors };

      if (!value) {
        newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      } else {
        delete newErrors[name];
      }

      if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = 'Invalid email address';
      }

      if (name === 'password' && value.length < 5) {
        newErrors.password = 'Password must be at least 5 characters';
      }

      if (name === 'birthDate') {
        const today = new Date().toISOString().split('T')[0];
        if (value > today) newErrors.birthDate = 'Birth date cannot be in the future';
      }

      setFormErrors(newErrors);
    },
    [values, errors, setFormValues, setFormErrors]
  );

  const handleReset = React.useCallback(() => {
    setFormValues(INITIAL_FORM_VALUES);
    setFormErrors({});
  }, [setFormValues, setFormErrors]);

  const handleSubmit = React.useCallback(async () => {
    const newErrors = {};
    Object.entries(values).forEach(([key, val]) => {
      if (!val && key !== 'role') {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    try {
      await registerUser(values);
      notifications.show('Coach created successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      navigate('/admin/coaches');
    } catch (error) {
      notifications.show(`Failed to create coach. Reason: ${error.message}`, {
        severity: 'error',
        autoHideDuration: 3000,
      });
    }
  }, [values, navigate, notifications, setFormErrors]);

  return (
    <PageContainer
      title="New Coach"
      breadcrumbs={[{ title: 'Coaches', path: '/admin/coaches' }, { title: 'New' }]}
    >
      <CoachForm
        formState={formState}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        onReset={handleReset}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
