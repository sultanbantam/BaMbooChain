/**
 * ceKKes (Cek Kesehatan) - Seed Data (Demo Environment)
 * Modul Informasi Biologis & Monitoring Terpadu (Manusia, Hewan, Tumbuhan)
 * Ekosistem BaMbooChain (bamboochain.id)
 * 
 * Standar & Kepatuhan:
 * - UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)
 * - Non-diagnostik klinis (Edukasi, pemantauan gaya hidup & budidaya terpadu)
 * - Data bertanda demo eksplisit (isDemo: true)
 */

export const INITIAL_KNOWLEDGE_BASE = [
  {
    id: 'kb-kemenkes-01',
    domain: 'human',
    title: 'Panduan Pengendalian Tekanan Darah & Pola Hidup Sehat CERDIK',
    publisher: 'Kementerian Kesehatan Republik Indonesia (Kemenkes RI)',
    year: '2023',
    category: 'Lifestyle & Wellness',
    summary: 'Rekomendasi konsumsi garam < 5g/hari (1 sdt), aktivitas fisik sedang 150 menit/minggu, manajemen stres, dan pemantauan tensi berkala bagi pra-hipertensi.',
    evidenceLevel: 'Tinggi (Pedoman Nasional)',
    url: 'https://kemkes.go.id'
  },
  {
    id: 'kb-who-02',
    domain: 'human',
    title: 'WHO Guidelines on Physical Activity and Sedentary Behaviour',
    publisher: 'World Health Organization (WHO)',
    year: '2022',
    category: 'Physical Activity',
    summary: 'Aktivitas fisik aerobik teratur meningkatkan kapasitas kardiorespirasi dan metabolisme glukosa serta mengurangi risiko penyakit tidak menular.',
    evidenceLevel: 'Tinggi (Konsensus Global)',
    url: 'https://who.int'
  },
  {
    id: 'kb-pdhi-01',
    domain: 'animal',
    title: 'Protokol Vaksinasi Inti & Pencegahan Parasit Hewan Domestik',
    publisher: 'Perhimpunan Dokter Hewan Indonesia (PDHI)',
    year: '2023',
    category: 'Veterinary Preventive Care',
    summary: 'Vaksinasi rabies berkala tahunan, vaksinasi FVRCP pada kucing, pemberian obat cacing rutin tiap 3-6 bulan, dan pengawasan hidrasi serta perubahan nafsu makan.',
    evidenceLevel: 'Tinggi (Standar Asosiasi Profesi)',
    url: 'https://pdhi.or.id'
  },
  {
    id: 'kb-brin-bambu-01',
    domain: 'plant',
    title: 'Silvikultur & Manajemen Hara Bambu Petung (Dendrocalamus asper)',
    publisher: 'Pusat Riset Konservasi Tumbuhan & Balai Silvikultur Tropis (BRIN)',
    year: '2024',
    category: 'Silviculture & Plant Nutrition',
    summary: 'Bambu Petung memerlukan drainase tanah yang baik, kebutuhan N-P-K berimbang terutama fosfat organik (seperti guano fosfat terdekomposisi) untuk pemacuan rebung awal musim hujan.',
    evidenceLevel: 'Tinggi (Riset Botani Tropis Terpublikasi)',
    url: 'https://brin.go.id'
  },
  {
    id: 'kb-deptan-padi-02',
    domain: 'plant',
    title: 'Manajemen Terpadu Budidaya Padi Organik Lahan Kering (Huma)',
    publisher: 'Badan Litbang Pertanian (Kementan RI)',
    year: '2023',
    category: 'Agronomy',
    summary: 'Padi huma terasering membutuhkan mulsa organik untuk mempertahankan kelembaban mikro tanah dan rotasi pemupukan nitrogen organik cair ramah lingkungan.',
    evidenceLevel: 'Sedang-Tinggi (Uji Lapangan Litbang)',
    url: 'https://pertanian.go.id'
  }
];

