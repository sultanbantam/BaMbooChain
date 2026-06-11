export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Cek Token
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const { amount, memo, item_id } = req.body || {};
    const userId = "bmc_9992384729"; // Hasil decode token

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
      tx_id: "tx_123456789abc",
      amount_deducted: amount
    });
    
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
