import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Plus, Eye, EyeOff, Trash2, Copy, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [apps, setApps] = useState([]);
  const [newAppName, setNewAppName] = useState('');
  const [newAppRedirects, setNewAppRedirects] = useState('');
  const [showSecret, setShowSecret] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`developer_apps_${user.id}`);
      if (saved) {
        setApps(JSON.parse(saved));
      }
    }
  }, [user]);

  const saveApps = (newApps) => {
    setApps(newApps);
    if (user) {
      localStorage.setItem(`developer_apps_${user.id}`, JSON.stringify(newApps));
    }
  };

  const generateCredentials = async (e) => {
    e.preventDefault();
    if (!newAppName.trim() || !user) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/oauth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newAppName, 
          uid: user.id,
          redirectUris: newAppRedirects.split(',').map(u => u.trim()).filter(u => u)
        })
      });
      const data = await res.json();
      
      if (data.success && data.app) {
        saveApps([data.app, ...apps]);
        setNewAppName('');
        setNewAppRedirects('');
        if (data.message) {
          alert(data.message);
        }
      } else {
        alert("Gagal membuat kredensial: " + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteApp = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kredensial ini? Aplikasi pihak ketiga mungkin tidak dapat mengakses BaMbooChain lagi.")) {
      saveApps(apps.filter(app => app.id !== id));
    }
  };

  const toggleSecret = (id) => {
    setShowSecret(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, id, type) => {
    navigator.clipboard.writeText(text);
    setCopiedId(`${id}_${type}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
        <Navbar />
        <div style={{ paddingTop: '150px', textAlign: 'center' }}>
          <h2>Silakan login untuk mengakses pengaturan.</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ paddingTop: 'calc(var(--navbar-height, 80px) + 40px)', paddingBottom: '80px' }}>
        <div className="container">
          <BackButton to="/" />
          
          <div style={{ marginTop: '20px', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '10px' }}>
              Developer Portal
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
              Kelola akses API dan integrasi aplikasi pihak ketiga dengan ekosistem BaMbooChain.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
            
            {/* Form Buat Aplikasi Baru */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass"
              style={{ 
                padding: '30px', 
                borderRadius: '24px', 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-color)',
                height: 'fit-content'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '16px', color: '#10b981' }}>
                  <Key size={24} />
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0, color: 'var(--text-main)' }}>Buat Kredensial Baru</h2>
              </div>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.6' }}>
                Dapatkan <strong>Client ID</strong> dan <strong>Client Secret</strong> untuk mengintegrasikan game atau aplikasi Web3 Anda dengan login dan dompet BaMbooChain.
              </p>

              <form onSubmit={generateCredentials}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.9rem' }}>Nama Aplikasi</label>
                  <input 
                    type="text" 
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    placeholder="Misal: Bamboo Farm Game"
                    style={{ 
                      width: '100%', padding: '14px 16px', borderRadius: '12px',
                      border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                      color: 'var(--text-main)', fontSize: '1rem', outline: 'none'
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.9rem' }}>Authorized Redirect URIs (Pisahkan dengan koma)</label>
                  <input 
                    type="text" 
                    value={newAppRedirects}
                    onChange={(e) => setNewAppRedirects(e.target.value)}
                    placeholder="Misal: https://myapp.com/callback, https://test.app/auth"
                    style={{ 
                      width: '100%', padding: '14px 16px', borderRadius: '12px',
                      border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                      color: 'var(--text-main)', fontSize: '1rem', outline: 'none'
                    }}
                  />
                </div>
                <button 
                  type="submit"
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                    background: isGenerating ? '#9ca3af' : '#10b981', color: 'white', fontWeight: 'bold', fontSize: '1rem',
                    cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'transform 0.2s', boxShadow: isGenerating ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)'
                  }}
                  disabled={isGenerating}
                  onMouseOver={(e) => { if (!isGenerating) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Plus size={20} /> {isGenerating ? 'Memproses...' : 'Generate API Keys'}
                </button>
              </form>
            </motion.div>

            {/* Daftar Aplikasi */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '24px', color: 'var(--text-main)' }}>Aplikasi Terdaftar ({apps.length})</h2>
              
              {apps.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '24px', border: '1px dashed var(--border-color)' }}>
                  <Key size={48} color="#ccc" style={{ marginBottom: '16px' }} />
                  <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Belum Ada Aplikasi</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Anda belum men-generate API keys apapun. Silakan buat di form sebelah kiri.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {apps.map((app) => (
                    <div key={app.id} style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div>
                          <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>{app.name}</h3>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dibuat: {new Date(app.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                        <button 
                          onClick={() => deleteApp(app.id)}
                          style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
                          title="Hapus Kredensial"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Client ID */}
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Client ID</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <code style={{ flex: 1, padding: '10px 14px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-main)', wordBreak: 'break-all' }}>
                              {app.clientId}
                            </code>
                            <button onClick={() => copyToClipboard(app.clientId, app.id, 'id')} style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-main)' }}>
                              {copiedId === `${app.id}_id` ? <CheckCircle size={18} color="#10b981" /> : <Copy size={18} />}
                            </button>
                          </div>
                        </div>

                        {/* Client Secret */}
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Client Secret</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <code style={{ flex: 1, padding: '10px 14px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-main)', wordBreak: 'break-all' }}>
                              {showSecret[app.id] ? app.clientSecret : '••••••••••••••••••••••••••••••••'}
                            </code>
                            <button onClick={() => toggleSecret(app.id)} style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-main)' }}>
                              {showSecret[app.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <button onClick={() => copyToClipboard(app.clientSecret, app.id, 'secret')} style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-main)' }}>
                              {copiedId === `${app.id}_secret` ? <CheckCircle size={18} color="#10b981" /> : <Copy size={18} />}
                            </button>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#eab308', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontWeight: 'bold' }}>Peringatan:</span> Rahasiakan Client Secret Anda.
                          </div>
                        </div>

                        {/* Redirect URIs */}
                        {app.redirectUris && app.redirectUris.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Redirect URIs</div>
                            <div style={{ background: 'rgba(0,0,0,0.05)', padding: '10px 14px', borderRadius: '8px' }}>
                              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-main)', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                                {app.redirectUris.map((uri, idx) => (
                                  <li key={idx}>{uri}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SettingsPage;
