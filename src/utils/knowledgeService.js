import { db } from '../firebase/config';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  setDoc,
  increment,
  arrayUnion,
  where
} from 'firebase/firestore';
// Firebase Storage imports removed - migrated to Cloudinary

export const KNOWLEDGE_COLLECTION = 'knowledge_items';

export const KNOWLEDGE_TYPES = [
  'Artikel',
  'Riset',
  'Ebook',
  'Jurnal',
  'Hasil Penelitian',
  'Dataset',
  'Gambar',
  'Catatan Lapangan'
];

const cleanText = (value = '') =>
  value
    .replace(/\s+/g, ' ')
    .replace(/[^\S\r\n]+/g, ' ')
    .trim();

export const generateEmbedding = async (text) => {
  try {
    const hfKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
    if (hfKey) {
      const res = await fetch('https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hfKey}`
        },
        body: JSON.stringify({ inputs: [text] })
      });
      if (res.ok) {
        const data = await res.json();
        const vector = Array.isArray(data[0]) ? data[0] : data;
        return vector;
      }
    } else {
      console.warn('[RAG] Missing VITE_HUGGINGFACE_API_KEY environment variable');
    }
  } catch (error) {
    console.warn('[RAG] Failed to generate embedding:', error);
  }
  return null;
};

export const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const extractSearchText = (item) => {
  const parts = [
    item.title,
    item.author,
    item.publisher,
    item.year,
    item.location,
    item.species,
    item.tags,
    item.summary,
    item.extractedText,
    item.adminNotes
  ];
  return cleanText(parts.filter(Boolean).join(' ')).toLowerCase();
};

const uploadFileHelper = async (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      return reject(new Error("Cloudinary configuration is missing."));
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url);
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.error.message || 'Upload failed'));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
};

export const createKnowledgeItem = async ({ form, file, user, onProgress }) => {
  let fileUrl = '';
  let filePath = '';
  let fileName = '';
  let fileType = '';
  let fileSize = 0;

  if (file) {
    fileName = file.name;
    fileType = file.type || 'application/octet-stream';
    fileSize = file.size;
    // We don't need filePath for Cloudinary, but keep it for compatibility if needed
    filePath = `cloudinary/${user?.id || 'guest'}/${Date.now()}`; 
    try {
      fileUrl = await uploadFileHelper(file, onProgress);
    } catch (uploadError) {
      console.warn('[Knowledge] File upload ke Cloudinary gagal, melanjutkan tanpa file:', uploadError.message);
      if (onProgress) onProgress(-1);
      fileUrl = '';
      filePath = '';
      const err = new Error(`FILE_UPLOAD_FAILED: ${uploadError.message}`);
      err.code = 'upload/cloudinary-error';
      err.fileUploadOnly = true;
      throw err;
    }
  }

  const payload = {
    ...form,
    title: cleanText(form.title),
    summary: cleanText(form.summary),
    extractedText: cleanText(form.extractedText),
    tags: cleanText(form.tags),
    status: 'pending',
    sourceTrust: 'unverified',
    fileUrl,
    filePath,
    fileName,
    fileType,
    fileSize,
    createdBy: user?.id || 'guest',
    createdByName: user?.name || user?.username || 'Kontributor',
    createdByUsername: user?.username || 'guest',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    approvedAt: null,
    approvedBy: null,
    rejectedAt: null,
    rejectedBy: null,
    searchText: ''
  };

  payload.searchText = extractSearchText(payload);
  
  // RAG: Generate vector embedding
  const vector = await generateEmbedding(payload.searchText);
  if (vector) {
    payload.vector = vector;
  }

  const docRef = await addDoc(collection(db, KNOWLEDGE_COLLECTION), payload);

  // Buat dokumen validasi baru di koleksi validations
  const validationId = 'val_k_' + Date.now();
  const validationItem = {
    id: validationId,
    title: `Verifikasi Knowledge: ${payload.title}`,
    tags: `Knowledge, ${payload.type}`,
    gps: payload.location || 'Online',
    date: new Date().toISOString(),
    status: 'pending',
    rewardAmount: 25.0, // Insentif token BMC yang layak
    userId: user?.id || 'guest',
    plantingId: null,
    uploadedFiles: fileUrl ? { [fileName || 'Berkas']: fileUrl } : {},
    details: {
      name: payload.createdByName,
      knowledgeId: docRef.id,
      pemilik: payload.createdByName
    }
  };

  await setDoc(doc(db, "validations", validationId), validationItem);
  return docRef;
};

