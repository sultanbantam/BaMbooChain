import React from 'react';
import { useBambupedia } from '../../context/BambupediaContext';
import BackButton from '../../components/BackButton';
import { Sprout, Calendar, MapPin, Tag, ChevronRight, Activity, Clock, X, ShieldCheck } from 'lucide-react';

const HistoryPage = () => {
  const { plantings, taxonomies } = useBambupedia();
  const [selectedTax, setSelectedTax] = React.useState(null);
  
  // Menggabungkan plantings dan taxonomies lalu mengurutkan berdasarkan tanggal terbaru
  const allActivities = [
    ...plantings.map(p => ({ ...p, type: 'planting' })),
    ...taxonomies.map(t => ({ ...t, type: 'taxonomy' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '160px', paddingBottom: '80px' }}>
      <div className="container" style={{ marginBottom: '24px' }}>
        <BackButton to="/bambupedia/tracker" />
      </div>

      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Clock size={24} color="var(--primary)" />
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Riwayat Aktivitas</h1>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Jejak digital kontribusi Anda untuk bumi yang lebih hijau.</p>
        </div>

        {allActivities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '24px', border: '1px dashed #ccc' }}>
            <Activity size={48} color="#dee2e6" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#adb5bd' }}>Belum ada data aktivitas.</h3>
            <p style={{ color: '#adb5bd', fontSize: '0.9rem' }}>Lakukan penanaman atau analisis taksonomi bambu untuk mencatat sejarah Anda!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {allActivities.map((item) => (
              <div 
                key={item.id}
                onClick={() => {
                  if (item.type === 'taxonomy') {
                    setSelectedTax(item);
                  }
                }}
                style={{ 
                  background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '20px', transition: 'all 0.3s', cursor: item.type === 'taxonomy' ? 'pointer' : 'default'
                }}
                onMouseEnter={e => { if (item.type === 'taxonomy') e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={e => { if (item.type === 'taxonomy') e.currentTarget.style.borderColor = '#eee'; }}
              >
                <div style={{ 
                  width: '56px', height: '56px', background: item.type === 'taxonomy' ? 'rgba(74, 144, 226, 0.1)' : item.status === 'harvested' ? 'rgba(245,159,0,0.1)' : 'rgba(12,166,120,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {item.type === 'taxonomy' ? (
                    <Activity size={28} color="#4A90E2" />
                  ) : (
                    <Sprout size={28} color={item.status === 'harvested' ? '#f59f00' : 'var(--primary)'} />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                      {item.type === 'taxonomy' ? `Analisis AI: ${item.species}` : `Penanaman ${item.amount} Tunas`}
                    </h3>
                    <span style={{ 
                      fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px', 
                      background: item.type === 'taxonomy' ? '#e7f0fa' : item.status === 'harvested' ? '#fff9db' : '#ebfbee', 
                      color: item.type === 'taxonomy' ? '#4A90E2' : item.status === 'harvested' ? '#f59f00' : '#0ca678'
                    }}>
                      {item.type === 'taxonomy' ? 'Identifikasi AI' : item.status === 'harvested' ? 'Selesai Dipanen' : 'Sedang Tumbuh'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                    {item.type === 'taxonomy' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', gridColumn: 'span 2' }}>
                        <Tag size={14} /> Keyakinan AI: {item.confidence} • Umur: {item.age}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <Tag size={14} /> {item.bamboo_type}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Calendar size={14} /> {formatDate(item.date)}
                    </div>
                    {item.type !== 'taxonomy' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', gridColumn: 'span 2' }}>
                        <MapPin size={14} /> {item.location}
                      </div>
                    )}
                  </div>
                </div>

                <ChevronRight size={20} color="#dee2e6" />
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
           <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
             Total Aktivitas Terdaftar: <strong>{allActivities.length} Log</strong>
           </p>
        </div>
      </div>

      {selectedTax && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }} onClick={() => setSelectedTax(null)}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '32px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedTax(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#f1f5f9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap' }}>
              {selectedTax.image && (
                <div style={{ width: '120px', height: '120px', borderRadius: '20px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={selectedTax.image} alt="Bamboo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {selectedTax.species} <span style={{ fontSize: '1rem', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px' }}>Akurasi {selectedTax.confidence}</span>
                </h2>
                {selectedTax.alternative_species && (
                  <div style={{ fontSize: '0.9rem', color: '#f59f00', fontWeight: 'bold', marginBottom: '12px' }}>
                    Kemungkinan lain: {selectedTax.alternative_species}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>Usia: {selectedTax.age}</span>
                  <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', padding: '6px 16px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>Status: {selectedTax.status}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '24px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-main)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <Activity size={20} color="var(--primary)" /> Analisis Anatomi
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>{selectedTax.details}</p>
              </div>
              <div style={{ background: 'rgba(12, 166, 120, 0.03)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(12, 166, 120, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <ShieldCheck size={20} /> Rekomendasi Ahli
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>{selectedTax.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
