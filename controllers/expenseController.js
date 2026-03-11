const { getExpenses } = require('../models/expenseModel');


exports.fetchExpenses = (req, res) => {
  const expenses = getExpenses();
  

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
  
 
  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
};


exports.fetchExpenseById = (req, res) => {
  const expenses = getExpenses();
  const { id } = req.params; 
  
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


exports.addExpense = (req, res) => {
  res.status(405).json({
    success: false,
    message: 'Database is static. Adding expenses is disabled.'
  });
};


exports.updateExpense = (req, res) => {
  res.status(405).json({
    success: false,
    message: 'Database is static. Updating expenses is disabled.'
  });
};

exports.deleteExpense = (req, res) => {
  res.status(405).json({
    success: false,
    message: 'Database is static. Deleting expenses is disabled.'
  });
};