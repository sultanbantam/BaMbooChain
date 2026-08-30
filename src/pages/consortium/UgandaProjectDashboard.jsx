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
  collection, addDoc, updateDoc, setDoc, doc, deleteDoc, 
  serverTimestamp, arrayUnion, onSnapshot, query, orderBy 
} from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────
// MULTILINGUAL DICTIONARY (ID, EN, JA) - 100% UNIFIED
// ─────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  id: {
    confidentialBadge: "🔒 Portal Konsorsium Rahasia",
    virtualRoomBtn: "Ruang Rapat Virtual",
    subtitleBadge: "KEMITRAAN STRATEGIS INDONESIA – UGANDA",
    mainTitle: "Dashboard Konsorsium Infrastruktur & Bambu",
    heroDesc: "Pusat koordinasi resmi antara PT Katama Suryabumi, SADO Uganda, Kangker Construction Ltd, dan PERPUBI dalam memfasilitasi transfer teknologi konstruksi KSLL, hunian modular berkelanjutan RISHAM & BlockBamboo, serta pengembangan ekosistem agroforestri di Afrika.",
    badgeLead: "🏢 Koordinator Utama: PT Katama Suryabumi",
    badgeEnabling: "🏛️ Badan Fasilitator: SADO Uganda",
    badgeConstruction: "🏗️ Pelaksana Konstruksi: Kangker Construction Ltd",
    badgeAgro: "🎋 Agro & Bambu: PERPUBI",
    
    // KPIs
    kpiNdaTitle: "Status Legalitas NDA",
    kpiNdaStatus: "Aktif & Mengikat",
    kpiNdaSub: "Masa Berlaku: 5 Tahun (Pasal 16)",
    kpiRoadmapTitle: "Roadmap Kemitraan",
    kpiRoadmapStatus: "11 Tahapan Dimulai",
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

    // Statuses
    btnStatusInProgress: "Sedang Berjalan",
    btnStatusPending: "Menunggu Tahap",
    btnStatusCompleted: "Selesai",
    statusJustStarted: "Baru Dimulai",

    // Roadmap Tab
    roadmapHeading: "Roadmap & Tahapan Eksekusi Kerja Sama (Pasal 26 & Lampiran)",
    roadmapSub: "Pilih status untuk setiap tahapan sesuai pembaruan data terkini konsorsium.",
    btnStepNotes: "Catatan Progres",

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
    tasksSub: "Kelola status dan penugasan PIC lintas instansi (Katama, SADO, Kangker, PERPUBI, Turkodom).",
    btnAddTask: "Tambah Tugas Baru",
    labelPic: "PIC Penanggung Jawab",
    labelTarget: "Target Selesai",

    // Gallery Tab
    itineraryHeading: "Itinerary Kunjungan Delegasi Uganda ke Indonesia (31 Ags – 5 Sept 2026)",
    colDate: "Tanggal",
    colAgenda: "Lokasi & Agenda Kunjungan",
    colFocus: "Fokus Utama",
    galleryHeading: "Dokumentasi Foto & Video Kegiatan Konsorsium",
    gallerySub: "Arsip dokumentasi resmi kunjungan lapangan, penandatanganan MoU, dan riset teknologi.",
    btnUploadMedia: "Unggah Foto / Video Dokumentasi",
    btnResponses: "Tanggapan",

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
    subtitleBadge: "INDONESIA – UGANDA STRATEGIC PARTNERSHIP",
    mainTitle: "Uganda Infrastructure & Bamboo Consortium Dashboard",
    heroDesc: "Official command center coordinating PT Katama Suryabumi, SADO Uganda, Kangker Construction Ltd, and PERPUBI in facilitating KSLL construction technology transfer, RISHAM & BlockBamboo sustainable modular housing, and agroforestry ecosystem development in Africa.",
    badgeLead: "🏢 Lead Coordinator: PT Katama Suryabumi",
    badgeEnabling: "🏛️ Enabling Agency: SADO Uganda",
    badgeConstruction: "🏗️ Construction Partner: Kangker Construction Ltd",
    badgeAgro: "🎋 Agro & Bamboo: PERPUBI",

    // KPIs
    kpiNdaTitle: "NDA Legal Status",
    kpiNdaStatus: "Active & Binding",
    kpiNdaSub: "Validity: 5 Years (Clause 16)",
    kpiRoadmapTitle: "Partnership Roadmap",
    kpiRoadmapStatus: "11 Steps Initiated",
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

    // Statuses
    btnStatusInProgress: "In Progress",
    btnStatusPending: "Pending Stage",
    btnStatusCompleted: "Completed",
    statusJustStarted: "Just Started",

    // Roadmap Tab
    roadmapHeading: "Roadmap & Execution Steps (Clause 26 & Annex)",
    roadmapSub: "Select and update the real-time execution status for each milestone.",
    btnStepNotes: "Progress Notes",

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
    tasksSub: "Manage task statuses and PIC delegations (Katama, SADO, Kangker, PERPUBI, Turkodom).",
    btnAddTask: "Add New Task",
    labelPic: "Assigned PIC",
    labelTarget: "Due Date",

    // Gallery Tab
    itineraryHeading: "Official Itinerary: Uganda Delegation Visit to Indonesia (Aug 31 – Sept 5, 2026)",
    colDate: "Date",
    colAgenda: "Location & Visit Agenda",
    colFocus: "Key Focus Area",
    galleryHeading: "Photo & Video Documentation of Consortium Activities",
    gallerySub: "Official documentation archive of field visits, MoU signings, and technology research.",
    btnUploadMedia: "Upload Photo / Video",
    btnResponses: "Responses",

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
    subtitleBadge: "インドネシア–ウガンダ 戦略的パートナーシップ",
    mainTitle: "ウガンダ インフラ＆竹産業コンソーシアム ダッシュボード",
    heroDesc: "PT Katama Suryabumi、SADO Uganda、Kangker Construction Ltd、およびPERPUBIによる、KSLL建築工法、モジュール式住宅RISHAM＆BlockBamboo、アフリカにおける竹アグロフォレストリーの技術移転と事業推進を統括する公式センターです。",
    badgeLead: "🏢 主幹コーディネーター: PT Katama Suryabumi",
    badgeEnabling: "🏛️ 推進機関: SADO Uganda",
    badgeConstruction: "🏗️ 施工パートナー: Kangker Construction Ltd",
    badgeAgro: "🎋 竹・アグロフォレストリー: PERPUBI",

    // KPIs
    kpiNdaTitle: "秘密保持契約 (NDA)",
    kpiNdaStatus: "締結済・有効",
    kpiNdaSub: "有効期間: 5年間（第16条）",
    kpiRoadmapTitle: "ロードマップ進行度",
    kpiRoadmapStatus: "11段階始動",
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

    // Statuses
    btnStatusInProgress: "進行中",
    btnStatusPending: "待機中",
    btnStatusCompleted: "完了",
    statusJustStarted: "開始",

    // Roadmap Tab
    roadmapHeading: "事業ロードマップ＆実行段階（第26条および付属書）",
    roadmapSub: "コンソーシアムの最新進捗に合わせて各ステップのステータスを選択・更新できます。",
    btnStepNotes: "進捗メモ",

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
    tasksSub: "担当機関ごとのタスク進捗（Katama、SADO、Kangker、PERPUBI、Turkodom）を管理します。",
    btnAddTask: "新規タスク追加",
    labelPic: "担当責任者",
    labelTarget: "完了予定日",

    // Gallery Tab
    itineraryHeading: "ウガンダ代表団来日公式日程（2026年8月31日～9月5日）",
    colDate: "日付",
    colAgenda: "訪問先＆公式日程",
    colFocus: "主要アジェンダ",
    galleryHeading: "コンソーシアム活動 写真・映像アーカイブ",
    gallerySub: "現地視察、MoU署名式、技術研究の公式記録資料。",
    btnUploadMedia: "写真 / 動画をアップロード",
    btnResponses: "件の回答",

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
// ROADMAP STEPS DATA (All start in 'in-progress', with 3 toggle buttons)
// ─────────────────────────────────────────────────────────────
const INITIAL_ROADMAP_STEPS = [
  { step: 1, title_id: 'Penandatanganan NDA & Non-Circumvention Agreement', title_en: 'Signing of NDA & Non-Circumvention Agreement', title_ja: 'NDAおよび不正競争防止協定の締結', status: 'in-progress', date_id: 'Sept 2026', date_en: 'Sept 2026', date_ja: '2026年9月', desc_id: 'Penandatanganan Perjanjian Kerahasiaan & Kerangka Kemitraan di Jakarta antara Katama, SADO, Kangker, dan mitra Indonesia.', desc_en: 'Signing of NDA and Strategic Framework in Jakarta between Katama, SADO, Kangker, and Indonesian partners.', desc_ja: 'ジャカルタにてKatama、SADO、Kangker、およびインドネシアパートナー間での秘密保持契約・枠組み合意の調印。', comments: [] },
  { step: 2, title_id: 'Heads of Agreement / Interim Partnership Agreement', title_en: 'Heads of Agreement / Interim Partnership Agreement', title_ja: '基本合意書（HoA）/ 暫定パートナーシップ契約', status: 'in-progress', date_id: 'Okt 2026', date_en: 'Oct 2026', date_ja: '2026年10月', desc_id: 'Penyusunan kesepakatan transisi operasional, jalur komunikasi, focal person, serta pembagian fee fasilitasi.', desc_en: 'Drafting operational transition agreements, communication channels, focal persons, and facilitation fee mechanisms.', desc_ja: '暫定運用協定、連絡窓口、担当者、および推進手数料メカニズムの策定。', comments: [] },
  { step: 3, title_id: 'Main Strategic Partnership Agreement', title_en: 'Main Strategic Partnership Agreement', title_ja: '本戦略的パートナーシップ協定の締結', status: 'in-progress', date_id: 'Des 2026', date_en: 'Dec 2026', date_ja: '2026年12月', desc_id: 'Penyelesaian Main Agreement dalam 90 hari setelah konfirmasi tertulis implementasi proyek.', desc_en: 'Finalizing Main Agreement within 90 days following written confirmation of project advancement.', desc_ja: 'プロジェクト推進の書面確認後90日以内における本協定の締結完了。', comments: [] },
  { step: 4, title_id: 'Government & Bilateral Engagement', title_en: 'Government & Bilateral Engagement', title_ja: '政府間協議・二国間エンゲージメント', status: 'in-progress', date_id: 'Sept - Nov 2026', date_en: 'Sept - Nov 2026', date_ja: '2026年9月〜11月', desc_id: 'Fasilitasi pertemuan tingkat kementerian dan bilateral institusional di Uganda melalui peran SADO.', desc_en: 'Facilitating ministerial and institutional bilateral meetings in Uganda through SADO.', desc_ja: 'SADOを通じたウガンダ政府省庁および関係機関との二国間ハイレベル会談の推進。', comments: [] },
  { step: 5, title_id: 'Uganda Technical & Business Mission', title_en: 'Uganda Technical & Business Mission', title_ja: 'ウガンダ技術・ビジネス公式視察団派遣', status: 'in-progress', date_id: 'Kuartal 1 2027', date_en: 'Q1 2027', date_ja: '2027年第1四半期', desc_id: 'Misi kunjungan tim teknis dan bisnis Indonesia ke Kampala untuk survei lapangan dan lokasi proyek.', desc_en: 'Indonesian technical and business delegation mission to Kampala for field and site surveys.', desc_ja: '現地調査および建設予定地視察のためのインドネシア技術・ビジネス代表団のカンパラ派遣。', comments: [] },
  { step: 6, title_id: 'Pilot Project / Proof of Concept (PoC)', title_en: 'Pilot Project / Proof of Concept (PoC)', title_ja: 'パイロットプロジェクト / 概念実証（PoC）', status: 'in-progress', date_id: 'Kuartal 2 2027', date_en: 'Q2 2027', date_ja: '2027年第2四半期', desc_id: 'Pengiriman mould, komponen, dan sistem teknis KSLL serta prototype Rumah Modular BlockBamboo/RISHAM.', desc_en: 'Dispatching KSLL moulds, components, and technical systems along with BlockBamboo/RISHAM modular housing prototypes.', desc_ja: 'KSLL型枠・部材・技術システムおよびBlockBamboo/RISHAMモジュール住宅試作機の搬送と実証。', comments: [] },
  { step: 7, title_id: 'Technical & Commercial Feasibility', title_en: 'Technical & Commercial Feasibility', title_ja: '技術的・商業的フィージビリティスタディ', status: 'in-progress', date_id: 'Kuartal 2 2027', date_en: 'Q2 2027', date_ja: '2027年第2四半期', desc_id: 'Investigasi tanah setempat, regulasi bangunan Uganda, uji struktur, dan kelayakan finansial.', desc_en: 'Local geotechnical soil investigation, Uganda building codes, structural testing, and financial feasibility.', desc_ja: 'ウガンダ現地の土質調査、建築基準適合性、構造試験、および財務採算性分析。', comments: [] },
  { step: 8, title_id: 'Development Financing & IsDB Engagement', title_en: 'Development Financing & IsDB Engagement', title_ja: '開発金融・イスラム開発銀行（IsDB）連携', status: 'in-progress', date_id: 'Kuartal 3 2027', date_en: 'Q3 2027', date_ja: '2027年第3四半期', desc_id: 'Eksplorasi pendanaan pembangunan dari Islamic Development Bank (IsDB), multilateral banks, dan climate fund.', desc_en: 'Exploring development funding from Islamic Development Bank (IsDB), multilateral institutions, and climate finance.', desc_ja: 'イスラム開発銀行（IsDB）、多国間開発銀行、気候変動ファンドからの開発融資・グラント調達。', comments: [] },
  { step: 9, title_id: 'Technology Transfer & Local Manufacturing', title_en: 'Technology Transfer & Local Manufacturing', title_ja: '技術移転・現地製造・人材育成', status: 'in-progress', date_id: 'Kuartal 4 2027', date_en: 'Q4 2027', date_ja: '2027年第4四半期', desc_id: 'Pelatihan tenaga kerja lokal Uganda, perakitan lokal, dan standardisasi Quality Control/QA.', desc_en: 'Local workforce training in Uganda, local assembly, and Quality Control/QA standardization.', desc_ja: 'ウガンダ現地技術者の育成・トレーニング、現地製造体制の確立および品質管理標準化。', comments: [] },
  { step: 10, title_id: 'Project-Specific Implementation', title_en: 'Project-Specific Implementation', title_ja: '個別プロジェクトの本格着工・施工', status: 'in-progress', date_id: '2028', date_en: '2028', date_ja: '2028年', desc_id: 'Pelaksanaan konstruksi perumahan, rumah sakit, diagnostic centres, dan fasilitas publik.', desc_en: 'Executing construction for housing, healthcare facilities, diagnostic centers, and civic infrastructure.', desc_ja: '住宅地造成、病院、診断センター、および公共インフラの本格的な建設工事実施。', comments: [] },
  { step: 11, title_id: 'Scale-Up in Uganda & African Markets', title_en: 'Scale-Up in Uganda & African Markets', title_ja: 'ウガンダ国内およびアフリカ全域への展開', status: 'in-progress', date_id: '2028+', date_en: '2028+', date_ja: '2028年以降', desc_id: 'Ekspansi regional ke negara-negara Afrika yang disepakati bersama konsorsium.', desc_en: 'Regional scaling across mutually agreed African markets by the consortium.', desc_ja: 'コンソーシアム合意に基づくウガンダ全土および東アフリカ周辺市場へのスケール拡大。', comments: [] }
];

