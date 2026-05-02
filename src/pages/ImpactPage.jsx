import React, { useState, useEffect } from 'react';
import { Leaf, Users, MapPin, Globe, ShieldCheck, Droplet, Mountain, CheckCircle, ArrowRight, Activity, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

const ImpactPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const metrics = [
    { id: 1, value: '1.2M+', label: 'Rumpun Bambu Ditanam', icon: <Sprout size={32} /> },
    { id: 2, value: '85,000', label: 'Ton CO2e Terserap', icon: <Leaf size={32} /> },
    { id: 3, value: '490 Ha', label: 'Lahan Konsesi Hijau', icon: <MapPin size={32} /> },
    { id: 4, value: '1,250+', label: 'Keluarga Petani Diberdayakan', icon: <Users size={32} /> }
  ];

  const sdgs = [
    { id: 1, num: '1', title: 'No Poverty', color: '#e5243b' },
    { id: 8, num: '8', title: 'Decent Work & Economic Growth', color: '#a21942' },
    { id: 13, num: '13', title: 'Climate Action', color: '#3f7e44' },
    { id: 15, num: '15', title: 'Life on Land', color: '#56c02b' }
  ];

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* HERO SECTION */}
      <div style={{ 
        paddingTop: '180px', 
        paddingBottom: '100px', 
        background: 'linear-gradient(135deg, #0c5936 0%, #0ca678 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Background Elements */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.1, transform: 'rotate(15deg)' }}>
          <Leaf size={400} />
        </div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1, animation: isVisible ? 'fadeInUp 0.8s ease-out' : 'none' }}>
          <div style={{ maxWidth: '800px', marginBottom: '60px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '24px' }}>
              <Globe size={18} /> Laporan Dampak ESG 2026
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '24px', lineHeight: '1.2' }}>Jejak Hijau Kami untuk Masa Depan Bumi.</h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: '1.6' }}>
              Yayasan Sabumi Nusantara Jaya (YSNJ) memadukan teknologi Web3 dengan konservasi alam untuk menciptakan dampak yang transparan, terukur, dan berkelanjutan bagi peradaban.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {metrics.map((m) => (
              <div key={m.id} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '32px 24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ color: '#ffec99', marginBottom: '16px' }}>{m.icon}</div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>{m.value}</h2>
                <div style={{ opacity: 0.9, fontSize: '1rem' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 2 }}>
        
        {/* WEB3 TRANSPARENCY WIDGET */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', marginBottom: '80px', animation: isVisible ? 'slideIn 0.8s 0.2s both' : 'none' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)', marginBottom: '16px' }}>
              <ShieldCheck size={28} />
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Transparansi Penuh (Blockchain)</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
              Setiap donasi dan investasi Anda dicatat secara permanen di buku besar digital (Blockchain). Dana tidak akan cair ke petani sebelum Validator lapangan kami mengirimkan bukti foto satelit dan koordinat GPS. <strong>Nol Korupsi, Nol Potongan Birokrasi.</strong>
            </p>
            <Link to="/bamboochain/data-analytics" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
              Lihat Arus Kas Live <ArrowRight size={18} />
            </Link>
          </div>
          <div style={{ flex: '1 1 300px', background: '#f8f9fa', padding: '30px', borderRadius: '20px', border: '1px solid #dee2e6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #dee2e6', paddingBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status Smart Contract</span>
              <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14}/> Aktif</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>Total Dana Tersalurkan</span>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>$4,250,000 USDT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>Proyek Tervalidasi</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>1,204 Titik Lahan</span>
            </div>
          </div>
        </div>

        {/* CULTURAL & ECOLOGICAL NARRATIVE */}
        <div style={{ marginBottom: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--text-main)', marginBottom: '16px' }}>Bukan Sekadar Menanam Pohon</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>Kami melindungi harta karun peradaban dan hidrologi Nusantara melalui pendekatan ekonomi hijau.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {/* Box 1 */}
            <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', transition: '0.3s' }} className="hover-lift">
              <div style={{ height: '200px', background: 'url("https://images.unsplash.com/photo-1470071131384-001b85755536?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80") center/cover' }}></div>
              <div style={{ padding: '30px' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', marginBottom: '20px' }}>
                  <Droplet size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: 'var(--text-main)' }}>Menjaga 17 Mata Air Strategis</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>Konsesi 490 Ha bambuNUSA melindungi hulu dari 17 mata air purba yang menjadi nadi bagi sungai-sungai besar di Banten. Akar serabut bambu mengikat tanah dan menjaga debit air abadi.</p>
              </div>
            </div>

            {/* Box 2 */}
            <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', transition: '0.3s' }} className="hover-lift">
              <div style={{ height: '200px', background: 'url("https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80") center/cover' }}></div>
              <div style={{ padding: '30px' }}>
                <div style={{ background: 'rgba(245, 159, 0, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59f00', marginBottom: '20px' }}>
                  <Mountain size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: 'var(--text-main)' }}>Melestarikan Kearifan Baduy</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>Kami berdampingan erat dengan Kasepuhan Banten Kidul dan Wewengkon Kanekes (Baduy). Kami memberdayakan masyarakat adat tanpa mengubah tatanan suci warisan leluhur mereka.</p>
              </div>
            </div>
          </div>
        </div>

        {/* SDG ALIGNMENT */}
        <div style={{ background: 'white', borderRadius: '32px', padding: '60px 40px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '16px' }}>Mendukung Global Goals (SDGs) PBB</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 40px' }}>Inisiatif YSNJ secara langsung berkontribusi pada pencapaian Tujuan Pembangunan Berkelanjutan (SDG) Perserikatan Bangsa-Bangsa.</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {sdgs.map(sdg => (
              <div key={sdg.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8f9fa', padding: '16px 24px', borderRadius: '16px', border: '1px solid #dee2e6' }}>
                <div style={{ width: '40px', height: '40px', background: sdg.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', borderRadius: '8px' }}>
                  {sdg.num}
                </div>
                <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{sdg.title}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .hover-lift:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default ImpactPage;
