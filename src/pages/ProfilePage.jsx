import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBambupedia } from '../context/BambupediaContext';
import { db } from '../firebase/config';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { 
  User, Camera, Save, Copy, Share2, Award, Shield, CheckCircle, 
  TreeDeciduous, GraduationCap, Heart, MessageSquare, Gift, Edit3, X, Eye
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, articles } = useAuth();
  const { plantings, maintenances, harvests } = useBambupedia();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    avatarUrl: '',
    bioText: '',
    statusText: ''
  });
  
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
  const [activeListTab, setActiveListTab] = useState(null); // 'comments' | 'gifts' | null

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user.username || 'default'),
        bioText: user.bioText || '',
        statusText: user.statusText || ''
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

  const handleSaveStatus = async () => {
    await updateProfile({
      bioText: formData.bioText,
      statusText: formData.statusText
    });
    setIsEditingStatus(false);
  };

  const handleAvatarChange = () => {
    const newSeed = prompt('Masukkan kata unik untuk mengubah avatar Anda:');
    if (newSeed) {
      const newUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`;
      setFormData({ ...formData, avatarUrl: newUrl });
      updateProfile({ avatarUrl: newUrl });
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

  // Level Badge Calculation
  const totalEcoActions = myPlantingsCount + myMaintenancesCount + myArticlesCount;
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
    <div style={{ paddingTop: '130px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--bg-color)', transition: 'background 0.3s ease' }}>
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
                    <button 
                      onClick={handleSaveStatus}
                      style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', alignSelf: 'flex-end' }}
                    >
                      Simpan Status
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

              {/* Eco Metrics Grid */}
              <div style={{ marginBottom: '25px' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Aktivitas Kontribusi Hutan Bambu</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                  
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
                      <Award size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{user.bmcBalance || 0}</div>
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

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
