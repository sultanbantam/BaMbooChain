import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, CheckCircle2, FileText, Phone, MapPin, ArrowRight } from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

const BoomOperatorRegisterPage = () => {
  const navigate = useNavigate();
  const { registerOperator } = useBoomBoomStore();

  const [formData, setFormData] = useState({
    name: '',
    type: 'BUMDes',
    region: 'Perkebunan Emas Hijau Cibarani',
    legalEntity: '',
    contactPerson: '',
    phone: '',
    email: '',
    description: ''
  });

  const [submittedOp, setSubmittedOp] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const op = registerOperator(formData);
    setSubmittedOp(op);
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', paddingBottom: '60px' }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '900px', margin: '24px auto', padding: '0 20px' }}>
        
        {/* HEADER HERO */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: 'white',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(6, 78, 59, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Building2 size={32} color="#a7f3d0" />
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0 }}>
              Mitra Operasional Wilayah (Local Operator)
            </h1>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#ecfdf5', margin: 0, maxWidth: '650px' }}>
            BUMDes, Koperasi, Desa Wisata, Komunitas, atau Kampus dapat mendaftar menjadi Operator Wilayah resmi BoomBoom untuk mengelola pengemudi dan memperoleh bagi hasil komisi daerah.
          </p>
        </div>

        {submittedOp ? (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '36px 24px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            border: '2px solid #10b981'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#d1fae5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <CheckCircle2 size={42} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#065f46', margin: '0 0 8px' }}>
              Permohonan Mitra Wilayah Dikirim!
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '24px' }}>
              ID Mitra: <strong>{submittedOp.operator_id}</strong> | Entitas: <strong>{submittedOp.name}</strong>
            </p>

            <button
              onClick={() => navigate('/boomboom/operator/dashboard')}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '14px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Masuk Dasbor Operator
            </button>
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid var(--border-color, #e2e8f0)'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Nama Entitas / BUMDes / Koperasi</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: BUMDes Cibarani Jaya"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Tipe Entitas Mitram</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  >
                    <option value="BUMDes">BUMDes (Badan Usaha Milik Desa)</option>
                    <option value="Koperasi">Koperasi Pemuda / Masyarakat</option>
                    <option value="Desa">Pemerintah Desa Direct</option>
                    <option value="Komunitas">Komunitas / Pokdarwis</option>
                    <option value="Kampus">Kampus / Akademisi</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Kawasan / Wilayah Operasional</label>
                  <input
                    type="text"
                    required
                    value={formData.region}
                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                    placeholder="Kawasan Perkebunan Cibarani - Subang"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Legalitas / No. SK / NIB (Jika ada)</label>
                  <input
                    type="text"
                    value={formData.legalEntity}
                    onChange={e => setFormData({ ...formData, legalEntity: e.target.value })}
                    placeholder="AHU-0019283-BUMDES.2023"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Penanggung Jawab / Kontak Person</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Pak Dudung (Kepala BUMDes)"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Nomor Telepon / WhatsApp Kontak</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+62 811-2233-4455"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '16px',
                  fontWeight: '900',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginTop: '12px'
                }}
              >
                DAFTARKAN MITRA OPERATOR WILAYAH
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default BoomOperatorRegisterPage;
