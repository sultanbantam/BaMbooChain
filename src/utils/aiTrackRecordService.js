const SYSTEM_PROMPT = `Anda adalah seorang intelijen bisnis dan spesialis analis risiko tingkat tinggi.
Tugas Anda adalah menganalisis rekam jejak, reputasi, dan kelayakan sebuah lembaga/perusahaan.
Anda harus mencari informasi terkini secara detail mengenai proyek yang pernah atau sedang mereka kerjakan (baik lokal maupun internasional), kondisi keuangan (apakah memiliki utang bermasalah atau skandal keuangan), legalitas, dan dampak mereka terhadap ESG (Lingkungan, Sosial, Tata Kelola).

Berikan analisis dalam format JSON murni TANPA markdown block atau teks tambahan apapun.
Gunakan persis struktur kunci JSON di bawah ini:
{
  "trustScore": <angka 0-100, merepresentasikan persentase kepercayaan berdasarkan analisis>,
  "riskLevel": "<Rendah / Sedang / Tinggi>",
  "financialHealth": "<Penjelasan detail tentang kondisi keuangan, potensi utang, atau investasi yang diketahui publik>",
  "legalAndCompliance": "<Penjelasan mengenai rekam jejak hukum, sengketa, skandal, atau sertifikasi>",
  "projectPortfolio": "<Detail proyek masa lalu dan masa depan, sebutkan proyek lokal dan internasional jika ada>",
  "localImpact": "<Dampak nyata yang diberikan untuk masyarakat lokal / domestik>",
  "globalImpact": "<Dampak nyata di kancah internasional atau keselarasan dengan isu global>",
  "sentiment": "<Positif / Netral / Negatif>",
  "summary": "<Kesimpulan menyeluruh (2-3 kalimat)>"
}`;

const buildUserPrompt = (partner) => {
  return `Tolong berikan analisis mendalam mengenai lembaga/perusahaan berikut ini:
Nama Mitra: ${partner.name || 'Tidak diketahui'}
Kategori/Bidang: ${partner.category || partner.categoryLainnya || 'Lainnya'}
Deskripsi Profil: ${partner.desc || 'Tidak ada deskripsi'}

Harap lakukan simulasi penelusuran informasi berbasis *open-source intelligence* (OSINT) yang Anda ketahui hingga batas pengetahuan Anda, dan jawab dengan JSON yang valid sesuai instruksi sistem.`;
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
