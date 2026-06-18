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

exports.getGuests = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const { rsvpStatus, search } = req.query;
  const where = { eventId: req.params.eventId };
  if (rsvpStatus) where.rsvpStatus = rsvpStatus;
  if (search) where.name = { contains: search };

  const guests = await prisma.guest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  sendSuccess(res, guests);
});

exports.getGuestStats = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const guests = await prisma.guest.findMany({ where: { eventId: req.params.eventId } });

  const stats = {
    total: guests.length,
    accepted: guests.filter((g) => g.rsvpStatus === 'ACCEPTED').length,
    declined: guests.filter((g) => g.rsvpStatus === 'DECLINED').length,
    pending: guests.filter((g) => g.rsvpStatus === 'PENDING').length,
    maybe: guests.filter((g) => g.rsvpStatus === 'MAYBE').length,
    dietary: guests.reduce((acc, g) => {
      const d = g.dietaryPreference || 'None';
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {}),
    invitationsSent: guests.filter((g) => g.invitationSentAt).length,
  };
  sendSuccess(res, stats);
});

exports.createGuest = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const guest = await prisma.guest.create({
    data: { eventId: req.params.eventId, ...req.body },
  });
  sendSuccess(res, guest, 'Guest added', 201);
});

exports.updateGuest = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const data = { ...req.body };
  if (data.rsvpStatus && data.rsvpStatus !== 'PENDING') {
    data.rsvpAt = new Date();
  }
  const guest = await prisma.guest.update({ where: { id: req.params.id }, data });
  sendSuccess(res, guest, 'Guest updated');
});

exports.deleteGuest = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  await prisma.guest.delete({ where: { id: req.params.id } });
  sendSuccess(res, null, 'Guest removed');
});

exports.sendInvitations = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const { guestIds } = req.body;

  const where = { eventId: req.params.eventId };
  if (guestIds?.length) where.id = { in: guestIds };

  const result = await prisma.guest.updateMany({
    where,
    data: { invitationSentAt: new Date() },
  });
  sendSuccess(res, { count: result.count }, `${result.count} invitation(s) marked as sent`);
});

exports.getFeedback = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const feedbacks = await prisma.feedback.findMany({
    where: { eventId: req.params.eventId },
    include: { guest: true },
    orderBy: { createdAt: 'desc' },
  });

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  sendSuccess(res, { feedbacks, avgRating, total: feedbacks.length });
});

exports.createFeedback = asyncHandler(async (req, res) => {
  const feedback = await prisma.feedback.create({
    data: {
      eventId: req.params.eventId,
      guestId: req.body.guestId,
      rating: req.body.rating,
      comment: req.body.comment,
    },
    include: { guest: true },
  });
  sendSuccess(res, feedback, 'Feedback submitted', 201);
});
