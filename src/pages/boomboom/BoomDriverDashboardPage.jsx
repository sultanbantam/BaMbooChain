import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  subscribeIncomingOrders, 
  acceptPilotOrderInFirestore, 
  updatePilotTripStep, 
  playOrderNotificationSound, 
  openNgopiChat, 
  updateDriverLiveLocationInFirestore,
  subscribeDriverStatsFromFirestore
} from '../../services/boomboom/boomboomPilotService';
import { PhoneCall, ExternalLink, Power, MapPin, ShieldCheck, ShoppingBag, Wallet } from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import MapViewComponent from '../../components/boomboom/MapViewComponent';
import SosButton from '../../components/boomboom/SosButton';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';
import { useAuth } from '../../context/AuthContext';

const BoomDriverDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    driverState,
    drivers,
    trips,
    activeBooking,
    featureFlags,
    recordDriverCompletedTrip,
    pairOrderByInstantCode,
    optInDriverKodiba
  } = useBoomBoomStore();
  const [isOnline, setIsOnline] = useState(driverState.isOnline);
  const [gpsStatus, setGpsStatus] = useState('Siap Memancarkan Koordinat GPS');
  const [instantCodeInput, setInstantCodeInput] = useState('');
  const [instantPairingLoading, setInstantPairingLoading] = useState(false);
  const [instantError, setInstantError] = useState('');
  const [instantSuccessMsg, setInstantSuccessMsg] = useState('');
  const [payoutViewFilter, setPayoutViewFilter] = useState('ALL');
  const [onlineMs, setOnlineMs] = useState(0);
  const [firestoreDriverTrips, setFirestoreDriverTrips] = useState([]);
  const [firestoreDriverRatings, setFirestoreDriverRatings] = useState([]);

  const savedDriverId = typeof window !== 'undefined' ? localStorage.getItem('boomboom_driver_id') : null;

  // Cari profil driver milik user yang sedang login dari Firestore/store
  const currentDriverProfile = drivers.find(
    (d) =>
      (user?.uid && d.user_id === user.uid) ||
      (user?.email && d.email === user.email) ||
      (savedDriverId && d.driver_id === savedDriverId)
  ) || drivers[0] || {
    driver_id: savedDriverId || user?.uid || 'DRV-001',
    name: user?.displayName || user?.name || 'Mitra Pengemudi',
    phone: user?.phone || '',
    ngopi_username: user?.ngopi_username || user?.ngopiUsername || (user?.username ? `@${user.username}` : ''),
    ngopi_chat_url: '',
    plate_number: '-',
    vehicle_brand: 'Kendaraan Mitra',
    operating_region: 'Zona Pilot',
    status: 'VERIFIED',
    rating: null
  };

  // Integrasi akun ngopi.top pengemudi (bukan statis)
  const rawNgopiUsername =
    currentDriverProfile.ngopi_username ||
    user?.ngopi_username ||
    user?.ngopiUsername ||
    (typeof window !== 'undefined' ? localStorage.getItem('boomboom_driver_ngopi_username') : '') ||
    (user?.username ? `@${user.username}` : '');
  const driverNgopiUsername = rawNgopiUsername
    ? (rawNgopiUsername.startsWith('@') ? rawNgopiUsername : `@${rawNgopiUsername}`)
    : '';
  const cleanNgopiHandle = driverNgopiUsername.replace(/^@/, '').replace(/[^a-zA-Z0-9._-]/g, '');
  const driverNgopiProfileUrl = currentDriverProfile.ngopi_chat_url || (cleanNgopiHandle ? `https://ngopi.top/@${encodeURIComponent(cleanNgopiHandle)}` : 'https://ngopi.top');

  useEffect(() => {
    if (!currentDriverProfile?.driver_id) return;
    const unsub = subscribeDriverStatsFromFirestore(
      currentDriverProfile.driver_id,
      (fsTrips) => setFirestoreDriverTrips(fsTrips || []),
      (fsRatings) => setFirestoreDriverRatings(fsRatings || [])
    );
    return () => unsub && unsub();
  }, [currentDriverProfile?.driver_id]);

  // Gabungkan trip dari store lokal dan Firestore (hindari duplikat trip_id)
  const mergedDriverTrips = React.useMemo(() => {
    const map = new Map();
    (trips || []).forEach((t) => {
      if (t.driver_id === currentDriverProfile.driver_id) {
        map.set(t.trip_id || t.id, t);
      }
    });
    (firestoreDriverTrips || []).forEach((t) => {
      map.set(t.trip_id || t.id, { ...map.get(t.trip_id || t.id), ...t });
    });
    return Array.from(map.values());
  }, [trips, firestoreDriverTrips, currentDriverProfile.driver_id]);

  // Integrasi nilai rating dari penilaian penumpang (store + Firestore boomboom_ratings)
  const localRatedValues = mergedDriverTrips
    .filter((t) => Number(t.rating_given) > 0)
    .map((t) => Number(t.rating_given));
  const fsRatedValues = (firestoreDriverRatings || [])
    .filter((r) => Number(r.rating) > 0)
    .map((r) => Number(r.rating));
  const allRatingValues = fsRatedValues.length > 0 ? fsRatedValues : localRatedValues;
  const integratedDriverRating = allRatingValues.length > 0
    ? (allRatingValues.reduce((sum, val) => sum + val, 0) / allRatingValues.length).toFixed(1)
    : (currentDriverProfile.rating != null ? Number(currentDriverProfile.rating).toFixed(1) : (driverState.rating != null ? Number(driverState.rating).toFixed(1) : 'Baru'));

  // Integrasi data real hari ini (Pendapatan, Total Trip, Reward Poin Ngopi)
  const todayDateStr = new Date().toDateString();
  const driverCompletedTrips = mergedDriverTrips.filter(
    (t) => t.trip_status === 'COMPLETED' || t.status === 'COMPLETED'
  );
  const todayCompletedTrips = driverCompletedTrips.filter((t) => {
    const dt = t.completed_at || t.created_at;
    return dt && new Date(dt).toDateString() === todayDateStr;
  });
  const realTodayTrips = todayCompletedTrips.length;
  const realTodayEarnings = todayCompletedTrips.reduce((sum, t) => {
    const share = t.splits?.driverShare ?? Math.round((Number(t.final_fare || t.estimated_fare || t.fare || 0)) * 0.85);
    return sum + share;
  }, 0);
  const baseNgopiPoints = Number(user?.ngopiPoints || user?.ngopi_points || currentDriverProfile.ngopi_points || 0);
  const tripNgopiPoints = driverCompletedTrips.reduce((sum, t) => {
    const pts = Number(t.ngopi_points_earned) || (10 + (Number(t.rating_given) >= 5 ? 5 : 0));
    return sum + pts;
  }, 0);
  const realNgopiPoints = baseNgopiPoints + tripNgopiPoints;

  // Pelacakan durasi online riil hari ini
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const todayKey = new Date().toISOString().slice(0, 10);
    const storageKey = `boomboom_driver_online_${todayKey}_${currentDriverProfile.driver_id}`;
    const readSaved = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : { accumulatedMs: 0, lastOnlineAt: null };
      } catch {
        return { accumulatedMs: 0, lastOnlineAt: null };
      }
    };
    const saveState = (data) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch {}
    };

    const current = readSaved();
    const now = Date.now();
    if (isOnline) {
      if (!current.lastOnlineAt) {
        current.lastOnlineAt = now;
        saveState(current);
      }
      setOnlineMs(current.accumulatedMs + Math.max(0, now - current.lastOnlineAt));
      const timer = setInterval(() => {
        const latest = readSaved();
        const elapsed = latest.lastOnlineAt ? Math.max(0, Date.now() - latest.lastOnlineAt) : 0;
        setOnlineMs(latest.accumulatedMs + elapsed);
      }, 30000);
      return () => clearInterval(timer);
    } else {
      if (current.lastOnlineAt) {
        const updated = {
          accumulatedMs: current.accumulatedMs + Math.max(0, now - current.lastOnlineAt),
          lastOnlineAt: null
        };
        saveState(updated);
        setOnlineMs(updated.accumulatedMs);
      } else {
        setOnlineMs(current.accumulatedMs);
      }
    }
  }, [isOnline, currentDriverProfile.driver_id]);

  const formattedOnlineHours = (onlineMs / 3600000).toFixed(1);

  const [incomingOrder, setIncomingOrder] = useState(null);

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
          passengerName: latest.passenger_name || 'Penumpang BoomBoom',
          passengerUsername: latest.passenger_ngopi_username || latest.passenger_username || '',
          passengerPhone: latest.passenger_phone || '',
          pickup: latest.pickup_address || 'Titik Penjemputan',
          destination: latest.destination_address || 'Titik Tujuan',
          distanceKm: latest.distance_km || 4.5,
          estFare: latest.fare || 18650,
          driverEarnings: Math.round((latest.fare || 18650) * 0.85),
          serviceType: latest.service_type || 'BoomRide',
          paymentMethod: latest.payment_method || 'QRIS / Tunai',
          isRealFirestore: true,
          rawOrder: latest
        });
      } else if (!orders || orders.length === 0) {
        setIncomingOrder(null);
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
    if (activeJob && recordDriverCompletedTrip) {
      recordDriverCompletedTrip(activeJob, currentDriverProfile);
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
                ⭐ {integratedDriverRating}
              </span>
              <a
                href={driverNgopiProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.75rem', fontWeight: '800', background: '#451a03', color: '#fef3c7', padding: '4px 10px', borderRadius: '12px', textDecoration: 'none' }}
              >
                ☕ {driverNgopiUsername || 'Hubungkan ngopi.top'}
              </a>
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
                  Penarikan bagi hasil perjalanan (Rupiah) otomatis tersinkronisasi.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select
                value={payoutViewFilter}
                onChange={e => setPayoutViewFilter(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-color, #cbd5e1)',
                  background: 'var(--bg-secondary, #f8fafc)',
                  color: 'var(--text-main, #0f172a)',
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">Semua Saluran Rekening & Dompet</option>
                <option value="BANK">1. Rekening Bank / E-Wallet (Rupiah)</option>
              </select>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'rgba(16, 185, 129, 0.12)', color: '#047857', padding: '5px 12px', borderRadius: '10px' }}>
                ✓ Rekening Terverifikasi
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
            {/* Rekening Bank / E-Wallet */}
            {(payoutViewFilter === 'ALL' || payoutViewFilter === 'BANK') && (
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
            )}
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
              Rp {realTodayEarnings.toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#34d399', marginTop: '6px' }}>+85% Bagi hasil pengemudi</div>
          </div>

          <div style={{ background: 'var(--bg-card, #ffffff)', borderRadius: '20px', padding: '20px', border: '1.5px solid var(--border-color, #cbd5e1)', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted, #475569)', marginBottom: '6px', letterSpacing: '0.3px' }}>TOTAL TRIP HARI INI</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main, #0f172a)' }}>
              {realTodayTrips} Trip
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted, #64748b)', marginTop: '6px' }}>Perjalanan selesai</div>
          </div>

          <div style={{ background: 'var(--bg-card, #ffffff)', borderRadius: '20px', padding: '20px', border: '1.5px solid var(--border-color, #cbd5e1)', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted, #475569)', marginBottom: '6px', letterSpacing: '0.3px' }}>DURASI ONLINE</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#f59f00' }}>
              {formattedOnlineHours} Jam
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted, #64748b)', marginTop: '6px' }}>Aktif menerima trip</div>
          </div>

          <div style={{ background: 'var(--bg-card, #ffffff)', borderRadius: '20px', padding: '20px', border: '1.5px solid var(--border-color, #cbd5e1)', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted, #475569)', marginBottom: '6px', letterSpacing: '0.3px' }}>REWARD POIN DRIVER</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fbbf24' }}>
              +{realNgopiPoints.toLocaleString('id-ID')} Poin
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fbbf24', marginTop: '6px' }}>Terintegrasi poin ngopi.top</div>
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

        {/* EMPTY STATE SAAT BELUM ADA ORDER MASUK */}
        {isOnline && !incomingOrder && !activeJob && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '20px',
            padding: '18px 22px',
            border: '1.5px dashed #10b981',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>
                📡 Menunggu Order Masuk dari Penumpang...
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>
                Status Anda <strong>ONLINE (SIAP NARIK)</strong>. Order baru akan muncul otomatis dengan suara notifikasi, atau masukkan 6-digit Kode Langsung di atas.
              </div>
            </div>
          </div>
        )}

        {/* INCOMING ORDER NOTIFICATION */}
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

            {/* Quick Dispatch Chat Option via ngopi.top */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '14px' }}>
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
          <MapViewComponent height="380px" showNearbyDrivers={isOnline} driverMode={true} />

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
                  <ShoppingBag size={14} /> EKOSISTEM MARKETPLACE MITRA
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted, #64748b)' }}>
                  Tukar Poin / Rupiah
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
                Cek Saldo Poin
              </button>
            </div>
          </div>
        </div>

        {/* MODAL PENJELASAN PERHITUNGAN REWARD & SALDO POIN NGOPI */}
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
                  ☕ Transparansi Perhitungan Saldo & Reward Poin Ngopi
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
                  Reward Poin Ngopi diberikan secara transparan dan terintegrasi langsung dengan akun <strong>ngopi.top</strong> mitra pengemudi dan pemesan:
                </p>
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--border-color, #e2e8f0)', marginBottom: '10px' }}>
                  <div style={{ fontWeight: '800', color: '#047857', marginBottom: '4px' }}>🛵 Reward Mitra Pengemudi:</div>
                  <div>• <strong>+10 Poin Ngopi</strong> per perjalanan selesai</div>
                  <div>• <strong>+5 Poin Ngopi</strong> bonus rating bintang 5 dari penumpang</div>
                  <div>• <strong>Saldo Saat Ini:</strong> +{realNgopiPoints.toLocaleString('id-ID')} Poin</div>
                </div>

                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <div style={{ fontWeight: '800', color: '#b45309', marginBottom: '4px' }}>👤 Reward Pemesan (Penumpang):</div>
                  <div>• <strong>Bonus Poin Ngopi</strong> untuk setiap perjalanan & armada EV</div>
                  <div>• Poin dapat ditukarkan di Ekosistem Marketplace Mitra</div>
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
