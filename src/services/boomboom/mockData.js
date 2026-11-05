/**
 * BOOMBOOM MOCK DATASET & SYSTEM CONSTANTS (TAHAP I, II & III — CLOSED REGIONAL PILOT)
 * Geofence Zona Pilot Terbatas & Integrasi Proyek Desa:
 * 1. JaBoDeTaBek (Jakarta, Bogor, Depok, Tangerang/Tangsel, Bekasi)
 * 2. SeCiPaLe (Serang, Cilegon, Pandeglang, Lebak)
 * 3. Lainnya (Sebutkan Kabupaten/Kota & Provinsi)
 *
 * Jenis Mitra Pengelola (Dropdown):
 * - BUMDes
 * - Yayasan
 * - Perusahaan
 * - Organisasi
 * - Lain-lain (Isi detail jenis mitra, peran & keterangan lainnya)
 */

export const INITIAL_FEATURE_FLAGS = {
  BOOMBOOM_PILOT_ENABLED: true,
  BOOMBOOM_PHASE_3_REGIONAL_PILOT: true,
  ENABLE_EV_REWARDS: true,
  ENABLE_COMMUNITY_CARPOOL: true,
  ENABLE_REALTIME_MAP: true,
  FUTURE_BOOM_SEND: false,
  FUTURE_BOOM_TOUR: false,
  FUTURE_BOOM_VILLAGE: false,
  FUTURE_BOOM_CARE: false
};

export const PARTNER_ENTITY_TYPES = [
  { value: 'BUMDes', label: 'BUMDes (Badan Usaha Milik Desa)' },
  { value: 'Yayasan', label: 'Yayasan (Sosial / Lingkungan / Pendidikan)' },
  { value: 'Perusahaan', label: 'Perusahaan (PT / CV / Badan Usaha)' },
  { value: 'Organisasi', label: 'Organisasi (Koperasi / Komunitas / Perkumpulan)' },
  { value: 'Lain-lain', label: 'Lain-lain (Sebutkan Jenis Mitra & Keterangan Lainnya)' }
];

export const PILOT_ZONE_OPTIONS = [
  {
    id: 'REG-JABODETABEK',
    code: 'JABODETABEK',
    label: '1. JaBoDeTaBek (Jakarta, Bogor, Depok, Tangerang, Bekasi)',
    defaultRegency: 'Jakarta, Bogor, Depok, Tangerang/Tangsel, Bekasi',
    defaultProvince: 'DKI Jakarta, Jawa Barat & Banten'
  },
  {
    id: 'REG-SECIPALE',
    code: 'SECIPALE',
    label: '2. SeCiPaLe (Serang, Cilegon, Pandeglang, Lebak)',
    defaultRegency: 'Serang, Cilegon, Pandeglang, Lebak',
    defaultProvince: 'Banten'
  },
  {
    id: 'REG-LAINNYA',
    code: 'LAINNYA',
    label: '3. Lainnya (Sebutkan Kabupaten, Kota & Provinsi)',
    defaultRegency: '',
    defaultProvince: ''
  }
];

