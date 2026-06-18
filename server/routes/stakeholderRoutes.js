const router = require('express').Router({ mergeParams: true });
const stakeholderController = require('../controllers/stakeholderController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { stakeholderValidator, uuidParam } = require('../validators');

router.use(authenticate);

router.get('/', stakeholderController.getStakeholders);
router.post('/', stakeholderValidator, validate, stakeholderController.createStakeholder);
router.put('/:id', uuidParam('id'), validate, stakeholderController.updateStakeholder);
router.delete('/:id', uuidParam('id'), validate, stakeholderController.deleteStakeholder);

module.exports = router;
