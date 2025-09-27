import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes } from 'react-router-dom';
import NotificationsProvider from '../../hooks/useNotifications/NotificationsProvider';
import DialogsProvider from '../../hooks/useDialogs/DialogsProvider';
import AppRoutes from '../../routes/Routes';

export default function Dashboard() {
  return (
    <>
      <CssBaseline />
      <NotificationsProvider>
        <DialogsProvider>
          <Routes>{AppRoutes}</Routes>
        </DialogsProvider>
      </NotificationsProvider>
    </>
  );
}
