import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navigation, Car, Shield, Award, HelpCircle, UserCheck, Building2, History, Settings, Flame, Bell, X, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';
import { subscribeFirestoreDrivers, subscribeAuditLogs } from '../../services/boomboom/boomboomPilotService';
import { useAuth } from '../../context/AuthContext';
import LocationPermissionModal from './LocationPermissionModal';

const BoomBoomNavHeader = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { 
    featureFlags, 
    notifications, 
    dismissNotification, 
    syncFirestoreDriversList, 
    syncAuditLogs 
  } = useBoomBoomStore();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sinkronisasi real-time Pengemudi & Audit Logs dari Firestore pada Tahap II
  useEffect(() => {
    const unsubDrivers = subscribeFirestoreDrivers((list) => {
      syncFirestoreDriversList(list);
    });
    const unsubLogs = subscribeAuditLogs((logs) => {
      syncAuditLogs(logs);
    });
    return () => {
      if (unsubDrivers) unsubDrivers();
      if (unsubLogs) unsubLogs();
    };
  }, [syncFirestoreDriversList, syncAuditLogs]);

  const isMobile = windowWidth <= 1100;
  const topMargin = isMobile ? '70px' : '140px';

  const navItems = [
    { path: '/boomboom', label: 'Beranda', icon: <Navigation size={15} /> },
    { path: '/boomboom/book', label: 'Pesan', icon: <Car size={15} />, badge: 'Utama' },
    { path: '/boomboom/driver/dashboard', label: 'Dasbor Driver', icon: <UserCheck size={15} />, badge: 'Online' },
    { path: '/boomboom/driver', label: 'Daftar Driver', icon: <Car size={15} /> },
    { path: '/boomboom/operator', label: 'Mitra', icon: <Building2 size={15} /> },
    { path: '/boomboom/trips', label: 'Riwayat', icon: <History size={15} /> },
    { path: '/boomboom/rewards', label: 'Reward', icon: <Award size={15} />, highlight: true },
    { path: '/boomboom/safety', label: 'BoomSafe', icon: <Shield size={15} /> },
    { path: '/boomboom/help', label: 'Bantuan', icon: <HelpCircle size={15} /> },
    { path: '/boomboom/admin', label: 'Admin & Audit', icon: <Settings size={15} /> },
    { path: 'https://ngopi.top/contacts?join=BoomBoom', label: 'ngopi.top', isExternal: true, badge: 'Chat WA', icon: <span>☕</span> }
  ];

  const navScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStartX, setScrollStartX] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const checkScroll = () => {
    if (!navScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const el = navScrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  // Auto scroll active item into view
  useEffect(() => {
    if (!navScrollRef.current) return;
    const activeEl = navScrollRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    setTimeout(checkScroll, 300);
  }, [location.pathname]);

  const scrollByAmount = (offset) => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e) => {
    if (!navScrollRef.current) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - navScrollRef.current.offsetLeft);
    setScrollStartX(navScrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !navScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - navScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 4) {
      setHasDragged(true);
    }
    navScrollRef.current.scrollLeft = scrollStartX - walk;
  };

  const handleClickCapture = (e) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleWheel = (e) => {
    if (!navScrollRef.current) return;
    if (navScrollRef.current.scrollWidth > navScrollRef.current.clientWidth) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        navScrollRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  const latestNotif = notifications && notifications.length > 0 ? notifications[0] : null;

  return (
    <>
      <LocationPermissionModal />

      {/* Toast Notification Real-Time Tahap II */}
      {latestNotif && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 99990,
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: '#ffffff',
          padding: '14px 18px',
          borderRadius: '18px',
          boxShadow: '0 12px 30px rgba(6, 78, 59, 0.45)',
          border: '1.5px solid #34d399',
          maxWidth: '360px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <CheckCircle2 size={20} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#a7f3d0', marginBottom: '2px' }}>
              {latestNotif.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#ecfdf5', lineHeight: 1.4 }}>
              {latestNotif.message}
            </div>
          </div>
          <button
            onClick={() => dismissNotification(latestNotif.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#a7f3d0',
              cursor: 'pointer',
              padding: '2px'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
                    {user ? `Terautentikasi: ${user.displayName || user.email || 'Anggota BaMbooChain'}` : '"Dari Desa, Menghubungkan Nusantara."'}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <a
                href="https://ngopi.top/contacts?join=BoomBoom"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#451a03',
                  border: '1px solid #92400e',
                  color: '#fef3c7',
                  padding: isMobile ? '3px 8px' : '4px 10px',
                  borderRadius: '20px',
                  fontSize: isMobile ? '0.65rem' : '0.72rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                ☕ ngopi.top
              </a>
            </div>
          </div>

          {/* Nav Items Wrapper with Arrows & Drag-to-Scroll */}
          <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
            {/* Scroll Left Button */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollByAmount(-220)}
                aria-label="Geser ke kiri"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 25,
                  background: 'linear-gradient(90deg, #064e3b 70%, transparent 100%)',
                  border: 'none',
                  color: '#ffffff',
                  width: '42px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingLeft: '4px',
                  cursor: 'pointer',
                  borderRadius: '10px 0 0 10px'
                }}
              >
                <div style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  transition: 'background 0.2s'
                }}>
                  <ChevronLeft size={18} />
                </div>
              </button>
            )}

            {/* Nav Items — horizontal scroll, draggable, wheel scrollable */}
            <div
              ref={navScrollRef}
              className="boom-nav-scroll"
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onClickCapture={handleClickCapture}
              onWheel={handleWheel}
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                overflowY: 'hidden',
                paddingBottom: '6px',
                paddingRight: '50px',
                WebkitOverflowScrolling: 'touch',
                cursor: isMouseDown ? 'grabbing' : 'grab',
                userSelect: isMouseDown ? 'none' : 'auto',
                width: '100%',
                scrollBehavior: 'smooth'
              }}
            >
              <style>{`
                .boom-nav-scroll {
                  scrollbar-width: thin;
                  scrollbar-color: rgba(255, 255, 255, 0.35) transparent;
                }
                .boom-nav-scroll::-webkit-scrollbar {
                  height: 5px;
                }
                .boom-nav-scroll::-webkit-scrollbar-track {
                  background: rgba(0, 0, 0, 0.15);
                  border-radius: 999px;
                }
                .boom-nav-scroll::-webkit-scrollbar-thumb {
                  background: rgba(255, 255, 255, 0.35);
                  border-radius: 999px;
                }
                .boom-nav-scroll::-webkit-scrollbar-thumb:hover {
                  background: #f59f00;
                }
              `}</style>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const commonStyle = {
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
                background: item.isExternal
                  ? 'rgba(69, 26, 3, 0.6)'
                  : isActive
                  ? 'rgba(255, 255, 255, 0.28)'
                  : item.highlight
                  ? 'rgba(245, 159, 0, 0.22)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: item.isExternal ? '#fef3c7' : isActive ? '#ffffff' : item.highlight ? '#fef08a' : '#d1fae5',
                border: item.isExternal ? '1px solid #78350f' : isActive ? '1px solid rgba(255,255,255,0.45)' : '1px solid transparent',
                flexShrink: 0
              };

              if (item.isExternal) {
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={commonStyle}
                    data-active={isActive}
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
                  </a>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={commonStyle}
                  data-active={isActive}
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

            {/* Scroll Right Button */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollByAmount(220)}
                aria-label="Geser ke kanan"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 25,
                  background: 'linear-gradient(270deg, #059669 70%, transparent 100%)',
                  border: 'none',
                  color: '#ffffff',
                  width: '42px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '4px',
                  cursor: 'pointer',
                  borderRadius: '0 10px 10px 0'
                }}
              >
                <div style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  transition: 'background 0.2s'
                }}>
                  <ChevronRight size={18} />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BoomBoomNavHeader;
