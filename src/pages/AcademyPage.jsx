import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { getUserTier, getBMCNumber } from './MembershipPage';
import { Lock, BookOpen, Play, FileText, TrendingUp, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const COURSES = [
  {
    tier: 'seed',
    icon: '📗',
    title: 'Pengantar Industri Bambu Global',
    desc: 'Memahami potensi bambu sebagai material masa depan, rantai nilai dari hulu ke hilir, dan posisi Indonesia di pasar global.',
    lessons: 8, duration: '2 jam',
  },
  {
    tier: 'seed',
    icon: '🌍',
    title: 'Pasar Bambu: Peluang & Tantangan',
    desc: 'Analisis permintaan global, negara importir utama, tren harga bambu olahan, dan segmen pasar yang paling menjanjikan.',
    lessons: 6, duration: '1.5 jam',
  },
  {
    tier: 'guardian',
    icon: '🏗️',
    title: 'Bambu Laminasi & Konstruksi Hijau',
    desc: 'Material bambu engineered, standar konstruksi internasional, studi kasus bangunan berbasis bambu di Asia & Eropa.',
    lessons: 10, duration: '3 jam',
  },
  {
    tier: 'guardian',
    icon: '💹',
    title: 'Analisis Financial & ROI Kebun Bambu',
    desc: 'Perhitungan biaya produksi, estimasi pendapatan per hektar, break-even analysis, dan proyeksi 10 tahun.',
    lessons: 7, duration: '2.5 jam',
  },
  {
    tier: 'builder',
    icon: '🤝',
    title: 'Partnership & Offtake Agreement',
    desc: 'Strategi negosiasi dengan buyer internasional, struktur perjanjian offtake, due diligence mitra strategis.',
    lessons: 5, duration: '2 jam',
  },
  {
    tier: 'builder',
    icon: '🌱',
    title: 'Carbon Credit dari Perkebunan Bambu',
    desc: 'Metodologi penghitungan serapan karbon, proses sertifikasi VCS, monetisasi carbon credit di pasar internasional.',
    lessons: 9, duration: '3.5 jam',
  },
];

const tierLabel = { seed: '🌱 Green Seed', guardian: '🎋 Guardian', builder: '🌿 Builder' };
const tierColor = { seed: '#40c057', guardian: '#1c7ed6', builder: '#f59f00' };

const AcademyPage = () => {
  const { t } = useLanguage();
  const { walletAddress, bmcBalance, isConnected, openWalletModal } = useWeb3();
  const userTier = getUserTier(bmcBalance);
  const bmcNum = getBMCNumber(bmcBalance);

  const tierRank = { null: 0, seed: 1, guardian: 2, builder: 3 };
  const canAccess = (courseTier) => tierRank[userTier] >= tierRank[courseTier];

  return (
    <div style={{ paddingTop: '160px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12,166,120,0.1)', padding: '6px 16px', borderRadius: '20px', marginBottom: '20px' }}>
            <BookOpen size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)' }}>{t('academy_badge')}</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '16px' }}>{t('academy_h1')}</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            {t('academy_desc')}
          </p>
        </div>

        {/* Status */}
        {!isConnected ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', marginBottom: '40px', border: '2px dashed #dee2e6' }}>
            <Lock size={40} color="#adb5bd" style={{ marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '12px' }}>{t('academy_connect_title')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{t('academy_connect_desc')}</p>
            <button onClick={openWalletModal} className="btn btn-primary" style={{ padding: '14px 32px' }}>{t('academy_connect_btn')}</button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Leaf size={20} color="var(--primary)" />
              <span>{t('academy_balance_label')} <strong style={{ color: 'var(--primary)' }}>{bmcBalance ?? '0'} BMC</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {userTier ? (
                <span style={{ background: `${tierColor[userTier]}20`, color: tierColor[userTier], padding: '4px 14px', borderRadius: '20px', fontWeight: '700', fontSize: '0.88rem' }}>
                  {tierLabel[userTier]} {t('academy_tier_active')}
                </span>
              ) : (
                <span style={{ color: '#e03131', fontSize: '0.9rem' }}>{t('academy_need_greenseed')}</span>
              )}
              <Link to="/membership" style={{ fontSize: '0.82rem', color: 'var(--primary)', textDecoration: 'underline' }}>{t('academy_upgrade_link')}</Link>
            </div>
          </div>
        )}

        {/* Course Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {COURSES.map((course, i) => {
            const accessible = canAccess(course.tier);
            return (
              <div key={i} style={{
                background: 'white',
                borderRadius: '16px',
                border: `1px solid ${accessible ? tierColor[course.tier] + '40' : '#eee'}`,
                overflow: 'hidden',
                opacity: !isConnected ? 0.7 : 1,
                transition: 'all 0.2s',
                boxShadow: accessible ? `0 4px 16px ${tierColor[course.tier]}20` : 'none',
              }}>
                {/* Top bar */}
                <div style={{ height: '4px', background: accessible ? tierColor[course.tier] : '#dee2e6' }} />
                <div style={{ padding: '24px' }}>
                  {/* Tier badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: tierColor[course.tier], background: `${tierColor[course.tier]}15`, padding: '3px 10px', borderRadius: '20px' }}>
                      {tierLabel[course.tier]}
                    </span>
                    {!accessible && isConnected && (
                      <Lock size={16} color="#adb5bd" />
                    )}
                    {accessible && (
                      <span style={{ fontSize: '0.75rem', color: '#40c057', fontWeight: '600' }}>{t('academy_available')}</span>
                    )}
                  </div>

                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{course.icon}</div>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '8px', color: 'var(--text-main)' }}>{course.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>{course.desc}</p>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <span>📚 {course.lessons} {t('academy_lessons')}</span>
                    <span>⏱ {course.duration}</span>
                  </div>

                  {accessible ? (
                    <button className="btn btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.88rem', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={15} /> {t('academy_btn_start')}
                    </button>
                  ) : (
                    <Link to="/membership" style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#f1f3f5', borderRadius: '50px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      🔒 {t('academy_btn_need').replace('{tier}', tierLabel[course.tier])}
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

export default AcademyPage;
