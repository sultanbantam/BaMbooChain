import React, { useEffect, useState } from 'react';
import { Target, TrendingUp, Handshake, Leaf, MapPin, CheckCircle, ArrowRight, Briefcase, Star, X, Sparkles, ShoppingBag, Globe, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getAssetUrl } from '../utils/assets';

const slideAssets = [
  { image: getAssetUrl('pehc.JPG') },
  { image: getAssetUrl('pehc2.JPG') },
  { image: getAssetUrl('pehc3.JPG') },
];

const productAssets = [
  { image: getAssetUrl('gambar/produk_unggulan/Laminasi.jpeg') },
  { image: getAssetUrl('gambar/produk_unggulan/Interior.jpeg') },
  { image: getAssetUrl('gambar/produk_unggulan/mbb.jpeg') },
];

const projectAssets = [
  { image: getAssetUrl('gambar/pehcibarani.png') },
  { image: getAssetUrl('gambar/ceap.png') },
  { image: getAssetUrl('gambar/mbh.jpeg') },
];

const dataIcons = [TrendingUp, Target, Handshake];

const homeText = {
  id: {
    tickerItems: [
      'Funding Ready: 10 Unit Villa Bambu Ekologis - Bali',
      'Demand Market: Rumah Modular, Laminasi, Interior, dan Konstruksi',
      'Bounty Board aktif untuk desain, riset, konten, dan Web3',
      'Produk unggulan: Laminasi, Interior, dan Modular Bamboo Building',
    ],
    slides: [
      {
        title: 'Potensi Industri Bambu Global: Peluang Ekonomi dan Dampak Lingkungan',
        desc: 'Analisis berbasis data mengenai perkembangan industri bambu, produksi, pasar global, serta kontribusinya terhadap keberlanjutan lingkungan dan ekonomi masyarakat.',
      },
      {
        title: 'Masa Depan Konstruksi Hijau dan Inovasi Material',
        desc: 'Bambu laminasi dan konstruksi modular hadir sebagai pengganti material konvensional. Kuat, tahan lama, dan menetralkan jejak karbon dunia.',
      },
      {
        title: 'Pemberdayaan Desa dan Restorasi Ekologi',
        desc: 'Melalui budidaya dan pengembangan dari hulu ke hilir, kita tidak hanya menggerakkan roda ekonomi, tapi juga memulihkan mata air bumi.',
      },
    ],
    heroInsight: 'LIHAT ANALISIS',
    heroProjects: 'JELAJAHI PROYEK',
    marketEyebrow: 'LIVE OPPORTUNITY MARKET',
    marketTitle: 'Proyek, produk, dan talenta bambu dalam satu ekosistem.',
    marketDesc: 'Demand Market menghubungkan kebutuhan proyek yang sudah memiliki pendanaan dengan kontraktor, pemasok, arsitek, peneliti, dan komunitas bambu.',
    marketStats: [
      ['5+', 'Demand Aktif'],
      ['150K', 'USDT Funding Ready'],
      ['2K', 'BMC Top Bounty'],
      ['24/7', 'Marketplace Signal'],
    ],
    positioningTitle: 'Dari Indonesia untuk Industri Bambu Dunia',
    positioningDesc: 'Indonesia memiliki potensi besar dalam pengembangan industri bambu berbasis produksi dan keberlanjutan, yang terhubung langsung dengan kebutuhan pasar global.',
    dataTitle: 'Data Industri Bambu Berbasis Produksi',
    dataCards: [
      ['20-40%', 'Estimasi ROI Industri', '(Berbasis studi kasus)'],
      ['1.000', 'Kapasitas Produksi', 'Lembar / Hari'],
      ['Sekitar Rp 680k', 'Harga Produk', 'Per Lembar'],
    ],
    dataNote: '*Catatan: Data merupakan estimasi dan dapat bervariasi tergantung lokasi, skala, dan model bisnis.',
    scaleTitle: 'Industri yang Berpotensi Tumbuh Global',
    scaleDesc: 'Permintaan global terhadap material bambu meningkat sebagai alternatif kayu, logam, plastik, benang dan energi fosil yang lebih ramah lingkungan. Industri ini memiliki peluang berkembang pesat dalam sektor konstruksi, manufaktur, tekstil dan ekonomi karbon.',
    businessTitle: 'Model Ekonomi Industri Bambu',
    businessModels: [
      ['Produk Industri', 'Bambu laminasi, konstruksi modular, dan serat tekstil bambu berkualitas ekspor.'],
      ['Rantai Pasok', 'Membangun distribusi bahan baku dan produk dari daerah potensial ke hilir industri masif.'],
      ['Nilai Lingkungan', 'Potensi ekonomi tambahan terukur dari jasa ekosistem lingkungan dan serapan kredit karbon.'],
    ],
    projectsTitle: 'Contoh Proyek Pengembangan Bambu',
    projectDetails: 'LIHAT DETAIL PROYEK',
    projects: [
      {
        location: 'Banten (490 Ha)',
        title: 'Perkebunan Emas Hijau Cibarani - Lebak',
        desc: 'Restorasi, produksi bambu terintegrasi dan sabuk ekologis untuk melindungi hutan adat dan hutan lindung dari illegal logging serta aktivitas penambangan emas liar.',
      },
      {
        location: 'Tangerang Raya (120 Ha)',
        title: 'Cisadane Adventure Eco Park',
        desc: 'Mengintegrasikan konservasi lingkungan, inovasi bambu, pengembangan ekonomi komunitas, dan wisata alam berbasis ekologi.',
      },
      {
        location: 'Sumatera (Nasional)',
        title: 'Proyek Rumah Hunian Tetap Tipe 36',
        desc: 'Hunian modular pasca bencana lingkungan di area Sumatera, menyumbang hingga 6.000 unit produksi hunian terstandarisasi berbasis bambu ramah lingkungan.',
      },
    ],
    productsTitle: 'Produk Unggulan',
    productsDesc: 'Katalog inti dari ekosistem industri bambu: material konstruksi, interior, dan sistem modular untuk kebutuhan B2B.',
    marketplaceLink: 'Marketplace',
    productDemandLink: 'Lihat Demand Market',
    products: [
      {
        title: 'Bambu Laminasi',
        desc: 'Panel dan balok rekayasa untuk kebutuhan interior, struktur ringan, dan pengganti kayu solid.',
        tag: 'Material Konstruksi',
      },
      {
        title: 'Interior Bambu',
        desc: 'Aplikasi premium untuk dinding, plafon, furnitur, dan aksen ruang bernilai estetika tinggi.',
        tag: 'Interior',
      },
      {
        title: 'Modular Bamboo Building',
        desc: 'Komponen hunian modular berbasis bambu untuk proyek cepat bangun dan rendah jejak karbon.',
        tag: 'Rumah Modular',
      },
    ],
    ecosystemTitle: 'Ekosistem Industri Bambu',
    ecosystemItems: [
      'Budidaya dan penanaman',
      'Produksi dan pengolahan inovatif',
      'Distribusi dan pasar yang meluas',
      'Pemanfaatan teknologi untuk monitoring dan transparansi',
    ],
    integrationTitle: 'Dampak Integrasi Kami',
    integrationItems: [
      'Restorasi lahan kritis dan terdegradasi',
      'Perlindungan sistem sumber mata air bawah tanah',
      'Pemberdayaan ekonomi warga di daerah rural',
    ],
    impactTitle: 'Dampak Lingkungan dan Sosial',
    impactStats: [
      ['Sekitar 490 Ha', 'Kawasan Prioritas Dilindungi'],
      ['Sekitar 50.000', 'Bibit Bambu Baru Ditanam'],
      ['100%', 'Perlindungan Sumber Mata Air'],
      ['Berkelanjutan', 'Peningkatan Ekonomi Lokal Rutin'],
    ],
    partnersTitle: 'Mitra & Kolaborasi',
    partnersDesc: 'Kami bekerja sama dengan berbagai pihak dalam pengembangan ekosistem bambu berkelanjutan, termasuk komunitas dan masyarakat adat, akademisi dan peneliti, industri dan manufaktur, pemerintah dan lembaga, serta teknologi digital.',
    partnerCardTitle: 'Menjadi Mitra',
    partnerCardDesc: 'Terbuka untuk kolaborasi dalam pengembangan industri bambu berkelanjutan.',
    contactButton: 'HUBUNGI KAMI',
    ctaTitle: 'Pelajari Lebih Lanjut',
    ctaDesc: 'Jelajahi data, analisis, dan perkembangan masa depan terkait industri primer bambu yang dapat diperbarui secara berkelanjutan.',
    ctaButton: 'LIHAT INSIGHT',
    welcome: {
      greeting: 'Selamat Datang di BaMbooChain!',
      intro: 'Eksplorasi ekosistem industri bambu terintegrasi masa depan.',
      stepTitle: 'Apa yang bisa Anda lakukan?',
      step1Title: 'Restorasi & Produksi',
      step1Desc: 'Lihat bagaimana kami memulihkan lahan dan membangun industri.',
      step2Title: 'Marketplace & Demand',
      step2Desc: 'Temukan produk bambu dan peluang proyek live.',
      step3Title: 'Dampak Lingkungan',
      step3Desc: 'Pantau kontribusi terhadap air dan karbon.',
      step4Title: 'Kolaborasi Mitra',
      step4Desc: 'Bergabunglah dalam jaringan global kami.',
      btn: 'MULAI EKSPLORASI',
      footer: 'BaMbooChain v2.0 - Membangun Masa Depan Hijau'
    }
  },
  en: {
    tickerItems: [
      'Funding Ready: 10 Ecological Bamboo Villas - Bali',
      'Demand Market: Modular Homes, Lamination, Interior, and Construction',
      'Bounty Board active for design, research, content, and Web3',
      'Featured products: Lamination, Interior, and Modular Bamboo Building',
    ],
    slides: [
      {
        title: 'Global Bamboo Industry Potential: Economic Opportunity and Environmental Impact',
        desc: 'A data-driven view of bamboo industry growth, production, global markets, and its contribution to environmental and community economic sustainability.',
      },
      {
        title: 'The Future of Green Construction and Material Innovation',
        desc: 'Laminated bamboo and modular construction offer a durable, high-strength alternative to conventional materials while helping reduce the global carbon footprint.',
      },
      {
        title: 'Village Empowerment and Ecological Restoration',
        desc: 'Through cultivation and end-to-end development, bamboo can drive local economies while helping restore the earths water systems.',
      },
    ],
    heroInsight: 'VIEW ANALYSIS',
    heroProjects: 'EXPLORE PROJECTS',
    marketEyebrow: 'LIVE OPPORTUNITY MARKET',
    marketTitle: 'Bamboo projects, products, and talent in one ecosystem.',
    marketDesc: 'Demand Market connects funded project needs with contractors, suppliers, architects, researchers, and bamboo communities.',
    marketStats: [
      ['5+', 'Active Demands'],
      ['150K', 'USDT Funding Ready'],
      ['2K', 'BMC Top Bounty'],
      ['24/7', 'Marketplace Signal'],
    ],
    positioningTitle: 'From Indonesia to the Global Bamboo Industry',
    positioningDesc: 'Indonesia has major potential to develop a production-based and sustainable bamboo industry that is directly connected to global market demand.',
    dataTitle: 'Production-Based Bamboo Industry Data',
    dataCards: [
      ['20-40%', 'Estimated Industry ROI', '(Based on case studies)'],
      ['1,000', 'Production Capacity', 'Sheets / Day'],
      ['Around Rp 680k', 'Product Price', 'Per Sheet'],
    ],
    dataNote: '*Note: Data is estimated and may vary by location, scale, and business model.',
    scaleTitle: 'An Industry with Global Growth Potential',
    scaleDesc: 'Global demand for bamboo materials is increasing as a more sustainable alternative to wood, metal, plastic, yarn, and fossil energy. The industry has strong growth potential across construction, manufacturing, textiles, and the carbon economy.',
    businessTitle: 'Bamboo Industry Economic Model',
    businessModels: [
      ['Industrial Products', 'Export-grade laminated bamboo, modular construction, and bamboo textile fiber.'],
      ['Supply Chain', 'Building raw material and product distribution from high-potential regions into large-scale downstream industry.'],
      ['Environmental Value', 'Additional measurable economic value from ecosystem services and carbon credit absorption.'],
    ],
    projectsTitle: 'Bamboo Development Project Examples',
    projectDetails: 'VIEW PROJECT DETAILS',
    projects: [
      {
        location: 'Banten (490 Ha)',
        title: 'Cibarani Green Gold Plantation - Lebak',
        desc: 'Integrated bamboo restoration and production with an ecological buffer zone to protect customary and protected forests from illegal logging and unlicensed gold mining.',
      },
      {
        location: 'Greater Tangerang (120 Ha)',
        title: 'Cisadane Adventure Eco Park',
        desc: 'Integrating environmental conservation, bamboo innovation, community economic development, and eco-based nature tourism.',
      },
      {
        location: 'Sumatra (National)',
        title: 'Permanent Type 36 Modular Housing Project',
        desc: 'Post-disaster modular housing across Sumatra, contributing up to 6,000 standardized low-carbon bamboo housing units.',
      },
    ],
    productsTitle: 'Featured Products',
    productsDesc: 'The core catalog of the bamboo industry ecosystem: construction materials, interiors, and modular systems for B2B needs.',
    marketplaceLink: 'Marketplace',
    productDemandLink: 'View Demand Market',
    products: [
      {
        title: 'Laminated Bamboo',
        desc: 'Engineered panels and beams for interiors, light structures, and solid wood replacement.',
        tag: 'Construction Material',
      },
      {
        title: 'Bamboo Interior',
        desc: 'Premium applications for walls, ceilings, furniture, and high-value spatial accents.',
        tag: 'Interior',
      },
      {
        title: 'Modular Bamboo Building',
        desc: 'Bamboo-based modular housing components for fast-build and low-carbon projects.',
        tag: 'Modular Homes',
      },
    ],
    ecosystemTitle: 'Bamboo Industry Ecosystem',
    ecosystemItems: [
      'Cultivation and planting',
      'Innovative production and processing',
      'Expanding distribution and markets',
      'Technology use for monitoring and transparency',
    ],
    integrationTitle: 'Our Integrated Impact',
    integrationItems: [
      'Restoration of critical and degraded land',
      'Protection of underground water source systems',
      'Economic empowerment for rural communities',
    ],
    impactTitle: 'Environmental and Social Impact',
    impactStats: [
      ['Around 490 Ha', 'Priority Area Protected'],
      ['Around 50,000', 'New Bamboo Seedlings Planted'],
      ['100%', 'Water Source Protection'],
      ['Sustainable', 'Recurring Local Economic Growth'],
    ],
    partnersTitle: 'Partners & Collaboration',
    partnersDesc: 'We collaborate with many stakeholders in developing a sustainable bamboo ecosystem, including communities and customary groups, academics and researchers, industry and manufacturing, government and institutions, and digital technology partners.',
    partnerCardTitle: 'Become a Partner',
    partnerCardDesc: 'Open for collaboration in sustainable bamboo industry development.',
    contactButton: 'CONTACT US',
    ctaTitle: 'Learn More',
    ctaDesc: 'Explore data, analysis, and future developments related to renewable and sustainable primary bamboo industries.',
    ctaButton: 'VIEW INSIGHT',
    welcome: {
      greeting: 'Welcome to BaMbooChain!',
      intro: 'Explore the integrated bamboo industry ecosystem of the future.',
      stepTitle: 'What can you do?',
      step1Title: 'Restoration & Production',
      step1Desc: 'See how we restore land and build industries.',
      step2Title: 'Marketplace & Demand',
      step2Desc: 'Discover bamboo products and live project opportunities.',
      step3Title: 'Environmental Impact',
      step3Desc: 'Monitor contributions to water and carbon.',
      step4Title: 'Partner Collaboration',
      step4Desc: 'Join our global network.',
      btn: 'START EXPLORING',
      footer: 'BaMbooChain v2.0 - Building a Green Future'
    }
  },
};