export const INITIAL_OPERATING_REGIONS = [
  {
    id: 'REG-JABODETABEK',
    zoneCategory: 'JABODETABEK',
    name: '1. JaBoDeTaBek (Jakarta, Bogor, Depok, Tangerang, Bekasi)',
    province: 'DKI Jakarta, Jawa Barat & Banten',
    regency: 'Jakarta, Bogor, Depok, Tangerang/Tangsel, Bekasi',
    operatorName: 'Yayasan Bambu Indonesia & Mitra JaBoDeTaBek',
    operatorType: 'Yayasan',
    operatorCustomType: '',
    operatorOtherDetails: 'Pengelolaan koridor komuter stasiun, kawasan pemukiman & sentra ekosistem hijau JaBoDeTaBek',
    operator_legal_status: 'Yayasan & Koperasi Mitra Terdaftar (AHU-0048219.AH.01.29.2025)',
    license_reference: 'DISHUB-JABODETABEK/PILOT-KOMUNITAS/2026-01',
    compliance_status: 'COMPLIANT_VERIFIED',
    project_id: 'PRJ-JABODETABEK-01',
    project_name: 'Integrasi Mobilitas Komunitas & Proyek Hijau JaBoDeTaBek',
    activeDriversCount: 57,
    centerLat: -6.2945,
    centerLng: 106.7996,
    radiusKm: 65,
    status: 'ACTIVE_PILOT'
  },
  {
    id: 'REG-SECIPALE',
    zoneCategory: 'SECIPALE',
    name: '2. SeCiPaLe (Serang, Cilegon, Pandeglang, Lebak)',
    province: 'Banten',
    regency: 'Serang, Cilegon, Pandeglang, Lebak',
    operatorName: 'BUMDes Bersama & Organisasi Bambu SeCiPaLe',
    operatorType: 'BUMDes',
    operatorCustomType: '',
    operatorOtherDetails: 'Jaringan BUMDes Desa Wisata, Sentra Agroforestri Bambu & Komunitas Warga Banten Raya',
    operator_legal_status: 'Konsorsium BUMDes & Organisasi Lokal (AHU-0019283-BANTEN.2025)',
    license_reference: 'DISHUB-BANTEN/PILOT-SECIPALE/2026-02',
    compliance_status: 'COMPLIANT_VERIFIED',
    project_id: 'PRJ-SECIPALE-02',
    project_name: 'Integrasi Proyek Desa & Sabuk Hijau Bambu SeCiPaLe (Banten)',
    activeDriversCount: 38,
    centerLat: -6.2250,
    centerLng: 106.1541,
    radiusKm: 75,
    status: 'ACTIVE_PILOT'
  },
  {
    id: 'REG-LAINNYA',
    zoneCategory: 'LAINNYA',
    name: '3. Lainnya: Kab. Subang, Jawa Barat (Desa Cibarani)',
    province: 'Jawa Barat',
    regency: 'Kabupaten Subang (Kawasan Cibarani)',
    customRegencyCity: 'Kabupaten Subang',
    customProvince: 'Jawa Barat',
    operatorName: 'BUMDes Cibarani Jaya',
    operatorType: 'BUMDes',
    operatorCustomType: 'Kasepuhan & Kelompok Tani Hutan Bambu',
    operatorOtherDetails: 'Melayani mobilitas warga desa, angkutan bibit/hasil panen bambu, dan ekowisata kebun',
    operator_legal_status: 'Badan Usaha Milik Desa (SK Kemenkumham AHU-0019283-BUMDES.2023)',
    license_reference: 'DISHUB-DAERAH/PILOT-DESA/2026-03',
    compliance_status: 'COMPLIANT_VERIFIED',
    project_id: 'PRJ-DESA-LAINNYA-03',
    project_name: 'Sentra Konservasi & Agroforestri Bambu Daerah',
    activeDriversCount: 24,
    centerLat: -6.6521,
    centerLng: 107.6932,
    radiusKm: 85,
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
    ngopi_username: '@majelisngopi',
    ngopi_chat_url: 'https://ngopi.top/chat/f1c8c427-21bf-4fc1-8e99-9e651114d615?name=Ade%20Gunawan',
    status: 'VERIFIED',
    isOnline: true,
    kodiba_member: true,
    kodiba_member_id: 'KODIBA-2026-0014',
    vehicle_type: 'BoomRide',
    vehicle_brand: 'Honda Vario 160 (EV Conversion)',
    vehicle_model: 'Vario EV',
    vehicle_year: '2023',
    plate_number: 'B 4892 KLP',
    license_number: 'SIM-C-984210492',
    operating_region: 'REG-JABODETABEK',
    operating_region_label: '1. JaBoDeTaBek (Tangerang Selatan & Jakarta Timur)',
    partner_type: 'Yayasan',
    rating: 4.9,
    completed_trips: 184,
    total_earnings_idr: 4850000,
    currentLat: -6.2952,
    currentLng: 106.7135,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    driver_id: 'DRV-002',
    user_id: 'USR-102',
    name: 'Siti Rahmawati',
    phone: '+62 813-9876-5432',
    email: 'siti.rahmawati@bamboochain.id',
    ngopi_username: '@sitirahma',
    ngopi_chat_url: 'https://ngopi.top/contacts?join=BoomBoom',
    status: 'VERIFIED',
    isOnline: true,
    kodiba_member: true,
    kodiba_member_id: 'KODIBA-2026-0029',
    vehicle_type: 'BoomCar',
    vehicle_brand: 'Wuling Air EV',
    vehicle_model: 'Air EV Long Range',
    vehicle_year: '2024',
    plate_number: 'A 1902 BMC',
    license_number: 'SIM-A-874291039',
    operating_region: 'REG-SECIPALE',
    operating_region_label: '2. SeCiPaLe (Serang, Cilegon, Pandeglang, Lebak)',
    partner_type: 'BUMDes',
    rating: 5.0,
    completed_trips: 240,
    total_earnings_idr: 8120000,
    currentLat: -6.1149,
    currentLng: 106.1541,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    created_at: '2026-02-01T09:30:00Z'
  },
  {
    driver_id: 'DRV-003',
    user_id: 'USR-103',
    name: 'Budi Santoso',
    phone: '+62 856-1122-3344',
    email: 'budi.santoso@bamboochain.id',
    ngopi_username: '@budisantoso',
    ngopi_chat_url: 'https://ngopi.top/contacts?join=BoomBoom',
    status: 'VERIFIED',
    isOnline: true,
    kodiba_member: false,
    kodiba_member_id: null,
    vehicle_type: 'BoomRide',
    vehicle_brand: 'Yamaha NMAX 155',
    vehicle_model: 'NMAX Connected',
    vehicle_year: '2022',
    plate_number: 'D 6341 CBR',
    license_number: 'SIM-C-771239014',
    operating_region: 'REG-LAINNYA',
    operating_region_label: '3. Lainnya: Kab. Subang, Jawa Barat',
    partner_type: 'BUMDes',
    rating: 4.8,
    completed_trips: 96,
    total_earnings_idr: 2940000,
    currentLat: -6.6521,
    currentLng: 107.6932,
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
    kodiba_member: false,
    kodiba_member_id: null,
    vehicle_type: 'BoomCar',
    vehicle_brand: 'Toyota Avanza',
    vehicle_model: '1.5 G CVT',
    vehicle_year: '2023',
    plate_number: 'A 1289 PDG',
    license_number: 'SIM-A-554109821',
    operating_region: 'REG-SECIPALE',
    operating_region_label: '2. SeCiPaLe (Pandeglang & Lebak, Banten)',
    partner_type: 'Organisasi',
    rating: 4.7,
    completed_trips: 12,
    total_earnings_idr: 640000,
    currentLat: -6.3086,
    currentLng: 106.1067,
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    created_at: '2026-03-01T11:00:00Z'
  }
];

