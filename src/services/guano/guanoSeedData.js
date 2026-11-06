/**
 * CIBARANI GUANO — SEED DATA, RBAC ROLES & ASSUMPTION PARAMETERS
 * Seluruh data contoh diberi label eksplisit [DEMO] dan parameter finansial
 * diberi label [ASUMSI — BELUM DISEPAKATI] sesuai spesifikasi guano.md.
 */

export const GUANO_ORGANIZATIONS = [
  {
    org_id: 'ORG-ASPAI',
    code: 'ASPAI',
    name: 'ASPAI — Asosiasi Penggiat Anggur Indonesia (Demo Organization)',
    is_demo: true,
    type: 'ASSOCIATION_TECHNICAL_MARKET',
    role_summary: 'Pengembangan produk & formulasi, proses pengolahan, kendali mutu, jaringan petani anggur & hortikultura, serta distribusi pasar.',
    region: 'Nasional & Banten'
  },
  {
    org_id: 'ORG-KASEPUHAN',
    code: 'KASEPUHAN',
    name: 'Kasepuhan Cibarani — Demo Organization',
    is_demo: true,
    type: 'CUSTOMARY_COMMUNITY',
    role_summary: 'Persetujuan & tata kelola adat, pengawasan sumber daya & zona larangan, partisipasi masyarakat, serta monitoring konservasi.',
    region: 'Kec. Sobang, Kab. Lebak, Banten'
  },
  {
    org_id: 'ORG-YSNJ',
    code: 'YSNJ',
    name: 'Yayasan Sabumi Nusantara Jaya — Demo Organization',
    is_demo: true,
    type: 'FOUNDATION_CONSERVATION',
    role_summary: 'Pendampingan konservasi & pemberdayaan masyarakat, koordinasi tata kelola, monitoring dampak sosial-lingkungan & digitalisasi BaMbooChain.',
    region: 'Banten & Nusantara'
  },
  {
    org_id: 'ORG-BUP',
    code: 'BUP',
    name: 'Badan Usaha Pelaksana (Koperasi Produsen / BUP — Belum Ditetapkan) [DEMO]',
    is_demo: true,
    type: 'COMMERCIAL_OPERATOR',
    role_summary: 'Pelaksana transaksi komersial, produksi, pembelian, penjualan, rekening, pembukuan, pajak, dan pelaporan usaha setelah disahkan.',
    region: 'Kab. Lebak, Banten'
  }
];

