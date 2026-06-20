const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const accountRoutes = require("./routes/account");
const listingRoutes = require("./routes/listings");
const bookingRoutes = require("./routes/bookings");
const reportingRoutes = require("./routes/reporting");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", module: "venue-owner", time: new Date().toISOString() });
});

app.use("/api/venue-owner/account", accountRoutes);
app.use("/api/venue-owner/listings", listingRoutes);
app.use("/api/venue-owner", bookingRoutes);
app.use("/api/venue-owner/reports", reportingRoutes);

// Basic 404 + error handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Venue Owner backend running on http://localhost:${PORT}`);
});
