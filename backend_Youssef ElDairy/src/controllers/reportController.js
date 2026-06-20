const { readDB } = require('../config/db');
const { userHasEventAccess } = require('./eventController');

function buildReport(db, eventId) {
  const event = db.events.find(item => item.id === eventId);
  const guests = db.guests.filter(item => item.eventId === eventId);
  const tasks = db.tasks.filter(item => item.eventId === eventId);
  const eventVendors = db.eventVendors.filter(item => item.eventId === eventId);
  const feedback = db.feedback.filter(item => item.eventId === eventId);
  const expenses = db.expenses.filter(item => item.eventId === eventId);
  const actualTotal = expenses.reduce((sum, item) => sum + item.amount, 0);
  const attendance = {
    invited: guests.length,
    attending: guests.filter(item => item.rsvpStatus === 'Attending').length,
    maybe: guests.filter(item => item.rsvpStatus === 'Maybe').length,
    declined: guests.filter(item => item.rsvpStatus === 'Not Attending').length,
    checkedIn: guests.filter(item => item.checkInStatus === 'checked-in').length
  };
  const average = field => feedback.length ? Number((feedback.reduce((sum, item) => sum + item[field], 0) / feedback.length).toFixed(1)) : 0;
  const taskSummary = {
    total: tasks.length,
    done: tasks.filter(item => item.status === 'done').length,
    inProgress: tasks.filter(item => item.status === 'in progress').length,
    pending: tasks.filter(item => ['pending', 'not started'].includes(item.status)).length,
    blocked: tasks.filter(item => item.status === 'blocked').length
  };
  const vendorSummary = {
    total: eventVendors.length,
    arrived: eventVendors.filter(item => item.arrivalStatus === 'arrived').length,
    delayed: eventVendors.filter(item => item.arrivalStatus === 'delayed' || item.deliveryStatus === 'Delayed').length,
    delivered: eventVendors.filter(item => item.deliveryStatus === 'Delivered').length
  };

  return {
    event,
    attendance,
    costs: {
      plannedBudget: event?.plannedBudget || 0,
      actualTotal,
      variance: (event?.plannedBudget || 0) - actualTotal,
      expenses
    },
    feedback: {
      totalResponses: feedback.length,
      averageOverall: average('overall'),
      averageFood: average('food'),
      averageVenue: average('venue'),
      averageOrganization: average('organization'),
      comments: feedback.map(item => ({ guestName: item.guestName, comment: item.comment, overall: item.overall }))
    },
    taskSummary,
    vendorSummary,
    outcome: {
      attendanceRate: attendance.invited ? Math.round((attendance.checkedIn / attendance.invited) * 100) : 0,
      budgetStatus: actualTotal <= (event?.plannedBudget || 0) ? 'Within budget' : 'Over budget',
      readinessStatus: taskSummary.blocked > 0 ? 'Needs attention' : 'Operationally stable',
      vendorStatus: vendorSummary.delayed > 0 ? 'Some vendor delays' : 'Vendors on track'
    }
  };
}

function getReport(req, res, next) {
  try {
    const db = readDB();
    const { eventId } = req.params;
    if (!userHasEventAccess(db, req.user, eventId)) {
      res.status(403);
      throw new Error('No access to this report');
    }
    res.json({ report: buildReport(db, eventId) });
  } catch (error) {
    next(error);
  }
}

function exportCsv(req, res, next) {
  try {
    const db = readDB();
    const { eventId } = req.params;
    if (!userHasEventAccess(db, req.user, eventId)) {
      res.status(403);
      throw new Error('No access to this report export');
    }
    const report = buildReport(db, eventId);
    const rows = [
      ['Section', 'Metric', 'Value'],
      ['Event', 'Name', report.event.name],
      ['Event', 'Date', report.event.date],
      ['Attendance', 'Invited', report.attendance.invited],
      ['Attendance', 'Checked In', report.attendance.checkedIn],
      ['Attendance', 'Attendance Rate', `${report.outcome.attendanceRate}%`],
      ['Costs', 'Planned Budget', report.costs.plannedBudget],
      ['Costs', 'Actual Total', report.costs.actualTotal],
      ['Costs', 'Variance', report.costs.variance],
      ['Tasks', 'Done', report.taskSummary.done],
      ['Tasks', 'Blocked', report.taskSummary.blocked],
      ['Vendors', 'Arrived', report.vendorSummary.arrived],
      ['Vendors', 'Delayed', report.vendorSummary.delayed],
      ['Feedback', 'Responses', report.feedback.totalResponses],
      ['Feedback', 'Average Overall', report.feedback.averageOverall],
      ['Outcome', 'Budget Status', report.outcome.budgetStatus],
      ['Outcome', 'Readiness Status', report.outcome.readinessStatus],
      ['Outcome', 'Vendor Status', report.outcome.vendorStatus]
    ];
    const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${eventId}-report.csv"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
}

module.exports = { getReport, exportCsv, buildReport };
