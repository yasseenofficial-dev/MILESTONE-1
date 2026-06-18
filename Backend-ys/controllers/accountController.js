const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const MANAGED_ROLES = ['TEAM_MEMBER', 'GUEST', 'VENDOR', 'STAKEHOLDER'];
const ORGANIZER_ROLES = ['EVENT_ORGANIZER', 'ADMIN'];

const sanitizeUser = (user) => {
  const { passwordHash, ...rest } = user;
  return rest;
};

const assertCanManage = (user) => {
  if (!ORGANIZER_ROLES.includes(user.role)) {
    throw new AppError('Only organizers can manage accounts', 403);
  }
};

exports.getAccounts = asyncHandler(async (req, res) => {
  assertCanManage(req.user);
  const { role, eventId } = req.query;

  const where = {
    createdById: req.user.id,
    role: { in: MANAGED_ROLES },
  };
  if (role) where.role = role;
  if (eventId) where.eventId = eventId;

  const accounts = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, email: true, firstName: true, lastName: true, phone: true,
      companyName: true, role: true, isActive: true, eventId: true, createdAt: true,
    },
  });
  sendSuccess(res, accounts);
});

exports.createAccount = asyncHandler(async (req, res) => {
  assertCanManage(req.user);
  const { email, password, firstName, lastName, role, phone, companyName, eventId } = req.body;

  if (!MANAGED_ROLES.includes(role)) {
    throw new AppError('Role must be TEAM_MEMBER, GUEST, VENDOR, or STAKEHOLDER', 400);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  if (eventId) {
    const event = await prisma.event.findFirst({
      where: { id: eventId, organizerId: req.user.id },
    });
    if (!event) throw new AppError('Event not found', 404);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      companyName,
      role,
      eventId: eventId || null,
      createdById: req.user.id,
    },
  });

  sendSuccess(res, sanitizeUser(user), 'Account created', 201);
});

exports.updateAccount = asyncHandler(async (req, res) => {
  assertCanManage(req.user);
  const account = await prisma.user.findFirst({
    where: { id: req.params.id, createdById: req.user.id },
  });
  if (!account) throw new AppError('Account not found', 404);

  const { firstName, lastName, phone, companyName, password, isActive } = req.body;
  const data = {};
  if (firstName) data.firstName = firstName;
  if (lastName) data.lastName = lastName;
  if (phone !== undefined) data.phone = phone;
  if (companyName !== undefined) data.companyName = companyName;
  if (typeof isActive === 'boolean') data.isActive = isActive;
  if (password) data.passwordHash = await bcrypt.hash(password, 12);

  const updated = await prisma.user.update({ where: { id: req.params.id }, data });
  sendSuccess(res, sanitizeUser(updated), 'Account updated');
});

exports.deactivateAccount = asyncHandler(async (req, res) => {
  assertCanManage(req.user);
  const account = await prisma.user.findFirst({
    where: { id: req.params.id, createdById: req.user.id },
  });
  if (!account) throw new AppError('Account not found', 404);

  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data: { isActive: false },
  });
  sendSuccess(res, sanitizeUser(updated), 'Account deactivated');
});

exports.deactivateAllStakeholders = asyncHandler(async (req, res) => {
  assertCanManage(req.user);
  const { eventId } = req.body;

  const where = {
    createdById: req.user.id,
    role: 'STAKEHOLDER',
    isActive: true,
  };
  if (eventId) where.eventId = eventId;

  const result = await prisma.user.updateMany({
    where,
    data: { isActive: false },
  });
  sendSuccess(res, { count: result.count }, `${result.count} stakeholder account(s) deactivated`);
});
