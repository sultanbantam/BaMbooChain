import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { PROJECTS } from '../data/projectsData';
import { 
  MapPin, Lock, Unlock, ArrowRight, X, Info, Coins,
  TrendingUp, TrendingDown, Folder, DollarSign, Plus, FileText, Calendar, User, History, Wallet, Send, CheckCircle2, AlertCircle, XCircle, Award,
  Activity, HelpCircle, Shield
} from 'lucide-react';
import BackButton from '../components/BackButton';

const ProjectsPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isConnected, rawBmcBalance, connectWallet } = useWeb3();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showLockModal, setShowLockModal] = useState(false);

  // Tab State for Project Treasury Detail View
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedRole, setSelectedRole] = useState('donor'); // 'donor', 'pm', 'bendahara'

  // Interactive Form States
  const [supportAmount, setSupportAmount] = useState('');
  const [supportCurrency, setSupportCurrency] = useState('IDR');
  const [supportMethod, setSupportMethod] = useState('Transfer Bank');
  const [supportNotes, setSupportNotes] = useState('');

  const [expenseCategory, setExpenseCategory] = useState('Digital');
  const [expenseSubCategory, setExpenseSubCategory] = useState('Domain');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseVendor, setExpenseVendor] = useState('');

  const REQUIRED_BMC = 10;
  const hasAccess = isConnected && rawBmcBalance >= REQUIRED_BMC;

  const tField = (item, field) => {
    if (!item) return '';
    return item[`${field}_${language}`] || item[field];
  };

  const formatIdr = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  const formatBmc = (idr) => {
    const bmcVal = idr / 17000;
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(bmcVal) + ' BMC';
  };

  // ----------------------------------------------------
  // LOCAL STORAGE STATE FOR TREASURY DETAILS
  // ----------------------------------------------------
  const getInitialTreasuryData = () => {
    return {
      8: { // Whale of Savu (Levanuang) - WOF-001
        project_id: "WOF-001",
        target_dana: 100000000,
        total_dana_masuk: 2000000,
        total_pengeluaran: 2000000,
        saldo: 0,
        progress: 2,
        wallet_address: "0xWOF773a98211b981665aef449c20",
        sub_ledgers: {
          ai: { name: "Kuota AI & LLM", budget: 10000000, spent: 0 },
          domain: { name: "Domain & Hosting", budget: 2000000, spent: 300000 },
          dev: { name: "Development Platform", budget: 25000000, spent: 0 },
          ops: { name: "Operasional Lapangan", budget: 20000000, spent: 1700000 },
          legal: { name: "Legal & Administrasi", budget: 10000000, spent: 0 },
          marketing: { name: "Promosi & Hubungan", budget: 10000000, spent: 0 },
          riset: { name: "Riset Sosial-Budaya", budget: 13000000, spent: 0 }
        },
        funding: [
          { id: "FND-001", name: "Mukoddas (Owner)", amount: 2000000, currency: "IDR", method: "Transfer Bank", tx: "0xabcfe890...", status: "Success", date: "2026-06-15", notes: "Modal awal untuk domain & operasional" }
        ],
        expenses: [
          { id: "EXP-001", category: "Digital", subcategory: "Domain", amount: 300000, desc: "Beli domain levanuang.id", vendor: "CV Digital Indo", invoice: "invoice_dom.pdf", paymentProof: "receipt_dom.png", date: "2026-06-10", creator: "Mukoddas", approver: "John", status: "Approved" },
          { id: "EXP-002", category: "Operasional", subcategory: "Lapangan", amount: 1700000, desc: "Sewa koordinasi lapangan & administrasi", vendor: "Masyarakat Adat", invoice: "invoice_ops.pdf", paymentProof: "receipt_ops.png", date: "2026-06-14", creator: "Mukoddas", approver: "John", status: "Approved" }
        ],
        milestones: [
          { id: "M1", name: "Domain & Hosting", desc: "Registrasi domain dan hosting dasar", progress: 100, startDate: "2026-06-01", endDate: "2026-06-05", status: "Selesai" },
          { id: "M2", name: "Landing Page & AI Chatbot", desc: "Pengembangan frontend & AI chatbot", progress: 100, startDate: "2026-06-06", endDate: "2026-06-20", status: "Selesai" },
          { id: "M3", name: "Mobile App & Local Integration", desc: "Integrasi sistem ekowisata dengan token wallet", progress: 25, startDate: "2026-06-25", endDate: "2026-07-30", status: "Berjalan" },
          { id: "M4", name: "Launching & Community Activities", desc: "Peluncuran resmi ke masyarakat Lembata", progress: 0, startDate: "2026-08-01", endDate: "2026-08-15", status: "Belum Mulai" }
        ],
        members: [
          { name: "Mukoddas", role: "Owner" },
          { name: "John", role: "Bendahara & Validator" },
          { name: "Devy", role: "Developer" }
        ],
        documents: [
          { id: "DOC-001", name: "Proposal Pengembangan Wisata Levanuang.pdf", type: "Proposal", date: "2026-06-01" },
          { id: "DOC-002", name: "MoU Kerjasama Adat Lembata.pdf", type: "MoU", date: "2026-06-05" },
          { id: "DOC-003", name: "Kontrak Vendor Pengembangan Platform.pdf", type: "Kontrak", date: "2026-06-10" }
        ],
        activities: [
          { title: "Kickoff Meeting Tim Levanuang", desc: "Diskusi target dan timeline pengembangan platform digital.", date: "2026-06-05", location: "Lembata, NTT" },
          { title: "Sosialisasi Warga Adat", desc: "Menjelaskan skema pariwisata terdesentralisasi kepada masyarakat lokal.", date: "2026-06-12", location: "Lembata, NTT" }
        ],
        audit_logs: [
          { text: "Mukoddas menginisiasi proyek Whale of Savu (Levanuang)", timestamp: "2026-06-01 10:00", actor: "Mukoddas" },
          { text: "Mukoddas memberikan dukungan dana awal Rp 2.000.000 (FND-001)", timestamp: "2026-06-10 14:30", actor: "Mukoddas" },
          { text: "Mukoddas mengajukan pengeluaran Domain Rp 300.000 (EXP-001)", timestamp: "2026-06-10 15:00", actor: "Mukoddas" },
          { text: "John (Bendahara) menyetujui pengeluaran Domain Rp 300.000", timestamp: "2026-06-10 16:00", actor: "John" },
          { text: "Mukoddas mengajukan pengeluaran Operasional Rp 1.700.000 (EXP-002)", timestamp: "2026-06-14 13:00", actor: "Mukoddas" },
          { text: "John (Bendahara) menyetujui pengeluaran Operasional Rp 1.700.000", timestamp: "2026-06-14 14:00", actor: "John" }
        ]
      },
      1: { // Perkebunan Emas Hijau Cibarani - PEH-001
        project_id: "PEH-001",
        target_dana: 500000000,
        total_dana_masuk: 320000000,
        total_pengeluaran: 85000000,
        saldo: 235000000,
        progress: 64,
        wallet_address: "0xCIB773a98211b981665aef449c20",
        sub_ledgers: {
          bibit: { name: "Pembibitan Bambu Petung", budget: 100000000, spent: 45000000 },
          ops: { name: "Logistik & Operasional Lapangan", budget: 150000000, spent: 20000000 },
          promosi: { name: "Promosi & Sertifikasi Karbon", budget: 50000000, spent: 20000000 },
          legal: { name: "Legal & Perizinan Adat", budget: 20000000, spent: 0 },
          riset: { name: "Riset Agroforestri", budget: 50000000, spent: 0 }
        },
        funding: [
          { id: "FND-CIB-001", name: "CSR Hijau Indo", amount: 200000000, currency: "IDR", method: "Transfer Bank", tx: "0x12a9...fa8b", status: "Success", date: "2026-05-15", notes: "Dukungan CSR utama" },
          { id: "FND-CIB-002", name: "Komunitas Banten", amount: 120000000, currency: "IDR", method: "Transfer Bank", tx: "0x9812...cb8f", status: "Success", date: "2026-05-20", notes: "Sumbangan kolektif daerah" }
        ],
        expenses: [
          { id: "EXP-CIB-001", category: "Pembibitan", subcategory: "Bibit Bambu", amount: 45000000, desc: "Pembelian 3000 bibit unggul", vendor: "Koperasi Cibarani", invoice: "inv_bibit.pdf", paymentProof: "receipt_bibit.png", date: "2026-05-25", creator: "Mukoddas", approver: "John", status: "Approved" },
          { id: "EXP-CIB-002", category: "Logistik", subcategory: "Angkutan", amount: 20000000, desc: "Sewa armada angkutan pupuk & bibit", vendor: "CV Logistik Maju", invoice: "inv_log.pdf", paymentProof: "receipt_log.png", date: "2026-05-28", creator: "Mukoddas", approver: "John", status: "Approved" },
          { id: "EXP-CIB-003", category: "Promosi", subcategory: "Sertifikasi", amount: 20000000, desc: "Uji kelayakan karbon awal", vendor: "Sucofindo", invoice: "inv_sert.pdf", paymentProof: "receipt_sert.png", date: "2026-06-02", creator: "Mukoddas", approver: "John", status: "Approved" }
        ],
        milestones: [
          { id: "M1", name: "Peta Geospasial & Sertifikasi", desc: "Pemetaan lahan adat Cibarani", progress: 100, startDate: "2026-05-01", endDate: "2026-05-10", status: "Selesai" },
          { id: "M2", name: "Pembelian & Distribusi Bibit", desc: "Penyediaan bibit Petung ke petani", progress: 80, startDate: "2026-05-15", endDate: "2026-06-15", status: "Berjalan" },
          { id: "M3", name: "Penanaman Massal Tahap 1", desc: "Mulai penanaman 200 Ha pertama", progress: 30, startDate: "2026-06-20", endDate: "2026-08-30", status: "Berjalan" }
        ],
        members: [
          { name: "Mukoddas", role: "Owner" },
          { name: "John", role: "Bendahara & Validator" },
          { name: "Ahmad", role: "Project Manager" }
        ],
        documents: [
          { id: "DOC-CIB-001", name: "Rencana Kelayakan Agroforestri Cibarani.pdf", type: "Proposal", date: "2026-05-01" },
          { id: "DOC-CIB-002", name: "Sertifikat Tanah Adat Cibarani.pdf", type: "MoU", date: "2026-05-05" }
        ],
        activities: [
          { title: "Pembagian Bibit ke Kelompok Tani", desc: "Penyerahan simbolis bibit bambu Petung unggulan kepada ketua adat.", date: "2026-05-25", location: "Cibarani, Banten" }
        ],
        audit_logs: [
          { text: "Ahmad menginisiasi proyek Emas Hijau Cibarani", timestamp: "2026-05-01 09:00", actor: "Ahmad" },
          { text: "CSR Hijau Indo mendanai Rp 200.000.000", timestamp: "2026-05-15 11:00", actor: "CSR Hijau" }
        ]
      }
    };
  };

  const [treasuryData, setTreasuryData] = useState(() => {
    const saved = localStorage.getItem('project_treasuries_v2');
    return saved ? JSON.parse(saved) : getInitialTreasuryData();
  });

  useEffect(() => {
    localStorage.setItem('project_treasuries_v2', JSON.stringify(treasuryData));
  }, [treasuryData]);

  const getProjectTreasury = (projId) => {
    const data = treasuryData[projId];
    if (data) return data;

    // Default treasury schema fallback for other projects
    return {
      project_id: `PRJ-00${projId}`,
      target_dana: 200000000,
      total_dana_masuk: 50000000,
      total_pengeluaran: 10000000,
      saldo: 40000000,
      progress: 25,
      wallet_address: `0xPRJ${projId}773a98211b981665aef449c20`,
      sub_ledgers: {
        dev: { name: "Development", budget: 100000000, spent: 10000000 },
        ops: { name: "Operations", budget: 50000000, spent: 0 },
        legal: { name: "Legal", budget: 20000000, spent: 0 },
        marketing: { name: "Marketing", budget: 30000000, spent: 0 }
      },
      funding: [
        { id: "FND-MOCK-001", name: "Sponsor Awal", amount: 50000000, currency: "IDR", method: "Transfer Bank", tx: "0x3a2ef89c...", status: "Success", date: "2026-06-01", notes: "Pendanaan tahap awal" }
      ],
      expenses: [
        { id: "EXP-MOCK-001", category: "Digital", subcategory: "Development", amount: 10000000, desc: "Desain Awal & Wireframe", vendor: "Studio Kreatif", invoice: "inv_mock.pdf", paymentProof: "receipt_mock.png", date: "2026-06-05", creator: "Admin", approver: "Validator", status: "Approved" }
      ],
      milestones: [
        { id: "M1", name: "Perencanaan", desc: "Dokumen lingkup kerja disetujui", progress: 100, startDate: "2026-06-01", endDate: "2026-06-10", status: "Selesai" },
        { id: "M2", name: "Tahap Eksekusi", desc: "Mulai pengembangan utilitas", progress: 10, startDate: "2026-06-15", endDate: "2026-08-30", status: "Berjalan" }
      ],
      members: [
        { name: "Tim Hijau", role: "Project Manager" },
        { name: "Validator Utama", role: "Bendahara & Validator" }
      ],
      documents: [
        { id: "DOC-MOCK-001", name: "Brief Proyek.pdf", type: "Proposal", date: "2026-06-01" }
      ],
      activities: [],
      audit_logs: [
        { text: "Proyek diinisiasi di ekosistem", timestamp: "2026-06-01 09:00", actor: "System" }
      ]
    };
  };

  const getDynamicStats = () => {
    const totalProjectsCount = PROJECTS.length;
    
    let totalDanaMasuk = 0;
    let totalPendukung = 0;
    let totalBmcDigunakan = 0;
    let activeProjectsCount = 0;
    let proposedProjectsCount = 0;

    PROJECTS.forEach(proj => {
      const tr = getProjectTreasury(proj.id);
      totalDanaMasuk += tr.total_dana_masuk;
      totalPendukung += tr.funding ? tr.funding.length : 0;
      
      if (tr.funding) {
        tr.funding.forEach(f => {
          if (f.currency === 'BMC') {
            totalBmcDigunakan += f.amount;
          }
        });
      }

      if (proj.status === 'Berjalan') {
        activeProjectsCount++;
      } else if (proj.status === 'Diusulkan' || proj.status === 'Selesai') {
        proposedProjectsCount++;
      }
    });

    return {
      totalProjects: totalProjectsCount,
      danaTerkelola: totalDanaMasuk,
      totalPendukung: totalPendukung,
      bmcDigunakan: totalBmcDigunakan,
      activeProjectsCount,
      proposedProjectsCount
    };
  };

  const formatGlobalDana = (num) => {
    if (num >= 1000000000) {
      return "Rp " + (num / 1000000000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + "M";
    } else {
      return "Rp " + (num / 1000000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + " Jt";
    }
  };

  const formatGlobalBmc = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "M";
    } else {
      return num.toLocaleString('id-ID');
    }
  };

  // ----------------------------------------------------
  // INTERACTIVE SIMULATION ACTIONS
  // ----------------------------------------------------

  // Back / Fund Project
  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportAmount || parseFloat(supportAmount) <= 0) return;

    const amt = parseFloat(supportAmount);
    // Convert BMC to IDR equivalent (1 BMC = 17,000 IDR) for simple dashboard logic
    const amtIdr = supportCurrency === 'BMC' ? amt * 17000 : amt;

    const projId = selectedProject.id;
    const currentProj = getProjectTreasury(projId);

    const newFunding = {
      id: `FND-${Math.floor(100 + Math.random() * 900)}`,
      name: user?.username || "Pendukung Anonim",
      amount: amt,
      currency: supportCurrency,
      method: supportMethod,
      tx: "0x" + Math.random().toString(16).substr(2, 8) + "...",
      status: "Success",
      date: new Date().toISOString().split('T')[0],
      notes: supportNotes || "Dukungan Proyek"
    };

    const updatedProj = {
      ...currentProj,
      total_dana_masuk: currentProj.total_dana_masuk + amtIdr,
      saldo: currentProj.saldo + amtIdr,
      progress: Math.min(100, Math.round(((currentProj.total_dana_masuk + amtIdr) / currentProj.target_dana) * 100)),
      funding: [newFunding, ...currentProj.funding],
      audit_logs: [
        {
          text: `${user?.username || "User"} mengirim dukungan dana ${supportCurrency === 'IDR' ? formatIdr(amt) : amt + ' BMC'} (${newFunding.id})`,
          timestamp: new Date().toLocaleString(),
          actor: user?.username || "User"
        },
        ...currentProj.audit_logs
      ]
    };

    setTreasuryData(prev => ({
      ...prev,
      [projId]: updatedProj
    }));

    setSupportAmount('');
    setSupportNotes('');
    alert("Dukungan dana berhasil disimulasikan!");
  };

  // Submit Expense (Internal Tim / PM)
  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseAmount || parseFloat(expenseAmount) <= 0) return;

    const amt = parseFloat(expenseAmount);
    const projId = selectedProject.id;
    const currentProj = getProjectTreasury(projId);

    const newExpense = {
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      category: expenseCategory,
      subcategory: expenseSubCategory,
      amount: amt,
      desc: expenseDesc,
      vendor: expenseVendor || "Vendor Umum",
      invoice: "invoice_upload.pdf",
      paymentProof: "receipt_upload.png",
      date: new Date().toISOString().split('T')[0],
      creator: user?.username || "Project Manager",
      approver: "-",
      status: "Pending"
    };

    const updatedProj = {
      ...currentProj,
      expenses: [newExpense, ...currentProj.expenses],
      audit_logs: [
        {
          text: `${user?.username || "PM"} mengajukan pengeluaran ${expenseSubCategory} sebesar ${formatIdr(amt)} (${newExpense.id})`,
          timestamp: new Date().toLocaleString(),
          actor: user?.username || "PM"
        },
        ...currentProj.audit_logs
      ]
    };

    setTreasuryData(prev => ({
      ...prev,
      [projId]: updatedProj
    }));

    setExpenseAmount('');
    setExpenseDesc('');
    setExpenseVendor('');
    alert("Pengajuan pengeluaran berhasil diajukan untuk disetujui Bendahara!");
  };

  // Approve / Reject Expense (Bendahara / Admin)
  const handleVerifyExpense = (expenseId, approve) => {
    const projId = selectedProject.id;
    const currentProj = getProjectTreasury(projId);

    const updatedExpenses = currentProj.expenses.map(exp => {
      if (exp.id === expenseId) {
        return {
          ...exp,
          status: approve ? "Approved" : "Rejected",
          approver: user?.username || "Bendahara"
        };
      }
      return exp;
    });

    const targetExpense = currentProj.expenses.find(e => e.id === expenseId);
    if (!targetExpense) return;

    let updatedProj = {
      ...currentProj,
      expenses: updatedExpenses,
      audit_logs: [
        {
          text: `${user?.username || "Bendahara"} ${approve ? 'menyetujui' : 'menolak'} pengeluaran ${targetExpense.id}`,
          timestamp: new Date().toLocaleString(),
          actor: user?.username || "Bendahara"
        },
        ...currentProj.audit_logs
      ]
    };

    // If approved, update total expenses, balance, and the specific sub-ledger
    if (approve) {
      const amt = targetExpense.amount;
      updatedProj.total_pengeluaran += amt;
      updatedProj.saldo -= amt;

      // Map sub-ledger dynamically (lowercase conversion matching categories)
      const ledgerKey = targetExpense.subcategory.toLowerCase();
      if (updatedProj.sub_ledgers && updatedProj.sub_ledgers[ledgerKey]) {
        updatedProj.sub_ledgers[ledgerKey].spent += amt;
      } else if (updatedProj.sub_ledgers) {
        // Fallback or matches first key if sub_ledgers is defined
        const keys = Object.keys(updatedProj.sub_ledgers);
        if (keys.length > 0) {
          updatedProj.sub_ledgers[keys[0]].spent += amt;
        }
      }
    }

    setTreasuryData(prev => ({
      ...prev,
      [projId]: updatedProj
    }));

    alert(`Pengeluaran ${expenseId} berhasil ${approve ? 'disetujui' : 'ditolak'}!`);
  };

  const handleViewDetail = (project) => {
    if (project.id === 8) {
      window.open("https://www.whaleofsavu.org/" + (language === 'id' ? 'id' : 'en'), "_blank");
      setSelectedProject(project);
      setActiveTab('explore');
    } else if (project.id === 1) {
      window.open("https://youtu.be/uLew2KmoZT4", "_blank");
      setSelectedProject(project);
      setActiveTab('explore');
    } else if (hasAccess) {
      setSelectedProject(project);
      setActiveTab('explore');
    } else {
      setShowLockModal(true);
    }
  };

  const stats = getDynamicStats();

  return (
    <div style={{ 
      paddingTop: 'var(--navbar-height)', 
      paddingBottom: '100px',
      minHeight: '100vh',
      background: 'var(--bg-color)',
      transition: 'background 0.3s ease'
    }}>
      <div className="container">
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <BackButton to="/" />
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '16px' }}>{t('projects_title')}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('projects_subtitle')}</p>
          </div>
          
          <div className="glass" style={{ padding: '15px 25px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', 
              background: hasAccess ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: hasAccess ? '#16a34a' : '#dc2626'
            }}>
              {hasAccess ? <Unlock size={20} /> : <Lock size={20} />}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('projects_access_status')}</div>
              <div style={{ fontWeight: '800', color: hasAccess ? '#16a34a' : '#dc2626' }}>
                {hasAccess ? t('projects_access_open') : t('projects_access_locked')}
              </div>
            </div>
          </div>
        </div>

        {/* Global Dashboard Stats */}
        <div className="glass animate-fade-in" style={{ 
          padding: '25px 30px', 
          borderRadius: '24px', 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-color)',
          marginBottom: '40px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.02)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
            <Activity size={20} style={{ color: 'var(--primary)' }} />
            Project Ecosystem & Treasury Global Stats (ProjectFi)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.01)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jumlah Proyek</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)' }}>{stats.totalProjects} <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>(Total 128)</span></div>
            </div>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.01)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dana Terkelola</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#10b981' }}>
                {formatGlobalDana(stats.danaTerkelola)}
              </div>
            </div>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.01)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Pendukung</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--primary)' }}>{stats.totalPendukung.toLocaleString('id-ID')}</div>
            </div>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.01)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>BMC Digunakan</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#e67700' }}>
                {formatGlobalBmc(stats.bmcDigunakan)} <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>BMC</span>
              </div>
            </div>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.01)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Proyek Aktif</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)' }}>{stats.activeProjectsCount}</div>
            </div>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.01)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Proyek Selesai</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)' }}>{stats.completedProjectsCount}</div>
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {PROJECTS.map((project) => (
            <div 
              key={project.id}
              className="glass animate-fade-in"
              style={{ 
                borderRadius: '24px', 
                overflow: 'hidden', 
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image with Badge */}
              <div style={{ position: 'relative', height: '220px' }}>
                <div style={{ 
                  width: '100%', height: '100%', 
                  background: `url("${project.image}") center/cover no-repeat` 
                }} />
                <div style={{ 
                  position: 'absolute', top: '20px', left: '20px',
                  padding: '6px 14px', borderRadius: '30px',
                  background: project.status === 'Berjalan' ? '#16a34a' : '#f59e0b',
                  color: 'white', fontSize: '0.75rem', fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}>
                  {tField(project, 'status').toUpperCase()}
                </div>
                {project.project_code && (
                  <div style={{ 
                    position: 'absolute', top: '20px', right: '20px',
                    padding: '6px 12px', borderRadius: '10px',
                    background: '#10b981', color: 'white',
                    fontSize: '0.75rem', fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}>
                    {project.project_code}
                  </div>
                )}
                <div style={{ 
                  position: 'absolute', bottom: '15px', right: '15px',
                  padding: '6px 12px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                  color: '#212529', fontSize: '0.75rem', fontWeight: 'bold'
                }}>
                  {tField(project, 'category')}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px' }}>
                  <MapPin size={14} /> {tField(project, 'location')}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '15px', color: 'var(--text-main)', lineHeight: '1.3' }}>
                  {tField(project, 'title')}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px', flex: 1 }}>
                  {tField(project, 'shortDesc')}
                </p>
                
                <button 
                  onClick={() => handleViewDetail(project)}
                  style={{ 
                    width: '100%', padding: '14px', borderRadius: '14px',
                    border: 'none', background: (project.id === 8 || project.id === 1) ? 'var(--primary)' : 'var(--text-main)', color: (project.id === 8 || project.id === 1) ? 'white' : 'var(--bg-color)',
                    fontWeight: 'bold', cursor: 'pointer', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', gap: '10px',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {project.id === 8 ? "Kunjungi Situs & Treasury" : project.id === 1 ? "Tonton Video & Treasury" : hasAccess ? "Detail & Treasury" : t('projects_btn_locked')}
                  {project.id === 8 || project.id === 1 ? <ArrowRight size={18} /> : hasAccess ? <ArrowRight size={18} /> : <Lock size={18} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED PROJECT TREASURY & Ecosystem modal */}
      {selectedProject && (() => {
        const tr = getProjectTreasury(selectedProject.id);

        return (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '20px'
        }}>
          <div className="animate-scale-in" style={{ 
            background: 'var(--bg-card)', width: '100%', maxWidth: '1100px', 
            borderRadius: '30px', overflow: 'hidden', position: 'relative',
            maxHeight: '92vh', display: 'flex', flexDirection: 'column',
            border: '1px solid var(--border-color)', color: 'var(--text-main)'
          }}>
            {/* Modal Close Button */}
            <button 
              onClick={() => setSelectedProject(null)}
              style={{ 
                position: 'absolute', top: '20px', right: '20px', zIndex: 100,
                width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            >
              <X size={20} color="#333" />
            </button>

            {/* Cover and header details */}
            <div style={{ 
              height: '180px', 
              background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url("${selectedProject.image}") center/cover no-repeat`,
              padding: '30px',
              display: 'flex',
              alignItems: 'flex-end',
              position: 'relative'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ padding: '4px 12px', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>{tField(selectedProject, 'status')}</span>
                  <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>{tField(selectedProject, 'category')}</span>
                  {selectedProject.project_code && (
                    <span style={{ padding: '4px 12px', background: '#e67700', color: 'white', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>{selectedProject.project_code}</span>
                  )}
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0 }}>{tField(selectedProject, 'title')}</h2>
              </div>
            </div>

            {/* Role Switcher for Demo Simulation */}
            <div style={{ padding: '15px 30px 0 30px' }}>
              <div style={{ 
                display: 'flex', gap: '10px', padding: '10px 15px', 
                background: 'rgba(0,0,0,0.03)', borderRadius: '12px', 
                alignItems: 'center', justifyContent: 'space-between',
                border: '1px dashed var(--border-color)', flexWrap: 'wrap'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                  ⚙️ Mode Simulasi (Demo):
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[
                    { id: 'donor', label: 'Pendukung (Publik)' },
                    { id: 'pm', label: 'Manajer Proyek (PM)' },
                    { id: 'bendahara', label: 'Bendahara / Admin' }
                  ].map(role => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      style={{
                        padding: '6px 12px', borderRadius: '8px', border: 'none',
                        background: selectedRole === role.id ? 'var(--primary)' : 'transparent',
                        color: selectedRole === role.id ? 'white' : 'var(--text-main)',
                        fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '0 30px', overflowX: 'auto', gap: '20px' }}>
              {[
                { id: 'explore', label: 'Eksplorasi', icon: <Info size={16} /> },
                { id: 'treasury', label: 'Kas & Treasury', icon: <Wallet size={16} /> },
                { id: 'funding', label: 'Pendanaan', icon: <Coins size={16} /> },
                { id: 'expenses', label: 'Pengeluaran', icon: <Folder size={16} /> },
                { id: 'milestone', label: 'Milestone & Tim', icon: <Award size={16} /> },
                { id: 'wallet', label: 'Wallet & Integrasi', icon: <Shield size={16} /> },
                { id: 'faq', label: 'FAQ', icon: <HelpCircle size={16} /> },
                { id: 'audit', label: 'Audit Trail', icon: <History size={16} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '15px 5px',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                    background: 'none',
                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div style={{ padding: '30px', flex: 1, overflowY: 'auto' }}>
              
              {/* TAB 1: EXPLORE / ABOUT */}
              {activeTab === 'explore' && (
                <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                  <div>
                    <h3 style={{ marginTop: 0, fontWeight: 'bold' }}>Tentang Proyek</h3>
                    <p style={{ lineHeight: '1.7', color: 'var(--text-muted)' }}>{tField(selectedProject, 'fullDesc')}</p>
                    
                    <h4 style={{ fontWeight: 'bold', marginTop: '24px' }}>Dampak Sosial & Ekologis</h4>
                    <p style={{ lineHeight: '1.7', color: 'var(--text-muted)' }}>{tField(selectedProject, 'impact')}</p>
                    
                    <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>ALAMAT DOMPET TREASURY</h4>
                      <code style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold', wordBreak: 'break-all' }}>{tr.wallet_address}</code>
                    </div>
                  </div>
                  
                  <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '30px' }}>
                    <h3 style={{ marginTop: 0, fontWeight: 'bold' }}>Progress Pendanaan</h3>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '5px' }}>{tr.progress}%</div>
                    
                    <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
                      <div style={{ width: `${tr.progress}%`, height: '100%', background: 'var(--primary)' }} />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DANA TERKUMPUL</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{formatIdr(tr.total_dana_masuk)}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>≈ {formatBmc(tr.total_dana_masuk)}</div>
                    </div>
                    
                    <div style={{ marginBottom: '30px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TARGET PENDANAAN</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{formatIdr(tr.target_dana)}</div>
                    </div>

                    <button 
                      onClick={() => setActiveTab('funding')}
                      style={{ 
                        width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                        background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                      }}
                    >
                      <Coins size={16} /> Dukung Proyek Ini
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: TREASURY & KAS (FINANCIAL LEDGER) */}
              {activeTab === 'treasury' && (
                <div className="animate-fade-in">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    {/* Dana Masuk Card */}
                    <div className="glass" style={{ padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>TOTAL DANA MASUK</span>
                        <TrendingUp size={20} color="#10b981" />
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981' }}>{formatIdr(tr.total_dana_masuk)}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>Tercatat transparan on-chain</div>
                    </div>

                    {/* Pengeluaran Card */}
                    <div className="glass" style={{ padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>TOTAL PENGELUARAN</span>
                        <TrendingDown size={20} color="#fa5252" />
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fa5252' }}>{formatIdr(tr.total_pengeluaran)}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>Berdasarkan invoice terverifikasi</div>
                    </div>

                    {/* Sisa Saldo Card */}
                    <div className="glass" style={{ padding: '20px', borderRadius: '20px', border: '1px solid var(--primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)' }}>SISA SALDO KAS</span>
                        <Wallet size={20} color="var(--primary)" />
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)' }}>{formatIdr(tr.saldo)}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>Saldo aktif siap alokasi</div>
                    </div>
                  </div>

                  <h3 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Alokasi Dana & Sub-Ledger Digital</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {Object.entries(tr.sub_ledgers || {}).map(([key, item]) => {
                      const ledgerPercent = Math.min(100, Math.round((item.spent / item.budget) * 100));
                      return (
                        <div key={key} style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ledgerPercent}% Terpakai</span>
                          </div>
                          
                          <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '15px' }}>
                            <div style={{ width: `${ledgerPercent}%`, height: '100%', background: ledgerPercent > 90 ? '#fa5252' : 'var(--primary)' }} />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <span>Terpakai: <strong>{formatIdr(item.spent)}</strong></span>
                            <span>Anggaran: <strong>{formatIdr(item.budget)}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: PENDANAAN (FUNDING LIST & FORM) */}
              {activeTab === 'funding' && (
                <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                  {/* Left Column: Funding History */}
                  <div>
                    <h3 style={{ marginTop: 0, fontWeight: 'bold', marginBottom: '20px' }}>Riwayat Pendukung</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {tr.funding.map((f, i) => (
                        <div key={i} style={{ padding: '15px 20px', background: 'rgba(0,0,0,0.02)', borderRadius: '15px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{f.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>{f.date} • {f.method}</div>
                            {f.notes && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '5px' }}>"{f.notes}"</div>}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '800', color: 'var(--primary)' }}>
                              {f.currency === 'IDR' ? formatIdr(f.amount) : `${f.amount} BMC`}
                            </div>
                            <code style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{f.tx}</code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Support Form */}
                  <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '30px' }}>
                    <h3 style={{ marginTop: 0, fontWeight: 'bold', marginBottom: '20px' }}>Kirim Dukungan Dana</h3>
                    <form onSubmit={handleSupportSubmit}>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>MATA UANG / UTILITY TOKEN</label>
                        <select 
                          value={supportCurrency} 
                          onChange={e => setSupportCurrency(e.target.value)}
                          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        >
                          <option value="IDR">IDR (Rupiah Fiat)</option>
                          <option value="BMC">BMC (BaMbooChain Token)</option>
                        </select>
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>NOMINAL DUKUNGAN</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            required
                            type="number" 
                            placeholder={supportCurrency === 'IDR' ? "Contoh: 1000000" : "Contoh: 100"} 
                            value={supportAmount}
                            onChange={e => setSupportAmount(e.target.value)}
                            style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 'bold' }}
                          />
                        </div>

                        {/* Presets */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                          {supportCurrency === 'IDR' ? (
                            [100000, 500000, 1000000].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setSupportAmount(val.toString())}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: supportAmount === val.toString() ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                                  background: supportAmount === val.toString() ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)',
                                  color: supportAmount === val.toString() ? 'var(--primary)' : 'var(--text-main)',
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              >
                                {formatIdr(val)}
                              </button>
                            ))
                          ) : (
                            [10, 50, 100].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setSupportAmount(val.toString())}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: supportAmount === val.toString() ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                                  background: supportAmount === val.toString() ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)',
                                  color: supportAmount === val.toString() ? 'var(--primary)' : 'var(--text-main)',
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              >
                                {val} BMC
                              </button>
                            ))
                          )}
                        </div>

                        {supportAmount && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '8px', fontWeight: 'bold' }}>
                            {supportCurrency === 'IDR' ? `Setara dengan: ${formatBmc(parseFloat(supportAmount))}` : `Setara dengan: ${formatIdr(parseFloat(supportAmount) * 17000)}`}
                          </div>
                        )}
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>METODE PEMBAYARAN</label>
                        <select 
                          value={supportMethod} 
                          onChange={e => setSupportMethod(e.target.value)}
                          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        >
                          {supportCurrency === 'IDR' ? (
                            <>
                              <option value="Transfer Bank">Transfer Bank VA</option>
                              <option value="bambuPAY">bambuPAY Escrow</option>
                            </>
                          ) : (
                            <>
                              <option value="MetaMask">MetaMask (Web3)</option>
                              <option value="TrustWallet">TrustWallet (Web3)</option>
                            </>
                          )}
                        </select>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>CATATAN / DOA</label>
                        <textarea 
                          placeholder="Tulis dukungan atau pesan Anda..." 
                          value={supportNotes}
                          onChange={e => setSupportNotes(e.target.value)}
                          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', minHeight: '80px', fontFamily: 'inherit' }}
                        />
                      </div>

                      <button 
                        type="submit" 
                        style={{ 
                          width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                          background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}
                      >
                        <Send size={16} /> Kirim Dana Dukungan
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 4: PENGELUARAN (EXPENSES LIST & SUBMIT) */}
              {activeTab === 'expenses' && (
                <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                  {/* Left Column: Expenses list */}
                  <div>
                    <h3 style={{ marginTop: 0, fontWeight: 'bold', marginBottom: '20px' }}>Catatan Pengeluaran Kas</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {tr.expenses.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>Belum ada pengeluaran dicatat.</div>
                      ) : tr.expenses.map((exp, i) => (
                        <div key={i} style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.05)', padding: '3px 8px', borderRadius: '6px', color: 'var(--text-muted)' }}>{exp.category}</span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '6px', color: 'var(--primary)', marginLeft: '8px' }}>{exp.subcategory}</span>
                              <h4 style={{ margin: '8px 0 5px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{exp.desc}</h4>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vendor: <strong>{exp.vendor}</strong> • Diajukan oleh: <strong>{exp.creator}</strong></div>
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: '800', color: '#fa5252', fontSize: '1.1rem' }}>-{formatIdr(exp.amount)}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{exp.date}</div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem' }}>
                              <span style={{ color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => alert("Membuka berkas invoice/nota " + exp.invoice)}><FileText size={14} /> {exp.invoice}</span>
                              <span style={{ color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => alert("Membuka bukti pembayaran " + exp.paymentProof)}><FileText size={14} /> {exp.paymentProof}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ 
                                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                                color: exp.status === 'Approved' ? '#10b981' : exp.status === 'Pending' ? '#e67700' : '#fa5252'
                              }}>
                                {exp.status === 'Approved' ? <CheckCircle2 size={16} /> : exp.status === 'Pending' ? <AlertCircle size={16} /> : <XCircle size={16} />}
                                Status: {exp.status}
                              </span>

                              {/* Simulating approval flow if role is Bendahara/Admin */}
                              {exp.status === 'Pending' && selectedRole === 'bendahara' && (
                                <div style={{ display: 'flex', gap: '5px', marginLeft: '10px' }}>
                                  <button 
                                    onClick={() => handleVerifyExpense(exp.id, true)} 
                                    style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: 'var(--primary)', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Setujui
                                  </button>
                                  <button 
                                    onClick={() => handleVerifyExpense(exp.id, false)} 
                                    style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: '#fa5252', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Tolak
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Submit Expense (only visible to PM/Bendahara mode) */}
                  <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '30px' }}>
                    {selectedRole === 'donor' ? (
                      <div style={{ padding: '25px', background: 'rgba(0,0,0,0.02)', borderRadius: '20px', border: '1px dashed var(--border-color)', textAlign: 'center' }}>
                        <Lock size={36} color="var(--text-muted)" style={{ margin: '0 auto 15px' }} />
                        <h4 style={{ fontWeight: 'bold', margin: '0 0 10px 0' }}>Menu Pengajuan Terkunci</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Menu pengajuan biaya hanya dapat diakses oleh internal tim proyek (Manajer Proyek).</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }} onClick={() => setSelectedRole('pm')}>Ganti Peran ke Manajer Proyek (Simulasi)</p>
                      </div>
                    ) : (
                      <div>
                        <h3 style={{ marginTop: 0, fontWeight: 'bold', marginBottom: '20px' }}>Ajukan Biaya / Pengeluaran</h3>
                        <form onSubmit={handleExpenseSubmit}>
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>KATEGORI BIAYA</label>
                            <select 
                              value={expenseCategory} 
                              onChange={e => setExpenseCategory(e.target.value)}
                              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                            >
                              <option value="Digital">Digital (Utilitas)</option>
                              <option value="Operasional">Operasional</option>
                              <option value="Pengembangan">Pengembangan</option>
                              <option value="Promosi">Promosi & Pemasaran</option>
                              <option value="Legal">Legal & Perizinan</option>
                            </select>
                          </div>

                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>SUB KATEGORI BIAYA</label>
                            <select 
                              value={expenseSubCategory} 
                              onChange={e => setExpenseSubCategory(e.target.value)}
                              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                            >
                              {expenseCategory === 'Digital' ? (
                                <>
                                  <option value="Domain">Domain</option>
                                  <option value="Hosting">Hosting / VPS</option>
                                  <option value="AI">AI Quota</option>
                                  <option value="API">API Integration</option>
                                </>
                              ) : expenseCategory === 'Operasional' ? (
                                <>
                                  <option value="Lapangan">Survey & Lapangan</option>
                                  <option value="Konsumsi">Konsumsi Tim</option>
                                  <option value="Transportasi">Transportasi</option>
                                </>
                              ) : expenseCategory === 'Pengembangan' ? (
                                <>
                                  <option value="Dev">Programmer</option>
                                  <option value="Desain">Desain UI/UX</option>
                                </>
                              ) : (
                                <>
                                  <option value="Marketing">Iklan & Sosmed</option>
                                  <option value="Legal">Perizinan / Notaris</option>
                                </>
                              )}
                            </select>
                          </div>

                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>NOMINAL PENGELUARAN (IDR)</label>
                            <input 
                              required
                              type="number" 
                              placeholder="Contoh: 500000" 
                              value={expenseAmount}
                              onChange={e => setExpenseAmount(e.target.value)}
                              style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 'bold' }}
                            />
                          </div>

                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>VENDOR / PENERIMA DANA</label>
                            <input 
                              required
                              type="text" 
                              placeholder="Contoh: CV Media Cipta" 
                              value={expenseVendor}
                              onChange={e => setExpenseVendor(e.target.value)}
                              style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                          </div>

                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>DESKRIPSI PENGGUNAAN</label>
                            <input 
                              required
                              type="text" 
                              placeholder="Keterangan pengeluaran..." 
                              value={expenseDesc}
                              onChange={e => setExpenseDesc(e.target.value)}
                              style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                            />
                          </div>

                          <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>UNGGAH BUKTI (MOCKUP INVOICE)</label>
                            <input 
                              type="file" 
                              style={{ fontSize: '0.8rem' }}
                              onChange={() => {}} 
                            />
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px' }}>Sistem akan memvalidasi metadata file bukti pengeluaran.</div>
                          </div>

                          <button 
                            type="submit" 
                            style={{ 
                              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                              background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}
                          >
                            <Plus size={16} /> Ajukan Pengeluaran
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: MILESTONE & TIM */}
              {activeTab === 'milestone' && (
                <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                  {/* Milestones list */}
                  <div>
                    <h3 style={{ marginTop: 0, fontWeight: 'bold', marginBottom: '20px' }}>Milestone Rencana Proyek</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {tr.milestones.map((mil, i) => (
                        <div key={i} style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{mil.id} - {mil.name}</span>
                            <span style={{ 
                              fontSize: '0.8rem', fontWeight: 'bold', 
                              color: mil.status === 'Selesai' ? '#10b981' : mil.status === 'Berjalan' ? '#e67700' : 'var(--text-muted)'
                            }}>{mil.status}</span>
                          </div>
                          
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 15px 0' }}>{mil.desc}</p>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1, marginRight: '20px' }}>
                              <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ width: `${mil.progress}%`, height: '100%', background: mil.progress === 100 ? '#10b981' : 'var(--primary)' }} />
                              </div>
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{mil.progress}%</span>
                          </div>

                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px' }}>Target Waktu: {mil.startDate} s/d {mil.endDate}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Members */}
                  <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '30px' }}>
                    <h3 style={{ marginTop: 0, fontWeight: 'bold', marginBottom: '20px' }}>Anggota Tim Proyek</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {tr.members.map((memb, i) => (
                        <div key={i} style={{ padding: '15px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ 
                            width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                          }}>
                            <User size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 'bold' }}>{memb.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{memb.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3 style={{ fontWeight: 'bold', marginTop: '35px', marginBottom: '20px' }}>Berkas Dokumen</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {tr.documents.map((doc, i) => (
                        <div key={i} style={{ padding: '12px 15px', background: 'rgba(0,0,0,0.02)', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => alert("Mengunduh berkas " + doc.name)}>{doc.name}</span>
                          <span style={{ fontSize: '0.75rem', background: '#eee', padding: '3px 8px', borderRadius: '5px', color: '#666', fontWeight: 'bold' }}>{doc.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: AUDIT TRAIL */}
              {activeTab === 'explore' && tr.activities && tr.activities.length > 0 && (
                <div style={{ marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Aktivitas & Log Lapangan</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {tr.activities.map((act, i) => (
                      <div key={i} style={{ padding: '15px 20px', background: 'rgba(0,0,0,0.01)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <h4 style={{ margin: 0, fontWeight: 'bold' }}>{act.title}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{act.date} • {act.location}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{act.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="animate-fade-in">
                  <h3 style={{ marginTop: 0, fontWeight: 'bold', marginBottom: '20px' }}>Audit Log & Riwayat Konsensus</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderLeft: '2px solid var(--border-color)', paddingLeft: '20px', marginLeft: '10px' }}>
                    {tr.audit_logs.map((log, i) => (
                      <div key={i} style={{ position: 'relative', paddingBottom: '10px' }}>
                        <div style={{ 
                          position: 'absolute', top: '2px', left: '-27px', 
                          width: '12px', height: '12px', borderRadius: '50%', 
                          background: 'var(--primary)', border: '2px solid var(--bg-card)'
                        }} />
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.timestamp}</div>
                        <div style={{ fontWeight: '500', marginTop: '3px' }}>{log.text}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Aktor: <strong>{log.actor}</strong></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: WALLET & INTEGRASI */}
              {activeTab === 'wallet' && (
                <div className="animate-fade-in">
                  <h3 style={{ marginTop: 0, fontWeight: 'bold', marginBottom: '20px' }}>Multi-Signature Wallet Proyek & Integrasi Ekosistem</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '30px' }}>
                    Setiap proyek di BaMbooChain memiliki dompet multi-signature yang terintegrasi secara modular dengan ekosistem utilitas. Saldo on-chain dapat digunakan untuk mendanai kebutuhan pariwisata, penelitian, penanaman, maupun operasional lapangan.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <div style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>SALDO BMC</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--primary)', marginTop: '8px' }}>
                        {selectedProject.id === 8 ? '4.411,76' : selectedProject.id === 1 ? '18.823,52' : '2.352,94'} BMC
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        ≈ {selectedProject.id === 8 ? formatIdr(75000000) : selectedProject.id === 1 ? formatIdr(320000000) : formatIdr(40000000)}
                      </div>
                    </div>

                    <div style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>SALDO USDT</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)', marginTop: '8px' }}>
                        {selectedProject.id === 8 ? '2.500' : selectedProject.id === 1 ? '10.000' : '500'} USDT
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Stablecoin cadangan proyek</div>
                    </div>

                    <div style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>SALDO PI (BAMBOO PI)</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)', marginTop: '8px' }}>
                        {selectedProject.id === 8 ? '10.000' : selectedProject.id === 1 ? '35.000' : '1.000'} PI
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Token reputasi validator</div>
                    </div>
                  </div>

                  <h3 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Alur Konversi & Utilitas Digital</h3>
                  <div style={{ padding: '25px', background: 'rgba(0,0,0,0.01)', borderRadius: '20px', border: '1px dashed var(--border-color)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                      <div>
                        <h4 style={{ fontWeight: 'bold', margin: '0 0 10px 0', color: 'var(--primary)' }}>1. Alokasi Dana Digital</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                          Pembayaran tagihan utilitas server, nama domain, kuota AI LLM RAG, dan API didanai langsung melalui kas terdesentralisasi proyek.
                        </p>
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 'bold', margin: '0 0 10px 0', color: 'var(--primary)' }}>2. Integrasi Modul SuperApp</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                          Penggunaan dana terhubung ke modul website utama, modul marketplace Bambupedia, KODIBA, BambooMeeting, dan sistem pemantauan Tobat Ekologi.
                        </p>
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 'bold', margin: '0 0 10px 0', color: 'var(--primary)' }}>3. Laporan Aktivitas & Oracle</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                          Setiap penukaran utilitas divalidasi oleh oracle BaMbooChain untuk memastikan layanan digital aktif dan benar-benar melayani kebutuhan proyek lapangan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: FAQ ACCORDION */}
              {activeTab === 'faq' && (
                <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <h3 style={{ marginTop: 0, fontWeight: 'bold', marginBottom: '25px', textAlign: 'center' }}>Pertanyaan Umum (FAQ) Transparansi Proyek</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <details className="glass" style={{ padding: '15px 20px', borderRadius: '15px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.01)' }}>
                      <summary style={{ fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', outline: 'none', userSelect: 'none' }}>
                        Bagaimana transparansi kas dijamin di BaMbooChain?
                      </summary>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '10px', margin: '10px 0 0 0' }}>
                        Semua dana masuk (baik dalam Rupiah fiat via escrow gateway maupun token utility BMC via smart contract) serta semua pengeluaran dicatat on-chain secara permanen. Laporan pengeluaran wajib mengunggah bukti invoice terverifikasi dan harus mendapat persetujuan Bendahara/Validator proyek sebelum saldo kas terdebet.
                      </p>
                    </details>

                    <details className="glass" style={{ padding: '15px 20px', borderRadius: '15px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.01)' }}>
                      <summary style={{ fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', outline: 'none', userSelect: 'none' }}>
                        Apa peran Bendahara & Validator dalam alur persetujuan?
                      </summary>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '10px', margin: '10px 0 0 0' }}>
                        Setiap pengajuan biaya oleh Project Manager (PM) berstatus pending sebelum divalidasi oleh Bendahara. Bendahara mencocokkan nota belanja fisik, vendor penerima, dan keaslian berkas dengan data yang diajukan sebelum memberikan persetujuan on-chain.
                      </p>
                    </details>

                    <details className="glass" style={{ padding: '15px 20px', borderRadius: '15px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.01)' }}>
                      <summary style={{ fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', outline: 'none', userSelect: 'none' }}>
                        Bagaimana dana BMC dikonversi menjadi utilitas digital?
                      </summary>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '10px', margin: '10px 0 0 0' }}>
                        Token BMC yang dialokasikan ke proyek dapat didepositkan untuk membayar biaya operasional digital di ekosistem super-app, seperti nama domain (.id), sewa VPS hosting, kuota AI LLM RAG, API pariwisata, dan platform pendaftaran ekowisata.
                      </p>
                    </details>

                    <details className="glass" style={{ padding: '15px 20px', borderRadius: '15px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.01)' }}>
                      <summary style={{ fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', outline: 'none', userSelect: 'none' }}>
                        Apakah donatur dapat membatalkan atau melacak dana mereka?
                      </summary>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '10px', margin: '10px 0 0 0' }}>
                        Setiap transaksi memiliki hash transaksi (tx_hash) unik yang dapat diverifikasi di explorer BaMbooChain. Dana yang terkumpul disimpan di alamat multi-signature proyek untuk menjamin keamanan dari penarikan sepihak tanpa konsensus validator.
                      </p>
                    </details>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )})}

      {/* LOCK MODAL */}
      {showLockModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100,
          padding: '20px'
        }}>
          <div className="animate-scale-in" style={{ 
            background: 'white', width: '100%', maxWidth: '450px', 
            borderRadius: '24px', padding: '40px', textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
          }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)',
              color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Lock size={40} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px' }}>{t('projects_modal_lock_title')}</h2>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '30px' }}>
              {t('projects_modal_lock_desc')}
            </p>

            {!isConnected ? (
              <button 
                onClick={connectWallet}
                style={{ 
                  width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                  background: 'var(--primary)', color: 'white', fontWeight: 'bold',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                }}
              >
                {t('projects_modal_lock_btn_wallet')}
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '15px', background: '#fff5f5', borderRadius: '12px', color: '#c53030', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  Saldo Anda: {rawBmcBalance} BMC
                </div>
                <a 
                  href="https://pancakeswap.finance" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    padding: '16px', borderRadius: '12px', border: '2px solid #eee',
                    color: 'var(--text-main)', fontWeight: 'bold', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                  }}
                >
                  {t('projects_modal_lock_btn_buy')} <ArrowRight size={18} />
                </a>
                
                <div style={{ textAlign: 'center', color: '#888', fontSize: '0.8rem', fontWeight: 'bold' }}>ATAU</div>
                
                <button 
                  onClick={() => navigate('/bamboochain/token-wallet')}
                  style={{ 
                    padding: '16px', borderRadius: '12px', border: 'none',
                    background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                  }}
                >
                  {t('projects_modal_lock_btn_fiat')} <ArrowRight size={18} />
                </button>
              </div>
            )}

            <button 
              onClick={() => setShowLockModal(false)}
              style={{ marginTop: '20px', background: 'none', border: 'none', color: '#888', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {t('projects_modal_lock_btn_cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
