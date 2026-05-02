import React, { useState, useEffect } from 'react';
import { 
  Wallet, PieChart, FileText, Gift, History, Cpu, TrendingUp, 
  ArrowDownToLine, ArrowUpFromLine, Send, CheckCircle, Clock, ExternalLink,
  ChevronRight, Play, Camera, MapPin, Upload, ShieldCheck, Users, ShoppingCart, Award, CalendarDays, Lock
} from 'lucide-react';
import { useWeb3 } from '../../context/Web3Context';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import BackButton from '../../components/BackButton';

// ======================================
// TAB COMPONENTS
// ======================================

const OverviewTab = () => {
  const { user } = useAuth();

  const handleCopyWallet = () => {
    if(user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      alert('Alamat Dompet Pintar (Smart Wallet) berhasil disalin!');
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out', paddingTop: '16px' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginTop: '0', marginBottom: '8px' }}>bambuNUSA (BMC)</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '24px', maxWidth: '800px' }}>
        BMC adalah token utilitas untuk mengakses layanan, mendapatkan reward, dan berpartisipasi dalam ekosistem bambu digital yang transparan dan berkelanjutan.
      </p>

      {user?.walletAddress && (
        <div style={{ background: 'linear-gradient(to right, #1864ab, #3b5bdb)', borderRadius: '16px', padding: '16px 24px', color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', boxShadow: '0 8px 24px rgba(24, 100, 171, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Wallet size={32} style={{ opacity: 0.9 }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px', opacity: 0.8, marginBottom: '4px' }}>ALAMAT WEB3 ANDA (CUSTODIAL)</div>
              <div style={{ fontSize: '1.2rem', fontFamily: 'monospace', letterSpacing: '1px' }}>
                {user.walletAddress.substring(0,6)}...{user.walletAddress.substring(user.walletAddress.length - 4)}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleCopyWallet} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px 16px', borderRadius: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'} onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}>
               Salin Alamat
            </button>
          </div>
          <div style={{ width: '100%', fontSize: '0.8rem', opacity: 0.8, marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '12px' }}>
            💡 <strong>Info Petani:</strong> Transaksi Anda diamankan di Database Yayasan Sabumi. Semua transfer dan penggunaan token di platform ini <strong>Bebas Biaya Gas (Gasless)</strong> tanpa ribet!
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {[
          { label: 'TOTAL SUPPLY', value: '1,000,000,000 BMC' },
          { label: 'CIRCULATING SUPPLY', value: '150,540,200 BMC' },
          { label: 'YOUR BALANCE', value: `${Number(user?.bmcBalance || 0).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 3})} BMC`, highlight: true },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', border: '1px solid #f1f3f5' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: stat?.highlight ? 'var(--primary)' : 'var(--text-main)', wordBreak: 'break-word' }}>{stat?.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WhitepaperTab = () => (
  <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
    <div style={{ background: 'linear-gradient(135deg, #2b8a3e, #0c8599)', borderRadius: '24px', padding: '40px', color: 'white', marginBottom: '32px', boxShadow: '0 10px 30px rgba(12, 166, 120, 0.2)' }}>
      <FileText size={48} style={{ opacity: 0.8, marginBottom: '20px' }} />
      <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '16px' }}>Whitepaper BMC</h2>
      <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', marginBottom: '24px' }}>
        Pelajari konsep mendalam, perombakan industri bambu, hingga detail tokenomics DAO dalam dokumen resmi kami.
      </p>
      <a href="/whitepaper-bmc.pdf" target="_blank" rel="noopener noreferrer" style={{ background: 'white', color: 'var(--primary)', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        Buka / Unduh PDF <ExternalLink size={18} />
      </a>
    </div>

    <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
      <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '20px' }}>Struktur Dokumen:</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {[
          {
            title: "🌿 1. VISION & MISSION",
            content: (
              <>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>🎯 Vision</div>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Membangun Global Bamboo Ecosystem Platform yang mengintegrasikan teknologi, industri, dan komunitas untuk mendorong green economy dan circular economy.</p>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '16px' }}>👉 Tujuan: Material masa depan & ketahanan sandang, pangan, papan, energi.</div>
                
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
                  <li style={{ marginBottom: '6px' }}><strong>Tidak ada database terpusat</strong> (data tak terstandarisasi, sulit riset)</li>
                  <li style={{ marginBottom: '6px' }}><strong>Supply chain terputus</strong> (petani dan industri sulit terhubung)</li>
                  <li style={{ marginBottom: '6px' }}><strong>Minim teknologi</strong> (minim digitalisasi dan tracking IoT/GIS)</li>
                  <li style={{ marginBottom: '6px' }}><strong>Akses pasar terbatas</strong> (kurang marketplace khusus bambu)</li>
                  <li style={{ marginBottom: '6px' }}><strong>Kurang insentif</strong> (petani tak dapat sistem ekonomi yang pas)</li>
                </ol>
              </>
            )
          },
          {
            title: "💡 3. SOLUTION (BAMBOOCHAIN)",
            content: (
              <>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>🌐 Super Ecosystem Platform</div>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Mengintegrasikan kombinasi mutakhir AI + Blockchain + Marketplace + Data + Community.</p>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <li style={{ marginBottom: '6px' }}><strong>🤖 Bambupedia:</strong> Edukasi AI (BambuBot)</li>
                  <li style={{ marginBottom: '6px' }}><strong>🌱 Plantation:</strong> Tracking spesifik (GIS & IoT)</li>
                  <li style={{ marginBottom: '6px' }}><strong>🏭 Supply Chain:</strong> Jaminan asal-usul dari kebun ke barang</li>
                  <li style={{ marginBottom: '6px' }}><strong>🧱 Bamboo Build:</strong> Konstruksi bambu ala modular</li>
                  <li style={{ marginBottom: '6px' }}><strong>🛒 Marketplace:</strong> Perdagangan produk global</li>
                  <li style={{ marginBottom: '6px' }}><strong>🪙 BMC Token & DAO:</strong> Sistem ekonomi & reward</li>
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
                  <li style={{ marginBottom: '6px' }}>Akses API Bambubot & Unlock Artikel Edukasi</li>
                  <li style={{ marginBottom: '6px' }}>Akses terhadap big data & tools analitik</li>
                  <li style={{ marginBottom: '6px' }}>Transaksi e-commerce Marketplace</li>
                  <li style={{ marginBottom: '6px' }}>Reward aktivitas kontribusi & Hak Voting DAO</li>
                </ul>
                <div style={{ padding: '8px 12px', background: '#e6fcf5', color: 'var(--primary)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center' }}>
                  🧠 Prinsip: Use → Spend → Burn → Reduce Supply
                </div>
              </>
            )
          },
          {
            title: "📊 5. TOKENOMICS",
            content: (
              <>
                <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <li style={{ marginBottom: '6px' }}><strong>🔢 Supply:</strong> 1,000,000,000 token on-chain (Dilabeli 1 Juta BMC untuk kepraktisan, 1 BMC = Rp10.000)</li>
                  <li style={{ marginBottom: '6px' }}><strong>📉 Emission:</strong> Menggunakan reward menurun (halving system)</li>
                  <li style={{ marginBottom: '6px' }}><strong>🔥 Burn Mechanism:</strong> Pembakaran fee (AI usage, fee artikel, transaksi konstruksi)</li>
                  <li style={{ marginBottom: '6px' }}><strong>🔐 Staking:</strong> Lock supply agar reward loyal maksimal</li>
                </ul>
                <div style={{ padding: '8px 12px', background: '#fff5f5', color: '#e03131', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center' }}>
                  🎯 Goal: Tidak Inflasi, Langka, Value Konsisten Naik
                </div>
              </>
            )
          },
          {
            title: "🧠 6. USE CASES",
            content: (
              <>
                <div style={{ fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-main)' }}>🌱 Ekosistem Nyata</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(120px, 1fr)', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div style={{ background: 'white', border: '1px solid #ced4da', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1rem', marginBottom: '4px' }}>📚 <strong>Edukasi</strong></div>Bambupedia & Akademi Keahlian
                  </div>
                  <div style={{ background: 'white', border: '1px solid #ced4da', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1rem', marginBottom: '4px' }}>🏗 <strong>Industri</strong></div>Produksi bambu panel & konstruksi modular
                  </div>
                  <div style={{ background: 'white', border: '1px solid #ced4da', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1rem', marginBottom: '4px' }}>🛒 <strong>Marketplace</strong></div>Jual beli produk komoditas bambu
                  </div>
                  <div style={{ background: 'white', border: '1px solid #ced4da', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1rem', marginBottom: '4px' }}>📡 <strong>Data</strong></div>Database penanaman & Analisis pasar
                  </div>
                  <div style={{ background: 'white', border: '1px solid #ced4da', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1rem', marginBottom: '4px' }}>🍃 <strong>Ekologi</strong></div>Akses carbon credit & ESG impact metrics
                  </div>
                  <div style={{ background: 'white', border: '1px solid #ced4da', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1rem', marginBottom: '4px' }}>🤝 <strong>Sosial</strong></div>Sistem partisipasi gamifikasi & voting
                  </div>
                </div>
              </>
            )
          },
          {
            title: "🛣️ 7. ROADMAP",
            content: (
              <>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <li style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f3f5', marginBottom: '12px' }}>
                    <div style={{ minWidth: '45px', fontWeight: '900', color: 'var(--primary)' }}>Ph 1</div>
                    <div><strong>Tahun 0 - 1</strong> <br/>Website fundamental dasar, interaksi Bambupedia, dan Wallet integration awal.</div>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f3f5', marginBottom: '12px' }}>
                    <div style={{ minWidth: '45px', fontWeight: '900', color: 'var(--primary)' }}>Ph 2</div>
                    <div><strong>Tahun 1 - 2</strong> <br/>Ekspansi Marketplace, Data platform analitik, dan implementasi Reward system.</div>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f3f5', marginBottom: '12px' }}>
                    <div style={{ minWidth: '45px', fontWeight: '900', color: 'var(--primary)' }}>Ph 3</div>
                    <div><strong>Tahun 2 - 3</strong> <br/>BambooChain beroperasi utuh penuh, Sistem desentralisasi DAO, siklus Carbon ecosystem.</div>
                  </li>
                  <li style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ minWidth: '45px', fontWeight: '900', color: 'var(--primary)' }}>Ph 4</div>
                    <div><strong>Tahun 3+</strong> <br/>Ekspansi global berkelanjutan, Integrasi industri masif & infrastruktur Bamboo City.</div>
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
                <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pengelolaan desentralisasi. Pengguna harus men- stake BMC guna mendapat Hak Voting Power.</p>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>📊 Fungsi Voting Digunakan Untuk:</div>
                <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <li style={{ marginBottom: '6px' }}>Memilih proyek penanaman bambu strategis</li>
                  <li style={{ marginBottom: '6px' }}>Distribusi & Alokasi Dana ekosistem platform</li>
                  <li style={{ marginBottom: '6px' }}>Penentuan kebijakan krusial & pengembangan fitur anyar</li>
                </ul>
                <div style={{ padding: '8px 12px', background: '#fff9db', color: '#e67700', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center' }}>
                  🔐 Prinsip: Transparan, Demokratis, & Berbasis Kontribusi Loyal.
                </div>
              </>
            )
          }
        ].map((sec, idx) => (
          <div key={idx} style={{ padding: '28px', background: '#f8f9fa', borderRadius: '20px', display: 'flex', flexDirection: 'column', border: '1px solid #e9ecef', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '20px', borderBottom: '2px solid #e9ecef', paddingBottom: '12px' }}>
              {sec.title}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {sec.content}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', background: 'linear-gradient(135deg, #1864ab, #0b2b8e)', color: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 12px 30px rgba(24, 100, 171, 0.3)' }}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0 0 12px 0', letterSpacing: '1px' }}>🏆 KESIMPULAN BESAR</h3>
        <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6 }}>BambooChain bukan sekadar platform, tetapi:<br/><strong style={{ fontSize: '1.6rem', color: '#fcc419', marginTop: '12px', display: 'inline-block', padding: '4px 16px', border: '2px dashed #fcc419', borderRadius: '12px' }}>Digital Infrastructure for Global Bamboo Economy</strong></p>
      </div>
    </div>
  </div>
);

const WalletDashboardTab = () => {
  const { user, transferBmc, getMockDB } = useAuth();
  const [modalType, setModalType] = useState(null); // 'send', 'receive'
  const [sendAddr, setSendAddr] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Real-time search simulation
  useEffect(() => {
    if (searchQuery.length > 1 && user) {
      const db = getMockDB();
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

  const handleSend = () => {
    if(!sendAddr || !sendAmount) return alert("Harap isi alamat dompet dan nominal BMC!");
    if(!user || user.kycStatus !== 'verified') return alert("⚠️ Akun Anda belum terverifikasi KYC. Silakan selesaikan KYC di menu KYC Center untuk melakukan transfer.");
    
    const amt = parseFloat(sendAmount);
    if(isNaN(amt) || amt <= 0) return alert("Nominal tidak valid!");
    
    if(transferBmc(amt, sendAddr)) {
      alert(`✅ Berhasil mentransfer ${amt} BMC tanpa potong Gas Fee ke ${sendAddr}!`);
      setModalType(null);
      setSendAddr('');
      setSendAmount('');
      setSearchQuery('');
    } else {
      alert('❌ Saldo BMC Anda tidak mencukupi untuk transfer ini.');
    }
  };

  const balanceBMC = (user?.bmcBalance || 0).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 3});
  const myWallet = user?.walletAddress || '0x...';
  
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {/* MODALS */}
      {modalType && (
        <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '32px', width: '90%', maxWidth: '440px', boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}>
            {modalType === 'receive' && (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ marginTop: 0, fontSize: '1.5rem', fontWeight: '900' }}>📍 Terima BMC</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Berikan dompet Anda ini ke petani/pengguna lain untuk menerima kiriman token BMC (Gasless).</p>
                <div style={{ margin: '20px auto', width: '220px', height: '220px', background: 'white', padding: '16px', borderRadius: '24px', border: '2px solid #f1f3f5', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${myWallet}`} alt="QR Code" style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
                </div>
                <div style={{ background: '#f8f9fa', padding: '14px', borderRadius: '16px', fontSize: '0.9rem', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: '24px', border: '1px solid #dee2e6', color: 'var(--primary)', fontWeight: 'bold' }}>{myWallet}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button onClick={() => setModalType(null)} style={{ padding: '14px', background: 'transparent', border: '1px solid #ced4da', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Tutup</button>
                  <button onClick={() => { navigator.clipboard.writeText(myWallet); alert('Berhasil menyalin dompet!'); }} style={{ padding: '14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(12, 166, 120, 0.2)' }}>Salin Alamat</button>
                </div>
              </div>
            )}
            {modalType === 'send' && (
              <div>
                <h3 style={{ marginTop: 0, fontSize: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px' }}>📤 Kirim / Transfer BMC</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Cari nama anggota atau tempel alamat dompet.<br/><strong>TANPA BIAYA GAS!</strong></p>
                
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Cari Nama Penerima / Alamat:</label>
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                   <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setSendAddr(e.target.value); }} placeholder="Cari nama atau paste 0x..." style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1.5px solid #e9ecef', fontSize: '1rem', boxSizing: 'border-box', outlineColor: 'var(--primary)' }} />
                   
                   {searchResults.length > 0 && (
                     <div style={{ position: 'absolute', top: '100%', left:0, right:0, background: 'white', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.1)', border: '1px solid #f1f3f5', marginTop: '8px', zIndex: 10, overflow: 'hidden' }}>
                        {searchResults.map(res => (
                          <div key={res.id} onClick={() => { setSendAddr(res.walletAddress || ""); setSearchQuery(res.name || ""); setSearchResults([]); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f3f5', display: 'flex', alignItems: 'center', gap: '12px' }}>
                             <div style={{ width: '36px', height: '36px', background: 'var(--primary)', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{(res.name || "U").charAt(0)}</div>
                             <div>
                               <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{res.name || "Unknown User"} {res.isValidator && <span style={{ fontSize: '0.7rem', color: 'var(--primary)', background: '#e6fcf5', padding: '2px 6px', borderRadius: '8px' }}>(Validator)</span>}</div>
                               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(res.walletAddress || "0x00...").substring(0,10)}...</div>
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
                
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>Nominal (BMC):</label>
                <input type="number" value={sendAmount} onChange={e => setSendAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1.5px solid #e9ecef', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px', boxSizing: 'border-box' }} />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px', textAlign: 'right' }}>Saldo Tersedia: <strong>{balanceBMC} BMC</strong></div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button onClick={() => setModalType(null)} style={{ padding: '14px', background: 'transparent', border: '1px solid #ced4da', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Batal</button>
                  <button onClick={handleSend} style={{ padding: '14px', background: '#12b886', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(18, 184, 134, 0.2)' }}>Kirim BMC</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '24px' }}>Wallet Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '24px' }}>
        {/* Card Kiri */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary), #1b5e20)', borderRadius: '24px', padding: '32px', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>Off-Chain Balance BMC</div>
            <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '8px' }}>{balanceBMC}</div>
            
            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '12px', marginBottom: '24px', backdropFilter: 'blur(5px)', fontSize: '0.85rem' }}>
              Address: {myWallet.length > 20 ? `${myWallet.substring(0, 8)}...${myWallet.substring(36)}` : myWallet}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setModalType('receive')} style={{ flex: 1, padding: '10px', background: 'white', color: 'var(--primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <ArrowDownToLine size={16} /> Receive
              </button>
              <button onClick={() => setModalType('send')} style={{ flex: 1, padding: '10px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <Send size={16} /> Send
              </button>
            </div>
            
            {!user && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(12,166,120,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '24px' }}>
                <Wallet size={48} style={{ marginBottom: '16px' }} />
                <div style={{ fontSize: '0.9rem', marginBottom: '16px', fontWeight: 'bold' }}>Sesi Tertutup. Silakan Login.</div>
              </div>
            )}
          </div>
        </div>

        {/* Card Kanan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '24px', flex: 1, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Total Earned (All Time)</div>
             <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59f00' }}>
                +{(user?.transactions || []).filter(t => t && t.type === 'Earn').reduce((acc, curr) => acc + parseFloat((curr?.amount || "0").replace('+','')), 0).toLocaleString('en-US', {maximumFractionDigits: 3})} BMC
             </div>
          </div>
          <div style={{ background: 'white', borderRadius: '24px', padding: '24px', flex: 1, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Locked / Staked BMC</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{(user?.stakedBalance || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} BMC</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-komponen Get BMC ---
const BuyBMC = () => {
  const { user, addReward } = useAuth();
  const [activePkg, setActivePkg] = useState(null);
  const [bankName, setBankName] = useState('');
  
  const handlePaymentProofSubmit = () => {
    if(!bankName) return alert("Harap masukkan Nama di Rekening Bank Anda!");
    
    // Safety check: Nama rekening harus sama dengan nama user (kyc simulated)
    if(user.kycStatus === 'verified' && bankName.toLowerCase() !== user.name.toLowerCase()) {
        alert(`❌ Nama di Rekening (${bankName}) tidak cocok dengan Nama KYC Anda (${user.name}). Pembelian ditolak demi keamanan.`);
        return;
    }

    addReward(activePkg.bmc, `Pembelian ${activePkg.bmc} BMC - Proses Validasi`, 'Earn');
    alert(`✅ Bukti terkirim! Sistem sedang memvalidasi pembayaran Anda. Saldo ${activePkg.bmc} BMC telah di-kreditkan sementara.`);
    const waText = encodeURIComponent(`Halo Admin, saya (${bankName}) sudah mentransfer sejumlah Rp ${activePkg.idr} untuk pembelian ${activePkg.bmc} BMC. Berikut adalah bukti transfer saya.`);
    window.open(`https://wa.me/628174139994?text=${waText}`, '_blank');
    setActivePkg(null);
  };

  return (
    <div style={{ animation: 'fadeIn 0.2s', marginTop: '24px' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: '900' }}>Buy BMC (Fiat)</h3>

      {activePkg && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'white', borderRadius: '32px', padding: '32px', width: '90%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, marginBottom: '8px', fontWeight: '900' }}>Konfirmasi: {activePkg.bmc} BMC</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Transfer <strong>Rp {activePkg.idr}</strong> ke rekening resmi yayasan:</p>
            
            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '16px', marginBottom: '12px', fontSize: '0.85rem', border: '1px solid #e9ecef' }}>
              <strong>Bank BRI</strong><br/>
              An. Yayasan Sabumi Nusantara Jaya<br/>
              NO REK: 141101000456562
            </div>

            <div style={{ padding: '20px', background: '#e6fcf5', borderRadius: '16px', marginBottom: '20px', border: '1px solid #12b886' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>Nama Lengkap di Rekening Bank Anda:</label>
                <input type="text" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="Wajib sama dengan Nama KYC" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ced4da', marginBottom: '8px' }} />
                <p style={{ margin:0, fontSize: '0.75rem', color: '#099268' }}>Demi keamanan, dana hanya akan diproses jika nama pengirim sama dengan nama profil Anda.</p>
            </div>

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Upload Bukti Transfer</label>
            <input type="file" style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ced4da', marginBottom: '24px', fontSize: '0.8rem' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={() => setActivePkg(null)} style={{ padding: '14px', borderRadius: '16px', border: '1px solid #ced4da', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Batal</button>
              <button 
                onClick={handlePaymentProofSubmit}
                style={{ padding: '14px', borderRadius: '16px', border: 'none', background: '#25D366', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)' }}>
                Konfirmasi WA
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { bmc: 1, idr: "10.000" },
          { bmc: 5, idr: "45.000", badge: "Hemat Rp5.000" },
          { bmc: 10, idr: "80.000", badge: "Best Value" },
        ].map((pkg, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '2px solid #e9ecef', position: 'relative', textAlign: 'center' }}>
            {pkg.badge && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#f59f00', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{pkg.badge}</div>}
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px' }}>{pkg.bmc} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>BMC</span></div>
            <div style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '20px' }}>Rp {pkg.idr}</div>
            <button onClick={() => setActivePkg(pkg)} style={{ width: '100%', background: 'var(--primary)', color: 'white', border: 'none', padding: '10px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Buy Now</button>
          </div>
        ))}
      </div>
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <strong>Metode Pembayaran:</strong> Transfer Bank (BCA, Mandiri, BNI, BRI), E-Wallet (OVO, GoPay, Dana), Crypto (USDT, USDC).
      </div>
    </div>
  );
};

const EarnBMC = () => {
  const { user, addReward, processCheckin } = useAuth();
  const [tasks, setTasks] = useState({ social: false, crypto: false, pi: false, watch: false });
  const [activeTask, setActiveTask] = useState(null);

  const currentUTC = new Date().toISOString().split('T')[0];
  const lastCheckin = user?.lastCheckinDate || null;
  const streak = user?.checkinStreak || 0;
  const canCheckinToday = lastCheckin !== currentUTC;

  const handleDaily = () => {
    if (!canCheckinToday) return;
    const result = processCheckin();
    if (result) {
      alert(`✅ Daily Check-in Day ${result.nextStreak} berhasil! +${result.amount} BMC ditambahkan ke saldo Anda.`);
    }
  };

  const handleTaskSubmit = (taskKey, taskName, amount) => {
    if (!tasks[taskKey]) {
      addReward(amount, taskName + " (Validating)", "Earn");
      setTasks(prev => ({ ...prev, [taskKey]: true }));
      alert(`🕒 Bukti terkirim! Sistem/Validator sedang memeriksa kecocokan data Anda. Anda memperoleh kredit +${amount} BMC di advance.`);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.2s', marginTop: '24px' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Earn BMC (Gamification)</h3>
      
      {/* Proof Modal */}
      {activeTask && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '8px' }}>Validasi Tugas: {activeTask.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Sistem memerlukan bukti nyata (Proof of Work) bahwa Anda telah menyelesaikan tindakan ini. Mohon lengkapi form berikut untuk mengklaim {activeTask.reward} BMC Anda.<br/><br/><strong style={{ color: 'var(--primary)' }}>Tips: Jika Anda kebingungan mencari link, silakan scroll ke bagian paling bawah (Footer), tautannya ada di sana!</strong></p>
            
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>{activeTask.inputType === 'uid' ? 'Masukkan Akun ID / Referral yang terdaftar' : 'Masukkan Username Akun Anda'}</label>
            <input type="text" placeholder={activeTask.inputType === 'uid' ? 'Contoh: 129301923' : 'Contoh: @usernameanda'} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ced4da', marginBottom: '16px' }} />

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Upload Bukti Screenshot</label>
            <input type="file" style={{ width: '100%', padding: '8px', borderRadius: '12px', border: '1px solid #ced4da', marginBottom: '24px', fontSize: '0.8rem' }} />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setActiveTask(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ced4da', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Batal</button>
              <button onClick={() => { handleTaskSubmit(activeTask.key, activeTask.title, activeTask.reward); setActiveTask(null); }} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Kirim Bukti</button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Check-in */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #e9ecef', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <CalendarDays size={24} color="var(--primary)" />
          <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Daily Check-in</h4>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Login setiap hari (Reset 07:00 WIB) untuk mendapatkan BMC. Streak: <strong>{streak} Hari</strong> 🔥</p>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
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
            <div key={d.day} style={{ minWidth: '70px', background: status === 'claimed' ? '#e6fcf5' : status === 'today' ? 'var(--primary)' : '#f8f9fa', color: status === 'today' ? 'white' : 'var(--text-main)', border: d.special ? '2px solid #fcc419' : 'none', borderRadius: '12px', padding: '12px', textAlign: 'center', opacity: status === 'locked' ? 0.6 : 1, transition: 'all 0.2s' }}>
              <div style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Day {d.day}</div>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{d.rwd}</div>
              {status === 'today' && <button onClick={handleDaily} style={{ marginTop: '8px', background: 'white', color: 'var(--primary)', border: 'none', padding: '4px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}>Claim</button>}
              {status === 'claimed' && <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#12b886', fontWeight: 'bold' }}>✅</div>}
            </div>
            );
          })}
        </div>
      </div>

      {/* Social Tasks & Referral Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Social Media */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #e9ecef' }}>
          <h4 style={{ margin: '0 0 16px 0' }}>Social & Ecosystem Tasks</h4>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Follow founder, yayasan, & BMC official (Instagram, YouTube, TikTok, LinkedIn, X, Fanpage).</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+0.005 BMC</span>
            <button onClick={() => setActiveTask({key: 'social', title: 'Social & Ecosystem', reward: 0.005, inputType: 'username'})} disabled={tasks.social} style={{ padding: '6px 16px', borderRadius: '20px', border: tasks.social ? '1px solid #adb5bd' : '1px solid var(--primary)', background: tasks.social ? '#f8f9fa' : 'transparent', color: tasks.social ? '#adb5bd' : 'var(--primary)', cursor: tasks.social ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>{tasks.social ? 'Pending \u231B' : 'Kirim Bukti'}</button>
          </div>
        </div>

        {/* Exchange */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #e9ecef' }}>
          <h4 style={{ margin: '0 0 16px 0' }}>Join Crypto Exchange</h4>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Daftar via referral dan dapatkan bonus. (Binance, Tokocrypto, Gate.io).</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+0.1 - 10 BMC</span>
            <button onClick={() => setActiveTask({key: 'crypto', title: 'Exchange Referral', reward: 0.1, inputType: 'uid'})} disabled={tasks.crypto} style={{ padding: '6px 16px', borderRadius: '20px', border: tasks.crypto ? '1px solid #adb5bd' : '1px solid var(--primary)', background: tasks.crypto ? '#f8f9fa' : 'transparent', color: tasks.crypto ? '#adb5bd' : 'var(--primary)', cursor: tasks.crypto ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>{tasks.crypto ? 'Pending \u231B' : 'Kirim Bukti'}</button>
          </div>
        </div>

        {/* Pi Network */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #e9ecef' }}>
          <h4 style={{ margin: '0 0 16px 0' }}>Join Pi Network</h4>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Integrasi Future Web3 Ecosystem. Daftar menggunakan referral founder.</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+0.010 BMC</span>
            <button onClick={() => setActiveTask({key: 'pi', title: 'Pi Network Registration', reward: 0.01, inputType: 'username'})} disabled={tasks.pi} style={{ padding: '6px 16px', borderRadius: '20px', border: tasks.pi ? '1px solid #adb5bd' : '1px solid var(--primary)', background: tasks.pi ? '#f8f9fa' : 'transparent', color: tasks.pi ? '#adb5bd' : 'var(--primary)', cursor: tasks.pi ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>{tasks.pi ? 'Pending \u231B' : 'Kirim Bukti'}</button>
          </div>
        </div>

        {/* Ads & Engagement */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #e9ecef' }}>
          <h4 style={{ margin: '0 0 16px 0' }}>Watch & Support</h4>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Nonton YouTube @bambupedia & like konten resmi (Reward per tontonan).</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+0.005 BMC / view</span>
             <button onClick={() => setActiveTask({key: 'watch', title: 'Watch Ads/YouTube', reward: 0.005, inputType: 'username'})} disabled={tasks.watch} style={{ padding: '6px 16px', borderRadius: '20px', border: tasks.watch ? '1px solid #adb5bd' : '1px solid var(--primary)', background: tasks.watch ? '#f8f9fa' : 'transparent', color: tasks.watch ? '#adb5bd' : 'var(--primary)', cursor: tasks.watch ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>{tasks.watch ? 'Pending \u231B' : 'Kirim Bukti'}</button>
          </div>
        </div>

      </div>
    </div>
  );
};

const ContributeDataBMC = () => {
  const { addPendingValidation } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  
  const [mapOpen, setMapOpen] = useState(false);
  const [gps, setGps] = useState("");
  const [localName, setLocalName] = useState("");
  const [jmlRebung, setJmlRebung] = useState("");
  const [pemilik, setPemilik] = useState("");
  const [alamatPemilik, setAlamatPemilik] = useState("");
  const [waPemilik, setWaPemilik] = useState("");
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
          alert(`⚠️ Untuk melakukan kontribusi (${action}), Anda wajib memverifikasi akun (KYC) terlebih dahulu.`);
          return false;
      }
      return true;
  };

  const locateGps = () => setMapOpen(true);

  const handleMapPinDrop = (e) => {
    // Generate mock GPS from image click loosely bounded to Indo region
    const mockLat = (-6.1 + Math.random() * 0.1).toFixed(5);
    const mockLng = (106.8 + Math.random() * 0.1).toFixed(5);
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
      alert("Mohon lengkapi Nama Lokal Bambu dan Koordinat GPS sebelum mengirim.");
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
        details: { jmlRebung, pemilik, alamatPemilik, waPemilik },
        uploadedFiles
      });
      alert("✅ Data berhasil dikirim! Validator saat ini sedang meninjau data Anda di sistem konsensus jaringan. Anda akan mendapatkan reward setelah disahkan.");
    }, 1500);
  };

  const photoRequirements = [
    { label: 'Rumpun', count: 3, ex: '/gambar/taksonomi3.jpg' },
    { label: 'Ruas Batang', count: 1, ex: '/gambar/batang4.jpg' },
    { label: 'Buku Batang', count: 1, ex: '/gambar/taksonomi3.jpg' },
    { label: 'Pelepah Daun', count: 1, ex: '/gambar/taksonomi4.jpg' },
    { label: 'Pelepah Batang (Blade-Auricle-Bristie)', count: 3, ex: '/gambar/pelepah2.jpg' },
    { label: 'Cabang', count: 1, ex: '/gambar/taksonomi5.jpg' },
    { label: 'Rebung (Opsional: Depan-Samping-Atas)', count: 3, ex: '/gambar/rebung.jpg' },
    { label: 'Bunga (Opsional)', count: 1, ex: '/gambar/bunga.jpg' },
    { label: 'Selfie dengan rumpun bambu', count: 1, ex: '/gambar/taksonomi6.jpg' }
  ];

  const taxonomyImages = ['batang.jpg', 'batang2.jpg', 'batang3.jpg', 'batang4.jpg', 'bunga.jpg', 'bunga2.jpg', 'gmap.jpg', 'pelepah.jpg', 'pelepah2.jpg', 'rebung.jpg', 'rumpun.jpg', 'survey.jpg', 'taksonomi.jpg', 'taksonomi2.jpg', 'taksonomi3.jpg', 'taksonomi4.jpg', 'taksonomi5.jpg', 'taksonomi6.jpg'];

  return (
    <div style={{ animation: 'fadeIn 0.2s', marginTop: '24px' }}>
      {previewImg && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }} onClick={() => setPreviewImg(null)}>
          <img src={previewImg} alt="Preview" style={{ maxWidth: '90%', maxHeight: '90vh', borderRadius: '12px', border: '2px solid white' }} />
          <div style={{ position: 'absolute', top: '20px', color: 'white', fontWeight: 'bold' }}>Klik di mana saja untuk menutup</div>
        </div>
      )}

      {mapOpen && (
        <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '24px', width: '90%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.2s' }}>
            <h3 style={{ margin:0 }}>Pilih Lokasi di Peta</h3>
            <p style={{ margin:0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Klik di area gambar peta satelit ini untuk menyematkan *pin* koordinat GPS lokasi observasi Anda secara manual tanpa internet.</p>
            <div onClick={handleMapPinDrop} style={{ width: '100%', height: '300px', background: 'url(/gambar/gmap.jpg) center/cover', borderRadius: '16px', border: '2px solid #dee2e6', cursor: 'crosshair', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', pointerEvents: 'none' }}>⬇️ Klik Sembarang Titik Area ⬇️</div>
            </div>
            <button onClick={() => setMapOpen(false)} style={{ padding: '12px', border: '1px solid #ced4da', background: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Batal</button>
          </div>
        </div>
      )}

      <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Contribute Bamboo Data</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Kirimkan observasi bambu Anda untuk divalidasi dan dapatkan reward hingga 50 BMC.</p>

      <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Nama Lokal Bambu</label>
            <input type="text" value={localName} onChange={e => setLocalName(e.target.value)} placeholder="Contoh: Bambu Apus" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ced4da' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Koordinat GPS (Map)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={gps} onChange={e => setGps(e.target.value)} placeholder="-6.1214, 106.123" style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ced4da' }} />
              <button title="Pilih Lokasi GPS" onClick={locateGps} style={{ padding: '0 16px', background: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '12px', cursor: 'pointer', color: 'var(--primary)' }}><MapPin size={18} /></button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Estimasi Jumlah Rumpun & Batang</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" placeholder="Rumpun" style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ced4da' }} />
              <input type="number" placeholder="Batang" style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ced4da' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Jarak dari Akses Jalan (m/km)</label>
            <input type="text" placeholder="Contoh: 50 meter" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ced4da' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Jumlah Rebung</label>
            <input type="number" value={jmlRebung} onChange={e => setJmlRebung(e.target.value)} placeholder="0" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ced4da' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Nama Pemilik Rumpun</label>
            <input type="text" value={pemilik} onChange={e => setPemilik(e.target.value)} placeholder="Nama Lengkap Pemilik" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ced4da' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Alamat Pemilik</label>
            <input type="text" value={alamatPemilik} onChange={e => setAlamatPemilik(e.target.value)} placeholder="Alamat Detail" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ced4da' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Nomor WA Pemilik</label>
            <input type="text" value={waPemilik} onChange={e => setWaPemilik(e.target.value)} placeholder="08123XXX" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ced4da' }} />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Potensi Tambahan</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['BUMDES', 'KMP', 'Kuliner', 'Pariwisata', 'Industri Bambu', 'Pasar Bambu', 'SPPG', 'Akses Jalan', 'Lainnya'].map(tag => (
              <span key={tag} onClick={() => handleTagClick(tag)} style={{ padding: '6px 12px', background: activeTags.includes(tag) ? 'var(--primary)' : '#f1f3f5', color: activeTags.includes(tag) ? 'white' : 'var(--text-main)', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s' }}>{tag}</span>
            ))}
          </div>
          {activeTags.includes('Lainnya') && (
            <input type="text" value={lainnyaText} onChange={e => setLainnyaText(e.target.value)} placeholder="Sebutkan potensi lainnya..." style={{ width: '100%', marginTop: '12px', padding: '12px', borderRadius: '12px', border: '1px solid #ced4da' }} />
          )}
        </div>

        <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '16px', marginBottom: '24px', border: '1px dashed #ced4da' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>Upload Foto</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Pastikan foto diunggah dengan jelas. Klik <strong>Lihat Contoh</strong> agar foto diterima oleh validator.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {photoRequirements.map((req, i) => {
              return (
              <div key={i} style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #e9ecef', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{req.label} <span style={{ color: 'var(--primary)' }}>({req.count} Foto)</span></div>
                
                {req.count === 1 ? (
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button onClick={() => setPreviewImg(req.ex)} style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid var(--primary)', background: 'white', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}>Lihat Contoh</button>
                    <label style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', border: uploadedFiles[`${req.label}_0`] ? '1px solid #25D366' : 'none', background: uploadedFiles[`${req.label}_0`] ? '#dcf8c6' : 'var(--primary)', color: uploadedFiles[`${req.label}_0`] ? '#075e54' : 'white', cursor: 'pointer', textAlign: 'center', fontWeight: 'bold', flex: 1, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {uploadedFiles[`${req.label}_0`] ? 'Berhasil ✅' : 'Upload'} <input onChange={(e) => handleFileChange(e, `${req.label}_0`)} type="file" accept="image/*" style={{ display: 'none' }} />
                    </label>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                    <button onClick={() => setPreviewImg(req.ex)} style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid var(--primary)', background: 'white', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>Lihat Contoh</button>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${req.count}, 1fr)`, gap: '6px' }}>
                      {Array.from({ length: req.count }).map((_, j) => {
                        const fileKey = `${req.label}_${j}`;
                        const isUp = uploadedFiles[fileKey];
                        return (
                          <label key={j} style={{ padding: '6px 2px', fontSize: '0.7rem', borderRadius: '8px', border: isUp ? '1px solid #25D366' : 'none', background: isUp ? '#dcf8c6' : 'var(--primary)', color: isUp ? '#075e54' : 'white', cursor: 'pointer', textAlign: 'center', fontWeight: 'bold', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isUp ? '✅' : `Foto ${j+1}`} <input onChange={(e) => handleFileChange(e, fileKey)} type="file" accept="image/*" style={{ display: 'none' }} />
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )})}
          </div>
        </div>

        {/* Galeri Taksonomi Bambu */}
        <div style={{ background: '#eef2f5', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', color: '#1864ab' }}>Galeri Pengetahuan Taksonomi Bambu</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Geser ke samping (swipe) untuk melihat referensi komprehensif galeri data taksonomi bambu yayasan kami.</p>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'thin' }}>
            {taxonomyImages.map(img => (
              <div key={img} onClick={() => setPreviewImg(`/gambar/${img}`)} style={{ flexShrink: 0, width: '120px', height: '120px', borderRadius: '12px', background: `url(/gambar/${img}) center/cover`, border: '2px solid white', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }} />
            ))}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '12px', fontWeight: 'bold', width: '100%', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem' }}>
          {loading ? 'Mengirim Data ke Sistem Konsensus...' : 'Kirim Data untuk Validasi'}
        </button>
      </div>
    </div>
  );
};

const ValidatorBMC = () => {
  const { user, stakeBmc, pendingValidations, approveValidation } = useAuth();
  const hasEnough = (user?.bmcBalance || 0) >= 10;
  const isStaked = user?.isValidator || false;
  const [termsModal, setTermsModal] = useState(false);
  const [previewImgWithWatermark, setPreviewImgWithWatermark] = useState(null);

  const confirmStake = () => {
    if (stakeBmc(10.0, 'Validator')) {
      setTermsModal(false);
      alert("✅ 10 BMC berhasil di-stake! Anda sekarang resmi terikat sumpah Validator.");
    } else {
      alert("Saldo tidak cukup.");
      setTermsModal(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.2s', marginTop: '24px' }}>
      {previewImgWithWatermark && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }} onClick={() => setPreviewImgWithWatermark(null)}>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90vh' }}>
            <img src={previewImgWithWatermark} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px', border: '2px solid white' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', color: 'rgba(255, 255, 255, 0.4)', fontSize: '2rem', fontWeight: '900', whiteSpace: 'nowrap', pointerEvents: 'none', textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              CONFIDENTIAL<br/>
              <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>Validated by: {user?.name || 'Authorized Validator'}</span>
            </div>
            <div style={{ position: 'absolute', top: '20px', left:0, right:0, textAlign: 'center', color: 'white', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Dilarang keras menyebarluaskan - Hak Cipta Yayasan</div>
          </div>
        </div>
      )}

      {termsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', width: '90%', maxWidth: '500px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#e03131' }}>⚠️ Syarat & Ketentuan Validator</h3>
            <div style={{ background: '#fff5f5', padding: '16px', borderRadius: '12px', border: '1px solid #ffc9c9', marginBottom: '24px', fontSize: '0.9rem', color: '#495057', maxHeight: '300px', overflowY: 'auto' }}>
              <p>Sebagai Validator resmi ekosistem BaMbooChain, Anda diwajibkan untuk menaati pakta integritas kerahasiaan data (NDA). Data kontribusi yang Anda lihat adalah Hak Milik Yayasan.</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                <li style={{ marginBottom: '8px' }}>Dilarang keras mengunduh, menyimpan, atau membagikan foto-foto observasi bambu dari pengguna lain.</li>
                <li style={{ marginBottom: '8px' }}>Dilarang keras menyalahgunakan kontak WA/Nomor telepon pemilik rumpun bambu yang terlampir.</li>
                <li style={{ marginBottom: '8px' }}>Diwajibkan melakukan validasi fisik secara jujur berdasarkan foto yang tertera.</li>
              </ul>
              <strong style={{ color: '#e03131' }}>SANKSI PELANGGARAN: Jika sistem atau komunitas menemukan Validator membagikan foto yang sedang diverifikasi, maka:<br/>1. Seluruh saldo BMC Anda (termasuk kepingan modal Staking) akan dibekukan / hangus.<br/>2. Akun akan dihapus.<br/>3. Anda di-*blacklist* permanen dari seluruh ekosistem Yayasan Sabumi.</strong>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setTermsModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ced4da', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Tolak & Batal</button>
              <button onClick={confirmStake} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#e03131', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Saya Setuju, Stake 10 BMC!</button>
            </div>
          </div>
        </div>
      )}

      <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Dashboard Validator</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Verifikasi data kontribusi bambu dari user lain dan dapatkan reward khusus validator.</p>

      {isStaked ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e9ecef', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '4px' }}>12</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Divalidasi</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e9ecef', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59f00', marginBottom: '4px' }}>{(pendingValidations || []).length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending Antrean</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e9ecef', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e03131', marginBottom: '4px' }}>0</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sub-Quality / Ditolak</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e9ecef', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#12b886', marginBottom: '4px' }}>99%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Validator Performance</div>
            </div>
          </div>

          <div style={{ background: 'white', border: '1px solid #ced4da', borderRadius: '24px', padding: '32px' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={24} color="#1864ab" /> Ruang Kerja Validator</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Sebagai Validator, Anda bertugas mengecek foto observasi user lain. Klik sahkan jika terbukti akurat.</p>
            
            {(user && pendingValidations && pendingValidations.length === 0) ? (
              <div style={{ padding: '32px', textAlign: 'center', background: '#f8f9fa', borderRadius: '16px', color: '#adb5bd' }}>
                 Belum ada data observasi antrean di jaringan saat ini.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: 'rgba(12, 166, 120, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid var(--primary)', marginBottom: '16px' }}>
                  <h5 style={{ margin: '0 0 12px 0', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={18} /> Misi Penanaman Terbuka (bambuNUSA)</h5>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '16px', borderRadius: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>Tanam 10 Bibit Betung</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Oleh: Kang Dadang | Lokasi: Cisadane</div>
                    </div>
                    <button 
                      onClick={() => alert('✅ Misi ditutup! Payout sebesar 50 BMC telah dicairkan ke saldo Kang Dadang.')}
                      style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Tutup Misi & Cairkan
                    </button>
                  </div>
                </div>

                 {(pendingValidations || []).map(task => (
                   <div key={task.id} style={{ background: '#f8f9fa', padding: '24px', borderRadius: '16px', border: '1px solid #e9ecef', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     
                     <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #dee2e6', paddingBottom: '16px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '6px' }}>{task.title}</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>📅 Disubmit: {new Date(task.date).toLocaleDateString()}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.85rem', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '12px' }}>Tag: {task.tags || 'Tidak disediakan'}</span>
                        </div>
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                       <div><strong>📍 Lokasi Peta (GPS):</strong> <br/><span style={{ color: '#1864ab' }}>{task.gps || '-'}</span></div>
                       {task.details && (
                         <>
                           <div><strong>🌱 Estimasi Jumlah Rebung:</strong> <br/>{task.details.jmlRebung || '0'} Tunas</div>
                           <div><strong>👤 Pemilik Rumpun:</strong> <br/>{task.details.pemilik || 'Anonim'}</div>
                           <div><strong>🏡 Alamat Pemilik:</strong> <br/>{task.details.alamatPemilik || '-'}</div>
                           <div><strong>📞 Nomor WA:</strong> <br/>{task.details.waPemilik || '-'}</div>
                         </>
                       )}
                     </div>

                     {task.uploadedFiles && Object.keys(task.uploadedFiles).length > 0 && (
                       <div style={{ marginTop: '8px' }}>
                         <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '12px' }}>📷 Berkas Observasi Lapangan:</div>
                         <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                           {Object.entries(task.uploadedFiles).map(([key, imgUrl]) => (
                             <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                               <div 
                                 onClick={() => setPreviewImgWithWatermark(imgUrl)}
                                 style={{ width: '80px', height: '80px', borderRadius: '12px', background: `url(${imgUrl}) center/cover`, border: '2px solid #ced4da', cursor: 'zoom-in' }}
                               />
                               <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{key}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}

                     <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                       <button onClick={() => { approveValidation(task.id); alert('Data ditolak. (Fitur penolakan detail akan disempurnakan)'); }} style={{ background: 'white', color: '#e03131', border: '1px solid #e03131', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Tolak (Di bawah standar)</button>
                       <button onClick={() => { approveValidation(task.id); alert('✅ Verifikasi Sah! Sistem memberikan +0.005 BMC komisi kepada Anda sebagai Validator.'); }} style={{ background: '#51cf66', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Setuju & Sahkan Data (+0.005 BMC)</button>
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>
      ) : (
      <div style={{ background: 'linear-gradient(135deg, #1864ab, #3b5bdb)', borderRadius: '24px', padding: '32px', color: 'white' }}>
        <ShieldCheck size={48} style={{ opacity: 0.8, marginBottom: '20px' }} />
        <h4 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Keuntungan Validator</h4>
        <p style={{ opacity: 0.9, marginBottom: '24px', maxWidth: '500px' }}>Bantu jaga kualitas data sistem. Dapatkan 0.002 - 0.005 BMC per validasi data/transaksi.</p>
        
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Syarat Staking</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Minimal 10 BMC</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Status Anda</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: hasEnough ? '#51cf66' : '#fcc419' }}>{hasEnough ? 'Eligible' : 'Not Eligible'}</div>
          </div>
        </div>

        <button 
          disabled={!hasEnough} 
          onClick={() => setTermsModal(true)}
          style={{ background: hasEnough ? 'white' : 'rgba(255,255,255,0.2)', color: hasEnough ? '#1864ab' : 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: hasEnough ? 'pointer' : 'not-allowed' }}
        >
          {hasEnough ? 'Stake 10 BMC to Unlock' : 'Stake 10 BMC to Unlock (Balance Insufficient)'}
        </button>
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
  const [subTab, setSubTab] = useState('earn');
  
  const subTabs = [
    { id: 'earn', label: 'Earn (Gratis)' },
    { id: 'buy', label: 'Buy BMC' },
    { id: 'contribute', label: 'Contribute Data' },
    { id: 'validator', label: 'Validator' },
    { id: 'marketplace', label: 'Marketplace' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '20px' }}>Get BMC</h2>

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
  
  return (
  <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>Transactions</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ced4da', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}>All</button>
        <button style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#e6fcf5', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Earn</button>
        <button style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#fff5f5', color: '#e03131', cursor: 'pointer', fontWeight: 'bold' }}>Spend</button>
        <button style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ced4da', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Transfer</button>
      </div>
    </div>

    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th style={{ padding: '16px', color: '#adb5bd', fontSize: '0.85rem', fontWeight: 'bold' }}>DATE</th>
            <th style={{ padding: '16px', color: '#adb5bd', fontSize: '0.85rem', fontWeight: 'bold' }}>SOURCE / DESC</th>
            <th style={{ padding: '16px', color: '#adb5bd', fontSize: '0.85rem', fontWeight: 'bold' }}>TYPE</th>
            <th style={{ padding: '16px', color: '#adb5bd', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'right' }}>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {txList.length === 0 ? (
            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: '#adb5bd' }}>Belum ada transaksi off-chain</td></tr>
          ) : txList.map((tx, idx) => (
            <tr key={tx?.id || idx} style={{ borderBottom: '1px solid #f1f3f5' }}>
              <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{tx?.date}</td>
              <td style={{ padding: '16px', fontWeight: '600', color: 'var(--text-main)' }}>{tx?.description}</td>
              <td style={{ padding: '16px' }}><span style={{ padding: '4px 10px', background: '#f8f9fa', borderRadius: '12px', fontSize: '0.8rem' }}>{tx?.type}</span></td>
              <td style={{ padding: '16px', fontWeight: 'bold', textAlign: 'right', color: String(tx?.amount || "").includes('+') ? 'var(--primary)' : 'var(--text-main)' }}>{tx?.amount} BMC</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
};

const StakingTab = () => (
  <div style={{ animation: 'fadeIn 0.3s ease-in-out', textAlign: 'center', padding: '60px 20px' }}>
     <Cpu size={64} color="var(--primary)" style={{ opacity: 0.3, marginBottom: '24px' }} />
     <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>Staking (Coming Soon)</h2>
     <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 32px auto' }}>
        Fitur Staking untuk mengunci BMC Anda dan mendapatkan *passive income* dengan APY tinggi sedang dalam tahap pengembangan audit smart-contract.
     </p>
     <button style={{ background: '#f1f3f5', color: 'var(--text-muted)', border: 'none', padding: '12px 32px', borderRadius: '30px', fontWeight: 'bold' }}>Notify Me</button>
  </div>
);

const TokenUtilityTab = () => (
  <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px' }}>Token Utility & Reputation</h2>
    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '700px' }}>
      BMC adalah intisarinya. Gunakan BMC untuk membuka fitur ekosistem, tingkatkan level Anda, dan raih hak suara DAO.
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '24px', marginBottom: '32px' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>Utilitas Token (Use Cases)</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
             "Akses prompt khusus AI Bambubot",
             "Unlock artikel riset Premium",
             "Sertifikasi kelas Akademi",
             "Akses ke Data GIS Analytics",
             "Voting di proposal DAO Komunitas"
          ].map((item, i) => (
             <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-main)', fontSize: '0.95rem' }}><CheckCircle size={18} color="var(--primary)" /> {item}</li>
          ))}
        </ul>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1864ab, #0b2b5e)', color: 'white', borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <Award size={100} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }} />
        <h3 style={{ fontSize: '1.3rem', marginBottom: '24px', position: 'relative', zIndex: 1 }}>Sistem Reputasi User</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
          {[
             { title: "Level 1: Explorer", detail: "Pemula (Reward kecil)" },
             { title: "Level 2: Contributor", detail: "Aktivitas harian tinggi" },
             { title: "Level 3: Validator", detail: "Quality Control (Reward extra)" },
             { title: "Level 4: Leader", detail: "Hak voting DAO prioritas" },
          ].map((lvl, i) => (
             <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
               <div style={{ width: '30px', height: '30px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{i+1}</div>
               <div>
                  <div style={{ fontWeight: 'bold' }}>{lvl.title}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{lvl.detail}</div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const KYCCenterTab = () => {
  const { user, updateKyc } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setSubmitted(user.kycStatus === 'pending' || user.kycStatus === 'verified');
    }
  }, [user?.kycStatus]);

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <ShieldCheck size={48} color="#adb5bd" style={{ marginBottom: '16px' }} />
        <h3 style={{ margin: 0 }}>Akses Terbatas</h3>
        <p style={{ color: 'var(--text-muted)' }}>Silakan login untuk mengakses fitur verifikasi KYC.</p>
      </div>
    );
  }

  const handleKycSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateKyc({ submittedAt: new Date().toISOString() });
      setLoading(false);
      setSubmitted(true);
      alert("✅ Data KYC berhasil dikirim! Tim Admin kami akan memverifikasi dokumen Anda dalam 1x24 jam.");
    }, 1500);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px' }}>KYC Center</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px' }}>Verifikasi identitas Anda untuk membuka akses penuh ke seluruh fitur BaMbooChain.</p>

      {submitted ? (
        <div style={{ background: 'white', borderRadius: '24px', padding: '48px', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
           <div style={{ width: '80px', height: '80px', background: user?.kycStatus === 'verified' ? '#e6fcf5' : '#fff9db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
              <ShieldCheck size={40} color={user?.kycStatus === 'verified' ? '#12b886' : '#fab005'} />
           </div>
           <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{user?.kycStatus === 'verified' ? "Akun Terverifikasi!" : "KYC Sedang Ditinjau"}</h3>
           <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 24px auto' }}>
             {user?.kycStatus === 'verified' 
               ? "Selamat! Anda sekarang memiliki akses tak terbatas untuk transfer, kontribusi, dan utility BMC lainnya."
               : "Terima kasih telah mengajukan. Mohon tunggu proses validasi manual oleh tim kami."}
           </p>
           <div style={{ padding: '12px 24px', background: '#f8f9fa', borderRadius: '12px', display: 'inline-block', fontSize: '0.9rem' }}>
             Status: <strong style={{ color: user?.kycStatus === 'verified' ? '#12b886' : '#fab005' }}>{(user?.kycStatus || 'unsubmitted').toUpperCase()}</strong>
           </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px', alignItems: 'start' }}>
          <form onSubmit={handleKycSubmit} style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                   <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Nama Lengkap (Sesuai KTP)</label>
                   <input type="text" defaultValue={user?.name} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #dee2e6' }} />
                </div>
                <div>
                   <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Nomor NIK / KTP</label>
                   <input type="text" placeholder="16 digit nomor NIK" required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #dee2e6' }} />
                </div>
             </div>
             
             <div>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 'bold' }}>Foto KTP & Selfie</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '16px', border: '1px dashed #ced4da', textAlign: 'center' }}>
                      <Camera size={24} color="#adb5bd" style={{ marginBottom: '8px' }} />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Foto KTP Asli</div>
                      <input type="file" style={{ display: 'none' }} id="ktp-upload" />
                      <button type="button" onClick={() => document.getElementById('ktp-upload').click()} style={{ marginTop: '12px', background: 'white', padding: '6px 12px', borderRadius: '8px', border: '1px solid #dee2e6', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Upload</button>
                   </div>
                   <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '16px', border: '1px dashed #ced4da', textAlign: 'center' }}>
                      <Users size={24} color="#adb5bd" style={{ marginBottom: '8px' }} />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Selfie + KTP</div>
                      <input type="file" style={{ display: 'none' }} id="selfie-upload" />
                      <button type="button" onClick={() => document.getElementById('selfie-upload').click()} style={{ marginTop: '12px', background: 'white', padding: '6px 12px', borderRadius: '8px', border: '1px solid #dee2e6', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Upload</button>
                   </div>
                </div>
             </div>

             <div style={{ background: '#fff9db', padding: '16px', borderRadius: '12px', fontSize: '0.85rem', color: '#856404', display: 'flex', gap: '12px' }}>
                <ShieldCheck size={20} style={{ flexShrink: 0 }} />
                <span>Dengan mengirimkan data ini, saya menyatakan bahwa data yang diberikan adalah benar dan saya setuju dengan kebijakan privasi Yayasan Sabumi.</span>
             </div>

             <button disabled={loading} type="submit" style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem' }}>
                {loading ? "Mengirim data..." : "Kirim Pengajuan KYC"}
             </button>
          </form>

          <div style={{ background: '#f1f3f5', borderRadius: '24px', padding: '24px' }}>
             <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Kenapa Harus KYC?</h4>
             <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li><strong>Anti-Fraud:</strong> Menghindari penyalahgunaan akun dan serangan bot massal.</li>
                <li><strong>Compliance:</strong> Memenuhi regulasi internasional terkait aset digital.</li>
                <li><strong>Security:</strong> Memastikan transfer BMC hanya terjadi antar manusia asli yang terverifikasi.</li>
                <li><strong>Priority:</strong> User terverifikasi mendapatkan prioritas reward lebih tinggi.</li>
             </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const SecuritySettingsTab = () => {
  const { user, updateSecurity } = useAuth();
  const [retinaScanning, setRetinaScanning] = useState(false);

  const toggle2FA = () => updateSecurity({ twoFactor: !user?.securitySettings?.twoFactor });
  const toggleRetina = () => {
    if(!user?.securitySettings?.retina) {
        setRetinaScanning(true);
        setTimeout(() => {
            updateSecurity({ retina: true });
            setRetinaScanning(false);
            alert("👁️ Biometrik Retina berhasil didaftarkan dan aktif!");
        }, 3000);
    } else {
        updateSecurity({ retina: false });
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px' }}>Security Settings</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px' }}>Lindungi aset BMC Anda dengan lapisan keamanan tambahan.</p>

      {retinaScanning && (
        <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.9)', zIndex: 100000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '200px', height: '200px', border: '4px solid #12b886', borderRadius: '50%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', top: 0, width: '100%', height: '4px', background: '#12b886', boxShadow: '0 0 15px #12b886', animation: 'scan 2s infinite ease-in-out' }}></div>
                <div style={{ fontSize: '3rem' }}>👁️</div>
            </div>
            <h3 style={{ color: 'white', marginTop: '24px', letterSpacing: '2px' }}>MEMINDAI RETINA...</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Mohon jangan tutup jendela ini.</p>
            <style>{`
                @keyframes scan {
                    0% { top: 10%; }
                    50% { top: 90%; }
                    100% { top: 10%; }
                }
            `}</style>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
         <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
               <h4 style={{ margin: '0 0 4px 0' }}>2FA Verification</h4>
               <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gunakan kode OTP untuk setiap transaksi.</p>
            </div>
            <button onClick={toggle2FA} style={{ padding: '8px 20px', borderRadius: '30px', border: 'none', background: user?.securitySettings?.twoFactor ? '#e6fcf5' : '#f1f3f5', color: user?.securitySettings?.twoFactor ? '#12b886' : '#adb5bd', fontWeight: 'bold', cursor: 'pointer' }}>
               {user?.securitySettings?.twoFactor ? "AKTIF" : "NONAKTIF"}
            </button>
         </div>

         <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
               <h4 style={{ margin: '0 0 4px 0' }}>Biometrik (Retina)</h4>
               <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gunakan pemindaian mata untuk akses cepat.</p>
            </div>
            <button onClick={toggleRetina} style={{ padding: '8px 20px', borderRadius: '30px', border: 'none', background: user?.securitySettings?.retina ? '#e6fcf5' : '#f1f3f5', color: user?.securitySettings?.retina ? '#12b886' : '#adb5bd', fontWeight: 'bold', cursor: 'pointer' }}>
               {user?.securitySettings?.retina ? "AKTIF" : "DAFTARKAN"}
            </button>
         </div>

         <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
               <h4 style={{ margin: '0 0 4px 0' }}>Wallet PIN</h4>
               <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kode 6 digit untuk konfirmasi kirim token.</p>
            </div>
            <button style={{ padding: '8px 20px', borderRadius: '30px', border: 'none', background: '#f1f3f5', color: '#adb5bd', fontWeight: 'bold', cursor: 'pointer' }}>UBAH PIN</button>
         </div>
      </div>
    </div>
  );
};


// ======================================
// MAIN PAGE COMPONENT
// ======================================

const TokenWalletPage = () => {
  const { walletAddress, isConnected, connectWallet } = useWeb3();
  const [activeTab, setActiveTab] = useState('overview');

  const TABS = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'whitepaper', label: 'Whitepaper BMC', icon: FileText },
    { id: 'dashboard', label: 'Wallet Dashboard', icon: Wallet },
    { id: 'get_bmc', label: 'Get BMC', icon: Gift },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'kyc', label: 'KYC Center', icon: ShieldCheck },
    { id: 'security', label: 'Security (Advanced)', icon: Lock },
    { id: 'staking', label: 'Staking (Opsional)', icon: Cpu },
    { id: 'utility', label: 'Token Utility', icon: TrendingUp },
  ];

  return (
    <div style={{ paddingTop: '220px', paddingBottom: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ marginBottom: '24px' }}>
        <BackButton to="/bamboochain" />
      </div>
      <div className="container" style={{ display: 'flex', flexDirection: 'row', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* SIDEBAR NAVIGATION */}
        <div style={{ width: '280px', flexShrink: 0 }}>
          <div style={{ 
            background: 'white', borderRadius: '24px', padding: '24px', 
            position: 'sticky', top: '120px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
            border: '1px solid #f1f3f5'
          }}>
            <div style={{ 
              fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', 
              color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '16px' 
            }}>
              Menu Token & Wallet
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      width: '100%', padding: '12px 16px', textAlign: 'left',
                      background: isActive ? 'var(--primary)' : 'transparent',
                      color: isActive ? 'white' : 'var(--text-main)',
                      border: 'none', borderRadius: '12px',
                      fontWeight: isActive ? 'bold' : '500',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if(!isActive) e.currentTarget.style.background = '#f1f3f5';
                    }}
                    onMouseLeave={(e) => {
                      if(!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <tab.icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div style={{ flex: 1, minWidth: '0' }}>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'whitepaper' && <WhitepaperTab />}
          {activeTab === 'dashboard' && <WalletDashboardTab isConnected={isConnected} connectWallet={connectWallet} walletAddress={walletAddress} />}
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
