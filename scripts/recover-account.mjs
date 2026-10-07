/**
 * ============================================================
 * SCRIPT PEMULIHAN AKUN BAMBOOCHAIN
 * recover-account.mjs
 * ============================================================
 * Fungsi: Mencari profil akun lama di Firestore, menampilkan
 * perbandingan data, lalu memulihkan (merge) ke akun aktif.
 *
 * Cara pakai:
 *   node scripts/recover-account.mjs
 *
 * Pastikan FIREBASE_SERVICE_ACCOUNT atau kombinasi
 * FIREBASE_PROJECT_ID + FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL
 * tersedia di environment (atau .env.local / .env).
 * ============================================================
 */

import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── Load .env.local atau .env secara manual (tanpa dotenv) ──
function loadEnv() {
  const files = ['.env.local', '.env'];
  for (const f of files) {
    const p = resolve(ROOT, f);
    if (existsSync(p)) {
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
      console.log(`✅ Loaded env from: ${f}`);
    }
  }
}

// ── Inisialisasi Firebase Admin ──
function initAdmin() {
  if (admin.apps.length > 0) return admin.app();

  loadEnv();

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(sa) });
  } else if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_CLIENT_EMAIL
  ) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    throw new Error(
      '❌ Firebase Admin credentials tidak ditemukan!\n' +
      'Pastikan salah satu dari berikut ada di .env / .env.local:\n' +
      '  - FIREBASE_SERVICE_ACCOUNT (JSON lengkap)\n' +
      '  - FIREBASE_PROJECT_ID + FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL'
    );
  }

  console.log('🔥 Firebase Admin berhasil diinisialisasi.\n');
  return admin.app();
}

// ── Prompt helper ──
const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

