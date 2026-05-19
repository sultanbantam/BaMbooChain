import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { X, CheckCircle, UploadCloud, ChevronRight, ChevronLeft, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EventRegistrationModal = ({ isOpen, onClose, eventTitle }) => {
  const { user, addNotification } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
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
  
  const isKodibaMember = user && ((user.stakedBalance || 0) >= 10 || (user.transactions || []).some(t => t.type === 'Fiat'));

  let baseCostNum = 750000;
  let isTba = false;
  
  if (isHBD) baseCostNum = 500000;
  if (isDiburuan || isHBN) isTba = true;

  const discountAmount = isKodibaMember ? (baseCostNum * 0.2) : 0;
  const finalCostNum = baseCostNum - discountAmount;
  
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  
  let eventCostDisplay = isTba ? 'Rp ...... (Menunggu Konfirmasi)' : formatRupiah(finalCostNum);

  let statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan Seren Taun di Kasepuhan Cibarani dan mematuhi aturan adat, menjaga kebersihan lingkungan, serta menghormati masyarakat setempat.";
  if (isHBD) statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan Hari Bambu Dunia di Kasepuhan Cibarani dan mematuhi aturan adat, menjaga kebersihan lingkungan, serta menghormati masyarakat setempat.";
  if (isDiburuan) statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan DIBURUAN FESTIVAL JILID IV 2026 dan mematuhi aturan, menjaga kebersihan lingkungan, serta menghormati masyarakat setempat.";
  if (isHBN) statementText = "Saya menyatakan bersedia mengikuti seluruh rangkaian kegiatan HARI BAMBU NASIONAL 2026 dan mematuhi aturan, menjaga kebersihan lingkungan, serta menghormati masyarakat setempat.";

  let waEventName = 'Seren Taun';
  if (isHBD) waEventName = 'Hari Bambu Dunia';
  if (isDiburuan) waEventName = 'Festival Diburuan';
  if (isHBN) waEventName = 'Hari Bambu Nasional';

  const activitiesList = [
    'Penanaman bambu',
    isSerenTaun ? 'Workshop budaya/adat' : 'Workshop',
    'Dokumentasi & media',
    'Diskusi lingkungan',
    'Relawan kegiatan',
    'Semua kegiatan'
  ];

  const meetingPoint = (isDiburuan || isHBN) ? "Lokasi Tujuan" : "Stasiun Rangkasbitung";

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
            
            {!isTba && (
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
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

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
              {isSuccess ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <CheckCircle size={80} color="#51cf66" style={{ margin: '0 auto 20px' }} />
                  <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '15px' }}>Pendaftaran Berhasil!</h2>
                  <p style={{ color: '#adb5bd', fontSize: '1.1rem', marginBottom: '30px', lineHeight: '1.6' }}>
                    Data pendaftaran Anda telah kami terima. Langkah selanjutnya adalah melakukan pembayaran dan mengonfirmasinya kepada panitia.
                  </p>
                  
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                    <p style={{ margin: '0 0 15px 0', color: '#fff' }}>Konfirmasi pembayaran beserta bukti transfer melalui WhatsApp ke:</p>
                    <a 
                      href={`https://wa.me/628174139994?text=${encodeURIComponent(`Halo Panitia ${waEventName}, saya ${formData.fullName} ingin mengonfirmasi pembayaran pendaftaran peserta.\nJalur: ${isKodibaMember ? 'Member VIP KoDiBa (Diskon 20%)' : 'Reguler'}\nTotal Pembayaran: ${eventCostDisplay}`)}`}
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
              )}
            </div>

            {!isSuccess && (
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventRegistrationModal;
