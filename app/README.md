# PopEyez — Unified Event Management Platform

**Course:** CSEN 704 — Software Engineering II  
**Semester:** Spring 2026  

---

## Project Description

PopEyez is a unified single-page React application that integrates five independently developed modules into one cohesive event management platform. The application covers the complete event lifecycle — from organizer planning and venue booking through day-of operations and the guest experience.

---

## Project Structure

```
app/
├── backend/          # Unified Express backend (port 5000)
│   ├── server.js     # Single server — all routes namespaced
│   └── package.json
└── frontend/         # Unified Vite + React 18 frontend (port 5173)
    ├── src/
    │   ├── App.jsx           # Root router
    │   ├── main.jsx          # Entry point + context providers
    │   ├── index.css         # Merged stylesheet
    │   ├── api/              # Axios clients per module
    │   ├── context/          # Auth contexts per module
    │   ├── components/       # Shared UI components
    │   └── pages/            # All module pages
    │       ├── organizer/    # YS Event Organizer
    │       ├── guest/        # Guest Portal
    │       ├── dayof/        # Day-of Operations
    │       ├── venue-owner/  # Venue Owner Portal
    │       └── alaa/         # Client & Vendor Sourcing
    └── package.json
```

---

## Integrated Modules

| Module | Description | Route Prefix |
|--------|-------------|--------------|
| Event Organizer (YS) | Full event lifecycle management | `/`, `/login`, `/events`, `/venues`, `/bookings`, `/accounts` |
| Guest Portal | Guest invitation, RSVP, messages, check-in, feedback | `/guest/*` |
| Client & Vendor Sourcing | Client sourcing requests, deliveries, invoices; vendor order management | `/client/*`, `/vendor/*` |
| Day-of Operations | Real-time dashboard, staff tasks, floor plan, check-in, vendor arrivals | `/dayof/*` |
| Venue Owner | Listings management, booking requests, reporting | `/venue-owner/*` |

---

## Prerequisites

- Node.js v18 or later
- npm v9 or later

---

## Installation & Running

### 1. Install backend dependencies

```bash
cd app/backend
npm install
```

### 2. Install frontend dependencies

```bash
cd app/frontend
npm install
```

### 3. Start the backend

```bash
cd app/backend
npm run dev
# Server starts on http://localhost:5000
```

### 4. Start the frontend

```bash
cd app/frontend
npm run dev
# App opens on http://localhost:5173
```

Open **http://localhost:5173** in your browser to access the application.

---

## Login Credentials

### Module 1 — Event Organizer Platform (`/login`)

| Role | Email | Password |
|------|-------|----------|
| Organizer | Register a new account at `/register` | — |
| Demo (if seeded) | `organizer@events.com` | `password` |

> Register a fresh account if the demo credentials do not work.

### Module 2 — Guest Portal (`/guest`)

No login required. The Guest Portal is publicly accessible.

### Module 3 — Client & Vendor Sourcing

| Role | Route | Credentials |
|------|-------|-------------|
| Client | `/client/events` | No login required |
| Vendor | `/vendor/login` | `vendor@example.com` / `1234` |

### Module 4 — Day-of Operations (`/dayof/login`)

| Role | Email | Password |
|------|-------|----------|
| Organizer | `organizer@popeyez.com` | `password123` |
| Staff | `staff@popeyez.com` | `password123` |

### Module 5 — Venue Owner Portal (`/venue-owner/login`)

| Role | Email | Password |
|------|-------|----------|
| Venue Owner | `nadine.farouk@venues.com` | `Password123!` |

> If the seeded account does not exist, register a new venue owner at `/venue-owner/register`.

---

## API Overview

The unified backend runs on **port 5000** and exposes the following namespaces:

| Prefix | Module |
|--------|--------|
| `/api/auth/*` | YS Organizer authentication |
| `/api/events/*` | Event management |
| `/api/venues/*` | Venue search & booking |
| `/api/accounts/*` | Account management |
| `/api/invitation`, `/api/rsvp`, `/api/messages`, `/api/check-in`, `/api/feedback` | Guest Portal |
| `/client/*` | Alaa — Client operations |
| `/vendor/*` | Alaa — Vendor operations |
| `/api/dayof/*` | Day-of Operations |
| `/api/venue-owner/*` | Venue Owner Portal |

---

## Database

All data is stored in JSON files (no external database required):

| File | Module |
|------|--------|
| `Backend-ys/database/db.json` | YS Organizer + Guest Portal |
| `AlaaMilstone2/BackEnd/src/Database/fakeData.js` | Client & Vendor (in-memory) |
| `backend_Youssef ElDairy/data/database.json` | Day-of Operations |
| `venue-owner-module/backend/data/db.json` | Venue Owner |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 5, React Router DOM 6, Axios |
| Backend | Node.js, Express 4, JWT, bcryptjs |
| Database | JSON files (fs-based persistence) |
| Dev Tools | nodemon, cors, morgan, dotenv |

---

## Notes

- The Vite dev server proxies `/api`, `/client`, and `/vendor` requests to `localhost:5000` automatically — no manual CORS configuration needed during development.
- Each module's authentication is isolated: the Organizer uses a `token` JWT key, the Venue Owner uses `venueOwnerToken`, and the Day-of module uses a Base64-encoded `popeyez_user` token.
- The Client module (Alaa) stores data in memory; data resets on backend restart.
