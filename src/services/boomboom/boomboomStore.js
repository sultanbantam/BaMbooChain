import { create } from 'zustand';
import { 
  MOCK_DRIVERS, 
  MOCK_OPERATORS, 
  MOCK_TRIPS, 
  MOCK_REWARDS, 
  MOCK_INCIDENTS,
  MOCK_COMPLAINTS,
  MOCK_FRAUD_ALERTS,
  MOCK_FINANCIAL_LEDGER,
  ROUTE_OPTIMIZATION_MODES,
  INITIAL_PILOT_METRICS,
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
  claimInstantOrderByCodeInFirestore,
  checkGeofencePilotZone,
  recordTripRatingAndCsatInFirestore,
  submitComplaintInFirestore,
  resolveComplaintInFirestore,
  resolveSosIncidentInFirestore,
  recordCancellationReasonInFirestore,
  optInDriverKodibaMembershipInFirestore,
  evaluateTripFraudRisk,
  recordImmutableFinancialLedgerInFirestore,
  verifyOperatorStatusInFirestore
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
  complaints: [...MOCK_COMPLAINTS],
  fraudAlerts: [...MOCK_FRAUD_ALERTS],
  financialLedger: [...MOCK_FINANCIAL_LEDGER],
  pilotMetrics: { ...INITIAL_PILOT_METRICS },
  auditLogs: [...INITIAL_AUDIT_LOGS],
  notifications: [],

  // Active Passenger Booking Session State
  activeBooking: {
    step: 'IDLE', // 'IDLE' | 'SEARCHING' | 'DRIVER_ASSIGNED' | 'DRIVER_ARRIVING' | 'DRIVER_ARRIVED' | 'ON_TRIP' | 'COMPLETED' | 'CANCELLED'
    instantCode: '482915',
    pickupAddress: 'Balaikota Tangerang Selatan, Jl. Benda Raya No. 1',
    pickupCoords: { lat: -6.3198, lng: 106.7069 },
    destinationAddress: 'Stasiun Sudimara Tangsel',
    destinationCoords: { lat: -6.2966, lng: 106.7128 },
    serviceType: 'BoomRide',
    routeOptimizationMode: 'FASTEST',
    isEvVehicle: false,
    fareCalc: calculateFare({ serviceType: 'BoomRide', distanceKm: 3.4, durationMin: 10 }),
    pilotGeofence: checkGeofencePilotZone({ lat: -6.3198, lng: 106.7069 }, INITIAL_OPERATING_REGIONS),
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
      const pilotGeofence = checkGeofencePilotZone(pickupCoords, state.regions);

      return {
        activeBooking: {
          ...active,
          pickupAddress: address,
          pickupCoords,
          fareCalc,
          pilotGeofence,
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
    const pilotGeofence = checkGeofencePilotZone(pickupCoords, state.regions);

    set((s) => ({
      activeBooking: {
        ...s.activeBooking,
        pickupAddress: pickupAddress || s.activeBooking.pickupAddress,
        pickupCoords,
        destinationAddress: destinationAddress || s.activeBooking.destinationAddress,
        destinationCoords: destCoords,
        fareCalc,
        pilotGeofence,
        matchedCandidates: matchResult.rankedCandidates
      }
    }));

    return { pickupCoords, destCoords, distance, duration, fareCalc, matchResult, pilotGeofence };
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

  cancelBooking: (reason = 'Berubah pikiran / salah titik jemput', passengerName = 'Penumpang') => {
    const { activeBooking, pilotMetrics } = get();
    const tripId = activeBooking.currentTripId;
    if (reason) {
      recordCancellationReasonInFirestore(tripId, reason, passengerName);
      get().addLocalAuditLog(
        'TRIP_CANCELLED',
        tripId || 'TRIP-CANCEL',
        `Pembatalan perjalanan oleh ${passengerName}. Alasan: "${reason}"`,
        passengerName
      );
    }

    const updatedReasons = { ...(pilotMetrics.cancellation_reasons || {}) };
    updatedReasons[reason] = (updatedReasons[reason] || 0) + 1;
    const newCancelledCount = (pilotMetrics.cancelled_trips_count || 92) + 1;
    const newTotalReq = (pilotMetrics.total_pilot_requests || 1642) + 1;
    const newCancelRate = Number(((newCancelledCount / newTotalReq) * 100).toFixed(1));
    const newCompletionRate = Number((100 - newCancelRate).toFixed(1));

    set((state) => ({
      pilotMetrics: {
        ...state.pilotMetrics,
        total_pilot_requests: newTotalReq,
        cancelled_trips_count: newCancelledCount,
        cancellation_rate_pct: newCancelRate,
        trip_completion_rate_pct: newCompletionRate,
        cancellation_reasons: updatedReasons
      },
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

    const activeRegionObj = activeBooking.pilotGeofence?.nearestRegion || get().regions[0];
    recordImmutableFinancialLedgerInFirestore(newTrip, activeRegionObj).then((ledgerEntry) => {
      if (ledgerEntry) {
        set((state) => ({
          financialLedger: [ledgerEntry, ...state.financialLedger]
        }));
      }
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

    const isLainnyaZone = driverFormData.operatingRegion === 'REG-LAINNYA';
    const regionLabel = driverFormData.operatingRegion === 'REG-JABODETABEK'
      ? '1. JaBoDeTaBek (Jakarta, Bogor, Depok, Tangerang, Bekasi)'
      : driverFormData.operatingRegion === 'REG-SECIPALE'
        ? '2. SeCiPaLe (Serang, Cilegon, Pandeglang, Lebak)'
        : `3. Lainnya: ${driverFormData.customRegencyCity || 'Kab/Kota'}, ${driverFormData.customProvince || 'Provinsi'}`;

    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    const count = 1001 + (get().drivers.length || 0);
    const autoKodibaId = `KODIBA ${count}${mm}${yy}`;

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
      kodiba_member: true,
      kodiba_member_id: autoKodibaId,
      isOnline: false,
      vehicle_type: driverFormData.vehicleType,
      vehicle_brand: driverFormData.vehicleBrand,
      vehicle_model: driverFormData.vehicleModel || driverFormData.vehicleBrand,
      vehicle_year: driverFormData.vehicleYear,
      plate_number: driverFormData.plateNumber,
      license_number: driverFormData.licenseNumber,
      operating_region: driverFormData.operatingRegion,
      operating_region_label: regionLabel,
      custom_regency_city: isLainnyaZone ? (driverFormData.customRegencyCity || '') : '',
      custom_province: isLainnyaZone ? (driverFormData.customProvince || '') : '',
      partner_type: driverFormData.partnerType || 'BUMDes',
      custom_partner_type: driverFormData.partnerType === 'Lain-lain' ? (driverFormData.customPartnerType || '') : '',
      other_partner_details: driverFormData.otherPartnerDetails || '',
      bank_account: driverFormData.bankAccount || '',
      emergency_contact: driverFormData.emergencyContact || '',
      rating: 5.0,
      completed_trips: 0,
      currentLat: -6.2945,
      currentLng: 106.7124,
      avatarUrl: driverFormData.profilePhotoUrl || userProfile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      created_at: new Date().toISOString()
    };

    registerDriverInFirestore(newDriver, userProfile);
    get().addLocalAuditLog(
      'DRIVER_REGISTERED',
      newDriver.driver_id,
      `Pendaftaran mitra pengemudi baru: ${newDriver.name} (${newDriver.plate_number}) — Zona: ${regionLabel}, Mitra: ${newDriver.partner_type}`,
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
    const isLainnya = operatorFormData.region === 'REG-LAINNYA';
    const regencyText = isLainnya
      ? (operatorFormData.customRegencyCity || 'Kabupaten/Kota')
      : operatorFormData.region === 'REG-SECIPALE'
        ? 'Serang, Cilegon, Pandeglang, Lebak'
        : 'Jakarta, Bogor, Depok, Tangerang, Bekasi';
    const provinceText = isLainnya
      ? (operatorFormData.customProvince || 'Provinsi')
      : operatorFormData.region === 'REG-SECIPALE'
        ? 'Banten'
        : 'DKI Jakarta, Jawa Barat & Banten';

    const operatingAreaLabel = isLainnya
      ? `3. Lainnya: ${regencyText}, Provinsi ${provinceText}`
      : operatorFormData.region === 'REG-SECIPALE'
        ? '2. SeCiPaLe (Serang, Cilegon, Pandeglang, Lebak - Banten)'
        : '1. JaBoDeTaBek (Jakarta, Bogor, Depok, Tangerang, Bekasi)';

    const resolvedPartnerType = operatorFormData.type === 'Lain-lain' && operatorFormData.customTypeDetail
      ? `Lain-lain (${operatorFormData.customTypeDetail})`
      : operatorFormData.type;

    const newOp = {
      operator_id: `OP-${Date.now().toString().slice(-4)}`,
      user_id: userProfile?.uid || userProfile?.id || 'USR-CURRENT',
      name: operatorFormData.name,
      type: operatorFormData.type,
      custom_type_detail: operatorFormData.customTypeDetail || '',
      other_requirements_detail: operatorFormData.otherRequirementsDetail || '',
      region: operatorFormData.region,
      regency_city: regencyText,
      province: provinceText,
      operating_area: operatingAreaLabel,
      project_id: operatorFormData.projectId || (isLainnya ? 'PRJ-DESA-LAINNYA-03' : operatorFormData.region === 'REG-SECIPALE' ? 'PRJ-SECIPALE-02' : 'PRJ-JABODETABEK-01'),
      legal_entity: operatorFormData.legalEntity,
      operator_legal_status: `${resolvedPartnerType} (${operatorFormData.legalEntity || 'Terdaftar'})`,
      license_reference: `DISHUB-PILOT/${new Date().getFullYear()}`,
      compliance_status: 'COMPLIANT_VERIFIED',
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
      `Pendaftaran Mitra Operator Wilayah: ${newOp.name} (${resolvedPartnerType}) di ${operatingAreaLabel}`,
      newOp.contact_person
    );
    set((state) => {
      const updatedRegions = state.regions.map((r) => {
        if (r.id !== operatorFormData.region) return r;
        return {
          ...r,
          name: isLainnya ? `3. Lainnya: ${regencyText}, ${provinceText}` : r.name,
          regency: regencyText,
          province: provinceText,
          customRegencyCity: isLainnya ? regencyText : r.customRegencyCity,
          customProvince: isLainnya ? provinceText : r.customProvince,
          operatorName: operatorFormData.name || r.operatorName,
          operatorType: operatorFormData.type || r.operatorType,
          operatorCustomType: operatorFormData.customTypeDetail || '',
          operatorOtherDetails: operatorFormData.otherRequirementsDetail || r.operatorOtherDetails
        };
      });
      return {
        operators: [newOp, ...state.operators],
        regions: updatedRegions
      };
    });
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
      incidents: [incident, ...state.incidents],
      pilotMetrics: {
        ...state.pilotMetrics,
        safety_incidents_total: (state.pilotMetrics.safety_incidents_total || 1) + 1,
        safety_incidents_open: (state.pilotMetrics.safety_incidents_open || 0) + 1
      }
    }));
    return incident;
  },

  // ============================================================================
  // TAHAP III — CLOSED REGIONAL PILOT TELEMETRY, GOVERNANCE & ECOSYSTEM ACTIONS
  // ============================================================================
  submitTripRatingAndCsat: async ({ tripId, rating = 5, tags = [], comment = '', passengerName = 'Warga Komunitas' }) => {
    const { activeBooking, pilotMetrics, trips } = get();
    const targetTripId = tripId || activeBooking.lastCompletedTrip?.trip_id || activeBooking.currentTripId || `TRIP-${Date.now()}`;
    const driverId = activeBooking.lastCompletedTrip?.driver_id || activeBooking.assignedDriver?.driver_id || 'DRV-001';

    await recordTripRatingAndCsatInFirestore({
      tripId: targetTripId,
      rating,
      tags,
      comment,
      passengerName,
      driverId
    });

    const prevCount = pilotMetrics.total_ratings_submitted || 1410;
    const prevAvg = pilotMetrics.avg_star_rating || 4.92;
    const newCount = prevCount + 1;
    const newAvg = Number((((prevAvg * prevCount) + Number(rating)) / newCount).toFixed(2));
    const newCsatPct = Number(Math.min(100, (newAvg / 5) * 100 - 1.2).toFixed(1));

    const updatedTags = [...(pilotMetrics.top_csat_tags || [])];
    tags.forEach((t) => {
      const idx = updatedTags.findIndex((item) => item.tag.toLowerCase().includes(t.toLowerCase()));
      if (idx >= 0) {
        updatedTags[idx] = { ...updatedTags[idx], count: updatedTags[idx].count + 1 };
      } else {
        updatedTags.push({ tag: t, count: 1 });
      }
    });

    set((state) => ({
      trips: trips.map((tr) => tr.trip_id === targetTripId ? { ...tr, rating_given: rating, csat_tags: tags, csat_comment: comment } : tr),
      pilotMetrics: {
        ...state.pilotMetrics,
        total_ratings_submitted: newCount,
        avg_star_rating: newAvg,
        user_satisfaction_csat_pct: newCsatPct,
        top_csat_tags: updatedTags
      },
      activeBooking: {
        ...state.activeBooking,
        lastCompletedTrip: state.activeBooking.lastCompletedTrip
          ? { ...state.activeBooking.lastCompletedTrip, rating_given: rating, csat_tags: tags, csat_comment: comment }
          : null
      }
    }));

    get().addLocalAuditLog(
      'CSAT_RATING_SUBMITTED',
      targetTripId,
      `Penilaian CSAT ★${rating}/5 (${tags.join(', ') || 'Sangat Puas'}) dikirim oleh ${passengerName}`,
      passengerName
    );
    get().pushNotification(
      'reward_received',
      `Terima Kasih atas Penilaian ★${rating}/5!`,
      `Umpan balik Anda terekam di Metrik Evaluasi Pilot Tahap III.`
    );
  },

  submitComplaint: async ({ tripId, category, subject, description, reporterName = 'Penumpang BoomBoom', regionId = 'REG-CIBARANI' }) => {
    const complaintObj = {
      complaint_id: `CMP-${Date.now().toString().slice(-4)}`,
      trip_id: tripId || get().activeBooking.currentTripId || 'TRIP-9001',
      reporter_name: reporterName,
      reporter_role: 'PASSENGER',
      category: category || 'SERVICE_FEEDBACK',
      subject: subject || 'Masukan Layanan Pilot Wilayah',
      description: description || '',
      region_id: regionId,
      status: 'OPEN',
      resolution_note: null,
      created_at: new Date().toISOString(),
      resolved_at: null
    };

    await submitComplaintInFirestore(complaintObj);
    set((state) => ({
      complaints: [complaintObj, ...state.complaints],
      pilotMetrics: {
        ...state.pilotMetrics,
        total_complaints: (state.pilotMetrics.total_complaints || 6) + 1
      }
    }));

    get().addLocalAuditLog(
      'COMPLAINT_SUBMITTED',
      complaintObj.complaint_id,
      `Keluhan/masukan baru [${complaintObj.category}]: "${complaintObj.subject}"`,
      reporterName
    );
    get().pushNotification(
      'driver_arrived',
      `Tiket #${complaintObj.complaint_id} Terkirim`,
      `Laporan Anda diteruskan ke Operator Wilayah & Admin BoomBoom.`
    );
    return complaintObj;
  },

  resolveComplaint: async (complaintId, resolutionNote = 'Telah ditindaklanjuti bersama pengurus wilayah.', resolverName = 'Operator Wilayah') => {
    await resolveComplaintInFirestore(complaintId, resolutionNote, resolverName);
    set((state) => ({
      complaints: state.complaints.map((c) =>
        c.complaint_id === complaintId
          ? { ...c, status: 'RESOLVED', resolution_note: resolutionNote, resolved_at: new Date().toISOString() }
          : c
      ),
      pilotMetrics: {
        ...state.pilotMetrics,
        resolved_complaints: (state.pilotMetrics.resolved_complaints || 5) + 1
      }
    }));
    get().addLocalAuditLog(
      'COMPLAINT_RESOLVED',
      complaintId,
      `Tiket keluhan #${complaintId} diselesaikan: "${resolutionNote}"`,
      resolverName
    );
  },

  resolveSosIncident: async (incidentId, resolutionNote = 'Situasi lapangan telah dikonfirmasi aman oleh pengurus wilayah.', resolverName = 'Operator Wilayah') => {
    await resolveSosIncidentInFirestore(incidentId, resolutionNote, resolverName);
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.incident_id === incidentId
          ? { ...inc, status: 'RESOLVED', resolution_note: resolutionNote, resolved_at: new Date().toISOString() }
          : inc
      ),
      pilotMetrics: {
        ...state.pilotMetrics,
        safety_incidents_open: Math.max(0, (state.pilotMetrics.safety_incidents_open || 1) - 1)
      }
    }));
    get().addLocalAuditLog(
      'SOS_INCIDENT_RESOLVED',
      incidentId,
      `Insiden keselamatan #${incidentId} ditutup: "${resolutionNote}"`,
      resolverName
    );
  },

  togglePilotRegionStatus: (regionId) => {
    set((state) => {
      const updatedRegions = state.regions.map((r) => {
        if (r.id !== regionId) return r;
        const nextStatus = r.status === 'ACTIVE_PILOT' ? 'PAUSED_PILOT' : 'ACTIVE_PILOT';
        return { ...r, status: nextStatus };
      });
      const pilotGeofence = checkGeofencePilotZone(state.activeBooking.pickupCoords, updatedRegions);
      return {
        regions: updatedRegions,
        activeBooking: {
          ...state.activeBooking,
          pilotGeofence
        }
      };
    });
    get().addLocalAuditLog(
      'PILOT_ZONE_TOGGLED',
      regionId,
      `Status zona Closed Regional Pilot ${regionId} diperbarui oleh Admin/Operator.`,
      'Central Admin BoomBoom'
    );
  },

  updatePilotRegionConfig: (regionId, configUpdates) => {
    set((state) => {
      const updatedRegions = state.regions.map((r) => {
        if (r.id !== regionId) return r;
        const isLainnya = regionId === 'REG-LAINNYA' || r.zoneCategory === 'LAINNYA';
        const nextRegency = configUpdates.regency !== undefined ? configUpdates.regency : r.regency;
        const nextProvince = configUpdates.province !== undefined ? configUpdates.province : r.province;
        const nextName = isLainnya && (nextRegency || nextProvince)
          ? `3. Lainnya: ${nextRegency || 'Kabupaten/Kota'}, ${nextProvince || 'Provinsi'}`
          : (configUpdates.name || r.name);

        return {
          ...r,
          ...configUpdates,
          name: nextName,
          regency: nextRegency,
          province: nextProvince,
          customRegencyCity: isLainnya ? nextRegency : r.customRegencyCity,
          customProvince: isLainnya ? nextProvince : r.customProvince
        };
      });
      const pilotGeofence = checkGeofencePilotZone(state.activeBooking.pickupCoords, updatedRegions);
      return {
        regions: updatedRegions,
        activeBooking: {
          ...state.activeBooking,
          pilotGeofence
        }
      };
    });
    get().addLocalAuditLog(
      'PILOT_ZONE_CONFIG_UPDATED',
      regionId,
      `Konfigurasi Geofence & Mitra Zona Pilot ${regionId} diperbarui (${configUpdates.operatorType || 'Mitra'} - ${configUpdates.operatorName || ''})`,
      'Admin / Operator Wilayah'
    );
  },

  updateOperatorComplianceStatus: (operatorId, complianceStatus, licenseReference) => {
    set((state) => ({
      operators: state.operators.map((op) =>
        op.operator_id === operatorId
          ? {
              ...op,
              compliance_status: complianceStatus || op.compliance_status,
              license_reference: licenseReference || op.license_reference,
              status: complianceStatus === 'COMPLIANT_VERIFIED' ? 'VERIFIED' : op.status
            }
          : op
      )
    }));
    get().addLocalAuditLog(
      'OPERATOR_COMPLIANCE_UPDATED',
      operatorId,
      `Status kepatuhan regulasi operator ${operatorId} diubah menjadi ${complianceStatus}`,
      'Admin Kepatuhan Regulasi'
    );
  },

  optInDriverKodiba: async (driverId, driverName = 'Mitra Pengemudi') => {
    const memberId = await optInDriverKodibaMembershipInFirestore(driverId, driverName);
    set((state) => ({
      drivers: state.drivers.map((d) =>
        d.driver_id === driverId
          ? { ...d, kodiba_member: true, kodiba_member_id: memberId }
          : d
      )
    }));
    get().addLocalAuditLog(
      'KODIBA_OPT_IN',
      driverId,
      `Mitra Pengemudi ${driverName} bergabung secara sukarela ke Koperasi Digital Bambu (${memberId})`,
      driverName
    );
    get().pushNotification(
      'reward_received',
      `Selamat Bergabung di KODIBA (${memberId})!`,
      `Keanggotaan sukarela Koperasi Digital Bambu Anda telah aktif.`
    );
    return memberId;
  },

  // ============================================================================
  // TAHAP IV — PRODUCTION SCALING: ROUTE OPTIMIZATION, FRAUD SHIELD & NATIONWIDE OPS
  // ============================================================================
  setRouteOptimizationMode: (modeId) => {
    set((state) => {
      const modeObj = ROUTE_OPTIMIZATION_MODES.find((m) => m.id === modeId) || ROUTE_OPTIMIZATION_MODES[0];
      const baseDist = state.activeBooking.fareCalc.distanceKm || 4.0;
      const adjDist = Number((baseDist * modeObj.distanceMultiplier).toFixed(1));
      const adjDur = Math.max(3, Math.round((state.activeBooking.fareCalc.durationMin || 11) * modeObj.durationMultiplier));
      const fareCalc = calculateFare({
        serviceType: state.activeBooking.serviceType,
        distanceKm: adjDist,
        durationMin: adjDur,
        customConfig: state.fareSettings[state.activeBooking.serviceType],
        isEvVehicle: state.activeBooking.isEvVehicle
      });
      return {
        activeBooking: {
          ...state.activeBooking,
          routeOptimizationMode: modeId,
          fareCalc
        }
      };
    });
  },

  verifyOperatorStatus: async (operatorId, newStatus = 'VERIFIED', verifierName = 'Central Admin BoomBoom') => {
    await verifyOperatorStatusInFirestore(operatorId, newStatus, verifierName);
    set((state) => ({
      operators: state.operators.map((op) =>
        op.operator_id === operatorId
          ? {
              ...op,
              status: newStatus,
              compliance_status: newStatus === 'VERIFIED' ? 'COMPLIANT_VERIFIED' : 'UNDER_REGULATORY_REVIEW'
            }
          : op
      )
    }));
    get().addLocalAuditLog(
      `OPERATOR_${newStatus}`,
      operatorId,
      `Verifikasi Mitra Operator Nasional ${operatorId} diubah menjadi ${newStatus}`,
      verifierName
    );
  },

  resolveFraudAlert: (alertId, nextStatus = 'RESOLVED') => {
    set((state) => ({
      fraudAlerts: state.fraudAlerts.map((al) =>
        al.alert_id === alertId ? { ...al, status: nextStatus } : al
      )
    }));
    get().addLocalAuditLog(
      'FRAUD_ALERT_REVIEWED',
      alertId,
      `Peringatan keamanan #${alertId} ditandai ${nextStatus} oleh Central Admin.`,
      'Fraud Shield Admin'
    );
  },

  runFraudCheckOnBooking: async (passengerId = 'USR-PAS') => {
    const { activeBooking } = get();
    const res = await evaluateTripFraudRisk({
      tripId: activeBooking.currentTripId,
      distanceKm: activeBooking.fareCalc.distanceKm,
      fare: activeBooking.fareCalc.grossFare,
      passengerId,
      driverUserId: activeBooking.assignedDriver?.user_id || 'USR-101',
      regionId: activeBooking.pilotGeofence?.nearestRegion?.id || 'REG-JABODETABEK'
    });
    if (res.alerts && res.alerts.length > 0) {
      set((state) => ({
        fraudAlerts: [...res.alerts, ...state.fraudAlerts]
      }));
    }
    return res;
  }
}));
