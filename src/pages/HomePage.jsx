import React, { useState, useEffect } from 'react';
import { 
  Target, TrendingUp, Handshake, Leaf, MapPin, CheckCircle, ArrowRight, Tag, Star, X, Sparkles, ShoppingBag, Globe, Users, 
  Database, Briefcase, UploadCloud, HeartHandshake, BookOpen, Search, MessageSquare, Coins, GraduationCap, Video 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAssetUrl } from '../utils/assets';
import { useLanguage } from '../context/LanguageContext';

const HomePage = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(1); // 1 = Info, 2 = Question
  const [showKodibaTos, setShowKodibaTos] = useState(false);
  const navigate = useNavigate();

  const slides = [
    {
      image: getAssetUrl('pehc.JPG'),
      title: t('home_slide1_title'),
      desc: t('home_slide1_desc')
    },
    {
      image: getAssetUrl('pehc2.JPG'),
      title: t('home_slide2_title'),
      desc: t('home_slide2_desc')
    },
    {
      image: getAssetUrl('pehc3.JPG'),
      title: t('home_slide3_title'),
      desc: t('home_slide3_desc')
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Ganti slide otomatis setiap 5 detik

    // Check if ?room is present in search or hash to suppress onboarding
    const urlParams = new URLSearchParams(window.location.search);
    let hasRoom = urlParams.has('room');
    if (!hasRoom && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      const hashParams = new URLSearchParams(hashQuery);
      hasRoom = hashParams.has('room');
    }

    let timeout;
    if (!hasRoom) {
      timeout = setTimeout(() => setShowWelcome(true), 1500);
    }

    return () => {
      clearInterval(timer);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const closeWelcome = () => {
    setShowWelcome(false);
  };

  return (
    <div>
      <style>{`
        @keyframes homeTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .home-ticker-link {
          color: #51cf66;
          text-decoration: none;
          margin: 0 40px;
          font-size: 0.95rem;
          font-weight: bold;
          font-family: monospace;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s;
        }
        .home-ticker-link:hover {
          color: white;
          text-decoration: underline;
        }
      `}</style>

      {/* SECTION 1 - HERO SLIDER */}
      {/* Ticker di LUAR section, setelah navbar, sebelum hero */}
      <div style={{
        position: 'relative',
        marginTop: 'var(--navbar-height)',
        background: '#1a1a1a',
        color: 'white',
        padding: '10px 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '2px solid var(--primary)'
      }}>
        <div style={{ display: 'inline-block', animation: 'homeTicker 35s linear infinite' }}>
          {[
            t('home_ticker_1'),
            t('home_ticker_2'),
            t('home_ticker_3')
          ].concat([
            t('home_ticker_1'),
            t('home_ticker_2'),
            t('home_ticker_3')
          ]).map((text, i) => (
            <Link 
              key={i} 
              to="/careers" 
              className="home-ticker-link"
              onClick={() => {
                setTimeout(() => {
                  document.getElementById('demand')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              <Target size={16} />
              {text}
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      </div>

      {/* Hero section — dimulai di bawah ticker, background hanya cover section ini */}
      <section style={{
        minHeight: 'calc(100vh - var(--navbar-height) - 42px)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '60px',
        paddingBottom: '80px',
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
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)',
              transitionProperty: 'opacity, visibility, transform',
              transitionDuration: '1s, 1s, 6s',
              zIndex: -1
            }}
          />
        ))}

        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h1 
            key={`title-${currentSlide}`}
            className="animate-fade-in-up"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: '800', marginBottom: '24px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            {slides[currentSlide].title}
          </h1>
          <p 
            key={`desc-${currentSlide}`}
            className="animate-fade-in-up"
            style={{ fontSize: '1.1rem', opacity: '0.9', maxWidth: '800px', margin: '0 auto 40px', color: 'white', animationDelay: '0.2s' }}
          >
            {slides[currentSlide].desc}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/insight" className="btn btn-crypto" style={{ padding: '14px 28px', fontSize: '1rem' }}>{t('home_hero_btn_analysis')}</Link>
            <Link to="/projects" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem', background: 'transparent', border: '2px solid var(--primary)' }}>{t('home_hero_btn_projects')}</Link>
          </div>
          
          {/* Dots */}
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
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '20px' }}>{t('home_pos_title')}</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto' }}>
            {t('home_pos_desc')}
          </p>
        </div>
      </section>

      {/* SECTION 3 - DATA UTAMA */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '40px', textAlign: 'center' }}>{t('home_data_title')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="glass" style={{ padding: '30px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              <TrendingUp size={40} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>20-40%</h3>
              <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{t('home_data_roi_label')}</p>
              <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>{t('home_data_roi_note')}</span>
            </div>
            <div className="glass" style={{ padding: '30px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              <Target size={40} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>1.000</h3>
              <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{t('home_data_cap_label')}</p>
              <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>{t('home_data_cap_unit')}</span>
            </div>
            <div className="glass" style={{ padding: '30px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              <Handshake size={40} color="var(--primary)" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>±Rp 680k</h3>
              <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{t('home_data_price_label')}</p>
              <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>{t('home_data_price_unit')}</span>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#6c757d', fontStyle: 'italic' }}>
            {t('home_data_note')}
          </p>
        </div>
      </section>

      {/* SECTION 4 - SKALA INDUSTRI */}
      <section style={{ padding: '80px 0', background: 'var(--primary)', color: 'white' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>{t('home_scale_title')}</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', opacity: '0.9' }}>
              {t('home_scale_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 - MODEL BISNIS */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '40px', textAlign: 'center' }}>{t('home_model_title')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div className="glass" style={{ padding: '30px', background: 'var(--bg-card)', borderRadius: '16px', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>1</div>
                <h3 style={{ fontSize: '1.3rem' }}>{t('home_model_1_title')}</h3>
              </div>
              <p style={{ color: 'var(--text-muted)' }}>{t('home_model_1_desc')}</p>
            </div>
            
            <div className="glass" style={{ padding: '30px', background: 'var(--bg-card)', borderRadius: '16px', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>2</div>
                <h3 style={{ fontSize: '1.3rem' }}>{t('home_model_2_title')}</h3>
              </div>
              <p style={{ color: 'var(--text-muted)' }}>{t('home_model_2_desc')}</p>
            </div>

            <div className="glass" style={{ padding: '30px', background: 'var(--bg-card)', borderRadius: '16px', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>3</div>
                <h3 style={{ fontSize: '1.3rem' }}>{t('home_model_3_title')}</h3>
              </div>
              <p style={{ color: 'var(--text-muted)' }}>{t('home_model_3_desc')}</p>
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '50px', textAlign: 'center' }}>{t('home_project_title')}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', marginBottom: '40px' }}>
                        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid var(--border-color)' }}>
              <div style={{ height: '200px', background: `url("${getAssetUrl('gambar/pehcibarani.png')}") center/cover` }}></div>
              <div style={{ padding: '30px' }}>
                <div style={{ color: 'var(--primary)', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  <MapPin size={16} /> Banten (490 Ha)
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{t('home_project_1_title')}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('home_project_1_desc')}</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid var(--border-color)' }}>
              <div style={{ height: '200px', background: `url("${getAssetUrl('gambar/ceap.png')}") center/cover` }}></div>
              <div style={{ padding: '30px' }}>
                <div style={{ color: 'var(--primary)', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  <MapPin size={16} /> Tangerang Raya (120 Ha)
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{t('home_project_2_title')}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('home_project_2_desc')}</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid var(--border-color)' }}>
              <div style={{ height: '200px', background: `url("${getAssetUrl('gambar/mbh.jpeg')}") center/cover` }}></div>
              <div style={{ padding: '30px' }}>
                <div style={{ color: 'var(--primary)', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  <MapPin size={16} /> Sumatera (Nasional)
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{t('home_project_3_title')}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('home_project_3_desc')}</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/projects" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              {t('home_project_btn')} <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6.5 - PRODUK UNGGULAN */}
      <section style={{ padding: '80px 0', background: 'var(--bg-color)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '50px', textAlign: 'center' }}>{t('home_featured_title')}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            {/* Produk 1 */}
            <div className="glass" style={{ background: 'var(--bg-card)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: '1px solid var(--border-color)' }}>
              <div style={{ height: '220px', position: 'relative' }}>
                <img src={getAssetUrl('gambar/produk_unggulan/Laminasi.jpeg')} alt="Bambu Laminasi" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home_featured_laminate_badge1')}</div>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ color: '#f59f00', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}><Star size={14} fill="#f59f00" /> 5.0</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('home_featured_laminate_badge2')}</div>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{t('home_featured_laminate')}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>{t('home_featured_laminate_desc')}</p>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{t('home_featured_laminate_badge3')}</div>
              </div>
            </div>

            {/* Produk 2 */}
            <div className="glass" style={{ background: 'var(--bg-card)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: '1px solid var(--border-color)' }}>
              <div style={{ height: '220px', position: 'relative' }}>
                <img src={getAssetUrl('gambar/produk_unggulan/Interior.jpeg')} alt="Interior" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home_featured_interior_badge1')}</div>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ color: '#f59f00', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}><Star size={14} fill="#f59f00" /> 4.9</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('home_featured_interior_badge2')}</div>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{t('home_featured_interior')}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>{t('home_featured_interior_desc')}</p>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{t('home_featured_interior_badge3')}</div>
              </div>
            </div>

            {/* Produk 3 */}
            <div className="glass" style={{ background: 'var(--bg-card)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: '1px solid var(--border-color)' }}>
              <div style={{ height: '220px', position: 'relative' }}>
                <img src={getAssetUrl('gambar/produk_unggulan/mbb.jpeg')} alt="Konstruksi Modular" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t('home_featured_modular_badge1')}</div>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ color: '#f59f00', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}><Star size={14} fill="#f59f00" /> 5.0</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('home_featured_modular_badge2')}</div>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{t('home_featured_modular')}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>{t('home_featured_modular_desc')}</p>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{t('home_featured_modular_badge3')}</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/bamboochain/marketplace" className="btn btn-outline" style={{ padding: '14px 28px', fontSize: '1.1rem', borderRadius: '30px' }}>
              {t('home_featured_btn')}
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7 - EKOSISTEM */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '24px' }}>{t('home_eco_title')}</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><CheckCircle size={24} color="var(--primary)" /> {t('home_eco_list_1')}</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><CheckCircle size={24} color="var(--primary)" /> {t('home_eco_list_2')}</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><CheckCircle size={24} color="var(--primary)" /> {t('home_eco_list_3')}</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><CheckCircle size={24} color="var(--primary)" /> {t('home_eco_list_4')}</li>
              </ul>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', color: 'var(--text-main)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--primary)' }}>{t('home_eco_impact_title')}</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Leaf size={20} color="var(--primary)" /> {t('home_eco_impact_1')}</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Leaf size={20} color="var(--primary)" /> {t('home_eco_impact_2')}</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Leaf size={20} color="var(--primary)" /> {t('home_eco_impact_3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 - IMPACT */}
      <section style={{ padding: '80px 0', background: 'var(--primary)', color: 'white' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>{t('home_stats_title')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '30px' }}>
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>±490 Ha</h3>
              <p style={{ opacity: '0.9', marginTop: '10px' }}>{t('home_stats_1_label')}</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>±50.000</h3>
              <p style={{ opacity: '0.9', marginTop: '10px' }}>{t('home_stats_2_label')}</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>100%</h3>
              <p style={{ opacity: '0.9', marginTop: '10px' }}>{t('home_stats_3_label')}</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{t('home_stats_4_val')}</h3>
              <p style={{ opacity: '0.9', marginTop: '10px' }}>{t('home_stats_4_label')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 - PARTNERS */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '20px' }}>{t('home_partner_title')}</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
            {t('home_partner_desc')}
          </p>
          <div style={{ padding: '40px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'inline-block', minWidth: '300px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-main)' }}>{t('home_partner_cta_title')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{t('home_partner_cta_desc')}</p>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '12px 24px' }}>{t('home_partner_btn')}</Link>
          </div>
        </div>
      </section>

      {/* SECTION 10 - CTA */}
      <section style={{ padding: '100px 0', background: '#212529', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '24px' }}>{t('home_cta_title')}</h2>
          <p style={{ fontSize: '1.2rem', opacity: '0.8', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            {t('home_cta_desc')}
          </p>
          <Link to="/insight" className="btn btn-crypto" style={{ padding: '20px 40px', fontSize: '1.2rem' }}>{t('home_cta_btn')}</Link>
        </div>
      </section>

      {/* WELCOME MODAL / ONBOARDING */}
      {showWelcome && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
          zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px'
        }}>
          <div className="animate-fade-in-up" style={{
            background: 'white', borderRadius: '28px', width: '100%', maxWidth: welcomeStep === 1 ? '480px' : '700px',
            maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)', position: 'relative',
            transition: 'all 0.3s ease'
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
              
              {welcomeStep === 1 ? (
                <img
                  src={getAssetUrl('logos/bmc3.png')}
                  alt="BaMbooChain"
                  style={{
                    width: '92px',
                    height: '66px',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto 12px',
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.18))'
                  }}
                />
              ) : (
                <img
                  src={getAssetUrl('logos/bmc5.png')}
                  alt="BaMbooChain"
                  style={{
                    width: '126px',
                    height: '55px',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto 12px',
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.18))'
                  }}
                />
              )}
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '6px' }}>
                {welcomeStep === 1 ? t('welcome_greeting') : t('guide_title')}
              </h2>
              <p style={{ opacity: 0.9, fontSize: '0.85rem', lineHeight: '1.4' }}>
                {welcomeStep === 1 ? t('welcome_intro') : t('welcome_intro_2')}
              </p>
            </div>

            {/* Scrollable Content Area */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {welcomeStep === 1 ? (
                <>
                  <p style={{ fontWeight: 'bold', color: '#495057', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{t('welcome_step_title')}</p>
                  
                  <div style={{ display: 'grid', gap: '15px', marginBottom: '25px' }}>
                    {[
                      { icon: <Leaf size={18} />, color: '#0ca678', bg: '#ebfbee', title: t('welcome_step1_title'), desc: t('welcome_step1_desc') },
                      { icon: <ShoppingBag size={18} />, color: '#228be6', bg: '#e7f5ff', title: t('welcome_step2_title'), desc: t('welcome_step2_desc') },
                      { icon: <Globe size={18} />, color: '#fd7e14', bg: '#fff4e6', title: t('welcome_step3_title'), desc: t('welcome_step3_desc') },
                      { icon: <Users size={18} />, color: '#7950f2', bg: '#f3f0ff', title: t('welcome_step4_title'), desc: t('welcome_step4_desc') }
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

                  <button onClick={() => setWelcomeStep(2)} className="btn btn-primary" style={{ 
                    width: '100%', padding: '14px', borderRadius: '14px', fontWeight: '800', fontSize: '1rem',
                    boxShadow: '0 10px 20px rgba(12, 166, 120, 0.2)', letterSpacing: '1px', border: 'none', cursor: 'pointer'
                  }}>
                    {t('welcome_btn')}
                  </button>
                </>
              ) : (
                <>
                  {/* Two Main Big Buttons */}
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <Link to="/bamboochain/plantation" onClick={closeWelcome} style={{
                      flex: 1, textDecoration: 'none', background: 'white', border: '1px solid #333', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', 
                      fontWeight: '800', fontSize: '1.15rem', padding: '40px 20px',
                      transition: 'all 0.2s ease', cursor: 'pointer'
                    }} onMouseEnter={e => { e.currentTarget.style.background = '#f8f9fa'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = 'none'; }}>
                      {t('welcome_btn_1')}
                    </Link>
                    <Link to="/bamboochain/token-wallet" onClick={closeWelcome} style={{
                      flex: 1, textDecoration: 'none', background: 'white', border: '1px solid #333', 
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#111', 
                      fontWeight: '800', fontSize: '1.15rem', padding: '40px 20px', textAlign: 'center',
                      transition: 'all 0.2s ease', cursor: 'pointer'
                    }} onMouseEnter={e => { e.currentTarget.style.background = '#f8f9fa'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <span>{t('welcome_btn_2_1')}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', marginTop: '8px', lineHeight: '1.4', whiteSpace: 'pre-line' }}>
                        {t('welcome_btn_2_2')}
                      </span>
                    </Link>
                  </div>

                  {/* Existing Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {[
                    { id: 1, icon: <Database />, color: '#0ca678', bg: '#ebfbee', label: t('guide_opt1'), path: '/bambupedia/tracker' },
                    { id: 2, icon: <Briefcase />, color: '#228be6', bg: '#e7f5ff', label: t('guide_opt2'), path: '/careers' },
                    { id: 3, icon: <UploadCloud />, color: '#fd7e14', bg: '#fff4e6', label: t('guide_opt3'), path: '/bamboochain/token-wallet?tab=contribute' },
                    { id: 4, icon: <HeartHandshake />, color: '#fa5252', bg: '#fff5f5', label: t('guide_opt4'), path: '/about' },
                    { id: 5, icon: <Handshake />, color: '#7950f2', bg: '#f3f0ff', label: t('guide_opt5'), path: '/bamboochain/supply-chain' },
                    { id: 6, icon: <ShoppingBag />, color: '#15aabf', bg: '#e3fafc', label: t('guide_opt6'), path: '/bamboochain/marketplace' },
                    { id: 7, icon: <BookOpen />, color: '#82c91e', bg: '#f4fce3', label: t('guide_opt7'), path: '/bambupedia' },
                    { id: 8, icon: <Search />, color: '#4c6ef5', bg: '#edf2ff', label: t('guide_opt8'), path: '/data-tools' },
                    { id: 9, icon: <MessageSquare />, color: '#e64980', bg: '#fff0f6', label: t('guide_opt9'), path: '/bamboochain/dao' },
                    { id: 10, icon: <Coins />, color: '#fab005', bg: '#fff9db', label: t('guide_opt10'), path: '/bamboochain/token-wallet' },
                    { id: 11, icon: <GraduationCap />, color: '#474747', bg: '#f1f3f5', label: t('guide_opt11'), path: '/bamboochain/academy' },
                    { id: 14, icon: <GraduationCap />, color: '#7950f2', bg: '#f3f0ff', label: t('guide_opt14'), path: '/academy' },
                    { id: 12, icon: <Users />, color: '#0ca678', bg: '#ebfbee', label: t('guide_opt12'), path: '/bamboochain/kodiba' },
                    { id: 13, icon: <Sparkles />, color: '#228be6', bg: '#e7f5ff', label: t('guide_opt13'), path: '/events' },
                    { id: 15, icon: <Video />, color: '#0ca678', bg: '#ebfbee', label: t('guide_opt15'), path: '/bamboochain/meeting' }
                  ].map(opt => (
                    <Link key={opt.id} to={opt.path} onClick={(e) => {
                      if (opt.id === 12) {
                        e.preventDefault();
                        setShowWelcome(false);
                        setShowKodibaTos(true);
                      } else {
                        closeWelcome();
                      }
                    }} style={{ 
                      textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', 
                      textAlign: 'center', padding: '15px 10px', borderRadius: '20px', background: '#f8f9fa',
                      border: '1px solid #e9ecef', transition: 'all 0.2s ease', cursor: 'pointer'
                    }} onMouseEnter={e => { e.currentTarget.style.background = opt.bg; e.currentTarget.style.borderColor = opt.color; }} onMouseLeave={e => { e.currentTarget.style.background = '#f8f9fa'; e.currentTarget.style.borderColor = '#e9ecef'; }}>
                      <div style={{ color: opt.color, marginBottom: '8px' }}>
                        {React.cloneElement(opt.icon, { size: 24 })}
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#495057', lineHeight: '1.2' }}>{opt.label}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
            
              <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#adb5bd', marginTop: '12px' }}>
                {t('welcome_footer')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KODIBA TOS MODAL */}
      {showKodibaTos && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div 
            className="animate-fade-in-up"
            style={{ background: '#1a1a1a', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left', border: '1px solid #51cf66', display: 'flex', flexDirection: 'column' }}
          >
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '10px', color: '#51cf66', textAlign: 'center' }}>{t('home_kodiba_tos_title')}</h2>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center', color: 'white' }}>{t('home_kodiba_tos_subtitle')}</h3>
            
            <div style={{ color: '#adb5bd', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '30px', paddingRight: '15px' }}>
              <p style={{ marginBottom: '15px' }}>
                {t('home_kodiba_tos_p1')}
              </p>
              <p style={{ marginBottom: '10px' }}>{t('home_kodiba_tos_p2')}</p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '15px', color: '#ced4da' }}>
                <li style={{ marginBottom: '5px' }}>{t('home_kodiba_tos_l1_1')}</li>
                <li style={{ marginBottom: '5px' }}>{t('home_kodiba_tos_l1_2')}</li>
                <li style={{ marginBottom: '5px' }}>{t('home_kodiba_tos_l1_3')}</li>
                <li style={{ marginBottom: '5px' }}>{t('home_kodiba_tos_l1_4')}</li>
                <li style={{ marginBottom: '5px' }}>{t('home_kodiba_tos_l1_5')}</li>
                <li style={{ marginBottom: '5px' }}>{t('home_kodiba_tos_l1_6')}</li>
              </ul>
              <p style={{ marginBottom: '15px' }}>
                {t('home_kodiba_tos_p3')}
              </p>
              <p style={{ marginBottom: '15px' }}>
                {t('home_kodiba_tos_p4')}
              </p>
              <p style={{ marginBottom: '10px' }}>{t('home_kodiba_tos_p5')}</p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '15px', color: '#ced4da' }}>
                <li style={{ marginBottom: '5px' }}>{t('home_kodiba_tos_l2_1')}</li>
                <li style={{ marginBottom: '5px' }}>{t('home_kodiba_tos_l2_2')}</li>
                <li style={{ marginBottom: '5px' }}>{t('home_kodiba_tos_l2_3')}</li>
                <li style={{ marginBottom: '5px' }}>{t('home_kodiba_tos_l2_4')}</li>
              </ul>
              <p style={{ fontStyle: 'italic', color: '#51cf66', textAlign: 'center', marginTop: '30px', marginBottom: '10px', fontWeight: 'bold', fontSize: '1.05rem' }}>
                {t('home_kodiba_tos_quote')}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: 'auto' }}>
              <button 
                onClick={() => setShowKodibaTos(false)}
                style={{ padding: '15px 30px', background: 'transparent', border: '1px solid #adb5bd', color: '#adb5bd', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
              >
                {t('home_kodiba_btn_back')}
              </button>
              <button 
                onClick={() => {
                  setShowKodibaTos(false);
                  navigate('/bamboochain/kodiba');
                }}
                style={{ padding: '15px 30px', background: '#51cf66', border: 'none', color: 'black', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
              >
                {t('home_kodiba_btn_next')}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default HomePage;
