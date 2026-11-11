import { getFirebaseAdmin } from './_utils/firebaseAdmin.js';

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function getUserFromDb(rawUsername = '') {
  const clean = String(rawUsername).trim().toLowerCase().replace(/^@/, '');
  if (!clean) return null;

  // 1. Try Firebase Admin if available
  try {
    const adminApp = getFirebaseAdmin();
    if (adminApp && !adminApp.error && typeof adminApp.firestore === 'function') {
      const db = adminApp.firestore();
      
      // Query by username field
      const snap = await db.collection('users')
        .where('username', '==', clean)
        .limit(1)
        .get();

      if (!snap.empty) {
        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() };
      }

      // Fallback query by document id (UID)
      const directDoc = await db.collection('users').doc(clean).get();
      if (directDoc.exists) {
        return { id: directDoc.id, ...directDoc.data() };
      }
    }
  } catch (err) {
    console.warn("Firebase Admin user lookup error:", err.message);
  }

  // 2. Direct Firestore REST API fallback (works reliably with zero service account credentials)
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

    // Try direct document ID endpoint
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

export default async function handler(req, res) {
  const { username, u, p, id, type } = req.query;
  const targetUserParam = username || u || p || id || '';
  const cleanUsername = String(targetUserParam).trim().toLowerCase().replace(/^@/, '');
  const isImageRequest = type === 'image' || req.query['amp;type'] === 'image' || (req.url && req.url.includes('/image'));

  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.bamboochain.id';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  const user = cleanUsername ? await getUserFromDb(cleanUsername) : null;
  const displayName = user?.name || (cleanUsername ? `@${cleanUsername}` : 'Pegiat Ekosistem Bambu');
  const userHandle = user?.username || cleanUsername || 'bamboochain';

  // =========================================================================
  // 1. IMAGE SERVING MODE (for WhatsApp, Facebook, LinkedIn, Twitter/X crawlers)
  // =========================================================================
  if (isImageRequest) {
    // If user has a banner image with HTTP URL, serve/redirect
    if (user?.bannerUrl && (user.bannerUrl.startsWith('http://') || user.bannerUrl.startsWith('https://'))) {
      return res.redirect(302, user.bannerUrl);
    }

    // If user has a Base64 avatar image, decode and serve directly as image buffer
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

    // If user has an HTTP avatar URL (e.g. Cloudinary / Dicebear)
    if (rawAvatar && (rawAvatar.startsWith('http://') || rawAvatar.startsWith('https://'))) {
      return res.redirect(302, rawAvatar);
    }

    // Default: Redirect to branded 1200x630 BaMbooChain OG Template
    return res.redirect(302, `${baseUrl}/images/bamboochain-profile-share.png`);
  }

  // =========================================================================
  // 2. OPEN GRAPH HTML MODE (for crawlers & direct social link visitors)
  // =========================================================================
  const pageTitle = `${displayName} | BaMbooChain`;

  // Compliant, high-converting description without exaggerated claims
  const description = `Profil resmi ${displayName} di BaMbooChain. Bergabunglah dalam 5 kluster ekosistem bambu: Keseimbangan Lingkungan, Pemulihan Ekologis, Penanaman Digital, Petani Milenial, dan Wirausaha Milenial. Kolaborasi, sensus bambu, dan terbitkan paspor hijau Web3.`;

  // Clean canonical and image URLs
  const canonicalUrl = `${baseUrl}/u/${encodeURIComponent(userHandle)}`;
  const imageUrl = `${baseUrl}/u/${encodeURIComponent(userHandle)}/image`;
  
  // App target with referral attribution query
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

  <!-- Instant Client Redirect for Real Human Browser Visitors (Preserving Referral) -->
  <script>
    try {
      // Store persistent referral code in browser storage before redirection
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

