import React, { useState } from 'react';
import { Leaf, Search, DollarSign, CloudRain, ShieldCheck, Factory, AlertTriangle, ArrowRight, Loader, Tag, CheckCircle2, ThumbsUp, ThumbsDown, Info } from 'lucide-react';
import { fetchWanipiroAppraisal } from '../utils/wanipiroService';
import { useLanguage } from '../context/LanguageContext';

const WanipiroPage = () => {
  const { language } = useLanguage();
  const [mode, setMode] = useState('raw_bamboo'); // 'raw_bamboo' | 'finished_product'
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    provinsi: 'Jawa Barat',
    kabupaten: 'Bandung',
    // Raw Bamboo
    jenis_bambu: 'Petung',
    jumlah_batang: 100,
    satuan_jual: 'per_batang',
    panjang_total_meter: 6.5,
    diameter_pangkal_cm: 10,
    diameter_tengah_cm: 8,
    diameter_ujung_cm: 5,
    ketebalan_dinding_cm: 1.5,
    usia: '3-5_tahun',
    kelurusan: 'lurus',
    kondisi_fisik: 'utuh',
    // Finished Product
    nama_produk: '',
    kategori_produk: 'anyaman',
    dimensi_p: 0,
    dimensi_l: 0,
    dimensi_t: 0,
    berat_gram: 0,
    tingkat_kesulitan: 'sedang',
    waktu_pengerjaan_jam: 8,
    teknik_utama: 'anyaman',
    finishing_khusus: 'tidak_ada',
    punya_merek: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    const payload = {
      user_id: "user_web_123",
      tanggal_penaksiran: new Date().toISOString().split('T')[0],
      lokasi: { provinsi: formData.provinsi, kabupaten: formData.kabupaten },
      kategori: mode
    };

    if (mode === 'raw_bamboo') {
      payload.raw_data = {
        jenis_bambu: formData.jenis_bambu,
        jumlah_batang: formData.jumlah_batang,
        satuan_jual: formData.satuan_jual,
        panjang_total_meter: formData.panjang_total_meter,
        diameter_pangkal_cm: formData.diameter_pangkal_cm,
        diameter_tengah_cm: formData.diameter_tengah_cm,
        diameter_ujung_cm: formData.diameter_ujung_cm,
        ketebalan_dinding_cm: formData.ketebalan_dinding_cm,
        usia: formData.usia,
        kelurusan: formData.kelurusan,
        kondisi_fisik: formData.kondisi_fisik
      };
    } else {
      payload.product_data = {
        nama_produk: formData.nama_produk || 'Produk Bambu',
        kategori_produk: formData.kategori_produk,
        jenis_bambu: formData.jenis_bambu,
        dimensi: { panjang_cm: formData.dimensi_p, lebar_cm: formData.dimensi_l, tinggi_cm: formData.dimensi_t },
        berat_gram: formData.berat_gram,
        tingkat_kesulitan: formData.tingkat_kesulitan,
        waktu_pengerjaan_jam: formData.waktu_pengerjaan_jam,
        teknik_utama: formData.teknik_utama,
        finishing_khusus: formData.finishing_khusus,
        punya_merek: formData.punya_merek
      };
    }

    try {
      const data = await fetchWanipiroAppraisal(payload);
      if (data.status === 'error') {
        setError(data.message || 'Data tidak lengkap atau terjadi kesalahan.');
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError('Gagal menghubungi Juru Taksir AI. Pastikan konfigurasi API sudah benar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '90px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', background: 'rgba(12, 166, 120, 0.1)', borderRadius: '16px', color: 'var(--primary)', marginBottom: '15px' }}>
            <DollarSign size={32} />
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '10px' }}>Wani Piro AI</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Juru Taksir Bambu Profesional PERPUBI. Dapatkan estimasi harga pasar paling akurat untuk bambu mentah maupun produk jadi berdasarkan ukuran, usia, dan kerumitan.
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
                  <label className="form-label">Provinsi Lokasi</label>
                  <input type="text" name="provinsi" value={formData.provinsi} onChange={handleInputChange} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Jenis Bambu</label>
                  <select name="jenis_bambu" value={formData.jenis_bambu} onChange={handleInputChange} className="form-input">
                    <option value="Petung">Petung</option>
                    <option value="Temen">Temen</option>
                    <option value="Hitam/Wulung">Hitam/Wulung</option>
                    <option value="Tali/Apus">Tali/Apus</option>
                    <option value="Gombong">Gombong</option>
                  </select>
                </div>
              </div>

              {mode === 'raw_bamboo' && (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label className="form-label">Jml Batang</label>
                      <input type="number" name="jumlah_batang" value={formData.jumlah_batang} onChange={handleInputChange} className="form-input" min="1" required />
                    </div>
                    <div>
                      <label className="form-label">Panjang (m)</label>
                      <input type="number" step="0.1" name="panjang_total_meter" value={formData.panjang_total_meter} onChange={handleInputChange} className="form-input" min="1" required />
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="form-label">Ø Pangkal (cm)</label>
                      <input type="number" step="0.1" name="diameter_pangkal_cm" value={formData.diameter_pangkal_cm} onChange={handleInputChange} className="form-input" required />
                    </div>
                    <div>
                      <label className="form-label">Ø Tengah</label>
                      <input type="number" step="0.1" name="diameter_tengah_cm" value={formData.diameter_tengah_cm} onChange={handleInputChange} className="form-input" required />
                    </div>
                    <div>
                      <label className="form-label">Ø Ujung</label>
                      <input type="number" step="0.1" name="diameter_ujung_cm" value={formData.diameter_ujung_cm} onChange={handleInputChange} className="form-input" required />
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
                      </select>
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
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Teknik Utama</label>
                      <select name="teknik_utama" value={formData.teknik_utama} onChange={handleInputChange} className="form-input">
                        <option value="anyaman">Anyaman</option>
                        <option value="potong_sambung">Potong & Sambung</option>
                        <option value="ukiran">Ukiran</option>
                        <option value="kombinasi">Kombinasi</option>
                      </select>
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
                      <input type="number" name="waktu_pengerjaan_jam" value={formData.waktu_pengerjaan_jam} onChange={handleInputChange} className="form-input" min="1" required />
                    </div>
                  </div>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer', marginTop: '10px' }}>
                    <input type="checkbox" name="punya_merek" checked={formData.punya_merek} onChange={handleInputChange} />
                    Produk ini memiliki Merek Terdaftar / Branding Kuat
                  </label>
                </div>
              )}
              
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
                    <span style={{ fontWeight: 'bold' }}>Rp {result.data.kisaran_harga_rendah?.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Kisaran Atas:</span>
                    <span style={{ fontWeight: 'bold' }}>Rp {result.data.kisaran_harga_tinggi?.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '5px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Harga Per {result.data.satuan}:</span>
                    <span style={{ fontWeight: 'bold', color: '#d97706' }}>Rp {result.data.harga_per_satuan?.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                  {result.data.faktor_pendorong_harga?.length > 0 && (
                    <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '12px', border: '1px solid #d3f9d8' }}>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#2b8a3e', margin: '0 0 10px 0' }}><ThumbsUp size={16} /> Premium (+):</h4>
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#2b8a3e' }}>
                        {result.data.faktor_pendorong_harga.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}
                  {result.data.faktor_penekan_harga?.length > 0 && (
                    <div style={{ background: '#fff0f0', padding: '15px', borderRadius: '12px', border: '1px solid #ffe3e3' }}>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#e03131', margin: '0 0 10px 0' }}><ThumbsDown size={16} /> Diskon (-):</h4>
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#e03131' }}>
                        {result.data.faktor_penekan_harga.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                
                {result.data.rekomendasi_petani && (
                  <div style={{ background: 'rgba(51, 154, 240, 0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(51, 154, 240, 0.2)', marginBottom: '20px' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#1971c2', margin: '0 0 8px 0' }}><Info size={16} /> Rekomendasi Juru Taksir:</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#333', lineHeight: '1.5' }}>{result.data.rekomendasi_petani}</p>
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

              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .form-label { display: block; margin-bottom: 6px; font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
        .form-input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-main); font-size: 0.95rem; transition: 0.2s; }
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
