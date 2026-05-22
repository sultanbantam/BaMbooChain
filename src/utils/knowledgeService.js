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
    if (onProgress) {
      fileUrl = await uploadFileHelper(fileRef, file, onProgress);
    } else {
      await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(fileRef);
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
    if (onProgress) {
      fileUrl = await uploadFileHelper(fileRef, file, onProgress);
    } else {
      await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(fileRef);
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

  // Sinkronkan ke koleksi validations
  const validationsRef = collection(db, 'validations');
  const q = query(validationsRef);
  const snapshot = await getDocs(q);
  const valDoc = snapshot.docs.find(d => d.data().details?.knowledgeId === itemId);

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

export const subscribeKnowledgeItems = ({ status = 'approved', callback, onError }) => {
  const q = query(collection(db, KNOWLEDGE_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .filter((item) => status === 'all' || item.status === status);
      callback(items);
    },
    onError
  );
};

export const getApprovedKnowledgeItems = async (maxItems = 80) => {
  const q = query(
    collection(db, KNOWLEDGE_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(Math.max(maxItems, 120))
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
    .filter((item) => item.status === 'approved')
    .slice(0, maxItems);
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

  // Sinkronkan status ke validations
  const validationsRef = collection(db, 'validations');
  const q = query(validationsRef);
  const snapshot = await getDocs(q);
  const valDoc = snapshot.docs.find(d => d.data().details?.knowledgeId === itemId);

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

export const searchKnowledge = (items, question, maxResults = 5) => {
  const queryTokens = tokenize(question);
  if (queryTokens.length === 0) return [];

  return items
    .map((item) => {
      const text = item.searchText || extractSearchText(item);
      const score = queryTokens.reduce((sum, token) => {
        if (!text.includes(token)) return sum;
        const titleBoost = (item.title || '').toLowerCase().includes(token) ? 4 : 0;
        const speciesBoost = (item.species || '').toLowerCase().includes(token) ? 3 : 0;
        return sum + 1 + titleBoost + speciesBoost;
      }, 0);
      return {
        item,
        score,
        snippet: buildSnippet(item, queryTokens)
      };
    })
    .filter((result) => result.score > 0)
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
