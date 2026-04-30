const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const validateExpense = require('../middleware/validateExpense');
const {
  getExpenses,
  getExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/expenseController');

router.get('/', protect, getExpenses);
router.post('/', protect, validateExpense, addExpense);
router.get('/stats', protect, getExpenseStats);
router.get('/:id', protect, getExpenseById);
router.put('/:id', protect, validateExpense, updateExpense);
router.delete('/:id', protect, deleteExpense);

module.exports = router;