export const updateKnowledgeItem = async ({ itemId, form, file, user, onProgress }) => {
  let fileUrl = form.fileUrl || '';
  let filePath = form.filePath || '';
  let fileName = form.fileName || '';
  let fileType = form.fileType || '';
  let fileSize = form.fileSize || 0;

  if (file) {
    fileName = file.name;
    fileType = file.type || 'application/octet-stream';
    fileSize = file.size;
    filePath = `knowledge/${user?.id || 'guest'}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const fileRef = ref(storage, filePath);
    try {
      if (onProgress) {
        fileUrl = await uploadFileHelper(fileRef, file, onProgress);
      } else {
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      }
    } catch (storageError) {
      console.warn('[Knowledge] File upload ke Firebase Storage gagal (update), melanjutkan tanpa file baru:', storageError.message);
      if (onProgress) onProgress(-1);
      // Pertahankan file lama jika ada
      fileUrl = form.fileUrl || '';
      filePath = form.filePath || '';
      fileName = form.fileName || '';
      fileType = form.fileType || '';
      fileSize = form.fileSize || 0;
      const err = new Error(`FILE_UPLOAD_FAILED: ${storageError.message}`);
      err.code = storageError.code || 'storage/unknown';
      err.fileUploadOnly = true;
      throw err;
    }
  }

  const payload = {
    ...form,
    title: cleanText(form.title),
    summary: cleanText(form.summary),
    extractedText: cleanText(form.extractedText),
    tags: cleanText(form.tags),
    status: 'pending', // Reset status ke pending saat diedit
    sourceTrust: 'unverified',
    fileUrl,
    filePath,
    fileName,
    fileType,
    fileSize,
    updatedAt: serverTimestamp()
  };

  payload.searchText = extractSearchText(payload);
  await updateDoc(doc(db, KNOWLEDGE_COLLECTION, itemId), payload);

  // Sinkronkan ke koleksi validations - gunakan query berfilter, bukan full scan
  const validationsRef = collection(db, 'validations');
  const q = query(validationsRef, where('details.knowledgeId', '==', itemId));
  const snapshot = await getDocs(q);
  const valDoc = snapshot.docs[0]; // Ambil dokumen pertama yang cocok

  if (valDoc) {
    const valData = valDoc.data();
    await updateDoc(doc(db, 'validations', valDoc.id), {
      title: `Verifikasi Knowledge: ${payload.title}`,
      tags: `Knowledge, ${payload.type}`,
      gps: payload.location || 'Online',
      status: 'pending', // Reset status di validations juga
      uploadedFiles: fileUrl ? { [fileName || 'Berkas']: fileUrl } : {},
      details: {
        ...valData.details,
        name: payload.createdByName || valData.details.name,
        pemilik: payload.createdByName || valData.details.pemilik
      }
    });
  } else {
    const validationId = 'val_k_' + Date.now();
    const validationItem = {
      id: validationId,
      title: `Verifikasi Knowledge: ${payload.title}`,
      tags: `Knowledge, ${payload.type}`,
      gps: payload.location || 'Online',
      date: new Date().toISOString(),
      status: 'pending',
      rewardAmount: 25.0,
      userId: user?.id || 'guest',
      plantingId: null,
      uploadedFiles: fileUrl ? { [fileName || 'Berkas']: fileUrl } : {},
      details: {
        name: user?.name || user?.username || 'Kontributor',
        knowledgeId: itemId,
        pemilik: user?.name || user?.username || 'Kontributor'
      }
    };
    await setDoc(doc(db, 'validations', validationId), validationItem);
  }
};

export const subscribeApprovedKnowledgeItems = ({ callback, onError, limitCount = 30 }) => {
  const q = query(
    collection(db, KNOWLEDGE_COLLECTION),
    where('status', '==', 'approved'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      callback(items);
    },
    onError
  );
};

export const subscribeUserKnowledgeSubmissions = ({ userId, callback, onError }) => {
  const q = query(
    collection(db, KNOWLEDGE_COLLECTION),
    where('createdBy', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      callback(items);
    },
    onError
  );
};

export const subscribeKnowledgeItems = ({ status = 'approved', callback, onError, limitCount = 50 }) => {
  const q = status === 'all'
    ? query(collection(db, KNOWLEDGE_COLLECTION), orderBy('createdAt', 'desc'), limit(limitCount))
    : query(collection(db, KNOWLEDGE_COLLECTION), where('status', '==', status), orderBy('createdAt', 'desc'), limit(limitCount));
    
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      callback(items);
    },
    onError
  );
};

export const getApprovedKnowledgeItems = async (maxItems = 80) => {
  // Query only by status to avoid Firestore composite index requirements
  const q = query(
    collection(db, KNOWLEDGE_COLLECTION),
    where('status', '==', 'approved')
  );
  const snapshot = await getDocs(q);
  let docs = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  
  // Sort by createdAt descending in memory
  docs.sort((a, b) => {
    const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return tB - tA;
  });
  
  return docs.slice(0, maxItems);
};

export const updateKnowledgeStatus = async ({ itemId, status, admin, adminNotes = '' }) => {
  const statusFields =
    status === 'approved'
      ? {
          approvedAt: serverTimestamp(),
          approvedBy: admin?.username || admin?.name || 'admin',
          sourceTrust: 'verified'
        }
      : {
          rejectedAt: serverTimestamp(),
          rejectedBy: admin?.username || admin?.name || 'admin',
          sourceTrust: 'rejected'
        };

  await updateDoc(doc(db, KNOWLEDGE_COLLECTION, itemId), {
    status,
    adminNotes: cleanText(adminNotes),
    updatedAt: serverTimestamp(),
    ...statusFields
  });

  // Sinkronkan status ke validations - query berfilter untuk efisiensi
  const validationsRef = collection(db, 'validations');
  const q = query(validationsRef, where('details.knowledgeId', '==', itemId));
  const snapshot = await getDocs(q);
  const valDoc = snapshot.docs[0];

  if (valDoc) {
    await updateDoc(doc(db, 'validations', valDoc.id), {
      status: status === 'approved' ? 'approved' : 'rejected',
      updatedAt: serverTimestamp()
    });
  }

  // Berikan reward ke user/kontributor jika disetujui
  if (status === 'approved') {
    const itemDoc = await getDoc(doc(db, KNOWLEDGE_COLLECTION, itemId));
    if (itemDoc.exists()) {
      const itemData = itemDoc.data();
      const contributorId = itemData.createdBy;
      
      if (contributorId && contributorId !== 'guest') {
        const rewardAmount = 25.0;
        const newTx = {
          id: 'tx_' + Math.random().toString(36).substr(2, 9),
          type: 'Earn',
          amount: `+${rewardAmount}`,
          date: new Intl.DateTimeFormat('fr-CA', { timeZone: 'Asia/Jakarta' }).format(new Date()),
          status: 'Selesai',
          description: `Reward Kontribusi Pengetahuan (Bambupedia)`
        };
        try {
          await updateDoc(doc(db, "users", contributorId), {
            bmcBalance: increment(rewardAmount),
            transactions: arrayUnion(newTx)
          });
        } catch (err) {
          console.error("Gagal mengirim reward ke kontributor:", err);
        }
      }
    }
  }
};

const tokenize = (text = '') =>
  cleanText(text)
    .toLowerCase()
    .split(/[^a-z0-9\u00c0-\u024f\u1e00-\u1eff]+/i)
    .filter((token) => token.length > 2);

const buildSnippet = (item, queryTokens) => {
  const content = cleanText([item.summary, item.extractedText].filter(Boolean).join(' '));
  if (!content) return 'Belum ada ringkasan teks. Buka sumber untuk membaca dokumen asli.';

  // For LLM RAG, we need a larger chunk of text, not just a tiny 280 char preview.
  const lower = content.toLowerCase();
  const hit = queryTokens.find((token) => lower.includes(token));
  const index = hit ? lower.indexOf(hit) : 0;
  
  // Provide up to 2000 characters to ensure we capture all speakers/details
  const start = Math.max(0, index - 500);
  const snippet = content.slice(start, start + 2000);
  return `${start > 0 ? '...' : ''}${snippet}${start + 2000 < content.length ? '...' : ''}`;
};

export const searchKnowledge = async (items, question, maxResults = 5) => {
  const queryTokens = tokenize(question);
  if (queryTokens.length === 0) return [];

  const questionVector = await generateEmbedding(question);

  return items
    .map((item) => {
      const text = item.searchText || extractSearchText(item);
      const lexicalScore = queryTokens.reduce((sum, token) => {
        if (!text.includes(token)) return sum;
        const titleBoost = (item.title || '').toLowerCase().includes(token) ? 4 : 0;
        const speciesBoost = (item.species || '').toLowerCase().includes(token) ? 3 : 0;
        return sum + 1 + titleBoost + speciesBoost;
      }, 0);
      
      let vectorScore = 0;
      if (questionVector && item.vector) {
        vectorScore = cosineSimilarity(questionVector, item.vector);
      }
      
      // Combine scores: Vector similarity (0-1) scaled to match lexical scale
      const finalScore = vectorScore * 10 + lexicalScore;

      return {
        item,
        score: finalScore,
        snippet: buildSnippet(item, queryTokens),
        vectorScore
      };
    })
    .filter((result) => result.score > 0 || result.vectorScore > 0.3)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
};

export const composeRagAnswer = (question, results) => {
  if (results.length === 0) {
    return {
      answer:
        'Saya belum menemukan sumber terverifikasi yang cukup kuat di Knowledge Library. Coba gunakan kata kunci spesies, lokasi, produk, atau topik yang lebih spesifik, atau unggah sumber baru untuk diverifikasi admin.',
      confidence: 'rendah'
    };
  }

  const sourceLines = results.map(({ item, snippet }, index) => {
    const source = [item.author, item.year].filter(Boolean).join(', ');
    return `${index + 1}. ${item.title}${source ? ` (${source})` : ''}: ${snippet}`;
  });

  return {
    answer: `Berdasarkan ${results.length} sumber terverifikasi di Knowledge Library, jawaban paling relevan:\n\n${sourceLines.join('\n\n')}\n\nGunakan hasil ini sebagai sintesis awal. Untuk keputusan teknis, buka sumber asli dan cek konteks penelitian/lokasi.`,
    confidence: results[0].score >= 8 ? 'tinggi' : 'sedang'
  };
};

// ============================================================================
// ECOSYSTEM KNOWLEDGE SYNC & ADAPTIVE TAXONOMY RAG
// ============================================================================

/**
 * Menyelaraskan data lapangan (Tracker Bambu, Taksonomi AI, Proyek, dll.) ke Knowledge Library
 * agar BambuBot RAG dan pencarian pengetahuan otomatis bertambah pintar seiring data masuk.
 */
export const syncActivityToKnowledgeBase = async ({
  sourceType = 'tracker',
  sourceId = '',
  title = '',
  species = '',
  location = '',
  summary = '',
  extractedText = '',
  tags = '',
  user = null,
  isVerified = false
}) => {
  if (!db || !title) return null;
  const safeId = String(sourceId || Date.now()).replace(/[^a-zA-Z0-9_-]/g, '_');
  const docId = `eco_${sourceType}_${safeId}`;

  const payload = {
    title: cleanText(title),
    type: sourceType === 'taxonomy' ? 'Dataset' : 'Catatan Lapangan',
    species: cleanText(species),
    location: cleanText(location),
    author: user?.name || user?.displayName || user?.username || 'Kontributor Lapangan',
    year: String(new Date().getFullYear()),
    summary: cleanText(summary),
    extractedText: cleanText(extractedText || summary),
    tags: cleanText([tags, sourceType, species, location].filter(Boolean).join(', ')),
    status: 'approved',
    sourceTrust: isVerified ? 'verified' : 'ecosystem_live',
    sourceType,
    sourceId: safeId,
    createdBy: user?.uid || user?.id || 'ecosystem',
    updatedAt: serverTimestamp()
  };

  payload.searchText = extractSearchText(payload);

  try {
    const vector = await generateEmbedding(payload.searchText);
    if (vector) {
      payload.vector = vector;
    }
    await setDoc(doc(db, KNOWLEDGE_COLLECTION, docId), {
      ...payload,
      createdAt: serverTimestamp()
    }, { merge: true });
    return docId;
  } catch (err) {
    console.warn('[KnowledgeSync] Gagal menyelaraskan aktivitas ke Knowledge Library:', err?.message || err);
    return null;
  }
};

/**
 * Mengambil referensi taksonomi terakumulasi dari Firestore (taxonomies + knowledge_items)
 * untuk memperkaya prompt Analisis Taksonomi AI (In-Context RAG).
 */
export const getVerifiedTaxonomyReferences = async ({ lokasi = '', diameter = '', warna = '', maxItems = 8 } = {}) => {
  if (!db) return { references: [], totalDatabaseCount: 0 };
  const refs = [];

  try {
    const taxSnap = await getDocs(query(collection(db, 'taxonomies'), limit(35)));
    taxSnap.forEach((d) => {
      const data = d.data();
      if (!data?.species || data.species === 'Spesies Tidak Diketahui') return;
      refs.push({
        id: d.id,
        source: 'taxonomies',
        species: data.species,
        confidence: data.confidence || '',
        lokasi: data.lokasi || data.location || '',
        diameter: data.diameter || '',
        warna: data.warna || '',
        details: cleanText(data.details || '').slice(0, 260),
        isVerified: Boolean(data.isVerified || parseInt(String(data.confidence || '0'), 10) >= 85)
      });
    });
  } catch (err) {
    console.warn('[TaxonomyRAG] Gagal membaca koleksi taxonomies:', err?.message || err);
  }

  try {
    const kbSnap = await getDocs(query(collection(db, KNOWLEDGE_COLLECTION), where('status', '==', 'approved'), limit(30)));
    kbSnap.forEach((d) => {
      const data = d.data();
      if (!data?.species) return;
      refs.push({
        id: d.id,
        source: 'knowledge_items',
        species: data.species,
        confidence: 'Verified KB',
        lokasi: data.location || '',
        diameter: '',
        warna: '',
        details: cleanText(data.summary || data.extractedText || '').slice(0, 260),
        isVerified: true
      });
    });
  } catch (err) {
    console.warn('[TaxonomyRAG] Gagal membaca koleksi knowledge_items:', err?.message || err);
  }

  const lokLower = String(lokasi || '').toLowerCase();
  const warnaLower = String(warna || '').toLowerCase();
  const diamLower = String(diameter || '').toLowerCase();

  const scored = refs
    .map((r) => {
      let score = r.isVerified ? 3 : 1;
      if (lokLower && r.lokasi && r.lokasi.toLowerCase().includes(lokLower)) score += 4;
      if (warnaLower && r.details.toLowerCase().includes(warnaLower)) score += 2;
      if (diamLower && r.details.toLowerCase().includes(diamLower)) score += 2;
      if (r.details.length > 60) score += 1;
      return { ...r, score };
    })
    .sort((a, b) => b.score - a.score);

  // Deduplikasi berdasarkan nama spesies + lokasi agar variasi spesies maksimal
  const seen = new Set();
  const uniqueTop = [];
  for (const item of scored) {
    const key = `${item.species.toLowerCase()}_${item.lokasi.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueTop.push(item);
    if (uniqueTop.length >= maxItems) break;
  }

  return {
    references: uniqueTop,
    totalDatabaseCount: refs.length
  };
};

/**
 * Menghasilkan ringkasan konteks langsung dari koleksi ekosistem BaMbooChain (taxonomies, plantings, harvests, projects, events)
 * agar BambuBot RAG selalu mengetahui data operasional terbaru di seluruh situs.
 */
export const getEcosystemLiveContext = async () => {
  if (!db) return [];
  const virtualItems = [];

  try {
    const [taxSnap, plantSnap, harvestSnap, projSnap] = await Promise.all([
      getDocs(query(collection(db, 'taxonomies'), limit(30))),
      getDocs(query(collection(db, 'plantings'), limit(30))),
      getDocs(query(collection(db, 'harvests'), limit(20))),
      getDocs(query(collection(db, 'projects'), limit(20)))
    ]);

    if (!taxSnap.empty) {
      const speciesCounts = {};
      const recentNotes = [];
      taxSnap.forEach((d) => {
        const data = d.data();
        if (data.species) {
          speciesCounts[data.species] = (speciesCounts[data.species] || 0) + 1;
        }
        if (data.species && data.details) {
          recentNotes.push(`${data.species} (${data.confidence || '-'}, lokasi: ${data.lokasi || data.location || '-'}): ${cleanText(data.details).slice(0, 140)}`);
        }
      });
      const summaryText = `Total ${taxSnap.size} hasil analisis taksonomi AI tercatat. Sebaran spesies: ${Object.entries(speciesCounts).map(([sp, c]) => `${sp} (${c}x)`).join(', ')}. Catatan morfologi terbaru: ${recentNotes.slice(0, 5).join(' | ')}`;
      virtualItems.push({
        id: 'live_taxonomies_summary',
        title: 'Database Live Analisis Taksonomi AI Bambupedia',
        type: 'Dataset',
        species: Object.keys(speciesCounts).join(', '),
        author: 'Sistem AI Bambupedia',
        year: String(new Date().getFullYear()),
        summary: summaryText,
        extractedText: summaryText,
        searchText: summaryText.toLowerCase()
      });
    }

    if (!plantSnap.empty || !harvestSnap.empty) {
      let totalPlanted = 0;
      const plantedSpecies = new Set();
      const locations = new Set();
      plantSnap.forEach((d) => {
        const data = d.data();
        totalPlanted += Number(data.amount) || 0;
        if (data.species) plantedSpecies.add(data.species);
        if (data.location) locations.add(data.location);
      });
      let totalHarvested = 0;
      harvestSnap.forEach((d) => {
        totalHarvested += Number(d.data().amount) || 0;
      });
      const trackerText = `Tracker Bambu mencatat ${plantSnap.size} aktivitas tanam (${totalPlanted} batang) dan ${harvestSnap.size} aktivitas panen (${totalHarvested} batang). Spesies ditanam: ${Array.from(plantedSpecies).join(', ') || 'Beragam'}. Lokasi: ${Array.from(locations).join(', ') || 'Indonesia'}.`;
      virtualItems.push({
        id: 'live_tracker_summary',
        title: 'Database Live Tracker Tanam & Panen Bambu',
        type: 'Catatan Lapangan',
        species: Array.from(plantedSpecies).join(', '),
        author: 'Tracker Bambupedia',
        year: String(new Date().getFullYear()),
        summary: trackerText,
        extractedText: trackerText,
        searchText: trackerText.toLowerCase()
      });
    }

    if (!projSnap.empty) {
      const projLines = [];
      projSnap.forEach((d) => {
        const p = d.data();
        projLines.push(`${p.title || p.name || d.id} (${p.location || 'Indonesia'}, status: ${p.status || 'aktif'})`);
      });
      const projText = `Terdapat ${projSnap.size} proyek bambu terdaftar di ekosistem BaMbooChain: ${projLines.join('; ')}.`;
      virtualItems.push({
        id: 'live_projects_summary',
        title: 'Daftar Proyek Aktif Ekosistem BaMbooChain',
        type: 'Dataset',
        author: 'Ekosistem BaMbooChain',
        year: String(new Date().getFullYear()),
        summary: projText,
        extractedText: projText,
        searchText: projText.toLowerCase()
      });
    }
  } catch (err) {
    console.warn('[EcosystemContext] Gagal memuat ringkasan ekosistem live:', err?.message || err);
  }

  return virtualItems;
};
