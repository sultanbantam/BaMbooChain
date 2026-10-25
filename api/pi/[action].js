export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const action = req.query.action || (req.url.includes('complete') ? 'complete' : 'approve');
  const { paymentId, txid } = req.body || {};
  const apiKey = process.env.PI_API_KEY;

  if (!paymentId) {
    return res.status(400).json({ error: 'Missing paymentId' });
  }

  if (action === 'complete' && !txid) {
    return res.status(400).json({ error: 'Missing txid' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'PI_API_KEY is not configured in Vercel environment variables' });
  }

  try {
    const url = `https://api.minepi.com/v2/payments/${paymentId}/${action}`;
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    if (action === 'complete') {
      options.body = JSON.stringify({ txid });
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
