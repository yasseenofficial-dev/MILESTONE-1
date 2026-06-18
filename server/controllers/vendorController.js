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

exports.getVendors = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const where = { isActive: true };
  if (category) where.category = category;
  if (search) where.name = { contains: search };

  const vendors = await prisma.vendor.findMany({ where, orderBy: { rating: 'desc' } });
  sendSuccess(res, vendors);
});

exports.getEventVendors = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const eventVendors = await prisma.eventVendor.findMany({
    where: { eventId: req.params.eventId },
    include: {
      vendor: true,
      invoices: true,
      deliveries: true,
    },
  });
  sendSuccess(res, eventVendors);
});

exports.addEventVendor = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const eventVendor = await prisma.eventVendor.create({
    data: {
      eventId: req.params.eventId,
      vendorId: req.body.vendorId,
      contractAmount: req.body.contractAmount,
      notes: req.body.notes,
    },
    include: { vendor: true },
  });
  sendSuccess(res, eventVendor, 'Vendor linked to event', 201);
});

exports.getSourcingRequests = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const requests = await prisma.sourcingRequest.findMany({
    where: { eventId: req.params.eventId },
    include: { vendor: true },
    orderBy: { requestedAt: 'desc' },
  });
  sendSuccess(res, requests);
});

exports.createSourcingRequest = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const request = await prisma.sourcingRequest.create({
    data: {
      eventId: req.params.eventId,
      vendorId: req.body.vendorId,
      title: req.body.title,
      description: req.body.description,
      budget: req.body.budget,
      status: 'SENT',
    },
    include: { vendor: true },
  });
  sendSuccess(res, request, 'Sourcing request sent', 201);
});

exports.updateSourcingRequest = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const data = { ...req.body };
  if (data.status === 'QUOTED' || data.status === 'ACCEPTED') {
    data.responseAt = new Date();
  }
  const request = await prisma.sourcingRequest.update({
    where: { id: req.params.id },
    data,
    include: { vendor: true },
  });
  sendSuccess(res, request, 'Sourcing request updated');
});

exports.createDelivery = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const delivery = await prisma.delivery.create({
    data: {
      eventVendorId: req.body.eventVendorId,
      description: req.body.description,
      status: req.body.status || 'SCHEDULED',
      scheduledDate: req.body.scheduledDate ? new Date(req.body.scheduledDate) : null,
      trackingNotes: req.body.trackingNotes,
    },
  });
  sendSuccess(res, delivery, 'Delivery scheduled', 201);
});

exports.updateDelivery = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.scheduledDate) data.scheduledDate = new Date(data.scheduledDate);
  if (data.deliveredDate) data.deliveredDate = new Date(data.deliveredDate);
  if (data.status === 'DELIVERED' && !data.deliveredDate) data.deliveredDate = new Date();

  const delivery = await prisma.delivery.update({ where: { id: req.params.id }, data });
  sendSuccess(res, delivery, 'Delivery updated');
});

exports.createInvoice = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const invoice = await prisma.invoice.create({
    data: {
      eventVendorId: req.body.eventVendorId,
      invoiceNumber: req.body.invoiceNumber,
      amount: req.body.amount,
      status: req.body.status || 'SENT',
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
      notes: req.body.notes,
    },
  });
  sendSuccess(res, invoice, 'Invoice created', 201);
});

exports.updateInvoice = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.dueDate) data.dueDate = new Date(data.dueDate);
  if (data.paidDate) data.paidDate = new Date(data.paidDate);
  if (data.status === 'PAID' && !data.paidDate) data.paidDate = new Date();

  const invoice = await prisma.invoice.update({ where: { id: req.params.id }, data });
  sendSuccess(res, invoice, 'Invoice updated');
});
