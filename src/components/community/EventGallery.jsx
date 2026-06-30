import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Camera, Video, Trash2, Loader, X } from 'lucide-react';

const EventGallery = ({ eventId }) => {
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const [mediaList, setMediaList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [activeMedia, setActiveMedia] = useState(null);

  useEffect(() => {
    if (!eventId) return;
    const q = query(collection(db, 'event_gallery'), where('eventId', '==', eventId));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMediaList(docs.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds));
    });
    return () => unsub();
  }, [eventId]);

  const handleFileSelect = (e, type) => {
    if (!isAuthenticated || !user) {
      alert("Harap login terlebih dahulu untuk mengunggah " + type);
      openLoginModal();
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    setSelectedFile({ file, type });
    setCaption('');
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;
    const { file, type } = selectedFile;

    setIsUploading(true);
    setUploadProgressText(`Mengunggah ${type}...`);
    try {
      const cloudName = "dsieguutz";
      const uploadPreset = "bamboochain_upload";
      
      if (!cloudName || !uploadPreset) {
        throw new Error("Konfigurasi Cloudinary belum diatur.");
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Gagal mengunggah ke Cloudinary');
      }

      const data = await response.json();
      const downloadUrl = data.secure_url;

      await addDoc(collection(db, 'event_gallery'), {
        eventId,
        userId: user.id,
        userName: user.username || user.name || 'User',
        url: downloadUrl,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        storagePath: `events/gallery/${eventId}/${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        caption: caption,
        timestamp: serverTimestamp()
      });
      setSelectedFile(null);
      setCaption('');
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error: " + err.message);
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
    }
  };

  const handleDelete = async (mediaId, storagePath) => {
    if (!window.confirm("Yakin ingin menghapus media ini?")) return;
    try {
      // Karena menggunakan Cloudinary unsigned upload, kita hanya perlu menghapus datanya dari UI/Firestore.
      // File aslinya di Cloudinary bisa dikelola via Dashboard admin Cloudinary.
      await deleteDoc(doc(db, 'event_gallery', mediaId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fab005', margin: 0 }}>Galeri Event</h3>
        {!selectedFile && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <label style={{ cursor: 'pointer', background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
              <Camera size={16} /> Foto
              <input 
                type="file" 
                accept="image/*" 
                style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }} 
                onChange={(e) => handleFileSelect(e, 'Foto')} 
                disabled={isUploading} 
              />
            </label>
            <label style={{ cursor: 'pointer', background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
              <Video size={16} /> Video
              <input 
                type="file" 
                accept="video/*" 
                style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }} 
                onChange={(e) => handleFileSelect(e, 'Video')} 
                disabled={isUploading} 
              />
            </label>
          </div>
        )}
      </div>

      {selectedFile && (
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #444' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#51cf66' }}>Pratinjau {selectedFile.type}</h4>
          
          {selectedFile.file.type.startsWith('video/') ? (
            <div style={{ color: '#adb5bd', fontSize: '0.85rem', marginBottom: '10px', padding: '10px', background: '#111', borderRadius: '8px' }}>
              🎥 {selectedFile.file.name}
            </div>
          ) : (
            <img src={URL.createObjectURL(selectedFile.file)} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#000' }} />
          )}

          <input 
            type="text" 
            placeholder="Tulis keterangan/caption (opsional)..." 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: 'white', marginBottom: '15px', fontSize: '0.9rem' }}
            disabled={isUploading}
          />

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => { setSelectedFile(null); setCaption(''); }}
              disabled={isUploading}
              style={{ padding: '8px 16px', borderRadius: '8px', background: 'transparent', color: '#adb5bd', border: '1px solid #444', cursor: isUploading ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}
            >
              Batal
            </button>
            <button 
              onClick={handleConfirmUpload}
              disabled={isUploading}
              style={{ padding: '8px 16px', borderRadius: '8px', background: '#51cf66', color: 'black', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', cursor: isUploading ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}
            >
              {isUploading ? <Loader size={14} className="spin" /> : null}
              {isUploading ? 'Mengunggah...' : 'Unggah Sekarang'}
            </button>
          </div>
        </div>
      )}

      {isUploading && (
        <div style={{ color: '#51cf66', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
          <Loader size={16} className="spin" /> {uploadProgressText}
        </div>
      )}

      {mediaList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#888', background: 'var(--bg-secondary)', borderRadius: '15px' }}>
          Belum ada foto atau video di galeri ini. Jadilah yang pertama mengunggah dokumentasi!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
          {mediaList.map(media => (
            <div 
              key={media.id} 
              style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#111', aspectRatio: '1/1', cursor: 'pointer' }}
              onClick={() => setActiveMedia(media)}
            >
              {media.type === 'video' ? (
                <video src={media.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src={media.url} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '25px 10px 10px', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)', color: 'white', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{media.userName}</span>
                  <button style={{ background: 'none', border: 'none', color: '#ffec99', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', padding: 0 }} onClick={(e) => { e.stopPropagation(); alert("Fitur Suka / Emoji pada foto akan segera hadir!"); }}>
                    🔥
                  </button>
                </div>
                {media.caption && (
                  <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#e9ecef', fontWeight: 'normal', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {media.caption}
                  </div>
                )}
              </div>

              {user && (user.id === media.userId || user.username === 'albantani' || user.role === 'admin') && (
                <button onClick={(e) => { e.stopPropagation(); handleDelete(media.id, media.storagePath); }} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.5)', color: '#fa5252', border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeMedia && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 999999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          <button 
            onClick={() => setActiveMedia(null)}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={24} />
          </button>
          
          <div style={{ width: '100%', maxWidth: '800px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {activeMedia.type === 'video' ? (
              <video src={activeMedia.url} controls style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '12px' }} />
            ) : (
              <img src={activeMedia.url} alt="Gallery Full" style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '12px' }} />
            )}
            
            <div style={{ width: '100%', marginTop: '20px', backgroundColor: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
              <div style={{ fontWeight: 'bold', color: '#fab005', marginBottom: '8px', fontSize: '1.1rem' }}>
                {activeMedia.userName}
              </div>
              <div style={{ color: '#e9ecef', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {activeMedia.caption || <i style={{ color: '#888' }}>Tidak ada keterangan</i>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventGallery;
