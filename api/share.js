import { getFirebaseAdmin } from './_utils/firebaseAdmin.js';

// =========================================================================
// DEFAULT DATA & FALLBACKS
// =========================================================================

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

const DEFAULT_EVENTS = {
  'EjZLrmeM7AjALZaZGJ8K': {
    id: 'EjZLrmeM7AjALZaZGJ8K',
    title: 'WEEKEND ESCAPE CIBARANI - BADUY | Explore Nature, Experience Culture & Green Adventure',
    date: '2026-11-14 s/d 2026-11-15',
    time: '06:00 - 18:00 WIB',
    location: 'Kasepuhan Cibarani & Kawasan Baduy, Banten. Meeting Point: Stasiun Rangkasbitung',
    category: 'Wisata & Adventure',
    image: 'https://res.cloudinary.com/dsieguutz/image/upload/v1793512951/bv3bidc9w7lwobrhxgbv.jpg',
    ticketPrice: '650.000',
    ticketBmc: '41',
    description: 'Tinggalkan sejenak hiruk-pikuk kota dan bergabunglah dalam perjalanan istimewa 2 hari 1 malam menjelajahi keindahan alam, budaya, dan kehidupan masyarakat adat Banten Kidul.'
  },
  'fgd-rumah-modular-2026': {
    id: 'fgd-rumah-modular-2026',
    title: 'Workshop & FGD Capacity Building Perancangan Prototype Rumah Modular Bambu',
    date: '1-2 Juli 2026',
    time: '08:00 - 16:00 WIB',
    location: 'Gedung Galeri Koperasi dan UKM Kota Tangerang Selatan',
    category: 'Workshop & FGD',
    image: 'https://www.bamboochain.id/gambar/bfgd.png',
    description: 'Forum diskusi terarah dan workshop arsitektur bambu modular bersama Kementerian PKP, Kementerian PU, dan tim ahli BaMbooChain.'
  },
  'hbd-2026': {
    id: 'hbd-2026',
    title: 'Peringatan Hari Bambu Dunia 2026',
    date: '18-20 September 2026',
    time: '08:00 - 16:00 WIB',
    location: 'Wewengkon Adat Kasepuhan Cibarani, Lebak Banten',
    category: 'Peringatan & Budaya',
    image: 'https://www.bamboochain.id/gambar/hbd.png',
    description: 'Peringatan akbar Hari Bambu Dunia bersama para pegiat, tetua adat kasepuhan, dan inovator teknologi hijau.'
  }
};

const FEATURED_EVENT_FALLBACK_ID = 'EjZLrmeM7AjALZaZGJ8K';

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =========================================================================
// DATA FETCHERS
// =========================================================================

async function getUserFromDb(rawUsername = '') {
  const clean = String(rawUsername).trim().toLowerCase().replace(/^@/, '');
  if (!clean) return null;

  try {
    const adminApp = getFirebaseAdmin();
    if (adminApp && !adminApp.error && typeof adminApp.firestore === 'function') {
      const db = adminApp.firestore();
      const snap = await db.collection('users').where('username', '==', clean).limit(1).get();
      if (!snap.empty) {
        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      const directDoc = await db.collection('users').doc(clean).get();
      if (directDoc.exists) {
        return { id: directDoc.id, ...directDoc.data() };
      }
    }
  } catch (err) {
    console.warn("Firebase Admin user lookup error:", err.message);
  }

  try {
    const runQueryUrl = 'https://firestore.googleapis.com/v1/projects/bamboochain-official/databases/(default)/documents:runQuery';
    const res = await fetch(runQueryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'users' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'username' },
              op: 'EQUAL',
              value: { stringValue: clean }
            }
          },
          limit: 1
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0 && data[0].document) {
        const docObj = data[0].document;
        const f = docObj.fields || {};
        const docId = (docObj.name || '').split('/').pop();
        return {
          id: docId,
          name: f.name?.stringValue || '',
          username: f.username?.stringValue || clean,
          bioText: f.bioText?.stringValue || '',
          role: f.role?.stringValue || '',
          kycStatus: f.kycStatus?.stringValue || '',
          avatarUrl: f.avatarUrl?.stringValue || '',
          bannerUrl: f.bannerUrl?.stringValue || ''
        };
      }
    }

    const directRes = await fetch(`https://firestore.googleapis.com/v1/projects/bamboochain-official/databases/(default)/documents/users/${encodeURIComponent(clean)}`);
    if (directRes.ok) {
      const docObj = await directRes.json();
      const f = docObj.fields || {};
      const docId = (docObj.name || '').split('/').pop();
      return {
        id: docId,
        name: f.name?.stringValue || '',
        username: f.username?.stringValue || clean,
        bioText: f.bioText?.stringValue || '',
        role: f.role?.stringValue || '',
        kycStatus: f.kycStatus?.stringValue || '',
        avatarUrl: f.avatarUrl?.stringValue || '',
        bannerUrl: f.bannerUrl?.stringValue || ''
      };
    }
  } catch (restErr) {
    console.error("Firestore REST user query error:", restErr.message);
  }

  return null;
}

