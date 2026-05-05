import React, { useState, useEffect } from 'react';
import { getAssetUrl } from '../../utils/assets';
import { Sprout, BarChart, ShieldCheck, MapPin, CheckCircle, CreditCard, Wallet as WalletIcon, ExternalLink, ArrowRight, UserCheck, Zap, Info, Clock, Check, X } from 'lucide-react';
import BackButton from '../../components/BackButton';
import { useWeb3 } from '../../context/Web3Context';
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
    royalti: { id: 'royalti', name: 'Royalti', percent: 6.67, released: false },
    pengelola: { id: 'pengelola', name: 'Pengelola (YSNJ)', percent: 46.66, released: false },
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
    { id: 'cibarani', name: 'Kasepuhan Cibarani, Lebak', image: getAssetUrl('gambar/1.jpg'), area: '490 Ha', farmers: 120, desc: 'Restorasi hutan adat dan sabuk ekologis.' },
    { id: 'cisadane', name: 'Tepi Cisadane, Tangerang Raya', image: getAssetUrl('gambar/2.jpg'), area: '120 Ha', farmers: 45, desc: 'Pengembangan ekonomi masyarakat melalui ekowisata.' }
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
    setTimeout(() => {
      document.getElementById('escrow-simulation')?.scrollIntoView({ behavior: 'smooth' });
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
            </div>
          </div>
        )}

        {/* STEP 1: PILIH PAKET */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: '40px' }}><button onClick={prevStep} className="btn-back">Kembali</button></div>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>Pilih Paket Penanaman</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Mendukung di: <strong>{selectedLocation?.name}</strong></p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {packages.map((pkg) => (
                <div key={pkg.id} className="glass" onClick={() => handleSelectPackage(pkg)} style={{ padding: '30px', borderRadius: '24px', cursor: 'pointer', background: 'white', textAlign: 'center' }}>
                  <Sprout size={40} color="var(--primary)" style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{pkg.name}</h3>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>{pkg.amount} USDT</div>
                  <p>{pkg.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: KONTRIBUSI DATA & PEMBAYARAN */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900' }}>Upload Foto Kontribusi Data</h1>
              <p>Pastikan foto diunggah dengan jelas. Klik <strong>Lihat Contoh</strong> agar foto diterima oleh validator.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '50px' }}>
              {[
                { label: 'Rumpun', count: 3, img: 8 },
                { label: 'Ruas Batang', count: 1, img: 9 },
                { label: 'Buku Batang', count: 1, img: 10 },
                { label: 'Pelepah Daun', count: 1, img: 11 },
                { label: 'Pelepah Batang', count: 3, img: 12 },
                { label: 'Cabang', count: 1, img: 13 },
                { label: 'Rebung', count: 3, img: 14 },
                { label: 'Bunga', count: 1, img: 15 },
                { label: 'Selfie dengan Rumpun', count: 1, img: 16 }
              ].map((item, idx) => (
                <div key={idx} className="glass" style={{ padding: '20px', borderRadius: '16px', background: 'white' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '15px' }}>{item.label} ({item.count} Foto)</div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => openExample(item.img)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #eee', background: '#f8f9fa', cursor: 'pointer' }}>Lihat Contoh</button>
                    <button style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer' }}>Upload</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
               <button onClick={handlePayment} className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem', borderRadius: '30px' }}>Kirim Data & Selesaikan Pembayaran</button>
            </div>
          </div>
        )}

        {/* GALLERIES */}
        <div style={{ marginTop: '100px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Galeri Pengetahuan Taksonomi Bambu</h2>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '20px 0' }}>
            {[1, 2, 3, 4, 5, 6, 17, 18, 19, 20].map((i) => (
              <div key={i} style={{ minWidth: '250px', height: '350px', borderRadius: '20px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                <img src={getAssetUrl(`gambar/${i}.jpg`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* EXAMPLE MODAL */}
        {showExampleModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', maxWidth: '500px', width: '100%', position: 'relative' }}>
              <button onClick={() => setShowExampleModal(false)} style={{ position: 'absolute', top: '-15px', right: '-15px', background: 'white', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}><X size={24} /></button>
              <img src={exampleImg} style={{ width: '100%', borderRadius: '15px' }} />
              <div style={{ textAlign: 'center', marginTop: '15px', fontWeight: 'bold' }}>Contoh Foto Taksonomi</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PlantationPage;
