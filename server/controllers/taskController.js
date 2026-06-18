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

exports.getTasks = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const { status, priority, staffId } = req.query;
  const where = { eventId: req.params.eventId };
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (staffId) where.staffId = staffId;

  const tasks = await prisma.task.findMany({
    where,
    include: { staff: true },
    orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
  });
  sendSuccess(res, tasks);
});

exports.getReminders = asyncHandler(async (req, res) => {
  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const tasks = await prisma.task.findMany({
    where: {
      event: req.user.role === 'ADMIN' ? {} : { organizerId: req.user.id },
      status: { not: 'DONE' },
      reminderAt: { lte: in48h },
    },
    include: { event: { select: { title: true } }, staff: true },
    orderBy: { reminderAt: 'asc' },
  });
  sendSuccess(res, tasks);
});

exports.createTask = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const task = await prisma.task.create({
    data: {
      eventId: req.params.eventId,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'TODO',
      priority: req.body.priority || 'MEDIUM',
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
      reminderAt: req.body.reminderAt ? new Date(req.body.reminderAt) : null,
      staffId: req.body.staffId,
    },
    include: { staff: true },
  });
  sendSuccess(res, task, 'Task created', 201);
});

exports.updateTask = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const data = { ...req.body };
  if (data.dueDate) data.dueDate = new Date(data.dueDate);
  if (data.reminderAt) data.reminderAt = new Date(data.reminderAt);

  const task = await prisma.task.update({
    where: { id: req.params.id },
    data,
    include: { staff: true },
  });
  sendSuccess(res, task, 'Task updated');
});

exports.deleteTask = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  await prisma.task.delete({ where: { id: req.params.id } });
  sendSuccess(res, null, 'Task deleted');
});
