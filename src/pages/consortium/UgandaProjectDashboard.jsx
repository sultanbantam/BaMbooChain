import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Shield, FileText, CheckCircle2, Clock, AlertTriangle, 
  UploadCloud, Download, ExternalLink, Calendar, Users, 
  Layers, MapPin, Building2, Briefcase, Plus, X, Video, 
  CheckSquare, ArrowRight, Lock, Eye, Search, Sparkles,
  MessageSquare, Send, Image, Film, Tag, ThumbsUp, Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { 
  useUgandaProjectDocuments, 
  useUgandaProjectTasks, 
  useUgandaProjectGallery 
} from '../../hooks/useFirestoreQueries';
import { db } from '../../firebase/config';
import { 
  collection, addDoc, updateDoc, doc, deleteDoc, 
  serverTimestamp, arrayUnion, onSnapshot, query, orderBy 
} from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────
// MULTILINGUAL DICTIONARY (ID, EN, JA) - 100% UNIFIED TRANSLATION
// ─────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  id: {
    confidentialBadge: "🔒 Portal Konsorsium Rahasia",
    virtualRoomBtn: "Ruang Rapat Virtual",
    subtitleBadge: "Inisiatif Kemitraan Strategis Infrastruktur Trilateral & Bambu",
    mainTitle: "Dashboard Proyek Konsorsium Uganda – Indonesia",
    heroDesc: "Pusat komando terpadu untuk koordinasi transfer teknologi konstruksi KSLL (PT Katama), modular sustainable housing RISHAM & BlockBamboo (PERPUBI & Panorama Agung), fasilitasi kelembagaan pemerintah SADO Uganda, dan implementasi lapangan Kangker Construction Ltd.",
    badgeLead: "🏢 Koordinator Utama: PT Katama Suryabumi",
    badgeEnabling: "🏛️ Badan Fasilitator: SADO Uganda",
    badgeConstruction: "🏗️ Pelaksana Konstruksi: Kangker Construction Ltd",
    badgeAgro: "🎋 Agro & Bambu: PERPUBI",
    
    // KPIs
    kpiNdaTitle: "Status Legalitas NDA",
    kpiNdaStatus: "Aktif & Mengikat",
    kpiNdaSub: "Masa Berlaku: 5 Tahun (Pasal 16)",
    kpiRoadmapTitle: "Roadmap Kemitraan",
    kpiRoadmapStatus: "Step 1 dari 11",
    kpiRoadmapSub: "Target HoA: 90 Hari (Pasal 13)",
    kpiVaultTitle: "Total Dokumen Vault",
    kpiVaultStatus: "Berkas Terverifikasi",
    kpiVaultSub: "Tersimpan di Cloud Terenkripsi",
    kpiFundingTitle: "Target Pembiayaan",
    kpiFundingStatus: "IsDB & Climate Funds",
    kpiFundingSub: "Fasilitasi Multilateral (Pasal 15)",

    // Tabs
    tabRoadmap: "11-Step Roadmap",
    tabVault: "Legal Vault & Dokumen",
    tabTasks: "Manajemen Proyek",
    tabGallery: "Dokumentasi & Galeri",
    tabStakeholders: "Direktori Stakeholders",

    // Roadmap Tab
    roadmapHeading: "Roadmap & Tahapan Eksekusi Kerja Sama (Pasal 26 & Lampiran)",
    roadmapSub: "Pelacakan progres berjenjang mulai dari penandatanganan NDA hingga ekspansi proyek konstruksi di Afrika.",
    statusCompleted: "SELESAI",
    statusInProgress: "SEDANG BERJALAN",
    statusPending: "MENUNGGU TAHAP",
    btnStepNotes: "Catatan Progres",
    btnUpdateStatus: "Perbarui Status",

    // Vault Tab
    searchDocPlaceholder: "Cari berkas dokumen atau klausul...",
    btnUploadDoc: "Unggah Dokumen / Addendum Baru",
    labelParties: "Para Pihak",
    labelClauses: "Cakupan / Klausul",
    btnDownloadDoc: "Unduh Berkas",
    internalDraft: "Draft Internal",
    btnDiscussDoc: "Diskusi & Komentar",

    // Tasks Tab
    tasksHeading: "Matriks Tugas & Rencana Kerja Konsorsium",
    tasksSub: "Pembagian penugasan PIC lintas instansi (Katama, SADO, Kangker, PERPUBI, Turkodom).",
    btnAddTask: "Tambah Tugas Baru",
    labelPic: "PIC Penanggung Jawab",
    labelTarget: "Target Selesai",
    statusDone: "Selesai",

    // Gallery Tab
    itineraryHeading: "Itinerary Kunjungan Delegasi Uganda ke Indonesia (31 Ags – 5 Sept 2026)",
    colDate: "Tanggal",
    colAgenda: "Lokasi & Agenda Kunjungan",
    colFocus: "Fokus Utama",
    galleryHeading: "Dokumentasi Foto & Video Kegiatan Konsorsium",
    gallerySub: "Arsip dokumentasi resmi kunjungan lapangan, penandatanganan MoU, dan riset teknologi.",
    btnUploadMedia: "Unggah Foto / Video Dokumentasi",

    // Stakeholders Tab
    stakeholdersHeading: "Direktori Entitas & Kontak Pimpinan Konsorsium",
    stakeholdersSub: "Daftar resmi para pihak penandatangan dan mitra strategis teknologi Indonesia.",
    labelMandate: "Peran & Mandat Kerja Sama",

    // Comments & Modals
    commentSectionTitle: "Tanggapan & Diskusi Stakeholder",
    commentPlaceholder: "Tulis komentar atau instruksi untuk konsorsium...",
    btnSendComment: "Kirim Tanggapan",
    noCommentsYet: "Belum ada tanggapan. Jadilah yang pertama memberikan masukan!",
    modalUploadDocTitle: "Unggah Berkas ke Legal Vault",
    modalUploadMediaTitle: "Unggah Dokumentasi (Foto / Video)",
    modalAddTaskTitle: "Tambah Tugas Konsorsium",
    labelTitle: "Judul",
    labelType: "Tipe",
    labelMediaUrl: "Tautan Video / Media (Opsional)",
    labelUploadFile: "Pilih Berkas (PDF, DOCX, ZIP, CAD)",
    labelUploadImage: "Pilih Foto / Video",
    btnSubmit: "Simpan & Publikasikan",
    btnProcessing: "Memproses & Mengunggah...",

    // Restricted Access Screen
    restrictedTitle: "Akses Terbatas: Proyek Konsorsium Uganda",
    restrictedDesc: "Dashboard ini dilindungi oleh Perjanjian Kerahasiaan (NDA) & Non-Circumvention trilateral antara PT Katama Suryabumi, SADO, dan Kangker Construction International Ltd.",
    authorizedListTitle: "Entitas yang Berhak Mengakses:",
    btnBackHome: "Kembali ke Beranda",
    btnRequestAccess: "Ajukan Izin Akses"
  },
  en: {
    confidentialBadge: "🔒 Confidential Consortium Portal",
    virtualRoomBtn: "Virtual Meeting Room",
    subtitleBadge: "Strategic Trilateral Infrastructure & Bamboo Partnership Initiative",
    mainTitle: "Uganda – Indonesia Consortium Project Dashboard",
    heroDesc: "Unified command center for coordinating KSLL construction technology transfer (PT Katama), modular sustainable housing RISHAM & BlockBamboo (PERPUBI & Panorama Agung), SADO Uganda government institutional facilitation, and Kangker Construction Ltd field implementation.",
    badgeLead: "🏢 Lead Coordinator: PT Katama Suryabumi",
    badgeEnabling: "🏛️ Enabling Agency: SADO Uganda",
    badgeConstruction: "🏗️ Construction Partner: Kangker Construction Ltd",
    badgeAgro: "🎋 Agro & Bamboo: PERPUBI",

    // KPIs
    kpiNdaTitle: "NDA Legal Status",
    kpiNdaStatus: "Active & Binding",
    kpiNdaSub: "Validity: 5 Years (Clause 16)",
    kpiRoadmapTitle: "Partnership Roadmap",
    kpiRoadmapStatus: "Step 1 of 11",
    kpiRoadmapSub: "HoA Target: 90 Days (Clause 13)",
    kpiVaultTitle: "Total Vault Documents",
    kpiVaultStatus: "Verified Files",
    kpiVaultSub: "Encrypted Cloud Storage",
    kpiFundingTitle: "Funding Target",
    kpiFundingStatus: "IsDB & Climate Funds",
    kpiFundingSub: "Multilateral Engagement (Clause 15)",

    // Tabs
    tabRoadmap: "11-Step Roadmap",
    tabVault: "Legal Vault & Documents",
    tabTasks: "Project Management",
    tabGallery: "Documentation & Gallery",
    tabStakeholders: "Stakeholder Directory",

    // Roadmap Tab
    roadmapHeading: "Roadmap & Execution Steps (Clause 26 & Annex)",
    roadmapSub: "Milestone tracking from NDA signing to large-scale construction expansion across Africa.",
    statusCompleted: "COMPLETED",
    statusInProgress: "IN PROGRESS",
    statusPending: "PENDING STAGE",
    btnStepNotes: "Progress Notes",
    btnUpdateStatus: "Update Status",

    // Vault Tab
    searchDocPlaceholder: "Search documents or clauses...",
    btnUploadDoc: "Upload New Document / Addendum",
    labelParties: "Parties Involved",
    labelClauses: "Scope / Key Clauses",
    btnDownloadDoc: "Download File",
    internalDraft: "Internal Draft",
    btnDiscussDoc: "Discussion & Comments",

    // Tasks Tab
    tasksHeading: "Task Matrix & Consortium Work Plan",
    tasksSub: "Cross-organizational task delegation (Katama, SADO, Kangker, PERPUBI, Turkodom).",
    btnAddTask: "Add New Task",
    labelPic: "Assigned PIC",
    labelTarget: "Due Date",
    statusDone: "Done",

    // Gallery Tab
    itineraryHeading: "Official Itinerary: Uganda Delegation Visit to Indonesia (Aug 31 – Sept 5, 2026)",
    colDate: "Date",
    colAgenda: "Location & Visit Agenda",
    colFocus: "Key Focus Area",
    galleryHeading: "Photo & Video Documentation of Consortium Activities",
    gallerySub: "Official documentation archive of field visits, MoU signings, and technology research.",
    btnUploadMedia: "Upload Photo / Video",

    // Stakeholders Tab
    stakeholdersHeading: "Consortium Leadership & Stakeholder Directory",
    stakeholdersSub: "Official signatory parties and Indonesian strategic technology partners.",
    labelMandate: "Role & Consortium Mandate",

    // Comments & Modals
    commentSectionTitle: "Stakeholder Comments & Feedback",
    commentPlaceholder: "Write a note or instruction for the consortium...",
    btnSendComment: "Post Comment",
    noCommentsYet: "No comments yet. Be the first to start the discussion!",
    modalUploadDocTitle: "Upload File to Legal Vault",
    modalUploadMediaTitle: "Upload Media (Photo / Video)",
    modalAddTaskTitle: "Add Consortium Task",
    labelTitle: "Title",
    labelType: "Type",
    labelMediaUrl: "Video / Media URL (Optional)",
    labelUploadFile: "Select File (PDF, DOCX, ZIP, CAD)",
    labelUploadImage: "Select Photo / Video",
    btnSubmit: "Save & Publish",
    btnProcessing: "Processing & Uploading...",

    // Restricted Access Screen
    restrictedTitle: "Restricted Access: Uganda Consortium Project",
    restrictedDesc: "This dashboard is protected by the trilateral Non-Disclosure Agreement (NDA) & Non-Circumvention between PT Katama Suryabumi, SADO, and Kangker Construction International Ltd.",
    authorizedListTitle: "Authorized Entities:",
    btnBackHome: "Back to Home",
    btnRequestAccess: "Request Access"
  },
  ja: {
    confidentialBadge: "🔒 機密コンソーシアムポータル",
    virtualRoomBtn: "バーチャル会議室",
    subtitleBadge: "ウガンダ・インドネシア戦略的インフラ＆竹イノベーション共同事業",
    mainTitle: "ウガンダ–インドネシア コンソーシアムプロジェクトダッシュボード",
    heroDesc: "KSLL建築工法（PT Katama）、モジュール式住宅RISHAM＆BlockBamboo（PERPUBI＆Panorama Agung）、ウガンダ政府機関連携（SADO）、および現地施工（Kangker Construction Ltd）の技術移転と事業推進を統括する専用コマンドセンターです。",
    badgeLead: "🏢 主幹コーディネーター: PT Katama Suryabumi",
    badgeEnabling: "🏛️ 推進機関: SADO Uganda",
    badgeConstruction: "🏗️ 施工パートナー: Kangker Construction Ltd",
    badgeAgro: "🎋 竹・アグロフォレストリー: PERPUBI",

    // KPIs
    kpiNdaTitle: "秘密保持契約 (NDA)",
    kpiNdaStatus: "締結済・有効",
    kpiNdaSub: "有効期間: 5年間（第16条）",
    kpiRoadmapTitle: "ロードマップ進行度",
    kpiRoadmapStatus: "ステップ 1 / 11",
    kpiRoadmapSub: "HoA策定目標: 90日以内（第13条）",
    kpiVaultTitle: "保管文書数",
    kpiVaultStatus: "検証済みファイル",
    kpiVaultSub: "暗号化クラウド保管",
    kpiFundingTitle: "資金調達目標",
    kpiFundingStatus: "IsDB＆気候変動基金",
    kpiFundingSub: "多国間機関連携（第15条）",

    // Tabs
    tabRoadmap: "11段階ロードマップ",
    tabVault: "法的文書・保管庫",
    tabTasks: "プロジェクト管理",
    tabGallery: "記録・ギャラリー",
    tabStakeholders: "関係者ディレクトリ",

    // Roadmap Tab
    roadmapHeading: "事業ロードマップ＆実行段階（第26条および付属書）",
    roadmapSub: "NDA締結からアフリカ全域への建築事業展開までの進捗管理。",
    statusCompleted: "完了",
    statusInProgress: "進行中",
    statusPending: "待機中",
    btnStepNotes: "進捗メモ",
    btnUpdateStatus: "ステータス更新",

    // Vault Tab
    searchDocPlaceholder: "文書名や条項を検索...",
    btnUploadDoc: "新規文書 / 覚書をアップロード",
    labelParties: "関係当事者",
    labelClauses: "概要・主要条項",
    btnDownloadDoc: "ファイルをダウンロード",
    internalDraft: "内部ドラフト",
    btnDiscussDoc: "協議・コメント",

    // Tasks Tab
    tasksHeading: "タスク管理・実施計画マトリクス",
    tasksSub: "関係機関（Katama、SADO、Kangker、PERPUBI、Turkodom）による担当タスク分担。",
    btnAddTask: "新規タスク追加",
    labelPic: "担当責任者",
    labelTarget: "完了予定日",
    statusDone: "完了",

    // Gallery Tab
    itineraryHeading: "ウガンダ代表団来日公式日程（2026年8月31日～9月5日）",
    colDate: "日付",
    colAgenda: "訪問先＆公式日程",
    colFocus: "主要アジェンダ",
    galleryHeading: "コンソーシアム活動 写真・映像アーカイブ",
    gallerySub: "現地視察、MoU署名式、技術研究の公式記録資料。",
    btnUploadMedia: "写真 / 動画をアップロード",

    // Stakeholders Tab
    stakeholdersHeading: "コンソーシアム代表・関係機関ディレクトリ",
    stakeholdersSub: "調印当事者およびインドネシア側技術戦略パートナー一覧。",
    labelMandate: "役割・担当権限",

    // Comments & Modals
    commentSectionTitle: "関係者コメント＆ディスカッション",
    commentPlaceholder: "コンソーシアム宛ての連絡・指示事項を入力...",
    btnSendComment: "コメントを送信",
    noCommentsYet: "コメントはまだありません。最初の意見を投稿しましょう！",
    modalUploadDocTitle: "法的保管庫に文書をアップロード",
    modalUploadMediaTitle: "記録写真・動画をアップロード",
    modalAddTaskTitle: "新規タスクを追加",
    labelTitle: "タイトル",
    labelType: "種類",
    labelMediaUrl: "動画/メディアURL（任意）",
    labelUploadFile: "ファイルを選択（PDF、DOCX、ZIP、CAD）",
    labelUploadImage: "写真・動画を選択",
    btnSubmit: "保存して公開",
    btnProcessing: "処理中・アップロード中...",

    // Restricted Access Screen
    restrictedTitle: "アクセス制限：ウガンダコンソーシアムプロジェクト",
    restrictedDesc: "本ダッシュボードは、PT Katama Suryabumi、SADO、およびKangker Construction International Ltd間で締結された秘密保持契約（NDA）により保護されています。",
    authorizedListTitle: "アクセス権限保有機関：",
    btnBackHome: "ホームへ戻る",
    btnRequestAccess: "アクセス権を申請"
  }
};

