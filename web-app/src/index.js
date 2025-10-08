import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import DialogsProvider from './hooks/useDialogs/DialogsProvider';
import NotificationsProvider from './hooks/useNotifications/NotificationsProvider';
import theme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <AuthProvider>
      <DialogsProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </DialogsProvider>
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
