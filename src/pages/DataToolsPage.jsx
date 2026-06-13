import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { getUserTier, getBMCNumber } from './MembershipPage';
import { BarChart2, TrendingUp, Globe, Lock, ExternalLink, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const TOOLS = [
  {
    tier: 'seed',
    icon: '📊',
    title: 'Kalkulator Produksi Bambu',
    desc: 'Hitung estimasi hasil panen, kebutuhan lahan, dan proyeksi pendapatan per musim panen.',
    type: 'Kalkulator Interaktif',
  },
  {
    tier: 'seed',
    icon: '🌐',
    title: 'Peta Sentra Bambu Indonesia',
    desc: 'Visualisasi interaktif lokasi sentra produksi, spesies dominan, dan kapasitas per provinsi.',
    type: 'Peta Interaktif',
  },
  {
    tier: 'guardian',
    icon: '💹',
    title: 'Dashboard Harga Ekspor Bambu',
    desc: 'Data harga ekspor bambu olahan per kategori produk, trend bulanan, dan perbandingan pasar.',
    type: 'Dashboard Data',
  },
  {
    tier: 'guardian',
    icon: '📈',
    title: 'ROI & Feasibility Calculator',
    desc: 'Model finansial komprehensif untuk menghitung kelayakan investasi kebun bambu skala 1–100 ha.',
    type: 'Kalkulator Finansial',
  },
  {
    tier: 'builder',
    icon: '🏢',
    title: 'Database Buyer Internasional',
    desc: 'Direktori importir dan buyer bambu dari 40+ negara lengkap dengan volume kebutuhan dan kontak.',
    type: 'Database Bisnis',
  },
  {
    tier: 'builder',
    icon: '🌿',
    title: 'Carbon Credit Estimator',
    desc: 'Hitung estimasi serapan karbon per hektar, proyeksi kredit karbon, dan potensi pendapatan VCS.',
    type: 'Analisis Karbon',
  },
];

const tierLabel = { seed: '🌱 Green Seed', guardian: '🎋 Guardian', builder: '🌿 Builder' };
const tierColor = { seed: '#40c057', guardian: '#1c7ed6', builder: '#f59f00' };

const DataToolsPage = () => {
  const { t } = useLanguage();
  const { bmcBalance, isConnected, openWalletModal } = useWeb3();
  const userTier = getUserTier(bmcBalance);
  const tierRank = { null: 0, seed: 1, guardian: 2, builder: 3 };
  const canAccess = (tier) => tierRank[userTier] >= tierRank[tier];

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

        {/* Status Wallet */}
        {!isConnected ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', marginBottom: '40px', border: '2px dashed #dee2e6' }}>
            <Lock size={40} color="#adb5bd" style={{ marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '12px' }}>{t('datatools_connect_title')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{t('datatools_connect_desc')}</p>
            <button onClick={openWalletModal} className="btn btn-primary" style={{ padding: '14px 32px' }}>{t('datatools_connect_btn')}</button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', border: '1px solid #eee' }}>
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
        )}

        {/* Tools Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {TOOLS.map((tool, i) => {
            const accessible = canAccess(tool.tier);
            return (
              <div key={i} style={{
                background: 'white', borderRadius: '16px',
                border: `1px solid ${accessible ? tierColor[tool.tier] + '40' : '#eee'}`,
                overflow: 'hidden',
                boxShadow: accessible ? `0 4px 16px ${tierColor[tool.tier]}15` : 'none',
              }}>
                <div style={{ height: '4px', background: accessible ? tierColor[tool.tier] : '#dee2e6' }} />
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: tierColor[tool.tier], background: `${tierColor[tool.tier]}15`, padding: '3px 10px', borderRadius: '20px' }}>
                      {tierLabel[tool.tier]}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: '#f1f3f5', padding: '3px 10px', borderRadius: '20px' }}>{tool.type}</span>
                  </div>
                  <div style={{ fontSize: '2.2rem', marginBottom: '12px' }}>{tool.icon}</div>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{tool.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>{tool.desc}</p>

                  {accessible ? (
                    <button className="btn btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.88rem', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp size={15} /> {t('datatools_btn_open')}
                    </button>
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
    </div>
  );
};

export default DataToolsPage;
