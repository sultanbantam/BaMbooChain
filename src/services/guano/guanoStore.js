import { create } from 'zustand';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
  GUANO_ORGANIZATIONS,
  GUANO_ROLES,
  INITIAL_ASSUMPTION_PARAMS,
  INITIAL_RESOURCE_SITES,
  INITIAL_CONSERVATION_LOGS,
  INITIAL_HARVEST_RECORDS,
  INITIAL_RAW_MATERIAL_BATCHES,
  INITIAL_INVENTORY_TRANSACTIONS,
  INITIAL_PRODUCTION_BATCHES,
  INITIAL_QUALITY_TESTS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_TRACEABILITY_TOKENS,
  INITIAL_FINANCIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from './guanoSeedData';

/**
 * Helper to generate non-sequential cryptographic-style QR token
 */
function generateSecureTraceToken() {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint8Array(12);
    window.crypto.getRandomValues(arr);
    for (let i = 0; i < arr.length; i++) {
      randomPart += chars[arr[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 12; i++) {
      randomPart += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return `CG-TRC-${randomPart}`;
}

/**
 * Non-blocking Firestore persistence helper for Cibarani Guano audit & entities
 */
async function syncGuanoEventToFirestore(collectionName, payload) {
  try {
    if (!db) return;
    await addDoc(collection(db, collectionName), {
      ...payload,
      synced_at: serverTimestamp()
    });
  } catch (err) {
    // Graceful fallback when offline or restricted
    console.warn(`[CibaraniGuano] Firestore sync warning (${collectionName}):`, err?.message || err);
  }
}

export const useGuanoStore = create((set, get) => ({
  // 1. RBAC & Active Organization Context
  organizations: GUANO_ORGANIZATIONS,
  roles: GUANO_ROLES,
  activeRoleId: 'SUPER_ADMIN',
  activeOrgId: 'ORG-YSNJ',
  demoModeBannerVisible: true,

  // 2. Core Entities (34 Conceptual Entities Mapped)
  resourceSites: INITIAL_RESOURCE_SITES,
  conservationLogs: INITIAL_CONSERVATION_LOGS,
  harvestRecords: INITIAL_HARVEST_RECORDS,
  rawMaterialBatches: INITIAL_RAW_MATERIAL_BATCHES,
  inventoryTransactions: INITIAL_INVENTORY_TRANSACTIONS,
  productionBatches: INITIAL_PRODUCTION_BATCHES,
  qualityTests: INITIAL_QUALITY_TESTS,
  products: INITIAL_PRODUCTS,
  orders: INITIAL_ORDERS,
  traceabilityTokens: INITIAL_TRACEABILITY_TOKENS,
  financialTransactions: INITIAL_FINANCIAL_TRANSACTIONS,
  assumptionParams: INITIAL_ASSUMPTION_PARAMS,
  benefitApprovals: {
    kasepuhan: { approved: false, by: null, at: null },
    aspai: { approved: false, by: null, at: null },
    ysnj: { approved: false, by: null, at: null },
    bup: { approved: false, by: null, at: null }
  },
  notifications: INITIAL_NOTIFICATIONS,
  auditLogs: INITIAL_AUDIT_LOGS,

  // ── RBAC Helpers ──
  getActiveRole: () => {
    const state = get();
    return state.roles.find((r) => r.role_id === state.activeRoleId) || state.roles[0];
  },

  hasPermission: (perm) => {
    const role = get().getActiveRole();
    if (!role) return false;
    return role.permissions.includes('VIEW_ALL') || role.permissions.includes('CREATE_ALL') || role.permissions.includes(perm);
  },

  canAccessTab: (tabId) => {
    const role = get().getActiveRole();
    if (!role) return false;
    return role.allowed_tabs.includes(tabId);
  },

  switchRole: (newRoleId) => {
    const roleObj = get().roles.find((r) => r.role_id === newRoleId);
    if (!roleObj) return;
    const prevRole = get().activeRoleId;
    set({
      activeRoleId: roleObj.role_id,
      activeOrgId: roleObj.org_id
    });
    get().appendAuditLog('SWITCH_ACTIVE_ROLE', roleObj.role_id, `Perubahan konteks role dari ${prevRole} ke ${roleObj.label} (${roleObj.org_id}).`);
  },

  appendAuditLog: (action, entityRef, details) => {
    const state = get();
    const newLog = {
      log_id: `AUD-CG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      actor_role: state.activeRoleId,
      actor_org: state.activeOrgId,
      action,
      entity_ref: entityRef,
      details
    };
    set((s) => ({
      auditLogs: [newLog, ...s.auditLogs]
    }));
    syncGuanoEventToFirestore('cibarani_guano_audit_logs', newLog);
  },

  pushNotification: (type, title, message) => {
    const newNotif = {
      notif_id: `NTF-${Date.now().toString().slice(-6)}`,
      type,
      title,
      message,
      created_at: new Date().toISOString(),
      is_read: false
    };
    set((s) => ({
      notifications: [newNotif, ...s.notifications]
    }));
  },

  markNotificationRead: (notifId) => {
    set((s) => ({
      notifications: s.notifications.map((n) => (n.notif_id === notifId ? { ...n, is_read: true } : n))
    }));
  },

  // ── 6.2 Resource Registry Actions ──
  addResourceSite: (payload) => {
    const state = get();
    if (!state.hasPermission('CREATE_ALL') && !state.hasPermission('APPROVE_CUSTOMARY')) {
      return { ok: false, error: 'Role Anda tidak memiliki izin menambah Resource Site.' };
    }
    const newSite = {
      resource_id: `RES-CBR-${Date.now().toString().slice(-4)}`,
      resource_code: payload.resource_code || `CBR-SITE-${state.resourceSites.length + 1}`,
      resource_name: payload.resource_name,
      is_demo: Boolean(payload.is_demo ?? true),
      general_region: payload.general_region || 'Wilayah Adat Kasepuhan Cibarani, Kab. Lebak, Banten',
      description: payload.description || '',
      survey_status: payload.survey_status || 'Belum Disurvei',
      legal_status: payload.legal_status || 'Dalam Kajian Kewenangan',
      customary_approval_status: payload.customary_approval_status || 'Menunggu Musyawarah Adat',
      conservation_status: 'Normal',
      estimated_guano_volume: payload.estimated_guano_volume === '' || payload.estimated_guano_volume === null ? null : Number(payload.estimated_guano_volume),
      volume_unit: 'kg',
      sustainable_harvest_limit: payload.sustainable_harvest_limit === '' || payload.sustainable_harvest_limit === null ? null : Number(payload.sustainable_harvest_limit),
      data_confidentiality: 'CONFIDENTIAL_NO_PUBLIC_COORDS',
      expert_notes: payload.expert_notes || 'Koordinat gua dienkripsi dan tidak ditampilkan ke publik.',
      attachments: payload.attachments ? [payload.attachments] : [],
      created_by: `${state.activeRoleId} (${state.activeOrgId})`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    set((s) => ({
      resourceSites: [newSite, ...s.resourceSites]
    }));
    state.appendAuditLog('CREATE_RESOURCE_SITE', newSite.resource_id, `Menambahkan lokasi sumber daya "${newSite.resource_name}" (Status survei: ${newSite.survey_status}).`);
    syncGuanoEventToFirestore('cibarani_guano_resources', newSite);
    return { ok: true, site: newSite };
  },

  updateCustomaryApproval: (resourceId, newApprovalStatus, newHarvestLimitKg) => {
    const state = get();
    if (!state.hasPermission('APPROVE_CUSTOMARY')) {
      return { ok: false, error: 'Hanya Kasepuhan Admin / Super Admin yang berwenang mengubah status persetujuan adat.' };
    }
    set((s) => ({
      resourceSites: s.resourceSites.map((site) =>
        site.resource_id === resourceId
          ? {
              ...site,
              customary_approval_status: newApprovalStatus,
              sustainable_harvest_limit:
                newHarvestLimitKg !== undefined && newHarvestLimitKg !== ''
                  ? Number(newHarvestLimitKg)
                  : site.sustainable_harvest_limit,
              updated_at: new Date().toISOString()
            }
          : site
      )
    }));
    state.appendAuditLog(
      'UPDATE_CUSTOMARY_APPROVAL',
      resourceId,
      `Status persetujuan adat diubah menjadi "${newApprovalStatus}" dengan batas kuota panen lestari: ${newHarvestLimitKg ?? 'Tidak diubah'} kg.`
    );
    return { ok: true };
  },

  // ── 6.3 Conservation Tracker Actions ──
  addConservationMonitoring: (payload) => {
    const state = get();
    if (!state.hasPermission('CREATE_CONSERVATION') && !state.hasPermission('CREATE_ALL')) {
      return { ok: false, error: 'Role Anda tidak memiliki izin mencatat monitoring konservasi.' };
    }
    const targetSite = state.resourceSites.find((r) => r.resource_id === payload.resource_id);
    if (!targetSite) {
      return { ok: false, error: 'Situs sumber daya tidak ditemukan.' };
    }

    const newLog = {
      monitoring_id: `MON-${Date.now().toString().slice(-5)}`,
      resource_id: targetSite.resource_id,
      resource_name: targetSite.resource_name,
      is_demo: true,
      monitoring_date: payload.monitoring_date || new Date().toISOString().slice(0, 10),
      observer: payload.observer || `${state.activeRoleId} (${state.activeOrgId})`,
      habitat_condition: payload.habitat_condition,
      bat_activity_observation: payload.bat_activity_observation,
      disturbance_level: payload.disturbance_level || 'Rendah',
      water_or_environment_notes: payload.water_or_environment_notes || '-',
      status: payload.status || 'Normal',
      findings: payload.findings || '-',
      recommendation: payload.recommendation || '-',
      follow_up_status: payload.follow_up_status || 'Terjadwal Evaluasi',
      attachments: payload.attachment ? [payload.attachment] : [],
      created_at: new Date().toISOString()
    };

    set((s) => ({
      conservationLogs: [newLog, ...s.conservationLogs],
      resourceSites: s.resourceSites.map((site) =>
        site.resource_id === targetSite.resource_id
          ? { ...site, conservation_status: newLog.status, updated_at: new Date().toISOString() }
          : site
      )
    }));

    state.appendAuditLog(
      'RECORD_CONSERVATION_MONITORING',
      `${newLog.monitoring_id} (${targetSite.resource_id})`,
      `Hasil monitoring konservasi dicatat dengan status "${newLog.status}".`
    );

    if (newLog.status === 'Risiko Tinggi' || newLog.status === 'Kegiatan Dihentikan') {
      state.pushNotification(
        'WARNING',
        `PERINGATAN KONSERVASI: ${newLog.status} pada ${targetSite.resource_code}`,
        `Sistem otomatis mengunci permohonan dan izin pengumpulan baru pada ${targetSite.resource_name} hingga ada evaluasi dan persetujuan ulang.`
      );
    }

    syncGuanoEventToFirestore('cibarani_guano_conservation', newLog);
    return { ok: true, log: newLog };
  },

  // ── 6.4 Harvest Management Actions ──
  requestHarvest: (payload) => {
    const state = get();
    if (!state.hasPermission('REQUEST_HARVEST') && !state.hasPermission('CREATE_ALL')) {
      return { ok: false, error: 'Role Anda tidak memiliki izin mengajukan permohonan pengumpulan.' };
    }

    const site = state.resourceSites.find((r) => r.resource_id === payload.resource_id);
    if (!site) {
      return { ok: false, error: 'Lokasi sumber daya tidak ditemukan.' };
    }

    // Validasi Wajib 1: Cek status konservasi
    if (site.conservation_status === 'Risiko Tinggi' || site.conservation_status === 'Kegiatan Dihentikan') {
      return {
        ok: false,
        error: `DITOLAK SISTEM: Status konservasi pada "${site.resource_name}" adalah "${site.conservation_status}". Pengumpulan dilarang demi perlindungan koloni kelelawar.`
      };
    }

    // Validasi Wajib 2: Cek status persetujuan adat
    if (!site.customary_approval_status.toLowerCase().includes('disetujui')) {
      return {
        ok: false,
        error: `DITOLAK SISTEM: Area "${site.resource_name}" belum memiliki Persetujuan Adat Kasepuhan Cibarani (Status saat ini: ${site.customary_approval_status}).`
      };
    }

    // Validasi Wajib 3: Cek kuota panen lestari
    const reqWeight = Number(payload.requested_quota_kg);
    if (!reqWeight || reqWeight <= 0) {
      return { ok: false, error: 'Berat kuota yang diajukan harus lebih besar dari 0 kg.' };
    }
    if (!site.sustainable_harvest_limit || site.sustainable_harvest_limit <= 0) {
      return {
        ok: false,
        error: `DITOLAK SISTEM: Batas panen lestari (kuota ekologis) pada "${site.resource_name}" belum ditetapkan.`
      };
    }
    if (reqWeight > site.sustainable_harvest_limit) {
      return {
        ok: false,
        error: `DITOLAK SISTEM: Permohonan (${reqWeight} kg) melebihi batas kuota panen lestari yang disahkan (${site.sustainable_harvest_limit} kg).`
      };
    }

    const newHarvest = {
      harvest_id: `HRV-${Date.now().toString().slice(-5)}`,
      resource_id: site.resource_id,
      resource_name: site.resource_name,
      is_demo: true,
      requested_by: `${state.activeRoleId} (${state.activeOrgId})`,
      approved_by: null,
      verified_by: null,
      planned_date: payload.planned_date || new Date().toISOString().slice(0, 10),
      actual_date: null,
      approved_quota_kg: reqWeight,
      actual_weight_kg: null,
      collection_method: payload.collection_method || 'Pengumpulan manual non-intrusif di luar jam peka koloni',
      condition_notes: payload.condition_notes || '-',
      raw_batch_code: null,
      status: 'REQUESTED',
      worker_count: Number(payload.worker_count || 4),
      worker_hours: Number(payload.worker_hours || 16),
      created_at: new Date().toISOString()
    };

    set((s) => ({
      harvestRecords: [newHarvest, ...s.harvestRecords]
    }));
    state.appendAuditLog('REQUEST_HARVEST', newHarvest.harvest_id, `Permohonan pengumpulan ${reqWeight} kg pada ${site.resource_code}.`);
    state.pushNotification('INFO', `Permohonan Pengumpulan Baru (${newHarvest.harvest_id})`, `Menunggu persetujuan Kasepuhan Admin untuk kuota ${reqWeight} kg.`);
    syncGuanoEventToFirestore('cibarani_guano_harvests', newHarvest);
    return { ok: true, harvest: newHarvest };
  },

  approveAndVerifyHarvest: (harvestId, actualWeightKg) => {
    const state = get();
    if (!state.hasPermission('APPROVE_HARVEST') && !state.hasPermission('VERIFY_HARVEST')) {
      return { ok: false, error: 'Role Anda tidak memiliki kewenangan menyetujui/memverifikasi hasil pengumpulan.' };
    }

    const target = state.harvestRecords.find((h) => h.harvest_id === harvestId);
    if (!target) return { ok: false, error: 'Data pengumpulan tidak ditemukan.' };

    const site = state.resourceSites.find((r) => r.resource_id === target.resource_id);
    if (site && (site.conservation_status === 'Risiko Tinggi' || site.conservation_status === 'Kegiatan Dihentikan')) {
      return {
        ok: false,
        error: `DITOLAK SISTEM: Status konservasi area berubah menjadi "${site.conservation_status}". Kegiatan pengumpulan dihentikan.`
      };
    }

    const weight = Number(actualWeightKg || target.approved_quota_kg);
    if (weight <= 0 || weight > target.approved_quota_kg) {
      return {
        ok: false,
        error: `Berat aktual (${weight} kg) tidak valid atau melebihi kuota yang disetujui (${target.approved_quota_kg} kg).`
      };
    }

    const rawBatchCode = `RMB-CBR-${new Date().toISOString().slice(0, 7).replace('-', '')}-${String(state.rawMaterialBatches.length + 1).padStart(2, '0')}-DEMO`;

    const newRawBatch = {
      raw_batch_id: `RMB-${Date.now().toString().slice(-5)}`,
      raw_batch_code: rawBatchCode,
      is_demo: true,
      harvest_id: target.harvest_id,
      resource_id: target.resource_id,
      source_name: target.resource_name,
      received_date: new Date().toISOString().slice(0, 10),
      initial_weight_kg: weight,
      available_stock_kg: weight,
      unit: 'kg',
      initial_inspection_status: 'Terverifikasi Lapangan & Adat (DEMO)',
      storage_location: 'Gudang Bahan Baku Cibarani — Rak Utama',
      created_at: new Date().toISOString()
    };

    const newMutation = {
      mutation_id: `MUT-${Date.now().toString().slice(-5)}`,
      raw_batch_code: rawBatchCode,
      is_demo: true,
      type: 'INBOUND_HARVEST',
      quantity_kg: weight,
      balance_after_kg: weight,
      reason: `Penerimaan bahan baku dari hasil pengumpulan terverifikasi ${target.harvest_id}`,
      actor: `${state.activeRoleId} (${state.activeOrgId})`,
      timestamp: new Date().toISOString()
    };

    set((s) => ({
      harvestRecords: s.harvestRecords.map((h) =>
        h.harvest_id === harvestId
          ? {
              ...h,
              approved_by: h.approved_by || `${state.activeRoleId}`,
              verified_by: `${state.activeRoleId}`,
              actual_date: new Date().toISOString().slice(0, 10),
              actual_weight_kg: weight,
              raw_batch_code: rawBatchCode,
              status: 'VERIFIED'
            }
          : h
      ),
      rawMaterialBatches: [newRawBatch, ...s.rawMaterialBatches],
      inventoryTransactions: [newMutation, ...s.inventoryTransactions]
    }));

    state.appendAuditLog(
      'VERIFY_HARVEST_CREATE_BATCH',
      `${harvestId} -> ${rawBatchCode}`,
      `Pengumpulan diverifikasi (${weight} kg). Batch bahan baku ${rawBatchCode} dibuat dan masuk ke stok.`
    );
    return { ok: true, rawBatchCode };
  },

  // ── 6.5 Raw Material Inventory Actions ──
  adjustRawMaterialStock: (rawBatchCode, deltaKg, reason) => {
    const state = get();
    if (!state.hasPermission('MANAGE_INVENTORY')) {
      return { ok: false, error: 'Role Anda tidak memiliki izin melakukan penyesuaian stok bahan baku.' };
    }
    if (!reason || reason.trim().length < 5) {
      return { ok: false, error: 'Alasan penyesuaian stok wajib diisi dengan jelas untuk audit trail.' };
    }

    const batch = state.rawMaterialBatches.find((b) => b.raw_batch_code === rawBatchCode);
    if (!batch) return { ok: false, error: 'Batch bahan baku tidak ditemukan.' };

    const numericDelta = Number(deltaKg);
    const nextStock = batch.available_stock_kg + numericDelta;
    if (nextStock < 0) {
      return {
        ok: false,
        error: `DITOLAK SISTEM: Stok tidak boleh negatif! Stok tersedia saat ini ${batch.available_stock_kg} kg, pengurangan ${Math.abs(numericDelta)} kg ditolak.`
      };
    }

    const newMutation = {
      mutation_id: `MUT-${Date.now().toString().slice(-5)}`,
      raw_batch_code: rawBatchCode,
      is_demo: true,
      type: numericDelta >= 0 ? 'ADJUSTMENT_PLUS' : 'ADJUSTMENT_MINUS',
      quantity_kg: numericDelta,
      balance_after_kg: nextStock,
      reason,
      actor: `${state.activeRoleId} (${state.activeOrgId})`,
      timestamp: new Date().toISOString()
    };

    set((s) => ({
      rawMaterialBatches: s.rawMaterialBatches.map((b) =>
        b.raw_batch_code === rawBatchCode ? { ...b, available_stock_kg: nextStock } : b
      ),
      inventoryTransactions: [newMutation, ...s.inventoryTransactions]
    }));

    state.appendAuditLog(
      'ADJUST_RAW_MATERIAL_STOCK',
      rawBatchCode,
      `Penyesuaian stok ${numericDelta >= 0 ? '+' : ''}${numericDelta} kg (Saldo akhir: ${nextStock} kg). Alasan: ${reason}`
    );
    return { ok: true };
  },

  // ── 6.6 Production Management Actions ──
  createProductionBatch: (payload) => {
    const state = get();
    if (!state.hasPermission('MANAGE_PRODUCTION')) {
      return { ok: false, error: 'Role Anda tidak memiliki izin membuat batch produksi.' };
    }

    const rawBatch = state.rawMaterialBatches.find((b) => b.raw_batch_code === payload.raw_batch_code);
    if (!rawBatch) {
      return { ok: false, error: 'Batch bahan baku asal harus dipilih dan valid.' };
    }

    const inputKg = Number(payload.input_weight_kg);
    const outputKg = Number(payload.output_weight_kg);
    if (inputKg <= 0 || outputKg <= 0 || outputKg > inputKg) {
      return { ok: false, error: 'Berat input dan output harus valid (Output tidak boleh melebihi Input).' };
    }

    if (inputKg > rawBatch.available_stock_kg) {
      return {
        ok: false,
        error: `Stok bahan baku pada batch ${rawBatch.raw_batch_code} tidak mencukupi (Tersedia: ${rawBatch.available_stock_kg} kg, Dibutuhkan: ${inputKg} kg).`
      };
    }

    const prodCode = `PB-CBR-${new Date().toISOString().slice(0, 7).replace('-', '')}-${String(state.productionBatches.length + 1).padStart(2, '0')}-DEMO`;
    const nextRawStock = rawBatch.available_stock_kg - inputKg;

    const newProdBatch = {
      prod_batch_id: `PB-${Date.now().toString().slice(-5)}`,
      prod_batch_code: prodCode,
      is_demo: true,
      product_code: payload.product_code || 'CG-POWDER-01',
      product_name: payload.product_name || 'Cibarani Guano Powder [DEMO]',
      raw_batch_code: rawBatch.raw_batch_code,
      formula_version: payload.formula_version || 'Formula ASPAI-v1.0',
      additional_materials: payload.additional_materials || 'Tanpa bahan tambahan sintetis',
      production_date: payload.production_date || new Date().toISOString().slice(0, 10),
      pic_name: payload.pic_name || `${state.activeRoleId}`,
      input_weight_kg: inputKg,
      output_weight_kg: outputKg,
      process_loss_kg: Number((inputKg - outputKg).toFixed(2)),
      drying_sieving_notes: payload.drying_sieving_notes || 'Pengeringan & pengayakan sesuai SOP',
      granulation_notes: payload.granulation_notes || '-',
      packaging_spec: payload.packaging_spec || 'Kemasan @ 5 kg',
      status: 'Pending Quality Check',
      qa_status: 'PENDING_QA',
      ready_for_sale: false, // Wajib false sampai lulus Quality Assurance!
      trace_token: null,
      sop_document: 'SOP-Produksi-ASPAI-Guano-v1-DEMO.pdf',
      created_at: new Date().toISOString()
    };

    const outMutation = {
      mutation_id: `MUT-${Date.now().toString().slice(-5)}`,
      raw_batch_code: rawBatch.raw_batch_code,
      is_demo: true,
      type: 'OUTBOUND_PRODUCTION',
      quantity_kg: -inputKg,
      balance_after_kg: nextRawStock,
      reason: `Pemakaian produksi untuk Batch ${prodCode}`,
      actor: `${state.activeRoleId} (${state.activeOrgId})`,
      timestamp: new Date().toISOString()
    };

    set((s) => ({
      productionBatches: [newProdBatch, ...s.productionBatches],
      rawMaterialBatches: s.rawMaterialBatches.map((b) =>
        b.raw_batch_code === rawBatch.raw_batch_code ? { ...b, available_stock_kg: nextRawStock } : b
      ),
      inventoryTransactions: [outMutation, ...s.inventoryTransactions]
    }));

    state.appendAuditLog(
      'CREATE_PRODUCTION_BATCH',
      `${prodCode} <- ${rawBatch.raw_batch_code}`,
      `Batch produksi dibuat (Input: ${inputKg} kg, Output: ${outputKg} kg, Susut: ${inputKg - outputKg} kg). Status: Pending Quality Check (Belum boleh dijual).`
    );
    state.pushNotification('INFO', `Batch Produksi ${prodCode} Menunggu Uji Mutu`, `Produk dikunci dari penjualan sampai Quality Officer mengesahkan hasil uji laboratorium.`);
    syncGuanoEventToFirestore('cibarani_guano_production_batches', newProdBatch);
    return { ok: true, batch: newProdBatch };
  },

  // ── 6.7 Quality Assurance & 6.10 QR Traceability Actions ──
  submitQualityTest: (payload) => {
    const state = get();
    if (!state.hasPermission('APPROVE_QUALITY')) {
      return { ok: false, error: 'Hanya Quality Officer / ASPAI Admin / Super Admin yang berwenang memvalidasi hasil uji mutu.' };
    }

    const batch = state.productionBatches.find((b) => b.prod_batch_code === payload.prod_batch_code);
    if (!batch) {
      return { ok: false, error: 'Batch produksi tidak ditemukan.' };
    }

    const isPassed = payload.status === 'Lulus Uji (DEMO)' || payload.status === 'Lulus Uji';
    const generatedToken = isPassed ? (batch.trace_token || generateSecureTraceToken()) : null;

    const newTest = {
      test_id: `QA-${Date.now().toString().slice(-5)}`,
      prod_batch_code: batch.prod_batch_code,
      is_demo: true,
      lab_name: payload.lab_name || 'Laboratorium Terakreditasi (DEMO)',
      certificate_number: payload.certificate_number || `CERT-LAB-${Date.now().toString().slice(-4)}`,
      test_date: payload.test_date || new Date().toISOString().slice(0, 10),
      quality_officer: `${state.activeRoleId} (${state.activeOrgId})`,
      status: payload.status,
      parameters: payload.parameters || [
        { name: 'Kadar Air', value: payload.moisture_pct || '11.5', unit: '%', spec_limit: payload.moisture_limit || 'Maks. 15%', pass: true },
        { name: 'pH H2O', value: payload.ph_val || '6.8', unit: 'pH', spec_limit: payload.ph_limit || '5.5 – 7.5', pass: true },
        { name: 'C-Organik', value: payload.organic_c_pct || '18.0', unit: '%', spec_limit: payload.organic_c_limit || 'Min. 15%', pass: true },
        { name: 'P2O5 Total', value: payload.p2o5_pct || '12.4', unit: '%', spec_limit: 'Sesuai Spesifikasi Batch', pass: true },
        { name: 'Logam Berat & Mikrobiologi', value: payload.contaminant_notes || 'Memenuhi Baku Mutu', unit: '-', spec_limit: 'Sesuai Regulasi', pass: isPassed }
      ],
      notes: payload.notes || 'Diverifikasi oleh Quality Officer berdasarkan sertifikat laboratorium.',
      attachment: payload.attachment || 'Sertifikat-Lab-DEMO.pdf',
      created_at: new Date().toISOString()
    };

    const newTraceEntry = isPassed
      ? {
          token: generatedToken,
          is_demo: true,
          prod_batch_code: batch.prod_batch_code,
          raw_batch_code: batch.raw_batch_code,
          product_name: batch.product_name,
          production_date: batch.production_date,
          public_quality_status: `${newTest.status} (Sertifikat: ${newTest.certificate_number})`,
          public_test_summary: `Kadar Air: ${newTest.parameters[0]?.value}% | pH: ${newTest.parameters[1]?.value} | C-Organik: ${newTest.parameters[2]?.value}% | P2O5: ${newTest.parameters[3]?.value}%`,
          general_origin_region: 'Wilayah Adat Kasepuhan Cibarani, Kab. Lebak, Provinsi Banten (Koordinat Gua Dirahasiakan untuk Konservasi)',
          approved_producer_identity: 'Kolaborasi ASPAI, Kasepuhan Cibarani & Pendampingan Konservasi YSNJ',
          conservation_compliance: 'Diverifikasi mematuhi protokol konservasi non-intrusif & persetujuan adat',
          traceability_status: 'VERIFIED_PUBLIC_SAFE'
        }
      : null;

    const addedUnits = isPassed ? Math.floor(batch.output_weight_kg / 5) : 0;

    set((s) => ({
      qualityTests: [newTest, ...s.qualityTests],
      productionBatches: s.productionBatches.map((b) =>
        b.prod_batch_code === batch.prod_batch_code
          ? {
              ...b,
              status: isPassed ? 'Approved' : 'Rejected',
              qa_status: isPassed ? 'PASSED_DEMO' : 'FAILED_QA',
              ready_for_sale: isPassed,
              trace_token: generatedToken
            }
          : b
      ),
      products: isPassed
        ? s.products.map((p) =>
            p.product_code === batch.product_code
              ? {
                  ...p,
                  available_stock_units: p.available_stock_units + addedUnits,
                  available_stock_kg: p.available_stock_kg + batch.output_weight_kg,
                  linked_batch_code: batch.prod_batch_code,
                  qa_verified: true,
                  ready_for_sale: true
                }
              : p
          )
        : s.products,
      traceabilityTokens: newTraceEntry
        ? [newTraceEntry, ...s.traceabilityTokens.filter((t) => t.token !== generatedToken)]
        : s.traceabilityTokens
    }));

    state.appendAuditLog(
      'SUBMIT_QUALITY_ASSURANCE',
      `${newTest.test_id} (${batch.prod_batch_code})`,
      `Hasil uji mutu: ${newTest.status}. Ready for Sale: ${isPassed ? 'YA (Token QR: ' + generatedToken + ')' : 'TIDAK (Ditolak/Uji Ulang)'}.`
    );

    if (isPassed) {
      state.pushNotification('SUCCESS', `Batch ${batch.prod_batch_code} Lulus Uji & Siap Dijual`, `Token QR Ketertelusuran ${generatedToken} telah diterbitkan.`);
    } else {
      state.pushNotification('WARNING', `Batch ${batch.prod_batch_code} Ditolak / Perlu Uji Ulang`, `Batch dikunci dan tidak dapat dipasarkan.`);
    }

    syncGuanoEventToFirestore('cibarani_guano_quality_tests', newTest);
    return { ok: true, test: newTest, traceToken: generatedToken };
  },

  // ── 6.9 Marketplace & Orders Actions ──
  createOrder: (payload) => {
    const state = get();
    const product = state.products.find((p) => p.product_code === payload.product_code);
    if (!product) return { ok: false, error: 'Produk tidak ditemukan.' };

    if (!product.ready_for_sale || !product.qa_verified) {
      return {
        ok: false,
        error: `DITOLAK SISTEM: Produk "${product.name}" belum memiliki batch yang lulus uji mutu laboratorium (Status Ready for Sale: Nonaktif).`
      };
    }

    const qty = Number(payload.quantity_units);
    if (!qty || qty <= 0) return { ok: false, error: 'Jumlah pesanan harus minimal 1 kemasan.' };
    if (qty > product.available_stock_units) {
      return {
        ok: false,
        error: `Stok produk siap jual tidak mencukupi (Tersedia: ${product.available_stock_units} kemasan).`
      };
    }

    const totalAmount = qty * product.price_idr;
    const totalWeightKg = qty * product.net_weight_kg;
    const orderNum = `INV-CG-${new Date().toISOString().slice(0, 7).replace('-', '')}-${String(state.orders.length + 1).padStart(3, '0')}-DEMO`;

    const newOrder = {
      order_id: `ORD-${Date.now().toString().slice(-5)}`,
      order_number: orderNum,
      is_demo: true,
      customer_name: payload.customer_name || 'Pelanggan Komunitas Tani (DEMO)',
      customer_org: payload.customer_org || 'Umum / ASPAI Network',
      product_code: product.product_code,
      product_name: `${product.name} (${product.net_weight_kg} kg)`,
      prod_batch_code: product.linked_batch_code,
      quantity_units: qty,
      total_weight_kg: totalWeightKg,
      unit_price_idr: product.price_idr,
      total_amount_idr: totalAmount,
      payment_status: 'Pending Payment (Menunggu Konfirmasi Resmi)',
      order_status: 'Pending Payment',
      shipping_tracking: '-',
      created_at: new Date().toISOString()
    };

    set((s) => ({
      orders: [newOrder, ...s.orders],
      products: s.products.map((p) =>
        p.product_code === product.product_code
          ? {
              ...p,
              available_stock_units: p.available_stock_units - qty,
              available_stock_kg: Math.max(0, p.available_stock_kg - totalWeightKg)
            }
          : p
      )
    }));

    state.appendAuditLog('CREATE_ORDER', orderNum, `Pesanan baru ${qty} unit ${product.name} senilai Rp ${totalAmount.toLocaleString('id-ID')}.`);
    state.pushNotification('INFO', `Pesanan Masuk: ${orderNum}`, `${newOrder.customer_name} memesan ${qty} kemasan ${product.name}.`);
    syncGuanoEventToFirestore('cibarani_guano_orders', newOrder);
    return { ok: true, order: newOrder };
  },

  updateOrderStatus: (orderId, nextStatus) => {
    const state = get();
    if (!state.hasPermission('MANAGE_ORDERS')) {
      return { ok: false, error: 'Role Anda tidak memiliki izin memperbarui status pesanan.' };
    }
    set((s) => ({
      orders: s.orders.map((o) =>
        o.order_id === orderId
          ? {
              ...o,
              order_status: nextStatus,
              payment_status: nextStatus === 'Paid' || nextStatus === 'Completed' ? 'Paid (Terverifikasi)' : o.payment_status
            }
          : o
      )
    }));
    state.appendAuditLog('UPDATE_ORDER_STATUS', orderId, `Status pesanan diubah menjadi "${nextStatus}".`);
    return { ok: true };
  },

  // ── 6.11 Financial Ledger Actions (No Permanent Deletion on Approved Tx) ──
  addFinancialTransaction: (payload) => {
    const state = get();
    if (!state.hasPermission('MANAGE_LEDGER')) {
      return { ok: false, error: 'Role Anda tidak memiliki izin mencatat transaksi keuangan.' };
    }

    const amount = Number(payload.amount_idr);
    if (!amount || amount <= 0) {
      return { ok: false, error: 'Nilai transaksi harus berupa angka positif yang valid.' };
    }

    const txNum = `TRX-CG-${new Date().toISOString().slice(0, 7).replace('-', '')}-${String(state.financialTransactions.length + 1).padStart(3, '0')}-DEMO`;
    const newTx = {
      tx_id: `FIN-${Date.now().toString().slice(-5)}`,
      tx_number: txNum,
      is_demo: true,
      tx_date: payload.tx_date || new Date().toISOString().slice(0, 10),
      tx_type: payload.tx_type || 'EXPENSE',
      category: payload.category || 'Biaya Operasional',
      description: payload.description,
      amount_idr: amount,
      currency: 'IDR',
      fund_source: payload.fund_source || 'Rekening Operasional Badan Usaha (DEMO)',
      doc_reference: payload.doc_reference || '-',
      created_by: `${state.activeRoleId} (${state.activeOrgId})`,
      verified_by: null,
      status: 'Submitted',
      created_at: new Date().toISOString()
    };

    set((s) => ({
      financialTransactions: [newTx, ...s.financialTransactions]
    }));
    state.appendAuditLog('CREATE_FINANCIAL_TX', txNum, `Mencatat transaksi ${newTx.tx_type} (${newTx.category}) sebesar Rp ${amount.toLocaleString('id-ID')}.`);
    syncGuanoEventToFirestore('cibarani_guano_ledger', newTx);
    return { ok: true, tx: newTx };
  },

  approveFinancialTransaction: (txId) => {
    const state = get();
    if (!state.hasPermission('APPROVE_LEDGER')) {
      return { ok: false, error: 'Role Anda tidak memiliki kewenangan menyetujui transaksi buku besar.' };
    }
    set((s) => ({
      financialTransactions: s.financialTransactions.map((t) =>
        t.tx_id === txId ? { ...t, status: 'Approved', verified_by: `${state.activeRoleId}` } : t
      )
    }));
    state.appendAuditLog('APPROVE_FINANCIAL_TX', txId, `Transaksi disetujui dan dikunci dari penghapusan permanen.`);
    return { ok: true };
  },

  reverseFinancialTransaction: (txId, reason) => {
    const state = get();
    if (!state.hasPermission('APPROVE_LEDGER')) {
      return { ok: false, error: 'Role Anda tidak memiliki izin melakukan jurnal balik (Reversal/Adjustment).' };
    }
    if (!reason || reason.trim().length < 5) {
      return { ok: false, error: 'Alasan koreksi/reversal wajib diisi untuk jejak audit.' };
    }
    const orig = state.financialTransactions.find((t) => t.tx_id === txId);
    if (!orig) return { ok: false, error: 'Transaksi asal tidak ditemukan.' };

    const revNum = `${orig.tx_number}-REV`;
    const reversalTx = {
      tx_id: `FIN-REV-${Date.now().toString().slice(-4)}`,
      tx_number: revNum,
      is_demo: true,
      tx_date: new Date().toISOString().slice(0, 10),
      tx_type: orig.tx_type === 'INCOME' ? 'EXPENSE' : 'INCOME',
      category: `Reversal / Adjustment (${orig.category})`,
      description: `[JURNAL BALIK ATAS ${orig.tx_number}] Alasan: ${reason}`,
      amount_idr: orig.amount_idr,
      currency: 'IDR',
      fund_source: orig.fund_source,
      doc_reference: orig.tx_number,
      created_by: `${state.activeRoleId}`,
      verified_by: `${state.activeRoleId}`,
      status: 'Reconciled',
      created_at: new Date().toISOString()
    };

    set((s) => ({
      financialTransactions: [reversalTx, ...s.financialTransactions]
    }));
    state.appendAuditLog('REVERSE_FINANCIAL_TX', `${orig.tx_number} -> ${revNum}`, `Koreksi transaksi melalui jurnal balik. Alasan: ${reason}`);
    return { ok: true };
  },

  // ── 6.12 Benefit Sharing Simulation & Multi-Party Approval ──
  updateAssumptionParams: (partial) => {
    const state = get();
    if (!state.hasPermission('CONFIGURE_BENEFIT')) {
      return { ok: false, error: 'Role Anda tidak memiliki izin mengubah parameter simulasi pembagian manfaat.' };
    }

    const nextParams = {
      ...state.assumptionParams,
      ...partial
    };

    const totalSharePct =
      Number(nextParams.kasepuhan_allocation_pct) +
      Number(nextParams.aspai_allocation_pct) +
      Number(nextParams.ysnj_program_allocation_pct);

    if (totalSharePct !== 100) {
      return {
        ok: false,
        error: `Total persentase alokasi manfaat (Kasepuhan + ASPAI + Program YSNJ) harus berjumlah 100% (Saat ini: ${totalSharePct}%).`
      };
    }

    set({ assumptionParams: nextParams });
    state.appendAuditLog(
      'UPDATE_BENEFIT_SHARING_ASSUMPTIONS',
      nextParams.scheme_id,
      `Memperbarui parameter simulasi [ASUMSI — BELUM DISEPAKATI]: Konservasi ${nextParams.conservation_fund_pct}%, Kasepuhan ${nextParams.kasepuhan_allocation_pct}%, ASPAI ${nextParams.aspai_allocation_pct}%, Alokasi Program YSNJ ${nextParams.ysnj_program_allocation_pct}%.`
    );
    return { ok: true };
  },

  togglePartySimulationApproval: (partyKey) => {
    const state = get();
    set((s) => ({
      benefitApprovals: {
        ...s.benefitApprovals,
        [partyKey]: {
          approved: !s.benefitApprovals[partyKey]?.approved,
          by: `${state.activeRoleId} (${state.activeOrgId})`,
          at: new Date().toISOString()
        }
      }
    }));
    state.appendAuditLog(
      'SIGN_BENEFIT_SIMULATION_STAGE',
      `PARTY:${partyKey.toUpperCase()}`,
      `Mengubah status persetujuan berjenjang simulasi pembagian manfaat untuk pihak ${partyKey.toUpperCase()}.`
    );
  }
}));

