# BaMbooChain Platform - Yayasan Sabumi Nusantara Jaya

Selamat datang di repositori resmi platform digital **BaMbooChain**. Proyek ini merupakan antarmuka (frontend) modern untuk ekosistem ekonomi bambu terintegrasi, yang mencakup Marketplace, Bursa Komoditas (Bursa Bambu), dan Portal Pengetahuan (Wawasan).

## 🚀 Teknologi Utama (Tech Stack)
Proyek ini dibangun menggunakan standar pengembangan web modern:
- **Framework**: [React.js](https://reactjs.org/) (v18+)
- **Build Tool**: [Vite](https://vitejs.dev/) (Cepat dan Ringan)
- **Icons**: [Lucide-React](https://lucide.dev/)
- **Styling**: Vanilla CSS dengan variabel CSS (Design System)
- **Deployment**: Saat ini dikonfigurasi untuk GitHub Pages (melalui `gh-pages`)

## 🛠️ Persiapan Pengembangan (Local Setup)

Untuk menjalankan proyek ini di komputer lokal, pastikan Anda sudah menginstal **Node.js** (rekomendasi versi LTS).

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/sultanbantam/BaMbooChain.git
   cd BaMbooChain
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Mode Pengembangan**:
   ```bash
   npm run dev
   ```
   Akses di browser melalui: `http://localhost:5173`

## 📂 Struktur Proyek
Berikut adalah peta folder untuk memudahkan navigasi kode:
- `src/components/`: Komponen UI reusable (Navbar, Footer, AdSpace, ScrollToTop).
- `src/pages/`: Halaman utama (Beranda, Proyek, Wawasan, Dampak, Kontak).
- `src/pages/bamboochain/`: Fitur khusus ekosistem (MarketplacePage, WalletPage, dll).
- `src/assets/`: Gambar statis dan logo.
- `public/`: Aset publik (favicon, manifest).
- `src/App.jsx`: Routing utama aplikasi.
- `src/index.css`: Pusat Design System (Warna, Tipografi, Glassmorphism).

## 🌐 Produksi & Deployment (Ke bamboochain.id)

Untuk memindahkan website ke domain utama `bamboochain.id`, ikuti langkah berikut:

1. **Build Project**:
   Jalankan perintah berikut untuk menghasilkan folder produksi:
   ```bash
   npm run build
   ```
   Perintah ini akan membuat folder `dist/` di direktori utama.

2. **Upload ke Hosting**:
   Unggah seluruh isi folder `dist/` ke server web Anda (Public HTML).

3. **Catatan Base URL**:
   Saat ini aplikasi dikonfigurasi menggunakan `HashRouter` (dengan simbol `/#/` di URL) untuk kompatibilitas GitHub Pages. Jika domain utama mendukung routing server (History API), Anda bisa mempertimbangkan untuk bermigrasi ke `BrowserRouter` di `App.jsx`.

## 💡 Fitur Khusus & Simulasi
Saat ini aplikasi memiliki beberapa logika simulasi tingkat lanjut:
- **Marketplace**: Formulir pendaftaran produk dinamis dengan sistem harga ganda (IDR & BMC).
- **Bursa Bambu**: 
  - Sinkronisasi harga USDT/IDR real-time menggunakan **CoinGecko API**.
  - Simulasi fluktuasi harga komoditas global.
  - Alur simulasi Smart Contract & Escrow.

## 📝 Catatan untuk Tenaga Ahli
- **Backend**: Aplikasi ini saat ini masih bersifat **Frontend-Only**. Koneksi ke database (seperti Firebase/Supabase) atau Blockchain (Smart Contract) perlu diintegrasikan pada komponen form di `MarketplacePage.jsx`.
- **Styling**: Gunakan variabel CSS yang sudah didefinisikan di `index.css` (seperti `--primary`, `--secondary`, `--glass-bg`) untuk menjaga konsistensi desain.

---
Dikembangkan dengan ❤️ oleh **Yayasan Sabumi Nusantara Jaya** & **Antigravity AI**.
