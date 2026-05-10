import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Bell,
  ChevronDown,
  Factory,
  Globe,
  GraduationCap,
  Layout,
  Leaf,
  Menu,
  Shield,
  ShoppingCart,
  TreeDeciduous,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../utils/assets';
import AdSpace from './AdSpace';
import { useLanguage } from '../context/LanguageContext';
import { useWeb3 } from '../context/Web3Context';

const navLinkStyle = {
  fontSize: '0.85rem',
  color: '#555',
  textDecoration: 'none',
  fontWeight: '500',
};

const Navbar = () => {
  const [showBambooMenu, setShowBambooMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { language, toggleLanguage, t } = useLanguage();
  const { walletAddress, isConnected, connectWallet } = useWeb3();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 1100;
  const shortAddress = walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : '';

  const bambooNusaFeatures = [
    { key: 'nav_bc_overview', label: 'Overview', path: '/bamboochain', icon: <Layout size={16} /> },
    { key: 'nav_bc_plantation', label: 'Plantation', path: '/bamboochain/plantation', icon: <TreeDeciduous size={16} /> },
    { key: 'nav_bc_supply_chain', label: 'Supply Chain', path: '/bamboochain/supply-chain', icon: <Truck size={16} /> },
    { key: 'nav_bc_build', label: 'Build', path: '/bamboochain/build', icon: <Factory size={16} /> },
    { key: 'nav_bc_token_wallet', label: 'Token & Wallet', path: '/bamboochain/token-wallet', icon: <Wallet size={16} /> },
    { key: 'nav_bc_carbon_impact', label: 'Carbon Impact', path: '/bamboochain/carbon-impact', icon: <Leaf size={16} /> },
    { key: 'nav_marketplace', label: 'Marketplace', path: '/bamboochain/marketplace', icon: <ShoppingCart size={16} /> },
    { key: 'nav_bc_dao', label: 'DAO & Community', path: '/bamboochain/dao', icon: <Users size={16} /> },
    { key: 'nav_academy', label: 'Academy', path: '/bamboochain/academy', icon: <GraduationCap size={16} /> },
    { key: 'nav_bc_data_analytics', label: 'Data Analytics', path: '/bamboochain/data-analytics', icon: <BarChart3 size={16} /> },
    { key: 'nav_bc_invest', label: 'Invest Ecosystem', path: '/bamboochain/invest', icon: <TrendingUp size={16} /> },
  ];

  const primaryLinks = [
    { key: 'nav_home', label: 'Beranda', path: '/' },
    { key: 'nav_projects', label: 'Proyek', path: '/projects' },
    { key: 'nav_insights', label: 'Wawasan', path: '/insight' },
    { key: 'nav_impact', label: 'Dampak', path: '/impact' },
    { key: 'nav_partners', label: 'Mitra', path: '/partners' },
    { key: 'nav_about', label: 'Tentang Kami', path: '/about' },
    { key: 'nav_contact', label: 'Kontak', path: '/contact' },
    { key: 'nav_faq', label: 'FAQ', path: '/faq' },
  ];

  const secondaryLinks = [
    { key: 'nav_bambupedia', label: 'Bambupedia', path: '/bambupedia' },
    { key: 'nav_academy', label: 'Akademi', path: '/academy' },
    { key: 'nav_datatools', label: 'Data & Alat', path: '/data-tools' },
    { key: 'nav_marketplace', label: 'Pasar', path: '/bamboochain/marketplace' },
    { key: 'nav_community', label: 'Komunitas', path: '/community' },
  ];

  const mobileMenuItems = [
    ...primaryLinks,
    ...secondaryLinks,
    ...bambooNusaFeatures,
    { key: 'nav_careers', label: 'Karir', path: '/careers' },
    { key: 'nav_membership', label: 'Keanggotaan', path: '/membership' },
    { key: 'nav_onchain', label: 'On-Chain', path: '/transparency' },
  ];

  const labelFor = (item) => (item.key ? t(item.key) : item.label);

  return (
    <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 10000, background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      {isMobile ? (
        <div style={{ width: '100%' }}>
          <div style={{ height: '70px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img src={getAssetUrl('logo-ysnj2.png')} alt="Logo" style={{ height: '35px' }} />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button onClick={toggleLanguage} aria-label="Toggle language" style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                <Globe size={22} />
                {language.toUpperCase()}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', padding: '6px', cursor: 'pointer' }}>
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div style={{ position: 'fixed', top: '70px', left: 0, width: '100%', height: 'calc(100vh - 70px)', background: 'white', zIndex: 10001, overflowY: 'auto', padding: '20px', boxSizing: 'border-box' }}>
              <button onClick={connectWallet} style={{ width: '100%', background: '#f59f00', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 'bold', marginBottom: '20px', cursor: 'pointer' }}>
                {isConnected ? shortAddress : t('nav_connect')}
              </button>
              {mobileMenuItems.map((item) => (
                <Link key={`${item.path}-${item.key}`} to={item.path} onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'block', padding: '15px 0', borderBottom: '1px solid #eee', color: '#333', textDecoration: 'none', fontWeight: '600' }}>
                  {labelFor(item)}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#f8f9fa', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #eee' }}>
            <AdSpace type="horizontal" size="compact" height="25px" />
          </div>

          <div style={{ background: 'white', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '25px', padding: '0 32px', borderBottom: '1px solid #f1f3f5' }}>
            {secondaryLinks.map((item) => (
              <Link key={item.key} to={item.path} style={navLinkStyle}>
                {labelFor(item)}
              </Link>
            ))}

            <div
              onMouseEnter={() => setShowBambooMenu(true)}
              onMouseLeave={() => setShowBambooMenu(false)}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', height: '100%' }}
            >
              {t('nav_bamboochain')} <ChevronDown size={14} />
              {showBambooMenu && (
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'white', boxShadow: '0 15px 40px rgba(0,0,0,0.15)', borderRadius: '0 0 16px 16px', padding: '10px', zIndex: 10005, border: '1px solid #eee' }}>
                  {bambooNusaFeatures.map((feature) => (
                    <Link
                      key={feature.path}
                      to={feature.path}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', color: '#333', textDecoration: 'none', borderRadius: '8px', transition: 'all 0.2s' }}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.background = '#f0fdf4';
                        event.currentTarget.style.color = 'var(--primary)';
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.background = 'transparent';
                        event.currentTarget.style.color = '#333';
                      }}
                    >
                      <span style={{ color: 'var(--primary)' }}>{feature.icon}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{labelFor(feature)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/careers" style={navLinkStyle}>{t('nav_careers')}</Link>
            <Link to="/membership" style={{ background: 'rgba(245, 159, 0, 0.1)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', color: '#f59f00', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Shield size={14} /> {t('nav_membership')}
            </Link>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Bell size={18} color="#888" style={{ cursor: 'pointer' }} />
              <button
                onClick={connectWallet}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e7f5ff', border: 'none', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', color: '#228be6', cursor: 'pointer', fontWeight: '600' }}
              >
                <Globe size={14} /> Google <span style={{ color: '#444' }}>{isConnected ? shortAddress : 'xe4d5...4b9e'}</span>
              </button>
            </div>
          </div>

          <div style={{ padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link to="/"><img src={getAssetUrl('logo-ysnj2.png')} style={{ height: '45px' }} alt="Logo" /></Link>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <img key={i} src={getAssetUrl(`logos/logo${i}.png`)} style={{ height: '22px' }} alt="mitra" />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              {primaryLinks.map((item) => (
                <Link key={item.key} to={item.path} style={{ fontWeight: '600', color: '#444', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(event) => { event.currentTarget.style.color = 'var(--primary)'; }} onMouseLeave={(event) => { event.currentTarget.style.color = '#444'; }}>
                  {labelFor(item)}
                </Link>
              ))}

              <Link to="/transparency" style={{ color: 'white', background: 'var(--primary)', fontWeight: 'bold', padding: '8px 20px', borderRadius: '30px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(12, 166, 120, 0.3)' }}>
                {t('nav_onchain')}
              </Link>

              <div style={{ borderLeft: '2px solid #f1f3f5', height: '24px', margin: '0 5px' }} />

              <button onClick={toggleLanguage} style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold' }}>
                <Globe size={20} />
                <span style={{ fontSize: '0.9rem' }}>{language.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
