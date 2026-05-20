import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBambupedia } from '../context/BambupediaContext';
import { db } from '../firebase/config';
import { doc, onSnapshot, updateDoc, collection, query, where } from 'firebase/firestore';
import { 
  User, Camera, Save, Copy, Share2, Award, Shield, CheckCircle, 
  TreeDeciduous, GraduationCap, Heart, MessageSquare, Gift, Edit3, X, Eye,
  UploadCloud, FileText, Trash2, Send, ChevronRight
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const compressAvatar = (base64Str) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const max_size = 200; // Avatar doesn't need to be huge
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > max_size) {
          height = Math.round((height * max_size) / width);
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width = Math.round((width * max_size) / height);
          height = max_size;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => resolve(base64Str);
  });
};

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const parseCoords = (locStr) => {
  if (!locStr) return null;
  const match = locStr.match(/\((-?\d+\.\d+),\s*(-?\d+\.\d+)\)/);
  if (match) {
    return [parseFloat(match[1]), parseFloat(match[2])];
  }
  return null;
};

const ProfilePage = () => {
  const { user, updateProfile, articles } = useAuth();
  const { plantings, maintenances, harvests } = useBambupedia();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    avatarUrl: '',
    bioText: '',
    statusText: '',
    statusPhotos: [],
    statusVideo: ''
  });
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPassport, setCopiedPassport] = useState(false);
  
  // Real-time status interactions state
  const [interactions, setInteractions] = useState({
    likes: [],
    shares: 0,
    comments: [],
    gifts: []
  });
  
  // Tab for showing comments or gifts lists
  const [activeListTab, setActiveListTab] = useState(null); // 'comments' | 'gifts' | 'messages' | null
  const [myMatsCount, setMyMatsCount] = useState(0);
  const [directMessages, setDirectMessages] = useState([]);

  // Sync direct messages from Firestore
  useEffect(() => {
    if (user && user.id) {
      const q = query(collection(db, "direct_messages"), where("receiverId", "==", user.id));
      const unsub = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort by timestamp desc locally
        msgs.sort((a, b) => b.timestamp - a.timestamp);
        setDirectMessages(msgs);
      }, (err) => console.error("Error syncing direct messages:", err));
      return () => unsub();
    }
  }, [user]);

  // Sync my premium materials count
  useEffect(() => {
    if (user && user.id) {
      const q = query(collection(db, "premium_materials"), where("userId", "==", user.id));
      const unsub = onSnapshot(q, (snap) => {
        setMyMatsCount(snap.size);
      }, (err) => console.error("Error syncing my materials:", err));
      return () => unsub();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user.username || 'default'),
        bioText: user.bioText || '',
        statusText: user.statusText || '',
        statusPhotos: user.statusPhotos || [],
        statusVideo: user.statusVideo || ''
      });
    }
  }, [user]);

  // Sync interactions from Firestore
  useEffect(() => {
    if (user && user.id) {
      const docRef = doc(db, "status_interactions", user.id);
      const unsub = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setInteractions(docSnap.data());
        } else {
          setInteractions({
            likes: [],
            shares: 0,
            comments: [],
            gifts: []
          });
        }
      }, (err) => console.error("Interactions sync error:", err));
      return () => unsub();
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ paddingTop: '150px', minHeight: '60vh', textAlign: 'center' }}>
        <h2>Harap Login Terlebih Dahulu</h2>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateProfile({
      name: formData.name,
      username: formData.username.toLowerCase().replace(/\s+/g, ''),
      phone: formData.phone
    });
    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  const compressStatusPhoto = (base64Str) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const max = 600;
        let w = img.width, h = img.height;
        if (w > h) { if (w > max) { h = Math.round(h * max / w); w = max; } }
        else { if (h > max) { w = Math.round(w * max / h); h = max; } }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.65));
      };
      img.onerror = () => resolve(base64Str);
    });
  };

  const handleStatusPhotosChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setIsUploadingMedia(true);
    const compressed = [];
    for (const file of files) {
      if (file.size > 3 * 1024 * 1024) { alert(`⚠️ Foto "${file.name}" melebihi 3MB, dilewati.`); continue; }
      const b64 = await new Promise(res => { const r = new FileReader(); r.onload = ev => res(ev.target.result); r.readAsDataURL(file); });
      compressed.push(await compressStatusPhoto(b64));
    }
    setFormData(prev => ({ ...prev, statusPhotos: [...(prev.statusPhotos || []), ...compressed] }));
    setIsUploadingMedia(false);
    e.target.value = '';
  };

  const handleStatusVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('⚠️ Video maksimal 5MB!'); return; }
    const r = new FileReader();
    r.onload = ev => setFormData(prev => ({ ...prev, statusVideo: ev.target.result }));
    r.readAsDataURL(file);
    e.target.value = '';
  };

  const removeStatusPhoto = (idx) => {
    setFormData(prev => ({ ...prev, statusPhotos: prev.statusPhotos.filter((_, i) => i !== idx) }));
  };

  const removeStatusVideo = () => {
    setFormData(prev => ({ ...prev, statusVideo: '' }));
  };

  const handleSaveStatus = async () => {
    setIsUploadingMedia(true);
    await updateProfile({
      bioText: formData.bioText,
      statusText: formData.statusText,
      statusPhotos: formData.statusPhotos || [],
      statusVideo: formData.statusVideo || ''
    });
    setIsUploadingMedia(false);
    setIsEditingStatus(false);
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("⚠️ Ukuran foto profil maksimal adalah 2MB!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      compressAvatar(uploadEvent.target.result).then(async (compressedBase64) => {
        setFormData(prev => ({ ...prev, avatarUrl: compressedBase64 }));
        const success = await updateProfile({ avatarUrl: compressedBase64 });
        if (success) {
          alert("✅ Foto profil berhasil diperbarui!");
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = () => {
    const choice = window.confirm("Pilih Sumber Foto Profil:\n\nKlik 'OK' untuk mengunggah foto Anda sendiri dari perangkat.\nKlik 'Batal' untuk menggunakan generator karakter (Dicebear seed).");
    if (choice) {
      document.getElementById('avatar-upload-file').click();
    } else {
      const newSeed = prompt('Masukkan kata unik untuk mengubah avatar Anda:');
      if (newSeed) {
        const newUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`;
        setFormData({ ...formData, avatarUrl: newUrl });
        updateProfile({ avatarUrl: newUrl });
      }
    }
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("⚠️ Ukuran file maksimal adalah 2MB!");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      const base64 = uploadEvent.target.result;
      const cvFile = {
        name: file.name,
        type: file.type,
        data: base64
      };
      const success = await updateProfile({ cvFile });
      if (success) {
        alert("✅ CV/Portofolio berhasil diunggah!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCvDelete = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus CV/Portofolio Anda?")) {
      const success = await updateProfile({ cvFile: null });
      if (success) {
        alert("✅ CV/Portofolio berhasil dihapus!");
      }
    }
  };

  // Referral Calculations
  const referralCode = user.username ? `REF-${user.username.toUpperCase()}` : `REF-${user.id}`;
  const referralLink = `https://bamboochain.id/join?ref=${referralCode}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Passport Link Calculation
  const passportLink = `${window.location.origin}/#/portfolio/${user.username || user.id}`;
  const copyPassportLink = () => {
    navigator.clipboard.writeText(passportLink);
    setCopiedPassport(true);
    setTimeout(() => setCopiedPassport(false), 2000);
  };

  // Ecosystem Counters
  const myArticlesCount = (articles || []).filter(a => a.userId === user.id).length;
  const myPlantingsCount = (plantings || []).length;
  const myMaintenancesCount = (maintenances || []).length;

  const coordsList = (plantings || []).map(p => parseCoords(p.location)).filter(Boolean);
  const mapCenter = coordsList.length > 0 ? coordsList[0] : [-6.5888, 106.3144];

  // Level Badge Calculation
  const totalEcoActions = myPlantingsCount + myMaintenancesCount + myArticlesCount + myMatsCount;
  let ecoLevel = "Eco-Beginner";
  let badgeColor = "#6c757d";
  if (totalEcoActions >= 15) {
    ecoLevel = "Forest Guardian";
    badgeColor = "#157347";
  } else if (totalEcoActions >= 5) {
    ecoLevel = "Bamboo Pioneer";
    badgeColor = "#0d6efd";
  }

  return (
    <div style={{ paddingTop: '190px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--bg-color)', transition: 'background 0.3s ease' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '30px' }}>
          Profil <span style={{ color: 'var(--primary)' }}>Pengguna</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'start' }}>
          
          {/* ────────── LEFT COLUMN: ACCOUNT DETAILS & REFERRAL ────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Account Card */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', transition: 'background 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-color)', overflow: 'hidden', border: '3px solid var(--primary)' }}>
                    <img src={formData.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <button 
                    onClick={handleAvatarChange}
                    style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--text-main)', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    title="Ubah Avatar"
                  >
                    <Camera size={16} />
                  </button>
                  <input 
                    type="file" 
                    id="avatar-upload-file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleAvatarFileChange} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input 
                        type="text" name="name" value={formData.name} onChange={handleChange} 
                        style={{ fontSize: '1.2rem', fontWeight: 'bold', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                        placeholder="Nama Lengkap"
                      />
                      <input 
                        type="text" name="username" value={formData.username} onChange={handleChange} 
                        style={{ fontSize: '0.9rem', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                        placeholder="Username"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 style={{ fontSize: '1.6rem', margin: '0 0 4px 0', color: 'var(--text-main)' }}>{user.name || 'Member'}</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 10px 0' }}>@{user.username || 'user'}</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          <Shield size={12} /> {user.kycStatus === 'verified' ? 'Verified' : 'Unverified'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 159, 0, 0.1)', color: '#f59f00', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          <Award size={12} /> {ecoLevel}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <button onClick={handleSave} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <Save size={16} /> Simpan
                    </button>
                  ) : (
                    <button onClick={() => setIsEditing(true)} style={{ background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: 'var(--text-main)' }}>Informasi Kontak</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                    <div style={{ padding: '10px 14px', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      {user.email || 'Tidak ada email'}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: 'bold' }}>Nomor HP</label>
                    {isEditing ? (
                      <input 
                        type="text" name="phone" value={formData.phone} onChange={handleChange} 
                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', width: '100%', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                        placeholder="Contoh: 08123456789"
                      />
                    ) : (
                      <div style={{ padding: '10px 14px', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        {user.phone || 'Belum diisi'}
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: 'bold' }}>Wallet Address</label>
                    <div style={{ padding: '10px 14px', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.walletAddress}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CV / Portofolio Dokumen Card */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', transition: 'background 0.3s' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '15px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="var(--primary)" /> CV / Portofolio Lengkap
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.85rem', lineHeight: '1.5' }}>
                Unggah dokumen CV atau portofolio lengkap Anda (Maksimal 2MB, format PDF, Word, atau Gambar). Dokumen ini hanya dapat dilihat/diunduh oleh pengguna yang sudah terverifikasi KYC.
              </p>

              {user.cvFile ? (
                <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <FileText size={28} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <div style={{ overflow: 'hidden' }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {user.cvFile.name}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {user.cvFile.type?.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = user.cvFile.data;
                        link.download = user.cvFile.name;
                        link.click();
                      }}
                      style={{ background: 'rgba(12,166,120,0.08)', color: 'var(--primary)', border: 'none', padding: '8px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Unduh
                    </button>
                    <button 
                      onClick={handleCvDelete}
                      style={{ background: 'rgba(250,82,82,0.08)', color: '#fa5252', border: 'none', padding: '8px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Hapus CV"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <button 
                    onClick={() => document.getElementById('cv-file-input').click()}
                    style={{ width: '100%', background: 'rgba(12,166,120,0.05)', color: 'var(--primary)', border: '1px dashed var(--primary)', borderRadius: '16px', padding: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(12,166,120,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(12,166,120,0.05)'; }}
                  >
                    <UploadCloud size={28} />
                    <span style={{ fontSize: '0.85rem' }}>Pilih & Unggah CV Dokumen</span>
                  </button>
                  <input 
                    id="cv-file-input"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleCvUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>

            {/* Referral Card */}
            <div style={{ background: 'linear-gradient(135deg, var(--text-main), #2c2e33)', borderRadius: '24px', padding: '30px', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }}>
                <Share2 size={150} />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Share2 size={20} color="var(--primary)" /> Program Referral
                </h3>
                <p style={{ color: '#adb5bd', marginBottom: '20px', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Dapatkan <strong style={{ color: 'var(--primary)' }}>0.5 BMC</strong> untuk setiap pendaftar baru yang menyelesaikan KYC via referral Anda!
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '180px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px 15px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#f8f9fa', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{referralLink}</span>
                  </div>
                  <button 
                    onClick={copyReferral}
                    style={{ background: copied ? 'var(--primary)' : 'white', color: copied ? 'white' : 'var(--text-main)', border: 'none', padding: '0 18px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem', minHeight: '44px' }}
                  >
                    {copied ? <><CheckCircle size={14} /> Tersalin!</> : <><Copy size={14} /> Salin</>}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ────────── RIGHT COLUMN: BAMBOOID PASSPORT (ECO-PORTFOLIO) ────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Passport Container */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', transition: 'background 0.3s' }}>
              
              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg, #134e4a, #064e3b)', padding: '24px', borderRadius: '20px', color: 'white', marginBottom: '25px', boxShadow: '0 8px 25px rgba(4, 120, 87, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🌿 BambooID Passport
                    </h3>
                    <p style={{ margin: '6px 0 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>
                      Identitas & Reputasi Ekosistem Hijau
                    </p>
                  </div>
                  <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    Web3 Identity
                  </span>
                </div>
              </div>

              {/* Status Update & Bio Panel */}
              <div style={{ background: 'var(--bg-color)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-color)', marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Edit3 size={14} color="var(--primary)" /> Deskripsi & Status Terkini
                  </span>
                  <button 
                    onClick={() => setIsEditingStatus(!isEditingStatus)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {isEditingStatus ? <><X size={14} /> Batal</> : <><Edit3 size={14} /> Update</>}
                  </button>
                </div>

                {isEditingStatus ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: 'bold' }}>Bio Singkat (Misi/Portofolio)</label>
                      <textarea 
                        name="bioText" 
                        value={formData.bioText} 
                        onChange={handleChange}
                        placeholder="Tulis bio singkat Anda, misal: Peneliti taksonomi bambu, pegiat hutan lestari..."
                        rows={2}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.85rem', resize: 'vertical' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: 'bold' }}>Status Hari Ini ("Apa yang Anda pikirkan tentang ekosistem hijau?")</label>
                      <textarea 
                        name="statusText" 
                        value={formData.statusText} 
                        onChange={handleChange}
                        placeholder="Bagikan pemikiran, aktivitas menanam, atau ide hijau Anda hari ini..."
                        rows={2}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.85rem', resize: 'vertical' }}
                      />
                    </div>

                    {/* ── MEDIA UPLOAD SECTION ── */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => document.getElementById('status-photos-input').click()}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(12,166,120,0.08)', color: 'var(--primary)', border: '1px dashed var(--primary)', borderRadius: '8px', padding: '7px 14px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        <UploadCloud size={14} /> Tambah Foto
                      </button>
                      <input id="status-photos-input" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleStatusPhotosChange} />
                      <button
                        type="button"
                        onClick={() => document.getElementById('status-video-input').click()}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(34,139,230,0.08)', color: '#228be6', border: '1px dashed #228be6', borderRadius: '8px', padding: '7px 14px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        <PlayCircle size={14} /> Video Pendek
                      </button>
                      <input id="status-video-input" type="file" accept="video/*" style={{ display: 'none' }} onChange={handleStatusVideoChange} />
                    </div>

                    {isUploadingMedia && (
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--primary)' }}>⏳ Memproses media...</p>
                    )}

                    {formData.statusPhotos && formData.statusPhotos.length > 0 && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 'bold' }}>PRATONTON FOTO ({formData.statusPhotos.length})</label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {formData.statusPhotos.map((photo, idx) => (
                            <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', flexShrink: 0 }}>
                              <img src={photo} alt={`foto ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button type="button" onClick={() => removeStatusPhoto(idx)} style={{ position: 'absolute', top: '2px', right: '2px', width: '20px', height: '20px', background: 'rgba(220,53,69,0.9)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                                <X size={11} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.statusVideo && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 'bold' }}>PRATONTON VIDEO</label>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <video src={formData.statusVideo} controls muted style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'block' }} />
                          <button type="button" onClick={removeStatusVideo} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(220,53,69,0.9)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={handleSaveStatus}
                      disabled={isUploadingMedia}
                      style={{ background: isUploadingMedia ? '#aaa' : 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', cursor: isUploadingMedia ? 'not-allowed' : 'pointer', alignSelf: 'flex-end' }}
                    >
                      {isUploadingMedia ? 'Memproses...' : 'Simpan Status'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: '15px' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Bio Kontributor</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: formData.bioText ? 'normal' : 'italic' }}>
                        {formData.bioText || "Belum ada bio diri yang ditambahkan."}
                      </p>
                    </div>
                    
                    <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Status Terbaru</p>
                      <p style={{ margin: '6px 0 12px 0', fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '500', lineHeight: '1.4' }}>
                        "{formData.statusText || "Mari bersama menjaga kelestarian bambu Nusantara! 🌿"}"
                      </p>

                      {/* Render Status Media */}
                      {formData.statusPhotos && formData.statusPhotos.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(formData.statusPhotos.length, 3)}, 1fr)`, gap: '8px', marginBottom: '12px' }}>
                          {formData.statusPhotos.map((photo, idx) => (
                            <div key={idx} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', aspectRatio: '1/1' }}>
                              <img src={photo} alt={`status ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ))}
                        </div>
                      )}
                      {formData.statusVideo && (
                        <div style={{ marginBottom: '12px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                          <video src={formData.statusVideo} controls muted style={{ width: '100%', display: 'block', maxHeight: '300px', objectFit: 'contain', background: '#000' }} />
                        </div>
                      )}

                      {/* Status Interactions Panel */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Heart size={15} color={interactions.likes.length > 0 ? '#e03131' : 'var(--text-muted)'} fill={interactions.likes.length > 0 ? '#e03131' : 'none'} />
                          <span><strong>{interactions.likes.length}</strong> Suka</span>
                        </div>
                        <div 
                          onClick={() => setActiveListTab(activeListTab === 'comments' ? null : 'comments')}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                        >
                          <MessageSquare size={15} color="var(--primary)" />
                          <span style={{ textDecoration: 'underline' }}><strong>{interactions.comments.length}</strong> Komentar</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Share2 size={15} color="#228be6" />
                          <span><strong>{interactions.shares}</strong> Bagikan</span>
                        </div>
                        <div 
                          onClick={() => setActiveListTab(activeListTab === 'gifts' ? null : 'gifts')}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                        >
                          <Gift size={15} color="#f59f00" />
                          <span style={{ textDecoration: 'underline' }}><strong>{interactions.gifts.length}</strong> Gift</span>
                        </div>
                        <div 
                          onClick={() => setActiveListTab(activeListTab === 'messages' ? null : 'messages')}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                        >
                          <Send size={15} color="var(--primary)" />
                          <span style={{ textDecoration: 'underline' }}><strong>{directMessages.length}</strong> Inbox</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsible Details Lists (Comments / Gifts) */}
              {activeListTab === 'comments' && (
                <div style={{ background: 'var(--bg-color)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-color)', marginBottom: '25px', maxHeight: '250px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>💬 Komentar Status ({interactions.comments.length})</span>
                    <button onClick={() => setActiveListTab(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16} /></button>
                  </div>
                  {interactions.comments.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', margin: '20px 0' }}>Belum ada komentar.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {interactions.comments.map((comment, index) => (
                        <div key={index} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '6px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--primary)' }}>@{comment.username}</span>
                          <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--text-main)' }}>{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeListTab === 'gifts' && (
                <div style={{ background: 'var(--bg-color)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-color)', marginBottom: '25px', maxHeight: '250px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>🎁 Daftar Gift Diterima ({interactions.gifts.length})</span>
                    <button onClick={() => setActiveListTab(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16} /></button>
                  </div>
                  {interactions.gifts.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', margin: '20px 0' }}>Belum menerima gift.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {interactions.gifts.map((gift, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '6px' }}>
                          <div>
                            <span style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-main)' }}>@{gift.senderUsername}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                              {new Date(gift.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          <span style={{ color: '#f59f00', fontWeight: 'bold', fontSize: '0.85rem' }}>+{gift.amount} BMC</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeListTab === 'messages' && (
                <div style={{ background: 'var(--bg-color)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-color)', marginBottom: '25px', maxHeight: '350px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>✉️ Pesan Masuk Privat ({directMessages.length})</span>
                    <button onClick={() => setActiveListTab(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16} /></button>
                  </div>
                  {directMessages.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', margin: '20px 0' }}>Tidak ada pesan masuk.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {directMessages.map((msg, index) => (
                        <div key={msg.id || index} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <a 
                              href={`#/portfolio/${msg.senderUsername}`} 
                              style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}
                            >
                              @{msg.senderUsername}
                            </a>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {new Date(msg.timestamp).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', background: 'var(--bg-card)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            {msg.messageText}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <a 
                              href={`#/portfolio/${msg.senderUsername}`} 
                              style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}
                            >
                              Balas <ChevronRight size={12} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Eco Metrics Grid */}
              <div style={{ marginBottom: '25px' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Aktivitas Kontribusi Hutan Bambu</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
                  
                  <div style={{ background: 'rgba(12, 166, 120, 0.05)', border: '1px solid rgba(12, 166, 120, 0.1)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(12, 166, 120, 0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <TreeDeciduous size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{myPlantingsCount}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bambu Ditanam</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(34, 139, 230, 0.05)', border: '1px solid rgba(34, 139, 230, 0.1)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(34, 139, 230, 0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#228be6' }}>
                      <Shield size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{myMaintenancesCount}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Perawatan Lahan</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(245, 159, 0, 0.05)', border: '1px solid rgba(245, 159, 0, 0.1)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(245, 159, 0, 0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59f00' }}>
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{myArticlesCount}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Artikel Akademi</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(12, 166, 120, 0.05)', border: '1px solid rgba(12, 166, 120, 0.1)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(12, 166, 120, 0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{myMatsCount}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Materi Premium</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(12, 166, 120, 0.05)', border: '1px solid rgba(12, 166, 120, 0.1)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(12, 166, 120, 0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <Award size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{Number(user.bmcBalance || 0).toFixed(2)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BMC Reward</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Share Passport Link Widget */}
              <div style={{ background: 'var(--bg-color)', border: '1px dashed var(--border-color)', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                    Bagikan Passport Anda
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Tunjukkan reputasi hijau Anda kepada publik / donatur.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a 
                    href={passportLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '8px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Eye size={12} /> Buka
                  </a>
                  <button 
                    onClick={copyPassportLink}
                    style={{ background: copiedPassport ? 'var(--primary)' : 'var(--text-main)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {copiedPassport ? <><CheckCircle size={12} /> Tersalin!</> : <><Copy size={12} /> Salin Link</>}
                  </button>
                </div>
              </div>

              {/* 🗺️ INTERACTIVE MAP WIDGET */}
              <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', marginTop: '25px' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🗺️ Peta Lokasi Aktivitas Hijau
                </p>
                <div style={{ height: '240px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '15px', zIndex: 1 }}>
                  <MapContainer center={mapCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {(plantings || []).map((p, idx) => {
                      const coords = parseCoords(p.location);
                      if (!coords) return null;
                      return (
                        <Marker key={p.id || idx} position={coords} icon={defaultIcon}>
                          <Popup>
                            <div style={{ fontSize: '0.8rem', color: '#333' }}>
                              <strong style={{ color: 'var(--primary)' }}>{p.species || 'Bambu'}</strong><br/>
                              <span>Jumlah: {p.count || 0} rumpun</span><br/>
                              <span>Status: {p.status || 'Planted'}</span>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                    {coordsList.length === 0 && (
                      <Marker position={mapCenter} icon={defaultIcon}>
                        <Popup>
                          <div style={{ fontSize: '0.8rem', color: '#333' }}>
                            <strong>Area Konservasi Cibarani</strong><br/>
                            <span>Lokasi demonstrasi penanaman bambu lestari.</span>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>
                {/* Green Action Navigation Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Aksi Hijau Cepat:</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => window.location.hash = "/bambupedia/tracker"}
                      style={{ flex: 1, minWidth: '100px', background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 10px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
                    >
                      Buka Tracker Bambu
                    </button>
                    <button 
                      onClick={() => window.location.hash = "/bamboochain/invest"}
                      style={{ flex: 1, minWidth: '100px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '8px 10px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
                    >
                      Dukung Penanaman
                    </button>
                    <button 
                      onClick={() => window.location.hash = "/bambupedia/tracker"}
                      style={{ flex: 1, minWidth: '100px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '8px 10px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
                    >
                      Contribute Data
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
