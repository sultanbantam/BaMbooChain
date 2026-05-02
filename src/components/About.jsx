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
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Adopsi Bambu</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Dukungan langsung untuk bibit bambu berkualitas yang akan ditanam oleh petani binaan di ekosistem bambuNUSA.</p>
            <Link to="/bamboochain/plantation" className="btn btn-primary" style={{ display: 'inline-block' }}>Ayo Mulai</Link>
          </div>

          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', border: '2px solid var(--primary)' }}>
            <div style={{ background: 'var(--primary)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'white' }}>
              <Users size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Menjadi Petani Milenial</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Bergabunglah dalam gerakan ekonomi hijau. Kami mendampingi petani dengan teknologi dan akses ke pasar global.</p>
            <Link to="/bamboochain/plantation" className="btn btn-primary" style={{ display: 'inline-block' }}>Daftar Program</Link>
          </div>

          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(12, 166, 120, 0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--primary)' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Menjadi Orang Tua Asuh</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Investasi berdampak untuk masa depan. Pantau pertumbuhan aset hijau Anda secara transparan melalui blockchain.</p>
            <Link to="/bamboochain/plantation" className="btn btn-primary" style={{ display: 'inline-block' }}>Ambil Peran</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
