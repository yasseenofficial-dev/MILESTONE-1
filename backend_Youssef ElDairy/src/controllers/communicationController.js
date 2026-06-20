const { readDB, writeDB, nextId } = require('../config/db');
const { userHasEventAccess } = require('./eventController');

function listCommunications(req, res, next) {
  try {
    const db = readDB();
    const { eventId } = req.query;
    if (!eventId) {
      res.status(400);
      throw new Error('eventId is required');
    }
    if (!userHasEventAccess(db, req.user, eventId)) {
      res.status(403);
      throw new Error('No access to communications');
    }

    const communications = db.communications
      .filter(item => item.eventId === eventId)
      .map(comm => {
        const statuses = db.communicationStatuses
          .filter(status => status.communicationId === comm.id)
          .map(status => ({
            ...status,
            guest: db.guests.find(guest => guest.id === status.guestId)
          }));
        return {
          ...comm,
          statuses,
          summary: {
            totalRecipients: statuses.length,
            received: statuses.filter(item => item.received).length,
            seen: statuses.filter(item => item.seen).length,
            unseen: statuses.filter(item => !item.seen).length
          }
        };
      })
      .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

    res.json({ communications });
  } catch (error) {
    next(error);
  }
}

function createCommunication(req, res, next) {
  try {
    const db = readDB();
    const { eventId, title, message, audience = 'all-guests' } = req.body;
    if (!eventId || !title || !message) {
      res.status(400);
      throw new Error('eventId, title and message are required');
    }
    if (!userHasEventAccess(db, req.user, eventId)) {
      res.status(403);
      throw new Error('No access to event communications');
    }

    let guests = db.guests.filter(guest => guest.eventId === eventId);
    if (audience === 'not-arrived') guests = guests.filter(guest => guest.checkInStatus !== 'checked-in');
    if (audience === 'attending') guests = guests.filter(guest => guest.rsvpStatus === 'Attending');

    const communication = {
      id: nextId(db.communications, 'comm'),
      eventId,
      title,
      message,
      audience,
      sentBy: req.user.id,
      sentAt: new Date().toISOString(),
      type: 'day-of'
    };
    db.communications.push(communication);

    guests.forEach((guest, index) => {
      db.communicationStatuses.push({
        id: nextId(db.communicationStatuses, 'cs'),
        communicationId: communication.id,
        guestId: guest.id,
        received: true,
        receivedAt: new Date().toISOString(),
        seen: index % 3 !== 0,
        seenAt: index % 3 !== 0 ? new Date().toISOString() : null
      });
    });

    writeDB(db);
    res.status(201).json({ communication });
  } catch (error) {
    next(error);
  }
}

function createFollowUp(req, res, next) {
  try {
    const db = readDB();
    const { id } = req.params;
    const { title, message } = req.body;
    const original = db.communications.find(item => item.id === id);
    if (!original) {
      res.status(404);
      throw new Error('Original communication not found');
    }
    if (!userHasEventAccess(db, req.user, original.eventId)) {
      res.status(403);
      throw new Error('No access to this communication');
    }
    if (!title || !message) {
      res.status(400);
      throw new Error('title and message are required');
    }

    const unseenStatuses = db.communicationStatuses.filter(status => status.communicationId === id && !status.seen);
    const communication = {
      id: nextId(db.communications, 'comm'),
      eventId: original.eventId,
      title,
      message,
      audience: 'unseen-guests-follow-up',
      parentCommunicationId: original.id,
      sentBy: req.user.id,
      sentAt: new Date().toISOString(),
      type: 'follow-up'
    };
    db.communications.push(communication);

    unseenStatuses.forEach(status => {
      db.communicationStatuses.push({
        id: nextId(db.communicationStatuses, 'cs'),
        communicationId: communication.id,
        guestId: status.guestId,
        received: true,
        receivedAt: new Date().toISOString(),
        seen: false,
        seenAt: null
      });
    });

    writeDB(db);
    res.status(201).json({ communication, recipients: unseenStatuses.length });
  } catch (error) {
    next(error);
  }
}

module.exports = { listCommunications, createCommunication, createFollowUp };
