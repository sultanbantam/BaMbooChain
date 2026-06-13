import React, { useState } from 'react';
import { ShoppingCart, Leaf, ShieldCheck, Truck, Package, ArrowRight, CheckCircle, Search, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PreOrderPage = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [poSubmitted, setPoSubmitted] = useState(false);

  const products = [
    {
      id: 'PO-BBB-01',
      title: 'Bibit Bambu Betung Super',
      category: 'Pembibitan',
      description: 'Bibit bambu betung kualitas super, siap tanam untuk perkebunan berskala besar. Garansi tumbuh 90%.',
      minOrder: 500,
      price: 15000,
      unit: 'rumpun',
      icon: <Leaf size={40} color="#0ca678" />
    },
    {
      id: 'PO-BAK-02',
      title: 'Bambu Awetan Konstruksi',
      category: 'Material',
      description: 'Bambu petung awetan standar ekspor. Diproses dengan boraks-boric acid. Tahan rayap dan hama hingga 25 tahun.',
      minOrder: 100,
      price: 120000,
      unit: 'batang',
      icon: <ShieldCheck size={40} color="#f59f00" />
    },
    {
      id: 'PO-PBL-03',
      title: 'Panel Bambu Laminasi (PBL)',
      category: 'Arsitektur',
      description: 'Papan bambu press kualitas tinggi untuk lantai, dinding, atau furnitur. Dimensi standar 122x244 cm.',
      minOrder: 50,
      price: 850000,
      unit: 'lembar',
      icon: <Package size={40} color="#3b82f6" />
    }
  ];

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  const handleSubmitPO = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Harap login terlebih dahulu untuk membuat Pre-Order.");
      openLoginModal();
      return;
    }
    
    if (quantity < selectedProduct.minOrder) {
      alert(`Minimal pemesanan untuk produk ini adalah ${selectedProduct.minOrder} ${selectedProduct.unit}.`);
      return;
    }

    setPoSubmitted(true);
    setTimeout(() => {
      setSelectedProduct(null);
      setPoSubmitted(false);
      setQuantity(100);
    }, 5000);
  };

  return (
    <div style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '8px 20px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '16px' }}>
            <ShoppingCart size={18} /> B2B Pre-Order
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '20px' }}>Katalog Produk Bambu</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            Pesan material bambu berkualitas tinggi secara langsung dari Koperasi Petani BaMbooChain untuk proyek konstruksi dan komersial Anda.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* CATALOG SECTION */}
          <div style={{ flex: '1 1 60%' }}>
            <div style={{ position: 'relative', marginBottom: '30px' }}>
              <Search size={20} style={{ position: 'absolute', left: '20px', top: '18px', color: '#adb5bd' }} />
              <input 
                type="text" 
                placeholder="Cari bibit, bambu awetan, atau panel laminasi..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '18px 20px 18px 50px', borderRadius: '20px', border: '1px solid #dee2e6', fontSize: '1rem', boxSizing: 'border-box', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  onClick={() => { setSelectedProduct(product); setQuantity(product.minOrder); setPoSubmitted(false); }}
                  style={{ 
                    background: 'white', padding: '30px', borderRadius: '24px', border: selectedProduct?.id === product.id ? '2px solid var(--primary)' : '1px solid #f1f3f5', 
                    cursor: 'pointer', transition: 'all 0.2s', boxShadow: selectedProduct?.id === product.id ? '0 10px 30px rgba(12,166,120,0.1)' : '0 4px 15px rgba(0,0,0,0.02)',
                    display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap'
                  }}
                >
                  <div style={{ background: '#f8f9fa', width: '100px', height: '100px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>{product.category}</div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 10px 0', color: 'var(--text-main)' }}>{product.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{product.description}</p>
                    
                    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 'bold' }}>HARGA EST.</div>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{formatRupiah(product.price)} <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'normal' }}>/ {product.unit}</span></div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 'bold' }}>MIN ORDER</div>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{product.minOrder} {product.unit}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#888', background: 'white', borderRadius: '24px', border: '1px solid #f1f3f5' }}>
                  Tidak ada produk yang cocok dengan pencarian "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          {/* PO FORM SECTION */}
          <div style={{ flex: '1 1 35%', position: 'sticky', top: '100px' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid #f1f3f5' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '10px' }}>Draft Purchase Order</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '30px' }}>Isi kuantitas untuk mengajukan PO. Tim kami akan menghubungi Anda untuk konfirmasi teknis & logistik.</p>

              {poSubmitted ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f0fdf4', borderRadius: '24px', border: '1px dashed #0ca678' }}>
                  <CheckCircle size={60} color="#0ca678" style={{ margin: '0 auto 20px' }} />
                  <h3 style={{ fontSize: '1.4rem', color: '#0ca678', marginBottom: '10px' }}>Pre-Order Diterima!</h3>
                  <p style={{ fontSize: '0.9rem', color: '#2b8a3e', margin: 0 }}>PO Anda sedang diproses. Silakan periksa Notifikasi dan Email Anda untuk langkah selanjutnya.</p>
                </div>
              ) : selectedProduct ? (
                <form onSubmit={handleSubmitPO} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '16px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold', marginBottom: '8px' }}>PRODUK TERPILIH</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{selectedProduct.title}</div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>
                      Kuantitas ({selectedProduct.unit})
                    </label>
                    <input 
                      type="number" 
                      min={selectedProduct.minOrder} 
                      value={quantity} 
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #dee2e6', fontSize: '1.2rem', fontWeight: 'bold', boxSizing: 'border-box' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '6px' }}>Minimal pesanan: {selectedProduct.minOrder} {selectedProduct.unit}</div>
                  </div>

                  <div style={{ borderTop: '1px solid #eee', margin: '10px 0' }}></div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Estimasi Total Harga</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)' }}>{formatRupiah(quantity * selectedProduct.price)}</div>
                    </div>
                  </div>

                  <div style={{ background: '#e7f5ff', padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '10px' }}>
                    <Info size={20} color="#228be6" style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '0.8rem', color: '#1864ab', lineHeight: '1.5' }}>
                      Total di atas belum termasuk biaya pengiriman dan pajak. Pembayaran akhir akan menggunakan smart contract escrow (USDT/USDC).
                    </div>
                  </div>

                  <button type="submit" style={{ width: '100%', padding: '16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px', boxShadow: '0 10px 20px rgba(12, 166, 120, 0.2)' }}>
                    Ajukan Purchase Order <ArrowRight size={20} />
                  </button>
                </form>
              ) : (
                <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '24px', border: '1px dashed #dee2e6' }}>
                  <Package size={48} color="#ced4da" style={{ margin: '0 auto 20px' }} />
                  <h3 style={{ fontSize: '1.2rem', color: '#888', margin: '0 0 10px 0' }}>Belum Ada Produk Terpilih</h3>
                  <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>Silakan pilih produk dari katalog di sebelah kiri untuk mulai membuat PO.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PreOrderPage;
