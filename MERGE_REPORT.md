# Merge Report — Event Management Platform Integration

**Date**: June 20, 2026  
**Performed by**: YS (yasseenofficial-dev)  
**Status**: Integration complete — awaiting review before commit/push

---

## 1. Team Contributions Identified

### Team Member A — Guest Journey Module
| Item | Details |
|------|---------|
| Backend | `Backend/server.js` — Express 5, no auth, JSON file database |
| Frontend | `Frontend/` — Create React App, React 19, react-router-dom v7 |
| Functionality | Guest-facing public portal: Invitation, RSVP, Messages, Check-In, Feedback |
| API base URL | Hardcoded `http://localhost:5000` |
| DB file | `Backend/database/db.json` — invitation, messages, rsvps, checkIns, feedback |

### Team Member B (YS) — Event Organizer Module
| Item | Details |
|------|---------|
| Backend | `Backend-ys/server.js` — Express 4, JWT auth, JSON file database |
| Frontend | `Frontend-ys/` — Vite + React 18, react-router-dom v6 |
| Functionality | Full event management: Events, Venues, Guests, Budget, Staff, Vendors, Floor Plans |
| API base URL | Relative `/api/` via Vite proxy |
| DB file | `Backend-ys/database/db.json` — 15+ collections |

---

## 2. Integration Strategy

Both modules are **complementary**:
- The **Organizer Module** (YS) manages events from the organizer's perspective (authenticated)
- The **Guest Journey Module** (Team A) provides a **public guest-facing portal** (no auth required)

A complete Event Management Platform needs both. They were merged into the YS codebase (Vite + React 18) since it is more modern and feature-complete.

---

## 3. Changes Made

