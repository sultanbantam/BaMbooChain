import React, { useState, useEffect } from 'react';
import { Target, Lightbulb, TrendingUp, Handshake, Globe } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useLanguage } from '../context/LanguageContext';

const InsightPage = () => {
  const { t } = useLanguage();
  const [dailyNews, setDailyNews] = useState([]);

  // Database Berita Global (Simulasi)
  const globalNewsPool = [
    { id: 1, title: "Ekspor Bambu China Capai Rekor Baru", preview: "Permintaan pasar Eropa untuk panel bambu meningkat pesat tahun ini.", source: "China Daily", img: "https://images.unsplash.com/photo-1542450530-5bfa5dfef006?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Inovasi Tekstil di India", preview: "Startup Bangalore meluncurkan serat kain bambu super lembut ramah lingkungan.", source: "India Eco Times", img: "https://images.unsplash.com/photo-1598928376916-2fd125c192bd?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "Konstruksi Modular Bambu di Kolombia", preview: "Arsitek Bogota membangun kompleks perumahan sosial berbasis struktur bambu.", source: "ArchDaily LatAm", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "Uni Eropa Dukung Kredit Karbon Bambu", preview: "Regulasi baru memungkinkan penanaman bambu di Afrika masuk skema kredit karbon.", source: "Reuters Global", img: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=400&q=80" },
    { id: 5, title: "Produksi Kertas Bambu di Vietnam", preview: "Pabrik baru di Vietnam kurangi ketergantungan pada bubur kayu hutan alami.", source: "ASEAN Green News", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80" },
    { id: 6, title: "Lantai Bambu Jadi Tren di Amerika Serikat", preview: "Konsumen AS beralih ke lantai bambu karena ketahanan dan keberlanjutannya.", source: "Home Decor US", img: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=400&q=80" },
    { id: 7, title: "Penelitian Jepang: Biofuel dari Bambu", preview: "Tim peneliti Tokyo temukan metode efisien ubah selulosa bambu jadi bahan bakar.", source: "Science Japan", img: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=400&q=80" },
    { id: 8, title: "Restorasi Lahan di Kenya dengan Bambu", preview: "Proyek rehabilitasi lahan kritis gunakan bambu untuk cegah erosi tanah.", source: "African Eco Journal", img: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=400&q=80" },
    { id: 9, title: "Suku Bunga Kredit Hijau untuk Petani Bambu", preview: "Bank Dunia siapkan dana hibah untuk pengembangan industri bambu hulu.", source: "World Finance", img: "https://images.unsplash.com/photo-1454165833767-027ff7731932?auto=format&fit=crop&w=400&q=80" },
    { id: 10, title: "Mebel Bambu Dominasi Pameran Milan", preview: "Desainer Italia pamerkan koleksi mewah berbahan dasar bambu laminasi.", source: "Design Week", img: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=400&q=80" },
  ];

  useEffect(() => {
    // Logika pemilihan 5 berita harian berdasarkan tanggal
    const today = new Date();
    const seed = today.getFullYear() + today.getMonth() + today.getDate();
    
    // Pilih 5 item secara deterministik berdasarkan seed
    const selected = [];
    const pool = [...globalNewsPool];
    for (let i = 0; i < 5; i++) {
      const index = (seed + i) % pool.length;
      selected.push(pool.splice(index, 1)[0]);
    }
    setDailyNews(selected);
  }, []);

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: '#f8f9fa' }}>
      
      {/* ── GLOBAL NEWS TICKER (TOP) ── */}
      <div className="ticker-wrapper" style={{ background: '#212529', padding: '15px 0', borderBottom: '1px solid #343a40', overflow: 'hidden', position: 'relative' }}>
        <div className="ticker-label" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, background: 'var(--primary)', color: 'white', zIndex: 10, display: 'flex', alignItems: 'center', padding: '0 20px', fontWeight: 'bold', fontSize: '0.8rem', boxShadow: '5px 0 15px rgba(0,0,0,0.3)' }}>
          <Globe size={16} style={{ marginRight: '8px' }} /> GLOBAL INSIGHT DAILY
        </div>
        
        <div className="marquee-container">
          {[...dailyNews, ...dailyNews].map((item, idx) => (
            <div key={idx} style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              background: '#2c3036', 
              padding: '8px 16px', 
              borderRadius: '12px', 
              marginRight: '30px', 
              border: '1px solid #495057' 
            }}>
              <img src={item.img} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', marginRight: '12px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white' }}>{item.title}</div>
                <div style={{ fontSize: '0.7rem', color: '#adb5bd' }}>
                   {item.preview} <span style={{ color: 'var(--primary)', marginLeft: '10px' }}>• {item.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          .marquee-container {
            display: flex;
            white-space: nowrap;
            animation: marquee 40s linear infinite;
            padding-left: 220px;
          }

          /* Berhenti saat disentuh/hover agar mudah dibaca */
          .marquee-container:hover {
            animation-play-state: paused;
          }

          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          /* Optimalisasi Mobile: Bisa digeser manual (Swipe) */
          @media (max-width: 768px) {
            .ticker-wrapper {
              overflow-x: auto !important;
              -webkit-overflow-scrolling: touch;
              cursor: grab;
            }
            .marquee-container {
              animation: none !important;
              padding-left: 150px !important;
              display: inline-flex !important;
              width: auto !important;
            }
            .ticker-label {
              padding: 0 10px !important;
              font-size: 0.7rem !important;
            }
          }
        `}
      </style>

    <div className="container" style={{ padding: '60px 24px' }}>
        <BackButton to="/" />
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px', marginTop: '20px', color: 'var(--text-main)' }}>{t('insight_title')}</h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '60px', maxWidth: '800px', margin: '0 auto 60px' }}>
          {t('insight_desc')}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          
          {/* Card 1 */}
          <div className="glass" style={{ padding: '30px', border: '1px solid #dee2e6' }}>
            <div style={{ display: 'inline-block', padding: '16px', background: 'rgba(0,100,0,0.1)', borderRadius: '50%', marginBottom: '20px' }}>
              <TrendingUp size={32} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '16px' }}>{t('insight_card1_title')}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {t('insight_card1_desc')}
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass" style={{ padding: '30px', border: '1px solid #dee2e6' }}>
            <div style={{ display: 'inline-block', padding: '16px', background: 'rgba(0,100,0,0.1)', borderRadius: '50%', marginBottom: '20px' }}>
              <Lightbulb size={32} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '16px' }}>{t('insight_card2_title')}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {t('insight_card2_desc')}
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass" style={{ padding: '30px', border: '1px solid #dee2e6' }}>
            <div style={{ display: 'inline-block', padding: '16px', background: 'rgba(0,100,0,0.1)', borderRadius: '50%', marginBottom: '20px' }}>
              <Target size={32} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '16px' }}>{t('insight_card3_title')}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {t('insight_card3_desc')}
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass" style={{ padding: '30px', border: '1px solid #dee2e6' }}>
            <div style={{ display: 'inline-block', padding: '16px', background: 'rgba(0,100,0,0.1)', borderRadius: '50%', marginBottom: '20px' }}>
              <Handshake size={32} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '16px' }}>{t('insight_card4_title')}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {t('insight_card4_desc')}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InsightPage;
