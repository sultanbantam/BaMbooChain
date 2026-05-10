import React from 'react';
import { Activity, CheckCircle, Clock, Coins, Leaf, RadioTower } from 'lucide-react';
import BackButton from '../../components/BackButton';

const activities = [
  { type: 'plant', title: 'Penanaman berhasil', detail: '50 bambu di Blok A, Cibarani', time: '2 jam yang lalu', icon: Leaf, color: 'var(--primary)' },
  { type: 'token', title: 'Reward karbon diterima', detail: '50 BMC masuk ke saldo komunitas', time: '1 hari yang lalu', icon: Coins, color: '#f59f00' },
  { type: 'iot', title: 'Sensor IoT sinkron', detail: 'Kelembaban optimal di Blok C', time: '3 hari yang lalu', icon: RadioTower, color: '#339af0' },
  { type: 'verify', title: 'Validasi lapangan selesai', detail: 'Validator menyetujui laporan perawatan', time: '5 hari yang lalu', icon: CheckCircle, color: '#845ef7' },
];

const ActivitiesPage = () => (
  <div style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
    <div className="container" style={{ marginBottom: '28px' }}>
      <BackButton to="/bamboochain" />
    </div>
    <div className="container" style={{ maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '42px' }}>
        <Activity size={42} color="var(--primary)" style={{ marginBottom: '12px' }} />
        <h1 style={{ fontSize: '2.7rem', color: 'var(--text-main)', marginBottom: '12px' }}>Aktivitas BaMbooChain</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.08rem' }}>Log terbaru dari penanaman, validasi, sensor, dan reward ekosistem.</p>
      </div>

      <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #edf2f7', boxShadow: '0 12px 34px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {activities.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.title} style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: '18px', alignItems: 'center', padding: '24px', borderBottom: index === activities.length - 1 ? 'none' : '1px solid #edf2f7' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: `${item.color}16`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.08rem', marginBottom: '6px', color: 'var(--text-main)' }}>{item.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{item.detail}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#adb5bd', fontSize: '0.82rem', fontWeight: '700' }}>
                <Clock size={14} /> {item.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default ActivitiesPage;
