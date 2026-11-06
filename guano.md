# PROMPT.MD --- Pengembangan Modul CIBARANI GUANO pada BaMbooChain

## Instruksi Utama untuk Agent AI Antigravity IDE

Anda bertindak sebagai **Senior Full-Stack Engineer, Solution Architect,
UI/UX Designer, Database Engineer, dan QA Engineer**. Tugas Anda adalah
mengembangkan modul **CIBARANI GUANO** ke dalam aplikasi BaMbooChain
yang sudah ada.

**Platform utama:** https://bamboochain.id\
**Nama modul:** Cibarani Guano\
**Subjudul:** Biofertilizer, Traceability & Community Benefit
Management\
**Bahasa antarmuka:** Bahasa Indonesia sebagai bahasa utama. Siapkan
struktur agar mudah ditambahkan Bahasa Inggris.\
**Tujuan:** Mendigitalisasi tata kelola sumber daya guano, pencatatan
pengumpulan yang diizinkan, produksi, pengujian mutu, inventaris,
penjualan, keuangan, pembagian manfaat, dan pemantauan konservasi secara
transparan.

> PENTING: Ini adalah instruksi pengembangan pada repository yang sudah
> ada. Jangan membuat aplikasi baru yang terpisah dan jangan mengganti
> arsitektur, autentikasi, database, desain sistem, atau pola coding
> yang sudah berjalan tanpa alasan teknis yang kuat.

------------------------------------------------------------------------

# 1. Aturan Kerja Sebelum Coding

Lakukan langkah berikut secara berurutan.

1.  Audit repository BaMbooChain terlebih dahulu:
    -   Identifikasi framework, bahasa pemrograman, struktur folder,
        routing, komponen UI, design system, autentikasi,
        role/permission, database, ORM, API, storage, dan pola
        deployment.
    -   Periksa `README`, `package.json` atau file dependency lain,
        konfigurasi environment, skema database, dan modul yang sudah
        ada.
    -   Identifikasi fitur marketplace, membership, wallet, admin
        dashboard, notifikasi, dan sistem QR jika sudah tersedia.
2.  Buat ringkasan arsitektur yang ditemukan sebelum melakukan perubahan
    besar.
3.  Gunakan kembali komponen, layanan, autentikasi, dan pola database
    yang sudah ada.
4.  Jangan menghapus, merusak, atau mengubah fitur BaMbooChain yang
    tidak terkait.
5.  Jika ada keputusan teknis yang belum jelas, pilih solusi yang paling
    konsisten dengan pola proyek yang sudah ada dan dokumentasikan
    asumsi tersebut.
6.  Jangan menampilkan data dummy seolah-olah data produksi. Data demo
    harus diberi label **DEMO**.
7.  Jangan memasukkan API key, password, secret, atau credential ke
    source code.
8.  Setelah implementasi, jalankan lint, type-check, test, dan build
    yang tersedia. Perbaiki error yang muncul.
9.  Buat atau perbarui dokumentasi implementasi dan `.env.example` bila
    diperlukan. Jangan menimpa `.env` yang sudah ada.
10. Implementasikan secara bertahap dan pastikan setiap tahap dapat
    dijalankan.

## Prinsip pengembangan

-   Modular, maintainable, secure, responsive, dan production-oriented.
-   Mobile-first karena banyak pengguna lapangan mengakses melalui
    ponsel.
-   Tampilan konsisten dengan identitas visual BaMbooChain.
-   Gunakan komponen UI yang sudah ada sebelum membuat komponen baru.
-   Hindari duplikasi data dan business logic.
-   Semua nilai finansial disimpan sebagai angka numerik/decimal yang
    presisi, bukan string berformat.
-   Semua waktu disimpan dengan standar yang konsisten dan ditampilkan
    sesuai zona waktu Indonesia.
-   Semua operasi penting memiliki audit trail.
-   Setiap halaman memiliki loading, empty, success, dan error state.
-   Sediakan pagination, pencarian, filter, validasi form, dan
    konfirmasi untuk tindakan penting.

------------------------------------------------------------------------

# 2. Latar Belakang dan Model Kolaborasi

Cibarani Guano merupakan inisiatif pengembangan pupuk organik berbasis
guano kelelawar di wilayah Kasepuhan Cibarani, Kabupaten Lebak, Banten.

Pihak-pihak yang terlibat:

### A. ASPAI --- Asosiasi Penggiat Anggur Indonesia

Peran: - Pengembangan produk dan formulasi. - Pengembangan proses
pengolahan. - Pengendalian mutu dan koordinasi pengujian. - Pengembangan
jaringan petani anggur dan hortikultura. - Pemasaran, distribusi, dan
pengembangan pasar nasional maupun ekspor.

### B. Kasepuhan Cibarani

Peran: - Persetujuan dan tata kelola adat. - Pengawasan sumber daya dan
area yang boleh/tidak boleh dimanfaatkan. - Partisipasi masyarakat dalam
kegiatan yang telah disetujui. - Pencatatan tenaga kerja dan kontribusi
komunitas. - Pengawasan manfaat ekonomi masyarakat adat. - Partisipasi
dalam monitoring konservasi.

