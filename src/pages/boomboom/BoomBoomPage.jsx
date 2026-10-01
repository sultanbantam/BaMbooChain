import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Car, Bike, Clock, Users, Sparkles, ShieldCheck, ChevronRight,
  MapPin, Award, ArrowRight, Package, Compass, Home, HeartPulse
} from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import MapViewComponent from '../../components/boomboom/MapViewComponent';
import SosButton from '../../components/boomboom/SosButton';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

/* ---------- Responsive hook ---------- */
const useIsMobile = () => {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w <= 768;
};

/* ---------- Page ---------- */
const BoomBoomPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { activeBooking, setServiceType, setPickup, setDestination } = useBoomBoomStore();

  const [pickupInput, setPickupInput] = useState(activeBooking.pickupAddress);
  const [destInput, setDestInput] = useState(activeBooking.destinationAddress);

  const handleQuickBook = (e) => {
    e.preventDefault();
    setPickup(pickupInput);
    setDestination(destInput);
    navigate('/boomboom/book');
  };

  const services = [
    {
      type: 'BoomRide', label: 'BoomRide', sub: 'Ojek Motor Desa',
      icon: <Bike size={24} />, bg: '#d1fae5', color: '#059669', accent: '#10b981',
      btnBg: 'rgba(16,185,129,0.15)', btnColor: '#047857', btnText: 'Pesan BoomRide'
    },
    {
      type: 'BoomCar', label: 'BoomCar', sub: 'Mobil Nyaman',
      icon: <Car size={24} />, bg: '#d1fae5', color: '#059669', accent: '#10b981',
      btnBg: 'rgba(16,185,129,0.15)', btnColor: '#047857', btnText: 'Pesan BoomCar'
    },
    {
      type: 'BoomSchedule', label: 'BoomSchedule', sub: 'Perjalanan Terjadwal',
      icon: <Clock size={24} />, bg: '#fef3c7', color: '#b45309', accent: '#f59f00',
      btnBg: 'rgba(245,159,0,0.15)', btnColor: '#b45309', btnText: 'Buat Jadwal'
    },
    {
      type: 'BoomTogether', label: 'BoomTogether', sub: 'Tumpangan Komunitas',
      icon: <Users size={24} />, bg: '#cff4fc', color: '#0891b2', accent: '#06b6d4',
      btnBg: 'rgba(6,182,212,0.15)', btnColor: '#0891b2', btnText: 'Tumpangan Bareng'
    },
  ];

  const futureMods = [
    { icon: <Package size={15} />, label: 'BoomSend — Pengiriman' },
    { icon: <Compass size={15} />, label: 'BoomTour — Wisata Bambu' },
    { icon: <Home size={15} />, label: 'BoomVillage — Ekonomi Desa' },
    { icon: <HeartPulse size={15} />, label: 'BoomCare — Kesehatan' },
  ];

  return (
    <div style={{
      background: 'var(--bg-color, #f8fafc)',
      color: 'var(--text-main, #0f172a)',
      minHeight: '100vh',
      paddingBottom: '64px'
    }}>
      <BoomBoomNavHeader />

      {/* ─── Inject scoped CSS for dark-mode awareness ─── */}
      <style>{`
        .boom-input-field {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main, #0f172a);
        }
        .boom-input-field::placeholder { color: var(--text-muted, #94a3b8); font-weight: 500; }
        .boom-svc-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .boom-action-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        @media (max-width: 480px) {
          .boom-hero-h1 { font-size: 1.9rem !important; }
          .boom-hero-tagline { font-size: 1rem !important; }
          .boom-hero-desc { font-size: 0.88rem !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '16px 12px' : '24px 16px' }}>

        {/* ══ HERO + BOOKING CARD ══ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}>

          {/* ── Hero Banner ── */}
          <div style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%)',
            color: '#ffffff',
            padding: isMobile ? '22px 18px' : '28px',
            borderRadius: '24px',
            boxShadow: '0 12px 32px rgba(6,78,59,0.22)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: isMobile ? 'auto' : '280px'
          }}>
            {/* bg decoration */}
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.07, pointerEvents: 'none' }}>
              <Car size={200} color="#ffffff" />
            </div>

            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)',
                padding: '5px 12px', borderRadius: '20px',
                fontSize: '0.75rem', fontWeight: '700', color: '#fef08a', marginBottom: '12px'
              }}>
                <Sparkles size={13} /> Modul Mobilitas BaMbooChain
              </div>

              <h1 className="boom-hero-h1" style={{
                fontSize: isMobile ? '2rem' : '2.4rem',
                fontWeight: '900', margin: '0 0 10px',
                lineHeight: 1.1, letterSpacing: '-0.5px', color: '#ffffff'
              }}>
                BOOMBOOM
              </h1>

              <div className="boom-hero-tagline" style={{
                fontSize: isMobile ? '1.05rem' : '1.15rem',
                fontWeight: '700', color: '#a7f3d0', marginBottom: '8px'
              }}>
                "Dari Desa, Menghubungkan Nusantara."
              </div>

              <p className="boom-hero-desc" style={{
                fontSize: isMobile ? '0.88rem' : '0.93rem',
                color: '#ecfdf5', lineHeight: '1.65',
                maxWidth: '480px', margin: 0
              }}>
                Transportasi komunitas yang mudah, aman, transparan dan terhubung dengan ekosistem ekonomi hijau BaMbooChain.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <SosButton />
              <Link to="/boomboom/safety" style={{
                background: 'rgba(255,255,255,0.18)', color: '#ffffff',
                textDecoration: 'none', padding: '9px 16px',
                borderRadius: '24px', fontSize: '0.83rem', fontWeight: '700',
                display: 'inline-flex', alignItems: 'center', gap: '6px'
              }}>
                <ShieldCheck size={16} /> Panduan BoomSafe
              </Link>
            </div>
          </div>

          {/* ── Booking Card ── */}
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: isMobile ? '18px' : '26px',
            boxShadow: '0 8px 28px rgba(0,0,0,0.06)',
            border: '1px solid var(--border-color, #e2e8f0)'
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginBottom: '18px', gap: '8px', flexWrap: 'wrap'
            }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main, #0f172a)' }}>
                Pesan Perjalanan
              </h2>
              <span style={{
                fontSize: '0.72rem', background: 'rgba(16,185,129,0.12)',
                color: '#047857', padding: '4px 10px', borderRadius: '10px', fontWeight: '700',
                whiteSpace: 'nowrap'
              }}>
                Area Aktif: Subang / Cibarani
              </span>
            </div>

            <form onSubmit={handleQuickBook} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Pickup */}
              <div>
                <label style={{
                  fontSize: '0.72rem', fontWeight: '800',
                  color: 'var(--text-muted, #64748b)',
                  display: 'block', marginBottom: '6px', letterSpacing: '0.5px'
                }}>LOKASI JEMPUT</label>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'var(--bg-secondary, #f8fafc)',
                  border: '1.5px solid var(--border-color, #e2e8f0)',
                  borderRadius: '14px', padding: '11px 14px'
                }}>
                  <MapPin size={18} color="#10b981" style={{ flexShrink: 0 }} />
                  <input
                    type="text" value={pickupInput}
                    onChange={(e) => setPickupInput(e.target.value)}
                    placeholder="Masukkan lokasi penjemputan..."
                    className="boom-input-field"
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <label style={{
                  fontSize: '0.72rem', fontWeight: '800',
                  color: 'var(--text-muted, #64748b)',
                  display: 'block', marginBottom: '6px', letterSpacing: '0.5px'
                }}>LOKASI TUJUAN</label>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'var(--bg-secondary, #f8fafc)',
                  border: '1.5px solid var(--border-color, #e2e8f0)',
                  borderRadius: '14px', padding: '11px 14px'
                }}>
                  <MapPin size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                  <input
                    type="text" value={destInput}
                    onChange={(e) => setDestInput(e.target.value)}
                    placeholder="Masukkan tujuan perjalanan..."
                    className="boom-input-field"
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label style={{
                  fontSize: '0.72rem', fontWeight: '800',
                  color: 'var(--text-muted, #64748b)',
                  display: 'block', marginBottom: '8px', letterSpacing: '0.5px'
                }}>PILIH LAYANAN</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {['BoomRide', 'BoomCar'].map((svc, i) => {
                    const active = activeBooking.serviceType === svc;
                    return (
                      <button key={svc} type="button"
                        onClick={() => setServiceType(svc)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '10px 12px', borderRadius: '14px', textAlign: 'left',
                          border: active ? '2px solid #10b981' : '1.5px solid var(--border-color, #e2e8f0)',
                          background: active ? 'rgba(16,185,129,0.12)' : 'var(--bg-secondary, #f8fafc)',
                          cursor: 'pointer', transition: 'all 0.15s'
                        }}>
                        {i === 0
                          ? <Bike size={20} color={active ? '#10b981' : 'var(--text-muted, #94a3b8)'} />
                          : <Car size={20} color={active ? '#10b981' : 'var(--text-muted, #94a3b8)'} />
                        }
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--text-main, #0f172a)' }}>{svc}</div>
                          <div style={{ fontSize: '0.68rem', fontWeight: '600', color: 'var(--text-muted, #64748b)' }}>
                            {i === 0 ? 'Motor Desa' : 'Mobil Nyaman'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <button type="submit" className="boom-action-btn-primary" style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff', border: 'none',
                  padding: '13px 16px', borderRadius: '14px',
                  fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(16,185,129,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  transition: 'all 0.15s'
                }}>
                  PESAN <ArrowRight size={16} />
                </button>
                <button type="button"
                  onClick={() => { setServiceType('BoomSchedule'); navigate('/boomboom/book'); }}
                  style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    color: 'var(--text-main, #0f172a)',
                    border: '1.5px solid var(--border-color, #e2e8f0)',
                    padding: '13px 10px', borderRadius: '14px',
                    fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                  }}>
                  <Clock size={15} /> JADWAL
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ══ MAP PREVIEW ══ */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '24px', padding: isMobile ? '16px' : '24px',
          boxShadow: '0 8px 28px rgba(0,0,0,0.04)',
          border: '1px solid var(--border-color, #e2e8f0)',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', marginBottom: '14px',
            flexWrap: 'wrap', gap: '10px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 3px', color: 'var(--text-main, #0f172a)' }}>
                Peta Geospasial Sekitar
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: 0 }}>
                Pengemudi lokal terverifikasi & zona operasional mitra.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.8rem', fontWeight: '700', color: '#047857',
                background: 'rgba(16,185,129,0.12)', padding: '5px 10px', borderRadius: '10px', whiteSpace: 'nowrap'
              }}>
                Est: ~{activeBooking.fareCalc.formatted.grossFare}
              </span>
              <span style={{
                fontSize: '0.8rem', fontWeight: '700', color: '#b45309',
                background: 'rgba(245,159,0,0.12)', padding: '5px 10px', borderRadius: '10px', whiteSpace: 'nowrap'
              }}>
                ~{activeBooking.fareCalc.durationMin} Menit
              </span>
            </div>
          </div>
          <MapViewComponent height={isMobile ? '260px' : '360px'} showNearbyDrivers={true} />
        </div>

        {/* ══ SERVICES ══ */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', margin: '0 0 8px' }}>
              Layanan Mobilitas Komunitas
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #64748b)', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6 }}>
              Empat layanan MVP siap pakai, terintegrasi dengan ekosistem BaMbooChain.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px'
          }}>
            {services.map((svc) => (
              <div key={svc.type} style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '20px', padding: isMobile ? '16px' : '22px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                border: `1.5px solid ${svc.accent}`,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '14px',
                    background: svc.bg, color: svc.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '10px'
                  }}>
                    {svc.icon}
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: '0 0 4px', color: 'var(--text-main, #0f172a)' }}>
                    {svc.label}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', lineHeight: '1.5', margin: 0 }}>
                    {svc.sub}
                  </p>
                </div>
                <button
                  className="boom-svc-btn"
                  onClick={() => { setServiceType(svc.type); navigate('/boomboom/book'); }}
                  style={{
                    background: svc.btnBg, color: svc.btnColor,
                    border: 'none', padding: '9px 12px', borderRadius: '10px',
                    fontWeight: '800', fontSize: '0.78rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'all 0.15s', width: '100%'
                  }}>
                  <span>{svc.btnText}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Future Modules */}
          <div style={{
            marginTop: '20px', background: 'var(--bg-secondary, #f8fafc)',
            borderRadius: '20px', padding: '16px 20px',
            border: '1px solid var(--border-color, #e2e8f0)'
          }}>
            <div style={{
              fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted, #94a3b8)',
              textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px'
            }}>
              Modul Masa Depan (Terkunci)
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '8px'
            }}>
              {futureMods.map((m, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  fontSize: '0.82rem', fontWeight: '700',
                  color: 'var(--text-muted, #64748b)', opacity: 0.85
                }}>
                  {m.icon} {m.label}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BoomBoomPage;
