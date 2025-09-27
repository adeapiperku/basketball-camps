import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createHashRouter, RouterProvider } from 'react-router';
import DashboardLayout from '../DashboardLayout';
import AdminList from '../../page/admin/admins/AdminList';
import AdminShow from '../../page/admin/admins/AdminShow';
import AdminEdit from '../../page/admin/admins/AdminEdit';
import AdminCreate from '../../page/admin/admins/AdminCreate';
import NotificationsProvider from '../../hooks/useNotifications/NotificationsProvider';
import DialogsProvider from '../../hooks/useDialogs/DialogsProvider';
import SchoolList from '../../page/admin/schools/SchoolList';
import SchoolShow from '../../page/admin/schools/SchoolShow';
import SchoolCreate from '../../page/admin/schools/SchoolCreate';
import SchoolEdit from '../../page/admin/schools/SchoolEdit';

const router = createHashRouter([
  {
    Component: DashboardLayout,
    children: [
      // Admin routes
      { path: '/admins', Component: AdminList },
      { path: '/admins/:adminId', Component: AdminShow },
      { path: '/admins/new', Component: AdminCreate },
      { path: '/admins/:adminId/edit', Component: AdminEdit },
      { path: '/admins/*', Component: AdminList },

      // School routes
      { path: '/schools', Component: SchoolList },
      { path: '/schools/:schoolId', Component: SchoolShow },
      { path: '/schools/new', Component: SchoolCreate },
      { path: '/schools/:schoolId/edit', Component: SchoolEdit },
      { path: '/schools/*', Component: SchoolList },
    ],
  },
]);

export default function Dashboard(props) {
  return (
    <>
      <CssBaseline />
      <NotificationsProvider>
        <DialogsProvider>
          <RouterProvider router={router} />
        </DialogsProvider>
      </NotificationsProvider>
    </>
  );
}