### C. Yayasan Sabumi Nusantara Jaya (YSNJ)

Peran: - Pendampingan konservasi dan pemberdayaan masyarakat. -
Koordinasi kemitraan dan tata kelola. - Monitoring dampak sosial dan
lingkungan. - Pendampingan digitalisasi melalui BaMbooChain. -
Pengelolaan program konservasi sesuai kewenangan dan ketentuan hukum.

### D. Badan Usaha Pelaksana

Akan ditetapkan kemudian, misalnya koperasi produsen atau badan usaha
yang sesuai. Badan usaha ini menjadi pelaksana transaksi komersial,
produksi, pembelian, penjualan, rekening, pembukuan, pajak, dan
pelaporan usaha.

**Catatan penting:** Jangan mengasumsikan YSNJ sebagai yayasan berhak
menerima dividen seperti pemegang saham perusahaan. Sistem harus
membedakan: - Pembagian hasil usaha kepada pihak yang secara hukum
berhak menerimanya. - Anggaran program YSNJ. - Pembayaran jasa/layanan
yang benar-benar diberikan berdasarkan kontrak dan nilai wajar. - Dana
konservasi. - Pengembalian modal atau hak ekonomi investor.

Jangan mengimplementasikan pembagian uang otomatis sebelum skema hukum,
badan usaha, rekening, perjanjian, dan pihak penerima disahkan.

------------------------------------------------------------------------

# 3. Tujuan Modul

Bangun satu modul terpadu yang memungkinkan para pihak:

1.  Mencatat data sumber daya guano dan status pemanfaatannya.
2.  Mencatat hasil survei ekologi dan konservasi.
3.  Mengelola persetujuan dan batas pengumpulan.
4.  Mencatat pengumpulan guano secara terkontrol.
5.  Mengelola penerimaan bahan baku dan nomor batch.
6.  Mencatat proses produksi dan stok.
7.  Menyimpan hasil pengujian laboratorium dan status mutu.
8.  Mengelola produk, kemasan, harga, dan katalog.
9.  Mencatat penjualan, pesanan, pelanggan, dan distribusi.
10. Menghasilkan QR code untuk ketertelusuran produk.
11. Mencatat pendapatan, biaya, dana konservasi, dan alokasi manfaat.
12. Menampilkan dashboard dampak ekonomi, sosial, dan lingkungan.
13. Menyediakan laporan yang dapat diunduh.
14. Mengelola hak akses berbeda untuk setiap organisasi dan pengguna.

------------------------------------------------------------------------

# 4. Struktur Menu dan Navigasi

Tambahkan menu utama **CIBARANI GUANO** pada navigasi BaMbooChain sesuai
pola aplikasi yang sudah ada.

Submenu yang dibutuhkan:

1.  **Dashboard**
2.  **Resource Registry** --- Data Sumber Daya
3.  **Conservation Tracker** --- Monitoring Konservasi
4.  **Harvest Management** --- Pengumpulan Guano
5.  **Raw Material Inventory** --- Persediaan Bahan Baku
6.  **Production Management** --- Produksi
7.  **Quality Assurance** --- Pengujian dan Mutu
8.  **Product Catalog** --- Katalog Produk
9.  **Marketplace & Orders** --- Penjualan dan Pesanan
10. **Supply Chain & QR Traceability** --- Ketertelusuran
11. **Financial Ledger** --- Keuangan
12. **Benefit Sharing** --- Pembagian Manfaat
13. **Impact Dashboard** --- Dampak Sosial dan Lingkungan
14. **Reports** --- Laporan
15. **Settings & User Access** --- Pengaturan dan Hak Akses

Tampilkan menu berdasarkan permission pengguna. Jangan hanya
menyembunyikan menu di frontend; API/backend juga wajib memvalidasi
permission.

------------------------------------------------------------------------

# 5. Role dan Hak Akses

Implementasikan role-based access control (RBAC). Sesuaikan dengan
sistem role yang sudah ada.

Role konseptual:

  -----------------------------------------------------------------------
  Role                                Kewenangan utama
  ----------------------------------- -----------------------------------
  Super Admin BaMbooChain             Konfigurasi platform dan akses
                                      lintas organisasi sesuai kebijakan

  Project Admin                       Mengelola modul dan seluruh data
                                      proyek

  ASPAI Admin                         Produk, formulasi, produksi, mutu,
                                      pasar, dan laporan terkait

  Kasepuhan Admin                     Data komunitas, persetujuan adat,
                                      pengawasan sumber daya, dan laporan
                                      manfaat

  YSNJ Admin                          Konservasi, program, monitoring
                                      dampak, tata kelola, dan laporan

  Field Officer                       Input survei, pengumpulan yang
                                      disetujui, dan monitoring lapangan

  Production Officer                  Penerimaan bahan, produksi, stok,
                                      dan batch

  Quality Officer                     Input hasil uji dan persetujuan
                                      status mutu

  Finance Officer                     Pencatatan transaksi, biaya,
                                      rekonsiliasi, dan laporan keuangan

  Investor/Partner Viewer             Melihat ringkasan dan laporan yang
                                      diizinkan

  Public Viewer                       Melihat informasi publik dan
                                      ketertelusuran produk yang tidak
                                      sensitif

  Customer                            Melihat produk, pesanan sendiri,
                                      dan informasi batch produk yang
                                      dibeli
  -----------------------------------------------------------------------

