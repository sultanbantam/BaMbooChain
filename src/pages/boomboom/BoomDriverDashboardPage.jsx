import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  subscribeIncomingOrders, 
  acceptPilotOrderInFirestore, 
  updatePilotTripStep, 
  playOrderNotificationSound, 
  openNgopiChat, 
  openWhatsAppDispatch,
  updateDriverLiveLocationInFirestore
} from '../../services/boomboom/boomboomPilotService';
import { MessageSquare, PhoneCall, ExternalLink, Power, MapPin, ShieldCheck, ShoppingBag } from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import MapViewComponent from '../../components/boomboom/MapViewComponent';
import SosButton from '../../components/boomboom/SosButton';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';
import { useAuth } from '../../context/AuthContext';

const BoomDriverDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { driverState, drivers, activeBooking, featureFlags, pairOrderByInstantCode, optInDriverKodiba } = useBoomBoomStore();
  const [isOnline, setIsOnline] = useState(driverState.isOnline);
  const [gpsStatus, setGpsStatus] = useState('Siap Memancarkan Koordinat GPS');
  const [instantCodeInput, setInstantCodeInput] = useState('');
  const [instantPairingLoading, setInstantPairingLoading] = useState(false);
  const [instantError, setInstantError] = useState('');
  const [instantSuccessMsg, setInstantSuccessMsg] = useState('');

  // Cari profil driver milik user yang sedang login, atau gunakan driver utama Cibarani
  const currentDriverProfile = drivers.find(
    (d) => (user?.uid && d.user_id === user.uid) || (user?.email && d.email === user.email)
  ) || drivers[0] || {
    driver_id: 'DRV-001',
    name: 'Asep Saepulloh',
    phone: '+62 812-3456-7890',
    ngopi_username: '@majelisngopi',
    ngopi_chat_url: 'https://ngopi.top/chat/f1c8c427-21bf-4fc1-8e99-9e651114d615?name=Ade%20Gunawan',
    plate_number: 'D 4892 BB',
    vehicle_brand: 'Honda Vario 160 EV',
    operating_region: 'Subang / Cibarani',
    status: 'VERIFIED',
    rating: 4.9
  };

  const [incomingOrder, setIncomingOrder] = useState({
    id: 'ORDER-771',
    passengerName: 'Neng Ani',
    pickup: 'Stasiun Kereta Cisadane',
    destination: 'Kawasan Wisata Hutan Bambu',
    distanceKm: 7.8,
    estFare: 28000,
    driverEarnings: 23800,
    serviceType: 'BoomCar'
  });

  const [activeJob, setActiveJob] = useState(null);
  const [jobStep, setJobStep] = useState('ASSIGNED'); // ASSIGNED | ARRIVED | ON_TRIP
  const [showBmcCalcModal, setShowBmcCalcModal] = useState(false);

  // Tahap II Live GPS Heartbeat saat pengemudi ONLINE (SIAP NARIK)
  useEffect(() => {
    if (!isOnline) {
      setGpsStatus('Offline — Pemancar GPS Nonaktif');
      updateDriverLiveLocationInFirestore(currentDriverProfile.driver_id, -6.6521, 107.6932, false);
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setGpsStatus(`GPS Live Aktif (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          updateDriverLiveLocationInFirestore(currentDriverProfile.driver_id, latitude, longitude, true);
        },
        () => {
          setGpsStatus('GPS Live Aktif (Zona Pilot Cibarani)');
          updateDriverLiveLocationInFirestore(currentDriverProfile.driver_id, -6.6521, 107.6932, true);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, [isOnline, currentDriverProfile.driver_id]);

  // Dengarkan pesanan masuk secara real-time dari Firestore saat driver ONLINE
  useEffect(() => {
    if (!isOnline) return;

    const unsub = subscribeIncomingOrders((orders) => {
      if (orders && orders.length > 0 && !activeJob) {
        const latest = orders[0];
        playOrderNotificationSound();
        setIncomingOrder({
          id: latest.trip_id || latest.id,
          trip_id: latest.trip_id || latest.id,
          passengerName: latest.passenger_name || 'Warga Cibarani',
          passengerPhone: latest.passenger_phone || '',
          pickup: latest.pickup_address || 'Sentra Bibit Bambu Cibarani',
          destination: latest.destination_address || 'Pasar Desa Cibarani, Subang',
          distanceKm: latest.distance_km || 4.5,
          estFare: latest.fare || 18650,
          driverEarnings: Math.round((latest.fare || 18650) * 0.85),
          serviceType: latest.service_type || 'BoomRide',
          paymentMethod: latest.payment_method || 'QRIS / Tunai',
          isRealFirestore: true,
          rawOrder: latest
        });
      }
    });

    return () => unsub && unsub();
  }, [isOnline, activeJob]);

  const handleAcceptOrder = async () => {
    if (incomingOrder?.isRealFirestore && incomingOrder?.trip_id) {
      try {
        await acceptPilotOrderInFirestore(incomingOrder.trip_id, currentDriverProfile);
      } catch (err) {
        console.warn('Gagal konfirmasi order driver di Firestore:', err);
      }
    }
    setActiveJob(incomingOrder);
    setJobStep('ASSIGNED');
    setIncomingOrder(null);
  };

  const handleRejectOrder = () => {
    setIncomingOrder(null);
  };

  // Handler Sistem Gojek Instan: Driver memasukkan kode 6-digit dari Pemesan
  const handlePairByInstantCode = async (e) => {
    if (e) e.preventDefault();
    setInstantError('');
    setInstantSuccessMsg('');
    setInstantPairingLoading(true);
    try {
      const matchedJob = await pairOrderByInstantCode(instantCodeInput, currentDriverProfile);
      playOrderNotificationSound();
      setActiveJob(matchedJob);
      setJobStep('ON_TRIP');
      setIncomingOrder(null);
      setInstantSuccessMsg(`Berhasil! Kode Langsung [${matchedJob.instantCode}] milik ${matchedJob.passengerName} terhubung. Perjalanan dimulai!`);
      setInstantCodeInput('');
    } catch (err) {
      setInstantError(err.message || 'Kode Langsung tidak ditemukan.');
    } finally {
      setInstantPairingLoading(false);
    }
  };

  const handleDriverArrived = async () => {
    setJobStep('ARRIVED');
    if (activeJob?.trip_id) {
      await updatePilotTripStep(activeJob.trip_id, 'DRIVER_ARRIVED');
    }
  };

  const handleStartTrip = async () => {
    setJobStep('ON_TRIP');
    if (activeJob?.trip_id) {
      await updatePilotTripStep(activeJob.trip_id, 'ON_TRIP');
    }
  };

  const handleCompleteTrip = async () => {
    if (activeJob?.trip_id) {
      await updatePilotTripStep(activeJob.trip_id, 'COMPLETED');
    }
    setActiveJob(null);
    setJobStep('ASSIGNED');
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '800', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', color: '#a7f3d0' }}>
                STATUS: {currentDriverProfile.status || 'VERIFIED'}
              </span>
              <span style={{ fontSize: '0.78rem', fontWeight: '800', background: '#f59f00', color: '#000', padding: '4px 10px', borderRadius: '12px' }}>
                ⭐ {currentDriverProfile.rating || driverState.rating}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', background: '#451a03', color: '#fef3c7', padding: '4px 10px', borderRadius: '12px' }}>
                ☕ {currentDriverProfile.ngopi_username || '@majelisngopi'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0 0 4px' }}>
              Dasbor Pengemudi: {currentDriverProfile.name}
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#ecfdf5' }}>
              Kendaraan: {currentDriverProfile.vehicle_brand} ({currentDriverProfile.plate_number}) • {gpsStatus}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <SosButton />
            <button
              id="btn-driver-online-status"
              onClick={() => setIsOnline(!isOnline)}
              title="Ketuk untuk mengubah status Online / Offline"
              style={{
                background: isOnline ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#475569',
                color: '#ffffff',
                border: '2px solid rgba(255,255,255,0.6)',
                padding: '10px 22px',
                borderRadius: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: isOnline ? '0 0 18px rgba(16, 185, 129, 0.6)' : 'none',
                textAlign: 'left'
              }}
            >
              <Power size={20} color="#ffffff" style={{ flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '900', letterSpacing: '0.5px' }}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
                {isOnline && (
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.95, letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
                    (SIAP NARIK)
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* REKENING HASIL & WALLET PAYOUT CARD (Point 6) */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '24px',
          padding: '22px',
          border: '1.5px solid var(--border-color, #cbd5e1)',
          boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <Wallet size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  Rekening Hasil & Dompet Payout Driver
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', margin: 0 }}>
                  Penarikan bagi hasil perjalanan (Rupiah, BMC Token & USDT) otomatis tersinkronisasi.
                </p>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'rgba(16, 185, 129, 0.12)', color: '#047857', padding: '5px 12px', borderRadius: '10px' }}>
              ✓ Rekening Terverifikasi
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
            {/* Rekening Bank / E-Wallet */}
            <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #e2e8f0)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#047857', marginBottom: '4px' }}>
                1. REKENING BANK / E-WALLET (RUPIAH)
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: '900', color: 'var(--text-main, #0f172a)', marginBottom: '4px' }}>
                {currentDriverProfile.bank_account || (typeof window !== 'undefined' && localStorage.getItem('boomboom_driver_bank_account')) || 'Bank Mandiri 130009827162 (a.n. ' + currentDriverProfile.name + ')'}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748b)' }}>
                Tujuan transfer otomatis 85% bagi hasil tarif Rupiah harian.
              </div>
            </div>

            {/* Wallet BMC */}
            <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #e2e8f0)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#059669' }}>
                  2. NOMOR WALLET BMC (BaMbooChain)
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: '800', background: 'rgba(16, 185, 129, 0.15)', color: '#047857', padding: '2px 6px', borderRadius: '6px' }}>
                  Saldo: {user?.bmcBalance || 14.5} BMC
                </span>
              </div>
              <div style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', wordBreak: 'break-all', marginBottom: '4px' }}>
                {currentDriverProfile.wallet_bmc || (typeof window !== 'undefined' && localStorage.getItem('boomboom_driver_wallet_bmc')) || user?.walletAddress || '0xbmc71a9e8b2f4c0d1e5a8726b91cibarani'}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748b)' }}>
                Tampungan insentif & reward per km mobilitas hijau BaMbooChain.
              </div>
            </div>

            {/* Wallet USDT */}
            <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #e2e8f0)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0284c7', marginBottom: '4px' }}>
                3. NOMOR WALLET USDT (POLYGON / BEP-20)
              </div>
              <div style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', wordBreak: 'break-all', marginBottom: '4px' }}>
                {currentDriverProfile.wallet_usdt || (typeof window !== 'undefined' && localStorage.getItem('boomboom_driver_wallet_usdt')) || user?.usdtWallet || '0x99b4f2c8d17a0e5b38291f0c2a7e4d82polygon'}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748b)' }}>
                Tampungan pembayaran kripto USDT Web3 dari penumpang.
              </div>
            </div>
          </div>
        </div>

        {/* TODAY'S PERFORMANCE GRID - HIGH CONTRAST */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{ background: 'var(--bg-card, #ffffff)', borderRadius: '20px', padding: '20px', border: '1.5px solid var(--border-color, #cbd5e1)', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted, #475569)', marginBottom: '6px', letterSpacing: '0.3px' }}>PENDAPATAN HARI INI</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#10b981' }}>
              Rp {driverState.todayEarnings.toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#34d399', marginTop: '6px' }}>+85% Bagi hasil pengemudi</div>
          </div>

          <div style={{ background: 'var(--bg-card, #ffffff)', borderRadius: '20px', padding: '20px', border: '1.5px solid var(--border-color, #cbd5e1)', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted, #475569)', marginBottom: '6px', letterSpacing: '0.3px' }}>TOTAL TRIP HARI INI</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main, #0f172a)' }}>
              {driverState.todayTrips} Trip
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted, #64748b)', marginTop: '6px' }}>Perjalanan selesai</div>
          </div>

          <div style={{ background: 'var(--bg-card, #ffffff)', borderRadius: '20px', padding: '20px', border: '1.5px solid var(--border-color, #cbd5e1)', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted, #475569)', marginBottom: '6px', letterSpacing: '0.3px' }}>DURASI ONLINE</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#f59f00' }}>
              {driverState.onlineHours} Jam
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted, #64748b)', marginTop: '6px' }}>Aktif menerima trip</div>
          </div>

          <div style={{ background: 'var(--bg-card, #ffffff)', borderRadius: '20px', padding: '20px', border: '1.5px solid var(--border-color, #cbd5e1)', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted, #475569)', marginBottom: '6px', letterSpacing: '0.3px' }}>REWARD BMC DRIVER</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fbbf24' }}>
              +14.5 BMC
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fbbf24', marginTop: '6px' }}>Insentif kontribusi aktif</div>
          </div>
        </div>

        {/* ══ SISTEM BOOM-INSTAN (ALA GOJEK INSTAN: INPUT KODE DARI PEMESAN) ══ */}
        {featureFlags.ENABLE_BOOM_INSTANT_CODE !== false && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '24px',
            border: '2px solid #10b981',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.14)',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: '#10b981',
                  color: '#ffffff',
                  fontWeight: '900',
                  fontSize: '0.75rem',
                  padding: '4px 10px',
                  borderRadius: '10px'
                }}>
                  ⚡ SISTEM BOOM LANGSUNG
                </span>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '900', margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  Masukkan Kode Langsung dari Pemesan
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setInstantCodeInput(activeBooking.instantCode || '482915')}
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#047857',
                  border: '1px solid #10b981',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Isi Kode Aktif Pemesan ({activeBooking.instantCode || '482915'})
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)', margin: '0 0 16px', lineHeight: 1.5 }}>
              Jika penumpang sudah berada di depan Anda, minta <strong>6-Digit Kode Boom Langsung</strong> dari layar HP pemesan, masukkan di bawah ini, dan perjalanan langsung dimulai!
            </p>

            <form onSubmit={handlePairByInstantCode} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                maxLength={8}
                value={instantCodeInput}
                onChange={(e) => setInstantCodeInput(e.target.value)}
                placeholder="Ketik 6-Digit Kode Pemesan (Misal: 482915)"
                style={{
                  flex: '1 1 240px',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  border: '2px solid var(--border-color, #cbd5e1)',
                  background: 'var(--bg-secondary, #f8fafc)',
                  color: 'var(--text-main, #0f172a)',
                  fontSize: '1.15rem',
                  fontWeight: '900',
                  letterSpacing: '3px',
                  fontFamily: 'monospace'
                }}
              />
              <button
                type="submit"
                disabled={instantPairingLoading || !instantCodeInput.trim()}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: '16px',
                  fontWeight: '900',
                  fontSize: '0.92rem',
                  cursor: instantPairingLoading || !instantCodeInput.trim() ? 'not-allowed' : 'pointer',
                  boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {instantPairingLoading ? 'Mencocokkan Kode...' : '🔑 HUBUNGKAN KODE & MULAI JALAN'}
              </button>
            </form>

            {instantError && (
              <div style={{ marginTop: '12px', background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '800' }}>
                ⚠️ {instantError}
              </div>
            )}

            {instantSuccessMsg && (
              <div style={{ marginTop: '12px', background: '#d1fae5', color: '#065f46', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '800' }}>
                ✅ {instantSuccessMsg}
              </div>
            )}
          </div>
        )}

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#92400e', background: '#fef08a', padding: '4px 12px', borderRadius: '12px' }}>
                ⚡ ORDER MASUK
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#047857' }}>
                Pendapatan Bersih (85%): Rp {incomingOrder.driverEarnings.toLocaleString('id-ID')}
              </span>
            </div>

            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Penumpang: {incomingOrder.passengerName} ({incomingOrder.serviceType})
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px', fontSize: '0.85rem', color: '#475569' }}>
              <div>📍 <strong>Jemput:</strong> {incomingOrder.pickup}</div>
              <div>🏁 <strong>Tujuan:</strong> {incomingOrder.destination} ({incomingOrder.distanceKm} km)</div>
            </div>

            {/* Quick Dispatch Chat Options for Driver */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => openNgopiChat(incomingOrder.rawOrder || incomingOrder, incomingOrder.passengerUsername || incomingOrder.passengerName)}
                style={{
                  background: '#451a03',
                  color: '#fef3c7',
                  border: 'none',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>☕</span> Buka Obrolan ngopi.top <ExternalLink size={14} />
              </button>

              <button
                type="button"
                onClick={() => openWhatsAppDispatch(incomingOrder.rawOrder || incomingOrder, incomingOrder.passengerPhone)}
                style={{
                  background: '#128c7e',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <MessageSquare size={15} /> Chat via WA <ExternalLink size={14} />
              </button>
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 16px', color: 'var(--text-main, #0f172a)' }}>
            Navigasi Layar Pengemudi & Peta
          </h2>
          <MapViewComponent height="380px" showNearbyDrivers={isOnline} />

          {activeJob && (
            <div style={{ marginTop: '20px', background: '#f0fdf4', borderRadius: '24px', padding: '22px', border: '2px solid #10b981', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', background: '#10b981', color: '#ffffff', padding: '3px 10px', borderRadius: '10px' }}>
                  TRIP AKTIF #{activeJob.trip_id || activeJob.id}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#047857' }}>
                  Pendapatan Driver: Rp {activeJob.driverEarnings.toLocaleString('id-ID')}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#065f46', margin: '0 0 4px' }}>
                Penumpang: {activeJob.passengerName} ({activeJob.serviceType})
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#047857', marginBottom: '14px' }}>
                Jemput: <strong>{activeJob.pickup}</strong> ➔ Antar: <strong>{activeJob.destination}</strong>
              </p>

              {/* Chat & Call links */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={() => openNgopiChat(activeJob.rawOrder || activeJob, activeJob.passengerUsername || activeJob.passengerName)}
                  style={{
                    background: '#451a03',
                    color: '#fef3c7',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <span>☕</span> Koordinasi ngopi.top
                </button>

                <button
                  type="button"
                  onClick={() => openWhatsAppDispatch(activeJob.rawOrder || activeJob, activeJob.passengerPhone)}
                  style={{
                    background: '#128c7e',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <MessageSquare size={13} /> Chat WhatsApp
                </button>

                <a
                  href={`tel:${activeJob.passengerPhone || '081234567890'}`}
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#047857',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <PhoneCall size={13} /> Telepon
                </a>
              </div>

              {/* Step Progression Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {jobStep === 'ASSIGNED' && (
                  <button
                    onClick={handleDriverArrived}
                    style={{
                      flex: 1,
                      background: '#059669',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    📍 Saya Sudah Tiba di Titik Jemput
                  </button>
                )}

                {jobStep === 'ARRIVED' && (
                  <button
                    onClick={handleStartTrip}
                    style={{
                      flex: 1,
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    🚀 Mulai Perjalanan Bersama Penumpang
                  </button>
                )}

                {jobStep === 'ON_TRIP' && (
                  <button
                    onClick={handleCompleteTrip}
                    style={{
                      flex: 1,
                      background: '#047857',
                      color: 'white',
                      border: 'none',
                      padding: '14px 20px',
                      borderRadius: '14px',
                      fontWeight: '900',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      boxShadow: '0 6px 16px rgba(4, 120, 87, 0.35)'
                    }}
                  >
                    ✅ Selesaikan Perjalanan & Konfirmasi Pembayaran Rp {activeJob.estFare.toLocaleString('id-ID')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* TAHAP III: INTEGRASI EKOSISTEM KODIBA (SUKARELA) & BAMBOOCHAIN MARKETPLACE */}
        <div style={{
          marginTop: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {/* KARTU 1: KEANGGOTAAN SUKARELA KODIBA (KOPERASI DIGITAL BAMBU) */}
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '22px',
            padding: '22px',
            border: '1px solid var(--border-color, #e2e8f0)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#059669', background: '#d1fae5', padding: '4px 10px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={14} /> INTEGRASI KODIBA
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  color: currentDriverProfile.kodiba_member ? '#047857' : '#d97706'
                }}>
                  {currentDriverProfile.kodiba_member ? `✓ Anggota Aktif (${currentDriverProfile.kodiba_member_id || 'KODIBA 10011126'})` : 'Opsional / Sukarela'}
                </span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0 0 6px', color: 'var(--text-main, #0f172a)' }}>
                Koperasi Digital Bambu (KODIBA)
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.5, margin: '0 0 14px' }}>
                Keanggotaan KODIBA bersifat <strong>sukarela & transparan</strong> (tanpa potongan otomatis dari tarif perjalanan). Anggota berhak mengakses program pembiayaan konversi motor listrik (EV), tabungan SHU, dan pelatihan keselamatan komunitas.
              </p>
            </div>

            {currentDriverProfile.kodiba_member ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800', color: '#047857' }}>
                  ID Koperasi: <code>{currentDriverProfile.kodiba_member_id || 'KODIBA 10011126'}</code>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/kodiba')}
                  style={{
                    background: '#064e3b',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  Buka Portal KODIBA
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => optInDriverKodiba(currentDriverProfile.driver_id, currentDriverProfile.name)}
                style={{
                  background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                🤝 Setuju Bergabung Sukarela sebagai Anggota KODIBA
              </button>
            )}
          </div>

          {/* KARTU 2: INTEGRASI BAMBOOCHAIN MARKETPLACE */}
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '22px',
            padding: '22px',
            border: '1px solid var(--border-color, #e2e8f0)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#b45309', background: '#fef3c7', padding: '4px 10px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <ShoppingBag size={14} /> EKOSISTEM MARKETPLACE DESA
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted, #64748b)' }}>
                  Tukar BMC / Rupiah
                </span>
              </div>
              <h4 style={{ fontSize: '1.02rem', fontWeight: '800', margin: '0 0 6px', color: 'var(--text-main, #0f172a)', lineHeight: 1.35, wordBreak: 'break-word' }}>
                Perlengkapan Mitra & Produk Lokal BaMbooChain
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.5, margin: '0 0 14px' }}>
                Dapatkan helm standar SNI komunitas, jaket reflektif BoomBoom, paket perawatan baterai EV, serta dukung pemasaran produk kerajinan & bibit bambu desa mitra.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => navigate('/marketplace')}
                style={{
                  flex: 1,
                  background: '#f59f00',
                  color: '#000000',
                  border: 'none',
                  padding: '11px 16px',
                  borderRadius: '12px',
                  fontWeight: '900',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                🛒 Kunjungi Marketplace BaMbooChain
              </button>
              <button
                type="button"
                onClick={() => setShowBmcCalcModal(true)}
                style={{
                  background: 'var(--bg-secondary, #f1f5f9)',
                  color: 'var(--text-main, #334155)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Cek Saldo BMC
              </button>
            </div>
          </div>
        </div>

        {/* MODAL PENJELASAN PERHITUNGAN REWARD & SALDO BMC */}
        {showBmcCalcModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}>
            <div style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: '24px',
              padding: '26px',
              maxWidth: '500px',
              width: '100%',
              border: '2px solid #10b981',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#047857', margin: 0 }}>
                  💎 Transparansi Perhitungan Saldo & Reward BMC
                </h3>
                <button
                  type="button"
                  onClick={() => setShowBmcCalcModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ fontSize: '0.83rem', color: 'var(--text-main, #0f172a)', lineHeight: 1.6, marginBottom: '16px' }}>
                <p style={{ margin: '0 0 10px' }}>
                  Reward BMC diberikan secara transparan kepada mitra pengemudi dan pemesan yang telah diverifikasi di backend BaMbooChain:
                </p>
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--border-color, #e2e8f0)', marginBottom: '10px' }}>
                  <div style={{ fontWeight: '800', color: '#047857', marginBottom: '4px' }}>🛵 Reward Mitra Pengemudi:</div>
                  <div>• <strong>1.0 BMC</strong> per perjalanan selesai</div>
                  <div>• <strong>+0.25 BMC / km</strong> jarak tempuh nyata</div>
                  <div>• <strong>+0.50 BMC</strong> bonus armada ramah lingkungan (Motor Listrik / EV)</div>
                  <div>• <strong>+0.25 BMC</strong> rating bintang 5 dari pemesan</div>
                </div>

                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <div style={{ fontWeight: '800', color: '#b45309', marginBottom: '4px' }}>👤 Reward Pemesan (Penumpang):</div>
                  <div>• <strong>0.50 BMC</strong> bonus loyalitas dasar</div>
                  <div>• <strong>+0.10 BMC / km</strong> cashback mobilitas hijau</div>
                  <div>• <strong>+0.25 BMC</strong> bonus perjalanan EV</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowBmcCalcModal(false);
                    navigate('/bamboochain/token-wallet');
                  }}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '14px',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Buka Token Wallet (Saldo Riil)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBmcCalcModal(false);
                    navigate('/boomboom/rewards');
                  }}
                  style={{
                    background: 'var(--bg-secondary, #f1f5f9)',
                    color: 'var(--text-main, #334155)',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Hub Reward
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BoomDriverDashboardPage;
