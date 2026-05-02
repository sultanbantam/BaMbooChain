import React, { useState } from 'react';
import { Sprout, Droplets, Scissors, Activity, ShieldCheck, MapPin, Calendar, ArrowRight, Wind, Sun, AlertCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';

const LifecyclePage = () => {
  const [activeStage, setActiveStage] = useState('plant');

  const stages = [
    { 
      id: 'plant', 
      label: 'Penanaman', 
      icon: Sprout, 
      color: '#0ca678',
      title: 'Awal Perjalanan Hijau',
      desc: 'Pemilihan bibit unggul dan penyiapan media tanam yang optimal menggunakan pupuk organik khusus Sabumi.',
      stats: [
        { label: 'Tingkat Kelangsungan', value: '98%' },
        { label: 'Kedalaman Tanam', value: '25-30 cm' },
      ]
    },
    { 
      id: 'maintain', 
      label: 'Pemeliharaan', 
      icon: Droplets, 
      color: '#339af0',
      title: 'Pertumbuhan Terpantau',
      desc: 'Pemantauan real-time melalui sensor IoT untuk kelembaban, nutrisi tanah, dan perlindungan dari hama pengganggu.',
      stats: [
        { label: 'Frekuensi Air', value: 'Kontinyu (IoT)' },
        { label: 'Check-in Bulanan', value: 'Wajib' },
      ]
    },
    { 
      id: 'harvest', 
      label: 'Pemanenan', 
      icon: Scissors, 
      color: '#f59f00',
      title: 'Pemanfaatan Lestari',
      desc: 'Pemanenan selektif hanya pada batang yang sudah matang (umur 3-5 tahun) untuk menjaga regenerasi rumpun tetap optimal.',
      stats: [
        { label: 'Siklus Panen', value: 'Tiap 4 Tahun' },
        { label: 'Hasil per Rumpun', value: '3-5 Batang' },
      ]
    }
  ];

  const currentStage = stages.find(s => s.id === activeStage);

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ paddingTop: '250px', paddingBottom: '80px' }}>
        <div className="container" style={{ marginBottom: '24px' }}>
          <BackButton to="/bamboochain" />
        </div>

        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '16px', display: 'inline-block' }}>
              Siklus Hidup bambuNUSA
            </span>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>Pantau Setiap Tunas yang Tumbuh</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
              Teknologi blockchain kami merinci setiap tahap pertumbuhan, dari bibit di polybag hingga menjadi material konstruksi yang megah.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 2fr)', gap: '40px', alignItems: 'start' }}>
            
            {/* Sidebar Stage Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stages.map((stage) => {
                const isActive = activeStage === stage.id;
                return (
                  <button 
                    key={stage.id}
                    onClick={() => setActiveStage(stage.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', borderRadius: '24px', background: 'white', border: isActive ? `2px solid ${stage.color}` : '1px solid #f1f3f5', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: isActive ? `0 10px 30px ${stage.color}15` : '0 4px 12px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ background: isActive ? stage.color : '#f8f9fa', color: isActive ? 'white' : '#adb5bd', padding: '12px', borderRadius: '16px', transition: 'all 0.3s' }}>
                      <stage.icon size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>{stage.label}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Fase {stages.indexOf(stage) + 1}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Stage Detail Display */}
            <div style={{ background: 'white', borderRadius: '32px', padding: '50px', boxShadow: '0 20px 60px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: `${currentStage.color}08`, borderRadius: '50%' }}></div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '24px' }}>{currentStage.title}</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '40px' }}>{currentStage.desc}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                  {currentStage.stats.map((stat, i) => (
                    <div key={i} style={{ background: '#f8f9fa', padding: '24px', borderRadius: '20px', border: '1px solid #f1f3f5' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{stat.label}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: currentStage.color }}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(12, 166, 120, 0.05)', padding: '24px', borderRadius: '20px', marginBottom: '40px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <ShieldCheck size={32} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Terverifikasi On-Chain</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Setiap input data oleh petani divalidasi oleh Validator BMC kami.</div>
                  </div>
                </div>

                <button 
                  onClick={() => window.location.href = '/bamboochain/plantation'}
                  className="btn btn-primary" style={{ padding: '16px 40px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                  Mulai Tanam Sekarang <ArrowRight size={20} />
                </button>
              </div>
            </div>

          </div>

          {/* Environmental Stats Counter */}
          <div style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              { label: 'CO2 Terencana', value: '45,000 Ton', icon: Wind, color: '#4dabf7' },
              { label: 'Luas Restorasi', value: '1,200 Ha', icon: MapPin, color: '#0ca678' },
              { label: 'Hari Penanaman', value: '1,450 Hari', icon: Sun, color: '#fab005' },
              { label: 'Status Ekosistem', value: 'Optimal', icon: Activity, color: '#f03e3e' },
            ].map((metric, i) => (
              <div key={metric.label} style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', textAlign: 'center' }}>
                <div style={{ color: metric.color, marginBottom: '16px' }}>
                  <metric.icon size={32} style={{ margin: '0 auto' }} />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{metric.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)' }}>{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LifecyclePage;
