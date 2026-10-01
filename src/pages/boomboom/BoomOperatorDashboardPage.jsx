import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search,
  Check,
  X
} from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

const BoomOperatorDashboardPage = () => {
  const { drivers, operators, incidents, verifyDriverStatus } = useBoomBoomStore();
  const [activeTab, setActiveTab] = useState('DRIVERS');
  const [searchTerm, setSearchTerm] = useState('');

  const operatorInfo = operators[0] || {
    name: 'BUMDes Cibarani Jaya',
    type: 'BUMDes',
    region: 'Perkebunan Emas Hijau Cibarani',
    driver_count: 14,
    monthly_trips: 420,
    monthly_revenue: 12600000
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.plate_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCsv = () => {
    const csvHeader = "ID Pengemudi,Nama,Jenis Kendaraan,Plat Nomor,Status,Trips,Rating\n";
    const csvRows = drivers.map(d => `${d.driver_id},"${d.name}",${d.vehicle_type},${d.plate_number},${d.status},${d.completed_trips},${d.rating}`).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Keuangan_BoomBoom_${operatorInfo.name.replace(/\s+/g, '_')}.csv`;
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', background: '#f59f00', color: '#000000', padding: '3px 10px', borderRadius: '12px' }}>
                MITRA OPERATOR TERVERIFIKASI
              </span>
              <span style={{ fontSize: '0.8rem', opacity: 0.9, color: '#ecfdf5' }}>
                {operatorInfo.type}
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0 0 4px', color: '#ffffff' }}>
              Dasbor Operator: {operatorInfo.name}
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#ecfdf5' }}>
              Wilayah Operasional: {operatorInfo.region}
            </div>
          </div>

          <button
            onClick={handleExportCsv}
            style={{
              background: '#ffffff',
              color: '#047857',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '16px',
              fontWeight: '800',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            <FileSpreadsheet size={18} color="#047857" /> Ekspor Laporan Keuangan (CSV)
          </button>
        </div>

        {/* METRICS OVERVIEW */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={cardStyle}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #64748b)', marginBottom: '4px' }}>PENGEMUDI TERDAFTAR</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main, #0f172a)' }}>
              {drivers.length} Driver
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px', fontWeight: '700' }}>
              {drivers.filter(d => d.status === 'VERIFIED').length} Terverifikasi Aktif
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #64748b)', marginBottom: '4px' }}>TOTAL TRIP BULANAN</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary, #047857)' }}>
              {operatorInfo.monthly_trips} Perjalanan
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary, #047857)', marginTop: '4px', fontWeight: '700' }}>Tingkat penyelesaian 98.2%</div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #64748b)', marginBottom: '4px' }}>NILAI TRANSAKSI WILAYAH</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#b45309' }}>
              Rp {operatorInfo.monthly_revenue.toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginTop: '4px' }}>Gross GMV Wilayah</div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #64748b)', marginBottom: '4px' }}>KOMISI OPERATOR (5%)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#d97706' }}>
              Rp {(operatorInfo.monthly_revenue * 0.05).toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '4px', fontWeight: '700' }}>Pendapatan BUMDes/Mitra</div>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('DRIVERS')}
            style={{
              padding: '10px 20px',
              borderRadius: '14px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'DRIVERS' ? '#047857' : 'var(--bg-card, #ffffff)',
              color: activeTab === 'DRIVERS' ? '#ffffff' : 'var(--text-main, #475569)',
              border: '1px solid var(--border-color, #cbd5e1)'
            }}
          >
            Manajemen Pengemudi ({drivers.length})
          </button>

          <button
            onClick={() => setActiveTab('INCIDENTS')}
            style={{
              padding: '10px 20px',
              borderRadius: '14px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'INCIDENTS' ? '#047857' : 'var(--bg-card, #ffffff)',
              color: activeTab === 'INCIDENTS' ? '#ffffff' : 'var(--text-main, #475569)',
              border: '1px solid var(--border-color, #cbd5e1)'
            }}
          >
            Laporan Insiden ({incidents.length})
          </button>
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
                Verifikasi & Pengawasan Pengemudi Wilayah
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
                    <th style={{ padding: '12px' }}>Kendaraan</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Trips Selesai</th>
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
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981' }}>{d.plate_number}</div>
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
                      <td style={{ padding: '12px', fontWeight: '700' }}>{d.completed_trips} Trip</td>
                      <td style={{ padding: '12px', fontWeight: '700', color: '#b45309' }}>⭐ {d.rating}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {d.status === 'SUBMITTED' || d.status === 'UNDER_REVIEW' ? (
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => verifyDriverStatus(d.driver_id, 'VERIFIED')}
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
                              <Check size={14} /> Verifikasi
                            </button>
                            <button
                              onClick={() => verifyDriverStatus(d.driver_id, 'REJECTED')}
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

      </div>
    </div>
  );
};

export default BoomOperatorDashboardPage;
