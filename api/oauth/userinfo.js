import jwt from 'jsonwebtoken';
import { getFirebaseAdmin } from '../_utils/firebaseAdmin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_bamboochain_secret_key_123';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized, missing Bearer token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const uid = decoded.userId;

    const app = getFirebaseAdmin();
    
    // ======== MOCK MODE ========
    if (!app) {
       return res.status(200).json({
         sub: uid,
         id: uid,
         name: "BaMbooChain User",
         email: `${uid}@bamboochain.id`,
         wallet_address: "0xMockAddress123"
       });
    }

    // ======== PRODUCTION MODE ========
    const db = app.firestore();
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = userDoc.data();
    
    return res.status(200).json({
      sub: uid, // OpenID Connect standard
      id: uid,
      name: userData.name || userData.username || "BaMbooChain User",
      email: userData.email || `${uid}@bamboochain.id`,
      wallet_address: userData.walletAddress || ""
    });

  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
