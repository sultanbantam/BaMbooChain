import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Lock, User, ArrowRight, CheckCircle, Monitor, ShieldCheck, ChevronRight, Play, Camera, MapPin, Upload, Users, ShoppingCart, Award, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { isAuthModalOpen, closeModal, authModalInitialTab, login, signup, loginWithGoogle } = useAuth();
  
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'signup', 'forgot'
  const [method, setMethod] = useState('email'); // 'email', 'phone', 'username'
  const [step, setStep] = useState(1); // 1 = input, 2 = OTP/Captcha

  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 5; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setGeneratedCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
    // Auto-fill referral code from URL if present
    const urlParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1] || '');
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
    }
  }, []);

  const getPasswordStrength = (pw) => {
    if (!pw) return { label: 'Empty', color: '#dee2e6', width: '0%', text: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { label: 'Lemah', color: '#fa5252', width: '25%', text: 'Sangat Lemah' };
    if (score === 2) return { label: 'Sedang', color: '#fab005', width: '50%', text: 'Cukup Kuat' };
    if (score === 3) return { label: 'Kuat', color: '#40c057', width: '75%', text: 'Sangat Kuat' };
    return { label: 'Sangat Kuat', color: '#12b886', width: '100%', text: 'Luar Biasa!' };
  };

  const strength = getPasswordStrength(password);

  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalInitialTab || 'login');
      setStep(1);
      setMethod('email'); // reset to default
    }
  }, [isAuthModalOpen, authModalInitialTab]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Recovery Logic
    if (activeTab === 'forgot') {
        alert("📩 Instruksi pemulihan telah dikirim. Silakan cek Email/SMS Anda.");
        setActiveTab('login');
        return;
    }

    // Bot Check
    if (step === 1 && activeTab === 'signup') {
        if (!name) return alert("❌ Silakan masukkan Nama Lengkap!");
        if (!username) return alert("❌ Silakan masukkan Username!");
        if (password.length < 8) return alert("❌ Kata sandi minimal 8 karakter!");
        if (password !== confirmPassword) return alert("❌ Konfirmasi kata sandi tidak cocok!");
        if (!/[0-9]/.test(password)) return alert("❌ Kata sandi harus mengandung angka!");
        if (!/[^A-Za-z0-9]/.test(password)) return alert("❌ Kata sandi harus mengandung karakter spesial!");
        setStep(2);
        return;
    }

    if (step === 2 && activeTab === 'signup') {
        if (captchaInput.toUpperCase() !== generatedCaptcha) {
            alert("❌ Kode Captcha salah! Silakan coba lagi.");
            generateCaptcha();
            return;
        }
    }

    // Data package
    const userData = {
      name: name || 'User',
      username,
      email,
      phone,
      password,
      method,
      referralCode
    };

    if (activeTab === 'signup') {
      // Final step signup
      const success = await signup(userData);
      if (success) {
        alert("✅ Pendaftaran Berhasil!");
        closeModal();
      }
    } else {
      const success = await login(userData);
      if (success) {
        alert("✅ Berhasil Masuk!");
        closeModal();
      }
    }
  };

  const handleOAuth = async (provider) => {
    if (provider === 'Google') {
      const success = await loginWithGoogle();
      if (success) {
        alert("✅ Berhasil Masuk dengan Google!");
        closeModal();
      }
    } else {
      alert(`Simulasi login ${provider} belum tersedia. Gunakan Google atau Email.`);
    }
  };

  // Switch tabs -> reset states
  const toggleTab = (tab) => {
    setActiveTab(tab);
    setStep(1);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: 'max(env(safe-area-inset-top), 16px)',
      paddingBottom: '16px',
      paddingLeft: '16px',
      paddingRight: '16px',
      zIndex: 100000,
      overflowY: 'auto'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        width: '100%', maxWidth: '420px',
        borderRadius: '20px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
        overflowY: 'auto',
        overflowX: 'hidden',
        animation: 'fadeIn 0.3s ease',
        position: 'relative',
        marginTop: '8px',
        marginBottom: '8px',
        border: '1px solid var(--border-color)'
      }}>
        {/* Close Button */}
        <button onClick={closeModal} style={{
          position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)', borderRadius: '50%', width: '32px', height: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10, color: 'var(--text-main)'
        }}>
          <X size={18} />
        </button>

        {/* Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
          {['login', 'signup'].map(tab => (
            <button key={tab} onClick={() => toggleTab(tab)} style={{
              flex: 1, padding: '20px', background: activeTab === tab ? 'var(--bg-card)' : 'var(--bg-secondary)',
              border: 'none', borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
              fontSize: '1.1rem', fontWeight: 'bold', color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all 0.2s'
            }}>
              {tab === 'login' ? 'Masuk' : 'Daftar Baru'}
            </button>
          ))}
        </div>

        {/* Formulir Content */}
        <div style={{ padding: '32px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: '900' }}>
              {activeTab === 'forgot' ? "Pemulihan Akun" : activeTab === 'login' ? "Selamat Datang!" : "Buat Akun bambuNUSA"}
            </h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {activeTab === 'forgot' ? "Lupa kata sandi? Masukkan Email atau Nomor HP yang terdaftar untuk menerima tautan pemulihan." : activeTab === 'login' ? "Akses dompet custodial dan ekosistem Anda." : "Gunakan data asli sesuai KYC untuk keamanan maksimal."}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeTab !== 'forgot' && step === 1 && (
              <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '10px', padding: '3px', marginBottom: '4px', border: '1px solid var(--border-color)' }}>
                {['username', 'email', 'phone'].map(m => (
                  <button key={m} type="button" onClick={() => setMethod(m)} style={{ 
                    flex: 1, padding: '6px 2px', background: method === m ? 'var(--bg-card)' : 'transparent', 
                    border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.76rem',
                    color: method === m ? 'var(--text-main)' : 'var(--text-muted)', 
                    boxShadow: method === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer' 
                  }}>
                    {m === 'username' ? 'User' : m === 'email' ? 'Email' : 'HP'}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <>
                {activeTab === 'signup' && (
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: '#adb5bd' }} />
                    <input type="text" placeholder="Nama Lengkap (Sesuai KYC)" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                  </div>
                )}

                {activeTab === 'signup' && (
                  <div style={{ position: 'relative' }}>
                    <Monitor size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: '#adb5bd' }} />
                    <input type="text" placeholder="Username Unik" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                  </div>
                )}

                {(method === 'email' || activeTab === 'forgot') && (
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: '#adb5bd' }} />
                    <input type="email" placeholder="Alamat Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                  </div>
                )}

                {method === 'phone' && (
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: '#adb5bd' }} />
                    <input type="tel" placeholder="Nomor Handphone" value={phone} onChange={e => setPhone(e.target.value)} required style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                  </div>
                )}

                {activeTab !== 'forgot' && (
                  <>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: '#adb5bd' }} />
                      <input type={showPassword ? "text" : "password"} placeholder="Kata Sandi" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px 48px 10px 38px', borderRadius: '10px', border: '1px solid #dee2e6', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        {showPassword ? "Sembunyi" : "Lihat"}
                      </button>
                    </div>

                    {activeTab === 'signup' && (
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                          <span>Kekuatan Sandi: <strong style={{ color: strength.color }}>{strength.text}</strong></span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#f1f3f5', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: strength.width, height: '100%', background: strength.color, transition: 'width 0.3s' }}></div>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Min. 8 Karakter, kombinasi Huruf Besar, Angka, & Karakter Spesial.</p>
                      </div>
                    )}

                    {activeTab === 'signup' && (
                      <div style={{ position: 'relative' }}>
                        <ShieldCheck size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: '#adb5bd' }} />
                        <input type={showConfirmPassword ? "text" : "password"} placeholder="Konfirmasi Kata Sandi" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: '10px 48px 10px 38px', borderRadius: '10px', border: '1px solid #dee2e6', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                          {showConfirmPassword ? "Sembunyi" : "Lihat"}
                        </button>
                      </div>
                    )}
                    
                    {activeTab === 'signup' && (
                      <div style={{ position: 'relative' }}>
                        <Award size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: '#adb5bd' }} />
                        <input type="text" placeholder="Kode Referral (Opsional)" value={referralCode} onChange={e => setReferralCode(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '10px', border: '1px solid #dee2e6', fontSize: '0.9rem', boxSizing: 'border-box', background: '#f8f9fa' }} />
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'login' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ accentColor: 'var(--primary)' }} /> Ingat saya
                    </label>
                    <button type="button" onClick={() => setActiveTab('forgot')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>Lupa Password?</button>
                  </div>
                )}
              </>
            )}

            {step === 2 && activeTab === 'signup' && (
              <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Kembali
                  </button>
                  <h4 style={{ margin: 0 }}>🤖 Keamanan Anti-Bot</h4>
                  <div style={{ width: '40px' }}></div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Ketik kode berikut untuk memastikan Anda bukan robot:</p>
                <div style={{ 
                  fontSize: '2rem', fontWeight: '900', letterSpacing: '2px', 
                  color: 'var(--primary)', background: 'var(--bg-card)', padding: '15px', 
                  borderRadius: '12px', border: '2px dashed var(--primary)', 
                  fontFamily: 'monospace', marginBottom: '16px', userSelect: 'none',
                  textAlign: 'center'
                }}>
                  {generatedCaptcha}
                </div>
                <input type="text" placeholder="Ketik kode di atas" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold' }} />
                <button type="button" onClick={generateCaptcha} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', marginTop: '10px', cursor: 'pointer' }}>Ganti Kode</button>
              </div>
            )}

            <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(12, 166, 120, 0.2)' }}>
              {activeTab === 'forgot' ? "Pulihkan Akun" : activeTab === 'login' ? "Masuk" : (step === 1 ? "Lanjut" : "Daftar Sekarang")} <ArrowRight size={18} />
            </button>
            
            {activeTab === 'forgot' && (
               <button type="button" onClick={() => setActiveTab('login')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}>Batal & Kembali</button>
            )}
          </form>

          {/* Social Logins */}
          {activeTab !== 'forgot' && step === 1 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#e9ecef' }}></div>
                <div style={{ fontSize: '0.8rem', color: '#adb5bd', textTransform: 'uppercase', letterSpacing: '1px' }}>Atau</div>
                <div style={{ flex: 1, height: '1px', background: '#e9ecef' }}></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button type="button" onClick={() => handleOAuth('Google')} style={{ padding: '12px', background: 'white', border: '1px solid #dee2e6', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '18px' }} />  Google
                </button>
                <button type="button" onClick={() => handleOAuth('Apple')} style={{ padding: '12px', background: 'white', border: '1px solid #dee2e6', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                   <Monitor size={18} /> Apple
                </button>
              </div>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
