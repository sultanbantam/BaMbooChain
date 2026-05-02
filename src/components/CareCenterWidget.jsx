import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, ShieldCheck, Clock, Star, Info, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';

const CareCenterWidget = () => {
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const { rawBmcBalance } = useWeb3();
  const [isOpen, setIsOpen] = useState(false);
  const [chatState, setChatState] = useState('barrier'); // 'barrier', 'active', 'feedback', 'closed'
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [rating, setRating] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAdminTyping]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setChatState('barrier');
    }
  };

  const startChat = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (rawBmcBalance < 10) {
      return; // UI already shows warning
    }
    
    setChatState('active');
    setMessages([
      { sender: 'admin', text: `Halo ${user?.name || 'Member'}, selamat datang di Care Center BaMbooChain. Bagaimana kami bisa membantu Anda hari ini?`, time: 'Sekarang' }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newUserMsg = { sender: 'user', text: inputText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsAdminTyping(true);

    // Simulated Admin behavior
    setTimeout(() => {
      setIsAdminTyping(false);
      const adminResponse = { 
        sender: 'admin', 
        text: "Terima kasih atas pertanyaannya. Pesan Anda telah diterima oleh antrean prioritas kami. Admin kami akan segera menanggapi detail teknis ini dalam waktu singkat. Apakah ada detail lain yang ingin Anda sampaikan?", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, adminResponse]);
    }, 2500);
  };

  const closeChat = () => {
    setChatState('feedback');
  };

  const submitFeedback = () => {
    setChatState('closed');
    setTimeout(() => {
        setIsOpen(false);
        setChatState('barrier');
        setMessages([]);
        setRating(0);
    }, 2000);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={toggleWidget}
        style={{ 
          position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px', borderRadius: '50%', 
          background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(12,166,120,0.3)', border: 'none', cursor: 'pointer', zIndex: 10000,
          transition: 'transform 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageSquare size={28} />
        <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#fa5252', width: '20px', height: '20px', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold' }}>1</div>
      </button>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', bottom: '100px', right: '30px', width: '380px', height: '550px', 
      background: 'white', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', 
      display: 'flex', flexDirection: 'column', zIndex: 10000, overflow: 'hidden',
      border: '1px solid #e9ecef'
    }}>
      
      {/* Header */}
      <div style={{ background: 'var(--primary)', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} />
            </div>
            <div style={{ position: 'absolute', bottom: '0', right: '0', width: '12px', height: '12px', background: '#40c057', borderRadius: '50%', border: '2px solid var(--primary)' }}></div>
          </div>
          <div>
            <div style={{ fontWeight: '900', fontSize: '1rem' }}>Care Center Admin</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
               <Clock size={10} /> Balas dalam ~2 menit
            </div>
          </div>
        </div>
        <button onClick={toggleWidget} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      {/* Body Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#f8f9fa' }}>
        
        {/* NEW: NOTIFICATIONS STATE */}
        {chatState === 'notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="var(--primary)" /> Notifikasi Terbaru
            </h4>
            
            <div style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #e9ecef', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '16px', right: '16px', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
              <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Package size={14} color="var(--primary)" /> Pesanan Konstruksi Diterima
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Pembayaran #ORD-9281 telah diverifikasi. Material sedang disiapkan untuk pengiriman ke lokasi Anda.
              </div>
              <div style={{ fontSize: '0.65rem', color: '#adb5bd', marginTop: '8px' }}>2 menit yang lalu</div>
            </div>

            <div style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #e9ecef' }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} color="#f59f00" /> Misi Perakitan Baru (Worker)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Ada proyek konstruksi modular baru di Sukabumi (120m²). 12 Tukang sekitar telah dinotifikasi. 
              </div>
              <div style={{ fontSize: '0.65rem', color: '#adb5bd', marginTop: '8px' }}>5 menit yang lalu</div>
            </div>

            <button onClick={() => setChatState('barrier')} style={{ marginTop: '12px', background: 'transparent', border: '1px solid #dee2e6', padding: '10px', borderRadius: '12px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
              Kembali ke Menu Utama
            </button>
          </div>
        )}

        {/* BARRIER STATE */}
        {chatState === 'barrier' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            {/* Button to show notifications */}
            {isAuthenticated && (
              <button 
                onClick={() => setChatState('notifications')}
                style={{ position: 'absolute', top: '-10px', left: '20px', background: '#fa5252', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(250,82,82,0.3)' }}>
                2 Pesanan Aktif
              </button>
            )}

            <div style={{ background: 'rgba(12,166,120,0.1)', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
               <Lock size={40} color="var(--primary)" />
            </div>
            <h3 style={{ margin: '0 0 10px 0' }}>Bantuan Langsung</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
               Untuk menjaga kualitas layanan, fitur chat langsung hanya tersedia bagi <b>Member Terverifikasi</b> dengan saldo minimal <b>10 BMC</b>.
            </p>
            
            {!isAuthenticated ? (
               <button onClick={openLoginModal} style={{ background: 'var(--text-main)', color: 'white', padding: '12px 30px', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                  Login Sekarang
               </button>
            ) : rawBmcBalance < 10 ? (
               <div style={{ background: '#fff9db', padding: '16px', borderRadius: '12px', border: '1px solid #ffe066' }}>
                  <div style={{ color: '#f59f00', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>Saldo Kurang</div>
                  <div style={{ fontSize: '0.8rem', color: '#855600' }}>Anda memiliki {rawBmcBalance} BMC. Tambahkan minimal {10 - rawBmcBalance} BMC lagi untuk chat.</div>
               </div>
            ) : (
               <button onClick={startChat} style={{ background: 'var(--primary)', color: 'white', padding: '12px 30px', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(12,166,120,0.2)' }}>
                  Aktifkan Chat
               </button>
            )}
          </div>
        )}

        {/* ACTIVE CHAT STATE */}
        {chatState === 'active' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#adb5bd', margin: '10px 0' }}>Chat dienkripsi secara aman</div>
            
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ 
                  maxWidth: '80%', padding: '12px 16px', borderRadius: '16px', fontSize: '0.9rem',
                  background: msg.sender === 'user' ? 'var(--primary)' : 'white',
                  color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                  border: msg.sender === 'user' ? 'none' : '1px solid #e9ecef',
                  boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(12,166,120,0.2)' : '0 2px 5px rgba(0,0,0,0.02)'
                }}>
                  {msg.text}
                  <div style={{ fontSize: '0.65rem', marginTop: '4px', opacity: 0.7, textAlign: 'right' }}>{msg.time}</div>
                </div>
              </div>
            ))}
            
            {isAdminTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: 'white', padding: '12px 16px', borderRadius: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', border: '1px solid #e9ecef' }}>
                  Admin sedang mengetik...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* FEEDBACK STATE */}
        {chatState === 'feedback' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ background: 'rgba(245,159,0,0.1)', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
               <Star size={40} color="var(--crypto)" />
            </div>
            <h3 style={{ margin: '0 0 10px 0' }}>Sesi Selesai</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
               Bagaimana penilaian Anda terhadap bantuan admin hari ini?
            </p>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
               {[1,2,3,4,5].map(s => (
                 <Star 
                    key={s} 
                    size={32} 
                    style={{ cursor: 'pointer' }} 
                    fill={rating >= s ? '#f59f00' : 'none'} 
                    color={rating >= s ? '#f59f00' : '#dee2e6'} 
                    onClick={() => setRating(s)}
                 />
               ))}
            </div>

            <button 
              onClick={submitFeedback}
              disabled={rating === 0}
              style={{ background: rating === 0 ? '#dee2e6' : 'var(--primary)', color: 'white', padding: '12px 40px', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
               Kirim Penilaian
            </button>
          </div>
        )}

        {/* CLOSED STATE */}
        {chatState === 'closed' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
             <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>Terima Kasih!</div>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Masukan Anda membantu kami melayani lebih baik.</p>
          </div>
        )}
      </div>

      {/* Footer / Input */}
      {chatState === 'active' && (
        <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid #e9ecef', display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Ketik pesan keluhan/pertanyaan..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none' }}
          />
          <button type="submit" style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Send size={18} />
          </button>
        </form>
      )}

      {chatState === 'active' && (
        <button 
          onClick={closeChat}
          style={{ padding: '10px', fontSize: '0.75rem', color: '#fa5252', border: 'none', background: 'transparent', cursor: 'pointer', marginBottom: '5px' }}
        >
          Akhiri Sesi Chat
        </button>
      )}
    </div>
  );
};

export default CareCenterWidget;
