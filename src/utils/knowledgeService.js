import { db, storage } from '../firebase/config';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

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

export const createKnowledgeItem = async ({ form, file, user }) => {
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
    await uploadBytes(fileRef, file);
    fileUrl = await getDownloadURL(fileRef);
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
  return addDoc(collection(db, KNOWLEDGE_COLLECTION), payload);
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

  return updateDoc(doc(db, KNOWLEDGE_COLLECTION, itemId), {
    status,
    adminNotes: cleanText(adminNotes),
    updatedAt: serverTimestamp(),
    ...statusFields
  });
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
