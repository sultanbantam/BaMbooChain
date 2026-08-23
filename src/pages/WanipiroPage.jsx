import React, { useState, useEffect } from 'react';
import { Leaf, Search, DollarSign, CloudRain, ShieldCheck, Factory, AlertTriangle, ArrowRight, Loader, Tag, CheckCircle2, ThumbsUp, ThumbsDown, Info, Upload, X, Camera, History } from 'lucide-react';
import { fetchWanipiroAppraisal } from '../utils/wanipiroService';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const WanipiroPage = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { addProduct, products } = useMarketplace();
  const navigate = useNavigate();
  const [mode, setMode] = useState('raw_bamboo'); // 'raw_bamboo' | 'finished_product'
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Raw Bamboo
    lokasi: '',
    keterangan_lainnya: '',
    jenis_bambu: 'petung',
    jenis_bambu_lainnya: '',
    jumlah_batang: '',
    satuan_jual: 'per_batang',
    panjang_total_meter: '',
    diameter_pangkal_cm: '',
    diameter_tengah_cm: '',
    diameter_ujung_cm: '',
    ketebalan_dinding_cm: '',
    usia: '3-5_tahun',
    kelurusan: 'lurus',
    kondisi_fisik: 'utuh',
    kondisi_fisik_lainnya: '',
    // Finished Product
    nama_produk: '',
    kategori_produk: 'anyaman',
    kategori_produk_lainnya: '',
    dimensi_p: '',
    dimensi_l: '',
    dimensi_t: '',
    berat_gram: '',
    tingkat_kesulitan: 'sedang',
    waktu_pengerjaan_jam: 8,
    teknik_utama: 'anyaman',
    teknik_utama_lainnya: '',
    finishing_khusus: 'tidak_ada',
    punya_merek: false
  });

  // Images State (Base64)
  const [images, setImages] = useState([]);
  
  // History State
  const [appraisalHistory, setAppraisalHistory] = useState([]);
  const [historySearch, setHistorySearch] = useState('');

  // Load global history on mount
  useEffect(() => {
    // Load last result from local storage
    const cachedResult = localStorage.getItem('wanipiro_last_result');
    if (cachedResult) {
      try {
        const parsed = JSON.parse(cachedResult);
        if (parsed.result) {
          setResult(parsed.result);
          setFormData(parsed.formData);
          setMode(parsed.mode);
          setImages(parsed.images || []);
        }
      } catch(e) {
        console.error("Failed to parse cached result", e);
      }
    }

    // Subscribe to global history
    if (!db) return;
    const q = query(collection(db, 'wanipiro_public_history'), orderBy('date', 'desc'), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      const historyData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppraisalHistory(historyData);
      localStorage.setItem('wanipiro_history', JSON.stringify(historyData));
    }, (err) => {
      console.error("Failed to sync Wanipiro history", err);
      const saved = localStorage.getItem('wanipiro_history');
      if (saved) setAppraisalHistory(JSON.parse(saved));
    });

    return () => unsub();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? '' : Number(value)) : value)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert("Maksimal 3 foto!");
      return;
    }

    files.forEach(file => {
      if (file.size > 1024 * 1024) {
        alert(`File ${file.name} melebihi 1 MB!`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const max_size = 800;
          if (width > height && width > max_size) {
            height = Math.round((height * max_size) / width);
            width = max_size;
          } else if (height > width && height > max_size) {
            width = Math.round((width * max_size) / height);
            height = max_size;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Tambahkan Watermark bamboochain.id
          const fontSize = Math.max(14, Math.floor(width * 0.05));
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
          ctx.shadowBlur = 4;
          ctx.fillText("bamboochain.id", width - 15, height - 15);
          
          setImages(prev => [...prev, canvas.toDataURL('image/jpeg', 0.8)]);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    const payload = {
      user_id: "user_web_123",
      tanggal_penaksiran: new Date().toISOString().split('T')[0],
      lokasi: formData.lokasi,
      kategori: mode,
      keterangan_tambahan: formData.keterangan_lainnya
    };

    const getVal = (main, other) => main === 'lainnya' ? other : main;

    if (mode === 'raw_bamboo') {
      payload.raw_data = {
        jenis_bambu: getVal(formData.jenis_bambu, formData.jenis_bambu_lainnya),
        jumlah_batang: formData.jumlah_batang,
        satuan_jual: formData.satuan_jual,
        panjang_total_meter: formData.panjang_total_meter,
        diameter_pangkal_cm: formData.diameter_pangkal_cm,
        diameter_tengah_cm: formData.diameter_tengah_cm,
        diameter_ujung_cm: formData.diameter_ujung_cm,
        ketebalan_dinding_cm: formData.ketebalan_dinding_cm,
        usia: formData.usia,
        kelurusan: formData.kelurusan,
        kondisi_fisik: getVal(formData.kondisi_fisik, formData.kondisi_fisik_lainnya)
      };
    } else {
      payload.product_data = {
        nama_produk: formData.nama_produk || 'Produk Bambu',
        kategori_produk: getVal(formData.kategori_produk, formData.kategori_produk_lainnya),
        jenis_bambu: getVal(formData.jenis_bambu, formData.jenis_bambu_lainnya),
        dimensi: { panjang_cm: formData.dimensi_p, lebar_cm: formData.dimensi_l, tinggi_cm: formData.dimensi_t },
        berat_gram: formData.berat_gram,
        tingkat_kesulitan: formData.tingkat_kesulitan,
        waktu_pengerjaan_jam: formData.waktu_pengerjaan_jam,
        teknik_utama: getVal(formData.teknik_utama, formData.teknik_utama_lainnya),
        finishing_khusus: formData.finishing_khusus,
        punya_merek: formData.punya_merek
      };
    }

    try {
      // Ambil data bursa live untuk injeksi prompt
      let marketContextStr = "";
      if (db) {
        try {
          const mSnap = await getDoc(doc(db, "marketplace_bursa", "live_feed"));
          if (mSnap.exists() && mSnap.data().data) {
            marketContextStr = JSON.stringify(mSnap.data().data.map(d => ({ aset: d.typeKey, harga: d.price, tren: d.trend })));
          }
        } catch(e) { console.warn("Gagal mengambil data bursa", e); }
      }

      let processedImages = [...images];
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      
      if (processedImages.length > 0 && cloudName && uploadPreset) {
         const uploadedUrls = [];
         for (const imgBase64 of processedImages) {
           try {
             // Extract base64 part if it has data:image prefix
             const base64Data = imgBase64.includes('base64,') ? imgBase64 : `data:image/jpeg;base64,${imgBase64}`;
             
             const fd = new FormData();
             fd.append('file', base64Data);
             fd.append('upload_preset', uploadPreset);
             
             const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: fd
             });
             const json = await res.json();
             
             if (json.secure_url) {
               uploadedUrls.push(json.secure_url);
             } else {
               uploadedUrls.push(imgBase64); // Fallback
             }
           } catch (e) {
             console.warn("Cloudinary upload failed", e);
             uploadedUrls.push(imgBase64);
           }
         }
         processedImages = uploadedUrls;
      }

      const data = await fetchWanipiroAppraisal(payload, processedImages, marketContextStr);
      if (data.status === 'error') {
        setError(data.message || 'Data tidak lengkap atau terjadi kesalahan.');
      } else {
        setResult(data);
        let payloadToSave = { result: data, formData, mode, images: processedImages, date: new Date().toISOString() };
        
        try {
          localStorage.setItem('wanipiro_last_result', JSON.stringify(payloadToSave));
        } catch (e) {
          console.warn("Quota exceeded, omitting images from cache");
          payloadToSave.images = [];
          localStorage.setItem('wanipiro_last_result', JSON.stringify(payloadToSave));
        }
        
        // Save to global history
        try {
          // Hanya simpan URL yang valid (bukan base64) ke Firebase agar tidak limit size
          const safeImages = processedImages.filter(img => img.startsWith('http'));
          const publicPayload = {
            result: data,
            formData,
            mode,
            images: safeImages,
            date: new Date().toISOString(),
            userId: user ? user.id : 'guest',
            userName: user ? user.displayName : 'Guest User'
          };
          addDoc(collection(db, 'wanipiro_public_history'), publicPayload).catch(e => {
            console.error("Failed to save to global history:", e);
          });
          setAppraisalHistory(prev => [{ id: 'temp-' + Date.now(), ...publicPayload }, ...prev]);
        } catch (e) {
          console.error("Failed to save to global history:", e);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Gagal menghubungi Juru Taksir AI. Pastikan konfigurasi API OpenAI valid.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishToMarketplace = async () => {
    if (!result || !result.data) return;
    setIsLoading(true);
    
    const bmcNumber = 100 + (products ? products.length : 0);
    const baseItemName = mode === 'raw_bamboo' 
      ? `Bambu ${formData.jenis_bambu === 'lainnya' ? formData.jenis_bambu_lainnya : formData.jenis_bambu} (${formData.panjang_total_meter}m)`
      : (formData.nama_produk || 'Produk Kerajinan Bambu');
    const itemName = `BMC${bmcNumber} ${baseItemName}`;
      
    const productDesc = `${result.data.rekomendasi_petani}\n\nSpesifikasi:\n- Lokasi: ${formData.lokasi}\n- Kondisi: ${formData.kondisi_fisik}\n- Total Estimasi: Rp ${result.data.harga_total_estimasi?.toLocaleString('id-ID')}\n\nSertifikat Penaksiran WaniPiro:\n${result.data.detai_proses}`;
    
    const productData = {
      name: itemName,
      description: productDesc,
      priceIdr: result.data.harga_total_estimasi || 0,
      category: mode === 'raw_bamboo' ? 'Bahan Baku' : 'Produk Jadi',
      status: 'Approved',
      // Hanya kirim URL Cloudinary ke server (jangan kirim base64)
      images: (images || []).filter(img => img.startsWith('http')) 
    };

    try {
      const added = await addProduct(productData);

      if (added) {
        alert("Berhasil dipublikasikan ke Marketplace secara Global!");
        navigate('/bamboochain/marketplace');
      } else {
        alert("Terjadi kesalahan saat mempublikasikan ke server.");
      }
      
    } catch (err) {
      console.error(err);
      alert('Gagal mempublikasikan produk.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '140px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', background: 'rgba(12, 166, 120, 0.1)', borderRadius: '16px', color: 'var(--primary)', marginBottom: '15px' }}>
            <DollarSign size={32} />
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '10px' }}>WaniPiro?</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Juru Taksir Bambu Profesional PERPUBI. Dapatkan estimasi harga pasar paling akurat untuk bambu mentah maupun produk jadi berdasarkan ukuran, usia, spesifikasi, dan foto.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
          
          {/* Input Panel */}
          <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', alignSelf: 'start' }}>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', background: 'var(--bg-secondary)', padding: '5px', borderRadius: '12px' }}>
              <button 
                onClick={() => setMode('raw_bamboo')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: mode === 'raw_bamboo' ? 'var(--primary)' : 'transparent', color: mode === 'raw_bamboo' ? 'white' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
              >🎋 Bambu Mentah</button>
              <button 
                onClick={() => setMode('finished_product')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: mode === 'finished_product' ? 'var(--primary)' : 'transparent', color: mode === 'finished_product' ? 'white' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
              >🪑 Produk Jadi</button>
            </div>
            
            <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label className="form-label">Lokasi</label>
                  <input type="text" name="lokasi" placeholder="Misal: Bandung, Indonesia" value={formData.lokasi} onChange={handleInputChange} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Jenis Bambu</label>
                  <select name="jenis_bambu" value={formData.jenis_bambu} onChange={handleInputChange} className="form-input">
                    <option value="petung">Petung</option>
                    <option value="temen">Temen</option>
                    <option value="hitam_wulung">Hitam/Wulung</option>
                    <option value="tali_apus">Tali/Apus</option>
                    <option value="gombong">Gombong</option>
                    <option value="lainnya">Lainnya...</option>
                  </select>
                  {formData.jenis_bambu === 'lainnya' && (
                    <input type="text" name="jenis_bambu_lainnya" placeholder="Sebutkan jenis..." value={formData.jenis_bambu_lainnya} onChange={handleInputChange} className="form-input" style={{ marginTop: '8px' }} required />
                  )}
                </div>
              </div>

              {mode === 'raw_bamboo' && (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label className="form-label">Jml Batang</label>
                      <input type="number" name="jumlah_batang" placeholder="Contoh: 100" value={formData.jumlah_batang} onChange={handleInputChange} className="form-input" min="1" required />
                    </div>
                    <div>
                      <label className="form-label">Panjang (m)</label>
                      <input type="number" step="0.1" name="panjang_total_meter" placeholder="Contoh: 6.5" value={formData.panjang_total_meter} onChange={handleInputChange} className="form-input" min="0.1" required />
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="form-label">Ø Pangkal (cm)</label>
                      <input type="number" step="0.1" name="diameter_pangkal_cm" placeholder="Contoh: 10" value={formData.diameter_pangkal_cm} onChange={handleInputChange} className="form-input" required />
                    </div>
                    <div>
                      <label className="form-label">Ø Tengah (cm)</label>
                      <input type="number" step="0.1" name="diameter_tengah_cm" placeholder="Contoh: 8" value={formData.diameter_tengah_cm} onChange={handleInputChange} className="form-input" required />
                    </div>
                    <div>
                      <label className="form-label">Ø Ujung (cm)</label>
                      <input type="number" step="0.1" name="diameter_ujung_cm" placeholder="Contoh: 5" value={formData.diameter_ujung_cm} onChange={handleInputChange} className="form-input" required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="form-label">Usia</label>
                      <select name="usia" value={formData.usia} onChange={handleInputChange} className="form-input">
                        <option value="<3_tahun">&lt; 3 Tahun</option>
                        <option value="3-5_tahun">3-5 Tahun</option>
                        <option value=">5_tahun">&gt; 5 Tahun</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Kelurusan</label>
                      <select name="kelurusan" value={formData.kelurusan} onChange={handleInputChange} className="form-input">
                        <option value="lurus">Lurus</option>
                        <option value="agak_melengkung">Melengkung</option>
                        <option value="melengkung">Sangat Melengkung</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Kondisi</label>
                      <select name="kondisi_fisik" value={formData.kondisi_fisik} onChange={handleInputChange} className="form-input">
                        <option value="utuh">Utuh</option>
                        <option value="retak_ringan">Retak Ringan</option>
                        <option value="terserang_hama">Hama</option>
                        <option value="lainnya">Lainnya...</option>
                      </select>
                      {formData.kondisi_fisik === 'lainnya' && (
                        <input type="text" name="kondisi_fisik_lainnya" placeholder="Jelaskan..." value={formData.kondisi_fisik_lainnya} onChange={handleInputChange} className="form-input" style={{ marginTop: '8px' }} required />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {mode === 'finished_product' && (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label className="form-label">Nama Produk Kerajinan</label>
                    <input type="text" name="nama_produk" placeholder="Misal: Kursi Malas Lincak" value={formData.nama_produk} onChange={handleInputChange} className="form-input" required />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label className="form-label">Kategori</label>
                      <select name="kategori_produk" value={formData.kategori_produk} onChange={handleInputChange} className="form-input">
                        <option value="anyaman">Anyaman</option>
                        <option value="furnitur">Furnitur</option>
                        <option value="ukiran_seni">Ukiran/Seni</option>
                        <option value="lainnya">Lainnya...</option>
                      </select>
                      {formData.kategori_produk === 'lainnya' && (
                        <input type="text" name="kategori_produk_lainnya" placeholder="Kategori lain..." value={formData.kategori_produk_lainnya} onChange={handleInputChange} className="form-input" style={{ marginTop: '8px' }} required />
                      )}
                    </div>
                    <div>
                      <label className="form-label">Teknik Utama</label>
                      <select name="teknik_utama" value={formData.teknik_utama} onChange={handleInputChange} className="form-input">
                        <option value="anyaman">Anyaman</option>
                        <option value="potong_sambung">Potong & Sambung</option>
                        <option value="ukiran">Ukiran</option>
                        <option value="kombinasi">Kombinasi</option>
                        <option value="lainnya">Lainnya...</option>
                      </select>
                      {formData.teknik_utama === 'lainnya' && (
                        <input type="text" name="teknik_utama_lainnya" placeholder="Sebutkan teknik..." value={formData.teknik_utama_lainnya} onChange={handleInputChange} className="form-input" style={{ marginTop: '8px' }} required />
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label className="form-label">Kesulitan (Kerumitan)</label>
                      <select name="tingkat_kesulitan" value={formData.tingkat_kesulitan} onChange={handleInputChange} className="form-input">
                        <option value="mudah">Mudah</option>
                        <option value="sedang">Sedang</option>
                        <option value="sulit">Sulit</option>
                        <option value="sangat_sulit">Sangat Sulit (Detail)</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Est. Waktu Kerja (Jam)</label>
                      <input type="number" name="waktu_pengerjaan_jam" placeholder="Contoh: 8" value={formData.waktu_pengerjaan_jam} onChange={handleInputChange} className="form-input" min="0" required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label className="form-label">Dimensi PxLxT (cm)</label>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <input type="number" name="dimensi_p" placeholder="P: 200" value={formData.dimensi_p} onChange={handleInputChange} className="form-input" required />
                        <input type="number" name="dimensi_l" placeholder="L: 60" value={formData.dimensi_l} onChange={handleInputChange} className="form-input" required />
                        <input type="number" name="dimensi_t" placeholder="T: 80" value={formData.dimensi_t} onChange={handleInputChange} className="form-input" required />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Berat Est. (Gram)</label>
                      <input type="number" name="berat_gram" placeholder="Contoh: 15000" value={formData.berat_gram} onChange={handleInputChange} className="form-input" required />
                    </div>
                  </div>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer', marginTop: '10px', color: 'var(--text-main)' }}>
                    <input type="checkbox" name="punya_merek" checked={formData.punya_merek} onChange={handleInputChange} />
                    Produk ini memiliki Merek Terdaftar / Branding Kuat
                  </label>
                </div>
              )}
              
              {/* Keterangan Lainnya */}
              <div>
                <label className="form-label">Keterangan Lainnya (Opsional)</label>
                <textarea 
                  name="keterangan_lainnya" 
                  value={formData.keterangan_lainnya} 
                  onChange={handleInputChange} 
                  placeholder="Ceritakan detail spesifik yang membuat barang ini istimewa atau berikan penjelasan agar taksiran lebih akurat..." 
                  className="form-input" 
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              {/* Upload Foto */}
              <div style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Camera size={16}/> Upload Foto (Maks 3, &lt; 1MB/foto)</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <img src={img} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  
                  {images.length < 3 && (
                    <label style={{ width: '80px', height: '80px', borderRadius: '8px', border: '2px dashed var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer', background: 'rgba(12, 166, 120, 0.05)', transition: '0.2s' }}>
                      <Upload size={24} />
                      <input type="file" accept="image/png, image/jpeg, image/jpg" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                style={{ marginTop: '10px', width: '100%', padding: '16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: isLoading ? 0.7 : 1, transition: 'all 0.2s' }}
              >
                {isLoading ? <Loader className="spin" size={20} /> : <Search size={20} />}
                {isLoading ? 'Menaksir Harga...' : 'Taksir Harga Sekarang!'}
              </button>
            </form>
          </div>

          {/* Result Panel (Certificate Style) */}
          <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '24px', boxShadow: '0 15px 50px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
              <ShieldCheck size={24} color="var(--primary)" />
              Sertifikat Taksiran PERPUBI
            </h2>
            
            {error && (
              <div style={{ padding: '15px', background: '#fff0f0', color: '#e03131', borderRadius: '12px', border: '1px solid #ffc9c9', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <AlertTriangle size={18} /> {error}
              </div>
            )}
            
            {!result && !error && !isLoading && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', opacity: 0.6 }}>
                <Tag size={64} style={{ marginBottom: '15px', opacity: 0.5 }} />
                <p>Isi formulir penaksiran di sebelah kiri dan biarkan<br/>Juru Taksir AI menganalisis nilai pasar yang pantas.</p>
              </div>
            )}
            
            {result && result.data && (
              <div className="fade-in" style={{ flex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    {result.data.kategori === 'raw_bamboo' ? 'Taksiran Bambu Mentah' : 'Taksiran Kerajinan/Furnitur'}
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-1px' }}>
                    Rp {result.data.harga_total_estimasi?.toLocaleString('id-ID')}
                  </div>
                  <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                    Estimasi Harga Total untuk {result.data.jumlah_item} {result.data.satuan}
                  </div>
                </div>
                
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '20px', marginBottom: '25px', border: '1px dashed var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Kisaran Bawah:</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Rp {result.data.kisaran_harga_rendah?.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Kisaran Atas:</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Rp {result.data.kisaran_harga_tinggi?.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '5px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Harga Per {result.data.satuan}:</span>
                    <span style={{ fontWeight: 'bold', color: '#d97706' }}>Rp {result.data.harga_per_satuan?.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                  {result.data.faktor_pendorong_harga?.length > 0 && (
                    <div style={{ background: 'rgba(43, 138, 62, 0.1)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(43, 138, 62, 0.2)' }}>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#2b8a3e', margin: '0 0 10px 0' }}><ThumbsUp size={16} /> Premium (+):</h4>
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                        {result.data.faktor_pendorong_harga.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}
                  {result.data.faktor_penekan_harga?.length > 0 && (
                    <div style={{ background: 'rgba(224, 49, 49, 0.1)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(224, 49, 49, 0.2)' }}>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#e03131', margin: '0 0 10px 0' }}><ThumbsDown size={16} /> Diskon (-):</h4>
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                        {result.data.faktor_penekan_harga.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                
                {result.data.rekomendasi_petani && (
                  <div style={{ background: 'rgba(51, 154, 240, 0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(51, 154, 240, 0.2)', marginBottom: '20px' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#1971c2', margin: '0 0 8px 0' }}><Info size={16} /> Rekomendasi Juru Taksir:</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5' }}>{result.data.rekomendasi_petani}</p>
                  </div>
                )}
                
                <div style={{ padding: '15px', background: 'var(--bg-color)', borderRadius: '12px', border: '1px dashed var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <strong>📝 Detail Kalkulasi (Dibalik Layar):</strong><br/>
                  {result.data.detai_proses}
                </div>
                
                {result.pesan_ramah && (
                  <div style={{ marginTop: '25px', textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    "{result.pesan_ramah}"
                  </div>
                )}
                
                <button 
                  onClick={handlePublishToMarketplace}
                  disabled={isLoading}
                  style={{ marginTop: '30px', width: '100%', padding: '16px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.2s' }}
                >
                  {isLoading ? <Loader className="spin" size={20} /> : <Tag size={20} />}
                  Jual Langsung di Marketplace
                </button>

              </div>
            )}
          </div>
        </div>

        {/* RIWAYAT TAKSIRAN */}
        <div className="fade-in" style={{ marginTop: '50px', background: 'var(--bg-card)', padding: '30px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}><History size={24} style={{ color: 'var(--primary)' }}/> Riwayat Taksiran Publik</h3>
            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Cari riwayat..." 
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                style={{ width: '100%', padding: '12px 15px 12px 45px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'thin' }}>
             {appraisalHistory.length === 0 ? (
               <div style={{ padding: '20px', color: 'var(--text-muted)', width: '100%', textAlign: 'center' }}>
                 Belum ada riwayat taksiran publik saat ini.
               </div>
             ) : (
               appraisalHistory.filter(item => {
                  const name = item.mode === 'raw_bamboo' 
                    ? `Bambu ${item.formData?.jenis_bambu === 'lainnya' ? item.formData?.jenis_bambu_lainnya : item.formData?.jenis_bambu}`
                    : (item.formData?.nama_produk || 'Produk Kerajinan');
                  return name.toLowerCase().includes(historySearch.toLowerCase());
               }).map((item, idx) => {
                  const itemName = item.mode === 'raw_bamboo' 
                    ? `Bambu ${item.formData?.jenis_bambu === 'lainnya' ? item.formData?.jenis_bambu_lainnya : item.formData?.jenis_bambu}`
                    : (item.formData?.nama_produk || 'Produk Kerajinan');
                  
                  return (
                    <div 
                      key={item.date + idx} 
                      onClick={() => {
                        setResult(item.result);
                        setFormData(item.formData);
                        setMode(item.mode);
                        setImages(item.images || []);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                      style={{ 
                        minWidth: '280px', 
                        background: 'var(--bg-secondary)', 
                        padding: '20px', 
                        borderRadius: '16px', 
                        cursor: 'pointer', 
                        border: '1px solid var(--border-color)',
                        transition: 'transform 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                         <div>
                           <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1.1rem' }}>{itemName}</div>
                           <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '5px' }}>Oleh: {item.userName || 'Guest User'}</div>
                         </div>
                         <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                           {item.date ? new Date(item.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) : 'Baru-baru ini'}
                         </div>
                       </div>
                       
                       <div style={{ display: 'flex', gap: '10px' }}>
                         {item.images && item.images.length > 0 ? (
                           <img src={item.images[0]} alt="thumb" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                         ) : (
                           <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <Leaf size={24} style={{ color: 'var(--text-muted)' }} />
                           </div>
                         )}
                         <div style={{ flex: 1 }}>
                           <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Estimasi:</div>
                           <div style={{ fontWeight: '900', color: 'var(--primary)' }}>Rp {item.result?.data?.harga_total_estimasi?.toLocaleString('id-ID')}</div>
                         </div>
                       </div>
                    </div>
                   );
                })
             )}
            </div>
          </div>
      </div>
      <style>{`
        .form-label { display: block; margin-bottom: 6px; font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
        .form-input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-main); font-size: 0.95rem; transition: 0.2s; }
        .form-input::placeholder { color: #8892b0; opacity: 1; font-style: italic; }
        .form-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(12,166,120,0.1); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.4s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default WanipiroPage;
