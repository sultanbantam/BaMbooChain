import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bike, Car, Package, Clock, Users, MapPin, ArrowRight,
  Crosshair, ShieldCheck, UserCheck, Wallet, Sparkles, Navigation
} from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import MapViewComponent from '../../components/boomboom/MapViewComponent';
import SosButton from '../../components/boomboom/SosButton';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';
import { useAuth } from '../../context/AuthContext';
import { reverseGeocodeCoords } from '../../services/boomboom/geoService';

const useIsMobile = () => {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w <= 768;
};

const BoomBoomPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { activeBooking, setServiceType, setPickup, setDestination, recalculateRouteAndFare } = useBoomBoomStore();

  const [pickupInput, setPickupInput] = useState(activeBooking.pickupAddress || '');
  const [destInput, setDestInput] = useState(activeBooking.destinationAddress || '');
  const [isLocating, setIsLocating] = useState(false);

  // Sinkronisasi otomatis saat user memilih dari pin peta
  useEffect(() => {
    if (activeBooking.pickupAddress && activeBooking.pickupAddress !== pickupInput) {
      setPickupInput(activeBooking.pickupAddress);
    }
  }, [activeBooking.pickupAddress]);

  useEffect(() => {
    if (activeBooking.destinationAddress && activeBooking.destinationAddress !== destInput) {
      setDestInput(activeBooking.destinationAddress);
    }
  }, [activeBooking.destinationAddress]);

  // Recalculate route debounced saat user mengetik
  useEffect(() => {
    if (!pickupInput || !destInput) return;
    const timer = setTimeout(() => {
      recalculateRouteAndFare(pickupInput, destInput);
    }, 600);
    return () => clearTimeout(timer);
  }, [pickupInput, destInput]);

  const handleQuickBook = async (e) => {
    if (e) e.preventDefault();
    if (pickupInput && destInput) {
      await recalculateRouteAndFare(pickupInput, destInput);
    } else if (pickupInput) {
      setPickup(pickupInput);
    }
    navigate('/boomboom/book');
  };

  // Tombol GPS Lokasi Saya untuk menjemput di titik saat ini
  const handleUseMyLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      alert('Perangkat Anda tidak mendukung fitur lokasi GPS.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const quickLabel = `Lokasi Saya (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        setPickupInput(quickLabel);
        setPickup(quickLabel, { lat: latitude, lng: longitude });

        try {
          const addr = await reverseGeocodeCoords(latitude, longitude);
          setPickupInput(addr);
          setPickup(addr, { lat: latitude, lng: longitude });
        } catch {}
      },
      () => {
        setIsLocating(false);
        alert('Gagal membaca GPS. Pastikan izin lokasi perangkat telah diaktifkan.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // 5 Layanan Utama Simbolik Bergaya Gojek / Green SM
  const mainServices = [
    {
      type: 'BoomRide',
      title: 'BoomRide',
      icon: <Bike size={26} />,
      badge: 'Motor EV',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)'
    },
    {
      type: 'BoomCar',
      title: 'BoomCar',
      icon: <Car size={26} />,
      badge: 'Mobil Hijau',
      color: '#059669',
      bg: 'rgba(5, 150, 105, 0.12)'
    },
    {
      type: 'BoomSend',
      title: 'BoomSend',
      icon: <Package size={26} />,
      badge: 'Kirim Cepat',
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.12)'
    },
    {
      type: 'BoomSchedule',
      title: 'Jadwal',
      icon: <Clock size={26} />,
      badge: 'Terencana',
      color: '#d97706',
      bg: 'rgba(217, 119, 6, 0.12)'
    },
    {
      type: 'BoomTogether',
      title: 'Tumpangan',
      icon: <Users size={26} />,
      badge: 'Komunitas',
      color: '#7c3aed',
      bg: 'rgba(124, 58, 237, 0.12)'
    }
  ];

  const quickChips = [
    'Stasiun Cisauk',
    'Pasar Cibarani Subang',
    'Balaikota Tangerang Selatan',
    'Sentra Bibit Bambu Cibarani',
    'Kawasan Wisata Bambu'
  ];

  return (
    <div style={{
      background: 'var(--bg-color, #f8fafc)',
      color: 'var(--text-main, #0f172a)',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      <BoomBoomNavHeader />

      <style>{`
        .boomboom-modern-input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main, #0f172a);
        }
        .boomboom-modern-input::placeholder {
          color: var(--text-muted, #94a3b8);
          font-weight: 500;
        }
        .svc-card-touch {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .svc-card-touch:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '12px 14px' : '20px 18px' }}>
        
        {/* ══ TOP QUICK WALLET & NGOPI.TOP BAR ══ */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '20px',
          padding: '12px 18px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          border: '1px solid var(--border-color, #e2e8f0)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
        }}>
          {/* Saldo BMC & Rupiah */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wallet size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted, #64748b)' }}>
                DOMPET HIJAU
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#047857' }}>
                {user?.bmcBalance !== undefined ? `${user.bmcBalance} BMC` : '100 BMC'} • QRIS Aktif
              </div>
            </div>
          </div>

          {/* Identity ngopi.top Status */}
          <a
            href="https://ngopi.top"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(217, 119, 6, 0.1)',
              color: '#b45309',
              padding: '6px 12px',
              borderRadius: '14px',
              fontSize: '0.78rem',
              fontWeight: '800',
              border: '1px solid rgba(217, 119, 6, 0.25)'
            }}
          >
            <span>☕</span>
            <span>Identity ngopi.top Terhubung</span>
            <span style={{ fontSize: '0.7rem', color: '#059669' }}>● Online</span>
          </a>
        </div>

        {/* ══ GOJEK / GREEN SM ICONIC SERVICE GRID ══ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: isMobile ? '8px' : '14px',
          marginBottom: '20px'
        }}>
          {mainServices.map((svc) => {
            const isSelected = activeBooking.serviceType === svc.type;
            return (
              <button
                key={svc.type}
                type="button"
                onClick={() => {
                  setServiceType(svc.type);
                  navigate('/boomboom/book');
                }}
                className="svc-card-touch"
                style={{
                  background: isSelected ? 'var(--bg-card, #ffffff)' : 'var(--bg-card, #ffffff)',
                  border: isSelected ? `2.5px solid ${svc.color}` : '1.5px solid var(--border-color, #e2e8f0)',
                  borderRadius: isMobile ? '16px' : '20px',
                  padding: isMobile ? '12px 6px' : '16px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: isSelected ? `0 6px 18px ${svc.color}25` : '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{
                  width: isMobile ? '44px' : '52px',
                  height: isMobile ? '44px' : '52px',
                  borderRadius: isMobile ? '14px' : '18px',
                  background: svc.bg,
                  color: svc.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 10px ${svc.color}20`
                }}>
                  {svc.icon}
                </div>
                <div style={{
                  fontSize: isMobile ? '0.75rem' : '0.86rem',
                  fontWeight: '900',
                  color: 'var(--text-main, #0f172a)',
                  lineHeight: 1.2
                }}>
                  {svc.title}
                </div>
                <span style={{
                  fontSize: isMobile ? '0.62rem' : '0.68rem',
                  fontWeight: '700',
                  color: svc.color,
                  background: svc.bg,
                  padding: '2px 6px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap'
                }}>
                  {svc.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* ══ BOOKING SEARCH CARD (Dikosongkan Secara Default) ══ */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '24px',
          padding: isMobile ? '18px' : '24px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          border: '1.5px solid var(--border-color, #e2e8f0)',
          marginBottom: '20px'
        }}>
          <form onSubmit={handleQuickBook} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Input Lokasi Jemput */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: '900', color: 'var(--text-muted, #64748b)', letterSpacing: '0.5px' }}>
                  🟢 LOKASI JEMPUT
                </label>
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#059669',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0
                  }}
                >
                  <Crosshair size={13} className={isLocating ? 'animate-spin' : ''} />
                  <span>{isLocating ? 'Mendeteksi...' : 'Lokasi Saya'}</span>
                </button>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--bg-secondary, #f8fafc)',
                border: '1.5px solid var(--border-color, #e2e8f0)',
                borderRadius: '14px',
                padding: '12px 14px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#10b981',
                  flexShrink: 0,
                  boxShadow: '0 0 6px #10b981'
                }} />
                <input
                  type="text"
                  value={pickupInput}
                  onChange={(e) => setPickupInput(e.target.value)}
                  placeholder="Mau dijemput di mana? (Ketik atau klik Lokasi Saya)"
                  className="boomboom-modern-input"
                />
              </div>
            </div>

            {/* Input Lokasi Tujuan */}
            <div>
              <label style={{
                fontSize: '0.72rem',
                fontWeight: '900',
                color: 'var(--text-muted, #64748b)',
                display: 'block',
                marginBottom: '6px',
                letterSpacing: '0.5px'
              }}>
                🏁 LOKASI TUJUAN
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--bg-secondary, #f8fafc)',
                border: '1.5px solid var(--border-color, #e2e8f0)',
                borderRadius: '14px',
                padding: '12px 14px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  flexShrink: 0,
                  boxShadow: '0 0 6px #ef4444'
                }} />
                <input
                  type="text"
                  value={destInput}
                  onChange={(e) => setDestInput(e.target.value)}
                  placeholder="Mau pergi ke mana hari ini? (Ketik atau klik peta)"
                  className="boomboom-modern-input"
                />
              </div>
            </div>

            {/* Rekomendasi Titik Populer Cepat (Chips) */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDestInput(chip)}
                  style={{
                    background: 'var(--bg-secondary, #f1f5f9)',
                    border: '1px solid var(--border-color, #e2e8f0)',
                    color: 'var(--text-muted, #475569)',
                    padding: '5px 11px',
                    borderRadius: '20px',
                    fontSize: '0.73rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  📍 {chip}
                </button>
              ))}
            </div>

            {/* Tombol Aksi Pesan & SOS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', marginTop: '6px' }}>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: '16px',
                  fontWeight: '900',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Pesan Sekarang</span>
                <ArrowRight size={18} />
              </button>
              <SosButton />
            </div>
          </form>
        </div>

        {/* ══ LIVE RESPONSIVE MAP (Tanpa Tulisan Berbelit-belit) ══ */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '24px',
          padding: isMobile ? '14px' : '18px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
          border: '1px solid var(--border-color, #e2e8f0)',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Navigation size={18} color="#10b981" />
              <span style={{ fontSize: '0.95rem', fontWeight: '900', color: 'var(--text-main, #0f172a)' }}>
                Radar Pengemudi & Peta Rute
              </span>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#047857', background: '#ecfdf5', padding: '3px 8px', borderRadius: '8px', fontWeight: '800' }}>
              🟢 Klik peta untuk tentukan titik jemput / tujuan
            </span>
          </div>

          <MapViewComponent height={isMobile ? '300px' : '380px'} showNearbyDrivers={true} />
        </div>

        {/* ══ DRIVER & PARTNER QUICK BAR (Syarat Utama ngopi.top) ══ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          {/* Dasbor Driver Online */}
          <div
            onClick={() => navigate('/boomboom/driver/dashboard')}
            style={{
              background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '16px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 6px 18px rgba(6, 78, 59, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🛵
              </div>
              <div>
                <div style={{ fontWeight: '900', fontSize: '0.95rem' }}>Dasbor Pengemudi</div>
                <div style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>Mode Narik & Terima Pesanan Masuk ➔</div>
              </div>
            </div>
            <span style={{ background: '#10b981', color: '#ffffff', padding: '4px 10px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: '900' }}>
              ONLINE
            </span>
          </div>

          {/* Gabung Mitra Pengemudi (Wajib Akun ngopi.top) */}
          <div
            onClick={() => navigate('/boomboom/driver')}
            style={{
              background: 'var(--bg-card, #ffffff)',
              color: 'var(--text-main, #0f172a)',
              borderRadius: '20px',
              padding: '16px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '2px solid #10b981',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(217, 119, 6, 0.12)',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                ☕
              </div>
              <div>
                <div style={{ fontWeight: '900', fontSize: '0.95rem' }}>Daftar Driver BoomBoom</div>
                <div style={{ fontSize: '0.74rem', color: '#047857', fontWeight: '700' }}>
                  Wajib Terdaftar di ngopi.top ➔
                </div>
              </div>
            </div>
            <span style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#b45309', padding: '4px 10px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: '900' }}>
              Daftar
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BoomBoomPage;