export const INITIAL_SUBJECTS = [
  {
    id: 'sub-hum-01',
    domain: 'human',
    isDemo: true,
    fullName: 'Budi Santoso',
    preferredName: 'Budi',
    ageGroup: 'Dewasa (34 Tahun)',
    birthYear: '1992',
    gender: 'Laki-laki',
    bloodType: 'O+',
    status: 'Data Terbaru Tersedia',
    riskLevel: 'Rendah (Pola Hidup Sehat)',
    registeredAt: '2026-10-15T08:30:00Z',
    updatedAt: '2026-11-08T10:15:00Z',
    ownerId: 'usr-demo-01',
    consentGranted: {
      healthDataProcessing: true,
      aiEducationalInsights: true,
      biometricEnrollment: false, // Default NON-biometrik
      lastUpdated: '2026-10-15T08:30:00Z'
    },
    physicalSummary: {
      heightCm: 172,
      weightKg: 68,
      bmi: 23.0, // Normal
      bmiCategory: 'Ideal',
      latestBloodPressure: '118/78 mmHg',
      restingHeartRate: '72 bpm',
      knownAllergies: ['Seafood (Udang tingkat ringan)'],
      currentSupplements: ['Vitamin D3 1000 IU', 'Teh Daun Bambu Sabumi'],
      chronicConditions: []
    },
    emergencyContact: {
      name: 'Rina Marlina (Istri)',
      relationship: 'Keluarga Inti',
      phone: '+62 812-3456-7890'
    },
    notes: 'Rutin jogging pagi di area konservasi bambu. Tidak ada keluhan kardiovaskular akut.'
  },
  {
    id: 'sub-hum-02',
    domain: 'human',
    isDemo: true,
    fullName: 'Siti Aminah',
    preferredName: 'Ibu Siti',
    ageGroup: 'Lansia (58 Tahun)',
    birthYear: '1968',
    gender: 'Perempuan',
    bloodType: 'B+',
    status: 'Perlu Tindak Lanjut',
    riskLevel: 'Sedang (Pemantauan Tensi Berkala)',
    registeredAt: '2026-09-20T14:00:00Z',
    updatedAt: '2026-11-07T16:45:00Z',
    ownerId: 'usr-demo-01',
    consentGranted: {
      healthDataProcessing: true,
      aiEducationalInsights: true,
      biometricEnrollment: false,
      lastUpdated: '2026-09-20T14:00:00Z'
    },
    physicalSummary: {
      heightCm: 156,
      weightKg: 64,
      bmi: 26.3, // Overweight ringan
      bmiCategory: 'Pra-Obesitas',
      latestBloodPressure: '136/88 mmHg',
      restingHeartRate: '78 bpm',
      knownAllergies: ['Tidak ada alergi obat/makanan terlapor'],
      currentSupplements: ['Kalsium & Vitamin D', 'Jamu Tradisional Kunyit Asam'],
      chronicConditions: ['Riwayat Pra-Hipertensi keluarga']
    },
    emergencyContact: {
      name: 'Ahmad Fauzi (Anak)',
      relationship: 'Keluarga Inti',
      phone: '+62 813-9876-5432'
    },
    notes: 'Perlu pengawasan asupan garam harian dan jalan santai 30 menit setiap sore.'
  },
  {
    id: 'sub-ani-01',
    domain: 'animal',
    isDemo: true,
    name: 'Miko',
    species: 'Kucing Domestik (Felis catus)',
    breed: 'Domestic Short Hair (Campuran)',
    ageDescription: '2 Tahun 6 Bulan',
    estimatedBirth: 'Mei 2024',
    gender: 'Jantan (Telah Disteril)',
    weightKg: 4.3,
    status: 'Data Terbaru Tersedia',
    riskLevel: 'Normal / Prima',
    registeredAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-11-06T11:20:00Z',
    ownerId: 'usr-demo-01',
    identificationTag: {
      type: 'Microchip ISO 11784/11785',
      code: 'ID-MC-982-12093-ID',
      collarColor: 'Hijau Toska Sabumi'
    },
    careProfile: {
      dietType: 'Pakan Kering Protein Tinggi + Basah Ayam Kukus',
      feedingSchedule: '2x Sehari (Pagi 07:00, Sore 17:30)',
      vaccinationStatus: 'Lengkap (Rabies & FVRCP Booster aktif hingga Feb 2027)',
      dewormingDate: '2026-09-15',
      veterinarianName: 'drh. Hendra Wijaya (Klinik Satwa Sejahtera)',
      allergiesOrSensitivities: ['Sensitif terhadap susu sapi']
    },
    notes: 'Kucing aktif pemburu tikus gudang bambu. Kondisi bulu lebat dan mata bersih.'
  },
  {
    id: 'sub-ani-02',
    domain: 'animal',
    isDemo: true,
    name: 'Bima (Kambing Pejantan)',
    species: 'Kambing Perah (Capra aegagrus hircus)',
    breed: 'Peranakan Ettawa (PE) Super',
    ageDescription: '3 Tahun',
    estimatedBirth: 'November 2023',
    gender: 'Jantan',
    weightKg: 52.0,
    status: 'Data Terbaru Tersedia',
    riskLevel: 'Normal / Produktif',
    registeredAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-11-05T08:00:00Z',
    ownerId: 'usr-demo-01',
    identificationTag: {
      type: 'Visual Ear-Tag RFID',
      code: 'TAG-CIB-2024-008',
      collarColor: 'Kuning Identifikasi Warga'
    },
    careProfile: {
      dietType: 'Silase Daun Bambu Fermentasi, Rumput Odot & Konsentrat Dedak',
      feedingSchedule: '3x Sehari + Garam Jilat Mineral',
      vaccinationStatus: 'Vaksin PMK & Obat Cacing Teratur',
      dewormingDate: '2026-10-01',
      veterinarianName: 'Puskeswan Wilayah Lebak / Cibarani',
      allergiesOrSensitivities: []
    },
    notes: 'Pejantan unggul program peternakan sirkular terpadu Cibarani Guano & Silase Bambu.'
  },
  {
    id: 'sub-pla-01',
    domain: 'plant',
    isDemo: true,
    name: 'Rumpun Bambu Petung A-3',
    scientificName: 'Dendrocalamus asper (Schult.f.) Backer',
    variety: 'Petung Hitam Banten',
    growthPhase: 'Vegetatif Dewasa (Rumpun Produktif)',
    plantingDate: '2023-01-12',
    approximateAge: '3 Tahun 10 Bulan',
    location: 'Plot Konservasi Sabumi Blok Cibarani Hulu (Koor: -6.7821, 106.1823)',
    status: 'Data Terbaru Tersedia',
    riskLevel: 'Sangat Subur / Optimal',
    registeredAt: '2026-06-15T08:00:00Z',
    updatedAt: '2026-11-08T09:30:00Z',
    ownerId: 'usr-demo-01',
    cultivationDetails: {
      substrate: 'Tanah Vulkanik Liat Berpasir dengan Drainase Alami',
      sunlightNeed: 'Matahari Penuh (> 6 jam/hari)',
      irrigationNeed: 'Alami Curah Hujan & Irigasi Parit Lereng Bambu',
      nutritionProgram: 'Cibarani Guano Organik (Fosfat Alami) 2 kg / Rumpun tiap 3 bulan',
      pestResistance: 'Tahan Penggerek Rebung, sanitasi serasah terjaga',
      culmCount: 28 // Jumlah batang dalam rumpun
    },
    notes: 'Rumpun induk untuk bibit stek cabang dan penyerap limpasan erosi lereng tebing.'
  },
  {
    id: 'sub-pla-02',
    domain: 'plant',
    isDemo: true,
    name: 'Padi Huma Cibarani Petak 04',
    scientificName: 'Oryza sativa L.',
    variety: 'Beras Merah Lokal Wangi Cibarani',
    growthPhase: 'Generatif (Pengisian Bulir / Antesis)',
    plantingDate: '2026-08-15',
    approximateAge: '85 Hari Setelah Tanam (HST)',
    location: 'Terasering Lereng Bukit Cibarani Zona 2',
    status: 'Perlu Tindak Lanjut',
    riskLevel: 'Waspada (Sedikit Gejala Kekurangan Kalium & Hama Walang Sangit)',
    registeredAt: '2026-08-20T07:30:00Z',
    updatedAt: '2026-11-07T14:10:00Z',
    ownerId: 'usr-demo-01',
    cultivationDetails: {
      substrate: 'Tanah Huma Humus Alami tanpa Olah Tanah Berlebihan',
      sunlightNeed: 'Penuh Terbuka',
      irrigationNeed: 'Bergantung curah hujan mikro & kabut lereng',
      nutritionProgram: 'Bokashi serasah bambu + pupuk organik cair urine kelinci',
      pestResistance: 'Dipasang perangkap feromon alami dan asap sekam',
      culmCount: 18
    },
    notes: 'Pengamatan daun bawah menunjukkan ujung menguning kering tipikal defisiensi K organik.'
  }
];

