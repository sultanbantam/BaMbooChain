import React, { useEffect } from 'react';
import { ExternalLink, Info, DollarSign, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * AdSpace Component
 * 
 * @param {string} type - 'horizontal', 'vertical', 'square'
 * @param {string} size - 'normal', 'compact'
 * @param {string} adSlot - Google AdSense Slot ID (optional)
 * @param {object} directAd - { image, link, title } for sold ads
 * @param {string} height - Height of the ad space
 */
const AdSpace = ({ type = 'horizontal', size = 'normal', adSlot, directAd, height }) => {
  
  useEffect(() => {
    // Re-initialize AdSense if we are in AdSense mode
    if (adSlot && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense Error:", e);
      }
    }
  }, [adSlot]);

  const waLink = "https://wa.me/628174139994?text=Halo%20Admin%20BaMbooChain,%20saya%20tertarik%20untuk%20menyewa%20ruang%20iklan%20di%20aplikasi.";

  // RENDER: DIRECT AD (Sold)
  if (directAd) {
    return (
      <a href={directAd.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ 
          width: '100%', 
          height: height || (type === 'horizontal' ? '120px' : 'auto'), 
          borderRadius: '16px', 
          overflow: 'hidden', 
          position: 'relative',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <img src={directAd.image} alt={directAd.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ 
            position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', 
            color: 'white', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px', backdropFilter: 'blur(4px)' 
          }}>
            Promoted
          </div>
        </div>
      </a>
    );
  }

  // RENDER: COMPACT PLACEHOLDER (New)
  if (size === 'compact') {
    return (
      <div style={{ 
        width: '100%', height: height || '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        gap: '12px', background: '#f8f9fa', borderRadius: '8px', border: '1px dashed #dee2e6', padding: '0 12px' 
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <DollarSign size={12} color="var(--primary)" /> <b>Sewa Iklan:</b> Transfer BRI / BMC
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.7rem', color: '#25D366', fontWeight: 'bold' }}>WhatsApp</a>
          <Link to="/contact" style={{ fontSize: '0.7rem', color: 'var(--text-main)', fontWeight: 'bold' }}>Info Detail</Link>
        </div>
      </div>
    );
  }

  // RENDER: ADSENSE
  if (adSlot) {
    return (
      <div style={{ width: '100%', margin: '20px 0', textAlign: 'center' }}>
        <ins className="adsbygoogle"
             style={{ display: 'block', height: height || 'auto' }}
             data-ad-client="ca-pub-3668510649750568"
             data-ad-slot={adSlot}
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <div style={{ fontSize: '0.65rem', color: '#adb5bd', marginTop: '4px' }}>ADVERTISEMENT</div>
      </div>
    );
  }

  // RENDER: PLACEHOLDER (Space for Rent)
  return (
    <div style={{ 
      width: '100%', 
      height: height || (type === 'horizontal' ? '120px' : '300px'),
      background: 'white',
      borderRadius: '24px',
      border: '2px dashed #dee2e6',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
      transition: 'all 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(12,166,120,0.02)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#dee2e6'; e.currentTarget.style.background = 'white'; }}>
      
      <div style={{ background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '50%', marginBottom: '12px' }}>
        <DollarSign size={24} />
      </div>

      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-main)' }}>Ruang Iklan Tersedia</h4>
      <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '250px' }}>
        Pasarkan produk Anda di sini. Bayar via <b>Bank BRI</b> atau <b>BMC Token</b>.
      </p>

      <div style={{ display: 'flex', gap: '8px' }}>
        <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ 
          background: '#25D366', color: 'white', padding: '8px 16px', borderRadius: '20px', 
          fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' 
        }}>
          <MessageCircle size={14} /> Sewa via WA
        </a>
        <Link to="/contact" style={{ 
          background: 'var(--text-main)', color: 'white', padding: '8px 16px', borderRadius: '20px', 
          fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' 
        }}>
          <Info size={14} /> Info Detail
        </Link>
      </div>

    </div>
  );
};

export default AdSpace;
