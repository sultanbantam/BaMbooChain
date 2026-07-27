import express from 'express';
import webpush from 'web-push';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const VAPID_KEYS_FILE = './vapidKeys.json';
let vapidKeys;

// Load or generate VAPID keys
if (fs.existsSync(VAPID_KEYS_FILE)) {
  vapidKeys = JSON.parse(fs.readFileSync(VAPID_KEYS_FILE, 'utf8'));
  console.log('VAPID Keys loaded from file.');
} else {
  vapidKeys = webpush.generateVAPIDKeys();
  fs.writeFileSync(VAPID_KEYS_FILE, JSON.stringify(vapidKeys, null, 2));
  console.log('New VAPID Keys generated and saved.');
}

console.log('Public Key:', vapidKeys.publicKey);

// Konfigurasi Web Push
webpush.setVapidDetails(
  'mailto:admin@bamboochain.id',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Memory storage untuk langganan (subscriptions)
// Harusnya menggunakan database agar persisten
let subscriptions = [];

app.get('/api/vapid-public-key', (req, res) => {
  res.send(vapidKeys.publicKey);
});

app.post('/api/subscribe', (req, res) => {
  const subscription = req.body;
  // Cek apakah sudah ada
  const isDuplicate = subscriptions.some(sub => sub.endpoint === subscription.endpoint);
  
  if (!isDuplicate) {
    subscriptions.push(subscription);
    console.log(`Langganan baru ditambahkan! Total: ${subscriptions.length}`);
  }
  
  res.status(201).json({});
});

app.post('/api/send-notification', async (req, res) => {
  const notificationPayload = {
    title: req.body.title || 'BaMbooChain PWA',
    body: req.body.body || 'Notifikasi dari server',
    icon: '/logos/bmc.png',
    data: { url: req.body.url || 'https://www.bamboochain.id' }
  };

  console.log(`Mengirim notifikasi ke ${subscriptions.length} perangkat...`);
  
  const promises = subscriptions.map((subscription, index) => {
    return webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
      .catch((err) => {
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.log('Subscription kadaluarsa atau tidak valid, menghapus dari daftar.');
          subscriptions[index] = null; // Mark for removal
        } else {
          console.error('Error saat mengirim push:', err);
        }
      });
  });

  await Promise.all(promises);
  // Bersihkan yang tidak valid
  subscriptions = subscriptions.filter(sub => sub !== null);
  
  res.status(200).json({ message: 'Notifikasi berhasil dikirim.' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Push server berjalan di port ${PORT}`);
});
