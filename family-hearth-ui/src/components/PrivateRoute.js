import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('jwt');

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ message: "You must be logged in to view this page." }} />;
  }

  return children;
};

export default PrivateRoute;