// ─────────────────────────────────────────────────────────────
// ROADMAP STEPS DATA (Multilingual support)
// ─────────────────────────────────────────────────────────────
const ROADMAP_STEPS = [
  { step: 1, title_id: 'Penandatanganan NDA & Non-Circumvention Agreement', title_en: 'Signing of NDA & Non-Circumvention Agreement', title_ja: 'NDAおよび不正競争防止協定の締結', status: 'completed', date: 'Sept 2026', desc_id: 'Penandatanganan Perjanjian Kerahasiaan & Kerangka Kemitraan di Jakarta antara Katama, SADO, Kangker, dan mitra Indonesia.', desc_en: 'Signing of NDA and Strategic Framework in Jakarta between Katama, SADO, Kangker, and Indonesian partners.', desc_ja: 'ジャカルタにてKatama、SADO、Kangker、およびインドネシアパートナー間での秘密保持契約・枠組み合意の調印。' },
  { step: 2, title_id: 'Heads of Agreement / Interim Partnership Agreement', title_en: 'Heads of Agreement / Interim Partnership Agreement', title_ja: '基本合意書（HoA）/ 暫定パートナーシップ契約', status: 'in-progress', date: 'Okt 2026', desc_id: 'Penyusunan kesepakatan transisi operasional, jalur komunikasi, focal person, serta pembagian fee fasilitasi.', desc_en: 'Drafting operational transition agreements, communication channels, focal persons, and facilitation fee mechanisms.', desc_ja: '暫定運用協定、連絡窓口、担当者、および推進手数料メカニズムの策定。' },
  { step: 3, title_id: 'Main Strategic Partnership Agreement', title_en: 'Main Strategic Partnership Agreement', title_ja: '本戦略的パートナーシップ協定の締結', status: 'pending', date: 'Des 2026', desc_id: 'Penyelesaian Main Agreement dalam 90 hari setelah konfirmasi tertulis implementasi proyek.', desc_en: 'Finalizing Main Agreement within 90 days following written confirmation of project advancement.', desc_ja: 'プロジェクト推進の書面確認後90日以内における本協定の締結完了。' },
  { step: 4, title_id: 'Government & Bilateral Engagement', title_en: 'Government & Bilateral Engagement', title_ja: '政府間協議・二国間エンゲージメント', status: 'in-progress', date: 'Sept - Nov 2026', desc_id: 'Fasilitasi pertemuan tingkat kementerian dan bilateral institusional di Uganda melalui peran SADO.', desc_en: 'Facilitating ministerial and institutional bilateral meetings in Uganda through SADO.', desc_ja: 'SADOを通じたウガンダ政府省庁および関係機関との二国間ハイレベル会談の推進。' },
  { step: 5, title_id: 'Uganda Technical & Business Mission', title_en: 'Uganda Technical & Business Mission', title_ja: 'ウガンダ技術・ビジネス公式視察団派遣', status: 'pending', date: 'Q1 2027', desc_id: 'Misi kunjungan tim teknis dan bisnis Indonesia ke Kampala untuk survei lapangan dan lokasi proyek.', desc_en: 'Indonesian technical and business delegation mission to Kampala for field and site surveys.', desc_ja: '現地調査および建設予定地視察のためのインドネシア技術・ビジネス代表団のカンパラ派遣。' },
  { step: 6, title_id: 'Pilot Project / Proof of Concept (PoC)', title_en: 'Pilot Project / Proof of Concept (PoC)', title_ja: 'パイロットプロジェクト / 概念実証（PoC）', status: 'pending', date: 'Q2 2027', desc_id: 'Pengiriman mould, komponen, dan sistem teknis KSLL serta prototype Rumah Modular BlockBamboo/RISHAM.', desc_en: 'Dispatching KSLL moulds, components, and technical systems along with BlockBamboo/RISHAM modular housing prototypes.', desc_ja: 'KSLL型枠・部材・技術システムおよびBlockBamboo/RISHAMモジュール住宅試作機の搬送と実証。' },
  { step: 7, title_id: 'Technical & Commercial Feasibility', title_en: 'Technical & Commercial Feasibility', title_ja: '技術的・商業的フィージビリティスタディ', status: 'pending', date: 'Q2 2027', desc_id: 'Investigasi tanah setempat, regulasi bangunan Uganda, uji struktur, dan kelayakan finansial.', desc_en: 'Local geotechnical soil investigation, Uganda building codes, structural testing, and financial feasibility.', desc_ja: 'ウガンダ現地の土質調査、建築基準適合性、構造試験、および財務採算性分析。' },
  { step: 8, title_id: 'Development Financing & IsDB Engagement', title_en: 'Development Financing & IsDB Engagement', title_ja: '開発金融・イスラム開発銀行（IsDB）連携', status: 'pending', date: 'Q3 2027', desc_id: 'Eksplorasi pendanaan pembangunan dari Islamic Development Bank (IsDB), multilateral banks, dan climate fund.', desc_en: 'Exploring development funding from Islamic Development Bank (IsDB), multilateral institutions, and climate finance.', desc_ja: 'イスラム開発銀行（IsDB）、多国間開発銀行、気候変動ファンドからの開発融資・グラント調達。' },
  { step: 9, title_id: 'Technology Transfer & Local Manufacturing', title_en: 'Technology Transfer & Local Manufacturing', title_ja: '技術移転・現地製造・人材育成', status: 'pending', date: 'Q4 2027', desc_id: 'Pelatihan tenaga kerja lokal Uganda, perakitan lokal, dan standardisasi Quality Control/QA.', desc_en: 'Local workforce training in Uganda, local assembly, and Quality Control/QA standardization.', desc_ja: 'ウガンダ現地技術者の育成・トレーニング、現地製造体制の確立および品質管理標準化。' },
  { step: 10, title_id: 'Project-Specific Implementation', title_en: 'Project-Specific Implementation', title_ja: '個別プロジェクトの本格着工・施工', status: 'pending', date: '2028', desc_id: 'Pelaksanaan konstruksi perumahan, rumah sakit, diagnostic centres, dan fasilitas publik.', desc_en: 'Executing construction for housing, healthcare facilities, diagnostic centers, and civic infrastructure.', desc_ja: '住宅地造成、病院、診断センター、および公共インフラの本格的な建設工事実施。' },
  { step: 11, title_id: 'Scale-Up in Uganda & African Markets', title_en: 'Scale-Up in Uganda & African Markets', title_ja: 'ウガンダ国内およびアフリカ全域への展開', status: 'pending', date: '2028+', desc_id: 'Ekspansi regional ke negara-negara Afrika yang disepakati bersama konsorsium.', desc_en: 'Regional scaling across mutually agreed African markets by the consortium.', desc_ja: 'コンソーシアム合意に基づくウガンダ全土および東アフリカ周辺市場へのスケール拡大。' }
];

