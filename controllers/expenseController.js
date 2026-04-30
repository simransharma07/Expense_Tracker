const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
  try {
    const { sort, limit, category, startDate, endDate, paymentMethod } = req.query;

    let query = { user: req.user.id };

    if (category) {
      query.category = category;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod.toLowerCase();
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    let expensesQuery = Expense.find(query);

    if (sort === 'desc') {
      expensesQuery = expensesQuery.sort('-amount');
    } else if (sort === 'asc') {
      expensesQuery = expensesQuery.sort('amount');
    } else {
      expensesQuery = expensesQuery.sort('-date');
    }

    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        expensesQuery = expensesQuery.limit(parsedLimit);
      }
    }

    const expenses = await expensesQuery;

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    console.error('GetExpenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching expenses'
    });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this expense'
      });
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error('GetExpenseById error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { category, amount, description, date, paymentMethod, tags } = req.body;

    const expense = await Expense.create({
      user: req.user.id,
      category,
      amount,
      description,
      date: date || new Date(),
      paymentMethod: paymentMethod || 'cash',
      tags: tags || []
    });

    if (req.io) {
      req.io.to(`user:${req.user.id}`).emit('expense:created', expense);
    }

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense
    });
  } catch (error) {
    console.error('AddExpense error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while adding expense'
    });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this expense'
      });
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (req.io) {
      req.io.to(`user:${req.user.id}`).emit('expense:updated', expense);
    }

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    console.error('UpdateExpense error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating expense'
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this expense'
      });
    }

    await expense.deleteOne();

    if (req.io) {
      req.io.to(`user:${req.user.id}`).emit('expense:deleted', { id: req.params.id });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('DeleteExpense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting expense'
    });
  }
};

exports.getExpenseStats = async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalExpenses = stats.reduce((sum, item) => sum + item.total, 0);

    res.status(200).json({
      success: true,
      data: {
        byCategory: stats,
        totalExpenses
      }
    });
  } catch (error) {
    console.error('GetExpenseStats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while calculating stats'
    });
  }
};
