import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Shield, FileText, CheckCircle2, Clock, AlertTriangle, 
  UploadCloud, Download, ExternalLink, Calendar, Users, 
  Layers, MapPin, Building2, Briefcase, Plus, X, Video, 
  CheckSquare, ArrowRight, Lock, Eye, Search, Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { 
  useUgandaProjectDocuments, 
  useUgandaProjectTasks, 
  useUgandaProjectGallery 
} from '../../hooks/useFirestoreQueries';
import { db } from '../../firebase/config';
import { collection, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// Default static documents based on nda.md
const INITIAL_DOCUMENTS = [
  {
    id: 'doc-nda-001',
    title: 'Perjanjian Kerahasiaan, Non-Pengungkapan, Non-Circumvention & Kemitraan Strategis (NDA)',
    type: 'Legal Agreement',
    parties: 'PT Katama Suryabumi, SADO, Kangker Construction',
    date: 'September 2026',
    status: 'Signed & Active',
    fileUrl: '/event/uganda.png',
    isStatic: true,
    clauses: '26 Pasal (KSLL, RISHAM, Non-Circumvention, IsDB Funding, Fee SADO & Jimmy)'
  },
  {
    id: 'doc-ksll-002',
    title: 'Spesifikasi Teknis & Lisensi Penerapan Konstruksi Sarang Laba-Laba (KSLL)',
    type: 'Technical License',
    parties: 'PT Katama Suryabumi',
    date: 'Agustus 2026',
    status: 'Verified',
    fileUrl: '#',
    isStatic: true,
    clauses: 'Analisis Geoteknik, Investigasi Tanah, Desain Beban Bangunan Tahan Gempa'
  },
  {
    id: 'doc-risham-003',
    title: 'Kerangka Lisensi & Alih Teknologi RISHAM (Rumah Instan Sehat Aman)',
    type: 'Technology Transfer',
    parties: 'PT Panorama Agung Utama & PERPUBI',
    date: 'Agustus 2026',
    status: 'Verified',
    fileUrl: '#',
    isStatic: true,
    clauses: 'Desain Modular, Prefabrikasi BlockBamboo, Standar Hunian Berkelanjutan'
  },
  {
    id: 'doc-annex-004',
    title: 'Annex A & B: Register of Introduced Contacts & African Territories',
    type: 'Annex / Register',
    parties: 'SADO & PT Katama Suryabumi',
    date: 'September 2026',
    status: 'Active',
    fileUrl: '#',
    isStatic: true,
    clauses: 'Perlindungan Kontak Non-Circumvention 5 Tahun di Uganda dan Pasar Afrika'
  }
];

// 11-Step Roadmap from nda.md
const ROADMAP_STEPS = [
  { step: 1, title: 'Signing of NDA & Non-Circumvention Agreement', status: 'completed', date: 'Sept 2026', desc: 'Penandatanganan Perjanjian Kerahasiaan & Kerangka Kemitraan di Jakarta antara Katama, SADO, Kangker, dan mitra Indonesia.' },
  { step: 2, title: 'Heads of Agreement / Interim Partnership Agreement', status: 'in-progress', date: 'Okt 2026', desc: 'Penyusunan kesepakatan transisi operasional, jalur komunikasi, focal person, serta pembagian fee fasilitasi.' },
  { step: 3, title: 'Main Strategic Partnership Agreement', status: 'pending', date: 'Des 2026', desc: 'Penyelesaian Main Agreement dalam 90 hari setelah konfirmasi tertulis implementasi proyek.' },
  { step: 4, title: 'Government & Bilateral Engagement', status: 'in-progress', date: 'Sept - Nov 2026', desc: 'Fasilitasi pertemuan tingkat kementerian dan bilateral institusional di Uganda melalui peran SADO.' },
  { step: 5, title: 'Uganda Technical & Business Mission', status: 'pending', date: 'Kuartal 1 2027', desc: 'Misi kunjungan tim teknis dan bisnis Indonesia ke Kampala untuk survei lapangan dan lokasi proyek.' },
  { step: 6, title: 'Pilot Project / Proof of Concept (PoC)', status: 'pending', date: 'Kuartal 2 2027', desc: 'Pengiriman mould, komponen, dan sistem teknis KSLL serta prototype Rumah Modular BlockBamboo/RISHAM.' },
  { step: 7, title: 'Technical & Commercial Feasibility', status: 'pending', date: 'Kuartal 2 2027', desc: 'Investigasi tanah setempat, regulasi bangunan Uganda, uji struktur, dan kelayakan finansial.' },
  { step: 8, title: 'Development Financing & Funding Engagement', status: 'pending', date: 'Kuartal 3 2027', desc: 'Eksplorasi pendanaan pembangunan dari Islamic Development Bank (IsDB), multilateral banks, dan climate fund.' },
  { step: 9, title: 'Technology Transfer, Training & Local Manufacturing', status: 'pending', date: 'Kuartal 4 2027', desc: 'Pelatihan tenaga kerja lokal Uganda, perakitan lokal, dan standardisasi Quality Control/QA.' },
  { step: 10, title: 'Project-Specific Agreements & Implementation', status: 'pending', date: '2028', desc: 'Pelaksanaan konstruksi perumahan, rumah sakit, diagnostic centres, dan fasilitas publik.' },
  { step: 11, title: 'Scale-Up in Uganda & African Markets', status: 'pending', date: '2028+', desc: 'Ekspansi regional ke negara-negara Afrika yang disepakati bersama konsorsium.' },
];

const INITIAL_TASKS = [
  { id: 't-1', title: 'Finalisasi Penandatanganan NDA Trilateral di Jakarta', category: 'Legal', assignee: 'Katama / SADO / Kangker', status: 'Done', dueDate: 'Sept 2026' },
  { id: 't-2', title: 'Penyusunan Draft Heads of Agreement (HoA)', category: 'Legal', assignee: 'Lead Indonesian Party & SADO', status: 'In Progress', dueDate: 'Okt 2026' },
  { id: 't-3', title: 'Persiapan Dokumen Teknis KSLL untuk Karakteristik Tanah Uganda', category: 'Engineering', assignee: 'Tim Engineer PT Katama', status: 'In Progress', dueDate: 'Nov 2026' },
  { id: 't-4', title: 'Pembuatan Mockup Modular BlockBamboo untuk Display Ekspor', category: 'R&D', assignee: 'PERPUBI & Panorama Agung', status: 'In Progress', dueDate: 'Nov 2026' },
  { id: 't-5', title: 'Audiensi dengan Perwakilan IsDB & Lembaga Pembiayaan Pembangunan', category: 'Financing', assignee: 'SADO & Turkodom Consulting', status: 'Pending', dueDate: 'Des 2026' },
  { id: 't-6', title: 'Penjadwalan Kunjungan Balasan (Indonesian Mission to Kampala)', category: 'Bilateral', assignee: 'SADO & Fasilitator', status: 'Pending', dueDate: 'Jan 2027' },
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
  const { t } = useLanguage();
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
    user?.kycStatus === 'verified' // Allow verified KYC leadership for initial collaboration
  );

  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap', 'vault', 'tasks', 'gallery', 'stakeholders'
  const [searchDocQuery, setSearchDocQuery] = useState('');

  // Firestore Queries
  const { data: dynamicDocs = [] } = useUgandaProjectDocuments();
  const { data: dynamicTasks = [] } = useUgandaProjectTasks();
  const { data: dynamicGallery = [] } = useUgandaProjectGallery();

  // Combine static and dynamic data
  const allDocuments = [...INITIAL_DOCUMENTS, ...dynamicDocs].filter(doc => 
    doc.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
    doc.parties.toLowerCase().includes(searchDocQuery.toLowerCase())
  );

  const allTasks = dynamicTasks.length > 0 ? dynamicTasks : INITIAL_TASKS;

  // Upload Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docForm, setDocForm] = useState({
    title: '',
    type: 'Project Addendum',
    parties: 'Katama / SADO / Kangker',
    clauses: '',
    file: null
  });

  // Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    category: 'Engineering',
    assignee: 'PT Katama Suryabumi',
    status: 'In Progress',
    dueDate: 'Nov 2026'
  });

  const handleDocFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("Ukuran file maksimal 15MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocForm({ ...docForm, file: reader.result, fileName: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDocument = async (e) => {
    e.preventDefault();
    if (!docForm.title) return alert("Harap isi judul dokumen.");
    
    setIsUploadingDoc(true);
    try {
      let fileUrl = '#';
      if (docForm.file) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        if (cloudName && uploadPreset) {
          const formData = new FormData();
          formData.append('file', docForm.file);
          formData.append('upload_preset', uploadPreset);
          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.secure_url) fileUrl = data.secure_url;
        }
      }

      await addDoc(collection(db, "uganda_project_documents"), {
        title: docForm.title,
        type: docForm.type,
        parties: docForm.parties,
        clauses: docForm.clauses,
        fileUrl: fileUrl,
        date: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        status: 'Uploaded',
        uploadedBy: user?.name || user?.username || 'Konsorsium',
        timestamp: serverTimestamp()
      });

      alert("✅ Berhasil mengunggah dokumen baru ke Legal Vault!");
      setDocForm({ title: '', type: 'Project Addendum', parties: 'Katama / SADO / Kangker', clauses: '', file: null });
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
      await addDoc(collection(db, "uganda_project_tasks"), {
        ...taskForm,
        createdAt: serverTimestamp(),
        createdBy: user?.name || user?.username
      });
      alert("✅ Tugas baru berhasil ditambahkan!");
      setTaskForm({ title: '', category: 'Engineering', assignee: 'PT Katama Suryabumi', status: 'In Progress', dueDate: 'Nov 2026' });
      setIsTaskModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan tugas: " + err.message);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // ACCESS RESTRICTED SCREEN (If not authorized)
  // ─────────────────────────────────────────────────────────────
  if (!isAuthenticated || !isAuthorized) {
    return (
      <div style={{ paddingTop: '160px', minHeight: '90vh', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '40px', maxWidth: '580px', width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
          <div style={{ width: '70px', height: '70px', background: 'rgba(224, 49, 49, 0.1)', color: '#e03131', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '12px', fontWeight: '800' }}>
            Akses Terbatas: Proyek Konsorsium Uganda
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Dashboard ini dilindungi oleh <strong>Perjanjian Kerahasiaan (NDA) & Non-Circumvention</strong> trilateral antara <strong>PT Katama Suryabumi</strong>, <strong>SADO</strong>, dan <strong>Kangker Construction International Ltd</strong>.
          </p>
          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
            <strong>Entitas yang Berhak Mengakses:</strong>
            <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
              <li>Administrator BaMbooChain / Yayasan</li>
              <li>Pimpinan PT Katama Suryabumi (Drs. M. Kris Suyanto)</li>
              <li>Pimpinan SADO Uganda (Dr. Nelson Tenywa Muzira)</li>
              <li>Pimpinan Kangker Construction (Mr. Samuel Humphry Kennedy)</li>
              <li>Mitra Strategis (PERPUBI, Panorama Agung Utama, Turkodom, Fasilitator)</li>
            </ul>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/" className="btn" style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--bg-secondary)', color: 'var(--text-main)', textDecoration: 'none', fontWeight: '600' }}>
              Kembali ke Beranda
            </Link>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold' }}>
              Ajukan Izin Akses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // AUTHORIZED DASHBOARD SCREEN
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{ paddingTop: '140px', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <div className="container" style={{ padding: '20px 24px 60px 24px' }}>
        
        {/* Top Breadcrumb & Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <BackButton />
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '20px', fontWeight: '700', border: '1px solid rgba(12, 166, 120, 0.2)' }}>
              🔒 Confidential Consortium Portal
            </span>
            <Link 
              to="/bamboochain/meeting?room=uganda-consortium-coordination"
              style={{ background: '#1c7ed6', color: 'white', padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
            >
              <Video size={16} /> Ruang Rapat Virtual
            </Link>
          </div>
        </div>

        {/* Hero Banner / Header */}
        <div style={{ background: 'linear-gradient(135deg, #092c20 0%, #0d4a34 50%, #082117 100%)', borderRadius: '24px', padding: '36px 32px', color: 'white', marginBottom: '32px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.6rem' }}>🇺🇬 🤝 🇮🇩</span>
              <span style={{ textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.8rem', fontWeight: 'bold', color: '#69db7c' }}>
                Strategic Trilateral Infrastructure & Bamboo Initiative
              </span>
            </div>
            
            <h1 style={{ fontSize: '2.1rem', fontWeight: '900', margin: '0 0 12px 0', lineHeight: '1.2' }}>
              Dashboard Proyek Konsorsium Uganda – Indonesia
            </h1>
            
            <p style={{ fontSize: '0.95rem', color: '#d3f9d8', maxWidth: '850px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              Pusat komando terpadu untuk koordinasi transfer teknologi konstruksi <strong>KSLL (PT Katama)</strong>, modular sustainable housing <strong>RISHAM & BlockBamboo (PERPUBI & Panorama Agung)</strong>, fasilitasi kelembagaan pemerintah <strong>SADO Uganda</strong>, dan implementasi lapangan <strong>Kangker Construction Ltd</strong>.
            </p>

            {/* Trilateral Partner Tags */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                🏢 Lead Coordinator: <strong>PT Katama Suryabumi</strong>
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                🏛️ Enabling Agency: <strong>SADO Uganda</strong>
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                🏗️ Construction Partner: <strong>Kangker Construction Ltd</strong>
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                🎋 Agro & Bamboo: <strong>PERPUBI</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Quick KPI Stat Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Status Legalitas NDA</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#40c057', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={18} /> Aktif & Mengikat
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Masa Berlaku: 5 Tahun (Pasal 16)</div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Roadmap Kemitraan</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={18} /> Step 1 of 11
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Target HoA: 90 Hari (Pasal 13)</div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Total Dokumen Vault</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1c7ed6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={18} /> {allDocuments.length} Berkas
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Terenkripsi On-Cloud</div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Target Pembiayaan</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f59f00', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🏛️ IsDB & Climate Funds
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Fasilitasi Multilateral (Pasal 15)</div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '28px', overflowX: 'auto', paddingBottom: '2px' }}>
          {[
            { key: 'roadmap', label: '11-Step Roadmap', icon: <Layers size={17} /> },
            { key: 'vault', label: `Legal Vault & Dokumen (${allDocuments.length})`, icon: <FileText size={17} /> },
            { key: 'tasks', label: `Manajemen Proyek (${allTasks.length})`, icon: <CheckSquare size={17} /> },
            { key: 'gallery', label: 'Dokumentasi Kunjungan', icon: <Calendar size={17} /> },
            { key: 'stakeholders', label: 'Direktori Stakeholders', icon: <Users size={17} /> },
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                  Roadmap & Tahapan Eksekusi Kerja Sama (Pasal 26 & Lampiran)
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Pelacakan progres berjenjang mulai dari penandatanganan NDA hingga ekspansi proyek konstruksi di Afrika.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              {ROADMAP_STEPS.map((step) => {
                const isCompleted = step.status === 'completed';
                const isInProgress = step.status === 'in-progress';
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
                      boxShadow: isInProgress ? '0 6px 20px rgba(12,166,120,0.1)' : 'none',
                      position: 'relative'
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
                          STEP {step.step}: {step.title}
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
                            {isCompleted ? 'SELESAI' : isInProgress ? 'SEDANG BERJALAN' : 'MENUNGGU TAHAP'}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 2: LEGAL VAULT & DOKUMEN NDA                              */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'vault' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <Search size={16} color="#adb5bd" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  placeholder="Cari berkas dokumen atau pasal..."
                  value={searchDocQuery}
                  onChange={(e) => setSearchDocQuery(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>

              <button 
                onClick={() => setIsDocModalOpen(true)}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(12,166,120,0.2)' }}
              >
                <UploadCloud size={17} /> Unggah Dokumen / Addendum Baru
              </button>
            </div>

            {/* Document Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {allDocuments.map((doc) => (
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
                      <strong>Para Pihak:</strong> {doc.parties}
                    </p>

                    <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px', border: '1px solid var(--border-color)' }}>
                      <strong>Cakupan / Klausul:</strong> {doc.clauses}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
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
                        <Download size={15} /> Unduh Berkas
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Internal Draft
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 3: MANAJEMEN PROYEK & TASK BOARD                          */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'tasks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                  Matriks Tugas & Rencana Kerja Konsorsium
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Pembagian penugasan PIC lintas instansi (Katama, SADO, Kangker, PERPUBI, Turkodom).
                </p>
              </div>

              <button 
                onClick={() => setIsTaskModalOpen(true)}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> Tambah Tugas Baru
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {allTasks.map((t, idx) => (
                <div 
                  key={t.id || idx}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--text-muted)', padding: '3px 10px', borderRadius: '8px', fontWeight: 'bold' }}>
                      {t.category}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '3px 10px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      background: t.status === 'Done' ? '#40c05720' : t.status === 'In Progress' ? 'rgba(12,166,120,0.15)' : '#f59f0015',
                      color: t.status === 'Done' ? '#40c057' : t.status === 'In Progress' ? 'var(--primary)' : '#f59f00'
                    }}>
                      {t.status}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.98rem', color: 'var(--text-main)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                    {t.title}
                  </h4>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>👤 <strong>PIC:</strong> {t.assignee}</div>
                    <div>⏰ <strong>Target:</strong> {t.dueDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 4: DOKUMENTASI DELEGASI & GALERI KUNJUNGAN                */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'gallery' && (
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} color="var(--primary)" />
                Itinerary Kunjungan Delegasi Uganda ke Indonesia (31 Ags – 5 Sept 2026)
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 16px', color: 'var(--text-main)' }}>Tanggal</th>
                      <th style={{ padding: '12px 16px', color: 'var(--text-main)' }}>Lokasi & Agenda Kunjungan</th>
                      <th style={{ padding: '12px 16px', color: 'var(--text-main)' }}>Fokus Utama</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>31 Ags 2026</td>
                      <td style={{ padding: '12px 16px' }}>Delegasi Uganda tiba di Indonesia dan menginap di Jakarta.</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Penyambutan Resmi</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>1 Sept 2026</td>
                      <td style={{ padding: '12px 16px' }}>Kunjungan ke kantor PT Katama Suryabumi, Rawamangun Jakarta.</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Pembahasan NDA & Ruang Lingkup KSLL</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>2 Sept 2026</td>
                      <td style={{ padding: '12px 16px' }}>Pertemuan di Wisma Bumiputera, Bandung.</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Substansi Rencana Kerja Sama & Roadmap</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>3 Sept 2026</td>
                      <td style={{ padding: '12px 16px' }}>Kunjungan ITB Jatinangor & Cimekar (Prototipe BlockBamboo & RISHAM) serta Puskim Cileunyi.</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Riset, Alih Teknologi & Standar Hunian</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>4–5 Sept 2026</td>
                      <td style={{ padding: '12px 16px' }}>Kunjungan Tangerang Selatan (Puspiptek, Pemkot Tangsel).</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Implementasi Nyata KSLL Konstruksi</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gallery Section */}
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: '0 0 16px 0' }}>
              Dokumentasi Foto & Arsip Kunjungan
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <img src="/event/uganda.png" alt="Delegasi Uganda" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '16px' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem' }}>Pertemuan Bilateral Inovasi Hijau Indonesia - Uganda</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Momen penandatanganan dan pembahasan awal kemitraan teknologi konstruksi dan bambu.</p>
                </div>
              </div>
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
                Direktori Entitas & Kontak Pimpinan Konsorsium
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Daftar resmi para pihak penandatangan dan mitra strategis teknologi Indonesia.
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
                      <strong>Peran & Mandat:</strong> {s.scope}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL UNGGAH DOKUMEN                                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isDocModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '20px', width: '100%', maxWidth: '550px', padding: '28px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>Unggah Berkas ke Legal Vault</h3>
              <button onClick={() => setIsDocModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveDocument} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>Judul Dokumen</label>
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
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>Tipe Dokumen</label>
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
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>Pihak Terkait</label>
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
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>Ringkasan Klausul / Catatan</label>
                <textarea 
                  value={docForm.clauses} 
                  onChange={(e) => setDocForm({...docForm, clauses: e.target.value})}
                  placeholder="Keterangan singkat substansi dokumen..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.85rem', minHeight: '70px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>Unggah Berkas PDF / DOC (Maks 15MB)</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.zip,.dwg"
                  onChange={handleDocFileUpload}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px dashed var(--border-color)', background: 'var(--bg-secondary)', fontSize: '0.85rem' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isUploadingDoc}
                style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.95rem', cursor: isUploadingDoc ? 'not-allowed' : 'pointer', marginTop: '10px' }}
              >
                {isUploadingDoc ? 'Sedang Mengunggah...' : 'Simpan ke Legal Vault'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL TAMBAH TUGAS                                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isTaskModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '28px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>Tambah Tugas Konsorsium</h3>
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
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>PIC Penanggung Jawab</label>
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
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-main)' }}>Target Selesai</label>
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
                Simpan Tugas
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UgandaProjectDashboard;
