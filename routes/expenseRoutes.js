const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { fetchExpenses, addExpense } = require('../controllers/expenseController');

router.get('/', auth, fetchExpenses);
router.post('/', auth, addExpense);

module.exports = router;