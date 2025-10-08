import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../../../hooks/useNotifications/useNotifications';
import { SchoolService } from '../../../service/SchoolService';
import SchoolForm from './SchoolForm';
import PageContainer from '../../../components/PageContainer';

const INITIAL_FORM_VALUES = {
  name: '',
};

export default function SchoolCreate() {
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
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      const service = new SchoolService();
      await service.create(formValues);
      notifications.show('School created successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/admin/schools');
    } catch (createError) {
      notifications.show(
        `Failed to create schools. Reason: ${createError.message}`,
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
      title="New School"
      breadcrumbs={[{ title: 'Schools', path: '/admin/schools' }, { title: 'New' }]}
    >
      <SchoolForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
