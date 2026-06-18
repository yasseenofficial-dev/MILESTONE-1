const router = require('express').Router({ mergeParams: true });
const guestController = require('../controllers/guestController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { guestValidator, uuidParam } = require('../validators');

router.get('/stats', authenticate, guestController.getGuestStats);
router.get('/feedback', authenticate, guestController.getFeedback);
router.post('/feedback', guestController.createFeedback);

router.use(authenticate);

router.get('/', guestController.getGuests);
router.post('/', guestValidator, validate, guestController.createGuest);
router.put('/:id', uuidParam('id'), validate, guestController.updateGuest);
router.delete('/:id', uuidParam('id'), validate, guestController.deleteGuest);
router.post('/send-invitations', guestController.sendInvitations);

module.exports = router;
