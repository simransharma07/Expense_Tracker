const express = require('express');
const router = express.Router();
const {
  getExpenseLogs,
  addExpenseLog,
  getExpenseLogsByCategory,
  deleteExpenseLog
} = require('../controllers/postgresController');

router.get('/pg/logs', getExpenseLogs);
router.post('/pg/logs', addExpenseLog);
router.get('/pg/logs/category/:category', getExpenseLogsByCategory);
router.delete('/pg/logs/:id', deleteExpenseLog);

module.exports = router;
