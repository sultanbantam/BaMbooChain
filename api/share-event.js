import { getFirebaseAdmin } from './_utils/firebaseAdmin.js';

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

const FEATURED_FALLBACK_ID = 'EjZLrmeM7AjALZaZGJ8K';

async function getEventFromDb(id) {
  if (id && DEFAULT_EVENTS[id]) {
    return DEFAULT_EVENTS[id];
  }

  // 1. Try Firebase Admin
  try {
    const adminApp = getFirebaseAdmin();
    if (adminApp && !adminApp.error && typeof adminApp.firestore === 'function') {
      const db = adminApp.firestore();
      if (id && id !== 'latest' && id !== 'featured') {
        const snap = await db.collection('community_events').doc(id).get();
        if (snap.exists) {
          return { id: snap.id, ...snap.data() };
        }
      } else {
        // Fetch latest approved event
        const snap = await db.collection('community_events')
          .where('status', '==', 'approved')
          .limit(1)
          .get();
        if (!snap.empty) {
          const doc = snap.docs[0];
          return { id: doc.id, ...doc.data() };
        }
      }
    }
  } catch (e) {
    console.warn("Firebase Admin event fetch error:", e.message);
  }

  // 2. Direct Firestore REST API fallback (works without credentials)
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
      // List events via REST to find latest
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

  // Fallback to primary event
  return DEFAULT_EVENTS[FEATURED_FALLBACK_ID];
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

  const event = await getEventFromDb(id ? String(id) : 'featured');

  // IMAGE SERVING MODE: if image requested, redirect to banner image
  if (isImageRequest) {
    const rawImg = event?.image;
    if (rawImg && (rawImg.startsWith('http://') || rawImg.startsWith('https://'))) {
      return res.redirect(302, rawImg);
    }
    return res.redirect(302, `${baseUrl}/logos/bmc.png`);
  }

  // HTML OPEN GRAPH MODE FOR WHATSAPP, FACEBOOK, TELEGRAM & BROWSER
  const eventTitle = event?.title || 'Kalender Event Komunitas BaMbooChain';
  const siteName = 'BaMbooChain - Web3 Green Bamboo Ecosystem';
  const pageTitle = `${eventTitle} | ${siteName}`;
  
  // Create an emotional and persuasive hook for the description
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

  <!-- Instant Browser Redirect for Real Users (Not Executed by WhatsApp Bot) -->
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