Ketentuan: - Setiap pengguna terhubung dengan organisasi/entitas. - Data
sensitif dibatasi berdasarkan organisasi dan role. - Gunakan prinsip
least privilege. - Perubahan role harus dicatat. - Aksi persetujuan,
perubahan data, dan transaksi penting wajib tercatat dalam audit log.

------------------------------------------------------------------------

# 6. Detail Fitur dan Persyaratan Fungsional

## 6.1 Dashboard

Buat dashboard ringkas dan informatif dengan kartu metrik:

-   Total sumber daya/lokasi terdaftar.
-   Status survei dan persetujuan.
-   Total pengumpulan yang disetujui.
-   Total bahan baku tersedia.
-   Total produksi per periode.
-   Total produk siap jual.
-   Jumlah batch lulus uji.
-   Total penjualan dan nilai pesanan.
-   Dana konservasi terkumpul dan digunakan.
-   Ringkasan alokasi manfaat.
-   Indikator konservasi dan partisipasi masyarakat.

Fitur: - Filter periode. - Filter organisasi/unit. - Grafik tren
produksi dan penjualan. - Grafik status batch. - Ringkasan aktivitas
terbaru. - Notifikasi tugas atau persetujuan yang tertunda.

Jangan menampilkan angka yang belum ada sebagai fakta. Gunakan state
kosong dengan ajakan untuk memasukkan data awal.

## 6.2 Resource Registry --- Data Sumber Daya

Fitur: - Registrasi sumber daya atau area survei. - Kode unik lokasi
internal. - Nama area dan deskripsi. - Wilayah administratif. - Status
survei. - Status legal/perizinan. - Status persetujuan adat. - Status
konservasi. - Catatan ahli. - Lampiran dokumen dan foto. - Riwayat
pembaruan.

Field konseptual: - resource_id - resource_code - resource_name -
general_region - description - survey_status - legal_status -
customary_approval_status - conservation_status -
estimated_guano_volume - volume_unit - sustainable_harvest_limit -
data_confidentiality - created_by - created_at - updated_at

**Keamanan lokasi:** Jangan membuat koordinat gua atau lokasi koloni
dapat diakses publik. Jika koordinat dibutuhkan untuk pengelolaan
internal, simpan sebagai data terenkripsi atau akses terbatas. Pada
halaman publik cukup tampilkan wilayah umum.

## 6.3 Conservation Tracker --- Monitoring Konservasi

Fitur: - Pencatatan survei ekologi. - Catatan kondisi habitat. -
Observasi kelelawar tanpa mengganggu koloni. - Monitoring aktivitas dan
potensi gangguan. - Catatan kualitas lingkungan yang relevan. - Foto dan
dokumen pendukung. - Temuan risiko. - Rekomendasi ahli. - Status tindak
lanjut. - Riwayat monitoring.

Field konseptual: - monitoring_id - resource_id - monitoring_date -
observer - habitat_condition - bat_activity_observation -
disturbance_level - water_or_environment_notes - findings -
recommendation - follow_up_status - attachments

Sediakan status: - Normal - Perlu Perhatian - Risiko Tinggi - Kegiatan
Dihentikan

Jika status **Risiko Tinggi** atau **Kegiatan Dihentikan**, sistem harus
memberikan peringatan dan mencegah pembuatan izin pengumpulan baru
sampai ada evaluasi dan persetujuan ulang oleh pihak berwenang.

Jangan membuat sistem menyimpulkan kondisi populasi atau kesehatan
ekosistem secara otomatis dari foto atau data sederhana. Status
konservasi harus diinput/divalidasi petugas atau ahli yang berwenang.

## 6.4 Harvest Management --- Pengumpulan Guano

Fitur: - Permohonan jadwal pengumpulan. - Persetujuan oleh role yang
berwenang. - Validasi status konservasi dan persetujuan adat. -
Penentuan area yang boleh dikelola. - Pencatatan petugas. - Pencatatan
tanggal dan berat aktual. - Dokumentasi kegiatan. - Nomor batch bahan
baku. - Catatan kondisi dan metode pengumpulan. - Status verifikasi.

