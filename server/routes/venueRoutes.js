const router = require('express').Router();
const venueController = require('../controllers/venueController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { bookingValidator, venueSearchValidator, uuidParam } = require('../validators');

router.get('/', venueSearchValidator, validate, venueController.getVenues);
router.get('/bookings', authenticate, venueController.getBookings);
router.post('/bookings', authenticate, bookingValidator, validate, venueController.createBooking);
router.delete('/bookings/:id', authenticate, uuidParam('id'), validate, venueController.cancelBooking);
router.get('/:id', uuidParam('id'), validate, venueController.getVenue);

module.exports = router;
