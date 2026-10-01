import React from 'react';
import { HelpCircle, PhoneCall, MessageCircle, FileText, ChevronDown } from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';

const BoomHelpPage = () => {
  const faqs = [
    {
      q: 'Bagaimana cara memesan perjalanan BoomBoom?',
      a: 'Cukup buka menu "Pesan Perjalanan", masukkan lokasi jemput dan tujuan Anda, pilih motor (BoomRide) atau mobil (BoomCar), lalu tekan tombol besar "PESAN SEKARANG".'
    },
    {
      q: 'Apakah pembayaran bisa menggunakan uang tunai?',
      a: 'Bisa! Anda dapat memilih pembayaran tunai langsung kepada pengemudi atau menggunakan QRIS/Transfer Bank.'
    },
    {
      q: 'Apa itu Token BMC dan bagaimana cara mendapatkannya?',
      a: 'Token BMC adalah hadiah/reward komunitas yang Anda dapatkan setiap kali menyelesaikan perjalanan atau memilih kendaraan ramah lingkungan. Token dapat diklaim di menu Reward BMC.'
    },
    {
      q: 'Bagaimana cara mendaftar menjadi Pengemudi?',
      a: 'Buka menu "Jadi Pengemudi", isi data KTP, SIM, dan kendaraan Anda. Pengurus BUMDes setempat akan memverifikasi dokumen Anda.'
    }
  ];

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', paddingBottom: '60px' }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '900px', margin: '24px auto', padding: '0 20px' }}>
        
        {/* HEADER FOR ACCESSIBILITY / LOW DIGITAL LITERACY / ELDERLY USERS */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: 'white',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <HelpCircle size={48} color="#a7f3d0" style={{ margin: '0 auto 12px' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', margin: '0 0 8px' }}>
            Pusat Bantuan BoomBoom
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#ecfdf5', margin: 0 }}>
            Petunjuk mudah untuk semua pengguna. Bahasa Indonesia sederhana & tombol besar.
          </p>
        </div>

        {/* DIRECT WHATSAPP / CALL SUPPORT OFFICER BUTTONS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Petugas%20BoomBoom%20Saya%20Butuh%20Bantuan"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#25d366',
              color: 'white',
              borderRadius: '20px',
              padding: '20px',
              textDecoration: 'none',
              fontWeight: '900',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '0 6px 20px rgba(37, 211, 102, 0.3)'
            }}
          >
            <MessageCircle size={28} /> Chat WhatsApp Petugas
          </a>

          <a
            href="tel:+6281234567890"
            style={{
              background: '#10b981',
              color: 'white',
              borderRadius: '20px',
              padding: '20px',
              textDecoration: 'none',
              fontWeight: '900',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)'
            }}
          >
            <PhoneCall size={28} /> Telepon Layanan Suara
          </a>
        </div>

        {/* FAQS ACCORDION */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
          border: '1px solid var(--border-color, #e2e8f0)'
        }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 20px', color: '#0f172a' }}>
            Pertanyaan Yang Sering Diajukan (FAQ)
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((f, i) => (
              <div key={i} style={{
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '18px',
                border: '1px solid #cbd5e1'
              }}>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#047857', marginBottom: '8px' }}>
                  {f.q}
                </div>
                <div style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6' }}>
                  {f.a}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BoomHelpPage;
