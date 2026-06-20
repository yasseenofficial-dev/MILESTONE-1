/**
 * PopEyez Unified Backend Server
 * Merges all 5 team modules into one Express server on port 5000.
 *
 * Route namespaces:
 *   /api/auth, /api/events, /api/venues, /api/accounts, ...  → YS Organizer (Module 5)
 *   /api/invitation, /api/messages, /api/rsvp, /api/check-in, /api/feedback → Guest Journey (Module 4, public)
 *   /client/*, /vendor/*                                      → AlaaMilstone2 (Module 1)
 *   /api/dayof/auth, /api/dayof/events, /api/dayof/tasks, ... → Youssef Day-of (Module 2)
 *   /api/venue-owner/*                                        → Venue Owner (Module 3)
 */

// Make app/backend/node_modules available to all required sub-modules
// (venue-owner, Youssef, Alaa all require packages like uuid, bcryptjs, etc.)
const Module = require('module');
const path   = require('path');
Module.globalPaths.push(path.join(__dirname, 'node_modules'));

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
const fs       = require('fs');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

const app  = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'popeyez-unified-secret';

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// ─────────────────────────────────────────────────────────────────────────────
// YS ORGANIZER DATA HELPERS  (Module 5 — Backend-ys/database/db.json)
// ─────────────────────────────────────────────────────────────────────────────

const YS_DB = path.join(__dirname, '../../Backend-ys/database/db.json');

function readYS()       { return JSON.parse(fs.readFileSync(YS_DB, 'utf-8')); }
function writeYS(data)  { fs.writeFileSync(YS_DB, JSON.stringify(data, null, 2)); }
function uid()          { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

// ── YS AUTH MIDDLEWARE ────────────────────────────────────────────────────────

function ysAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ message: 'Invalid token' }); }
}

// ── HEALTH ────────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'PopEyez Unified API is running' });
});

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 4 — GUEST JOURNEY (JWT auth)
// ─────────────────────────────────────────────────────────────────────────────

function guestAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Please log in to access the Guest Portal' });
  try { req.guestUser = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ message: 'Session expired. Please log in again.' }); }
}

app.post('/api/guest/login', (req, res) => {
  const { email, password } = req.body;
  const db = readYS();
  const guest = (db.guestUsers || []).find(g => g.email === email);
  if (!guest) return res.status(401).json({ message: 'Invalid credentials' });
  bcrypt.compare(password, guest.passwordHash, (err, match) => {
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: guest.id, email: guest.email, role: 'GUEST' }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...safe } = guest;
    res.json({ token, user: safe });
  });
});

app.get('/api/invitation', guestAuth, (req, res) => {
  res.json(readYS().invitation || {});
});

app.get('/api/messages', guestAuth, (req, res) => {
  res.json(readYS().guestMessages || []);
});

app.post('/api/rsvp', guestAuth, (req, res) => {
  const { attendance, dietaryPreference, specialRequirements } = req.body;
  if (!attendance) return res.status(400).json({ message: 'Attendance status is required' });
  const db = readYS();
  const rsvp = { id: Date.now(), attendance, dietaryPreference: dietaryPreference || '', specialRequirements: specialRequirements || '', submittedAt: new Date().toISOString() };
  if (!db.guestRsvps) db.guestRsvps = [];
  db.guestRsvps.push(rsvp);
  writeYS(db);
  res.json({ message: 'RSVP submitted successfully', rsvp });
});

app.post('/api/check-in', guestAuth, (req, res) => {
  const { guestName, qrCode } = req.body;
  if (!guestName || !qrCode) return res.status(400).json({ message: 'Guest name and QR code are required' });
  const db = readYS();
  const checkIn = { id: Date.now(), guestName, qrCode, checkedInAt: new Date().toISOString() };
  if (!db.checkIns) db.checkIns = [];
  db.checkIns.push(checkIn);
  writeYS(db);
  res.json({ message: 'Check-in confirmed. Welcome to the event!', checkIn });
});

