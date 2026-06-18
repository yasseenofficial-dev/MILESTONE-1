const router = require('express').Router({ mergeParams: true });
const vendorController = require('../controllers/vendorController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { sourcingValidator, uuidParam } = require('../validators');

router.use(authenticate);

router.get('/vendors', vendorController.getEventVendors);
router.post('/vendors', vendorController.addEventVendor);
router.get('/sourcing', vendorController.getSourcingRequests);
router.post('/sourcing', sourcingValidator, validate, vendorController.createSourcingRequest);
router.put('/sourcing/:id', uuidParam('id'), validate, vendorController.updateSourcingRequest);
router.post('/deliveries', vendorController.createDelivery);
router.put('/deliveries/:id', uuidParam('id'), validate, vendorController.updateDelivery);
router.post('/invoices', vendorController.createInvoice);
router.put('/invoices/:id', uuidParam('id'), validate, vendorController.updateInvoice);

module.exports = router;
