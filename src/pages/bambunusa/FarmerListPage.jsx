import React from 'react';
import { Users, MapPin, Leaf, CheckCircle, Search, Filter, ShieldCheck, TrendingUp, Calendar } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useVerifiedPartners } from '../../hooks/useFirestoreQueries';

const FarmerListPage = () => {
  const { data: verifiedPartners = [] } = useVerifiedPartners();
  const navigate = useNavigate();

  const staticFarmers = [
    { id: 's1', name: "Kang Dadang", area: "Tepi Cisadane", species: "Bambu Betung", trees: 450, joined: "Jan 2025", status: "Verified" },
    { id: 's2', name: "Pak Mulyana", area: "Perbukitan Cibarani", species: "Bambu Wulung", trees: 1200, joined: "Feb 2025", status: "Verified" },
    { id: 's3', name: "Teh Lilis", area: "Lembah Sukasari", species: "Bambu Tali", trees: 300, joined: "Mar 2025", status: "Verified" },
    { id: 's4', name: "Abah Jajang", area: "Tepi Cisadane", species: "Bambu Hitam", trees: 850, joined: "Apr 2025", status: "Verified" },
  ];

  // Merge static with verified new applications
  const allFarmers = [
    ...staticFarmers,
    ...verifiedPartners.map(app => ({
        id: app.id,
        name: app.name || "Anonim",
        area: app.location || "Indonesia",
        species: app.role || "Mitra",
        trees: app.details?.capacity || "TBA",
        joined: new Date(app.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        status: "Verified",
        username: app.username || app.userId || app.id
      }))
  ];

  // Deduplicate by name (case-insensitive)
  const farmers = Array.from(new Map(allFarmers.map(f => [f.name?.toLowerCase() || '', f])).values());

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ paddingTop: '250px', paddingBottom: '80px' }}>
        <div className="container" style={{ marginBottom: '24px' }}>
          <BackButton to="/" />
        </div>

        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px' }}>Daftar Mitra & Petani Binaan</h1>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Ekosistem bambuNUSA memberdayakan mitra dan petani lokal secara transparan dan berkelanjutan.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {farmers.map((farmer) => (
              <div key={farmer.id} className="glass-card" style={{ padding: '30px', animation: 'fadeIn 0.4s ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(12, 166, 120, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                    <Users size={28} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{farmer.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                      <ShieldCheck size={14} /> Mitra {farmer.status}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem' }}>
                    <MapPin size={16} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-main)' }}>{farmer.area}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem' }}>
                    <Leaf size={16} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-main)' }}>{farmer.species}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem' }}>
                    <TrendingUp size={16} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-main)' }}>Kapasitas: {farmer.trees}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem' }}>
                    <Calendar size={16} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-main)' }}>Sejak {farmer.joined}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/portfolio/${farmer.username || farmer.id}`)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(12, 166, 120, 0.05)', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(12, 166, 120, 0.05)'; e.currentTarget.style.color = 'var(--primary)'; }}
                >
                  Lihat Portofolio
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '60px', background: 'white', borderRadius: '24px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '16px' }}>Ingin Bergabung Sebagai Petani?</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 32px' }}>Dapatkan akses ke teknologi bibit unggul, pendampingan ahli, dan pasar global melalui ekosistem digital kami.</p>
            <button onClick={() => navigate('/bambunusa/join-farmer')} className="btn btn-primary" style={{ padding: '12px 32px' }}>Daftar Menjadi Mitra / Petani</button>
          </div>

          <div style={{ marginTop: '20px', background: 'rgba(245, 159, 0, 0.05)', border: '1px solid rgba(245, 159, 0, 0.2)', borderRadius: '24px', padding: '30px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
              <ShieldCheck size={28} color="#f59f00" />
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0 }}>Memiliki Keahlian di Bidang Kehutanan?</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 24px', fontSize: '0.95rem' }}>Bantu amankan ekosistem Web3 dengan melakukan verifikasi independen di lapangan. (Memerlukan Stake BMC Token).</p>
            <button onClick={() => navigate('/bambunusa/join-validator')} style={{ background: 'transparent', border: '2px solid #f59f00', color: '#f59f00', borderRadius: '12px', padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#f59f00'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f59f00'; }}>
              Bergabung sebagai Validator
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FarmerListPage;
