import { useState, useEffect } from 'react';
import {
  CIBARANI_PROFILE,
  CIBARANI_PACKAGES,
  CIBARANI_EXPERIENCES,
  CIBARANI_PRODUCTS,
  CIBARANI_EVENTS,
  CIBARANI_STORIES,
  CIBARANI_IMPACT_PROJECTS,
  CIBARANI_GALLERY
} from './cibaraniSeedData';

const STORAGE_KEYS = {
  BOOKINGS: 'cibarani_bookings_v1',
  PACKAGES: 'cibarani_packages_v1',
  EVENTS: 'cibarani_events_v1',
  STORIES: 'cibarani_stories_v1',
  PRODUCTS: 'cibarani_products_v1',
  IMPACT: 'cibarani_impact_v1',
  AGENT_LOGS: 'cibarani_agent_logs_v1',
  AGENT_APPROVALS: 'cibarani_agent_approvals_v1'
};

// Initial state helpers
const getStored = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key}:`, e);
    return fallback;
  }
};

const setStored = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key}:`, e);
  }
};

// Global reactive subscribers
let listeners = [];
const notify = () => listeners.forEach(fn => fn());

// In-memory state singleton
let state = {
  profile: CIBARANI_PROFILE,
  packages: getStored(STORAGE_KEYS.PACKAGES, CIBARANI_PACKAGES),
  experiences: CIBARANI_EXPERIENCES,
  products: getStored(STORAGE_KEYS.PRODUCTS, CIBARANI_PRODUCTS),
  events: getStored(STORAGE_KEYS.EVENTS, CIBARANI_EVENTS),
  stories: getStored(STORAGE_KEYS.STORIES, CIBARANI_STORIES),
  impactProjects: getStored(STORAGE_KEYS.IMPACT, CIBARANI_IMPACT_PROJECTS),
  gallery: CIBARANI_GALLERY,
  bookings: getStored(STORAGE_KEYS.BOOKINGS, [
    {
      id: 'CWEE-2026-001',
      bookingCode: 'CWEE-2026-001',
      packageId: 'PKG-WEEKEND-01',
      packageName: 'Paket Cibarani Weekend Experience (2 Hari 1 Malam)',
      guestName: 'Budi Santoso',
      guestEmail: 'budi.santoso@gmail.com',
      guestPhone: '+62 812-9876-5432',
      participantsCount: 2,
      visitDate: '2026-11-14',
      totalAmount: 2000000,
      specialRequests: 'Makanan vegetarian untuk 1 peserta, mohon disediakan alas tidur tambahan bila ada.',
      status: 'CONFIRMED', // DRAFT | PENDING_CONFIRMATION | CONFIRMED | COMPLETED | CANCELLED
      paymentMethod: 'TRANSFER_MANUAL', // QRIS_DIRECT | TRANSFER_MANUAL | BMC_ESCROW | USDT
      paymentStatus: 'VERIFIED',
      createdAt: '2026-11-05T10:30:00Z',
      verifiedBy: 'Yayasan Admin (YSNJ)',
      customCode: 'CWEE-7892'
    }
  ]),
  agentLogs: getStored(STORAGE_KEYS.AGENT_LOGS, [
    {
      id: 'LOG-001',
      timestamp: new Date().toISOString(),
      agent: 'Booking Operations Agent',
      action: 'Check Batch Quota & Schedule Conflict',
      status: 'SUCCESS',
      level: 'Level 1 (Autonomous)',
      details: 'Evaluasi kuota untuk batch 14-15 Nov: 6/15 terisi. Tidak ada konflik jadwal adat.'
    },
    {
      id: 'LOG-002',
      timestamp: new Date().toISOString(),
      agent: 'Cibarani Concierge Agent',
      action: 'Respond User Inquiry regarding Leuit & Food Sovereignty',
      status: 'SUCCESS',
      level: 'Level 1 (Autonomous)',
      details: 'Memberikan penjelasan detail tradisi Rukun Tani dan panduan rute KRL Rangkasbitung.'
    }
  ]),
  agentApprovals: getStored(STORAGE_KEYS.AGENT_APPROVALS, [
    {
      id: 'APPR-01',
      agent: 'Content & Social Media Agent',
      title: 'Publikasi Cerita Baru: Dokumentasi Seren Padi 2026',
      description: 'Agent menyusun draf artikel dan 3 variasi copy viral hook untuk dibagikan ke media sosial.',
      level: 'Level 2 (Requires Admin Approval)',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    }
  ])
};

