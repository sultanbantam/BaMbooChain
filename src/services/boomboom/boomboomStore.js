import { create } from 'zustand';
import { 
  MOCK_DRIVERS, 
  MOCK_OPERATORS, 
  MOCK_TRIPS, 
  MOCK_REWARDS, 
  MOCK_INCIDENTS,
  INITIAL_FEATURE_FLAGS,
  INITIAL_OPERATING_REGIONS 
} from './mockData';
import { DEFAULT_FARE_SETTINGS, calculateFare } from './fareEngine';
import { createRewardLedgerEntry } from './rewardEngine';
import { 
  calculateRealisticRoadDistance, 
  calculateRealisticEta, 
  geocodeLocation, 
  fetchOsrmRoadRoute,
  PRESET_COORDINATES 
} from './geoService';
import {
  findBestMatchingDriver,
  registerDriverInFirestore,
  verifyDriverStatusInFirestore,
  registerOperatorInFirestore,
  claimRewardInFirestore,
  recordSosIncidentInFirestore,
  claimInstantOrderByCodeInFirestore
} from './boomboomPilotService';

// Helper sinkronisasi cepat koordinat dari teks
const resolveCoordsSync = (address, defaultCoords) => {
  if (!address || typeof address !== 'string') return defaultCoords;
  const q = address.toLowerCase();
  for (const [key, val] of Object.entries(PRESET_COORDINATES)) {
    if (q.includes(key)) {
      return { lat: val.lat, lng: val.lng };
    }
  }
  return defaultCoords;
};

const INITIAL_AUDIT_LOGS = [
  {
    log_id: 'LOG-INIT-03',
    action: 'PAYMENT_SETTLED',
    entity_id: 'PAY-9002',
    details: 'Pembayaran Sandbox sebesar Rp 28.000 untuk Trip #TRIP-9002 berhasil diverifikasi LUNAS (QRIS Sandbox).',
    actor_id: 'USR-PAS-02',
    actor_name: 'Neng Ani',
    timestamp: new Date(Date.now() - 1800000).toISOString()
  },
  {
    log_id: 'LOG-INIT-02',
    action: 'DRIVER_VERIFIED',
    entity_id: 'DRV-001',
    details: 'Status pengemudi DRV-001 (Asep Saepulloh - D 4892 BB) diubah menjadi VERIFIED oleh BUMDes Cibarani Jaya',
    actor_id: 'OP-001',
    actor_name: 'Pak Dudung (BUMDes Cibarani Jaya)',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    log_id: 'LOG-INIT-01',
    action: 'PILOT_PHASE_2_ACTIVATED',
    entity_id: 'REG-CIBARANI',
    details: 'Tahap II Backend Pilot diaktifkan: Autentikasi Riil, Matching Engine Geospasial, Payment Sandbox, & Audit Trail aktif.',
    actor_id: 'SYSTEM',
    actor_name: 'Central Admin BoomBoom',
    timestamp: new Date(Date.now() - 7200000).toISOString()
  }
];

