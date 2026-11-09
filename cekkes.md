# PROMPT.MD --- Pengembangan ceKKes di BaMbooChain.id

> **Peran Anda:** Bertindak sebagai autonomous senior product engineer,
> software architect, UI/UX designer, AI engineer, data engineer,
> security engineer, dan QA lead. Bangun fitur **ceKKes** sebagai salah
> satu halaman/modul terintegrasi di platform **BaMbooChain.id**. Jangan
> membuat aplikasi terpisah atau merombak fitur yang sudah berjalan.

## 1. Visi Produk

Bangun **ceKKes (Cek Kesehatan)**, platform pemantauan dan pengelolaan
data biologis berbantuan AI untuk tiga domain:

1.  **Manusia** --- profil biologis, catatan kesehatan, kebugaran,
    kebutuhan, pengingat, dan rekomendasi perawatan.
2.  **Hewan** --- identitas, spesies/ras, umur atau estimasi umur,
    kondisi, vaksinasi, nutrisi, perilaku, habitat, dan riwayat
    perawatan.
3.  **Tumbuhan** --- identitas spesies/varietas, umur atau fase tumbuh,
    kondisi tanaman, kebutuhan air/nutrisi/cahaya, penyakit/hama,
    lingkungan, dan rekomendasi budidaya.

Visi jangka panjang: membangun **living biological knowledge database**
yang terus diperbarui melalui input pengguna, tenaga profesional,
sensor/IoT, sumber pengetahuan terverifikasi, serta AI agents yang
bekerja secara terkoordinasi dan dapat diaudit.

**Tagline yang disarankan:** "Kenali. Pantau. Rawat."

CeKKes harus terasa sebagai bagian alami dari BaMbooChain: gunakan
sistem autentikasi, navigasi, design system, komponen, API, dan pola
deployment yang sudah ada.

## 2. Instruksi Utama Sebelum Coding

Lakukan discovery terhadap repository dan aplikasi yang sedang berjalan
sebelum mengubah kode.

1.  Periksa struktur project, framework, bahasa, package manager,
    routing, autentikasi, database, API, design system, deployment, dan
    pola penamaan.
2.  Identifikasi halaman dashboard dan modul yang paling mirip untuk
    dijadikan acuan.
3.  Periksa apakah sudah tersedia layanan AI, upload media, penyimpanan
    file, notifikasi, role/permission, atau integrasi blockchain.
4.  Buat rencana implementasi singkat dan daftar file yang akan
    dibuat/diubah.
5.  Pertahankan kompatibilitas dengan aplikasi yang ada. Jangan
    mengganti framework, database, autentikasi, atau konfigurasi
    deployment tanpa alasan teknis kuat dan persetujuan.
6.  Jangan menghapus atau mengubah perilaku fitur BaMbooChain yang sudah
    ada.
7.  Bila backend belum tersedia, buat UI dengan mock data yang jelas
    diberi label **DEMO**, siapkan interface/service layer dan
    dokumentasikan endpoint yang dibutuhkan. Jangan berpura-pura bahwa
    data demo adalah data nyata.
8.  Gunakan environment variables untuk secret dan API keys. Jangan
    menaruh kredensial di source code.
9.  Implementasikan secara bertahap, jalankan lint, typecheck, test, dan
    build yang tersedia. Perbaiki error sebelum menyatakan selesai.

## 3. Batas Ilmiah dan Keselamatan --- Wajib Dipatuhi

CeKKes bukan alat diagnosis medis otomatis dan bukan pengganti dokter,
dokter hewan, ahli pertanian, atau ahli botani.

### 3.1 Pisahkan identifikasi dari pemeriksaan kesehatan

-   Retina/iris, sidik jari, dan suara pada manusia dapat
    dipertimbangkan sebagai **modalitas verifikasi identitas** setelah
    evaluasi akurasi, keamanan, anti-spoofing, dan kepatuhan hukum.
-   Pemindaian biometrik identitas tidak otomatis menunjukkan penyakit,
    kondisi organ, usia biologis, atau status kesehatan.
-   Bedakan secara eksplisit **retina** (bagian belakang mata) dan
    **iris** (pola bagian berwarna pada mata). Jangan menyebut keduanya
    sebagai teknologi yang sama.
