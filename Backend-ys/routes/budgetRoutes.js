const router = require('express').Router({ mergeParams: true });
const budgetController = require('../controllers/budgetController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { budgetCategoryValidator, expenseValidator, uuidParam } = require('../validators');

router.use(authenticate);

router.get('/', budgetController.getBudget);
router.post('/categories', budgetCategoryValidator, validate, budgetController.createCategory);
router.put('/categories/:id', uuidParam('id'), validate, budgetController.updateCategory);
router.delete('/categories/:id', uuidParam('id'), validate, budgetController.deleteCategory);
router.post('/expenses', expenseValidator, validate, budgetController.createExpense);
router.delete('/expenses/:id', uuidParam('id'), validate, budgetController.deleteExpense);

module.exports = router;
