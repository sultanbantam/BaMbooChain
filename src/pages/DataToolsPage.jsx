import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useAuth } from '../context/AuthContext';
import { getUserTier, getBMCNumber } from './MembershipPage';
import { BarChart2, TrendingUp, Globe, Lock, ExternalLink, Download, UploadCloud, X, Link as LinkIcon, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useDataTools } from '../hooks/useFirestoreQueries';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { createKnowledgeItem } from '../utils/knowledgeService';

const STATIC_TOOLS = [
  {
    tier: 'seed',
    icon: '📊',
    title: 'Kalkulator Produksi Bambu',
    desc: 'Hitung estimasi hasil panen, kebutuhan lahan, dan proyeksi pendapatan per musim panen.',
    type: 'Kalkulator Interaktif',
    isStatic: true
  },
  {
    tier: 'seed',
    icon: '🌐',
    title: 'Peta Sentra Bambu Indonesia',
    desc: 'Visualisasi interaktif lokasi sentra produksi, spesies dominan, dan kapasitas per provinsi.',
    type: 'Peta Interaktif',
    isStatic: true
  },
  {
    tier: 'guardian',
    icon: '💹',
    title: 'Dashboard Harga Ekspor Bambu',
    desc: 'Data harga ekspor bambu olahan per kategori produk, trend bulanan, dan perbandingan pasar.',
    type: 'Dashboard Data',
    isStatic: true
  },
  {
    tier: 'guardian',
    icon: '📈',
    title: 'ROI & Feasibility Calculator',
    desc: 'Model finansial komprehensif untuk menghitung kelayakan investasi kebun bambu skala 1–100 ha.',
    type: 'Kalkulator Finansial',
    isStatic: true
  },
  {
    tier: 'builder',
    icon: '🏢',
    title: 'Database Buyer Internasional',
    desc: 'Direktori importir dan buyer bambu dari 40+ negara lengkap dengan volume kebutuhan dan kontak.',
    type: 'Database Bisnis',
    isStatic: true
  },
  {
    tier: 'builder',
    icon: '🌿',
    title: 'Carbon Credit Estimator',
    desc: 'Hitung estimasi serapan karbon per hektar, proyeksi kredit karbon, dan potensi pendapatan VCS.',
    type: 'Analisis Karbon',
    isStatic: true
  },
];

const tierLabel = { seed: '🌱 Green Seed', guardian: '🎋 Guardian', builder: '🌿 Builder' };
const tierColor = { seed: '#40c057', guardian: '#1c7ed6', builder: '#f59f00' };

const DataToolsPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { bmcBalance, isConnected, openWalletModal } = useWeb3();
  const userTier = getUserTier(bmcBalance);
  const tierRank = { null: 0, seed: 1, guardian: 2, builder: 3 };
  const canAccess = (tier) => tierRank[userTier] >= tierRank[tier];

  // Fetch dynamic data tools from Firestore
  const { data: dynamicTools = [], isLoading: isLoadingTools } = useDataTools();
  
  // Combine static and dynamic tools
  const allTools = [...STATIC_TOOLS, ...dynamicTools];

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  
  const [uploadForm, setUploadForm] = useState({
    title: '',
    desc: '',
    tier: 'seed',
    type: 'Dashboard Data',
    icon: '📊',
    file: null, // For file uploads
    linkUrl: '' // For external links
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert("File terlalu besar (Maks 10MB).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadForm({ ...uploadForm, file: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.kycStatus !== 'verified') {
      alert("⚠️ Hanya kontributor terverifikasi KYC yang dapat mengunggah Data/Tools!");
      return;
    }
    
    if (!uploadForm.title || !uploadForm.desc) {
      alert("⚠️ Harap isi judul dan deskripsi!");
      return;
    }

    if (uploadType === 'file' && !uploadForm.file) {
      alert("⚠️ Harap unggah file!");
      return;
    }

    if (uploadType === 'link' && !uploadForm.linkUrl) {
      alert("⚠️ Harap masukkan URL eksternal!");
      return;
    }

    setIsUploading(true);
    try {
      let resourceUrl = uploadForm.linkUrl;
      
      // Upload to Cloudinary if it's a file
      if (uploadType === 'file' && uploadForm.file) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        
        if (!cloudName || !uploadPreset) throw new Error("Konfigurasi Cloudinary tidak ditemukan.");

        const formData = new FormData();
        formData.append('file', uploadForm.file);
        formData.append('upload_preset', uploadPreset);
        
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Gagal mengunggah ke Cloudinary");
        resourceUrl = data.secure_url;
      }

      const timestamp = new Date().getTime();
      const newToolData = {
        title: uploadForm.title,
        desc: uploadForm.desc,
        tier: uploadForm.tier,
        type: uploadForm.type,
        icon: uploadForm.icon,
        uploadType: uploadType,
        resourceUrl: resourceUrl,
        userId: user.id,
        author: user.name || user.username || "Anonim",
        timestamp: timestamp
      };

      // 1. Save to data_tools collection
      const docRef = await addDoc(collection(db, "data_tools"), newToolData);

      // 2. Sync to Knowledge Base for BambuBot RAG
      try {
        await createKnowledgeItem({
          form: {
            title: uploadForm.title,
            summary: uploadForm.desc,
            extractedText: uploadForm.desc + "\nURL/Link: " + resourceUrl,
            tags: "Data & Tools, " + uploadForm.type,
            type: uploadForm.type,
            author: user.name || user.username || "Anonim",
            sourceUrl: window.location.href,
          },
          file: null,
          user: user
        });
      } catch (err) {
        console.warn("⚠️ Failed to sync to Knowledge Library:", err);
      }

      alert("✅ Berhasil mengunggah Data/Tools!");
      
      // Reset form
      setUploadForm({
        title: '',
        desc: '',
        tier: 'seed',
        type: 'Dashboard Data',
        icon: '📊',
        file: null,
        linkUrl: ''
      });
      setIsUploadModalOpen(false);

    } catch (error) {
      console.error("❌ Error uploading tool:", error);
      alert("❌ Gagal mengunggah: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ paddingTop: '160px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12,166,120,0.1)', padding: '6px 16px', borderRadius: '20px', marginBottom: '20px' }}>
            <BarChart2 size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)' }}>{t('datatools_badge')}</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '16px' }}>{t('datatools_title')}</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            {t('datatools_desc')}
          </p>
        </div>

        {/* Status Wallet & Upload Action */}
        {!isConnected ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', marginBottom: '40px', border: '2px dashed #dee2e6' }}>
            <Lock size={40} color="#adb5bd" style={{ marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '12px' }}>{t('datatools_connect_title')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{t('datatools_connect_desc')}</p>
            <button onClick={openWalletModal} className="btn btn-primary" style={{ padding: '14px 32px' }}>{t('datatools_connect_btn')}</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', border: '1px solid #eee' }}>
              <span>{t('datatools_balance_label')} <strong style={{ color: 'var(--primary)' }}>{bmcBalance ?? '0'} BMC</strong></span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {userTier ? (
                  <span style={{ background: `${tierColor[userTier]}20`, color: tierColor[userTier], padding: '4px 14px', borderRadius: '20px', fontWeight: '700', fontSize: '0.88rem' }}>
                    {tierLabel[userTier]} — {t('dao_status_active')}
                  </span>
                ) : (
                  <span style={{ color: '#e03131', fontSize: '0.9rem' }}>{t('datatools_need_greenseed')}</span>
                )}
                <Link to="/membership" style={{ fontSize: '0.82rem', color: 'var(--primary)', textDecoration: 'underline' }}>{t('datatools_upgrade_link')}</Link>
              </div>
            </div>

            {user?.kycStatus === 'verified' && (
              <div style={{ alignSelf: 'flex-end' }}>
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  style={{ background: 'var(--primary)', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(12,166,120,0.2)' }}
                >
                  <UploadCloud size={18} /> Unggah Data & Tools
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tools Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {allTools.map((tool, i) => {
            const accessible = canAccess(tool.tier);
            return (
              <div key={i} style={{
                background: 'white', borderRadius: '16px',
                border: `1px solid ${accessible ? tierColor[tool.tier] + '40' : '#eee'}`,
                overflow: 'hidden',
                boxShadow: accessible ? `0 4px 16px ${tierColor[tool.tier]}15` : 'none',
                position: 'relative'
              }}>
                <div style={{ height: '4px', background: accessible ? tierColor[tool.tier] : '#dee2e6' }} />
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: tierColor[tool.tier], background: `${tierColor[tool.tier]}15`, padding: '3px 10px', borderRadius: '20px' }}>
                      {tierLabel[tool.tier]}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: '#f1f3f5', padding: '3px 10px', borderRadius: '20px' }}>{tool.type}</span>
                  </div>
                  <div style={{ fontSize: '2.2rem', marginBottom: '12px' }}>{tool.icon || '📊'}</div>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{tool.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>{tool.desc}</p>

                  {!tool.isStatic && tool.author && (
                    <div style={{ fontSize: '0.75rem', color: '#adb5bd', marginBottom: '15px' }}>
                      Diunggah oleh: <strong>{tool.author}</strong>
                    </div>
                  )}

                  {accessible ? (
                    tool.isStatic ? (
                       <button className="btn btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.88rem', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                         <TrendingUp size={15} /> {t('datatools_btn_open')}
                       </button>
                    ) : (
                       <a href={tool.resourceUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.88rem', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                         {tool.uploadType === 'file' ? <><Download size={15} /> Unduh File</> : <><ExternalLink size={15} /> Buka Tautan</>}
                       </a>
                    )
                  ) : (
                    <Link to="/membership" style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#f1f3f5', borderRadius: '50px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      🔒 {t('datatools_btn_need').replace('{tier}', tierLabel[tool.tier])}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => !isUploading && setIsUploadModalOpen(false)}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UploadCloud size={20} color="var(--primary)" /> Unggah Data & Tools
              </h3>
              <button onClick={() => !isUploading && setIsUploadModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}>
                <X size={20} color="#666" />
              </button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Title */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: '#495057' }}>Judul Tool / Data</label>
                  <input 
                    type="text" 
                    value={uploadForm.title} 
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    placeholder="Contoh: Dataset Harga Bambu Bulanan"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '0.9rem' }}
                    required
                  />
                </div>

                {/* Desc */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: '#495057' }}>Deskripsi Singkat</label>
                  <textarea 
                    value={uploadForm.desc} 
                    onChange={(e) => setUploadForm({...uploadForm, desc: e.target.value})}
                    placeholder="Jelaskan apa fungsi dan isi dari data/tools ini..."
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '0.9rem', minHeight: '80px', resize: 'vertical' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Category Type */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: '#495057' }}>Tipe Kategori</label>
                    <select 
                      value={uploadForm.type} 
                      onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '0.9rem', background: 'white' }}
                    >
                      <option value="Dashboard Data">Dashboard Data</option>
                      <option value="Kalkulator Interaktif">Kalkulator Interaktif</option>
                      <option value="Peta Interaktif">Peta Interaktif</option>
                      <option value="Analisis Karbon">Analisis Karbon</option>
                      <option value="Database Bisnis">Database Bisnis</option>
                      <option value="Dataset Mentah">Dataset Mentah</option>
                    </select>
                  </div>

                  {/* Tier Access */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: '#495057' }}>Tier Akses</label>
                    <select 
                      value={uploadForm.tier} 
                      onChange={(e) => setUploadForm({...uploadForm, tier: e.target.value})}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '0.9rem', background: 'white' }}
                    >
                      <option value="seed">🌱 Green Seed (Gratis/Dasar)</option>
                      <option value="guardian">🎋 Guardian (Menengah)</option>
                      <option value="builder">🌿 Builder (Premium/Tinggi)</option>
                    </select>
                  </div>
                </div>

                {/* Emoji Icon */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: '#495057' }}>Ikon (Emoji)</label>
                  <input 
                    type="text" 
                    maxLength={2}
                    value={uploadForm.icon} 
                    onChange={(e) => setUploadForm({...uploadForm, icon: e.target.value})}
                    placeholder="📊"
                    style={{ width: '60px', textAlign: 'center', padding: '10px', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1.2rem' }}
                  />
                </div>

                {/* Upload Type Switch */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', color: '#495057' }}>Tipe Sumber Data</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="radio" checked={uploadType === 'file'} onChange={() => setUploadType('file')} />
                      <FileText size={16} /> Unggah File (Excel/PDF)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="radio" checked={uploadType === 'link'} onChange={() => setUploadType('link')} />
                      <LinkIcon size={16} /> Tautan / URL Eksternal
                    </label>
                  </div>
                </div>

                {/* Source Input */}
                {uploadType === 'file' ? (
                  <div style={{ background: '#f8f9fa', border: '1px dashed #adb5bd', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.zip"
                      onChange={handleFileChange}
                      id="toolFile"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="toolFile" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <UploadCloud size={32} color={uploadForm.file ? '#40c057' : '#adb5bd'} />
                      <span style={{ fontSize: '0.9rem', color: uploadForm.file ? '#40c057' : 'var(--text-muted)' }}>
                        {uploadForm.file ? 'File terpilih! Klik untuk mengganti.' : 'Klik untuk memilih file (Maks 10MB)'}
                      </span>
                    </label>
                  </div>
                ) : (
                  <div>
                    <input 
                      type="url" 
                      value={uploadForm.linkUrl}
                      onChange={(e) => setUploadForm({...uploadForm, linkUrl: e.target.value})}
                      placeholder="https://contoh-link-dashboard.com"
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>
                )}

                {/* Submit */}
                <button 
                  type="submit" 
                  disabled={isUploading}
                  style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px', cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.7 : 1 }}
                >
                  {isUploading ? 'Sedang Mengunggah...' : 'Unggah & Publikasikan'}
                </button>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DataToolsPage;
