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
  Leaf
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
        maxWidth: '740px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden',
        color: '#ffffff'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid #334155',
          background: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(13, 148, 136, 0.25)', padding: '8px', borderRadius: '10px', color: '#2dd4bf' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Asisten Analisis AI ceKKes
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  Multi-Agent v1.0
                </span>
              </h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                Edukasi biologis berbasis bukti, batasan keselamatan & non-diagnostik klinis
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

        {/* Modal Content */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Domain & Subject Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', marginBottom: '6px' }}>Domain Biologis</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                {[
                  { id: 'human', label: 'Manusia', icon: <Heart size={14} />, color: '#10b981' },
                  { id: 'animal', label: 'Hewan', icon: <Dog size={14} />, color: '#f59e0b' },
                  { id: 'plant', label: 'Tumbuhan', icon: <Leaf size={14} />, color: '#14b8a6' },
                ].map(d => {
                  const isSel = domain === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => { setDomain(d.id); setSelectedSubjectId(''); setResult(null); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: isSel ? `1px solid ${d.color}` : '1px solid #334155',
                        background: isSel ? 'rgba(16, 185, 129, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                        color: isSel ? d.color : '#94a3b8',
                        fontWeight: '700',
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      {d.icon} {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', marginBottom: '6px' }}>Subjek Terdaftar (Opsional)</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
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

          {!result && (
            <form onSubmit={handleRunAssessment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', marginBottom: '6px' }}>
                  Deskripsi Observasi / Gejala / Pertanyaan Perawatan *
                </label>
                <textarea
                  rows={3}
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Deskripsikan observasi Anda secara detail (misal: pengukuran tensi, perubahan perilaku hewan, kondisi daun/tanaman)..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Quick Prompt Suggestions */}
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                  Contoh Pertanyaan Cepat:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(QUICK_PROMPTS[domain] || []).map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(sample)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '999px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#cbd5e1',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      "{sample}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Consent Toggle */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <input
                  type="checkbox"
                  id="ai-consent"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  style={{ marginTop: '3px', cursor: 'pointer' }}
                />
                <label htmlFor="ai-consent" style={{ fontSize: '0.75rem', color: '#e2e8f0', cursor: 'pointer', lineHeight: 1.5 }}>
                  <strong style={{ color: '#34d399' }}>Persetujuan Pemrosesan AI:</strong> Saya mengizinkan AI Agent ceKKes memproses teks observasi di atas untuk memberikan rekomendasi gaya hidup/budidaya non-diagnostik. Saya memahami bahwa hasil ini <strong>bukan vonis medis atau veteriner klinis</strong>.
                </label>
              </div>

              {errorMsg && (
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(224, 49, 49, 0.15)',
                  border: '1px solid rgba(224, 49, 49, 0.4)',
                  borderRadius: '10px',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertTriangle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '6px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    background: '#334155',
                    border: 'none',
                    color: '#cbd5e1',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.35)'
                  }}
                >
                  <Sparkles size={16} />
                  <span>{isLoading ? 'Menganalisis...' : 'Jalankan Analisis AI'}</span>
                </button>
              </div>
            </form>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Agent Identifier */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '14px',
                padding: '14px 16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', color: '#34d399', letterSpacing: '0.5px' }}>
                      Agent Spesialis
                    </span>
                    <h3 style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>
                      {result.agentName}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Confidence:</span>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: 'rgba(16, 185, 129, 0.25)',
                      color: '#6ee7b7',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      border: '1px solid rgba(16, 185, 129, 0.4)'
                    }}>
                      {result.confidence} (Tinggi)
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '14px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#2dd4bf', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={14} /> Rangkuman Informasi Biologis
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                  {result.summary}
                </p>
              </div>

              {/* Recommendations */}
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '14px' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} /> Rekomendasi Tindakan Aman (Non-Risiko)
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.83rem', color: '#e2e8f0' }}>
                  {result.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Red Flags */}
              {result.redFlags && result.redFlags.length > 0 && (
                <div style={{ background: 'rgba(153, 27, 27, 0.25)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '12px', padding: '14px' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={14} /> Tanda Bahaya (Kapan Wajib Menemui Profesional)
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: '#fecaca' }}>
                    {result.redFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Citations */}
              {result.citations && result.citations.length > 0 && (
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '12px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Sumber Rujukan Ilmiah & Regulasi Terverifikasi
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {result.citations.map((cite, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span><strong>{cite.publisher}</strong> ({cite.year}): {cite.title}</span>
                        {cite.url && (
                          <a href={cite.url} target="_blank" rel="noopener noreferrer" style={{ color: '#34d399', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem' }}>
                            Tautan <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div style={{ background: 'rgba(245, 159, 0, 0.15)', border: '1px solid rgba(245, 159, 0, 0.4)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <ShieldAlert size={18} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#fef3c7', lineHeight: 1.5 }}>
                  <strong style={{ color: '#fde68a' }}>DISCLAIMER KESELAMATAN:</strong> {result.disclaimer}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px', borderTop: '1px solid #334155' }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    background: '#334155',
                    border: 'none',
                    color: '#cbd5e1',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Analisis Pertanyaan Lain
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '9px 22px',
                    borderRadius: '10px',
                    background: '#10b981',
                    border: 'none',
                    color: '#022c22',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
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
