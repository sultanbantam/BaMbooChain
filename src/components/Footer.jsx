import React from 'react';
import { Mail, Phone, MapPin, Link } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer style={{ background: '#212529', color: 'white', padding: '80px 0 40px', borderTop: '5px solid var(--primary)' }}>
      <div className="container">
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--primary)' }}>{t('foot_contact')}</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#adb5bd' }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MapPin size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>Jl. Kelapa Dua Link. Cantilan RT. 001 RW. 009 Kel. Kagungan<br />Kec. Serang, Kota Serang, Banten.</span>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Phone size={20} color="var(--primary)" />
                08174139994
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Mail size={20} color="var(--primary)" />
                sabuminusantarajaya@gmail.com
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--primary)' }}>{t('foot_social')}</h3>
            <p style={{ color: '#adb5bd', marginBottom: '20px' }}>{t('foot_social_desc')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#adb5bd' }}>
              <a href="https://www.youtube.com/@bambupedia" target="_blank" rel="noreferrer" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="6" fill="#4CAF50"/>
                  <circle cx="12" cy="12" r="10" stroke="#8D6E63" strokeWidth="1.5" fill="none"/>
                  <path d="M10 8L16 12L10 16V8Z" fill="white"/>
                </svg>
                YouTube
              </a>
              <a href="https://x.com/bambucoid" target="_blank" rel="noreferrer" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="11" fill="#4CAF50"/>
                  <circle cx="12" cy="12" r="10" stroke="#8D6E63" strokeWidth="1.5" fill="none"/>
                  <path d="M7 6L17 18M17 6L7 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                X (Twitter)
              </a>
              <a href="https://www.facebook.com/share/1ChqUTsK1N/" target="_blank" rel="noreferrer" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="11" fill="#4CAF50"/>
                  <circle cx="12" cy="12" r="10" stroke="#8D6E63" strokeWidth="1.5" fill="none"/>
                  <path d="M13 8H15V6H13C11.34 6 10 7.34 10 9V10H8V12H10V18H12V12H14L15 10H12V9C12 8.45 12.45 8 13 8Z" fill="white"/>
                </svg>
                Facebook Fanpage
              </a>
              <a href="https://www.facebook.com/share/1HjRYCdnPr/" target="_blank" rel="noreferrer" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="11" fill="#4CAF50"/>
                  <circle cx="12" cy="12" r="10" stroke="#8D6E63" strokeWidth="1.5" fill="none"/>
                  <path d="M13 8H15V6H13C11.34 6 10 7.34 10 9V10H8V12H10V18H12V12H14L15 10H12V9C12 8.45 12.45 8 13 8Z" fill="white"/>
                </svg>
                Facebook Fanpage 2
              </a>
              <a href="https://www.instagram.com/sabuminusantarajaya?igsh=MW1wejZ6bnR1amZyag==" target="_blank" rel="noreferrer" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="11" fill="#4CAF50"/>
                  <circle cx="12" cy="12" r="10" stroke="#8D6E63" strokeWidth="1.5" fill="none"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                  <circle cx="17" cy="7" r="1.2" fill="white"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>
          
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--primary)' }}>Crypto Exchange & Web3</h3>
            <p style={{ color: '#adb5bd', marginBottom: '20px' }}>Gunakan link referral untuk menyelesaikan misi.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#adb5bd' }}>
              <a href="https://www.bmwweb.biz/referral/earn-together/refer2earn-usdc/claim?hl=en&ref=GRO_28502_FFUQO&utm_source=referral_entrance" target="_blank" rel="noreferrer" style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#adb5bd', textDecoration: 'none' }}>
                <Link size={20} color="var(--primary)" /> Binance
              </a>
              <a href="https://www.kucoin.com/r/rf/QBSA2YN1" target="_blank" rel="noreferrer" style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#adb5bd', textDecoration: 'none' }}>
                <Link size={20} color="var(--primary)" /> KuCoin
              </a>
              <a href="https://www.tokocrypto.com/app?scope=register&ref=A9S2F9I6" target="_blank" rel="noreferrer" style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#adb5bd', textDecoration: 'none' }}>
                <Link size={20} color="var(--primary)" /> Tokocrypto
              </a>
              <a href="https://app.bxjddjt.com/referral/earn-together/invite/UFEWVFpY?ref=UFEWVFpY&ref_type=103&utm_cmp=rXJBDjtJ&activity_id=1775815609617" target="_blank" rel="noreferrer" style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#adb5bd', textDecoration: 'none' }}>
                <Link size={20} color="var(--primary)" /> Gate.io
              </a>
              <a href="https://interlinklabs.ai/referral?refCode=08174139994" target="_blank" rel="noreferrer" style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#adb5bd', textDecoration: 'none' }}>
                <Link size={20} color="var(--primary)" /> Interlinklabs
              </a>
              <div style={{ borderTop: '1px solid #495057', marginTop: '8px', paddingTop: '16px' }}>
                <a href="https://minepi.com/sultanbantam" target="_blank" rel="noreferrer" style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#adb5bd', textDecoration: 'none' }}>
                  <Link size={20} color="#fcc419" /> Join Pi Network
                </a>
              </div>
            </div>
          </div>
          
        </div>

        <div style={{ borderTop: '1px solid #495057', paddingTop: '32px', textAlign: 'center', color: '#6c757d' }}>
          <p>{t('foot_copyright')}</p>
          <div style={{ marginTop: '12px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <p>Smart Contract BMC jaringan BEP20 : <code>0x812d9709f0A53982606b823Ee61d5CA216F7F9c0</code></p>
            <img src="/bmc-bep20.jpeg" alt="Smart Contract BMC BEP20" style={{ width: '150px', borderRadius: '8px' }} />
            
            <p style={{ marginTop: '16px', borderTop: '1px dashed #495057', paddingTop: '16px', maxWidth: '600px', margin: '0 auto' }}>
              Informasi di website ini bersifat edukasi dan bukan merupakan ajakan atau rekomendasi investasi. <a href="/faq" style={{ color: 'var(--primary)', textDecoration: 'underline', marginRight: '10px' }}>Pusat Bantuan (FAQ)</a> | <a href="/disclaimer" style={{ color: 'var(--primary)', textDecoration: 'underline', marginRight: '10px' }}>Baca Disclaimer Selengkapnya</a> | <a href="/validator" style={{ color: '#f59f00', textDecoration: 'underline' }}>Portal Validator Lapangan</a>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