-   Jangan mengklaim bahwa sidik jari atau voiceprint dapat mendiagnosis
    penyakit atau menentukan usia seseorang.
-   Analisis suara untuk gejala tertentu hanya boleh ditampilkan bila
    menggunakan model yang tervalidasi untuk indikasi spesifik, populasi
    yang sesuai, dan disertai batasan serta rujukan profesional.
-   Pemeriksaan retina untuk kondisi medis harus menggunakan perangkat
    dan alur klinis yang sesuai serta interpretasi tenaga kesehatan
    berwenang.

### 3.2 Modalitas per domain

  -------------------------------------------------------------------------
  Domain                  Identifikasi yang         Data kondisi dan
                          realistis                 kesehatan
  ----------------------- ------------------------- -----------------------
  Manusia                 Akun terverifikasi;       Input pengguna, catatan
                          biometrik opsional dan    pemeriksaan, perangkat
                          berbasis persetujuan,     kesehatan tervalidasi,
                          misalnya sidik            hasil laboratorium, dan
                          jari/iris/suara           tenaga medis

  Hewan                   Microchip/RFID, tag, foto Foto/video, berat, suhu
                          ciri fisik, identitas     dan parameter yang
                          pemilik; pengenalan       sesuai spesies, catatan
                          visual hanya jika         dokter hewan,
                          tervalidasi               vaksinasi, pakan,
                                                    perilaku, lingkungan

  Tumbuhan                QR/NFC/tag, lokasi, nomor Foto berkala, sensor
                          inventaris, citra         kelembapan
                          daun/batang/bunga/buah;   tanah/suhu/cahaya,
                          pengenalan spesies        pertumbuhan, gejala
                          berbasis foto dengan      visual, catatan
                          confidence                budidaya dan
                                                    pemeriksaan ahli
  -------------------------------------------------------------------------

Jangan memaksakan retina, sidik jari, atau voiceprint untuk hewan dan
tumbuhan. Untuk tanaman, gunakan **plant profile/phenotyping** (citra,
ciri morfologi, lokasi, sensor, dan catatan pertumbuhan), bukan
biometrik manusia.

### 3.3 Output AI

Setiap hasil AI harus menampilkan: - jenis analisis dan data yang
digunakan; - waktu analisis dan versi model/sumber pengetahuan bila
tersedia; - tingkat keyakinan atau kualitas data, bukan angka kepastian
palsu; - penjelasan singkat dan faktor yang memengaruhi hasil; -
rekomendasi tindakan aman; - kapan perlu konsultasi profesional; -
disclaimer bila hasil belum tervalidasi.

Jika data tidak cukup, jawab **"Data belum cukup untuk menilai"**, bukan
membuat kesimpulan.

Untuk tanda bahaya, tampilkan instruksi mencari bantuan
profesional/layanan darurat yang relevan. Jangan memberikan diagnosis
pasti, resep obat, dosis, atau instruksi tindakan berisiko tanpa
otorisasi profesional.

## 4. Pengguna dan Hak Akses

Rancang role-based access control yang sesuai dengan sistem akun
BaMbooChain:

-   **Member/Owner:** mengelola profil dirinya, hewan peliharaan, atau
    tanaman miliknya.
-   **Caregiver/Family:** akses terbatas berdasarkan undangan dan
    persetujuan pemilik.
-   **Doctor/Health Professional:** akses hanya pada data manusia yang
    disetujui dan sesuai kewenangan.
-   **Veterinarian:** akses pada profil hewan yang diotorisasi.
-   **Agronomist/Botanist:** akses pada profil tanaman/area yang
    diotorisasi.
-   **Researcher:** hanya mengakses dataset yang telah
    dianonimkan/diagregasi dan memiliki dasar penggunaan yang sah.
-   **Administrator:** mengelola platform dan audit, bukan otomatis
    bebas membaca semua data sensitif.
-   **AI Agent:** hanya memperoleh akses minimum yang dibutuhkan untuk
    tugas tertentu, dengan policy enforcement.

Jangan mengasumsikan bahwa login BaMbooChain berarti pengguna otomatis
menyetujui pengumpulan data kesehatan atau biometrik.

## 5. Struktur Navigasi dan Halaman ceKKes