export const GUANO_ROLES = [
  {
    role_id: 'SUPER_ADMIN',
    label: 'Super Admin BaMbooChain',
    org_id: 'ORG-YSNJ',
    description: 'Konfigurasi platform dan akses lintas organisasi sesuai kebijakan.',
    allowed_tabs: ['DASHBOARD', 'RESOURCES', 'CONSERVATION', 'HARVEST', 'INVENTORY', 'PRODUCTION', 'QUALITY', 'CATALOG', 'ORDERS', 'TRACEABILITY', 'LEDGER', 'BENEFIT_SHARING', 'IMPACT', 'REPORTS', 'SETTINGS'],
    permissions: ['VIEW_ALL', 'CREATE_ALL', 'APPROVE_CUSTOMARY', 'APPROVE_HARVEST', 'VERIFY_HARVEST', 'MANAGE_INVENTORY', 'MANAGE_PRODUCTION', 'APPROVE_QUALITY', 'MANAGE_CATALOG', 'MANAGE_ORDERS', 'MANAGE_LEDGER', 'APPROVE_LEDGER', 'CONFIGURE_BENEFIT', 'EXPORT_REPORTS', 'MANAGE_RBAC']
  },
  {
    role_id: 'PROJECT_ADMIN',
    label: 'Project Admin',
    org_id: 'ORG-BUP',
    description: 'Mengelola modul dan seluruh data operasional proyek Cibarani Guano.',
    allowed_tabs: ['DASHBOARD', 'RESOURCES', 'CONSERVATION', 'HARVEST', 'INVENTORY', 'PRODUCTION', 'QUALITY', 'CATALOG', 'ORDERS', 'TRACEABILITY', 'LEDGER', 'BENEFIT_SHARING', 'IMPACT', 'REPORTS', 'SETTINGS'],
    permissions: ['VIEW_ALL', 'CREATE_ALL', 'APPROVE_HARVEST', 'VERIFY_HARVEST', 'MANAGE_INVENTORY', 'MANAGE_PRODUCTION', 'MANAGE_CATALOG', 'MANAGE_ORDERS', 'MANAGE_LEDGER', 'CONFIGURE_BENEFIT', 'EXPORT_REPORTS']
  },
  {
    role_id: 'ASPAI_ADMIN',
    label: 'ASPAI Admin',
    org_id: 'ORG-ASPAI',
    description: 'Produk, formulasi, produksi, mutu, pasar, dan laporan terkait.',
    allowed_tabs: ['DASHBOARD', 'INVENTORY', 'PRODUCTION', 'QUALITY', 'CATALOG', 'ORDERS', 'TRACEABILITY', 'BENEFIT_SHARING', 'IMPACT', 'REPORTS'],
    permissions: ['MANAGE_PRODUCTION', 'APPROVE_QUALITY', 'MANAGE_CATALOG', 'MANAGE_ORDERS', 'EXPORT_REPORTS']
  },
  {
    role_id: 'KASEPUHAN_ADMIN',
    label: 'Kasepuhan Admin',
    org_id: 'ORG-KASEPUHAN',
    description: 'Data komunitas, persetujuan adat, pengawasan sumber daya, dan laporan manfaat.',
    allowed_tabs: ['DASHBOARD', 'RESOURCES', 'CONSERVATION', 'HARVEST', 'BENEFIT_SHARING', 'IMPACT', 'REPORTS'],
    permissions: ['APPROVE_CUSTOMARY', 'APPROVE_HARVEST', 'VERIFY_HARVEST', 'EXPORT_REPORTS']
  },
  {
    role_id: 'YSNJ_ADMIN',
    label: 'YSNJ Admin',
    org_id: 'ORG-YSNJ',
    description: 'Konservasi, program, monitoring dampak, tata kelola, dan laporan.',
    allowed_tabs: ['DASHBOARD', 'RESOURCES', 'CONSERVATION', 'HARVEST', 'TRACEABILITY', 'BENEFIT_SHARING', 'IMPACT', 'REPORTS'],
    permissions: ['CREATE_CONSERVATION', 'VERIFY_HARVEST', 'EXPORT_REPORTS']
  },
  {
    role_id: 'FIELD_OFFICER',
    label: 'Field Officer (Petugas Lapangan)',
    org_id: 'ORG-KASEPUHAN',
    description: 'Input survei, pengumpulan yang disetujui, dan monitoring lapangan.',
    allowed_tabs: ['DASHBOARD', 'RESOURCES', 'CONSERVATION', 'HARVEST', 'INVENTORY'],
    permissions: ['CREATE_CONSERVATION', 'REQUEST_HARVEST', 'RECORD_HARVEST']
  },
  {
    role_id: 'PRODUCTION_OFFICER',
    label: 'Production Officer',
    org_id: 'ORG-ASPAI',
    description: 'Penerimaan bahan, produksi, stok, dan batch.',
    allowed_tabs: ['DASHBOARD', 'INVENTORY', 'PRODUCTION', 'QUALITY', 'TRACEABILITY'],
    permissions: ['MANAGE_INVENTORY', 'MANAGE_PRODUCTION']
  },
  {
    role_id: 'QUALITY_OFFICER',
    label: 'Quality Officer (QC/Lab)',
    org_id: 'ORG-ASPAI',
    description: 'Input hasil uji laboratorium dan persetujuan status mutu.',
    allowed_tabs: ['DASHBOARD', 'PRODUCTION', 'QUALITY', 'CATALOG', 'TRACEABILITY', 'REPORTS'],
    permissions: ['APPROVE_QUALITY', 'EXPORT_REPORTS']
  },
  {
    role_id: 'FINANCE_OFFICER',
    label: 'Finance Officer',
    org_id: 'ORG-BUP',
    description: 'Pencatatan transaksi, biaya, rekonsiliasi, dan laporan keuangan.',
    allowed_tabs: ['DASHBOARD', 'ORDERS', 'LEDGER', 'BENEFIT_SHARING', 'REPORTS'],
    permissions: ['MANAGE_ORDERS', 'MANAGE_LEDGER', 'APPROVE_LEDGER', 'CONFIGURE_BENEFIT', 'EXPORT_REPORTS']
  },
  {
    role_id: 'INVESTOR_VIEWER',
    label: 'Investor / Partner Viewer',
    org_id: 'ORG-BUP',
    description: 'Melihat ringkasan dan laporan yang diizinkan.',
    allowed_tabs: ['DASHBOARD', 'CATALOG', 'TRACEABILITY', 'BENEFIT_SHARING', 'IMPACT', 'REPORTS'],
    permissions: ['EXPORT_REPORTS']
  },
  {
    role_id: 'CUSTOMER',
    label: 'Customer (Pelanggan / Petani)',
    org_id: 'ORG-ASPAI',
    description: 'Melihat produk, pesanan sendiri, dan informasi batch produk yang dibeli.',
    allowed_tabs: ['DASHBOARD', 'CATALOG', 'ORDERS', 'TRACEABILITY'],
    permissions: ['CREATE_ORDER']
  },
  {
    role_id: 'PUBLIC_VIEWER',
    label: 'Public Viewer (Masyarakat Umum)',
    org_id: 'ORG-YSNJ',
    description: 'Melihat informasi publik dan ketertelusuran produk yang tidak sensitif.',
    allowed_tabs: ['DASHBOARD', 'CATALOG', 'TRACEABILITY', 'IMPACT'],
    permissions: []
  }
];

