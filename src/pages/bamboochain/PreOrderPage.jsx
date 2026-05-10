import React, { useMemo, useState } from 'react';
import { CheckCircle, Clock, FileText, PackageCheck, ShoppingBag, Truck, X } from 'lucide-react';
import BackButton from '../../components/BackButton';
import { useAuth } from '../../context/AuthContext';
import { getAssetUrl } from '../../utils/assets';

const products = [
  {
    id: 'PO-LAM-001',
    name: 'Bambu Laminasi GLB',
    category: 'Material Konstruksi',
    price: 'Rp 680.000 / lembar',
    minOrder: 50,
    unit: 'lembar',
    leadTime: '21-30 hari',
    image: getAssetUrl('gambar/produk_unggulan/Laminasi.jpeg'),
    specs: ['Panel siap finishing', 'Kadar air terkontrol', 'Cocok untuk struktur ringan dan interior'],
  },
  {
    id: 'PO-MBB-002',
    name: 'Modular Bamboo Building Tipe 36',
    category: 'Rumah Modular',
    price: 'By quotation',
    minOrder: 1,
    unit: 'unit',
    leadTime: '45-60 hari',
    image: getAssetUrl('gambar/produk_unggulan/mbb.jpeg'),
    specs: ['Sistem knock-down', 'Komponen prefabrikasi', 'Desain dapat disesuaikan kebutuhan proyek'],
  },
  {
    id: 'PO-INT-003',
    name: 'Panel Interior Bambu Premium',
    category: 'Interior',
    price: 'Rp 420.000 / panel',
    minOrder: 25,
    unit: 'panel',
    leadTime: '14-21 hari',
    image: getAssetUrl('gambar/produk_unggulan/Interior.jpeg'),
    specs: ['Motif natural', 'Finishing halus', 'Untuk dinding, plafon, furnitur, dan dekorasi'],
  },
];

const PreOrderPage = () => {
  const { isAuthenticated, openLoginModal, user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(50);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const estimatedTotal = useMemo(() => {
    if (!selectedProduct || !selectedProduct.price.includes('Rp')) return 'Menunggu quotation';
    const amount = Number(selectedProduct.price.replace(/\D/g, ''));
    return `Rp ${(amount * quantity).toLocaleString('id-ID')}`;
  }, [quantity, selectedProduct]);

  const openPreOrder = (product) => {
    setSelectedProduct(product);
    setQuantity(product.minOrder);
    setNotes('');
    setSubmitted(false);
  };

  const submitPreOrder = (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (quantity < selectedProduct.minOrder) {
      alert(`Minimal pemesanan ${selectedProduct.minOrder} ${selectedProduct.unit}.`);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ marginBottom: '28px' }}>
        <BackButton to="/bamboochain/marketplace" />
      </div>

      <div className="container" style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '999px', fontWeight: '800', marginBottom: '18px' }}>
          <ShoppingBag size={18} /> B2B Pre-Order
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>Katalog Produk Bambu</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '720px', margin: '0 auto' }}>
          Ajukan pre-order untuk kebutuhan proyek, distributor, kontraktor, dan mitra manufaktur. Tim BaMbooChain akan memvalidasi volume, spesifikasi, dan jadwal produksi.
        </p>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '28px' }}>
        {products.map((product) => (
          <div key={product.id} style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 34px rgba(0,0,0,0.06)', border: '1px solid #edf2f7' }}>
            <div style={{ height: '230px', position: 'relative' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.72)', color: 'white', borderRadius: '999px', padding: '6px 12px', fontSize: '0.78rem', fontWeight: '800' }}>
                {product.category}
              </span>
            </div>
            <div style={{ padding: '26px' }}>
              <div style={{ color: '#adb5bd', fontSize: '0.78rem', fontWeight: '800', marginBottom: '8px' }}>{product.id}</div>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '10px' }}>{product.name}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800' }}>Harga</div>
                  <div style={{ color: 'var(--primary)', fontWeight: '900' }}>{product.price}</div>
                </div>
                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800' }}>Lead Time</div>
                  <div style={{ color: 'var(--text-main)', fontWeight: '900' }}>{product.leadTime}</div>
                </div>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                {product.specs.map((spec) => (
                  <li key={spec} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} color="var(--primary)" /> {spec}
                  </li>
                ))}
              </ul>
              <button onClick={() => openPreOrder(product)} className="btn btn-primary" style={{ width: '100%', padding: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                Buat Pre-Order <PackageCheck size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="container" style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        {[
          [FileText, '1. Ajukan PO', 'Isi volume, kebutuhan, dan catatan teknis proyek.'],
          [Clock, '2. Validasi', 'Tim mengecek kapasitas produksi, spesifikasi, dan jadwal.'],
          [Truck, '3. Produksi & Kirim', 'Pesanan diproses setelah quotation dan termin disepakati.'],
        ].map(([Icon, title, desc]) => {
          const icon = React.createElement(Icon, { size: 26, color: 'var(--primary)', style: { marginBottom: '12px' } });
          return (
            <div key={title} style={{ background: 'white', border: '1px solid #edf2f7', borderRadius: '18px', padding: '22px' }}>
              {icon}
              <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
            </div>
          );
        })}
      </div>

      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '520px', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#f1f3f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} />
            </button>
            <div style={{ padding: '34px' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <CheckCircle size={54} color="var(--primary)" style={{ marginBottom: '18px' }} />
                  <h2 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>Pre-Order Diterima</h2>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    PO {selectedProduct.name} atas nama {user?.name || 'member'} sedang diproses. Tim akan menghubungi Anda untuk quotation dan jadwal produksi.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitPreOrder} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.82rem', marginBottom: '8px' }}>{selectedProduct.id}</div>
                    <h2 style={{ color: 'var(--text-main)', marginBottom: '6px' }}>{selectedProduct.name}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Minimal order {selectedProduct.minOrder} {selectedProduct.unit}</p>
                  </div>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '700' }}>
                    Jumlah ({selectedProduct.unit})
                    <input type="number" min={selectedProduct.minOrder} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid #dee2e6', fontSize: '1rem' }} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '700' }}>
                    Catatan teknis
                    <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Contoh: ukuran panel, lokasi proyek, target pengiriman..." rows={4} style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid #dee2e6', fontSize: '1rem', resize: 'vertical' }} />
                  </label>
                  <div style={{ background: '#f8f9fa', borderRadius: '14px', padding: '16px', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '700' }}>Estimasi</span>
                    <strong style={{ color: 'var(--primary)' }}>{estimatedTotal}</strong>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    Kirim Pre-Order <PackageCheck size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreOrderPage;
