import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Database, Users, Activity, CheckCircle, MapPin, Search } from 'lucide-react';
import BackButton from '../../components/BackButton';

const SupplyChainPage = () => {
  const navigate = useNavigate();
  // Mock data untuk jaringan petani
  const farmerNetwork = [
    { id: 1, name: "Koperasi Tani Cibarani", role: "Petani Hulu", location: "Lebak, Banten", rating: "4.9", verified: true },
    { id: 2, name: "CV Bambu Nusantara", role: "Pengolahan Primer", location: "Sukabumi, Jabar", rating: "4.8", verified: true },
    { id: 3, name: "PT EcoFurniture", role: "Distributor", location: "Jakarta Selatan", rating: "4.7", verified: true }
  ];

  const bambooDatabase = [
    { id: "BMB-001", type: "Bambu Betung", location: "Blok A", age: "2 Tahun", quality: "Grade A" },
    { id: "BMB-002", type: "Bambu Tali", location: "Blok B", age: "1.5 Tahun", quality: "Grade A" },
    { id: "BMB-003", type: "Bambu Wulung", location: "Blok C", age: "3 Tahun", quality: "Premium" },
  ];

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
      
      {/* Back Navigation */}
      <div className="container" style={{ marginBottom: '20px' }}>
        <BackButton to="/bamboochain" />
      </div>

      {/* Header Section */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(12, 166, 120, 0.1)', padding: '16px', borderRadius: '50%', color: 'var(--primary)' }}>
            <Share2 size={40} />
          </div>
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>bambuNUSA Supply Chain</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
          Transparansi dari hulu ke hilir. Lacak perjalanan fisik material bambu secara aman dan permanen melalui catatan Immutable Blockchain.
        </p>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
        
        {/* ALUR PRODUKSI (Supply Chain Flow) */}
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '32px', textAlign: 'center' }}>Alur Produksi Real-time</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', position: 'relative' }}>
            
            {/* Garis penghubung (Hanya terlihat di layar besar, di CSS seharusnya pake media query, kita gunakan trik visual) */}
            <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '2px', background: '#e9ecef', zIndex: 0, transform: 'translateY(-50%)' }} className="d-none d-lg-block"></div>

            {[
              { step: 1, title: 'Penanaman', icon: <Activity size={24}/>, desc: 'Pencatatan GPS bibit', active: true },
              { step: 2, title: 'Panen', icon: <CheckCircle size={24}/>, desc: 'Sertifikasi usia matang', active: true },
              { step: 3, title: 'Pengolahan', icon: <Share2 size={24}/>, desc: 'Pabrik & Treatment', active: false },
              { step: 4, title: 'Distribusi', icon: <MapPin size={24}/>, desc: 'Pengiriman & Logistik', active: false }
            ].map((s) => (
              <div key={s.step} style={{ background: 'white', padding: '24px', borderRadius: '16px', textAlign: 'center', boxShadow: s.active ? '0 10px 30px rgba(12,166,120,0.15)' : '0 4px 15px rgba(0,0,0,0.05)', position: 'relative', zIndex: 1, border: s.active ? '2px solid var(--primary)' : '1px solid #f1f3f5' }}>
                <div style={{ width: '50px', height: '50px', background: s.active ? 'var(--primary)' : '#f8f9fa', color: s.active ? 'white' : '#adb5bd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  {s.icon}
                </div>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '8px' }}>{s.step}. {s.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{s.desc}</p>
                {s.active && <div style={{ background: '#e6fcf5', color: 'var(--primary)', padding: '4px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', display: 'inline-block', marginTop: '12px' }}>Verified On-Chain</div>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* TRACKING SIMULATOR (NEW) */}
          <div style={{ background: 'linear-gradient(135deg, #0ca678 0%, #087f5b 100%)', borderRadius: '24px', padding: '32px', color: 'white', boxShadow: '0 15px 35px rgba(12,166,120,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Search size={24} /> Lacak ID Bambu
              </h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '24px' }}>Masukkan Serial ID atau Scan QR untuk melihat riwayat hidup (Life-cycle) batang bambu Anda.</p>
              
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <input 
                  type="text" 
                  placeholder="Contoh: BMB-001" 
                  style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', outline: 'none' }}
                />
                <button style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'white', color: 'var(--primary)', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Lacak
                </button>
              </div>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '16px', fontSize: '0.85rem' }}>
              <strong>Tips:</strong> Semua batang bambu binaan YSNJ dilengkapi dengan tag fisik (RFID/QR) sejak usia 1 tahun.
            </div>
          </div>

          {/* MANFAAT SECTION (NEW) */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '20px', fontWeight: 'bold' }}>Mengapa Ini Penting?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ color: 'var(--primary)', flexShrink: 0 }}><CheckCircle size={20} /></div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Anti-Pemalsuan</div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mencegah pencampuran bambu muda atau ilegal ke dalam industri.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ color: 'var(--primary)', flexShrink: 0 }}><CheckCircle size={20} /></div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Akurasi Karbon</div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Data usia & berat riil memberikan klaim offset CO2 yang valid dan laku di pasar global.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ color: 'var(--primary)', flexShrink: 0 }}><CheckCircle size={20} /></div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Fair Trade</div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Petani mendapat harga lebih tinggi karena kualitasnya terjamin oleh sistem.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* DATABASE BAMBU */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                <Database size={24} color="var(--primary)" /> Database Bambu Live
              </h3>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Data forensik jenis, lokasi, usia, dan kualitas material yang telah melalui tahapan scan QR.</p>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f3f5' }}>
                    <th style={{ padding: '12px 8px', color: '#adb5bd', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Hash ID</th>
                    <th style={{ padding: '12px 8px', color: '#adb5bd', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Jenis</th>
                    <th style={{ padding: '12px 8px', color: '#adb5bd', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Usia</th>
                    <th style={{ padding: '12px 8px', color: '#adb5bd', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Mutu</th>
                  </tr>
                </thead>
                <tbody>
                  {bambooDatabase.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f3f5' }}>
                      <td style={{ padding: '16px 8px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 'bold' }}>{item.id}</td>
                      <td style={{ padding: '16px 8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>{item.type}</td>
                      <td style={{ padding: '16px 8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.age}</td>
                      <td style={{ padding: '16px 8px' }}><span style={{ background: '#fff9db', color: '#f59f00', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{item.quality}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* JARINGAN PETANI & INDUSTRI */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={24} color="var(--primary)" /> Mitra Ekosistem
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {farmerNetwork.map((partner) => (
                <div key={partner.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #f1f3f5', borderRadius: '12px', transition: 'all 0.2s', cursor: 'pointer' }}
                     onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = '#f8f9fa'; }}
                     onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f1f3f5'; e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {partner.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.95rem' }}>{partner.name}</span>
                      {partner.verified && <CheckCircle size={14} color="var(--primary)" />}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '2px' }}>{partner.role} • {partner.location}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffe3e3', color: '#e03131', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    ★ {partner.rating}
                  </div>
                </div>
              ))}
            </div>

            <button 
                    onClick={() => navigate('/bambunusa/join-farmer')}
                    style={{ width: '100%', marginTop: '24px', padding: '12px', background: 'transparent', border: '1px dashed #ced4da', color: 'var(--text-muted)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f8f9fa'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = '#ced4da'; }}>
              Lamar Menjadi Mitra Supply Chain
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SupplyChainPage;
