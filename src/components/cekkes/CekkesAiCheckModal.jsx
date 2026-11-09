import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  BookOpen, 
  AlertTriangle,
  Heart,
  Dog,
  Leaf,
  Info
} from 'lucide-react';
import { cekkesStore } from '../../services/cekkes/cekkesStore';

const CekkesAiCheckModal = ({ 
  isOpen, 
  onClose, 
  preselectedSubject = null,
  onAssessmentCompleted 
}) => {
  const [domain, setDomain] = useState(preselectedSubject?.domain || 'human');
  const [selectedSubjectId, setSelectedSubjectId] = useState(preselectedSubject?.id || '');
  const [prompt, setPrompt] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subjects = cekkesStore.getSubjects(domain);

  const QUICK_PROMPTS = {
    human: [
      'Tekanan darah 135/88 mmHg dan sedikit pusing setelah bekerja',
      'Pola makan rendah garam & aktivitas fisik untuk pra-hipertensi',
      'Keluhan kram otot ringan saat jogging pagi'
    ],
    animal: [
      'Kucing tampak lemas, nafsu makan berkurang sejak kemarin',
      'Pemberian silase daun bambu dan konsentrat pakan kambing',
      'Jadwal booster vaksinasi rabies dan obat cacing'
    ],
    plant: [
      'Ujung daun bambu petung tampak menguning (klorosis)',
      'Aplikasi pupuk Cibarani Guano fosfat untuk pemacuan rebung',
      'Gejala serangan serangga pada daun padi huma'
    ]
  };

  const handleRunAssessment = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setErrorMsg('Mohon masukkan observasi atau pertanyaan terlebih dahulu.');
      return;
    }
    if (!consentGiven) {
      setErrorMsg('Persetujuan pemrosesan data (Consent) diperlukan sesuai UU PDP.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      // Simulate real agentic knowledge retrieval step
      await new Promise(r => setTimeout(r, 600));

      const res = await cekkesStore.assessWithAi({
        domain,
        subjectId: selectedSubjectId || null,
        prompt: prompt.trim(),
        userConsent: consentGiven
      });

      if (!res.success) {
        setErrorMsg(res.summary);
      } else {
        setResult(res);
        if (onAssessmentCompleted) onAssessmentCompleted(res);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memproses analisis AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPrompt('');
    setResult(null);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-gray-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gray-950/70">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
              <Sparkles size={20} className="animate-pulse" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Asisten Analisis AI ceKKes <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">Multi-Agent v1.0</span>
              </h2>
              <p className="text-xs text-gray-400">Edukasi biologis berbasis bukti, batasan keselamatan & non-diagnostik klinis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Domain & Subject Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Domain Biologis</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { setDomain('human'); setSelectedSubjectId(''); setResult(null); }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    domain === 'human'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  <Heart size={14} /> Manusia
                </button>
                <button
                  type="button"
                  onClick={() => { setDomain('animal'); setSelectedSubjectId(''); setResult(null); }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    domain === 'animal'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  <Dog size={14} /> Hewan
                </button>
                <button
                  type="button"
                  onClick={() => { setDomain('plant'); setSelectedSubjectId(''); setResult(null); }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    domain === 'plant'
                      ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                      : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  <Leaf size={14} /> Tumbuhan
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Subjek Terdaftar (Opsional)</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">Analisis Umum (Tanpa Profil Khusus)</option>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.fullName || sub.name} ({sub.ageGroup || sub.ageDescription || sub.growthPhase})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prompt Input Form */}
          {!result && (
            <form onSubmit={handleRunAssessment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Deskripsi Observasi / Gejala / Pertanyaan Perawatan *
                </label>
                <textarea
                  rows={3}
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Deskripsikan observasi Anda secara detail (misal: pengukuran tensi, perubahan perilaku hewan, kondisi daun/tanaman)..."
                  className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Quick Prompt Suggestions */}
              <div>
                <span className="text-[11px] font-semibold text-gray-400 block mb-1.5">Contoh Pertanyaan Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(QUICK_PROMPTS[domain] || []).map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(sample)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-emerald-300 border border-gray-700/60 transition-colors text-left cursor-pointer"
                    >
                      "{sample}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Consent Toggle */}
              <div className="p-3 bg-gray-950/50 border border-gray-800 rounded-xl flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="ai-consent"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="ai-consent" className="text-xs text-gray-300 cursor-pointer leading-relaxed">
                  <strong className="text-emerald-400">Persetujuan Pemrosesan AI:</strong> Saya mengizinkan AI Agent ceKKes memproses teks observasi di atas untuk memberikan rekomendasi gaya hidup/budidaya. Saya memahami bahwa hasil ini <strong>bukan diagnosis medis atau veteriner</strong>.
                </label>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 active:scale-95 transition-all shadow-md shadow-emerald-900/40 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles size={16} className={isLoading ? 'animate-spin' : ''} />
                  <span>{isLoading ? 'Menganalisis...' : 'Jalankan Analisis AI'}</span>
                </button>
              </div>
            </form>
          )}

          {/* AI Result Card */}
          {result && (
            <div className="space-y-4">
              {/* Agent Identifier & Confidence Bar */}
              <div className="p-4 bg-gradient-to-r from-emerald-950/60 to-gray-900 border border-emerald-500/30 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">Agent Spesialis Bertugas</span>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      {result.agentName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300 font-medium">Confidence:</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {result.confidence} (Tinggi)
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 italic border-l-2 border-emerald-500/50 pl-2.5 mt-2">
                  "{result.inputPrompt}"
                </p>
              </div>

              {/* Summary */}
              <div className="p-4 bg-gray-800/40 border border-gray-700/60 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1.5 flex items-center gap-1.5">
                  <BookOpen size={14} /> Rangkuman Informasi Biologis
                </h4>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Recommendations */}
              <div className="p-4 bg-gray-800/40 border border-gray-700/60 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Rekomendasi Tindakan Aman (Non-Risiko)
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-200">
                      <span className="text-emerald-400 font-bold mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Red Flags / Danger Signs */}
              {result.redFlags && result.redFlags.length > 0 && (
                <div className="p-4 bg-rose-950/30 border border-rose-500/40 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle size={14} /> Tanda Bahaya (Kapan Wajib Menemui Profesional)
                  </h4>
                  <ul className="space-y-1.5">
                    {result.redFlags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-rose-200">
                        <span className="text-rose-400 font-bold">⚠️</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-rose-300/80 mt-2 italic">
                    * Jika mengalami gejala di atas, segera konsultasikan langsung ke dokter, dokter hewan, atau balai pertanian berwenang.
                  </p>
                </div>
              )}

              {/* Knowledge Sources Citations */}
              {result.citations && result.citations.length > 0 && (
                <div className="p-3.5 bg-gray-950/60 border border-gray-800 rounded-xl">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">
                    Sumber Rujukan Ilmiah & Regulasi
                  </span>
                  <div className="space-y-1.5">
                    {result.citations.map((cite, i) => (
                      <div key={i} className="text-xs text-gray-300 flex items-center justify-between gap-2">
                        <span>
                          <strong>{cite.publisher}</strong> ({cite.year}): {cite.title}
                        </span>
                        {cite.url && (
                          <a
                            href={cite.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-0.5 text-[11px]"
                          >
                            Tautan <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legal & Medical Disclaimer Banner */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5">
                <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-200/90 leading-tight">
                  <strong className="text-amber-300">DISCLAIMER KESELAMATAN:</strong> {result.disclaimer}
                </p>
              </div>

              {/* Result Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Analisis Pertanyaan Lain
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CekkesAiCheckModal;
