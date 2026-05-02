import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, ShieldCheck, HelpCircle, Box, Cpu, GraduationCap, ShoppingCart, Hammer, BarChart3, Wallet, Layout, Globe, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    { name: 'Semua', icon: HelpCircle },
    { name: 'UMUM', icon: Globe },
    { name: 'AI & BOT', icon: Cpu },
    { name: 'AKADEMI', icon: GraduationCap },
    { name: 'PASAR', icon: ShoppingCart },
    { name: 'KONSTRUKSI', icon: Hammer },
    { name: 'DATA TOOLS', icon: Box },
    { name: 'ANALISIS', icon: BarChart3 },
    { name: 'WALLET', icon: Wallet },
    { name: 'REWARD', icon: Layout },
    { name: 'KOMUNITAS', icon: MessageCircle },
    { name: 'KEAMANAN', icon: ShieldCheck },
    { name: 'DISCLAIMER', icon: AlertTriangle }
  ];

  const faqs = [
    // 1. UMUM
    { category: 'UMUM', q: "Apa itu platform Bamboo Ecosystem ini?", a: "Platform ini adalah ekosistem digital yang mengintegrasikan edukasi, industri, marketplace, dan teknologi blockchain untuk mendukung pengembangan bambu secara global." },
    { category: 'UMUM', q: "Apa tujuan utama website ini?", a: "Tujuannya adalah membangun ekosistem bambu yang terintegrasi dari hulu ke hilir, mulai dari pengetahuan, produksi, hingga pasar." },
    { category: 'UMUM', q: "Siapa saja yang bisa menggunakan platform ini?", a: "Masyarakat umum, Investor & pelaku industri, Petani bambu, Arsitek & kontraktor, Peneliti & akademisi." },
    
    // 2. AI
    { category: 'AI & BOT', q: "Apa itu Bambupedia?", a: "Bambupedia adalah perpustakaan digital bambu berbasis AI yang menyediakan informasi lengkap tentang bambu." },
    { category: 'AI & BOT', q: "Apa itu BambuBot?", a: "BambuBot adalah asisten AI yang dapat menjawab pertanyaan terkait bambu, mulai dari teknis hingga bisnis." },
    { category: 'AI & BOT', q: "Apakah penggunaan BambuBot gratis?", a: "Pengguna mendapatkan akses gratis terbatas, selanjutnya akses berbayar menggunakan token BMC." },
    { category: 'AI & BOT', q: "Apakah jawaban AI bisa dijadikan acuan profesional?", a: "Jawaban bersifat edukasi dan informasi umum, bukan pengganti konsultasi profesional." },

    // 3. AKADEMI
    { category: 'AKADEMI', q: "Apa itu Akademi Bambu Nusantara?", a: "Platform pembelajaran yang menyediakan kurikulum tentang industri bambu, dari dasar hingga profesional." },
    { category: 'AKADEMI', q: "Apakah kursus berbayar?", a: "Sebagian gratis, sebagian premium menggunakan BMC." },
    { category: 'AKADEMI', q: "Apakah ada sertifikasi?", a: "Ya, beberapa program menyediakan sertifikat kompetensi." },

    // 4. PASAR
    { category: 'PASAR', q: "Apa itu Bursa Bambu?", a: "Platform untuk jual beli bambu mentah, bambu olahan, dan produk turunannya." },
    { category: 'PASAR', q: "Apakah saya bisa menjual produk di platform ini?", a: "Ya, siapa pun bisa menjadi penjual setelah mendaftar." },
    { category: 'PASAR', q: "Bagaimana sistem transaksi?", a: "Transaksi dapat dilakukan menggunakan sistem digital dan token BMC." },
    { category: 'PASAR', q: "Apakah harga transparan?", a: "Ya, harga ditampilkan secara terbuka untuk menciptakan pasar yang efisien." },

    // 5. KONSTRUKSI
    { category: 'KONSTRUKSI', q: "Apa itu layanan tenaga kerja bambu?", a: "Platform ini menghubungkan pengguna dengan tukang dan tenaga kerja konstruksi bambu." },
    { category: 'KONSTRUKSI', q: "Apakah tukang sudah terverifikasi?", a: "Ya, tersedia sistem rating dan review untuk menjaga kualitas." },
    { category: 'KONSTRUKSI', q: "Apakah bisa membuat proyek konstruksi melalui platform?", a: "Ya, pengguna dapat membuat proyek dan mencari tenaga kerja sesuai kebutuhan." },

    // 6. DATA TOOLS
    { category: 'DATA TOOLS', q: "Apa itu fitur deteksi bambu?", a: "Fitur berbasis AI yang dapat mengidentifikasi jenis, kesehatan, dan kondisi bambu." },
    { category: 'DATA TOOLS', q: "Apakah data bambu bisa diakses publik?", a: "Sebagian data gratis, sebagian premium menggunakan BMC." },
    { category: 'DATA TOOLS', q: "Apakah saya bisa berkontribusi data?", a: "Ya, pengguna dapat mengunggah data dan mendapatkan reward BMC." },

    // 7. ANALISIS
    { category: 'ANALISIS', q: "Apa fungsi fitur analisis pasar?", a: "Memberikan insight dan data tren pasar global (crypto & saham)." },
    { category: 'ANALISIS', q: "Apakah ini memberikan rekomendasi investasi?", a: "Tidak. Informasi hanya bersifat edukasi, bukan saran investasi." },

    // 8. WALLET
    { category: 'WALLET', q: "Apa itu BMC?", a: "BMC adalah token utilitas yang digunakan dalam ekosistem BambooChain." },
    { category: 'WALLET', q: "Untuk apa BMC digunakan?", a: "Akses fitur premium, reward kontribusi, transaksi marketplace, dan voting komunitas." },
    { category: 'WALLET', q: "Apakah saya otomatis punya wallet?", a: "Ya, saat mendaftar Anda akan mendapatkan wallet digital secara otomatis." },
    { category: 'WALLET', q: "Bagaimana cara mendapatkan BMC?", a: "Membeli, check-in harian, kontribusi data, aktivitas platform, dan marketplace." },

    // 9. REWARD
    { category: 'REWARD', q: "Bagaimana cara mendapatkan reward?", a: "Melalui check-in, bermain game, kontribusi data, dan aktivitas komunitas." },
    { category: 'REWARD', q: "Apakah reward bisa diuangkan?", a: "Reward dapat digunakan dalam ekosistem atau ditransaksikan sesuai kebijakan platform." },

    // 10. KOMUNITAS
    { category: 'KOMUNITAS', q: "Apa itu WebNUSA?", a: "Program wisata edukasi bambu dan kegiatan komunitas." },
    { category: 'KOMUNITAS', q: "Apakah bisa ikut event?", a: "Ya, pengguna dapat mendaftar event melalui platform." },

    // 11. KEAMANAN
    { category: 'KEAMANAN', q: "Apakah data saya aman?", a: "Platform menggunakan standar keamanan digital untuk melindungi data pengguna. (Learn With Bamboo)" },
    { category: 'KEAMANAN', q: "Apakah wallet saya aman?", a: "Wallet menggunakan sistem keamanan berbasis blockchain." },

    // 12. DISCLAIMER
    { category: 'DISCLAIMER', q: "Apakah platform ini menyediakan layanan investasi?", a: "Tidak. Semua informasi bersifat edukasi dan bukan rekomendasi investasi." },
    { category: 'DISCLAIMER', q: "Apakah ada risiko?", a: "Ya, penggunaan teknologi digital dan blockchain memiliki risiko yang harus dipahami pengguna." }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'Semua' || faq.category === activeCategory;
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ paddingTop: '180px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ padding: '40px 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>Pusat Bantuan & FAQ</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 32px' }}>
            Temukan jawaban atas pertanyaan Anda seputar fitur dan ekosistem BaMbooChain.
          </p>
          
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input 
              type="text" 
              placeholder="Cari pertanyaan... (misal: Token BMC, Akademi)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '16px 16px 16px 56px', borderRadius: '30px', border: '1px solid #dee2e6', outline: 'none', fontSize: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} 
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', marginBottom: '40px' }}>
          {categories.map((cat) => (
            <button 
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              style={{ 
                background: activeCategory === cat.name ? 'var(--primary)' : 'white',
                color: activeCategory === cat.name ? 'white' : 'var(--text-main)',
                border: activeCategory === cat.name ? 'none' : '1px solid #e9ecef',
                padding: '12px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: '600',
                fontSize: '0.75rem'
              }}
            >
              <cat.icon size={20} />
              {cat.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => (
              <div key={idx} className="glass" style={{ marginBottom: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  style={{ width: '100%', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', height: '28px', width: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '900' }}>?</div>
                    <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>{faq.q}</span>
                  </div>
                  {openIndex === idx ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="#adb5bd" />}
                </button>
                
                {openIndex === idx && (
                  <div style={{ padding: '0 24px 24px 68px', color: 'var(--text-muted)', lineHeight: '1.7', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px' }}>
                    {faq.a}
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                       <span style={{ background: '#f1f3f5', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold', color: '#495057' }}>{faq.category}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: '24px', color: 'var(--text-muted)' }}>
               <Search size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
               <h3>Pertanyaan tidak ditemukan</h3>
               <p>Coba gunakan kata kunci lain atau hubungi admin.</p>
            </div>
          )}
        </div>

        {/* CTA Support */}
        <div style={{ marginTop: '80px', textAlign: 'center', padding: '60px', borderRadius: '30px', background: 'linear-gradient(135deg, #0ca678, #2b8a3e)', color: 'white' }}>
           <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Masih Butuh Bantuan?</h2>
           <p style={{ opacity: 0.9, marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
              Tim dukungan kami siap membantu Anda menjawab pertanyaan teknis maupun non-teknis setiap saat.
           </p>
           <button style={{ background: 'white', color: 'var(--primary)', padding: '16px 40px', borderRadius: '30px', fontWeight: '900', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              Chat Admin Sekarang
           </button>
        </div>

      </div>
    </div>
  );
};

export default FAQPage;
