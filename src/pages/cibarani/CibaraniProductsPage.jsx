import React, { useState } from 'react';
import { 
  ShoppingBag, Phone, CheckCircle2, Tag, 
  Sparkles, ExternalLink, Filter, ArrowRight
} from 'lucide-react';
import CibaraniNavHeader from '../../components/cibarani/CibaraniNavHeader';
import { useCibaraniStore } from '../../services/cibarani/cibaraniStore';
import SocialInteractions from '../../components/SocialInteractions';

const CibaraniProductsPage = () => {
  const { products } = useCibaraniStore();
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'Hasil Hutan Non-Kayu', 'Pangan Alami', 'Pertanian Organik', 'Bahan Bangunan Alami'];

  const filteredProducts = selectedCategory === 'ALL'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleOrderWhatsApp = (product) => {
    const text = `Halo Pengelola Cibarani, saya tertarik memesan produk lokal: *${product.name}* (Harga indikatif: Rp ${product.indicativePrice.toLocaleString('id-ID')} ${product.priceUnit}). Mohon informasi ketersediaan stok & pengirimannya.`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', color: 'var(--text-main, #0f172a)', paddingBottom: '60px' }}>
      <CibaraniNavHeader />

      <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 16px' }}>
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#047857', letterSpacing: '1px', textTransform: 'uppercase' }}>
            PASAR LOKAL & HASIL BUMI ADAT
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '6px 0 10px' }}>
            Hasil Bumi Murni Kasepuhan Cibarani
          </h1>
          <p style={{ color: 'var(--text-muted, #64748b)', maxWidth: '640px', margin: '0 auto', fontSize: '0.92rem' }}>
            Diproduksi dan dipanen secara lestari oleh warga desa, petani huma, dan kelompok pemanen madu hutan adat. Mendukung ekonomi langsung tanpa perantara tengkulak.
          </p>
        </div>

        {/* CATEGORY FILTER */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '24px',
          justifyContent: 'center'
        }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              style={{
                padding: '8px 16px',
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
              {c === 'ALL' ? 'Semua Produk' : c}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1.5px solid var(--border-color, #cbd5e1)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(6, 78, 59, 0.9)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(4px)'
                }}>
                  {p.category}
                </span>
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 6px', color: 'var(--text-main, #0f172a)' }}>
                  {p.name}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: '700', marginBottom: '10px' }}>
                  Petani / Produsen: {p.producer}
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted, #475569)', lineHeight: 1.5, flex: 1, margin: '0 0 16px' }}>
                  {p.desc}
                </p>

                {/* PRICING */}
                <div style={{
                  background: 'var(--bg-secondary, #f8fafc)',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)', fontWeight: '700' }}>
                    HARGA INDIKATIF:
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#047857' }}>
                    Rp {p.indicativePrice.toLocaleString('id-ID')}
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted, #64748b)', marginLeft: '4px' }}>
                      {p.priceUnit}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: '800', marginTop: '2px' }}>
                    Status: {p.stockStatus}
                  </div>
                </div>

                <button
                  onClick={() => handleOrderWhatsApp(p)}
                  style={{
                    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '14px',
                    fontWeight: '800',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Phone size={16} /> Pesan Langsung via WhatsApp
                </button>
              </div>

              {/* SOCIAL INTERACTION PER PRODUCT */}
              <div style={{ borderTop: '1px solid var(--border-color, #e2e8f0)', padding: '12px 18px', background: 'var(--bg-secondary, #f8fafc)' }}>
                <SocialInteractions 
                  entityId={`cibarani_prd_${p.id}`}
                  inCard={true}
                  customShareTitle={`${p.name} - Hasil Bumi Kasepuhan Cibarani`}
                  customShareUrl={`https://bamboochain.id/#/cibarani/products`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CibaraniProductsPage;

