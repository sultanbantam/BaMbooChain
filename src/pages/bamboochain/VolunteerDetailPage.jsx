import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Award, CheckCircle, Clock, BookOpen, Hammer, Anchor, ArrowLeft, Send } from 'lucide-react';
import BackButton from '../../components/BackButton';
import { VOLUNTEERS_HOSTS } from '../../data/volunteersData';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const VolunteerDetailPage = () => {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const host = VOLUNTEERS_HOSTS.find(h => h.id === Number(hostId));

  // If host not found
  if (!host) {
    return (
      <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
        <div style={{ textAlign: 'center' }}>
          <h3>Host Tidak Ditemukan</h3>
          <button className="btn btn-primary" onClick={() => navigate('/bamboochain/volunteer')}>Kembali</button>
        </div>
      </div>
    );
  }

  // Multilingual getters
  const hostName = language === 'ja' ? host.name_ja : language === 'en' ? host.name_en : host.name;
  const hostLoc = language === 'ja' ? host.location_ja : language === 'en' ? host.location_en : host.location;
  const hostAbout = language === 'ja' ? host.about_ja : language === 'en' ? host.about_en : host.about;
  const hostSkills = language === 'ja' ? host.skills_ja : language === 'en' ? host.skills_en : host.skills;
  const hostActivities = language === 'ja' ? host.activities_ja : language === 'en' ? host.activities_en : host.activities;
  const hostFacilities = language === 'ja' ? host.facilities_ja : language === 'en' ? host.facilities_en : host.facilities;
  const hostAccomDetail = language === 'ja' ? host.accommodation_detail_ja : language === 'en' ? host.accommodation_detail_en : host.accommodation_detail;

  const { user, isAuthenticated, openLoginModal } = useAuth();

  // Tabs state
  const [activeTab, setActiveTab] = useState('about');
  const [galleryFilter, setGalleryFilter] = useState('all');

  // Booking Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [motivation, setMotivation] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert(language === 'ja' ? 'ボランティアに応募するにはログインする必要があります。' : language === 'en' ? 'You must be logged in to apply as a volunteer.' : 'Anda harus masuk (login) terlebih dahulu untuk mendaftar sebagai relawan.');
      openLoginModal();
      return;
    }

    if (!startDate || !endDate || !motivation.trim()) {
      alert(language === 'ja' ? 'すべての必須フィールドに入力してください。' : language === 'en' ? 'Please fill in all required fields.' : 'Silakan lengkapi semua kolom yang wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      const appPayload = {
        hostId: Number(hostId),
        hostName: host.name,
        hostNameEn: host.name_en,
        startDate,
        endDate,
        motivation,
        userId: user?.id || user?.uid || 'anonymous',
        userName: user?.name || user?.username || 'Relawan',
        userEmail: user?.email || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "volunteer_applications"), appPayload);

      // Success response
      setIsSubmitted(true);
      alert(t('vol_alert_success'));
      
      // Reset Form
      setStartDate('');
      setEndDate('');
      setMotivation('');
    } catch (err) {
      console.error("Error submitting volunteer application:", err);
      alert(language === 'ja' ? '送信に失敗しました。もう一度お試しください。' : language === 'en' ? 'Failed to submit. Please try again.' : 'Gagal mengirim pendaftaran. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: 'var(--bg-color)', transition: 'background 0.3s ease' }}>
      
      {/* Cover Image Banner */}
      <div style={{ 
        height: '320px', 
        background: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url("${host.bannerImage || host.image}") center/cover no-repeat`,
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: '30px'
      }}>
        <div className="container" style={{ zIndex: 10 }}>
          <div style={{ marginBottom: '20px' }}>
            <button 
              onClick={() => navigate('/bamboochain/volunteer')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', color: '#333', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            >
              <ArrowLeft size={16} /> {language === 'ja' ? '戻る' : language === 'en' ? 'Back to List' : 'Kembali'}
            </button>
          </div>
          
          <div style={{ color: 'white' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
              <span style={{ padding: '4px 12px', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                ✓ {t('vol_verified_badge')}
              </span>
              <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.25)', color: 'white', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', backdropFilter: 'blur(5px)' }}>
                ⭐ {host.rating} ({host.reviewsCount} Reviews)
              </span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>{hostName}</h1>
            <p style={{ fontSize: '1.1rem', margin: '6px 0 0 0', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px', textShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
              <MapPin size={18} /> {hostLoc}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container" style={{ padding: '40px 24px', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '40px' }}>
        
        {/* Left Side: Host Details and Tabs */}
        <div>
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '30px', overflowX: 'auto', gap: '10px' }}>
            {[
              { id: 'about', label: t('vol_tab_about') },
              { id: 'activities', label: t('vol_tab_activities') },
              { id: 'facilities', label: t('vol_tab_facilities') },
              { id: 'reviews', label: t('vol_tab_reviews') },
              { id: 'gallery', label: language === 'ja' ? 'ギャラリー' : language === 'en' ? 'Gallery' : 'Galeri Foto' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '14px 20px',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                  background: 'none',
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENTS */}
          <div className="glass" style={{ padding: '30px', borderRadius: '24px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', minHeight: '300px' }}>
            
            {/* ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="animate-fade-in">
                <h3 style={{ marginTop: 0, fontWeight: '800', fontSize: '1.4rem', color: 'var(--text-main)' }}>{t('vol_tab_about')}</h3>
                <p style={{ lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '1rem', whiteSpace: 'pre-line' }}>
                  {hostAbout}
                </p>

                <div style={{ marginTop: '35px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>MANAGER HOST</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{host.host}</span>
                  </div>
                  <div style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{t('vol_reputation_score')}</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)' }}>{host.reputationScore} XP</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t('vol_reputation_desc')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVITIES TAB */}
            {activeTab === 'activities' && (
              <div className="animate-fade-in">
                <h3 style={{ marginTop: 0, fontWeight: '800', fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '20px' }}>{t('vol_tab_activities')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {hostActivities.map((act, i) => (
                    <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', padding: '6px', borderRadius: '50%', flexShrink: 0 }}>
                        <CheckCircle size={16} />
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: '1.5' }}>{act}</span>
                    </div>
                  ))}
                </div>

                <h4 style={{ fontWeight: 'bold', marginTop: '35px', color: 'var(--text-main)' }}>{t('vol_needs_skills')}</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {hostSkills.map((skill, i) => (
                    <span key={i} style={{ padding: '6px 14px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '30px', fontSize: '0.82rem', fontWeight: 'bold' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* FACILITIES TAB */}
            {activeTab === 'facilities' && (
              <div className="animate-fade-in">
                <h3 style={{ marginTop: 0, fontWeight: '800', fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '20px' }}>{t('vol_tab_facilities')}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '35px' }}>
                  {hostFacilities.map((fac, i) => (
                    <div key={i} style={{ padding: '16px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)', fontWeight: 'bold', fontSize: '0.92rem' }}>
                      🌟 {fac}
                    </div>
                  ))}
                </div>

                <h4 style={{ fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>{t('vol_accom_details')}</h4>
                <p style={{ lineHeight: '1.7', color: 'var(--text-muted)', fontSize: '0.98rem' }}>
                  {hostAccomDetail}
                </p>
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="animate-fade-in">
                <h3 style={{ marginTop: 0, fontWeight: '800', fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '25px' }}>{t('vol_tab_reviews')}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {host.reviews.map((rev, i) => {
                    const comment = language === 'ja' ? rev.comment_ja : language === 'en' ? rev.comment : rev.comment_id;
                    return (
                      <div key={i} style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '16px', background: 'rgba(0,0,0,0.01)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{rev.user}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '2px', marginBottom: '10px', color: '#f59f00' }}>
                          {Array.from({ length: rev.rating }).map((_, j) => <Star key={j} size={14} fill="#f59f00" stroke="none" />)}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6', fontStyle: 'italic' }}>
                          "{comment}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (() => {
              // Normalize data structure
              const galleryItems = (host.gallery || []).map(item => {
                if (typeof item === 'string') {
                  return {
                    url: item,
                    category: 'general',
                    label: language === 'ja' ? '一般' : language === 'en' ? 'General' : 'Umum'
                  };
                }
                return {
                  url: item.url,
                  category: item.category,
                  label: language === 'ja' ? item.category_ja : language === 'en' ? item.category_en : item.category_id
                };
              });

              // Extract unique categories
              const categories = [{ id: 'all', label: language === 'ja' ? 'すべて' : language === 'en' ? 'All' : 'Semua' }];
              const seen = new Set();
              galleryItems.forEach(item => {
                if (item.category && !seen.has(item.category)) {
                  seen.add(item.category);
                  categories.push({ id: item.category, label: item.label });
                }
              });

              // Filtered items
              const filteredItems = galleryFilter === 'all' 
                ? galleryItems 
                : galleryItems.filter(item => item.category === galleryFilter);

              return (
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontWeight: '800', fontSize: '1.4rem', color: 'var(--text-main)' }}>
                      📸 {language === 'ja' ? '活動ギャラリー' : language === 'en' ? 'Activity Gallery' : 'Galeri Aktivitas'}
                    </h3>
                    
                    {/* Category Selector Buttons */}
                    {categories.length > 1 && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setGalleryFilter(cat.id)}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '20px',
                              border: '1px solid var(--border-color)',
                              background: galleryFilter === cat.id ? 'var(--primary)' : 'var(--bg-card)',
                              color: galleryFilter === cat.id ? 'white' : 'var(--text-muted)',
                              fontWeight: 'bold',
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: galleryFilter === cat.id ? '0 4px 12px rgba(12, 166, 120, 0.2)' : 'none'
                            }}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                    {filteredItems.map((img, i) => (
                      <div 
                        key={i} 
                        className="gallery-item"
                        style={{ 
                          borderRadius: '16px', 
                          overflow: 'hidden', 
                          height: '140px', 
                          border: '1px solid var(--border-color)',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          cursor: 'pointer'
                        }}
                        onClick={() => window.open(img.url, '_blank')}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'scale(1.03)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.02)';
                        }}
                      >
                        <div style={{ width: '100%', height: '100%', background: `url("${img.url}") center/cover no-repeat` }} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>
        </div>

        {/* Right Side: Sticky Booking Application Form */}
        <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
          <div className="glass animate-fade-in" style={{ padding: '30px', borderRadius: '24px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <h3 style={{ marginTop: 0, fontWeight: '900', fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              📝 {t('vol_apply_now')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
              {language === 'ja' ? '申請書はオンチェーンの検証キューに入り、ホストによって承認されます。' : language === 'en' ? 'Your application goes into the on-chain review queue and will be verified by the host.' : 'Lamaran Anda masuk ke antrean on-chain dan akan divalidasi langsung oleh pengelola.'}
            </p>

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Start Date */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  {t('vol_label_date_start')} *
                </label>
                <input 
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* End Date */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  {t('vol_label_date_end')} *
                </label>
                <input 
                  type="date"
                  required
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Motivation message */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  {t('vol_label_motivation')} *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder={t('vol_placeholder_motivation')}
                  value={motivation}
                  onChange={e => setMotivation(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.92rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.5' }}
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  border: 'none', 
                  background: isSubmitting ? 'var(--text-muted)' : 'var(--primary)', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  fontSize: '1rem', 
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(12, 166, 120, 0.2)'
                }}
              >
                <Send size={16} /> {isSubmitting ? (language === 'ja' ? '送信中...' : language === 'en' ? 'Submitting...' : 'Mengirim...') : t('vol_btn_submit_app')}
              </button>
            </form>

            {isSubmitted && (
              <div style={{ marginTop: '20px', padding: '15px', borderRadius: '12px', background: 'rgba(12, 166, 120, 0.05)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.82rem', lineHeight: '1.5', textAlign: 'center', fontWeight: '500' }}>
                ✓ {language === 'ja' ? '申請書が送信され、ブロックチェーンにキューイングされました！' : language === 'en' ? 'Application sent & queued in blockchain!' : 'Lamaran terkirim & terantre di blockchain!'}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default VolunteerDetailPage;
