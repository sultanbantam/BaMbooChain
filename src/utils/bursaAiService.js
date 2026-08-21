export const fetchDynamicCommodityPrice = async (keyword) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("API Key OpenAI tidak ditemukan.");

  const prompt = `Anda adalah analis pasar global khusus produk bambu dan komoditas pendukungnya.
Tugas Anda adalah memperkirakan harga dasar pasar saat ini (dalam Rupiah) untuk komoditas: "${keyword}".
Tolong berikan estimasi harga satuan yang paling masuk akal (misalnya harga per batang, per meter, per kg, atau per buah).
Tentukan juga tren saat ini secara acak tapi realistis (misal: +1.2%, -0.5%, dll).

BALASAN WAJIB DALAM FORMAT JSON MURNI TANPA TEKS LAIN DAN TANPA MARKDOWN \`\`\`json:
{
  "price": <angka integer, misal: 15000>,
  "trend": "<string, misal: '+2.1%'>",
  "up": <boolean, true jika positif, false jika negatif>
}`;

  const payload = {
    model: "gpt-4o-mini", // Gunakan model cepat dan hemat
    messages: [
      { role: "system", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 150
  };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const resultStr = data.choices[0].message.content.trim();
    // Bersihkan jika ada sisa markdown
    const jsonStr = resultStr.replace(/```json/g, '').replace(/```/g, '').trim();
    const resultObj = JSON.parse(jsonStr);
    
    // Normalisasi struktur untuk bursaData
    return {
      typeKey: keyword, // Gunakan keyword langsung sebagai nama komoditas
      price: resultObj.price || 15000,
      trend: resultObj.trend || "+0.0%",
      up: resultObj.up !== undefined ? resultObj.up : true
    };
  } catch (error) {
    console.error("Gagal mendapatkan harga komoditas dinamis:", error);
    // Fallback logis jika AI gagal
    return {
      typeKey: keyword,
      price: 15000,
      trend: "+0.1%",
      up: true
    };
  }
};
