import React, { useState } from 'react';
import { Users, Vote, HeartHandshake, MessageSquare, ThumbsUp, ThumbsDown, User, Heart, CalendarCheck, Gamepad2, Gift, Trophy, Star, Target, MapPin, Compass, Plus, X, Send, Loader } from 'lucide-react';
import { getAssetUrl } from '../../utils/assets';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  useDaoProposals,
  useDaoForum,
  useDaoCommunityFunding,
  useLeaderboard,
  useUserGuardians,
  useDailyMissions,
  seedDaoInitialData
} from '../../hooks/useDaoData';

// Seed initial data on first load
seedDaoInitialData().catch(() => {});

const bambooCharacters = Array.from({ length: 36 }, (_, i) => {
  const idStr = String(i + 1).padStart(2, '0');
  let rarity = 'Common';
  if ((i + 1) % 10 === 0) rarity = 'Legendary';
  else if ((i + 1) % 5 === 0) rarity = 'Epic';
  else if ((i + 1) % 3 === 0) rarity = 'Rare';
  return { id: i + 1, idStr, name: `Guardian #${idStr}`, img: getAssetUrl(`gambar/kbambu/${idStr}.jpg`), rarity };
});

const formatBalance = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

// ─── Modal: Create Proposal ────────────────────────────────────────────
function CreateProposalModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(7);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    const result = await onCreate({ title, description, durationDays: duration });
    setLoading(false);
    if (result) onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '32px', maxWidth: '560px', width: '100%', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>🗳️ Buat Proposal Baru</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Judul Proposal *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Contoh: Ekspansi Pembibitan Area X..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.95rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Deskripsi *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} placeholder="Jelaskan tujuan dan manfaat proposal ini..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Durasi Voting</label>
            <select value={duration} onChange={e => setDuration(Number(e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}>
              <option value={3}>3 Hari</option>
              <option value={7}>7 Hari</option>
              <option value={14}>14 Hari</option>
            </select>
          </div>
          <div style={{ background: 'rgba(245,159,0,0.1)', borderRadius: '12px', padding: '12px', marginBottom: '20px', fontSize: '0.85rem', color: '#f59f00' }}>
            ⚠️ Syarat: Min. 100 BMC di-stake. Proposal Anda akan langsung aktif dan bisa divote komunitas.
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#845ef7', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 'bold', fontSize: '1rem', cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? '⏳ Memproses...' : '✅ Kirim Proposal'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Modal: Forum Post ──────────────────────────────────────────────────
function ForumPostModal({ onClose, onPost }) {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean);
    const result = await onPost(topic, content, tagArr);
    setLoading(false);
    if (result) onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '32px', maxWidth: '560px', width: '100%', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>💬 Buat Topik Diskusi</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Judul Topik *</label>
            <input value={topic} onChange={e => setTopic(e.target.value)} required placeholder="Pertanyaan atau topik yang ingin didiskusikan..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.95rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Isi Diskusi</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} placeholder="Jelaskan lebih detail..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Tags (pisahkan dengan koma)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="bambu, budidaya, panen..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.95rem', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#339af0', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 'bold', fontSize: '1rem', cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? '⏳ Memposting...' : '✅ Posting Topik'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Modal: Book Visit ─────────────────────────────────────────────────
function BookVisitModal({ siteName, onClose, onBook }) {
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const minDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return;
    setLoading(true);
    const result = await onBook(siteName, date, notes);
    setLoading(false);
    if (result) onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '32px', maxWidth: '480px', width: '100%', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-main)' }}>📅 Booking Kunjungan</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>📍 <strong>{siteName}</strong></p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Tanggal Kunjungan *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} min={minDate} required style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Catatan (opsional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Jumlah peserta, keperluan khusus..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? '⏳ Memproses...' : '✅ Konfirmasi Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Modal: Support Funding ─────────────────────────────────────────────
function SupportFundingModal({ campaign, onClose, onSupport, userBmc }) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BMC');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    setLoading(true);
    const result = await onSupport(campaign.id, amt, currency);
    setLoading(false);
    if (result) onClose();
  };

  const progress = campaign ? Math.min(100, (campaign.raisedAmount / campaign.targetAmount) * 100) : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '32px', maxWidth: '480px', width: '100%', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-main)' }}>🌿 Dukung Crowdfunding</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
        </div>
        {campaign && (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>{campaign.title}</p>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Terkumpul</span>
                <span style={{ fontWeight: 'bold', color: '#f59f00' }}>{(campaign.raisedAmount || 0).toLocaleString()} / {(campaign.targetAmount || 0).toLocaleString()} USDT</span>
              </div>
              <div style={{ height: '8px', background: '#f1f3f5', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#f59f00', transition: 'width 0.5s' }} />
              </div>
            </div>
          </>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Metode Pembayaran</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['BMC', 'USDT', 'Fiat (IDR)'].map(c => (
                <button key={c} type="button" onClick={() => setCurrency(c)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: `2px solid ${currency === c ? 'var(--primary)' : 'var(--border-color)'}`, background: currency === c ? 'rgba(12,166,120,0.1)' : 'transparent', color: 'var(--text-main)', fontWeight: currency === c ? 'bold' : 'normal', cursor: 'pointer', fontSize: '0.85rem' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          {currency === 'BMC' && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>💰 Saldo BMC Anda: <strong>{formatBalance(userBmc)} BMC</strong></p>}
          {currency === 'Fiat (IDR)' && <p style={{ fontSize: '0.8rem', color: '#339af0', marginBottom: '12px' }}>🏦 Instruksi transfer bank akan dikirim ke email Anda setelah konfirmasi.</p>}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Jumlah Kontribusi ({currency})</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0.1" step="0.1" placeholder="0.00" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '1.1rem', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#f59f00', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 'bold', fontSize: '1rem', cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? '⏳ Memproses...' : `🌿 Donasikan ${amount || '0'} ${currency}`}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────
const DaoCommunityPage = () => {
  const { t } = useLanguage();
  const { user, processCheckin, getActiveStreak, getJakartaCheckinDay, voteOnProposal, createProposal, supportFunding, openNftPack, completeDailyMission, postForumTopic, likeForumTopic, bookVisit } = useAuth();

  // Realtime hooks
  const { proposals, loading: propLoading } = useDaoProposals();
  const { topics: forumTopics, loading: forumLoading } = useDaoForum(10);
  const { campaigns, loading: fundLoading } = useDaoCommunityFunding();
  const { leaderboard, loading: lbLoading } = useLeaderboard(5);
  const { unlockedIds } = useUserGuardians(user?.id);
  const { completedToday, today } = useDailyMissions(user?.id);

  // Modals
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [showForumPost, setShowForumPost] = useState(false);
  const [bookingSite, setBookingSite] = useState(null);
  const [fundingModal, setFundingModal] = useState(null);

  // Check-in logic
  const currentWibDay = getJakartaCheckinDay ? getJakartaCheckinDay() : today;
  const lastCheckin = user?.lastCheckinDate || null;
  const streak = getActiveStreak ? getActiveStreak() : 0;
  const canCheckinToday = lastCheckin !== currentWibDay;

  // Daily missions definition
  const missionDefs = [
    { id: 'vote_proposal', title: t('dao_mission_1'), reward: 0.5, color: '#845ef7' },
    { id: 'post_forum', title: t('dao_mission_2'), reward: 0.25, color: '#339af0' },
    { id: 'play_minigame', title: 'Main BlockBamboo & Naik Level', reward: 'Progressif', color: '#e03131', isGame: true },
  ];

  const handleMission = async (mission) => {
    if (completedToday.includes(mission.id) && !mission.isGame) return;
    if (mission.id === 'vote_proposal') {
      alert('💡 Vote pada proposal di bawah untuk menyelesaikan misi ini!');
      return;
    }
    if (mission.id === 'post_forum') {
      setShowForumPost(true);
      return;
    }
    if (mission.id === 'play_minigame') {
      window.open('https://modular-blockbamboo.vercel.app/', '_blank');
      return;
    }
  };

  const handleVote = async (proposalId, vote, currentVoters) => {
    if (!user) { alert('❌ Silakan login untuk vote!'); return; }
    if (currentVoters && currentVoters[user.id]) {
      alert('❌ Anda sudah pernah vote pada proposal ini.'); return;
    }
    const ok = await voteOnProposal(proposalId, vote);
    if (ok) {
      // Complete mission jika vote proposal
      if (!completedToday.includes('vote_proposal')) {
        await completeDailyMission('vote_proposal', 0.5);
      }
    }
  };

  const handleForumPost = async (topic, content, tags) => {
    const result = await postForumTopic(topic, content, tags);
    if (result) {
      if (!completedToday.includes('post_forum')) {
        await completeDailyMission('post_forum', 0.25);
      }
    }
    return result;
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-color)' }}>

      {/* Modals */}
      {showCreateProposal && <CreateProposalModal onClose={() => setShowCreateProposal(false)} onCreate={createProposal} />}
      {showForumPost && <ForumPostModal onClose={() => setShowForumPost(false)} onPost={handleForumPost} />}
      {bookingSite && <BookVisitModal siteName={bookingSite} onClose={() => setBookingSite(null)} onBook={bookVisit} />}
      {fundingModal && <SupportFundingModal campaign={fundingModal} onClose={() => setFundingModal(null)} onSupport={supportFunding} userBmc={user?.bmcBalance || 0} />}

      {/* HEADER */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(132, 94, 247, 0.1)', padding: '16px', borderRadius: '50%', color: '#845ef7' }}>
            <Users size={40} />
          </div>
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-0.5px' }}>
          {t('dao_header_title')}
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
          {t('dao_header_desc')}
        </p>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* ROW 1: GAMIFICATION HUB */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

          {/* Daily Check-in */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary), #1b5e20)', borderRadius: '20px', padding: '24px', color: 'white', textAlign: 'center', boxShadow: '0 8px 30px rgba(12,166,120,0.3)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><CalendarCheck size={100} /></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px 0' }}>{t('dao_daily_checkin_title')}</h3>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>{t('dao_daily_checkin_desc').replace('{streak}', streak)}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                  {[{ day: 1, rwd: '0.001' }, { day: 2, rwd: '0.002' }, { day: 3, rwd: '0.003' }, { day: 4, rwd: '0.004' }, { day: 5, rwd: '0.005' }, { day: 6, rwd: '0.006' }, { day: 7, rwd: '0.010', special: true }].map((d, i) => {
                    const dayNum = i + 1;
                    let status = 'locked';
                    if (dayNum <= streak) status = 'claimed';
                    else if (dayNum === streak + 1 && canCheckinToday) status = 'today';
                    return (
                      <div key={d.day} style={{ minWidth: '32px', height: '32px', background: status === 'claimed' ? '#fcc419' : status === 'today' ? '#ffffff' : 'rgba(255,255,255,0.2)', color: status === 'claimed' ? '#1b5e20' : status === 'today' ? 'var(--primary)' : 'white', border: d.special ? '2.5px solid #fcc419' : 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: status === 'claimed' ? '0 0 10px #fcc419' : 'none' }} title={`Day ${d.day}: ${d.rwd} BMC`}>
                        {d.day}
                      </div>
                    );
                  })}
                </div>
                {canCheckinToday ? (
                  <button onClick={async () => {
                    const result = await processCheckin();
                    if (result) alert(t('dao_alert_daily_success').replace('{day}', result.nextStreak).replace('{amt}', result.amount));
                  }} style={{ background: 'white', color: 'var(--primary)', padding: '12px 24px', borderRadius: '20px', border: 'none', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}>
                    {t('dao_btn_checkin_now')}
                  </button>
                ) : (
                  <button disabled style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '12px 24px', borderRadius: '20px', border: 'none', fontWeight: 'bold', width: '100%', cursor: 'default' }}>
                    {t('dao_btn_already_checkedin').replace('{streak}', streak)}
                  </button>
                )}
              </div>
            </div>

            {/* My Rewards */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '4px' }}>
                  <Gift size={16} color="#f59f00" /> {t('dao_my_total_rewards')}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)' }}>
                  {user ? formatBalance(user.bmcBalance) : '0.00'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>BMC</span>
                </div>
                {user && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>≈ {(user.bmcBalance || 0).toLocaleString()} XP Leaderboard</div>}
              </div>
              <button onClick={() => alert(t('dao_alert_claim_audit'))} style={{ background: '#fff9db', color: '#f59f00', border: '1px solid #fcc419', padding: '10px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>{t('dao_btn_claim')}</button>
            </div>
          </div>

          {/* Missions & Mini-Game */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={20} color="#e03131" /> {t('dao_daily_missions_title')}
              </h3>
              <span style={{ fontSize: '0.8rem', background: '#ffe3e3', color: '#e03131', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>{t('dao_mission_reset')}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {missionDefs.map(mission => {
                const isDone = completedToday.includes(mission.id);
                return (
                  <div key={mission.id}
                    onClick={() => handleMission(mission)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: isDone ? 'var(--bg-secondary)' : 'var(--bg-card)', border: `1px solid ${isDone ? 'var(--border-color)' : mission.color + '40'}`, borderRadius: '12px', opacity: isDone ? 0.7 : 1, cursor: isDone ? 'default' : 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: isDone ? 'none' : `2px solid ${mission.color}`, background: isDone ? mission.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                        {isDone && '✓'}
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: isDone ? 'normal' : '500', textDecoration: isDone ? 'line-through' : 'none', color: 'var(--text-main)' }}>{mission.title}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: isDone ? 'var(--text-muted)' : '#f59f00', flexShrink: 0 }}>
                      {typeof mission.reward === 'number' ? `+${mission.reward} BMC` : mission.reward}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 'auto', background: 'linear-gradient(135deg, #1864ab, #339af0)', borderRadius: '16px', padding: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="/logo.png" alt="enPIneering Logo" style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'contain', background: 'white', padding: '4px' }} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Gamepad2 size={18} /> enPIneering BlockBamboo
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
                    Constructor v1.0. Mainkan, capai level baru, dan dapatkan hadiah BMC sesuai level Anda!
                  </p>
                </div>
              </div>
              <button onClick={() => {
                window.open('https://modular-blockbamboo.vercel.app/', '_blank');
              }} style={{ background: 'white', color: '#1864ab', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', flexShrink: 0 }}>Play Now</button>
            </div>
          </div>

          {/* Leaderboard — LIVE from BMC balance */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 6px 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={20} color="#f59f00" /> {t('dao_leaderboard_title')}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Ranking live berdasarkan total saldo BMC</p>
            {lbLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}><Loader size={24} className="spin" /></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {leaderboard.map((entry, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px', borderBottom: idx === leaderboard.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: entry.rank === 1 ? '#fcc419' : entry.rank === 2 ? '#ced4da' : entry.rank === 3 ? '#e8a317' : '#f8f9fa', color: entry.rank <= 3 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', flexShrink: 0 }}>
                      {entry.rank}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {entry.user} {user && entry.userId === user.id && <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>(Anda)</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={10} color="#f59f00" /> {t('dao_tier_' + entry.tier.toLowerCase().replace(' ', '_')) || entry.tier}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)', flexShrink: 0 }}>{entry.points}</div>
                  </div>
                ))}
                {leaderboard.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>Belum ada data leaderboard.</p>}
              </div>
            )}
            <button onClick={() => alert(t('dao_alert_rank'))} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px dashed #ced4da', padding: '8px', width: '100%', borderRadius: '12px', marginTop: '16px', fontSize: '0.8rem', cursor: 'pointer' }}>{t('dao_btn_view_my_rank')}</button>
          </div>
        </div>

        {/* ROW 2: VOTING & FUNDING */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

          {/* PROPOSALS — LIVE */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                <Vote size={24} color="#845ef7" /> {t('dao_voting_title')}
              </h3>
              <button onClick={() => setShowCreateProposal(true)} style={{ background: '#845ef7', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> {t('dao_btn_create_proposal')}
              </button>
            </div>

            {propLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '30px' }}><Loader size={28} /></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {proposals.filter(p => p.status === 'active').slice(0, 5).map((prop) => {
                  const total = (prop.yesVotes || 0) + (prop.noVotes || 0);
                  const yesPercent = total > 0 ? Math.round((prop.yesVotes / total) * 100) : 50;
                  const noPercent = 100 - yesPercent;
                  const hasVoted = user && prop.voters && prop.voters[user.id];
                  const endDate = prop.endTime?.toDate ? prop.endTime.toDate() : new Date(prop.endTime);
                  const remaining = Math.max(0, Math.ceil((endDate - Date.now()) / (1000 * 60 * 60 * 24)));

                  return (
                    <div key={prop.id} style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#adb5bd' }}>BIP</span>
                            <span style={{ fontSize: '0.75rem', background: '#eebefa', color: '#845ef7', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>🟢 Aktif</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🕒 {remaining} hari lagi</span>
                          </div>
                          <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: '0 0 4px 0' }}>{prop.title}</h4>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Oleh: {prop.author}</div>
                        </div>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          <span style={{ color: 'var(--primary)' }}>👍 {yesPercent}% ({prop.yesVotes || 0})</span>
                          <span style={{ color: '#e03131' }}>({prop.noVotes || 0}) {noPercent}% 👎</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#e03131', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${yesPercent}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.5s' }} />
                        </div>
                      </div>
                      {hasVoted ? (
                        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', padding: '8px', background: 'var(--bg-secondary)', borderRadius: '10px' }}>
                          ✅ Anda sudah vote: <strong>{prop.voters[user.id]}</strong>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => handleVote(prop.id, 'yes', prop.voters)} style={{ flex: 1, padding: '10px', background: 'rgba(12,166,120,0.1)', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <ThumbsUp size={16} /> Setuju
                          </button>
                          <button onClick={() => handleVote(prop.id, 'no', prop.voters)} style={{ flex: 1, padding: '10px', background: 'rgba(224,49,49,0.1)', color: '#e03131', border: '1px solid #e03131', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <ThumbsDown size={16} /> Tolak
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {proposals.filter(p => p.status === 'active').length === 0 && !propLoading && (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Belum ada proposal aktif. Jadilah yang pertama membuat proposal!</p>
                )}
              </div>
            )}
          </div>

          {/* COMMUNITY FUNDING — LIVE */}
          <div style={{ background: 'linear-gradient(135deg, rgba(245,159,0,0.05), rgba(201,42,42,0.05))', borderRadius: '24px', padding: '32px', border: '1px solid rgba(245,159,0,0.2)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <HeartHandshake size={24} color="#f59f00" /> {t('dao_funding_title')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>{t('dao_funding_desc')}</p>

            {fundLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}><Loader size={24} /></div>
            ) : (
              campaigns.map(campaign => {
                const progress = Math.min(100, ((campaign.raisedAmount || 0) / (campaign.targetAmount || 1)) * 100);
                return (
                  <div key={campaign.id} style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--text-main)' }}>{campaign.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>{campaign.description}</p>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t('dao_funding_total_raised')}</span>
                        <span style={{ fontWeight: 'bold', color: '#f59f00' }}>{(campaign.raisedAmount || 0).toLocaleString()} / {(campaign.targetAmount || 0).toLocaleString()} USDT</span>
                      </div>
                      <div style={{ height: '8px', background: '#f1f3f5', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: '#f59f00', transition: 'width 0.5s' }} />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{Math.round(progress)}% tercapai • {(campaign.supporters || []).length} pendukung</div>
                    </div>
                    <button onClick={() => setFundingModal(campaign)} style={{ width: '100%', background: '#f59f00', color: 'white', padding: '14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
                      <Heart size={20} /> {t('dao_btn_support_grassroots')}
                    </button>
                  </div>
                );
              })
            )}
            {!fundLoading && campaigns.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Belum ada kampanye funding aktif.</p>
            )}
          </div>
        </div>

        {/* ROW 3: webNUSA (WISATA EDUKASI) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                <Compass size={32} color="var(--primary)" /> {t('dao_webnusa_title')}
              </h3>
              <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{t('dao_webnusa_desc')}</p>
            </div>
            <button onClick={() => alert(t('dao_alert_map'))} style={{ background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>{t('dao_btn_explore_tourism_map')}</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { title: t('dao_site_1_title'), loc: t('dao_site_1_loc'), desc: t('dao_site_1_desc'), img: 'https://images.unsplash.com/photo-1542450530-5bfa5dfef006?ixlib=rb-4.0.3' },
              { title: t('dao_site_2_title'), loc: t('dao_site_2_loc'), desc: t('dao_site_2_desc'), img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3' },
              { title: t('dao_site_3_title'), loc: t('dao_site_3_loc'), desc: t('dao_site_3_desc'), img: 'https://images.unsplash.com/photo-1587825027984-c4476461c8f9?ixlib=rb-4.0.3' }
            ].map((site, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div style={{ height: '160px', position: 'relative' }}>
                  <img src={site.img} alt={site.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {site.loc}
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>{site.title}</h4>
                  <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{site.desc}</p>
                  <button onClick={() => setBookingSite(site.title)} style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {t('dao_btn_book_visit')} <Star size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 4: BAMBOO GUARDIANS — LIVE UNLOCK */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                <Users size={32} color="#f59f00" /> {t('dao_guardians_title')}
              </h3>
              <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{t('dao_guardians_desc')}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ background: 'var(--bg-card)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                {t('dao_unlocked_label')}: <span style={{ color: 'var(--primary)' }}>{unlockedIds.length}/36</span>
              </div>
              <button onClick={async () => {
                const newId = await openNftPack();
                if (newId) {
                  setTimeout(() => alert(`🎉 Guardian #${newId} berhasil dibuka! Cek galeri Anda.`), 100);
                }
              }} style={{ background: 'var(--text-main)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                {t('dao_btn_open_pack')} (50 BMC)
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px', background: 'var(--bg-secondary)', padding: '20px', borderRadius: '32px', border: '2px dashed var(--border-color)' }}>
            {bambooCharacters.map((char) => {
              const isUnlocked = unlockedIds.includes(char.idStr) || (!user && char.id <= 3);
              return (
                <div key={char.id}
                  style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '12px', border: `1px solid ${isUnlocked ? 'var(--primary)' : 'var(--border-color)'}`, transition: 'all 0.3s', cursor: 'pointer', position: 'relative', textAlign: 'center', opacity: isUnlocked ? 1 : 0.5, filter: isUnlocked ? 'none' : 'grayscale(80%)' }}
                  onMouseEnter={(e) => { if (isUnlocked) { e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.1)'; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '0.55rem', fontWeight: '900', padding: '2px 5px', borderRadius: '6px', zIndex: 2, background: char.rarity === 'Legendary' ? '#fcc419' : char.rarity === 'Epic' ? '#e599f7' : char.rarity === 'Rare' ? '#74c0fc' : '#ced4da', color: char.rarity === 'Legendary' ? '#1b5e20' : 'white', textTransform: 'uppercase' }}>
                    {t('rarity_' + char.rarity.toLowerCase())}
                  </div>
                  {!isUnlocked && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', zIndex: 3 }}>🔒</div>
                  )}
                  <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '14px', overflow: 'hidden', marginBottom: '8px', background: '#f8f9fa' }}>
                    <img src={char.img} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=G${char.id}&background=random&size=100`; }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>#{char.idStr}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 5: FORUM — LIVE */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <MessageSquare size={24} color="#339af0" /> {t('dao_forum_title')}
            </h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowForumPost(true)} style={{ background: '#339af0', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Buat Topik
              </button>
              <button onClick={() => alert(t('dao_alert_forum'))} style={{ background: 'transparent', color: '#339af0', border: '1px solid #339af0', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>{t('dao_btn_view_all_topics')}</button>
            </div>
          </div>

          {forumLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '30px' }}><Loader size={28} /></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {forumTopics.map((topic) => (
                <div key={topic.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px', border: '1px solid var(--border-color)', borderRadius: '16px', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                    <div style={{ width: '44px', height: '44px', background: 'var(--bg-secondary)', color: '#339af0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User size={22} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-main)' }}>{topic.topic}</h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {topic.author} • {topic.createdAt?.toDate ? new Date(topic.createdAt.toDate()).toLocaleDateString('id-ID') : 'Baru'}
                        {topic.tags?.length > 0 && <span style={{ marginLeft: '8px' }}>
                          {topic.tags.slice(0, 2).map(tag => <span key={tag} style={{ background: '#e7f5ff', color: '#339af0', padding: '1px 6px', borderRadius: '6px', fontSize: '0.7rem', marginLeft: '4px' }}>#{tag}</span>)}
                        </span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={15} /> {topic.replyCount || 0}</span>
                    <button onClick={() => likeForumTopic(topic.id, topic.likes)} style={{ color: (topic.likes || []).includes(user?.id) ? '#f59f00' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                      <ThumbsUp size={15} /> {(topic.likes || []).length}
                    </button>
                  </div>
                </div>
              ))}
              {forumTopics.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <MessageSquare size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                  <p>Belum ada diskusi. Mulailah topik pertama!</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DaoCommunityPage;
