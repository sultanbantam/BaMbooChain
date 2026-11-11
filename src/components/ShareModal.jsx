import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { normalizeShareUrl } from '../utils/shareUrl';

const ShareModal = ({ 
  isOpen, 
  onClose, 
  shareUrl, 
  shareTitle, 
  url, 
  title, 
  userAvatar, 
  userName, 
  userHandle, 
  userRole, 
  userBio 
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const finalShareUrl = normalizeShareUrl(shareUrl || url || '');
  const finalShareTitle = shareTitle || title || 'Lihat halaman menarik ini di BaMbooChain!';

  // High-converting hook text for social media sharing
  const generateShareText = () => {
    if (userName || userHandle) {
      return `🎋 *PORTAL RESMI PEGIAT BAMBU NUSANTARA*
Halo! Kenalan dengan *${userName || 'Pegiat Ekosistem'}* (@${userHandle || 'bamboochain'}) di platform BaMbooChain.

${userBio ? `🌱 *“${userBio}”*\n` : ''}
🔥 *Kenapa Harus Bergabung Sekarang?*
• 🌿 Sensus & petakan rumpun bambu lokal di sekitarmu
• 🆔 Terbitkan BambooID Passport & reputasi Web3 hijau milikmu
• 💎 Dapatkan airdrop & reward token BMC hijau gratis!

👇 *Buka Paspor Digital & Gabung Komunitas Hijau:*
${finalShareUrl}`;
    }
    return finalShareTitle.includes(finalShareUrl)
      ? finalShareTitle
      : `${finalShareTitle}\n\n${finalShareUrl}`;
  };

  const fullShareText = generateShareText();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: finalShareTitle.split('\n')[0].replace(/[*_#~]/g, '').trim(),
          text: fullShareText,
          url: finalShareUrl
        });
      } catch (err) {
        console.log('Share canceled', err);
      }
    }
  };

  const encodedUrl = encodeURIComponent(finalShareUrl);
  const encodedFullText = encodeURIComponent(fullShareText);

  const socialChannels = [
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodedFullText}`,
      color: '#25D366',
      icon: '💬'
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(finalShareTitle)}`,
      color: '#0088cc',
      icon: '✈️'
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#1877F2',
      icon: '📘'
    },
    {
      name: 'Twitter / X',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(finalShareTitle)}`,
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
        maxWidth: '420px',
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
          style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', zIndex: 10 }}
        >
          <X size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px', padding: '0 10px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0 0 6px 0', color: 'var(--text-main)' }}>Bagikan Ke Sosial Media</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #888888)', margin: 0 }}>
            {userName ? `Sebarkan profil & inspirasi hijau ${userName} ke jejaring sosial Anda.` : 'Pilih platform untuk membagikan tautan ini.'}
          </p>
        </div>

        {/* 👤 Visual Preview Card with User Avatar & Hook */}
        {(userAvatar || userName) && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(12, 166, 120, 0.08), rgba(24, 100, 171, 0.08))',
            border: '1px solid rgba(12, 166, 120, 0.22)',
            borderRadius: '18px',
            padding: '14px 16px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2.5px solid var(--primary, #0ca678)',
              flexShrink: 0,
              background: '#ffffff',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userHandle || 'user'}`} 
                alt={userName || 'Avatar'} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span>{userName || 'Pegiat Ekosistem Hijau'}</span>
                <span style={{ fontSize: '0.68rem', background: 'rgba(12, 166, 120, 0.15)', color: 'var(--primary, #0ca678)', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>
                  ✓ {userRole || 'Verified Member'}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@{userHandle || 'pegiat'}</div>
              {userBio && (
                <div style={{ fontSize: '0.74rem', color: 'var(--text-main)', marginTop: '3px', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  "{userBio}"
                </div>
              )}
            </div>
          </div>
        )}

        {typeof navigator !== 'undefined' && navigator.share && (
          <button
            onClick={handleNativeShare}
            style={{
              width: '100%',
              marginBottom: '15px',
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid #51cf66',
              background: 'rgba(81, 207, 102, 0.15)',
              color: '#51cf66',
              fontWeight: 'bold',
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>📱</span> Bagikan Cepat via Aplikasi HP
          </button>
        )}
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
