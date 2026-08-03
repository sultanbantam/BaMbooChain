import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, XCircle, ShieldCheck, FileText, Image, Search, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { useAuth } from '../../context/AuthContext';
import { subscribeKnowledgeItems, updateKnowledgeStatus } from '../../utils/knowledgeService';

const KnowledgeAdminPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [activeStatus, setActiveStatus] = useState('pending'); // pending, approved, rejected, auto-validated
  const [queryText, setQueryText] = useState('');
  const [adminNotes, setAdminNotes] = useState({});
  const [isProcessing, setIsProcessing] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (user?.username !== 'admin_yayasan') navigate('/profile');
  }, [isAuthenticated, navigate, user?.username]);

  useEffect(() => {
    // If auto-validated, we want to fetch 'published' or 'approved' items that have auto_verified = true
    // The knowledgeService might need to handle this, but since it fetches all by status, 
    // we can fetch 'approved' for auto-validated if that's what the scraper saves.
    const statusQuery = activeStatus === 'auto-validated' ? 'approved' : activeStatus;
    
    const unsubscribe = subscribeKnowledgeItems({
      status: statusQuery,
      callback: (fetchedItems) => {
        if (activeStatus === 'auto-validated') {
           setItems(fetchedItems.filter(item => item.auto_verified === true));
        } else {
           setItems(fetchedItems.filter(item => item.auto_verified !== true));
        }
      },
      onError: (error) => console.error('Knowledge admin sync error:', error)
    });
    return unsubscribe;
  }, [activeStatus]);

  const filteredItems = useMemo(() => {
    const needle = queryText.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      [item.title, item.summary, item.tags, item.species, item.location, item.author, item.createdByUsername]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle)
    );
  }, [items, queryText]);

  const handleStatus = async (item, status) => {
    const confirmText = status === 'approved' ? 'Setujui sumber ini untuk BambooBot RAG?' : 'Tolak sumber ini?';
    if (!window.confirm(confirmText)) return;

    setIsProcessing(item.id);
    try {
      await updateKnowledgeStatus({
        itemId: item.id,
        status,
        admin: user,
        adminNotes: adminNotes[item.id] || ''
      });
    } catch (error) {
      console.error('Knowledge status update failed:', error);
      alert(`Gagal memperbarui status: ${error.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: '#f0f2f5' }}>
      <style>{`
        .admin-knowledge-container { padding: 40px 24px 100px; }
        .admin-knowledge-header { padding: 34px; margin-bottom: 24px; border-radius: 24px; }
        .admin-knowledge-header h1 { font-size: 2rem; }
        .admin-knowledge-controls { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
        .admin-knowledge-tabs { background: white; border-radius: 16px; padding: 6px; display: inline-flex; gap: 4px; overflow-x: auto; max-width: 100%; white-space: nowrap; -webkit-overflow-scrolling: touch; }
        .admin-knowledge-search { position: relative; min-width: 280px; }
        .admin-knowledge-card { background: white; border-radius: 20px; padding: 24px; border: 1px solid #e9ecef; box-shadow: 0 8px 24px rgba(0,0,0,0.03); }
        .admin-knowledge-card-header { display: grid; grid-template-columns: 1fr auto; gap: 18px; align-items: start; }
        .admin-knowledge-card h2 { font-size: 1.25rem; }
        
        @media (max-width: 768px) {
          .admin-knowledge-container { padding: 20px 16px 100px; }
          .admin-knowledge-header { padding: 20px; border-radius: 16px; margin-bottom: 16px; }
          .admin-knowledge-header h1 { font-size: 1.5rem; }
          .admin-knowledge-controls { flex-direction: column; align-items: stretch; gap: 12px; }
          .admin-knowledge-tabs { width: 100%; }
          .admin-knowledge-search { min-width: 100%; width: 100%; }
          .admin-knowledge-card { padding: 16px; border-radius: 16px; }
          .admin-knowledge-card-header { grid-template-columns: 1fr; gap: 12px; }
          .admin-knowledge-card-header .status-badge { align-self: flex-start; }
          .admin-knowledge-card h2 { font-size: 1.1rem; }
        }
      `}</style>
      <div className="container admin-knowledge-container">
        <BackButton to="/admin-portal" />

        <header className="admin-knowledge-header" style={{ marginTop: '24px', background: 'linear-gradient(135deg, #0ca678, #087f5b)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <ShieldCheck size={32} />
            <h1 style={{ margin: 0 }}>Admin Verification Knowledge</h1>
          </div>
          <p style={{ margin: 0, opacity: 0.9 }}>Setujui sumber bambu sebelum masuk ke Knowledge Library dan dipakai BambuBot RAG.</p>
        </header>

        <div className="admin-knowledge-controls">
          <div className="admin-knowledge-tabs">
            {['pending', 'approved', 'rejected', 'auto-validated'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                style={{
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: activeStatus === status ? 'var(--primary)' : 'transparent',
                  color: activeStatus === status ? 'white' : '#495057',
                  fontWeight: '800',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="admin-knowledge-search">
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#868e96' }} />
            <input value={queryText} onChange={(e) => setQueryText(e.target.value)} placeholder="Cari judul, spesies, uploader..." style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: '14px', border: '1px solid #dee2e6' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '20px', padding: '36px', textAlign: 'center', color: '#868e96' }}>
              Tidak ada sumber dengan status {activeStatus}.
            </div>
          ) : filteredItems.map((item) => (
            <article key={item.id} className="admin-knowledge-card">
              <div className="admin-knowledge-card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '800', fontSize: '0.82rem', marginBottom: '8px' }}>
                    {item.type === 'Gambar' ? <Image size={16} /> : <FileText size={16} />}
                    {item.type} oleh @{item.createdByUsername || 'guest'}
                  </div>
                  <h2 style={{ margin: '0 0 8px', color: '#212529' }}>{item.title}</h2>
                  <p style={{ margin: '0 0 14px', color: '#495057', lineHeight: 1.6 }}>{item.summary}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.78rem', color: '#495057' }}>
                    {item.species && <span style={pillStyle}>{item.species}</span>}
                    {item.location && <span style={pillStyle}>{item.location}</span>}
                    {item.author && <span style={pillStyle}>{item.author}</span>}
                    {item.year && <span style={pillStyle}>{item.year}</span>}
                    {item.tags && <span style={pillStyle}>{item.tags}</span>}
                  </div>
                </div>

                <span className="status-badge" style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  fontWeight: '900',
                  fontSize: '0.72rem',
                  background: item.status === 'approved' ? '#ebfbee' : item.status === 'rejected' ? '#fff5f5' : '#fff9db',
                  color: item.status === 'approved' ? '#2b8a3e' : item.status === 'rejected' ? '#e03131' : '#e67700'
                }}>
                  {item.status?.toUpperCase()}
                </span>
              </div>

              {(item.fileUrl || item.sourceUrl) && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                  {item.fileUrl && <a href={item.fileUrl} target="_blank" rel="noreferrer" style={linkStyle}><ExternalLink size={14} /> Buka File</a>}
                  {item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer" style={linkStyle}><ExternalLink size={14} /> Sumber Asli</a>}
                </div>
              )}

              {item.extractedText && (
                <details style={{ marginTop: '16px', color: '#495057' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: '800' }}>Lihat teks/abstrak yang akan dipakai RAG</summary>
                  <div style={{ marginTop: '10px', background: '#f8f9fa', borderRadius: '12px', padding: '14px', maxHeight: '180px', overflow: 'auto', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {item.extractedText}
                  </div>
                </details>
              )}

              {activeStatus === 'pending' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '10px', marginTop: '18px', alignItems: 'center' }}>
                  <input
                    value={adminNotes[item.id] || ''}
                    onChange={(e) => setAdminNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    placeholder="Catatan admin/verifikator"
                    style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid #dee2e6' }}
                  />
                  <button disabled={isProcessing === item.id} onClick={() => handleStatus(item, 'approved')} style={{ ...actionButtonStyle, background: '#40c057' }}>
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button disabled={isProcessing === item.id} onClick={() => handleStatus(item, 'rejected')} style={{ ...actionButtonStyle, background: '#fa5252' }}>
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

const pillStyle = {
  padding: '5px 9px',
  borderRadius: '999px',
  background: '#f1f3f5',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px'
};

const linkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  textDecoration: 'none',
  color: 'var(--primary)',
  background: 'rgba(12,166,120,0.08)',
  padding: '8px 12px',
  borderRadius: '10px',
  fontWeight: '800',
  fontSize: '0.85rem'
};

const actionButtonStyle = {
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  padding: '12px 14px',
  fontWeight: '900',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px'
};

export default KnowledgeAdminPage;

