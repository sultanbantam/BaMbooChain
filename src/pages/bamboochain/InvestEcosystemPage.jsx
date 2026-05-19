import React, { useState } from 'react';
import { TrendingUp, Calculator, PieChart, Info, MapPin, Target, DollarSign, Calendar, Activity, BrainCircuit, BarChart, AlertCircle, Zap } from 'lucide-react';
import BackButton from '../../components/BackButton';

const InvestEcosystemPage = () => {
  const [investAmount, setInvestAmount] = useState(5000);
  const [investTerm, setInvestTerm] = useState(24);
  const [activePredictorTab, setActivePredictorTab] = useState('macro');

  // Unified Data for AI Intelligence
  const indicatorData = {
    macro: [
      { label: "Global Liquidity (Fed)", status: "Expansion", sentiment: "bullish" },
      { label: "Inflation (CPI/PPI)", status: "Sticky (3.2%)", sentiment: "neutral" },
      { label: "Risk Sentiment (VIX)", status: "Greed (65)", sentiment: "bullish" },
      { label: "Geopolitical Impact", status: "Neutral", sentiment: "neutral" },
    ],
    stocks: [
      { label: "GDP & Unemployment", status: "Strong Growth", sentiment: "bullish" },
      { label: "Corporate Earnings", status: "Q4 Beats", sentiment: "bullish" },
      { label: "PMI Manufacturing", status: "49.8 (Slow)", sentiment: "bearish" },
      { label: "Bond Yields (10Y)", status: "4.25% (High)", sentiment: "bearish" },
    ],
    crypto: [
      { label: "Bitcoin Halving", status: "45 Days Left", sentiment: "bullish" },
      { label: "Stablecoin Flows", status: "Inbound +3B", sentiment: "bullish" },
      { label: "MVRV Ratio", status: "1.85 (Buy Zone)", sentiment: "bullish" },
      { label: "Nasdaq Correlation", status: "0.85 (High)", sentiment: "neutral" },
    ]
  };

  // Kalkulator ROI Sederhana (Contoh mock logika)
  // Asumsi: Base APY 12% + Bonus berdasarkan lama waktu
  const baseApy = 12;
  const timeBonus = investTerm >= 36 ? 5 : (investTerm >= 24 ? 3 : 0);
  const totalApy = baseApy + timeBonus;
  
  const estimatedProfit = (investAmount * (totalApy / 100)) * (investTerm / 12);
  const totalReturn = investAmount + estimatedProfit;

  const projects = [
    { title: "Green Gold Cibarani - Phase 2", location: "Lebak, Banten", raised: "45,000", target: "100,000", apy: "12-15%", duration: "24 Bulan", img: "https://images.unsplash.com/photo-1542450530-5bfa5dfef006?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { title: "Agroforestry Cisadane", location: "Sukabumi, Jabar", raised: "120,000", target: "150,000", apy: "14-18%", duration: "36 Bulan", img: "https://images.unsplash.com/photo-1587825027984-c4476461c8f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { title: "Bamboo Pellet Factory", location: "Bandung, Jabar", raised: "15,000", target: "300,000", apy: "15-20%", duration: "48 Bulan", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-color)' }}>
      
      {/* Back Navigation */}
      <div className="container" style={{ marginBottom: '32px' }}>
        <BackButton to="/bamboochain" />
      </div>

      {/* HEADER */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>Invest bambuNUSA Ecosystem</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Investasi hijau, profit berkelanjutan. Lipatgandakan aset Anda sekaligus pulihkan bumi melalui proyek komersial bambu tersertifikasi.
        </p>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
        
        {/* ROW 1: ROI CALCULATOR & MY INVESTMENT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* ROI CALCULATOR */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <Calculator size={24} color="var(--primary)" /> ROI Calculator
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Jumlah Investasi (USDT)</label>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>${investAmount.toLocaleString()}</span>
                </div>
                <input type="range" min="100" max="50000" step="100" value={investAmount} onChange={(e) => setInvestAmount(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Durasi Kunci Waktu</label>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{investTerm} Bulan</span>
                </div>
                <input type="range" min="12" max="60" step="12" value={investTerm} onChange={(e) => setInvestTerm(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
              </div>

              <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', marginTop: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #ced4da', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated APY</span>
                  <span style={{ fontWeight: 'bold', color: '#f59f00' }}>{totalApy}% / tahun</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #ced4da', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Proyeksi Profit ({investTerm} bln)</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+${estimatedProfit.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Total Return</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)' }}>${totalReturn.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                </div>
              </div>

              <button style={{ width: '100%', background: 'var(--text-main)', color: 'white', padding: '14px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#000'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--text-main)'; }}>
                Terapkan Simulasi ke Proyek
              </button>
            </div>
          </div>

          {/* MY INVESTMENT (Portfolio) */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <PieChart size={24} color="var(--primary)" /> Portfolio Investasi
            </h3>

            {/* Dashboard Mini Portfolio */}
            <div style={{ background: 'linear-gradient(135deg, rgba(12,166,120,0.1), rgba(43,138,62,0.05))', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid rgba(12,166,120,0.2)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Aktiva Nilai</div>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)' }}>$12,500<span style={{ fontSize: '1.2rem', fontWeight: '500' }}>.00</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59f00', fontSize: '0.85rem', marginTop: '8px', fontWeight: 'bold' }}>
                <TrendingUp size={14} /> + $1,250 Unrealized Profit
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '16px' }}>Proyek Berjalan</h4>
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.95rem' }}>Green Gold Cibarani</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Lock: 24 Bulan • Berjalan: 6 Bln</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>$10,000</div>
                  <div style={{ fontSize: '0.8rem', color: '#f59f00', fontWeight: 'bold' }}>+12% APY</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.95rem' }}>Bamboo Pellet Factory</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Lock: 36 Bulan • Berjalan: 1 Bln</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>$2,500</div>
                  <div style={{ fontSize: '0.8rem', color: '#f59f00', fontWeight: 'bold' }}>+15% APY</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* PROJECTS TO INVEST */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', margin: '0 0 8px 0' }}>Proyek Tersedia</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Peluang emas pendanaan ekosistem yang telah lolos audit kelayakan.</p>
            </div>
            <button style={{ background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
              Lihat Semua Proyek
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
            {projects.map((proj, idx) => {
              const progressRaw = (parseInt(proj.raised.replace(',','')) / parseInt(proj.target.replace(',',''))) * 100;
              const progress = progressRaw > 100 ? 100 : progressRaw.toFixed(1);

              return (
                <div key={idx} style={{ background: 'var(--bg-card)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '180px', position: 'relative' }}>
                    <img src={proj.img} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {proj.location}
                    </div>
                  </div>
                  
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 16px 0', lineHeight: '1.4' }}>{proj.title}</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <TrendingUp size={12} /> Est. APY
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#f59f00' }}>{proj.apy}</div>
                      </div>
                      <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> Durasi Kunci
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{proj.duration}</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Terkumpul: <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>${proj.raised}</span></span>
                        <span style={{ color: 'var(--text-muted)' }}>Target: ${proj.target}</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)' }}></div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textAlign: 'right', marginTop: '6px' }}>
                        {progress}% Terpenuhi
                      </div>
                    </div>

                    <button style={{ marginTop: 'auto', background: 'var(--text-main)', color: 'white', padding: '14px', borderRadius: '30px', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'background 0.2s', width: '100%' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--text-main)'; }}>
                      Fund Project
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI MARKET PREDICTOR (MACRO INTELLIGENCE) - REDESIGN */}
        <div style={{ marginTop: '40px' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '32px', padding: '48px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
              <div>
                <div style={{ display: 'inline-flex', padding: '6px 12px', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '16px', alignItems: 'center', gap: '6px' }}>
                   <BrainCircuit size={14} /> Intelligence Engine 5.0
                </div>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', margin: 0, fontWeight: '900', letterSpacing: '-0.5px' }}>Market Intelligence</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '1.1rem' }}>Sinyal prediksi akurat dengan analisis 15+ indikator ekonomi global.</p>
              </div>
              <div style={{ textAlign: 'right', background: 'var(--bg-secondary)', padding: '16px 24px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: '#adb5bd', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>Market Consensus</div>
                <div style={{ color: '#12b886', fontWeight: '800', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={20} /> BULLISH TREND
                </div>
              </div>
            </div>

            {/* TAB SWITCHER */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', padding: '6px', background: 'var(--bg-secondary)', borderRadius: '16px', width: 'fit-content' }}>
              {[
                { id: 'macro', label: 'Global Macro', icon: <TrendingUp size={16}/> },
                { id: 'stocks', label: 'Equity Markets', icon: <BarChart size={16}/> },
                { id: 'crypto', label: 'Crypto / Web3', icon: <Zap size={16}/> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActivePredictorTab(tab.id)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem',
                    background: activePredictorTab === tab.id ? 'var(--bg-card)' : 'transparent',
                    color: activePredictorTab === tab.id ? 'var(--primary)' : '#868e96',
                    boxShadow: activePredictorTab === tab.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* ACTIVE TAB CONTENT */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
               {indicatorData[activePredictorTab].map((ind, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-secondary)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: '#868e96', fontWeight: '500' }}>{ind.label}</span>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: ind.sentiment === 'bullish' ? '#12b886' : ind.sentiment === 'bearish' ? '#fa5252' : '#fcc419', boxShadow: `0 0 10px ${ind.sentiment === 'bullish' ? '#12b886' : '#fcc419'}` }}></div>
                     </div>
                     <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{ind.status}</div>
                     <div style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', background: ind.sentiment === 'bullish' ? '#ebfbee' : ind.sentiment === 'bearish' ? '#fff5f5' : '#fff9db', color: ind.sentiment === 'bullish' ? '#12b886' : ind.sentiment === 'bearish' ? '#fa5252' : '#f59f00', width: 'fit-content', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {ind.sentiment}
                     </div>
                  </div>
               ))}
            </div>

            {/* PREMIUM INSIGHT BANNER */}
            <div style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center', padding: '40px', 
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '32px', color: 'white', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden'
            }}>
               <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--primary)', opacity: 0.1, filter: 'blur(60px)', borderRadius: '50%' }}></div>
               <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800' }}>
                    <AlertCircle size={28} color="#fcc419" /> Weekly Strategic Alpha
                  </h3>
                  <p style={{ margin: 0, fontSize: '1.05rem', color: '#94a3b8', lineHeight: '1.7', maxWidth: '650px' }}>
                    "Berdasarkan suku bunga The Fed yang diprediksi *pause* dan aliran *stablecoin* yang masif, Crypto cenderung <span style={{ color: '#12b886', fontWeight: 'bold' }}>bullish</span> minggu depan. Namun, tetap waspada terhadap volatilitas di sektor teknologi menjelang rilis data CPI hari Rabu."
                  </p>
               </div>
               <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px', fontWeight: '600' }}>UPGRADE TO PRO INSIGHT</div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '20px', color: '#fff' }}>50 <span style={{ fontSize: '1rem', color: 'var(--primary)' }}>BMC</span><span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 'normal' }}> / minggu</span></div>
                  <button style={{ width: '100%', background: 'linear-gradient(to right, #fcc419, #fab005)', color: '#1b5e20', border: 'none', padding: '16px', borderRadius: '30px', fontWeight: '900', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 8px 15px rgba(252, 196, 25, 0.3)', transition: 'transform 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    BUKA SINYAL PREDIKSI
                  </button>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvestEcosystemPage;
