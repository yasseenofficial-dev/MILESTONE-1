const router = require('express').Router();
const { listFeedback } = require('../controllers/feedbackController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.get('/', requireRole('organizer'), listFeedback);

module.exports = router;
