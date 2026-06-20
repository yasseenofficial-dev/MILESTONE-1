const { readDB } = require('../config/db');

function userHasEventAccess(db, user, eventId) {
  if (user.role === 'organizer') {
    return db.events.some(event => event.id === eventId && event.organizerId === user.id);
  }
  if (user.role === 'staff') {
    return db.eventStaff.some(row => row.eventId === eventId && row.staffId === user.id);
  }
  return false;
}

function listEvents(req, res, next) {
  try {
    const db = readDB();
    const { date } = req.query;
    let events = [];

    if (req.user.role === 'organizer') {
      events = db.events.filter(event => event.organizerId === req.user.id);
    } else if (req.user.role === 'staff') {
      const ids = db.eventStaff.filter(row => row.staffId === req.user.id).map(row => row.eventId);
      events = db.events.filter(event => ids.includes(event.id));
    }

    if (date) {
      events = events.filter(event => event.date === date);
    }

    res.json({ events });
  } catch (error) {
    next(error);
  }
}

function getDayOfDashboard(req, res, next) {
  try {
    const db = readDB();
    const { id } = req.params;
    if (!userHasEventAccess(db, req.user, id)) {
      res.status(403);
      throw new Error('No access to this event');
    }

    const event = db.events.find(item => item.id === id);
    const guests = db.guests.filter(item => item.eventId === id);
    const tasks = db.tasks.filter(item => item.eventId === id);
    const eventVendors = db.eventVendors.filter(item => item.eventId === id);
    const communications = db.communications.filter(item => item.eventId === id);
    const communicationIds = communications.map(item => item.id);
    const statuses = db.communicationStatuses.filter(item => communicationIds.includes(item.communicationId));

    const arrivedGuests = guests.filter(guest => guest.checkInStatus === 'checked-in').length;
    const doneTasks = tasks.filter(task => task.status === 'done').length;
    const arrivedVendors = eventVendors.filter(vendor => vendor.arrivalStatus === 'arrived').length;
    const seenMessages = statuses.filter(status => status.seen).length;

    res.json({
      event,
      metrics: {
        totalGuests: guests.length,
        arrivedGuests,
        waitingGuests: guests.length - arrivedGuests,
        totalTasks: tasks.length,
        doneTasks,
        taskCompletionRate: tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0,
        totalVendors: eventVendors.length,
        arrivedVendors,
        vendorArrivalRate: eventVendors.length ? Math.round((arrivedVendors / eventVendors.length) * 100) : 0,
        totalMessagesSent: communications.length,
        totalMessageStatuses: statuses.length,
        seenMessages
      },
      recentTasks: tasks.slice(0, 6),
      vendorStatus: eventVendors.map(row => ({
        ...row,
        vendor: db.vendors.find(vendor => vendor.id === row.vendorId)
      })),
      recentCommunications: communications.slice(-4).reverse()
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { listEvents, getDayOfDashboard, userHasEventAccess };