app.post('/api/feedback', guestAuth, (req, res) => {
  const { overallExperience, foodRating, venueRating, organizationRating, comments } = req.body;
  if (!overallExperience || !foodRating || !venueRating || !organizationRating)
    return res.status(400).json({ message: 'All rating fields are required' });
  const db = readYS();
  const fb = { id: Date.now(), overallExperience, foodRating, venueRating, organizationRating, comments: comments || '', submittedAt: new Date().toISOString() };
  if (!db.publicFeedback) db.publicFeedback = [];
  db.publicFeedback.push(fb);
  writeYS(db);
  res.json({ message: 'Thank you for submitting your feedback!', feedback: fb });
});

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 5 — YS ORGANIZER (JWT auth)
// ─────────────────────────────────────────────────────────────────────────────

// Auth
app.post('/api/auth/register', async (req, res) => {
  const { email, password, firstName, lastName, phone, companyName } = req.body;
  const db = readYS();
  if (db.users.find(u => u.email === email)) return res.status(400).json({ message: 'Email already in use' });
  const user = { id: uid(), email, firstName, lastName, phone: phone || null, companyName: companyName || null, passwordHash: await bcrypt.hash(password, 10), role: 'EVENT_ORGANIZER', isActive: true, createdAt: new Date().toISOString() };
  db.users.push(user);
  writeYS(db);
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  const { passwordHash: _, ...safe } = user;
  res.status(201).json({ token, user: safe });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = readYS();
  const user = db.users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  const { passwordHash: _, ...safe } = user;
  res.json({ token, user: safe });
});

app.get('/api/auth/profile', ysAuth, (req, res) => {
  const db = readYS();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { passwordHash: _, ...safe } = user;
  res.json({ user: safe });
});

app.put('/api/auth/profile', ysAuth, async (req, res) => {
  const db = readYS();
  const idx = db.users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  const { password, ...rest } = req.body;
  if (password) rest.passwordHash = await bcrypt.hash(password, 10);
  db.users[idx] = { ...db.users[idx], ...rest, updatedAt: new Date().toISOString() };
  writeYS(db);
  const { passwordHash: _, ...safe } = db.users[idx];
  res.json({ user: safe });
});

// Accounts
app.patch('/api/accounts/deactivate-stakeholders', ysAuth, (req, res) => {
  const db = readYS(); const { eventId } = req.body;
  db.stakeholders.filter(s => s.eventId === eventId).forEach(s => { s.isActive = false; });
  writeYS(db); res.json({ message: 'Stakeholders deactivated' });
});
app.get('/api/accounts', ysAuth, (req, res) => {
  const db = readYS();
  res.json({ accounts: db.users.filter(u => u.createdById === req.user.id).map(({ passwordHash: _, ...u }) => u) });
});
app.post('/api/accounts', ysAuth, async (req, res) => {
  const { email, password, firstName, lastName, phone, role } = req.body;
  const db = readYS();
  if (db.users.find(u => u.email === email)) return res.status(400).json({ message: 'Email already in use' });
  const user = { id: uid(), email, firstName, lastName, phone: phone || null, passwordHash: await bcrypt.hash(password, 10), role: role || 'STAFF', isActive: true, createdById: req.user.id, createdAt: new Date().toISOString() };
  db.users.push(user); writeYS(db);
  const { passwordHash: _, ...safe } = user;
  res.status(201).json({ account: safe });
});
app.put('/api/accounts/:id', ysAuth, async (req, res) => {
  const db = readYS(); const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Account not found' });
  db.users[idx] = { ...db.users[idx], ...req.body, updatedAt: new Date().toISOString() }; writeYS(db);
  const { passwordHash: _, ...safe } = db.users[idx]; res.json({ account: safe });
});
app.patch('/api/accounts/:id/deactivate', ysAuth, (req, res) => {
  const db = readYS(); const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Account not found' });
  db.users[idx].isActive = false; writeYS(db); res.json({ message: 'Account deactivated' });
});

