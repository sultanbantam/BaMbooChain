import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div style={{ paddingTop: '170px', minHeight: '100vh', background: 'var(--bg-secondary, #f8f9fa)', paddingBottom: '60px' }}>
      <div className="container" style={{ padding: '40px 24px', background: 'var(--bg-card, white)', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto', border: '1px solid var(--border-color, #e9ecef)' }}>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '30px' }}>Terakhir diperbarui: 28 Mei 2026</p>
        
        <div style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary)' }}>1. Informasi yang Kami Kumpulkan</h2>
            <p style={{ margin: '0 0 12px 0' }}>Kami mengumpulkan informasi dari Anda ketika Anda berinteraksi dengan aplikasi BaMbooChain:</p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li><strong>Informasi Autentikasi Pi Network:</strong> Username Pi dan ID unik pengguna (UID) yang diperoleh secara aman melalui autentikasi resmi Pi SDK.</li>
              <li><strong>Data Akun Umum:</strong> Nama, alamat email, nomor telepon, dan detail pendaftaran lainnya yang Anda sediakan secara sukarela jika mendaftar di luar Pi Browser.</li>
              <li><strong>Data Transaksi Blockchain:</strong> Alamat dompet digital (wallet address) dan riwayat transaksi BMC yang dilakukan secara publik di jaringan blockchain (Testnet/Mainnet).</li>
              <li><strong>Data Observasi Bambu:</strong> Koordinat GPS (geolocational data) dan foto-foto rumpun bambu yang Anda kirimkan ketika berpartisipasi dalam modul kontribusi data taksonomi.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary)' }}>2. Penggunaan Informasi Anda</h2>
            <p style={{ margin: '0 0 12px 0' }}>Data yang kami kumpulkan digunakan untuk tujuan berikut:</p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>Menyediakan fungsionalitas login otomatis yang aman menggunakan Pi SDK.</li>
              <li>Memproses pembayaran User-to-App (pembayaran koin Pi ke aplikasi) dan transaksi token BMC.</li>
              <li>Melakukan audit dan verifikasi data lapangan oleh para Validator terakreditasi sebelum menyalurkan imbalan (reward) BMC.</li>
              <li>Meningkatkan kualitas algoritma pemetaan dan analisis taksonomi bambu nasional.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary)' }}>3. Perlindungan & Keamanan Data</h2>
            <p style={{ margin: 0 }}>
              Kami berkomitmen untuk melindungi informasi Anda. Seluruh kunci privat (passphrase) dompet Pi Anda tidak pernah dikirimkan atau disimpan di server kami; proses penandatanganan transaksi diselesaikan sepenuhnya di sisi klien (client-side) di dalam interface aman Pi Browser. Data profil Anda disimpan menggunakan protokol basis data Firebase dengan aturan keamanan akses (Firestore Security Rules) yang ketat guna mencegah kebocoran data.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary)' }}>4. Bagikan Data & Kerahasiaan</h2>
            <p style={{ margin: 0 }}>
              Kami tidak menjual, menyewakan, atau memberikan data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran. Data geolocational yang Anda unggah hanya dibagikan secara anonim dalam bentuk peta sebaran riset taksonomi, dan foto pendukung hanya dapat diakses oleh validator terverifikasi yang terikat perjanjian kerahasiaan (Non-Disclosure Agreement).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary)' }}>5. Hak Pengguna & Penghapusan Akun</h2>
            <p style={{ margin: 0 }}>
              Pengguna memiliki hak penuh untuk memeriksa, memperbarui, atau meminta penghapusan permanen atas data pribadi yang disimpan di server kami. Anda dapat menghubungi administrator melalui email resmi di <strong>sabuminusantarajaya@gmail.com</strong> untuk mengajukan proses penghapusan data akun Anda.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
