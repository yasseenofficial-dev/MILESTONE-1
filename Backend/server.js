const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "database", "db.json");

function readDatabase() {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
}

function writeDatabase(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  res.send("Guest Journey API is running");
});

app.get("/api/invitation", (req, res) => {
  const db = readDatabase();
  res.json(db.invitation);
});

app.get("/api/messages", (req, res) => {
  const db = readDatabase();
  res.json(db.messages);
});

app.post("/api/rsvp", (req, res) => {
  const { attendance, dietaryPreference, specialRequirements } = req.body;

  if (!attendance) {
    return res.status(400).json({
      message: "Attendance status is required",
    });
  }

  const db = readDatabase();

  const newRSVP = {
    id: Date.now(),
    attendance,
    dietaryPreference,
    specialRequirements,
    submittedAt: new Date().toISOString(),
  };

  db.rsvps.push(newRSVP);
  writeDatabase(db);

  res.json({
    message: "RSVP submitted successfully",
    rsvp: newRSVP,
  });
});

app.post("/api/check-in", (req, res) => {
  const { guestName, qrCode } = req.body;

  if (!guestName || !qrCode) {
    return res.status(400).json({
      message: "Guest name and QR code are required",
    });
  }

  const db = readDatabase();

  const newCheckIn = {
    id: Date.now(),
    guestName,
    qrCode,
    checkedInAt: new Date().toISOString(),
  };

  db.checkIns.push(newCheckIn);
  writeDatabase(db);

  res.json({
    message: "Check-in confirmed. Welcome to the event!",
    checkIn: newCheckIn,
  });
});

app.post("/api/feedback", (req, res) => {
  const {
    overallExperience,
    foodRating,
    venueRating,
    organizationRating,
    comments,
  } = req.body;

  if (
    !overallExperience ||
    !foodRating ||
    !venueRating ||
    !organizationRating
  ) {
    return res.status(400).json({
      message: "All rating fields are required",
    });
  }

  const db = readDatabase();

  const newFeedback = {
    id: Date.now(),
    overallExperience,
    foodRating,
    venueRating,
    organizationRating,
    comments,
    submittedAt: new Date().toISOString(),
  };

  db.feedback.push(newFeedback);
  writeDatabase(db);

  res.json({
    message: "Thank you for submitting your feedback!",
    feedback: newFeedback,
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});