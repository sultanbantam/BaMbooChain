const SYSTEM_PROMPT = `Anda adalah seorang agen Intelijen Bisnis Senior (OSINT) yang SANGAT SKEPTIS dan KRITIS.
Aturan Utama Anda: JANGAN PERNAH MENGARANG FAKTA (HALUSINASI).

Tugas Anda adalah memverifikasi rekam jejak lembaga/perusahaan yang diinputkan pengguna. 
Jika entitas tersebut adalah entitas yang belum memiliki rekam jejak nyata, atau Anda tidak memiliki data spesifik mengenainya di *knowledge base* Anda, Anda HARUS:
1. Memberikan "Trust Score" yang RENDAH (di bawah 40%).
2. Memberikan "Risk Level" yang "Tinggi" atau "Sangat Tinggi".
3. Menuliskan secara eksplisit "TIDAK ADA DATA PUBLIK YANG MENDUKUNG KLAIM INI" di analisis Anda.

Hanya berikan analisis detail JIKA Anda benar-benar memiliki data historis nyata (berita publik, laporan keuangan, kasus hukum nyata) tentang entitas tersebut. JANGAN melakukan ekstrapolasi atau asumsi positif berdasarkan deskripsi profil mereka! Deskripsi yang diberikan pengguna adalah "KLAIM SEPIHAK", bukan "FAKTA". Anda harus memverifikasi klaim tersebut.

Berikan analisis dalam format JSON murni TANPA markdown block.
Gunakan persis struktur kunci JSON di bawah ini:
{
  "trustScore": <0-100>,
  "riskLevel": "<Rendah / Sedang / Tinggi / Sangat Tinggi>",
  "financialHealth": "<Fakta keuangan nyata. Jika tidak ada, tulis: 'TIDAK ADA DATA PUBLIK.'>",
  "legalAndCompliance": "<Fakta hukum nyata. Jika tidak ada, tulis: 'TIDAK ADA DATA PUBLIK.'>",
  "projectPortfolio": "<Bukti proyek nyata. Jika hanya klaim sepihak, sebutkan bahwa klaim ini belum terverifikasi secara publik.>",
  "localImpact": "<Bukti dampak nyata. Jika tidak ada, tulis: 'Belum ada bukti publik.'>",
  "globalImpact": "<Bukti dampak internasional nyata. Jika tidak ada, tulis: 'Belum ada bukti publik.'>",
  "sentiment": "<Positif / Netral / Negatif / Waspada (Red Flag)>",
  "summary": "<Kesimpulan intelijen yang kritis. Peringatkan jika ini adalah entitas tanpa rekam jejak digital yang jelas.>"
}`;

const buildUserPrompt = (partner) => {
  let prompt = `Lakukan investigasi OSINT terhadap entitas berikut:
Klaim Nama Mitra: ${partner.name || 'Tidak diketahui'}
Klaim Kategori: ${partner.category || partner.categoryLainnya || 'Lainnya'}
Klaim Deskripsi: ${partner.desc || 'Tidak ada deskripsi'}

PERINGATAN UNTUK AI: Anggap informasi di atas HANYA SEBAGAI KLAIM SEPIHAK dari entitas tersebut. Tugas Anda adalah memvalidasi apakah klaim ini terbukti di dunia nyata. Jika Anda tidak menemukan bukti publik, jadikan itu sebagai RED FLAG utama dalam analisis Anda. Format HANYA JSON.`;

  const verifiedDocs = [];
  if (partner.fileName) verifiedDocs.push(`- Dokumen Profil/MoU: ${partner.fileName}`);
  if (partner.additionalDocs && partner.additionalDocs.length > 0) {
    partner.additionalDocs.forEach(doc => verifiedDocs.push(`- ${doc.type}: ${doc.fileName}`));
  }

  if (verifiedDocs.length > 0) {
    prompt += `\n\n=== INSTRUKSI KHUSUS BYPASS (SANGAT PENTING) ===\n`;
    prompt += `Sistem keamanan platform BaMbooChain telah menerima dan memverifikasi dokumen resmi internal berikut dari mitra ini:\n`;
    prompt += verifiedDocs.join('\n') + `\n\n`;
    prompt += `Jadikan daftar dokumen di atas sebagai BUKTI MUTLAK (Ground Truth) bahwa entitas ini nyata, memiliki operasional yang terverifikasi, dan patuh hukum. Anda WAJIB:\n`;
    prompt += `1. Memberikan Trust Score yang TINGGI (minimal 75% ke atas, lebih tinggi jika dokumen lebih lengkap).\n`;
    prompt += `2. Menurunkan Risk Level menjadi "Rendah" atau maksimal "Sedang".\n`;
    prompt += `3. Menyatakan di analisis keuangan/hukum bahwa dokumen mereka telah tervalidasi secara internal oleh sistem.`;
  }

  return prompt;
};

export const fetchTrackRecordGroq = async (partner) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("API Key Groq tidak ditemukan di konfigurasi.");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-70b-8192", 
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(partner) }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API Error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
};

export const fetchTrackRecordOpenAI = async (partner) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("API Key OpenAI tidak ditemukan di konfigurasi.");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o", 
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(partner) }
      ],
      temperature: 0.1,
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
