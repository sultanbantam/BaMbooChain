import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { requestForToken } from '../utils/NotificationService';

export default function PushNotificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      if (Notification.permission === 'default') {
        const timer = setTimeout(() => setIsOpen(true), 3000);
        return () => clearTimeout(timer);
      } else if (Notification.permission === 'granted') {
        setIsSubscribed(true);
      }
    }
  }, []);

  const subscribeUser = async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setMessage('Izin notifikasi ditolak.');
        setLoading(false);
        return;
      }

      // Menggunakan Firebase Cloud Messaging (FCM)
      const token = await requestForToken();

      if (token) {
        setIsSubscribed(true);
        setMessage('Berhasil berlangganan notifikasi!');
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        throw new Error('Gagal mendapatkan token FCM');
      }
    } catch (err) {
      console.error(err);
      setMessage('Gagal mengaktifkan notifikasi. Silakan coba lagi nanti.');
    }
    setLoading(false);
  };

  const sendTestNotification = async () => {
    setLoading(true);
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification('Notifikasi Uji Coba', {
          body: 'Ini adalah notifikasi dari BaMbooChain PWA.',
          icon: '/logos/bmc.png',
          data: { url: window.location.href }
        });
        setMessage('Notifikasi terkirim!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Service worker tidak didukung');
      }
    } catch (err) {
      console.error(err);
      setMessage('Gagal mengirim notifikasi uji coba.');
    }
    setLoading(false);
  };

  if (!isOpen && !isSubscribed) return null;

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          title="Pengaturan Notifikasi"
          style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999, background: '#10b981', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)', cursor: 'pointer' }}
        >
          <FaBell size={20} />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{ background: '#1a1f1c', borderRadius: '24px', padding: '30px', maxWidth: '400px', width: '100%', position: 'relative', border: '1px solid #2d3748', textAlign: 'center' }}
            >
              <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#a0aec0', cursor: 'pointer' }}>
                <FaTimes size={20} />
              </button>
              
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <FaBell size={28} />
              </div>
              
              <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '10px' }}>Notifikasi PWA</h3>
              <p style={{ color: '#a0aec0', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5 }}>
                Dapatkan pemberitahuan penting secara langsung meskipun aplikasi sedang tertutup.
              </p>
              
              {message && (
                <div style={{ marginBottom: '15px', fontSize: '0.85rem', color: message.includes('Gagal') || message.includes('ditolak') ? '#ef4444' : '#10b981' }}>{message}</div>
              )}
              
              {!isSubscribed ? (
                <button 
                  onClick={subscribeUser} disabled={loading}
                  style={{ width: '100%', background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Memproses...' : 'Izinkan Notifikasi'}
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    Status: Berlangganan Aktif
                  </div>
                  <button 
                    onClick={sendTestNotification} disabled={loading}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                  >
                    <FaPaperPlane /> {loading ? 'Mengirim...' : 'Kirim Uji Coba'}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
