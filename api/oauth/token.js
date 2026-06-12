import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_bamboochain_secret_key_123';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://modular-blockbamboo.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { auth_code } = req.body || {};

    if (!auth_code || !auth_code.startsWith('auth_bmc_')) {
      return res.status(400).json({ success: false, message: 'Invalid auth code format' });
    }

    // 1. Verifikasi auth_code
    // Format simulasi: auth_bmc_{uid}_{timestamp}
    const parts = auth_code.split('_');
    const uid = parts[2];
    
    if (!uid) {
      return res.status(400).json({ success: false, message: 'Invalid auth code' });
    }

    // 2. Ambil data user yang sesuai dari Firestore REST API
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/bamboochain-official/databases/(default)/documents/users/${uid}`;
    const fbRes = await fetch(firestoreUrl);
    
    if (!fbRes.ok) {
      return res.status(400).json({ success: false, message: 'User tidak ditemukan di database BaMbooChain' });
    }
    
    const userDoc = await fbRes.json();
    const userName = userDoc.fields.name ? userDoc.fields.name.stringValue : 'BaMbooChain User';
    const walletAddress = userDoc.fields.walletAddress ? userDoc.fields.walletAddress.stringValue : '';

    const realUserFromDB = {
      id: uid,
      name: userName,
      wallet_address: walletAddress
    };

    // 3. Buat JWT Token asli
    const accessToken = jwt.sign(
      { userId: uid }, 
      JWT_SECRET, 
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      success: true,
      access_token: accessToken,
      user: realUserFromDB
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Server error: ' + error.message });
  }
}
