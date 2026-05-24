import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UploadCloud, Library, FileText, Image, CheckCircle, Clock, Search, Link as LinkIcon } from 'lucide-react';
import BackButton from '../../components/BackButton';
import { useAuth } from '../../context/AuthContext';
import { createKnowledgeItem, updateKnowledgeItem, KNOWLEDGE_TYPES, subscribeApprovedKnowledgeItems, subscribeUserKnowledgeSubmissions } from '../../utils/knowledgeService';

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
  extractedText: '',
  fileUrl: '',
  filePath: '',
  fileName: '',
  fileType: '',
  fileSize: 0
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
  const formRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [queryText, setQueryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeApprovedKnowledgeItems({
      callback: setItems,
      onError: (error) => console.error('Knowledge library sync error:', error)
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const unsubscribe = subscribeUserKnowledgeSubmissions({
      userId: user.id,
      callback: setMySubmissions,
      onError: (error) => console.error('My submissions sync error:', error)
    });
    return unsubscribe;
  }, [user]);

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

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      type: item.type || 'Artikel',
      author: item.author || '',
      publisher: item.publisher || '',
      year: item.year || '',
      location: item.location || '',
      species: item.species || '',
      tags: item.tags || '',
      sourceUrl: item.sourceUrl || '',
      summary: item.summary || '',
      extractedText: item.extractedText || '',
      fileUrl: item.fileUrl || '',
      filePath: item.filePath || '',
      fileName: item.fileName || '',
      fileType: item.fileType || '',
      fileSize: item.fileSize || 0
    });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(initialForm);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span style={{ color: '#2b8a3e', background: '#ebfbee', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Disetujui</span>;
      case 'rejected':
        return <span style={{ color: '#c92a2a', background: '#fff5f5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Ditolak</span>;
      default:
        return <span style={{ color: '#e67700', background: '#fff9db', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Pending</span>;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.summary.trim()) {
      alert('Judul dan ringkasan wajib diisi agar admin/validator bisa menilai sumber.');
      return;
    }

    // Validasi user harus login
    if (!user?.id || user.id === 'guest') {
      setMessage('⚠️ Anda harus login terlebih dahulu untuk mengunggah sumber.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    setMessage('');

    const uploadTimeout = setTimeout(() => {
      setMessage('⏱️ Upload memakan waktu terlalu lama.\n\n🔧 Solusi: Firebase Storage memerlukan konfigurasi CORS untuk domain sultanbantam.github.io. Jalankan perintah berikut di terminal:\n\nnpx firebase-tools storage:cors set cors.json --project bamboochain-official\n\nAtau kirim tanpa file dengan menghapus pilihan file terlebih dahulu.');
      setIsSubmitting(false);
      setUploadProgress(0);
    }, 45000); 

    try {
      if (editingId) {
        await updateKnowledgeItem({ itemId: editingId, form, file, user, onProgress: setUploadProgress });
        clearTimeout(uploadTimeout);
        setMessage('✅ Sumber berhasil diperbarui dan dikirim kembali ke antrean verifikasi.');
      } else {
        await createKnowledgeItem({ form, file, user, onProgress: setUploadProgress });
        clearTimeout(uploadTimeout);
        setMessage('✅ Sumber berhasil dikirim. Statusnya pending sampai validator memverifikasi.');
      }
      handleCancel();
    } catch (error) {
      clearTimeout(uploadTimeout);
      console.error('Knowledge upload failed:', error);

      const isStorageCorsError = error.code === 'storage/retry-limit-exceeded' 
        || error.code === 'storage/unknown'
        || error.code === 'storage/canceled'
        || error.message?.includes('retry-limit-exceeded')
        || error.message?.includes('CORS')
        || error.message?.includes('Max retry');

      if (isStorageCorsError) {
        const saveWithoutFile = window.confirm(
          '⚠️ Upload file gagal karena Firebase Storage CORS belum dikonfigurasi untuk domain ini.\n\n' +
          'Apakah Anda ingin menyimpan sumber ini TANPA file lampiran?\n' +
          '(Metadata, ringkasan, dan teks tetap tersimpan — file bisa ditambahkan setelah CORS dikonfigurasi)'
        );

        if (saveWithoutFile) {
          try {
            if (editingId) {
              await updateKnowledgeItem({ itemId: editingId, form, file: null, user, onProgress: null });
              setMessage('✅ Sumber berhasil diperbarui tanpa lampiran file. Tambahkan file setelah CORS Storage dikonfigurasi.');
            } else {
              await createKnowledgeItem({ form, file: null, user, onProgress: null });
              setMessage('✅ Sumber berhasil dikirim tanpa lampiran file. Status: pending verifikasi. File bisa ditambahkan nanti.');
            }
            handleCancel();
          } catch (firestoreError) {
            setMessage(`❌ Gagal menyimpan ke database: ${firestoreError.message}\n\nCek koneksi internet dan Firebase Firestore rules.`);
          }
        } else {
          setMessage('🔧 Untuk memperbaiki upload file, jalankan di terminal:\n\nnpx firebase-tools@latest storage:cors set cors.json --project bamboochain-official\n\nLalu deploy ulang. File cors.json sudah dibuat di root project.');
        }
        return;
      }

      let errMsg = `❌ Gagal mengirim sumber: ${error.message}`;
      if (error.code === 'storage/unauthorized' || error.message?.includes('unauthorized')) {
        errMsg = '🔒 Akses ditolak Firebase Storage. Pastikan Anda sudah login dengan akun yang benar.';
      } else if (error.message?.includes('permission-denied') || error.code === 'permission-denied') {
        errMsg = '🔒 Izin Firestore ditolak. Hubungi admin untuk memeriksa security rules database.';
      }
      setMessage(errMsg);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <div className="container" style={{ padding: '40px 24px 100px' }}>
        <BackButton to="/bambupedia" />

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 0.9fr) minmax(320px, 1.1fr)', gap: '24px', alignItems: 'start', marginTop: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section ref={formRef} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--primary)', fontWeight: '800' }}>
                <UploadCloud size={22} /> Upload Knowledge
              </div>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--text-main)' }}>
                {editingId ? 'Edit Sumber Bambu' : 'Tambah Sumber Bambu'}
              </h1>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                Artikel, jurnal, ebook, dataset, catatan lapangan, dan gambar akan masuk antrean validator sebelum dipakai BambooBot RAG.
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
                  <strong>{file ? file.name : (form.fileName ? `Berkas terunggah: ${form.fileName}` : 'Pilih file pendukung')}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>PDF, DOCX, TXT, CSV, JSON, JPG, PNG, WEBP. Maksimal 15MB.</div>
                </label>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button disabled={isSubmitting} type="submit" style={{ ...primaryButtonStyle, flex: 1, opacity: isSubmitting ? 0.7 : 1 }}>
                    {isSubmitting ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                        {uploadProgress > 0 ? `Mengunggah file (${uploadProgress}%)...` : 'Memproses...'}
                      </span>
                    ) : (editingId ? 'Simpan Perubahan' : 'Kirim ke Validator')}
                  </button>
                  {editingId && (
                    <button 
                      type="button" 
                      onClick={handleCancel} 
                      style={{ 
                        padding: '14px 18px', 
                        borderRadius: '14px', 
                        border: '1px solid var(--border-color)', 
                        background: 'var(--bg-secondary)', 
                        color: 'var(--text-main)', 
                        fontWeight: '800', 
                        cursor: 'pointer' 
                      }}
                    >
                      Batal
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                {isSubmitting && uploadProgress > 0 && (
                  <div style={{ marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Mengupload ke Firebase Storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                )}

                {/* Status Message */}
                {message && (
                  <div style={{ 
                    fontSize: '0.9rem', 
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line',
                    color: message.startsWith('❌') || message.startsWith('🔒') || message.startsWith('🚫') || message.startsWith('⚠️') ? '#c92a2a' 
                         : message.startsWith('⏱️') || message.startsWith('📡') ? '#e67700' 
                         : 'var(--primary)',
                    background: message.startsWith('❌') || message.startsWith('🔒') || message.startsWith('🚫') || message.startsWith('⚠️') ? '#fff5f5' 
                               : message.startsWith('⏱️') || message.startsWith('📡') ? '#fff9db'
                               : '#ebfbee',
                    border: `1px solid ${message.startsWith('❌') || message.startsWith('🔒') || message.startsWith('🚫') || message.startsWith('⚠️') ? '#ffc9c9' : message.startsWith('⏱️') || message.startsWith('📡') ? '#ffd43b' : '#b2f2bb'}`
                  }}>
                    {message}
                  </div>
                )}

                {/* Brave Private Mode Warning */}
                {isSubmitting && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-secondary)', lineHeight: '1.5' }}>
                    💡 Jika upload sangat lambat: Brave Private Window dapat memblokir Firebase Storage. Coba gunakan tab <strong>biasa (non-private)</strong>.
                  </div>
                )}
              </form>
            </section>

            {user && (
              <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--primary)', fontWeight: '800' }}>
                  <Clock size={22} /> Riwayat Kontribusi Anda
                </div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--text-main)' }}>Kontribusi Pengetahuan</h2>
                
                <div style={{ display: 'grid', gap: '12px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                  {mySubmissions.length === 0 ? (
                    <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--bg-secondary)', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>
                      Anda belum pernah mengirimkan sumber pengetahuan.
                    </div>
                  ) : mySubmissions.map((item) => (
                    <div key={item.id} style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{item.type}</span>
                          <span>•</span>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                      {item.status === 'pending' && (
                        <button 
                          onClick={() => handleEditClick(item)}
                          style={{ 
                            padding: '6px 12px', 
                            borderRadius: '8px', 
                            border: '1px solid var(--border-color)', 
                            background: 'var(--bg-card)', 
                            color: 'var(--text-main)', 
                            fontSize: '0.8rem', 
                            fontWeight: '700', 
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

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
