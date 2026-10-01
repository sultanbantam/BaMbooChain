import React, { useEffect, useState } from 'react';
import { History, MapPin, Star, Download } from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
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

const statusColors = {
  completed: { bg: 'rgba(16,185,129,0.14)', color: '#047857', label: 'Selesai' },
  cancelled: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626', label: 'Dibatalkan' },
  in_progress: { bg: 'rgba(245,159,0,0.14)', color: '#b45309', label: 'Berlangsung' },
};

const BoomTripsPage = () => {
  const { trips } = useBoomBoomStore();
  const isMobile = useIsMobile();

  return (
    <div style={{
      background: 'var(--bg-color, #f8fafc)',
      color: 'var(--text-main, #0f172a)',
      minHeight: '100vh',
      paddingBottom: '64px'
    }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '16px 12px' : '24px 16px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '14px',
            background: 'rgba(16,185,129,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <History size={22} color="#10b981" />
          </div>
          <div>
            <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.6rem', fontWeight: '900', margin: 0, color: 'var(--text-main, #0f172a)' }}>
              Riwayat Perjalanan
            </h1>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted, #64748b)' }}>
              {trips.length} perjalanan tercatat
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {trips.map(t => {
            const s = statusColors[t.status] || statusColors.completed;
            return (
              <div key={t.trip_id} style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '20px',
                padding: isMobile ? '16px' : '20px 24px',
                boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
                border: '1px solid var(--border-color, #e2e8f0)',
                display: 'flex', flexDirection: 'column', gap: '12px'
              }}>
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: '900',
                      background: 'rgba(16,185,129,0.14)', color: '#047857',
                      padding: '3px 9px', borderRadius: '8px'
                    }}>
                      {t.service_type}
                    </span>
                    <span style={{
                      fontSize: '0.73rem', fontWeight: '700',
                      background: s.bg, color: s.color,
                      padding: '3px 9px', borderRadius: '8px'
                    }}>
                      {s.label}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)', whiteSpace: 'nowrap' }}>
                    {new Date(t.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Route */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin size={15} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)', fontWeight: '700', marginBottom: '1px' }}>PENJEMPUTAN</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main, #0f172a)', lineHeight: 1.3 }}>{t.pickup_address}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin size={15} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)', fontWeight: '700', marginBottom: '1px' }}>TUJUAN</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main, #0f172a)', lineHeight: 1.3 }}>{t.destination_address}</div>
                    </div>
                  </div>
                </div>

                {/* Footer info */}
                <div style={{
                  background: 'var(--bg-secondary, #f8fafc)',
                  borderRadius: '14px', padding: '12px 14px',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', flexWrap: 'wrap', gap: '10px',
                  border: '1px solid var(--border-color, #e2e8f0)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-main, #0f172a)', fontWeight: '700' }}>
                      {t.driver_name}
                    </div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-muted, #64748b)' }}>
                      {t.vehicle_model} • {t.plate_number}
                    </div>
                    <div style={{ fontSize: '0.73rem', color: '#b45309', fontWeight: '700', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={11} fill="#b45309" color="#b45309" /> {t.rating_given} bintang
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)' }}>Total Bayar</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--primary, #047857)' }}>
                      Rp {t.final_fare.toLocaleString('id-ID')}
                    </div>
                    <button style={{
                      marginTop: '4px', fontSize: '0.7rem', fontWeight: '700',
                      color: '#047857', background: 'rgba(16,185,129,0.1)',
                      border: 'none', padding: '3px 8px', borderRadius: '6px',
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px'
                    }}>
                      <Download size={10} /> Struk
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BoomTripsPage;