// Initial default documents
const INITIAL_DOCUMENTS = [
  {
    id: 'doc-nda-001',
    title: 'Perjanjian Kerahasiaan, Non-Pengungkapan, Non-Circumvention & Kemitraan Strategis (NDA)',
    type: 'Legal Agreement',
    parties: 'PT Katama Suryabumi, SADO, Kangker Construction',
    date: 'September 2026',
    status: 'Signed & Active',
    fileUrl: '/event/uganda.png',
    clauses: '26 Pasal (KSLL, RISHAM, Non-Circumvention, IsDB Funding, Fee SADO & Jimmy)',
    comments: [
      { id: 'c1', author: 'PT Katama (Drs. M. Kris Suyanto)', text: 'Perjanjian NDA resmi mengikat dan melindungi lisensi KSLL di wilayah Uganda & Afrika.', timestamp: '2026-09-01T10:00:00Z', role: 'Lead Indonesian Party' },
      { id: 'c2', author: 'SADO Uganda (Dr. Nelson Muzira)', text: 'Received and confirmed. Ministry coordination in Kampala has been initiated.', timestamp: '2026-09-01T14:30:00Z', role: 'Enabling Agency' }
    ]
  },
  {
    id: 'doc-ksll-002',
    title: 'Spesifikasi Teknis & Lisensi Penerapan Konstruksi Sarang Laba-Laba (KSLL)',
    type: 'Technical License',
    parties: 'PT Katama Suryabumi',
    date: 'Agustus 2026',
    status: 'Verified',
    fileUrl: '#',
    clauses: 'Analisis Geoteknik, Investigasi Tanah, Desain Beban Bangunan Tahan Gempa',
    comments: [
      { id: 'c3', author: 'Kangker Construction (Mr. Samuel)', text: 'We are preparing our engineering team to review the soil parameters in Kampala.', timestamp: '2026-09-02T09:15:00Z', role: 'Construction Lead' }
    ]
  },
  {
    id: 'doc-risham-003',
    title: 'Kerangka Lisensi & Alih Teknologi RISHAM (Rumah Instan Sehat Aman)',
    type: 'Technology Transfer',
    parties: 'PT Panorama Agung Utama & PERPUBI',
    date: 'Agustus 2026',
    status: 'Verified',
    fileUrl: '#',
    clauses: 'Desain Modular, Prefabrikasi BlockBamboo, Standar Hunian Berkelanjutan',
    comments: []
  },
  {
    id: 'doc-annex-004',
    title: 'Annex A & B: Register of Introduced Contacts & African Territories',
    type: 'Annex / Register',
    parties: 'SADO & PT Katama Suryabumi',
    date: 'September 2026',
    status: 'Active',
    fileUrl: '#',
    clauses: 'Perlindungan Kontak Non-Circumvention 5 Tahun di Uganda dan Pasar Afrika',
    comments: []
  }
];

