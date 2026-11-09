import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Compass, Calendar, Ticket, Image as ImageIcon, BookOpen, 
  HeartHandshake, ShoppingBag, Bot, ShieldAlert, ArrowLeft,
  ChevronRight, Sparkles, MapPin, Share2
} from 'lucide-react';
import CibaraniAiConciergeModal from './CibaraniAiConciergeModal';
import CibaraniShareModal from './CibaraniShareModal';

const CibaraniNavHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConcierge, setShowConcierge] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const navItems = [
    { path: '/cibarani', label: 'Beranda', icon: <Compass size={16} /> },
    { path: '/cibarani/experience', label: 'Pengalaman', icon: <Sparkles size={16} /> },
    { path: '/cibarani/booking', label: 'Reservasi', icon: <Calendar size={16} />, highlight: true },
    { path: '/cibarani/my-bookings', label: 'Tiket Saya', icon: <Ticket size={16} /> },
    { path: '/cibarani/agenda', label: 'Agenda & Event', icon: <Calendar size={16} /> },
    { path: '/cibarani/gallery', label: 'Galeri', icon: <ImageIcon size={16} /> },
    { path: '/cibarani/stories', label: 'Cerita & Leuit', icon: <BookOpen size={16} /> },
    { path: '/cibarani/impact', label: 'Dampak Sosial', icon: <HeartHandshake size={16} /> },
    { path: '/cibarani/products', label: 'Pasar Lokal', icon: <ShoppingBag size={16} /> },
    { path: '/cibarani/admin', label: 'Admin CMS', icon: <ShieldAlert size={16} /> }
  ];

  const currentPath = location.pathname;

  return (
    <>
      {/* TOP NOTIFICATION / IDENTITY BAR */}
      <div style={{
        background: 'linear-gradient(90deg, #064e3b 0%, #065f46 50%, #047857 100%)',
        color: '#ffffff',
        padding: '8px 16px',
        fontSize: '0.8rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ 
            background: '#fbbf24', 
            color: '#78350f', 
            fontSize: '0.68rem', 
            fontWeight: '900', 
            padding: '2px 8px', 
            borderRadius: '999px',
            letterSpacing: '0.5px'
          }}>
            EKOSISTEM WISATA ADAT
          </span>
          <span style={{ fontWeight: '700' }}>
            Kasepuhan Cibarani & Yayasan Sabumi Nusantara Jaya (YSNJ)
          </span>
          <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>
            • Lebak, Banten
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowConcierge(true)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Bot size={14} color="#fde047" /> AI Concierge
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            style={{
              background: 'rgba(251, 191, 36, 0.2)',
              border: '1px solid #fbbf24',
              color: '#fef3c7',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Share2 size={13} /> Bagikan
          </button>

          <Link
            to="/"
            style={{
              color: 'rgba(255,255,255,0.85)',
              textDecoration: 'none',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ArrowLeft size={13} /> Beranda BaMbooChain
          </Link>
        </div>
      </div>

      {/* STICKY CIBARANI NAVIGATION STRIP */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-card, #ffffff)',
        borderBottom: '1.5px solid var(--border-color, #e2e8f0)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
        padding: '0 16px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          padding: '8px 0'
        }}>
          {/* BRAND LOGO / TITLE */}
          <div 
            onClick={() => navigate('/cibarani')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              flexShrink: 0 
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24',
              fontWeight: '900',
              fontSize: '1.1rem',
              boxShadow: '0 2px 8px rgba(6,95,70,0.3)'
            }}>
              🏕️
            </div>
            <div>
              <div style={{ 
                fontSize: '0.95rem', 
                fontWeight: '900', 
                color: 'var(--text-main, #0f172a)',
                lineHeight: 1.15,
                letterSpacing: '-0.3px'
              }}>
                Cibarani Weekend
              </div>
              <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: '800' }}>
                Kasepuhan Cibarani Experience
              </div>
            </div>
          </div>

          {/* NAV ITEMS SCROLLABLE ON MOBILE */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            padding: '4px 0'
          }}>
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
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
                    fontSize: '0.82rem',
                    fontWeight: isActive || item.highlight ? '800' : '600',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                    background: isActive
                      ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
                      : item.highlight
                      ? 'rgba(16, 185, 129, 0.12)'
                      : 'transparent',
                    color: isActive
                      ? '#ffffff'
                      : item.highlight
                      ? '#047857'
                      : 'var(--text-muted, #475569)',
                    border: item.highlight && !isActive
                      ? '1px solid #10b981'
                      : '1px solid transparent',
                    boxShadow: isActive ? '0 3px 10px rgba(6,95,70,0.2)' : 'none'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showConcierge && (
        <CibaraniAiConciergeModal onClose={() => setShowConcierge(false)} />
      )}
      {showShareModal && (
        <CibaraniShareModal onClose={() => setShowShareModal(false)} />
      )}
    </>
  );
};

export default CibaraniNavHeader;
