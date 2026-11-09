import React, { useState } from 'react';
import { 
  Image as ImageIcon, Filter, X, Camera, ShieldCheck, 
  Share2, Heart, Download, CheckCircle2
} from 'lucide-react';
import CibaraniNavHeader from '../../components/cibarani/CibaraniNavHeader';
import { useCibaraniStore } from '../../services/cibarani/cibaraniStore';
import SocialInteractions from '../../components/SocialInteractions';

const CibaraniGalleryPage = () => {
  const { gallery } = useCibaraniStore();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activePhoto, setActivePhoto] = useState(null);

  const categories = ['ALL', 'Lanskap', 'Leuit & Pangan', 'Alam & Air', 'Rumah Adat', 'Bambu', 'Produk Lokal'];

  const filteredGallery = selectedCategory === 'ALL'
    ? gallery
    : gallery.filter(g => g.category === selectedCategory);

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', color: 'var(--text-main, #0f172a)', paddingBottom: '60px' }}>
      <CibaraniNavHeader />

      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 16px' }}>
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#047857', letterSpacing: '1px', textTransform: 'uppercase' }}>
            DOKUMENTASI VISUAL AUTENTIK
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '6px 0 10px' }}>
            Galeri Alam, Budaya & Kehidupan Cibarani
          </h1>
          <p style={{ color: 'var(--text-muted, #64748b)', maxWidth: '640px', margin: '0 auto', fontSize: '0.92rem' }}>
            Potret nyata keindahan bentang alam adat, kehangatan warga Kasepuhan, dan kearifan lumbung leuit yang diabadikan dengan izin masyarakat.
          </p>
        </div>

        {/* CATEGORY FILTERS */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '20px',
          justifyContent: 'center'
        }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              style={{
                padding: '8px 18px',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontWeight: selectedCategory === c ? '800' : '600',
                background: selectedCategory === c ? '#047857' : 'var(--bg-card, #ffffff)',
                color: selectedCategory === c ? '#ffffff' : 'var(--text-muted, #475569)',
                border: '1.5px solid ' + (selectedCategory === c ? '#047857' : 'var(--border-color, #cbd5e1)'),
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {c === 'ALL' ? 'Semua Foto' : c}
            </button>
          ))}
        </div>

        {/* GALLERY MASONRY / GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1.5px solid var(--border-color, #cbd5e1)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(4px)'
                }}>
                  {item.category}
                </span>
                <span style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(16, 185, 129, 0.9)',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  padding: '3px 8px',
                  borderRadius: '8px'
                }}>
                  ✓ Izin Publikasi
                </span>
              </div>

              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', marginBottom: '4px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                  Kredit: {item.photographer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LIGHTBOX MODAL */}
        {activePhoto && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: '24px',
              maxWidth: '800px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              border: '1.5px solid var(--border-color, #cbd5e1)'
            }}>
              <div style={{ position: 'relative', maxHeight: '520px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  style={{ maxWidth: '100%', maxHeight: '520px', objectFit: 'contain' }}
                />
                <button
                  onClick={() => setActivePhoto(null)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'rgba(4,120,87,0.1)', color: '#047857', padding: '3px 10px', borderRadius: '6px' }}>
                    {activePhoto.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: '700' }}>
                    ✓ Izin Publikasi Adat Terverifikasi
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '0 0 6px' }}>
                  {activePhoto.title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted, #64748b)', margin: '0 0 16px' }}>
                  Foto oleh {activePhoto.photographer} • Kasepuhan Cibarani, Lebak, Banten
                </p>

                {/* SOCIAL INTERACTIONS ON PHOTO */}
                <div style={{ borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '14px' }}>
                  <SocialInteractions 
                    entityId={`cibarani_photo_${activePhoto.id}`}
                    customShareTitle={`${activePhoto.title} - Galeri Cibarani`}
                    customShareUrl={`https://bamboochain.id/#/cibarani/gallery`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CibaraniGalleryPage;

