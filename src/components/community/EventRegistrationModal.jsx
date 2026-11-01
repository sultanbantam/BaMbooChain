import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { X, CheckCircle, UploadCloud, ChevronRight, ChevronLeft, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSpeakerMaterials, deleteCommunityEvent } from '../../hooks/useFirestoreQueries';
import EventGallery from './EventGallery';
import SocialInteractions from '../SocialInteractions';

const EventRegistrationModal = ({ isOpen, onClose, eventData }) => {
  const { user, addNotification, spendBmc } = useAuth();
  const { t } = useLanguage();
  const [activeModalTab, setActiveModalTab] = useState('info'); // 'info', 'register', 'attendance'
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState(null);

  const eventTitle = eventData?.title || "";
  const eventId = eventData?.id || "unknown";
  const speakers = eventData?.speakers || [];
  const materials = eventData?.materials || [];

  const { data: uploadedMaterials = [] } = useSpeakerMaterials(eventId === 'unknown' ? null : eventId);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.username === 'albantani' || user?.name === 'albantani' || user?.email === 'sultanbantam@gmail.com';
  const canManageEvent = user && (isAdmin || eventData?.organizerId === user?.id || eventData?.organizerName === user?.name || eventData?.organizerName === user?.username);

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
    iaiNumber: '',
    originCity: '',
    arrivalDate: '',
    arrivalTime: '',
    transportMode: '',
    transportOther: '',
    activities: {},
    agreement: false
  });

  const [attendanceIaiNumber, setAttendanceIaiNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [useBmcDeduction, setUseBmcDeduction] = useState(false);

  const isHBD = eventTitle?.includes('Dunia');
  const isHBN = eventTitle?.includes('Nasional');
  const isDiburuan = eventTitle?.includes('Diburuan') || eventTitle?.includes('DIBURUAN');
  const isSerenTaun = eventTitle?.includes('Seren Taun');
  const isFGD = eventId === 'fgd-rumah-modular-2026';
  const isFieldVisit = eventTitle?.includes('Field Visit');
  const isUganda = eventTitle?.toLowerCase().includes('uganda');
  
  const userBmcBalance = Number(user?.bmcBalance || 0);
  const hasClaimedKodiba = Boolean(user && (user.hasClaimedKodiba || (user.transactions || []).some(t => t.description?.toLowerCase().includes('kodiba') || t.description?.toLowerCase().includes('airdrop'))));
  const isKodibaMember = Boolean(user && ((user.stakedBalance || 0) >= 10 || user.kodibaTier || hasClaimedKodiba || userBmcBalance >= 10 || (user.transactions || []).some(t => t.type === 'Fiat')));

  let baseCostNum = 750000;
  if (eventData?.ticketPrice) {
    const parsed = parseInt(String(eventData.ticketPrice).replace(/\D/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) baseCostNum = parsed;
  } else if (isHBD) {
    baseCostNum = 500000;
  }

  let isTba = false;
  if (isDiburuan || isHBN) isTba = true;

  // KoDiBa 20% discount
  const discountAmount = isKodibaMember ? Math.round(baseCostNum * 0.2) : 0;
  const costAfterDiscount = baseCostNum - discountAmount;

  // 10 BMC deduction from KoDiBa claim = Rp 150.000 discount
  const bmcDeductionAmount = (useBmcDeduction && userBmcBalance >= 10) ? Math.min(150000, costAfterDiscount) : 0;
  const finalCostNum = Math.max(0, costAfterDiscount - bmcDeductionAmount);
  
  // Full BMC ticket cost
  let eventCostBmc = eventData?.ticketBmc ? parseInt(String(eventData.ticketBmc).replace(/\D/g, ''), 10) : (Math.round(baseCostNum / 16000));
  if (isKodibaMember) eventCostBmc = Math.max(1, Math.round(eventCostBmc * 0.8));

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  
  let eventCostDisplay = isTba ? 'Rp ...... (Menunggu Konfirmasi)' : (
    paymentMethod === 'bmc_full' ? `${eventCostBmc} BMC (Lunas via Saldo BMC)` : formatRupiah(finalCostNum)
  );

  let statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan dan mematuhi aturan yang berlaku.";
  if (isHBD) statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan Hari Bambu Dunia di Kasepuhan Cibarani dan mematuhi aturan adat.";
  if (isDiburuan) statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan DIBURUAN FESTIVAL JILID IV 2026 dan mematuhi aturan.";
  if (isHBN) statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan HARI BAMBU NASIONAL 2026 dan mematuhi aturan.";
  if (isFGD) statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan Workshop dan FGD Capacity Building Perancangan Prototype Rumah Modular Bambu dan mematuhi aturan.";
  if (isFieldVisit) statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan Field Visit: Revolusi Sebatang Bambu dan mematuhi tata tertib.";

  let waEventName = eventTitle || 'Event';
  if (isSerenTaun) waEventName = 'Seren Taun';
  if (isHBD) waEventName = 'Hari Bambu Dunia';
  if (isDiburuan) waEventName = 'Festival Diburuan';
  if (isHBN) waEventName = 'Hari Bambu Nasional';
  if (isFGD) waEventName = 'Workshop & FGD';
  if (isFieldVisit) waEventName = 'Field Visit Trisakti';

  const activitiesList = [
    'Penanaman bambu',
    isSerenTaun ? 'Workshop budaya/adat' : 'Workshop',
    'Dokumentasi & media',
    'Diskusi lingkungan',
    'Relawan kegiatan',
    'Adventure',
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
          iaiNumber: formData.iaiNumber,
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
           bmcDeduction: bmcDeductionAmount,
           finalCost: finalCostNum,
           isKodibaMember,
           paymentMethod
        },
        status: 'pending_payment',
        timestamp: serverTimestamp()
      };

      submissionData.eventId = eventId;

      // Deduct BMC from user balance if selected
      if (paymentMethod === 'bmc_full' && spendBmc) {
        const spent = await spendBmc(eventCostBmc, `Pembayaran Tiket Event: ${eventTitle}`);
        if (!spent) {
          setIsSubmitting(false);
          return;
        }
        submissionData.status = 'paid_bmc';
      } else if (useBmcDeduction && userBmcBalance >= 10 && spendBmc) {
        await spendBmc(10, `Potongan Tiket Event: ${eventTitle} (Klaim KoDiBa)`);
      }

      await addDoc(collection(db, "event_registrations"), submissionData);

      // Award +20 Points & +1.0 BMC to User's BambooID Passport
      if (user && user.id && user.id !== 'guest') {
        try {
          const regTx = {
            id: 'tx_reg_' + Date.now(),
            type: 'Earn',
            title: 'Pendaftaran Event: ' + eventTitle,
            amount: '+1.0 BMC',
            points: '+20 Poin',
            eventId: eventId,
            timestamp: new Date().toISOString()
          };
          await updateDoc(doc(db, 'users', user.id), {
            points: increment(20),
            bmcBalance: increment(1.0),
            transactions: arrayUnion(regTx)
          });
        } catch (err) {
          console.warn("Could not award registration points/BMC:", err);
        }
      }
      
      if(addNotification) {
        addNotification("Pendaftaran berhasil! +20 Poin & +1.0 BMC ditambahkan ke BambooID Passport.", "success");
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
        iaiNumber: attendanceIaiNumber,
        timestamp: serverTimestamp()
      });

      // Award +10 Points & +0.5 BMC to User's BambooID Passport
      if (user && user.id && user.id !== 'guest') {
        try {
          const attendTx = {
            id: 'tx_att_' + Date.now(),
            type: 'Earn',
            title: 'Kehadiran Terverifikasi: ' + eventTitle,
            amount: '+0.5 BMC',
            points: '+10 Poin',
            eventId: eventId,
            timestamp: new Date().toISOString()
          };
          await updateDoc(doc(db, 'users', user.id), {
            points: increment(10),
            bmcBalance: increment(0.5),
            transactions: arrayUnion(attendTx)
          });
        } catch (err) {
          console.warn("Could not award attendance points/BMC:", err);
        }
      }

      setAttendanceSuccess(true);
      if(addNotification) {
        addNotification("Absensi kehadiran berhasil dicatat! +10 Poin & +0.5 BMC telah masuk ke Passport Anda.", "success");
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
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: 'clamp(8px, 2.5vw, 16px)',
      boxSizing: 'border-box'
    },
    modal: {
      backgroundColor: '#141714',
      borderRadius: '20px',
      width: '100%',
      maxWidth: '640px',
      maxHeight: '92vh',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #2e382e',
      overflow: 'hidden',
      color: 'white',
      fontFamily: 'sans-serif',
      boxSizing: 'border-box'
    },
    header: {
      padding: '16px 20px',
      borderBottom: '1px solid #2e382e',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#0d120d',
      boxSizing: 'border-box'
    },
    content: {
      padding: 'clamp(14px, 3.5vw, 24px)',
      overflowY: 'auto',
      flex: 1,
      boxSizing: 'border-box',
      width: '100%'
    },
    footer: {
      padding: '14px 20px',
      borderTop: '1px solid #2e382e',
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: '#0d120d',
      boxSizing: 'border-box'
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
      gap: '8px',
      marginBottom: '18px',
      borderBottom: '1px solid #2e382e',
      paddingBottom: '8px',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      whiteSpace: 'nowrap',
      scrollbarWidth: 'none',
      boxSizing: 'border-box',
      width: '100%'
    },
    tabBtn: (isActive) => ({
      background: isActive ? 'rgba(81, 207, 102, 0.15)' : 'transparent',
      color: isActive ? '#51cf66' : '#adb5bd',
      border: isActive ? '1px solid #51cf66' : '1px solid transparent',
      padding: '7px 13px',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '0.84rem',
      flexShrink: 0
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
            
            <label style={styles.label}>Nomor Anggota IAI / Komunitas / Lembaga (Opsional)</label>
            <input style={styles.input} name="iaiNumber" value={formData.iaiNumber} onChange={handleChange} placeholder="Masukkan No. IAI / Komunitas / Lembaga jika ada" />
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
            
            {!isTba && !isFGD && !isFieldVisit && (
              isKodibaMember ? (
                <div style={{ backgroundColor: '#ebfbee', border: '1px solid #51cf66', padding: '18px', borderRadius: '16px', marginBottom: '25px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <CheckCircle color="#2b8a3e" size={30} />
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#2b8a3e', fontSize: '1.1rem' }}>Diskon Member KoDiBa & BMC Aktif!</div>
                      <div style={{ fontSize: '0.85rem', color: '#2b8a3e' }}>
                        Potongan 20% ({formatRupiah(discountAmount)}) langsung memotong harga tiket Anda.
                      </div>
                    </div>
                  </div>

                  {/* BMC Balance & Deduction Option */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '12px 16px', border: '1px solid #b2f2bb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#333', fontWeight: 'bold' }}>
                        🪙 Saldo BMC Anda: <span style={{ color: '#0ca678' }}>{userBmcBalance} BMC</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#666' }}>
                        {userBmcBalance >= 10 ? 'Anda dapat menukarkan 10 BMC untuk potongan langsung Rp 150.000!' : 'Klaim Airdrop di KoDiBa untuk mendapatkan tambahan BMC gratis.'}
                      </div>
                    </div>

                    {userBmcBalance >= 10 ? (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: useBmcDeduction ? '#d3f9d8' : '#f8f9fa', padding: '6px 12px', borderRadius: '8px', border: useBmcDeduction ? '1px solid #51cf66' : '1px solid #ddd' }}>
                        <input
                          type="checkbox"
                          checked={useBmcDeduction}
                          onChange={(e) => setUseBmcDeduction(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: '#0ca678' }}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: useBmcDeduction ? '#2b8a3e' : '#333' }}>
                          Potong 10 BMC (- Rp 150.000)
                        </span>
                      </label>
                    ) : (
                      <a
                        href="#/bamboochain/kodiba"
                        onClick={() => {
                          try { sessionStorage.setItem('return_to_event', eventId || 'featured'); } catch(e){}
                          onClose();
                        }}
                        style={{ fontSize: '0.8rem', color: '#e8590c', fontWeight: 'bold', textDecoration: 'underline' }}
                      >
                        Klaim BMC Tambahan →
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: '#fff4e6', border: '1px solid #fab005', padding: '18px', borderRadius: '16px', marginBottom: '25px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ fontSize: '2rem' }}>💡</div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#e8590c', fontSize: '1.1rem', marginBottom: '6px' }}>Hemat {formatRupiah(baseCostNum * 0.2)} khusus Member KoDiBa!</div>
                    <div style={{ fontSize: '0.88rem', color: '#d9480f', marginBottom: '14px', lineHeight: '1.5' }}>
                      Dapatkan potongan harga langsung 20% + klaim <strong>10 BMC Gratis</strong> di Koperasi Digital Bambu yang bisa digunakan untuk memotong biaya pembayaran tiket.
                    </div>
                    <a
                      href="#/bamboochain/kodiba"
                      onClick={() => {
                        try { sessionStorage.setItem('return_to_event', eventId || 'featured'); } catch(e){}
                        onClose();
                      }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#fab005', color: 'black', padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '900', textDecoration: 'none', boxShadow: '0 4px 12px rgba(250, 176, 5, 0.4)' }}
                    >
                      🎁 Daftar KoDiBa & Klaim 10 BMC Sekarang →
                    </a>
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
                <CreditCard color="#51cf66" /> Informasi Pembayaran & Biaya
              </h4>

              {/* Passport Reward Banner */}
              <div style={{ marginBottom: '15px', padding: '12px 16px', backgroundColor: 'rgba(81, 207, 102, 0.1)', border: '1px solid #51cf66', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>🌿</span>
                <div style={{ fontSize: '0.82rem', color: '#d3f9d8', lineHeight: '1.5' }}>
                  <strong>Integrasi BambooID Passport:</strong> Pendaftaran acara ini otomatis menambahkan <span style={{ color: '#51cf66', fontWeight: 'bold' }}>+20 Poin Ekosistem</span> & <span style={{ color: '#fab005', fontWeight: 'bold' }}>+1.0 BMC Reward</span> ke BambooID Passport Anda.
                </div>
              </div>
              
              {isFGD || isFieldVisit ? (
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
                  
                  {/* Payment Method Toggle */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        border: paymentMethod === 'bank' ? '2px solid #51cf66' : '1px solid #444',
                        backgroundColor: paymentMethod === 'bank' ? 'rgba(81, 207, 102, 0.15)' : '#111',
                        color: paymentMethod === 'bank' ? '#51cf66' : '#aaa',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      🏦 Transfer Bank (Rupiah)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bmc_full')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        border: paymentMethod === 'bmc_full' ? '2px solid #fab005' : '1px solid #444',
                        backgroundColor: paymentMethod === 'bmc_full' ? 'rgba(250, 176, 5, 0.15)' : '#111',
                        color: paymentMethod === 'bmc_full' ? '#fab005' : '#aaa',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      🪙 Saldo Token BMC
                    </button>
                  </div>

                  {paymentMethod === 'bank' ? (
                    <div style={{ marginBottom: '15px', padding: '16px', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#888' }}>Total yang Harus Ditransfer:</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#51cf66' }}>{formatRupiah(finalCostNum)}</span>
                      </div>
                      {isKodibaMember && (
                        <div style={{ fontSize: '0.78rem', color: '#40c057', marginBottom: '10px' }}>
                          ✓ Termasuk potongan 20% Member KoDiBa (-{formatRupiah(discountAmount)})
                          {useBmcDeduction && ` & potongan 10 BMC (-Rp 150.000)`}
                        </div>
                      )}
                      <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>Bank Transfer (Rupiah):</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 'bold', letterSpacing: '1px', color: '#fff' }}>BRI 1411 0100 0456 562</div>
                      <div style={{ fontSize: '0.88rem', color: '#adb5bd' }}>a.n Yayasan Sabumi Nusantara Jaya</div>
                    </div>
                  ) : (
                    <div style={{ marginBottom: '15px', padding: '16px', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #fab005' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#888' }}>Biaya Tiket Penuh:</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fab005' }}>{eventCostBmc} BMC</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '8px' }}>
                        Saldo BMC Anda: <strong style={{ color: userBmcBalance >= eventCostBmc ? '#51cf66' : '#ff6b6b' }}>{userBmcBalance} BMC</strong>
                      </div>
                      {userBmcBalance < eventCostBmc ? (
                        <div style={{ fontSize: '0.8rem', color: '#ff6b6b', marginTop: '6px' }}>
                          ⚠️ Saldo BMC Anda belum mencukupi. Silakan pilih Transfer Bank atau klaim airdrop di KoDiBa terlebih dahulu.
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: '#51cf66', marginTop: '6px' }}>
                          ✓ Saldo mencukupi! Pembayaran akan langsung memotong {eventCostBmc} BMC dari akun Anda saat menekan Selesaikan Pendaftaran.
                        </div>
                      )}
                    </div>
                  )}

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
      <p style={{ color: '#adb5bd', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.6' }}>
        Pelajari lebih lanjut tentang acara ini, baca jadwal/itinerary langsung, unduh materi, dan lihat profil narasumber sebelum melakukan pendaftaran atau absensi.
      </p>

      {/* Itinerary & Jadwal Kegiatan (Bisa Dibaca Langsung) */}
      {eventData?.itineraryText && (
        <div style={{ marginBottom: '25px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(81, 207, 102, 0.3)' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold', marginBottom: '12px', color: '#51cf66', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🗓️ Itinerary & Jadwal Acara (Baca Langsung)
          </h4>
          <div style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', overflowWrap: 'anywhere', fontSize: '0.88rem', color: '#e9ecef', lineHeight: '1.7', backgroundColor: '#111', padding: '14px', borderRadius: '10px', border: '1px solid #333', boxSizing: 'border-box' }}>
            {eventData.itineraryText}
          </div>
        </div>
      )}

      {/* Karakter Khusus: Wisata / Adventure (Titik Kumpul & Fasilitas) */}
      {(eventData?.meetingPoint || eventData?.gearList || eventData?.facilityList) && (
        <div style={{ marginBottom: '25px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px', color: '#fab005', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🧭 Informasi Wisata, Petualangan & Titik Kumpul
          </h4>
          {eventData.meetingPoint && (
            <div style={{ marginBottom: '10px', fontSize: '0.88rem', color: '#ccc' }}>
              <strong style={{ color: 'white' }}>📍 Titik Kumpul (Meeting Point):</strong> {eventData.meetingPoint}
            </div>
          )}
          {eventData.facilityList && (
            <div style={{ marginBottom: '10px', fontSize: '0.88rem', color: '#ccc' }}>
              <strong style={{ color: 'white' }}>📋 Fasilitas yang Didapat:</strong> {eventData.facilityList}
            </div>
          )}
          {eventData.gearList && (
            <div style={{ fontSize: '0.88rem', color: '#ccc' }}>
              <strong style={{ color: 'white' }}>🎒 Perlengkapan Wajib yang Harus Dibawa:</strong> {eventData.gearList}
            </div>
          )}
        </div>
      )}

      {/* Karakter Khusus: Kompetisi / Sayembara (Hadiah & Ketentuan) */}
      {(eventData?.prizePool || eventData?.customTerms) && (
        <div style={{ marginBottom: '25px', backgroundColor: 'rgba(250, 176, 5, 0.05)', padding: '20px', borderRadius: '15px', border: '1px solid #fab005' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px', color: '#fab005', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏆 Total Hadiah & Ketentuan Sayembara
          </h4>
          {eventData.prizePool && (
            <div style={{ marginBottom: '10px', fontSize: '1rem', color: '#51cf66', fontWeight: 'bold' }}>
              💰 Total Hadiah (Prize Pool): {eventData.prizePool}
            </div>
          )}
          {eventData.customTerms && (
            <div style={{ whiteSpace: 'pre-line', fontSize: '0.85rem', color: '#adb5bd', lineHeight: '1.6' }}>
              <strong style={{ color: 'white' }}>Syarat & Ketentuan Karya:</strong><br />
              {eventData.customTerms}
            </div>
          )}
        </div>
      )}

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

      {isUganda && (
        <div style={{ marginBottom: '30px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px', color: '#51cf66' }}>{t('event_itinerary_title') || 'ITINERARY ACARA'}</h4>
          <p style={{ color: 'white', marginBottom: '15px', fontSize: '0.9rem' }}>{t('uganda_duration')}</p>
          
          <div style={{ marginBottom: '20px' }}>
            <table style={{ width: '100%', fontSize: '0.85rem', color: 'white' }}>
              <tbody>
                <tr>
                  <td style={{ width: '110px', padding: '10px 0', color: '#fab005', verticalAlign: 'top', fontWeight: 'bold' }}>{t('uganda_day1_date')}</td>
                  <td style={{ padding: '10px 0', lineHeight: '1.5' }}>{t('uganda_day1_desc')}</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 0', color: '#fab005', verticalAlign: 'top', fontWeight: 'bold' }}>{t('uganda_day2_date')}</td>
                  <td style={{ padding: '10px 0', lineHeight: '1.5' }}>{t('uganda_day2_desc')}</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 0', color: '#fab005', verticalAlign: 'top', fontWeight: 'bold' }}>{t('uganda_day3_date')}</td>
                  <td style={{ padding: '10px 0', lineHeight: '1.5' }}>{t('uganda_day3_desc')}</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 0', color: '#fab005', verticalAlign: 'top', fontWeight: 'bold' }}>{t('uganda_day4_date')}</td>
                  <td style={{ padding: '10px 0', lineHeight: '1.5' }}>{t('uganda_day4_desc')}</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 0', color: '#fab005', verticalAlign: 'top', fontWeight: 'bold' }}>{t('uganda_day5_date')}</td>
                  <td style={{ padding: '10px 0', lineHeight: '1.5' }}>{t('uganda_day5_desc')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {speakers.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', color: 'white' }}>{t('event_speakers_title')}</h4>
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
                    {t('event_download_cv')}
                  </a>
                )}
              </div>
            )})}
          </div>
        </div>
      )}

      {allMaterials.length > 0 && (
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', color: 'white' }}>{t('event_materials_title')}</h4>
          <div style={{ display: 'grid', gap: '15px' }}>
            {allMaterials.map((mat, idx) => {
              const isPreviewOpen = previewMaterial?.fileUrl === mat.fileUrl;
              return (
              <div key={idx} style={{ backgroundColor: 'rgba(81, 207, 102, 0.05)', border: '1px solid rgba(81, 207, 102, 0.2)', padding: '15px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 'bold', color: 'white', fontSize: '0.9rem', wordBreak: 'break-word', flex: 1 }}>{mat.title}</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {mat.fileUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewMaterial(isPreviewOpen ? null : mat)}
                        style={{
                          backgroundColor: isPreviewOpen ? '#e03131' : '#1c7ed6',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          border: 'none',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isPreviewOpen ? '✕ Tutup Baca' : '👁️ Baca Langsung'}
                      </button>
                    )}
                    {mat.fileUrl && (
                      <a href={mat.fileUrl} target="_blank" rel="noreferrer" style={{ backgroundColor: '#51cf66', color: 'black', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 'bold', whiteSpace: 'nowrap', textAlign: 'center' }}>
                        {t('event_download_file')}
                      </a>
                    )}
                  </div>
                </div>

                {isPreviewOpen && mat.fileUrl && (
                  <div style={{ marginTop: '14px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #51cf66', backgroundColor: '#000' }}>
                    <div style={{ padding: '8px 12px', backgroundColor: '#111', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
                      <span style={{ fontSize: '0.8rem', color: '#51cf66', fontWeight: 'bold' }}>📄 Pratinjau Dokumen: {mat.title}</span>
                      <a href={mat.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#adb5bd', textDecoration: 'underline' }}>Buka di tab baru ↗</a>
                    </div>
                    <iframe
                      src={mat.fileUrl.includes('drive.google.com') 
                        ? mat.fileUrl.replace('/view', '/preview') 
                        : `https://docs.google.com/viewer?url=${encodeURIComponent(mat.fileUrl)}&embedded=true`}
                      title={mat.title}
                      style={{ width: '100%', height: '480px', border: 'none', backgroundColor: '#fff' }}
                    />
                  </div>
                )}
              </div>
            )})}
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
            <div style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={styles.label}>Nomor Anggota IAI / Komunitas / Lembaga (Opsional)</label>
                <input style={styles.input} value={attendanceIaiNumber} onChange={(e) => setAttendanceIaiNumber(e.target.value)} placeholder="Masukkan No. IAI / Komunitas / Lembaga jika ada" />
              </div>
              <div style={{ textAlign: 'center' }}>
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
            </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );

  const renderFinanceTab = () => {
    const finReport = eventData?.financialReport;
    const canManageEvent = user && (user.role === 'admin' || user.role === 'superadmin' || user.username === 'albantani' || eventData?.organizerId === user?.id || eventData?.organizerName === user?.name || eventData?.organizerName === user?.username);

    return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: '#fab005' }}>Anggaran & Transparansi Keuangan</h3>
        {canManageEvent && (
          <a
            href="/#/event-organizer"
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(250, 176, 5, 0.2)',
              border: '1px solid #fab005',
              color: '#fab005',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ✏️ Kelola di Event Organizer
          </a>
        )}
      </div>

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
      ) : finReport && (finReport.totalIncome || (finReport.items && finReport.items.length > 0) || finReport.notes) ? (
        <div>
          <p style={{ color: '#adb5bd', fontSize: '0.9rem', marginBottom: '15px', lineHeight: '1.6' }}>
            Berikut adalah laporan pertanggungjawaban dan transparansi penggunaan dana yang bersumber dari pembayaran / kontribusi peserta acara <strong>{eventTitle}</strong>.
          </p>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '15px', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333' }}>
              <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>Dana Masuk Peserta</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#51cf66' }}>
                {finReport.totalIncome ? formatRupiah(Number(finReport.totalIncome)) : 'Rp 0'}
              </div>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333' }}>
              <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>Total Pengeluaran</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ff8787' }}>
                {finReport.totalExpense ? formatRupiah(Number(finReport.totalExpense)) : 'Rp 0'}
              </div>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333' }}>
              <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>Sisa Saldo Kas</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fab005' }}>
                {formatRupiah((Number(finReport.totalIncome) || 0) - (Number(finReport.totalExpense) || 0))}
              </div>
            </div>
          </div>

          {/* Table of items */}
          {finReport.items && finReport.items.length > 0 && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px', overflowX: 'auto', marginBottom: '15px' }}>
              <table style={{ width: '100%', fontSize: '0.85rem', color: 'white', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #444', color: '#adb5bd' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>No</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Uraian Penggunaan Dana</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Vol</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Satuan</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Jumlah Biaya</th>
                  </tr>
                </thead>
                <tbody>
                  {finReport.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '10px' }}>{idx + 1}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{item.uraian}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{item.vol || '-'}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{item.satuan || '-'}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#ffc9c9' }}>{formatRupiah(Number(item.jumlah) || 0)}</td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: 'rgba(250, 176, 5, 0.2)' }}>
                    <td colSpan="4" style={{ padding: '12px', fontWeight: 'bold', textAlign: 'right' }}>Total Pengeluaran</td>
                    <td style={{ padding: '12px', fontWeight: 'bold', textAlign: 'right', color: '#fab005' }}>
                      {formatRupiah(Number(finReport.totalExpense) || 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {finReport.notes && (
            <div style={{ backgroundColor: '#111', padding: '15px', borderRadius: '12px', border: '1px solid #333', fontSize: '0.85rem', color: '#adb5bd', lineHeight: '1.6' }}>
              <strong style={{ color: 'white' }}>Catatan Transparansi Panitia:</strong><br />
              {finReport.notes}
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '35px 20px', backgroundColor: '#111', borderRadius: '16px', border: '1px solid #333' }}>
          <p style={{ color: '#adb5bd', fontSize: '0.95rem', marginBottom: canManageEvent ? '15px' : '0' }}>
            Laporan keuangan untuk event ini belum tersedia atau didanai secara mandiri.
          </p>
          {canManageEvent && (
            <div>
              <p style={{ fontSize: '0.85rem', color: '#51cf66', marginBottom: '15px' }}>
                Anda adalah penyelenggara/admin acara ini. Anda dapat menginput rincian penggunaan dana dari pembayaran peserta melalui menu Event Organizer.
              </p>
              <a
                href="/#/event-organizer"
                onClick={onClose}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  backgroundColor: '#fab005',
                  color: 'black',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  textDecoration: 'none'
                }}
              >
                💰 Isi Laporan Keuangan di Event Organizer
              </a>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
  };

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {canManageEvent && (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        window.location.hash = `#/event-organizer?edit=${eventId}`;
                      }}
                      style={{
                        background: '#fab005',
                        color: 'black',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      ✏️ Edit Acara
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!window.confirm(`Apakah Anda yakin ingin menghapus acara "${eventTitle}"? Tindakan ini tidak dapat dibatalkan.`)) return;
                        try {
                          await deleteCommunityEvent(eventId);
                          alert(`Acara "${eventTitle}" berhasil dihapus.`);
                          onClose();
                          window.location.reload();
                        } catch (err) {
                          alert("Gagal menghapus acara.");
                        }
                      }}
                      style={{
                        background: 'rgba(224, 49, 49, 0.2)',
                        border: '1px solid #e03131',
                        color: '#ff8787',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                )}
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>
            </div>

            <div style={styles.content}>
              <div style={styles.tabContainer}>
                <button onClick={() => setActiveModalTab('info')} style={styles.tabBtn(activeModalTab === 'info')}>{t('event_tab_info')}</button>
                <button onClick={() => setActiveModalTab('finance')} style={styles.tabBtn(activeModalTab === 'finance')}>{t('event_tab_report')}</button>
                <button onClick={() => setActiveModalTab('social')} style={styles.tabBtn(activeModalTab === 'social')}>{t('event_tab_gallery')}</button>
                <button onClick={() => setActiveModalTab('register')} style={styles.tabBtn(activeModalTab === 'register')}>{t('event_tab_register')}</button>
                <button onClick={() => setActiveModalTab('attendance')} style={styles.tabBtn(activeModalTab === 'attendance')}>{t('event_tab_attendance')}</button>
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
                    Data pendaftaran Anda telah kami terima. {isFGD ? 'Langkah selanjutnya adalah mengonfirmasi kehadiran Anda kepada panitia.' : 'Langkah selanjutnya adalah melakukan pembayaran dan mengonfirmasinya kepada panitia.'}
                  </p>
                  
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                    <p style={{ margin: '0 0 15px 0', color: '#fff' }}>{isFGD ? 'Konfirmasi pendaftaran Anda melalui WhatsApp ke:' : 'Konfirmasi pembayaran beserta bukti transfer melalui WhatsApp ke:'}</p>
                    <a 
                      href={'https://wa.me/628174139994?text=' + encodeURIComponent(
  isFGD 
    ? `Halo Panitia ${waEventName}, saya ${formData.fullName} ingin mengonfirmasi pendaftaran peserta.` 
    : `Halo Panitia ${waEventName}, saya ${formData.fullName} ingin mengonfirmasi pendaftaran acara.\nJalur: ${isKodibaMember ? 'Member VIP KoDiBa (Diskon 20%)' : 'Reguler'}${useBmcDeduction ? '\nPotongan BMC: -10 BMC (-Rp 150.000 Terpotong dari Akun)' : ''}\nMetode: ${paymentMethod === 'bmc_full' ? 'Lunas via Saldo BMC (' + eventCostBmc + ' BMC)' : 'Transfer Bank'}\nTotal: ${eventCostDisplay}`
)}
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
                  {t('event_btn_close')}
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