Tambahkan entry **ceKKes** ke navigasi BaMbooChain dengan route
mengikuti pola proyek. Jika tidak ada pola khusus, gunakan `/cekkes`.

Buat halaman utama yang responsif untuk desktop, tablet, dan mobile.

### 5.1 Dashboard ceKKes

Tampilkan: - Header: logo/nama **ceKKes**, tagline "Kenali. Pantau.
Rawat." - Ringkasan jumlah profil manusia, hewan, dan tumbuhan milik
pengguna. - Kartu status pemantauan: perlu perhatian, jadwal perawatan,
data terbaru, dan aktivitas AI. - Tombol utama: **Tambah Profil**,
**Periksa dengan AI**, **Lihat Riwayat**. - Feed aktivitas terbaru dan
notifikasi. - Penjelasan singkat bahwa hasil AI bersifat informatif dan
bukan diagnosis.

### 5.2 Tiga kategori utama

Buat tab/kartu: - **Manusia** - **Hewan** - **Tumbuhan**

Setiap kategori memiliki: - daftar profil; - pencarian dan filter; -
tambah profil; - detail profil; - riwayat kondisi; - jadwal perawatan; -
rekomendasi AI; - pengaturan izin akses.

### 5.3 Form tambah profil

**Manusia** - nama panggilan/nama tampilan; - tanggal lahir (opsional;
jangan menebak); - jenis kelamin (opsional); - tinggi/berat
(opsional); - golongan darah (opsional dan hanya jika diketahui); -
alergi, kondisi yang dinyatakan pengguna, obat yang sedang digunakan
(opsional); - kontak darurat (opsional); - persetujuan terpisah untuk
setiap jenis data sensitif.

**Hewan** - nama; - spesies, ras/jenis; - tanggal lahir atau estimasi
umur dengan penanda "perkiraan"; - jenis kelamin; - berat; - nomor
microchip/RFID (opsional); - pemilik/penanggung jawab; - riwayat
vaksinasi, kondisi, alergi, pakan, dan dokter hewan (opsional).

**Tumbuhan** - nama lokal; - nama ilmiah (jika diketahui); -
varietas/kultivar; - tanggal tanam atau estimasi umur; -
lokasi/koordinat (opsional); - media tanam; - intensitas cahaya; -
kebutuhan air/nutrisi; - foto awal; - pemilik/pengelola.

Jangan meminta data yang tidak diperlukan. Sediakan "Lewati" untuk kolom
opsional.

### 5.4 Detail profil

Gunakan tab: 1. **Ringkasan** --- identitas, status data, kondisi
terbaru. 2. **Kesehatan/Kondisi** --- catatan pemeriksaan dan observasi.
3. **Kebutuhan** --- kebutuhan biologis, nutrisi, lingkungan, dan
perawatan. 4. **Riwayat** --- timeline kejadian, pengukuran, tindakan,
dan perubahan. 5. **AI Insights** --- ringkasan dan rekomendasi dengan
sumber serta confidence. 6. **Dokumen & Media** --- foto, dokumen, hasil
pemeriksaan. 7. **Akses & Privasi** --- persetujuan, anggota yang diberi
akses, unduh/hapus data.

Jangan menyamakan status "sehat" dengan tidak adanya catatan penyakit.
Gunakan status seperti "Belum dinilai", "Data terbaru tersedia", "Perlu
tindak lanjut", atau status lain yang didukung data.

## 6. AI Multi-Agent System

Bangun arsitektur agentic yang modular. Agent bukan sekadar chatbot;
setiap agent harus memiliki tugas, tools, izin, input/output
terstruktur, batas tindakan, dan audit log.

### 6.1 Daftar agent

1.  **Orchestrator Agent**
    -   memahami permintaan pengguna;
    -   memilih agent spesialis;
    -   memecah tugas menjadi langkah;
    -   menggabungkan hasil;
    -   memastikan policy dan izin sebelum eksekusi.
2.  **Profile Agent**
    -   membantu membuat dan memperbarui profil;
    -   memeriksa kelengkapan dan konsistensi;
    -   meminta klarifikasi jika ada konflik data.
3.  **Human Health Information Agent**
    -   merangkum data kesehatan yang dimasukkan pengguna;
    -   menjelaskan istilah umum;
    -   menyusun pertanyaan untuk konsultasi;
    -   tidak mendiagnosis atau meresepkan.
