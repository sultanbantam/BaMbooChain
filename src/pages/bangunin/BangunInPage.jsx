import React, { useState } from 'react';
import { 
  Building2, SlidersHorizontal, HardHat, HeartHandshake, 
  Users, ShieldCheck, Sparkles, ChevronRight, Award, 
  TrendingUp, CheckCircle2, Home, Landmark, Trees
} from 'lucide-react';
import BackButton from '../../components/BackButton';
import HousingDatabase from './HousingDatabase';
import HouseConfigurator from './HouseConfigurator';
import ConstructionMonitoring from './ConstructionMonitoring';
import LivingEcosystem from './LivingEcosystem';
import RoleDashboards from './RoleDashboards';

export default function BangunInPage() {
  const [activeTab, setActiveTab] = useState('database'); // 'database' | 'configurator' | 'monitoring' | 'living' | 'roles'
  const [selectedProjectForConfig, setSelectedProjectForConfig] = useState(null);
  const [userRole, setUserRole] = useState('CONSUMER'); // 'CONSUMER' | 'DEVELOPER' | 'BANK_OFFICER' | 'PROPERTY_MANAGER' | 'ADMIN'

  const handleSelectProject = (project) => {
    setSelectedProjectForConfig(project);
    setActiveTab('configurator');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleGoToMonitoring = () => {
    setActiveTab('monitoring');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height, 160px)', paddingBottom: '120px', minHeight: '100vh', background: 'var(--bg-color)', transition: 'background 0.3s' }}>
      
      {/* ────────── HERO SECTION ────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,91,170,0.08), rgba(12,166,120,0.12))',
        padding: '50px 0 60px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '40px'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <BackButton to="/" label="Kembali ke Beranda" />
          
          <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '30px',
              background: 'rgba(0,91,170,0.1)',
              color: '#005BAA',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              marginBottom: '16px'
            }}>
              <Landmark size={16} /> BTN Housingpreneur Ecosystem • 4-Pillar MBR Housing
            </div>

            <h1 style={{ fontSize: '2.8rem', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1.2', margin: '0 0 16px', letterSpacing: '-0.5px' }}>
              BangunIn: Ekosistem Digital <br />
              <span style={{ color: '#005BAA' }}>Perumahan MBR</span> & <span style={{ color: 'var(--primary)' }}>Komunitas Hijau</span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 28px' }}>
              Platform terpadu untuk Masyarakat Berpenghasilan Rendah (MBR) Indonesia: mulai dari penelusuran perumahan terverifikasi, konfigurasi desain bambu ramah gempa & KPR BTN FLPP, monitoring konstruksi berbasis geotag, hingga layanan kehidupan pasca-huni.
            </p>

            {/* Metric Highlights */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              background: 'var(--bg-card)',
              padding: '20px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '900', color: '#005BAA' }}>770+ Unit</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rumah MBR Terdaftar</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)' }}>5% Fixed</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bunga KPR FLPP Bank BTN</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '900', color: '#f59f00' }}>±2.1 Meter</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Akurasi Geotag Konstruksi</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '900', color: '#2b8a3e' }}>1.840 Ton</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Serapan Karbon CO₂e</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ────────── MAIN TABS NAVIGATION ────────── */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          padding: '8px',
          background: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.04)',
          marginBottom: '32px'
        }}>
          {[
            { id: 'database', label: '1. Database Perumahan', icon: Building2, desc: 'Katalog & Verifikasi' },
            { id: 'configurator', label: '2. Konfigurator & KPR', icon: SlidersHorizontal, desc: 'Desain & Simulasi BTN' },
            { id: 'monitoring', label: '3. Monitoring Geotag', icon: HardHat, desc: 'Progres & Inspeksi' },
            { id: 'living', label: '4. Living Community', icon: HeartHandshake, desc: 'Shuttle, Sampah, Warga' },
            { 
              id: 'roles', 
              label: (
                <>
                  5. Dashboard <br />
                  <span style={{ whiteSpace: 'nowrap' }}>Multi-Role</span>
                </>
              ), 
              icon: Users, 
              desc: '5 Peran Pengguna' 
            }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  borderRadius: '16px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #005BAA, #004080)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s',
                  minWidth: '200px'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? '#fff' : '#005BAA',
                  flexShrink: 0
                }}>
                  <Icon size={20} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', lineHeight: '1.25', marginBottom: '2px' }}>{tab.label}</span>
                  <span style={{ fontSize: '0.75rem', opacity: isActive ? 0.85 : 0.6 }}>{tab.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ────────── ACTIVE TAB VIEW ────────── */}
        <div>
          {activeTab === 'database' && (
            <HousingDatabase onSelectForConfigurator={handleSelectProject} />
          )}

          {activeTab === 'configurator' && (
            <HouseConfigurator 
              initialProject={selectedProjectForConfig} 
              onGoToMonitoring={handleGoToMonitoring} 
            />
          )}

          {activeTab === 'monitoring' && (
            <ConstructionMonitoring currentUserRole={userRole} />
          )}

          {activeTab === 'living' && (
            <LivingEcosystem />
          )}

          {activeTab === 'roles' && (
            <RoleDashboards currentRole={userRole} onChangeRole={setUserRole} />
          )}
        </div>

      </div>

    </div>
  );
}
