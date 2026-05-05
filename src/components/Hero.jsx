import { Leaf, Box } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';
import { donateCrypto } from '../utils/web3';
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
      style={{
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url("${getAssetUrl('agroforestry2.png')}") center/cover no-repeat`,
        color: 'white',
        paddingTop: 'calc(var(--navbar-height) + 40px)',
        textAlign: 'center',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}
    >
      <div className="container animate-slide-up" style={{ maxWidth: '900px' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 8vw, 3.5rem)', marginBottom: '24px', fontWeight: '800', lineHeight: '1.2' }}>
          Yayasan Sabumi Nusantara Jaya
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', marginBottom: '40px', opacity: '0.9', lineHeight: '1.6' }}>
          {t('hero_desc')}
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleFiatDonate} className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '16px 48px', borderRadius: '30px' }}>
            <Leaf size={20} fill="currentColor" />
            {t('hero_btn_fiat')}
          </button>
        </div>
        
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '24px', opacity: 0.8, fontSize: '0.9rem' }}>
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
