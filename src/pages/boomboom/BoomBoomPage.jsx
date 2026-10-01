import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Car, 
  Bike, 
  Clock, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  MapPin, 
  Award, 
  ArrowRight,
  Package,
  Compass,
  Home,
  HeartPulse
} from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import MapViewComponent from '../../components/boomboom/MapViewComponent';
import SosButton from '../../components/boomboom/SosButton';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

const BoomBoomPage = () => {
  const navigate = useNavigate();
  const { activeBooking, setServiceType, setPickup, setDestination } = useBoomBoomStore();

  const [pickupInput, setPickupInput] = useState(activeBooking.pickupAddress);
  const [destInput, setDestInput] = useState(activeBooking.destinationAddress);

  const handleQuickBook = (e) => {
    e.preventDefault();
    setPickup(pickupInput);
    setDestination(destInput);
    navigate('/boomboom/book');
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', paddingBottom: '60px' }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 20px' }}>
        
        {/* HERO BANNER & BOOKING CARD GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          
          {/* Left Column: Mobile-First Hero Card */}
          <div style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%)',
            color: 'white',
            padding: '32px',
            borderRadius: '28px',
            boxShadow: '0 15px 35px rgba(6, 78, 59, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              right: '-30px',
              bottom: '-30px',
              opacity: 0.08,
              pointerEvents: 'none'
            }}>
              <Car size={320} />
            </div>

            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#fef08a',
                marginBottom: '16px'
              }}>
                <Sparkles size={16} /> Modul Mobilitas Komunitas BaMbooChain
              </div>

              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                margin: '0 0 12px',
                lineHeight: '1.15',
                letterSpacing: '-0.5px'
              }}>
                BOOMBOOM
              </h1>
              
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#a7f3d0',
                marginBottom: '8px'
              }}>
                “Dari Desa, Menghubungkan Nusantara.”
              </div>

              <p style={{
                fontSize: '0.95rem',
                color: '#ecfdf5',
                lineHeight: '1.6',
                marginBottom: '24px',
                maxWidth: '480px'
              }}>
                Transportasi komunitas yang mudah, aman, transparan dan terhubung dengan ekosistem ekonomi hijau BaMbooChain.
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <SosButton />
              <Link
                to="/boomboom/safety"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '10px 18px',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ShieldCheck size={18} /> Panduan BoomSafe
              </Link>
            </div>
          </div>

          {/* Right Column: Primary Fast Booking Card */}
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '28px',
            padding: '28px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            border: '1px solid var(--border-color, #e2e8f0)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-main, #0f172a)' }}>
                Pesan Perjalanan
              </h2>
              <span style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '12px', fontWeight: '700' }}>
                Area Aktif Subang / Cibarani
              </span>
            </div>

            <form onSubmit={handleQuickBook} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Pickup Address Field */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  LOKASI JEMPUT
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '16px',
                  padding: '12px 14px'
                }}>
                  <MapPin size={20} color="#10b981" />
                  <input
                    type="text"
                    value={pickupInput}
                    onChange={(e) => setPickupInput(e.target.value)}
                    placeholder="Masukkan lokasi penjemputan..."
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      width: '100%',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#1e293b'
                    }}
                  />
                </div>
              </div>

              {/* Destination Address Field */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  LOKASI TUJUAN
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '16px',
                  padding: '12px 14px'
                }}>
                  <MapPin size={20} color="#ef4444" />
                  <input
                    type="text"
                    value={destInput}
                    onChange={(e) => setDestInput(e.target.value)}
                    placeholder="Masukkan tujuan perjalanan..."
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      width: '100%',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#1e293b'
                    }}
                  />
                </div>
              </div>

              {/* Service Selection Tabs */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                  PILIH LAYANAN
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setServiceType('BoomRide')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px',
                      borderRadius: '16px',
                      border: activeBooking.serviceType === 'BoomRide' ? '2px solid #10b981' : '1px solid #e2e8f0',
                      background: activeBooking.serviceType === 'BoomRide' ? '#f0fdf4' : '#ffffff',
                      color: activeBooking.serviceType === 'BoomRide' ? '#065f46' : '#475569',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    <Bike size={22} color={activeBooking.serviceType === 'BoomRide' ? '#10b981' : '#64748b'} />
                    <div style={{ textAlign: 'left' }}>
                      <div>BoomRide</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 'normal', color: '#64748b' }}>Motor Desa</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('BoomCar')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px',
                      borderRadius: '16px',
                      border: activeBooking.serviceType === 'BoomCar' ? '2px solid #10b981' : '1px solid #e2e8f0',
                      background: activeBooking.serviceType === 'BoomCar' ? '#f0fdf4' : '#ffffff',
                      color: activeBooking.serviceType === 'BoomCar' ? '#065f46' : '#475569',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    <Car size={22} color={activeBooking.serviceType === 'BoomCar' ? '#10b981' : '#64748b'} />
                    <div style={{ textAlign: 'left' }}>
                      <div>BoomCar</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 'normal', color: '#64748b' }}>Mobil Nyaman</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginTop: '8px' }}>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '16px',
                    fontWeight: '800',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  PESAN SEKARANG <ArrowRight size={18} />
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setServiceType('BoomSchedule');
                    navigate('/boomboom/book');
                  }}
                  style={{
                    background: '#f8fafc',
                    color: '#0f172a',
                    border: '1.5px solid #cbd5e1',
                    padding: '14px',
                    borderRadius: '16px',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Clock size={16} /> JADWALKAN
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* MAP PREVIEW & LIVE DRIVER TICKER */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '28px',
          padding: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          border: '1px solid var(--border-color, #e2e8f0)',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 4px', color: 'var(--text-main, #0f172a)' }}>
                Peta Geospasial Sekitar
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Visualisasi pengemudi lokal terverifikasi dan zona operasional mitra.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#047857', background: '#ecfdf5', padding: '6px 12px', borderRadius: '12px' }}>
                Est. Fares: ~{activeBooking.fareCalc.formatted.grossFare}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#b45309', background: '#fffbeb', padding: '6px 12px', borderRadius: '12px' }}>
                Est. Waktu: ~{activeBooking.fareCalc.durationMin} Menit
              </span>
            </div>
          </div>

          <MapViewComponent height="360px" showNearbyDrivers={true} />
        </div>

        {/* CORE SERVICES CAROUSEL & FUTURE MODULES ARCHITECTURE */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', margin: '0 0 8px' }}>
              Layanan Mobilitas Komunitas
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              Empat layanan utama MVP siap pakai dan modul masa depan yang terintegrasi secara arsitektural.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {/* MVP 1: BoomRide */}
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
              border: '1.5px solid #10b981',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  background: '#d1fae5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Bike size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 6px', color: '#0f172a' }}>BoomRide</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                  Layanan ojek motor cepat untuk wilayah perdesaan dan antardesa.
                </p>
              </div>
              <button
                onClick={() => { setServiceType('BoomRide'); navigate('/boomboom/book'); }}
                style={{
                  marginTop: '16px',
                  background: '#ecfdf5',
                  color: '#047857',
                  border: 'none',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                Pesan BoomRide <ChevronRight size={16} />
              </button>
            </div>

            {/* MVP 2: BoomCar */}
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
              border: '1.5px solid #10b981',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  background: '#d1fae5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Car size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 6px', color: '#0f172a' }}>BoomCar</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                  Transportasi mobil untuk rombongan keluarga atau barang komoditas.
                </p>
              </div>
              <button
                onClick={() => { setServiceType('BoomCar'); navigate('/boomboom/book'); }}
                style={{
                  marginTop: '16px',
                  background: '#ecfdf5',
                  color: '#047857',
                  border: 'none',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                Pesan BoomCar <ChevronRight size={16} />
              </button>
            </div>

            {/* MVP 3: BoomSchedule */}
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
              border: '1.5px solid #f59f00',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  background: '#fef3c7',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Clock size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 6px', color: '#0f172a' }}>BoomSchedule</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                  Pesan perjalanan terjadwal untuk pasar, stasiun, atau kegiatan rutin.
                </p>
              </div>
              <button
                onClick={() => { setServiceType('BoomSchedule'); navigate('/boomboom/book'); }}
                style={{
                  marginTop: '16px',
                  background: '#fffbeb',
                  color: '#b45309',
                  border: 'none',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                Buat Jadwal <ChevronRight size={16} />
              </button>
            </div>

            {/* MVP 4: BoomTogether */}
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
              border: '1.5px solid #06b6d4',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  background: '#cff4fc',
                  color: '#0891b2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Users size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 6px', color: '#0f172a' }}>BoomTogether</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                  Tumpangan bersama komunitas hemat ongkos & kurangi emisi karbon.
                </p>
              </div>
              <button
                onClick={() => { setServiceType('BoomTogether'); navigate('/boomboom/book'); }}
                style={{
                  marginTop: '16px',
                  background: '#ecfeff',
                  color: '#0891b2',
                  border: 'none',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                Pesan Tebangan <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Future Modules Preview */}
          <div style={{
            marginTop: '28px',
            background: '#f8fafc',
            borderRadius: '24px',
            padding: '20px 24px',
            border: '1px stroke #e2e8f0'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              MODUL MASA DEPAN TERKUNCI (FEATURE FLAG ARCHITECTURE)
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.65, fontSize: '0.85rem', fontWeight: '700' }}>
                <Package size={16} /> BoomSend (Pengiriman)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.65, fontSize: '0.85rem', fontWeight: '700' }}>
                <Compass size={16} /> BoomTour (Wisata Bambu)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.65, fontSize: '0.85rem', fontWeight: '700' }}>
                <Home size={16} /> BoomVillage (Ekonomi Desa)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.65, fontSize: '0.85rem', fontWeight: '700' }}>
                <HeartPulse size={16} /> BoomCare (Layanan Kesehatan)
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BoomBoomPage;