Alur: 1. Field Officer membuat permohonan. 2. Sistem memeriksa status
area, persetujuan, dan larangan konservasi. 3. Kasepuhan/otoritas yang
ditetapkan memberikan persetujuan sesuai prosedur. 4. Petugas
melaksanakan kegiatan sesuai batas yang disetujui. 5. Petugas memasukkan
berat aktual dan dokumentasi. 6. Penanggung jawab memverifikasi hasil.
7. Sistem membuat batch bahan baku dan memperbarui stok.

Validasi wajib: - Tidak boleh ada pengumpulan jika status area tidak
disetujui. - Tidak boleh melebihi kuota/batas yang disahkan. - Tidak
boleh dilakukan ketika status konservasi melarang kegiatan. - Semua
perubahan kuota dan persetujuan masuk audit log. - Sistem tidak boleh
membuat kuota otomatis dari perkiraan AI.

## 6.5 Raw Material Inventory --- Persediaan Bahan Baku

Fitur: - Penerimaan bahan baku. - Nomor batch. - Berat masuk. -
Satuan. - Tanggal penerimaan. - Sumber yang disetujui. - Status
pemeriksaan awal. - Lokasi penyimpanan. - Stok tersedia. - Pemakaian
untuk produksi. - Penyesuaian stok dengan alasan dan approval. - Riwayat
mutasi.

Gunakan satuan kg sebagai satuan standar dan dukung satuan lain bila
memang diperlukan.

Stok tidak boleh negatif. Perubahan stok harus melalui transaksi yang
dapat ditelusuri.

## 6.6 Production Management --- Produksi

Fitur: - Pembuatan rencana produksi. - Nomor batch produksi. - Pemilihan
batch bahan baku. - Formula/resep produksi dengan versi. - Catatan bahan
tambahan. - Tanggal dan penanggung jawab produksi. - Tahapan proses. -
Berat input dan output. - Susut/kehilangan proses. - Catatan pengeringan
dan pengayakan. - Catatan granulasi/pencampuran jika digunakan. -
Pengemasan. - Status produksi. - Riwayat dan dokumen SOP.

Alur status: - Draft - Planned - In Progress - Pending Quality Check -
Approved - Rejected - Archived

Setiap batch produksi harus dapat ditelusuri ke batch bahan baku
asalnya.

## 6.7 Quality Assurance --- Pengujian dan Mutu

Fitur: - Registrasi pengujian per batch. - Nama laboratorium. - Nomor
sertifikat/laporan. - Tanggal pengujian. - Parameter yang diuji. - Nilai
hasil uji. - Satuan. - Batas spesifikasi yang disetujui. - Lampiran
hasil uji. - Catatan Quality Officer. - Status lulus/tidak lulus/perlu
pengujian ulang.

Parameter yang dapat dikonfigurasi, bukan ditetapkan sepihak: - Kadar
air. - pH. - Bahan organik. - Unsur hara relevan. - Kontaminan/logam
berat. - Parameter mikrobiologi. - Parameter lain sesuai kategori produk
dan ketentuan yang berlaku.

Sistem tidak boleh mengarang ambang batas standar. Admin/Quality Officer
hanya dapat mengisi spesifikasi berdasarkan regulasi, standar, atau
hasil kesepakatan dengan laboratorium dan regulator.

Produk/batch tidak boleh berstatus **Ready for Sale** sebelum
persyaratan mutu dan persetujuan yang diwajibkan dipenuhi.

## 6.8 Product Catalog --- Katalog Produk

Produk konsep awal: - Cibarani Guano Powder. - Cibarani Guano Granule. -
Cibarani Professional Series.

Fitur: - Nama dan kode produk. - Deskripsi. - Foto. - Komposisi sesuai
hasil uji. - Berat bersih. - Kemasan. - Harga. - Status
pendaftaran/izin. - Spesifikasi produk. - Petunjuk penggunaan yang sudah
disetujui. - Batch yang tersedia. - Status aktif/nonaktif.

Jangan menerbitkan klaim seperti "meningkatkan hasil panen sekian
persen", "100% aman", atau klaim agronomis lain tanpa bukti yang sah.

## 6.9 Marketplace & Orders

Integrasikan dengan marketplace BaMbooChain yang sudah ada jika
arsitektur mendukung.

Fitur: - Daftar produk. - Detail produk. - Harga dan stok. -
Keranjang/pesanan jika sistem marketplace sudah tersedia. - Data
pelanggan. - Status pembayaran. - Status pemrosesan. - Pengiriman. -
Invoice/nota. - Riwayat transaksi.

Status pesanan: - Pending Payment - Paid - Processing - Shipped -
Completed - Cancelled - Refunded

Jangan membuat payment gateway palsu. Gunakan payment service yang sudah
tersedia atau buat adapter/interface agar provider dapat dikonfigurasi
kemudian.

## 6.10 Supply Chain & QR Traceability

Buat QR unik untuk setiap batch produk atau unit kemasan sesuai strategi
produksi.

Halaman publik saat QR dipindai harus menampilkan: - Nama produk. -
Nomor batch. - Tanggal produksi. - Status mutu yang boleh
dipublikasikan. - Ringkasan hasil uji yang telah disetujui untuk
publik. - Wilayah asal secara umum. - Identitas pengelola/produsen yang
disetujui. - Status ketertelusuran.

