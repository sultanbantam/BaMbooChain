# BOOMBOOM — GREEN COMMUNITY MOBILITY MODULE

## Architecture & Implementation Overview

BOOMBOOM is a native digital mobility module integrated into the BaMbooChain React + Vite web ecosystem. It connects passengers, local drivers, regional operating partners (BUMDes, Koperasi Merah Putih, BUMD, Pokdarwis, Kasepuhan Adat), and community ecosystems.

### 1. Route Specifications
All pages are loaded using `React.lazy` and `lazyWithRetry` dynamic imports for optimal code splitting:

- `/boomboom` — Main Landing Page, Mobile-first Booking Card & Phased Roadmap
- `/boomboom/book` — Passenger Booking System, Geospatial Matching Engine & Payment Sandbox
- `/boomboom/driver` — Driver Registration Application ("Jadi Pengemudi BoomBoom") with `ngopi.top` Integration
- `/boomboom/driver/dashboard` — Driver Workspace (Online/Offline status, Live GPS Heartbeat, earnings, incoming trip matching)
- `/boomboom/operator` — Local Operator / Mitra Wilayah Registration (BUMDes, Koperasi Merah Putih, BUMD, Desa, Komunitas)
- `/boomboom/operator/dashboard` — Regional Operator Dashboard (Real-time Verification, Drivers, Financials, CSV export)
- `/boomboom/trips` — Passenger Trip History & Financial Receipts
- `/boomboom/rewards` — BMC Token Reward Ledger & Green Trip Score ("Estimasi Dampak Mobilitas")
- `/boomboom/safety` — BoomSafe Hub & Emergency SOS Signal Center
- `/boomboom/help` — Accessibility & FAQs Center (Indonesian first, elderly friendly)
- `/boomboom/admin` — Central Admin Controls, Real-time Audit Logs (`boomboom_audit_logs`), Fare Engine Configuration, and Feature Flags (`BOOMBOOM_PILOT_ENABLED`)

---

### 2. Phased Implementation Status
- **Tahap I (UI/Prototype & Field Pilot Awal) — SELESAI 100%**:
  - 11 Rute responsif, modal wajib GPS (`LocationPermissionModal.jsx`), peta Leaflet OpenStreetMap (`MapViewComponent.jsx`), geocoding & kalkulasi jarak jalan raya nyata (`geoService.js`), dan notifikasi `ngopi.top` / WhatsApp.
- **Tahap II (Backend Pilot) — SELESAI & AKTIF**:
  - Integrasi autentikasi riil (`AuthContext`) untuk Penumpang, Pengemudi, dan Operator Wilayah.
  - Verifikasi pengemudi & operator secara real-time di Firestore (`boomboom_driver_profiles`, `boomboom_operator_profiles`).
  - Geospatial Matching Engine (`findBestMatchingDriver`) & Live GPS Heartbeat saat pengemudi berstatus `ONLINE (SIAP NARIK)`.
  - Server-validated Fare Calculation & Payment Sandbox (`boomboom_payments` + `/api/payment/midtrans-charge` + Simulator QRIS Interaktif).
  - Klaim Reward BMC tervalidasi ke Firestore (`boomboom_rewards`), pencatatan insiden SOS (`boomboom_incidents`), notifikasi in-app real-time, serta Buku Besar Audit Keamanan (`boomboom_audit_logs`).
