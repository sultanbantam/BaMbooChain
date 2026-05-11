import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Camera, Save, Copy, Share2, Award, Shield, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    avatarUrl: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user.username || 'default')
      });
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

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  const referralCode = user.username ? `REF-${user.username.toUpperCase()}` : `REF-${user.id}`;
  const referralLink = `https://bamboochain.id/join?ref=${referralCode}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAvatarChange = () => {
    const newSeed = prompt('Masukkan kata unik untuk mengubah avatar Anda:');
    if (newSeed) {
      setFormData({ ...formData, avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}` });
    }
  };

  return (
    <div style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', background: '#fdfdfd' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '30px' }}>
          Profil <span style={{ color: 'var(--primary)' }}>Pengguna</span>
        </h1>

        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #f1f3f5', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#f8f9fa', overflow: 'hidden', border: '4px solid var(--primary)' }}>
                <img src={formData.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {isEditing && (
                <button 
                  onClick={handleAvatarChange}
                  style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--text-main)', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  title="Ubah Avatar"
                >
                  <Camera size={18} />
                </button>
              )}
            </div>
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleChange} 
                    style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '8px 16px', borderRadius: '12px', border: '1px solid #dee2e6', width: '100%' }}
                    placeholder="Nama Lengkap"
                  />
                  <input 
                    type="text" name="username" value={formData.username} onChange={handleChange} 
                    style={{ fontSize: '1rem', padding: '8px 16px', borderRadius: '12px', border: '1px solid #dee2e6', width: '100%' }}
                    placeholder="Username"
                  />
                </div>
              ) : (
                <div>
                  <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: 'var(--text-main)' }}>{user.name || 'Member'}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: '0 0 12px 0' }}>@{user.username || 'user'}</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      <Shield size={14} /> {user.kycStatus === 'verified' ? 'Verified' : 'Unverified'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 159, 0, 0.1)', color: '#f59f00', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      <Award size={14} /> Level: {user.checkinStreak > 0 ? 'Active' : 'Newbie'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div>
              {isEditing ? (
                <button onClick={handleSave} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <Save size={18} /> Simpan
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} style={{ background: '#f1f3f5', color: 'var(--text-main)', border: 'none', padding: '12px 24px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Edit Profil
                </button>
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--text-main)' }}>Informasi Kontak & Akun</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Email</label>
                <div style={{ padding: '12px 16px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #dee2e6', color: '#495057' }}>
                  {user.email || 'Tidak ada email'}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Nomor HP</label>
                {isEditing ? (
                  <input 
                    type="text" name="phone" value={formData.phone} onChange={handleChange} 
                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #dee2e6', width: '100%' }}
                    placeholder="Contoh: 08123456789"
                  />
                ) : (
                  <div style={{ padding: '12px 16px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #dee2e6', color: '#495057' }}>
                    {user.phone || 'Belum diisi'}
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>Wallet Address</label>
                <div style={{ padding: '12px 16px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #dee2e6', color: '#495057', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.walletAddress}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REFERRAL SYSTEM SECTION */}
        <div style={{ background: 'linear-gradient(135deg, var(--text-main), #2c2e33)', borderRadius: '24px', padding: '40px', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }}>
            <Share2 size={200} />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Share2 size={24} color="var(--primary)" /> Program Referral
            </h3>
            <p style={{ color: '#adb5bd', marginBottom: '30px', maxWidth: '500px', lineHeight: '1.6' }}>
              Undang teman untuk bergabung ke ekosistem BaMbooChain dan dapatkan <strong style={{ color: 'var(--primary)' }}>0.5 BMC</strong> untuk setiap pendaftar baru yang menyelesaikan KYC!
            </p>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: '#f8f9fa' }}>{referralLink}</span>
              </div>
              <button 
                onClick={copyReferral}
                style={{ background: copied ? 'var(--primary)' : 'white', color: copied ? 'white' : 'var(--text-main)', border: 'none', padding: '0 24px', borderRadius: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', minHeight: '54px' }}
              >
                {copied ? <><CheckCircle size={18} /> Tersalin!</> : <><Copy size={18} /> Salin Link</>}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
