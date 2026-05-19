import React, { useState } from 'react';
import { Send, Phone, Mail } from 'lucide-react';
import BackButton from '../components/BackButton';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ContactPage = () => {
  const [status, setStatus] = useState('');

  // Pastikan Anda mendaftar di Web3Forms: https://web3forms.com/
  // Dapatkan Access Key gratis lalu masukkan di bawah
  // Menggunakan Access Key dari .env untuk keamanan
  const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || "d54c2968-7402-4906-835a-8b1bee8ae20d";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sedang mengirim...');

    const formData = new FormData(e.target);
    formData.append("access_key", ACCESS_KEY);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Also save to Firestore
        try {
          await addDoc(collection(db, "contacts"), {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            timestamp: serverTimestamp()
          });
        } catch (err) {
          console.error("Firestore Save Error:", err);
        }

        setStatus('Pesan berhasil terkirim!');
        e.target.reset();
      } else {
        console.log("Error", data);
        setStatus('Terjadi kesalahan saat mengirim.');
      }
    } catch (error) {
      console.log("Submit error", error);
      setStatus('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <BackButton to="/" />
        </div>
        <h1 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '40px', color: 'var(--text-main)' }}>Hubungi Kami</h1>
        
        <div className="contact-grid">
          {/* Info Kontak */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Mari Berkolaborasi</h3>
              <p style={{ color: 'var(--text-muted)' }}>Miliki keluhan, penawaran mitra, atau pertanyaan seputar industri bambu? Jangan ragu mengirimkan pesan kepada kami.</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'rgba(0,100,0,0.1)', borderRadius: '50%' }}>
                <Phone size={24} color="var(--primary)" />
              </div>
              <div>
                <strong style={{ display: 'block' }}>WhatsApp</strong>
                <a href="https://wa.me/628174139994" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>08174139994</a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'rgba(0,100,0,0.1)', borderRadius: '50%' }}>
                <Mail size={24} color="var(--primary)" />
              </div>
              <div>
                <strong style={{ display: 'block' }}>Email</strong>
                <a href="mailto:sabuminusantarajaya@gmail.com" style={{ color: 'var(--text-muted)' }}>sabuminusantarajaya@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Form Web3Forms */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Nama</label>
              <input type="text" name="name" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} placeholder="Masukkan nama Anda" />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email</label>
              <input type="email" name="email" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} placeholder="Masukkan alamat email Anda" />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Pesan</label>
              <textarea name="message" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', height: '150px', resize: 'vertical' }} placeholder="Tuliskan pesan Anda..." />
            </div>

            {/* Custom Subject for Email Notification */}
            <input type="hidden" name="subject" value="Pesan Baru dari Website YSNJ!" />

            <button type="submit" className="btn btn-primary" style={{ padding: '16px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Send size={20} /> KIRIM
            </button>
            {status && <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--primary)', marginTop: '10px' }}>{status}</p>}
          </form>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
