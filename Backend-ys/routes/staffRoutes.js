const router = require('express').Router({ mergeParams: true });
const staffController = require('../controllers/staffController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { staffValidator, uuidParam } = require('../validators');

router.use(authenticate);

router.get('/', staffController.getStaff);
router.post('/', staffValidator, validate, staffController.createStaff);
router.put('/:id', uuidParam('id'), validate, staffController.updateStaff);
router.delete('/:id', uuidParam('id'), validate, staffController.deleteStaff);
router.put('/:staffId/tasks/:taskId', staffController.assignTask);

module.exports = router;
