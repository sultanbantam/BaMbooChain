import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bike, 
  Car, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Zap, 
  ShieldCheck, 
  Star, 
  Phone, 
  X, 
  ArrowRight,
  Receipt,
  Leaf,
  QrCode,
  CreditCard
} from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import MapViewComponent from '../../components/boomboom/MapViewComponent';
import SosButton from '../../components/boomboom/SosButton';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';
import { PARTNER_ENTITY_TYPES, PILOT_ZONE_OPTIONS, ROUTE_OPTIMIZATION_MODES } from '../../services/boomboom/mockData';
import { calculateGreenScore } from '../../services/boomboom/rewardEngine';
import { useAuth } from '../../context/AuthContext';
import { 
  createPilotTripOrder, 
  subscribePilotTripStatus, 
  openNgopiChat, 
  openWhatsAppDispatch, 
  updatePilotTripStep,
  generateNgopiMessage,
  findBestMatchingDriver,
  createPaymentSandboxSession,
  settlePaymentSandboxInFirestore
} from '../../services/boomboom/boomboomPilotService';
import { MessageSquare, Share2, Copy, Check, Radio, ExternalLink } from 'lucide-react';

const useIsMobile = () => {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w <= 768;
};

const BoomBookPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCopied, setIsCopied] = useState(false);
  const [useLivePilot, setUseLivePilot] = useState(true);
  const [pilotTripId, setPilotTripId] = useState(null);
  const [createdTripData, setCreatedTripData] = useState(null);
  const [paymentSandbox, setPaymentSandbox] = useState(null);
  const [isPayingSandbox, setIsPayingSandbox] = useState(false);

  const {
    activeBooking,
    drivers,
    regions,
    featureFlags,
    setPickup,
    setDestination,
    setServiceType,
    toggleEvVehicle,
    startBookingFlow,
    cancelBooking,
    assignDriverAndStartSimulation,
    updateBookingStep,
    completeTrip,
    resetActiveBooking,
    recalculateRouteAndFare,
    regenerateInstantCode,
    setPaymentSession,
    pushNotification,
    submitTripRatingAndCsat,
    submitComplaint,
    updatePilotRegionConfig,
    setRouteOptimizationMode,
    runFraudCheckOnBooking
  } = useBoomBoomStore();

  const [selectedPilotZoneId, setSelectedPilotZoneId] = useState('REG-JABODETABEK');
  const [customZoneRegency, setCustomZoneRegency] = useState('Kabupaten Subang');
  const [customZoneProvince, setCustomZoneProvince] = useState('Jawa Barat');
  const [selectedMitraType, setSelectedMitraType] = useState('BUMDes');
  const [customMitraTypeDetail, setCustomMitraTypeDetail] = useState('');
  const [mitraOtherDetails, setMitraOtherDetails] = useState('Angkutan warga, komuter & distribusi produk lokal desa');

  const [isCalculating, setIsCalculating] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [csatRating, setCsatRating] = useState(5);
  const [selectedCsatTags, setSelectedCsatTags] = useState(['Tepat Waktu', 'Ramah & Sopan', 'Tarif Transparan (85% ke Driver)']);
  const [csatComment, setCsatComment] = useState('');
  const [csatSubmitted, setCsatSubmitted] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState('WAIT_TIME');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [selectedCancelReason, setSelectedCancelReason] = useState('Berubah pikiran / salah titik jemput');

  const toggleCsatTag = (tag) => {
    setSelectedCsatTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitCsat = async () => {
    await submitTripRatingAndCsat({
      tripId: pilotTripId || activeBooking.currentTripId,
      rating: csatRating,
      tags: selectedCsatTags,
      comment: csatComment,
      passengerName: user?.displayName || 'Penumpang BoomBoom'
    });
    setCsatSubmitted(true);
  };

  const handleSendComplaint = async (e) => {
    if (e) e.preventDefault();
    if (!complaintSubject.trim()) return;
    await submitComplaint({
      tripId: pilotTripId || activeBooking.currentTripId,
      category: complaintCategory,
      subject: complaintSubject,
      description: complaintDesc,
      reporterName: user?.displayName || 'Penumpang BoomBoom',
      regionId: activeBooking.pilotGeofence?.nearestRegion?.id || 'REG-CIBARANI'
    });
    setComplaintSubject('');
    setComplaintDesc('');
    setShowComplaintForm(false);
  };

  const [pickupInput, setPickupInput] = useState(activeBooking.pickupAddress);
  const [destInput, setDestInput] = useState(activeBooking.destinationAddress);
  const [selectedPayment, setSelectedPayment] = useState('QRIS / Rupiah');

  // Auto-recalculate rute & peta secara responsif (debounced 650ms) saat teks jemput/tujuan diketik
  useEffect(() => {
    if (!pickupInput || !destInput) return;
    if (
      pickupInput === activeBooking.pickupAddress &&
      destInput === activeBooking.destinationAddress
    ) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsCalculating(true);
      try {
        await recalculateRouteAndFare(pickupInput, destInput);
      } catch (e) {
        console.warn('Auto-route error:', e);
      } finally {
        setIsCalculating(false);
      }
    }, 650);

    return () => clearTimeout(timer);
  }, [pickupInput, destInput]);

  // Geospatial Matching Engine: Hitung kandidat pengemudi terverifikasi terdekat
  const matchPreview = findBestMatchingDriver(
    activeBooking.pickupCoords,
    activeBooking.serviceType,
    drivers
  );
  const topMatchedDriver = matchPreview.bestDriver;

  // Listener real-time status Firestore pada Tahap II Backend Pilot
  useEffect(() => {
    if (!pilotTripId || !useLivePilot) return;

    const unsub = subscribePilotTripStatus(pilotTripId, (trip) => {
      if (!trip) return;
      setCreatedTripData(trip);

      if (trip.status === 'DRIVER_ASSIGNED' && activeBooking.step === 'SEARCHING') {
        const driver = {
          driver_id: trip.driver_id || 'DRV-001',
          name: trip.driver_name || 'Asep Saepulloh',
          phone: trip.driver_phone || '+62 812-3456-7890',
          avatarUrl: trip.driver_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          ngopi_username: trip.driver_ngopi_username || '@majelisngopi',
          ngopi_chat_url: trip.driver_ngopi_chat_url || 'https://ngopi.top/chat/f1c8c427-21bf-4fc1-8e99-9e651114d615?name=Ade%20Gunawan',
          plate_number: trip.plate_number || 'D 4892 BB',
          vehicle_brand: trip.vehicle_model || 'Motor EV',
          rating: 4.9
        };
        useBoomBoomStore.setState(state => ({
          activeBooking: {
            ...state.activeBooking,
            step: 'DRIVER_ASSIGNED',
            assignedDriver: driver
          }
        }));
      } else if (trip.status === 'DRIVER_ARRIVING' && activeBooking.step !== 'DRIVER_ARRIVING') {
        updateBookingStep('DRIVER_ARRIVING');
      } else if (trip.status === 'DRIVER_ARRIVED' && activeBooking.step !== 'DRIVER_ARRIVED') {
        updateBookingStep('DRIVER_ARRIVED');
      } else if (trip.status === 'ON_TRIP' && activeBooking.step !== 'ON_TRIP') {
        updateBookingStep('ON_TRIP');
      } else if (trip.status === 'COMPLETED' && activeBooking.step !== 'COMPLETED') {
        completeTrip(5, 'Uji lapangan selesai', user);
      } else if (trip.status === 'CANCELLED' && activeBooking.step !== 'IDLE') {
        cancelBooking();
      }
    });

    return () => unsub && unsub();
  }, [pilotTripId, useLivePilot, activeBooking.step, updateBookingStep, completeTrip, cancelBooking, user]);

  // Fallback simulasi otomatis jika pengguna ingin uji mandiri (demo cepat)
  useEffect(() => {
    if (useLivePilot) return;

    let timer;
    if (activeBooking.step === 'SEARCHING') {
      timer = setTimeout(() => {
        assignDriverAndStartSimulation();
      }, 3000);
    } else if (activeBooking.step === 'DRIVER_ASSIGNED') {
      timer = setTimeout(() => {
        updateBookingStep('DRIVER_ARRIVING');
      }, 3000);
    } else if (activeBooking.step === 'DRIVER_ARRIVING') {
      timer = setTimeout(() => {
        updateBookingStep('DRIVER_ARRIVED');
      }, 3000);
    } else if (activeBooking.step === 'DRIVER_ARRIVED') {
      timer = setTimeout(() => {
        updateBookingStep('ON_TRIP');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [useLivePilot, activeBooking.step, assignDriverAndStartSimulation, updateBookingStep]);

  const greenScore = calculateGreenScore({
    distanceKm: activeBooking.fareCalc.distanceKm || 4.5,
    vehicleType: activeBooking.serviceType,
    isShared: activeBooking.serviceType === 'BoomTogether'
  });

  // Sinkronisasi otomatis saat titik GPS terdeteksi atau dipilih dari peta
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

  const handleUpdateAddresses = async (e) => {
    if (e) e.preventDefault();
    setIsCalculating(true);
    try {
      if (recalculateRouteAndFare) {
        await recalculateRouteAndFare(pickupInput, destInput);
      } else {
        setPickup(pickupInput);
        setDestination(destInput);
      }
    } catch (err) {
      console.warn('Gagal menghitung rute:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleConfirmOrder = async () => {
    const activeCode = activeBooking.instantCode || regenerateInstantCode();
    startBookingFlow();
    try {
      // 0. Tahap IV Fraud & Anti-Abuse Check
      if (runFraudCheckOnBooking) {
        await runFraudCheckOnBooking(user?.uid || user?.id || 'GUEST-USER');
      }

      // 1. Buat sesi Payment Sandbox / Production & Validasi Tarif Server-side
      const tempTripId = `BOOM-${Date.now().toString().slice(-6)}`;
      const { paymentRecord } = await createPaymentSandboxSession({
        tripId: tempTripId,
        serviceType: activeBooking.serviceType,
        distanceKm: activeBooking.fareCalc.distanceKm,
        durationMin: activeBooking.fareCalc.durationMin,
        isEvVehicle: activeBooking.isEvVehicle,
        paymentMethod: selectedPayment,
        passengerName: user?.displayName || 'Penumpang BoomBoom',
        passengerEmail: user?.email || 'passenger@bamboochain.id'
      });

      setPaymentSandbox(paymentRecord);
      setPaymentSession(paymentRecord);

      if (useLivePilot) {
        const orderData = await createPilotTripOrder({
          instantCode: activeCode,
          pickupAddress: pickupInput,
          destinationAddress: destInput,
          pickupCoords: activeBooking.pickupCoords,
          destinationCoords: activeBooking.destinationCoords,
          serviceType: activeBooking.serviceType,
          isEvVehicle: activeBooking.isEvVehicle,
          fareCalc: activeBooking.fareCalc,
          paymentMethod: selectedPayment,
          paymentStatus: paymentRecord.status,
          paymentId: paymentRecord.payment_id,
          matchedDriver: topMatchedDriver
        }, user);
        setCreatedTripData(orderData);
        setPilotTripId(orderData.trip_id);
        useBoomBoomStore.setState(state => ({
          activeBooking: {
            ...state.activeBooking,
            currentTripId: orderData.trip_id,
            instantCode: orderData.instant_code || activeCode
          }
        }));
      }
    } catch (err) {
      console.warn('Gagal membuat order lapangan di Firestore:', err);
    }
  };

  const handleCopyInstantCode = () => {
    const code = activeBooking.instantCode || '482915';
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleSettleSandboxPayment = async () => {
    if (!paymentSandbox) return;
    setIsPayingSandbox(true);
    try {
      await settlePaymentSandboxInFirestore(
        paymentSandbox.payment_id,
        pilotTripId || activeBooking.currentTripId,
        paymentSandbox.amount
      );
      const updated = { ...paymentSandbox, status: 'PAID', paid_at: new Date().toISOString() };
      setPaymentSandbox(updated);
      setPaymentSession(updated);
      pushNotification(
        'payment_success',
        'Pembayaran QRIS Sandbox Berhasil!',
        `Transaksi #${paymentSandbox.payment_id} sebesar Rp ${paymentSandbox.amount.toLocaleString('id-ID')} telah lunas.`
      );
    } finally {
      setIsPayingSandbox(false);
    }
  };

  const handleCopyOrderText = () => {
    const tripToShare = createdTripData || {
      trip_id: activeBooking.currentTripId,
      pickup_address: pickupInput,
      destination_address: destInput,
      service_type: activeBooking.serviceType,
      fare: activeBooking.fareCalc.grossFare,
      payment_method: selectedPayment,
      passenger_name: user?.displayName || 'Pengguna BaMbooChain',
      distance_km: activeBooking.fareCalc.distanceKm,
      duration_min: activeBooking.fareCalc.durationMin
    };
    const text = generateNgopiMessage(tripToShare);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const activeTripObj = createdTripData || {
    trip_id: activeBooking.currentTripId,
    pickup_address: pickupInput,
    destination_address: destInput,
    service_type: activeBooking.serviceType,
    fare: activeBooking.fareCalc.grossFare,
    payment_method: selectedPayment,
    passenger_name: user?.displayName || 'Pengguna BaMbooChain',
    distance_km: activeBooking.fareCalc.distanceKm,
    duration_min: activeBooking.fareCalc.durationMin,
    driver_name: activeBooking.assignedDriver?.name || topMatchedDriver?.name || 'Asep Saepulloh',
    driver_phone: activeBooking.assignedDriver?.phone || topMatchedDriver?.phone || '+62 812-3456-7890',
    driver_ngopi_username: activeBooking.assignedDriver?.ngopi_username || topMatchedDriver?.ngopi_username || '@majelisngopi',
    driver_ngopi_chat_url: activeBooking.assignedDriver?.ngopi_chat_url || topMatchedDriver?.ngopi_chat_url || 'https://ngopi.top/chat/f1c8c427-21bf-4fc1-8e99-9e651114d615?name=Ade%20Gunawan'
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', color: 'var(--text-main, #0f172a)', minHeight: '100vh', paddingBottom: '64px' }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '14px 12px' : '24px 16px' }}>
        
        {/* TOP STATUS BAR IF TRIP IN PROGRESS */}
        {activeBooking.step !== 'IDLE' && activeBooking.step !== 'COMPLETED' && (
          <div style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '16px 24px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 25px rgba(6, 78, 59, 0.25)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#f59f00',
                boxShadow: '0 0 10px #f59f00',
                animation: 'pulse 1s infinite'
              }} />
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8, color: '#a7f3d0' }}>
                  STATUS PERJALANAN REAL-TIME (TAHAP II BACKEND PILOT)
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
                  {activeBooking.step === 'SEARCHING' && 'Mencocokkan Pengemudi Terverifikasi Terdekat...'}
                  {activeBooking.step === 'DRIVER_ASSIGNED' && 'Pengemudi Ditemukan! Mengonfirmasi...'}
                  {activeBooking.step === 'DRIVER_ARRIVING' && 'Pengemudi Menuju Lokasi Penjemputan'}
                  {activeBooking.step === 'DRIVER_ARRIVED' && 'Pengemudi Telah Tiba di Lokasi Jemput'}
                  {activeBooking.step === 'ON_TRIP' && 'Dalam Perjalanan Menuju Tujuan'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <SosButton tripId={activeBooking.currentTripId} />
              <button
                onClick={cancelBooking}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #f87171',
                  color: '#f87171',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Batalkan Perjalanan
              </button>
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: isMobile ? '16px' : '24px'
        }}>

          {/* LEFT COLUMN: MAP, GEOSPATIAL MATCHING RADAR & DRIVER CARD */}
          <div>
            <div style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: '24px',
              padding: '20px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
              border: '1px solid var(--border-color, #cbd5e1)',
              marginBottom: '20px'
            }}>
              <MapViewComponent height={isMobile ? '320px' : '460px'} showNearbyDrivers={true} />

              {/* GEOSPATIAL MATCHING ENGINE RADAR (Tahap II) */}
              {topMatchedDriver && activeBooking.step === 'IDLE' && (
                <div style={{
                  marginTop: '14px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid #10b981',
                  borderRadius: '16px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={topMatchedDriver.avatarUrl}
                      alt={topMatchedDriver.name}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10b981' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#047857', textTransform: 'uppercase' }}>
                        ⚡ Matching Engine: Driver Terdekat Siap
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>
                        {topMatchedDriver.name} • {topMatchedDriver.plate_number}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#047857' }}>
                      ±{topMatchedDriver.pickupDistanceKm} km dari Jemput
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)', fontWeight: '700' }}>
                      ETA Jemput ~{topMatchedDriver.pickupEtaMin} mnt • ⭐ {topMatchedDriver.rating}
                    </div>
                  </div>
                </div>
              )}

              {/* KARTU BOOM-INSTAN (SISTEM GOJEK INSTAN: KODE PEMESAN KE DRIVER) */}
              {featureFlags.ENABLE_BOOM_INSTANT_CODE !== false && (
                <div style={{
                  marginTop: '14px',
                  background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
                  color: '#ffffff',
                  borderRadius: '18px',
                  padding: '16px',
                  border: '1.5px solid #34d399',
                  boxShadow: '0 6px 20px rgba(6, 78, 59, 0.25)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#fef08a', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Zap size={14} color="#fef08a" /> SISTEM BOOM-INSTAN (ALA GOJEK INSTAN)
                    </div>
                    <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.18)', padding: '3px 8px', borderRadius: '8px', fontWeight: '800' }}>
                      Tanpa Antre Radar
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#ecfdf5', margin: '0 0 12px', lineHeight: 1.45 }}>
                    Sudah bertemu pengemudi BoomBoom di pangkalan/lokasi? Tunjukkan <strong>6-Digit Kode Instan</strong> ini agar pengemudi langsung memasukkan kode di Dasbor Driver:
                  </p>

                  <div style={{
                    background: 'rgba(15, 23, 42, 0.55)',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px dashed #6ee7b7',
                    gap: '10px',
                    flexWrap: 'wrap'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#a7f3d0', fontWeight: '800', letterSpacing: '0.5px' }}>
                        KODE PEMESAN BOOM-INSTAN
                      </div>
                      <div style={{ fontSize: '1.65rem', fontWeight: '900', letterSpacing: '4px', color: '#ffffff', fontFamily: 'monospace' }}>
                        {activeBooking.instantCode || '482915'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={handleCopyInstantCode}
                        style={{
                          background: '#f59f00',
                          color: '#000000',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          fontWeight: '900',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {codeCopied ? <Check size={14} /> : <Copy size={14} />}
                        {codeCopied ? 'Tersalin' : 'Salin Kode'}
                      </button>

                      <button
                        type="button"
                        onClick={() => regenerateInstantCode()}
                        style={{
                          background: 'rgba(255,255,255,0.16)',
                          color: '#ffffff',
                          border: '1px solid rgba(255,255,255,0.3)',
                          padding: '8px 10px',
                          borderRadius: '10px',
                          fontWeight: '800',
                          fontSize: '0.72rem',
                          cursor: 'pointer'
                        }}
                        title="Buat Kode Baru"
                      >
                        Acak Kode
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAHAP III: GEOFENCE ZONA PILOT TERBATAS & INTEGRASI PROYEK DESA (1. JaBoDeTaBek, 2. SeCiPaLe, 3. Lainnya + Dropdown Mitra) */}
              {(() => {
                const currentZoneObj = regions.find((r) => r.id === selectedPilotZoneId) || activeBooking.pilotGeofence?.nearestRegion || regions[0];
                return (
                  <div style={{
                    marginTop: '12px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1.5px solid rgba(16, 185, 129, 0.38)',
                    borderRadius: '18px',
                    padding: '14px 16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: '900', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={16} />
                        GEOFENCE ZONA PILOT TERBATAS & INTEGRASI PROYEK DESA
                      </span>
                      <span style={{
                        fontSize: '0.66rem',
                        fontWeight: '800',
                        background: 'rgba(6, 78, 59, 0.14)',
                        color: 'var(--primary, #047857)',
                        padding: '3px 9px',
                        borderRadius: '999px'
                      }}>
                        {currentZoneObj?.project_id || 'PRJ-JABODETABEK-01'}
                      </span>
                    </div>

                    {/* PILIH ZONA PILOT: 1. JaBoDeTaBek | 2. SeCiPaLe | 3. Lainnya */}
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: 'var(--text-muted, #64748b)', marginBottom: '4px' }}>
                          Pilih Zona Pilot Terbatas:
                        </label>
                        <select
                          value={selectedPilotZoneId}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedPilotZoneId(val);
                            const found = regions.find((r) => r.id === val);
                            if (found) {
                              setSelectedMitraType(found.operatorType || 'BUMDes');
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color, #cbd5e1)',
                            background: 'var(--bg-card, #ffffff)',
                            color: 'var(--text-main, #0f172a)',
                            fontSize: '0.76rem',
                            fontWeight: '800'
                          }}
                        >
                          {PILOT_ZONE_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: 'var(--text-muted, #64748b)', marginBottom: '4px' }}>
                          Mitra Pengelola (Dropdown):
                        </label>
                        <select
                          value={selectedMitraType}
                          onChange={(e) => {
                            const nextType = e.target.value;
                            setSelectedMitraType(nextType);
                            updatePilotRegionConfig(selectedPilotZoneId, { operatorType: nextType });
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color, #cbd5e1)',
                            background: 'var(--bg-card, #ffffff)',
                            color: 'var(--text-main, #0f172a)',
                            fontSize: '0.76rem',
                            fontWeight: '800'
                          }}
                        >
                          {PARTNER_ENTITY_TYPES.map((pt) => (
                            <option key={pt.value} value={pt.value}>
                              {pt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* JIKA PILIH 3. LAINNYA: SEBUTKAN KABUPATEN/KOTA & PROVINSI */}
                    {selectedPilotZoneId === 'REG-LAINNYA' && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                        gap: '8px',
                        marginBottom: '10px',
                        padding: '10px',
                        borderRadius: '12px',
                        background: 'rgba(245, 159, 0, 0.1)',
                        border: '1px dashed #f59f00'
                      }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '900', color: '#b45309', marginBottom: '3px' }}>
                            Sebutkan Kabupaten / Kota (Lainnya) *
                          </label>
                          <input
                            type="text"
                            value={customZoneRegency}
                            onChange={(e) => {
                              setCustomZoneRegency(e.target.value);
                              updatePilotRegionConfig('REG-LAINNYA', { regency: e.target.value, province: customZoneProvince });
                            }}
                            placeholder="Contoh: Kab. Subang / Kota Bandung"
                            style={{
                              width: '100%',
                              padding: '7px 10px',
                              borderRadius: '8px',
                              border: '1px solid #f59f00',
                              background: 'var(--bg-card, #ffffff)',
                              color: 'var(--text-main, #0f172a)',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '900', color: '#b45309', marginBottom: '3px' }}>
                            Sebutkan Provinsi (Lainnya) *
                          </label>
                          <input
                            type="text"
                            value={customZoneProvince}
                            onChange={(e) => {
                              setCustomZoneProvince(e.target.value);
                              updatePilotRegionConfig('REG-LAINNYA', { regency: customZoneRegency, province: e.target.value });
                            }}
                            placeholder="Contoh: Jawa Barat / Jawa Tengah"
                            style={{
                              width: '100%',
                              padding: '7px 10px',
                              borderRadius: '8px',
                              border: '1px solid #f59f00',
                              background: 'var(--bg-card, #ffffff)',
                              color: 'var(--text-main, #0f172a)',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* JIKA PILIH MITRA "LAIN-LAIN" ATAU ISIAN KETERANGAN MITRA */}
                    {selectedMitraType === 'Lain-lain' && (
                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '900', color: '#b45309', marginBottom: '3px' }}>
                          Sebutkan Jenis Mitra Lain-lain & Apa yang Harus Diisi *
                        </label>
                        <input
                          type="text"
                          value={customMitraTypeDetail}
                          onChange={(e) => {
                            setCustomMitraTypeDetail(e.target.value);
                            updatePilotRegionConfig(selectedPilotZoneId, { operatorCustomType: e.target.value });
                          }}
                          placeholder="Contoh: Kasepuhan Adat / Kelompok Tani Hutan / Pokdarwis / Kampus"
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: '8px',
                            border: '1px solid #f59f00',
                            background: 'var(--bg-card, #ffffff)',
                            color: 'var(--text-main, #0f172a)',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    )}

                    <div style={{ marginBottom: '6px' }}>
                      <label style={{ display: 'block', fontSize: '0.67rem', fontWeight: '800', color: 'var(--text-muted, #64748b)', marginBottom: '3px' }}>
                        Keterangan Mitra & Lain-lainnya (Nama Entitas, Cakupan Desa/Kota, Peran):
                      </label>
                      <input
                        type="text"
                        value={mitraOtherDetails}
                        onChange={(e) => {
                          setMitraOtherDetails(e.target.value);
                          updatePilotRegionConfig(selectedPilotZoneId, { operatorOtherDetails: e.target.value });
                        }}
                        placeholder="Isi nama BUMDes/Yayasan/Perusahaan/Organisasi & cakupan layanannya..."
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color, #cbd5e1)',
                          background: 'var(--bg-card, #ffffff)',
                          color: 'var(--text-main, #0f172a)',
                          fontSize: '0.74rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.4 }}>
                      Wilayah Aktif: <strong>{selectedPilotZoneId === 'REG-LAINNYA' ? `${customZoneRegency || 'Kabupaten/Kota'}, ${customZoneProvince || 'Provinsi'}` : currentZoneObj?.regency}</strong> • Kategori Mitra: <strong>{selectedMitraType}{selectedMitraType === 'Lain-lain' && customMitraTypeDetail ? ` (${customMitraTypeDetail})` : ''}</strong>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* PAYMENT SANDBOX SIMULATOR CARD (Tahap II) */}
            {paymentSandbox && activeBooking.step !== 'IDLE' && (
              <div style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '24px',
                padding: '20px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                border: paymentSandbox.status === 'PAID' ? '2px solid #10b981' : '2px solid #f59f00',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <QrCode size={18} color={paymentSandbox.status === 'PAID' ? '#10b981' : '#d97706'} />
                    <span style={{ fontSize: '0.88rem', fontWeight: '900', color: 'var(--text-main, #0f172a)' }}>
                      Payment Sandbox ({paymentSandbox.payment_method})
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '900',
                    padding: '4px 10px',
                    borderRadius: '10px',
                    background: paymentSandbox.status === 'PAID' ? '#d1fae5' : '#fef3c7',
                    color: paymentSandbox.status === 'PAID' ? '#047857' : '#b45309'
                  }}>
                    {paymentSandbox.status === 'PAID' ? '✓ LUNAS (VERIFIED)' : paymentSandbox.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #64748b)', marginBottom: '12px' }}>
                  ID Pembayaran: <strong>{paymentSandbox.payment_id}</strong> • Nominal Server-Validated: <strong>Rp {paymentSandbox.amount.toLocaleString('id-ID')}</strong>
                </div>

                {paymentSandbox.status !== 'PAID' && paymentSandbox.provider !== 'CASH_DIRECT' && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleSettleSandboxPayment}
                      disabled={isPayingSandbox}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        fontWeight: '800',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {isPayingSandbox ? 'Memverifikasi...' : '⚡ Simulasikan Bayar Lunas QRIS'}
                    </button>
                    {paymentSandbox.midtrans_redirect_url && (
                      <a
                        href={paymentSandbox.midtrans_redirect_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'var(--bg-secondary, #f1f5f9)',
                          color: 'var(--text-main, #0f172a)',
                          border: '1px solid var(--border-color, #cbd5e1)',
                          padding: '10px 12px',
                          borderRadius: '12px',
                          fontWeight: '700',
                          fontSize: '0.78rem',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        Midtrans Sandbox <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* DRIVER INFO CARD */}
            {activeBooking.assignedDriver && activeBooking.step !== 'IDLE' && activeBooking.step !== 'COMPLETED' && (
              <div style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '24px',
                padding: '20px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                border: '1.5px solid #10b981'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#047857', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '10px' }}>
                    PENGEMUDI TERVERIFIKASI
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '700', color: '#b45309' }}>
                    <Star size={16} fill="#f59f00" color="#f59f00" /> {activeBooking.assignedDriver.rating}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <img
                    src={activeBooking.assignedDriver.avatarUrl}
                    alt={activeBooking.assignedDriver.name}
                    style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10b981' }}
                  />
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>
                      {activeBooking.assignedDriver.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)' }}>
                      {activeBooking.assignedDriver.vehicle_brand} ({activeBooking.assignedDriver.plate_number})
                    </div>
                    {activeBooking.assignedDriver.ngopi_username && (
                      <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700', marginTop: '2px' }}>
                        ☕ ngopi.top: {activeBooking.assignedDriver.ngopi_username}
                      </div>
                    )}
                  </div>
                </div>

                {/* CHAT ACTIONS: NGOPI.TOP & WHATSAPP */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  <button
                    onClick={() => openNgopiChat(activeTripObj)}
                    style={{
                      background: '#451a03',
                      color: '#fef3c7',
                      border: '1px solid #78350f',
                      padding: '10px 8px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>☕</span> Chat di ngopi.top
                  </button>
                  <button
                    onClick={() => openWhatsAppDispatch(activeTripObj, activeBooking.assignedDriver.phone)}
                    style={{
                      background: '#128c7e',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 8px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <MessageSquare size={14} /> Chat via WA
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={`tel:${activeBooking.assignedDriver.phone}`}
                    style={{
                      flex: 1,
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--primary, #047857)',
                      padding: '10px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Phone size={16} /> Hubungi Driver
                  </a>

                  {activeBooking.step === 'DRIVER_ARRIVED' && (
                    <button
                      onClick={() => updateBookingStep('ON_TRIP')}
                      style={{
                        flex: 1,
                        background: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '14px',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Mulai Jalan Sekarang
                    </button>
                  )}

                  {activeBooking.step === 'ON_TRIP' && (
                    <button
                      onClick={() => completeTrip(5, 'Perjalanan selesai', user)}
                      style={{
                        flex: 1,
                        background: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '14px',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Selesaikan Perjalanan
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: FORM / FARE ENGINE / RATING */}
          <div>
            
            {/* STATE 1: IDLE / FORM CONFIGURATION */}
            {activeBooking.step === 'IDLE' && (
              <div style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                border: '1px solid var(--border-color, #cbd5e1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-main, #0f172a)' }}>
                    Konfirmasi Detail Pesanan
                  </h2>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', background: 'rgba(16,185,129,0.12)', color: '#047857', padding: '4px 10px', borderRadius: '10px' }}>
                    {user ? `Akun: ${user.displayName || user.email}` : 'Mode Tamu / Pilot'}
                  </span>
                </div>

                <form onSubmit={handleUpdateAddresses} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748b)' }}>PENJEMPUTAN</label>
                    <div style={{ marginTop: '4px' }}>
                      <input
                        type="text"
                        value={pickupInput}
                        onChange={e => setPickupInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '14px',
                          border: '1.5px solid var(--border-color, #cbd5e1)',
                          background: 'var(--bg-secondary, #f8fafc)',
                          fontSize: '0.9rem',
                          fontWeight: '700',
                          color: 'var(--text-main, #0f172a)'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748b)' }}>TUJUAN</label>
                    <div style={{ marginTop: '4px' }}>
                      <input
                        type="text"
                        value={destInput}
                        onChange={e => setDestInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '14px',
                          border: '1.5px solid var(--border-color, #cbd5e1)',
                          background: 'var(--bg-secondary, #f8fafc)',
                          fontSize: '0.9rem',
                          fontWeight: '700',
                          color: 'var(--text-main, #0f172a)'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isCalculating}
                    id="btn-confirm-pickup-route"
                    style={{
                      background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                      color: '#ffffff',
                      border: '1.5px solid #34d399',
                      padding: '13px 18px',
                      borderRadius: '14px',
                      fontWeight: '900',
                      fontSize: '0.88rem',
                      cursor: isCalculating ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 18px rgba(4, 120, 87, 0.35)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <MapPin size={17} color="#34d399" />
                    {isCalculating ? 'Menghitung Rute Nyata & Tarif...' : '📍 Konfirmasi Titik Penjemputan di Peta & Hitung Rute'}
                  </button>
                </form>

                {/* SERVICE SELECTION TABS */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748b)', display: 'block', marginBottom: '8px' }}>
                    PILIH JENIS KENDARAAN & SERVIS
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      onClick={() => setServiceType('BoomRide')}
                      style={{
                        padding: '12px',
                        borderRadius: '16px',
                        border: activeBooking.serviceType === 'BoomRide' ? '2px solid #10b981' : '1px solid var(--border-color, #cbd5e1)',
                        background: activeBooking.serviceType === 'BoomRide' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary, #f8fafc)',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: '800', color: 'var(--text-main, #0f172a)', fontSize: '0.9rem' }}>🛵 BoomRide</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted, #64748b)' }}>Motor Desa</div>
                    </button>

                    <button
                      onClick={() => setServiceType('BoomCar')}
                      style={{
                        padding: '12px',
                        borderRadius: '16px',
                        border: activeBooking.serviceType === 'BoomCar' ? '2px solid #10b981' : '1px solid var(--border-color, #cbd5e1)',
                        background: activeBooking.serviceType === 'BoomCar' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary, #f8fafc)',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: '800', color: 'var(--text-main, #0f172a)', fontSize: '0.9rem' }}>🚗 BoomCar</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted, #64748b)' }}>Mobil Nyaman</div>
                    </button>

                    <button
                      onClick={() => setServiceType('BoomSchedule')}
                      style={{
                        padding: '12px',
                        borderRadius: '16px',
                        border: activeBooking.serviceType === 'BoomSchedule' ? '2px solid #f59f00' : '1px solid var(--border-color, #cbd5e1)',
                        background: activeBooking.serviceType === 'BoomSchedule' ? 'rgba(245, 159, 0, 0.15)' : 'var(--bg-secondary, #f8fafc)',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: '800', color: 'var(--text-main, #0f172a)', fontSize: '0.9rem' }}>⏰ BoomSchedule</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted, #64748b)' }}>Terjadwal</div>
                    </button>

                    <button
                      onClick={() => setServiceType('BoomTogether')}
                      style={{
                        padding: '12px',
                        borderRadius: '16px',
                        border: activeBooking.serviceType === 'BoomTogether' ? '2px solid #06b6d4' : '1px solid var(--border-color, #cbd5e1)',
                        background: activeBooking.serviceType === 'BoomTogether' ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-secondary, #f8fafc)',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: '800', color: 'var(--text-main, #0f172a)', fontSize: '0.9rem' }}>👥 BoomTogether</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted, #64748b)' }}>Tumpangan Hemat</div>
                    </button>

                    {featureFlags.FUTURE_BOOM_SEND && (
                      <button
                        onClick={() => setServiceType('BoomSend')}
                        style={{
                          padding: '12px',
                          borderRadius: '16px',
                          border: activeBooking.serviceType === 'BoomSend' ? '2px solid #10b981' : '1px solid var(--border-color, #cbd5e1)',
                          background: activeBooking.serviceType === 'BoomSend' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary, #f8fafc)',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: '800', color: 'var(--text-main, #0f172a)', fontSize: '0.9rem' }}>📦 BoomSend</div>
                        <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted, #64748b)' }}>Kurir & Logistik Desa</div>
                      </button>
                    )}

                    {featureFlags.FUTURE_BOOM_TOUR && (
                      <button
                        onClick={() => setServiceType('BoomTour')}
                        style={{
                          padding: '12px',
                          borderRadius: '16px',
                          border: activeBooking.serviceType === 'BoomTour' ? '2px solid #10b981' : '1px solid var(--border-color, #cbd5e1)',
                          background: activeBooking.serviceType === 'BoomTour' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary, #f8fafc)',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: '800', color: 'var(--text-main, #0f172a)', fontSize: '0.9rem' }}>🎋 BoomTour</div>
                        <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted, #64748b)' }}>Ekowisata & Kebun Bambu</div>
                      </button>
                    )}
                  </div>

                  {/* TAHAP IV: ROUTE OPTIMIZATION ENGINE SELECTOR */}
                  {featureFlags.ENABLE_ROUTE_OPTIMIZATION && (
                    <div style={{ marginTop: '14px' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted, #64748b)', display: 'block', marginBottom: '6px' }}>
                        OPTIMASI RUTE CERDAS (TAHAP IV ROUTE OPTIMIZATION)
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {ROUTE_OPTIMIZATION_MODES.map((rm) => {
                          const isSelected = (activeBooking.routeOptimizationMode || 'FASTEST') === rm.id;
                          return (
                            <button
                              key={rm.id}
                              type="button"
                              onClick={() => setRouteOptimizationMode(rm.id)}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '9px 12px',
                                borderRadius: '12px',
                                border: isSelected ? '1.5px solid #10b981' : '1px solid var(--border-color, #cbd5e1)',
                                background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-secondary, #f8fafc)',
                                cursor: 'pointer',
                                textAlign: 'left'
                              }}
                            >
                              <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>{rm.label}</div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted, #64748b)' }}>{rm.desc}</div>
                              </div>
                              {isSelected && (
                                <span style={{ fontSize: '0.68rem', fontWeight: '900', color: '#047857', background: '#d1fae5', padding: '2px 8px', borderRadius: '999px' }}>
                                  Aktif
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* EV TOGGLE */}
                <div style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  border: '1px solid #10b981'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Zap size={20} color="#059669" />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #065f46)' }}>
                        KENDARAAN EV (LISTRIK)
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #047857)' }}>
                        Diskon 5% Fares & Bonus Reward BMC ({greenScore.label}: +{greenScore.greenPoints} Poin)
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={toggleEvVehicle}
                    style={{
                      background: activeBooking.isEvVehicle ? '#059669' : 'var(--border-color, #cbd5e1)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {activeBooking.isEvVehicle ? 'EV AKTIF' : 'NON-EV'}
                  </button>
                </div>

                {/* FARE BREAKDOWN */}
                <div style={{
                  background: 'var(--bg-secondary, #f8fafc)',
                  borderRadius: '18px',
                  padding: '16px',
                  marginBottom: '20px',
                  border: '1px solid var(--border-color, #cbd5e1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #334155)' }}>
                      Rincian Transparansi Tarif (Server-Validated Fare Engine)
                    </span>
                    <Receipt size={16} color="var(--text-muted, #64748b)" />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted, #475569)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Jarak Jalan Raya & Estimasi Waktu</span>
                      <strong style={{ color: 'var(--text-main)' }}>{activeBooking.fareCalc.distanceKm} km (~{activeBooking.fareCalc.durationMin} Menit)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Tarif Dasar (Base + Per KM/Min)</span>
                      <span style={{ color: 'var(--text-main)' }}>Rp {activeBooking.fareCalc.grossFare.toLocaleString('id-ID')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.9 }}>
                      <span>• Hak Pengemudi (85%)</span>
                      <span>{activeBooking.fareCalc.formatted.driverEarnings}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.9 }}>
                      <span>• Bagi Hasil Mitra Wilayah/BUMDes (5%)</span>
                      <span>{activeBooking.fareCalc.formatted.operatorShare}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.9 }}>
                      <span>• Layanan Platform & Asuransi</span>
                      <span>{activeBooking.fareCalc.formatted.platformShare}</span>
                    </div>

                    <div style={{ borderTop: '1px dashed var(--border-color, #cbd5e1)', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: '900', color: 'var(--primary, #047857)' }}>
                      <span>TOTAL HAK PEMBAYARAN (IDR)</span>
                      <span>{activeBooking.fareCalc.formatted.grossFare}</span>
                    </div>
                  </div>
                </div>

                {/* PAYMENT SELECTOR */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748b)', display: 'block', marginBottom: '8px' }}>
                    METODE PEMBAYARAN SANDBOX (IDR / RUPIAH)
                  </label>
                  <select
                    value={selectedPayment}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--border-color, #cbd5e1)',
                      fontSize: '0.9rem',
                      fontWeight: '800',
                      color: 'var(--text-main, #0f172a)',
                      background: 'var(--bg-secondary, #ffffff)'
                    }}
                  >
                    <option value="QRIS / Rupiah">QRIS Instant Sandbox (Semua E-Wallet / Bank)</option>
                    <option value="Bank Transfer">Virtual Account / Transfer Bank Mandiri / BCA / BRI</option>
                    <option value="Tunai / Cash">Tunai Langsung Ke Pengemudi (Cash)</option>
                  </select>
                </div>

                {/* CONFIRM ORDER BUTTON */}
                <button
                  onClick={handleConfirmOrder}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '16px',
                    borderRadius: '18px',
                    fontWeight: '900',
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  KONFIRMASI PESANAN SEKARANG <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* STATE 2: SEARCHING DRIVER WITH REAL-TIME DISPATCH & NGOPI.TOP */}
            {activeBooking.step === 'SEARCHING' && (
              <div style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '24px',
                padding: '30px 20px',
                textAlign: 'center',
                boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                border: '1.5px solid #10b981'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: '#d1fae5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  animation: 'pulse 1.2s infinite'
                }}>
                  <Bike size={38} />
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#047857', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', marginBottom: '8px' }}>
                  <Radio size={12} color="#059669" /> TAHAP II: MATCHING ENGINE & BACKEND PILOT AKTIF
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', margin: '0 0 6px' }}>
                  Pesanan Terdaftar & Sedang Mencocokkan Driver
                </h3>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#047857', marginBottom: '12px' }}>
                  ID Trip: #{pilotTripId || activeBooking.currentTripId} • Tarif: Rp {activeBooking.fareCalc.grossFare.toLocaleString('id-ID')}
                </div>

                {/* Kotak Kode BoomInstan untuk diberikan langsung ke Driver */}
                <div style={{
                  background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
                  color: '#ffffff',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  maxWidth: '360px',
                  margin: '0 auto 14px',
                  border: '1.5px dashed #34d399'
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#fef08a', letterSpacing: '0.5px', marginBottom: '2px' }}>
                    🔑 KODE BOOM-INSTAN (TUNJUKKAN KE DRIVER)
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '5px', fontFamily: 'monospace', color: '#ffffff' }}>
                    {activeBooking.instantCode || '482915'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#a7f3d0', marginTop: '2px' }}>
                    Driver cukup ketik kode ini di Dasbor Pengemudi untuk langsung jalan!
                  </div>
                </div>

                {topMatchedDriver && (
                  <div style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    borderRadius: '14px',
                    padding: '10px 14px',
                    maxWidth: '360px',
                    margin: '0 auto 16px',
                    textAlign: 'left',
                    fontSize: '0.78rem'
                  }}>
                    <div style={{ fontWeight: '800', color: '#047857', marginBottom: '2px' }}>
                      🎯 Kandidat Terdekat #1: {topMatchedDriver.name} ({topMatchedDriver.plate_number})
                    </div>
                    <div style={{ color: 'var(--text-muted, #64748b)' }}>
                      Jarak ke titik jemput: ±{topMatchedDriver.pickupDistanceKm} km (ETA ~{topMatchedDriver.pickupEtaMin} menit) • {topMatchedDriver.ngopi_username || '@majelisngopi'}
                    </div>
                  </div>
                )}

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', maxWidth: '340px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                  Pesanan telah tersimpan di Firestore & Audit Log. Kirim notifikasi langsung ke <strong>ngopi.top</strong> atau WhatsApp pengemudi:
                </p>

                {/* DISPATCH ACTION BUTTONS: NGOPI.TOP & WHATSAPP */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px', margin: '0 auto 24px' }}>
                  <button
                    onClick={() => openNgopiChat(activeTripObj)}
                    style={{
                      background: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)',
                      color: '#fef3c7',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(69, 26, 3, 0.25)'
                    }}
                  >
                    <span>☕</span> Kirim Notifikasi ke ngopi.top <ExternalLink size={15} />
                  </button>

                  <button
                    onClick={() => openWhatsAppDispatch(activeTripObj)}
                    style={{
                      background: 'linear-gradient(135deg, #128c7e 0%, #075e54 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(18, 140, 126, 0.25)'
                    }}
                  >
                    <MessageSquare size={16} /> Kirim via WhatsApp Pengemudi / BUMDes <ExternalLink size={15} />
                  </button>

                  <button
                    onClick={handleCopyOrderText}
                    style={{
                      background: 'var(--bg-secondary, #f1f5f9)',
                      color: 'var(--text-main, #334155)',
                      border: '1px solid var(--border-color, #cbd5e1)',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {isCopied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                    {isCopied ? 'Teks Pesanan Berhasil Disalin!' : 'Salin Format Pesanan Lengkap'}
                  </button>
                </div>

                <div style={{ borderTop: '1px dashed var(--border-color, #cbd5e1)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                    Ingin menguji pencocokan otomatis (Auto-Match Engine)?
                  </div>
                  <button
                    onClick={() => {
                      setUseLivePilot(false);
                      assignDriverAndStartSimulation();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#059669',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    ⚡ Tugaskan Kandidat Pengemudi Terdekat Sekarang
                  </button>

                  <div style={{ width: '100%', maxWidth: '340px', marginTop: '8px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted, #64748b)', marginBottom: '4px' }}>
                      Alasan Pembatalan (Metrik Evaluasi Tahap III):
                    </label>
                    <select
                      value={selectedCancelReason}
                      onChange={(e) => setSelectedCancelReason(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color, #cbd5e1)',
                        background: 'var(--bg-secondary, #f8fafc)',
                        color: 'var(--text-main, #0f172a)',
                        fontSize: '0.76rem',
                        fontWeight: '700',
                        marginBottom: '8px'
                      }}
                    >
                      <option value="Berubah pikiran / salah titik jemput">Berubah pikiran / salah titik jemput</option>
                      <option value="Cuaca hujan deras di jalur desa">Cuaca hujan deras di jalur desa</option>
                      <option value="Beralih ke Kode BoomInstan di tempat">Beralih ke Kode BoomInstan di tempat</option>
                      <option value="Pengemudi terlalu jauh (>5 km)">Pengemudi terlalu jauh (&gt;5 km)</option>
                    </select>
                    <button
                      onClick={() => cancelBooking(selectedCancelReason, user?.displayName || 'Penumpang')}
                      style={{
                        width: '100%',
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        padding: '9px 16px',
                        borderRadius: '10px',
                        fontWeight: '800',
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      Batalkan Pencarian & Catat Alasan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 3: COMPLETED TRIP + TAHAP III CSAT & COMPLAINT TELEMETRY */}
            {activeBooking.step === 'COMPLETED' && (
              <div style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '24px',
                padding: '28px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                border: '2px solid #10b981'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#d1fae5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <CheckCircle2 size={38} />
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main, #065f46)', margin: '0 0 6px' }}>
                  Perjalanan Selesai!
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)', marginBottom: '18px' }}>
                  Terima kasih telah berkontribusi membangun ekonomi mobilitas hijau desa. Reward <strong>+2.5 BMC</strong> telah dicatat di Ledger.
                </p>

                {/* TAHAP III: USER SATISFACTION (CSAT) & RATING */}
                <div style={{
                  background: 'var(--bg-secondary, #f8fafc)',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  borderRadius: '18px',
                  padding: '18px',
                  marginBottom: '18px',
                  textAlign: 'left'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--primary, #047857)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', textAlign: 'center' }}>
                    Evaluasi Kepuasan Warga (Metrik CSAT Pilot Tahap III)
                  </div>

                  {!csatSubmitted ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setCsatRating(starVal)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px',
                              transform: csatRating >= starVal ? 'scale(1.12)' : 'scale(1)',
                              transition: 'transform 0.15s'
                            }}
                          >
                            <Star
                              size={28}
                              fill={csatRating >= starVal ? '#f59f00' : 'transparent'}
                              color={csatRating >= starVal ? '#f59f00' : '#cbd5e1'}
                            />
                          </button>
                        ))}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '12px' }}>
                        {[
                          'Tepat Waktu',
                          'Ramah & Sopan',
                          'Tarif Transparan (85% ke Driver)',
                          'Rute Aman & Hafal Jalan Desa',
                          'Kendaraan Bersih / EV Ramah Lingkungan'
                        ].map((tag) => {
                          const active = selectedCsatTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleCsatTag(tag)}
                              style={{
                                background: active ? '#064e3b' : 'var(--bg-card, #ffffff)',
                                color: active ? '#a7f3d0' : 'var(--text-muted, #64748b)',
                                border: active ? '1px solid #10b981' : '1px solid var(--border-color, #cbd5e1)',
                                borderRadius: '999px',
                                padding: '5px 11px',
                                fontSize: '0.72rem',
                                fontWeight: '800',
                                cursor: 'pointer'
                              }}
                            >
                              {active ? '✓ ' : '+ '}{tag}
                            </button>
                          );
                        })}
                      </div>

                      <input
                        type="text"
                        value={csatComment}
                        onChange={(e) => setCsatComment(e.target.value)}
                        placeholder="Catatan tambahan untuk pengemudi / operator wilayah (opsional)..."
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '12px',
                          border: '1px solid var(--border-color, #cbd5e1)',
                          background: 'var(--bg-card, #ffffff)',
                          color: 'var(--text-main, #0f172a)',
                          fontSize: '0.8rem',
                          marginBottom: '10px',
                          boxSizing: 'border-box'
                        }}
                      />

                      <button
                        type="button"
                        onClick={handleSubmitCsat}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '11px',
                          borderRadius: '12px',
                          fontWeight: '800',
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        ★ Kirim Penilaian Kepuasan ({csatRating}/5) ke Telemetry Pilot
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#059669', fontWeight: '800', fontSize: '0.85rem', padding: '8px 0' }}>
                      ✓ Penilaian ★{csatRating}/5 & Tag CSAT berhasil direkam ke Telemetry Pilot Tahap III!
                    </div>
                  )}

                  {/* TOMBOL LAPOR KELUHAN / MASUKAN OPERASIONAL */}
                  <div style={{ marginTop: '12px', borderTop: '1px dashed var(--border-color, #cbd5e1)', paddingTop: '10px', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setShowComplaintForm(!showComplaintForm)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#d97706',
                        fontSize: '0.76rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      {showComplaintForm ? 'Tutup Form Masukan / Keluhan' : 'Ada kendala atau usulan titik jemput wilayah? Kirim Tiket ke Operator BUMDes/Koperasi'}
                    </button>

                    {showComplaintForm && (
                      <form onSubmit={handleSendComplaint} style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                        <select
                          value={complaintCategory}
                          onChange={(e) => setComplaintCategory(e.target.value)}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color, #cbd5e1)',
                            background: 'var(--bg-card, #ffffff)',
                            color: 'var(--text-main, #0f172a)',
                            fontSize: '0.78rem',
                            fontWeight: '700'
                          }}
                        >
                          <option value="WAIT_TIME">Waktu Tunggu / Penjemputan</option>
                          <option value="PICKUP_POINT">Usulan Titik Jemput / Rambu Komunitas</option>
                          <option value="ROUTE_SAFETY">Rute & Keselamatan Jalan Wilayah</option>
                          <option value="FARE_PAYMENT">Transparansi Tarif & Pembayaran QRIS</option>
                        </select>
                        <input
                          type="text"
                          required
                          value={complaintSubject}
                          onChange={(e) => setComplaintSubject(e.target.value)}
                          placeholder="Judul keluhan / usulan singkat..."
                          style={{
                            padding: '9px 12px',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color, #cbd5e1)',
                            background: 'var(--bg-card, #ffffff)',
                            color: 'var(--text-main, #0f172a)',
                            fontSize: '0.8rem'
                          }}
                        />
                        <textarea
                          rows={2}
                          value={complaintDesc}
                          onChange={(e) => setComplaintDesc(e.target.value)}
                          placeholder="Detail lokasi atau kronologi singkat untuk ditindaklanjuti pengurus wilayah..."
                          style={{
                            padding: '9px 12px',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color, #cbd5e1)',
                            background: 'var(--bg-card, #ffffff)',
                            color: 'var(--text-main, #0f172a)',
                            fontSize: '0.8rem'
                          }}
                        />
                        <button
                          type="submit"
                          style={{
                            background: '#f59f00',
                            color: '#000000',
                            border: 'none',
                            padding: '9px 14px',
                            borderRadius: '10px',
                            fontWeight: '900',
                            fontSize: '0.78rem',
                            cursor: 'pointer'
                          }}
                        >
                          Kirim Tiket Masukan ke Operator Wilayah
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      resetActiveBooking();
                      navigate('/boomboom/trips');
                    }}
                    style={{
                      flex: 1,
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--primary, #047857)',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Lihat Riwayat & Struk
                  </button>

                  <button
                    onClick={() => {
                      resetActiveBooking();
                      navigate('/boomboom');
                    }}
                    style={{
                      flex: 1,
                      background: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Pesan Lagi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoomBookPage;
