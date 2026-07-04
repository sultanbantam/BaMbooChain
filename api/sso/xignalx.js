import { getFirebaseAdmin } from '../utils/firebaseAdmin.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const admin = getFirebaseAdmin();
    if (!admin) {
      return res.status(500).json({ error: 'Firebase Admin not initialized in Vercel' });
    }

    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'Missing idToken' });
    }

    // 1. Verify that the user is genuinely logged into BambooChain
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 2. Generate a custom token that Xignalx can use to log them in
    const additionalClaims = {
      source: 'bamboochain_sso'
    };
    
    const customToken = await admin.auth().createCustomToken(uid, additionalClaims);

    return res.status(200).json({ customToken });
  } catch (error) {
    console.error('SSO Token Generation Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
