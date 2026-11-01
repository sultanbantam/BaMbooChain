import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaDownload } from 'react-icons/fa';
import { getAssetUrl } from '../../utils/assets';
import { eventsData, featuredEventData } from '../../utils/eventsData';
import { useApprovedCommunityEvents, deleteCommunityEvent } from '../../hooks/useFirestoreQueries';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import EventRegistrationModal from '../../components/community/EventRegistrationModal';
import SocialInteractions from '../../components/SocialInteractions';

const EventsPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.username === 'albantani' || user?.name === 'albantani' || user?.email === 'sultanbantam@gmail.com';

  const canManageEvent = (ev) => {
    if (!user || !ev) return false;
    if (isAdmin) return true;
    return (
      ev.organizerId === user.id ||
      ev.organizerName === user.name ||
      ev.organizerName === user.username ||
      (ev.organizer && (ev.organizer === user.name || ev.organizer === user.username))
    );
  };

  const handleEditClick = (ev) => {
    window.location.hash = `#/event-organizer?edit=${ev.id}`;
  };

  const handleDeleteClick = async (ev) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus acara "${ev.title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    try {
      await deleteCommunityEvent(ev.id);
      alert(`Acara "${ev.title}" berhasil dihapus.`);
      window.location.reload();
    } catch (err) {
      console.error("Gagal menghapus acara:", err);
      alert("Gagal menghapus acara. Silakan coba lagi.");
    }
  };

  // Instant LocalStorage Cache to eliminate any seconds-long delay / old event flashing
  const [cachedEvents, setCachedEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('cached_community_events');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const { data: communityEvents = [], isLoading } = useApprovedCommunityEvents();

  useEffect(() => {
    if (communityEvents && communityEvents.length > 0) {
      setCachedEvents(communityEvents);
      try {
        localStorage.setItem('cached_community_events', JSON.stringify(communityEvents));
      } catch (e) {}
    }
  }, [communityEvents]);

  const activeCommunityEvents = (communityEvents && communityEvents.length > 0)
    ? communityEvents
    : cachedEvents;

  const parseEventDate = (dateStr) => {
    if (!dateStr) return 0;
    
    const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10)).getTime();
    }
    
    const monthMap = {
      'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5,
      'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11,
      'january': 0, 'february': 1, 'march': 2, 'may': 4, 'june': 5, 'july': 6,
      'august': 7, 'october': 9, 'december': 11
    };
    const dayMatch = dateStr.match(/^(\d+)/);
    const yearMatch = dateStr.match(/(\d{4})/);
    const monthMatch = dateStr.match(/[a-zA-Z]+/);
    if (dayMatch && yearMatch && monthMatch) {
      const day = parseInt(dayMatch[1], 10);
      const year = parseInt(yearMatch[1], 10);
      const month = monthMap[monthMatch[0].toLowerCase()] || 0;
      return new Date(year, month, day).getTime();
    }
    return 0;
  };

  const nowTime = new Date().setHours(0, 0, 0, 0);

  const mappedCommunityEvents = activeCommunityEvents.map(ev => {
    const isUganda = ev.title?.toLowerCase().includes('uganda');
    return {
      id: ev.id,
      title: ev.title || 'Acara Komunitas',
      date: ev.date || (ev.startDate ? `${ev.startDate} s/d ${ev.endDate || ''}` : 'Segera Hadir'),
      time: ev.time || (ev.startTime ? `${ev.startTime} - ${ev.endTime || ''} WIB` : '09:00 - 17:00 WIB'),
      location: ev.location || 'Indonesia',
      category: ev.category || ev.customCategory || 'Komunitas',
      image: ev.image || getAssetUrl(isUganda ? 'event/uganda.jpg' : 'event/cibarani-baduy.jpg'),
      color: '#51cf66',
      speakers: ev.speakers || [],
      materials: ev.materials || (ev.materialUrl ? [{ title: ev.materialName || 'Materi Acara', fileUrl: ev.materialUrl }] : []),
      description: ev.description || '',
      organizerId: ev.organizerId || null,
      organizerName: ev.organizerName || 'Panitia Acara',
      financialReport: ev.financialReport || null,
      eventType: ev.eventType || 'general',
      isPaid: ev.isPaid || false,
      ticketPrice: ev.ticketPrice || '',
      ticketBmc: ev.ticketBmc || '',
      meetingPoint: ev.meetingPoint || '',
      gearList: ev.gearList || '',
      facilityList: ev.facilityList || '',
      prizePool: ev.prizePool || '',
      itineraryText: ev.itineraryText || '',
      customTerms: ev.customTerms || ''
    };
  });

  // Prioritize active community events FIRST so the latest event is ALWAYS featured immediately
  const allEvents = mappedCommunityEvents.length > 0
    ? [...mappedCommunityEvents, ...eventsData]
    : [...eventsData, featuredEventData];

  const sortedEvents = allEvents.sort((a, b) => {
    const timeA = parseEventDate(a.date);
    const timeB = parseEventDate(b.date);
    const isPastA = timeA > 0 && timeA < nowTime;
    const isPastB = timeB > 0 && timeB < nowTime;

    if (isPastA && !isPastB) return 1;
    if (!isPastA && isPastB) return -1;
    if (!isPastA && !isPastB) return timeA - timeB; // Closest future event first
    return timeB - timeA; // Most recent past event first
  });

  const featuredEvent = sortedEvents.length > 0 ? sortedEvents[0] : (mappedCommunityEvents[0] || featuredEventData);
  const gridEvents = sortedEvents.slice(1);

  // Auto-open modal if URL contains ?event={id}
  useEffect(() => {
    if (allEvents.length === 0) return;
    const fullHref = window.location.href;
    const match = fullHref.match(/[?&]event=([^&#]+)/);
    if (match && match[1]) {
      const targetId = decodeURIComponent(match[1]);
      const found = allEvents.find(e => String(e.id) === targetId);
      if (found) {
        setSelectedEvent(found);
        setIsModalOpen(true);
      }
    }
  }, [allEvents.length]);

  const getEventShareTitle = (ev) => {
    if (!ev) return "Lihat acara di BaMbooChain!";

    const isAdventure = (ev.category || "").toLowerCase().includes("wisata") ||
                        (ev.category || "").toLowerCase().includes("adventure") ||
                        (ev.title || "").toLowerCase().includes("escape") ||
                        (ev.title || "").toLowerCase().includes("baduy");

    const isLomba = (ev.category || "").toLowerCase().includes("kompetisi") ||
                    (ev.category || "").toLowerCase().includes("lomba") ||
                    (ev.category || "").toLowerCase().includes("sayembara");

    const isWebinarOrFGD = (ev.category || "").toLowerCase().includes("webinar") ||
                           (ev.category || "").toLowerCase().includes("fgd") ||
                           (ev.category || "").toLowerCase().includes("seminar") ||
                           (ev.category || "").toLowerCase().includes("workshop");

    let hookHeadline = "";
    let hookBody = "";

    if (isAdventure) {
      hookHeadline = "🌿 *WEEKEND ESCAPE: RECHARGE ENERGI & PETUALANGAN HIJAU NUSANTARA!* 🎋";
      hookBody = "Bosan akhir pekan cuma rebahan atau terjebak macet perkotaan? 🍃\nSaatnya rasakan pengalaman istimewa menjelajahi keindahan alam, kearifan adat, dan ketenangan desa asri bersama komunitas BaMbooChain!\n\n✨ *Highlight Pengalaman:*\n• Eksplorasi alam asri, trekking hijau & kearifan adat Baduy & Kasepuhan Cibarani\n• Belajar filosofi hidup lestari & aksi nyata pelestarian bambu nusantara\n• Camping & kebersamaan hangat dengan sesama pegiat alam\n• 🎁 *Reward Web3:* Dapatkan *+20 Poin & Token BMC* terverifikasi di *BaMbooChainID Passport*!";
    } else if (isLomba) {
      hookHeadline = "🏆 *CALLING ALL CREATORS: SAATNYA INOVASIMU MENGUBAH DUNIA!* 🌟";
      hookBody = "Tantang kreativitas dan keahlianmu dalam kompetisi karya bambu berkelanjutan!\nTunjukkan karyamu kepada dewan juri profesional dan raih apresiasi nyata.\n\n✨ *Keuntungan & Benefit:*\n• Total hadiah bernilai jutaan rupiah & penghargaan ekosistem hijau\n• Eksposur karya ke jaringan industri dan arsitek nasional\n• 🎁 *Reward Web3:* Dapatkan sertifikat terverifikasi, *Poin Komunitas & Token BMC* di *BaMbooChainID Passport*!";
    } else if (isWebinarOrFGD) {
      hookHeadline = "💡 *UPGRADE WAWASAN & JARINGAN MASA DEPAN HIJAU BERSAMA PAKAR!* 🎓";
      hookBody = "Ingin memperdalam keilmuan seputar sains, teknologi, dan ekonomi sirkular bambu?\nBergabunglah bersama para narasumber ahli di forum diskusi eksklusif ini!\n\n✨ *Fasilitas & Insight:*\n• Ilmu langsung dari para praktisi dan pemangku kebijakan\n• Sesi diskusi interaktif & tanya jawab terbuka\n• 🎁 *Reward Web3:* Dapatkan materi eksklusif, sertifikat digital & *Token BMC / Poin* di *BaMbooChainID Passport*!";
    } else {
      hookHeadline = "🎋 *AGENDA SPESIAL KOMUNITAS BAMBOOCHAIN NUSANTARA!* ✨";
      hookBody = "Mari bergabung dalam agenda kolaborasi hijau demi menjaga bumi dan membangun masa depan berkelanjutan!\n\n✨ *Kenapa Kamu Wajib Hadir?*\n• Memperluas silaturahmi & jejaring komunitas bambu nusantara\n• Ikut serta dalam gerakan nyata ekonomi hijau sirkular\n• 🎁 *Reward Web3:* Raih *+20 Poin & Token BMC* terverifikasi di *BaMbooChainID Passport*!";
    }

    const shareEventUrl = `https://www.bamboochain.id/event/${ev.id || "featured"}`;
    const calendarUrl = "https://www.bamboochain.id/#/events";

    let msg = `${hookHeadline}\n\n`;
    msg += `📌 *${ev.title}*\n\n`;
    msg += `${hookBody}\n\n`;
    msg += `📅 *Waktu:* ${ev.date || "Sesuai Jadwal"} (${ev.time || "WIB"})\n`;
    msg += `📍 *Lokasi:* ${ev.location || "Indonesia"}\n`;
    if (ev.isPaid && ev.ticketPrice) {
      const priceFormatted = Number(String(ev.ticketPrice).replace(/[^0-9]/g, "")).toLocaleString("id-ID");
      msg += `🎟️ *Investasi Tiket:* Rp ${priceFormatted} ${ev.ticketBmc ? `(${ev.ticketBmc} BMC)` : ""}\n`;
    }
    msg += "\n⚡ _*Kuota terbatas demi menjaga kenyamanan dan ketertiban kegiatan!*_\n";
    msg += "Amankan pendaftaranmu sekarang sebelum kehabisan:\n\n";
    msg += `👉 *Ikuti Acara Langsung:*\n${shareEventUrl}\n\n`;
    msg += `🔗 *Link Kalender Event:* [BaMbooChain - Web3 Green Bamboo Ecosystem](${calendarUrl})\n\n`;
    msg += "Sampai jumpa di lokasi acara! Salam Lestari Bambu Nusantara 🎋";

    return msg;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0a0f0a',
      color: 'white',
      paddingTop: 'clamp(140px, 18vw, 200px)',
      paddingBottom: '80px',
      paddingLeft: 'clamp(12px, 3vw, 20px)',
      paddingRight: 'clamp(12px, 3vw, 20px)',
      fontFamily: 'sans-serif',
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    },
    wrapper: {
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      boxSizing: 'border-box'
    },
    header: {
      marginBottom: '35px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '15px',
      width: '100%',
      boxSizing: 'border-box'
    },
    title: {
      fontSize: 'clamp(1.8rem, 6vw, 3rem)',
      fontWeight: '900',
      margin: 0,
      textTransform: 'uppercase',
      letterSpacing: '-0.5px',
      textAlign: 'center',
      maxWidth: '100%',
      wordBreak: 'break-word'
    },
    highlight: {
      color: '#51cf66'
    },
    subtitle: {
      color: '#adb5bd',
      fontSize: 'clamp(0.88rem, 3.2vw, 1.05rem)',
      lineHeight: '1.6',
      maxWidth: '650px',
      margin: '0 auto',
      textAlign: 'center',
      wordBreak: 'break-word',
      boxSizing: 'border-box'
    },
    featuredCard: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '24px',
      overflow: 'hidden',
      marginBottom: '50px',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgba(255,255,255,0.1)',
      cursor: 'pointer',
      width: '100%',
      boxSizing: 'border-box'
    },
    featuredImg: {
      width: '100%',
      height: 'auto',
      maxHeight: '480px',
      objectFit: 'contain',
      backgroundColor: '#0a0a0a'
    },
    featuredContent: {
      padding: 'clamp(16px, 4vw, 30px)',
      width: '100%',
      boxSizing: 'border-box'
    },
    badge: {
      display: 'inline-block',
      padding: '8px 16px',
      borderRadius: '20px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.8rem',
      marginBottom: '20px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
      gap: '24px',
      width: '100%',
      boxSizing: 'border-box'
    },
    card: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '24px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease'
    },
    cardImg: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    cardBody: {
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    },
    cardTitle: {
      fontSize: '1.3rem',
      fontWeight: '800',
      marginBottom: '15px',
      color: 'white'
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#adb5bd',
      marginBottom: '12px',
      fontSize: '0.95rem'
    },
    btn: {
      width: '100%',
      padding: '15px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '16px',
      color: 'white',
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontSize: '0.75rem',
      cursor: 'pointer',
      marginTop: 'auto'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <header style={styles.header}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={styles.header}>
              <h1 style={{...styles.title, textTransform: 'uppercase'}}>{t('event_page_title')}</h1>
              <p style={styles.subtitle}>
                {t('event_page_subtitle')}
              </p>
            </div>
          </motion.div>
        </header>

        {/* Featured Card */}
        <motion.div 
          style={styles.featuredCard}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.01 }}
        >
          <img 
            src={featuredEvent.image || getAssetUrl('event/serentaun.png')} 
            style={styles.featuredImg}
            alt={featuredEvent.title}
          />
          <div style={styles.featuredContent}>
            <div style={styles.badge}>{featuredEvent.category || 'Featured Event'}</div>
            {!featuredEvent.hideTitleOnBanner && (
              <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '20px' }}>
                {featuredEvent.title}
              </h2>
            )}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCalendarAlt color="#51cf66" /> {featuredEvent.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaClock color="#51cf66" /> {featuredEvent.time}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaMapMarkerAlt color="#51cf66" /> {featuredEvent.location}
              </span>
            </div>

            {featuredEvent.materials && featuredEvent.materials.length > 0 && (
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {featuredEvent.materials.map((mat, idx) => (
                  <a
                    key={idx}
                    href={mat.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(81, 207, 102, 0.15)',
                      border: '1px solid rgba(81, 207, 102, 0.3)',
                      color: '#51cf66',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      textDecoration: 'none'
                    }}
                  >
                    <FaDownload size={12} /> Unduh: {mat.title}
                  </a>
                ))}
              </div>
            )}

            <button 
              style={{ 
                padding: '15px 30px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', 
                border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '15px', fontWeight: '900', cursor: 'pointer',
                width: '100%', marginBottom: '10px', backdropFilter: 'blur(5px)'
              }}
              onClick={() => {
                setSelectedEvent(featuredEvent);
                setIsModalOpen(true);
              }}
            >
              {t('event_join_btn')}
            </button>

            {canManageEvent(featuredEvent) && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleEditClick(featuredEvent)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    backgroundColor: '#fab005',
                    color: 'black',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  ✏️ Edit Acara & Materi
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(featuredEvent)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: 'rgba(224, 49, 49, 0.2)',
                    border: '1px solid #e03131',
                    color: '#ff8787',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  🗑️ Hapus
                </button>
              </div>
            )}
            <SocialInteractions 
              entityId={featuredEvent.id} 
              inCard={true} 
              customShareTitle={getEventShareTitle(featuredEvent)}
              customShareUrl={`https://www.bamboochain.id/event/${featuredEvent.id}`} />
              </div>
            </motion.div>

        {/* Event List */}
        {isLoading && <div style={{ textAlign: 'center', padding: '40px', color: '#51cf66' }}>Memuat daftar acara...</div>}
        <div style={styles.grid}>
          {gridEvents.map((event, index) => (
            <motion.div
              key={index}
              style={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ borderColor: '#51cf66', transform: 'translateY(-5px)' }}
            >
              <img src={event.image} alt={event.title} style={styles.cardImg} />
              <div style={styles.cardBody}>
                <div style={{ ...styles.badge, backgroundColor: event.color, color: 'white', marginBottom: '15px' }}>
                  {event.category}
                </div>
                <h3 style={styles.cardTitle}>{event.title}</h3>
                <div style={{ marginBottom: '20px' }}>
                  <div style={styles.infoRow}><FaCalendarAlt color={event.color} /> {event.date}</div>
                  <div style={styles.infoRow}><FaClock color={event.color} /> {event.time}</div>
                  <div style={styles.infoRow}><FaMapMarkerAlt color={event.color} /> {event.location}</div>
                </div>

                {event.materials && event.materials.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    {event.materials.map((mat, mIdx) => (
                      <a 
                        key={mIdx}
                        href={mat.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(81, 207, 102, 0.1)',
                          border: '1px solid rgba(81, 207, 102, 0.3)',
                          color: '#51cf66',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textDecoration: 'none',
                          marginBottom: '6px',
                          width: '100%',
                          justifyContent: 'center'
                        }}
                      >
                        <FaDownload size={11} /> Unduh: {mat.title}
                      </a>
                    ))}
                  </div>
                )}

                <button 
                  style={styles.btn}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = event.color; e.target.style.color = 'white'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.target.style.color = 'white'; }}
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsModalOpen(true);
                  }}
                >
                  {t('event_join_btn')}
                </button>

                {canManageEvent(event) && (
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleEditClick(event)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        backgroundColor: '#fab005',
                        color: 'black',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(event)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'rgba(224, 49, 49, 0.2)',
                        border: '1px solid #e03131',
                        color: '#ff8787',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                )}
                <SocialInteractions 
                  entityId={event.id} 
                  inCard={true} 
                  customShareTitle={getEventShareTitle(event)}
                  customShareUrl={`https://www.bamboochain.id/event/${event.id}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <EventRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        eventData={selectedEvent}
      />
    </div>
  );
};

export default EventsPage;

