<<<<<<< HEAD
import React, { useState } from 'react';
import { Check, Eye, Filter, MapPin, Search, ShieldCheck, Users, X } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useAuth } from '../context/AuthContext';

const partnerApps = [
  { id: 'P-001', name: 'Koperasi Bambu Cibarani', role: 'Supplier', method: 'KYC Dokumen', location: 'Lebak, Banten', date: '2026-04-12', status: 'pending' },
  { id: 'P-002', name: 'EcoBuild Nusantara', role: 'Kontraktor', method: 'Referral', location: 'Tangerang', date: '2026-04-09', status: 'verified' },
  { id: 'P-003', name: 'Studio Arsitektur Hijau', role: 'Desain', method: 'Portfolio', location: 'Bandung', date: '2026-04-02', status: 'pending' },
];

const locations = [
  { id: 'L-001', name: 'Blok A Cibarani', owner: 'Kasepuhan Cibarani', coordinates: '-6.653, 106.212', size: '120 Ha', date: '2026-04-10', status: 'verified' },
  { id: 'L-002', name: 'Cisadane Riparian Zone', owner: 'Komunitas Sungai', coordinates: '-6.284, 106.631', size: '38 Ha', date: '2026-04-08', status: 'pending' },
];

const AdminPortalPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('partners');

  const rows = tab === 'partners' ? partnerApps : locations;

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: '#f0f2f5', paddingBottom: '80px' }}>
      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <BackButton to="/profile" />
        </div>

=======
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Users, MapPin, CheckCircle, XCircle, Clock, Eye, Filter, Download, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

const AdminPortalPage = () => {
  const { t } = useLanguage();
  const { 
    user, 
    isAuthenticated, 
    partnerApps, 
    locationProposals, 
    approvePartnerApp, 
    rejectPartnerApp, 
    approveLocation 
  } = useAuth();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('partners'); // 'partners' or 'locations'
  
  useEffect(() => {
    // Strict redirect: must be authenticated AND admin
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.username !== 'admin_yayasan') {
      navigate('/profile');
    }
  }, [isAuthenticated, user, navigate]);

  const handleApprovePartner = (id) => {
    approvePartnerApp(id);
    alert('Mitra berhasil diverifikasi!');
  };

  const handleRejectPartner = (id) => {
    if (window.confirm('Yakin ingin menolak pendaftaran ini?')) {
      rejectPartnerApp(id);
    }
  };

  const handleApproveLocation = (id) => {
    approveLocation(id);
    alert('Lokasi penanaman disetujui!');
  };

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', background: '#f0f2f5' }}>
      <div className="container" style={{ padding: '40px 24px' }}>
        
        <div style={{ marginBottom: '24px' }}>
           <BackButton to="/profile" />
        </div>

        {/* HEADER ADMIN */}
