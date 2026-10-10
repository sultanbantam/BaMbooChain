\`\`\`markdown  
\# prompt.md — BangunIn Application Development  
\# Untuk dijalankan dengan AI Agent: Antigravity / Claude Code / Cursor / Windsurf  
\# Versi: 1.0 | Target: Full-stack Web \+ Mobile PWA  
\# Stack: Next.js 14 \+ TypeScript \+ Tailwind \+ Supabase \+ tRPC \+ Vercel

\---

\#\# 0\. AGENT ROLE & MISSION

You are a \*\*Senior Full-Stack Engineer & Product Architect\*\*.    
Your mission: build \*\*BangunIn\*\* — a digital ecosystem for Indonesian MBR housing — from scratch, production-ready, deployable, with clean architecture.

\*\*Deliverable:\*\* Working monorepo with:  
\- Web app (consumer \+ developer \+ admin dashboards)  
\- Mobile PWA (installable, offline-first)  
\- REST \+ tRPC API  
\- Supabase backend (Postgres \+ Auth \+ Storage \+ Realtime)  
\- Integration stubs for BTN Core Banking, IoT, Blockchain  
\- Full documentation, tests, and deployment config

\*\*Execution Mode:\*\* Autonomous. Break into phases. Commit after each phase. Report progress.

\---

\#\# 1\. PRODUCT OVERVIEW

\#\#\# 1.1 What is BangunIn?  
A \*\*4-pillar digital ecosystem\*\* for MBR (Masyarakat Berpenghasilan Rendah) housing in Indonesia:

| Pillar | Function |  
|---|---|  
| \*\*Database\*\* | Verified housing data: planned, under construction, completed |  
| \*\*Configurator\*\* | Interactive house design \+ KPR simulation |  
| \*\*Monitoring\*\* | Real-time construction progress with geotag & timestamp |  
| \*\*Living\*\* | Post-occupancy services: shuttle, waste, goods, gamification, events |

\#\#\# 1.2 Target Users & Roles  
| Role | Description | Key Permissions |  
|---|---|---|  
| \`CONSUMER\` | MBR home buyer / resident | Browse, configure, buy, monitor, use Living services |  
| \`DEVELOPER\` | Property developer | Manage projects, upload progress, respond to chat |  
| \`BANK\_OFFICER\` | BTN officer | Verify progress, approve KPR disbursement |  
| \`PROPERTY\_MANAGER\` | Perumahan manager | Manage Living services (shuttle, waste, events) |  
| \`WASTE\_COLLECTOR\` | Petugas sampah | Confirm pickup, update status |  
| \`SHUTTLE\_DRIVER\` | Petugas antar jemput | Accept & complete trips |  
| \`ADMIN\` | BangunIn super admin | Manage all, analytics, moderation |

\#\#\# 1.3 Core User Journey  
\`\`\`

Register → Browse Database → Configure House → Apply KPR →   
Sign Digital Contract → Pay DP → Monitor Construction →   
Receive Keys → Live in Community → Use Living Services

\`\`\`

\---

\#\# 2\. TECH STACK (STRICT)

\#\#\# 2.1 Frontend  
\- \*\*Framework:\*\* Next.js 14 (App Router)  
\- \*\*Language:\*\* TypeScript 5.x (strict mode)  
\- \*\*Styling:\*\* Tailwind CSS 3.x \+ shadcn/ui  
\- \*\*State:\*\* Zustand \+ TanStack Query  
\- \*\*Forms:\*\* React Hook Form \+ Zod  
\- \*\*Charts:\*\* Recharts  
\- \*\*Maps:\*\* Mapbox GL JS / Leaflet  
\- \*\*PWA:\*\* next-pwa \+ Workbox  
\- \*\*i18n:\*\* next-intl (ID default, EN optional)

\#\#\# 2.2 Backend  
\- \*\*API:\*\* tRPC v11 \+ Next.js Route Handlers  
\- \*\*Database:\*\* PostgreSQL 15 (via Supabase)  
\- \*\*ORM:\*\* Drizzle ORM  
\- \*\*Auth:\*\* Supabase Auth (email \+ OTP \+ Google)  
\- \*\*Storage:\*\* Supabase Storage (photos, docs, PDFs)  
\- \*\*Realtime:\*\* Supabase Realtime (chat, progress updates)  
\- \*\*Jobs:\*\* Inngest / Trigger.dev (scheduled waste pickup, reminders)  
\- \*\*PDF:\*\* @react-pdf/renderer (laporan progres)  
\- \*\*Email:\*\* Resend  
\- \*\*Push:\*\* Web Push API \+ Firebase Cloud Messaging

\#\#\# 2.3 Infrastructure  
\- \*\*Hosting:\*\* Vercel (web) \+ Supabase (backend)  
\- \*\*CDN:\*\* Vercel Edge  
\- \*\*Monitoring:\*\* Sentry \+ Vercel Analytics  
\- \*\*Testing:\*\* Vitest \+ Playwright  
\- \*\*CI/CD:\*\* GitHub Actions  
\- \*\*Container:\*\* Docker (for local dev)

\#\#\# 2.4 Integrations (Stubs \+ Interfaces)  
\- \*\*BTN Core Banking:\*\* REST API stub (\`/api/integrations/btn/\*\`)  
\- \*\*IoT Hub:\*\* MQTT bridge stub (sensor data ingestion)  
\- \*\*Blockchain:\*\* Polygon/Ethereum smart contract stub (progress verification)  
\- \*\*Web3:\*\* Wallet connect stub (MetaMask, WalletConnect)  
\- \*\*Bank Sampah:\*\* REST integration stub  
\- \*\*Maps:\*\* Mapbox / Google Maps  
\- \*\*Payment:\*\* Midtrans / Xendit (DP payment)

\---

\#\# 3\. PROJECT STRUCTURE

\`\`\`

bangunin/  
├── apps/  
│   ├── web/                    \# Next.js web app  
│   │   ├── app/  
│   │   │   ├── (auth)/  
│   │   │   │   ├── login/  
│   │   │   │   └── register/  
│   │   │   ├── (consumer)/  
│   │   │   │   ├── dashboard/  
│   │   │   │   ├── database/  
│   │   │   │   ├── configurator/  
│   │   │   │   ├── monitoring/  
│   │   │   │   └── living/  
│   │   │   ├── (developer)/  
│   │   │   │   ├── projects/  
│   │   │   │   └── progress/  
│   │   │   ├── (bank)/  
│   │   │   │   └── verifications/  
│   │   │   ├── (manager)/  
│   │   │   │   ├── shuttle/  
│   │   │   │   ├── waste/  
│   │   │   │   └── events/  
│   │   │   ├── api/  
│   │   │   │   ├── trpc/\[trpc\]/route.ts  
│   │   │   │   ├── webhooks/  
│   │   │   │   ├── integrations/  
│   │   │   │   └── jobs/  
│   │   │   └── layout.tsx  
│   │   ├── components/  
│   │   ├── lib/  
│   │   └── public/  
│   │  
│   └── mobile/                 \# PWA (reuse web, separate manifest)  
│  
├── packages/  
│   ├── db/                     \# Drizzle schema \+ migrations  
│   │   ├── schema/  
│   │   └── migrations/  
│   ├── api/                    \# tRPC routers  
│   │   ├── routers/  
│   │   └── root.ts  
│   ├── ui/                     \# Shared shadcn components  
│   ├── auth/                   \# Auth helpers  
│   ├── integrations/           \# BTN, IoT, Blockchain stubs  
│   ├── blockchain/             \# Smart contract \+ ABI  
│   └── config/                 \# Shared configs (eslint, ts, tailwind)  
│  
├── docs/  
│   ├── ARCHITECTURE.md  
│   ├── API.md  
│   ├── DATABASE.md  
│   ├── DEPLOYMENT.md  
│   └── ROADMAP.md  
│  
├── docker-compose.yml  
├── turbo.json  
├── package.json  
└── README.md

\`\`\`

\*\*Monorepo tool:\*\* Turborepo \+ pnpm workspaces.

\---

\#\# 4\. DATABASE SCHEMA (Drizzle \+ Postgres)

Generate \`packages/db/schema/\*.ts\` with these tables:

\#\#\# 4.1 Users & Auth  
\`\`\`ts  
users (id, email, phone, full\_name, role, avatar\_url, kyc\_status, created\_at)  
user\_profiles (user\_id, nik, npwp, address, occupation, income\_range)  
sessions (id, user\_id, token, expires\_at)  
\`\`\`

4.2 Housing Database

\`\`\`ts  
projects (  
  id, developer\_id, name, description, address, city, province,  
  latitude, longitude, status, \-- 'PLANNED' | 'CONSTRUCTION' | 'COMPLETED'  
  permit\_status, \-- 'PENDING' | 'APPROVED' | 'REJECTED'  
  permit\_number, total\_units, available\_units, price\_min, price\_max,  
  cover\_image\_url, gallery\_urls, created\_at, updated\_at  
)

units (  
  id, project\_id, block, number, type, \-- 'BLOCKBAMBOO' | 'RISHAM' | 'HYBRID'  
  land\_area, building\_area, floors, bedrooms, bathrooms,  
  price, status, \-- 'AVAILABLE' | 'RESERVED' | 'SOLD'  
  layout\_json, created\_at  
)

project\_documents (id, project\_id, type, url, verified\_at)  
\`\`\`

4.3 Configurator

\`\`\`ts  
configurations (  
  id, user\_id, unit\_id, model\_type, floors, rooms\_json,  
  material\_options\_json, estimated\_price, estimated\_duration\_days,  
  kpr\_simulation\_json, status, \-- 'DRAFT' | 'SUBMITTED' | 'APPROVED'  
  created\_at  
)

kpr\_applications (  
  id, configuration\_id, user\_id, bank\_id, amount, tenor\_months,  
  interest\_rate, monthly\_installment, status, \-- 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'DISBURSED'  
  submitted\_at, approved\_at, notes  
)  
\`\`\`

4.4 Monitoring

\`\`\`ts  
construction\_milestones (  
  id, unit\_id, name, \-- 'FOUNDATION' | 'WALLS' | 'ROOF' | 'INTERIOR' | 'HANDOVER'  
  order\_index, status, \-- 'PENDING' | 'IN\_PROGRESS' | 'COMPLETED' | 'VERIFIED'  
  started\_at, completed\_at  
)

progress\_updates (  
  id, milestone\_id, developer\_id, photo\_urls, video\_url,  
  latitude, longitude, geotag\_verified, timestamp,  
  notes, verified\_by, verified\_at, blockchain\_tx\_hash  
)

progress\_verifications (  
  id, progress\_update\_id, bank\_officer\_id, status, \-- 'PENDING' | 'APPROVED' | 'REJECTED'  
  notes, verified\_at  
)  
\`\`\`

4.5 Living — Shuttle

\`\`\`ts  
shuttle\_services (  
  id, project\_id, type, \-- 'SCHOOL' | 'WORK' | 'GOODS' | 'EMERGENCY' | 'MEDICAL'  
  name, description, schedule\_json, price, is\_active  
)

shuttle\_bookings (  
  id, user\_id, service\_id, pickup\_location, dropoff\_location,  
  scheduled\_at, status, \-- 'PENDING' | 'CONFIRMED' | 'IN\_PROGRESS' | 'COMPLETED' | 'CANCELLED'  
  driver\_id, notes, created\_at  
)

shuttle\_drivers (id, user\_id, vehicle\_type, plate\_number, is\_available)  
\`\`\`

4.6 Living — Waste

\`\`\`ts  
waste\_schedules (  
  id, project\_id, waste\_type, \-- 'ORGANIC' | 'INORGANIC' | 'B3'  
  day\_of\_week, \-- 0-6  
  time\_slot, is\_active  
)

waste\_pickups (  
  id, user\_id, schedule\_id, waste\_type, estimated\_weight\_kg,  
  status, \-- 'SCHEDULED' | 'PICKED\_UP' | 'PROCESSED'  
  collector\_id, photo\_url, picked\_up\_at, notes  
)

waste\_rewards (  
  id, user\_id, pickup\_id, points\_earned, created\_at  
)  
\`\`\`

4.7 Living — Used Goods

\`\`\`ts  
used\_goods (  
  id, user\_id, title, description, category, condition,  
  photo\_urls, ai\_estimated\_price, user\_price,  
  status, \-- 'LISTED' | 'SOLD' | 'DONATED' | 'PENDING\_PICKUP'  
  listing\_type, \-- 'SELL' | 'DONATE' | 'EXCHANGE'  
  buyer\_id, pickup\_scheduled\_at, created\_at  
)

used\_goods\_transactions (  
  id, goods\_id, seller\_id, buyer\_id, amount, type,  
  status, completed\_at  
)  
\`\`\`

4.8 Living — Gamification

\`\`\`ts  
user\_points (user\_id, total\_points, level, updated\_at)

point\_transactions (  
  id, user\_id, points, type, \-- 'EARN' | 'REDEEM' | 'PENALTY'  
  source, \-- 'CHECKIN' | 'WASTE\_SORT' | 'EVENT' | 'REFERRAL' | 'PENALTY\_LATE'  
  reference\_id, description, created\_at  
)

rewards\_catalog (id, name, description, points\_cost, stock, is\_active)

reward\_redemptions (  
  id, user\_id, reward\_id, points\_spent, status, redeemed\_at  
)

user\_checkins (id, user\_id, checkin\_date, streak\_count, created\_at)

leaderboard\_snapshots (id, project\_id, period, top\_users\_json, created\_at)  
\`\`\`

4.9 Living — Events

\`\`\`ts  
events (  
  id, project\_id, title, description, category, \-- 'GOTONG\_ROYONG' | 'TRAINING' | 'BAZAAR' | 'HEALTH'  
  start\_at, end\_at, location, max\_participants,  
  banner\_url, points\_reward, is\_active  
)

event\_registrations (  
  id, event\_id, user\_id, status, \-- 'REGISTERED' | 'ATTENDED' | 'CANCELLED'  
  registered\_at, attended\_at  
)  
\`\`\`

4.10 Communication & Notifications

\`\`\`ts  
chat\_threads (id, unit\_id, consumer\_id, developer\_id, created\_at)  
chat\_messages (id, thread\_id, sender\_id, message, attachment\_url, created\_at)

notifications (  
  id, user\_id, type, title, body, data\_json,  
  is\_read, created\_at  
)

audit\_logs (  
  id, user\_id, action, entity, entity\_id, changes\_json,  
  ip\_address, user\_agent, created\_at  
)  
\`\`\`

4.11 Blockchain

\`\`\`ts  
blockchain\_transactions (  
  id, reference\_type, \-- 'PROGRESS' | 'GOODS' | 'CONTRACT'  
  reference\_id, tx\_hash, network, block\_number,  
  status, \-- 'PENDING' | 'CONFIRMED' | 'FAILED'  
  created\_at  
)  
\`\`\`

4.12 IoT

\`\`\`ts  
iot\_devices (  
  id, unit\_id, device\_type, \-- 'ENERGY' | 'WATER' | 'AIR\_QUALITY' | 'WASTE\_CAPACITY'  
  device\_id, firmware\_version, is\_active, installed\_at  
)

iot\_readings (  
  id, device\_id, metric, value, unit, recorded\_at  
)  
\`\`\`

\---

5\. FEATURES TO IMPLEMENT

5.1 Auth & Onboarding

☐ Register (email/phone \+ OTP)  
☐ Login (email \+ Google OAuth)  
☐ Role selection on first login  
☐ KYC upload (KTP, NPWP, selfie)  
☐ Profile management

5.2 Consumer — Housing Database

☐ Browse projects (grid \+ map view)  
☐ Filter: city, price range, status, developer, unit type  
☐ Project detail: gallery, units, permit status, developer info  
☐ Unit detail: layout, price, availability  
☐ Search with autocomplete  
☐ Save/bookmark projects

5.3 Consumer — Configurator

☐ Select unit → choose model (BlockBamboo, Risham, Hybrid)  
☐ Customize: floors, bedrooms, bathrooms, materials  
☐ Real-time price estimation  
☐ KPR simulation (tenor, interest, monthly installment)  
☐ Save configuration  
☐ Submit KPR application  
☐ Digital contract signing (e-signature stub)  
☐ DP payment (Midtrans/Xendit integration stub)

5.4 Consumer — Monitoring

☐ Timeline of milestones  
☐ Photo/video gallery per milestone  
☐ Map view with geotag  
☐ Progress percentage  
☐ Download PDF report  
☐ Chat with developer  
☐ Notifications on progress updates

5.5 Consumer — Living

☐ Shuttle Booking:  
  ☐ View available services (school, work, goods, emergency)  
  ☐ Book pickup (date, time, location)  
  ☐ Track driver in real-time  
  ☐ History & ratings  
☐ Waste Management:  
  ☐ View schedule (organic/inorganic/B3)  
  ☐ Confirm pickup  
  ☐ Track waste weight & points  
  ☐ Dashboard of personal waste stats  
☐ Used Goods:  
  ☐ List item (photo, description, condition)  
  ☐ AI price estimation  
  ☐ Choose: sell, donate, exchange  
  ☐ Browse marketplace  
  ☐ Schedule pickup  
  ☐ Transaction history  
☐ Gamification:  
  ☐ Daily check-in  
  ☐ Points dashboard  
  ☐ Leaderboard (per project)  
  ☐ Rewards catalog  
  ☐ Redeem rewards  
  ☐ Streak tracking  
  ☐ Penalty log (transparency)  
☐ Events:  
  ☐ Browse calendar  
  ☐ Register event  
  ☐ Add to personal calendar  
  ☐ QR check-in at event  
  ☐ Event photos & recap

5.6 Developer Dashboard

☐ Manage projects (CRUD)  
☐ Upload progress updates (photo \+ geotag \+ timestamp)  
☐ Manage units (availability, price)  
☐ Respond to consumer chats  
☐ View analytics (views, leads, sales)  
☐ Export reports

5.7 Bank Officer Dashboard

☐ List pending verifications  
☐ Review progress updates (photo, geotag, timestamp)  
☐ Approve/reject with notes  
☐ Trigger KPR disbursement (stub)  
☐ Audit trail

5.8 Property Manager Dashboard

☐ Manage shuttle services & drivers  
☐ Manage waste schedules & collectors  
☐ Manage events  
☐ Broadcast announcements  
☐ View resident analytics

5.9 Admin Dashboard

☐ User management  
☐ Project moderation  
☐ Analytics (DAU, MAU, GMV, KPR volume)  
☐ Audit logs  
☐ Feature flags  
☐ Broadcast notifications

\---

6\. API DESIGN (tRPC Routers)

Create routers in packages/api/routers/:

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
configurator.estimatePrice, configurator.simulateKPR

// kpr.ts  
kpr.apply, kpr.listMine, kpr.getById, kpr.approve, kpr.reject, kpr.disburse

// monitoring.ts  
monitoring.getMilestones, monitoring.uploadProgress,  
monitoring.verifyProgress, monitoring.getProgressReport,  
monitoring.subscribeToUpdates (realtime)

// chat.ts  
chat.getThreads, chat.getMessages, chat.sendMessage, chat.markRead

// shuttle.ts  
shuttle.listServices, shuttle.book, shuttle.cancel,  
shuttle.getMyBookings, shuttle.trackDriver, shuttle.rate

// waste.ts  
waste.getSchedule, waste.confirmPickup, waste.getMyPickups,  
waste.getStats, waste.getPoints

// goods.ts  
goods.list, goods.create, goods.estimatePrice, goods.update,  
goods.markSold, goods.schedulePickup, goods.donate

// gamification.ts  
gamification.checkIn, gamification.getPoints, gamification.getLeaderboard,  
gamification.listRewards, gamification.redeemReward, gamification.getHistory

// events.ts  
events.list, events.getById, events.register, events.cancel,  
events.checkIn, events.getMyEvents

// notifications.ts  
notifications.list, notifications.markRead, notifications.markAllRead

// admin.ts  
admin.listUsers, admin.updateRole, admin.getAnalytics, admin.auditLogs  
\`\`\`

Each router: Zod input validation, role-based authorization via middleware.

\---

7\. SECURITY & COMPLIANCE

☐ Supabase Row Level Security (RLS) on all tables  
☐ Role-based access control (RBAC) via middleware  
☐ Rate limiting on API routes (Upstash)  
☐ Input validation (Zod) on all mutations  
☐ CSRF protection (Next.js built-in)  
☐ HTTPS only, secure cookies  
☐ Encrypted sensitive fields (NIK, NPWP) — pgcrypto  
☐ Audit log for all critical actions  
☐ Data retention policy (UU PDP compliance)  
☐ GDPR/UU PDP: user data export & deletion  
☐ Content moderation for used goods listings  
☐ Geotag verification (exif check)  
☐ Blockchain hash verification for progress updates  
☐ Rate limit shuttle bookings & waste confirmations  
☐ Anti-fraud for gamification (check-in cooldown, IP check)

\---

8\. UI/UX GUIDELINES

8.1 Design System

· Colors: \#005BAA (primary), \#E31E24 (accent), \#2E7D32 (eco)  
· Fonts: Montserrat (headings), Inter (body)  
· Radii: 8px (cards), 999px (pills)  
· Shadows: subtle, 2-layer  
· Icons: Lucide React  
· Illustrations: custom SVG (house, community, eco)

8.2 Responsive Breakpoints

· Mobile: 375px (PWA priority)  
· Tablet: 768px  
· Desktop: 1280px  
· Wide: 1920px

8.3 Accessibility (WCAG 2.1 AA)

· Contrast ratio ≥ 4.5:1  
· Keyboard navigation  
· ARIA labels  
· Screen reader support  
· Focus states visible  
· Alt text for all images

8.4 Language

· Default: Bahasa Indonesia  
· Secondary: English  
· All user-facing strings in messages/id.json and messages/en.json

\---

9\. INTEGRATION STUBS

9.1 BTN Core Banking

File: packages/integrations/btn/client.ts

\`\`\`ts  
export interface BTNClient {  
  submitKPR(application: KPRApplication): Promise\<KPRResponse\>;  
  verifyProgress(progressId: string): Promise\<VerificationResult\>;  
  disburse(applicationId: string, amount: number): Promise\<Disbursement\>;  
}  
export class BTNClientStub implements BTNClient { /\* mock \*/ }  
\`\`\`

9.2 IoT Hub

File: packages/integrations/iot/bridge.ts

\`\`\`ts  
export interface IoTBridge {  
  ingestReading(deviceId: string, metric: string, value: number): Promise\<void\>;  
  getReadings(deviceId: string, from: Date, to: Date): Promise\<Reading\[\]\>;  
}  
\`\`\`

9.3 Blockchain

File: packages/blockchain/contracts/ProgressVerification.sol

\`\`\`solidity  
// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.20;  
contract ProgressVerification {  
  mapping(bytes32 \=\> ProgressRecord) public records;  
  function recordProgress(bytes32 id, bytes32 hash, uint256 timestamp) external;  
  function verify(bytes32 id, bytes32 hash) external view returns (bool);  
}  
\`\`\`

Plus ABI \+ viem client in packages/blockchain/client.ts.

9.4 Payment Gateway

File: packages/integrations/payment/midtrans.ts

· Create transaction  
· Handle webhook  
· Verify signature

\---

10\. TESTING

☐ Unit tests (Vitest) — 80% coverage on packages/api  
☐ Integration tests — tRPC routers  
☐ E2E tests (Playwright) — critical user journeys:  
  · Register → Configure → Apply KPR  
  · Developer uploads progress → Bank verifies  
  · Consumer books shuttle  
  · Consumer confirms waste pickup  
  · Consumer redeems reward  
☐ Load tests (k6) — API endpoints

\---

11\. DEPLOYMENT

11.1 Environment Variables

\`\`\`env  
\# Supabase  
NEXT\_PUBLIC\_SUPABASE\_URL=  
NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=  
SUPABASE\_SERVICE\_ROLE\_KEY=

\# Auth  
NEXTAUTH\_SECRET=  
NEXTAUTH\_URL=

\# Integrations  
BTN\_API\_URL=  
BTN\_API\_KEY=  
IOT\_MQTT\_BROKER\_URL=  
BLOCKCHAIN\_RPC\_URL=  
BLOCKCHAIN\_PRIVATE\_KEY=  
MIDTRANS\_SERVER\_KEY=  
RESEND\_API\_KEY=  
MAPBOX\_TOKEN=

\# Monitoring  
SENTRY\_DSN=  
\`\`\`

11.2 Vercel \+ Supabase

· Deploy web to Vercel  
· Run migrations via Supabase CLI  
· Configure RLS policies  
· Set up cron jobs (Inngest) for:  
  · Daily check-in reminders  
  · Waste pickup reminders  
  · Event notifications  
  · KPR disbursement checks

11.3 CI/CD (GitHub Actions)

\`\`\`yaml  
\- Lint \+ type-check  
\- Unit tests  
\- E2E tests (Playwright)  
\- Build  
\- Deploy to Vercel (preview → production)  
\- Run DB migrations  
\`\`\`

\---

12\. DOCUMENTATION TO GENERATE

· README.md — Setup, run, deploy  
· docs/ARCHITECTURE.md — System design, diagrams  
· docs/API.md — All tRPC routers \+ inputs/outputs  
· docs/DATABASE.md — ERD \+ table descriptions  
· docs/DEPLOYMENT.md — Step-by-step deploy  
· docs/ROADMAP.md — MVP → V2 features  
· docs/CONTRIBUTING.md — Dev workflow  
· docs/SECURITY.md — Security posture & compliance

\---

13\. EXECUTION PHASES

Phase 1 — Foundation (Day 1\)

· Init monorepo (Turborepo \+ pnpm)  
· Setup Next.js \+ Tailwind \+ shadcn/ui  
· Setup Supabase \+ Drizzle  
· Setup tRPC \+ auth  
· Deploy skeleton to Vercel

Phase 2 — Core Data (Day 2–3)

· Implement schema (all tables)  
· Run migrations  
· Seed sample data (3 projects, 30 units, 10 users)  
· Build Database pillar (browse, filter, detail)

Phase 3 — Configurator & KPR (Day 4–5)

· Build configurator UI  
· KPR simulation logic  
· Application submission flow  
· Digital contract stub  
· Payment stub

Phase 4 — Monitoring (Day 6–7)

· Developer upload flow  
· Bank verification flow  
· Consumer dashboard  
· PDF report generation  
· Realtime updates

Phase 5 — Living (Day 8–10)

· Shuttle booking \+ tracking  
· Waste scheduling \+ confirmation  
· Used goods marketplace \+ AI price stub  
· Gamification (check-in, points, rewards)  
· Events calendar

Phase 6 — Dashboards & Admin (Day 11–12)

· Developer dashboard  
· Bank dashboard  
· Manager dashboard  
· Admin dashboard

Phase 7 — Integrations (Day 13–14)

· BTN stub  
· IoT bridge stub  
· Blockchain stub  
· Payment gateway  
· Notifications

Phase 8 — Polish & Test (Day 15–16)

· E2E tests  
· Accessibility audit  
· Performance optimization  
· SEO \+ PWA setup  
· Documentation

Phase 9 — Deploy & Demo (Day 17\)

· Production deploy  
· Seed demo data  
· Record demo video  
· Prepare pitch assets

\---

14\. SUCCESS CRITERIA

☐ All 7 roles can log in and see role-specific UI  
☐ Consumer can complete full journey (browse → buy → monitor → live)  
☐ Developer can upload progress with geotag  
☐ Bank officer can verify & trigger disbursement stub  
☐ Manager can schedule shuttle, waste, events  
☐ Gamification works (check-in, points, redeem)  
☐ PWA installable on mobile  
☐ All E2E tests pass  
☐ Lighthouse score ≥ 90 (Performance, Accessibility, SEO)  
☐ Deployed to production with demo data  
☐ Documentation complete

\---

15\. GUARDRAILS

· Never hardcode secrets — use env vars  
· Never skip RLS policies  
· Never commit .env  
· Always write tests for new features  
· Always use TypeScript strict mode  
· Always validate inputs with Zod  
· Always log critical actions to audit\_logs  
· Always handle errors gracefully with user-friendly messages  
· Always write in Bahasa Indonesia for user-facing text  
· Prefer server components where possible  
· Prefer streaming & suspense for slow data  
· Prefer optimistic updates for UX

\---

16\. FINAL REPORT FORMAT

After completion, output:

\`\`\`  
✅ BangunIn Application — Build Complete

📦 Monorepo: bangunin/  
├── apps/web/          ✅ Next.js 14 app  
├── apps/mobile/       ✅ PWA  
├── packages/db/       ✅ Drizzle \+ migrations  
├── packages/api/      ✅ tRPC routers (15+)  
├── packages/ui/       ✅ shadcn components  
├── packages/auth/     ✅ Supabase Auth  
├── packages/integrations/ ✅ BTN, IoT, Payment stubs  
├── packages/blockchain/   ✅ Smart contract \+ ABI  
└── docs/              ✅ 7 docs

🗄️ Database: 40+ tables, RLS enabled  
🔌 API: 15 routers, 80+ procedures  
🎨 UI: 50+ components, responsive  
🧪 Tests: 120 unit \+ 15 E2E  
🚀 Deployed: https\://bangunin.vercel.app  
📱 PWA: installable, offline-first  
📊 Lighthouse: 95/100/100/100

Next steps:  
1\. Review docs/ARCHITECTURE.md  
2\. Run \`pnpm dev\` locally  
3\. Replace integration stubs with real credentials  
4\. Onboard first developer partner  
\`\`\`

\---

17\. START COMMAND

Execute now. Begin with Phase 1\.  
Do not ask for confirmation. Work autonomously.  
After each phase, commit with message: feat(phase-X): \<description\>.  
Report progress at the end of each phase.

\`\`\`

\---

\#\# Cara Menggunakan Prompt Ini

\*\*Dengan Antigravity / Claude Code / Cursor / Windsurf:\*\*

1\. Buat folder project baru, simpan kode di atas sebagai \`prompt.md\`.  
2\. Buka AI agent, jalankan:  
\`\`\`

Read prompt.md and execute Phase 1\.   
Build the full BangunIn monorepo autonomously.  
Commit after each phase. Report progress.

\`\`\`  
3\. Agent akan:  
   \- Init monorepo  
   \- Generate schema, API, UI  
   \- Build semua fitur (Database, Configurator, Monitoring, Living)  
   \- Testing & deploy  
   \- Report

\*\*Estimasi waktu (agent):\*\* 2–4 jam untuk MVP lengkap, tergantung model.

\*\*Output:\*\* Aplikasi web \+ PWA yang bisa langsung di-deploy ke Vercel \+ Supabase, siap demo untuk juri BTN Housingpreneur Batch 3\.

\*\*Catatan:\*\* Untuk integrasi BTN/IoT/Blockchain, agent akan generate \*\*stub\*\* dengan interface jelas — Anda tinggal ganti dengan credential asli saat production.