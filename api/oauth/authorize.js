import crypto from 'crypto';
import { getFirebaseAdmin } from '../_utils/firebaseAdmin.js';

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
    const { client_id, uid, redirect_uri } = req.body || {};

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
    const WHALE_OF_SAVU_CLIENT = "client_4e0f61e19c1855c5";
    
    let isClientValid = false;
    let allowedRedirectUris = [];

    if (client_id === WHALE_OF_SAVU_CLIENT) {
      isClientValid = true;
      if (redirect_uri && (redirect_uri.startsWith("https://whaleofsavu.org") || 
                           redirect_uri.startsWith("https://www.whaleofsavu.org") || 
                           redirect_uri.startsWith("https://analis-wine.vercel.app") || 
                           redirect_uri.startsWith("https://whaleofsavu.vercel.app") || 
                           redirect_uri.startsWith("http://localhost:3000"))) {
        allowedRedirectUris = [redirect_uri];
      }
    } else if (client_id === 'enpineering') {
      isClientValid = true;
      if (redirect_uri && (redirect_uri.startsWith("https://bamboogame.click") || 
                           redirect_uri.startsWith("https://www.bamboogame.click") || 
                           redirect_uri.startsWith("http://localhost:3000"))) {
        allowedRedirectUris = [redirect_uri];
      }
    } else {
      const clientSnapshot = await db.collection('oauth_clients').where('client_id', '==', client_id).limit(1).get();
      if (!clientSnapshot.empty) {
        isClientValid = true;
        allowedRedirectUris = clientSnapshot.docs[0].data().redirect_uris || [];
      }
    }
    
    if (!isClientValid) {
      return res.status(400).json({ success: false, message: 'Invalid client_id' });
    }

    if (redirect_uri && allowedRedirectUris.length > 0) {
      if (!allowedRedirectUris.includes(redirect_uri)) {
        return res.status(401).json({ success: false, message: 'Unauthorized redirect_uri' });
      }
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