const INITIAL_TASKS = [
  { id: 't-1', title: 'Finalisasi Penandatanganan NDA Trilateral di Jakarta', category: 'Legal', assignee: 'Katama / SADO / Kangker', status: 'Done', dueDate: 'Sept 2026', comments: [] },
  { id: 't-2', title: 'Penyusunan Draft Heads of Agreement (HoA)', category: 'Legal', assignee: 'Lead Indonesian Party & SADO', status: 'In Progress', dueDate: 'Okt 2026', comments: [] },
  { id: 't-3', title: 'Persiapan Dokumen Teknis KSLL untuk Karakteristik Tanah Uganda', category: 'Engineering', assignee: 'Tim Engineer PT Katama', status: 'In Progress', dueDate: 'Nov 2026', comments: [] },
  { id: 't-4', title: 'Pembuatan Mockup Modular BlockBamboo untuk Display Ekspor', category: 'R&D', assignee: 'PERPUBI & Panorama Agung', status: 'In Progress', dueDate: 'Nov 2026', comments: [] },
  { id: 't-5', title: 'Audiensi dengan Perwakilan IsDB & Lembaga Pembiayaan Pembangunan', category: 'Financing', assignee: 'SADO & Turkodom Consulting', status: 'Pending', dueDate: 'Des 2026', comments: [] },
  { id: 't-6', title: 'Penjadwalan Kunjungan Balasan (Indonesian Mission to Kampala)', category: 'Bilateral', assignee: 'SADO & Fasilitator', status: 'Pending', dueDate: 'Jan 2027', comments: [] },
];

const INITIAL_GALLERY = [
  {
    id: 'gal-001',
    title: 'Pertemuan Bilateral Inovasi Hijau Indonesia - Uganda',
    type: 'photo',
    mediaUrl: '/event/uganda.png',
    date: '1 Sept 2026',
    location: 'Kantor PT Katama Suryabumi, Jakarta',
    caption: 'Momen penandatanganan dan pembahasan awal kemitraan teknologi konstruksi KSLL, RISHAM, dan agroforestry bambu.',
    author: 'Sekretariat Konsorsium',
    likes: 12,
    comments: [
      { id: 'gc1', author: 'PERPUBI (Ar. Mukoddas)', text: 'Tonggak penting bagi diaspora material bambu Indonesia menuju Afrika!', timestamp: '2026-09-01T12:00:00Z' }
    ]
  }
];

