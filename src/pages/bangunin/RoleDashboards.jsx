import React, { useState } from 'react';
import { 
  Users, Building, ShieldCheck, UserCheck, Briefcase, 
  TrendingUp, CheckCircle2, AlertTriangle, FileText, 
  DollarSign, HardHat, Bus, Recycle, Calendar, ArrowUpRight, Clock
} from 'lucide-react';
import { MBR_PROJECTS, MOCK_UNIT_MONITORING } from '../../data/banguninData';

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

export default function RoleDashboards({ currentRole = 'CONSUMER', onChangeRole }) {
  const roles = [
    { id: 'CONSUMER', label: '👤 Warga / Pembeli MBR', desc: 'Calon debitur & penghuni perumahan' },
    { id: 'DEVELOPER', label: '🏗️ Developer Properti', desc: 'Pengembang proyek & kontraktor' },
    { id: 'BANK_OFFICER', label: '🏦 Bank Officer BTN', desc: 'Verifikator KPR & pencairan termin' },
    { id: 'PROPERTY_MANAGER', label: '🏢 Pengelola Kawasan', desc: 'Pengelola shuttle, sampah & event' },
    { id: 'ADMIN', label: '🛡️ Super Admin BangunIn', desc: 'Monitoring platform & audit trail' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Role Switcher Toolbar */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '20px',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 6px 24px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mode Pratinjau Role Pengguna</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: '2px 0 0' }}>
              Simulasi Dashboard Multi-Role BangunIn
            </h3>
          </div>
          <span style={{ fontSize: '0.8rem', background: 'rgba(0,91,170,0.1)', color: '#005BAA', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold' }}>
            Aktif: {roles.find(r => r.id === currentRole)?.label}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
          {roles.map(r => {
            const isSelected = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onChangeRole(r.id)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #005BAA' : '1px solid var(--border-color)',
                  background: isSelected ? '#005BAA' : 'var(--bg-color)',
                  color: isSelected ? '#fff' : 'var(--text-main)',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'block', fontSize: '0.85rem' }}>{r.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DASHBOARD VIEW: 1. CONSUMER */}
      {currentRole === 'CONSUMER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Status Akad KPR</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>SP3K Terbit ✅</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No. SP3K: BTN-SRG-981204</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Progres Fisik Rumah</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#005BAA', margin: '4px 0' }}>68% Selesai</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tahap: Rangka Atap & Plafon</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Saldo Poin Warga</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#f59f00', margin: '4px 0' }}>2.640 Pts</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Level: Eco Pioneer 🎋</span>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD VIEW: 2. DEVELOPER */}
      {currentRole === 'DEVELOPER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Total Proyek Aktif</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#005BAA', margin: '4px 0' }}>4 Kawasan MBR</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>770 Total Unit Terencana</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Unit Terjual / Akad</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>486 Unit (63%)</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Omset: Rp 84,2 Miliar</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Termin KPR Menunggu Verifikasi</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#f59f00', margin: '4px 0' }}>14 Berkas Termin</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nilai Pencairan: Rp 1,4 Miliar</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>
              Daftar Proyek di Bawah Pengawasan Developer
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {MBR_PROJECTS.map(p => (
                <div key={p.id} style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>{p.name}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.city} • No. Izin: {p.permitNumber}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#005BAA' }}>Progres: {p.progressPercentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD VIEW: 3. BANK OFFICER */}
      {currentRole === 'BANK_OFFICER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Penyaluran FLPP Bank BTN</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#005BAA', margin: '4px 0' }}>Rp 68,4 Miliar</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>412 Debitur MBR Aktif</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>NPL Rate (Kredit Macet)</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>0.00% (Zero NPL)</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Didukung Ekosistem Living Warga</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Antrean Verifikasi Geotag</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#f59f00', margin: '4px 0' }}>3 Berkas Siap Validasi</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Termin 50% & 70% Konstruksi</span>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD VIEW: 4. PROPERTY MANAGER */}
      {currentRole === 'PROPERTY_MANAGER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Armada Shuttle Aktif</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#005BAA', margin: '4px 0' }}>4 Unit Kendaraan</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>148 Penumpang Hari Ini</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Total Sampah Terolah</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>2.480 Kg</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daur Ulang & Maggot Center</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Kepatuhan IPL Warga</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>98.4% Terbayar</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dipotong dari Poin Bank Sampah</span>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD VIEW: 5. ADMIN */}
      {currentRole === 'ADMIN' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Total Nilai Transaksi GMV</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#005BAA', margin: '4px 0' }}>Rp 112,8 Miliar</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ekosistem MBR Nasional</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Serapan Karbon Bambu</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>1.840 Ton CO₂e</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tervalidasi On-Chain BaMbooChain</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Audit Log & Keamanan</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>100% Secure</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RLS Active • UU PDP Compliant</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
