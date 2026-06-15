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

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    console.warn("MIDTRANS_SERVER_KEY is missing. Using mock Midtrans response.");
    return res.status(200).json({
      success: true,
      token: "mock_midtrans_token_123",
      redirect_url: "https://simulator.sandbox.midtrans.com/payment" // Tautan simulasi
    });
  }

  try {
    const { order_id, gross_amount, items, customer_details } = req.body;

    const payload = {
      transaction_details: {
        order_id: order_id || `TRX-${Date.now()}`,
        gross_amount: Math.round(gross_amount)
      },
      item_details: items || [],
      customer_details: customer_details || {
        first_name: "Pelanggan",
        last_name: "BaMbooChain"
      },
      credit_card: {
        secure: true
      }
    };

    // Encode Server Key to Base64
    const authString = Buffer.from(serverKey + ':').toString('base64');

    // Menentukan URL endpoint berdasarkan environment
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
    const baseUrl = isProduction ? 'https://app.midtrans.com' : 'https://app.sandbox.midtrans.com';

    const response = await fetch(`${baseUrl}/snap/v1/transactions`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_messages ? data.error_messages.join(', ') : 'Failed to create Midtrans transaction');
    }

    return res.status(200).json({
      success: true,
      token: data.token,
      redirect_url: data.redirect_url
    });
  } catch (error) {
    console.error("Midtrans Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
