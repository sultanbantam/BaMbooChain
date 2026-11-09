import React, { useState } from 'react';
import { 
  ShieldAlert, Calendar, Ticket, ShoppingBag, Bot, CheckCircle2, 
  XCircle, Clock, Edit2, Plus, Sparkles, Filter, AlertTriangle, Layers
} from 'lucide-react';
import CibaraniNavHeader from '../../components/cibarani/CibaraniNavHeader';
import { useCibaraniStore } from '../../services/cibarani/cibaraniStore';
import { useAuth } from '../../context/AuthContext';

const CibaraniAdminPage = () => {
  const { user } = useAuth();
  const { 
    bookings, packages, events, products, agentLogs, agentApprovals,
    updateBookingStatus, updatePackagePrice, approveAgentTask, updateProduct, addProduct
  } = useCibaraniStore();

  const [activeTab, setActiveTab] = useState('BOOKINGS'); // 'BOOKINGS' | 'PACKAGES' | 'AGENTS' | 'PRODUCTS'
  
  // Package editing state
  const [editingPrice, setEditingPrice] = useState(packages[0]?.indicativePrice || 1000000);
  const [editingQuota, setEditingQuota] = useState(packages[0]?.maxQuotaPerBatch || 20);
  const [priceUpdatedMsg, setPriceUpdatedMsg] = useState('');

  const handleSavePackageSettings = (e) => {
    e.preventDefault();
    updatePackagePrice(packages[0].id, editingPrice, editingQuota);
    setPriceUpdatedMsg('Harga paket dan kuota berhasil diperbarui.');
    setTimeout(() => setPriceUpdatedMsg(''), 3000);
  };

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', color: 'var(--text-main, #0f172a)', paddingBottom: '60px' }}>
      <CibaraniNavHeader />

      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 16px' }}>
        {/* HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          color: '#ffffff',
          borderRadius: '24px',
          padding: '24px 30px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldAlert size={20} color="#fbbf24" />
              <span style={{ fontSize: '0.8rem', fontWeight: '900', background: '#fbbf24', color: '#78350f', padding: '2px 8px', borderRadius: '6px' }}>
                DASHBOARD PENGELOLA & CMS
              </span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0 }}>
              Cibarani Operations & AI Orchestrator
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', opacity: 0.85 }}>
              Pengaturan reservasi, kuota paket, kurasi produk lokal, dan workflow AI agent otonom Yayasan Sabumi Nusantara Jaya.
            </p>
          </div>

          <div style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.15)', padding: '8px 14px', borderRadius: '12px' }}>
            Operator Aktif: <strong>{user?.displayName || user?.email || 'Admin YSNJ'}</strong>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px' }}>
          {[
            { id: 'BOOKINGS', label: `Kelola Booking (${bookings.length})`, icon: <Ticket size={16} /> },
            { id: 'PACKAGES', label: 'Harga & Kuota Paket', icon: <Edit2 size={16} /> },
            { id: 'AGENTS', label: 'AI Agents & Audit Trail', icon: <Bot size={16} /> },
            { id: 'PRODUCTS', label: `Katalog Produk (${products.length})`, icon: <ShoppingBag size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '14px',
                fontWeight: activeTab === tab.id ? '800' : '600',
                fontSize: '0.85rem',
                border: '1.5px solid ' + (activeTab === tab.id ? '#047857' : 'var(--border-color, #cbd5e1)'),
                background: activeTab === tab.id ? '#047857' : 'var(--bg-card, #ffffff)',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted, #475569)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: BOOKING MANAGEMENT */}
        {activeTab === 'BOOKINGS' && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '24px',
            border: '1.5px solid var(--border-color, #cbd5e1)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main, #0f172a)' }}>
              Daftar Permohonan & Status Reservasi Tamu
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color, #e2e8f0)', color: 'var(--text-muted, #64748b)' }}>
                    <th style={{ padding: '12px 14px' }}>KODE TIKET</th>
                    <th style={{ padding: '12px 14px' }}>NAMA TAMU & KONTAK</th>
                    <th style={{ padding: '12px 14px' }}>TANGGAL KUNJUNGAN</th>
                    <th style={{ padding: '12px 14px' }}>ROMBONGAN</th>
                    <th style={{ padding: '12px 14px' }}>SUBTOTAL</th>
                    <th style={{ padding: '12px 14px' }}>STATUS</th>
                    <th style={{ padding: '12px 14px' }}>AKSI OPERATOR</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                      <td style={{ padding: '14px', fontWeight: '800', color: '#047857' }}>
                        {b.bookingCode}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <strong>{b.guestName}</strong>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748b)' }}>{b.guestPhone} • {b.guestEmail}</div>
                        {b.specialRequests && (
                          <div style={{ fontSize: '0.72rem', color: '#b45309', marginTop: '2px' }}>
                            Catatan: {b.specialRequests}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px', fontWeight: '700' }}>
                        {b.visitDate}
                      </td>
                      <td style={{ padding: '14px' }}>
                        {b.participantsCount} Orang
                      </td>
                      <td style={{ padding: '14px', fontWeight: '800' }}>
                        Rp {b.totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.74rem',
                          fontWeight: '800',
                          background: b.status === 'CONFIRMED' ? '#dcfce7' : b.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7',
                          color: b.status === 'CONFIRMED' ? '#15803d' : b.status === 'CANCELLED' ? '#b91c1c' : '#b45309'
                        }}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {b.status !== 'CONFIRMED' && (
                            <button
                              onClick={() => updateBookingStatus(b.id, 'CONFIRMED', user?.displayName || 'Admin YSNJ')}
                              style={{
                                background: '#10b981',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: '800',
                                cursor: 'pointer'
                              }}
                            >
                              Konfirmasi
                            </button>
                          )}
                          {b.status !== 'CANCELLED' && (
                            <button
                              onClick={() => updateBookingStatus(b.id, 'CANCELLED', user?.displayName || 'Admin YSNJ')}
                              style={{
                                background: 'transparent',
                                color: '#ef4444',
                                border: '1px solid #ef4444',
                                padding: '5px 8px',
                                borderRadius: '8px',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              Batalkan
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PACKAGES & PRICING MANAGEMENT */}
        {activeTab === 'PACKAGES' && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '28px',
            border: '1.5px solid var(--border-color, #cbd5e1)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main, #0f172a)' }}>
              Pengaturan Tarif & Kuota Paket Wisata Utama
            </h3>

            {priceUpdatedMsg && (
              <div style={{ background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontWeight: '800', fontSize: '0.85rem' }}>
                ✓ {priceUpdatedMsg}
              </div>
            )}

            <form onSubmit={handleSavePackageSettings} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)', display: 'block', marginBottom: '6px' }}>
                  Harga Paket Indikatif (Rupiah per Orang)
                </label>
                <input
                  type="number"
                  step="50000"
                  value={editingPrice}
                  onChange={e => setEditingPrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--border-color, #cbd5e1)',
                    background: 'var(--bg-secondary, #f8fafc)',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    color: 'var(--text-main, #0f172a)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted, #475569)', display: 'block', marginBottom: '6px' }}>
                  Kuota Maksimum Tamu per Batch (Orang)
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={editingQuota}
                  onChange={e => setEditingQuota(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--border-color, #cbd5e1)',
                    background: 'var(--bg-secondary, #f8fafc)',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    color: 'var(--text-main, #0f172a)'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '14px',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Simpan Perubahan Tarif & Kuota
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: AI AGENTS ORCHESTRATION & AUDIT LOGS */}
        {activeTab === 'AGENTS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* AGENT APPROVALS QUEUE (LEVEL 2) */}
            <div style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: '24px',
              padding: '24px',
              border: '1.5px solid var(--border-color, #cbd5e1)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Sparkles size={20} color="#b45309" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-main, #0f172a)' }}>
                  Antrean Persetujuan Tugas AI Agent (Level 2 Approval Required)
                </h3>
              </div>

              {agentApprovals.map((appr) => (
                <div
                  key={appr.id}
                  style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    borderRadius: '16px',
                    padding: '16px',
                    border: '1px solid var(--border-color, #e2e8f0)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#047857', fontWeight: '800' }}>
                      {appr.agent} • {appr.level}
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-main, #0f172a)' }}>
                      {appr.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>
                      {appr.description}
                    </div>
                  </div>

                  {appr.status === 'PENDING' ? (
                    <button
                      onClick={() => approveAgentTask(appr.id)}
                      style={{
                        background: '#047857',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontWeight: '800',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Setujui & Jalankan
                    </button>
                  ) : (
                    <span style={{ color: '#15803d', fontWeight: '800', fontSize: '0.8rem' }}>
                      ✓ Sudah Disetujui
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* AUDIT LOGS TRAIL */}
            <div style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: '24px',
              padding: '24px',
              border: '1.5px solid var(--border-color, #cbd5e1)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '14px', color: 'var(--text-main, #0f172a)' }}>
                Audit Trail & Aktivitas Otonom AI Agent
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {agentLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      background: 'var(--bg-secondary, #f8fafc)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      border: '1px solid var(--border-color, #f1f5f9)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: '800', color: '#047857' }}>{log.agent}</span>: {log.action}
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748b)' }}>{log.details}</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTS CMS */}
        {activeTab === 'PRODUCTS' && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '24px',
            padding: '24px',
            border: '1.5px solid var(--border-color, #cbd5e1)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main, #0f172a)' }}>
              Kurasi Hasil Bumi & Produk Desa Adat
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    borderRadius: '16px',
                    padding: '16px',
                    border: '1px solid var(--border-color, #e2e8f0)'
                  }}
                >
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-main, #0f172a)', marginBottom: '4px' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted, #64748b)', marginBottom: '8px' }}>
                    Produsen: {p.producer}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#047857' }}>
                    Rp {p.indicativePrice.toLocaleString('id-ID')} <span style={{ fontSize: '0.75rem' }}>{p.priceUnit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CibaraniAdminPage;

