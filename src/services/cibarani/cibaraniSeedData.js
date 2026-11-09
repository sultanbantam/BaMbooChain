/**
 * Cibarani Weekend Experience - Authentic Seed Data (Labeled DEMO)
 * Sumber Data: Yayasan Sabumi Nusantara Jaya & Masyarakat Adat Kasepuhan Cibarani
 * Wewengkon Adat Kasepuhan Cibarani - Lebak, Banten
 */

export const CIBARANI_PROFILE = {
  name: 'Wewengkon Adat Kasepuhan Cibarani',
  tagline: 'Datang untuk Mengenal, Menikmati Alam, Merasakan Budaya, dan Berbagi Kebaikan',
  englishHook: 'ONE WEEKEND. A THOUSAND STORIES. A MEANINGFUL JOURNEY.',
  location: 'Desa Cibarani, Kec. Cirinten, Kab. Lebak, Banten, Indonesia',
  operator: 'Yayasan Sabumi Nusantara Jaya (YSNJ) bersama Masyarakat Adat Kasepuhan Cibarani',
  lastUpdated: 'November 2026',
  source: 'Dokumen Profil & SK Penetapan Hutan Adat Kasepuhan Cibarani',
  metrics: {
    totalAreaHa: 900, // ±900 hektare wilayah adat
    indigenousForestHa: 490, // ±490 hektare Hutan Adat berdasarkan SK
    population: 1997, // Jiwa
    households: 673, // Unit rumah
    administrative: '4 RW dan 17 RT'
  },
  zoningSystem: [
    {
      name: 'Leuweung Kolot (Hutan Tua / Primer)',
      desc: 'Hutan lebat alami yang dilindungi secara ketat. Dilarang menebang pohon dan merusak vegetasi untuk menjaga mata air dan keseimbangan ekosistem hulu.',
      status: 'Konservasi Ketat (Bukan Area Wisata Komersial)',
      color: '#065f46'
    },
    {
      name: 'Leuweung Titipan (Hutan Keramat / Sakral)',
      desc: 'Kawasan hutan yang diamanatkan para leluhur sebagai titipan spiritual dan cadangan masa depan. Akses hanya diizinkan untuk ritual adat tertentu dengan izin Olot/Tetua Adat.',
      status: 'Sakral / Akses Terbatas',
      color: '#78350f'
    },
    {
      name: 'Leuweung Tutupan (Hutan Lindung / Penyangga)',
      desc: 'Hutan penyangga yang berfungsi melindungi tanah dari longsor dan menahan erosi. Pengambilan hasil hutan non-kayu diatur oleh hukum adat.',
      status: 'Penyangga Ekologis',
      color: '#0f766e'
    },
    {
      name: 'Leuweung Cadangan (Hutan Garapan / Pemanfaatan Terkendali)',
      desc: 'Area hutan yang boleh dimanfaatkan untuk kebun, perladangan huma, budidaya bambu, dan sumber kayu bakar warga dengan sistem rotasi adat.',
      status: 'Pemanfaatan Berkelanjutan',
      color: '#0284c7'
    }
  ],
  travelRoute: {
    title: 'Panduan Akses Perjalanan Ekonomis ke Cibarani',
    steps: [
      { step: 1, title: 'KRL Commuter Line', desc: 'Rute Stasiun Tanah Abang menuju Stasiun Rangkasbitung (±1.5 - 2 jam perjalanan).' },
      { step: 2, title: 'Stasiun Rangkasbitung', desc: 'Turun di stasiun akhir Rangkasbitung, keluar menuju terminal angkutan pedesaan/elf.' },
      { step: 3, title: 'Angkutan Elf Jurusan Parigi', desc: 'Naik elf jurusan Parigi/Cibarani melewati jalur perbukitan Lebak Selatan.' },
      { step: 4, title: 'Gerbang Kasepuhan Cibarani', desc: 'Turun di gapura pintu masuk wewengkon adat Cibarani.' },
      { step: 5, title: 'Ojek Komunitas / Shuttle Desa', desc: 'Lanjut ojek warga lokal menyusuri lereng dan kontur perbukitan hingga tiba di kampung adat.' }
    ],
    note: 'Kondisi jalan dari gerbang menuju pemukiman bervariasi (aspal, beton sebagian, batu, tanah, tanjakan lereng). Dianjurkan membawa alas kaki trekking, air minum, dan pakaian nyaman. Jadwal elf & ojek bergantung pada kondisi lapangan.'
  }
};

