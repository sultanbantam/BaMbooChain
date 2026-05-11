import React from 'react';
import { Activity, Clock, ShieldCheck, TrendingUp, Wallet, ArrowLeft, Filter, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';
import { useAuth } from '../../context/AuthContext';

const ActivityLogPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock extended activities
  const allActivities = [
    { id: 1, action: "Penanaman berhasil", details: "50 Bambu di Blok A (Cibarani)", time: "2 jam yang lalu", type: "plant", status: "Verified" },
    { id: 2, action: "Token diterima", details: "Reward karbon (0.5 BMC)", time: "1 hari yang lalu", type: "token", status: "Verified" },
    { id: 3, action: "Pembaruan sensor IoT", details: "Kelembaban optimal di Blok C", time: "3 hari yang lalu", type: "iot", status: "Active" },
    { id: 4, action: "Laporan Perawatan", details: "Pemupukan rutin Blok B selesai", time: "5 hari yang lalu", type: "plant", status: "Verified" },
    { id: 5, action: "Staking BMC", details: "Stake 1,000 BMC untuk Role Validator", time: "1 minggu yang lalu", type: "token", status: "Verified" },
    { id: 6, action: "Pendaftaran Mitra", details: "Pengajuan kemitraan Pemilik Bibit", time: "2 minggu yang lalu", type: "system", status: "Verified" },
    { id: 7, action: "Wallet Connected", details: "Integrasi MetaMask sukses", time: "1 bulan yang lalu", type: "system", status: "Success" },
  ];

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ paddingTop: '150px', paddingBottom: '80px' }}>
        <div className="container" style={{ marginBottom: '24px' }}>
          <BackButton to="/bamboochain" />
        </div>

        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ background: 'white', borderRadius: '32px', padding: '50px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', animation: 'fadeIn 0.5s ease-out' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Activity size={36} color="var(--primary)" /> Log Aktivitas
                </h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Riwayat lengkap interaksi Anda dalam ekosistem bambuNUSA.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #dee2e6', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                  <Filter size={18} /> Filter
                </button>
                <button style={{ padding: '10px 20px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                  <Download size={18} /> Ekspor PDF
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {allActivities.map((act, index) => (
                <div key={act.id} style={{ 
                  display: 'flex', 
                  gap: '24px', 
                  padding: '30px 0',
                  borderBottom: index === allActivities.length - 1 ? 'none' : '1px solid #f1f3f5',
                  animation: `slideUp 0.4s ease-out ${index * 0.1}s both`
                }}>
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '16px', 
                      background: act.type === 'plant' ? 'rgba(12, 166, 120, 0.1)' : act.type === 'token' ? 'rgba(245, 159, 0, 0.1)' : 'rgba(51, 154, 240, 0.1)', 
                      color: act.type === 'plant' ? 'var(--primary)' : act.type === 'token' ? '#f59f00' : '#339af0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {act.type === 'plant' && <TrendingUp size={24} />}
                      {act.type === 'token' && <Wallet size={24} />}
                      {act.type === 'iot' && <Activity size={24} />}
                      {act.type === 'system' && <ShieldCheck size={24} />}
                    </div>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 'bold' }}>{act.action}</h3>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        background: '#f8f9fa', 
                        color: 'var(--text-muted)',
                        fontWeight: '600',
                        border: '1px solid #eee'
                      }}>{act.status}</span>
                    </div>
                    <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)', fontSize: '1rem' }}>{act.details}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#adb5bd' }}>
                      <Clock size={14} /> {act.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(12, 166, 120, 0.05)', borderRadius: '20px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Seluruh aktivitas on-chain dapat diverifikasi secara independen melalui <strong>Bamboo Explorer</strong>.
              </p>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ActivityLogPage;
