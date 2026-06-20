const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "popeyez-dev-secret-change-me";

function signToken(owner) {
  return jwt.sign(
    { id: owner.id, email: owner.email, role: "venue_owner" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing authentication token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.owner = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { signToken, authMiddleware, JWT_SECRET };
