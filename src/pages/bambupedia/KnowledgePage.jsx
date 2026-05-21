import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UploadCloud, Library, FileText, Image, CheckCircle, Clock, Search, Link as LinkIcon } from 'lucide-react';
import BackButton from '../../components/BackButton';
import { useAuth } from '../../context/AuthContext';
import { createKnowledgeItem, KNOWLEDGE_TYPES, subscribeKnowledgeItems } from '../../utils/knowledgeService';

const initialForm = {
  title: '',
  type: 'Artikel',
  author: '',
  publisher: '',
  year: '',
  location: '',
  species: '',
  tags: '',
  sourceUrl: '',
  summary: '',
  extractedText: ''
};

const readTextFile = (file) =>
  new Promise((resolve) => {
    if (!file || !/(text|json|csv|markdown|xml|html)/i.test(file.type) && !/\.(txt|md|csv|json|html)$/i.test(file.name)) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result || '');
    reader.onerror = () => resolve('');
    reader.readAsText(file);
  });

const KnowledgePage = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [queryText, setQueryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeKnowledgeItems({
      status: 'approved',
      callback: setItems,
      onError: (error) => console.error('Knowledge library sync error:', error)
    });
    return unsubscribe;
  }, []);

  const filteredItems = useMemo(() => {
    const needle = queryText.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      [item.title, item.summary, item.tags, item.species, item.location, item.author]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle)
    );
  }, [items, queryText]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.size > 15 * 1024 * 1024) {
      alert('Ukuran file maksimal 15MB untuk MVP ini.');
      return;
    }
    setFile(selectedFile);
    const extracted = await readTextFile(selectedFile);
    if (extracted) {
      setForm((prev) => ({
        ...prev,
        extractedText: prev.extractedText || extracted.slice(0, 12000)
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.summary.trim()) {
      alert('Judul dan ringkasan wajib diisi agar admin bisa menilai sumber.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    try {
      await createKnowledgeItem({ form, file, user });
      setForm(initialForm);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMessage('Sumber berhasil dikirim. Statusnya pending sampai admin memverifikasi.');
    } catch (error) {
      console.error('Knowledge upload failed:', error);
      setMessage(`Gagal mengirim sumber: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <div className="container" style={{ padding: '40px 24px 100px' }}>
        <BackButton to="/bambupedia" />

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 0.9fr) minmax(320px, 1.1fr)', gap: '24px', alignItems: 'start', marginTop: '24px' }}>
          <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--primary)', fontWeight: '800' }}>
              <UploadCloud size={22} /> Upload Knowledge
            </div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--text-main)' }}>Tambah Sumber Bambu</h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              Artikel, jurnal, ebook, dataset, catatan lapangan, dan gambar akan masuk antrean admin sebelum dipakai BambooBot RAG.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Judul sumber" style={inputStyle} />
              <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
                {KNOWLEDGE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '10px' }}>
                <input name="author" value={form.author} onChange={handleChange} placeholder="Penulis / lembaga" style={inputStyle} />
                <input name="year" value={form.year} onChange={handleChange} placeholder="Tahun" style={inputStyle} />
              </div>
              <input name="publisher" value={form.publisher} onChange={handleChange} placeholder="Penerbit / jurnal / institusi" style={inputStyle} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input name="species" value={form.species} onChange={handleChange} placeholder="Spesies bambu" style={inputStyle} />
                <input name="location" value={form.location} onChange={handleChange} placeholder="Lokasi penelitian" style={inputStyle} />
              </div>
              <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tag: taksonomi, karbon, konstruksi..." style={inputStyle} />
              <input name="sourceUrl" value={form.sourceUrl} onChange={handleChange} placeholder="URL sumber asli, jika ada" style={inputStyle} />
              <textarea name="summary" value={form.summary} onChange={handleChange} placeholder="Ringkasan singkat dan alasan sumber ini penting" rows={4} style={textAreaStyle} />
              <textarea name="extractedText" value={form.extractedText} onChange={handleChange} placeholder="Teks utama / abstrak / data penting. File teks akan dibaca otomatis; PDF/DOCX bisa diisi ringkasannya dulu." rows={6} style={textAreaStyle} />
              <label style={{ border: '1px dashed var(--primary)', borderRadius: '14px', padding: '16px', cursor: 'pointer', color: 'var(--text-main)', background: 'rgba(12,166,120,0.04)' }}>
                <input ref={fileInputRef} type="file" onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt,.md,.csv,.json,.jpg,.jpeg,.png,.webp" />
                <strong>{file ? file.name : 'Pilih file pendukung'}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>PDF, DOCX, TXT, CSV, JSON, JPG, PNG, WEBP. Maksimal 15MB.</div>
              </label>
              <button disabled={isSubmitting} type="submit" style={{ ...primaryButtonStyle, opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Mengirim...' : 'Kirim ke Admin Verification'}
              </button>
              {message && <div style={{ fontSize: '0.9rem', color: message.startsWith('Gagal') ? '#e03131' : 'var(--primary)', fontWeight: '700' }}>{message}</div>}
            </form>
          </section>

          <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: '800' }}>
                  <Library size={22} /> Knowledge Library
                </div>
                <h2 style={{ margin: '6px 0 0', color: 'var(--text-main)' }}>Sumber Terverifikasi</h2>
              </div>
              <div style={{ position: 'relative', minWidth: '240px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input value={queryText} onChange={(e) => setQueryText(e.target.value)} placeholder="Cari sumber..." style={{ ...inputStyle, paddingLeft: '36px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gap: '14px' }}>
              {filteredItems.length === 0 ? (
                <div style={{ padding: '28px', borderRadius: '16px', background: 'var(--bg-secondary)', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Belum ada sumber terverifikasi yang cocok.
                </div>
              ) : filteredItems.map((item) => (
                <article key={item.id} style={{ padding: '18px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '800', marginBottom: '6px' }}>
                        {item.type === 'Gambar' ? <Image size={15} /> : <FileText size={15} />}
                        {item.type} <CheckCircle size={14} /> Verified
                      </div>
                      <h3 style={{ margin: '0 0 8px', color: 'var(--text-main)', fontSize: '1.05rem' }}>{item.title}</h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.9rem' }}>{item.summary}</p>
                    </div>
                    <Clock size={18} color="var(--text-muted)" />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.species && <span style={pillStyle}>{item.species}</span>}
                    {item.location && <span style={pillStyle}>{item.location}</span>}
                    {item.author && <span style={pillStyle}>{item.author}</span>}
                    {item.fileUrl && <a href={item.fileUrl} target="_blank" rel="noreferrer" style={{ ...pillStyle, color: 'var(--primary)', textDecoration: 'none' }}><LinkIcon size={12} /> File</a>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-color)',
  color: 'var(--text-main)',
  outline: 'none'
};

const textAreaStyle = {
  ...inputStyle,
  resize: 'vertical',
  lineHeight: 1.5
};

const primaryButtonStyle = {
  padding: '14px 18px',
  borderRadius: '14px',
  border: 'none',
  background: 'var(--primary)',
  color: 'white',
  fontWeight: '800',
  cursor: 'pointer'
};

const pillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '5px 9px',
  borderRadius: '999px',
  background: 'rgba(12,166,120,0.08)'
};

export default KnowledgePage;

