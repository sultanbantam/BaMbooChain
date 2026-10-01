/**
 * BOOMBOOM FARE ENGINE
 * Modular & Configurable Transport Fare & Distribution Engine
 */

export const DEFAULT_FARE_SETTINGS = {
  BoomRide: {
    baseFare: 5000,
    perKm: 2500,
    perMinute: 200,
    minimumFare: 8000,
    platformFeePct: 10,       // 10%
    operatorFeePct: 5,        // 5% Mitra Wilayah / BUMDes / Koperasi
    insuranceFee: 1000,       // Fixed IDR insurance fee
    surgeMultiplier: 1.0,
  },
  BoomCar: {
    baseFare: 12000,
    perKm: 5000,
    perMinute: 500,
    minimumFare: 18000,
    platformFeePct: 10,
    operatorFeePct: 5,
    insuranceFee: 2000,
    surgeMultiplier: 1.0,
  },
  BoomSchedule: {
    baseFare: 8000,
    perKm: 3000,
    perMinute: 250,
    minimumFare: 12000,
    platformFeePct: 10,
    operatorFeePct: 5,
    insuranceFee: 1500,
    surgeMultiplier: 1.0,
  },
  BoomTogether: {
    baseFare: 4000,
    perKm: 1800,
    perMinute: 150,
    minimumFare: 6000,
    platformFeePct: 8,
    operatorFeePct: 4,
    insuranceFee: 1000,
    surgeMultiplier: 1.0,
  }
};

/**
 * Calculates detailed trip fare breakdown transparently
 * 
 * @param {Object} params
 * @param {string} params.serviceType - 'BoomRide' | 'BoomCar' | 'BoomSchedule' | 'BoomTogether'
 * @param {number} params.distanceKm - Distance in KM
 * @param {number} params.durationMin - Estimated duration in Minutes
 * @param {Object} [params.customConfig] - Optional overridden regional configuration
 * @param {boolean} [params.isEvVehicle] - Electric Vehicle discount/incentive flag
 * @returns {Object} Fare breakdown & revenue split
 */
export function calculateFare({ serviceType = 'BoomRide', distanceKm = 1, durationMin = 5, customConfig = null, isEvVehicle = false }) {
  const config = customConfig || DEFAULT_FARE_SETTINGS[serviceType] || DEFAULT_FARE_SETTINGS.BoomRide;

  const rawDistanceFare = distanceKm * config.perKm;
  const rawTimeFare = durationMin * config.perMinute;
  const subtotalBeforeSurge = config.baseFare + rawDistanceFare + rawTimeFare;
  const surgeSubtotal = subtotalBeforeSurge * (config.surgeMultiplier || 1.0);
  
  let grossFare = Math.max(config.minimumFare, Math.round(surgeSubtotal));
  
  if (isEvVehicle) {
    // 5% Green EV discount for passenger
    grossFare = Math.round(grossFare * 0.95);
  }

  const platformFee = Math.round(grossFare * (config.platformFeePct / 100));
  const operatorFee = Math.round(grossFare * (config.operatorFeePct / 100));
  const insuranceFee = config.insuranceFee;
  
  const totalDeductions = platformFee + operatorFee + insuranceFee;
  const driverShare = Math.max(0, grossFare - totalDeductions);

  return {
    serviceType,
    distanceKm: Number(distanceKm.toFixed(1)),
    durationMin: Math.ceil(durationMin),
    baseFare: config.baseFare,
    perKmRate: config.perKm,
    perMinuteRate: config.perMinute,
    surgeMultiplier: config.surgeMultiplier || 1.0,
    grossFare,
    splits: {
      driverEarnings: driverShare,
      operatorShare: operatorFee,
      platformShare: platformFee,
      insuranceShare: insuranceFee,
    },
    formatted: {
      grossFare: `Rp ${grossFare.toLocaleString('id-ID')}`,
      driverEarnings: `Rp ${driverShare.toLocaleString('id-ID')}`,
      operatorShare: `Rp ${operatorFee.toLocaleString('id-ID')}`,
      platformShare: `Rp ${platformFee.toLocaleString('id-ID')}`,
      insuranceShare: `Rp ${insuranceFee.toLocaleString('id-ID')}`,
    },
    isEvVehicle
  };
}
