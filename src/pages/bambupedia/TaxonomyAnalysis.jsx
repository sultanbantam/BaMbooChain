import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Scan, CheckCircle, AlertCircle, Info, ArrowLeft, RefreshCw, Sprout, Activity, ShieldCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBambupedia } from '../../context/BambupediaContext';
import BackButton from '../../components/BackButton';

const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.6) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    };
    reader.readAsDataURL(file);
  });
};

const photoCategories = [
  { id: 'rumpun', label: 'Rumpun', count: 3 },
  { id: 'ruas_batang', label: 'Ruas Batang', count: 1 },
  { id: 'buku_batang', label: 'Buku Batang', count: 1 },
  { id: 'pelepah_daun', label: 'Pelepah Daun', count: 1 },
  { id: 'pelepah_batang', label: 'Pelepah Batang (Blade-Auricle-Bristle)', count: 3 },
  { id: 'cabang', label: 'Cabang', count: 1 },
  { id: 'rebung', label: 'Rebung (Opsional)', count: 3 },
  { id: 'bunga', label: 'Bunga (Opsional)', count: 1 }
];

const TaxonomyAnalysis = () => {
  const navigate = useNavigate();
  const { addTaxonomy } = useBambupedia();
  
  const [images, setImages] = useState({});
  const [contextData, setContextData] = useState({ diameter: '', warna: '', lokasi: '' });
  
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const handleImageUpload = async (e, categoryId, maxCount) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const currentImages = images[categoryId] || [];
    const remainingSlots = maxCount - currentImages.length;
    const filesToProcess = files.slice(0, remainingSlots);
    
    if (filesToProcess.length === 0) return;

    const compressedImages = await Promise.all(
      filesToProcess.map(file => compressImage(file))
    );
    
    setImages(prev => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] || []), ...compressedImages]
    }));
  };

  const removeImage = (categoryId, index) => {
    setImages(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter((_, i) => i !== index)
    }));
  };

  const startAnalysis = async () => {
    const allImages = Object.values(images).flat();
    if (allImages.length === 0) {
      setError("Silakan unggah setidaknya satu foto bambu untuk dianalisis.");
      return;
    }
    
    setIsScanning(true);
    setResult(null);
    setError(null);
    
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API Key tidak ditemukan. Pastikan Anda telah menambahkannya di file .env");
      }

      const imagePayloads = [];
      for (const catId in images) {
        images[catId].forEach(imgUrl => {
          imagePayloads.push({
            type: "image_url",
            image_url: { url: imgUrl, detail: "low" }
          });
        });
      }

      const systemPrompt = `You are an expert Bamboo Taxonomist AI specialized in Indonesian bamboo species (e.g. Gigantochloa apus, Dendrocalamus asper, Bambusa vulgaris).
You MUST output ONLY a valid JSON object.
Analyze all provided images (which may include culms, leaves, shoots/rebung, nodes, internodes) along with context data to scientifically determine the species.
Instead of an absolute guess, provide top probability confidence.
Context Data:
- Diameter: ${contextData.diameter || 'Tidak disebutkan'}
- Warna: ${contextData.warna || 'Tidak disebutkan'}
- Lokasi Tumbuh: ${contextData.lokasi || 'Tidak disebutkan'}

Your output MUST be a JSON object with EXACTLY these keys: 'species' (string), 'confidence' (string like '95%'), 'age' (string like '3 Tahun'), 'health' (number 0-100), 'status' (string), 'details' (string), 'recommendation' (string), 'alternative_species' (string).`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                { type: "text", text: "Please scientifically analyze these bamboo anatomy photos." },
                ...imagePayloads
              ]
            }
          ],
          max_tokens: 600
        })
      });

      if (!response.ok) throw new Error("Gagal menghubungi server AI (OpenAI API).");

      const data = await response.json();
      let aiResponseText = data.choices[0].message.content.trim();
      
      const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) aiResponseText = jsonMatch[0];

      try {
        const parsedData = JSON.parse(aiResponseText);
        const finalResult = {
          species: parsedData.species || "Spesies Tidak Diketahui",
          confidence: parsedData.confidence || "Unknown",
          age: parsedData.age || "Tidak Diketahui",
          health: parsedData.health || 0,
          status: parsedData.status || "Tidak Jelas",
          details: parsedData.details || "AI tidak dapat menganalisis detail dari gambar yang diberikan.",
          recommendation: parsedData.recommendation || "Lakukan observasi langsung di lapangan.",
          alternative_species: parsedData.alternative_species || ""
        };
        
        setResult(finalResult);
        addTaxonomy({ image: allImages[0], ...finalResult });
      } catch (parseError) {
        throw new Error("AI gagal memformat respons dengan benar.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat memproses gambar.");
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setImages({});
    setResult(null);
    setIsScanning(false);
    setError(null);
  };

  const totalUploaded = Object.values(images).flat().length;

  return (
    <div className="light-gradient-bg" style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '100px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div style={{ marginBottom: '30px' }}>
          <BackButton to="/bambupedia/tracker" />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12, 166, 120, 0.1)', padding: '8px 20px', borderRadius: '30px', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '16px' }}>
            <Scan size={20} /> AI Taxonomy Vision V3
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>Analisis Taksonomi AI</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Unggah kelengkapan anatomi bambu untuk mendapatkan hasil identifikasi spesies dengan akurasi tinggi layaknya ahli botani.</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '16px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {!isScanning && !result && (
          <div className="animate-fade-in">
            {/* Context Data Form */}
            <div className="glass" style={{ background: 'white', padding: '30px', borderRadius: '24px', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text-main)' }}>Konteks Tambahan (Opsional)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Perkiraan Diameter</label>
                  <input type="text" placeholder="Misal: 15 cm" value={contextData.diameter} onChange={e => setContextData({...contextData, diameter: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Warna Dominan</label>
                  <input type="text" placeholder="Misal: Hijau Tua" value={contextData.warna} onChange={e => setContextData({...contextData, warna: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Lokasi Tumbuh</label>
                  <input type="text" placeholder="Misal: Pinggir Sungai" value={contextData.lokasi} onChange={e => setContextData({...contextData, lokasi: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd' }} />
                </div>
              </div>
            </div>

            {/* Photo Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              {photoCategories.map(cat => {
                const uploaded = images[cat.id] || [];
                return (
                  <div key={cat.id} className="glass" style={{ background: 'white', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '1rem', color: 'var(--text-main)' }}>{cat.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Maks. {cat.count} Foto</div>
                    
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {uploaded.map((img, i) => (
                        <div key={i} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
                          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button onClick={() => removeImage(cat.id, i)} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      <input 
                        type="file" 
                        id={`upload-${cat.id}`} 
                        multiple 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageUpload(e, cat.id, cat.count)}
                        disabled={uploaded.length >= cat.count}
                      />
                      <label htmlFor={`upload-${cat.id}`} style={{ display: 'block', width: '100%', padding: '10px', textAlign: 'center', background: uploaded.length >= cat.count ? '#f1f5f9' : 'rgba(12, 166, 120, 0.1)', color: uploaded.length >= cat.count ? '#94a3b8' : 'var(--primary)', borderRadius: '10px', fontWeight: 'bold', cursor: uploaded.length >= cat.count ? 'not-allowed' : 'pointer', transition: '0.2s' }}>
                        {uploaded.length >= cat.count ? 'Penuh' : '+ Upload Foto'}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={startAnalysis} 
              disabled={totalUploaded === 0}
              style={{ width: '100%', padding: '20px', borderRadius: '20px', border: 'none', background: totalUploaded === 0 ? '#cbd5e1' : 'var(--primary)', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: totalUploaded === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: totalUploaded === 0 ? 'none' : '0 10px 25px rgba(12, 166, 120, 0.3)', transition: '0.3s' }}
            >
              <Scan size={24} /> {totalUploaded === 0 ? 'Unggah Foto Dahulu' : `Mulai Analisis AI (${totalUploaded} Foto)`}
            </button>
          </div>
        )}

        {isScanning && (
          <div className="glass" style={{ padding: '60px', borderRadius: '32px', background: 'white', textAlign: 'center' }}>
            <RefreshCw size={60} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 24px auto', display: 'block' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '10px' }}>Menganalisis {totalUploaded} Foto Anatomi...</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>AI Botani kami sedang membandingkan ciri-ciri fisik daun, batang, dan pelepah dengan database Taksonomi Nusantara.</p>
          </div>
        )}

        {result && (
          <div className="glass animate-slide-up" style={{ padding: '40px', borderRadius: '32px', background: 'white', border: '1px solid rgba(12, 166, 120, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {result.species} <span style={{ fontSize: '1rem', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px' }}>Akurasi {result.confidence}</span>
                </h2>
                {result.alternative_species && (
                  <div style={{ fontSize: '0.9rem', color: '#f59f00', fontWeight: 'bold', marginBottom: '12px' }}>
                    Kemungkinan lain: {result.alternative_species}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>Usia: {result.age}</span>
                  <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', padding: '6px 16px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>Status: {result.status}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', background: '#f8f9fa', padding: '16px 24px', borderRadius: '20px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>Skor Kesehatan AI</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: result.health > 80 ? 'var(--primary)' : '#f59f00', lineHeight: 1 }}>{result.health}%</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '24px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-main)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <Activity size={20} color="var(--primary)" /> Analisis Anatomi
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>{result.details}</p>
              </div>
              <div style={{ background: 'rgba(12, 166, 120, 0.03)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(12, 166, 120, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <ShieldCheck size={20} /> Rekomendasi Ahli
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>{result.recommendation}</p>
              </div>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
               <button onClick={reset} style={{ flex: 1, minWidth: '200px', padding: '18px', borderRadius: '20px', border: '2px solid #eee', background: 'white', color: 'var(--text-main)', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={(e) => e.target.style.borderColor = 'var(--primary)'} onMouseLeave={(e) => e.target.style.borderColor = '#eee'}>Analisis Pohon Lain</button>
               <button onClick={() => navigate('/bambupedia/tracker')} style={{ flex: 2, minWidth: '300px', padding: '18px', borderRadius: '20px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(12, 166, 120, 0.2)' }}>Simpan ke Riwayat Tracker</button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .animate-spin {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TaxonomyAnalysis;
