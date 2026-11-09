import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Ticket, Calendar, Users, QrCode, Share2, CheckCircle2, 
  Clock, MapPin, ArrowRight, Phone, AlertCircle
} from 'lucide-react';
import CibaraniNavHeader from '../../components/cibarani/CibaraniNavHeader';
import { useCibaraniStore } from '../../services/cibarani/cibaraniStore';
import { useAuth } from '../../context/AuthContext';

const CibaraniMyBookingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings } = useCibaraniStore();
  const [selectedBooking, setSelectedBooking] = useState(bookings[0] || null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '8px', fontWeight: '800', fontSize: '0.75rem' }}>✓ Dikonfirmasi</span>;
      case 'PENDING_CONFIRMATION':
        return <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '8px', fontWeight: '800', fontSize: '0.75rem' }}>⏳ Menunggu Konfirmasi</span>;
      case 'COMPLETED':
        return <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '8px', fontWeight: '800', fontSize: '0.75rem' }}>✓ Selesai Dikunjungi</span>;
      case 'CANCELLED':
        return <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '8px', fontWeight: '800', fontSize: '0.75rem' }}>✕ Dibatalkan</span>;
      default:
        return <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '8px', fontWeight: '800', fontSize: '0.75rem' }}>{status}</span>;
    }
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', color: 'var(--text-main, #0f172a)', paddingBottom: '60px' }}>
      <CibaraniNavHeader />

      <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 16px' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#047857', letterSpacing: '1px', textTransform: 'uppercase' }}>
              TIKET & STATUS RESERVASI ANDA
            </span>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '4px 0' }}>
              Tiket Cibarani Weekend Experience
            </h1>
            <p style={{ color: 'var(--text-muted, #64748b)', margin: 0, fontSize: '0.9rem' }}>
              Kelola jadwal kunjungan, tunjukkan QR boarding pass saat tiba di gerbang adat, dan bagikan rencana perjalanan.
            </p>
          </div>

          <button
            onClick={() => navigate('/cibarani/booking')}
            style={{
              background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '14px',
              fontWeight: '800',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            + Pesan Tiket Baru
          </button>
        </div>

        {bookings.length === 0 ? (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '50px 20px',
            textAlign: 'center',
            border: '1.5px solid var(--border-color, #cbd5e1)'
          }}>
            <Ticket size={48} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>
              Belum Ada Reservasi Aktif
            </h3>
            <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.88rem', maxWidth: '400px', margin: '0 auto 20px' }}>
              Pilihlah salah satu batch akhir pekan dan rasakan langsung kehangatan kearifan adat Kasepuhan Cibarani.
            </p>
            <button
              onClick={() => navigate('/cibarani/booking')}
              style={{
                background: '#047857',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Lihat Jadwal & Pesan Tiket
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* LIST BOOKING CARDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {bookings.map((b) => {
                const isSelected = selectedBooking?.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    style={{
                      background: 'var(--bg-card, #ffffff)',
                      borderRadius: '20px',
                      padding: '18px 20px',
                      border: isSelected ? '2px solid #047857' : '1.5px solid var(--border-color, #cbd5e1)',
                      boxShadow: isSelected ? '0 8px 24px rgba(4,120,87,0.12)' : '0 4px 12px rgba(0,0,0,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#047857', background: 'rgba(4,120,87,0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                        {b.bookingCode}
                      </span>
                      {getStatusBadge(b.status)}
                    </div>

                    <div style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', marginBottom: '6px' }}>
                      {b.packageName}
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted, #475569)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                      <span>📅 {b.visitDate}</span>
                      <span>👥 {b.participantsCount} Tamu</span>
                      <span>💰 Rp {b.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DETAIL & BOARDING PASS PASSENGER TICKET */}
            {selectedBooking && (
              <div style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                color: '#ffffff',
                borderRadius: '28px',
                padding: '28px',
                boxShadow: '0 16px 40px rgba(6,78,59,0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '16px', marginBottom: '18px' }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', fontWeight: '900', background: '#fbbf24', color: '#78350f', padding: '2px 8px', borderRadius: '6px' }}>
                        DIGITAL BOARDING PASS
                      </span>
                      <div style={{ fontSize: '1.25rem', fontWeight: '900', marginTop: '6px' }}>
                        Kasepuhan Cibarani
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Kode Tiket</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#fbbf24' }}>
                        {selectedBooking.bookingCode}
                      </div>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.85rem', marginBottom: '20px' }}>
                    <div>
                      <div style={{ opacity: 0.7, fontSize: '0.75rem' }}>Nama Pemesan:</div>
                      <strong>{selectedBooking.guestName}</strong>
                    </div>
                    <div>
                      <div style={{ opacity: 0.7, fontSize: '0.75rem' }}>Jumlah Rombongan:</div>
                      <strong>{selectedBooking.participantsCount} Orang</strong>
                    </div>
                    <div>
                      <div style={{ opacity: 0.7, fontSize: '0.75rem' }}>Tanggal Kunjungan:</div>
                      <strong>{selectedBooking.visitDate}</strong>
                    </div>
                    <div>
                      <div style={{ opacity: 0.7, fontSize: '0.75rem' }}>Status Tiket:</div>
                      <strong style={{ color: '#fde047' }}>{selectedBooking.status}</strong>
                    </div>
                  </div>

                  {/* QR CODE CHECK-IN BADGE */}
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '20px',
                    color: '#0f172a',
                    textAlign: 'center',
                    marginBottom: '20px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#047857', marginBottom: '8px' }}>
                      TUNJUKKAN QR CODE INI KE PEMANDU SAAT TIBA
                    </div>
                    {/* SVG QR Code Simulation */}
                    <div style={{ display: 'inline-block', padding: '8px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                      <svg width="120" height="120" viewBox="0 0 100 100">
                        <rect width="100" height="100" fill="#ffffff" />
                        <rect x="10" y="10" width="25" height="25" fill="#064e3b" />
                        <rect x="65" y="10" width="25" height="25" fill="#064e3b" />
                        <rect x="10" y="65" width="25" height="25" fill="#064e3b" />
                        <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                        <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                        <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                        <rect x="42" y="15" width="15" height="8" fill="#064e3b" />
                        <rect x="42" y="35" width="20" height="15" fill="#064e3b" />
                        <rect x="65" y="55" width="25" height="15" fill="#064e3b" />
                        <rect x="42" y="70" width="15" height="20" fill="#064e3b" />
                        <circle cx="50" cy="50" r="6" fill="#fbbf24" />
                      </svg>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '6px' }}>
                      Validasi Check-in Lapangan Resmi YSNJ
                    </div>
                  </div>
                </div>

                {/* BOTTOM ASSISTANCE */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href="https://wa.me/6281234567890?text=Halo%20Admin%20Cibarani,%20saya%20ingin%20konfirmasi%20tiket%20saya"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      background: '#fbbf24',
                      color: '#78350f',
                      padding: '12px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Phone size={15} /> Hubungi Panitia (WA)
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CibaraniMyBookingsPage;

