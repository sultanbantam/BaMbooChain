import React, { useState } from 'react';
import { Award, Leaf, CheckCircle2, ShieldAlert, Sparkles, ArrowUpRight, Zap } from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

const BoomRewardsPage = () => {
  const { rewards, claimReward } = useBoomBoomStore();
  const [claimingId, setClaimingId] = useState(null);

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
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', paddingBottom: '60px' }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '1000px', margin: '24px auto', padding: '0 20px' }}>
        
        {/* REWARD HERO BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #78350f 0%, #b45309 60%, #d97706 100%)',
          color: 'white',
          borderRadius: '28px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 12px 30px rgba(180, 83, 9, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: '800', color: '#fef08a', marginBottom: '8px' }}>
              <Sparkles size={16} /> LEDGER REWARD MOBILITAS BMC
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 6px' }}>
              BMC Token Reward Hub
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#fef3c7', margin: 0, maxWidth: '540px' }}>
              Kumpulkan insentif BMC setiap kali Anda menggunakan mobilitas hijau, berbagi tumpangan, atau berkontribusi dalam komunitas desa.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '20px', borderRadius: '20px', textAlign: 'right', border: '1px solid rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#fef08a' }}>TOTAL TERKUMPUL</div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff' }}>
              {totalBmcEarned} BMC
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fde68a', marginTop: '4px' }}>
              Siap Diklaim: {totalBmcPending} BMC | Telah Diklaim: {totalBmcClaimed} BMC
            </div>
          </div>
        </div>

        {/* GREEN TRIP SCORE BANNER */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
          border: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '20px',
              background: '#d1fae5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Leaf size={32} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#047857', textTransform: 'uppercase' }}>
                GREEN TRIP SCORE & "ESTIMASI DAMPAK MOBILITAS"
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                Penjaga Bumi Nusantara (Green Score: 180 Poin)
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Estimasi emisi terhindar: ~2.8 kg CO2 (Mobilitas Ramah Lingkungan)
              </div>
            </div>
          </div>

          <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '6px 12px', borderRadius: '12px', fontWeight: '700' }}>
            Bukan Kredit Karbon Terverifikasi (Estimasi Mobilitas)
          </span>
        </div>

        {/* REWARD LEDGER LIST */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
          border: '1px solid var(--border-color, #e2e8f0)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 16px', color: '#0f172a' }}>
            Buku Besar Catatan Reward (Reward Ledger)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rewards.map(r => (
              <div key={r.reward_id} style={{
                background: '#f8fafc',
                borderRadius: '18px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                border: '1px solid #cbd5e1'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#b45309' }}>
                    {r.reward_label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                    ID: {r.reward_id} | Dibuat: {new Date(r.created_at).toLocaleString('id-ID')}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#d97706' }}>
                    +{r.bmc_amount} BMC
                  </div>

                  {r.status === 'CLAIMABLE' ? (
                    <button
                      onClick={() => handleClaim(r.reward_id)}
                      disabled={claimingId === r.reward_id}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 18px',
                        borderRadius: '12px',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        cursor: claimingId === r.reward_id ? 'wait' : 'pointer'
                      }}
                    >
                      {claimingId === r.reward_id ? 'Memproses API Claim...' : 'Klaim Ke Wallet'}
                    </button>
                  ) : (
                    <span style={{
                      background: '#d1fae5',
                      color: '#047857',
                      padding: '6px 14px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <CheckCircle2 size={16} /> Telah Diklaim
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