4.  **Animal Care Agent**
    -   mengolah profil spesies/ras, berat, usia, vaksinasi, pakan,
        perilaku, dan catatan dokter hewan;
    -   memberi edukasi perawatan berbasis sumber;
    -   menandai red flags untuk dokter hewan.
5.  **Plant Health Agent**
    -   membantu identifikasi spesies dari foto dengan confidence;
    -   mengamati gejala visual;
    -   menggabungkan data lingkungan dan sensor;
    -   memberi saran budidaya yang mempertimbangkan spesies dan lokasi.
6.  **Biometric Verification Agent**
    -   hanya untuk verifikasi identitas manusia bila fitur diaktifkan;
    -   memakai vendor/engine biometrik khusus, bukan meminta LLM
        menilai gambar biometrik;
    -   mendukung liveness/anti-spoofing, consent, fallback
        non-biometrik, dan audit;
    -   tidak menghasilkan diagnosis kesehatan.
7.  **Sensor & IoT Agent**
    -   menerima data sensor yang terdaftar;
    -   memvalidasi format, unit, timestamp, kalibrasi, dan anomali;
    -   memberi label kualitas data.
8.  **Risk & Alert Agent**
    -   mengidentifikasi pola yang perlu ditinjau;
    -   memberi tingkat prioritas berdasarkan aturan tervalidasi;
    -   mengirim notifikasi sesuai preferensi pengguna;
    -   tidak melakukan tindakan medis/veteriner otomatis.
9.  **Knowledge & Evidence Agent**
    -   mencari sumber pengetahuan yang disetujui;
    -   mengutamakan sumber pemerintah, universitas, jurnal ilmiah,
        pedoman klinis, dan organisasi profesional;
    -   menyimpan sumber, tanggal, dan kutipan/tautan;
    -   membedakan bukti kuat, terbatas, dan belum diketahui.
10. **Care Plan Agent**
    -   menyusun pengingat dan rencana perawatan yang dapat diedit;
    -   tidak menjalankan tindakan berisiko atau mengubah terapi tanpa
        persetujuan profesional/pemilik.
11. **Privacy & Governance Agent**
    -   memeriksa consent, tujuan pemrosesan, role, retensi, dan akses;
    -   memblokir permintaan yang tidak diizinkan;
    -   menyediakan alur koreksi, ekspor, dan penghapusan data.
12. **Audit & Quality Agent**
    -   mencatat siapa/agent apa melakukan tindakan, kapan, data apa
        yang digunakan, dan hasilnya;
    -   mendeteksi kegagalan, data drift, dan output yang tidak sesuai
        policy.

### 6.2 Tingkat otonomi

**Boleh otomatis:** - validasi format dan kelengkapan data; -
klasifikasi kategori profil; - membuat ringkasan dari data yang sudah
diizinkan; - menyarankan pengingat yang dapat diedit; - mengirim
notifikasi yang sudah disetujui; - mendeteksi data duplikat untuk
ditinjau.

**Wajib konfirmasi pengguna:** - menyimpan atau membagikan data
sensitif; - menghubungkan perangkat/sensor baru; - mengubah profil
penting; - mengirim data ke pihak ketiga; - menghapus atau mengekspor
data; - menjalankan analisis yang memakai data biometrik.

**Wajib profesional berwenang:** - diagnosis; - resep dan perubahan
obat/dosis; - keputusan tindakan medis atau veteriner; - rekomendasi
penggunaan bahan kimia/pestisida berisiko; - keputusan yang berpotensi
membahayakan manusia, hewan, atau lingkungan.

Tidak boleh ada agent yang memperoleh akses tak terbatas, mengeksekusi
kode bebas, atau mengubah database produksi tanpa validasi dan
otorisasi.

## 7. Data Model dan API

Rancang skema yang dapat berkembang dan memisahkan data sensitif.
Gunakan UUID internal; jangan menjadikan NIK, nomor telepon, atau
biometrik sebagai primary key.

