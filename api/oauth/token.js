import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getFirebaseAdmin } from '../utils/firebaseAdmin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_bamboochain_secret_key_123';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let { client_id, client_secret, code, grant_type, auth_code } = req.body || {};
    
    // Check Basic Auth header if client_id is not in body
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Basic ')) {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const [parsedId, parsedSecret] = credentials.split(':');
      if (!client_id) client_id = parsedId;
      if (!client_secret) client_secret = parsedSecret;
    }

    const app = getFirebaseAdmin();
    
    // ======== MOCK MODE (Backward compatibility / No Firebase Admin) ========
    if (!app || (!client_id && auth_code)) {
      const codeToUse = auth_code || code;
      if (!codeToUse || !codeToUse.startsWith('auth_bmc_')) {
        return res.status(400).json({ success: false, message: 'Invalid auth code format (Mock Mode)' });
      }

      const parts = codeToUse.split('_');
      const uid = parts[2];
      
      if (!uid) {
        return res.status(400).json({ success: false, message: 'Invalid auth code' });
      }

      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/bamboochain-official/databases/(default)/documents/users/${uid}`;
      let userName = 'BaMbooChain User';
      let walletAddress = '';
      
      try {
        const fbRes = await fetch(firestoreUrl);
        if (fbRes.ok) {
          const userDoc = await fbRes.json();
          if (userDoc.fields && userDoc.fields.name) {
            userName = userDoc.fields.name.stringValue;
          }
          if (userDoc.fields && userDoc.fields.walletAddress) {
            walletAddress = userDoc.fields.walletAddress.stringValue;
          }
        }
      } catch (e) {
        console.warn("Mock Mode: Failed to fetch from firestore, using fallback user data.");
      }

      const accessToken = jwt.sign({ userId: uid }, JWT_SECRET, { expiresIn: '2h' });

      return res.status(200).json({
        success: true,
        access_token: accessToken,
        user: { id: uid, name: userName, wallet_address: walletAddress },
        _warning: "Using MOCK mode. Firebase Admin is not configured."
      });
    }

    // ======== PRODUCTION MODE ========
    if (grant_type !== 'authorization_code') {
      return res.status(400).json({ success: false, message: 'Unsupported grant_type' });
    }

    if (!client_id || !client_secret || !code) {
      return res.status(400).json({ success: false, message: 'Missing client_id, client_secret, or code' });
    }

    const db = app.firestore();

    // 1. Verify Client
    const WHALE_OF_SAVU_CLIENT = "client_4e0f61e19c1855c5";
    const WHALE_OF_SAVU_SECRET = "secret_087eaa28a0feef4be7fa236b38d383cb";
    
    let isValidClient = false;
    if (client_id === WHALE_OF_SAVU_CLIENT && client_secret === WHALE_OF_SAVU_SECRET) {
      isValidClient = true;
    } else {
      const clientSnapshot = await db.collection('oauth_clients').where('client_id', '==', client_id).limit(1).get();
      if (clientSnapshot.empty) {
        return res.status(401).json({ success: false, message: 'Invalid client_id' });
      }

      const clientData = clientSnapshot.docs[0].data();
      const isSecretValid = await bcrypt.compare(client_secret, clientData.client_secret_hash);
      
      if (!isSecretValid) {
        return res.status(401).json({ success: false, message: 'Invalid client_secret' });
      }
      isValidClient = true;
    }

    // 2. Verify Auth Code
    const codeSnapshot = await db.collection('auth_codes')
      .where('code', '==', code)
      .where('client_id', '==', client_id)
      .where('used', '==', false)
      .limit(1)
      .get();

    if (codeSnapshot.empty) {
      return res.status(400).json({ success: false, message: 'Invalid or expired code' });
    }

    const codeDoc = codeSnapshot.docs[0];
    const codeData = codeDoc.data();
    
    const now = new Date();
    const expiresAt = new Date(codeData.expires_at);

    if (now > expiresAt) {
      return res.status(400).json({ success: false, message: 'Code expired' });
    }

    // Mark as used
    await codeDoc.ref.update({ used: true });

    const uid = codeData.uid;

    // 3. Fetch User Info
    const userDoc = await db.collection('users').doc(uid).get();
    let userName = 'BaMbooChain User';
    let walletAddress = '';

    if (userDoc.exists) {
      const userData = userDoc.data();
      userName = userData.name || userName;
      walletAddress = userData.walletAddress || walletAddress;
    }

    // 4. Generate Token
    const accessToken = jwt.sign(
      { userId: uid, clientId: client_id }, 
      JWT_SECRET, 
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      success: true,
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 7200,
      user: {
        id: uid,
        name: userName,
        wallet_address: walletAddress
      }
    });

  } catch (error) {
    console.error("Token Error:", error);
    return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
}
