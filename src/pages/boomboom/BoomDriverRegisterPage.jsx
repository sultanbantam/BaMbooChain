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
    ngopiUsername: user?.ngopiUsername || '',
    identityNumber: '',
    licenseNumber: '',
    vehicleType: 'BoomRide',
    vehicleBrand: '',
    vehicleYear: '2023',
    plateNumber: '',
    operatingRegion: 'REG-JABODETABEK',
    customRegencyCity: '',
    customProvince: '',
    partnerType: 'BUMDes',
    customPartnerType: '',
    otherPartnerDetails: '',
    // Payout method dropdown & separated fields
    payoutChannel: 'BANK', // 'BANK', 'EWALLET', 'BMC', 'USDT'
    payoutBank: 'Bank Mandiri',
    customBankName: '',
    payoutEwallet: 'DANA',
    payoutAccountNumber: '',
    payoutAccountHolder: '',
    bankAccount: '',
    walletBmc: user?.walletAddress || user?.bmcWallet || '',
    walletUsdt: user?.usdtWallet || '',
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
        ngopiUsername: prev.ngopiUsername || user.ngopiUsername || '',
        walletBmc: prev.walletBmc || user.walletAddress || user.bmcWallet || '',
        walletUsdt: prev.walletUsdt || user.usdtWallet || ''
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

    // Format string rekening hasil sesuai channel yang dipilih di dropdown
    let finalBankAccount = formData.bankAccount;
    if (formData.payoutChannel === 'BANK') {
      const bName = formData.payoutBank === 'LAIN' ? (formData.customBankName || 'Bank') : formData.payoutBank;
      finalBankAccount = `${bName} ${formData.payoutAccountNumber} (a.n. ${formData.payoutAccountHolder})`;
    } else if (formData.payoutChannel === 'EWALLET') {
      finalBankAccount = `${formData.payoutEwallet} ${formData.payoutAccountNumber} (a.n. ${formData.payoutAccountHolder})`;
    } else if (formData.payoutChannel === 'BMC') {
      finalBankAccount = `Wallet BMC: ${formData.walletBmc}`;
    } else if (formData.payoutChannel === 'USDT') {
      finalBankAccount = `Wallet USDT: ${formData.walletUsdt}`;
    }

    try {
      if (finalBankAccount) localStorage.setItem('boomboom_driver_bank_account', finalBankAccount);
      if (formData.walletBmc) localStorage.setItem('boomboom_driver_wallet_bmc', formData.walletBmc);
      if (formData.walletUsdt) localStorage.setItem('boomboom_driver_wallet_usdt', formData.walletUsdt);
    } catch (e) {}

    const newDriver = registerDriver({
      ...formData,
      bankAccount: finalBankAccount
    }, user);
    setSubmittedDriver(newDriver);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1.5px solid var(--border-color, #cbd5e1)',
    background: 'var(--bg-secondary, #f8fafc)',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text-main, #0f172a)',
    marginTop: '4px'
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', color: 'var(--text-main, #0f172a)', minHeight: '100vh', paddingBottom: '60px' }}>
      <BoomBoomNavHeader />

      <style>{`
        .boomboom-form-input::placeholder {
          color: #94a3b8 !important;
          opacity: 1 !important;
          font-weight: 400 !important;
        }
        [data-theme="dark"] .boomboom-form-input::placeholder {
          color: #64748b !important;
          opacity: 1 !important;
        }
      `}</style>

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
            <div style={{ fontWeight: '900', color: '#065f46', fontSize: '1.02rem', marginBottom: '4px', lineHeight: 1.3, wordBreak: 'break-word' }}>
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
                      className="boomboom-form-input"
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
                      className="boomboom-form-input"
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
                      placeholder="@username (contoh: @asep_cibarani)"
                      className="boomboom-form-input"
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
                      className="boomboom-form-input"
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
                      className="boomboom-form-input"
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
                      className="boomboom-form-input"
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
                      className="boomboom-form-input"
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
                      className="boomboom-form-input"
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
                      className="boomboom-form-input"
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
                      className="boomboom-form-input"
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
                        className="boomboom-form-input"
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
                        className="boomboom-form-input"
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
                        className="boomboom-form-input"
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
                      className="boomboom-form-input"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: REKENING HASIL (DROPDOWN) & KONTAK DARURAT */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} color="#10b981" /> 3. Rekening Hasil & Kontak Darurat
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  {/* Dropdown Metode Pencairan */}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>
                      Pilihan Jalur Rekening Pencairan Hasil (Dropdown) *
                    </label>
                    <select
                      value={formData.payoutChannel}
                      onChange={e => setFormData({ ...formData, payoutChannel: e.target.value })}
                      className="boomboom-form-input"
                      style={inputStyle}
                    >
                      <option value="BANK">1. Transfer Rekening Bank (Rupiah)</option>
                      <option value="EWALLET">2. Saldo Dompet Digital / E-Wallet (Rupiah)</option>
                      <option value="BMC">3. Dompet Token BaMbooChain (BMC Wallet)</option>
                      <option value="USDT">4. Dompet Kripto USDT (Polygon / BEP-20)</option>
                    </select>
                  </div>

                  {/* Jika Transfer Bank */}
                  {formData.payoutChannel === 'BANK' && (
                    <>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Nama Bank *</label>
                        <select
                          value={formData.payoutBank}
                          onChange={e => setFormData({ ...formData, payoutBank: e.target.value })}
                          className="boomboom-form-input"
                          style={inputStyle}
                        >
                          <option value="Bank Mandiri">Bank Mandiri</option>
                          <option value="Bank BCA">Bank Central Asia (BCA)</option>
                          <option value="Bank BRI">Bank Rakyat Indonesia (BRI)</option>
                          <option value="Bank BNI">Bank Negara Indonesia (BNI)</option>
                          <option value="Bank BSI">Bank Syariah Indonesia (BSI)</option>
                          <option value="Bank BJB">Bank Jabar Banten (BJB)</option>
                          <option value="Bank CIMB Niaga">Bank CIMB Niaga</option>
                          <option value="LAIN">Bank Lainnya</option>
                        </select>
                      </div>

                      {formData.payoutBank === 'LAIN' && (
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Nama Bank Lainnya *</label>
                          <input
                            type="text"
                            required
                            value={formData.customBankName}
                            onChange={e => setFormData({ ...formData, customBankName: e.target.value })}
                            placeholder="Contoh: Bank Danamon"
                            className="boomboom-form-input"
                            style={inputStyle}
                          />
                        </div>
                      )}

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Nomor Rekening Bank *</label>
                        <input
                          type="text"
                          required
                          value={formData.payoutAccountNumber}
                          onChange={e => setFormData({ ...formData, payoutAccountNumber: e.target.value })}
                          placeholder="Contoh: 1300012345678"
                          className="boomboom-form-input"
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Nama Pemilik Rekening (a.n.) *</label>
                        <input
                          type="text"
                          required
                          value={formData.payoutAccountHolder}
                          onChange={e => setFormData({ ...formData, payoutAccountHolder: e.target.value })}
                          placeholder="Contoh: Asep Saepulloh"
                          className="boomboom-form-input"
                          style={inputStyle}
                        />
                      </div>
                    </>
                  )}

                  {/* Jika E-Wallet */}
                  {formData.payoutChannel === 'EWALLET' && (
                    <>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Provider E-Wallet *</label>
                        <select
                          value={formData.payoutEwallet}
                          onChange={e => setFormData({ ...formData, payoutEwallet: e.target.value })}
                          className="boomboom-form-input"
                          style={inputStyle}
                        >
                          <option value="DANA">DANA</option>
                          <option value="GoPay">GoPay</option>
                          <option value="OVO">OVO</option>
                          <option value="ShopeePay">ShopeePay</option>
                          <option value="LinkAja">LinkAja</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Nomor HP Terdaftar E-Wallet *</label>
                        <input
                          type="tel"
                          required
                          value={formData.payoutAccountNumber}
                          onChange={e => setFormData({ ...formData, payoutAccountNumber: e.target.value })}
                          placeholder="Contoh: 081234567890"
                          className="boomboom-form-input"
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Nama Akun E-Wallet (a.n.) *</label>
                        <input
                          type="text"
                          required
                          value={formData.payoutAccountHolder}
                          onChange={e => setFormData({ ...formData, payoutAccountHolder: e.target.value })}
                          placeholder="Contoh: Asep Saepulloh"
                          className="boomboom-form-input"
                          style={inputStyle}
                        />
                      </div>
                    </>
                  )}

                  {/* Jika BMC Wallet */}
                  {formData.payoutChannel === 'BMC' && (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Nomor / Alamat Wallet BMC *</label>
                      <input
                        type="text"
                        required
                        value={formData.walletBmc}
                        onChange={e => setFormData({ ...formData, walletBmc: e.target.value })}
                        placeholder="0x..."
                        className="boomboom-form-input"
                        style={inputStyle}
                      />
                    </div>
                  )}

                  {/* Jika USDT Wallet */}
                  {formData.payoutChannel === 'USDT' && (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Nomor / Alamat Wallet USDT (Polygon/BEP-20) *</label>
                      <input
                        type="text"
                        required
                        value={formData.walletUsdt}
                        onChange={e => setFormData({ ...formData, walletUsdt: e.target.value })}
                        placeholder="0x..."
                        className="boomboom-form-input"
                        style={inputStyle}
                      />
                    </div>
                  )}

                  {/* Kontak Darurat */}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>Kontak Darurat (Keluarga / Kerabat) *</label>
                    <input
                      type="text"
                      required
                      value={formData.emergencyContact}
                      onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                      placeholder="Nama & No. HP Kontak Darurat"
                      className="boomboom-form-input"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Dompet Tambahan BMC/USDT jika memilih Bank atau E-Wallet */}
                {(formData.payoutChannel === 'BANK' || formData.payoutChannel === 'EWALLET') && (
                  <div style={{ marginTop: '14px', padding: '14px', borderRadius: '14px', background: 'var(--bg-secondary, #f8fafc)', border: '1px solid var(--border-color, #e2e8f0)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>
                        Nomor Wallet BMC (Opsional - Penerimaan Insentif / Reward Token)
                      </label>
                      <input
                        type="text"
                        value={formData.walletBmc}
                        onChange={e => setFormData({ ...formData, walletBmc: e.target.value })}
                        placeholder="0x..."
                        className="boomboom-form-input"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted, #475569)' }}>
                        Nomor Wallet USDT (Opsional - Jaringan Polygon / BEP-20)
                      </label>
                      <input
                        type="text"
                        value={formData.walletUsdt}
                        onChange={e => setFormData({ ...formData, walletUsdt: e.target.value })}
                        placeholder="0x..."
                        className="boomboom-form-input"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                )}
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
