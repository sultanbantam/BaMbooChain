import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { eventsData, featuredEventData } from '../utils/eventsData';
import { uploadSpeakerMaterial, useSpeakerMaterials } from '../hooks/useFirestoreQueries';
import { FileUp, CheckCircle, Upload, AlertCircle } from 'lucide-react';
import BackButton from '../components/BackButton';

const SpeakerPortalPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [myEvents, setMyEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [cvFile, setCvFile] = useState(null);
  const [materialFile, setMaterialFile] = useState(null);
  const [customSpeakerName, setCustomSpeakerName] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.username === 'albantani' || user?.email === 'sultanbantam@gmail.com';

  // Fetch materials for selected event
  const { data: uploadedMaterials = [], refetch } = useSpeakerMaterials(selectedEvent?.id);

  useEffect(() => {
    if (user) {
      const allEvents = [...eventsData, featuredEventData];
      let assignedEvents = [];
      
      if (isAdmin) {
        assignedEvents = allEvents; // Admin dapat melihat seluruh event
      } else {
        assignedEvents = allEvents.filter(ev => 
          ev.speakers?.some(s => 
            s.name.toLowerCase() === user.name?.toLowerCase() || 
            s.name.toLowerCase() === user.username?.toLowerCase() ||
            user.name?.toLowerCase().includes(s.name.toLowerCase())
          )
        );
      }
      setMyEvents(assignedEvents);
    }
  }, [user, isAdmin]);

  const handleUpload = async (e, type) => {
    e.preventDefault();
    const file = type === 'cv' ? cvFile : materialFile;
    
    if (!file) {
      setErrorMsg("Pilih file terlebih dahulu.");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrorMsg("Ukuran file maksimal adalah 5MB.");
      return;
    }

    setIsUploading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      let finalSpeakerName = user.name || user.username || 'User';
      
      if (isAdmin) {
        finalSpeakerName = customSpeakerName || 'Admin';
      } else {
        const speakerObj = selectedEvent.speakers?.find(s => 
          s.name.toLowerCase() === user.name?.toLowerCase() || 
          s.name.toLowerCase() === user.username?.toLowerCase() ||
          user.name?.toLowerCase().includes(s.name.toLowerCase())
        );
        if (speakerObj) finalSpeakerName = speakerObj.name;
      }
      
      await uploadSpeakerMaterial(file, selectedEvent.id, finalSpeakerName, type);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccessMsg(`File ${type === 'cv' ? 'Curriculum Vitae' : 'Materi Acara'} berhasil diunggah!`);
      
      if (type === 'cv') setCvFile(null);
      if (type === 'material') setMaterialFile(null);
      
      refetch(); // Refresh list of uploaded materials
      
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
      
    } catch (err) {
      console.error(err);
      clearInterval(progressInterval);
      setErrorMsg(err.message || "Gagal mengunggah file. Pastikan koneksi stabil.");
    } finally {
      setIsUploading(false);
    }
  };

  const getMyUploadedFiles = (type) => {
    if (isAdmin) {
      return uploadedMaterials.filter(m => m.type === type);
    }
    const speakerObj = selectedEvent?.speakers?.find(s => 
      s.name.toLowerCase() === user.name?.toLowerCase() || 
      s.name.toLowerCase() === user.username?.toLowerCase() ||
      user.name?.toLowerCase().includes(s.name.toLowerCase())
    );
    const speakerName = speakerObj?.name || user.name || user.username;
    return uploadedMaterials.filter(m => m.speakerName === speakerName && m.type === type);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0a0f0a',
      color: 'white',
      paddingTop: '120px',
      paddingBottom: '80px',
      paddingLeft: '20px',
      paddingRight: '20px',
    },
    wrapper: {
      maxWidth: '800px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '24px',
      padding: '40px',
      border: '1px solid rgba(255,255,255,0.1)',
      marginBottom: '30px'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#51cf66',
      marginBottom: '10px'
    },
    eventList: {
      display: 'grid',
      gap: '15px',
      marginTop: '20px'
    },
    eventCard: {
      padding: '20px',
      backgroundColor: '#111',
      borderRadius: '12px',
      border: '1px solid #333',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    selectedEventCard: {
      borderColor: '#fab005',
      backgroundColor: 'rgba(250, 176, 5, 0.1)'
    },
    uploadBox: {
      border: '2px dashed #444',
      borderRadius: '12px',
      padding: '30px',
      textAlign: 'center',
      marginBottom: '20px',
      backgroundColor: 'rgba(0,0,0,0.2)',
      position: 'relative'
    },
    button: {
      backgroundColor: '#fab005',
      color: 'black',
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    fileInput: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      cursor: 'pointer'
    }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>Akses Ditolak</h2>
            <p>Silakan masuk (login) untuk mengakses portal narasumber.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <BackButton />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={styles.card}>
          <h1 style={styles.title}>Speaker Portal</h1>
          <p style={{ color: '#adb5bd', fontSize: '1.1rem' }}>
            Selamat datang, {user.name}! Anda dapat mengunggah CV dan materi presentasi untuk acara yang mengundang Anda sebagai narasumber.
          </p>

          {!selectedEvent ? (
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ marginBottom: '20px' }}>Acara Anda ({myEvents.length})</h3>
              {myEvents.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#111', borderRadius: '12px' }}>
                  <p style={{ color: '#888' }}>Belum ada acara yang menugaskan Anda sebagai narasumber saat ini.</p>
                </div>
              ) : (
                <div style={styles.eventList}>
                  {myEvents.map(ev => (
                    <div 
                      key={ev.id} 
                      style={styles.eventCard}
                      onClick={() => setSelectedEvent(ev)}
                    >
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' }}>{ev.title}</div>
                        <div style={{ fontSize: '0.85rem', color: '#888' }}>{ev.date} • {ev.location}</div>
                      </div>
                      <div style={{ color: '#fab005', fontWeight: 'bold' }}>Pilih &rarr;</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '25px' }}>
                <button 
                  onClick={() => { setSelectedEvent(null); setSuccessMsg(''); setErrorMsg(''); setCustomSpeakerName(''); }}
                  style={{ background: 'none', border: 'none', color: '#adb5bd', cursor: 'pointer', padding: 0, minWidth: 'max-content', marginTop: '4px' }}
                >
                  &larr; Kembali
                </button>
                <h3 style={{ margin: 0, color: '#fab005', lineHeight: '1.4' }}>{selectedEvent.title}</h3>
              </div>

              {errorMsg && (
                <div style={{ backgroundColor: 'rgba(224, 49, 49, 0.1)', border: '1px solid #e03131', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#ffc9c9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={18} /> {errorMsg}
                </div>
              )}
              
              {successMsg && (
                <div style={{ backgroundColor: 'rgba(43, 138, 62, 0.1)', border: '1px solid #2b8a3e', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#d3f9d8', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={18} /> {successMsg}
                </div>
              )}

              {isAdmin && (
                <div style={{ marginBottom: '30px', backgroundColor: 'rgba(28, 126, 214, 0.1)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(28, 126, 214, 0.3)' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#a5d8ff', fontSize: '0.95rem', fontWeight: 'bold' }}>Upload Atas Nama (Mode Admin):</label>
                  <p style={{ fontSize: '0.8rem', color: '#adb5bd', margin: '0 0 10px 0' }}>Sebagai Admin, Anda dapat mengunggah file untuk narasumber tertentu dengan mengetikkan nama mereka, atau kosongkan untuk diunggah sebagai 'Admin'. Anda juga dapat mengunggah banyak file satu per satu.</p>
                  <input 
                    type="text" 
                    placeholder="Contoh: Abah Jaro, atau Umum" 
                    value={customSpeakerName}
                    onChange={(e) => setCustomSpeakerName(e.target.value)}
                    style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', backgroundColor: '#000', border: '1px solid #333', color: 'white' }}
                  />
                </div>
              )}

              {/* Upload CV Section */}
              <div style={{ marginBottom: '40px' }}>
                <h4>1. Unggah Curriculum Vitae (CV)</h4>
                <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '15px' }}>Format PDF. Maksimal 5MB. CV ini akan ditampilkan di halaman detail acara.</p>
                
                <form onSubmit={(e) => handleUpload(e, 'cv')}>
                  <div style={styles.uploadBox}>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={(e) => setCvFile(e.target.files[0])}
                      style={styles.fileInput}
                      disabled={isUploading}
                    />
                    <FileUp size={40} color={cvFile ? '#51cf66' : '#666'} style={{ marginBottom: '10px' }} />
                    <div style={{ color: cvFile ? '#51cf66' : '#adb5bd', fontWeight: cvFile ? 'bold' : 'normal' }}>
                      {cvFile ? cvFile.name : 'Klik atau seret file CV ke sini'}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button type="submit" disabled={!cvFile || isUploading} style={{ ...styles.button, opacity: (!cvFile || isUploading) ? 0.5 : 1 }}>
                      <Upload size={18} /> {isUploading && uploadProgress > 0 && uploadProgress < 100 ? `Mengunggah ${uploadProgress}%` : 'Unggah CV'}
                    </button>
                    
                    {getMyUploadedFiles('cv').length > 0 && (
                      <div style={{ fontSize: '0.85rem', color: '#51cf66', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CheckCircle size={14} /> Tersimpan ({getMyUploadedFiles('cv').length} file)
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Upload Materi Section */}
              <div>
                <h4>2. Unggah Materi Presentasi</h4>
                <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '15px' }}>Format PDF atau PPTX. Maksimal 5MB. Materi akan tersedia untuk diunduh peserta.</p>
                
                <form onSubmit={(e) => handleUpload(e, 'material')}>
                  <div style={styles.uploadBox}>
                    <input 
                      type="file" 
                      accept=".pdf,.ppt,.pptx" 
                      onChange={(e) => setMaterialFile(e.target.files[0])}
                      style={styles.fileInput}
                      disabled={isUploading}
                    />
                    <FileUp size={40} color={materialFile ? '#fab005' : '#666'} style={{ marginBottom: '10px' }} />
                    <div style={{ color: materialFile ? '#fab005' : '#adb5bd', fontWeight: materialFile ? 'bold' : 'normal' }}>
                      {materialFile ? materialFile.name : 'Klik atau seret file Materi ke sini'}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button type="submit" disabled={!materialFile || isUploading} style={{ ...styles.button, backgroundColor: '#1c7ed6', color: 'white', opacity: (!materialFile || isUploading) ? 0.5 : 1 }}>
                      <Upload size={18} /> {isUploading && uploadProgress > 0 && uploadProgress < 100 ? `Mengunggah ${uploadProgress}%` : 'Unggah Materi'}
                    </button>
                    
                    {getMyUploadedFiles('material').length > 0 && (
                      <div style={{ fontSize: '0.85rem', color: '#1c7ed6', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CheckCircle size={14} /> Tersimpan ({getMyUploadedFiles('material').length} file)
                      </div>
                    )}
                  </div>
                </form>
              </div>

            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default SpeakerPortalPage;
