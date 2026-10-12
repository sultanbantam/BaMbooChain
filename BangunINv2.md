\`\`\`markdown  
\# prompt.md — BangunIn Application Development (v2.0)  
\# Untuk dijalankan dengan AI Agent: Antigravity / Claude Code / Cursor / Windsurf  
\# Stack: Next.js 14 \+ TypeScript \+ Tailwind \+ Supabase \+ tRPC \+ Vercel  
\# Revisi: Integrasi insight diskusi \+ koreksi (E-Toll BTN, Kopdes Merah Putih, BMW)

\---

\#\# 0\. AGENT ROLE & MISSION

You are a \*\*Senior Full-Stack Engineer & Product Architect\*\*.    
Build \*\*BangunIn\*\* — ekosistem digital perumahan MBR & komunitas hijau — production-ready, deployable, clean architecture.

\*\*Deliverable:\*\* Monorepo dengan:  
\- Web app (5 role dashboards: Warga, Developer, Bank BTN, Pengelola Kawasan, Super Admin)  
\- Mobile PWA (installable, offline-first)  
\- REST \+ tRPC API  
\- Supabase backend (Postgres \+ Auth \+ Storage \+ Realtime)  
\- Integration stubs: BTN Core Banking, E-Toll BTN, Kopdes Merah Putih, IoT, Blockchain  
\- Dokumentasi lengkap, testing, deployment

\*\*Execution Mode:\*\* Autonomous. Commit per phase. Report progress.

\---

\#\# 1\. PRODUCT OVERVIEW (v2.0)

BangunIn adalah \*\*ekosistem digital 5 pilar\*\* untuk MBR Indonesia:

| Pilar | Fungsi |  
|---|---|  
| \*\*1. Database\*\* | 3 sub-DB: Developer, Konsumen, Pemerintah |  
| \*\*2. Konfigurator & KPR\*\* | Desain rumah, simulasi KPR, appraisal, BI checking |  
| \*\*3. Monitoring\*\* | Progress real-time, kontrol BMW, jaminan pembangunan |  
| \*\*4. Living Community\*\* | Shuttle, bank sampah, urban farming, kesejahteraan |  
| \*\*5. Dashboard Multi-Role\*\* | 5 role dengan akses berbeda |

\#\#\# 1.1 Koreksi Penting (v2.0)  
\- ❌ BNB → ✅ \*\*BMW (Biaya, Mutu, Waktu)\*\*  
\- ✅ \*\*E-Toll BTN\*\* digunakan warga → simbiosis mutualisme BTN ↔ Warga (income harian BTN)  
\- ✅ \*\*Logistik kerja sama Kopdes Merah Putih\*\* → dukungan program pemerintah

\#\#\# 1.2 Target Users (7 Roles)  
| Role | Deskripsi |  
|---|---|  
| \`CONSUMER\` | Warga / Pembeli MBR |  
| \`DEVELOPER\` | Developer properti |  
| \`BANK\_OFFICER\` | Petugas BTN (verifikasi, pencairan) |  
| \`PROPERTY\_MANAGER\` | Pengelola kawasan |  
| \`SHUTTLE\_DRIVER\` | Driver shuttle/logistik |  
| \`WASTE\_COLLECTOR\` | Petugas bank sampah |  
| \`SUPER\_ADMIN\` | Admin BangunIn |

\#\#\# 1.3 Government Partnership  
\- \*\*Kopdes Merah Putih\*\* — belanja sembako, logistik warga  
\- \*\*Posyandu\*\* — kesehatan warga  
\- \*\*Program 3 Juta Rumah\*\* — dukungan data & monitoring  
\- \*\*Bank Sampah Nasional\*\* — integrasi pelaporan

\---

\#\# 2\. TECH STACK

\#\#\# Frontend  
\- Next.js 14 (App Router) \+ TypeScript strict  
\- Tailwind CSS \+ shadcn/ui  
\- Zustand \+ TanStack Query  
\- React Hook Form \+ Zod  
\- Recharts, Mapbox GL JS  
\- next-pwa, next-intl (ID default)

\#\#\# Backend  
\- tRPC v11 \+ Next.js Route Handlers  
\- PostgreSQL 15 (Supabase)  
\- Drizzle ORM  
\- Supabase Auth (email \+ OTP \+ Google)  
\- Supabase Realtime \+ Storage  
\- Inngest (jobs: reminder H-7, pickup sampah)  
\- @react-pdf/renderer (laporan)  
\- Resend (email), Web Push \+ FCM

\#\#\# Infrastructure  
\- Vercel \+ Supabase  
\- Sentry, Vercel Analytics  
\- Vitest \+ Playwright  
\- GitHub Actions  
\- Docker (local)

\#\#\# Integrations (Stubs)  
\- \*\*BTN Core Banking\*\* — KPR, pencairan  
\- \*\*E-Toll BTN\*\* — pembayaran shuttle/logistik (income harian BTN)  
\- \*\*Kopdes Merah Putih\*\* — belanja sembako, logistik  
\- \*\*IoT Hub\*\* — MQTT bridge (sensor)  
\- \*\*Blockchain\*\* — Polygon (progress verification)  
\- \*\*Web3\*\* — wallet connect  
\- \*\*Bank Sampah\*\* — integrasi  
\- \*\*Midtrans/Xendit\*\* — DP payment  
\- \*\*BI Checking\*\* — API stub

\---

\#\# 3\. PROJECT STRUCTURE

\`\`\`

bangunin/  
├── apps/  
│   ├── web/                    \# Next.js web app  
│   │   ├── app/  
│   │   │   ├── (auth)/  
│   │   │   ├── (consumer)/  
│   │   │   │   ├── dashboard/  
│   │   │   │   ├── database/  
│   │   │   │   ├── configurator/  
│   │   │   │   ├── monitoring/  
│   │   │   │   └── living/  
│   │   │   ├── (developer)/  
│   │   │   ├── (bank)/  
│   │   │   ├── (manager)/  
│   │   │   ├── (admin)/  
│   │   │   └── api/  
│   │   └── components/  
│   └── mobile/                 \# PWA  
│  
├── packages/  
│   ├── db/                     \# Drizzle schema \+ migrations  
│   ├── api/                    \# tRPC routers  
│   ├── ui/                     \# shadcn components  
│   ├── auth/  
│   ├── integrations/  
│   │   ├── btn-core/  
│   │   ├── btn-etoll/          \# E-Toll BTN  
│   │   ├── kopdes-merah-putih/ \# Kopdes Merah Putih  
│   │   ├── iot/  
│   │   ├── bi-checking/  
│   │   ├── bank-sampah/  
│   │   └── payment/  
│   ├── blockchain/  
│   └── config/  
│  
├── docs/  
├── docker-compose.yml  
├── turbo.json  
└── README.md

\`\`\`

\---

\#\# 4\. DATABASE SCHEMA (Drizzle \+ Postgres)

\#\#\# 4.1 Users & Auth  
\`\`\`ts  
users (id, email, phone, full\_name, role, avatar\_url, kyc\_status, created\_at)  
user\_profiles (user\_id, nik, npwp, address, occupation, income\_range)  
sessions (id, user\_id, token, expires\_at)  
\`\`\`

4.2 Database — Developer

\`\`\`ts  
projects (  
  id, developer\_id, name, description, address, city, province,  
  latitude, longitude, status, \-- 'PLANNED' | 'CONSTRUCTION' | 'COMPLETED'  
  permit\_status, permit\_number, total\_units, available\_units,  
  price\_min, price\_max, cover\_image\_url, gallery\_urls,  
  created\_at, updated\_at  
)

units (  
  id, project\_id, block, number, type,  
  \-- 'BLOCKBAMBOO' | 'RISHAM' | 'HYBRID' | 'POSTMODERN' | 'MINIMALIS' | 'TROPIS'  
  land\_area, building\_area, floors, bedrooms, bathrooms,  
  price, status, layout\_json, created\_at  
)  
\`\`\`

4.3 Database — Konsumen

\`\`\`ts  
configurations (  
  id, user\_id, unit\_id, model\_type, design\_style,  
  floors, rooms\_json, material\_options\_json,  
  estimated\_price, estimated\_duration\_days,  
  kpr\_simulation\_json,  
  appraisal\_status, appraisal\_notes,  
  bi\_checking\_status, bi\_checking\_score,  
  status, \-- 'DRAFT' | 'SUBMITTED' | 'APPROVED'  
  created\_at  
)

kpr\_applications (  
  id, configuration\_id, user\_id, bank\_id, amount, tenor\_months,  
  interest\_rate, monthly\_installment,  
  status, \-- 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'DISBURSED'  
  submitted\_at, approved\_at, notes  
)  
\`\`\`

4.4 Database — Pemerintah

\`\`\`ts  
government\_reports (  
  id, project\_id, report\_type, \-- 'PERMIT' | 'TAX' | 'STATISTIC'  
  data\_json, period, submitted\_at  
)

permit\_records (  
  id, project\_id, permit\_type, \-- 'IMB' | 'SLF' | 'AMDAL'  
  number, issued\_at, expires\_at, status  
)  
\`\`\`

4.5 Monitoring & BMW

\`\`\`ts  
construction\_milestones (  
  id, unit\_id, name, \-- 'FOUNDATION' | 'WALLS' | 'ROOF' | 'INTERIOR' | 'HANDOVER'  
  order\_index, status, started\_at, completed\_at  
)

progress\_updates (  
  id, milestone\_id, developer\_id, photo\_urls, video\_url,  
  latitude, longitude, geotag\_verified, timestamp, notes,  
  verified\_by, verified\_at, blockchain\_tx\_hash  
)

bmw\_tracking (  
  id, unit\_id, category, \-- 'BIAYA' | 'MUTU' | 'WAKTU'  
  target\_value, actual\_value, deviation\_percent,  
  status, \-- 'ON\_TRACK' | 'WARNING' | 'CRITICAL'  
  notes, updated\_at  
)

progress\_verifications (  
  id, progress\_update\_id, bank\_officer\_id,  
  status, notes, verified\_at  
)

warranty\_claims (  
  id, unit\_id, user\_id, title, description, photo\_urls,  
  status, \-- 'SUBMITTED' | 'IN\_REVIEW' | 'IN\_PROGRESS' | 'RESOLVED'  
  developer\_response, sla\_deadline, resolved\_at  
)  
\`\`\`

4.6 Living — Shuttle & Logistik

\`\`\`ts  
shuttle\_services (  
  id, project\_id, type,  
  \-- 'SCHOOL' | 'WORK' | 'GOODS' | 'EMERGENCY' | 'MEDICAL' | 'MOVING' | 'AMBULANCE'  
  name, description, schedule\_json, price, is\_free,  
  partner\_org, \-- e.g., 'Masjid Al-Ikhlas', 'Yayasan Yatim'  
  is\_active  
)

shuttle\_bookings (  
  id, user\_id, service\_id, pickup\_location, dropoff\_location,  
  scheduled\_at, status, driver\_id, notes,  
  etoll\_used, etoll\_amount, created\_at  
)  
\`\`\`

4.7 Living — E-Toll BTN

\`\`\`ts  
etoll\_transactions (  
  id, user\_id, booking\_id, amount, etoll\_card\_number,  
  status, \-- 'PENDING' | 'SUCCESS' | 'FAILED'  
  btn\_commission, \-- income harian BTN  
  created\_at, settled\_at  
)  
\`\`\`

4.8 Living — Kopdes Merah Putih

\`\`\`ts  
kopdes\_products (  
  id, kopdes\_id, name, category, price, stock, image\_url, is\_active  
)

kopdes\_orders (  
  id, user\_id, kopdes\_id, items\_json, total\_amount,  
  delivery\_type, \-- 'PICKUP' | 'DELIVERY'  
  shuttle\_booking\_id, status, created\_at  
)

kopdes\_partners (  
  id, name, address, village, contact, is\_active  
)  
\`\`\`

4.9 Living — Bank Sampah

\`\`\`ts  
waste\_schedules (  
  id, project\_id, waste\_type, \-- 'ORGANIC' | 'INORGANIC' | 'B3'  
  day\_of\_week, time\_slot, is\_active  
)

waste\_pickups (  
  id, user\_id, schedule\_id, waste\_type, estimated\_weight\_kg,  
  status, collector\_id, photo\_url, picked\_up\_at, notes  
)

waste\_rewards (id, user\_id, pickup\_id, points\_earned, created\_at)

waste\_processing (  
  id, pickup\_id, process\_type, \-- 'COMPOST' | 'MAGGOT' | 'RECYCLE'  
  output\_product, output\_quantity, output\_unit  
)  
\`\`\`

4.10 Living — Urban Farming

\`\`\`ts  
urban\_farming\_plots (  
  id, project\_id, user\_id, plot\_number, size\_sqm,  
  crop\_type, status, \-- 'EMPTY' | 'PLANTED' | 'HARVEST'  
  planted\_at, harvested\_at  
)

farming\_activities (  
  id, plot\_id, activity\_type, \-- 'PLANT' | 'WATER' | 'FERTILIZE' | 'HARVEST'  
  notes, photo\_url, points\_earned, created\_at  
)  
\`\`\`

4.11 Living — Posyandu

\`\`\`ts  
posyandu\_schedules (  
  id, project\_id, date, services\_json, \-- \['IMMUNIZATION', 'CHECKUP', 'STUNTING'\]  
  location, is\_active  
)

posyandu\_registrations (  
  id, schedule\_id, user\_id, family\_member, status, created\_at  
)  
\`\`\`

4.12 Living — Used Goods

\`\`\`ts  
used\_goods (  
  id, user\_id, title, description, category, condition,  
  photo\_urls, ai\_estimated\_price, user\_price,  
  status, \-- 'LISTED' | 'SOLD' | 'DONATED' | 'PENDING\_PICKUP'  
  listing\_type, \-- 'SELL' | 'DONATE' | 'EXCHANGE'  
  buyer\_id, pickup\_scheduled\_at, created\_at  
)  
\`\`\`

4.13 Living — Gamifikasi

\`\`\`ts  
user\_points (user\_id, total\_points, level, updated\_at)

point\_transactions (  
  id, user\_id, points, type, \-- 'EARN' | 'REDEEM' | 'PENALTY'  
  source, \-- 'CHECKIN' | 'WASTE\_SORT' | 'EVENT' | 'URBAN\_FARM' | 'REFERRAL' | 'PENALTY\_LATE'  
  reference\_id, description, created\_at  
)

rewards\_catalog (id, name, description, points\_cost, stock, category, is\_active)

reward\_redemptions (  
  id, user\_id, reward\_id, points\_spent, status, redeemed\_at  
)

token\_subsidies (  
  id, user\_id, token\_type, \-- 'PANGAN' | 'TRANSPORT' | 'UTILITIES'  
  amount, source\_points, redeemed\_at, expires\_at  
)  
\`\`\`

4.14 Living — Events

\`\`\`ts  
events (  
  id, project\_id, title, description, category,  
  \-- 'GOTONG\_ROYONG' | 'TRAINING' | 'BAZAAR' | 'HEALTH' | 'NATIONAL' | 'URBAN\_FARM'  
  start\_at, end\_at, location, max\_participants,  
  banner\_url, points\_reward, is\_active  
)

event\_registrations (  
  id, event\_id, user\_id, status, registered\_at, attended\_at  
)  
\`\`\`

4.15 IoT

\`\`\`ts  
iot\_devices (  
  id, unit\_id, device\_type,  
  \-- 'ENERGY' | 'WATER' | 'AIR\_QUALITY' | 'WASTE\_CAPACITY'  
  device\_id, firmware\_version, is\_active, installed\_at  
)

iot\_readings (id, device\_id, metric, value, unit, recorded\_at)  
\`\`\`

4.16 Blockchain

\`\`\`ts  
blockchain\_transactions (  
  id, reference\_type, \-- 'PROGRESS' | 'GOODS' | 'CONTRACT'  
  reference\_id, tx\_hash, network, block\_number,  
  status, created\_at  
)  
\`\`\`

4.17 Notification & Audit

\`\`\`ts  
notifications (  
  id, user\_id, type, title, body, data\_json,  
  is\_read, created\_at  
)

audit\_logs (  
  id, user\_id, action, entity, entity\_id, changes\_json,  
  ip\_address, user\_agent, created\_at  
)  
\`\`\`

\---

5\. FEATURES PER ROLE

5.1 CONSUMER (Warga / Pembeli MBR)

A. Database

· Browse 3 sub-DB: Developer, Konsumen, Pemerintah  
· Filter: city, price, status, developer, unit type, permit status  
· Map view \+ grid view  
· Project detail: gallery, units, developer, permit  
· Bookmark projects

B. Konfigurator & KPR

· Pilih unit → pilih model: BlockBamboo, Risham, Hybrid, Postmodern, Minimalis, Tropis  
· Customize: floors, bedrooms, bathrooms, materials  
· Real-time price estimation  
· Appraisal integration: "Desain divalidasi appraisal. Risiko: Rendah."  
· BI Checking: input KTP → cek BI checking → status "Lancar"  
· KPR simulation (tenor, bunga FLPP 5% fixed, cicilan)  
· Submit KPR application  
· Digital contract signing  
· DP payment (Midtrans/Xendit)

C. Monitoring

· Timeline milestone: Fondasi, Dinding, Atap, Interior, Handover  
· Kontrol BMW:  
  · Biaya: realisasi vs RAB, % serapan  
  · Mutu: checklist kualitas, foto detail  
  · Waktu: timeline, deviasi jadwal  
· Foto/video \+ geotag \+ timestamp  
· Map view progres  
· Download PDF report  
· Chat dengan developer  
· Jaminan Pembangunan: form laporan kerusakan masa pemeliharaan  
· Notifikasi progres

D. Living Community

· Shuttle:  
  · Sekolah, kerja, logistik, pindahan, ambulans (GRATIS)  
  · Booking & tracking real-time  
  · Bayar dengan E-Toll BTN (simbiosis BTN-Warga)  
· Belanja Sembako (Kopdes Merah Putih):  
  · Browse produk Kopdes  
  · Order \+ delivery via shuttle  
· Bank Sampah:  
  · Jadwal: Senin-Kamis (organik), anorganik, B3  
  · Konfirmasi pickup, tracking, poin  
· Urban Farming:  
  · Daftar plot, tanam, rawat, panen  
  · Kompos, Maggot, Polybag  
· Posyandu:  
  · Jadwal, registrasi, reminder  
· Used Goods:  
  · List barang, AI taksir harga  
  · Jual/donasi/tukar  
· Gamifikasi:  
  · Check-in harian  
  · Poin → token subsidi (pangan, transport, utilities)  
  · Leaderboard warga  
  · Redeem rewards  
· Events:  
  · 17 Agustus, Posyandu, Urban Farming Workshop  
  · Register, QR check-in, foto recap

E. Dashboard Warga

· Ringkasan: progres rumah, poin, tagihan IPL, cicilan  
· Alarm H-7 jatuh tempo (via WA \+ notifikasi)  
· Quick actions: check-in, bayar IPL, booking shuttle

\---

5.2 DEVELOPER

· Manage projects (CRUD)  
· Upload progress updates (photo \+ geotag \+ timestamp)  
· Manage units (availability, price)  
· BMW dashboard: monitoring Biaya, Mutu, Waktu  
· Respond to consumer chats  
· Handle warranty claims  
· View analytics (views, leads, sales)  
· Export reports

\---

5.3 BANK OFFICER (BTN)

· List pending verifications  
· Review progress updates (photo, geotag, timestamp)  
· Approve/reject with notes → trigger KPR disbursement (stub)  
· BMW verification: cek deviasi Biaya, Mutu, Waktu  
· E-Toll monitoring: lihat transaksi E-Toll warga, komisi BTN  
· BI Checking dashboard  
· Audit trail  
· Analytics KPR

\---

5.4 PROPERTY MANAGER (Pengelola Kawasan)

Dashboard KPI:

· Total sampah terolah (kg/bulan)  
· Armada shuttle aktif (unit)  
· Penumpang (orang/hari)  
· Kepatuhan IPL (%)  
· Tagihan listrik, air, telepon  
· Event aktif

Fitur:

· Manage shuttle services & drivers  
· Manage waste schedules & collectors  
· Manage events  
· Manage urban farming plots  
· Manage posyandu schedules  
· Broadcast announcements  
· Alarm H-7 jatuh tempo: notifikasi otomatis ke warga (WA \+ app)  
· View resident analytics

\---

5.5 SUPER ADMIN

· User management (semua role)  
· Project moderation  
· Analytics (DAU, MAU, GMV, KPR volume)  
· Audit logs  
· Feature flags  
· Broadcast notifications  
· Government reports: export data untuk pemerintah  
· Kopdes Merah Putih management  
· E-Toll BTN reconciliation

\---

6\. INTEGRATION STUBS

6.1 BTN Core Banking

\`\`\`ts  
// packages/integrations/btn-core/client.ts  
export interface BTNClient {  
  submitKPR(application: KPRApplication): Promise\<KPRResponse\>;  
  verifyProgress(progressId: string): Promise\<VerificationResult\>;  
  disburse(applicationId: string, amount: number): Promise\<Disbursement\>;  
}  
export class BTNClientStub implements BTNClient { /\* mock \*/ }  
\`\`\`

6.2 E-Toll BTN (BARU)

\`\`\`ts  
// packages/integrations/btn-etoll/client.ts  
export interface ETTollBTNClient {  
  processPayment(userId: string, bookingId: string, amount: number): Promise\<ETollPayment\>;  
  getTransactions(userId: string, from: Date, to: Date): Promise\<ETollTransaction\[\]\>;  
  calculateCommission(amount: number): number; // income harian BTN  
  topUp(cardNumber: string, amount: number): Promise\<TopUpResult\>;  
}  
export class ETTollBTNClientStub implements ETTollBTNClient { /\* mock \*/ }  
\`\`\`

6.3 Kopdes Merah Putih (BARU)

\`\`\`ts  
// packages/integrations/kopdes-merah-putih/client.ts  
export interface KopdesMerahPutihClient {  
  listProducts(kopdesId: string): Promise\<Product\[\]\>;  
  createOrder(userId: string, items: OrderItem\[\]): Promise\<Order\>;  
  getOrderStatus(orderId: string): Promise\<OrderStatus\>;  
  scheduleDelivery(orderId: string, shuttleBookingId: string): Promise\<void\>;  
}  
export class KopdesMerahPutihClientStub implements KopdesMerahPutihClient { /\* mock \*/ }  
\`\`\`

6.4 BI Checking

\`\`\`ts  
// packages/integrations/bi-checking/client.ts  
export interface BICheckingClient {  
  check(nik: string): Promise\<BICheckingResult\>; // { score, status: 'LANCAR' | 'DPK' | 'MACET' }  
}  
\`\`\`

6.5 IoT Hub

\`\`\`ts  
// packages/integrations/iot/bridge.ts  
export interface IoTBridge {  
  ingestReading(deviceId: string, metric: string, value: number): Promise\<void\>;  
  getReadings(deviceId: string, from: Date, to: Date): Promise\<Reading\[\]\>;  
}  
\`\`\`

6.6 Blockchain

\`\`\`solidity  
// packages/blockchain/contracts/ProgressVerification.sol  
// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.20;  
contract ProgressVerification {  
  mapping(bytes32 \=\> ProgressRecord) public records;  
  function recordProgress(bytes32 id, bytes32 hash, uint256 timestamp) external;  
  function verify(bytes32 id, bytes32 hash) external view returns (bool);  
}  
\`\`\`

6.7 Payment Gateway

\`\`\`ts  
// packages/integrations/payment/midtrans.ts  
// createTransaction, handleWebhook, verifySignature  
\`\`\`

6.8 Bank Sampah

\`\`\`ts  
// packages/integrations/bank-sampah/client.ts  
export interface BankSampahClient {  
  recordPickup(userId: string, wasteType: string, weight: number): Promise\<PickupResult\>;  
  getRewards(userId: string): Promise\<Reward\[\]\>;  
}  
\`\`\`

\---

7\. API DESIGN (tRPC Routers)

\`\`\`ts  
// auth.ts  
auth.register, auth.login, auth.logout, auth.me, auth.updateProfile

// projects.ts  
projects.list, projects.getById, projects.create, projects.update,  
projects.search, projects.nearby, projects.stats

// units.ts  
units.listByProject, units.getById, units.create, units.update

// configurator.ts  
configurator.create, configurator.update, configurator.getById,  
configurator.estimatePrice, configurator.simulateKPR,  
configurator.requestAppraisal, configurator.checkBI

// kpr.ts  
kpr.apply, kpr.listMine, kpr.getById, kpr.approve, kpr.reject, kpr.disburse

// monitoring.ts  
monitoring.getMilestones, monitoring.uploadProgress,  
monitoring.verifyProgress, monitoring.getProgressReport,  
monitoring.getBMW, monitoring.subscribeToUpdates,  
monitoring.submitWarrantyClaim, monitoring.trackWarrantyClaim

// chat.ts  
chat.getThreads, chat.getMessages, chat.sendMessage, chat.markRead

// shuttle.ts  
shuttle.listServices, shuttle.book, shuttle.cancel,  
shuttle.getMyBookings, shuttle.trackDriver, shuttle.rate

// etoll.ts (BARU)  
etoll.processPayment, etoll.getTransactions,  
etoll.topUp, etoll.getCommission

// kopdes.ts (BARU)  
kopdes.listProducts, kopdes.createOrder, kopdes.getOrderStatus,  
kopdes.scheduleDelivery

// waste.ts  
waste.getSchedule, waste.confirmPickup, waste.getMyPickups,  
waste.getStats, waste.getPoints, waste.getProcessing

// urbanFarming.ts (BARU)  
urbanFarming.listPlots, urbanFarming.registerPlot,  
urbanFarming.logActivity, urbanFarming.harvest

// posyandu.ts (BARU)  
posyandu.listSchedules, posyandu.register, posyandu.cancel

// goods.ts  
goods.list, goods.create, goods.estimatePrice, goods.update,  
goods.markSold, goods.schedulePickup, goods.donate

// gamification.ts  
gamification.checkIn, gamification.getPoints, gamification.getLeaderboard,  
gamification.listRewards, gamification.redeemReward,  
gamification.getTokenSubsidies, gamification.redeemToken

// events.ts  
events.list, events.getById, events.register, events.cancel,  
events.checkIn, events.getMyEvents

// notifications.ts  
notifications.list, notifications.markRead, notifications.markAllRead

// admin.ts  
admin.listUsers, admin.updateRole, admin.getAnalytics, admin.auditLogs,  
admin.exportGovernmentReport, admin.manageKopdes, admin.reconcileEtoll  
\`\`\`

\---

8\. SECURITY & COMPLIANCE

· Supabase RLS on all tables  
· RBAC via middleware  
· Rate limiting (Upstash)  
· Zod validation on all mutations  
· CSRF protection  
· HTTPS only, secure cookies  
· Encrypt NIK, NPWP (pgcrypto)  
· Audit log critical actions  
· UU PDP compliance (data export & delete)  
· Content moderation for used goods  
· Geotag verification (exif check)  
· Blockchain hash for progress  
· Anti-fraud for gamification (cooldown, IP check)  
· E-Toll transaction reconciliation

\---

9\. UI/UX GUIDELINES

· Colors: \#005BAA, \#E31E24, \#2E7D32, \#FFFFFF, \#E6F0FA, \#333333  
· Fonts: Montserrat (headings), Inter (body)  
· Responsive: mobile 375px, tablet 768px, desktop 1280px  
· Accessibility: WCAG 2.1 AA, contrast ≥ 4.5:1, ARIA, keyboard nav  
· Language: ID default, EN optional  
· Mobile-first PWA with bottom navigation  
· Alarm H-7 visual cues (yellow/red badges)

\---

10\. TESTING

· Unit tests (Vitest) — 80% coverage on packages/api  
· Integration tests — tRPC routers  
· E2E tests (Playwright):  
  · Register → Configure → Appraisal → BI → KPR → Monitoring  
  · Developer upload → Bank verify → Disburse  
  · Warga book shuttle → pay E-Toll → tracking  
  · Warga order Kopdes → delivery via shuttle  
  · Warga confirm waste pickup → points  
  · Warga check-in → redeem token subsidi  
  · Manager view BMW dashboard  
· Load tests (k6) — API endpoints

\---

11\. DEPLOYMENT

Environment Variables

\`\`\`env  
\# Supabase  
NEXT\_PUBLIC\_SUPABASE\_URL=  
NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=  
SUPABASE\_SERVICE\_ROLE\_KEY=

\# Auth  
NEXTAUTH\_SECRET=  
NEXTAUTH\_URL=

\# Integrations  
BTN\_CORE\_API\_URL=  
BTN\_CORE\_API\_KEY=  
BTN\_ETOLL\_API\_URL=  
BTN\_ETOLL\_API\_KEY=  
KOPDES\_MERAH\_PUTIH\_API\_URL=  
KOPDES\_MERAH\_PUTIH\_API\_KEY=  
BI\_CHECKING\_API\_URL=  
BI\_CHECKING\_API\_KEY=  
IOT\_MQTT\_BROKER\_URL=  
BLOCKCHAIN\_RPC\_URL=  
BLOCKCHAIN\_PRIVATE\_KEY=  
BANK\_SAMPAH\_API\_URL=  
MIDTRANS\_SERVER\_KEY=  
RESEND\_API\_KEY=  
MAPBOX\_TOKEN=

\# Monitoring  
SENTRY\_DSN=  
\`\`\`

CI/CD (GitHub Actions)

· Lint \+ type-check  
· Unit tests  
· E2E tests  
· Build  
· Deploy to Vercel  
· Run DB migrations

\---

12\. DOCUMENTATION

· README.md — Setup, run, deploy  
· docs/ARCHITECTURE.md — System design \+ diagrams  
· docs/API.md — tRPC routers  
· docs/DATABASE.md — ERD \+ tables  
· docs/DEPLOYMENT.md — Step-by-step  
· docs/ROADMAP.md — MVP → V2  
· docs/CONTRIBUTING.md — Dev workflow  
· docs/SECURITY.md — Security posture  
· docs/INTEGRATIONS.md — BTN, E-Toll, Kopdes, IoT, Blockchain

\---

13\. EXECUTION PHASES

Phase 1 — Foundation (Hari 1\)

· Init monorepo (Turborepo \+ pnpm)  
· Setup Next.js \+ Tailwind \+ shadcn/ui  
· Setup Supabase \+ Drizzle \+ tRPC  
· Deploy skeleton ke Vercel

Phase 2 — Database 3 Sub-DB (Hari 2–3)

· Schema semua tabel  
· Migrations \+ seed data (3 projects, 30 units, 10 users)  
· Database UI (developer, konsumen, pemerintah)

Phase 3 — Konfigurator & KPR (Hari 4–5)

· Configurator UI (6 model desain)  
· Appraisal \+ BI Checking stub  
· KPR simulation \+ application  
· Digital contract \+ DP payment

Phase 4 — Monitoring & BMW (Hari 6–7)

· Developer upload flow  
· Bank verification flow  
· BMW dashboard (Biaya, Mutu, Waktu)  
· Jaminan pembangunan  
· PDF report  
· Realtime updates

Phase 5 — Living (Hari 8–10)

· Shuttle booking \+ tracking  
· E-Toll BTN integration stub  
· Kopdes Merah Putih stub  
· Bank Sampah  
· Urban Farming  
· Posyandu  
· Used Goods  
· Gamifikasi (check-in, poin, token subsidi)  
· Events

Phase 6 — Dashboard Multi-Role (Hari 11–12)

· Consumer, Developer, Bank, Manager, Admin  
· Manager dashboard dengan KPI  
· Alarm H-7

Phase 7 — Integrations (Hari 13–14)

· BTN Core, E-Toll BTN, Kopdes Merah Putih  
· IoT, Blockchain, BI Checking, Bank Sampah  
· Payment gateway  
· Notifications (WA \+ push)

Phase 8 — Polish & Test (Hari 15–16)

· E2E tests  
· Accessibility audit  
· Performance optimization  
· PWA setup  
· Documentation

Phase 9 — Deploy & Demo (Hari 17\)

· Production deploy  
· Seed demo data  
· Record demo video  
· Pitch assets

\---

14\. SUCCESS CRITERIA

☐ 7 roles login & role-specific UI  
☐ Consumer: full journey (browse → config → appraisal → BI → KPR → monitor → live)  
☐ Developer: upload progress \+ handle warranty  
☐ Bank: verify \+ BMW check \+ E-Toll monitoring \+ disburse  
☐ Manager: shuttle, waste, urban farming, posyandu, events, IPL  
☐ Admin: analytics \+ government report \+ Kopdes management  
☐ E-Toll BTN integration works (simbiosis BTN-Warga)  
☐ Kopdes Merah Putih integration works  
☐ BMW dashboard works (Biaya, Mutu, Waktu)  
☐ Gamifikasi: check-in → points → token subsidi  
☐ PWA installable  
☐ E2E tests pass  
☐ Lighthouse ≥ 90  
☐ Deployed with demo data  
☐ Documentation complete

\---

15\. GUARDRAILS

· Never hardcode secrets  
· Never skip RLS  
· Never commit .env  
· Always write tests  
· Always TypeScript strict  
· Always validate with Zod  
· Always log critical actions  
· Always handle errors gracefully  
· Always Bahasa Indonesia for UI  
· Prefer server components  
· Prefer streaming & suspense  
· Prefer optimistic updates  
· Correct terminology: BMW (Biaya, Mutu, Waktu) — NOT BNB  
· E-Toll BTN \= simbiosis mutualisme BTN ↔ Warga  
· Logistik \= kerja sama Kopdes Merah Putih

\---

16\. FINAL REPORT FORMAT

\`\`\`  
✅ BangunIn Application v2.0 — Build Complete

📦 Monorepo:  
├── apps/web/          ✅ Next.js 14  
├── apps/mobile/       ✅ PWA  
├── packages/db/       ✅ Drizzle \+ migrations  
├── packages/api/      ✅ 20+ tRPC routers  
├── packages/ui/       ✅ shadcn  
├── packages/auth/     ✅ Supabase Auth  
├── packages/integrations/  
│   ├── btn-core/      ✅  
│   ├── btn-etoll/     ✅  
│   ├── kopdes-merah-putih/ ✅  
│   ├── bi-checking/   ✅  
│   ├── bank-sampah/   ✅  
│   ├── iot/           ✅  
│   └── payment/       ✅  
├── packages/blockchain/ ✅  
└── docs/              ✅ 9 docs

🗄️ Database: 45+ tables, RLS enabled  
🔌 API: 20 routers, 100+ procedures  
🎨 UI: 60+ components  
🧪 Tests: 150 unit \+ 20 E2E  
🚀 Deployed: https\://bangunin.vercel.app  
📱 PWA: installable  
📊 Lighthouse: 95/100/100/100

Key features delivered:  
✅ Database 3 sub-DB (Developer, Konsumen, Pemerintah)  
✅ Konfigurator 6 model (BlockBamboo, Risham, Hybrid, Postmodern, Minimalis, Tropis)  
✅ Appraisal \+ BI Checking  
✅ Monitoring BMW (Biaya, Mutu, Waktu)  
✅ Jaminan Pembangunan  
✅ Living: Shuttle, E-Toll BTN, Kopdes Merah Putih, Bank Sampah, Urban Farming, Posyandu, Used Goods, Gamifikasi, Events  
✅ Dashboard 5 role  
✅ Integrasi BTN Core, E-Toll BTN, Kopdes Merah Putih

Next steps:  
1\. Review docs/ARCHITECTURE.md  
2\. Run \`pnpm dev\`  
3\. Replace integration stubs with real credentials  
4\. Onboard first developer partner  
5\. Pilot di 1 perumahan MBR  
\`\`\`

\---

17\. START COMMAND

Execute now. Begin with Phase 1\.  
Work autonomously. Commit per phase: feat(phase-X): \<description\>.  
Report progress at end of each phase.

Key corrections to remember:

· ❌ BNB → ✅ BMW (Biaya, Mutu, Waktu)  
· ✅ E-Toll BTN \= simbiosis BTN ↔ Warga (income harian BTN)  
· ✅ Kopdes Merah Putih \= mitra logistik & sembako (program pemerintah)

\`\`\`

\---

\#\# Ringkasan Perubahan v2.0

| Item | Sebelum | Sesudah |  
|---|---|---|  
| \*\*BMW\*\* | BNB | \*\*BMW (Biaya, Mutu, Waktu)\*\* |  
| \*\*E-Toll\*\* | Tidak ada | \*\*E-Toll BTN\*\* — simbiosis BTN ↔ Warga |  
| \*\*Logistik\*\* | Umum | \*\*Kopdes Merah Putih\*\* — program pemerintah |  
| \*\*Database\*\* | 1 | \*\*3 sub-DB\*\* (Developer, Konsumen, Pemerintah) |  
| \*\*Konfigurator\*\* | 3 model | \*\*6 model\*\* (+ Postmodern, Minimalis, Tropis) |  
| \*\*Appraisal\*\* | Tidak ada | \*\*Integrasi appraisal \+ BI Checking\*\* |  
| \*\*Jaminan Pembangunan\*\* | Tidak ada | \*\*Warranty claim tracking\*\* |  
| \*\*Urban Farming\*\* | Tidak ada | \*\*Kompos, Maggot, Polybag\*\* |  
| \*\*Posyandu\*\* | Tidak ada | \*\*Jadwal \+ registrasi\*\* |  
| \*\*Token Subsidi\*\* | Tidak ada | \*\*Pangan, Transport, Utilities\*\* |  
| \*\*Alarm H-7\*\* | Tidak ada | \*\*Notifikasi WA otomatis\*\* |  
| \*\*Ambulans\*\* | Tidak ada | \*\*GRATIS, kerja sama masjid/yayasan\*\* |

\---

\*\*Prompt.md ini siap dijalankan.\*\* Simpan sebagai \`prompt.md\` di root folder project, lalu jalankan agent AI dengan perintah:

\`\`\`

Read prompt.md and execute Phase 1\.  
Build the full BangunIn monorepo autonomously.  
Commit after each phase. Report progress.

\`\`\`

Agent akan membangun aplikasi lengkap dengan semua fitur, integrasi, dan dokumentasi — siap deploy ke Vercel \+ Supabase.