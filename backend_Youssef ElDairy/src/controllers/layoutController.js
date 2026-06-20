const { readDB } = require('../config/db');
const { userHasEventAccess } = require('./eventController');

function getLayoutByEvent(req, res, next) {
  try {
    const db = readDB();
    const { eventId } = req.params;
    if (!userHasEventAccess(db, req.user, eventId)) {
      res.status(403);
      throw new Error('No access to this event layout');
    }

    const layout = db.layouts.find(item => item.eventId === eventId);
    if (!layout) {
      res.status(404);
      throw new Error('Layout not found for this event');
    }

    res.json({ layout, event: db.events.find(event => event.id === eventId) });
  } catch (error) {
    next(error);
  }
}

module.exports = { getLayoutByEvent };
