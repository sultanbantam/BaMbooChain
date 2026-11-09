import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Activity, 
  User, 
  Dog, 
  Leaf, 
  Calendar, 
  ShieldCheck, 
  PlusCircle, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Fingerprint
} from 'lucide-react';

const CekkesNavHeader = ({ 
  activeTab, 
  onSelectTab, 
  onOpenAddModal, 
  onOpenAiModal, 
  onOpenBiometricModal,
  stats 
}) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 1100;
  // Offset to push ceKKes header completely below the fixed navbar
  const topMargin = isMobile ? '75px' : '150px';

  const tabs = [
    { id: 'all', label: 'Semua Profil', icon: <Activity size={15} />, count: stats?.total || 0 },
    { id: 'human', label: 'Manusia (Human)', icon: <User size={15} />, count: stats?.human || 0 },
    { id: 'animal', label: 'Hewan (Animal)', icon: <Dog size={15} />, count: stats?.animal || 0 },
    { id: 'plant', label: 'Tumbuhan (Plant)', icon: <Leaf size={15} />, count: stats?.plant || 0 },
    { id: 'schedule', label: 'Jadwal & Pengingat', icon: <Calendar size={15} />, count: stats?.carePlans || 0 },
    { id: 'audit', label: 'Audit & UU PDP', icon: <ShieldCheck size={15} />, count: stats?.auditLogs || 0 },
  ];

  const handleScroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(6, 78, 59, 0.5) 0%, rgba(15, 17, 23, 0.98) 100%)',
      borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
      padding: isMobile ? '16px 14px 12px' : '24px 20px 16px',
      color: '#ffffff',
      marginTop: topMargin,
      transition: 'margin-top 0.2s ease',
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top Header Row */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: '800',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                letterSpacing: '0.4px'
              }}>
                <Heart size={12} color="#34d399" />
                ceKKes v1.0 MVP
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: '600',
                background: 'rgba(245, 159, 0, 0.15)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 159, 0, 0.4)'
              }}>
                <ShieldCheck size={12} />
                Non-Diagnostik • Standar UU PDP No. 27/2022
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
              fontWeight: '900',
              margin: '0 0 4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ffffff',
              letterSpacing: '-0.5px'
            }}>
              ceKKes <span style={{ color: '#34d399', fontWeight: '500', fontSize: '0.85em' }}>— Cek Kesehatan Terpadu</span>
            </h1>

            <p style={{ margin: 0, fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              <strong style={{ color: '#6ee7b7' }}>"Kenali. Pantau. Rawat."</strong> Platform Informasi Biologis & Monitoring Terpadu 3 Alam (Manusia, Hewan, Tumbuhan)
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {onOpenBiometricModal && (
              <button
                onClick={onOpenBiometricModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.35)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Fingerprint size={16} color="#93c5fd" />
                <span>🔬 Lab Biometrik</span>
              </button>
            )}
            <button
              onClick={onOpenAiModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontWeight: '700',
                color: '#ffffff',
                background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 15px rgba(5, 150, 105, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Sparkles size={16} color="#fde68a" />
              <span>Cek dengan AI</span>
            </button>
            <button
              onClick={onOpenAddModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontWeight: '800',
                color: '#022c22',
                background: '#34d399',
                border: 'none',
                boxShadow: '0 4px 15px rgba(52, 211, 153, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <PlusCircle size={16} color="#022c22" />
              <span>+ Tambah Profil</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Row with Left/Right Scroll Controls (No More Cutoffs!) */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {/* Scroll Left Button */}
          <button
            onClick={() => handleScroll(-180)}
            style={{
              position: 'absolute',
              left: '-8px',
              zIndex: 10,
              background: '#064e3b',
              border: '1px solid #10b981',
              color: '#34d399',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}
            title="Geser Kiri"
          >
            <ChevronLeft size={16} />
          </button>

          <div 
            ref={scrollRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              padding: '4px 28px',
              scrollbarWidth: 'none',
              scrollBehavior: 'smooth',
              width: '100%'
            }}
          >
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 16px',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? '800' : '600',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    border: isActive ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                    background: isActive ? '#10b981' : 'rgba(30, 41, 59, 0.7)',
                    color: isActive ? '#022c22' : '#e2e8f0',
                    boxShadow: isActive ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span style={{
                    padding: '2px 7px',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    background: isActive ? 'rgba(2, 44, 34, 0.3)' : 'rgba(15, 23, 42, 0.8)',
                    color: isActive ? '#022c22' : '#cbd5e1'
                  }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => handleScroll(180)}
            style={{
              position: 'absolute',
              right: '-8px',
              zIndex: 10,
              background: '#064e3b',
              border: '1px solid #10b981',
              color: '#34d399',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}
            title="Geser Kanan"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CekkesNavHeader;
