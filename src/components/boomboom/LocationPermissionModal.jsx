import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertTriangle, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

const LocationPermissionModal = () => {
  const { activeBooking, setPickup } = useBoomBoomStore();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('IDLE'); // 'IDLE' | 'LOCATING' | 'SUCCESS' | 'DENIED' | 'UNSUPPORTED'
  const [locationName, setLocationName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Periksa status lokasi saat komponen pertama kali dimuat
    const hasPrompted = sessionStorage.getItem('boomboom_gps_prompted');
    if (!hasPrompted) {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        if (navigator.permissions && navigator.permissions.query) {
          navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
            if (permission.state === 'granted') {
              autoDetectSilent();
            } else {
              setIsOpen(true);
            }
          }).catch(() => {
            setIsOpen(true);
          });
        } else {
          setIsOpen(true);
        }
      } else {
        setStatus('UNSUPPORTED');
        setIsOpen(true);
      }
    }
  }, []);

  const autoDetectSilent = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await applyCoords(latitude, longitude);
      },
      (err) => {
        console.warn('Auto-detect lokasi gagal:', err);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const applyCoords = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { 'Accept-Language': 'id,en', 'User-Agent': 'BaMbooChain-BoomBoom/1.0' }
      });
      if (res.ok) {
        const data = await res.json();
        const road = data.address?.road || data.address?.suburb || data.address?.village || data.address?.city || 'Lokasi Saya Saat Ini';
        const full = data.display_name ? data.display_name.split(',').slice(0, 3).join(',') : `Titik GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        const address = `${road} (${full})`;
        setLocationName(address);
        setPickup(address, { lat, lng });
      } else {
        const fallback = `Titik GPS Presisi (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        setLocationName(fallback);
        setPickup(fallback, { lat, lng });
      }
    } catch {
      const fallback = `Titik GPS Presisi (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      setLocationName(fallback);
      setPickup(fallback, { lat, lng });
    }
  };

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setStatus('UNSUPPORTED');
      return;
    }

    setStatus('LOCATING');
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setStatus('SUCCESS');
        await applyCoords(latitude, longitude);
        sessionStorage.setItem('boomboom_gps_prompted', 'true');
        setTimeout(() => {
          setIsOpen(false);
        }, 1800);
      },
      (error) => {
        setStatus('DENIED');
        sessionStorage.setItem('boomboom_gps_prompted', 'true');
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage('Izin lokasi ditolak. Harap klik ikon gembok/pengaturan di address bar browser Anda dan pilih "Izinkan Akses Lokasi".');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setErrorMessage('Sinyal GPS tidak tersedia saat ini. Anda dapat mengetikkan titik penjemputan secara manual.');
        } else {
          setErrorMessage('Waktu permintaan lokasi habis. Silakan coba lagi.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleDismiss = () => {
    sessionStorage.setItem('boomboom_gps_prompted', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--bg-card, #ffffff)',
        borderRadius: '24px',
        padding: '28px 24px',
        maxWidth: '460px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '2px solid #10b981',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Tombol Tutup / Dismiss */}
        <button
          onClick={handleDismiss}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted, #64748b)',
            padding: '4px'
          }}
          title="Tutup"
        >
          <X size={20} />
        </button>

        {/* Icon Header */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: status === 'DENIED' ? '#fee2e2' : '#d1fae5',
          color: status === 'DENIED' ? '#dc2626' : '#059669',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)'
        }}>
          {status === 'DENIED' ? (
            <AlertTriangle size={32} />
          ) : status === 'SUCCESS' ? (
            <CheckCircle2 size={34} />
          ) : (
            <Navigation size={30} style={{ transform: 'rotate(45deg)' }} />
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.3rem',
          fontWeight: '900',
          color: 'var(--text-main, #0f172a)',
          margin: '0 0 10px',
          lineHeight: 1.3
        }}>
          {status === 'SUCCESS'
            ? 'Lokasi Berhasil Terdeteksi!'
            : status === 'DENIED'
            ? 'Pemberitahuan Izin Lokasi'
            : 'Wajib Aktifkan Lokasi Anda (GPS)'}
        </h3>

        {/* Subtitle / Description */}
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted, #475569)',
          lineHeight: 1.55,
          margin: '0 0 20px'
        }}>
          {status === 'SUCCESS' ? (
            <span style={{ color: '#047857', fontWeight: '700' }}>
              📍 {locationName || 'Koordinat Anda siap digunakan untuk rute & tarif akurat.'}
            </span>
          ) : status === 'DENIED' ? (
            <span>{errorMessage}</span>
          ) : (
            'Untuk memastikan akurasi titik penjemputan, navigasi pengemudi terdekat, dan perhitungan jarak riil di BoomBoom, mohon aktifkan izin GPS pada perangkat Anda.'
          )}
        </p>

        {/* Action Button */}
        {status !== 'SUCCESS' && (
          <button
            onClick={handleRequestLocation}
            disabled={status === 'LOCATING'}
            style={{
              width: '100%',
              background: status === 'DENIED'
                ? '#f59f00'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '14px 20px',
              borderRadius: '16px',
              fontWeight: '900',
              fontSize: '0.95rem',
              cursor: status === 'LOCATING' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
              marginBottom: '10px'
            }}
          >
            <MapPin size={18} />
            {status === 'LOCATING'
              ? 'Mendeteksi Koordinat GPS...'
              : status === 'DENIED'
              ? 'Coba Deteksi Lokasi Lagi'
              : 'Aktifkan & Deteksi Lokasi Sekarang 📍'}
          </button>
        )}

        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted, #64748b)',
            fontSize: '0.82rem',
            fontWeight: '700',
            cursor: 'pointer',
            padding: '6px'
          }}
        >
          {status === 'SUCCESS' ? 'Lanjutkan' : 'Isi Alamat Penjemputan Manual Saja'}
        </button>
      </div>
    </div>
  );
};

export default LocationPermissionModal;