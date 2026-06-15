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

  const apiKey = process.env.BITESHIP_API_KEY;

  if (!apiKey) {
    // Fallback mock data jika API Key belum dipasang di .env.local
    console.warn("BITESHIP_API_KEY is missing. Using mock data.");
    return res.status(200).json({
      success: true,
      pricing: [
        {
          courier_name: "JNE",
          courier_service_name: "REG",
          duration: "1 - 2 Hari",
          price: 15000,
          id: "jne_reg"
        },
        {
          courier_name: "J&T",
          courier_service_name: "EZ",
          duration: "1 - 2 Hari",
          price: 16000,
          id: "jnt_ez"
        },
        {
          courier_name: "Sicepat",
          courier_service_name: "HALU",
          duration: "2 - 3 Hari",
          price: 10000,
          id: "sicepat_halu"
        }
      ]
    });
  }

  try {
    const { destination_postal_code, items } = req.body;

    // Payload standar untuk Biteship
    const payload = {
      origin_postal_code: "42111", // Asumsi Gudang Pusat Serang, Banten
      destination_postal_code: destination_postal_code || "12110", // Default Jakarta Selatan jika kosong
      couriers: "jne,jnt,sicepat,paxel,gojek,grab",
      items: items || [
        {
          name: "Produk BaMbooChain",
          description: "Pesanan Marketplace",
          value: 50000,
          length: 10,
          width: 10,
          height: 10,
          weight: 1000 // 1kg
        }
      ]
    };

    const response = await fetch('https://api.biteship.com/v1/rates/couriers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch rates from Biteship');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Biteship Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