export const INITIAL_ASSUMPTION_PARAMS = {
  scheme_id: 'SCHEME-DEMO-01',
  scheme_name: 'Skema Usulan Awal Diskusi Kolaborasi (ASUMSI — BELUM DISEPAKATI)',
  status_label: 'ASUMSI — BELUM DISEPAKATI',
  agreement_version: 'Draft v0.1 (Pra-Badan Usaha)',
  effective_date: 'Belum Ditetapkan',
  approval_status: 'PENDING_MULTI_PARTY_REVIEW',
  initial_investment_idr: 670000000,      // Rp670.000.000
  avg_selling_price_per_kg_idr: 15000,    // Rp15.000/kg
  variable_cost_per_kg_idr: 7000,         // Rp7.000/kg
  monthly_fixed_cost_idr: 20000000,       // Rp20.000.000
  target_monthly_sales_kg: 5000,          // 5.000 kg/bulan
  estimated_tax_and_reserve_pct: 5,       // 5% simulasi cadangan pajak & kewajiban usaha terpisah
  separate_investor_financing_idr: 0,     // Dicatat terpisah dari pembagian 50:30:20
  conservation_fund_pct: 10,              // Usulan 10% dari surplus operasional positif
  kasepuhan_allocation_pct: 50,           // Usulan 50%
  aspai_allocation_pct: 30,               // Usulan 30%
  ysnj_program_allocation_pct: 20,        // Usulan 20% (Alokasi Program YSNJ, BUKAN dividen)
  notes: 'PENTING: Seluruh angka merupakan parameter awal simulasi diskusi (ASUMSI — BELUM DISEPAKATI) dan bukan instruksi pembayaran otomatis. Alokasi 20% untuk YSNJ adalah Alokasi Program Konservasi & Pemberdayaan YSNJ, bukan dividen kepada Pembina/Pengurus/Pengawas.'
};

export const INITIAL_RESOURCE_SITES = [
  {
    resource_id: 'RES-CBR-001',
    resource_code: 'CBR-KARST-01',
    resource_name: '[DEMO] Situs Karst Wilayah Adat Cibarani — Blok Utama',
    is_demo: true,
    general_region: 'Wilayah Adat Kasepuhan Cibarani, Kec. Sobang, Kab. Lebak, Provinsi Banten',
    description: 'Lokasi potensial deposit guano kelelawar di wilayah ulayat Kasepuhan Cibarani. Koordinat spesifik gua dirahasiakan untuk perlindungan ekosistem kelelawar.',
    survey_status: 'Belum Disurvei',
    legal_status: 'Dalam Kajian Kewenangan & Tata Kelola',
    customary_approval_status: 'Menunggu Musyawarah Adat',
    conservation_status: 'Normal',
    estimated_guano_volume: null, // Wajib null / Belum Disurvei sesuai Bagian 12 & 15
    volume_unit: 'kg',
    sustainable_harvest_limit: null, // Belum ditetapkan secara ekologis
    data_confidentiality: 'CONFIDENTIAL_NO_PUBLIC_COORDS',
    expert_notes: 'Volume aktual dan batas panen lestari belum disurvei. Dilarang menetapkan kuota otomatis sebelum survei ekologi resmi.',
    attachments: ['BA-Pra-Identifikasi-Cibarani-DEMO.pdf'],
    created_by: 'YSNJ Admin (DEMO)',
    created_at: '2026-11-01T08:00:00+07:00',
    updated_at: '2026-11-05T10:00:00+07:00'
  },
  {
    resource_id: 'RES-CBR-DEMO-02',
    resource_code: 'CBR-SIM-DEMO',
    resource_name: '[DEMO] Zona Simulasi Alur Terkontrol (Khusus Uji Sistem)',
    is_demo: true,
    general_region: 'Zona Penyangga Kasepuhan Cibarani, Kab. Lebak, Provinsi Banten',
    description: 'Data sumber daya khusus mode DEMO untuk mendemonstrasikan alur persetujuan adat, pengumpulan terkontrol, batch produksi, dan QR Traceability.',
    survey_status: 'Survei Awal Selesai (DEMO)',
    legal_status: 'Simulasi Internal (DEMO)',
    customary_approval_status: 'Disetujui Terbatas (DEMO)',
    conservation_status: 'Normal',
    estimated_guano_volume: null, // Tetap null agar tidak mengklaim volume aktual
    volume_unit: 'kg',
    sustainable_harvest_limit: 500, // Kuota simulasi 500 kg untuk pengujian validasi batas panen
    data_confidentiality: 'CONFIDENTIAL_NO_PUBLIC_COORDS',
    expert_notes: 'Digunakan semata-mata untuk pengujian integrasi alur hulu-hilir di aplikasi.',
    attachments: ['SOP-Simulasi-Panen-Lestari-DEMO.pdf'],
    created_by: 'Kasepuhan Admin (DEMO)',
    created_at: '2026-11-02T09:00:00+07:00',
    updated_at: '2026-11-05T11:00:00+07:00'
  }
];