// ─────────────────────────────────────────────────────────────
// LEGAL VAULT DOCUMENTS (Fully localized)
// ─────────────────────────────────────────────────────────────
const INITIAL_DOCUMENTS = [
  {
    id: 'doc-nda-001',
    title_id: 'Perjanjian Kerahasiaan, Non-Pengungkapan, Non-Circumvention & Kemitraan Strategis (NDA)',
    title_en: 'Non-Disclosure, Non-Circumvention & Strategic Partnership Agreement (NDA)',
    title_ja: '秘密保持・不正競争防止および戦略的パートナーシップ協定書（NDA）',
    type_id: 'Perjanjian Legal',
    type_en: 'Legal Agreement',
    type_ja: '法的合意書',
    parties_id: 'PT Katama Suryabumi, SADO, Kangker Construction',
    parties_en: 'PT Katama Suryabumi, SADO, Kangker Construction',
    parties_ja: 'PT Katama Suryabumi, SADO, Kangker Construction',
    date_id: 'September 2026',
    date_en: 'Sept 2026',
    date_ja: '2026年9月',
    status_id: 'Aktif & Mengikat',
    status_en: 'Active & Binding',
    status_ja: '締結済・有効',
    fileUrl: '/event/uganda.png',
    clauses_id: '26 Pasal (Lisensi KSLL, RISHAM, Non-Circumvention, Pembiayaan IsDB, Fee SADO & Jimmy)',
    clauses_en: '26 Clauses (KSLL License, RISHAM, Non-Circumvention, IsDB Funding, SADO & Jimmy Fee)',
    clauses_ja: '全26条項（KSLLライセンス、RISHAM、不正競争防止、IsDB開発資金、SADO・Jimmy手数料）',
    comments: [
      { id: 'c1', author: 'PT Katama (Drs. M. Kris Suyanto)', text: 'Perjanjian NDA resmi mengikat dan melindungi lisensi KSLL di wilayah Uganda & Afrika.', timestamp: '2026-09-01T10:00:00Z', role: 'Lead Coordinator' },
      { id: 'c2', author: 'SADO Uganda (Dr. Nelson Muzira)', text: 'Received and confirmed. Ministry coordination in Kampala has been initiated.', timestamp: '2026-09-01T14:30:00Z', role: 'Enabling Agency' }
    ]
  },
  {
    id: 'doc-ksll-002',
    title_id: 'Spesifikasi Teknis & Lisensi Penerapan Konstruksi Sarang Laba-Laba (KSLL)',
    title_en: 'KSLL Technical Specifications & Construction License',
    title_ja: 'クモの巣構造（KSLL）建築工法 技術仕様書および施工ライセンス',
    type_id: 'Lisensi Teknis',
    type_en: 'Technical License',
    type_ja: '技術ライセンス',
    parties_id: 'PT Katama Suryabumi',
    parties_en: 'PT Katama Suryabumi',
    parties_ja: 'PT Katama Suryabumi',
    date_id: 'Agustus 2026',
    date_en: 'Aug 2026',
    date_ja: '2026年8月',
    status_id: 'Terverifikasi',
    status_en: 'Verified',
    status_ja: '認証済',
    fileUrl: '#',
    clauses_id: 'Analisis Geoteknik, Investigasi Tanah, Desain Beban Bangunan Tahan Gempa',
    clauses_en: 'Geotechnical Analysis, Soil Investigation, Earthquake-Resistant Load Design',
    clauses_ja: '地盤工学解析、土質調査、耐震荷重構造設計基準',
    comments: [
      { id: 'c3', author: 'Kangker Construction (Mr. Samuel)', text: 'We are preparing our engineering team to review the soil parameters in Kampala.', timestamp: '2026-09-02T09:15:00Z', role: 'Construction Lead' }
    ]
  },
  {
    id: 'doc-risham-003',
    title_id: 'Kerangka Lisensi & Alih Teknologi RISHAM (Rumah Instan Sehat Aman)',
    title_en: 'RISHAM Modular Technology Transfer Framework',
    title_ja: 'モジュール式迅速組立住宅（RISHAM）技術移転およびライセンス枠組み',
    type_id: 'Alih Teknologi',
    type_en: 'Technology Transfer',
    type_ja: '技術移転',
    parties_id: 'PT Panorama Agung Utama & PERPUBI',
    parties_en: 'PT Panorama Agung Utama & PERPUBI',
    parties_ja: 'PT Panorama Agung Utama & PERPUBI',
    date_id: 'Agustus 2026',
    date_en: 'Aug 2026',
    date_ja: '2026年8月',
    status_id: 'Terverifikasi',
    status_en: 'Verified',
    status_ja: '認証済',
    fileUrl: '#',
    clauses_id: 'Desain Modular, Prefabrikasi BlockBamboo, Standar Hunian Berkelanjutan',
    clauses_en: 'Modular Architecture, BlockBamboo Prefabrication, Sustainable Living Standards',
    clauses_ja: 'モジュール設計、BlockBambooプレハブ構造、持続可能な住宅基準',
    comments: []
  },
  {
    id: 'doc-annex-004',
    title_id: 'Annex A & B: Register of Introduced Contacts & African Territories',
    title_en: 'Annex A & B: Register of Introduced Contacts & African Territories',
    title_ja: '付属書A・B：紹介先コンタクト登録簿およびアフリカ対象地域',
    type_id: 'Lampiran / Register',
    type_en: 'Annex / Register',
    type_ja: '付属書 / 登録簿',
    parties_id: 'SADO & PT Katama Suryabumi',
    parties_en: 'SADO & PT Katama Suryabumi',
    parties_ja: 'SADO & PT Katama Suryabumi',
    date_id: 'September 2026',
    date_en: 'Sept 2026',
    date_ja: '2026年9月',
    status_id: 'Aktif & Mengikat',
    status_en: 'Active & Binding',
    status_ja: '有効',
    fileUrl: '#',
    clauses_id: 'Perlindungan Kontak Non-Circumvention 5 Tahun di Uganda dan Pasar Afrika',
    clauses_en: '5-Year Non-Circumvention Protection for Contacts in Uganda and African Markets',
    clauses_ja: 'ウガンダおよびアフリカ市場における5年間の不正迂回取引防止保護規定',
    comments: []
  }
];