>>>>>>> 1346b48 (RECOVERY: Restore all features (Villa Bambu, Live Streaming, Ticker) to main branch)
        <div style={{ background: 'linear-gradient(135deg, #1c7ed6, #1864ab)', borderRadius: '24px', padding: '40px', color: 'white', marginBottom: '32px', boxShadow: '0 10px 30px rgba(24, 100, 171, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
<<<<<<< HEAD
                <ShieldCheck size={32} />
                <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>Admin Portal</h1>
              </div>
              <p style={{ opacity: 0.9, margin: 0 }}>Verifikasi mitra, lokasi penanaman, dan proposal ekosistem BaMbooChain.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Logged as</div>
              <div style={{ fontWeight: 'bold' }}>{user?.username || 'demo_admin'}</div>
=======
                <Shield size={32} />
                <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>{t('admin_portal_title')}</h1>
              </div>
              <p style={{ opacity: 0.9, margin: 0 }}>{t('admin_portal_subtitle')}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{t('admin_portal_logged_as')}</div>
              <div style={{ fontWeight: 'bold' }}>{t('admin_portal_role')}</div>
>>>>>>> 1346b48 (RECOVERY: Restore all features (Villa Bambu, Live Streaming, Ticker) to main branch)
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            ['Mitra Terdaftar', '152', Users, '#1c7ed6'],
            ['Lokasi Aktif', '18', MapPin, '#40c057'],
            ['Menunggu Review', '12', Filter, '#f59f00'],
            ['Lahan Terverifikasi', '450 Ha', ShieldCheck, '#7048e8'],
          ].map(([label, value, Icon, color]) => {
            const icon = React.createElement(Icon, { size: 20 });
            return (
              <div key={label} style={{ background: 'white', padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ background: `${color}15`, color, padding: '12px', borderRadius: '12px' }}>{icon}</div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#868e96' }}>{label}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#212529' }}>{value}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '8px', display: 'inline-flex', gap: '4px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          {[
            ['partners', 'Partners', Users],
            ['locations', 'Locations', MapPin],
          ].map(([id, label, Icon]) => {
            const icon = React.createElement(Icon, { size: 18 });
            return (
              <button key={id} onClick={() => setTab(id)} style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: tab === id ? '#1c7ed6' : 'transparent', color: tab === id ? 'white' : '#495057', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {icon} {label}
              </button>
            );
          })}
        </div>

        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '800' }}>{tab === 'partners' ? 'Partner Applications' : 'Location Proposals'}</h2>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
              <input type="text" placeholder="Search..." style={{ padding: '10px 16px 10px 40px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none', width: '240px' }} />
