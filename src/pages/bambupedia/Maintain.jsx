import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBambupedia } from '../../context/BambupediaContext';
import { useAuth } from '../../context/AuthContext';
import MapLocationSelect from './components/MapLocationSelect';
import BackButton from '../../components/BackButton';
import { Droplets, Save, AlertCircle, ShieldCheck, Camera } from 'lucide-react';

function MaintainPage() {
  const { plantings, addMaintenance } = useBambupedia();
  const { addPendingValidation } = useAuth();
  const navigate = useNavigate();

  const [selectedPlantingId, setSelectedPlantingId] = useState('');
  const [task, setTask] = useState('Penyiraman');
  const [location, setLocation] = useState('');
  const [fotoRawat, setFotoRawat] = useState(null);
  const [selfiePetani, setSelfiePetani] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e, setter) => {
    if(e.target.files && e.target.files[0]) {
      setter(URL.createObjectURL(e.target.files[0]));
    }
  };

  const activePlantings = plantings.filter(p => p.status !== 'harvested');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selectedPlantingId || !location || !fotoRawat || !selfiePetani) {
      alert('Mohon pilih batch, lengkapi lokasi, dan unggah bukti foto!');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));

    addMaintenance({
      plantingId: selectedPlantingId,
      task: task,
      notes: `Pemeliharaan rutin: ${task}`
    });

    if (addPendingValidation) {
      addPendingValidation({
        title: `Pemeliharaan: ${task}`,
        gps: location,
        tags: 'Pemeliharaan',
        details: { task: task },
        uploadedFiles: {
          'Foto Kondisi Bambu': fotoRawat,
          'Selfie Perawat': selfiePetani
        },
        plantingId: selectedPlantingId,
        rewardAmount: 0.1
      });
      alert("✅ Laporan terkirim! Validator sedang meninjau foto Anda sebelum mencairkan 0.1 BMC.");
    }

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
          <div style={{ width: '64px', height: '64px', background: 'rgba(28,126,214,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#1c7ed6' }}>
            <Droplets size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Pemeliharaan</h1>
          <p style={{ color: 'var(--text-muted)' }}>Catat aktivitas perawatan agar bambu tumbuh sehat dan kuat.</p>
        </div>

        <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #eee', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Pilih Batch Penanaman
              </label>
              <select 
                style={{ 
                  width: '100%', padding: '12px 16px', border: '1px solid #dee2e6', borderRadius: '12px', fontSize: '1rem', outline: 'none', background: 'white'
                }}
                value={selectedPlantingId}
                onChange={e => setSelectedPlantingId(e.target.value)}
                required
              >
                <option value="">-- Pilih Batch --</option>
                {activePlantings.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.bamboo_type} - {p.amount} Tunas ({new Date(p.date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Jenis Aktivitas
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {['Penyiraman', 'Pemupukan', 'Pembersihan Gulma', 'Proteksi Hama'].map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTask(item)}
                    style={{ 
                      padding: '12px', borderRadius: '12px', border: '2px solid', borderColor: task === item ? 'var(--primary)' : '#eee', background: task === item ? 'rgba(12,166,120,0.05)' : 'white', color: task === item ? 'var(--primary)' : '#666', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {item === 'Penyiraman' && '💧 '}
                    {item === 'Pemupukan' && '🍃 '}
                    {item === 'Pembersihan Gulma' && '✂️ '}
                    {item === 'Proteksi Hama' && '🛡️ '}
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Lokasi Perawatan (GPS)
              </label>
              <MapLocationSelect value={location} onChange={setLocation} />
            </div>

            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #dee2e6' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} color="var(--primary)" /> Bukti Fisik (Wajib)
              </h4>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>1. Foto Kondisi Bambu Saat Ini</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setFotoRawat)} style={{ width: '100%', fontSize: '0.9rem' }} required />
                {fotoRawat && <div style={{ marginTop: '8px', width: '80px', height: '80px', borderRadius: '8px', background: `url(${fotoRawat}) center/cover`, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>2. Selfie Perawat di Lokasi</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setSelfiePetani)} style={{ width: '100%', fontSize: '0.9rem' }} required />
                {selfiePetani && <div style={{ marginTop: '8px', width: '80px', height: '80px', borderRadius: '8px', background: `url(${selfiePetani}) center/cover`, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || activePlantings.length === 0}
              style={{ 
                width: '100%', padding: '18px', background: '#1c7ed6', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '1.1rem', cursor: isSubmitting ? 'wait' : 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(28,126,214,0.2)', opacity: (isSubmitting || activePlantings.length === 0) ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Menyimpan...' : <><ShieldCheck size={20} /> Simpan Laporan Perawatan</>}
            </button>
          </form>
        </div>

        {activePlantings.length === 0 && (
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', background: '#fff0f0', padding: '16px', borderRadius: '16px', border: '1px solid #ffc9c9' }}>
            <AlertCircle size={20} color="#fa5252" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.85rem', color: '#fa5252', margin: 0 }}>
              Anda belum memiliki data penanaman yang aktif untuk dirawat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MaintainPage;
