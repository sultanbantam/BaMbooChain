import React, { useState, useEffect } from 'react';
import { getAssetUrl } from '../../utils/assets';
import { Sprout, BarChart, ShieldCheck, MapPin, CheckCircle, CreditCard, Wallet as WalletIcon, ExternalLink, ArrowRight, UserCheck, Zap, Info, Clock, Check, X, Globe, Landmark, Activity } from 'lucide-react';
import BackButton from '../../components/BackButton';
import { useWeb3 } from '../../context/Web3Context';
import { useAuth } from '../../context/AuthContext';
import { ethers } from 'ethers';
import { escrowConfig } from '../../utils/escrowConfig';

const PlantationPage = () => {
  const [step, setStep] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { connectWallet, isConnected, walletAddress, bmcBalance } = useWeb3();

  const [customAmount, setCustomAmount] = useState('');
  const [usdtToIdr, setUsdtToIdr] = useState(16250);
  const [simulationActive, setSimulationActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txStatusText, setTxStatusText] = useState('');
  const [currentProjectId, setCurrentProjectId] = useState(1);
  const [showExampleModal, setShowExampleModal] = useState(false);
  const [exampleImg, setExampleImg] = useState('');
  const { user } = useAuth(); // Need to import useAuth
  
  // States for Suggestion Feature
  const [coords, setCoords] = useState({ lat: -6.2088, lng: 106.8456 }); // Default Jakarta
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [suggestions, setSuggestions] = useState(() => {
    const saved = localStorage.getItem('ysnj_suggestions');
    return saved ? JSON.parse(saved) : [];
  });
  const [newLoc, setNewLoc] = useState({ name: '', area: '', type: 'Lahan Adat', vision: '' });
  
  // Map Simulation States
  const [zoom, setZoom] = useState(1);
  const [mapPos, setMapPos] = useState({ x: 50, y: 50 }); // Center by default
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    localStorage.setItem('ysnj_suggestions', JSON.stringify(suggestions));
  }, [suggestions]);

  const handleSuggest = () => {
    if (!newLoc.name || !newLoc.area) {
      alert("Silakan lengkapi nama lokasi dan estimasi luas.");
      return;
    }
    const suggestion = {
      ...newLoc,
      id: Date.now(),
      coords,
      status: 'Pending Verification',
      date: new Date().toLocaleDateString()
    };
    setSuggestions(prev => [suggestion, ...prev]);
    alert("Terima kasih! Usulan lokasi Anda telah disimpan ke sistem dan akan divalidasi oleh tim Admin Yayasan melalui pemindaian GIS.");
    setNewLoc({ name: '', area: '', type: 'Lahan Adat', vision: '' });
  };

  const openExample = (imgNum) => {
    setExampleImg(getAssetUrl(`gambar/${imgNum}.jpg`));
    setShowExampleModal(true);
  };

  const [milestones, setMilestones] = useState({
    bibit: { id: 'bibit', name: 'Pemilik Bibit', percent: 16, released: false },
    tanam: { id: 'tanam', name: 'Penanam', percent: 4, released: false },
    rawat: { id: 'rawat', name: 'Perawatan', percent: 10.67, released: false },
    risiko: { id: 'risiko', name: 'Cadangan Risiko', percent: 13.33, released: false },
    lahan: { id: 'lahan', name: 'Pemilik Lahan', percent: 2.67, released: false },
    royalti: { id: 'royalti', name: 'Royalti Sistem', percent: 6.67, released: false },
    pengelola: { id: 'pengelola', name: 'Sabumi (Manajemen)', percent: 46.66, released: false },
  });

  const releaseMilestone = async (id) => {
    setMilestones(prev => ({
      ...prev,
      [id]: { ...prev[id], released: true }
    }));
  };

  const getEscrowStatus = () => {
    const totalReleased = Object.values(milestones).filter(m => m.released).length;
    if (totalReleased === 0) return 'Dana Terkunci di Smart Contract';
    if (totalReleased === Object.keys(milestones).length) return 'Semua Dana Telah Didistribusikan';
    return `Didistribusikan Sebagian (${totalReleased}/7)`;
  };

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=idr');
        const data = await response.json();
        if (data.tether && data.tether.idr) {
          setUsdtToIdr(data.tether.idr);
        }
      } catch (error) {
        console.error('Failed to fetch USDT rate:', error);
      }
    };
    fetchRate();
  }, []);

  const locations = [
    { id: 'cibarani', name: 'Kasepuhan Cibarani, Lebak', image: getAssetUrl('gambar/pehcibarani.png'), area: '490 Ha', farmers: 120, desc: 'Restorasi hutan adat dan sabuk ekologis.' },
    { id: 'cisadane', name: 'Tepi Cisadane, Tangerang Raya', image: getAssetUrl('gambar/ceap.png'), area: '120 Ha', farmers: 45, desc: 'Pengembangan ekonomi masyarakat melalui ekowisata.' }
  ];

  const packages = [
    { id: 'custom', name: 'Dukungan Fleksibel', amount: 'Any', bibit: 'Custom', desc: 'Dukung dengan nilai berapapun sesuai keinginan Anda.' },
    { id: 'donasi', name: 'Paket Donasi', amount: 50, bibit: 10, desc: '10 Bibit Bambu & Sertifikat Digital' },
    { id: 'petani', name: 'Paket Petani Milenial', amount: 500, bibit: 100, desc: '100 Bibit Bambu & Laporan IoT' },
    { id: 'orangtua', name: 'Paket Orang Tua Asuh', amount: 5000, bibit: 1000, desc: '1000+ Bibit & Revenue Sharing' }
  ];

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    nextStep();
  };

  const handleSelectPackage = (pkg) => {
    if (pkg.id === 'custom') {
      if (!customAmount || isNaN(customAmount) || customAmount <= 0) {
        alert('Silakan masukkan jumlah dukungan yang valid.');
        return;
      }
      setSelectedPackage({ ...pkg, amount: customAmount });
    } else {
      setSelectedPackage(pkg);
    }
    nextStep();
  };

  const [selectedMethod, setSelectedMethod] = useState(null);

  const handlePayment = async (method) => {
    setIsProcessing(true);
    setTxStatusText('Memproses Pembayaran (Simulasi)...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSimulationActive(true);
    setIsProcessing(false);
    nextStep(); // Go to Step 3
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '100px', minHeight: '100vh', background: 'linear-gradient(to bottom, #fdfdfd, #f4f7f4)' }}>
      <div className="container">
        
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                background: step >= i ? 'var(--primary)' : '#e9ecef',
                color: step >= i ? 'white' : '#adb5bd',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '1.1rem', transition: 'all 0.3s'
              }}>
                {step > i ? <Check size={20} /> : i + 1}
              </div>
              {i < 2 && <div style={{ width: '100px', height: '3px', background: step > i ? 'var(--primary)' : '#e9ecef', transition: 'all 0.3s' }} />}
            </div>
          ))}
        </div>

        {/* STEP 0: PILIH LOKASI */}
        {step === 0 && (
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>Pilih Lokasi Penanaman</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Pilih lokasi yang ingin Anda dukung untuk restorasi dan pengembangan ekonomi hijau.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
              {locations.map((loc) => (
                <div 
                  key={loc.id} 
                  className="glass"
                  onClick={() => handleSelectLocation(loc)}
                  style={{ 
                    borderRadius: '24px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s',
                    background: 'white', border: '1px solid rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ height: '250px', background: `url("${loc.image}") center/cover` }} />
                  <div style={{ padding: '30px' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '10px' }}>{loc.name}</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{loc.desc}</p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>📍 Area: {loc.area}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>👨‍🌾 Petani: {loc.farmers}+</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* SUGGEST NEW LOCATION CARD */}
              <div 
                className="glass"
                style={{ 
                  borderRadius: '24px', overflow: 'hidden', cursor: 'pointer', border: '2px dashed var(--primary)',
                  background: 'rgba(12, 166, 120, 0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center'
                }}
                onClick={() => document.getElementById('suggest-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div style={{ background: 'rgba(12, 166, 120, 0.1)', padding: '20px', borderRadius: '50%', color: 'var(--primary)', marginBottom: '20px' }}>
                  <MapPin size={40} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>Usulkan Lokasi Lain</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Investor atau donatur dapat mengusulkan wilayah baru untuk diverifikasi oleh tim Yayasan.</p>
              </div>
            </div>

            {/* SUGGESTION FORM */}
            <div id="suggest-form" style={{ marginTop: '80px', background: 'white', borderRadius: '32px', padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>Formulir Usulan Lokasi Baru</h2>
              
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', marginBottom: '30px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '15px' }}>
                  <Globe size={24} />
                  <span style={{ fontWeight: 'bold' }}>Integrasi GIS (Global Information System)</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Koordinat Terdeteksi:</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</div>
                  </div>
                  <button 
                    onClick={() => setShowMapPicker(true)}
                    style={{ background: 'white', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Buka Peta & Pilih Titik
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>Nama Lokasi/Wilayah</label>
                  <input 
                    type="text" 
                    value={newLoc.name}
                    onChange={(e) => setNewLoc({...newLoc, name: e.target.value})}
                    placeholder="Contoh: Desa Sukamaju, Sumedang" 
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #eee', background: '#f8f9fa' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>Estimasi Luas Lahan (Ha)</label>
                  <input 
                    type="number" 
                    value={newLoc.area}
                    onChange={(e) => setNewLoc({...newLoc, area: e.target.value})}
                    placeholder="Contoh: 50" 
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #eee', background: '#f8f9fa' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>Jenis Lahan</label>
                  <select 
                    value={newLoc.type}
                    onChange={(e) => setNewLoc({...newLoc, type: e.target.value})}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #eee', background: '#f8f9fa' }}>
                    <option>Lahan Adat</option>
                    <option>Lahan Perhutani</option>
                    <option>Lahan Pribadi</option>
                    <option>Lahan Konservasi</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>Alasan/Visi Usulan</label>
                <textarea 
                  rows="4" 
                  value={newLoc.vision}
                  onChange={(e) => setNewLoc({...newLoc, vision: e.target.value})}
                  placeholder="Jelaskan potensi ekologi dan sosial ekonomi di wilayah ini..." 
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #eee', background: '#f8f9fa' }}
                ></textarea>
              </div>
              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={handleSuggest}
                  style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '16px 50px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(12, 166, 120, 0.2)' }}>
                  Simpan Usulan Lokasi
                </button>
              </div>
            </div>

            {/* ADMIN VERIFICATION PANEL (Visible if Admin) */}
            {user?.email?.includes('admin') && (
              <div style={{ marginTop: '80px', background: '#1e1e2e', borderRadius: '32px', padding: '40px', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Panel Verifikasi Admin</h2>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.8rem' }}>{suggestions.length} Usulan Masuk</div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                        <th style={{ padding: '15px' }}>Lokasi</th>
                        <th style={{ padding: '15px' }}>Luas</th>
                        <th style={{ padding: '15px' }}>Koordinat</th>
                        <th style={{ padding: '15px' }}>Status</th>
                        <th style={{ padding: '15px' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suggestions.map((s) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '15px' }}>{s.name}</td>
                          <td style={{ padding: '15px' }}>{s.area} Ha</td>
                          <td style={{ padding: '15px' }}>
                            <a href={`https://www.google.com/maps?q=${s.coords.lat},${s.coords.lng}`} target="_blank" rel="noreferrer" style={{ color: '#4dabf7', textDecoration: 'none' }}>
                              {s.coords.lat.toFixed(4)}, {s.coords.lng.toFixed(4)} ↗
                            </a>
                          </td>
                          <td style={{ padding: '15px' }}>
                            <span style={{ background: 'rgba(245, 159, 0, 0.2)', color: '#f59f00', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem' }}>{s.status}</span>
                          </td>
                          <td style={{ padding: '15px' }}>
                            <button style={{ background: '#2f9e44', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', marginRight: '5px' }}>Verify</button>
                            <button onClick={() => setSuggestions(prev => prev.filter(x => x.id !== s.id))} style={{ background: '#e03131', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>Reject</button>
                          </td>
                        </tr>
                      ))}
                      {suggestions.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>Belum ada usulan lokasi baru dari investor.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 1: PILIH PAKET */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: '40px' }}><button onClick={prevStep} className="btn-back">Kembali</button></div>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>Pilih Paket Penanaman</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Mendukung di: <strong>{selectedLocation?.name}</strong></p>
              
              {/* CURRENCY CONVERSION INFO */}
              <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(12, 166, 120, 0.05)', padding: '10px 20px', borderRadius: '15px', marginTop: '20px', border: '1px solid rgba(12, 166, 120, 0.1)', color: 'var(--primary)', fontWeight: 'bold' }}>
                <Activity size={18} style={{ marginRight: '8px' }} />
                1 USDT = 1 BMC = Rp {usdtToIdr.toLocaleString()} (Market Rate)
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {packages.map((pkg) => (
                <div key={pkg.id} className="glass" onClick={() => {
                  if (pkg.id !== 'custom') handleSelectPackage(pkg);
                }} style={{ padding: '30px', borderRadius: '24px', cursor: 'pointer', background: 'white', textAlign: 'center', border: selectedPackage?.id === pkg.id ? '2px solid var(--primary)' : '1px solid #eee' }}>
                  <Sprout size={40} color="var(--primary)" style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{pkg.name}</h3>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)' }}>{pkg.amount === 'Any' ? 'Any' : pkg.amount} USDT</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px' }}>{pkg.desc}</p>
                  
                  {pkg.id === 'custom' && (
                    <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '15px' }}>
                      <input 
                        type="number" 
                        placeholder="Masukan Jumlah USDT" 
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '10px', textAlign: 'center' }}
                      />
                      <button onClick={() => handleSelectPackage(pkg)} className="btn btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '10px' }}>Pilih Paket</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: PILIHAN PEMBAYARAN & KONFIRMASI */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: '40px' }}><button onClick={prevStep} className="btn-back">Kembali</button></div>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900' }}>Metode Pembayaran</h1>
              <p>Mendukung <strong>{selectedPackage?.amount} USDT</strong> untuk <strong>{selectedLocation?.name}</strong></p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              {/* BRI */}
              <div className="glass" onClick={() => setSelectedMethod('bri')} style={{ padding: '30px', borderRadius: '24px', border: selectedMethod === 'bri' ? '2px solid var(--primary)' : '1px solid #eee', cursor: 'pointer', background: 'white' }}>
                <Landmark size={32} color="#00529C" style={{ marginBottom: '15px' }} />
                <h3 style={{ fontWeight: 'bold' }}>Transfer Bank BRI</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Menerima IDR (Rupiah). Estimasi: Rp {(selectedPackage?.amount * usdtToIdr).toLocaleString()}</p>
              </div>
              
              {/* BMC */}
              <div className="glass" onClick={() => setSelectedMethod('bmc')} style={{ padding: '30px', borderRadius: '24px', border: selectedMethod === 'bmc' ? '2px solid var(--primary)' : '1px solid #eee', cursor: 'pointer', background: 'white' }}>
                <WalletIcon size={32} color="var(--primary)" style={{ marginBottom: '15px' }} />
                <h3 style={{ fontWeight: 'bold' }}>Dompet BMC (Token)</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bayar instan menggunakan saldo BMC Anda.</p>
              </div>

              {/* USDT */}
              <div className="glass" onClick={() => setSelectedMethod('usdt')} style={{ padding: '30px', borderRadius: '24px', border: selectedMethod === 'usdt' ? '2px solid var(--primary)' : '1px solid #eee', cursor: 'pointer', background: 'white' }}>
                <CreditCard size={32} color="#26A17B" style={{ marginBottom: '15px' }} />
                <h3 style={{ fontWeight: 'bold' }}>USDT (Stablecoin)</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Transfer USDT via jaringan Polygon/BSC.</p>
              </div>
            </div>

            {selectedMethod && (
              <div className="glass animate-fade-in" style={{ padding: '40px', borderRadius: '32px', background: 'white', textAlign: 'center', border: '1px solid #eee' }}>
                <h2 style={{ marginBottom: '20px' }}>Detail Pembayaran</h2>
                
                {selectedMethod === 'bri' && (
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00529C' }}>Bank BRI (Sabumi Nusantara Jaya)</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '900', margin: '10px 0' }}>141101000456562</div>
                    <p>Total: <strong>Rp {(selectedPackage?.amount * usdtToIdr).toLocaleString()}</strong></p>
                  </div>
                )}

                {selectedMethod === 'bmc' && (
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>Wallet Yayasan (BMC Token)</div>
                    <div style={{ fontSize: '0.9rem', wordBreak: 'break-all', margin: '10px 0', fontFamily: 'monospace', background: '#eee', padding: '10px', borderRadius: '8px' }}>
                      0x0d1Be34402B12D4c0c6aA850db568F7874F2e222
                    </div>
                    <p>Total: <strong>{selectedPackage?.amount} BMC</strong></p>
                  </div>
                )}

                {selectedMethod === 'usdt' && (
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#26A17B' }}>Wallet Yayasan (USDT BEP20)</div>
                    <div style={{ fontSize: '0.9rem', wordBreak: 'break-all', margin: '10px 0', fontFamily: 'monospace', background: '#eee', padding: '10px', borderRadius: '8px' }}>
                      0xcb66199ea24746a7917a8dc171b0583cd7420e10
                    </div>
                    <p>Jaringan: <strong>BNB Smart Chain (BEP20)</strong></p>
                    <p>Total: <strong>{selectedPackage?.amount} USDT</strong></p>
                  </div>
                )}

                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Silakan transfer sesuai nominal di atas, lalu klik tombol konfirmasi. Dana akan masuk ke Smart Contract Escrow.</p>
                
                <button onClick={() => handlePayment(selectedMethod)} className="btn btn-primary" style={{ padding: '16px 50px', borderRadius: '30px', fontSize: '1.1rem' }}>
                  Saya Sudah Transfer & Konfirmasi
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: ESCROW SIMULATION & DISTRIBUTION */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <div style={{ display: 'inline-flex', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '10px 20px', borderRadius: '30px', marginBottom: '20px', fontWeight: 'bold' }}>
                <ShieldCheck size={20} style={{ marginRight: '8px' }} /> Dana Terkunci di Smart Contract (Escrow)
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900' }}>Distribusi & Realisasi Program</h1>
              <p>Dana kontribusi Anda sebesar <strong>{selectedPackage?.amount} USDT</strong> telah disebar ke sistem pembagian 7 stakeholder.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
              {Object.entries(milestones).map(([key, m]) => (
                <div key={key} className="glass" style={{ padding: '25px', borderRadius: '24px', background: 'white', position: 'relative', overflow: 'hidden' }}>
                  {m.released && <div style={{ position: 'absolute', top: '15px', right: '15px', color: 'var(--primary)' }}><CheckCircle size={24} /></div>}
                  <div style={{ color: m.released ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{m.percent}% Alokasi</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '10px 4px' }}>{m.name}</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '15px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: m.released ? 'var(--primary)' : 'var(--text-main)' }}>
                      {(selectedPackage?.amount * m.percent / 100).toFixed(2)} USDT
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                      ≈ {(selectedPackage?.amount * m.percent / 100).toFixed(2)} BMC
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#00529C', fontWeight: 'bold' }}>
                      Rp {(selectedPackage?.amount * m.percent / 100 * usdtToIdr).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ marginTop: '5px', height: '8px', background: '#f1f3f5', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: m.released ? '100%' : '0%', height: '100%', background: 'var(--primary)', transition: 'width 0.5s' }} />
                  </div>
                  <p style={{ fontSize: '0.8rem', marginTop: '10px', color: m.released ? 'var(--primary)' : '#f59f00' }}>
                    {m.released ? 'Dana Telah Dicairkan' : 'Terkunci: Menunggu Bukti Kerja'}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ background: '#1e1e2e', color: 'white', padding: '40px', borderRadius: '32px', textAlign: 'center' }}>
              <h2 style={{ marginBottom: '20px' }}>Simulasi Verifikasi Validator</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px' }}>Dana hanya bisa diambil oleh stakeholder jika <strong>Validator Sabumi</strong> telah memverifikasi foto kontribusi/misi di lapangan.</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
                {Object.entries(milestones).filter(([_, m]) => !m.released).map(([key, m]) => (
                  <button key={key} onClick={() => releaseMilestone(key)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px 24px', borderRadius: '15px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                    Setujui Misi: {m.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN VERIFICATION PANEL */}
        {user?.email?.includes('admin') && (
          <div style={{ marginTop: '80px', background: '#1e1e2e', borderRadius: '32px', padding: '40px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Panel Verifikasi Sabumi</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>Validasi usulan lokasi baru dari Investor melalui citra satelit.</p>
              </div>
              <div style={{ background: 'rgba(12, 166, 120, 0.2)', color: 'var(--primary)', padding: '10px 20px', borderRadius: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} /> Admin Sabumi Verified
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {suggestions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', gridColumn: '1/-1' }}>
                  <Info size={40} style={{ marginBottom: '15px', opacity: 0.5 }} />
                  <p>Belum ada usulan lokasi baru yang masuk.</p>
                </div>
              ) : (
                suggestions.map((s) => (
                  <div key={s.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>{s.status}</span>
                      <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{s.date}</span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '5px' }}>{s.name}</h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '15px' }}>Estimasi Luas: {s.area} Ha • {s.type}</p>
                    
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Globe size={14} color="var(--primary)" />
                        <span>Lat: {s.coords.lat.toFixed(6)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={14} color="var(--primary)" />
                        <span>Lng: {s.coords.lng.toFixed(6)}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => {
                        setSuggestions(prev => prev.map(item => item.id === s.id ? { ...item, status: 'Verified & Active' } : item));
                        alert(`Lokasi ${s.name} berhasil divalidasi dan sekarang aktif di peta utama Sabumi.`);
                      }} style={{ flex: 1, background: 'var(--primary)', color: 'white', border: 'none', padding: '10px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Validasi</button>
                      <button onClick={() => {
                        setSuggestions(prev => prev.filter(item => item.id !== s.id));
                        alert(`Usulan lokasi ${s.name} ditolak karena data GIS tidak sesuai.`);
                      }} style={{ flex: 1, background: 'rgba(255,62,62,0.2)', color: '#ff3e3e', border: 'none', padding: '10px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Tolak</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}




        {/* MAP PICKER MODAL - MOBILE OPTIMIZED */}
        {showMapPicker && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 30000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
            <div style={{ 
              background: 'white', padding: '20px', borderRadius: '24px', maxWidth: '600px', width: '100%', 
              maxHeight: '95vh', overflowY: 'auto', position: 'relative', textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}>
              <button onClick={() => setShowMapPicker(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: '#f1f3f5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>&times;</button>
              
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px', marginTop: '10px' }}>Tentukan Titik GIS</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Gunakan zoom dan geser peta untuk akurasi maksimal.</p>
              
              {/* INTERACTIVE MAP CONTAINER */}
              <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '2px solid #f1f3f5', marginBottom: '20px' }}>
                <div 
                  onMouseDown={(e) => {
                    setIsDragging(true);
                    setDragStart({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={(e) => {
                    if (!isDragging) return;
                    const dx = (e.clientX - dragStart.x) / 5; // Sensitivity
                    const dy = (e.clientY - dragStart.y) / 5;
                    setMapPos(prev => ({
                      x: Math.max(0, Math.min(100, prev.x - dx)),
                      y: Math.max(0, Math.min(100, prev.y - dy))
                    }));
                    setDragStart({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                  onTouchStart={(e) => {
                    setIsDragging(true);
                    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                  }}
                  onTouchMove={(e) => {
                    if (!isDragging) return;
                    const dx = (e.touches[0].clientX - dragStart.x) / 5;
                    const dy = (e.touches[0].clientY - dragStart.y) / 5;
                    setMapPos(prev => ({
                      x: Math.max(0, Math.min(100, prev.x - dx)),
                      y: Math.max(0, Math.min(100, prev.y - dy))
                    }));
                    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                  }}
                  onTouchEnd={() => setIsDragging(false)}
                  onClick={(e) => {
                    if (isDragging) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    // Calculate relative coords based on current pan/zoom
                    const realLat = -6.5 + (mapPos.y / 100 * 0.5) + ((y - 0.5) * 0.1 / zoom);
                    const realLng = 106.5 + (mapPos.x / 100 * 0.5) + ((x - 0.5) * 0.1 / zoom);
                    setCoords({ lat: realLat, lng: realLng });
                  }}
                  style={{ 
                    height: '350px', 
                    background: `#e3e6e8 url("https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")`,
                    backgroundSize: `${100 * zoom}%`,
                    backgroundPosition: `${mapPos.x}% ${mapPos.y}%`,
                    cursor: isDragging ? 'grabbing' : 'crosshair',
                    transition: isDragging ? 'none' : 'background-position 0.1s ease-out, background-size 0.3s ease-in-out'
                  }}
                />
                
                {/* Fixed Center Pin Target */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
                  <div style={{ color: '#e03131', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
                    <MapPin size={40} />
                  </div>
                </div>

                {/* ZOOM CONTROLS */}
                <div style={{ position: 'absolute', right: '15px', bottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => setZoom(prev => Math.min(prev + 0.5, 4))} style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: 'white', color: 'var(--text-main)', fontWeight: 'bold', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>+</button>
                  <button onClick={() => setZoom(prev => Math.max(prev - 0.5, 1))} style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: 'white', color: 'var(--text-main)', fontWeight: 'bold', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>-</button>
                </div>

                <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '6px 12px', borderRadius: '30px', fontSize: '0.7rem' }}>
                  Geser peta untuk mengubah titik
                </div>
              </div>

              {/* Coordinates Readout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '16px', border: '1px solid #eee' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Latitude</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{coords.lat.toFixed(6)}</div>
                </div>
                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '16px', border: '1px solid #eee' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Longitude</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{coords.lng.toFixed(6)}</div>
                </div>
              </div>

              <button 
                onClick={() => setShowMapPicker(false)}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '18px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(12, 166, 120, 0.2)' }}>
                Konfirmasi Titik Ini
              </button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PlantationPage;
