const router = require('express').Router({ mergeParams: true });
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { taskValidator, uuidParam } = require('../validators');

router.use(authenticate);

router.get('/', taskController.getTasks);
router.post('/', taskValidator, validate, taskController.createTask);
router.put('/:id', uuidParam('id'), validate, taskController.updateTask);
router.delete('/:id', uuidParam('id'), validate, taskController.deleteTask);

module.exports = router;
