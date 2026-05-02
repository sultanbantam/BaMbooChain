import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    // If not authenticated, we trigger the login modal popup so the user knows why they were redirected.
    if (!isAuthenticated) {
      openLoginModal();
    }
    // Set a very small delay to prevent flickering before rendering the Navigate component
    const timer = setTimeout(() => setIsChecking(false), 50);
    return () => clearTimeout(timer);
  }, [isAuthenticated, openLoginModal]);

  if (isChecking) return null;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
