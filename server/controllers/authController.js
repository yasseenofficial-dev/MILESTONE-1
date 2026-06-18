const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const sanitizeUser = (user) => {
  const { passwordHash, ...rest } = user;
  return rest;
};

exports.register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, companyName, phone, role } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName, companyName, phone, role },
  });

  const token = signToken({ userId: user.id, role: user.role });
  sendSuccess(res, { user: sanitizeUser(user), token }, 'Account created successfully', 201);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.isActive) {
    throw new AppError('This account has been deactivated. Contact your organizer.', 403);
  }

  const token = signToken({ userId: user.id, role: user.role });
  sendSuccess(res, { user: sanitizeUser(user), token }, 'Login successful');
});

exports.getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, sanitizeUser(req.user));
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, companyName, phone, currentPassword, newPassword } = req.body;
  const data = {};

  if (firstName) data.firstName = firstName;
  if (lastName) data.lastName = lastName;
  if (companyName !== undefined) data.companyName = companyName;
  if (phone !== undefined) data.phone = phone;

  if (newPassword) {
    if (!currentPassword) throw new AppError('Current password is required to set a new password', 400);
    const valid = await bcrypt.compare(currentPassword, req.user.passwordHash);
    if (!valid) throw new AppError('Current password is incorrect', 400);
    if (newPassword.length < 6) throw new AppError('New password must be at least 6 characters', 400);
    data.passwordHash = await bcrypt.hash(newPassword, 12);
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data,
  });
  sendSuccess(res, sanitizeUser(user), 'Profile updated');
});
