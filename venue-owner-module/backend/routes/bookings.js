const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../db");
const { authMiddleware } = require("../auth");

const router = express.Router();
router.use(authMiddleware);

function ownerListingIds(db, ownerId) {
  return db.listings.filter((l) => l.ownerId === ownerId).map((l) => l.id);
}

// 24. Booking Request Management ----------------------------------------

// View all booking requests for this owner's listings (notifications of new requests
// + history of all requests and their statuses), optionally filtered by status
router.get("/requests", (req, res) => {
  const db = readDB();
  const myListingIds = ownerListingIds(db, req.owner.id);
  let requests = db.bookingRequests.filter((r) => myListingIds.includes(r.listingId));

  const { status } = req.query; // Pending | Approved | Declined
  if (status) {
    requests = requests.filter((r) => r.status.toLowerCase() === status.toLowerCase());
  }

  // attach listing name for convenience
  requests = requests.map((r) => ({
    ...r,
    listingName: db.listings.find((l) => l.id === r.listingId)?.name || null
  }));

  res.json(requests);
});

// View a single booking request's details
router.get("/requests/:id", (req, res) => {
  const db = readDB();
  const myListingIds = ownerListingIds(db, req.owner.id);
  const request = db.bookingRequests.find(
    (r) => r.id === req.params.id && myListingIds.includes(r.listingId)
  );
  if (!request) return res.status(404).json({ error: "Booking request not found" });
  res.json(request);
});

// Approve or decline a booking request, optionally with a message / counter-proposal
router.patch("/requests/:id/respond", (req, res) => {
  const db = readDB();
  const myListingIds = ownerListingIds(db, req.owner.id);
  const request = db.bookingRequests.find(
    (r) => r.id === req.params.id && myListingIds.includes(r.listingId)
  );
  if (!request) return res.status(404).json({ error: "Booking request not found" });

  const { decision, message, counterProposal } = req.body;
  if (!["Approved", "Declined"].includes(decision)) {
    return res.status(400).json({ error: "decision must be 'Approved' or 'Declined'" });
  }

  request.status = decision;
  request.ownerMessage = message || null;
  request.counterProposal = counterProposal || null;
  request.respondedAt = new Date().toISOString();

  // If approved, create a confirmed booking record
  if (decision === "Approved") {
    const booking = {
      id: uuidv4(),
      requestId: request.id,
      listingId: request.listingId,
      organizerName: request.organizerName,
      organizerContact: request.organizerContact || null,
      eventType: request.eventType,
      eventDate: request.eventDate,
      expectedAttendees: request.expectedAttendees,
      specialRequirements: request.specialRequirements || null,
      status: "Confirmed",
      createdAt: new Date().toISOString()
    };
    db.bookings.push(booking);
  }

  writeDB(db);
  res.json(request);
});

// Send a follow-up message / counter-proposal to the organizer without changing status
router.post("/requests/:id/message", (req, res) => {
  const db = readDB();
  const myListingIds = ownerListingIds(db, req.owner.id);
  const request = db.bookingRequests.find(
    (r) => r.id === req.params.id && myListingIds.includes(r.listingId)
  );
  if (!request) return res.status(404).json({ error: "Booking request not found" });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "message is required" });

  request.messages = request.messages || [];
  request.messages.push({ from: "owner", message, sentAt: new Date().toISOString() });
  writeDB(db);
  res.json(request);
});

// 25. Booking Overview ----------------------------------------------------

// View a calendar/list of all confirmed bookings across listings, filterable
// by date range, venue, or status
router.get("/bookings", (req, res) => {
  const db = readDB();
  const myListingIds = ownerListingIds(db, req.owner.id);
  let bookings = db.bookings.filter((b) => myListingIds.includes(b.listingId));

  const { from, to, listingId, status } = req.query;
  if (listingId) bookings = bookings.filter((b) => b.listingId === listingId);
  if (status) bookings = bookings.filter((b) => b.status.toLowerCase() === status.toLowerCase());
  if (from) bookings = bookings.filter((b) => b.eventDate >= from);
  if (to) bookings = bookings.filter((b) => b.eventDate <= to);

  bookings = bookings
    .map((b) => ({
      ...b,
      listingName: db.listings.find((l) => l.id === b.listingId)?.name || null
    }))
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate));

  res.json(bookings);
});

// Access organizer contact details for a confirmed booking
router.get("/bookings/:id", (req, res) => {
  const db = readDB();
  const myListingIds = ownerListingIds(db, req.owner.id);
  const booking = db.bookings.find(
    (b) => b.id === req.params.id && myListingIds.includes(b.listingId)
  );
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.json(booking);
});

// Upcoming confirmed bookings (for reminders)
router.get("/bookings-upcoming", (req, res) => {
  const db = readDB();
  const myListingIds = ownerListingIds(db, req.owner.id);
  const today = new Date().toISOString().slice(0, 10);

  const upcoming = db.bookings
    .filter((b) => myListingIds.includes(b.listingId) && b.eventDate >= today && b.status === "Confirmed")
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
    .slice(0, 10)
    .map((b) => ({
      ...b,
      listingName: db.listings.find((l) => l.id === b.listingId)?.name || null
    }));

  res.json(upcoming);
});

module.exports = router;
