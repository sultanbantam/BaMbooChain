import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Award, Search, Users, Clock, ShieldCheck, Heart } from 'lucide-react';
import BackButton from '../../components/BackButton';
import { VOLUNTEERS_HOSTS } from '../../data/volunteersData';
import { useLanguage } from '../../context/LanguageContext';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

const VolunteersPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // State for search and filter
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedLoc, setSelectedLoc] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time or fetched stats
  const [stats, setStats] = useState({ activeVolunteers: 142, hoursContributed: 8420 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const q = query(collection(db, "volunteer_applications"), where("status", "==", "verified"));
        const snapshot = await getDocs(q);
        const apps = snapshot.docs.map(doc => doc.data());
        
        // unique users
        const uniqueUsers = new Set(apps.map(a => a.userId));
        const newVolunteersCount = 142 + uniqueUsers.size;

        // calculate hours
        let additionalHours = 0;
        apps.forEach(app => {
          if (app.startDate && app.endDate) {
            const start = new Date(app.startDate);
            const end = new Date(app.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
            additionalHours += diffDays * 6; // assume 6 hours of work per day
          }
        });
        const newHoursCount = 8420 + additionalHours;

        setStats({ activeVolunteers: newVolunteersCount, hoursContributed: newHoursCount });
      } catch (err) {
        console.error("Error fetching volunteer stats:", err);
      }
    };
    fetchStats();
  }, []);
  
  // Coordinates for Map
  const [mapCenter, setMapCenter] = useState({ lat: -7.5, lng: 115.0, zoom: 5 });

  // Get unique skills and locations based on active language
  const getHostName = (host) => language === 'ja' ? host.name_ja : language === 'en' ? host.name_en : host.name;
  const getHostLoc = (host) => language === 'ja' ? host.location_ja : language === 'en' ? host.location_en : host.location;
  const getHostAbout = (host) => language === 'ja' ? host.about_ja : language === 'en' ? host.about_en : host.about;
  const getHostSkills = (host) => language === 'ja' ? host.skills_ja : language === 'en' ? host.skills_en : host.skills;

  // Static list of skills for filter matching (mapped by index/key)
  const filterSkills = [
    { value: 'all', label: t('vol_filter_all_skills') },
    { value: 'coral', label: language === 'ja' ? 'サンゴ保全' : language === 'en' ? 'Coral Restoration' : 'Restorasi Karang' },
    { value: 'teach', label: language === 'ja' ? '教育' : language === 'en' ? 'Teaching' : 'Mengajar' },
    { value: 'farm', label: language === 'ja' ? '農業' : language === 'en' ? 'Farming' : 'Pertanian' },
    { value: 'const', label: language === 'ja' ? '建設' : language === 'en' ? 'Construction' : 'Konstruksi' }
  ];

  const filterLocs = [
    { value: 'all', label: t('vol_filter_all_locs') },
    { value: 'ntt', label: 'Lembata, NTT' },
    { value: 'banten', label: 'Lebak, Banten' }
  ];

  // Filtering Logic
  const filteredHosts = VOLUNTEERS_HOSTS.filter(host => {
    // 1. Skill filter
    let matchSkill = true;
    if (selectedSkill !== 'all') {
      const targetSkill = filterSkills.find(s => s.value === selectedSkill)?.label.toLowerCase();
      const hostSkillsLower = getHostSkills(host).map(s => s.toLowerCase());
      matchSkill = hostSkillsLower.some(s => s.includes(targetSkill));
    }

    // 2. Location filter
    let matchLoc = true;
    if (selectedLoc !== 'all') {
      if (selectedLoc === 'ntt') matchLoc = host.location.toLowerCase().includes('ntt');
      if (selectedLoc === 'banten') matchLoc = host.location.toLowerCase().includes('banten');
    }

    // 3. Search query
    let matchSearch = true;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const name = getHostName(host).toLowerCase();
      const loc = getHostLoc(host).toLowerCase();
      const about = getHostAbout(host).toLowerCase();
      matchSearch = name.includes(q) || loc.includes(q) || about.includes(q);
    }

    return matchSkill && matchLoc && matchSearch;
  });

  // Handle card hover to pan the map
  const handleHostHover = (hostId) => {
    if (hostId === 1) {
      // Lembata NTT coordinates
      setMapCenter({ lat: -8.38, lng: 123.58, zoom: 9 });
    } else if (hostId === 2) {
      // Lebak Banten coordinates
      setMapCenter({ lat: -6.65, lng: 106.22, zoom: 9 });
    }
  };

  // Reset map view
  const handleResetMap = () => {
    setMapCenter({ lat: -7.5, lng: 115.0, zoom: 5 });
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: 'var(--bg-color)', transition: 'background 0.3s ease' }}>
      
      {/* Page Header */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', padding: '30px 0', transition: 'background 0.3s ease' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <BackButton to="/bamboochain" />
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              🌍 {t('vol_title')}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '800px', margin: 0 }}>
              {t('vol_subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* VOLUNTEER GLOBAL METRICS (Premium Glassmorphic widgets) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          
          <div className="glass" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(51, 154, 240, 0.1)', padding: '14px', borderRadius: '14px', color: '#339af0' }}>
              <Clock size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>{t('vol_hours_contributed')}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)' }}>{stats.hoursContributed.toLocaleString('id-ID')} Jam</div>
            </div>
          </div>

          <div className="glass" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(12, 166, 120, 0.1)', padding: '14px', borderRadius: '14px', color: 'var(--primary)' }}>
              <Users size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>{t('vol_active_volunteers')}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)' }}>{stats.activeVolunteers} Relawan</div>
            </div>
          </div>

          <div className="glass" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(245, 159, 0, 0.1)', padding: '14px', borderRadius: '14px', color: '#f59f00' }}>
              <Star size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>{t('vol_total_hosts')}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)' }}>{VOLUNTEERS_HOSTS.length} Destinasi</div>
            </div>
          </div>

          <div className="glass" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(132, 94, 247, 0.1)', padding: '14px', borderRadius: '14px', color: '#845ef7' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Reputasi Web3</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)' }}>Soulbound XP</div>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="glass" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center' }}>
          
          {/* Search text */}
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '14px' }} />
            <input 
              type="text" 
              placeholder={language === 'ja' ? 'ホストまたは場所を検索...' : language === 'en' ? 'Search hosts or locations...' : 'Cari host atau lokasi...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }} 
            />
          </div>

          {/* Skill Filter */}
          <div>
            <select
              value={selectedSkill}
              onChange={e => setSelectedSkill(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.92rem', outline: 'none' }}
            >
              {filterSkills.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={selectedLoc}
              onChange={e => setSelectedLoc(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.92rem', outline: 'none' }}
            >
              {filterLocs.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>

        {/* CORE LAYOUT: HOST LIST vs GIS INTERACTIVE MAP */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '30px', alignItems: 'stretch' }}>
          
          {/* Host list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 10px 0' }}>
              📍 {t('vol_host_title')} ({filteredHosts.length})
            </h2>

            {filteredHosts.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                <Search size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.3 }} />
                <h3 style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>Tidak Ada Host Ditemukan</h3>
                <p style={{ color: 'var(--text-muted)' }}>Cobalah mencari dengan keahlian atau kata kunci yang berbeda.</p>
              </div>
            ) : (
              filteredHosts.map(host => {
                const hostName = getHostName(host);
                const hostLoc = getHostLoc(host);
                const hostAbout = getHostAbout(host);
                const hostSkills = getHostSkills(host);

                return (
                  <div 
                    key={host.id}
                    className="glass"
                    onMouseEnter={() => handleHostHover(host.id)}
                    style={{ 
                      borderRadius: '24px', 
                      overflow: 'hidden', 
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      display: 'grid',
                      gridTemplateColumns: '220px 1fr',
                      gap: '24px',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/bamboochain/volunteer/${host.id}`)}
                  >
                    {/* Host Image */}
                    <div style={{ position: 'relative', height: '100%', minHeight: '200px' }}>
                      <div style={{ width: '100%', height: '100%', background: `url("${host.image}") center/cover no-repeat` }} />
                      <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        <Award size={12} /> {t('vol_verified_badge')}
                      </div>
                    </div>

                    {/* Host Info */}
                    <div style={{ padding: '24px 24px 24px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        {/* Location and Rating */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} /> {hostLoc}
                          </span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', color: '#f59f00' }}>
                            <Star size={14} fill="#f59f00" /> {host.rating} ({host.reviewsCount})
                          </span>
                        </div>

                        {/* Title */}
                        <h3 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '0 0 10px 0', color: 'var(--text-main)' }}>{hostName}</h3>
                        
                        {/* Manager */}
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                          Pengelola: <strong style={{ color: 'var(--text-main)' }}>{host.host}</strong>
                        </div>

                        {/* Snippet about */}
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 20px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {hostAbout}
                        </p>
                      </div>

                      {/* Skills Grid and Button */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {hostSkills.slice(0, 3).map((skill, i) => (
                            <span key={i} style={{ fontSize: '0.72rem', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: '30px', fontWeight: '500' }}>
                              {skill}
                            </span>
                          ))}
                          {hostSkills.length > 3 && (
                            <span style={{ fontSize: '0.72rem', background: 'rgba(12,166,120,0.08)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '30px', fontWeight: 'bold' }}>
                              +{hostSkills.length - 3}
                            </span>
                          )}
                        </div>

                        <button 
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '10px', fontWeight: 'bold', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/bamboochain/volunteer/${host.id}`);
                          }}
                        >
                          {t('vol_btn_details')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* GIS INTERACTIVE MAP */}
          <div style={{ position: 'sticky', top: '100px', alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '450px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}>
                  🗺️ GIS Volunteer Map
                </span>
                <button 
                  onClick={handleResetMap}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Reset Peta
                </button>
              </div>

              <div style={{ flex: 1, position: 'relative' }}>
                <iframe 
                  key={`${mapCenter.lat}-${mapCenter.lng}-${mapCenter.zoom}`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  loading="lazy" 
                  allowFullScreen 
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 3.5 / mapCenter.zoom},${mapCenter.lat - 2.5 / mapCenter.zoom},${mapCenter.lng + 3.5 / mapCenter.zoom},${mapCenter.lat + 2.5 / mapCenter.zoom}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`}>
                </iframe>

                {/* Legend Overlay */}
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'white', padding: '12px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', color: '#333', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '6px', pointerEvents: 'none' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)', borderBottom: '1px solid #eee', paddingBottom: '4px', marginBottom: '2px' }}>Marker Koordinat:</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ff3b30' }} />
                    Lembata, NTT (Taman Daun)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#4cd964' }} />
                    Lebak, Banten (Sabumi Adat)
                  </div>
                </div>
              </div>
            </div>

            {/* Helper Info Card */}
            <div className="glass" style={{ padding: '20px', borderRadius: '20px', border: '1px dashed var(--primary)', background: 'rgba(12,166,120,0.02)', display: 'flex', gap: '12px' }}>
              <Heart size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Relawan global yang terpilih akan menerima verifikasi KYC dan on-boarding resmi. Program didanai sebagian oleh on-chain Escrow dari mitra dan investor BaMbooChain.
              </p>
            </div>
          </div>

        </div>

      </div>
      
    </div>
  );
};

export default VolunteersPage;