export const CIBARANI_PACKAGES = [
  {
    id: 'PKG-WEEKEND-01',
    title: 'Paket Cibarani Weekend Experience (2 Hari 1 Malam)',
    badge: 'Paket Utama',
    indicativePrice: 1000000,
    priceUnit: '/ orang',
    duration: '2 Hari 1 Malam (Sabtu - Minggu)',
    minParticipants: 4,
    maxQuotaPerBatch: 20,
    shortDesc: 'Menikmati kehidupan masyarakat adat Kasepuhan Cibarani, kedaulatan pangan leuit, eksplorasi alam, budidaya bambu, dan kearifan lokal.',
    includes: [
      'Akomodasi homestay rumah panggung tradisional warga adat',
      'Konsumsi makanan khas sunda huma (makan siang, malam, sarapan pagi)',
      'Pemandu lokal warga adat Kasepuhan Cibarani',
      'Eksplorasi leuit & sesi edukasi Rukun Tani & Padi Lintas Generasi',
      'Kunjungan Goa Dagul & jelajah alam (didampingi pemandu)',
      'Edukasi budidaya & kerajinan bambu BaMbooChain',
      'Kontribusi sosial untuk dana pelestarian adat & lingkungan'
    ],
    excludes: [
      'Transportasi pribadi dari kota asal ke titik kumpul Rangkasbitung / Gerbang Desa',
      'Pembelian oleh-oleh / produk lokal (Madu Odeng, Gula Aren, dsb.)',
      'Pengeluaran pribadi di luar fasilitas yang disepakati'
    ],
    itinerarySummary: 'Sabtu: Penyambutan adat, pengenalan wewengkon, makan bersama di huma, eksplorasi bambu, dialog malam bersama sesepuh. Minggu: Olahraga pagi di sawah, kunjungan leuit & padi lintas generasi, petualangan Goa Dagul / Sirah Banteng, belanja hasil bumi, penutupan.'
  }
];

export const CIBARANI_EXPERIENCES = [
  {
    id: 'EXP-LEUIT',
    category: 'Kedaulatan Pangan & Budaya',
    title: 'Kedaulatan Pangan, Rukun Tani & Tradisi Leuit',
    tagline: 'Padi Lintas Generasi: Merawat Ketahanan Pangan Puluhan Tahun',
    desc: 'Bukan sekadar slogan ketahanan pangan. Di Kasepuhan Cibarani, sistem Rukun Tani mengelola siklus padi dari sawah dan huma, proses pengeringan di lantayan, hingga disimpan di lumbung leuit. Terdapat kesaksian personal mencicipi beras dari gabah simpanan puluhan tahun yang tetap terjaga wangi dan kualitasnya.',
    image: '/gambar/pehcibarani.png',
    highlights: ['Arsitektur leuit anti-hama tradisional', 'Filosofi penghormatan terhadap Dewi Sri / Padi', 'Edukasi benih lokal & sistem huma tanpa kimia sintetis'],
    difficulty: 'Mudah (Cocok untuk semua usia)',
    status: 'Tersedia'
  },
  {
    id: 'EXP-BAMBOO',
    category: 'Edukasi Lingkungan',
    title: 'Edukasi Budidaya Bambu & Konservasi Sumber Air',
    tagline: 'Bambu sebagai Penopang Kehidupan dan Ekonomi Berkelanjutan',
    desc: 'Belajar langsung mengenali jenis-jenis bambu endemik, teknik pembibitan, pemeliharaan rumpun, hingga peran akar bambu dalam mengikat tanah dan menjaga mata air desa.',
    image: '/gambar/gambar/kbambu/01.jpg',
    highlights: ['Praktik teknik silvikultur bambu', 'Pembuatan kerajinan & anyaman bersama perajin desa', 'Penanaman bibit bambu konservasi BaMbooChain'],
    difficulty: 'Mudah - Sedang',
    status: 'Tersedia'
  },
  {
    id: 'EXP-DAGUL',
    category: 'Petualangan & Spiritual',
    title: 'Jelajah Bentang Karst & Goa Dagul',
    tagline: 'Misteri Alam Bawah Tanah yang Dihormati Adat',
    desc: 'Eksplorasi keindahan lorong gua karst alami dengan stalaktit dan stalagmit unik. Kunjungan wajib didampingi pemandu adat dan mematuhi etika sopan santun di ruang sakral.',
    image: '/gambar/pehc.JPG',
    highlights: ['Formasi batuan karst alami ribuan tahun', 'Habitat koloni kelelawar penghasil guano organik', 'Pengalaman keheningan & rasa hormat pada alam'],
    difficulty: 'Sedang (Perlu alas kaki grip kokoh & senter)',
    status: 'Tersedia (Sesuai Cuaca)'
  },
  {
    id: 'EXP-SIRAH-BANTENG',
    category: 'Wisata Alam & Air',
    title: 'Mata Air Alami & Aliran Sungai Sirah Banteng',
    tagline: 'Kesegaran Sumber Air Murni Penjaga Kehidupan',
    desc: 'Merasakan kesegaran air jernih pegunungan di Sirah Banteng. Aktivitas bermain air hanya ditawarkan jika kondisi arus, cuaca, dan tingkat keselamatan telah diverifikasi pemandu.',
    image: '/gambar/pehc2.JPG',
    highlights: ['Air pegunungan alami yang dingin dan bening', 'Batu-batu sungai eksotis dikelilingi rindang pepohonan', 'Pengamatan zona konservasi hulu air'],
    difficulty: 'Mudah - Sedang',
    status: 'Tersedia (Kondisional Cuaca)'
  },
  {
    id: 'EXP-RUMAH-ADAT',
    category: 'Wisata Budaya & Kehidupan Sosial',
    title: 'Kehangatan Rumah Panggung Tradisional & Kasepuhan',
    tagline: 'Tinggal Bersama Warga, Merasakan Keseharian yang Bersahaja',
    desc: 'Menginap di rumah panggung kayu bambu warga, belajar tata krama adat, bercengkerama di pawon (dapur tradisional), dan mendengarkan petuah bijak para sesepuh Kasepuhan Cibarani.',
    image: '/gambar/pehc3.JPG',
    highlights: ['Konstruksi ramah gempa tradisional pasak kayu', 'Kuliner nasi liwet huma & lalapan daun hutan', 'Dialog santai malam tentang falsafah hidup Sunda Wiwitan'],
    difficulty: 'Sangat Mudah',
    status: 'Tersedia'
  }
];

