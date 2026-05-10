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

        <div style={{ background: 'linear-gradient(135deg, #1c7ed6, #1864ab)', borderRadius: '24px', padding: '40px', color: 'white', marginBottom: '32px', boxShadow: '0 10px 30px rgba(24, 100, 171, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <ShieldCheck size={32} />
                <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>Admin Portal</h1>
              </div>
              <p style={{ opacity: 0.9, margin: 0 }}>Verifikasi mitra, lokasi penanaman, dan proposal ekosistem BaMbooChain.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Logged as</div>
              <div style={{ fontWeight: 'bold' }}>{user?.username || 'demo_admin'}</div>
            </div>
          </div>
        </div>

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
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f3f5' }}>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortalPage;
