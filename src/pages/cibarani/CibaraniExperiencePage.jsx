import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, 
  MapPin, Compass, Droplet, Trees, Home, Info
} from 'lucide-react';
import CibaraniNavHeader from '../../components/cibarani/CibaraniNavHeader';
import { useCibaraniStore } from '../../services/cibarani/cibaraniStore';
import SocialInteractions from '../../components/SocialInteractions';

const CibaraniExperiencePage = () => {
  const navigate = useNavigate();
  const { experiences, profile, packages } = useCibaraniStore();
  const [selectedExp, setSelectedExp] = useState(experiences[0]);

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', color: 'var(--text-main, #0f172a)' }}>
      <CibaraniNavHeader />

      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 16px' }}>
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#047857', letterSpacing: '1px', textTransform: 'uppercase' }}>
            KATALOG PENGALAMAN WISATA ADAT & ALAM
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '6px 0 10px' }}>
            Ragam Jejak Kearifan Kasepuhan Cibarani
          </h1>
          <p style={{ color: 'var(--text-muted, #64748b)', maxWidth: '680px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Seluruh rute disusun secara bertanggung jawab dengan persetujuan adat, dipandu langsung oleh warga lokal, dan memprioritaskan keselamatan serta kelestarian ekosistem.
          </p>
        </div>

        {/* 4 ZONASI ADAT ACCORDION / SUMMARY */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          borderRadius: '24px',
          padding: '24px 28px',
          color: '#ffffff',
          marginBottom: '36px',
          boxShadow: '0 8px 25px rgba(6,78,59,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Trees size={22} color="#fbbf24" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
              Sistem Tata Ruang Hutan Adat (4 Klasifikasi Leuweung)
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {profile.zoningSystem.map((z, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(255,255,255,0.15)'
                }}
              >
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fef3c7', marginBottom: '6px' }}>
                  {z.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#d1fae5', lineHeight: 1.45, marginBottom: '8px' }}>
                  {z.desc}
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: '900', background: 'rgba(0,0,0,0.25)', padding: '3px 8px', borderRadius: '6px', color: '#fde047' }}>
                  {z.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* EXPERIENCES GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '26px' }}>
          {experiences.map((exp) => (
            <div
              key={exp.id}
              style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '24px',
                border: '1.5px solid var(--border-color, #cbd5e1)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={exp.image}
                  alt={exp.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(6, 78, 59, 0.9)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(4px)'
                }}>
                  {exp.category}
                </span>
                <span style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: '#10b981',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  padding: '4px 10px',
                  borderRadius: '12px'
                }}>
                  ✓ {exp.status}
                </span>
              </div>

              <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 6px', color: 'var(--text-main, #0f172a)' }}>
                  {exp.title}
                </h3>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#047857', marginBottom: '12px' }}>
                  {exp.tagline}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #475569)', lineHeight: 1.55, flex: 1, margin: '0 0 16px' }}>
                  {exp.desc}
                </p>

                {/* HIGHLIGHTS */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--text-muted, #64748b)', marginBottom: '6px' }}>
                    FOKUS KEGIATAN:
                  </div>
                  {exp.highlights.map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-main, #0f172a)', marginBottom: '4px' }}>
                      <CheckCircle2 size={14} color="#10b981" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* BOTTOM ACTION */}
                <div style={{ borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted, #64748b)', fontWeight: '600' }}>
                    Tingkat: <strong>{exp.difficulty}</strong>
                  </span>
                  <button
                    onClick={() => navigate('/cibarani/booking')}
                    style={{
                      background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    Pilih Paket Ini →
                  </button>
                </div>
              </div>

              {/* SOCIAL INTERACTION PER CARD */}
              <div style={{ borderTop: '1px solid var(--border-color, #e2e8f0)', padding: '12px 18px', background: 'var(--bg-secondary, #f8fafc)' }}>
                <SocialInteractions 
                  entityId={`cibarani_exp_${exp.id}`}
                  inCard={true}
                  customShareTitle={`${exp.title} - Cibarani Weekend Experience`}
                  customShareUrl={`https://bamboochain.id/#/cibarani/experience`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div style={{
          marginTop: '50px',
          marginBottom: '50px',
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '24px',
          padding: '30px',
          border: '1.5px solid var(--border-color, #cbd5e1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0 0 6px', color: 'var(--text-main, #0f172a)' }}>
              Tertarik Mengikuti Program Komprehensif 2 Hari 1 Malam?
            </h3>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted, #64748b)' }}>
              Seluruh pengalaman di atas dirangkum dalam satu paket akhir pekan Sabtu - Minggu seharga Rp 1.000.000 / orang.
            </p>
          </div>
          <button
            onClick={() => navigate('/cibarani/booking')}
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: '#78350f',
              padding: '14px 28px',
              borderRadius: '14px',
              fontWeight: '900',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 6px 18px rgba(245, 158, 11, 0.3)'
            }}
          >
            Lanjut ke Form Reservasi →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CibaraniExperiencePage;

