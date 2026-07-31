import React from 'react';
import { Target, Lightbulb, ShieldCheck, Leaf, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  return (
    <section id="about" style={{ backgroundColor: '#fff', padding: '80px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '16px' }}>{t('about_title')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('about_vision_text')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(12, 166, 120, 0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--primary)' }}>
              <Leaf size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{t('about_card1_title')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{t('about_card1_desc')}</p>
            <Link to="/bamboochain/plantation" className="btn btn-primary" style={{ display: 'inline-block' }}>{t('about_card1_btn')}</Link>
          </div>

          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', border: '2px solid var(--primary)' }}>
            <div style={{ background: 'var(--primary)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'white' }}>
              <Users size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{t('about_card2_title')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{t('about_card2_desc')}</p>
            <Link to="/bamboochain/plantation" className="btn btn-primary" style={{ display: 'inline-block' }}>{t('about_card2_btn')}</Link>
          </div>

          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(12, 166, 120, 0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--primary)' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{t('about_card3_title')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{t('about_card3_desc')}</p>
            <Link to="/bamboochain/plantation" className="btn btn-primary" style={{ display: 'inline-block' }}>{t('about_card3_btn')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
