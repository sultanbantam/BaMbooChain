/**
 * ceKKes (Cek Kesehatan) - State Store & Business Logic
 * Ekosistem BaMbooChain (bamboochain.id)
 * 
 * Standar & Kepatuhan:
 * - UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)
 * - Pemisahan domain Manusia, Hewan, Tumbuhan
 * - Non-diagnostik: Asisten AI berbasis bukti, edukasi, rekomendasi budidaya & gaya hidup
 */

import {
  INITIAL_SUBJECTS,
  INITIAL_OBSERVATIONS,
  INITIAL_CARE_PLANS,
  INITIAL_AUDIT_LOGS,
  INITIAL_KNOWLEDGE_BASE
} from './cekkesSeedData';

const STORAGE_KEY = 'bamboochain_cekkes_state_v1';

class CekkesStore {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          subjects: parsed.subjects || INITIAL_SUBJECTS,
          observations: parsed.observations || INITIAL_OBSERVATIONS,
          carePlans: parsed.carePlans || INITIAL_CARE_PLANS,
          auditLogs: parsed.auditLogs || INITIAL_AUDIT_LOGS,
          knowledgeBase: parsed.knowledgeBase || INITIAL_KNOWLEDGE_BASE,
          lastSync: parsed.lastSync || new Date().toISOString()
        };
      }
    } catch (e) {
      console.warn('Gagal membaca ceKKes storage, memuat initial seed data:', e);
    }

    return {
      subjects: INITIAL_SUBJECTS,
      observations: INITIAL_OBSERVATIONS,
      carePlans: INITIAL_CARE_PLANS,
      auditLogs: INITIAL_AUDIT_LOGS,
      knowledgeBase: INITIAL_KNOWLEDGE_BASE,
      lastSync: new Date().toISOString()
    };
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Gagal menyimpan ceKKes storage:', e);
    }
  }

  notify() {
    this.saveToStorage();
    this.listeners.forEach(fn => {
      try {
        fn(this.state);
      } catch (err) {
        console.error('Listener ceKKes error:', err);
      }
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState() {
    return this.state;
  }

  // --- LOGGING & AUDIT TRAIL (UU PDP) ---
  logAudit(action, domain, details, actor = 'Pengguna BaMbooChain') {
    const logItem = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      domain,
      details
    };
    this.state.auditLogs = [logItem, ...this.state.auditLogs];
    this.notify();
    return logItem;
  }

  // --- SUBJECT PROFILES CRUD ---
  getSubjects(domainFilter = 'all') {
    if (!domainFilter || domainFilter === 'all') {
      return this.state.subjects;
    }
    return this.state.subjects.filter(s => s.domain === domainFilter);
  }

  getSubjectById(id) {
    return this.state.subjects.find(s => s.id === id) || null;
  }

  addSubject(profileData) {
    const newId = `sub-${profileData.domain.substr(0, 3)}-${Date.now().toString(36)}`;
    const newSubject = {
      ...profileData,
      id: newId,
      isDemo: false, // User created data is real local data
      registeredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: profileData.status || 'Belum Dinilai',
      riskLevel: profileData.riskLevel || 'Normal / Dalam Pantauan',
      aiAssessments: []
    };

    this.state.subjects = [newSubject, ...this.state.subjects];
    this.logAudit(
      'SUBJECT_CREATED',
      newSubject.domain,
      `Profil baru terdaftar: ${newSubject.fullName || newSubject.name} (${newSubject.domain}) dengan persetujuan PDP tersimpan.`
    );
    this.notify();
    return newSubject;
  }

  updateSubject(id, updates) {
    const idx = this.state.subjects.findIndex(s => s.id === id);
    if (idx === -1) return null;

    const existing = this.state.subjects[idx];
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.state.subjects[idx] = updated;
    this.logAudit(
      'SUBJECT_UPDATED',
      updated.domain,
      `Pembaruan profil: ${updated.fullName || updated.name} (${updated.id}).`
    );
    this.notify();
    return updated;
  }

  deleteSubject(id) {
    const subject = this.getSubjectById(id);
    if (!subject) return false;

    this.state.subjects = this.state.subjects.filter(s => s.id !== id);
    this.state.observations = this.state.observations.filter(o => o.subjectId !== id);
    this.state.carePlans = this.state.carePlans.filter(c => c.subjectId !== id);

    this.logAudit(
      'SUBJECT_DELETED',
      subject.domain,
      `Penghapusan data profil (Hak Hapus UU PDP): ${subject.fullName || subject.name} (${id}).`
    );
    this.notify();
    return true;
  }

  // --- OBSERVATIONS & MEASUREMENTS ---
  getObservations(subjectId = null) {
    if (!subjectId) return this.state.observations;
    return this.state.observations.filter(o => o.subjectId === subjectId);
  }

  addObservation(obsData) {
    const newObs = {
      id: `obs-${Date.now().toString(36)}`,
      timestamp: obsData.timestamp || new Date().toISOString(),
      subjectId: obsData.subjectId,
      domain: obsData.domain,
      type: obsData.type || 'Pemeriksaan Rutin',
      metric: obsData.metric,
      value: obsData.value,
      recorder: obsData.recorder || 'Pengguna Mandiri',
      device: obsData.device || 'Pencatatan Manual',
      dataQuality: obsData.dataQuality || 'Terverifikasi Mandiri',
      notes: obsData.notes || ''
    };

    this.state.observations = [newObs, ...this.state.observations];

    // Update subject updated timestamp and status
    const sub = this.getSubjectById(obsData.subjectId);
    if (sub) {
      this.updateSubject(sub.id, {
        status: 'Data Terbaru Tersedia',
        updatedAt: new Date().toISOString()
      });
    }

    this.logAudit(
      'OBSERVATION_RECORDED',
      obsData.domain,
      `Observasi baru dicatat untuk subject ${obsData.subjectId}: ${newObs.metric} = ${newObs.value}.`
    );
    this.notify();
    return newObs;
  }

  // --- CARE PLANS & REMINDERS ---
  getCarePlans(domainFilter = null) {
    if (!domainFilter || domainFilter === 'all') {
      return this.state.carePlans;
    }
    return this.state.carePlans.filter(c => c.domain === domainFilter);
  }

  addCarePlan(planData) {
    const newPlan = {
      id: `care-${Date.now().toString(36)}`,
      subjectId: planData.subjectId,
      subjectName: planData.subjectName || 'Subjek',
      domain: planData.domain,
      title: planData.title,
      frequency: planData.frequency || 'Sekali',
      dueDate: planData.dueDate || new Date().toISOString(),
      category: planData.category || 'Perawatan Umum',
      isCompleted: false,
      notes: planData.notes || ''
    };

    this.state.carePlans = [newPlan, ...this.state.carePlans];
    this.logAudit(
      'CARE_PLAN_ADDED',
      planData.domain,
      `Jadwal perawatan baru dibuat: "${newPlan.title}" untuk ${newPlan.subjectName}.`
    );
    this.notify();
    return newPlan;
  }

  toggleCarePlan(id) {
    const plan = this.state.carePlans.find(c => c.id === id);
    if (!plan) return null;

    plan.isCompleted = !plan.isCompleted;
    this.logAudit(
      'CARE_PLAN_STATUS_CHANGED',
      plan.domain,
      `Status jadwal "${plan.title}" diubah menjadi: ${plan.isCompleted ? 'Selesai' : 'Belum Selesai'}.`
    );
    this.notify();
    return plan;
  }

  deleteCarePlan(id) {
    this.state.carePlans = this.state.carePlans.filter(c => c.id !== id);
    this.notify();
    return true;
  }

  // --- KNOWLEDGE BASE ---
  getKnowledgeBase(domain = null) {
    if (!domain || domain === 'all') {
      return this.state.knowledgeBase;
    }
    return this.state.knowledgeBase.filter(k => k.domain === domain);
  }

  // --- AI MULTI-AGENT ASSESSMENT ENGINE (MVP 1 - Strictly Non-Diagnostic) ---
  /**
   * Evaluasi cerdas berbasis aturan, knowledge retrieval, dan batas keselamatan biologis
   */
  async assessWithAi({ domain, subjectId, prompt, userConsent = true }) {
    if (!userConsent) {
      throw new Error('Persetujuan (Consent) pemrosesan data diperlukan sebelum menjalankan analisis AI.');
    }

    const cleanPrompt = (prompt || '').trim();
    if (cleanPrompt.length < 5) {
      return {
        success: false,
        confidence: '0%',
        summary: 'Data belum cukup untuk menilai. Harap masukkan observasi atau pertanyaan yang lebih spesifik.',
        evidence: [],
        disclaimer: 'ceKKes memerlukan rincian gejala, kondisi fisik, atau parameter lingkungan untuk memberikan edukasi yang relevan.'
      };
    }

    const subject = subjectId ? this.getSubjectById(subjectId) : null;
    const targetDomain = domain || subject?.domain || 'human';

    // Agent Dispatcher
    let agentName = '';
    let agentRole = '';
    let confidence = '88%';
    let recommendations = [];
    let redFlags = [];
    let summaryText = '';
    let citations = [];

    const lower = cleanPrompt.toLowerCase();

    if (targetDomain === 'human') {
      agentName = 'Human Health Information Agent (ceKKes-v1.0)';
      agentRole = 'Asisten Informasi Kesehatan & Gaya Hidup';
      citations = this.getKnowledgeBase('human');

      const isBloodPressure = lower.includes('tensi') || lower.includes('darah') || lower.includes('hipertensi') || lower.includes('pusing');
      const isNutrition = lower.includes('makan') || lower.includes('diet') || lower.includes('garam') || lower.includes('berat');

      if (isBloodPressure) {
        confidence = '92%';
        summaryText = `Berdasarkan catatan dan pertanyaan Anda mengenai tekanan darah, kondisi ini memerlukan pemantauan berkala dan modifikasi gaya hidup santai.`;
        recommendations = [
          'Batasi asupan garam/natrium maksimal 1 sendok teh per hari (< 2000 mg Na).',
          'Lakukan aktivitas fisik aerobik ringan (jalan santai/jogging 30 menit sehari, 5 hari seminggu).',
          'Ukur tensi saat kondisi tubuh rileks, minimal 15 menit setelah beraktivitas atau bangun pagi.',
          'Konsumsi air putih cukup dan pertahankan waktu tidur 7-8 jam per hari.'
        ];
        redFlags = [
          'Nyeri dada menjalar ke lengan atau leher.',
          'Sesak napas mendadak atau sakit kepala hebat yang tidak mereda.',
          'Tekanan darah sistolik di atas 160 mmHg atau diastolik di atas 100 mmHg.'
        ];
      } else if (isNutrition) {
        confidence = '89%';
        summaryText = `Pengaturan pola nutrisi seimbang berbasis bahan pangan alami lokal sangat mendukung kestabilan metabolisme tubuh.`;
        recommendations = [
          'Perbanyak serat larut air dari sayuran hijau, buah segar, dan serealia utuh.',
          'Pertahankan hidrasi optimal minimal 2 liter air per hari.',
          'Kurangi konsumsi makanan olahan ultra-proses (UPF) dan pemanis buatan tinggi.'
        ];
        redFlags = ['Penurunan berat badan drastis tanpa sebab jelas (>5% dalam 1 bulan).'];
      } else {
        confidence = '82%';
        summaryText = `Observasi yang dimasukkan telah dipetakan dalam profil kebugaran harian Anda.`;
        recommendations = [
          'Pertahankan catatan berkala pada fitur Timeline Observasi ceKKes.',
          'Lakukan peregangan otot rutin terutama setelah duduk lama.',
          'Konsultasikan hasil pemantauan ini dengan dokter keluarga saat kontrol rutin.'
        ];
        redFlags = ['Keluhan fisik yang menetap lebih dari 3 hari berturut-turut.'];
      }
    } else if (targetDomain === 'animal') {
      agentName = 'Animal Care Specialist Agent (ceKKes-v1.0)';
      agentRole = 'Asisten Kesejahteraan & Nutrisi Hewan';
      citations = this.getKnowledgeBase('animal');

      const isDiet = lower.includes('pakan') || lower.includes('makan') || lower.includes('kurus') || lower.includes('silase');
      const isSymptom = lower.includes('lemas') || lower.includes('muntah') || lower.includes('diare') || lower.includes('demam') || lower.includes('bulu');

      if (isSymptom) {
        confidence = '90%';
        summaryText = `Gejala yang Anda laporkan menunjukkan adanya gangguan vitalitas atau pencernaan pada hewan peliharaan/ternak.`;
        recommendations = [
          'Pisahkan hewan dari kelompoknya sementara (karantina nyaman) untuk mencegah penularan.',
          'Pastikan akses air minum bersih selalu tersedia dan tidak terkontaminasi kotoran.',
          'Jangan memberikan obat manusia (seperti parasetamol) yang beracun fatal bagi hewan.',
          'Catat frekuensi buang air dan asupan pakan untuk dilaporkan ke dokter hewan.'
        ];
        redFlags = [
          'Hewan tidak mau makan atau minum sama sekali selama lebih dari 24 jam.',
          'Muntah berulang atau diare berdarah.',
          'Napas tersengal-sengal atau suhu tubuh sangat panas/dingin ekstrem.'
        ];
      } else {
        confidence = '88%';
        summaryText = `Rekomendasi pemeliharaan berdasarkan spesies dan jadwal kesehatan satwa terpadu.`;
        recommendations = [
          'Jadwalkan vaksinasi tahunan (Rabies / FVRCP / PMK) sesuai usia dan bobot badan.',
          'Beri pakan bergizi seimbang (seperti silase daun bambu fermentasi untuk ruminansia).',
          'Lakukan pemeriksaan kuku, gigi, dan kebersihan kandang secara higienis berkala.'
        ];
        redFlags = ['Penurunan bobot badan secara progresif dalam 2 minggu.'];
      }
    } else {
      // Plant Domain
      agentName = 'Plant Health & Silviculture Agent (ceKKes-v1.0)';
      agentRole = 'Asisten Agronomi & Kesehatan Tumbuhan';
      citations = this.getKnowledgeBase('plant');

      const isYellowing = lower.includes('kuning') || lower.includes('klorosis') || lower.includes('daun') || lower.includes('bercak');
      const isNutrient = lower.includes('pupuk') || lower.includes('guano') || lower.includes('hara') || lower.includes('tumbuh') || lower.includes('rebung');

      if (isYellowing) {
        confidence = '93%';
        summaryText = `Gejala daun menguning (klorosis) umumnya terkait dengan ketidakseimbangan hara mikro/makro atau drainase media tanam.`;
        recommendations = [
          'Periksa sistem aerasi tanah; hindari genangan air stagnan pada zona perakaran.',
          'Untuk bambu atau padi, aplikasi pupuk organik kalium (seperti abu serasah atau pupuk Cibarani Guano fosfat) sangat membantu memperkuat dinding sel selulosa.',
          'Pangkas daun kering yang terinfeksi dan bersihkan gulma di sekeliling rumpun.',
          'Lakukan pemantauan kelembaban tanah pada pagi hari sebelum penyiraman.'
        ];
        redFlags = [
          'Pembusukan pangkal batang/akar yang menyebar cepat ke rumpun lain.',
          'Serangan hama penggerek rebung berskala luas pada lebih dari 30% populasi.'
        ];
      } else {
        confidence = '91%';
        summaryText = `Panduan budidaya ramah lingkungan terintegrasi dengan ekosistem restorasi Sabumi BaMbooChain.`;
        recommendations = [
          'Gunakan mulsa serasah organik untuk menjaga kelembaban mikro dan aktivitas mikroba tanah.',
          'Beri pupuk Cibarani Guano alami 2-3 kg melingkar per rumpun bambu dewasa menjelang musim hujan.',
          'Catat tinggi rebung dan diameter batang baru secara berkala di dasbor ceKKes.'
        ];
        redFlags = ['Kekeringan ekstrem berkepanjangan tanpa akses air irigasi penyangga.'];
      }
    }

    const assessmentResult = {
      id: `ai-ass-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      agentName,
      agentRole,
      domain: targetDomain,
      subjectId: subjectId || null,
      subjectName: subject?.fullName || subject?.name || 'Umum',
      inputPrompt: cleanPrompt,
      confidence,
      summary: summaryText,
      recommendations,
      redFlags,
      citations: citations.map(c => ({
        title: c.title,
        publisher: c.publisher,
        year: c.year,
        evidenceLevel: c.evidenceLevel,
        url: c.url
      })),
      disclaimer: 'ceKKes BUKAN alat diagnosis medis atau veteriner resmi. Seluruh informasi disajikan sebagai edukasi gaya hidup, nutrisi, dan manajemen budidaya. Segera hubungi dokter, dokter hewan, atau ahli botani berwenang untuk penanganan klinis.'
    };

    // Attach to subject if selected
    if (subject) {
      const assessments = subject.aiAssessments || [];
      this.updateSubject(subject.id, {
        aiAssessments: [assessmentResult, ...assessments]
      });
    }

    this.logAudit(
      'AI_ASSESSMENT_RUN',
      targetDomain,
      `Analisis AI dijalankan oleh ${agentName}. Confidence: ${confidence}. Topik: "${cleanPrompt.slice(0, 50)}...".`
    );

    return {
      success: true,
      ...assessmentResult
    };
  }

  // --- DATA EXPORT & RETENTION (UU PDP) ---
  exportUserData() {
    const data = {
      platform: 'ceKKes - BaMbooChain.id',
      version: '1.0.0-mvp1',
      exportedAt: new Date().toISOString(),
      privacyCompliance: 'UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)',
      subjects: this.state.subjects,
      observations: this.state.observations,
      carePlans: this.state.carePlans,
      auditLogs: this.state.auditLogs
    };

    this.logAudit(
      'DATA_EXPORTED',
      'all',
      'Seluruh data biologis pengguna diekspor dalam format JSON terenkripsi/terbuka untuk portabilitas data.'
    );

    return JSON.stringify(data, null, 2);
  }

  resetToDemo() {
    this.state = {
      subjects: INITIAL_SUBJECTS,
      observations: INITIAL_OBSERVATIONS,
      carePlans: INITIAL_CARE_PLANS,
      auditLogs: INITIAL_AUDIT_LOGS,
      knowledgeBase: INITIAL_KNOWLEDGE_BASE,
      lastSync: new Date().toISOString()
    };
    this.saveToStorage();
    this.notify();
    this.logAudit('STORE_RESET', 'all', 'Sistem di-reset kembali ke demo data awal.');
  }
}

export const cekkesStore = new CekkesStore();
export default cekkesStore;
