/**
 * BOOMBOOM REWARD & GREEN MOBILITY ENGINE
 * BMC Utility Reward Ledger & Green Impact Calculator
 */

export const REWARD_CONFIG = {
  completed_trip: { label: 'Perjalanan Selesai', bmcAmount: 1.5 },
  first_ride: { label: 'Bonus Perjalanan Pertama', bmcAmount: 10.0 },
  daily_mission: { label: 'Misi Mobilitas Harian (3 Perjalanan)', bmcAmount: 5.0 },
  shared_ride: { label: 'Perjalanan Komunitas (BoomTogether)', bmcAmount: 3.0 },
  ev_usage: { label: 'Kendaraan Listrik Ramah Lingkungan', bmcAmount: 4.0 },
  verified_driver_contribution: { label: 'Kontribusi Pengemudi Terverifikasi', bmcAmount: 8.0 },
  community_activity: { label: 'Aktivitas Komunitas Wilayah', bmcAmount: 2.0 },
};

/**
 * Calculates Green Trip Score and Estimated Mobility Impact ("Estimasi Dampak Mobilitas")
 * 
 * Note: As specified in guidelines section 13:
 * Numbers are labeled "Estimasi Dampak Mobilitas" and NOT presented as verified carbon credits.
 */
export function calculateGreenScore({ distanceKm, vehicleType, isShared }) {
  // Rough estimations for mobility impact
  // Average motorbike emission avoided vs car: ~0.08 kg CO2/km
  // Shared ride emission saved per pass: ~0.12 kg CO2/km
  const baseFactor = vehicleType === 'BoomRide' ? 0.08 : (vehicleType === 'BoomCar' ? 0.15 : 0.10);
  const sharedBonus = isShared ? 1.5 : 1.0;
  
  const estimatedCo2SavedKg = Number((distanceKm * baseFactor * sharedBonus).toFixed(2));
  const greenPoints = Math.round(distanceKm * 10 * sharedBonus);

  let ecoBadge = 'Pengendara Hijau';
  if (greenPoints >= 100) ecoBadge = 'Pahlawan Mobilitas Desa';
  else if (greenPoints >= 50) ecoBadge = 'Penjaga Bumi Nusantara';

  return {
    distanceKm,
    estimatedCo2SavedKg,
    greenPoints,
    ecoBadge,
    label: 'Estimasi Dampak Mobilitas'
  };
}

/**
 * Creates a mock/backend-ready reward ledger entry
 */
export function createRewardLedgerEntry({ userId, tripId, rewardType, customBmcAmount = null }) {
  const config = REWARD_CONFIG[rewardType] || { label: 'Bonus Mobilitas', bmcAmount: 1.0 };
  const bmcAmount = customBmcAmount !== null ? customBmcAmount : config.bmcAmount;

  return {
    reward_id: `RWD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    user_id: userId || 'USER-ANONYMOUS',
    trip_id: tripId || null,
    reward_type: rewardType,
    reward_label: config.label,
    bmc_amount: bmcAmount,
    status: 'CLAIMABLE', // 'CLAIMABLE' | 'CLAIMED' | 'EXPIRED'
    created_at: new Date().toISOString(),
    claimed_at: null
  };
}