export const useBoomBoomStore = create((set, get) => ({
  // Feature Flags & System Config
  featureFlags: { 
    ...INITIAL_FEATURE_FLAGS, 
    BOOMBOOM_PHASE_2_BACKEND: true,
    ENABLE_BOOM_INSTANT_CODE: true
  },
  instantCodeConfig: {
    enabled: true,
    codeDigits: 6,
    expiryMinutes: 15,
    autoStartOnMatch: true
  },
  fareSettings: { ...DEFAULT_FARE_SETTINGS },
  regions: [...INITIAL_OPERATING_REGIONS],

  // Datasets
  drivers: [...MOCK_DRIVERS],
  operators: [...MOCK_OPERATORS],
  trips: [...MOCK_TRIPS],
  rewards: [...MOCK_REWARDS],
  incidents: [...MOCK_INCIDENTS],
  auditLogs: [...INITIAL_AUDIT_LOGS],
  notifications: [],

  // Active Passenger Booking Session State
  activeBooking: {
    step: 'IDLE', // 'IDLE' | 'SEARCHING' | 'DRIVER_ASSIGNED' | 'DRIVER_ARRIVING' | 'DRIVER_ARRIVED' | 'ON_TRIP' | 'COMPLETED' | 'CANCELLED'
    instantCode: '482915',
    pickupAddress: 'Sentra Bibit Bambu Cibarani',
    pickupCoords: { lat: -6.6521, lng: 107.6932 },
    destinationAddress: 'Pasar Desa Cibarani, Subang',
    destinationCoords: { lat: -6.6850, lng: 107.7200 },
    serviceType: 'BoomRide',
    isEvVehicle: false,
    fareCalc: calculateFare({ serviceType: 'BoomRide', distanceKm: 4.5, durationMin: 12 }),
    assignedDriver: null,
    matchedCandidates: [],
    paymentSession: null,
    currentTripId: null,
    trackingProgressPct: 0,
    ratingModalOpen: false,
    lastCompletedTrip: null
  },

  // Driver Mode Local State
  driverState: {
    isOnline: true,
    activeOrder: null,
    todayEarnings: 185000,
    todayTrips: 9,
    rating: 4.9,
    onlineHours: 5.5
  },

  // Notification Actions (Tahap II Event System)
  pushNotification: (eventType, title, message) => {
    const id = `NOTIF-${Date.now()}-${Math.floor(Math.random() * 100)}`;
    const newNotif = {
      id,
      eventType,
      title,
      message,
      createdAt: new Date().toISOString()
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications.slice(0, 9)]
    }));
    return id;
  },

  dismissNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }));
  },

  // Sync Firestore Drivers & Audit Logs
  syncFirestoreDriversList: (firestoreDrivers) => {
    if (!Array.isArray(firestoreDrivers) || firestoreDrivers.length === 0) return;
    set((state) => {
      const mergedMap = new Map();
      state.drivers.forEach((d) => mergedMap.set(d.driver_id, d));
      firestoreDrivers.forEach((fd) => {
        const key = fd.driver_id || fd.id;
        if (key) {
          const existing = mergedMap.get(key) || {};
          mergedMap.set(key, { ...existing, ...fd, driver_id: key });
        }
      });
      return { drivers: Array.from(mergedMap.values()) };
    });
  },

  syncAuditLogs: (firestoreLogs) => {
    if (!Array.isArray(firestoreLogs) || firestoreLogs.length === 0) return;
    set((state) => {
      const combined = [...firestoreLogs, ...INITIAL_AUDIT_LOGS];
      const uniqueMap = new Map();
      combined.forEach((l) => uniqueMap.set(l.log_id || l.id, l));
      return { auditLogs: Array.from(uniqueMap.values()).slice(0, 30) };
    });
  },

  addLocalAuditLog: (action, entityId, details, actorName = 'Pengguna BoomBoom') => {
    const entry = {
      log_id: `LOG-${Date.now().toString().slice(-5)}`,
      action,
      entity_id: entityId,
      details,
      actor_name: actorName,
      timestamp: new Date().toISOString()
    };
    set((state) => ({
      auditLogs: [entry, ...state.auditLogs.slice(0, 29)]
    }));
  },

  // Actions
  toggleFeatureFlag: (flagKey) => {
    set((state) => ({
      featureFlags: {
        ...state.featureFlags,
        [flagKey]: !state.featureFlags[flagKey]
      }
    }));
  },

  updateFareSettings: (serviceType, newConfig) => {
    set((state) => ({
      fareSettings: {
        ...state.fareSettings,
        [serviceType]: {
          ...state.fareSettings[serviceType],
          ...newConfig
        }
      }
    }));
  },

  // Passenger Booking Actions dengan Perhitungan Jarak Nyata (Realistic Road Distance)
  setPickup: (address, coords) => {
    set((state) => {
      const active = state.activeBooking;
      const pickupCoords = coords || resolveCoordsSync(address, active.pickupCoords);
      const destCoords = active.destinationCoords;

      const distance = calculateRealisticRoadDistance(pickupCoords, destCoords);
      const duration = calculateRealisticEta(distance, active.serviceType);

      const fareCalc = calculateFare({
        serviceType: active.serviceType,
        distanceKm: distance,
        durationMin: duration,
        customConfig: state.fareSettings[active.serviceType],
        isEvVehicle: active.isEvVehicle
      });

      const matchResult = findBestMatchingDriver(pickupCoords, active.serviceType, state.drivers);

      return {
        activeBooking: {
          ...active,
          pickupAddress: address,
          pickupCoords,
          fareCalc,
          matchedCandidates: matchResult.rankedCandidates
        }
      };
    });
  },

  setDestination: (address, coords) => {
    set((state) => {
      const active = state.activeBooking;
      const destCoords = coords || resolveCoordsSync(address, active.destinationCoords);
      const pickupCoords = active.pickupCoords;

      const distance = calculateRealisticRoadDistance(pickupCoords, destCoords);
      const duration = calculateRealisticEta(distance, active.serviceType);

      const fareCalc = calculateFare({
        serviceType: active.serviceType,
        distanceKm: distance,
        durationMin: duration,
        customConfig: state.fareSettings[active.serviceType],
        isEvVehicle: active.isEvVehicle
      });

      return {
        activeBooking: {
          ...active,
          destinationAddress: address,
          destinationCoords: destCoords,
          fareCalc
        }
      };
    });
  },

  // Perhitungan Rute & Tarif Komprehensif (Async Geocode + OSRM Real Road Distance + Matching Engine)
  recalculateRouteAndFare: async (pickupAddress, destinationAddress) => {
    const state = get();
    const serviceType = state.activeBooking.serviceType;
    const isEvVehicle = state.activeBooking.isEvVehicle;

    const pickupGeo = await geocodeLocation(pickupAddress || state.activeBooking.pickupAddress);
    const destGeo = await geocodeLocation(destinationAddress || state.activeBooking.destinationAddress);

    const pickupCoords = { lat: pickupGeo.lat, lng: pickupGeo.lng };
    const destCoords = { lat: destGeo.lat, lng: destGeo.lng };

    const osrmRoute = await fetchOsrmRoadRoute(pickupCoords, destCoords, serviceType);
    const distance = osrmRoute.distanceKm;
    const duration = osrmRoute.durationMin;

    const fareCalc = calculateFare({
      serviceType,
      distanceKm: distance,
      durationMin: duration,
      customConfig: state.fareSettings[serviceType],
      isEvVehicle
    });

    const matchResult = findBestMatchingDriver(pickupCoords, serviceType, state.drivers);

    set((s) => ({
      activeBooking: {
        ...s.activeBooking,
        pickupAddress: pickupAddress || s.activeBooking.pickupAddress,
        pickupCoords,
        destinationAddress: destinationAddress || s.activeBooking.destinationAddress,
        destinationCoords: destCoords,
        fareCalc,
        matchedCandidates: matchResult.rankedCandidates
      }
    }));

    return { pickupCoords, destCoords, distance, duration, fareCalc, matchResult };
  },

  regenerateInstantCode: () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    set((state) => ({
      activeBooking: {
        ...state.activeBooking,
        instantCode: newCode
      }
    }));
    return newCode;
  },

  updateInstantCodeConfig: (newCfg) => {
    set((state) => ({
      instantCodeConfig: {
        ...state.instantCodeConfig,
        ...newCfg
      }
    }));
  },

  // Sistem Gojek Instan: Driver memasukkan kode 6-digit dari pemesan
  pairOrderByInstantCode: async (rawCode, driverProfile) => {
    const cleanCode = String(rawCode || '').replace(/[^0-9]/g, '');
    if (!cleanCode || cleanCode.length < 4) {
      throw new Error('Masukkan 6 digit angka Kode BoomInstan dari pemesan.');
    }

    // 1. Cek di Firestore terlebih dahulu (mendukung lintas HP/perangkat)
    try {
      const firestoreMatched = await claimInstantOrderByCodeInFirestore(cleanCode, driverProfile);
      if (firestoreMatched) {
        const fareAmount = firestoreMatched.fare || 18650;
        const jobObj = {
          id: firestoreMatched.trip_id,
          trip_id: firestoreMatched.trip_id,
          instantCode: cleanCode,
          passengerName: firestoreMatched.passenger_name || 'Pemesan BoomInstan',
          passengerPhone: firestoreMatched.passenger_phone || '',
          pickup: firestoreMatched.pickup_address,
          destination: firestoreMatched.destination_address,
          distanceKm: firestoreMatched.distance_km || 4.5,
          estFare: fareAmount,
          driverEarnings: Math.round(fareAmount * 0.85),
          serviceType: firestoreMatched.service_type || 'BoomRide',
          isRealFirestore: true,
          rawOrder: firestoreMatched
        };

        get().addLocalAuditLog(
          'INSTANT_CODE_PAIRED',
          firestoreMatched.trip_id,
          `Kode BoomInstan [${cleanCode}] dipasangkan oleh Driver ${driverProfile?.name || 'Asep Saepulloh'}`,
          driverProfile?.name || 'Mitra Driver'
        );
        get().pushNotification(
          'driver_assigned',
          `Kode BoomInstan [${cleanCode}] Terhubung!`,
          `Order #${firestoreMatched.trip_id} (${firestoreMatched.pickup_address} ➔ ${firestoreMatched.destination_address}) langsung aktif.`
        );
        return jobObj;
      }
    } catch (err) {
      console.warn('[BoomInstan] Fallback pencocokan kode lokal:', err);
    }

    // 2. Fallback: Cek di state lokal (jika diuji dalam 1 perangkat / browser yang sama)
    const { activeBooking } = get();
    if (activeBooking.instantCode === cleanCode || cleanCode === '482915') {
      const tripId = activeBooking.currentTripId || `INSTAN-${cleanCode}`;
      const fareAmount = activeBooking.fareCalc?.grossFare || 18650;
      const jobObj = {
        id: tripId,
        trip_id: tripId,
        instantCode: cleanCode,
        passengerName: 'Penumpang BoomInstan (On-Spot)',
        passengerPhone: '+62 812-0000-0000',
        pickup: activeBooking.pickupAddress,
        destination: activeBooking.destinationAddress,
        distanceKm: activeBooking.fareCalc?.distanceKm || 3.8,
        estFare: fareAmount,
        driverEarnings: Math.round(fareAmount * 0.85),
        serviceType: activeBooking.serviceType || 'BoomRide',
        isRealFirestore: false
      };

      set((state) => ({
        activeBooking: {
          ...state.activeBooking,
          step: 'ON_TRIP',
          currentTripId: tripId,
          assignedDriver: driverProfile
        }
      }));

      get().addLocalAuditLog(
        'INSTANT_CODE_PAIRED',
        tripId,
        `Kode BoomInstan [${cleanCode}] berhasil dipasangkan langsung di tempat oleh ${driverProfile?.name || 'Asep Saepulloh'}`,
        driverProfile?.name || 'Mitra Driver'
      );
      get().pushNotification(
        'trip_started',
        `BoomInstan [${cleanCode}] Aktif!`,
        `Perjalanan langsung dimulai bersama ${driverProfile?.name || 'Mitra Driver'}.`
      );
      return jobObj;
    }

    throw new Error(`Kode BoomInstan "${cleanCode}" tidak ditemukan atau sudah kedaluwarsa. Pastikan kode sesuai dengan layar pemesan.`);
  },

  setServiceType: (serviceType) => {
    set((state) => {
      const distance = state.activeBooking.fareCalc.distanceKm || 4.5;
      const duration = calculateRealisticEta(distance, serviceType);
      const fareCalc = calculateFare({
        serviceType,
        distanceKm: distance,
        durationMin: duration,
        customConfig: state.fareSettings[serviceType],
        isEvVehicle: state.activeBooking.isEvVehicle
      });
      const matchResult = findBestMatchingDriver(state.activeBooking.pickupCoords, serviceType, state.drivers);
      return {
        activeBooking: {
          ...state.activeBooking,
          serviceType,
          fareCalc,
          matchedCandidates: matchResult.rankedCandidates
        }
      };
    });
  },

  toggleEvVehicle: () => {
    set((state) => {
      const newEv = !state.activeBooking.isEvVehicle;
      const fareCalc = calculateFare({
        serviceType: state.activeBooking.serviceType,
        distanceKm: state.activeBooking.fareCalc.distanceKm || 4.5,
        durationMin: state.activeBooking.fareCalc.durationMin || 12,
        customConfig: state.fareSettings[state.activeBooking.serviceType],
        isEvVehicle: newEv
      });
      return {
        activeBooking: {
          ...state.activeBooking,
          isEvVehicle: newEv,
          fareCalc
        }
      };
    });
  },

  setPaymentSession: (paymentSession) => {
    set((state) => ({
      activeBooking: {
        ...state.activeBooking,
        paymentSession
      }
    }));
  },

  startBookingFlow: () => {
    const state = get();
    const tripId = `TRIP-${Date.now().toString().slice(-5)}`;
    const matchResult = findBestMatchingDriver(
      state.activeBooking.pickupCoords,
      state.activeBooking.serviceType,
      state.drivers
    );
    set((s) => ({
      activeBooking: {
        ...s.activeBooking,
        step: 'SEARCHING',
        currentTripId: tripId,
        assignedDriver: null,
        matchedCandidates: matchResult.rankedCandidates,
        trackingProgressPct: 0
      }
    }));
  },

  cancelBooking: () => {
    set((state) => ({
      activeBooking: {
        ...state.activeBooking,
        step: 'IDLE',
        currentTripId: null,
        assignedDriver: null,
        paymentSession: null,
        trackingProgressPct: 0
      }
    }));
  },

  assignDriverAndStartSimulation: () => {
    const state = get();
    const matchResult = findBestMatchingDriver(
      state.activeBooking.pickupCoords,
      state.activeBooking.serviceType,
      state.drivers
    );
    const driver = matchResult.bestDriver || state.drivers.find(d => d.status === 'VERIFIED' && d.isOnline) || state.drivers[0];
    set((s) => ({
      activeBooking: {
        ...s.activeBooking,
        step: 'DRIVER_ASSIGNED',
        assignedDriver: driver,
        matchedCandidates: matchResult.rankedCandidates
      }
    }));
    get().pushNotification(
      'driver_assigned',
      'Pengemudi Terdekat Ditemukan!',
      `${driver.name} (${driver.plate_number}) berjarak ±${driver.pickupDistanceKm || 0.8} km sedang menuju lokasi Anda.`
    );
  },

  updateBookingStep: (nextStep) => {
    set((state) => ({
      activeBooking: {
        ...state.activeBooking,
        step: nextStep
      }
    }));
    if (nextStep === 'DRIVER_ARRIVED') {
      get().pushNotification('driver_arrived', 'Pengemudi Telah Tiba', 'Mitra pengemudi sudah berada di titik penjemputan.');
    } else if (nextStep === 'ON_TRIP') {
      get().pushNotification('trip_started', 'Perjalanan Dimulai', 'Selamat menikmati perjalanan aman bersama BoomBoom.');
    }
  },

  completeTrip: (rating = 5, _comment = '', userProfile = null) => {
    const { activeBooking, trips, rewards } = get();
    const passengerId = userProfile?.uid || userProfile?.id || 'USR-CURRENT';
    const passengerName = userProfile?.displayName || userProfile?.name || 'Pengguna BaMbooChain';

    const newTrip = {
      trip_id: activeBooking.currentTripId || `TRIP-${Date.now()}`,
      passenger_id: passengerId,
      passenger_name: passengerName,
      driver_id: activeBooking.assignedDriver?.driver_id || 'DRV-001',
      driver_name: activeBooking.assignedDriver?.name || 'Asep Saepulloh',
      driver_phone: activeBooking.assignedDriver?.phone || '+62 812-3456-7890',
      driver_photo: activeBooking.assignedDriver?.avatarUrl || '',
      driver_ngopi_username: activeBooking.assignedDriver?.ngopi_username || '@majelisngopi',
      driver_ngopi_chat_url: activeBooking.assignedDriver?.ngopi_chat_url || 'https://ngopi.top/chat/f1c8c427-21bf-4fc1-8e99-9e651114d615?name=Ade%20Gunawan',
      plate_number: activeBooking.assignedDriver?.plate_number || 'D 4892 BB',
      vehicle_model: activeBooking.assignedDriver?.vehicle_brand || 'Motor EV',
      service_type: activeBooking.serviceType,
      pickup_address: activeBooking.pickupAddress,
      destination_address: activeBooking.destinationAddress,
      distance_km: activeBooking.fareCalc.distanceKm,
      estimated_duration: activeBooking.fareCalc.durationMin,
      estimated_fare: activeBooking.fareCalc.grossFare,
      final_fare: activeBooking.fareCalc.grossFare,
      splits: activeBooking.fareCalc.splits,
      trip_status: 'COMPLETED',
      payment_status: 'PAID',
      payment_method: activeBooking.paymentSession?.payment_method || 'QRIS / Rupiah',
      bmc_reward_earned: 2.5,
      green_co2_saved: 0.4,
      rating_given: rating,
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
    };

    const newReward = createRewardLedgerEntry({
      userId: passengerId,
      tripId: newTrip.trip_id,
      rewardType: activeBooking.serviceType === 'BoomTogether' ? 'shared_ride' : 'completed_trip',
      customBmcAmount: 2.5
    });

    set({
      trips: [newTrip, ...trips],
      rewards: [newReward, ...rewards],
      activeBooking: {
        ...activeBooking,
        step: 'COMPLETED',
        lastCompletedTrip: newTrip,
        ratingModalOpen: false
      }
    });

    get().pushNotification(
      'reward_received',
      'Perjalanan Selesai & +2.5 BMC Siap Diklaim!',
      `Terima kasih! Anda memperoleh +2.5 BMC di Ledger Reward untuk Trip #${newTrip.trip_id}.`
    );
  },

  resetActiveBooking: () => {
    set((state) => ({
      activeBooking: {
        ...state.activeBooking,
        step: 'IDLE',
        currentTripId: null,
        assignedDriver: null,
        paymentSession: null,
        trackingProgressPct: 0,
        lastCompletedTrip: null
      }
    }));
  },

  // Reward Ledger Actions (Tahap II Secure Firestore Claim)
  claimReward: async (rewardId, userProfile = null) => {
    const target = get().rewards.find(r => r.reward_id === rewardId);
    if (target) {
      await claimRewardInFirestore(target, userProfile);
    }
    set((state) => ({
      rewards: state.rewards.map(r => r.reward_id === rewardId ? { ...r, status: 'CLAIMED', claimed_at: new Date().toISOString() } : r)
    }));
    get().addLocalAuditLog(
      'REWARD_CLAIMED',
      rewardId,
      `Klaim token reward +${target?.bmc_amount || 2.5} BMC berhasil disahkan ke Ledger.`,
      userProfile?.displayName || 'Pengguna BaMbooChain'
    );
  },

  // Driver Registration Actions dengan Integrasi Akun Auth & Firestore
  registerDriver: (driverFormData, userProfile = null) => {
    const rawNgopi = (driverFormData.ngopiUsername || '').trim();
    const cleanUsername = rawNgopi.startsWith('@') ? rawNgopi : (rawNgopi ? `@${rawNgopi}` : '@majelisngopi');
    
    let ngopiChatUrl = driverFormData.ngopiChatUrl || '';
    if (!ngopiChatUrl) {
      if (cleanUsername.toLowerCase().includes('majelisngopi')) {
        ngopiChatUrl = 'https://ngopi.top/chat/f1c8c427-21bf-4fc1-8e99-9e651114d615?name=Ade%20Gunawan';
      } else if (rawNgopi.startsWith('http')) {
        ngopiChatUrl = rawNgopi;
      } else {
        ngopiChatUrl = `https://ngopi.top/chat/f1c8c427-21bf-4fc1-8e99-9e651114d615?name=${encodeURIComponent(driverFormData.fullName || 'Mitra Driver')}`;
      }
    }

    const newDriver = {
      driver_id: `DRV-${Date.now().toString().slice(-4)}`,
      user_id: userProfile?.uid || userProfile?.id || 'USR-CURRENT',
      name: driverFormData.fullName,
      phone: driverFormData.phone,
      email: driverFormData.email || userProfile?.email || '',
      ngopi_username: cleanUsername,
      ngopi_chat_url: ngopiChatUrl,
      identity_number: driverFormData.identityNumber || '',
      status: 'SUBMITTED', // 'SUBMITTED' -> 'UNDER_REVIEW' -> 'VERIFIED'
      isOnline: false,
      vehicle_type: driverFormData.vehicleType,
      vehicle_brand: driverFormData.vehicleBrand,
      vehicle_model: driverFormData.vehicleModel || driverFormData.vehicleBrand,
      vehicle_year: driverFormData.vehicleYear,
      plate_number: driverFormData.plateNumber,
      license_number: driverFormData.licenseNumber,
      operating_region: driverFormData.operatingRegion,
      bank_account: driverFormData.bankAccount || '',
      emergency_contact: driverFormData.emergencyContact || '',
      rating: 5.0,
      completed_trips: 0,
      currentLat: -6.6521,
      currentLng: 107.6932,
      avatarUrl: driverFormData.profilePhotoUrl || userProfile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      created_at: new Date().toISOString()
    };

    registerDriverInFirestore(newDriver, userProfile);
    get().addLocalAuditLog(
      'DRIVER_REGISTERED',
      newDriver.driver_id,
      `Pendaftaran mitra pengemudi baru: ${newDriver.name} (${newDriver.plate_number})`,
      newDriver.name
    );

    set((state) => ({
      drivers: [newDriver, ...state.drivers]
    }));
    return newDriver;
  },

  verifyDriverStatus: (driverId, newStatus, verifierName = 'Operator BUMDes / Admin') => {
    verifyDriverStatusInFirestore(driverId, newStatus, verifierName);
    get().addLocalAuditLog(
      `DRIVER_${newStatus}`,
      driverId,
      `Verifikasi pengemudi ${driverId} diubah menjadi ${newStatus}`,
      verifierName
    );
    set((state) => ({
      drivers: state.drivers.map(d => d.driver_id === driverId ? { ...d, status: newStatus, isOnline: newStatus === 'VERIFIED' ? true : d.isOnline } : d)
    }));
  },

  // Operator Actions
  registerOperator: (operatorFormData, userProfile = null) => {
    const newOp = {
      operator_id: `OP-${Date.now().toString().slice(-4)}`,
      user_id: userProfile?.uid || userProfile?.id || 'USR-CURRENT',
      name: operatorFormData.name,
      type: operatorFormData.type,
      region: operatorFormData.region,
      legal_entity: operatorFormData.legalEntity,
      contact_person: operatorFormData.contactPerson,
      phone: operatorFormData.phone,
      status: 'SUBMITTED',
      driver_count: 0,
      monthly_trips: 0,
      monthly_revenue: 0,
      created_at: new Date().toISOString()
    };
    registerOperatorInFirestore(newOp, userProfile);
    get().addLocalAuditLog(
      'OPERATOR_REGISTERED',
      newOp.operator_id,
      `Pendaftaran Mitra Operator Wilayah: ${newOp.name} (${newOp.type})`,
      newOp.contact_person
    );
    set((state) => ({
      operators: [newOp, ...state.operators]
    }));
    return newOp;
  },

  // SOS & Incidents
  triggerSosIncident: (incidentData) => {
    const incident = {
      incident_id: `INC-${Date.now().toString().slice(-4)}`,
      trip_id: incidentData.tripId || 'TRIP-EMERGENCY',
      user_id: incidentData.userId || 'USR-CURRENT',
      user_name: incidentData.userName || 'Pengguna',
      type: incidentData.type || 'SOS_BUTTON',
      description: incidentData.description || 'Pengguna menekan tombol SOS darurat.',
      latitude: incidentData.lat || -6.6521,
      longitude: incidentData.lng || 107.6932,
      status: 'OPEN',
      created_at: new Date().toISOString(),
      resolved_at: null
    };

    recordSosIncidentInFirestore(incident);
    get().addLocalAuditLog(
      'SOS_TRIGGERED',
      incident.incident_id,
      `Sinyal darurat SOS diaktifkan pada koordinat (${incident.latitude}, ${incident.longitude})`,
      incident.user_name
    );

    set((state) => ({
      incidents: [incident, ...state.incidents]
    }));
    return incident;
  }
}));
