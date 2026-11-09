import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Users, Filter, 
  ArrowRight, Download, Share2, Sparkles, CheckCircle2
} from 'lucide-react';
import CibaraniNavHeader from '../../components/cibarani/CibaraniNavHeader';
import { useCibaraniStore } from '../../services/cibarani/cibaraniStore';
import SocialInteractions from '../../components/SocialInteractions';

const CibaraniAgendaPage = () => {
  const navigate = useNavigate();
  const { events } = useCibaraniStore();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('LIST'); // 'LIST' | 'CALENDAR'

  const categories = ['ALL', 'Wisata Edukasi & Budaya', 'Upacara Budaya', 'Konservasi Lingkungan'];

  const filteredEvents = selectedCategory === 'ALL'
    ? events
    : events.filter(e => e.category === selectedCategory);

  const handleDownloadICS = (evt) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BaMbooChain//Cibarani Weekend Experience//ID
BEGIN:VEVENT
SUMMARY:${evt.title}
DESCRIPTION:${evt.desc}
LOCATION:${evt.location}
DTSTART:${evt.startDate.replace(/-/g, '')}T090000Z
DTEND:${evt.endDate.replace(/-/g, '')}T170000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${evt.id}.ics`;
    a.click();
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', color: 'var(--text-main, #0f172a)', paddingBottom: '60px' }}>
      <CibaraniNavHeader />

      <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 16px' }}>
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#047857', letterSpacing: '1px', textTransform: 'uppercase' }}>
            AGENDA & KALENDER KEGIATAN ADAT
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '6px 0 10px' }}>
            Jadwal Akhir Pekan & Tradisi Cibarani
          </h1>
          <p style={{ color: 'var(--text-muted, #64748b)', maxWidth: '640px', margin: '0 auto', fontSize: '0.92rem' }}>
            Temukan agenda perjalanan akhir pekan, upacara adat seren padi, hingga aksi penanaman bambu konservasi bersama warga adat Kasepuhan Cibarani.
          </p>
        </div>

        {/* CONTROLS: CATEGORY FILTER & VIEW TOGGLE */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '26px'
        }}>
          {/* CATEGORY PILLS */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  fontWeight: selectedCategory === cat ? '800' : '600',
                  background: selectedCategory === cat ? '#047857' : 'var(--bg-card, #ffffff)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted, #475569)',
                  border: '1.5px solid ' + (selectedCategory === cat ? '#047857' : 'var(--border-color, #cbd5e1)'),
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat === 'ALL' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

          {/* VIEW SWITCHER */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary, #e2e8f0)', padding: '3px', borderRadius: '12px' }}>
            <button
              onClick={() => setViewMode('LIST')}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: '800',
                border: 'none',
                background: viewMode === 'LIST' ? 'var(--bg-card, #ffffff)' : 'transparent',
                color: viewMode === 'LIST' ? '#047857' : 'var(--text-muted, #64748b)',
                cursor: 'pointer',
                boxShadow: viewMode === 'LIST' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              Daftar Agenda
            </button>
            <button
              onClick={() => setViewMode('CALENDAR')}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: '800',
                border: 'none',
                background: viewMode === 'CALENDAR' ? 'var(--bg-card, #ffffff)' : 'transparent',
                color: viewMode === 'CALENDAR' ? '#047857' : 'var(--text-muted, #64748b)',
                cursor: 'pointer',
                boxShadow: viewMode === 'CALENDAR' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              Kalender Visual
            </button>
          </div>
        </div>

        {/* VIEW 1: AGENDA LIST */}
        {viewMode === 'LIST' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                style={{
                  background: 'var(--bg-card, #ffffff)',
                  borderRadius: '24px',
                  padding: '24px',
                  border: '1.5px solid var(--border-color, #cbd5e1)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '900', background: 'rgba(4,120,87,0.1)', color: '#047857', padding: '3px 10px', borderRadius: '8px' }}>
                      {evt.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', background: '#fef3c7', color: '#b45309', padding: '3px 10px', borderRadius: '8px' }}>
                      {evt.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '0 0 8px' }}>
                    {evt.title}
                  </h3>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted, #475569)', lineHeight: 1.5, margin: '0 0 14px' }}>
                    {evt.desc}
                  </p>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <CalendarIcon size={14} color="#047857" /> {evt.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={14} color="#047857" /> {evt.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Users size={14} color="#047857" /> Kuota: {evt.bookedCount} / {evt.quota} Terisi
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={() => navigate('/cibarani/booking')}
                    style={{
                      background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Daftar Sesi Ini →
                  </button>

                  <button
                    onClick={() => handleDownloadICS(evt)}
                    style={{
                      background: 'var(--bg-secondary, #f8fafc)',
                      border: '1px solid var(--border-color, #cbd5e1)',
                      color: 'var(--text-muted, #475569)',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Download size={14} /> Simpan ke Kalender (.ics)
                  </button>
                </div>

                {/* SOCIAL ENGAGEMENT PER EVENT */}
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '12px' }}>
                  <SocialInteractions 
                    entityId={`cibarani_evt_${evt.id}`}
                    inCard={true}
                    customShareTitle={`${evt.title} - Agenda Cibarani Weekend`}
                    customShareUrl={`https://bamboochain.id/#/cibarani/agenda`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: VISUAL MONTHLY CALENDAR GRID */}
        {viewMode === 'CALENDAR' && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '28px',
            border: '1.5px solid var(--border-color, #cbd5e1)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main, #0f172a)' }}>
              Kalender November - Desember 2026
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              {events.map((e) => (
                <div
                  key={e.id}
                  style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    borderRadius: '16px',
                    padding: '16px'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#047857', marginBottom: '4px' }}>
                    {e.date}
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main, #0f172a)', marginBottom: '8px' }}>
                    {e.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748b)', marginBottom: '12px' }}>
                    📍 {e.location}
                  </div>
                  <button
                    onClick={() => navigate('/cibarani/booking')}
                    style={{
                      width: '100%',
                      background: '#047857',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Booking Batch Ini
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CibaraniAgendaPage;
