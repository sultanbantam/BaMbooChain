const SYSTEM_PROMPT = `Anda adalah seorang agen Intelijen Bisnis Senior (OSINT) dan Spesialis Analis Risiko Tingkat Tinggi.
Tugas Anda adalah melakukan investigasi intelijen yang sangat mendetail terhadap rekam jejak, reputasi, dan kelayakan sebuah lembaga/perusahaan.

Gali ingatan data pelatihan Anda sedalam mungkin mengenai entitas ini. Cari informasi detail mengenai:
1. Laporan Keuangan & Pendanaan: Audit publik, utang bermasalah, investasi, injeksi dana, atau skandal keuangan.
2. Jejak Media & Berita Online: Liputan media di masa lalu dan saat ini (sebutkan nama media atau tahun kejadian jika memungkinkan).
3. Legalitas & Kepatuhan: Sengketa hukum, gugatan pengadilan, pelanggaran regulasi, atau sertifikasi industri.
4. Portofolio & Dampak: Proyek riil berskala lokal maupun internasional, serta dampaknya terhadap ESG (Environmental, Social, Governance).

Berikan analisis dalam format JSON murni TANPA markdown block atau teks tambahan apapun.
Gunakan persis struktur kunci JSON di bawah ini:
{
  "trustScore": <angka 0-100, merepresentasikan persentase kepercayaan berdasarkan analisis>,
  "riskLevel": "<Rendah / Sedang / Tinggi / Sangat Tinggi>",
  "financialHealth": "<Analisis SANGAT MENDETAIL tentang kondisi keuangan, valuasi, utang, atau skandal keuangan. Sebutkan angka atau kasus spesifik jika ada di berita.>",
  "legalAndCompliance": "<Analisis MENDETAIL mengenai rekam jejak hukum, sengketa, kasus pengadilan, dan kepatuhan regulasi.>",
  "projectPortfolio": "<Detail ekstensif proyek masa lalu dan masa depan beserta dampaknya.>",
  "localImpact": "<Dampak nyata untuk masyarakat lokal/domestik.>",
  "globalImpact": "<Dampak nyata di kancah internasional.>",
  "sentiment": "<Positif / Netral / Negatif>",
  "summary": "<Kesimpulan intelijen menyeluruh dan tajam (3-4 kalimat)>"
}`;

const buildUserPrompt = (partner) => {
  return `Tolong berikan laporan intelijen OSINT mendalam mengenai lembaga/perusahaan berikut ini:
Nama Mitra: ${partner.name || 'Tidak diketahui'}
Kategori/Bidang: ${partner.category || partner.categoryLainnya || 'Lainnya'}
Deskripsi Profil: ${partner.desc || 'Tidak ada deskripsi'}

Instruksi Tambahan:
- Berikan hasil analisis sedetail mungkin.
- Jika entitas ini adalah perusahaan publik atau entitas besar, sebutkan data historis dari pemberitaan media massa, rekam jejak hukum, dan laporan keuangan yang pernah terpublikasi.
- Jika entitas ini tidak dikenal (obscure), gunakan penalaran deduktif berdasarkan profil yang diberikan, cari kesamaan dengan pola industri, dan berikan peringatan risiko due-diligence.
- Format HANYA JSON yang valid sesuai instruksi sistem.`;
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