const STAKEHOLDERS = [
  {
    role: 'Lead Indonesian Party & Coordinator',
    org: 'PT KATAMA SURYABUMI',
    representative: 'Drs. M. Kris Suyanto',
    title: 'Direktur Utama',
    country: '🇮🇩 Indonesia',
    address: 'Gedung Sentra Pemuda, Jl. Pemuda Kav. 61 No. 38, Rawamangun, Jakarta Timur',
    scope: 'Pemegang Lisensi KSLL, Koordinator Mitra Teknologi Indonesia, Rekayasa Struktur & Manufaktur',
    badgeColor: '#1c7ed6'
  },
  {
    role: 'Enabling Agency Partner',
    org: 'SMART AFRICAN VILLAGE DEVELOPMENT CONSORTIUM (SADO)',
    representative: 'Dr. Nelson Tenywa Muzira',
    title: 'Country Director',
    regNo: '80034021034253',
    country: '🇺🇬 Uganda',
    address: 'Plot 1191, Masembe Rd, Kamomboga, Kampala, Uganda',
    scope: 'Fasilitasi Hubungan Pemerintah Uganda, Koordinasi Pemangku Kepentingan, Peluang IsDB/Funding',
    badgeColor: '#f59f00'
  },
  {
    role: 'Construction & Execution Partner',
    org: 'KANGKER CONSTRUCTION INTERNATIONAL LTD',
    representative: 'Mr. Samuel Humphry Kennedy',
    title: 'Executive Director',
    regNo: '80045062387527',
    country: '🇺🇬 Uganda',
    address: 'Plot 1191, Masembe Rd, Kamomboga, Kampala, Uganda',
    scope: 'Pelaksana Konstruksi Lapangan, Manajemen Tenaga Kerja Lokal, Logistik & Fabrikasi Uganda',
    badgeColor: '#e03131'
  },
  {
    role: 'Strategic Bamboo & Agroforestry Partner',
    org: 'PERPUBI (Perkumpulan Pelaku Usaha Bambu Indonesia)',
    representative: 'Ar. Mukoddas Syuhada, S.T., M.T., IAI., CIM.',
    title: 'Ketua Umum PERPUBI',
    country: '🇮🇩 Indonesia',
    scope: 'Pengembangan Ekosistem Bambu, Konstruksi Berkelanjutan, Supply Chain & Transfer Pengetahuan',
    badgeColor: '#40c057'
  },
  {
    role: 'Modular Technology Partner',
    org: 'PT PANORAMA AGUNG UTAMA',
    representative: 'Ir. Doddy Sudradjat',
    title: 'Direktur',
    country: '🇮🇩 Indonesia',
    scope: 'Pemilik Sah Hak Teknologi RISHAM (Rumah Instan Sehat Aman)',
    badgeColor: '#7950f2'
  },
  {
    role: 'Global Strategic Advisory & Sustainability',
    org: 'TURKODOM CONSULTING',
    representative: 'Cecilia Crista Tumini',
    title: 'Konsultan Turkodom',
    country: '🇮🇩 Indonesia / Global',
    scope: 'Strategic Advisory, Riset ESG & SDGs, Fasilitasi Kemitraan Global & Perdagangan Lintas Negara',
    badgeColor: '#1098ad'
  },
  {
    role: 'Facilitator & Intermediary',
    org: 'INDEPENDENT FACILITATOR',
    representative: 'Jimmy Ricky, ST.',
    title: 'Fasilitator Konsorsium',
    country: '🇮🇩 Indonesia',
    scope: 'Penghubung Kemitraan Strategis, Koordinasi Operasional & Monitoring Kemitraan',
    badgeColor: '#d6336c'
  }
];

