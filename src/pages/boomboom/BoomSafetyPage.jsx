import React, { useEffect, useState } from 'react';
import { ShieldCheck, Share2, PhoneCall } from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import SosButton from '../../components/boomboom/SosButton';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

const useIsMobile = () => {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w <= 768;
};

const BoomSafetyPage = () => {
  const { drivers } = useBoomBoomStore();
  const isMobile = useIsMobile();
  const [trustedContact, setTrustedContact] = useState('Mang Deden (+62 812-9900-1122)');
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShareTrip = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  const features = [
    {
      icon: <Share2 size={22} />,
      iconBg: '#d1fae5', iconColor: '#059669',
      title: 'Bagikan Lokasi Real-Time',
      desc: 'Kirimkan tautan pelacakan kepada keluarga atau kontak tepercaya selama perjalanan berlangsung.',
      action: (
        <button
          onClick={handleShareTrip}
          style={{
            width: '100%', padding: '11px 14px', borderRadius: '12px', border: 'none',
            background: shareSuccess ? '#059669' : '#10b981', color: '#ffffff',
            fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', transition: 'background 0.2s'
          }}>
          {shareSuccess ? '✓ Tautan Terkirim!' : 'Salin Tautan Tracking'}
        </button>
      )
    },
    {
      icon: <PhoneCall size={22} />,
      iconBg: '#fef3c7', iconColor: '#b45309',
      title: 'Kontak Darurat Tepercaya',
      desc: 'Atur kontak yang menerima notifikasi otomatis saat sinyal SOS dipicu.',
      action: (
        <input
          type="text" value={trustedContact}
          onChange={e => setTrustedContact(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: '12px',
            border: '1.5px solid var(--border-color, #e2e8f0)',
            fontSize: '0.85rem', fontWeight: '700',
            background: 'var(--bg-secondary, #f8fafc)',
            color: 'var(--text-main, #0f172a)',
            boxSizing: 'border-box'
          }}
        />
      )
    },
    {
      icon: <ShieldCheck size={22} />,
      iconBg: '#cff4fc', iconColor: '#0891b2',
      title: 'Pengemudi 100% Terverifikasi',
      desc: `Semua ${drivers.length} mitra pengemudi melewati verifikasi KTP, SIM, dan konfirmasi BUMDes setempat.`,
      action: (
        <div style={{
          background: 'rgba(8,145,178,0.1)', color: '#0891b2',
          padding: '8px 14px', borderRadius: '10px',
          fontSize: '0.82rem', fontWeight: '800', textAlign: 'center'
        }}>
          {drivers.filter(d => d.status === 'ACTIVE').length} Pengemudi Aktif Terverifikasi
        </div>
      )
    },
  ];

  return (
    <div style={{
      background: 'var(--bg-color, #f8fafc)',
      color: 'var(--text-main, #0f172a)',
      minHeight: '100vh', paddingBottom: '64px'
    }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '16px 12px' : '24px 16px' }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: '#ffffff', borderRadius: '22px',
          padding: isMobile ? '20px 16px' : '26px 28px',
          marginBottom: '20px',
          boxShadow: '0 10px 28px rgba(6,78,59,0.22)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.18)', padding: '4px 11px', borderRadius: '14px', fontSize: '0.72rem', fontWeight: '800', color: '#a7f3d0', marginBottom: '10px' }}>
            <ShieldCheck size={13} /> PUSAT KEAMANAN BOOMSAFE
          </div>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: '900', margin: '0 0 8px', lineHeight: 1.15 }}>
            Keamanan Anda, Prioritas Utama
          </h1>
          <p style={{ fontSize: '0.87rem', color: '#ecfdf5', margin: '0 0 18px', lineHeight: 1.6, maxWidth: '480px' }}>
            Fitur keselamatan tingkat tinggi terintegrasi dengan jaringan kontak darurat dan operator lokal BUMDes.
          </p>
          <SosButton />
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '14px'
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: '18px', padding: isMobile ? '16px' : '20px 22px',
              boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
              border: '1px solid var(--border-color, #e2e8f0)',
              display: 'flex', flexDirection: 'column', gap: '10px'
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '14px',
                background: f.iconBg, color: f.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {f.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: '0 0 4px', color: 'var(--text-main, #0f172a)' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.55, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
              <div style={{ marginTop: 'auto' }}>
                {f.action}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BoomSafetyPage;
