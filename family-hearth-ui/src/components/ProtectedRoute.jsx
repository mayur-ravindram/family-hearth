import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ children }) => {
  console.log('ProtectedRoute rendered');
  const { accessToken, loading } = useAuth();

  if (loading) {
    console.log('ProtectedRoute: AuthContext is loading. Displaying loading message.');
    // Optionally, render a loading spinner or message while authentication status is being determined
    return <div className="min-h-screen bg-gray-100 flex justify-center items-center"><p>Loading authentication...</p></div>;
  }

  if (!accessToken) {
    console.log('ProtectedRoute: No accessToken found. Redirecting to /login.');
    // User is not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute: Access granted. Rendering children.');
  return children;
};

export default ProtectedRoute;
