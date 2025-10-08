import * as React from "react";
import { useNavigate } from "react-router";
import useNotifications from "../../../hooks/useNotifications/useNotifications";
import { CampService } from "../../../service/CampService";
import CampForm from "./CampForm";
import PageContainer from "../../../components/PageContainer";

const INITIAL_FORM_VALUES = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  price: '',
  maxParticipants: '',
  currentParticipants: 0,
  location: '',
  isActive: '',
  registrationDeadline: '',
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
        if (!values.startDate) issues.push({ path: ['startDate'], message: 'Start date is required' });
        if (!values.endDate) issues.push({ path: ['endDate'], message: 'End date is required' });
        if (!values.price) issues.push({ path: ['price'], message: 'Price is required' });
        if (!values.maxParticipants) issues.push({ path: ['maxParticipants'], message: 'Max Participants number is required' });
        if (!values.location) issues.push({ path: ['location'], message: 'Location is required' });
        if (!values.isActive) issues.push({ path: ['isActive'], message: 'Is active status is required' });
        if (!values.registrationDeadline) issues.push({ path: ['registrationDeadline'], message: 'Registration deadline date is required' });
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
      if (!formValues.startDate) issues.push({ path: ['startDate'], message: 'Start date is required' });
      if (!formValues.endDate) issues.push({ path: ['endDate'], message: 'End date is required' });
      if (!formValues.price) issues.push({ path: ['price'], message: 'Price is required' });
      if (!formValues.maxParticipants) issues.push({ path: ['maxParticipants'], message: 'Max Participants number is required' });
      if (!formValues.location) issues.push({ path: ['location'], message: 'Location is required' });
      if (!formValues.isActive) issues.push({ path: ['isActive'], message: 'Is active status is required' });
      if (!formValues.registrationDeadline) issues.push({ path: ['registrationDeadline'], message: 'Registration deadline date is required' });
      if (issues && issues.length > 0) {
        setFormErrors(
          Object.fromEntries(
            issues.map((issue) => [issue.path?.[0], issue.message])
          )
        );
      return;
    }
    setFormErrors({});

    try {
      const service = new CampService();
      await service.create(formValues);
      notifications.show("Camp created successfully.", {
        severity: "success",
        autoHideDuration: 3000,
      });

      navigate("/admin/camps");
    } catch (createError) {
      notifications.show(
        `Failed to create camp. Reason: ${createError.message}`,
        {
          severity: "error",
          autoHideDuration: 3000,
        }
      );
      throw createError;
    }
  }, [formValues, navigate, notifications, setFormErrors]);

  return (
    <PageContainer
      title="New Camp"
      breadcrumbs={[{ title: "Camps", path: "/admin/camps" }, { title: "New" }]}
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
