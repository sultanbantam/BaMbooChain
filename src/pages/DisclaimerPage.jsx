import React from 'react';

const DisclaimerPage = () => {
  return (
    <div style={{ paddingTop: '170px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ padding: '40px 24px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', color: 'var(--text-main)', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>Disclaimer</h1>
        
        <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '20px' }}>
            Seluruh informasi yang disajikan pada website ini bersifat umum dan hanya untuk tujuan <strong>edukasi serta penyediaan informasi</strong> mengenai potensi industri bambu.
          </p>

          <p style={{ marginBottom: '20px' }}>
            Konten pada situs web ini <strong>tidak dimaksudkan sebagai ajakan, penawaran, atau rekomendasi</strong> untuk melakukan investasi dalam bentuk apapun.
          </p>

          <p style={{ marginBottom: '20px' }}>
            Setiap keputusan investasi atau partisipasi ekonomi merupakan tanggung jawab pribadi masing-masing pihak. Pengunjung disarankan untuk melakukan kajian mandiri dan/atau berkonsultasi dengan penasihat profesional bersertifikat sebelum mengambil keputusan finansial apapun.
          </p>

          <p style={{ marginBottom: '20px' }}>
            Pengelola website (Yayasan Sabumi Nusantara Jaya) <strong>tidak bertanggung jawab</strong> atas segala bentuk risiko, kerugian materiil, maupun imateriil yang mungkin timbul dari penggunaan informasi maupun interpretasi data yang tersedia.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default DisclaimerPage;
