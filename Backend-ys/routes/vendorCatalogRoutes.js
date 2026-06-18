const router = require('express').Router();
const vendorController = require('../controllers/vendorController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, vendorController.getVendors);

module.exports = router;