const UgandaProjectDashboard = () => {
  const { language } = useLanguage();
  const langKey = (language === 'en' || language === 'ja') ? language : 'id';
  const L = TRANSLATIONS[langKey];

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Role Access Control (Whitelist)
  const allowedUsernames = [
    'admin_yayasan', 'admin', 'mukoddas', 'katama', 'sado', 
    'kangker', 'perpubi', 'doddy', 'turkodom', 'jimmy', 'kris_suyanto'
  ];
  
  const isAuthorized = isAuthenticated && (
    allowedUsernames.includes(user?.username?.toLowerCase()) ||
    allowedUsernames.some(name => user?.email?.toLowerCase().includes(name)) ||
    user?.consortiumRole === 'uganda_partner' ||
    user?.role === 'admin' ||
    user?.kycStatus === 'verified'
  );

  const [activeTab, setActiveTab] = useState('roadmap');
  const [searchDocQuery, setSearchDocQuery] = useState('');

  // Firestore Queries
  const { data: dynamicDocs = [] } = useUgandaProjectDocuments();
  const { data: dynamicTasks = [] } = useUgandaProjectTasks();
  const { data: dynamicGallery = [] } = useUgandaProjectGallery();

  // Local state for active items to support immediate comment updates
  const [localDocs, setLocalDocs] = useState(INITIAL_DOCUMENTS);
  const [localTasks, setLocalTasks] = useState(INITIAL_TASKS);
  const [localGallery, setLocalGallery] = useState(INITIAL_GALLERY);

  useEffect(() => {
    if (dynamicDocs.length > 0) {
      setLocalDocs([...INITIAL_DOCUMENTS, ...dynamicDocs]);
    }
  }, [dynamicDocs]);

  useEffect(() => {
    if (dynamicTasks.length > 0) {
      setLocalTasks(dynamicTasks);
    }
  }, [dynamicTasks]);

  useEffect(() => {
    if (dynamicGallery.length > 0) {
      setLocalGallery([...INITIAL_GALLERY, ...dynamicGallery]);
    }
  }, [dynamicGallery]);

  // Comment Thread Drawer / Active Item State
  const [activeCommentTarget, setActiveCommentTarget] = useState(null); // { type: 'doc'|'task'|'gallery'|'step', id: string, item: object }
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Modals
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docForm, setDocForm] = useState({
    title: '',
    type: 'Legal Agreement',
    parties: 'PT Katama Suryabumi, SADO, Kangker',
    clauses: '',
    file: null,
    fileName: ''
  });

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    category: 'Engineering',
    assignee: 'PT Katama Suryabumi',
    status: 'In Progress',
    dueDate: 'Nov 2026'
  });

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaForm, setMediaForm] = useState({
    title: '',
    type: 'photo',
    caption: '',
    location: 'Jakarta / Kampala',
    file: null,
    mediaUrl: ''
  });

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: COMMENTS & INTERACTIONS
  // ─────────────────────────────────────────────────────────────
  const handleOpenComment = (type, item) => {
    setActiveCommentTarget({ type, id: item.id || `step-${item.step}`, item });
    setNewCommentText('');
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentTarget) return;

    setIsSubmittingComment(true);
    const newComment = {
      id: 'c_' + Date.now(),
      author: user?.name || user?.username || 'Konsorsium Member',
      username: user?.username || 'user',
      avatarUrl: user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`,
      role: user?.username === 'admin_yayasan' ? 'Admin' : (user?.consortiumRole || 'Stakeholder'),
      text: newCommentText.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      if (activeCommentTarget.type === 'doc') {
        const updated = localDocs.map(d => {
          if (d.id === activeCommentTarget.id) {
            const comments = [...(d.comments || []), newComment];
            return { ...d, comments };
          }
          return d;
        });
        setLocalDocs(updated);

        // If it's a dynamic Firestore doc, update in DB
        if (!activeCommentTarget.item.isStatic && activeCommentTarget.item.id) {
          const docRef = doc(db, "uganda_project_documents", activeCommentTarget.item.id);
          await updateDoc(docRef, { comments: arrayUnion(newComment) });
        }
      } else if (activeCommentTarget.type === 'task') {
        const updated = localTasks.map(t => {
          if (t.id === activeCommentTarget.id) {
            const comments = [...(t.comments || []), newComment];
            return { ...t, comments };
          }
          return t;
        });
        setLocalTasks(updated);

        if (activeCommentTarget.item.id) {
          const taskRef = doc(db, "uganda_project_tasks", activeCommentTarget.item.id);
          await updateDoc(taskRef, { comments: arrayUnion(newComment) });
        }
      } else if (activeCommentTarget.type === 'gallery') {
        const updated = localGallery.map(g => {
          if (g.id === activeCommentTarget.id) {
            const comments = [...(g.comments || []), newComment];
            return { ...g, comments };
          }
          return g;
        });
        setLocalGallery(updated);

        if (!activeCommentTarget.item.isStatic && activeCommentTarget.item.id) {
          const galRef = doc(db, "uganda_project_gallery", activeCommentTarget.item.id);
          await updateDoc(galRef, { comments: arrayUnion(newComment) });
        }
      }

      setNewCommentText('');
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'Done' ? 'Pending' : currentStatus === 'Pending' ? 'In Progress' : 'Done';
    const updated = localTasks.map(t => t.id === taskId ? { ...t, status: nextStatus } : t);
    setLocalTasks(updated);

    try {
      const taskRef = doc(db, "uganda_project_tasks", taskId);
      await updateDoc(taskRef, { status: nextStatus });
    } catch (err) {
      console.log("Updated locally");
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: UPLOAD MODALS
  // ─────────────────────────────────────────────────────────────
  const uploadToCloudinary = async (dataUrl) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) throw new Error("Konfigurasi Cloudinary tidak ditemukan.");

    const formData = new FormData();
    formData.append('file', dataUrl);
    formData.append('upload_preset', uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Gagal mengunggah ke Cloudinary");
    return data.secure_url;
  };

  const handleSaveDocument = async (e) => {
    e.preventDefault();
    if (!docForm.title) return alert("Harap isi judul dokumen.");
    
    setIsUploadingDoc(true);
    try {
      let fileUrl = '#';
      if (docForm.file) {
        fileUrl = await uploadToCloudinary(docForm.file);
      }

      const newDoc = {
        title: docForm.title,
        type: docForm.type,
        parties: docForm.parties,
        clauses: docForm.clauses,
        fileUrl: fileUrl,
        date: new Date().toLocaleDateString(langKey === 'en' ? 'en-US' : langKey === 'ja' ? 'ja-JP' : 'id-ID', { month: 'short', year: 'numeric' }),
        status: 'Uploaded',
        uploadedBy: user?.name || user?.username || 'Konsorsium',
        comments: [],
        timestamp: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "uganda_project_documents"), newDoc);
      setLocalDocs([{ id: docRef.id, ...newDoc }, ...localDocs]);
      alert("✅ Berhasil mengunggah dokumen ke Legal Vault!");
      setDocForm({ title: '', type: 'Legal Agreement', parties: 'PT Katama Suryabumi, SADO, Kangker', clauses: '', file: null, fileName: '' });
      setIsDocModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah dokumen: " + err.message);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title) return alert("Harap isi nama tugas.");
    try {
      const newTask = {
        ...taskForm,
        comments: [],
        createdAt: serverTimestamp(),
        createdBy: user?.name || user?.username
      };
      const ref = await addDoc(collection(db, "uganda_project_tasks"), newTask);
      setLocalTasks([{ id: ref.id, ...newTask }, ...localTasks]);
      alert("✅ Tugas baru berhasil ditambahkan!");
      setTaskForm({ title: '', category: 'Engineering', assignee: 'PT Katama Suryabumi', status: 'In Progress', dueDate: 'Nov 2026' });
      setIsTaskModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan tugas: " + err.message);
    }
  };

  const handleSaveMedia = async (e) => {
    e.preventDefault();
    if (!mediaForm.title) return alert("Harap isi judul dokumentasi.");

    setIsUploadingMedia(true);
    try {
      let finalMediaUrl = mediaForm.mediaUrl;
      if (mediaForm.file) {
        finalMediaUrl = await uploadToCloudinary(mediaForm.file);
      }

      const newMedia = {
        title: mediaForm.title,
        type: mediaForm.type,
        mediaUrl: finalMediaUrl,
        caption: mediaForm.caption,
        location: mediaForm.location,
        date: new Date().toLocaleDateString(langKey === 'en' ? 'en-US' : langKey === 'ja' ? 'ja-JP' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        author: user?.name || user?.username || 'Konsorsium',
        likes: 1,
        comments: [],
        timestamp: serverTimestamp()
      };

      const ref = await addDoc(collection(db, "uganda_project_gallery"), newMedia);
      setLocalGallery([{ id: ref.id, ...newMedia }, ...localGallery]);
      alert("✅ Foto/Video dokumentasi berhasil disimpan!");
      setMediaForm({ title: '', type: 'photo', caption: '', location: 'Jakarta / Kampala', file: null, mediaUrl: '' });
      setIsMediaModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah media: " + err.message);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // RESTRICTED ACCESS SCREEN
  // ─────────────────────────────────────────────────────────────
  if (!isAuthenticated || !isAuthorized) {
    return (
      <div style={{ paddingTop: '160px', minHeight: '90vh', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '40px', maxWidth: '580px', width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
          <div style={{ width: '70px', height: '70px', background: 'rgba(224, 49, 49, 0.1)', color: '#e03131', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '12px', fontWeight: '800' }}>
            {L.restrictedTitle}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
            {L.restrictedDesc}
          </p>
          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
            <strong>{L.authorizedListTitle}</strong>
            <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
              <li>Administrator BaMbooChain / Yayasan</li>
              <li>PT Katama Suryabumi (Drs. M. Kris Suyanto)</li>
              <li>SADO Uganda (Dr. Nelson Tenywa Muzira)</li>
              <li>Kangker Construction International Ltd (Mr. Samuel Humphry Kennedy)</li>
              <li>PERPUBI, PT Panorama Agung Utama, Turkodom Consulting</li>
            </ul>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/" className="btn" style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--bg-secondary)', color: 'var(--text-main)', textDecoration: 'none', fontWeight: '600' }}>
              {L.btnBackHome}
            </Link>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold' }}>
              {L.btnRequestAccess}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // MAIN DASHBOARD SCREEN
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{ paddingTop: '140px', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <div className="container" style={{ padding: '20px 24px 60px 24px' }}>
        
        {/* Top Breadcrumb & Quick Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <BackButton />
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '20px', fontWeight: '700', border: '1px solid rgba(12, 166, 120, 0.2)' }}>
              {L.confidentialBadge}
            </span>
            <Link 
              to="/bamboochain/meeting?room=uganda-consortium-coordination"
              style={{ background: '#1c7ed6', color: 'white', padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
            >
              <Video size={16} /> {L.virtualRoomBtn}
            </Link>
          </div>
        </div>

        {/* Hero Banner / Header */}
        <div style={{ background: 'linear-gradient(135deg, #092c20 0%, #0d4a34 50%, #082117 100%)', borderRadius: '24px', padding: '36px 32px', color: 'white', marginBottom: '32px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.6rem' }}>🇺🇬 🤝 🇮🇩</span>
              <span style={{ textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.8rem', fontWeight: 'bold', color: '#69db7c' }}>
                {L.subtitleBadge}
              </span>
            </div>
            
            <h1 style={{ fontSize: '2.1rem', fontWeight: '900', margin: '0 0 12px 0', lineHeight: '1.2' }}>
              {L.mainTitle}
            </h1>
            
            <p style={{ fontSize: '0.95rem', color: '#d3f9d8', maxWidth: '850px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              {L.heroDesc}
            </p>

            {/* Trilateral Partner Tags */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                {L.badgeLead}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                {L.badgeEnabling}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                {L.badgeConstruction}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                {L.badgeAgro}
              </span>
            </div>
          </div>
        </div>

        {/* Quick KPI Stat Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>{L.kpiNdaTitle}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#40c057', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={18} /> {L.kpiNdaStatus}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{L.kpiNdaSub}</div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>{L.kpiRoadmapTitle}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={18} /> {L.kpiRoadmapStatus}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{L.kpiRoadmapSub}</div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>{L.kpiVaultTitle}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1c7ed6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={18} /> {localDocs.length} {L.kpiVaultStatus}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{L.kpiVaultSub}</div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>{L.kpiFundingTitle}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f59f00', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🏛️ {L.kpiFundingStatus}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{L.kpiFundingSub}</div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '28px', overflowX: 'auto', paddingBottom: '2px' }}>
          {[
            { key: 'roadmap', label: L.tabRoadmap, icon: <Layers size={17} /> },
            { key: 'vault', label: `${L.tabVault} (${localDocs.length})`, icon: <FileText size={17} /> },
            { key: 'tasks', label: `${L.tabTasks} (${localTasks.length})`, icon: <CheckSquare size={17} /> },
            { key: 'gallery', label: `${L.tabGallery} (${localGallery.length})`, icon: <Calendar size={17} /> },
            { key: 'stakeholders', label: L.tabStakeholders, icon: <Users size={17} /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.key ? 'white' : 'var(--text-muted)',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px 12px 0 0',
                fontWeight: activeTab === tab.key ? '700' : '500',
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: '0.2s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 1: 11-STEP ROADMAP TRACKER                                */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'roadmap' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                {L.roadmapHeading}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                {L.roadmapSub}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              {ROADMAP_STEPS.map((step) => {
                const isCompleted = step.status === 'completed';
                const isInProgress = step.status === 'in-progress';
                const title = step[`title_${langKey}`] || step.title_id;
                const desc = step[`desc_${langKey}`] || step.desc_id;
                const statusLabel = isCompleted ? L.statusCompleted : isInProgress ? L.statusInProgress : L.statusPending;

                return (
                  <div 
                    key={step.step}
                    style={{
                      background: 'var(--bg-card)',
                      border: `1px solid ${isCompleted ? '#40c05750' : isInProgress ? 'var(--primary)' : 'var(--border-color)'}`,
                      borderRadius: '16px',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '20px',
                      boxShadow: isInProgress ? '0 6px 20px rgba(12,166,120,0.1)' : 'none'
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: isCompleted ? '#40c057' : isInProgress ? 'var(--primary)' : 'var(--bg-secondary)',
                      color: isCompleted || isInProgress ? 'white' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '1rem',
                      flexShrink: 0
                    }}>
                      {isCompleted ? <CheckCircle2 size={22} /> : step.step}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                          STEP {step.step}: {title}
                        </h4>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--text-muted)', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                            📅 {step.date}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            background: isCompleted ? '#40c05720' : isInProgress ? 'rgba(12,166,120,0.2)' : 'var(--bg-secondary)',
                            color: isCompleted ? '#40c057' : isInProgress ? 'var(--primary)' : 'var(--text-muted)'
                          }}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                        {desc}
                      </p>

                      <button 
                        onClick={() => handleOpenComment('step', step)}
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <MessageSquare size={13} color="var(--primary)" /> {L.btnStepNotes}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 2: LEGAL VAULT & DOKUMEN                                  */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'vault' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <Search size={16} color="#adb5bd" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  placeholder={L.searchDocPlaceholder}
                  value={searchDocQuery}
                  onChange={(e) => setSearchDocQuery(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>

              <button 
                onClick={() => setIsDocModalOpen(true)}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(12,166,120,0.2)' }}
              >
                <UploadCloud size={17} /> {L.btnUploadDoc}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {localDocs.filter(d => d.title.toLowerCase().includes(searchDocQuery.toLowerCase()) || d.clauses?.toLowerCase().includes(searchDocQuery.toLowerCase())).map((doc) => (
                <div 
                  key={doc.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold' }}>
                        {doc.type}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#40c057', background: '#40c05715', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold' }}>
                        {doc.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                      {doc.title}
                    </h4>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                      <strong>{L.labelParties}:</strong> {doc.parties}
                    </p>

                    <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px', border: '1px solid var(--border-color)' }}>
                      <strong>{L.labelClauses}:</strong> {doc.clauses}
                    </div>
                  </div>

                  <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        📅 {doc.date}
                      </span>
                      {doc.fileUrl && doc.fileUrl !== '#' ? (
                        <a 
                          href={doc.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                        >
                          <Download size={15} /> {L.btnDownloadDoc}
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          {L.internalDraft}
                        </span>
                      )}
                    </div>

                    {/* Interactive Discussion Button */}
                    <button 
                      onClick={() => handleOpenComment('doc', doc)}
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.82rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <MessageSquare size={14} color="var(--primary)" /> 
                      {L.btnDiscussDoc} ({doc.comments?.length || 0})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 3: MANAJEMEN PROYEK & TUGAS                               */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'tasks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                  {L.tasksHeading}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  {L.tasksSub}
                </p>
              </div>

              <button 
                onClick={() => setIsTaskModalOpen(true)}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> {L.btnAddTask}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {localTasks.map((t, idx) => (
                <div 
                  key={t.id || idx}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--text-muted)', padding: '3px 10px', borderRadius: '8px', fontWeight: 'bold' }}>
                        {t.category}
                      </span>
                      
                      {/* Clickable interactive status toggle */}
                      <button
                        onClick={() => handleToggleTaskStatus(t.id, t.status)}
                        title="Klik untuk mengubah status"
                        style={{
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          border: 'none',
                          cursor: 'pointer',
                          background: t.status === 'Done' ? '#40c05720' : t.status === 'In Progress' ? 'rgba(12,166,120,0.15)' : '#f59f0015',
                          color: t.status === 'Done' ? '#40c057' : t.status === 'In Progress' ? 'var(--primary)' : '#f59f00'
                        }}
                      >
                        {t.status === 'Done' ? '✅ ' + L.statusDone : t.status === 'In Progress' ? '⏳ ' + L.statusInProgress : '⏱️ ' + L.statusPending}
                      </button>
                    </div>

                    <h4 style={{ fontSize: '0.98rem', color: 'var(--text-main)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                      {t.title}
                    </h4>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                      <div>👤 <strong>{L.labelPic}:</strong> {t.assignee}</div>
                      <div>⏰ <strong>{L.labelTarget}:</strong> {t.dueDate}</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleOpenComment('task', t)}
                    style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <MessageSquare size={13} color="var(--primary)" /> 
                    {L.btnDiscussDoc} ({t.comments?.length || 0})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 4: DOKUMENTASI & GALERI (FOTO / VIDEO)                    */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'gallery' && (
          <div>
            {/* Itinerary Summary Table */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} color="var(--primary)" />
                {L.itineraryHeading}
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 16px', color: 'var(--text-main)' }}>{L.colDate}</th>
                      <th style={{ padding: '12px 16px', color: 'var(--text-main)' }}>{L.colAgenda}</th>
                      <th style={{ padding: '12px 16px', color: 'var(--text-main)' }}>{L.colFocus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>31 Aug 2026</td>
                      <td style={{ padding: '12px 16px' }}>Delegasi Uganda tiba di Indonesia dan menginap di Jakarta.</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Official Arrival</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>1 Sept 2026</td>
                      <td style={{ padding: '12px 16px' }}>Kunjungan ke kantor PT Katama Suryabumi, Rawamangun Jakarta.</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>NDA & KSLL Scope</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>2 Sept 2026</td>
                      <td style={{ padding: '12px 16px' }}>Pertemuan di Wisma Bumiputera, Bandung.</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Partnership Roadmap</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>3 Sept 2026</td>
                      <td style={{ padding: '12px 16px' }}>Kunjungan ITB Jatinangor & Cimekar (Prototipe BlockBamboo & RISHAM) serta Puskim Cileunyi.</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Housing & Technology Transfer</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>4–5 Sept 2026</td>
                      <td style={{ padding: '12px 16px' }}>Kunjungan Tangerang Selatan (Puspiptek, Pemkot Tangsel).</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>KSLL Structural Implementation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gallery Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                  {L.galleryHeading}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  {L.gallerySub}
                </p>
              </div>

              <button 
                onClick={() => setIsMediaModalOpen(true)}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <UploadCloud size={16} /> {L.btnUploadMedia}
              </button>
            </div>

            {/* Gallery Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {localGallery.map((media) => (
                <div 
                  key={media.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                  }}
                >
                  <div>
                    {media.type === 'video' ? (
                      <div style={{ width: '100%', height: '200px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {media.mediaUrl.includes('youtube.com') || media.mediaUrl.includes('youtu.be') ? (
                          <iframe 
                            src={media.mediaUrl.replace('watch?v=', 'embed/')} 
                            title={media.title}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                          />
                        ) : (
                          <video src={media.mediaUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                    ) : (
                      <img src={media.mediaUrl} alt={media.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    )}

                    <div style={{ padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.72rem', background: 'var(--bg-secondary)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                          📍 {media.location || 'Indonesia'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          📅 {media.date}
                        </span>
                      </div>

                      <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                        {media.title}
                      </h4>

                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        {media.caption}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Oleh: <strong>{media.author}</strong>
                    </span>

                    <button 
                      onClick={() => handleOpenComment('gallery', media)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <MessageSquare size={14} /> {media.comments?.length || 0} Tanggapan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 5: DIREKTORI STAKEHOLDERS                                 */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'stakeholders' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                {L.stakeholdersHeading}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                {L.stakeholdersSub}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {STAKEHOLDERS.map((s, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: s.badgeColor, background: `${s.badgeColor}15`, padding: '4px 10px', borderRadius: '8px' }}>
                        {s.role}
                      </span>
                      <span style={{ fontSize: '0.85rem' }}>{s.country}</span>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: '0 0 8px 0', fontWeight: '800' }}>
                      {s.org}
                    </h4>

                    <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '10px', marginBottom: '14px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{s.representative}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.title}</div>
                      {s.regNo && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Reg No: {s.regNo}</div>}
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                      <strong>{L.labelMandate}:</strong> {s.scope}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* INTERACTIVE COMMENT & DISCUSSION DRAWER / MODAL               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeCommentTarget && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10005, padding: '20px' }} onClick={() => setActiveCommentTarget(null)}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={18} color="var(--primary)" /> {L.commentSectionTitle}
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {activeCommentTarget.item.title || `STEP ${activeCommentTarget.item.step}: ${activeCommentTarget.item[`title_${langKey}`] || activeCommentTarget.item.title_id}`}
                </span>
              </div>
              <button onClick={() => setActiveCommentTarget(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            {/* Comments Stream */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(!activeCommentTarget.item.comments || activeCommentTarget.item.comments.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  💬 {L.noCommentsYet}
                </div>
              ) : (
                activeCommentTarget.item.comments.map((c, i) => (
                  <div key={c.id || i} style={{ background: 'var(--bg-secondary)', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.88rem', color: 'var(--text-main)' }}>{c.author}</span>
                        {c.role && (
                          <span style={{ fontSize: '0.7rem', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '6px', fontWeight: 'bold' }}>
                            {c.role}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                      {c.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handlePostComment} style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', background: 'var(--bg-card)' }}>
              <input 
                type="text" 
                value={newCommentText} 
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={L.commentPlaceholder}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
                required
              />
              <button 
                type="submit" 
                disabled={isSubmittingComment}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={16} /> {L.btnSendComment}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: UNGGAH DOKUMEN                                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isDocModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '20px', width: '100%', maxWidth: '550px', padding: '28px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>{L.modalUploadDocTitle}</h3>
              <button onClick={() => setIsDocModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveDocument} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>{L.labelTitle}</label>
                <input 
                  type="text" 
                  value={docForm.title} 
                  onChange={(e) => setDocForm({...docForm, title: e.target.value})}
                  placeholder="Contoh: Addendum Interim Agreement No. 01"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>{L.labelType}</label>
                  <select 
                    value={docForm.type} 
                    onChange={(e) => setDocForm({...docForm, type: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  >
                    <option value="Legal Agreement">Legal Agreement</option>
                    <option value="Technical License">Technical License</option>
                    <option value="Project Addendum">Project Addendum</option>
                    <option value="CAD Drawing & Spec">CAD Drawing & Spec</option>
                    <option value="Financial & Fee Schedule">Financial & Fee Schedule</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>{L.labelParties}</label>
                  <input 
                    type="text" 
                    value={docForm.parties} 
                    onChange={(e) => setDocForm({...docForm, parties: e.target.value})}
                    placeholder="Katama / SADO / Kangker"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>{L.labelClauses}</label>
                <textarea 
                  value={docForm.clauses} 
                  onChange={(e) => setDocForm({...docForm, clauses: e.target.value})}
                  placeholder="Keterangan singkat substansi dokumen..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.85rem', minHeight: '70px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>{L.labelUploadFile}</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.zip,.dwg"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setDocForm({ ...docForm, file: reader.result, fileName: file.name });
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px dashed var(--border-color)', background: 'var(--bg-secondary)', fontSize: '0.85rem' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isUploadingDoc}
                style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.95rem', cursor: isUploadingDoc ? 'not-allowed' : 'pointer', marginTop: '10px' }}
              >
                {isUploadingDoc ? L.btnProcessing : L.btnSubmit}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: UNGGAH DOKUMENTASI (FOTO / VIDEO)                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isMediaModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '20px', width: '100%', maxWidth: '550px', padding: '28px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>{L.modalUploadMediaTitle}</h3>
              <button onClick={() => setIsMediaModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveMedia} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>{L.labelTitle}</label>
                <input 
                  type="text" 
                  value={mediaForm.title} 
                  onChange={(e) => setMediaForm({...mediaForm, title: e.target.value})}
                  placeholder="Contoh: Kunjungan Delegasi ke Pabrik RISHAM"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>{L.labelType}</label>
                  <select 
                    value={mediaForm.type} 
                    onChange={(e) => setMediaForm({...mediaForm, type: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  >
                    <option value="photo">Foto Dokumentasi</option>
                    <option value="video">Video Dokumentasi</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>Lokasi Kegiatan</label>
                  <input 
                    type="text" 
                    value={mediaForm.location} 
                    onChange={(e) => setMediaForm({...mediaForm, location: e.target.value})}
                    placeholder="Jakarta / Bandung / Kampala"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>Deskripsi / Keterangan</label>
                <textarea 
                  value={mediaForm.caption} 
                  onChange={(e) => setMediaForm({...mediaForm, caption: e.target.value})}
                  placeholder="Catatan kegiatan kunjungan atau notulensi singkat..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.85rem', minHeight: '70px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>{L.labelUploadImage}</label>
                <input 
                  type="file" 
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setMediaForm({ ...mediaForm, file: reader.result });
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px dashed var(--border-color)', background: 'var(--bg-secondary)', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>{L.labelMediaUrl}</label>
                <input 
                  type="url" 
                  value={mediaForm.mediaUrl} 
                  onChange={(e) => setMediaForm({...mediaForm, mediaUrl: e.target.value})}
                  placeholder="https://youtube.com/watch?v=xxx (Jika link video)"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isUploadingMedia}
                style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.95rem', cursor: isUploadingMedia ? 'not-allowed' : 'pointer', marginTop: '10px' }}
              >
                {isUploadingMedia ? L.btnProcessing : L.btnSubmit}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: TAMBAH TUGAS                                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isTaskModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '28px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>{L.modalAddTaskTitle}</h3>
              <button onClick={() => setIsTaskModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>Nama Tugas</label>
                <input 
                  type="text" 
                  value={taskForm.title} 
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder="Contoh: Soil Investigation di Kampala"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>Kategori</label>
                  <select 
                    value={taskForm.category} 
                    onChange={(e) => setTaskForm({...taskForm, category: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  >
                    <option value="Legal">Legal & MoU</option>
                    <option value="Engineering">Engineering & KSLL</option>
                    <option value="R&D">R&D & BlockBamboo</option>
                    <option value="Bilateral">Bilateral & Government</option>
                    <option value="Financing">Financing & IsDB</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>{L.labelPic}</label>
                  <input 
                    type="text" 
                    value={taskForm.assignee} 
                    onChange={(e) => setTaskForm({...taskForm, assignee: e.target.value})}
                    placeholder="PT Katama / SADO / Kangker"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>Status</label>
                  <select 
                    value={taskForm.status} 
                    onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>{L.labelTarget}</label>
                  <input 
                    type="text" 
                    value={taskForm.dueDate} 
                    onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                    placeholder="Contoh: Des 2026"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', marginTop: '10px' }}
              >
                {L.btnSubmit}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UgandaProjectDashboard;