export const cibaraniStore = {
  getState: () => state,

  subscribe: (fn) => {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(l => l !== fn);
    };
  },

  // BOOKING OPERATIONS
  createBooking: (bookingData, user = null) => {
    const existing = state.bookings;
    const pkg = state.packages.find(p => p.id === bookingData.packageId) || state.packages[0];
    const pricePerPerson = pkg ? pkg.indicativePrice : 1000000;
    const participants = Number(bookingData.participantsCount) || 1;
    const total = pricePerPerson * participants;

    // Check availability for this date
    const bookedOnDate = existing
      .filter(b => b.visitDate === bookingData.visitDate && b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + (Number(b.participantsCount) || 0), 0);

    const maxQuota = pkg.maxQuotaPerBatch || 20;
    if (bookedOnDate + participants > maxQuota) {
      throw new Error(`Kuota untuk tanggal ${bookingData.visitDate} tersisa ${Math.max(0, maxQuota - bookedOnDate)} orang. Permohonan Anda melebihi kuota.`);
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: `CWEE-${new Date().getFullYear()}-${randomSuffix}`,
      bookingCode: `CWEE-${new Date().getFullYear()}-${randomSuffix}`,
      packageId: pkg.id,
      packageName: pkg.title,
      guestName: bookingData.guestName || user?.displayName || 'Tamu Cibarani',
      guestEmail: bookingData.guestEmail || user?.email || '',
      guestPhone: bookingData.guestPhone || user?.phoneNumber || '',
      userId: user?.uid || null,
      participantsCount: participants,
      visitDate: bookingData.visitDate,
      totalAmount: total,
      specialRequests: bookingData.specialRequests || '',
      agreedToRules: !!bookingData.agreedToRules,
      status: 'PENDING_CONFIRMATION',
      paymentMethod: bookingData.paymentMethod || 'TRANSFER_MANUAL',
      paymentStatus: 'WAITING_VERIFICATION',
      createdAt: new Date().toISOString(),
      verifiedBy: null,
      customCode: `CWEE-${randomSuffix}`
    };

    state.bookings = [newBooking, ...state.bookings];
    setStored(STORAGE_KEYS.BOOKINGS, state.bookings);

    // Trigger Autonomous Agent Log
    cibaraniStore.addAgentLog(
      'Booking Operations Agent',
      `Booking Baru Masuk #${newBooking.bookingCode}`,
      `Peserta: ${participants} orang untuk tanggal ${bookingData.visitDate}. Menunggu validasi admin.`,
      'SUCCESS',
      'Level 1 (Autonomous)'
    );

    notify();
    return newBooking;
  },

  updateBookingStatus: (bookingId, newStatus, verifierName = 'Admin YSNJ') => {
    state.bookings = state.bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: newStatus,
          verifiedBy: verifierName,
          updatedAt: new Date().toISOString(),
          paymentStatus: newStatus === 'CONFIRMED' ? 'VERIFIED' : b.paymentStatus
        };
      }
      return b;
    });
    setStored(STORAGE_KEYS.BOOKINGS, state.bookings);

    cibaraniStore.addAgentLog(
      'Booking Operations Agent',
      `Update Status Booking #${bookingId}`,
      `Status diubah menjadi: ${newStatus} oleh ${verifierName}.`,
      'SUCCESS',
      'Level 2 (Approval Done)'
    );

    notify();
  },

  // PACKAGE & PRICING MANAGEMENT (ADMIN CMS)
  updatePackagePrice: (pkgId, newPrice, newQuota) => {
    state.packages = state.packages.map(p => {
      if (p.id === pkgId) {
        return {
          ...p,
          indicativePrice: Number(newPrice) || p.indicativePrice,
          maxQuotaPerBatch: Number(newQuota) || p.maxQuotaPerBatch,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    setStored(STORAGE_KEYS.PACKAGES, state.packages);

    cibaraniStore.addAgentLog(
      'Product & Local Market Agent',
      `Update Harga & Kuota Paket #${pkgId}`,
      `Harga disesuaikan menjadi Rp ${Number(newPrice).toLocaleString('id-ID')} / Kuota: ${newQuota} orang.`,
      'SUCCESS',
      'Level 2 (Admin Action)'
    );

    notify();
  },

  // PRODUCTS CMS
  updateProduct: (productId, updatedFields) => {
    state.products = state.products.map(p => {
      if (p.id === productId) {
        return { ...p, ...updatedFields, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    setStored(STORAGE_KEYS.PRODUCTS, state.products);
    notify();
  },

  addProduct: (product) => {
    const newPrd = {
      ...product,
      id: `PRD-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    state.products = [newPrd, ...state.products];
    setStored(STORAGE_KEYS.PRODUCTS, state.products);
    notify();
  },

  // EVENTS CMS
  addEvent: (eventData) => {
    const newEvt = {
      ...eventData,
      id: `EVT-${Date.now()}`,
      bookedCount: 0,
      createdAt: new Date().toISOString()
    };
    state.events = [newEvt, ...state.events];
    setStored(STORAGE_KEYS.EVENTS, state.events);
    notify();
  },

  // STORIES CMS
  addStory: (storyData) => {
    const newStory = {
      ...storyData,
      id: `STR-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    state.stories = [newStory, ...state.stories];
    setStored(STORAGE_KEYS.STORIES, state.stories);
    notify();
  },

  // AI AGENTS & ORCHESTRATION
  addAgentLog: (agent, action, details, status = 'SUCCESS', level = 'Level 1 (Autonomous)') => {
    const newLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      agent,
      action,
      details,
      status,
      level
    };
    state.agentLogs = [newLog, ...state.agentLogs.slice(0, 49)];
    setStored(STORAGE_KEYS.AGENT_LOGS, state.agentLogs);
    notify();
  },

  runConciergeQuery: (question) => {
    const q = (question || '').toLowerCase();
    let reply = '';

    if (q.includes('harga') || q.includes('biaya') || q.includes('tarif')) {
      reply = 'Harga paket utama Cibarani Weekend Experience saat ini adalah indikatif Rp 1.000.000 / orang untuk 2 Hari 1 Malam (Sabtu - Minggu), mencakup homestay tradisional, makan khas huma 3x, pemandu adat, eksplorasi leuit, dan kunjungan alam. Penyesuaian dapat diatur admin.';
    } else if (q.includes('rute') || q.includes('akses') || q.includes('krl') || q.includes('jalan') || q.includes('transportasi')) {
      reply = 'Akses perjalanan ekonomis: Naik KRL ke Stasiun Rangkasbitung -> Lanjut elf jurusan Parigi/Cibarani -> Turun di Gerbang Kasepuhan Cibarani -> Lanjut ojek warga lokal ke kampung adat. Kondisi jalan menyusuri lereng perbukitan bervariasi, kenakan alas kaki trekking yang nyaman.';
    } else if (q.includes('leuit') || q.includes('padi') || q.includes('makan') || q.includes('pangan')) {
      reply = 'Di Cibarani, ketahanan pangan dirawat melalui tradisi Leuit dan Rukun Tani. Gabah padi huma disimpan bertahun-tahun di lumbung panggung tradisional. Terdapat kesaksian personal mencicipi gabah berusia 32-40 tahun yang masih terjaga keharumannya!';
    } else if (q.includes('goa') || q.includes('dagul') || q.includes('sirah') || q.includes('banteng')) {
      reply = 'Goa Dagul adalah bentang alam karst alami habitat kelelawar, sedangkan Sirah Banteng adalah sumber mata air pegunungan yang jernih. Kunjungan ke kedua tempat ini wajib didampingi pemandu adat demi keselamatan dan menghormati kesakralan lingkungan.';
    } else if (q.includes('produk') || q.includes('madu') || q.includes('gula') || q.includes('oleh')) {
      reply = 'Produk lokal unggulan Cibarani meliputi Madu Odeng liar asli (indikasi Rp 300.000/botol), Gula Aren cetak murni, Pupuk Biofertilizer Guano Cibarani, dan aneka kerajinan bambu awet.';
    } else {
      reply = `Terima kasih atas pertanyaannya! Wewengkon Adat Kasepuhan Cibarani menyambut Anda untuk merasakan wisata budaya, alam, dan edukasi kedaulatan pangan. Anda dapat memilih tanggal di menu Booking atau menghubungi panitia Yayasan Sabumi Nusantara Jaya.`;
    }

    cibaraniStore.addAgentLog(
      'Cibarani Concierge Agent',
      'Pencarian Knowledge Base Tamu',
      `Tanya: "${question.slice(0, 40)}..." -> Dijawab berdasarkan panduan adat & profil resmi.`,
      'SUCCESS',
      'Level 1 (Autonomous)'
    );

    return reply;
  },

  approveAgentTask: (approvalId) => {
    state.agentApprovals = state.agentApprovals.map(a => {
      if (a.id === approvalId) {
        return { ...a, status: 'APPROVED', approvedAt: new Date().toISOString() };
      }
      return a;
    });
    setStored(STORAGE_KEYS.AGENT_APPROVALS, state.agentApprovals);

    cibaraniStore.addAgentLog(
      'Agent Orchestrator',
      `Persetujuan Tugas #${approvalId}`,
      'Admin memberikan persetujuan untuk eksekusi workflow Level 2.',
      'SUCCESS',
      'Level 2 (Approval Complete)'
    );

    notify();
  }
};

// React hook for consuming store in any component
export const useCibaraniStore = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return cibaraniStore.subscribe(() => setTick(t => t + 1));
  }, []);

  return {
    ...cibaraniStore.getState(),
    createBooking: cibaraniStore.createBooking,
    updateBookingStatus: cibaraniStore.updateBookingStatus,
    updatePackagePrice: cibaraniStore.updatePackagePrice,
    updateProduct: cibaraniStore.updateProduct,
    addProduct: cibaraniStore.addProduct,
    addEvent: cibaraniStore.addEvent,
    addStory: cibaraniStore.addStory,
    runConciergeQuery: cibaraniStore.runConciergeQuery,
    approveAgentTask: cibaraniStore.approveAgentTask,
    addAgentLog: cibaraniStore.addAgentLog
  };
};

