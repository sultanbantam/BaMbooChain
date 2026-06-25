import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Share2, Send, X, Gift, Smile, Trash2, Edit2 } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp, 
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  increment
} from 'firebase/firestore';
import { db } from '../firebase/config';
import ShareModal from './ShareModal';

const SocialInteractions = ({ entityId }) => {
  const { user, isAuthenticated, openLoginModal, giftBmc } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const pageId = entityId || location.pathname.replace(/\//g, '_') || 'home';
  
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  // New States for Tipping and Sharing
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGiftFormActive, setIsGiftFormActive] = useState(false);
  const [giftAmount, setGiftAmount] = useState('5');
  const [giftsCount, setGiftsCount] = useState(0);
  const [giftingInProgress, setGiftingInProgress] = useState(false);
  const [adminRecipient, setAdminRecipient] = useState(null);

  // Resolve Admin Recipient once on mount
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const usersRef = collection(db, "users");
        const q1 = query(usersRef, where("username", "==", "albantani"));
        const snap1 = await getDocs(q1);
        if (!snap1.empty) {
          setAdminRecipient({
            uid: snap1.docs[0].id,
            name: snap1.docs[0].data().name || "albantani",
            username: "albantani"
          });
          return;
        }
        const q2 = query(usersRef, where("username", "==", "admin_yayasan"));
        const snap2 = await getDocs(q2);
        if (!snap2.empty) {
          setAdminRecipient({
            uid: snap2.docs[0].id,
            name: snap2.docs[0].data().name || "Yayasan",
            username: "admin_yayasan"
          });
          return;
        }
        // Fallback
        setAdminRecipient({
          uid: "admin_default_id",
          name: "Yayasan",
          username: "admin_yayasan"
        });
      } catch (err) {
        console.error("Error fetching admin for SocialInteractions:", err);
      }
    };
    fetchAdmin();
  }, []);

  // Load Likes, Comments, and Gifts Count
  useEffect(() => {
    if (!pageId) return;

    // Listen to page stats (likes, gifts)
    const statsRef = doc(db, 'page_stats', pageId);
    const unsubStats = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLikes(data.likes || 0);
        setGiftsCount(data.gifts || 0);
      } else {
        setLikes(0);
        setGiftsCount(0);
      }
    });

    // Listen to comments
    const q = query(
      collection(db, 'page_comments'),
      where('pageId', '==', pageId)
    );
    const unsubComments = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setComments(docs.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds));
    });

    // Check if user has liked
    if (user) {
      const checkLike = async () => {
        const likeSnap = await getDocs(query(collection(db, 'page_likes'), where('userId', '==', user.uid), where('pageId', '==', pageId)));
        setHasLiked(!likeSnap.empty);
      };
      checkLike();
    } else {
      setHasLiked(false);
    }

    return () => {
      unsubStats();
      unsubComments();
    };
  }, [pageId, user]);

  const handleLike = async () => {
    if (!isAuthenticated || !user) {
      alert("⚠️ Harap login terlebih dahulu untuk memberikan Suka!");
      openLoginModal();
      return;
    }
    
    const likeId = `${user.uid}_${pageId}`;
    const statsRef = doc(db, 'page_stats', pageId);
    const likeRef = doc(db, 'page_likes', likeId);

    try {
      if (hasLiked) {
        // Unlike
        await deleteDoc(likeRef);
        await setDoc(statsRef, { likes: increment(-1) }, { merge: true });
        setHasLiked(false);
      } else {
        // Like
        await setDoc(likeRef, { userId: user.uid, pageId, timestamp: serverTimestamp() });
        await setDoc(statsRef, { likes: increment(1) }, { merge: true });
        setHasLiked(true);
      }
    } catch (err) {
      console.error("Social Error:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert("⚠️ Harap login terlebih dahulu untuk menulis komentar!");
      openLoginModal();
      return;
    }
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'page_comments'), {
        pageId,
        userId: user.uid,
        userName: user.displayName || user.username || 'User',
        userAvatar: user.photoURL || null,
        text: newComment,
        timestamp: serverTimestamp()
      });
      setNewComment('');
    } catch (err) {
      console.error("Comment Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
      try {
        await deleteDoc(doc(db, 'page_comments', commentId));
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  const submitEditComment = async (e, commentId) => {
    e.preventDefault();
    if (!editCommentText.trim()) return;
    try {
      await setDoc(doc(db, 'page_comments', commentId), { text: editCommentText }, { merge: true });
      setEditingCommentId(null);
    } catch (err) {
      console.error("Edit Error:", err);
    }
  };

  const handleSendGift = async (amount) => {
    if (!isAuthenticated || !user) {
      alert("⚠️ Harap login terlebih dahulu untuk mengirimkan Gift!");
      openLoginModal();
      return;
    }
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      alert("⚠️ Jumlah gift tidak valid!");
      return;
    }
    if (!adminRecipient) {
      alert("⚠️ Gagal menemukan penerima gift. Silakan coba lagi.");
      return;
    }
    if (user.uid === adminRecipient.uid) {
      alert("⚠️ Anda tidak bisa mengirimkan Gift ke diri sendiri!");
      return;
    }

    setGiftingInProgress(true);
    try {
      const success = await giftBmc(
        adminRecipient.uid,
        adminRecipient.username,
        val,
        `Gift Halaman: ${pageId}`
      );

      if (success) {
        // Increment gifts count in page_stats
        const statsRef = doc(db, 'page_stats', pageId);
        await setDoc(statsRef, { gifts: increment(1) }, { merge: true });

        // Add a doc in page_gifts to log the gift details
        await addDoc(collection(db, 'page_gifts'), {
          pageId,
          senderId: user.uid,
          senderName: user.displayName || user.username || 'User',
          amount: val,
          timestamp: serverTimestamp()
        });

        setIsGiftFormActive(false);
      }
    } catch (err) {
      console.error("Gift error in SocialInteractions:", err);
    } finally {
      setGiftingInProgress(false);
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  // We show it to all users (unauthenticated too) to make it interactive globally
  return (
    <div style={{
      padding: '40px 20px',
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      marginTop: '40px'
    }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
          <button onClick={handleLike} style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
            color: hasLiked ? '#fa5252' : 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold'
          }}>
            <Heart size={24} fill={hasLiked ? '#fa5252' : 'none'} /> {likes} {t('action_like')}
          </button>
          
          <button onClick={() => setShowComments(!showComments)} style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold'
          }}>
            <MessageSquare size={24} /> {comments.length} {t('action_comment')}
          </button>

          <button onClick={handleShare} style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold'
          }}>
            <Share2 size={24} /> {t('action_share')}
          </button>

          <button onClick={() => setIsGiftFormActive(!isGiftFormActive)} style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold'
          }}>
            <Gift size={24} color="#f59f00" /> {giftsCount} {t('action_gift')}
          </button>
        </div>

        {/* Collapsible Tipping/Gift Form */}
        {isGiftFormActive && (
          <div style={{
            background: 'var(--bg-card)', padding: '25px', borderRadius: '24px', 
            border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gift size={20} color="#f59f00" /> Kirim Apresiasi Token (Gift)
              </h4>
              <button onClick={() => setIsGiftFormActive(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
              Pilih jumlah BMC Token yang ingin dikirimkan sebagai bentuk apresiasi untuk halaman ini:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {["1", "5", "10", "25"].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setGiftAmount(amt)}
                  style={{
                    background: giftAmount === amt ? 'var(--primary)' : 'rgba(0,0,0,0.02)',
                    color: giftAmount === amt ? 'white' : 'var(--text-main)',
                    border: giftAmount === amt ? 'none' : '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 0',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {amt} BMC
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                value={giftAmount}
                onChange={(e) => setGiftAmount(e.target.value)}
                placeholder="Jumlah kustom..."
                style={{
                  flex: 1, padding: '12px 20px', borderRadius: '15px', border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)', color: 'var(--text-main)', outline: 'none'
                }}
              />
              <button
                disabled={giftingInProgress}
                onClick={() => handleSendGift(giftAmount)}
                style={{
                  padding: '12px 25px', borderRadius: '15px', border: 'none',
                  background: '#f59f00', color: 'white', cursor: 'pointer',
                  fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                {giftingInProgress ? 'Mengirim...' : 'Kirim Gift'}
              </button>
            </div>
          </div>
        )}

        {showComments && (
          <div style={{ 
            background: 'var(--bg-card)', padding: '25px', borderRadius: '24px', 
            border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ margin: 0 }}>Komentar Komunitas</h4>
              <button onClick={() => setShowComments(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ position: 'relative' }}>
              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px', marginBottom: '25px', position: 'relative' }}>
                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '15px', padding: '0 15px', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <Smile size={20} />
                </button>
                <input 
                  type="text" 
                  placeholder={isAuthenticated ? "Tulis pendapat Anda..." : "Login untuk berkomentar..."} 
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  style={{ 
                    flex: 1, padding: '12px 20px', borderRadius: '15px', border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)', color: 'var(--text-main)', outline: 'none'
                  }} 
                />
                <button disabled={loading} type="submit" style={{ 
                  padding: '12px 20px', borderRadius: '15px', border: 'none', 
                  background: 'var(--primary)', color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Send size={20} />
                </button>
              </form>
              {showEmojiPicker && (
                <div style={{ position: 'absolute', bottom: '100%', left: 0, zIndex: 10 }}>
                  <EmojiPicker onEmojiClick={(emojiData) => setNewComment(prev => prev + emojiData.emoji)} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
              {comments.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ 
                    width: '35px', height: '35px', borderRadius: '50%', background: 'var(--primary)', 
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 'bold', flexShrink: 0
                  }}>
                    {c.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', padding: '12px 18px', borderRadius: '18px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{c.userName}</div>
                      {user && (user.uid === c.userId || user.username === 'albantani' || user.role === 'admin') && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => { setEditingCommentId(c.id); setEditCommentText(c.text); }} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 0 }}><Edit2 size={14} /></button>
                          <button onClick={() => handleDeleteComment(c.id)} style={{ background: 'none', border: 'none', color: '#fa5252', cursor: 'pointer', padding: 0 }}><Trash2 size={14} /></button>
                        </div>
                      )}
                    </div>
                    {editingCommentId === c.id ? (
                      <form onSubmit={(e) => submitEditComment(e, c.id)} style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                        <input type="text" value={editCommentText} onChange={e => setEditCommentText(e.target.value)} style={{ flex: 1, padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.9rem' }} />
                        <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>Simpan</button>
                        <button type="button" onClick={() => setEditingCommentId(null)} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>Batal</button>
                      </form>
                    ) : (
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{c.text}</div>
                    )}
                    <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '6px' }}>
                      {c.timestamp?.seconds ? new Date(c.timestamp.seconds * 1000).toLocaleString() : 'Baru saja'}
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Belum ada komentar. Jadilah yang pertama!</div>
              )}
            </div>
          </div>
        )}
      </div>

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={window.location.href}
        shareTitle="Lihat halaman menarik ini di BaMbooChain!"
      />
    </div>
  );
};

export default SocialInteractions;