export const INITIAL_CONSERVATION_LOGS = [
  {
    monitoring_id: 'MON-DEMO-001',
    resource_id: 'RES-CBR-001',
    resource_name: '[DEMO] Situs Karst Wilayah Adat Cibarani — Blok Utama',
    is_demo: true,
    monitoring_date: '2026-11-03',
    observer: 'Tim Konservasi YSNJ & Jagabaya Kasepuhan (DEMO)',
    habitat_condition: 'Kondisi mulut kawasan karst alami, vegetasi penyangga bambu dan pohon hutan rapat.',
    bat_activity_observation: 'Observasi luar gua saat senja tanpa memasuki ruang koloni utama; aktivitas keluar-masuk koloni terpantau tenang.',
    disturbance_level: 'Rendah (Tidak ada aktivitas pengambilan)',
    water_or_environment_notes: 'Aliran air permukaan di sekitar lembah jernih; kelembaban mikro-habitat terjaga.',
    status: 'Normal', // 'Normal' | 'Perlu Perhatian' | 'Risiko Tinggi' | 'Kegiatan Dihentikan'
    findings: 'Belum dilakukan pengukuran populasi maupun volume deposit guano.',
    recommendation: 'Lakukan survei ekologi bersama ahli speleologi/biologi sebelum membuka izin pengumpulan.',
    follow_up_status: 'Menunggu Jadwal Survei Ahli',
    attachments: ['Log-Observasi-Senja-DEMO.pdf'],
    created_at: '2026-11-03T18:45:00+07:00'
  },
  {
    monitoring_id: 'MON-DEMO-002',
    resource_id: 'RES-CBR-DEMO-02',
    resource_name: '[DEMO] Zona Simulasi Alur Terkontrol (Khusus Uji Sistem)',
    is_demo: true,
    monitoring_date: '2026-11-04',
    observer: 'Petugas Konservasi Lapangan (DEMO)',
    habitat_condition: 'Lantai deposit kering pada zona luar yang diizinkan untuk simulasi.',
    bat_activity_observation: 'Pengamatan dilakukan di luar jam istirahat peka koloni sesuai protokol non-intrusif.',
    disturbance_level: 'Terkendali',
    water_or_environment_notes: 'Suhu dan sirkulasi udara normal.',
    status: 'Normal',
    findings: 'Aman untuk simulasi pengambilan sampel uji laboratorium.',
    recommendation: 'Wajib mematuhi batas maksimum kuota simulasi dan tidak menggunakan lampu sorot tajam.',
    follow_up_status: 'Dipantau Berkala',
    attachments: ['Dok-Monitoring-Simulasi-DEMO.pdf'],
    created_at: '2026-11-04T10:15:00+07:00'
  }
];

