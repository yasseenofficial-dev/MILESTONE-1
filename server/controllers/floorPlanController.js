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

const formatFloorPlan = (fp) => ({
  ...fp,
  canvasData: JSON.parse(fp.canvasData || '{}'),
});

exports.getFloorPlans = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const plans = await prisma.floorPlan.findMany({
    where: { eventId: req.params.eventId },
    orderBy: { updatedAt: 'desc' },
  });
  sendSuccess(res, plans.map(formatFloorPlan));
});

exports.getFloorPlan = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const plan = await prisma.floorPlan.findFirst({
    where: { id: req.params.id, eventId: req.params.eventId },
  });
  if (!plan) throw new AppError('Floor plan not found', 404);
  sendSuccess(res, formatFloorPlan(plan));
});

exports.createFloorPlan = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const plan = await prisma.floorPlan.create({
    data: {
      eventId: req.params.eventId,
      name: req.body.name,
      canvasData: JSON.stringify(req.body.canvasData || {}),
      width: req.body.width || 800,
      height: req.body.height || 600,
    },
  });
  sendSuccess(res, formatFloorPlan(plan), 'Floor plan created', 201);
});

exports.updateFloorPlan = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const data = {};
  if (req.body.name) data.name = req.body.name;
  if (req.body.canvasData) data.canvasData = JSON.stringify(req.body.canvasData);
  if (req.body.width) data.width = req.body.width;
  if (req.body.height) data.height = req.body.height;

  const plan = await prisma.floorPlan.update({
    where: { id: req.params.id },
    data,
  });
  sendSuccess(res, formatFloorPlan(plan), 'Floor plan saved');
});

exports.deleteFloorPlan = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  await prisma.floorPlan.delete({ where: { id: req.params.id } });
  sendSuccess(res, null, 'Floor plan deleted');
});