// Events
app.get('/api/events/dashboard', ysAuth, (req, res) => {
  const db = readYS();
  const uid = req.user.id;
  const now = new Date();
  const events = db.events.filter(e => e.organizerId === uid);
  const tasks  = (db.tasks || []).filter(t => t.organizerId === uid || events.some(e => e.id === t.eventId));
  const guests = (db.guests || []).filter(g => events.some(e => e.id === g.eventId));
  const feedback = (db.feedback || []).filter(f => events.some(e => e.id === f.eventId));
  const bookings = (db.bookings || []).filter(b => b.organizerId === uid);

  const rsvpStats = guests.reduce((acc, g) => {
    acc[g.rsvpStatus || 'PENDING'] = (acc[g.rsvpStatus || 'PENDING'] || 0) + 1;
    return acc;
  }, {});

  const avgRating = feedback.length
    ? (feedback.reduce((s, f) => s + (f.rating || 0), 0) / feedback.length).toFixed(1)
    : 0;

  const recentEvents = events.slice(-5).reverse().map(e => ({
    id: e.id, title: e.title, startDate: e.startDate, status: e.status
  }));

  const upcomingTasks = tasks
    .filter(t => t.status !== 'COMPLETED' && (!t.dueDate || new Date(t.dueDate) >= now))
    .slice(0, 5)
    .map(t => ({
      id: t.id, title: t.title, dueDate: t.dueDate,
      event: events.find(e => e.id === t.eventId) ? { title: events.find(e => e.id === t.eventId).title } : null
    }));

  const recentFeedback = feedback.slice(-5).reverse().map(f => ({
    id: f.id, rating: f.rating, comment: f.comment,
    event: events.find(e => e.id === f.eventId) ? { title: events.find(e => e.id === f.eventId).title } : null
  }));

  res.json({
    data: {
      stats: {
        totalEvents: events.length,
        upcomingEvents: events.filter(e => new Date(e.startDate) > now).length,
        pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
        avgFeedbackRating: avgRating,
        rsvpStats
      },
      recentEvents,
      upcomingTasks,
      recentFeedback
    }
  });
});
app.get('/api/events', ysAuth, (req, res) => {
  const db = readYS(); res.json({ events: db.events.filter(e => e.organizerId === req.user.id) });
});
app.get('/api/events/:id', ysAuth, (req, res) => {
  const db = readYS(); const event = db.events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' }); res.json({ event });
});
app.post('/api/events', ysAuth, (req, res) => {
  const db = readYS(); const event = { id: uid(), organizerId: req.user.id, status: 'DRAFT', ...req.body, createdAt: new Date().toISOString() };
  db.events.push(event); writeYS(db); res.status(201).json({ event });
});
app.put('/api/events/:id', ysAuth, (req, res) => {
  const db = readYS(); const idx = db.events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Event not found' });
  db.events[idx] = { ...db.events[idx], ...req.body, updatedAt: new Date().toISOString() }; writeYS(db); res.json({ event: db.events[idx] });
});
app.delete('/api/events/:id', ysAuth, (req, res) => {
  const db = readYS(); db.events = db.events.filter(e => e.id !== req.params.id); writeYS(db); res.json({ message: 'Event deleted' });
});

// Venues (organizer perspective)
app.get('/api/venues/bookings', ysAuth, (req, res) => {
  const db = readYS(); res.json({ bookings: db.bookings.filter(b => b.organizerId === req.user.id) });
});
app.post('/api/venues/bookings', ysAuth, (req, res) => {
  const db = readYS(); const booking = { id: uid(), organizerId: req.user.id, status: 'PENDING', ...req.body, createdAt: new Date().toISOString() };
  db.bookings.push(booking); writeYS(db); res.status(201).json({ booking });
});
app.delete('/api/venues/bookings/:id', ysAuth, (req, res) => {
  const db = readYS(); db.bookings = db.bookings.filter(b => b.id !== req.params.id); writeYS(db); res.json({ message: 'Booking cancelled' });
});
function parseVenue(v) {
  return {
    ...v,
    amenities: typeof v.amenities === 'string' ? JSON.parse(v.amenities) : (v.amenities || []),
    images:    typeof v.images    === 'string' ? JSON.parse(v.images)    : (v.images    || []),
  };
}
app.get('/api/venues', ysAuth, (req, res) => { const db = readYS(); res.json({ venues: db.venues.map(parseVenue) }); });
app.get('/api/venues/:id', ysAuth, (req, res) => {
  const db = readYS(); const venue = db.venues.find(v => v.id === req.params.id);
  if (!venue) return res.status(404).json({ message: 'Venue not found' }); res.json({ venue: parseVenue(venue) });
});

