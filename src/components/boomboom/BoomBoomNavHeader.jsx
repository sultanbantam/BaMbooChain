import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navigation, Car, Shield, Award, HelpCircle, UserCheck, Building2, History, Settings, Flame } from 'lucide-react';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

const BoomBoomNavHeader = () => {
  const location = useLocation();
  const { featureFlags } = useBoomBoomStore();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 1100;
  const topMargin = isMobile ? '70px' : '140px';

  const navItems = [
    { path: '/boomboom', label: 'Beranda', icon: <Navigation size={15} /> },
    { path: '/boomboom/book', label: 'Pesan', icon: <Car size={15} />, badge: 'Utama' },
    { path: '/boomboom/driver', label: 'Pengemudi', icon: <UserCheck size={15} /> },
    { path: '/boomboom/operator', label: 'Mitra', icon: <Building2 size={15} /> },
    { path: '/boomboom/trips', label: 'Riwayat', icon: <History size={15} /> },
    { path: '/boomboom/rewards', label: 'Reward', icon: <Award size={15} />, highlight: true },
    { path: '/boomboom/safety', label: 'BoomSafe', icon: <Shield size={15} /> },
    { path: '/boomboom/help', label: 'Bantuan', icon: <HelpCircle size={15} /> },
    { path: '/boomboom/admin', label: 'Admin', icon: <Settings size={15} /> },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
      color: '#ffffff',
      padding: isMobile ? '10px 12px 10px' : '16px 24px 12px',
      borderRadius: '0 0 20px 20px',
      boxShadow: '0 8px 24px rgba(6, 78, 59, 0.3)',
      marginTop: topMargin,
      position: 'relative',
      zIndex: 90,
      transition: 'margin-top 0.2s ease'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{
              background: '#f59f00',
              color: '#000000',
              fontWeight: '900',
              fontSize: isMobile ? '0.95rem' : '1.15rem',
              padding: isMobile ? '5px 10px' : '6px 14px',
              borderRadius: '12px',
              letterSpacing: '0.3px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 4px 10px rgba(245, 159, 0, 0.4)',
              flexShrink: 0
            }}>
              <Flame size={isMobile ? 15 : 18} color="#000000" /> BOOMBOOM
            </div>
            {!isMobile && (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#a7f3d0' }}>
                  Green Community Mobility
                </div>
                <div style={{ fontSize: '0.72rem', opacity: 0.85, color: '#ecfdf5' }}>
                  "Dari Desa, Menghubungkan Nusantara."
                </div>
              </div>
            )}
          </div>

          <span style={{
            background: featureFlags.BOOMBOOM_PILOT_ENABLED ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${featureFlags.BOOMBOOM_PILOT_ENABLED ? '#34d399' : '#f87171'}`,
            color: featureFlags.BOOMBOOM_PILOT_ENABLED ? '#34d399' : '#f87171',
            padding: isMobile ? '3px 8px' : '4px 10px',
            borderRadius: '20px',
            fontSize: isMobile ? '0.65rem' : '0.72rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: featureFlags.BOOMBOOM_PILOT_ENABLED ? '#34d399' : '#f87171',
              flexShrink: 0
            }} />
            {featureFlags.BOOMBOOM_PILOT_ENABLED ? (isMobile ? 'Pilot' : 'Pilot Mode') : 'Inactive'}
          </span>
        </div>

        {/* Nav Items — horizontal scroll, hide scrollbar */}
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '2px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <style>{`
            .boom-nav-scroll::-webkit-scrollbar { display: none; }
          `}</style>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: isMobile ? '7px 11px' : '8px 14px',
                  borderRadius: '10px',
                  fontSize: isMobile ? '0.78rem' : '0.83rem',
                  fontWeight: isActive ? '800' : '600',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.18s ease',
                  background: isActive
                    ? 'rgba(255, 255, 255, 0.28)'
                    : item.highlight
                    ? 'rgba(245, 159, 0, 0.22)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: isActive ? '#ffffff' : item.highlight ? '#fef08a' : '#d1fae5',
                  border: isActive ? '1px solid rgba(255,255,255,0.45)' : '1px solid transparent',
                  flexShrink: 0
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: '#f59f00',
                    color: '#000000',
                    fontSize: '0.6rem',
                    fontWeight: '900',
                    padding: '1px 5px',
                    borderRadius: '5px',
                    marginLeft: '1px'
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BoomBoomNavHeader;
