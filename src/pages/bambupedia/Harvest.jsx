import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBambupedia } from '../../context/BambupediaContext';
import { useAuth } from '../../context/AuthContext';
import MapLocationSelect from './components/MapLocationSelect';
import BackButton from '../../components/BackButton';
import { Scissors, Save, AlertCircle, ShoppingBag, Camera } from 'lucide-react';

function HarvestPage() {
  const { plantings, addHarvest } = useBambupedia();
  const { addPendingValidation } = useAuth();
  const navigate = useNavigate();

  const [selectedPlantingId, setSelectedPlantingId] = useState('');
  const [harvestAmount, setHarvestAmount] = useState('');
  const [location, setLocation] = useState('');
  const [fotoPanen, setFotoPanen] = useState(null);
  const [selfiePetani, setSelfiePetani] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e, setter) => {
    if(e.target.files && e.target.files[0]) {
      setter(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Filter penanaman yang belum dipanen
  const activePlantings = plantings.filter(p => p.status !== 'harvested');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selectedPlantingId || !harvestAmount || Number(harvestAmount) <= 0 || !location || !fotoPanen || !selfiePetani) {
      alert('Mohon lengkapi semua data panen beserta bukti foto!');
      return;
    }

    const selectedPlanting = plantings.find(p => p.id === selectedPlantingId);
    if (Number(harvestAmount) > selectedPlanting.amount) {
      alert(`Jumlah panen melebihi jumlah yang ditanam (${selectedPlanting.amount})!`);
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));

    addHarvest({
      plantingId: selectedPlantingId,
      amount: Number(harvestAmount),
      notes: 'Panen melalui aplikasi Tracker'
    });

    if (addPendingValidation) {
      addPendingValidation({
        title: `Panen Lestari: ${harvestAmount} Batang`,
        gps: location,
        tags: 'Panen',
        details: { jumlah: harvestAmount },
        uploadedFiles: {
          'Foto Rumpun Dipanen': fotoPanen,
          'Selfie Pemanen': selfiePetani
        },
        plantingId: selectedPlantingId,
        rewardAmount: 0.5
      });
      alert("✅ Laporan Panen terkirim! Validator sedang meninjau kesesuaian metode tebang pilih Anda.");
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
          <div style={{ width: '64px', height: '64px', background: 'rgba(245,159,0,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#f59f00' }}>
            <Scissors size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Panen Bambu</h1>
          <p style={{ color: 'var(--text-muted)' }}>Laporkan hasil panen Anda untuk menghitung hasil ekonomi.</p>
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
                Jumlah yang Dipanen (Batang/Rebung)
              </label>
              <input 
                type="number" 
                style={{ 
                  width: '100%', padding: '12px 16px', border: '1px solid #dee2e6', borderRadius: '12px', fontSize: '1rem', outline: 'none'
                }}
                value={harvestAmount} 
                onChange={e => setHarvestAmount(e.target.value)} 
                placeholder="Masukkan jumlah panen" 
                required
              />
              {selectedPlantingId && (
                <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '8px', fontWeight: '600' }}>
                  Maksimum tersedia: {plantings.find(p => p.id === selectedPlantingId)?.amount} unit
                </p>
              )}
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Lokasi Panen (GPS)
              </label>
              <MapLocationSelect value={location} onChange={setLocation} />
            </div>

            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #dee2e6' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} color="var(--primary)" /> Bukti Fisik (Wajib)
              </h4>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>1. Foto Rumpun Bambu (Metode Tebang Pilih)</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setFotoPanen)} style={{ width: '100%', fontSize: '0.9rem' }} required />
                {fotoPanen && <div style={{ marginTop: '8px', width: '80px', height: '80px', borderRadius: '8px', background: `url(${fotoPanen}) center/cover`, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>2. Selfie Pemanen di Lokasi</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setSelfiePetani)} style={{ width: '100%', fontSize: '0.9rem' }} required />
                {selfiePetani && <div style={{ marginTop: '8px', width: '80px', height: '80px', borderRadius: '8px', background: `url(${selfiePetani}) center/cover`, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || activePlantings.length === 0}
              style={{ 
                width: '100%', padding: '18px', background: '#f59f00', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '1.1rem', cursor: isSubmitting ? 'wait' : 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(245,159,0,0.2)', opacity: (isSubmitting || activePlantings.length === 0) ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Memproses...' : <><ShoppingBag size={20} /> Konfirmasi Hasil Panen</>}
            </button>
          </form>
        </div>

        {activePlantings.length === 0 && (
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', background: '#fff0f0', padding: '16px', borderRadius: '16px', border: '1px solid #ffc9c9' }}>
            <AlertCircle size={20} color="#fa5252" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.85rem', color: '#fa5252', margin: 0 }}>
              Anda belum memiliki data penanaman yang aktif untuk dipanen. Silakan lakukan penanaman terlebih dahulu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HarvestPage;
