import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, 
  Car, 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  CreditCard
} from 'lucide-react';
import BoomBoomNavHeader from '../../components/boomboom/BoomBoomNavHeader';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';
import { PARTNER_ENTITY_TYPES, PILOT_ZONE_OPTIONS } from '../../services/boomboom/mockData';
import { useAuth } from '../../context/AuthContext';

const BoomDriverRegisterPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { registerDriver } = useBoomBoomStore();

  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    phone: user?.phoneNumber || '',
    email: user?.email || '',
    ngopiUsername: user?.ngopiUsername || '@majelisngopi',
    identityNumber: '',
    licenseNumber: '',
    vehicleType: 'BoomRide',
    vehicleBrand: 'Honda Vario 160 EV',
    vehicleYear: '2023',
    plateNumber: '',
    operatingRegion: 'REG-JABODETABEK',
    customRegencyCity: '',
    customProvince: '',
    partnerType: 'BUMDes',
    customPartnerType: '',
    otherPartnerDetails: '',
    bankAccount: '',
    emergencyContact: typeof window !== 'undefined' ? (localStorage.getItem('boomboom_emergency_contact') || '') : '',
    profilePhotoUrl: user?.photoURL || '',
    vehiclePhotoUrl: ''
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.displayName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phoneNumber || '',
        ngopiUsername: prev.ngopiUsername || user.ngopiUsername || '@majelisngopi'
      }));
    }
  }, [user]);

  const [submittedDriver, setSubmittedDriver] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.emergencyContact) {
      try {
        localStorage.setItem('boomboom_emergency_contact', formData.emergencyContact);
      } catch (err) {
        console.warn('Gagal menyimpan kontak darurat:', err);
      }
    }
    const newDriver = registerDriver(formData, user);
    setSubmittedDriver(newDriver);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1.5px solid var(--border-color, #cbd5e1)',
    background: 'var(--bg-secondary, #f8fafc)',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-main, #0f172a)',
    marginTop: '4px'
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', color: 'var(--text-main, #0f172a)', minHeight: '100vh', paddingBottom: '60px' }}>
      <BoomBoomNavHeader />

      <div style={{ maxWidth: '900px', margin: '24px auto', padding: '0 16px' }}>
        
        {/* BANNER MASUK DASBOR PENGEMUDI */}
        <div style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          border: '2px solid #10b981',
          borderRadius: '20px',
          padding: '18px 24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 6px 18px rgba(16, 185, 129, 0.15)'
        }}>
          <div>
            <div style={{ fontWeight: '900', color: '#065f46', fontSize: '1.05rem', marginBottom: '4px', whiteSpace: 'nowrap' }}>
              Sudah Terdaftar Sebagai Mitra Pengemudi?
            </div>
            <div style={{ fontSize: '0.85rem', color: '#047857' }}>
              Langsung buka <strong>Dasbor Pengemudi</strong> untuk mengaktifkan status <strong>ONLINE (SIAP NARIK)</strong> dan menerima pesanan masuk.
            </div>
          </div>
          <button
            onClick={() => navigate('/boomboom/driver/dashboard')}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 22px',
              borderRadius: '14px',
              fontWeight: '900',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
              whiteSpace: 'nowrap'
            }}
          >
            Buka Dasbor Pengemudi (Online) ➔
          </button>
        </div>
        
        {/* PAGE HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: '#ffffff',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(6, 78, 59, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <UserCheck size={28} color="#a7f3d0" />
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: '#ffffff' }}>
              Jadi Pengemudi BoomBoom
            </h1>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#ecfdf5', margin: 0, maxWidth: '650px' }}>
            Data pendaftaran Anda langsung tersinkronisasi ke database Firestore <code>boomboom_driver_profiles</code> untuk diverifikasi oleh BUMDes / Mitra Operator Wilayah.
          </p>
        </div>

        {/* SUBMITTED SUCCESS CARD */}
        {submittedDriver ? (
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

            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main, #065f46)', margin: '0 0 8px' }}>
              Pendaftaran Tersimpan di Database Pilot!
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted, #475569)', maxWidth: '500px', margin: '0 auto 20px' }}>
              ID Pengemudi: <strong>{submittedDriver.driver_id}</strong> • Akun ngopi.top: <strong>{submittedDriver.ngopi_username}</strong><br />
              Status Verifikasi: <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '8px', fontWeight: '700' }}>{submittedDriver.status}</span>
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/boomboom/driver/dashboard')}
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '14px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Buka Dasbor Pengemudi
              </button>
              <button
                onClick={() => navigate('/boomboom/operator/dashboard')}
                style={{
                  background: 'var(--bg-secondary, #f1f5f9)',
                  color: 'var(--text-main, #0f172a)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Verifikasi di Dasbor Operator
              </button>
            </div>
          </div>
        ) : (
          /* APPLICATION FORM */
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid var(--border-color, #cbd5e1)'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* SECTION 1: PERSONAL DETAILS */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="#10b981" /> 1. Data Diri & Kontak (Terhubung Akun BaMbooChain)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Nama Lengkap (Sesuai KTP)</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Contoh: Asep Saepulloh"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Nomor Telepon / WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+62 812-xxxx-xxxx"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>☕</span> Akun ngopi.top / Link Chat Driver (Wajib untuk Integrasi Order)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ngopiUsername}
                      onChange={e => setFormData({ ...formData, ngopiUsername: e.target.value })}
                      placeholder="Contoh: @majelisngopi atau link https://ngopi.top/chat/..."
                      style={inputStyle}
                    />
                    <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '4px', fontWeight: '600' }}>
                      💡 Pemesan akan langsung terhubung ke ruang obrolan ngopi.top Anda saat order dikonfirmasi.
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Nomor Induk Kependudukan (NIK)</label>
                    <input
                      type="text"
                      required
                      value={formData.identityNumber}
                      onChange={e => setFormData({ ...formData, identityNumber: e.target.value })}
                      placeholder="16 digit NIK KTP"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Nomor SIM (Surat Izin Mengemudi)</label>
                    <input
                      type="text"
                      required
                      value={formData.licenseNumber}
                      onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                      placeholder="SIM C atau SIM A"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: VEHICLE & OPERATING AREA */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Car size={18} color="#10b981" /> 2. Kendaraan & Wilayah Operasional
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Jenis Layanan Kendaraan</label>
                    <select
                      value={formData.vehicleType}
                      onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="BoomRide">BoomRide (Sepeda Motor / Motor Listrik)</option>
                      <option value="BoomCar">BoomCar (Mobil Penumpang)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Merek & Tipe Kendaraan</label>
                    <input
                      type="text"
                      required
                      value={formData.vehicleBrand}
                      onChange={e => setFormData({ ...formData, vehicleBrand: e.target.value })}
                      placeholder="Contoh: Honda Vario 160 EV"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Nomor Polisi (Plat Nomor)</label>
                    <input
                      type="text"
                      required
                      value={formData.plateNumber}
                      onChange={e => setFormData({ ...formData, plateNumber: e.target.value })}
                      placeholder="Contoh: D 4892 BB"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>
                      Geofence Zona Pilot Terbatas & Integrasi Proyek Desa *
                    </label>
                    <select
                      value={formData.operatingRegion}
                      onChange={e => setFormData({ ...formData, operatingRegion: e.target.value })}
                      style={inputStyle}
                    >
                      {PILOT_ZONE_OPTIONS.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>
                      Jenis Mitra Pengelola Wilayah (Dropdown) *
                    </label>
                    <select
                      value={formData.partnerType}
                      onChange={e => setFormData({ ...formData, partnerType: e.target.value })}
                      style={inputStyle}
                    >
                      {PARTNER_ENTITY_TYPES.map((pt) => (
                        <option key={pt.value} value={pt.value}>
                          {pt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* JIKA PILIH 3. LAINNYA: WAJIB ISI KABUPATEN/KOTA & PROVINSI */}
                {formData.operatingRegion === 'REG-LAINNYA' && (
                  <div style={{
                    marginTop: '14px',
                    padding: '14px',
                    borderRadius: '14px',
                    background: 'rgba(245, 159, 0, 0.08)',
                    border: '1px dashed #f59f00',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '12px'
                  }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#b45309' }}>
                        Sebutkan Kabupaten / Kota (Zona Lainnya) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customRegencyCity}
                        onChange={e => setFormData({ ...formData, customRegencyCity: e.target.value })}
                        placeholder="Contoh: Kabupaten Subang / Kota Bandung"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#b45309' }}>
                        Sebutkan Provinsi (Zona Lainnya) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customProvince}
                        onChange={e => setFormData({ ...formData, customProvince: e.target.value })}
                        placeholder="Contoh: Jawa Barat / Jawa Tengah"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                )}

                {/* JIKA PILIH MITRA "LAIN-LAIN" ATAU RINCIAN TAMBAHAN MITRA */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '14px' }}>
                  {formData.partnerType === 'Lain-lain' && (
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#b45309' }}>
                        Sebutkan Jenis Mitra Lain-lain (Apa Bentuk Lembaganya?) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customPartnerType}
                        onChange={e => setFormData({ ...formData, customPartnerType: e.target.value })}
                        placeholder="Contoh: Kasepuhan Adat / Kelompok Tani / Pokdarwis"
                        style={inputStyle}
                      />
                    </div>
                  )}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>
                      Nama Mitra / Keterangan Lain-lainnya (Opsional/Wajib diisi jika Lain-lain)
                    </label>
                    <input
                      type="text"
                      required={formData.partnerType === 'Lain-lain'}
                      value={formData.otherPartnerDetails}
                      onChange={e => setFormData({ ...formData, otherPartnerDetails: e.target.value })}
                      placeholder="Contoh: Nama BUMDes / Yayasan / PT / Organisasi pengelola"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: BANK ACCOUNT & EMERGENCY CONTACT */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} color="#10b981" /> 3. Rekening Hasil & Kontak Darurat
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Rekening Bank / E-Wallet Pembayaran</label>
                    <input
                      type="text"
                      required
                      value={formData.bankAccount}
                      onChange={e => setFormData({ ...formData, bankAccount: e.target.value })}
                      placeholder="Bank Mandiri 13000xxxx (a.n. Asep)"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Kontak Darurat (Keluarga / Kerabat)</label>
                    <input
                      type="text"
                      required
                      value={formData.emergencyContact}
                      onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                      placeholder="Nama & No. HP Kontak Darurat"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '16px',
                  fontWeight: '900',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                }}
              >
                KIRIM PERMOHONAN PENDAFTARAN PENGEMUDI
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoomDriverRegisterPage;
