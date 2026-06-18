const router = require('express').Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');

router.get('/reminders', authenticate, taskController.getReminders);

module.exports = router;
