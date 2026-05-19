import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Share2, Send, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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

const SocialInteractions = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const pageId = location.pathname.replace(/\//g, '_') || 'home';
  
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Load Likes and Comments
  useEffect(() => {
    if (!pageId) return;

    // Listen to likes count
    const statsRef = doc(db, 'page_stats', pageId);
    const unsubStats = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        setLikes(docSnap.data().likes || 0);
      } else {
        setLikes(0);
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
        const likeRef = doc(db, 'page_likes', `${user.uid}_${pageId}`);
        const likeSnap = await getDocs(query(collection(db, 'page_likes'), where('userId', '==', user.uid), where('pageId', '==', pageId)));
        setHasLiked(!likeSnap.empty);
      };
      checkLike();
    }

    return () => {
      unsubStats();
      unsubComments();
    };
  }, [pageId, user]);

  const handleLike = async () => {
    if (!isAuthenticated || !user) return;
    
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
    if (!newComment.trim() || !user) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'page_comments'), {
        pageId,
        userId: user.uid,
        userName: user.displayName || 'User',
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'BaMbooChain',
        text: 'Lihat halaman menarik ini di BaMbooChain!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert("Link disalin ke clipboard!");
    }
  };

  // Don't show on admin or login-related technical paths if needed, 
  // but user said "every page".
  if (!isAuthenticated) return null;

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
            <Heart size={24} fill={hasLiked ? '#fa5252' : 'none'} /> {likes} Suka
          </button>
          
          <button onClick={() => setShowComments(!showComments)} style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold'
          }}>
            <MessageSquare size={24} /> {comments.length} Komentar
          </button>

          <button onClick={handleShare} style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold'
          }}>
            <Share2 size={24} /> Bagikan
          </button>
        </div>

        {showComments && (
          <div style={{ 
            background: 'var(--bg-card)', padding: '25px', borderRadius: '24px', 
            border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ margin: 0 }}>Komentar Komunitas</h4>
              <button onClick={() => setShowComments(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
              <input 
                type="text" 
                placeholder="Tulis pendapat Anda..." 
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
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>{c.userName}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{c.text}</div>
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
    </div>
  );
};

export default SocialInteractions;
