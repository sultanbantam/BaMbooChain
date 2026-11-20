import { Leaf, Box } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const { t } = useLanguage();

  const navigate = useNavigate();

  const handleFiatDonate = () => {
    navigate('/bamboochain/plantation');
  };

  return (
    <section 
      id="home" 
      className="hero-section"
      style={{
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#162f22',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.85)), url("${getAssetUrl('agroforestry2.jpg')}")`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        color: 'white',
        paddingTop: 'calc(var(--navbar-height) + 40px)',
        paddingBottom: '40px',
        textAlign: 'center',
        paddingLeft: '16px',
        paddingRight: '16px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        width: '100%'
      }}
    >
      <div className="container animate-slide-up" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '0 8px', boxSizing: 'border-box' }}>
        <h1 style={{ 
          fontSize: 'clamp(1.5rem, 6vw, 2.8rem)', 
          marginBottom: '20px', 
          fontWeight: '800', 
          lineHeight: '1.25',
          maxWidth: '100%',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          letterSpacing: '-0.5px'
        }}>
          Yayasan Sabumi Nusantara Jaya
        </h1>
        <p style={{ 
          fontSize: 'clamp(0.92rem, 3.8vw, 1.2rem)', 
          marginBottom: '36px', 
          opacity: '0.92', 
          lineHeight: '1.65',
          maxWidth: '720px',
          margin: '0 auto 36px auto',
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}>
          {t('hero_desc')}
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleFiatDonate} className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '16px 48px', borderRadius: '30px' }}>
            <Leaf size={20} fill="currentColor" />
            {t('hero_btn_fiat')}
          </button>
        </div>
        
        <div style={{ marginTop: '36px', display: 'flex', justifyContent: 'center', gap: '16px', opacity: 0.85, fontSize: '0.9rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '50%' }}></div>
            {t('hero_badge_nature')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', background: 'var(--crypto)', borderRadius: '50%' }}></div>
            {t('hero_badge_smart')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
