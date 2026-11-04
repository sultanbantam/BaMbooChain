import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase/config';

/**
 * Service untuk BoomBoom Tahap 1: Uji Lapangan Terbatas
 * Terhubung ke Firebase Firestore dan sistem komunikasi ngopi.top / WhatsApp
 */

// Format pesan siaran order untuk ngopi.top dan WhatsApp
export const generateNgopiMessage = (trip) => {
  const tripId = trip.trip_id || trip.id || 'TRIP-DEMO';
  const passenger = trip.passenger_name || 'Pengguna BaMbooChain';
  const pickup = trip.pickup_address || 'Sentra Bibit Bambu Cibarani';
  const dest = trip.destination_address || 'Pasar Desa Cibarani, Subang';
  const service = trip.service_type || 'BoomRide';
  const fare = trip.fare || trip.grossFare || 18650;
  const distance = trip.distance_km || 4.5;
  const duration = trip.duration_min || 12;

  return [
    `🛵 *ORDER BOOMBOOM MASUK (UJI LAPANGAN CIBARANI)*`,
    `📋 No. Trip: #${tripId}`,
    `⚡ Layanan: ${service}`,
    `👤 Penumpang: ${passenger}`,
    `📍 Titik Jemput: ${pickup}`,
    `🎯 Titik Tujuan: ${dest}`,
    `📏 Jarak & Waktu: ±${distance} km (${duration} menit)`,
    `💰 Tarif Tunai (Cash): Rp ${Number(fare).toLocaleString('id-ID')}`,
    ``,
    `👉 Buka Dasbor Pengemudi:`,
    `https://www.bamboochain.id/#/boomboom/driver/dashboard?tripId=${tripId}`,
    ``,
    `💬 Koordinasi Komunitas via ngopi.top:`,
    `https://ngopi.top/contacts?join=BoomBoom`
  ].join('\n');
};

// Buka obrolan / ruang komunitas di ngopi.top
export const openNgopiChat = (trip) => {
  const text = generateNgopiMessage(trip);
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  const ngopiUrl = `https://ngopi.top/contacts?join=BoomBoom`;
  window.open(ngopiUrl, '_blank', 'noopener,noreferrer');
};

// Buka WhatsApp click-to-chat langsung dengan pesan terformat
export const openWhatsAppDispatch = (trip, targetPhone = '') => {
  const message = generateNgopiMessage(trip);
  const cleanPhone = (targetPhone || '').replace(/[^0-9]/g, '');
  const waUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
};

// Audio chime sintetis via Web Audio API (tidak butuh file eksternal)
export const playOrderNotificationSound = () => {
  try {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    
    // Nada pertama (880 Hz - A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Nada kedua (1320 Hz - E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.15);
    gain2.gain.setValueAtTime(0.25, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.45);
  } catch (err) {
    console.warn('[BoomBoom Audio] Tidak dapat membunyikan chime:', err);
  }
};

/**
 * Buat dokumen order riil di Firestore
 */
export const createPilotTripOrder = async (bookingData, userProfile = null) => {
  const tripId = `BOOM-${Date.now().toString().slice(-6)}`;
  const tripDocRef = doc(db, 'boomboom_trips', tripId);

  const payload = {
    trip_id: tripId,
    passenger_id: userProfile?.uid || userProfile?.id || 'GUEST-USER',
    passenger_name: userProfile?.displayName || userProfile?.name || 'Warga Cibarani',
    passenger_phone: userProfile?.phoneNumber || userProfile?.phone || '',
    pickup_address: bookingData.pickupAddress || 'Sentra Bibit Bambu Cibarani',
    pickup_coords: bookingData.pickupCoords || { lat: -6.6521, lng: 107.6932 },
    destination_address: bookingData.destinationAddress || 'Pasar Desa Cibarani, Subang',
    destination_coords: bookingData.destinationCoords || { lat: -6.6850, lng: 107.7200 },
    service_type: bookingData.serviceType || 'BoomRide',
    is_ev: Boolean(bookingData.isEvVehicle),
    distance_km: bookingData.fareCalc?.distanceKm || 4.5,
    duration_min: bookingData.fareCalc?.durationMin || 12,
    fare: bookingData.fareCalc?.grossFare || 18650,
    payment_method: 'Tunai (Cash di Tempat)',
    payment_status: 'PENDING_CASH',
    pilot_region: 'Subang - Cibarani',
    status: 'REQUESTED',
    created_at: new Date().toISOString(),
    server_time: serverTimestamp()
  };

  await setDoc(tripDocRef, payload);
  return payload;
};

/**
 * Dengarkan perubahan status order tertentu (untuk layar penumpang)
 */
export const subscribePilotTripStatus = (tripId, onUpdate) => {
  if (!tripId) return () => {};
  const tripDocRef = doc(db, 'boomboom_trips', tripId);
  return onSnapshot(tripDocRef, (snap) => {
    if (snap.exists()) {
      onUpdate(snap.data());
    }
  }, (err) => {
    console.warn('[BoomBoom Firestore] Error mendengarkan status trip:', err);
  });
};

/**
 * Dengarkan pesanan masuk yang berstatus 'REQUESTED' (untuk dasbor pengemudi)
 */
export const subscribeIncomingOrders = (onNewOrders) => {
  try {
    const tripsCol = collection(db, 'boomboom_trips');
    const q = query(
      tripsCol,
      where('status', '==', 'REQUESTED'),
      limit(10)
    );

    return onSnapshot(q, (snapshot) => {
      const orders = [];
      snapshot.forEach(docSnap => {
        orders.push({ id: docSnap.id, ...docSnap.data() });
      });
      orders.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      onNewOrders(orders);
    }, (err) => {
      console.warn('[BoomBoom Firestore] Error mendengarkan order masuk:', err);
    });
  } catch (err) {
    console.warn('[BoomBoom Firestore] Gagal membuat query order:', err);
    return () => {};
  }
};

/**
 * Driver menerima pesanan di Firestore
 */
export const acceptPilotOrderInFirestore = async (tripId, driverInfo) => {
  if (!tripId) return;
  const tripDocRef = doc(db, 'boomboom_trips', tripId);
  await updateDoc(tripDocRef, {
    status: 'DRIVER_ASSIGNED',
    driver_id: driverInfo?.driver_id || 'DRV-CIBARANI-01',
    driver_name: driverInfo?.name || 'Asep Saepulloh',
    driver_phone: driverInfo?.phone || '+62 812-3456-7890',
    driver_photo: driverInfo?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    plate_number: driverInfo?.plate_number || 'D 4892 BB',
    vehicle_model: driverInfo?.vehicle_brand || 'Honda Vario 160 (Hijau)',
    assigned_at: new Date().toISOString()
  });
};

/**
 * Update step perjalanan oleh driver (DRIVER_ARRIVING, DRIVER_ARRIVED, ON_TRIP, COMPLETED, CANCELLED)
 */
export const updatePilotTripStep = async (tripId, nextStep) => {
  if (!tripId) return;
  const tripDocRef = doc(db, 'boomboom_trips', tripId);
  const updateData = {
    status: nextStep,
    updated_at: new Date().toISOString()
  };
  if (nextStep === 'COMPLETED') {
    updateData.completed_at = new Date().toISOString();
    updateData.payment_status = 'PAID_CASH';
  }
  await updateDoc(tripDocRef, updateData);
};
