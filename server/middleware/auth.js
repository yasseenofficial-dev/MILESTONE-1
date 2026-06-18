const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const prisma = require('../config/database');

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const decoded = verifyToken(header.split(' ')[1]);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || !user.isActive) {
      return next(new AppError('Invalid or inactive account', 401));
    }
    req.user = user;
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('Insufficient permissions', 403));
  }
  next();
};

const requireEventAccess = async (req, res, next) => {
  const eventId = req.params.eventId || req.body.eventId;
  if (!eventId) return next();

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return next(new AppError('Event not found', 404));

  if (req.user.role === 'ADMIN' || event.organizerId === req.user.id) {
    req.event = event;
    return next();
  }
  return next(new AppError('Access denied to this event', 403));
};

module.exports = { authenticate, authorize, requireEventAccess };
