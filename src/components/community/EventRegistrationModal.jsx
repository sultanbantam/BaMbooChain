import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { X, CheckCircle, UploadCloud, ChevronRight, ChevronLeft, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSpeakerMaterials } from '../../hooks/useFirestoreQueries';
import EventGallery from './EventGallery';
import SocialInteractions from '../SocialInteractions';

const EventRegistrationModal = ({ isOpen, onClose, eventData }) => {
  const { user, addNotification } = useAuth();
  const [activeModalTab, setActiveModalTab] = useState('info'); // 'info', 'register', 'attendance'
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);

  const eventTitle = eventData?.title || "";
  const eventId = eventData?.id || "unknown";
  const speakers = eventData?.speakers || [];
  const materials = eventData?.materials || [];

  const { data: uploadedMaterials = [] } = useSpeakerMaterials(eventId === 'unknown' ? null : eventId);

  const getSpeakerCvUrl = (speakerName, defaultUrl) => {
    const uploadedCv = uploadedMaterials.find(m => m.type === 'cv' && m.speakerName === speakerName);
    return uploadedCv ? uploadedCv.fileUrl : defaultUrl;
  };

  const allMaterials = [
    ...materials,
    ...uploadedMaterials.filter(m => m.type === 'material').map(m => ({
      title: `${m.fileName} (Oleh: ${m.speakerName})`,
      fileUrl: m.fileUrl
    }))
  ];

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    originCity: '',
    arrivalDate: '',
    arrivalTime: '',
    transportMode: '',
    transportOther: '',
    activities: {},
    agreement: false
  });

  const isHBD = eventTitle?.includes('Dunia');
  const isHBN = eventTitle?.includes('Nasional');
  const isDiburuan = eventTitle?.includes('Diburuan') || eventTitle?.includes('DIBURUAN');
  const isSerenTaun = eventTitle?.includes('Seren Taun');
  const isFGD = eventId === 'fgd-rumah-modular-2026';
  
  const isKodibaMember = user && ((user.stakedBalance || 0) >= 10 || (user.transactions || []).some(t => t.type === 'Fiat'));

  let baseCostNum = 750000;
  let isTba = false;
  
  if (isHBD) baseCostNum = 500000;
  if (isDiburuan || isHBN) isTba = true;

  const discountAmount = isKodibaMember ? (baseCostNum * 0.2) : 0;
  const finalCostNum = baseCostNum - discountAmount;
  
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  
  let eventCostDisplay = isTba ? 'Rp ...... (Menunggu Konfirmasi)' : formatRupiah(finalCostNum);

  let statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan Seren Taun di Kasepuhan Cibarani dan mematuhi aturan adat.";
  if (isHBD) statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan Hari Bambu Dunia di Kasepuhan Cibarani dan mematuhi aturan adat.";
  if (isDiburuan) statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan DIBURUAN FESTIVAL JILID IV 2026 dan mematuhi aturan.";
  if (isHBN) statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan HARI BAMBU NASIONAL 2026 dan mematuhi aturan.";
  if (isFGD) statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan Workshop dan FGD Capacity Building Perancangan Prototype Rumah Modular Bambu dan mematuhi aturan.";

  let waEventName = eventTitle || 'Event';
  if (isSerenTaun) waEventName = 'Seren Taun';
  if (isHBD) waEventName = 'Hari Bambu Dunia';
  if (isDiburuan) waEventName = 'Festival Diburuan';
  if (isHBN) waEventName = 'Hari Bambu Nasional';
  if (isFGD) waEventName = 'Workshop & FGD';

  const activitiesList = [
    'Penanaman bambu',
    isSerenTaun ? 'Workshop budaya/adat' : 'Workshop',
    'Dokumentasi & media',
    'Diskusi lingkungan',
    'Relawan kegiatan',
    'Semua kegiatan'
  ];

  const meetingPoint = eventData?.location || "Lokasi Event";

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name.startsWith('activity_')) {
        const actName = name.replace('activity_', '');
        setFormData(prev => ({
          ...prev,
          activities: { ...prev.activities, [actName]: checked }
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreement) {
      alert("Anda harus menyetujui pernyataan peserta sebelum melanjutkan.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Get selected activities
      const selectedActivities = Object.entries(formData.activities)
        .filter(([_, isChecked]) => isChecked)
        .map(([key, _]) => key);

      const submissionData = {
        userId: user?.id || 'guest',
        eventTitle,
        identity: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        },
        arrival: {
          originCity: formData.originCity,
          arrivalDate: formData.arrivalDate,
          arrivalTime: formData.arrivalTime,
          transportMode: formData.transportMode === 'Lainnya' ? formData.transportOther : formData.transportMode
        },
        activities: selectedActivities,
        costInfo: {
           baseCost: baseCostNum,
           discount: discountAmount,
           finalCost: finalCostNum,
           isKodibaMember
        },
        status: 'pending_payment',
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, "event_registrations"), submissionData);
      
      if(addNotification) {
        addNotification("Pendaftaran berhasil! Silakan selesaikan pembayaran.", "success");
      }
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting registration:", error);
      alert("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAttendance = async () => {
    if (!user) {
      alert("Anda harus login terlebih dahulu untuk melakukan absensi.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "event_attendance"), {
        eventId,
        eventTitle,
        userId: user.id,
        username: user.username || user.name,
        timestamp: serverTimestamp()
      });
      setAttendanceSuccess(true);
      if(addNotification) {
        addNotification("Absensi kehadiran berhasil dicatat!", "success");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("Terjadi kesalahan saat menyimpan absensi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    },
    modal: {
      backgroundColor: '#1a1a1a',
      borderRadius: '24px',
      width: '100%',
      maxWidth: '650px',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #333',
      overflow: 'hidden',
      color: 'white',
      fontFamily: 'sans-serif'
    },
    header: {
      padding: '25px',
      borderBottom: '1px solid #333',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#0a0f0a'
    },
    content: {
      padding: '30px',
      overflowY: 'auto',
      flex: 1
    },
    footer: {
      padding: '20px 30px',
      borderTop: '1px solid #333',
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: '#0a0f0a'
    },
    input: {
      width: '100%',
      padding: '14px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      border: '1px solid #444',
      borderRadius: '12px',
      color: 'white',
      marginBottom: '20px',
      fontSize: '1rem'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#adb5bd',
      fontSize: '0.9rem',
      fontWeight: 'bold'
    },
    btnPrimary: {
      padding: '12px 24px',
      backgroundColor: '#51cf66',
      color: 'black',
      border: 'none',
      borderRadius: '12px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    btnSecondary: {
      padding: '12px 24px',
      backgroundColor: 'transparent',
      color: '#adb5bd',
      border: '1px solid #444',
      borderRadius: '12px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    stepIndicator: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      justifyContent: 'center'
    },
    dot: (isActive) => ({
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: isActive ? '#51cf66' : '#444'
    }),
    tabContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      borderBottom: '1px solid #333',
      paddingBottom: '10px'
    },
    tabBtn: (isActive) => ({
      background: isActive ? 'rgba(81, 207, 102, 0.1)' : 'transparent',
      color: isActive ? '#51cf66' : '#adb5bd',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '0.9rem'
    })
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '25px', color: '#51cf66' }}>A. Identitas Peserta</h3>
            <label style={styles.label}>Nama Lengkap *</label>
            <input required style={styles.input} name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Sesuai KTP" />
            
            <label style={styles.label}>No. HP / WhatsApp *</label>
            <input required style={styles.input} type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="08..." />
            
            <label style={styles.label}>Email *</label>
            <input required style={styles.input} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@contoh.com" />
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '25px', color: '#51cf66' }}>B. Informasi Kedatangan</h3>
            <p style={{ color: '#adb5bd', fontSize: '0.9rem', marginBottom: '20px' }}>Titik kumpul berada di {meetingPoint}.</p>
            
            <label style={styles.label}>Kota Asal *</label>
            <input required style={styles.input} name="originCity" value={formData.originCity} onChange={handleChange} />
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Tgl Estimasi Tiba *</label>
                <input required style={styles.input} type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Jam Tiba *</label>
                <input required style={styles.input} type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} />
              </div>
            </div>

            <label style={styles.label}>Moda Transportasi ke {meetingPoint} *</label>
            <select required style={styles.input} name="transportMode" value={formData.transportMode} onChange={handleChange}>
              <option value="" style={{ color: 'black', backgroundColor: 'white' }}>-- Pilih --</option>
              <option value="Kereta" style={{ color: 'black', backgroundColor: 'white' }}>Kereta (KRL/Lokal)</option>
              <option value="Bus" style={{ color: 'black', backgroundColor: 'white' }}>Bus</option>
              <option value="Kendaraan pribadi" style={{ color: 'black', backgroundColor: 'white' }}>Kendaraan Pribadi</option>
              <option value="Lainnya" style={{ color: 'black', backgroundColor: 'white' }}>Lainnya</option>
            </select>
            
            {formData.transportMode === 'Lainnya' && (
              <input required style={styles.input} name="transportOther" value={formData.transportOther} onChange={handleChange} placeholder="Sebutkan..." />
            )}
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '25px', color: '#51cf66' }}>C. Pilihan Aktivitas</h3>
            <p style={{ color: '#adb5bd', fontSize: '0.9rem', marginBottom: '20px' }}>Pilih aktivitas yang paling Anda minati selama event (bisa lebih dari satu):</p>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              {activitiesList.map(act => (
                <label key={act} style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    name={`activity_${act}`} 
                    checked={formData.activities[act] || false} 
                    onChange={handleChange}
                    style={{ width: '20px', height: '20px', accentColor: '#51cf66' }}
                  />
                  <span style={{ fontSize: '1rem' }}>{act}</span>
                </label>
              ))}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '25px', color: '#51cf66' }}>D. Pernyataan & Pembayaran</h3>
            
            {!isTba && !isFGD && (
              isKodibaMember ? (
                <div style={{ backgroundColor: '#ebfbee', border: '1px solid #51cf66', padding: '15px', borderRadius: '15px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle color="#2b8a3e" size={32} />
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#2b8a3e', fontSize: '1.1rem' }}>Harga Spesial Member KoDiBa Diterapkan!</div>
                    <div style={{ fontSize: '0.85rem', color: '#40c057', marginTop: '4px' }}>Anda berhemat {formatRupiah(discountAmount)} untuk event ini.</div>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: '#fff4e6', border: '1px solid #fab005', padding: '15px', borderRadius: '15px', marginBottom: '25px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ fontSize: '1.8rem' }}>💡</div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#e8590c', fontSize: '1.1rem', marginBottom: '6px' }}>Hemat {formatRupiah(baseCostNum * 0.2)} khusus Member KoDiBa!</div>
                    <div style={{ fontSize: '0.85rem', color: '#d9480f', marginBottom: '12px' }}>Dapatkan potongan 20% tiket event ini dengan bergabung di Koperasi Digital Bambu sekarang juga.</div>
                    <a href="#/kodiba" onClick={onClose} style={{ display: 'inline-block', backgroundColor: '#fab005', color: 'black', padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '900', textDecoration: 'none', boxShadow: '0 4px 10px rgba(250, 176, 5, 0.3)' }}>Daftar KoDiBa Sekarang</a>
                  </div>
                </div>
              )
            )}

            <div style={{ backgroundColor: 'rgba(250, 176, 5, 0.1)', border: '1px solid #fab005', padding: '20px', borderRadius: '15px', marginBottom: '25px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="agreement" 
                  checked={formData.agreement} 
                  onChange={handleChange}
                  style={{ width: '24px', height: '24px', accentColor: '#fab005', marginTop: '3px' }}
                />
                <span style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#ffec99' }}>
                  "{statementText}"
                </span>
              </label>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '15px', border: '1px solid #444' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard color="#51cf66" /> Informasi Pembayaran
              </h4>
              
              {isFGD ? (
                <>
                  <div style={{ backgroundColor: 'rgba(81, 207, 102, 0.1)', border: '1px solid #51cf66', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
                    <p style={{ color: '#51cf66', margin: 0, fontWeight: 'bold' }}>Event Tidak Berbayar (Gratis)</p>
                    <p style={{ color: '#adb5bd', fontSize: '0.85rem', margin: '5px 0 0' }}>Seluruh pembiayaan kegiatan ini didukung sepenuhnya oleh anggaran kas <strong>PKR Bambu</strong>.</p>
                  </div>
                  <div style={{ padding: '15px', backgroundColor: '#111', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Rekening Penampung Kas (Untuk Transparansi):</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '1px' }}>BRI 1411 0100 0456 562</div>
                    <div style={{ fontSize: '0.9rem', color: '#adb5bd' }}>a.n Yayasan Sabumi Nusantara Jaya</div>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ color: '#adb5bd', fontSize: '0.9rem', marginBottom: '20px' }}>
                    Biaya kontribusi peserta sebesar <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{eventCostDisplay}</strong> dapat ditransfer ke salah satu metode berikut:
                  </p>
                  
                  <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#111', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Bank Transfer (Rupiah)</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '1px' }}>BRI 1411 0100 0456 562</div>
                    <div style={{ fontSize: '0.9rem', color: '#adb5bd' }}>a.n Yayasan Sabumi Nusantara Jaya</div>
                  </div>

                  <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#111', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Crypto (USDT BEP20)</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', wordBreak: 'break-all' }}>0xcb66199ea24746a7917a8dc171b0583cd7420e10</div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#fab005', fontStyle: 'italic', textAlign: 'center' }}>
                    *Mohon selesaikan pendaftaran untuk mendapatkan petunjuk konfirmasi pembayaran via WhatsApp.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const renderInfoTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '10px 0' }}>
      <p style={{ color: '#adb5bd', fontSize: '0.95rem', marginBottom: '25px', lineHeight: '1.6' }}>
        Pelajari lebih lanjut tentang acara ini, unduh materi, dan lihat profil narasumber sebelum melakukan pendaftaran atau absensi.
      </p>

      {eventId === 'fgd-rumah-modular-2026' && (
        <div style={{ marginBottom: '30px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px', color: '#51cf66' }}>RUNDOWN ACARA</h4>
          <p style={{ color: 'white', marginBottom: '15px', fontSize: '0.9rem' }}>Durasi: 2 hari</p>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#111', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
              <h5 style={{ color: '#fab005', margin: 0, fontSize: '0.95rem' }}>Hari Pertama</h5>
              <p style={{ color: '#adb5bd', fontSize: '0.8rem', margin: '5px 0 0 0' }}>Rabu, 1 Juli 2026</p>
            </div>
            <table style={{ width: '100%', fontSize: '0.85rem', color: 'white' }}>
              <tbody>
                <tr><td style={{ width: '110px', padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>08.00 – 08.30</td><td style={{ padding: '6px 0' }}>Registrasi peserta</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>08.30 – 08.45</td><td style={{ padding: '6px 0' }}>Pembukaan</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>08.45 – 08.55</td><td style={{ padding: '6px 0' }}>Menyanyikan Lagu Indonesia Raya</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>08.55 – 09.05</td><td style={{ padding: '6px 0' }}>Doa</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>09.05 – 09.20</td><td style={{ padding: '6px 0' }}>Sambutan Ketua PKR Bambu</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>09.20 – 09.35</td><td style={{ padding: '6px 0' }}>Sambutan perwakilan Kementerian/Instansi Terkait</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>09.35 – 09.50</td><td style={{ padding: '6px 0' }}>Foto bersama</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>09.50 – 10.10</td><td style={{ padding: '6px 0' }}>Ekspos singkat Super Apps BaMbooChain</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>10.10 – 10.30</td><td style={{ padding: '6px 0' }}>Demo Game Modular BlockBamboo Constructor v.1.0</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>10.30 – 11.15</td><td style={{ padding: '6px 0' }}>Narasumber 1: Program Kredit Perumahan dan Potensi Rumah Subsidi</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>11.15 – 12.00</td><td style={{ padding: '6px 0' }}>Narasumber 2: Uji Kelaikan dan Aspek Struktur Rumah Modular Bambu</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>12.00 – 13.00</td><td style={{ padding: '6px 0' }}>Ishoma</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>13.00 – 13.45</td><td style={{ padding: '6px 0' }}>Narasumber 3: PBG untuk Konstruksi Bangunan Bambu</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>13.45 – 14.30</td><td style={{ padding: '6px 0' }}>Narasumber 4: Kesiapan Industri Bambu Laminasi untuk Rumah Modular Blockbamboo</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>14.30 – 15.15</td><td style={{ padding: '6px 0' }}>Sesi diskusi panel dan tanya jawab</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>15.15 – 16.00</td><td style={{ padding: '6px 0' }}>FGD sesi 1: Isu teknis prototype dan arah standar</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>16.00 – 16.30</td><td style={{ padding: '6px 0' }}>Rangkum hasil hari pertama</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>16.30 – 17.00</td><td style={{ padding: '6px 0' }}>Penutupan hari pertama</td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <div style={{ backgroundColor: '#111', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
              <h5 style={{ color: '#fab005', margin: 0, fontSize: '0.95rem' }}>Hari Kedua</h5>
              <p style={{ color: '#adb5bd', fontSize: '0.8rem', margin: '5px 0 0 0' }}>Kamis, 2 Juli 2026</p>
            </div>
            <table style={{ width: '100%', fontSize: '0.85rem', color: 'white' }}>
              <tbody>
                <tr><td style={{ width: '110px', padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>08.00 – 08.30</td><td style={{ padding: '6px 0' }}>Registrasi ulang peserta</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>08.30 – 08.45</td><td style={{ padding: '6px 0' }}>Pembukaan hari kedua</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>08.45 – 09.30</td><td style={{ padding: '6px 0' }}>Narasumber 5: Rumah Modular Blockwood dan Blockbamboo</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>09.30 – 10.15</td><td style={{ padding: '6px 0' }}>Narasumber 6: RISHAM sebagai Referensi Inovasi Rumah Ramah Gempa</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>10.15 – 11.00</td><td style={{ padding: '6px 0' }}>Diskusi panel: kesiapan industri, material, dan supply chain</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>11.00 – 12.00</td><td style={{ padding: '6px 0' }}>FGD sesi 2: penyusunan kerangka draft RSNI konstruksi bangunan bambu</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>12.00 – 13.00</td><td style={{ padding: '6px 0' }}>Ishoma</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>13.00 – 14.00</td><td style={{ padding: '6px 0' }}>FGD sesi 3: rumusan poin-poin untuk draft Kepmen PU prototype rumah modular bambu</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>14.00 – 14.45</td><td style={{ padding: '6px 0' }}>Presentasi hasil kelompok FGD</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>14.45 – 15.15</td><td style={{ padding: '6px 0' }}>Penyusunan kesimpulan dan rekomendasi tindak lanjut</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>15.15 – 15.45</td><td style={{ padding: '6px 0' }}>Pembacaan hasil forum / executive summary</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>15.45 – 16.00</td><td style={{ padding: '6px 0' }}>Penandatanganan berita acara / komitmen bersama</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>16.00 – 16.30</td><td style={{ padding: '6px 0' }}>Closing statement</td></tr>
                <tr><td style={{ padding: '6px 0', color: '#adb5bd', verticalAlign: 'top' }}>16.30 – 17.00</td><td style={{ padding: '6px 0' }}>Foto bersama dan penutupan</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {speakers.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', color: 'white' }}>Narasumber</h4>
          <div style={{ display: 'grid', gap: '15px' }}>
            {speakers.map((speaker, idx) => {
              const cvLink = getSpeakerCvUrl(speaker.name, speaker.cvUrl);
              return (
              <div key={idx} style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'white' }}>{speaker.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#adb5bd', marginBottom: speaker.topic ? '4px' : '0' }}>{speaker.role}</div>
                  {speaker.topic && <div style={{ fontSize: '0.8rem', color: '#51cf66', fontStyle: 'italic' }}>Materi: {speaker.topic}</div>}
                </div>
                {cvLink && (
                  <a href={cvLink} target="_blank" rel="noreferrer" style={{ backgroundColor: '#1c7ed6', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 'bold', whiteSpace: 'nowrap', textAlign: 'center' }}>
                    Download CV
                  </a>
                )}
              </div>
            )})}
          </div>
        </div>
      )}

      {allMaterials.length > 0 && (
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', color: 'white' }}>Materi Acara</h4>
          <div style={{ display: 'grid', gap: '15px' }}>
            {allMaterials.map((mat, idx) => (
              <div key={idx} style={{ backgroundColor: 'rgba(81, 207, 102, 0.05)', border: '1px solid rgba(81, 207, 102, 0.2)', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 'bold', color: 'white', fontSize: '0.9rem' }}>{mat.title}</div>
                {mat.fileUrl && (
                  <a href={mat.fileUrl} target="_blank" rel="noreferrer" style={{ backgroundColor: '#51cf66', color: 'black', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 'bold', whiteSpace: 'nowrap', textAlign: 'center' }}>
                    Unduh File
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderAttendanceTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '20px 0' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', color: '#51cf66' }}>Daftar Hadir (Check-in)</h3>
      
      {attendanceSuccess ? (
        <div>
          <CheckCircle size={60} color="#51cf66" style={{ margin: '0 auto 15px' }} />
          <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold' }}>Absensi Berhasil!</p>
          <p style={{ color: '#adb5bd', fontSize: '0.9rem' }}>Kehadiran Anda telah tercatat di sistem pada {new Date().toLocaleString('id-ID')}.</p>
        </div>
      ) : (
        <div>
          <p style={{ color: '#adb5bd', fontSize: '0.95rem', marginBottom: '30px', lineHeight: '1.6' }}>
            Bagi peserta yang telah hadir di lokasi atau sudah tergabung dalam ruangan rapat *online*, silakan klik tombol di bawah ini untuk mencatat kehadiran Anda secara digital.
          </p>
          {!user ? (
            <div style={{ backgroundColor: '#fff4e6', border: '1px solid #fab005', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
              <p style={{ color: '#d9480f', margin: 0, fontSize: '0.9rem' }}>Anda harus masuk (login) ke platform BaMbooChain terlebih dahulu untuk dapat melakukan absensi.</p>
            </div>
          ) : (eventId === 'fgd-rumah-modular-2026' && new Date() < new Date('2026-07-01T00:00:00')) ? (
            <div style={{ backgroundColor: '#fff4e6', border: '1px solid #fab005', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
              <p style={{ color: '#d9480f', margin: 0, fontSize: '0.9rem' }}>Fitur absensi untuk acara ini baru akan diaktifkan pada tanggal 1-2 Juli 2026.</p>
            </div>
          ) : (
            <button 
              onClick={handleAttendance}
              disabled={isSubmitting}
              style={{ 
                backgroundColor: '#1c7ed6', color: 'white', border: 'none', padding: '15px 30px', 
                borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer' 
              }}
            >
              {isSubmitting ? 'Memproses...' : 'Klik untuk Absen Kehadiran'}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );

  const renderFinanceTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '10px 0' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px', color: '#fab005' }}>Anggaran & Transparansi Keuangan</h3>
      {eventId === 'fgd-rumah-modular-2026' ? (
        <div>
          <p style={{ color: '#adb5bd', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.6' }}>
            Sebagai bentuk transparansi ekosistem BaMbooChain, berikut adalah Rencana Anggaran Biaya (RAB) kegiatan ini yang didanai sepenuhnya melalui kas <strong>PKR Bambu</strong> ke rekening <strong>BRI Yayasan Sabumi Nusantara Jaya</strong>.
          </p>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px', overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.85rem', color: 'white', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #444', color: '#adb5bd' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>No</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Uraian</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Vol</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Satuan</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Harga Satuan</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '10px' }}>1</td>
                  <td style={{ padding: '10px' }}>
                    <strong>Honorarium:</strong><br/>
                    1. Penerima tamu (2 orang x 2 hari)<br/>
                    2. MC (1 orang x 2 hari)<br/>
                    3. Moderator (1 orang x 2 hari)<br/>
                    4. Narasumber di luar PKR (6 orang)
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>4<br/>2<br/>2<br/>6</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>OH<br/>OH<br/>OH<br/>OK</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>100.000<br/>200.000<br/>500.000<br/>1.020.000</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>400.000<br/>400.000<br/>1.000.000<br/>6.120.000</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '10px' }}>2</td>
                  <td style={{ padding: '10px' }}>Uang harian peserta (11 orang × 2 hari)</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>22</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>OH</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>100.000</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>2.200.000</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '10px' }}>3</td>
                  <td style={{ padding: '10px' }}>Biaya penginapan eselon III (3 orang × 2 hari)</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>6</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>OH</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>900.000</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>5.400.000</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '10px' }}>4</td>
                  <td style={{ padding: '10px' }}>Konsumsi makan (40 orang)</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>40</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>OK</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>35.000</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>1.400.000</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '10px' }}>5</td>
                  <td style={{ padding: '10px' }}>Konsumsi kudapan (42 orang)</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>42</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>OK</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>15.000</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>630.000</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '10px' }}>6</td>
                  <td style={{ padding: '10px' }}>Cetak Backdrop</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>1</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>LS</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>441.000</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>441.000</td>
                </tr>
                <tr style={{ backgroundColor: 'rgba(250, 176, 5, 0.2)' }}>
                  <td colSpan="5" style={{ padding: '12px', fontWeight: 'bold', textAlign: 'right' }}>Jumlah Total</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', textAlign: 'right', color: '#fab005' }}>17.991.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <p style={{ color: '#adb5bd' }}>Laporan keuangan untuk event ini belum tersedia atau didanai secara mandiri.</p>
        </div>
      )}
    </motion.div>
  );

  const renderSocialTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '10px 0' }}>
      <p style={{ color: '#adb5bd', fontSize: '0.95rem', marginBottom: '25px', lineHeight: '1.6' }}>
        Bagikan momen, foto, video, dan berikan komentar atau apresiasi (Gift) untuk acara ini bersama komunitas.
      </p>
      
      <EventGallery eventId={eventId} />
      
      <div style={{ marginTop: '20px', margin: '0 -30px' }}>
        <SocialInteractions entityId={eventId} />
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={styles.overlay}>
          <motion.div 
            style={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div style={styles.header}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Pendaftaran Event</h2>
                <div style={{ fontSize: '0.85rem', color: '#51cf66' }}>{eventTitle}</div>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={styles.content}>
              <div style={styles.tabContainer}>
                <button onClick={() => setActiveModalTab('info')} style={styles.tabBtn(activeModalTab === 'info')}>Informasi</button>
                <button onClick={() => setActiveModalTab('finance')} style={styles.tabBtn(activeModalTab === 'finance')}>Laporan</button>
                <button onClick={() => setActiveModalTab('social')} style={styles.tabBtn(activeModalTab === 'social')}>Galeri & Diskusi</button>
                <button onClick={() => setActiveModalTab('register')} style={styles.tabBtn(activeModalTab === 'register')}>Daftar</button>
                <button onClick={() => setActiveModalTab('attendance')} style={styles.tabBtn(activeModalTab === 'attendance')}>Absen</button>
              </div>

              {activeModalTab === 'info' && renderInfoTab()}
              {activeModalTab === 'finance' && renderFinanceTab()}
              {activeModalTab === 'social' && renderSocialTab()}
              {activeModalTab === 'attendance' && renderAttendanceTab()}
              
              {activeModalTab === 'register' && (
                isSuccess ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <CheckCircle size={80} color="#51cf66" style={{ margin: '0 auto 20px' }} />
                  <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '15px' }}>Pendaftaran Berhasil!</h2>
                  <p style={{ color: '#adb5bd', fontSize: '1.1rem', marginBottom: '30px', lineHeight: '1.6' }}>
                    Data pendaftaran Anda telah kami terima. Langkah selanjutnya adalah melakukan pembayaran dan mengonfirmasinya kepada panitia.
                  </p>
                  
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                    <p style={{ margin: '0 0 15px 0', color: '#fff' }}>Konfirmasi pembayaran beserta bukti transfer melalui WhatsApp ke:</p>
                    <a 
                      href={'https://wa.me/628174139994?text=' + encodeURIComponent(`Halo Panitia ${waEventName}, saya ${formData.fullName} ingin mengonfirmasi pembayaran pendaftaran peserta.\nJalur: ${isKodibaMember ? 'Member VIP KoDiBa (Diskon 20%)' : 'Reguler'}\nTotal Pembayaran: ${eventCostDisplay}`)}
                      target="_blank" 
                      rel="noreferrer"
                      style={{ 
                        display: 'inline-block', padding: '12px 24px', backgroundColor: '#25D366', 
                        color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: 'bold'
                      }}
                    >
                      Konfirmasi via WA: 08174139994
                    </a>
                  </div>

                  <button onClick={onClose} style={styles.btnSecondary}>Tutup Form</button>
                </div>
              ) : (
                <form id="event-reg-form" onSubmit={handleSubmit}>
                  <div style={styles.stepIndicator}>
                    {[1, 2, 3, 4].map(s => <div key={s} style={styles.dot(step >= s)} />)}
                  </div>
                  
                  {renderStep()}
                </form>
                )
              )}
            </div>

            {activeModalTab === 'register' && !isSuccess && (
              <div style={styles.footer}>
                {step > 1 ? (
                  <button type="button" onClick={handlePrev} style={styles.btnSecondary}>
                    <ChevronLeft size={18} /> Kembali
                  </button>
                ) : <div></div>}
                
                {step < 4 ? (
                  <button type="button" onClick={handleNext} style={styles.btnPrimary}>
                    Selanjutnya <ChevronRight size={18} />
                  </button>
                ) : (
                  <button type="submit" form="event-reg-form" style={styles.btnPrimary} disabled={isSubmitting}>
                    {isSubmitting ? 'Memproses...' : 'Selesaikan Pendaftaran'} <CheckCircle size={18} />
                  </button>
                )}
              </div>
            )}
            
            {(activeModalTab === 'info' || activeModalTab === 'attendance' || activeModalTab === 'finance' || activeModalTab === 'social') && (
              <div style={styles.footer}>
                <button type="button" onClick={onClose} style={styles.btnSecondary}>
                  Tutup
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventRegistrationModal;
