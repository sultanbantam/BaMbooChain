import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, BookOpen, Leaf, ChevronRight, Mic, Landmark, Wallet, ArrowRight, CheckCircle, MessageSquare, Sprout, UploadCloud, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAssetUrl } from '../../utils/assets';
import { useLanguage } from '../../context/LanguageContext';
import { db } from '../../firebase/config';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { PROJECTS } from '../../data/projectsData';

// ─── BASIS PENGETAHUAN BAMBU ─────────────────────────────────────────────────
const BAMBOO_KB = [
  {
    keywords: ['moso', 'phyllostachys edulis'],
    answer: `**Bambu Moso (Phyllostachys edulis)** adalah spesies bambu terbesar dan paling komersial di dunia, berasal dari Cina.\n\n📏 **Ukuran:** Bisa mencapai tinggi 28 meter, diameter 20 cm\n🌱 **Pertumbuhan:** Salah satu tanaman tercepat — bisa tumbuh hingga 91 cm per hari!\n🌍 **Persebaran:** Cina, Jepang, dan kini dikembangkan di Indonesia\n💡 **Kegunaan:** Konstruksi, furnitur, laminasi, tekstil, makanan (rebung)\n💰 **Nilai Ekonomi:** Harga bambu Moso olahan USD 800–1.200/ton di pasar internasional`,
  },
  {
    keywords: ['petung', 'dendrocalamus asper', 'bambu petung'],
    answer: `**Bambu Petung (Dendrocalamus asper)** adalah salah satu bambu terbesar di Indonesia dan Asia Tenggara.\n\n📏 **Ukuran:** Tinggi 20–30 meter, diameter 8–20 cm, dinding batang tebal\n🇮🇩 **Habitat Asli:** Indonesia, Malaysia, Filipina, Vietnam\n🏗️ **Kegunaan Utama:**\n- Konstruksi bangunan & jembatan\n- Bambu laminasi (glulam)\n- Saluran air tradisional\n- Rebung — salah satu terbaik untuk dimakan\n\n💰 **Potensi Ekonomi:** Sangat tinggi untuk konstruksi hijau`,
  },
  {
    keywords: ['apus', 'gigantochloa apus', 'bambu apus'],
    answer: `**Bambu Apus (Gigantochloa apus)** — paling banyak digunakan untuk kerajinan dan anyaman di Indonesia.\n\n📏 **Ukuran:** Tinggi 8–13 meter, diameter 4–8 cm\n🎨 **Kegunaan Utama:**\n- Anyaman & kerajinan tangan\n- Sumpit, sedotan bambu\n- Kertas & pulp bambu\n- Gagang alat pertanian\n\n🌱 **Keunggulan:** Tumbuh di lahan marjinal, perawatan mudah, dan dapat dipanen dalam 3–4 tahun.\n💡 Sangat cocok untuk program pemberdayaan masyarakat desa.`,
  },
  {
    keywords: ['tanam', 'menanam', 'budidaya', 'cara tanam', 'penanaman'],
    answer: `**Panduan Budidaya Bambu:**\n\n🌱 **Persiapan Lahan:**\n- pH tanah ideal 5.5–6.5\n- Drainase baik, tidak tergenang\n- Jarak tanam 5×5 m (400 pohon/ha) atau 6×6 m (278 pohon/ha)\n\n🪴 **Bibit:**\n- Dari stek batang, anakan, atau biji\n- Masa penyemaian 2–3 bulan sebelum tanam\n\n📅 **Waktu Tanam:** Awal musim hujan (Oktober–November)\n\n🌿 **Pemupukan:**\n- Pupuk organik 10–20 kg/lubang saat tanam\n- NPK 3 bulan sekali pada tahun pertama\n\n⏱️ **Waktu Panen Pertama:** 3–5 tahun tergantung spesies\n\n💡 **Tips:** Jangan tebang semua batang! Prinzip 1/3 — ambil 1/3 batang tua, sisakan 2/3 untuk regenerasi.`,
  },
  {
    keywords: ['panen', 'pemanenan', 'tebang', 'usia panen'],
    answer: `**Teknik Pemanenan Bambu yang Benar:**\n\n📅 **Usia Optimal:**\n- Bambu untuk konstruksi: 3–5 tahun (setelah lignifikasi penuh)\n- Rebung (bambu muda): 2–3 minggu setelah muncul\n- Bambu untuk anyaman: 2–3 tahun\n\n🗓️ **Waktu Terbaik:** Musim kemarau (Mei–September) — kadar air rendah, lebih awet\n\n⚠️ **Jangan panen saat:**\n- Musim hujan lebat (bambu mengandung banyak pati = rentan jamur & serangga)\n- Bulan purnama (mitos, tapi dipercaya petani: kadar air tinggi)\n\n✂️ **Teknik Tebang:** Potong 30 cm dari pangkal, biarkan tunggul untuk mendorong tunas baru\n\n📌 **Prinsip Lestari:** Hanya tebang maksimal 30% dari total rumpun per tahun`,
  },
  {
    keywords: ['harga', 'nilai', 'ekonomi', 'jual', 'pasar', 'ekspor'],
    answer: `**Data Harga & Pasar Bambu (2025–2026):**\n\n🏠 **Pasar Domestik Indonesia:**\n- Bambu mentah (utuh): Rp 3.000–8.000/batang\n- Bambu belah: Rp 1.500–3.000/kg\n- Rebung segar: Rp 5.000–15.000/kg\n\n🌍 **Pasar Ekspor Internasional:**\n- Lantai bambu (flooring): USD 15–30/m²\n- Bambu laminasi: USD 800–1.500/m³\n- Serat bambu tekstil: USD 3–8/kg\n- Arang bambu (charcoal): USD 500–900/ton\n- Minyak bambu (bamboo vinegar): USD 2–5/liter\n\n📈 **Tren:** Permintaan bambu engineered global tumbuh 5–7% per tahun (2024–2030)\n\n💡 **Negara Importir Utama Produk Bambu Indonesia:**\n🇨🇳 Cina • 🇯🇵 Jepang • 🇺🇸 Amerika Serikat • 🇩🇪 Jerman • 🇳🇱 Belanda`,
  },
  {
    keywords: ['karbon', 'carbon', 'co2', 'serapan', 'hijau', 'lingkungan'],
    answer: `**Bambu & Perubahan Iklim:**\n\n🌍 **Kemampuan Serapan Karbon:**\n- 1 hektar bambu menyerap 17 ton CO₂/tahun (vs pohon kayu: 2–7 ton/ha/tahun)\n- Bambu melepaskan 35% lebih banyak oksigen dibanding pohon setara\n\n♻️ **Keunggulan Lingkungan:**\n- Dapat dipanen berulang TANPA perlu tanam ulang (akar terus hidup)\n- Menguatkan struktur tanah di lahan miring/kritis\n- Memulihkan daerah aliran sungai (DAS)\n\n💰 **Monetisasi Carbon:**\n- Program VCS (Verified Carbon Standard)\n- Estimasi: 1 ha bambu = 5–10 carbon credit/tahun\n- Harga carbon credit: USD 15–50/ton CO₂\n\n🏆 **Bambu oleh PBB** diakui sebagai tanaman strategis untuk NDC (Nationally Determined Contribution) negara-negara berkembang.`,
  },
  {
    keywords: ['konstruksi', 'bangunan', 'rumah', 'struktur', 'laminasi', 'glulam'],
    answer: `**Bambu untuk Konstruksi & Bangunan:**\n\n💪 **Kekuatan Bambu:**\n- Tensile strength: 28.000 psi (hampir setara baja!\n- Kuat tekan: 52 MPa\n- Rasio kekuatan/berat lebih baik dari beton\n\n🏗️ **Produk Konstruksi Bambu:**\n1. **Bambu Utuh (Round):** Rangka, tiang, scaffolding\n2. **Bambu Laminasi (GLB):** Balok & papan struktural pengganti kayu\n3. **Bambu Lapis (Plywood):** Panel dinding & lantai\n4. **Strand Woven Bamboo:** Lantai paling keras, 14x lebih keras dari kayu oak\n\n🌡️ **Kelemahan & Solusi:**\n- Rentan rayap → Perlakuan borax/salt\n- Rentan lembab → Coating & desain atap lebar\n\n🌍 **Standar Internasional:** ISO 22157, ASTM D143 adaptasi, SNI untuk bambu`,
  },
  {
    keywords: ['spesies', 'jenis', 'varietas', 'macam'],
    answer: `**Mengenal Jenis-Jenis Bambu Utama di Indonesia:**\n\n🌿 **1. Bambu Petung** *(Dendrocalamus asper)* — Terbesar, untuk konstruksi\n🌿 **2. Bambu Moso** *(Phyllostachys edulis)* — Paling komersial di dunia\n🌿 **3. Bambu Apus** *(Gigantochloa apus)* — Terbaik untuk kerajinan\n🌿 **4. Bambu Tali** *(Gigantochloa psendoarundinacea)* — Serbaguna\n🌿 **5. Bambu Cendani** *(Bambusa vulgaris)* — Paling mudah tumbuh\n🌿 **6. Bambu Betung** *(Dendrocalamus giganteus)* — Tertinggi, bisa 30m+\n🌿 **7. Bambu Hitam** *(Gigantochloa atroviolacea)* — Warna unik, nilai tinggi\n🌿 **8. Bambu Kuning** *(Bambusa vulgaris vittata)* — Ornamen & turis\n\n🇮🇩 Indonesia memiliki 176 spesies bambu Indonesia (Widjaja 2019) dari total 1.400 spesies global.`,
  },
  {
    keywords: ['tekstil', 'kain', 'serat', 'fiber', 'baju', 'pakaian'],
    answer: `**Bambu sebagai Bahan Tekstil & Fashion:**\n\n🧵 **Proses Produksi:**\n1. Batang bambu dipotong → direndam kimia/mekanik\n2. Serat diekstrak → dipintal menjadi benang\n3. Benang ditenun/dirajut → kain bambu\n\n✨ **Keunggulan Kain Bambu:**\n- Anti-bakteri alami (kandungan "bamboo kun")\n- Hypoallergenic — cocok kulit sensitif\n- Lebih lembut dari katun\n- Menyerap keringat 3x lebih baik\n- Biodegradable 100%\n\n💰 **Nilai Ekonomi:**\n- Benang bambu: USD 3–8/kg\n- Kain bambu: USD 8–20/meter\n- Pakaian bambu premium: USD 30–150/item\n\n🌍 **Pasar:** Eropa & Amerika Utara — fashion berkelanjutan (sustainable fashion) growing 15%/tahun`,
  },
  {
    keywords: ['rebung', 'makanan', 'pangan', 'konsumsi', 'makan', 'kuliner'],
    answer: `**Rebung — Bambu sebagai Pangan:**\n\n🌱 **Apa itu Rebung?**\nRebung adalah tunas muda bambu yang dipanen saat baru tumbuh 15–30 cm dari tanah.\n\n🍽️ **Nilai Gizi Rebung (per 100g):**\n- Protein: 3.9 g\n- Serat: 2.2 g\n- Kalori: hanya 27 kcal (sangat rendah!)\n- Vitamin B6, E, dan berbagai mineral\n\n🌿 **Spesies Terbaik untuk Rebung:**\n- Bambu Petung *(Dendrocalamus asper)* — terbesar & terlezat\n- Bambu Moso *(Phyllostachys edulis)* — populer di Asia Timur\n- Bambu Betung — ukuran besar\n\n🔪 **Cara Mengolah:** Rebus dulu untuk mengurangi rasa pahit (asam sianida alami akan hilang)\n\n💰 **Nilai Pasar:**\n- Rebung segar: Rp 5.000–15.000/kg\n- Rebung olahan/kalengan ekspor: USD 1.5–4/kg`,
  },
  {
    keywords: ['bambu hitam', 'gigantochloa atroviolacea', 'black bamboo'],
    answer: `**Bambu Hitam (Gigantochloa atroviolacea)** — Si Hitam Bernilai Tinggi\n\n🎨 **Ciri Khas:** Batang berwarna hitam keunguan yang unik, menjadikannya sangat bernilai di pasar premium.\n\n📏 **Ukuran:** Tinggi 8–14 meter, diameter 6–12 cm\n🇮🇩 **Habitat:** Banyak ditemukan di Jawa dan Bali\n\n💼 **Kegunaan Premium:**\n- Furnitur & interior design high-end\n- Instrumen musik (seruling, gamelan)\n- Dinding & dekorasi arsitektur\n- Ekspor ke Jepang, Eropa untuk craft\n\n💰 **Nilai Ekonomi Tinggi:**\n- Harga 2–3x lipat bambu biasa\n- Sangat dicari pengrajin internasional\n\n💡 **Untuk YSNJ:** Bambu hitam adalah salah satu komoditas paling potensial untuk ekspor premium.`,
  },
  {
    keywords: ['investasi', 'roi', 'keuntungan', 'modal', 'pulang'],
    answer: `**Analisis Investasi Kebun Bambu:**\n\n💰 **Asumsi: 1 Hektar Bambu Petung**\n\n📊 **Biaya Awal (Tahun 1–2):**\n- Persiapan lahan: Rp 5–8 juta/ha\n- Bibit (400 pohon): Rp 4–6 juta\n- Pemupukan & perawatan: Rp 3–5 juta/tahun\n- **Total investasi awal: ~Rp 15–20 juta/ha**\n\n📈 **Pendapatan (mulai tahun ke-3):**\n- Rebung: 2–4 ton/ha/tahun × Rp 8.000 = Rp 16–32 juta\n- Batang bambu: 200–400 batang/ha × Rp 15.000 = Rp 3–6 juta\n- **Total pendapatan: Rp 20–40 juta/ha/tahun**\n\n⏱️ **Break Even Point:** ~Tahun ke-3 hingga ke-4\n📆 **Siklus Produktif:** 50–100 tahun (akar tidak perlu diganti!)\n\n🏆 **ROI 5 Tahun:** Estimasi 150–250%\n💡 Bandingkan dengan investasi konvensional yang jauh lebih berisiko.`,
  },
];

