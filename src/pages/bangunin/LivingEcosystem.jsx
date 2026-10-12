import React, { useState } from 'react';
import { 
  HeartHandshake, Bus, Recycle, ShoppingBag, Award, Calendar, 
  MapPin, Clock, Star, Phone, CheckCircle2, Plus, Sparkles, 
  Coins, Zap, Trees, ArrowRight, User, AlertCircle, X, Shield,
  CreditCard, Sprout, Activity, Truck, HeartPulse, Send
} from 'lucide-react';
import { 
  SHUTTLE_SERVICES, WASTE_SCHEDULES, USED_GOODS_LISTINGS, 
  REWARDS_CATALOG, COMMUNITY_EVENTS, MOCK_LEADERBOARD,
  KOPDES_PRODUCTS, KOPDES_PARTNERS, MOCK_ETOLL_CARD, MOCK_ETOLL_TRANSACTIONS,
  URBAN_FARMING_PLOTS, POSYANDU_SCHEDULES, TOKEN_SUBSIDIES
} from '../../data/banguninData';

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

export default function LivingEcosystem() {
  const [activeTab, setActiveTab] = useState('shuttle'); // 'shuttle' | 'kopdes' | 'waste' | 'farming' | 'posyandu' | 'goods' | 'gamification' | 'events'
  
  // E-Toll BTN State (v2.0)
  const [etollCard, setEtollCard] = useState(MOCK_ETOLL_CARD);
  const [etollTransactions, setEtollTransactions] = useState(MOCK_ETOLL_TRANSACTIONS);
  const [showEtollHistory, setShowEtollHistory] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(50000);

  // Kopdes Merah Putih State (v2.0)
  const [kopdesCart, setKopdesCart] = useState({});
  const [kopdesDeliveryType, setKopdesDeliveryType] = useState('SHUTTLE'); // 'SHUTTLE' | 'PICKUP'
  const [showKopdesCheckoutModal, setShowKopdesCheckoutModal] = useState(false);

  // Urban Farming State (v2.0)
  const [farmingPlots, setFarmingPlots] = useState(URBAN_FARMING_PLOTS);

  // Posyandu State (v2.0)
  const [posyanduList, setPosyanduList] = useState(POSYANDU_SCHEDULES);
  const [showPosyanduRegisterModal, setShowPosyanduRegisterModal] = useState(false);
  const [selectedPosyandu, setSelectedPosyandu] = useState(null);
  const [regFamilyMember, setRegFamilyMember] = useState('');

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
          { id: 'shuttle', label: '🚐 Shuttle & E-Toll BTN', icon: Bus },
          { id: 'kopdes', label: '🛒 Kopdes Merah Putih', icon: ShoppingBag },
          { id: 'waste', label: '♻️ Bank Sampah Digital', icon: Recycle },
          { id: 'farming', label: '🌱 Urban Farming', icon: Sprout },
          { id: 'posyandu', label: '🩺 Posyandu MBR', icon: HeartPulse },
          { id: 'goods', label: '📦 Barang Bekas', icon: ShoppingBag },
          { id: 'gamification', label: '🏆 Poin & Token Subsidi', icon: Award },
          { id: 'events', label: '📅 Event Komunitas', icon: Calendar }
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

      {/* TAB CONTENT: 1. SHUTTLE & E-TOLL BTN */}
      {activeTab === 'shuttle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* E-TOLL BTN CARD & SIMBIOSIS MUTUALISME WIDGET */}
          <div style={{
            background: 'linear-gradient(135deg, #005BAA, #003366)',
            padding: '24px',
            borderRadius: '22px',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 10px 30px rgba(0,91,170,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <CreditCard size={20} color="#ffec99" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ffec99', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {etollCard.cardType}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', margin: '0 0 2px' }}>
                  Bank BTN E-Toll Card Warga
                </h3>
                <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', opacity: 0.9 }}>
                  No: {etollCard.cardNumber} • {etollCard.cardHolder}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.85 }}>Saldo E-Toll Aktif</span>
                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#ffec99' }}>
                  {formatRupiah(etollCard.balance)}
                </span>
              </div>
            </div>

            {/* Simbiosis Mutualisme Banner */}
            <div style={{
              background: 'rgba(255,255,255,0.12)',
              padding: '12px 16px',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.8rem'
            }}>
              <div style={{ maxWidth: '650px', lineHeight: '1.4' }}>
                <strong>⚡ Simbiosis Mutualisme BTN ↔ Warga:</strong> Setiap tap pembayaran shuttle/logistik menghasilkan komisi Rp {etollCard.btnCommissionRate}/transaksi sebagai <em>income harian Bank BTN</em>, sementara warga menikmati tarif terjangkau & transportasi aman terintegrasi.
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowTopUpModal(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#ffec99',
                    color: '#005BAA',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  + Top Up Saldo
                </button>
                <button
                  onClick={() => setShowEtollHistory(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    background: 'transparent',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Riwayat Tap ({etollTransactions.length})
                </button>
              </div>
            </div>
          </div>

          {/* Shuttle Services Grid */}
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
      </div>
      )}

      {/* TAB CONTENT: 2. KOPDES MERAH PUTIH (SEMBAKO & LOGISTIK) */}
      {activeTab === 'kopdes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Kopdes Partnership Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #c92a2a, #e03131)',
            padding: '24px',
            borderRadius: '20px',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 8px 30px rgba(201,42,42,0.2)'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                🇮🇩 Program Kemitraan Pemerintah & Koperasi Desa
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', margin: '8px 0 4px' }}>
                {KOPDES_PARTNERS[0].name}
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>
                Penyediaan sembako murah bersubsidi HET resmi (Beras SPHP Bulog, Minyakita) dengan fasilitas pengantaran armada shuttle logistik MBR.
              </p>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.85 }}>Keranjang Belanja:</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '900' }}>
                {Object.values(kopdesCart).reduce((a, b) => a + b, 0)} Item
              </span>
              {Object.keys(kopdesCart).length > 0 && (
                <button
                  onClick={() => setShowKopdesCheckoutModal(true)}
                  style={{
                    display: 'block',
                    marginTop: '8px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#fff',
                    color: '#c92a2a',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Checkout Pesanan →
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {KOPDES_PRODUCTS.map(product => {
              const qty = kopdesCart[product.id] || 0;
              return (
                <div
                  key={product.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '18px',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ height: '160px', overflow: 'hidden' }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', color: '#c92a2a', fontWeight: 'bold' }}>{product.category} • {product.unit}</span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '4px 0 6px' }}>{product.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 12px', flex: 1 }}>{product.subsidyNote}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#005BAA' }}>{formatRupiah(product.price)}</span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {qty > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-color)', padding: '4px 8px', borderRadius: '8px' }}>
                            <button
                              onClick={() => setKopdesCart(prev => ({ ...prev, [product.id]: Math.max(0, qty - 1) }))}
                              style={{ width: '24px', height: '24px', borderRadius: '4px', border: 'none', background: '#ccc', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              -
                            </button>
                            <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{qty}</span>
                            <button
                              onClick={() => setKopdesCart(prev => ({ ...prev, [product.id]: qty + 1 }))}
                              style={{ width: '24px', height: '24px', borderRadius: '4px', border: 'none', background: '#c92a2a', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setKopdesCart(prev => ({ ...prev, [product.id]: 1 }))}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              border: 'none',
                              background: '#c92a2a',
                              color: '#fff',
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                          >
                            + Keranjang
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. URBAN FARMING (KOMPOS, MAGGOT, POLYBAG) */}
      {activeTab === 'farming' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2b8a3e, #0ca678)',
            padding: '24px',
            borderRadius: '20px',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                🌱 Sirkular Ekonomi Hijau Warga MBR
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', margin: '8px 0 4px' }}>
                Sentra Urban Farming Komunitas Hijau
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>
                Pengolahan sisa sampah dapur menjadi pakan larva Maggot BSF, kompos bambu kascing, dan sayuran segar polybag.
              </p>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 18px', borderRadius: '14px', fontSize: '0.85rem' }}>
              <div>Total Poin Berkebun Anda: <strong style={{ color: '#ffec99' }}>+480 Pts</strong></div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Hasil Panen Disalurkan ke Pasar Kopdes Merah Putih</div>
            </div>
          </div>

          {/* Plots Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {farmingPlots.map(plot => (
              <div
                key={plot.id}
                style={{
                  background: 'var(--bg-card)',
                  padding: '22px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2b8a3e' }}>{plot.plotNumber}</span>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(43,138,62,0.1)', color: '#2b8a3e', padding: '3px 8px', borderRadius: '8px', fontWeight: 'bold' }}>
                    {plot.sizeSqm} m²
                  </span>
                </div>

                <h4 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 6px' }}>{plot.cropType}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>🌾 <strong>Pengelola:</strong> {plot.farmerFamily}</div>
                  <div>🧪 <strong>Nutrisi:</strong> {plot.fertilizerType}</div>
                  <div>⏳ <strong>Estimasi Panen:</strong> {plot.estimatedHarvestDate}</div>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Status Tumbuh:</span>
                    <strong style={{ color: '#2b8a3e' }}>{plot.status}</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${plot.progress}%`, height: '100%', background: '#2b8a3e', borderRadius: '4px' }} />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setUserPoints(p => p + plot.pointsReward);
                    alert(`🌿 Aktivitas Kebun "${plot.cropType}" berhasil dicatat! Anda mendapatkan +${plot.pointsReward} Poin Komunitas.`);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#2b8a3e',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Sprout size={16} /> Rawat Plot (+{plot.pointsReward} Poin)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. POSYANDU KOMUNITAS MBR */}
      {activeTab === 'posyandu' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1098ad, #0c8599)',
            padding: '24px',
            borderRadius: '20px',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                🩺 Layanan Kesehatan Terpadu Warga MBR
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', margin: '8px 0 4px' }}>
                Posyandu Balita & Posyandu Lansia
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>
                Pencegahan stunting balita, imunisasi dasar lengkap, serta pemantauan tensi & gula darah lansia rutin bulanan.
              </p>
            </div>
          </div>

          {/* Posyandu Schedules List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {posyanduList.map(pos => (
              <div
                key={pos.id}
                style={{
                  background: 'var(--bg-card)',
                  padding: '24px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#1098ad', fontWeight: 'bold' }}>{pos.date}</span>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(16,152,173,0.1)', color: '#1098ad', padding: '3px 8px', borderRadius: '8px', fontWeight: 'bold' }}>
                    {pos.time}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 6px' }}>{pos.title}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  📍 Lokasi: <strong>{pos.location}</strong> | Sasaran: {pos.targetParticipants}
                </div>

                <div style={{ background: 'var(--bg-color)', padding: '12px', borderRadius: '12px', fontSize: '0.75rem', marginBottom: '16px', flex: 1 }}>
                  <strong>Layanan Medis:</strong>
                  <ul style={{ margin: '4px 0 0', paddingLeft: '18px' }}>
                    {pos.services.map((srv, idx) => (
                      <li key={idx} style={{ marginBottom: '2px' }}>{srv}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Terdaftar: <strong>{pos.registeredCount}/{pos.maxSlots}</strong>
                  </span>

                  <button
                    onClick={() => {
                      setSelectedPosyandu(pos);
                      setShowPosyanduRegisterModal(true);
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: pos.isRegisteredMine ? '#0ca678' : '#1098ad',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {pos.isRegisteredMine ? 'Sudah Terdaftar ✅' : 'Daftar Hadir'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. BANK SAMPAH DIGITAL */}
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
          
          {/* Rewards & Token Subsidies Catalog */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Token Subsidi Khusus MBR (Pangan, Transport, Utilitas) */}
            <div style={{ background: 'linear-gradient(135deg, rgba(0,91,170,0.08), rgba(12,166,120,0.08))', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Coins size={20} color="#005BAA" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
                  🎟️ Token Subsidi Khusus Warga MBR (v2.0)
                </h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 14px' }}>
                Tukarkan poin komunitas Anda menjadi voucher token subsidi nyata untuk kebutuhan pokok keluarga:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {TOKEN_SUBSIDIES.map(sub => (
                  <div key={sub.id} style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', background: '#e7f5ff', color: '#005BAA', padding: '2px 8px', borderRadius: '8px', fontWeight: 'bold' }}>
                        Mitra: {sub.partner}
                      </span>
                      <h5 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '4px 0 2px' }}>{sub.name}</h5>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub.benefit}</span>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#005BAA', marginBottom: '4px' }}>{sub.pointsCost} Pts</span>
                      <button
                        onClick={() => {
                          if (userPoints < sub.pointsCost) return alert('⚠️ Poin tidak mencukupi.');
                          setUserPoints(p => p - sub.pointsCost);
                          if (sub.type === 'TRANSPORT') {
                            setEtollCard(prev => ({ ...prev, balance: prev.balance + 30000 }));
                            alert(`🎉 Sukses! ${sub.name} berhasil ditukarkan. Saldo E-Toll BTN Anda otomatis bertambah +Rp 30.000!`);
                          } else {
                            alert(`🎉 Sukses! ${sub.name} berhasil diterbitkan. Voucher dapat digunakan langsung saat checkout di Kopdes Merah Putih.`);
                          }
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          background: userPoints >= sub.pointsCost ? '#005BAA' : '#ccc',
                          color: '#fff',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          cursor: userPoints >= sub.pointsCost ? 'pointer' : 'not-allowed'
                        }}
                      >
                        Klaim Token
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Standard Rewards Catalog */}
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
                🎁 Hadiah & Merchandise Lainnya
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

      {/* MODAL: RIWAYAT TAP E-TOLL BTN (SIMBIOSIS BTN-WARGA) */}
      {showEtollHistory && (
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
            maxWidth: '560px',
            padding: '28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 2px' }}>
                  Riwayat Transaksi E-Toll BTN Warga
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Simbiosis Mutualisme: Komisi Rp 150/tap otomatis masuk ke pendapatan harian BTN
                </span>
              </div>
              <button onClick={() => setShowEtollHistory(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto', marginBottom: '18px' }}>
              {etollTransactions.map(tx => (
                <div key={tx.id} style={{ background: 'var(--bg-color)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-main)' }}>{tx.service}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.date} • Armada: {tx.vehiclePlate}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#c92a2a' }}>-{formatRupiah(tx.amount)}</span>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#0ca678' }}>Komisi BTN: +Rp {tx.btnFee}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowEtollHistory(false)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#005BAA', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* MODAL: TOP UP SALDO E-TOLL BTN */}
      {showTopUpModal && (
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
            maxWidth: '460px',
            padding: '26px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 4px' }}>
              Top Up Saldo E-Toll BTN Tap-Smart
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
              Pilih nominal top up via Bank BTN Virtual Account:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
              {[20000, 50000, 100000, 200000].map(amt => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: topUpAmount === amt ? '2px solid #005BAA' : '1px solid var(--border-color)',
                    background: topUpAmount === amt ? 'rgba(0,91,170,0.1)' : 'var(--bg-color)',
                    color: topUpAmount === amt ? '#005BAA' : 'var(--text-main)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  {formatRupiah(amt)}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowTopUpModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setEtollCard(prev => ({ ...prev, balance: prev.balance + topUpAmount }));
                  setShowTopUpModal(false);
                  alert(`✅ Top Up Berhasil! Saldo E-Toll BTN bertambah ${formatRupiah(topUpAmount)}.`);
                }}
                style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: '#005BAA', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Konfirmasi Top Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHECKOUT KOPDES MERAH PUTIH */}
      {showKopdesCheckoutModal && (
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
            padding: '28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px' }}>
              Konfirmasi Pesanan Sembako Kopdes
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
              Kemitraan resmi Koperasi Desa Merah Putih Taktakan & BangunIn MBR
            </p>

            {/* Delivery Option */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>Metode Pengantaran:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={() => setKopdesDeliveryType('SHUTTLE')}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: kopdesDeliveryType === 'SHUTTLE' ? '2px solid #c92a2a' : '1px solid var(--border-color)',
                    background: kopdesDeliveryType === 'SHUTTLE' ? 'rgba(201,42,42,0.1)' : 'var(--bg-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🚐 Diantar Shuttle MBR (+Rp 5.000 E-Toll)
                </button>
                <button
                  onClick={() => setKopdesDeliveryType('PICKUP')}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: kopdesDeliveryType === 'PICKUP' ? '2px solid #c92a2a' : '1px solid var(--border-color)',
                    background: kopdesDeliveryType === 'PICKUP' ? 'rgba(201,42,42,0.1)' : 'var(--bg-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🏪 Ambil di Gerai Koperasi
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowKopdesCheckoutModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowKopdesCheckoutModal(false);
                  setKopdesCart({});
                  alert(`✅ Pesanan Sembako Berhasil Diproses! ${kopdesDeliveryType === 'SHUTTLE' ? 'Armada Mobil Box Logistik Warga (A 9988 KD) akan mengantar ke alamat blok rumah Anda.' : 'Silakan ambil di gerai Koperasi Desa Taktakan.'}`);
                }}
                style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: '#c92a2a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Bayar & Pesan Sembako
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DAFTAR POSYANDU */}
      {showPosyanduRegisterModal && selectedPosyandu && (
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
            maxWidth: '480px',
            padding: '26px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px' }}>
              Pendaftaran {selectedPosyandu.title}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
              🗓️ {selectedPosyandu.date} ({selectedPosyandu.time}) di {selectedPosyandu.location}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Nama Peserta (Balita / Lansia):</label>
                <input
                  type="text"
                  value={regFamilyMember}
                  onChange={e => setRegFamilyMember(e.target.value)}
                  placeholder="Nama anggota keluarga..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ background: 'var(--bg-color)', padding: '12px', borderRadius: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                📲 Notifikasi pengingat H-1 akan dikirimkan otomatis via WhatsApp ke nomor kepala keluarga terdaftar.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowPosyanduRegisterModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setPosyanduList(prev => prev.map(p => p.id === selectedPosyandu.id ? { ...p, isRegisteredMine: true, registeredCount: p.registeredCount + 1 } : p));
                  setShowPosyanduRegisterModal(false);
                  setRegFamilyMember('');
                  alert(`✅ Pendaftaran Berhasil! Kehadiran di ${selectedPosyandu.title} telah dicatat.`);
                }}
                style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: '#1098ad', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Daftarkan Hadir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
