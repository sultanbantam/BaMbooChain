import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaDownload } from 'react-icons/fa';
import { getAssetUrl } from '../../utils/assets';
import { eventsData, featuredEventData } from '../../utils/eventsData';
import { useApprovedCommunityEvents } from '../../hooks/useFirestoreQueries';
import { useLanguage } from '../../context/LanguageContext';
import EventRegistrationModal from '../../components/community/EventRegistrationModal';
import SocialInteractions from '../../components/SocialInteractions';

const EventsPage = () => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: communityEvents = [], isLoading } = useApprovedCommunityEvents();

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

  const allEvents = [...eventsData, featuredEventData, ...communityEvents.map(ev => {
    const isUganda = ev.title?.toLowerCase().includes('uganda');
    const isRevolusi = ev.title?.includes('Revolusi Sebatang Bambu');
    const isSNAI = ev.title?.includes('Optimalisasi Teknologi');
    
    let eventMaterials = ev.materials || [];
    if (ev.materialUrl) {
      eventMaterials = [
        ...eventMaterials,
        { title: ev.materialName || 'Materi Presentasi Acara', fileUrl: ev.materialUrl }
      ];
    }

    const eventDate = isUganda 
      ? '1-5 September 2026' 
      : (ev.startDate && ev.endDate && ev.startDate !== ev.endDate 
          ? `${ev.startDate} s/d ${ev.endDate}` 
          : (ev.date || ev.startDate || 'TBA'));

    const eventTime = isUganda 
      ? '09:00 Sampai Dengan Selesai' 
      : (isRevolusi 
          ? '09.00 - 17.00 WIB' 
          : (ev.startTime && ev.endTime 
              ? `${ev.startTime} - ${ev.endTime} WIB` 
              : (ev.time || '09:00 - 16:00 WIB')));

    return {
      id: ev.id,
      title: isRevolusi ? 'Field Visit: Revolusi Sebatang Bambu di Indonesia Studi Lapangan Ekosistem Bambu Tangerang Raya bersama Tim Pusat Studi Arsitektur Nusantara FTSP Universitas Trisakti' : ev.title,
      date: eventDate,
      time: eventTime,
      location: ev.location,
      category: ev.category,
      description: ev.description,
      image: isUganda ? getAssetUrl('event/banner.png') : (isRevolusi ? getAssetUrl('event/ebtr.png') : (isSNAI ? getAssetUrl('event/snai.png') : (ev.image || ev.bannerUrl || getAssetUrl('event/placeholder.jpg')))),
      color: '#fab005', // default color for community events
      organizer: ev.organizerName,
      speakers: isRevolusi ? [
        { name: 'Mukoddas Syuhada', role: 'Narasumber Utama', cvUrl: getAssetUrl('event/cv.pdf') }
      ] : ev.speakers,
      materials: isRevolusi ? [
        { title: 'Itinerary Kegiatan', fileUrl: getAssetUrl('event/itinerary.pdf') },
        { title: 'Materi Acara', fileUrl: getAssetUrl('event/materi.pdf') },
        { title: 'Materi BLL', fileUrl: getAssetUrl('event/bll.pdf') },
        { title: 'Materi Tambahan 2', fileUrl: getAssetUrl('event/materi2.pdf') }
      ] : eventMaterials
    };
  })];

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

  const featuredEvent = sortedEvents.length > 0 ? sortedEvents[0] : featuredEventData;
  const gridEvents = sortedEvents.slice(1);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0a0f0a',
      color: 'white',
      paddingTop: '220px',
      paddingBottom: '80px',
      paddingLeft: '20px',
      paddingRight: '20px',
      fontFamily: 'sans-serif'
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '50px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '20px'
    },
    title: {
      fontSize: 'clamp(2rem, 8vw, 3.5rem)',
      fontWeight: '900',
      margin: 0,
      textTransform: 'uppercase',
      letterSpacing: '-1px'
    },
    highlight: {
      color: '#51cf66'
    },
    subtitle: {
      color: '#adb5bd',
      fontSize: '1.1rem',
      lineHeight: '1.6',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%'
    },
    featuredCard: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '30px',
      overflow: 'hidden',
      marginBottom: '60px',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgba(255,255,255,0.1)',
      cursor: 'pointer'
    },
    featuredImg: {
      width: '100%',
      height: 'auto',
      maxHeight: '500px',
      objectFit: 'contain',
      backgroundColor: '#0a0a0a'
    },
    featuredContent: {
      padding: '30px',
      width: '100%'
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '30px'
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
            <SocialInteractions 
              entityId={featuredEvent.id} 
              inCard={true} 
              customShareTitle={`Acara BaMbooChain: ${featuredEvent.title}\n📅 ${featuredEvent.date}\n📍 ${featuredEvent.location}\n\nMari ikuti acara ini!`}
              customShareUrl={`https://www.bamboochain.id/#/events`}
            />
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
                <SocialInteractions 
                  entityId={event.id} 
                  inCard={true} 
                  customShareTitle={`Acara BaMbooChain: ${event.title}\n📅 ${event.date}\n📍 ${event.location}\n\nMari ikuti acara ini!`}
                  customShareUrl={`https://www.bamboochain.id/#/events`}
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