// ─────────────────────────────────────────────────────────────
// INITIAL TASKS (All start in 'in-progress' / 'Baru Dimulai')
// ─────────────────────────────────────────────────────────────
const INITIAL_TASKS = [
  { id: 't-1', title_id: 'Finalisasi Penandatanganan NDA Trilateral di Jakarta', title_en: 'Finalizing Trilateral NDA Signing in Jakarta', title_ja: 'ジャカルタにおける3者間秘密保持契約（NDA）の締結完了', category_id: 'Legal', category_en: 'Legal', category_ja: '法務・MoU', assignee_id: 'Katama / SADO / Kangker', assignee_en: 'Katama / SADO / Kangker', assignee_ja: 'Katama / SADO / Kangker', status: 'in-progress', dueDate_id: 'Sept 2026', dueDate_en: 'Sept 2026', dueDate_ja: '2026年9月', comments: [] },
  { id: 't-2', title_id: 'Penyusunan Draft Heads of Agreement (HoA)', title_en: 'Drafting Heads of Agreement (HoA)', title_ja: '基本合意書（HoA）草案の作成', category_id: 'Legal', category_en: 'Legal', category_ja: '法務・MoU', assignee_id: 'Lead Indonesian Party & SADO', assignee_en: 'Lead Indonesian Party & SADO', assignee_ja: 'インドネシア主幹企業 & SADO', status: 'in-progress', dueDate_id: 'Okt 2026', dueDate_en: 'Oct 2026', dueDate_ja: '2026年10月', comments: [] },
  { id: 't-3', title_id: 'Persiapan Dokumen Teknis KSLL untuk Karakteristik Tanah Uganda', title_en: 'Preparing KSLL Technical Specs for Uganda Soil Profile', title_ja: 'ウガンダの土質特性に合わせたKSLL技術仕様書の準備', category_id: 'Engineering', category_en: 'Engineering', category_ja: '技術・KSLL', assignee_id: 'Tim Engineer PT Katama', assignee_en: 'PT Katama Engineering Team', assignee_ja: 'PT Katama エンジニアチーム', status: 'in-progress', dueDate_id: 'Nov 2026', dueDate_en: 'Nov 2026', dueDate_ja: '2026年11月', comments: [] },
  { id: 't-4', title_id: 'Pembuatan Mockup Modular BlockBamboo untuk Display Ekspor', title_en: 'Fabricating Modular BlockBamboo Mockup for Export Showcase', title_ja: '輸出展示用BlockBambooモジュール住宅モックアップの製作', category_id: 'R&D', category_en: 'R&D', category_ja: '研究開発', assignee_id: 'PERPUBI & Panorama Agung', assignee_en: 'PERPUBI & Panorama Agung', assignee_ja: 'PERPUBI & Panorama Agung', status: 'in-progress', dueDate_id: 'Nov 2026', dueDate_en: 'Nov 2026', dueDate_ja: '2026年11月', comments: [] },
  { id: 't-5', title_id: 'Audiensi dengan Perwakilan IsDB & Lembaga Pembiayaan Pembangunan', title_en: 'Institutional Engagement with IsDB & Development Financiers', title_ja: 'イスラム開発銀行（IsDB）および開発金融機関との公式協議', category_id: 'Financing', category_en: 'Financing', category_ja: '資金調達', assignee_id: 'SADO & Turkodom Consulting', assignee_en: 'SADO & Turkodom Consulting', assignee_ja: 'SADO & Turkodom Consulting', status: 'in-progress', dueDate_id: 'Des 2026', dueDate_en: 'Dec 2026', dueDate_ja: '2026年12月', comments: [] },
  { id: 't-6', title_id: 'Penjadwalan Kunjungan Balasan (Indonesian Mission to Kampala)', title_en: 'Scheduling Reciprocal Delegation (Indonesian Mission to Kampala)', title_ja: 'インドネシア公式視察団のカンパラ派遣日程調整', category_id: 'Bilateral', category_en: 'Bilateral', category_ja: '二国間協議', assignee_id: 'SADO & Fasilitator', assignee_en: 'SADO & Facilitator', assignee_ja: 'SADO & 推進役', status: 'in-progress', dueDate_id: 'Jan 2027', dueDate_en: 'Jan 2027', dueDate_ja: '2027年1月', comments: [] },
];

