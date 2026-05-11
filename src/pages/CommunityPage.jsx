import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { getUserTier, getBMCNumber } from './MembershipPage';
import { MessageSquare, Vote, Users, ExternalLink, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const PROPOSALS = [
  {
    id: 1,
    title: 'Alokasi Dana untuk Riset Bambu Laminasi Cibarani',
    desc: 'Proposal penggunaan treasury sebesar 50.000 BMC untuk riset material bambu laminasi di lokasi Cibarani.',
    status: 'active',
    votes: { yes: 72, no: 18, abstain: 10 },
    ends: '2026-04-15',
    minBMC: 1000,
  },
  {
    id: 2,
    title: 'Penambahan Pasangan Likuiditas BMC/BNB di PancakeSwap',
    desc: 'Menggunakan 100.000 BMC dari treasury untuk menambah likuiditas dan meningkatkan volume perdagangan token.',
    status: 'active',
    votes: { yes: 61, no: 30, abstain: 9 },
    ends: '2026-04-20',
    minBMC: 10000,
  },
  {
    id: 3,
    title: 'Kemitraan Strategis dengan Eksportir Bambu Jawa Tengah',
    desc: 'Proposal MOU dengan 3 eksportir bambu untuk jaminan offtake produk dari perkebunan mitra YSNJ.',
    status: 'closed',
    votes: { yes: 89, no: 8, abstain: 3 },
    ends: '2026-03-20',
    minBMC: 1000,
  },
];

const ANNOUNCEMENTS = [
  { icon: '🌱', text: 'Program airdrop Green Seed untuk 100 holder pertama dibuka 1 April 2026', time: '2 hari lalu' },
  { icon: '🎋', text: 'Laporan proyeksi kebun Cisadane Q1 2026 tersedia di Academy', time: '5 hari lalu' },
  { icon: '⛓️', text: 'Dashboard transparansi on-chain kini live di website YSNJ', time: '1 minggu lalu' },
];

const CommunityPage = () => {
  const { bmcBalance, isConnected, openWalletModal } = useWeb3();
  const userTier = getUserTier(bmcBalance);
  const bmcNum = getBMCNumber(bmcBalance);
  const [voted, setVoted] = useState({});

  const canVote = (minBMC) => isConnected && bmcNum >= minBMC;

  return (
    <div style={{ paddingTop: '160px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12,166,120,0.1)', padding: '6px 16px', borderRadius: '20px', marginBottom: '20px' }}>
            <Users size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)' }}>Komunitas & Governance • Ditenagai Token BMC</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '16px' }}>Komunitas bambuNUSA</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Bersama-sama membangun ekosistem bambu Indonesia. Voting, diskusi, dan keputusan strategis dilakukan secara transparan berbasis token BMC.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth < 1100 ? '1fr' : '2fr 1fr', 
          gap: '24px', 
          alignItems: 'start' 
        }}>

          {/* Kolom Kiri: Proposals */}
          <div style={{ order: window.innerWidth < 1100 ? 1 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Vote size={22} color="var(--primary)" /> Voting Aktif
              </h2>
              <a href="https://snapshot.org" target="_blank" rel="noreferrer"
                style={{ fontSize: '0.82rem', color: 'var(--primary)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                Lihat di Snapshot <ExternalLink size={12} />
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {PROPOSALS.map((p) => {
                const total = p.votes.yes + p.votes.no + p.votes.abstain;
                const yesW = (p.votes.yes / total * 100).toFixed(0);
                const noW = (p.votes.no / total * 100).toFixed(0);
                const hasVoted = voted[p.id];
                const eligible = canVote(p.minBMC);

                return (
                  <div key={p.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', border: `1px solid ${p.status === 'active' ? '#dee2e6' : '#f1f3f5'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                      <h3 style={{ fontSize: '1rem', lineHeight: '1.4', flex: 1 }}>{p.title}</h3>
                      <span style={{
                        flexShrink: 0, fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '20px',
                        background: p.status === 'active' ? '#dbfff0' : '#f1f3f5',
                        color: p.status === 'active' ? '#2b8a3e' : '#868e96',
                      }}>
                        {p.status === 'active' ? '🟢 AKTIF' : '✅ SELESAI'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>{p.desc}</p>

                    {/* Progress bars */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                        <span style={{ color: '#2b8a3e' }}>✅ Setuju {yesW}%</span>
                        <span style={{ color: '#e03131' }}>❌ Tolak {noW}%</span>
                      </div>
                      <div style={{ height: '8px', background: '#f1f3f5', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${yesW}%`, background: 'linear-gradient(90deg, #40c057, #2b8a3e)', borderRadius: '4px' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {p.status === 'active' ? `Berakhir: ${new Date(p.ends).toLocaleDateString('id-ID')}` : `Berakhir: ${new Date(p.ends).toLocaleDateString('id-ID')}`}
                        {' · '}Min. {p.minBMC.toLocaleString('id-ID')} BMC
                      </span>
                      {p.status === 'active' && !hasVoted && eligible && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setVoted({ ...voted, [p.id]: 'yes' })}
                            style={{ padding: '6px 16px', background: '#40c057', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}>
                            ✅ Setuju
                          </button>
                          <button onClick={() => setVoted({ ...voted, [p.id]: 'no' })}
                            style={{ padding: '6px 16px', background: '#e03131', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}>
                            ❌ Tolak
                          </button>
                        </div>
                      )}
                      {hasVoted && <span style={{ color: '#40c057', fontWeight: '600', fontSize: '0.85rem' }}>✅ Sudah voting</span>}
                      {p.status === 'active' && !eligible && (
                        <Link to="/membership" style={{ fontSize: '0.8rem', color: '#e67700', fontWeight: '600' }}>
                          🔒 Butuh {p.minBMC.toLocaleString('id-ID')} BMC
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kolom Kanan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', order: window.innerWidth < 1100 ? 2 : 2 }}>

            {/* Status keanggotaan */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #eee' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Users size={18} color="var(--primary)" /> Status Anda
              </h3>
              {isConnected ? (
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Saldo BMC</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '12px' }}>{bmcBalance ?? '0'}</div>
                  {userTier ? (
                    <div style={{ background: '#f0fff4', border: '1px solid #40c057', borderRadius: '10px', padding: '10px', textAlign: 'center', fontWeight: '700', color: '#2b8a3e', fontSize: '0.9rem' }}>
                      Tier Aktif ✅
                    </div>
                  ) : (
                    <Link to="/membership" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '50px', fontSize: '0.85rem' }}>
                      Upgrade Keanggotaan
                    </Link>
                  )}
                </div>
              ) : (
                <button onClick={openWalletModal} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}>
                  🔗 Hubungkan Wallet
                </button>
              )}
            </div>

            {/* Pengumuman */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #eee' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Bell size={18} color="var(--primary)" /> Pengumuman
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {ANNOUNCEMENTS.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.83rem' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{a.icon}</span>
                    <div>
                      <div style={{ color: 'var(--text-main)', lineHeight: '1.4' }}>{a.text}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Link komunitas */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #eee' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <MessageSquare size={18} color="var(--primary)" /> Bergabung
              </h3>
              {[
                { icon: '💬', name: 'Telegram bambuNUSA', url: 'https://t.me/bambucrypto' },
                { icon: '🎮', name: 'Discord bambuNUSA', url: '#' },
                { icon: '🐦', name: 'X/Twitter @bambucoid', url: 'https://x.com/bambucoid' },
              ].map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: i < 2 ? '1px solid #f1f3f5' : 'none', color: 'var(--text-main)', fontSize: '0.88rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-main)'}>
                  <span>{s.icon}</span> {s.name} <ExternalLink size={12} style={{ marginLeft: 'auto' }} />
                </a>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CommunityPage;
