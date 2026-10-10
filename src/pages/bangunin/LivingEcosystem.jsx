import React, { useState } from 'react';
import { 
  HeartHandshake, Bus, Recycle, ShoppingBag, Award, Calendar, 
  MapPin, Clock, Star, Phone, CheckCircle2, Plus, Sparkles, 
  Coins, Zap, Trees, ArrowRight, User, AlertCircle, X, Shield
} from 'lucide-react';
import { 
  SHUTTLE_SERVICES, WASTE_SCHEDULES, USED_GOODS_LISTINGS, 
  REWARDS_CATALOG, COMMUNITY_EVENTS, MOCK_LEADERBOARD 
} from '../../data/banguninData';

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

export default function LivingEcosystem() {
  const [activeTab, setActiveTab] = useState('shuttle'); // 'shuttle' | 'waste' | 'goods' | 'gamification' | 'events'
  
  // Shuttle Booking State
  const [selectedShuttle, setSelectedShuttle] = useState(null);
  const [shuttleBookingSuccess, setShuttleBookingSuccess] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [pickupTime, setPickupTime] = useState('06:30');

  // Waste Management State
  const [wasteWeight, setWasteWeight] = useState(3.5);
  const [selectedWasteType, setSelectedWasteType] = useState('Anorganik (Plastik/Kardus)');
  const [confirmedWasteLog, setConfirmedWasteLog] = useState([
    { date: '07 Okt 2026', type: 'Plastik & Botol', weight: '4.2 kg', points: '+210 Poin', bmc: '+0.084 BMC' },
    { date: '04 Okt 2026', type: 'Sisa Makanan Organik', weight: '5.0 kg', points: '+250 Poin', bmc: '+0.025 BMC' }
  ]);

  // Used Goods State
  const [goodsList, setGoodsList] = useState(USED_GOODS_LISTINGS);
  const [showAddGoodsModal, setShowAddGoodsModal] = useState(false);
  const [newGoodsTitle, setNewGoodsTitle] = useState('');
  const [newGoodsCategory, setNewGoodsCategory] = useState('Perabotan Rumah');
  const [newGoodsPrice, setNewGoodsPrice] = useState('');
  const [newGoodsType, setNewGoodsType] = useState('SELL'); // 'SELL' | 'DONATE' | 'EXCHANGE'

  // Gamification State
  const [userPoints, setUserPoints] = useState(2640);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  // Events Registration State
  const [registeredEvents, setRegisteredEvents] = useState(['ev-1']);

  const handleDailyCheckin = () => {
    if (hasCheckedInToday) return;
    setHasCheckedInToday(true);
    setUserPoints(prev => prev + 50);
    alert('🎉 Check-in Berhasil! Anda mendapatkan +50 Poin Komunitas & Menjaga Streak 16 Hari Berturut-turut!');
  };

  const handleConfirmWaste = (e) => {
    e.preventDefault();
    const pointsEarned = Math.round(wasteWeight * 50);
    const bmcEarned = Number((wasteWeight * 0.01).toFixed(3));
    
    setConfirmedWasteLog(prev => [
      { date: 'Hari Ini', type: selectedWasteType, weight: `${wasteWeight} kg`, points: `+${pointsEarned} Poin`, bmc: `+${bmcEarned} BMC` },
      ...prev
    ]);
    setUserPoints(prev => prev + pointsEarned);
    alert(`♻️ Setoran Sampah Terverifikasi! Poin Anda bertambah +${pointsEarned} Poin dan Saldo Web3 bertambah +${bmcEarned} BMC.`);
  };

  const handleRedeemReward = (reward) => {
    if (userPoints < reward.pointsCost) {
      alert('⚠️ Poin Anda belum mencukupi untuk menukar reward ini.');
      return;
    }
    setUserPoints(prev => prev - reward.pointsCost);
    alert(`🎁 Sukses! Voucher "${reward.title}" berhasil ditukarkan. Kode voucher telah dikirim ke notifikasi Anda.`);
  };

  const handleToggleEvent = (eventId) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(prev => prev.filter(id => id !== eventId));
      alert('Pendaftaran acara dibatalkan.');
    } else {
      setRegisteredEvents(prev => [...prev, eventId]);
      alert('🎉 Pendaftaran Berhasil! Tiket & QR Code Presensi Masuk telah diterbitkan.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      
      {/* Living Header & Points Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #2b8a3e, #005BAA)',
        padding: '24px 30px',
        borderRadius: '24px',
        color: '#fff',
        boxShadow: '0 12px 36px rgba(43,138,62,0.18)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', padding: '4px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>
            <HeartHandshake size={14} style={{ marginRight: '6px' }} /> Pilar 4: BangunIn Living Community
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '900', margin: '0 0 4px' }}>
            Layanan Komunitas Warga Perumahan MBR
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', margin: 0 }}>
            Fasilitas pasca-huni terpadu: Shuttle sekolah, Bank Sampah digital, bursa barang bekas, dan gamifikasi rukun warga.
          </p>
        </div>

        {/* User Points Badge & Checkin Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(0,0,0,0.25)', padding: '12px 20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.85 }}>Poin Komunitas Anda:</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ffec99' }}>{userPoints.toLocaleString('id-ID')} Pts</span>
          </div>

          <button
            onClick={handleDailyCheckin}
            disabled={hasCheckedInToday}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              background: hasCheckedInToday ? 'rgba(255,255,255,0.3)' : '#ffec99',
              color: hasCheckedInToday ? '#fff' : '#2b8a3e',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              cursor: hasCheckedInToday ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={16} /> {hasCheckedInToday ? 'Sudah Check-In ✅' : 'Check-In (+50 Pts)'}
          </button>
        </div>
      </div>

      {/* Sub-Tabs Nav */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '6px',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)'
      }}>
        {[
          { id: 'shuttle', label: '🚐 Shuttle Antar Jemput', icon: Bus },
          { id: 'waste', label: '♻️ Bank Sampah Digital', icon: Recycle },
          { id: 'goods', label: '📦 Barang Bekas & Donasi', icon: ShoppingBag },
          { id: 'gamification', label: '🏆 Poin & Leaderboard', icon: Award },
          { id: 'events', label: '📅 Event & Gotong Royong', icon: Calendar }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? '#005BAA' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. SHUTTLE */}
      {activeTab === 'shuttle' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {SHUTTLE_SERVICES.map(service => (
            <div 
              key={service.id}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 6px 20px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ background: '#e7f5ff', color: '#005BAA', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' }}>
                  {service.type}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 'bold', color: '#f59f00' }}>
                  <Star size={14} fill="#f59f00" /> {service.rating}
                </div>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 8px' }}>
                {service.name}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px', flex: 1 }}>
                <div>📍 <strong>Rute:</strong> {service.route}</div>
                <div>⏰ <strong>Jadwal:</strong> {service.schedule}</div>
                <div>🚐 <strong>Kendaraan:</strong> {service.vehicle} ({service.plateNumber})</div>
                <div>👤 <strong>Driver:</strong> {service.driverName} ({service.driverPhone})</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tarif Warga:</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#0ca678' }}>{service.fare}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedShuttle(service);
                    setShuttleBookingSuccess(false);
                  }}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#005BAA',
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Pesan Shuttle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: 2. BANK SAMPAH DIGITAL */}
      {activeTab === 'waste' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          
          {/* Waste Input & Schedules */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
                Jadwal & Kategori Penjemputan Sampah
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {WASTE_SCHEDULES.map(sc => (
                  <div key={sc.id} style={{ background: 'var(--bg-color)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>{sc.type}</span>
                      <span style={{ fontSize: '0.75rem', background: '#ebfbee', color: '#2b8a3e', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{sc.badge}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      🗓️ Hari: <strong>{sc.days}</strong> ({sc.time})
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginTop: '4px' }}>
                      🎁 Reward: +{sc.pointsPerKg} Poin & +{sc.bmcPerKg} BMC / kg
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Waste Calculator Form */}
            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '14px' }}>
                Input Timbangan Setor Sampah Warga
              </h3>

              <form onSubmit={handleConfirmWaste} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>Kategori Sampah:</label>
                  <select 
                    value={selectedWasteType} 
                    onChange={e => setSelectedWasteType(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                  >
                    <option value="Sampah Anorganik Daur Ulang (Plastik/Botol)">Plastik, Botol PET & Kardus (150 Pts/kg)</option>
                    <option value="Sampah Organik (Sisa Makanan)">Organik & Daun (50 Pts/kg)</option>
                    <option value="Limbah B3 & Elektronik">B3 & Baterai Bekas (300 Pts/kg)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>
                    Estimasi Berat: <strong>{wasteWeight} Kg</strong>
                  </label>
                  <input 
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={wasteWeight}
                    onChange={e => setWasteWeight(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#2b8a3e' }}
                  />
                </div>

                <div style={{ background: '#ebfbee', padding: '12px', borderRadius: '10px', color: '#2b8a3e', fontSize: '0.85rem' }}>
                  Estimasi Poin Diperoleh: <strong>+{Math.round(wasteWeight * 50)} Poin</strong> (+{Number((wasteWeight * 0.01).toFixed(3))} BMC Token)
                </div>

                <button
                  type="submit"
                  style={{ padding: '12px', borderRadius: '10px', border: 'none', background: '#2b8a3e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Konfirmasi Setoran Sampah
                </button>
              </form>
            </div>
          </div>

          {/* Waste Transaction Log */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
              Riwayat Setoran Sampah & Eco-Poin Anda
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {confirmedWasteLog.map((log, index) => (
                <div key={index} style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{log.type}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.date} • Berat: {log.weight}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#2b8a3e' }}>{log.points}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{log.bmc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: 3. USED GOODS */}
      {activeTab === 'goods' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px' }}>
                Bursa Barang Bekas & Donasi Warga MBR
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Jual murah, donasi gratis, atau tukar tambah barang layak pakai antar tetangga di perumahan.
              </p>
            </div>

            <button
              onClick={() => setShowAddGoodsModal(true)}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: 'none',
                background: '#005BAA',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} /> Pasang Iklan Barang
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {goodsList.map(item => (
              <div key={item.id} style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px', position: 'relative' }}>
                  <img src={item.photo} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: item.listingType === 'DONATE' ? '#2b8a3e' : item.listingType === 'EXCHANGE' ? '#f59f00' : '#005BAA',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '4px 10px',
                    borderRadius: '12px'
                  }}>
                    {item.listingType === 'DONATE' ? 'GRATIS / DONASI' : item.listingType === 'EXCHANGE' ? 'TUKAR TAMBAH' : 'DIJUAL'}
                  </span>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{item.category} • Kondisi: {item.condition}</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 6px', lineHeight: '1.3' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 12px', flex: 1 }}>{item.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Penjual: {item.sellerName}</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: '900', color: item.price === 0 ? '#2b8a3e' : '#005BAA' }}>
                        {item.price === 0 ? 'Rp 0 (Donasi)' : formatRupiah(item.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => alert(`📞 Menghubungi ${item.sellerName} via WhatsApp untuk barang "${item.title}"`)}
                      style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#25D366', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Hubungi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. GAMIFICATION & REWARDS */}
      {activeTab === 'gamification' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          
          {/* Rewards Catalog */}
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
              🎁 Katalog Penukaran Poin Warga
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {REWARDS_CATALOG.map(rw => (
                <div key={rw.id} style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>{rw.category}</span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '2px 0 4px' }}>{rw.title}</h4>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#005BAA' }}>Biaya: {rw.pointsCost} Poin</span>
                  </div>

                  <button
                    onClick={() => handleRedeemReward(rw)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      background: userPoints >= rw.pointsCost ? '#0ca678' : '#ccc',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      cursor: userPoints >= rw.pointsCost ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Tukar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Warga Teladan */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
              🏆 Papan Peringkat Warga Teladan Hijau
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {MOCK_LEADERBOARD.map(user => (
                <div key={user.rank} style={{ padding: '12px 16px', borderRadius: '12px', background: user.rank === 1 ? 'rgba(245,159,0,0.1)' : 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: user.rank === 1 ? '#f59f00' : '#888', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {user.rank}
                    </span>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{user.name} ({user.block})</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.level} • Streak: {user.streakDays} Hari</span>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#005BAA' }}>{user.points} Pts</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: 5. EVENTS */}
      {activeTab === 'events' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {COMMUNITY_EVENTS.map(ev => {
            const isRegistered = registeredEvents.includes(ev.id);
            return (
              <div key={ev.id} style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px' }}>
                  <img src={ev.bannerUrl} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>🗓️ {ev.date}</span>
                    <span style={{ color: '#2b8a3e', fontWeight: 'bold' }}>+{ev.pointsReward} Pts</span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 8px', lineHeight: '1.3' }}>{ev.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 16px', flex: 1 }}>{ev.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {ev.location}</span>

                    <button
                      onClick={() => handleToggleEvent(ev.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        border: 'none',
                        background: isRegistered ? '#ebfbee' : '#005BAA',
                        color: isRegistered ? '#2b8a3e' : '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {isRegistered ? 'Terdaftar ✅' : 'Daftar Ikut'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: SHUTTLE BOOKING */}
      {selectedShuttle && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 100020,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            width: '100%',
            maxWidth: '500px',
            padding: '26px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px' }}>
              Pesan {selectedShuttle.name}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 16px' }}>
              Driver: <strong>{selectedShuttle.driverName}</strong> ({selectedShuttle.plateNumber})
            </p>

            {shuttleBookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <CheckCircle2 size={48} color="#0ca678" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 6px' }}>Pemesanan Shuttle Berhasil!</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 20px' }}>
                  Driver telah dikonfirmasi dan akan menjemput di titik Cluster Anda pukul {pickupTime} WIB.
                </p>
                <button
                  onClick={() => setSelectedShuttle(null)}
                  style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#005BAA', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Tutup
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Jam Jemput:</label>
                  <input 
                    type="time" 
                    value={pickupTime} 
                    onChange={e => setPickupTime(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Jumlah Penumpang:</label>
                  <select 
                    value={passengerCount} 
                    onChange={e => setPassengerCount(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                  >
                    <option value={1}>1 Orang</option>
                    <option value={2}>2 Orang</option>
                    <option value={3}>3 Orang</option>
                    <option value={4}>4 Orang</option>
                  </select>
                </div>

                <div style={{ background: '#e7f5ff', padding: '12px', borderRadius: '10px', color: '#005BAA', fontSize: '0.85rem' }}>
                  Biaya: <strong>{selectedShuttle.fare}</strong>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    onClick={() => setSelectedShuttle(null)}
                    style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => setShuttleBookingSuccess(true)}
                    style={{ flex: 2, padding: '10px', borderRadius: '10px', border: 'none', background: '#005BAA', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Konfirmasi Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: POST USED GOODS */}
      {showAddGoodsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 100020,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            width: '100%',
            maxWidth: '520px',
            padding: '26px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px' }}>
              Pasang Iklan Barang Warga
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 16px' }}>
              Sistem akan memverifikasi taksiran harga wajar untuk kenyamanan warga klaster.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Nama / Judul Barang:</label>
                <input 
                  type="text" 
                  value={newGoodsTitle} 
                  onChange={e => setNewGoodsTitle(e.target.value)}
                  placeholder="Misal: Dispenser Galon Bawah Miyako..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Tipe Transaksi:</label>
                  <select 
                    value={newGoodsType} 
                    onChange={e => setNewGoodsType(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                  >
                    <option value="SELL">Dijual Murah</option>
                    <option value="DONATE">Gratis (Donasi)</option>
                    <option value="EXCHANGE">Tukar Tambah</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Harga (Rp):</label>
                  <input 
                    type="number" 
                    value={newGoodsPrice} 
                    onChange={e => setNewGoodsPrice(e.target.value)}
                    placeholder="0 jika donasi"
                    disabled={newGoodsType === 'DONATE'}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={() => setShowAddGoodsModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (!newGoodsTitle) return alert('Mohon isi judul barang.');
                    setGoodsList(prev => [
                      {
                        id: `ug-${Date.now()}`,
                        title: newGoodsTitle,
                        category: newGoodsCategory,
                        condition: 'Bekas Baik',
                        listingType: newGoodsType,
                        price: newGoodsType === 'DONATE' ? 0 : Number(newGoodsPrice) || 50000,
                        sellerName: 'Mukoddas Syuhada (Blok A-12)',
                        photo: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
                        description: 'Barang siap diambil di lokasi Cluster Griya Lestari Blok A-12.'
                      },
                      ...prev
                    ]);
                    setShowAddGoodsModal(false);
                    alert('✅ Iklan Barang Berhasil Ditayangkan!');
                  }}
                  style={{ flex: 2, padding: '10px', borderRadius: '10px', border: 'none', background: '#005BAA', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Tayangkan Iklan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
