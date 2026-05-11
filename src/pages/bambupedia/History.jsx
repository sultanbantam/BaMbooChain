import React from 'react';
import { useBambupedia } from '../../context/BambupediaContext';
import BackButton from '../../components/BackButton';
import { Sprout, Calendar, MapPin, Tag, ChevronRight, Activity, Clock } from 'lucide-react';

const HistoryPage = () => {
  const { plantings } = useBambupedia();

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

        {plantings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '24px', border: '1px dashed #ccc' }}>
            <Activity size={48} color="#dee2e6" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#adb5bd' }}>Belum ada data aktivitas.</h3>
            <p style={{ color: '#adb5bd', fontSize: '0.9rem' }}>Mulai menanam bambu untuk mencatat sejarah Anda!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {plantings.map((item) => (
              <div 
                key={item.id}
                style={{ 
                  background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '20px', transition: 'all 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
              >
                <div style={{ 
                  width: '56px', height: '56px', background: item.status === 'harvested' ? 'rgba(245,159,0,0.1)' : 'rgba(12,166,120,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Sprout size={28} color={item.status === 'harvested' ? '#f59f00' : 'var(--primary)'} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                      Penanaman {item.amount} Tunas
                    </h3>
                    <span style={{ 
                      fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px', background: item.status === 'harvested' ? '#fff9db' : '#ebfbee', color: item.status === 'harvested' ? '#f59f00' : '#0ca678'
                    }}>
                      {item.status === 'harvested' ? 'Selesai Dipanen' : 'Sedang Tumbuh'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Tag size={14} /> {item.bamboo_type}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Calendar size={14} /> {formatDate(item.date)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', gridColumn: 'span 2' }}>
                      <MapPin size={14} /> {item.location}
                    </div>
                  </div>
                </div>

                <ChevronRight size={20} color="#dee2e6" />
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
           <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
             Total Aktivitas Terdaftar: <strong>{plantings.length} Log</strong>
           </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
