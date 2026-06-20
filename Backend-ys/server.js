const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'event-organizer-secret';
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());

// ── Database helpers ──────────────────────────────────────────────────────────

const dbPath = path.join(__dirname, 'database', 'db.json');

function readDb() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ── Auth middleware ───────────────────────────────────────────────────────────

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// ── Health ────────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Event Organizer API is running' });
});

// ── Auth ──────────────────────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  const { email, password, firstName, lastName, phone, companyName } = req.body;
  const db = readDb();
  if (db.users.find(u => u.email === email))
    return res.status(400).json({ message: 'Email already in use' });
  const user = {
    id: uid(), email, firstName, lastName, phone: phone || null,
    companyName: companyName || null,
    passwordHash: await bcrypt.hash(password, 10),
    role: 'EVENT_ORGANIZER', isActive: true,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  const { passwordHash: _, ...safe } = user;
  res.status(201).json({ token, user: safe });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  const { passwordHash: _, ...safe } = user;
  res.json({ token, user: safe });
});

app.get('/api/auth/profile', auth, (req, res) => {
  const db = readDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { passwordHash: _, ...safe } = user;
  res.json({ user: safe });
});

app.put('/api/auth/profile', auth, async (req, res) => {
  const db = readDb();
  const idx = db.users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  const { password, ...rest } = req.body;
  if (password) rest.passwordHash = await bcrypt.hash(password, 10);
  db.users[idx] = { ...db.users[idx], ...rest, updatedAt: new Date().toISOString() };
  writeDb(db);
  const { passwordHash: _, ...safe } = db.users[idx];
  res.json({ user: safe });
});

// ── Accounts ──────────────────────────────────────────────────────────────────

app.patch('/api/accounts/deactivate-stakeholders', auth, (req, res) => {
  const db = readDb();
  const { eventId } = req.body;
  db.stakeholders.filter(s => s.eventId === eventId).forEach(s => { s.isActive = false; });
  writeDb(db);
  res.json({ message: 'Stakeholders deactivated' });
});

app.get('/api/accounts', auth, (req, res) => {
  const db = readDb();
  const accounts = db.users
    .filter(u => u.createdById === req.user.id)
    .map(({ passwordHash: _, ...u }) => u);
  res.json({ accounts });
});

app.post('/api/accounts', auth, async (req, res) => {
  const { email, password, firstName, lastName, phone, role } = req.body;
  const db = readDb();
  if (db.users.find(u => u.email === email))
    return res.status(400).json({ message: 'Email already in use' });
  const user = {
    id: uid(), email, firstName, lastName, phone: phone || null,
    passwordHash: await bcrypt.hash(password, 10),
    role: role || 'STAFF', isActive: true,
    createdById: req.user.id, createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);
  const { passwordHash: _, ...safe } = user;
  res.status(201).json({ account: safe });
});

app.put('/api/accounts/:id', auth, async (req, res) => {
  const db = readDb();
  const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Account not found' });
  db.users[idx] = { ...db.users[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeDb(db);
  const { passwordHash: _, ...safe } = db.users[idx];
  res.json({ account: safe });
});

app.patch('/api/accounts/:id/deactivate', auth, (req, res) => {
  const db = readDb();
  const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Account not found' });
  db.users[idx].isActive = false;
  writeDb(db);
  res.json({ message: 'Account deactivated' });
});

// ── Events ────────────────────────────────────────────────────────────────────

app.get('/api/events/dashboard', auth, (req, res) => {
  const db = readDb();
  const events = db.events.filter(e => e.organizerId === req.user.id);
  const now = new Date();
  res.json({
    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.startDate) > now).length,
    activeEvents: events.filter(e => e.status === 'ACTIVE').length,
    recentEvents: events.slice(-5),
  });
});

app.get('/api/events', auth, (req, res) => {
  const db = readDb();
  res.json({ events: db.events.filter(e => e.organizerId === req.user.id) });
});

app.get('/api/events/:id', auth, (req, res) => {
  const db = readDb();
  const event = db.events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json({ event });
});

