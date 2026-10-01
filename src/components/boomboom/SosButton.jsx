import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, X, PhoneCall, MapPin } from 'lucide-react';
import { useBoomBoomStore } from '../../services/boomboom/boomboomStore';

const SosButton = ({ tripId = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [incidentRecord, setIncidentRecord] = useState(null);
  const { triggerSosIncident } = useBoomBoomStore();

  const handleTriggerSos = () => {
    const inc = triggerSosIncident({
      tripId: tripId || 'TRIP-EMERGENCY',
      userName: 'Pengguna BaMbooChain',
      type: 'SOS_BUTTON_TRIGGERED',
      description: 'Pengguna mengaktifkan sinyal darurat BoomSafe dari aplikasi.',
      lat: -6.6521,
      lng: 107.6932
    });
    setIncidentRecord(inc);
    setConfirmed(true);
  };

  return (
    <>
      {/* SOS Button Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          color: 'white',
          border: 'none',
          padding: '10px 18px',
          borderRadius: '30px',
          fontWeight: '800',
          fontSize: '0.85rem',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <ShieldAlert size={18} /> SOS DARURAT
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            color: 'var(--text-main, #111827)',
            width: '100%',
            maxWidth: '460px',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            position: 'relative',
            border: '2px solid #ef4444'
          }}>
            <button
              onClick={() => { setIsOpen(false); setConfirmed(false); }}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>

            {!confirmed ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  animation: 'pulse 1.5s infinite'
                }}>
                  <AlertTriangle size={36} />
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#dc2626', margin: '0 0 8px' }}>
                  Konfirmasi Sinyal SOS
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.5', marginBottom: '20px' }}>
                  Apakah Anda berada dalam situasi darurat? Menekan tombol ini akan mengirimkan lokasi real-time Anda ke <strong>Kontak Darurat</strong> dan <strong>Mitra Operator Wilayah</strong>.
                </p>

                <div style={{
                  background: '#fef2f2',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  color: '#991b1b',
                  textAlign: 'left',
                  marginBottom: '24px',
                  borderLeft: '4px solid #dc2626'
                }}>
                  <strong>Catatan Penting:</strong> Fitur SOS MVP BaMbooChain tidak secara otomatis menghubungi nomor panggilan darurat nasional (112/110) untuk menghindari panggilan palsu.
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      flex: 1,
                      background: '#e5e7eb',
                      color: '#374151',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '14px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleTriggerSos}
                    style={{
                      flex: 1,
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '14px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
                    }}
                  >
                    KIRIM SOS SEKARANG
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <CheckCircle2 size={36} />
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#15803d', margin: '0 0 8px' }}>
                  Sinyal SOS Terkirim!
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '16px' }}>
                  ID Insiden: <strong>{incidentRecord?.incident_id}</strong>
                </p>

                <div style={{
                  background: '#f0fdf4',
                  padding: '14px',
                  borderRadius: '16px',
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  color: '#166534',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} /> Location Lat: -6.6521, Lng: 107.6932
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PhoneCall size={16} /> Kontak Darurat & Operator Wilayah sedang dihubungi.
                  </div>
                </div>

                <button
                  onClick={() => { setIsOpen(false); setConfirmed(false); }}
                  style={{
                    width: '100%',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '14px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Tutup & Kembali ke Aplikasi
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SosButton;
