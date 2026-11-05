import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CheckCircle2, MapPin } from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';
import { PARTNER_ENTITY_TYPES, PILOT_ZONE_OPTIONS } from '../../services/boomboom/mockData';
import { useAuth } from '../../context/AuthContext';

const BoomOperatorRegisterPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { registerOperator } = useBoomBoomStore();

  const [formData, setFormData] = useState({
    name: '',
    type: 'BUMDes',
    customTypeDetail: '',
    otherRequirementsDetail: '',
    region: 'REG-JABODETABEK',
    customRegencyCity: '',
    customProvince: '',
    projectId: 'PRJ-JABODETABEK-01',
    legalEntity: '',
    contactPerson: user?.displayName || '',
    phone: user?.phoneNumber || '',
    email: user?.email || ''
  });

  const [submittedOp, setSubmittedOp] = useState(null);

  const handleZoneChange = (newRegionId) => {
    const defaultProj = newRegionId === 'REG-JABODETABEK'
      ? 'PRJ-JABODETABEK-01'
      : newRegionId === 'REG-SECIPALE'
        ? 'PRJ-SECIPALE-02'
        : 'PRJ-DESA-LAINNYA-03';
    setFormData({
      ...formData,
      region: newRegionId,
      projectId: defaultProj
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const op = registerOperator(formData, user);
    setSubmittedOp(op);
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '12px',
    border: '1.5px solid var(--border-color, #cbd5e1)',
    background: 'var(--bg-secondary, #f8fafc)',
    color: 'var(--text-main, #0f172a)',
    fontSize: '0.88rem',
    fontWeight: '700',
    marginTop: '4px',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', color: 'var(--text-main, #0f172a)', minHeight: '100vh', paddingBottom: '60px' }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '920px', margin: '24px auto', padding: '0 20px' }}>
        
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
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: '#ffffff' }}>
              Pendaftaran Mitra Operasional Wilayah & Integrasi Proyek Desa
            </h1>
          </div>
          <p style={{ fontSize: '0.93rem', color: '#ecfdf5', margin: 0, maxWidth: '720px', lineHeight: 1.55 }}>
            Pilih <strong>Geofence Zona Pilot Terbatas</strong> (<strong>1. JaBoDeTaBek</strong>, <strong>2. SeCiPaLe</strong>, atau <strong>3. Lainnya</strong> dengan menyebutkan Kabupaten/Kota & Provinsi) serta tentukan bentuk <strong>Mitra Pengelola</strong> (BUMDes, Yayasan, Perusahaan, Organisasi, atau Lain-lain).
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
              Permohonan Mitra Wilayah Berhasil Disimpan!
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted, #475569)', marginBottom: '8px' }}>
              ID Mitra: <strong>{submittedOp.operator_id}</strong> | Entitas: <strong>{submittedOp.name}</strong> ({submittedOp.type}{submittedOp.custom_type_detail ? ` — ${submittedOp.custom_type_detail}` : ''})
            </p>
            <p style={{ fontSize: '0.85rem', color: '#047857', fontWeight: '800', marginBottom: '24px' }}>
              Zona Geofence: {submittedOp.operating_area} • Proyek: {submittedOp.project_id}
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
              Masuk Dasbor Operator Wilayah
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
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* BAGIAN 1: GEOFENCE ZONA PILOT TERBATAS */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1.5px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '18px',
                padding: '20px'
              }}>
                <h3 style={{ fontSize: '1.02rem', fontWeight: '900', margin: '0 0 12px', color: '#047857', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} /> 1. Pilih Geofence Zona Pilot Terbatas & Integrasi Proyek Desa
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main, #334155)' }}>
                      Zona Pilot Operasional *
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) => handleZoneChange(e.target.value)}
                      style={inputStyle}
                    >
                      {PILOT_ZONE_OPTIONS.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main, #334155)' }}>
                      Kode Integrasi Proyek Desa / Ekosistem
                    </label>
                    <input
                      type="text"
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      placeholder="Contoh: PRJ-JABODETABEK-01"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* JIKA PILIH 3. LAINNYA -> WAJIB ISI KABUPATEN/KOTA & PROVINSI */}
                {formData.region === 'REG-LAINNYA' && (
                  <div style={{
                    marginTop: '14px',
                    paddingTop: '14px',
                    borderTop: '1px dashed rgba(16, 185, 129, 0.4)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '14px'
                  }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '900', color: '#b45309' }}>
                        Sebutkan Kabupaten / Kota (Zona Lainnya) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customRegencyCity}
                        onChange={(e) => setFormData({ ...formData, customRegencyCity: e.target.value })}
                        placeholder="Contoh: Kabupaten Subang / Kota Bandung / Kab. Garut"
                        style={{ ...inputStyle, borderColor: '#f59f00' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '900', color: '#b45309' }}>
                        Sebutkan Provinsi (Zona Lainnya) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customProvince}
                        onChange={(e) => setFormData({ ...formData, customProvince: e.target.value })}
                        placeholder="Contoh: Jawa Barat / Jawa Tengah / Lampung"
                        style={{ ...inputStyle, borderColor: '#f59f00' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* BAGIAN 2: DROPDOWN JENIS MITRA & ISIAN DETAIL LAIN-LAIN */}
              <div style={{
                background: 'var(--bg-secondary, #f8fafc)',
                border: '1px solid var(--border-color, #cbd5e1)',
                borderRadius: '18px',
                padding: '20px'
              }}>
                <h3 style={{ fontSize: '1.02rem', fontWeight: '900', margin: '0 0 12px', color: 'var(--text-main, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={18} color="#10b981" /> 2. Kategori Mitra Pengelola & Rincian Kelembagaan
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted, #475569)' }}>
                      Pilih Jenis Mitra (Dropdown) *
                    </label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      style={inputStyle}
                    >
                      {PARTNER_ENTITY_TYPES.map((pt) => (
                        <option key={pt.value} value={pt.value}>
                          {pt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted, #475569)' }}>
                      Nama Resmi Mitra (BUMDes / Yayasan / PT / Organisasi) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: BUMDes Makmur / Yayasan Bambu / PT Hijau"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* JIKA PILIH "LAIN-LAIN" PADA DROPDOWN MITRA */}
                {formData.type === 'Lain-lain' && (
                  <div style={{ marginTop: '14px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '900', color: '#b45309' }}>
                      Sebutkan Jenis Mitra Lain-lain (Apa Bentuk Lembaganya?) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customTypeDetail}
                      onChange={(e) => setFormData({ ...formData, customTypeDetail: e.target.value })}
                      placeholder="Contoh: Kasepuhan Adat / Kelompok Tani Hutan (KTH) / Pokdarwis / Kampus / Instansi Desa"
                      style={{ ...inputStyle, borderColor: '#f59f00' }}
                    />
                  </div>
                )}

                {/* KOLOM WAJIB ISI: APA SAJA YANG HARUS DIISI & LAIN-LAINNYA */}
                <div style={{ marginTop: '14px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted, #475569)' }}>
                    Keterangan Operasional & Lain-lainnya yang Harus Diisi (Cakupan Desa/Kecamatan, Armada Binaan, Program Lokal) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.otherRequirementsDetail}
                    onChange={(e) => setFormData({ ...formData, otherRequirementsDetail: e.target.value })}
                    placeholder="Sebutkan cakupan desa/kelurahan, rencana titik jemput komunitas, jumlah pengemudi binaan, atau kerja sama khusus lainnya..."
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Legalitas / No. SK / Akta / NIB</label>
                    <input
                      type="text"
                      value={formData.legalEntity}
                      onChange={e => setFormData({ ...formData, legalEntity: e.target.value })}
                      placeholder="AHU-xxxx / SK Bupati / NIB"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Penanggung Jawab / Kontak Person *</label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="Nama Ketua / Direktur / Pengurus"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Nomor Telepon / WhatsApp *</label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+62 812-xxxx-xxxx"
                      style={inputStyle}
                    />
                  </div>
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
                  cursor: 'pointer'
                }}
              >
                SIMPAN & DAFTARKAN MITRA OPERATOR WILAYAH
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default BoomOperatorRegisterPage;
