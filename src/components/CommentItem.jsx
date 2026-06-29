import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Share2, Send, X, Gift, Smile, Trash2, Edit2, UserPlus, UserCheck } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, deleteDoc, doc, getDocs, setDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';

const CommentItem = ({ comment, user, isAuthenticated, openLoginModal, giftBmc, handleDeleteComment, submitEditComment }) => {
  const [likes, setLikes] = useState(comment.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);
  
  const [replies, setReplies] = useState([]);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  
  const [reactions, setReactions] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [isGiftFormActive, setIsGiftFormActive] = useState(false);
  const [giftAmount, setGiftAmount] = useState('5');
  const [giftingInProgress, setGiftingInProgress] = useState(false);
  
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState('');

  useEffect(() => {
    // Listen to likes if user is logged in
    if (user) {
      const checkLike = async () => {
        const likeSnap = await getDocs(query(collection(db, 'comment_likes'), where('userId', '==', user.uid || user.id), where('commentId', '==', comment.id)));
        setHasLiked(!likeSnap.empty);
      };
      checkLike();
    }

    // Listen to replies
    const qReplies = query(collection(db, 'comment_replies'), where('commentId', '==', comment.id));
    const unsubReplies = onSnapshot(qReplies, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setReplies(docs.sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds));
    });

    // Listen to reactions
    const qReactions = query(collection(db, 'comment_reactions'), where('commentId', '==', comment.id));
    const unsubReactions = onSnapshot(qReactions, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setReactions(docs);
    });

    return () => {
      unsubReplies();
      unsubReactions();
    };
  }, [comment.id, user]);

  const handleLike = async () => {
    if (!isAuthenticated || !user) {
      openLoginModal();
      return;
    }
    const userId = user.id || user.uid;
    const likeId = `${userId}_${comment.id}`;
    const commentRef = doc(db, 'page_comments', comment.id);
    const likeRef = doc(db, 'comment_likes', likeId);

    try {
      if (hasLiked) {
        await deleteDoc(likeRef);
        await setDoc(commentRef, { likesCount: increment(-1) }, { merge: true });
        setHasLiked(false);
        setLikes(prev => Math.max(0, prev - 1));
      } else {
        await setDoc(likeRef, { userId, commentId: comment.id, timestamp: serverTimestamp() });
        await setDoc(commentRef, { likesCount: increment(1) }, { merge: true });
        setHasLiked(true);
        setLikes(prev => prev + 1);
      }
    } catch (err) {
      console.error("Like Error:", err);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      openLoginModal();
      return;
    }
    if (!newReply.trim()) return;
    setLoadingReply(true);
    try {
      await addDoc(collection(db, 'comment_replies'), {
        commentId: comment.id,
        userId: user.id || user.uid,
        userName: user.displayName || user.username || 'User',
        userAvatar: user.photoURL || null,
        text: newReply,
        timestamp: serverTimestamp()
      });
      setNewReply('');
      setShowReplyForm(false);
      setShowReplies(true);
    } catch (err) {
      console.error("Reply Error:", err);
    } finally {
      setLoadingReply(false);
    }
  };

  const handleSendGift = async () => {
    if (!isAuthenticated || !user) {
      openLoginModal();
      return;
    }
    const val = parseFloat(giftAmount);
    if (isNaN(val) || val <= 0) return;
    const userId = user.id || user.uid;
    if (userId === comment.userId) {
      alert("⚠️ Anda tidak bisa mengirimkan Gift ke diri sendiri!");
      return;
    }

    setGiftingInProgress(true);
    try {
      const success = await giftBmc(comment.userId, comment.userName, val, `Gift Komentar: ${comment.text.substring(0,20)}...`);
      if (success) {
        await setDoc(doc(db, 'page_comments', comment.id), { giftsCount: increment(1) }, { merge: true });
        await addDoc(collection(db, 'comment_gifts'), {
          commentId: comment.id, senderId: userId, recipientId: comment.userId, amount: val, timestamp: serverTimestamp()
        });
        setIsGiftFormActive(false);
        alert(`Berhasil mengirim ${val} BMC ke ${comment.userName}!`);
      }
    } catch (err) {
      console.error("Gift error:", err);
    } finally {
      setGiftingInProgress(false);
    }
  };

  const handleReaction = async (emojiData) => {
    if (!isAuthenticated || !user) {
      openLoginModal();
      return;
    }
    const userId = user.id || user.uid;
    const emoji = emojiData.emoji;
    
    // Check if user already reacted with this emoji
    const existing = reactions.find(r => r.userId === userId && r.emoji === emoji);
    try {
      if (existing) {
        await deleteDoc(doc(db, 'comment_reactions', existing.id));
      } else {
        await addDoc(collection(db, 'comment_reactions'), {
          commentId: comment.id,
          userId,
          emoji,
          timestamp: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Reaction Error:", err);
    }
    setShowEmojiPicker(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Komentar oleh ${comment.userName}: "${comment.text}" - BaMbooChain`);
    alert("Teks komentar disalin ke clipboard!");
  };
  
  // Group reactions for rendering
  const reactionCounts = reactions.reduce((acc, curr) => {
    acc[curr.emoji] = (acc[curr.emoji] || 0) + 1;
    return acc;
  }, {});

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editCommentText.trim()) return;
    try {
      await setDoc(doc(db, 'page_comments', comment.id), { text: editCommentText }, { merge: true });
      setEditingCommentId(null);
    } catch (err) {
      console.error("Edit Error:", err);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus balasan ini?")) {
      try {
        await deleteDoc(doc(db, 'comment_replies', replyId));
      } catch (err) {
        console.error("Delete Reply Error:", err);
      }
    }
  };

  const handleEditReplySubmit = async (e, replyId) => {
    e.preventDefault();
    if (!editReplyText.trim()) return;
    try {
      await setDoc(doc(db, 'comment_replies', replyId), { text: editReplyText }, { merge: true });
      setEditingReplyId(null);
    } catch (err) {
      console.error("Edit Reply Error:", err);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
      <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', flexShrink: 0 }}>
        {comment.userName?.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '12px 18px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{comment.userName}</div>
            {user && (user.uid === comment.userId || user.username === 'albantani' || user.role === 'admin') && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setEditingCommentId(comment.id); setEditCommentText(comment.text); }} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 0 }}><Edit2 size={14} /></button>
                <button onClick={() => handleDeleteComment(comment.id)} style={{ background: 'none', border: 'none', color: '#fa5252', cursor: 'pointer', padding: 0 }}><Trash2 size={14} /></button>
              </div>
            )}
          </div>
          
          {editingCommentId === comment.id ? (
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
              <input type="text" value={editCommentText} onChange={e => setEditCommentText(e.target.value)} style={{ flex: 1, padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.9rem' }} />
              <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>Simpan</button>
              <button type="button" onClick={() => setEditingCommentId(null)} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>Batal</button>
            </form>
          ) : (
            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4', wordBreak: 'break-word' }}>{comment.text}</div>
          )}
          
          {Object.keys(reactionCounts).length > 0 && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              {Object.entries(reactionCounts).map(([emoji, count]) => (
                <div key={emoji} style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{emoji}</span> <span>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interaction Bar */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '6px', marginLeft: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleLike} style={{ background: 'none', border: 'none', color: hasLiked ? '#fa5252' : '#888', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
            {likes > 0 ? `${likes} Suka` : 'Suka'}
          </button>
          <button onClick={() => setShowReplyForm(!showReplyForm)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', padding: 0 }}>Balas</button>
          <button onClick={() => setIsGiftFormActive(!isGiftFormActive)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', padding: 0 }}>Gift</button>
          <button onClick={handleShare} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', padding: 0 }}>Share</button>
          
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', padding: 0 }}>Emoji</button>
            {showEmojiPicker && (
              <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 10 }}>
                <EmojiPicker onEmojiClick={handleReaction} />
              </div>
            )}
          </div>

          <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: 'auto' }}>
            {comment.timestamp?.seconds ? new Date(comment.timestamp.seconds * 1000).toLocaleString() : 'Baru saja'}
          </span>
        </div>

        {/* Gift Form (per comment) */}
        {isGiftFormActive && (
          <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '15px', border: '1px solid var(--border-color)', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><Gift size={14} color="#f59f00" /> Gift untuk {comment.userName}</div>
              <button onClick={() => setIsGiftFormActive(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={14} /></button>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" value={giftAmount} onChange={(e) => setGiftAmount(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.8rem' }} />
              <button disabled={giftingInProgress} onClick={handleSendGift} style={{ background: '#f59f00', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 15px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>
                {giftingInProgress ? 'Mengirim...' : 'Kirim'}
              </button>
            </div>
          </div>
        )}

        {/* Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleAddReply} style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center' }}>
            <input type="text" placeholder={`Balas ke ${comment.userName}...`} value={newReply} onChange={e => setNewReply(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '15px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.8rem' }} />
            <button disabled={loadingReply} type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '15px', padding: '8px 15px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>Kirim</button>
          </form>
        )}

        {/* Replies List */}
        {replies.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {!showReplies && (
              <button onClick={() => setShowReplies(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', padding: 0 }}>
                Lihat {replies.length} balasan
              </button>
            )}
            {showReplies && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', borderLeft: '2px solid rgba(0,0,0,0.1)', paddingLeft: '15px' }}>
                {replies.map(reply => (
                  <div key={reply.id} style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '25px', height: '25px', borderRadius: '50%', background: '#888', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold', flexShrink: 0 }}>
                      {reply.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{reply.userName}</div>
                          {user && (user.uid === reply.userId || user.username === 'albantani' || user.role === 'admin') && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => { setEditingReplyId(reply.id); setEditReplyText(reply.text); }} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 0 }}><Edit2 size={12} /></button>
                              <button onClick={() => handleDeleteReply(reply.id)} style={{ background: 'none', border: 'none', color: '#fa5252', cursor: 'pointer', padding: 0 }}><Trash2 size={12} /></button>
                            </div>
                          )}
                        </div>
                        {editingReplyId === reply.id ? (
                          <form onSubmit={(e) => handleEditReplySubmit(e, reply.id)} style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                            <input type="text" value={editReplyText} onChange={e => setEditReplyText(e.target.value)} style={{ flex: 1, padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
                            <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.75rem' }}>Simpan</button>
                            <button type="button" onClick={() => setEditingReplyId(null)} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.75rem' }}>Batal</button>
                          </form>
                        ) : (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', wordBreak: 'break-word' }}>{reply.text}</div>
                        )}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '4px', marginLeft: '5px' }}>
                        {reply.timestamp?.seconds ? new Date(reply.timestamp.seconds * 1000).toLocaleString() : 'Baru saja'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
