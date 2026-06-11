import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_bamboochain_secret_key_123';

export default async function handler(req, res) {
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

    // 2. Ambil data user yang sesuai (Mock data fallback karena DB belum direct connect)
    const mockUserFromDB = {
      id: uid,
      name: "BaMbooChain User",
      wallet_address: "0xMockWalletAddress123"
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
      user: mockUserFromDB
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Server error: ' + error.message });
  }
}
