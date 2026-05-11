import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Leaf, GraduationCap, Target, ArrowRight, Zap, MapPin, 
  Clock, Coins, ChevronRight, MessageSquare, X, Send, Users, 
  TrendingUp, Award, DollarSign, Activity, Search
} from 'lucide-react';
import BackButton from '../components/BackButton';

const CareersPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeBountyTab, setActiveBountyTab] = useState('New');
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: 'bot', text: 'Halo! Saya BambuAI. Ada yang bisa saya bantu terkait karir di ekosistem Sabumi?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const jobOpenings = [
    {
      id: 'JOB-001',
      title: "Senior Smart Contract Developer",
      department: "Web3 Engineering",
      location: "Remote / Jakarta",
      type: "Full-time",
      salary: "IDR 30M - 50M",
      findersFee: "500 BMC",
      icon: <Zap size={24} color="#f59f00" />,
      color: "#f59f00"
    },
    {
      id: 'JOB-002',
      title: "Ahli Agronomi Spesialis Bambu",
      department: "Plantation & R&D",
      location: "Kasepuhan Cibarani, Banten",
      type: "Full-time",
      salary: "IDR 15M - 25M",
      findersFee: "200 BMC",
      icon: <Leaf size={24} color="#0ca678" />,
      color: "#0ca678"
    },
    {
      id: 'JOB-003',
      title: "Legal & Compliance Web3",
      department: "Legal & Operations",
      location: "Tangerang Selatan",
      type: "Full-time",
      salary: "IDR 20M - 35M",
      findersFee: "300 BMC",
      icon: <Briefcase size={24} color="#3b82f6" />,
      color: "#3b82f6"
    }
  ];

  const bounties = [
    { id: 'BTY-01', title: "Terjemahkan Whitepaper ke Bahasa Jepang", reward: "500 BMC", difficulty: "Medium", tag: "Translation", category: "New", value: 500 },
    { id: 'BTY-02', title: "Desain Infografis Ekosistem bambuNUSA", reward: "250 BMC", difficulty: "Easy", tag: "Design", category: "Top", value: 250 },
    { id: 'BTY-03', title: "Audit Kontrak Cerdas Vesting V2", reward: "2,000 BMC", difficulty: "Hard", tag: "Security", category: "Value", value: 2000 },
    { id: 'BTY-04', title: "Tulis Artikel Medium tentang Skema Karbon", reward: "150 BMC", difficulty: "Easy", tag: "Content", category: "New", value: 150 }
  ];

  const filteredBounties = bounties.filter(b => {
    if (activeBountyTab === 'New') return b.category === 'New' || b.category === 'Top';
    if (activeBountyTab === 'Top') return b.category === 'Top' || b.category === 'Value';
    if (activeBountyTab === 'Value') return b.value >= 500;
    return true;
  });

  const demandBoard = [
    {
      id: 'DMD-001',
      title: "Pembangunan Villa Bambu Ekologis 10 Unit",
      location: "Ubud, Bali",
      demandType: "Konstruksi & Arsitektur",
      funding: "Terkonfirmasi (150K USDT)",
      status: "Mencari Tim Pelaksana",
      icon: <Target size={24} color="#e03131" />,
      color: "#e03131",
      details: null
    },
    {
      id: 'DMD-002',
      title: "Pengadaan 50,000 Bibit Bambu Betung",
      location: "Jawa Barat",
      demandType: "Suplai Material",
      funding: "Terkonfirmasi (PO Aktif)",
      status: "Mencari Petani/Koperasi",
      icon: <Leaf size={24} color="#0ca678" />,
      color: "#0ca678",
      details: null
    },
    {
      id: 'DMD-003',
      title: "Suplai Bambu untuk Rangka Layangan ke India",
      location: "Pengumpulan (WA: 08174139994)",
      demandType: "Ekspor Material",
      funding: "PO Aktif ($2.8 / Bundle)",
      status: "Mencari Suplier",
      icon: <Target size={24} color="#f59f00" />,
      color: "#f59f00",
      details: {
        reqs: "1 sampai 2 Kontainer 20ft / 40ft per bulan (1000 - 1100 bundle).",
        price: "$ 2.8 / bundle (Harga terima di lokasi pengumpulan).",
        specs: [
          "Ukuran 40 inci (102 cm) : 10 belahan - Tanpa simpul",
          "Ukuran 34 inci (86-87 cm) : 10 belahan - Tanpa simpul",
          "Ukuran 36 inci (92 cm) : 10 belahan - Tanpa simpul",
          "Ketebalan: 8 - 10 mm",
          "Diameter: 9 cm untuk setiap belahan",
          "Toleransi tertentu dapat digunakan",
          "Berbagai jenis bambu masuk asalkan sesuai ukuran",
          "Kondisi: Treatment anti hama bubuk, kering (Kadar air 8-14%)",
          "Packaging: Diikat tali bambu, 1 bundle = 100 bilah / 50 batang sesuai ukuran masing-masing spek"
        ],
        images: [
          "gambar/demandmarket/bl.jpeg",
          "gambar/demandmarket/bl1.jpeg",
          "gambar/demandmarket/bl3.jpeg",
          "gambar/demandmarket/bl4.jpeg",
          "gambar/demandmarket/bl5.jpeg",
          "gambar/demandmarket/bl6.jpeg",
          "gambar/demandmarket/bl7.jpeg",
          "gambar/demandmarket/bl8.jpeg",
          "gambar/demandmarket/bl9.jpeg"
        ]
      }
    },
    {
      id: 'DMD-004',
      title: "Rumah Modular Bambu 4m x 6m",
      location: "Workshop (WA: 08174139994)",
      demandType: "Konstruksi & Arsitektur",
      funding: "Rp 70.000.000 / Unit",
      status: "Mencari Vendor",
      icon: <Target size={24} color="#e03131" />,
      color: "#e03131",
      details: {
        reqs: "Kebutuhan saat ini: 1 Unit Rumah Modular.",
        price: "Rp 70.000.000 (Harga jadi di lokasi workshop/pabrik vendor).",
        specs: [
          "Bahan: Bambu laminasi dari berbagai jenis bambu.",
          "Ukuran Bangunan: 4 meter x 6 meter.",
          "Desain: Mengikuti gambar acuan terlampir.",
          "Fleksibilitas: Jika vendor memiliki desain alternatif yang lebih efisien, sangat diperbolehkan untuk diajukan."
        ],
        images: [],
        pdf: "gambar/demandmarket/rumahmodular/rmb.pdf"
      }
    },
    {
      id: 'DMD-005',
      title: "Komponen Huntap RISHAM T36 (6.000 Unit)",
      location: "Sumatera Barat & Aceh (WA: 08174139994)",
      demandType: "Manufaktur Massal",
      funding: "Mega Proyek (Terkonfirmasi)",
      status: "Mencari Suplier Pabrikasi",
      icon: <Target size={24} color="#3b82f6" />,
      color: "#3b82f6",
      details: {
        reqs: "Kebutuhan Bertahap: 1 Unit Sample -> 250 Unit Rumah Contoh -> 5.750 Unit Pembangunan Massal (Total 6.000 Unit).",
        price: "Dinding: Rp 270.000/m² (1 unit = 67 m²). Kusen Pintu Jendela: Rp 3.500.000/set (Harga di workshop vendor).",
        specs: [
          "Peruntukan: Hunian Tetap (Huntap) RISHAM Type 36 untuk Korban Bencana Alam di Sumatera.",
          "Komponen Dibutuhkan: Dinding, Kusen, Pintu, dan Jendela.",
          "Bahan Material: Bambu laminasi dari berbagai jenis bambu.",
          "Desain Acuan: Telah tersedia (File PDF terlampir).",
          "Fleksibilitas: Jika vendor memiliki alternatif gambar dinding, kusen, pintu, atau jendela lain yang lebih efisien, sangat diperbolehkan untuk diajukan."
        ],
        images: [],
        pdf: "gambar/demandmarket/risham/risham.pdf"
      }
    }
  ];

  const filteredJobs = jobOpenings.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDemand = demandBoard.filter(demand => 
    demand.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    demand.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    demand.demandType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tickerItems = [
    "User @mukoddas baru saja menerima 500 BMC untuk Audit Kontrak",
    "Posisi 'Smart Contract Dev' memiliki pendaftar baru dari 5 negara",
    "Total Payout Bounty bulan ini mencapai 12,500 BMC",
    "Koperasi Tani Cibarani membuka 10 slot Mitra Lapangan baru",
    "Pendaftaran Magang batch Mei 2026 kini dibuka!"
  ];

  const handleSendAi = () => {
    if (!aiInput.trim()) return;
    const userMsg = { role: 'user', text: aiInput };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const botMsg = { role: 'bot', text: 'Terima kasih pertanyaannya! Untuk posisi tersebut, kami mencari ahli yang memahami integrasi Blockchain dengan aset fisik (RWA). Apakah Anda memiliki portofolio terkait?' };
      setAiMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="careers-page-wrapper">
      
      {/* 1. ACTIVITY TICKER - NORMAL FLOW */}
      <div className="activity-ticker">
        <div style={{ display: 'inline-block', animation: 'ticker 30s linear infinite' }}>
          {tickerItems.concat(tickerItems).map((item, i) => (
            <span key={i} style={{ margin: '0 40px', fontSize: '0.85rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
              <Activity size={14} style={{ display: 'inline', marginBottom: '-2px', marginRight: '8px' }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="container">
        
        {/* HEADER */}
        <div className="careers-header-section">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '8px 20px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '24px' }}>
            <Briefcase size={18} /> Karir & Peluang Terbuka
          </div>
          <h1 className="careers-main-title">
            Bangun Masa Depan <span style={{ color: 'var(--primary)', position: 'relative', display: 'inline-block' }}>
              Desentralisasi Hijau
              <svg className="title-underline" viewBox="0 0 300 20" fill="none">
                <path d="M5 15Q150 5 295 15" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="careers-main-desc">
            Bergabunglah dengan ekosistem yang menggabungkan ekonomi riil, restorasi ekologi, dan transparansi Web3. Kami tidak hanya mencari pekerja, kami mencari pembangun peradaban baru.
          </p>

          {/* 2. LIVE STATS DASHBOARD */}
          <div className="live-stats-dashboard">
            <div style={{ textAlign: 'center' }}>
              <div className="stat-number">24</div>
              <div className="stat-label">Active Jobs</div>
            </div>
            <div className="stat-divider"></div>
            <div style={{ textAlign: 'center' }}>
              <div className="stat-number">1,250+</div>
              <div className="stat-label">Contributors</div>
            </div>
            <div className="stat-divider"></div>
            <div style={{ textAlign: 'center' }}>
              <div className="stat-number">450k</div>
              <div className="stat-label">BMC Payouts</div>
            </div>
          </div>
        </div>

        {/* 4 PILAR PELUANG */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '80px' }}>
          {[
            { id: 'profesional', title: "Tim Profesional", icon: <Briefcase size={32} color="#3b82f6" />, color: "#3b82f6", desc: "Bergabung sebagai tim inti (Full-time) di bidang rekayasa Web3, Agronomi, atau Legalitas.", link: "#profesional", action: "Lihat Posisi" },
            { id: 'mitra', title: "Mitra Lapangan", icon: <Leaf size={32} color="var(--primary)" />, color: "var(--primary)", desc: "Menjadi Petani pengelola lahan atau Validator data di lapangan dengan insentif berbasis hasil.", link: "/bambunusa/join-farmer", action: "Daftar Mitra" },
            { id: 'akademik', title: "Riset & Magang", icon: <GraduationCap size={32} color="#845ef7" />, color: "#845ef7", desc: "Jalur riset skripsi/tesis khusus mahasiswa tingkat akhir dari kampus mitra global.", link: "#akademik", action: "Info Program" },
            { id: 'bounty', title: "Web3 Bounties", icon: <Target size={32} color="#f59f00" />, color: "#f59f00", desc: "Kerjakan misi lepas (bounty) dari mana saja dan dapatkan reward token BMC.", link: "#bounty", action: "Lihat Misi" }
          ].map((card) => (
            <div key={card.id} className="premium-card" style={{ background: 'white', padding: '40px', borderRadius: '32px', border: '1px solid #f1f3f5', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative' }}>
              <div style={{ background: `${card.color}10`, width: '70px', height: '70px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: '#1a1a1a' }}>{card.title}</h3>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '30px' }}>{card.desc}</p>
              <button 
                onClick={() => card.link.startsWith('#') ? document.getElementById(card.link.substring(1))?.scrollIntoView({ behavior: 'smooth' }) : navigate(card.link)}
                style={{ background: card.color, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '16px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {card.action} <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* SECTION: PROFESIONAL */}
        <div id="profesional" className="profesional-section">
          <div className="section-header-flex">
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1a1a1a', marginBottom: '12px' }}>Open Positions</h2>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>Bergabunglah membangun fondasi ekosistem triliunan rupiah.</p>
            </div>
            <div className="section-header-actions">
               <div style={{ background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Users size={16} /> Community Hires
               </div>
               <button style={{ background: 'white', color: '#1a1a1a', border: '1px solid #eee', padding: '10px 25px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}>Lihat Departemen</button>
            </div>
          </div>

          <div style={{ position: 'relative', marginBottom: '30px' }}>
            <Search size={20} style={{ position: 'absolute', left: '20px', top: '18px', color: '#adb5bd' }} />
            <input 
              type="text" 
              placeholder="Cari pekerjaan atau proyek (Contoh: Web3, Bali, Konstruksi)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '18px 20px 18px 50px', borderRadius: '20px', border: '1px solid #dee2e6', fontSize: '1rem', boxSizing: 'border-box', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
              <div key={job.id} className="job-row">
                <div className="job-info-group">
                  <div className="job-icon-container" style={{ background: `${job.color}15` }}>
                    {job.icon}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>{job.title}</h3>
                      <span style={{ fontSize: '0.7rem', color: '#999', fontFamily: 'monospace' }}>#{job.id}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', color: '#666', fontSize: '0.9rem', flexWrap: 'wrap', marginTop: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {job.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {job.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="job-actions-group">
                  <div className="job-salary">
                    <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 'bold', textTransform: 'uppercase' }}>Kompensasi</div>
                    <div style={{ fontWeight: '900', color: '#1a1a1a', fontSize: '1.1rem' }}>{job.salary}</div>
                  </div>
                  
                  <div style={{ textAlign: 'center', background: 'rgba(245, 159, 0, 0.05)', padding: '10px 20px', borderRadius: '15px', border: '1px solid rgba(245, 159, 0, 0.1)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#f59f00', fontWeight: 'bold' }}>FINDER'S FEE</div>
                    <div style={{ fontWeight: '900', color: '#f59f00' }}>{job.findersFee}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ background: '#1a1a1a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Lamar</button>
                    <button style={{ background: 'white', color: '#1a1a1a', border: '1px solid #ddd', width: '45px', height: '45px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Refer a Friend">
                      <Users size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#888', background: '#f8f9fa', borderRadius: '24px' }}>
                Tidak ada lowongan pekerjaan yang cocok dengan pencarian "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* SECTION: DEMAND BOARD */}
        <div id="demand" className="profesional-section" style={{ background: '#fdfdfd', borderColor: '#e0313120' }}>
          <div className="section-header-flex">
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Target color="#e03131" size={36} /> Demand Market
              </h2>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>Peluang proyek yang sudah memiliki konfirmasi pendanaan (PO/Funding Ready).</p>
            </div>
            <div className="section-header-actions">
               <div style={{ background: 'rgba(224, 49, 49, 0.1)', color: '#e03131', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                 High Priority
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredDemand.length > 0 ? filteredDemand.map((demand) => (
              <div key={demand.id} className="job-row" style={{ borderColor: `${demand.color}30` }}>
                <div className="job-info-group">
                  <div className="job-icon-container" style={{ background: `${demand.color}15` }}>
                    {demand.icon}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>{demand.title}</h3>
                      <span style={{ fontSize: '0.7rem', color: '#999', fontFamily: 'monospace' }}>#{demand.id}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', color: '#666', fontSize: '0.9rem', flexWrap: 'wrap', marginTop: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {demand.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0ca678', fontWeight: 'bold' }}><DollarSign size={16} /> {demand.funding}</span>
                    </div>
                  </div>
                </div>
                
                <div className="job-actions-group">
                  <div className="job-salary">
                    <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 'bold', textTransform: 'uppercase' }}>Kategori</div>
                    <div style={{ fontWeight: '900', color: '#1a1a1a', fontSize: '1.1rem' }}>{demand.demandType}</div>
                  </div>
                  
                  <div style={{ textAlign: 'center', background: 'rgba(224, 49, 49, 0.05)', padding: '10px 20px', borderRadius: '15px', border: '1px solid rgba(224, 49, 49, 0.1)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#e03131', fontWeight: 'bold' }}>STATUS</div>
                    <div style={{ fontWeight: '900', color: '#e03131' }}>{demand.status}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setSelectedDemand(demand)} style={{ background: demand.color, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {demand.details ? 'Detail Proyek' : 'Apply Proyek'}
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#888', background: '#f8f9fa', borderRadius: '24px' }}>
                Tidak ada permintaan pasar yang cocok dengan "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* SECTION: WEB3 BOUNTY */}
        <div id="bounty" className="bounty-section">
          <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', opacity: 0.1 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-header-flex" style={{ marginBottom: '50px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px' }}><Target size={28} /></div>
                  <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>Bounty Board</h2>
                </div>
                <p style={{ fontSize: '1.15rem', color: '#aaa', maxWidth: '600px', lineHeight: '1.6' }}>
                  Ekosistem Permissionless. Kerjakan misi, serahkan Proof of Work, dan klaim BMC Anda.
                </p>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '20px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {['New', 'Top', 'Value'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveBountyTab(tab)}
                    style={{ 
                      padding: '10px 24px', borderRadius: '16px', border: 'none', 
                      background: activeBountyTab === tab ? 'white' : 'transparent',
                      color: activeBountyTab === tab ? '#1a1a1a' : '#aaa',
                      fontWeight: 'bold', cursor: 'pointer', transition: '0.2s',
                      flex: 1, minWidth: '80px'
                    }}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredBounties.map((bounty) => (
                <div key={bounty.id} className="bounty-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '32px', borderRadius: '28px', backdropFilter: 'blur(20px)', transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span style={{ color: '#0ca678', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>{bounty.id}</span>
                    <span style={{ color: bounty.difficulty === 'Hard' ? '#ff6b6b' : bounty.difficulty === 'Medium' ? '#fcc419' : '#51cf66', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{bounty.difficulty}</span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '24px', lineHeight: '1.4' }}>{bounty.title}</h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>REWARD</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#ffd43b', fontFamily: 'monospace' }}>{bounty.reward}</div>
                    </div>
                    <button style={{ background: 'white', color: '#1a1a1a', border: 'none', padding: '12px 24px', borderRadius: '16px', fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer' }}>Claim Mission</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MODAL DETAIL DEMAND */}
        {selectedDemand && selectedDemand.details && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 60000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
            <div className="glass animate-scale-in" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', background: 'white', borderRadius: '30px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
              <button onClick={() => setSelectedDemand(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#eee', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', zIndex: 10 }}><X size={24} /></button>
              
              <div style={{ flex: 1, height: window.innerWidth < 768 ? '300px' : 'auto', background: '#f1f3f5', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {selectedDemand.details.images && selectedDemand.details.images.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                    {selectedDemand.details.images.map((img, idx) => (
                      <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                        <img src={img} alt={`Detail ${idx}`} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', cursor: 'zoom-in', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      </a>
                    ))}
                  </div>
                )}
                {selectedDemand.details.pdf && (
                  <div style={{ background: 'white', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px dashed #ccc' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📄</div>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Dokumen Desain Acuan Tersedia</div>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '15px' }}>Silakan unduh untuk melihat detail teknis.</div>
                    <a href={selectedDemand.details.pdf} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: selectedDemand.color, color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      Buka Dokumen PDF
                    </a>
                  </div>
                )}
              </div>

              <div style={{ flex: 1.2, padding: '40px', overflowY: 'auto' }}>
                <div style={{ fontSize: '0.85rem', color: selectedDemand.color, fontWeight: 'bold', marginBottom: '8px' }}>{selectedDemand.demandType}</div>
                <h2 style={{ fontSize: '1.8rem', margin: '0 0 16px 0', lineHeight: 1.3 }}>{selectedDemand.title}</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '24px' }}>
                  <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '15px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 'bold' }}>LOKASI</div>
                    <div style={{ fontWeight: 'bold', color: '#1a1a1a' }}>{selectedDemand.location}</div>
                  </div>
                  <div style={{ background: 'rgba(245, 159, 0, 0.05)', padding: '15px', borderRadius: '15px' }}>
                    <div style={{ fontSize: '0.75rem', color: selectedDemand.color, fontWeight: 'bold' }}>HARGA PENERIMAAN</div>
                    <div style={{ fontWeight: 'bold', color: selectedDemand.color }}>{selectedDemand.details.price}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ marginBottom: '8px' }}>Kebutuhan Bulanan</h4>
                  <p style={{ color: '#666', background: '#f1f3f5', padding: '12px', borderRadius: '10px', fontSize: '0.95rem' }}>{selectedDemand.details.reqs}</p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ marginBottom: '12px' }}>Spesifikasi Teknis</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedDemand.details.specs.map((spec, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', background: 'white', border: '1px solid #eee', padding: '10px 12px', borderRadius: '8px', display: 'flex', gap: '10px' }}>
                        <span style={{ color: selectedDemand.color }}>•</span> {spec}
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => { alert('Mengarahkan ke Chat WA...'); window.open('https://wa.me/628174139994', '_blank'); }} style={{ width: '100%', padding: '16px', borderRadius: '15px', background: selectedDemand.color, color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                  Hubungi Pihak Pengumpul
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 5. FLOATING BAMBUAI ASSISTANT - POSITIONED TO THE LEFT TO AVOID OVERLAP */}
      <div style={{ position: 'fixed', bottom: '30px', left: '30px', zIndex: 11000 }}>
        {!showAiChat ? (
          <button 
            onClick={() => setShowAiChat(true)}
            style={{ 
              width: '70px', height: '70px', borderRadius: '50%', background: 'var(--primary)', color: 'white', 
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(12,166,120,0.4)', transition: 'all 0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <MessageSquare size={30} />
            <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ff6b6b', color: 'white', width: '24px', height: '24px', borderRadius: '50%', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '3px solid #fdfdfd' }}>1</div>
          </button>
        ) : (
          <div style={{ width: '380px', height: '500px', background: 'white', borderRadius: '32px', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideUpChat 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🎋</div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>BambuAI Assistant</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Online • Karir & Peluang</div>
                </div>
              </div>
              <button onClick={() => setShowAiChat(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {aiMessages.map((msg, i) => (
                <div key={i} style={{ 
                  alignSelf: msg.role === 'bot' ? 'flex-start' : 'flex-end',
                  background: msg.role === 'bot' ? '#f1f3f5' : 'var(--primary)',
                  color: msg.role === 'bot' ? '#1a1a1a' : 'white',
                  padding: '12px 16px', borderRadius: '18px', borderBottomLeftRadius: msg.role === 'bot' ? '4px' : '18px',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                  maxWidth: '85%', fontSize: '0.9rem', lineHeight: '1.5'
                }}>
                  {msg.text}
                </div>
              ))}
            </div>

            <div style={{ padding: '20px', borderTop: '1px solid #f1f3f5', display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendAi()}
                placeholder="Tanya tentang karir..." 
                style={{ flex: 1, padding: '12px 18px', borderRadius: '15px', border: '1px solid #eee', background: '#f8f9fa', outline: 'none' }}
              />
              <button onClick={handleSendAi} style={{ background: 'var(--primary)', color: 'white', border: 'none', width: '46px', height: '46px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .careers-page-wrapper {
          padding-top: 150px;
          padding-bottom: 100px;
          min-height: 100vh;
          background: #fdfdfd;
          color: #1a1a1a;
        }
        .activity-ticker {
          background: #1a1a1a;
          color: #0ca678;
          padding: 12px 0;
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
          border-bottom: 1px solid #333;
          margin-bottom: 40px;
        }
        .careers-header-section {
          text-align: center;
          margin-bottom: 60px;
          animation: fadeInUp 0.8s ease-out;
        }
        .careers-main-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 900;
          color: #1a1a1a;
          margin-bottom: 20px;
          line-height: 1.1;
          letter-spacing: -1px;
        }
        .title-underline {
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 100%;
        }
        .careers-main-desc {
          font-size: clamp(1rem, 3vw, 1.25rem);
          color: #666;
          max-width: 800px;
          margin: 30px auto;
          line-height: 1.6;
          padding: 0 15px;
        }
        .live-stats-dashboard {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 40px;
          flex-wrap: wrap;
        }
        .stat-number {
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          font-weight: 900;
          color: var(--primary);
        }
        .stat-label {
          font-size: 0.85rem;
          font-weight: bold;
          color: #999;
          text-transform: uppercase;
        }
        .stat-divider {
          width: 1px;
          background: #eee;
        }
        
        /* Sections */
        .profesional-section {
          background: white;
          border-radius: 40px;
          padding: 60px;
          border: 1px solid #f1f3f5;
          margin-bottom: 80px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.02);
        }
        .bounty-section {
          background: #1a1a1a;
          border-radius: 40px;
          padding: 60px;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .section-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 50px;
          gap: 20px;
          flex-wrap: wrap;
        }
        .section-header-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        /* Job Rows */
        .job-row {
          padding: 30px;
          border: 1px solid #f1f3f5;
          border-radius: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fcfcfc;
          transition: all 0.3s;
          flex-wrap: wrap;
          gap: 20px;
        }
        .job-info-group {
          display: flex;
          gap: 25px;
          align-items: center;
          flex-wrap: wrap;
        }
        .job-icon-container {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .job-actions-group {
          display: flex;
          align-items: center;
          gap: 30px;
          flex-wrap: wrap;
          width: 100%;
          justify-content: flex-start;
        }

        @media (min-width: 768px) {
          .job-actions-group {
            width: auto;
            justify-content: flex-end;
          }
        }

        @media (max-width: 768px) {
          .careers-page-wrapper {
             padding-top: 90px; /* Reduced for mobile navbar */
          }
          .activity-ticker {
             margin-bottom: 20px;
          }
          .live-stats-dashboard {
             gap: 20px;
          }
          .stat-divider {
             display: none;
          }
          .profesional-section, .bounty-section {
             padding: 30px 20px;
             border-radius: 24px;
          }
          .job-row {
             padding: 20px;
             flex-direction: column;
             align-items: flex-start;
          }
          .job-info-group {
             gap: 15px;
          }
          .job-actions-group {
             gap: 15px;
             margin-top: 10px;
             padding-top: 20px;
             border-top: 1px dashed #eee;
          }
          .job-salary {
             text-align: left !important;
          }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slideUpChat {
          from { opacity: 0; transform: translateY(100px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .premium-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(12,166,120,0.1);
          border-color: var(--primary);
        }
        .job-row:hover {
          background: white !important;
          border-color: #333 !important;
          transform: scale(1.01);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .bounty-card:hover {
          background: rgba(255,255,255,0.06) !important;
          border-color: var(--primary) !important;
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default CareersPage;
