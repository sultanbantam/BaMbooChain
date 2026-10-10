// Data and configuration for BangunIn MBR Housing Ecosystem
export const MBR_PROJECTS = [
  {
    id: 'proj-banten-01',
    name: 'Griya Lestari Banten Eco-Cluster',
    developer: 'PT. Katama Suryabumi x Sabumi Nusantara',
    developerId: 'dev-katama',
    city: 'Serang',
    province: 'Banten',
    address: 'Jl. Raya Taktakan No. 45, Serang, Banten',
    coordinates: [-6.1200, 106.1503],
    status: 'CONSTRUCTION', // 'PLANNED' | 'CONSTRUCTION' | 'COMPLETED'
    permitStatus: 'APPROVED', // 'PENDING' | 'APPROVED'
    permitNumber: 'PBG-360401-2026-00412',
    totalUnits: 120,
    availableUnits: 34,
    priceMin: 168000000,
    priceMax: 215000000,
    coverImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    subsidyType: 'KPR BTN FLPP Sejahtera',
    unitTypes: ['BlockBamboo Tipe 36', 'RISHAM Tipe 30', 'Hybrid Eco 36/60'],
    description: 'Kawasan perumahan MBR ramah lingkungan berbasis struktur bambu terawetkan dan beton modular ramah gempa RISHAM. Dilengkapi fasilitas Bank Sampah, Shuttle Komunitas, dan Ruang Terbuka Hijau (RTH).',
    features: ['Bebas Banjir', 'Struktur Ramah Gempa', 'Taman Tematik & RTH', 'Shuttle Warga', 'Smart Waste Hub', 'Listrik PLN 1300 VA', 'Air Bersih PDAM'],
    progressPercentage: 68,
    btnPartnerStatus: 'Mitra Utama Bank BTN KC Serang',
    developerContact: {
      phone: '0817-413-9994',
      email: 'proyek@sabumi.id',
      pic: 'Ir. Mukoddas Syuhada'
    }
  },
  {
    id: 'proj-bogor-02',
    name: 'Pesona Bambu Nusantara Parung Panjang',
    developer: 'PT. Bamboo Republik Indonesia',
    developerId: 'dev-bri',
    city: 'Bogor',
    province: 'Jawa Barat',
    address: 'Kawasan Industri Kreatif Bambu, Parung Panjang, Bogor',
    coordinates: [-6.3550, 106.5700],
    status: 'CONSTRUCTION',
    permitStatus: 'APPROVED',
    permitNumber: 'PBG-320108-2026-00891',
    totalUnits: 200,
    availableUnits: 58,
    priceMin: 185000000,
    priceMax: 240000000,
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ],
    subsidyType: 'KPR BTN FLPP & Tapera',
    unitTypes: ['BlockBamboo Modern 36/72', 'Hybrid Tropis 45/84'],
    description: 'Hunian asri masa depan dengan fasad bambu laminasi rekayasa (engineered bamboo). Akses 10 menit ke Stasiun KRL Parung Panjang dengan shuttle terintegrasi.',
    features: ['10 Menit Stasiun KRL', 'Insulasi Suhu Dingin Bambu', 'Jalur Sepeda & Pejalan Kaki', 'Internet Komunitas Fiber', 'Kantin UMKM Warga'],
    progressPercentage: 45,
    btnPartnerStatus: 'Mitra Strategis Bank BTN KC Bogor',
    developerContact: {
      phone: '0812-8899-7711',
      email: 'sales@bamboorepublik.com',
      pic: 'Fajar Nugraha'
    }
  },
  {
    id: 'proj-cikarang-03',
    name: 'Cluster RISHAM Harmoni Cikarang',
    developer: 'PT. Panorama Agung Utama (PAU)',
    developerId: 'dev-pau',
    city: 'Bekasi',
    province: 'Jawa Barat',
    address: 'Jl. Industri Sukaresmi, Cikarang Selatan, Bekasi',
    coordinates: [-6.3200, 107.1400],
    status: 'COMPLETED',
    permitStatus: 'APPROVED',
    permitNumber: 'SLF-321602-2025-00122',
    totalUnits: 150,
    availableUnits: 12,
    priceMin: 175000000,
    priceMax: 210000000,
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
    ],
    subsidyType: 'KPR BTN FLPP Pekerja Sektor Industri',
    unitTypes: ['RISHAM Paten Type 36/60', 'RISHAM Compact 28/60'],
    description: 'Pemenang Paten Sederhana No. IDS000007465 untuk struktur panel pracetak RISHAM (Rumah Instan Hemat Aman). Siap huni, kokoh, ramah gempa, dan hemat energi.',
    features: ['Siap Huni (Ready Stock)', 'Paten Ramah Gempa RISHAM', 'Dekat Kawasan Industri EJIP/GIIC', 'Keamanan 24 Jam One-Gate'],
    progressPercentage: 100,
    btnPartnerStatus: 'Mitra Bank BTN KC Cikarang',
    developerContact: {
      phone: '0813-2200-4411',
      email: 'info@panoramaagung.co.id',
      pic: 'Deden Setiawan'
    }
  },
  {
    id: 'proj-lebak-04',
    name: 'Kawasan Mandiri Bambu Rangkasbitung',
    developer: 'Konsorsium Perumahan Rakyat Banten',
    developerId: 'dev-kprb',
    city: 'Lebak',
    province: 'Banten',
    address: 'Jl. Raya Cipanas Km. 7, Rangkasbitung, Lebak',
    coordinates: [-6.3600, 106.2500],
    status: 'PLANNED',
    permitStatus: 'PENDING',
    permitNumber: 'IZIN-360201-2026-PLAN',
    totalUnits: 300,
    availableUnits: 180,
    priceMin: 162000000,
    priceMax: 198000000,
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'
    ],
    subsidyType: 'KPR BTN FLPP & Mikro Perumahan',
    unitTypes: ['BlockBamboo MBR 36', 'Hybrid Agro-Housing 36/90'],
    description: 'Masterplan kawasan perumahan MBR terpadu seluas 15 hektar dengan konsep Agro-Forestry Bambu, sentra kerajinan, dan pembibitan bambu rakyat.',
    features: ['Kawasan Agro-Forestry', 'Sentra Produksi Bambu', 'Dekat Tol Serang-Panimbang', 'Fasilitas Masjid Raya & Poliklinik'],
    progressPercentage: 15,
    btnPartnerStatus: 'Dalam Proses MoU BTN Kanwil 2',
    developerContact: {
      phone: '0817-413-9994',
      email: 'kontak@bamboochain.id',
      pic: 'Sekretariat Konsorsium'
    }
  }
];

