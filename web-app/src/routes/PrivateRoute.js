import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/home" replace />;
  // }

  return children;
}
