import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, MapPin, ShieldCheck, CheckCircle, ArrowRight, User, Phone, Wallet, 
  Handshake, Sprout, Axe, Trees, Hammer, BookOpen, Microscope, Ruler, Users 
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';

import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const JoinFarmerPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { submitPartnerApp, user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentType, setPaymentType] = useState('bank');
  const [selectedRole, setSelectedRole] = useState('');
  const [renderError, setRenderError] = useState(null);

  try {
  // Form Data State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    whatsapp: user?.phone || '',
    location: '',
    paymentDetail: '',
    capacity: '',
    experience: '',
    availability: '',
    coordinates: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const ROLES = [
    { id: 'bibit', name: 'Pemilik Bibit', icon: <Sprout size={24} />, desc: 'Menyediakan dan memelihara bibit bambu unggul sebelum masa tanam.' },
    { id: 'tanam', name: 'Petani Penanam', icon: <Axe size={24} />, desc: 'Ahli lapangan yang bertanggung jawab atas proses penanaman bibit.' },
    { id: 'rawat', name: 'Tim Perawatan', icon: <Leaf size={24} />, desc: 'Merawat, memberi pupuk, dan memastikan rumpun bambu tumbuh sehat.' },
    { id: 'lahan', name: 'Pemilik Lahan', icon: <Trees size={24} />, desc: 'Menyediakan lahan kosong untuk diubah menjadi hutan bambu produktif.' },
    { id: 'pengolahan', name: 'Industri Pengolahan', icon: <Handshake size={24} />, desc: 'Penyedia jasa treatment (pengawetan) atau pengolahan produk turunan bambu.' },
    { id: 'logistik', name: 'Logistik & Distribusi', icon: <MapPin size={24} />, desc: 'Bertanggung jawab atas pengiriman material dari lahan ke pabrik atau gudang.' },
    { id: 'tukang', name: 'Tukang Bangunan', icon: <Hammer size={24} />, desc: 'Ahli konstruksi spesialis material bambu untuk bangunan lestari.' },
    { id: 'dosen', name: 'Dosen', icon: <BookOpen size={24} />, desc: 'Tenaga pendidik yang memberikan materi edukasi terkait bambu.' },
    { id: 'peneliti', name: 'Peneliti', icon: <Microscope size={24} />, desc: 'Melakukan riset dan pengembangan inovasi produk turunan bambu.' },
    { id: 'arsitek', name: 'Arsitek', icon: <Ruler size={24} />, desc: 'Perancang desain bangunan dan interior berbasis material bambu.' },
    { id: 'mediator', name: 'Mediator', icon: <Users size={24} />, desc: 'Penghubung antar stakeholder dalam ekosistem ekonomi bambu dan bisa memediasi konflik.' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Process submission
    const success = await submitPartnerApp({
      name: formData.name,
      role: ROLES.find(r => r.id === selectedRole)?.name,
      method: paymentType === 'bank' ? 'Rekening Bank' : paymentType === 'bmc' ? 'Wallet BMC' : 'Wallet USDT',
      whatsapp: formData.whatsapp,
      location: formData.location,
      details: formData,
      paymentDetail: formData.paymentDetail
    });

    if (success) {
      setIsSubmitted(true);
    } else {
      alert("Gagal mengirim pendaftaran. Silakan coba lagi.");
    }
  };

  if (isSubmitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
        <Navbar />
        <div className="container" style={{ padding: '120px 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '60px 40px', borderRadius: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '80px', height: '80px', background: '#ebfbee', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
              <ShieldCheck size={40} />
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '20px' }}>Pendaftaran Terkirim!</h1>
            <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '40px' }}>
              Terima kasih telah mendaftar sebagai mitra {ROLES.find(r => r.id === selectedRole)?.name}. Tim Yayasan akan memverifikasi data Anda dalam 2x24 jam.
            </p>
            <button onClick={() => navigate('/')} className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>Kembali ke Beranda</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      <Navbar />
      <div className="container" style={{ padding: '160px 20px 100px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <BackButton />
          
          <div style={{ background: 'white', borderRadius: '40px', padding: '60px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', position: 'relative', marginTop: '30px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ width: '60px', height: '60px', background: '#ebfbee', color: 'var(--primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Handshake size={32} />
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>{t('join_farmer_title')}</h1>
              <p style={{ color: 'var(--text-muted)' }}>Mulai langkah Anda bergabung ke ekosistem Web3 bambuNUSA.</p>
            </div>

            {/* Progress Bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ flex: 1, height: '6px', background: i <= step ? 'var(--primary)' : '#e9ecef', borderRadius: '3px', transition: 'all 0.3s' }}></div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div style={{ animation: 'slideIn 0.3s' }}>
                  <h3 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>1. Pilih Peran Kemitraan</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>Silakan pilih spesialisasi yang paling sesuai dengan keahlian atau aset yang Anda miliki. Peran ini akan didaftarkan ke dalam sistem Smart Contract Escrow.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    {ROLES.map((role) => (
                      <div 
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        style={{ 
                          padding: '24px', 
                          borderRadius: '16px', 
                          border: `2px solid ${selectedRole === role.id ? 'var(--primary)' : '#dee2e6'}`,
                          background: selectedRole === role.id ? 'rgba(12, 166, 120, 0.05)' : 'white',
                          cursor: 'pointer',
                          transition: '0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: selectedRole === role.id ? 'var(--primary)' : 'var(--text-muted)' }}>
                          {role.icon}
                          <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{role.name}</div>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{role.desc}</div>
                      </div>
                    ))}
                  </div>

                  <button 
                    type="button" 
                    onClick={() => setStep(2)} 
                    disabled={!selectedRole}
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', opacity: selectedRole ? 1 : 0.5, cursor: selectedRole ? 'pointer' : 'not-allowed' }}
                  >
                    Lanjut <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div style={{ animation: 'slideIn 0.3s' }}>
                  <h3 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>2. Informasi Pribadi & Pembayaran</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}><User size={16} style={{display:'inline', marginBottom:'-3px', marginRight:'6px'}}/> Nama Lengkap (sesuai KTP)</label>
                      <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Nama lengkap Anda" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}><Phone size={16} style={{display:'inline', marginBottom:'-3px', marginRight:'6px'}}/> Nomor WhatsApp</label>
                        <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} type="tel" placeholder="08xxxxxxxxxx" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}><MapPin size={16} style={{display:'inline', marginBottom:'-3px', marginRight:'6px'}}/> Domisili / Wilayah</label>
                        <input name="location" value={formData.location} onChange={handleChange} type="text" placeholder="Contoh: Jakarta" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                      </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '16px', fontWeight: 'bold', fontSize: '0.9rem' }}><Wallet size={16} style={{display:'inline', marginBottom:'-3px', marginRight:'6px'}}/> Pilih Metode Pencairan Komisi</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        {[
                          { id: 'bank', name: 'Bank Transfer' },
                          { id: 'bmc', name: 'Wallet BMC' },
                          { id: 'usdt', name: 'Wallet USDT' }
                        ].map(m => (
                          <div 
                            key={m.id} 
                            onClick={() => setPaymentType(m.id)}
                            style={{ 
                              padding: '12px', borderRadius: '10px', border: `1px solid ${paymentType === m.id ? 'var(--primary)' : '#dee2e6'}`, 
                              background: paymentType === m.id ? 'rgba(12, 166, 120, 0.05)' : 'white', textAlign: 'center', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold'
                            }}
                          >
                            {m.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Detail Rekening / Alamat Wallet</label>
                      <input name="paymentDetail" value={formData.paymentDetail} onChange={handleChange} type="text" placeholder={paymentType === 'bank' ? "Bank Mandiri - 123456789 - Atas Nama Anda" : "0x..."} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                    <button type="button" onClick={() => setStep(1)} className="btn" style={{ flex: 1, padding: '16px', border: '1px solid #dee2e6', background: 'white' }}>Sebelumnya</button>
                    <button type="button" onClick={() => setStep(3)} className="btn btn-primary" style={{ flex: 1, padding: '16px' }}>Lanjut <ArrowRight size={20} /></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ animation: 'slideIn 0.3s' }}>
                  <h3 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>3. Detail Kapasitas & Pengalaman</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Berapa Kapasitas/Output yang Bisa Anda Sediakan?</label>
                      <input name="capacity" value={formData.capacity} onChange={handleChange} type="text" placeholder="Contoh: 1000 bibit/bulan atau Lahan 2 Hektar" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Pengalaman Terkait (Tahun/Proyek)</label>
                      <textarea name="experience" value={formData.experience} onChange={handleChange} placeholder="Ceritakan pengalaman Anda di bidang ini..." style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none', minHeight: '100px' }} required />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Waktu Ketersediaan</label>
                      <select name="availability" value={formData.availability} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required>
                        <option value="">-- Pilih Ketersediaan --</option>
                        <option value="fulltime">Full Time</option>
                        <option value="parttime">Part Time</option>
                        <option value="seasonal">Musiman / On-Project</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                    <button type="button" onClick={() => setStep(2)} className="btn" style={{ flex: 1, padding: '16px', border: '1px solid #dee2e6', background: 'white' }}>Sebelumnya</button>
                    <button type="button" onClick={() => setStep(4)} className="btn btn-primary" style={{ flex: 1, padding: '16px' }}>Lanjut <ArrowRight size={20} /></button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div style={{ animation: 'slideIn 0.3s' }}>
                  <h3 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>4. Konfirmasi & Disclaimer</h3>
                  <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '16px', marginBottom: '30px', border: '1px solid #e9ecef' }}>
                    <h4 style={{ marginBottom: '15px', color: 'var(--text-main)' }}>Ketentuan Kemitraan:</h4>
                    <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <li>Data yang saya berikan adalah benar dan dapat dipertanggungjawabkan.</li>
                      <li>Saya setuju untuk mengikuti kurasi dan verifikasi dari tim Yayasan.</li>
                      <li>Saya memahami bahwa komisi akan dibayarkan melalui sistem Escrow setelah verifikasi pekerjaan selesai.</li>
                      <li>Pendaftaran ini tidak memungut biaya apapun (Gratis).</li>
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button type="button" onClick={() => setStep(3)} className="btn" style={{ flex: 1, padding: '16px', border: '1px solid #dee2e6', background: 'white' }}>Sebelumnya</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '16px', background: 'linear-gradient(135deg, #0ca678 0%, #087f5b 100%)', boxShadow: '0 10px 20px rgba(12, 166, 120, 0.2)' }}>Kirim Pendaftaran <CheckCircle size={20} /></button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
  } catch(error) {
    return <div style={{padding: '50px', background: 'red', color: 'white', fontSize: '20px'}}>
      <h1>React Component Error in JoinFarmerPage</h1>
      <pre>{error.toString()}</pre>
      <pre>{error.stack}</pre>
    </div>;
  }
};

export default JoinFarmerPage;
