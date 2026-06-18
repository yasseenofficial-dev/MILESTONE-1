const prisma = require('../config/database');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const parseJson = (str, fallback = []) => {
  try { return JSON.parse(str); } catch { return fallback; }
};

const formatVenue = (venue) => ({
  ...venue,
  amenities: parseJson(venue.amenities),
  images: parseJson(venue.images),
});

exports.getVenues = asyncHandler(async (req, res) => {
  const { city, minCapacity, maxPrice, search } = req.query;
  const where = { isActive: true };

  if (city) where.city = { contains: city };
  if (minCapacity) where.capacity = { gte: parseInt(minCapacity, 10) };
  if (maxPrice) where.pricePerDay = { lte: parseFloat(maxPrice) };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { address: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const venues = await prisma.venue.findMany({ where, orderBy: { rating: 'desc' } });
  sendSuccess(res, venues.map(formatVenue));
});

exports.getVenue = asyncHandler(async (req, res) => {
  const venue = await prisma.venue.findUnique({ where: { id: req.params.id } });
  if (!venue) throw new AppError('Venue not found', 404);
  sendSuccess(res, formatVenue(venue));
});

exports.getBookings = asyncHandler(async (req, res) => {
  const { status, eventId } = req.query;
  const where = { organizerId: req.user.id };
  if (status) where.status = status;
  if (eventId) where.eventId = eventId;

  const bookings = await prisma.bookingApplication.findMany({
    where,
    include: { venue: true, event: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
  });
  sendSuccess(res, bookings.map((b) => ({ ...b, venue: formatVenue(b.venue) })));
});

exports.createBooking = asyncHandler(async (req, res) => {
  const { eventId, venueId, startDate, endDate, message } = req.body;

  const event = await prisma.event.findFirst({
    where: { id: eventId, organizerId: req.user.id },
  });
  if (!event) throw new AppError('Event not found', 404);

  const venue = await prisma.venue.findUnique({ where: { id: venueId } });
  if (!venue) throw new AppError('Venue not found', 404);

  const conflict = await prisma.bookingApplication.findFirst({
    where: {
      venueId,
      status: 'APPROVED',
      OR: [
        { startDate: { lte: new Date(endDate) }, endDate: { gte: new Date(startDate) } },
      ],
    },
  });
  if (conflict) throw new AppError('Venue is not available for selected dates', 409);

  const booking = await prisma.bookingApplication.create({
    data: {
      eventId,
      venueId,
      organizerId: req.user.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      message,
    },
    include: { venue: true, event: { select: { title: true } } },
  });
  sendSuccess(res, { ...booking, venue: formatVenue(booking.venue) }, 'Booking application submitted', 201);
});

exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await prisma.bookingApplication.findFirst({
    where: { id: req.params.id, organizerId: req.user.id },
  });
  if (!booking) throw new AppError('Booking not found', 404);

  const updated = await prisma.bookingApplication.update({
    where: { id: req.params.id },
    data: { status: 'CANCELLED' },
    include: { venue: true, event: { select: { title: true } } },
  });
  sendSuccess(res, updated, 'Booking cancelled');
});