export const HOUSING_MODELS = [
  {
    id: 'model-blockbamboo',
    name: 'BlockBamboo Prefab MBR',
    tagline: 'Struktur Bambu Laminasi Cepat Bangun, Dingin & Rendah Karbon',
    badge: '100% Eco Material',
    basePrice: 168000000,
    minArea: 36,
    landArea: 60,
    floorsDefault: 1,
    bedroomsDefault: 2,
    bathroomsDefault: 1,
    constructionTimeWeeks: 6,
    carbonOffsetTons: 12.4,
    thermalIndex: 'Suhu 4°C Lebih Sejuk',
    earthquakeResist: 'Skala MMI VIII (Ramah Gempa Tinggi)',
    specs: {
      foundation: 'Pondasi Umpak Batu Kali & Tie Beam Ringan',
      structure: 'Kolom & Balok Engineered Bamboo (Bambu Laminasi Rekayasa)',
      walls: 'Dinding Panel Komposit Bambu & Anyaman Termal Kedap Suara',
      roof: 'Rangka Bambu Awet + Genteng Metal Berpasir Eco-Friendly',
      floor: 'Granit Tile Homogeneous 60x60',
      sanitary: 'Kloset Duduk Eco-Flush + Shower Hemat Air'
    },
    render3D: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'model-risham',
    name: 'RISHAM Modular Concrete',
    tagline: 'Rumah Instan Sederhana Sehat Aman Berpaten Resmi',
    badge: 'Paten IDS000007465',
    basePrice: 175000000,
    minArea: 30,
    landArea: 60,
    floorsDefault: 1,
    bedroomsDefault: 2,
    bathroomsDefault: 1,
    constructionTimeWeeks: 4,
    carbonOffsetTons: 6.8,
    thermalIndex: 'Insulasi Termal Dinding Panel Berpori',
    earthquakeResist: 'Sistem Sambungan Baut-Mur-Plat Khusus Ramah Gempa',
    specs: {
      foundation: 'Pondasi Titik Precast & Sloof Terintegrasi',
      structure: 'Panel Kolom & Balok Beton Pracetak Interlocking',
      walls: 'Dinding Panel Beton Ringan EPS Sandwich',
      roof: 'Rangka Baja Ringan Zincalume + Genteng Beton Ringan',
      floor: 'Keramik 40x40 Texture Anti-Slip',
      sanitary: 'Kloset Duduk Standar SNI + Kran Valve Kuningan'
    },
    render3D: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'model-hybrid',
    name: 'Hybrid Eco-RISHAM Bambu',
    tagline: 'Perpaduan Presisi Beton RISHAM & Keindahan Natural Bambu Laminasi',
    badge: 'Pilihan Paling Populer',
    basePrice: 188000000,
    minArea: 36,
    landArea: 72,
    floorsDefault: 1,
    bedroomsDefault: 2,
    bathroomsDefault: 1,
    constructionTimeWeeks: 5,
    carbonOffsetTons: 15.2,
    thermalIndex: 'Ventilasi Silang Alami (Zero AC Mode)',
    earthquakeResist: 'Dual-Resilience (Beton Modular + Fleksibilitas Bambu)',
    specs: {
      foundation: 'Pondasi KSLL Mini & Precast Footplate',
      structure: 'Struktur Utama RISHAM + Sekunder Engineered Bamboo',
      walls: 'Kombinasi Panel Beton RISHAM & Fasad Strip Bambu Awet',
      roof: 'Atap Pelana Tropis Rangka Bambu Laminasi',
      floor: 'Lantai Granit Motif Kayu Natural 60x60',
      sanitary: 'Sanitair Lengkap dengan Sistem Penampungan Air Hujan'
    },
    render3D: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'
  }
];

