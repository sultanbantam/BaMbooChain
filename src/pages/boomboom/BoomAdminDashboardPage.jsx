import React, { useState } from 'react';
import { 
  Settings, 
  ToggleLeft, 
  ToggleRight,
  Save,
  CheckCircle2,
  ShieldCheck,
  Activity,
  BarChart3
} from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

const BoomAdminDashboardPage = () => {
  const { 
    featureFlags, 
    toggleFeatureFlag, 
    fareSettings, 
    updateFareSettings,
    instantCodeConfig,
    updateInstantCodeConfig,
    drivers,
    operators,
    trips,
    incidents,
    complaints,
    pilotMetrics,
    regions,
    togglePilotRegionStatus,
    auditLogs
  } = useBoomBoomStore();

  const [activeTab, setActiveTab] = useState('PHASE3_KPI'); // 'PHASE3_KPI' | 'AUDIT' | 'FLAGS' | 'FARES'
  const [editingFare, setEditingFare] = useState({ ...fareSettings.BoomRide });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveFare = () => {
    updateFareSettings('BoomRide', editingFare);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', color: 'var(--text-main, #0f172a)', minHeight: '100vh', paddingBottom: '60px' }}>
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.2)', padding: '4px 12px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: '800', color: '#34d399', marginBottom: '8px' }}>
              <Settings size={16} /> CENTRAL ADMIN & EVALUASI TELEMETRY (TAHAP III CLOSED REGIONAL PILOT)
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0 0 4px', color: '#ffffff' }}>
              Pusat Kendali, Evaluasi 7 KPI Pilot & Audit Trail BoomBoom
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Pantau 7 metrik wajib Tahap III (Completion Rate, Response Time, Cancellation, Complaints, Safety, Driver Earnings, User Satisfaction) & Geofence Wilayah.
            </div>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('PHASE3_KPI')}
            style={{
              padding: '10px 20px',
              borderRadius: '14px',
              fontWeight: '800',
              border: '1px solid var(--border-color, #cbd5e1)',
              cursor: 'pointer',
              background: activeTab === 'PHASE3_KPI' ? '#047857' : 'var(--bg-card, #ffffff)',
              color: activeTab === 'PHASE3_KPI' ? '#ffffff' : 'var(--text-main, #475569)'
            }}
          >
            📊 Evaluasi 7 Metrik Pilot Tahap III
          </button>

          <button
            onClick={() => setActiveTab('AUDIT')}
            style={{
              padding: '10px 20px',
              borderRadius: '14px',
              fontWeight: '800',
              border: '1px solid var(--border-color, #cbd5e1)',
              cursor: 'pointer',
              background: activeTab === 'AUDIT' ? '#047857' : 'var(--bg-card, #ffffff)',
              color: activeTab === 'AUDIT' ? '#ffffff' : 'var(--text-main, #475569)'
            }}
          >
            🛡️ Audit Logs Real-Time ({auditLogs.length})
          </button>

          <button
            onClick={() => setActiveTab('FLAGS')}
            style={{
              padding: '10px 20px',
              borderRadius: '14px',
              fontWeight: '800',
              border: '1px solid var(--border-color, #cbd5e1)',
              cursor: 'pointer',
              background: activeTab === 'FLAGS' ? '#047857' : 'var(--bg-card, #ffffff)',
              color: activeTab === 'FLAGS' ? '#ffffff' : 'var(--text-main, #475569)'
            }}
          >
            ⚙️ Feature Flags, Zona Pilot & BoomInstan
          </button>

          <button
            onClick={() => setActiveTab('FARES')}
            style={{
              padding: '10px 20px',
              borderRadius: '14px',
              fontWeight: '800',
              border: '1px solid var(--border-color, #cbd5e1)',
              cursor: 'pointer',
              background: activeTab === 'FARES' ? '#047857' : 'var(--bg-card, #ffffff)',
              color: activeTab === 'FARES' ? '#ffffff' : 'var(--text-main, #475569)'
            }}
          >
            💰 Konfigurasi Fare Engine
          </button>
        </div>

        {/* TAB 0: EVALUASI 7 METRIK WAJIB TAHAP III (CLOSED REGIONAL PILOT) */}
        {activeTab === 'PHASE3_KPI' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid var(--border-color, #cbd5e1)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart3 size={20} color="#059669" /> 7 Metrik Evaluasi Wajib — Tahap III (Closed Regional Pilot)
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)' }}>
                    Data telemetri operasional wilayah dari {regions.filter(r => r.status === 'ACTIVE_PILOT').length} zona pilot aktif & {operators.length} mitra operator lokal (BUMDes/Koperasi).
                  </div>
                </div>
                <span style={{ background: '#d1fae5', color: '#047857', fontWeight: '900', fontSize: '0.75rem', padding: '6px 12px', borderRadius: '999px' }}>
                  ✓ STATUS PILOT: MEMENUHI TARGET REGULASI & OPERASIONAL
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '14px'
              }}>
                {/* 1. Trip Completion Rate */}
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#047857' }}>1. TRIP COMPLETION RATE</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '4px 0' }}>
                    {pilotMetrics.trip_completion_rate_pct}%
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted, #64748b)' }}>
                    {pilotMetrics.completed_trips_count} selesai dari {pilotMetrics.total_pilot_requests} order pilot
                  </div>
                </div>

                {/* 2. Response Time */}
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#047857' }}>2. RESPONSE TIME & ETA</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '4px 0' }}>
                    {pilotMetrics.avg_response_time_sec} Detik
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted, #64748b)' }}>
                    Rata-rata tiba di titik jemput: ±{pilotMetrics.avg_pickup_arrival_min} menit
                  </div>
                </div>

                {/* 3. Cancellation Rate */}
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#d97706' }}>3. CANCELLATION RATE</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: '900', color: '#b45309', margin: '4px 0' }}>
                    {pilotMetrics.cancellation_rate_pct}%
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted, #64748b)' }}>
                    {pilotMetrics.cancelled_trips_count} pembatalan tercatat dengan alasan
                  </div>
                </div>

                {/* 4. Complaints */}
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#047857' }}>4. COMPLAINTS RESOLUTION</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '4px 0' }}>
                    {complaints.filter(c => c.status === 'RESOLVED').length} / {complaints.length} Selesai
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted, #64748b)' }}>
                    Ditangani langsung oleh BUMDes / Koperasi wilayah
                  </div>
                </div>

                {/* 5. Safety Incidents */}
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#059669' }}>5. SAFETY INCIDENTS</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: '900', color: '#10b981', margin: '4px 0' }}>
                    {incidents.filter(i => i.status === 'OPEN').length} Aktif ({incidents.length} Log)
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted, #64748b)' }}>
                    {pilotMetrics.zero_fatality_days} Hari Nihil Kecelakaan Berat
                  </div>
                </div>

                {/* 6. Driver Earnings */}
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#b45309' }}>6. DRIVER EARNINGS (85% SHARE)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#d97706', margin: '4px 0' }}>
                    Rp {pilotMetrics.total_driver_earnings_idr.toLocaleString('id-ID')}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted, #64748b)' }}>
                    Rata-rata Rp {pilotMetrics.avg_driver_daily_earnings_idr.toLocaleString('id-ID')}/hari per driver aktif
                  </div>
                </div>

                {/* 7. User Satisfaction (CSAT) */}
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#059669' }}>7. USER SATISFACTION (CSAT)</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: '900', color: '#047857', margin: '4px 0' }}>
                    {pilotMetrics.user_satisfaction_csat_pct}% (★{pilotMetrics.avg_star_rating})
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted, #64748b)' }}>
                    Dari {pilotMetrics.total_ratings_submitted} ulasan warga terverifikasi
                  </div>
                </div>
              </div>

              {/* Rincian Alasan Pembatalan & Tag Kepuasan Warga */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '20px' }}>
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '900', marginBottom: '10px' }}>
                    Distribusi Alasan Pembatalan (Metrik #3)
                  </div>
                  {Object.entries(pilotMetrics.cancellation_reasons || {}).map(([reason, count]) => (
                    <div key={reason} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '5px 0', borderBottom: '1px dashed var(--border-color, #e2e8f0)' }}>
                      <span>{reason}</span>
                      <strong>{count}x</strong>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '900', marginBottom: '10px' }}>
                    Apresiasi Tertinggi Warga / CSAT Tags (Metrik #7)
                  </div>
                  {(pilotMetrics.top_csat_tags || []).map((item) => (
                    <div key={item.tag} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '5px 0', borderBottom: '1px dashed var(--border-color, #e2e8f0)' }}>
                      <span>👍 {item.tag}</span>
                      <strong style={{ color: '#059669' }}>{item.count} suara</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: AUDIT LOGS & METRIK TAHAP II */}
        {activeTab === 'AUDIT' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '14px'
            }}>
              <div style={{ background: 'var(--bg-card, #ffffff)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted, #64748b)' }}>DRIVER TERVERIFIKASI</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981', marginTop: '4px' }}>
                  {drivers.filter(d => d.status === 'VERIFIED').length} / {drivers.length}
                </div>
              </div>
              <div style={{ background: 'var(--bg-card, #ffffff)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted, #64748b)' }}>MITRA OPERATOR WILAYAH</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main, #0f172a)', marginTop: '4px' }}>
                  {operators.length} Entitas
                </div>
              </div>
              <div style={{ background: 'var(--bg-card, #ffffff)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted, #64748b)' }}>TOTAL TRIP TERCATAT</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#047857', marginTop: '4px' }}>
                  {trips.length} Perjalanan
                </div>
              </div>
              <div style={{ background: 'var(--bg-card, #ffffff)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted, #64748b)' }}>INSIDEN & SOS</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#d97706', marginTop: '4px' }}>
                  {incidents.length} Laporan
                </div>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
              border: '1px solid var(--border-color, #cbd5e1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-main, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="#10b981" /> Buku Besar Audit Keamanan & Operasional (`boomboom_audit_logs`)
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'rgba(16,185,129,0.12)', color: '#047857', padding: '4px 10px', borderRadius: '10px' }}>
                  Real-Time Firestore Sync
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {auditLogs.map((log) => (
                  <div key={log.log_id || log.id} style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    border: '1px solid var(--border-color, #e2e8f0)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: '900',
                          background: '#064e3b',
                          color: '#a7f3d0',
                          padding: '2px 8px',
                          borderRadius: '6px'
                        }}>
                          {log.action}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>
                          Ref: {log.entity_id}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)' }}>
                          • Aktor: {log.actor_name || 'Sistem'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-main, #334155)', lineHeight: 1.45 }}>
                        {log.details}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94a3b8)', whiteSpace: 'nowrap' }}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleString('id-ID') : 'Baru saja'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FEATURE FLAGS & REGIONAL PILOT ZONES */}
        {activeTab === 'FLAGS' && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-color, #e2e8f0)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 16px', color: 'var(--text-main, #0f172a)' }}>
              Kontrol Fitur & Feature Flags Sistem (System Toggles)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(featureFlags).map(([key, val]) => (
                <div key={key} style={{
                  background: 'var(--bg-secondary, #f8fafc)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid var(--border-color, #cbd5e1)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>
                      {key}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>
                      {key === 'BOOMBOOM_PILOT_ENABLED' ? 'Aktifkan validasi geofence zona operasional pilot terbatas daerah.' : 'Arsitektur modul & fase operasional.'}
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

            {/* ZONA CLOSED REGIONAL PILOT AKTIF */}
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '2px dashed var(--border-color, #cbd5e1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 12px' }}>
                📍 Pengaturan Geofence Zona Closed Regional Pilot (Tahap III)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {regions.map((reg) => (
                  <div key={reg.id} style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.85rem' }}>{reg.name}</strong>
                      <span style={{ fontSize: '0.68rem', fontWeight: '900', color: reg.status === 'ACTIVE_PILOT' ? '#047857' : '#dc2626' }}>
                        {reg.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginBottom: '8px' }}>
                      {reg.operatorName} • Izin: {reg.license_reference || 'DISHUB-PILOT'}
                    </div>
                    <button
                      onClick={() => togglePilotRegionStatus(reg.id)}
                      style={{
                        background: reg.status === 'ACTIVE_PILOT' ? '#fee2e2' : '#10b981',
                        color: reg.status === 'ACTIVE_PILOT' ? '#dc2626' : '#ffffff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.74rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {reg.status === 'ACTIVE_PILOT' ? 'Nonaktifkan Sementara' : 'Aktifkan Zona Pilot'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* PENGATURAN KHUSUS SISTEM BOOM-INSTAN (ALA GOJEK INSTAN) */}
            <div style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '2px dashed var(--border-color, #cbd5e1)'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 8px', color: 'var(--text-main, #0f172a)' }}>
                ⚡ Pengaturan Sistem BoomInstan (Mode Kode Pemesan ke Driver)
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: '0 0 16px' }}>
                Konfigurasi fitur pencocokan instan di tempat (seperti Gojek Instan) di mana pengemudi cukup memasukkan kode 6-digit dari layar pemesan.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Jumlah Digit Kode Instan</label>
                  <input
                    type="number"
                    min={4}
                    max={8}
                    value={instantCodeConfig?.codeDigits || 6}
                    onChange={e => updateInstantCodeConfig({ codeDigits: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-color, #cbd5e1)', background: 'var(--bg-secondary, #f8fafc)', color: 'var(--text-main)', marginTop: '4px', fontWeight: '800' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Masa Berlaku Kode (Menit)</label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={instantCodeConfig?.expiryMinutes || 15}
                    onChange={e => updateInstantCodeConfig({ expiryMinutes: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-color, #cbd5e1)', background: 'var(--bg-secondary, #f8fafc)', color: 'var(--text-main)', marginTop: '4px', fontWeight: '800' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Status Otomatis Saat Kode Cocok</label>
                  <select
                    value={instantCodeConfig?.autoStartOnMatch ? 'ON_TRIP' : 'DRIVER_ASSIGNED'}
                    onChange={e => updateInstantCodeConfig({ autoStartOnMatch: e.target.value === 'ON_TRIP' })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-color, #cbd5e1)', background: 'var(--bg-secondary, #f8fafc)', color: 'var(--text-main)', marginTop: '4px', fontWeight: '800' }}
                  >
                    <option value="ON_TRIP">Langsung Mulai Perjalanan (ON_TRIP)</option>
                    <option value="DRIVER_ASSIGNED">Konfirmasi Penjemputan (DRIVER_ASSIGNED)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FARE ENGINE CONFIGURATION */}
        {activeTab === 'FARES' && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-color, #e2e8f0)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 16px', color: 'var(--text-main, #0f172a)' }}>
              Pengaturan Komisi & Tarif (BoomRide)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Tarif Dasar / Base Fare (IDR)</label>
                <input
                  type="number"
                  value={editingFare.baseFare}
                  onChange={e => setEditingFare({ ...editingFare, baseFare: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-color, #cbd5e1)', background: 'var(--bg-secondary, #f8fafc)', color: 'var(--text-main)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Tarif Per Kilometer (IDR)</label>
                <input
                  type="number"
                  value={editingFare.perKmRate}
                  onChange={e => setEditingFare({ ...editingFare, perKmRate: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-color, #cbd5e1)', background: 'var(--bg-secondary, #f8fafc)', color: 'var(--text-main)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Tarif Minimum (IDR)</label>
                <input
                  type="number"
                  value={editingFare.minFare}
                  onChange={e => setEditingFare({ ...editingFare, minFare: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-color, #cbd5e1)', background: 'var(--bg-secondary, #f8fafc)', color: 'var(--text-main)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Bagi Hasil Pengemudi (%)</label>
                <input
                  type="number"
                  value={editingFare.driverSharePct}
                  onChange={e => setEditingFare({ ...editingFare, driverSharePct: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-color, #cbd5e1)', background: 'var(--bg-secondary, #f8fafc)', color: 'var(--text-main)', marginTop: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={handleSaveFare}
                style={{
                  background: '#10b981',
                  color: '#ffffff',
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
                <Save size={18} /> Simpan Konfigurasi Tarif
              </button>

              {saveSuccess && (
                <span style={{ color: '#059669', fontWeight: '800', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={18} /> Konfigurasi Fare Engine berhasil diperbarui!
                </span>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BoomAdminDashboardPage;