// ─────────────────────────────────────────────────────────────
// ITINERARY ROWS (100% Multilingual)
// ─────────────────────────────────────────────────────────────
const ITINERARY_ROWS = [
  {
    date_id: '31 Ags 2026',
    date_en: 'Aug 31, 2026',
    date_ja: '2026年8月31日',
    agenda_id: 'Delegasi Uganda tiba di Indonesia dan menginap di Jakarta.',
    agenda_en: 'Uganda delegation arrives in Indonesia and checks in at Jakarta hotel.',
    agenda_ja: 'ウガンダ公式代表団がインドネシアに到着、ジャカルタ市内に宿泊。',
    focus_id: 'Penyambutan Resmi',
    focus_en: 'Official Arrival',
    focus_ja: '公式歓迎・オリエンテーション'
  },
  {
    date_id: '1 Sept 2026',
    date_en: 'Sept 1, 2026',
    date_ja: '2026年9月1日',
    agenda_id: 'Kunjungan ke kantor PT Katama Suryabumi untuk pembahasan awal NDA serta ruang lingkup kerja sama.',
    agenda_en: 'Visit to PT Katama Suryabumi head office for preliminary NDA and scope discussions.',
    agenda_ja: 'PT Katama Suryabumi本社を訪問、秘密保持契約（NDA）および協力範囲の初期協議。',
    focus_id: 'Pembahasan NDA & KSLL',
    focus_en: 'NDA & KSLL Scope',
    focus_ja: 'NDA協議・KSLL工法検討'
  },
  {
    date_id: '2 Sept 2026',
    date_en: 'Sept 2, 2026',
    date_ja: '2026年9月2日',
    agenda_id: 'Pertemuan di Wisma Bumiputera, Bandung, untuk pembahasan lanjutan NDA dan substansi rencana kerja sama.',
    agenda_en: 'Meeting at Wisma Bumiputera, Bandung, for detailed NDA follow-up and strategic roadmap drafting.',
    agenda_ja: 'バンドン・Wisma Bumiputeraにて会合、NDA詳細および事業ロードマップ策定の協議。',
    focus_id: 'Roadmap Kemitraan',
    focus_en: 'Partnership Roadmap',
    focus_ja: '事業ロードマップ策定'
  },
  {
    date_id: '3 Sept 2026',
    date_en: 'Sept 3, 2026',
    date_ja: '2026年9月3日',
    agenda_id: 'Kunjungan ke ITB Jatinangor & Cimekar (Prototipe BlockBamboo & RISHAM) serta Puskim Cileunyi.',
    agenda_en: 'Field visit to ITB Jatinangor & Cimekar (BlockBamboo & RISHAM prototypes) and Puskim Cileunyi.',
    agenda_ja: 'ITBジャティナンゴールおよびチメカル視察（BlockBamboo＆RISHAM試作機）とPuskim建築研究所訪問。',
    focus_id: 'Alih Teknologi Hunian',
    focus_en: 'Housing Tech Transfer',
    focus_ja: 'モジュール住宅技術移転'
  },
  {
    date_id: '4–5 Sept 2026',
    date_en: 'Sept 4–5, 2026',
    date_ja: '2026年9月4〜5日',
    agenda_id: 'Kunjungan Tangerang Selatan (Puspiptek, Pemkot Tangsel) untuk melihat implementasi nyata Konstruksi Sarang Laba-Laba (KSLL).',
    agenda_en: 'Visit to South Tangerang (Puspiptek, City Hall) to inspect real-world implementation of KSLL structural foundation.',
    agenda_ja: '南タンゲラン視察（Puspiptek国立科学技術研究センター、市庁舎）にてKSLL基礎構造の実装現場を見学。',
    focus_id: 'Implementasi Nyata KSLL',
    focus_en: 'KSLL Construction Proof',
    focus_ja: 'KSLL基礎構造の実装確認'
  }
];