export const CIBARANI_PRODUCTS = [
  {
    id: 'PRD-MADU-ODENG',
    name: 'Madu Odeng Asli Hutan Cibarani',
    category: 'Hasil Hutan Non-Kayu',
    indicativePrice: 300000,
    priceUnit: 'per botol (±500 ml)',
    desc: 'Madu murni hasil panen lestari lebah liar (Apis dorsata) di pohon-pohon tinggi hutan adat Kasepuhan Cibarani. Rasa manis legit dengan aroma nektar bunga hutan yang khas.',
    producer: 'Kelompok Pemanen Madu Hutan Adat Cibarani',
    stockStatus: 'Tersedia (Musiman)',
    image: '/gambar/pehcibarani.png'
  },
  {
    id: 'PRD-GULA-AREN',
    name: 'Gula Aren Cetak Murni Cibarani',
    category: 'Pangan Alami',
    indicativePrice: 35000,
    priceUnit: 'per gandu (2 batok)',
    desc: 'Diolah tradisional dari nira pohon aren liar pegunungan oleh penderes lokal. Tanpa pengawet dan tanpa pemanis buatan, wangi karamel alami.',
    producer: 'Ibu-ibu Pengrajin Gula Aren Desa Cibarani',
    stockStatus: 'Tersedia',
    image: '/gambar/bunga.jpg'
  },
  {
    id: 'PRD-PUPUK-GUANO',
    name: 'Pupuk Biofertilizer Guano Cibarani',
    category: 'Pertanian Organik',
    indicativePrice: 45000,
    priceUnit: 'per karung (10 kg)',
    desc: 'Pupuk fosfat & nitrogen organik tinggi dari endapan guano kelelawar Goa Cibarani yang dipanen terkontrol demi menjaga populasi kelelawar dan kesuburan tanah.',
    producer: 'Unit Usaha Pupuk Organik Kasepuhan Cibarani & ASPAI',
    stockStatus: 'Tersedia',
    image: '/gambar/agroforestry2.jpg'
  },
  {
    id: 'PRD-BAMBU-BATANG',
    name: 'Batang Bambu Awet Seleksi Cibarani',
    category: 'Bahan Bangunan Alami',
    indicativePrice: 30000,
    priceUnit: 'per batang (panjang 6m)',
    desc: 'Bambu Tali, Bambu Gombong, dan Bambu Hitam yang dipanen pada mangsa yang tepat dan diawetkan secara alami untuk konstruksi dan kerajinan.',
    producer: 'Koperasi Digital Bambu (KODIBA) Unit Cibarani',
    stockStatus: 'Tersedia Berdasarkan Pesanan',
    image: '/gambar/batang.jpg'
  }
];

