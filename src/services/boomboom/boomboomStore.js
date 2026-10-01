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

export const useBoomBoomStore = create((set, get) => ({
  // Feature Flags & System Config
  featureFlags: { ...INITIAL_FEATURE_FLAGS },
  fareSettings: { ...DEFAULT_FARE_SETTINGS },
  regions: [...INITIAL_OPERATING_REGIONS],

  // Datasets
  drivers: [...MOCK_DRIVERS],
  operators: [...MOCK_OPERATORS],
  trips: [...MOCK_TRIPS],
  rewards: [...MOCK_REWARDS],
  incidents: [...MOCK_INCIDENTS],

  // Active Passenger Booking Session State
  activeBooking: {
    step: 'IDLE', // 'IDLE' | 'SEARCHING' | 'DRIVER_ASSIGNED' | 'DRIVER_ARRIVING' | 'DRIVER_ARRIVED' | 'ON_TRIP' | 'COMPLETED' | 'CANCELLED'
    pickupAddress: 'Sentra Bibit Bambu Cibarani',
    pickupCoords: { lat: -6.6521, lng: 107.6932 },
    destinationAddress: 'Pasar Desa Cibarani, Subang',
    destinationCoords: { lat: -6.6850, lng: 107.7200 },
    serviceType: 'BoomRide',
    isEvVehicle: false,
    fareCalc: calculateFare({ serviceType: 'BoomRide', distanceKm: 4.5, durationMin: 12 }),
    assignedDriver: null,
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

  // Passenger Booking Actions
  setPickup: (address, coords) => {
    set((state) => {
      const distance = 4.5;
      const duration = 12;
      const fareCalc = calculateFare({
        serviceType: state.activeBooking.serviceType,
        distanceKm: distance,
        durationMin: duration,
        customConfig: state.fareSettings[state.activeBooking.serviceType],
        isEvVehicle: state.activeBooking.isEvVehicle
      });
      return {
        activeBooking: {
          ...state.activeBooking,
          pickupAddress: address,
          pickupCoords: coords || state.activeBooking.pickupCoords,
          fareCalc
        }
      };
    });
  },

  setDestination: (address, coords) => {
    set((state) => {
      const distance = 5.2;
      const duration = 15;
      const fareCalc = calculateFare({
        serviceType: state.activeBooking.serviceType,
        distanceKm: distance,
        durationMin: duration,
        customConfig: state.fareSettings[state.activeBooking.serviceType],
        isEvVehicle: state.activeBooking.isEvVehicle
      });
      return {
        activeBooking: {
          ...state.activeBooking,
          destinationAddress: address,
          destinationCoords: coords || state.activeBooking.destinationCoords,
          fareCalc
        }
      };
    });
  },

  setServiceType: (serviceType) => {
    set((state) => {
      const fareCalc = calculateFare({
        serviceType,
        distanceKm: state.activeBooking.fareCalc.distanceKm || 4.5,
        durationMin: state.activeBooking.fareCalc.durationMin || 12,
        customConfig: state.fareSettings[serviceType],
        isEvVehicle: state.activeBooking.isEvVehicle
      });
      return {
        activeBooking: {
          ...state.activeBooking,
          serviceType,
          fareCalc
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

  startBookingFlow: () => {
    const tripId = `TRIP-${Date.now().toString().slice(-5)}`;
    set((state) => ({
      activeBooking: {
        ...state.activeBooking,
        step: 'SEARCHING',
        currentTripId: tripId,
        assignedDriver: null,
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
        trackingProgressPct: 0
      }
    }));
  },

  assignDriverAndStartSimulation: () => {
    const driver = get().drivers.find(d => d.status === 'VERIFIED' && d.isOnline) || get().drivers[0];
    set((state) => ({
      activeBooking: {
        ...state.activeBooking,
        step: 'DRIVER_ASSIGNED',
        assignedDriver: driver
      }
    }));
  },

  updateBookingStep: (nextStep) => {
    set((state) => ({
      activeBooking: {
        ...state.activeBooking,
        step: nextStep
      }
    }));
  },

  completeTrip: (rating = 5, _comment = '') => {
    const { activeBooking, trips, rewards } = get();
    const newTrip = {
      trip_id: activeBooking.currentTripId || `TRIP-${Date.now()}`,
      passenger_id: 'USR-CURRENT',
      passenger_name: 'Pengguna BaMbooChain',
      driver_id: activeBooking.assignedDriver?.driver_id || 'DRV-001',
      driver_name: activeBooking.assignedDriver?.name || 'Asep Saepulloh',
      driver_phone: activeBooking.assignedDriver?.phone || '+62 812-3456-7890',
      driver_photo: activeBooking.assignedDriver?.avatarUrl || '',
      plate_number: activeBooking.assignedDriver?.plate_number || 'D 4892 BB',
      vehicle_model: activeBooking.assignedDriver?.vehicle_brand || 'Motor EV',
      service_type: activeBooking.serviceType,
      pickup_address: activeBooking.pickupAddress,
      destination_address: activeBooking.destinationAddress,
      distance_km: activeBooking.fareCalc.distanceKm,
      estimated_duration: activeBooking.fareCalc.durationMin,
      estimated_fare: activeBooking.fareCalc.grossFare,
      final_fare: activeBooking.fareCalc.grossFare,
      trip_status: 'COMPLETED',
      payment_status: 'PAID',
      payment_method: 'QRIS / Rupiah',
      bmc_reward_earned: 2.5,
      green_co2_saved: 0.4,
      rating_given: rating,
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
    };

    const newReward = createRewardLedgerEntry({
      userId: 'USR-CURRENT',
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
  },

  resetActiveBooking: () => {
    set((state) => ({
      activeBooking: {
        ...state.activeBooking,
        step: 'IDLE',
        currentTripId: null,
        assignedDriver: null,
        trackingProgressPct: 0,
        lastCompletedTrip: null
      }
    }));
  },

  // Reward Ledger Actions
  claimReward: (rewardId) => {
    set((state) => ({
      rewards: state.rewards.map(r => r.reward_id === rewardId ? { ...r, status: 'CLAIMED', claimed_at: new Date().toISOString() } : r)
    }));
  },

  // Driver Registration Actions
  registerDriver: (driverFormData) => {
    const newDriver = {
      driver_id: `DRV-${Date.now().toString().slice(-4)}`,
      user_id: 'USR-CURRENT',
      name: driverFormData.fullName,
      phone: driverFormData.phone,
      email: driverFormData.email,
      status: 'SUBMITTED', // 'SUBMITTED' -> 'UNDER_REVIEW' -> 'VERIFIED'
      isOnline: false,
      vehicle_type: driverFormData.vehicleType,
      vehicle_brand: driverFormData.vehicleBrand,
      vehicle_model: driverFormData.vehicleModel || driverFormData.vehicleBrand,
      vehicle_year: driverFormData.vehicleYear,
      plate_number: driverFormData.plateNumber,
      license_number: driverFormData.licenseNumber,
      operating_region: driverFormData.operatingRegion,
      rating: 5.0,
      completed_trips: 0,
      currentLat: -6.6521,
      currentLng: 107.6932,
      avatarUrl: driverFormData.profilePhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      created_at: new Date().toISOString()
    };

    set((state) => ({
      drivers: [newDriver, ...state.drivers]
    }));
    return newDriver;
  },

  verifyDriverStatus: (driverId, newStatus) => {
    set((state) => ({
      drivers: state.drivers.map(d => d.driver_id === driverId ? { ...d, status: newStatus } : d)
    }));
  },

  // Operator Actions
  registerOperator: (operatorFormData) => {
    const newOp = {
      operator_id: `OP-${Date.now().toString().slice(-4)}`,
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
      user_id: 'USR-CURRENT',
      user_name: incidentData.userName || 'Pengguna',
      type: incidentData.type || 'SOS_BUTTON',
      description: incidentData.description || 'Pengguna menekan tombol SOS darurat.',
      latitude: incidentData.lat || -6.6521,
      longitude: incidentData.lng || 107.6932,
      status: 'OPEN', // 'OPEN' | 'INVESTIGATING' | 'RESOLVED'
      created_at: new Date().toISOString(),
      resolved_at: null
    };

    set((state) => ({
      incidents: [incident, ...state.incidents]
    }));
    return incident;
  }
}));
