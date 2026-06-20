const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../db");
const { authMiddleware } = require("../auth");

const router = express.Router();
router.use(authMiddleware);

function getOwnedListing(db, listingId, ownerId) {
  const listing = db.listings.find((l) => l.id === listingId);
  if (!listing) return { error: 404, message: "Listing not found" };
  if (listing.ownerId !== ownerId) return { error: 403, message: "Not your listing" };
  return { listing };
}

// View all listings belonging to the logged-in owner
router.get("/", (req, res) => {
  const db = readDB();
  const listings = db.listings.filter((l) => l.ownerId === req.owner.id);
  res.json(listings);
});

// Create a new venue listing
router.post("/", (req, res) => {
  const {
    name,
    description,
    location,
    capacity,
    dimensionsSqm,
    amenities,
    pricing
  } = req.body;

  if (!name || !location || !capacity) {
    return res.status(400).json({ error: "name, location and capacity are required" });
  }

  const db = readDB();
  const newListing = {
    id: uuidv4(),
    ownerId: req.owner.id,
    name,
    description: description || "",
    location,
    capacity,
    dimensionsSqm: dimensionsSqm || null,
    amenities: amenities || [],
    pricing: pricing || { amount: 0, currency: "EGP", unit: "per_day" },
    photos: [],
    floorPlans: [],
    availability: [], // [{date: "2026-07-01", status: "available" | "unavailable"}]
    status: "active", // active | deactivated
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.listings.push(newListing);
  writeDB(db);
  res.status(201).json(newListing);
});

// View a single listing
router.get("/:id", (req, res) => {
  const db = readDB();
  const { listing, error, message } = getOwnedListing(db, req.params.id, req.owner.id);
  if (error) return res.status(error).json({ error: message });
  res.json(listing);
});

// Edit/update an existing listing (pricing, availability, description, photos, etc.)
router.put("/:id", (req, res) => {
  const db = readDB();
  const { listing, error, message } = getOwnedListing(db, req.params.id, req.owner.id);
  if (error) return res.status(error).json({ error: message });

  const editableFields = [
    "name",
    "description",
    "location",
    "capacity",
    "dimensionsSqm",
    "amenities",
    "pricing"
  ];
  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) listing[field] = req.body[field];
  });
  listing.updatedAt = new Date().toISOString();

  writeDB(db);
  res.json(listing);
});

// Upload photos (accepts an array of photo URLs/base64 refs already hosted elsewhere)
router.post("/:id/photos", (req, res) => {
  const db = readDB();
  const { listing, error, message } = getOwnedListing(db, req.params.id, req.owner.id);
  if (error) return res.status(error).json({ error: message });

  const { photoUrls } = req.body;
  if (!Array.isArray(photoUrls) || photoUrls.length === 0) {
    return res.status(400).json({ error: "photoUrls must be a non-empty array of URLs" });
  }

  listing.photos.push(...photoUrls);
  listing.updatedAt = new Date().toISOString();
  writeDB(db);
  res.json(listing);
});

// Upload floor plans
router.post("/:id/floor-plans", (req, res) => {
  const db = readDB();
  const { listing, error, message } = getOwnedListing(db, req.params.id, req.owner.id);
  if (error) return res.status(error).json({ error: message });

  const { floorPlanUrls } = req.body;
  if (!Array.isArray(floorPlanUrls) || floorPlanUrls.length === 0) {
    return res.status(400).json({ error: "floorPlanUrls must be a non-empty array of URLs" });
  }

  listing.floorPlans.push(...floorPlanUrls);
  listing.updatedAt = new Date().toISOString();
  writeDB(db);
  res.json(listing);
});

// Set/update availability calendar
router.put("/:id/availability", (req, res) => {
  const db = readDB();
  const { listing, error, message } = getOwnedListing(db, req.params.id, req.owner.id);
  if (error) return res.status(error).json({ error: message });

  const { availability } = req.body; // [{date, status}]
  if (!Array.isArray(availability)) {
    return res.status(400).json({ error: "availability must be an array of {date, status}" });
  }

  availability.forEach(({ date, status }) => {
    if (!date || !["available", "unavailable"].includes(status)) return;
    const existing = listing.availability.find((a) => a.date === date);
    if (existing) {
      existing.status = status;
    } else {
      listing.availability.push({ date, status });
    }
  });

  listing.updatedAt = new Date().toISOString();
  writeDB(db);
  res.json(listing);
});

// Temporarily deactivate or reactivate a listing
router.patch("/:id/status", (req, res) => {
  const db = readDB();
  const { listing, error, message } = getOwnedListing(db, req.params.id, req.owner.id);
  if (error) return res.status(error).json({ error: message });

  const { status } = req.body;
  if (!["active", "deactivated"].includes(status)) {
    return res.status(400).json({ error: "status must be 'active' or 'deactivated'" });
  }

  listing.status = status;
  listing.updatedAt = new Date().toISOString();
  writeDB(db);
  res.json(listing);
});

// Permanently remove a listing
router.delete("/:id", (req, res) => {
  const db = readDB();
  const { listing, error, message } = getOwnedListing(db, req.params.id, req.owner.id);
  if (error) return res.status(error).json({ error: message });

  db.listings = db.listings.filter((l) => l.id !== listing.id);
  writeDB(db);
  res.json({ message: "Listing removed", id: listing.id });
});

module.exports = router;
