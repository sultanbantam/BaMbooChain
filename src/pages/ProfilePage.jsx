import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBambupedia } from '../context/BambupediaContext';
import { useLanguage } from '../context/LanguageContext';
import { db, storage } from '../firebase/config';
import { ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage';
import { useArticles, usePlantationDonations, useEventTransactions, useUserEvents, useValidations } from '../hooks/useFirestoreQueries';
import { doc, onSnapshot, updateDoc, setDoc, collection, query, where, getDoc, getDocs, addDoc, deleteDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { requestForToken } from '../utils/NotificationService';
import ShareModal from '../components/ShareModal';
import { 
  User, Camera, Save, Copy, Share2, Award, Shield, CheckCircle, 
  TreeDeciduous, GraduationCap, Heart, MessageSquare, Gift, Edit3, X, Eye,
  UploadCloud, FileText, Trash2, Send, ChevronRight, PlayCircle, Search, Leaf, Bell, Smile, Calendar
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup as LeafletPopup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, 12, { animate: true });
    }
  }, [center, map]);
  return null;
}

const greenPinIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const orangePinIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const compressAvatar = (base64Str) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const max_size = 250; // Avatar standard size
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
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } catch (err) {
        console.warn("Canvas compression fallback to raw base64:", err);
        resolve(base64Str);
      }
    };
    img.onerror = (err) => {
      console.warn("Image load failed in compressAvatar, fallback:", err);
      resolve(base64Str);
    };
    img.src = base64Str;
  });
};

const parseCoords = (locStr) => {
  if (!locStr) return null;
  if (Array.isArray(locStr) && locStr.length === 2) return locStr;
  const str = locStr.toString();
  // Match (-7.123, 110.123) or -7.123, 110.123
  const match = str.match(/(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)/);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
    }
  }
  return null;
};

const formatBalance = (val) => {
  const num = Number(val || 0);
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
};

