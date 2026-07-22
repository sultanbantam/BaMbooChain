import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ShareModal from '../components/ShareModal';
import { db } from '../firebase/config';
import { 
  collection, query, where, getDocs, doc, getDoc, updateDoc, 
  setDoc, arrayUnion, arrayRemove, increment, onSnapshot, addDoc 
} from 'firebase/firestore';
import { 
  User, Calendar, MapPin, Heart, MessageSquare, Share2, Gift, 
  TreeDeciduous, GraduationCap, Shield, Award, Sparkles, X, ChevronRight,
  DownloadCloud, Lock, FileText, CheckCircle, Send
} from 'lucide-react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const formatBalance = (val) => {
  const num = Number(val || 0);
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
};

const PublicPortfolioPage = () => {
  const { username } = useParams();
  const { user: currentUser, giftBmc } = useAuth();
  const navigate = useNavigate();
  
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Stats states
  const [plantCount, setPlantCount] = useState(0);
  const [plantingsList, setPlantingsList] = useState([]);
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [articlesList, setArticlesList] = useState([]);
  const [matsList, setMatsList] = useState([]);
  
  // Status interactions
  const [interactions, setInteractions] = useState({
    likes: [],
    shares: 0,
    comments: [],
    gifts: []
  });
  
  // Interactive forms state
  const [commentText, setCommentText] = useState('');
  const [giftAmount, setGiftAmount] = useState('1');
  const [giftingInProgress, setGiftingInProgress] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareModalData, setShareModalData] = useState({ isOpen: false, url: '', title: '' });

  // Status Feed States
  const [statuses, setStatuses] = useState([]);
  const [activeCommentStatusId, setActiveCommentStatusId] = useState(null);
  const [activeGiftStatusId, setActiveGiftStatusId] = useState(null);
  const [expandedCommentsStatusId, setExpandedCommentsStatusId] = useState(null);
  const [expandedGiftsStatusId, setExpandedGiftsStatusId] = useState(null);
  const [activeMapMarker, setActiveMapMarker] = useState(null);

  const { isLoaded: isMapLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  // Direct private messaging states
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Selected Article Modal
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  // 1. Fetch Target User Data
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, "users");
        
        // Try searching by username (case-insensitive conversion)
        const q = query(usersRef, where("username", "==", username.toLowerCase()));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const uDoc = snap.docs[0];
          setTargetUser({ id: uDoc.id, ...uDoc.data() });
        } else {
          // Try searching directly by userId (UID) as backup
          const docRef = doc(db, "users", username);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setTargetUser({ id: docSnap.id, ...docSnap.data() });
          } else {
            setTargetUser(null);
          }
        }
      } catch (err) {
        console.error("Error fetching user portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (username) fetchUser();
  }, [username]);

  // 2. Fetch User Stats and Articles (Once target user is resolved)
  useEffect(() => {
    if (!targetUser) return;
    
    const fetchStats = async () => {
      try {
        // Plantings
        const plantingsQuery = query(collection(db, "plantings"), where("userId", "==", targetUser.id));
        const plantingsSnap = await getDocs(plantingsQuery);
        const plantingsData = plantingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlantingsList(plantingsData);
        const totalAmount = plantingsData.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        setPlantCount(totalAmount);
        
        // Maintenances
        const maintQuery = query(collection(db, "maintenances"), where("userId", "==", targetUser.id));
        const maintSnap = await getDocs(maintQuery);
        setMaintenanceCount(maintSnap.size);
        
        // Articles
        const articlesQuery = query(collection(db, "articles"), where("userId", "==", targetUser.id));
        const articlesSnap = await getDocs(articlesQuery);
        const articlesData = articlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArticlesList(articlesData);

        // Premium Materials / Ebooks
        const matsQuery = query(collection(db, "premium_materials"), where("userId", "==", targetUser.id));
        const matsSnap = await getDocs(matsQuery);
        const matsData = matsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMatsList(matsData);
      } catch (err) {
        console.error("Error loading ecosystem stats:", err);
      }
    };

    fetchStats();

    // Listen to status interactions in real time
    const interRef = doc(db, "status_interactions", targetUser.id);
    const unsub = onSnapshot(interRef, (docSnap) => {
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
    });

    return () => unsub();

  }, [targetUser]);

  // 3. Sync statuses from Firestore in real-time
  useEffect(() => {
    if (targetUser && targetUser.id) {
      const q = query(collection(db, "statuses"), where("userId", "==", targetUser.id));
      const unsub = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setStatuses(list);
      }, (err) => console.error("Statuses sync error in public portfolio:", err));
      return () => unsub();
    }
  }, [targetUser]);

  if (loading) {
    return (
      <div style={{ paddingTop: '150px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)' }}>Memuat Passport Pengguna...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div style={{ paddingTop: '150px', minHeight: '60vh', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '10px' }}>Passport Tidak Ditemukan</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Akun dengan username "@{username}" belum terdaftar di ekosistem BaMbooChain.</p>
        <button onClick={() => navigate('/')} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // On-demand migration helper for virtual legacy status
  const ensureRealStatus = async (status) => {
    if (!status.isLegacy) return status.id;

    try {
      const docRef = await addDoc(collection(db, "statuses"), {
        userId: status.userId,
        username: status.username,
        name: status.name,
        avatarUrl: status.avatarUrl,
        statusText: status.statusText,
        statusPhotos: status.statusPhotos || [],
        statusVideo: status.statusVideo || '',
        timestamp: status.timestamp || Date.now(),
        likes: status.likes || [],
        comments: status.comments || [],
        gifts: status.gifts || [],
        shares: status.shares || 0
      });

      // Clear legacy status fields from user profile in users collection
      const userRef = doc(db, "users", status.userId);
      await updateDoc(userRef, {
        statusText: '',
        statusPhotos: [],
        statusVideo: ''
      });

      return docRef.id;
    } catch (err) {
      console.error("Error migrating legacy status on-demand:", err);
      throw err;
    }
  };

  // Interactivity Actions
  const handleLike = async (status) => {
    if (!currentUser) {
      alert("⚠️ Harap login untuk memberikan Suka!");
      return;
    }

    try {
      const realStatusId = await ensureRealStatus(status);
      const statusRef = doc(db, "statuses", realStatusId);
      
      const currentLikes = status.isLegacy ? (interactions.likes || []) : (status.likes || []);
      const hasLiked = currentLikes.includes(currentUser.id);

      await updateDoc(statusRef, {
        likes: hasLiked ? arrayRemove(currentUser.id) : arrayUnion(currentUser.id)
      });
    } catch (err) {
      console.error("Error liking status:", err);
    }
  };

  const handleShare = async (status) => {
    const shareUrl = `${window.location.origin}/#/portfolio/${targetUser?.username || username}`;
    setShareModalData({
      isOpen: true,
      url: shareUrl,
      title: `Lihat status terkini dari @${targetUser?.username || username} di BaMbooChain!`
    });

    try {
      const realStatusId = await ensureRealStatus(status);
      const statusRef = doc(db, "statuses", realStatusId);
      await updateDoc(statusRef, { shares: increment(1) });
    } catch (err) {
      console.error("Error sharing status:", err);
    }
  };

  const handleAddComment = async (e, status) => {
    e.preventDefault();
    if (!currentUser) {
      alert("⚠️ Harap login untuk menulis komentar!");
      return;
    }
    if (!commentText.trim()) return;

    const newComment = {
      id: 'comment_' + Date.now(),
      userId: currentUser.id,
      username: currentUser.username || currentUser.name || "Anonim",
      text: commentText.trim(),
      timestamp: Date.now()
    };

    try {
      const realStatusId = await ensureRealStatus(status);
      const statusRef = doc(db, "statuses", realStatusId);
      await updateDoc(statusRef, { comments: arrayUnion(newComment) });
      setCommentText('');
      setActiveCommentStatusId(null);
    } catch (err) {
      console.error("Error commenting on status:", err);
    }
  };

  const handleSendGift = async (status) => {
    if (!currentUser) {
      alert("⚠️ Harap login untuk mengirimkan Gift!");
      return;
    }
    const val = parseFloat(giftAmount);
    if (isNaN(val) || val <= 0) {
      alert("⚠️ Harap masukkan nilai gift yang valid.");
      return;
    }

    setGiftingInProgress(true);
    try {
      const realStatusId = await ensureRealStatus(status);
      const success = await giftBmc(
        targetUser.id, 
        targetUser.username, 
        val, 
        `Tipping Status Ecoportfolio via @${currentUser.username}`,
        realStatusId
      );
      if (success) {
        setActiveGiftStatusId(null);
      }
    } catch (err) {
      console.error("Error sending gift:", err);
    } finally {
      setGiftingInProgress(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("⚠️ Harap login untuk mengirim pesan privat!");
      return;
    }
    if (!messageText.trim()) return;
    setIsSendingMessage(true);
    try {
      await addDoc(collection(db, "direct_messages"), {
        senderId: currentUser.id,
        senderUsername: currentUser.username || "Anonim",
        receiverId: targetUser.id,
        receiverUsername: targetUser.username || "user",
        messageText: messageText.trim(),
        timestamp: Date.now(),
        read: false
      });
      alert("✅ Pesan privat berhasil dikirim!");
      setMessageText('');
      setIsMessageModalOpen(false);
    } catch (err) {
      console.error("Error sending private message:", err);
      alert("❌ Gagal mengirim pesan privat.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Badge Levels
  const totalEcoActions = plantCount + maintenanceCount + articlesList.length;
  let ecoLevel = "Eco-Beginner";
  let badgeColor = "#6c757d";
  if (totalEcoActions >= 15) {
    ecoLevel = "Forest Guardian";
    badgeColor = "#157347";
  } else if (totalEcoActions >= 5) {
    ecoLevel = "Bamboo Pioneer";
    badgeColor = "#0d6efd";
  }

  const displayStatuses = [...statuses];
  if (displayStatuses.length === 0 && (targetUser?.statusText || (targetUser?.statusPhotos && targetUser?.statusPhotos.length > 0) || targetUser?.statusVideo)) {
    displayStatuses.push({
      id: "legacy_" + targetUser.id,
      userId: targetUser.id,
      username: targetUser.username || targetUser.name || "user",
      name: targetUser.name || "User",
      avatarUrl: targetUser.avatarUrl || '',
      statusText: targetUser.statusText || '',
      statusPhotos: targetUser.statusPhotos || [],
      statusVideo: targetUser.statusVideo || '',
      timestamp: targetUser.joinedAt || Date.now(),
      isLegacy: true,
      likes: interactions.likes || [],
      comments: interactions.comments || [],
      gifts: interactions.gifts || [],
      shares: interactions.shares || 0
    });
  }

  const alreadyLiked = currentUser && interactions.likes.includes(currentUser.id);

  const coordsList = (plantingsList || []).map(p => parseCoords(p.location)).filter(Boolean);
  const mapCenter = coordsList.length > 0 ? coordsList[0] : [-6.5888, 106.3144];

  return (
    <div style={{ paddingTop: '190px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--bg-color)', transition: 'background 0.3s ease' }}>
      <div className="container profile-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginBottom: '25px', padding: 0 }}
        >
          ← Kembali ke Beranda
        </button>

        {/* ────────── PASSPORT MAIN BOARD ────────── */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '30px', boxShadow: '0 15px 50px rgba(0,0,0,0.06)', border: '1px solid var(--border-color)', overflow: 'hidden', marginBottom: '35px', transition: 'background 0.3s' }}>
          
          {/* Header Panel */}
          <div style={{ background: 'linear-gradient(135deg, #115e59, #064e3b)', padding: '40px', color: 'white', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '20px', right: '30px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={14} color="#f59f00" /> BaMbooChain Passport
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap', marginTop: '20px' }}>
              <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'var(--bg-color)', overflow: 'hidden', border: '4px solid var(--primary)', boxShadow: '0 5px 20px rgba(0,0,0,0.15)' }}>
                <img 
                  src={targetUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUser.username || 'default'}`} 
                  alt="Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: '800' }}>{targetUser.name || 'Pegiat Bambu'}</h2>
                <p style={{ margin: '4px 0 12px 0', fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}>@{targetUser.username || 'user'}</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <Shield size={12} /> {targetUser.kycStatus === 'verified' ? 'Verified Partner' : 'Registered Member'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(245,159,0,0.25)', color: '#ffd43b', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <Sparkles size={12} /> {ecoLevel}
                  </span>
                </div>
                {currentUser?.id !== targetUser.id && (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                    <button 
                      onClick={() => setIsMessageModalOpen(true)}
                      style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}
                    >
                      <Send size={14} /> Kirim Pesan Privat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details & Status Section */}
          <div style={{ padding: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
              
              {/* Left Column: Bio & Status */}
              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bio Kontributor</h4>
                <p style={{ margin: '0 0 25px 0', fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.6', fontStyle: targetUser.bioText ? 'normal' : 'italic' }}>
                  {targetUser.bioText || `Pegiat peduli lingkungan yang aktif berpartisipasi dalam program reboisasi dan konservasi bambu Indonesia.`}
                </p>

                {/* CV / Portofolio Lengkap Section */}
                <div style={{ marginBottom: '25px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={18} color="var(--primary)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Dokumen CV / Portofolio</span>
                  </div>
                  {targetUser.cvFile ? (
                    <div>
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        File: <strong>{targetUser.cvFile.name}</strong>
                      </p>
                      {currentUser?.kycStatus === 'verified' ? (
                        <button 
                          onClick={() => {
                             const dataURI = targetUser.cvFile.data;
                             const parts = dataURI.split(',');
                             const byteString = atob(parts[1]);
                             const mimeString = parts[0].split(':')[1].split(';')[0];
                             const ab = new ArrayBuffer(byteString.length);
                             const ia = new Uint8Array(ab);
                             for (let i = 0; i < byteString.length; i++) {
                               ia[i] = byteString.charCodeAt(i);
                             }
                             const blob = new Blob([ab], { type: mimeString });
                             const blobUrl = URL.createObjectURL(blob);

                             const link = document.createElement('a');
                             link.href = blobUrl;
                             link.download = targetUser.cvFile.name;
                             link.click();
                             setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
                           }}
                          style={{
                            width: '100%',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '12px',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 15px rgba(12,166,120,0.15)'
                          }}
                        >
                          📄 Unduh CV / Portofolio Lengkap
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            if (!currentUser) {
                              alert("⚠️ Akses Terkunci!\n\nSilakan login terlebih dahulu.");
                            } else {
                              alert(`⚠️ Akses Terkunci!\n\nUntuk mengunduh dokumen CV/Portofolio dari @${targetUser.username}, akun Anda harus berstatus KYC TERVERIFIKASI. Silakan selesaikan pengajuan KYC Anda di menu KYC Center pada halaman Wallet Dashboard.`);
                              window.location.hash = "/bamboochain/token-wallet";
                            }
                          }}
                          style={{
                            width: '100%',
                            background: 'var(--text-muted)',
                            color: 'white',
                            border: 'none',
                            padding: '12px',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          🔒 Unduh CV / Portofolio (Hanya KYC Verified)
                        </button>
                      )}
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Belum mengunggah dokumen CV / Portofolio
                    </p>
                  )}
                </div>

                {/* Status Feed */}
                <div className="profile-feed-container" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Riwayat Status ({displayStatuses.length})</h4>
                  
                  {displayStatuses.length === 0 ? (
                    <div style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        Mari bersama melestarikan lingkungan demi bumi yang lebih sehat! 🌿
                      </p>
                    </div>
                  ) : (
                    displayStatuses.map(status => {
                      const isCommentsExpanded = expandedCommentsStatusId === status.id;
                      const isGiftsExpanded = expandedGiftsStatusId === status.id;
                      const isCommentFormActive = activeCommentStatusId === status.id;
                      const isGiftFormActive = activeGiftStatusId === status.id;
                      
                      return (
                        <div 
                          key={status.id} 
                          style={{ 
                            background: 'var(--bg-color)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '20px', 
                            padding: '24px', 
                            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                          }}
                        >
                          {/* Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                              Status Terkini {status.isLegacy && "(Legacy)"}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {status.timestamp ? new Date(status.timestamp).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>

                          {/* Status Text */}
                          <p style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: '500', lineHeight: '1.5' }}>
                            "{status.statusText}"
                          </p>

                          {/* Render Status Media */}
                          {status.statusPhotos && status.statusPhotos.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(status.statusPhotos.length, 3)}, 1fr)`, gap: '8px', marginBottom: '6px' }}>
                              {status.statusPhotos.map((photo, idx) => (
                                <div 
                                  key={idx} 
                                  onClick={() => setLightboxImage(photo)}
                                  style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', aspectRatio: '1/1', cursor: 'pointer', transition: 'transform 0.2s' }}
                                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                  <img src={photo} alt={`status ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                              ))}
                            </div>
                          )}
                          {status.statusVideo && (
                            <div style={{ marginBottom: '6px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                              <video src={status.statusVideo} controls muted style={{ width: '100%', display: 'block', maxHeight: '300px', objectFit: 'contain', background: '#000' }} />
                            </div>
                          )}

                          {/* Status Interactions Panel */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <button 
                              onClick={() => handleLike(status)} 
                              style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', color: (currentUser && (status.isLegacy ? (interactions.likes || []) : (status.likes || [])).includes(currentUser.id)) ? '#e03131' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}
                            >
                              <Heart size={16} fill={(currentUser && (status.isLegacy ? (interactions.likes || []) : (status.likes || [])).includes(currentUser.id)) ? '#e03131' : 'none'} />
                              <span>{status.isLegacy ? (interactions.likes?.length || 0) : (status.likes?.length || 0)} Likes</span>
                            </button>
                            <button 
                              onClick={() => {
                                setExpandedCommentsStatusId(isCommentsExpanded ? null : status.id);
                                setExpandedGiftsStatusId(null);
                              }} 
                              style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}
                            >
                              <MessageSquare size={16} color="var(--primary)" />
                              <span style={{ textDecoration: 'underline' }}>{status.isLegacy ? (interactions.comments?.length || 0) : (status.comments?.length || 0)} Comments</span>
                            </button>
                            <button 
                              onClick={() => handleShare(status)} 
                              style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}
                            >
                              <Share2 size={16} color="#228be6" />
                              <span>{status.isLegacy ? (interactions.shares || 0) : (status.shares || 0)} Bagikan</span>
                            </button>
                            <button 
                              onClick={() => {
                                setExpandedGiftsStatusId(isGiftsExpanded ? null : status.id);
                                setExpandedCommentsStatusId(null);
                              }} 
                              style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}
                            >
                              <Gift size={16} color="#f59f00" />
                              <span style={{ textDecoration: 'underline' }}>{status.isLegacy ? (interactions.gifts?.length || 0) : (status.gifts?.length || 0)} Gift</span>
                            </button>
                          </div>

                          {/* Quick Action buttons */}
                          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                            <button 
                              onClick={() => {
                                setActiveCommentStatusId(isCommentFormActive ? null : status.id);
                                setActiveGiftStatusId(null);
                                setCommentText('');
                              }}
                              style={{ flex: 1, background: 'rgba(12,166,120,0.05)', color: 'var(--primary)', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              💬 Tulis Komentar
                            </button>
                            <button 
                              onClick={() => {
                                setActiveGiftStatusId(isGiftFormActive ? null : status.id);
                                setActiveCommentStatusId(null);
                                setGiftAmount('1');
                              }}
                              style={{ flex: 1, background: 'rgba(245,159,0,0.05)', color: '#f59f00', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              🎁 Kirim Gift
                            </button>
                          </div>

                          {/* Collapsible comments list */}
                          {isCommentsExpanded && (
                            <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '15px', border: '1px solid var(--border-color)', marginTop: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>💬 Komentar Status ({status.isLegacy ? (interactions.comments?.length || 0) : (status.comments?.length || 0)})</span>
                                <button onClick={() => setExpandedCommentsStatusId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                              </div>
                              {(!status.isLegacy ? (!status.comments || status.comments.length === 0) : (!interactions.comments || interactions.comments.length === 0)) ? (
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', margin: '10px 0' }}>Belum ada komentar.</p>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {(status.isLegacy ? interactions.comments : status.comments).map((comment, index) => (
                                    <div key={comment.id || index} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '4px' }}>
                                      <span style={{ fontWeight: 'bold', fontSize: '0.78rem', color: 'var(--primary)' }}>@{comment.username}</span>
                                      <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: 'var(--text-main)' }}>{comment.text}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Collapsible gifts list */}
                          {isGiftsExpanded && (
                            <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '15px', border: '1px solid var(--border-color)', marginTop: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>🎁 Daftar Gift Diterima ({status.isLegacy ? (interactions.gifts?.length || 0) : (status.gifts?.length || 0)})</span>
                                <button onClick={() => setExpandedGiftsStatusId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                              </div>
                              {(!status.isLegacy ? (!status.gifts || status.gifts.length === 0) : (!interactions.gifts || interactions.gifts.length === 0)) ? (
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', margin: '10px 0' }}>Belum menerima gift.</p>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {(status.isLegacy ? interactions.gifts : status.gifts).map((gift, index) => (
                                    <div key={gift.id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '4px' }}>
                                      <div>
                                        <span style={{ fontWeight: 'bold', fontSize: '0.78rem', color: 'var(--text-main)' }}>@{gift.senderUsername}</span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                                          {new Date(gift.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </span>
                                      </div>
                                      <span style={{ color: '#f59f00', fontWeight: 'bold', fontSize: '0.8rem' }}>+{gift.amount} BMC</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Comment input form */}
                          {isCommentFormActive && (
                            <form onSubmit={(e) => handleAddComment(e, status)} style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                              <input 
                                type="text" 
                                value={commentText} 
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Tulis komentar..."
                                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                              />
                              <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>Kirim</button>
                            </form>
                          )}

                          {/* Gift form */}
                          {isGiftFormActive && (
                            <div style={{ marginTop: '12px', background: 'var(--bg-card)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                              <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>🎁 Kirim Insentif BMC Ke Kontributor</p>
                              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                                {['1', '5', '10', '25'].map(amt => (
                                  <button 
                                    key={amt} 
                                    onClick={() => setGiftAmount(amt)}
                                    style={{ flex: 1, padding: '6px 0', borderRadius: '6px', border: giftAmount === amt ? '2px solid #f59f00' : '1px solid var(--border-color)', background: giftAmount === amt ? 'rgba(245,159,0,0.1)' : 'var(--bg-color)', color: giftAmount === amt ? '#f59f00' : 'var(--text-main)', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
                                  >
                                    {amt} BMC
                                  </button>
                                ))}
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <input 
                                  type="number" 
                                  value={giftAmount} 
                                  onChange={(e) => setGiftAmount(e.target.value)}
                                  placeholder="Jumlah kustom..."
                                  style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                                />
                                <button 
                                  onClick={() => handleSendGift(status)}
                                  disabled={giftingInProgress}
                                  style={{ background: '#f59f00', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                  {giftingInProgress ? 'Mengirim...' : 'Kirim Gift'}
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Statistics Grid & Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dasbor Aktivitas Ekosistem</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                  
                  <div style={{ background: 'rgba(12, 166, 120, 0.04)', border: '1px solid rgba(12, 166, 120, 0.08)', padding: '20px', borderRadius: '20px' }}>
                    <TreeDeciduous size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 4px 0' }}>{plantCount}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Bambu Ditanam</div>
                  </div>

                  <div style={{ background: 'rgba(34, 139, 230, 0.04)', border: '1px solid rgba(34, 139, 230, 0.08)', padding: '20px', borderRadius: '20px' }}>
                    <Shield size={24} color="#228be6" style={{ marginBottom: '10px' }} />
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 4px 0' }}>{maintenanceCount}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Perawatan Lahan</div>
                  </div>

                  <div style={{ background: 'rgba(245, 159, 0, 0.04)', border: '1px solid rgba(245, 159, 0, 0.08)', padding: '20px', borderRadius: '20px' }}>
                    <GraduationCap size={24} color="#f59f00" style={{ marginBottom: '10px' }} />
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 4px 0' }}>{articlesList.length}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Karya Akademi</div>
                  </div>

                  <div style={{ background: 'rgba(12, 166, 120, 0.04)', border: '1px solid rgba(12, 166, 120, 0.08)', padding: '20px', borderRadius: '20px' }}>
                    <Award size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 4px 0' }}>{formatBalance(targetUser.bmcBalance)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>BMC Reward</div>
                  </div>

                </div>

                <div style={{ background: '#f8f9fa', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-color)' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#666', fontWeight: 'bold' }}>TANGGAL BERGABUNG</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#333', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                    <Calendar size={16} /> 
                    {targetUser.joinedAt 
                      ? new Date(targetUser.joinedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'Maret 2026'
                    }
                  </p>
                </div>

                {/* 🗺️ INTERACTIVE MAP WIDGET */}
                <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🗺️ Peta Lokasi Aktivitas Hijau
                  </p>
                  <div style={{ height: '240px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '15px', zIndex: 1 }}>
                  {!isMapLoaded ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f8f9fa' }}>Loading Google Maps...</div>
                  ) : (
                    <GoogleMap 
                      center={mapCenter ? { lat: mapCenter[0], lng: mapCenter[1] } : { lat: -6.5888, lng: 106.3144 }} 
                      zoom={10} 
                      mapContainerStyle={{ height: '100%', width: '100%' }}
                    >
                      {(plantingsList || []).map((p, idx) => {
                        const coords = parseCoords(p.location);
                        if (!coords) return null;
                        const pos = { lat: coords[0], lng: coords[1] };
                        const markerId = p.id || `marker-${idx}`;
                        return (
                          <Marker 
                            key={markerId} 
                            position={pos} 
                            onClick={() => setActiveMapMarker(markerId)}
                          >
                            {activeMapMarker === markerId && (
                              <InfoWindow onCloseClick={() => setActiveMapMarker(null)}>
                                <div style={{ fontSize: '0.8rem', color: '#333', padding: '4px' }}>
                                  <strong style={{ color: 'var(--primary)' }}>{p.species || 'Bambu'}</strong><br/>
                                  <span>Jumlah: {p.count || 0} rumpun</span><br/>
                                  <span>Status: {p.status || 'Planted'}</span>
                                </div>
                              </InfoWindow>
                            )}
                          </Marker>
                        );
                      })}
                      {coordsList.length === 0 && (
                        <Marker 
                          position={mapCenter ? { lat: mapCenter[0], lng: mapCenter[1] } : { lat: -6.5888, lng: 106.3144 }}
                          onClick={() => setActiveMapMarker('cibarani')}
                        >
                          {activeMapMarker === 'cibarani' && (
                            <InfoWindow onCloseClick={() => setActiveMapMarker(null)}>
                              <div style={{ fontSize: '0.8rem', color: '#333', padding: '4px' }}>
                                <strong>Area Konservasi Cibarani</strong><br/>
                                <span>Lokasi demonstrasi penanaman bambu lestari.</span>
                              </div>
                            </InfoWindow>
                          )}
                        </Marker>
                      )}
                    </GoogleMap>
                  )}
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

        {/* ────────── PUBLIC ARTICLES / RESEARCH ESSAYS LIST ────────── */}
        <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '20px' }}>
          Karya Tulis & Esai Ilmiah
        </h3>
        
        {articlesList.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
            Belum ada karya tulis atau esai ilmiah yang diterbitkan oleh kontributor ini di Akademi.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
            {articlesList.map(article => (
              <div 
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                style={{ background: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.03)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', height: '100%' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {article.image && (
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                    {article.category || 'Sains Bambu'}
                  </span>
                  <h4 style={{ fontSize: '1.15rem', margin: '0 0 10px 0', color: 'var(--text-main)', fontWeight: 'bold', lineHeight: '1.3' }}>
                    {article.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 20px 0', flex: 1, lineHeight: '1.5' }}>
                    {article.excerpt || article.content?.substring(0, 100) + '...'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{article.date}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      Baca Selengkapnya <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ────────── DYNAMIC PREMIUM MATERIALS LIST ────────── */}
        <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '40px', marginBottom: '20px' }}>
          Materi Riset & Ebook Premium Kontribusi
        </h3>
        
        {matsList.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border-color)', color: 'var(--text-muted)', marginBottom: '40px' }}>
            Belum ada materi riset premium atau ebook yang diunggah oleh kontributor ini.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '40px' }}>
            {matsList.map(mat => (
              <div 
                key={mat.id}
                style={{ background: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.03)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {mat.cover && (
                  <div style={{ height: '180px', overflow: 'hidden', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border-color)' }}>
                    <img src={mat.cover && mat.cover.startsWith('/assets/') ? '.' + mat.cover : mat.cover} alt={mat.title} style={{ height: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                )}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                    {mat.tag || 'Riset Premium'}
                  </span>
                  <h4 style={{ fontSize: '1.15rem', margin: '0 0 10px 0', color: 'var(--text-main)', fontWeight: 'bold', lineHeight: '1.3' }}>
                    {mat.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 20px 0', flex: 1, lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {mat.desc}
                  </p>
                  
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Akses Unduh:</span>
                      {currentUser?.kycStatus === 'verified' ? (
                        <span style={{ color: '#12b886', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }}><CheckCircle size={12} /> Terbuka</span>
                      ) : (
                        <span style={{ color: '#fa5252', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }}><Lock size={12} /> Terkunci KYC</span>
                      )}
                    </div>
                    
                    <button 
                      onClick={async () => {
                        if (!currentUser) {
                          alert("⚠️ Silakan login terlebih dahulu untuk mengakses unduhan!");
                        } else if (currentUser.kycStatus !== 'verified') {
                          alert(`⚠️ Akses Terkunci!\n\nUntuk mendownload Ebook '${mat.title}' secara gratis, Anda harus berstatus KYC TERVERIFIKASI. Silakan selesaikan pengajuan KYC Anda di menu KYC Center pada halaman Wallet Dashboard.`);
                          window.location.hash = "/bamboochain/token-wallet";
                        } else {
                          const downloadUrl = mat.pdf && mat.pdf.startsWith('/assets/') ? '.' + mat.pdf : mat.pdf;
                          if (downloadUrl === 'chunked') {
                            alert("⏳ Sedang menyiapkan unduhan berkas PDF, mohon tunggu sebentar...");
                            try {
                              const chunksCollectionRef = collection(db, `premium_materials/${mat.id}/pdf_chunks`);
                              const snap = await getDocs(chunksCollectionRef);
                              const sortedDocs = snap.docs
                                .map(d => d.data())
                                .sort((a, b) => a.index - b.index);
                              
                              const fullBase64 = sortedDocs.map(d => d.data).join('');
                              
                              // Convert base64 Data URL to Blob URL to bypass browser size limits
                              const parts = fullBase64.split(',');
                              const byteString = atob(parts[1]);
                              const mimeString = parts[0].split(':')[1].split(';')[0];
                              const ab = new ArrayBuffer(byteString.length);
                              const ia = new Uint8Array(ab);
                              for (let i = 0; i < byteString.length; i++) {
                                ia[i] = byteString.charCodeAt(i);
                              }
                              const blob = new Blob([ab], { type: mimeString });
                              const blobUrl = URL.createObjectURL(blob);

                              const link = document.createElement('a');
                              link.href = blobUrl;
                              link.download = mat.downloadName || 'materi.pdf';
                              link.click();
                              setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
                            } catch (err) {
                              console.error("Error retrieving chunked PDF:", err);
                              alert("❌ Gagal mengunduh berkas: " + err.message);
                            }
                          } else if (downloadUrl && downloadUrl.startsWith('http')) {
                            window.open(downloadUrl, '_blank');
                          } else if (downloadUrl) {
                            const link = document.createElement('a');
                            link.href = downloadUrl;
                            link.download = mat.downloadName || 'materi.pdf';
                            link.click();
                          }
                        }
                      }}
                      style={{
                        background: currentUser?.kycStatus === 'verified' ? 'var(--primary)' : 'var(--text-muted)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'background 0.2s'
                      }}
                    >
                      <DownloadCloud size={14} /> {currentUser?.kycStatus === 'verified' ? 'Unduh PDF' : 'Verifikasi KYC & Unduh'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ────────── ARTICLE READ MODAL ────────── */}
      {selectedArticle && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '750px', maxHeight: '90vh', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', border: '1px solid var(--border-color)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {selectedArticle.category}
              </span>
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={22} />
              </button>
            </div>
            
            {/* Modal Body (Scrollable) */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '10px', fontWeight: '800', lineHeight: '1.3' }}>
                {selectedArticle.title}
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Ditulis oleh @{selectedArticle.username} pada {selectedArticle.date}
              </div>

              {/* Cover Image Slider / Single Image */}
              {selectedArticle.images && selectedArticle.images.length > 0 ? (
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '20px' }}>
                  {selectedArticle.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt={`Foto Pendukung ${idx + 1}`} 
                      style={{ height: '220px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} 
                    />
                  ))}
                </div>
              ) : selectedArticle.image ? (
                <img 
                  src={selectedArticle.image} 
                  alt={selectedArticle.title} 
                  style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }} 
                />
              ) : null}

              {/* Article Content */}
              <div style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {selectedArticle.content}
              </div>
            </div>

          </div>
        </div>
      )}
      {/* ────────── PRIVATE MESSAGE MODAL ────────── */}
      {isMessageModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', border: '1px solid var(--border-color)' }}>
            
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={18} color="var(--primary)" />
                <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Kirim Pesan Privat</span>
              </div>
              <button 
                onClick={() => setIsMessageModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={22} />
              </button>
            </div>
            
            {/* Body */}
            <form onSubmit={handleSendMessage} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Penerima:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden' }}>
                    <img src={targetUser.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>{targetUser.name || 'Member'}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{targetUser.username}</span>
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Pesan Anda:</label>
                <textarea 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Tulis pesan privat Anda di sini..."
                  rows={4}
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', background: 'var(--bg-card)', color: 'var(--text-main)', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSendingMessage}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Send size={16} /> {isSendingMessage ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
            
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '20px',
            cursor: 'zoom-out',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <button
            onClick={() => setLightboxImage(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <X size={20} />
          </button>
          <img 
            src={lightboxImage} 
            alt="Status Foto Besar" 
            style={{ 
              maxWidth: '90%', 
              maxHeight: '90vh', 
              objectFit: 'contain', 
              borderRadius: '12px', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              cursor: 'default'
            }} 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <ShareModal
        isOpen={shareModalData.isOpen}
        onClose={() => setShareModalData(prev => ({ ...prev, isOpen: false }))}
        shareUrl={shareModalData.url}
        shareTitle={shareModalData.title}
      />
    </div>
  );
};

export default PublicPortfolioPage;
