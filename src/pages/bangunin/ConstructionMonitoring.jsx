import React, { useState } from 'react';
import { 
  HardHat, MapPin, CheckCircle2, Clock, Camera, ShieldCheck, 
  ExternalLink, Download, FileText, Upload, AlertCircle, Eye, 
  ChevronRight, Sparkles, Check, Hash, RefreshCw, BarChart3, 
  Wrench, TrendingUp, AlertTriangle, Shield, Plus, X
} from 'lucide-react';
import { MOCK_UNIT_MONITORING, MOCK_BMW_TRACKING, MOCK_WARRANTY_CLAIMS } from '../../data/banguninData';

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

export default function ConstructionMonitoring({ currentUserRole = 'CONSUMER' }) {
  const [unitData, setUnitData] = useState(MOCK_UNIT_MONITORING);
  const [selectedMilestone, setSelectedMilestone] = useState(unitData.milestones[2]); // Default milestone in progress
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // V2.0 Tab State: 'MILESTONES' | 'BMW' | 'WARRANTY'
  const [monitoringTab, setMonitoringTab] = useState('MILESTONES');

  // V2.0 Warranty Claims State
  const [warrantyClaims, setWarrantyClaims] = useState(MOCK_WARRANTY_CLAIMS);
  const [showAddWarrantyModal, setShowAddWarrantyModal] = useState(false);
  const [newClaimTitle, setNewClaimTitle] = useState('');
  const [newClaimCategory, setNewClaimCategory] = useState('Atap & Saluran Air');
  const [newClaimDesc, setNewClaimDesc] = useState('');

  // New Update Form State (For Developer)
  const [newUpdateNotes, setNewUpdateNotes] = useState('');
  const [newUpdatePhoto, setNewUpdatePhoto] = useState('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80');
  const [isCapturingGeo, setIsCapturingGeo] = useState(false);
  const [capturedGeo, setCapturedGeo] = useState({ lat: -6.12005, lng: 106.15034, accuracy: 2.4 });

  const handleCaptureGeotag = () => {
    setIsCapturingGeo(true);
    setTimeout(() => {
      setIsCapturingGeo(false);
      setCapturedGeo({
        lat: -6.12005 + (Math.random() - 0.5) * 0.0001,
        lng: 106.15034 + (Math.random() - 0.5) * 0.0001,
        accuracy: 1.8
      });
      alert('📍 GPS Geotag & EXIF Timestamp Berhasil Ditangkap dari Perangkat Sensor Lapangan!');
    }, 800);
  };

  const handleBankApproval = (milestoneId) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setShowVerifyModal(false);
      setUnitData(prev => ({
        ...prev,
        overallProgress: Math.min(100, prev.overallProgress + 15),
        milestones: prev.milestones.map(m => m.id === milestoneId ? { ...m, status: 'VERIFIED', completedAt: 'Hari Ini' } : m)
      }));
      alert('✅ Verifikasi Inspeksi Lapangan Disetujui! Trigger Pencairan Termin KPR BTN Berhasil Dieksekusi ke Rekening Escrow Developer.');
    }, 1200);
  };

  const handleDownloadPdf = () => {
    alert('📄 Mengunduh Berita Acara Progres Konstruksi & Sertifikat Geotag Terverifikasi (PDF)...');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Unit Overview Card */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '26px',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', padding: '4px 12px', background: 'rgba(0,91,170,0.1)', color: '#005BAA', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>
              <HardHat size={14} style={{ marginRight: '6px' }} /> Monitoring Konstruksi Real-Time
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 4px' }}>
              {unitData.projectName} — {unitData.blockNumber}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Pemilik: <strong>{unitData.buyerName}</strong> | No. SP3K BTN: <span style={{ fontFamily: 'monospace' }}>{unitData.sp3kNumber}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleDownloadPdf}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-color)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={16} /> Unduh Laporan PDF
            </button>

            {(currentUserRole === 'DEVELOPER' || currentUserRole === 'ADMIN') && (
              <button
                onClick={() => setShowUploadModal(true)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#005BAA',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Upload size={16} /> Upload Progres Lapangan
              </button>
            )}

            {(currentUserRole === 'BANK_OFFICER' || currentUserRole === 'ADMIN') && (
              <button
                onClick={() => setShowVerifyModal(true)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#0ca678',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ShieldCheck size={16} /> Verifikasi & Cairkan Termin BTN
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar & Key Stats */}
        <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
              Total Progres Fisik Bangunan
            </span>
            <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#005BAA' }}>
              {unitData.overallProgress}% Selesai
            </span>
          </div>

          <div style={{ width: '100%', height: '12px', background: 'var(--border-color)', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ width: `${unitData.overallProgress}%`, height: '100%', background: 'linear-gradient(90deg, #005BAA, #0ca678)', borderRadius: '6px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Tahap Pencairan KPR:</span>
              <strong style={{ color: '#0ca678' }}>{unitData.kprDisbursementStage}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Target Serah Terima Kunci:</span>
              <strong>{unitData.targetHandoverDate}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Audit Kontrak Web3:</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {unitData.blockchainAuditContract.slice(0, 10)}...{unitData.blockchainAuditContract.slice(-8)} (Polygon Verified)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ────────── MONITORING SUB-TABS (v2.0) ────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        background: 'var(--bg-card)',
        padding: '6px',
        borderRadius: '16px',
        border: '1px solid var(--border-color)'
      }}>
        <button
          onClick={() => setMonitoringTab('MILESTONES')}
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            border: 'none',
            background: monitoringTab === 'MILESTONES' ? '#005BAA' : 'transparent',
            color: monitoringTab === 'MILESTONES' ? '#fff' : 'var(--text-main)',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Clock size={18} /> 1. Timeline & Geotag Progres
        </button>

        <button
          onClick={() => setMonitoringTab('BMW')}
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            border: 'none',
            background: monitoringTab === 'BMW' ? '#005BAA' : 'transparent',
            color: monitoringTab === 'BMW' ? '#fff' : 'var(--text-main)',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <BarChart3 size={18} /> 2. Kontrol BMW (Biaya, Mutu, Waktu)
        </button>

        <button
          onClick={() => setMonitoringTab('WARRANTY')}
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            border: 'none',
            background: monitoringTab === 'WARRANTY' ? '#005BAA' : 'transparent',
            color: monitoringTab === 'WARRANTY' ? '#fff' : 'var(--text-main)',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <ShieldAlert size={18} /> 3. Jaminan Pembangunan
        </button>
      </div>

      {/* VIEW 1: MILESTONES TIMELINE & DETAIL */}
      {monitoringTab === 'MILESTONES' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Milestones Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px' }}>
            Tahapan Milestone Konstruksi
          </h3>

          {unitData.milestones.map((ms, index) => {
            const isSelected = selectedMilestone?.id === ms.id;
            const statusBadge = {
              VERIFIED: { bg: 'rgba(12,166,120,0.1)', color: '#0ca678', label: 'Terverifikasi Bank BTN' },
              IN_PROGRESS: { bg: 'rgba(0,91,170,0.1)', color: '#005BAA', label: 'Sedang Berlangsung' },
              PENDING: { bg: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)', label: 'Menunggu Jadwal' }
            }[ms.status];

            return (
              <div 
                key={ms.id}
                onClick={() => setSelectedMilestone(ms)}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  border: isSelected ? '2px solid #005BAA' : '1px solid var(--border-color)',
                  boxShadow: isSelected ? '0 8px 24px rgba(0,91,170,0.1)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: ms.status === 'VERIFIED' ? '#0ca678' : ms.status === 'IN_PROGRESS' ? '#005BAA' : 'var(--border-color)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}>
                    {ms.status === 'VERIFIED' ? <Check size={16} /> : index + 1}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 4px' }}>
                      {ms.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: statusBadge.color, background: statusBadge.bg, padding: '2px 8px', borderRadius: '6px' }}>
                      {statusBadge.label}
                    </span>
                  </div>
                </div>

                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            );
          })}
        </div>

        {/* Selected Milestone Inspection Detail Card */}
        {selectedMilestone && (
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Bukti Geotag & Inspeksi Lapangan
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-color)', padding: '4px 8px', borderRadius: '6px' }}>
                Bobot: {selectedMilestone.weight}%
              </span>
            </div>

            {/* Geotag & EXIF Verification Badge */}
            {selectedMilestone.geotag ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(12,166,120,0.08), rgba(0,91,170,0.06))',
                border: '1px solid rgba(12,166,120,0.2)',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0ca678', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <ShieldCheck size={18} /> GPS Geotag & Waktu EXIF Terverifikasi
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div>📍 Koordinat: <strong>{selectedMilestone.geotag.lat.toFixed(5)}, {selectedMilestone.geotag.lng.toFixed(5)}</strong></div>
                  <div>🎯 Akurasi GPS: <strong>±{selectedMilestone.geotag.accuracyMeters} Meter</strong></div>
                  <div>👤 Inspektur: <strong>{selectedMilestone.inspector || 'Pengawas Lapangan'}</strong></div>
                  <div>🗓️ Tanggal: <strong>{selectedMilestone.completedAt || 'Dalam Pengerjaan'}</strong></div>
                </div>

                {selectedMilestone.blockchainTx && (
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ⛓️ On-Chain Proof Hash: <span style={{ fontFamily: 'monospace', color: '#005BAA' }}>{selectedMilestone.blockchainTx.slice(0, 24)}...</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                Tahapan ini belum dimulai / belum ada bukti geotag terunggah.
              </div>
            )}

            {/* Photos Gallery */}
            {selectedMilestone.photos && selectedMilestone.photos.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px' }}>
                  Foto Dokumentasi Fisik di Titik GPS:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  {selectedMilestone.photos.map((ph, idx) => (
                    <div key={idx} style={{ height: '110px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <img src={ph} alt="foto progres" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedMilestone.notes && (
              <div style={{ background: 'var(--bg-color)', padding: '14px', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                <strong>Catatan Pengawas:</strong> {selectedMilestone.notes}
              </div>
            )}
          </div>
        )}

      </div>
      )}

      {/* VIEW 2: KONTROL BMW (BIAYA, MUTU, WAKTU) */}
      {monitoringTab === 'BMW' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top 3 Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* 1. BIAYA */}
            <div style={{ background: 'var(--bg-card)', padding: '22px', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#005BAA', textTransform: 'uppercase' }}>💰 1. Kontrol Biaya (RAB)</span>
                <span style={{ background: 'rgba(12,166,120,0.1)', color: '#0ca678', fontSize: '0.75rem', fontWeight: 'bold', padding: '3px 8px', borderRadius: '8px' }}>
                  On Track (+{MOCK_BMW_TRACKING.biaya.variancePercent}%)
                </span>
              </div>
              <h4 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 4px' }}>
                {formatRupiah(MOCK_BMW_TRACKING.biaya.actualSpending)}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 12px' }}>
                Pagu RAB: <strong>{formatRupiah(MOCK_BMW_TRACKING.biaya.rabTarget)}</strong> ({MOCK_BMW_TRACKING.biaya.absorptionPercent}% Serapan)
              </p>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${MOCK_BMW_TRACKING.biaya.absorptionPercent}%`, height: '100%', background: '#005BAA', borderRadius: '4px' }} />
              </div>
            </div>

            {/* 2. MUTU */}
            <div style={{ background: 'var(--bg-card)', padding: '22px', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#0ca678', textTransform: 'uppercase' }}>📐 2. Kontrol Mutu (SNI)</span>
                <span style={{ background: 'rgba(12,166,120,0.1)', color: '#0ca678', fontSize: '0.75rem', fontWeight: 'bold', padding: '3px 8px', borderRadius: '8px' }}>
                  Kualitas Sangat Baik
                </span>
              </div>
              <h4 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0ca678', margin: '0 0 4px' }}>
                {MOCK_BMW_TRACKING.mutu.qualityScore}% Lulus
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 12px' }}>
                5/5 Pengujian Standar PUPR & Laboratorium Selesai Sempurna
              </p>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${MOCK_BMW_TRACKING.mutu.qualityScore}%`, height: '100%', background: '#0ca678', borderRadius: '4px' }} />
              </div>
            </div>

            {/* 3. WAKTU */}
            <div style={{ background: 'var(--bg-card)', padding: '22px', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#f59f00', textTransform: 'uppercase' }}>⏱️ 3. Kontrol Waktu (Kurva S)</span>
                <span style={{ background: 'rgba(245,159,0,0.1)', color: '#f59f00', fontSize: '0.75rem', fontWeight: 'bold', padding: '3px 8px', borderRadius: '8px' }}>
                  +{MOCK_BMW_TRACKING.waktu.scheduleVarianceDays} Hari Lebih Cepat
                </span>
              </div>
              <h4 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 4px' }}>
                Sisa 34 Hari Kerja
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 12px' }}>
                Target Serah Terima Kunci (BAST): <strong>{MOCK_BMW_TRACKING.waktu.targetCompletionDate}</strong>
              </p>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: '#f59f00', borderRadius: '4px' }} />
              </div>
            </div>
          </div>

          {/* Detailed BMW Checklists */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Tahapan Termin Biaya */}
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💵 Rincian Termin Pencairan KPR Bank BTN
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {MOCK_BMW_TRACKING.biaya.stages.map((stage, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-color)' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-main)' }}>{stage.name}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stage.date}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#005BAA' }}>{formatRupiah(stage.amount)}</span>
                      <span style={{
                        display: 'block',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        color: stage.status === 'DISBURSED' ? '#0ca678' : (stage.status === 'IN_REVIEW' ? '#f59f00' : 'var(--text-muted)')
                      }}>
                        {stage.status === 'DISBURSED' ? 'Cair ke Rekening Escrow' : (stage.status === 'IN_REVIEW' ? 'Verifikasi Bank BTN' : 'Menunggu Target')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist Pengujian Mutu SNI */}
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📋 Checklist Standar Kualitas & Mutu PU
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {MOCK_BMW_TRACKING.mutu.checklists.map((chk, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-color)' }}>
                    <CheckCircle2 color="#0ca678" size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-main)' }}>{chk.item}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#0ca678', fontWeight: 'bold' }}>{chk.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: JAMINAN PEMBANGUNAN (WARRANTY CLAIMS) */}
      {monitoringTab === 'WARRANTY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#0ca678', textTransform: 'uppercase' }}>🛡️ Jaminan Pembangunan BangunIn</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main)', margin: '2px 0 4px' }}>
                Masa Pemeliharaan & Klaim Garansi Kerusakan
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Garansi struktur 10 tahun dan garansi pemeliharaan 100 hari kerja pasca-serah terima kunci (BAST) dengan SLA respon 2x24 jam.
              </p>
            </div>

            <button
              onClick={() => setShowAddWarrantyModal(true)}
              style={{
                padding: '12px 20px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #005BAA, #0ca678)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={18} /> Ajukan Laporan Kerusakan
            </button>
          </div>

          {/* Warranty Claims List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {warrantyClaims.map(claim => (
              <div key={claim.id} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>{claim.category} • Diajukan: {claim.submittedDate}</span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '2px 0' }}>{claim.title}</h4>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    background: claim.status === 'RESOLVED' ? 'rgba(12,166,120,0.1)' : 'rgba(245,159,0,0.1)',
                    color: claim.status === 'RESOLVED' ? '#0ca678' : '#f59f00'
                  }}>
                    {claim.status === 'RESOLVED' ? 'Selesai Diperbaiki ✅' : 'Dalam Penanganan (SLA 2x24 Jam) ⏳'}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: '1.5' }}>
                  "{claim.description}"
                </p>

                <div style={{ background: 'var(--bg-color)', padding: '12px 16px', borderRadius: '12px', fontSize: '0.8rem', borderLeft: '4px solid #005BAA' }}>
                  <strong>Respon Developer:</strong> {claim.developerResponse}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD WARRANTY CLAIM MODAL */}
      {showAddWarrantyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 100020,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            width: '100%',
            maxWidth: '540px',
            padding: '28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px' }}>
              Form Laporan Kerusakan Masa Pemeliharaan
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 16px' }}>
              Tim teknisi developer akan menindaklanjuti dalam batas waktu SLA maksimal 2x24 jam kerja.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Kategori Kerusakan:</label>
                <select
                  value={newClaimCategory}
                  onChange={e => setNewClaimCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                >
                  <option value="Atap & Saluran Air">Atap, Genteng & Saluran Air</option>
                  <option value="Dinding & Plester">Dinding Retak Rambut & Plester</option>
                  <option value="Kusen & Pintu">Kusen, Engsel & Kunci Pintu</option>
                  <option value="Sanitasi & Pipa">Kran, Pipa Air & Sanitasi</option>
                  <option value="Kelistrikan">Saklar & Instalasi Listrik</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Judul Singkat Kerusakan:</label>
                <input
                  type="text"
                  value={newClaimTitle}
                  onChange={e => setNewClaimTitle(e.target.value)}
                  placeholder="Misal: Rembes air hujan di pojok plafon ruang tamu"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Penjelasan Detail:</label>
                <textarea
                  rows={3}
                  value={newClaimDesc}
                  onChange={e => setNewClaimDesc(e.target.value)}
                  placeholder="Jelaskan kondisi kerusakan dan waktu terjadinya..."
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowAddWarrantyModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (!newClaimTitle) return alert('Mohon isi judul kerusakan!');
                  const newTicket = {
                    id: `war-${Date.now().toString().slice(-4)}`,
                    unitId: unitData.unitId,
                    title: newClaimTitle,
                    category: newClaimCategory,
                    description: newClaimDesc || 'Laporan baru diajukan oleh pemilik rumah.',
                    submittedDate: 'Hari Ini',
                    slaDeadline: '2x24 Jam Kerja',
                    status: 'IN_PROGRESS',
                    developerResponse: 'Laporan telah diteruskan ke Supervisor Pemeliharaan PT. Katama.',
                    resolvedAt: null
                  };
                  setWarrantyClaims([newTicket, ...warrantyClaims]);
                  setShowAddWarrantyModal(false);
                  setNewClaimTitle('');
                  setNewClaimDesc('');
                  alert('✅ Laporan Garansi Berhasil Diajukan! Teknisi developer dijadwalkan hadir dalam 2x24 jam.');
                }}
                style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: '#0ca678', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Kirim Laporan Kerusakan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEVELOPER UPLOAD MODAL */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 100020,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            width: '100%',
            maxWidth: '560px',
            padding: '28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 8px' }}>
              Upload Update Progres Konstruksi (Developer)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 16px' }}>
              Wajib menyertakan foto fisik dan mengaktifkan izin GPS Geotag kamera untuk verifikasi inspeksi bank.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Tahapan Milestone:</label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}>
                  {unitData.milestones.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Catatan Lapangan & Material:</label>
                <textarea 
                  rows={3}
                  value={newUpdateNotes}
                  onChange={e => setNewUpdateNotes(e.target.value)}
                  placeholder="Misal: Pengecoran sloof selesai, material bambu laminasi terkirim 100 batang..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', resize: 'vertical' }}
                />
              </div>

              {/* Geotag Capture Button */}
              <div style={{ background: 'var(--bg-color)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>Geotag GPS Lokasi Proyek</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Lat: {capturedGeo.lat.toFixed(5)}, Lng: {capturedGeo.lng.toFixed(5)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCaptureGeotag}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: '#005BAA', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {isCapturingGeo ? 'Mengambil GPS...' : 'Ambil GPS'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  alert('✅ Update Progres Berhasil Diunggah! Menunggu persetujuan Bank Officer BTN.');
                }}
                style={{ flex: 2, padding: '10px', borderRadius: '10px', border: 'none', background: '#0ca678', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Simpan & Kirim ke Bank BTN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BANK OFFICER VERIFICATION MODAL */}
      {showVerifyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 100020,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            width: '100%',
            maxWidth: '560px',
            padding: '28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(12,166,120,0.1)', color: '#0ca678', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 4px' }}>
                Otorisasi Verifikasi & Pencairan Termin KPR BTN
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Pemeriksaan kecocokan fisik geotag lapangan dengan syarat pencairan termin Bank BTN
              </p>
            </div>

            <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', marginBottom: '20px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Unit:</span>
                <strong>{unitData.projectName} ({unitData.blockNumber})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tahapan:</span>
                <strong>Rangka Atap & Penutup Eco-Roof (70%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Nominal Termin 3:</span>
                <strong style={{ color: '#005BAA' }}>Rp 35.000.000 (Pencairan Escrow)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Validitas GPS Geotag:</span>
                <strong style={{ color: '#0ca678' }}>VALID (Akurasi 2.4m)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowVerifyModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Tunda
              </button>
              <button
                disabled={isVerifying}
                onClick={() => handleBankApproval(selectedMilestone.id)}
                style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: '#0ca678', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {isVerifying ? 'Memproses Smart Contract...' : 'Setujui & Cairkan Dana ke Developer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
