# Panduan Pengguna & Pengujian 12 Role — Modul CIBARANI GUANO

**URL Modul Utama:** `/#/cibarani-guano` (atau `/cibarani-guano`)  
**URL Ketertelusuran Publik (QR):** `/#/cibarani-guano/trace/CG-TRC-9F4A2C8E1B7D`

---

## 1. Cara Membuka Modul Cibarani Guano

Modul **Cibarani Guano** terintegrasi penuh di dalam navigasi BaMbooChain:
1. **Menu Mobile 5 Kluster:** Buka menu utama lalu pilih **Kluster 4: Petani Milenial (Pemberdayaan Petani, Edukasi & Koperasi)** → klik **🦇 Cibarani Guano (Biofertilizer)**.
2. **Pintasan Cepat (Quick Access Mobile & Bar Atas Desktop):** Klik tombol **🦇 Cibarani Guano** di bar atas.
3. **Dropdown `bambuNUSA`:** Pilih **🦇 Cibarani Guano**.

---

## 2. Cara Menguji 12 Role RBAC (Role-Based Access Control)

Pada sudut kanan atas header **Cibarani Guano**, terdapat panel **Simulasi Hak Akses (12 Role RBAC)**. Pilih salah satu role dari dropdown untuk menguji pembatasan menu dan tindakan:

| No | Role | Organisasi | Cara Menguji Kewenangan |
|---|---|---|---|
| 1 | **Super Admin BaMbooChain** | YSNJ | Dapat membuka seluruh 15 submenu dan melakukan seluruh persetujuan lintas organisasi. |
| 2 | **Project Admin** | BUP | Mengelola operasional proyek, produksi, katalog, keuangan, dan simulasi manfaat. |
| 3 | **ASPAI Admin** | ASPAI | Mengelola produksi, formula, pengesahan mutu (QA), katalog produk, dan pesanan pasar. |
| 4 | **Kasepuhan Admin** | Kasepuhan Cibarani | Mengakses *Resource Registry*, menyahkan/menangguhkan **Persetujuan Adat**, dan memverifikasi pengumpulan. |
| 5 | **YSNJ Admin** | YSNJ | Mencatat *Conservation Tracker*, memverifikasi kepatuhan konservasi pada panen, dan memantau *Impact Dashboard*. |
| 6 | **Field Officer** | Kasepuhan Cibarani | Mencatat observasi konservasi lapangan dan mengajukan permohonan jadwal pengumpulan guano. |
| 7 | **Production Officer** | ASPAI | Mengelola stok bahan baku, mutasi gudang, dan membuat batch produksi baru. |
| 8 | **Quality Officer** | ASPAI | Menginput sertifikat laboratorium di menu *Quality Assurance* untuk membuka kunci `Ready for Sale` dan menerbitkan token QR. |
| 9 | **Finance Officer** | BUP | Mencatat transaksi di *Financial Ledger*, melakukan *Approve*, atau membuat *Jurnal Balik (Reversal)*. |
| 10 | **Investor / Partner Viewer** | BUP | Hanya dapat melihat ringkasan *Dashboard*, *Katalog*, *QR Traceability*, *Benefit Sharing*, *Impact*, dan mengunduh *Reports*. |
| 11 | **Customer** | ASPAI | Hanya dapat melihat produk yang sudah *Ready for Sale*, membuat pesanan di *Marketplace & Orders*, dan memindai QR. |
| 12 | **Public Viewer** | Umum | Hanya dapat melihat informasi publik non-sensitif (*Dashboard*, *Katalog*, *QR Traceability*, *Impact*). |

---

## 3. Skenario Uji Validasi Kritis (Acceptance Testing)

1. **Uji Penguncian Konservasi Otomatis (Submenu 3 & 4):**
   - Buka **3. Conservation Tracker**, pilih situs `CBR-SIM-DEMO`, lalu ubah status konservasi menjadi **Risiko Tinggi** atau **Kegiatan Dihentikan** dan klik Simpan.
   - Buka **4. Harvest Management** lalu coba ajukan permohonan pengumpulan pada situs tersebut → Sistem otomatis menolak permohonan dan menampilkan peringatan perlindungan koloni kelelawar.
2. **Uji Anti-Stok Negatif (Submenu 5):**
   - Buka **5. Raw Material Inventory**, masukkan angka pengurangan melebihi stok tersedia (misal `-999` kg) → Sistem menolak mutasi.
3. **Uji Penguncian Mutu Produk & Penerbitan QR (Submenu 6, 7, 8, 10):**
   - Buat batch produksi baru di **6. Production Management** → Batch otomatis berstatus `Pending Quality Check` dan `Ready for Sale: TERKUNCI`.
   - Buka **7. Quality Assurance**, pilih batch tersebut, dan sahkan dengan status `Lulus Uji (DEMO)` → Batch berubah menjadi `Approved`, stok produk bertambah, dan Token QR kriptografis otomatis diterbitkan di **10. Supply Chain & QR**.
4. **Uji Immutability Transaksi Keuangan (Submenu 11):**
   - Di **11. Financial Ledger**, transaksi yang sudah `Approved` tidak memiliki tombol hapus permanen, melainkan hanya dapat dikoreksi melalui tombol **Jurnal Balik (Reversal)** dengan mengisi alasan wajib.
5. **Uji Simulasi Pembagian Manfaat (Submenu 12):**
   - Di **12. Benefit Sharing**, ubah parameter asumsi dan verifikasi bahwa bagian YSNJ berlabel **Alokasi Program YSNJ (20% — BUKAN DIVIDEN)** serta dana konservasi (10%) dihitung terlebih dahulu dari surplus operasional positif tanpa mengeksekusi pembayaran otomatis.

