import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { getUserTier, getBMCNumber } from './MembershipPage';
import { MessageSquare, Vote, Users, ExternalLink, Bell, Award, ChevronRight, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, getDocs, limit } from 'firebase/firestore';

const FALLBACK_PEGIAT = [
  {
    username: "albantani",
    name: "Sultan Al-Bantani",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=albantani",
    bmcBalance: "125000",
    bioText: "Pegiat bambu Cibarani, fokus pada arsitektur berkelanjutan dan konservasi lahan adat."
  },
  {
    username: "hariadi_k",
    name: "Prof. Hariadi Kusuma",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=hariadi",
    bmcBalance: "45000",
    bioText: "Peneliti material bambu laminasi dan pemegang hak paten joint mortar pengisi."
  },
  {
    username: "ujang_winata",
    name: "Abah Ujang Winata",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ujang",
    bmcBalance: "15200",
    bioText: "Pelopor pengawetan bambu metode Kemiri alami di Cisadane hulu."
  },
  {
    username: "elizabeth_wong",
    name: "Dr. Elizabeth Wong",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=elizabeth",
    bmcBalance: "8500",
    bioText: "Spesialis ekologi karbon dan reboisasi bambu untuk perdagangan kredit karbon."
  },
  {
    username: "rian_h",
    name: "Rian Hidayat, S.Ars.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=rian",
    bmcBalance: "1200",
    bioText: "Arsitek hijau junior yang mendesain hunian vernakular modern berbasis bambu."
  }
];

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
  const [pegiatList, setPegiatList] = useState([]);
  const [loadingPegiat, setLoadingPegiat] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        const matches = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const nameMatch = data.name?.toLowerCase().includes(searchQuery.toLowerCase());
          const usernameMatch = data.username?.toLowerCase().includes(searchQuery.toLowerCase());
          if (nameMatch || usernameMatch) {
            matches.push({ id: doc.id, ...data });
          }
        });

        // Merge with fallback profiles to ensure complete view
        const mergedMatches = [...matches];
        FALLBACK_PEGIAT.forEach(fallback => {
          const nameMatch = fallback.name?.toLowerCase().includes(searchQuery.toLowerCase());
          const usernameMatch = fallback.username?.toLowerCase().includes(searchQuery.toLowerCase());
          if (nameMatch || usernameMatch) {
            if (!mergedMatches.some(item => item.username.toLowerCase() === fallback.username.toLowerCase())) {
              mergedMatches.push(fallback);
            }
          }
        });

        setSearchResults(mergedMatches);
      } catch (err) {
        console.error("Error searching pegiat:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    const fetchPegiat = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, limit(10));
        const querySnapshot = await getDocs(q);
        const list = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.username) {
            list.push({ id: doc.id, ...data });
          }
        });
        
        // Merge with fallback profiles to ensure complete view
        const mergedList = [...list];
        FALLBACK_PEGIAT.forEach(fallback => {
          if (!mergedList.some(item => item.username.toLowerCase() === fallback.username.toLowerCase())) {
            mergedList.push(fallback);
          }
        });
        
        setPegiatList(mergedList.slice(0, 5));
      } catch (err) {
        console.error("Error fetching pegiat:", err);
        setPegiatList(FALLBACK_PEGIAT);
      } finally {
        setLoadingPegiat(false);
      }
    };
    fetchPegiat();
  }, []);

  const canVote = (minBMC) => isConnected && bmcNum >= minBMC;

  return (
    <div style={{ paddingTop: '160px', minHeight: '100vh', background: 'var(--bg-color)' }}>
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
                  <div key={p.id} style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', border: `1px solid var(--border-color)` }}>
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
                      <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
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

            {/* Bamboo Meeting Promo Card */}
            <div style={{
              marginTop: '24px',
              background: 'linear-gradient(135deg, rgba(12, 166, 120, 0.08) 0%, rgba(34, 139, 230, 0.08) 100%)',
              border: '1px dashed var(--primary)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2rem' }}>🎥</span>
                <div>
                  <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)' }}>Bamboo Meeting</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Rapat & Diskusi Online Instan</p>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                Ingin mendiskusikan proposal di atas secara langsung? Adakan rapat, diskusi, atau presentasi online instan bersama komunitas pegiat bambu.
              </p>
              <div>
                <Link to="/bamboochain/meeting" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--primary)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '30px',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(12, 166, 120, 0.25)',
                  transition: 'all 0.2s'
                }}>
                  Mulai Rapat Online &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', order: window.innerWidth < 1100 ? 2 : 2 }}>

            {/* Status keanggotaan */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-color)' }}>
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

            {/* Temukan Pegiat & Ecoportfolio */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-main)' }}>
                <Award size={18} color="var(--primary)" /> Temukan Pegiat & Ecoportfolio 🎋
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Search Input field */}
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="Cari pegiat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-color)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  />
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Search Results list or default list */}
                {searchQuery.trim() ? (
                  isSearching ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Mencari pegiat...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Tidak ada pegiat ditemukan.
                    </div>
                  ) : (
                    searchResults.map((u, i) => {
                      const tier = getUserTier(u.bmcBalance || 0);
                      let tierLabel = 'Pegiat Bambu';
                      let tierGradient = 'linear-gradient(135deg, #495057, #868e96)';
                      
                      if (tier === 'builder') {
                        tierLabel = 'Ecosystem Builder';
                        tierGradient = 'linear-gradient(135deg, #e67700, #fcc419)';
                      } else if (tier === 'guardian') {
                        tierLabel = 'Bamboo Guardian';
                        tierGradient = 'linear-gradient(135deg, #1971c2, #339af0)';
                      } else if (tier === 'seed') {
                        tierLabel = 'Green Seed';
                        tierGradient = 'linear-gradient(135deg, #2f9e44, #40c057)';
                      }

                      return (
                        <div 
                          key={u.username || i} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            padding: '10px', 
                            borderRadius: '12px', 
                            border: '1px solid transparent',
                            transition: 'all 0.2s ease',
                            background: 'rgba(255, 255, 255, 0.02)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-secondary)';
                            e.currentTarget.style.borderColor = 'rgba(12, 166, 120, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                            e.currentTarget.style.borderColor = 'transparent';
                          }}
                        >
                          <img 
                            src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} 
                            alt={u.name || u.username}
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              borderRadius: '50%', 
                              objectFit: 'cover', 
                              border: '2px solid var(--primary)',
                              background: 'var(--bg-secondary)'
                            }} 
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {u.name || u.username}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{u.username}</span>
                              <span style={{
                                fontSize: '0.62rem',
                                fontWeight: 'bold',
                                padding: '2px 6px',
                                borderRadius: '8px',
                                color: 'white',
                                background: tierGradient,
                                whiteSpace: 'nowrap'
                              }}>
                                {tierLabel}
                              </span>
                            </div>
                          </div>
                          <Link 
                            to={`/portfolio/${u.username.toLowerCase()}`} 
                            style={{ 
                              fontSize: '0.8rem', 
                              color: 'var(--primary)', 
                              fontWeight: '700', 
                              textDecoration: 'none', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '2px',
                              flexShrink: 0
                            }}
                          >
                            Lihat <ChevronRight size={14} />
                          </Link>
                        </div>
                      );
                    })
                  )
                ) : (
                  pegiatList.map((u, i) => {
                    const tier = getUserTier(u.bmcBalance || 0);
                    let tierLabel = 'Pegiat Bambu';
                    let tierGradient = 'linear-gradient(135deg, #495057, #868e96)';
                    
                    if (tier === 'builder') {
                      tierLabel = 'Ecosystem Builder';
                      tierGradient = 'linear-gradient(135deg, #e67700, #fcc419)';
                    } else if (tier === 'guardian') {
                      tierLabel = 'Bamboo Guardian';
                      tierGradient = 'linear-gradient(135deg, #1971c2, #339af0)';
                    } else if (tier === 'seed') {
                      tierLabel = 'Green Seed';
                      tierGradient = 'linear-gradient(135deg, #2f9e44, #40c057)';
                    }

                    return (
                      <div 
                        key={u.username || i} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px', 
                          padding: '10px', 
                          borderRadius: '12px', 
                          border: '1px solid transparent',
                          transition: 'all 0.2s ease',
                          background: 'rgba(255, 255, 255, 0.02)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--bg-secondary)';
                          e.currentTarget.style.borderColor = 'rgba(12, 166, 120, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                      >
                        <img 
                          src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} 
                          alt={u.name || u.username}
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            objectFit: 'cover', 
                            border: '2px solid var(--primary)',
                            background: 'var(--bg-secondary)'
                          }} 
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {u.name || u.username}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{u.username}</span>
                            <span style={{
                              fontSize: '0.62rem',
                              fontWeight: 'bold',
                              padding: '2px 6px',
                              borderRadius: '8px',
                              color: 'white',
                              background: tierGradient,
                              whiteSpace: 'nowrap'
                            }}>
                              {tierLabel}
                            </span>
                          </div>
                        </div>
                        <Link 
                          to={`/portfolio/${u.username.toLowerCase()}`} 
                          style={{ 
                            fontSize: '0.8rem', 
                            color: 'var(--primary)', 
                            fontWeight: '700', 
                            textDecoration: 'none', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '2px',
                            flexShrink: 0
                          }}
                        >
                          Lihat <ChevronRight size={14} />
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Pengumuman */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-color)' }}>
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
            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-color)' }}>
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