export const MOCK_UNIT_MONITORING = {
  unitId: 'UNT-GLB-A12',
  projectName: 'Griya Lestari Banten Eco-Cluster',
  blockNumber: 'Blok A No. 12',
  modelType: 'Hybrid Eco-RISHAM Bambu (Tipe 36/60)',
  buyerName: 'Mukoddas Syuhada',
  buyerEmail: 'sultanbantam@gmail.com',
  sp3kNumber: 'SP3K-BTN-SERANG-2026-981204',
  overallProgress: 68,
  kprDisbursementStage: 'Termin 3 (Pencairan 70%)',
  targetHandoverDate: '15 November 2026',
  blockchainAuditContract: '0x8f7311B903E4804369062E56B69046f59Ab00192',
  milestones: [
    {
      id: 'ms-1',
      name: 'Pondasi & Struktur Bawah (0% - 20%)',
      status: 'VERIFIED', // 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'VERIFIED'
      weight: 20,
      completedAt: '12 Agustus 2026',
      geotag: { lat: -6.12004, lng: 106.15032, accuracyMeters: 2.1 },
      inspector: 'Ir. Hendra Wijaya (Bank BTN Officer)',
      photos: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80'
      ],
      blockchainTx: '0x71a9b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6',
      notes: 'Pondasi footplate dan sloof beton RISHAM terpasang presisi sesuai spek SNI.'
    },
    {
      id: 'ms-2',
      name: 'Dinding Panel & Kolom Bambu (21% - 50%)',
      status: 'VERIFIED',
      weight: 30,
      completedAt: '05 September 2026',
      geotag: { lat: -6.12006, lng: 106.15035, accuracyMeters: 1.8 },
      inspector: 'Ir. Hendra Wijaya (Bank BTN Officer)',
      photos: [
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'
      ],
      blockchainTx: '0x99e8d7c6b5a4132049586710abcdeffedcba0987654321fedcba098765432100',
      notes: 'Ereksi kolom engineered bamboo dan panel dinding EPS telah selesai 100% tanpa deviasi struktur.'
    },
    {
      id: 'ms-3',
      name: 'Rangka Atap & Penutup Eco-Roof (51% - 70%)',
      status: 'IN_PROGRESS',
      weight: 20,
      progressSub: 90,
      geotag: { lat: -6.12005, lng: 106.15034, accuracyMeters: 2.4 },
      inspector: 'Bambang Sudarso (Pengawas Lapangan Developer)',
      photos: [
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80'
      ],
      blockchainTx: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      notes: 'Pemasangan kuda-kuda bambu laminasi selesai, sedang pemasangan genteng metal berpasir.'
    },
    {
      id: 'ms-4',
      name: 'Instalasi MEP (Listrik, Air & Sanitair) (71% - 85%)',
      status: 'PENDING',
      weight: 15,
      geotag: null,
      photos: [],
      notes: 'Jadwal mulai: 20 Oktober 2026 setelah atap selesai sempurna.'
    },
    {
      id: 'ms-5',
      name: 'Finishing, Pengecatan & Serah Terima Kunci (86% - 100%)',
      status: 'PENDING',
      weight: 15,
      geotag: null,
      photos: [],
      notes: 'Jadwal inspeksi akhir BAST & Kunci: 10-15 November 2026.'
    }
  ]
};

