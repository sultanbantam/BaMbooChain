import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search,
  Check,
  X,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  Star
} from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';
import { PARTNER_ENTITY_TYPES } from '../../services/boomboom/mockData';

const BoomOperatorDashboardPage = () => {
  const {
    drivers,
    operators,
    incidents,
    complaints,
    pilotMetrics,
    regions,
    verifyDriverStatus,
    resolveComplaint,
    resolveSosIncident,
    togglePilotRegionStatus,
    updatePilotRegionConfig
  } = useBoomBoomStore();

  const [selectedOperatorIdx, setSelectedOperatorIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('DRIVERS');
  const [searchTerm, setSearchTerm] = useState('');
  const [resolutionInput, setResolutionInput] = useState({});

  const operatorInfo = operators[selectedOperatorIdx] || operators[0] || {
    operator_id: 'OP-001',
    name: 'BUMDes Cibarani Jaya',
    type: 'BUMDes',
    region: 'REG-CIBARANI',
    operating_area: 'Kec. Jalancagak & Cibarani, Kab. Subang',
    legal_entity: 'AHU-0019283-BUMDES.2023',
    operator_legal_status: 'Badan Usaha Milik Desa Terdaftar',
    license_reference: 'DISHUB-SBG/PILOT-KOMUNITAS/2026-01',
    compliance_status: 'COMPLIANT_VERIFIED',
    project_id: 'PRJ-CIBARANI-01',
    driver_count: 14,
    monthly_trips: 420,
    monthly_revenue: 12600000
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.plate_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCsv = () => {
    const csvHeader = "ID Pengemudi,Nama,Jenis Kendaraan,Plat Nomor,Status,Anggota KODIBA,Trips,Rating\n";
    const csvRows = drivers.map(d => `${d.driver_id},"${d.name}",${d.vehicle_type},${d.plate_number},${d.status},${d.kodiba_member ? d.kodiba_member_id : 'Non-Anggota'},${d.completed_trips},${d.rating}`).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Keuangan_Tahap3_${operatorInfo.name.replace(/\s+/g, '_')}.csv`;
    a.click();
  };

  const cardStyle = {
    background: 'var(--bg-card, #ffffff)',
    borderRadius: '20px',
    padding: '20px',
    border: '1px solid var(--border-color, #cbd5e1)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', color: 'var(--text-main, #0f172a)', minHeight: '100vh', paddingBottom: '60px' }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '1150px', margin: '24px auto', padding: '0 16px' }}>
        
        {/* OPERATOR HERO BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: '#ffffff',
          borderRadius: '28px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 12px 30px rgba(6, 78, 59, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '900', background: '#f59f00', color: '#000000', padding: '4px 10px', borderRadius: '12px' }}>
                MITRA OPERASIONAL WILAYAH (TAHAP III PILOT)
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'rgba(255,255,255,0.18)', color: '#ecfdf5', padding: '4px 10px', borderRadius: '12px' }}>
                {operatorInfo.type} • {operatorInfo.project_id || 'PRJ-CIBARANI-01'}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', background: '#10b981', color: '#ffffff', padding: '4px 10px', borderRadius: '12px' }}>
                ✓ {operatorInfo.compliance_status || 'COMPLIANT_VERIFIED'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '900', margin: '0 0 6px', color: '#ffffff' }}>
              Dasbor Operator: {operatorInfo.name}
            </h1>
            <div style={{ fontSize: '0.88rem', color: '#ecfdf5' }}>
              Wilayah Operasional: <strong>{operatorInfo.operating_area || operatorInfo.region}</strong> • Izin Referensi: <code>{operatorInfo.license_reference || 'DISHUB-PILOT/2026'}</code>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
            <select
              value={selectedOperatorIdx}
              onChange={(e) => setSelectedOperatorIdx(Number(e.target.value))}
              style={{
                background: 'rgba(15, 23, 42, 0.45)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.35)',
                padding: '8px 12px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              {operators.map((op, idx) => (
                <option key={op.operator_id} value={idx} style={{ color: '#0f172a' }}>
                  Pilih Mitra: {op.name} ({op.region})
                </option>
              ))}
            </select>

            <button
              onClick={handleExportCsv}
              style={{
                background: '#ffffff',
                color: '#047857',
                border: 'none',
                padding: '11px 18px',
                borderRadius: '14px',
                fontWeight: '800',
                fontSize: '0.83rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
              <FileSpreadsheet size={18} color="#047857" /> Ekspor Laporan Keuangan & KPI (CSV)
            </button>
          </div>
        </div>

        {/* METRICS OVERVIEW */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={cardStyle}>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-muted, #64748b)', marginBottom: '4px' }}>PENGEMUDI TERDAFTAR</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main, #0f172a)' }}>
              {drivers.length} Driver
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px', fontWeight: '700' }}>
              {drivers.filter(d => d.status === 'VERIFIED').length} Terverifikasi • {drivers.filter(d => d.kodiba_member).length} Anggota KODIBA
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-muted, #64748b)', marginBottom: '4px' }}>COMPLETION RATE & RESPON</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary, #047857)' }}>
              {pilotMetrics.trip_completion_rate_pct}% Selesai
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary, #047857)', marginTop: '4px', fontWeight: '700' }}>
              Rata-rata Respon: {pilotMetrics.avg_response_time_sec} detik ({operatorInfo.monthly_trips} Trip)
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-muted, #64748b)', marginBottom: '4px' }}>PENDAPATAN PENGEMUDI (85%)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#b45309' }}>
              Rp {Math.round(operatorInfo.monthly_revenue * 0.85).toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginTop: '4px' }}>
              Komisi BUMDes/Koperasi (5%): Rp {(operatorInfo.monthly_revenue * 0.05).toLocaleString('id-ID')}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-muted, #64748b)', marginBottom: '4px' }}>KEPUASAN WARGA (CSAT)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#059669' }}>
              {pilotMetrics.user_satisfaction_csat_pct}% (★{pilotMetrics.avg_star_rating})
            </div>
            <div style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '4px', fontWeight: '700' }}>
              {complaints.filter(c => c.status === 'OPEN').length} Tiket Masukan Aktif
            </div>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { id: 'DRIVERS', label: `Manajemen Pengemudi (${drivers.length})` },
            { id: 'INCIDENTS', label: `Insiden Keselamatan & SOS (${incidents.length})` },
            { id: 'COMPLAINTS', label: `Keluhan & Kepuasan Warga (${complaints.length})` },
            { id: 'COMPLIANCE', label: `Kepatuhan Regulasi & Zona Pilot (Tahap III)` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '14px',
                fontWeight: '800',
                fontSize: '0.84rem',
                cursor: 'pointer',
                background: activeTab === tab.id ? '#047857' : 'var(--bg-card, #ffffff)',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-main, #475569)',
                border: '1px solid var(--border-color, #cbd5e1)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: MANAGEMENT OF DRIVERS */}
        {activeTab === 'DRIVERS' && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-color, #cbd5e1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main, #0f172a)' }}>
                Verifikasi & Pengawasan Pengemudi Wilayah (Wajib Approved di Closed Pilot)
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-secondary, #f8fafc)',
                border: '1px solid var(--border-color, #cbd5e1)',
                borderRadius: '12px',
                padding: '8px 12px',
                width: '260px'
              }}>
                <Search size={16} color="var(--text-muted, #64748b)" />
                <input
                  type="text"
                  placeholder="Cari pengemudi / plat..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color, #e2e8f0)', color: 'var(--text-muted, #64748b)' }}>
                    <th style={{ padding: '12px' }}>Pengemudi</th>
                    <th style={{ padding: '12px' }}>Kendaraan & Wilayah</th>
                    <th style={{ padding: '12px' }}>Status Pilot</th>
                    <th style={{ padding: '12px' }}>Koperasi KODIBA</th>
                    <th style={{ padding: '12px' }}>Trips & Pendapatan</th>
                    <th style={{ padding: '12px' }}>Rating</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Aksi Verifikasi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map(d => (
                    <tr key={d.driver_id} style={{ borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                      <td style={{ padding: '12px', fontWeight: '700', color: 'var(--text-main, #0f172a)' }}>
                        <div>{d.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', fontWeight: 'normal' }}>{d.phone}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>{d.vehicle_brand}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981' }}>{d.plate_number} • {d.operating_region}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          background: d.status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.18)' : d.status === 'SUBMITTED' ? 'rgba(245, 159, 0, 0.18)' : 'rgba(239, 68, 68, 0.18)',
                          color: d.status === 'VERIFIED' ? '#10b981' : d.status === 'SUBMITTED' ? '#b45309' : '#dc2626'
                        }}>
                          {d.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.76rem', fontWeight: '700', color: d.kodiba_member ? '#047857' : 'var(--text-muted, #94a3b8)' }}>
                        {d.kodiba_member ? `✓ ${d.kodiba_member_id || 'Aktif'}` : 'Non-Anggota'}
                      </td>
                      <td style={{ padding: '12px', fontWeight: '700' }}>
                        <div>{d.completed_trips} Trip</div>
                        <div style={{ fontSize: '0.73rem', color: '#059669' }}>
                          Rp {(d.total_earnings_idr || d.completed_trips * 22000).toLocaleString('id-ID')}
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontWeight: '700', color: '#b45309' }}>⭐ {d.rating}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {d.status === 'SUBMITTED' || d.status === 'UNDER_REVIEW' ? (
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => verifyDriverStatus(d.driver_id, 'VERIFIED', operatorInfo.name)}
                              style={{
                                background: '#10b981',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Check size={14} /> Setujui Pilot
                            </button>
                            <button
                              onClick={() => verifyDriverStatus(d.driver_id, 'REJECTED', operatorInfo.name)}
                              style={{
                                background: '#ef4444',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                            >
                              <X size={14} /> Tolak
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)' }}>Terverifikasi</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SAFETY INCIDENTS & SOS RESOLUTION */}
        {activeTab === 'INCIDENTS' && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-color, #cbd5e1)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 16px', color: 'var(--text-main, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="#ef4444" /> Pemantauan & Tindak Lanjut Insiden Keselamatan (Metrik Safety Pilot Tahap III)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {incidents.map((inc) => (
                <div
                  key={inc.incident_id}
                  style={{
                    border: inc.status === 'OPEN' ? '2px solid #ef4444' : '1px solid var(--border-color, #e2e8f0)',
                    borderRadius: '16px',
                    padding: '16px',
                    background: inc.status === 'OPEN' ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-secondary, #f8fafc)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontWeight: '800', fontSize: '0.92rem' }}>
                      #{inc.incident_id} • {inc.type} (Trip: {inc.trip_id})
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '900',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: inc.status === 'RESOLVED' ? '#d1fae5' : '#fee2e2',
                      color: inc.status === 'RESOLVED' ? '#047857' : '#dc2626'
                    }}>
                      {inc.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-main, #334155)', margin: '0 0 8px' }}>
                    Pelapor: <strong>{inc.user_name}</strong> — {inc.description}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginBottom: '10px' }}>
                    Koordinat GPS: {inc.latitude}, {inc.longitude} • Waktu: {new Date(inc.created_at).toLocaleString('id-ID')}
                  </div>

                  {inc.resolution_note && (
                    <div style={{ fontSize: '0.78rem', background: '#d1fae5', color: '#065f46', padding: '8px 12px', borderRadius: '10px', fontWeight: '700' }}>
                      ✓ Tindak Lanjut Operator: {inc.resolution_note}
                    </div>
                  )}

                  {inc.status !== 'RESOLVED' && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Catatan tindak lanjut lapangan oleh pengurus wilayah..."
                        value={resolutionInput[inc.incident_id] || ''}
                        onChange={(e) => setResolutionInput({ ...resolutionInput, [inc.incident_id]: e.target.value })}
                        style={{
                          flex: 1,
                          minWidth: '220px',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color, #cbd5e1)',
                          fontSize: '0.8rem'
                        }}
                      />
                      <button
                        onClick={() => resolveSosIncident(
                          inc.incident_id,
                          resolutionInput[inc.incident_id] || 'Telah dicek oleh tim keamanan BUMDes/Koperasi, kondisi aman.',
                          operatorInfo.name
                        )}
                        style={{
                          background: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '10px',
                          fontWeight: '800',
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        ✓ Tandai Selesai & Aman
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COMPLAINTS & CSAT TELEMETRY */}
        {activeTab === 'COMPLAINTS' && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-color, #cbd5e1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={20} color="#059669" /> Tiket Keluhan Warga & Evaluasi Kepuasan (CSAT Tahap III)
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#b45309', padding: '6px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '900' }}>
                <Star size={15} fill="#f59f00" color="#f59f00" /> Skor CSAT Wilayah: {pilotMetrics.user_satisfaction_csat_pct}% (★{pilotMetrics.avg_star_rating}/5)
              </div>
            </div>

            {/* TOP CSAT TAGS */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {(pilotMetrics.top_csat_tags || []).map((item) => (
                <div
                  key={item.tag}
                  style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    fontSize: '0.76rem',
                    fontWeight: '800'
                  }}
                >
                  👍 {item.tag}: <span style={{ color: '#059669' }}>{item.count} apresiasi</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {complaints.map((cmp) => (
                <div
                  key={cmp.complaint_id}
                  style={{
                    border: cmp.status === 'OPEN' ? '2px solid #f59f00' : '1px solid var(--border-color, #e2e8f0)',
                    borderRadius: '16px',
                    padding: '16px',
                    background: 'var(--bg-secondary, #f8fafc)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontWeight: '800', fontSize: '0.92rem' }}>
                      #{cmp.complaint_id} • [{cmp.category}] {cmp.subject}
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '900',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: cmp.status === 'RESOLVED' ? '#d1fae5' : '#fef3c7',
                      color: cmp.status === 'RESOLVED' ? '#047857' : '#b45309'
                    }}>
                      {cmp.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-main, #334155)', margin: '0 0 8px' }}>
                    Dari: <strong>{cmp.reporter_name}</strong> (Trip #{cmp.trip_id}) — {cmp.description}
                  </p>

                  {cmp.resolution_note && (
                    <div style={{ fontSize: '0.78rem', background: '#d1fae5', color: '#065f46', padding: '8px 12px', borderRadius: '10px', fontWeight: '700' }}>
                      ✓ Solusi Operator: {cmp.resolution_note}
                    </div>
                  )}

                  {cmp.status !== 'RESOLVED' && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Tulis solusi / tindak lanjut untuk warga..."
                        value={resolutionInput[cmp.complaint_id] || ''}
                        onChange={(e) => setResolutionInput({ ...resolutionInput, [cmp.complaint_id]: e.target.value })}
                        style={{
                          flex: 1,
                          minWidth: '220px',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color, #cbd5e1)',
                          fontSize: '0.8rem'
                        }}
                      />
                      <button
                        onClick={() => resolveComplaint(
                          cmp.complaint_id,
                          resolutionInput[cmp.complaint_id] || 'Telah ditindaklanjuti oleh pengurus Koperasi/BUMDes wilayah.',
                          operatorInfo.name
                        )}
                        style={{
                          background: '#047857',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '10px',
                          fontWeight: '800',
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        ✓ Selesaikan Tiket
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REGULATORY COMPLIANCE & PILOT ZONES (TAHAP III) */}
        {activeTab === 'COMPLIANCE' && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
            border: '1px solid var(--border-color, #cbd5e1)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 8px', color: 'var(--text-main, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#059669" /> Pemisahan Peran Platform Teknologi vs Mitra Operasional Wilayah (Sesuai Bagian 17 & 26)
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted, #64748b)', margin: '0 0 20px', lineHeight: 1.5 }}>
              Dalam kerangka <strong>Tahap III (Closed Regional Pilot)</strong>, BaMbooChain berperan murni sebagai penyedia infrastruktur perangkat lunak (aplikasi, pencocokan geospasial, ledger reward BMC), sementara operasional armada di lapangan diselenggarakan oleh badan hukum lokal yang sah (BUMDes / Koperasi / Komunitas).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '22px' }}>
              <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#047857', marginBottom: '6px' }}>PERAN PLATFORM TEKNOLOGI (BAMBOOCHAIN)</div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-main, #334155)', lineHeight: 1.6 }}>
                  <li>Sistem Pemesanan, Kode BoomInstan & Peta OSRM Real-time</li>
                  <li>Server-side Fare Engine & Payment Sandbox (QRIS/Midtrans)</li>
                  <li>Pencatatan Ledger Token Reward (BMC) & Audit Trail</li>
                  <li>Bukan perusahaan angkutan umum / tidak memotong iuran paksa</li>
                </ul>
              </div>

              <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#b45309', marginBottom: '6px' }}>PERAN MITRA OPERASIONAL LOKAL ({operatorInfo.name})</div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-main, #334155)', lineHeight: 1.6 }}>
                  <li>Status Badan Hukum: <strong>{operatorInfo.operator_legal_status || operatorInfo.legal_entity}</strong></li>
                  <li>Referensi Izin Pilot: <code>{operatorInfo.license_reference || 'DISHUB-PILOT/2026'}</code></li>
                  <li>Verifikasi fisik kendaraan, SIM/STNK & pembinaan mitra driver</li>
                  <li>Penanganan keluhan warga & respons cepat sinyal darurat SOS</li>
                </ul>
              </div>
            </div>

            <h4 style={{ fontSize: '1.05rem', fontWeight: '900', margin: '0 0 12px', color: 'var(--text-main, #0f172a)' }}>
              Pengaturan Geofence Zona Pilot Terbatas & Integrasi Proyek Desa (1. JaBoDeTaBek | 2. SeCiPaLe | 3. Lainnya)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {regions.map((reg) => (
                <div
                  key={reg.id}
                  style={{
                    border: reg.status === 'ACTIVE_PILOT' ? '1.5px solid #10b981' : '1px solid var(--border-color, #cbd5e1)',
                    borderRadius: '18px',
                    padding: '16px',
                    background: reg.status === 'ACTIVE_PILOT' ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-secondary, #f8fafc)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '900', fontSize: '0.9rem', color: 'var(--text-main, #0f172a)' }}>{reg.name}</span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: '900',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: reg.status === 'ACTIVE_PILOT' ? '#d1fae5' : '#fee2e2',
                      color: reg.status === 'ACTIVE_PILOT' ? '#047857' : '#dc2626'
                    }}>
                      {reg.status}
                    </span>
                  </div>

                  {/* JIKA ZONA 3. LAINNYA: INPUT KABUPATEN/KOTA & PROVINSI */}
                  {(reg.id === 'REG-LAINNYA' || reg.zoneCategory === 'LAINNYA') ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(245, 159, 0, 0.1)', padding: '10px', borderRadius: '12px', border: '1px dashed #f59f00' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '900', color: '#b45309', marginBottom: '3px' }}>
                          Kabupaten / Kota (Lainnya) *
                        </label>
                        <input
                          type="text"
                          value={reg.regency || ''}
                          onChange={(e) => updatePilotRegionConfig(reg.id, { regency: e.target.value })}
                          placeholder="Contoh: Kab. Subang / Kota Bandung"
                          style={{ width: '100%', padding: '7px 9px', borderRadius: '8px', border: '1px solid #f59f00', fontSize: '0.76rem', fontWeight: '700', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '900', color: '#b45309', marginBottom: '3px' }}>
                          Provinsi (Lainnya) *
                        </label>
                        <input
                          type="text"
                          value={reg.province || ''}
                          onChange={(e) => updatePilotRegionConfig(reg.id, { province: e.target.value })}
                          placeholder="Contoh: Jawa Barat"
                          style={{ width: '100%', padding: '7px 9px', borderRadius: '8px', border: '1px solid #f59f00', fontSize: '0.76rem', fontWeight: '700', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted, #64748b)' }}>
                      Cakupan Wilayah: <strong>{reg.regency}</strong> ({reg.province})
                    </div>
                  )}

                  {/* DROPDOWN JENIS MITRA: BUMDes, Yayasan, Perusahaan, Organisasi, Lain-lain */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted, #475569)', marginBottom: '3px' }}>
                      Pilih Jenis Mitra Pengelola (Dropdown):
                    </label>
                    <select
                      value={reg.operatorType || 'BUMDes'}
                      onChange={(e) => updatePilotRegionConfig(reg.id, { operatorType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color, #cbd5e1)',
                        background: 'var(--bg-card, #ffffff)',
                        color: 'var(--text-main, #0f172a)',
                        fontSize: '0.78rem',
                        fontWeight: '800'
                      }}
                    >
                      {PARTNER_ENTITY_TYPES.map((pt) => (
                        <option key={pt.value} value={pt.value}>
                          {pt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {reg.operatorType === 'Lain-lain' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: '#b45309', marginBottom: '3px' }}>
                        Sebutkan Jenis Mitra Lain-lain (Bentuk Lembaga) *
                      </label>
                      <input
                        type="text"
                        value={reg.operatorCustomType || ''}
                        onChange={(e) => updatePilotRegionConfig(reg.id, { operatorCustomType: e.target.value })}
                        placeholder="Contoh: Kasepuhan Adat / Kelompok Tani Hutan / Pokdarwis"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #f59f00', fontSize: '0.76rem', fontWeight: '700', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted, #475569)', marginBottom: '3px' }}>
                      Nama Mitra & Keterangan Lain-lainnya yang Harus Diisi:
                    </label>
                    <input
                      type="text"
                      value={reg.operatorName || ''}
                      onChange={(e) => updatePilotRegionConfig(reg.id, { operatorName: e.target.value })}
                      placeholder="Nama BUMDes / Yayasan / Perusahaan / Organisasi..."
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', fontSize: '0.76rem', fontWeight: '700', marginBottom: '6px', boxSizing: 'border-box' }}
                    />
                    <input
                      type="text"
                      value={reg.operatorOtherDetails || ''}
                      onChange={(e) => updatePilotRegionConfig(reg.id, { operatorOtherDetails: e.target.value })}
                      placeholder="Rincian cakupan desa/kecamatan, izin operasional & keterangan lainnya..."
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', fontSize: '0.74rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#059669' }}>
                      Proyek: {reg.project_id || 'PRJ-01'}
                    </span>
                    <button
                      onClick={() => togglePilotRegionStatus(reg.id)}
                      style={{
                        background: reg.status === 'ACTIVE_PILOT' ? '#fef3c7' : '#10b981',
                        color: reg.status === 'ACTIVE_PILOT' ? '#b45309' : '#ffffff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.74rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {reg.status === 'ACTIVE_PILOT' ? 'Jeda Zona Pilot' : 'Aktifkan Zona'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BoomOperatorDashboardPage;
