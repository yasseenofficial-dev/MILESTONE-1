const router = require('express').Router();
const { listEventVendors, updateArrival } = require('../controllers/vendorController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.get('/event/:eventId', listEventVendors);
router.patch('/event-vendors/:id/arrival', updateArrival);

module.exports = router;
