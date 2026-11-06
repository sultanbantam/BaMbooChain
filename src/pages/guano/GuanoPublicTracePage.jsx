import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck, QrCode, MapPin, FlaskConical, Calendar,
  Package, CheckCircle2, AlertTriangle, ArrowLeft, Lock
} from 'lucide-react';
import { useGuanoStore } from '../../services/guano/guanoStore';

export default function GuanoPublicTracePage() {
  const { token } = useParams();
  const { traceabilityTokens } = useGuanoStore();

  const traceData = traceabilityTokens.find(
    (t) => t.token.toLowerCase() === String(token || '').toLowerCase()
  );

  return (
    <div style={{
      paddingTop: 'var(--navbar-height, 140px)',
      paddingBottom: '80px',
      minHeight: '100vh',
      background: 'var(--bg-color, #f8fafc)',
      color: 'var(--text-main, #0f172a)'
    }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link
            to="/cibarani-guano"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: '#047857',
              fontWeight: '800',
              fontSize: '0.9rem'
            }}
          >
            <ArrowLeft size={16} /> Kembali ke Modul Cibarani Guano
          </Link>
        </div>

        {!traceData ? (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '40px 28px',
            border: '2px solid #f59f00',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}>
            <AlertTriangle size={48} color="#d97706" style={{ marginBottom: '12px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: '0 0 8px' }}>
              Token Ketertelusuran QR Tidak Ditemukan
            </h2>
            <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 20px' }}>
              Kode token <code>{token}</code> tidak terdaftar pada buku besar batch Cibarani Guano atau belum memperoleh pengesahan Quality Assurance.
            </p>
            <Link
              to="/cibarani-guano/trace/CG-TRC-9F4A2C8E1B7D"
              style={{
                display: 'inline-block',
                background: '#059669',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '800',
                fontSize: '0.88rem'
              }}
            >
              Lihat Contoh Token QR Valid (DEMO: CG-TRC-9F4A2C8E1B7D)
            </Link>
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '28px',
            overflow: 'hidden',
            border: '1.5px solid #10b981',
            boxShadow: '0 16px 40px rgba(6, 78, 59, 0.1)'
          }}>
            {/* Header Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%)',
              color: '#ffffff',
              padding: '28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <span style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: '900',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <ShieldCheck size={14} /> SERTIFIKAT KETERTELUSURAN PUBLIK (QR TRACEABILITY)
                  </span>
                  {traceData.is_demo && (
                    <span style={{
                      background: '#fef08a',
                      color: '#854d0e',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: '900'
                    }}>
                      MODE DATA: DEMO
                    </span>
                  )}
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '900', margin: '0 0 6px', color: '#ffffff' }}>
                  {traceData.product_name}
                </h1>
                <div style={{ fontSize: '0.9rem', color: '#a7f3d0', fontWeight: '700' }}>
                  Token Kriptografis: <code>{traceData.token}</code>
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                color: '#064e3b',
                padding: '14px',
                borderRadius: '18px',
                textAlign: 'center',
                minWidth: '110px'
              }}>
                <QrCode size={52} color="#064e3b" />
                <div style={{ fontSize: '0.68rem', fontWeight: '900', marginTop: '4px' }}>
                  VERIFIED BATCH
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '14px'
              }}>
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted, #64748b)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Package size={14} color="#059669" /> NOMOR BATCH PRODUKSI & HULU
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '900', marginTop: '6px' }}>
                    {traceData.prod_batch_code}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted, #64748b)', marginTop: '2px' }}>
                    Bahan Baku: {traceData.raw_batch_code}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted, #64748b)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#059669" /> TANGGAL PRODUKSI
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '900', marginTop: '6px' }}>
                    {traceData.production_date}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#059669', fontWeight: '700', marginTop: '2px' }}>
                    ✓ Terverifikasi Rantai Pasok
                  </div>
                </div>

                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted, #64748b)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="#059669" /> STATUS MUTU PUBLIK
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#047857', marginTop: '6px' }}>
                    {traceData.public_quality_status}
                  </div>
                </div>
              </div>

              {/* Ringkasan Hasil Uji */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid #a7f3d0',
                borderRadius: '18px',
                padding: '18px'
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#047857', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FlaskConical size={16} /> Ringkasan Hasil Uji Laboratorium yang Disetujui untuk Publik
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', lineHeight: 1.55 }}>
                  {traceData.public_test_summary}
                </div>
              </div>

              {/* Wilayah Asal & Pengelola */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '14px'
              }}>
                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#047857', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} /> Wilayah Asal Secara Umum
                  </div>
                  <div style={{ fontSize: '0.86rem', lineHeight: 1.5 }}>
                    {traceData.general_origin_region}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-secondary, #f8fafc)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#047857', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={15} /> Identitas Pengelola & Kepatuhan Konservasi
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '700', marginBottom: '4px' }}>
                    {traceData.approved_producer_identity}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #64748b)' }}>
                    {traceData.conservation_compliance}
                  </div>
                </div>
              </div>

              {/* Proteksi Privasi & Konservasi Notice */}
              <div style={{
                background: '#0f172a',
                color: '#cbd5e1',
                padding: '14px 18px',
                borderRadius: '14px',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                lineHeight: 1.5
              }}>
                <Lock size={18} color="#34d399" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Perlindungan Konservasi & Privasi Masyarakat Adat:</strong> Sesuai kebijakan keamanan Cibarani Guano, halaman publik QR ini tidak menampilkan koordinat spesifik gua, lokasi koloni kelelawar, data pribadi pekerja lokal, maupun dokumen keuangan internal.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

