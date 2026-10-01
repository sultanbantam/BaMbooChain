import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, PhoneCall, Share2, MapPin, UserX, AlertTriangle, CheckCircle2 } from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import SosButton from '../../components/boomboom/SosButton';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

const BoomSafetyPage = () => {
  const { drivers } = useBoomBoomStore();
  const [trustedContact, setTrustedContact] = useState('Mang Deden (+62 812-9900-1122)');
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShareTrip = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', paddingBottom: '60px' }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '1000px', margin: '24px auto', padding: '0 20px' }}>
        
        {/* SAFETY HERO BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: 'white',
          borderRadius: '28px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 12px 30px rgba(6, 78, 59, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: '800', color: '#a7f3d0', marginBottom: '8px' }}>
              <ShieldCheck size={18} /> PUSAT KEAMANAN BOOMSAFE
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 6px' }}>
              Keamanan Anda Prioritas Utama
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#ecfdf5', margin: 0, maxWidth: '520px' }}>
              Fitur keselamatan tingkat tinggi terintegrasi dengan jaringan kontak darurat dan operator lokal BUMDes.
            </p>
          </div>

          <SosButton />
        </div>

        {/* SAFETY FEATURES GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}>
          
          {/* FEATURE 1: SHARE LIVE LOCATION */}
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-color, #e2e8f0)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Share2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 6px', color: '#0f172a' }}>
                Bagikan Lokasi Real-Time
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                Kirimkan tautan pelacakan langsung kepada keluarga atau kontak tepercaya selama perjalanan.
              </p>
            </div>

            <button
              onClick={handleShareTrip}
              style={{
                marginTop: '16px',
                background: shareSuccess ? '#059669' : '#10b981',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '14px',
                fontWeight: '800',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {shareSuccess ? '✓ Tautan Terpisahkan Terkirim!' : 'Salin Tautan Tracking'}
            </button>
          </div>

          {/* FEATURE 2: TRUSTED EMERGENCY CONTACTS */}
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-color, #e2e8f0)'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <PhoneCall size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 6px', color: '#0f172a' }}>
              Kontak Darurat Tepercaya
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5', marginBottom: '12px' }}>
              Atur kontak yang akan menerima notifikasi otomatis saat sinyal SOS dipicu.
            </p>

            <input
              type="text"
              value={trustedContact}
              onChange={e => setTrustedContact(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: '700'
              }}
            />
          </div>

          {/* FEATURE 3: VERIFIED DRIVERS DIRECTORY */}
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-color, #e2e8f0)'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#cff4fc', color: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 6px', color: '#0f172a' }}>
              Pengemudi 100% Terverifikasi
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
              Semua mitra pengemudi melewati verifikasi identitas fisik KTP, SIM, dan konfirmasi BUMDes setempat.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BoomSafetyPage;