// ── Warna terminal ──
const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', red: '\x1b[31m',
  green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m', gray: '\x1b[90m',
};
const bold   = (s) => `${C.bold}${s}${C.reset}`;
const green  = (s) => `${C.green}${s}${C.reset}`;
const yellow = (s) => `${C.yellow}${s}${C.reset}`;
const red    = (s) => `${C.red}${s}${C.reset}`;
const cyan   = (s) => `${C.cyan}${s}${C.reset}`;
const gray   = (s) => `${C.gray}${s}${C.reset}`;

function fmtVal(v) {
  if (v === null || v === undefined) return gray('(kosong)');
  if (typeof v === 'object') return gray(JSON.stringify(v).slice(0, 60));
  return String(v);
}

function showDiff(oldData, newData) {
  const keys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
  const SKIP = new Set(['notifications', 'transactions']);

  console.log('\n' + bold('═══════════════════════════════════════════════════════'));
  console.log(bold('  PERBANDINGAN: Profil Lama vs Profil Saat Ini'));
  console.log(bold('═══════════════════════════════════════════════════════'));
  console.log(`${'Field'.padEnd(24)} ${'Profil LAMA (Mukoddas)'.padEnd(30)} ${'Profil BARU (Sultan)'.padEnd(30)}`);
  console.log('─'.repeat(86));

  for (const key of keys) {
    if (SKIP.has(key)) continue;
    const oldVal = fmtVal(oldData[key]);
    const newVal = fmtVal(newData[key]);
    const isDiff = JSON.stringify(oldData[key]) !== JSON.stringify(newData[key]);
    const marker = isDiff ? yellow('◀') : gray(' ');
    console.log(`${marker} ${key.padEnd(23)} ${oldVal.padEnd(38)} ${newVal.padEnd(30)}`);
  }
  console.log('─'.repeat(86));
  console.log(yellow('◀ = ada perbedaan (akan dipulihkan dari profil lama)\n'));
}

const RECOVERABLE_FIELDS = [
  'name', 'username', 'phone', 'avatarUrl', 'joinedAt',
  'walletAddress', 'bmcBalance', 'stakedBalance',
  'isValidator', 'isAdmin', 'role',
  'kycStatus', 'kycVerifiedAt', 'kycData',
  'bambooPassportId', 'passportId',
  'checkinStreak', 'lastCheckinDate',
  'bioText', 'statusText',
  'claimedReferrals', 'referredBy',
  'securitySettings',
  'transactions', 'notifications',
];

function buildRestorePayload(oldData, newData) {
  const payload = {};
  for (const field of RECOVERABLE_FIELDS) {
    if (oldData[field] !== undefined) {
      if (field === 'bmcBalance' || field === 'stakedBalance') {
        payload[field] = Math.max(oldData[field] || 0, newData[field] || 0);
      } else if (field === 'transactions' || field === 'notifications') {
        const merged = [...(oldData[field] || []), ...(newData[field] || [])];
        const seen = new Set();
        payload[field] = merged.filter((item) => {
          if (!item?.id) return true;
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
      } else {
        payload[field] = oldData[field];
      }
    }
  }
  return payload;
}

async function handleRecovery(db, currentData) {
  console.log('\n' + bold('LANGKAH 2: Cari profil lama (Mukoddas Syuhada)'));
  console.log('─'.repeat(50));

  const searchTerm = await ask(
    'Cari profil lama berdasarkan apa?\n' +
    '  [1] Nama (misal: Mukoddas Syuhada)\n' +
    '  [2] Username lama\n' +
    '  [3] UID lama (dari Firebase Console/backup)\n' +
    '  [4] Scan SEMUA user (bisa lambat jika banyak data)\n' +
    'Pilihan [1]: '
  );

  const choice = searchTerm.trim() || '1';
  const usersRef = db.collection('users');
  let candidates = [];

  if (choice === '1') {
    const name = await ask('Masukkan nama yang dicari: ');
    console.log(`\n🔍 Mencari user dengan nama mengandung "${name}"...`);
    const snap = await usersRef.get();
    snap.forEach((d) => {
      const data = d.data();
      if ((data.name || '').toLowerCase().includes(name.toLowerCase())) {
        candidates.push({ id: d.id, ...data });
      }
    });
  } else if (choice === '2') {
    const uname = await ask('Masukkan username lama: ');
    console.log(`\n🔍 Mencari user dengan username: "${uname}"...`);
    const snap = await usersRef.where('username', '==', uname.trim()).get();
    snap.forEach((d) => candidates.push({ id: d.id, ...d.data() }));
    if (snap.empty) {
      const all = await usersRef.get();
      all.forEach((d) => {
        const data = d.data();
        if ((data.username || '').toLowerCase().includes(uname.toLowerCase())) {
          candidates.push({ id: d.id, ...data });
        }
      });
    }
  } else if (choice === '3') {
    const uid = await ask('Masukkan UID lama: ');
    const doc = await usersRef.doc(uid.trim()).get();
    if (doc.exists) candidates.push({ id: doc.id, ...doc.data() });
  } else if (choice === '4') {
    console.log('\n🔍 Memuat semua user... (harap tunggu)');
    const snap = await usersRef.get();
    snap.forEach((d) => {
      if (d.id !== currentData.id) candidates.push({ id: d.id, ...d.data() });
    });
    console.log(`📋 Total ${candidates.length} user lain ditemukan:`);
    candidates.forEach((u, i) => {
      console.log(`  [${i + 1}] ${u.name || '(tanpa nama)'}  |  @${u.username || '-'}  |  UID: ${u.id}`);
    });
    const pick = await ask('\nMasukkan nomor user yang merupakan profil lama: ');
    const pickIdx = parseInt(pick) - 1;
    if (isNaN(pickIdx) || pickIdx < 0 || pickIdx >= candidates.length) {
      console.log(red('Pilihan tidak valid.')); return;
    }
    candidates = [candidates[pickIdx]];
  }

  candidates = candidates.filter((c) => c.id !== currentData.id);

  if (candidates.length === 0) {
    console.log(red('\n❌ Tidak ada profil lama yang ditemukan.'));
    console.log(yellow('💡 Kemungkinan dokumen Firestore sudah terhapus permanen.\n'));
    await showManualRestoreGuide(db, currentData);
    return;
  }

  let oldData;
  if (candidates.length === 1) {
    oldData = candidates[0];
    console.log(green(`\n✅ Profil lama ditemukan: ${oldData.name} (${oldData.username})`));
    console.log(`   UID lama: ${cyan(oldData.id)}`);
  } else {
    console.log(`\n📋 Ditemukan ${candidates.length} kandidat:`);
    candidates.forEach((c, i) => {
      console.log(`  [${i + 1}] ${c.name || '-'}  |  @${c.username || '-'}  |  uid: ${c.id}  |  KYC: ${c.kycStatus || '-'}  |  BMC: ${c.bmcBalance || 0}`);
    });
    const pick = await ask('Pilih nomor profil lama yang benar: ');
    const idx = parseInt(pick) - 1;
    if (isNaN(idx) || idx < 0 || idx >= candidates.length) {
      console.log(red('Pilihan tidak valid.')); return;
    }
    oldData = candidates[idx];
  }

  console.log('\n' + bold('LANGKAH 3: Perbandingan Data'));
  showDiff(oldData, currentData);

  const payload = buildRestorePayload(oldData, currentData);

  console.log(bold('\nField yang akan DIPULIHKAN ke akun aktif:'));
  for (const [k, v] of Object.entries(payload)) {
    if (k === 'transactions' || k === 'notifications') {
      console.log(`  ${green('✔')} ${k}: ${cyan(`${v.length} item (digabung)`)}`);
    } else {
      console.log(`  ${green('✔')} ${k}: ${cyan(fmtVal(v))}`);
    }
  }

  console.log('\n' + bold('LANGKAH 4: Konfirmasi Pemulihan'));
  console.log('─'.repeat(50));
  console.log(`Akun TARGET (akan diupdate): ${cyan(currentData.id)} — ${currentData.name}`);
  console.log(`Sumber data (profil lama)  : ${cyan(oldData.id)} — ${oldData.name}`);
  console.log(yellow('\n⚠️  Operasi ini akan MENIMPA field-field di atas pada akun target.'));
  console.log(yellow('   Akun lama (sumber) TIDAK akan dihapus — hanya dibaca.\n'));

  const confirm = await ask('Lanjutkan pemulihan? (ketik "YA" untuk konfirmasi): ');
  if (confirm.trim().toUpperCase() !== 'YA') {
    console.log(yellow('\nPemulihan dibatalkan oleh pengguna.')); return;
  }

  console.log('\n⏳ Memulihkan data...');
  try {
    await db.collection('users').doc(currentData.id).update(payload);
    console.log(green('\n✅ PEMULIHAN BERHASIL!'));
    console.log(`   Data profil Mukoddas Syuhada berhasil dipulihkan ke akun ${cyan(currentData.id)}.`);
    console.log(green('   Minta user untuk logout lalu login kembali di browser.\n'));

    const archiveOld = await ask(`Tandai akun lama (${oldData.id}) sebagai "archived"? (YA/tidak): `);
    if (archiveOld.trim().toUpperCase() === 'YA') {
      await db.collection('users').doc(oldData.id).update({
        _archived: true,
        _archivedAt: new Date().toISOString(),
        _archivedNote: `Profil dipindahkan ke UID: ${currentData.id}`,
      });
      console.log(green(`✅ Akun lama (${oldData.id}) sudah ditandai sebagai archived.`));
    }
  } catch (err) {
    console.error(red(`\n❌ Gagal memperbarui Firestore: ${err.message}`));
    console.log(yellow('💡 Pastikan FIREBASE_PRIVATE_KEY memiliki izin write ke Firestore.'));
  }
}

async function showManualRestoreGuide(db, currentData) {
  console.log(bold('\n═══════════════════════════════════════════════════════'));
  console.log(bold('  PANDUAN PEMULIHAN MANUAL (dokumen lama tidak ada)'));
  console.log(bold('═══════════════════════════════════════════════════════'));
  console.log(`
Langkah alternatif:
  1. Buka https://console.firebase.google.com/project/bamboochain-official/firestore
  2. Koleksi: users — cari "Mukoddas" secara visual
  3. Atau cek Firebase Auth untuk melihat UID asli pengguna

`);

  const doManual = await ask('Isi field penting secara manual sekarang? (YA/tidak): ');
  if (doManual.trim().toUpperCase() !== 'YA') return;

  const manualData = {};
  const fields = [
    { key: 'name',            label: 'Nama lengkap (mis: Mukoddas Syuhada)' },
    { key: 'username',        label: 'Username lama' },
    { key: 'bmcBalance',      label: 'Saldo BMC (angka, mis: 150.5)', parse: parseFloat },
    { key: 'stakedBalance',   label: 'Saldo Staked BMC (angka)',      parse: parseFloat },
    { key: 'isValidator',     label: 'Status Validator? (true/false)' },
    { key: 'isAdmin',         label: 'Status Admin? (true/false)' },
    { key: 'kycStatus',       label: 'Status KYC (verified/pending/unsubmitted)' },
    { key: 'walletAddress',   label: 'Wallet Address (0x...)' },
    { key: 'bambooPassportId',label: 'Bamboo Passport ID' },
    { key: 'bioText',         label: 'Bio singkat' },
  ];

  console.log('\nIsikan nilai (tekan Enter untuk lewati):');
  for (const f of fields) {
    const val = await ask(`  ${f.label}: `);
    if (val.trim()) {
      if (f.parse) {
        const parsed = f.parse(val.trim());
        if (!isNaN(parsed)) manualData[f.key] = parsed;
      } else if (val.trim() === 'true' || val.trim() === 'false') {
        manualData[f.key] = val.trim() === 'true';
      } else {
        manualData[f.key] = val.trim();
      }
    }
  }

  if (Object.keys(manualData).length === 0) {
    console.log(yellow('\nTidak ada data yang diisi.')); return;
  }

  console.log('\n' + bold('Data yang akan diupdate:'));
  for (const [k, v] of Object.entries(manualData)) {
    console.log(`  ${green('✔')} ${k}: ${cyan(String(v))}`);
  }

  const confirm = await ask('\nLanjutkan update manual? (ketik "YA"): ');
  if (confirm.trim().toUpperCase() !== 'YA') { console.log(yellow('Dibatalkan.')); return; }

  try {
    await db.collection('users').doc(currentData.id).update(manualData);
    console.log(green('\n✅ Update manual berhasil! Minta user untuk re-login.'));
  } catch (err) {
    console.error(red(`\n❌ Gagal: ${err.message}`));
  }
}

async function main() {
  console.log('\n' + bold(cyan('╔══════════════════════════════════════════════╗')));
  console.log(bold(cyan('║   TOOL PEMULIHAN AKUN BAMBOOCHAIN v1.0       ║')));
  console.log(bold(cyan('╚══════════════════════════════════════════════╝\n')));

  let app;
  try { app = initAdmin(); } catch (err) {
    console.error(red(err.message)); rl.close(); process.exit(1);
  }

  const db = admin.firestore();

  console.log(bold('LANGKAH 1: Identifikasi akun yang perlu dipulihkan'));
  console.log('─'.repeat(50));

  const targetEmail = await ask('Masukkan email akun saat ini (yang sudah reset ke Sultan): ');

  console.log(`\n🔍 Mencari akun dengan email: ${cyan(targetEmail)}...`);
  const usersRef = db.collection('users');
  const targetSnap = await usersRef.where('email', '==', targetEmail).get();

  if (targetSnap.empty) {
    console.log(red(`\n❌ Tidak ada user ditemukan dengan email: ${targetEmail}`));
    const manualUid = await ask('   Masukkan UID Firebase secara manual (dari Firebase Console): ');
    if (!manualUid.trim()) { console.log(red('UID kosong.')); rl.close(); return; }
    const manualDoc = await db.collection('users').doc(manualUid.trim()).get();
    if (!manualDoc.exists) { console.log(red(`❌ Dokumen users/${manualUid} tidak ada.`)); rl.close(); return; }
    await handleRecovery(db, { id: manualDoc.id, ...manualDoc.data() });
  } else {
    const doc = targetSnap.docs[0];
    const currentData = { id: doc.id, ...doc.data() };
    console.log(green(`\n✅ Akun ditemukan: ${currentData.name} (${currentData.username})`));
    console.log(`   UID: ${cyan(currentData.id)}`);
    await handleRecovery(db, currentData);
  }

  rl.close();
}

main().catch((err) => {
  console.error(red(`\n💥 Error: ${err.message}`));
  rl.close();
  process.exit(1);
});