const HomePage = () => {
  const { language } = useLanguage();
  const copy = homeText[language] || homeText.id;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slides = slideAssets.map((slide, index) => ({ ...slide, ...copy.slides[index] }));
  const featuredProducts = productAssets.map((product, index) => ({ ...product, ...copy.products[index] }));
  const projects = projectAssets.map((project, index) => ({ ...project, ...copy.projects[index] }));
  const slideCount = slides.length;

  const closeWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 5000);

    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      const timeout = setTimeout(() => setShowWelcome(true), 1500);
      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    }

    return () => clearInterval(timer);
  }, [slideCount]);

  const isMobile = windowWidth <= 1100;

  return (
    <div>
      <section style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 'var(--navbar-height)',
        overflow: 'hidden'
      }}>
        {/* Activity Ticker - INSIDE hero, always above title */}
        <div className="home-activity-ticker" aria-label="BaMbooChain live activity" style={{ position: 'relative', zIndex: 5, flexShrink: 0 }}>
          <div className="home-ticker-track">
            {[...copy.tickerItems, ...copy.tickerItems].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>

        {/* Hero content */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '60px 0' }}>
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url("${slide.image}") center/cover`,
              opacity: index === currentSlide ? 1 : 0,
              visibility: index === currentSlide ? 'visible' : 'hidden',
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)',
              transitionProperty: 'opacity, visibility, transform',
              transitionDuration: '1s, 1s, 6s',
              transitionTimingFunction: 'ease-in-out',
              zIndex: -1
            }}
          />
        ))}

        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h1
            key={`title-${language}-${currentSlide}`}
            className="animate-fade-in-up"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', fontWeight: '800', marginBottom: '24px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            {slides[currentSlide].title}
          </h1>
          <p
            key={`desc-${language}-${currentSlide}`}
            className="animate-fade-in-up"
            style={{ fontSize: '1.25rem', opacity: '0.9', maxWidth: '800px', margin: '0 auto 40px', color: 'white', animationDelay: '0.2s' }}
          >
            {slides[currentSlide].desc}
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/insight" className="btn btn-crypto" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>{copy.heroInsight}</Link>
            <Link to="/projects" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', background: 'transparent', border: '2px solid var(--primary)' }}>{copy.heroProjects}</Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Slide ${index + 1}`}
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

      <section style={{ padding: '60px 0', background: '#101418', color: 'white' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#69db7c', fontWeight: '800', fontSize: '0.85rem', marginBottom: '14px' }}>
              <Briefcase size={18} /> {copy.marketEyebrow}
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '16px', lineHeight: 1.1 }}>
              {copy.marketTitle}
            </h2>
            <p style={{ color: '#ced4da', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '680px' }}>
              {copy.marketDesc}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(120px, 1fr))', gap: '14px' }}>
            {copy.marketStats.map(([value, label]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '22px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#69db7c' }}>{value}</div>
                <div style={{ color: '#adb5bd', fontSize: '0.85rem', fontWeight: '700' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '20px' }}>{copy.positioningTitle}</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto' }}>
            {copy.positioningDesc}
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '40px', textAlign: 'center' }}>{copy.dataTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {copy.dataCards.map(([value, label, note], index) => {
              const Icon = dataIcons[index];

              return (
                <div key={label} className="glass" style={{ padding: '30px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  <Icon size={40} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
                  <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>{value}</h3>
                  <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{label}</p>
                  <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>{note}</span>
                </div>
              );
            })}
          </div>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#6c757d', fontStyle: 'italic' }}>
            {copy.dataNote}
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--primary)', color: 'white' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>{copy.scaleTitle}</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', opacity: '0.9' }}>
              {copy.scaleDesc}
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '40px', textAlign: 'center' }}>{copy.businessTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {copy.businessModels.map(([title, desc], index) => (
              <div key={title} className="glass" style={{ padding: '30px', background: 'white', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>{index + 1}</div>
                  <h3 style={{ fontSize: '1.3rem' }}>{title}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '50px', textAlign: 'center' }}>{copy.projectsTitle}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            {projects.map((project) => (
              <div key={project.title} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                <div style={{ height: '200px', background: `url("${project.image}") center/cover` }} />
                <div style={{ padding: '30px' }}>
                  <div style={{ color: 'var(--primary)', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    <MapPin size={16} /> {project.location}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{project.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/projects" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              {copy.projectDetails} <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap', marginBottom: '36px' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '12px' }}>{copy.productsTitle}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '720px' }}>
                {copy.productsDesc}
              </p>
            </div>
            <Link to="/bamboochain/marketplace" className="btn btn-primary" style={{ padding: '12px 22px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              {copy.marketplaceLink} <ArrowRight size={18} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
            {featuredProducts.map((product) => (
              <div key={product.title} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #edf2f7' }}>
                <div style={{ height: '230px', position: 'relative', overflow: 'hidden' }}>
                  <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.72)', color: 'white', padding: '6px 12px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: '800' }}>
                    <Star size={14} fill="#ffd43b" color="#ffd43b" /> {product.tag}
                  </div>
                </div>
                <div style={{ padding: '26px' }}>
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '10px' }}>{product.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>{product.desc}</p>
                  <Link to="/careers" style={{ color: 'var(--primary)', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                    {copy.productDemandLink} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '24px' }}>{copy.ecosystemTitle}</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                {copy.ecosystemItems.map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={24} color="var(--primary)" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--primary)' }}>{copy.integrationTitle}</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {copy.integrationItems.map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Leaf size={20} color="var(--primary)" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--primary)', color: 'white' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>{copy.impactTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '30px' }}>
            {copy.impactStats.map(([value, label]) => (
              <div key={label}>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{value}</h3>
                <p style={{ opacity: '0.9', marginTop: '10px' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '20px' }}>{copy.partnersTitle}</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
            {copy.partnersDesc}
          </p>
          <div style={{ padding: '40px', background: '#f4fbf4', borderRadius: '16px', display: 'inline-block', minWidth: '300px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{copy.partnerCardTitle}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{copy.partnerCardDesc}</p>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '12px 24px' }}>{copy.contactButton}</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 0', background: '#212529', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '24px' }}>{copy.ctaTitle}</h2>
          <p style={{ fontSize: '1.2rem', opacity: '0.8', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            {copy.ctaDesc}
          </p>
          <Link to="/insight" className="btn btn-crypto" style={{ padding: '20px 40px', fontSize: '1.2rem' }}>{copy.ctaButton}</Link>
        </div>
      </section>
      <div className="home-activity-ticker" aria-label="BaMbooChain live activity">
        <div className="home-ticker-track">
          {[...copy.tickerItems, ...copy.tickerItems].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <style>{`
        .home-activity-ticker {
          background: #111827;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
          white-space: nowrap;
          color: #69db7c;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0;
          position: relative;
          z-index: 5;
        }
        .home-ticker-track {
          display: inline-flex;
          width: max-content;
          animation: homeTicker 32s linear infinite;
        }
        .home-ticker-track span {
          display: inline-flex;
          align-items: center;
          padding: 12px 28px;
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        @keyframes homeTicker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (max-width: 1100px) {
          .home-activity-ticker {
            font-size: 0.75rem;
          }
          .home-ticker-track span {
            padding: 8px 18px;
          }
        }
      `}</style>
      {/* WELCOME MODAL / ONBOARDING */}
      {showWelcome && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
          zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px'
        }}>
          <div className="animate-fade-in-up" style={{
            background: 'white', borderRadius: '28px', width: '100%', maxWidth: '480px',
            maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)', position: 'relative'
          }}>
            {/* Compact Header */}
            <div style={{ 
              background: 'linear-gradient(135deg, #0ca678 0%, #087f5b 100%)', 
              padding: '25px 20px', color: 'white', textAlign: 'center', position: 'relative' 
            }}>
              <button onClick={closeWelcome} style={{
                position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.2)',
                border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer'
              }}><X size={18} /></button>
              
              <div style={{ 
                width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)', 
                borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 15px', backdropFilter: 'blur(10px)'
              }}>
                <Sparkles size={28} fill="white" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '6px' }}>{copy.welcome.greeting}</h2>
              <p style={{ opacity: 0.9, fontSize: '0.85rem', lineHeight: '1.4' }}>{copy.welcome.intro}</p>
            </div>

            {/* Scrollable Content Area */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              <p style={{ fontWeight: 'bold', color: '#495057', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{copy.welcome.stepTitle}</p>
              
              <div style={{ display: 'grid', gap: '15px', marginBottom: '25px' }}>
                {[
                  { icon: <Leaf size={18} />, color: '#0ca678', bg: '#ebfbee', title: copy.welcome.step1Title, desc: copy.welcome.step1Desc },
                  { icon: <ShoppingBag size={18} />, color: '#228be6', bg: '#e7f5ff', title: copy.welcome.step2Title, desc: copy.welcome.step2Desc },
                  { icon: <Globe size={18} />, color: '#fd7e14', bg: '#fff4e6', title: copy.welcome.step3Title, desc: copy.welcome.step3Desc },
                  { icon: <Users size={18} />, color: '#7950f2', bg: '#f3f0ff', title: copy.welcome.step4Title, desc: copy.welcome.step4Desc }
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ minWidth: '36px', height: '36px', background: step.bg, color: step.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {step.icon}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 2px 0', fontSize: '0.95rem', fontWeight: '700' }}>{step.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#868e96', lineHeight: '1.4' }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={closeWelcome} className="btn btn-primary" style={{ 
                width: '100%', padding: '14px', borderRadius: '14px', fontWeight: '800', fontSize: '1rem',
                boxShadow: '0 10px 20px rgba(12, 166, 120, 0.2)', letterSpacing: '1px', border: 'none', cursor: 'pointer'
              }}>
                {copy.welcome.btn}
              </button>
              
              <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#adb5bd', marginTop: '12px' }}>
                {copy.welcome.footer}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;
