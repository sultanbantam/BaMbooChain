/**
 * BOOMBOOM MOCK DATASET & SYSTEM CONSTANTS
 */

export const INITIAL_FEATURE_FLAGS = {
  BOOMBOOM_PILOT_ENABLED: true,
  ENABLE_EV_REWARDS: true,
  ENABLE_COMMUNITY_CARPOOL: true,
  ENABLE_REALTIME_MAP: true,
  FUTURE_BOOM_SEND: false,
  FUTURE_BOOM_TOUR: false,
  FUTURE_BOOM_VILLAGE: false,
  FUTURE_BOOM_CARE: false
};

export const INITIAL_OPERATING_REGIONS = [
  {
    id: 'REG-CIBARANI',
    name: 'Perkebunan Emas Hijau Cibarani',
    province: 'Jawa Barat',
    regency: 'Subang',
    operatorName: 'BUMDes Cibarani Jaya',
    operatorType: 'BUMDes',
    activeDriversCount: 14,
    centerLat: -6.6521,
    centerLng: 107.6932,
    status: 'ACTIVE_PILOT'
  },
  {
    id: 'REG-CISADANE',
    name: 'Kawasan Cisadane Eco Park',
    province: 'Jawa Barat',
    regency: 'Bogor',
    operatorName: 'Koperasi Bambu Cisadane',
    operatorType: 'Koperasi',
    activeDriversCount: 22,
    centerLat: -6.5971,
    centerLng: 106.7996,
    status: 'ACTIVE_PILOT'
  },
  {
    id: 'REG-GARUT',
    name: 'Desa Wisata Bambu Garut',
    province: 'Jawa Barat',
    regency: 'Garut',
    operatorName: 'Komunitas Pemuda Bambu Garut',
    operatorType: 'Komunitas',
    activeDriversCount: 18,
    centerLat: -7.2278,
    centerLng: 107.9087,
    status: 'ACTIVE_PILOT'
  },
  {
    id: 'REG-BANDUNG',
    name: 'Kawasan Konservasi Lembang',
    province: 'Jawa Barat',
    regency: 'Bandung Barat',
    operatorName: 'BUMDes Lembang Asri',
    operatorType: 'BUMDes',
    activeDriversCount: 29,
    centerLat: -6.8169,
    centerLng: 107.6151,
    status: 'ACTIVE_PILOT'
  }
];

export const MOCK_DRIVERS = [
  {
    driver_id: 'DRV-001',
    user_id: 'USR-101',
    name: 'Asep Saepulloh',
    phone: '+62 812-3456-7890',
    email: 'asep.saepulloh@bamboochain.id',
    status: 'VERIFIED',
    isOnline: true,
    vehicle_type: 'BoomRide',
    vehicle_brand: 'Honda Vario 160 (EV Conversion)',
    vehicle_model: 'Vario EV',
    vehicle_year: '2023',
    plate_number: 'D 4892 BB',
    license_number: 'SIM-C-984210492',
    operating_region: 'REG-CIBARANI',
    rating: 4.9,
    completed_trips: 184,
    currentLat: -6.6515,
    currentLng: 107.6925,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    driver_id: 'DRV-002',
    user_id: 'USR-102',
    name: 'Siti Rahmawati',
    phone: '+62 813-9876-5432',
    email: 'siti.rahmawati@bamboochain.id',
    status: 'VERIFIED',
    isOnline: true,
    vehicle_type: 'BoomCar',
    vehicle_brand: 'Wuling Air EV',
    vehicle_model: 'Air EV Long Range',
    vehicle_year: '2024',
    plate_number: 'F 1902 BMC',
    license_number: 'SIM-A-874291039',
    operating_region: 'REG-CISADANE',
    rating: 5.0,
    completed_trips: 240,
    currentLat: -6.5980,
    currentLng: 106.8010,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    created_at: '2026-02-01T09:30:00Z'
  },
  {
    driver_id: 'DRV-003',
    user_id: 'USR-103',
    name: 'Budi Santoso',
    phone: '+62 856-1122-3344',
    email: 'budi.santoso@bamboochain.id',
    status: 'VERIFIED',
    isOnline: false,
    vehicle_type: 'BoomRide',
    vehicle_brand: 'Yamaha NMAX 155',
    vehicle_model: 'NMAX Connected',
    vehicle_year: '2022',
    plate_number: 'Z 3341 GR',
    license_number: 'SIM-C-771239014',
    operating_region: 'REG-GARUT',
    rating: 4.8,
    completed_trips: 96,
    currentLat: -7.2285,
    currentLng: 107.9090,
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    created_at: '2026-02-10T14:15:00Z'
  },
  {
    driver_id: 'DRV-004',
    user_id: 'USR-104',
    name: 'Kiki Ramdani',
    phone: '+62 878-4455-6677',
    email: 'kiki.ramdani@bamboochain.id',
    status: 'UNDER_REVIEW',
    isOnline: false,
    vehicle_type: 'BoomCar',
    vehicle_brand: 'Toyota Avanza',
    vehicle_model: '1.5 G CVT',
    vehicle_year: '2023',
    plate_number: 'D 1289 LBG',
    license_number: 'SIM-A-554109821',
    operating_region: 'REG-BANDUNG',
    rating: 4.7,
    completed_trips: 12,
    currentLat: -6.8175,
    currentLng: 107.6160,
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    created_at: '2026-03-01T11:00:00Z'
  }
];