Entitas konseptual minimum: - `users` - `subjects` (jenis: human,
animal, plant) - `human_profiles` - `animal_profiles` -
`plant_profiles` - `owners_and_caregivers` - `consents` -
`biometric_enrollments` (opsional, manusia saja pada tahap awal) -
`health_observations` - `clinical_records` - `animal_vaccinations` -
`plant_observations` - `environmental_readings` - `sensor_devices` -
`care_plans` - `care_events` - `media_assets` - `ai_assessments` -
`knowledge_sources` - `alerts` - `access_grants` - `audit_logs` -
`data_retention_jobs`

Setiap pengukuran/observasi minimal memiliki: - subject ID; - jenis data
dan nilai; - satuan; - waktu pengukuran; - sumber (user, professional,
device, AI, import); - perangkat/metode; - kualitas data; - status
verifikasi; - catatan; - pencatat; - provenance/sumber rujukan.

Gunakan standar yang relevan jika sesuai, misalnya HL7 FHIR untuk
interoperabilitas data kesehatan manusia, ISO 11784/11785 untuk
identifikasi RFID hewan, serta ontologi/standar phenotyping tanaman.
Jangan memaksakan satu skema kesehatan untuk ketiga domain.

API minimum (sesuaikan konvensi backend yang ada): -
`GET/POST /api/cekkes/subjects` -
`GET/PATCH/DELETE /api/cekkes/subjects/:id` -
`GET/POST /api/cekkes/subjects/:id/observations` -
`GET/POST /api/cekkes/subjects/:id/care-plans` -
`GET /api/cekkes/subjects/:id/timeline` - `POST /api/cekkes/ai/assess` -
`GET /api/cekkes/alerts` - `POST /api/cekkes/consents` -
`GET/POST /api/cekkes/access-grants`

Validasi input di server. Terapkan pagination, rate limiting,
idempotency untuk operasi penting, dan authorization pada setiap
endpoint.

## 8. Privasi, Keamanan, dan Kepatuhan

Rancang berdasarkan prinsip privacy-by-design dan data minimization.

-   Patuhi UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU
    PDP) dan aturan pelaksana/aturan sektoral yang relevan. Minta
    tinjauan penasihat hukum sebelum peluncuran produksi.
-   Data biometrik untuk identifikasi dan data kesehatan manusia harus
    diperlakukan sebagai data berisiko tinggi/sensitif sesuai ketentuan
    yang berlaku.
-   Persetujuan harus eksplisit, spesifik, terpisah menurut tujuan,
    dapat ditarik, dan tercatat.
-   Sediakan alternatif non-biometrik. Jangan menjadikan biometrik
    sebagai syarat untuk memakai fitur dasar.
-   Jangan menyimpan citra retina, sidik jari, atau rekaman suara mentah
    jika tidak benar-benar diperlukan. Prioritaskan pemrosesan
    lokal/vendor tepercaya dan template terlindungi; enkripsi dan batasi
    retensi.
-   Template biometrik tidak boleh dianggap aman hanya karena di-hash.
    Gunakan proteksi template, key management, rotasi, dan mekanisme
    revokasi yang sesuai.
-   Enkripsi data saat transit dan tersimpan; secrets management; MFA
    untuk admin; RBAC/ABAC; least privilege; audit log append-only.
-   Pisahkan PII, data kesehatan, biometrik, dan data riset.
-   Terapkan backup terenkripsi, disaster recovery, vulnerability
    scanning, penetration testing, incident response, dan pemantauan
    akses anomali.
-   Sediakan akses, koreksi, ekspor, penarikan persetujuan, dan
    penghapusan sesuai dasar hukum dan kewajiban retensi.
-   Data riset harus dianonimkan atau diagregasi secara memadai.
    Pseudonimisasi bukan anonimisasi.
-   Jangan menggunakan data pengguna untuk melatih model umum tanpa
    persetujuan dan dasar hukum yang jelas.
-   Jangan menaruh data pribadi, kesehatan, atau biometrik ke blockchain
    publik. Jika BaMbooChain memakai blockchain, batasi pada bukti
    hash/consent receipt yang tidak mengungkap data pribadi, setelah
    kajian privasi dan legal.

## 9. Integrasi dengan Ekosistem BaMbooChain

-   Gunakan autentikasi akun BaMbooChain yang sudah ada.
-   Tambahkan menu ceKKes tanpa mengganggu modul Bamboo Tracker,
    Marketplace, Academy, Event Calendar, dan fitur lainnya.
