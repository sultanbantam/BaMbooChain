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
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Download, 
  RotateCcw,
  ChevronRight,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { cekkesStore } from '../../services/cekkes/cekkesStore';
import CekkesNavHeader from '../../components/cekkes/CekkesNavHeader';
import CekkesAddProfileModal from '../../components/cekkes/CekkesAddProfileModal';
import CekkesAiCheckModal from '../../components/cekkes/CekkesAiCheckModal';
import CekkesProfileDetailModal from '../../components/cekkes/CekkesProfileDetailModal';

const CekkesDashboardPage = () => {
  const [storeState, setStoreState] = useState(cekkesStore.getState());
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
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
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-emerald-500 selection:text-emerald-950 pb-20">
      {/* Navigation Sub-Header */}
      <CekkesNavHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAiModal={() => {
          setPreselectedSubjectForAi(null);
          setIsAiModalOpen(true);
        }}
        stats={stats}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 bg-gray-900/80 border border-emerald-500/20 rounded-2xl">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Total Profil</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-white">{stats.total}</span>
              <span className="text-xs text-gray-400">subjek</span>
            </div>
          </div>
          <div className="p-3.5 bg-gray-900/80 border border-emerald-500/20 rounded-2xl">
            <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">Manusia</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-emerald-400">{stats.human}</span>
              <span className="text-xs text-gray-400">profil</span>
            </div>
          </div>
          <div className="p-3.5 bg-gray-900/80 border border-amber-500/20 rounded-2xl">
            <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">Hewan</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-amber-400">{stats.animal}</span>
              <span className="text-xs text-gray-400">satwa</span>
            </div>
          </div>
          <div className="p-3.5 bg-gray-900/80 border border-teal-500/20 rounded-2xl">
            <span className="text-[11px] text-teal-400 font-bold uppercase tracking-wider block">Tumbuhan</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-teal-400">{stats.plant}</span>
              <span className="text-xs text-gray-400">tanaman</span>
            </div>
          </div>
          <div className="p-3.5 bg-gray-900/80 border border-rose-500/30 rounded-2xl">
            <span className="text-[11px] text-rose-400 font-bold uppercase tracking-wider block">Perlu Perhatian</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-rose-400">{stats.attentionNeeded}</span>
              <span className="text-xs text-rose-300/80">tindak lanjut</span>
            </div>
          </div>
          <div className="p-3.5 bg-gray-900/80 border border-blue-500/20 rounded-2xl">
            <span className="text-[11px] text-blue-400 font-bold uppercase tracking-wider block">Jadwal Aktif</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-blue-400">{stats.carePlans}</span>
              <span className="text-xs text-gray-400">pengingat</span>
            </div>
          </div>
        </div>

        {/* Scientific Boundary & Safety Banner */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-gray-900 to-gray-900 border border-emerald-500/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <ShieldCheck size={22} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Prinsip Sains & Kepatuhan UU No. 27/2022 (UU PDP)
              </h3>
              <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                ceKKes memisahkan identifikasi subjek dari pemeriksaan kesehatan. Sistem <strong>tidak melakukan diagnosis medis/klinis otomatis</strong> dan tidak mengumpulkan biometrik mentah (sidik jari/retina) tanpa izin eksplisit.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('audit')}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-medium transition-colors cursor-pointer"
            >
              Lihat Audit PDP
            </button>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="text-xs px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles size={14} /> Asisten AI
            </button>
          </div>
        </div>

        {/* MAIN VIEWS: PROFILES vs SCHEDULE vs AUDIT */}
        {activeTab !== 'schedule' && activeTab !== 'audit' && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama, spesies, atau domain..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">
                  Menampilkan: <strong className="text-white">{filteredSubjects.length}</strong> profil
                </span>
              </div>
            </div>

            {/* Profile Cards Grid */}
            {filteredSubjects.length === 0 ? (
              <div className="p-12 text-center bg-gray-900/40 border border-gray-800 rounded-2xl space-y-3">
                <Activity size={32} className="mx-auto text-gray-600" />
                <h3 className="text-sm font-bold text-gray-300">Tidak ada profil yang cocok</h3>
                <p className="text-xs text-gray-500">Coba ubah kata kunci pencarian atau daftarkan profil biologis baru.</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 rounded-xl hover:bg-emerald-300 cursor-pointer"
                >
                  + Tambah Profil Sekarang
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubjects.map(sub => {
                  const isAttention = sub.status === 'Perlu Tindak Lanjut';
                  return (
                    <div
                      key={sub.id}
                      className="p-5 bg-gray-900/80 border border-gray-800/80 hover:border-emerald-500/40 rounded-2xl transition-all shadow-lg flex flex-col justify-between group"
                    >
                      <div>
                        {/* Domain & Demo Badges */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1.5">
                            {sub.domain === 'human' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <User size={10} /> MANUSIA
                              </span>
                            )}
                            {sub.domain === 'animal' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                <Dog size={10} /> HEWAN
                              </span>
                            )}
                            {sub.domain === 'plant' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                                <Leaf size={10} /> TUMBUHAN
                              </span>
                            )}
                            {sub.isDemo && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-gray-800 text-gray-400 border border-gray-700">
                                DEMO
                              </span>
                            )}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isAttention
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {sub.status}
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                          {sub.fullName || sub.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {sub.scientificName || sub.species || sub.ageGroup}
                        </p>

                        {/* Specific Metrics */}
                        <div className="mt-4 p-3 bg-gray-950/50 rounded-xl border border-gray-800/80 text-xs space-y-1">
                          {sub.domain === 'human' && (
                            <div className="flex items-center justify-between text-gray-300">
                              <span>Tensi Terkini:</span>
                              <strong className="text-emerald-400">{sub.physicalSummary?.latestBloodPressure || 'Belum diukur'}</strong>
                            </div>
                          )}
                          {sub.domain === 'animal' && (
                            <div className="flex items-center justify-between text-gray-300">
                              <span>Bobot Badan:</span>
                              <strong className="text-amber-400">{sub.weightKg} kg</strong>
                            </div>
                          )}
                          {sub.domain === 'plant' && (
                            <div className="flex items-center justify-between text-gray-300">
                              <span>Fase Tumbuh:</span>
                              <strong className="text-teal-400">{sub.growthPhase}</strong>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-gray-400 text-[11px] pt-1 border-t border-gray-800/60">
                            <span>Kondisi:</span>
                            <span className="truncate max-w-[170px] text-right font-medium text-gray-300">{sub.riskLevel}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-5 pt-3 border-t border-gray-800/80 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenAiWithSubject(sub)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 transition-colors cursor-pointer"
                        >
                          <Sparkles size={12} /> Cek AI
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedSubjectForDetail(sub)}
                          className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gray-800 hover:bg-emerald-500 hover:text-emerald-950 transition-all cursor-pointer"
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar size={18} className="text-emerald-400" />
                  Jadwal & Pengingat Perawatan Biologis
                </h2>
                <p className="text-xs text-gray-400">Pengingat rutin pola hidup manusia, vaksinasi hewan, dan pemupukan tanaman</p>
              </div>
              <button
                onClick={() => setShowAddPlan(!showAddPlan)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
              >
                <PlusCircle size={14} />
                <span>+ Jadwal Baru</span>
              </button>
            </div>

            {/* Add Schedule Form Drawer */}
            {showAddPlan && (
              <form onSubmit={handleCreateCarePlan} className="p-4 bg-gray-900 border border-emerald-500/30 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Buat Jadwal / Pengingat Baru</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Judul Tindakan Perawatan *</label>
                    <input
                      type="text"
                      required
                      value={newPlanTitle}
                      onChange={(e) => setNewPlanTitle(e.target.value)}
                      placeholder="Contoh: Pemupukan Guano Fosfat / Vaksinasi Kucing"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Pilih Subjek</label>
                    <select
                      value={newPlanSubjectId}
                      onChange={(e) => setNewPlanSubjectId(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Umum (Tanpa Subjek)</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.fullName || s.name} ({s.domain})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Frekuensi</label>
                    <select
                      value={newPlanFreq}
                      onChange={(e) => setNewPlanFreq(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Harian">Harian</option>
                      <option value="Mingguan">Mingguan</option>
                      <option value="Bulanan">Bulanan</option>
                      <option value="Tiap 3 Bulan (Kuartalan)">Tiap 3 Bulan (Kuartalan)</option>
                      <option value="Tahunan">Tahunan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Catatan Tambahan</label>
                    <input
                      type="text"
                      value={newPlanNotes}
                      onChange={(e) => setNewPlanNotes(e.target.value)}
                      placeholder="Petunjuk dosis atau instruksi khusus..."
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddPlan(false)}
                    className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-400 rounded-lg hover:bg-emerald-300"
                  >
                    Simpan Jadwal
                  </button>
                </div>
              </form>
            )}

            {/* Care Plans List */}
            <div className="space-y-2">
              {carePlans.map(plan => (
                <div
                  key={plan.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    plan.isCompleted
                      ? 'bg-gray-900/40 border-gray-800/60 opacity-60'
                      : 'bg-gray-900 border-gray-800 hover:border-emerald-500/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={plan.isCompleted}
                      onChange={() => handleToggleCarePlan(plan.id)}
                      className="mt-1 h-5 w-5 rounded border-gray-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div>
                      <h4 className={`text-sm font-bold ${plan.isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                        {plan.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Untuk: <strong className="text-emerald-400">{plan.subjectName}</strong> ({plan.domain}) • Frekuensi: <span className="text-gray-300">{plan.frequency}</span>
                      </p>
                      {plan.notes && (
                        <p className="text-xs text-gray-400 italic mt-1">"{plan.notes}"</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      plan.isCompleted ? 'bg-gray-800 text-gray-400' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {plan.isCompleted ? 'Selesai' : 'Aktif'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: AUDIT & UU PDP PRIVACY COMPLIANCE */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  Kepatuhan UU No. 27/2022 (UU PDP) & Audit Log
                </h2>
                <p className="text-xs text-gray-400">Transparansi pemrosesan data biologis, consent receipt, dan portabilitas data</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportAll}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors cursor-pointer"
                >
                  <Download size={14} />
                  <span>Ekspor Data (JSON)</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Reset Demo</span>
                </button>
              </div>
            </div>

            {/* PDP Rights Summary Card */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <strong className="text-emerald-400 block mb-1">1. Hak Akses & Portabilitas</strong>
                <p className="text-gray-300">Anda berhak mengunduh seluruh data observasi biologis dan log AI yang tersimpan di ceKKes kapan saja.</p>
              </div>
              <div>
                <strong className="text-emerald-400 block mb-1">2. Hak Koreksi & Perbaikan</strong>
                <p className="text-gray-300">Setiap data profil, bobot, atau observasi dapat diperbarui secara mandiri melalui menu detail profil.</p>
              </div>
              <div>
                <strong className="text-emerald-400 block mb-1">3. Hak Hapus & Penarikan Izin</strong>
                <p className="text-gray-300">Penghapusan data menghapus seluruh catatan terkait secara permanen tanpa jejak di peladen publik.</p>
              </div>
            </div>

            {/* Audit Logs List */}
            <div className="p-4 bg-gray-900 border border-gray-800 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Log Audit Aktivitas Sistem (Append-Only)
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-3 bg-gray-950/60 border border-gray-800/80 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-emerald-400 font-bold">{log.action}</span>
                      <span className="text-gray-500">{new Date(log.timestamp).toLocaleString('id-ID')}</span>
                    </div>
                    <p className="text-gray-200">{log.details}</p>
                    <span className="text-[10px] text-gray-400">Pelaku: {log.actor} • Domain: {log.domain}</span>
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
        onDeleted={() => setSelectedSubjectForDetail(null)}
        onUpdated={() => {
          // Re-fetch current subject
          if (selectedSubjectForDetail) {
            const updated = cekkesStore.getSubjectById(selectedSubjectForDetail.id);
            setSelectedSubjectForDetail(updated);
          }
        }}
      />
    </div>
  );
};

export default CekkesDashboardPage;
