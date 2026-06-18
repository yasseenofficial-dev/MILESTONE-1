const router = require('express').Router();
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { eventValidator, uuidParam } = require('../validators');

router.use(authenticate);

router.get('/dashboard', eventController.getDashboard);
router.get('/', eventController.getEvents);
router.get('/:id', uuidParam('id'), validate, eventController.getEvent);
router.post('/', eventValidator, validate, eventController.createEvent);
router.put('/:id', uuidParam('id'), validate, eventController.updateEvent);
router.delete('/:id', uuidParam('id'), validate, eventController.deleteEvent);

module.exports = router;
