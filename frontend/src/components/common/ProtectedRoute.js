// components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return <Loader />;
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check for specific role requirement
  if (requiredRole === 'admin' && !isAdmin) {
    // If user tries to access admin route but is not admin, redirect to user dashboard
    return <Navigate to="/user/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;