// Stakeholders
app.get('/api/events/:eventId/stakeholders', ysAuth, (req, res) => {
  const db = readYS(); res.json({ stakeholders: db.stakeholders.filter(s => s.eventId === req.params.eventId) });
});
app.post('/api/events/:eventId/stakeholders', ysAuth, (req, res) => {
  const db = readYS(); const s = { id: uid(), eventId: req.params.eventId, role: 'OTHER', ...req.body, createdAt: new Date().toISOString() };
  db.stakeholders.push(s); writeYS(db); res.status(201).json({ stakeholder: s });
});
app.put('/api/events/:eventId/stakeholders/:id', ysAuth, (req, res) => {
  const db = readYS(); const idx = db.stakeholders.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.stakeholders[idx] = { ...db.stakeholders[idx], ...req.body }; writeYS(db); res.json({ stakeholder: db.stakeholders[idx] });
});
app.delete('/api/events/:eventId/stakeholders/:id', ysAuth, (req, res) => {
  const db = readYS(); db.stakeholders = db.stakeholders.filter(s => s.id !== req.params.id); writeYS(db); res.json({ message: 'Deleted' });
});

// Tasks
app.get('/api/tasks/reminders', ysAuth, (req, res) => {
  const db = readYS(); const now = new Date();
  res.json({ reminders: db.tasks.filter(t => t.reminderAt && new Date(t.reminderAt) <= now) });
});
app.get('/api/events/:eventId/tasks', ysAuth, (req, res) => {
  const db = readYS(); res.json({ tasks: db.tasks.filter(t => t.eventId === req.params.eventId) });
});
app.post('/api/events/:eventId/tasks', ysAuth, (req, res) => {
  const db = readYS(); const task = { id: uid(), eventId: req.params.eventId, status: 'TODO', priority: 'MEDIUM', ...req.body, createdAt: new Date().toISOString() };
  db.tasks.push(task); writeYS(db); res.status(201).json({ task });
});
app.put('/api/events/:eventId/tasks/:id', ysAuth, (req, res) => {
  const db = readYS(); const idx = db.tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.tasks[idx] = { ...db.tasks[idx], ...req.body, updatedAt: new Date().toISOString() }; writeYS(db); res.json({ task: db.tasks[idx] });
});
app.delete('/api/events/:eventId/tasks/:id', ysAuth, (req, res) => {
  const db = readYS(); db.tasks = db.tasks.filter(t => t.id !== req.params.id); writeYS(db); res.json({ message: 'Deleted' });
});

// Budget
app.get('/api/events/:eventId/budget', ysAuth, (req, res) => {
  const db = readYS();
  res.json({ categories: db.budgetCategories.filter(c => c.eventId === req.params.eventId), expenses: db.expenses.filter(e => e.eventId === req.params.eventId) });
});
app.post('/api/events/:eventId/budget/categories', ysAuth, (req, res) => {
  const db = readYS(); const cat = { id: uid(), eventId: req.params.eventId, ...req.body };
  db.budgetCategories.push(cat); writeYS(db); res.status(201).json({ category: cat });
});
app.put('/api/events/:eventId/budget/categories/:id', ysAuth, (req, res) => {
  const db = readYS(); const idx = db.budgetCategories.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.budgetCategories[idx] = { ...db.budgetCategories[idx], ...req.body }; writeYS(db); res.json({ category: db.budgetCategories[idx] });
});
app.delete('/api/events/:eventId/budget/categories/:id', ysAuth, (req, res) => {
  const db = readYS(); db.budgetCategories = db.budgetCategories.filter(c => c.id !== req.params.id); writeYS(db); res.json({ message: 'Deleted' });
});
app.post('/api/events/:eventId/budget/expenses', ysAuth, (req, res) => {
  const db = readYS(); const exp = { id: uid(), eventId: req.params.eventId, expenseDate: new Date().toISOString(), createdAt: new Date().toISOString(), ...req.body };
  db.expenses.push(exp); writeYS(db); res.status(201).json({ expense: exp });
});
app.delete('/api/events/:eventId/budget/expenses/:id', ysAuth, (req, res) => {
  const db = readYS(); db.expenses = db.expenses.filter(e => e.id !== req.params.id); writeYS(db); res.json({ message: 'Deleted' });
});

