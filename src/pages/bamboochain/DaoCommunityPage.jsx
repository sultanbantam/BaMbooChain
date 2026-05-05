import React, { useState } from 'react';
import { Users, Vote, HeartHandshake, MessageSquare, ThumbsUp, ThumbsDown, User, Heart, CalendarCheck, Gamepad2, Gift, Trophy, Star, Target, MapPin, Compass } from 'lucide-react';
import { getAssetUrl } from '../../utils/assets';

const bambooCharacters = Array.from({ length: 36 }, (_, i) => {
  const idStr = String(i + 1).padStart(2, '0');
  const rarities = ["Common", "Rare", "Epic", "Legendary"];
  // Mock rarity logic for visual flair
  let rarity = "Common";
  if ((i + 1) % 10 === 0) rarity = "Legendary";
  else if ((i + 1) % 5 === 0) rarity = "Epic";
  else if ((i + 1) % 3 === 0) rarity = "Rare";

  return {
    id: i + 1,
    name: `Guardian #${idStr}`,
    img: getAssetUrl(`gambar/kbambu/${idStr}.jpg`),
    rarity: rarity
  };
});

const DaoCommunityPage = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Mock Data untuk Proposals
  const proposals = [
    { id: "BIP-42", title: "Ekspansi Pembibitan Ke Area Cikadut (50 Ha)", author: "Yayasan Core", status: "Active", endTime: "2 Hari lagi", yes: 75, no: 25 },
    { id: "BIP-41", title: "Alokasi 5% Profit Untuk Beasiswa Tani", author: "0x4a...93b", status: "Active", endTime: "5 Jam lagi", yes: 92, no: 8 },
  ];

  const discussions = [
    { id: 1, user: "NusantaraGreen", topic: "Berapa lama tunas bambu betung biasanya masuk panen pertama?", replies: 12, likes: 34, time: "2 jam yang lalu" },
    { id: 2, user: "InvestBud", topic: "Saran: Tambahkan fitur Live Streaming Drone di Dashboard!", replies: 45, likes: 129, time: "5 jam yang lalu" },
  ];

  const leaderboard = [
    { rank: 1, user: "0x8fa...41C", points: "15,400 XP", tier: "Bamboo Master" },
    { rank: 2, user: "EcoWarrior99", points: "12,250 XP", tier: "Green Ranger" },
    { rank: 3, user: "BudiTani", points: "10,100 XP", tier: "Green Ranger" },
    { rank: 4, user: "CibaraniFarm", points: "9,800 XP", tier: "Sprout" },
    { rank: 5, user: "0x12b...89A", points: "8,450 XP", tier: "Sprout" }
  ];

  const missions = [
    { id: 1, title: "Vote di 1 Proposal Aktif", reward: "50 BMC", done: false },
    { id: 2, title: "Balas Diskusi di Forum", reward: "25 BMC", done: true },
    { id: 3, title: "Main Semai Bibit (Mini-Game)", reward: "100 BMC", done: false },
  ];

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
      
      {/* HEADER SECTION */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(132, 94, 247, 0.1)', padding: '16px', borderRadius: '50%', color: '#845ef7' }}>
            <Users size={40} />
          </div>
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-0.5px' }}>
          DAO & Community
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
          Kolaborasi tanpa batas. Menentukan arah ekosistem, ikuti keseruan *Gamification*, selesaikan misi hijau Anda, dan raih kompensasi BMC setiap harinya!
        </p>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* NEW ENHANCEMENT: GAMIFICATION HUB (Play & Earn) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          {/* Kolom 1: Daily Check-in & Rewards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Daily Check-in */}
            <div style={{ background: 'linear-gradient(135deg, var(--primary), #1b5e20)', borderRadius: '20px', padding: '24px', color: 'white', textAlign: 'center', boxShadow: '0 8px 30px rgba(12,166,120,0.3)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><CalendarCheck size={100} /></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px 0', color: 'rgba(255,255,255,0.9)' }}>Daily Check-In</h3>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>Masuk rutin, kalikan hadiahnya!</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                  {[1,2,3,4,5,6,7].map(day => (
                    <div key={day} style={{ width: '28px', height: '28px', borderRadius: '50%', background: (isCheckedIn && day === 3) || day < 3 ? '#fcc419' : 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', color: day <= 3 ? '#1b5e20' : 'white', boxShadow: day === 3 && isCheckedIn ? '0 0 10px #fcc419' : 'none' }}>
                      {day}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setIsCheckedIn(true)}
                  disabled={isCheckedIn}
                  style={{ background: isCheckedIn ? 'rgba(255,255,255,0.2)' : 'white', color: isCheckedIn ? 'white' : 'var(--primary)', padding: '12px 24px', borderRadius: '20px', border: 'none', fontWeight: 'bold', width: '100%', cursor: isCheckedIn ? 'default' : 'pointer' }}>
                  {isCheckedIn ? 'Checked-In Day 3 ✅' : 'Check-In Sekarang (+10 BMC)'}
                </button>
              </div>
            </div>

            {/* My Rewards */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f3f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '4px' }}>
                  <Gift size={16} color="#f59f00" /> Total Reward Saya
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)' }}>4,250 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>BMC</span></div>
              </div>
              <button style={{ background: '#fff9db', color: '#f59f00', border: '1px solid #fcc419', padding: '10px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Klaim</button>
            </div>
          </div>

          {/* Kolom 2: Game & Missions */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f3f5', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={20} color="#e03131" /> Misi & Tantangan Harian
              </h3>
              <span style={{ fontSize: '0.8rem', background: '#ffe3e3', color: '#e03131', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Reset: 14 Jam</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {missions.map(mission => (
                <div key={mission.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: mission.done ? '#f8f9fa' : 'white', border: '1px solid #dee2e6', borderRadius: '12px', opacity: mission.done ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: mission.done ? 'none' : '2px solid #ced4da', background: mission.done ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      {mission.done && '✓'}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: mission.done ? 'normal' : '500', textDecoration: mission.done ? 'line-through' : 'none' }}>{mission.title}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#f59f00' }}>+{mission.reward}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', background: 'linear-gradient(135deg, #1864ab, #339af0)', borderRadius: '16px', padding: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Gamepad2 size={18} /> Mini-Game: Bamboo Tycoon</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>Simulasi semai bibit untuk *farming* hadiah NFT langka!</p>
              </div>
              <button style={{ background: 'white', color: '#1864ab', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>Mainkan</button>
            </div>
          </div>

          {/* Kolom 3: Leaderboard */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f3f5' }}>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 20px 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={20} color="#f59f00" /> Papan Peringkat Global
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {leaderboard.map((user, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: idx === leaderboard.length - 1 ? 'none' : '1px solid #f1f3f5' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: user.rank === 1 ? '#fcc419' : user.rank === 2 ? '#ced4da' : user.rank === 3 ? '#e8a317' : '#f8f9fa', color: user.rank <= 3 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    {user.rank}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{user.user}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={10} color="#f59f00" /> {user.tier}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)' }}>{user.points}</div>
                </div>
              ))}
            </div>
            
            <button style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px dashed #ced4da', padding: '8px', width: '100%', borderRadius: '12px', marginTop: '16px', fontSize: '0.8rem', cursor: 'pointer' }}>Lihat Peringkat Saya</button>
          </div>
        </div>

        {/* ROW 2: VOTING & FUNDING (Orisinal DAO) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* VOTING (PROPOSALS) */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                <Vote size={24} color="#845ef7" /> Voting Project (Governance)
              </h3>
              <button style={{ background: '#845ef7', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>Buat Proposal Baru</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {proposals.map((prop, idx) => (
                <div key={idx} style={{ padding: '20px', border: '1px solid #f1f3f5', borderRadius: '16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#adb5bd' }}>{prop.id}</span>
                        <span style={{ fontSize: '0.75rem', background: '#eebefa', color: '#845ef7', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>{prop.status}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🕒 {prop.endTime}</span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: '0 0 4px 0' }}>{prop.title}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Oleh: {prop.author}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      <span style={{ color: 'var(--primary)' }}><ThumbsUp size={14}/> {prop.yes}%</span>
                      <span style={{ color: '#e03131' }}>{prop.no}% <ThumbsDown size={14}/></span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e03131', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${prop.yes}%`, height: '100%', background: 'var(--primary)' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMMUNITY FUNDING */}
          <div style={{ background: 'linear-gradient(135deg, rgba(245,159,0,0.05), rgba(201,42,42,0.05))', borderRadius: '24px', padding: '32px', border: '1px solid rgba(245,159,0,0.2)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', margin: 0 }}>
              <HeartHandshake size={24} color="#f59f00" /> Community Funding
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>Dana hibah kerumunan (crowdfunding) untuk inisiatif akar rumput.</p>
            
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Total Pundi Amal Terkumpul</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#f59f00' }}>$24,500 <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>USDT</span></div>
            </div>

            <button style={{ marginTop: 'auto', background: '#f59f00', color: 'white', padding: '16px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.05rem', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Heart size={20} /> Dukung Proyek Akar Rumput
            </button>
          </div>

        </div>

        {/* ROW 3: webNUSA (WISATA EDUKASI & PELATIHAN) */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                <Compass size={32} color="var(--primary)" /> webNUSA (Wisata Edukasi)
              </h3>
              <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Kunjungi pusat konservasi dan laboratorium bambu hidup terbesar di Nusantara.</p>
            </div>
            <button style={{ background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold' }}>Jelajahi Peta Wisata</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
             {[
               { title: "Hutan Bambu Cibarani", loc: "Siliwangi, Bandung", desc: "Laboratorium bambu hidup dengan 15+ spesies langka.", img: "https://images.unsplash.com/photo-1542450530-5bfa5dfef006?ixlib=rb-4.0.3" },
               { title: "Workshop Bambu Jabar", loc: "Sukabumi, Jabar", desc: "Pelatihan teknik konstruksi bambu modern & pengawetan.", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3" },
               { title: "Eco-Village Banten", loc: "Lebak, Banten", desc: "Kawasan hunian bambu berkelanjutan & kebun bibit.", img: "https://images.unsplash.com/photo-1587825027984-c4476461c8f9?ixlib=rb-4.0.3" }
             ].map((site, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', border: '1px solid #f1f3f5' }}>
                   <div style={{ height: '160px', position: 'relative' }}>
                      <img src={site.img} alt={site.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {site.loc}
                      </div>
                   </div>
                   <div style={{ padding: '24px' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>{site.title}</h4>
                      <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{site.desc}</p>
                      <button style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                         Booking Kunjungan <Star size={14} />
                      </button>
                   </div>
                </div>
             ))}
          </div>
        </div>


        {/* ROW 4: NUSANTARA BAMBOO GUARDIANS (CHARACTER GALLERY) */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                <Users size={32} color="#f59f00" /> Bamboo Guardians Gallery
              </h3>
              <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Koleksi 36 karakter unik pelindung rumpun bambu Nusantara.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
               <div style={{ background: 'white', padding: '8px 16px', borderRadius: '12px', border: '1px solid #dee2e6', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                 Unlocked: <span style={{ color: 'var(--primary)' }}>12/36</span>
               </div>
               <button style={{ background: 'var(--text-main)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Buka Pack Baru</button>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', 
            gap: '12px',
            background: 'rgba(255,255,255,0.5)',
            padding: '20px',
            borderRadius: '32px',
            border: '2px dashed #dee2e6'
          }}>
            {bambooCharacters.map((char) => (
              <div 
                key={char.id} 
                style={{ 
                  background: 'white', 
                  borderRadius: '20px', 
                  padding: '12px', 
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
                  border: '1px solid #f1f3f5',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  cursor: 'pointer',
                  position: 'relative',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = '#f1f3f5';
                }}
              >
                {/* Rarity Badge */}
                <div style={{ 
                  position: 'absolute', 
                  top: '8px', 
                  right: '8px', 
                  fontSize: '0.6rem', 
                  fontWeight: '900', 
                  padding: '2px 6px', 
                  borderRadius: '8px',
                  zIndex: 2,
                  background: char.rarity === 'Legendary' ? '#fcc419' : char.rarity === 'Epic' ? '#e599f7' : char.rarity === 'Rare' ? '#74c0fc' : '#ced4da',
                  color: char.rarity === 'Legendary' ? '#1b5e20' : 'white',
                  textTransform: 'uppercase'
                }}>
                  {char.rarity}
                </div>

                <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '14px', overflow: 'hidden', marginBottom: '10px', background: '#f8f9fa' }}>
                  <img 
                    src={char.img} 
                    alt={char.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Bamboo"; }}
                  />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{char.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: #{String(char.id).padStart(3, '0')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 5: FORUM */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <MessageSquare size={24} color="#339af0" /> Diskusi Komunitas (Forum)
            </h3>
            <button style={{ background: 'transparent', color: '#339af0', border: '1px solid #339af0', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>Lihat Semua Topik</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {discussions.map((chat) => (
              <div key={chat.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', border: '1px solid #f1f3f5', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(51,154,240,0.1)', color: '#339af0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0' }}>{chat.topic}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{chat.user} • {chat.time}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}><MessageSquare size={16} /> {chat.replies}</span>
                  <span style={{ color: '#f59f00', fontSize: '0.85rem' }}><ThumbsUp size={16} /> {chat.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DaoCommunityPage;
