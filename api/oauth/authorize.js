import crypto from 'crypto';
import { getFirebaseAdmin } from '../utils/firebaseAdmin.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { client_id, uid } = req.body || {};

    if (!client_id || !uid) {
      return res.status(400).json({ success: false, message: 'Missing client_id or uid' });
    }

    const app = getFirebaseAdmin();
    if (!app) {
      // Mock logic if Firebase Admin is not set up
      console.warn("Firebase Admin not configured. Returning mock auth code.");
      const mockAuthCode = `auth_bmc_${uid}_${Date.now()}`;
      return res.status(200).json({
        success: true,
        code: mockAuthCode,
        message: 'Firebase Admin not configured. Using mock code.'
      });
    }

    const db = app.firestore();

    // 1. Validate Client ID
    const clientSnapshot = await db.collection('oauth_clients').where('client_id', '==', client_id).limit(1).get();
    
    if (clientSnapshot.empty) {
      return res.status(400).json({ success: false, message: 'Invalid client_id' });
    }

    // 2. Generate Auth Code (expires in 5 minutes)
    const code = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const authCodeDoc = {
      code,
      client_id,
      uid,
      expires_at: expiresAt.toISOString(),
      used: false
    };

    await db.collection('auth_codes').add(authCodeDoc);

    return res.status(200).json({
      success: true,
      code
    });

  } catch (error) {
    console.error("Authorize Error:", error);
    return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
}
