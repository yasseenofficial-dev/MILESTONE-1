# PopEyez — Unified Event Management Platform

A single React + Node.js application that integrates five independently developed modules into one cohesive system.

---

## Project Structure

```
SE2/
├── app/
│   ├── backend/          # Unified Express server (port 5000)
│   │   ├── server.js
│   │   ├── start.js
│   │   └── package.json
│   └── frontend/         # Unified React/Vite app (port 5173)
│       ├── src/
│       └── package.json
├── Backend-ys/           # YS Organizer data (db.json)
├── backend_Youssef ElDairy/  # Day-of Operations backend
├── venue-owner-module/   # Venue Owner backend + data
└── AlaaMilstone2/        # Client & Vendor Sourcing backend
```

---

## Running the Application

> **Two terminals required — both must be running simultaneously.**

### Terminal 1 — Backend

```bash
cd SE2/app/backend
npm install
npm run dev
```

Server starts at: `http://localhost:5000`

### Terminal 2 — Frontend

```bash
cd SE2/app/frontend
npm install
npm run dev
```

App opens at: `http://localhost:5173`

---

## Module Login Credentials

### 1. Event Organizer Platform
**URL:** `/login`

| Email | Password | Role |
|---|---|---|
| `organizer@events.com` | `password` | Event Organizer |
| `admin@events.com` | `password` | Admin |

---

### 2. Guest Portal
**URL:** `/guest/login`

| Email | Password | Name |
|---|---|---|
| `sara.hassan@guest.com` | `password` | Sara Hassan |
| `karim.ali@guest.com` | `password` | Karim Ali |
| `layla.noor@guest.com` | `password` | Layla Noor |

---

### 3. Day-of Operations
**URL:** `/dayof/login`

| Email | Password | Role |
|---|---|---|
| `organizer@popeyez.com` | `password123` | Organizer |
| `staff@popeyez.com` | `password123` | Staff |
| `staff2@popeyez.com` | `password123` | Staff |

---

### 4. Venue Owner Portal
**URL:** `/venue-owner/login`

| Email | Password | Company |
|---|---|---|
| `nadine.farouk@venues.com` | `password` | Cairo Pop-up Spaces |
| `omar.khalil@venues.com` | `password` | Nile View Properties |

---

### 5. Client & Vendor Sourcing
**URL:** `/client/events` (Client — no login required)
**URL:** `/vendor/login` (Vendor login)

| Username/Email | Password |
|---|---|
| `vendor@example.com` | `1234` |

---

## Modules Overview

| Module | Path | Description |
|---|---|---|
| Event Organizer | `/login` → `/dashboard` | Create & manage events, venues, budgets, tasks, staff, vendors, guests |
| Guest Portal | `/guest/login` → `/guest` | View invitation, RSVP, messages, check-in, submit feedback |
| Day-of Operations | `/dayof/login` | Real-time event tracking, staff tasks, floor plans, vendor arrivals |
| Venue Owner | `/venue-owner/login` | Manage listings, respond to booking requests, view analytics |
| Client Sourcing | `/client/events` | Browse events, track sourcing requests, deliveries, invoices |
| Vendor Portal | `/vendor/login` | Accept/reject requests, confirm deliveries |

---

## Technology Stack

- **Frontend:** React 18, Vite, React Router v6, Axios
- **Backend:** Node.js, Express.js, JWT authentication, bcryptjs
- **Database:** JSON file-based (no external database required)
- **Authentication:** JWT (Organizer, Guest, Venue Owner), Base64 token (Day-of), plain (Client/Vendor)

---

## Team Members & Modules

| Module | Developer |
|---|---|
| Client & Vendor Sourcing (Module 1) | Alaa |
| Day-of Operations (Module 2) | Youssef ElDairy |
| Venue Owner Portal (Module 3) | Venue Owner Team |
| Guest Journey (Module 4) | Guest Team |
| Event Organizer Platform (Module 5) | YS Team |