export const SHUTTLE_SERVICES = [
  {
    id: 'sht-school',
    name: 'Shuttle Anak Sekolah Griya Lestari',
    icon: 'Bus',
    type: 'SCHOOL',
    schedule: '06:15 & 14:00 WIB (Senin - Jumat)',
    route: 'Cluster Griya Lestari ⇄ SDN 1 Taktakan & SMPN 3 Serang',
    vehicle: 'Toyota HiAce Eco-Electric (Kapasitas 14 Siswa)',
    fare: 'Rp 5.000 / trip (Subsidi Koperasi MBR)',
    driverName: 'Pak Sukirman',
    plateNumber: 'A 7890 BG',
    driverPhone: '0819-0988-7766',
    rating: 4.9,
    status: 'ACTIVE'
  },
  {
    id: 'sht-work',
    name: 'Shuttle Stasiun KRL & Terminal',
    icon: 'Train',
    type: 'WORK',
    schedule: 'Setiap 30 menit (05:30 - 21:00 WIB)',
    route: 'Griya Lestari ⇄ Stasiun Serang ⇄ Terminal Pakupatan',
    vehicle: 'Wuling EV Van Komunitas (8 Penumpang)',
    fare: 'Rp 7.500 / trip',
    driverName: 'Kang Asep Supardi',
    plateNumber: 'A 1234 XY',
    driverPhone: '0812-3344-5566',
    rating: 4.8,
    status: 'ACTIVE'
  },
  {
    id: 'sht-goods',
    name: 'Mobil Angkutan Logistik & Pindahan Warga',
    icon: 'Truck',
    type: 'GOODS',
    schedule: 'Sesuai Pemesanan / On-Demand',
    route: 'Area Serang - Cilegon - Banten',
    vehicle: 'Pick-Up Listrik Roda Tiga & Mobil Box',
    fare: 'Mulai Rp 35.000 / sewa jam',
    driverName: 'Bang Mansur',
    plateNumber: 'A 9988 KD',
    driverPhone: '0857-1122-3344',
    rating: 5.0,
    status: 'ACTIVE'
  },
  {
    id: 'sht-emergency',
    name: 'Ambulans Siaga & Darurat Medis MBR',
    icon: 'HeartPulse',
    type: 'EMERGENCY',
    schedule: '24 Jam Siaga Setiap Hari',
    route: 'Perumahan ⇄ RSUD Banten / Puskesmas 24 Jam',
    vehicle: 'Daihatsu GranMax Ambulans Siaga Warga',
    fare: 'GRATIS (Didanai Kas Iuran Sosial Warga)',
    driverName: 'Tim Siaga Medis Yayasan',
    plateNumber: 'A 119 SOS',
    driverPhone: '0811-999-0119',
    rating: 5.0,
    status: 'ACTIVE'
  }
];

