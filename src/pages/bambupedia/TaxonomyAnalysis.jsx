import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Scan, CheckCircle, AlertCircle, Info, ArrowLeft, RefreshCw, Sprout, Activity, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBambupedia } from '../../context/BambupediaContext';
import BackButton from '../../components/BackButton';

const TaxonomyAnalysis = () => {
  const navigate = useNavigate();
  const { addTaxonomy } = useBambupedia();
  
  const [image, setImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    
    setIsScanning(true);
    setResult(null);
    setError(null);
    
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API Key tidak ditemukan. Pastikan Anda telah menambahkannya di file .env");
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "You are an expert Bamboo Botanist AI. Analyze this image of bamboo. Identify its likely species, estimate its age in years, and assess its health status (0-100). Provide details and recommendations. Your output must be ONLY a valid JSON object EXACTLY in this format: {\"species\": \"Bambu X (Scientific name)\", \"age\": \"X Tahun\", \"health\": 90, \"status\": \"Sehat\", \"details\": \"Batang sehat...\", \"recommendation\": \"Beri pupuk...\"}"
                },
                {
                  type: "image_url",
                  image_url: {
                    url: image
                  }
                }
              ]
            }
          ],
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error("Gagal menghubungi server AI (OpenAI API).");
      }

      const data = await response.json();
      let aiResponseText = data.choices[0].message.content.trim();
      
      if (aiResponseText.startsWith('```json')) {
        aiResponseText = aiResponseText.replace(/^```json\n/, '').replace(/\n```$/, '');
      }

      const finalResult = JSON.parse(aiResponseText);
      setResult(finalResult);
      
      // Simpan ke riwayat
      addTaxonomy({
        image: image,
        ...finalResult
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat memproses gambar.");
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setIsScanning(false);
  };

  return (
    <div className="light-gradient-bg" style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '100px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div style={{ marginBottom: '30px' }}>
          <BackButton to="/bambupedia/tracker" />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12, 166, 120, 0.1)', padding: '8px 20px', borderRadius: '30px', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '16px' }}>
            <Scan size={20} /> AI Taxonomy Vision
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>Analisis Taksonomi AI</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Identifikasi spesies, estimasi usia, dan cek kesehatan bambu melalui kamera secara instan.</p>
        </div>

        {!image ? (
          /* UPLOAD SECTION */
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="glass"
            style={{ 
              height: '400px', borderRadius: '32px', border: '2px dashed var(--primary)', 
              background: 'rgba(12, 166, 120, 0.02)', display: 'flex', flexDirection: 'column', 
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(12, 166, 120, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(12, 166, 120, 0.02)'}
          >
            <div style={{ background: 'rgba(12, 166, 120, 0.1)', padding: '30px', borderRadius: '50%', color: 'var(--primary)', marginBottom: '24px' }}>
              <Camera size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '10px' }}>Ambil Foto atau Unggah</h3>
            <p style={{ color: 'var(--text-muted)' }}>Klik untuk membuka kamera atau pilih file dari galeri</p>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageChange}
            />
          </div>
        ) : (
          /* PREVIEW & ANALYSIS SECTION */
          <div className="animate-fade-in">
            <div style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', marginBottom: '30px', background: 'white' }}>
              <img src={image} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', display: 'block' }} />
              
              {isScanning && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <div className="scan-line" style={{ position: 'absolute', width: '100%', height: '4px', background: 'var(--primary)', boxShadow: '0 0 20px var(--primary)', animation: 'scan 2s linear infinite' }} />
                  <RefreshCw size={50} className="animate-spin" style={{ marginBottom: '20px' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Menganalisis...</h3>
                  <p style={{ opacity: 0.8 }}>Mendeteksi struktur serat & pigmen batang</p>
                </div>
              )}

              {result && (
                <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                  <div style={{ background: 'rgba(34, 197, 94, 0.9)', color: 'white', padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', backdropFilter: 'blur(10px)' }}>
                    <CheckCircle size={18} /> Teranalisis
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {!isScanning && !result && (
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={reset} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1px solid #ddd', background: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Batal</button>
                <button onClick={startAnalysis} style={{ flex: 2, padding: '16px', borderRadius: '16px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(12, 166, 120, 0.2)' }}>
                  <Scan size={20} /> Mulai Analisis AI
                </button>
              </div>
            )}

            {result && (
              <div className="glass animate-slide-up" style={{ padding: '40px', borderRadius: '32px', background: 'white', border: '1px solid rgba(12, 166, 120, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px' }}>{result.species}</h2>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>Usia: {result.age}</span>
                      <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>{result.status}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Skor Kesehatan</div>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: result.health > 80 ? 'var(--primary)' : '#f59f00' }}>{result.health}%</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: 'var(--text-main)', fontWeight: 'bold' }}>
                      <Activity size={18} color="var(--primary)" /> Detail Analisis
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{result.details}</p>
                  </div>
                  <div style={{ background: 'rgba(12, 166, 120, 0.03)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(12, 166, 120, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>
                      <ShieldCheck size={18} /> Rekomendasi
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{result.recommendation}</p>
                  </div>
                </div>

                <div style={{ textAlign: 'center', display: 'flex', gap: '15px' }}>
                   <button onClick={reset} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1px solid #ddd', background: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Analisis Lain</button>
                   <button onClick={() => navigate('/bambupedia/tracker')} style={{ flex: 2, padding: '16px', borderRadius: '16px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Lihat di Riwayat Tracker</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* INFO CARDS */}
        <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {[
            { icon: <Sprout />, title: "36+ Spesies", desc: "Database taksonomi bambu Nusantara" },
            { icon: <Activity />, title: "Health Check", desc: "Deteksi jamur & hama otomatis" },
            { icon: <ShieldCheck />, title: "Web3 Verified", desc: "Hasil terenkripsi di ekosistem Sabumi" }
          ].map((item, i) => (
            <div key={i} className="glass" style={{ padding: '24px', borderRadius: '20px', textAlign: 'center', background: 'white' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .scan-line {
          z-index: 10;
        }
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
