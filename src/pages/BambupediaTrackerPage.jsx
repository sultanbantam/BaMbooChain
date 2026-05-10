import React, { useMemo, useState } from 'react';
import { CheckCircle, Clock, Leaf, PlusCircle, ShieldCheck, Sprout } from 'lucide-react';
import BackButton from '../components/BackButton';

const defaultPlantings = [
  { id: 'TRK-001', species: 'Bambu Petung', location: 'Cibarani Blok A', count: 50, date: '2026-04-02', status: 'verified', notes: 'Bibit sehat dan tanah lembap.' },
  { id: 'TRK-002', species: 'Bambu Moso', location: 'Cisadane Blok C', count: 30, date: '2026-04-08', status: 'pending', notes: 'Menunggu validasi GPS.' },
];

const BambupediaTrackerPage = () => {
  const [plantings, setPlantings] = useState(() => {
    const saved = localStorage.getItem('bambupedia_plantings');
    return saved ? JSON.parse(saved) : defaultPlantings;
  });
  const [form, setForm] = useState({ species: 'Bambu Petung', location: '', count: 10, notes: '' });

  const totals = useMemo(() => ({
    count: plantings.reduce((sum, item) => sum + Number(item.count || 0), 0),
    verified: plantings.filter((item) => item.status === 'verified').length,
    pending: plantings.filter((item) => item.status === 'pending').length,
  }), [plantings]);

  const savePlantings = (next) => {
    setPlantings(next);
    localStorage.setItem('bambupedia_plantings', JSON.stringify(next));
  };

  const submitPlanting = (event) => {
    event.preventDefault();
    const next = [{
      id: `TRK-${String(plantings.length + 1).padStart(3, '0')}`,
      ...form,
      count: Number(form.count),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    }, ...plantings];
    savePlantings(next);
    setForm({ species: 'Bambu Petung', location: '', count: 10, notes: '' });
  };

  const verify = (id) => {
    savePlantings(plantings.map((item) => item.id === id ? { ...item, status: 'verified' } : item));
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ marginBottom: '28px' }}>
        <BackButton to="/bambupedia" />
      </div>

      <div className="container" style={{ textAlign: 'center', marginBottom: '42px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '999px', fontWeight: '800', marginBottom: '18px' }}>
          <Leaf size={18} /> Tracker Bambu
        </div>
        <h1 style={{ fontSize: '2.8rem', color: 'var(--text-main)', marginBottom: '12px' }}>Pantau Data Tanam dan Validasi</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.08rem', maxWidth: '720px', margin: '0 auto' }}>
          Catat penanaman, status validasi, dan estimasi dampak ekosistem untuk kebutuhan traceability bambuNUSA.
        </p>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '32px' }}>
        {[
          ['Total Bambu', totals.count, Sprout, 'var(--primary)'],
          ['Terverifikasi', totals.verified, ShieldCheck, '#1c7ed6'],
          ['Menunggu', totals.pending, Clock, '#f59f00'],
        ].map(([label, value, Icon, color]) => {
          const icon = React.createElement(Icon, { size: 28, color, style: { marginBottom: '10px' } });
          return (
            <div key={label} style={{ background: 'white', borderRadius: '18px', padding: '22px', border: '1px solid #edf2f7', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
              {icon}
              <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)' }}>{value}</div>
              <div style={{ color: 'var(--text-muted)', fontWeight: '700' }}>{label}</div>
            </div>
          );
        })}
      </div>

      <div className="container bambupedia-tracker-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 380px) 1fr', gap: '28px', alignItems: 'start' }}>
        <form onSubmit={submitPlanting} style={{ background: 'white', borderRadius: '22px', padding: '26px', border: '1px solid #edf2f7', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={22} color="var(--primary)" /> Tambah Data Tanam
          </h2>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '700' }}>
            Spesies
            <select value={form.species} onChange={(event) => setForm({ ...form, species: event.target.value })} style={{ padding: '12px', border: '1px solid #dee2e6', borderRadius: '12px' }}>
              <option>Bambu Petung</option>
              <option>Bambu Moso</option>
              <option>Bambu Hitam</option>
              <option>Bambu Apus</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '700' }}>
            Lokasi
            <input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Contoh: Cibarani Blok B" style={{ padding: '12px', border: '1px solid #dee2e6', borderRadius: '12px' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '700' }}>
            Jumlah
            <input type="number" min="1" value={form.count} onChange={(event) => setForm({ ...form, count: event.target.value })} style={{ padding: '12px', border: '1px solid #dee2e6', borderRadius: '12px' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '700' }}>
            Catatan
            <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows={3} style={{ padding: '12px', border: '1px solid #dee2e6', borderRadius: '12px', resize: 'vertical' }} />
          </label>
          <button type="submit" className="btn btn-primary" style={{ padding: '13px' }}>Simpan Tracker</button>
        </form>

        <div style={{ background: 'white', borderRadius: '22px', border: '1px solid #edf2f7', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {plantings.map((item, index) => (
            <div key={item.id} style={{ padding: '22px', borderBottom: index === plantings.length - 1 ? 'none' : '1px solid #edf2f7', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.12rem', color: 'var(--text-main)' }}>{item.species}</h3>
                  <span style={{ color: '#adb5bd', fontSize: '0.78rem', fontWeight: '800' }}>{item.id}</span>
                  <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '800', background: item.status === 'verified' ? '#ebfbee' : '#fff9db', color: item.status === 'verified' ? '#2b8a3e' : '#e67700' }}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '6px' }}>{item.count} rumpun - {item.location}</p>
                <p style={{ color: '#adb5bd', fontSize: '0.85rem' }}>{item.date} - {item.notes}</p>
              </div>
              {item.status !== 'verified' ? (
                <button onClick={() => verify(item.id)} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 14px', fontWeight: '800', cursor: 'pointer' }}>
                  Validasi
                </button>
              ) : (
                <CheckCircle size={28} color="var(--primary)" />
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .bambupedia-tracker-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BambupediaTrackerPage;
