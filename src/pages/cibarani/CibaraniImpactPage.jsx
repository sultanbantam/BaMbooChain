import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartHandshake, CheckCircle2, TrendingUp, Building2, 
  Trees, Home, ShieldCheck, ArrowRight, DollarSign, Award
} from 'lucide-react';
import CibaraniNavHeader from '../../components/cibarani/CibaraniNavHeader';
import { useCibaraniStore } from '../../services/cibarani/cibaraniStore';
import SocialInteractions from '../../components/SocialInteractions';

const CibaraniImpactPage = () => {
  const navigate = useNavigate();
  const { impactProjects } = useCibaraniStore();

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', color: 'var(--text-main, #0f172a)', paddingBottom: '60px' }}>
      <CibaraniNavHeader />

      <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 16px' }}>
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#047857', letterSpacing: '1px', textTransform: 'uppercase' }}>
            TRANSPARANSI DAMPAK & PEMBERDAYAAN
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '6px 0 10px' }}>
            Berwisata Sambil Berbagi Kebaikan
          </h1>
          <p style={{ color: 'var(--text-muted, #64748b)', maxWidth: '660px', margin: '0 auto', fontSize: '0.92rem' }}>
            Sebagian kontribusi dari setiap kunjungan disalurkan secara transparan untuk renovasi rumah panggung adat, pembangunan sarana ibadah, dan penanaman sabuk hijau bambu.
          </p>
        </div>

        {/* ALOKASI PEMBAGIAN MANFAAT TRANSPARAN */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          borderRadius: '24px',
          padding: '28px',
          color: '#ffffff',
          marginBottom: '36px',
          boxShadow: '0 10px 30px rgba(6,78,59,0.15)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 8px', color: '#fbbf24' }}>
            Prinsip Pemisahan Finansial & Bagi Hasil Berkelanjutan
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#d1fae5', margin: '0 0 20px', lineHeight: 1.5 }}>
            BaMbooChain dan YSNJ membedakan dengan tegas antara penerimaan tiket wisata, donasi sosial, dan pembelian hasil bumi agar akuntabel dan tidak tercampur:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#fbbf24' }}>1. OPERASIONAL & HOMESTAY</div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: '4px' }}>
                Hak langsung tuan rumah, konsumsi makanan huma, dan transportasi warga lokal.
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#fbbf24' }}>2. DANA ADAT & KONSERVASI</div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: '4px' }}>
                Alokasi kas adat untuk pemeliharaan leuit, hutan tutupan, dan mata air.
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#fbbf24' }}>3. PEMBINAAN & PEMBERDAYAAN</div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: '4px' }}>
                Pelatihan bibit bambu, kemasan produk lokal, dan sertifikasi pemandu.
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#fbbf24' }}>4. INFRASTRUKTUR KOMUNITAS</div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: '4px' }}>
                Dukungan renovasi rumah panggung sesepuh dan sarana ibadah desa.
              </div>
            </div>
          </div>
        </div>

        {/* PROJECTS PROGRESS TRACKER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          {impactProjects.map((p) => (
            <div
              key={p.id}
              style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '24px',
                padding: '28px',
                border: '1.5px solid var(--border-color, #cbd5e1)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '900', background: 'rgba(4,120,87,0.1)', color: '#047857', padding: '3px 10px', borderRadius: '8px' }}>
                    {p.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                    📍 {p.location}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '0 0 8px' }}>
                  {p.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #475569)', lineHeight: 1.5, margin: '0 0 16px' }}>
                  {p.desc}
                </p>

                {/* PROGRESS BAR */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '800', marginBottom: '6px' }}>
                    <span>Target: {p.target}</span>
                    <span style={{ color: '#047857' }}>{p.currentProgressPercent}% Tercapai</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', borderRadius: '5px', background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ width: `${p.currentProgressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #047857 100%)', borderRadius: '5px' }} />
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <span>💰 Realisasi: <strong>{p.supportReceived}</strong></span>
                  <span>👤 Penanggung Jawab: <strong>{p.leadPerson}</strong></span>
                </div>
              </div>

              {/* BEFORE & AFTER PHOTO CAROUSEL / COMPARISON */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color, #e2e8f0)', position: 'relative' }}>
                  <img src={p.beforeImg} alt="Sebelum" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.6)', color: '#ffffff', fontSize: '0.68rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>
                    Kondisi Awal
                  </span>
                </div>
                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '2px solid #10b981', position: 'relative' }}>
                  <img src={p.afterImg} alt="Progres" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: '#047857', color: '#ffffff', fontSize: '0.68rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>
                    Progres Nyata
                  </span>
                </div>
              </div>

              {/* SOCIAL INTERACTION PER IMPACT PROJECT */}
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '12px' }}>
                <SocialInteractions 
                  entityId={`cibarani_impact_${p.id}`}
                  inCard={true}
                  customShareTitle={`${p.title} - Dampak Nyata Cibarani`}
                  customShareUrl={`https://bamboochain.id/#/cibarani/impact`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CibaraniImpactPage;
