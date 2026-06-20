# PopEyez — Venue Owner Module

This folder contains the **Venue Owner** portion of the PopEyez full-stack event
management platform, covering User Journeys **22–26** from the Milestone 2
documentation:

| # | Journey | Implemented as |
|---|---------|-----------------|
| 22 | Account Setup (Registration & Profile) | `account` routes + Login/Register/Profile pages |
| 23 | Venue Listing Management | `listings` routes + Listings/New Listing/Listing Detail pages |
| 24 | Booking Request Management | `requests` endpoints + Booking Requests page |
| 25 | Booking Overview | `bookings` endpoints + Bookings Overview page |
| 26 | Performance & Reporting | `reports` endpoints + Reporting page |

This is **one module of a larger team project**. The other user journeys (Event
Organizer, Team Members/Staff, Vendors, Guests) are owned by your teammate(s) and
should live in their own folders or be merged into a shared repo following the
recommended structure from the Project Guidelines.

## Tech stack

- **Frontend:** React 18 (Vite), React Router
- **Backend:** Node.js + Express
- **Database:** JSON file (`backend/data/db.json`) acting as a lightweight document
  store, accessed through `backend/db.js`. This satisfies the "any suitable
  database" requirement while staying dependency-free and easy to inspect/reset.
- **Auth:** JWT bearer tokens, passwords hashed with bcrypt

## Project structure

```
venue-owner-module/
  backend/
    data/db.json        # JSON "database" (committed empty; seed to populate)
    routes/
      account.js         # Journey 22
      listings.js         # Journey 23
      bookings.js         # Journeys 24 & 25
      reporting.js        # Journey 26
    auth.js               # JWT helpers + middleware
    db.js                 # read/write helpers for db.json
    server.js              # Express app entry point
    seed.js                 # populates db.json with realistic dummy data
    package.json
  frontend/
    src/
      pages/                # one page per journey area
      components/           # Layout, StatusBadge
      context/AuthContext.jsx
      api.js                 # fetch wrapper for all backend calls
      App.jsx, main.jsx, styles.css
    package.json
    vite.config.js
  README.md (this file)
```

## Setup & run instructions

### 1. Backend

```bash
cd backend
npm install
npm run seed     # populates data/db.json with sample owners, listings, bookings
npm start        # runs on http://localhost:5000
```

Health check: `GET http://localhost:5000/api/health`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # runs on http://localhost:5173, proxies /api to :5000
```

Open `http://localhost:5173` in your browser. The backend must be running first.

### Demo login (after seeding)

```
Email: nadine.farouk@venues.com
Password: Password123!
```

(A second seeded account, `omar.khalil@venues.com`, uses the same password and
owns a separate listing, useful for testing that owners only see their own data.)

### Resetting the dummy data

Re-run `npm run seed` from `backend/` at any time — it overwrites `data/db.json`
with a fresh copy of the sample owners, listings, booking requests and bookings.

## Environment variables

None are required to run locally. Optionally set:

- `PORT` — backend port (default `5000`)
- `JWT_SECRET` — secret used to sign JWTs (default is a dev-only fallback in
  `auth.js`; **set a real secret before any non-local deployment**)

## API overview

All Venue Owner endpoints are namespaced under `/api/venue-owner` and (except
register/login) require an `Authorization: Bearer <token>` header.

- `POST /account/register`, `POST /account/login`
- `GET/PUT /account/me`
- `GET/POST /listings`, `GET/PUT/DELETE /listings/:id`
- `POST /listings/:id/photos`, `POST /listings/:id/floor-plans`
- `PUT /listings/:id/availability`, `PATCH /listings/:id/status`
- `GET /requests`, `GET /requests/:id`
- `PATCH /requests/:id/respond` (Approve/Decline + optional message/counter-proposal)
- `POST /requests/:id/message`
- `GET /bookings`, `GET /bookings/:id`, `GET /bookings-upcoming`
- `GET /reports/summary`, `GET /reports/history`, `GET /reports/export`

## Assumptions made

Since the User Journeys document doesn't specify exact field names or UI layout,
the following reasonable assumptions were made and documented here per the
project guidelines:

1. Approving a booking request automatically creates a corresponding entry in
   the `bookings` collection (rather than modeling these as two completely
   separate data stores that need manual syncing).
2. "Revenue per listing" in the reporting dashboard is calculated as
   `confirmed bookings × the listing's configured price`, since the journeys
   don't define a separate payment/transaction entity for venue owners.
3. Photo and floor-plan "uploads" are stored as URL strings rather than binary
   file uploads, since no file-storage service was specified — this keeps the
   JSON database approach simple while still satisfying "upload and manage
   photos."
4. Report "export" returns a downloadable JSON file rather than a real PDF/Excel
   file; swapping in a PDF/Excel generation library (e.g. `pdfkit`, `exceljs`)
   at that single endpoint would satisfy a stricter interpretation of NFR-5 if
   needed.
5. Each venue owner can only see/manage their own listings, requests, and
   bookings (multi-tenant isolation enforced in the backend, not just the UI).

## AI usage disclosure

This module's backend, frontend, dummy data, and documentation were scaffolded
with the help of Claude (Anthropic). Please attach this session's chat log to
your team's `docs/AI chatlog` folder per the AI Usage Policy, and review/test
the generated code before submission as required by the guidelines.
