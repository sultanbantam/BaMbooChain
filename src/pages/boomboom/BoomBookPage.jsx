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
  Leaf
} from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import MapViewComponent from '../../components/boomboom/MapViewComponent';
import SosButton from '../../components/boomboom/SosButton';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';
import { calculateGreenScore } from '../../services/boomboom/rewardEngine';

const BoomBookPage = () => {
  const navigate = useNavigate();
  const {
    activeBooking,
    setPickup,
    setDestination,
    setServiceType,
    toggleEvVehicle,
    startBookingFlow,
    cancelBooking,
    assignDriverAndStartSimulation,
    updateBookingStep,
    completeTrip,
    resetActiveBooking
  } = useBoomBoomStore();

  const [pickupInput, setPickupInput] = useState(activeBooking.pickupAddress);
  const [destInput, setDestInput] = useState(activeBooking.destinationAddress);
  const [selectedPayment, setSelectedPayment] = useState('QRIS / Rupiah');
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Auto-progress simulation logic for prototype demo
  useEffect(() => {
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
  }, [activeBooking.step, assignDriverAndStartSimulation, updateBookingStep]);

  const greenScore = calculateGreenScore({
    distanceKm: activeBooking.fareCalc.distanceKm || 4.5,
    vehicleType: activeBooking.serviceType,
    isShared: activeBooking.serviceType === 'BoomTogether'
  });

  const handleUpdateAddresses = (e) => {
    e.preventDefault();
    setPickup(pickupInput);
    setDestination(destInput);
  };

  const handleConfirmOrder = () => {
    startBookingFlow();
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', color: 'var(--text-main, #0f172a)', minHeight: '100vh', paddingBottom: '60px' }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '1100px', margin: '24px auto', padding: '0 16px' }}>
        
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
                  STATUS PERJALANAN REAL-TIME
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
                  {activeBooking.step === 'SEARCHING' && 'Mencari Pengemudi Terdekat...'}
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>

          {/* LEFT COLUMN: MAP & DRIVER CARD */}
          <div>
            <div style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: '24px',
              padding: '20px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
              border: '1px solid var(--border-color, #cbd5e1)',
              marginBottom: '20px'
            }}>
              <MapViewComponent height="380px" showNearbyDrivers={true} />
            </div>

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
                  </div>
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
                      onClick={() => updateBookingStep('COMPLETED')}
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 16px', color: 'var(--text-main, #0f172a)' }}>
                  Konfirmasi Detail Pesanan
                </h2>

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
                    style={{
                      background: 'var(--bg-secondary, #f1f5f9)',
                      color: 'var(--text-main, #475569)',
                      border: '1px solid var(--border-color, #cbd5e1)',
                      padding: '10px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Perbarui Rute & Hitung Ulang Tarif
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
                  </div>
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
                        Diskon 5% Fares & Bonus Reward BMC
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
                      Rincian Transparansi Tarif (Fare Engine)
                    </span>
                    <Receipt size={16} color="var(--text-muted, #64748b)" />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted, #475569)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Jarak & Estimasi Waktu</span>
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
                    METODE PEMBAYARAN (IDR / RUPIAH)
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
                    <option value="QRIS / Rupiah">QRIS Instant (Semua E-Wallet / Bank)</option>
                    <option value="Bank Transfer">Transfer Bank Mandiri / BCA / BRI</option>
                    <option value="Tunai / Cash">Tunai Langsung Ke Pengemudi</option>
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

            {/* STATE 2: SEARCHING DRIVER */}
            {activeBooking.step === 'SEARCHING' && (
              <div style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '24px',
                padding: '40px 24px',
                textAlign: 'center',
                boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                border: '1px solid var(--border-color, #cbd5e1)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#d1fae5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  animation: 'pulse 1.2s infinite'
                }}>
                  <Bike size={42} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', margin: '0 0 8px' }}>
                  Menghubungkan Pengemudi Desa...
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted, #64748b)', maxWidth: '320px', margin: '0 auto 24px' }}>
                  Sistem dispatch desentralisasi sedang mencocokkan pengemudi terdekat.
                </p>
                <button
                  onClick={cancelBooking}
                  style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Batalkan Pencarian
                </button>
              </div>
            )}

            {/* STATE 3: COMPLETED TRIP */}
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
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)', marginBottom: '20px' }}>
                  Terima kasih telah berkontribusi membangun ekonomi mobilitas hijau desa.
                </p>

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
