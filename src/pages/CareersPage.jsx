import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Leaf, GraduationCap, Target, ArrowRight, Zap, MapPin, Clock, Coins, ChevronRight } from 'lucide-react';

const CareersPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const jobOpenings = [
    {
      title: "Senior Smart Contract Developer",
      department: "Web3 Engineering",
      location: "Remote / Jakarta",
      type: "Full-time",
      salary: "IDR 30M - 50M / month",
      icon: <Zap size={24} color="#f59f00" />,
      color: "#f59f00"
    },
    {
      title: "Ahli Agronomi Spesialis Bambu",
      department: "Plantation & R&D",
      location: "Kasepuhan Cibarani, Banten",
      type: "Full-time",
      salary: "IDR 15M - 25M / month",
      icon: <Leaf size={24} color="#0ca678" />,
      color: "#0ca678"
    },
    {
      title: "Legal & Compliance Web3",
      department: "Legal & Operations",
      location: "Tangerang Selatan",
      type: "Full-time",
      salary: "IDR 20M - 35M / month",
      icon: <Briefcase size={24} color="#3b82f6" />,
      color: "#3b82f6"
    }
  ];

  const bounties = [
    { title: "Terjemahkan Whitepaper ke Bahasa Jepang", reward: "500 BMC", difficulty: "Medium", tag: "Translation" },
    { title: "Desain Infografis Ekosistem bambuNUSA", reward: "250 BMC", difficulty: "Easy", tag: "Design" },
    { title: "Audit Kontrak Cerdas Vesting V2", reward: "2,000 BMC", difficulty: "Hard", tag: "Security" },
    { title: "Tulis Artikel Medium tentang Skema Karbon", reward: "150 BMC", difficulty: "Easy", tag: "Content" }
  ];

  return (
    <div style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container">
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '80px', animation: isVisible ? 'fadeInUp 0.8s ease-out' : 'none' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '24px' }}>
            <Briefcase size={18} /> Karir & Peluang Terbuka
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '20px', lineHeight: '1.1', letterSpacing: '-1px' }}>
            Bangun Masa Depan <span style={{ color: 'var(--primary)' }}>Desentralisasi Hijau</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            Lebih dari sekadar karir biasa. Bergabunglah dengan konsorsium global yang menggabungkan ekonomi riil, restorasi ekologi, dan transparansi Web3.
          </p>
        </div>

        {/* 4 PILAR PELUANG (CARDS) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '80px' }}>
          
          <div className="hover-card" style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #e9ecef', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#3b82f6' }}></div>
            <Briefcase size={40} color="#3b82f6" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-main)' }}>Tim Profesional</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>Bergabung sebagai tim inti (Full-time) di bidang rekayasa Web3, Agronomi, atau Legalitas.</p>
            <a href="#profesional" style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Lihat Posisi <ArrowRight size={16} /></a>
          </div>

          <div className="hover-card" style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #e9ecef', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary)' }}></div>
            <Leaf size={40} color="var(--primary)" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-main)' }}>Mitra Lapangan</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>Menjadi Petani pengelola lahan atau Validator data di lapangan.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => navigate('/bambunusa/join-farmer')} style={{ background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'left' }}>Daftar Petani</button>
              <button onClick={() => navigate('/bambunusa/join-validator')} style={{ background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'left' }}>Daftar Validator</button>
            </div>
          </div>

          <div className="hover-card" style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #e9ecef', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#845ef7' }}></div>
            <GraduationCap size={40} color="#845ef7" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-main)' }}>Riset & Magang</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>Jalur riset skripsi/tesis khusus mahasiswa tingkat akhir dari UI, ITB, IPB, dan kampus mitra.</p>
            <a href="#akademik" style={{ color: '#845ef7', fontWeight: 'bold', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Info Program <ArrowRight size={16} /></a>
          </div>

          <div className="hover-card" style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #e9ecef', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#f59f00' }}></div>
            <Target size={40} color="#f59f00" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-main)' }}>Web3 Bounties</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>Kerjakan misi lepas dari mana saja di seluruh dunia dan dapatkan reward dalam token BMC.</p>
            <a href="#bounty" style={{ color: '#f59f00', fontWeight: 'bold', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Lihat Misi <ArrowRight size={16} /></a>
          </div>

        </div>

        {/* SECTION: PROFESIONAL */}
        <div id="profesional" style={{ background: 'white', borderRadius: '32px', padding: '50px', border: '1px solid #e9ecef', marginBottom: '60px', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '8px' }}>Open Positions (Core Team)</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Bergabunglah membangun fondasi ekosistem triliunan rupiah.</p>
            </div>
            <button style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid #ced4da', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>Lihat Semua Departemen</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {jobOpenings.map((job, idx) => (
              <div key={idx} style={{ padding: '24px', border: '1px solid #f1f3f5', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', transition: '0.2s', cursor: 'pointer' }}
                   onMouseEnter={(e) => { e.currentTarget.style.border = `1px solid ${job.color}`; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.border = '1px solid #f1f3f5'; e.currentTarget.style.background = '#f8f9fa'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${job.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {job.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '4px' }}>{job.title}</h3>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {job.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {job.type}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimasi Kompensasi</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{job.salary}</div>
                  </div>
                  <button style={{ background: 'var(--text-main)', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: WEB3 BOUNTY */}
        <div id="bounty" style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #0ca678 100%)', borderRadius: '32px', padding: '50px', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.1, transform: 'rotate(15deg)' }}>
            <Coins size={300} />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}><Target size={24} /></div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>Web3 Bounty Board</h2>
            </div>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', marginBottom: '40px', lineHeight: '1.6' }}>
              Berkontribusilah secara mandiri (Permissionless). Selesaikan tugas, serahkan bukti kerja (Proof of Work), dan klaim hadiah Token BMC Anda langsung ke *wallet* kripto.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {bounties.map((bounty, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '24px', borderRadius: '20px', backdropFilter: 'blur(10px)', transition: 'transform 0.2s', cursor: 'pointer' }}
                     onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                     onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>{bounty.tag}</span>
                    <span style={{ color: bounty.difficulty === 'Hard' ? '#ffc9c9' : bounty.difficulty === 'Medium' ? '#ffe066' : '#d3f9d8', fontSize: '0.75rem', fontWeight: 'bold' }}>{bounty.difficulty}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.4' }}>{bounty.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Reward (Hadiah)</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffd43b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Coins size={16} /> {bounty.reward}
                      </div>
                    </div>
                    <button style={{ background: 'white', color: 'var(--primary)', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Ambil Misi</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '12px 30px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
                Jelajahi Semua Bounty (GitHub Integration)
              </button>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
};

export default CareersPage;
