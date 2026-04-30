const validateExpense = (req, res, next) => {
  const { category, amount, description } = req.body;

  const errors = [];

  if (!category) {
    errors.push('Category is required');
  } else {
    const validCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];
    if (!validCategories.includes(category)) {
      errors.push(`Category must be one of: ${validCategories.join(', ')}`);
    }
  }

  if (!amount) {
    errors.push('Amount is required');
  } else {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      errors.push('Amount must be a positive number');
    }
  }

  if (!description) {
    errors.push('Description is required');
  } else if (description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }

  if (req.body.paymentMethod) {
    const validMethods = ['cash', 'bank', 'card'];
    if (!validMethods.includes(req.body.paymentMethod.toLowerCase())) {
      errors.push('Payment method must be cash, bank, or card');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = validateExpense;
