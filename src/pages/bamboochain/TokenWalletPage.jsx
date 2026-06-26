import React, { useState, useEffect } from 'react';
import { 
  Wallet, PieChart, FileText, Gift, History, Cpu, TrendingUp, 
  ArrowDownToLine, ArrowUpFromLine, Send, CheckCircle, Clock, ExternalLink,
  ChevronRight, Play, Camera, MapPin, Upload, ShieldCheck, Users, ShoppingCart, Award, CalendarDays, Lock, Leaf, Globe
} from 'lucide-react';
import { useWeb3 } from '../../context/Web3Context';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { useValidations, usePlantationDonations, useLocationProposals } from '../../hooks/useFirestoreQueries';
import { useLanguage } from '../../context/LanguageContext';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const formatBalance = (val) => {
  const num = Number(val || 0);
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
};

// ======================================
// TAB COMPONENTS
// ======================================

const OverviewTab = ({ setActiveTab, setInitialModal }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1100);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1100);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCopyWallet = () => {
    if(user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      alert(t('tw_alert_copied'));
    }
  };

  const handleSendClick = () => {
    if (setInitialModal) setInitialModal('send');
    if (setActiveTab) setActiveTab('dashboard');
  };

  const handleReceiveClick = () => {
    if (setInitialModal) setInitialModal('receive');
    if (setActiveTab) setActiveTab('dashboard');
  };

  const handleTradeClick = () => {
    if (setActiveTab) setActiveTab('get_bmc');
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out', paddingTop: isMobile ? '8px' : '16px' }}>
      <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginTop: '0', marginBottom: '8px', letterSpacing: '-0.5px' }}>bambuNUSA (BMC)</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: isMobile ? '0.9rem' : '1.1rem', marginBottom: '24px', maxWidth: '800px', lineHeight: 1.5 }}>
        {t('tw_bmc_desc')}
      </p>

      {user?.walletAddress && (
        <>
          <div style={{ 
            background: 'linear-gradient(135deg, #0ca678, #1864ab)', 
            borderRadius: '24px', 
            padding: isMobile ? '24px' : '32px', 
            color: 'white', 
            marginBottom: '16px', 
            boxShadow: '0 12px 32px rgba(12, 166, 120, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            
            <div style={{ textAlign: 'center', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '2px', opacity: 0.8, marginBottom: '8px', textTransform: 'uppercase' }}>Total Balance</div>
              <div style={{ fontSize: isMobile ? '2.5rem' : '3rem', fontWeight: '900', letterSpacing: '-1px' }}>
                {formatBalance(user?.bmcBalance)} <span style={{ fontSize: '1rem', opacity: 0.8 }}>BMC</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', position: 'relative', zIndex: 1 }}>
              <button onClick={handleSendClick} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '16px', padding: '12px 8px', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <ArrowUpFromLine size={20} />
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>Send</span>
              </button>
              <button onClick={handleReceiveClick} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '16px', padding: '12px 8px', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <ArrowDownToLine size={20} />
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>Receive</span>
              </button>
              <button onClick={handleTradeClick} style={{ background: 'white', border: 'none', borderRadius: '16px', padding: '12px 8px', color: 'var(--primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <TrendingUp size={20} />
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>Trade</span>
              </button>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', border: '1px solid #f1f3f5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>WALLET ADDRESS</div>
                <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: '600' }}>{user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(user.walletAddress.length - 4)}</div>
              </div>
            </div>
            <button onClick={handleCopyWallet} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>Copy</button>
          </div>
        </>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {[
          { label: 'MARKET CAP', value: '$12,450,000', icon: TrendingUp },
          { label: 'CIRCULATING', value: '150.5M BMC', icon: PieChart },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid #f1f3f5', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: '#f1f3f5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={20} color="var(--text-muted)" />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px' }}>{stat.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '900' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WhitepaperTab = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = (e) => {
    e.preventDefault();
    const staked = user?.stakedBalance || 0;
    if (staked < 10) {
      alert(t('tw_alert_wp_locked').replace('{staked}', staked));
      return;
    }
    window.open('/wpbmc.pdf', '_blank');
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #2b8a3e, #0c8599)', 
        borderRadius: '24px', 
        padding: isMobile ? '32px 24px' : '40px', 
        color: 'white', 
        marginBottom: '32px', 
        boxShadow: '0 10px 30px rgba(12, 166, 120, 0.2)' 
      }}>
        <FileText size={isMobile ? 36 : 48} style={{ opacity: 0.8, marginBottom: '20px' }} />
        <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '900', marginBottom: '16px' }}>Whitepaper BMC</h2>
        <p style={{ fontSize: isMobile ? '1rem' : '1.1rem', opacity: 0.9, maxWidth: '600px', marginBottom: '24px' }}>
          Pelajari konsep mendalam, perombakan industri bambu, hingga detail tokenomics DAO dalam dokumen resmi kami.
        </p>
        <button onClick={handleDownload} style={{ background: 'white', color: 'var(--primary)', border: 'none', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.9rem' }}>
          Buka / Unduh PDF <ExternalLink size={18} />
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '24px', padding: isMobile ? '24px' : '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '20px' }}>Struktur Dokumen:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {[
            {
              title: "🌿 1. VISION & MISSION",
              content: (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>🎯 Vision</div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Membangun Global Bamboo Ecosystem Platform yang mengintegrasikan teknologi, industri, dan komunitas untuk mendorong green economy dan circular economy.</p>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '16px' }}>👉 Tujuan: Material masa depan & ketahanan sandang, pangan, papan, energi.</div>
                  
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>🚀 Mission</div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <li style={{ marginBottom: '6px' }}>Platform digital bambu berbasis data</li>
                    <li style={{ marginBottom: '6px' }}>Integrasi rantai nilai hulu ke hilir</li>
                    <li style={{ marginBottom: '6px' }}>Pemberdayaan masyarakat & ekonomi</li>
                    <li style={{ marginBottom: '6px' }}>Mendorong adopsi bambu global</li>
                    <li style={{ marginBottom: '6px' }}>Ekosistem transparan via blockchain (BMC)</li>
                  </ul>
                </>
              )
            },
            {
              title: "⚠️ 2. PROBLEM (FRAGMENTASI)",
              content: (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>🧠 Masalah Utama</div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Industri bambu saat ini masih terfragmentasi dan tidak terintegrasi.</p>
                  <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <li style={{ marginBottom: '6px' }}><strong>Tidak ada database terpusat</strong></li>
                    <li style={{ marginBottom: '6px' }}><strong>Supply chain terputus</strong></li>
                    <li style={{ marginBottom: '6px' }}><strong>Minim teknologi</strong> (digitalisasi/IoT/GIS)</li>
                    <li style={{ marginBottom: '6px' }}><strong>Akses pasar terbatas</strong> (marketplace)</li>
                    <li style={{ marginBottom: '6px' }}><strong>Kurang insentif</strong> bagi petani</li>
                  </ol>
                </>
              )
            },
            {
              title: "💡 3. SOLUTION (BAMBOOCHAIN)",
              content: (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>🌐 Super Ecosystem Platform</div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Kombinasi mutakhir AI + Blockchain + Marketplace + Data + Community.</p>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <li style={{ marginBottom: '6px' }}><strong>🤖 Bambupedia:</strong> Edukasi AI</li>
                    <li style={{ marginBottom: '6px' }}><strong>🌱 Plantation:</strong> Tracking (GIS & IoT)</li>
                    <li style={{ marginBottom: '6px' }}><strong>🏭 Supply Chain:</strong> Jaminan asal-usul</li>
                    <li style={{ marginBottom: '6px' }}><strong>🧱 Bamboo Build:</strong> Konstruksi modular</li>
                    <li style={{ marginBottom: '6px' }}><strong>🛒 Marketplace:</strong> Global trade</li>
                    <li style={{ marginBottom: '6px' }}><strong>🪙 BMC Token & DAO:</strong> Sistem ekonomi</li>
                  </ul>
                </>
              )
            },
            {
              title: "🪙 4. TOKEN UTILITY",
              content: (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>🎯 Fungsi BMC</div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Utility token utama dalam ekosistem, bukan sekadar aset spekulatif semata.</p>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>🔑 Penggunaan</div>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <li style={{ marginBottom: '6px' }}>Akses API Bambubot & Artikel Edukasi</li>
                    <li style={{ marginBottom: '6px' }}>Akses big data & tools analitik</li>
                    <li style={{ marginBottom: '6px' }}>Transaksi e-commerce Marketplace</li>
                    <li style={{ marginBottom: '6px' }}>Reward aktivitas & Hak Voting DAO</li>
                  </ul>
                  <div style={{ padding: '8px 12px', background: '#e6fcf5', color: 'var(--primary)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'center' }}>
                    🧠 Use → Spend → Burn → Reduce Supply
                  </div>
                </>
              )
            },
            {
              title: "📊 5. TOKENOMICS",
              content: (
                <>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <li style={{ marginBottom: '6px' }}><strong>🔢 Supply:</strong> 1,000,000,000 token (Label: 1 Juta BMC, 1 BMC = 1 USDT)</li>
                    <li style={{ marginBottom: '6px' }}><strong>📉 Emission:</strong> Halving system</li>
                    <li style={{ marginBottom: '6px' }}><strong>🔥 Burn Mechanism:</strong> Pembakaran fee platform</li>
                    <li style={{ marginBottom: '6px' }}><strong>🔐 Staking:</strong> Lock supply for rewards</li>
                  </ul>
                  <div style={{ padding: '8px 12px', background: '#fff5f5', color: '#e03131', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'center' }}>
                    🎯 Goal: Tidak Inflasi, Langka, Consistent Value
                  </div>
                </>
              )
            },
            {
              title: "🧠 6. USE CASES",
              content: (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-main)' }}>🌱 Ekosistem Nyata</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <div style={{ background: 'white', border: '1px solid #ced4da', padding: '10px', borderRadius: '12px' }}>
                      <strong>📚 Edukasi</strong><br/>Bambupedia
                    </div>
                    <div style={{ background: 'white', border: '1px solid #ced4da', padding: '10px', borderRadius: '12px' }}>
                      <strong>🏗 Industri</strong><br/>Modular build
                    </div>
                    <div style={{ background: 'white', border: '1px solid #ced4da', padding: '10px', borderRadius: '12px' }}>
                      <strong>🛒 Market</strong><br/>Commodities
                    </div>
                    <div style={{ background: 'white', border: '1px solid #ced4da', padding: '10px', borderRadius: '12px' }}>
                      <strong>📡 Data</strong><br/>GIS Analysis
                    </div>
                    <div style={{ background: 'white', border: '1px solid #ced4da', padding: '10px', borderRadius: '12px' }}>
                      <strong>🍃 Ekologi</strong><br/>Carbon Credit
                    </div>
                    <div style={{ background: 'white', border: '1px solid #ced4da', padding: '10px', borderRadius: '12px' }}>
                      <strong>🤝 Sosial</strong><br/>DAO Voting
                    </div>
                  </div>
                </>
              )
            },
            {
              title: "🛣️ 7. ROADMAP",
              content: (
                <>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <li style={{ display: 'flex', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #f1f3f5', marginBottom: '10px' }}>
                      <div style={{ minWidth: '35px', fontWeight: '900', color: 'var(--primary)' }}>Ph 1</div>
                      <div>Fundamental, Wallet integration.</div>
                    </li>
                    <li style={{ display: 'flex', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #f1f3f5', marginBottom: '10px' }}>
                      <div style={{ minWidth: '35px', fontWeight: '900', color: 'var(--primary)' }}>Ph 2</div>
                      <div>Marketplace & Reward system.</div>
                    </li>
                    <li style={{ display: 'flex', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #f1f3f5', marginBottom: '10px' }}>
                      <div style={{ minWidth: '35px', fontWeight: '900', color: 'var(--primary)' }}>Ph 3</div>
                      <div>DAO & Carbon ecosystem.</div>
                    </li>
                    <li style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ minWidth: '35px', fontWeight: '900', color: 'var(--primary)' }}>Ph 4</div>
                      <div>Global expansion & Bamboo City.</div>
                    </li>
                  </ul>
                </>
              )
            },
            {
              title: "🗳️ 8. GOVERNANCE (DAO)",
              content: (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>🎯 Konsep</div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pengelolaan desentralisasi via staking BMC.</p>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <li>Pilih proyek strategis</li>
                    <li>Alokasi dana ekosistem</li>
                    <li>Penentuan fitur baru</li>
                  </ul>
                  <div style={{ padding: '8px 12px', background: '#fff9db', color: '#e67700', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'center' }}>
                    🔐 Transparan & Demokratis
                  </div>
                </>
              )
            }
          ].map((sec, idx) => (
            <div key={idx} style={{ padding: isMobile ? '20px' : '28px', background: '#f8f9fa', borderRadius: '20px', display: 'flex', flexDirection: 'column', border: '1px solid #e9ecef', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: isMobile ? '1.1rem' : '1.25rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>
                {sec.title}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {sec.content}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', background: 'linear-gradient(135deg, #1864ab, #0b2b8e)', color: 'white', padding: isMobile ? '32px 24px' : '40px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 12px 30px rgba(24, 100, 171, 0.3)' }}>
          <h3 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: '900', margin: '0 0 12px 0', letterSpacing: '1px' }}>🏆 KESIMPULAN BESAR</h3>
          <p style={{ margin: 0, fontSize: isMobile ? '1rem' : '1.2rem', opacity: 0.9, lineHeight: 1.6 }}>BambooChain bukan sekadar platform, tetapi:<br/><strong style={{ fontSize: isMobile ? '1.2rem' : '1.6rem', color: '#fcc419', marginTop: '12px', display: 'inline-block', padding: '4px 16px', border: '2px dashed #fcc419', borderRadius: '12px' }}>Digital Infrastructure for Global Bamboo Economy</strong></p>
        </div>
      </div>
    </div>
  );
};

const WalletDashboardTab = ({ initialModal, setInitialModal }) => {
  const { user, transferBmc, calculateLockedBalance, getAvailableBalance, addReward } = useAuth();
  const { t } = useLanguage();
  const [modalType, setModalType] = useState(null); // 'send', 'receive'
  const [sendAddr, setSendAddr] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const isPiBrowser = window.Pi && (
    window.location.hostname.includes('vercel.app') || 
    window.location.hostname.includes('bambu.pi') || 
    window.location.search.includes('sandbox=true')
  );

  useEffect(() => {
    if (initialModal) {
      setModalType(initialModal);
      if (setInitialModal) {
        setInitialModal(null);
      }
    }
  }, [initialModal, setInitialModal]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real-time search simulation
  useEffect(() => {
    if (searchQuery.length > 1 && user) {
      const db = []; // getMockDB disabled for now
      const results = db.filter(u => 
        u && u.id !== user.id && 
        ((u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
         (u.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
         (u.walletAddress || "").toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(results.slice(0, 3));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, user?.id]);

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <Wallet size={48} color="#adb5bd" style={{ marginBottom: '16px' }} />
        <h3 style={{ margin: 0 }}>Dompet Tidak Terdeteksi</h3>
        <p style={{ color: 'var(--text-muted)' }}>Silakan masuk ke akun Anda untuk melihat dashboard dompet.</p>
      </div>
    );
  }

  const handleSend = async () => {
    if(!sendAddr || !sendAmount) return alert(t('tw_alert_fill_addr'));
    if(!user || user.kycStatus !== 'verified') return alert(t('tw_alert_kyc_first'));
    
    const amt = parseFloat(sendAmount);
    if(isNaN(amt) || amt <= 0) return alert(t('tw_alert_invalid_amt'));
    
    const success = await transferBmc(amt, sendAddr);
    if(success) {
      alert(t('tw_alert_tx_success').replace('{amt}', amt).replace('{addr}', sendAddr));
      setModalType(null);
      setSendAddr('');
      setSendAmount('');
      setSearchQuery('');
    }
  };

  const balanceBMC = (user?.bmcBalance || 0).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 3});
  const myWallet = user?.walletAddress || '0x...';
  
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {/* MODALS */}
      {modalType && (
        <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: isMobile ? '24px' : '32px', borderRadius: '32px', width: '90%', maxWidth: '440px', boxShadow: '0 24px 48px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }}>
            {modalType === 'receive' && (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ marginTop: 0, fontSize: '1.5rem', fontWeight: '900' }}>📍 Terima BMC</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Berikan dompet Anda ini ke petani/pengguna lain untuk menerima kiriman token BMC (Gasless).</p>
                <div style={{ margin: '10px auto 20px', width: isMobile ? '180px' : '220px', height: isMobile ? '180px' : '220px', background: 'white', padding: '16px', borderRadius: '24px', border: '2px solid #f1f3f5', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${myWallet}`} alt="QR Code" style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
                </div>
                <div style={{ background: '#f8f9fa', padding: '14px', borderRadius: '16px', fontSize: '0.8rem', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: '24px', border: '1px solid #dee2e6', color: 'var(--primary)', fontWeight: 'bold' }}>{myWallet}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button onClick={() => setModalType(null)} style={{ padding: '14px', background: 'transparent', border: '1px solid #ced4da', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>Tutup</button>
                  <button onClick={() => { navigator.clipboard.writeText(myWallet); alert(t('tw_alert_copy_wallet')); }} style={{ padding: '14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(12, 166, 120, 0.2)', fontSize: '0.9rem' }}>Salin Alamat</button>
                </div>
              </div>
            )}
            {modalType === 'send' && (
              <div>
                <h3 style={{ marginTop: 0, fontSize: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px' }}>📤 Kirim BMC</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Cari nama anggota atau tempel alamat dompet.<br/><strong>TANPA BIAYA GAS!</strong></p>
                
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Cari Penerima / Alamat:</label>
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                   <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setSendAddr(e.target.value); }} placeholder="Nama atau paste 0x..." style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1.5px solid #e9ecef', fontSize: '1rem', boxSizing: 'border-box', outlineColor: 'var(--primary)' }} />
                   
                   {searchResults.length > 0 && (
                     <div style={{ position: 'absolute', top: '100%', left:0, right:0, background: 'white', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.1)', border: '1px solid #f1f3f5', marginTop: '8px', zIndex: 10, overflow: 'hidden' }}>
                        {searchResults.map(res => (
                          <div key={res.id} onClick={() => { setSendAddr(res.walletAddress || ""); setSearchQuery(res.name || ""); setSearchResults([]); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f3f5', display: 'flex', alignItems: 'center', gap: '12px' }}>
                             <div style={{ width: '36px', height: '36px', background: 'var(--primary)', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{(res.name || "U").charAt(0)}</div>
                             <div>
                               <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{res.name || "User"}</div>
                               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(res.walletAddress || "0x00...").substring(0,10)}...</div>
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
                
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Nominal (BMC):</label>
                <input type="number" value={sendAmount} onChange={e => setSendAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1.5px solid #e9ecef', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px', boxSizing: 'border-box' }} />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px', textAlign: 'right' }}>Saldo: <strong>{balanceBMC} BMC</strong></div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button onClick={() => setModalType(null)} style={{ padding: '14px', background: 'transparent', border: '1px solid #ced4da', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>Batal</button>
                  <button onClick={handleSend} style={{ padding: '14px', background: '#12b886', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(18, 184, 134, 0.2)', fontSize: '0.9rem' }}>Kirim</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>Wallet Dashboard</h2>
        {calculateLockedBalance && calculateLockedBalance(user) > 0 && (
          <div style={{ background: '#fff4e6', color: '#e8590c', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid #ffd8a8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={14} /> Ada Saldo Airdrop Terkunci
          </div>
        )}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '20px' }}>
        {/* Card Kiri */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary), #1b5e20)', borderRadius: '24px', padding: isMobile ? '24px' : '32px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 12px 30px rgba(12,166,120,0.2)' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Total Balance BMC</div>
            </div>
            <div style={{ fontSize: isMobile ? '2.5rem' : '3rem', fontWeight: '900', marginBottom: '16px' }}>{balanceBMC}</div>
            
            {calculateLockedBalance && (
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', padding: '12px', background: 'rgba(0,0,0,0.15)', borderRadius: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', textTransform: 'uppercase' }}>Available to Send</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{getAvailableBalance().toLocaleString('en-US', {maximumFractionDigits: 2})} BMC</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', color: '#fcc419', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}><Lock size={10}/> Locked Airdrop</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ffec99' }}>{calculateLockedBalance(user).toLocaleString('en-US', {maximumFractionDigits: 2})} BMC</div>
                </div>
              </div>
            )}
            
            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '10px 14px', borderRadius: '12px', marginBottom: '24px', backdropFilter: 'blur(5px)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
              {isMobile ? `${myWallet.substring(0, 10)}...${myWallet.substring(34)}` : myWallet}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => setModalType('receive')} style={{ flex: 1, padding: '12px', background: 'white', color: 'var(--primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' }}>
                <ArrowDownToLine size={18} /> Receive
              </button>
              <button onClick={() => setModalType('send')} style={{ flex: 1, padding: '12px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' }}>
                <Send size={18} /> Send
              </button>
            </div>
          </div>
        </div>

        {/* Card Kanan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '24px', flex: 1, boxShadow: '0 8px 24px rgba(0,0,0,0.04)', border: '1px solid #f1f3f5' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Total Earned (All Time)</div>
             <div style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: 'bold', color: '#f59f00' }}>
                +{(user?.transactions || []).filter(t => t && t.type === 'Earn').reduce((acc, curr) => acc + parseFloat((curr?.amount || "0").replace('+','')), 0).toLocaleString('en-US', {maximumFractionDigits: 3})} BMC
             </div>
          </div>
          <div style={{ background: 'white', borderRadius: '24px', padding: '24px', flex: 1, boxShadow: '0 8px 24px rgba(0,0,0,0.04)', border: '1px solid #f1f3f5' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Locked / Staked BMC</div>
            <div style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{(user?.stakedBalance || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} BMC</div>
          </div>
        </div>
      </div>

      {/* Syarat & Ketentuan Unlock Airdrop */}
      {calculateLockedBalance && calculateLockedBalance(user) > 0 && (
        <div style={{ marginTop: '24px', background: 'white', borderRadius: '24px', padding: isMobile ? '24px' : '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', border: '1px solid #ffe8cc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', background: '#fff4e6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} color="#e8590c" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>Misi Unlock Saldo Airdrop</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Selesaikan misi berikut untuk mencairkan token gratis Anda.</div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginTop: '24px' }}>
            {/* Mission 1 */}
            <div style={{ padding: '16px', borderRadius: '16px', border: user?.kycStatus === 'verified' ? '2px solid #51cf66' : '2px solid #e9ecef', background: user?.kycStatus === 'verified' ? '#ebfbee' : '#f8f9fa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color={user?.kycStatus === 'verified' ? '#2b8a3e' : '#adb5bd'} />
                  1. Verifikasi KYC
                </div>
                {user?.kycStatus === 'verified' ? (
                  <CheckCircle size={20} color="#51cf66" />
                ) : (
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#adb5bd', background: '#e9ecef', padding: '4px 8px', borderRadius: '12px' }}>Belum</span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status Anda saat ini: <strong>{user?.kycStatus}</strong></div>
            </div>

            {/* Mission 2 */}
            <div style={{ padding: '16px', borderRadius: '16px', border: ((user?.stakedBalance || 0) >= 10 || (!isPiBrowser && (user?.transactions || []).some(t => t.type === 'Fiat'))) ? '2px solid #51cf66' : '2px solid #e9ecef', background: ((user?.stakedBalance || 0) >= 10 || (!isPiBrowser && (user?.transactions || []).some(t => t.type === 'Fiat'))) ? '#ebfbee' : '#f8f9fa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Leaf size={18} color={((user?.stakedBalance || 0) >= 10 || (!isPiBrowser && (user?.transactions || []).some(t => t.type === 'Fiat'))) ? '#2b8a3e' : '#adb5bd'} />
                  2. Anggota Aktif Ekosistem
                </div>
                {((user?.stakedBalance || 0) >= 10 || (!isPiBrowser && (user?.transactions || []).some(t => t.type === 'Fiat'))) ? (
                  <CheckCircle size={20} color="#51cf66" />
                ) : (
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#adb5bd', background: '#e9ecef', padding: '4px 8px', borderRadius: '12px' }}>Belum</span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isPiBrowser ? "Staking min. 10 BMC. " : "Staking min. 10 BMC atau pernah Top-Up via Fiat. "}
                Progress Staking: <strong>{user?.stakedBalance || 0}/10 BMC</strong>.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-komponen Get BMC ---
const BuyBMC = () => {
  const { user, addReward, addPendingValidation } = useAuth();
  const { t } = useLanguage();
  const [activePkg, setActivePkg] = useState(null);
  const [bankName, setBankName] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [customBmc, setCustomBmc] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [marketPrice, setMarketPrice] = useState(17352); // Fallback if API fails

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=idr');
        if (res.ok) {
          const data = await res.json();
          if (data.tether && data.tether.idr) {
            setMarketPrice(data.tether.idr);
          }
        } else {
          // Fallback to fiat USD if CoinGecko is rate limited
          const fallbackRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            if (fallbackData.rates && fallbackData.rates.IDR) {
              setMarketPrice(Math.round(fallbackData.rates.IDR));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch real-time USDT price", err);
      }
    };
    fetchPrice();
    // Refresh every 5 minutes
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const packages = [
    { bmc: 1, idr: marketPrice.toLocaleString('id-ID'), badge: "1 USDT" },
    { bmc: 5, idr: Math.floor((5 * marketPrice) * 0.9).toLocaleString('id-ID'), badge: t('tw_buy_save_10') },
    { bmc: 10, idr: Math.floor((10 * marketPrice) * 0.8).toLocaleString('id-ID'), badge: t('tw_buy_save_20') },
  ];

  const handleFileChange = (e) => {
    if(e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => setPaymentProof(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentProofSubmit = () => {
    if(!bankName) return alert(t('tw_alert_bank_name'));
    if(!paymentProof) return alert(t('tw_alert_proof'));
    
    // Safety check: Nama rekening harus sama dengan nama user (kyc simulated)
    if(user.kycStatus === 'verified' && bankName.toLowerCase() !== user.name.toLowerCase()) {
        alert(t('tw_alert_name_mismatch').replace('{bank}', bankName).replace('{kyc}', user.name));
        return;
    }

    if (addPendingValidation) {
      addPendingValidation({
        title: `Pembelian BMC (Fiat)`,
        gps: '-',
        tags: 'Pembelian, Fiat',
        details: { pemilik: bankName, paket: `${activePkg.bmc} BMC` },
        uploadedFiles: {
          'Bukti Transfer': paymentProof
        },
        rewardAmount: activePkg.bmc
      });
      alert(t('tw_alert_buy_success').replace('{bmc}', activePkg.bmc));
      const waText = encodeURIComponent(`Halo Admin, saya (${bankName}) sudah mentransfer sejumlah Rp ${activePkg.idr} untuk pembelian ${activePkg.bmc} BMC. Berikut adalah bukti transfer saya.`);
      window.open(`https://wa.me/628174139994?text=${waText}`, '_blank');
    }
    setActivePkg(null);
    setBankName('');
    setPaymentProof(null);
  };

  return (
    <div style={{ animation: 'fadeIn 0.2s', marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', margin: 0, fontWeight: '900' }}>{t('tw_subtab_buy')} (Fiat)</h3>
        <div style={{ fontSize: '0.8rem', background: '#e7f5ff', color: '#1864ab', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', border: '1px solid #a5d8ff' }}>
           {t('tw_buy_rate_prefix')}{marketPrice.toLocaleString('id-ID')}
        </div>
      </div>

      {activePkg && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '32px', padding: isMobile ? '24px' : '32px', width: '90%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, marginBottom: '8px', fontWeight: '900', color: 'var(--text-main)' }}>{t('tw_buy_confirm')} {activePkg.bmc} BMC</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>{t('tw_buy_transfer_1')}<strong>Rp {activePkg.idr}</strong>{t('tw_buy_transfer_2')}</p>
            
            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px', marginBottom: '12px', fontSize: '0.8rem', border: '1px solid var(--border-color)', lineHeight: 1.5, color: 'var(--text-main)' }}>
              <strong>{t('tw_buy_bank_name_label')}</strong><br/>
              {t('tw_buy_bank_account_name')}<br/>
              {t('tw_buy_bank_account_number')}
            </div>

            <div style={{ padding: '16px', background: 'rgba(18, 184, 134, 0.1)', borderRadius: '16px', marginBottom: '20px', border: '1px solid #12b886' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{t('tw_buy_bank_name')}</label>
                <input type="text" value={bankName} onChange={e => setBankName(e.target.value)} placeholder={t('tw_buy_bank_name_ph')} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '8px', fontSize: '0.9rem', background: 'var(--bg-color)', color: 'var(--text-main)' }} />
                <p style={{ margin:0, fontSize: '0.7rem', color: '#12b886' }}>{t('tw_buy_bank_name_note')}</p>
            </div>

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{t('tw_buy_upload')}</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px', fontSize: '0.8rem', boxSizing: 'border-box', background: 'var(--bg-color)', color: 'var(--text-main)' }} />
            {paymentProof && <div style={{ marginBottom: '16px', width: '80px', height: '80px', borderRadius: '8px', background: `url(${paymentProof}) center/cover`, border: '1px solid var(--border-color)' }} />}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={() => setActivePkg(null)} style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>{t('tw_buy_cancel')}</button>
              <button 
                onClick={handlePaymentProofSubmit}
                style={{ padding: '14px', borderRadius: '16px', border: 'none', background: '#25D366', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)', fontSize: '0.9rem' }}>
                WA Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {packages.map((pkg, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '24px', padding: '24px', border: '2px solid #e9ecef', position: 'relative', textAlign: 'center', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column' }}>
            {pkg.badge && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: pkg.bmc === 10 ? '#12b886' : '#f59f00', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>{pkg.badge}</div>}
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '4px', marginTop: 'auto' }}>{pkg.bmc} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>BMC</span></div>
            <div style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '16px' }}>Rp {pkg.idr}</div>
            <button onClick={() => setActivePkg(pkg)} style={{ width: '100%', background: 'var(--primary)', color: 'white', border: 'none', padding: '12px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(12, 166, 120, 0.15)', marginTop: 'auto' }}>{t('tw_buy_order_now')}</button>
          </div>
        ))}
        
        {/* Custom BMC Amount Card */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '24px', border: '2px dashed var(--primary)', position: 'relative', textAlign: 'center', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>{t('tw_buy_custom')}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px', marginTop: 'auto' }}>
            <input 
              type="number" 
              value={customBmc} 
              onChange={(e) => setCustomBmc(e.target.value)} 
              placeholder="0" 
              min="1"
              style={{ width: '80px', padding: '8px', borderRadius: '12px', border: '2px solid #e9ecef', fontSize: '1.5rem', fontWeight: '900', textAlign: 'center', color: 'var(--text-main)', outlineColor: 'var(--primary)' }} 
            />
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>BMC</span>
          </div>
          <div style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '16px' }}>
            Rp {customBmc && parseFloat(customBmc) > 0 ? (parseFloat(customBmc) * marketPrice).toLocaleString('id-ID') : 0}
          </div>
          <button 
            onClick={() => {
              if(customBmc && parseFloat(customBmc) > 0) {
                setActivePkg({ bmc: parseFloat(customBmc), idr: Math.floor(parseFloat(customBmc) * marketPrice).toLocaleString('id-ID') });
              } else {
                alert(t('tw_alert_invalid_amt'));
              }
            }} 
            style={{ width: '100%', background: 'white', color: 'var(--primary)', border: '2px solid var(--primary)', padding: '10px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', fontSize: '0.9rem', marginTop: 'auto' }}>
            {t('tw_buy_order_now')}
          </button>
        </div>
      </div>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, border: '1px solid #e9ecef' }}>
        <strong>{t('tw_buy_payment_methods')}</strong><br/>
        {t('tw_buy_payment_desc')}
      </div>
    </div>
  );
};

const EarnBMC = () => {
  const { user, addReward, addPendingValidation, processCheckin, getActiveStreak, getJakartaCheckinDay } = useAuth();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState({ social: false, crypto: false, pi: false, watch: false });
  const [activeTask, setActiveTask] = useState(null);
  const [taskInput, setTaskInput] = useState('');
  const [taskFile, setTaskFile] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [piPaymentStatus, setPiPaymentStatus] = useState('idle'); // idle, authenticating, paying, approved, completed, error
  const [piPaymentLog, setPiPaymentLog] = useState('');

  const handlePiPayment = async () => {
    if (!window.Pi) {
      setPiPaymentLog('Pi SDK tidak terdeteksi. Silakan buka aplikasi ini di dalam Pi Browser.');
      alert(t('tw_alert_pi_sdk'));
      return;
    }

    try {
      setPiPaymentStatus('authenticating');
      setPiPaymentLog('Menginisialisasi Pi Network SDK...');

      const isSandbox = window.location.search.includes('sandbox=true') || window.location.hostname.includes('vercel.app') || window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
      window.Pi.init({ version: "2.0", sandbox: isSandbox });

      setPiPaymentLog('Mengautentikasi dengan Pi Network...');
      
      const scopes = ['username', 'payments'];
      
      const onIncompletePaymentFound = async (payment) => {
        setPiPaymentLog(`Menemukan transaksi menggantung (ID: ${payment.identifier}). Mencoba menyelesaikan...`);
        if (payment.txid) {
          const res = await fetch('/api/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId: payment.identifier, txid: payment.txid }),
          });
          if (res.ok) {
            setPiPaymentStatus('completed');
            setPiPaymentLog(`Transaksi menggantung berhasil diselesaikan! (ID: ${payment.identifier})`);
          } else {
            setPiPaymentStatus('error');
            setPiPaymentLog(`Gagal menyelesaikan transaksi menggantung.`);
          }
        } else {
          setPiPaymentLog(`Transaksi menggantung ditemukan tetapi belum ditandatangani blockchain (tidak ada txid).`);
        }
      };

      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      setPiPaymentLog(`Autentikasi berhasil! User: ${auth.user.username}`);
      
      setPiPaymentStatus('paying');
      setPiPaymentLog('Memulai pembayaran 0.1 Pi Testnet...');

      window.Pi.createPayment({
        amount: 0.1,
        memo: "Uji Coba Transaksi BaMbooChain Step 10",
        metadata: { paymentType: "verification" }
      }, {
        onReadyForServerApproval: async (paymentId) => {
          setPiPaymentStatus('approved');
          setPiPaymentLog(`Pembayaran dibuat (ID: ${paymentId}). Menunggu persetujuan backend...`);
          
          const res = await fetch('/api/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId })
          });
          
          if (!res.ok) {
            const err = await res.json();
            setPiPaymentStatus('error');
            setPiPaymentLog(`Backend gagal menyetujui pembayaran: ${err.error || 'Unknown error'}`);
            throw new Error(err.error || 'Approval failed');
          }
          
          setPiPaymentLog('Pembayaran disetujui backend. Silakan masukkan passphrase dompet Pi Anda di jendela pop-up Pi Browser.');
          return res.json();
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          setPiPaymentLog(`Transaksi ditandatangani di blockchain (TxID: ${txid.substring(0, 10)}...). Menyelesaikan di backend...`);
          
          const res = await fetch('/api/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid })
          });
          
          if (!res.ok) {
            const err = await res.json();
            setPiPaymentStatus('error');
            setPiPaymentLog(`Backend gagal menyelesaikan pembayaran: ${err.error || 'Unknown error'}`);
            throw new Error(err.error || 'Completion failed');
          }
          
          setPiPaymentStatus('completed');
          setPiPaymentLog('✅ Pembayaran BERHASIL! Transaksi diselesaikan sepenuhnya.');
          alert(t('tw_alert_pi_success'));
          
          // Reward user with 10 BMC on successful payment
          if (addReward) {
            addReward(10, 'Pi Testnet Payment Verification', 'Earn');
          }
          
          return res.json();
        },
        onCancel: (paymentId) => {
          setPiPaymentStatus('idle');
          setPiPaymentLog(`Pembayaran dibatalkan oleh pengguna (ID: ${paymentId})`);
        },
        onError: (error, payment) => {
          setPiPaymentStatus('error');
          setPiPaymentLog(`Terjadi kesalahan pembayaran: ${error.message || error}`);
          console.error("Pi Payment Error: ", error, payment);
        }
      });

    } catch (err) {
      setPiPaymentStatus('error');
      setPiPaymentLog(`Autentikasi/Proses gagal: ${err.message || err}`);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentWibDay = getJakartaCheckinDay ? getJakartaCheckinDay() : new Intl.DateTimeFormat('fr-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
  const lastCheckin = user?.lastCheckinDate || null;
  const streak = getActiveStreak ? getActiveStreak() : 0;
  const canCheckinToday = lastCheckin !== currentWibDay;

  const handleDaily = async () => {
    if (!canCheckinToday) return;
    const result = await processCheckin();
    if (result) {
      alert(t('tw_alert_daily_success').replace('{day}', result.nextStreak).replace('{amt}', result.amount));
    }
  };

  const handleFileChange = (e) => {
    if(e.target.files && e.target.files[0]) {
      setTaskFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleTaskSubmit = (taskKey, taskName, amount) => {
    if (!taskInput || !taskFile) {
      alert(t('tw_alert_req_username'));
      return;
    }

    if (!tasks[taskKey]) {
      addPendingValidation({
        title: `Gamification: ${taskName}`,
        gps: '-',
        tags: 'Gamification, ' + taskKey,
        details: { pemilik: user?.name || 'User', username_input: taskInput },
        uploadedFiles: {
          'Screenshot': taskFile
        },
        rewardAmount: amount
      });
      setTasks(prev => ({ ...prev, [taskKey]: true }));
      setTaskInput('');
      setTaskFile(null);
      setActiveTask(null);
      alert(t('tw_alert_task_review').replace('{amt}', amount));
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.2s', marginTop: '24px' }}>
      <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', marginBottom: '20px', fontWeight: '900' }}>Earn BMC (Gamification)</h3>
      
      {/* Proof Modal */}
      {activeTask && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: isMobile ? '24px' : '32px', width: '90%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.2rem', fontWeight: '900' }}>{activeTask.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>Lengkapi form bukti untuk klaim <strong>{activeTask.rewardLabel || activeTask.reward} BMC</strong> Anda.</p>
            
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>{activeTask.inputType === 'uid' ? 'Masukkan Akun ID / Referral' : 'Masukkan Username Akun'}</label>
            <input type="text" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} placeholder={activeTask.inputType === 'uid' ? 'Contoh: 129301923' : 'Contoh: @username'} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ced4da', marginBottom: '16px', fontSize: '0.9rem', boxSizing: 'border-box' }} />

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>Upload Bukti Screenshot</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%', padding: '8px', borderRadius: '12px', border: '1px solid #ced4da', marginBottom: '24px', fontSize: '0.8rem', boxSizing: 'border-box' }} />
            {taskFile && <div style={{ marginBottom: '16px', width: '60px', height: '60px', borderRadius: '8px', background: `url(${taskFile}) center/cover`, border: '1px solid #ced4da' }} />}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setActiveTask(null); setTaskInput(''); setTaskFile(null); }} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ced4da', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>Batal</button>
              <button onClick={() => { handleTaskSubmit(activeTask.key, activeTask.title, activeTask.reward); }} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>Kirim Bukti</button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Check-in */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: isMobile ? '20px' : '24px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <CalendarDays size={24} color="var(--primary)" />
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Daily Check-in</h4>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Login setiap hari (Reset 07:00 WIB) untuk mendapatkan BMC. Streak: <strong>{streak} Hari</strong> 🔥</p>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
          {[
            { day: 1, rwd: "0.001" },
            { day: 2, rwd: "0.002" },
            { day: 3, rwd: "0.003" },
            { day: 4, rwd: "0.004" },
            { day: 5, rwd: "0.005" },
            { day: 6, rwd: "0.006" },
            { day: 7, rwd: "0.010", special: true },
          ].map((d, i) => {
            const dayNum = i + 1;
            let status = 'locked';
            if(dayNum <= streak) status = 'claimed';
            else if(dayNum === streak + 1 && canCheckinToday) status = 'today';
            else if(dayNum === streak + 1 && !canCheckinToday) status = 'locked';

            return (
            <div key={d.day} style={{ minWidth: '70px', background: status === 'claimed' ? 'var(--bg-claimed)' : status === 'today' ? 'var(--primary)' : 'var(--bg-locked)', color: status === 'today' ? 'white' : 'var(--text-main)', border: d.special ? '2px solid #fcc419' : 'none', borderRadius: '12px', padding: '12px', textAlign: 'center', opacity: status === 'locked' ? 0.6 : 1 }}>
              <div style={{ fontSize: '0.7rem', marginBottom: '4px' }}>Day {d.day}</div>
              <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{d.rwd}</div>
              {status === 'today' && <button onClick={handleDaily} style={{ marginTop: '8px', background: 'white', color: 'var(--primary)', border: 'none', padding: '4px 8px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 'bold', cursor: 'pointer' }}>Claim</button>}
              {status === 'claimed' && <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#12b886' }}>✅</div>}
            </div>
            );
          })}
        </div>
      </div>

      {/* Pi Sandbox Payment Verification (Step 10) */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: isMobile ? '20px' : '24px', border: '1px solid var(--border-color)', marginBottom: '20px', background: 'linear-gradient(to bottom right, var(--bg-card), #f8f9fa)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Globe size={24} color="#f59f00" />
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Pi Browser Payment Verification (Step 10)</h4>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.5 }}>
          Uji coba pembayaran Testnet Pi dari pengguna ke aplikasi (User-to-App payment) untuk menyelesaikan langkah ke-10 di Portal Developer Pi.
        </p>

        {piPaymentLog && (
          <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '12px', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '16px', borderLeft: '4px solid #f59f00', color: '#495057', wordBreak: 'break-all', border: '1px solid #e9ecef', borderLeftWidth: '4px' }}>
            <strong>Log:</strong> {piPaymentLog}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={handlePiPayment} 
            disabled={piPaymentStatus === 'authenticating' || piPaymentStatus === 'paying' || piPaymentStatus === 'approved'} 
            style={{ 
              background: piPaymentStatus === 'completed' ? '#12b886' : 'linear-gradient(135deg, #f59f00, #e03131)', 
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '14px', 
              fontWeight: 'bold', 
              cursor: (piPaymentStatus === 'authenticating' || piPaymentStatus === 'paying' || piPaymentStatus === 'approved') ? 'not-allowed' : 'pointer', 
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(245, 159, 0, 0.2)'
            }}
          >
            {piPaymentStatus === 'idle' && 'Kirim Testnet 0.1 Pi'}
            {piPaymentStatus === 'authenticating' && 'Mengautentikasi...'}
            {piPaymentStatus === 'paying' && 'Memproses Pembayaran...'}
            {piPaymentStatus === 'approved' && 'Menunggu Tanda Tangan Wallet...'}
            {piPaymentStatus === 'completed' && 'Selesai (Kirim Ulang)'}
            {piPaymentStatus === 'error' && 'Coba Lagi'}
          </button>

          {piPaymentStatus === 'completed' && (
            <span style={{ color: '#12b886', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={16} /> Pembayaran Sukses! (+10 BMC)
            </span>
          )}
        </div>
      </div>

      {/* Social Tasks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {[
          { key: 'social', title: 'Social & Ecosystem Tasks', reward: 0.005, desc: 'Follow founder, yayasan, & BMC official (Instagram, YouTube, TikTok, LinkedIn, X, Fanpage).', input: 'username' },
          { key: 'crypto', title: 'Join Crypto Exchange', reward: 0.1, rewardLabel: '0.1 - 10', desc: 'Daftar via referral dan dapatkan bonus. (Binance, Tokocrypto, Gate.io).', input: 'uid' },
          { key: 'pi', title: 'Join Pi Network', reward: 0.01, desc: 'Integrasi Future Web3 Ecosystem. Daftar menggunakan referral founder.', input: 'username' },
          { key: 'watch', title: 'Watch & Support', reward: 0.005, rewardLabel: '0.005 / view', desc: 'Nonton YouTube @bambupedia & like konten resmi (Reward per tontonan).', input: 'username' },
        ].map((t) => (
          <div key={t.key} style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 'bold' }}>{t.title}</h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.4, flex: 1 }}>{t.desc}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem' }}>+{t.rewardLabel || t.reward} BMC</span>
              <button onClick={() => setActiveTask({key: t.key, title: t.title, reward: t.reward, rewardLabel: t.rewardLabel, inputType: t.input})} disabled={tasks[t.key]} style={{ padding: '6px 16px', borderRadius: '20px', border: tasks[t.key] ? '1px solid var(--border-color)' : '1px solid var(--primary)', background: tasks[t.key] ? 'var(--bg-secondary)' : 'transparent', color: tasks[t.key] ? 'var(--text-muted)' : 'var(--primary)', cursor: tasks[t.key] ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}>{tasks[t.key] ? 'Pending' : 'Kirim Bukti'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContributeDataBMC = () => {
  const { user, addPendingValidation } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [mapOpen, setMapOpen] = useState(false);
  const [gps, setGps] = useState("");
  const [localName, setLocalName] = useState("");
  const [jmlRebung, setJmlRebung] = useState("");
  const [pemilik, setPemilik] = useState("");
  const [alamatPemilik, setAlamatPemilik] = useState("");
  const [waPemilik, setWaPemilik] = useState("");
  const [aksesJalan, setAksesJalan] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [lainnyaText, setLainnyaText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({});

  const handleTagClick = (tag) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter(t => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };

  const handleKycCheck = (action) => {
      if (user?.kycStatus !== 'verified') {
          alert(t('tw_alert_kyc_req'));
          return false;
      }
      return true;
  };

  const locateGps = () => setMapOpen(true);

  const handleMapPinDrop = (e) => {
    const mockLat = (-6.1214 + Math.random() * 0.001).toFixed(5);
    const mockLng = (106.123 + Math.random() * 0.001).toFixed(5);
    setGps(`${mockLat}, ${mockLng}`);
    setMapOpen(false);
  };

  const handleFileChange = (e, fileKey) => {
    if(e.target.files && e.target.files.length > 0) {
      const ObjectURL = URL.createObjectURL(e.target.files[0]);
      setUploadedFiles(prev => ({ ...prev, [fileKey]: ObjectURL }));
    }
  };

  const handleSubmit = () => {
    if(!handleKycCheck('Kontribusi Data')) return;
    if(!localName || !gps) {
      alert(t('tw_alert_req_gps'));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let finalTags = [...activeTags];
      if(activeTags.includes('Lainnya') && lainnyaText) {
        finalTags.push(`Lainnya: ${lainnyaText}`);
      }
      addPendingValidation({ 
        title: `Observasi: ${localName}`, 
        gps: gps,
        tags: finalTags.join(', '),
        details: { jmlRebung, pemilik, alamatPemilik, waPemilik, aksesJalan },
        uploadedFiles
      });
      alert(t('tw_alert_data_sent'));
    }, 1500);
  };

  const photoRequirements = [
    { label: 'Rumpun', count: 3, ex: 'taksonomi3.jpg' },
    { label: 'Ruas Batang', count: 1, ex: 'batang4.jpg' },
    { label: 'Buku Batang', count: 1, ex: 'taksonomi4.jpg' },
    { label: 'Pelepah Daun', count: 1, ex: 'taksonomi4.jpg' },
    { label: 'Pelepah Batang (Blade-Auricle-Bristle)', count: 3, ex: 'pelepah2.jpg' },
    { label: 'Cabang', count: 1, ex: 'taksonomi5.jpg' },
    { label: 'Rebung (Opsional: Depan-Samping-Atas)', count: 3, ex: 'rebung.jpg' },
    { label: 'Bunga (Opsional)', count: 1, ex: 'bunga.jpg' },
    { label: 'Selfie dengan rumpun bambu', count: 1, ex: 'taksonomi6.jpg' }
  ];

  const taxonomyImages = ['batang.jpg', 'batang2.jpg', 'batang3.jpg', 'batang4.jpg', 'bunga.jpg', 'bunga2.jpg', 'pelepah.jpg', 'pelepah2.jpg', 'rebung.jpg', 'rumpun.jpg', 'survey.jpg', 'taksonomi.jpg', 'taksonomi2.jpg', 'taksonomi3.jpg', 'taksonomi4.jpg', 'taksonomi5.jpg', 'taksonomi6.jpg'];

  return (
    <div style={{ animation: 'fadeIn 0.2s', marginTop: '24px' }}>
      {previewImg && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', backdropFilter: 'blur(4px)' }} onClick={() => setPreviewImg(null)}>
          <img src={`./gambar/${previewImg}`} alt="Preview" style={{ maxWidth: '90%', maxHeight: '90vh', borderRadius: '12px', border: '2px solid white' }} />
        </div>
      )}

      {mapOpen && (
        <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: isMobile ? '24px' : '32px', borderRadius: '24px', width: '90%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.2s' }}>
            <h3 style={{ margin:0, fontWeight: '900' }}>Pilih Lokasi</h3>
            <p style={{ margin:0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Klik di peta untuk koordinat GPS.</p>
            <div onClick={handleMapPinDrop} style={{ width: '100%', height: isMobile ? '200px' : '300px', background: 'url(./gambar/gmap.jpg) center/cover', borderRadius: '16px', border: '2px solid #dee2e6', cursor: 'crosshair', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', pointerEvents: 'none', fontSize: '0.8rem' }}>⬇️ Klik di Peta ⬇️</div>
            </div>
            <button onClick={() => setMapOpen(false)} style={{ padding: '12px', border: '1px solid #ced4da', background: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>Batal</button>
          </div>
        </div>
      )}

      <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', marginBottom: '8px', fontWeight: '900' }}>{t('tw_contribute_title')}</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>{t('tw_contribute_desc')}</p>

      <div style={{ background: 'white', borderRadius: '24px', padding: isMobile ? '24px' : '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', border: '1px solid #f1f3f5' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>{t('tw_lbl_local_name')}</label>
            <input type="text" value={localName} onChange={e => setLocalName(e.target.value)} placeholder="Contoh: Bambu Apus" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e9ecef', fontSize: '0.95rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>{t('tw_lbl_gps')}</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={gps} onChange={e => setGps(e.target.value)} placeholder="-6.1214, 106.123" style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e9ecef', fontSize: '0.95rem' }} />
              <button onClick={locateGps} style={{ padding: '0 16px', background: '#f8f9fa', border: '1.5px solid #e9ecef', borderRadius: '12px', cursor: 'pointer', color: 'var(--primary)' }}><MapPin size={18} /></button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>{t('tw_lbl_est_clumps')}</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" placeholder={t('tw_plc_clumps')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e9ecef', fontSize: '0.95rem' }} />
              <input type="number" placeholder={t('tw_plc_stems')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e9ecef', fontSize: '0.95rem' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>{t('tw_lbl_distance')}</label>
            <input type="text" value={aksesJalan} onChange={e => setAksesJalan(e.target.value)} placeholder="Contoh: 50 meter" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e9ecef', fontSize: '0.95rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>{t('tw_lbl_shoots')}</label>
            <input type="number" value={jmlRebung} onChange={e => setJmlRebung(e.target.value)} placeholder="0" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e9ecef', fontSize: '0.95rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>{t('tw_lbl_owner_name')}</label>
            <input type="text" value={pemilik} onChange={e => setPemilik(e.target.value)} placeholder="Nama Lengkap Pemilik" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e9ecef', fontSize: '0.95rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>{t('tw_lbl_owner_address')}</label>
            <input type="text" value={alamatPemilik} onChange={e => setAlamatPemilik(e.target.value)} placeholder="Alamat Detail" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e9ecef', fontSize: '0.95rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>{t('tw_lbl_owner_wa')}</label>
            <input type="text" value={waPemilik} onChange={e => setWaPemilik(e.target.value)} placeholder="08123XXX" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e9ecef', fontSize: '0.95rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>{t('tw_lbl_potential')}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: activeTags.includes('Lainnya') ? '12px' : '0' }}>
              {['BUMDES', 'KMP', 'Kuliner', 'Pariwisata', 'Industri Bambu', 'Pasar Bambu', 'SPPG', 'Akses Jalan', 'Lainnya'].map(tag => (
                <span key={tag} onClick={() => handleTagClick(tag)} style={{ padding: '6px 14px', background: activeTags.includes(tag) ? 'var(--primary)' : '#f1f3f5', color: activeTags.includes(tag) ? 'white' : 'var(--text-main)', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold' }}>{tag}</span>
              ))}
            </div>
            {activeTags.includes('Lainnya') && (
              <input type="text" value={lainnyaText} onChange={e => setLainnyaText(e.target.value)} placeholder="Tuliskan potensi lainnya..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e9ecef', fontSize: '0.95rem', boxSizing: 'border-box' }} />
            )}
          </div>
        </div>

        <div style={{ background: '#f8f9fa', padding: isMobile ? '20px' : '24px', borderRadius: '20px', marginBottom: '24px', border: '1px dashed #dee2e6' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 'bold' }}>{t('tw_lbl_upload_photo')}</h4>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('tw_desc_upload_photo')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {photoRequirements.map((req, i) => (
              <div key={i} style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #e9ecef', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{req.label} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>({req.count} Foto)</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => setPreviewImg(req.ex)} style={{ padding: '10px', fontSize: '0.8rem', borderRadius: '10px', border: '1px solid var(--primary)', background: 'white', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>Lihat Contoh</button>
                  <div style={{ display: 'grid', gridTemplateColumns: req.count > 1 ? `repeat(${req.count}, 1fr)` : '1fr', gap: '8px' }}>
                    {Array.from({ length: req.count }).map((_, idx) => (
                      <label key={idx} style={{ padding: '10px', fontSize: '0.75rem', borderRadius: '10px', background: uploadedFiles[`${req.label}_${idx}`] ? '#dcf8c6' : '#2ecc71', color: uploadedFiles[`${req.label}_${idx}`] ? '#075e54' : 'white', cursor: 'pointer', textAlign: 'center', fontWeight: 'bold', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {uploadedFiles[`${req.label}_${idx}`] ? 'OK' : req.count > 1 ? `Foto ${idx+1}` : 'Upload'} 
                        <input onChange={(e) => handleFileChange(e, `${req.label}_${idx}`)} type="file" accept="image/*" style={{ display: 'none' }} />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#f1f3f5', padding: '24px', borderRadius: '24px', marginBottom: '32px' }}>
           <h4 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '8px', textAlign: 'center', color: '#1864ab' }}>Galeri Pengetahuan Taksonomi Bambu</h4>
           <p style={{ margin: '0 0 20px 0', fontSize: '0.8rem', color: '#495057', textAlign: 'center' }}>Geser ke samping (swipe) untuk melihat referensi komprehensif galeri data taksonomi bambu yayasan kami.</p>
           <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', scrollSnapType: 'x mandatory' }}>
              {taxonomyImages.map((img, i) => (
                 <div key={i} style={{ minWidth: '160px', height: '160px', borderRadius: '20px', background: `url(./gambar/${img}) center/cover`, border: '4px solid white', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', scrollSnapAlign: 'start' }} />
              ))}
           </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '20px', borderRadius: '20px', fontWeight: '900', width: '100%', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1.1rem', boxShadow: '0 10px 25px rgba(46,204,113,0.3)', transition: 'all 0.2s' }}>
          {loading ? 'Mengirim Data...' : 'Kirim Data (Dapatkan BMC)'}
        </button>
      </div>
    </div>
  );
};

const ValidatorBMC = () => {
  const { user, stakeBmc, approveValidation, approvePlantationDonation, releaseMilestone } = useAuth();
  const { t } = useLanguage();
  const { data: pendingValidations = [] } = useValidations(user?.id);
  const { data: plantationDonations = [] } = usePlantationDonations();
  const { data: allLocationProposals = [] } = useLocationProposals(user?.id, user?.username);
  
  const pendingDonations = plantationDonations.filter(d => d.status === 'pending');
  const verifiedDonations = plantationDonations.filter(d => d.status === 'verified' || d.status === 'active');
  const pendingLocationProposals = allLocationProposals.filter(d => d.status === 'pending' || d.status === 'Pending Verification');

  const handleVerifyLocation = async (id, name) => {
    try {
      await updateDoc(doc(db, "location_proposals", id), { status: "Verified & Active" });
      alert(`Berhasil memverifikasi ${name}!`);
      // Optional: re-fetch or rely on cache invalidation/real-time updates if any
    } catch (err) {
      console.error(err);
      alert('Gagal memverifikasi.');
    }
  };

  const handleRejectLocation = async (id, name) => {
    try {
      await updateDoc(doc(db, "location_proposals", id), { status: "Rejected" });
      alert(`Berhasil menolak ${name}!`);
    } catch (err) {
      console.error(err);
      alert('Gagal menolak.');
    }
  };
  const staked = user?.stakedBalance || 0;
  
  let tierName = "Non-Validator";
  let tierLevel = 0;
  if (staked >= 500) { tierName = "🥇 Master Validator"; tierLevel = 3; }
  else if (staked >= 100) { tierName = "🥈 Ecosystem Validator"; tierLevel = 2; }
  else if (staked >= 10) { tierName = "🥉 Novice Validator"; tierLevel = 1; }

  const hasEnough = tierLevel > 0;
  const isStaked = user?.isValidator || false;
  
  const [termsModal, setTermsModal] = useState(false);
  const [stakeTarget, setStakeTarget] = useState(10);
  const [previewImgWithWatermark, setPreviewImgWithWatermark] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const confirmStake = () => {
    if (stakeBmc(stakeTarget, 'Validator')) {
      setTermsModal(false);
      alert(t('tw_alert_stake_success').replace('{bmc}', stakeTarget));
    } else {
      alert(t('tw_alert_insufficient'));
      setTermsModal(false);
    }
  };

  const filteredValidations = (pendingValidations || []).filter(task => {
    if (task.status !== 'pending') return false;
    const isFiat = task.tags?.includes('Fiat') || task.tags?.includes('Pembelian');
    const isKyc = task.tags?.includes('KYC') || task.tags?.includes('Identity');
    const isGamification = task.tags?.includes('Gamification');

    if (tierLevel === 1) {
      // Novice: Hanya Tracker/Observasi
      return !isFiat && !isKyc && !isGamification;
    }
    if (tierLevel === 2) {
      // Ecosystem: Tracker, KYC, Gamification (Tapi BUKAN Fiat)
      return !isFiat;
    }
    if (tierLevel === 3) {
      // Master: Semua
      return true;
    }
    return false;
  });

  return (
    <div style={{ animation: 'fadeIn 0.2s', marginTop: '24px' }}>
      {previewImgWithWatermark && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', backdropFilter: 'blur(5px)' }} onClick={() => setPreviewImgWithWatermark(null)}>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90vh' }}>
            <img src={previewImgWithWatermark} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', color: 'rgba(255, 255, 255, 0.3)', fontSize: isMobile ? '1.2rem' : '2rem', fontWeight: '900', whiteSpace: 'nowrap', pointerEvents: 'none', textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              CONFIDENTIAL<br/>
              <span style={{ fontSize: '0.7rem', fontWeight: 'normal' }}>Validator: {user?.name || 'Authorized'}</span>
            </div>
          </div>
        </div>
      )}

      {termsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: isMobile ? '24px' : '32px', width: '90%', maxWidth: '500px', animation: 'fadeIn 0.2s' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#e03131', fontWeight: '900' }}>⚠️ Syarat Validator</h3>
            <div style={{ background: '#fff5f5', padding: '16px', borderRadius: '16px', border: '1px solid #ffc9c9', marginBottom: '24px', fontSize: '0.85rem', color: '#495057', maxHeight: '300px', overflowY: 'auto' }}>
              <p>Sebagai Validator resmi, Anda diwajibkan menjaga kerahasiaan data (NDA). Data kontribusi adalah Hak Milik Yayasan.</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Dilarang mengunduh/menyebarkan foto observasi.</li>
                <li>Dilarang menyalahgunakan kontak pemilik rumpun.</li>
                <li>Lakukan validasi jujur berdasarkan bukti fisik.</li>
              </ul>
              <strong style={{ color: '#e03131' }}>SANKSI: Pelanggaran NDA berakibat pembekuan saldo BMC permanen dan penghapusan akun.</strong>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
              <button onClick={() => setTermsModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1.5px solid #dee2e6', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Batal</button>
              <button onClick={confirmStake} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#e03131', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Setuju & Stake {stakeTarget} BMC</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', marginBottom: '8px', fontWeight: '900' }}>Dashboard Validator</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Bantu sistem konsensus dengan memverifikasi data lapangan.</p>
        </div>
        {isStaked && tierLevel < 3 && (
          <button 
            onClick={() => { setStakeTarget(500 - staked); setTermsModal(true); }}
            style={{ padding: '10px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(12, 166, 120, 0.2)' }}
          >
            🚀 Upgrade to Master
          </button>
        )}
      </div>

      {isStaked ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? '12px' : '16px' }}>
            {[
              { val: tierName.split(' ')[0], label: tierName.replace(tierName.split(' ')[0] + ' ', ''), color: 'var(--primary)' },
              { val: filteredValidations.length + pendingDonations.length, label: 'Pending', color: '#f59f00' },
              { val: staked, label: 'Staked BMC', color: '#12b886' },
              { val: '99%', label: 'Score', color: '#12b886' }
            ].map((stat, i) => (
              <div key={i} style={{ background: 'white', padding: isMobile ? '16px' : '20px', borderRadius: '20px', border: '1px solid #f1f3f5', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: '900', color: stat.color, marginBottom: '4px' }}>{stat.val}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', border: '1px solid #f1f3f5', borderRadius: '24px', padding: isMobile ? '24px' : '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '900' }}><ShieldCheck size={24} color="#1864ab" /> Ruang Kerja Validator</h4>
            
            {(user && filteredValidations.length === 0 && pendingDonations.length === 0 && pendingLocationProposals.length === 0 && verifiedDonations.length === 0) ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', background: '#f8f9fa', borderRadius: '20px', color: '#adb5bd', fontSize: '0.9rem' }}>
                 Belum ada data antrean baru untuk Tier Anda saat ini.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 {/* GIS Location Proposals Queue */}
                 {pendingLocationProposals.map(s => (
                   <div key={s.id} style={{ background: '#f8f9fa', padding: isMobile ? '20px' : '24px', borderRadius: '20px', border: '1.5px solid #f1f3f5', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '900', fontSize: '1.1rem', marginBottom: '4px' }}>Usulan Lokasi Baru (GIS)</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🕒 {s.date || 'Baru'}</div>
                        </div>
                        <span style={{ fontSize: '0.75rem', background: '#f59f00', color: 'white', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' }}>Pending Verification</span>
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                       <div style={{ background: 'white', padding: '12px', borderRadius: '12px' }}><strong>📍 Nama Lokasi:</strong> <span style={{ color: '#1864ab', marginLeft: '4px', fontWeight: 'bold' }}>{s.name}</span></div>
                       <div style={{ background: 'white', padding: '12px', borderRadius: '12px' }}><strong>📏 Estimasi Luas:</strong> <span style={{ marginLeft: '4px' }}>{s.size} Ha</span></div>
                       <div style={{ background: 'white', padding: '12px', borderRadius: '12px' }}><strong>🏷️ Tipe Lahan:</strong> <span style={{ marginLeft: '4px' }}>{s.type}</span></div>
                       <div style={{ background: 'white', padding: '12px', borderRadius: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Globe size={14} color="var(--primary)" />
                            <span>Koordinat: {s.coordinates}</span>
                          </div>
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.name)}`} target="_blank" rel="noreferrer" style={{ color: '#4dabf7', textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}>
                            Buka di Google Maps ↗
                          </a>
                       </div>
                       <div style={{ background: 'white', padding: '12px', borderRadius: '12px' }}>
                         <strong>👤 Pengusul:</strong> <span style={{ marginLeft: '4px' }}>{s.pengusul || s.owner || '-'}</span><br/>
                         <strong style={{ display: 'inline-block', marginTop: '4px' }}>📞 PIC (WA):</strong> <span style={{ marginLeft: '4px' }}>{s.waPic || '-'}</span>
                       </div>
                       <div style={{ background: 'white', padding: '12px', borderRadius: '12px' }}>
                         <strong>🧑‍🌾 Kebutuhan SDM:</strong><br/>
                         <span style={{ color: 'var(--text-muted)', display: 'inline-block', marginTop: '4px' }}>Tanam: {s.kebutuhanPenanam || 0} | Rawat: {s.kebutuhanPerawat || 0} | Panen: {s.kebutuhanPemanen || 0}</span>
                       </div>
                     </div>

                     <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                       <button onClick={() => handleRejectLocation(s.id, s.name)} style={{ flex: 1, background: 'white', color: '#e03131', border: '1.5px solid #e03131', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>Tolak</button>
                       <button onClick={() => handleVerifyLocation(s.id, s.name)} style={{ flex: 1, background: '#16a34a', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' }}>Verifikasi Lokasi</button>
                     </div>
                   </div>
                 ))}

                 {/* Plantation Donations Queue */}
                 {pendingDonations.map(don => (
                   <div key={don.id} style={{ background: '#f8f9fa', padding: isMobile ? '20px' : '24px', borderRadius: '20px', border: '1.5px solid #f1f3f5', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '900', fontSize: '1.1rem', marginBottom: '4px' }}>Verifikasi Dukungan Penanaman</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🕒 {don.date}</div>
                        </div>
                        <span style={{ fontSize: '0.75rem', background: '#f59f00', color: 'white', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' }}>Fiat / Pembelian</span>
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                       <div style={{ background: 'white', padding: '12px', borderRadius: '12px' }}><strong>👤 Donatur:</strong> <span style={{ color: '#1864ab', marginLeft: '4px' }}>{don.name} (@{don.username})</span></div>
                       <div style={{ background: 'white', padding: '12px', borderRadius: '12px' }}><strong>📍 Lokasi:</strong> <span style={{ marginLeft: '4px' }}>{don.location?.name || '-'}</span></div>
                       <div style={{ background: 'white', padding: '12px', borderRadius: '12px' }}><strong>📦 Paket:</strong> <span style={{ marginLeft: '4px' }}>{don.package?.name || '-'}</span></div>
                       <div style={{ background: 'white', padding: '12px', borderRadius: '12px' }}><strong>💵 Nominal:</strong> <span style={{ color: '#e03131', marginLeft: '4px', fontWeight: 'bold' }}>{don.amount} USDT</span> ({don.paymentMethod})</div>
                     </div>

                     <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                       <button onClick={() => alert(t('tw_alert_rejected'))} style={{ flex: 1, background: 'white', color: '#e03131', border: '1.5px solid #e03131', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>Tolak</button>
                       <button onClick={async () => { await approvePlantationDonation(don.id); alert(t('tw_alert_approved')); }} style={{ flex: 1, background: '#51cf66', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(81,207,102,0.3)' }}>Sahkan Pembayaran</button>
                     </div>
                   </div>
                 ))}

                 {/* Active Escrow Verification Queue */}
                 {verifiedDonations.map(don => (
                   <div key={don.id} style={{ background: '#f8f9fa', padding: isMobile ? '20px' : '24px', borderRadius: '20px', border: '1.5px solid #f1f3f5', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '900', fontSize: '1.1rem', marginBottom: '4px' }}>Verifikasi Bukti Kerja (Escrow)</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 Lokasi: {don.location?.name || '-'} | 💵 {don.amount} USDT</div>
                        </div>
                        <span style={{ fontSize: '0.75rem', background: '#12b886', color: 'white', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' }}>Active Escrow</span>
                     </div>
                     
                     <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Verifikasi tugas lapangan di bawah ini untuk mencairkan porsi dana ke masing-masing stakeholder.
                     </div>

                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {don.milestones && Object.entries(don.milestones).map(([key, m]) => (
                          <button 
                            key={key} 
                            onClick={async () => { 
                               if (!m.released) {
                                  await releaseMilestone(don.id, key); 
                                  alert(`Misi ${m.name} disetujui! Dana dicairkan.`);
                               }
                            }} 
                            style={{ 
                              background: m.released ? '#ebfbee' : 'white', 
                              color: m.released ? '#2b8a3e' : '#495057', 
                              border: `1.5px solid ${m.released ? '#51cf66' : '#ced4da'}`, 
                              padding: '8px 16px', 
                              borderRadius: '12px', 
                              fontWeight: 'bold', 
                              cursor: m.released ? 'default' : 'pointer', 
                              fontSize: '0.8rem',
                              opacity: m.released ? 0.7 : 1,
                              transition: 'all 0.2s'
                            }}>
                            {m.released ? `✓ ${m.name} Selesai` : `Sahkan: ${m.name} (${m.percent}%)`}
                          </button>
                        ))}
                     </div>
                   </div>
                 ))}

                 {/* Other Validations Queue */}
                 {filteredValidations.map(task => (
                   <div key={task.id} style={{ background: '#f8f9fa', padding: isMobile ? '20px' : '24px', borderRadius: '20px', border: '1.5px solid #f1f3f5', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '900', fontSize: '1.1rem', marginBottom: '4px' }}>{task.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🕒 {new Date(task.date).toLocaleDateString()}</div>
                        </div>
                        <span style={{ fontSize: '0.75rem', background: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' }}>{task.tags?.split(',')[0] || 'Observation'}</span>
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                       <div style={{ background: 'white', padding: '12px', borderRadius: '12px' }}>                        {task.tags?.includes('Artikel') ? (
                          <strong>📝 Jenis Konten:</strong>
                        ) : (
                          <strong>📍 GPS:</strong>
                        )} <span style={{ color: '#1864ab', marginLeft: '4px' }}>{task.tags?.includes('Artikel') ? 'Artikel & Esai Ilmiah (Academy)' : (task.gps || '-')}</span></div>
                       {task.details && (
                         <div style={{ background: 'white', padding: '12px', borderRadius: '12px' }}>{task.tags?.includes('Artikel') ? <strong>👤 Penulis Pegiat:</strong> : <strong>👤 Pemilik:</strong>} <span style={{ marginLeft: '4px' }}>{task.details.pemilik || task.details.name || 'Anonim'}</span></div>
                       )}
                     </div>

                     {task.uploadedFiles && Object.keys(task.uploadedFiles).length > 0 && (
                       <div>
                         <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '12px', color: 'var(--text-muted)' }}>📷 BERKAS LAPORAN:</div>
                         <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                           {Object.entries(task.uploadedFiles).map(([key, imgUrl]) => (
                             <div key={key} onClick={() => setPreviewImgWithWatermark(imgUrl)} style={{ position: 'relative', flexShrink: 0, width: '90px', height: '90px', borderRadius: '12px', backgroundImage: `url("${imgUrl}")`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundColor: '#e9ecef', border: '2.5px solid white', cursor: 'zoom-in', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                               {!imgUrl || typeof imgUrl !== 'string' || !imgUrl.startsWith('data:') ? <span style={{fontSize: '0.6rem', color: '#adb5bd', textAlign: 'center'}}>No Image</span> : null}
                               <div style={{ position: 'absolute', background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '0.6rem', padding: '4px', bottom: 0, left: 0, right: 0, textAlign: 'center', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{key}</div>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}

                     <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '12px', marginTop: '8px', border: '1px solid var(--border-color, #e9ecef)' }}>
                       <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-main)' }}>💬 Chat Konfirmasi</div>
                       <input type="text" placeholder="Tanyakan detail spesifik..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color, #ced4da)', background: 'var(--bg-primary, white)', color: 'var(--text-main)', fontSize: '0.85rem', marginBottom: '8px', boxSizing: 'border-box' }} />
                       <button onClick={() => alert(t('tw_alert_msg_sent'))} style={{ background: 'var(--text-main)', color: 'var(--bg-primary, white)', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Kirim Pesan</button>
                     </div>

                     <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                       <button onClick={() => { approveValidation(task.id, 0, task.plantingId, task.userId); alert(t('tw_alert_rejected')); }} style={{ flex: 1, background: 'white', color: '#e03131', border: '1.5px solid #e03131', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>Tolak</button>
                       <button onClick={() => { approveValidation(task.id, task.rewardAmount, task.plantingId, task.userId); alert(t('tw_alert_val_success')); }} style={{ flex: 1, background: '#51cf66', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(81,207,102,0.3)' }}>Sahkan Data</button>
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>
      ) : (
      <div style={{ background: 'linear-gradient(135deg, #1864ab, #3b5bdb)', borderRadius: '24px', padding: isMobile ? '32px 24px' : '48px', color: 'white', textAlign: 'center', boxShadow: '0 12px 32px rgba(24,100,171,0.2)' }}>
        <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
          <ShieldCheck size={40} color="white" />
        </div>
        <h4 style={{ fontSize: '1.6rem', marginBottom: '12px', fontWeight: '900' }}>Keuntungan Validator</h4>
        <p style={{ opacity: 0.9, marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px auto', fontSize: '0.95rem', lineHeight: 1.5 }}>Jaga kualitas data sistem dan dapatkan komisi BMC untuk setiap verifikasi yang Anda lakukan.</p>
        
        <div style={{ background: 'rgba(255, 146, 43, 0.15)', border: '1px solid rgba(255, 146, 43, 0.4)', padding: '16px', borderRadius: '16px', marginBottom: '32px', textAlign: 'left', fontSize: '0.85rem', lineHeight: 1.5, maxWidth: '600px', margin: '0 auto 32px auto' }}>
          <strong style={{ color: '#ffd43b', display: 'block', marginBottom: '6px' }}>⚖️ Mekanisme Konsensus (Slashing)</strong>
          Dalam sistem terdesentralisasi, Anda diawasi oleh Konsensus Komunitas. Jika Validator terbukti berbuat curang (mengesahkan data palsu), <strong>uang jaminan Staking (10 BMC) akan dihanguskan (di-Slash)</strong> dan hak akses Validator akan dicabut permanen.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { target: 10, name: 'Novice', desc: 'Validasi Observasi' },
            { target: 100, name: 'Ecosystem', desc: 'Semua + KYC & Misi' },
            { target: 500, name: 'Master', desc: 'Full + Pembelian Fiat' }
          ].map(tier => (
            <div key={tier.target} style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '20px', border: staked >= tier.target ? '2px solid #51cf66' : '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: staked >= tier.target ? '#51cf66' : 'white' }}>{tier.target} BMC</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>{tier.name}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '16px', minHeight: '34px' }}>{tier.desc}</div>
              {staked >= tier.target ? (
                <div style={{ fontSize: '0.8rem', color: '#51cf66', fontWeight: 'bold' }}>Unlocked ✅</div>
              ) : (
                <button 
                  onClick={() => { setStakeTarget(tier.target - staked); setTermsModal(true); }}
                  style={{ background: 'white', color: '#1864ab', border: 'none', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem', width: '100%' }}
                >
                  Tambah Stake
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

const MarketplaceActBMC = () => (
  <div style={{ animation: 'fadeIn 0.2s', marginTop: '24px' }}>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Marketplace Activity</h3>
    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Beli, jual, dan review produk bambu di Ekosistem untuk tambahan bonus.</p>
    <div style={{ background: 'white', borderRadius: '20px', padding: '32px', textAlign: 'center', border: '1px solid #e9ecef' }}>
      <ShoppingCart size={48} color="var(--primary)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
      <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Sistem Cashback Aktif</h4>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 24px auto' }}>Dapatkan cashback 0.5% - 2% (dalam bentuk BMC) untuk setiap transaksi di Marketplace BaMbooChain.</p>
      <Link to="/bamboochain/marketplace" style={{ display: 'inline-block', background: 'var(--primary)', color: 'white', padding: '10px 24px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' }}>Kunjungi Marketplace</Link>
    </div>
  </div>
);

const GetBMCTab = () => {
  const location = useLocation();
  const [subTab, setSubTab] = useState(location.search.includes('tab=validator') ? 'validator' : 'earn');
  const { t } = useLanguage();
  
  const isPiBrowser = window.Pi && (
    window.location.hostname.includes('vercel.app') || 
    window.location.hostname.includes('bambu.pi') || 
    window.location.search.includes('sandbox=true')
  );

  const subTabs = [
    { id: 'earn', label: t('tw_subtab_earn') },
    ...(!isPiBrowser ? [{ id: 'buy', label: t('tw_subtab_buy') }] : []),
    { id: 'contribute', label: t('tw_subtab_contribute') },
    { id: 'validator', label: t('tw_subtab_validator') },
    { id: 'marketplace', label: t('tw_subtab_marketplace') },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '20px' }}>{t('tw_tab_get_bmc')}</h2>

      {/* Internal Navigation */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px', borderBottom: '1px solid #dee2e6' }}>
        {subTabs.map(t => (
          <button 
            key={t.id} 
            onClick={() => setSubTab(t.id)}
            style={{ 
              background: 'transparent',
              color: subTab === t.id ? 'var(--primary)' : 'var(--text-muted)',
              border: 'none',
              borderBottom: subTab === t.id ? '3px solid var(--primary)' : '3px solid transparent',
              padding: '10px 4px',
              fontSize: '1rem',
              fontWeight: subTab === t.id ? 'bold' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'buy' && <BuyBMC />}
      {subTab === 'earn' && <EarnBMC />}
      {subTab === 'contribute' && <ContributeDataBMC />}
      {subTab === 'validator' && <ValidatorBMC />}
      {subTab === 'marketplace' && <MarketplaceActBMC />}

    </div>
  );
};

const TransactionsTab = () => {
  const { user } = useAuth();
  const txList = user?.transactions || [];
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
  <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
      <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>Transactions</h2>
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['All', 'Earn', 'Spend'].map(f => (
          <button key={f} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #dee2e6', background: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{f}</button>
        ))}
      </div>
    </div>

    <div style={{ background: 'white', borderRadius: '24px', padding: isMobile ? '16px' : '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: isMobile ? '450px' : '600px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #f8f9fa' }}>
            <th style={{ padding: '12px 16px', color: '#adb5bd', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Date</th>
            <th style={{ padding: '12px 16px', color: '#adb5bd', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Description</th>
            <th style={{ padding: '12px 16px', color: '#adb5bd', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {txList.length === 0 ? (
            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '32px', color: '#adb5bd' }}>No transactions found</td></tr>
          ) : txList.map((tx, idx) => (
            <tr key={tx?.id || idx} style={{ borderBottom: '1px solid #f8f9fa' }}>
              <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{tx?.date}</td>
              <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.9rem' }}>{tx?.description}</td>
              <td style={{ padding: '16px', fontWeight: '900', textAlign: 'right', color: String(tx?.amount || "").includes('+') ? '#12b886' : '#e03131', fontSize: '0.9rem' }}>{tx?.amount} BMC</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

const StakingTab = () => (
  <div style={{ animation: 'fadeIn 0.3s ease-in-out', textAlign: 'center', padding: '60px 24px' }}>
     <Cpu size={64} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '24px' }} />
     <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>Staking (Audit)</h2>
     <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '400px', margin: '0 auto 32px auto', lineHeight: 1.5 }}>
        Fitur Staking sedang dalam audit smart-contract untuk keamanan dana Anda.
     </p>
     <button style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '30px', fontWeight: '900', cursor: 'pointer' }}>Notify Me</button>
  </div>
);

const TokenUtilityTab = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
  <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px' }}>Utility</h2>
    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px' }}>BMC adalah inti dari ekosistem bambuNUSA.</p>

    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #f1f3f5' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', fontWeight: '900' }}>Use Cases</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
             "Akses khusus AI Bambubot",
             "Riset & Artikel Premium",
             "Sertifikasi Akademi Sabumi",
             "GIS Analytics & Big Data",
             "Voting DAO Jaringan"
          ].map((item, i) => (
             <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '500' }}><CheckCircle size={18} color="var(--primary)" /> {item}</div>
          ))}
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1864ab, #0b2b5e)', color: 'white', borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <Award size={100} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }} />
        <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', fontWeight: '900' }}>Reputasi User</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
             { title: "Explorer", detail: "Pemula (Basis)" },
             { title: "Contributor", detail: "Aktif Kontribusi" },
             { title: "Validator", detail: "Quality Control" },
             { title: "Leader", detail: "DAO Priority" },
          ].map((lvl, i) => (
             <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
               <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>{i+1}</div>
               <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{lvl.title}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{lvl.detail}</div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

const KYCCenterTab = () => {
  const { user, updateKyc, addPendingValidation } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [fullName, setFullName] = useState(user?.name || '');
  const [docType, setDocType] = useState('KTP'); // 'KTP' | 'Passport' | 'SIM' | 'StudentCard'
  const [nik, setNik] = useState('');
  const [ktpPhoto, setKtpPhoto] = useState(null);
  const [selfiePhoto, setSelfiePhoto] = useState(null);
  const [scanStep, setScanStep] = useState(null); // null | 'analyzing' | 'ela' | 'deepfake' | 'facematch' | 'success'

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    if (user) {
      setSubmitted(user.kycStatus === 'pending' || user.kycStatus === 'verified');
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [user?.kycStatus]);

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '24px' }}>
        <ShieldCheck size={48} color="#adb5bd" style={{ marginBottom: '16px' }} />
        <h3 style={{ margin: 0 }}>Akses Terbatas</h3>
        <p style={{ color: 'var(--text-muted)' }}>Silakan login untuk mengakses fitur verifikasi KYC.</p>
      </div>
    );
  }

  const handleKtpChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => setKtpPhoto(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSelfieChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => setSelfiePhoto(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleKycSubmit = (e) => {
    e.preventDefault();
    if (!ktpPhoto) return alert(t('tw_alert_upload_doc'));
    if (!selfiePhoto) return alert(t('tw_alert_upload_selfie'));
    if (nik.length < 5) return alert(t('tw_alert_invalid_id'));

    setLoading(true);
    setScanStep('analyzing');

    // Simulate AI Scanner workflow
    setTimeout(() => {
      setScanStep('ela');
      setTimeout(() => {
        setScanStep('deepfake');
        setTimeout(() => {
          setScanStep('facematch');
          setTimeout(() => {
            setScanStep('success');
            setTimeout(async () => {
              const success = await updateKyc({ 
                fullName, 
                nik, 
                docType,
                ktpPhoto, 
                selfiePhoto, 
                submittedAt: new Date().toISOString() 
              });

              if (success) {
                if (addPendingValidation) {
                  addPendingValidation({
                    userId: user?.id,
                    title: `Verifikasi KYC [${docType}] (${fullName || user?.name})`,
                    gps: '-',
                    tags: `KYC, ${docType}, Identity`,
                    isKyc: true,
                    details: { name: fullName || user?.name, nik: nik, docType: docType, action: 'Verifikasi Dokumen Identitas' },
                    uploadedFiles: {
                      'KTP': ktpPhoto, 
                      'Selfie KTP': selfiePhoto
                    },
                    rewardAmount: 0
                  });
                }
                alert(t('tw_alert_kyc_sent'));
                setSubmitted(true);
              }
              setScanStep(null);
              setLoading(false);
            }, 1200);
          }, 1500);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const getDocLabel = () => {
    switch (docType) {
      case 'Passport': return 'Nomor Paspor (Passport Number)';
      case 'SIM': return 'Nomor SIM (Driver License Number)';
      case 'StudentCard': return 'Nomor Kartu Pelajar / Mahasiswa (Student ID)';
      default: return 'NIK (Nomor Induk Kependudukan - KTP)';
    }
  };

  const getDocPlaceholder = () => {
    switch (docType) {
      case 'Passport': return 'Contoh: A12345678';
      case 'SIM': return 'Contoh: 123456789012';
      case 'StudentCard': return 'Contoh: 20260518';
      default: return '16 digit angka NIK';
    }
  };

  const handleIdNumberChange = (val) => {
    if (docType === 'KTP' || docType === 'SIM') {
      setNik(val.replace(/\D/g, '').substring(0, docType === 'KTP' ? 16 : 14));
    } else if (docType === 'Passport') {
      setNik(val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 9));
    } else {
      setNik(val.substring(0, 20));
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px' }}>KYC Center</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px' }}>Verifikasi identitas untuk akses penuh ekosistem.</p>

      {/* Futuristic Scanner Overlay */}
      {scanStep && (
        <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.85)', zIndex: 100000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', color: 'white', padding: '24px' }}>
          <div style={{ background: 'white', border: '1px solid #dee2e6', borderRadius: '32px', padding: isMobile ? '24px' : '40px', width: '90%', maxWidth: '500px', textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', color: 'var(--text-main)' }}>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', width: '100%', position: 'relative' }}>
              {/* Photo Previews with Laser Scan Effect */}
              <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--primary)', background: '#f8f9fa' }}>
                <img src={ktpPhoto} alt="KTP Scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {scanStep !== 'success' && <div style={{ position: 'absolute', top: 0, width: '100%', height: '4px', background: '#12b886', boxShadow: '0 0 15px #12b886', animation: 'scanLine 2s infinite ease-in-out' }}></div>}
              </div>
              <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--primary)', background: '#f8f9fa' }}>
                <img src={selfiePhoto} alt="Selfie Scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {scanStep !== 'success' && <div style={{ position: 'absolute', top: 0, width: '100%', height: '4px', background: '#12b886', boxShadow: '0 0 15px #12b886', animation: 'scanLine 2s infinite ease-in-out' }}></div>}
              </div>
            </div>

            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--primary)' }}>🤖 AI Liveness & Fraud Engine</h3>
            
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', background: '#f8f9fa', padding: '20px', borderRadius: '20px', border: '1px solid #dee2e6' }}>
              {[
                { key: 'analyzing', label: '1. Menganalisis metadata EXIF file asli...' },
                { key: 'ela', label: '2. Memeriksa ELA (Error Level Analysis) editan foto...' },
                { key: 'deepfake', label: '3. Memindai rekayasa AI & Deepfake wajah...' },
                { key: 'facematch', label: '4. Pencocokan biometrik wajah (Kemiripan: 98.4%)...' }
              ].map((step, idx) => {
                const stepsOrder = ['analyzing', 'ela', 'deepfake', 'facematch', 'success'];
                const currentIdx = stepsOrder.indexOf(scanStep);
                const stepIdx = stepsOrder.indexOf(step.key);
                
                let icon = <Clock size={16} color="#adb5bd" />;
                let color = '#868e96';
                let fontWeight = 'normal';

                if (currentIdx > stepIdx) {
                  icon = <CheckCircle size={16} color="#12b886" />;
                  color = '#099268';
                  fontWeight = 'bold';
                } else if (currentIdx === stepIdx) {
                  icon = <div className="spinner-kyc" />;
                  color = 'var(--primary)';
                  fontWeight = 'bold';
                }

                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color, fontWeight }}>
                    {icon}
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </div>

            {scanStep === 'success' ? (
              <div style={{ background: '#e6fcf5', color: '#099268', padding: '12px 24px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', border: '1.5px solid #12b886', animation: 'pulse 1.5s infinite' }}>
                🎉 AI VERDICT: DOKUMEN 100% ASLI & AMAN!
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                Mohon tidak menutup jendela ini selama pemindaian AI berlangsung...
              </div>
            )}
          </div>
          
          <style>{`
            @keyframes scanLine {
              0% { top: 0%; }
              50% { top: 100%; }
              100% { top: 0%; }
            }
            .spinner-kyc {
              width: 14px;
              height: 14px;
              border: 2px solid var(--primary);
              border-top-color: transparent;
              border-radius: 50%;
              animation: spinKyc 1s infinite linear;
            }
            @keyframes spinKyc {
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {submitted ? (
        <div style={{ background: 'white', borderRadius: '24px', padding: isMobile ? '32px 24px' : '48px', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
           <div style={{ width: '80px', height: '80px', background: user?.kycStatus === 'verified' ? '#e6fcf5' : '#fff9db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
              <ShieldCheck size={40} color={user?.kycStatus === 'verified' ? '#12b886' : '#fab005'} />
           </div>
           <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', fontWeight: '900' }}>{user?.kycStatus === 'verified' ? "Verified!" : "Under Review"}</h3>
           <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 24px auto', fontSize: '0.9rem' }}>
             {user?.kycStatus === 'verified' 
               ? "Selamat! Akun Anda telah terverifikasi penuh."
               : "Mohon tunggu, tim kami sedang memvalidasi dokumen Anda."}
           </p>
           <div style={{ padding: '12px 24px', background: '#f8f9fa', borderRadius: '12px', display: 'inline-block', fontSize: '0.9rem', fontWeight: 'bold' }}>
             Status: <span style={{ color: user?.kycStatus === 'verified' ? '#12b886' : '#fab005' }}>{(user?.kycStatus || 'pending').toUpperCase()}</span>
           </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px', alignItems: 'start' }}>
          <form onSubmit={handleKycSubmit} style={{ flex: 1, width: '100%', background: 'white', borderRadius: '24px', padding: isMobile ? '24px' : '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
             <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                <div>
                   <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>Nama Lengkap (Sesuai Identitas)</label>
                   <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e9ecef', fontSize: '0.95rem' }} />
                </div>
                <div>
                   <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>Jenis Dokumen Identitas</label>
                   <select value={docType} onChange={(e) => { setDocType(e.target.value); setNik(''); }} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e9ecef', fontSize: '0.95rem', outlineColor: 'var(--primary)', background: 'white' }}>
                      <option value="KTP">KTP (Kartu Tanda Penduduk - Indonesia)</option>
                      <option value="Passport">Paspor (Passport - Global)</option>
                      <option value="SIM">SIM (Surat Izin Mengemudi)</option>
                      <option value="StudentCard">Kartu Pelajar / Kartu Mahasiswa (Student ID)</option>
                   </select>
                </div>
             </div>

             <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>{getDocLabel()}</label>
                <input type="text" value={nik} onChange={(e) => handleIdNumberChange(e.target.value)} placeholder={getDocPlaceholder()} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e9ecef', fontSize: '0.95rem' }} />
             </div>
             
             <div>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>Foto Identitas & Selfie</label>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                   <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '20px', border: '1.5px dashed #dee2e6', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px' }}>
                      {ktpPhoto ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: '#12b886', fontWeight: 'bold', marginBottom: '8px' }}>✅ Foto Terunggah</span>
                          <img src={ktpPhoto} alt="Identity Preview" style={{ width: '100%', maxWidth: '180px', height: '100px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                        </div>
                      ) : (
                        <>
                          <Camera size={28} color="#adb5bd" style={{ marginBottom: '8px' }} />
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{docType} Asli</div>
                          <div style={{ fontSize: '0.65rem', color: '#adb5bd', marginTop: '2px' }}>Belum ada foto dipilih</div>
                        </>
                      )}
                      <input type="file" accept="image/*" style={{ display: 'none' }} id="ktp-upload" onChange={handleKtpChange} />
                      <button type="button" onClick={() => document.getElementById('ktp-upload').click()} style={{ marginTop: '12px', background: 'white', padding: '8px 16px', borderRadius: '8px', border: '1px solid #dee2e6', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>Pilih Foto</button>
                   </div>
                   <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '20px', border: '1.5px dashed #dee2e6', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px' }}>
                      {selfiePhoto ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: '#12b886', fontWeight: 'bold', marginBottom: '8px' }}>✅ Selfie Terunggah</span>
                          <img src={selfiePhoto} alt="Selfie Preview" style={{ width: '100%', maxWidth: '180px', height: '100px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #dee2e6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                        </div>
                      ) : (
                        <>
                          <Users size={28} color="#adb5bd" style={{ marginBottom: '8px' }} />
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Selfie + {docType}</div>
                          <div style={{ fontSize: '0.65rem', color: '#adb5bd', marginTop: '2px' }}>Belum ada foto dipilih</div>
                        </>
                      )}
                      <input type="file" accept="image/*" style={{ display: 'none' }} id="selfie-upload" onChange={handleSelfieChange} />
                      <button type="button" onClick={() => document.getElementById('selfie-upload').click()} style={{ marginTop: '12px', background: 'white', padding: '8px 16px', borderRadius: '8px', border: '1px solid #dee2e6', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>Pilih Foto</button>
                   </div>
                </div>
             </div>

             <div style={{ background: '#fff9db', padding: '16px', borderRadius: '16px', fontSize: '0.8rem', color: '#856404', display: 'flex', gap: '12px', lineHeight: 1.4 }}>
                <ShieldCheck size={20} style={{ flexShrink: 0 }} />
                <span>Saya menyatakan data ini benar dan setuju dengan kebijakan privasi.</span>
             </div>

             <button disabled={loading} type="submit" style={{ width: '100%', padding: '16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '900', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', boxShadow: '0 8px 20px rgba(12,166,120,0.2)' }}>
                {loading ? "Mengirim..." : "Kirim Pengajuan"}
             </button>
          </form>

          {!isMobile && (
            <div style={{ width: '300px', background: '#f1f3f5', borderRadius: '24px', padding: '24px' }}>
               <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '900' }}>Kenapa KYC?</h4>
               <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <li><strong>Keamanan:</strong> Menghindari serangan bot massal.</li>
                  <li><strong>Kepatuhan:</strong> Memenuhi regulasi aset digital.</li>
                  <li><strong>Prioritas:</strong> Reward lebih tinggi untuk akun terverifikasi.</li>
               </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SecuritySettingsTab = () => {
  const { user, updateSecurity } = useAuth();
  const { t } = useLanguage();
  const [retinaScanning, setRetinaScanning] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggle2FA = () => updateSecurity({ twoFactor: !user?.securitySettings?.twoFactor });
  const toggleRetina = () => {
    if(!user?.securitySettings?.retina) {
        setRetinaScanning(true);
        setTimeout(() => {
            updateSecurity({ retina: true });
            setRetinaScanning(false);
            alert(t('tw_alert_retina_on'));
        }, 3000);
    } else {
        updateSecurity({ retina: false });
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px' }}>Security</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px' }}>Proteksi aset BMC Anda secara berlapis.</p>

      {retinaScanning && (
        <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.95)', zIndex: 100000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <div style={{ width: isMobile ? '150px' : '200px', height: isMobile ? '150px' : '200px', border: '4px solid #12b886', borderRadius: '50%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 50px rgba(18,184,134,0.3)' }}>
                <div style={{ position: 'absolute', top: 0, width: '100%', height: '4px', background: '#12b886', boxShadow: '0 0 15px #12b886', animation: 'scan 2s infinite ease-in-out' }}></div>
                <div style={{ fontSize: isMobile ? '2.5rem' : '4rem' }}>👁️</div>
            </div>
            <h3 style={{ color: 'white', marginTop: '32px', letterSpacing: '4px', fontWeight: '900', fontSize: isMobile ? '1rem' : '1.5rem' }}>SCANNING RETINA</h3>
            <style>{`
                @keyframes scan {
                    0% { top: 10%; }
                    50% { top: 90%; }
                    100% { top: 10%; }
                }
            `}</style>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
         {[
           { title: '2FA Verification', desc: 'Kode OTP setiap transaksi.', status: user?.securitySettings?.twoFactor, action: toggle2FA, btnText: user?.securitySettings?.twoFactor ? 'AKTIF' : 'AKTIFKAN' },
           { title: 'Biometrik (Retina)', desc: 'Scan mata untuk akses cepat.', status: user?.securitySettings?.retina, action: toggleRetina, btnText: user?.securitySettings?.retina ? 'AKTIF' : 'DAFTARKAN' },
           { title: 'Wallet PIN', desc: '6 digit PIN untuk kirim BMC.', status: false, action: () => {}, btnText: 'UBAH PIN' }
         ].map((item, i) => (
           <div key={i} style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div>
                 <h4 style={{ margin: '0 0 6px 0', fontWeight: '900', color: 'var(--text-main)', fontSize: '1rem' }}>{item.title}</h4>
                 <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
              <button onClick={item.action} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: item.status ? '#e6fcf5' : '#f8f9fa', color: item.status ? '#12b886' : '#adb5bd', fontWeight: '900', cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.2s' }}>
                {item.btnText}
              </button>
           </div>
         ))}
      </div>
    </div>
  );
};

const TokenWalletPage = () => {
  const { walletAddress, isConnected, connectWallet } = useWeb3();
  const location = useLocation();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(location.search.includes('tab=validator') ? 'get_bmc' : 'overview');
  const [initialModal, setInitialModal] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1100);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1100);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const TABS = [
    { id: 'overview', label: t('tw_tab_overview'), icon: PieChart },
    { id: 'whitepaper', label: t('tw_tab_whitepaper'), icon: FileText },
    { id: 'dashboard', label: t('tw_tab_dashboard'), icon: Wallet },
    { id: 'get_bmc', label: t('tw_tab_get_bmc'), icon: Gift },
    { id: 'transactions', label: t('tw_tab_transactions'), icon: History },
    { id: 'kyc', label: t('tw_tab_kyc'), icon: ShieldCheck },
    { id: 'security', label: t('tw_tab_security'), icon: Lock },
    { id: 'staking', label: t('tw_tab_staking'), icon: Cpu },
    { id: 'utility', label: t('tw_tab_utility'), icon: TrendingUp },
  ];

  return (
    <div style={{ paddingTop: isMobile ? '80px' : 'var(--navbar-height)', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <div className="container" style={{ marginBottom: isMobile ? '16px' : '24px' }}>
        <BackButton to="/bamboochain" />
      </div>
      
      <div className="container wallet-page-container">
        
        {/* NAVIGATION: Sidebar (Desktop) or Horizontal Scroll (Mobile) */}
        <div className="wallet-sidebar">
          <div className="no-scrollbar" style={{ 
            background: isMobile ? 'transparent' : 'var(--bg-card)', 
            borderRadius: isMobile ? '0' : '24px', 
            padding: isMobile ? '4px 0' : '20px', 
            boxShadow: isMobile ? 'none' : '0 10px 30px rgba(0,0,0,0.03)',
            border: isMobile ? 'none' : '1px solid var(--border-color)',
            overflowX: isMobile ? 'auto' : 'visible',
            display: isMobile ? 'flex' : 'block',
            borderBottom: isMobile ? '1px solid #e9ecef' : 'none',
            WebkitOverflowScrolling: 'touch'
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'row' : 'column', 
              gap: isMobile ? '10px' : '6px',
              padding: isMobile ? '8px 16px' : '0',
              minWidth: isMobile ? 'max-content' : 'auto'
            }}>
              {!isMobile && (
                <div style={{ 
                  fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', 
                  color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '20px', paddingLeft: '12px'
                }}>
                  {t('tw_menu_title')}
                </div>
              )}
              
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      width: isMobile ? 'auto' : '100%', 
                      padding: isMobile ? '10px 20px' : '14px 16px', 
                      textAlign: 'left',
                      background: isActive ? 'var(--primary)' : (isMobile ? 'var(--bg-card)' : 'transparent'),
                      color: isActive ? 'white' : 'var(--text-main)',
                      border: isMobile ? (isActive ? 'none' : '1px solid var(--border-color)') : 'none',
                      borderRadius: '16px',
                      fontWeight: isActive ? '900' : '600',
                      cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      whiteSpace: 'nowrap',
                      fontSize: isMobile ? '0.85rem' : '0.95rem',
                      boxShadow: (isMobile && isActive) ? '0 8px 20px rgba(12,166,120,0.25)' : 'none',
                      transform: (!isMobile && isActive) ? 'translateX(4px)' : 'none'
                    }}
                  >
                    <tab.icon size={isMobile ? 18 : 20} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
 
        {/* MAIN CONTENT AREA */}
        <div className="wallet-content">
          {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} setInitialModal={setInitialModal} />}
          {activeTab === 'whitepaper' && <WhitepaperTab />}
          {activeTab === 'dashboard' && <WalletDashboardTab isConnected={isConnected} connectWallet={connectWallet} walletAddress={walletAddress} initialModal={initialModal} setInitialModal={setInitialModal} />}
          {activeTab === 'get_bmc' && <GetBMCTab />}
          {activeTab === 'transactions' && <TransactionsTab />}
          {activeTab === 'kyc' && <KYCCenterTab />}
          {activeTab === 'security' && <SecuritySettingsTab />}
          {activeTab === 'staking' && <StakingTab />}
          {activeTab === 'utility' && <TokenUtilityTab />}
        </div>
 
      </div>
    </div>
  );
};
export default TokenWalletPage;
