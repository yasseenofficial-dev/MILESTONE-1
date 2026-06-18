const prisma = require('../config/database');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const assertEventOwner = async (eventId, userId, role) => {
  const event = await prisma.event.findFirst({
    where: { id: eventId, ...(role !== 'ADMIN' && { organizerId: userId }) },
  });
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

exports.getStakeholders = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const stakeholders = await prisma.stakeholder.findMany({
    where: { eventId: req.params.eventId },
    orderBy: { createdAt: 'desc' },
  });
  sendSuccess(res, stakeholders);
});

exports.createStakeholder = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const stakeholder = await prisma.stakeholder.create({
    data: { eventId: req.params.eventId, ...req.body },
  });
  sendSuccess(res, stakeholder, 'Stakeholder added', 201);
});

exports.updateStakeholder = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const stakeholder = await prisma.stakeholder.update({
    where: { id: req.params.id },
    data: req.body,
  });
  sendSuccess(res, stakeholder, 'Stakeholder updated');
});

exports.deleteStakeholder = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  await prisma.stakeholder.delete({ where: { id: req.params.id } });
  sendSuccess(res, null, 'Stakeholder removed');
});
