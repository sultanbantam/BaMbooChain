import React from 'react';
import { History, MapPin } from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

const BoomTripsPage = () => {
  const { trips } = useBoomBoomStore();

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', color: 'var(--text-main, #0f172a)', minHeight: '100vh', paddingBottom: '60px' }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '950px', margin: '24px auto', padding: '0 16px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <History size={28} color="#10b981" />
          <h1 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0, color: 'var(--text-main, #0f172a)' }}>
            Riwayat Perjalanan & Struk
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {trips.map(t => (
            <div key={t.trip_id} style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
              border: '1px solid var(--border-color, #cbd5e1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '900', background: 'rgba(16, 185, 129, 0.18)', color: 'var(--primary, #047857)', padding: '4px 10px', borderRadius: '10px' }}>
                    {t.service_type}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted, #64748b)' }}>
                    ID: {t.trip_id}
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)' }}>
                  {new Date(t.created_at).toLocaleString('id-ID')}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', fontWeight: '700' }}>PENJEMPUTAN</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main, #0f172a)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="#10b981" /> {t.pickup_address}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', fontWeight: '700' }}>TUJUAN</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main, #0f172a)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="#ef4444" /> {t.destination_address}
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-secondary, #f8fafc)',
                padding: '12px 16px',
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                border: '1px solid var(--border-color, #cbd5e1)'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>Pengemudi: <strong style={{ color: 'var(--text-main)' }}>{t.driver_name}</strong> ({t.vehicle_model} - {t.plate_number})</div>
                  <div style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: '700' }}>Rating Diberikan: ⭐ {t.rating_given}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>Total Pembayaran (IDR)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--primary, #047857)' }}>
                    Rp {t.final_fare.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BoomTripsPage;