// Floor Plans
app.get('/api/events/:eventId/floor-plans', ysAuth, (req, res) => {
  const db = readYS(); res.json({ floorPlans: db.floorPlans.filter(f => f.eventId === req.params.eventId) });
});
app.get('/api/events/:eventId/floor-plans/:id', ysAuth, (req, res) => {
  const db = readYS(); const fp = db.floorPlans.find(f => f.id === req.params.id);
  if (!fp) return res.status(404).json({ message: 'Not found' }); res.json({ floorPlan: fp });
});
app.post('/api/events/:eventId/floor-plans', ysAuth, (req, res) => {
  const db = readYS(); const fp = { id: uid(), eventId: req.params.eventId, canvasData: '{}', width: 800, height: 600, ...req.body, createdAt: new Date().toISOString() };
  db.floorPlans.push(fp); writeYS(db); res.status(201).json({ floorPlan: fp });
});
app.put('/api/events/:eventId/floor-plans/:id', ysAuth, (req, res) => {
  const db = readYS(); const idx = db.floorPlans.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.floorPlans[idx] = { ...db.floorPlans[idx], ...req.body, updatedAt: new Date().toISOString() }; writeYS(db); res.json({ floorPlan: db.floorPlans[idx] });
});
app.delete('/api/events/:eventId/floor-plans/:id', ysAuth, (req, res) => {
  const db = readYS(); db.floorPlans = db.floorPlans.filter(f => f.id !== req.params.id); writeYS(db); res.json({ message: 'Deleted' });
});

// Staff
app.get('/api/events/:eventId/staff', ysAuth, (req, res) => {
  const db = readYS(); res.json({ staff: db.staff.filter(s => s.eventId === req.params.eventId) });
});
app.post('/api/events/:eventId/staff', ysAuth, (req, res) => {
  const db = readYS(); const member = { id: uid(), eventId: req.params.eventId, status: 'ACTIVE', ...req.body, createdAt: new Date().toISOString() };
  db.staff.push(member); writeYS(db); res.status(201).json({ staff: member });
});
app.put('/api/events/:eventId/staff/:id', ysAuth, (req, res) => {
  const db = readYS(); const idx = db.staff.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.staff[idx] = { ...db.staff[idx], ...req.body }; writeYS(db); res.json({ staff: db.staff[idx] });
});
app.delete('/api/events/:eventId/staff/:id', ysAuth, (req, res) => {
  const db = readYS(); db.staff = db.staff.filter(s => s.id !== req.params.id); writeYS(db); res.json({ message: 'Deleted' });
});
app.put('/api/events/:eventId/staff/:staffId/tasks/:taskId', ysAuth, (req, res) => {
  const db = readYS(); const idx = db.tasks.findIndex(t => t.id === req.params.taskId);
  if (idx === -1) return res.status(404).json({ message: 'Task not found' });
  db.tasks[idx].staffId = req.params.staffId; writeYS(db); res.json({ task: db.tasks[idx] });
});

