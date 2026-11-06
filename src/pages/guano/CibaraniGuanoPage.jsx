import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Database, Leaf, Scale, Package, Factory,
  FlaskConical, BookOpen, ShoppingCart, QrCode, Wallet,
  PieChart, HeartHandshake, FileSpreadsheet, Settings,
  Bell, AlertTriangle, CheckCircle2, Lock, Download,
  Printer, Search, PlusCircle, RefreshCw, ExternalLink, Info
} from 'lucide-react';
import BackButton from '../../components/BackButton';
import { useGuanoStore } from '../../services/guano/guanoStore';

const SUBMENUS = [
  { id: 'DASHBOARD', label: '1. Dashboard', short: 'Dashboard', icon: <PieChart size={16} /> },
  { id: 'RESOURCES', label: '2. Resource Registry', short: 'Sumber Daya', icon: <Database size={16} /> },
  { id: 'CONSERVATION', label: '3. Conservation Tracker', short: 'Konservasi', icon: <Leaf size={16} /> },
  { id: 'HARVEST', label: '4. Harvest Management', short: 'Pengumpulan', icon: <Scale size={16} /> },
  { id: 'INVENTORY', label: '5. Raw Material Inventory', short: 'Stok Bahan', icon: <Package size={16} /> },
  { id: 'PRODUCTION', label: '6. Production Management', short: 'Produksi', icon: <Factory size={16} /> },
  { id: 'QUALITY', label: '7. Quality Assurance', short: 'Uji Mutu (QC)', icon: <FlaskConical size={16} /> },
  { id: 'CATALOG', label: '8. Product Catalog', short: 'Katalog Produk', icon: <BookOpen size={16} /> },
  { id: 'ORDERS', label: '9. Marketplace & Orders', short: 'Pesanan', icon: <ShoppingCart size={16} /> },
  { id: 'TRACEABILITY', label: '10. Supply Chain & QR', short: 'QR Traceability', icon: <QrCode size={16} /> },
  { id: 'LEDGER', label: '11. Financial Ledger', short: 'Keuangan', icon: <Wallet size={16} /> },
  { id: 'BENEFIT_SHARING', label: '12. Benefit Sharing', short: 'Bagi Manfaat', icon: <HeartHandshake size={16} /> },
  { id: 'IMPACT', label: '13. Impact Dashboard', short: 'Dampak ESG', icon: <ShieldCheck size={16} /> },
  { id: 'REPORTS', label: '14. Reports', short: 'Laporan', icon: <FileSpreadsheet size={16} /> },
  { id: 'SETTINGS', label: '15. Settings & Access', short: 'Hak Akses & Audit', icon: <Settings size={16} /> }
];

