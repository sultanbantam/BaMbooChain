import React, { useState, useEffect } from 'react';
import { getAssetUrl } from '../../utils/assets';
import { Sprout, BarChart, ShieldCheck, MapPin, CheckCircle, CreditCard, Wallet as WalletIcon, ExternalLink, ArrowRight, UserCheck, Zap, Info, Clock, Check, X, Globe, Landmark, Activity } from 'lucide-react';
import BackButton from '../../components/BackButton';
import { useWeb3 } from '../../context/Web3Context';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ethers } from 'ethers';
import { escrowConfig } from '../../utils/escrowConfig';

const PlantationPage = () => {
  const { t } = useLanguage();
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
  const { user, submitLocationProposal, submitPlantationDonation } = useAuth(); // Need to import useAuth
  
  // States for Suggestion Feature
  const [coords, setCoords] = useState({ lat: -6.2088, lng: 106.8456 }); // Default Jakarta
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [newLoc, setNewLoc] = useState({ name: '', area: '', type: 'Lahan Adat', vision: '' });

  const getLahanTypeTranslation = (type) => {
    switch (type) {
      case 'Lahan Adat': return t('plantation_type_adat');
      case 'Lahan Perhutani': return t('plantation_type_perhutani');
      case 'Lahan Pribadi': return t('plantation_type_pribadi');
      case 'Lahan Konservasi': return t('plantation_type_konservasi');
      default: return type;
    }
  };

  const getStatusTranslation = (status) => {
    if (status === 'Pending Verification') return t('plantation_status_pending');
    if (status === 'Verified & Active' || status === 'Verified') return t('plantation_status_verified');
    return status;
  };
  
  // Map Simulation States
  const [zoom, setZoom] = useState(1);
  const [mapPos, setMapPos] = useState({ x: 50, y: 50 }); // Center by default
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleSuggest = async () => {
    if (!newLoc.name || !newLoc.area) {
      alert(t('plantation_alert_fill_fields'));
      return;
    }

    const proposalData = {
      name: newLoc.name,
      size: newLoc.area,
      type: newLoc.type,
      vision: newLoc.vision,
      coordinates: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
      owner: user?.name || 'Guest'
    };

    const success = await submitLocationProposal(proposalData);

    if (success) {
      alert(t('plantation_alert_suggest_success'));
      setNewLoc({ name: '', area: '', type: 'Lahan Adat', vision: '' });
    } else {
      alert(t('plantation_alert_suggest_failed'));
    }
  };

  const openExample = (imgNum) => {
    setExampleImg(getAssetUrl(`gambar/${imgNum}.jpg`));
    setShowExampleModal(true);
  };

  const [milestones, setMilestones] = useState({
    bibit: { id: 'bibit', name: 'Pemilik Bibit', nameKey: 'val_ms_bibit', percent: 16, released: false },
    tanam: { id: 'tanam', name: 'Penanam', nameKey: 'val_ms_tanam', percent: 4, released: false },
    rawat: { id: 'rawat', name: 'Perawatan', nameKey: 'val_ms_rawat', percent: 10.67, released: false },
    risiko: { id: 'risiko', name: 'Cadangan Risiko', nameKey: 'val_ms_risiko', percent: 13.33, released: false },
    lahan: { id: 'lahan', name: 'Pemilik Lahan', nameKey: 'val_ms_lahan', percent: 2.67, released: false },
    royalti: { id: 'royalti', name: 'Royalti Sistem', nameKey: 'val_ms_royalti', percent: 6.67, released: false },
    pengelola: { id: 'pengelola', name: 'Sabumi (Manajemen)', nameKey: 'val_ms_pengelola', percent: 46.66, released: false },
  });

  const getMilestoneName = (m) => {
    return m.nameKey ? t(m.nameKey) : m.name;
  };

  const releaseMilestone = async (id) => {
    setMilestones(prev => ({
      ...prev,
      [id]: { ...prev[id], released: true }
    }));
  };

  const getEscrowStatus = () => {
    const totalReleased = Object.values(milestones).filter(m => m.released).length;
    if (totalReleased === 0) return t('plantation_escrow_locked');
    if (totalReleased === Object.keys(milestones).length) return t('plantation_escrow_all_released');
    return t('plantation_escrow_partial_released').replace('{released}', totalReleased);
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
    { id: 'cibarani', nameKey: 'plantation_loc_cibarani_name', image: getAssetUrl('gambar/pehcibarani.png'), area: '490 Ha', farmers: 120, descKey: 'plantation_loc_cibarani_desc' },
    { id: 'cisadane', nameKey: 'plantation_loc_cisadane_name', image: getAssetUrl('gambar/ceap.png'), area: '120 Ha', farmers: 45, descKey: 'plantation_loc_cisadane_desc' }
  ];

  const getLocationField = (loc, field) => {
    if (!loc) return '';
    if (field === 'name') return loc.nameKey ? t(loc.nameKey) : loc.name;
    if (field === 'desc') return loc.descKey ? t(loc.descKey) : loc.desc;
    return '';
  };

  const packages = [
    { id: 'custom', nameKey: 'plantation_pkg_custom_name', amount: 'Any', bibit: 'Custom', descKey: 'plantation_pkg_custom_desc' },
    { id: 'donasi', nameKey: 'plantation_pkg_donasi_name', amount: 50, bibit: 10, descKey: 'plantation_pkg_donasi_desc' },
    { id: 'petani', nameKey: 'plantation_pkg_petani_name', amount: 500, bibit: 100, descKey: 'plantation_pkg_petani_desc' },
    { id: 'orangtua', nameKey: 'plantation_pkg_parent_name', amount: 5000, bibit: 1000, descKey: 'plantation_pkg_parent_desc' }
  ];

  const getPackageField = (pkg, field) => {
    if (!pkg) return '';
    if (field === 'name') return pkg.nameKey ? t(pkg.nameKey) : pkg.name;
    if (field === 'desc') return pkg.descKey ? t(pkg.descKey) : pkg.desc;
    return '';
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    nextStep();
  };

  const handleSelectPackage = (pkg) => {
    if (pkg.id === 'custom') {
      if (!customAmount || isNaN(customAmount) || customAmount <= 0) {
        alert(t('plantation_alert_invalid_amount'));
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
    setTxStatusText('Memproses Pembayaran...');
    
    // Save to Firestore via AuthContext
    const success = await submitPlantationDonation({
      location: selectedLocation,
      package: selectedPackage,
      amount: selectedPackage?.amount,
      paymentMethod: method === 'bri' ? 'Transfer BRI' : method === 'bmc' ? 'Wallet BMC' : 'USDT'
    });

    if (!success) {
      alert(t('plantation_alert_payment_error'));
      setIsProcessing(false);
      return;
    }

    setSimulationActive(true);
    setIsProcessing(false);
    nextStep(); // Go to Step 3
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '100px', minHeight: '100vh', background: 'linear-gradient(to bottom, var(--bg-secondary), var(--bg-color))' }}>
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
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>{t('plantation_title_choose_location')}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('plantation_desc_choose_location')}</p>
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
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '10px' }}>{getLocationField(loc, 'name')}</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{getLocationField(loc, 'desc')}</p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>📍 {t('plantation_table_area')}: {loc.area}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>👨‍🌾 {t('plantation_loc_farmers')}: {loc.farmers}+</div>
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
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>{t('plantation_suggest_other_location')}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('plantation_suggest_other_location_desc')}</p>
              </div>
            </div>

            {/* SUGGESTION FORM */}
            <div id="suggest-form" style={{ marginTop: '80px', background: 'white', borderRadius: '32px', padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>{t('plantation_form_suggest_title')}</h2>
              
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', marginBottom: '30px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '15px' }}>
                  <Globe size={24} />
                  <span style={{ fontWeight: 'bold' }}>{t('plantation_form_gis_integration')}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('plantation_form_detected_coords')}</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</div>
                  </div>
                  <button 
                    onClick={() => setShowMapPicker(true)}
                    style={{ background: 'white', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {t('plantation_form_btn_pick_point')}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>{t('plantation_form_label_loc_name')}</label>
                  <input 
                    type="text" 
                    value={newLoc.name}
                    onChange={(e) => setNewLoc({...newLoc, name: e.target.value})}
                    placeholder={t('plantation_form_plc_loc_name')} 
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #eee', background: '#f8f9fa' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>{t('plantation_form_label_area')}</label>
                  <input 
                    type="number" 
                    value={newLoc.area}
                    onChange={(e) => setNewLoc({...newLoc, area: e.target.value})}
                    placeholder={t('plantation_form_plc_area')} 
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #eee', background: '#f8f9fa' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>{t('plantation_form_label_type')}</label>
                  <select 
                    value={newLoc.type}
                    onChange={(e) => setNewLoc({...newLoc, type: e.target.value})}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #eee', background: '#f8f9fa' }}>
                    <option value="Lahan Adat">{t('plantation_type_adat')}</option>
                    <option value="Lahan Perhutani">{t('plantation_type_perhutani')}</option>
                    <option value="Lahan Pribadi">{t('plantation_type_pribadi')}</option>
                    <option value="Lahan Konservasi">{t('plantation_type_konservasi')}</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>{t('plantation_form_label_vision')}</label>
                <textarea 
                  rows="4" 
                  value={newLoc.vision}
                  onChange={(e) => setNewLoc({...newLoc, vision: e.target.value})}
                  placeholder={t('plantation_form_plc_vision')} 
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #eee', background: '#f8f9fa' }}
                ></textarea>
              </div>
              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={handleSuggest}
                  style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '16px 50px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(12, 166, 120, 0.2)' }}>
                  {t('plantation_form_btn_submit')}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* STEP 1: PILIH PAKET */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: '40px' }}><button onClick={prevStep} className="btn-back">{t('plantation_btn_back')}</button></div>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>{t('plantation_title_choose_package')}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }} dangerouslySetInnerHTML={{ __html: t('plantation_support_at').replace('{location}', `<strong>${getLocationField(selectedLocation, 'name')}</strong>`) }} />
              
              {/* CURRENCY CONVERSION INFO */}
              <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(12, 166, 120, 0.05)', padding: '10px 20px', borderRadius: '15px', marginTop: '20px', border: '1px solid rgba(12, 166, 120, 0.1)', color: 'var(--primary)', fontWeight: 'bold' }}>
                <Activity size={18} style={{ marginRight: '8px' }} />
                {t('plantation_market_rate_info').replace('{rate}', usdtToIdr.toLocaleString())}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {packages.map((pkg) => (
                <div key={pkg.id} className="glass" onClick={() => {
                  if (pkg.id !== 'custom') handleSelectPackage(pkg);
                }} style={{ padding: '30px', borderRadius: '24px', cursor: 'pointer', background: 'white', textAlign: 'center', border: selectedPackage?.id === pkg.id ? '2px solid var(--primary)' : '1px solid #eee' }}>
                  <Sprout size={40} color="var(--primary)" style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{getPackageField(pkg, 'name')}</h3>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)' }}>{pkg.amount === 'Any' ? 'Any' : pkg.amount} USDT</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px' }}>{getPackageField(pkg, 'desc')}</p>
                  
                  {pkg.id === 'custom' && (
                    <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '15px' }}>
                      <input 
                        type="number" 
                        placeholder={t('plantation_custom_amount_placeholder')} 
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '10px', textAlign: 'center' }}
                      />
                      <button onClick={() => handleSelectPackage(pkg)} className="btn btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '10px' }}>{t('plantation_btn_select_package')}</button>
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
            <div style={{ marginBottom: '40px' }}><button onClick={prevStep} className="btn-back">{t('plantation_btn_back')}</button></div>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900' }}>{t('plantation_payment_method')}</h1>
              <p dangerouslySetInnerHTML={{ __html: t('plantation_support_pkg_at').replace('{amount}', `<strong>${selectedPackage?.amount}</strong>`).replace('{location}', `<strong>${getLocationField(selectedLocation, 'name')}</strong>`) }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              {/* BRI */}
              <div className="glass" onClick={() => setSelectedMethod('bri')} style={{ padding: '30px', borderRadius: '24px', border: selectedMethod === 'bri' ? '2px solid var(--primary)' : '1px solid #eee', cursor: 'pointer', background: 'white' }}>
                <Landmark size={32} color="#00529C" style={{ marginBottom: '15px' }} />
                <h3 style={{ fontWeight: 'bold' }}>{t('plantation_pay_bri_title')}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('plantation_pay_bri_desc').replace('{amount}', (selectedPackage?.amount * usdtToIdr).toLocaleString())}</p>
              </div>
              
              {/* BMC */}
              <div className="glass" onClick={() => setSelectedMethod('bmc')} style={{ padding: '30px', borderRadius: '24px', border: selectedMethod === 'bmc' ? '2px solid var(--primary)' : '1px solid #eee', cursor: 'pointer', background: 'white' }}>
                <WalletIcon size={32} color="var(--primary)" style={{ marginBottom: '15px' }} />
                <h3 style={{ fontWeight: 'bold' }}>{t('plantation_pay_bmc_title')}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('plantation_pay_bmc_desc')}</p>
              </div>

              {/* USDT */}
              <div className="glass" onClick={() => setSelectedMethod('usdt')} style={{ padding: '30px', borderRadius: '24px', border: selectedMethod === 'usdt' ? '2px solid var(--primary)' : '1px solid #eee', cursor: 'pointer', background: 'white' }}>
                <CreditCard size={32} color="#26A17B" style={{ marginBottom: '15px' }} />
                <h3 style={{ fontWeight: 'bold' }}>{t('plantation_pay_usdt_title')}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('plantation_pay_usdt_desc')}</p>
              </div>
            </div>

            {selectedMethod && (
              <div className="glass animate-fade-in" style={{ padding: '40px', borderRadius: '32px', background: 'white', textAlign: 'center', border: '1px solid #eee' }}>
                <h2 style={{ marginBottom: '20px' }}>{t('plantation_payment_detail_title')}</h2>
                
                {selectedMethod === 'bri' && (
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00529C' }}>{t('plantation_bri_account_name')}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '900', margin: '10px 0' }}>141101000456562</div>
                    <p>{t('plantation_total_idr').replace('{amount}', (selectedPackage?.amount * usdtToIdr).toLocaleString())}</p>
                  </div>
                )}

                {selectedMethod === 'bmc' && (
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{t('plantation_bmc_wallet_name')}</div>
                    <div style={{ fontSize: '0.9rem', wordBreak: 'break-all', margin: '10px 0', fontFamily: 'monospace', background: '#eee', padding: '10px', borderRadius: '8px' }}>
                      0x0d1Be34402B12D4c0c6aA850db568F7874F2e222
                    </div>
                    <p>{t('plantation_total_bmc').replace('{amount}', selectedPackage?.amount)}</p>
                  </div>
                )}

                {selectedMethod === 'usdt' && (
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#26A17B' }}>{t('plantation_usdt_wallet_name')}</div>
                    <div style={{ fontSize: '0.9rem', wordBreak: 'break-all', margin: '10px 0', fontFamily: 'monospace', background: '#eee', padding: '10px', borderRadius: '8px' }}>
                      0xcb66199ea24746a7917a8dc171b0583cd7420e10
                    </div>
                    <p>{t('plantation_network_info')}</p>
                    <p>{t('plantation_total_usdt').replace('{amount}', selectedPackage?.amount)}</p>
                  </div>
                )}

                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>{t('plantation_payment_instructions')}</p>
                
                <button onClick={() => handlePayment(selectedMethod)} className="btn btn-primary" style={{ padding: '16px 50px', borderRadius: '30px', fontSize: '1.1rem' }}>
                  {t('plantation_btn_confirm_transfer')}
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
                <ShieldCheck size={20} style={{ marginRight: '8px' }} /> {t('plantation_escrow_badge')}
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900' }}>{t('plantation_distribution_title')}</h1>
              <p dangerouslySetInnerHTML={{ __html: t('plantation_distribution_desc').replace('{amount}', `<strong>${selectedPackage?.amount}</strong>`) }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
              {Object.entries(milestones).map(([key, m]) => (
                <div key={key} className="glass" style={{ padding: '25px', borderRadius: '24px', background: 'white', position: 'relative', overflow: 'hidden' }}>
                  {m.released && <div style={{ position: 'absolute', top: '15px', right: '15px', color: 'var(--primary)' }}><CheckCircle size={24} /></div>}
                  <div style={{ color: m.released ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{t('plantation_allocation_percent').replace('{percent}', m.percent)}</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '10px 4px' }}>{getMilestoneName(m)}</h3>
                  
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
                    {m.released ? t('plantation_funds_released') : t('plantation_funds_locked')}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ background: '#1e1e2e', color: 'white', padding: '40px', borderRadius: '32px', textAlign: 'center' }}>
              <h2 style={{ marginBottom: '20px' }}>{t('plantation_sim_validator_title')}</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px' }}>{t('plantation_sim_validator_desc')}</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
                {Object.entries(milestones).filter(([_, m]) => !m.released).map(([key, m]) => (
                  <button key={key} onClick={() => releaseMilestone(key)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px 24px', borderRadius: '15px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                    {t('plantation_approve_mission').replace('{name}', getMilestoneName(m))}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

          </div>




        {/* MAP PICKER MODAL - MOBILE OPTIMIZED */}
        {showMapPicker && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 30000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
            <div style={{ 
              background: 'white', padding: '20px', borderRadius: '24px', maxWidth: '600px', width: '100%', 
              maxHeight: '95vh', overflowY: 'auto', position: 'relative', textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}>
              <button onClick={() => setShowMapPicker(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: '#f1f3f5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>&times;</button>
              
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px', marginTop: '10px' }}>{t('plantation_map_title')}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>{t('plantation_map_desc')}</p>
              
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
                  {t('plantation_map_instruction')}
                </div>
              </div>

              {/* Coordinates Readout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '16px', border: '1px solid #eee' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('plantation_map_lat')}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{coords.lat.toFixed(6)}</div>
                </div>
                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '16px', border: '1px solid #eee' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('plantation_map_lng')}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{coords.lng.toFixed(6)}</div>
                </div>
              </div>

              <button 
                onClick={() => setShowMapPicker(false)}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '18px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(12, 166, 120, 0.2)' }}>
                {t('plantation_map_confirm_btn')}
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
