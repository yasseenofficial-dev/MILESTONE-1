const express = require("express");
const { readDB } = require("../db");
const { authMiddleware } = require("../auth");

const router = express.Router();
router.use(authMiddleware);

function buildSummary(db, ownerId) {
  const listings = db.listings.filter((l) => l.ownerId === ownerId);
  const listingIds = listings.map((l) => l.id);

  const requests = db.bookingRequests.filter((r) => listingIds.includes(r.listingId));
  const bookings = db.bookings.filter((b) => listingIds.includes(b.listingId));

  const perListing = listings.map((l) => {
    const listingRequests = requests.filter((r) => r.listingId === l.id);
    const listingBookings = bookings.filter((b) => b.listingId === l.id);
    const totalRequests = listingRequests.length;
    const approved = listingRequests.filter((r) => r.status === "Approved").length;
    const bookingRate = totalRequests > 0 ? Number(((approved / totalRequests) * 100).toFixed(1)) : 0;
    const revenue = listingBookings.reduce((sum, b) => {
      const amount = (l.pricing && l.pricing.amount) || 0;
      return sum + amount;
    }, 0);

    return {
      listingId: l.id,
      listingName: l.name,
      totalBookings: listingBookings.length,
      totalRequests,
      bookingRate,
      revenue,
      currency: (l.pricing && l.pricing.currency) || "EGP"
    };
  });

  const totals = {
    totalListings: listings.length,
    totalBookings: bookings.length,
    totalRequests: requests.length,
    totalRevenue: perListing.reduce((sum, p) => sum + p.revenue, 0)
  };

  return { totals, perListing };
}

// Summary dashboard: total bookings, booking rate, and revenue per listing
router.get("/summary", (req, res) => {
  const db = readDB();
  res.json(buildSummary(db, req.owner.id));
});

// Historical booking data and revenue, optionally filtered by date range
router.get("/history", (req, res) => {
  const db = readDB();
  const listingIds = db.listings.filter((l) => l.ownerId === req.owner.id).map((l) => l.id);
  let bookings = db.bookings.filter((b) => listingIds.includes(b.listingId));

  const { from, to } = req.query;
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

// Export report (returns JSON payload the frontend can download as a .json/.csv file;
// in a production system this would generate a real PDF/Excel file)
router.get("/export", (req, res) => {
  const db = readDB();
  const summary = buildSummary(db, req.owner.id);
  res.setHeader("Content-Disposition", "attachment; filename=venue-performance-report.json");
  res.setHeader("Content-Type", "application/json");
  res.json({
    generatedAt: new Date().toISOString(),
    ownerId: req.owner.id,
    ...summary
  });
});

module.exports = router;
