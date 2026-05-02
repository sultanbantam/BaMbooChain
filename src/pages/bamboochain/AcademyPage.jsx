import React from 'react';
import { BookOpen, GraduationCap, Award, PlayCircle, Clock, ShieldCheck, DownloadCloud } from 'lucide-react';

const AcademyPage = () => {
  // Mock Data untuk Kursus
  const courses = [
    { 
      id: 1, 
      title: "Masterclass: Budidaya Bambu Tepat Guna", 
      category: "Pertanian", 
      modules: 12, 
      duration: "4.5 Jam", 
      students: 1250, 
      img: "https://images.unsplash.com/photo-1542450530-5bfa5dfef006?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 2, 
      title: "Sertifikasi Konstruksi Bambu Modular (BamBu 5.0)", 
      category: "Arsitektur", 
      modules: 8, 
      duration: "6 Jam", 
      students: 840, 
      img: "https://images.unsplash.com/photo-1596417937554-6eabaac17196?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 3, 
      title: "Blockchain Bamboo: Tokenomics & Ekologi Web3", 
      category: "Teknologi", 
      modules: 15, 
      duration: "8 Jam", 
      students: 2100, 
      img: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    }
  ];

  return (
    <div style={{ paddingTop: '130px', paddingBottom: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
      
      {/* HEADER SECTION */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(245, 159, 0, 0.1)', padding: '16px', borderRadius: '50%', color: '#f59f00' }}>
            <GraduationCap size={40} />
          </div>
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-0.5px' }}>
          Akademi bambuNUSA Nusantara
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Belajar, Berkarya, Berdaya. Tingkatkan kapasitas diri melalui perpustakaan ilmu pengetahuan terpadu dari pakar bambu dan ahli teknologi terkemuka.
        </p>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
        
        {/* COURSES SECTION */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={28} color="var(--primary)" /> Katalog Kurikulum
              </h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Akses semua kelas secara gratis dengan status keanggotaan bambuNUSA Anda.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
            {courses.map((course) => (
              <div key={course.id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', cursor: 'pointer' }}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                
                <div style={{ height: '200px', position: 'relative' }}>
                  <img src={course.img} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'white', color: 'var(--primary)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {course.category}
                  </div>
                  {/* Play Button Overlay */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: '12px', color: 'var(--primary)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PlayCircle size={32} />
                  </div>
                </div>
                
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 16px 0', lineHeight: '1.4' }}>{course.title}</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <Clock size={16} color="var(--primary)" /> {course.duration}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <BookOpen size={16} color="var(--primary)" /> {course.modules} Modul
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                      {course.students.toLocaleString()} Murid Terdaftar
                    </div>
                    <button style={{ background: '#e6fcf5', color: 'var(--primary)', border: 'none', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>
                      Mulai Belajar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CERTIFICATION SECTION */}
        <div style={{ background: 'linear-gradient(135deg, #1b5e20, var(--primary))', borderRadius: '24px', padding: '40px', color: 'white', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px', boxShadow: '0 15px 40px rgba(12,166,120,0.2)', position: 'relative', overflow: 'hidden' }}>
          
          {/* Abstract background shapes */}
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', color: 'rgba(255,255,255,0.05)' }}>
            <Award size={250} />
          </div>

          <div style={{ flex: '1 1 400px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <ShieldCheck size={32} color="#fcc419" />
              <h2 style={{ fontSize: '2rem', color: 'white', margin: 0 }}>Sertifikat Blockchain</h2>
            </div>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', marginBottom: '24px', lineHeight: '1.6' }}>
              Tiap kelulusan kursus Anda di Akademi akan dianugerahi **Sertifikat NFT (Non-Fungible Token)**. Ini merupakan gelar digital kekal yang tak dapat dipalsukan, tertanam permanen di Blockchain cerdas sebagai bukti keahlian hijau Anda.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button style={{ background: 'white', color: 'var(--primary)', padding: '14px 28px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <Award size={20} /> Lihat Etalase Sertifikat
              </button>
              <button style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '14px 28px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DownloadCloud size={20} /> Verifikasi NFT
              </button>
            </div>
          </div>

          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            {/* Visualisasi Mockup Sertifikat NFT */}
            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '350px', transform: 'rotate(2deg)', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
              <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '16px', marginBottom: '16px' }}>
                <Award size={48} color="#fcc419" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.8)' }}>Official Certification</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '8px' }}>Sabumi Green Scholar</div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Diberikan kepada:</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', fontFamily: 'monospace' }}>0x82fA...91Cc</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Keahlian Tercetak:</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>Master Budidaya Bambu</div>
              </div>
              <div style={{ marginTop: '20px', pt: '12px', borderTop: '1px dashed rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                <span>ID: #BMB-A491</span>
                <span>On-Chain Verified ✅</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AcademyPage;