const QUICK_QUESTIONS = [
  'Apa spesies bambu yang paling bernilai ekonomi?',
  'Bagaimana cara menanam bambu yang benar?',
  'Berapa harga bambu di pasar ekspor?',
  'Apakah bambu bisa mengurangi karbon CO₂?',
  'Rebung bambu apa yang paling enak?',
  'Bagaimana bambu digunakan dalam konstruksi?',
];

// ─── PUSTAKA BAMBU (NFT GATED CONTENT) ──────────────────────────────────────
const PUSTAKA_ITEMS = [
  { 
    id: 'pustaka_1', icon: '🌿', title: 'Spesies Bambu Endemik Indonesia', desc: 'Analisis 176 spesies bambu Indonesia (Widjaja 2019) dari Sabang sampai Merauke', tag: 'Botani',
    tier: 'Basic', priceRp: 3000, priceBmc: 0.3,
    preview: `Bambu bergenus Gigantochloa dan Dendrocalamus adalah spesies dominan yang membentuk tulang punggung ekosistem bambu di Indonesia. Secara botanis, persebarannya merepresentasikan keanekaragaman hayati yang sangat adaptif terhadap cuaca ekstrem. Eksekutif Ringkas: Terdapat lebih dari 176 spesies yang tersebar, dengan Bambu Petung dan Pring Tali memegang peran kultural tertinggi.`,
    fullContent: `Bambu bergenus Gigantochloa dan Dendrocalamus adalah spesies dominan yang membentuk tulang punggung ekosistem bambu di Indonesia. Secara botanis, persebarannya merepresentasikan keanekaragaman hayati yang sangat adaptif terhadap cuaca ekstrem. Eksekutif Ringkas: Terdapat lebih dari 176 spesies yang tersebar, dengan Bambu Petung dan Pring Tali memegang peran kultural tertinggi.
    
**Analisis Persebaran Spesies Khusus**
Jawa Barat secara eksklusif menjadi rumah bagi bambu hitam (Gigantochloa atroviolacea) yang hanya mampu memproduksi pigmen gelapnya secara sempurna di atas tanah ber-ph 5.5 hingga 6.0 dengan curah hujan stabil. Karakteristik ini membuat bambu hitam menjadi bahan bernilai tinggi untuk instrumen kesenian dan furnitur. 
Sementara di wilayah timur Indonesia seperti Nusa Tenggara, spesies bambu lebih sering dimanfaatkan sebagai perlengkapan hidup esensial akibat batangnya yang keras berdinding tebal.`
  },
  { 
    id: 'pustaka_2', icon: '🏗️', title: 'Studi Ketahanan Bambu Laminasi', desc: 'Analisis kekuatan struktural bambu setara baja ringan', tag: 'Jurnal Analisis',
    tier: 'Analisis', priceRp: 5000, priceBmc: 0.5,
    preview: `Penelitian ini mengupas performansi kompresi silang pada Bambu Laminasi (Glulam Bamboo) dibandingkan dengan kayu ulin dan struktur baja ringan. Ringkasan Eksekutif: Proses pres hidrolik dan penggunaan resin pengikat ramah lingkungan mampu meningkatkan kuat tarik (Tensile Strength) bambu hingga mencapai 28.000 psi, membuatnya amat layak dipakai pada gedung tinggi tingkat menengah.`,
    fullContent: `Penelitian ini mengupas performansi kompresi silang pada Bambu Laminasi (Glulam Bamboo) dibandingkan dengan kayu ulin dan struktur baja ringan. Ringkasan Eksekutif: Proses pres hidrolik dan penggunaan resin pengikat ramah lingkungan mampu meningkatkan kuat tarik (Tensile Strength) bambu hingga mencapai 28.000 psi, membuatnya amat layak dipakai pada gedung tinggi tingkat menengah.
    
**Parameter Rekayasa (Engineering Parameter)**
Uji retak rambut (hairline fracture) menunjukkan bambu tidak melengkung secara permanen pada beban mati 10 ton di bentang 4 meter. Rahasianya terletak pada titik persimpangan ruas bambu yang bertindak secara mekanis seperti sabuk struktural di alam.
Dalam aplikasi industri konstruksi berkelanjutan, material perekat *phenolic formaldehyde* yang biasa dipakai saat ini dapat dihindari demi menurunkan dampak gas emisi kimiawi di dalam ruangan.`
  },
  { 
    id: 'pustaka_3', icon: '💹', title: 'Studi Kelayakan Bisnis Kebun Bambu', desc: 'Proyeksi ROI 5 tahun dan Ekspor Karbon', tag: 'Premium E-Book',
    tier: 'Premium', priceRp: 20000, priceBmc: 2.0,
    preview: `E-Book ini menyajikan cetak biru (blueprint) komersial bagi perintis hutan bambu industri berkelanjutan (HBI). Di dalamnya terdapat perhitungan detail Analisis Biaya dan Manfaat (Cost-Benefit Analysis) untuk siklus hidup 5 tahun pertama dengan penekanan pada monetisasi rebung tunas, batang tua, dan sertifikasi Karbon.`,
    fullContent: `E-Book ini menyajikan cetak biru (blueprint) komersial bagi perintis hutan bambu industri berkelanjutan (HBI). Di dalamnya terdapat perhitungan detail Analisis Biaya dan Manfaat (Cost-Benefit Analysis) untuk siklus hidup 5 tahun pertama dengan penekanan pada monetisasi rebung tunas, batang tua, dan sertifikasi Karbon.
    
**Perhitungan Return of Investment (ROI)**
Dengan kepadatan 400 bibit PeTung per-hektar, biaya *land clearing* awal dan irigasi menelan Rp15-20Jt/ha. Pada tahun ke-3, panen tunas muda (rebung) skala komersial dapat menghasilkan margin murni minimum Rp12juta/tahun/hektar tanpa harus membunuh pohon bambu utamanya.

**Ekspor Kredit Karbon**
1 Hektar hutan PeTung dewasa secara resmi dapat dikurasi menjadi penyerot 17 Ton CO2 pertahun. Di platform pasar dagang karbon sukarela *(Voluntary Carbon Market/VCM)* Web3, satuan ini dapat difraksionalisasi mejadi token kredit karbon berkapitalisasi USD15 per Ton-nya.`
  },
  { 
    id: 'pustaka_4', icon: '🌍', title: 'Roadmap Penyerapan Emisi Nasional', desc: 'Strategi pemenuhan target NDC iklim 2030', tag: 'Jurnal Analisis',
    tier: 'Analisis', priceRp: 5000, priceBmc: 0.5,
    preview: `Target Kontribusi Nasional (NDC) mengamanatkan batas penurunan gas rumah kaca secara revolusioner di tahun 2030. Ringkasan Eksekutif: Rencana strategis ini menganalisis potensi integrasi reforestasi desa sabuk hijau *(greenbelt)* melalui klaster bambu sabumi sebagai solusi adaptif dan masif bagi kerusakan ekosistem DAS (Daerah Aliran Sungai).`,
    fullContent: `Target Kontribusi Nasional (NDC) mengamanatkan batas penurunan gas rumah kaca secara revolusioner di tahun 2030. Ringkasan Eksekutif: Rencana strategis ini menganalisis potensi integrasi reforestasi desa sabuk hijau *(greenbelt)* melalui klaster bambu sabumi sebagai solusi adaptif dan masif bagi kerusakan ekosistem DAS (Daerah Aliran Sungai).
    
**Rehabilitasi Daerah Aliran Sungai**
Akar serabut tebal pada bambu berfungsi sebagai penahan laju erosi tebing sungai hingga 70% lebih baik dibanding pepohonan kayu solid dangkal. Pembentukan sistem hidrolis mikro oleh guguran daun bambu mati menciptakan penyeimbang air tanah lokal agar panen air lebih tertahan saat hujan drastis. Penanaman masif di daerah penyangga ini dapat menaikkan metrik *Environmental Performance Index* nasional.`
  },
  { 
    id: 'pustaka_5', icon: '🧵', title: 'Inovasi Tekstil Viscose Bambu', desc: 'Pemintalan serat bambu ke lembaran sutra moden', tag: 'Artikel Dasar',
    tier: 'Basic', priceRp: 3000, priceBmc: 0.3,
    preview: `Proses ekstraksi *bamboo kun*—zat anti-bakteri alami pada sel dinding bambu—menjadi benang murni memberikan kelembutan setara sutra dengan durabilitas katun industri. Di makalah paparan singkat ini ditunjukan siklus pabrikasi penguraian basa dan viskositas perajutan serat.`,
    fullContent: `Proses ekstraksi *bamboo kun*—zat anti-bakteri alami pada sel dinding bambu—menjadi benang murni memberikan kelembutan setara sutra dengan durabilitas katun industri. Di makalah paparan singkat ini ditunjukan siklus pabrikasi penguraian basa dan viskositas perajutan serat.
    
Berbeda drastis dengan budidaya lahan Kapas yang sangat gila air dan memakan puluhan ton liter pestisida berbahaya, kebun komersial tekstil bambu menjanjikan masa depan "Zero-Toxic Agro". Kain hasil jadinya murni memiliki sensasi sedingin air di kulit manusia, serta bersertifikasi uji *hypoallergenic* level klinis.`
  },
  { 
    id: 'pustaka_6', icon: '💎', title: 'Tokenomics Ekonomi Bambu', desc: 'Sistem ekonomi desentralisasi suplai Web3', tag: 'Premium E-Book',
    tier: 'Premium', priceRp: 20000, priceBmc: 2.0,
    preview: `Buku Putih (Whitepaper) eksklusif penjabaran sistem keuangan generasi masa depan untuk sektor riil agrikultura berbasis blockchain. Penjelasan eksekutif mengupas fraksionalitas kepemilikan pohon bambu, insentif staking petani, hingga konversi nyata Token BMC dalam rantai suplai industri ekspor global.`,
    fullContent: `Buku Putih (Whitepaper) eksklusif penjabaran sistem keuangan generasi masa depan untuk sektor riil agrikultura berbasis blockchain. Penjelasan eksekutif mengupas fraksionalitas kepemilikan pohon bambu, insentif staking petani, hingga konversi nyata Token BMC dalam rantai suplai industri ekspor global.
    
**Arsitektur Token dan Pertanian Regeneratif**
Token BMC lahir bukan dari ketiadaan utilitas layaknya Meme Coin, melainkan dipatok oleh komoditas bernilai biologis yang nyata—yakni batang dan akar bambu Sabumi Nusantara di Banten dan sekitarnya. Smart Contract memastikan setiap 1 unit token sejalan siklus hidup hasil panen kebun bambu komunal di mana dana dari investor langsung masuk merawat pohon di lahan kritis tanpa kebocoran perantara tengkulak tengahan.`
  },
];

