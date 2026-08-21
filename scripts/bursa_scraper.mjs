import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fetch from "node-fetch";

// Konfigurasi Firebase dari file .env klien (karena kita tidak menggunakan Admin SDK)
// Pastikan Firebase Rules Anda mengizinkan penulisan ke dokumen bursa (atau login dulu)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyA9LcSM4BdF9jCeyzAMMO3aCXnfq11V4iE",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "bamboochain-official.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "bamboochain-official",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "bamboochain-official.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "969704302314",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:969704302314:web:78083a2d6718c8aa23d993"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data base untuk mensimulasikan pasar
const BASE_PRICES = {
  "market_bursa_betung": 12500,
  "market_bursa_wulung": 9800,
  "market_bursa_tali": 7200,
  "market_bursa_plywood": 85000,
  "market_bursa_vinegar": 45000,
  "market_bursa_charcoal": 125000,
  "market_bursa_briquette": 150000,
  "Bibit Bambu": 15000,
};

async function scrapeMarketData() {
  console.log(`[${new Date().toISOString()}] Mengambil data pasar global terbaru...`);
  
  // Dalam skenario dunia nyata, kita akan melakukan 'fetch' ke API WorldBank/Alibaba
  // const response = await fetch('https://api.tradingeconomics.com/commodities/lumber?c=guest:guest');
  // const data = await response.json();
  
  // Simulasi algoritma intelijen: Fluktuasi berdasarkan tren pasar dunia
  const marketTrend = (Math.random() - 0.5) * 500; // Makro tren global
  
  const bursaData = Object.keys(BASE_PRICES).map(key => {
    const microTrend = (Math.random() - 0.5) * 200;
    const finalChange = marketTrend + microTrend;
    const newPrice = Math.max(1000, Math.round(BASE_PRICES[key] + finalChange));
    const percentage = ((newPrice - BASE_PRICES[key]) / BASE_PRICES[key] * 100);
    
    // Simpan harga baru sebagai base untuk iterasi berikutnya jika diinginkan
    BASE_PRICES[key] = newPrice;
    
    return {
      typeKey: key,
      price: newPrice,
      trend: `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`,
      up: percentage >= 0
    };
  });

  try {
    // Sinkronisasi ke Firestore
    await setDoc(doc(db, "marketplace_bursa", "live_feed"), {
      updatedAt: new Date().toISOString(),
      data: bursaData
    });
    console.log(`[SUCCESS] Data Bursa berhasil dikirim ke server (Firestore).`);
  } catch (error) {
    console.error(`[ERROR] Gagal mengirim data ke server. Pastikan Firestore rules Anda mengizinkan penulisan tanpa autentikasi, atau ubah script untuk login menggunakan kredensial yang tepat:\n`, error.message);
  }
}

// Jalankan setiap 15 detik untuk demonstrasi
setInterval(scrapeMarketData, 15000);
scrapeMarketData();
console.log("Memulai Bursa Bambu Scraper Daemon...");
