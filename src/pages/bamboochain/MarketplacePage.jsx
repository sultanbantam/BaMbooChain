import React, { useState, useEffect } from 'react';
import { ShoppingCart, Tag, Filter, Search, PlusCircle, Star, Image as ImageIcon, ArrowRightLeft, BarChart3, Info, TrendingUp, TrendingDown } from 'lucide-react';
import AdSpace from '../../components/AdSpace';
import BackButton from '../../components/BackButton';

const MarketplacePage = () => {
  const categories = ["Semua", "Material konstruksi", "Furniture", "Kerajinan", "NFT Bamboo"];
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [bursaData, setBursaData] = useState([
    { type: "Bambu Betung (Meter)", price: 12500, trend: "+2.4%", up: true },
    { type: "Bambu Wulung (Meter)", price: 9800, trend: "-1.1%", up: false },
    { type: "Bambu Tali (Meter)", price: 7200, trend: "+0.5%", up: true },
    { type: "Papan Lapis (Lbr)", price: 85000, trend: "+4.2%", up: true },
  ]);
  const [lastSync, setLastSync] = useState(new Date());

  // Simulation: Global Market Sync
  useEffect(() => {
    const interval = setInterval(() => {
      setBursaData(prev => prev.map(item => {
        const change = (Math.random() * 200 - 100); // Random fluctuation +/- 100
        const newPrice = Math.max(1000, item.price + change);
        const up = change >= 0;
        const trend = `${up ? '+' : ''}${(Math.random() * 5).toFixed(1)}%`;
        return { ...item, price: Math.round(newPrice), up, trend };
      }));
      setLastSync(new Date());
    }, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const products = [
    { id: 1, name: "Bambu Betung Tahan Rayap", category: "Material konstruksi", price: "50 BMC / batang", vendor: "Koperasi Cibarani", rating: 4.8, img: "https://images.unsplash.com/photo-1542450530-5bfa5dfef006?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "Kursi Santai Bambu Wulung", category: "Furniture", price: "450 BMC", vendor: "EcoFurn Jabar", rating: 4.9, img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 3, name: "Lampu Hias Anyaman", category: "Kerajinan", price: "120 BMC", vendor: "Bamboo Art BDG", rating: 4.7, img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 4, name: "Genesis bambuNUSA NFT #01", category: "NFT Bamboo", price: "1000 BMC", vendor: "BaMbooChain Official", rating: 5.0, img: "https://images.unsplash.com/photo-1618331835717-801e976710b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 5, name: "Papan Bambu Lapis (Plywood)", category: "Material konstruksi", price: "300 BMC / lembar", vendor: "Mitra Pabrik Jateng", rating: 4.6, img: "https://images.unsplash.com/photo-1598928376916-2fd125c192bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { id: 6, name: "Meja Kerja Minimalis", category: "Furniture", price: "600 BMC", vendor: "EcoFurn Jabar", rating: 4.8, img: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  ];

  const filteredProducts = activeCategory === "Semua" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
      
      {/* HEADER SECTION */}
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '50px' }}>
        <BackButton />
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>bambuNUSA Marketplace</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '32px' }}>
          Produk bambu untuk dunia. Eksplorasi kerajinan, bahan konstruksi lestari, hingga aset digital secara langsung dari komunitas kreator kami.
        </p>
        <button className="btn btn-crypto" style={{ padding: '14px 40px', fontSize: '1.1rem', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={20} /> Jual Produk Anda
        </button>
      </div>

      <div className="container" style={{ marginBottom: '60px' }}>
         {/* BURSA BAMBU (COMMODITY EXCHANGE) */}
         <div style={{ background: '#f8f9fa', borderRadius: '24px', padding: '32px', border: '1px solid #e9ecef', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <BarChart3 size={24} color="var(--primary)" /> Bursa Bambu (Raw Materials)
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(12,166,120,0.1)', padding: '6px 12px', borderRadius: '20px', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                    LIVE SYNC GLOBAL
                  </div>
               </div>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Bursa komoditas bambu skala besar. Harga sinkron otomatis dengan <span style={{ fontWeight: 'bold' }}>Global Bamboo & Wood Index (GBWI)</span>.
                  <br/>
                  <span style={{ fontSize: '0.75rem', color: '#adb5bd' }}>Terakhir diperbarui: {lastSync.toLocaleTimeString()}</span>
               </p>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  {bursaData.map((item, idx) => (
                    <div key={idx} style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #f1f3f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.5s' }}>
                       <div>
                          <div style={{ fontSize: '0.75rem', color: '#adb5bd', fontWeight: 'bold' }}>{item.type}</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>Rp {item.price.toLocaleString('id-ID')}</div>
                       </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: item.up ? '#12b886' : '#fa5252', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {item.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {item.trend}
                        </div>
                    </div>
                  ))}
               </div>

               <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                  <button style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowRightLeft size={18} /> Transaksi di Bursa
                  </button>
                  <button style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid #ced4da', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={18} /> Aturan Trading
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="container">
        
        {/* Kontrol & Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                style={{ 
                  background: activeCategory === cat ? 'var(--primary)' : 'white', 
                  color: activeCategory === cat ? 'white' : 'var(--text-main)', 
                  border: activeCategory === cat ? '1px solid var(--primary)' : '1px solid #dee2e6', 
                  padding: '8px 20px', 
                  borderRadius: '20px', 
                  fontWeight: '600', 
                  fontSize: '0.9rem', 
                  cursor: 'pointer', 
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s' 
                }}>
                {cat === 'NFT Bamboo' && <ImageIcon size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}/>}
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px' }} />
              <input type="text" placeholder="Cari di marketplace..." style={{ padding: '10px 16px 10px 42px', borderRadius: '24px', border: '1px solid #ced4da', fontSize: '0.9rem', minWidth: '250px' }} />
            </div>
            <button style={{ background: 'white', border: '1px solid #ced4da', padding: '10px 16px', borderRadius: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: '600' }}>
              <Filter size={18} /> Urutkan
            </button>
          </div>
        </div>

        {/* Main Content Layout with Sidebar for Ads */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'start' }}>
          
          {/* LEFT: PRODUCTS */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {filteredProducts.map(product => (
            <div key={product.id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', cursor: 'pointer' }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              
              <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <Tag size={12} /> {product.category}
                </div>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ color: '#f59f00', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    <Star size={14} fill="#f59f00" /> {product.rating}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{product.vendor}</div>
                </div>
                
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '8px', lineHeight: '1.4' }}>{product.name}</h3>
                
                <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--primary)' }}>{product.price}</div>
                  <button style={{ background: '#f8f9fa', border: '1px solid #e9ecef', padding: '10px', borderRadius: '50%', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

            {filteredProducts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <ShoppingCart size={48} color="#dee2e6" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.2rem' }}>Etalase Sedang Kosong</h3>
                <p>Belum ada produk di kategori ini.</p>
              </div>
            )}
          </div>

          {/* RIGHT: SIDEBAR ADS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '100px' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Sponsored</h4>
            <AdSpace type="vertical" height="400px" />
            <AdSpace type="vertical" height="250px" />
            <div style={{ background: 'linear-gradient(135deg, #1b5e20, var(--primary))', padding: '24px', borderRadius: '24px', color: 'white' }}>
               <h5 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Mulai Beriklan?</h5>
               <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', opacity: 0.9 }}>Jangkau ribuan penggiat bambu dan ekonomi hijau di seluruh Nusantara.</p>
               <a href="https://wa.me/628174139994" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'white', color: 'var(--primary)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'inline-block' }}>Daftar Sekarang</a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MarketplacePage;
