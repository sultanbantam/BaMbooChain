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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Ambil Authorization Header (Token)
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized, missing or invalid token format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verifikasi Token & Ambil User ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // 3. Query ke Database BaMbooChain / Smart Contract untuk ambil saldo
    // const balance = await db.query('SELECT bmc_balance FROM wallets WHERE user_id = ?', [userId]);
    const currentBalance = 2222.517; // Mock data

    return res.status(200).json({
      success: true,
      balance: currentBalance,
      symbol: "BMC",
      userId: userId
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
