const express = require("express");
const router = express.Router();

const { getClientInvoices } = require("../controllers/invoiceController");

const {
  createEvent,
  getEvents,
  getEventById,
  createRequest,
  getClientRequests,
  getClientRequestById,
  getClientDeliveries,
  getClientDeliveryById
} = require("../controllers/clientController");

// Import fakeEvents for manual event creation
const { fakeEvents } = require("../Database/fakeData");

// EVENTS
router.get("/events", getEvents);
router.get("/events/:id", getEventById);

// This is the ONLY correct create event route
router.post("/events", (req, res) => {
  const { eventName, date, location, totalGuests } = req.body;

  const newEvent = {
    id: fakeEvents.length + 1,
    eventName,
    date,
    location,
    totalGuests
  };

  fakeEvents.push(newEvent);

  res.json({ success: true, event: newEvent });
});

// REQUESTS
router.post("/requests/create", createRequest);
router.get("/requests", getClientRequests);
router.get("/requests/:id", getClientRequestById);

// DELIVERIES
router.get("/deliveries", getClientDeliveries);
router.get("/deliveries/:id", getClientDeliveryById);

// INVOICES
router.get("/invoices", getClientInvoices);

module.exports = router;
