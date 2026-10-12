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
    brochurePdfUrl: 'https://bamboochain.id/docs/brosur_griya_lestari_banten.pdf',
    legalDocPdfUrl: 'https://bamboochain.id/docs/pbg_griya_lestari_banten.pdf',
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
    id: 'proj-cilegon-05',
    name: 'Griya Asri Cilegon Harmoni',
    developer: 'PT. Asri Graha Pratama',
    developerId: 'dev-agp',
    city: 'Cilegon',
    province: 'Banten',
    address: 'Jl. Lingkar Selatan KM 8, Cibeber, Cilegon, Banten',
    coordinates: [-6.0300, 106.0400],
    status: 'COMPLETED',
    permitStatus: 'APPROVED',
    permitNumber: 'SLF-367201-2025-00341',
    totalUnits: 180,
    availableUnits: 18,
    priceMin: 168000000,
    priceMax: 195000000,
    coverImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'
    ],
    brochurePdfUrl: 'https://bamboochain.id/docs/brosur_griya_asri_cilegon.pdf',
    legalDocPdfUrl: 'https://bamboochain.id/docs/slf_griya_asri_cilegon.pdf',
    subsidyType: 'KPR BTN FLPP Pekerja Industri Krakatau',
    unitTypes: ['RISHAM Tipe 36/60', 'BlockBamboo MBR 30/60'],
    description: 'Hunian MBR siap huni dengan akses 5 menit ke kawasan industri Cilegon dan pintu tol Cilegon Timur. Struktur ramah gempa berpaten resmi.',
    features: ['Siap Huni', '5 Menit Tol Cilegon Timur', 'Struktur Ramah Gempa', 'One Gate System', 'Masjid Komplek'],
    progressPercentage: 100,
    btnPartnerStatus: 'Mitra Bank BTN KC Cilegon',
    developerContact: {
      phone: '0812-3456-7890',
      email: 'sales@griyaasricilegon.co.id',
      pic: 'Hendra Gunawan'
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
    brochurePdfUrl: 'https://bamboochain.id/docs/brosur_pesona_bambu_nusantara.pdf',
    legalDocPdfUrl: 'https://bamboochain.id/docs/pbg_pesona_bambu.pdf',
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
    id: 'proj-bogor-06',
    name: 'Pesona Kahuripan 9 Klapanunggal',
    developer: 'PT. Hikmah Alam Sentosa',
    developerId: 'dev-has',
    city: 'Bogor',
    province: 'Jawa Barat',
    address: 'Jl. Raya Klapanunggal - Cileungsi, Bogor Timur',
    coordinates: [-6.4800, 106.9400],
    status: 'CONSTRUCTION',
    permitStatus: 'APPROVED',
    permitNumber: 'PBG-320112-2025-00714',
    totalUnits: 500,
    availableUnits: 142,
    priceMin: 185000000,
    priceMax: 210000000,
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
    ],
    brochurePdfUrl: 'https://bamboochain.id/docs/brosur_pesona_kahuripan_9.pdf',
    legalDocPdfUrl: 'https://bamboochain.id/docs/pbg_pesona_kahuripan.pdf',
    subsidyType: 'KPR BTN FLPP & BP Tapera',
    unitTypes: ['RISHAM Tipe 36/60', 'BlockBamboo Eco 30/60'],
    description: 'Proyek perumahan subsidi MBR skala kota mandiri dengan fasilitas sarana olahraga, area komersil, dan konektivitas angkutan umum ke Jakarta.',
    features: ['Double Dinding', 'Rangka Atap Baja Ringan', 'Jalan Cor Beton', 'Dekat RS & Sekolah', 'Air Sumur Bor Jernih'],
    progressPercentage: 55,
    btnPartnerStatus: 'Mitra Utama Bank BTN KC Cibubur',
    developerContact: {
      phone: '0811-9988-776',
      email: 'info@pesonakahuripan.co.id',
      pic: 'Bambang Sudarmono'
    }
  },
  {
    id: 'proj-karawang-07',
    name: 'Puri Griya Asri Cikampek',
    developer: 'PT. Griya Asri Mandiri',
    developerId: 'dev-gam',
    city: 'Karawang',
    province: 'Jawa Barat',
    address: 'Jl. Raya Dawuan, Cikampek, Karawang',
    coordinates: [-6.4000, 107.4500],
    status: 'COMPLETED',
    permitStatus: 'APPROVED',
    permitNumber: 'SLF-321503-2025-00088',
    totalUnits: 250,
    availableUnits: 28,
    priceMin: 175000000,
    priceMax: 205000000,
    coverImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'
    ],
    brochurePdfUrl: 'https://bamboochain.id/docs/brosur_puri_griya_asri_cikampek.pdf',
    legalDocPdfUrl: 'https://bamboochain.id/docs/slf_griya_asri_karawang.pdf',
    subsidyType: 'KPR BTN FLPP Tenaga Kerja Industri',
    unitTypes: ['BlockBamboo Type 36', 'RISHAM Type 36/66'],
    description: 'Perumahan asri untuk pekerja kawasan industri Karawang & Cikampek dengan konsep eco-green dan pengelolaan limbah organik warga.',
    features: ['Dekat Pintu Tol Dawuan', 'Stasiun KRL Cikampek', 'Jalan Lebar 7 Meter', 'Ramah Gempa'],
    progressPercentage: 100,
    btnPartnerStatus: 'Mitra Bank BTN KC Karawang',
    developerContact: {
      phone: '0813-8877-6655',
      email: 'pemasaran@griyaasricikampek.com',
      pic: 'Yulianto Tri'
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
    brochurePdfUrl: 'https://bamboochain.id/docs/brosur_risham_harmoni_cikarang.pdf',
    legalDocPdfUrl: 'https://bamboochain.id/docs/slf_risham_cikarang.pdf',
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
    brochurePdfUrl: 'https://bamboochain.id/docs/brosur_kawasan_bambu_lebak.pdf',
    legalDocPdfUrl: 'https://bamboochain.id/docs/masterplan_kawasan_lebak.pdf',
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
  },
  {
    id: 'proj-semarang-08',
    name: 'Graha Cipta Asri Ungaran',
    developer: 'PT. Cipta Graha Mandiri Jateng',
    developerId: 'dev-cgmj',
    city: 'Semarang',
    province: 'Jawa Tengah',
    address: 'Jl. Raya Bandungan - Ungaran, Kab. Semarang',
    coordinates: [-7.1300, 110.4000],
    status: 'CONSTRUCTION',
    permitStatus: 'APPROVED',
    permitNumber: 'PBG-332205-2025-00451',
    totalUnits: 160,
    availableUnits: 45,
    priceMin: 166000000,
    priceMax: 198000000,
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    brochurePdfUrl: 'https://bamboochain.id/docs/brosur_graha_cipta_asri_ungaran.pdf',
    legalDocPdfUrl: 'https://bamboochain.id/docs/pbg_graha_cipta_asri.pdf',
    subsidyType: 'KPR BTN FLPP & Tapera Jawa Tengah',
    unitTypes: ['BlockBamboo Tipe 36/60', 'Hybrid Eco 36/70'],
    description: 'Perumahan berhawa sejuk di kaki Gunung Ungaran dengan konstruksi ramah gempa dan panel bambu laminasi penyejuk suhu alami.',
    features: ['Udara Sejuk Pegunungan', 'Air Mata Air Alami', 'Struktur Ramah Gempa', 'Dekat Exit Tol Ungaran'],
    progressPercentage: 60,
    btnPartnerStatus: 'Mitra Bank BTN KC Semarang',
    developerContact: {
      phone: '0812-7766-5544',
      email: 'marketing@grahaciptaasri.com',
      pic: 'Agus Pramono'
    }
  },
  {
    id: 'proj-sidoarjo-10',
    name: 'Griya Indah Permata Juanda',
    developer: 'PT. Permata Megah Nusantara',
    developerId: 'dev-pmn',
    city: 'Sidoarjo',
    province: 'Jawa Timur',
    address: 'Jl. Raya Sedati - Juanda, Sidoarjo, Jawa Timur',
    coordinates: [-7.3800, 112.7800],
    status: 'COMPLETED',
    permitStatus: 'APPROVED',
    permitNumber: 'SLF-351508-2025-00199',
    totalUnits: 220,
    availableUnits: 15,
    priceMin: 175000000,
    priceMax: 205000000,
    coverImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
    ],
    brochurePdfUrl: 'https://bamboochain.id/docs/brosur_griya_indah_permata_juanda.pdf',
    legalDocPdfUrl: 'https://bamboochain.id/docs/slf_griya_indah_juanda.pdf',
    subsidyType: 'KPR BTN FLPP Pekerja Sektor Logistik & Transportasi',
    unitTypes: ['RISHAM Modular 36/60', 'BlockBamboo Modern 36/70'],
    description: 'Lokasi strategis 15 menit ke Bandara Internasional Juanda dan Surabaya Timur. Rumah subsidi ramah gempa dengan spesifikasi komersial.',
    features: ['Bebas Banjir', 'Paving Block 6 Meter', 'One Gate System', 'CCTV 24 Jam', 'Playground'],
    progressPercentage: 100,
    btnPartnerStatus: 'Mitra Bank BTN KC Sidoarjo',
    developerContact: {
      phone: '0811-3322-1100',
      email: 'info@griyapermatajuanda.com',
      pic: 'Rudi Hartono'
    }
  },
  {
    id: 'proj-palembang-11',
    name: 'Griya Bukit Asri Gandus Mandiri',
    developer: 'PT. Sriwijaya Graha Sejahtera',
    developerId: 'dev-sgs',
    city: 'Palembang',
    province: 'Sumatera Selatan',
    address: 'Jl. Sofian Kenawas, Gandus, Palembang',
    coordinates: [-3.0200, 104.7200],
    status: 'CONSTRUCTION',
    permitStatus: 'APPROVED',
    permitNumber: 'PBG-167104-2025-00210',
    totalUnits: 350,
    availableUnits: 95,
    priceMin: 168000000,
    priceMax: 195000000,
    coverImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'
    ],
    brochurePdfUrl: 'https://bamboochain.id/docs/brosur_griya_bukit_asri_palembang.pdf',
    legalDocPdfUrl: 'https://bamboochain.id/docs/pbg_griya_bukit_asri.pdf',
    subsidyType: 'KPR BTN FLPP & Subsidi Selisih Bunga',
    unitTypes: ['BlockBamboo MBR 36', 'RISHAM Tipe 36/72'],
    description: 'Perumahan MBR mandiri dengan penghijauan bambu petung di tepian sungai Gandus untuk penahan erosi dan peneduh alami kawasan.',
    features: ['Dataran Tinggi Bebas Banjir', 'Air Bersih PDAM Tirta Musi', 'Listrik PLN 1300VA', 'Akses Angkot Feeder LRT'],
    progressPercentage: 70,
    btnPartnerStatus: 'Mitra Bank BTN KC Palembang',
    developerContact: {
      phone: '0812-7890-1234',
      email: 'gandus@sriwijayagraha.co.id',
      pic: 'M. Firdaus'
    }
  },
  {
    id: 'proj-makassar-13',
    name: 'Grand Mutiara Asri Maros',
    developer: 'PT. Celebes Properti Nusantara',
    developerId: 'dev-cpn',
    city: 'Maros',
    province: 'Sulawesi Selatan',
    address: 'Jl. Poros Maros - Pangkep KM 25, Mandai, Maros',
    coordinates: [-5.0100, 119.5700],
    status: 'CONSTRUCTION',
    permitStatus: 'APPROVED',
    permitNumber: 'PBG-730902-2025-00188',
    totalUnits: 280,
    availableUnits: 72,
    priceMin: 175000000,
    priceMax: 205000000,
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    brochurePdfUrl: 'https://bamboochain.id/docs/brosur_grand_mutiara_asri_maros.pdf',
    legalDocPdfUrl: 'https://bamboochain.id/docs/pbg_mutiara_maros.pdf',
    subsidyType: 'KPR BTN FLPP & Tapera Sulsel',
    unitTypes: ['BlockBamboo Tropis 36/72', 'RISHAM Modular 36/72'],
    description: 'Akses 12 menit ke Bandara Internasional Sultan Hasanuddin Makassar dan stasiun Kereta Api Trans Sulawesi.',
    features: ['Dekat Stasiun KA Trans Sulawesi', 'Insulasi Atap Bambu Dingin', 'Pondasi Anti Gempa', 'Fasilitas Lapangan Futsal'],
    progressPercentage: 50,
    btnPartnerStatus: 'Mitra Bank BTN KC Makassar',
    developerContact: {
      phone: '0852-9988-7711',
      email: 'sales@celebesproperti.com',
      pic: 'Andi Mappatunru'
    }
  },
  {
    id: 'proj-balikpapan-14',
    name: 'Taman Asri Kencana Balikpapan',
    developer: 'PT. Borneo Mahakam Lestari',
    developerId: 'dev-bml',
    city: 'Balikpapan',
    province: 'Kalimantan Timur',
    address: 'Jl. Mulawarman, Manggar, Balikpapan Timur',
    coordinates: [-1.2200, 116.9200],
    status: 'PLANNED',
    permitStatus: 'APPROVED',
    permitNumber: 'PBG-647103-2026-00052',
    totalUnits: 300,
    availableUnits: 210,
    priceMin: 182000000,
    priceMax: 220000000,
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    brochurePdfUrl: 'https://bamboochain.id/docs/brosur_taman_asri_balikpapan.pdf',
    legalDocPdfUrl: 'https://bamboochain.id/docs/pbg_taman_asri_balikpapan.pdf',
    subsidyType: 'KPR BTN FLPP Penyangga Ibu Kota Nusantara (IKN)',
    unitTypes: ['BlockBamboo Eco 36/84', 'Hybrid Borneo 36/90'],
    description: 'Hunian ramah lingkungan penyangga IKN Nusantara dengan panel bambu lokal Kalimantan dan efisiensi energi solar cell.',
    features: ['Koridor Penyangga IKN', 'Panel Surya Terintegrasi', 'Struktur Ramah Gempa', 'Taman Botani Bambu'],
    progressPercentage: 20,
    btnPartnerStatus: 'Mitra Bank BTN KC Balikpapan',
    developerContact: {
      phone: '0812-5544-3322',
      email: 'kontak@borneomahakam.co.id',
      pic: 'Bayu Prasetyo'
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
  },
  {
    id: 'model-postmodern',
    name: 'Postmodern Eco-Living MBR',
    tagline: 'Gaya Kontemporer Kubikal dengan Overhang Kanopi Bambu Kurva',
    badge: 'Desain Futuristik Hijau',
    basePrice: 192000000,
    minArea: 36,
    landArea: 72,
    floorsDefault: 1,
    bedroomsDefault: 2,
    bathroomsDefault: 1,
    constructionTimeWeeks: 5,
    carbonOffsetTons: 14.8,
    thermalIndex: 'Double-Skin Façade (Insulasi Panas Maksimal)',
    earthquakeResist: 'Struktur Frame Modular Elastis Tahan Gempa',
    specs: {
      foundation: 'Pondasi Telapak Beton Bertulang & Balok Pengikat',
      structure: 'Baja Ringan Zincalume Komposit & Kolom Bambu Rekayasa',
      walls: 'Panel EPS Ringan Berplester & Sekat Akustik Bambu',
      roof: 'Atap Flat Miring Tersembunyi dengan Insulasi Foil Reflektif',
      floor: 'Homogeneous Tile 60x60 Matte Finish',
      sanitary: 'Monoblok Dual Flush + Shower Spray Tekanan Rendah'
    },
    render3D: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'model-minimalis',
    name: 'Minimalis Hijau MBR',
    tagline: 'Kompak, Efisien Ruang, Hemat Energi dengan Louver Bambu Vertikal',
    badge: 'Paling Terjangkau & Efisien',
    basePrice: 165000000,
    minArea: 30,
    landArea: 60,
    floorsDefault: 1,
    bedroomsDefault: 2,
    bathroomsDefault: 1,
    constructionTimeWeeks: 4,
    carbonOffsetTons: 10.5,
    thermalIndex: 'Peneduh Alami Louver Bambu (Hemat Listrik 30%)',
    earthquakeResist: 'Konstruksi Interlocking Ramah Gempa SNI',
    specs: {
      foundation: 'Pondasi Batu Belah & Sloof Beton Praktis',
      structure: 'Rangka Beton Bertulang Praktis K-225',
      walls: 'Bata Ringan Hebel & Kisi-kisi Bambu Vertikal',
      roof: 'Rangka Baja Ringan + Genteng Multiroof Eco',
      floor: 'Keramik 50x50 Polished Cream',
      sanitary: 'Kloset Jongkok/Duduk SNI + Bak Mandi Fiber Minimalis'
    },
    render3D: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'model-tropis',
    name: 'Tropis Nusantara MBR',
    tagline: 'Atap Pelana Tinggi Penepis Hujan & Panas dengan Selasar Teras Bambu',
    badge: 'Kearifan Lokal Nusantara',
    basePrice: 172000000,
    minArea: 36,
    landArea: 60,
    floorsDefault: 1,
    bedroomsDefault: 2,
    bathroomsDefault: 1,
    constructionTimeWeeks: 5,
    carbonOffsetTons: 13.6,
    thermalIndex: 'Plafon Tinggi 3.6m + Ventilasi Silang Udara Bebas',
    earthquakeResist: 'Sistem Konstruksi Rumah Kayu-Bambu Tahan Gempa Tradisional',
    specs: {
      foundation: 'Pondasi Umpak Beton Setempat & Balok Sloof Antirayap',
      structure: 'Bambu Petung Terawetkan & Panel Interlock',
      walls: 'Kombinasi Plesteran Dinding & Anyaman Bambu Kedap Air',
      roof: 'Rangka Kuda-kuda Bambu + Genteng Tanah Liat Eco-Glaze',
      floor: 'Lantai Keramik Motif Terakota Hangat 40x40',
      sanitary: 'Kloset Duduk Eco + Bak Penampungan Air Bersih Otomatis'
    },
    render3D: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
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

// ────────── V2.0 ADDITIONS: KOPDES MERAH PUTIH ──────────
export const KOPDES_PRODUCTS = [
  {
    id: 'kp-1',
    name: 'Beras SPHP Bulog (5 Kg)',
    category: 'Pangan Pokok',
    price: 62500,
    stock: 120,
    unit: 'Sak 5kg',
    subsidyNote: 'Program Stabilisasi Pasokan Pangan Pemerintah',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'kp-2',
    name: 'Minyakita Kemasan Pouch (1 Liter)',
    category: 'Pangan Pokok',
    price: 15500,
    stock: 85,
    unit: 'Pouch 1L',
    subsidyNote: 'Minyak Goreng Rakyat HET Terjamin',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'kp-3',
    name: 'Telur Ayam Ras Segar (1 Kg)',
    category: 'Lauk Pauk',
    price: 28000,
    stock: 45,
    unit: 'Kg',
    subsidyNote: 'Peternakan Rakyat Binaan Koperasi',
    image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'kp-4',
    name: 'Gula Pasir Kristal Maniskita (1 Kg)',
    category: 'Pangan Pokok',
    price: 17500,
    stock: 60,
    unit: 'Kg',
    subsidyNote: 'Produksi BUMN Pangan',
    image: 'https://images.unsplash.com/photo-1622484212850-cab596d66e74?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'kp-5',
    name: 'Paket Sayuran Segar Kebun Warga MBR',
    category: 'Sayuran Organik',
    price: 15000,
    stock: 30,
    unit: 'Paket Campur (Bayam, Kangkung, Cabai)',
    subsidyNote: 'Panen Urban Farming Komunitas Hijau',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'kp-6',
    name: 'Bumbu Dapur Lengkap Halus Komplit',
    category: 'Bumbu Masak',
    price: 12000,
    stock: 50,
    unit: 'Toples 250gr',
    subsidyNote: 'UMKM Ibu-Ibu Perumahan MBR',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80'
  }
];

export const KOPDES_PARTNERS = [
  {
    id: 'kd-taktakan',
    name: 'Koperasi Desa Merah Putih Taktakan Mandiri',
    address: 'Jl. Raya Taktakan KM 4.5, Serang, Banten',
    pic: 'Bpk. Ahmad Suwandi (Ketua Koperasi)',
    phone: '0813-8822-1945',
    village: 'Desa Taktakan',
    coverage: 'Kawasan Griya Lestari & Sekitarnya',
    status: 'AKTIF (Mitra Distribusi Logistik Sembako)'
  }
];

// ────────── V2.0 ADDITIONS: E-TOLL BTN SIMBIOSIS MUTUALISME ──────────
export const MOCK_ETOLL_CARD = {
  cardNumber: '6013-0988-1244-8891',
  cardHolder: 'Mukoddas Syuhada',
  balance: 145000,
  btnCommissionRate: 150, // Rp 150 komisi masuk ke Bank BTN per tap
  bankName: 'Bank BTN',
  cardType: 'E-Toll BTN Tap-Smart MBR'
};

export const MOCK_ETOLL_TRANSACTIONS = [
  {
    id: 'et-101',
    date: '12 Okt 2026, 06:20 WIB',
    service: 'Shuttle Anak Sekolah Griya Lestari',
    amount: 5000,
    btnFee: 150,
    status: 'SUCCESS',
    vehiclePlate: 'A 7890 BG'
  },
  {
    id: 'et-102',
    date: '11 Okt 2026, 07:15 WIB',
    service: 'Shuttle Stasiun KRL & Terminal',
    amount: 7500,
    btnFee: 150,
    status: 'SUCCESS',
    vehiclePlate: 'A 1234 XY'
  },
  {
    id: 'et-103',
    date: '10 Okt 2026, 14:00 WIB',
    service: 'Pengantaran Sembako Kopdes Merah Putih',
    amount: 5000,
    btnFee: 150,
    status: 'SUCCESS',
    vehiclePlate: 'A 9988 KD'
  },
  {
    id: 'et-104',
    date: '09 Okt 2026, 18:30 WIB',
    service: 'Shuttle Pulang Kerja KRL Stasiun Serang',
    amount: 7500,
    btnFee: 150,
    status: 'SUCCESS',
    vehiclePlate: 'A 1234 XY'
  }
];

// ────────── V2.0 ADDITIONS: URBAN FARMING ──────────
export const URBAN_FARMING_PLOTS = [
  {
    id: 'plot-a1',
    plotNumber: 'Plot A-01 (Blok Hijau Edukasi)',
    cropType: 'Bayam & Kangkung Organik',
    sizeSqm: 18,
    status: 'Masa Perawatan (Panen H-5)',
    farmerFamily: 'Keluarga Bpk. Mukoddas Syuhada',
    plantedDate: '24 September 2026',
    estimatedHarvestDate: '17 Oktober 2026',
    fertilizerType: 'Kompos Bambu Kascing (Cacing Tanah)',
    pointsReward: 75,
    progress: 75
  },
  {
    id: 'plot-b2',
    plotNumber: 'Plot B-02 (Biokonversi Maggot BSF)',
    cropType: 'Sentra Larva Maggot BSF (Pengolah Sisa Dapur)',
    sizeSqm: 24,
    status: 'Produksi Aktif (Siklus Harian)',
    farmerFamily: 'Kelompok Pemuda RW 04',
    plantedDate: '01 Oktober 2026',
    estimatedHarvestDate: 'Panen Harian (Pakan Ayam/Ikan)',
    fertilizerType: 'Limbah Organik Bank Sampah (45 kg/hari)',
    pointsReward: 120,
    progress: 90
  },
  {
    id: 'plot-c3',
    plotNumber: 'Plot C-03 (Polybag Cabai & Tomat)',
    cropType: 'Cabai Rawit Merah & Tomat Sayur',
    sizeSqm: 15,
    status: 'Berbunga & Berbuah Muda',
    farmerFamily: 'Keluarga Ibu Ratna (Blok B-08)',
    plantedDate: '10 September 2026',
    estimatedHarvestDate: '25 Oktober 2026',
    fertilizerType: 'Pupuk Organik Cair (POC) Bambu',
    pointsReward: 85,
    progress: 60
  }
];

// ────────── V2.0 ADDITIONS: POSYANDU KOMUNITAS MBR ──────────
export const POSYANDU_SCHEDULES = [
  {
    id: 'posy-1',
    title: 'Posyandu Balita Melati Griya Lestari',
    date: 'Kamis, 15 Oktober 2026',
    time: '08:30 - 11:30 WIB',
    location: 'Balai Warga Griya Lestari Blok A',
    services: [
      'Pemeriksaan Tumbuh Kembang & Stunting Balita',
      'Imunisasi Dasar Lengkap (Polio & Campak)',
      'Distribusi Vitamin A & Makanan Tambahan (PMT) Telur & Bubur Kacang Hijau'
    ],
    targetParticipants: 'Balita Usia 0 - 5 Tahun',
    registeredCount: 42,
    maxSlots: 60,
    isRegisteredMine: true,
    reminderSent: true
  },
  {
    id: 'posy-2',
    title: 'Posyandu Lansia Sehat Bugar MBR',
    date: 'Kamis, 22 Oktober 2026',
    time: '09:00 - 12:00 WIB',
    location: 'Gazebo RTH Bambu Blok C',
    services: [
      'Pemeriksaan Tekanan Darah (Tensi) & Gula Darah',
      'Skrining Asam Urat & Kolesterol',
      'Senam Lansia Ringan & Konsultasi Pola Makan'
    ],
    targetParticipants: 'Warga Usia 55 Tahun ke Atas',
    registeredCount: 35,
    maxSlots: 50,
    isRegisteredMine: false,
    reminderSent: false
  }
];

// ────────── V2.0 ADDITIONS: TOKEN SUBSIDI ──────────
export const TOKEN_SUBSIDIES = [
  {
    id: 'sub-pangan',
    name: 'Token Subsidi Pangan Rp 50.000',
    type: 'PANGAN',
    pointsCost: 400,
    partner: 'Kopdes Merah Putih',
    benefit: 'Potongan langsung Rp 50.000 saat belanja beras / minyak di Kopdes',
    validDays: 30,
    icon: 'ShoppingBag'
  },
  {
    id: 'sub-transport',
    name: 'Token Subsidi Transportasi Rp 30.000',
    type: 'TRANSPORT',
    pointsCost: 250,
    partner: 'E-Toll BTN Shuttle',
    benefit: 'Top up saldo E-Toll BTN otomatis untuk naik shuttle sekolah & kerja',
    validDays: 30,
    icon: 'Bus'
  },
  {
    id: 'sub-utilities',
    name: 'Token Subsidi Utilitas Rp 50.000',
    type: 'UTILITIES',
    pointsCost: 450,
    partner: 'PLN & PDAM',
    benefit: 'Keringanan pembayaran token listrik PLN atau air bersih',
    validDays: 30,
    icon: 'Zap'
  }
];

// ────────── V2.0 ADDITIONS: KONTROL BMW & JAMINAN PEMBANGUNAN ──────────
export const MOCK_BMW_TRACKING = {
  biaya: {
    rabTarget: 188000000,
    actualSpending: 127840000,
    absorptionPercent: 68,
    variancePercent: 0.4,
    status: 'ON_TRACK', // 'ON_TRACK' | 'WARNING' | 'CRITICAL'
    notes: 'Serapan termin 1 & termin 2 sesuai kurva S RAB. Tidak ada pembengkakan biaya.',
    stages: [
      { name: 'Termin 1 (Pondasi 20%)', amount: 37600000, status: 'DISBURSED', date: '12 Ags 2026' },
      { name: 'Termin 2 (Struktur Dinding 50%)', amount: 56400000, status: 'DISBURSED', date: '05 Sep 2026' },
      { name: 'Termin 3 (Rangka Atap 70%)', amount: 37600000, status: 'IN_REVIEW', date: '15 Okt 2026' },
      { name: 'Termin 4 (Finishing & BAST 100%)', amount: 56400000, status: 'PENDING', date: '15 Nov 2026' }
    ]
  },
  mutu: {
    qualityScore: 98.8,
    status: 'EXCELLENT',
    checklists: [
      { item: 'Uji Kuat Tekan Beton RISHAM (K-250 SNI)', passed: true, score: 'Lulus Uji Laboratorium PU' },
      { item: 'Preservasi Boron Bambu Laminasi (Anti Rayap & Jamur)', passed: true, score: 'Sertifikasi Keawetan Kelas I' },
      { item: 'Kelurusan Dinding Panel EPS & Sambungan Plat Baja', passed: true, score: 'Deviasi < 1 mm' },
      { item: 'Kemiringan Atap & Kerapian Genteng Metal Berpasir', passed: true, score: 'Bebas Kebocoran Tampias' },
      { item: 'Instalasi Pipa Air PDAM & Kelistrikan Grounding', passed: true, score: 'Tekanan Pipa 2 Bar, Grounding < 1 Ohm' }
    ]
  },
  waktu: {
    targetCompletionDate: '15 November 2026',
    plannedDaysRemaining: 34,
    scheduleVarianceDays: 3, // +3 days ahead of schedule
    status: 'AHEAD_OF_SCHEDULE',
    notes: 'Pelaksanaan 3 hari lebih cepat dari jadwal SPK berkat modul pracetak RISHAM yang presisi.'
  }
};

export const MOCK_WARRANTY_CLAIMS = [
  {
    id: 'war-001',
    unitId: 'UNT-GLB-A12',
    title: 'Rembes Halus Talang Sudut Kanopi Depan',
    category: 'Atap & Saluran Air',
    description: 'Saat hujan lebat semalam ada tetesan halus di ujung sambungan talang teras depan.',
    submittedDate: '10 Oktober 2026',
    slaDeadline: '12 Oktober 2026 (SLA 2x24 Jam)',
    status: 'IN_PROGRESS', // 'SUBMITTED' | 'IN_PROGRESS' | 'RESOLVED'
    developerResponse: 'Tim teknisi PT. Katama sudah dijadwalkan datang hari ini pukul 14:00 WIB untuk seal ulang silikon sealant tahan air.',
    resolvedAt: null
  },
  {
    id: 'war-002',
    unitId: 'UNT-GLB-A12',
    title: 'Penyetelan Engsel Pintu Kamar Utama',
    category: 'Kusen & Pintu',
    description: 'Pintu kamar sedikit berdecit ketika ditutup rapat.',
    submittedDate: '28 September 2026',
    slaDeadline: '30 September 2026',
    status: 'RESOLVED',
    developerResponse: 'Engsel telah disetel ulang dan dilumasi pelumas khusus tahan karat oleh teknisi lapangan.',
    resolvedAt: '29 September 2026'
  }
];

// ────────── V2.0 ADDITIONS: DATABASE PEMERINTAH (PROGRAM 3 JUTA RUMAH) ──────────
export const GOVERNMENT_REPORTS_DATA = {
  nationalProgram: 'Program Strategis Nasional 3 Juta Rumah Rakyat',
  ministry: 'Kementerian Perumahan dan Kawasan Permukiman (PKP) & PUPR RI',
  lastUpdated: '12 Oktober 2026',
  stats: {
    totalQuotaNational: 3000000,
    provincialQuotaBanten: 125000,
    realizedUnitsBanten: 84200,
    realizationPercent: 67.36,
    activeMbrDevelopers: 148,
    greenEcoUnitsPercent: 42.8,
    carbonReductionTons: 1840.5,
    flppSubsidiesDisbursedRp: 'Rp 14,2 Triliun'
  },
  permitSummary: [
    { province: 'Banten', pbgApproved: 412, pbgPending: 38, slfIssued: 295, amdalVerified: 412 },
    { province: 'Jawa Barat', pbgApproved: 890, pbgPending: 64, slfIssued: 670, amdalVerified: 890 },
    { province: 'Jawa Tengah', pbgApproved: 320, pbgPending: 25, slfIssued: 280, amdalVerified: 320 },
    { province: 'Jawa Timur', pbgApproved: 480, pbgPending: 31, slfIssued: 410, amdalVerified: 480 }
  ]
};