export const CIBARANI_EVENTS = [
  {
    id: 'EVT-01',
    title: 'Weekend Experience Batch 1: Merajut Asa di Huma Cibarani',
    date: '14 - 15 November 2026',
    startDate: '2026-11-14',
    endDate: '2026-11-15',
    quota: 15,
    bookedCount: 6,
    status: 'Buka Pendaftaran',
    category: 'Wisata Edukasi & Budaya',
    desc: 'Pengalaman akhir pekan lengkap menjelajahi wewengkon adat, melihat lumbung leuit, mencicipi hasil huma, dan berkunjung ke sentra bambu.',
    location: 'Bale Pertemuan Adat Kasepuhan Cibarani'
  },
  {
    id: 'EVT-02',
    title: 'Siklus Tani & Upacara Seren Padi Tradisional',
    date: '28 - 29 November 2026',
    startDate: '2026-11-28',
    endDate: '2026-11-29',
    quota: 20,
    bookedCount: 12,
    status: 'Hampir Penuh',
    category: 'Upacara Budaya',
    desc: 'Menyaksikan prosesi penghormatan kepada hasil panen dan tata cara memasukkan gabah ke dalam leuit oleh para tetua adat.',
    location: 'Kompleks Leuit Adat Cibarani'
  },
  {
    id: 'EVT-03',
    title: 'Aksi Bersama: Penanaman 500 Rumpun Bambu Konservasi',
    date: '12 - 13 Desember 2026',
    startDate: '2026-12-12',
    endDate: '2026-12-13',
    quota: 25,
    bookedCount: 8,
    status: 'Buka Pendaftaran',
    category: 'Konservasi Lingkungan',
    desc: 'Bersama pemuda adat dan relawan menanam bibit bambu di bantaran sungai dan lereng rawan erosi untuk mengamankan mata air.',
    location: 'Zona Penyangga Leuweung Titipan'
  }
];

export const CIBARANI_STORIES = [
  {
    id: 'STR-01',
    title: 'Padi Lintas Generasi: Kisah Leuit dan Gabah 40 Tahun yang Tetap Harum',
    author: 'Tim Ekspedisi Sabumi & Olot Cibarani',
    date: '3 November 2026',
    category: 'Kedaulatan Pangan',
    coverImage: '/gambar/pehcibarani.png',
    readTime: '6 Menit Baca',
    summary: 'Bagaimana arsitektur dan pengetahuan leluhur menjaga gabah padi huma bertahan puluhan tahun tanpa bahan pengawet kimiawi.',
    content: `Bagi masyarakat modern, beras adalah komoditas yang harus segera dikonsumsi sebelum berkutu dalam hitungan bulan. Namun di Kasepuhan Cibarani, konsep penyimpanan pangan melampaui batas generasi.

Melalui sistem Leuit—lumbung kayu panggung dengan sirkulasi udara khusus dan peredam kelembapan alami—gabah padi hasil panen sawah dan huma disimpan dengan ritual dan tata nilai yang ketat. Pengusul program menceritakan pengalaman personal saat menikmati nasi dari gabah yang tersimpan selama 32 tahun dan 40 tahun, serta aroma wangi gabah berusia 70 tahun yang masih terpelihara.

Ini bukan sekadar cerita nostalgia, melainkan bukti otentik kedaulatan pangan berbasis kearifan lokal yang patut dipelajari oleh dunia hari ini.`
  },
  {
    id: 'STR-02',
    title: 'Mata Air Sirah Banteng: Menjaga Hulu Agar Hilir Tetap Hidup',
    author: 'Relawan Lingkungan BaMbooChain',
    date: '28 Oktober 2026',
    category: 'Konservasi Air',
    coverImage: '/gambar/pehc2.JPG',
    readTime: '5 Menit Baca',
    summary: 'Peran vital rumpun bambu dan hutan adat dalam menyaring serta menjaga debit mata air pegunungan di Lebak.',
    content: `Air yang mengalir di Sirah Banteng begitu jernih hingga batu-batu kali di dasarnya tampak berkilau. Di balik kejernihan ini, terdapat aturan adat Leuweung Kolot dan Leuweung Tutupan yang secara konsisten melarang penebangan pohon di radius mata air.

Rumpun-rumpun bambu di sepanjang tebing berfungsi sebagai jaringan sponge alami yang menyerap air hujan dan melepaskannya perlahan sepanjang musim kemarau.`
  }
];

