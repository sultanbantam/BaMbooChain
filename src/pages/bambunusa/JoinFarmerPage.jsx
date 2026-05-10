import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, MapPin, ShieldCheck, CheckCircle, ArrowRight, User, Phone, Wallet, Handshake, Sprout, Axe, Trees } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';

const JoinFarmerPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const ROLES = [
    { id: 'bibit', name: 'Pemilik Bibit', icon: <Sprout size={24} />, desc: 'Menyediakan dan memelihara bibit bambu unggul sebelum masa tanam.' },
    { id: 'tanam', name: 'Petani Penanam', icon: <Axe size={24} />, desc: 'Ahli lapangan yang bertanggung jawab atas proses penanaman bibit.' },
    { id: 'rawat', name: 'Tim Perawatan', icon: <Leaf size={24} />, desc: 'Merawat, memberi pupuk, dan memastikan rumpun bambu tumbuh sehat.' },
    { id: 'lahan', name: 'Pemilik Lahan', icon: <Trees size={24} />, desc: 'Menyediakan lahan kosong untuk diubah menjadi hutan bambu produktif.' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ paddingTop: '150px', paddingBottom: '80px' }}>
        <div className="container" style={{ marginBottom: '24px' }}>
          <BackButton to="/bambunusa/farmers" />
        </div>

        <div className="container" style={{ maxWidth: '800px' }}>
          {!isSubmitted ? (
            <div style={{ background: 'white', borderRadius: '32px', padding: '50px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ background: 'rgba(12, 166, 120, 0.1)', width: '70px', height: '70px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--primary)' }}>
                  <Handshake size={36} />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>Pendaftaran Kemitraan</h1>
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
                    <h3 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>2. Informasi Pribadi & Web3</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}><User size={16} style={{display:'inline', marginBottom:'-3px', marginRight:'6px'}}/> Nama Lengkap (sesuai KTP)</label>
                        <input type="text" placeholder="Contoh: Dadang Setiawan" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}><Phone size={16} style={{display:'inline', marginBottom:'-3px', marginRight:'6px'}}/> Nomor WhatsApp</label>
                          <input type="tel" placeholder="0812..." style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}><MapPin size={16} style={{display:'inline', marginBottom:'-3px', marginRight:'6px'}}/> Domisili / Wilayah</label>
                          <input type="text" placeholder="Contoh: Cibarani" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                        </div>
                      </div>
                      <div className="form-group" style={{ background: '#fff9db', padding: '20px', borderRadius: '16px', border: '1px solid #fcc419' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: '#e67700' }}><Wallet size={16} style={{display:'inline', marginBottom:'-3px', marginRight:'6px'}}/> Alamat Web3 Wallet (BEP-20)</label>
                        <p style={{ fontSize: '0.8rem', color: '#d9480f', marginBottom: '12px' }}>Dana kompensasi/gaji Anda akan ditransfer otomatis melalui Smart Contract ke dompet ini.</p>
                        <input type="text" placeholder="0x..." style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #fcc419', outline: 'none', background: 'white' }} required />
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                        <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid #dee2e6', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Kembali</button>
                        <button type="button" onClick={() => setStep(3)} className="btn btn-primary" style={{ flex: 2, padding: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>Lanjut <ArrowRight size={20} /></button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div style={{ animation: 'slideIn 0.3s' }}>
                    <h3 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>3. Detail Kapasitas Kemitraan</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      {selectedRole === 'bibit' && (
                        <>
                          <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Kapasitas Pembibitan Saat Ini (Jumlah Bibit)</label>
                            <input type="number" placeholder="Contoh: 1000" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                          </div>
                          <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Spesies Bambu Utama</label>
                            <input type="text" placeholder="Contoh: Bambu Betung, Bambu Hitam" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                          </div>
                        </>
                      )}

                      {selectedRole === 'lahan' && (
                        <>
                          <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Luas Lahan yang Dimiliki (Meter Persegi / Hektar)</label>
                            <input type="text" placeholder="Contoh: 2 Hektar" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                          </div>
                          <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Koordinat / Titik Gmaps Lahan</label>
                            <input type="text" placeholder="Contoh: -6.123, 106.123" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                          </div>
                        </>
                      )}

                      {(selectedRole === 'tanam' || selectedRole === 'rawat') && (
                        <>
                          <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Pengalaman (Tahun)</label>
                            <select style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }}>
                              <option>Pemula (Belum Pernah)</option>
                              <option>Menengah (1-3 Tahun)</option>
                              <option>Ahli (&gt; 3 Tahun)</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Ketersediaan Waktu (Jam/Minggu)</label>
                            <input type="number" placeholder="Contoh: 20" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }} required />
                          </div>
                        </>
                      )}

                      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                        <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid #dee2e6', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Kembali</button>
                        <button type="button" onClick={() => setStep(4)} className="btn btn-primary" style={{ flex: 2, padding: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>Lanjut <ArrowRight size={20} /></button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div style={{ animation: 'slideIn 0.3s' }}>
                    <h3 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>4. Komitmen & Validasi Akhir</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ background: 'rgba(12, 166, 120, 0.05)', padding: '20px', borderRadius: '16px', border: '1px dashed var(--primary)' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                          Saya bersedia mengikuti SOP ekosistem bambuNUSA, memberikan laporan bukti lapangan dengan jujur kepada Validator, dan menyetujui bahwa dana kompensasi saya akan disalurkan secara otomatis melalui teknologi Blockchain (Smart Contract Escrow).
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input type="checkbox" id="agree" required style={{ width: '20px', height: '20px' }} />
                        <label htmlFor="agree" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Saya menyetujui Pakta Integritas Mitra bambuNUSA.</label>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                        <button type="button" onClick={() => setStep(3)} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid #dee2e6', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Kembali</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '16px', fontWeight: 'bold' }}>Ajukan Kemitraan</button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: '32px', padding: '60px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div style={{ width: '100px', height: '100px', background: 'var(--primary)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                <ShieldCheck size={60} />
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '16px' }}>Pengajuan Sedang Ditinjau!</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 40px', lineHeight: '1.6' }}>
                Terima kasih. Admin YSNJ akan melakukan inspeksi faktual di lapangan. Jika lolos verifikasi, dompet Web3 Anda akan di-*whitelist* ke dalam Smart Contract untuk menerima dana.
              </p>
              <button onClick={() => navigate('/bambunusa/farmers')} className="btn btn-primary" style={{ padding: '14px 40px' }}>Lihat Daftar Mitra</button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JoinFarmerPage;
