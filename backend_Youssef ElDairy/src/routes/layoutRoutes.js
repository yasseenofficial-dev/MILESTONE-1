const router = require('express').Router();
const { getLayoutByEvent } = require('../controllers/layoutController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.get('/:eventId', getLayoutByEvent);

module.exports = router;
