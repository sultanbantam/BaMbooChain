import React, { useEffect, useState } from 'react';
import { HelpCircle, PhoneCall, MessageCircle } from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';

const useIsMobile = () => {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w <= 768;
};

const faqs = [
  {
    q: 'Bagaimana cara memesan perjalanan BoomBoom?',
    a: 'Buka menu "Pesan Perjalanan", masukkan lokasi jemput dan tujuan Anda, pilih layanan BoomRide (motor) atau BoomCar (mobil), lalu tekan tombol "PESAN SEKARANG".'
  },
  {
    q: 'Apakah pembayaran bisa menggunakan uang tunai?',
    a: 'Bisa! Anda dapat memilih pembayaran tunai langsung kepada pengemudi atau menggunakan QRIS/Transfer Bank.'
  },
  {
    q: 'Apa itu Token BMC dan bagaimana cara mendapatkannya?',
    a: 'Token BMC adalah reward komunitas yang Anda dapatkan setiap menyelesaikan perjalanan atau memilih kendaraan ramah lingkungan. Token dapat diklaim di menu Reward BMC.'
  },
  {
    q: 'Bagaimana cara mendaftar menjadi Pengemudi?',
    a: 'Buka menu "Jadi Pengemudi", isi data KTP, SIM, dan kendaraan Anda. Pengurus BUMDes setempat akan memverifikasi dokumen Anda dalam 1–3 hari kerja.'
  },
  {
    q: 'Bagaimana jika pengemudi tidak muncul atau terlambat?',
    a: 'Gunakan tombol SOS atau chat WhatsApp petugas. Kami akan merespons dalam 5 menit dan membantu Anda mendapatkan pengemudi pengganti.'
  },
];

const BoomHelpPage = () => {
  const isMobile = useIsMobile();
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div style={{
      background: 'var(--bg-color, #f8fafc)',
      color: 'var(--text-main, #0f172a)',
      minHeight: '100vh', paddingBottom: '64px'
    }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: isMobile ? '16px 12px' : '24px 16px' }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: '#ffffff', borderRadius: '22px',
          padding: isMobile ? '22px 18px' : '28px 32px',
          marginBottom: '18px', textAlign: 'center'
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
          }}>
            <HelpCircle size={32} color="#a7f3d0" />
          </div>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: '900', margin: '0 0 8px', lineHeight: 1.15 }}>
            Pusat Bantuan BoomBoom
          </h1>
          <p style={{ fontSize: isMobile ? '0.88rem' : '1rem', color: '#ecfdf5', margin: 0, lineHeight: 1.6, maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
            Petunjuk mudah dalam Bahasa Indonesia sederhana untuk semua pengguna.
          </p>
        </div>

        {/* Contact Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Petugas%20BoomBoom%20Saya%20Butuh%20Bantuan"
            target="_blank" rel="noopener noreferrer"
            style={{
              background: '#25d366', color: '#ffffff',
              borderRadius: '16px', padding: isMobile ? '16px' : '18px 20px',
              textDecoration: 'none', fontWeight: '900',
              fontSize: isMobile ? '1rem' : '1.05rem',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '10px',
              boxShadow: '0 6px 20px rgba(37,211,102,0.28)'
            }}
          >
            <MessageCircle size={24} /> Chat WhatsApp Petugas
          </a>

          <a
            href="tel:+6281234567890"
            style={{
              background: '#10b981', color: '#ffffff',
              borderRadius: '16px', padding: isMobile ? '16px' : '18px 20px',
              textDecoration: 'none', fontWeight: '900',
              fontSize: isMobile ? '1rem' : '1.05rem',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '10px',
              boxShadow: '0 6px 20px rgba(16,185,129,0.28)'
            }}
          >
            <PhoneCall size={24} /> Telepon Layanan Suara
          </a>
        </div>

        {/* FAQ Accordion */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '20px', padding: isMobile ? '16px' : '24px 28px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
          border: '1px solid var(--border-color, #e2e8f0)'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 16px', color: 'var(--text-main, #0f172a)' }}>
            Pertanyaan yang Sering Diajukan
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((f, i) => (
              <div
                key={i}
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{
                  background: 'var(--bg-secondary, #f8fafc)',
                  borderRadius: '14px', padding: '14px 16px',
                  border: `1px solid ${openIdx === i ? '#10b981' : 'var(--border-color, #e2e8f0)'}`,
                  cursor: 'pointer', transition: 'border-color 0.2s'
                }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', gap: '10px'
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#047857', lineHeight: 1.4 }}>
                    {f.q}
                  </div>
                  <span style={{
                    fontSize: '1.1rem', color: 'var(--text-muted, #94a3b8)',
                    transition: 'transform 0.2s', transform: openIdx === i ? 'rotate(180deg)' : 'none',
                    flexShrink: 0, lineHeight: 1
                  }}>▾</span>
                </div>
                {openIdx === i && (
                  <div style={{
                    fontSize: '0.87rem', color: 'var(--text-muted, #64748b)',
                    lineHeight: 1.65, marginTop: '10px',
                    paddingTop: '10px', borderTop: '1px solid var(--border-color, #e2e8f0)'
                  }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BoomHelpPage;