export const INITIAL_HARVEST_RECORDS = [
  {
    harvest_id: 'HRV-DEMO-001',
    resource_id: 'RES-CBR-DEMO-02',
    resource_name: '[DEMO] Zona Simulasi Alur Terkontrol (Khusus Uji Sistem)',
    is_demo: true,
    requested_by: 'Field Officer Kasepuhan (DEMO)',
    approved_by: 'Kasepuhan Admin (DEMO)',
    verified_by: 'YSNJ Admin (DEMO)',
    planned_date: '2026-11-04',
    actual_date: '2026-11-04',
    approved_quota_kg: 300,
    actual_weight_kg: 250,
    collection_method: 'Pengambilan manual permukaan luar tanpa alat berat & di luar jam peka koloni (DEMO)',
    condition_notes: 'Bahan baku guano kering alami, kadar kotoran batu kerikil rendah.',
    raw_batch_code: 'RMB-CBR-202611-01-DEMO',
    status: 'VERIFIED', // 'REQUESTED' | 'APPROVED' | 'COLLECTED' | 'VERIFIED' | 'REJECTED'
    worker_count: 6,
    worker_hours: 24,
    created_at: '2026-11-04T14:30:00+07:00'
  }
];

export const INITIAL_RAW_MATERIAL_BATCHES = [
  {
    raw_batch_id: 'RMB-DEMO-001',
    raw_batch_code: 'RMB-CBR-202611-01-DEMO',
    is_demo: true,
    harvest_id: 'HRV-DEMO-001',
    resource_id: 'RES-CBR-DEMO-02',
    source_name: '[DEMO] Zona Simulasi Alur Terkontrol — Kasepuhan Cibarani',
    received_date: '2026-11-04',
    initial_weight_kg: 250,
    available_stock_kg: 50, // 200 kg telah dipakai pada batch produksi DEMO
    unit: 'kg',
    initial_inspection_status: 'Lulus Pemeriksaan Fisik Awal (DEMO)',
    storage_location: 'Gudang Bahan Baku Cibarani — Rak A1 (DEMO)',
    created_at: '2026-11-04T16:00:00+07:00'
  }
];

export const INITIAL_INVENTORY_TRANSACTIONS = [
  {
    mutation_id: 'MUT-DEMO-001',
    raw_batch_code: 'RMB-CBR-202611-01-DEMO',
    is_demo: true,
    type: 'INBOUND_HARVEST',
    quantity_kg: 250,
    balance_after_kg: 250,
    reason: '[DEMO] Penerimaan bahan baku dari pengumpulan terverifikasi HRV-DEMO-001',
    actor: 'Production Officer (DEMO)',
    timestamp: '2026-11-04T16:00:00+07:00'
  },
  {
    mutation_id: 'MUT-DEMO-002',
    raw_batch_code: 'RMB-CBR-202611-01-DEMO',
    is_demo: true,
    type: 'OUTBOUND_PRODUCTION',
    quantity_kg: -200,
    balance_after_kg: 50,
    reason: '[DEMO] Pemakaian untuk Batch Produksi PB-CBR-202611-01-DEMO',
    actor: 'Production Officer (DEMO)',
    timestamp: '2026-11-05T08:30:00+07:00'
  }
];

export const INITIAL_PRODUCTION_BATCHES = [
  {
    prod_batch_id: 'PB-DEMO-001',
    prod_batch_code: 'PB-CBR-202611-01-DEMO',
    is_demo: true,
    product_code: 'CG-POWDER-01',
    product_name: 'Cibarani Guano Powder [DEMO]',
    raw_batch_code: 'RMB-CBR-202611-01-DEMO',
    formula_version: 'Formula ASPAI-v1.0 (DEMO — Pengeringan & Pengayakan Mesh 60)',
    additional_materials: 'Tidak ada bahan kimia sintetis (100% Guano Alami Terayak — DEMO)',
    production_date: '2026-11-05',
    pic_name: 'Tim Produksi ASPAI & Kasepuhan (DEMO)',
    input_weight_kg: 200,
    output_weight_kg: 180,
    process_loss_kg: 20, // Susut kadar air & pemisahan kerikil 10%
    drying_sieving_notes: 'Pengeringan rumah surya tertutup hingga kadar air stabil, pengayakan mesh 60.',
    granulation_notes: 'Bentuk serbuk halus (Powder), tanpa granulasi.',
    packaging_spec: 'Kemasan Pouch Aluminium Foil/Karung Lapis Dalam @ 5 kg (36 kemasan)',
    status: 'Approved', // 'Draft' | 'Planned' | 'In Progress' | 'Pending Quality Check' | 'Approved' | 'Rejected' | 'Archived'
    qa_status: 'PASSED_DEMO',
    ready_for_sale: true,
    trace_token: 'CG-TRC-9F4A2C8E1B7D',
    sop_document: 'SOP-Produksi-ASPAI-Guano-v1-DEMO.pdf',
    created_at: '2026-11-05T15:00:00+07:00'
  }
];

