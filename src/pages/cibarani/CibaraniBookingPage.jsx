import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, CheckCircle2, ShieldCheck, AlertCircle, 
  ArrowRight, CreditCard, QrCode, Phone, Mail, FileText, Info
} from 'lucide-react';
import CibaraniNavHeader from '../../components/cibarani/CibaraniNavHeader';
import { useCibaraniStore } from '../../services/cibarani/cibaraniStore';
import { useAuth } from '../../context/AuthContext';

const CibaraniBookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { packages, events, createBooking } = useCibaraniStore();
  const mainPkg = packages[0] || { indicativePrice: 1000000, title: 'Paket Cibarani Weekend Experience' };

  // Form State
  const [formData, setFormData] = useState({
    packageId: mainPkg.id,
    visitDate: '2026-11-14',
    participantsCount: 2,
    guestName: user?.displayName || '',
    guestEmail: user?.email || '',
    guestPhone: user?.phoneNumber || '',
    specialRequests: '',
    paymentMethod: 'TRANSFER_MANUAL', // TRANSFER_MANUAL | QRIS_DIRECT | BMC_ESCROW | USDT
    agreedToRules: false
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  // Available batches (Saturdays)
  const availableBatches = [
    { date: '2026-11-14', label: '14 - 15 November 2026 (Batch 1)', quotaLeft: 9, status: 'Tersedia' },
    { date: '2026-11-21', label: '21 - 22 November 2026 (Batch 2)', quotaLeft: 14, status: 'Tersedia' },
    { date: '2026-11-28', label: '28 - 29 November 2026 (Seren Padi)', quotaLeft: 8, status: 'Hampir Penuh' },
    { date: '2026-12-05', label: '05 - 06 Desember 2026 (Batch 4)', quotaLeft: 18, status: 'Tersedia' },
    { date: '2026-12-12', label: '12 - 13 Desember 2026 (Bambu Sabuk Hijau)', quotaLeft: 17, status: 'Tersedia' }
  ];

  const pricePerPerson = mainPkg.indicativePrice || 1000000;
  const totalAmount = pricePerPerson * formData.participantsCount;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.agreedToRules) {
      setErrorMsg('Anda wajib menyetujui tata tertib adat, keselamatan, dan kebijakan privasi Kasepuhan Cibarani.');
      return;
    }

    try {
      setLoading(true);
      const res = createBooking(formData, user);
      setSuccessBooking(res);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memproses reservasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', color: 'var(--text-main, #0f172a)', paddingBottom: '60px' }}>
      <CibaraniNavHeader />

      <div style={{ maxWidth: '960px', margin: '30px auto', padding: '0 16px' }}>
        {/* TITLE HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#047857', letterSpacing: '1px', textTransform: 'uppercase' }}>
            SISTEM RESERVASI RESMI CIBARANI WEEKEND
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '6px 0 8px' }}>
            Formulir Pemesanan & Pendaftaran Tamu
          </h1>
          <p style={{ color: 'var(--text-muted, #64748b)', maxWidth: '600px', margin: '0 auto', fontSize: '0.92rem' }}>
            Pilih tanggal akhir pekan, daftarkan jumlah rombongan, dan dapatkan konfirmasi resmi dari panitia Yayasan Sabumi Nusantara Jaya.
          </p>
        </div>

        {/* JIKA BERHASIL BOOKING */}
        {successBooking ? (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '28px',
            padding: '36px 30px',
            border: '2px solid #10b981',
            boxShadow: '0 12px 40px rgba(16, 185, 129, 0.15)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#064e3b', margin: '0 0 6px' }}>
              Permohonan Reservasi Berhasil Dibuat!
            </h2>
            <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.92rem', marginBottom: '20px' }}>
              Kode Tiket Booking Unik Anda:
            </p>

            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              border: '2px dashed #059669',
              padding: '12px 28px',
              borderRadius: '16px',
              fontSize: '1.6rem',
              fontWeight: '900',
              color: '#047857',
              letterSpacing: '2px',
              marginBottom: '24px'
            }}>
              {successBooking.bookingCode}
            </div>

            <div style={{
              maxWidth: '520px',
              margin: '0 auto 28px',
              background: 'var(--bg-secondary, #f8fafc)',
              padding: '20px',
              borderRadius: '18px',
              border: '1px solid var(--border-color, #e2e8f0)',
              textAlign: 'left',
              fontSize: '0.88rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>Paket:</span>
                <strong style={{ color: 'var(--text-main, #0f172a)' }}>{successBooking.packageName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>Tanggal Kunjungan:</span>
                <strong style={{ color: 'var(--text-main, #0f172a)' }}>{successBooking.visitDate} (Sabtu - Minggu)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>Jumlah Tamu:</span>
                <strong style={{ color: 'var(--text-main, #0f172a)' }}>{successBooking.participantsCount} Orang</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderTop: '1px dashed var(--border-color, #cbd5e1)', paddingTop: '8px' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>Total Biaya:</span>
                <strong style={{ color: '#047857', fontSize: '1.05rem' }}>Rp {successBooking.totalAmount.toLocaleString('id-ID')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>Status Reservasi:</span>
                <span style={{ background: '#fef3c7', color: '#92400e', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', fontSize: '0.78rem' }}>
                  {successBooking.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/cibarani/my-bookings')}
                style={{
                  background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                  color: '#ffffff',
                  padding: '14px 28px',
                  borderRadius: '14px',
                  fontWeight: '800',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                Buka Tiket & E-Boarding Pass Saya →
              </button>
              <button
                onClick={() => setSuccessBooking(null)}
                style={{
                  background: 'transparent',
                  color: 'var(--text-muted, #475569)',
                  padding: '14px 20px',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                Buat Booking Lain
              </button>
            </div>
          </div>
        ) : (
          /* FORM BOOKING */
          <form onSubmit={handleSubmit} style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '28px',
            padding: '32px',
            boxShadow: '0 10px 35px rgba(0,0,0,0.05)',
            border: '1.5px solid var(--border-color, #cbd5e1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {errorMsg && (
              <div style={{
                background: '#fee2e2',
                color: '#b91c1c',
                padding: '14px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.88rem',
                fontWeight: '700'
              }}>
                <AlertCircle size={18} /> {errorMsg}
              </div>
            )}

            {/* SECTION 1: PILIHAN JADWAL BATCH & PESERTA */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#047857" /> 1. Pilih Batch Tanggal & Jumlah Peserta
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)', display: 'block', marginBottom: '6px' }}>
                    Pilih Jadwal Batch Akhir Pekan (Sabtu - Minggu) *
                  </label>
                  <select
                    value={formData.visitDate}
                    onChange={e => setFormData({ ...formData, visitDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--border-color, #cbd5e1)',
                      background: 'var(--bg-secondary, #f8fafc)',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: 'var(--text-main, #0f172a)'
                    }}
                  >
                    {availableBatches.map(b => (
                      <option key={b.date} value={b.date}>
                        {b.label} — Sisa Kuota: {b.quotaLeft} org ({b.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)', display: 'block', marginBottom: '6px' }}>
                    Jumlah Tamu / Peserta Rombongan (Orang) *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      required
                      value={formData.participantsCount}
                      onChange={e => setFormData({ ...formData, participantsCount: Math.max(1, parseInt(e.target.value) || 1) })}
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        borderRadius: '14px',
                        border: '1.5px solid var(--border-color, #cbd5e1)',
                        background: 'var(--bg-secondary, #f8fafc)',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        color: 'var(--text-main, #0f172a)'
                      }}
                    />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)', fontWeight: '600' }}>
                      Orang
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: DATA PEMESAN */}
            <div style={{ borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#047857" /> 2. Data Pemesan / Koordinator Rombongan
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)', display: 'block', marginBottom: '4px' }}>
                    Nama Lengkap Pemesan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guestName}
                    onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--border-color, #cbd5e1)',
                      background: 'var(--bg-secondary, #f8fafc)',
                      fontSize: '0.9rem',
                      color: 'var(--text-main, #0f172a)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)', display: 'block', marginBottom: '4px' }}>
                    Nomor WhatsApp / Telepon Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.guestPhone}
                    onChange={e => setFormData({ ...formData, guestPhone: e.target.value })}
                    placeholder="+62 812-xxxx-xxxx"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--border-color, #cbd5e1)',
                      background: 'var(--bg-secondary, #f8fafc)',
                      fontSize: '0.9rem',
                      color: 'var(--text-main, #0f172a)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)', display: 'block', marginBottom: '4px' }}>
                    Alamat Email (Untuk Pengiriman Tiket) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.guestEmail}
                    onChange={e => setFormData({ ...formData, guestEmail: e.target.value })}
                    placeholder="email@domain.com"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--border-color, #cbd5e1)',
                      background: 'var(--bg-secondary, #f8fafc)',
                      fontSize: '0.9rem',
                      color: 'var(--text-main, #0f172a)'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '14px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)', display: 'block', marginBottom: '4px' }}>
                  Catatan Kebutuhan Khusus / Pola Makan / Kondisi Fisik
                </label>
                <textarea
                  rows="2"
                  value={formData.specialRequests}
                  onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Contoh: Ada peserta vegetarian, alergi udang, butuh dipandu jalur landai..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--border-color, #cbd5e1)',
                    background: 'var(--bg-secondary, #f8fafc)',
                    fontSize: '0.88rem',
                    color: 'var(--text-main, #0f172a)'
                  }}
                />
              </div>
            </div>

            {/* SECTION 3: METODE PEMBAYARAN & INSTRUKSI */}
            <div style={{ borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="#047857" /> 3. Metode Pembayaran & Verifikasi
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px',
                  borderRadius: '14px',
                  border: formData.paymentMethod === 'TRANSFER_MANUAL' ? '2px solid #047857' : '1px solid var(--border-color, #cbd5e1)',
                  background: formData.paymentMethod === 'TRANSFER_MANUAL' ? 'rgba(4, 120, 87, 0.08)' : 'var(--bg-secondary, #f8fafc)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="TRANSFER_MANUAL"
                    checked={formData.paymentMethod === 'TRANSFER_MANUAL'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'TRANSFER_MANUAL' })}
                  />
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>Transfer Bank Rekening Yayasan</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)' }}>BCA / Mandiri / BRI</div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px',
                  borderRadius: '14px',
                  border: formData.paymentMethod === 'QRIS_DIRECT' ? '2px solid #047857' : '1px solid var(--border-color, #cbd5e1)',
                  background: formData.paymentMethod === 'QRIS_DIRECT' ? 'rgba(4, 120, 87, 0.08)' : 'var(--bg-secondary, #f8fafc)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="QRIS_DIRECT"
                    checked={formData.paymentMethod === 'QRIS_DIRECT'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'QRIS_DIRECT' })}
                  />
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>QRIS Merchant Statis</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)' }}>Semua m-Banking & E-Wallet</div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px',
                  borderRadius: '14px',
                  border: formData.paymentMethod === 'BMC_ESCROW' ? '2px solid #047857' : '1px solid var(--border-color, #cbd5e1)',
                  background: formData.paymentMethod === 'BMC_ESCROW' ? 'rgba(4, 120, 87, 0.08)' : 'var(--bg-secondary, #f8fafc)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BMC_ESCROW"
                    checked={formData.paymentMethod === 'BMC_ESCROW'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'BMC_ESCROW' })}
                  />
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>Token BMC / USDT Web3</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)' }}>Polygon / BEP-20 (1 BMC = Rp 18.099)</div>
                  </div>
                </label>
              </div>

              {/* RINCIAN INSTRUKSI PEMBAYARAN */}
              <div style={{
                background: 'var(--bg-secondary, #f8fafc)',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid var(--border-color, #e2e8f0)',
                fontSize: '0.84rem',
                lineHeight: 1.5
              }}>
                {formData.paymentMethod === 'TRANSFER_MANUAL' && (
                  <div>
                    <strong>Instruksi Transfer Rekening Resmi:</strong>
                    <div>• Bank Mandiri: <strong>13000-xxxx-xxxx</strong> (a.n. Yayasan Sabumi Nusantara Jaya)</div>
                    <div>• Bank BCA: <strong>8910-xxxx-xx</strong> (a.n. Yayasan Sabumi Nusantara Jaya)</div>
                    <div style={{ color: 'var(--text-muted, #64748b)', marginTop: '4px' }}>
                      *Setelah submit formulir, bukti transfer dapat dikonfirmasikan ke WhatsApp Admin atau di-upload pada tiket Anda.
                    </div>
                  </div>
                )}
                {formData.paymentMethod === 'QRIS_DIRECT' && (
                  <div>
                    <strong>Instruksi QRIS Merchant:</strong>
                    <div>Scan QRIS Yayasan Sabumi Nusantara Jaya yang terbit saat tiket berhasil didaftarkan. Gunakan nominal persis sesuai total subtotal.</div>
                  </div>
                )}
                {formData.paymentMethod === 'BMC_ESCROW' && (
                  <div>
                    <strong>Instruksi Smart Contract Escrow BaMbooChain:</strong>
                    <div>Biaya setara: <strong>{(totalAmount / 18099).toFixed(2)} BMC</strong> (Kurs resmi 1 BMC = Rp 18.099). Pembayaran diamankan di escrow smart contract hingga Anda tiba di lokasi.</div>
                  </div>
                )}
              </div>
            </div>

            {/* RINGKASAN BIAYA & PERSETUJUAN ADAT */}
            <div style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              padding: '20px',
              borderRadius: '20px',
              border: '1.5px solid #10b981'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: '#064e3b', fontWeight: '700' }}>
                  Biaya Paket ({formData.participantsCount} Peserta x Rp {pricePerPerson.toLocaleString('id-ID')}):
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#047857' }}>
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#065f46', lineHeight: 1.4 }}>
                Termasuk: Penginapan homestay adat 2D1N, makan 3x khas huma, pemandu lokal, edukasi leuit & kedaulatan pangan, jelajah alam, dan kontribusi pelestarian adat.
              </div>

              {/* CHECKBOX PERSETUJUAN TATA TERTIB ADAT */}
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px dashed #10b981',
                cursor: 'pointer',
                fontSize: '0.84rem',
                color: '#064e3b',
                fontWeight: '600'
              }}>
                <input
                  type="checkbox"
                  required
                  checked={formData.agreedToRules}
                  onChange={e => setFormData({ ...formData, agreedToRules: e.target.checked })}
                  style={{ marginTop: '3px' }}
                />
                <span>
                  Saya menyetujui seluruh <strong>Tata Tertib Adat Kasepuhan Cibarani</strong>, bersedia mematuhi arahan pemandu, menghormati larangan di Leuweung Kolot/Titipan, serta menyetujui kebijakan keselamatan dan privasi komunitas.
                </span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '16px',
                borderRadius: '16px',
                fontWeight: '900',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 24px rgba(4, 120, 87, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? 'Memproses Reservasi...' : 'KIRIM PERMOHONAN RESERVASI SEKARANG'} <ArrowRight size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CibaraniBookingPage;
