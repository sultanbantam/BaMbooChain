import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_bamboochain_secret_key_123';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://www.bamboogame.click');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Cek Token
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

    const { amount, memo, item_id } = req.body || {};
    
    // Validasi basic input
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // 2. Mulai transaksi Database (ACID)
    // - Cek apakah saldo cukup
    // - Potong saldo user (-amount)
    // - Tambah saldo Kas Proyek / Admin (+amount)
    // - Simpan riwayat transaksi (memo)
    
    // Contoh Pseudo-code:
    // const userWallet = await getWallet(userId);
    // if (userWallet.balance < amount) throw new Error("Saldo tidak cukup");
    // await deductBalance(userId, amount);
    // await recordTransaction(userId, "System", amount, memo);

    return res.status(200).json({
      success: true,
      message: "Payment successful",
      tx_id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount_deducted: amount,
      userId: userId
    });
    
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