export const MOCK_OPERATORS = [
  {
    operator_id: 'OP-001',
    name: 'Yayasan Bambu Indonesia & Mitra JaBoDeTaBek',
    type: 'Yayasan',
    custom_type_detail: '',
    other_requirements_detail: 'Koordinasi titik jemput stasiun komuter, rusun, dan sentra komunitas JaBoDeTaBek',
    region: 'REG-JABODETABEK',
    zone_category: 'JABODETABEK',
    regency_city: 'Jakarta, Bogor, Depok, Tangerang, Bekasi',
    province: 'DKI Jakarta, Jawa Barat & Banten',
    operating_area: 'Zona Pilot 1: JaBoDeTaBek (Jakarta, Bogor, Depok, Tangerang/Tangsel, Bekasi)',
    legal_entity: 'AHU-0048219.AH.01.29.2025',
    operator_legal_status: 'Yayasan & Koperasi Mitra Terdaftar',
    license_reference: 'DISHUB-JABODETABEK/PILOT-KOMUNITAS/2026-01',
    compliance_status: 'COMPLIANT_VERIFIED',
    project_id: 'PRJ-JABODETABEK-01',
    contact_person: 'Pak Hendra Wijaya (Koordinator Wilayah JaBoDeTaBek)',
    phone: '+62 815-8899-1122',
    status: 'VERIFIED',
    driver_count: 57,
    monthly_trips: 940,
    monthly_revenue: 28200000,
    created_at: '2025-11-01T00:00:00Z'
  },
  {
    operator_id: 'OP-002',
    name: 'Konsorsium BUMDes & Organisasi Bambu SeCiPaLe',
    type: 'BUMDes',
    custom_type_detail: '',
    other_requirements_detail: 'Pengelolaan rute antar-desa, pasar rakyat, dan kawasan wisata Banten (Serang, Cilegon, Pandeglang, Lebak)',
    region: 'REG-SECIPALE',
    zone_category: 'SECIPALE',
    regency_city: 'Serang, Cilegon, Pandeglang, Lebak',
    province: 'Banten',
    operating_area: 'Zona Pilot 2: SeCiPaLe (Serang, Cilegon, Pandeglang, Lebak - Banten)',
    legal_entity: 'AHU-0019283-BANTEN.2025',
    operator_legal_status: 'Badan Usaha Milik Desa Bersama & Organisasi Komunitas',
    license_reference: 'DISHUB-BANTEN/PILOT-SECIPALE/2026-02',
    compliance_status: 'COMPLIANT_VERIFIED',
    project_id: 'PRJ-SECIPALE-02',
    contact_person: 'Tb. Хаsanudin (Koordinator Mitra SeCiPaLe)',
    phone: '+62 812-9988-7766',
    status: 'VERIFIED',
    driver_count: 38,
    monthly_trips: 680,
    monthly_revenue: 20400000,
    created_at: '2025-12-05T00:00:00Z'
  },
  {
    operator_id: 'OP-003',
    name: 'BUMDes Cibarani Jaya (Zona Lainnya: Kab. Subang, Jawa Barat)',
    type: 'BUMDes',
    custom_type_detail: 'Sinergi BUMDes & Kasepuhan Adat Desa',
    other_requirements_detail: 'Angkutan warga desa, hasil panen bambu & ekowisata kebun',
    region: 'REG-LAINNYA',
    zone_category: 'LAINNYA',
    regency_city: 'Kabupaten Subang',
    province: 'Jawa Barat',
    operating_area: 'Zona Pilot 3 (Lainnya): Kabupaten Subang, Provinsi Jawa Barat',
    legal_entity: 'AHU-0019283-BUMDES.2023',
    operator_legal_status: 'Badan Usaha Milik Desa Terdaftar',
    license_reference: 'DISHUB-DAERAH/PILOT-DESA/2026-03',
    compliance_status: 'COMPLIANT_VERIFIED',
    project_id: 'PRJ-DESA-LAINNYA-03',
    contact_person: 'Pak Dudung (Kepala BUMDes)',
    phone: '+62 811-2233-4455',
    status: 'VERIFIED',
    driver_count: 24,
    monthly_trips: 420,
    monthly_revenue: 12600000,
    created_at: '2026-01-20T00:00:00Z'
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
    plate_number: 'B 4892 KLP',
    vehicle_model: 'Honda Vario 160 EV',
    service_type: 'BoomRide',
    pickup_address: 'Balaikota Tangerang Selatan, Jl. Benda Raya No. 1',
    destination_address: 'Stasiun Sudimara Tangsel',
    pilot_region_id: 'REG-JABODETABEK',
    project_id: 'PRJ-JABODETABEK-01',
    distance_km: 4.2,
    estimated_duration: 12,
    response_time_sec: 38,
    estimated_fare: 15500,
    final_fare: 15500,
    trip_status: 'COMPLETED',
    payment_status: 'PAID',
    payment_method: 'QRIS / Rupiah',
    bmc_reward_earned: 2.5,
    green_co2_saved: 0.35,
    rating_given: 5,
    csat_tags: ['Tepat Waktu', 'Ramah & Sopan', 'Rute Aman'],
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
    plate_number: 'A 1902 BMC',
    vehicle_model: 'Wuling Air EV',
    service_type: 'BoomTogether',
    pickup_address: 'Alun-Alun Kota Serang, Banten',
    destination_address: 'Stasiun Rangkasbitung, Lebak',
    pilot_region_id: 'REG-SECIPALE',
    project_id: 'PRJ-SECIPALE-02',
    distance_km: 7.8,
    estimated_duration: 18,
    response_time_sec: 45,
    estimated_fare: 28000,
    final_fare: 28000,
    trip_status: 'COMPLETED',
    payment_status: 'PAID',
    payment_method: 'Bank Transfer / QRIS',
    bmc_reward_earned: 4.5,
    green_co2_saved: 0.95,
    rating_given: 5,
    csat_tags: ['Kendaraan Bersih', 'Tarif Transparan', 'Hemat Emisi EV'],
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
    description: 'Pengemudi mengambil rute alternatif karena perbaikan jalan.',
    latitude: -6.2952,
    longitude: 106.7135,
    status: 'RESOLVED',
    resolution_note: 'Dikonfirmasi aman oleh Mitra Pengelola Wilayah, jalan utama sedang dicor.',
    created_at: '2026-09-28T14:25:00Z',
    resolved_at: '2026-09-28T14:30:00Z'
  }
];

