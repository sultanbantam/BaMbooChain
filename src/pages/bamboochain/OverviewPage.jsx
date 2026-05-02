import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Wind, Wallet, TrendingUp, MapPin, Search, PlusCircle, Activity, Camera, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react';
import BackButton from '../../components/BackButton';
import AdSpace from '../../components/AdSpace';
import { useAuth } from '../../context/AuthContext';

const OverviewPage = () => {
  const { user, updateProfile } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingMission, setReportingMission] = useState(null);

  // Simulated missions for demo if user has farmer role
  const mockMissions = [
    { id: 'm1', type: 'Tanam', title: 'Tanam 10 Bibit Betung', status: 'pending', deadline: '24 Apr 2025', donor: 'Bapak Rahmat' },
    { id: 'm2', type: 'Rawat', title: 'Pemupukan Blok B', status: 'active', deadline: '20 Apr 2025', donor: 'Teh Sari' },
  ];

  const handleReportMission = (mission) => {
    setReportingMission(mission);
    setShowReportModal(true);
  };

  const submitReport = () => {
    alert('Laporan berhasil dikirim! Menunggu validasi Validator bambuNUSA.');
    setShowReportModal(false);
  };
  
  // Mock data untuk dashboard
  const userStats = {
    totalBamboo: user?.totalBamboo || "1,250",
    co2Offset: user?.co2Offset || "12.5",
    bmcBalance: user?.bmcBalance || "4,500.00",
    roi: "25.4"
  };

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: '#f8f9fa' }}>
      
      {/* Dashboard Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e9ecef', padding: '40px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ marginBottom: '20px', width: '100%' }}>
            <BackButton to="/" />
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px' }}>bambuNUSA Dashboard</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Real-time ecosystem of bamboo, blockchain, and green economy</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/bamboochain/plantation" className="btn btn-crypto" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
              <PlusCircle size={18} /> Mulai Tanam Bambu
            </Link>
            {user?.farmerStatus === 'none' && (
              <Link to="/bambunusa/join-farmer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
                Join Petani
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* STATISTIK */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(12, 166, 120, 0.1)', padding: '16px', borderRadius: '12px', color: 'var(--primary)' }}>
              <Leaf size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Bambu Anda</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{userStats.totalBamboo}</div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(51, 154, 240, 0.1)', padding: '16px', borderRadius: '12px', color: '#339af0' }}>
              <Wind size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Carbon Offset (CO2)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{userStats.co2Offset} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ton</span></div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(245, 159, 0, 0.1)', padding: '16px', borderRadius: '12px', color: '#f59f00' }}>
              <Wallet size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Saldo BMC</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{userStats.bmcBalance}</div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(132, 94, 247, 0.1)', padding: '16px', borderRadius: '12px', color: '#845ef7' }}>
              <TrendingUp size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Estimasi ROI</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{userStats.roi}%</div>
            </div>
          </div>
        </div>

        {/* Dashboard Ad Slot (Horizontal) */}
        <AdSpace type="horizontal" height="150px" />

        {/* Farmer Missions Section (Visible if user is farmer) */}
        {user?.farmerStatus === 'verified' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', animation: 'slideUp 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <CheckCircle size={20} color="var(--primary)" /> Misi Penanaman Anda
              </h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Saldo Pendamping: <strong>{user?.pendingPayouts || 0} BMC</strong></div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {mockMissions.map(mission => (
                <div key={mission.id} style={{ border: '1px solid #f1f3f5', borderRadius: '16px', padding: '20px', background: '#f8f9fa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold' }}>{mission.type}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {mission.deadline}</span>
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>{mission.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Donatur: {mission.donor}</p>
                  <button 
                    onClick={() => handleReportMission(mission)}
                    style={{ width: '100%', padding: '10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Camera size={16} /> Lapor Selesai
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(300px, 1fr)', gap: '30px' }}>
          
          {/* MAP PLANTATION */}
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f3f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} color="var(--primary)" /> Live Plantation Map
              </h3>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }} />
                <input type="text" placeholder="Cari blok lahan..." style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '0.85rem' }} />
              </div>
            </div>
            <div style={{ flex: 1, backgroundColor: '#e9ecef', position: 'relative', minHeight: '400px', display: 'flex' }}>
              {/* Peta Asli menggunakan OpenStreetMap terpusat di Lebak, Banten (-6.6, 106.2) */}
              <iframe 
                width="100%" 
                height="100%" 
                style={{ border: 0, flex: 1, minHeight: '400px' }} 
                loading="lazy" 
                allowFullScreen 
                src="https://www.openstreetmap.org/export/embed.html?bbox=105.8,-6.9,106.6,-6.3&layer=mapnik">
              </iframe>
              
              {/* Overlay Interaktif di atas Peta */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'auto' }}>
                  <div style={{ width: '18px', height: '18px', background: 'var(--primary)', border: '3px solid white', borderRadius: '50%', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', margin: '0 auto 8px', animation: 'pulse 2s infinite' }}></div>
                  <div style={{ background: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>Blok A (Cibarani, Lebak)</div>
                </div>
                
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '500', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1.5s infinite' }}></span> Real-time IoT Data Aktif
                </div>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f3f5' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={20} color="var(--primary)" /> Aktivitas Terbaru
              </h3>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 {[
                  { id: 1, action: "Penanaman berhasil", details: "50 Bambu di Blok A (Cibarani)", time: "2 jam yang lalu", type: "plant" },
                  { id: 2, action: "Token diterima", details: "Reward karbon (50 BMC)", time: "1 hari yang lalu", type: "token" },
                  { id: 3, action: "Pembaruan sensor IoT", details: "Kelembaban optimal di Blok C", time: "3 hari yang lalu", type: "iot" },
                ].map((act) => (
                  <div key={act.id} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: act.type === 'plant' ? 'var(--primary)' : act.type === 'token' ? '#f59f00' : '#339af0', border: '3px solid white', outline: '1px solid #dee2e6' }}></div>
                      <div style={{ width: '2px', flex: 1, background: '#e9ecef', margin: '4px 0', display: act.id === 3 ? 'none' : 'block' }}></div>
                    </div>
                    <div style={{ paddingBottom: '16px' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.95rem' }}>{act.action}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0' }}>{act.details}</div>
                      <div style={{ fontSize: '0.75rem', color: '#adb5bd' }}>{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f3f5', textAlign: 'center' }}>
              <Link to="/bamboochain/overview" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Lihat Semua Aktivitas →</Link>
            </div>
          </div>

        </div>
      </div>

      {/* MISSION REPORT MODAL */}
      {showReportModal && reportingMission && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: '20px' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '32px', overflow: 'hidden', animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative' }}>
            <button onClick={() => setShowReportModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.05)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <div style={{ padding: '40px' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px' }}>Laporan Misi</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{reportingMission.title}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ background: '#f8f9fa', padding: '32px', borderRadius: '20px', border: '2px dashed #dee2e6', textAlign: 'center', cursor: 'pointer' }}>
                  <Camera size={40} color="#adb5bd" style={{ marginBottom: '12px' }} />
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Unggah Foto Bukti</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pastikan geotag GPS aktif</div>
                </div>
                
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Catatan Tambahan</label>
                  <textarea placeholder="Contoh: Kondisi tanah lembap, bibit segar..." style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none', minHeight: '100px' }}></textarea>
                </div>

                <div style={{ background: 'rgba(245, 159, 0, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(245, 159, 0, 0.2)', display: 'flex', gap: '12px' }}>
                  <AlertTriangle size={20} color="#f59f00" style={{ flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#856404' }}>Data yang dikirim akan diverifikasi oleh Validator sebelum dana pencairan masuk ke saldo Anda.</p>
                </div>

                <button onClick={submitReport} className="btn btn-primary" style={{ padding: '16px', fontWeight: 'bold' }}>Kirim Laporan Validasi</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default OverviewPage;
