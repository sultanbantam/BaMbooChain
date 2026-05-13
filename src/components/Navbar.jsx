import React, { useState, useEffect } from 'react';
import { 
  Globe, Bell, ChevronDown, Menu, X, Shield, Layout, TreeDeciduous, 
  Truck, Factory, Wallet, Leaf, ShoppingCart, Users, GraduationCap, 
  BarChart3, TrendingUp, User, LogOut, Settings
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAssetUrl } from '../utils/assets';
import AdSpace from './AdSpace';
import { useLanguage } from '../context/LanguageContext';
import { useWeb3 } from '../context/Web3Context';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [showBambooMenu, setShowBambooMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const { language, toggleLanguage, t } = useLanguage();
  const { walletAddress, isConnected, connectWallet } = useWeb3();
  const { user, isAuthenticated, openLoginModal, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 1100;
  const shortAddress = walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : '';

  const bambooNusaFeatures = [
    { label: t('nav_bc_overview') || 'Overview', path: '/bamboochain', icon: <Layout size={16} /> },
    { label: t('nav_bc_plantation') || 'Plantation', path: '/bamboochain/plantation', icon: <TreeDeciduous size={16} /> },
    { label: t('nav_bc_supply_chain') || 'Supply Chain', path: '/bamboochain/supply-chain', icon: <Truck size={16} /> },
    { label: t('nav_bc_build') || 'Build', path: '/bamboochain/build', icon: <Factory size={16} /> },
    { label: t('nav_bc_token_wallet') || 'Token & Wallet', path: '/bamboochain/token-wallet', icon: <Wallet size={16} /> },
    { label: t('nav_bc_carbon_impact') || 'Carbon Impact', path: '/bamboochain/carbon-impact', icon: <Leaf size={16} /> },
    { label: t('nav_marketplace') || 'Marketplace', path: '/bamboochain/marketplace', icon: <ShoppingCart size={16} /> },
    { label: t('nav_bc_dao') || 'DAO & Community', path: '/bamboochain/dao', icon: <Users size={16} /> },
    { label: t('nav_academy') || 'Academy', path: '/bamboochain/academy', icon: <GraduationCap size={16} /> },
    { label: t('nav_bc_data_analytics') || 'Data Analytics', path: '/bamboochain/data-analytics', icon: <BarChart3 size={16} /> },
    { label: t('nav_bc_invest') || 'Invest Ecosystem', path: '/bamboochain/invest', icon: <TrendingUp size={16} /> },
  ];

  const primaryLinks = [
    { label: t('nav_home') || 'Beranda', path: '/' },
    { label: t('nav_projects') || 'Proyek', path: '/projects' },
    { label: t('nav_insights') || 'Wawasan', path: '/insight' },
    { label: t('nav_impact') || 'Dampak', path: '/impact' },
    { label: t('nav_partners') || 'Mitra', path: '/partners' },
    { label: t('nav_about') || 'Tentang Kami', path: '/about' },
    { label: t('nav_contact') || 'Kontak', path: '/contact' },
    { label: t('nav_faq') || 'FAQ', path: '/faq' },
  ];

  const secondaryLinks = [
    { label: t('nav_bambupedia') || 'Bambupedia', path: '/bambupedia' },
    { label: t('nav_academy_main') || 'Akademi', path: '/academy' },
    { label: t('nav_datatools') || 'Data & Alat', path: '/data-tools' },
    { label: t('nav_marketplace_short') || 'Pasar', path: '/bamboochain/marketplace' },
    { label: t('nav_community') || 'Komunitas', path: '/community' },
  ];

  const mobileMenuItems = [
    ...primaryLinks,
    ...secondaryLinks,
    ...bambooNusaFeatures,
    { label: t('nav_careers') || 'Karir', path: '/careers' },
    { label: t('nav_membership') || 'Keanggotaan', path: '/membership' },
    { label: t('nav_onchain') || 'On-Chain', path: '/transparency' },
  ];

  return (
    <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 10000, background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      {isMobile ? (
        <div style={{ width: '100%' }}>
          {/* Mobile Top Bar */}
          <div style={{ height: '70px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img src={getAssetUrl('logo-ysnj2.png')} alt="Logo" style={{ height: '40px' }} />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={toggleLanguage} 
                style={{ background: 'rgba(12, 166, 120, 0.1)', border: 'none', color: 'var(--primary)', padding: '8px 12px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}
              >
                <Globe size={18} />
                {language.toUpperCase()}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                style={{ background: 'var(--primary)', border: 'none', borderRadius: '12px', color: 'white', padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Drawer */}
          {isMobileMenuOpen && (
            <div style={{ position: 'fixed', top: '70px', left: 0, width: '100%', height: 'calc(100vh - 70px)', background: 'white', zIndex: 10001, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
              
              {/* Profile/Login Section */}
              <div style={{ marginBottom: '25px' }}>
                {isAuthenticated ? (
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                      <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'default'}`} alt="avatar" style={{ width: '50px', height: '50px', borderRadius: '15px', border: '2px solid var(--primary)' }} />
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user?.name || 'User'}</div>
                        <div style={{ fontSize: '0.85rem', color: '#888' }}>{user?.email || 'Member BaMbooChain'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'white', color: '#333', border: '1px solid #ddd', padding: '10px', borderRadius: '12px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>Profile</Link>
                      <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} style={{ background: '#fff0f0', color: '#e03131', border: '1px solid #ffc9c9', padding: '10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>Logout</button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); openLoginModal(); }} 
                    style={{ width: '100%', background: 'linear-gradient(135deg, #f59f00 0%, #e67700 100%)', color: 'white', border: 'none', padding: '18px', borderRadius: '18px', fontWeight: 'bold', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 8px 20px rgba(245, 159, 0, 0.2)' }}
                  >
                    <User size={22} /> {t('nav_login_join') || 'Masuk / Daftar'}
                  </button>
                )}
              </div>

              {/* Menu Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {mobileMenuItems.map((item, idx) => (
                  <Link 
                    key={idx} 
                    to={item.path} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', color: '#333', textDecoration: 'none', fontWeight: '600', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: 'var(--primary)', opacity: 0.7 }}>{item.icon || <ArrowRight size={18} />}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
              
              <div style={{ height: '50px' }} /> {/* Spacer */}
            </div>
          )}
        </div>
      ) : (
        /* Desktop Navbar */
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#f8f9fa', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #eee' }}>
            <AdSpace type="horizontal" size="compact" height="25px" />
          </div>

          <div style={{ background: 'white', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '25px', padding: '0 32px', borderBottom: '1px solid #f1f3f5' }}>
            {secondaryLinks.map((item, idx) => (
              <Link key={idx} to={item.path} style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none', fontWeight: '500' }}>
                {item.label}
              </Link>
            ))}

            <div 
              onMouseEnter={() => setShowBambooMenu(true)} 
              onMouseLeave={() => setShowBambooMenu(false)} 
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', height: '100%' }}
            >
              {t('nav_bamboochain') || 'BaMbooChain'} <ChevronDown size={14} />
              {showBambooMenu && (
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'white', boxShadow: '0 15px 40px rgba(0,0,0,0.15)', borderRadius: '0 0 16px 16px', padding: '10px', zIndex: 10005, border: '1px solid #eee' }}>
                  {bambooNusaFeatures.map((feature, idx) => (
                    <Link
                      key={idx}
                      to={feature.path}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', color: '#333', textDecoration: 'none', borderRadius: '8px', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = 'var(--primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#333'; }}
                    >
                      <span style={{ color: 'var(--primary)' }}>{feature.icon}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{feature.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/careers" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none', fontWeight: '500' }}>{t('nav_careers') || 'Karir'}</Link>
            <Link to="/membership" style={{ background: 'rgba(245, 159, 0, 0.1)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', color: '#f59f00', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Shield size={14} /> {t('nav_membership') || 'Keanggotaan'}
            </Link>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Bell size={18} color="#888" style={{ cursor: 'pointer' }} />
              
              {isAuthenticated ? (
                <div 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', border: '1px solid var(--primary)', position: 'relative' }}
                >
                  <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'default'}`} alt="avatar" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                  {user?.name?.split(' ')[0] || 'User'}
                  
                  {showProfileMenu && (
                    <div style={{ position: 'absolute', top: '40px', right: '0', width: '200px', background: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', borderRadius: '16px', overflow: 'hidden', zIndex: 10006, border: '1px solid #eee' }}>
                      <Link to="/profile" style={{ display: 'block', padding: '12px 16px', color: '#333', textDecoration: 'none', borderBottom: '1px solid #eee' }}>👤 {t('nav_profile') || 'Profil'}</Link>
                      <button onClick={(e) => { e.stopPropagation(); logout(); setShowProfileMenu(false); }} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: 'white', border: 'none', color: '#e03131', cursor: 'pointer', fontWeight: 'bold' }}>🚪 {t('nav_logout') || 'Keluar'}</button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={openLoginModal}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e7f5ff', border: 'none', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', color: '#228be6', cursor: 'pointer', fontWeight: '600' }}
                >
                  <User size={14} /> {t('nav_login_join') || 'Masuk / Daftar'}
                </button>
              )}
              
              <div onClick={toggleLanguage} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold' }}>
                <Globe size={18} />
                <span style={{ fontSize: '0.9rem' }}>{language.toUpperCase()}</span>
              </div>
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
              {primaryLinks.map((item, idx) => (
                <Link key={idx} to={item.path} style={{ fontWeight: '600', color: '#444', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
                  {item.label}
                </Link>
              ))}
              
              <Link to="/transparency" style={{ color: 'white', background: 'var(--primary)', fontWeight: 'bold', padding: '8px 20px', borderRadius: '30px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(12, 166, 120, 0.3)' }}>
                {t('nav_transparency') || 'On-Chain'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