export const INITIAL_OBSERVATIONS = [
  {
    id: 'obs-001',
    subjectId: 'sub-hum-01',
    domain: 'human',
    timestamp: '2026-11-08T07:15:00Z',
    type: 'Vital Signs & Kebugaran',
    metric: 'Tekanan Darah & Denyut Nadi',
    value: '118/78 mmHg, 72 bpm',
    recorder: 'Pengguna Mandiri (Budi)',
    device: 'Tensimeter Digital Omron HEM-7120 Terkalibrasi',
    dataQuality: 'Terverifikasi Mandiri',
    notes: 'Diukur setelah istirahat 10 menit bangun pagi. Kondisi tubuh segar.'
  },
  {
    id: 'obs-002',
    subjectId: 'sub-hum-02',
    domain: 'human',
    timestamp: '2026-11-07T16:00:00Z',
    type: 'Vital Signs & Kebugaran',
    metric: 'Tekanan Darah',
    value: '136/88 mmHg, 78 bpm',
    recorder: 'Caregiver / Keluarga (Ahmad)',
    device: 'Tensimeter Digital Lengan Atas',
    dataQuality: 'Terverifikasi Mandiri',
    notes: 'Sedikit naik setelah seharian menghadiri acara keluarga. Dianjurkan minum air putih cukup dan tidur lebih awal.'
  },
  {
    id: 'obs-003',
    subjectId: 'sub-ani-01',
    domain: 'animal',
    timestamp: '2026-11-06T10:30:00Z',
    type: 'Pemeriksaan Fisik & Berat Badan',
    metric: 'Berat Badan & Vitalitas',
    value: '4.3 kg (Stabil)',
    recorder: 'Pemilik (Budi)',
    device: 'Timbangan Digital Satwa PetScale',
    dataQuality: 'Terverifikasi Mandiri',
    notes: 'Nafsu makan sangat baik, lincah, suhu tubuh normal (perabaan telinga hangat normal).'
  },
  {
    id: 'obs-004',
    subjectId: 'sub-ani-02',
    domain: 'animal',
    timestamp: '2026-11-05T07:30:00Z',
    type: 'Produktivitas & Kesehatan Pakan',
    metric: 'Konsumsi Silase & Suhu Rektal',
    value: 'Habis 3.5 kg silase, 38.6°C',
    recorder: 'Peternak Kelompok Sabumi',
    device: 'Termometer Hewan Digital',
    dataQuality: 'Terverifikasi Lapangan',
    notes: 'Kotoran padat normal, tidak ada tanda kembung atau lesu.'
  },
  {
    id: 'obs-005',
    subjectId: 'sub-pla-01',
    domain: 'plant',
    timestamp: '2026-11-08T09:00:00Z',
    type: 'Fenotipe & Pertumbuhan Rebung',
    metric: 'Kemunculan Rebung Baru',
    value: '3 Rebung Sehat (Tinggi ~45 cm)',
    recorder: 'Agronomis Lapangan Sabumi',
    device: 'Meteran Ukur Lapangan & Kamera Makro',
    dataQuality: 'Terverifikasi Lapangan',
    notes: 'Rebung tumbuh kokoh, kelopak berbulu cokelat pekat khas Petung Banten yang sehat.'
  },
  {
    id: 'obs-006',
    subjectId: 'sub-pla-02',
    domain: 'plant',
    timestamp: '2026-11-07T13:45:00Z',
    type: 'Kesehatan Daun & Malai Padi',
    metric: 'Inspeksi Visual Hama/Penyakit',
    value: 'Klorosis ujung daun bawah (~15% rumpun)',
    recorder: 'Petani Huma Cibarani',
    device: 'Inspeksi Visual Visual Lensa Lapangan',
    dataQuality: 'Perlu Validasi Lanjutan',
    notes: 'Tanda defisiensi kalium ringan. Disarankan aplikasi abu serasah bambu kaya kalium organik.'
  }
];

