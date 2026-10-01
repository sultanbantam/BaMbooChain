import React, { useState } from 'react';
import { 
  Settings, 
  BarChart3, 
  Users, 
  Car, 
  Building2, 
  DollarSign, 
  ShieldAlert, 
  Award, 
  ToggleLeft, 
  ToggleRight,
  Save,
  CheckCircle2
} from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

const BoomAdminDashboardPage = () => {
  const { 
    featureFlags, 
    toggleFeatureFlag, 
    fareSettings, 
    updateFareSettings,
    drivers,
    operators,
    trips,
    rewards,
    incidents
  } = useBoomBoomStore();

  const [activeTab, setActiveTab] = useState('FLAGS'); // 'FLAGS' | 'FARES' | 'METRICS'
  const [editingFare, setEditingFare] = useState({ ...fareSettings.BoomRide });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveFare = () => {
    updateFareSettings('BoomRide', editingFare);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', paddingBottom: '60px' }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '1150px', margin: '24px auto', padding: '0 20px' }}>
        
        {/* CENTRAL ADMIN HERO */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          borderRadius: '28px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: '800', color: '#38bdf8', marginBottom: '8px' }}>
              <Settings size={16} /> CENTRAL ADMIN CONTROL PANEL
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0 0 4px' }}>
              Pengaturan Sistem & Feature Flags BoomBoom
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Kelola parameter fare engine, regional pilot zones, dan modul desentralisasi.
            </div>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('FLAGS')}
            style={{
              padding: '10px 20px',
              borderRadius: '14px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'FLAGS' ? '#0f172a' : '#ffffff',
              color: activeTab === 'FLAGS' ? 'white' : '#475569'
            }}
          >
            Feature Flags & Regional Pilot
          </button>

          <button
            onClick={() => setActiveTab('FARES')}
            style={{
              padding: '10px 20px',
              borderRadius: '14px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'FARES' ? '#0f172a' : '#ffffff',
              color: activeTab === 'FARES' ? 'white' : '#475569'
            }}
          >
            Konfigurasi Fare Engine
          </button>
        </div>

        {/* TAB 1: FEATURE FLAGS */}
        {activeTab === 'FLAGS' && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-color, #e2e8f0)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 16px', color: '#0f172a' }}>
              Kontrol Fitur & Feature Flags Sistem (System Toggles)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(featureFlags).map(([key, val]) => (
                <div key={key} style={{
                  background: '#f8fafc',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1'
                }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
                      {key}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {key === 'BOOMBOOM_PILOT_ENABLED' ? 'Aktifkan zona operasional pilot terbatas daerah.' : 'Arsitektur modul opsional.'}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFeatureFlag(key)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '1rem',
                      fontWeight: '800',
                      color: val ? '#10b981' : '#64748b'
                    }}
                  >
                    {val ? <ToggleRight size={38} color="#10b981" /> : <ToggleLeft size={38} color="#94a3b8" />}
                    <span>{val ? 'ON (AKTIF)' : 'OFF (NONAKTIF)'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: FARE ENGINE CONFIGURATION */}
        {activeTab === 'FARES' && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-color, #e2e8f0)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 16px', color: '#0f172a' }}>
              Pengaturan Komisi & Tarif (BoomRide)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Tarif Dasar / Base Fare (IDR)</label>
                <input
                  type="number"
                  value={editingFare.baseFare}
                  onChange={e => setEditingFare({ ...editingFare, baseFare: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Tarif Per KM (IDR)</label>
                <input
                  type="number"
                  value={editingFare.perKm}
                  onChange={e => setEditingFare({ ...editingFare, perKm: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Persentase Platform Fee (%)</label>
                <input
                  type="number"
                  value={editingFare.platformFeePct}
                  onChange={e => setEditingFare({ ...editingFare, platformFeePct: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Persentase Mitra Wilayah (%)</label>
                <input
                  type="number"
                  value={editingFare.operatorFeePct}
                  onChange={e => setEditingFare({ ...editingFare, operatorFeePct: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
              </div>
            </div>

            <button
              onClick={handleSaveFare}
              style={{
                background: saveSuccess ? '#059669' : '#10b981',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
              {saveSuccess ? 'Simpan Berhasil!' : 'Simpan Perubahan Tarif'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BoomAdminDashboardPage;
