export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Ambil Authorization Header (Token)
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2. Verifikasi Token & Ambil User ID
  const userId = "bmc_9992384729"; // Hasil decode token

  // 3. Query ke Database BaMbooChain / Smart Contract untuk ambil saldo
  // const balance = await db.query('SELECT bmc_balance FROM wallets WHERE user_id = ?', [userId]);
  const currentBalance = 2222.517; // Contoh data dari gambar Anda

  return res.status(200).json({
    success: true,
    balance: currentBalance,
    symbol: "BMC"
  });
}
