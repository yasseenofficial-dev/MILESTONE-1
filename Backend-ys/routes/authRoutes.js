const router = require('express').Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerValidator, loginValidator, updateProfileValidator } = require('../validators');

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, updateProfileValidator, validate, authController.updateProfile);

module.exports = router;
