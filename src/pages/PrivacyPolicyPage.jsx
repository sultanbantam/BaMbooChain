import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicyPage = () => {
  const { t } = useLanguage();

  return (
    <div style={{ paddingTop: '170px', minHeight: '100vh', background: 'var(--bg-secondary, #f8f9fa)', paddingBottom: '60px' }}>
      <div className="container" style={{ padding: '40px 24px', background: 'var(--bg-card, white)', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', maxWidth: '850px', margin: '0 auto', border: '1px solid var(--border-color, #e9ecef)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{t('privacy_title')}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '30px' }}>Terakhir diperbarui: 4 Oktober 2026</p>

        <div style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary)' }}>1. Pengelola BambooChain</h2>
            <p style={{ margin: 0 }}>
              <strong>BambooChain</strong> adalah platform yang dikelola oleh <strong>Yayasan Sabumi Nusantara Jaya</strong>. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, melindungi, dan menghapus data pribadi pengguna ketika menggunakan BambooChain dan layanan autentikasi yang terhubung.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary)' }}>2. Informasi yang Kami Kumpulkan</h2>
            <p style={{ margin: '0 0 12px 0' }}>Kami dapat mengumpulkan informasi berikut ketika Anda menggunakan BambooChain:</p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li><strong>Facebook Login:</strong> ketika Anda memilih masuk dengan Facebook, kami menggunakan autentikasi resmi Facebook melalui Firebase Authentication. Data yang dapat diterima terbatas pada informasi yang Anda izinkan, seperti identitas akun Facebook, profil publik dasar (misalnya nama dan foto profil), serta alamat email apabila tersedia dari Facebook.</li>
              <li><strong>Google Login:</strong> informasi akun dasar yang diberikan melalui Firebase Authentication sesuai izin yang Anda berikan.</li>
              <li><strong>Informasi Autentikasi Pi Network:</strong> username Pi dan ID unik pengguna (UID) yang diperoleh melalui autentikasi resmi Pi SDK.</li>
              <li><strong>Data Akun Umum:</strong> nama, alamat email, nomor telepon, username, dan detail pendaftaran lain yang Anda berikan secara sukarela.</li>
              <li><strong>Data Transaksi Blockchain:</strong> alamat dompet digital dan catatan transaksi BMC yang dipublikasikan pada jaringan blockchain.</li>
              <li><strong>Data Observasi Bambu:</strong> koordinat lokasi dan foto rumpun bambu yang Anda kirimkan ketika berpartisipasi dalam modul kontribusi data.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary)' }}>3. Penggunaan Informasi</h2>
            <p style={{ margin: '0 0 12px 0' }}>Data digunakan untuk tujuan berikut:</p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>Mengautentikasi pengguna dan membuat atau menghubungkan akun BambooChain, termasuk melalui Facebook Login, Google, dan Pi Network.</li>
              <li>Menyediakan profil pengguna, fitur komunitas, marketplace, akademi, Bambupedia, dan layanan lain di dalam ekosistem BambooChain.</li>
              <li>Memproses transaksi atau aktivitas yang secara eksplisit diminta oleh pengguna.</li>
              <li>Melakukan audit, validasi data lapangan, keamanan, pencegahan penyalahgunaan, dan peningkatan kualitas layanan.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary)' }}>4. Facebook Login dan Firebase Authentication</h2>
            <p style={{ margin: 0 }}>
              Facebook Login digunakan hanya untuk mempermudah pendaftaran dan masuk ke BambooChain. Proses autentikasi ditangani melalui Firebase Authentication. BambooChain tidak meminta kata sandi Facebook pengguna. Kami tidak menggunakan Facebook Login untuk membaca posting, daftar teman, lokasi, tanggal lahir, likes, atau data Facebook lain yang tidak diperlukan untuk autentikasi.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary)' }}>5. Perlindungan & Keamanan Data</h2>
            <p style={{ margin: 0 }}>
              Kami menerapkan langkah keamanan yang wajar untuk melindungi data pengguna. Data profil aplikasi disimpan menggunakan Firebase/Firestore dengan mekanisme autentikasi dan aturan akses. Kunci privat atau passphrase dompet Pi tidak diminta untuk disimpan oleh BambooChain dan proses penandatanganan transaksi dilakukan sesuai mekanisme resmi penyedia terkait.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary)' }}>6. Berbagi Data</h2>
            <p style={{ margin: 0 }}>
              Kami tidak menjual data pribadi pengguna kepada pengiklan. Data dapat diproses oleh penyedia layanan teknis yang diperlukan untuk menjalankan BambooChain, seperti penyedia autentikasi, hosting, dan basis data, atau apabila diwajibkan oleh hukum. Data observasi lapangan yang dipublikasikan untuk kepentingan riset atau pemetaan akan diproses sesuai fungsi layanan dan pengaturan akses yang berlaku.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary)' }}>7. Hak Pengguna & Penghapusan Data</h2>
            <p style={{ margin: '0 0 12px 0' }}>
              Pengguna dapat meminta akses, koreksi, atau penghapusan data pribadi yang berada dalam kendali BambooChain. Permintaan dapat diajukan melalui email <strong>sabuminusantarajaya@gmail.com</strong>.
            </p>
            <p style={{ margin: 0 }}>
              Petunjuk khusus penghapusan data tersedia di <a href="/#/data-deletion" style={{ color: 'var(--primary)', fontWeight: '700' }}>halaman Penghapusan Data Pengguna</a>. Catatan transaksi yang telah dipublikasikan ke jaringan blockchain dapat bersifat tidak dapat diubah, tetapi data pribadi yang berada dalam sistem yang kami kendalikan akan ditangani sesuai permintaan yang terverifikasi dan kewajiban hukum yang berlaku.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary)' }}>8. Kontak</h2>
            <p style={{ margin: 0 }}>
              Pertanyaan mengenai privasi dan perlindungan data dapat dikirim ke <strong>Yayasan Sabumi Nusantara Jaya</strong> melalui email <strong>sabuminusantarajaya@gmail.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
