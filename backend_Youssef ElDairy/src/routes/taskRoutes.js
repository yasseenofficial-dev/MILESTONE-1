const router = require('express').Router();
const { listTasks, updateTask } = require('../controllers/taskController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.get('/', listTasks);
router.patch('/:id', updateTask);

module.exports = router;
