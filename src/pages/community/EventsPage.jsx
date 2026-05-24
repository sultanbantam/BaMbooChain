import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import { getAssetUrl } from '../../utils/assets';
import EventRegistrationModal from '../../components/community/EventRegistrationModal';

const EventsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");

  const events = [
    {
      title: 'Peringatan Hari Bambu Dunia 2026',
      date: '18-20 September 2026',
      time: '08:00 - 16:00 WIB',
      location: 'Wewengkon Adat Kasepuhan Cibarani, Lebak Banten',
      category: 'Peringatan',
      image: getAssetUrl('event/hbd.png'),
      color: '#0ca678'
    },
    {
      title: 'Festival Diburuan Jilid IV 2026',
      date: '18-20 September 2026',
      time: '08:00 - 16:00 WIB',
      location: 'Halaman Rumah sekitar RW. 07 Desa Cimareme, Bandung Barat',
      category: 'Festival',
      image: getAssetUrl('event/fdv.jpeg'),
      color: '#228be6'
    },
    {
      title: 'Hari Bambu Nasional 2026',
      date: '26-29 November 2026',
      time: '08:00 - 16:00 WIB',
      location: 'Kota Tangsel, Banten',
      category: 'Peringatan',
      image: getAssetUrl('event/hbn.png'),
      color: '#fab005'
    }
  ];

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
      maxWidth: '600px',
      lineHeight: '1.6'
    },
    featuredCard: {
      position: 'relative',
      borderRadius: '30px',
      overflow: 'hidden',
      marginBottom: '60px',
      minHeight: '400px',
      display: 'flex',
      alignItems: 'flex-end',
      border: '1px solid rgba(255,255,255,0.1)',
      cursor: 'pointer'
    },
    featuredImg: {
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      objectFit: 'cover',
      objectPosition: 'top',
      zIndex: 0
    },
    featuredContent: {
      position: 'relative',
      zIndex: 2,
      padding: '40px',
      width: '100%'
    },
    badge: {
      backgroundColor: '#51cf66',
      color: 'black',
      padding: '5px 15px',
      borderRadius: '20px',
      fontSize: '0.7rem',
      fontWeight: '900',
      textTransform: 'uppercase',
      display: 'inline-block',
      marginBottom: '15px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px'
    },
    card: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '24px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    },
    cardImg: {
      height: '200px',
      width: '100%',
      objectFit: 'cover',
      objectPosition: 'top'
    },
    cardBody: {
      padding: '25px',
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    },
    cardTitle: {
      fontSize: '1.4rem',
      fontWeight: '800',
      marginBottom: '20px',
      lineHeight: '1.3'
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={styles.title}>
              KALENDER <span style={styles.highlight}>EVENT</span>
            </h1>
            <p style={styles.subtitle}>
              Jelajahi berbagai kegiatan komunitas BaMbooChain. Mulai dari penanaman bersama hingga edukasi teknologi blockchain.
            </p>
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
            src={getAssetUrl('event/serentaun.png')} 
            style={styles.featuredImg}
            alt="Seren Taun Kasepuhan Cibarani"
          />
          <div className="featured-event-overlay"></div>
          <div style={styles.featuredContent}>
            <div style={styles.badge}>Featured Event</div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '20px' }}>
              Seren Taun Kasepuhan Cibarani 2026
            </h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCalendarAlt color="#51cf66" /> 2-6 September 2026
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaMapMarkerAlt color="#51cf66" /> Wewengkon Adat Kasepuhan Cibarani, Lebak Banten
              </span>
            </div>
            <button 
              style={{ 
                padding: '15px 30px', backgroundColor: 'white', color: 'black', 
                border: 'none', borderRadius: '15px', fontWeight: '900', cursor: 'pointer' 
              }}
              onClick={() => {
                setSelectedEventTitle("Seren Taun Kasepuhan Cibarani 2026");
                setIsModalOpen(true);
              }}
            >
              DAFTAR SEKARANG
            </button>
          </div>
        </motion.div>

        {/* Event List */}
        <div style={styles.grid}>
          {events.map((event, index) => (
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
                <div style={{ marginBottom: '25px' }}>
                  <div style={styles.infoRow}><FaCalendarAlt color={event.color} /> {event.date}</div>
                  <div style={styles.infoRow}><FaClock color={event.color} /> {event.time}</div>
                  <div style={styles.infoRow}><FaMapMarkerAlt color={event.color} /> {event.location}</div>
                </div>
                <button 
                  style={styles.btn}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = event.color; e.target.style.color = 'white'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.target.style.color = 'white'; }}
                  onClick={() => {
                    setSelectedEventTitle(event.title);
                    setIsModalOpen(true);
                  }}
                >
                  DAFTAR SEKARANG
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <EventRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        eventTitle={selectedEventTitle}
      />
    </div>
  );
};

export default EventsPage;