// Initial gallery
const INITIAL_GALLERY = [
  {
    id: 'gal-001',
    title_id: 'Pertemuan Bilateral Inovasi Hijau Indonesia - Uganda',
    title_en: 'Indonesia – Uganda Green Innovation Bilateral Meeting',
    title_ja: 'インドネシア–ウガンダ グリーンイノベーション二国間会合',
    type: 'photo',
    mediaUrl: '/event/uganda.png',
    date_id: '1 Sept 2026',
    date_en: 'Sept 1, 2026',
    date_ja: '2026年9月1日',
    location_id: 'Kantor PT Katama Suryabumi, Jakarta',
    location_en: 'PT Katama Suryabumi Office, Jakarta',
    location_ja: 'PT Katama Suryabumi 本社（ジャカルタ）',
    caption_id: 'Momen penandatanganan dan pembahasan awal kemitraan teknologi konstruksi KSLL, RISHAM, dan agroforestry bambu.',
    caption_en: 'Signing moment and preliminary discussions on KSLL construction, RISHAM, and bamboo agroforestry technology.',
    caption_ja: 'KSLL建築工法、RISHAM、および竹アグロフォレストリー技術協力に関する調印と初期協議の様子。',
    author: 'Sekretariat Konsorsium',
    likes: 12,
    comments: [
      { id: 'gc1', author: 'PERPUBI (Ar. Mukoddas)', text: 'Tonggak penting bagi diaspora material bambu Indonesia menuju Afrika!', timestamp: '2026-09-01T12:00:00Z' }
    ]
  }
];

