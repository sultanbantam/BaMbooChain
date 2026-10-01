import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, 
  DollarSign, 
  Clock, 
  Star, 
  Award, 
  Power, 
  MapPin, 
  Navigation, 
  Check, 
  X, 
  AlertTriangle,
  History,
  Wallet,
  ShieldCheck
} from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import MapViewComponent from '../../components/boomboom/MapViewComponent';
import SosButton from '../../components/boomboom/SosButton';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

const BoomDriverDashboardPage = () => {
  const navigate = useNavigate();
  const { driverState, trips } = useBoomBoomStore();
  const [isOnline, setIsOnline] = useState(driverState.isOnline);
  const [incomingOrder, setIncomingOrder] = useState({
    id: 'ORDER-771',
    passengerName: 'Neng Ani',
    pickup: 'Stasiun Kereta Cisadane',
    destination: 'Kawasan Wisata Hutan Bambu',
    distanceKm: 7.8,
    estFare: 28000,
    driverEarnings: 23800, // 85%
    serviceType: 'BoomCar'
  });

  const [activeJob, setActiveJob] = useState(null);

  const handleAcceptOrder = () => {
    setActiveJob(incomingOrder);
    setIncomingOrder(null);
  };

  const handleRejectOrder = () => {
    setIncomingOrder(null);
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', paddingBottom: '60px' }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '1100px', margin: '24px auto', padding: '0 20px' }}>
        
        {/* DRIVER STATS & ONLINE TOGGLE HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: 'white',
          borderRadius: '28px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 12px 30px rgba(6, 78, 59, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', color: '#a7f3d0' }}>
                MITRA PENGEMUDI TERVERIFIKASI
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', background: '#f59f00', color: '#000', padding: '4px 10px', borderRadius: '12px' }}>
                ⭐ {driverState.rating}
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0 0 4px' }}>
              Dasbor Pengemudi: Asep Saepulloh
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#ecfdf5' }}>
              Kendaraan: Honda Vario 160 EV (D 4892 BB) • Wilayah Subang / Cibarani
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <SosButton />
            <button
              onClick={() => setIsOnline(!isOnline)}
              style={{
                background: isOnline ? '#10b981' : '#64748b',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.4)',
                padding: '12px 24px',
                borderRadius: '20px',
                fontWeight: '900',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isOnline ? '0 0 15px rgba(16, 185, 129, 0.5)' : 'none'
              }}
            >
              <Power size={18} /> {isOnline ? 'ONLINE (SIAP NARI)' : 'OFFLINE'}
            </button>
          </div>
        </div>

        {/* TODAY'S PERFORMANCE GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>PENDAPATAN HARI INI</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#047857' }}>
              Rp {driverState.todayEarnings.toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>+85% Bagi hasil pengemudi</div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>TOTAL TRIP HARI INI</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>
              {driverState.todayTrips} Trip
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Perjalanan selesai</div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>DURASI ONLINE</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#b45309' }}>
              {driverState.onlineHours} Jam
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Aktif menerima trip</div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>REWARD BMC DRIVER</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#d97706' }}>
              +14.5 BMC
            </div>
            <div style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '4px' }}>Insentif kontribusi aktif</div>
          </div>
        </div>

        {/* INCOMING ORDER NOTIFICATION POPUP SIMULATION */}
        {isOnline && incomingOrder && !activeJob && (
          <div style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            borderRadius: '24px',
            padding: '24px',
            border: '2px solid #f59f00',
            boxShadow: '0 10px 30px rgba(245, 159, 0, 0.25)',
            marginBottom: '28px',
            animation: 'pulse 2s infinite'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#92400e', background: '#fef08a', padding: '4px 12px', borderRadius: '12px' }}>
                ⚡ ORDER MASUK (TAWARAN TRIP TERDEKAT)
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#047857' }}>
                Pendapatan Bersih: Rp {incomingOrder.driverEarnings.toLocaleString('id-ID')}
              </span>
            </div>

            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Penumpang: {incomingOrder.passengerName} ({incomingOrder.serviceType})
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px', fontSize: '0.85rem', color: '#475569' }}>
              <div>📍 <strong>Jemput:</strong> {incomingOrder.pickup}</div>
              <div>🏁 <strong>Tujuan:</strong> {incomingOrder.destination} ({incomingOrder.distanceKm} km)</div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleRejectOrder}
                style={{
                  flex: 1,
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '16px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                TOLAK ORDER
              </button>

              <button
                onClick={handleAcceptOrder}
                style={{
                  flex: 2,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '16px',
                  fontWeight: '900',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)'
                }}
              >
                TERIMA & JEMPUT SEKARANG
              </button>
            </div>
          </div>
        )}

        {/* MAP & ACTIVE JOB WORKSPACE */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '28px',
          padding: '24px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
          border: '1px solid var(--border-color, #e2e8f0)',
          marginBottom: '28px'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 16px', color: '#0f172a' }}>
            Navigasi Layar Pengemudi & Peta
          </h2>
          <MapViewComponent height="380px" showNearbyDrivers={isOnline} />

          {activeJob && (
            <div style={{ marginTop: '20px', background: '#f0fdf4', borderRadius: '20px', padding: '20px', border: '1.5px solid #10b981' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#065f46', margin: '0 0 8px' }}>
                Trip Sedang Berjalan: {activeJob.passengerName}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#047857', marginBottom: '16px' }}>
                Menuju: {activeJob.destination} • Tarif Bersih Pengemudi: Rp {activeJob.driverEarnings.toLocaleString('id-ID')}
              </p>
              <button
                onClick={() => setActiveJob(null)}
                style={{
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '14px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Selesaikan Perjalanan & Ambil Pembayaran
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BoomDriverDashboardPage;
