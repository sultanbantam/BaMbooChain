# BOOMBOOM — GREEN COMMUNITY MOBILITY
## Implementation Prompt for BaMbooChain Super App

### PROJECT CONTEXT

Existing project:
- BaMbooChain Super App
- Domain: bamboochain.id
- Existing frontend: React + Vite
- Existing authentication and user ecosystem must be reused.
- Existing modules include Bambupedia, Academy, Marketplace, Community, BaMbooChain, Project Ecosystem, Wallet/BMC, membership and other ecosystem utilities.

Build a new mobility module named:

# BOOMBOOM

Tagline:

> “Dari Desa, Menghubungkan Nusantara.”

Secondary message:

> “Bergerak Bersama, Menghidupkan Ekonomi Lokal.”

BOOMBOOM is a community-oriented digital mobility platform integrated into BaMbooChain. It connects passengers, local drivers, local operators/partners, communities and regional ecosystems.

This is NOT a standalone application at this stage.

It must be developed as a native module inside the existing BaMbooChain React/Vite project and reuse the existing:
- authentication;
- user profile;
- navigation;
- language system;
- wallet;
- BMC reward;
- notifications;
- design system;
- database configuration.

DO NOT break any existing BaMbooChain functionality.

---

# 1. ROUTE

Create main route:

/boomboom

Also support:

/boomboom/book
/boomboom/driver
/boomboom/driver/dashboard
/boomboom/operator
/boomboom/operator/dashboard
/boomboom/trips
/boomboom/rewards
/boomboom/safety
/boomboom/help

Use React.lazy dynamic imports for all BoomBoom pages.

---

# 2. USER ROLES

Support:

1. Passenger
2. Driver
3. Local Operator / Mitra Wilayah
4. Admin
5. Support Officer

A single BambooChain user may have more than one role.

Example:

User
+ Passenger
+ Driver

Do not create a separate authentication system.

---

# 3. CORE SERVICES

Initial MVP:

## BoomRide
Motorcycle ride.

## BoomCar
Car ride.

## BoomSchedule
Scheduled ride.

## BoomTogether
Shared/community ride.

Future modules should already be supported architecturally:

- BoomSend
- BoomTour
- BoomVillage
- BoomCare

Do not activate future modules until enabled through feature flags.

---

# 4. BOOMBOOM HOME PAGE

Create a mobile-first booking interface.

Hero:

BOOMBOOM

“Dari Desa, Menghubungkan Nusantara.”

Subtitle:

“Transportasi komunitas yang mudah, aman, transparan dan terhubung dengan ekosistem BaMbooChain.”

Primary booking card:

Lokasi Jemput
Tujuan

Service selection:
- BoomRide
- BoomCar

Buttons:

PESAN SEKARANG

JADWALKAN

Below hero display:

- estimated fare;
- estimated travel time;
- distance;
- nearby drivers.

---

# 5. MAP

Prepare map architecture using provider abstraction.

Support providers:

- Google Maps
- Mapbox
- OpenStreetMap

Never hardcode API keys.

Use environment variables.

Required map functions:

- current location;
- pickup pin;
- destination pin;
- routing;
- distance;
- ETA;
- nearby driver visualization;
- live driver tracking.

---

# 6. BOOKING FLOW

Flow:

Passenger
→ Enter pickup
→ Enter destination
→ Select BoomRide/BoomCar
→ Fare estimation
→ Confirm booking
→ Find nearby driver
→ Driver accepts
→ Driver arrives
→ Trip begins
→ Live tracking
→ Trip completed
→ Payment
→ Rating
→ Reward
→ Transaction record

Create status:

SEARCHING
DRIVER_ASSIGNED
DRIVER_ARRIVING
DRIVER_ARRIVED
ON_TRIP
COMPLETED
CANCELLED

---

# 7. DRIVER APPLICATION

Create “Jadi Pengemudi BoomBoom”.

Required fields:

- full name;
- BambooChain user ID;
- phone;
- email;
- identity number;
- driver licence type/number;
- vehicle type;
- licence plate;
- vehicle brand;
- vehicle year;
- operating area;
- bank/payment account;
- emergency contact;
- uploaded documents;
- profile photo;
- vehicle photo.

Application status:

DRAFT
SUBMITTED
UNDER_REVIEW
VERIFIED
REJECTED
SUSPENDED

Do not automatically activate a driver before verification.

---

# 8. DRIVER DASHBOARD

Display:

Online / Offline toggle

Today:
- earnings;
- trips;
- rating;
- online duration;
- BMC reward.

Features:

- incoming booking;
- accept;
- reject;
- navigation;
- trip history;
- earnings;
- wallet;
- reward;
- documents;
- support;
- emergency/SOS.

---

# 9. LOCAL OPERATOR / MITRA WILAYAH

BOOMBOOM uses a decentralized local operational model.