export const INITIAL_QUALITY_TESTS = [
  {
    test_id: 'QA-DEMO-001',
    prod_batch_code: 'PB-CBR-202611-01-DEMO',
    is_demo: true,
    lab_name: 'Laboratorium Uji Tanah & Pupuk Terakreditasi (CONTOH DATA DEMO)',
    certificate_number: 'CERT-LAB-DEMO-2026-001',
    test_date: '2026-11-05',
    quality_officer: 'Quality Officer ASPAI (DEMO)',
    status: 'Lulus Uji (DEMO)', // 'Lulus Uji (DEMO)' | 'Tidak Lulus' | 'Perlu Pengujian Ulang'
    parameters: [
      { name: 'Kadar Air', value: '11.4', unit: '%', spec_limit: 'Maks. 15% (Konfigurasi Uji)', pass: true },
      { name: 'pH H2O', value: '6.8', unit: 'pH', spec_limit: '5.5 – 7.5 (Konfigurasi Uji)', pass: true },
      { name: 'C-Organik', value: '18.2', unit: '%', spec_limit: 'Min. 15% (Konfigurasi Uji)', pass: true },
      { name: 'P2O5 Total (Fosfat Alami)', value: '12.6', unit: '%', spec_limit: 'Sesuai Spesifikasi Batch', pass: true },
      { name: 'Logam Berat (Pb / Cd / Hg)', value: 'Di Bawah Ambang Deteksi', unit: 'ppm', spec_limit: 'Sesuai Baku Mutu Regulasi', pass: true },
      { name: 'Mikrobiologi Patogen (E. coli / Salmonella)', value: 'Negatif', unit: 'CFU/g', spec_limit: 'Negatif / Sesuai Regulasi', pass: true }
    ],
    notes: 'DATA DEMO: Nilai di atas adalah contoh struktur parameter uji laboratorium untuk simulasi sistem. Hasil uji aktual wajib diinput dari sertifikat laboratorium resmi.',
    attachment: 'Sertifikat-Uji-Lab-PB-CBR-202611-01-DEMO.pdf',
    created_at: '2026-11-05T17:00:00+07:00'
  }
];

export const INITIAL_PRODUCTS = [
  {
    product_id: 'PROD-CG-01',
    product_code: 'CG-POWDER-01',
    name: 'Cibarani Guano Powder',
    is_demo: true,
    category: 'Biofertilizer Organik Serbuk',
    description: 'Pupuk organik serbuk halus berbasis guano Cibarani yang telah melalui proses pengeringan terkontrol, pengayakan, dan verifikasi mutu per batch.',
    composition_summary: '100% Guano terproses sesuai hasil uji laboratorium pada masing-masing nomor batch (tanpa klaim sepihak di luar sertifikat uji).',
    net_weight_kg: 5,
    packaging_type: 'Pouch / Sak Lapis Dalam 5 kg',
    price_idr: 75000, // Rp15.000/kg x 5 kg (Asumsi simulasi)
    registration_status: 'Dalam Proses Pendaftaran / Simulasi DEMO',
    usage_instructions: 'Aplikasikan di sekitar perakaran tanaman anggur, hortikultura, atau bambu sesuai dosis anjuran hasil analisis tanah.',
    available_stock_units: 34,
    available_stock_kg: 170,
    linked_batch_code: 'PB-CBR-202611-01-DEMO',
    qa_verified: true,
    ready_for_sale: true,
    active: true
  },
  {
    product_id: 'PROD-CG-02',
    product_code: 'CG-GRANULE-01',
    name: 'Cibarani Guano Granule',
    is_demo: true,
    category: 'Biofertilizer Organik Granul',
    description: 'Formulasi guano bentuk butiran (granul) lepas lambat untuk kemudahan aplikasi pada kebun anggur dan tanaman tahunan.',
    composition_summary: 'Mengikuti spesifikasi batch produksi dan sertifikat hasil uji laboratorium yang terhubung.',
    net_weight_kg: 10,
    packaging_type: 'Karung Lapis Dalam 10 kg',
    price_idr: 150000,
    registration_status: 'Konsep Produk Tahap Pengembangan (DEMO)',
    usage_instructions: 'Taburkan merata pada jalur pupuk atau lubang tanam sesuai panduan teknis budidaya ASPAI.',
    available_stock_units: 0,
    available_stock_kg: 0,
    linked_batch_code: '-',
    qa_verified: false,
    ready_for_sale: false, // Terkunci otomatis karena belum ada batch yang lulus uji mutu
    active: true
  },
  {
    product_id: 'PROD-CG-03',
    product_code: 'CG-PRO-01',
    name: 'Cibarani Professional Series',
    is_demo: true,
    category: 'Formulasi Khusus Komunitas Hortikultura & Kebun Anggur',
    description: 'Seri khusus hasil riset formulasi ASPAI untuk kebutuhan nutrisi fase generatif/pembuahan tanaman hortikultura.',
    composition_summary: 'Komposisi nutrisi dicantumkan secara transparan berdasarkan hasil uji laboratorium per batch.',
    net_weight_kg: 5,
    packaging_type: 'Kemasan Khusus 5 kg dengan QR Ketertelusuran',
    price_idr: 95000,
    registration_status: 'Konsep Produk Tahap Pengembangan (DEMO)',
    usage_instructions: 'Gunakan sesuai petunjuk teknis yang telah disetujui tim agronomi ASPAI.',
    available_stock_units: 0,
    available_stock_kg: 0,
    linked_batch_code: '-',
    qa_verified: false,
    ready_for_sale: false,
    active: true
  }
];

