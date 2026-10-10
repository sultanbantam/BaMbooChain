import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, Home, Shield, Calculator, FileCheck, 
  CreditCard, Check, Sparkles, Sun, Droplets, Zap, Cpu, 
  Calendar, Layers, ArrowRight, CheckCircle2, AlertCircle, FileText
} from 'lucide-react';
import { HOUSING_MODELS, MBR_PROJECTS } from '../../data/banguninData';

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

export default function HouseConfigurator({ initialProject, onGoToMonitoring }) {
  const [selectedModelId, setSelectedModelId] = useState('model-blockbamboo');
  const [floors, setFloors] = useState(1);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [landArea, setLandArea] = useState(60);
  const [wallMaterial, setWallMaterial] = useState('laminated_bamboo'); // 'laminated_bamboo' | 'risham_panel' | 'thermal_weave'
  
  // Eco Add-ons state
  const [addOns, setAddOns] = useState({
    solarPanel: false,     // +12,000,000
    rainwater: true,       // +4,500,000
    smartIoT: true,        // +1,500,000
    bioPori: false         // +2,000,000
  });

  // KPR Simulation state
  const [downPaymentPercent, setDownPaymentPercent] = useState(5); // 1%, 5%, 10%, 20%
  const [tenorYears, setTenorYears] = useState(20); // 10, 15, 20, 25, 30 tahun
  const [kprScheme, setKprScheme] = useState('FLPP'); // 'FLPP' (5% fixed) | 'TAPERA' (5% fixed) | 'COMMERCIAL' (8.5%)
  
  // Submission & Contract state
  const [showContractModal, setShowContractModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSignatureSigned, setIsSignatureSigned] = useState(false);
  const [buyerName, setBuyerName] = useState('Mukoddas Syuhada');
  const [buyerNik, setBuyerNik] = useState('3175072810760022');
  const [buyerIncome, setBuyerIncome] = useState(5500000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedModel = useMemo(() => {
    return HOUSING_MODELS.find(m => m.id === selectedModelId) || HOUSING_MODELS[0];
  }, [selectedModelId]);

  // Price Calculation
  const totalPrice = useMemo(() => {
    let price = selectedModel.basePrice;
    
    // Floor multiplier
    if (floors === 2) price += 65000000;
    
    // Bedrooms / Bathrooms extra
    if (bedrooms > 2) price += (bedrooms - 2) * 15000000;
    if (bathrooms > 1) price += (bathrooms - 1) * 8000000;
    
    // Land Area adjustment
    if (landArea > 60) price += (landArea - 60) * 850000;

    // Eco Add-ons
    if (addOns.solarPanel) price += 12000000;
    if (addOns.rainwater) price += 4500000;
    if (addOns.smartIoT) price += 1500000;
    if (addOns.bioPori) price += 2000000;

    return price;
  }, [selectedModel, floors, bedrooms, bathrooms, landArea, addOns]);

  // KPR Calculation
  const downPaymentAmount = useMemo(() => {
    return (totalPrice * downPaymentPercent) / 100;
  }, [totalPrice, downPaymentPercent]);

  const loanAmount = useMemo(() => {
    return totalPrice - downPaymentAmount;
  }, [totalPrice, downPaymentAmount]);

  const interestRate = useMemo(() => {
    if (kprScheme === 'FLPP' || kprScheme === 'TAPERA') return 0.05; // 5% fixed
    return 0.085; // 8.5% floating
  }, [kprScheme]);

  const monthlyInstallment = useMemo(() => {
    const months = tenorYears * 12;
    const monthlyRate = interestRate / 12;
    // Anuitas Formula: P * [ r(1+r)^n ] / [ (1+r)^n - 1 ]
    const formula = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(formula);
  }, [loanAmount, tenorYears, interestRate]);

  const dsrRatio = useMemo(() => {
    return Math.round((monthlyInstallment / (buyerIncome || 5000000)) * 100);
  }, [monthlyInstallment, buyerIncome]);

  const handleToggleAddOn = (key) => {
    setAddOns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCompleteBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowPaymentModal(false);
      setShowContractModal(false);
      alert('🎉 Selamat! Akad KPR Digital & Booking Unit Anda Berhasil Diterbitkan. Status masuk ke Monitoring Konstruksi!');
      if (onGoToMonitoring) onGoToMonitoring();
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header Info */}
      <div style={{
        background: 'linear-gradient(135deg, #005BAA, #064e3b)',
        padding: '30px',
        borderRadius: '24px',
        color: '#fff',
        boxShadow: '0 12px 36px rgba(0,91,170,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <div style={{ display: 'inline-flex', padding: '4px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>
              <Sparkles size={14} style={{ marginRight: '6px' }} /> 3D Digital House Configurator & KPR BTN Simulator
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 6px' }}>
              Rancang Rumah Impian MBR & Simulasi KPR
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', margin: 0, maxWidth: '650px' }}>
              Pilih tipe struktur arsitektur bambu / beton RISHAM, kustomisasi spesifikasi ruangan, dan dapatkan taksiran cicilan KPR FLPP Bank BTN secara transparan.
            </p>
          </div>

          {initialProject && (
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.8 }}>Proyek Terpilih:</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{initialProject.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Model Selection Cards */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
          1. Pilih Model & Teknologi Struktur Rumah
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {HOUSING_MODELS.map(model => {
            const isSelected = model.id === selectedModelId;
            return (
              <div 
                key={model.id}
                onClick={() => setSelectedModelId(model.id)}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '20px',
                  border: isSelected ? '2px solid #005BAA' : '1px solid var(--border-color)',
                  boxShadow: isSelected ? '0 10px 30px rgba(0,91,170,0.15)' : '0 4px 15px rgba(0,0,0,0.03)',
                  padding: '20px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.25s'
                }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', width: '26px', height: '26px', borderRadius: '50%', background: '#005BAA', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={16} />
                  </div>
                )}
                <span style={{ display: 'inline-block', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold', padding: '3px 10px', borderRadius: '12px', marginBottom: '8px' }}>
                  {model.badge}
                </span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px' }}>
                  {model.name}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 16px', lineHeight: '1.4' }}>
                  {model.tagline}
                </p>

                <div style={{ height: '140px', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px' }}>
                  <img src={model.render3D} alt={model.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mulai Dari:</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#005BAA' }}>{formatRupiah(model.basePrice)}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-color)', padding: '4px 8px', borderRadius: '6px' }}>
                    ⏳ {model.constructionTimeWeeks} Minggu Jadi
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 Column Layout: Customizer & Real-time Calculation / KPR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px' }}>
        
        {/* LEFT COLUMN: Customizer Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={20} color="#005BAA" /> 2. Kustomisasi Ruangan & Dimensi
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Jumlah Lantai */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px' }}>
                  Jumlah Lantai:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button 
                    onClick={() => setFloors(1)}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: floors === 1 ? '2px solid #005BAA' : '1px solid var(--border-color)',
                      background: floors === 1 ? 'rgba(0,91,170,0.08)' : 'var(--bg-color)',
                      color: 'var(--text-main)',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    1 Lantai (Standar MBR)
                  </button>
                  <button 
                    onClick={() => setFloors(2)}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: floors === 2 ? '2px solid #005BAA' : '1px solid var(--border-color)',
                      background: floors === 2 ? 'rgba(0,91,170,0.08)' : 'var(--bg-color)',
                      color: 'var(--text-main)',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    2 Lantai Mezzanine (+65 Jt)
                  </button>
                </div>
              </div>

              {/* Kamar Tidur & Kamar Mandi */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '6px' }}>
                    Kamar Tidur:
                  </label>
                  <select
                    value={bedrooms}
                    onChange={e => setBedrooms(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontWeight: 'bold' }}
                  >
                    <option value={2}>2 Kamar Tidur</option>
                    <option value={3}>3 Kamar Tidur (+15 Jt)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '6px' }}>
                    Kamar Mandi:
                  </label>
                  <select
                    value={bathrooms}
                    onChange={e => setBathrooms(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontWeight: 'bold' }}
                  >
                    <option value={1}>1 Kamar Mandi</option>
                    <option value={2}>2 Kamar Mandi (+8 Jt)</option>
                  </select>
                </div>
              </div>

              {/* Luas Tanah */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Luas Tanah (Kavling): <strong>{landArea} m²</strong>
                </label>
                <input 
                  type="range"
                  min="60"
                  max="90"
                  step="6"
                  value={landArea}
                  onChange={e => setLandArea(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#005BAA' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>60 m² (Tipe 36/60)</span>
                  <span>72 m² (Tipe 36/72)</span>
                  <span>90 m² (Tipe 36/90)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Eco Add-ons */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sun size={20} color="#f59f00" /> 3. Fitur Hijau & Smart Eco Add-ons
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div 
                onClick={() => handleToggleAddOn('solarPanel')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: addOns.solarPanel ? '2px solid #f59f00' : '1px solid var(--border-color)',
                  background: addOns.solarPanel ? 'rgba(245,159,0,0.08)' : 'var(--bg-color)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sun size={20} color="#f59f00" />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Rooftop Solar Panel 1000W</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hemat tagihan listrik PLN s.d. 40%</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f59f00' }}>+Rp 12.000.000</span>
              </div>

              <div 
                onClick={() => handleToggleAddOn('rainwater')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: addOns.rainwater ? '2px solid #005BAA' : '1px solid var(--border-color)',
                  background: addOns.rainwater ? 'rgba(0,91,170,0.08)' : 'var(--bg-color)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Droplets size={20} color="#005BAA" />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Sistem Pemanen Air Hujan (Rainwater Hub)</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Filtrasi air alami untuk toilet & siram taman</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#005BAA' }}>+Rp 4.500.000</span>
              </div>

              <div 
                onClick={() => handleToggleAddOn('smartIoT')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: addOns.smartIoT ? '2px solid #0ca678' : '1px solid var(--border-color)',
                  background: addOns.smartIoT ? 'rgba(12,166,120,0.08)' : 'var(--bg-color)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Cpu size={20} color="#0ca678" />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Smart IoT Power & Water Meter</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pantau pemakaian energi via aplikasi BangunIn</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#0ca678' }}>+Rp 1.500.000</span>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Real-time KPR BTN Simulator & Checkout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Price Breakdown Card */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={20} color="#005BAA" /> Rincian Biaya Konfigurasi
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tipe Dasar ({selectedModel.name})</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{formatRupiah(selectedModel.basePrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Struktur Lantai ({floors} Lantai)</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{floors === 2 ? '+Rp 65.000.000' : 'Termasuk'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Kamar & Kavling Tanah ({landArea} m²)</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>
                  {landArea > 60 || bedrooms > 2 ? `+${formatRupiah((landArea - 60) * 850000 + (bedrooms > 2 ? 15000000 : 0))}` : 'Termasuk'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px dashed var(--border-color)' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1rem' }}>Total Harga Rumah</span>
                <span style={{ fontWeight: '900', color: '#005BAA', fontSize: '1.3rem' }}>{formatRupiah(totalPrice)}</span>
              </div>
            </div>

            {/* KPR Simulator Controls */}
            <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🏦 Simulasi KPR Bank BTN (MBR FLPP)
              </h4>

              {/* Program Skema */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Skema Pembiayaan:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button 
                    onClick={() => setKprScheme('FLPP')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      border: kprScheme === 'FLPP' ? '2px solid #005BAA' : '1px solid var(--border-color)',
                      background: kprScheme === 'FLPP' ? '#005BAA' : 'transparent',
                      color: kprScheme === 'FLPP' ? '#fff' : 'var(--text-main)',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    KPR FLPP (Bunga 5% Tetap)
                  </button>
                  <button 
                    onClick={() => setKprScheme('TAPERA')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      border: kprScheme === 'TAPERA' ? '2px solid #005BAA' : '1px solid var(--border-color)',
                      background: kprScheme === 'TAPERA' ? '#005BAA' : 'transparent',
                      color: kprScheme === 'TAPERA' ? '#fff' : 'var(--text-main)',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    KPR Tapera (Bunga 5% Tetap)
                  </button>
                </div>
              </div>

              {/* Uang Muka (DP) & Tenor */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Uang Muka (DP): <strong>{downPaymentPercent}% ({formatRupiah(downPaymentAmount)})</strong>
                  </label>
                  <select
                    value={downPaymentPercent}
                    onChange={e => setDownPaymentPercent(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  >
                    <option value={1}>1% (Subsidi BTN)</option>
                    <option value={5}>5% (Standar MBR)</option>
                    <option value={10}>10%</option>
                    <option value={20}>20%</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Jangka Waktu (Tenor): <strong>{tenorYears} Tahun</strong>
                  </label>
                  <select
                    value={tenorYears}
                    onChange={e => setTenorYears(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  >
                    <option value={10}>10 Tahun (120 Bulan)</option>
                    <option value={15}>15 Tahun (180 Bulan)</option>
                    <option value={20}>20 Tahun (240 Bulan)</option>
                    <option value={25}>25 Tahun (300 Bulan)</option>
                    <option value={30}>30 Tahun (360 Bulan)</option>
                  </select>
                </div>
              </div>

              {/* Monthly Installment Result */}
              <div style={{ background: '#005BAA', padding: '16px', borderRadius: '12px', color: '#fff', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.9 }}>Estimasi Angsuran / Cicilan Bulanan</span>
                <span style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
                  {formatRupiah(monthlyInstallment)}
                  <span style={{ fontSize: '0.85rem', fontWeight: 'normal', opacity: 0.8 }}> /bulan</span>
                </span>
                <span style={{ display: 'block', fontSize: '0.75rem', marginTop: '4px', opacity: 0.85 }}>
                  Bunga 5% Fixed Sepanjang Masa Kredit
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <button
              onClick={() => setShowContractModal(true)}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #0ca678, #087f5b)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(12,166,120,0.3)'
              }}
            >
              <FileCheck size={20} /> Ajukan KPR BTN & Tanda Tangan Digital <ArrowRight size={18} />
            </button>
          </div>

        </div>

      </div>

      {/* DIGITAL CONTRACT / SP3K MODAL */}
      {showContractModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 100020,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0,91,170,0.1)', color: '#005BAA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <FileText size={26} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px' }}>
                Praperjanjian Akad KPR & Booking Digital
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Dokumen Digital Terenkripsi Terintegrasi Bank BTN Core Banking & BangunIn
              </p>
            </div>

            {/* Contract Summary */}
            <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '20px', fontSize: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Nama Calon Debitur:</span>
                  <strong>{buyerName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>NIK KTP:</span>
                  <strong>{buyerNik}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Unit Rumah:</span>
                  <strong>{selectedModel.name} ({landArea} m²)</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Total Harga:</span>
                  <strong>{formatRupiah(totalPrice)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Plafond KPR:</span>
                  <strong>{formatRupiah(loanAmount)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Cicilan Bulanan:</span>
                  <strong style={{ color: '#005BAA' }}>{formatRupiah(monthlyInstallment)}/bln ({tenorYears} Thn)</strong>
                </div>
              </div>
            </div>

            {/* E-Signature Box */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px' }}>
                E-Signature (Tanda Tangan Elektronik Sah):
              </label>
              <div 
                onClick={() => setIsSignatureSigned(!isSignatureSigned)}
                style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  background: isSignatureSigned ? 'rgba(12,166,120,0.06)' : 'var(--bg-color)',
                  cursor: 'pointer'
                }}
              >
                {isSignatureSigned ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 color="var(--primary)" size={32} />
                    <span style={{ fontSize: '1.2rem', fontFamily: 'cursive', color: 'var(--primary)', fontWeight: 'bold' }}>
                      {buyerName}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Tervalidasi Digital ID: SHA256-BMC-{buyerNik.slice(-6)}
                    </span>
                  </div>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    ✍️ Klik di sini untuk membubuhkan Tanda Tangan Elektronik
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowContractModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                disabled={!isSignatureSigned}
                onClick={() => {
                  setShowContractModal(false);
                  setShowPaymentModal(true);
                }}
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isSignatureSigned ? '#005BAA' : '#ccc',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: isSignatureSigned ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Lanjut Pembayaran Booking DP <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL (Midtrans & Web3 BMC Token Gateway) */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 100030,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            width: '100%',
            maxWidth: '520px',
            padding: '30px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <CreditCard size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px' }}>
                Pembayaran Booking Fee & Uang Muka (DP)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Pilih metode pembayaran aman terverifikasi Bank BTN & Gateway BangunIn
              </p>
            </div>

            <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', marginBottom: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Nominal Booking Fee:</span>
              <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#005BAA' }}>Rp 1.000.000</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                (Mengurangi Uang Muka DP saat Akad Resmi)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', border: '2px solid #005BAA', background: 'rgba(0,91,170,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>💳 Virtual Account Bank BTN / QRIS</span>
                <span style={{ fontSize: '0.75rem', background: '#005BAA', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>Otomatis Verifikasi</span>
              </div>

              <div style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>🪙 Potong Saldo Token BMC (10 BMC Cashback)</span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px' }}>Web3 On-Chain</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleCompleteBooking}
                style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: '#0ca678', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {isSubmitting ? 'Memproses Transaksi...' : 'Konfirmasi & Bayar Rp 1.000.000'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