// Vendors (organizer catalog)
app.get('/api/vendors', ysAuth, (req, res) => { const db = readYS(); res.json({ vendors: db.vendors }); });
app.get('/api/events/:eventId/vendors/vendors', ysAuth, (req, res) => {
  const db = readYS(); res.json({ vendors: db.eventVendors.filter(v => v.eventId === req.params.eventId) });
});
app.post('/api/events/:eventId/vendors/vendors', ysAuth, (req, res) => {
  const db = readYS(); const ev = { id: uid(), eventId: req.params.eventId, status: 'ACTIVE', ...req.body };
  db.eventVendors.push(ev); writeYS(db); res.status(201).json({ vendor: ev });
});
app.get('/api/events/:eventId/vendors/sourcing', ysAuth, (req, res) => {
  const db = readYS(); res.json({ sourcing: db.sourcingRequests.filter(s => s.eventId === req.params.eventId) });
});
app.post('/api/events/:eventId/vendors/sourcing', ysAuth, (req, res) => {
  const db = readYS(); const sr = { id: uid(), eventId: req.params.eventId, status: 'DRAFT', requestedAt: new Date().toISOString(), ...req.body };
  db.sourcingRequests.push(sr); writeYS(db); res.status(201).json({ sourcing: sr });
});
app.put('/api/events/:eventId/vendors/sourcing/:id', ysAuth, (req, res) => {
  const db = readYS(); const idx = db.sourcingRequests.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.sourcingRequests[idx] = { ...db.sourcingRequests[idx], ...req.body }; writeYS(db); res.json({ sourcing: db.sourcingRequests[idx] });
});
app.post('/api/events/:eventId/vendors/deliveries', ysAuth, (req, res) => {
  const db = readYS(); const d = { id: uid(), status: 'SCHEDULED', createdAt: new Date().toISOString(), ...req.body };
  db.deliveries.push(d); writeYS(db); res.status(201).json({ delivery: d });
});
app.put('/api/events/:eventId/vendors/deliveries/:id', ysAuth, (req, res) => {
  const db = readYS(); const idx = db.deliveries.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.deliveries[idx] = { ...db.deliveries[idx], ...req.body }; writeYS(db); res.json({ delivery: db.deliveries[idx] });
});
app.post('/api/events/:eventId/vendors/invoices', ysAuth, (req, res) => {
  const db = readYS(); const inv = { id: uid(), status: 'DRAFT', createdAt: new Date().toISOString(), ...req.body };
  db.invoices.push(inv); writeYS(db); res.status(201).json({ invoice: inv });
});
app.put('/api/events/:eventId/vendors/invoices/:id', ysAuth, (req, res) => {
  const db = readYS(); const idx = db.invoices.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.invoices[idx] = { ...db.invoices[idx], ...req.body }; writeYS(db); res.json({ invoice: db.invoices[idx] });
});

