import { getFirebaseAdmin } from './_utils/firebaseAdmin.js';

const DEFAULT_ARTICLES = {
  1: {
    title: "Fisiologi Aliran Air dan Struktur Pembuluh Kapiler Bambu Petung",
    excerpt: "Studi mendalam mengenai efisiensi transportasi air mikroskopis pada serat bambu Dendrocalamus asper dan implikasinya terhadap kekuatan lentur alami.",
    author: "Prof. Dr. Ir. Hariadi Kusuma",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=hariadi"
  },
  2: {
    title: "Kearifan Lokal Pengawetan Bambu Alami via Perendaman Air Mengalir",
    excerpt: "Metode tradisional warisan leluhur Sunda dalam menetralkan kadar glukosa dan pati bambu demi mencegah serangan bubuk kayu secara permanen.",
    author: "Abah Ujang Winata",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ujang"
  },
  3: {
    title: "Laju Penyerapan Karbon Spesifik Rumpun Gigantochloa apus (Bambu Tali)",
    excerpt: "Kuantifikasi matematis biomassa bambu tali dalam menyerap karbon dioksida atmosfer dan kontribusinya terhadap pasar karbon internasional.",
    author: "Dr. Elizabeth Wong",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=elizabeth"
  },
  4: {
    title: "Integrasi Sambungan Baut Ganda pada Konstruksi Kuda-Kuda Bambu",
    excerpt: "Rekayasa mekanika sambungan modern untuk mengatasi kelemahan retak pecah ujung serat bambu pada konstruksi bangunan.",
    author: "Rian Hidayat, S.Ars.",
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

  // 2. Direct Firestore REST API fallback (works reliably without credentials)
  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/bamboochain-official/databases/(default)/documents/articles/${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = await res.json();
      const fields = data.fields || {};
      return {
        id,
        title: fields.title?.stringValue || '',
        excerpt: fields.excerpt?.stringValue || fields.content?.stringValue?.slice(0, 160) || '',
        author: fields.author?.stringValue || fields.username?.stringValue || 'Pegiat Bambu',
        image: fields.image?.stringValue || (fields.images?.arrayValue?.values?.[0]?.stringValue) || ''
      };
    }
  } catch (err) {
    console.error("Firestore REST API fetch error in share-article:", err);
  }

  return null;
}

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  const { id, type } = req.query;
  const isImageRequest = type === 'image' || req.query['amp;type'] === 'image' || (req.url && req.url.includes('/image'));
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.bamboochain.id';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  const article = id ? await getArticleFromDb(String(id)) : null;

  // IMAGE SERVING MODE: if image requested, serve the binary image or redirect
  if (isImageRequest) {
    const rawImg = article?.image || article?.images?.[0];
    if (!rawImg) {
      return res.redirect(302, `${baseUrl}/logos/bmc.png`);
    }

    if (rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
      return res.redirect(302, rawImg);
    }

    if (rawImg.startsWith('data:image/')) {
      const matches = rawImg.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/s);
      if (matches) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
        return res.status(200).send(buffer);
      }
    }

    return res.redirect(302, `${baseUrl}/logos/bmc.png`);
  }

  // HTML OPEN GRAPH MODE:
  const articleTitle = article?.title || 'BaMbooChain Academy - Kolom & Esai Ilmiah';
  const pageTitle = `${articleTitle} | BaMbooChain`;
  const description = article?.excerpt || 'Eksplorasi mendalam tentang sains, budidaya, arsitektur, dan ekologi bambu langsung dari para pegiat bambu Nusantara di BaMbooChain.';
  
  let imageUrl = `${baseUrl}/logos/bmc.png`;
  if (article) {
    const rawImg = article.image || article.images?.[0];
    if (rawImg) {
      if (rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
        imageUrl = rawImg;
      } else {
        // Clean image URL without query params to prevent parser issues in WhatsApp
        imageUrl = `${baseUrl}/article/${encodeURIComponent(id)}/image`;
      }
    }
  }

  const targetAppUrl = `${baseUrl}/#/bamboochain/academy${id ? `?article=${encodeURIComponent(id)}` : ''}`;
  const canonicalUrl = `${baseUrl}/article/${id || ''}`;

  const html = `<!doctype html>
<html lang="id" prefix="og: http://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">

  <!-- Open Graph / WhatsApp / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="BaMbooChain">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(articleTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(articleTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${imageUrl}">

  <!-- Instant Browser Redirect for Real Users (Not Executed by WhatsApp Bot) -->
  <script>
    window.location.replace(${JSON.stringify(targetAppUrl)});
  </script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .card {
      max-width: 480px;
      background: #1e293b;
      padding: 32px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      border: 1px solid #334155;
    }
    h1 {
      font-size: 1.2rem;
      margin-bottom: 12px;
      color: #38d9a9;
    }
    p {
      font-size: 0.95rem;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    a {
      display: inline-block;
      background: #0ca678;
      color: white;
      padding: 12px 24px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Membuka Artikel...</h1>
    <p>${escapeHtml(articleTitle)}</p>
    <a href="${escapeHtml(targetAppUrl)}">Lanjut ke Artikel</a>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  return res.status(200).send(html);
}
