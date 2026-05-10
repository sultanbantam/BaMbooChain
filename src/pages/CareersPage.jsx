import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  Leaf,
  MapPin,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  Target,
  X,
  Zap,
} from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

const jobOpenings = [
  {
    id: 'JOB-001',
    title: 'Senior Smart Contract Developer',
    department: 'Web3 Engineering',
    location: 'Remote / Jakarta',
    type: 'Full-time',
    salary: 'IDR 30M - 50M',
    findersFee: '500 BMC',
    icon: Zap,
    color: '#f59f00',
  },
  {
    id: 'JOB-002',
    title: 'Ahli Agronomi Spesialis Bambu',
    department: 'Plantation & R&D',
    location: 'Kasepuhan Cibarani, Banten',
    type: 'Full-time',
    salary: 'IDR 15M - 25M',
    findersFee: '200 BMC',
    icon: Leaf,
    color: '#0ca678',
  },
  {
    id: 'JOB-003',
    title: 'Legal & Compliance Web3',
    department: 'Legal & Operations',
    location: 'Tangerang Selatan',
    type: 'Full-time',
    salary: 'IDR 20M - 35M',
    findersFee: '300 BMC',
    icon: ShieldCheck,
    color: '#3b82f6',
  },
];

const bounties = [
  { id: 'BTY-01', title: 'Terjemahkan Whitepaper ke Bahasa Jepang', reward: '500 BMC', difficulty: 'Medium', tag: 'Translation', category: 'New', value: 500 },
  { id: 'BTY-02', title: 'Desain Infografis Ekosistem bambuNUSA', reward: '250 BMC', difficulty: 'Easy', tag: 'Design', category: 'Top', value: 250 },
  { id: 'BTY-03', title: 'Audit Kontrak Cerdas Vesting V2', reward: '2,000 BMC', difficulty: 'Hard', tag: 'Security', category: 'Value', value: 2000 },
  { id: 'BTY-04', title: 'Tulis Artikel Medium tentang Skema Karbon', reward: '150 BMC', difficulty: 'Easy', tag: 'Content', category: 'New', value: 150 },
];

const demandProjects = [
  {
    id: 'DMD-001',
    title: 'Pembangunan Villa Bambu Ekologis 10 Unit',
    location: 'Ubud, Bali',
    demandType: 'Konstruksi & Arsitektur',
    funding: 'Terkonfirmasi (150K USDT)',
    status: 'Mencari Tim Pelaksana',
    color: '#e03131',
  },
  {
    id: 'DMD-002',
    title: 'Pengadaan 50,000 Bibit Bambu Betung',
    location: 'Jawa Barat',
    demandType: 'Suplai Material',
    funding: 'Terkonfirmasi (PO Aktif)',
    status: 'Mencari Petani/Koperasi',
    color: '#0ca678',
  },
  {
    id: 'DMD-003',
    title: 'Suplai Bambu untuk Rangka Layangan ke India',
    location: 'Pengumpulan (WA: 08174139994)',
    demandType: 'Ekspor Material',
    funding: 'PO Aktif ($2.8 / Bundle)',
    status: 'Mencari Suplier',
    color: '#f59f00',
    details: {
      reqs: '1 sampai 2 kontainer 20ft / 40ft per bulan, sekitar 1000-1100 bundle.',
      price: '$2.8 / bundle, harga terima di lokasi pengumpulan.',
      specs: [
        'Ukuran 40 inci (102 cm): 10 belahan, tanpa simpul',
        'Ukuran 34 inci (86-87 cm): 10 belahan, tanpa simpul',
        'Ukuran 36 inci (92 cm): 10 belahan, tanpa simpul',
        'Ketebalan 8-10 mm dan diameter 9 cm untuk setiap belahan',
        'Kering, treatment anti hama, kadar air 8-14%',
        'Packaging diikat tali bambu, 1 bundle = 100 bilah / 50 batang',
      ],
      images: ['bl.jpeg', 'bl1.jpeg', 'bl3.jpeg', 'bl4.jpeg', 'bl5.jpeg', 'bl6.jpeg', 'bl7.jpeg', 'bl8.jpeg', 'bl9.jpeg'].map((name) =>
        getAssetUrl(`gambar/demandmarket/${name}`),
      ),
    },
  },
  {
    id: 'DMD-004',
    title: 'Rumah Modular Bambu 4m x 6m',
    location: 'Workshop (WA: 08174139994)',
    demandType: 'Konstruksi & Arsitektur',
    funding: 'Rp 70.000.000 / Unit',
    status: 'Mencari Vendor',
    color: '#e03131',
    details: {
      reqs: 'Kebutuhan saat ini: 1 unit rumah modular.',
      price: 'Rp 70.000.000, harga jadi di lokasi workshop/pabrik vendor.',
      specs: [
        'Bahan bambu laminasi dari berbagai jenis bambu',
        'Ukuran bangunan 4 meter x 6 meter',
        'Desain mengikuti gambar acuan terlampir',
        'Vendor boleh mengajukan desain alternatif yang lebih efisien',
      ],
      pdf: getAssetUrl('gambar/demandmarket/rumahmodular/rmb.pdf'),
    },
  },
  {
    id: 'DMD-005',
    title: 'Komponen Huntap RISHAM T36 (6.000 Unit)',
    location: 'Sumatera Barat & Aceh (WA: 08174139994)',
    demandType: 'Manufaktur Massal',
    funding: 'Mega Proyek (Terkonfirmasi)',
    status: 'Mencari Suplier Pabrikasi',
    color: '#3b82f6',
    details: {
      reqs: 'Bertahap: 1 unit sample, 250 unit rumah contoh, lalu 5.750 unit pembangunan massal.',
      price: 'Dinding Rp 270.000/m2, kusen pintu jendela Rp 3.500.000/set.',
      specs: [
        'Hunian Tetap RISHAM Type 36 untuk korban bencana alam',
        'Komponen: dinding, kusen, pintu, dan jendela',
        'Material bambu laminasi dari berbagai jenis bambu',
        'Desain acuan tersedia dalam PDF',
        'Alternatif desain yang lebih efisien dapat diajukan',
      ],
      pdf: getAssetUrl('gambar/demandmarket/risham/risham.pdf'),
    },
  },
];