app.post('/api/events', auth, (req, res) => {
  const db = readDb();
  const event = { id: uid(), organizerId: req.user.id, status: 'DRAFT', ...req.body, createdAt: new Date().toISOString() };
  db.events.push(event);
  writeDb(db);
  res.status(201).json({ event });
});

app.put('/api/events/:id', auth, (req, res) => {
  const db = readDb();
  const idx = db.events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Event not found' });
  db.events[idx] = { ...db.events[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeDb(db);
  res.json({ event: db.events[idx] });
});

app.delete('/api/events/:id', auth, (req, res) => {
  const db = readDb();
  db.events = db.events.filter(e => e.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Event deleted' });
});

// ── Venues ────────────────────────────────────────────────────────────────────

app.get('/api/venues/bookings', auth, (req, res) => {
  const db = readDb();
  res.json({ bookings: db.bookings.filter(b => b.organizerId === req.user.id) });
});

app.post('/api/venues/bookings', auth, (req, res) => {
  const db = readDb();
  const booking = { id: uid(), organizerId: req.user.id, status: 'PENDING', ...req.body, createdAt: new Date().toISOString() };
  db.bookings.push(booking);
  writeDb(db);
  res.status(201).json({ booking });
});

app.delete('/api/venues/bookings/:id', auth, (req, res) => {
  const db = readDb();
  db.bookings = db.bookings.filter(b => b.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Booking cancelled' });
});

app.get('/api/venues', auth, (req, res) => {
  const db = readDb();
  res.json({ venues: db.venues });
});

app.get('/api/venues/:id', auth, (req, res) => {
  const db = readDb();
  const venue = db.venues.find(v => v.id === req.params.id);
  if (!venue) return res.status(404).json({ message: 'Venue not found' });
  res.json({ venue });
});

// ── Stakeholders ──────────────────────────────────────────────────────────────

app.get('/api/events/:eventId/stakeholders', auth, (req, res) => {
  const db = readDb();
  res.json({ stakeholders: db.stakeholders.filter(s => s.eventId === req.params.eventId) });
});

app.post('/api/events/:eventId/stakeholders', auth, (req, res) => {
  const db = readDb();
  const s = { id: uid(), eventId: req.params.eventId, role: 'OTHER', ...req.body, createdAt: new Date().toISOString() };
  db.stakeholders.push(s);
  writeDb(db);
  res.status(201).json({ stakeholder: s });
});

app.put('/api/events/:eventId/stakeholders/:id', auth, (req, res) => {
  const db = readDb();
  const idx = db.stakeholders.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.stakeholders[idx] = { ...db.stakeholders[idx], ...req.body };
  writeDb(db);
  res.json({ stakeholder: db.stakeholders[idx] });
});

app.delete('/api/events/:eventId/stakeholders/:id', auth, (req, res) => {
  const db = readDb();
  db.stakeholders = db.stakeholders.filter(s => s.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Deleted' });
});

// ── Tasks ─────────────────────────────────────────────────────────────────────

app.get('/api/tasks/reminders', auth, (req, res) => {
  const db = readDb();
  const now = new Date();
  res.json({ reminders: db.tasks.filter(t => t.reminderAt && new Date(t.reminderAt) <= now) });
});

app.get('/api/events/:eventId/tasks', auth, (req, res) => {
  const db = readDb();
  res.json({ tasks: db.tasks.filter(t => t.eventId === req.params.eventId) });
});

app.post('/api/events/:eventId/tasks', auth, (req, res) => {
  const db = readDb();
  const task = { id: uid(), eventId: req.params.eventId, status: 'TODO', priority: 'MEDIUM', ...req.body, createdAt: new Date().toISOString() };
  db.tasks.push(task);
  writeDb(db);
  res.status(201).json({ task });
});

app.put('/api/events/:eventId/tasks/:id', auth, (req, res) => {
  const db = readDb();
  const idx = db.tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.tasks[idx] = { ...db.tasks[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeDb(db);
  res.json({ task: db.tasks[idx] });
});

app.delete('/api/events/:eventId/tasks/:id', auth, (req, res) => {
  const db = readDb();
  db.tasks = db.tasks.filter(t => t.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Deleted' });
});

// ── Budget ────────────────────────────────────────────────────────────────────

app.get('/api/events/:eventId/budget', auth, (req, res) => {
  const db = readDb();
  res.json({
    categories: db.budgetCategories.filter(c => c.eventId === req.params.eventId),
    expenses: db.expenses.filter(e => e.eventId === req.params.eventId),
  });
});

app.post('/api/events/:eventId/budget/categories', auth, (req, res) => {
  const db = readDb();
  const cat = { id: uid(), eventId: req.params.eventId, ...req.body };
  db.budgetCategories.push(cat);
  writeDb(db);
  res.status(201).json({ category: cat });
});

app.put('/api/events/:eventId/budget/categories/:id', auth, (req, res) => {
  const db = readDb();
  const idx = db.budgetCategories.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.budgetCategories[idx] = { ...db.budgetCategories[idx], ...req.body };
  writeDb(db);
  res.json({ category: db.budgetCategories[idx] });
});

app.delete('/api/events/:eventId/budget/categories/:id', auth, (req, res) => {
  const db = readDb();
  db.budgetCategories = db.budgetCategories.filter(c => c.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Deleted' });
});

app.post('/api/events/:eventId/budget/expenses', auth, (req, res) => {
  const db = readDb();
  const exp = { id: uid(), eventId: req.params.eventId, expenseDate: new Date().toISOString(), createdAt: new Date().toISOString(), ...req.body };
  db.expenses.push(exp);
  writeDb(db);
  res.status(201).json({ expense: exp });
});

app.delete('/api/events/:eventId/budget/expenses/:id', auth, (req, res) => {
  const db = readDb();
  db.expenses = db.expenses.filter(e => e.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Deleted' });
});

// ── Floor Plans ───────────────────────────────────────────────────────────────

app.get('/api/events/:eventId/floor-plans', auth, (req, res) => {
  const db = readDb();
  res.json({ floorPlans: db.floorPlans.filter(f => f.eventId === req.params.eventId) });
});

app.get('/api/events/:eventId/floor-plans/:id', auth, (req, res) => {
  const db = readDb();
  const fp = db.floorPlans.find(f => f.id === req.params.id);
  if (!fp) return res.status(404).json({ message: 'Not found' });
  res.json({ floorPlan: fp });
});

app.post('/api/events/:eventId/floor-plans', auth, (req, res) => {
  const db = readDb();
  const fp = { id: uid(), eventId: req.params.eventId, canvasData: '{}', width: 800, height: 600, ...req.body, createdAt: new Date().toISOString() };
  db.floorPlans.push(fp);
  writeDb(db);
  res.status(201).json({ floorPlan: fp });
});

app.put('/api/events/:eventId/floor-plans/:id', auth, (req, res) => {
  const db = readDb();
  const idx = db.floorPlans.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.floorPlans[idx] = { ...db.floorPlans[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeDb(db);
  res.json({ floorPlan: db.floorPlans[idx] });
});

app.delete('/api/events/:eventId/floor-plans/:id', auth, (req, res) => {
  const db = readDb();
  db.floorPlans = db.floorPlans.filter(f => f.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Deleted' });
});

// ── Staff ─────────────────────────────────────────────────────────────────────

app.get('/api/events/:eventId/staff', auth, (req, res) => {
  const db = readDb();
  res.json({ staff: db.staff.filter(s => s.eventId === req.params.eventId) });
});

app.post('/api/events/:eventId/staff', auth, (req, res) => {
  const db = readDb();
  const member = { id: uid(), eventId: req.params.eventId, status: 'ACTIVE', ...req.body, createdAt: new Date().toISOString() };
  db.staff.push(member);
  writeDb(db);
  res.status(201).json({ staff: member });
});

app.put('/api/events/:eventId/staff/:id', auth, (req, res) => {
  const db = readDb();
  const idx = db.staff.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.staff[idx] = { ...db.staff[idx], ...req.body };
  writeDb(db);
  res.json({ staff: db.staff[idx] });
});

app.delete('/api/events/:eventId/staff/:id', auth, (req, res) => {
  const db = readDb();
  db.staff = db.staff.filter(s => s.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Deleted' });
});

app.put('/api/events/:eventId/staff/:staffId/tasks/:taskId', auth, (req, res) => {
  const db = readDb();
  const idx = db.tasks.findIndex(t => t.id === req.params.taskId);
  if (idx === -1) return res.status(404).json({ message: 'Task not found' });
  db.tasks[idx].staffId = req.params.staffId;
  writeDb(db);
  res.json({ task: db.tasks[idx] });
});

// ── Vendors ───────────────────────────────────────────────────────────────────

app.get('/api/vendors', auth, (req, res) => {
  const db = readDb();
  res.json({ vendors: db.vendors });
});

app.get('/api/events/:eventId/vendors/vendors', auth, (req, res) => {
  const db = readDb();
  res.json({ vendors: db.eventVendors.filter(v => v.eventId === req.params.eventId) });
});

app.post('/api/events/:eventId/vendors/vendors', auth, (req, res) => {
  const db = readDb();
  const ev = { id: uid(), eventId: req.params.eventId, status: 'ACTIVE', ...req.body };
  db.eventVendors.push(ev);
  writeDb(db);
  res.status(201).json({ vendor: ev });
});

app.get('/api/events/:eventId/vendors/sourcing', auth, (req, res) => {
  const db = readDb();
  res.json({ sourcing: db.sourcingRequests.filter(s => s.eventId === req.params.eventId) });
});

app.post('/api/events/:eventId/vendors/sourcing', auth, (req, res) => {
  const db = readDb();
  const sr = { id: uid(), eventId: req.params.eventId, status: 'DRAFT', requestedAt: new Date().toISOString(), ...req.body };
  db.sourcingRequests.push(sr);
  writeDb(db);
  res.status(201).json({ sourcing: sr });
});

app.put('/api/events/:eventId/vendors/sourcing/:id', auth, (req, res) => {
  const db = readDb();
  const idx = db.sourcingRequests.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.sourcingRequests[idx] = { ...db.sourcingRequests[idx], ...req.body };
  writeDb(db);
  res.json({ sourcing: db.sourcingRequests[idx] });
});

app.post('/api/events/:eventId/vendors/deliveries', auth, (req, res) => {
  const db = readDb();
  const d = { id: uid(), status: 'SCHEDULED', createdAt: new Date().toISOString(), ...req.body };
  db.deliveries.push(d);
  writeDb(db);
  res.status(201).json({ delivery: d });
});

app.put('/api/events/:eventId/vendors/deliveries/:id', auth, (req, res) => {
  const db = readDb();
  const idx = db.deliveries.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.deliveries[idx] = { ...db.deliveries[idx], ...req.body };
  writeDb(db);
  res.json({ delivery: db.deliveries[idx] });
});

app.post('/api/events/:eventId/vendors/invoices', auth, (req, res) => {
  const db = readDb();
  const inv = { id: uid(), status: 'DRAFT', createdAt: new Date().toISOString(), ...req.body };
  db.invoices.push(inv);
  writeDb(db);
  res.status(201).json({ invoice: inv });
});

app.put('/api/events/:eventId/vendors/invoices/:id', auth, (req, res) => {
  const db = readDb();
  const idx = db.invoices.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.invoices[idx] = { ...db.invoices[idx], ...req.body };
  writeDb(db);
  res.json({ invoice: db.invoices[idx] });
});

// ── Guests ────────────────────────────────────────────────────────────────────

app.get('/api/events/:eventId/guests/stats', auth, (req, res) => {
  const db = readDb();
  const guests = db.guests.filter(g => g.eventId === req.params.eventId);
  res.json({
    total: guests.length,
    confirmed: guests.filter(g => g.rsvpStatus === 'CONFIRMED').length,
    declined: guests.filter(g => g.rsvpStatus === 'DECLINED').length,
    pending: guests.filter(g => g.rsvpStatus === 'PENDING').length,
  });
});

app.get('/api/events/:eventId/guests/feedback', auth, (req, res) => {
  const db = readDb();
  res.json({ feedback: db.feedback.filter(f => f.eventId === req.params.eventId) });
});

app.post('/api/events/:eventId/guests/send-invitations', auth, (req, res) => {
  const db = readDb();
  const { guestIds } = req.body;
  db.guests.forEach(g => {
    if (guestIds.includes(g.id)) g.invitationSentAt = new Date().toISOString();
  });
  writeDb(db);
  res.json({ message: `Invitations sent to ${guestIds.length} guests` });
});

app.get('/api/events/:eventId/guests', auth, (req, res) => {
  const db = readDb();
  res.json({ guests: db.guests.filter(g => g.eventId === req.params.eventId) });
});

app.post('/api/events/:eventId/guests', auth, (req, res) => {
  const db = readDb();
  const guest = { id: uid(), eventId: req.params.eventId, rsvpStatus: 'PENDING', createdAt: new Date().toISOString(), ...req.body };
  db.guests.push(guest);
  writeDb(db);
  res.status(201).json({ guest });
});

app.put('/api/events/:eventId/guests/:id', auth, (req, res) => {
  const db = readDb();
  const idx = db.guests.findIndex(g => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  db.guests[idx] = { ...db.guests[idx], ...req.body };
  writeDb(db);
  res.json({ guest: db.guests[idx] });
});

app.delete('/api/events/:eventId/guests/:id', auth, (req, res) => {
  const db = readDb();
  db.guests = db.guests.filter(g => g.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Deleted' });
});

// ── Guest Journey (Public — no auth required) ─────────────────────────────────

app.get('/api/invitation', (req, res) => {
  const db = readDb();
  res.json(db.invitation || {});
});

app.get('/api/messages', (req, res) => {
  const db = readDb();
  res.json(db.guestMessages || []);
});

app.post('/api/rsvp', (req, res) => {
  const { attendance, dietaryPreference, specialRequirements } = req.body;
  if (!attendance) return res.status(400).json({ message: 'Attendance status is required' });
  const db = readDb();
  const rsvp = {
    id: Date.now(),
    attendance,
    dietaryPreference: dietaryPreference || '',
    specialRequirements: specialRequirements || '',
    submittedAt: new Date().toISOString(),
  };
  if (!db.guestRsvps) db.guestRsvps = [];
  db.guestRsvps.push(rsvp);
  writeDb(db);
  res.json({ message: 'RSVP submitted successfully', rsvp });
});

app.post('/api/check-in', (req, res) => {
  const { guestName, qrCode } = req.body;
  if (!guestName || !qrCode) return res.status(400).json({ message: 'Guest name and QR code are required' });
  const db = readDb();
  const checkIn = {
    id: Date.now(),
    guestName,
    qrCode,
    checkedInAt: new Date().toISOString(),
  };
  if (!db.checkIns) db.checkIns = [];
  db.checkIns.push(checkIn);
  writeDb(db);
  res.json({ message: 'Check-in confirmed. Welcome to the event!', checkIn });
});

app.post('/api/feedback', (req, res) => {
  const { overallExperience, foodRating, venueRating, organizationRating, comments } = req.body;
  if (!overallExperience || !foodRating || !venueRating || !organizationRating)
    return res.status(400).json({ message: 'All rating fields are required' });
  const db = readDb();
  const fb = {
    id: Date.now(),
    overallExperience,
    foodRating,
    venueRating,
    organizationRating,
    comments: comments || '',
    submittedAt: new Date().toISOString(),
  };
  if (!db.publicFeedback) db.publicFeedback = [];
  db.publicFeedback.push(fb);
  writeDb(db);
  res.json({ message: 'Thank you for submitting your feedback!', feedback: fb });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Backend-ys server running on http://localhost:${PORT}`);
});