Jangan menampilkan: - Koordinat gua. - Lokasi koloni kelelawar. - Data
pribadi pekerja. - Dokumen internal. - Data keuangan sensitif. -
Informasi yang dapat mengganggu konservasi atau keamanan masyarakat.

QR harus menggunakan token/ID acak yang sulit ditebak, bukan ID database
berurutan yang dapat dieksploitasi. Validasi akses dan rate limiting
pada endpoint publik.

## 6.11 Financial Ledger --- Keuangan

Fitur: - Pencatatan penjualan. - Pencatatan pembelian bahan dan biaya
operasional. - Biaya produksi. - Biaya distribusi. - Biaya tenaga
kerja. - Biaya konservasi. - Pemasukan hibah/CSR dengan penanda sumber
dana. - Pembiayaan/investasi dengan jenis instrumen. - Rekonsiliasi
transaksi. - Laporan arus kas sederhana. - Ekspor CSV/XLSX/PDF sesuai
library yang tersedia.

Kategori transaksi harus dapat dikelola admin.

Setiap transaksi memiliki: - Nomor transaksi. - Tanggal. - Jenis
transaksi. - Kategori. - Deskripsi. - Nilai. - Mata uang. - Sumber
dana/akun. - Referensi dokumen. - Pembuat. - Verifikator. - Status.

Status transaksi: - Draft - Submitted - Approved - Rejected - Reconciled

Transaksi yang telah disetujui tidak boleh dihapus permanen. Koreksi
dilakukan melalui reversal/adjustment dengan alasan dan audit trail.

## 6.12 Benefit Sharing --- Pembagian Manfaat

Bangun modul simulasi dan pencatatan alokasi manfaat, bukan sistem
transfer otomatis.

Parameter awal yang dapat dikonfigurasi: - Dana konservasi: usulan 10%
dari surplus operasional positif. - Kasepuhan Cibarani: usulan alokasi
50%. - ASPAI: usulan alokasi 30%. - Program YSNJ: usulan alokasi 20%.

**PENTING:** Persentase tersebut adalah usulan diskusi, bukan
kesepakatan final dan bukan instruksi pembayaran. Jangan hardcode
persentase sebagai aturan tetap. Sediakan menu konfigurasi, tanggal
berlaku, versi perjanjian, dan status persetujuan.

Aturan perhitungan: 1. Hitung pendapatan dan biaya berdasarkan data
ledger yang telah diverifikasi. 2. Hitung surplus sesuai formula yang
ditetapkan badan usaha. 3. Tampilkan kewajiban pajak, biaya pembiayaan,
cadangan, dan kewajiban lain sebagai item terpisah. 4. Hitung dana
konservasi berdasarkan kebijakan yang disetujui. 5. Hitung sisa yang
dapat dialokasikan. 6. Terapkan persentase berdasarkan perjanjian aktif
yang sudah disetujui. 7. Tampilkan simulasi, bukan instruksi pembayaran.
8. Minta persetujuan berjenjang dari pihak berwenang. 9. Catat bukti
pembayaran setelah dilakukan di luar sistem atau melalui integrasi
resmi.

Sediakan: - Simulasi per bulan/kuartal/tahun. - Versi skema pembagian. -
Dokumen perjanjian. - Status persetujuan. - Rekap alokasi per pihak. -
Riwayat realisasi. - Bukti transaksi. - Laporan transparansi.

Untuk YSNJ, tampilkan label **Alokasi Program YSNJ**, bukan dividen.
Sistem harus mendukung pencatatan program/kontrak yang sah dan tidak
membagikan keuntungan kepada Pembina, Pengurus, atau Pengawas yayasan.

Investor dan pengembalian modal harus dicatat sebagai instrumen
pembiayaan/kontrak terpisah, tidak otomatis dimasukkan ke pembagian
50:30:20.

## 6.13 Impact Dashboard

Indikator ekonomi: - Jumlah masyarakat yang terlibat. - Hari kerja atau
jam kerja yang tercatat. - Nilai pembayaran kepada tenaga kerja lokal. -
Nilai manfaat untuk komunitas. - Jumlah pemasok/mitra lokal.

Indikator konservasi: - Jumlah kegiatan monitoring. - Jumlah temuan dan
tindak lanjut. - Status area konservasi. - Jumlah kegiatan pengumpulan
yang dihentikan karena alasan konservasi. - Dana konservasi terkumpul
dan digunakan. - Kegiatan edukasi/rehabilitasi yang terdokumentasi.

Indikator produksi: - Bahan baku masuk. - Produksi per batch. - Produk
lolos uji. - Produk terjual. - Produk dikembalikan/ditolak.

Jangan mengklaim dampak ekologis seperti kenaikan populasi kelelawar
atau peningkatan biodiversitas tanpa metodologi dan data monitoring yang
valid.

