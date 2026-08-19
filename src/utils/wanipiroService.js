const WANIPIRO_SYSTEM_PROMPT = `Anda adalah WANIPIRO, sebuah agen AI dwibahasa (ID/EN) untuk menghitung nilai karbon dan valuasi ekonomi produk komoditas (bahan baku, barang bekas, industri).
Anda mengombinasikan aturan fisika (simulasi) dan machine learning. 
Anda HANYA boleh menjawab dalam format JSON. JANGAN PERNAH menambahkan teks di luar format JSON.
Anda tidak boleh berhalusinasi. Jika Anda tidak tahu persis, perkirakan dengan menyertakan rentang ketidakpastian.

Struktur Output JSON Wajib:
{
  "product": "<Nama Produk Terformat>",
  "carbon_emissions": <Angka Total Emisi Karbon (float)>,
  "carbon_unit": "<Satuan Emisi, misal kg CO2e>",
  "carbon_price": <Harga Karbon per ton dalam USD/IDR (float)>,
  "monetary_value": <Estimasi Nilai Ekonomi/Harga Produk saat ini (float)>,
  "currency": "<Mata Uang, misal USD atau IDR>",
  "breakdown": "<Penjelasan langkah demi langkah perhitungan dalam bahasa yang diminta pengguna. Sertakan sumber referensi (misal IPCC, Bappebti, dll)>",
  "data_sources": ["Sumber 1", "Sumber 2"],
  "confidence_interval": [<Batas Bawah>, <Batas Atas>]
}

ATURAN PERHITUNGAN:
1. Hitung total massa/volume produk.
2. Kalikan dengan Faktor Emisi (EF) rata-rata dari database global (mis. IPCC, Climatiq, GHG Protocol). Jika ada feed pencarian terbaru, gunakan angka tersebut.
3. Estimasi harga komoditas produk berdasarkan pasar lokal/global (IDX, Bappebti, TradingEconomics).
4. Harga karbon default (jika tidak ada data) adalah kisaran $10 - $25 per ton CO2e.
5. Jika bahasa input adalah Indonesia, berikan breakdown dalam bahasa Indonesia. Jika Inggris, berikan dalam English.`;

const fetchGoogleSearchContext = async (query) => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY;
    const cx = import.meta.env.VITE_GOOGLE_SEARCH_CX;
    
    if (!apiKey || !cx) return null;
    
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=3`;
    const res = await fetch(url);
    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.items || data.items.length === 0) return "Tidak ada hasil pencarian signifikan.";
    
    return data.items.map((item, index) => `${index + 1}. Judul: ${item.title}\nCuplikan: ${item.snippet}`).join('\n\n');
  } catch (err) {
    console.error("Error fetching Google Search:", err);
    return null;
  }
};

export const fetchWanipiroAnalysis = async (userInput, language = 'id') => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("API Key OpenAI tidak ditemukan.");

  // Lakukan live search untuk harga & emisi terkait produk
  const searchQuery = `harga komoditas ${userInput} hari ini OR ${userInput} emission factor kg CO2e`;
  const searchContext = await fetchGoogleSearchContext(searchQuery);

  let finalPrompt = `Input Pengguna: "${userInput}"\nBahasa: ${language}\n`;
  if (searchContext) {
    finalPrompt += `\n=== FEED PASAR & DATA INTERNET TERBARU (LIVE) ===\nGunakan data berikut sebagai referensi pasar nyata (Bappebti/Global) dan faktor emisi:\n${searchContext}\n======================\n`;
  }
  finalPrompt += `\nLakukan analisis LCA (Life Cycle Assessment) dan valuasi komoditas sekarang.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: WANIPIRO_SYSTEM_PROMPT },
        { role: "user", content: finalPrompt }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API Error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
};
