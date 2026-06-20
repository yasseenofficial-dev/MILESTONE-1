const router = require('express').Router();
const { listEvents, getDayOfDashboard } = require('../controllers/eventController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.get('/', listEvents);
router.get('/:id/day-of-dashboard', getDayOfDashboard);

module.exports = router;
