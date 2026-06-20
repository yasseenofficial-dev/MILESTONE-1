const router = require('express').Router();
const { getReport, exportCsv } = require('../controllers/reportController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.get('/:eventId', requireRole('organizer'), getReport);
router.get('/:eventId/export.csv', requireRole('organizer'), exportCsv);

module.exports = router;