## 6.14 Reports

Buat laporan: - Laporan sumber daya. - Laporan survei dan konservasi. -
Laporan pengumpulan. - Laporan stok bahan baku. - Laporan produksi. -
Laporan mutu. - Laporan penjualan. - Laporan keuangan. - Laporan dana
konservasi. - Laporan pembagian manfaat. - Laporan dampak sosial. -
Laporan investor/mitra sesuai hak akses.

Fitur: - Filter tanggal. - Filter organisasi. - Filter batch. - Filter
status. - Export PDF/Excel/CSV jika library tersedia. - Print-friendly
layout.

------------------------------------------------------------------------

# 7. Data Model dan Database

Rancang database berdasarkan teknologi yang sudah digunakan repository.
Jangan memaksakan database baru.

Entitas konseptual minimal:

1.  organizations
2.  organization_members
3.  project_roles / permissions
4.  resource_sites
5.  resource_surveys
6.  conservation_monitorings
7.  customary_approvals
8.  harvest_requests
9.  harvest_records
10. raw_material_batches
11. inventory_transactions
12. production_plans
13. production_batches
14. production_inputs
15. production_outputs
16. quality_tests
17. quality_test_parameters
18. products
19. product_batches
20. product_inventory
21. orders
22. order_items
23. shipments
24. traceability_tokens
25. financial_accounts
26. financial_transactions
27. benefit_sharing_schemes
28. benefit_sharing_periods
29. benefit_allocations
30. conservation_funds
31. impact_records
32. documents
33. notifications
34. audit_logs

Ketentuan desain database: - Primary key konsisten. - Foreign key dan
relasi jelas. - Index untuk field pencarian/filter. - Soft delete hanya
untuk data yang memang boleh dinonaktifkan; transaksi finansial tidak
boleh dihapus permanen. - Timestamp created_at, updated_at, created_by
untuk entitas penting. - Gunakan transaksi database untuk operasi yang
mengubah stok/ledger. - Terapkan tenant/organization scoping bila
aplikasi multi-organisasi. - Simpan file di storage yang sudah digunakan
proyek dengan validasi tipe, ukuran, dan permission. - Buat migration
yang aman dan dapat di-rollback jika framework mendukung. - Jangan
menyimpan koordinat lokasi sensitif sebagai field publik. - Tambahkan
validasi server-side untuk semua input penting.

Sebelum coding, buat ERD atau dokumentasi relasi entitas.
Implementasikan skema sesuai konvensi proyek.

------------------------------------------------------------------------

# 8. API dan Business Logic

Buat endpoint atau server actions sesuai arsitektur yang sudah ada
untuk: - CRUD resource site. - Survei dan monitoring. -
Permohonan/persetujuan pengumpulan. - Penerimaan dan mutasi stok. -
Rencana dan batch produksi. - Hasil pengujian mutu. - Katalog produk. -
Pesanan dan pengiriman. - QR traceability. - Financial ledger. - Benefit
sharing simulation and approval. - Reports and exports.

Persyaratan: - Validasi input di server. - Otorisasi setiap endpoint. -
Pagination dan filter server-side. - Error response konsisten. -
Idempotency untuk operasi transaksi yang berisiko duplikasi. - Audit log
untuk aksi penting. - Database transaction untuk update stok dan
transaksi keuangan. - Rate limiting untuk endpoint publik, khususnya
QR. - Jangan mempercayai nilai harga, total, role, atau status yang
dikirim dari browser tanpa validasi server.

------------------------------------------------------------------------

# 9. UI/UX dan Visual Design

Ikuti design system BaMbooChain yang sudah ada. Jika belum ada pedoman
yang jelas, gunakan arah visual berikut: - Nuansa hijau bambu, hijau
hutan, putih, dan warna netral. - Tampilan bersih, profesional, modern,
dan mudah dibaca. - Hindari terlalu banyak warna dekoratif. - Gunakan
card untuk KPI, tabel untuk data operasional, dan grafik untuk tren. -
Form dibuat bertahap jika banyak field. - Gunakan label dan helper text
yang jelas. - Konfirmasi sebelum menghapus/nonaktifkan/mengubah status
penting. - Gunakan badge status dengan warna yang konsisten. - Desain
responsif untuk desktop, tablet, dan ponsel. - Perhatikan aksesibilitas,
kontras, ukuran font, keyboard navigation, dan empty state.

Halaman utama modul harus memiliki: - Header modul Cibarani Guano. -
Ringkasan status proyek. - KPI utama. - Grafik produksi/penjualan. -
Status konservasi dan persetujuan. - Aktivitas terbaru. - Tombol aksi
cepat sesuai role.

------------------------------------------------------------------------

# 10. Keamanan, Privasi, dan Perlindungan Konservasi

