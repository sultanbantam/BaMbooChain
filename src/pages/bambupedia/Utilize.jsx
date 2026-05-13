import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBambupedia } from '../../context/BambupediaContext';
import BackButton from '../../components/BackButton';
import { Hammer, Save, AlertCircle, ShoppingBag, Box } from 'lucide-react';

function UtilizePage() {
  const { harvests, addUtilization, plantings } = useBambupedia();
  const navigate = useNavigate();

  const [selectedHarvestId, setSelectedHarvestId] = useState('');
  const [type, setType] = useState('konstruksi');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getHarvestDetails = (id) => {
    const hv = harvests.find(h => h.id === id);
    if (!hv) return '';
    const pl = plantings.find(p => p.id === hv.plantingId);
    return `${pl?.bamboo_type || 'Bambu'} - Panen ${hv.amount} unit (${new Date(hv.date).toLocaleDateString()})`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selectedHarvestId || !description) {
      alert('Mohon pilih sumber panen dan deskripsikan pemanfaatannya!');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));

    addUtilization({
      harvestId: selectedHarvestId,
      type: type,
      description: description
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
          <div style={{ width: '64px', height: '64px', background: 'rgba(95,75,212,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#5f4bd4' }}>
            <Hammer size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Pemanfaatan Bambu</h1>
          <p style={{ color: 'var(--text-muted)' }}>Catat bagaimana bambu yang dipanen digunakan untuk nilai ekonomi.</p>
        </div>

        <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #eee', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          {harvests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: 'var(--primary)', fontWeight: '600' }}>
                Anda harus mencatat hasil panen terlebih dahulu sebelum dapat mencatat pemanfaatannya.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                  Pilih Sumber Panen
                </label>
                <select 
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #dee2e6', borderRadius: '12px', fontSize: '1rem', outline: 'none', background: 'white' }}
                  value={selectedHarvestId}
                  onChange={e => setSelectedHarvestId(e.target.value)}
                  required
                >
                  <option value="">-- Pilih Panen --</option>
                  {harvests.map(h => (
                    <option key={h.id} value={h.id}>
                      {getHarvestDetails(h.id)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                  Jenis Pemanfaatan
                </label>
                <select 
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #dee2e6', borderRadius: '12px', fontSize: '1rem', outline: 'none', background: 'white' }}
                  value={type} 
                  onChange={e => setType(e.target.value)}
                >
                  <option value="konstruksi">Bahan Konstruksi</option>
                  <option value="furnitur">Furnitur</option>
                  <option value="kerajinan">Kerajinan & Seni</option>
                  <option value="energi">Energi (Biomassa)</option>
                  <option value="pangan">Pangan (Rebung)</option>
                </select>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                  Deskripsi Penggunaan
                </label>
                <textarea 
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #dee2e6', borderRadius: '12px', fontSize: '1rem', outline: 'none', resize: 'none' }}
                  rows="3" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Contoh: Digunakan untuk rangka gazebo desa..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ 
                  width: '100%', padding: '18px', background: '#5f4bd4', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '1.1rem', cursor: isSubmitting ? 'wait' : 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(95,75,212,0.2)', opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Menyimpan...' : <><Box size={20} /> Simpan Data Pemanfaatan</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default UtilizePage;
