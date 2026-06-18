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

exports.getBudget = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);

  const [categories, expenses] = await Promise.all([
    prisma.budgetCategory.findMany({
      where: { eventId: req.params.eventId },
      include: { expenses: true },
    }),
    prisma.expense.findMany({
      where: { eventId: req.params.eventId },
      include: { budgetCategory: true, vendor: true },
      orderBy: { expenseDate: 'desc' },
    }),
  ]);

  const totalPlanned = categories.reduce((s, c) => s + c.plannedAmount, 0);
  const totalActual = expenses.reduce((s, e) => s + e.amount, 0);

  sendSuccess(res, {
    categories,
    expenses,
    summary: {
      totalPlanned,
      totalActual,
      variance: totalPlanned - totalActual,
      percentUsed: totalPlanned ? ((totalActual / totalPlanned) * 100).toFixed(1) : 0,
    },
  });
});

exports.createCategory = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const category = await prisma.budgetCategory.create({
    data: { eventId: req.params.eventId, name: req.body.name, plannedAmount: req.body.plannedAmount },
  });
  sendSuccess(res, category, 'Budget category created', 201);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const category = await prisma.budgetCategory.update({
    where: { id: req.params.id },
    data: { name: req.body.name, plannedAmount: req.body.plannedAmount },
  });
  sendSuccess(res, category, 'Budget category updated');
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  await prisma.budgetCategory.delete({ where: { id: req.params.id } });
  sendSuccess(res, null, 'Budget category deleted');
});

exports.createExpense = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  const expense = await prisma.expense.create({
    data: {
      eventId: req.params.eventId,
      description: req.body.description,
      amount: req.body.amount,
      budgetCategoryId: req.body.budgetCategoryId,
      vendorId: req.body.vendorId,
      expenseDate: req.body.expenseDate ? new Date(req.body.expenseDate) : new Date(),
    },
    include: { budgetCategory: true, vendor: true },
  });
  sendSuccess(res, expense, 'Expense recorded', 201);
});

exports.deleteExpense = asyncHandler(async (req, res) => {
  await assertEventOwner(req.params.eventId, req.user.id, req.user.role);
  await prisma.expense.delete({ where: { id: req.params.id } });
  sendSuccess(res, null, 'Expense deleted');
});
