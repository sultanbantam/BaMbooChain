import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Users, MapPin, CheckCircle, XCircle, Clock, Eye, Filter, Download, Search, BookOpen, Leaf, Settings, Save, Wind, Droplets, DollarSign, Activity, Heart, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { usePartnerApplications, useLocationProposals, usePlantationDonations, useGlobalSettings, useEventRegistrations, useEventAttendance, useEventTransactions, useCareerJobPosts, useCareerDemandPosts } from '../hooks/useFirestoreQueries';
import { db } from '../firebase/config';
import { doc, setDoc, addDoc, collection, serverTimestamp, getDocs, updateDoc, increment } from 'firebase/firestore';

const AdminPortalPage = () => {
  const { t } = useLanguage();
  const { 
    user, 
    isAuthenticated, 
    approvePartnerApp, 
    rejectPartnerApp, 
    approveLocation 
  } = useAuth();
  
  const { data: partnerApps = [] } = usePartnerApplications(user?.id, user?.username);
  const { data: locationProposals = [] } = useLocationProposals(user?.id, user?.username);
  const { data: plantationDonations = [] } = usePlantationDonations(user?.id, user?.username);
  const { data: eventRegistrations = [] } = useEventRegistrations();
  const { data: eventAttendance = [] } = useEventAttendance();
  const { data: eventTransactions = [], refetch: refetchEventTransactions } = useEventTransactions();
  const [volunteerApps, setVolunteerApps] = useState([]);
  
  const { data: pendingJobs = [], refetch: refetchJobs } = useCareerJobPosts('pending');
  const { data: pendingDemands = [], refetch: refetchDemands } = useCareerDemandPosts('pending');
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('partners'); // 'partners', 'locations', 'donations', 'events', or 'settings'
  const [eventViewType, setEventViewType] = useState('registrations'); // 'registrations', 'attendance', or 'finance'
  const [isProcessingTx, setIsProcessingTx] = useState(false);
  
  const { data: globalSettings, isLoading: isSettingsLoading } = useGlobalSettings();
  const [settingsForm, setSettingsForm] = useState({
    biomassPerClump: 0.8,
    co2PerClump: 0.5,
    waterPerClump: 100,
    landPerClump: 0.01,
    carbonSpotPrice: 54.27,
    oxygenPerClump: 1.2
  });

  useEffect(() => {
    if (globalSettings) {
      setSettingsForm(globalSettings);
    }
  }, [globalSettings]);

  const handleSaveSettings = async () => {
    try {
      await setDoc(doc(db, 'settings', 'environmental_metrics'), settingsForm);
      alert('Pengaturan global berhasil disimpan ke database!');
    } catch (error) {
      console.error("Error saving settings:", error);
      alert('Gagal menyimpan pengaturan. Periksa koneksi atau izin (rules) Firebase.');
    }
  };

  const handleDisburseFunds = async () => {
    if (!window.confirm("Apakah Anda yakin ingin mencairkan dana treasury sebesar Rp 17.991.000 ke rekening BRI Yayasan? Tindakan ini akan tercatat permanen di ekosistem.")) return;
    
    setIsProcessingTx(true);
    try {
      await addDoc(collection(db, "event_transactions"), {
        eventId: 'fgd-rumah-modular-2026',
        eventTitle: 'Workshop & FGD Capacity Building Perancangan Prototype Rumah Modular Bambu',
        type: 'TREASURY_DISBURSEMENT',
        amountIDR: 17991000,
        source: 'PKR Bambu Ecosystem Fund',
        destination: 'BRI 1411 0100 0456 562 (Yayasan Sabumi Nusantara Jaya)',
        timestamp: serverTimestamp(),
        adminId: user.id,
        adminUsername: user.username || user.name
      });
      alert('Pencairan dana treasury berhasil dicatat di sistem.');
      refetchEventTransactions();
    } catch (error) {
      console.error(error);
      alert('Gagal mencatat transaksi pencairan dana.');
    } finally {
      setIsProcessingTx(false);
    }
  };
  
  useEffect(() => {
    // Strict redirect: must be authenticated AND admin
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.username !== 'admin_yayasan') {
      navigate('/profile');
    }
  }, [isAuthenticated, user, navigate]);

  const handleApprovePartner = async (app) => {
    await approvePartnerApp(app.id, app.userId);
    alert('Mitra berhasil diverifikasi!');
  };

  const handleRejectPartner = async (id) => {
    if (window.confirm('Yakin ingin menolak pendaftaran ini?')) {
      await rejectPartnerApp(id);
    }
  };

  const handleApproveLocation = async (id) => {
    await approveLocation(id);
    alert('Lokasi penanaman disetujui!');
  };

  const fetchVolunteerApps = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "volunteer_applications"));
      const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      apps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setVolunteerApps(apps);
    } catch (err) {
      console.error("Error fetching volunteer apps:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'volunteers') {
      fetchVolunteerApps();
    }
  }, [activeTab]);

  const handleApproveVolunteer = async (app) => {
    try {
      // 1. Update application status
      await updateDoc(doc(db, "volunteer_applications", app.id), { status: 'verified' });
      
      // 2. Increment user reputation score by 100 XP
      if (app.userId) {
        const userRef = doc(db, "users", app.userId);
        await updateDoc(userRef, { reputationScore: increment(100) });
      }

      alert('Pendaftaran relawan disetujui & reputasi (100 XP) berhasil dikirim!');
      fetchVolunteerApps();
    } catch (err) {
      console.error("Error approving volunteer:", err);
      alert('Gagal menyetujui pendaftaran relawan.');
    }
  };

  const handleRejectVolunteer = async (id) => {
    if (!window.confirm('Yakin ingin menolak pendaftaran relawan ini?')) return;
    try {
      await updateDoc(doc(db, "volunteer_applications", id), { status: 'rejected' });
      alert('Pendaftaran relawan ditolak.');
      fetchVolunteerApps();
    } catch (err) {
      console.error("Error rejecting volunteer:", err);
      alert('Gagal menolak pendaftaran.');
    }
  };

  const handleApproveCareer = async (id, collectionName) => {
    try {
      await updateDoc(doc(db, collectionName, id), { status: 'verified' });
      alert('Berhasil disetujui!');
      if (collectionName === 'career_job_posts') refetchJobs();
      if (collectionName === 'career_demand_posts') refetchDemands();
    } catch (err) {
      console.error(err);
      alert('Gagal menyetujui.');
    }
  };

  const handleRejectCareer = async (id, collectionName) => {
    if (!window.confirm('Yakin ingin menolak post ini?')) return;
    try {
      await updateDoc(doc(db, collectionName, id), { status: 'rejected' });
      alert('Berhasil ditolak.');
      if (collectionName === 'career_job_posts') refetchJobs();
      if (collectionName === 'career_demand_posts') refetchDemands();
    } catch (err) {
      console.error(err);
      alert('Gagal menolak.');
    }
  };


  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', background: '#f0f2f5' }}>
      <div className="container" style={{ padding: '40px 24px' }}>
        
        <div style={{ marginBottom: '24px' }}>
           <BackButton to="/profile" />
        </div>

        {/* HEADER ADMIN */}
        <div style={{ background: 'linear-gradient(135deg, #1c7ed6, #1864ab)', borderRadius: '24px', padding: '40px', color: 'white', marginBottom: '32px', boxShadow: '0 10px 30px rgba(24, 100, 171, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Shield size={32} />
                <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>{t('admin_portal_title')}</h1>
              </div>
              <p style={{ opacity: 0.9, margin: 0 }}>{t('admin_portal_subtitle')}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{t('admin_portal_logged_as')}</div>
              <div style={{ fontWeight: 'bold' }}>{t('admin_portal_role')}</div>
            </div>
            <button
              onClick={() => navigate('/admin-portal/knowledge')}
              style={{ background: 'white', color: '#087f5b', border: 'none', padding: '12px 18px', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <BookOpen size={18} /> Review Knowledge
            </button>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: t('admin_portal_stat_partners'), value: '152', icon: <Users size={20} />, color: '#1c7ed6' },
            { label: t('admin_portal_stat_locations'), value: '18', icon: <MapPin size={20} />, color: '#40c057' },
            { label: t('admin_portal_stat_pending'), value: '12', icon: <Clock size={20} />, color: '#f59f00' },
            { label: t('admin_portal_stat_land'), value: '450', icon: <Shield size={20} />, color: '#7048e8' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ background: `${stat.color}15`, color: stat.color, padding: '12px', borderRadius: '12px' }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#868e96' }}>{stat.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#212529' }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* TABS CONTROL */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '8px', display: 'inline-flex', flexWrap: 'wrap', gap: '4px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <button 
            onClick={() => setActiveTab('partners')}
            style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: activeTab === 'partners' ? '#1c7ed6' : 'transparent', color: activeTab === 'partners' ? 'white' : '#495057', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Users size={18} /> {t('admin_portal_tab_partners')}
          </button>
          <button 
            onClick={() => setActiveTab('locations')}
            style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: activeTab === 'locations' ? '#1c7ed6' : 'transparent', color: activeTab === 'locations' ? 'white' : '#495057', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <MapPin size={18} /> {t('admin_portal_tab_locations')}
          </button>
          <button 
            onClick={() => setActiveTab('donations')}
            style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: activeTab === 'donations' ? '#1c7ed6' : 'transparent', color: activeTab === 'donations' ? 'white' : '#495057', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Leaf size={18} /> Dukungan Penanaman
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: activeTab === 'events' ? '#1c7ed6' : 'transparent', color: activeTab === 'events' ? 'white' : '#495057', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <BookOpen size={18} /> Manajemen Event
          </button>
          <button 
            onClick={() => setActiveTab('volunteers')}
            style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: activeTab === 'volunteers' ? '#1c7ed6' : 'transparent', color: activeTab === 'volunteers' ? 'white' : '#495057', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Heart size={18} /> Manajemen Relawan
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: activeTab === 'settings' ? '#1c7ed6' : 'transparent', color: activeTab === 'settings' ? 'white' : '#495057', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Settings size={18} /> Pengaturan AI & Variabel
          </button>
          <button 
            onClick={() => setActiveTab('careers')}
            style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: activeTab === 'careers' ? '#1c7ed6' : 'transparent', color: activeTab === 'careers' ? 'white' : '#495057', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Briefcase size={18} /> Manajemen Karir
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '800' }}>
              {activeTab === 'partners' ? t('admin_portal_tab_partners') : activeTab === 'locations' ? t('admin_portal_tab_locations') : activeTab === 'events' ? 'Manajemen Event & Absensi' : activeTab === 'settings' ? 'Pengaturan AI & Variabel Global' : activeTab === 'volunteers' ? 'Manajemen Pendaftaran Relawan' : 'Dukungan Penanaman'}
            </h2>
            {activeTab !== 'settings' && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                  <input type="text" placeholder={t('admin_portal_search')} style={{ padding: '10px 16px 10px 40px', borderRadius: '12px', border: '1px solid #dee2e6', outline: 'none', width: '240px' }} />
                </div>
                <button style={{ background: '#f8f9fa', border: '1px solid #dee2e6', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}><Filter size={20} /></button>
                <button style={{ background: '#f8f9fa', border: '1px solid #dee2e6', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}><Download size={20} /></button>
              </div>
            )}
          </div>

          {activeTab === 'settings' ? (
            <div style={{ maxWidth: '800px', background: '#f8f9fa', padding: '30px', borderRadius: '20px', border: '1px solid #dee2e6' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                Ubah parameter di bawah ini untuk memperbarui kalkulasi AI Forecast, Penyerapan Karbon, dan Dampak Lingkungan secara instan di seluruh website BaMbooChain.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                {[
                  { id: 'biomassPerClump', label: 'Biomassa per Rumpun (Ton)', icon: <Leaf size={16} /> },
                  { id: 'co2PerClump', label: 'Karbon Terserap per Rumpun (Ton)', icon: <Wind size={16} /> },
                  { id: 'waterPerClump', label: 'Air Tersimpan per Rumpun (Liter)', icon: <Droplets size={16} /> },
                  { id: 'carbonSpotPrice', label: 'Harga Spot Karbon ($ / Ton)', icon: <DollarSign size={16} /> },
                  { id: 'oxygenPerClump', label: 'Oksigen Dihasilkan per Rumpun (Ton)', icon: <Activity size={16} /> },
                  { id: 'landPerClump', label: 'Luas Lahan per Rumpun (Hektar)', icon: <MapPin size={16} /> }
                ].map(field => (
                  <div key={field.id} style={{ background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #dee2e6' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      <span style={{ marginRight: '6px', color: 'var(--primary)', verticalAlign: 'middle' }}>{field.icon}</span>
                      {field.label}
                    </label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={settingsForm[field.id]}
                      onChange={e => setSettingsForm({...settingsForm, [field.id]: parseFloat(e.target.value) || 0})}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '1rem', fontWeight: 'bold' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={handleSaveSettings}
                  style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(12, 166, 120, 0.3)' }}
                >
                  <Save size={18} /> Simpan Pengaturan Global
                </button>
              </div>
            </div>
          ) : activeTab === 'volunteers' ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f3f5', backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '16px', color: '#495057', fontSize: '0.85rem' }}>Nama Relawan</th>
                    <th style={{ padding: '16px', color: '#495057', fontSize: '0.85rem' }}>Destinasi Host</th>
                    <th style={{ padding: '16px', color: '#495057', fontSize: '0.85rem' }}>Periode Kunjungan</th>
                    <th style={{ padding: '16px', color: '#495057', fontSize: '0.85rem' }}>Pesan Motivasi</th>
                    <th style={{ padding: '16px', color: '#495057', fontSize: '0.85rem' }}>Status</th>
                    <th style={{ padding: '16px', color: '#495057', fontSize: '0.85rem', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteerApps.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#868e96' }}>Belum ada pendaftaran relawan masuk.</td>
                    </tr>
                  ) : (
                    volunteerApps.map((app) => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                        <td style={{ padding: '20px 16px' }}>
                          <div style={{ fontWeight: 'bold', color: '#212529' }}>{app.userName}</div>
                          <div style={{ fontSize: '0.8rem', color: '#868e96' }}>{app.userEmail}</div>
                        </td>
                        <td style={{ padding: '20px 16px', fontSize: '0.9rem', fontWeight: '600' }}>
                          {app.hostName}
                        </td>
                        <td style={{ padding: '20px 16px', fontSize: '0.85rem' }}>
                          <div>Mulai: {app.startDate}</div>
                          <div>Selesai: {app.endDate}</div>
                        </td>
                        <td style={{ padding: '20px 16px', fontSize: '0.85rem', color: '#495057', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={app.motivation}>
                          {app.motivation}
                        </td>
                        <td style={{ padding: '20px 16px' }}>
                          <span style={{ 
                            padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                            background: app.status === 'verified' ? '#ebfbee' : app.status === 'pending' ? '#fff9db' : '#fff5f5',
                            color: app.status === 'verified' ? '#2b8a3e' : app.status === 'pending' ? '#e67700' : '#e03131'
                          }}>
                            {app.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            {app.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleApproveVolunteer(app)} 
                                  style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#40c057', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                  title="Setujui & Berikan Reputasi (XP)"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button 
                                  onClick={() => handleRejectVolunteer(app.id)} 
                                  style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#fa5252', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                  title="Tolak"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                            {app.status !== 'pending' && (
                              <span style={{ fontSize: '0.85rem', color: '#868e96' }}>Selesai</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'events' ? (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button 
                  onClick={() => setEventViewType('registrations')}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: eventViewType === 'registrations' ? '#1c7ed6' : '#e9ecef', color: eventViewType === 'registrations' ? 'white' : '#495057', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Pendaftar (Registrasi)
                </button>
                <button 
                  onClick={() => setEventViewType('attendance')}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: eventViewType === 'attendance' ? '#1c7ed6' : '#e9ecef', color: eventViewType === 'attendance' ? 'white' : '#495057', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Daftar Hadir (Absensi)
                </button>
                <button 
                  onClick={() => setEventViewType('finance')}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: eventViewType === 'finance' ? '#1c7ed6' : '#e9ecef', color: eventViewType === 'finance' ? 'white' : '#495057', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <DollarSign size={16} /> Laporan Keuangan
                </button>
              </div>

              {eventViewType === 'finance' ? (
                <div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '20px', borderRadius: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#111' }}>Workshop & FGD Capacity Building Perancangan Prototype Rumah Modular Bambu</h3>
                      <p style={{ margin: 0, color: '#495057', fontSize: '0.9rem' }}>Rencana Anggaran Biaya (RAB): <strong style={{ color: '#e03131' }}>Rp 17.991.000</strong></p>
                    </div>
                    <button 
                      onClick={handleDisburseFunds}
                      disabled={isProcessingTx || eventTransactions.some(tx => tx.eventId === 'fgd-rumah-modular-2026' && tx.type === 'TREASURY_DISBURSEMENT')}
                      style={{ 
                        backgroundColor: eventTransactions.some(tx => tx.eventId === 'fgd-rumah-modular-2026' && tx.type === 'TREASURY_DISBURSEMENT') ? '#51cf66' : '#fab005', 
                        color: 'black', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: isProcessingTx ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                      }}
                    >
                      {isProcessingTx ? 'Memproses...' : eventTransactions.some(tx => tx.eventId === 'fgd-rumah-modular-2026' && tx.type === 'TREASURY_DISBURSEMENT') ? <><CheckCircle size={18} /> Dana Telah Dicairkan</> : <><Activity size={18} /> Cairkan Dana Treasury (PKR Bambu)</>}
                    </button>
                  </div>

                  <h4 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Riwayat Transaksi Treasury</h4>
                  <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f3f5', backgroundColor: '#f8f9fa' }}>
                          <th style={{ padding: '16px', color: '#495057', fontSize: '0.85rem' }}>Tanggal & Waktu</th>
                          <th style={{ padding: '16px', color: '#495057', fontSize: '0.85rem' }}>Tipe Transaksi</th>
                          <th style={{ padding: '16px', color: '#495057', fontSize: '0.85rem' }}>Admin Eksekutor</th>
                          <th style={{ padding: '16px', color: '#495057', fontSize: '0.85rem' }}>Sumber → Tujuan</th>
                          <th style={{ padding: '16px', color: '#495057', fontSize: '0.85rem', textAlign: 'right' }}>Jumlah (IDR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventTransactions.filter(tx => tx.eventId === 'fgd-rumah-modular-2026').length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#868e96' }}>Belum ada transaksi pencairan dana untuk event ini.</td>
                          </tr>
                        ) : (
                          eventTransactions.filter(tx => tx.eventId === 'fgd-rumah-modular-2026').map(tx => (
                            <tr key={tx.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                              <td style={{ padding: '16px', fontSize: '0.9rem' }}>{tx.timestamp ? new Date(tx.timestamp.toDate()).toLocaleString('id-ID') : 'Baru saja'}</td>
                              <td style={{ padding: '16px' }}><span style={{ backgroundColor: '#ebfbee', color: '#2b8a3e', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>{tx.type}</span></td>
                              <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: 'bold' }}>@{tx.adminUsername}</td>
                              <td style={{ padding: '16px', fontSize: '0.85rem' }}>
                                <div style={{ color: '#e03131', fontWeight: 'bold' }}>Dari: {tx.source}</div>
                                <div style={{ color: '#1c7ed6', fontWeight: 'bold' }}>Ke: {tx.destination}</div>
                              </td>
                              <td style={{ padding: '16px', fontSize: '1rem', fontWeight: 'bold', textAlign: 'right', color: '#2b8a3e' }}>Rp {tx.amountIDR.toLocaleString('id-ID')}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f3f5' }}>
                      <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>{eventViewType === 'registrations' ? 'Nama Pendaftar' : 'Nama Peserta Hadir'}</th>
                      <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>Event</th>
                      <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>{eventViewType === 'registrations' ? 'Detail Kontak' : 'Waktu Hadir'}</th>
                      {eventViewType === 'registrations' && <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>Status</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {eventViewType === 'registrations' ? (
                      eventRegistrations.map((reg) => (
                        <tr key={reg.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                          <td style={{ padding: '20px 16px' }}>
                            <div style={{ fontWeight: 'bold' }}>{reg.identity?.fullName || 'Anonim'}</div>
                            <div style={{ fontSize: '0.8rem', color: '#868e96' }}>{reg.arrival?.originCity || '-'}</div>
                          </td>
                          <td style={{ padding: '20px 16px', fontSize: '0.9rem', fontWeight: '600' }}>
                            {reg.eventTitle}
                          </td>
                          <td style={{ padding: '20px 16px' }}>
                            <div style={{ fontSize: '0.85rem' }}>{reg.identity?.email}</div>
                            <div style={{ fontSize: '0.85rem', color: '#1c7ed6' }}>{reg.identity?.phone}</div>
                          </td>
                          <td style={{ padding: '20px 16px' }}>
                            <span style={{ 
                              padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                              background: reg.status === 'verified' ? '#ebfbee' : '#fff9db',
                              color: reg.status === 'verified' ? '#2b8a3e' : '#e67700'
                            }}>
                              {reg.status?.toUpperCase() || 'PENDING'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      eventAttendance.map((att) => (
                        <tr key={att.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                          <td style={{ padding: '20px 16px', fontWeight: 'bold' }}>
                            {att.username || 'Anonim'}
                          </td>
                          <td style={{ padding: '20px 16px', fontSize: '0.9rem', fontWeight: '600' }}>
                            {att.eventTitle}
                          </td>
                          <td style={{ padding: '20px 16px', fontSize: '0.9rem', color: '#495057' }}>
                            {att.timestamp ? new Date(att.timestamp.toDate()).toLocaleString('id-ID') : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f3f5' }}>
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>{activeTab === 'partners' ? t('admin_portal_table_name') : activeTab === 'donations' ? 'Nama Donatur' : activeTab === 'careers' ? 'Posisi / Judul' : t('admin_portal_table_loc_name')}</th>
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>{activeTab === 'partners' ? t('admin_portal_table_role') : activeTab === 'donations' ? 'Lokasi & Paket' : activeTab === 'careers' ? 'Lokasi & Jenis' : t('admin_portal_table_owner')}</th>
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>{activeTab === 'donations' ? 'Nominal & Metode' : activeTab === 'careers' ? 'Pengirim' : t('admin_portal_table_date')}</th>
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem' }}>{activeTab === 'donations' ? 'Tanggal & Status' : t('admin_portal_table_status')}</th>
                  <th style={{ padding: '16px', color: '#868e96', fontSize: '0.85rem', textAlign: 'center' }}>{t('admin_portal_table_action')}</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === 'partners' ? (
                  partnerApps.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid #f1f3f5', transition: '0.2s' }}>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontWeight: 'bold', color: '#212529' }}>{app.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#868e96' }}>{app.location}</div>
                      </td>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{app.role}</div>
                        <div style={{ fontSize: '0.8rem', color: '#1c7ed6' }}>{app.method}</div>
                      </td>
                      <td style={{ padding: '20px 16px', fontSize: '0.9rem' }}>{app.date}</td>
                      <td style={{ padding: '20px 16px' }}>
                        <span style={{ 
                          padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                          background: app.status === 'verified' ? '#ebfbee' : app.status === 'pending' ? '#fff9db' : '#fff5f5',
                          color: app.status === 'verified' ? '#2b8a3e' : app.status === 'pending' ? '#e67700' : '#e03131'
                        }}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button onClick={() => alert('Detail Mitra')} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #dee2e6', background: 'white', cursor: 'pointer' }}><Eye size={16} /></button>
                          {app.status === 'pending' && (
                            <>
                              <button onClick={() => handleApprovePartner(app)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#40c057', color: 'white', cursor: 'pointer' }}><CheckCircle size={16} /></button>
                              <button onClick={() => handleRejectPartner(app.id)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#fa5252', color: 'white', cursor: 'pointer' }}><XCircle size={16} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'locations' ? (
                  locationProposals.map((loc) => (
                    <tr key={loc.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontWeight: 'bold' }}>{loc.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#868e96' }}>{loc.coordinates}</div>
                      </td>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{loc.owner}</div>
                        <div style={{ fontSize: '0.8rem', color: '#1c7ed6' }}>{loc.size}</div>
                      </td>
                      <td style={{ padding: '20px 16px', fontSize: '0.9rem' }}>{loc.date}</td>
                      <td style={{ padding: '20px 16px' }}>
                        <span style={{ 
                          padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                          background: loc.status === 'verified' ? '#ebfbee' : '#fff9db',
                          color: loc.status === 'verified' ? '#2b8a3e' : '#e67700'
                        }}>
                          {loc.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                         <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid #dee2e6', background: 'white', cursor: 'pointer' }}><Eye size={16} /></button>
                          {loc.status === 'pending' && (
                             <button onClick={() => handleApproveLocation(loc.id)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#40c057', color: 'white', cursor: 'pointer' }}><CheckCircle size={16} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'careers' ? (
                  [...pendingJobs.map(j => ({...j, source: 'career_job_posts'})), ...pendingDemands.map(d => ({...d, source: 'career_demand_posts'}))].map((post) => (
                    <tr key={post.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontWeight: 'bold' }}>{post.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#868e96' }}>{post.department || post.category}</div>
                      </td>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{post.location}</div>
                        <div style={{ fontSize: '0.8rem', color: '#1c7ed6' }}>{post.type || 'Kebutuhan Tim'}</div>
                      </td>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{post.submittedByName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#868e96' }}>{post.bambooChat ? `@${post.bambooChat}` : post.contactName}</div>
                      </td>
                      <td style={{ padding: '20px 16px' }}>
                        <span style={{ 
                          padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                          background: post.status === 'verified' ? '#ebfbee' : '#fff9db',
                          color: post.status === 'verified' ? '#2b8a3e' : '#e67700'
                        }}>
                          {post.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                         <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid #dee2e6', background: 'white', cursor: 'pointer' }}><Eye size={16} /></button>
                          {post.status === 'pending' && (
                            <>
                              <button onClick={() => handleApproveCareer(post.id, post.source)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#40c057', color: 'white', cursor: 'pointer' }}><CheckCircle size={16} /></button>
                              <button onClick={() => handleRejectCareer(post.id, post.source)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#fa5252', color: 'white', cursor: 'pointer' }}><XCircle size={16} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  plantationDonations.map((don) => (
                    <tr key={don.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontWeight: 'bold' }}>{don.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#868e96' }}>@{don.username}</div>
                      </td>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{don.location?.name || '-'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#1c7ed6' }}>{don.package?.name || '-'}</div>
                      </td>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>{don.amount} USDT</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{don.paymentMethod}</div>
                      </td>
                      <td style={{ padding: '20px 16px' }}>
                        <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>{don.date}</div>
                        <span style={{ 
                          padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                          background: don.status === 'verified' ? '#ebfbee' : '#fff9db',
                          color: don.status === 'verified' ? '#2b8a3e' : '#e67700'
                        }}>
                          {don.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                         <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid #dee2e6', background: 'white', cursor: 'pointer' }}><Eye size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminPortalPage;
