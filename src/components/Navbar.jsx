import React, { useState, useEffect } from 'react';
import { Globe, Bell, ChevronDown, Menu, X, Shield, Layout, TreeDeciduous, Truck, Factory, Wallet, Leaf, ShoppingCart, Users, GraduationCap, BarChart3, TrendingUp, User, Sun, Moon } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';
import { Link } from 'react-router-dom';
import AdSpace from './AdSpace';
import { useLanguage } from '../context/LanguageContext';
import { useWeb3 } from '../context/Web3Context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../firebase/config';

const Navbar = () => {
  const [showBambooMenu, setShowBambooMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const { language, changeLanguage, t } = useLanguage();
  const { walletAddress, connectWallet, isWalletModalOpen, closeWalletModal } = useWeb3();
  const { user, isAuthenticated, openLoginModal, logout, markAsRead, markAllAsRead, clearNotifications } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleXignalxSSO = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !auth.currentUser) {
      window.open('https://www.xignalx.click', '_blank');
      return;
    }
    
    try {
      const idToken = await auth.currentUser.getIdToken(true);
      const response = await fetch('/api/sso/mint-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await response.json();
      if (data.customToken) {
        window.open(`https://www.xignalx.click/auth?token=${data.customToken}`, '_blank');
      } else {
        window.open('https://www.xignalx.click', '_blank');
      }
    } catch (err) {
      console.error('SSO failed:', err);
      window.open('https://www.xignalx.click', '_blank');
    }
  };

  const userNotifications = user?.notifications || [];
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 1100;

  const bambooNusaFeatures = [
    { label: t('feature_overview'), path: '/bamboochain', icon: <Layout size={16} /> },
    { label: t('feature_plantation'), path: '/bamboochain/plantation', icon: <TreeDeciduous size={16} /> },
    { label: t('feature_supply_chain'), path: '/bamboochain/supply-chain', icon: <Truck size={16} /> },
    { label: t('feature_build'), path: '/bamboochain/build', icon: <Factory size={16} /> },
    { label: t('feature_token_wallet'), path: '/bamboochain/token-wallet', icon: <Wallet size={16} /> },
    { label: t('feature_carbon_impact'), path: '/bamboochain/carbon-impact', icon: <Leaf size={16} /> },
    { label: t('feature_marketplace'), path: '/bamboochain/marketplace', icon: <ShoppingCart size={16} /> },
    { label: t('feature_dao'), path: '/bamboochain/dao', icon: <Users size={16} /> },
    { label: t('nav_academy'), path: '/academy', icon: <GraduationCap size={16} /> },
    { label: t('feature_data_analytics'), path: '/bamboochain/data-analytics', icon: <BarChart3 size={16} /> },
    { label: t('feature_invest'), path: '/bamboochain/invest', icon: <TrendingUp size={16} /> },
    { label: t('feature_kodiba'), path: '/bamboochain/kodiba', icon: <Wallet size={16} /> },
  ];

  const mobileMenuItems = [
    { label: t('nav_home'), path: '/' },
    { label: t('nav_projects'), path: '/projects' },
    { label: 'Tobat Ekologi', path: '/tobat-ekologi' },
    { label: t('nav_insights'), path: '/insight' },
    { label: t('nav_impact'), path: '/impact' },
    { label: t('nav_partners'), path: '/partners' },
    { label: t('nav_about'), path: '/about' },
    { label: t('nav_contact'), path: '/contact' },
    { label: t('nav_bambupedia'), path: '/bambupedia' },
    { label: t('feature_academy'), path: '/bamboochain/academy' },
    { label: t('nav_datatools'), path: '/data-tools' },
    { label: 'Signal Trading', path: '#', onClick: handleXignalxSSO },
    { label: t('nav_marketplace'), path: '/bamboochain/marketplace' },
    { label: t('nav_community'), path: '/community' },
    { label: t('nav_events'), path: '/events' },
    ...bambooNusaFeatures,
    { label: t('nav_careers'), path: '/careers' },
    { label: t('nav_membership'), path: '/membership' },
    { label: t('nav_faq'), path: '/faq' },
    { label: t('nav_transparency'), path: '/transparency' },
  ];

  const wallets = [
    { name: 'MetaMask', icon: '🦊', color: '#E2761B', deepLink: 'https://metamask.app.link/dapp/' },
    { name: 'Trust Wallet', icon: '🛡️', color: '#3375BB', deepLink: 'https://link.trustwallet.com/open_url?coin_id=60&url=' },
    { name: 'Coinbase Wallet', icon: '💙', color: '#0052FF', deepLink: 'https://go.cb-w.com/dapp?cb_url=' },
    { name: 'Bitget Wallet', icon: '💹', color: '#00C8FF', deepLink: 'https://bitkeep.com/en/download' },
    { name: 'WalletConnect', icon: '🔌', color: '#3B99FC' },
  ];

  const handleWalletConnect = async (wallet) => {
    if (typeof window.ethereum !== 'undefined') {
      await connectWallet();
      closeWalletModal();
    } else if (wallet.deepLink) {
      const currentUrl = window.location.href;
      const deepLinkUrl = wallet.deepLink + currentUrl;
      window.open(deepLinkUrl, '_blank');
    } else {
      alert(t('nav_wallet_not_installed').replace('{wallet}', wallet.name));
    }
  };

  return (
    <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 10000, background: 'var(--bg-card)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', transition: 'background 0.3s ease' }}>
      {isMobile ? (
        /* ────────── MOBILE NAVBAR ────────── */
        <div style={{ width: '100%' }}>
          <div style={{ height: '70px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img src={getAssetUrl('logo-ysnj2.png')} alt="Logo" style={{ height: '35px' }} />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <button onClick={toggleTheme} className="theme-toggle-btn" title={isDark ? t('nav_theme_light') : t('nav_theme_dark')} style={{ width: '36px', height: '36px', background: 'transparent', border: 'none' }}>
                 {isDark ? <Sun size={20} color="#f59f00" /> : <Moon size={20} color="var(--primary)" />}
               </button>
               
               <div style={{ position: 'relative' }}>
                 <button 
                   onClick={() => setShowLangMenu(!showLangMenu)} 
                   style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 'bold' }}
                 >
                   <Globe size={22} />
                   <span>{language.toUpperCase()}</span>
                 </button>
                 
                 {showLangMenu && (
                   <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--bg-card)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)', overflow: 'hidden', minWidth: '120px', zIndex: 1000 }}>
                     <button onClick={() => { changeLanguage('id'); setShowLangMenu(false); }} style={{ display: 'block', width: '100%', padding: '10px 16px', background: language === 'id' ? 'rgba(12, 166, 120, 0.1)' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--text-main)' }}>🇮🇩 Indonesia</button>
                     <button onClick={() => { changeLanguage('en'); setShowLangMenu(false); }} style={{ display: 'block', width: '100%', padding: '10px 16px', background: language === 'en' ? 'rgba(12, 166, 120, 0.1)' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--text-main)' }}>🇬🇧 English</button>
                     <button onClick={() => { changeLanguage('ja'); setShowLangMenu(false); }} style={{ display: 'block', width: '100%', padding: '10px 16px', background: language === 'ja' ? 'rgba(12, 166, 120, 0.1)' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--text-main)' }}>🇯🇵 日本語</button>
                   </div>
                 )}
               </div>
               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', padding: '6px' }}>
                 {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
               </button>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div style={{ position: 'fixed', top: '70px', left: 0, width: '100%', height: 'calc(100vh - 70px)', background: 'var(--bg-color)', zIndex: 10001, overflowY: 'auto', padding: '20px', transition: 'background 0.3s ease', color: 'var(--text-main)' }}>
               {isAuthenticated ? (
                 <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{ width: '100%', background: '#f0fdf4', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '16px', borderRadius: '12px', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none' }}>
                   <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'default'}`} alt="avatar" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                   {user?.name || t('nav_profile')}
                 </Link>
               ) : (
                 <button onClick={() => { setIsMobileMenuOpen(false); openLoginModal(); }} style={{ width: '100%', background: '#f59f00', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                   <User size={20} /> {t('nav_login_join')}
                 </button>
               )}
               {isAuthenticated && (
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                   <Link to={`/portfolio/${user?.username || user?.id}`} onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', fontSize: '0.9rem' }}>
                     🌿 Passport
                   </Link>
                   <Link to="/event-organizer" onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', fontSize: '0.9rem' }}>
                     📅 Event Organizer
                   </Link>
                   <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', fontSize: '0.9rem' }}>
                     ⚙️ Settings
                   </Link>
                 </div>
               )}
               {isAuthenticated && (
                 <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} style={{ width: '100%', background: '#fff0f0', color: '#e03131', border: '1px solid #ffc9c9', padding: '16px', borderRadius: '12px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                   {t('nav_logout')}
                 </button>
               )}
               {mobileMenuItems.map((item, idx) => (
                  item.onClick ? (
                    <a key={idx} href={item.path} onClick={(e) => { item.onClick(e); setIsMobileMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '15px 0', borderBottom: '1px solid #eee', color: '#333', textDecoration: 'none', fontWeight: '600' }}>
                      {item.icon && <img src={item.icon} alt={item.label} style={{ height: '20px', width: 'auto', borderRadius: '4px' }} />}
                      {item.label}
                    </a>
                  ) : (
                    <Link key={idx} to={item.path} onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'block', padding: '15px 0', borderBottom: '1px solid #eee', color: '#333', textDecoration: 'none', fontWeight: '600' }}>{item.label}</Link>
                  )
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
          <div style={{ background: 'var(--bg-card)', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '25px', padding: '0 32px', borderBottom: '1px solid var(--border-color)' }}>
            <Link to="/bambupedia" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none', fontWeight: '500' }}>{t('nav_bambupedia')}</Link>
            <Link to="/bamboochain/academy" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none', fontWeight: '500' }}>{t('feature_academy')}</Link>
            <Link to="/data-tools" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none', fontWeight: '500' }}>{t('nav_datatools')}</Link>
            
            <a href="#" onClick={handleXignalxSSO} style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
              Signal Trading
            </a>

            <Link to="/bamboochain/marketplace" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none', fontWeight: '500' }}>{t('nav_marketplace')}</Link>
            <Link to="/community" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none', fontWeight: '500' }}>{t('nav_community')}</Link>
            <Link to="/events" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none', fontWeight: '500' }}>{t('nav_events')}</Link>
            
            {/* bambuNUSA DROPDOWN (11 Features) */}
            <div 
              onMouseEnter={() => setShowBambooMenu(true)} 
              onMouseLeave={() => setShowBambooMenu(false)} 
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', height: '100%' }}
            >
              bambuNUSA <ChevronDown size={14} />
              {showBambooMenu && (
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: '260px', background: 'var(--bg-card)', boxShadow: '0 15px 40px rgba(0,0,0,0.15)', borderRadius: '0 0 16px 16px', padding: '10px', zIndex: 10005, border: '1px solid var(--border-color)' }}>
                   {bambooNusaFeatures.map((feature, index) => (
                      <Link 
                        key={index} 
                        to={feature.path} 
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', color: 'var(--text-main)', textDecoration: 'none', borderRadius: '8px', transition: 'all 0.2s' }}
                        onMouseEnter={e => { 
                          e.currentTarget.style.background = isDark ? 'rgba(12, 166, 120, 0.2)' : '#f0fdf4'; 
                          e.currentTarget.style.color = 'var(--primary)'; 
                        }}
                        onMouseLeave={e => { 
                          e.currentTarget.style.background = 'transparent'; 
                          e.currentTarget.style.color = 'var(--text-main)'; 
                        }}
                      >
                        <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>{feature.icon}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{feature.label}</div>
                      </Link>
                    ))}
                </div>
              )}
            </div>

            <Link to="/careers" style={{ fontSize: '0.85rem', color: '#555', textDecoration: 'none' }}>{t('nav_careers')}</Link>
            <Link to="/membership" style={{ background: 'rgba(245, 159, 0, 0.1)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', color: '#f59f00', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Shield size={14} /> {t('nav_membership')}
            </Link>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px', position: 'relative' }}>
              {/* Theme Toggle - Desktop */}
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn"
                title={isDark ? t('nav_theme_light') : t('nav_theme_dark')}
              >
                {isDark ? <Sun size={18} color="#f59f00" /> : <Moon size={18} color="#555" />}
              </button>

              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#555', fontWeight: 'bold' }}
                >
                  <Globe size={18} />
                  <span>{language.toUpperCase()}</span>
                </button>
                
                {showLangMenu && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--bg-card)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)', overflow: 'hidden', minWidth: '120px', zIndex: 1000 }}>
                    <button onClick={() => { changeLanguage('id'); setShowLangMenu(false); }} style={{ display: 'block', width: '100%', padding: '10px 16px', background: language === 'id' ? 'rgba(12, 166, 120, 0.1)' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--text-main)' }}>🇮🇩 Indonesia</button>
                    <button onClick={() => { changeLanguage('en'); setShowLangMenu(false); }} style={{ display: 'block', width: '100%', padding: '10px 16px', background: language === 'en' ? 'rgba(12, 166, 120, 0.1)' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--text-main)' }}>🇬🇧 English</button>
                    <button onClick={() => { changeLanguage('ja'); setShowLangMenu(false); }} style={{ display: 'block', width: '100%', padding: '10px 16px', background: language === 'ja' ? 'rgba(12, 166, 120, 0.1)' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--text-main)' }}>🇯🇵 日本語</button>
                  </div>
                )}
              </div>

              <div 
                style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => { setShowNotifMenu(!showNotifMenu); setShowProfileMenu(false); }}
              >
                <Bell size={18} color="#888" />
                {isAuthenticated && unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#e03131', color: 'white', fontSize: '0.6rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              
              {showNotifMenu && isAuthenticated && (
                <div style={{ position: 'absolute', top: '40px', right: '100px', width: '350px', background: 'var(--bg-card)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', borderRadius: '16px', overflow: 'hidden', zIndex: 10006, border: '1px solid var(--border-color)' }}>
                  <div style={{ padding: '15px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{t('nav_notif_title')} {unreadCount > 0 && `(${unreadCount})`}</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>{t('nav_notif_read')}</button>
                      )}
                      {userNotifications.length > 0 && (
                        <button onClick={clearNotifications} style={{ background: 'none', border: 'none', color: '#e03131', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>{t('nav_notif_clear')}</button>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {userNotifications.length > 0 ? (
                      userNotifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => !notif.isRead && markAsRead(notif.id)}
                          style={{ 
                            padding: '15px', 
                            borderBottom: '1px solid #f1f3f5', 
                            fontSize: '0.85rem',
                            background: notif.isRead ? 'white' : '#f0fdf4',
                            cursor: notif.isRead ? 'default' : 'pointer',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start',
                            transition: 'background 0.2s'
                          }}
                        >
                          <div style={{ marginTop: '2px' }}>
                            {notif.type === 'success' ? '✅' : notif.type === 'warning' ? '⚠️' : notif.type === 'error' ? '❌' : 'ℹ️'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: notif.isRead ? '#666' : '#1a1a1a', fontWeight: notif.isRead ? 'normal' : '600', lineHeight: '1.4' }}>
                              {notif.text}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '4px' }}>
                              {new Date(notif.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          {!notif.isRead && <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', marginTop: '5px' }} />}
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '30px 15px', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
                        {t('nav_notif_empty')}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {showNotifMenu && !isAuthenticated && (
                <div style={{ position: 'absolute', top: '40px', right: '100px', width: '320px', background: 'var(--bg-card)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', borderRadius: '16px', overflow: 'hidden', zIndex: 10006, border: '1px solid var(--border-color)', padding: '15px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {t('nav_notif_login_req')}
                </div>
              )}

              {isAuthenticated ? (
                <div 
                  onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifMenu(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', border: '1px solid var(--primary)', position: 'relative' }}
                >
                  <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'default'}`} alt="avatar" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                  {user?.name?.split(' ')[0] || 'User'}
                  
                  {showProfileMenu && (
                    <div style={{ position: 'absolute', top: '40px', right: '0', width: '200px', background: 'var(--bg-card)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', borderRadius: '16px', overflow: 'hidden', zIndex: 10006, border: '1px solid var(--border-color)' }}>
                      <Link to="/profile" style={{ display: 'block', padding: '12px 16px', color: 'var(--text-main)', textDecoration: 'none', borderBottom: '1px solid var(--border-color)' }}>👤 {t('nav_profile')}</Link>
                      <Link to={`/portfolio/${user?.username || user?.id}`} style={{ display: 'block', padding: '12px 16px', color: 'var(--text-main)', textDecoration: 'none', borderBottom: '1px solid var(--border-color)' }}>🌿 {t('nav_passport')}</Link>
                      <Link to="/event-organizer" style={{ display: 'block', padding: '12px 16px', color: 'var(--text-main)', textDecoration: 'none', borderBottom: '1px solid var(--border-color)' }}>📅 Event Organizer</Link>
                      <Link to="/settings" style={{ display: 'block', padding: '12px 16px', color: 'var(--text-main)', textDecoration: 'none', borderBottom: '1px solid var(--border-color)' }}>⚙️ Settings / Developer</Link>
                      <button onClick={(e) => { e.stopPropagation(); logout(); setShowProfileMenu(false); }} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: 'var(--bg-card)', border: 'none', color: '#e03131', cursor: 'pointer', fontWeight: 'bold' }}>🚪 {t('nav_logout')}</button>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  onClick={openLoginModal}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e7f5ff', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', color: '#228be6', cursor: 'pointer', fontWeight: '600', border: '1px solid transparent' }}
                >
                  <User size={14} /> {t('nav_login_join')}
                </div>
              )}
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
                 { label: t('nav_home'), path: '/' },
                 { label: t('nav_projects'), path: '/projects' },
                 { label: 'Tobat Ekologi', path: '/tobat-ekologi' },
                 { label: t('nav_insights'), path: '/insight' },
                 { label: t('nav_impact'), path: '/impact' },
                 { label: t('nav_partners'), path: '/partners' },
                 { label: t('nav_about'), path: '/about' },
                 { label: t('nav_contact'), path: '/contact' },
                 { label: t('nav_faq'), path: '/faq' }
               ].map(item => (
                 <Link key={item.label} to={item.path} style={{ fontWeight: '600', color: '#444', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
                   {item.label}
                 </Link>
               ))}
               
               <Link to="/transparency" style={{ color: 'white', background: 'var(--primary)', fontWeight: 'bold', padding: '8px 20px', borderRadius: '30px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(12, 166, 120, 0.3)' }}>
                 {t('nav_transparency')}
               </Link>
               

            </div>
          </div>

        </div>
      )}
       {/* ────────── WALLET SELECTION MODAL ────────── */}
       {isWalletModalOpen && (
         <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', position: 'relative', border: '1px solid var(--border-color)' }}>
               <button onClick={() => closeWalletModal()} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: '#f1f3f5', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}><X size={18} /></button>
               
               <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                  <div style={{ background: 'rgba(12, 166, 120, 0.1)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: 'var(--primary)' }}>
                     <Wallet size={32} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{t('wallet_title')}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '8px' }}>{t('wallet_desc')}</p>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {wallets.map((wallet) => (
                    <button 
                      key={wallet.name}
                      onClick={() => handleWalletConnect(wallet)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '15px', 
                        padding: '16px', 
                        borderRadius: '16px', 
                        border: '1px solid #eee', 
                        background: 'white', 
                        cursor: 'pointer', 
                        transition: 'all 0.2s',
                        textAlign: 'left'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = wallet.color; e.currentTarget.style.background = '#fcfcfc'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <span style={{ fontSize: '1.8rem' }}>{wallet.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: '#333' }}>{wallet.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>{wallet.name === 'MetaMask' ? 'Recommended' : 'Web3 Wallet'}</div>
                      </div>
                      <ChevronDown size={16} color="#ccc" style={{ transform: 'rotate(-90deg)' }} />
                    </button>
                  ))}
               </div>

               <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#aaa', marginTop: '25px' }}>
                  {t('wallet_terms')}
               </p>
            </div>
         </div>
       )}
    </nav>
  );
};

export default Navbar;