export const MOCK_COMPLAINTS = [
  {
    complaint_id: 'CMP-301',
    trip_id: 'TRIP-9001',
    reporter_name: 'Mang Ujang',
    reporter_role: 'PASSENGER',
    category: 'WAIT_TIME',
    subject: 'Waktu tunggu di simpang jalan agak lama saat hujan',
    description: 'Sinyal GPS sempat lambat 2 menit saat hujan deras, namun driver ramah dan memberi kabar via ngopi.top.',
    region_id: 'REG-JABODETABEK',
    status: 'RESOLVED',
    resolution_note: 'Titik jemput ditambahkan ke preset koordinat akurat.',
    created_at: '2026-09-28T15:00:00Z',
    resolved_at: '2026-09-28T16:15:00Z'
  },
  {
    complaint_id: 'CMP-302',
    trip_id: 'TRIP-9002',
    reporter_name: 'Kang Dedi (Warga)',
    reporter_role: 'PASSENGER',
    category: 'PICKUP_POINT',
    subject: 'Usulan penambahan titik tunggu BoomTogether di Pintu Stasiun',
    description: 'Mohon ditambahkan rambu titik kumpul resmi Mitra di koridor SeCiPaLe & JaBoDeTaBek agar penumpang lebih mudah bertemu driver.',
    region_id: 'REG-SECIPALE',
    status: 'OPEN',
    resolution_note: null,
    created_at: '2026-10-02T10:20:00Z',
    resolved_at: null
  }
];