export const MOCK_OPERATORS = [
  {
    operator_id: 'OP-001',
    name: 'BUMDes Cibarani Jaya',
    type: 'BUMDes',
    region: 'REG-CIBARANI',
    legal_entity: 'AHU-0019283-BUMDES.2023',
    contact_person: 'Pak Dudung (Kepala BUMDes)',
    phone: '+62 811-2233-4455',
    status: 'VERIFIED',
    driver_count: 14,
    monthly_trips: 420,
    monthly_revenue: 12600000,
    created_at: '2025-11-01T00:00:00Z'
  },
  {
    operator_id: 'OP-002',
    name: 'Koperasi Bambu Cisadane',
    type: 'Koperasi',
    region: 'REG-CISADANE',
    legal_entity: 'KOP-882910/KOP/2024',
    contact_person: 'Ibu Ratna (Pengurus Koperasi)',
    phone: '+62 812-9988-7766',
    status: 'VERIFIED',
    driver_count: 22,
    monthly_trips: 680,
    monthly_revenue: 20400000,
    created_at: '2025-12-05T00:00:00Z'
  }
];

export const MOCK_TRIPS = [
  {
    trip_id: 'TRIP-9001',
    passenger_id: 'USR-PAS-01',
    passenger_name: 'Mang Ujang',
    driver_id: 'DRV-001',
    driver_name: 'Asep Saepulloh',
    driver_phone: '+62 812-3456-7890',
    driver_photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    plate_number: 'D 4892 BB',
    vehicle_model: 'Honda Vario 160 EV',
    service_type: 'BoomRide',
    pickup_address: 'Sentra Bibit Bambu Cibarani, Jalancabang',
    destination_address: 'Pasar Desa Cibarani, Subang',
    distance_km: 4.2,
    estimated_duration: 12,
    estimated_fare: 15500,
    final_fare: 15500,
    trip_status: 'COMPLETED', // 'SEARCHING', 'DRIVER_ASSIGNED', 'DRIVER_ARRIVING', 'DRIVER_ARRIVED', 'ON_TRIP', 'COMPLETED', 'CANCELLED'
    payment_status: 'PAID',
    payment_method: 'QRIS / Rupiah',
    bmc_reward_earned: 2.5,
    green_co2_saved: 0.35,
    rating_given: 5,
    created_at: '2026-09-28T14:20:00Z',
    completed_at: '2026-09-28T14:32:00Z'
  },
  {
    trip_id: 'TRIP-9002',
    passenger_id: 'USR-PAS-02',
    passenger_name: 'Neng Ani',
    driver_id: 'DRV-002',
    driver_name: 'Siti Rahmawati',
    driver_phone: '+62 813-9876-5432',
    driver_photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    plate_number: 'F 1902 BMC',
    vehicle_model: 'Wuling Air EV',
    service_type: 'BoomTogether',
    pickup_address: 'Stasiun Kereta Cisadane',
    destination_address: 'Kawasan Wisata Hutan Bambu',
    distance_km: 7.8,
    estimated_duration: 18,
    estimated_fare: 28000,
    final_fare: 28000,
    trip_status: 'COMPLETED',
    payment_status: 'PAID',
    payment_method: 'Bank Transfer / QRIS',
    bmc_reward_earned: 4.5,
    green_co2_saved: 0.95,
    rating_given: 5,
    created_at: '2026-09-30T09:10:00Z',
    completed_at: '2026-09-30T09:28:00Z'
  }
];

export const MOCK_REWARDS = [
  {
    reward_id: 'RWD-801',
    user_id: 'USR-CURRENT',
    trip_id: 'TRIP-9001',
    reward_type: 'completed_trip',
    reward_label: 'Perjalanan Selesai (BoomRide)',
    bmc_amount: 1.5,
    status: 'CLAIMED',
    created_at: '2026-09-28T14:32:00Z',
    claimed_at: '2026-09-28T14:33:00Z'
  },
  {
    reward_id: 'RWD-802',
    user_id: 'USR-CURRENT',
    trip_id: 'TRIP-9002',
    reward_type: 'shared_ride',
    reward_label: 'Bonus Mobilitas Bersama (BoomTogether)',
    bmc_amount: 3.0,
    status: 'CLAIMABLE',
    created_at: '2026-09-30T09:28:00Z',
    claimed_at: null
  },
  {
    reward_id: 'RWD-803',
    user_id: 'USR-CURRENT',
    trip_id: null,
    reward_type: 'daily_mission',
    reward_label: 'Misi Hijau Mingguan Desa',
    bmc_amount: 5.0,
    status: 'CLAIMABLE',
    created_at: '2026-10-01T08:00:00Z',
    claimed_at: null
  }
];

export const MOCK_INCIDENTS = [
  {
    incident_id: 'INC-101',
    trip_id: 'TRIP-9001',
    user_id: 'USR-PAS-01',
    user_name: 'Mang Ujang',
    type: 'ROUTE_DEVIATION',
    description: 'Pengemudi mengambil rute alternatif karena perbaikan jalan desa.',
    latitude: -6.6520,
    longitude: 107.6930,
    status: 'RESOLVED',
    created_at: '2026-09-28T14:25:00Z',
    resolved_at: '2026-09-28T14:30:00Z'
  }
];
