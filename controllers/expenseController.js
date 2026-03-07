const { getExpenses, saveExpenses } = require('../models/expenseModel');

// GET - Fetch all expenses (with query parameter support for filtering)
exports.fetchExpenses = (req, res) => {
  const expenses = getExpenses();
  
  // Demonstrate Query Parameters from syllabus
  const { sort, limit } = req.query;
  
  let result = expenses;
  
  if (sort === 'desc') {
    result = expenses.sort((a, b) => b.amount - a.amount);
  } else if (sort === 'asc') {
    result = expenses.sort((a, b) => a.amount - b.amount);
  }
  
  if (limit) {
    result = result.slice(0, parseInt(limit));
  }
  
  // Using res.json() response method
  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
};

// GET - Fetch single expense by ID (Route Parameters from syllabus)
exports.fetchExpenseById = (req, res) => {
  const expenses = getExpenses();
  const { id } = req.params; // Route parameter
  
  const expense = expenses.find(exp => exp.id === id);
  
  if (!expense) {
    return res.status(404).json({ 
      success: false, 
      message: 'Expense not found' 
    });
  }
  
  res.status(200).json({
    success: true,
    data: expense
  });
};

// POST - Add new expense
exports.addExpense = (req, res) => {
  const expenses = getExpenses();
  const { title, amount, category, date } = req.body;

  // Request validation
  if (!title || !amount) {
    return res.status(400).json({ 
      success: false, 
      message: 'Title and Amount required' 
    });
  }

  const newExpense = { 
    id: Date.now().toString(), 
    title, 
    amount: parseFloat(amount),
    category: category || 'General',
    date: date || new Date().toISOString()
  };
  
  expenses.push(newExpense);
  saveExpenses(expenses);

  // Using res.status().json() - Response Methods from syllabus
  res.status(201).json({
    success: true,
    message: 'Expense added successfully',
    data: newExpense
  });
};

// PUT - Update expense by ID (Route Parameters)
exports.updateExpense = (req, res) => {
  const expenses = getExpenses();
  const { id } = req.params; // Route parameter from URL
  const { title, amount, category } = req.body;
  
  const expenseIndex = expenses.findIndex(exp => exp.id === id);
  
  if (expenseIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Expense not found' 
    });
  }
  
  // Update expense
  expenses[expenseIndex] = {
    ...expenses[expenseIndex],
    title: title || expenses[expenseIndex].title,
    amount: amount ? parseFloat(amount) : expenses[expenseIndex].amount,
    category: category || expenses[expenseIndex].category,
    updatedAt: new Date().toISOString()
  };
  
  saveExpenses(expenses);
  
  res.status(200).json({
    success: true,
    message: 'Expense updated successfully',
    data: expenses[expenseIndex]
  });
};

// DELETE - Delete expense by ID (Route Parameters)
exports.deleteExpense = (req, res) => {
  const expenses = getExpenses();
  const { id } = req.params; // Route parameter
  
  const expenseIndex = expenses.findIndex(exp => exp.id === id);
  
  if (expenseIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Expense not found' 
    });
  }
  
  const deletedExpense = expenses.splice(expenseIndex, 1);
  saveExpenses(expenses);
  
  res.status(200).json({
    success: true,
    message: 'Expense deleted successfully',
    data: deletedExpense[0]
  });
};