-   Gunakan profil pengguna yang ada sebagai pemilik akun, tetapi data
    kesehatan/biometrik tetap terpisah dengan consent khusus.
-   Siapkan integrasi API untuk sensor IoT, laboratorium, klinik, dokter
    hewan, dan platform agrikultur pada fase berikutnya.
-   Integrasi wallet/token BMC bersifat **opsional** dan tidak boleh
    menjadi syarat untuk mengakses layanan kesehatan, melihat data
    sendiri, atau memperoleh informasi keselamatan.
-   Jangan mencatat data kesehatan atau biometrik pada transaksi
    publik/on-chain.
-   Sediakan dashboard admin terpisah untuk operasional, kualitas data,
    dan audit dengan akses minimum.

## 10. Desain UI/UX

Arah visual: - modern, bersih, tepercaya, human-centered,
nature-positive; - konsisten dengan identitas BaMbooChain yang sudah
ada; - gunakan warna, font, spacing, ikon, dan komponen dari design
system yang tersedia; - jangan membuat tema baru yang bertabrakan; -
hierarki informasi jelas, tidak menakut-nakuti pengguna; - status tidak
hanya dibedakan dengan warna; sertakan label dan ikon; - aksesibilitas
keyboard, kontras, ukuran teks, dan screen reader; - bahasa Indonesia
sebagai default, struktur siap untuk i18n.

Komponen penting: - dashboard summary cards; - category switcher; -
profile cards; - timeline; - chart tren pengukuran; - care schedule; -
upload/camera capture; - consent modal; - AI insight panel; -
evidence/source panel; - notification center; - empty state, loading
state, error state, offline state.

Jangan menampilkan grafik tanpa satuan, rentang waktu, dan sumber data.
Jangan membuat skor kesehatan gabungan yang tidak tervalidasi.

## 11. Alur Pengguna Utama

### A. Pengguna membuat profil manusia

1.  Login dengan akun BaMbooChain.
2.  Buka ceKKes → Manusia → Tambah Profil.
3.  Isi data minimum.
4.  Baca dan pilih consent sesuai tujuan.
5.  Simpan profil.
6.  Tambahkan catatan/pengukuran atau dokumen jika diinginkan.
7.  AI merangkum data yang diizinkan, menunjukkan keterbatasan, dan
    menyarankan tindak lanjut.

### B. Pemilik mendaftarkan hewan

1.  Pilih Hewan → Tambah Profil.
2.  Isi spesies, nama, usia (tanggal lahir atau estimasi), dan identitas
    tag bila tersedia.
3.  Tambahkan foto, berat, vaksinasi, pakan, dan catatan.
4.  AI membantu menyusun jadwal perawatan berbasis spesies dan sumber.
5.  Tanda bahaya diarahkan ke dokter hewan.

### C. Pengguna mendaftarkan tanaman

1.  Pilih Tumbuhan → Tambah Profil.
2.  Ambil/unggah foto dan isi lokasi serta tanggal tanam.
3.  AI membantu identifikasi dengan confidence dan meminta konfirmasi
    bila ragu.
4.  Tambahkan data sensor/observasi berkala.
5.  AI menyusun rekomendasi perawatan sesuai spesies, kondisi, dan
    lingkungan.

### D. Analisis AI

1.  Pengguna memilih profil dan jenis analisis.
2.  Sistem menampilkan data yang akan digunakan.
3.  Pengguna memberi izin.
4.  Agent mengambil data sesuai izin dan memanggil model spesialis.
5.  Hasil disertai sumber, confidence, keterbatasan, dan tindakan
    berikutnya.
6.  Hasil disimpan sebagai AI assessment dengan timestamp dan model
    version.

## 12. MVP dan Roadmap

Jangan mencoba membangun seluruh visi sekaligus.

### MVP 1 --- Fondasi (prioritas pertama)

-   halaman ceKKes terintegrasi;
-   dashboard;
-   profil manusia/hewan/tumbuhan;
-   catatan observasi dan timeline;
-   jadwal/pengingat perawatan;
-   AI assistant berbasis knowledge retrieval yang memberi edukasi umum
    dan merangkum input;
