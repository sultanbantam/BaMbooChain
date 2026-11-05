import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { calculateHaversineDistance } from './mapAdapter';
import { calculateFare } from './fareEngine';

/**
 * Service untuk BoomBoom Tahap I & Tahap II (Backend Pilot)
 * Mencakup:
 * - Sinkronisasi Order & Trip Database Real-time (boomboom_trips)
 * - Verifikasi Pengemudi & Operator di Firestore (boomboom_driver_profiles, boomboom_operator_profiles)
 * - Geospatial Matching Engine (Pencocokan Pengemudi Terdekat & Live GPS Heartbeat)
 * - Server-side Fare Validation & Payment Sandbox (QRIS / Midtrans / Ledger boomboom_payments)
 * - BMC Reward Ledger Claim (boomboom_rewards)
 * - Audit Trail & Security Logs (boomboom_audit_logs)
 * - Komunikasi Komunitas ngopi.top & WhatsApp Dispatch
 */

// ============================================================================
// 1. AUDIT LOGS ENGINE (boomboom_audit_logs)
// ============================================================================
export const recordAuditLog = async ({ action, entityId, details, actorId = 'SYSTEM', actorName = 'Sistem BoomBoom' }) => {
  try {
    const logId = `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const logRef = doc(db, 'boomboom_audit_logs', logId);
    const payload = {
      log_id: logId,
      action,
      entity_id: entityId || '-',
      details: typeof details === 'string' ? details : JSON.stringify(details),
      actor_id: actorId,
      actor_name: actorName,
      timestamp: new Date().toISOString(),
      server_time: serverTimestamp()
    };
    await setDoc(logRef, payload);
    return payload;
  } catch (err) {
    console.warn('[BoomBoom Audit] Fallback local audit log:', err);
    return null;
  }
};

export const subscribeAuditLogs = (onUpdate) => {
  try {
    const colRef = collection(db, 'boomboom_audit_logs');
    const q = query(colRef, limit(25));
    return onSnapshot(q, (snapshot) => {
      const logs = [];
      snapshot.forEach((docSnap) => logs.push({ id: docSnap.id, ...docSnap.data() }));
      logs.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
      onUpdate(logs);
    }, (err) => {
      console.warn('[BoomBoom Audit] Gagal memuat audit logs:', err);
    });
  } catch {
    return () => {};
  }
};

// ============================================================================
// 2. KOMUNIKASI NGOPI.TOP, WHATSAPP & AUDIO NOTIFICATION
// ============================================================================
export const generateNgopiMessage = (trip) => {
  const tripId = trip.trip_id || trip.id || 'TRIP-DEMO';
  const instantCode = trip.instant_code || trip.instantCode || '';
  const passenger = trip.passenger_name || 'Pengguna BaMbooChain';
  const pickup = trip.pickup_address || 'Sentra Bibit Bambu Cibarani';
  const dest = trip.destination_address || 'Pasar Desa Cibarani, Subang';
  const service = trip.service_type || 'BoomRide';
  const fare = trip.fare || trip.grossFare || 18650;
  const distance = trip.distance_km || 4.5;
  const duration = trip.duration_min || 12;
  const paymentMethod = trip.payment_method || 'QRIS / Tunai';

  return [
    `🛵 *ORDER BOOMBOOM MASUK (PILOT TAHAP II)*`,
    `📋 No. Trip: #${tripId}`,
    ...(instantCode ? [`🔑 *KODE BOOM-INSTAN: ${instantCode}* (Masukkan di Dasbor Driver)`] : []),
    `⚡ Layanan: ${service}`,
    `👤 Penumpang: ${passenger}`,
    `📍 Titik Jemput: ${pickup}`,
    `🎯 Titik Tujuan: ${dest}`,
    `📏 Jarak & Waktu: ±${distance} km (${duration} menit)`,
    `💰 Tarif (${paymentMethod}): Rp ${Number(fare).toLocaleString('id-ID')}`,
    ``,
    `👉 Buka Dasbor Pengemudi:`,
    `https://www.bamboochain.id/#/boomboom/driver/dashboard?tripId=${tripId}`,
    ``,
    `💬 Koordinasi Komunitas via ngopi.top:`,
    `https://ngopi.top/contacts?join=BoomBoom`
  ].join('\n');
};

