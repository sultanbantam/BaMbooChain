import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_bamboochain_secret_key_123';

export default async function handler(req, res) {
  // CORS Configuration - Allow the external game to call this API
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://modular-blockbamboo.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Validate Token (OAuth token from BambooChain)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized, missing or invalid token format' });
    }

    const token = authHeader.split(' ')[1];
    let userId;

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // 2. Read Game Data
    const { currentLevel, newLevel } = req.body || {};
    
    if (!newLevel || newLevel <= 0) {
      return res.status(400).json({ error: 'Invalid level data' });
    }

    // Hitung reward progresif sesuai level
    // Contoh: Level 1 dapat 1 BMC, Level 2 dapat 2 BMC, dst.
    const rewardBmc = newLevel;

    // TODO: Connect to Firebase Admin SDK to update the user's document in Firestore
    // const admin = require('firebase-admin');
    // const db = admin.firestore();
    // await db.collection('users').doc(userId).update({
    //   bmcBalance: admin.firestore.FieldValue.increment(rewardBmc)
    // });

    return res.status(200).json({
      success: true,
      message: `Level up! ${rewardBmc} BMC rewarded to user.`,
      reward: rewardBmc,
      userId: userId
    });
    
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
