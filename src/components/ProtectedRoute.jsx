import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const [isChecking, setIsChecking] = React.useState(true);
  const location = useLocation();

  useEffect(() => {
    // If not authenticated, we trigger the login modal popup so the user knows why they were redirected.
    if (!isAuthenticated) {
      // Save the intended route so we can redirect them back after login
      const intendedPath = location.pathname + location.search + location.hash;
      sessionStorage.setItem('redirect_after_login', intendedPath);
      openLoginModal();
    }
    // Set a very small delay to prevent flickering before rendering the Navigate component
    const timer = setTimeout(() => setIsChecking(false), 50);
    return () => clearTimeout(timer);
  }, [isAuthenticated, openLoginModal, location]);

  if (isChecking) return null;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
