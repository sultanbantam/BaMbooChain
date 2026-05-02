import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Programs = () => {
  const { t } = useLanguage();

  const programs = [
    {
      title: t('prog_1_title'),
      desc: t('prog_1_desc'),
      progress: 65
    },
    {
      title: t('prog_2_title'),
      desc: t('prog_2_desc'),
      progress: 40
    },
    {
      title: t('prog_3_title'),
      desc: t('prog_3_desc'),
      progress: 85
    },
    {
      title: t('prog_4_title'),
      desc: t('prog_4_desc'),
      progress: 55
    }
  ];

  return (
    <section id="programs" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 className="animate-fade-in" style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '16px' }}>{t('prog_title')}</h2>
          <p className="animate-slide-up delay-100" style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
            {t('prog_desc')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          {programs.map((prog, index) => (
            <div key={index} className={`glass animate-slide-up delay-${(index + 2) * 100}`} style={{ padding: '32px', textAlign: 'left', transition: 'transform 0.3s ease', cursor: 'pointer' }} 
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--primary)' }}>{prog.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.6' }}>{prog.desc}</p>
              
              <div style={{ width: '100%', background: '#e9ecef', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${prog.progress}%`, background: 'var(--primary)', height: '100%' }}></div>
              </div>
              <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{t('prog_progress')} {prog.progress}%</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
