const { readDB } = require('../config/db');
const { userHasEventAccess } = require('./eventController');

function listFeedback(req, res, next) {
  try {
    const db = readDB();
    const { eventId } = req.query;
    if (!eventId) {
      res.status(400);
      throw new Error('eventId is required');
    }
    if (!userHasEventAccess(db, req.user, eventId)) {
      res.status(403);
      throw new Error('No access to feedback');
    }
    const feedback = db.feedback.filter(item => item.eventId === eventId);
    res.json({ feedback });
  } catch (error) {
    next(error);
  }
}

module.exports = { listFeedback };