export const CIBARANI_IMPACT_PROJECTS = [
  {
    id: 'IMP-01',
    title: 'Pemugaran Rumah Adat Panggung Kasepuhan',
    target: '3 Unit Rumah Panggung Sesepuh',
    currentProgressPercent: 65,
    location: 'Kampung Adat Cibarani',
    supportReceived: 'Rp 45.000.000 / Rp 70.000.000',
    leadPerson: 'Ki Jaro & Komite Bangun In BaMbooChain',
    status: 'Sedang Berjalan (Verified)',
    desc: 'Penggantian atap ijuk, perbaikan tiang kayu penyangga, dan anyaman dinding bambu menggunakan teknik tradisional pasak kayu tanpa paku.',
    beforeImg: '/gambar/house.png',
    afterImg: '/gambar/pehc.JPG'
  },
  {
    id: 'IMP-02',
    title: 'Pembangunan Sarana Masjid Adat Ramah Lingkungan',
    target: '1 Unit Masjid Bambu & Kayu Komunitas',
    currentProgressPercent: 80,
    location: 'Pusat Pemukiman Cibarani',
    supportReceived: 'Rp 85.000.000 / Rp 105.000.000',
    leadPerson: 'Yayasan Sabumi Nusantara Jaya & DKM Masjid Cibarani',
    status: 'Tahap Finishing (Verified)',
    desc: 'Pusat ibadah dan musyawarah warga dengan desain arsitektur bambu ramah lingkungan yang menyejukkan.',
    beforeImg: '/assets/designs/bambu_mosque_3d.png',
    afterImg: '/gambar/pehc3.JPG'
  },
  {
    id: 'IMP-03',
    title: 'Penanaman Bambu Sabuk Hijau & Penguatan Lereng',
    target: '2.000 Bibit Rumpun Bambu Konservasi',
    currentProgressPercent: 50,
    location: 'Bantaran Sungai Cibarani & Lereng Rawan Erosi',
    supportReceived: '1.000 Bibit Tertanam',
    leadPerson: 'Kelompok Tani Bambu Lestari & Relawan BaMbooChain',
    status: 'Sedang Berjalan',
    desc: 'Program penanaman bambu untuk mencegah longsor lereng jalan dan memelihara resapan air ke perkebunan warga.',
    beforeImg: '/gambar/survey.jpg',
    afterImg: '/gambar/gambar/kbambu/01.jpg'
  }
];

export const CIBARANI_GALLERY = [
  { id: 'GAL-01', title: 'Hamparan Sawah & Pemukiman Kasepuhan Cibarani', category: 'Lanskap', image: '/gambar/pehcibarani.png', photographer: 'Dok. YSNJ', consentVerified: true },
  { id: 'GAL-02', title: 'Deretan Leuit Lumbung Padi Adat', category: 'Leuit & Pangan', image: '/gambar/pehc.JPG', photographer: 'Arsip Adat Cibarani', consentVerified: true },
  { id: 'GAL-03', title: 'Aliran Bening Mata Air Sirah Banteng', category: 'Alam & Air', image: '/gambar/pehc2.JPG', photographer: 'Relawan Cibarani', consentVerified: true },
  { id: 'GAL-04', title: 'Rumah Panggung dan Dinding Anyaman Bambu', category: 'Rumah Adat', image: '/gambar/pehc3.JPG', photographer: 'Dok. YSNJ', consentVerified: true },
  { id: 'GAL-05', title: 'Rumpun Bambu Endemik di Lereng Bukit', category: 'Bambu', image: '/gambar/gambar/kbambu/01.jpg', photographer: 'Tim BaMbooChain', consentVerified: true },
  { id: 'GAL-06', title: 'Kerajinan Tangan dan Anyaman Bambu Warga', category: 'Produk Lokal', image: '/gambar/batang.jpg', photographer: 'Pemberdayaan Adat', consentVerified: true }
];

