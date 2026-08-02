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
      <div className="container" style={{ padding: '40px 24px 100px' }}>
        <BackButton to="/admin-portal" />

        <header style={{ marginTop: '24px', background: 'linear-gradient(135deg, #0ca678, #087f5b)', borderRadius: '24px', padding: '34px', color: 'white', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <ShieldCheck size={32} />
            <h1 style={{ margin: 0, fontSize: '2rem' }}>Admin Verification Knowledge</h1>
          </div>
          <p style={{ margin: 0, opacity: 0.9 }}>Setujui sumber bambu sebelum masuk ke Knowledge Library dan dipakai BambuBot RAG.</p>
        </header>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '6px', display: 'inline-flex', gap: '4px', overflowX: 'auto', maxWidth: '100%' }}>
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

          <div style={{ position: 'relative', minWidth: '280px' }}>
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
            <article key={item.id} style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #e9ecef', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '18px', alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '800', fontSize: '0.82rem', marginBottom: '8px' }}>
                    {item.type === 'Gambar' ? <Image size={16} /> : <FileText size={16} />}
                    {item.type} oleh @{item.createdByUsername || 'guest'}
                  </div>
                  <h2 style={{ margin: '0 0 8px', fontSize: '1.25rem', color: '#212529' }}>{item.title}</h2>
                  <p style={{ margin: '0 0 14px', color: '#495057', lineHeight: 1.6 }}>{item.summary}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.78rem', color: '#495057' }}>
                    {item.species && <span style={pillStyle}>{item.species}</span>}
                    {item.location && <span style={pillStyle}>{item.location}</span>}
                    {item.author && <span style={pillStyle}>{item.author}</span>}
                    {item.year && <span style={pillStyle}>{item.year}</span>}
                    {item.tags && <span style={pillStyle}>{item.tags}</span>}
                  </div>
                </div>

                <span style={{
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

