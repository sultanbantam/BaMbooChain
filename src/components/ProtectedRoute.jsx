import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthReady, openLoginModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthReady || isAuthenticated) return;

    const intendedPath = location.pathname + location.search + location.hash;
    sessionStorage.setItem('redirect_after_login', intendedPath);
    openLoginModal();
  }, [isAuthReady, isAuthenticated, openLoginModal, location]);

  if (!isAuthReady) return null;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
