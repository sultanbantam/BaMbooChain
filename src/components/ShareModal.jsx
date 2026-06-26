import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { normalizeShareUrl } from '../utils/shareUrl';

const ShareModal = ({ isOpen, onClose, shareUrl, shareTitle, url, title }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const finalShareUrl = normalizeShareUrl(shareUrl || url || '');
  const finalShareTitle = shareTitle || title || 'Lihat halaman menarik ini di BaMbooChain!';

  const handleCopy = () => {
    navigator.clipboard.writeText(finalShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(finalShareUrl);
  const encodedTitle = encodeURIComponent(finalShareTitle);

  const socialChannels = [
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: '#25D366',
      icon: '💬'
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#0088cc',
      icon: '✈️'
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#1877F2',
      icon: '👥'
    },
    {
      name: 'Twitter / X',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#1DA1F2',
      icon: '🐦'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100005,
      padding: '20px'
    }}
    onClick={onClose}
    >
      <div style={{
        background: 'var(--bg-card, #ffffff)',
        border: '1px solid var(--border-color, #eeeeee)',
        borderRadius: '24px',
        maxWidth: '400px',
        width: '100%',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        position: 'relative',
        color: 'var(--text-main, #333333)'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
        >
          <X size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0 0 8px 0', color: 'var(--text-main)' }}>Bagikan Ke Sosial Media</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #888888)', margin: 0 }}>
            Pilih platform untuk membagikan tautan ini.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {socialChannels.map((ch) => (
            <a
              key={ch.name}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                borderRadius: '16px',
                border: '1px solid var(--border-color, #eeeeee)',
                background: 'var(--bg-secondary, #f8f9fa)',
                color: 'var(--text-main, #333)',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ch.color;
                e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color, #eeeeee)';
                e.currentTarget.style.background = 'var(--bg-secondary, #f8f9fa)';
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{ch.icon}</span>
              {ch.name}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary, #f8f9fa)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-color, #eeeeee)' }}>
          <input
            type="text"
            readOnly
            value={finalShareUrl}
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              padding: '8px 12px',
              fontSize: '0.85rem',
              color: 'var(--text-main, #333)',
              fontWeight: 'bold',
              outline: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          />
          <button
            onClick={handleCopy}
            style={{
              background: copied ? 'var(--primary, #0ca678)' : 'var(--bg-secondary, #f8f9fa)',
              color: copied ? 'white' : 'var(--text-main, #333)',
              border: copied ? 'none' : '1px solid var(--border-color, #eeeeee)',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Tersalin' : 'Salin'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
