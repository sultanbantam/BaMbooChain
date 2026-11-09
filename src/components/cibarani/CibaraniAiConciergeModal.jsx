import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, MapPin, Calendar, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useCibaraniStore } from '../../services/cibarani/cibaraniStore';
import { useNavigate } from 'react-router-dom';

const CibaraniAiConciergeModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { runConciergeQuery } = useCibaraniStore();
  
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Sampurasun! Saya Cibarani Concierge AI. Saya siap membantu Anda menjelajahi paket wisata Cibarani Weekend Experience, panduan rute KRL & elf, tradisi lumbung Leuit, Goa Dagul, atau produk lokal desa. Ada yang ingin Anda tanyakan?'
    }
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    'Berapa harga paket & fasilitasnya?',
    'Bagaimana rute menuju Cibarani via KRL?',
    'Apa itu tradisi Leuit & Padi 40 Tahun?',
    'Bagaimana akses ke Goa Dagul & Sirah Banteng?',
    'Produk lokal apa saja yang tersedia?'
  ];

  const handleSend = (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const reply = runConciergeQuery(textToSend);
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 400);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--bg-card, #ffffff)',
        color: 'var(--text-main, #0f172a)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        border: '1.5px solid var(--border-color, #cbd5e1)',
        overflow: 'hidden'
      }}>
        {/* HEADER */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={22} color="#fde047" />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Cibarani Concierge AI <span style={{ fontSize: '0.65rem', background: '#fbbf24', color: '#78350f', padding: '2px 6px', borderRadius: '4px', fontWeight: '900' }}>LEVEL 1</span>
              </div>
              <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>
                Pemandu Digital Wisata Adat & Ekosistem BaMbooChain
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* CHAT BODY */}
        <div style={{
          flex: 1,
          padding: '16px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: 'var(--bg-secondary, #f8fafc)'
        }}>
          {messages.map((m, idx) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={idx}
                style={{
                  alignSelf: isAi ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  background: isAi ? 'var(--bg-card, #ffffff)' : 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                  color: isAi ? 'var(--text-main, #0f172a)' : '#ffffff',
                  padding: '12px 16px',
                  borderRadius: isAi ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                  fontSize: '0.88rem',
                  lineHeight: 1.45,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: isAi ? '1px solid var(--border-color, #e2e8f0)' : 'none'
                }}
              >
                {m.text}
              </div>
            );
          })}
        </div>

        {/* QUICK PROMPTS */}
        <div style={{
          padding: '8px 16px',
          background: 'var(--bg-card, #ffffff)',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              style={{
                background: 'var(--bg-secondary, #f1f5f9)',
                border: '1px solid var(--border-color, #cbd5e1)',
                color: 'var(--text-muted, #475569)',
                padding: '5px 10px',
                borderRadius: '16px',
                fontSize: '0.74rem',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* INPUT FORM & ACTIONS */}
        <div style={{
          padding: '12px 16px',
          background: 'var(--bg-card, #ffffff)',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Tanyakan tentang paket, rute, atau adat..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1.5px solid var(--border-color, #cbd5e1)',
              background: 'var(--bg-secondary, #f8fafc)',
              fontSize: '0.88rem',
              color: 'var(--text-main, #0f172a)'
            }}
          />

          <button
            onClick={() => handleSend()}
            style={{
              background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={16} />
          </button>
        </div>

        {/* BOTTOM CTA TO BOOKING */}
        <div style={{
          padding: '10px 16px',
          background: 'rgba(16, 185, 129, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.76rem'
        }}>
          <span style={{ color: '#047857', fontWeight: '700' }}>
            Siap merasakan langsung kearifan Cibarani?
          </span>
          <button
            onClick={() => {
              onClose();
              navigate('/cibarani/booking');
            }}
            style={{
              background: '#047857',
              color: '#ffffff',
              border: 'none',
              padding: '5px 12px',
              borderRadius: '8px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Pesan Tiket →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CibaraniAiConciergeModal;

