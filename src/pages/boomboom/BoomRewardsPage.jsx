import React, { useEffect, useState } from 'react';
import { Leaf, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
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

const BoomRewardsPage = () => {
  const { rewards, claimReward } = useBoomBoomStore();
  const [claimingId, setClaimingId] = useState(null);
  const isMobile = useIsMobile();

  const handleClaim = (rewardId) => {
    setClaimingId(rewardId);
    setTimeout(() => {
      claimReward(rewardId);
      setClaimingId(null);
    }, 1200);
  };

  const totalBmcEarned = rewards.reduce((acc, r) => acc + r.bmc_amount, 0);
  const totalBmcClaimed = rewards.filter(r => r.status === 'CLAIMED').reduce((acc, r) => acc + r.bmc_amount, 0);
  const totalBmcPending = rewards.filter(r => r.status === 'CLAIMABLE').reduce((acc, r) => acc + r.bmc_amount, 0);

  return (
    <div style={{
      background: 'var(--bg-color, #f8fafc)',
      color: 'var(--text-main, #0f172a)',
      minHeight: '100vh',
      paddingBottom: '64px'
    }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '16px 12px' : '24px 16px' }}>

        {/* ══ HERO BANNER ══ */}
        <div style={{
          background: 'linear-gradient(135deg, #78350f 0%, #b45309 60%, #d97706 100%)',
          color: '#ffffff', borderRadius: '22px',
          padding: isMobile ? '20px 16px' : '26px 28px',
          marginBottom: '20px',
          boxShadow: '0 10px 28px rgba(180,83,9,0.25)',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.18)', padding: '4px 11px', borderRadius: '14px', fontSize: '0.72rem', fontWeight: '800', color: '#fef08a', marginBottom: '10px' }}>
            <Sparkles size={13} /> LEDGER REWARD MOBILITAS BMC
          </div>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '1.9rem', fontWeight: '900', margin: '0 0 6px', color: '#ffffff', lineHeight: 1.15 }}>
            BMC Token Reward Hub
          </h1>
          <p style={{ fontSize: '0.87rem', color: '#fef3c7', margin: '0 0 18px', lineHeight: 1.6, maxWidth: '520px' }}>
            Kumpulkan insentif BMC setiap kali Anda menggunakan mobilitas hijau, berbagi tumpangan, atau berkontribusi dalam komunitas.
          </p>

          {/* Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(88px, 1fr))',
            gap: '10px'
          }}>
            {[
              { label: 'Total Terkumpul', value: `${totalBmcEarned} BMC`, highlight: true },
              { label: 'Siap Diklaim', value: `${totalBmcPending} BMC`, highlight: false },
              { label: 'Telah Diklaim', value: `${totalBmcClaimed} BMC`, highlight: false },
            ].map((s, i) => (
              <div key={i} style={{
                background: i === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                borderRadius: '14px', padding: isMobile ? '10px' : '14px',
                border: i === 0 ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(6px)'
              }}>
                <div style={{ fontSize: isMobile ? '0.6rem' : '0.68rem', fontWeight: '800', color: '#fde68a', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: isMobile ? '0.95rem' : '1.2rem', fontWeight: '900', color: '#ffffff' }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ GREEN TRIP SCORE ══ */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '18px', padding: isMobile ? '14px' : '20px 24px',
          marginBottom: '18px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
          border: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '16px', flexShrink: 0,
              background: '#d1fae5', color: '#059669',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Leaf size={26} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#047857', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>
                Green Trip Score
              </div>
              <div style={{ fontSize: isMobile ? '0.95rem' : '1.05rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>
                Penjaga Bumi Nusantara • 180 Poin
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #64748b)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={12} color="#10b981" /> Est. ~2.8 kg CO₂ terhindar
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.7rem', background: '#fef3c7', color: '#92400e', padding: '5px 10px', borderRadius: '10px', fontWeight: '800', flexShrink: 0, whiteSpace: 'nowrap' }}>
            Estimasi (Bukan Kredit Karbon)
          </span>
        </div>

        {/* ══ REWARD LEDGER ══ */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '20px', padding: isMobile ? '14px' : '22px 24px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
          border: '1px solid var(--border-color, #e2e8f0)'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 14px', color: 'var(--text-main, #0f172a)' }}>
            Buku Besar Reward (Ledger)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rewards.map(r => (
              <div key={r.reward_id} style={{
                background: 'var(--bg-secondary, #f8fafc)',
                borderRadius: '14px', padding: isMobile ? '12px' : '14px 18px',
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: '10px',
                border: '1px solid var(--border-color, #e2e8f0)'
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.87rem', fontWeight: '800', color: '#b45309', marginBottom: '2px' }}>
                    {r.reward_label}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)' }}>
                    {new Date(r.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#d97706' }}>
                    +{r.bmc_amount} BMC
                  </div>

                  {r.status === 'CLAIMABLE' ? (
                    <button
                      onClick={() => handleClaim(r.reward_id)}
                      disabled={claimingId === r.reward_id}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: '#ffffff', border: 'none',
                        padding: '7px 14px', borderRadius: '10px',
                        fontWeight: '800', fontSize: '0.78rem',
                        cursor: claimingId === r.reward_id ? 'wait' : 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {claimingId === r.reward_id ? 'Memproses...' : 'Klaim BMC'}
                    </button>
                  ) : (
                    <span style={{
                      background: 'rgba(16,185,129,0.14)', color: '#047857',
                      padding: '6px 12px', borderRadius: '10px',
                      fontSize: '0.78rem', fontWeight: '800',
                      display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap'
                    }}>
                      <CheckCircle2 size={13} /> Diklaim
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BoomRewardsPage;
