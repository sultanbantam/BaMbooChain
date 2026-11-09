import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  User, 
  Dog, 
  Leaf, 
  Calendar, 
  ShieldCheck, 
  PlusCircle, 
  Sparkles, 
  Search, 
  Download, 
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { cekkesStore } from '../../services/cekkes/cekkesStore';
import CekkesNavHeader from '../../components/cekkes/CekkesNavHeader';
import CekkesAddProfileModal from '../../components/cekkes/CekkesAddProfileModal';
import CekkesAiCheckModal from '../../components/cekkes/CekkesAiCheckModal';
import CekkesProfileDetailModal from '../../components/cekkes/CekkesProfileDetailModal';
import CekkesBiometricModal from '../../components/cekkes/CekkesBiometricModal';

const CekkesDashboardPage = () => {
  const [storeState, setStoreState] = useState(cekkesStore.getState());
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [selectedSubjectForDetail, setSelectedSubjectForDetail] = useState(null);
  const [preselectedSubjectForAi, setPreselectedSubjectForAi] = useState(null);

  // New Care Plan Drawer/Form
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanSubjectId, setNewPlanSubjectId] = useState('');
  const [newPlanFreq, setNewPlanFreq] = useState('Harian');
  const [newPlanNotes, setNewPlanNotes] = useState('');

  useEffect(() => {
    const unsubscribe = cekkesStore.subscribe(newState => {
      setStoreState({ ...newState });
    });
    return () => unsubscribe();
  }, []);

  const subjects = storeState.subjects || [];
  const carePlans = storeState.carePlans || [];
  const auditLogs = storeState.auditLogs || [];

  // Summary statistics
  const stats = {
    total: subjects.length,
    human: subjects.filter(s => s.domain === 'human').length,
    animal: subjects.filter(s => s.domain === 'animal').length,
    plant: subjects.filter(s => s.domain === 'plant').length,
    attentionNeeded: subjects.filter(s => s.status === 'Perlu Tindak Lanjut').length,
    carePlans: carePlans.filter(c => !c.isCompleted).length,
    auditLogs: auditLogs.length
  };

  // Filtered subjects based on active tab and search query
  const filteredSubjects = subjects.filter(sub => {
    if (activeTab !== 'all' && activeTab !== 'schedule' && activeTab !== 'audit') {
      if (sub.domain !== activeTab) return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = (sub.fullName || sub.name || '').toLowerCase().includes(q);
    const domainMatch = (sub.domain || '').toLowerCase().includes(q);
    const speciesMatch = (sub.scientificName || sub.species || '').toLowerCase().includes(q);
    return nameMatch || domainMatch || speciesMatch;
  });

  const handleOpenAiWithSubject = (subject) => {
    setPreselectedSubjectForAi(subject);
    setIsAiModalOpen(true);
  };

  const handleToggleCarePlan = (planId) => {
    cekkesStore.toggleCarePlan(planId);
  };

  const handleCreateCarePlan = (e) => {
    e.preventDefault();
    if (!newPlanTitle.trim()) return;

    const sub = subjects.find(s => s.id === newPlanSubjectId) || null;
    cekkesStore.addCarePlan({
      title: newPlanTitle.trim(),
      subjectId: sub?.id || 'general',
      subjectName: sub?.fullName || sub?.name || 'Umum',
      domain: sub?.domain || 'human',
      frequency: newPlanFreq,
      notes: newPlanNotes.trim(),
      dueDate: new Date().toISOString()
    });

    setNewPlanTitle('');
    setNewPlanNotes('');
    setShowAddPlan(false);
  };

  const handleExportAll = () => {
    const jsonStr = cekkesStore.exportUserData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ceKKes_Full_Data_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetDemo = () => {
    const ok = window.confirm('Apakah Anda yakin ingin mengatur ulang data ke kondisi DEMO bawaan?');
    if (ok) {
      cekkesStore.resetToDemo();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1d',
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      paddingBottom: '80px'
    }}>
      {/* Navigation Sub-Header */}
      <CekkesNavHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAiModal={() => {
          setPreselectedSubjectForAi(null);
          setIsAiModalOpen(true);
        }}
        onOpenBiometricModal={() => setIsBiometricModalOpen(true)}
        stats={stats}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px'
        }}>
          {[
            { label: 'Total Profil', val: stats.total, unit: 'subjek', color: '#ffffff', bg: '#161b26', border: 'rgba(255,255,255,0.08)' },
            { label: 'Manusia (Human)', val: stats.human, unit: 'profil', color: '#34d399', bg: '#161b26', border: 'rgba(16, 185, 129, 0.3)' },
            { label: 'Hewan (Animal)', val: stats.animal, unit: 'satwa', color: '#fbbf24', bg: '#161b26', border: 'rgba(245, 159, 0, 0.3)' },
            { label: 'Tumbuhan (Plant)', val: stats.plant, unit: 'tanaman', color: '#2dd4bf', bg: '#161b26', border: 'rgba(45, 212, 191, 0.3)' },
            { label: 'Perlu Perhatian', val: stats.attentionNeeded, unit: 'tindak lanjut', color: '#f87171', bg: '#161b26', border: 'rgba(239, 68, 68, 0.3)' },
            { label: 'Jadwal Aktif', val: stats.carePlans, unit: 'pengingat', color: '#60a5fa', bg: '#161b26', border: 'rgba(96, 165, 250, 0.3)' },
          ].map((m, i) => (
            <div key={i} style={{
              background: m.bg,
              border: `1px solid ${m.border}`,
              borderRadius: '16px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px', color: '#94a3b8' }}>
                {m.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: m.color }}>{m.val}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Scientific Boundary & Safety Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', maxWidth: '780px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '8px', borderRadius: '10px', color: '#34d399', flexShrink: 0 }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: '800', color: '#ffffff' }}>
                Prinsip Sains & Kepatuhan UU No. 27/2022 (UU PDP)
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                ceKKes memisahkan identifikasi subjek dari pemeriksaan kesehatan. Sistem <strong>tidak melakukan diagnosis medis/klinis otomatis</strong> dan tidak mengumpulkan biometrik mentah (sidik jari/retina) tanpa izin eksplisit.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsBiometricModalOpen(true)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🔬 Lab Biometrik
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#e2e8f0',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Lihat Audit PDP
            </button>
            <button
              onClick={() => setIsAiModalOpen(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                fontSize: '0.78rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={14} /> Asisten AI
            </button>
          </div>
        </div>

        {/* MAIN VIEWS: PROFILES vs SCHEDULE vs AUDIT */}
        {activeTab !== 'schedule' && activeTab !== 'audit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Search Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama, spesies, atau domain..."
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    background: '#161b26',
                    border: '1px solid #232936',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Menampilkan: <strong style={{ color: '#ffffff' }}>{filteredSubjects.length}</strong> profil
              </span>
            </div>

            {/* Profile Cards Grid */}
            {filteredSubjects.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '50px 20px',
                background: '#161b26',
                border: '1px solid #232936',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Activity size={36} color="#64748b" />
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#e2e8f0' }}>Tidak ada profil yang cocok</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Coba ubah kata kunci pencarian atau daftarkan profil biologis baru.</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  style={{
                    padding: '8px 18px',
                    background: '#10b981',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#022c22',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  + Tambah Profil Sekarang
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '16px'
              }}>
                {filteredSubjects.map(sub => {
                  const isAttention = sub.status === 'Perlu Tindak Lanjut';
                  return (
                    <div
                      key={sub.id}
                      style={{
                        background: '#161b26',
                        border: '1px solid #232936',
                        borderRadius: '16px',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div>
                        {/* Domain & Demo Badges */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {sub.domain === 'human' && (
                              <span style={{ fontSize: '0.68rem', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <User size={11} /> MANUSIA
                              </span>
                            )}
                            {sub.domain === 'animal' && (
                              <span style={{ fontSize: '0.68rem', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: 'rgba(245, 159, 0, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 159, 0, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Dog size={11} /> HEWAN
                              </span>
                            )}
                            {sub.domain === 'plant' && (
                              <span style={{ fontSize: '0.68rem', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: 'rgba(45, 212, 191, 0.2)', color: '#2dd4bf', border: '1px solid rgba(45, 212, 191, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Leaf size={11} /> TUMBUHAN
                              </span>
                            )}
                            {sub.isDemo && (
                              <span style={{ fontSize: '0.65rem', fontWeight: '900', padding: '2px 5px', borderRadius: '4px', background: '#232936', color: '#94a3b8' }}>
                                DEMO
                              </span>
                            )}
                          </div>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            background: isAttention ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                            color: isAttention ? '#fca5a5' : '#34d399',
                            border: `1px solid ${isAttention ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.3)'}`
                          }}>
                            {sub.status}
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 style={{ margin: '0 0 3px', fontSize: '1.05rem', fontWeight: '800', color: '#ffffff' }}>
                          {sub.fullName || sub.name}
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sub.scientificName || sub.species || sub.ageGroup}
                        </p>

                        {/* Metrics Card */}
                        <div style={{
                          background: '#0d111a',
                          border: '1px solid #1f2533',
                          borderRadius: '12px',
                          padding: '12px',
                          marginTop: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          fontSize: '0.78rem'
                        }}>
                          {sub.domain === 'human' && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                              <span>Tensi Terkini:</span>
                              <strong style={{ color: '#34d399' }}>{sub.physicalSummary?.latestBloodPressure || 'Belum diukur'}</strong>
                            </div>
                          )}
                          {sub.domain === 'animal' && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                              <span>Bobot Badan:</span>
                              <strong style={{ color: '#fbbf24' }}>{sub.weightKg} kg</strong>
                            </div>
                          )}
                          {sub.domain === 'plant' && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                              <span>Fase Tumbuh:</span>
                              <strong style={{ color: '#2dd4bf' }}>{sub.growthPhase}</strong>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.74rem', borderTop: '1px solid #1f2533', paddingTop: '6px' }}>
                            <span>Kondisi:</span>
                            <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{sub.riskLevel}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div style={{
                        marginTop: '16px',
                        paddingTop: '12px',
                        borderTop: '1px solid #232936',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <button
                          type="button"
                          onClick={() => handleOpenAiWithSubject(sub)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '7px 12px',
                            borderRadius: '8px',
                            background: 'rgba(20, 184, 166, 0.15)',
                            border: '1px solid rgba(20, 184, 166, 0.35)',
                            color: '#2dd4bf',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          <Sparkles size={13} /> Cek AI
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedSubjectForDetail(sub)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 14px',
                            borderRadius: '8px',
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: '#ffffff',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          <span>Detail (7 Tab)</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: JADWAL & PENGINGAT (CARE PLANS) */}
        {activeTab === 'schedule' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="#34d399" />
                  Jadwal & Pengingat Perawatan Biologis
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                  Pengingat rutin pola hidup manusia, vaksinasi hewan, dan pemupukan tanaman
                </p>
              </div>
              <button
                onClick={() => setShowAddPlan(!showAddPlan)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: '#10b981',
                  border: 'none',
                  color: '#022c22',
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <PlusCircle size={15} /> + Jadwal Baru
              </button>
            </div>

            {showAddPlan && (
              <form onSubmit={handleCreateCarePlan} style={{ background: '#161b26', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#34d399' }}>Buat Jadwal Baru</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>Judul Tindakan Perawatan *</label>
                    <input
                      type="text"
                      required
                      value={newPlanTitle}
                      onChange={(e) => setNewPlanTitle(e.target.value)}
                      placeholder="Contoh: Pemupukan Guano Fosfat / Vaksinasi"
                      style={{ width: '100%', padding: '8px 10px', background: '#0d111a', border: '1px solid #232936', borderRadius: '8px', color: '#ffffff', fontSize: '0.82rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>Pilih Subjek</label>
                    <select
                      value={newPlanSubjectId}
                      onChange={(e) => setNewPlanSubjectId(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', background: '#0d111a', border: '1px solid #232936', borderRadius: '8px', color: '#ffffff', fontSize: '0.82rem', boxSizing: 'border-box' }}
                    >
                      <option value="">Umum (Tanpa Subjek)</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.fullName || s.name} ({s.domain})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>Frekuensi</label>
                    <select
                      value={newPlanFreq}
                      onChange={(e) => setNewPlanFreq(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', background: '#0d111a', border: '1px solid #232936', borderRadius: '8px', color: '#ffffff', fontSize: '0.82rem', boxSizing: 'border-box' }}
                    >
                      <option value="Harian">Harian</option>
                      <option value="Mingguan">Mingguan</option>
                      <option value="Bulanan">Bulanan</option>
                      <option value="Tiap 3 Bulan">Tiap 3 Bulan</option>
                      <option value="Tahunan">Tahunan</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>Catatan</label>
                    <input
                      type="text"
                      value={newPlanNotes}
                      onChange={(e) => setNewPlanNotes(e.target.value)}
                      placeholder="Petunjuk dosis atau instruksi khusus..."
                      style={{ width: '100%', padding: '8px 10px', background: '#0d111a', border: '1px solid #232936', borderRadius: '8px', color: '#ffffff', fontSize: '0.82rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                  <button type="button" onClick={() => setShowAddPlan(false)} style={{ padding: '6px 14px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer' }}>Batal</button>
                  <button type="submit" style={{ padding: '7px 18px', background: '#10b981', border: 'none', borderRadius: '8px', color: '#022c22', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}>Simpan Jadwal</button>
                </div>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {carePlans.map(plan => (
                <div
                  key={plan.id}
                  style={{
                    background: plan.isCompleted ? 'rgba(22, 27, 38, 0.4)' : '#161b26',
                    border: '1px solid #232936',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    opacity: plan.isCompleted ? 0.6 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={plan.isCompleted}
                      onChange={() => handleToggleCarePlan(plan.id)}
                      style={{ marginTop: '3px', cursor: 'pointer' }}
                    />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: plan.isCompleted ? '#94a3b8' : '#ffffff', textDecoration: plan.isCompleted ? 'line-through' : 'none' }}>
                        {plan.title}
                      </h4>
                      <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                        Untuk: <strong style={{ color: '#34d399' }}>{plan.subjectName}</strong> ({plan.domain}) • Frekuensi: <span style={{ color: '#cbd5e1' }}>{plan.frequency}</span>
                      </p>
                      {plan.notes && (
                        <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>"{plan.notes}"</p>
                      )}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: plan.isCompleted ? '#232936' : 'rgba(96, 165, 250, 0.2)',
                    color: plan.isCompleted ? '#94a3b8' : '#60a5fa'
                  }}>
                    {plan.isCompleted ? 'Selesai' : 'Aktif'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: AUDIT & UU PDP PRIVACY COMPLIANCE */}
        {activeTab === 'audit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#34d399" />
                  Kepatuhan UU No. 27/2022 (UU PDP) & Audit Log
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                  Transparansi pemrosesan data biologis, consent receipt, dan portabilitas data
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleExportAll}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} /> Ekspor Data (JSON)
                </button>
                <button
                  type="button"
                  onClick={handleResetDemo}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'rgba(245, 159, 0, 0.15)',
                    border: '1px solid rgba(245, 159, 0, 0.35)',
                    color: '#fbbf24',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RotateCcw size={14} /> Reset Demo
                </button>
              </div>
            </div>

            {/* PDP Summary Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px'
            }}>
              <div style={{ background: '#161b26', border: '1px solid #232936', borderRadius: '12px', padding: '14px', fontSize: '0.8rem' }}>
                <strong style={{ color: '#34d399', display: 'block', marginBottom: '4px' }}>1. Hak Akses & Portabilitas</strong>
                <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.5 }}>Anda berhak mengunduh seluruh data observasi biologis dan log AI yang tersimpan di ceKKes kapan saja.</p>
              </div>
              <div style={{ background: '#161b26', border: '1px solid #232936', borderRadius: '12px', padding: '14px', fontSize: '0.8rem' }}>
                <strong style={{ color: '#34d399', display: 'block', marginBottom: '4px' }}>2. Hak Koreksi & Perbaikan</strong>
                <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.5 }}>Setiap data profil, bobot, atau observasi dapat diperbarui secara mandiri melalui menu detail profil.</p>
              </div>
              <div style={{ background: '#161b26', border: '1px solid #232936', borderRadius: '12px', padding: '14px', fontSize: '0.8rem' }}>
                <strong style={{ color: '#34d399', display: 'block', marginBottom: '4px' }}>3. Hak Hapus & Penarikan Izin</strong>
                <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.5 }}>Penghapusan data menghapus seluruh catatan terkait secara permanen tanpa jejak di peladen publik.</p>
              </div>
            </div>

            {/* Audit Logs List */}
            <div style={{ background: '#161b26', border: '1px solid #232936', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8' }}>
                Log Audit Aktivitas Sistem (Append-Only)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
                {auditLogs.map(log => (
                  <div key={log.id} style={{ background: '#0d111a', border: '1px solid #1f2533', borderRadius: '10px', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'monospace', color: '#34d399', fontWeight: '800' }}>{log.action}</span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{new Date(log.timestamp).toLocaleString('id-ID')}</span>
                    </div>
                    <p style={{ margin: 0, color: '#e2e8f0' }}>{log.details}</p>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Pelaku: {log.actor} • Domain: {log.domain}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Modals */}
      <CekkesAddProfileModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProfileAdded={(newProfile) => {
          setSelectedSubjectForDetail(newProfile);
        }}
      />

      <CekkesAiCheckModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        preselectedSubject={preselectedSubjectForAi}
      />

      <CekkesProfileDetailModal
        subject={selectedSubjectForDetail}
        isOpen={!!selectedSubjectForDetail}
        onClose={() => setSelectedSubjectForDetail(null)}
        onLaunchAiCheck={(sub) => {
          setPreselectedSubjectForAi(sub);
          setIsAiModalOpen(true);
        }}
        onOpenBiometricModal={() => setIsBiometricModalOpen(true)}
        onDeleted={() => setSelectedSubjectForDetail(null)}
        onUpdated={() => {
          if (selectedSubjectForDetail) {
            const updated = cekkesStore.getSubjectById(selectedSubjectForDetail.id);
            setSelectedSubjectForDetail(updated);
          }
        }}
      />

      <CekkesBiometricModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
      />
    </div>
  );
};

export default CekkesDashboardPage;