Wajib: - RBAC di frontend dan backend. - Validasi server-side. -
Proteksi terhadap IDOR dan akses lintas organisasi. - Sanitasi input dan
perlindungan XSS/CSRF sesuai framework. - Rate limit endpoint publik. -
File upload aman. - Secret hanya di environment variables. - Audit trail
untuk persetujuan, perubahan kuota, stok, keuangan, dan pembagian
manfaat. - Backup dan kebijakan retensi data. - Batasi akses data
pribadi dan lokasi sensitif. - Jangan membuka koordinat gua/koloni pada
halaman publik, QR, marketplace, atau metadata gambar. - Jangan
mempublikasikan data pribadi masyarakat tanpa dasar dan persetujuan. -
Jangan melakukan pembayaran otomatis atau tokenisasi manfaat dalam fase
pertama.

------------------------------------------------------------------------

# 11. Notifikasi

Gunakan sistem notifikasi BaMbooChain jika tersedia.

Notifikasi untuk: - Permohonan pengumpulan baru. - Persetujuan
menunggu. - Status konservasi berubah. - Kuota pengumpulan hampir
habis. - Stok bahan baku menipis. - Produksi selesai. - Hasil uji mutu
tersedia. - Batch ditolak. - Pesanan masuk. - Pembayaran
terverifikasi. - Laporan periode harus disiapkan. - Pembagian manfaat
menunggu persetujuan.

Sediakan in-app notification terlebih dahulu. Email/WhatsApp/push hanya
diintegrasikan jika layanan dan credential resmi tersedia.

------------------------------------------------------------------------

# 12. Seed Data dan Mode Demo

Buat seed data untuk development/demo dengan label yang jelas,
misalnya: - ASPAI --- Demo Organization. - Kasepuhan Cibarani --- Demo
Organization. - Yayasan Sabumi Nusantara Jaya --- Demo Organization. -
Satu resource site demo tanpa koordinat sensitif. - Satu contoh batch
bahan baku. - Satu contoh batch produksi. - Satu contoh hasil uji
berstatus DEMO. - Satu produk demo. - Satu transaksi demo.

Jangan mengisi angka volume guano aktual karena belum tersedia. Field
volume harus kosong/null atau berstatus **Belum Disurvei**.

Jangan membuat data demo tercampur dengan data produksi. Sediakan
environment/seed yang jelas.

------------------------------------------------------------------------

# 13. Tahapan Implementasi

Kerjakan dengan urutan berikut. Setelah setiap tahap, pastikan aplikasi
tetap berjalan.

## Tahap 1 --- Audit dan perencanaan

-   Audit repository dan arsitektur.
-   Identifikasi komponen yang dapat digunakan kembali.
-   Buat `docs/cibarani-guano-architecture.md`.
-   Buat rancangan ERD.
-   Buat daftar file yang akan ditambah/diubah.
-   Laporkan risiko integrasi.

## Tahap 2 --- Foundation

-   Tambahkan routing dan navigasi modul.
-   Tambahkan permission/role.
-   Tambahkan database schema dan migration.
-   Tambahkan audit log.
-   Tambahkan shared components.

## Tahap 3 --- Data dan konservasi

-   Resource Registry.
-   Conservation Tracker.
-   Customary approval.
-   Harvest Management.
-   Raw Material Inventory.

## Tahap 4 --- Operasional produksi

-   Production Management.
-   Quality Assurance.
-   Product Catalog.
-   Batch management.

## Tahap 5 --- Pasar dan ketertelusuran

-   Marketplace integration.
-   Orders.
-   Supply chain.
-   QR traceability public page.

## Tahap 6 --- Keuangan dan dampak

-   Financial Ledger.
-   Benefit Sharing simulation and approval.
-   Conservation fund.
-   Impact Dashboard.
-   Reports.

## Tahap 7 --- QA dan deployment readiness

-   Unit tests.
-   Integration tests.
-   Permission tests.
-   Validation tests.
-   Responsive tests.
-   Lint, type-check, build.
-   Dokumentasi deployment dan konfigurasi.

Jika waktu atau kompleksitas terlalu besar, prioritaskan MVP berikut
terlebih dahulu: 1. Login dan role sesuai sistem yang ada. 2. Dashboard.
3. Resource Registry. 4. Conservation Tracker. 5. Harvest approval dan
pencatatan. 6. Raw Material Inventory. 7. Production Batch. 8. Quality
Assurance. 9. QR Traceability. 10. Audit Log.

Jangan mengklaim seluruh modul selesai jika baru MVP yang selesai.
Tandai fitur yang belum diimplementasikan sebagai **Coming Soon** atau
**Not Implemented**.

------------------------------------------------------------------------

# 14. Acceptance Criteria --- Kriteria Keberhasilan

Implementasi dapat dianggap layak untuk tahap MVP jika:

1.  Modul dapat dibuka dari navigasi BaMbooChain.
2.  Tidak merusak login dan fitur lama.
3.  Pengguna hanya dapat mengakses data sesuai role dan organisasi.
4.  Resource Registry dapat menyimpan data tanpa mengekspos lokasi
    sensitif.
5.  Status konservasi dapat mencegah pengajuan/persetujuan pengumpulan
    ketika dilarang.