Eligible partner types:

- Desa;
- BUMDes;
- Cooperative;
- Community;
- Campus;
- Tourism organization;
- licensed business partner.

Operator dashboard must display:

- registered drivers;
- verified drivers;
- active drivers;
- total users;
- daily trips;
- monthly trips;
- transaction value;
- driver earnings;
- operator revenue;
- complaints;
- ratings;
- operating areas.

Operator capabilities:

- review driver application;
- local driver verification;
- monitor operations;
- review incidents;
- community promotion;
- reports;
- export financial report.

Critical admin actions must require central admin permission.

---

# 10. FARE ENGINE

Create configurable fare engine.

Fields:

base_fare
per_km
per_minute
minimum_fare
platform_fee
local_operator_fee
insurance_fee
payment_fee
surge_multiplier

Never hardcode revenue-share percentages.

All values must be configurable per region/service.

Display fare transparently before confirmation.

---

# 11. PAYMENTS

Primary settlement currency:

IDR / Rupiah.

Payment architecture must support licensed payment providers via adapters.

Possible payment types:

- QRIS;
- bank transfer;
- e-wallet;
- cash if enabled by region.

BMC MUST NOT be treated as Rupiah replacement or mandatory fare settlement.

BMC is a utility/reward mechanism inside the BaMbooChain ecosystem.

Never store sensitive payment credentials in frontend source code.

---

# 12. BMC REWARD INTEGRATION

Integrate existing BMC ecosystem.

Possible reward events:

- completed trip;
- first ride;
- daily mobility mission;
- shared ride;
- electric vehicle usage;
- verified driver contribution;
- community activity.

All reward amounts must be configurable.

Create reward ledger:

reward_id
user_id
trip_id
reward_type
bmc_amount
status
created_at
claimed_at

Do not directly change token balance from client-side JavaScript.

Reward approval/claim must go through a secure backend/API/Cloud Function.

---

# 13. GREEN MOBILITY

Create Green Trip Score.

Display optional metrics:

Distance
Vehicle type
Shared/non-shared
Estimated mobility impact
Green Points

Do NOT present estimated emissions or environmental benefits as verified carbon credits.

Label calculated numbers:

“Estimasi Dampak Mobilitas”

unless validated methodology exists.

---

# 14. BOOMSAFE

Safety is a core feature.

Implement UI and architecture for:

- verified driver;
- driver photo;
- vehicle photo;
- vehicle registration;
- real-time trip tracking;
- share trip;
- SOS button;
- emergency contact;
- route anomaly;
- rating;
- report;
- blocked user;
- trip history.

Create safety page:

/boomboom/safety

---

# 15. SOS

SOS action:

User presses SOS
→ confirmation
→ emergency event generated
→ trusted contact notified
→ location stored
→ operator/admin notified
→ incident ID created.

Do not trigger public emergency numbers automatically in MVP unless formally integrated.

---

# 16. DATA MODEL

Create collections/tables:

boomboom_driver_profiles

Fields:

driver_id
user_id
status
vehicle_type
vehicle_brand
vehicle_model
vehicle_year
plate_number
license_number
operating_region
rating
completed_trips
created_at
updated_at

---

boomboom_operator_profiles

operator_id
name
type
region
legal_entity
contact
status
created_at

---

boomboom_trips

trip_id
passenger_id
driver_id
operator_id
service_type
pickup_lat
pickup_lng
pickup_address
destination_lat
destination_lng
destination_address
distance_km
estimated_duration
estimated_fare
final_fare
trip_status
payment_status
created_at
accepted_at
started_at
completed_at

---

boomboom_payments

payment_id
trip_id
user_id
amount
currency
payment_method
provider
status
created_at
paid_at

---

boomboom_rewards

reward_id
user_id
trip_id
reward_type
bmc_amount
status
created_at

---

boomboom_ratings

rating_id
trip_id
from_user
to_user
score
comment
created_at

---

boomboom_incidents

incident_id
trip_id
user_id
type
description
latitude
longitude
status
created_at
resolved_at

---

# 17. PROJECT ECOSYSTEM INTEGRATION

Allow BoomBoom to support projects inside BambooChain Project Ecosystem.

Example:

Tourism project
→ transportation requirement
→ enable BoomBoom service zone
→ local drivers registered
→ project dashboard shows mobility statistics.

Create optional relation:

project_id

inside trips/operator regions.

---

# 18. KODIBA INTEGRATION

Prepare optional integration between BoomBoom drivers/operators and KODIBA.

Examples:

- driver cooperative membership;
- community financing;
- vehicle equipment;
- local economic participation.

Do not automatically classify all BoomBoom drivers as cooperative members.

Membership must be explicit.

---

# 19. MARKETPLACE INTEGRATION

Allow drivers/users to access BambooChain Marketplace.

Possible future functions:

