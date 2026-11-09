import React, { useState } from 'react';
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
  Lock, 
  Plus, 
  Trash2, 
  Download, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { cekkesStore } from '../../services/cekkes/cekkesStore';

const CekkesProfileDetailModal = ({ 
  subject, 
  isOpen, 
  onClose, 
  onUpdated, 
  onDeleted,
  onLaunchAiCheck 
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [showAddObs, setShowAddObs] = useState(false);

  // New Observation Form State
  const [obsMetric, setObsMetric] = useState('');
  const [obsValue, setObsValue] = useState('');
  const [obsNotes, setObsNotes] = useState('');
  const [obsDevice, setObsDevice] = useState('');

  if (!isOpen || !subject) return null;

  const observations = cekkesStore.getObservations(subject.id);
  const carePlans = cekkesStore.getCarePlans().filter(c => c.subjectId === subject.id);
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
      carePlans,
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
    if (subject.domain === 'human') return <User size={20} className="text-emerald-400" />;
    if (subject.domain === 'animal') return <Dog size={20} className="text-amber-400" />;
    return <Leaf size={20} className="text-teal-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-gray-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-gray-800 bg-gray-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gray-800 border border-gray-700/80">
              {getDomainIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {subject.fullName || subject.name}
                </h2>
                {subject.isDemo && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    DEMO
                  </span>
                )}
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {subject.domain.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {subject.scientificName || subject.species || subject.ageGroup} • Status: <span className="text-emerald-400 font-medium">{subject.status}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* 7-Tab Navigation Header (Section 5.4 cekkes.md) */}
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-2 border-b border-gray-800 bg-gray-950/40 scrollbar-none text-xs font-semibold">
          {[
            { id: 'summary', label: '1. Ringkasan', icon: <Activity size={14} /> },
            { id: 'health', label: '2. Kesehatan & Observasi', icon: <Heart size={14} />, count: observations.length },
            { id: 'needs', label: '3. Kebutuhan & Nutrisi', icon: <Calendar size={14} /> },
            { id: 'timeline', label: '4. Riwayat & Timeline', icon: <Clock size={14} /> },
            { id: 'ai', label: '5. AI Insights', icon: <Sparkles size={14} />, count: aiAssessments.length },
            { id: 'documents', label: '6. Dokumen & Identitas', icon: <FileText size={14} /> },
            { id: 'privacy', label: '7. Akses & Hak PDP', icon: <ShieldCheck size={14} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-800 text-gray-300">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-5 max-h-[65vh] overflow-y-auto">
          {/* TAB 1: RINGKASAN */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-gray-800/40 border border-gray-700/60 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Tingkat Risiko/Kondisi</span>
                  <p className="text-sm font-semibold text-emerald-400 mt-0.5">{subject.riskLevel}</p>
                </div>
                <div className="p-3.5 bg-gray-800/40 border border-gray-700/60 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Pembaruan Terakhir</span>
                  <p className="text-xs font-medium text-gray-200 mt-1">
                    {new Date(subject.updatedAt).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="p-3.5 bg-gray-800/40 border border-gray-700/60 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">ID Subjek (UU PDP)</span>
                  <p className="text-xs font-mono text-gray-300 mt-1 truncate">{subject.id}</p>
                </div>
              </div>

              {/* Domain Specific Overview */}
              {subject.domain === 'human' && subject.physicalSummary && (
                <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Ringkasan Fisik & Gaya Hidup</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block">Tinggi / Berat:</span>
                      <strong className="text-white">{subject.physicalSummary.heightCm} cm / {subject.physicalSummary.weightKg} kg</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Indeks Massa Tubuh (BMI):</span>
                      <strong className="text-white">{subject.physicalSummary.bmi} ({subject.physicalSummary.bmiCategory})</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Tensi Terakhir:</span>
                      <strong className="text-white">{subject.physicalSummary.latestBloodPressure}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Denyut Nadi:</span>
                      <strong className="text-white">{subject.physicalSummary.restingHeartRate}</strong>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block">Riwayat Alergi / Sensitivitas:</span>
                    <p className="text-xs text-amber-300 font-medium mt-0.5">
                      {subject.physicalSummary.knownAllergies?.join(', ') || 'Tidak ada'}
                    </p>
                  </div>
                </div>
              )}

              {subject.domain === 'animal' && (
                <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Profil Pemeliharaan Satwa</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block">Spesies / Ras:</span>
                      <strong className="text-white">{subject.species} ({subject.breed})</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Bobot Badan:</span>
                      <strong className="text-white">{subject.weightKg} kg</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Status Vaksin:</span>
                      <strong className="text-white">{subject.careProfile?.vaccinationStatus}</strong>
                    </div>
                  </div>
                </div>
              )}

              {subject.domain === 'plant' && (
                <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Parameter Agronomi & Tumbuh Kembang</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block">Fase & Varietas:</span>
                      <strong className="text-white">{subject.growthPhase} • {subject.variety}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Lokasi Tanam:</span>
                      <strong className="text-white">{subject.location}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Media Tanam:</span>
                      <strong className="text-white">{subject.cultivationDetails?.substrate}</strong>
                    </div>
                  </div>
                </div>
              )}

              {subject.notes && (
                <div className="p-3 bg-gray-950/40 border border-gray-800 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Catatan Tambahan</span>
                  <p className="text-xs text-gray-300 mt-1">{subject.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KESEHATAN & OBSERVASI */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Riwayat Observasi & Pengukuran ({observations.length})
                </h3>
                <button
                  onClick={() => setShowAddObs(!showAddObs)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>+ Tambah Observasi</span>
                </button>
              </div>

              {/* Add Observation Form Drawer */}
              {showAddObs && (
                <form onSubmit={handleAddObservation} className="p-4 bg-gray-800/80 border border-emerald-500/40 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase">Input Pengukuran Baru</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-300 mb-1">Parameter / Metrik *</label>
                      <input
                        type="text"
                        required
                        value={obsMetric}
                        onChange={(e) => setObsMetric(e.target.value)}
                        placeholder="Contoh: Tekanan Darah / Berat Badan / Tinggi Rebung"
                        className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-300 mb-1">Nilai & Satuan *</label>
                      <input
                        type="text"
                        required
                        value={obsValue}
                        onChange={(e) => setObsValue(e.target.value)}
                        placeholder="Contoh: 120/80 mmHg / 4.4 kg / 52 cm"
                        className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-300 mb-1">Perangkat / Metode</label>
                      <input
                        type="text"
                        value={obsDevice}
                        onChange={(e) => setObsDevice(e.target.value)}
                        placeholder="Contoh: Tensimeter Digital / Lensa Makro"
                        className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-300 mb-1">Catatan Singkat</label>
                      <input
                        type="text"
                        value={obsNotes}
                        onChange={(e) => setObsNotes(e.target.value)}
                        placeholder="Kondisi rileks / pagi hari..."
                        className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddObs(false)}
                      className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-400 rounded-lg hover:bg-emerald-300"
                    >
                      Simpan Observasi
                    </button>
                  </div>
                </form>
              )}

              {/* Observation List */}
              {observations.length === 0 ? (
                <div className="p-8 text-center bg-gray-800/20 border border-gray-800 rounded-xl text-gray-400 text-xs">
                  Belum ada catatan observasi untuk subjek ini. Klik "+ Tambah Observasi" di atas.
                </div>
              ) : (
                <div className="space-y-2">
                  {observations.map(obs => (
                    <div key={obs.id} className="p-3 bg-gray-800/40 border border-gray-700/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm text-white">{obs.metric}:</strong>
                          <span className="text-sm font-bold text-emerald-400">{obs.value}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Metode: {obs.device} • {obs.dataQuality} {obs.notes ? `• "${obs.notes}"` : ''}
                        </p>
                      </div>
                      <span className="text-[11px] text-gray-500 whitespace-nowrap">
                        {new Date(obs.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: KEBUTUHAN & NUTRISI */}
          {activeTab === 'needs' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Kebutuhan Biologis, Nutrisi & Lingkungan
              </h3>
              {subject.domain === 'human' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-gray-800/40 border border-gray-700/60 rounded-xl">
                    <strong className="text-emerald-400 block mb-1">Rekomendasi Nutrisi Harian:</strong>
                    <p className="text-gray-300">Konsumsi air putih 2-2.5 L/hari, batasi natrium &lt; 2000 mg/hari, serat pangan 25-30 gram/hari.</p>
                  </div>
                  <div className="p-3.5 bg-gray-800/40 border border-gray-700/60 rounded-xl">
                    <strong className="text-emerald-400 block mb-1">Kebugaran & Pemulihan:</strong>
                    <p className="text-gray-300">Aktivitas fisik sedang 150 menit/minggu, tidur malam teratur 7-8 jam tanpa paparan layar 30 menit sebelum tidur.</p>
                  </div>
                </div>
              )}

              {subject.domain === 'animal' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-gray-800/40 border border-gray-700/60 rounded-xl">
                    <strong className="text-amber-400 block mb-1">Pakan & Jadwal Minum:</strong>
                    <p className="text-gray-300">{subject.careProfile?.dietType || 'Pakan seimbang berkualitas'} ({subject.careProfile?.feedingSchedule})</p>
                  </div>
                  <div className="p-3.5 bg-gray-800/40 border border-gray-700/60 rounded-xl">
                    <strong className="text-amber-400 block mb-1">Kesehatan Preventif:</strong>
                    <p className="text-gray-300">Obat cacing tiap 3-6 bulan, sanitasi kandang/litter box, dan vaksinasi rabies tahunan.</p>
                  </div>
                </div>
              )}

              {subject.domain === 'plant' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-gray-800/40 border border-gray-700/60 rounded-xl">
                    <strong className="text-teal-400 block mb-1">Kebutuhan Cahaya & Air:</strong>
                    <p className="text-gray-300">{subject.cultivationDetails?.sunlightNeed || 'Matahari Penuh'} • Irigasi drainase alami tanpa genangan stagnan.</p>
                  </div>
                  <div className="p-3.5 bg-gray-800/40 border border-gray-700/60 rounded-xl">
                    <strong className="text-teal-400 block mb-1">Pemupukan Fosfat Organik Cibarani:</strong>
                    <p className="text-gray-300">{subject.cultivationDetails?.nutritionProgram || 'Pupuk Cibarani Guano alami 2 kg per rumpun tiap 3 bulan.'}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RIWAYAT & TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Timeline Riwayat & Kejadian Subjek
              </h3>
              <div className="border-l-2 border-emerald-500/40 ml-2 space-y-4 pl-4">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-gray-900" />
                  <span className="text-[10px] text-gray-400">Pembaruan Terkini</span>
                  <p className="text-xs font-semibold text-white">{subject.status}</p>
                </div>
                {observations.map(obs => (
                  <div key={obs.id} className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-teal-400 ring-4 ring-gray-900" />
                    <span className="text-[10px] text-gray-400">{new Date(obs.timestamp).toLocaleDateString('id-ID')}</span>
                    <p className="text-xs text-white font-medium">{obs.metric}: {obs.value}</p>
                    <span className="text-[10px] text-gray-400">{obs.device}</span>
                  </div>
                ))}
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-gray-600 ring-4 ring-gray-900" />
                  <span className="text-[10px] text-gray-400">{new Date(subject.registeredAt).toLocaleDateString('id-ID')}</span>
                  <p className="text-xs font-semibold text-white">Profil Berhasil Didaftarkan</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI INSIGHTS */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  AI Assessment & Rekomendasi Terdaftar ({aiAssessments.length})
                </h3>
                <button
                  onClick={() => {
                    onClose();
                    if (onLaunchAiCheck) onLaunchAiCheck(subject);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Jalankan Analisis AI Baru</span>
                </button>
              </div>

              {aiAssessments.length === 0 ? (
                <div className="p-8 text-center bg-gray-800/20 border border-gray-800 rounded-xl text-gray-400 text-xs">
                  Belum ada analisis AI yang disimpan untuk profil ini. Klik tombol di atas untuk menganalisis observasi.
                </div>
              ) : (
                <div className="space-y-3">
                  {aiAssessments.map(item => (
                    <div key={item.id} className="p-4 bg-gray-800/40 border border-emerald-500/30 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-emerald-400 font-bold">{item.agentName}</strong>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                          Confidence: {item.confidence}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{item.summary}</p>
                      <div className="text-[11px] text-gray-400 border-t border-gray-700/60 pt-2 italic">
                        {item.disclaimer}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: DOKUMEN & MEDIA */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Dokumen & Identitas Non-Biometrik
              </h3>
              <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl space-y-2 text-xs">
                <span className="text-gray-400 block font-semibold">Identifikasi Resmi Terdaftar:</span>
                {subject.identificationTag ? (
                  <p className="text-white font-mono bg-gray-900 p-2 rounded border border-gray-800">
                    {subject.identificationTag.type}: {subject.identificationTag.code}
                  </p>
                ) : (
                  <p className="text-gray-300">
                    Identifikasi berbasis UUID terenkripsi ceKKes: <span className="font-mono text-emerald-400">{subject.id}</span>
                  </p>
                )}
                <p className="text-[11px] text-gray-400 italic">
                  * ceKKes mematuhi prinsip minimisasi data. Tidak ada pemindaian sidik jari, suara, atau retina mentah yang dikumpulkan secara default.
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: AKSES & PRIVASI (UU PDP) */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={16} /> Kepatuhan UU No. 27 Tahun 2022 (UU PDP)
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Persetujuan (Consent) aktif: Pemrosesan data observasi biologis gaya hidup untuk edukasi non-diagnostik. Status biometrik: <strong>Non-Aktif (Terlindungi)</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleExportProfileJson}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors cursor-pointer"
                >
                  <Download size={14} />
                  <span>Unduh Data Profil (Format JSON)</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubject}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Hapus Profil Ini (Hak Hapus PDP)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 py-3 border-t border-gray-800 bg-gray-950/70 flex items-center justify-between text-xs text-gray-400">
          <span>ID Subjek: <code className="text-emerald-400">{subject.id}</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default CekkesProfileDetailModal;