export const INITIAL_CARE_PLANS = [
  {
    id: 'care-001',
    subjectId: 'sub-hum-02',
    subjectName: 'Siti Aminah',
    domain: 'human',
    title: 'Pemeriksaan Tensi Berkala Sore & Jalan Santai',
    frequency: 'Harian (Pukul 16:30)',
    dueDate: '2026-11-09T16:30:00Z',
    category: 'Monitoring Gaya Hidup',
    isCompleted: false,
    notes: 'Jalan santai di taman desa 25 menit lalu istirahat 15 menit sebelum tensi.'
  },
  {
    id: 'care-002',
    subjectId: 'sub-ani-01',
    subjectName: 'Miko',
    domain: 'animal',
    title: 'Pemberian Obat Cacing Rutin Kuartal IV',
    frequency: 'Tiap 3 Bulan',
    dueDate: '2026-12-15T09:00:00Z',
    category: 'Pencegahan Parasit',
    isCompleted: false,
    notes: 'Dosis disesuaikan berat badan (4.3 kg) sesuai anjuran drh. Hendra.'
  },
  {
    id: 'care-003',
    subjectId: 'sub-pla-01',
    subjectName: 'Rumpun Bambu Petung A-3',
    domain: 'plant',
    title: 'Aplikasi Top-Dressing Cibarani Guano Organik',
    frequency: 'Tiap 3 Bulan (Awal Musim Hujan)',
    dueDate: '2026-11-15T08:00:00Z',
    category: 'Nutrisi Tanaman',
    isCompleted: false,
    notes: 'Tabur 2 kg pupuk guano terdekomposisi melingkar 1 meter dari pusat rumpun bambu.'
  },
  {
    id: 'care-004',
    subjectId: 'sub-pla-02',
    subjectName: 'Padi Huma Cibarani Petak 04',
    domain: 'plant',
    title: 'Penyemprotan Pestisida Nabati Asap Serasah Bambu',
    frequency: 'Mingguan (Pukul 06:30)',
    dueDate: '2026-11-10T06:30:00Z',
    category: 'Proteksi Tanaman Alami',
    isCompleted: false,
    notes: 'Mencegah serangan walang sangit pada fase pengisian bulir padi huma.'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'audit-001',
    timestamp: '2026-10-15T08:30:00Z',
    actor: 'User: Budi Santoso',
    action: 'CONSENT_GRANTED',
    domain: 'human',
    details: 'Pemberian persetujuan pemrosesan data kesehatan gaya hidup (Non-Biometrik) sesuai UU PDP No. 27/2022.'
  },
  {
    id: 'audit-002',
    timestamp: '2026-11-08T09:35:00Z',
    actor: 'AI Agent: Plant Health Specialist',
    action: 'AI_ASSESSMENT_RUN',
    domain: 'plant',
    details: 'Analisis nutrisi tanah dan pemeliharaan rumpun Bambu Petung A-3. Tingkat keyakinan: 94%. Sumber: BRIN Silvikultur.'
  },
  {
    id: 'audit-003',
    timestamp: '2026-11-08T10:15:00Z',
    actor: 'User: Budi Santoso',
    action: 'OBSERVATION_RECORDED',
    domain: 'human',
    details: 'Pencatatan mandiri tekanan darah 118/78 mmHg via tensimeter Omron.'
  }
];
