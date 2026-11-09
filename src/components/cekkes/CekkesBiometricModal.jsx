import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Eye, 
  Fingerprint, 
  Mic, 
  Camera, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  StopCircle
} from 'lucide-react';

const CekkesBiometricModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('retina');
  
  // Camera state (Retina/Iris simulation)
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [irisDetected, setIrisDetected] = useState(false);

  // Fingerprint (WebAuthn) state
  const [webAuthnStatus, setWebAuthnStatus] = useState('idle'); // idle | checking | supported | unsupported | verified
  const [webAuthnMessage, setWebAuthnMessage] = useState('');

  // Mic (Voiceprint) state
  const [isRecording, setIsRecording] = useState(false);
  const [audioSampleReady, setAudioSampleReady] = useState(false);
  const [audioWave, setAudioWave] = useState([30, 50, 80, 45, 90, 60, 40, 70, 85, 30]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  const startCamera = async () => {
    setCameraError('');
    setIrisDetected(false);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraActive(true);
          // Simulate iris bounding target after 2s
          setTimeout(() => setIrisDetected(true), 2000);
        }
      } else {
        setCameraError('Perangkat browser tidak mendukung akses kamera.');
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Izin kamera ditolak atau kamera sedang digunakan aplikasi lain: ' + err.message);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIrisDetected(false);
  };

  const testFingerprintSensor = async () => {
    setWebAuthnStatus('checking');
    setWebAuthnMessage('Memeriksa ketersediaan modul biometrik perangkat...');

    try {
      if (window.PublicKeyCredential) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (available) {
          setWebAuthnStatus('supported');
          setWebAuthnMessage('Sensor Biometrik (Fingerprint/Face ID perangkat) Terdeteksi & Siap Digunakan untuk Verifikasi Akun.');
        } else {
          setWebAuthnStatus('supported');
          setWebAuthnMessage('WebAuthn FIDO2 didukung pada peramban ini (dapat menggunakan PIN / Kunci Keamanan USB).');
        }
      } else {
        setWebAuthnStatus('unsupported');
        setWebAuthnMessage('Peramban ini belum mendukung WebAuthn Platform Authenticator.');
      }
    } catch (err) {
      setWebAuthnStatus('unsupported');
      setWebAuthnMessage('Gagal mengakses sensor: ' + err.message);
    }
  };

  const testVoiceRecording = async () => {
    setIsRecording(true);
    setAudioSampleReady(false);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Animate wave for 3.5 seconds
        const interval = setInterval(() => {
          setAudioWave(Array.from({ length: 12 }, () => Math.floor(Math.random() * 70) + 20));
        }, 150);

        setTimeout(() => {
          clearInterval(interval);
          stream.getTracks().forEach(t => t.stop());
          setIsRecording(false);
          setAudioSampleReady(true);
        }, 3500);
      } else {
        setIsRecording(false);
        alert('Akses mikrofon tidak didukung.');
      }
    } catch (err) {
      setIsRecording(false);
      alert('Izin mikrofon ditolak atau tidak tersedia: ' + err.message);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 20000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: '#161b26',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '780px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden',
        color: '#ffffff'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid #232936',
          background: '#0d111a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '8px', borderRadius: '10px', color: '#60a5fa' }}>
              <Fingerprint size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
                Laboratorium Biometrik & Perangkat (Retina, Sidik Jari, Suara)
              </h2>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>
                Panduan perangkat keras, batasan ilmiah medis, dan simulasi peramban
              </p>
            </div>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Biometric Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          padding: '12px 20px',
          background: '#0d111a',
          borderBottom: '1px solid #232936'
        }}>
          {[
            { id: 'retina', label: '1. Retina & Iris (Mata)', icon: <Eye size={16} />, color: '#2dd4bf' },
            { id: 'fingerprint', label: '2. Sidik Jari (Sensor)', icon: <Fingerprint size={16} />, color: '#34d399' },
            { id: 'voice', label: '3. Suara (Mikrofon)', icon: <Mic size={16} />, color: '#f59e0b' },
          ].map(t => {
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => { stopCamera(); setActiveTab(t.id); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: isSel ? `1px solid ${t.color}` : '1px solid #232936',
                  background: isSel ? 'rgba(16, 185, 129, 0.15)' : 'rgba(22, 27, 38, 0.6)',
                  color: isSel ? t.color : '#94a3b8',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* TAB 1: RETINA & IRIS */}
          {activeTab === 'retina' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Scientific explanation */}
              <div style={{ background: '#0d111a', border: '1px solid #232936', borderRadius: '14px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.85rem', fontWeight: '800', color: '#2dd4bf', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={16} /> Apakah Bisa Memakai Kamera Biasa / HP?
                </h4>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: '#ffffff' }}>1. Retina (Dinding Belakang Mata):</strong> <span style={{ color: '#f87171', fontWeight: 'bold' }}>TIDAK BISA menggunakan kamera HP biasa.</span> Retina berada di bagian dalam rongga bola mata di balik pupil. Pemindaian retina memerlukan perangkat medis optik bernama <strong>Fundus Camera / Oftalmoskopi</strong> dengan pencahayaan koaksial tembus pupil. Menjanjikan "scan retina dengan kamera ponsel" adalah pelanggaran etika sains dan kebijakan keselamatan Google Play.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: '#ffffff' }}>2. Iris (Selaput Pelangi Bagian Depan):</strong> <span style={{ color: '#34d399', fontWeight: 'bold' }}>Bisa menggunakan kamera</span> dengan pencahayaan inframerah jarak dekat (*Near-Infrared / NIR*) atau kamera resolusi tinggi agar pola pigmen iris terbaca jelas tanpa membuat pupil mata mengecil akibat kilat lampu.
                  </p>
                </div>
              </div>

              {/* Camera Simulator */}
              <div style={{ background: '#0d111a', border: '1px solid #232936', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '100%', maxWidth: '420px', height: '240px', background: '#000000', borderRadius: '12px', border: '2px dashed #232936', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isCameraActive ? (
                    <>
                      <video ref={videoRef} playsInline autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {/* Iris Target Reticle Overlay */}
                      <div style={{
                        position: 'absolute',
                        width: '120px',
                        height: '120px',
                        border: irisDetected ? '2px solid #34d399' : '2px dashed #60a5fa',
                        borderRadius: '50%',
                        boxShadow: irisDetected ? '0 0 20px rgba(52, 211, 153, 0.6)' : 'none',
                        transition: 'all 0.3s'
                      }}>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '30px', height: '30px', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%' }} />
                      </div>
                      <span style={{
                        position: 'absolute',
                        bottom: '10px',
                        fontSize: '0.72rem',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: irisDetected ? 'rgba(16, 185, 129, 0.85)' : 'rgba(0,0,0,0.6)',
                        color: '#ffffff',
                        fontWeight: '700'
                      }}>
                        {irisDetected ? '✓ Fokus Iris Terdeteksi (Simulasi Optik)' : 'Mengarahkan Fokus Mata ke Lingkaran...'}
                      </span>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                      <Camera size={38} color="#64748b" style={{ margin: '0 auto 8px' }} />
                      <p style={{ margin: 0, fontSize: '0.8rem' }}>Kamera sedang tidak aktif</p>
                      <span style={{ fontSize: '0.72rem' }}>Klik tombol di bawah untuk menguji akses kamera perangkat</span>
                    </div>
                  )}
                </div>

                {cameraError && (
                  <div style={{ color: '#f87171', fontSize: '0.75rem', textAlign: 'center' }}>{cameraError}</div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  {!isCameraActive ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      style={{
                        padding: '9px 18px',
                        background: '#10b981',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#022c22',
                        fontSize: '0.82rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Camera size={16} /> Aktifkan Kamera Perangkat
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopCamera}
                      style={{
                        padding: '9px 18px',
                        background: '#e03131',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '0.82rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <StopCircle size={16} /> Matikan Kamera
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FINGERPRINT SENSOR */}
          {activeTab === 'fingerprint' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#0d111a', border: '1px solid #232936', borderRadius: '14px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.85rem', fontWeight: '800', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Fingerprint size={16} /> Bagaimana Pemeriksaan Sidik Jari Dilakukan?
                </h4>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p style={{ margin: 0 }}>
                    • <strong>Perangkat yang digunakan:</strong> Sensor sidik jari bawaan HP/Laptop (Touch ID / Fingerprint scanner) atau modul pemindai USB biometrik terhubung.
                  </p>
                  <p style={{ margin: 0 }}>
                    • <strong>Protokol Peramban:</strong> Melalui standar peramban resmi <strong>WebAuthn / FIDO2 API</strong> (`navigator.credentials`).
                  </p>
                  <p style={{ margin: 0 }}>
                    • <strong>Fungsi Ilmiah:</strong> HANYA untuk verifikasi identitas masuk (*authentication / proof-of-identity*). Sidik jari <strong>tidak bisa mendeteksi penyakit dalam</strong> atau mengukur gula darah.
                  </p>
                </div>
              </div>

              {/* Test Button & Result Box */}
              <div style={{ background: '#0d111a', border: '1px solid #232936', borderRadius: '14px', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: webAuthnStatus === 'supported' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                  border: `2px solid ${webAuthnStatus === 'supported' ? '#34d399' : '#3b82f6'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Fingerprint size={42} color={webAuthnStatus === 'supported' ? '#34d399' : '#60a5fa'} />
                </div>

                {webAuthnMessage ? (
                  <p style={{ margin: 0, fontSize: '0.82rem', color: webAuthnStatus === 'supported' ? '#34d399' : '#f87171', maxWidth: '420px', lineHeight: 1.5 }}>
                    {webAuthnMessage}
                  </p>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                    Klik tombol di bawah untuk memeriksa kompatibilitas sensor biometrik perangkat Anda.
                  </p>
                )}

                <button
                  type="button"
                  onClick={testFingerprintSensor}
                  style={{
                    padding: '10px 22px',
                    background: '#10b981',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#022c22',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Uji Kompatibilitas Sensor Sidik Jari (WebAuthn)
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: VOICEPRINT */}
          {activeTab === 'voice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#0d111a', border: '1px solid #232936', borderRadius: '14px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.85rem', fontWeight: '800', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mic size={16} /> Bagaimana Pemeriksaan Suara Dilakukan?
                </h4>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p style={{ margin: 0 }}>
                    • <strong>Perangkat yang digunakan:</strong> Mikrofon bawaan ponsel cerdas atau laptop.
                  </p>
                  <p style={{ margin: 0 }}>
                    • <strong>Fungsi Ilmiah:</strong> Mengukur spektrogram frekuensi suara, ritme akustik, dan modulasi laring untuk verifikasi identitas pemilik akun (*voice authentication*) atau catatan gejala suara serak (*hoarseness*).
                  </p>
                  <p style={{ margin: 0 }}>
                    • <strong>Batasan PDP:</strong> Rekaman suara mentah tidak disebarluaskan; hanya fitur gelombang akustik terenkripsi yang disimpan lokal jika izin diberikan.
                  </p>
                </div>
              </div>

              {/* Audio Wave Simulator */}
              <div style={{ background: '#0d111a', border: '1px solid #232936', borderRadius: '14px', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <div style={{ height: '70px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                  {audioWave.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: '8px',
                        height: isRecording ? `${h}px` : '15px',
                        background: isRecording ? '#fbbf24' : '#334155',
                        borderRadius: '4px',
                        transition: 'height 0.15s ease'
                      }}
                    />
                  ))}
                </div>

                <p style={{ margin: 0, fontSize: '0.8rem', color: isRecording ? '#fbbf24' : audioSampleReady ? '#34d399' : '#94a3b8' }}>
                  {isRecording ? 'Merekam Sampel Akustik (Bicaralah 3 detik)...' : audioSampleReady ? '✓ Sampel Suara Berhasil Direkam & Dianalisis Lokal' : 'Mikrofon Siap untuk Pengujian'}
                </p>

                <button
                  type="button"
                  onClick={testVoiceRecording}
                  disabled={isRecording}
                  style={{
                    padding: '10px 22px',
                    background: isRecording ? '#334155' : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    cursor: isRecording ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Mic size={16} /> {isRecording ? 'Sedang Merekam...' : 'Uji Rekam Sampel Suara (Mikrofon)'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 22px',
          borderTop: '1px solid #232936',
          background: '#0d111a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: '#94a3b8'
        }}>
          <span>Standar Kepatuhan: <strong style={{ color: '#34d399' }}>UU PDP No. 27/2022</strong></span>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            style={{ padding: '6px 16px', borderRadius: '8px', background: '#334155', border: 'none', color: '#ffffff', cursor: 'pointer', fontWeight: '700' }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default CekkesBiometricModal;
