import React, { useState, useEffect } from 'react';
import { Leaf, Users, MapPin, Globe, ShieldCheck, Droplet, Mountain, CheckCircle, ArrowRight, Activity, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { useLanguage } from '../context/LanguageContext';
import { getAssetUrl } from '../utils/assets';
import { usePlantationDonations, useGlobalSettings } from '../hooks/useFirestoreQueries';

const ImpactPage = () => {
  const { t } = useLanguage();
  const { bmcBalance, isConnected, rawBmcBalance } = useWeb3();
  const [isVisible, setIsVisible] = useState(false);
  const { data: allDonations = [] } = usePlantationDonations();
  const { data: globalSettings } = useGlobalSettings();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const activeDonations = allDonations.filter(d => d.status === 'verified' || d.status === 'active');
  const firestoreAUM = activeDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  
  const treesPlanted = activeDonations.reduce((sum, d) => {
    return sum + (d.milestones?.tanam?.released ? Number(d.amount || 0) : 0);
  }, 0);
  
  const treesMaintained = activeDonations.reduce((sum, d) => {
    return sum + (d.milestones?.rawat?.released ? Number(d.amount || 0) : 0);
  }, 0);

  const co2Factor = globalSettings?.co2PerClump || 0.5;
  const landFactor = globalSettings?.landPerClump || 0.01;

  const metrics = [
    { id: 1, value: `${treesPlanted.toLocaleString()}`, label: t('impact_stat_trees'), icon: <Sprout size={32} />, source: 'Admin Verified' },
    { id: 2, value: `${(treesMaintained * co2Factor).toLocaleString(undefined, { maximumFractionDigits: 1 })}`, label: t('impact_stat_co2'), icon: <Leaf size={32} />, source: 'Admin Verified' },
    { id: 3, value: `${(treesPlanted * landFactor).toLocaleString(undefined, { maximumFractionDigits: 2 })} Ha`, label: t('impact_stat_land'), icon: <MapPin size={32} />, source: 'On-Chain GIS' },
    { id: 4, value: `${activeDonations.length > 0 ? activeDonations.length : 0}`, label: t('impact_stat_farmers'), icon: <Users size={32} />, source: 'Admin Verified' }
  ];

  const sdgs = [
    { id: 1, num: '1', title: 'No Poverty', color: '#e5243b' },
    { id: 6, num: '6', title: 'Clean Water and Sanitation', color: '#26bde2' },
    { id: 7, num: '7', title: 'Affordable and Clean Energy', color: '#fcc30b' },
    { id: 8, num: '8', title: 'Decent Work & Economic Growth', color: '#a21942' },
    { id: 10, num: '10', title: 'Reduced Inequality', color: '#dd1367' },
    { id: 11, num: '11', title: 'Sustainable Cities and Communities', color: '#fd9d24' },
    { id: 12, num: '12', title: 'Responsible Consumption and Production', color: '#bf8b2e' },
    { id: 13, num: '13', title: 'Climate Action', color: '#3f7e44' },
    { id: 15, num: '15', title: 'Life on Land', color: '#56c02b' },
    { id: 17, num: '17', title: 'Partnership to Achieve The Goal', color: '#19486a' }
  ];

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* HERO SECTION */}
      <div style={{ 
        paddingTop: '180px', 
        paddingBottom: '100px', 
        background: 'linear-gradient(135deg, #0c5936 0%, #0ca678 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Background Elements */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.1, transform: 'rotate(15deg)' }}>
          <Leaf size={400} />
        </div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1, animation: isVisible ? 'fadeInUp 0.8s ease-out' : 'none' }}>
          <div style={{ maxWidth: '800px', marginBottom: '60px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '24px' }}>
              <Globe size={18} /> {t('impact_report_tag')}
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '24px', lineHeight: '1.2' }}>{t('impact_title')}</h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: '1.6' }}>
              {t('impact_subtitle')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
             {metrics.map((m) => (
              <div key={m.id} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '32px 24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.2)', position: 'relative' }}>
                <div style={{ color: '#ffec99', marginBottom: '16px' }}>{m.icon}</div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>{m.value}</h2>
                <div style={{ opacity: 0.9, fontSize: '1rem', marginBottom: '12px' }}>{m.label}</div>
                <div style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '8px', display: 'inline-block' }}>{m.source}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 2 }}>
        
        {/* WEB3 TRANSPARENCY WIDGET */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', marginBottom: '80px', animation: isVisible ? 'slideIn 0.8s 0.2s both' : 'none' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)', marginBottom: '16px' }}>
              <ShieldCheck size={28} />
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t('impact_transparency_title')}</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
              {t('impact_transparency_desc')}
            </p>
            <Link to="/bamboochain/data-analytics" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
              {t('impact_transparency_link')} <ArrowRight size={18} />
            </Link>
          </div>
          <div style={{ flex: '1 1 300px', background: '#f8f9fa', padding: '30px', borderRadius: '20px', border: '1px solid #dee2e6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #dee2e6', paddingBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('impact_contract_status')}</span>
              <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14}/> {isConnected ? t('impact_live_web3') : t('impact_verified_node')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{t('impact_total_funds')}</span>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${(firestoreAUM + (isConnected ? rawBmcBalance * 1.5 : 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{t('impact_validated_projects')}</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{activeDonations.length} {t('impact_land_points')}</span>
            </div>
          </div>
        </div>

        {/* CULTURAL & ECOLOGICAL NARRATIVE */}
        <div style={{ marginBottom: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--text-main)', marginBottom: '16px' }}>{t('impact_section2_title')}</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>{t('impact_section2_subtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {/* Box 1 */}
            <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', transition: '0.3s' }} className="hover-lift">
              <div style={{ height: '300px', background: `url(${getAssetUrl('gambar/pehc.JPG')}) center/cover` }}></div>
              <div style={{ padding: '30px' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', marginBottom: '20px' }}>
                  <Droplet size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: 'var(--text-main)' }}>{t('impact_box1_title')}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>{t('impact_box1_desc')}</p>
              </div>
            </div>

            {/* Box 2 */}
            <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', transition: '0.3s' }} className="hover-lift">
              <div style={{ height: '200px', background: 'url("https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80") center/cover' }}></div>
              <div style={{ padding: '30px' }}>
                <div style={{ background: 'rgba(245, 159, 0, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59f00', marginBottom: '20px' }}>
                  <Mountain size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: 'var(--text-main)' }}>{t('impact_box2_title')}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>{t('impact_box2_desc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SDG ALIGNMENT */}
        <div style={{ background: 'white', borderRadius: '32px', padding: '60px 40px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '16px' }}>{t('impact_sdg_title')}</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 40px' }}>{t('impact_sdg_desc')}</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {sdgs.map(sdg => (
              <div key={sdg.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8f9fa', padding: '16px 24px', borderRadius: '16px', border: '1px solid #dee2e6' }}>
                <div style={{ width: '40px', height: '40px', background: sdg.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', borderRadius: '8px' }}>
                  {sdg.num}
                </div>
                <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{t(`sdg_${sdg.num}`)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .hover-lift:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default ImpactPage;
