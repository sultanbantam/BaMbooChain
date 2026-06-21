import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const AuthorizePage = () => {
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get('client_id');
  const redirectUri = queryParams.get('redirect_uri');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  useEffect(() => {
    // Show login modal if not authenticated after Firebase has had time to initialize
    const timer = setTimeout(() => {
      if (!isAuthenticated && !user) {
        openLoginModal();
      }
    }, 1500); // 1.5 second delay to let Firebase Auth restore the session

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, openLoginModal]);

  const handleAuthorize = async () => {
    if (!user || !clientId) {
      alert("Missing user or client_id");
      return;
    }
    
    setIsAuthorizing(true);
    
    try {
      const res = await fetch('/api/oauth/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId, uid: user.id, redirect_uri: redirectUri })
      });
      const data = await res.json();
      
      if (data.success && data.code) {
        if (redirectUri) {
          window.location.href = `${redirectUri}?code=${data.code}`;
        } else {
          alert("Redirect URI tidak valid atau tidak disediakan.");
        }
      } else {
        alert("Otorisasi Gagal: " + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleCancel = () => {
    if (redirectUri) {
      window.location.href = `${redirectUri}?error=access_denied`;
    } else {
      navigate('/');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
          Otorisasi BMC
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Silakan login untuk melanjutkan proses otorisasi.
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      paddingTop: 'calc(var(--navbar-height, 80px) + 60px)',
      paddingBottom: '60px'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          background: 'var(--bg-card)', 
          padding: '32px', 
          borderRadius: '24px', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)', 
          maxWidth: '450px', 
          width: '100%', 
          textAlign: 'center',
          border: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <svg style={{ width: '32px', height: '32px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px' }}>
          Otorisasi Akun
        </h2>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
          Aplikasi <span style={{ fontWeight: 'bold', color: '#10b981' }}>{clientId || 'Pihak Ketiga'}</span> ingin mengakses akun BaMbooChain Anda.
        </p>
        
        <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px', marginBottom: '32px', textAlign: 'left', border: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>Aplikasi ini dapat:</p>
          <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Membaca profil dasar Anda
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Mengecek saldo Dompet BMC Anda
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Meminta persetujuan transaksi di aplikasi terkait
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexDirection: 'row' }}>
          <button 
            onClick={handleCancel}
            style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.target.style.background = 'var(--bg-secondary)'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            Tolak
          </button>
          <button 
            onClick={handleAuthorize}
            style={{ flex: 1, padding: '12px', background: isAuthorizing ? '#9ca3af' : '#10b981', border: 'none', color: 'white', borderRadius: '12px', cursor: isAuthorizing ? 'not-allowed' : 'pointer', fontWeight: 'bold', transition: 'all 0.2s', boxShadow: isAuthorizing ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)' }}
            disabled={isAuthorizing}
            onMouseOver={(e) => { if (!isAuthorizing) e.target.style.transform = 'translateY(-2px)' }}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {isAuthorizing ? 'Memproses...' : 'Izinkan'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthorizePage;