// ─────────────────────────────────────────────────────────────
// STAKEHOLDERS (100% Multilingual)
// ─────────────────────────────────────────────────────────────
const STAKEHOLDERS = [
  {
    role_id: 'Koordinator Utama Pihak Indonesia',
    role_en: 'Lead Indonesian Party & Coordinator',
    role_ja: 'インドネシア側 主幹コーディネーター',
    org: 'PT KATAMA SURYABUMI',
    representative: 'Drs. M. Kris Suyanto',
    title_id: 'Direktur Utama',
    title_en: 'President Director',
    title_ja: '代表取締役社長',
    country_id: '🇮🇩 Indonesia',
    country_en: '🇮🇩 Indonesia',
    country_ja: '🇮🇩 インドネシア',
    address_id: 'Gedung Sentra Pemuda, Jl. Pemuda Kav. 61 No. 38, Rawamangun, Jakarta Timur',
    address_en: 'Gedung Sentra Pemuda, Jl. Pemuda Kav. 61 No. 38, Rawamangun, East Jakarta',
    address_ja: '東ジャカルタ ラワマングン プムダ通り61号 セン虎プムダビル',
    scope_id: 'Pemegang Lisensi KSLL, Koordinator Mitra Teknologi Indonesia, Rekayasa Struktur & Manufaktur',
    scope_en: 'Holder of KSLL Patent, Coordinator of Indonesian Technology Partners, Structural Engineering & Manufacturing',
    scope_ja: 'KSLL特許保有企業、インドネシア技術パートナー統括、構造設計・製造',
    badgeColor: '#1c7ed6'
  },
  {
    role_id: 'Badan Fasilitator Kemitraan Afrika',
    role_en: 'Enabling Agency Partner',
    role_ja: 'アフリカ側 推進・政府連携機関',
    org: 'SMART AFRICAN VILLAGE DEVELOPMENT CONSORTIUM (SADO)',
    representative: 'Dr. Nelson Tenywa Muzira',
    title_id: 'Country Director',
    title_en: 'Country Director',
    title_ja: '国代表ディレクター',
    regNo: '80034021034253',
    country_id: '🇺🇬 Uganda',
    country_en: '🇺🇬 Uganda',
    country_ja: '🇺🇬 ウガンダ',
    address_id: 'Plot 1191, Masembe Rd, Kamomboga, Kampala, Uganda',
    address_en: 'Plot 1191, Masembe Rd, Kamomboga, Kampala, Uganda',
    address_ja: 'ウガンダ カンパラ市 カモンボガ マセンベ通り 1191番地',
    scope_id: 'Fasilitasi Hubungan Pemerintah Uganda, Koordinasi Pemangku Kepentingan, Peluang IsDB/Funding',
    scope_en: 'Uganda Government Institutional Facilitation, Stakeholder Engagement, IsDB/Funding Opportunities',
    scope_ja: 'ウガンダ政府機関連携、ステークホルダー調整、IsDB等の資金調達機会の創出',
    badgeColor: '#f59f00'
  },
  {
    role_id: 'Pelaksana Konstruksi & Fabrikasi',
    role_en: 'Construction & Execution Partner',
    role_ja: '施工・現地製造パートナー',
    org: 'KANGKER CONSTRUCTION INTERNATIONAL LTD',
    representative: 'Mr. Samuel Humphry Kennedy',
    title_id: 'Executive Director',
    title_en: 'Executive Director',
    title_ja: '執行役員ディレクター',
    regNo: '80045062387527',
    country_id: '🇺🇬 Uganda',
    country_en: '🇺🇬 Uganda',
    country_ja: '🇺🇬 ウガンダ',
    address_id: 'Plot 1191, Masembe Rd, Kamomboga, Kampala, Uganda',
    address_en: 'Plot 1191, Masembe Rd, Kamomboga, Kampala, Uganda',
    address_ja: 'ウガンダ カンパラ市 カモンボガ マセンベ通り 1191番地',
    scope_id: 'Pelaksana Konstruksi Lapangan, Manajemen Tenaga Kerja Lokal, Logistik & Fabrikasi Uganda',
    scope_en: 'On-site Construction Execution, Local Workforce Management, Uganda Logistics & Local Fabrication',
    scope_ja: '現地施工管理、ウガンダ人労働力の組織化、現地物流・部材加工',
    badgeColor: '#e03131'
  },
  {
    role_id: 'Mitra Strategis Bambu & Agroforestri',
    role_en: 'Strategic Bamboo & Agroforestry Partner',
    role_ja: '竹産業・アグロフォレストリー戦略パートナー',
    org: 'PERPUBI (Perkumpulan Pelaku Usaha Bambu Indonesia)',
    representative: 'Ar. Mukoddas Syuhada, S.T., M.T., IAI., CIM.',
    title_id: 'Ketua Umum PERPUBI',
    title_en: 'Chairman of PERPUBI',
    title_ja: 'PERPUBI会長（建築家）',
    country_id: '🇮🇩 Indonesia',
    country_en: '🇮🇩 Indonesia',
    country_ja: '🇮🇩 インドネシア',
    scope_id: 'Pengembangan Ekosistem Bambu, Konstruksi Berkelanjutan, Supply Chain & Transfer Pengetahuan',
    scope_en: 'Bamboo Ecosystem Development, Sustainable Construction, Supply Chain & Knowledge Transfer',
    scope_ja: '竹エコシステム構築、持続可能建築、サプライチェーン開発、知識移転',
    badgeColor: '#40c057'
  },
  {
    role_id: 'Mitra Teknologi Hunian Modular',
    role_en: 'Modular Technology Partner',
    role_ja: 'モジュール建築技術パートナー',
    org: 'PT PANORAMA AGUNG UTAMA',
    representative: 'Ir. Doddy Sudradjat',
    title_id: 'Direktur',
    title_en: 'Director',
    title_ja: '取締役',
    country_id: '🇮🇩 Indonesia',
    country_en: '🇮🇩 Indonesia',
    country_ja: '🇮🇩 インドネシア',
    scope_id: 'Pemilik Sah Hak Teknologi RISHAM (Rumah Instan Sehat Aman)',
    scope_en: 'Legitimate Rights Holder of RISHAM (Instant Healthy Safe Housing) Technology',
    scope_ja: 'RISHAM（迅速・健全・安全住宅）工法の正規権利保有企業',
    badgeColor: '#7950f2'
  },
  {
    role_id: 'Penasihat Strategis & Keberlanjutan Global',
    role_en: 'Global Strategic Advisory & Sustainability',
    role_ja: 'グローバル戦略顧問・サステナビリティ',
    org: 'TURKODOM CONSULTING',
    representative: 'Cecilia Crista Tumini',
    title_id: 'Konsultan Turkodom',
    title_en: 'Turkodom Consultant',
    title_ja: 'コンサルタント',
    country_id: '🇮🇩 Indonesia / Global',
    country_en: '🇮🇩 Indonesia / Global',
    country_ja: '🇮🇩 インドネシア / グローバル',
    scope_id: 'Strategic Advisory, Riset ESG & SDGs, Fasilitasi Kemitraan Global & Perdagangan Lintas Negara',
    scope_en: 'Strategic Advisory, ESG & SDG Research, Cross-Border Trade & Global Partnerships',
    scope_ja: '戦略的アドバイザリー、ESG・SDGs調査、国境を越えた貿易・国際パートナーシップ支援',
    badgeColor: '#1098ad'
  },
  {
    role_id: 'Fasilitator & Intermediary Konsorsium',
    role_en: 'Facilitator & Intermediary',
    role_ja: 'コンソーシアム推進役・仲介者',
    org: 'INDEPENDENT FACILITATOR',
    representative: 'Jimmy Ricky, ST.',
    title_id: 'Fasilitator Konsorsium',
    title_en: 'Consortium Facilitator',
    title_ja: 'コンソーシアム推進役',
    country_id: '🇮🇩 Indonesia',
    country_en: '🇮🇩 Indonesia',
    country_ja: '🇮🇩 インドネシア',
    scope_id: 'Penghubung Kemitraan Strategis, Koordinasi Operasional & Monitoring Kemitraan',
    scope_en: 'Strategic Partnership Connector, Operational Coordination & Partnership Monitoring',
    scope_ja: '戦略的パートナーシップ連携、運用調整、事業モニタリング',
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
    'kangker', 'perpubi', 'doddy', 'turkodom', 'jimmy', 'kris_suyanto', 'albantani'
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

  // Local state for active items to support immediate comment & status updates
  const [localRoadmap, setLocalRoadmap] = useState(() => {
    const saved = localStorage.getItem('uganda_consortium_roadmap_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ROADMAP_STEPS;
  });

  useEffect(() => {
    localStorage.setItem('uganda_consortium_roadmap_v3', JSON.stringify(localRoadmap));
  }, [localRoadmap]);

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
  const [activeCommentTarget, setActiveCommentTarget] = useState(null);
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
    status: 'in-progress',
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
  // HANDLERS: ROADMAP STATUS TOGGLE (3-BUTTON SELECTOR)
  // ─────────────────────────────────────────────────────────────
  const handleSetRoadmapStatus = async (stepNum, newStatus) => {
    const updated = localRoadmap.map(s => {
      if (s.step === stepNum) {
        return { ...s, status: newStatus };
      }
      return s;
    });
    setLocalRoadmap(updated);

    try {
      const stepRef = doc(db, "uganda_project_steps", `step_${stepNum}`);
      await setDoc(stepRef, { step: stepNum, status: newStatus }, { merge: true });
    } catch (err) {
      console.log("Status updated locally");
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: TASK STATUS TOGGLE (3-BUTTON SELECTOR)
  // ─────────────────────────────────────────────────────────────
  const handleSetTaskStatus = async (taskId, newStatus) => {
    const updated = localTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setLocalTasks(updated);

    try {
      const taskRef = doc(db, "uganda_project_tasks", taskId);
      await updateDoc(taskRef, { status: newStatus });
    } catch (err) {
      console.log("Updated locally");
    }
  };

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
      if (activeCommentTarget.type === 'step') {
        const stepNum = activeCommentTarget.item.step;
        const updated = localRoadmap.map(s => {
          if (s.step === stepNum) {
            const comments = [...(s.comments || []), newComment];
            return { ...s, comments };
          }
          return s;
        });
        setLocalRoadmap(updated);

        try {
          const stepRef = doc(db, "uganda_project_steps", `step_${stepNum}`);
          await setDoc(stepRef, { 
            step: stepNum,
            comments: arrayUnion(newComment)
          }, { merge: true });
        } catch (e) {
          console.log("Step note saved locally");
        }
      } else if (activeCommentTarget.type === 'doc') {
        const updated = localDocs.map(d => {
          if (d.id === activeCommentTarget.id) {
            const comments = [...(d.comments || []), newComment];
            return { ...d, comments };
          }
          return d;
        });
        setLocalDocs(updated);

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

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: CLOUDINARY UPLOADS
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
        title_id: docForm.title,
        title_en: docForm.title,
        title_ja: docForm.title,
        type_id: docForm.type,
        type_en: docForm.type,
        type_ja: docForm.type,
        parties_id: docForm.parties,
        parties_en: docForm.parties,
        parties_ja: docForm.parties,
        clauses_id: docForm.clauses,
        clauses_en: docForm.clauses,
        clauses_ja: docForm.clauses,
        fileUrl: fileUrl,
        date_id: new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        date_en: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        date_ja: new Date().toLocaleDateString('ja-JP', { month: 'short', year: 'numeric' }),
        status_id: 'Terunggah',
        status_en: 'Uploaded',
        status_ja: 'アップロード済',
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
        title_id: taskForm.title,
        title_en: taskForm.title,
        title_ja: taskForm.title,
        category_id: taskForm.category,
        category_en: taskForm.category,
        category_ja: taskForm.category,
        assignee_id: taskForm.assignee,
        assignee_en: taskForm.assignee,
        assignee_ja: taskForm.assignee,
        dueDate_id: taskForm.dueDate,
        dueDate_en: taskForm.dueDate,
        dueDate_ja: taskForm.dueDate,
        status: taskForm.status || 'in-progress',
        comments: [],
        createdAt: serverTimestamp(),
        createdBy: user?.name || user?.username
      };
      const ref = await addDoc(collection(db, "uganda_project_tasks"), newTask);
      setLocalTasks([{ id: ref.id, ...newTask }, ...localTasks]);
      alert("✅ Tugas baru berhasil ditambahkan!");
      setTaskForm({ title: '', category: 'Engineering', assignee: 'PT Katama Suryabumi', status: 'in-progress', dueDate: 'Nov 2026' });
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
        title_id: mediaForm.title,
        title_en: mediaForm.title,
        title_ja: mediaForm.title,
        type: mediaForm.type,
        mediaUrl: finalMediaUrl,
        caption_id: mediaForm.caption,
        caption_en: mediaForm.caption,
        caption_ja: mediaForm.caption,
        location_id: mediaForm.location,
        location_en: mediaForm.location,
        location_ja: mediaForm.location,
        date_id: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        date_en: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        date_ja: new Date().toLocaleDateString('ja-JP', { day: 'numeric', month: 'short', year: 'numeric' }),
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

        {/* ── IMAGE 1 FIX: REFINED HERO BANNER CARD ── */}
        <div style={{ 
          background: 'linear-gradient(135deg, #0b3d2c 0%, #08291e 100%)', 
          borderRadius: '24px', 
          padding: '36px 36px', 
          color: 'white', 
          marginBottom: '32px', 
          position: 'relative', 
          overflow: 'hidden', 
          border: '1px solid rgba(105, 219, 124, 0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)' 
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '20px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.2rem' }}>🇺🇬 🤝 🇮🇩</span>
              <span style={{ textTransform: 'uppercase', letterSpacing: '1.2px', fontSize: '0.78rem', fontWeight: '700', color: '#69db7c' }}>
                {L.subtitleBadge}
              </span>
            </div>
            
            <h1 style={{ fontSize: '2.2rem', fontWeight: '900', margin: '0 0 14px 0', lineHeight: '1.25', letterSpacing: '-0.5px' }}>
              {L.mainTitle}
            </h1>
            
            <p style={{ fontSize: '0.96rem', color: '#d3f9d8', maxWidth: '880px', lineHeight: '1.7', margin: '0 0 24px 0', opacity: 0.95 }}>
              {L.heroDesc}
            </p>

            {/* Trilateral Partner Tags Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)' }}>
                {L.badgeLead}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)' }}>
                {L.badgeEnabling}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)' }}>
                {L.badgeConstruction}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)' }}>
                {L.badgeAgro}
              </div>
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
              <Layers size={18} /> {localRoadmap.filter(s => s.status === 'completed').length} / 11 {L.btnStatusCompleted}
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
        {/* TAB 1: 11-STEP ROADMAP TRACKER (IMAGE 2 FIX: 3 BUTTONS/STEP) */}
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
              {localRoadmap.map((step) => {
                const title = step[`title_${langKey}`] || step.title_id;
                const desc = step[`desc_${langKey}`] || step.desc_id;
                const date = step[`date_${langKey}`] || step.date_id;

                const isCompleted = step.status === 'completed';
                const isInProgress = step.status === 'in-progress';
                const isPending = step.status === 'pending';

                return (
                  <div 
                    key={step.step}
                    style={{
                      background: 'var(--bg-card)',
                      border: `1px solid ${isCompleted ? '#40c05760' : isInProgress ? 'rgba(12,166,120,0.4)' : 'var(--border-color)'}`,
                      borderRadius: '16px',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '20px',
                      boxShadow: isInProgress ? '0 6px 20px rgba(12,166,120,0.06)' : 'none'
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                          STEP {step.step}: {title}
                        </h4>
                        <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--text-muted)', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                          📅 {date}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 14px 0', lineHeight: '1.5' }}>
                        {desc}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                        {/* 3 Interactive Status Buttons as requested in Image 2 */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleSetRoadmapStatus(step.step, 'in-progress')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '8px',
                              fontSize: '0.76rem',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              border: isInProgress ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                              background: isInProgress ? 'rgba(12,166,120,0.2)' : 'var(--bg-secondary)',
                              color: isInProgress ? 'var(--primary)' : 'var(--text-muted)',
                              transition: '0.2s'
                            }}
                          >
                            ⏳ {L.btnStatusInProgress}
                          </button>

                          <button
                            onClick={() => handleSetRoadmapStatus(step.step, 'pending')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '8px',
                              fontSize: '0.76rem',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              border: isPending ? '2px solid #f59f00' : '1px solid var(--border-color)',
                              background: isPending ? 'rgba(245,159,0,0.15)' : 'var(--bg-secondary)',
                              color: isPending ? '#f59f00' : 'var(--text-muted)',
                              transition: '0.2s'
                            }}
                          >
                            ⏱️ {L.btnStatusPending}
                          </button>

                          <button
                            onClick={() => handleSetRoadmapStatus(step.step, 'completed')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '8px',
                              fontSize: '0.76rem',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              border: isCompleted ? '2px solid #40c057' : '1px solid var(--border-color)',
                              background: isCompleted ? 'rgba(64,192,87,0.2)' : 'var(--bg-secondary)',
                              color: isCompleted ? '#40c057' : 'var(--text-muted)',
                              transition: '0.2s'
                            }}
                          >
                            ✅ {L.btnStatusCompleted}
                          </button>
                        </div>

                        <button 
                          onClick={() => handleOpenComment('step', step)}
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <MessageSquare size={13} color="var(--primary)" /> {L.btnStepNotes} ({step.comments?.length || 0})
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 2: LEGAL VAULT (IMAGE 3 FIX: FULL MULTILINGUAL FIELDS)   */}
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
              {localDocs.filter(d => {
                const title = d[`title_${langKey}`] || d.title_id || d.title || '';
                const clauses = d[`clauses_${langKey}`] || d.clauses_id || d.clauses || '';
                return title.toLowerCase().includes(searchDocQuery.toLowerCase()) || clauses.toLowerCase().includes(searchDocQuery.toLowerCase());
              }).map((doc) => {
                const title = doc[`title_${langKey}`] || doc.title_id || doc.title;
                const type = doc[`type_${langKey}`] || doc.type_id || doc.type;
                const parties = doc[`parties_${langKey}`] || doc.parties_id || doc.parties;
                const clauses = doc[`clauses_${langKey}`] || doc.clauses_id || doc.clauses;
                const date = doc[`date_${langKey}`] || doc.date_id || doc.date;
                const status = doc[`status_${langKey}`] || doc.status_id || doc.status;

                return (
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
                          {type}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#40c057', background: '#40c05715', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold' }}>
                          {status}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                        {title}
                      </h4>

                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                        <strong>{L.labelParties}:</strong> {parties}
                      </p>

                      <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px', border: '1px solid var(--border-color)' }}>
                        <strong>{L.labelClauses}:</strong> {clauses}
                      </div>
                    </div>

                    <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          📅 {date}
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
                );
              })}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 3: TASKS (IMAGE 4 FIX: FULL I18N & 3 STATUS BUTTONS)      */}
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
              {localTasks.map((t, idx) => {
                const title = t[`title_${langKey}`] || t.title_id || t.title;
                const category = t[`category_${langKey}`] || t.category_id || t.category;
                const assignee = t[`assignee_${langKey}`] || t.assignee_id || t.assignee;
                const dueDate = t[`dueDate_${langKey}`] || t.dueDate_id || t.dueDate;

                const isInProgress = t.status === 'in-progress' || t.status === 'In Progress';
                const isPending = t.status === 'pending' || t.status === 'Pending';
                const isDone = t.status === 'completed' || t.status === 'Done';

                return (
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
                          {category}
                        </span>
                        
                        <span style={{ fontSize: '0.75rem', color: isDone ? '#40c057' : isInProgress ? 'var(--primary)' : '#f59f00', fontWeight: 'bold' }}>
                          {isDone ? `✅ ${L.btnStatusCompleted}` : isInProgress ? `⏳ ${L.btnStatusInProgress}` : `⏱️ ${L.btnStatusPending}`}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.98rem', color: 'var(--text-main)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                        {title}
                      </h4>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                        <div>👤 <strong>{L.labelPic}:</strong> {assignee}</div>
                        <div>⏰ <strong>{L.labelTarget}:</strong> {dueDate}</div>
                      </div>
                    </div>

                    <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                      {/* 3 Status Switcher Buttons for Tasks */}
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                        <button
                          onClick={() => handleSetTaskStatus(t.id, 'in-progress')}
                          style={{
                            flex: 1,
                            padding: '4px 6px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 'bold',
                            border: isInProgress ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                            background: isInProgress ? 'rgba(12,166,120,0.2)' : 'var(--bg-secondary)',
                            color: isInProgress ? 'var(--primary)' : 'var(--text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          ⏳ {L.btnStatusInProgress}
                        </button>

                        <button
                          onClick={() => handleSetTaskStatus(t.id, 'pending')}
                          style={{
                            flex: 1,
                            padding: '4px 6px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 'bold',
                            border: isPending ? '1px solid #f59f00' : '1px solid var(--border-color)',
                            background: isPending ? 'rgba(245,159,0,0.15)' : 'var(--bg-secondary)',
                            color: isPending ? '#f59f00' : 'var(--text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          ⏱️ {L.btnStatusPending}
                        </button>

                        <button
                          onClick={() => handleSetTaskStatus(t.id, 'completed')}
                          style={{
                            flex: 1,
                            padding: '4px 6px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 'bold',
                            border: isDone ? '1px solid #40c057' : '1px solid var(--border-color)',
                            background: isDone ? 'rgba(64,192,87,0.2)' : 'var(--bg-secondary)',
                            color: isDone ? '#40c057' : 'var(--text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          ✅ {L.btnStatusCompleted}
                        </button>
                      </div>

                      <button 
                        onClick={() => handleOpenComment('task', t)}
                        style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <MessageSquare size={13} color="var(--primary)" /> 
                        {L.btnDiscussDoc} ({t.comments?.length || 0})
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 4: GALLERY & ITINERARY (IMAGE 5 FIX: FULL MULTILINGUAL)   */}
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
                    {ITINERARY_ROWS.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < ITINERARY_ROWS.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                          {row[`date_${langKey}`] || row.date_id}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {row[`agenda_${langKey}`] || row.agenda_id}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                          {row[`focus_${langKey}`] || row.focus_id}
                        </td>
                      </tr>
                    ))}
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
              {localGallery.map((media) => {
                const title = media[`title_${langKey}`] || media.title_id || media.title;
                const caption = media[`caption_${langKey}`] || media.caption_id || media.caption;
                const location = media[`location_${langKey}`] || media.location_id || media.location;
                const date = media[`date_${langKey}`] || media.date_id || media.date;

                return (
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
                              title={title}
                              style={{ width: '100%', height: '100%', border: 'none' }}
                            />
                          ) : (
                            <video src={media.mediaUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                        </div>
                      ) : (
                        <img src={media.mediaUrl} alt={title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                      )}

                      <div style={{ padding: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.72rem', background: 'var(--bg-secondary)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                            📍 {location || 'Indonesia'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            📅 {date}
                          </span>
                        </div>

                        <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                          {title}
                        </h4>

                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                          {caption}
                        </p>
                      </div>
                    </div>

                    <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {media.author}
                      </span>

                      <button 
                        onClick={() => handleOpenComment('gallery', media)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <MessageSquare size={14} /> {media.comments?.length || 0} {L.btnResponses}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 5: STAKEHOLDERS DIRECTORY (FULL MULTILINGUAL)             */}
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
              {STAKEHOLDERS.map((s, idx) => {
                const role = s[`role_${langKey}`] || s.role_id;
                const title = s[`title_${langKey}`] || s.title_id;
                const country = s[`country_${langKey}`] || s.country_id;
                const address = s[`address_${langKey}`] || s.address_id;
                const scope = s[`scope_${langKey}`] || s.scope_id;

                return (
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
                          {role}
                        </span>
                        <span style={{ fontSize: '0.85rem' }}>{country}</span>
                      </div>

                      <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: '0 0 8px 0', fontWeight: '800' }}>
                        {s.org}
                      </h4>

                      <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '10px', marginBottom: '14px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{s.representative}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{title}</div>
                        {s.regNo && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Reg No: {s.regNo}</div>}
                        {address && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>📍 {address}</div>}
                      </div>

                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                        <strong>{L.labelMandate}:</strong> {scope}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* INTERACTIVE COMMENT & DISCUSSION DRAWER                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeCommentTarget && (() => {
        const activeLiveItem = 
          activeCommentTarget.type === 'step' 
            ? (localRoadmap.find(s => s.step === activeCommentTarget.item.step) || activeCommentTarget.item)
            : activeCommentTarget.type === 'doc'
            ? (localDocs.find(d => d.id === activeCommentTarget.id) || activeCommentTarget.item)
            : activeCommentTarget.type === 'task'
            ? (localTasks.find(t => t.id === activeCommentTarget.id) || activeCommentTarget.item)
            : activeCommentTarget.type === 'gallery'
            ? (localGallery.find(g => g.id === activeCommentTarget.id) || activeCommentTarget.item)
            : activeCommentTarget.item;

        const liveComments = activeLiveItem?.comments || [];

        return (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10005, padding: '20px' }} onClick={() => setActiveCommentTarget(null)}>
            <div style={{ background: 'var(--bg-card)', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
              
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={18} color="var(--primary)" /> {L.commentSectionTitle}
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {activeLiveItem[`title_${langKey}`] || activeLiveItem.title_id || activeLiveItem.title || `STEP ${activeLiveItem.step}`}
                  </span>
                </div>
                <button onClick={() => setActiveCommentTarget(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>

              <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {liveComments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    💬 {L.noCommentsYet}
                  </div>
                ) : (
                  liveComments.map((c, i) => (
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
        );
      })()}

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
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>{L.labelTitle}</label>
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
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>{L.labelType}</label>
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
