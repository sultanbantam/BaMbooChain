import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { eventsData, featuredEventData } from '../utils/eventsData';
import { uploadSpeakerMaterial, useSpeakerMaterials, useCommunityEvents, createCommunityEvent, updateCommunityEventStatus } from '../hooks/useFirestoreQueries';
import { FileUp, CheckCircle, Upload, AlertCircle, Plus, Calendar, Clock, MapPin, Loader } from 'lucide-react';
import BackButton from '../components/BackButton';

const EventOrganizerPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.username === 'albantani' || user?.name === 'albantani' || user?.email === 'sultanbantam@gmail.com';

  const [activeTab, setActiveTab] = useState('organizer'); // 'organizer' or 'speaker'
  
  // -- ORGANIZER STATE --
  const { data: communityEvents = [], refetch: refetchCommunityEvents, isLoading: isLoadingEvents } = useCommunityEvents(user?.id, isAdmin);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', date: '', time: '', location: '', category: 'Workshop', description: '', image: ''
  });

  // -- SPEAKER STATE --
  const [myEvents, setMyEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [materialFile, setMaterialFile] = useState(null);
  const [customSpeakerName, setCustomSpeakerName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: uploadedMaterials = [], refetch: refetchMaterials } = useSpeakerMaterials(selectedEvent?.id);

  useEffect(() => {
    if (user) {
      const allEvents = [...eventsData, featuredEventData];
      let assignedEvents = [];
      if (isAdmin) {
        assignedEvents = allEvents;
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

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createCommunityEvent({
        ...newEvent,
        organizerId: user.id,
        organizerName: user.name || user.username
      });
      setSuccessMsg("Acara berhasil dibuat dan sedang menunggu persetujuan Admin!");
      setShowCreateForm(false);
      setNewEvent({ title: '', date: '', time: '', location: '', category: 'Workshop', description: '', image: '' });
      refetchCommunityEvents();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (eventId, status) => {
    if (!isAdmin) return;
    try {
      await updateCommunityEventStatus(eventId, status);
      refetchCommunityEvents();
    } catch (error) {
      console.error("Gagal mengupdate status", error);
    }
  };

  const handleUpload = async (e, type) => {
    e.preventDefault();
    const file = type === 'cv' ? cvFile : materialFile;
    if (!file) return setErrorMsg("Pilih file terlebih dahulu.");
    if (file.size > 5 * 1024 * 1024) return setErrorMsg("Maksimal 5MB.");

    setIsUploading(true);
    setErrorMsg(''); setSuccessMsg('');
    const progressInterval = setInterval(() => setUploadProgress(p => Math.min(p + 10, 90)), 200);

    try {
      let finalSpeakerName = isAdmin ? (customSpeakerName || 'Admin') : (user.name || user.username);
      await uploadSpeakerMaterial(file, selectedEvent.id, finalSpeakerName, type);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccessMsg(`File berhasil diunggah!`);
      if (type === 'cv') setCvFile(null);
      if (type === 'material') setMaterialFile(null);
      refetchMaterials();
      setTimeout(() => setUploadProgress(0), 2000);
    } catch (err) {
      clearInterval(progressInterval);
      setErrorMsg(err.message || "Gagal mengunggah file.");
    } finally {
      setIsUploading(false);
    }
  };

  const getMyUploadedFiles = (type) => {
    if (isAdmin) return uploadedMaterials.filter(m => m.type === type);
    const speakerName = user.name || user.username;
    return uploadedMaterials.filter(m => m.speakerName === speakerName && m.type === type);
  };

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0a0f0a', color: 'white', paddingTop: '170px', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px' },
    wrapper: { maxWidth: '800px', margin: '0 auto' },
    card: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' },
    title: { fontSize: '2rem', fontWeight: 'bold', color: '#51cf66', marginBottom: '10px' },
    tabs: { display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '10px' },
    tabBtn: (active) => ({ background: active ? '#51cf66' : 'transparent', color: active ? 'black' : '#adb5bd', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }),
    input: { width: '100%', padding: '12px 15px', borderRadius: '8px', backgroundColor: '#111', border: '1px solid #333', color: 'white', marginBottom: '15px' },
    button: { backgroundColor: '#fab005', color: 'black', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }
  };

  if (!user) return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={{ textAlign: 'center', marginTop: '100px' }}><h2>Akses Ditolak</h2><p>Silakan login untuk mengakses halaman ini.</p></div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={styles.card}>
          <h1 style={styles.title}>Event Organizer</h1>
          <p style={{ color: '#adb5bd', fontSize: '1.1rem', marginBottom: '30px' }}>
            Kelola acara komunitas BaMbooChain Anda atau unggah materi narasumber.
          </p>

          <div style={styles.tabs}>
            <button style={styles.tabBtn(activeTab === 'organizer')} onClick={() => { setActiveTab('organizer'); setErrorMsg(''); setSuccessMsg(''); }}>Acara Komunitas</button>
            <button style={styles.tabBtn(activeTab === 'speaker')} onClick={() => { setActiveTab('speaker'); setErrorMsg(''); setSuccessMsg(''); }}>Materi Narasumber</button>
          </div>

          {errorMsg && <div style={{ backgroundColor: 'rgba(224, 49, 49, 0.1)', border: '1px solid #e03131', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#ffc9c9' }}>{errorMsg}</div>}
          {successMsg && <div style={{ backgroundColor: 'rgba(43, 138, 62, 0.1)', border: '1px solid #2b8a3e', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#d3f9d8' }}>{successMsg}</div>}

          {activeTab === 'organizer' && (
            <div>
              {!showCreateForm ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>{isAdmin ? 'Semua Acara Komunitas' : 'Acara Buatan Anda'}</h3>
                    <button style={styles.button} onClick={() => setShowCreateForm(true)}><Plus size={16} /> Buat Acara Baru</button>
                  </div>

                  {isLoadingEvents ? <p>Memuat acara...</p> : communityEvents.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#111', borderRadius: '12px' }}><p style={{ color: '#888' }}>Belum ada acara komunitas.</p></div>
                  ) : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                      {communityEvents.map(ev => (
                        <div key={ev.id} style={{ padding: '20px', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{ev.title}</h4>
                            <span style={{ padding: '5px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: ev.status === 'approved' ? 'rgba(43,138,62,0.2)' : ev.status === 'rejected' ? 'rgba(224,49,49,0.2)' : 'rgba(250,176,5,0.2)', color: ev.status === 'approved' ? '#51cf66' : ev.status === 'rejected' ? '#ff8787' : '#fab005' }}>
                              {ev.status.toUpperCase()}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#888', marginBottom: '10px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14}/> {ev.date}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14}/> {ev.time}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14}/> {ev.location}</span>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: '#adb5bd' }}>{ev.description}</p>
                          
                          {isAdmin && ev.status === 'pending' && (
                            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                              <button onClick={() => handleApprove(ev.id, 'approved')} style={{ padding: '8px 15px', background: '#2b8a3e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Setujui</button>
                              <button onClick={() => handleApprove(ev.id, 'rejected')} style={{ padding: '8px 15px', background: '#e03131', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Tolak</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleCreateEvent}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Buat Acara Baru</h3>
                    <button type="button" onClick={() => setShowCreateForm(false)} style={{ background: 'none', border: 'none', color: '#adb5bd', cursor: 'pointer' }}>Batal</button>
                  </div>
                  
                  <label>Judul Acara</label>
                  <input style={styles.input} required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="Contoh: Diskusi Petani Bambu" />
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div><label>Tanggal</label><input type="date" style={styles.input} required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} /></div>
                    <div><label>Waktu</label><input type="time" style={styles.input} required value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} /></div>
                  </div>

                  <label>Lokasi (atau Link Online)</label>
                  <input style={styles.input} required value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} placeholder="Contoh: Balai Desa X atau Zoom Link" />

                  <label>Kategori</label>
                  <select style={styles.input} value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})}>
                    <option value="Workshop">Workshop / Pelatihan</option>
                    <option value="FGD">Focus Group Discussion</option>
                    <option value="Webinar">Webinar Online</option>
                    <option value="Meetup">Temu Kopi / Meetup</option>
                  </select>

                  <label>Deskripsi Singkat</label>
                  <textarea style={{...styles.input, minHeight: '100px'}} required value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} placeholder="Jelaskan tentang acara ini..." />

                  <button type="submit" disabled={isSubmitting} style={{ ...styles.button, width: '100%', marginTop: '10px' }}>
                    {isSubmitting ? 'Memproses...' : 'Kirim Pengajuan Acara'}
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'speaker' && (
            <div>
              {!selectedEvent ? (
                <div>
                  <h3 style={{ marginBottom: '20px' }}>Acara Anda ({myEvents.length})</h3>
                  {myEvents.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#111', borderRadius: '12px' }}>
                      <p style={{ color: '#888' }}>Belum ada acara yang menugaskan Anda sebagai narasumber saat ini.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                      {myEvents.map(ev => (
                        <div key={ev.id} style={{ padding: '20px', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onClick={() => setSelectedEvent(ev)}>
                          <div><div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' }}>{ev.title}</div><div style={{ fontSize: '0.85rem', color: '#888' }}>{ev.date} • {ev.location}</div></div>
                          <div style={{ color: '#fab005', fontWeight: 'bold' }}>Pilih &rarr;</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <button onClick={() => { setSelectedEvent(null); setSuccessMsg(''); setErrorMsg(''); }} style={{ background: '#222', border: '1px solid #444', borderRadius: '8px', color: '#adb5bd', cursor: 'pointer', padding: '6px 12px', marginBottom: '20px' }}>&larr; Kembali</button>
                  <h3 style={{ margin: '0 0 20px 0', color: '#fab005' }}>{selectedEvent.title}</h3>

                  {isAdmin && (
                    <div style={{ marginBottom: '30px', backgroundColor: 'rgba(28, 126, 214, 0.1)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(28, 126, 214, 0.3)' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#a5d8ff' }}>Upload Atas Nama (Admin Mode):</label>
                      <input type="text" placeholder="Contoh: Abah Jaro" value={customSpeakerName} onChange={e => setCustomSpeakerName(e.target.value)} style={styles.input} />
                    </div>
                  )}

                  <div style={{ marginBottom: '40px' }}>
                    <h4>1. Unggah Curriculum Vitae (CV)</h4>
                    <form onSubmit={(e) => handleUpload(e, 'cv')}>
                      <div style={{ border: '2px dashed #444', borderRadius: '12px', padding: '30px', textAlign: 'center', marginBottom: '15px', position: 'relative' }}>
                        <input type="file" accept=".pdf" onChange={e => setCvFile(e.target.files[0])} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                        <FileUp size={40} color={cvFile ? '#51cf66' : '#666'} />
                        <div>{cvFile ? cvFile.name : 'Klik atau seret file CV ke sini'}</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button type="submit" disabled={!cvFile || isUploading} style={{ ...styles.button, opacity: !cvFile ? 0.5 : 1 }}>{isUploading ? `Mengunggah...` : 'Unggah CV'}</button>
                        {getMyUploadedFiles('cv').length > 0 && <span style={{ color: '#51cf66' }}>Tersimpan ({getMyUploadedFiles('cv').length})</span>}
                      </div>
                    </form>
                  </div>

                  <div>
                    <h4>2. Unggah Materi Presentasi</h4>
                    <form onSubmit={(e) => handleUpload(e, 'material')}>
                      <div style={{ border: '2px dashed #444', borderRadius: '12px', padding: '30px', textAlign: 'center', marginBottom: '15px', position: 'relative' }}>
                        <input type="file" accept=".pdf,.ppt,.pptx" onChange={e => setMaterialFile(e.target.files[0])} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                        <FileUp size={40} color={materialFile ? '#fab005' : '#666'} />
                        <div>{materialFile ? materialFile.name : 'Klik atau seret file Materi ke sini'}</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button type="submit" disabled={!materialFile || isUploading} style={{ ...styles.button, background: '#1c7ed6', color: 'white', opacity: !materialFile ? 0.5 : 1 }}>{isUploading ? `Mengunggah...` : 'Unggah Materi'}</button>
                        {getMyUploadedFiles('material').length > 0 && <span style={{ color: '#1c7ed6' }}>Tersimpan ({getMyUploadedFiles('material').length})</span>}
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default EventOrganizerPage;
