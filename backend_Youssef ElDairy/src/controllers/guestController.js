const { readDB, writeDB } = require('../config/db');
const { userHasEventAccess } = require('./eventController');

function listGuests(req, res, next) {
  try {
    const db = readDB();
    const { eventId, status, rsvp, search } = req.query;
    if (!eventId) {
      res.status(400);
      throw new Error('eventId is required');
    }
    if (!userHasEventAccess(db, req.user, eventId)) {
      res.status(403);
      throw new Error('No access to guest list');
    }

    let guests = db.guests.filter(guest => guest.eventId === eventId);
    if (status && status !== 'all') guests = guests.filter(guest => guest.checkInStatus === status);
    if (rsvp && rsvp !== 'all') guests = guests.filter(guest => guest.rsvpStatus === rsvp);
    if (search) {
      const q = search.toLowerCase();
      guests = guests.filter(guest => guest.name.toLowerCase().includes(q) || guest.email.toLowerCase().includes(q));
    }

    res.json({ guests });
  } catch (error) {
    next(error);
  }
}

function updateCheckIn(req, res, next) {
  try {
    const db = readDB();
    const { id } = req.params;
    const { checkInStatus } = req.body;
    const guest = db.guests.find(item => item.id === id);

    if (!guest) {
      res.status(404);
      throw new Error('Guest not found');
    }
    if (!userHasEventAccess(db, req.user, guest.eventId)) {
      res.status(403);
      throw new Error('No access to this guest');
    }
    if (!['not-arrived', 'checked-in', 'left'].includes(checkInStatus)) {
      res.status(400);
      throw new Error('Invalid check-in status');
    }

    guest.checkInStatus = checkInStatus;
    guest.checkedInAt = checkInStatus === 'checked-in' ? new Date().toISOString() : null;
    guest.checkedInBy = checkInStatus === 'checked-in' ? req.user.id : null;

    writeDB(db);
    res.json({ guest });
  } catch (error) {
    next(error);
  }
}

module.exports = { listGuests, updateCheckIn };
