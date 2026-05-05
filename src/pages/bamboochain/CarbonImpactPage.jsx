import React from 'react';
import { Wind, Droplets, Map, FileText, DownloadCloud, LineChart, Leaf, ShieldCheck, ArrowRight } from 'lucide-react';
import BackButton from '../../components/BackButton';

const CarbonImpactPage = () => {
  // Data metrik statis mock
  const impactData = {
    co2: "15,240",
    water: "2.5 Juta",
    land: "450"
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
      
      {/* Back Navigation */}
      <div className="container" style={{ marginBottom: '32px' }}>
        <BackButton to="/bamboochain" />
      </div>

      {/* HEADER SECTION */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(51, 154, 240, 0.1)', padding: '16px', borderRadius: '50%', color: '#339af0' }}>
            <Wind size={40} />
          </div>
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-0.5px' }}>
          Carbon & Impact bambuNUSA
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Dampak nyata untuk bumi. Telusuri kontribusi ekologis Anda yang terekam secara abadi pada jaringan blockchain Sabumi.
        </p>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* STATS (CO2, Air, Lahan) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderBottom: '4px solid #339af0' }}>
            <div style={{ background: 'rgba(51,154,240,0.1)', padding: '20px', borderRadius: '50%', marginBottom: '20px', color: '#339af0' }}>
              <Wind size={40} />
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>CO2 Terserap</div>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', margin: '8px 0' }}>{impactData.co2}</div>
            <div style={{ fontSize: '1.1rem', color: '#339af0', fontWeight: 'bold' }}>Ton Metrik</div>
          </div>

          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderBottom: '4px solid #fcc419' }}>
            <div style={{ background: 'rgba(252,196,25,0.1)', padding: '20px', borderRadius: '50%', marginBottom: '20px', color: '#fcc419' }}>
              <Droplets size={40} />
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Air Tersimpan</div>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', margin: '8px 0' }}>{impactData.water}</div>
            <div style={{ fontSize: '1.1rem', color: '#fcc419', fontWeight: 'bold' }}>Liter Konservasi</div>
          </div>

          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderBottom: '4px solid var(--primary)' }}>
            <div style={{ background: 'rgba(12,166,120,0.1)', padding: '20px', borderRadius: '50%', marginBottom: '20px', color: 'var(--primary)' }}>
              <Map size={40} />
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Lahan Direstorasi</div>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', margin: '8px 0' }}>{impactData.land}</div>
            <div style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold' }}>Hektar Kawasan</div>
          </div>
          
        </div>

        {/* BAWAH: REPORT & CARBON TRADING */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* IMPACT REPORT */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '16px', color: 'var(--text-main)' }}>
                <FileText size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--text-main)', margin: '0 0 4px 0' }}>Impact Report</h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sertifikat Audit ESG Triwulan 3, 2026.</div>
              </div>
            </div>
            
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px' }}>
              Unduh laporan transparansi penuh mengenai luasan kawasan yang terbangun, jumlah biomassa bambu, serta validasi auditor independen pihak ketiga yang tercatat permanen di jaringan Blockchain.
            </p>

            <button style={{ background: 'var(--text-main)', color: 'white', padding: '16px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.05rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'background 0.2s', width: '100%' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#000'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--text-main)'; }}>
              <DownloadCloud size={20} /> Download Report (PDF)
            </button>
          </div>

          {/* CARBON TRADING MARKETPLACE */}
          <div style={{ background: 'linear-gradient(135deg, rgba(51,154,240,0.1), rgba(12,166,120,0.1))', borderRadius: '24px', padding: '40px', border: '1px solid rgba(51,154,240,0.2)', position: 'relative', overflow: 'hidden' }}>
            {/* Dekorasi Visual */}
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', color: 'rgba(51,154,240,0.05)' }}>
              <Leaf size={200} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <LineChart size={28} color="#339af0" />
                <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: 0 }}>Carbon Trading</h3>
              </div>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '400px', marginBottom: '24px' }}>
                Berdagang nilai offset karbon Anda di ranah global. Ubah impak lingkungan menjadi insentif finansial melalui pasar karbon terbuka Sabumi.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>
                  <ShieldCheck size={18} color="var(--primary)" /> Terverifikasi standard VCS (Verified Carbon Standard)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>
                  <ShieldCheck size={18} color="var(--primary)" /> Konversi instan ke USDC / USDT
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Estimasi Harga Pasar:</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#339af0' }}>$45.00 <span style={{ fontSize: '1rem', color: 'var(--text-main)' }}>/ Ton</span></div>
                </div>
                
                <button style={{ flex: 1, background: '#339af0', color: 'white', padding: '16px', borderRadius: '16px', fontWeight: 'bold', fontSize: '1.05rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 20px rgba(51,154,240,0.3)', transition: 'transform 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                  Jual Carbon Credit <ArrowRight size={18} />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CarbonImpactPage;
