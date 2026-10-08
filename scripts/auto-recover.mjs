/**
 * Script pemulihan otomatis untuk akun Mukoddas Syuhada → sultanbantam@gmail.com
 * Jalankan: node scripts/auto-recover.mjs
 */
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Load .env.local
function loadEnv() {
  const files = ['.env.local', '.env'];
  for (const f of files) {
    const p = resolve(ROOT, f);
    if (!existsSync(p)) continue;
    const lines = readFileSync(p, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnv();

// Init Firebase Admin
if (admin.apps.length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
  }
}

const db = admin.firestore();

const C = { reset:'\x1b[0m', bold:'\x1b[1m', red:'\x1b[31m', green:'\x1b[32m', yellow:'\x1b[33m', cyan:'\x1b[36m', gray:'\x1b[90m' };
const bold=s=>`${C.bold}${s}${C.reset}`, green=s=>`${C.green}${s}${C.reset}`, yellow=s=>`${C.yellow}${s}${C.reset}`;
const red=s=>`${C.red}${s}${C.reset}`, cyan=s=>`${C.cyan}${s}${C.reset}`, gray=s=>`${C.gray}${s}${C.reset}`;
const fmtVal=v=>{ if(v===null||v===undefined) return gray('(kosong)'); if(typeof v==='object') return gray(JSON.stringify(v).slice(0,55)); return String(v); };

const RECOVERABLE = [
  'name','username','phone','avatarUrl','joinedAt',
  'walletAddress','bmcBalance','stakedBalance',
  'isValidator','isAdmin','role',
  'kycStatus','kycVerifiedAt','kycData',
  'bambooPassportId','passportId',
  'checkinStreak','lastCheckinDate',
  'bioText','statusText',
  'claimedReferrals','referredBy','securitySettings',
  'transactions','notifications',
];

async function main() {
  console.log('\n' + bold(cyan('╔══════════════════════════════════════════════════════╗')));
  console.log(bold(cyan('║   PEMULIHAN AKUN BAMBOOCHAIN — Auto Mode              ║')));
  console.log(bold(cyan('╚══════════════════════════════════════════════════════╝\n')));

  const TARGET_EMAIL = 'sultanbantam@gmail.com';
  const SEARCH_NAME  = 'mukoddas';

  // ── 1. Cari akun TARGET (yang sudah reset) ──
  console.log(`🔍 Mencari akun target: ${cyan(TARGET_EMAIL)}...`);
  const targetSnap = await db.collection('users').where('email', '==', TARGET_EMAIL).get();

  if (targetSnap.empty) {
    console.log(red(`❌ Tidak ditemukan user dengan email: ${TARGET_EMAIL}`));
    console.log(yellow('💡 Coba jalankan: node scripts/recover-account.mjs (mode manual)'));
    process.exit(1);
  }

  const targetDoc = targetSnap.docs[0];
  const currentData = { id: targetDoc.id, ...targetDoc.data() };
  console.log(green(`✅ Akun target ditemukan: ${currentData.name} | UID: ${currentData.id}`));

  // ── 2. Cari profil lama (Mukoddas) ──
  console.log(`\n🔍 Mencari profil lama (nama mengandung "${SEARCH_NAME}")...`);
  const allSnap = await db.collection('users').get();
  const candidates = [];
  allSnap.forEach(d => {
    if (d.id === currentData.id) return; // Bukan akun saat ini
    const data = d.data();
    if ((data.name || '').toLowerCase().includes(SEARCH_NAME)) {
      candidates.push({ id: d.id, ...data });
    }
  });

  console.log(`\n📋 Total user di Firestore: ${allSnap.size}`);

  if (candidates.length === 0) {
    console.log(yellow('\n⚠️  Profil lama "Mukoddas" tidak ditemukan di Firestore.'));
    console.log(yellow('   Kemungkinan dokumen sudah terhapus dari database.'));
    console.log('\n' + bold('📊 Daftar semua user yang ada di Firestore:'));
    console.log('─'.repeat(80));
    allSnap.forEach((d, i) => {
      const data = d.data();
      console.log(`  UID: ${d.id.slice(0,20)}... | Nama: ${(data.name||'-').padEnd(25)} | KYC: ${data.kycStatus||'-'} | BMC: ${data.bmcBalance||0}`);
    });
    console.log('─'.repeat(80));
    console.log(yellow('\n💡 Jika data sudah terhapus, gunakan mode manual:'));
    console.log('   node scripts/recover-account.mjs');
    process.exit(0);
  }

  console.log(green(`\n✅ Ditemukan ${candidates.length} profil lama:`));
  candidates.forEach((c, i) => {
    console.log(`  [${i+1}] ${c.name} | @${c.username||'-'} | KYC: ${c.kycStatus||'-'} | BMC: ${c.bmcBalance||0} | Validator: ${c.isValidator||false} | Admin: ${c.isAdmin||false}`);
    console.log(`      UID: ${c.id}`);
  });

  // Pilih kandidat terbaik (yang punya data paling lengkap — KYC verified / isAdmin)
  const oldData = candidates.sort((a, b) => {
    const scoreA = (a.kycStatus === 'verified' ? 10 : 0) + (a.isAdmin ? 5 : 0) + (a.isValidator ? 3 : 0) + (a.bmcBalance || 0);
    const scoreB = (b.kycStatus === 'verified' ? 10 : 0) + (b.isAdmin ? 5 : 0) + (b.isValidator ? 3 : 0) + (b.bmcBalance || 0);
    return scoreB - scoreA;
  })[0];

  console.log(`\n🎯 Profil terpilih untuk restore: ${bold(oldData.name)} (UID: ${oldData.id})`);

  // ── 3. Tampilkan perbandingan ──
  console.log('\n' + bold('══════════════════════════════════════════════════════════════'));
  console.log(bold('  PERBANDINGAN DATA'));
  console.log(bold('══════════════════════════════════════════════════════════════'));
  console.log(`${'Field'.padEnd(22)} ${'LAMA (Mukoddas)'.padEnd(35)} ${'SAAT INI (Sultan)'.padEnd(30)}`);
  console.log('─'.repeat(88));

  const SKIP = new Set(['notifications','transactions','securitySettings']);
  const allKeys = new Set([...Object.keys(oldData), ...Object.keys(currentData)]);
  let diffCount = 0;
  for (const key of allKeys) {
    if (SKIP.has(key) || key === 'id') continue;
    const ov = fmtVal(oldData[key]);
    const cv = fmtVal(currentData[key]);
    const isDiff = JSON.stringify(oldData[key]) !== JSON.stringify(currentData[key]);
    if (isDiff) diffCount++;
    const marker = isDiff ? yellow('◀') : gray(' ');
    console.log(`${marker} ${key.padEnd(21)} ${ov.padEnd(43)} ${cv.padEnd(30)}`);
  }
  console.log('─'.repeat(88));
  console.log(yellow(`◀ = ${diffCount} field berbeda — akan dipulihkan dari profil lama\n`));

  // ── 4. Bangun payload ──
  const payload = {};
  for (const field of RECOVERABLE) {
    if (oldData[field] === undefined) continue;
    if (field === 'bmcBalance' || field === 'stakedBalance') {
      payload[field] = Math.max(oldData[field] || 0, currentData[field] || 0);
    } else if (field === 'transactions' || field === 'notifications') {
      const merged = [...(oldData[field] || []), ...(currentData[field] || [])];
      const seen = new Set();
      payload[field] = merged.filter(item => {
        if (!item?.id) return true;
        if (seen.has(item.id)) return false;
        seen.add(item.id); return true;
      });
    } else {
      payload[field] = oldData[field];
    }
  }

  // ── 5. Eksekusi update ──
  console.log('⏳ Memulihkan data ke akun aktif...');
  try {
    await db.collection('users').doc(currentData.id).update(payload);

    console.log(green('\n✅ ══════════════════════════════════════════'));
    console.log(green('   PEMULIHAN BERHASIL!'));
    console.log(green('   ══════════════════════════════════════════'));
    console.log(`\n   Akun yang dipulihkan : ${cyan(currentData.id)}`);
    console.log(`   Sumber data          : ${cyan(oldData.id)}`);
    console.log('\n   Field yang berhasil dipulihkan:');
    for (const [k, v] of Object.entries(payload)) {
      if (k === 'transactions' || k === 'notifications') {
        console.log(`   ${green('✔')} ${k}: ${cyan(`${v.length} item`)}`);
      } else {
        console.log(`   ${green('✔')} ${k}: ${cyan(fmtVal(v))}`);
      }
    }

    // Tandai akun lama sebagai archived
    await db.collection('users').doc(oldData.id).update({
      _archived: true,
      _archivedAt: new Date().toISOString(),
      _archivedNote: `Profil dipindahkan ke UID aktif: ${currentData.id}`,
    });
    console.log(yellow(`\n   Akun lama (${oldData.id.slice(0,16)}...) ditandai archived.`));
    console.log(green('\n📌 LANGKAH BERIKUTNYA:'));
    console.log('   1. Minta user LOGOUT dari BambooChain di browser');
    console.log('   2. Minta user LOGIN kembali');
    console.log('   3. Data Mukoddas Syuhada akan muncul kembali ✅\n');

  } catch (err) {
    console.error(red(`\n❌ Gagal memperbarui Firestore: ${err.message}`));
    console.error(err);
    process.exit(1);
  }

  process.exit(0);
}

main();