export const WASTE_SCHEDULES = [
  {
    id: 'wst-organic',
    type: 'Sampah Organik (Sisa Makanan, Dedaunan)',
    badge: 'Kompos Komunitas',
    days: 'Senin & Kamis',
    time: '07:00 - 09:00 WIB',
    pointsPerKg: 50,
    bmcPerKg: 0.005,
    destination: 'Pusat Biokonversi Maggot & Kompos Bambu Blok C',
    icon: 'Apple'
  },
  {
    id: 'wst-inorganic',
    type: 'Sampah Anorganik Daur Ulang (Plastik, Botol, Kardus, Kaca)',
    badge: 'Bank Sampah Digital',
    days: 'Rabu & Sabtu',
    time: '08:00 - 11:00 WIB',
    pointsPerKg: 150,
    bmcPerKg: 0.02,
    destination: 'Bank Sampah Berkah Mandiri & Daur Ulang Industri',
    icon: 'Recycle'
  },
  {
    id: 'wst-b3',
    type: 'Limbah B3 & Elektronik (Baterai, Lampu, Kabel, Obat)',
    badge: 'Drop Point Khusus',
    days: 'Minggu Pertama Setiap Bulan',
    time: '09:00 - 12:00 WIB',
    pointsPerKg: 300,
    bmcPerKg: 0.05,
    destination: 'Pengolahan Limbah Khusus Resmi BPLHD',
    icon: 'AlertTriangle'
  }
];

export const USED_GOODS_LISTINGS = [
  {
    id: 'ug-1',
    title: 'Meja Belajar Kayu & Rak Buku Anak 2 Tingkat',
    category: 'Perabotan Rumah',
    condition: 'Bekas Baik (85%)',
    listingType: 'SELL', // 'SELL' | 'DONATE' | 'EXCHANGE'
    price: 120000,
    aiEstimatedPrice: 135000,
    sellerName: 'Ibu Ratna (Blok B-08)',
    photo: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
    description: 'Masih sangat kokoh, anak sudah lulus SD jadi mau ganti meja yang lebih besar. Siap diangkut kapan saja.'
  },
  {
    id: 'ug-2',
    title: 'Kipas Angin Berdiri Miyako 16 Inch',
    category: 'Elektronik',
    condition: 'Normal 100%',
    listingType: 'SELL',
    price: 85000,
    aiEstimatedPrice: 90000,
    sellerName: 'Pak Dedi (Blok A-14)',
    photo: 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=600&q=80',
    description: 'Angin kencang, putaran halus, 3 level kecepatan. Dijual karena sudah pasang exhaust bambu alami.'
  },
  {
    id: 'ug-3',
    title: 'Seragam Pramuka & Putih Merah SD Ukuran M (3 Pasang)',
    category: 'Pakaian & Perlengkapan',
    condition: 'Bersih & Rapi (90%)',
    listingType: 'DONATE',
    price: 0,
    aiEstimatedPrice: 0,
    sellerName: 'Ibu Siti (Blok C-02)',
    photo: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    description: 'Didonasikan secara gratis untuk adik-adik warga MBR yang membutuhkan seragam sekolah baru naik kelas.'
  },
  {
    id: 'ug-4',
    title: 'Sisa Baja Ringan C75 & Reng 6 Batang + Genteng Metal',
    category: 'Bahan Bangunan',
    condition: 'Baru Sisa Renovasi',
    listingType: 'EXCHANGE',
    price: 0,
    aiEstimatedPrice: 180000,
    sellerName: 'Kang Ujang (Blok D-05)',
    photo: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
    description: 'Mau ditukar dengan tanaman hias/bibit bambu atau semen instan untuk taman depan.'
  }
];