async function getArticleFromDb(id) {
  if (DEFAULT_ARTICLES[id]) return DEFAULT_ARTICLES[id];

  try {
    const adminApp = getFirebaseAdmin();
    if (adminApp && !adminApp.error && typeof adminApp.firestore === 'function') {
      const snap = await adminApp.firestore().collection('articles').doc(id).get();
      if (snap.exists) return snap.data();
    }
  } catch (e) {
    console.warn("Firebase Admin fetch error:", e.message);
  }

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

async function getEventFromDb(id) {
  if (id && DEFAULT_EVENTS[id]) return DEFAULT_EVENTS[id];

  try {
    const adminApp = getFirebaseAdmin();
    if (adminApp && !adminApp.error && typeof adminApp.firestore === 'function') {
      const db = adminApp.firestore();
      if (id && id !== 'latest' && id !== 'featured') {
        const snap = await db.collection('community_events').doc(id).get();
        if (snap.exists) return { id: snap.id, ...snap.data() };
      } else {
        const snap = await db.collection('community_events').where('status', '==', 'approved').limit(1).get();
        if (!snap.empty) {
          const doc = snap.docs[0];
          return { id: doc.id, ...doc.data() };
        }
      }
    }
  } catch (e) {
    console.warn("Firebase Admin event fetch error:", e.message);
  }

  try {
    if (id && id !== 'latest' && id !== 'featured') {
      const res = await fetch(`https://firestore.googleapis.com/v1/projects/bamboochain-official/databases/(default)/documents/community_events/${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        const f = data.fields || {};
        return {
          id,
          title: f.title?.stringValue || '',
          date: f.date?.stringValue || `${f.startDate?.stringValue || ''} s/d ${f.endDate?.stringValue || ''}`,
          time: f.time?.stringValue || `${f.startTime?.stringValue || ''} - ${f.endTime?.stringValue || ''} WIB`,
          location: f.location?.stringValue || '',
          category: f.category?.stringValue || f.customCategory?.stringValue || f.eventType?.stringValue || 'Acara Komunitas',
          image: f.image?.stringValue || '',
          ticketPrice: f.ticketPrice?.stringValue || '',
          ticketBmc: f.ticketBmc?.stringValue || '',
          description: f.description?.stringValue || ''
        };
      }
    } else {
      const res = await fetch('https://firestore.googleapis.com/v1/projects/bamboochain-official/databases/(default)/documents/community_events');
      if (res.ok) {
        const data = await res.json();
        const docs = data.documents || [];
        for (const doc of docs) {
          const f = doc.fields || {};
          if (f.status?.stringValue === 'approved') {
            const docId = (doc.name || '').split('/').pop();
            return {
              id: docId,
              title: f.title?.stringValue || '',
              date: f.date?.stringValue || `${f.startDate?.stringValue || ''} s/d ${f.endDate?.stringValue || ''}`,
              time: f.time?.stringValue || `${f.startTime?.stringValue || ''} - ${f.endTime?.stringValue || ''} WIB`,
              location: f.location?.stringValue || '',
              category: f.category?.stringValue || f.customCategory?.stringValue || f.eventType?.stringValue || 'Acara Komunitas',
              image: f.image?.stringValue || '',
              ticketPrice: f.ticketPrice?.stringValue || '',
              ticketBmc: f.ticketBmc?.stringValue || '',
              description: f.description?.stringValue || ''
            };
          }
        }
      }
    }
  } catch (err) {
    console.error("Firestore REST API fetch error in share-event:", err);
  }

  return DEFAULT_EVENTS[FEATURED_EVENT_FALLBACK_ID];
}

// =========================================================================
// HANDLER ROUTER
// =========================================================================

export default async function handler(req, res) {
  const query = req.query || {};
  const url = req.url || '';

  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.bamboochain.id';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  // Determine kind: profile | article | event
  let kind = query.kind || '';
  if (!kind) {
    if (url.includes('/u/') || url.includes('/p/') || url.includes('/portfolio/') || query.username || query.u) {
      kind = 'profile';
    } else if (url.includes('/article') || query.article) {
      kind = 'article';
    } else if (url.includes('/event') || query.event) {
      kind = 'event';
    } else {
      // Default fallback
      kind = 'profile';
    }
  }

  const isImageRequest = query.type === 'image' || query['amp;type'] === 'image' || url.includes('/image');

  // =========================================================================
  // 1. KIND: PROFILE
  // =========================================================================
  if (kind === 'profile') {
    const urlMatch = url.match(/^\/(?:u|p|portfolio)\/([^/?#]+)/i);
    const usernameFromUrl = urlMatch ? urlMatch[1] : '';
    const targetUserParam = query.username || usernameFromUrl || query.u || query.p || query.id || '';
    const cleanUsername = String(targetUserParam).trim().toLowerCase().replace(/^@/, '');

    const user = cleanUsername ? await getUserFromDb(cleanUsername) : null;
    const displayName = user?.name || (cleanUsername ? `@${cleanUsername}` : 'Pegiat Ekosistem Bambu');
    const userHandle = user?.username || cleanUsername || 'bamboochain';

    if (isImageRequest) {
      if (user?.bannerUrl && (user.bannerUrl.startsWith('http://') || user.bannerUrl.startsWith('https://'))) {
        return res.redirect(302, user.bannerUrl);
      }
      const rawAvatar = user?.avatarUrl;
      if (rawAvatar && rawAvatar.startsWith('data:image/')) {
        const matches = rawAvatar.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/s);
        if (matches) {
          const mimeType = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          res.setHeader('Content-Type', mimeType);
          res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
          return res.status(200).send(buffer);
        }
      }
      if (rawAvatar && (rawAvatar.startsWith('http://') || rawAvatar.startsWith('https://'))) {
        return res.redirect(302, rawAvatar);
      }
      return res.redirect(302, `${baseUrl}/images/bamboochain-profile-share.png`);
    }

    const pageTitle = `${displayName} | BaMbooChain`;
    const description = `Profil resmi ${displayName} di BaMbooChain. Bergabunglah dalam 5 kluster ekosistem bambu: Keseimbangan Lingkungan, Pemulihan Ekologis, Penanaman Digital, Petani Milenial, dan Wirausaha Milenial. Kolaborasi, sensus bambu, dan terbitkan paspor hijau Web3.`;
    const canonicalUrl = `${baseUrl}/u/${encodeURIComponent(userHandle)}`;
    const imageUrl = `${baseUrl}/u/${encodeURIComponent(userHandle)}/image`;
    const targetAppUrl = `${baseUrl}/#/portfolio/${encodeURIComponent(userHandle)}?ref=REF-${encodeURIComponent(userHandle.toUpperCase())}`;

    const html = `<!doctype html>
<html lang="id" prefix="og: http://ogp.me/ns# profile: http://ogp.me/ns/profile#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">

  <!-- Open Graph / WhatsApp / Facebook / LinkedIn / Telegram -->
  <meta property="og:site_name" content="BaMbooChain">
  <meta property="og:type" content="profile">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="id_ID">
  <meta property="profile:username" content="${escapeHtml(userHandle)}">

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@bambucoid">
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:image:alt" content="${escapeHtml(pageTitle)}">

  <!-- Instant Browser Redirect for Real Users (Preserves Referral Attribution) -->
  <script>
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('kodiba_referral_code', 'REF-' + ${JSON.stringify(userHandle.toUpperCase())});
      }
    } catch (e) {}
    window.location.replace(${JSON.stringify(targetAppUrl)});
  </script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #062e24 0%, #0f172a 100%);
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
      max-width: 520px;
      background: rgba(30, 41, 59, 0.9);
      backdrop-filter: blur(12px);
      padding: 36px 28px;
      border-radius: 24px;
      box-shadow: 0 15px 40px rgba(0,0,0,0.5);
      border: 1px solid rgba(16, 185, 129, 0.25);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 1.4rem;
      margin: 0 0 10px 0;
      color: #ffffff;
    }
    p {
      font-size: 0.92rem;
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 13px 28px;
      border-radius: 14px;
      text-decoration: none;
      font-weight: 800;
      font-size: 0.95rem;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🎋 BaMbooChain Web3 Profile</div>
    <h1>${escapeHtml(displayName)}</h1>
    <p>${escapeHtml(description)}</p>
    <a href="${escapeHtml(targetAppUrl)}" class="btn">
      Masuk ke Profil & Paspor Digital ➔
    </a>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=60');
    return res.status(200).send(html);
  }

  // =========================================================================
  // 2. KIND: ARTICLE
  // =========================================================================
  if (kind === 'article') {
    const articleId = query.id || (url.match(/\/article\/([^/?#]+)/i)?.[1]) || '1';
    const article = articleId ? await getArticleFromDb(String(articleId)) : null;

    if (isImageRequest) {
      const rawImg = article?.image || article?.images?.[0];
      if (!rawImg) return res.redirect(302, `${baseUrl}/logos/bmc.png`);
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
          imageUrl = `${baseUrl}/article/${encodeURIComponent(articleId)}/image`;
        }
      }
    }

    const targetAppUrl = `${baseUrl}/#/bamboochain/academy${articleId ? `?article=${encodeURIComponent(articleId)}` : ''}`;
    const canonicalUrl = `${baseUrl}/article/${articleId || ''}`;

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

  <!-- Instant Browser Redirect -->
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

  // =========================================================================
  // 3. KIND: EVENT
  // =========================================================================
  if (kind === 'event') {
    const eventId = query.id || (url.match(/\/event\/([^/?#]+)/i)?.[1]) || 'featured';
    const event = await getEventFromDb(eventId ? String(eventId) : 'featured');

    if (isImageRequest) {
      const rawImg = event?.image;
      if (rawImg && (rawImg.startsWith('http://') || rawImg.startsWith('https://'))) {
        return res.redirect(302, rawImg);
      }
      return res.redirect(302, `${baseUrl}/logos/bmc.png`);
    }

    const eventTitle = event?.title || 'Kalender Event Komunitas BaMbooChain';
    const siteName = 'BaMbooChain - Web3 Green Bamboo Ecosystem';
    const pageTitle = `${eventTitle} | ${siteName}`;

    let hookDesc = '';
    const isAdventure = (event?.category || '').toLowerCase().includes('wisata') || 
                        (event?.category || '').toLowerCase().includes('adventure') ||
                        (event?.title || '').toLowerCase().includes('escape') ||
                        (event?.title || '').toLowerCase().includes('baduy');

    if (isAdventure) {
      hookDesc = `🌿 Bosan akhir pekan cuma rebahan atau macet di jalan? Saatnya ikuti petualangan hijau & budaya di ${event?.location || 'Banten'}. 📅 ${event?.date || '14-15 Nov 2026'}. Dapatkan reward +20 Poin & Token BMC di BaMbooChain Passport! Daftar & ikuti sekarang!`;
    } else if (event?.description) {
      const cleanDesc = event.description.replace(/[\n\r]+/g, ' ').slice(0, 200).trim();
      hookDesc = `🎋 ${cleanDesc}... Waktu: ${event?.date || ''} (${event?.time || ''}). Raih reward Poin & Token BMC di BaMbooChain Passport!`;
    } else {
      hookDesc = `🎋 Bergabunglah di acara komunitas ${eventTitle}. Waktu: ${event?.date || ''} di ${event?.location || ''}. Dapatkan reward Poin & Token BMC terverifikasi di BaMbooChain Passport!`;
    }

    let imageUrl = `${baseUrl}/logos/bmc.png`;
    if (event?.image && (event.image.startsWith('http://') || event.image.startsWith('https://'))) {
      imageUrl = event.image;
    }

    const targetAppUrl = `${baseUrl}/#/events${event?.id ? `?event=${encodeURIComponent(event.id)}` : ''}`;
    const canonicalUrl = `${baseUrl}/event/${event?.id || 'featured'}`;

    const html = `<!doctype html>
<html lang="id" prefix="og: http://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(hookDesc)}">

  <!-- Open Graph / WhatsApp / Facebook / Telegram -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(siteName)}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="🎋 ${escapeHtml(eventTitle)}">
  <meta property="og:description" content="${escapeHtml(hookDesc)}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(eventTitle)}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@bamboochain">
  <meta name="twitter:title" content="🎋 ${escapeHtml(eventTitle)}">
  <meta name="twitter:description" content="${escapeHtml(hookDesc)}">
  <meta name="twitter:image" content="${imageUrl}">

  <!-- Instant Browser Redirect -->
  <script>
    window.location.replace(${JSON.stringify(targetAppUrl)});
  </script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0a0f0a;
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
      max-width: 520px;
      background: #141f14;
      padding: 32px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      border: 1px solid #2b4c2b;
    }
    .banner {
      width: 100%;
      height: 220px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 1.25rem;
      margin-bottom: 12px;
      color: #51cf66;
      line-height: 1.4;
    }
    p {
      font-size: 0.92rem;
      color: #adb5bd;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    a {
      display: inline-block;
      background: #0ca678;
      color: white;
      padding: 12px 28px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: bold;
      transition: background 0.2s;
    }
    a:hover {
      background: #099268;
    }
  </style>
</head>
<body>
  <div class="card">
    ${imageUrl ? `<img src="${imageUrl}" alt="${escapeHtml(eventTitle)}" class="banner" />` : ''}
    <h1>Membuka Kalender Event...</h1>
    <p>${escapeHtml(eventTitle)}</p>
    <a href="${escapeHtml(targetAppUrl)}">Lanjut ke Kalender Event</a>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    return res.status(200).send(html);
  }

  // Fallback 404
  return res.status(404).send('Not Found');
}
