import React, { useState } from 'react';
import { CheckCircle, XCircle, MapPin, Camera, User, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CentralValidatorDashboard = () => {
  // Mock Data for "Simulasi Dasbor"
  const [reports, setReports] = useState([
    {
      id: 'TRK-9821-PLT',
      type: 'Penanaman Baru',
      farmerName: 'Budi Santoso',
      wallet: '0x1A2b...9F4c',
      location: 'Kawasan Konservasi Cibarani',
      gps: '-6.8906, 107.6111',
      date: new Date().toLocaleDateString(),
      details: 'Menanam 50 Bibit Bambu Betung',
      reward: '10 BMC',
      photoObj: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop', // Mock plant
      photoSelfie: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop', // Mock person
      status: 'pending'
    },
    {
      id: 'TRK-8432-HRV',
      type: 'Panen Lestari (Tebang Pilih)',
      farmerName: 'Asep Ridwan',
      wallet: '0x8F4d...2E1a',
      location: 'Hutan Bambu Sabumi Jabar',
      gps: '-7.0909, 107.6688',
      date: new Date().toLocaleDateString(),
      details: 'Memanen 120 Batang Bambu (menyisakan 30% tunas muda)',
      reward: '50 BMC',
      photoObj: 'https://images.unsplash.com/photo-1600171241164-1594981e4b3d?q=80&w=600&auto=format&fit=crop', // Mock bamboo harvest
      photoSelfie: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=600&auto=format&fit=crop', // Mock person
      status: 'pending'
    }
  ]);

  const [selectedReport, setSelectedReport] = useState(null);

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  const handleAction = (id, action) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    setSelectedReport(null);
    alert(`Laporan ${id} berhasil di-${action === 'approved' ? 'Setujui' : 'Tolak'}.`);
  };

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(28, 126, 214, 0.1)', color: '#1c7ed6', padding: '6px 16px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '16px' }}>
              <ShieldCheck size={16} /> Central Validator Command Center
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 10px 0' }}>Validasi Tracker MRV</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Tinjau bukti *Ground Truth* (Foto & Selfie) untuk mencegah klaim fiktif.</p>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '15px 30px', borderRadius: '20px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: pendingCount > 0 ? '#f59f00' : 'var(--primary)' }}>{pendingCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Antrean Validasi</div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedReport ? '350px 1fr' : '1fr', gap: '30px', transition: 'all 0.3s' }}>
          
          {/* List Laporan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {reports.map((report) => (
              <div 
                key={report.id}
                onClick={() => setSelectedReport(report)}
                style={{ 
                  background: selectedReport?.id === report.id ? 'var(--bg-secondary)' : 'var(--bg-card)', 
                  border: `2px solid ${selectedReport?.id === report.id ? 'var(--primary)' : 'var(--border-color)'}`,
                  padding: '20px', 
                  borderRadius: '20px', 
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: selectedReport?.id === report.id ? '0 10px 30px rgba(12, 166, 120, 0.15)' : 'none',
                  opacity: report.status !== 'pending' ? 0.6 : 1
                }}
                onMouseEnter={(e) => { if(report.status === 'pending') e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', background: report.status === 'pending' ? '#fff9db' : (report.status === 'approved' ? '#e6fcf5' : '#fff0f0'), color: report.status === 'pending' ? '#f59f00' : (report.status === 'approved' ? 'var(--primary)' : '#fa5252'), padding: '4px 10px', borderRadius: '12px' }}>
                    {report.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{report.date}</span>
                </div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>{report.type}</h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <User size={14} /> {report.farmerName}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1c7ed6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} /> {report.location}
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Tidak ada laporan.</div>
            )}
          </div>

          {/* Panel Verifikasi (Split Screen) */}
          <AnimatePresence mode='wait'>
            {selectedReport && (
              <motion.div 
                key={selectedReport.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
              >
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem', color: 'var(--text-main)' }}>Review: {selectedReport.id}</h2>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={16} /> {selectedReport.details}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {selectedReport.gps}</span>
                    </div>
                  </div>
                  {selectedReport.status === 'pending' && (
                    <div style={{ background: '#e6fcf5', color: 'var(--primary)', padding: '10px 20px', borderRadius: '16px', fontWeight: '900', border: '1px solid var(--primary)' }}>
                      Reward: {selectedReport.reward}
                    </div>
                  )}
                </div>

                {/* Split Screen Foto */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                  <div style={{ border: '1px solid #eee', borderRadius: '20px', padding: '15px', background: 'white' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Camera size={18} color="var(--primary)" /> 1. Foto Objek (Ground Truth)
                    </div>
                    <div style={{ width: '100%', height: '300px', background: `url(${selectedReport.photoObj}) center/cover`, borderRadius: '12px' }} />
                  </div>
                  <div style={{ border: '1px solid #eee', borderRadius: '20px', padding: '15px', background: 'white' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={18} color="#1c7ed6" /> 2. Selfie Verifikasi (Proof of Identity)
                    </div>
                    <div style={{ width: '100%', height: '300px', background: `url(${selectedReport.photoSelfie}) center/cover`, borderRadius: '12px' }} />
                  </div>
                </div>

                {selectedReport.status === 'pending' ? (
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', border: '1px solid #eee' }}>
                    <h4 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={18} color="#f59f00" /> Keputusan Validator</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                      Pastikan wajah pada foto Selfie cocok dengan data KYC petani, dan foto objek (tanaman/rumpun panen) sesuai dengan metadata GPS yang dilaporkan.
                    </p>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <button 
                        onClick={() => handleAction(selectedReport.id, 'rejected')}
                        style={{ flex: 1, padding: '16px', background: 'white', color: '#fa5252', border: '2px solid #fa5252', borderRadius: '16px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <XCircle size={20} /> Tolak Laporan
                      </button>
                      <button 
                        onClick={() => handleAction(selectedReport.id, 'approved')}
                        style={{ flex: 2, padding: '16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(12, 166, 120, 0.2)' }}
                      >
                        <CheckCircle size={20} /> Approve & Cairkan {selectedReport.reward}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px', background: selectedReport.status === 'approved' ? '#e6fcf5' : '#fff0f0', color: selectedReport.status === 'approved' ? 'var(--primary)' : '#fa5252', borderRadius: '20px', fontWeight: 'bold' }}>
                    Laporan ini telah {selectedReport.status === 'approved' ? 'Disetujui' : 'Ditolak'}.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default CentralValidatorDashboard;
