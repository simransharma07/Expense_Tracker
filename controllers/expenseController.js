const { getExpenses, saveExpenses } = require('../models/expenseModel');

exports.fetchExpenses = (req, res) => {
  res.json(getExpenses());
};

exports.addExpense = (req, res) => {
  const expenses = getExpenses();
  const { title, amount } = req.body;

  if (!title || !amount) return res.status(400).json({ message: 'Title and Amount required' });

  const newExpense = { id: Date.now().toString(), title, amount };
  expenses.push(newExpense);
  saveExpenses(expenses);

  res.status(201).json(newExpense);
};