export const REWARDS_CATALOG = [
  {
    id: 'rw-pln',
    title: 'Token Listrik PLN Rp 50.000',
    pointsCost: 500,
    stock: 25,
    category: 'Utilitas',
    icon: 'Zap'
  },
  {
    id: 'rw-ipl',
    title: 'Subsidi Bebas Iuran Lingkungan (IPL) 1 Bulan',
    pointsCost: 750,
    stock: 50,
    category: 'Perumahan',
    icon: 'Home'
  },
  {
    id: 'rw-sembako',
    title: 'Paket Sembako Berkah MBR (Beras 5kg, Minyak, Gula)',
    pointsCost: 1000,
    stock: 15,
    category: 'Pangan',
    icon: 'ShoppingBag'
  },
  {
    id: 'rw-bmc',
    title: 'Voucher Konversi 10 BMC On-Chain Token',
    pointsCost: 400,
    stock: 100,
    category: 'Crypto Web3',
    icon: 'Coins'
  },
  {
    id: 'rw-bambu',
    title: 'Paket 3 Bibit Bambu Petung Unggul & Pupuk Hayati',
    pointsCost: 300,
    stock: 40,
    category: 'Eco Living',
    icon: 'Trees'
  }
];

export const COMMUNITY_EVENTS = [
  {
    id: 'ev-1',
    title: 'Kerja Bakti Gotong Royong Saluran & Taman Bambu Hijau',
    category: 'GOTONG_ROYONG',
    date: 'Minggu, 18 Oktober 2026',
    time: '07:00 - 11:00 WIB',
    location: 'Taman Komunitas RTH Blok A - D',
    participantsCount: 48,
    maxParticipants: 100,
    pointsReward: 150,
    bannerUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
    description: 'Pembersihan saluran drainase menjelang musim hujan dan penanaman 50 rumpun bambu hias di sepanjang jalan utama.'
  },
  {
    id: 'ev-2',
    title: 'Workshop Daur Ulang Sampah Plastik Menjadi Eco-Paving',
    category: 'TRAINING',
    date: 'Sabtu, 24 Oktober 2026',
    time: '09:00 - 12:30 WIB',
    location: 'Balai Warga Griya Lestari',
    participantsCount: 32,
    maxParticipants: 40,
    pointsReward: 200,
    bannerUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    description: 'Pelatihan mencetak paving block komposit limbah plastik kresek dicampur pasir dan abu bambu tahan beban 200 kg/cm2.'
  },
  {
    id: 'ev-3',
    title: 'Bazar Murah Sembako & Pameran Produk Kerajinan Warga',
    category: 'BAZAAR',
    date: 'Minggu, 01 November 2026',
    time: '08:00 - 16:00 WIB',
    location: 'Lapangan Futsal Komunitas',
    participantsCount: 75,
    maxParticipants: 200,
    pointsReward: 100,
    bannerUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80',
    description: 'Bazar sembako murah bersubsidi Bank BTN dan lapak jualan aneka kuliner serta pernak-pernik anyaman bambu warga.'
  }
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Keluarga Bpk. Sukirman', block: 'Blok A-04', points: 3420, level: 'Warga Teladan Hijau 🌟', streakDays: 28 },
  { rank: 2, name: 'Keluarga Ibu Ratna', block: 'Blok B-08', points: 2980, level: 'Eco Hero 🌿', streakDays: 22 },
  { rank: 3, name: 'Keluarga Bpk. Dedi', block: 'Blok A-14', points: 2750, level: 'Eco Hero 🌿', streakDays: 19 },
  { rank: 4, name: 'Keluarga Bpk. Mukoddas Syuhada', block: 'Blok A-12', points: 2640, level: 'Eco Pioneer 🎋', streakDays: 15 },
  { rank: 5, name: 'Keluarga Kang Ujang', block: 'Blok D-05', points: 2190, level: 'Eco Pioneer 🎋', streakDays: 12 }
];