export const INITIAL_ORDERS = [
  {
    order_id: 'ORD-DEMO-001',
    order_number: 'INV-CG-202611-001-DEMO',
    is_demo: true,
    customer_name: '[DEMO] Komunitas Kebun Anggur Banten Raya',
    customer_org: 'Jaringan Petani ASPAI (DEMO)',
    product_code: 'CG-POWDER-01',
    product_name: 'Cibarani Guano Powder (5 kg)',
    prod_batch_code: 'PB-CBR-202611-01-DEMO',
    quantity_units: 2,
    total_weight_kg: 10,
    unit_price_idr: 75000,
    total_amount_idr: 150000,
    payment_status: 'Paid (Simulasi DEMO)',
    order_status: 'Completed', // 'Pending Payment' | 'Paid' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled' | 'Refunded'
    shipping_tracking: 'SHIP-DEMO-BANTEN-01',
    created_at: '2026-11-05T19:00:00+07:00'
  }
];

export const INITIAL_TRACEABILITY_TOKENS = [
  {
    token: 'CG-TRC-9F4A2C8E1B7D',
    is_demo: true,
    prod_batch_code: 'PB-CBR-202611-01-DEMO',
    raw_batch_code: 'RMB-CBR-202611-01-DEMO',
    product_name: 'Cibarani Guano Powder [DEMO]',
    production_date: '2026-11-05',
    public_quality_status: 'Lulus Uji Mutu Laboratorium (Sertifikat DEMO: CERT-LAB-DEMO-2026-001)',
    public_test_summary: 'Kadar Air: 11.4% | pH: 6.8 | C-Organik: 18.2% | P2O5: 12.6% | Logam Berat & Patogen: Memenuhi Baku Mutu (Data Contoh DEMO)',
    general_origin_region: 'Wilayah Adat Kasepuhan Cibarani, Kab. Lebak, Provinsi Banten (Koordinat Gua Dirahasiakan untuk Perlindungan Konservasi)',
    approved_producer_identity: 'Kolaborasi ASPAI, Kasepuhan Cibarani & Pendampingan Konservasi YSNJ',
    conservation_compliance: 'Diverifikasi mematuhi protokol konservasi non-intrusif & persetujuan adat',
    traceability_status: 'VERIFIED_PUBLIC_SAFE'
  }
];

