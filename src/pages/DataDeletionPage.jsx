import React from 'react';

const DataDeletionPage = () => {
  const email = 'sabuminusantarajaya@gmail.com';

  return (
    <div style={{ paddingTop: '170px', minHeight: '100vh', background: 'var(--bg-secondary, #f8f9fa)', paddingBottom: '60px' }}>
      <div className="container" style={{ padding: '40px 24px', background: 'var(--bg-card, white)', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', maxWidth: '850px', margin: '0 auto', border: '1px solid var(--border-color, #e9ecef)' }}>
        <h1 style={{ fontSize: '2.35rem', fontWeight: '900', marginBottom: '10px', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
          Penghapusan Data Pengguna
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '28px' }}>
          User Data Deletion Instructions — BambooChain
        </p>

        <div style={{ fontSize: '1.02rem', color: 'var(--text-main)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '10px', color: 'var(--primary)' }}>Pengelola layanan</h2>
            <p style={{ margin: 0 }}>
              BambooChain adalah platform yang dikelola oleh <strong>Yayasan Sabumi Nusantara Jaya</strong>. Halaman ini menjelaskan cara meminta penghapusan data pribadi yang terkait dengan akun BambooChain, termasuk akun yang dibuat atau dihubungkan melalui Facebook Login.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '10px', color: 'var(--primary)' }}>Cara meminta penghapusan data</h2>
            <ol style={{ paddingLeft: '22px', margin: 0 }}>
              <li>Kirim email ke <strong>{email}</strong> dengan subjek <strong>“Permintaan Penghapusan Data BambooChain”</strong>.</li>
              <li>Cantumkan alamat email akun BambooChain Anda dan nama/username yang digunakan pada platform agar kami dapat menemukan akun yang benar.</li>
              <li>Jika akun dibuat melalui Facebook Login, sebutkan bahwa permintaan terkait Facebook Login. Jangan mengirim kata sandi, token akses, atau data rahasia lainnya.</li>
              <li>Kami dapat meminta verifikasi identitas yang wajar sebelum memproses permintaan untuk mencegah penghapusan akun oleh pihak yang tidak berwenang.</li>
            </ol>
            <p style={{ margin: '14px 0 0 0' }}>
              <a href={`mailto:${email}?subject=Permintaan%20Penghapusan%20Data%20BambooChain`} style={{ color: 'var(--primary)', fontWeight: '700' }}>
                Kirim permintaan penghapusan data
              </a>
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '10px', color: 'var(--primary)' }}>Data yang akan ditangani</h2>
            <p style={{ margin: 0 }}>
              Setelah permintaan terverifikasi, kami akan menghapus atau menganonimkan data pribadi akun yang berada dalam kendali BambooChain, termasuk profil pengguna dan hubungan autentikasi yang relevan, sejauh tidak ada kewajiban hukum atau kebutuhan keamanan yang mengharuskan penyimpanan terbatas.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '10px', color: 'var(--primary)' }}>Catatan tentang data blockchain</h2>
            <p style={{ margin: 0 }}>
              Catatan transaksi yang telah dipublikasikan ke jaringan blockchain bersifat terdesentralisasi dan pada umumnya tidak dapat dihapus atau diubah oleh BambooChain. Kami tetap akan menghapus atau memisahkan data pribadi yang berada dalam sistem yang kami kendalikan sejauh memungkinkan.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '10px', color: 'var(--primary)' }}>English summary</h2>
            <p style={{ margin: 0 }}>
              To request deletion of personal data associated with your BambooChain account, including an account created or connected using Facebook Login, email <strong>{email}</strong> with the subject <strong>“BambooChain Data Deletion Request”</strong>. Include the email address and username associated with your BambooChain account. Do not send passwords or access tokens. BambooChain is operated by <strong>Yayasan Sabumi Nusantara Jaya</strong>.
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--border-color, #e9ecef)', paddingTop: '20px' }}>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Untuk informasi lebih lanjut mengenai pengumpulan dan penggunaan data, baca <a href="/#/privacy" style={{ color: 'var(--primary)', fontWeight: '700' }}>Kebijakan Privasi BambooChain</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DataDeletionPage;
