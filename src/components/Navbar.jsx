import React, { useState } from 'react';
import { Globe, Bell, Copy, ExternalLink, LogOut, User, LayoutDashboard, Leaf, Link as LinkIcon, Home, Wallet, Recycle, ShoppingCart, Users, GraduationCap, LineChart, TrendingUp, ChevronDown, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdSpace from './AdSpace';
import { useLanguage } from '../context/LanguageContext';
import { useWeb3 } from '../context/Web3Context';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [showNotif, setShowNotif] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [showBambooMenu, setShowBambooMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { walletAddress, bmcBalance, bnbBalance, isConnecting, isConnected, connectWallet, disconnectWallet } = useWeb3();
  const { user, isAuthenticated, logout, openLoginModal, openSignupModal } = useAuth();
  const navigate = useNavigate();

  const shortAddress = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const notifications = [t('nav_notif_1'), t('nav_notif_2'), t('nav_notif_3')];

  const secondaryLinks = [
    { key: 'nav_bambupedia', href: '/bambupedia', external: false },
    { key: 'nav_academy',    href: '/academy', external: false },
    { key: 'nav_datatools',  href: '/data-tools', external: false },
    { key: 'nav_marketplace',href: '/bamboochain/marketplace', external: false },
    { key: 'nav_community',  href: '/community', external: false },
    { key: 'nav_bamboochain',href: '/bamboochain', external: false },
    { key: 'nav_careers',    href: '/careers', external: false },
  ];

  return (
    <nav className="glass-nav" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* ── GLOBAL TOP AD SLOT (Moved inside fixed header) ── */}
      <div style={{ background: '#f8f9fa', borderBottom: '1px solid #e9ecef', width: '100%', zIndex: 1001 }}>
        <div className="container" style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AdSpace type="horizontal" size="compact" height="30px" />
        </div>
      </div>

      {/* ── BARIS ATAS ── */}
      <div style={{
        background: 'rgba(12, 166, 120, 0.08)',
        borderBottom: '1px solid rgba(12,166,120,0.15)',
        padding: '6px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {secondaryLinks.map((link) => {
            if (link.key === 'nav_bamboochain') {
              return (
                <div key={link.key} style={{ position: 'relative' }} 
                     onMouseEnter={() => setShowBambooMenu(true)} 
                     onMouseLeave={() => setShowBambooMenu(false)}>
                  <Link to={link.href}
                    style={{ fontSize: '0.8rem', fontWeight: '500', color: showBambooMenu ? 'var(--primary)' : 'var(--secondary)', transition: 'color 0.2s', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', background: showBambooMenu ? 'rgba(12,166,120,0.06)' : 'transparent' }}>
                    {t(link.key)} <ChevronDown size={14} />
                  </Link>
                  
                  {/* Mega Menu Dropdown */}
                  {showBambooMenu && (
                    <div style={{ position: 'absolute', top: '100%', left: '-100px', width: '500px', background: 'white', border: '1px solid #dee2e6', borderRadius: '12px', boxShadow: '0 12px 30px rgba(0,0,0,0.1)', zIndex: 9999, padding: '20px', display: 'flex', gap: '24px' }}>
                      
                      {/* Kolom 1 */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#adb5bd', marginBottom: '8px', letterSpacing: '1px' }}>Platform Inti</h4>
                        {[
                          { path: '/bamboochain', icon: LayoutDashboard, label: 'Overview', desc: 'Dashboard Ecosystem' },
                          { path: '/bamboochain/plantation', icon: Leaf, label: 'Plantation', desc: 'Tanam & Lacak Bambu' },
                          { path: '/bamboochain/supply-chain', icon: LinkIcon, label: 'Supply Chain', desc: 'Transparansi Industri' },
                          { path: '/bamboochain/build', icon: Home, label: 'BamBu 5.0', desc: 'Konstruksi Modular' },
                          { path: '/bamboochain/marketplace', icon: ShoppingCart, label: 'Marketplace', desc: 'Produk & NFT' },
                          { path: '/bamboochain/token-wallet', icon: Wallet, label: 'Token & Wallet', desc: 'Aset Digital BMC' },
                        ].map(item => (
                          <Link key={item.path} to={item.path} style={{ display: 'flex', gap: '12px', padding: '8px', borderRadius: '8px', textDecoration: 'none' }}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, { background: '#f8f9fa' })}
                                onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: 'transparent' })}>
                            <div style={{ background: 'rgba(12,166,120,0.1)', padding: '8px', borderRadius: '8px', color: 'var(--primary)', height: 'fit-content' }}>
                              <item.icon size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{item.label}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Batas Kolom */}
                      <div style={{ width: '1px', background: '#e9ecef' }}></div>

                      {/* Kolom 2 */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#adb5bd', marginBottom: '8px', letterSpacing: '1px' }}>Dampak & Komunitas</h4>
                        {[
                          { path: '/bamboochain/invest', icon: TrendingUp, label: 'Invest', desc: 'Kalkulator ROI & Portofolio' },
                          { path: '/bamboochain/carbon-impact', icon: Recycle, label: 'Carbon & Impact', desc: 'Metrik Lingkungan' },
                          { path: '/bamboochain/dao', icon: Users, label: 'DAO & Community', desc: 'Voting & Funding' },
                          { path: '/bamboochain/academy', icon: GraduationCap, label: 'Akademi', desc: 'Sertifikasi Keahlian' },
                          { path: '/bamboochain/data-analytics', icon: LineChart, label: 'Data & Analytics', desc: 'Pemetaan GIS' },
                        ].map(item => (
                          <Link key={item.path} to={item.path} style={{ display: 'flex', gap: '12px', padding: '8px', borderRadius: '8px', textDecoration: 'none' }}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, { background: '#f8f9fa' })}
                                onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: 'transparent' })}>
                            <div style={{ background: 'rgba(12,166,120,0.1)', padding: '8px', borderRadius: '8px', color: 'var(--primary)', height: 'fit-content' }}>
                              <item.icon size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{item.label}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>

                    </div>
                  )}
                </div>
              );
            }

            return link.external ? (
              <a key={link.key} href={link.href} target="_blank" rel="noreferrer"
                style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--secondary)', transition: 'color 0.2s', padding: '6px 10px', borderRadius: '6px', display: 'inline-block' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'rgba(12,166,120,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--secondary)'; e.currentTarget.style.background = 'transparent'; }}>
                {t(link.key)}
              </a>
            ) : (
              <Link key={link.key} to={link.href}
                style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--secondary)', transition: 'color 0.2s', padding: '6px 10px', borderRadius: '6px', display: 'inline-block' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'rgba(12,166,120,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--secondary)'; e.currentTarget.style.background = 'transparent'; }}>
                {t(link.key)}
              </Link>
            );
          })}
          <Link to="/membership"
            style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', background: 'rgba(12,166,120,0.08)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(12,166,120,0.3)', display: 'inline-block', marginLeft: '4px' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(12,166,120,0.18)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(12,166,120,0.08)'; }}>
            🏅 Keanggotaan
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>

          {/* Notifikasi */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setShowNotif(!showNotif); setShowWalletMenu(false); }}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', position: 'relative' }}>
              <Bell size={18} color="var(--secondary)" />
              <span style={{ position: 'absolute', top: '0px', right: '0px', width: '8px', height: '8px', borderRadius: '50%', background: '#e03131', border: '1px solid white' }} />
            </button>
            {showNotif && (
              <div style={{ position: 'absolute', top: '130%', right: '0', background: 'white', border: '1px solid #dee2e6', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', width: '280px', zIndex: 9999, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f3f5', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  🔔 {t('nav_notif_title')}
                </div>
                {notifications.map((notif, i) => (
                  <div key={i} style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--text-muted)', borderBottom: i < notifications.length - 1 ? '1px solid #f1f3f5' : 'none', lineHeight: '1.4', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    {notif}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Web2 Auth & Web3 Wallet Logic */}
          {!isAuthenticated ? (
            <>
              <button onClick={openLoginModal}
                style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--secondary)', padding: '4px 14px', border: '1px solid var(--primary)', borderRadius: '20px', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.target.style.background = 'var(--primary)'; e.target.style.color = 'white'; }}
                onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--secondary)'; }}>
                Masuk
              </button>
              <button onClick={openSignupModal}
                style={{ fontSize: '0.8rem', fontWeight: '600', color: 'white', padding: '4px 14px', background: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.target.style.background = 'var(--primary-hover)'; }}
                onMouseLeave={(e) => { e.target.style.background = 'var(--primary)'; }}>
                Daftar
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {!isConnected && (
                <button onClick={connectWallet} disabled={isConnecting}
                  style={{ fontSize: '0.8rem', fontWeight: '600', color: 'white', padding: '4px 14px', background: '#f59f00', border: 'none', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  {isConnecting ? 'Menghubungkan...' : 'Connect Wallet'}
                </button>
              )}

              <div style={{ position: 'relative' }}>
                <button onClick={() => { setShowWalletMenu(!showWalletMenu); setShowNotif(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(12,166,120,0.1)', border: '1px solid var(--primary)', borderRadius: '20px', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', color: 'var(--secondary)' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>
                     {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span style={{ color: 'var(--primary)' }}>{user?.name?.split(' ')[0] || 'User'}</span>
                  {isConnected && shortAddress && <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.75rem', paddingLeft: '6px', borderLeft: '1px solid #dee2e6' }}>{shortAddress}</span>}
                </button>

                {showWalletMenu && (
                  <div style={{ position: 'absolute', top: '130%', right: '0', background: 'white', border: '1px solid #dee2e6', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', width: '260px', zIndex: 9999, overflow: 'hidden' }}>
                    
                    {/* User Web2 Info Header */}
                    <div style={{ padding: '16px', borderBottom: '1px solid #f1f3f5', background: '#f8f9fa' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={18} color="white" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{user?.name || 'Member'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email || user?.phone || 'Premium Account'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Web3 Info if Connected */}
                    {isConnected && (
                      <div style={{ padding: '16px', borderBottom: '1px solid #f1f3f5', background: 'linear-gradient(135deg, rgba(12,166,120,0.05), rgba(43,138,62,0.08))' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                           <Wallet size={16} color="var(--primary)" />
                           <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 'bold' }}>{shortAddress}</div>
                           <button onClick={handleCopy} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                             <Copy size={14} color={copied ? 'var(--primary)' : '#aaa'} />
                           </button>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <div style={{ flex: 1, background: 'white', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BMC</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary)' }}>{bmcBalance ?? '...'}</div>
                          </div>
                          <div style={{ flex: 1, background: 'white', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BNB</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#f59f00' }}>{bnbBalance ?? '...'}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Menu items */}
                    <div>
                      <button onClick={() => { navigate('/profile'); setShowWalletMenu(false); }}
                        style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left', color: 'var(--text-main)' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <User size={16} color="var(--primary)" /> Profil Saya
                      </button>
                      
                      {isConnected && (
                        <>
                          <a href={`https://bscscan.com/address/${walletAddress}`} target="_blank" rel="noreferrer"
                            style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)', borderTop: '1px solid #f1f3f5', textDecoration: 'none' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                            <ExternalLink size={16} color="var(--primary)" /> Lihat di BSCScan
                          </a>
                          <button onClick={() => { disconnectWallet(); }}
                            style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', borderTop: '1px solid #f1f3f5', cursor: 'pointer', fontSize: '0.85rem', color: '#e03131', textAlign: 'left' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fff5f5'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                            <LogOut size={16} /> Putuskan Wallet
                          </button>
                        </>
                      )}
                      
                      <button onClick={() => { logout(); disconnectWallet(); setShowWalletMenu(false); navigate('/'); }}
                        style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', borderTop: '1px solid #f1f3f5', cursor: 'pointer', fontSize: '0.85rem', color: '#e03131', textAlign: 'left' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fff5f5'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <LogOut size={16} /> Log Out Pengguna
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── BARIS BAWAH ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 32px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '900', fontSize: '1.75rem', whiteSpace: 'nowrap' }}>
          <div style={{ position: 'relative', width: '60px', height: '40px' }}>
            <img src="logo-ysnj2.png" alt="Logo YSNJ" style={{ height: '90px', width: 'auto', position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '6px' }}>
            {/* 9 Logo Mitra */}
            <img src="logos/logo1.png" alt="Pi Bamboo" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
            <img src="logos/logo2.png" alt="Modular Blockbamboo" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
            <img src="logos/logo3.png" alt="UMANG" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
            <img src="logos/logo4.png" alt="Circle Logo" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
            <img src="logos/logo5.png" alt="bambuNUSA" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
            <img src="logos/logo6.png" alt="WEB Wisata Edukasi Bambu" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
            <img src="logos/logo7.png" alt="Kios Bambu" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
            <img src="logos/logo8.png" alt="Akademi Bambu Nusantara" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
            <img src="logos/logo9.png" alt="Banten Creative Community" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'nowrap' }}>
          <Link to="/"          style={{ fontWeight: '500', color: 'var(--text-main)', fontSize: '0.85rem' }}>{t('nav_home')}</Link>
          <Link to="/projects"  style={{ fontWeight: '500', color: 'var(--text-main)', fontSize: '0.85rem' }}>{t('nav_projects')}</Link>
          <Link to="/insight"   style={{ fontWeight: '500', color: 'var(--text-main)', fontSize: '0.85rem' }}>{t('nav_insights')}</Link>
          <Link to="/impact"    style={{ fontWeight: '500', color: 'var(--text-main)', fontSize: '0.85rem' }}>{t('nav_impact')}</Link>
          <Link to="/partners"  style={{ fontWeight: '500', color: 'var(--text-main)', fontSize: '0.85rem' }}>{t('nav_partners')}</Link>
          <Link to="/about"     style={{ fontWeight: '500', color: 'var(--text-main)', fontSize: '0.85rem' }}>{t('nav_about')}</Link>
          <Link to="/contact"   style={{ fontWeight: '500', color: 'var(--text-main)', fontSize: '0.85rem' }}>{t('nav_contact')}</Link>
          <Link to="/faq"       style={{ fontWeight: '500', color: 'var(--text-main)', fontSize: '0.85rem' }}>FAQ</Link>
          <Link to="/transparency" style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.85rem', border: '1px solid var(--primary)', padding: '4px 12px', borderRadius: '20px' }}>On-Chain ⛓️</Link>

          <button onClick={toggleLanguage} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 'bold', padding: 0 }}>
            <Globe size={18} color="var(--primary)" />
            {language.toUpperCase()}
          </button>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