const tickerItems = [
  'User @mukoddas menerima 500 BMC untuk audit kontrak',
  "Posisi 'Smart Contract Dev' memiliki pendaftar baru dari 5 negara",
  'Total payout bounty bulan ini mencapai 12,500 BMC',
  'Koperasi Tani Cibarani membuka 10 slot mitra lapangan',
  'Pendaftaran magang batch Mei 2026 kini dibuka',
];

const CareersPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [bountyFilter, setBountyFilter] = useState('New');
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Halo. Saya BambuAI. Ada yang bisa saya bantu terkait karir atau peluang proyek?' },
  ]);

  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return jobOpenings.filter((job) => [job.title, job.location, job.department].join(' ').toLowerCase().includes(query));
  }, [searchQuery]);

  const filteredDemand = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return demandProjects.filter((demand) => [demand.title, demand.location, demand.demandType].join(' ').toLowerCase().includes(query));
  }, [searchQuery]);

  const filteredBounties = bounties.filter((bounty) => {
    if (bountyFilter === 'Top') return bounty.category === 'Top' || bounty.category === 'Value';
    if (bountyFilter === 'Value') return bounty.value >= 500;
    return bounty.category === 'New' || bounty.category === 'Top';
  });

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const userMessage = { role: 'user', text: chatInput.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Terima kasih. Untuk peluang ini, siapkan portofolio, lokasi, kapasitas produksi, dan kontak WhatsApp aktif.' },
      ]);
    }, 700);
  };

  const opportunityCards = [
    { id: 'profesional', title: 'Tim Profesional', icon: Briefcase, color: '#3b82f6', desc: 'Bergabung sebagai tim inti di rekayasa Web3, agronomi, atau legalitas.', action: 'Lihat Posisi', link: '#profesional' },
    { id: 'mitra', title: 'Mitra Lapangan', icon: Leaf, color: 'var(--primary)', desc: 'Menjadi petani pengelola lahan atau validator data lapangan.', action: 'Daftar Mitra', link: '/bambunusa/join-farmer' },
    { id: 'akademik', title: 'Riset & Magang', icon: GraduationCap, color: '#845ef7', desc: 'Jalur riset skripsi/tesis untuk mahasiswa tingkat akhir dan kampus mitra.', action: 'Info Program', link: '#akademik' },
    { id: 'bounty', title: 'Web3 Bounties', icon: Target, color: '#f59f00', desc: 'Kerjakan misi lepas dari mana saja dan dapatkan reward token BMC.', action: 'Lihat Misi', link: '#bounty' },
  ];

  const goToOpportunity = (link) => {
    if (link.startsWith('#')) {
      document.getElementById(link.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    navigate(link);
  };

  const JobRow = ({ item }) => {
    const Icon = item.icon || Target;
    return (
      <div className="career-row">
        <div className="career-row-info">
          <div className="career-row-icon" style={{ background: `${item.color}15`, color: item.color }}>
            <Icon size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#1a1a1a' }}>{item.title}</h3>
              <span style={{ fontSize: '0.72rem', color: '#868e96', fontFamily: 'monospace' }}>#{item.id}</span>
            </div>
            <div style={{ display: 'flex', gap: '15px', color: '#666', fontSize: '0.88rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><MapPin size={15} /> {item.location}</span>
              {item.type && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Clock size={15} /> {item.type}</span>}
              {item.funding && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0ca678', fontWeight: 700 }}><CheckCircle size={15} /> {item.funding}</span>}
            </div>
          </div>
        </div>
        <div className="career-row-actions">
          <div className="career-row-meta">
            <div style={{ fontSize: '0.72rem', color: '#868e96', fontWeight: 700, textTransform: 'uppercase' }}>{item.demandType ? 'Kategori' : 'Kompensasi'}</div>
            <div style={{ fontWeight: 800, color: '#1a1a1a' }}>{item.demandType || item.salary}</div>
          </div>
          <div className="career-row-badge" style={{ color: item.color, background: `${item.color}12`, borderColor: `${item.color}30` }}>
            {item.status || item.findersFee}
          </div>
          <button
            onClick={() => (item.details ? setSelectedDemand(item) : undefined)}
            style={{ background: item.color || '#1a1a1a', color: 'white', border: 'none', padding: '12px 18px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            {item.details ? 'Detail Proyek' : 'Lamar'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="careers-page">
      <div className="activity-ticker">
        <div style={{ display: 'inline-block', animation: 'careerTicker 30s linear infinite' }}>
          {tickerItems.concat(tickerItems).map((item, index) => (
            <span key={`${item}-${index}`} style={{ margin: '0 40px', fontSize: '0.85rem', fontWeight: 800, fontFamily: 'monospace' }}>
              <CheckCircle size={14} style={{ display: 'inline', marginBottom: '-2px', marginRight: '8px' }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="container">
        <header className="careers-header">
          <div className="careers-kicker">
            <Briefcase size={18} /> Karir & Peluang Terbuka
          </div>
          <h1 className="careers-title">Bangun Masa Depan <span style={{ color: 'var(--primary)' }}>Desentralisasi Hijau</span></h1>
          <p className="careers-desc">
            Bergabunglah dengan ekosistem yang menggabungkan ekonomi riil, restorasi ekologi, dan transparansi Web3.
          </p>
          <div className="careers-stats">
            {[
              ['24', 'Active Jobs'],
              ['1,250+', 'Contributors'],
              ['450k', 'BMC Payouts'],
            ].map(([value, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div className="stat-number">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </header>

        <section className="opportunity-grid">
          {opportunityCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.id} className="opportunity-card">
                <div style={{ background: `${card.color}12`, width: '60px', height: '60px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', color: card.color }}>
                  <Icon size={30} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#1a1a1a' }}>{card.title}</h3>
                <p style={{ color: '#666', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '24px' }}>{card.desc}</p>
                <button onClick={() => goToOpportunity(card.link)} style={{ background: card.color, color: 'white', border: 'none', padding: '12px 18px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  {card.action} <ArrowRight size={16} />
                </button>
              </article>
            );
          })}
        </section>

        <section id="profesional" className="career-section">
          <div className="section-header">
            <div>
              <h2>Open Positions</h2>
              <p>Bergabunglah membangun fondasi ekosistem triliunan rupiah.</p>
            </div>
            <div className="section-chip"><CheckCircle size={16} /> Community Hires</div>
          </div>
          <div className="career-search">
            <Search size={20} />
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Cari pekerjaan atau proyek..." />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredJobs.length ? filteredJobs.map((job) => <JobRow key={job.id} item={job} />) : <div className="empty-state">Tidak ada lowongan yang cocok dengan pencarian.</div>}
          </div>
        </section>

        <section id="demand" className="career-section demand-section">
          <div className="section-header">
            <div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Target size={30} color="#e03131" /> Demand Market</h2>
              <p>Peluang proyek yang sudah memiliki konfirmasi pendanaan atau PO aktif.</p>
            </div>
            <div className="section-chip danger">High Priority</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredDemand.length ? filteredDemand.map((demand) => <JobRow key={demand.id} item={{ ...demand, icon: Target }} />) : <div className="empty-state">Tidak ada permintaan pasar yang cocok dengan pencarian.</div>}
          </div>
        </section>

        <section id="bounty" className="bounty-section">
          <div className="section-header" style={{ color: 'white' }}>
            <div>
              <h2>Bounty Board</h2>
              <p style={{ color: '#adb5bd' }}>Ekosistem permissionless. Kerjakan misi, serahkan proof of work, dan klaim BMC.</p>
            </div>
            <div className="bounty-tabs">
              {['New', 'Top', 'Value'].map((filter) => (
                <button key={filter} onClick={() => setBountyFilter(filter)} className={bountyFilter === filter ? 'active' : ''}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="bounty-grid">
            {filteredBounties.map((bounty) => (
              <article key={bounty.id} className="bounty-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <span style={{ color: '#0ca678', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 800 }}>{bounty.id}</span>
                  <span className={`difficulty ${bounty.difficulty.toLowerCase()}`}>{bounty.difficulty}</span>
                </div>
                <h3>{bounty.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#868e96', fontWeight: 800 }}>REWARD</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffd43b', fontFamily: 'monospace' }}>{bounty.reward}</div>
                  </div>
                  <button>Claim Mission</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {selectedDemand?.details && (
        <div className="demand-modal" role="dialog" aria-modal="true">
          <div className="demand-modal-card">
            <button className="modal-close" onClick={() => setSelectedDemand(null)} aria-label="Tutup detail proyek"><X size={22} /></button>
            <div className="modal-media">
              {selectedDemand.details.images?.length ? (
                <div className="modal-gallery">
                  {selectedDemand.details.images.map((image, index) => (
                    <a href={image} target="_blank" rel="noreferrer" key={image}>
                      <img src={image} alt={`Detail ${index + 1}`} />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="pdf-panel">
                  <FileText size={42} />
                  <strong>Dokumen Desain Acuan Tersedia</strong>
                  <span>Silakan unduh untuk melihat detail teknis.</span>
                  <a href={selectedDemand.details.pdf} target="_blank" rel="noreferrer">Buka Dokumen PDF</a>
                </div>
              )}
            </div>
            <div className="modal-content">
              <div style={{ fontSize: '0.85rem', color: selectedDemand.color, fontWeight: 800, marginBottom: '8px' }}>{selectedDemand.demandType}</div>
              <h2>{selectedDemand.title}</h2>
              <div className="modal-facts">
                <div><span>Lokasi</span><strong>{selectedDemand.location}</strong></div>
                <div><span>Harga Penerimaan</span><strong style={{ color: selectedDemand.color }}>{selectedDemand.details.price}</strong></div>
              </div>
              <h4>Kebutuhan Bulanan</h4>
              <p>{selectedDemand.details.reqs}</p>
              <h4>Spesifikasi Teknis</h4>
              <div className="spec-list">
                {selectedDemand.details.specs.map((spec) => <div key={spec}><span style={{ color: selectedDemand.color }}>-</span> {spec}</div>)}
              </div>
              <button onClick={() => window.open('https://wa.me/628174139994', '_blank')} style={{ background: selectedDemand.color }}>
                Hubungi Pihak Pengumpul
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="career-chat">
        {isChatOpen ? (
          <div className="chat-panel">
            <div className="chat-head">
              <div><strong>BambuAI Assistant</strong><span>Online - Karir & Peluang</span></div>
              <button onClick={() => setIsChatOpen(false)}><X size={18} /></button>
            </div>
            <div className="chat-body">
              {messages.map((message, index) => (
                <div key={`${message.text}-${index}`} className={message.role === 'bot' ? 'bot' : 'user'}>{message.text}</div>
              ))}
            </div>
            <div className="chat-input">
              <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendMessage()} placeholder="Tanya tentang karir..." />
              <button onClick={sendMessage}><Send size={18} /></button>
            </div>
          </div>
        ) : (
          <button className="chat-fab" onClick={() => setIsChatOpen(true)} aria-label="Buka chat karir">
            <MessageCircle size={30} />
            <span>1</span>
          </button>
        )}
      </div>

      <style>{`
        .careers-page {
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
        .careers-header {
          text-align: center;
          margin-bottom: 55px;
        }
        .careers-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(12, 166, 120, 0.1);
          color: var(--primary);
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 800;
          margin-bottom: 22px;
        }
        .careers-title {
          font-size: clamp(2.3rem, 6vw, 4rem);
          font-weight: 900;
          color: #1a1a1a;
          margin-bottom: 18px;
          line-height: 1.08;
        }
        .careers-desc {
          font-size: clamp(1rem, 3vw, 1.2rem);
          color: #666;
          max-width: 780px;
          margin: 0 auto 34px;
          line-height: 1.6;
        }
        .careers-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 34px;
          flex-wrap: wrap;
        }
        .stat-number {
          font-size: clamp(1.8rem, 5vw, 2.4rem);
          font-weight: 900;
          color: var(--primary);
        }
        .stat-label {
          font-size: 0.82rem;
          font-weight: 800;
          color: #868e96;
          text-transform: uppercase;
        }
        .opportunity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 22px;
          margin-bottom: 70px;
        }
        .opportunity-card,
        .career-section {
          background: white;
          border: 1px solid #f1f3f5;
          border-radius: 8px;
          box-shadow: 0 14px 34px rgba(0,0,0,0.03);
        }
        .opportunity-card {
          padding: 30px;
          transition: all 0.25s;
        }
        .opportunity-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
        }
        .career-section {
          padding: 42px;
          margin-bottom: 58px;
        }
        .demand-section {
          background: #fffefe;
          border-color: rgba(224, 49, 49, 0.18);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 30px;
          gap: 20px;
          flex-wrap: wrap;
        }
        .section-header h2 {
          font-size: clamp(1.8rem, 4vw, 2.4rem);
          font-weight: 900;
          color: #1a1a1a;
          margin: 0 0 10px;
        }
        .section-header p {
          margin: 0;
          color: #666;
          font-size: 1.02rem;
        }
        .section-chip {
          background: rgba(12, 166, 120, 0.1);
          color: var(--primary);
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .section-chip.danger {
          background: rgba(224, 49, 49, 0.1);
          color: #e03131;
        }
        .career-search {
          position: relative;
          margin-bottom: 24px;
        }
        .career-search svg {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #adb5bd;
        }
        .career-search input {
          width: 100%;
          padding: 15px 18px 15px 48px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          font-size: 1rem;
          box-sizing: border-box;
          outline: none;
        }
        .career-row {
          padding: 24px;
          border: 1px solid #f1f3f5;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fcfcfc;
          gap: 20px;
          flex-wrap: wrap;
        }
        .career-row:hover {
          background: white;
          border-color: #ced4da;
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
        }
        .career-row-info {
          display: flex;
          gap: 18px;
          align-items: center;
          flex: 1;
          min-width: 260px;
        }
        .career-row-icon {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .career-row-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .career-row-meta {
          min-width: 120px;
          text-align: right;
        }
        .career-row-badge {
          text-align: center;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid;
          font-weight: 800;
          font-size: 0.84rem;
        }
        .empty-state {
          padding: 34px;
          text-align: center;
          color: #868e96;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .bounty-section {
          background: #1a1a1a;
          border-radius: 8px;
          padding: 42px;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .bounty-tabs {
          background: rgba(255,255,255,0.06);
          padding: 6px;
          border-radius: 8px;
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .bounty-tabs button {
          padding: 10px 18px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #adb5bd;
          font-weight: 800;
          cursor: pointer;
        }
        .bounty-tabs button.active {
          background: white;
          color: #1a1a1a;
        }
        .bounty-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .bounty-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 26px;
          border-radius: 8px;
          transition: all 0.25s;
        }
        .bounty-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: var(--primary);
        }
        .bounty-card h3 {
          font-size: 1.12rem;
          font-weight: 800;
          margin-bottom: 22px;
          line-height: 1.45;
        }
        .bounty-card button {
          background: white;
          color: #1a1a1a;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 900;
          cursor: pointer;
        }
        .difficulty {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
        }
        .difficulty.hard { color: #ff6b6b; }
        .difficulty.medium { color: #fcc419; }
        .difficulty.easy { color: #51cf66; }
        .demand-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.84);
          z-index: 60000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(5px);
        }
        .demand-modal-card {
          width: 100%;
          max-width: 920px;
          max-height: 90vh;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          display: flex;
        }
        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #f1f3f5;
          border: none;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          z-index: 2;
        }
        .modal-media {
          flex: 1;
          background: #f1f3f5;
          padding: 18px;
          overflow-y: auto;
        }
        .modal-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 10px;
        }
        .modal-gallery img {
          width: 100%;
          height: 140px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .pdf-panel {
          min-height: 280px;
          background: white;
          border: 1px dashed #ced4da;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
          color: #495057;
          padding: 22px;
        }
        .pdf-panel a {
          background: #1a1a1a;
          color: white;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 800;
          text-decoration: none;
        }
        .modal-content {
          flex: 1.25;
          padding: 38px;
          overflow-y: auto;
        }
        .modal-content h2 {
          font-size: 1.7rem;
          line-height: 1.3;
          margin: 0 0 18px;
        }
        .modal-facts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 22px;
        }
        .modal-facts div {
          background: #f8f9fa;
          padding: 14px;
          border-radius: 8px;
        }
        .modal-facts span {
          display: block;
          font-size: 0.75rem;
          color: #868e96;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .modal-content p {
          color: #666;
          background: #f8f9fa;
          padding: 12px;
          border-radius: 8px;
          line-height: 1.6;
        }
        .spec-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }
        .spec-list div {
          font-size: 0.9rem;
          background: white;
          border: 1px solid #eee;
          padding: 10px 12px;
          border-radius: 8px;
        }
        .modal-content > button {
          width: 100%;
          padding: 14px;
          border-radius: 8px;
          color: white;
          border: none;
          font-weight: 900;
          cursor: pointer;
        }
        .career-chat {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 11000;
        }
        .chat-fab {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(12,166,120,0.32);
          position: relative;
        }
        .chat-fab span {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ff6b6b;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          border: 2px solid #fdfdfd;
        }
        .chat-panel {
          width: min(380px, calc(100vw - 40px));
          height: 480px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.16);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .chat-head {
          background: var(--primary);
          color: white;
          padding: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chat-head span {
          display: block;
          font-size: 0.72rem;
          opacity: 0.85;
          margin-top: 4px;
        }
        .chat-head button {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
        }
        .chat-body {
          flex: 1;
          padding: 18px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chat-body .bot,
        .chat-body .user {
          padding: 11px 14px;
          border-radius: 8px;
          max-width: 86%;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .chat-body .bot {
          align-self: flex-start;
          background: #f1f3f5;
          color: #1a1a1a;
        }
        .chat-body .user {
          align-self: flex-end;
          background: var(--primary);
          color: white;
        }
        .chat-input {
          padding: 16px;
          border-top: 1px solid #f1f3f5;
          display: flex;
          gap: 10px;
        }
        .chat-input input {
          flex: 1;
          padding: 11px 14px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          outline: none;
        }
        .chat-input button {
          background: var(--primary);
          color: white;
          border: none;
          width: 42px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        @keyframes careerTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          .careers-page { padding-top: 82px; }
          .career-section, .bounty-section { padding: 24px 18px; }
          .career-row { align-items: flex-start; }
          .career-row-actions { width: 100%; justify-content: flex-start; padding-top: 16px; border-top: 1px dashed #e9ecef; }
          .career-row-meta { text-align: left; }
          .demand-modal-card { flex-direction: column; }
          .modal-media { max-height: 280px; }
          .modal-content { padding: 24px; }
          .modal-facts { grid-template-columns: 1fr; }
          .career-chat { left: 18px; bottom: 18px; }
        }
      `}</style>
    </div>
  );
};

export default CareersPage;
