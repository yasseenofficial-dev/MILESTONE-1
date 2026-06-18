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

exports.getStaff = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const staff = await prisma.staff.findMany({
    where: { eventId: req.params.eventId },
    include: { tasks: true },
    orderBy: { createdAt: 'desc' },
  });
  sendSuccess(res, staff);
});

exports.createStaff = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const member = await prisma.staff.create({
    data: { eventId: req.params.eventId, ...req.body },
  });
  sendSuccess(res, member, 'Staff member added', 201);
});

exports.updateStaff = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const member = await prisma.staff.update({
    where: { id: req.params.id },
    data: req.body,
    include: { tasks: true },
  });
  sendSuccess(res, member, 'Staff member updated');
});

exports.deleteStaff = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  await prisma.staff.delete({ where: { id: req.params.id } });
  sendSuccess(res, null, 'Staff member removed');
});

exports.assignTask = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const task = await prisma.task.update({
    where: { id: req.params.taskId },
    data: { staffId: req.params.staffId },
    include: { staff: true },
  });
  sendSuccess(res, task, 'Task assigned to staff');
});
