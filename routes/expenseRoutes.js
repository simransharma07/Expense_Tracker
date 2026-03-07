const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
  fetchExpenses, 
  addExpense, 
  fetchExpenseById, 
  updateExpense, 
  deleteExpense 
} = require('../controllers/expenseController');

// Demonstrate different Routing Methods from syllabus
router.get('/', auth, fetchExpenses);           // GET all expenses (supports query params: ?sort=asc&limit=5)
router.post('/', auth, addExpense);             // POST create new expense
router.get('/:id', auth, fetchExpenseById);     // GET single expense (Route Parameters)
router.put('/:id', auth, updateExpense);        // PUT update expense (Route Parameters)
router.delete('/:id', auth, deleteExpense);     // DELETE expense (Route Parameters)

module.exports = router;