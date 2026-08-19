import React, { useState } from 'react';
import { Leaf, Search, DollarSign, CloudRain, ShieldCheck, Factory, AlertTriangle, ArrowRight, Loader } from 'lucide-react';
import { fetchWanipiroAnalysis } from '../utils/wanipiroService';
import { useLanguage } from '../context/LanguageContext';

const WanipiroPage = () => {
  const { language } = useLanguage();
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await fetchWanipiroAnalysis(inputQuery, language);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Gagal menganalisis data. Pastikan API Key OpenAI sudah terpasang di environment.');
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
            <Leaf size={32} />
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '10px' }}>Wanipiro AI</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            {language === 'id' 
              ? 'Agen Intelijen AI untuk mengalkulasi jejak karbon dan valuasi ekonomi komoditas secara real-time.' 
              : 'AI Intelligence Agent to calculate carbon footprint and economic valuation of commodities in real-time.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* Input Panel */}
          <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', alignSelf: 'start' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={20} color="var(--primary)" />
              {language === 'id' ? 'Kueri Analisis' : 'Analysis Query'}
            </h2>
            
            <form onSubmit={handleAnalyze}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {language === 'id' ? 'Apa yang ingin Anda hitung?' : 'What do you want to calculate?'}
                </label>
                <textarea 
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={language === 'id' ? "Contoh: Hitung nilai karbon dan harga 100 kg baja strip untuk ekspor..." : "Example: Calculate carbon value and price of 100 kg steel..."}
                  style={{ width: '100%', height: '120px', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.95rem', resize: 'none' }}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading || !inputQuery.trim()}
                style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: (isLoading || !inputQuery.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: (isLoading || !inputQuery.trim()) ? 0.7 : 1, transition: 'all 0.2s' }}
              >
                {isLoading ? <Loader className="spin" size={20} /> : <CloudRain size={20} />}
                {isLoading ? (language === 'id' ? 'Menganalisis...' : 'Analyzing...') : (language === 'id' ? 'Mulai Analisis' : 'Start Analysis')}
              </button>
            </form>
            
            <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(245, 159, 0, 0.1)', borderRadius: '12px', border: '1px solid rgba(245, 159, 0, 0.2)' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#d97706', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} /> {language === 'id' ? 'Terhubung ke Live Web' : 'Live Web Connected'}
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#b45309', lineHeight: '1.5', margin: 0 }}>
                {language === 'id' 
                  ? 'AI akan secara otomatis menarik data pasar dan referensi faktor emisi terbaru dari portal berita kredibel.' 
                  : 'AI will automatically pull the latest market data and emission factor references from credible news portals.'}
              </p>
            </div>
          </div>

          {/* Result Panel */}
          <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', minHeight: '400px' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Factory size={20} color="var(--primary)" />
              {language === 'id' ? 'Laporan LCA & Valuasi' : 'LCA & Valuation Report'}
            </h2>
            
            {error && (
              <div style={{ padding: '15px', background: '#fff0f0', color: '#e03131', borderRadius: '12px', border: '1px solid #ffc9c9', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <AlertTriangle size={18} /> {error}
              </div>
            )}
            
            {!result && !error && !isLoading && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', opacity: 0.6, marginTop: '50px' }}>
                <ArrowRight size={48} style={{ marginBottom: '15px' }} />
                <p>{language === 'id' ? 'Masukkan kueri di sebelah kiri untuk melihat hasil' : 'Enter a query on the left to see results'}</p>
              </div>
            )}
            
            {result && (
              <div className="fade-in">
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                  {result.product}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ background: 'rgba(12, 166, 120, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(12, 166, 120, 0.1)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CloudRain size={14} color="var(--primary)" /> {language === 'id' ? 'Total Emisi' : 'Total Emissions'}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                      {result.carbon_emissions.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>{result.carbon_unit}</span>
                    </div>
                  </div>
                  
                  <div style={{ background: 'rgba(51, 154, 240, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(51, 154, 240, 0.1)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <DollarSign size={14} color="#339af0" /> {language === 'id' ? 'Nilai Moneter' : 'Monetary Value'}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#339af0' }}>
                      {result.currency === 'USD' ? '$' : 'Rp'}{result.monetary_value.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', marginBottom: '25px' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '10px' }}>{language === 'id' ? 'Rincian Perhitungan (Explainability)' : 'Calculation Breakdown'}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>
                    {result.breakdown}
                  </p>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{language === 'id' ? 'Sumber Data:' : 'Data Sources:'}</span>
                  {result.data_sources?.map((src, idx) => (
                    <span key={idx} style={{ background: 'var(--border-color)', padding: '4px 10px', borderRadius: '20px', color: 'var(--text-muted)' }}>
                      {src}
                    </span>
                  ))}
                </div>
                
                {result.confidence_interval && (
                  <div style={{ marginTop: '15px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    * Interval Kepercayaan Valuasi: {result.confidence_interval[0]} - {result.confidence_interval[1]}
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.4s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default WanipiroPage;
