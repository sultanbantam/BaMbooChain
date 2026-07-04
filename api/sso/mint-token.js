import { getFirebaseAdmin } from '../_utils/firebaseAdmin.js';
import { getAuth } from 'firebase-admin/auth';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const app = getFirebaseAdmin();
    if (!app || app.error) {
      return res.status(500).json({ error: app?.error || 'Firebase Admin not initialized in Vercel' });
    }

    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'Missing idToken' });
    }

    // 1. Verify that the user is genuinely logged into BambooChain
    const decodedToken = await getAuth(app).verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 2. Generate a custom token that Xignalx can use to log them in
    const additionalClaims = {
      source: 'bamboochain_sso'
    };
    
    const customToken = await getAuth(app).createCustomToken(uid, additionalClaims);

    return res.status(200).json({ customToken });
  } catch (error) {
    console.error('SSO Token Generation Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
