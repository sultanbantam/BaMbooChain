import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBambupedia } from '../../context/BambupediaContext';
import BackButton from '../../components/BackButton';
import { Leaf, Save, AlertCircle, Sprout, FlaskConical } from 'lucide-react';

function CultivatePage() {
  const { addCultivation } = useBambupedia();
  const navigate = useNavigate();

  const [seedCount, setSeedCount] = useState('');
  const [location, setLocation] = useState('');
  const [method, setMethod] = useState('biji');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!seedCount || Number(seedCount) <= 0 || !location) {
      alert('Mohon isi jumlah bibit dan lokasi pembibitan!');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));

    addCultivation({
      seed_count: Number(seedCount),
      location,
      method,
    });

    setIsSubmitting(false);
    navigate('/bambupedia/tracker');
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '160px', paddingBottom: '80px' }}>
      <div className="container" style={{ marginBottom: '24px' }}>
        <BackButton to="/bambupedia/tracker" />
      </div>

      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(64,192,87,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#40c057' }}>
            <FlaskConical size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Pembibitan Bambu</h1>
          <p style={{ color: 'var(--text-muted)' }}>Produksi bibit baru untuk memperluas jangkauan hutan bambu.</p>
        </div>

        <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #eee', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Jumlah Bibit yang Disemai
              </label>
              <input 
                type="number" 
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #dee2e6', borderRadius: '12px', fontSize: '1rem', outline: 'none' }}
                value={seedCount} 
                onChange={e => setSeedCount(e.target.value)} 
                placeholder="Contoh: 500" 
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Lokasi Persemaian (Nursery)
              </label>
              <input 
                type="text" 
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #dee2e6', borderRadius: '12px', fontSize: '1rem', outline: 'none' }}
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                placeholder="Contoh: Green House Utama" 
                required
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Metode Pembibitan
              </label>
              <select 
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #dee2e6', borderRadius: '12px', fontSize: '1rem', outline: 'none', background: 'white' }}
                value={method} 
                onChange={e => setMethod(e.target.value)}
              >
                <option value="biji">Biji (Seeds)</option>
                <option value="stek_rimpang">Stek Rimpang (Rhizome)</option>
                <option value="stek_batang">Stek Batang (Culm)</option>
                <option value="stek_cabang">Stek Cabang (Branch)</option>
                <option value="kultur_jaringan">Kultur Jaringan</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ 
                width: '100%', padding: '18px', background: '#40c057', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '1.1rem', cursor: isSubmitting ? 'wait' : 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(64,192,87,0.2)', opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Memproses...' : <><Sprout size={20} /> Mulai Pembibitan</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CultivatePage;
