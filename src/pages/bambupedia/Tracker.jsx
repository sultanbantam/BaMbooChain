import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBambupedia } from '../../context/BambupediaContext';
import { useAuth } from '../../context/AuthContext';
import { Sprout, Droplets, Scissors, ArrowRight, PlusCircle, History, Layout, Leaf, Hammer, Camera, Scan } from 'lucide-react';
import BackButton from '../../components/BackButton';

const TrackerPage = () => {
  const { user } = useAuth();
  const { plantings, taxonomies } = useBambupedia();
  const navigate = useNavigate();

  // Calculate stats
  const plantedCount = plantings.filter(p => p.status === 'planted' || p.status === 'growing').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const harvestedCount = plantings.filter(p => p.status === 'harvested').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalBamboo = (plantedCount + harvestedCount);

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '160px', paddingBottom: '80px' }}>
      <div className="container" style={{ marginBottom: '24px' }}>
        <BackButton to="/bambupedia" />
      </div>

      <div className="container">
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
            Halo, {user?.name || 'Sahabat Bambu'}! 👋
          </h2>
          <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.1rem' }}>
            Level: {totalBamboo >= 100 ? 'Hutan Penjaga' : (totalBamboo >= 10 ? 'Penanam Muda' : 'Pemula')}
          </p>
        </div>

        {/* Hero Stats Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary) 0%, #2b8a3e 100%)', 
          borderRadius: '32px', 
          padding: '40px', 
          color: 'white', 
          boxShadow: '0 20px 40px rgba(12,166,120,0.2)',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
            <Leaf size={200} />
          </div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '8px', fontWeight: '600' }}>Total Bambu Ditanam</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '24px' }}>Pencapaian Lestari Anda</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <h1 style={{ fontSize: '5rem', fontWeight: '900', margin: 0, lineHeight: 1 }}>{totalBamboo}</h1>
              <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>Batang</span>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '24px', color: 'var(--text-main)' }}>Ringkasan Siklus Hidup</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ color: 'var(--primary)', background: 'rgba(12,166,120,0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Sprout size={20} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>{plantedCount}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ditanam & Tumbuh</div>
          </div>
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ color: '#f59f00', background: 'rgba(245,159,0,0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Scissors size={20} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>{harvestedCount}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Berhasil Dipanen</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button 
            onClick={() => navigate('/bambupedia/plant')}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '20px', borderRadius: '20px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 10px 20px rgba(12,166,120,0.2)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <PlusCircle size={24} /> Mulai Menanam Baru
          </button>

          <button 
            onClick={() => navigate('/bambupedia/plant-past')}
            style={{ 
              background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '-8px', marginBottom: '8px'
            }}
          >
            <History size={16} /> Add Past Planting (Record)
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <button 
              onClick={() => navigate('/bambupedia/maintain')}
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', borderRadius: '20px', border: '2px solid #eee', background: 'white', color: 'var(--text-main)', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#1c7ed6'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
            >
              <Droplets size={20} color="#1c7ed6" /> Pemeliharaan
            </button>
            <button 
              onClick={() => navigate('/bambupedia/harvest')}
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', borderRadius: '20px', border: '2px solid #eee', background: 'white', color: 'var(--text-main)', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#f59f00'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
            >
              <Scissors size={20} color="#f59f00" /> Panen
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <button 
              onClick={() => navigate('/bambupedia/utilize')}
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', borderRadius: '20px', border: '2px solid #eee', background: 'white', color: 'var(--text-main)', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#5f4bd4'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
            >
              <Hammer size={20} color="#5f4bd4" /> Pemanfaatan
            </button>
            <button 
              onClick={() => navigate('/bambupedia/cultivate')}
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', borderRadius: '20px', border: '2px solid #eee', background: 'white', color: 'var(--text-main)', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#40c057'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
            >
              <Sprout size={20} color="#40c057" /> Pembibitan
            </button>
          </div>

          <button 
            onClick={() => navigate('/bambupedia/taxonomy')}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '20px', borderRadius: '20px', border: 'none', background: 'linear-gradient(135deg, #0ca678 0%, #2b8a3e 100%)', color: 'white', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 10px 20px rgba(12,166,120,0.2)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Camera size={24} /> Analisis Taksonomi AI
          </button>
          
          <button 
            onClick={() => navigate('/bambupedia/history')}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '20px', borderRadius: '20px', border: '2px solid #eee', background: 'white', color: 'var(--text-main)', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
          >
            <History size={24} /> Lihat Riwayat Aktivitas
          </button>

          {taxonomies && taxonomies.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)' }}>Hasil Analisis Terakhir</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {taxonomies.slice(0, 3).map((tax, idx) => (
                  <div key={tax.id} style={{ background: 'white', padding: '16px', borderRadius: '20px', border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={tax.image} alt="Bamboo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-main)' }}>{tax.species}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(tax.date).toLocaleDateString()} • Kesehatan: {tax.health}%</div>
                    </div>
                    <div style={{ background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {tax.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackerPage;
