# BOOMBOOM — GREEN COMMUNITY MOBILITY MODULE

## Architecture & Implementation Overview

BOOMBOOM is a native digital mobility module integrated into the BaMbooChain React + Vite web ecosystem. It connects passengers, local drivers, regional operating partners (BUMDes, Koperasi, Pokdarwis), and community ecosystems.

### 1. Route Specifications
All pages are loaded using `React.lazy` and `lazyWithRetry` dynamic imports for optimal code splitting:

- `/boomboom` — Main Landing Page & Mobile-first Booking Card
- `/boomboom/book` — Passenger Booking System & Simulated Real-time Tracking
- `/boomboom/driver` — Driver Registration Application ("Jadi Pengemudi BoomBoom")
- `/boomboom/driver/dashboard` — Driver Workspace (Online/Offline status, earnings, incoming trip matching)
- `/boomboom/operator` — Local Operator / Mitra Wilayah Registration
- `/boomboom/operator/dashboard` — Regional Operator Dashboard (Verification, Drivers, Financials, CSV export)
- `/boomboom/trips` — Passenger Trip History & Financial Receipts
- `/boomboom/rewards` — BMC Token Reward Ledger & Green Trip Score ("Estimasi Dampak Mobilitas")
- `/boomboom/safety` — BoomSafe Hub & Emergency SOS Signal Center
- `/boomboom/help` — Accessibility & FAQs Center (Indonesian first, elderly friendly)
- `/boomboom/admin` — Central Admin Controls, Fare Engine Configuration, and Feature Flags (`BOOMBOOM_PILOT_ENABLED`)

---

### 2. Core Architecture & Services

- `src/services/boomboom/fareEngine.js`: Configurable fare calculation & revenue distribution (85% Driver, 5% Regional Partner/BUMDes, 10% Platform & Insurance).
- `src/services/boomboom/rewardEngine.js`: Ledger creation for BMC Utility Rewards & Green Trip Score calculator (labeled "Estimasi Dampak Mobilitas").
- `src/services/boomboom/mapAdapter.js`: Geospatial provider abstraction layer supporting Google Maps, Mapbox, and OpenStreetMap.
- `src/services/boomboom/boomboomStore.js`: Zustand reactive state management store.
- `src/services/boomboom/mockData.js`: Datasets for pilot regions (Cibarani, Cisadane, Garut, Lembang), drivers, operators, trips, and incidents.

---

### 3. Data Collections Schema
- `boomboom_driver_profiles`
- `boomboom_operator_profiles`
- `boomboom_trips`
- `boomboom_payments`
- `boomboom_rewards`
- `boomboom_ratings`
- `boomboom_incidents`

---

### 4. Pilot Feature Flags
Feature flag management:
```javascript
export const INITIAL_FEATURE_FLAGS = {
  BOOMBOOM_PILOT_ENABLED: true,
  ENABLE_EV_REWARDS: true,
  ENABLE_COMMUNITY_CARPOOL: true,
  ENABLE_REALTIME_MAP: true,
  FUTURE_BOOM_SEND: false,
  FUTURE_BOOM_TOUR: false,
  FUTURE_BOOM_VILLAGE: false,
  FUTURE_BOOM_CARE: false
};
```
