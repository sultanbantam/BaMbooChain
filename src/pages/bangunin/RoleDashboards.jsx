import React, { useState } from 'react';
import { 
  Users, Building, ShieldCheck, UserCheck, Briefcase, 
  TrendingUp, CheckCircle2, AlertTriangle, FileText, 
  DollarSign, HardHat, Bus, Recycle, Calendar, ArrowUpRight, Clock,
  Bell, Send, CreditCard, ShoppingBag, Sprout, HeartPulse, Sparkles, Check, RefreshCw, Smartphone
} from 'lucide-react';
import { MBR_PROJECTS, MOCK_UNIT_MONITORING } from '../../data/banguninData';

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

export default function RoleDashboards({ currentRole = 'CONSUMER', onChangeRole }) {
  const [waReminderSent, setWaReminderSent] = useState(false);
  const [managerBroadcastSent, setManagerBroadcastSent] = useState(false);
  const [terminApproved, setTerminApproved] = useState(false);
  const [govSyncDone, setGovSyncDone] = useState(false);
  const [paidIplWithPoints, setPaidIplWithPoints] = useState(false);

  const roles = [
    { id: 'CONSUMER', label: '👤 Warga / Pembeli MBR', desc: 'Calon debitur & penghuni perumahan' },
    { id: 'DEVELOPER', label: '🏗️ Developer Properti', desc: 'Pengembang proyek & kontraktor BMW' },
    { id: 'BANK_OFFICER', label: '🏦 Bank Officer BTN', desc: 'Verifikator KPR, BMW & E-Toll BTN' },
    { id: 'PROPERTY_MANAGER', label: '🏢 Pengelola Kawasan', desc: 'Pengelola shuttle, sampah & alarm H-7' },
    { id: 'ADMIN', label: '🛡️ Super Admin BangunIn', desc: 'Monitoring ekosistem, Kopdes & audit' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* ────────── ROLE SWITCHER TOOLBAR ────────── */}
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '2px 0 0' }}>
              Simulasi Dashboard Multi-Role BangunIn (v2.0)
            </h3>
          </div>
          <span style={{ fontSize: '0.8rem', background: 'rgba(0,91,170,0.1)', color: '#005BAA', padding: '6px 14px', borderRadius: '12px', fontWeight: 'bold' }}>
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
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #005BAA' : '1px solid var(--border-color)',
                  background: isSelected ? '#005BAA' : 'var(--bg-color)',
                  color: isSelected ? '#fff' : 'var(--text-main)',
                  fontWeight: 'bold',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <span style={{ fontSize: '0.85rem' }}>{r.label}</span>
                <span style={{ fontSize: '0.7rem', opacity: isSelected ? 0.85 : 0.6, fontWeight: 'normal' }}>{r.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          ROLE 1: CONSUMER (WARGA / PEMBELI MBR)
         ══════════════════════════════════════════════════════ */}
      {currentRole === 'CONSUMER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ALARM H-7 JATUH TEMPO BANNER */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 159, 0, 0.12), rgba(217, 72, 15, 0.08))',
            border: '2px solid #f59f00',
            borderRadius: '18px',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', maxWidth: '700px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: '#f59f00',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bell size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ background: '#f59f00', color: '#fff', fontSize: '0.7rem', fontWeight: '900', padding: '2px 8px', borderRadius: '6px' }}>
                    ALARM H-7 AKTIF
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Jatuh Tempo: 19 Oktober 2026</span>
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px' }}>
                  Pengingat Tagihan KPR FLPP Bank BTN & Iuran IPL Lingkungan
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  Cicilan KPR FLPP: <strong>Rp 1.050.000 / bln</strong> (No. Rek: BTN-90218) • IPL Kawasan: <strong>Rp 75.000 / bln</strong>. Notifikasi otomatis via WhatsApp Gateway & Aplikasi BangunIn.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setPaidIplWithPoints(true)}
                disabled={paidIplWithPoints}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  background: paidIplWithPoints ? '#0ca678' : 'rgba(12, 166, 120, 0.12)',
                  color: paidIplWithPoints ? '#fff' : '#0ca678',
                  border: '1px solid #0ca678',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  cursor: paidIplWithPoints ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {paidIplWithPoints ? <Check size={16} /> : <Recycle size={16} />}
                {paidIplWithPoints ? 'IPL Terbayar via Poin' : 'Bayar IPL via Poin Sampah (750 Pts)'}
              </button>

              <button
                onClick={() => setWaReminderSent(!waReminderSent)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: waReminderSent ? '#2b8a3e' : '#005BAA',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Smartphone size={16} />
                {waReminderSent ? '✅ Notifikasi WA Terkirim' : 'Kirim Ulang Notifikasi WA'}
              </button>
            </div>
          </div>

          {/* METRIC CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Status Akad KPR BTN</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>SP3K Terbit ✅</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No: BTN-SRG-981204 • SLIK KOL-1</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Progres Fisik BMW</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#005BAA', margin: '4px 0' }}>68% Selesai</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tahap: Rangka Bambu & Plafon</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Saldo E-Toll BTN Warga</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#005BAA', margin: '4px 0' }}>Rp 125.000</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No: 6013-0182-9901-4412</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Saldo Poin Ekosistem</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#f59f00', margin: '4px 0' }}>2.640 Pts</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tukar Sembako Kopdes / Subsidi</span>
            </div>
          </div>

          {/* QUICK SHORTCUTS */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '22px',
            borderRadius: '18px',
            border: '1px solid var(--border-color)'
          }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 16px' }}>
              Akses Cepat Layanan Warga MBR
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '14px', borderRadius: '14px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Bus size={22} color="#005BAA" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-main)' }}>Shuttle E-Toll BTN</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rute Stasiun & Pasar</span>
                </div>
              </div>
              <div style={{ padding: '14px', borderRadius: '14px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShoppingBag size={22} color="#d9480f" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-main)' }}>Kopdes Merah Putih</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Beras Bulog & Minyakita</span>
                </div>
              </div>
              <div style={{ padding: '14px', borderRadius: '14px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <HeartPulse size={22} color="#fa5252" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-main)' }}>Posyandu & Ambulans</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Layanan Medis 24 Jam Gratis</span>
                </div>
              </div>
              <div style={{ padding: '14px', borderRadius: '14px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Sprout size={22} color="#0ca678" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-main)' }}>Urban Farming</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Plot Kompos & Maggot BSF</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          ROLE 2: DEVELOPER PROPERTI
         ══════════════════════════════════════════════════════ */}
      {currentRole === 'DEVELOPER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Total Proyek MBR Aktif</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#005BAA', margin: '4px 0' }}>4 Kawasan</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>770 Total Unit Terencana</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Unit Terjual / Akad KPR</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>486 Unit (63%)</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Omset: Rp 84,2 Miliar</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Termin FLPP Menunggu Validasi</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#f59f00', margin: '4px 0' }}>14 Berkas Termin</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nilai: Rp 1,4 Miliar (Termin 50% & 70%)</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Klaim Garansi (Jaminan)</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>2 Tiket Terbuka</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SLA 2x24 Jam • Skor Kepuasan 98%</span>
            </div>
          </div>

          {/* BMW PERFORMANCE SUMMARY */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '22px',
            borderRadius: '18px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
                  Ringkasan Pengawasan Kontrol BMW (Biaya, Mutu, Waktu)
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Standar kepatuhan Bank BTN FLPP & Kementerian PKP
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', background: 'rgba(12, 166, 120, 0.1)', color: '#0ca678', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold' }}>
                BMW Status: Sesuai Target (Hijau)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>1. BIAYA (RAB Absorpsi)</span>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>Realisasi Rp 72,5 Jt / Unit</div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Efisiensi 2.1% dari pagu RAB Rp 74 Jt</span>
              </div>

              <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>2. MUTU (Uji SNI Bambu & Beton)</span>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#005BAA', margin: '4px 0' }}>98.8% Lolos Uji Lab</div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>SNI 03-6839-2002 & Tahan Gempa Zona 4</span>
              </div>

              <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>3. WAKTU (Deviasi Kurva S)</span>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#2b8a3e', margin: '4px 0' }}>+1.5 Hari Lebih Cepat</div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Rencana 30 hari, estimasi selesai 28.5 hari</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>
              Daftar Proyek di Bawah Pengawasan Developer
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {MBR_PROJECTS.map(p => (
                <div key={p.id} style={{ padding: '14px 18px', borderRadius: '12px', background: 'var(--bg-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>{p.name}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.city} • No. Izin: {p.permitNumber} • Pengembang: {p.developer}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#005BAA' }}>Progres Fisik: {p.progressPercentage}%</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#0ca678' }}>Geotag Valid (±2.1m)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          ROLE 3: BANK OFFICER (BANK BTN)
         ══════════════════════════════════════════════════════ */}
      {currentRole === 'BANK_OFFICER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Penyaluran FLPP Bank BTN</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#005BAA', margin: '4px 0' }}>Rp 68,4 Miliar</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>412 Debitur MBR Aktif (Bunga 5% Fixed)</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>NPL Rate (Kredit Macet)</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>0.00% (Zero NPL)</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Didukung Ekosistem Living Warga MBR</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)', borderLeft: '4px solid #005BAA' }}>
              <span style={{ fontSize: '0.75rem', color: '#005BAA', fontWeight: 'bold' }}>Income Harian E-Toll BTN</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#005BAA', margin: '4px 0' }}>Rp 426.000 / hari</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2.840 Tap @ Rp 150 Komisi Bank BTN</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Pipeline BI Checking (SLIK OJK)</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#2b8a3e', margin: '4px 0' }}>46 Lolos (95.8%)</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2 Berkas Butuh Tambahan Dokumen</span>
            </div>
          </div>

          {/* E-TOLL BTN DAILY MONITORING BOX */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '24px',
            borderRadius: '18px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  💳 Pantauan Transaksi Harian E-Toll BTN (Simbiosis Mutualisme)
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Bank BTN menerima fee transaksi harian sebesar <strong>Rp 150 per tap</strong> dari shuttle & logistik warga perumahan MBR.
                </p>
              </div>
              <span style={{ fontSize: '0.8rem', background: 'rgba(0,91,170,0.1)', color: '#005BAA', padding: '6px 12px', borderRadius: '10px', fontWeight: 'bold' }}>
                Gateway Settlement: Realtime Host-to-Host BTN
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Volume Transaksi Hari Ini</span>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: '2px 0' }}>Rp 8.520.000</div>
                <span style={{ fontSize: '0.72rem', color: '#0ca678' }}>2.840 transaksi shuttle & logistik</span>
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Komisi Harian Bank BTN</span>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#005BAA', margin: '2px 0' }}>Rp 426.000 / hari</div>
                <span style={{ fontSize: '0.72rem', color: '#005BAA' }}>Proyeksi bulanan: Rp 12.780.000</span>
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kartu Aktif Beredar di Warga</span>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: '2px 0' }}>620 Kartu E-Toll</div>
                <span style={{ fontSize: '0.72rem', color: '#2b8a3e' }}>80.5% penetrasi debitur MBR</span>
              </div>
            </div>
          </div>

          {/* VERIFIKASI KONTROL BMW & PENCAIRAN TERMIN KPR */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '24px',
            borderRadius: '18px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
                  Verifikasi Kontrol BMW Sebelum Pencairan Termin FLPP
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Validasi Kurva S Biaya, Uji Mutu SNI, dan Ketepatan Waktu Geotag
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', background: '#e7f5ff', color: '#005BAA', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold' }}>
                Unit A1-04 • Blok Bambu Asri
              </span>
            </div>

            <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Pengajuan Termin 50% (Rangka Bambu & Atap)</strong>
                  <span style={{ background: '#d3f9d8', color: '#2b8a3e', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                    BMW Audit Passed
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Nilai Termin: <strong>Rp 35.000.000</strong> • Geotag: Lat -6.1209, Long 106.1502 (±2.1m) • Mutu SNI: 98.8% Lolos
                </div>
              </div>

              <button
                onClick={() => setTerminApproved(true)}
                disabled={terminApproved}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  background: terminApproved ? '#0ca678' : '#005BAA',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  cursor: terminApproved ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {terminApproved ? <Check size={16} /> : <ShieldCheck size={16} />}
                {terminApproved ? 'Termin 50% Dicairkan ke Rek. Developer' : 'Setujui & Cairkan Termin FLPP'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          ROLE 4: PROPERTY MANAGER (PENGELOLA KAWASAN)
         ══════════════════════════════════════════════════════ */}
      {currentRole === 'PROPERTY_MANAGER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ALARM H-7 ENGINE BROADCAST PANEL */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,91,170,0.08), rgba(245,159,0,0.08))',
            border: '2px solid #005BAA',
            borderRadius: '18px',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', maxWidth: '680px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: '#005BAA',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Send size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#005BAA', textTransform: 'uppercase' }}>
                  Gateway Otomatisasi Tagihan & IPL
                </span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: '2px 0 4px' }}>
                  Mesin Pengingat Alarm H-7 WhatsApp Gateway
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Terdeteksi <strong>14 Debitur</strong> memasuki masa H-7 jatuh tempo cicilan KPR FLPP Bank BTN & tagihan IPL kawasan (periode 19 Okt 2026).
                </p>
              </div>
            </div>

            <button
              onClick={() => setManagerBroadcastSent(true)}
              disabled={managerBroadcastSent}
              style={{
                padding: '12px 22px',
                borderRadius: '14px',
                background: managerBroadcastSent ? '#0ca678' : '#005BAA',
                color: '#fff',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '0.88rem',
                cursor: managerBroadcastSent ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0,91,170,0.25)'
              }}
            >
              {managerBroadcastSent ? <Check size={18} /> : <Send size={18} />}
              {managerBroadcastSent ? '14 Pesan WA Pengingat H-7 Berhasil Dikirim!' : '🚀 Eksekusi Broadcast Alarm H-7 (WhatsApp)'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Armada Shuttle & E-Toll</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#005BAA', margin: '4px 0' }}>4 Unit Kendaraan</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>148 Penumpang • Tap Non-Tunai</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Total Sampah Terolah</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>2.480 Kg</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Organik Kompos + Maggot BSF</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Kepatuhan IPL Warga</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>98.4% Terbayar</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auto-debit & Poin Sampah</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Urban Farming & Posyandu</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#f59f00', margin: '4px 0' }}>12 Plot Terisi</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posyandu: Jumat 16 Okt 2026</span>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            padding: '22px',
            borderRadius: '18px',
            border: '1px solid var(--border-color)'
          }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 14px' }}>
              Status Operasional Layanan Komunitas MBR
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '14px', borderRadius: '14px', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>AMBULANS 24 JAM (GRATIS)</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#0ca678', margin: '4px 0' }}>Siaga 2 Unit (Masjid & Yayasan)</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bebas biaya bagi seluruh warga MBR terdaftar</span>
              </div>
              <div style={{ padding: '14px', borderRadius: '14px', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>POSYANDU BALITA & LANSIA</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#005BAA', margin: '4px 0' }}>38 Warga Terdaftar</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Imunisasi, timbang balita, cek tensi, gizi</span>
              </div>
              <div style={{ padding: '14px', borderRadius: '14px', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>URBAN FARMING HARVEST</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#2b8a3e', margin: '4px 0' }}>Estimasi 140 Kg Panen</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kangkung, bayam, cabai & maggot BSF</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          ROLE 5: SUPER ADMIN (BANGUNIN)
         ══════════════════════════════════════════════════════ */}
      {currentRole === 'ADMIN' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Total Transaksi Ekosistem (GMV)</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#005BAA', margin: '4px 0' }}>Rp 112,8 Miliar</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>KPR, Sembako Kopdes & Komisi E-Toll</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Serapan Karbon Bambu</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>1.840 Ton CO₂e</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tervalidasi On-Chain BaMbooChain</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Mitra Kopdes Merah Putih</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#d9480f', margin: '4px 0' }}>4 Koperasi Desa</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Beras SPHP Bulog & Minyakita</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Audit Log & Keamanan</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0ca678', margin: '4px 0' }}>100% Secure</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RLS Active • UU PDP Compliant</span>
            </div>
          </div>

          {/* SINKRONISASI SUB-DB PEMERINTAH (PROGRAM 3 JUTA RUMAH) */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '24px',
            borderRadius: '18px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ background: 'rgba(0,91,170,0.1)', color: '#005BAA', fontSize: '0.72rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '6px' }}>
                  KEMITRAAN REGULATOR NASIONAL
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sub-DB 3 Terintegrasi</span>
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px' }}>
                Sinkronisasi API Program Strategis Nasional 3 Juta Rumah Rakyat
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Pelaporan berkala kepatuhan perizinan (PBG, SLF, AMDAL) dan realisasi penyerapan KPR MBR ke Kementerian Perumahan dan Kawasan Permukiman (PKP) & PUPR.
              </p>
            </div>

            <button
              onClick={() => setGovSyncDone(true)}
              disabled={govSyncDone}
              style={{
                padding: '12px 22px',
                borderRadius: '14px',
                background: govSyncDone ? '#0ca678' : '#005BAA',
                color: '#fff',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '0.88rem',
                cursor: govSyncDone ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {govSyncDone ? <Check size={18} /> : <RefreshCw size={18} />}
              {govSyncDone ? 'Sub-DB Pemerintah Tervalidasi' : '⚡ Jalankan Sinkronisasi API Pemerintah'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