6.  Harvest record terhubung ke sumber daya dan persetujuan yang sah.
7.  Batch bahan baku dan mutasi stok tercatat serta tidak memungkinkan
    stok negatif.
8.  Batch produksi terhubung ke batch bahan baku.
9.  Hasil uji mutu dapat diunggah dan divalidasi.
10. Produk yang belum memenuhi status mutu tidak dapat ditandai siap
    dijual.
11. QR menampilkan informasi publik yang aman dan tidak membocorkan
    lokasi gua.
12. Semua aksi penting tercatat di audit log.
13. Simulasi pembagian manfaat dapat dihitung dari parameter yang
    dikonfigurasi dan tidak mengeksekusi pembayaran.
14. Laporan dapat difilter dan diekspor sesuai fitur yang tersedia.
15. UI responsif dan memiliki loading, empty, success, serta error
    state.
16. Lint, type-check, test, dan build berjalan tanpa error kritis.

------------------------------------------------------------------------

# 15. Hal yang Belum Diketahui --- Jangan Mengarang

Informasi berikut belum tersedia dan harus diperlakukan sebagai data
yang belum dikonfirmasi:

-   Volume guano yang tersedia di Cibarani.
-   Batas pengumpulan yang aman secara ekologis.
-   Jenis kelelawar dan status perlindungannya.
-   Status hukum kawasan gua dan kewenangan pemanfaatan.
-   Hasil uji laboratorium guano.
-   Formula dan spesifikasi final produk.
-   Harga jual aktual.
-   Biaya produksi aktual.
-   Komitmen pembelian pasar.
-   Bentuk badan usaha pelaksana.
-   Perjanjian final pembagian manfaat.
-   Identitas/peran pihak tambahan yang sebelumnya disebut "Adasek".

Angka simulasi business plan yang dapat dimasukkan sebagai **parameter
awal DEMO/ASSUMPTION**, bukan data aktual:

  Parameter                                           Asumsi awal
  ----------------------------- ---------------------------------
  Estimasi investasi awal                           Rp670.000.000
  Harga jual rata-rata                                Rp15.000/kg
  Biaya variabel                                       Rp7.000/kg
  Biaya tetap bulanan awal                           Rp20.000.000
  Skenario penjualan stabil                        5.000 kg/bulan
  Usulan dana konservasi          10% surplus operasional positif
  Usulan alokasi Kasepuhan                                    50%
  Usulan alokasi ASPAI                                        30%
  Usulan alokasi program YSNJ                                 20%

Semua asumsi harus dapat diubah melalui konfigurasi dan diberi label
**ASUMSI --- BELUM DISEPAKATI**. Jangan menjadikannya angka tetap di
dalam source code.

------------------------------------------------------------------------

# 16. Output yang Harus Dihasilkan Agent

Setelah coding, berikan laporan akhir yang mencakup:

1.  Ringkasan arsitektur BaMbooChain yang ditemukan.
2.  Fitur yang berhasil dibuat.
3.  Fitur yang belum dibuat.
4.  Daftar file baru dan file yang diubah.
5.  Database migration dan cara menjalankannya.
6.  Environment variables baru (tanpa menampilkan secret).
7.  Cara menjalankan aplikasi secara lokal.
8.  Cara menguji setiap role.
9.  Hasil lint, type-check, test, dan build.
10. Risiko teknis dan rekomendasi tahap berikutnya.

Buat dokumentasi: - `docs/cibarani-guano-architecture.md` -
`docs/cibarani-guano-user-guide.md` -
`docs/cibarani-guano-implementation-status.md`

Jika proyek menggunakan Git: - Jangan commit otomatis kecuali diminta. -
Jangan push atau deploy ke production tanpa persetujuan eksplisit. -
Jangan mengubah konfigurasi production tanpa persetujuan.

------------------------------------------------------------------------

# 17. Instruksi Penutup

Mulai dengan **audit repository**, bukan langsung membuat file dan
komponen secara acak.

Setelah audit: 1. Jelaskan arsitektur yang ditemukan secara singkat. 2.
Ajukan rencana implementasi yang sesuai dengan repository. 3. Lanjutkan
implementasi bertahap tanpa menunggu konfirmasi untuk keputusan teknis
rutin. 4. Berhenti dan minta konfirmasi hanya jika diperlukan keputusan
yang berdampak pada data production, biaya layanan, perubahan arsitektur
besar, pembayaran, atau tindakan yang tidak dapat dibatalkan. 5.
Pastikan hasil akhir benar-benar terintegrasi ke BaMbooChain, bukan
sekadar prototype halaman statis.

**Target akhir:** CIBARANI GUANO menjadi modul operasional digital dalam
BaMbooChain yang membantu ASPAI, Kasepuhan Cibarani, YSNJ, badan usaha,
dan mitra bekerja secara transparan, aman, dapat ditelusuri, serta tetap
mengutamakan konservasi dan manfaat masyarakat.
