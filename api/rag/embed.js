/* eslint-env node */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Try OpenAI first
    const openAIKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    if (openAIKey) {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIKey}`
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text
        })
      });

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({ vector: data.data[0].embedding });
      }
    }

    // Fallback: HuggingFace (e.g. sentence-transformers/all-MiniLM-L6-v2)
    const hfKey = process.env.VITE_HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY || '';
    const hfHeaders = { 'Content-Type': 'application/json' };
    if (hfKey) hfHeaders['Authorization'] = `Bearer ${hfKey}`;

    const hfResponse = await fetch('https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2', {
      method: 'POST',
      headers: hfHeaders,
      body: JSON.stringify({ inputs: [text] })
    });

    if (hfResponse.ok) {
      const data = await hfResponse.json();
      const vector = Array.isArray(data[0]) ? data[0] : data;
      return res.status(200).json({ vector });
    } else {
      const errText = await hfResponse.text();
      console.warn('HuggingFace fallback failed:', hfResponse.status, errText);
    }

    // If both fail or no keys
    return res.status(500).json({ error: 'Failed to generate embedding. Please set VITE_OPENAI_API_KEY or VITE_HUGGINGFACE_API_KEY in .env.' });
  } catch (error) {
    console.error('Embedding API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
