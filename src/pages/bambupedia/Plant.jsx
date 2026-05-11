import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBambupedia } from '../../context/BambupediaContext';
import { useAuth } from '../../context/AuthContext';
import BambooSelect from './components/BambooSelect';
import MapLocationSelect from './components/MapLocationSelect';
import BackButton from '../../components/BackButton';
import { Sprout, Save, AlertCircle, Camera } from 'lucide-react';

function PlantPage() {
  const { addPlanting } = useBambupedia();
  const { addPendingValidation } = useAuth();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [fotoTanaman, setFotoTanaman] = useState(null);
  const [selfiePetani, setSelfiePetani] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e, setter) => {
    if(e.target.files && e.target.files[0]) {
      setter(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!amount || Number(amount) <= 0) return;
    if(!type || !location || !fotoTanaman || !selfiePetani) {
      alert('Mohon lengkapi semua data penanaman beserta bukti foto!');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));

    const newPlanting = addPlanting({
      amount: Number(amount),
      bamboo_type: type,
      location: location,
      isVerified: false
    });

    if (addPendingValidation) {
      addPendingValidation({
        title: `Penanaman Baru: ${amount} Tunas`,
        gps: location,
        tags: 'Penanaman, ' + type,
        details: { pemilik: 'Petani Lokal', tipe: type },
        uploadedFiles: {
          'Foto Tanaman': fotoTanaman,
          'Selfie Petani': selfiePetani
        },
        plantingId: newPlanting.id,
        rewardAmount: 0.2
      });
      alert("✅ Data terkirim! Validator sedang meninjau foto Anda sebelum mencairkan 0.2 BMC.");
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
          <div style={{ width: '64px', height: '64px', background: 'rgba(12,166,120,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary)' }}>
            <Sprout size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Penanaman Baru</h1>
          <p style={{ color: 'var(--text-muted)' }}>Catat setiap tunas baru yang Anda tanam hari ini.</p>
        </div>

        <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #eee', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Jumlah Tunas / Bibit
              </label>
              <input 
                type="number" 
                style={{ 
                  width: '100%', padding: '12px 16px', border: '1px solid #dee2e6', borderRadius: '12px', fontSize: '1rem', outline: 'none'
                }}
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="Contoh: 10" 
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Jenis Bambu
              </label>
              <BambooSelect value={type} onChange={setType} />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Lokasi Penanaman
              </label>
              <MapLocationSelect value={location} onChange={setLocation} />
            </div>

            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #dee2e6' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} color="var(--primary)" /> Bukti Fisik (Wajib)
              </h4>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>1. Foto Tanaman Bambu</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setFotoTanaman)} style={{ width: '100%', fontSize: '0.9rem' }} required />
                {fotoTanaman && <div style={{ marginTop: '8px', width: '80px', height: '80px', borderRadius: '8px', background: `url(${fotoTanaman}) center/cover`, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>2. Selfie Petani di Lokasi</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setSelfiePetani)} style={{ width: '100%', fontSize: '0.9rem' }} required />
                {selfiePetani && <div style={{ marginTop: '8px', width: '80px', height: '80px', borderRadius: '8px', background: `url(${selfiePetani}) center/cover`, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ 
                width: '100%', padding: '18px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '1.1rem', cursor: isSubmitting ? 'wait' : 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(12,166,120,0.2)', opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Menyimpan...' : <><Save size={20} /> Simpan Data Penanaman</>}
            </button>
          </form>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', background: '#fff9db', padding: '16px', borderRadius: '16px', border: '1px solid #ffe066' }}>
          <AlertCircle size={20} color="#f59f00" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '0.85rem', color: '#868e96', margin: 0 }}>
            Data yang Anda simpan akan membantu kalkulasi serapan karbon dan perkembangan hutan bambu di komunitas ini.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlantPage;
