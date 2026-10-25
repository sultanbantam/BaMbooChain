import { getFirebaseAdmin } from './_utils/firebaseAdmin.js';

const DEFAULT_ARTICLES = {
  1: {
    title: "Fisiologi Aliran Air dan Struktur Pembuluh Kapiler Bambu Petung",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=hariadi"
  },
  2: {
    title: "Kearifan Lokal Pengawetan Bambu Alami via Perendaman Air Mengalir",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ujang"
  },
  3: {
    title: "Laju Penyerapan Karbon Spesifik Rumpun Gigantochloa apus (Bambu Tali)",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=elizabeth"
  },
  4: {
    title: "Integrasi Sambungan Baut Ganda pada Konstruksi Kuda-Kuda Bambu",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=rian"
  }
};

async function getArticleFromDb(id) {
  if (DEFAULT_ARTICLES[id]) {
    return DEFAULT_ARTICLES[id];
  }

  // 1. Try Firebase Admin
  try {
    const adminApp = getFirebaseAdmin();
    if (adminApp && !adminApp.error && typeof adminApp.firestore === 'function') {
      const snap = await adminApp.firestore().collection('articles').doc(id).get();
      if (snap.exists) {
        return snap.data();
      }
    }
  } catch (e) {
    console.warn("Firebase Admin fetch error:", e.message);
  }

  // 2. Direct Firestore REST API fallback (works without credentials)
  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/bamboochain-official/databases/(default)/documents/articles/${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = await res.json();
      const fields = data.fields || {};
      return {
        id,
        title: fields.title?.stringValue || '',
        image: fields.image?.stringValue || (fields.images?.arrayValue?.values?.[0]?.stringValue) || ''
      };
    }
  } catch (err) {
    console.error("Firestore REST API fetch error in article-image:", err);
  }

  return null;
}

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    return res.redirect(302, 'https://www.bamboochain.id/logos/bmc.png');
  }

  try {
    const article = await getArticleFromDb(String(id));
    const image = article?.image || article?.images?.[0];

    if (!image) {
      return res.redirect(302, 'https://www.bamboochain.id/logos/bmc.png');
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return res.redirect(302, image);
    }

    if (image.startsWith('data:image/')) {
      const matches = image.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/s);
      if (matches) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
        return res.status(200).send(buffer);
      }
    }

    return res.redirect(302, 'https://www.bamboochain.id/logos/bmc.png');
  } catch (err) {
    console.error("article-image error:", err);
    return res.redirect(302, 'https://www.bamboochain.id/logos/bmc.png');
  }
}
