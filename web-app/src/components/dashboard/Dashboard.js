import { Routes, Route } from 'react-router-dom';
import { AdminRoutes } from '../../routes/Routes';
import NotificationsProvider from '../../hooks/useNotifications/NotificationsProvider';
import DialogsProvider from '../../hooks/useDialogs/DialogsProvider';
import CssBaseline from '@mui/material/CssBaseline';

export default function Dashboard() {
  return (
    <>
      <CssBaseline />
      <NotificationsProvider>
        <DialogsProvider>
          <Routes>
            {AdminRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element}>
                {route.children?.map((child) => (
                  <Route
                    key={child.path}
                    path={child.path}
                    element={child.element}
                  />
                ))}
              </Route>
            ))}
          </Routes>
        </DialogsProvider>
      </NotificationsProvider>
    </>
  );
}
