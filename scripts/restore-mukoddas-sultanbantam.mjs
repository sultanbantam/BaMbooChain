import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const content = readFileSync(resolve(ROOT, '.env.local'), 'utf8');

const getEnv = (key) => {
  const m = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
  if (!m) return null;
  let val = m[1].trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  return val;
};

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: getEnv('FIREBASE_PROJECT_ID'),
    clientEmail: getEnv('FIREBASE_CLIENT_EMAIL'),
    privateKey: getEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

async function run() {
  const TARGET_UID = 'CJExBjM0wcWQsLQ1xKzqBEbFpOO2'; // Active account for sultanbantam@gmail.com
  const DFU_UID    = 'dfu1sCSmOvYGzhr8r79EvbV72xb2'; // Source for KYC, validator, admin_yayasan, 2223.58 BMC
  const MQY_UID    = 'MQYVvD3nmWePyYTMXFOKFEOkBOX2'; // Source for cvFile (IMG-20260529-WA0008.jpg)

  console.log('🔄 Fetching source documents...');
  const [targetDoc, dfuDoc, mqyDoc] = await Promise.all([
    db.collection('users').doc(TARGET_UID).get(),
    db.collection('users').doc(DFU_UID).get(),
    db.collection('users').doc(MQY_UID).get(),
  ]);

  if (!targetDoc.exists) {
    console.error('❌ Target document does not exist!');
    process.exit(1);
  }

  const current = targetDoc.data();
  const dfu = dfuDoc.exists ? dfuDoc.data() : {};
  const mqy = mqyDoc.exists ? mqyDoc.data() : {};

  // Merge transactions uniquely by id
  const txMap = new Map();
  for (const tx of [...(dfu.transactions || []), ...(mqy.transactions || []), ...(current.transactions || [])]) {
    if (tx && tx.id) {
      txMap.set(tx.id, tx);
    }
  }
  const mergedTx = Array.from(txMap.values());

  // Merge notifications uniquely
  const notifMap = new Map();
  for (const n of [...(dfu.notifications || []), ...(mqy.notifications || []), ...(current.notifications || [])]) {
    if (n && n.id) {
      notifMap.set(n.id, n);
    }
  }
  const mergedNotif = Array.from(notifMap.values());

  const restoredPayload = {
    name: 'Mukoddas Syuhada',
    username: 'sultanbantam',
    email: 'sultanbantam@gmail.com',
    phone: dfu.phone || mqy.phone || '08174139994',
    
    // KYC Verification
    kycStatus: 'verified',
    kycVerifiedAt: dfu.kycData?.submittedAt || '2026-05-18T08:18:09.549Z',
    kycData: dfu.kycData || {
      fullName: 'Mukoddas Syuhada',
      nik: '3175072810760022',
      submittedAt: '2026-05-18T08:18:09.549Z',
    },

    // Roles & Privileges
    isAdmin: true,
    role: 'admin_yayasan',
    isValidator: true,
    
    // Token & Staking Balances
    bmcBalance: Number(((dfu.bmcBalance || 2223.58) + (mqy.bmcBalance || 40.005)).toFixed(4)),
    stakedBalance: Math.max(dfu.stakedBalance || 0, 500),

    // Document / Company Profile / CV
    cvFile: mqy.cvFile || null,

    // Passport
    passportId: 'sultanbantam',
    bambooPassportId: 'sultanbantam',

    // Bio & Status
    bioText: dfu.bioText || 'Semua Ide yang ada di Otak Aing, sudah ada Samudera yang akan menampung!',
    statusText: current.statusText || dfu.statusText || mqy.statusText || '',

    // Checkin & Activity
    checkinStreak: Math.max(dfu.checkinStreak || 0, mqy.checkinStreak || 0, current.checkinStreak || 0),
    lastCheckinDate: dfu.lastCheckinDate || current.lastCheckinDate || '2026-10-07',

    // History & Notifs
    transactions: mergedTx,
    notifications: mergedNotif,

    updatedAt: new Date().toISOString(),
  };

  console.log('📝 Updating Target User Document:', TARGET_UID);
  await db.collection('users').doc(TARGET_UID).update(restoredPayload);

  console.log('✅ Pemulihan target akun SUKSES!');
  console.log({
    name: restoredPayload.name,
    username: restoredPayload.username,
    email: restoredPayload.email,
    phone: restoredPayload.phone,
    kycStatus: restoredPayload.kycStatus,
    isAdmin: restoredPayload.isAdmin,
    role: restoredPayload.role,
    isValidator: restoredPayload.isValidator,
    bmcBalance: restoredPayload.bmcBalance,
    stakedBalance: restoredPayload.stakedBalance,
    cvFileName: restoredPayload.cvFile?.name,
    hasCvData: !!restoredPayload.cvFile?.data,
    totalTransactions: restoredPayload.transactions.length,
    totalNotifications: restoredPayload.notifications.length,
  });
}

run().catch(console.error);
