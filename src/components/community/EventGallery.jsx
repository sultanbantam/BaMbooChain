import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Camera, Video, Trash2, Loader } from 'lucide-react';

const EventGallery = ({ eventId }) => {
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const [mediaList, setMediaList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');

  useEffect(() => {
    if (!eventId) return;
    const q = query(collection(db, 'event_gallery'), where('eventId', '==', eventId));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMediaList(docs.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds));
    });
    return () => unsub();
  }, [eventId]);

  const handleUpload = async (e, type) => {
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
        userId: user.uid,
        userName: user.username || user.name || 'User',
        url: downloadUrl,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        storagePath: `events/gallery/${eventId}/${uniqueName}`,
        timestamp: serverTimestamp()
      });
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <label style={{ cursor: 'pointer', background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
            <Camera size={16} /> Foto
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleUpload(e, 'Foto')} disabled={isUploading} />
          </label>
          <label style={{ cursor: 'pointer', background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
            <Video size={16} /> Video
            <input type="file" accept="video/*" style={{ display: 'none' }} onChange={(e) => handleUpload(e, 'Video')} disabled={isUploading} />
          </label>
        </div>
      </div>

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
            <div key={media.id} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#111', aspectRatio: '1/1' }}>
              {media.type === 'video' ? (
                <video src={media.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src={media.url} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 10px 5px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{media.userName}</span>
                <button style={{ background: 'none', border: 'none', color: '#ffec99', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }} onClick={() => alert("Fitur Suka / Emoji pada foto akan segera hadir!")}>
                  🔥
                </button>
              </div>

              {user && (user.uid === media.userId || user.username === 'albantani' || user.role === 'admin') && (
                <button onClick={() => handleDelete(media.id, media.storagePath)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.5)', color: '#fa5252', border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventGallery;
