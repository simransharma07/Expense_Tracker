const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getExpenses } = require('../models/expenseModel');
const { 
  addExpense, 
  fetchExpenseById, 
  updateExpense, 
  deleteExpense 
} = require('../controllers/expenseController');

// Demonstrate different Routing Methods from syllabus
router.get('/', auth, (req, res) => {
  const { sort, limit, account } = req.query;
  const normalizeAccount = (value) => {
    const accountValue = String(value || '').toLowerCase();
    if (accountValue === 'cash' || accountValue === 'bank' || accountValue === 'card') return accountValue;
    return 'cash';
  };

  const requestedAccounts = String(account || '')
    .split(',')
    .map((item) => normalizeAccount(item.trim()))
    .filter((value, index, values) => value && values.indexOf(value) === index);

  let result = getExpenses().map((expense) => ({
    ...expense,
    account: normalizeAccount(expense.account)
  }));

  if (requestedAccounts.length > 0) {
    result = result.filter((expense) => requestedAccounts.includes(expense.account));
  }

  if (sort === 'desc') {
    result.sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
  } else if (sort === 'asc') {
    result.sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0));
  }

  if (limit) {
    const parsedLimit = parseInt(limit, 10);
    if (!Number.isNaN(parsedLimit) && parsedLimit >= 0) {
      result = result.slice(0, parsedLimit);
    }
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
});           // GET all expenses (supports query params: ?sort=asc&limit=5&account=cash)
router.post('/', auth, addExpense);             // POST create new expense
router.get('/:id', auth, fetchExpenseById);     // GET single expense (Route Parameters)
router.put('/:id', auth, updateExpense);        // PUT update expense (Route Parameters)
router.delete('/:id', auth, deleteExpense);     // DELETE expense (Route Parameters)

module.exports = router;