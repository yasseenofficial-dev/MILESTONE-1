const prisma = require('../config/database');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const eventInclude = {
  venue: true,
  _count: { select: { guests: true, tasks: true, staff: true } },
};

exports.getDashboard = asyncHandler(async (req, res) => {
  const organizerId = req.user.id;
  const where = req.user.role === 'ADMIN' ? {} : { organizerId };

  const [events, bookings, tasks, feedbacks] = await Promise.all([
    prisma.event.findMany({ where, include: eventInclude, orderBy: { startDate: 'asc' } }),
    prisma.bookingApplication.count({ where: { organizerId, status: 'PENDING' } }),
    prisma.task.findMany({
      where: { event: where, status: { not: 'DONE' }, dueDate: { not: null } },
      include: { event: { select: { title: true } }, staff: true },
      orderBy: { dueDate: 'asc' },
      take: 10,
    }),
    prisma.feedback.findMany({
      where: { event: where },
      include: { guest: true, event: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ]);

  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter((e) => new Date(e.startDate) > new Date() && e.status !== 'CANCELLED').length,
    pendingBookings: bookings,
    completedEvents: events.filter((e) => e.status === 'COMPLETED').length,
    avgFeedbackRating: feedbacks.length
      ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
      : 0,
    rsvpStats: await getRsvpStats(where),
  };

  sendSuccess(res, { stats, recentEvents: events.slice(0, 5), upcomingTasks: tasks, recentFeedback: feedbacks });
});

async function getRsvpStats(eventWhere) {
  const guests = await prisma.guest.groupBy({
    by: ['rsvpStatus'],
    where: { event: eventWhere },
    _count: true,
  });
  return guests.reduce((acc, g) => ({ ...acc, [g.rsvpStatus]: g._count }), {});
}

exports.getEvents = asyncHandler(async (req, res) => {
  const { status, eventType, search, startFrom, startTo } = req.query;
  const where = req.user.role === 'ADMIN' ? {} : { organizerId: req.user.id };

  if (status) where.status = status;
  if (eventType) where.eventType = eventType;
  if (search) where.title = { contains: search };
  if (startFrom || startTo) {
    where.startDate = {};
    if (startFrom) where.startDate.gte = new Date(startFrom);
    if (startTo) where.startDate.lte = new Date(startTo);
  }

  const events = await prisma.event.findMany({
    where,
    include: eventInclude,
    orderBy: { startDate: 'desc' },
  });
  sendSuccess(res, events);
});

exports.getEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.findFirst({
    where: {
      id: req.params.id,
      ...(req.user.role !== 'ADMIN' && { organizerId: req.user.id }),
    },
    include: {
      venue: true,
      stakeholders: true,
      budgetCategories: { include: { expenses: true } },
      _count: { select: { guests: true, tasks: true, staff: true, eventVendors: true } },
    },
  });
  if (!event) throw new AppError('Event not found', 404);
  sendSuccess(res, event);
});

exports.createEvent = asyncHandler(async (req, res) => {
  const { title, description, eventType, startDate, endDate, expectedAttendees, venueId, status } = req.body;

  if (new Date(endDate) < new Date(startDate)) {
    throw new AppError('End date must be after start date', 400);
  }

  const event = await prisma.event.create({
    data: {
      organizerId: req.user.id,
      title,
      description,
      eventType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      expectedAttendees,
      venueId,
      status: status || 'DRAFT',
    },
    include: eventInclude,
  });
  sendSuccess(res, event, 'Event created', 201);
});

exports.updateEvent = asyncHandler(async (req, res) => {
  const existing = await prisma.event.findFirst({
    where: { id: req.params.id, organizerId: req.user.id },
  });
  if (!existing) throw new AppError('Event not found', 404);

  const { title, description, eventType, startDate, endDate, expectedAttendees, venueId, status } = req.body;
  const event = await prisma.event.update({
    where: { id: req.params.id },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(eventType && { eventType }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      ...(expectedAttendees !== undefined && { expectedAttendees }),
      ...(venueId !== undefined && { venueId }),
      ...(status && { status }),
    },
    include: eventInclude,
  });
  sendSuccess(res, event, 'Event updated');
});

exports.deleteEvent = asyncHandler(async (req, res) => {
  const existing = await prisma.event.findFirst({
    where: { id: req.params.id, organizerId: req.user.id },
  });
  if (!existing) throw new AppError('Event not found', 404);

  await prisma.event.delete({ where: { id: req.params.id } });
  sendSuccess(res, null, 'Event deleted');
});
