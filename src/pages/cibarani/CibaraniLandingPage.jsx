import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, Calendar, Compass, MapPin, Users, Shield, 
  ArrowRight, TreeDeciduous, CheckCircle2, Heart, Award, 
  ShoppingBag, Bot, BookOpen, Layers, Info
} from 'lucide-react';
import CibaraniNavHeader from '../../components/cibarani/CibaraniNavHeader';
import { useCibaraniStore } from '../../services/cibarani/cibaraniStore';
import SocialInteractions from '../../components/SocialInteractions';

const CibaraniLandingPage = () => {
  const navigate = useNavigate();
  const { profile, packages, experiences, events, stories, products, impactProjects } = useCibaraniStore();
  const mainPkg = packages[0] || { indicativePrice: 1000000 };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', color: 'var(--text-main, #0f172a)' }}>
      <CibaraniNavHeader />

      {/* CINEMATIC HERO SECTION */}
      <section style={{
        position: 'relative',
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, rgba(6, 78, 59, 0.85) 0%, rgba(6, 95, 70, 0.92) 100%), url("/gambar/pehcibarani.png") center/cover no-repeat',
        color: '#ffffff',
        padding: '60px 20px',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Decorative Ambient Pattern */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* BADGE */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px', backdropFilter: 'blur(6px)' }}>
            <Sparkles size={16} color="#fbbf24" />
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#fef3c7', letterSpacing: '0.5px' }}>
              ONE WEEKEND. A THOUSAND STORIES. A MEANINGFUL JOURNEY.
            </span>
          </div>

          {/* MAIN HEADLINE */}
          <h1 style={{
            fontSize: 'clamp(2.1rem, 5vw, 3.8rem)',
            fontWeight: '900',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            marginBottom: '18px',
            textShadow: '0 4px 20px rgba(0,0,0,0.4)'
          }}>
            Rasakan Pengalaman Berbeda di Jantung Alam & Budaya Nusantara
          </h1>

          {/* SUBTITLE */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: '500',
            lineHeight: 1.6,
            color: '#d1fae5',
            maxWidth: '780px',
            margin: '0 auto 28px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Wisata Budaya, Alam, Edukasi, dan Kehidupan Masyarakat Adat Kasepuhan Cibarani — Lebak, Banten. 
            Datang untuk mengenal, menikmati alam, merasakan budaya, dan berbagi kebaikan.
          </p>

          {/* PRICING & CALL TO ACTION PILL */}
          <div style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1.5px solid rgba(251, 191, 36, 0.6)',
            borderRadius: '24px',
            padding: '16px 28px',
            marginBottom: '32px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '0.82rem', color: '#fef3c7', fontWeight: '700', marginBottom: '4px' }}>
              HARGA PAKET INDIKATIF (SABTU - MINGGU):
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#fbbf24', letterSpacing: '-0.5px' }}>
              Rp {mainPkg.indicativePrice.toLocaleString('id-ID')}
              <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ffffff', marginLeft: '6px' }}>/ orang (2D1N)</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#a7f3d0', marginTop: '4px' }}>
              *Dapat diubah dan dikonfirmasi admin sesuai fasilitas rombongan
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/cibarani/booking')}
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#78350f',
                padding: '16px 36px',
                borderRadius: '16px',
                fontWeight: '900',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'transform 0.15s ease'
              }}
            >
              BOOK YOUR WEEKEND EXPERIENCE <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate('/cibarani/experience')}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                padding: '16px 28px',
                borderRadius: '16px',
                fontWeight: '800',
                fontSize: '0.95rem',
                border: '1.5px solid rgba(255,255,255,0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Eksplorasi Detail Pengalaman
            </button>
          </div>
        </div>
      </section>

      {/* WEWENGKON ADAT PROFILE STATS BAR */}
      <section style={{
        maxWidth: '1200px',
        margin: '-30px auto 40px',
        padding: '0 16px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '24px',
          padding: '24px 32px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.06)',
          border: '1.5px solid var(--border-color, #cbd5e1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#047857' }}>
              ±{profile.metrics.totalAreaHa} Ha
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>
              Wilayah Adat Kasepuhan
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)' }}>
              Ruang hidup masyarakat adat Cibarani
            </div>
          </div>

          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0284c7' }}>
              ±{profile.metrics.indigenousForestHa} Ha
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>
              Hutan Adat Berketetapan SK
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)' }}>
              Area konservasi hutan adat resmi
            </div>
          </div>

          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#b45309' }}>
              {profile.metrics.population.toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>
              Jiwa Masyarakat Adat
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)' }}>
              {profile.metrics.households} Unit Rumah Panggung
            </div>
          </div>

          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#10b981' }}>
              4 Zona Adat
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>
              Tata Ruang Hutan Leluhur
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)' }}>
              Kolot, Titipan, Tutupan & Cadangan
            </div>
          </div>
        </div>
      </section>

      {/* CORE EXPERIENCES HIGHLIGHT */}
      <section style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#047857', textTransform: 'uppercase', letterSpacing: '1px' }}>
            6 PILAR PENGALAMAN UNGGULAN
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: '900', color: 'var(--text-main, #0f172a)', marginTop: '6px' }}>
            Bukan Sekadar Berwisata, Menyelami Makna Hidup
          </h2>
          <p style={{ color: 'var(--text-muted, #64748b)', maxWidth: '640px', margin: '8px auto 0', fontSize: '0.95rem' }}>
            Dari lumbung padi puluhan tahun hingga keheningan karst Goa Dagul, setiap sudut Cibarani menyimpan hikmah kearifan lokal.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {experiences.map((exp) => (
            <div
              key={exp.id}
              style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1.5px solid var(--border-color, #cbd5e1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
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
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 6px', color: 'var(--text-main, #0f172a)' }}>
                  {exp.title}
                </h3>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#059669', marginBottom: '10px' }}>
                  {exp.tagline}
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted, #475569)', lineHeight: 1.5, flex: 1, margin: '0 0 16px' }}>
                  {exp.desc}
                </p>

                <div style={{ borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', fontWeight: '600' }}>
                    Tingkat: {exp.difficulty}
                  </span>
                  <Link
                    to="/cibarani/experience"
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: '800',
                      color: '#047857',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Pelajari Rute →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SPECIAL FEATURE: PADI LINTAS GENERASI & LEUIT */}
      <section style={{
        maxWidth: '1200px',
        margin: '60px auto',
        padding: '0 16px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          borderRadius: '32px',
          color: '#ffffff',
          padding: '40px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'center',
          boxShadow: '0 16px 40px rgba(6,78,59,0.25)'
        }}>
          <div>
            <span style={{ background: '#fbbf24', color: '#78350f', fontSize: '0.75rem', fontWeight: '900', padding: '4px 12px', borderRadius: '999px', letterSpacing: '0.5px' }}>
              CERITA KEDAULATAN PANGAN
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: '900', lineHeight: 1.2, margin: '14px 0 16px' }}>
              Padi Lintas Generasi: Kisah Leuit & Gabah 40 Tahun
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#d1fae5', marginBottom: '20px' }}>
              Di Kasepuhan Cibarani, padi bukan komoditas sekali panen. Melalui kearifan Rukun Tani dan konstruksi lumbung Leuit panggung, gabah padi huma dapat tersimpan puluhan tahun tetap wangi, bebas kutu, dan menjadi benteng pangan keluarga adat.
            </p>
            <p style={{ fontSize: '0.88rem', fontStyle: 'italic', color: '#fef3c7', marginBottom: '24px', borderLeft: '3px solid #fbbf24', paddingLeft: '14px' }}>
              "Pengusul program mencicipi langsung nasi dari gabah simpanan 32 tahun dan 40 tahun, serta menghirup aroma gabah 70 tahun yang harumnya tetap hidup."
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/cibarani/stories"
                style={{
                  background: '#fbbf24',
                  color: '#78350f',
                  padding: '12px 24px',
                  borderRadius: '14px',
                  fontWeight: '800',
                  textDecoration: 'none',
                  fontSize: '0.9rem'
                }}
              >
                Baca Dokumentasi Lengkap
              </Link>
              <Link
                to="/cibarani/booking"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.4)',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  fontWeight: '800',
                  textDecoration: 'none',
                  fontSize: '0.9rem'
                }}
              >
                Kunjungi Leuit Langsung
              </Link>
            </div>
          </div>

          <div style={{ borderRadius: '24px', overflow: 'hidden', border: '3px solid #fbbf24', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <img
              src="/gambar/pehcibarani.png"
              alt="Leuit Kasepuhan Cibarani"
              style={{ width: '100%', height: '360px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* ACCESS & TRANSPORTATION GUIDE */}
      <section style={{ maxWidth: '1200px', margin: '40px auto 60px', padding: '0 16px' }}>
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '28px',
          padding: '32px',
          border: '1.5px solid var(--border-color, #cbd5e1)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Compass size={22} color="#047857" />
            <h3 style={{ fontSize: '1.35rem', fontWeight: '900', margin: 0, color: 'var(--text-main, #0f172a)' }}>
              {profile.travelRoute.title}
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #64748b)', margin: '0 0 24px' }}>
            Akses menuju Kasepuhan Cibarani mudah dijangkau dari Jabodetabek dengan moda transportasi umum terjangkau.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {profile.travelRoute.steps.map((s) => (
              <div
                key={s.step}
                style={{
                  background: 'var(--bg-secondary, #f8fafc)',
                  padding: '18px',
                  borderRadius: '18px',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#047857',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  fontSize: '0.85rem',
                  marginBottom: '10px'
                }}>
                  {s.step}
                </div>
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-main, #0f172a)', marginBottom: '4px' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #475569)', lineHeight: 1.45 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '20px',
            padding: '14px 18px',
            borderRadius: '14px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid #f59e0b',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            fontSize: '0.82rem',
            color: '#92400e'
          }}>
            <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Catatan Lapangan:</strong> {profile.travelRoute.note}
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL INTERACTIONS INTEGRATION ON PAGE */}
      <section style={{ maxWidth: '900px', margin: '0 auto 60px', padding: '0 16px' }}>
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '24px',
          padding: '24px',
          border: '1.5px solid var(--border-color, #cbd5e1)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.04)'
        }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '14px', color: 'var(--text-main, #0f172a)' }}>
            💬 Suara & Apresiasi Komunitas BaMbooChain
          </h4>
          <SocialInteractions 
            entityId="cibarani_weekend_landing"
            customShareTitle="Cibarani Weekend Experience - Wisata Adat & Kedaulatan Pangan"
            customShareUrl="https://bamboochain.id/#/cibarani"
          />
        </div>
      </section>

      {/* FINAL CALL TO ACTION FOOTER */}
      <footer style={{
        background: '#064e3b',
        color: '#ffffff',
        padding: '50px 20px',
        textAlign: 'center',
        borderTop: '2px solid #fbbf24'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '12px' }}>
            Siap Mengukir Cerita Akhir Pekan Anda?
          </h3>
          <p style={{ color: '#d1fae5', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Bergabunglah bersama kami di Kasepuhan Cibarani. Rasakan kehangatan masyarakat adat, segarnya alam hulu, dan nikmati ketahanan pangan yang dirawat puluhan tahun.
          </p>
          <button
            onClick={() => navigate('/cibarani/booking')}
            style={{
              background: '#fbbf24',
              color: '#78350f',
              padding: '16px 36px',
              borderRadius: '16px',
              fontWeight: '900',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(251, 191, 36, 0.4)'
            }}
          >
            Pesan Tiket Cibarani Weekend Sekarang
          </button>
          <div style={{ marginTop: '28px', fontSize: '0.78rem', opacity: 0.75 }}>
            © {new Date().getFullYear()} Yayasan Sabumi Nusantara Jaya & Masyarakat Adat Kasepuhan Cibarani. Bagian dari Ekosistem BaMbooChain.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CibaraniLandingPage;