export default function CibaraniGuanoPage() {
  const {
    organizations,
    roles,
    activeRoleId,
    activeOrgId,
    getActiveRole,
    hasPermission,
    canAccessTab,
    switchRole,
    resourceSites,
    conservationLogs,
    harvestRecords,
    rawMaterialBatches,
    inventoryTransactions,
    productionBatches,
    qualityTests,
    products,
    orders,
    traceabilityTokens,
    financialTransactions,
    assumptionParams,
    benefitApprovals,
    notifications,
    auditLogs,
    markNotificationRead,
    addResourceSite,
    updateCustomaryApproval,
    addConservationMonitoring,
    requestHarvest,
    approveAndVerifyHarvest,
    adjustRawMaterialStock,
    createProductionBatch,
    submitQualityTest,
    createOrder,
    updateOrderStatus,
    addFinancialTransaction,
    approveFinancialTransaction,
    reverseFinancialTransaction,
    updateAssumptionParams,
    togglePartySimulationApproval
  } = useGuanoStore();

  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: string }
  const [searchQuery, setSearchQuery] = useState('');
  const [orgFilter, setOrgFilter] = useState('ALL');
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  // Form states
  const [newSiteForm, setNewSiteForm] = useState({
    resource_code: '',
    resource_name: '',
    general_region: 'Wilayah Adat Kasepuhan Cibarani, Kec. Sobang, Kab. Lebak, Banten',
    description: '',
    survey_status: 'Belum Disurvei',
    customary_approval_status: 'Menunggu Musyawarah Adat',
    estimated_guano_volume: '',
    sustainable_harvest_limit: ''
  });

  const [newConservationForm, setNewConservationForm] = useState({
    resource_id: 'RES-CBR-DEMO-02',
    monitoring_date: '2026-11-06',
    habitat_condition: '',
    bat_activity_observation: '',
    disturbance_level: 'Rendah',
    status: 'Normal',
    findings: '',
    recommendation: ''
  });

  const [newHarvestForm, setNewHarvestForm] = useState({
    resource_id: 'RES-CBR-DEMO-02',
    planned_date: '2026-11-06',
    requested_quota_kg: 150,
    collection_method: 'Pengumpulan manual permukaan luar di luar jam peka koloni',
    worker_count: 5,
    worker_hours: 20
  });

  const [stockAdjustForm, setStockAdjustForm] = useState({
    raw_batch_code: 'RMB-CBR-202611-01-DEMO',
    delta_kg: -10,
    reason: ''
  });

  const [newProdForm, setNewProdForm] = useState({
    raw_batch_code: 'RMB-CBR-202611-01-DEMO',
    product_code: 'CG-POWDER-01',
    product_name: 'Cibarani Guano Powder [DEMO]',
    formula_version: 'Formula ASPAI-v1.0 (Mesh 60)',
    input_weight_kg: 40,
    output_weight_kg: 35,
    drying_sieving_notes: 'Pengeringan rumah surya tertutup & pengayakan mesh 60'
  });

  const [newQaForm, setNewQaForm] = useState({
    prod_batch_code: 'PB-CBR-202611-01-DEMO',
    lab_name: 'Laboratorium Uji Tanah & Pupuk Terakreditasi (DEMO)',
    certificate_number: 'CERT-LAB-DEMO-2026-002',
    moisture_pct: '11.2',
    ph_val: '6.8',
    organic_c_pct: '18.5',
    p2o5_pct: '12.8',
    status: 'Lulus Uji (DEMO)',
    notes: 'Memenuhi spesifikasi parameter uji mutu yang disepakati.'
  });

  const [newOrderForm, setNewOrderForm] = useState({
    customer_name: '[DEMO] Kelompok Tani Anggur Lebak',
    customer_org: 'Mitra ASPAI Banten',
    product_code: 'CG-POWDER-01',
    quantity_units: 2
  });

  const [newLedgerForm, setNewLedgerForm] = useState({
    tx_type: 'EXPENSE',
    category: 'Biaya Tenaga Kerja Lokal',
    description: '',
    amount_idr: 50000,
    fund_source: 'Kas Operasional Badan Usaha (DEMO)',
    doc_reference: 'BKK-DEMO-009'
  });

  const [reversalReasons, setReversalReasons] = useState({});
  const [reportFilterType, setReportFilterType] = useState('ALL_SUMMARY');

  const activeRole = getActiveRole();
  const unreadNotifs = notifications.filter((n) => !n.is_read).length;

  const showBanner = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Derived KPI Metrics
  const kpi = useMemo(() => {
    const totalRawStockKg = rawMaterialBatches.reduce((acc, b) => acc + (Number(b.available_stock_kg) || 0), 0);
    const totalProdOutputKg = productionBatches.reduce((acc, b) => acc + (Number(b.output_weight_kg) || 0), 0);
    const readyProductKg = products.reduce((acc, p) => acc + (p.ready_for_sale ? Number(p.available_stock_kg) || 0 : 0), 0);
    const passedBatchesCount = productionBatches.filter((b) => b.ready_for_sale).length;
    const totalSalesIdr = orders
      .filter((o) => o.order_status !== 'Cancelled' && o.order_status !== 'Refunded')
      .reduce((acc, o) => acc + (Number(o.total_amount_idr) || 0), 0);

    const verifiedIncome = financialTransactions
      .filter((t) => (t.status === 'Approved' || t.status === 'Reconciled') && (t.tx_type === 'INCOME' || t.tx_type === 'GRANT_CSR'))
      .reduce((acc, t) => acc + Number(t.amount_idr || 0), 0);

    const verifiedExpense = financialTransactions
      .filter((t) => (t.status === 'Approved' || t.status === 'Reconciled') && t.tx_type === 'EXPENSE')
      .reduce((acc, t) => acc + Number(t.amount_idr || 0), 0);

    const conservationFundUsed = financialTransactions
      .filter((t) => t.category.toLowerCase().includes('konservasi'))
      .reduce((acc, t) => acc + Number(t.amount_idr || 0), 0);

    const totalWorkers = harvestRecords.reduce((acc, h) => acc + Number(h.worker_count || 0), 0);
    const totalWorkerHours = harvestRecords.reduce((acc, h) => acc + Number(h.worker_hours || 0), 0);
    const haltedSitesCount = resourceSites.filter(
      (s) => s.conservation_status === 'Risiko Tinggi' || s.conservation_status === 'Kegiatan Dihentikan'
    ).length;

    return {
      totalRawStockKg,
      totalProdOutputKg,
      readyProductKg,
      passedBatchesCount,
      totalSalesIdr,
      verifiedIncome,
      verifiedExpense,
      ledgerSurplus: verifiedIncome - verifiedExpense,
      conservationFundUsed,
      totalWorkers,
      totalWorkerHours,
      haltedSitesCount
    };
  }, [rawMaterialBatches, productionBatches, products, orders, financialTransactions, harvestRecords, resourceSites]);

  // Benefit Sharing Simulation Calculation (Assumption vs Actual Ledger)
  const benefitCalc = useMemo(() => {
    const monthlyGrossRev = assumptionParams.target_monthly_sales_kg * assumptionParams.avg_selling_price_per_kg_idr;
    const monthlyVarCost = assumptionParams.target_monthly_sales_kg * assumptionParams.variable_cost_per_kg_idr;
    const grossOperatingSurplus = monthlyGrossRev - monthlyVarCost - assumptionParams.monthly_fixed_cost_idr;
    const positiveSurplus = Math.max(0, grossOperatingSurplus);
    const taxAndReserve = Math.round(positiveSurplus * (assumptionParams.estimated_tax_and_reserve_pct / 100));
    const conservationFund = Math.round(positiveSurplus * (assumptionParams.conservation_fund_pct / 100));
    const netAllocatableSurplus = Math.max(
      0,
      positiveSurplus - taxAndReserve - conservationFund - Number(assumptionParams.separate_investor_financing_idr || 0)
    );

    const kasepuhanShare = Math.round(netAllocatableSurplus * (assumptionParams.kasepuhan_allocation_pct / 100));
    const aspaiShare = Math.round(netAllocatableSurplus * (assumptionParams.aspai_allocation_pct / 100));
    const ysnjProgramShare = Math.round(netAllocatableSurplus * (assumptionParams.ysnj_program_allocation_pct / 100));

    return {
      monthlyGrossRev,
      monthlyVarCost,
      grossOperatingSurplus,
      taxAndReserve,
      conservationFund,
      netAllocatableSurplus,
      kasepuhanShare,
      aspaiShare,
      ysnjProgramShare
    };
  }, [assumptionParams]);

  // Export CSV helper for Section 14 Reports
  const handleDownloadCsvReport = () => {
    const headers = ['Kategori Laporan', 'Kode / ID', 'Deskripsi / Nama', 'Status', 'Nilai / Kuantitas', 'Tanggal'];
    const rows = [
      ...resourceSites.map((r) => ['RESOURCE_SITE', r.resource_code, r.resource_name, r.survey_status, r.estimated_guano_volume ?? 'Belum Disurvei', r.created_at]),
      ...conservationLogs.map((c) => ['CONSERVATION', c.monitoring_id, c.resource_name, c.status, c.disturbance_level, c.monitoring_date]),
      ...harvestRecords.map((h) => ['HARVEST', h.harvest_id, h.resource_name, h.status, `${h.actual_weight_kg ?? h.approved_quota_kg} kg`, h.planned_date]),
      ...productionBatches.map((p) => ['PRODUCTION_BATCH', p.prod_batch_code, p.product_name, p.status, `${p.output_weight_kg} kg`, p.production_date]),
      ...financialTransactions.map((f) => ['FINANCIAL_LEDGER', f.tx_number, f.description, f.status, `Rp ${f.amount_idr}`, f.tx_date])
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Cibarani_Guano_${new Date().toISOString().slice(0, 10)}_DEMO.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showBanner('success', 'Laporan CSV Cibarani Guano berhasil diunduh.');
  };

  return (
    <div style={{
      paddingTop: 'var(--navbar-height, 145px)',
      paddingBottom: '90px',
      minHeight: '100vh',
      background: 'var(--bg-color, #f8fafc)',
      color: 'var(--text-main, #0f172a)'
    }}>
      <div style={{ maxWidth: '1260px', margin: '0 auto', padding: '0 18px' }}>
        <BackButton to="/" label="Kembali ke Beranda BaMbooChain" />

        {/* ── MODE DEMO & KONSERVASI TOP BANNER ── */}
        <div className="guano-top-warning-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 500px' }}>
            <Info size={20} style={{ flexShrink: 0 }} />
            <span>
              <strong>PERINGATAN MODE DEMO & DATA ASUMSI:</strong> Seluruh data contoh berlabel <code>[DEMO]</code> dan parameter rencana bisnis berlabel <code>[ASUMSI — BELUM DISEPAKATI]</code>. Volume guano aktual Cibarani berstatus <strong>Belum Disurvei</strong>. Koordinat gua dirahasiakan demi perlindungan koloni kelelawar.
            </span>
          </div>
          <Link
            to="/cibarani-guano/trace/CG-TRC-9F4A2C8E1B7D"
            className="guano-banner-btn"
          >
            🔍 Uji Halaman Publik QR Traceability
          </Link>
        </div>

        {/* ── HERO HEADER MODUL CIBARANI GUANO ── */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 55%, #0f172a 100%)',
          color: '#ffffff',
          borderRadius: '26px',
          padding: '28px',
          marginBottom: '22px',
          boxShadow: '0 14px 36px rgba(6, 78, 59, 0.22)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ maxWidth: '740px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.25)',
                  color: '#a7f3d0',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '900'
                }}>
                  KLUSTER 4: PETANI MILENIAL • BIOFERTILIZER & CONSERVATION GOVERNANCE
                </span>
                <span style={{
                  background: 'rgba(254, 240, 138, 0.2)',
                  color: '#fef08a',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '900'
                }}>
                  ASPAI × KASEPUHAN CIBARANI × YSNJ
                </span>
              </div>

              <h1 style={{ fontSize: '2.1rem', fontWeight: '900', margin: '0 0 6px', color: '#ffffff', letterSpacing: '-0.5px' }}>
                CIBARANI GUANO
              </h1>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#6ee7b7', marginBottom: '10px' }}>
                Biofertilizer, Traceability & Community Benefit Management
              </div>
              <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
                Sistem tata kelola sumber daya guano kelelawar berbasis konservasi, persetujuan adat Kasepuhan Cibarani, kendali mutu laboratorium ASPAI, ketertelusuran QR, dan transparansi pembagian manfaat masyarakat.
              </p>
            </div>

            {/* RBAC Role Switcher & Notification Trigger */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(8px)',
              padding: '16px',
              borderRadius: '18px',
              border: '1px solid rgba(167, 243, 208, 0.25)',
              minWidth: '290px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#a7f3d0', letterSpacing: '0.5px' }}>
                  SIMULASI HAK AKSES (12 ROLE RBAC)
                </span>
                <button
                  type="button"
                  onClick={() => setShowNotifDrawer(!showNotifDrawer)}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '5px 10px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Bell size={14} /> Notifikasi ({unreadNotifs})
                </button>
              </div>

              <select
                value={activeRoleId}
                onChange={(e) => {
                  switchRole(e.target.value);
                  const targetRole = roles.find((r) => r.role_id === e.target.value);
                  if (targetRole && !targetRole.allowed_tabs.includes(activeTab)) {
                    setActiveTab('DASHBOARD');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #10b981',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  marginBottom: '6px'
                }}
              >
                {roles.map((r) => (
                  <option key={r.role_id} value={r.role_id}>
                    {r.label} ({r.org_id.replace('ORG-', '')})
                  </option>
                ))}
              </select>

              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                Organisasi Aktif: <strong>{activeOrgId}</strong> — {activeRole?.description}
              </div>
            </div>
          </div>

          {/* In-App Notifications Drawer */}
          {showNotifDrawer && (
            <div style={{
              marginTop: '16px',
              background: '#0f172a',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid #334155'
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#6ee7b7', marginBottom: '10px' }}>
                Notifikasi Sistem Cibarani Guano ({notifications.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.map((n) => (
                  <div
                    key={n.notif_id}
                    onClick={() => markNotificationRead(n.notif_id)}
                    style={{
                      background: n.is_read ? 'rgba(255,255,255,0.04)' : 'rgba(16, 185, 129, 0.14)',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#ffffff' }}>{n.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{n.message}</div>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#6ee7b7', fontWeight: '800', whiteSpace: 'nowrap' }}>
                      {n.is_read ? 'Dibaca' : 'Baru • Klik Tandai'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div style={{
            background: feedback.type === 'error' ? '#fee2e2' : '#d1fae5',
            color: feedback.type === 'error' ? '#991b1b' : '#065f46',
            border: `1.5px solid ${feedback.type === 'error' ? '#ef4444' : '#10b981'}`,
            padding: '14px 18px',
            borderRadius: '14px',
            marginBottom: '18px',
            fontWeight: '800',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {feedback.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* ── 15 SUBMENU NAVIGATION BAR (Filtered by Role Permission) ── */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '10px',
          marginBottom: '22px'
        }}>
          {SUBMENUS.map((tab) => {
            const allowed = canAccessTab(tab.id);
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                disabled={!allowed}
                onClick={() => allowed && setActiveTab(tab.id)}
                title={allowed ? tab.label : `Role ${activeRole?.label} tidak memiliki akses ke menu ini`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: active ? '2px solid #059669' : '1px solid var(--border-color, #cbd5e1)',
                  background: active ? '#047857' : allowed ? 'var(--bg-card, #ffffff)' : 'var(--bg-secondary, #e2e8f0)',
                  color: active ? '#ffffff' : allowed ? 'var(--text-main, #0f172a)' : '#94a3b8',
                  fontWeight: '800',
                  fontSize: '0.78rem',
                  cursor: allowed ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap',
                  opacity: allowed ? 1 : 0.55
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {!allowed && <Lock size={12} />}
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 1: DASHBOARD (6.1)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'DASHBOARD' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Filter Bar */}
            <div style={{
              background: 'var(--bg-card, #ffffff)',
              padding: '14px 18px',
              borderRadius: '18px',
              border: '1px solid var(--border-color, #cbd5e1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>Filter Entitas Kolaborator:</span>
                <select
                  value={orgFilter}
                  onChange={(e) => setOrgFilter(e.target.value)}
                  style={{ padding: '7px 12px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', fontWeight: '700', fontSize: '0.8rem' }}
                >
                  <option value="ALL">Semua Organisasi (ASPAI, Kasepuhan, YSNJ, BUP)</option>
                  {organizations.map((o) => (
                    <option key={o.org_id} value={o.org_id}>{o.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #64748b)', fontWeight: '700' }}>
                Zona Waktu: WIB (Asia/Jakarta) • Role Aktif: <strong>{activeRole?.label}</strong>
              </div>
            </div>

            {/* 11 Kartu Metrik Utama (Sesuai Bagian 6.1) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(225px, 1fr))',
              gap: '14px'
            }}>
              <div style={{ background: 'var(--bg-card, #ffffff)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#047857' }}>1. SUMBER DAYA TERDAFTAR</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', margin: '4px 0' }}>{resourceSites.length} Lokasi</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                  Situs Utama Cibarani: <strong>Belum Disurvei</strong>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card, #ffffff)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#047857' }}>2. STATUS KONSERVASI & ADAT</div>
                <div style={{ fontSize: '1.35rem', fontWeight: '900', margin: '4px 0', color: kpi.haltedSitesCount > 0 ? '#dc2626' : '#059669' }}>
                  {kpi.haltedSitesCount > 0 ? `${kpi.haltedSitesCount} Zona Dihentikan` : 'Terkendali (Normal)'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                  {conservationLogs.length} log monitoring tercatat
                </div>
              </div>

              <div style={{ background: 'var(--bg-card, #ffffff)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#047857' }}>3. PENGUMPULAN DISETUJUI (DEMO)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', margin: '4px 0' }}>
                  {harvestRecords.filter((h) => h.status === 'VERIFIED').reduce((a, b) => a + (b.actual_weight_kg || 0), 0)} kg
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                  Dari {harvestRecords.length} permohonan pengumpulan
                </div>
              </div>

              <div style={{ background: 'var(--bg-card, #ffffff)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#047857' }}>4. BAHAN BAKU TERSEDIA</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', margin: '4px 0' }}>{kpi.totalRawStockKg} kg</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                  {rawMaterialBatches.length} batch bahan baku aktif
                </div>
              </div>

              <div style={{ background: 'var(--bg-card, #ffffff)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#047857' }}>5. TOTAL PRODUKSI & BATCH LULUS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', margin: '4px 0' }}>
                  {kpi.totalProdOutputKg} kg ({kpi.passedBatchesCount} Batch)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                  Produk siap jual: {kpi.readyProductKg} kg
                </div>
              </div>

              <div style={{ background: 'var(--bg-card, #ffffff)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#b45309' }}>6. PENJUALAN & PESANAN (DEMO)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', margin: '4px 0', color: '#d97706' }}>
                  Rp {kpi.totalSalesIdr.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                  {orders.length} pesanan • {traceabilityTokens.length} QR Token Aktif
                </div>
              </div>

              <div style={{ background: 'var(--bg-card, #ffffff)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#0369a1' }}>7. DANA KONSERVASI & PARTISIPASI</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', margin: '4px 0', color: '#0284c7' }}>
                  Rp {kpi.conservationFundUsed.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                  {kpi.totalWorkers} warga lokal ({kpi.totalWorkerHours} jam kerja tercatat)
                </div>
              </div>

              <div style={{ background: 'var(--bg-card, #ffffff)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#7c3aed' }}>8. SIMULASI MANFAAT (ASUMSI)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', margin: '4px 0', color: '#6d28d9' }}>
                  50% : 30% : 20%
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted, #64748b)' }}>
                  Kasepuhan • ASPAI • Alokasi Program YSNJ (+10% Konservasi)
                </div>
              </div>
            </div>

            {/* 4 Pilar Kolaborasi & Aktivitas Terbaru */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
              <div style={{ background: 'var(--bg-card, #ffffff)', padding: '22px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <h3 style={{ fontSize: '1.08rem', fontWeight: '900', margin: '0 0 12px' }}>
                  Model Kolaborasi 4 Pihak Cibarani Guano
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {organizations
                    .filter((o) => orgFilter === 'ALL' || o.org_id === orgFilter)
                    .map((org) => (
                      <div key={org.org_id} style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '0.86rem', color: '#047857' }}>{org.name}</strong>
                          <span style={{ fontSize: '0.68rem', fontWeight: '900', background: '#fef3c7', color: '#92400e', padding: '2px 7px', borderRadius: '6px' }}>
                            DEMO
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.45 }}>
                          {org.role_summary}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div style={{ background: 'var(--bg-card, #ffffff)', padding: '22px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <h3 style={{ fontSize: '1.08rem', fontWeight: '900', margin: '0 0 12px' }}>
                  Jejak Audit & Aktivitas Operasional Terbaru
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.log_id} style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: '900', color: '#047857', marginBottom: '3px' }}>
                        <span>{log.action} ({log.actor_role})</span>
                        <span>{new Date(log.timestamp).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-main, #334155)' }}>{log.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 2: RESOURCE REGISTRY (6.2)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'RESOURCES' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card, #ffffff)', padding: '24px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 4px' }}>
                    2. Resource Registry — Data Sumber Daya & Persetujuan Adat
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)' }}>
                    Koordinat spesifik gua dan koloni kelelawar dienkripsi/dirahasiakan. Volume yang belum disurvei wajib dikosongkan (`Belum Disurvei`).
                  </div>
                </div>
                <span style={{ background: '#0f172a', color: '#34d399', padding: '6px 12px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: '900' }}>
                  🔒 PROTEKSI LOKASI GUA AKTIF
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {resourceSites.map((site) => (
                  <div key={site.resource_id} style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    padding: '18px',
                    borderRadius: '18px',
                    border: site.conservation_status === 'Normal' ? '1.5px solid #10b981' : '2px solid #dc2626'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <code style={{ background: '#064e3b', color: '#a7f3d0', padding: '3px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: '900' }}>
                        {site.resource_code}
                      </code>
                      <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#b45309', background: '#fef3c7', padding: '3px 8px', borderRadius: '6px' }}>
                        {site.survey_status}
                      </span>
                    </div>

                    <div style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '4px' }}>{site.resource_name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #64748b)', marginBottom: '10px' }}>
                      📍 Wilayah Umum: {site.general_region}
                    </div>

                    <div style={{ fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '10px' }}>{site.description}</div>

                    <div style={{ background: 'var(--bg-card, #ffffff)', padding: '10px 12px', borderRadius: '12px', fontSize: '0.76rem', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                      <div>• <strong>Estimasi Volume Guano:</strong> {site.estimated_guano_volume === null ? 'Belum Disurvei (Data Kosong)' : `${site.estimated_guano_volume} ${site.volume_unit}`}</div>
                      <div>• <strong>Batas Panen Lestari (Kuota):</strong> {site.sustainable_harvest_limit === null ? 'Belum Ditetapkan' : `${site.sustainable_harvest_limit} kg`}</div>
                      <div>• <strong>Persetujuan Adat Kasepuhan:</strong> <span style={{ color: '#047857', fontWeight: '800' }}>{site.customary_approval_status}</span></div>
                      <div>• <strong>Status Konservasi:</strong> <span style={{ color: site.conservation_status === 'Normal' ? '#059669' : '#dc2626', fontWeight: '900' }}>{site.conservation_status}</span></div>
                    </div>

                    {hasPermission('APPROVE_CUSTOMARY') && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const res = updateCustomaryApproval(site.resource_id, 'Disetujui Musyawarah Adat (DEMO)', site.sustainable_harvest_limit || 300);
                            if (res.ok) showBanner('success', `Persetujuan adat untuk ${site.resource_code} berhasil disahkan.`);
                          }}
                          style={{ background: '#059669', color: '#ffffff', border: 'none', padding: '7px 12px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: '800', cursor: 'pointer' }}
                        >
                          ✓ Sahkan Persetujuan Adat
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const res = updateCustomaryApproval(site.resource_id, 'Ditangguhkan Adat / Evaluasi Ulang', 0);
                            if (res.ok) showBanner('error', `Persetujuan adat untuk ${site.resource_code} ditangguhkan.`);
                          }}
                          style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '7px 12px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: '800', cursor: 'pointer' }}
                        >
                          Tangguhkan Izin Adat
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Form Tambah Resource Site */}
              <div style={{ borderTop: '2px dashed var(--border-color, #cbd5e1)', paddingTop: '18px' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '900', margin: '0 0 12px' }}>
                  + Registrasi Area Survei / Sumber Daya Baru (Tanpa Koordinat Publik)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Kode Unik Internal (mis. CBR-KARST-03)"
                    value={newSiteForm.resource_code}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, resource_code: e.target.value })}
                    style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                  />
                  <input
                    type="text"
                    placeholder="Nama Area (mis. [DEMO] Blok Lembah Barat)"
                    value={newSiteForm.resource_name}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, resource_name: e.target.value })}
                    style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                  />
                  <input
                    type="number"
                    placeholder="Volume (Kosongkan jika Belum Disurvei)"
                    value={newSiteForm.estimated_guano_volume}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, estimated_guano_volume: e.target.value })}
                    style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                  />
                  <input
                    type="number"
                    placeholder="Batas Panen Lestari (kg)"
                    value={newSiteForm.sustainable_harvest_limit}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, sustainable_harvest_limit: e.target.value })}
                    style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!newSiteForm.resource_name) {
                      showBanner('error', 'Nama area sumber daya wajib diisi.');
                      return;
                    }
                    const res = addResourceSite(newSiteForm);
                    if (!res.ok) showBanner('error', res.error);
                    else {
                      showBanner('success', `Lokasi sumber daya ${res.site.resource_code} berhasil didaftarkan.`);
                      setNewSiteForm({ ...newSiteForm, resource_code: '', resource_name: '', estimated_guano_volume: '', sustainable_harvest_limit: '' });
                    }
                  }}
                  style={{ background: '#047857', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Simpan ke Resource Registry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 3: CONSERVATION TRACKER (6.3)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'CONSERVATION' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card, #ffffff)', padding: '24px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 6px' }}>
                3. Conservation Tracker — Monitoring Ekologi & Koloni Kelelawar
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: '0 0 16px' }}>
                Apabila status disetel ke <strong>Risiko Tinggi</strong> atau <strong>Kegiatan Dihentikan</strong>, sistem secara otomatis memblokir pengajuan dan persetujuan pengumpulan guano pada lokasi tersebut.
              </p>

              {/* Form Input Monitoring Konservasi */}
              <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-color, #cbd5e1)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '900', marginBottom: '12px' }}>
                  Catat Observasi Monitoring Konservasi Baru
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Lokasi Sumber Daya</label>
                    <select
                      value={newConservationForm.resource_id}
                      onChange={(e) => setNewConservationForm({ ...newConservationForm, resource_id: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                    >
                      {resourceSites.map((s) => (
                        <option key={s.resource_id} value={s.resource_id}>{s.resource_code} — {s.resource_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Status Konservasi (Validasi Petugas/Ahli)</label>
                    <select
                      value={newConservationForm.status}
                      onChange={(e) => setNewConservationForm({ ...newConservationForm, status: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', fontWeight: '800' }}
                    >
                      <option value="Normal">Normal (Aman Terkendali)</option>
                      <option value="Perlu Perhatian">Perlu Perhatian (Evaluasi Berkala)</option>
                      <option value="Risiko Tinggi">Risiko Tinggi (Kunci Pengumpulan Baru!)</option>
                      <option value="Kegiatan Dihentikan">Kegiatan Dihentikan (Moratorium Penuh!)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Kondisi Habitat</label>
                    <input
                      type="text"
                      placeholder="Catatan kelembaban, mulut gua, vegetasi..."
                      value={newConservationForm.habitat_condition}
                      onChange={(e) => setNewConservationForm({ ...newConservationForm, habitat_condition: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Observasi Aktivitas Kelelawar Non-Intrusif</label>
                    <input
                      type="text"
                      placeholder="Pengamatan luar gua tanpa gangguan cahaya/suara..."
                      value={newConservationForm.bat_activity_observation}
                      onChange={(e) => setNewConservationForm({ ...newConservationForm, bat_activity_observation: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!newConservationForm.habitat_condition || !newConservationForm.bat_activity_observation) {
                      showBanner('error', 'Kondisi habitat dan observasi kelelawar wajib diisi.');
                      return;
                    }
                    const res = addConservationMonitoring(newConservationForm);
                    if (!res.ok) showBanner('error', res.error);
                    else {
                      showBanner(
                        newConservationForm.status === 'Risiko Tinggi' || newConservationForm.status === 'Kegiatan Dihentikan' ? 'error' : 'success',
                        `Log monitoring konservasi berhasil dicatat dengan status: ${newConservationForm.status}.`
                      );
                      setNewConservationForm({ ...newConservationForm, habitat_condition: '', bat_activity_observation: '' });
                    }
                  }}
                  style={{ background: '#047857', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Simpan Log Monitoring Konservasi
                </button>
              </div>

              {/* Daftar Riwayat Monitoring */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {conservationLogs.map((log) => (
                  <div key={log.monitoring_id} style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    padding: '16px',
                    borderRadius: '16px',
                    border: log.status === 'Risiko Tinggi' || log.status === 'Kegiatan Dihentikan' ? '2px solid #dc2626' : '1px solid var(--border-color, #cbd5e1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{log.monitoring_id} • {log.resource_name}</strong>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '900',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: log.status === 'Normal' ? '#d1fae5' : log.status === 'Perlu Perhatian' ? '#fef3c7' : '#fee2e2',
                        color: log.status === 'Normal' ? '#047857' : log.status === 'Perlu Perhatian' ? '#b45309' : '#991b1b'
                      }}>
                        Status: {log.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', marginBottom: '4px' }}><strong>Kondisi Habitat:</strong> {log.habitat_condition}</div>
                    <div style={{ fontSize: '0.8rem', marginBottom: '4px' }}><strong>Observasi Koloni:</strong> {log.bat_activity_observation}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                      Tanggal: {log.monitoring_date} • Pengamat: {log.observer} • Rekomendasi: {log.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 4: HARVEST MANAGEMENT (6.4)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'HARVEST' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card, #ffffff)', padding: '24px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 6px' }}>
                4. Harvest Management — Pengumpulan Guano Terkontrol
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: '0 0 16px' }}>
                Validasi sistem otomatis: menolak pengajuan apabila (1) status konservasi melarang kegiatan, (2) belum ada persetujuan adat Kasepuhan, atau (3) melebihi batas kuota panen lestari.
              </p>

              {/* Form Permohonan Pengumpulan */}
              <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-color, #cbd5e1)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '900', marginBottom: '12px' }}>
                  Ajukan Jadwal Pengumpulan Guano (Field Officer)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Pilih Situs Sumber Daya</label>
                    <select
                      value={newHarvestForm.resource_id}
                      onChange={(e) => setNewHarvestForm({ ...newHarvestForm, resource_id: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                    >
                      {resourceSites.map((s) => (
                        <option key={s.resource_id} value={s.resource_id}>
                          {s.resource_code} ({s.conservation_status} | Kuota: {s.sustainable_harvest_limit ?? 'Belum Ada'} kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Kuota Diajukan (kg)</label>
                    <input
                      type="number"
                      value={newHarvestForm.requested_quota_kg}
                      onChange={(e) => setNewHarvestForm({ ...newHarvestForm, requested_quota_kg: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Jumlah Tenaga Kerja Warga Lokal</label>
                    <input
                      type="number"
                      value={newHarvestForm.worker_count}
                      onChange={(e) => setNewHarvestForm({ ...newHarvestForm, worker_count: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Metode Pengumpulan</label>
                    <input
                      type="text"
                      value={newHarvestForm.collection_method}
                      onChange={(e) => setNewHarvestForm({ ...newHarvestForm, collection_method: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const res = requestHarvest(newHarvestForm);
                    if (!res.ok) showBanner('error', res.error);
                    else showBanner('success', `Permohonan pengumpulan ${res.harvest.harvest_id} berhasil diajukan.`);
                  }}
                  style={{ background: '#047857', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Ajukan Permohonan Pengumpulan
                </button>
              </div>

              {/* Daftar Permohonan & Realisasi Pengumpulan */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {harvestRecords.map((hrv) => (
                  <div key={hrv.harvest_id} style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.92rem' }}>{hrv.harvest_id} • {hrv.resource_name}</strong>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: '900',
                          background: hrv.status === 'VERIFIED' ? '#d1fae5' : '#fef3c7',
                          color: hrv.status === 'VERIFIED' ? '#047857' : '#b45309',
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}>
                          {hrv.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem' }}>
                        Kuota Disetujui: <strong>{hrv.approved_quota_kg} kg</strong> • Berat Aktual: <strong>{hrv.actual_weight_kg ?? 'Menunggu Verifikasi'} kg</strong> • Batch Bahan Baku: <code>{hrv.raw_batch_code || 'Belum Dibuat'}</code>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                        Metode: {hrv.collection_method} • Tenaga Kerja Lokal: {hrv.worker_count} orang ({hrv.worker_hours} jam)
                      </div>
                    </div>

                    {hrv.status !== 'VERIFIED' && (
                      <button
                        type="button"
                        onClick={() => {
                          const res = approveAndVerifyHarvest(hrv.harvest_id, hrv.approved_quota_kg);
                          if (!res.ok) showBanner('error', res.error);
                          else showBanner('success', `Pengumpulan diverifikasi! Batch Bahan Baku ${res.rawBatchCode} otomatis masuk ke gudang.`);
                        }}
                        style={{ background: '#059669', color: '#ffffff', border: 'none', padding: '9px 14px', borderRadius: '10px', fontWeight: '800', fontSize: '0.78rem', cursor: 'pointer' }}
                      >
                        ✓ Setujui, Verifikasi & Buat Batch Bahan Baku
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 5: RAW MATERIAL INVENTORY (6.5)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'INVENTORY' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card, #ffffff)', padding: '24px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 6px' }}>
                5. Raw Material Inventory — Persediaan Bahan Baku Guano (Satuan Standar: kg)
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: '0 0 16px' }}>
                Stok bahan baku tidak boleh negatif. Seluruh penerimaan, pemakaian produksi, dan penyesuaian stok tercatat di buku mutasi.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '22px' }}>
                {rawMaterialBatches.map((b) => (
                  <div key={b.raw_batch_id} style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1.5px solid #10b981' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: '900', color: '#047857' }}>{b.raw_batch_code}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '900', margin: '4px 0' }}>
                      Tersedia: {b.available_stock_kg} {b.unit}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #64748b)' }}>
                      Berat Masuk Awal: {b.initial_weight_kg} kg • Tanggal Terima: {b.received_date}
                    </div>
                    <div style={{ fontSize: '0.76rem', marginTop: '4px' }}>
                      Lokasi Simpan: <strong>{b.storage_location}</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Penyesuaian Stok dengan Alasan Wajib */}
              <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #cbd5e1)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '900', marginBottom: '10px' }}>
                  Penyesuaian Stok Bahan Baku (Wajib Alasan & Proteksi Anti-Negatif)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                  <select
                    value={stockAdjustForm.raw_batch_code}
                    onChange={(e) => setStockAdjustForm({ ...stockAdjustForm, raw_batch_code: e.target.value })}
                    style={{ padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                  >
                    {rawMaterialBatches.map((b) => (
                      <option key={b.raw_batch_code} value={b.raw_batch_code}>{b.raw_batch_code} (Stok: {b.available_stock_kg} kg)</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Perubahan kg (mis. -10 atau +15)"
                    value={stockAdjustForm.delta_kg}
                    onChange={(e) => setStockAdjustForm({ ...stockAdjustForm, delta_kg: e.target.value })}
                    style={{ padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                  />
                  <input
                    type="text"
                    placeholder="Alasan penyesuaian stok (wajib diisi)..."
                    value={stockAdjustForm.reason}
                    onChange={(e) => setStockAdjustForm({ ...stockAdjustForm, reason: e.target.value })}
                    style={{ padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const res = adjustRawMaterialStock(stockAdjustForm.raw_batch_code, stockAdjustForm.delta_kg, stockAdjustForm.reason);
                    if (!res.ok) showBanner('error', res.error);
                    else {
                      showBanner('success', 'Mutasi penyesuaian stok berhasil dicatat.');
                      setStockAdjustForm({ ...stockAdjustForm, reason: '' });
                    }
                  }}
                  style={{ background: '#047857', color: '#ffffff', border: 'none', padding: '9px 16px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Proses Mutasi Stok
                </button>
              </div>

              {/* Riwayat Mutasi */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: '900', margin: '0 0 10px' }}>Riwayat Mutasi Bahan Baku</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {inventoryTransactions.map((m) => (
                  <div key={m.mutation_id} style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-color, #e2e8f0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.8rem' }}>
                    <div>
                      <strong>{m.raw_batch_code}</strong> • <span style={{ color: m.quantity_kg >= 0 ? '#059669' : '#d97706', fontWeight: '900' }}>{m.type} ({m.quantity_kg >= 0 ? `+${m.quantity_kg}` : m.quantity_kg} kg)</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>{m.reason} • Oleh: {m.actor}</div>
                    </div>
                    <div style={{ fontWeight: '900' }}>Saldo Akhir: {m.balance_after_kg} kg</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 6: PRODUCTION MANAGEMENT (6.6)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'PRODUCTION' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card, #ffffff)', padding: '24px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 6px' }}>
                6. Production Management — Rencana & Batch Produksi Biofertilizer
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: '0 0 16px' }}>
                Setiap batch produksi terhubung langsung ke batch bahan baku asalnya dan berstatus <code>Pending Quality Check</code> (dikunci dari penjualan) hingga lulus uji mutu di menu Quality Assurance.
              </p>

              {/* Form Buat Batch Produksi */}
              <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-color, #cbd5e1)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '900', marginBottom: '12px' }}>
                  Buat Batch Produksi Baru
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Batch Bahan Baku Asal</label>
                    <select
                      value={newProdForm.raw_batch_code}
                      onChange={(e) => setNewProdForm({ ...newProdForm, raw_batch_code: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                    >
                      {rawMaterialBatches.map((b) => (
                        <option key={b.raw_batch_code} value={b.raw_batch_code}>{b.raw_batch_code} (Tersedia: {b.available_stock_kg} kg)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Target Produk</label>
                    <select
                      value={newProdForm.product_code}
                      onChange={(e) => {
                        const prod = products.find((p) => p.product_code === e.target.value);
                        setNewProdForm({ ...newProdForm, product_code: e.target.value, product_name: prod ? `${prod.name} [DEMO]` : e.target.value });
                      }}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                    >
                      {products.map((p) => (
                        <option key={p.product_code} value={p.product_code}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Berat Input Bahan Baku (kg)</label>
                    <input
                      type="number"
                      value={newProdForm.input_weight_kg}
                      onChange={(e) => setNewProdForm({ ...newProdForm, input_weight_kg: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Berat Output Bersih (kg)</label>
                    <input
                      type="number"
                      value={newProdForm.output_weight_kg}
                      onChange={(e) => setNewProdForm({ ...newProdForm, output_weight_kg: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const res = createProductionBatch(newProdForm);
                    if (!res.ok) showBanner('error', res.error);
                    else showBanner('success', `Batch Produksi ${res.batch.prod_batch_code} dibuat dengan status Pending Quality Check.`);
                  }}
                  style={{ background: '#047857', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Simpan Batch Produksi & Kurangi Stok Bahan Baku
                </button>
              </div>

              {/* Daftar Batch Produksi */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {productionBatches.map((pb) => (
                  <div key={pb.prod_batch_id} style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    padding: '16px',
                    borderRadius: '16px',
                    border: pb.ready_for_sale ? '1.5px solid #10b981' : '1.5px solid #f59f00'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{pb.prod_batch_code} • {pb.product_name}</strong>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '900',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: pb.ready_for_sale ? '#d1fae5' : '#fef3c7',
                        color: pb.ready_for_sale ? '#047857' : '#b45309'
                      }}>
                        Status: {pb.status} | Ready for Sale: {pb.ready_for_sale ? 'YA (Lulus QC)' : 'TERKUNCI (Menunggu QC)'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
                      Bahan Baku Asal: <code>{pb.raw_batch_code}</code> • Input: <strong>{pb.input_weight_kg} kg</strong> → Output: <strong>{pb.output_weight_kg} kg</strong> (Susut Proses: {pb.process_loss_kg} kg)
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted, #64748b)' }}>
                      Formula: {pb.formula_version} • Pengeringan/Ayak: {pb.drying_sieving_notes} • Token QR: <code>{pb.trace_token || 'Belum Terbit'}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 7: QUALITY ASSURANCE (6.7)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'QUALITY' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card, #ffffff)', padding: '24px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 6px' }}>
                7. Quality Assurance — Pengujian Laboratorium & Pengesahan Mutu
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: '0 0 16px' }}>
                Sistem tidak mengarang ambang batas sepihak. Parameter diinput berdasarkan sertifikat laboratorium. Batch produk hanya berstatus <strong>Ready for Sale</strong> dan mendapatkan Token QR setelah disahkan lulus uji mutu.
              </p>

              {/* Form Input Uji Mutu */}
              <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-color, #cbd5e1)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '900', marginBottom: '12px' }}>
                  Registrasi Hasil Uji Laboratorium per Batch
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Pilih Batch Produksi</label>
                    <select
                      value={newQaForm.prod_batch_code}
                      onChange={(e) => setNewQaForm({ ...newQaForm, prod_batch_code: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                    >
                      {productionBatches.map((b) => (
                        <option key={b.prod_batch_code} value={b.prod_batch_code}>{b.prod_batch_code} ({b.status})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Nomor Sertifikat Lab</label>
                    <input
                      type="text"
                      value={newQaForm.certificate_number}
                      onChange={(e) => setNewQaForm({ ...newQaForm, certificate_number: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Kadar Air (%)</label>
                    <input
                      type="text"
                      value={newQaForm.moisture_pct}
                      onChange={(e) => setNewQaForm({ ...newQaForm, moisture_pct: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Nilai pH H2O</label>
                    <input
                      type="text"
                      value={newQaForm.ph_val}
                      onChange={(e) => setNewQaForm({ ...newQaForm, ph_val: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>C-Organik (%) & P2O5 (%)</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        value={newQaForm.organic_c_pct}
                        onChange={(e) => setNewQaForm({ ...newQaForm, organic_c_pct: e.target.value })}
                        placeholder="C-Org"
                        style={{ width: '50%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                      />
                      <input
                        type="text"
                        value={newQaForm.p2o5_pct}
                        onChange={(e) => setNewQaForm({ ...newQaForm, p2o5_pct: e.target.value })}
                        placeholder="P2O5"
                        style={{ width: '50%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Keputusan Quality Officer</label>
                    <select
                      value={newQaForm.status}
                      onChange={(e) => setNewQaForm({ ...newQaForm, status: e.target.value })}
                      style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', fontWeight: '800' }}
                    >
                      <option value="Lulus Uji (DEMO)">Lulus Uji (DEMO) — Buka Ready for Sale</option>
                      <option value="Perlu Pengujian Ulang">Perlu Pengujian Ulang — Kunci Penjualan</option>
                      <option value="Tidak Lulus">Tidak Lulus — Kunci Penjualan</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const res = submitQualityTest(newQaForm);
                    if (!res.ok) showBanner('error', res.error);
                    else showBanner('success', `Hasil uji mutu disimpan (${res.test.status}). ${res.traceToken ? `Token QR: ${res.traceToken}` : ''}`);
                  }}
                  style={{ background: '#047857', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Sahkan Hasil Uji Mutu & Perbarui Status Batch
                </button>
              </div>

              {/* Riwayat Hasil Uji */}
              {qualityTests.map((qt) => (
                <div key={qt.test_id} style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-color, #cbd5e1)', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>{qt.test_id} • Batch: {qt.prod_batch_code}</strong>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted, #64748b)' }}>
                        Lab: {qt.lab_name} • No. Sertifikat: <code>{qt.certificate_number}</code>
                      </div>
                    </div>
                    <span style={{ background: '#d1fae5', color: '#047857', padding: '4px 10px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: '900' }}>
                      {qt.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                    {qt.parameters.map((p, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-card, #ffffff)', padding: '8px 10px', borderRadius: '10px', border: '1px solid var(--border-color, #e2e8f0)', fontSize: '0.76rem' }}>
                        <div style={{ fontWeight: '800', color: 'var(--text-muted, #64748b)' }}>{p.name}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#047857' }}>{p.value} {p.unit}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted, #64748b)' }}>Batas: {p.spec_limit}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 8: PRODUCT CATALOG (6.8)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'CATALOG' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card, #ffffff)', padding: '24px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 6px' }}>
                8. Product Catalog — Katalog Produk Cibarani Guano
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: '0 0 18px' }}>
                Spesifikasi produk disajikan secara jujur berdasarkan hasil pengujian laboratorium per batch tanpa klaim agronomis berlebihan.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {products.map((prod) => (
                  <div key={prod.product_id} style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    padding: '20px',
                    borderRadius: '18px',
                    border: prod.ready_for_sale ? '2px solid #10b981' : '1px solid var(--border-color, #cbd5e1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <code style={{ background: '#064e3b', color: '#a7f3d0', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '900' }}>
                          {prod.product_code}
                        </code>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: '900',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: prod.ready_for_sale ? '#d1fae5' : '#fee2e2',
                          color: prod.ready_for_sale ? '#047857' : '#991b1b'
                        }}>
                          {prod.ready_for_sale ? '✓ READY FOR SALE (LULUS QC)' : '🔒 BELUM SIAP JUAL (MENUNGGU BATCH QC)'}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.1rem', fontWeight: '900', margin: '0 0 6px' }}>{prod.name}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', marginBottom: '10px', lineHeight: 1.5 }}>
                        {prod.description}
                      </div>

                      <div style={{ background: 'var(--bg-card, #ffffff)', padding: '10px 12px', borderRadius: '12px', fontSize: '0.76rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>• <strong>Kemasan & Berat Bersih:</strong> {prod.packaging_type} ({prod.net_weight_kg} kg)</div>
                        <div>• <strong>Harga Simulasi (ASUMSI):</strong> Rp {prod.price_idr.toLocaleString('id-ID')} / kemasan</div>
                        <div>• <strong>Stok Tersedia:</strong> {prod.available_stock_units} kemasan ({prod.available_stock_kg} kg)</div>
                        <div>• <strong>Batch Terhubung:</strong> <code>{prod.linked_batch_code}</code></div>
                        <div>• <strong>Petunjuk Penggunaan:</strong> {prod.usage_instructions}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!prod.ready_for_sale}
                      onClick={() => {
                        setNewOrderForm({ ...newOrderForm, product_code: prod.product_code });
                        setActiveTab('ORDERS');
                      }}
                      style={{
                        background: prod.ready_for_sale ? '#047857' : '#cbd5e1',
                        color: prod.ready_for_sale ? '#ffffff' : '#64748b',
                        border: 'none',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontWeight: '800',
                        fontSize: '0.8rem',
                        cursor: prod.ready_for_sale ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {prod.ready_for_sale ? 'Buat Pesanan Produk Ini →' : 'Terkunci hingga Ada Batch Lulus Uji'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 9: MARKETPLACE & ORDERS (6.9)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'ORDERS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card, #ffffff)', padding: '24px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 4px' }}>
                    9. Marketplace & Orders — Penjualan & Distribusi
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)' }}>
                    Terintegrasi dengan Marketplace BaMbooChain. Hanya produk yang lulus Quality Assurance yang dapat dipesan.
                  </div>
                </div>
                <Link
                  to="/bamboochain/marketplace"
                  style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#047857',
                    padding: '8px 14px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Buka Marketplace BaMbooChain <ExternalLink size={14} />
                </Link>
              </div>

              {/* Form Buat Pesanan */}
              <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-color, #cbd5e1)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '900', marginBottom: '12px' }}>
                  Catat Pesanan Pelanggan / Jaringan Petani ASPAI
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Nama Pelanggan / Kebun"
                    value={newOrderForm.customer_name}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customer_name: e.target.value })}
                    style={{ padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                  />
                  <select
                    value={newOrderForm.product_code}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, product_code: e.target.value })}
                    style={{ padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                  >
                    {products.map((p) => (
                      <option key={p.product_code} value={p.product_code}>
                        {p.name} ({p.ready_for_sale ? `Stok: ${p.available_stock_units}` : 'Terkunci QC'})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    placeholder="Jumlah Kemasan"
                    value={newOrderForm.quantity_units}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, quantity_units: e.target.value })}
                    style={{ padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const res = createOrder(newOrderForm);
                    if (!res.ok) showBanner('error', res.error);
                    else showBanner('success', `Pesanan ${res.order.order_number} berhasil dibuat.`);
                  }}
                  style={{ background: '#047857', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Buat Pesanan & Potong Stok Produk
                </button>
              </div>

              {/* Daftar Pesanan */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {orders.map((ord) => (
                  <div key={ord.order_id} style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #cbd5e1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: '900', fontSize: '0.92rem' }}>
                        {ord.order_number} • {ord.customer_name}
                      </div>
                      <div style={{ fontSize: '0.8rem' }}>
                        Produk: <strong>{ord.product_name}</strong> x {ord.quantity_units} kemasan ({ord.total_weight_kg} kg) • Total: <strong>Rp {ord.total_amount_idr.toLocaleString('id-ID')}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                        Batch: <code>{ord.prod_batch_code}</code> • Pembayaran: {ord.payment_status}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <select
                        value={ord.order_status}
                        onChange={(e) => {
                          const res = updateOrderStatus(ord.order_id, e.target.value);
                          if (!res.ok) showBanner('error', res.error);
                          else showBanner('success', `Status pesanan ${ord.order_number} diperbarui.`);
                        }}
                        style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', fontWeight: '800', fontSize: '0.78rem' }}
                      >
                        {['Pending Payment', 'Paid', 'Processing', 'Shipped', 'Completed', 'Cancelled', 'Refunded'].map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 10: SUPPLY CHAIN & QR TRACEABILITY (6.10)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'TRACEABILITY' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card, #ffffff)', padding: '24px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 6px' }}>
                10. Supply Chain & QR Traceability — Ketertelusuran Publik Aman
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: '0 0 18px' }}>
                Setiap batch produk yang lulus uji mutu menghasilkan token acak non-sekuensial. Halaman publik QR menampilkan ketertelusuran hulu-hilir tanpa pernah membocorkan koordinat gua atau lokasi koloni kelelawar.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {traceabilityTokens.map((tr) => (
                  <div key={tr.token} style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '20px', borderRadius: '18px', border: '1.5px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <code style={{ background: '#0f172a', color: '#34d399', padding: '4px 10px', borderRadius: '8px', fontWeight: '900', fontSize: '0.82rem' }}>
                        {tr.token}
                      </code>
                      <QrCode size={28} color="#047857" />
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '4px' }}>{tr.product_name}</div>
                    <div style={{ fontSize: '0.78rem', marginBottom: '6px' }}>
                      Batch Produksi: <code>{tr.prod_batch_code}</code> ← Bahan Baku: <code>{tr.raw_batch_code}</code>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: '700', marginBottom: '8px' }}>
                      {tr.public_test_summary}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginBottom: '14px' }}>
                      Asal: {tr.general_origin_region}
                    </div>

                    <Link
                      to={`/cibarani-guano/trace/${tr.token}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#047857',
                        color: '#ffffff',
                        padding: '9px 16px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontWeight: '800',
                        fontSize: '0.8rem'
                      }}
                    >
                      <QrCode size={15} /> Buka Halaman Publik Pemindaian QR
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 11: FINANCIAL LEDGER (6.11)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'LEDGER' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card, #ffffff)', padding: '24px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 6px' }}>
                11. Financial Ledger — Buku Besar Keuangan & Rekonsiliasi
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: '0 0 16px' }}>
                Transaksi yang telah berstatus <strong>Approved</strong> tidak dapat dihapus permanen. Koreksi hanya dapat dilakukan melalui <strong>Reversal / Adjustment</strong> dengan alasan yang tercatat di audit log.
              </p>

              {/* Form Tambah Transaksi */}
              <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-color, #cbd5e1)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '900', marginBottom: '12px' }}>
                  Catat Transaksi Keuangan Baru
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <select
                    value={newLedgerForm.tx_type}
                    onChange={(e) => setNewLedgerForm({ ...newLedgerForm, tx_type: e.target.value })}
                    style={{ padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', fontWeight: '800' }}
                  >
                    <option value="INCOME">INCOME (Penjualan / Pemasukan)</option>
                    <option value="EXPENSE">EXPENSE (Biaya Operasional / Produksi / Konservasi)</option>
                    <option value="GRANT_CSR">GRANT_CSR (Hibah / CSR Konservasi)</option>
                    <option value="FINANCING">FINANCING (Instrumen Pembiayaan / Investasi)</option>
                  </select>

                  <select
                    value={newLedgerForm.category}
                    onChange={(e) => setNewLedgerForm({ ...newLedgerForm, category: e.target.value })}
                    style={{ padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                  >
                    {[
                      'Penjualan Produk',
                      'Biaya Tenaga Kerja Lokal',
                      'Biaya Produksi & Kemasan',
                      'Biaya Konservasi & Monitoring',
                      'Biaya Distribusi',
                      'Pemasukan Hibah / CSR',
                      'Instrumen Pembiayaan Terpisah'
                    ].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Nilai (IDR Numerik)"
                    value={newLedgerForm.amount_idr}
                    onChange={(e) => setNewLedgerForm({ ...newLedgerForm, amount_idr: e.target.value })}
                    style={{ padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                  />

                  <input
                    type="text"
                    placeholder="Deskripsi Transaksi..."
                    value={newLedgerForm.description}
                    onChange={(e) => setNewLedgerForm({ ...newLedgerForm, description: e.target.value })}
                    style={{ padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!newLedgerForm.description) {
                      showBanner('error', 'Deskripsi transaksi wajib diisi.');
                      return;
                    }
                    const res = addFinancialTransaction(newLedgerForm);
                    if (!res.ok) showBanner('error', res.error);
                    else {
                      showBanner('success', `Transaksi ${res.tx.tx_number} berhasil dicatat.`);
                      setNewLedgerForm({ ...newLedgerForm, description: '' });
                    }
                  }}
                  style={{ background: '#047857', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Simpan ke Financial Ledger
                </button>
              </div>

              {/* Daftar Transaksi */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {financialTransactions.map((tx) => (
                  <div key={tx.tx_id} style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border-color, #cbd5e1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <code style={{ fontWeight: '900' }}>{tx.tx_number}</code>
                        <span style={{ fontSize: '0.7rem', fontWeight: '900', background: tx.tx_type === 'INCOME' ? '#d1fae5' : '#fee2e2', color: tx.tx_type === 'INCOME' ? '#047857' : '#991b1b', padding: '2px 8px', borderRadius: '6px' }}>
                          {tx.tx_type} • {tx.category}
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#0369a1' }}>[{tx.status}]</span>
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: '700' }}>{tx.description}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748b)' }}>
                        Tanggal: {tx.tx_date} • Sumber: {tx.fund_source} • Ref: {tx.doc_reference}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <div style={{ fontSize: '1rem', fontWeight: '900', color: tx.tx_type === 'INCOME' ? '#047857' : '#b91c1c' }}>
                        Rp {Number(tx.amount_idr).toLocaleString('id-ID')}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {tx.status === 'Submitted' && (
                          <button
                            type="button"
                            onClick={() => {
                              const res = approveFinancialTransaction(tx.tx_id);
                              if (!res.ok) showBanner('error', res.error);
                              else showBanner('success', `Transaksi ${tx.tx_number} disahkan (Approved).`);
                            }}
                            style={{ background: '#059669', color: '#ffffff', border: 'none', padding: '5px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '800', cursor: 'pointer' }}
                          >
                            ✓ Approve
                          </button>
                        )}
                        {tx.status === 'Approved' && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <input
                              type="text"
                              placeholder="Alasan Reversal..."
                              value={reversalReasons[tx.tx_id] || ''}
                              onChange={(e) => setReversalReasons({ ...reversalReasons, [tx.tx_id]: e.target.value })}
                              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.72rem', width: '130px' }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const res = reverseFinancialTransaction(tx.tx_id, reversalReasons[tx.tx_id]);
                                if (!res.ok) showBanner('error', res.error);
                                else showBanner('success', `Jurnal balik (Reversal) untuk ${tx.tx_number} berhasil dibuat.`);
                              }}
                              style={{ background: '#f59f00', color: '#ffffff', border: 'none', padding: '5px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '800', cursor: 'pointer' }}
                            >
                              Jurnal Balik
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 12: BENEFIT SHARING (6.12 & Bagian 15)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'BENEFIT_SHARING' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card, #ffffff)', padding: '24px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 4px' }}>
                    12. Benefit Sharing — Simulasi & Pencatatan Alokasi Manfaat (Bukan Pembayaran Otomatis)
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)' }}>
                    Membedakan dengan tegas antara Bagi Hasil Usaha, Dana Konservasi, Instrumen Pembiayaan Investor Terpisah, dan <strong>Alokasi Program YSNJ (Bukan Dividen)</strong>.
                  </div>
                </div>
                <span style={{ background: '#fef3c7', color: '#92400e', padding: '6px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '900', border: '1px solid #f59e0b' }}>
                  ⚠️ {assumptionParams.status_label}
                </span>
              </div>

              {/* Konfigurasi Parameter Simulasi Business Plan (Bagian 15) */}
              <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-color, #cbd5e1)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '900', marginBottom: '12px', color: '#047857' }}>
                  Konfigurasi Parameter Simulasi Rencana Bisnis (Label: ASUMSI — BELUM DISEPAKATI)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', display: 'block' }}>Estimasi Investasi Awal (IDR)</label>
                    <input
                      type="number"
                      value={assumptionParams.initial_investment_idr}
                      onChange={(e) => updateAssumptionParams({ initial_investment_idr: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '800' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', display: 'block' }}>Target Volume Stabil (kg/bulan)</label>
                    <input
                      type="number"
                      value={assumptionParams.target_monthly_sales_kg}
                      onChange={(e) => updateAssumptionParams({ target_monthly_sales_kg: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '800' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', display: 'block' }}>Harga Jual Rata-Rata (IDR/kg)</label>
                    <input
                      type="number"
                      value={assumptionParams.avg_selling_price_per_kg_idr}
                      onChange={(e) => updateAssumptionParams({ avg_selling_price_per_kg_idr: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '800' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', display: 'block' }}>Biaya Variabel (IDR/kg)</label>
                    <input
                      type="number"
                      value={assumptionParams.variable_cost_per_kg_idr}
                      onChange={(e) => updateAssumptionParams({ variable_cost_per_kg_idr: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '800' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', display: 'block' }}>Biaya Tetap Bulanan (IDR)</label>
                    <input
                      type="number"
                      value={assumptionParams.monthly_fixed_cost_idr}
                      onChange={(e) => updateAssumptionParams({ monthly_fixed_cost_idr: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '800' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: '800', display: 'block' }}>Usulan Dana Konservasi (%)</label>
                    <input
                      type="number"
                      value={assumptionParams.conservation_fund_pct}
                      onChange={(e) => updateAssumptionParams({ conservation_fund_pct: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '800' }}
                    />
                  </div>
                </div>
              </div>

              {/* Hasil Perhitungan Simulasi Bulanan */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '900', color: 'var(--text-muted, #64748b)' }}>SURPLUS OPERASIONAL KOTOR (SIMULASI/BLN)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', margin: '4px 0' }}>
                    Rp {benefitCalc.grossOperatingSurplus.toLocaleString('id-ID')}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748b)' }}>
                    Pendapatan Rp {benefitCalc.monthlyGrossRev.toLocaleString('id-ID')} dikurangi biaya variabel & tetap
                  </div>
                </div>

                <div style={{ background: 'rgba(2, 132, 199, 0.08)', padding: '16px', borderRadius: '16px', border: '1.5px solid #0284c7' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#0369a1' }}>
                    DANA KONSERVASI ({assumptionParams.conservation_fund_pct}% DARI SURPLUS POSITIF)
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0369a1', margin: '4px 0' }}>
                    Rp {benefitCalc.conservationFund.toLocaleString('id-ID')}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#0369a1' }}>
                    Cadangan Pajak & Kewajiban Usaha Terpisah ({assumptionParams.estimated_tax_and_reserve_pct}%): Rp {benefitCalc.taxAndReserve.toLocaleString('id-ID')}
                  </div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '16px', borderRadius: '16px', border: '1.5px solid #10b981' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#047857' }}>
                    ALOKASI KASEPUHAN CIBARANI ({assumptionParams.kasepuhan_allocation_pct}%)
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#047857', margin: '4px 0' }}>
                    Rp {benefitCalc.kasepuhanShare.toLocaleString('id-ID')}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#047857' }}>
                    Manfaat Ekonomi Komunitas & Masyarakat Adat
                  </div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '16px', borderRadius: '16px', border: '1.5px solid #f59e0b' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#b45309' }}>
                    ALOKASI ASPAI ({assumptionParams.aspai_allocation_pct}%)
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#b45309', margin: '4px 0' }}>
                    Rp {benefitCalc.aspaiShare.toLocaleString('id-ID')}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#b45309' }}>
                    Formulasi, Pengendalian Mutu, Jaringan & Distribusi Pasar
                  </div>
                </div>

                <div style={{ background: 'rgba(124, 58, 237, 0.08)', padding: '16px', borderRadius: '16px', border: '1.5px solid #7c3aed' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#6d28d9' }}>
                    ALOKASI PROGRAM YSNJ ({assumptionParams.ysnj_program_allocation_pct}% — BUKAN DIVIDEN)
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#6d28d9', margin: '4px 0' }}>
                    Rp {benefitCalc.ysnjProgramShare.toLocaleString('id-ID')}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#6d28d9' }}>
                    Khusus Program Pendampingan & Konservasi (Tidak dibagikan ke Pembina/Pengurus/Pengawas)
                  </div>
                </div>
              </div>

              {/* Persetujuan Berjenjang 4 Pihak */}
              <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '900', marginBottom: '10px' }}>
                  Status Persetujuan Berjenjang Skema Simulasi (Multi-Party Governance Sign-off)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px' }}>
                  {[
                    { key: 'kasepuhan', label: 'Kasepuhan Cibarani' },
                    { key: 'aspai', label: 'ASPAI' },
                    { key: 'ysnj', label: 'Yayasan Sabumi Nusantara Jaya' },
                    { key: 'bup', label: 'Badan Usaha Pelaksana' }
                  ].map((p) => {
                    const st = benefitApprovals[p.key];
                    return (
                      <div key={p.key} style={{ background: 'var(--bg-card, #ffffff)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color, #e2e8f0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: '800' }}>{p.label}</div>
                          <div style={{ fontSize: '0.7rem', color: st?.approved ? '#059669' : '#d97706', fontWeight: '800' }}>
                            {st?.approved ? `✓ Disetujui (${st.by})` : 'Menunggu Paraf'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => togglePartySimulationApproval(p.key)}
                          style={{ background: st?.approved ? '#e2e8f0' : '#047857', color: st?.approved ? '#334155' : '#ffffff', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '800', cursor: 'pointer' }}
                        >
                          {st?.approved ? 'Batalkan' : 'Paraf Simulasi'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 13: IMPACT DASHBOARD (6.13)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'IMPACT' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card, #ffffff)', padding: '24px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 6px' }}>
                13. Impact Dashboard — Indikator Ekonomi Masyarakat, Konservasi & Produksi
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: '0 0 18px' }}>
                Menampilkan metrik yang benar-benar tercatat di sistem tanpa mengklaim kenaikan populasi kelelawar atau biodiversitas secara sepihak.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#047857', marginBottom: '10px' }}>
                    A. Indikator Ekonomi Masyarakat Lokal
                  </div>
                  <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>• Masyarakat Terlibat: <strong>{kpi.totalWorkers} orang (DEMO)</strong></div>
                    <div>• Total Jam Kerja Tercatat: <strong>{kpi.totalWorkerHours} jam kerja</strong></div>
                    <div>• Pembayaran Tenaga Kerja Lokal: <strong>Rp 60.000 (Data Ledger DEMO)</strong></div>
                    <div>• Mitra / Organisasi Lokal: <strong>4 Entitas Kolaborator</strong></div>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#0369a1', marginBottom: '10px' }}>
                    B. Indikator Konservasi & Kepatuhan
                  </div>
                  <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>• Kegiatan Monitoring Ekologi: <strong>{conservationLogs.length} kegiatan</strong></div>
                    <div>• Area Dihentikan Demi Konservasi: <strong>{kpi.haltedSitesCount} lokasi</strong></div>
                    <div>• Dana Konservasi Digunakan: <strong>Rp {kpi.conservationFundUsed.toLocaleString('id-ID')}</strong></div>
                    <div>• Kebijakan Koordinat Gua: <strong>100% Terproteksi (Non-Publik)</strong></div>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color, #cbd5e1)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#b45309', marginBottom: '10px' }}>
                    C. Indikator Produksi & Mutu
                  </div>
                  <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>• Bahan Baku Masuk: <strong>{rawMaterialBatches.reduce((a, b) => a + b.initial_weight_kg, 0)} kg</strong></div>
                    <div>• Produksi Bersih: <strong>{kpi.totalProdOutputKg} kg</strong></div>
                    <div>• Batch Lulus Uji Mutu: <strong>{kpi.passedBatchesCount} batch</strong></div>
                    <div>• Produk Terjual: <strong>{orders.reduce((a, b) => a + b.total_weight_kg, 0)} kg</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 14: REPORTS (6.14)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'REPORTS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card, #ffffff)', padding: '24px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 4px' }}>
                    14. Reports — Pusat Laporan Terpadu & Ekspor Data
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)' }}>
                    Unduh laporan dalam format CSV/Excel atau cetak PDF ramah cetak (*print-friendly*) sesuai hak akses role.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleDownloadCsvReport}
                    style={{ background: '#047857', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={16} /> Export CSV / Spreadsheet
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Printer size={16} /> Cetak / Simpan PDF
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <select
                  value={reportFilterType}
                  onChange={(e) => setReportFilterType(e.target.value)}
                  style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', fontWeight: '800', fontSize: '0.82rem' }}
                >
                  <option value="ALL_SUMMARY">Semua 12 Jenis Laporan (Ringkasan Eksekutif)</option>
                  <option value="RESOURCE_CONSERVATION">1–3. Laporan Sumber Daya, Survei, Konservasi & Pengumpulan</option>
                  <option value="INVENTORY_PRODUCTION_QA">4–6. Laporan Stok Bahan Baku, Produksi & Hasil Uji Mutu</option>
                  <option value="SALES_FINANCE_BENEFIT">7–12. Laporan Penjualan, Keuangan, Dana Konservasi & Bagi Manfaat</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {[
                  { title: '1. Laporan Sumber Daya', desc: `${resourceSites.length} lokasi terdaftar (Volume situs utama: Belum Disurvei)` },
                  { title: '2. Laporan Survei & Konservasi', desc: `${conservationLogs.length} observasi habitat & aktivitas kelelawar` },
                  { title: '3. Laporan Pengumpulan Guano', desc: `${harvestRecords.length} catatan pengumpulan terverifikasi adat` },
                  { title: '4. Laporan Stok Bahan Baku', desc: `Saldo tersedia: ${kpi.totalRawStockKg} kg (${inventoryTransactions.length} mutasi)` },
                  { title: '5. Laporan Produksi', desc: `${productionBatches.length} batch produksi (${kpi.totalProdOutputKg} kg output)` },
                  { title: '6. Laporan Mutu (QA/QC)', desc: `${qualityTests.length} sertifikat laboratorium tercatat` },
                  { title: '7. Laporan Penjualan', desc: `${orders.length} pesanan (Rp ${kpi.totalSalesIdr.toLocaleString('id-ID')})` },
                  { title: '8. Laporan Keuangan (Ledger)', desc: `Pemasukan Rp ${kpi.verifiedIncome.toLocaleString('id-ID')} | Biaya Rp ${kpi.verifiedExpense.toLocaleString('id-ID')}` },
                  { title: '9. Laporan Dana Konservasi', desc: `Realisasi Rp ${kpi.conservationFundUsed.toLocaleString('id-ID')} | Simulasi 10% surplus` },
                  { title: '10. Laporan Pembagian Manfaat', desc: `Simulasi 50% Kasepuhan : 30% ASPAI : 20% Program YSNJ [ASUMSI]` },
                  { title: '11. Laporan Dampak Sosial', desc: `${kpi.totalWorkers} pekerja lokal (${kpi.totalWorkerHours} jam kerja)` },
                  { title: '12. Laporan Investor / Mitra', desc: `Ringkasan transparan sesuai cakupan izin ${activeRole?.label}` }
                ].map((rep, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#047857', marginBottom: '4px' }}>{rep.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #64748b)' }}>{rep.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SUBMENU 15: SETTINGS & USER ACCESS (Bagian 4.15 & Bagian 5)
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'SETTINGS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card, #ffffff)', padding: '24px', borderRadius: '22px', border: '1px solid var(--border-color, #cbd5e1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 6px' }}>
                15. Settings & User Access — Matriks 12 Role RBAC & Audit Trail Lengkap
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: '0 0 16px' }}>
                Setiap pengguna terhubung dengan organisasi/entitas dan dibatasi berdasarkan prinsip <em>least privilege</em>.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                {roles.map((r) => (
                  <div key={r.role_id} style={{
                    background: r.role_id === activeRoleId ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary, #f8fafc)',
                    padding: '14px',
                    borderRadius: '14px',
                    border: r.role_id === activeRoleId ? '2px solid #10b981' : '1px solid var(--border-color, #cbd5e1)'
                  }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '900', marginBottom: '4px' }}>{r.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginBottom: '8px' }}>{r.description}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#047857' }}>
                      Akses Menu: {r.allowed_tabs.length} dari 15 Submenu
                    </div>
                  </div>
                ))}
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: '900', margin: '0 0 10px' }}>
                Buku Besar Audit Log (`cibarani_guano_audit_logs` — {auditLogs.length} Entri)
              </h4>
              <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={16} color="#047857" />
                <input
                  type="text"
                  placeholder="Cari di Audit Log berdasarkan aksi, role, atau referensi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', maxWidth: '420px', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color, #cbd5e1)', fontSize: '0.8rem' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {auditLogs
                  .filter((log) =>
                    !searchQuery ||
                    `${log.action} ${log.entity_ref} ${log.details} ${log.actor_role}`.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((log) => (
                  <div key={log.log_id} style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-color, #e2e8f0)', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', color: '#047857' }}>
                      <span>[{log.log_id}] {log.action} • Ref: {log.entity_ref}</span>
                      <span>{new Date(log.timestamp).toLocaleString('id-ID')}</span>
                    </div>
                    <div style={{ marginTop: '2px' }}>{log.details} (Aktor: {log.actor_role} / {log.actor_org})</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
