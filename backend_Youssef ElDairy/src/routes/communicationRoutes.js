const router = require('express').Router();
const { listCommunications, createCommunication, createFollowUp } = require('../controllers/communicationController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.get('/', listCommunications);
router.post('/', requireRole('organizer'), createCommunication);
router.post('/:id/follow-up', requireRole('organizer'), createFollowUp);

module.exports = router;
