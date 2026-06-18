const router = require('express').Router();
const accountController = require('../controllers/accountController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createAccountValidator, updateAccountValidator, uuidParam } = require('../validators');

router.use(authenticate);

router.get('/', accountController.getAccounts);
router.post('/', createAccountValidator, validate, accountController.createAccount);
router.put('/:id', uuidParam('id'), validate, updateAccountValidator, validate, accountController.updateAccount);
router.patch('/:id/deactivate', uuidParam('id'), validate, accountController.deactivateAccount);
router.patch('/deactivate-stakeholders', accountController.deactivateAllStakeholders);

module.exports = router;
