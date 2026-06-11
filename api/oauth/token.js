export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { auth_code } = req.body || {};

    // 1. Verifikasi auth_code di database BaMbooChain Anda
    // 2. Ambil data user yang sesuai
    const mockUserFromDB = {
      id: "bmc_9992384729",
      name: "BambooBuilder",
      wallet_address: "0x8c1ee70..."
    };

    // 3. Buat JWT Token atau Session Token
    const accessToken = "ey...simulasi_jwt_token...";

    return res.status(200).json({
      success: true,
      access_token: accessToken,
      user: mockUserFromDB
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid code' });
  }
}
