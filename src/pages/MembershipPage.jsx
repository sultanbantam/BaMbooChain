import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useNavigate } from 'react-router-dom';
import { Shield, Star, Zap, ExternalLink } from 'lucide-react';

const TIERS = [
  {
    id: 'seed',
    name: 'Green Seed',
    nameId: '🌱 Green Seed',
    minBMC: 1000,
    color: '#40c057',
    gradient: 'linear-gradient(135deg, #2f9e44, #40c057)',
    icon: '🌱',
    perks: [
      'Akses artikel Academy dasar',
      'Bergabung komunitas Discord YSNJ',
      'Update newsletter bulanan',
      'Voting sederhana di Snapshot',
    ],
  },
  {
    id: 'guardian',
    name: 'Bamboo Guardian',
    nameId: '🎋 Bamboo Guardian',
    minBMC: 10000,
    color: '#1c7ed6',
    gradient: 'linear-gradient(135deg, #1971c2, #339af0)',
    icon: '🎋',
    perks: [
      'Semua akses Green Seed',
      'Data & Tools eksklusif',
      'Laporan analisis pasar bulanan',
      'Akses early-bird proyek baru',
      'Badge khusus di komunitas',
    ],
    featured: true,
  },
  {
    id: 'builder',
    name: 'Ecosystem Builder',
    nameId: '🌿 Ecosystem Builder',
    minBMC: 100000,
    color: '#f59f00',
    gradient: 'linear-gradient(135deg, #e67700, #fcc419)',
    icon: '🌿',
    perks: [
      'Semua akses Guardian',
      'Sesi 1-on-1 dengan tim YSNJ',
      'Voting governance strategis',
      'Revenue sharing dari Marketplace',
      'Nama tercantum di laporan tahunan',
    ],
  },
];

const getBMCNumber = (balanceStr) => {
  if (!balanceStr) return 0;
  return parseFloat(balanceStr.replace(/\./g, '').replace(',', '.')) || 0;
};

const getUserTier = (bmcBalance) => {
  const bal = getBMCNumber(bmcBalance);
  if (bal >= 100000) return 'builder';
  if (bal >= 10000) return 'guardian';
  if (bal >= 1000) return 'seed';
  return null;
};

const MembershipPage = () => {
  const { walletAddress, bmcBalance, isConnected, openWalletModal } = useWeb3();
  const navigate = useNavigate();
  const userTier = getUserTier(bmcBalance);
  const bmcNum = getBMCNumber(bmcBalance);

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12,166,120,0.1)', padding: '6px 16px', borderRadius: '20px', marginBottom: '20px' }}>
            <Star size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)' }}>Sistem Keanggotaan Berbasis Token BMC</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', color: 'var(--text-main)', marginBottom: '16px' }}>Keanggotaan YSNJ</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Pegang token BMC untuk membuka akses eksklusif — semakin banyak, semakin tinggi level keanggotaan Anda.
          </p>
        </div>

        {/* Status Wallet */}
        {isConnected && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '40px', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Saldo BMC Anda saat ini</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{bmcBalance ?? '0'} BMC</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {userTier ? (
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Tier Anda saat ini</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                    {TIERS.find(t => t.id === userTier)?.nameId}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Butuh minimal</div>
                  <div style={{ fontWeight: '700', color: '#e03131' }}>1.000 BMC untuk Green Seed</div>
                </div>
              )}
            </div>
          </div>
        )}

        {!isConnected && (
          <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px', marginBottom: '40px', border: '2px dashed #dee2e6' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '1.05rem' }}>Hubungkan wallet untuk melihat status keanggotaan Anda</p>
            <button onClick={openWalletModal} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              🔗 Hubungkan Wallet
            </button>
          </div>
        )}

        {/* Tier Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {TIERS.map((tier) => {
            const isActive = userTier === tier.id;
            const isUnlocked = isConnected && bmcNum >= tier.minBMC;
            return (
              <div key={tier.id} style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                border: isActive ? `3px solid ${tier.color}` : '1px solid #eee',
                boxShadow: isActive ? `0 8px 30px ${tier.color}30` : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s',
                position: 'relative',
              }}>
                {tier.featured && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: tier.color, color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700' }}>
                    POPULER
                  </div>
                )}
                {/* Header gradient */}
                <div style={{ background: tier.gradient, padding: '30px 24px', textAlign: 'center', color: 'white' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{tier.icon}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>{tier.name}</div>
                  <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '8px 16px', display: 'inline-block' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>{tier.minBMC.toLocaleString('id-ID')}+ BMC</span>
                  </div>
                </div>

                {/* Perks */}
                <div style={{ padding: '24px' }}>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {tier.perks.map((perk, i) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        <span style={{ color: tier.color, fontWeight: 'bold', flexShrink: 0 }}>✓</span>
                        {perk}
                      </li>
                    ))}
                  </ul>

                  {isActive ? (
                    <div style={{ background: `${tier.color}15`, border: `1px solid ${tier.color}`, borderRadius: '12px', padding: '12px', textAlign: 'center', color: tier.color, fontWeight: '700' }}>
                      ✅ Tier Aktif
                    </div>
                  ) : isUnlocked ? (
                    <div style={{ background: '#f0fff4', border: '1px solid #40c057', borderRadius: '12px', padding: '12px', textAlign: 'center', color: '#2b8a3e', fontWeight: '600' }}>
                      🔓 Terbuka
                    </div>
                  ) : (
                    <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '12px', padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Butuh {tier.minBMC.toLocaleString('id-ID')} BMC
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cara Mendapatkan BMC */}
        <div style={{ background: 'linear-gradient(135deg, #0ca678, #2b8a3e)', borderRadius: '20px', padding: '40px', color: 'white', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Cara Mendapatkan Token BMC</h3>
          <p style={{ opacity: 0.9, marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
            Token BMC tersedia di jaringan BNB Smart Chain (BEP-20) dan dapat diperoleh melalui:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', maxWidth: '700px', margin: '0 auto 32px' }}>
            {[
              { icon: '🔄', title: 'PancakeSwap', desc: 'Tukar BNB ke BMC di DEX terbesar BSC' },
              { icon: '🤝', title: 'Airdrop', desc: 'Ikuti program komunitas & airdrop YSNJ' },
              { icon: '🌱', title: 'Kontribusi', desc: 'Berkontribusi pada proyek bambu YSNJ' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontWeight: '700', marginBottom: '6px' }}>{item.title}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <a href={`https://pancakeswap.finance/swap?outputCurrency=0x812d9709f0A53982606b823Ee61d5CA216F7F9c0`}
            target="_blank" rel="noreferrer"
            style={{ background: 'white', color: 'var(--primary)', padding: '14px 32px', borderRadius: '50px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
            <Zap size={18} /> Beli BMC di PancakeSwap <ExternalLink size={16} />
          </a>
        </div>

      </div>
    </div>
  );
};

export { getUserTier, getBMCNumber, TIERS };
export default MembershipPage;
