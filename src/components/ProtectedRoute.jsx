import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthReady, openLoginModal } = useAuth();
  const location = useLocation();
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Safety fallback: if auth takes longer than 3.5s, don't keep user waiting in blank screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasTimedOut(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ((!isAuthReady && !hasTimedOut) || isAuthenticated) return;

    const intendedPath = location.pathname + location.search + location.hash;
    sessionStorage.setItem('redirect_after_login', intendedPath);
    openLoginModal();
  }, [isAuthReady, hasTimedOut, isAuthenticated, openLoginModal, location]);

  if (!isAuthReady && !hasTimedOut) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '75vh',
        flexDirection: 'column',
        gap: '16px',
        color: '#51cf66',
        backgroundColor: '#0a0f0a',
        paddingTop: '120px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          border: '3px solid rgba(81, 207, 102, 0.15)',
          borderTop: '3px solid #51cf66',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '0.9rem', color: '#adb5bd', fontWeight: '500' }}>
          Memuat sesi Anda...
        </span>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