const ProfilePage = () => {
  const { t } = useLanguage();
  const { user, updateProfile } = useAuth();
  const { data: articles = [] } = useArticles();
  const { plantings, maintenances, harvests } = useBambupedia();
  const { data: plantationDonations = [] } = usePlantationDonations(user?.id, user?.username);
  const { data: eventTransactions = [] } = useEventTransactions();
  const { data: userEvents = [] } = useUserEvents(user?.id, user?.name || user?.username);
  const { data: allValidations = [] } = useValidations(user?.id);

  const myValidations = (allValidations || []).filter(v => 
    v.userId === user?.id || 
    v.username === user?.username || 
    (user?.email && v.email === user?.email)
  );

  // Filter ONLY bamboo clump observations (exclude non-bamboo KYC, fiat buy, articles)
  // and sort with LATEST ACTIVITY ON TOP!
  const myBambooObservations = (allValidations || []).filter(v => {
    const isOwner = v.userId === user?.id || v.username === user?.username || (user?.email && v.email === user?.email);
    const titleLower = (v.title || '').toLowerCase();
    const tagsLower = (v.tags || '').toLowerCase();
    const isObs = titleLower.includes('observasi') || tagsLower.includes('observasi') || v.details?.jmlRebung !== undefined;
    return isOwner && isObs;
  }).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  const myDonations = plantationDonations.filter(d => d.donorId === user?.id || d.username === user?.username);
  const myTreasuryTxs = eventTransactions.filter(tx => tx.adminId === user?.id);
  
  const [activeTab, setActiveTab] = useState('observasi'); // 'observasi' | 'feed' | 'events' | 'account'
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    avatarUrl: '',
    bannerUrl: '',
    bioText: '',
    ngopiUsername: '',
    bambooChat: '',
    statusText: '',
    statusPhotos: [],
    statusVideo: ''
  });
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPassport, setCopiedPassport] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  
  // Real-time statuses list state
  const [statuses, setStatuses] = useState([]);
  
  // Mobile detector & Pagination limits to avoid infinite scrolling
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMobile = windowWidth <= 768;

  const [statusVisibleCount, setStatusVisibleCount] = useState(3);
  const [eventVisibleCount, setEventVisibleCount] = useState(3);
  const statusLimit = statusVisibleCount;
  const setStatusLimit = setStatusVisibleCount;
  const eventLimit = eventVisibleCount;
  const setEventLimit = setEventVisibleCount;

  const [expandedCommentsStatusId, setExpandedCommentsStatusId] = useState(null);
  const [expandedGiftsStatusId, setExpandedGiftsStatusId] = useState(null);
  const [activeMapMarker, setActiveMapMarker] = useState(null);
  const [showInbox, setShowInbox] = useState(false);

  const [shareModalData, setShareModalData] = useState({ 
    isOpen: false, 
    url: '', 
    title: '', 
    userName: '', 
    userHandle: '', 
    userAvatar: '', 
    userBio: '', 
    userRole: '' 
  });
  const [commentText, setCommentText] = useState('');
  const [activeCommentStatusId, setActiveCommentStatusId] = useState(null);

  const [myMatsCount, setMyMatsCount] = useState(0);
  const [directMessages, setDirectMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showStatusEmojiPicker, setShowStatusEmojiPicker] = useState(false);
  const [showCommentEmojiPicker, setShowCommentEmojiPicker] = useState(false);
  const showEmojiPicker = showStatusEmojiPicker;
  const setShowEmojiPicker = setShowStatusEmojiPicker;

  const handleEnableNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await requestForToken(user?.id);
        if (token) {
          alert('✅ Notifikasi berhasil diaktifkan! Anda akan menerima pembaruan dan pengingat dari BaMbooChain.');
        } else {
          alert('⚠️ Gagal mendapatkan token notifikasi. Pastikan Anda tidak berada di mode Incognito/Private.');
        }
      } else {
        alert('❌ Izin notifikasi ditolak. Anda bisa mengaktifkannya secara manual melalui icon gembok di sebelah kiri alamat (URL) browser Anda.');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Terjadi kesalahan saat meminta izin notifikasi.');
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(query(usersRef));
        const matches = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const nameMatch = data.name?.toLowerCase().includes(searchQuery.toLowerCase());
          const usernameMatch = data.username?.toLowerCase().includes(searchQuery.toLowerCase());
          if (nameMatch || usernameMatch) {
            matches.push({ id: doc.id, ...data });
          }
        });
        setSearchResults(matches);
      } catch (err) {
        console.error("Error searching users:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

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
        bannerUrl: user.bannerUrl || '',
        bioText: user.bioText || '',
        ngopiUsername: user.ngopiUsername || user.ngopiAccount || '',
        bambooChat: user.bambooChat || user.bambooChatUsername || '',
        statusText: '',
        statusPhotos: [],
        statusVideo: ''
      });
    }
  }, [user]);

  // Sync statuses from Firestore
  useEffect(() => {
    if (user && user.id) {
      const q = query(collection(db, "statuses"), where("userId", "==", user.id));
      const unsub = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setStatuses(list);
      }, (err) => console.error("Statuses sync error:", err));
      return () => unsub();
    }
  }, [user]);

  // Auto-migrate legacy status from user document and status_interactions document
  useEffect(() => {
    if (user && user.id && statuses.length === 0 && (user.statusText || (user.statusPhotos && user.statusPhotos.length > 0) || user.statusVideo)) {
      const migrate = async () => {
        try {
          const docRef = doc(db, "status_interactions", user.id);
          const docSnap = await getDoc(docRef);
          let oldInteractions = { likes: [], comments: [], gifts: [], shares: 0 };
          if (docSnap.exists()) {
            oldInteractions = docSnap.data();
          }
          
          await addDoc(collection(db, "statuses"), {
            userId: user.id,
            username: user.username || user.name || "user",
            name: user.name || "User",
            avatarUrl: user.avatarUrl || '',
            statusText: user.statusText || '',
            statusPhotos: user.statusPhotos || [],
            statusVideo: user.statusVideo || '',
            timestamp: Date.now() - 3600000,
            likes: oldInteractions.likes || [],
            comments: oldInteractions.comments || [],
            gifts: oldInteractions.gifts || [],
            shares: oldInteractions.shares || 0
          });
          
          await updateDoc(doc(db, "users", user.id), {
            statusText: '',
            statusPhotos: [],
            statusVideo: ''
          });
        } catch (err) {
          console.error("Error migrating legacy status in profile:", err);
        }
      };
      migrate();
    }
  }, [user, statuses]);

  if (!user) {
    return (
      <div style={{ paddingTop: '150px', minHeight: '60vh', textAlign: 'center' }}>
        <h2>{t('profile_login_req')}</h2>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      const updateData = {
        name: formData.name,
        username: formData.username.toLowerCase().replace(/\s+/g, ''),
        phone: formData.phone || '',
        bioText: formData.bioText || '',
        ngopiUsername: formData.ngopiUsername || '',
        bambooChat: formData.bambooChat || ''
      };
      await updateDoc(doc(db, 'users', user.id), updateData);
      if (updateProfile) {
        updateProfile(updateData);
      }
      setIsEditing(false);
      alert(t('profile_alert_saved') || '✅ Profil berhasil diperbarui!');
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Gagal memperbarui profil: " + err.message);
    }
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
    
    try {
      // Update bio in user profile (non-blocking)
      if (user?.id) {
        setDoc(doc(db, 'users', user.id), {
          bioText: formData.bioText || ''
        }, { merge: true }).catch(e => console.error("Error updating bio:", e));
      }

      // Create new status document if there is content
      if ((formData.statusText || '').trim() || (formData.statusPhotos && formData.statusPhotos.length > 0) || formData.statusVideo) {
        try {
          const uid = user?.id || user?.uid || 'guest';
          const timestamp = Date.now();
          
          const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dsieguutz';
          const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'bamboo_preset';

          let finalPhotos = [];
          for (let i = 0; i < (formData.statusPhotos || []).length; i++) {
            const photo = formData.statusPhotos[i];
            if (photo.startsWith('data:image')) {
               const uploadData = new FormData();
               uploadData.append('file', photo);
               uploadData.append('upload_preset', uploadPreset);
               const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                 method: 'POST',
                 body: uploadData
               });
               if (!res.ok) throw new Error("Gagal mengunggah foto ke Cloudinary");
               const data = await res.json();
               finalPhotos.push(data.secure_url);
            } else {
               finalPhotos.push(photo);
            }
          }

          let finalVideo = formData.statusVideo || '';
          if (finalVideo.startsWith('data:video')) {
               const uploadData = new FormData();
               uploadData.append('file', finalVideo);
               uploadData.append('upload_preset', uploadPreset);
               const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
                 method: 'POST',
                 body: uploadData
               });
               if (!res.ok) throw new Error("Gagal mengunggah video ke Cloudinary");
               const data = await res.json();
               finalVideo = data.secure_url;
          }

          await addDoc(collection(db, "statuses"), {
            userId: uid,
            username: user?.username || user?.name || "user",
            name: user?.name || "User",
            avatarUrl: user?.avatarUrl || '',
            statusText: formData.statusText || '',
            statusPhotos: finalPhotos,
            statusVideo: finalVideo,
            timestamp: timestamp,
            likes: [],
            comments: [],
            gifts: [],
            shares: 0
          });

          // Reset the status inputs in formData
          setFormData(prev => ({
            ...prev,
            statusText: '',
            statusPhotos: [],
            statusVideo: ''
          }));
          
          // Optionally notify success
          alert("✅ Status berhasil disimpan!");
        } catch (err) {
          console.error("Error creating status document:", err);
          alert(`❌ Gagal menyimpan status baru. Error: ${err.message || err}`);
        }
      }
    } finally {
      setIsUploadingMedia(false);
      setIsEditingStatus(false);
    }
  };

  const handleLike = async (status) => {
    try {
      const statusRef = doc(db, "statuses", status.id);
      const hasLiked = (status.likes || []).includes(user.id);
      await updateDoc(statusRef, {
        likes: hasLiked ? arrayRemove(user.id) : arrayUnion(user.id)
      });
    } catch (err) {
      console.error("Error liking status:", err);
    }
  };

  const handlePhotoUpload = handleStatusPhotosChange;
  const handleVideoUpload = handleStatusVideoChange;

  const handleStatusSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    handleSaveStatus();
  };

  const onEmojiClick = (emojiData) => {
    setFormData(prev => ({
      ...prev,
      statusText: (prev.statusText || '') + (emojiData.emoji || '')
    }));
    setShowStatusEmojiPicker(false);
  };

  const handleDeleteStatus = async (statusId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus status ini?")) return;
    try {
      await deleteDoc(doc(db, "statuses", statusId));
      setStatuses(prev => prev.filter(s => s.id !== statusId));
      alert("✅ Status berhasil dihapus!");
    } catch (err) {
      console.error("Error deleting status:", err);
      alert("❌ Gagal menghapus status: " + err.message);
    }
  };

  const handleShare = async (status) => {
    const shareUrl = `${window.location.origin}/#/portfolio/${user.username || user.id}`;
    setShareModalData({
      isOpen: true,
      url: shareUrl,
      title: `Lihat status terkini dari @${user.username || user.name} di BaMbooChain!`,
      userName: user.name || 'Sultan Bantam',
      userHandle: user.username || 'sultanbantam',
      userAvatar: formData.avatarUrl || user.avatarUrl,
      userBio: formData.bioText || user.bioText,
      userRole: user.role === 'admin_yayasan' ? 'Admin Yayasan' : 'Forest Guardian'
    });
    try {
      const statusRef = doc(db, "statuses", status.id);
      await updateDoc(statusRef, { shares: increment(1) });
    } catch (err) {
      console.error("Error sharing status:", err);
    }
  };

  const handleAddComment = async (e, status) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: 'comment_' + Date.now(),
      userId: user.id,
      username: user.username || user.name || "Anonim",
      text: commentText.trim(),
      timestamp: Date.now()
    };

    try {
      const statusRef = doc(db, "statuses", status.id);
      await updateDoc(statusRef, { comments: arrayUnion(newComment) });
      setCommentText('');
      setActiveCommentStatusId(null);
    } catch (err) {
      console.error("Error commenting on status:", err);
    }
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("⚠️ Ukuran foto profil maksimal adalah 10MB!");
      return;
    }
    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      try {
        const rawBase64 = uploadEvent.target.result;
        const compressedBase64 = await compressAvatar(rawBase64);
        const uid = user?.id || user?.uid;
        if (!uid) throw new Error("Pengguna tidak terautentikasi");

        // Super-fast instant update directly to Firestore & local state (< 100ms)
        setFormData(prev => ({ ...prev, avatarUrl: compressedBase64 }));
        await updateDoc(doc(db, "users", uid), { avatarUrl: compressedBase64 });
        if (updateProfile) {
          updateProfile({ avatarUrl: compressedBase64 });
        }
        alert("✅ Foto profil berhasil diperbarui!");
      } catch (err) {
        console.error("Error uploading avatar:", err);
        alert("❌ Gagal memperbarui foto profil: " + err.message);
      } finally {
        setIsUploadingAvatar(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.onerror = () => {
      setIsUploadingAvatar(false);
      alert("❌ Gagal membaca file gambar.");
    };
    reader.readAsDataURL(file);
  };

  const compressBanner = (base64Str) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 450;
        let w = img.width, h = img.height;
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w);
          w = maxWidth;
        }
        if (h > maxHeight) {
          w = Math.round((w * maxHeight) / h);
          h = maxHeight;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = () => resolve(base64Str);
    });
  };

  const handleBannerFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("⚠️ Ukuran foto banner maksimal adalah 10MB!");
      return;
    }
    setIsUploadingBanner(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const rawBase64 = ev.target.result;
        const compressedBanner = await compressBanner(rawBase64);
        const uid = user?.id || user?.uid;
        if (!uid) throw new Error("Pengguna tidak teridentifikasi");

        setFormData(prev => ({ ...prev, bannerUrl: compressedBanner }));
        await updateDoc(doc(db, "users", uid), { bannerUrl: compressedBanner });
        if (updateProfile) {
          updateProfile({ bannerUrl: compressedBanner });
        }
        alert("✅ Banner profil berhasil dipasang!");
      } catch (err) {
        console.error("Error updating banner:", err);
        alert("❌ Gagal memperbarui banner profil: " + err.message);
      } finally {
        setIsUploadingBanner(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.onerror = () => {
      setIsUploadingBanner(false);
      alert("❌ Gagal membaca file banner.");
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = () => {
    // Directly open native gallery/file picker
    const fileInput = document.getElementById('avatar-upload-file');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleCreateDicebearAvatar = () => {
    const newSeed = prompt('Masukkan nama atau kata unik untuk membuat avatar karakter acak:');
    if (newSeed && newSeed.trim()) {
      const newUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newSeed.trim())}`;
      setFormData(prev => ({ ...prev, avatarUrl: newUrl }));
      if (updateProfile) {
        updateProfile({ avatarUrl: newUrl });
      } else if (user?.id) {
        updateDoc(doc(db, "users", user.id), { avatarUrl: newUrl });
      }
    }
  };

  const handleCvUpload = async (e) => {
    console.log("handleCvUpload triggered");
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }
    console.log("File selected:", file.name, file.size, file.type);
    
    if (file.size > 10 * 1024 * 1024) {
      alert("⚠️ Ukuran file maksimal adalah 10MB!");
      return;
    }
    
    try {
      alert("⏳ Sedang mengunggah dokumen, mohon tunggu...");
      console.log("Starting Cloudinary upload...");
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'cv_bamboochain');
      
      const response = await fetch('https://api.cloudinary.com/v1_1/dsieguutz/auto/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Gagal mengunggah ke server cloud.');
      }
      
      const data = await response.json();
      console.log("Upload completed, getting download URL...");
      const downloadUrl = data.secure_url;
      console.log("Download URL:", downloadUrl);
      
      const cvFile = {
        name: file.name || 'Dokumen CV',
        type: file.type || 'application/octet-stream',
        url: downloadUrl || ''
      };
      
      console.log("Updating profile with:", cvFile);
      if (user?.id) {
        await updateDoc(doc(db, 'users', user.id), { cvFile });
        alert("✅ CV/Portofolio berhasil diunggah!");
      }
      
      // alert already handled above
    } catch (err) {
      console.error("Error uploading CV:", err);
      alert("❌ Gagal mengunggah dokumen: " + err.message);
    }
    e.target.value = ''; // Reset input
    console.log("Input reset");
  };

  const handleCvDelete = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus CV/Portofolio Anda?")) {
      if (user?.id) {
        try {
          await updateDoc(doc(db, 'users', user.id), { cvFile: null });
          alert("✅ CV/Portofolio berhasil dihapus!");
        } catch (err) {
          alert("❌ Gagal menghapus CV: " + err.message);
        }
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
  const myPlantingsCount = (plantings || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const myMaintenancesCount = (maintenances || []).length;

  const plantingCoords = (plantings || []).map(p => parseCoords(p.location)).filter(Boolean);
  const latestObservation = myBambooObservations.find(o => o.gps && parseCoords(o.gps));
  const latestObservationCoord = latestObservation ? parseCoords(latestObservation.gps) : null;
  const observationCoords = myBambooObservations.map(v => parseCoords(v.gps)).filter(Boolean);
  const coordsList = [...observationCoords, ...plantingCoords];
  // Direct map to user's LATEST observation first (e.g. Magelang / Central Java)
  const mapCenter = latestObservationCoord || (coordsList.length > 0 ? coordsList[0] : [-7.68370, 110.24223]);

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
    <div style={{ paddingTop: isMobile ? '130px' : '190px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--bg-color)', transition: 'background 0.3s ease' }}>
      <div className="container profile-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 12px' : '0 20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '20px' : '30px', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>
            {t('profile_title')}
          </h1>
          
          {/* Global User Search Bar */}
          <div style={{ position: 'relative', width: isMobile ? '100%' : '320px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={t('profile_search_ph')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 4px 20px rgba(12,166,120,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
                }}
              />
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Dropdown Results List */}
            {searchQuery.trim() && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '100%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                zIndex: 1000,
                maxHeight: '280px',
                overflowY: 'auto',
                padding: '8px'
              }}>
                {isSearching ? (
                  <div style={{ textAlign: 'center', padding: '15px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {t('profile_search_loading')}
                  </div>
                ) : searchResults.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '15px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {t('profile_search_empty')}
                  </div>
                ) : (
                  searchResults.map((u, i) => (
                    <Link
                      key={u.username || i}
                      to={`/portfolio/${u.username.toLowerCase()}`}
                      onClick={() => setSearchQuery('')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: 'var(--text-main)',
                        transition: 'background 0.2s',
                        marginBottom: i < searchResults.length - 1 ? '4px' : 0
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <img
                        src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`}
                        alt={u.name || u.username}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1.5px solid var(--primary)',
                          background: 'var(--bg-secondary)'
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {u.name || u.username}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          @{u.username}
                        </div>
                      </div>
                      <ChevronRight size={14} color="var(--primary)" />
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        
        {/* ======================================================== */}
        {/* 🌟 1. HERO PROFILE CARD (MODERN SOCIAL MEDIA DESIGN)      */}
        {/* ======================================================== */}
        <div style={{ 
          background: 'var(--bg-card)', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          border: '1px solid var(--border-color)', 
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)', 
          marginBottom: '20px' 
        }}>
          {/* Cover Header Banner */}
          <div style={{ 
            height: isMobile ? '130px' : '180px', 
            background: formData.bannerUrl ? `url(${formData.bannerUrl}) center/cover no-repeat` : 'linear-gradient(135deg, #0ca678 0%, #1098ad 45%, #1864ab 100%)',
            position: 'relative',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            transition: 'background 0.3s ease'
          }}>
            {formData.bannerUrl && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.22)', zIndex: 1 }} />
            )}

            {/* Banner Upload Button */}
            <label 
              htmlFor="banner-upload-file" 
              style={{ 
                position: 'relative',
                zIndex: 2,
                background: 'rgba(0,0,0,0.45)', 
                backdropFilter: 'blur(8px)', 
                color: 'white', 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                padding: '6px 14px', 
                borderRadius: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
              title="Pasang atau ganti foto banner sampul profil"
            >
              <Camera size={14} /> {isUploadingBanner ? 'Mengunggah...' : (formData.bannerUrl ? 'Ganti Banner' : 'Pasang Banner')}
            </label>
            <input 
              type="file" 
              id="banner-upload-file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleBannerFileChange} 
            />

            <span style={{ 
              position: 'relative',
              zIndex: 2,
              background: 'rgba(0,0,0,0.35)', 
              backdropFilter: 'blur(8px)', 
              color: 'white', 
              fontSize: '0.72rem', 
              fontWeight: 'bold', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}>
              🌿 BaMbooChain Web3 Profile
            </span>
          </div>

          {/* Profile Header Details */}
          <div style={{ padding: isMobile ? '0 16px 20px 16px' : '0 30px 24px 30px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', flexWrap: 'wrap', gap: '14px' }}>
              
              {/* Avatar & Basic Info */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: isMobile ? '12px' : '20px' }}>
                <div style={{ position: 'relative', marginTop: isMobile ? '-45px' : '-55px', flexShrink: 0 }}>
                  <div style={{ 
                    width: isMobile ? '90px' : '114px', 
                    height: isMobile ? '90px' : '114px', 
                    borderRadius: '50%', 
                    background: 'var(--bg-card)', 
                    overflow: 'hidden', 
                    border: '4px solid var(--bg-card)', 
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {isUploadingAvatar ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '0.65rem' }}>
                        <div style={{ width: '22px', height: '22px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        <span style={{ marginTop: '4px' }}>Upload...</span>
                      </div>
                    ) : (
                      <img 
                        src={formData.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.username || 'user')} 
                        alt="Avatar" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.username || 'user');
                        }}
                      />
                    )}
                  </div>

                  {/* Camera Upload Trigger */}
                  <label 
                    htmlFor="avatar-upload-file"
                    onClick={() => {
                      const input = document.getElementById('avatar-upload-file');
                      if (input) input.click();
                    }}
                    style={{ 
                      position: 'absolute', 
                      bottom: '2px', 
                      right: '2px', 
                      background: 'var(--primary)', 
                      color: 'white', 
                      border: '2.5px solid var(--bg-card)', 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                      zIndex: 3
                    }}
                    title="Pilih Foto Profil dari Galeri"
                  >
                    <Camera size={15} />
                  </label>
                  <input 
                    type="file" 
                    id="avatar-upload-file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleAvatarFileChange} 
                  />
                </div>

                <div style={{ marginBottom: '4px' }}>
                  <h2 style={{ fontSize: isMobile ? '1.3rem' : '1.75rem', fontWeight: '900', margin: '0 0 2px 0', color: 'var(--text-main)', lineHeight: 1.2 }}>
                    {user.name || 'Sultan Bantam'}
                  </h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    @{user.username || 'sultanbantam'}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(12, 166, 120, 0.12)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                      <Shield size={11} /> {user.role === 'admin_yayasan' ? 'Admin Yayasan' : (user.kycStatus === 'verified' ? 'Verified' : 'Member')}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 159, 0, 0.12)', color: '#f59f00', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                      <Award size={11} /> {ecoLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto', marginTop: isMobile ? '6px' : 0 }}>
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  style={{ 
                    flex: isMobile ? 1 : 'none',
                    background: isEditing ? 'var(--primary)' : 'var(--bg-color)', 
                    color: isEditing ? 'white' : 'var(--text-main)', 
                    border: '1px solid var(--border-color)', 
                    padding: '8px 14px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {isEditing ? <><Save size={14} /> Selesai</> : <><Edit3 size={14} /> Edit</>}
                </button>

                <button 
                  onClick={() => setShareModalData({
                    isOpen: true,
                    url: passportLink,
                    title: `Lihat Profil Pegiat Ekosistem Hijau @${user.username || user.name} di BaMbooChain!`,
                    userName: user.name || 'Sultan Bantam',
                    userHandle: user.username || 'sultanbantam',
                    userAvatar: formData.avatarUrl || user.avatarUrl,
                    userBio: formData.bioText || user.bioText,
                    userRole: user.role === 'admin_yayasan' ? 'Admin Yayasan' : 'Forest Guardian'
                  })}
                  style={{ 
                    flex: isMobile ? 1 : 'none',
                    background: 'var(--bg-color)', 
                    color: 'var(--text-main)', 
                    border: '1px solid var(--border-color)', 
                    padding: '8px 14px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Share2 size={14} /> Bagikan
                </button>

                <a 
                  href={passportLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    flex: isMobile ? '1 1 100%' : 'none',
                    background: 'linear-gradient(135deg, #134e4a, #064e3b)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '8px 14px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(6,78,59,0.2)'
                  }}
                >
                  <Eye size={14} /> BambooID Passport
                </a>
              </div>
            </div>

            {/* Bio Section */}
            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Bio Diri:</label>
                  <textarea 
                    name="bioText" 
                    value={formData.bioText} 
                    onChange={handleChange}
                    rows={2}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border-color)', 
                      background: 'var(--bg-color)', 
                      color: 'var(--text-main)', 
                      fontSize: '0.88rem' 
                    }}
                    placeholder="Tuliskan bio atau visi Anda..."
                  />
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', fontStyle: formData.bioText ? 'normal' : 'italic', lineHeight: 1.5 }}>
                  {formData.bioText ? `“${formData.bioText}”` : 'Belum ada bio diri yang ditambahkan.'}
                </p>
              )}

              {/* Meta Quick Row */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>📍 Indonesia</span>
                <span>🕒 Bergabung 2026</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  💼 Web3: <code style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{user.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : '0xcb5f...ef90'}</code>
                  <button onClick={() => { navigator.clipboard.writeText(user.walletAddress || ''); alert('Alamat wallet tersalin!'); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <Copy size={11} />
                  </button>
                </span>
                {(formData.ngopiUsername || user.ngopiUsername) && (
                  <a 
                    href={(formData.ngopiUsername || user.ngopiUsername).startsWith('http') ? (formData.ngopiUsername || user.ngopiUsername) : `https://ngopi.top/@${(formData.ngopiUsername || user.ngopiUsername).replace(/^@/, '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#1864ab', textDecoration: 'none', fontWeight: 'bold' }}
                    title="Buka profil ngopi.top"
                  >
                    ☕ {(formData.ngopiUsername || user.ngopiUsername).startsWith('@') ? (formData.ngopiUsername || user.ngopiUsername) : `@${formData.ngopiUsername || user.ngopiUsername}`}
                  </a>
                )}
                {(formData.bambooChat || user.bambooChat) && (
                  <a 
                    href="https://www.bamboochat.click" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0ca678', textDecoration: 'none', fontWeight: 'bold' }}
                    title="Buka BambooChat"
                  >
                    💬 {(formData.bambooChat || user.bambooChat).startsWith('@') ? (formData.bambooChat || user.bambooChat) : `@${formData.bambooChat || user.bambooChat}`}
                  </a>
                )}
                <button 
                  type="button" 
                  onClick={handleCreateDicebearAvatar}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontSize: '0.75rem', fontWeight: 'bold' }}
                >
                  🎭 Ganti Avatar Acak
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 🌟 2. IMPACT STATS BAR (5 SLEEK METRICS)                 */}
        {/* ======================================================== */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', 
          gap: isMobile ? '8px' : '12px', 
          marginBottom: '20px' 
        }}>
          <div style={{ background: 'var(--bg-card)', padding: isMobile ? '12px' : '16px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: isMobile ? '1.2rem' : '1.45rem', fontWeight: '900', color: 'var(--primary)' }}>
              {myBambooObservations.length}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', marginTop: '2px' }}>
              🌿 Observasi Bambu
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: isMobile ? '12px' : '16px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: isMobile ? '1.2rem' : '1.45rem', fontWeight: '900', color: '#1098ad' }}>
              {myPlantingsCount || 6110}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', marginTop: '2px' }}>
              🎋 Bambu Ditanam
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: isMobile ? '12px' : '16px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: isMobile ? '1.2rem' : '1.45rem', fontWeight: '900', color: '#f59f00' }}>
              {formatBalance(user.bmcBalance)}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', marginTop: '2px' }}>
              💰 BMC Reward
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: isMobile ? '12px' : '16px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: isMobile ? '1.2rem' : '1.45rem', fontWeight: '900', color: '#4c6ef5' }}>
              {myArticlesCount || 31}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', marginTop: '2px' }}>
              📚 Artikel Ilmiah
            </div>
          </div>

          <div style={{ 
            gridColumn: isMobile ? 'span 2' : 'span 1',
            background: 'var(--bg-card)', 
            padding: isMobile ? '12px' : '16px', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)', 
            textAlign: 'center', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)' 
          }}>
            <div style={{ fontSize: isMobile ? '1.2rem' : '1.45rem', fontWeight: '900', color: '#d9480f' }}>
              {statuses.length || 89}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', marginTop: '2px' }}>
              💬 Status & Feed
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 🌟 3. MODERN TAB NAVIGATION BAR                          */}
        {/* ======================================================== */}
        <div style={{ 
          display: 'flex', 
          gap: '6px', 
          background: 'var(--bg-card)', 
          padding: '6px', 
          borderRadius: '16px', 
          border: '1px solid var(--border-color)', 
          marginBottom: '20px',
          overflowX: 'auto',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
        }}>
          {[
            { id: 'observasi', label: `🗺️ Peta & Observasi (${myBambooObservations.length})` },
            { id: 'feed', label: `💬 Status & Feed (${statuses.length})` },
            { id: 'events', label: '🎫 Event & Komunitas' },
            { id: 'account', label: '⚙️ Pengaturan Akun' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: isMobile ? '1 0 auto' : 1,
                padding: isMobile ? '9px 12px' : '11px 18px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                fontSize: isMobile ? '0.76rem' : '0.84rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(12,166,120,0.25)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ======================================================== */}
        {/* 🌟 4. TAB CONTENTS                                       */}
        {/* ======================================================== */}

        {/* TAB 1: PETA & OBSERVASI BAMBU */}
        {activeTab === 'observasi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.25s' }}>
            {/* Interactive Leaflet Map Card */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: isMobile ? '16px' : '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🗺️ Peta Lokasi Aktivitas Hijau & Observasi Bambu
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Otomatis terpusat pada lokasi survei terakhir Anda ({myBambooObservations.length} observasi tercatat)
                  </p>
                </div>
                <span style={{ fontSize: '0.72rem', background: 'rgba(217, 72, 15, 0.1)', color: '#d9480f', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                  📍 Pin Oranye: Observasi Anda
                </span>
              </div>

              <div style={{ height: isMobile ? '280px' : '360px', width: '100%', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '16px', zIndex: 1 }}>
                <MapContainer
                  center={mapCenter}
                  zoom={12}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                  whenReady={(mapInstance) => { setTimeout(() => mapInstance.target.invalidateSize(), 150); }}
                >
                  <MapRecenter center={mapCenter} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Official Conservation Plantings (Green Pins) */}
                  {(plantings || []).map((p, idx) => {
                    const coords = parseCoords(p.location);
                    if (!coords) return null;
                    return (
                      <LeafletMarker key={p.id || idx} position={coords} icon={greenPinIcon}>
                        <LeafletPopup>
                          <div style={{ fontSize: '0.8rem', color: '#212529', lineHeight: 1.4 }}>
                            <strong style={{ color: 'var(--primary)' }}>{p.species || 'Bambu'}</strong><br/>
                            <span>Jumlah: {p.count || 0} rumpun</span><br/>
                            <span>Status: {p.status || 'Planted'}</span><br/>
                            <span style={{ fontSize: '0.72rem', color: '#6c757d' }}>{p.location}</span>
                          </div>
                        </LeafletPopup>
                      </LeafletMarker>
                    );
                  })}

                  {/* User's Contributed Bamboo Observations (Orange Pins) */}
                  {myBambooObservations.map((v, idx) => {
                    const coords = parseCoords(v.gps);
                    if (!coords) return null;
                    const photos = v.uploadedFiles ? Object.values(v.uploadedFiles).filter(Boolean) : [];
                    const firstValidPhoto = photos.find(p => typeof p === 'string' && (p.startsWith('data:image') || p.startsWith('http')));
                    return (
                      <LeafletMarker key={`val-${v.id || idx}`} position={coords} icon={orangePinIcon}>
                        <LeafletPopup>
                          <div style={{ fontSize: '0.8rem', color: '#212529', lineHeight: 1.4, minWidth: '180px', maxWidth: '240px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                              <strong style={{ color: '#d9480f' }}>🌿 {v.title || 'Observasi Bambu'}</strong>
                              <span style={{ 
                                fontSize: '0.65rem', 
                                padding: '2px 6px', 
                                borderRadius: '6px', 
                                background: v.status === 'approved' ? '#d3f9d8' : '#fff3bf',
                                color: v.status === 'approved' ? '#2b8a3e' : '#e67700',
                                fontWeight: 'bold' 
                              }}>
                                {v.status === 'approved' ? 'Terverifikasi' : 'Pending'}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#6c757d' }}>📍 {v.gps}</span><br/>
                            {v.details?.jmlRebung && <span style={{ fontSize: '0.75rem' }}>🌱 Rebung: <b>{v.details.jmlRebung}</b><br/></span>}
                            {v.details?.pemilik && <span style={{ fontSize: '0.75rem' }}>👤 Pemilik: {v.details.pemilik}<br/></span>}
                            {v.tags && <div style={{ fontSize: '0.7rem', color: '#495057', marginTop: '2px' }}>🏷️ {v.tags}</div>}
                            {firstValidPhoto && (
                              <div style={{ marginTop: '8px' }}>
                                <img 
                                  src={firstValidPhoto} 
                                  alt="Foto Lapangan" 
                                  onClick={() => setLightboxImage(firstValidPhoto)}
                                  style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ced4da', cursor: 'pointer' }} 
                                />
                              </div>
                            )}
                          </div>
                        </LeafletPopup>
                      </LeafletMarker>
                    );
                  })}

                  {coordsList.length === 0 && (
                    <LeafletMarker position={mapCenter} icon={greenPinIcon}>
                      <LeafletPopup>
                        <div style={{ fontSize: '0.8rem', color: '#212529', lineHeight: 1.4 }}>
                          <strong style={{ color: 'var(--primary)' }}>Area Konservasi Cibarani</strong><br/>
                          <span>Lokasi demonstrasi penanaman bambu lestari.</span>
                        </div>
                      </LeafletPopup>
                    </LeafletMarker>
                  )}
                </MapContainer>
              </div>

              {/* Action shortcuts */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => window.location.hash = "/bambupedia/tracker"}
                  style={{ flex: 1, minWidth: '120px', background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 14px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
                >
                  🌿 Input Observasi Baru
                </button>
                <button 
                  onClick={() => window.location.hash = "/bamboochain/invest"}
                  style={{ flex: 1, minWidth: '120px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
                >
                  🎋 Dukung Penanaman
                </button>
                <button 
                  onClick={() => window.location.hash = "/bambupedia/tracker"}
                  style={{ flex: 1, minWidth: '120px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
                >
                  🔍 Buka Tracker Bambu
                </button>
              </div>
            </div>

            {/* Clump Observation Cards - SORTED LATEST ON TOP */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: isMobile ? '16px' : '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🌿 Data Observasi & Foto Lapangan Saya ({myBambooObservations.length})
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Urutan teratas adalah aktivitas survei terbaru Anda
                  </p>
                </div>
                <span style={{ fontSize: '0.72rem', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                  {myBambooObservations.filter(o => o.status === 'approved').length} Terverifikasi • {myBambooObservations.filter(o => o.status === 'pending').length} Menunggu
                </span>
              </div>

              {myBambooObservations.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Belum ada data observasi bambu yang dicatat. Klik tombol di atas untuk mulai mendata rumpun bambu!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {myBambooObservations.map((val, vIdx) => {
                    const photos = val.uploadedFiles ? Object.entries(val.uploadedFiles) : [];
                    const isApproved = val.status === 'approved';
                    return (
                      <div key={val.id || vIdx} style={{ background: 'var(--bg-color)', borderRadius: '18px', padding: isMobile ? '14px' : '18px', border: '1px solid var(--border-color)' }}>
                        
                        {/* Header Clump */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                          <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.98rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                              {val.title || 'Observasi Rumpun Bambu'}
                            </h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              🕒 {val.date ? new Date(val.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Tersimpan'}
                              {val.gps && (
                                <> • 📍 <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(val.gps)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>{val.gps}</a></>
                              )}
                            </span>
                          </div>

                          <span style={{ 
                            fontSize: '0.72rem', 
                            padding: '4px 10px', 
                            borderRadius: '20px', 
                            background: isApproved ? '#d3f9d8' : '#fff3bf',
                            color: isApproved ? '#2b8a3e' : '#e67700',
                            fontWeight: 'bold'
                          }}>
                            {isApproved ? '✅ Terverifikasi' : '⏳ Menunggu Validasi'}
                          </span>
                        </div>

                        {/* Details */}
                        {val.details && (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-main)', marginBottom: '10px' }}>
                            {val.details.jmlRebung && <span style={{ background: 'var(--bg-card)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>🌱 Rebung: <b>{val.details.jmlRebung}</b></span>}
                            {val.details.pemilik && <span style={{ background: 'var(--bg-card)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>👤 Pemilik: <b>{val.details.pemilik}</b></span>}
                            {val.details.aksesJalan && <span style={{ background: 'var(--bg-card)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>🛣️ Akses: <b>{val.details.aksesJalan}</b></span>}
                          </div>
                        )}

                        {/* Tags */}
                        {val.tags && (
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' }}>
                            {val.tags.split(',').map((tg, tIdx) => (
                              <span key={tIdx} style={{ fontSize: '0.68rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '10px', color: 'var(--text-muted)' }}>
                                #{tg.trim()}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Photos Grid */}
                        {photos.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px' }}>
                              📸 Dokumentasi Lapangan ({photos.length} Foto — klik untuk perbesar):
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(65px, 1fr))' : 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
                              {photos.map(([key, photoData], pIdx) => {
                                const isBlob = typeof photoData === 'string' && photoData.startsWith('blob:');
                                return (
                                  <div 
                                    key={pIdx} 
                                    onClick={() => {
                                      if (!isBlob) {
                                        setLightboxImage(photoData);
                                      } else {
                                        alert("ℹ️ Foto ini diambil pada sesi survei sebelumnya dalam cache browser sementara dan telah kedaluwarsa. Pada pembaruan terbaru, seluruh foto survei Anda kini otomatis tersimpan permanen.");
                                      }
                                    }}
                                    style={{ 
                                      aspectRatio: '1/1', 
                                      borderRadius: '10px', 
                                      overflow: 'hidden', 
                                      border: '1px solid var(--border-color)', 
                                      cursor: 'pointer',
                                      position: 'relative',
                                      background: 'var(--bg-card)'
                                    }}
                                  >
                                    {isBlob ? (
                                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <Camera size={18} color="#868e96" />
                                        <span style={{ fontSize: '0.52rem', marginTop: '2px', lineHeight: 1.1 }}>{key.replace('_', ' ')}</span>
                                        <span style={{ fontSize: '0.48rem', color: '#f59f00', marginTop: '1px' }}>Sesi Lalu</span>
                                      </div>
                                    ) : (
                                      <>
                                        <img 
                                          src={photoData} 
                                          alt={key} 
                                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s' }} 
                                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                        <span style={{ 
                                          position: 'absolute', 
                                          bottom: 0, 
                                          left: 0, 
                                          right: 0, 
                                          background: 'rgba(0,0,0,0.65)', 
                                          color: 'white', 
                                          fontSize: '0.52rem', 
                                          textAlign: 'center', 
                                          padding: '1px 2px',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap'
                                        }}>
                                          {key.replace('_', ' ')}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: STATUS & FEED */}
        {activeTab === 'feed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.25s' }}>
            {/* Status Update Form */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: isMobile ? '16px' : '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit3 size={16} color="var(--primary)" /> Buat Status Baru
              </h3>
              
              <form onSubmit={handleStatusSubmit}>
                <textarea
                  name="statusText"
                  value={formData.statusText}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Apa kabar ekosistem bambu hari ini? Bagikan perkembangan atau wawasan..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: 1.5,
                    marginBottom: '10px'
                  }}
                />

                {/* Media Preview Grid */}
                {formData.statusPhotos && formData.statusPhotos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                    {formData.statusPhotos.map((p, idx) => (
                      <div key={idx} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <img src={p} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, statusPhotos: prev.statusPhotos.filter((_, i) => i !== idx) }))}
                          style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Video Preview */}
                {formData.statusVideo && (
                  <div style={{ position: 'relative', marginBottom: '12px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <video src={formData.statusVideo} controls style={{ width: '100%', maxHeight: '200px', background: '#000' }} />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, statusVideo: '' }))}
                      style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {/* Bottom Tools & Submit */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <label 
                      htmlFor="status-photo-upload" 
                      style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '500' }}
                    >
                      <Camera size={14} color="var(--primary)" /> Foto
                    </label>
                    <input 
                      id="status-photo-upload" 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      style={{ display: 'none' }} 
                      onChange={handlePhotoUpload} 
                    />

                    <label 
                      htmlFor="status-video-upload" 
                      style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '500' }}
                    >
                      <PlayCircle size={14} color="#1864ab" /> Video
                    </label>
                    <input 
                      id="status-video-upload" 
                      type="file" 
                      accept="video/*" 
                      style={{ display: 'none' }} 
                      onChange={handleVideoUpload} 
                    />

                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-main)' }}
                    >
                      <Smile size={14} color="#f59f00" />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploadingMedia || (!formData.statusText.trim() && (!formData.statusPhotos || formData.statusPhotos.length === 0) && !formData.statusVideo)}
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: (isUploadingMedia || (!formData.statusText.trim() && (!formData.statusPhotos || formData.statusPhotos.length === 0) && !formData.statusVideo)) ? 0.6 : 1
                    }}
                  >
                    <Send size={14} /> {isUploadingMedia ? 'Mengunggah...' : 'Bagikan'}
                  </button>
                </div>

                {showEmojiPicker && (
                  <div style={{ position: 'relative', marginTop: '10px', zIndex: 100 }}>
                    <EmojiPicker onEmojiClick={onEmojiClick} width="100%" height={320} />
                  </div>
                )}
              </form>
            </div>

            {/* Status Feed List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  Riwayat Status ({statuses.length})
                </h4>
              </div>

              {statuses.length === 0 ? (
                <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '30px', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                  Belum ada status yang dipublikasikan. Tulis status pertama Anda di atas!
                </div>
              ) : (
                <>
                  {statuses.slice(0, statusLimit).map((st) => (
                    <div key={st.id} style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: isMobile ? '16px' : '20px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      {/* Author row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img 
                            src={user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.username} 
                            alt={user.name} 
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} 
                          />
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '0.88rem', color: 'var(--text-main)' }}>{user.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {new Date(st.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleDeleteStatus(st.id)}
                          style={{ background: 'none', border: 'none', color: '#fa5252', cursor: 'pointer', padding: '4px' }}
                          title="Hapus Status"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Content */}
                      <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {st.statusText}
                      </p>

                      {/* Photos */}
                      {st.statusPhotos && st.statusPhotos.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: st.statusPhotos.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                          {st.statusPhotos.map((photo, pIdx) => (
                            <div key={pIdx} onClick={() => setLightboxImage(photo)} style={{ aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}>
                              <img src={photo} alt="status" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Video */}
                      {st.statusVideo && (
                        <div style={{ marginBottom: '12px', borderRadius: '12px', overflow: 'hidden' }}>
                          <video src={st.statusVideo} controls style={{ width: '100%', maxHeight: '240px', background: '#000' }} />
                        </div>
                      )}

                      {/* Interactions bar */}
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <button onClick={() => handleLike(st)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: (st.likes || []).includes(user.id) ? '#fa5252' : 'var(--text-muted)' }}>
                          <Heart size={15} fill={(st.likes || []).includes(user.id) ? '#fa5252' : 'none'} /> {(st.likes || []).length}
                        </button>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageSquare size={15} /> {(st.comments || []).length}
                        </span>
                        <button onClick={() => handleShare(st)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                          <Share2 size={15} /> Bagikan
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {statuses.length > 3 && (
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                      {statusLimit < statuses.length && (
                        <button
                          onClick={() => setStatusLimit(prev => Math.min(prev + 5, statuses.length))}
                          style={{ background: 'var(--bg-card)', color: 'var(--primary)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Lihat 5 Status Lagi
                        </button>
                      )}
                      {statusLimit < statuses.length ? (
                        <button
                          onClick={() => setStatusLimit(statuses.length)}
                          style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Lihat Semua ({statuses.length})
                        </button>
                      ) : (
                        <button
                          onClick={() => setStatusLimit(3)}
                          style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          ▲ Ciutkan Status
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: EVENT & KOMUNITAS */}
        {activeTab === 'events' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.25s' }}>
            {/* Event History Card */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: isMobile ? '16px' : '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="var(--primary)" /> Riwayat Event Ekosistem ({userEvents.length})
                </h3>
                <Link to="/events" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                  Jelajahi Event &gt;
                </Link>
              </div>

              {userEvents.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Belum ada riwayat event yang diikuti. Kunjungi kalender event untuk bergabung!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {userEvents.slice(0, eventLimit).map((ev, idx) => (
                    <div key={ev.id || idx} style={{ background: 'var(--bg-color)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)', display: 'block' }}>
                          {ev.title || 'Event BaMbooChain'}
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          🕒 {ev.date || 'Terjadwal'} • 📍 {ev.location || 'Online/Hybrid'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '8px', fontWeight: 'bold' }}>
                        Peserta
                      </span>
                    </div>
                  ))}
                  {userEvents.length > 3 && (
                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                      {eventLimit < userEvents.length ? (
                        <button onClick={() => setEventLimit(userEvents.length)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer' }}>
                          Lihat Semua Event ({userEvents.length})
                        </button>
                      ) : (
                        <button onClick={() => setEventLimit(3)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer' }}>
                          ▲ Ciutkan
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Referral Program Card */}
            <div style={{ background: 'linear-gradient(135deg, #1864ab, #0b7285)', borderRadius: '24px', padding: isMobile ? '20px' : '26px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 30px rgba(24,100,171,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Share2 size={18} /> Program Referral Hijau
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
                    Dapatkan bonus <b>0.5 BMC</b> untuk setiap pengguna baru yang mendaftar dan verifikasi KYC lewat tautan Anda.
                  </p>
                </div>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                  {referralCode}
                </span>
              </div>

              <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {referralLink}
                </span>
                <button
                  onClick={copyReferral}
                  style={{
                    background: copied ? 'var(--primary)' : 'white',
                    color: copied ? 'white' : '#1864ab',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  {copied ? 'Tersalin!' : 'Salin'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PENGATURAN AKUN */}
        {activeTab === 'account' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.25s' }}>
            {/* Account Info Form Card */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: isMobile ? '16px' : '26px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  👤 Informasi Akun & Keamanan
                </h3>
                {isEditing ? (
                  <button onClick={handleSave} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Save size={14} /> Simpan Perubahan
                  </button>
                ) : (
                  <button onClick={() => setIsEditing(true)} style={{ background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>
                    Edit Akun
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>Nama Lengkap</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                    />
                  ) : (
                    <div style={{ padding: '10px 12px', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.88rem' }}>
                      {user.name || 'Member'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>Username / Handle</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="username" 
                      value={formData.username} 
                      onChange={handleChange} 
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                    />
                  ) : (
                    <div style={{ padding: '10px 12px', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.88rem' }}>
                      @{user.username || 'user'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>Alamat Email</label>
                  <div style={{ padding: '10px 12px', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.88rem' }}>
                    {user.email || 'Belum terdaftar'}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>Nomor WhatsApp / HP</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                      placeholder="0812xxxxxxxx"
                    />
                  ) : (
                    <div style={{ padding: '10px 12px', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.88rem' }}>
                      {user.phone || 'Belum diisi'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>☕ Akun ngopi.top</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="ngopiUsername" 
                      value={formData.ngopiUsername} 
                      onChange={handleChange} 
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                      placeholder="@sultanbantam atau username ngopi"
                    />
                  ) : (
                    <div style={{ padding: '10px 12px', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{user.ngopiUsername ? (user.ngopiUsername.startsWith('@') ? user.ngopiUsername : `@${user.ngopiUsername}`) : 'Belum dihubungkan'}</span>
                      {user.ngopiUsername && (
                        <a 
                          href={user.ngopiUsername.startsWith('http') ? user.ngopiUsername : `https://ngopi.top/@${user.ngopiUsername.replace(/^@/, '')}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.75rem', color: '#1864ab', textDecoration: 'none', fontWeight: 'bold' }}
                        >
                          Buka ngopi.top ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>💬 Akun BambooChat</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="bambooChat" 
                      value={formData.bambooChat} 
                      onChange={handleChange} 
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                      placeholder="Nickname Anda di BambooChat"
                    />
                  ) : (
                    <div style={{ padding: '10px 12px', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{user.bambooChat ? (user.bambooChat.startsWith('@') ? user.bambooChat : `@${user.bambooChat}`) : 'Belum dihubungkan'}</span>
                      {user.bambooChat && (
                        <a 
                          href="https://www.bamboochat.click" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.75rem', color: '#0ca678', textDecoration: 'none', fontWeight: 'bold' }}
                        >
                          Buka Chat ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Wallet Address Row */}
              <div style={{ marginTop: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>Alamat Dompet Web3 (BMC On-Chain)</label>
                <div style={{ padding: '10px 12px', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.walletAddress || '0xcb5f5774661818fd0cb47debbb579591ca03ef90'}</span>
                  <button onClick={() => { navigator.clipboard.writeText(user.walletAddress || ''); alert('Alamat wallet tersalin!'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              {/* Device Notifications */}
              <div style={{ marginTop: '14px', padding: '12px 14px', background: 'var(--bg-color)', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Notifikasi Perangkat</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Menerima pembaruan validasi data dan airdrop langsung ke layar Anda</span>
                </div>
                <button 
                  onClick={handleEnableNotifications}
                  style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Bell size={13} /> Aktifkan
                </button>
              </div>
            </div>

            {/* CV & Portofolio Dokumen Card */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: isMobile ? '16px' : '26px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '8px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--primary)" /> CV / Dokumen Portofolio
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '14px', fontSize: '0.78rem', lineHeight: 1.5 }}>
                Dokumen CV atau sertifikat keahlian Anda untuk memvalidasi kredibilitas ekosistem.
              </p>

              {user.cvFile ? (
                <div style={{ background: 'var(--bg-color)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <FileText size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <div style={{ overflow: 'hidden' }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {user.cvFile.name || 'CV_SultanBantam.pdf'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {user.cvFile.type?.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => {
                        if (user.cvFile.url) {
                          window.open(user.cvFile.url, '_blank');
                        } else if (user.cvFile.data) {
                          const dataURI = user.cvFile.data;
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
                          link.download = user.cvFile.name || 'CV.pdf';
                          link.click();
                          setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
                        } else {
                          alert('Dokumen tidak ditemukan.');
                        }
                      }}
                      style={{ background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Unduh
                    </button>
                    <button 
                      onClick={handleCvDelete}
                      style={{ background: 'rgba(250,82,82,0.1)', color: '#fa5252', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                      title="Hapus CV"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <button 
                    onClick={() => document.getElementById('cv-file-input').click()}
                    style={{ width: '100%', background: 'rgba(12,166,120,0.04)', color: 'var(--primary)', border: '1px dashed var(--primary)', borderRadius: '14px', padding: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <UploadCloud size={24} />
                    <span style={{ fontSize: '0.8rem' }}>Unggah Dokumen CV / Portofolio</span>
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
          </div>
        )}

      </div>

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

      {/* Share Modal */}
      {shareModalData.isOpen && (
        <ShareModal 
          isOpen={shareModalData.isOpen}
          onClose={() => setShareModalData(prev => ({ ...prev, isOpen: false }))}
          url={shareModalData.url}
          title={shareModalData.title}
          userName={shareModalData.userName}
          userHandle={shareModalData.userHandle}
          userAvatar={shareModalData.userAvatar}
          userBio={shareModalData.userBio}
          userRole={shareModalData.userRole}
        />
      )}
    </div>
  );
};

export default ProfilePage;
