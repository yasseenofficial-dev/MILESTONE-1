const router = require('express').Router();
const { listGuests, updateCheckIn } = require('../controllers/guestController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.get('/', listGuests);
router.patch('/:id/check-in', updateCheckIn);

module.exports = router;
