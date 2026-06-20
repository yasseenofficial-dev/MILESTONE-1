const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../db");
const { signToken, authMiddleware } = require("../auth");

const router = express.Router();

// 22. Account Setup -> Registration & Profile

// Register a new venue owner account
router.post("/register", async (req, res) => {
  const { ownerName, email, password, companyName, phone } = req.body;

  if (!ownerName || !email || !password) {
    return res.status(400).json({ error: "ownerName, email and password are required" });
  }

  const db = readDB();
  const existing = db.venueOwners.find((o) => o.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newOwner = {
    id: uuidv4(),
    ownerName,
    email,
    passwordHash,
    companyName: companyName || "",
    phone: phone || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.venueOwners.push(newOwner);
  writeDB(db);

  const token = signToken(newOwner);
  const { passwordHash: _omit, ...safeOwner } = newOwner;
  res.status(201).json({ token, owner: safeOwner });
});

// Log in
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const db = readDB();
  const owner = db.venueOwners.find((o) => o.email.toLowerCase() === email.toLowerCase());
  if (!owner) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, owner.passwordHash);
  if (!match) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signToken(owner);
  const { passwordHash: _omit, ...safeOwner } = owner;
  res.json({ token, owner: safeOwner });
});

// View own profile
router.get("/me", authMiddleware, (req, res) => {
  const db = readDB();
  const owner = db.venueOwners.find((o) => o.id === req.owner.id);
  if (!owner) return res.status(404).json({ error: "Owner not found" });
  const { passwordHash: _omit, ...safeOwner } = owner;
  res.json(safeOwner);
});

// Update profile details (owner name, contact info, company name)
router.put("/me", authMiddleware, (req, res) => {
  const db = readDB();
  const owner = db.venueOwners.find((o) => o.id === req.owner.id);
  if (!owner) return res.status(404).json({ error: "Owner not found" });

  const { ownerName, phone, companyName } = req.body;
  if (ownerName !== undefined) owner.ownerName = ownerName;
  if (phone !== undefined) owner.phone = phone;
  if (companyName !== undefined) owner.companyName = companyName;
  owner.updatedAt = new Date().toISOString();

  writeDB(db);
  const { passwordHash: _omit, ...safeOwner } = owner;
  res.json(safeOwner);
});

module.exports = router;