- driver equipment;
- helmets;
- uniforms;
- local products;
- bamboo products;
- tourism products.

No duplicated marketplace database.

Reuse existing Marketplace APIs/services.

---

# 20. NOTIFICATIONS

Support:

- in-app notification;
- push notification architecture;
- email;
- optional WhatsApp provider adapter.

Events:

driver_assigned
driver_arrived
trip_started
trip_completed
payment_success
reward_received
SOS
driver_document_expiry

---

# 21. UI/UX

Design principles:

- extremely simple;
- mobile first;
- usable by elderly users;
- usable by users with low digital literacy;
- large buttons;
- large typography;
- Indonesian language first;
- minimal steps;
- clear icons;
- accessibility friendly.

Avoid clutter.

Use the existing BambooChain visual identity.

BoomBoom visual identity may use an energetic accent while remaining consistent with BambooChain.

---

# 22. ADMIN DASHBOARD

Create BoomBoom admin section.

Admin can monitor:

- users;
- drivers;
- operators;
- rides;
- transactions;
- complaints;
- incidents;
- rewards;
- regions;
- fare settings;
- feature flags.

Charts:

daily trips
weekly trips
monthly active users
revenue
driver earnings
average rating
cancellation rate

---

# 23. FINANCE & TRANSPARENCY

Each trip must generate an immutable logical ledger entry.

Display:

Fare
Driver share
Operator share
Platform share
Other approved fees

Do not allow the frontend client to alter financial ledger values.

All financial calculations must be generated and validated server-side.

---

# 24. SECURITY

Mandatory:

- authentication;
- role-based authorization;
- server-side financial validation;
- API rate limiting;
- Firestore/PostgreSQL access rules;
- audit trail;
- environment secrets;
- input validation;
- file upload validation;
- anti-abuse protection.

Never expose:
- private keys;
- payment secrets;
- Firebase admin secrets;
- blockchain signing keys.

---

# 25. PRIVACY

Location history is sensitive.

Implement:

- explicit location permission;
- minimum data collection;
- retention settings;
- user trip-history controls;
- restricted admin access;
- privacy notice.

---

# 26. REGULATORY READINESS

The system must separate:

TECHNOLOGY PLATFORM

from

TRANSPORT OPERATOR / LOCAL OPERATING PARTNER.

Create configuration fields for:

operator_legal_status
license_reference
operating_area
compliance_status

Do not display “licensed” or “government approved” unless verified and stored by authorized admin.

---

# 27. MVP DEVELOPMENT PHASE

PHASE 1 — UI/Prototype

Implement:

- BoomBoom landing;
- passenger booking UI;
- driver registration;
- driver dashboard;
- operator dashboard;
- fake/mock trip;
- fare estimate;
- trip history;
- BoomSafe;
- reward UI.

No real public paid ride is required in Phase 1.

---

PHASE 2 — Backend Pilot

Implement:

- real authentication;
- driver verification;
- geolocation;
- matching engine;
- secure trip database;
- payment sandbox;
- server-side fare calculation;
- notification;
- audit logs.

---

PHASE 3 — Closed Regional Pilot

Enable service only in configured pilot area.

Use feature flag:

BOOMBOOM_PILOT_ENABLED

Require admin-approved drivers and operators.

Collect:

- trip completion rate;
- response time;
- cancellation;
- complaints;
- safety incidents;
- driver earnings;
- user satisfaction.

---

PHASE 4 — Production Scaling

Only after pilot validation:

- multiple regions;
- payment production;
- mobile app;
- driver app;
- WebSocket real-time tracking;
- scalable dispatch service;
- route optimization;
- fraud detection;
- nationwide operator management.

---

# 28. PERFORMANCE

Follow existing BambooChain optimization strategy:

- React.lazy;
- route code splitting;
- TanStack Query;
- Zustand;
- caching;
- pagination;
- API-first architecture.

Do not create large Firestore listeners at global app level.

---

# 29. DO NOT

Do not:

- rebuild authentication;
- duplicate BambooChain user profiles;
- hardcode BMC price;
- hardcode commission;
- expose API keys;
- write token balances directly from browser;
- break existing routes;
- remove existing features;
- launch real transport service without admin activation.

---

# 30. DELIVERABLES

Agent must deliver:

1. BoomBoom route architecture
2. Component structure
3. Passenger UI
4. Driver UI
5. Operator dashboard
6. Admin dashboard
7. Database schema
8. Mock booking flow
9. Fare engine abstraction
10. Reward integration abstraction
11. Safety/SOS module
12. Responsive design
13. API specification
14. Security checklist
15. Pilot feature flags
16. README implementation documentation

Before modifying production-sensitive modules, inspect the existing codebase and reuse existing components and contexts whenever technically appropriate.

Run:

npm run lint

and

npm run build

after implementation.

Do not mark the task complete until the build succeeds without critical errors.