=======
        {/* STATS OVERVIEW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: t('admin_portal_stat_partners'), value: '152', icon: <Users size={20} />, color: '#1c7ed6' },
            { label: t('admin_portal_stat_locations'), value: '18', icon: <MapPin size={20} />, color: '#40c057' },
            { label: t('admin_portal_stat_pending'), value: '12', icon: <Clock size={20} />, color: '#f59f00' },
            { label: t('admin_portal_stat_land'), value: '450', icon: <Shield size={20} />, color: '#7048e8' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ background: `${stat.color}15`, color: stat.color, padding: '12px', borderRadius: '12px' }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#868e96' }}>{stat.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#212529' }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* TABS CONTROL */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '8px', display: 'inline-flex', gap: '4px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <button 
            onClick={() => setActiveTab('partners')}
            style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: activeTab === 'partners' ? '#1c7ed6' : 'transparent', color: activeTab === 'partners' ? 'white' : '#495057', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Users size={18} /> {t('admin_portal_tab_partners')}
          </button>
          <button 
            onClick={() => setActiveTab('locations')}
            style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: activeTab === 'locations' ? '#1c7ed6' : 'transparent', color: activeTab === 'locations' ? 'white' : '#495057', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <MapPin size={18} /> {t('admin_portal_tab_locations')}
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '800' }}>
              {activeTab === 'partners' ? t('admin_portal_tab_partners') : t('admin_portal_tab_locations')}
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input type="text" placeholder={t('admin_portal_search')} style={{ padding: '10px 16px 10px 40px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none', width: '240px' }} />
              </div>
              <button style={{ background: '#f8f9fa', border: '1px solid #dee2e6', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}><Filter size={20} /></button>
              <button style={{ background: '#f8f9fa', border: '1px solid #dee2e6', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}><Download size={20} /></button>
>>>>>>> 1346b48 (RECOVERY: Restore all features (Villa Bambu, Live Streaming, Ticker) to main branch)
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f3f5' }}>
<<<<<<< HEAD
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>{tab === 'partners' ? 'Name' : 'Location'}</th>
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>{tab === 'partners' ? 'Role' : 'Owner'}</th>
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>Date</th>
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>Status</th>
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                    <td style={{ padding: '20px 16px' }}>
                      <div style={{ fontWeight: 'bold', color: '#212529' }}>{row.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#868e96' }}>{row.location || row.coordinates}</div>
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{row.role || row.owner}</div>
                      <div style={{ fontSize: '0.8rem', color: '#1c7ed6' }}>{row.method || row.size}</div>
                    </td>
                    <td style={{ padding: '20px 16px', fontSize: '0.9rem' }}>{row.date}</td>
                    <td style={{ padding: '20px 16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', background: row.status === 'verified' ? '#ebfbee' : '#fff9db', color: row.status === 'verified' ? '#2b8a3e' : '#e67700' }}>{row.status.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid #dee2e6', background: 'white', cursor: 'pointer' }}><Eye size={16} /></button>
                        {row.status === 'pending' && (
                          <>
                            <button style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#40c057', color: 'white', cursor: 'pointer' }}><Check size={16} /></button>
                            <button style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#fa5252', color: 'white', cursor: 'pointer' }}><X size={16} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
=======
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>{activeTab === 'partners' ? t('admin_portal_table_name') : t('admin_portal_table_loc_name')}</th>
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>{activeTab === 'partners' ? t('admin_portal_table_role') : t('admin_portal_table_owner')}</th>
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>{t('admin_portal_table_date')}</th>
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>{t('admin_portal_table_status')}</th>
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem', textAlign: 'center' }}>{t('admin_portal_table_action')}</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === 'partners' ? (
                  partnerApps.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid #f1f3f5', transition: '0.2s' }}>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontWeight: 'bold', color: '#212529' }}>{app.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#868e96' }}>{app.location}</div>
                      </td>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{app.role}</div>
                        <div style={{ fontSize: '0.8rem', color: '#1c7ed6' }}>{app.method}</div>
                      </td>
                      <td style={{ padding: '20px 16px', fontSize: '0.9rem' }}>{app.date}</td>
                      <td style={{ padding: '20px 16px' }}>
                        <span style={{ 
                          padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                          background: app.status === 'verified' ? '#ebfbee' : app.status === 'pending' ? '#fff9db' : '#fff5f5',
                          color: app.status === 'verified' ? '#2b8a3e' : app.status === 'pending' ? '#e67700' : '#e03131'
                        }}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button onClick={() => alert('Detail Mitra')} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #dee2e6', background: 'white', cursor: 'pointer' }}><Eye size={16} /></button>
                          {app.status === 'pending' && (
                            <>
                              <button onClick={() => handleApprovePartner(app.id)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#40c057', color: 'white', cursor: 'pointer' }}><CheckCircle size={16} /></button>
                              <button onClick={() => handleRejectPartner(app.id)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#fa5252', color: 'white', cursor: 'pointer' }}><XCircle size={16} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  locationProposals.map((loc) => (
                    <tr key={loc.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontWeight: 'bold' }}>{loc.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#868e96' }}>{loc.coordinates}</div>
                      </td>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{loc.owner}</div>
                        <div style={{ fontSize: '0.8rem', color: '#1c7ed6' }}>{loc.size}</div>
                      </td>
                      <td style={{ padding: '20px 16px', fontSize: '0.9rem' }}>{loc.date}</td>
                      <td style={{ padding: '20px 16px' }}>
                        <span style={{ 
                          padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                          background: loc.status === 'verified' ? '#ebfbee' : '#fff9db',
                          color: loc.status === 'verified' ? '#2b8a3e' : '#e67700'
                        }}>
                          {loc.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                         <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid #dee2e6', background: 'white', cursor: 'pointer' }}><Eye size={16} /></button>
                          {loc.status === 'pending' && (
                             <button onClick={() => handleApproveLocation(loc.id)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#40c057', color: 'white', cursor: 'pointer' }}><CheckCircle size={16} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
>>>>>>> 1346b48 (RECOVERY: Restore all features (Villa Bambu, Live Streaming, Ticker) to main branch)
              </tbody>
            </table>
          </div>
        </div>
<<<<<<< HEAD
=======

>>>>>>> 1346b48 (RECOVERY: Restore all features (Villa Bambu, Live Streaming, Ticker) to main branch)
      </div>
    </div>
  );
};

export default AdminPortalPage;
