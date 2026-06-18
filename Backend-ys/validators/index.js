const { body, param, query } = require('express-validator');

const registerValidator = [
  body('role').isIn(['TEAM_MEMBER', 'GUEST', 'VENDOR']).withMessage('Valid role is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('companyName').optional().trim(),
  body('phone').optional().trim(),
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const eventValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('eventType').trim().notEmpty().withMessage('Event type is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('description').optional().trim(),
  body('expectedAttendees').optional().isInt({ min: 1 }),
  body('venueId').optional().isUUID(),
  body('status').optional().isIn(['DRAFT', 'PLANNING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
];

const stakeholderValidator = [
  param('eventId').isUUID(),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail(),
  body('phone').optional().trim(),
  body('role').optional().isIn(['SPONSOR', 'PARTNER', 'SPEAKER', 'VOLUNTEER', 'CO_ORGANIZER', 'OTHER']),
  body('notes').optional().trim(),
];

const bookingValidator = [
  body('eventId').isUUID(),
  body('venueId').isUUID(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('message').optional().trim(),
];

const taskValidator = [
  param('eventId').isUUID(),
  body('title').trim().notEmpty(),
  body('description').optional().trim(),
  body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('dueDate').optional().isISO8601(),
  body('reminderAt').optional().isISO8601(),
  body('staffId').optional().isUUID(),
];

const budgetCategoryValidator = [
  param('eventId').isUUID(),
  body('name').trim().notEmpty(),
  body('plannedAmount').isFloat({ min: 0 }),
];

const expenseValidator = [
  param('eventId').isUUID(),
  body('description').trim().notEmpty(),
  body('amount').isFloat({ min: 0 }),
  body('budgetCategoryId').optional().isUUID(),
  body('vendorId').optional().isUUID(),
  body('expenseDate').optional().isISO8601(),
];

const floorPlanValidator = [
  param('eventId').isUUID(),
  body('name').trim().notEmpty(),
  body('canvasData').optional(),
  body('width').optional().isInt({ min: 100 }),
  body('height').optional().isInt({ min: 100 }),
];

const staffValidator = [
  param('eventId').isUUID(),
  body('name').trim().notEmpty(),
  body('role').trim().notEmpty(),
  body('email').optional().isEmail(),
  body('phone').optional().trim(),
];

const guestValidator = [
  param('eventId').isUUID(),
  body('name').trim().notEmpty(),
  body('email').optional().isEmail(),
  body('phone').optional().trim(),
  body('dietaryPreference').optional().trim(),
  body('rsvpStatus').optional().isIn(['PENDING', 'ACCEPTED', 'DECLINED', 'MAYBE']),
  body('plusOne').optional().isBoolean(),
];

const sourcingValidator = [
  param('eventId').isUUID(),
  body('vendorId').isUUID(),
  body('title').trim().notEmpty(),
  body('description').optional().trim(),
  body('budget').optional().isFloat({ min: 0 }),
];

const venueSearchValidator = [
  query('city').optional().trim(),
  query('minCapacity').optional().isInt({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('search').optional().trim(),
];

const uuidParam = (name) => [param(name).isUUID().withMessage(`Valid ${name} is required`)];

const createAccountValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('role').isIn(['TEAM_MEMBER', 'GUEST', 'VENDOR', 'STAKEHOLDER']).withMessage('Invalid role'),
  body('phone').optional().trim(),
  body('companyName').optional().trim(),
  body('eventId').optional().isUUID(),
];

const updateAccountValidator = [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('companyName').optional().trim(),
  body('password').optional().isLength({ min: 6 }),
  body('isActive').optional().isBoolean(),
];

const updateProfileValidator = [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('companyName').optional().trim(),
  body('newPassword').optional().isLength({ min: 6 }),
  body('currentPassword').optional().notEmpty(),
];

module.exports = {
  registerValidator,
  loginValidator,
  eventValidator,
  stakeholderValidator,
  bookingValidator,
  taskValidator,
  budgetCategoryValidator,
  expenseValidator,
  floorPlanValidator,
  staffValidator,
  guestValidator,
  sourcingValidator,
  venueSearchValidator,
  createAccountValidator,
  updateAccountValidator,
  updateProfileValidator,
  uuidParam,
};
