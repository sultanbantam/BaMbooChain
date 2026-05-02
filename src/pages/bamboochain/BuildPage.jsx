import React, { useState, useEffect } from 'react';
import { Home, Zap, Layers, PencilRuler, Box, HardHat, FileCheck, Banknote, Clock, Star, UserCheck, Search, Info, ShieldCheck, TrendingUp, TrendingDown, Image as ImageIcon, Map as MapIcon, Plane as DroneIcon, Layout } from 'lucide-react';
import { DESIGNS } from '../../data/designs';
import ConstructionCheckout from '../../components/ConstructionCheckout';
import BackButton from '../../components/BackButton';

const BuildPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [activeTab, setActiveTab] = useState('3d'); // '3d', 'plan', 'elevation', 'drone'
  const [formInputs, setFormInputs] = useState({ 
    area: '', 
    floors: '1', 
    function: 'Rumah Tinggal',
    subType: 'Tipe 36' 
  });
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Paywall State
  const [usageCount, setUsageCount] = useState(() => parseInt(localStorage.getItem('bambu_usage_count')) || 0);
  const [isPremium, setIsPremium] = useState(() => localStorage.getItem('bambu_is_premium') === 'true');
  const [showPaywall, setShowPaywall] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleUnlockPremium = () => {
    alert("💸 Transaksi 10 BMC Berhasil! Akses Premium Aktif.");
    setIsPremium(true);
    localStorage.setItem('bambu_is_premium', 'true');
    setShowPaywall(false);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    
    if (!isPremium && usageCount >= 3) {
      setShowPaywall(true);
      return;
    }

    setIsGenerating(true);
    setShowResult(false);

    // Filter logic: Find the best matching design
    const matched = DESIGNS.find(d => 
      d.function === formInputs.function && 
      (formInputs.function === 'Rumah Tinggal' ? d.subType === formInputs.subType : true)
    ) || DESIGNS[0]; 

    setTimeout(() => {
      setIsGenerating(false);
      // Logic: Price scales with area, but has a minimum base price
      const areaRatio = parseInt(formInputs.area) / (matched.minArea || 21);
      const calculatedPrice = matched.price * (areaRatio < 1 ? 1 : areaRatio);

      setSelectedDesign({
        ...matched,
        basePrice: calculatedPrice
      });
      setShowResult(true);
      setActiveTab('3d'); // Reset to 3D tab on new generate
      
      if (!isPremium) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('bambu_usage_count', newCount.toString());
      }
    }, 2000);
  };

  const buildingFunctions = [
    'Rumah Tinggal', 'Cafe', 'Villa', 'Tempat Ibadah', 'Bangunan Serba Guna'
  ];

  const houseTypes = ['Tipe 21', 'Tipe 36', 'Tipe 45'];

  return (
    <div style={{ paddingTop: '250px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--bg-color)' }}>
      
      {/* HERO SECTION */}
      <div style={{ background: 'linear-gradient(135deg, rgba(12,166,120,0.05), rgba(43,138,62,0.15))', padding: '60px 0', borderBottom: '1px solid rgba(12,166,120,0.1)', marginBottom: '60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <BackButton />
          <div style={{ display: 'inline-flex', padding: '6px 16px', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '16px', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} /> AI-Powered Architecture
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-1px' }}>Bamboo Build (BamBu) 5.0</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 32px' }}>
             Design → Build → Deliver. Masukkan kebutuhan tanah dan fungsi bangunan, sistem AI akan men-generate desain arsitektur lengkap.
          </p>
          <button 
            onClick={() => document.getElementById('generator').scrollIntoView({ behavior: 'smooth' })}
            className="btn btn-crypto" style={{ padding: '14px 40px', fontSize: '1.1rem', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <PencilRuler size={18} /> Mulai Desain
          </button>
        </div>
      </div>

      <div className="container" id="generator">
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
          
          {/* AI DESIGN GENERATOR (Column 1) */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', border: '1px solid #f1f3f5' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={24} color="var(--primary)" /> Konfigurasi Bangunan
            </h3>
            
            <form onSubmit={handleGenerate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>Fungsi Bangunan</label>
                  <select name="function" value={formInputs.function} onChange={handleInputChange} required
                          style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #dee2e6', fontSize: '1rem', boxSizing: 'border-box', background: 'white' }}>
                    {buildingFunctions.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                {formInputs.function === 'Rumah Tinggal' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>Tipe Rumah</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      {houseTypes.map(t => (
                        <button 
                          key={t}
                          type="button"
                          onClick={() => setFormInputs(prev => ({ ...prev, subType: t }))}
                          style={{ 
                            padding: '10px', 
                            borderRadius: '10px', 
                            border: formInputs.subType === t ? '2px solid var(--primary)' : '1px solid #dee2e6',
                            background: formInputs.subType === t ? 'rgba(12,166,120,0.05)' : 'white',
                            color: formInputs.subType === t ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: formInputs.subType === t ? 'bold' : 'normal',
                            cursor: 'pointer'
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>Luas Tanah (m²)</label>
                    <input type="number" name="area" placeholder="Contoh: 120" value={formInputs.area} onChange={handleInputChange} required
                           style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #dee2e6', fontSize: '1rem', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>Jumlah Lantai</label>
                    <select name="floors" required value={formInputs.floors} onChange={handleInputChange} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #dee2e6', fontSize: '1rem', boxSizing: 'border-box', background: 'white' }}>
                      <option value="1">1 Lantai</option>
                      <option value="2">2 Lantai</option>
                      <option value="3">3 Lantai</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <button 
                    type={usageCount >= 3 && !isPremium ? "button" : "submit"}
                    onClick={usageCount >= 3 && !isPremium ? () => setShowPaywall(true) : undefined}
                    disabled={isGenerating}
                    style={{ width: '100%', background: 'var(--primary)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(12, 166, 120, 0.2)' }}>
                    {isGenerating ? 'Membuat Desain Arsitektur...' : (!isPremium && usageCount >= 3) ? 'Buka Akses Premium (10 BMC)' : 'Generate Desain AI'}
                  </button>
                  
                  {!isPremium && (
                    <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.82rem', color: usageCount >= 3 ? '#fa5252' : 'var(--text-muted)' }}>
                      {usageCount >= 3 
                        ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                            <span>Batas penggunaan gratis habis.</span>
                            <button 
                              type="button"
                              onClick={() => setShowPaywall(true)}
                              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}>
                              Bayar 10 BMC untuk Akses Selamanya
                            </button>
                          </div>
                        )
                        : `Jatah desain gratis: ${usageCount}/3`}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* HASIL DESAIN (Column 2) - Detailed Views */}
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #ced4da', display: 'flex', flexDirection: 'column', gap: '24px', opacity: showResult ? 1 : 0.4, pointerEvents: showResult ? 'auto' : 'none', transition: 'opacity 0.4s ease', height: '100%', minHeight: '500px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            {showResult && selectedDesign ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                      <Box size={24} color="var(--primary)" /> {selectedDesign.name}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>{selectedDesign.function} • {selectedDesign.subType}</p>
                  </div>
                  <div style={{ background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    ID: #{selectedDesign.id}2024
                  </div>
                </div>

                {/* VIEW TABS */}
                <div style={{ display: 'flex', background: '#f1f3f5', padding: '4px', borderRadius: '12px', gap: '4px' }}>
                  {[
                    { id: '3d', label: '3D Render', icon: <ImageIcon size={14} /> },
                    { id: 'plan', label: 'Denah', icon: <Layout size={14} /> },
                    { id: 'elevation', label: 'Tampak', icon: <ImageIcon size={14} /> },
                    { id: 'drone', label: 'Drone View', icon: <DroneIcon size={14} /> }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        border: 'none', 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        background: activeTab === tab.id ? 'white' : 'transparent',
                        color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                        boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                      }}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                <div style={{ width: '100%', height: '350px', borderRadius: '16px', overflow: 'hidden', position: 'relative', background: '#343a40', border: '1px solid #dee2e6' }}>
                  <img 
                    src={activeTab === '3d' ? selectedDesign.imageUrl : activeTab === 'plan' ? selectedDesign.planUrl : activeTab === 'elevation' ? selectedDesign.elevationUrl : selectedDesign.droneUrl} 
                    alt={activeTab} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', background: activeTab === 'plan' ? 'white' : '#343a40' }} 
                  />
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.7rem' }}>
                    Auto-generated by BamBu AI Engine v5.0
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  {selectedDesign.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '16px', border: '1px solid #e9ecef' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <Banknote size={14} /> Est. Biaya
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)' }}>
                      Rp {(selectedDesign.basePrice / 1000000).toFixed(0)}<span style={{ fontSize: '0.9rem' }}> Juta</span>
                    </div>
                  </div>

                  <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '16px', border: '1px solid #e9ecef' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <Clock size={14} /> Durasi
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)' }}>
                      {selectedDesign.time}<span style={{ fontSize: '0.9rem' }}> Minggu</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #f1f3f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button 
                    style={{ background: '#f1f3f5', color: 'var(--text-main)', padding: '12px 20px', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.9rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Download Blueprint
                  </button>
                  <button 
                    onClick={() => setShowCheckout(true)}
                    style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.9rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(12,166,120,0.2)' }}>
                    <FileCheck size={18} /> Bangun Sekarang
                  </button>
                </div>
              </>
            ) : isGenerating ? (
               <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', gap: '16px' }}>
                  <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid rgba(12,166,120,0.2)', borderTop: '5px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <div style={{ fontWeight: 'bold' }}>Mengkalkulasi Desain & Denah AI...</div>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
               </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', gap: '16px' }}>
                <Search size={48} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Belum Ada Desain</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem' }}>Silakan tentukan konfigurasi di samping.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* POOL AHLI SELECTION */}
        <div style={{ marginTop: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <HardHat size={28} color="var(--primary)" /> Ahli Konstruksi Bambu
              </h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Tenaga ahli bersertifikat yang siap merealisasikan desain Anda di lapangan.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { name: "Sutisna (Mang Sutis)", role: "Spesialis Struktur", xp: "12 Tahun", rating: 4.9, img: "https://i.pravatar.cc/150?u=sutisna" },
              { name: "Ahmad Jalaludin", role: "Spesialis Finishing", xp: "8 Tahun", rating: 4.8, img: "https://i.pravatar.cc/150?u=ahmad" },
              { name: "Deden Darsono", role: "Master Modular", xp: "15 Tahun", rating: 5.0, img: "https://i.pravatar.cc/150?u=deden" },
              { name: "Irwan Suherman", role: "Spesialis Atap", xp: "10 Tahun", rating: 4.7, img: "https://i.pravatar.cc/150?u=irwan" }
            ].map((tukang, idx) => (
              <div key={idx} style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', border: '1px solid #f1f3f5' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <img src={tukang.img} alt={tukang.name} style={{ width: '60px', height: '60px', borderRadius: '15px', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>{tukang.name}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>{tukang.role}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '16px' }}>
                   <span style={{ color: 'var(--text-muted)' }}>XP: {tukang.xp}</span>
                   <span style={{ color: '#f59f00', fontWeight: 'bold' }}>★ {tukang.rating}</span>
                </div>
                <button style={{ width: '100%', padding: '10px', background: '#f8f9fa', color: 'var(--text-main)', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Lihat Portofolio</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', zIndex: 200000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
           <div style={{ background: 'white', borderRadius: '32px', width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(12,166,120,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                <Zap size={40} color="var(--primary)" fill="var(--primary)" />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0 0 16px 0', color: 'var(--text-main)' }}>Buka Akses Premium</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '32px' }}>
                Batas jatah gratis Anda telah habis. Buka akses tak terbatas untuk merancang bangunan bambu impian Anda.
              </p>
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', marginBottom: '32px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Biaya Akses</div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)' }}>10 BMC</div>
              </div>
              <button 
                onClick={handleUnlockPremium}
                style={{ width: '100%', padding: '16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginBottom: '16px' }}>
                Beli Akses Sekarang
              </button>
              <button onClick={() => setShowPaywall(false)} style={{ background: 'none', border: 'none', color: '#adb5bd', fontSize: '0.9rem', cursor: 'pointer' }}>Nanti Saja</button>
           </div>
        </div>
      )}

      {/* Checkout Modal */}
      <ConstructionCheckout 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
        design={selectedDesign} 
        inputs={formInputs} 
      />
    </div>
  );
};

export default BuildPage;