export const INITIAL_PILOT_METRICS = {
  total_pilot_requests: 1642,
  completed_trips_count: 1550,
  cancelled_trips_count: 92,
  trip_completion_rate_pct: 94.4,
  avg_response_time_sec: 42,
  avg_pickup_arrival_min: 4.3,
  cancellation_rate_pct: 5.6,
  cancellation_reasons: {
    'Berubah pikiran / salah titik jemput': 41,
    'Cuaca hujan deras di jalur desa': 24,
    'Beralih ke Kode BoomInstan di tempat': 19,
    'Pengemudi terlalu jauh (>5 km)': 8
  },
  total_complaints: 6,
  resolved_complaints: 5,
  safety_incidents_total: 1,
  safety_incidents_open: 0,
  zero_fatality_days: 120,
  total_driver_earnings_idr: 38450000,
  avg_driver_daily_earnings_idr: 185000,
  driver_revenue_share_pct: 85,
  operator_revenue_share_pct: 5,
  user_satisfaction_csat_pct: 97.2,
  avg_star_rating: 4.92,
  total_ratings_submitted: 1410,
  top_csat_tags: [
    { tag: 'Tepat Waktu', count: 980 },
    { tag: 'Ramah & Sopan', count: 945 },
    { tag: 'Tarif Transparan (85% ke Driver)', count: 890 },
    { tag: 'Rute Aman & Hafal Jalan Desa', count: 812 },
    { tag: 'Kendaraan Bersih / EV Ramah Lingkungan', count: 640 }
  ]
};
