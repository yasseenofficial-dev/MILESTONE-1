const router = require('express').Router({ mergeParams: true });
const floorPlanController = require('../controllers/floorPlanController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { floorPlanValidator, uuidParam } = require('../validators');

router.use(authenticate);

router.get('/', floorPlanController.getFloorPlans);
router.get('/:id', uuidParam('id'), validate, floorPlanController.getFloorPlan);
router.post('/', floorPlanValidator, validate, floorPlanController.createFloorPlan);
router.put('/:id', uuidParam('id'), validate, floorPlanController.updateFloorPlan);
router.delete('/:id', uuidParam('id'), validate, floorPlanController.deleteFloorPlan);

module.exports = router;