// ─── GROQ AI ENGINE ─────────────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

const BAMBOO_SYSTEM_PROMPT = `Kamu adalah BambuBot, asisten AI ahli bambu dari Yayasan Sabumi Nusantara Jaya (YSNJ) Indonesia.

PERAN:
- Menjawab semua pertanyaan tentang bambu dalam bahasa Indonesia dengan akurat dan informatif
- Fokus pada: botani, budidaya, ekonomi, konstruksi, tekstil, pangan, lingkungan, dan pasar ekspor bambu
- Selalu menyertakan data angka spesifik, contoh, dan tips praktis

KONTEKS YSNJ:
- Yayasan yang mengembangkan industri bambu Indonesia dari hulu ke hilir
- Lokasi: Serang, Banten — area perkebunan di Cibarani & Cisadane
- Fokus pada bambu Petung (Dendrocalamus asper) dan Moso (Phyllostachys edulis)
- Mengintegrasikan teknologi Web3 (token BMC BEP-20) untuk ekosistem bambu

DATA PENTING:
- Indonesia: 176 spesies bambu Indonesia (Widjaja 2019) dari 1.400 spesies global
- Bambu Petung: tinggi 20-30m, diameter hingga 20cm, panen 3-5 tahun
- Harga ekspor: bambu laminasi USD 800-1.500/m³, flooring USD 15-30/m²
- Serapan karbon: 1 ha bambu = 17 ton CO₂/tahun
- ROI kebun bambu: break even 3-4 tahun, produktif 50-100 tahun

FORMAT JAWABAN:
- Gunakan emoji untuk poin penting
- Gunakan **bold** untuk istilah teknis
- Berikan data angka spesifik bila relevan
- Jawab ringkas tapi komprehensif (maks 300 kata)
- Jika tidak tahu, akui dengan jujur dan sarankan sumber terpercaya

Jangan pernah membuat data palsu. Akui ketidakpastian dengan jelas.`;

