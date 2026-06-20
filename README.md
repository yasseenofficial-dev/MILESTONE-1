# PopEyez – Pop-Up Café Event Management Platform

PopEyez is a full-stack event management web application for planning, running, and evaluating pop-up café events. It implements the Milestone 2 user journeys for organizers, staff, vendors, guests, and venue owners.

## Technologies Used

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: Local JSON file database (`backend/data/database.json`) with generated dummy data
- API communication: Axios from React to Express
- Version control: GitHub-ready repository structure

## Implemented User Journeys

All 26 journeys from the Milestone 2 User Journey Documentation are implemented:

1. Organizer account creation and customization
2. Venue search and booking
3. Event planning and setup
4. Vendor coordination
5. Guest management
6. Day-of operations
7. Evaluation and reporting
8. Staff profile access
9. Staff task management and execution
10. Staff layout utilization
11. Staff day-of logistics
12. Staff events dashboarding
13. Vendor account access
14. Vendor sourcing request management
15. Vendor delivery management
16. Vendor invoicing
17. Guest invitation receipt
18. Guest RSVP
19. Guest day-of communications
20. Guest event check-in
21. Guest post-event feedback
22. Venue owner account setup
23. Venue listing management
24. Venue owner booking request management
25. Venue owner booking overview
26. Venue owner performance and reporting

See `docs/user_journey_coverage.md` for detailed mapping.

## Demo Accounts

All seeded accounts use this password:

```txt
password123
```

| Role | Email |
|---|---|
| Event Organizer | organizer@popeyez.com |
| Staff | staff@popeyez.com |
| Vendor | vendor@popeyez.com |
| Guest | guest@popeyez.com |
| Venue Owner | venueowner@popeyez.com |

## How to Run Locally

Open two terminal/CMD windows.

### 1. Backend

```bash
cd backend
npm install
npm run seed
npm start
```

Backend runs at:

```txt
http://localhost:5000
```

Test the backend:

```txt
http://localhost:5000/api/health
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at the Vite URL shown in the terminal, usually:

```txt
http://localhost:5173
```

## Database Setup and Dummy Data

The project uses a local JSON database file so it runs without external database installation.

- Seed file: `backend/seed/seedData.js`
- Seed command: `npm run seed`
- Generated database: `backend/data/database.json`
- Schema reference: `database/schema.sql`

To reset the database:

```bash
cd backend
npm run seed
```

## Main API Endpoints

- `POST /api/auth/login`
- `GET /api/events`
- `GET /api/events/:id/dashboard`
- `GET /api/venues`
- `POST /api/venues/:id/applications`
- `GET /api/tasks`
- `PATCH /api/tasks/:id/status`
- `GET /api/budgets/:eventId`
- `POST /api/budgets/:eventId/expenses`
- `GET /api/layouts/:eventId`
- `PUT /api/layouts/:eventId`
- `GET /api/vendors/requests/all`
- `PATCH /api/vendors/requests/:id/status`
- `PATCH /api/vendors/requests/:id/delivery`
- `GET /api/guests`
- `POST /api/guests/invitations`
- `PATCH /api/guests/:recordId/rsvp`
- `PATCH /api/guests/:recordId/checkin`
- `POST /api/guests/communications`
- `GET /api/reports/events/:eventId`
- `GET /api/reports/events/:eventId/export`

## Suggested GitHub Upload Steps

```bash
git init
git add .
git commit -m "Initial PopEyez full-stack milestone implementation"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Each team member should then make at least one meaningful commit, for example:

- Update a frontend page
- Improve styling
- Add or edit dummy data
- Improve validation
- Update README or documentation

## Project Structure

```txt
PopEyez_Milestone2_Final/
  frontend/
    src/
      components/
      services/
      styles/
      App.jsx
      main.jsx
    package.json
  backend/
    src/
      routes/
      db.js
      middleware.js
      server.js
    seed/
      seed.js
      seedData.js
    data/
      database.json
    package.json
  database/
    schema.sql
  docs/
    user_journey_coverage.md
    assumptions.md
    AI_CHATLOG.md
  README.md
```

## Assumptions

See `docs/assumptions.md`.

## Notes for Evaluators

The application demonstrates complete user flows, not only static screens. The React frontend calls the Express backend through APIs. The backend reads and writes data to the local database file, and dummy data can be regenerated using the seed command.


## One-Click Windows Start

After extracting the ZIP, you can double-click:

- `START_BACKEND.bat` to install dependencies, seed data, and run the backend.
- `START_FRONTEND.bat` to install dependencies and run the frontend.
- `START_PROJECT_WINDOWS.bat` to open both backend and frontend terminals automatically.

The backend health check is available at `http://localhost:5000/api/health`.