// Guests (organizer management)
app.get('/api/events/:eventId/guests/stats', ysAuth, (req, res) => {
  const db = readYS(); const guests = db.guests.filter(g => g.eventId === req.params.eventId);
  res.json({ total: guests.length, confirmed: guests.filter(g => g.rsvpStatus === 'CONFIRMED').length, declined: guests.filter(g => g.rsvpStatus === 'DECLINED').length, pending: guests.filter(g => g.rsvpStatus === 'PENDING').length });
});
app.get('/api/events/:eventId/guests/feedback', ysAuth, (req, res) => {
  const db = readYS(); res.json({ feedback: db.feedback.filter(f => f.eventId === req.params.eventId) });
});
app.post('/api/events/:eventId/guests/send-invitations', ysAuth, (req, res) => {
  const db = readYS(); const { guestIds } = req.body;
  db.guests.forEach(g => { if (guestIds.includes(g.id)) g.invitationSentAt = new Date().toISOString(); });
  writeYS(db); res.json({ message: `Invitations sent to ${guestIds.length} guests` });
});
app.get('/api/events/:eventId/guests', ysAuth, (req, res) => {
  const db = readYS(); res.json({ guests: db.guests.filter(g => g.eventId === req.params.eventId) });
});
app.post('/api/events/:eventId/guests', ysAuth, (req, res) => {
  const db = readYS(); const guest = { id: uid(), eventId: req.params.eventId, rsvpStatus: 'PENDING', createdAt: new Date().toISOString(), ...req.body };
  db.guests.push(guest); writeYS(db); res.status(201).json({ guest });
});
app.put('/api/events/:eventId/guests/:id', ysAuth, (req, res) => {
  const db = readYS(); const idx = db.guests.findIndex(g => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.guests[idx] = { ...db.guests[idx], ...req.body }; writeYS(db); res.json({ guest: db.guests[idx] });
});
app.delete('/api/events/:eventId/guests/:id', ysAuth, (req, res) => {
  const db = readYS(); db.guests = db.guests.filter(g => g.id !== req.params.id); writeYS(db); res.json({ message: 'Deleted' });
});

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 1 — ALAAMILSTONE2 (client/vendor sourcing & delivery)
// Routes: /client/* and /vendor/*
// Data: in-memory via original fakeData.js (no file persistence)
// ─────────────────────────────────────────────────────────────────────────────

const alaaClientRoutes = require('../../AlaaMilstone2/BackEnd/src/routes/clientRoutes');
const alaaVendorRoutes = require('../../AlaaMilstone2/BackEnd/src/routes/vendorRoutes');

app.use('/client', alaaClientRoutes);
app.use('/vendor', alaaVendorRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 2 — YOUSSEF ELDAIRY (day-of operations, journeys 6-11)
// Routes: /api/dayof/* (re-namespaced from original /api/* to avoid collision)
// Data: backend_Youssef ElDairy/data/database.json (via original config/db.js)
// Auth: Base64 encoding (userId:role)
// ─────────────────────────────────────────────────────────────────────────────

const youssefAuth      = require('../../backend_Youssef ElDairy/src/routes/authRoutes');
const youssefEvents    = require('../../backend_Youssef ElDairy/src/routes/eventRoutes');
const youssefTasks     = require('../../backend_Youssef ElDairy/src/routes/taskRoutes');
const youssefLayouts   = require('../../backend_Youssef ElDairy/src/routes/layoutRoutes');
const youssefGuests    = require('../../backend_Youssef ElDairy/src/routes/guestRoutes');
const youssefVendors   = require('../../backend_Youssef ElDairy/src/routes/vendorRoutes');
const youssefComms     = require('../../backend_Youssef ElDairy/src/routes/communicationRoutes');
const youssefReports   = require('../../backend_Youssef ElDairy/src/routes/reportRoutes');
const youssefFeedback  = require('../../backend_Youssef ElDairy/src/routes/feedbackRoutes');

app.use('/api/dayof/auth',           youssefAuth);
app.use('/api/dayof/events',         youssefEvents);
app.use('/api/dayof/tasks',          youssefTasks);
app.use('/api/dayof/layouts',        youssefLayouts);
app.use('/api/dayof/guests',         youssefGuests);
app.use('/api/dayof/vendors',        youssefVendors);
app.use('/api/dayof/communications', youssefComms);
app.use('/api/dayof/reports',        youssefReports);
app.use('/api/dayof/feedback',       youssefFeedback);

// ─────────────────────────────────────────────────────────────────────────────
// MODULE 3 — VENUE OWNER (journeys 22-26)
// Routes: /api/venue-owner/* (already namespaced in original)
// Data: venue-owner-module/backend/data/db.json (via original db.js)
// Auth: JWT (separate secret, token stored as venueOwnerToken)
// ─────────────────────────────────────────────────────────────────────────────

const venueOwnerAccount  = require('../../venue-owner-module/backend/routes/account');
const venueOwnerListings = require('../../venue-owner-module/backend/routes/listings');
const venueOwnerBookings = require('../../venue-owner-module/backend/routes/bookings');
const venueOwnerReports  = require('../../venue-owner-module/backend/routes/reporting');

app.use('/api/venue-owner/account',  venueOwnerAccount);
app.use('/api/venue-owner/listings', venueOwnerListings);
app.use('/api/venue-owner',          venueOwnerBookings);
app.use('/api/venue-owner/reports',  venueOwnerReports);

// ─────────────────────────────────────────────────────────────────────────────
// ERROR HANDLERS
// ─────────────────────────────────────────────────────────────────────────────

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, _next) => {
  const status = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`PopEyez Unified Server running on http://localhost:${PORT}`);
  console.log('  YS Organizer:   /api/*');
  console.log('  Guest Journey:  /api/invitation, /api/messages, ...');
  console.log('  AlaaMilstone2:  /client/*, /vendor/*');
  console.log('  Youssef Day-of: /api/dayof/*');
  console.log('  Venue Owner:    /api/venue-owner/*');
});
