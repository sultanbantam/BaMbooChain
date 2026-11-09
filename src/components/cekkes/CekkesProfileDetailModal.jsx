import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Dog, 
  Leaf, 
  Activity, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Clock, 
  Heart,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  Eye,
  Mic
} from 'lucide-react';
import { cekkesStore } from '../../services/cekkes/cekkesStore';

const CekkesProfileDetailModal = ({ 
  subject, 
  isOpen, 
  onClose, 
  onUpdated, 
  onDeleted,
  onLaunchAiCheck,
  onOpenBiometricModal
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [showAddObs, setShowAddObs] = useState(false);
  const scrollTabsRef = useRef(null);

  // New Observation Form State
  const [obsMetric, setObsMetric] = useState('');
  const [obsValue, setObsValue] = useState('');
  const [obsNotes, setObsNotes] = useState('');
  const [obsDevice, setObsDevice] = useState('');

  if (!isOpen || !subject) return null;

  const observations = cekkesStore.getObservations(subject.id);
  const aiAssessments = subject.aiAssessments || [];

  const handleAddObservation = (e) => {
    e.preventDefault();
    if (!obsMetric.trim() || !obsValue.trim()) return;

    cekkesStore.addObservation({
      subjectId: subject.id,
      domain: subject.domain,
      metric: obsMetric.trim(),
      value: obsValue.trim(),
      notes: obsNotes.trim(),
      device: obsDevice.trim() || 'Pencatatan Mandiri',
      recorder: 'Pengguna',
      dataQuality: 'Terverifikasi Mandiri'
    });

    setObsMetric('');
    setObsValue('');
    setObsNotes('');
    setObsDevice('');
    setShowAddObs(false);
    if (onUpdated) onUpdated();
  };

  const handleDeleteSubject = () => {
    const ok = window.confirm(`Apakah Anda yakin ingin menghapus profil "${subject.fullName || subject.name}" beserta seluruh observasinya? Tindakan ini permanen sesuai hak hapus UU PDP No. 27/2022.`);
    if (ok) {
      cekkesStore.deleteSubject(subject.id);
      if (onDeleted) onDeleted(subject.id);
      onClose();
    }
  };

  const handleExportProfileJson = () => {
    const profileData = {
      subject,
      observations,
      aiAssessments,
      exportedAt: new Date().toISOString(),
      disclaimer: 'Ekspor Data Resmi ceKKes - BaMbooChain (UU PDP No. 27/2022)'
    };
    const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ceKKes_${subject.domain}_${subject.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDomainIcon = () => {
    if (subject.domain === 'human') return <User size={22} color="#34d399" />;
    if (subject.domain === 'animal') return <Dog size={22} color="#fbbf24" />;
    return <Leaf size={22} color="#2dd4bf" />;
  };

  const tabs = [
    { id: 'summary', label: '1. Ringkasan', icon: <Activity size={14} /> },
    { id: 'health', label: '2. Kesehatan & Observasi', icon: <Heart size={14} />, count: observations.length },
    { id: 'needs', label: '3. Kebutuhan & Nutrisi', icon: <Calendar size={14} /> },
    { id: 'timeline', label: '4. Riwayat & Timeline', icon: <Clock size={14} /> },
    { id: 'ai', label: '5. AI Insights', icon: <Sparkles size={14} />, count: aiAssessments.length },
    { id: 'documents', label: '6. Dokumen & Identitas', icon: <FileText size={14} /> },
    { id: 'privacy', label: '7. Akses & Hak PDP', icon: <ShieldCheck size={14} /> },
  ];

  const handleScrollTabs = (offset) => {
    if (scrollTabsRef.current) {
      scrollTabsRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 20000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '850px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden',
        color: '#ffffff'
      }}>
        {/* Top Header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid #334155',
          background: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.9)', padding: '10px', borderRadius: '12px', border: '1px solid #334155' }}>
              {getDomainIcon()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>
                  {subject.fullName || subject.name}
                </h2>
                {subject.isDemo && (
                  <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 159, 0, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 159, 0, 0.4)', fontWeight: '800' }}>
                    DEMO
                  </span>
                )}
                <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: '700' }}>
                  {subject.domain.toUpperCase()}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                {subject.scientificName || subject.species || subject.ageGroup} • Status: <strong style={{ color: '#34d399' }}>{subject.status}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* 7-Tab Navigation Header with Left/Right Scroll Buttons */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: '#0f172a',
          borderBottom: '1px solid #334155',
          padding: '8px 12px'
        }}>
          {/* Scroll Left Button */}
          <button
            onClick={() => handleScrollTabs(-180)}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#34d399',
              borderRadius: '8px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              zIndex: 5
            }}
            title="Geser Tab ke Kiri"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Scrollable Tabs Container */}
          <div 
            ref={scrollTabsRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              padding: '2px 8px',
              scrollbarWidth: 'none',
              scrollBehavior: 'smooth',
              flex: 1
            }}
          >
            {tabs.map(tab => {
              const isSel = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: isSel ? '1px solid #10b981' : '1px solid transparent',
                    background: isSel ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                    color: isSel ? '#34d399' : '#94a3b8',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '999px', background: '#334155', color: '#cbd5e1' }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => handleScrollTabs(180)}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#34d399',
              borderRadius: '8px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              zIndex: 5
            }}
            title="Geser Tab ke Kanan"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Tab Contents */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* TAB 1: RINGKASAN */}
          {activeTab === 'summary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '12px 14px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Kondisi Biologis</span>
                  <strong style={{ fontSize: '0.92rem', color: '#34d399', display: 'block', marginTop: '2px' }}>{subject.riskLevel}</strong>
                </div>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '12px 14px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Pembaruan Terakhir</span>
                  <span style={{ fontSize: '0.85rem', color: '#e2e8f0', display: 'block', marginTop: '2px' }}>
                    {new Date(subject.updatedAt).toLocaleString('id-ID')}
                  </span>
                </div>
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '12px 14px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>ID Subjek (UU PDP)</span>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: '#cbd5e1', display: 'block', marginTop: '2px' }}>{subject.id}</span>
                </div>
              </div>

              {subject.domain === 'human' && subject.physicalSummary && (
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#34d399' }}>
                    Ringkasan Fisik & Kebugaran
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', fontSize: '0.8rem' }}>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block' }}>Tinggi / Bobot:</span>
                      <strong style={{ color: '#ffffff' }}>{subject.physicalSummary.heightCm} cm / {subject.physicalSummary.weightKg} kg</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block' }}>BMI:</span>
                      <strong style={{ color: '#ffffff' }}>{subject.physicalSummary.bmi} ({subject.physicalSummary.bmiCategory})</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block' }}>Tensi Terkini:</span>
                      <strong style={{ color: '#34d399' }}>{subject.physicalSummary.latestBloodPressure}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block' }}>Denyut Nadi:</span>
                      <strong style={{ color: '#ffffff' }}>{subject.physicalSummary.restingHeartRate}</strong>
                    </div>
                  </div>
                  {subject.physicalSummary.knownAllergies && (
                    <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>
                      <span style={{ color: '#94a3b8' }}>Riwayat Alergi: </span>
                      <span style={{ color: '#fbbf24', fontWeight: '600' }}>{subject.physicalSummary.knownAllergies.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}

              {subject.domain === 'animal' && (
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#fbbf24' }}>
                    Profil Pemeliharaan Satwa
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', fontSize: '0.8rem' }}>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block' }}>Spesies & Ras:</span>
                      <strong style={{ color: '#ffffff' }}>{subject.species} ({subject.breed})</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block' }}>Bobot:</span>
                      <strong style={{ color: '#ffffff' }}>{subject.weightKg} kg</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block' }}>Status Vaksin:</span>
                      <strong style={{ color: '#ffffff' }}>{subject.careProfile?.vaccinationStatus}</strong>
                    </div>
                  </div>
                </div>
              )}

              {subject.domain === 'plant' && (
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#2dd4bf' }}>
                    Parameter Agronomi & Tumbuh Kembang
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', fontSize: '0.8rem' }}>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block' }}>Fase & Varietas:</span>
                      <strong style={{ color: '#ffffff' }}>{subject.growthPhase} • {subject.variety}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block' }}>Lokasi Plot:</span>
                      <strong style={{ color: '#ffffff' }}>{subject.location}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block' }}>Media Tanam:</span>
                      <strong style={{ color: '#ffffff' }}>{subject.cultivationDetails?.substrate}</strong>
                    </div>
                  </div>
                </div>
              )}

              {subject.notes && (
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '12px 14px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', display: 'block' }}>Catatan Observasi</span>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>{subject.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KESEHATAN & OBSERVASI */}
          {activeTab === 'health' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#e2e8f0' }}>
                  Catatan Observasi Terkini ({observations.length})
                </h3>
                <button
                  onClick={() => setShowAddObs(!showAddObs)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    background: '#10b981',
                    border: 'none',
                    color: '#022c22',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={14} /> + Tambah Observasi
                </button>
              </div>

              {showAddObs && (
                <form onSubmit={handleAddObservation} style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', color: '#34d399' }}>Input Pengukuran Baru</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>Parameter / Metrik *</label>
                      <input
                        type="text"
                        required
                        value={obsMetric}
                        onChange={(e) => setObsMetric(e.target.value)}
                        placeholder="Tekanan Darah / Berat / dsb"
                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.82rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>Nilai & Satuan *</label>
                      <input
                        type="text"
                        required
                        value={obsValue}
                        onChange={(e) => setObsValue(e.target.value)}
                        placeholder="120/80 mmHg / 4.4 kg"
                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.82rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>Perangkat / Alat</label>
                      <input
                        type="text"
                        value={obsDevice}
                        onChange={(e) => setObsDevice(e.target.value)}
                        placeholder="Tensimeter Omron / Timbangan"
                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.82rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>Catatan</label>
                      <input
                        type="text"
                        value={obsNotes}
                        onChange={(e) => setObsNotes(e.target.value)}
                        placeholder="Kondisi rileks..."
                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '0.82rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                    <button type="button" onClick={() => setShowAddObs(false)} style={{ padding: '6px 12px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer' }}>Batal</button>
                    <button type="submit" style={{ padding: '7px 16px', background: '#10b981', border: 'none', borderRadius: '8px', color: '#022c22', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer' }}>Simpan</button>
                  </div>
                </form>
              )}

              {observations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', background: '#0f172a', borderRadius: '12px', color: '#94a3b8', fontSize: '0.82rem' }}>
                  Belum ada catatan observasi untuk subjek ini.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {observations.map(obs => (
                    <div key={obs.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: '700' }}>{obs.metric}:</span>
                          <span style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: '800' }}>{obs.value}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                          Alat: {obs.device} • {obs.dataQuality} {obs.notes ? `• "${obs.notes}"` : ''}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {new Date(obs.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: KEBUTUHAN */}
          {activeTab === 'needs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.83rem' }}>
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '14px' }}>
                <strong style={{ color: '#34d399', display: 'block', marginBottom: '4px' }}>Kebutuhan Nutrisi & Hidrasi:</strong>
                <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.5 }}>
                  {subject.domain === 'human' && 'Konsumsi cairan 2-2.5 L/hari, batasi natrium < 2000 mg/hari, dan cukupi asupan serat alami sayuran/bambu.'}
                  {subject.domain === 'animal' && (subject.careProfile?.dietType || 'Pakan hijauan seimbang dan air bersih.')}
                  {subject.domain === 'plant' && (subject.cultivationDetails?.nutritionProgram || 'Pemupukan Cibarani Guano fosfat berkala.')}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE */}
          {activeTab === 'timeline' && (
            <div style={{ borderLeft: '2px solid #10b981', marginLeft: '10px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Status Terkini</span>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: '#34d399' }}>{subject.status}</p>
              </div>
              {observations.map(obs => (
                <div key={obs.id}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{new Date(obs.timestamp).toLocaleDateString('id-ID')}</span>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#e2e8f0', fontWeight: '600' }}>{obs.metric}: {obs.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: AI INSIGHTS */}
          {activeTab === 'ai' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#2dd4bf' }}>
                  Arsip Analisis AI ({aiAssessments.length})
                </h3>
                <button
                  onClick={() => {
                    onClose();
                    if (onLaunchAiCheck) onLaunchAiCheck(subject);
                  }}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={14} /> Analisis AI Baru
                </button>
              </div>

              {aiAssessments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', background: '#0f172a', borderRadius: '12px', color: '#94a3b8', fontSize: '0.82rem' }}>
                  Belum ada analisis AI yang tersimpan. Klik tombol di atas untuk menganalisis observasi.
                </div>
              ) : (
                aiAssessments.map(item => (
                  <div key={item.id} style={{ background: '#0f172a', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.82rem', color: '#34d399' }}>{item.agentName}</strong>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>
                        Confidence: {item.confidence}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>{item.summary}</p>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic', borderTop: '1px solid #334155', paddingTop: '6px' }}>
                      {item.disclaimer}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 6: DOKUMEN & IDENTITAS BIOMETRIK */}
          {activeTab === 'documents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.82rem' }}>
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ color: '#94a3b8', fontWeight: '700' }}>Identifikasi Subjek Terdaftar:</span>
                <p style={{ margin: 0, color: '#ffffff', fontFamily: 'monospace', background: '#1e293b', padding: '8px 12px', borderRadius: '8px' }}>
                  {subject.identificationTag ? `${subject.identificationTag.type}: ${subject.identificationTag.code}` : `UUID: ${subject.id}`}
                </p>
                <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  * Sistem ceKKes mematuhi prinsip minimisasi data. Tidak ada pemindaian sidik jari, suara, atau retina mentah yang dikumpulkan secara default.
                </p>
              </div>

              {/* Biometric Integration Status Box */}
              <div style={{ background: '#0f172a', border: '1px solid #232936', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Fingerprint size={16} /> Status Integrasi Biometrik (Retina, Sidik Jari, Suara)
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#94a3b8' }}>
                      Kamera, sensor sidik jari, dan mikrofon untuk verifikasi identitas (Roadmap MVP 4)
                    </p>
                  </div>
                  {onOpenBiometricModal && (
                    <button
                      type="button"
                      onClick={onOpenBiometricModal}
                      style={{
                        padding: '7px 14px',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Sparkles size={14} /> Uji Biometrik Perangkat
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '0.76rem', color: '#cbd5e1' }}>
                  <div style={{ background: '#161b26', padding: '10px', borderRadius: '8px', border: '1px solid #232936' }}>
                    <strong style={{ color: '#2dd4bf', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={12} /> Retina & Iris (Mata):
                    </strong>
                    <span style={{ fontSize: '0.72rem', display: 'block', marginTop: '3px' }}>
                      Iris via kamera optik/NIR; Retina memerlukan Fundus Camera medis khusus (bukan kamera HP biasa).
                    </span>
                  </div>
                  <div style={{ background: '#161b26', padding: '10px', borderRadius: '8px', border: '1px solid #232936' }}>
                    <strong style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Fingerprint size={12} /> Sidik Jari:
                    </strong>
                    <span style={{ fontSize: '0.72rem', display: 'block', marginTop: '3px' }}>
                      Menggunakan sensor bawaan peramban WebAuthn FIDO2 untuk keamanan akun (non-diagnostik).
                    </span>
                  </div>
                  <div style={{ background: '#161b26', padding: '10px', borderRadius: '8px', border: '1px solid #232936' }}>
                    <strong style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mic size={12} /> Suara (Voiceprint):
                    </strong>
                    <span style={{ fontSize: '0.72rem', display: 'block', marginTop: '3px' }}>
                      Menggunakan mikrofon perangkat untuk verifikasi akustik unik pengguna.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AKSES & PRIVASI (UU PDP) */}
          {activeTab === 'privacy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'rgba(6, 78, 59, 0.3)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', padding: '14px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                <strong style={{ color: '#34d399', display: 'block', marginBottom: '4px' }}>Kepatuhan UU No. 27 Tahun 2022 (UU PDP):</strong>
                Persetujuan aktif untuk pencatatan mandiri data kebugaran/budidaya. Data tersimpan di perangkat lokal tanpa transmisi ke pihak ketiga.
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleExportProfileJson}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '10px',
                    background: '#334155',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} /> Unduh Data Profil (JSON)
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubject}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={14} /> Hapus Profil (Hak Hapus PDP)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 22px',
          borderTop: '1px solid #334155',
          background: '#0f172a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: '#94a3b8'
        }}>
          <span>ID Subjek: <code style={{ color: '#34d399' }}>{subject.id}</code></span>
          <button
            onClick={onClose}
            style={{ padding: '6px 14px', borderRadius: '8px', background: '#334155', border: 'none', color: '#ffffff', cursor: 'pointer', fontWeight: '600' }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default CekkesProfileDetailModal;
