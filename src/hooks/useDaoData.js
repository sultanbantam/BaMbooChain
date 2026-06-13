import { useState, useEffect } from 'react';
import {
  collection, query, orderBy, limit, onSnapshot, where,
  addDoc, updateDoc, doc, increment, arrayUnion, arrayRemove,
  serverTimestamp, getDocs, setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

// =============================================================
// HOOK 1: DAO Proposals (realtime)
// =============================================================
export function useDaoProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'dao_proposals'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsub = onSnapshot(q, (snap) => {
      setProposals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error('useDaoProposals error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { proposals, loading };
}

// =============================================================
// HOOK 2: DAO Forum Topics (realtime)
// =============================================================
export function useDaoForum(topicLimit = 10) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'dao_forum'),
      orderBy('createdAt', 'desc'),
      limit(topicLimit)
    );

    const unsub = onSnapshot(q, (snap) => {
      setTopics(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error('useDaoForum error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, [topicLimit]);

  return { topics, loading };
}

// =============================================================
// HOOK 3: Community Funding Campaigns (realtime)
// =============================================================
export function useDaoCommunityFunding() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'dao_funding'),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setCampaigns(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error('useDaoCommunityFunding error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { campaigns, loading };
}

// =============================================================
// HOOK 4: Leaderboard — top users by BMC balance (realtime)
// Since XP = BMC, we use bmcBalance as the ranking metric
// =============================================================
export function useLeaderboard(topN = 10) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      orderBy('bmcBalance', 'desc'),
      limit(topN)
    );

    const unsub = onSnapshot(q, (snap) => {
      const entries = snap.docs.map((d, idx) => {
        const data = d.data();
        const balance = data.bmcBalance || 0;
        let tier = 'Sprout';
        if (balance >= 1000) tier = 'Bamboo Master';
        else if (balance >= 100) tier = 'Green Ranger';
        return {
          rank: idx + 1,
          userId: d.id,
          user: data.username || data.name || '???',
          points: balance.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' BMC',
          tier,
          avatar: data.avatarUrl || null
        };
      });
      setLeaderboard(entries);
      setLoading(false);
    }, (err) => {
      console.error('useLeaderboard error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, [topN]);

  return { leaderboard, loading };
}

// =============================================================
// HOOK 5: User Unlocked Guardians
// =============================================================
export function useUserGuardians(userId) {
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, 'users', userId), (snap) => {
      if (snap.exists()) {
        setUnlockedIds(snap.data().unlockedGuardians || []);
      }
      setLoading(false);
    }, (err) => {
      console.error('useUserGuardians error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, [userId]);

  return { unlockedIds, loading };
}

// =============================================================
// HOOK 6: Daily Missions Status
// =============================================================
export function useDailyMissions(userId) {
  const [completedToday, setCompletedToday] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Intl.DateTimeFormat('fr-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, 'users', userId), (snap) => {
      if (snap.exists()) {
        const missions = snap.data().dao_missions_completed || {};
        setCompletedToday(missions[today] || []);
      }
      setLoading(false);
    }, (err) => {
      console.error('useDailyMissions error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, [userId, today]);

  return { completedToday, today, loading };
}

// =============================================================
// HOOK 7: DAO Bookings
// =============================================================
export function useDaoBookings(userId) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'dao_bookings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error('useDaoBookings error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, [userId]);

  return { bookings, loading };
}

// =============================================================
// SEED FUNCTION — run once to populate initial Firestore data
// =============================================================
export async function seedDaoInitialData() {
  try {
    // Seed proposals if empty
    const propSnap = await getDocs(collection(db, 'dao_proposals'));
    if (propSnap.empty) {
      await addDoc(collection(db, 'dao_proposals'), {
        title: 'Ekspansi Pembibitan Ke Area Cikadut (50 Ha)',
        description: 'Proposal untuk mengembangkan area pembibitan bambu ke wilayah Cikadut seluas 50 Ha guna meningkatkan produksi bibit berkualitas tinggi.',
        author: 'Yayasan Core',
        authorId: 'system',
        status: 'active',
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        yesVotes: 75,
        noVotes: 25,
        voters: {},
        minBmcRequired: 0,
        createdAt: serverTimestamp()
      });

      await addDoc(collection(db, 'dao_proposals'), {
        title: 'Alokasi 5% Profit Untuk Beasiswa Tani',
        description: 'Proposal untuk mengalokasikan 5% dari keuntungan ekosistem bambuNUSA sebagai beasiswa pendidikan bagi putra-putri petani bambu mitra.',
        author: '0x4a...93b',
        authorId: 'system',
        status: 'active',
        endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
        yesVotes: 92,
        noVotes: 8,
        voters: {},
        minBmcRequired: 0,
        createdAt: serverTimestamp()
      });

      console.log('✅ DAO Proposals seeded');
    }

    // Seed funding campaigns if empty
    const fundSnap = await getDocs(collection(db, 'dao_funding'));
    if (fundSnap.empty) {
      await addDoc(collection(db, 'dao_funding'), {
        title: 'Dana Restorasi Lahan Kritis Banten',
        description: 'Crowdfunding komunitas untuk membiayai program restorasi lahan kritis di kawasan penyangga hutan adat Baduy.',
        targetAmount: 50000,
        raisedAmount: 24500,
        currency: 'USDT',
        supporters: [],
        status: 'open',
        createdAt: serverTimestamp()
      });

      console.log('✅ DAO Funding seeded');
    }

    // Seed forum topics if empty
    const forumSnap = await getDocs(collection(db, 'dao_forum'));
    if (forumSnap.empty) {
      await addDoc(collection(db, 'dao_forum'), {
        topic: 'Berapa lama tunas bambu betung biasanya masuk panen pertama?',
        content: 'Saya baru menanam 200 bibit bambu betung di lahan 1 Ha. Kira-kira berapa lama sampai bisa panen pertama kali?',
        author: 'NusantaraGreen',
        authorId: 'system',
        likes: [],
        replyCount: 12,
        tags: ['budidaya', 'betung', 'panen'],
        createdAt: serverTimestamp()
      });

      await addDoc(collection(db, 'dao_forum'), {
        topic: 'Saran: Tambahkan fitur Live Streaming Drone di Dashboard!',
        content: 'Bagaimana jika kita integrasikan drone IoT untuk monitoring kebun bambu secara live di dashboard bambuNUSA? Ini akan sangat membantu validator lapangan.',
        author: 'InvestBud',
        authorId: 'system',
        likes: [],
        replyCount: 45,
        tags: ['fitur', 'drone', 'IoT', 'dashboard'],
        createdAt: serverTimestamp()
      });

      console.log('✅ DAO Forum seeded');
    }
  } catch (err) {
    console.error('Error seeding DAO data:', err);
  }
}
