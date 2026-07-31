# PROMPM: Implementasi Push Notifikasi PWA (Progressive Web App)

## 1. Peran Anda
Anda adalah **Fullstack Developer & AI Agent**. Tugas Anda adalah membuat kode aplikasi web lengkap yang mampu mengirim dan menerima notifikasi push di perangkat Android/iOS, **meskipun aplikasi sedang tertutup** (background) atau **perangkat sedang offline** (notifikasi akan tertunda dan masuk saat koneksi kembali).

## 2. Tujuan Proyek
Membangun demo aplikasi PWA dengan fitur:
- Installable ke layar beranda (Home Screen).
- Menerima notifikasi push dari server.
- Menampilkan notifikasi di sistem notifikasi HP.
- Menangani klik notifikasi (misal membuka halaman tertentu).

## 3. Spesifikasi Teknis Wajib
- **Frontend**: HTML, CSS, JavaScript (Vanilla).
- **Backend**: Node.js dengan Express.js (atau PHP jika lebih memungkinkan, pilih Node.js agar seragam).
- **Library**: Gunakan `web-push` untuk sisi server (Node.js).
- **Keamanan**: Sertakan petunjuk penggunaan **VAPID keys** (publik & privat).
- **Protokol**: Wajib menggunakan HTTPS (sertakan cara menjalankan lokal dengan `localhost` yang diperbolehkan, atau menggunakan ngrok).

## 4. Struktur File yang Harus Dibuat
Buatlah kode untuk file-file berikut dalam satu proyek terstruktur:

1.  **`manifest.json`** – Konfigurasi nama, ikon, dan theme color PWA.
2.  **`sw.js`** (Service Worker) – Bertugas:
    - Menangani event `install` dan `activate`.
    - Menangani event `push` (menampilkan notifikasi).
    - Menangani event `notificationclick` (aksi saat notifikasi diklik).
3.  **`index.html`** – Halaman utama yang berisi:
    - Tombol "Minta Izin Notifikasi".
    - Tombol "Kirim Notifikasi Uji Coba" (memanggil endpoint backend).
    - Status koneksi Service Worker.
4.  **`client.js`** – Skrip sisi klien untuk:
    - Mendaftarkan Service Worker.
    - Meminta izin notifikasi (`Notification.requestPermission`).
    - Melanggan ke Push Service (`PushManager.subscribe`) menggunakan VAPID public key.
    - Mengirim subscription object ke server (via POST `/subscribe`).
5.  **`server.js`** – Skrip sisi server (Express) dengan endpoint:
    - `POST /subscribe` – Menyimpan subscription data (cukup di memory array saja, tidak perlu database).
    - `POST /send-notification` – Menerima payload pesan, lalu mengirim notifikasi ke semua subscription yang tersimpan menggunakan `web-push.sendNotification()`.

## 5. Instruksi Detail untuk Agent

### A. Alur Kerja (Workflow)
Jelaskan secara runtut dalam kode komentar atau README:
1. Generate VAPID keys.
2. Jalankan server backend.
3. Buka `index.html` via HTTPS (gunakan `https-localhost` atau deploy).
4. Klik tombol izinkan notifikasi.
5. Kirim notifikasi dari server.

### B. Kode Service Worker (`sw.js`)
Pastikan terdapat:
- `self.addEventListener('push', function(event) { ... })` yang mengambil data dari `event.data.json()` dan menampilkan notifikasi dengan opsi `badge`, `icon`, `vibrate`, dan `data.url`.
- `self.addEventListener('notificationclick', function(event) { ... })` yang menutup notifikasi dan membuka window ke URL tertentu (misal root website).

### C. Kode Server (`server.js`)
- Gunakan `web-push.setVapidDetails()`.
- Sediakan logging yang jelas di console untuk setiap notifikasi terkirim.
- Sediakan fallback error handling jika subscription expired.

### D. Catatan untuk Offline
Jelaskan secara eksplisit dalam output:
- Bahwa notifikasi yang dikirim saat HP mati akan disimpan oleh *Push Service* (seperti FCM) dan dikirim ulang saat HP online kembali (tanpa perlu kode tambahan dari kita, ini sudah ditangani oleh browser/OS).

## 6. Format Output yang Diharapkan
Berikan jawaban dalam bentuk:
1. **Struktur folder** (tree).
2. **Seluruh kode sumber** lengkap (copy-paste ready) untuk setiap file.
3. **Langkah menjalankan** (Startup Guide):
   - Instal dependensi (`npm install express web-push`).
   - Generate VAPID (bisa via command `npx web-push generate-vapid-keys`).
   - Jalankan server (`node server.js`).
   - Cara mengakses agar notifikasi berfungsi (gunakan `ngrok http 3000` atau `localhost` dengan sertifikat).

## 7. Bahasa
Tuliskan seluruh kode, komentar, dan penjelasan dalam **Bahasa Indonesia** agar mudah dipahami oleh pengguna akhir.

## 8. Constraints / Batasan
- Jangan menggunakan database eksternal (cukup penyimpanan di memory server).
- Pastikan kode kompatibel dengan Chrome untuk Android dan Safari untuk iOS (iOS 16.4+).
- Sertakan placeholder untuk ikon (gunakan icon berukuran 192x192 px dengan base64 sederhana atau link placeholder).

--- 
**Catatan untuk Agent**: Tolong hasilkan kode yang bersih, terstruktur, dan aman (validasi input minimal). Fokus pada fungsionalitas notifikasi yang stabil.