const callGroqAI = async (question, history, contextData = '') => {
  const finalPrompt = contextData ? `${BAMBOO_SYSTEM_PROMPT}\n\n=== DATA REAL-TIME PLATFORM ===\n${contextData}` : BAMBOO_SYSTEM_PROMPT;
  const messages = [
    { role: 'system', content: finalPrompt },
    ...history.slice(-6).map(m => ({ role: m.role, content: m.text })),
    { role: 'user', content: question },
  ];

  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.4,
      max_tokens: 600,
    }),
  });

  if (!res.ok) throw new Error(`Groq API error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
};

// Fallback lokal jika tidak ada Groq key
const generateAnswerLocal = (question) => {
  const q = question.toLowerCase();
  for (const entry of BAMBOO_KB) {
    if (entry.keywords.some(kw => q.includes(kw))) return entry.answer;
  }
  if (q.includes('ysnj') || q.includes('yayasan') || q.includes('sabumi')) {
    return `**Yayasan Sabumi Nusantara Jaya (YSNJ)** adalah yayasan yang berfokus pada pengembangan industri bambu Indonesia dari hulu ke hilir.\n\n🎯 **Fokus Utama:**\n- Riset & pengembangan spesies bambu unggul\n- Pendampingan petani & koperasi bambu\n- Koneksi ke pasar ekspor internasional\n- Tokenisasi aset bambu melalui Web3 (Token BMC)\n\n📍 **Lokasi:** Serang, Banten — percontohan di Cibarani & Cisadane`;
  }
  if (q.includes('halo') || q.includes('hai') || q.includes('hello')) {
    return `Halo! 👋 Saya **BambuBot** — asisten AI Bambupedia.\n\nSilakan tanyakan apa saja tentang bambu: spesies, cara tanam, harga pasar, konstruksi, tekstil, atau peluang investasi!`;
  }
  return `Pertanyaan menarik! 🌿 Coba tanyakan tentang:\n- Spesies bambu (petung, moso, apus, hitam)\n- Cara menanam atau memanen bambu\n- Harga dan pasar ekspor bambu\n- Bambu untuk konstruksi atau tekstil\n- Manfaat bambu untuk lingkungan & karbon`;
};

const formatMessage = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
};

// ─── KOMPONEN UTAMA ──────────────────────────────────────────────────────────
const BambupediaPage = () => {
  const { t } = useLanguage();
  const [freeQuota, setFreeQuota] = useState(() => {
    const saved = localStorage.getItem('bambubot_freeQuota');
    return saved !== null ? parseInt(saved, 10) : 3;
  });
  const [paidQuota, setPaidQuota] = useState(() => {
    const saved = localStorage.getItem('bambubot_paidQuota');
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState(10);
  const [isProcessingTx, setIsProcessingTx] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);

  // NFT Article States
  const [ownedNfts, setOwnedNfts] = useState(() => {
    const saved = localStorage.getItem('bambubot_ownedNfts');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [articlePaymentMethod, setArticlePaymentMethod] = useState(null);

  useEffect(() => { localStorage.setItem('bambubot_freeQuota', freeQuota); }, [freeQuota]);
  useEffect(() => { localStorage.setItem('bambubot_paidQuota', paidQuota); }, [paidQuota]);
  useEffect(() => { localStorage.setItem('bambubot_ownedNfts', JSON.stringify(ownedNfts)); }, [ownedNfts]);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `${t('bp_bot_welcome')}\n\n${GROQ_API_KEY && GROQ_API_KEY !== 'PASTE_GROQ_KEY_DISINI' ? t('bp_bot_groq') : t('bp_bot_local')}\n\n${t('bp_bot_prompt')}`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [usingGroq, setUsingGroq] = useState(false);
  const [dynamicContext, setDynamicContext] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Fetch real-time data for Light RAG
  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        let text = "";
        // 1. Projects
        const activeProjects = PROJECTS.filter(p => p.status === 'Berjalan' || p.status_en === 'Active').slice(0, 3);
        if (activeProjects.length > 0) {
          text += "[Proyek Konservasi/Ekologi Berjalan]:\n";
          activeProjects.forEach(p => text += `- ${p.title} (${p.location}): ${p.shortDesc}\n`);
        }
        
        if (db) {
          // 2. Events / Scheduled Meetings
          const eventQ = query(collection(db, "scheduled_meetings"), orderBy("date", "desc"), limit(3));
          const eventSnap = await getDocs(eventQ);
          if (!eventSnap.empty) {
            text += "\n[Event & Meeting Terbaru]:\n";
            eventSnap.forEach(doc => {
              const d = doc.data();
              text += `- ${d.title} (Tanggal: ${d.date}, Peserta: ${d.participants?.length || 0} orang)\n`;
            });
          }

          // 3. Marketplace Products
          const marketQ = query(collection(db, "marketplace_products"), orderBy("createdAt", "desc"), limit(3));
          const marketSnap = await getDocs(marketQ);
          if (!marketSnap.empty) {
            text += "\n[Produk Marketplace Terbaru]:\n";
            marketSnap.forEach(doc => {
              const d = doc.data();
              text += `- ${d.name} (Harga: Rp${d.priceIdr}, Kategori: ${d.category})\n`;
            });
          }
        }
        setDynamicContext(text);
      } catch (err) {
        console.error("Failed to fetch dynamic context for RAG:", err);
      }
    };
    fetchKnowledge();
  }, []);

  useEffect(() => {
    if (GROQ_API_KEY && GROQ_API_KEY !== 'PASTE_GROQ_KEY_DISINI') {
      setUsingGroq(true);
    }
  }, []);

  useEffect(() => {
    // Only scroll into view if there is more than the initial message
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Ensure page starts at the top when navigating to this page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const sendMessage = async (text) => {
    const question = text || input.trim();
    if (!question || isTyping) return;

    // --- Cek Kuota AKSES ---
    const totalQuota = freeQuota + paidQuota;
    if (totalQuota <= 0) {
      setShowPaymentModal(true);
      return;
    }

    // Kurangi kuota
    if (freeQuota > 0) setFreeQuota(prev => prev - 1);
    else setPaidQuota(prev => prev - 1);

    const newMessages = [...messages, { role: 'user', text: question }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      let answer;
      if (usingGroq) {
        answer = await callGroqAI(question, messages, dynamicContext);
      } else {
        // Simulasi delay untuk UX yang natural
        await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
        answer = generateAnswerLocal(question);
      }
      setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
    } catch (err) {
      console.error('BambuBot error:', err);
      const fallback = generateAnswerLocal(question);
      setMessages(prev => [...prev, { role: 'assistant', text: fallback }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ paddingTop: '160px', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <div className="container" style={{ padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '2.8rem', color: 'var(--text-main)', marginBottom: '12px' }}>
            <img src={getAssetUrl('logos/bmc2.png')} alt="Logo" style={{ height: '45px', objectFit: 'contain' }} />
            {t('bp_title')}
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
            {t('bp_subtitle')}
          </p>

        </div>

        {/* Tab Switcher - HERO BUTTONS STYLE */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
          <button 
            onClick={() => {
              setActiveTab('chat');
              setTimeout(() => {
                document.getElementById('bambubot-chat-area')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '24px', cursor: 'pointer', fontWeight: '800', fontSize: '0.95rem', transition: 'all 0.3s',
              background: activeTab === 'chat' ? 'var(--primary)' : 'var(--bg-card)',
              color: activeTab === 'chat' ? 'white' : 'var(--text-main)',
              boxShadow: activeTab === 'chat' ? '0 10px 20px rgba(12,166,120,0.2)' : '0 4px 12px rgba(0,0,0,0.05)',
              minWidth: '180px', justifyContent: 'center',
              border: activeTab === 'chat' ? 'none' : '1px solid var(--border-color)'
            }}>
            <MessageSquare size={18} /> {t('bp_tab_chat')}
          </button>
          
          <button 
            onClick={() => setActiveTab('library')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '24px', cursor: 'pointer', fontWeight: '800', fontSize: '0.95rem', transition: 'all 0.3s',
              background: activeTab === 'library' ? 'var(--primary)' : 'var(--bg-card)',
              color: activeTab === 'library' ? 'white' : 'var(--text-main)',
              boxShadow: activeTab === 'library' ? '0 10px 20px rgba(12,166,120,0.2)' : '0 4px 12px rgba(0,0,0,0.05)',
              minWidth: '180px', justifyContent: 'center',
              border: activeTab === 'library' ? 'none' : '1px solid var(--border-color)'
            }}>
            <BookOpen size={18} /> {t('bp_tab_library')}
          </button>

          <button 
            onClick={() => navigate('/bambupedia/tracker')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '24px', cursor: 'pointer', fontWeight: '800', fontSize: '0.95rem', transition: 'all 0.3s',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              minWidth: '180px', justifyContent: 'center',
              border: '1px solid var(--border-color)'
            }}>
            <Sprout size={18} color="var(--primary)" /> {t('bp_tab_tracker')}
          </button>

          <button 
            onClick={() => navigate('/bambupedia/knowledge')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '24px', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: '800', fontSize: '0.95rem', transition: 'all 0.3s',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              minWidth: '180px', justifyContent: 'center'
            }}>
            <UploadCloud size={18} color="var(--primary)" /> {t('bp_tab_upload')}
          </button>

          <button 
            onClick={() => navigate('/bambupedia/bambubot')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '24px', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: '800', fontSize: '0.95rem', transition: 'all 0.3s',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              minWidth: '180px', justifyContent: 'center'
            }}>
            <Bot size={18} color="var(--primary)" /> {t('bp_tab_rag')}
          </button>
        </div>

        {/* ── TAB CHAT ── */}
        {activeTab === 'chat' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 320px', 
            gap: '24px', 
            alignItems: 'start' 
          }}>

            {/* Chat Window */}
            <div id="bambubot-chat-area" style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', order: window.innerWidth < 768 ? 1 : 1 }}>
              {/* Chat Header */}
              <div style={{ background: 'linear-gradient(135deg, #0ca678, #2b8a3e)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={getAssetUrl('logos/bmc10.png')} alt="BambuBot" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: 'white', fontSize: '1rem' }}>BambuBot</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>{t('bp_bot_status_online')}</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', color: 'white', fontWeight: '600' }}>
                    {freeQuota > 0 ? t('bp_bot_quota_free').replace('{quota}', freeQuota) : t('bp_bot_quota_paid').replace('{quota}', paidQuota)}
                  </div>
                  {(freeQuota + paidQuota === 0) && (
                     <button onClick={() => setShowPaymentModal(true)} style={{ background: '#ffca28', border: 'none', color: '#333', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>{t('bp_bot_topup')}</button>
                  )}
                  <div style={{ width: '10px', height: '10px', background: '#69db7c', borderRadius: '50%', boxShadow: '0 0 0 3px rgba(105,219,124,0.3)', marginLeft: '4px' }} />
                </div>
              </div>

              {/* Messages */}
              <div style={{ height: '450px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    {msg.role === 'assistant' && (
                      <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #0ca678, #2b8a3e)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                        <img src={getAssetUrl('logos/bmc10.png')} alt="BambuBot" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                      </div>
                    )}
                    <div style={{
                      maxWidth: '75%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: msg.role === 'user' ? 'linear-gradient(135deg, #0ca678, #2b8a3e)' : 'var(--bg-secondary)',
                      color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                      fontSize: '0.88rem', lineHeight: '1.6',
                    }}
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                    />
                  </div>
                ))}

                {isTyping && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #0ca678, #2b8a3e)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img src={getAssetUrl('logos/bmc10.png')} alt="BambuBot" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                    </div>
                    <div style={{ background: '#f1f3f5', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                      {[0, 1, 2].map(j => (
                        <div key={j} style={{ width: '7px', height: '7px', background: '#adb5bd', borderRadius: '50%', animation: `bounce 1s ${j * 0.2}s infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f3f5', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('bp_bot_placeholder')}
                  rows={1}
                  style={{ flex: 1, border: '1px solid #dee2e6', borderRadius: '12px', padding: '10px 14px', fontSize: '0.9rem', resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: '1.5' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
                />
                <button onClick={() => sendMessage()}
                  style={{ width: '44px', height: '44px', background: 'var(--primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Send size={18} color="white" />
                </button>
              </div>
            </div>

            {/* Sidebar: Pertanyaan Cepat */}
            <div style={{ order: window.innerWidth < 768 ? 2 : 2 }}>
              <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px', color: 'var(--text-main)' }}>{t('bp_quick_questions')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button key={i} onClick={() => {
                      sendMessage(q);
                      document.getElementById('bambubot-chat-area')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                      style={{ padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(12,166,120,0.06)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}>
                      <Leaf size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #0ca678, #2b8a3e)', borderRadius: '16px', padding: '20px', color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌿</div>
                <div style={{ fontWeight: '700', marginBottom: '6px' }}>{t('bp_stat_title')}</div>
                <div style={{ fontSize: '0.82rem', opacity: 0.85 }}>{t('bp_stat_desc')}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB PUSTAKA BAMBU (NFT) ── */}
        {activeTab === 'library' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {PUSTAKA_ITEMS.map((a, i) => {
              const isOwned = ownedNfts.includes(a.id);
              return (
                <div key={i} style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(12,166,120,0.1)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                  onClick={() => { setSelectedArticle(a); setShowArticleModal(true); setArticlePaymentMethod(null); setTxSuccess(false); }}>
                  
                  {isOwned && (
                    <div style={{ position: 'absolute', top: 0, right: 0, background: 'linear-gradient(135deg, #FFD700, #FDB931)', color: '#000', fontSize: '0.6rem', fontWeight: '900', padding: '6px 24px', transform: 'rotate(45deg) translate(25%, -20%)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', letterSpacing: '1px' }}>
                      VERIFIED NFT
                    </div>
                  )}
                  
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{a.icon}</div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', padding: '3px 10px', borderRadius: '20px' }}>{a.tag}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', background: '#f1f3f5', color: '#495057', padding: '3px 10px', borderRadius: '20px' }}>{a.tier}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', margin: '4px 0 8px' }}>{a.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>{a.desc}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed #eee', paddingTop: '12px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: isOwned ? 'var(--primary)' : '#495057' }}>
                      {isOwned ? 'Milik Anda' : `Rp ${(a.priceRp/1000).toFixed(0)}k / ${a.priceBmc} BMC`}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>
                      {isOwned ? 'Baca Penuh' : 'Buka Kunci'} <ChevronRight size={15} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ── MODAL PEMBAYARAN ── */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(12,166,120,0.4)', borderRadius: '24px', width: '100%', maxWidth: '450px', padding: '32px', boxShadow: '0 24px 48px rgba(12,166,120,0.2)', position: 'relative' }}>
            <button onClick={() => { setShowPaymentModal(false); setPaymentMethod(null); setTxSuccess(false); }} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#868e96' }}>✕</button>
            
            {!paymentMethod && !txSuccess && (
              <>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ width: '60px', height: '60px', background: 'rgba(12,166,120,0.1)', border: '1px solid rgba(12,166,120,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <BookOpen size={28} color="var(--primary)" />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Batas Akses Terlampaui</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Anda telah menggunakan semua kuota gratis. Lakukan *top-up* untuk melanjutkan sesi tanya-jawab.</p>
                </div>
                
                <button onClick={() => setPaymentMethod('bank')} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.6)', border: '2px solid rgba(12,166,120,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(12,166,120,0.1)'}>
                  <div style={{ width: '48px', height: '48px', background: '#e7f5ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Landmark size={24} color="#1c7ed6" /></div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1.05rem' }}>Transfer Bank BRI</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rp 1.000 / Akses • Manual Verifikasi</div>
                  </div>
                  <ArrowRight style={{ marginLeft: 'auto', color: '#adb5bd' }} />
                </button>
                
                <button onClick={() => setPaymentMethod('bmc')} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.6)', border: '2px solid rgba(12,166,120,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(12,166,120,0.1)'}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(12,166,120,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wallet size={24} color="var(--primary)" /></div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1.05rem' }}>BMC Token (Web3)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Diskon Khusus Bundling • Otomatis</div>
                  </div>
                  <ArrowRight style={{ marginLeft: 'auto', color: '#adb5bd' }} />
                </button>
              </>
            )}

            {paymentMethod === 'bank' && !txSuccess && (
              <>
                <button onClick={() => setPaymentMethod(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>← Kembali</button>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px', color: 'var(--text-main)' }}>Transfer Bank</h3>
                
                <div style={{ background: 'rgba(255,255,255,0.5)', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px dashed rgba(12,166,120,0.3)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Bank Tujuan</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1c7ed6', marginBottom: '12px' }}>BRI (Bank Rakyat Indonesia)</div>
                  
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Nomor Rekening</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--text-main)', marginBottom: '12px', letterSpacing: '2px' }}>141101000456562</div>
                  
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Atas Nama</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>YAYASAN SABUMI NUSANTARA JAYA</div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '8px', color: 'var(--text-main)' }}>Ingin membeli berapa akses? (Rp 1.000/akses)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="number" min="1" value={purchaseAmount} onChange={e => setPurchaseAmount(parseInt(e.target.value) || 1)} style={{ width: '80px', padding: '12px', borderRadius: '10px', border: '1px solid #dee2e6', fontSize: '1.1rem', textAlign: 'center', background: 'white' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Akses</span>
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '1.05rem', color: 'var(--primary)', fontWeight: 'bold' }}>Total Transfer: Rp {(purchaseAmount * 1000).toLocaleString('id-ID')}</div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <a href={`https://wa.me/628174139994?text=Halo%20Admin%2C%20saya%20telah%20mentransfer%20Rp%20${purchaseAmount * 1000}%20ke%20rekening%20BRI%20Yayasan%20Sabumi%20Nusantara%20Jaya%20untuk%20top-up%20akses%20BambuBot.`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '14px', background: '#25D366', color: 'white', textAlign: 'center', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
                    Konfirmasi WhatsApp
                  </a>
                  <button onClick={() => {
                    setPaidQuota(prev => prev + purchaseAmount);
                    setTxSuccess(true);
                    setTimeout(() => { setShowPaymentModal(false); setPaymentMethod(null); setTxSuccess(false); }, 3000);
                  }} style={{ padding: '14px', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }} title="Hanya untuk demo">Simulasi ACC</button>
                </div>
              </>
            )}

            {paymentMethod === 'bmc' && !txSuccess && (
              <>
                <button onClick={() => setPaymentMethod(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>← Kembali</button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>Bayar dengan BMC</h3>
                  <div style={{ background: 'rgba(12,166,120,0.15)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(12,166,120,0.3)' }}>1 BMC = Rp 10.000</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '10px' }}>
                  {[
                    { bmc: 1, accesses: 10, price: 'Rp 10.000', label: 'Starter' },
                    { bmc: 5, accesses: 50, price: 'Rp 45.000', label: 'Pro', badge: 'Diskon Rp 5k' },
                    { bmc: 10, accesses: 100, price: 'Rp 80.000', label: 'Ahli', badge: 'Hemat Rp 20k' },
                  ].map((pkg, i) => (
                    <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.6)', border: '2px solid rgba(12,166,120,0.15)', borderRadius: '16px', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {pkg.badge && <span style={{ position: 'absolute', top: '-10px', left: '16px', background: '#ffca28', color: '#333', fontSize: '0.7rem', fontWeight: 'bold', padding: '3px 10px', borderRadius: '10px' }}>{pkg.badge}</span>}
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>{pkg.label} Bundle</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>{pkg.accesses} Akses</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Setara {pkg.price}</div>
                      </div>
                      <button 
                        onClick={async () => {
                          setIsProcessingTx(true);
                          await new Promise(r => setTimeout(r, 1500));
                          setPaidQuota(prev => prev + pkg.accesses);
                          setIsProcessingTx(false);
                          setTxSuccess(true);
                          setTimeout(() => { setShowPaymentModal(false); setPaymentMethod(null); setTxSuccess(false); }, 3000);
                        }}
                        disabled={isProcessingTx}
                        style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #0ca678, #2b8a3e)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: isProcessingTx ? 'wait' : 'pointer', opacity: isProcessingTx ? 0.7 : 1 }}>
                        {isProcessingTx ? 'Loading...' : `${pkg.bmc} BMC`}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {txSuccess && (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle size={64} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Pembayaran Sukses!</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Kuota akses telah ditambahkan. Selamat mengeksplorasi kembali Bambupedia.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL NFT ARTICLE VIEWER ── */}
      {showArticleModal && selectedArticle && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}>
            
            {/* Header Modal */}
            <div style={{ background: 'var(--primary)', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '2rem' }}>{selectedArticle.icon}</div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{selectedArticle.tag}</div>
                  <h2 style={{ color: 'white', fontSize: '1.2rem', margin: 0 }}>{selectedArticle.title}</h2>
                </div>
              </div>
              <button onClick={() => { setShowArticleModal(false); setSelectedArticle(null); setArticlePaymentMethod(null); setTxSuccess(false); }} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>✕</button>
            </div>

            {ownedNfts.includes(selectedArticle.id) ? (
              // ── KONTEN TERBUKA (OWNED) ──
              <div style={{ padding: '40px' }}>
                <div style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', boxShadow: '0 4px 12px rgba(253, 185, 49, 0.3)' }}>
                  <CheckCircle size={24} color="#000" />
                  <div>
                    <div style={{ fontWeight: '900', fontSize: '1.1rem', color: '#000' }}>Verified NFT Asset</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.7)' }}>Sertifikat kepemilikan tercatat aman. Hak akses penuh atas kekayaan intelektual ini ada pada Anda.</div>
                  </div>
                </div>

                <div style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                  {selectedArticle.fullContent}
                </div>
              </div>
            ) : (
              // ── KONTEN TERKUNCI (PAYWALL) ──
              <div style={{ padding: '40px', position: 'relative' }}>
                <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-main)', marginBottom: '20px' }}>
                  <span style={{ fontWeight: 'bold' }}>Executive Summary:</span><br/>
                  {selectedArticle.preview}
                </div>
                
                {/* Efek Blur */}
                <div style={{ position: 'relative' }}>
                  <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-main)', filter: 'blur(5px)', userSelect: 'none', opacity: 0.4 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </div>
                  
                  {/* Overlay Paywall */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '500px', background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', textAlign: 'center', border: '1px solid #eee' }}>
                    
                    {!articlePaymentMethod && !txSuccess && (
                      <>
                        <div style={{ width: '64px', height: '64px', background: 'rgba(12,166,120,0.1)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BookOpen size={32} color="var(--primary)" />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>Eksklusif & Terlindungi</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                          Buka kunci dokumen ini dengan menjadikannya NFT (*Minting*) berlisensi milik Anda untuk perlindungan Anti-Plagiasi penuh.
                        </p>
                        
                        <button onClick={() => setArticlePaymentMethod('bank')} style={{ width: '100%', padding: '16px', background: 'white', border: '2px solid #e9ecef', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                          <div style={{ width: '48px', height: '48px', background: '#e7f5ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Landmark size={24} color="#1c7ed6" /></div>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1.05rem' }}>Transfer Bank BRI</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rp {(selectedArticle.priceRp).toLocaleString('id-ID')} • Hubungi Admin</div>
                          </div>
                          <ArrowRight style={{ marginLeft: 'auto', color: '#adb5bd' }} />
                        </button>

                        <button onClick={() => setArticlePaymentMethod('bmc')} style={{ width: '100%', padding: '16px', background: 'white', border: '2px solid #e9ecef', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>
                          <div style={{ width: '48px', height: '48px', background: 'rgba(12,166,120,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wallet size={24} color="var(--primary)" /></div>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1.05rem' }}>Mint dengan BMC Token</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedArticle.priceBmc} BMC • Otomatis</div>
                          </div>
                          <ArrowRight style={{ marginLeft: 'auto', color: '#adb5bd' }} />
                        </button>
                      </>
                    )}

                    {articlePaymentMethod === 'bank' && !txSuccess && (
                      <>
                        <button onClick={() => setArticlePaymentMethod(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>← Kembali</button>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px' }}>Transfer Bank Manual</h3>
                        
                        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px dashed #dee2e6' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Tagihan Dokumen "{selectedArticle.tier}"</div>
                          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '20px' }}>Rp {(selectedArticle.priceRp).toLocaleString('id-ID')}</div>

                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Bank Tujuan</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c7ed6', marginBottom: '12px' }}>BRI (Bank Rakyat Indonesia)</div>
                          
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Nomor Rekening</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--text-main)', marginBottom: '12px', letterSpacing: '2px' }}>141101000456562</div>
                          
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Atas Nama</div>
                          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>YAYASAN SABUMI NUSANTARA JAYA</div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <a href={`https://wa.me/628174139994?text=Halo%20Admin%2C%20saya%20telah%20mentransfer%20Rp%20${selectedArticle.priceRp}%20ke%20rekening%20BRI%20yayasan%20untuk%20Dokumen%20NFT:%20${encodeURIComponent(selectedArticle.title)}.`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '14px', background: '#25D366', color: 'white', textAlign: 'center', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none' }}>
                            Konfirmasi Admin
                          </a>
                          <button onClick={() => {
                            setOwnedNfts(prev => [...prev, selectedArticle.id]);
                            setTxSuccess(true);
                            setTimeout(() => { setTxSuccess(false); }, 3000); // Balik nampilin layar utuh
                          }} style={{ padding: '14px', background: '#f1f3f5', color: '#adb5bd', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Simulasi ACC</button>
                        </div>
                      </>
                    )}

                    {articlePaymentMethod === 'bmc' && !txSuccess && (
                      <>
                        <button onClick={() => setArticlePaymentMethod(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>← Kembali</button>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>Koneksi Web3 Wallet</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Dokumen akan di-*minting* di atas jaringan blockchain Bamboom network (Simulasi).</p>

                        <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '16px', marginBottom: '24px', border: '2px solid rgba(12,166,120,0.2)' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Total Biaya Minting</div>
                          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Leaf size={28} /> {selectedArticle.priceBmc} BMC
                          </div>
                        </div>

                        <button 
                          onClick={async () => {
                            setIsProcessingTx(true);
                            await new Promise(r => setTimeout(r, 2000));
                            setOwnedNfts(prev => [...prev, selectedArticle.id]);
                            setIsProcessingTx(false);
                            setTxSuccess(true);
                            setTimeout(() => { setTxSuccess(false); }, 2500);
                          }}
                          disabled={isProcessingTx}
                          style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #0ca678, #2b8a3e)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 'bold', cursor: isProcessingTx ? 'wait' : 'pointer', opacity: isProcessingTx ? 0.7 : 1 }}>
                          {isProcessingTx ? 'Minting NFT...' : 'Lanjutkan Pembayaran Web3'}
                        </button>
                      </>
                    )}

                    {txSuccess && (
                      <div style={{ padding: '20px 0' }}>
                        <CheckCircle size={64} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Minting Sukses!</h3>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Dokumen kini terenkripsi sebagai NFT milik Anda.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default BambupediaPage;
