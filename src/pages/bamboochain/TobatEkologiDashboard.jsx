import React, { useState, useEffect } from 'react';
import { Shield, Leaf, Droplets, Wind, Globe, TrendingUp, CheckCircle, Clock, MapPin, Award, ArrowRight, Zap, Target, Activity, Users, Briefcase, Sprout, Scissors } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGlobalSettings } from '../../hooks/useFirestoreQueries';

// Leaflet Icon Fix
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const TobatEkologiDashboard = () => {
  const { globalSettings, loadingSettings } = useGlobalSettings();
  
  // Dummy data for visual WOW factor to present to KLH
  const [metrics, setMetrics] = useState({
    targetTrees: 2000000000,
    plantedTrees: 1450200,
    survivalRate: 98.5,
    onChainVerifications: 1250,
    activeFarmers: 850
  });

  // Socio-Economic SDM Metrics
  const [sdmMetrics] = useState({
    totalJobs: 1050,
    uniqueFarmers: 850,
    roles: {
      seedProviders: 120,
      planters: 450,
      maintainers: 300,
      harvesters: 180
    }
  });

  const [mapCenter] = useState([-2.5, 118.0]); // Indonesia Center

  // Mock Locations for the Map
  const mockLocations = [
    { id: 1, name: "Kawasan Konservasi Cibarani", coords: [-6.8906, 107.6111], count: 50000, status: "Verified" },
    { id: 2, name: "Hutan Bambu Sabumi Jabar", coords: [-7.0909, 107.6688], count: 120000, status: "Verified" },
    { id: 3, name: "Restorasi Lahan Kritis Jatim", coords: [-7.9666, 112.6326], count: 350000, status: "Pending" },
    { id: 4, name: "Project Lestari Bali", coords: [-8.4095, 115.1889], count: 85000, status: "Verified" },
    { id: 5, name: "Penanaman Massal Sumut", coords: [-3.5952, 98.6722], count: 210000, status: "Verified" },
    { id: 6, name: "Inisiatif Bambu Sulsel", coords: [-5.1477, 119.4327], count: 110000, status: "Verified" },
    { id: 7, name: "Reboisasi DAS Mahakam", coords: [-0.5022, 117.1536], count: 420000, status: "Verified" },
    { id: 8, name: "Zona Penyangga IKN", coords: [-1.2227, 116.8402], count: 105200, status: "Verified" },
  ];

  // Calculate environmental impacts based on global settings and actual planted dummy
  const co2Absorbed = metrics.plantedTrees * (globalSettings?.co2Factor || 0.5); // Ton CO2
  const oxygenProduced = metrics.plantedTrees * ((globalSettings?.co2Factor || 0.5) * 0.73); // Ton O2 (roughly 73% of CO2)
  const waterRetained = metrics.plantedTrees * (globalSettings?.waterFactor || 100); // Liters
  const biomassGenerated = (metrics.plantedTrees * (globalSettings?.biomassFactor || 800)) / 1000; // Ton Biomass

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px', fontFamily: '"Inter", sans-serif' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '40px', animation: 'fadeInDown 0.8s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12, 166, 120, 0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '16px' }}>
            <Activity size={16} /> Live Web3 MRV Tracking
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 16px 0', letterSpacing: '-1px' }}>
            Tobat Ekologi <span style={{ color: 'var(--primary)' }}>2026</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0', lineHeight: '1.6' }}>
            Pemantauan Real-time Target 2 Miliar Pohon KLH Terintegrasi dengan Sistem MRV (Measurement, Reporting, Verification) berbasis Blockchain dan Data Satelit.
          </p>
        </div>

        {/* Master Progress Bar */}
        <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', marginBottom: '40px', animation: 'fadeInUp 0.8s ease 0.1s', opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Progres Nasional Tervalidasi</p>
              <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                {formatNumber(metrics.plantedTrees)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '500' }}>/ 2 Miliar Pohon</span>
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary)' }}>
                {((metrics.plantedTrees / metrics.targetTrees) * 100).toFixed(4)}%
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target Tercapai</p>
            </div>
          </div>
          
          <div style={{ width: '100%', height: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ 
              width: `${(metrics.plantedTrees / metrics.targetTrees) * 100}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #12b886, #20c997, #38d9a9)', 
              borderRadius: '8px',
              transition: 'width 2s cubic-bezier(0.1, 1, 0.2, 1)',
              minWidth: '5px'
            }}></div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)', animation: 'shimmer 2s infinite' }}></div>
          </div>
        </div>

        {/* Core Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          
          {/* Survival Rate */}
          <div style={{ background: 'linear-gradient(145deg, #1864ab, #1c7ed6)', color: 'white', padding: '24px', borderRadius: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(28, 126, 214, 0.2)', animation: 'fadeInUp 0.8s ease 0.2s', opacity: 0, animationFillMode: 'forwards' }}>
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1, transform: 'scale(2)' }}>
              <Shield size={100} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px' }}><Shield size={20} /></div>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.5px' }}>PROOF OF SURVIVAL</span>
            </div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0 0 5px 0' }}>{metrics.survivalRate}%</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Tingkat Kehidupan &gt; 6 Bulan</p>
          </div>

          {/* Carbon Absorption */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', animation: 'fadeInUp 0.8s ease 0.3s', opacity: 0, animationFillMode: 'forwards' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(250, 82, 82, 0.1)', color: '#fa5252', padding: '8px', borderRadius: '12px' }}><Wind size={20} /></div>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>SERAPAN KARBON (CO2)</span>
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 5px 0', color: 'var(--text-main)' }}>{formatNumber(co2Absorbed)} <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Ton</span></h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#fa5252', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /> Real-time Sink</p>
          </div>

          {/* Oxygen */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', animation: 'fadeInUp 0.8s ease 0.4s', opacity: 0, animationFillMode: 'forwards' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '8px', borderRadius: '12px' }}><Leaf size={20} /></div>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>PRODUKSI OKSIGEN (O2)</span>
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 5px 0', color: 'var(--text-main)' }}>{formatNumber(oxygenProduced)} <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Ton</span></h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /> Terverifikasi</p>
          </div>

          {/* Water */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', animation: 'fadeInUp 0.8s ease 0.5s', opacity: 0, animationFillMode: 'forwards' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(51, 154, 240, 0.1)', color: '#339af0', padding: '8px', borderRadius: '12px' }}><Droplets size={20} /></div>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>CADANGAN AIR TANAH</span>
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 5px 0', color: 'var(--text-main)' }}>{formatNumber(waterRetained)} <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Liter</span></h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#339af0', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /> Terkonservasi</p>
          </div>

        </div>

        {/* Socio-Economic Impact Section */}
        <div style={{ marginBottom: '40px', animation: 'fadeInUp 0.8s ease 0.55s', opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 10px 0' }}>Dampak Pemberdayaan Sosial Ekonomi</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>Sistem Terbuka (Gig Economy) mendistribusikan peran dari hulu ke hilir, memastikan serapan tenaga kerja lokal yang berkeadilan tanpa manipulasi ganda.</p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            
            {/* Top Summaries */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px', background: 'linear-gradient(135deg, #fcc419, #f59f00)', color: 'black', padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '16px' }}><Briefcase size={32} color="black" /></div>
                <div>
                  <div style={{ margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', color: 'black' }}>Total Lapangan Kerja (Gig)</div>
                  <div style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', color: 'black', lineHeight: 1 }}>{formatNumber(sdmMetrics.totalJobs)} <strong style={{ fontSize: '1rem', fontWeight: '800', color: 'black' }}>Tugas</strong></div>
                </div>
              </div>
              
              <div style={{ flex: 1, minWidth: '250px', background: 'linear-gradient(135deg, #339af0, #1c7ed6)', color: 'white', padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '16px' }}><Users size={32} /></div>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Petani Unik (Mitra)</p>
                  <h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>{formatNumber(sdmMetrics.uniqueFarmers)} <span style={{ fontSize: '1rem', fontWeight: '500' }}>Orang</span></h3>
                </div>
              </div>
            </div>

            {/* Role Breakdown */}
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Distribusi Peran Terintegrasi</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              
              {/* Seed Providers */}
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '16px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(250, 176, 5, 0.1)', color: '#fab005', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><Sprout size={24} /></div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)' }}>{formatNumber(sdmMetrics.roles.seedProviders)}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Penyedia Bibit</p>
              </div>

              {/* Planters */}
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '16px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(18, 184, 134, 0.1)', color: '#12b886', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><Leaf size={24} /></div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)' }}>{formatNumber(sdmMetrics.roles.planters)}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Petani Penanam</p>
              </div>

              {/* Maintainers */}
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '16px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(51, 154, 240, 0.1)', color: '#339af0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><Droplets size={24} /></div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)' }}>{formatNumber(sdmMetrics.roles.maintainers)}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Petani Perawat</p>
              </div>

              {/* Harvesters */}
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '16px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(250, 82, 82, 0.1)', color: '#fa5252', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><Scissors size={24} /></div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)' }}>{formatNumber(sdmMetrics.roles.harvesters)}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Petani Pemanen</p>
              </div>

            </div>

          </div>
        </div>

        {/* GIS Map and Pillar Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', marginBottom: '40px', animation: 'fadeInUp 0.8s ease 0.6s', opacity: 0, animationFillMode: 'forwards' }}>
          
          {/* GIS MAP */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={20} color="var(--primary)" /> Peta Sabuk Hijau Indonesia
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Distribusi 1,4 Juta Pohon Tervalidasi Fase 1</p>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '600' }}>
                  <span style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '50%', display: 'inline-block' }}></span> Terverifikasi Satelit
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '600' }}>
                  <span style={{ width: '10px', height: '10px', background: '#fab005', borderRadius: '50%', display: 'inline-block' }}></span> Penanaman Baru
                </div>
              </div>
            </div>

            <div style={{ height: '400px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', zIndex: 1 }}>
              <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mockLocations.map((loc) => (
                  <Marker key={loc.id} position={loc.coords} icon={defaultIcon}>
                    <Popup>
                      <div style={{ fontSize: '0.85rem', color: '#333', minWidth: '150px' }}>
                        <strong style={{ color: 'var(--primary)', display: 'block', fontSize: '1rem', marginBottom: '4px' }}>{loc.name}</strong>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span>Jumlah:</span> <strong>{formatNumber(loc.count)} Pohon</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span>Status:</span> <strong style={{ color: loc.status === 'Verified' ? 'var(--primary)' : '#fab005' }}>{loc.status}</strong>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#888', borderTop: '1px solid #eee', paddingTop: '4px', textAlign: 'center' }}>
                          On-Chain ID: 0x{Math.random().toString(16).substr(2, 8).toUpperCase()}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

        </div>

        {/* The 5 Pillars Section */}
        <div style={{ animation: 'fadeInUp 0.8s ease 0.7s', opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 10px 0' }}>5 Pilar MRV Web3 BaMbooChain</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Sistem terintegrasi yang menjamin program 2 Miliar Pohon bukan sekadar seremonial, melainkan investasi ekologi berkelanjutan.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            
            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(28, 126, 214, 0.1)', color: '#1c7ed6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Shield size={30} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-main)' }}>Smart Contract Escrow</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Dana dikunci dan dicairkan bertahap berdasarkan milestone kehidupan (Bulan 1, 6, 12).</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <CheckCircle size={30} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-main)' }}>Sabumi Tracker</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Petani memvalidasi Ground Truth dengan foto geo-tagged via aplikasi HP berhadiah BMC.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(132, 94, 247, 0.1)', color: '#845ef7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Globe size={30} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-main)' }}>Verifikasi Satelit</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Integrasi data NDVI satelit publik untuk mendeteksi tutupan kanopi secara otomatis.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(250, 176, 5, 0.1)', color: '#fab005', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Activity size={30} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-main)' }}>Dynamic AI Forecast</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Kalkulasi biomassa dan serapan karbon yang menyesuaikan kurva umur rumpun bambu.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(250, 82, 82, 0.1)', color: '#fa5252', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Target size={30} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-main)' }}>Traceability Pabrik</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Digital Product Passport (DPP) yang melacak bambu lestari dari lahan ke pabrik strip bambu.</p>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default TobatEkologiDashboard;
