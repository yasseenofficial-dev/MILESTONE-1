const { readDB } = require('../config/db');

function decodeToken(token) {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const [id, role] = raw.split(':');
    if (!id || !role) return null;
    return { id, role };
  } catch (error) {
    return null;
  }
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const decoded = token ? decodeToken(token) : null;
  if (!decoded) {
    res.status(401);
    return next(new Error('Authentication required'));
  }

  const db = readDB();
  const user = db.users.find(u => u.id === decoded.id && u.role === decoded.role && u.active);
  if (!user) {
    res.status(401);
    return next(new Error('Invalid or inactive user'));
  }

  const { password, ...safeUser } = user;
  req.user = safeUser;
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error('You do not have permission for this action'));
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
