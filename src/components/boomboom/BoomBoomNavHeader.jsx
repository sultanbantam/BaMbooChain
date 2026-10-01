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
  // Desktop navbar is ~140px tall (ad-space + top bar + bottom bar), mobile is 70px tall
  const topMargin = isMobile ? '75px' : '140px';

  const navItems = [
    { path: '/boomboom', label: 'Beranda', icon: <Navigation size={16} /> },
    { path: '/boomboom/book', label: 'Pesan Perjalanan', icon: <Car size={16} />, badge: 'Utama' },
    { path: '/boomboom/driver', label: 'Jadi Pengemudi', icon: <UserCheck size={16} /> },
    { path: '/boomboom/operator', label: 'Mitra Wilayah', icon: <Building2 size={16} /> },
    { path: '/boomboom/trips', label: 'Riwayat', icon: <History size={16} /> },
    { path: '/boomboom/rewards', label: 'Reward BMC', icon: <Award size={16} />, highlight: true },
    { path: '/boomboom/safety', label: 'BoomSafe & SOS', icon: <Shield size={16} /> },
    { path: '/boomboom/help', label: 'Bantuan', icon: <HelpCircle size={16} /> },
    { path: '/boomboom/admin', label: 'Admin Portal', icon: <Settings size={16} /> },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
      color: '#ffffff',
      padding: isMobile ? '12px 14px' : '18px 24px 14px',
      borderRadius: '0 0 24px 24px',
      boxShadow: '0 10px 25px rgba(6, 78, 59, 0.25)',
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
        gap: '12px'
      }}>
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#f59f00',
              color: '#000000',
              fontWeight: '900',
              fontSize: isMobile ? '1rem' : '1.2rem',
              padding: '6px 14px',
              borderRadius: '14px',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(245, 159, 0, 0.4)'
            }}>
              <Flame size={isMobile ? 18 : 20} color="#000000" /> BOOMBOOM
            </div>
            <div>
              <div style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', fontWeight: '700', color: '#a7f3d0' }}>
                Green Community Mobility
              </div>
              <div style={{ fontSize: isMobile ? '0.7rem' : '0.75rem', opacity: 0.9, color: '#ecfdf5' }}>
                “Dari Desa, Menghubungkan Nusantara.”
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: featureFlags.BOOMBOOM_PILOT_ENABLED ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${featureFlags.BOOMBOOM_PILOT_ENABLED ? '#34d399' : '#f87171'}`,
              color: featureFlags.BOOMBOOM_PILOT_ENABLED ? '#34d399' : '#f87171',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: featureFlags.BOOMBOOM_PILOT_ENABLED ? '#34d399' : '#f87171'
              }} />
              {featureFlags.BOOMBOOM_PILOT_ENABLED ? 'Pilot Region Mode' : 'Pilot Inactive'}
            </span>
          </div>
        </div>

        {/* Dynamic Nav Items Carousel */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none'
        }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? '800' : '600',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  background: isActive
                    ? 'rgba(255, 255, 255, 0.28)'
                    : item.highlight
                    ? 'rgba(245, 159, 0, 0.25)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: isActive ? '#ffffff' : item.highlight ? '#fef08a' : '#d1fae5',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid transparent'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: '#f59f00',
                    color: '#000000',
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    padding: '1px 5px',
                    borderRadius: '6px',
                    marginLeft: '2px'
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
