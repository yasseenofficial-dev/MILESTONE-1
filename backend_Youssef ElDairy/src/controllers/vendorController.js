const { readDB, writeDB } = require('../config/db');
const { userHasEventAccess } = require('./eventController');

function listEventVendors(req, res, next) {
  try {
    const db = readDB();
    const { eventId } = req.params;
    if (!userHasEventAccess(db, req.user, eventId)) {
      res.status(403);
      throw new Error('No access to event vendors');
    }

    const eventVendors = db.eventVendors
      .filter(row => row.eventId === eventId)
      .map(row => ({ ...row, vendor: db.vendors.find(vendor => vendor.id === row.vendorId) }));

    res.json({ eventVendors });
  } catch (error) {
    next(error);
  }
}

function updateArrival(req, res, next) {
  try {
    const db = readDB();
    const { id } = req.params;
    const { arrivalStatus, deliveryStatus, note } = req.body;
    const eventVendor = db.eventVendors.find(row => row.id === id);

    if (!eventVendor) {
      res.status(404);
      throw new Error('Vendor delivery record not found');
    }
    if (!userHasEventAccess(db, req.user, eventVendor.eventId)) {
      res.status(403);
      throw new Error('No access to this vendor delivery');
    }

    if (arrivalStatus) {
      if (!['not-arrived', 'arrived', 'delayed'].includes(arrivalStatus)) {
        res.status(400);
        throw new Error('Invalid arrival status');
      }
      eventVendor.arrivalStatus = arrivalStatus;
    }

    if (deliveryStatus) {
      if (!['Preparing', 'Out for Delivery', 'Delivered', 'Delayed'].includes(deliveryStatus)) {
        res.status(400);
        throw new Error('Invalid delivery status');
      }
      eventVendor.deliveryStatus = deliveryStatus;
    }

    if (note !== undefined) eventVendor.arrivalNote = note;
    eventVendor.arrivalLoggedBy = req.user.id;
    eventVendor.arrivalLoggedAt = new Date().toISOString();

    writeDB(db);
    res.json({ eventVendor });
  } catch (error) {
    next(error);
  }
}

module.exports = { listEventVendors, updateArrival };