export const INITIAL_FINANCIAL_TRANSACTIONS = [
  {
    tx_id: 'FIN-DEMO-001',
    tx_number: 'TRX-CG-202611-001-DEMO',
    is_demo: true,
    tx_date: '2026-11-05',
    tx_type: 'INCOME', // 'INCOME' | 'EXPENSE' | 'GRANT_CSR' | 'FINANCING' | 'REVERSAL'
    category: 'Penjualan Produk',
    description: '[DEMO] Penerimaan penjualan 2 kemasan Cibarani Guano Powder (INV-CG-202611-001-DEMO)',
    amount_idr: 150000,
    currency: 'IDR',
    fund_source: 'Rekening Operasional Badan Usaha (Simulasi DEMO)',
    doc_reference: 'INV-CG-202611-001-DEMO',
    created_by: 'Finance Officer (DEMO)',
    verified_by: 'Project Admin (DEMO)',
    status: 'Approved', // 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Reconciled'
    created_at: '2026-11-05T19:30:00+07:00'
  },
  {
    tx_id: 'FIN-DEMO-002',
    tx_number: 'TRX-CG-202611-002-DEMO',
    is_demo: true,
    tx_date: '2026-11-04',
    tx_type: 'EXPENSE',
    category: 'Biaya Tenaga Kerja Lokal',
    description: '[DEMO] Pembayaran insentif 6 warga lokal pengumpul & pemilah bahan baku (HRV-DEMO-001)',
    amount_idr: 60000,
    currency: 'IDR',
    fund_source: 'Kas Operasional Lapangan (Simulasi DEMO)',
    doc_reference: 'BKK-HRV-DEMO-001',
    created_by: 'Finance Officer (DEMO)',
    verified_by: 'Kasepuhan Admin (DEMO)',
    status: 'Approved',
    created_at: '2026-11-04T17:00:00+07:00'
  },
  {
    tx_id: 'FIN-DEMO-003',
    tx_number: 'TRX-CG-202611-003-DEMO',
    is_demo: true,
    tx_date: '2026-11-05',
    tx_type: 'EXPENSE',
    category: 'Biaya Konservasi & Monitoring',
    description: '[DEMO] Operasional kegiatan monitoring habitat kelelawar & perlengkapan keselamatan non-intrusif',
    amount_idr: 15000,
    currency: 'IDR',
    fund_source: 'Pos Dana Konservasi (Simulasi DEMO)',
    doc_reference: 'BKK-MON-DEMO-001',
    created_by: 'Finance Officer (DEMO)',
    verified_by: 'YSNJ Admin (DEMO)',
    status: 'Approved',
    created_at: '2026-11-05T18:00:00+07:00'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    notif_id: 'NTF-DEMO-01',
    type: 'WARNING',
    title: '[DEMO] Survei Situs Utama Cibarani Belum Dilakukan',
    message: 'Situs RES-CBR-001 masih berstatus "Belum Disurvei" (Volume: Kosong). Izin pengumpulan pada situs ini dikunci hingga survei ekologi & persetujuan adat disahkan.',
    created_at: '2026-11-05T08:00:00+07:00',
    is_read: false
  },
  {
    notif_id: 'NTF-DEMO-02',
    type: 'SUCCESS',
    title: '[DEMO] Batch PB-CBR-202611-01-DEMO Lulus Uji Mutu',
    message: 'Quality Officer telah memvalidasi hasil uji laboratorium DEMO. Token QR CG-TRC-9F4A2C8E1B7D kini aktif untuk ketertelusuran publik.',
    created_at: '2026-11-05T17:05:00+07:00',
    is_read: false
  },
  {
    notif_id: 'NTF-DEMO-03',
    type: 'INFO',
    title: '[ASUMSI] Simulasi Pembagian Manfaat Menunggu Penetapan Badan Usaha',
    message: 'Parameter alokasi 50% Kasepuhan : 30% ASPAI : 20% Program YSNJ (+10% Dana Konservasi) berstatus ASUMSI — BELUM DISEPAKATI.',
    created_at: '2026-11-05T20:00:00+07:00',
    is_read: false
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    log_id: 'AUD-CG-001',
    timestamp: '2026-11-01T08:00:00+07:00',
    actor_role: 'YSNJ_ADMIN',
    actor_org: 'ORG-YSNJ',
    action: 'REGISTER_RESOURCE_SITE',
    entity_ref: 'RES-CBR-001',
    details: '[DEMO] Registrasi Situs Karst Wilayah Adat Cibarani tanpa koordinat publik (Status volume: Belum Disurvei).'
  },
  {
    log_id: 'AUD-CG-002',
    timestamp: '2026-11-04T14:30:00+07:00',
    actor_role: 'KASEPUHAN_ADMIN',
    actor_org: 'ORG-KASEPUHAN',
    action: 'APPROVE_HARVEST_AND_RAW_BATCH',
    entity_ref: 'HRV-DEMO-001 -> RMB-CBR-202611-01-DEMO',
    details: '[DEMO] Persetujuan adat & verifikasi pengumpulan simulasi 250 kg (di bawah batas kuota 300 kg).'
  },
  {
    log_id: 'AUD-CG-003',
    timestamp: '2026-11-05T17:00:00+07:00',
    actor_role: 'QUALITY_OFFICER',
    actor_org: 'ORG-ASPAI',
    action: 'VERIFY_QUALITY_AND_GENERATE_QR',
    entity_ref: 'PB-CBR-202611-01-DEMO -> CG-TRC-9F4A2C8E1B7D',
    details: '[DEMO] Validasi sertifikat uji CERT-LAB-DEMO-2026-001 & pembuatan token QR kriptografis publik.'
  }
];