### Backend-ys/server.js
**Added 4 public Guest Journey endpoints** (no JWT auth required):

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/invitation` | GET | Returns invitation details from db.json |
| `/api/messages` | GET | Returns day-of messages from db.json |
| `/api/rsvp` | POST | Records guest RSVP in `guestRsvps` collection |
| `/api/check-in` | POST | Records guest check-in in `checkIns` collection |
| `/api/feedback` | POST | Records public feedback in `publicFeedback` collection |

> **Conflict resolved**: Team A's backend ran on a separate Express instance. These routes are now served by the same server as the organizer API, eliminating the need for two backend processes.

### Backend-ys/database/db.json
**Added 5 new collections**:
- `invitation` — event details seeded with "Tech Networking Night" data from Team A's `db.json`
- `guestMessages` — 3 seeded messages from Team A's `db.json`
- `guestRsvps` — empty array (receives public RSVPs)
- `checkIns` — empty array (receives check-in records)
- `publicFeedback` — empty array (receives public feedback)

### Frontend-ys/src/pages/ (6 new files)
| New File | Source | Change Made |
|----------|--------|-------------|
| `GuestPortalPage.jsx` | `Frontend/src/pages/Home.jsx` | Routes updated to `/guest/*` prefix |
| `GuestInvitationPage.jsx` | `Frontend/src/pages/GuestInvitation.jsx` | URL: `http://localhost:5000/api/` → `/api/` |
| `GuestRSVPPage.jsx` | `Frontend/src/pages/GuestRSVP.jsx` | URL fixed, added error/success differentiation |
| `GuestMessagesPage.jsx` | `Frontend/src/pages/GuestMessages.jsx` | URL fixed |
| `GuestCheckInPage.jsx` | `Frontend/src/pages/GuestCheckIn.jsx` | URL fixed, added disabled state after check-in |
| `GuestFeedbackPage.jsx` | `Frontend/src/pages/GuestFeedback.jsx` | URL fixed, refactored to reduce repetition |

### Frontend-ys/src/App.jsx
**Added 6 public routes** (outside `<ProtectedRoute>`):
```
/guest             → GuestPortalPage
/guest/invitation  → GuestInvitationPage
/guest/rsvp        → GuestRSVPPage
/guest/messages    → GuestMessagesPage
/guest/check-in    → GuestCheckInPage
/guest/feedback    → GuestFeedbackPage
```

### Frontend-ys/src/index.css
**Added full Guest Portal CSS block** (all classes prefixed with `guest-` to avoid conflicts with existing organizer styles):
- `.guest-page`, `.guest-hero`, `.guest-card-grid`, `.guest-feature-card`
- `.guest-content-card`, `.guest-detail-list`, `.guest-detail-item`
- `.guest-form-grid`, `.guest-form-group`, `.guest-primary-button`
- `.guest-message-box`, `.guest-error-box`, `.guest-message-card`
- `.guest-qr-box`, `.guest-qr-code`, `.guest-status-pill`

### Frontend-ys/src/components/Layout.jsx
**Added "Guest Portal" nav link** (`🎟️`) to the sidebar so organizers can easily share/access the guest portal.

---

## 4. Conflicts Resolved

| # | Conflict | Resolution |
|---|----------|------------|
| 1 | **Two separate backends** running on same port 5000 | Merged all routes into `Backend-ys/server.js`. Single server handles both organizer API (auth) and guest journey (public) |
| 2 | **Hardcoded `http://localhost:5000` URLs** in Team A's frontend | Changed to relative `/api/` — Vite proxy forwards requests to the backend |
| 3 | **CSS class name collisions** — both apps used `.page`, `.content-card`, `.form-group`, etc. | Prefixed all guest portal classes with `guest-` (e.g. `.guest-page`, `.guest-content-card`) |
| 4 | **Different React versions** — Team A uses React 19 (CRA), YS uses React 18 (Vite) | Guest pages integrated into Vite/React 18 app. React 19 features not used so no compatibility issues |
| 5 | **Different router versions** — Team A uses react-router-dom v7, YS uses v6 | Guest pages use standard `<Link>` and `<Route>` which are compatible across v6/v7 |
| 6 | **Duplicate feedback concept** — Team A had `/api/feedback`, YS had `/api/events/:id/guests/feedback` | Both kept: public feedback stored in `publicFeedback` collection; organizer feedback stored per-event in `feedback` collection |

---

## 5. Architecture After Integration

```
Frontend-ys/ (Vite + React 18)
├── Authenticated routes (JWT required)
│   ├── /dashboard
│   ├── /events/*
│   ├── /venues, /bookings
│   ├── /accounts
│   └── /events/:id/* (guests, staff, budget, vendors, floor-plans, tasks, stakeholders)
└── Public routes (no auth)
    ├── /guest              ← Guest Portal Home
    ├── /guest/invitation   ← View invitation
    ├── /guest/rsvp         ← Submit RSVP
    ├── /guest/messages     ← Day-of updates
    ├── /guest/check-in     ← QR check-in
    └── /guest/feedback     ← Post-event feedback

Backend-ys/ (Express + JSON DB)
├── Authenticated API (Bearer token required)
│   ├── /api/auth/*
│   ├── /api/accounts/*
│   ├── /api/events/*
│   ├── /api/venues/*
│   └── /api/vendors/*
└── Public API (no auth)
    ├── GET  /api/invitation
    ├── GET  /api/messages
    ├── POST /api/rsvp
    ├── POST /api/check-in
    └── POST /api/feedback
```

---

## 6. What Was NOT Changed

- `Backend/` — Team A's original backend left untouched
- `Frontend/` — Team A's original frontend left untouched
- All existing organizer routes and components — no modifications
- `vite.config.js` — proxy already configured for `/api/` → port 5000
- `.env` — no changes needed

---

## 7. How to Run

```bash
cd C:\Users\Amr\Desktop\SE2\SE2
npm run dev
```

- Organizer App: http://localhost:5173 (login required)
- Guest Portal: http://localhost:5173/guest (public)
- API: http://localhost:5000

**Login credentials**: `organizer@events.com` / `password`

---

## 8. Pending Approval

> All changes above are **local only**. No commit or push has been made.  
> Please review and approve before running `git add`, `git commit`, and `git push`.