export const openNgopiChat = (trip) => {
  const text = generateNgopiMessage(trip);
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  const customUrl = trip?.driver_ngopi_chat_url || `https://ngopi.top/contacts?join=BoomBoom`;
  window.open(customUrl, '_blank', 'noopener,noreferrer');
};

export const openWhatsAppDispatch = (trip, targetPhone = '') => {
  const message = generateNgopiMessage(trip);
  const cleanPhone = (targetPhone || '').replace(/[^0-9]/g, '');
  const waUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
};

export const playOrderNotificationSound = () => {
  try {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
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

// ============================================================================
// 3. GEOSPATIAL MATCHING ENGINE & DRIVER VERIFICATION (Tahap II)
// ============================================================================
/**
 * Mencari pengemudi terverifikasi & online terdekat berdasarkan jarak geospasial
 */
export const findBestMatchingDriver = (pickupCoords, serviceType = 'BoomRide', driversList = []) => {
  const originLat = pickupCoords?.lat || -6.6521;
  const originLng = pickupCoords?.lng || 107.6932;

  // Filter driver VERIFIED dan isOnline
  let candidates = (driversList || []).filter(
    (d) => d.status === 'VERIFIED' && d.isOnline
  );

  // Utamakan jenis layanan yang sesuai (BoomRide vs BoomCar)
  const exactTypeCandidates = candidates.filter((d) => {
    if (serviceType === 'BoomCar') return d.vehicle_type === 'BoomCar';
    return d.vehicle_type === 'BoomRide' || !d.vehicle_type;
  });

  if (exactTypeCandidates.length > 0) {
    candidates = exactTypeCandidates;
  }

  if (candidates.length === 0 && driversList.length > 0) {
    candidates = [driversList[0]];
  }

  // Hitung jarak ke titik jemput & skor kecocokan (jarak + rating)
  const scored = candidates.map((d) => {
    const dLat = d.currentLat || -6.6515;
    const dLng = d.currentLng || 107.6925;
    const rawDistKm = calculateHaversineDistance(originLat, originLng, dLat, dLng);
    const pickupDistanceKm = Number(Math.max(0.2, rawDistKm * 1.3).toFixed(1));
    const pickupEtaMin = Math.max(2, Math.ceil((pickupDistanceKm / 30) * 60));
    const score = (d.rating || 4.8) * 20 - pickupDistanceKm * 5;

    return {
      ...d,
      pickupDistanceKm,
      pickupEtaMin,
      matchScore: Number(score.toFixed(1))
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return {
    bestDriver: scored[0] || null,
    rankedCandidates: scored
  };
};

/**
 * Simpan pendaftaran pengemudi ke koleksi Firestore boomboom_driver_profiles
 */
export const registerDriverInFirestore = async (driverObj, userProfile = null) => {
  try {
    const driverId = driverObj.driver_id || `DRV-${Date.now().toString().slice(-4)}`;
    const docRef = doc(db, 'boomboom_driver_profiles', driverId);
    const payload = {
      ...driverObj,
      driver_id: driverId,
      user_id: userProfile?.uid || userProfile?.id || driverObj.user_id || 'USR-CURRENT',
      user_email: userProfile?.email || driverObj.email || '',
      updated_at: new Date().toISOString(),
      server_time: serverTimestamp()
    };
    await setDoc(docRef, payload);
    await recordAuditLog({
      action: 'DRIVER_REGISTERED',
      entityId: driverId,
      details: `Pengemudi baru mendaftar: ${payload.name} (${payload.plate_number}) - Wilayah ${payload.operating_region}`,
      actorId: payload.user_id,
      actorName: payload.name
    });
    return payload;
  } catch (err) {
    console.warn('[BoomBoom Driver] Gagal simpan ke Firestore, menggunakan state lokal:', err);
    return driverObj;
  }
};

/**
 * Update status verifikasi pengemudi di Firestore (VERIFIED, REJECTED, SUSPENDED)
 */
export const verifyDriverStatusInFirestore = async (driverId, newStatus, verifierName = 'Operator / Admin') => {
  try {
    const docRef = doc(db, 'boomboom_driver_profiles', driverId);
    await updateDoc(docRef, {
      status: newStatus,
      verified_at: new Date().toISOString(),
      verified_by: verifierName
    });
    await recordAuditLog({
      action: `DRIVER_${newStatus}`,
      entityId: driverId,
      details: `Status pengemudi ${driverId} diubah menjadi ${newStatus} oleh ${verifierName}`,
      actorName: verifierName
    });
    return true;
  } catch (err) {
    console.warn('[BoomBoom Verify] Dokumen belum ada di Firestore, membuat/sinkronisasi dokumen:', err);
    try {
      const docRef = doc(db, 'boomboom_driver_profiles', driverId);
      await setDoc(docRef, {
        driver_id: driverId,
        status: newStatus,
        verified_at: new Date().toISOString(),
        verified_by: verifierName
      }, { merge: true });
      await recordAuditLog({
        action: `DRIVER_${newStatus}`,
        entityId: driverId,
        details: `Status pengemudi ${driverId} diubah menjadi ${newStatus} oleh ${verifierName}`,
        actorName: verifierName
      });
    } catch {
      // Ignore
    }
    return false;
  }
};

/**
 * Pancarkan titik lokasi GPS pengemudi secara live saat ONLINE
 */
export const updateDriverLiveLocationInFirestore = async (driverId, lat, lng, isOnline = true) => {
  if (!driverId) return;
  try {
    const docRef = doc(db, 'boomboom_driver_profiles', driverId);
    await setDoc(docRef, {
      driver_id: driverId,
      currentLat: lat,
      currentLng: lng,
      isOnline,
      last_heartbeat: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('[BoomBoom GPS Heartbeat] Gagal kirim lokasi live:', err);
  }
};

/**
 * Dengarkan daftar pengemudi dari Firestore secara real-time
 */
export const subscribeFirestoreDrivers = (onUpdate) => {
  try {
    const colRef = collection(db, 'boomboom_driver_profiles');
    const q = query(colRef, limit(50));
    return onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() }));
      onUpdate(list);
    }, (err) => {
      console.warn('[BoomBoom Drivers] Gagal mendengarkan koleksi driver:', err);
    });
  } catch {
    return () => {};
  }
};

/**
 * Simpan pendaftaran Mitra Operator Wilayah ke Firestore
 */
export const registerOperatorInFirestore = async (opObj, userProfile = null) => {
  try {
    const opId = opObj.operator_id || `OP-${Date.now().toString().slice(-4)}`;
    const docRef = doc(db, 'boomboom_operator_profiles', opId);
    const payload = {
      ...opObj,
      operator_id: opId,
      user_id: userProfile?.uid || userProfile?.id || 'USR-CURRENT',
      updated_at: new Date().toISOString(),
      server_time: serverTimestamp()
    };
    await setDoc(docRef, payload);
    await recordAuditLog({
      action: 'OPERATOR_REGISTERED',
      entityId: opId,
      details: `Mitra Wilayah baru terdaftar: ${payload.name} (${payload.type}) - ${payload.region}`,
      actorName: payload.contact_person || payload.name
    });
    return payload;
  } catch (err) {
    console.warn('[BoomBoom Operator] Fallback local operator registration:', err);
    return opObj;
  }
};

// ============================================================================
// 4. SERVER-SIDE FARE VALIDATION & PAYMENT SANDBOX (Tahap II)
// ============================================================================
/**
 * Validasi tarif server-side & buat transaksi Payment Sandbox (QRIS / Midtrans / VA / Tunai)
 */
export const createPaymentSandboxSession = async ({
  tripId,
  serviceType,
  distanceKm,
  durationMin,
  isEvVehicle,
  paymentMethod,
  passengerName,
  passengerEmail,
  customFareConfig
}) => {
  // 1. Hitung ulang & kunci nilai tarif + bagi hasil secara deterministik
  const validatedFare = calculateFare({
    serviceType,
    distanceKm,
    durationMin,
    customConfig: customFareConfig,
    isEvVehicle
  });

  const paymentId = `PAY-${Date.now().toString().slice(-6)}`;
  const isCash = (paymentMethod || '').toLowerCase().includes('tunai') || (paymentMethod || '').toLowerCase().includes('cash');

  let midtransToken = null;
  let midtransRedirectUrl = null;

  // 2. Panggil endpoint serverless /api/payment/midtrans-charge jika non-tunai
  if (!isCash) {
    try {
      const res = await fetch('/api/payment/midtrans-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: `${tripId || 'BOOM'}-${paymentId}`,
          gross_amount: validatedFare.grossFare,
          items: [
            {
              id: serviceType || 'BoomRide',
              price: validatedFare.grossFare,
              quantity: 1,
              name: `Perjalanan ${serviceType} (${distanceKm} km)`
            }
          ],
          customer_details: {
            first_name: passengerName || 'Penumpang BoomBoom',
            email: passengerEmail || 'passenger@bamboochain.id'
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        midtransToken = data.token;
        midtransRedirectUrl = data.redirect_url;
      }
    } catch (err) {
      console.warn('[BoomBoom Payment Sandbox] Menggunakan simulator QRIS internal:', err);
    }
  }

  const paymentRecord = {
    payment_id: paymentId,
    trip_id: tripId || `BOOM-${Date.now().toString().slice(-6)}`,
    amount: validatedFare.grossFare,
    currency: 'IDR',
    payment_method: paymentMethod || 'QRIS / Rupiah',
    provider: isCash ? 'CASH_DIRECT' : 'MIDTRANS_QRIS_SANDBOX',
    status: isCash ? 'PENDING_CASH' : 'PENDING_SANDBOX',
    splits: validatedFare.splits,
    qris_payload: `00020101021226610014ID.CO.BAMBOOCHAIN.WWW011893600914${paymentId}520441215303360540${validatedFare.grossFare}5802ID5914BOOMBOOM DESA6006SUBANG6304A1B2`,
    midtrans_token: midtransToken || `sandbox_snap_${paymentId}`,
    midtrans_redirect_url: midtransRedirectUrl || 'https://simulator.sandbox.midtrans.com/qris/index',
    created_at: new Date().toISOString()
  };

  try {
    const payDocRef = doc(db, 'boomboom_payments', paymentId);
    await setDoc(payDocRef, {
      ...paymentRecord,
      server_time: serverTimestamp()
    });
  } catch (err) {
    console.warn('[BoomBoom Payment] Gagal menyimpan sesi pembayaran ke Firestore:', err);
  }

  return {
    paymentRecord,
    validatedFare
  };
};

/**
 * Konfirmasi lunas pembayaran Sandbox (QRIS / Transfer / E-Wallet)
 */
export const settlePaymentSandboxInFirestore = async (paymentId, tripId, amount = 0) => {
  const paidAt = new Date().toISOString();
  try {
    if (paymentId) {
      const payRef = doc(db, 'boomboom_payments', paymentId);
      await setDoc(payRef, {
        status: 'PAID',
        paid_at: paidAt
      }, { merge: true });
    }
    if (tripId) {
      const tripRef = doc(db, 'boomboom_trips', tripId);
      await setDoc(tripRef, {
        payment_status: 'PAID_SANDBOX',
        paid_at: paidAt
      }, { merge: true });
    }
    await recordAuditLog({
      action: 'PAYMENT_SETTLED',
      entityId: paymentId || tripId,
      details: `Pembayaran Sandbox sebesar Rp ${Number(amount).toLocaleString('id-ID')} untuk Trip #${tripId} berhasil diverifikasi LUNAS.`
    });
  } catch (err) {
    console.warn('[BoomBoom Payment] Gagal update status lunas di Firestore:', err);
  }
  return { status: 'PAID', paid_at: paidAt };
};

// ============================================================================
// 5. TRIP ORDER & REAL-TIME SYNC (boomboom_trips)
// ============================================================================
export const createPilotTripOrder = async (bookingData, userProfile = null) => {
  const tripId = `BOOM-${Date.now().toString().slice(-6)}`;
  const instantCode = bookingData.instantCode || Math.floor(100000 + Math.random() * 900000).toString();
  const tripDocRef = doc(db, 'boomboom_trips', tripId);

  const validatedFare = calculateFare({
    serviceType: bookingData.serviceType || 'BoomRide',
    distanceKm: bookingData.fareCalc?.distanceKm || 4.5,
    durationMin: bookingData.fareCalc?.durationMin || 12,
    isEvVehicle: Boolean(bookingData.isEvVehicle)
  });

  const payload = {
    trip_id: tripId,
    instant_code: String(instantCode).replace(/[^0-9]/g, ''),
    passenger_id: userProfile?.uid || userProfile?.id || 'GUEST-USER',
    passenger_name: userProfile?.displayName || userProfile?.name || 'Warga Cibarani',
    passenger_phone: userProfile?.phoneNumber || userProfile?.phone || '',
    pickup_address: bookingData.pickupAddress || 'Sentra Bibit Bambu Cibarani',
    pickup_coords: bookingData.pickupCoords || { lat: -6.6521, lng: 107.6932 },
    destination_address: bookingData.destinationAddress || 'Pasar Desa Cibarani, Subang',
    destination_coords: bookingData.destinationCoords || { lat: -6.6850, lng: 107.7200 },
    service_type: bookingData.serviceType || 'BoomRide',
    is_ev: Boolean(bookingData.isEvVehicle),
    distance_km: validatedFare.distanceKm,
    duration_min: validatedFare.durationMin,
    fare: validatedFare.grossFare,
    splits: validatedFare.splits,
    payment_method: bookingData.paymentMethod || 'QRIS / Rupiah',
    payment_status: bookingData.paymentStatus || 'PENDING',
    payment_id: bookingData.paymentId || null,
    matched_driver_id: bookingData.matchedDriver?.driver_id || null,
    matched_driver_name: bookingData.matchedDriver?.name || null,
    pilot_region: bookingData.pilotRegion || 'Subang - Cibarani',
    pilot_phase: 'PHASE_2_BACKEND_PILOT',
    status: 'REQUESTED',
    created_at: new Date().toISOString(),
    server_time: serverTimestamp()
  };

  await setDoc(tripDocRef, payload);
  await recordAuditLog({
    action: 'TRIP_CREATED',
    entityId: tripId,
    details: `Order ${payload.service_type} (Kode Instan: ${payload.instant_code}) dari "${payload.pickup_address}" ke "${payload.destination_address}" (${payload.distance_km} km, Rp ${payload.fare.toLocaleString('id-ID')})`,
    actorId: payload.passenger_id,
    actorName: payload.passenger_name
  });
  return payload;
};

/**
 * Sistem BoomInstan (Gojek Instan Mode):
 * Driver memasukkan 6-digit Kode Instan dari pemesan untuk langsung mengambil & memulai perjalanan tanpa antre radar
 */
export const claimInstantOrderByCodeInFirestore = async (rawCode, driverInfo) => {
  const cleanCode = String(rawCode || '').replace(/[^0-9]/g, '');
  if (!cleanCode || cleanCode.length < 4) {
    throw new Error('Kode Instan harus berupa 4–6 digit angka.');
  }

  const tripsCol = collection(db, 'boomboom_trips');
  const q = query(tripsCol, where('instant_code', '==', cleanCode), limit(5));
  const snap = await getDocs(q);

  if (snap.empty) {
    return null;
  }

  let matchedDoc = null;
  snap.forEach((docSnap) => {
    const data = docSnap.data();
    if (!matchedDoc && data.status !== 'COMPLETED' && data.status !== 'CANCELLED') {
      matchedDoc = { id: docSnap.id, ...data };
    }
  });

  if (!matchedDoc) {
    matchedDoc = { id: snap.docs[0].id, ...snap.docs[0].data() };
  }

  const tripId = matchedDoc.trip_id || matchedDoc.id;
  const driverName = driverInfo?.name || 'Asep Saepulloh';
  const tripDocRef = doc(db, 'boomboom_trips', tripId);

  const updates = {
    status: 'ON_TRIP',
    matched_via: 'BOOM_INSTAN_CODE',
    driver_id: driverInfo?.driver_id || 'DRV-001',
    driver_name: driverName,
    driver_phone: driverInfo?.phone || '+62 812-3456-7890',
    driver_photo: driverInfo?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    driver_ngopi_username: driverInfo?.ngopi_username || '@majelisngopi',
    driver_ngopi_chat_url: driverInfo?.ngopi_chat_url || 'https://ngopi.top/chat/f1c8c427-21bf-4fc1-8e99-9e651114d615?name=Ade%20Gunawan',
    plate_number: driverInfo?.plate_number || 'D 4892 BB',
    vehicle_model: driverInfo?.vehicle_brand || 'Honda Vario 160 EV',
    assigned_at: new Date().toISOString(),
    started_at: new Date().toISOString()
  };

  await updateDoc(tripDocRef, updates);
  await recordAuditLog({
    action: 'INSTANT_CODE_PAIRED',
    entityId: tripId,
    details: `Kode BoomInstan [${cleanCode}] berhasil dipasangkan oleh Pengemudi ${driverName} (${updates.plate_number}) untuk Penumpang ${matchedDoc.passenger_name}`,
    actorId: updates.driver_id,
    actorName: driverName
  });

  return {
    ...matchedDoc,
    ...updates
  };
};

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

export const acceptPilotOrderInFirestore = async (tripId, driverInfo) => {
  if (!tripId) return;
  const tripDocRef = doc(db, 'boomboom_trips', tripId);
  const driverName = driverInfo?.name || 'Asep Saepulloh';
  await updateDoc(tripDocRef, {
    status: 'DRIVER_ASSIGNED',
    driver_id: driverInfo?.driver_id || 'DRV-CIBARANI-01',
    driver_name: driverName,
    driver_phone: driverInfo?.phone || '+62 812-3456-7890',
    driver_photo: driverInfo?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    driver_ngopi_username: driverInfo?.ngopi_username || '@majelisngopi',
    driver_ngopi_chat_url: driverInfo?.ngopi_chat_url || 'https://ngopi.top/chat/f1c8c427-21bf-4fc1-8e99-9e651114d615?name=Ade%20Gunawan',
    plate_number: driverInfo?.plate_number || 'D 4892 BB',
    vehicle_model: driverInfo?.vehicle_brand || 'Honda Vario 160 (Hijau)',
    assigned_at: new Date().toISOString()
  });
  await recordAuditLog({
    action: 'DRIVER_ASSIGNED',
    entityId: tripId,
    details: `Pengemudi ${driverName} (${driverInfo?.plate_number || 'D 4892 BB'}) menerima Trip #${tripId}`,
    actorId: driverInfo?.driver_id || 'DRV-001',
    actorName: driverName
  });
};

export const updatePilotTripStep = async (tripId, nextStep) => {
  if (!tripId) return;
  const tripDocRef = doc(db, 'boomboom_trips', tripId);
  const updateData = {
    status: nextStep,
    updated_at: new Date().toISOString()
  };
  if (nextStep === 'COMPLETED') {
    updateData.completed_at = new Date().toISOString();
    updateData.payment_status = 'PAID';
  }
  await updateDoc(tripDocRef, updateData);
  await recordAuditLog({
    action: `TRIP_${nextStep}`,
    entityId: tripId,
    details: `Status perjalanan #${tripId} diperbarui menjadi ${nextStep}`
  });
};

// ============================================================================
// 6. REWARD LEDGER CLAIM & SOS INCIDENTS (boomboom_rewards & boomboom_incidents)
// ============================================================================
export const claimRewardInFirestore = async (rewardObj, userProfile = null) => {
  if (!rewardObj) return null;
  const claimedAt = new Date().toISOString();
  const userId = userProfile?.uid || userProfile?.id || rewardObj.user_id || 'USR-CURRENT';
  try {
    const rewardRef = doc(db, 'boomboom_rewards', rewardObj.reward_id);
    await setDoc(rewardRef, {
      ...rewardObj,
      user_id: userId,
      status: 'CLAIMED',
      claimed_at: claimedAt,
      server_time: serverTimestamp()
    }, { merge: true });

    await recordAuditLog({
      action: 'REWARD_CLAIMED',
      entityId: rewardObj.reward_id,
      details: `Klaim Reward +${rewardObj.bmc_amount} BMC (${rewardObj.reward_label}) oleh ${userProfile?.displayName || userId}`,
      actorId: userId,
      actorName: userProfile?.displayName || 'Pengguna BaMbooChain'
    });
  } catch (err) {
    console.warn('[BoomBoom Reward] Fallback local reward claim:', err);
  }
  return { ...rewardObj, status: 'CLAIMED', claimed_at: claimedAt };
};

export const recordSosIncidentInFirestore = async (incidentObj) => {
  if (!incidentObj) return null;
  try {
    const incRef = doc(db, 'boomboom_incidents', incidentObj.incident_id);
    await setDoc(incRef, {
      ...incidentObj,
      server_time: serverTimestamp()
    });
    await recordAuditLog({
      action: 'SOS_TRIGGERED',
      entityId: incidentObj.incident_id,
      details: `Sinyal Darurat SOS dipicu pada Trip #${incidentObj.trip_id} (${incidentObj.latitude}, ${incidentObj.longitude})`,
      actorId: incidentObj.user_id,
      actorName: incidentObj.user_name
    });
  } catch (err) {
    console.warn('[BoomBoom SOS] Fallback local incident record:', err);
  }
  return incidentObj;
};