-   consent, role access, audit log;
-   mock/demo mode jika backend belum siap.

### MVP 2 --- Analitik domain

-   analisis foto tanaman;
-   identifikasi spesies dengan confidence;
-   pengamatan kondisi hewan/tanaman;
-   grafik pengukuran dan sensor;
-   sumber pengetahuan terkurasi;
-   review oleh ahli.

### MVP 3 --- Integrasi profesional dan perangkat

-   integrasi klinik/laboratorium sesuai standar;
-   integrasi dokter hewan;
-   IoT gateway dan sensor;
-   interoperabilitas dan ekspor data;
-   dashboard organisasi/komunitas.

### MVP 4 --- Biometrik manusia (hanya setelah legal & security review)

-   evaluasi vendor dan perangkat;
-   proof of concept terbatas;
-   uji akurasi dan bias independen;
-   liveness/anti-spoofing;
-   consent granular, alternatif non-biometrik, retensi minimal;
-   audit keamanan dan DPIA sebelum produksi.

### Roadmap 3--5 tahun

-   Tahun 1: fondasi data, MVP, pilot komunitas dan mitra profesional.
-   Tahun 2: validasi model per domain, integrasi sensor dan institusi.
-   Tahun 3: federasi data dan interoperabilitas lintas wilayah.
-   Tahun 4: analitik longitudinal dan riset kolaboratif yang
    terkontrol.
-   Tahun 5: perluasan ekosistem regional/global, standardisasi, dan
    model layanan berkelanjutan.

## 13. Pengujian dan Kriteria Penerimaan

Fitur dianggap siap hanya jika: - route ceKKes dapat dibuka dari
navigasi BaMbooChain; - tidak merusak halaman/fitur lain; - responsif
pada mobile dan desktop; - alur tambah, lihat, edit, dan hapus profil
berjalan sesuai izin; - data demo diberi label demo; - tidak ada
kebocoran data antar pengguna/role; - consent tercatat dan dapat
ditarik; - semua endpoint memeriksa authorization di server; - AI tidak
mengarang hasil ketika data tidak cukup; - AI menampilkan sumber dan
keterbatasan; - tindakan berisiko memerlukan konfirmasi atau
profesional; - data biometrik tidak dikumpulkan secara default; -
loading, error, empty, dan offline states ditangani; - lint, typecheck,
test, dan production build berhasil.

Buat unit test, integration test, dan end-to-end test untuk alur kritis,
terutama authorization, consent, data isolation, dan penghapusan.

## 14. Deliverables dari Coding Agent

Setelah implementasi, berikan: 1. ringkasan fitur yang dibangun; 2.
arsitektur aktual dan keputusan teknis; 3. daftar file yang
dibuat/diubah; 4. route dan cara mengakses halaman ceKKes; 5. skema
database/migration; 6. daftar endpoint dan kontraknya; 7. environment
variables yang perlu diisi (nama saja, tanpa secret); 8. hasil lint,
typecheck, test, dan build; 9. bagian yang masih mock/belum terhubung;
10. risiko, keterbatasan, dan rekomendasi tahap berikutnya.

## 15. Cara Kerja Agent

Bekerjalah secara mandiri untuk tugas yang aman dan dapat dibatalkan.
Jangan berhenti hanya untuk meminta persetujuan atas keputusan UI kecil.
Namun, **jangan** melakukan tindakan berikut tanpa persetujuan
eksplisit: - menghapus data atau tabel; - mengubah autentikasi/otorisasi
inti; - mengubah konfigurasi produksi atau deployment; - mengirim data
ke layanan pihak ketiga; - mengaktifkan pengumpulan biometrik; -
memproses data kesehatan nyata; - membuat biaya/layanan berbayar; -
melakukan migrasi destruktif.

Jika menemukan ketidakpastian, pilih implementasi paling aman,
dokumentasikan asumsi, dan buat interface agar dapat disempurnakan
kemudian.

**Mulai sekarang:** lakukan repository discovery, susun rencana, lalu
implementasikan MVP 1 ceKKes sebagai halaman resmi BaMbooChain.id.
Utamakan integrasi yang rapi, keamanan, kegunaan nyata, dan fondasi yang
dapat dikembangkan menjadi platform biologis berbasis AI agents.
