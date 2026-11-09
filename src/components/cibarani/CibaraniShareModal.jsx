import React, { useState, useRef, useEffect } from 'react';
import { X, Share2, Download, Copy, Check, Sparkles, Image as ImageIcon } from 'lucide-react';

const VIRAL_HOOKS = [
  {
    title: 'Kedaulatan Pangan (Leuit)',
    copy: 'Pernah membayangkan gabah yang disimpan lintas generasi? Di Kasepuhan Cibarani, leuit bukan sekadar lumbung—ia menyimpan pengetahuan tentang pangan, alam, dan kehidupan puluhan tahun. Lihat kisahnya dan rasakan langsung di Cibarani Weekend Experience: https://bamboochain.id/#/cibarani'
  },
  {
    title: 'Weekend Escape',
    copy: 'Bukan sekadar liburan. Ini perjalanan menyusuri sawah, rumah adat panggung, hutan lindung, dan cerita masyarakat yang hidup bersahaja bersama alam. Siapa yang mau ikut ke Cibarani akhir pekan ini? Info & reservasi: https://bamboochain.id/#/cibarani'
  },
  {
    title: 'Adventure & Alam Karst',
    copy: 'Perjalanan berliku melewati lereng dan bukit Lebak Selatan, lalu tiba di kampung adat yang menyimpan ribuan cerita, Goa Dagul, dan kesegaran Sirah Banteng. Cibarani menunggu untuk dijelajahi: https://bamboochain.id/#/cibarani'
  },
  {
    title: 'Travel with Purpose',
    copy: 'Datang untuk menikmati, pulang membawa cerita, sekaligus ikut menggerakkan ekonomi masyarakat adat dan merawat warisan budaya Nusantara. Satu akhir pekan, sejuta makna di Cibarani Weekend: https://bamboochain.id/#/cibarani'
  }
];

const CibaraniShareModal = ({ onClose, initialTitle = 'Cibarani Weekend Experience' }) => {
  const [selectedHookIndex, setSelectedHookIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [generatingCanvas, setGeneratingCanvas] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Generate Canvas 1200 x 630 Share Image
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 630;

    // Draw background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 630);
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.5, '#065f46');
    grad.addColorStop(1, '#022c22');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);

    // Decorative golden borders
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 570);

    // Load authentic image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/gambar/pehcibarani.png';
    img.onload = () => {
      // Draw image inside right half
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(620, 60, 520, 510, [20]);
      ctx.clip();
      ctx.drawImage(img, 620, 60, 520, 510);
      ctx.restore();

      // Image border
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(620, 60, 520, 510, [20]);
      ctx.stroke();

      // Left Content
      drawText();
      setGeneratingCanvas(false);
    };

    img.onerror = () => {
      // Fallback if image load fails
      drawText();
      setGeneratingCanvas(false);
    };

    function drawText() {
      // Badge
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.roundRect(60, 70, 380, 38, [8]);
      ctx.fill();

      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillText('WISATA ADAT & EKOSISTEM DIGITAL', 75, 96);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 52px Inter, sans-serif';
      ctx.fillText('CIBARANI', 60, 175);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('WEEKEND', 60, 235);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('EXPERIENCE', 60, 295);

      // Subtitle
      ctx.fillStyle = '#a7f3d0';
      ctx.font = '22px Inter, sans-serif';
      ctx.fillText('Kasepuhan Cibarani • Lebak, Banten', 60, 340);

      // Hook tagline
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'italic 18px Inter, sans-serif';
      ctx.fillText('"One Weekend. A Thousand Stories. A Meaningful Journey."', 60, 380);

      // Pricing Card Box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.roundRect(60, 420, 520, 80, [12]);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 28px Inter, sans-serif';
      ctx.fillText('Rp 1.000.000', 80, 465);

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Inter, sans-serif';
      ctx.fillText('/ orang • 2 Hari 1 Malam (Sabtu - Minggu)', 265, 465);

      // Footer Branding
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '16px Inter, sans-serif';
      ctx.fillText('Yayasan Sabumi Nusantara Jaya & BaMbooChain (bamboochain.id)', 60, 550);
    }
  }, []);

  const handleCopy = () => {
    const text = VIRAL_HOOKS[selectedHookIndex].copy;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Cibarani-Weekend-Experience-Share.png';
    a.click();
  };

  const handleNativeShare = async () => {
    const text = VIRAL_HOOKS[selectedHookIndex].copy;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cibarani Weekend Experience',
          text: text,
          url: 'https://bamboochain.id/#/cibarani'
        });
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--bg-card, #ffffff)',
        color: 'var(--text-main, #0f172a)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        border: '1.5px solid var(--border-color, #cbd5e1)',
        overflow: 'hidden'
      }}>
        {/* MODAL HEADER */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="#fbbf24" />
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>
                Bagikan Cibarani Weekend Experience
              </div>
              <div style={{ fontSize: '0.74rem', opacity: 0.85 }}>
                Social Card Generator & Narasi Viral Berdampak
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div style={{
          padding: '18px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* CANVAS PREVIEW (RESPONSIVE SCALED) */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted, #475569)', marginBottom: '6px' }}>
              PREVIEW SOCIAL SHARE IMAGE (1200 x 630):
            </div>
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1.5px solid var(--border-color, #cbd5e1)',
              background: '#064e3b',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
            }}>
              <canvas
                ref={canvasRef}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                onClick={handleDownloadImage}
                style={{
                  background: 'var(--bg-secondary, #f1f5f9)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  color: 'var(--text-main, #0f172a)',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} /> Unduh Gambar (.png)
              </button>
            </div>
          </div>

          {/* VIRAL HOOK SELECTOR */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted, #475569)', marginBottom: '8px' }}>
              PILIH NARASI SHARING (VIRAL HOOKS):
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {VIRAL_HOOKS.map((hook, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedHookIndex(i)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    fontWeight: selectedHookIndex === i ? '800' : '600',
                    background: selectedHookIndex === i ? '#047857' : 'var(--bg-secondary, #f8fafc)',
                    color: selectedHookIndex === i ? '#ffffff' : 'var(--text-muted, #475569)',
                    border: '1px solid ' + (selectedHookIndex === i ? '#047857' : 'var(--border-color, #cbd5e1)'),
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  {hook.title}
                </button>
              ))}
            </div>

            {/* HOOK COPY BOX */}
            <div style={{
              marginTop: '10px',
              padding: '12px 14px',
              borderRadius: '14px',
              background: 'var(--bg-secondary, #f8fafc)',
              border: '1px solid var(--border-color, #e2e8f0)',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              color: 'var(--text-main, #1e293b)'
            }}>
              {VIRAL_HOOKS[selectedHookIndex].copy}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button
              onClick={handleCopy}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '14px',
                border: '1.5px solid var(--border-color, #cbd5e1)',
                background: copied ? '#dcfce7' : 'var(--bg-card, #ffffff)',
                color: copied ? '#166534' : 'var(--text-main, #0f172a)',
                fontWeight: '800',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Teks Tersalin!' : 'Salin Teks Sharing'}
            </button>

            <button
              onClick={handleNativeShare}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                color: '#ffffff',
                fontWeight: '900',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(6,95,70,0.3)'
              }}
            >
              <Share2 size={16} /> Bagikan Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CibaraniShareModal;

