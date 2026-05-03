import React, { useState } from 'react';
import { getAssetUrl } from '../../utils/assets';
import { Sprout, BarChart, ShieldCheck, MapPin, CheckCircle, CreditCard, Wallet as WalletIcon, ExternalLink, ArrowRight, UserCheck, Zap, Info, Clock, Check } from 'lucide-react';
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
  const [usdtToIdr, setUsdtToIdr] = useState(16250); // Default fallback

  // Escrow Simulation States
  const [simulationActive, setSimulationActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txStatusText, setTxStatusText] = useState('');
  const [currentProjectId, setCurrentProjectId] = useState(1);
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
    if (!window.ethereum) return alert("MetaMask belum terhubung.");
    try {
      setIsProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const escrowContract = new ethers.Contract(escrowConfig.addresses.BambooEscrow, escrowConfig.escrowAbi, signer);
      
      const txMap = {
        bibit: 'releaseBibit',
        tanam: 'releaseTanam',
        rawat: 'releasePerawatan',
        risiko: 'releaseRisiko',
        lahan: 'releaseLahan',
        royalti: 'releaseRoyalti',
        pengelola: 'releasePengelola'
      };
      
      const fnName = txMap[id];
      console.log(`Calling ${fnName} on project ${currentProjectId}...`);
      const tx = await escrowContract[fnName](currentProjectId);
      await tx.wait();
      
      setMilestones(prev => ({
        ...prev,
        [id]: { ...prev[id], released: true }
      }));
    } catch (err) {
      console.error(err);
      alert("Gagal memverifikasi: " + (err.reason || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const getEscrowStatus = () => {
    const totalReleased = Object.values(milestones).filter(m => m.released).length;
    if (totalReleased === 0) return 'Dana Terkunci di Smart Contract';
    if (totalReleased === Object.keys(milestones).length) return 'Semua Dana Telah Didistribusikan';
    return `Didistribusikan Sebagian (${totalReleased}/7)`;
  };

  React.useEffect(() => {
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
    if (method === 'USDT BEP-20' || method === 'BMC Token') {
      if (!window.ethereum) return alert("Harap install MetaMask untuk transaksi Crypto.");
      try {
        // ---- MODE PRESENTASI (DEMO) ----
        // Mem-bypass MetaMask untuk menghindari peringatan merah (Review Alert)
        // karena kontrak MockUSDT belum diverifikasi di Mainnet. Ini agar presentasi aman.
        setIsProcessing(true);
        setTxStatusText('Meminta Akses Wallet...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTxStatusText('Langkah 1/2: Menyetujui USDT (Simulasi)');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setTxStatusText('Menunggu Konfirmasi Jaringan...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setTxStatusText('Langkah 2/2: Deposit Dana (Simulasi)');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setTxStatusText('Menyelesaikan Transaksi...');
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Reset milestone data untuk simulasi
        setMilestones({
          bibit: { id: 'bibit', name: 'Pemilik Bibit', percent: 16, released: false },
          tanam: { id: 'tanam', name: 'Penanam', percent: 4, released: false },
          rawat: { id: 'rawat', name: 'Perawatan', percent: 10.67, released: false },
          risiko: { id: 'risiko', name: 'Cadangan Risiko', percent: 13.33, released: false },
          lahan: { id: 'lahan', name: 'Pemilik Lahan', percent: 2.67, released: false },
          royalti: { id: 'royalti', name: 'Royalti', percent: 6.67, released: false },
          pengelola: { id: 'pengelola', name: 'Pengelola (YSNJ)', percent: 46.66, released: false },
        });
        
        setSimulationActive(true);
        setTimeout(() => {
          document.getElementById('escrow-simulation').scrollIntoView({ behavior: 'smooth' });
        }, 100);
        
        /* === KODE WEB3 ASLI (DISEMBUNYIKAN UNTUK DEMO) ===
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const escrowContract = new ethers.Contract(escrowConfig.addresses.BambooEscrow, escrowConfig.escrowAbi, signer);
        const usdtContract = new ethers.Contract(escrowConfig.addresses.MockUSDT, escrowConfig.usdtAbi, signer);
        const amountWei = ethers.parseUnits(selectedPackage.amount.toString(), 18);
        const approveTx = await usdtContract.approve(escrowConfig.addresses.BambooEscrow, amountWei);
        await approveTx.wait();
        const depositTx = await escrowContract.deposit(amountWei);
        const receipt = await depositTx.wait();
        // (Logika Parse Project ID ditiadakan sementara)
        */
      } catch (err) {
        console.error(err);
        if (err.code === 'ACTION_REJECTED') {
          alert("Transaksi dibatalkan oleh pengguna.");
        } else {
          alert("Transaksi gagal: " + (err.reason || err.message));
        }
      } finally {
        setIsProcessing(false);
        setTxStatusText('');
      }
    } else {
      // Dummy activation for Non-Crypto
      setSimulationActive(true);
      setTimeout(() => {
        document.getElementById('escrow-simulation').scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div style={{ paddingTop: '220px', paddingBottom: '100px', minHeight: '100vh', background: 'linear-gradient(to bottom, #fdfdfd, #f4f7f4)' }}>
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
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
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
            <div style={{ marginBottom: '40px' }}>
              <button onClick={prevStep} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 Kembali ke Lokasi
              </button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>Pilih Paket Penanaman</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Mendukung di: <strong>{selectedLocation.name}</strong></p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="glass"
                  onClick={() => handleSelectPackage(pkg)}
                  style={{ 
                    padding: '30px', borderRadius: '24px', cursor: 'pointer', transition: 'all 0.3s',
                    background: 'white', border: '2px solid transparent', textAlign: 'center',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
                >
                  <div onClick={(e) => pkg.id === 'custom' && e.stopPropagation()}>
                    <Sprout size={40} color="var(--primary)" style={{ marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>{pkg.name}</h3>
                    
                    {pkg.id === 'custom' ? (
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ position: 'relative', maxWidth: '150px', margin: '0 auto' }}>
                          <input 
                            type="number" 
                            placeholder="0"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            style={{ 
                              width: '100%', padding: '10px 10px 10px 10px', borderRadius: '12px', border: '2px solid #eee', 
                              textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', outline: 'none'
                            }}
                          />
                          <span style={{ position: 'absolute', right: '-45px', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold', color: '#888' }}>USDT</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>
                        {pkg.amount} <span style={{ fontSize: '0.9rem', color: '#adb5bd' }}>USDT</span>
                      </div>
                    )}
                    
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>{pkg.desc}</p>
                  </div>
                  
                  <div 
                    className="btn btn-primary" 
                    style={{ width: '100%', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pkg.id === 'custom' ? 'Dukung Sekarang' : 'Pilih Paket'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: PEMBAYARAN */}
        {step === 2 && (
          <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
              <button onClick={prevStep} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 Kembali ke Paket
              </button>
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>Metode Pembayaran</h1>
              <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #eee', marginBottom: '30px' }}>
                <div style={{ fontSize: '0.9rem', color: '#888' }}>Total Dukungan</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>{selectedPackage.amount} USDT / Rp. {Math.round(selectedPackage.amount * usdtToIdr).toLocaleString('id-ID')}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '8px' }}>Lokasi: {selectedLocation.name}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* BRI */}
              <div 
                onClick={() => setSelectedMethod(selectedMethod === 'bri' ? null : 'bri')}
                style={{ padding: '25px', background: 'white', border: selectedMethod === 'bri' ? '2px solid var(--primary)' : '1px solid #eee', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: '#0052a2', color: 'white', padding: '12px', borderRadius: '12px' }}><CreditCard size={24} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Transfer Bank BRI</div>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>No. Rek: 141101000456562</div>
                  </div>
                  <ArrowRight size={20} color={selectedMethod === 'bri' ? 'var(--primary)' : '#adb5bd'} style={{ transform: selectedMethod === 'bri' ? 'rotate(90deg)' : 'none', transition: '0.3s' }} />
                </div>
                {selectedMethod === 'bri' && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee', animation: 'fadeIn 0.3s' }}>
                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '15px' }}>
                      <div style={{ marginBottom: '5px' }}><strong>Bank:</strong> BRI</div>
                      <div style={{ marginBottom: '5px' }}><strong>No. Rekening:</strong> 141101000456562</div>
                      <div><strong>Atas Nama:</strong> Yayasan Sabumi Nusantara Jaya</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handlePayment('Transfer BRI'); }} className="btn btn-primary" style={{ width: '100%', borderRadius: '12px' }}>Konfirmasi & Kirim Bukti</button>
                  </div>
                )}
              </div>

              {/* BMC */}
              <div 
                onClick={() => setSelectedMethod(selectedMethod === 'bmc' ? null : 'bmc')}
                style={{ padding: '25px', background: 'white', border: selectedMethod === 'bmc' ? '2px solid var(--primary)' : '1px solid #eee', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '12px' }}><Zap size={24} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>BMC Token (BEP-20)</div>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>Address: 0x0d1Be...2e222</div>
                  </div>
                  <ArrowRight size={20} color={selectedMethod === 'bmc' ? 'var(--primary)' : '#adb5bd'} style={{ transform: selectedMethod === 'bmc' ? 'rotate(90deg)' : 'none', transition: '0.3s' }} />
                </div>
                {selectedMethod === 'bmc' && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee', animation: 'fadeIn 0.3s' }}>
                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '15px', wordBreak: 'break-all' }}>
                      <div style={{ marginBottom: '5px' }}><strong>Jaringan:</strong> Binance Smart Chain (BEP-20)</div>
                      <div><strong>Address:</strong> 0x0d1Be34402B12D4c0c6aA850db568F7874F2e222</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handlePayment('BMC Token'); }} className="btn btn-primary" style={{ width: '100%', borderRadius: '12px' }} disabled={isProcessing}>
                      {isProcessing ? txStatusText : 'Konfirmasi & Kirim Bukti'}
                    </button>
                  </div>
                )}
              </div>

              {/* USDT */}
              <div 
                onClick={() => setSelectedMethod(selectedMethod === 'usdt' ? null : 'usdt')}
                style={{ padding: '25px', background: 'white', border: selectedMethod === 'usdt' ? '2px solid var(--primary)' : '1px solid #eee', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: '#26a17b', color: 'white', padding: '12px', borderRadius: '12px' }}><WalletIcon size={24} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>USDT (BEP-20)</div>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>Address: 0xcb661...20e10</div>
                  </div>
                  <ArrowRight size={20} color={selectedMethod === 'usdt' ? 'var(--primary)' : '#adb5bd'} style={{ transform: selectedMethod === 'usdt' ? 'rotate(90deg)' : 'none', transition: '0.3s' }} />
                </div>
                {selectedMethod === 'usdt' && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee', animation: 'fadeIn 0.3s' }}>
                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '15px', wordBreak: 'break-all' }}>
                      <div style={{ marginBottom: '5px' }}><strong>Jaringan:</strong> Binance Smart Chain (BEP-20)</div>
                      <div><strong>Address:</strong> 0xcb66199ea24746a7917a8dc171b0583cd7420e10</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handlePayment('USDT BEP-20'); }} className="btn btn-primary" style={{ width: '100%', borderRadius: '12px' }} disabled={isProcessing}>
                      {isProcessing ? txStatusText : 'Konfirmasi & Bayar USDT (Web3)'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '50px', background: 'rgba(12,166,120,0.05)', borderRadius: '24px', padding: '30px', border: '1px dashed var(--primary)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} /> Mekanisme Transparansi
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#444' }}>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <CheckCircle size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Dana otomatis teralokasi ke smart contract / wallet petani pembibit dan penanam.
                </li>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <CheckCircle size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Petani menerima dana secara bertahap setelah tugas (tanam/rawat) diverifikasi oleh validator.
                </li>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <CheckCircle size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Perkembangan bambu Anda akan tayang secara real-time di dashboard pemantauan digital.
                </li>
              </ul>
            </div>

            {/* Escrow Simulation UI */}
            {simulationActive && (
              <div id="escrow-simulation" className="animate-fade-in" style={{ marginTop: '50px', background: 'white', borderRadius: '24px', padding: '30px', border: '2px solid var(--primary)', boxShadow: '0 10px 30px rgba(12,166,120,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{ display: 'inline-block', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px' }}>
                    Simulasi Smart Contract Escrow
                  </div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Alokasi Dana Otomatis</h3>
                  <div style={{ fontSize: '1.1rem', color: '#666', marginTop: '5px' }}>Total Deposit: <strong>{selectedPackage.amount} USDT</strong></div>
                  
                  <div style={{ marginTop: '20px', padding: '15px', borderRadius: '16px', background: '#f8f9fa', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <ShieldCheck size={24} color={Object.values(milestones).every(m => m.released) ? '#16a34a' : '#f59e0b'} />
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: Object.values(milestones).every(m => m.released) ? '#16a34a' : '#f59e0b' }}>
                      Status: {getEscrowStatus()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {Object.values(milestones).map((m) => {
                    const amountUsdt = ((selectedPackage.amount * m.percent) / 100).toFixed(2);
                    return (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: m.released ? 'rgba(34, 197, 94, 0.05)' : '#f8f9fa', border: `1px solid ${m.released ? '#16a34a' : '#eee'}`, borderRadius: '16px', transition: 'all 0.3s' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{m.name}</div>
                            <div style={{ fontSize: '0.8rem', background: '#e9ecef', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold', color: '#666' }}>{m.percent}%</div>
                          </div>
                          <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>{amountUsdt} USDT</div>
                        </div>
                        
                        <div>
                          {m.released ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 'bold', background: 'rgba(34, 197, 94, 0.1)', padding: '10px 15px', borderRadius: '12px' }}>
                              <CheckCircle size={18} /> Tersalurkan
                            </div>
                          ) : (
                            <button 
                              onClick={() => releaseMilestone(m.id)}
                              className="btn btn-primary" 
                              disabled={isProcessing}
                              style={{ padding: '10px 15px', borderRadius: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', opacity: isProcessing ? 0.7 : 1 }}
                            >
                              <UserCheck size={16} /> {isProcessing ? 'Memproses...' : 'Verifikasi Validator (Web3)'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div style={{ marginTop: '30px', fontSize: '0.85rem', color: '#888', textAlign: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '12px' }}>
                  <Info size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '5px' }} />
                  Dalam implementasi nyata, tombol "Verifikasi" ini hanya dapat ditekan oleh Validator resmi (menggunakan wallet signature) setelah menerima bukti kerja (foto/GPS) dari lapangan.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dashboard Preview (Always visible at bottom) */}
        <div style={{ marginTop: '100px', borderTop: '1px solid #eee', paddingTop: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Dashboard Pemantauan</h2>
              <p style={{ color: '#888' }}>Data real-time penanaman yang telah Anda dukung.</p>
            </div>
            <div style={{ background: '#f8f9fa', padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary)' }}>
               LIVE UPDATES ACTIVE
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="glass" style={{ padding: '25px', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(12,166,120,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Clock size={20} /></div>
                <div style={{ fontWeight: 'bold' }}>Status Terakhir</div>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>Tunas Terdeteksi</div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Diverifikasi oleh Validator: Budi Santoso</div>
            </div>

            <div className="glass" style={{ padding: '25px', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(12,166,120,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Zap size={20} /></div>
                <div style={{ fontWeight: 'bold' }}>Alokasi Dana Petani</div>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>65% Terdistribusi</div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Terkirim ke 12 Wallet Petani di Cibarani</div>
            </div>

            <div className="glass" style={{ padding: '25px', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(12,166,120,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><BarChart size={20} /></div>
                <div style={{ fontWeight: 'bold' }}>Serapan Karbon</div>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>1.2 Ton CO2e</div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Berdasarkan biomassa bambu umur 6 bulan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantationPage;
