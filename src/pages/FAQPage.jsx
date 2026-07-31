import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, ShieldCheck, HelpCircle, Box, Cpu, GraduationCap, ShoppingCart, Hammer, BarChart3, Wallet, Layout, Globe, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const FAQPage = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [openIndex, setOpenIndex] = useState(null);

  const categories_id = [
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

  const categories_en = [
    { name: 'All', icon: HelpCircle },
    { name: 'GENERAL', icon: Globe },
    { name: 'AI & BOT', icon: Cpu },
    { name: 'ACADEMY', icon: GraduationCap },
    { name: 'MARKET', icon: ShoppingCart },
    { name: 'CONSTRUCTION', icon: Hammer },
    { name: 'DATA TOOLS', icon: Box },
    { name: 'ANALYSIS', icon: BarChart3 },
    { name: 'WALLET', icon: Wallet },
    { name: 'REWARD', icon: Layout },
    { name: 'COMMUNITY', icon: MessageCircle },
    { name: 'SECURITY', icon: ShieldCheck },
    { name: 'DISCLAIMER', icon: AlertTriangle }
  ];

  const categories = language === 'en' ? categories_en : categories_id;

  const faqs_id = [
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

  const faqs_en = [
    // 1. GENERAL
    { category: 'GENERAL', q: "What is this Bamboo Ecosystem platform?", a: "This platform is a digital ecosystem that integrates education, industry, marketplace, and blockchain technology to support global bamboo development." },
    { category: 'GENERAL', q: "What is the main goal of this website?", a: "The goal is to build an integrated bamboo ecosystem from upstream to downstream, ranging from knowledge, production, to the market." },
    { category: 'GENERAL', q: "Who can use this platform?", a: "The general public, Investors & industry players, Bamboo farmers, Architects & contractors, Researchers & academics." },
    
    // 2. AI
    { category: 'AI & BOT', q: "What is Bambupedia?", a: "Bambupedia is an AI-based digital bamboo library that provides comprehensive information about bamboo." },
    { category: 'AI & BOT', q: "What is BambuBot?", a: "BambuBot is an AI assistant that can answer questions related to bamboo, from technical to business matters." },
    { category: 'AI & BOT', q: "Is using BambuBot free?", a: "Users get limited free access, then paid access using BMC tokens." },
    { category: 'AI & BOT', q: "Can AI answers be used as professional reference?", a: "Answers are for educational and general information purposes, not a substitute for professional consultation." },

    // 3. ACADEMY
    { category: 'ACADEMY', q: "What is Akademi Bambu Nusantara?", a: "A learning platform that provides a curriculum on the bamboo industry, from basic to professional levels." },
    { category: 'ACADEMY', q: "Are courses paid?", a: "Some are free, some are premium using BMC." },
    { category: 'ACADEMY', q: "Is there certification?", a: "Yes, some programs provide competency certificates." },

    // 4. MARKET
    { category: 'MARKET', q: "What is the Bamboo Market?", a: "A platform for buying and selling raw bamboo, processed bamboo, and derivative products." },
    { category: 'MARKET', q: "Can I sell products on this platform?", a: "Yes, anyone can become a seller after registering." },
    { category: 'MARKET', q: "How does the transaction system work?", a: "Transactions can be made using the digital system and BMC tokens." },
    { category: 'MARKET', q: "Are prices transparent?", a: "Yes, prices are displayed openly to create an efficient market." },

    // 5. CONSTRUCTION
    { category: 'CONSTRUCTION', q: "What is the bamboo labor service?", a: "This platform connects users with builders and bamboo construction workers." },
    { category: 'CONSTRUCTION', q: "Are the builders verified?", a: "Yes, a rating and review system is available to maintain quality." },
    { category: 'CONSTRUCTION', q: "Can I create a construction project through the platform?", a: "Yes, users can create projects and find workers as needed." },

    // 6. DATA TOOLS
    { category: 'DATA TOOLS', q: "What is the bamboo detection feature?", a: "An AI-based feature that can identify bamboo types, health, and conditions." },
    { category: 'DATA TOOLS', q: "Can bamboo data be accessed by the public?", a: "Some data is free, some is premium using BMC." },
    { category: 'DATA TOOLS', q: "Can I contribute data?", a: "Yes, users can upload data and get BMC rewards." },

    // 7. ANALYSIS
    { category: 'ANALYSIS', q: "What is the function of the market analysis feature?", a: "It provides insights and data on global market trends (crypto & stocks)." },
    { category: 'ANALYSIS', q: "Does this provide investment recommendations?", a: "No. The information is for educational purposes only, not investment advice." },

    // 8. WALLET
    { category: 'WALLET', q: "What is BMC?", a: "BMC is a utility token used in the BambooChain ecosystem." },
    { category: 'WALLET', q: "What is BMC used for?", a: "Access to premium features, contribution rewards, marketplace transactions, and community voting." },
    { category: 'WALLET', q: "Do I automatically get a wallet?", a: "Yes, when registering, you will automatically get a digital wallet." },
    { category: 'WALLET', q: "How do I get BMC?", a: "By purchasing, daily check-ins, contributing data, platform activities, and marketplace." },

    // 9. REWARD
    { category: 'REWARD', q: "How do I get rewards?", a: "Through check-ins, playing games, contributing data, and community activities." },
    { category: 'REWARD', q: "Can rewards be cashed out?", a: "Rewards can be used within the ecosystem or transacted according to platform policies." },

    // 10. COMMUNITY
    { category: 'COMMUNITY', q: "What is WebNUSA?", a: "An educational bamboo tourism program and community activities." },
    { category: 'COMMUNITY', q: "Can I join events?", a: "Yes, users can register for events through the platform." },

    // 11. SECURITY
    { category: 'SECURITY', q: "Is my data safe?", a: "The platform uses digital security standards to protect user data. (Learn With Bamboo)" },
    { category: 'SECURITY', q: "Is my wallet safe?", a: "The wallet uses a blockchain-based security system." },

    // 12. DISCLAIMER
    { category: 'DISCLAIMER', q: "Does this platform provide investment services?", a: "No. All information is educational and not investment advice." },
    { category: 'DISCLAIMER', q: "Are there risks?", a: "Yes, using digital and blockchain technology involves risks that users must understand." }
  ];

  const faqs = language === 'en' ? faqs_en : faqs_id;

  const filteredFaqs = faqs.filter(faq => {
    const isAll = activeCategory === 'Semua' || activeCategory === 'All';
    const matchesCategory = isAll || faq.category === activeCategory;
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ padding: '40px 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>{t('faq_title')}</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 32px' }}>
            {t('faq_desc')}
          </p>
          
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input 
              type="text" 
              placeholder={t('faq_search_ph')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '16px 16px 16px 56px', borderRadius: '30px', border: '1px solid #dee2e6', outline: 'none', fontSize: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} 
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px', marginBottom: '40px' }}>
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
               <h3>{t('faq_not_found_title')}</h3>
               <p>{t('faq_not_found_desc')}</p>
            </div>
          )}
        </div>

        {/* CTA Support */}
        <div style={{ marginTop: '80px', textAlign: 'center', padding: '60px', borderRadius: '30px', background: 'linear-gradient(135deg, #0ca678, #2b8a3e)', color: 'white' }}>
           <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>{t('faq_cta_title')}</h2>
           <p style={{ opacity: 0.9, marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
              {t('faq_cta_desc')}
           </p>
           <a 
             href="https://wa.me/628174139994?text=Halo%20Admin%20BaMbooChain,%20saya%20butuh%20bantuan%20terkait..." 
             target="_blank"
             rel="noreferrer"
             style={{ 
               display: 'inline-block',
               textDecoration: 'none',
               background: 'white', 
               color: 'var(--primary)', 
               padding: '16px 40px', 
               borderRadius: '30px', 
               fontWeight: '900', 
               boxShadow: '0 10px 20px rgba(0,0,0,0.1)' 
             }}>
              {t('faq_cta_btn')}
           </a>
        </div>

      </div>
    </div>
  );
};

export default FAQPage;
