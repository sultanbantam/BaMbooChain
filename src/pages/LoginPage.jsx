import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase/config';
import { useAuthStore } from '../store/useAuthStore';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { openLoginModal } = useAuthStore();
  const [statusText, setStatusText] = useState('Memuat halaman...');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const processLogin = async () => {
      const urlParams = new URLSearchParams(location.search);
      const redirectUrl = urlParams.get('redirect');

      if (!isAuthenticated || !user) {
        setStatusText('Menunggu Anda masuk (login) ke BambooChain...');
        openLoginModal();
        return;
      }

      if (isProcessing) return;

      if (redirectUrl) {
        setIsProcessing(true);
        setStatusText('Memverifikasi sesi SSO...');
        try {
          if (!auth.currentUser) {
            throw new Error("Sesi Firebase kosong, silakan muat ulang halaman.");
          }

          const idToken = await auth.currentUser.getIdToken(true);
          const response = await fetch('/api/sso/mint-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken })
          });

          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }

          const data = await response.json();
          if (data.customToken) {
            setStatusText('Berhasil! Mengalihkan Anda ke sistem pihak ketiga...');
            // Redirect outside of the app
            window.location.replace(`${redirectUrl}?token=${data.customToken}`);
          } else {
            throw new Error(data.error || 'Token tidak didapatkan dari server');
          }
        } catch (error) {
          console.error("SSO Error:", error);
          setStatusText(`Gagal melakukan verifikasi SSO: ${error.message}`);
          setIsProcessing(false);
        }
      } else {
        // Normal login, no redirect param
        setStatusText('Berhasil masuk! Membuka Dasbor...');
        navigate('/bamboochain');
      }
    };

    processLogin();
  }, [isAuthenticated, user, location, navigate, openLoginModal, isProcessing]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh',
      flexDirection: 'column',
      gap: '20px',
      color: 'var(--primary)',
      padding: '20px',
      textAlign: 'center',
      fontFamily: '"Inter", sans-serif'
    }}>
      <div style={{
        width: '45px',
        height: '45px',
        border: '4px solid rgba(16, 185, 129, 0.15)',
        borderTop: '4px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#333' }}>
        Autentikasi BambooChain
      </h2>
      <p style={{ fontSize: '1rem', color: '#666', maxWidth: '400px', lineHeight: '1.5' }}>
        {statusText}
      </p>
    </div>
  );
};

export default LoginPage;
