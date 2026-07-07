import { db, storage } from '../firebase/config';
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
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';

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

const uploadFileHelper = (fileRef, file, onProgress) => {
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (error) {
          reject(error);
        }
      }
    );
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
      // Storage upload gagal (CORS, network, rules) — tetap lanjut simpan metadata
      console.warn('[Knowledge] File upload ke Firebase Storage gagal, melanjutkan tanpa file:', storageError.message);
      // Kembalikan pesan error ke caller melalui properti opsional
      if (onProgress) onProgress(-1); // sinyal error upload
      fileUrl = '';
      filePath = '';
      // Lempar error dengan flag khusus agar UI bisa membedakan
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
  const q = query(
    collection(db, KNOWLEDGE_COLLECTION),
    where('status', '==', 'approved'),
    orderBy('createdAt', 'desc'),
    limit(maxItems)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
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

  const lower = content.toLowerCase();
  const hit = queryTokens.find((token) => lower.includes(token));
  const index = hit ? lower.indexOf(hit) : 0;
  const start = Math.max(0, index - 90);
  const snippet = content.slice(start, start + 280);
  return `${start > 0 ? '...' : ''}${snippet}${start + 280 < content.length ? '...' : ''}`;
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
