import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Handshake, Leaf, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: "pehc.JPG",
    title: "Potensi Industri Bambu Global: Peluang Ekonomi dan Dampak Lingkungan",
    desc: "Analisis berbasis data mengenai perkembangan industri bambu, produksi, pasar global, serta kontribusinya terhadap keberlanjutan lingkungan dan ekonomi masyarakat."
  },
  {
    image: "pehc2.JPG",
    title: "Masa Depan Konstruksi Hijau dan Inovasi Material",
    desc: "Bambu laminasi dan konstruksi modular hadir sebagai pengganti material konvensional. Kuat, tahan lama, dan menetralkan jejak karbon dunia."
  },
  {
    image: "pehc3.JPG",
    title: "Pemberdayaan Desa dan Restorasi Ekologi",
    desc: "Melalui budidaya dan pengembangan dari hulu ke hilir, kita tidak hanya menggerakkan roda ekonomi, tapi juga memulihkan mata air bumi."
  }
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Ganti slide otomatis setiap 5 detik
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* SECTION 1 - HERO SLIDER */}
      <section style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '160px',
        overflow: 'hidden'
      }}>
        {/* Latar Belakang Gambar Berjalan */}
        {slides.map((slide, index) => (
          <div 
            key={index} 
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url("${slide.image}") center/cover`,
              opacity: index === currentSlide ? 1 : 0,
              visibility: index === currentSlide ? 'visible' : 'hidden',
              transition: 'opacity 1s ease-in-out, visibility 1s ease-in-out',
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)', // Tambahan efek membesar sedikit
              transitionProperty: 'opacity, visibility, transform',
              transitionDuration: '1s, 1s, 6s',
              zIndex: -1
            }}
          />
        ))}

        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h1 
            key={`title-${currentSlide}`} // Agar animasi ke-trigger ulang saat slide ganti
            className="animate-fade-in-up"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '800', marginBottom: '24px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            {slides[currentSlide].title}
          </h1>
          <p 
            key={`desc-${currentSlide}`}
            className="animate-fade-in-up"
            style={{ fontSize: '1.25rem', opacity: '0.9', maxWidth: '800px', margin: '0 auto 40px', color: 'white', animationDelay: '0.2s' }}
          >
            {slides[currentSlide].desc}
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/insight" className="btn btn-crypto" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>LIHAT ANALISIS</Link>
            <Link to="/projects" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', background: 'transparent', border: '2px solid var(--primary)' }}>JELAJAHI PROYEK</Link>
          </div>
          
          {/* Indikator Titik (Dots) di Bawah */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
            {slides.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{ 
                  width: '12px', height: '12px', borderRadius: '50%', background: index === currentSlide ? 'var(--primary)' : 'rgba(255,255,255,0.4)', 
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s' 
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 - POSITIONING */}
      <section style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '20px' }}>Dari Indonesia untuk Industri Bambu Dunia</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto' }}>
            Indonesia memiliki potensi besar dalam pengembangan industri bambu berbasis produksi dan keberlanjutan, yang terhubung langsung dengan kebutuhan pasar global.
          </p>
        </div>
      </section>

      {/* SECTION 3 - DATA UTAMA */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '40px', textAlign: 'center' }}>Data Industri Bambu Berbasis Produksi</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            <div className="glass" style={{ padding: '30px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              <TrendingUp size={40} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>20-40%</h3>
              <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Estimasi ROI Industri</p>
              <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>(Berbasis studi kasus)</span>
            </div>
            <div className="glass" style={{ padding: '30px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              <Target size={40} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>1.000</h3>
              <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Kapasitas Produksi</p>
              <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>Lembar / Hari</span>
            </div>
            <div className="glass" style={{ padding: '30px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              <Handshake size={40} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>±Rp 680k</h3>
              <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Harga Produk</p>
              <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>Per Lembar</span>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#6c757d', fontStyle: 'italic' }}>
            *Catatan: Data merupakan estimasi dan dapat bervariasi tergantung lokasi, skala, dan model bisnis.
          </p>
        </div>
      </section>

      {/* SECTION 4 - SKALA INDUSTRI */}
      <section style={{ padding: '80px 0', background: 'var(--primary)', color: 'white' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Industri yang Berpotensi Tumbuh Global</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', opacity: '0.9' }}>
              Permintaan global terhadap material bambu meningkat sebagai alternatif kayu, logam, plastik, benang dan energi fosil yang lebih ramah lingkungan. Industri ini memiliki peluang berkembang pesat dalam sektor konstruksi, manufaktur, tekstil dan ekonomi karbon.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 - MODEL BISNIS */}
      <section style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '40px', textAlign: 'center' }}>Model Ekonomi Industri Bambu</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div className="glass" style={{ padding: '30px', background: 'white', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>1</div>
                <h3 style={{ fontSize: '1.3rem' }}>Produk Industri</h3>
              </div>
              <p style={{ color: 'var(--text-muted)' }}>Bambu laminasi, konstruksi modular, dan serat (tekstil) bambu berkualitas ekspor.</p>
            </div>
            
            <div className="glass" style={{ padding: '30px', background: 'white', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>2</div>
                <h3 style={{ fontSize: '1.3rem' }}>Rantai Pasok</h3>
              </div>
              <p style={{ color: 'var(--text-muted)' }}>Membangun distribusi bahan baku dan produk dari daerah potensial ke hilir industri masif.</p>
            </div>

            <div className="glass" style={{ padding: '30px', background: 'white', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>3</div>
                <h3 style={{ fontSize: '1.3rem' }}>Nilai Lingkungan</h3>
              </div>
              <p style={{ color: 'var(--text-muted)' }}>Potensi ekonomi tambahan terukur dari jasa ekosistem lingkungan dan serapan kredit karbon.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - PROYEK */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '50px', textAlign: 'center' }}>Contoh Proyek Pengembangan Bambu</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <div style={{ height: '200px', background: 'url("gambar/pehcibarani.png") center/cover' }}></div>
              <div style={{ padding: '30px' }}>
                <div style={{ color: 'var(--primary)', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  <MapPin size={16} /> Banten (490 Ha)
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Perkebunan Emas Hijau Cibarani – Lebak</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Restorasi, produksi bambu terintegrasi dan sabuk ekologis untuk melindungi hutan adat dan hutan lindung dari illegal logging serta aktivitas penambangan emas liar.</p>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <div style={{ height: '200px', background: 'url("gambar/ceap.png") center/cover' }}></div>
              <div style={{ padding: '30px' }}>
                <div style={{ color: 'var(--primary)', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  <MapPin size={16} /> Tangerang Raya (120 Ha)
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Cisadane Adventure Eco Park</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Integrating environmental conservation, bamboo innovation, community economic development, and eco-based nature tourism.</p>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <div style={{ height: '200px', background: 'url("gambar/mbh.jpeg") center/cover' }}></div>
              <div style={{ padding: '30px' }}>
                <div style={{ color: 'var(--primary)', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  <MapPin size={16} /> Sumatera (Nasional)
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Proyek Rumah Hunian Tetap Tipe 36</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Hunian modular pasca bencana lingkungan di area Sumatera, menyumbang hingga 6.000 unit produksi hunian terstandarisasi berbasis bambu ramah lingkungan.</p>
              </div>
            </div>

          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/projects" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              LIHAT DETAIL PROYEK <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7 - EKOSISTEM */}
      <section style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '60px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '24px' }}>Ekosistem Industri Bambu</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><CheckCircle size={24} color="var(--primary)" /> Budidaya dan penanaman</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><CheckCircle size={24} color="var(--primary)" /> Produksi dan pengolahan inovatif</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><CheckCircle size={24} color="var(--primary)" /> Distribusi dan pasar yang meluas</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><CheckCircle size={24} color="var(--primary)" /> Pemanfaatan teknologi untuk monitoring & transparansi</li>
              </ul>
            </div>
            <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--primary)' }}>Dampak Integrasi Kami</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Leaf size={20} color="var(--primary)" /> Restorasi lahan kritis dan terdegradasi</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Leaf size={20} color="var(--primary)" /> Perlindungan sistem sumber mata air bawah tanah</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Leaf size={20} color="var(--primary)" /> Pemberdayaan ekonomi warga di daerah rural</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 - IMPACT */}
      <section style={{ padding: '80px 0', background: 'var(--primary)', color: 'white' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Dampak Lingkungan dan Sosial</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>±490 Ha</h3>
              <p style={{ opacity: '0.9', marginTop: '10px' }}>Kawasan Prioritas Dilindungi</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>±50.000</h3>
              <p style={{ opacity: '0.9', marginTop: '10px' }}>Bibit Bambu Baru Ditanam</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>100%</h3>
              <p style={{ opacity: '0.9', marginTop: '10px' }}>Perlindungan Sumber Mata Air</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Berkelanjutan</h3>
              <p style={{ opacity: '0.9', marginTop: '10px' }}>Peningkatan Ekonomi Lokal Rutin</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 - PARTNERS */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '20px' }}>Mitra & Kolaborasi</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
            Kami bekerja sama dengan berbagai pihak dalam pengembangan ekosistem bambu berkelanjutan, termasuk Komunitas & masyarakat adat, Akademisi & peneliti, Industri & manufaktur, Pemerintah & lembaga, serta Teknologi & digital.
          </p>
          <div style={{ padding: '40px', background: '#f4fbf4', borderRadius: '16px', display: 'inline-block', minWidth: '300px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Menjadi Mitra</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Terbuka untuk kolaborasi dalam pengembangan industri bambu berkelanjutan.</p>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '12px 24px' }}>HUBUNGI KAMI</Link>
          </div>
        </div>
      </section>

      {/* SECTION 10 - CTA */}
      <section style={{ padding: '100px 0', background: '#212529', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '3rem', marginBottom: '24px' }}>Pelajari Lebih Lanjut</h2>
          <p style={{ fontSize: '1.2rem', opacity: '0.8', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Jelajahi data, analisis, dan perkembangan masa depan terkait industri primer bambu yang dapat diperbarui secara berkelanjutan.
          </p>
          <Link to="/insight" className="btn btn-crypto" style={{ padding: '20px 40px', fontSize: '1.2rem' }}>LIHAT INSIGHT</Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
