import React, { useState, useEffect } from 'react';
import { Globe, Bell, ChevronDown, Menu, X, Shield, Layout, TreeDeciduous, Truck, Factory, Wallet, Leaf, ShoppingCart, Users, GraduationCap, BarChart3, TrendingUp } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';
import { Link, useNavigate } from 'react-router-dom';
import AdSpace from './AdSpace';
import { useLanguage } from '../context/LanguageContext';
import { useWeb3 } from '../context/Web3Context';

const Navbar = () => {
  const [showBambooMenu, setShowBambooMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { language, toggleLanguage } = useLanguage();
  const { walletAddress, isConnected, connectWallet } = useWeb3();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 1100;
  const shortAddress = walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : '';

  const bambooNusaFeatures = [
    { label: 'Overview', path: '/bamboochain', icon: <Layout size={16} /> },
    { label: 'Plantation', path: '/bamboochain/plantation', icon: <TreeDeciduous size={16} /> },
    { label: 'Supply Chain', path: '/bamboochain/supply-chain', icon: <Truck size={16} /> },
    { label: 'Build', path: '/bamboochain/build', icon: <Factory size={16} /> },
    { label: 'Token & Wallet', path: '/bamboochain/token-wallet', icon: <Wallet size={16} /> },
    { label: 'Carbon Impact', path: '/bamboochain/carbon-impact', icon: <Leaf size={16} /> },
    { label: 'Marketplace', path: '/bamboochain/marketplace', icon: <ShoppingCart size={16} /> },
    { label: 'DAO & Community', path: '/bamboochain/dao', icon: <Users size={16} /> },
    { label: 'Academy', path: '/bamboochain/academy', icon: <GraduationCap size={16} /> },
    { label: 'Data Analytics', path: '/bamboochain/data-analytics', icon: <BarChart3 size={16} /> },
    { label: 'Invest Ecosystem', path: '/bamboochain/invest', icon: <TrendingUp size={16} /> },
  ];

  const mobileMenuItems = [
    { label: 'Beranda', path: '/' },
    { label: 'Proyek', path: '/projects' },
    { label: 'Wawasan', path: '/insight' },
    { label: 'Dampak', path: '/impact' },
    { label: 'Mitra', path: '/partners' },
    { label: 'Tentang Kami', path: '/about' },
    { label: 'Kontak', path: '/contact' },
    { label: 'Bambupedia', path: '/bambupedia' },
    { label: 'Akademi', path: '/academy' },
    { label: 'Data & Alat', path: '/data-tools' },
    { label: 'Pasar', path: '/bamboochain/marketplace' },
    { label: 'Komunitas', path: '/community' },
    ...bambooNusaFeatures,
    { label: 'Karir', path: '/careers' },
    { label: 'Keanggotaan', path: '/membership' },
    { label: 'FAQ', path: '/faq' },
    { label: 'On-Chain ⛓️', path: '/transparency' },
  ];

  return (
    <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 10000, background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      {isMobile ? (
        /* ────────── MOBILE NAVBAR ────────── */
        <div style={{ width: '100%' }}>
          <div style={{ height: '70px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img src={getAssetUrl('logo-ysnj2.png')} alt="Logo" style={{ height: '35px' }} />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
               <Globe size={22} color="var(--primary)" onClick={toggleLanguage} />
               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', padding: '6px' }}>
                 {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
               </button>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div style={{ position: 'fixed', top: '70px', left: 0, width: '100%', height: 'calc(100vh - 70px)', background: 'white', zIndex: 10001, overflowY: 'auto', padding: '20px' }}>
               <button onClick={connectWallet} style={{ width: '100%', background: '#f59f00', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 'bold', marginBottom: '20px' }}>
                 {isConnected ? shortAddress : 'Connect Wallet'}
               </button>
               {mobileMenuItems.map((item, idx) => (
                 <Link key={idx} to={item.path} onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'block', padding: '15px 0', borderBottom: '1px solid #eee', color: '#333', textDecoration: 'none', fontWeight: '600' }}>{item.label}</Link>
               ))}
            </div>
          )}
        </div>
      ) : (
        /* ────────── DESKTOP NAVBAR ────────── */
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* Row 1: Ad Space */}
          <div style={{ background: '#f8f9fa', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #eee' }}>
            <AdSpace type="horizontal" size="compact" height="25px" />
          </div>

          {/* Row 2: Top Menu Bar */}
          <div style={{ background: 'white', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '25px', padding: '0 32px', borderBottom: '1px solid #f1f3f5' }}>
            <Link to="/bambupedia" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none', fontWeight: '500' }}>Bambupedia</Link>
            <Link to="/academy" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none', fontWeight: '500' }}>Akademi</Link>
            <Link to="/data-tools" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none', fontWeight: '500' }}>Data & Alat</Link>
            <Link to="/bamboochain/marketplace" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none', fontWeight: '500' }}>Pasar</Link>
            <Link to="/community" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none', fontWeight: '500' }}>Komunitas</Link>
            
            {/* bambuNUSA DROPDOWN (11 Features) */}
            <div 
              onMouseEnter={() => setShowBambooMenu(true)} 
              onMouseLeave={() => setShowBambooMenu(false)} 
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', height: '100%' }}
            >
              bambuNUSA <ChevronDown size={14} />
              {showBambooMenu && (
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'white', boxShadow: '0 15px 40px rgba(0,0,0,0.15)', borderRadius: '0 0 16px 16px', padding: '10px', zIndex: 10005, border: '1px solid #eee' }}>
                   {bambooNusaFeatures.map((feature, index) => (
                     <Link 
                       key={index} 
                       to={feature.path} 
                       style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', color: '#333', textDecoration: 'none', borderRadius: '8px', transition: 'all 0.2s' }}
                       onMouseEnter={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = 'var(--primary)'; }}
                       onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#333'; }}
                     >
                       <span style={{ color: 'var(--primary)' }}>{feature.icon}</span>
                       <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{feature.label}</span>
                     </Link>
                   ))}
                </div>
              )}
            </div>

            <Link to="/careers" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none' }}>Karir</Link>
            <Link to="/membership" style={{ background: 'rgba(245, 159, 0, 0.1)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', color: '#f59f00', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Shield size={14} /> Keanggotaan
            </Link>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Bell size={18} color="#888" style={{ cursor: 'pointer' }} />
              <div 
                onClick={connectWallet}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e7f5ff', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', color: '#228be6', cursor: 'pointer', fontWeight: '600' }}
              >
                <Globe size={14} /> Google <span style={{ color: '#444' }}>{isConnected ? shortAddress : 'xe4d5...4b9e'}</span>
              </div>
            </div>
          </div>

          {/* Row 3: Bottom Navigation Bar */}
          <div style={{ padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link to="/"><img src={getAssetUrl('logo-ysnj2.png')} style={{ height: '45px' }} alt="Logo" /></Link>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1,2,3,4,5,6,7,8,9].map(i => (
                  <img key={i} src={`${import.meta.env.BASE_URL}logos/logo${i}.png`} style={{ height: '22px' }} alt="mitra" />
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
               {[
                 { label: 'Beranda', path: '/' },
                 { label: 'Proyek', path: '/projects' },
                 { label: 'Wawasan', path: '/insight' },
                 { label: 'Dampak', path: '/impact' },
                 { label: 'Mitra', path: '/partners' },
                 { label: 'Tentang Kami', path: '/about' },
                 { label: 'Kontak', path: '/contact' },
                 { label: 'FAQ', path: '/faq' }
               ].map(item => (
                 <Link key={item.label} to={item.path} style={{ fontWeight: '600', color: '#444', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
                   {item.label}
                 </Link>
               ))}
               
               <Link to="/transparency" style={{ color: 'white', background: 'var(--primary)', fontWeight: 'bold', padding: '8px 20px', borderRadius: '30px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(12, 166, 120, 0.3)' }}>
                 On-Chain ⛓️
               </Link>
               
               <div style={{ borderLeft: '2px solid #f1f3f5', height: '24px', margin: '0 5px' }} />
               
               <div onClick={toggleLanguage} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold' }}>
                 <Globe size={20} />
                 <span style={{ fontSize: '0.9rem' }}>{language.toUpperCase()}</span>
               </div>
            </div>
          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;
