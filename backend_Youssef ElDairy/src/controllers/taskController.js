const { readDB, writeDB } = require('../config/db');
const { userHasEventAccess } = require('./eventController');

const VALID_STATUSES = ['not started', 'pending', 'in progress', 'done', 'blocked'];

function listTasks(req, res, next) {
  try {
    const db = readDB();
    const { eventId, status, assignedToMe } = req.query;
    let tasks = db.tasks;

    if (req.user.role === 'staff' || assignedToMe === 'true') {
      tasks = tasks.filter(task => task.assignedTo === req.user.id);
    } else if (req.user.role === 'organizer') {
      const eventIds = db.events.filter(event => event.organizerId === req.user.id).map(event => event.id);
      tasks = tasks.filter(task => eventIds.includes(task.eventId));
    }

    if (eventId) tasks = tasks.filter(task => task.eventId === eventId);
    if (status && status !== 'all') tasks = tasks.filter(task => task.status === status);

    const enriched = tasks.map(task => ({
      ...task,
      event: db.events.find(event => event.id === task.eventId),
      assignee: db.users.find(user => user.id === task.assignedTo)
    }));

    res.json({ tasks: enriched });
  } catch (error) {
    next(error);
  }
}

function updateTask(req, res, next) {
  try {
    const db = readDB();
    const { id } = req.params;
    const { status, progress, note } = req.body;
    const task = db.tasks.find(item => item.id === id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (!userHasEventAccess(db, req.user, task.eventId)) {
      res.status(403);
      throw new Error('No access to this task');
    }

    if (req.user.role === 'staff' && task.assignedTo !== req.user.id) {
      res.status(403);
      throw new Error('Staff can only update tasks assigned to them');
    }

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        res.status(400);
        throw new Error('Invalid task status');
      }
      task.status = status;
    }

    if (progress !== undefined) {
      const value = Number(progress);
      if (!Number.isFinite(value) || value < 0 || value > 100) {
        res.status(400);
        throw new Error('Progress must be between 0 and 100');
      }
      task.progress = value;
    }

    if (note !== undefined) task.note = note;
    task.updatedAt = new Date().toISOString();
    if (task.status === 'done') {
      task.progress = 100;
      task.completedAt = new Date().toISOString();
    }

    writeDB(db);
    res.json({ task });
  } catch (error) {
    next(error);
  }
}

module.exports = { listTasks, updateTask };
